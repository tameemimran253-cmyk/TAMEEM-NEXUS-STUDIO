import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { sanitizeEmail } from './utils';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  passwordSalt?: string;
  authProvider: 'google' | 'facebook' | 'email' | 'guest';
  profilePhotoUrl?: string;
  company?: string;
  projectType?: string;
  phone?: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthEvent {
  id: string;
  userId: string;
  eventType: 'SIGNUP' | 'LOGIN' | 'LOGOUT' | 'PASSWORD_RESET' | 'EMAIL_VERIFIED';
  provider: string;
  email: string;
  name: string;
  timestamp: string;
  isNewUser: boolean;
  requestedPage: string;
  userAgent?: string;
}

export interface ProjectLead {
  id: string;
  userId?: string;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  status: 'NEW' | 'CONTACTED' | 'IN_DISCUSSION' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
  createdAt: string;
}

interface DatabaseSchema {
  users: User[];
  authEvents: AuthEvent[];
  projectLeads: ProjectLead[];
  sessions: { token: string; userId: string; expiresAt: number }[];
}

const DB_FILE = path.join(process.cwd(), 'data-store.json');

class Database {
  private data: DatabaseSchema = {
    users: [],
    authEvents: [],
    projectLeads: [],
    sessions: [],
  };

  constructor() {
    this.load();
    this.initAdmin();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[DB] Could not load data-store.json, initializing fresh store', err);
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Failed to save data-store.json', err);
    }
  }

  private initAdmin() {
    const adminEmail = sanitizeEmail(process.env.ADMIN_NOTIFICATION_EMAIL, 'tameemimran253@gmail.com');
    
    // Auto-fix any previously stored admin user email that had accidental spaces
    const existingAdmin = this.data.users.find(
      (u) => u.id === 'usr_admin_nexus' || sanitizeEmail(u.email) === adminEmail
    );
    if (existingAdmin) {
      if (existingAdmin.email !== adminEmail) {
        existingAdmin.email = adminEmail;
        this.save();
      }
      return;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync('AdminNexus2026!', salt, 64).toString('hex');
    this.data.users.push({
      id: 'usr_admin_nexus',
      name: 'Tameem Imran (Founder)',
      email: adminEmail,
      passwordHash: hash,
      passwordSalt: salt,
      authProvider: 'email',
      role: 'admin',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    });
    this.save();
  }

  // Password hashing utility
  public hashPassword(password: string): { hash: string; salt: string } {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return { hash, salt };
  }

  public verifyPassword(password: string, hash: string, salt: string): boolean {
    const computed = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  }

  // User methods
  public findUserByEmail(email: string): User | undefined {
    const clean = sanitizeEmail(email);
    return this.data.users.find((u) => sanitizeEmail(u.email) === clean);
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLoginAt' | 'role'> & { role?: 'admin' | 'user' }): User {
    const adminEmail = sanitizeEmail(process.env.ADMIN_NOTIFICATION_EMAIL, 'tameemimran253@gmail.com');
    const cleanUserEmail = sanitizeEmail(userData.email);
    const isOwner = cleanUserEmail === adminEmail;

    const newUser: User = {
      ...userData,
      email: cleanUserEmail,
      id: `usr_${crypto.randomBytes(8).toString('hex')}`,
      role: isOwner ? 'admin' : (userData.role || 'user'),
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): User | undefined {
    const userIndex = this.data.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return undefined;

    this.data.users[userIndex] = {
      ...this.data.users[userIndex],
      ...updates,
    };
    this.save();
    return this.data.users[userIndex];
  }

  public deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter((u) => u.id !== id);
    this.data.sessions = this.data.sessions.filter((s) => s.userId !== id);
    this.save();
    return this.data.users.length < initialLen;
  }

  public getAllUsers(): User[] {
    return this.data.users.map(({ passwordHash, passwordSalt, ...safeUser }) => safeUser as User);
  }

  // Session handling
  public createSession(userId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    this.data.sessions.push({ token, userId, expiresAt });
    this.save();
    return token;
  }

  public validateSession(token: string): User | null {
    const session = this.data.sessions.find((s) => s.token === token && s.expiresAt > Date.now());
    if (!session) return null;
    return this.findUserById(session.userId) || null;
  }

  public destroySession(token: string): void {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.save();
  }

  // Auth Event Logging
  public logAuthEvent(event: Omit<AuthEvent, 'id' | 'timestamp'>): AuthEvent {
    const newEvent: AuthEvent = {
      ...event,
      id: `evt_${crypto.randomBytes(8).toString('hex')}`,
      timestamp: new Date().toISOString(),
    };
    this.data.authEvents.unshift(newEvent);
    // Keep max 500 events
    if (this.data.authEvents.length > 500) {
      this.data.authEvents = this.data.authEvents.slice(0, 500);
    }
    this.save();
    return newEvent;
  }

  public getAuthEvents(): AuthEvent[] {
    return this.data.authEvents;
  }

  // Project Leads
  public createLead(leadData: Omit<ProjectLead, 'id' | 'status' | 'createdAt'>): ProjectLead {
    const newLead: ProjectLead = {
      ...leadData,
      id: `lead_${crypto.randomBytes(6).toString('hex')}`,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };
    this.data.projectLeads.unshift(newLead);
    this.save();
    return newLead;
  }

  public getLeads(): ProjectLead[] {
    return this.data.projectLeads;
  }

  public updateLeadStatus(id: string, status: ProjectLead['status']): ProjectLead | undefined {
    const lead = this.data.projectLeads.find((l) => l.id === id);
    if (lead) {
      lead.status = status;
      this.save();
    }
    return lead;
  }
}

export const db = new Database();
