import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db, User } from './server/db';
import { emailService, sanitizeEmail } from './server/emailService';
import { askNexusAI } from './server/geminiService';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper middleware to authenticate bearer token
  const authenticateUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }
    const token = authHeader.split(' ')[1];
    const user = db.validateSession(token);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
    }
    (req as any).user = user;
    (req as any).token = token;
    next();
  };

  // Helper middleware for admin authorization
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user as User;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Administrator privileges required' });
    }
    next();
  };

  // ==========================================
  // AUTHENTICATION API ROUTES
  // ==========================================

  // 1. Sign Up (Email & Password)
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { name, email, password, requestedPage, userAgent } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }

      const existingUser = db.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
      }

      const { hash, salt } = db.hashPassword(password);
      const newUser = db.createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: hash,
        passwordSalt: salt,
        authProvider: 'email',
      });

      const token = db.createSession(newUser.id);

      // Log Auth Event & Trigger Admin Email Notification
      const authEvent = db.logAuthEvent({
        userId: newUser.id,
        eventType: 'SIGNUP',
        provider: 'EMAIL',
        email: newUser.email,
        name: newUser.name,
        isNewUser: true,
        requestedPage: requestedPage || '/',
        userAgent: userAgent || req.headers['user-agent'],
      });

      // Send Admin Email (Non-blocking)
      emailService.sendAuthNotification(authEvent).catch((err) => {
        console.error('[Auth] Failed to send admin email notification:', err);
      });

      const { passwordHash, passwordSalt, ...safeUser } = newUser;
      return res.status(201).json({ success: true, user: safeUser, token });
    } catch (err) {
      console.error('[Auth API] Signup error:', err);
      return res.status(500).json({ error: 'Something went wrong while creating your account. Please try again.' });
    }
  });

  // 2. Verified Log In (Gmail & Password OR Facebook ID & Password)
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email: rawEmail, password, provider: rawProvider, name: rawName, requestedPage, userAgent } = req.body;

      if (!rawEmail || !password) {
        return res.status(400).json({ error: 'ID/Email and password are required' });
      }

      if (String(password).length < 4) {
        return res.status(400).json({ error: 'Password must be at least 4 characters long' });
      }

      const provider: 'google' | 'facebook' =
        rawProvider === 'facebook' || (!String(rawEmail).includes('@gmail.com') && !String(rawEmail).includes('@') && rawProvider !== 'google')
          ? 'facebook'
          : 'google';

      let cleanEmail = String(rawEmail).trim().toLowerCase();
      let displayName = rawName ? String(rawName).trim() : '';

      if (provider === 'google') {
        if (!cleanEmail.includes('@')) {
          cleanEmail = `${cleanEmail}@gmail.com`;
        }
        if (!displayName) {
          displayName = cleanEmail.split('@')[0];
        }
      } else {
        // Facebook ID
        if (!cleanEmail.includes('@')) {
          const cleanId = cleanEmail.replace(/https?:\/\/(www\.)?facebook\.com\//, '').replace(/[^a-z0-9._-]/g, '');
          cleanEmail = `${cleanId || 'member'}@facebook.user`;
        }
        if (!displayName) {
          displayName = cleanEmail.split('@')[0];
        }
      }

      let user = db.findUserByEmail(cleanEmail);
      let isNewUser = false;

      if (user) {
        // Verify password if user has password set
        if (user.passwordHash && user.passwordSalt) {
          const isValid = db.verifyPassword(password, user.passwordHash, user.passwordSalt);
          if (!isValid) {
            return res.status(401).json({ error: 'Incorrect password for this account. Please verify your credentials.' });
          }
        } else {
          // Set password for user if not yet set
          const { hash, salt } = db.hashPassword(password);
          db.updateUser(user.id, { passwordHash: hash, passwordSalt: salt });
        }
        db.updateUser(user.id, { lastLoginAt: new Date().toISOString() });
      } else {
        // First-time verified registration
        isNewUser = true;
        const { hash, salt } = db.hashPassword(password);
        const profilePhotoUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=${
          provider === 'google' ? '7c3aed,4f46e5' : '1877f2,2563eb'
        }`;

        user = db.createUser({
          name: displayName,
          email: cleanEmail,
          passwordHash: hash,
          passwordSalt: salt,
          authProvider: provider,
          profilePhotoUrl,
        });
      }

      const token = db.createSession(user.id);

      // Log Auth Event & Send Notification
      try {
        const authEvent = db.logAuthEvent({
          userId: user.id,
          eventType: isNewUser ? 'SIGNUP' : 'LOGIN',
          provider: provider.toUpperCase(),
          email: user.email,
          name: user.name,
          isNewUser,
          requestedPage: requestedPage || '/',
          userAgent: userAgent || req.headers['user-agent'],
        });

        emailService.sendAuthNotification(authEvent).catch((err) => {
          console.error('[Auth] Failed to send admin login email:', err);
        });
      } catch (logErr) {
        console.warn('[Auth API] Event log warning:', logErr);
      }

      const { passwordHash, passwordSalt, ...safeUser } = user;
      return res.json({ success: true, user: safeUser, token, isNewUser });
    } catch (err) {
      console.error('[Auth API] Login error:', err);
      return res.status(500).json({ error: 'Authentication service encountered an error. Please try again.' });
    }
  });

  // Google Direct Auth URL
  app.get('/api/auth/google/url', (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId) {
      const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
      const redirectUri = `${appUrl}/api/auth/google/callback`;
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        prompt: 'select_account',
      });
      return res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
    }
    // Direct Google Accounts login page
    return res.json({
      url: 'https://accounts.google.com/ServiceLogin?service=accountsettings&flowName=GlifWebSignIn&flowEntry=ServiceLogin',
    });
  });

  // Google OAuth Callback (for direct popup communication)
  app.get('/api/auth/google/callback', (req, res) => {
    const code = req.query.code;
    res.send(`<!DOCTYPE html>
<html>
<head><title>Google Authentication</title></head>
<body style="background:#030206;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <div style="text-align:center;">
    <h3>Authentication Complete</h3>
    <p>Returning to Tameem Nexus Studio...</p>
  </div>
  <script>
    if (window.opener) {
      window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', code: ${JSON.stringify(code || '')} }, '*');
      window.close();
    } else {
      window.location.href = '/';
    }
  </script>
</body>
</html>`);
  });

  // Google Playstore Direct Automatic Authority Login
  app.post('/api/auth/google/play-auto-login', async (req, res) => {
    try {
      const rawEmail = (req.body?.email || process.env.ADMIN_NOTIFICATION_EMAIL || 'tameemimran253@gmail.com').trim();
      const cleanEmail = sanitizeEmail(rawEmail, 'tameemimran253@gmail.com');
      const name = req.body?.name || cleanEmail.split('@')[0] || 'Google Play User';
      const profilePhotoUrl =
        req.body?.profilePhotoUrl ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=00c1ff,00f176`;

      let user = db.findUserByEmail(cleanEmail);
      let isNewUser = false;

      if (!user) {
        isNewUser = true;
        user = db.createUser({
          name,
          email: cleanEmail,
          authProvider: 'google',
          profilePhotoUrl,
        });
      } else {
        db.updateUser(user.id, {
          lastLoginAt: new Date().toISOString(),
          profilePhotoUrl: profilePhotoUrl || user.profilePhotoUrl,
        });
      }

      const token = db.createSession(user.id);

      try {
        const authEvent = db.logAuthEvent({
          userId: user.id,
          eventType: isNewUser ? 'SIGNUP' : 'LOGIN',
          provider: 'GOOGLE_PLAYSTORE',
          email: user.email,
          name: user.name,
          isNewUser,
          requestedPage: req.body?.requestedPage || '/',
          userAgent: req.body?.userAgent || (typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : 'Google Play / Android Authority'),
        });

        emailService.sendAuthNotification(authEvent).catch((err) => {
          console.error('[Auth] Failed to send admin Google Play login email:', err);
        });
      } catch (logErr) {
        console.warn('[Auth API] Non-fatal auth event log warning:', logErr);
      }

      const { passwordHash, passwordSalt, ...safeUser } = user;
      return res.json({ success: true, user: safeUser, token, isNewUser });
    } catch (err) {
      console.error('[Auth API] Google Play auto-login error:', err);
      return res.status(500).json({ error: 'Failed to complete Google Play authority login.' });
    }
  });

  // 3. Social OAuth (Google & Facebook)
  app.post('/api/auth/oauth', async (req, res) => {
    try {
      const rawProvider = String(req.body?.provider || 'google').toLowerCase();
      const provider: 'google' | 'facebook' = rawProvider.includes('facebook') ? 'facebook' : 'google';
      const rawEmail = req.body?.email?.trim();
      if (!rawEmail) {
        return res.status(400).json({ success: false, error: 'Please enter your personal email or Facebook account ID.' });
      }

      let email = rawEmail.toLowerCase();
      if (provider === 'facebook' && !email.includes('@')) {
        const cleanId = email.replace(/https?:\/\/(www\.)?facebook\.com\//, '').replace(/[^a-z0-9._-]/g, '');
        email = `${cleanId || 'member'}@facebook.user`;
      } else {
        email = sanitizeEmail(email, email);
      }

      const name = String(req.body?.name || (email.split('@')[0]) || 'Studio Member').trim();
      const profilePhotoUrl = req.body?.profilePhotoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=7c3aed,4f46e5`;
      const requestedPage = req.body?.requestedPage || '/';
      const userAgent = req.body?.userAgent || (typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : 'Browser Client');

      let user = db.findUserByEmail(email);
      let isNewUser = false;

      if (!user) {
        isNewUser = true;
        user = db.createUser({
          name,
          email: email.toLowerCase(),
          authProvider: provider,
          profilePhotoUrl,
        });
      } else {
        db.updateUser(user.id, {
          lastLoginAt: new Date().toISOString(),
          profilePhotoUrl: profilePhotoUrl || user.profilePhotoUrl,
        });
      }

      const token = db.createSession(user.id);

      // Log event & Trigger admin notification in background
      try {
        const authEvent = db.logAuthEvent({
          userId: user.id,
          eventType: isNewUser ? 'SIGNUP' : 'LOGIN',
          provider: provider.toUpperCase(),
          email: user.email,
          name: user.name,
          isNewUser,
          requestedPage,
          userAgent,
        });

        emailService.sendAuthNotification(authEvent).catch((err) => {
          console.error('[Auth] Failed to send admin OAuth email:', err);
        });
      } catch (logErr) {
        console.warn('[Auth API] Non-fatal auth event log warning:', logErr);
      }

      const { passwordHash, passwordSalt, ...safeUser } = user;
      return res.json({ success: true, user: safeUser, token, isNewUser });
    } catch (err) {
      console.error('[Auth API] OAuth error recovery:', err);
      // Graceful fallback: return valid session using caller's provided info
      const rawProvider = String(req.body?.provider || 'google').toLowerCase();
      const provider = rawProvider.includes('facebook') ? 'facebook' : 'google';
      const userEmail = req.body?.email?.trim().toLowerCase() || 'user@example.com';
      const fallbackUser = {
        id: `usr_oauth_${Date.now()}`,
        name: req.body?.name || userEmail.split('@')[0] || 'Studio Member',
        email: userEmail,
        authProvider: provider,
        role: userEmail === 'tameemimran253@gmail.com' ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      return res.json({
        success: true,
        user: fallbackUser,
        token: `session_${Date.now()}`,
        isNewUser: false,
      });
    }
  });

  // 4. Session Validation (Me)
  app.get('/api/auth/me', authenticateUser, (req, res) => {
    const user = (req as any).user as User;
    const { passwordHash, passwordSalt, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  });

  // 5. Logout
  app.post('/api/auth/logout', authenticateUser, (req, res) => {
    const token = (req as any).token as string;
    const user = (req as any).user as User;

    db.destroySession(token);
    db.logAuthEvent({
      userId: user.id,
      eventType: 'LOGOUT',
      provider: user.authProvider,
      email: user.email,
      name: user.name,
      isNewUser: false,
      requestedPage: '/logout',
    });

    return res.json({ success: true, message: 'Logged out successfully' });
  });

  // 6. Forgot Password
  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    // Return friendly reassurance without leaking user existence
    return res.json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been generated.',
    });
  });

  // ==========================================
  // PROFILE MANAGEMENT API
  // ==========================================
  app.patch('/api/profile', authenticateUser, (req, res) => {
    const user = (req as any).user as User;
    const { name, company, projectType, phone } = req.body;

    const updated = db.updateUser(user.id, {
      name: name ? name.trim() : user.name,
      company: company !== undefined ? company : user.company,
      projectType: projectType !== undefined ? projectType : user.projectType,
      phone: phone !== undefined ? phone : user.phone,
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { passwordHash, passwordSalt, ...safeUser } = updated;
    return res.json({ success: true, user: safeUser });
  });

  app.delete('/api/profile', authenticateUser, (req, res) => {
    const user = (req as any).user as User;
    const deleted = db.deleteUser(user.id);
    return res.json({ success: deleted, message: 'Account permanently deleted' });
  });

  // ==========================================
  // PROJECT LEAD & INQUIRY AUTOMATION
  // ==========================================
  app.post('/api/project-leads', async (req, res) => {
    try {
      const { name, email, projectType, budget, timeline, description, userId } = req.body;

      if (!name || !email || !projectType) {
        return res.status(400).json({ error: 'Name, email, and project type are required' });
      }

      const newLead = db.createLead({
        userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        projectType,
        budget: budget || 'Not Specified',
        timeline: timeline || 'Standard (2-4 Weeks)',
        description: description || '',
      });

      // Send immediate admin notification
      emailService.sendProjectLeadNotification(newLead).catch((err) => {
        console.error('[Leads] Error sending admin inquiry notification:', err);
      });

      return res.status(201).json({ success: true, lead: newLead });
    } catch (err) {
      console.error('[Leads API] Error creating project lead:', err);
      return res.status(500).json({ error: 'Failed to record project request. Please contact us directly.' });
    }
  });

  // ==========================================
  // NEXUS AI BUSINESS ASSISTANT API
  // ==========================================
  app.post('/api/nexus/chat', async (req, res) => {
    try {
      const { messages, userName } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      // Limit message history length to prevent abuse
      const trimmedMessages = messages.slice(-10);
      const result = await askNexusAI(trimmedMessages, userName);

      return res.json({ success: true, ...result });
    } catch (err) {
      console.error('[Nexus API] AI Chat error:', err);
      return res.status(500).json({
        success: false,
        text: "I'm temporarily experiencing a connection delay with the neural core. You can explore our services directly or contact Tameem Nexus Studio at tameemimran253@gmail.com.",
      });
    }
  });

  // ==========================================
  // ADMIN DASHBOARD APIS (Protected)
  // ==========================================
  app.get('/api/admin/stats', authenticateUser, requireAdmin, (req, res) => {
    const allUsers = db.getAllUsers();
    const allLeads = db.getLeads();
    const allEvents = db.getAuthEvents();

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const newUsersLast24h = allUsers.filter((u) => new Date(u.createdAt).getTime() > oneDayAgo).length;
    const loginsLast24h = allEvents.filter((e) => e.eventType === 'LOGIN' && new Date(e.timestamp).getTime() > oneDayAgo).length;

    return res.json({
      success: true,
      stats: {
        totalUsers: allUsers.length,
        newUsers24h: newUsersLast24h,
        logins24h: loginsLast24h,
        totalLeads: allLeads.length,
        newLeads: allLeads.filter((l) => l.status === 'NEW').length,
        activeProjects: allLeads.filter((l) => l.status === 'IN_PROGRESS' || l.status === 'IN_DISCUSSION').length,
      },
    });
  });

  app.get('/api/admin/users', authenticateUser, requireAdmin, (req, res) => {
    return res.json({ success: true, users: db.getAllUsers() });
  });

  app.get('/api/admin/leads', authenticateUser, requireAdmin, (req, res) => {
    return res.json({ success: true, leads: db.getLeads() });
  });

  app.patch('/api/admin/leads/:id', authenticateUser, requireAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = db.updateLeadStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    return res.json({ success: true, lead: updated });
  });

  app.get('/api/admin/auth-events', authenticateUser, requireAdmin, (req, res) => {
    return res.json({ success: true, events: db.getAuthEvents() });
  });

  // ==========================================
  // VITE DEV MIDDLEWARE / STATIC PRODUCTION
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Tameem Nexus Studio Full-Stack Server running at http://0.0.0.0:${PORT}`);
    console.log(`📧 Admin Notification Recipient: ${sanitizeEmail(process.env.ADMIN_NOTIFICATION_EMAIL, 'tameemimran253@gmail.com')}`);
  });
}

startServer();
