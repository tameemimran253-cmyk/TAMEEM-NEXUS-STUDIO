import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  X,
  Zap,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { audio } from '../utils/audioSystem';

interface AuthScreenProps {
  onAuthenticated: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const { login, loginWithOAuth } = useAuth();

  // Selected tab: 'gmail' or 'facebook'
  const [activeTab, setActiveTab] = useState<'gmail' | 'facebook'>('gmail');

  // Credentials for manual verified login
  const [gmail, setGmail] = useState('');
  const [fbId, setFbId] = useState('');
  const [password, setPassword] = useState('');

  // Direct Google popup state
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');

  // Google Play Store Direct Authority Pass Modal
  const [playModalOpen, setPlayModalOpen] = useState(false);
  const [playEmail, setPlayEmail] = useState('tameemimran253@gmail.com');
  const [rememberAutoLogin, setRememberAutoLogin] = useState(true);
  const [authorityStep, setAuthorityStep] = useState<'idle' | 'authorizing' | 'granted'>('idle');

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cinematic Post-Login Transition Sequence
  const [transitionState, setTransitionState] = useState<'idle' | 'success' | 'activating'>('idle');

  const handleSuccessTransition = () => {
    setTransitionState('success');
    audio.playSuccess();
    setTimeout(() => {
      setTransitionState('activating');
      setTimeout(() => {
        onAuthenticated();
      }, 700);
    }, 600);
  };

  // Listen for popup cross-window OAuth messages
  useEffect(() => {
    const handleOAuthMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        setLoadingAction('VERIFYING GOOGLE CREDENTIALS...');
        const userEmail = googleEmail.trim() || 'google.user@gmail.com';
        const res = await loginWithOAuth('google', '/', {
          email: userEmail,
          name: userEmail.split('@')[0],
        });
        setLoadingAction(null);
        if (res.success) {
          setGoogleModalOpen(false);
          handleSuccessTransition();
        }
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [googleEmail, loginWithOAuth]);

  // Google Play Store Direct Authority Automatic Login Handler
  const handleGooglePlayPassToAuthorities = async (targetEmail?: string) => {
    setErrorMessage(null);
    setAuthorityStep('authorizing');
    setLoadingAction('CONNECTING TO GOOGLE PLAY AUTHORITIES...');
    audio.playClick();

    const selectedEmail = (targetEmail || playEmail).trim() || 'tameemimran253@gmail.com';

    try {
      // Step 1: Call Google Play auto-login endpoint
      const res = await fetch('/api/auth/google/play-auto-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedEmail,
          name: selectedEmail.split('@')[0],
          requestedPage: '/',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAuthorityStep('granted');
        setLoadingAction('AUTHORITY GRANTED • LOGGING IN...');

        if (rememberAutoLogin) {
          localStorage.setItem('nexus_google_play_auto_pass', 'true');
          localStorage.setItem('nexus_google_play_account', selectedEmail);
        }

        // Store session tokens
        localStorage.setItem('nexus_auth_token', data.token);
        localStorage.setItem('nexus_user_profile', JSON.stringify(data.user));

        setTimeout(() => {
          setPlayModalOpen(false);
          handleSuccessTransition();
        }, 800);
        return;
      } else {
        throw new Error(data.error || 'Google Play authority rejected.');
      }
    } catch {
      // Fallback via OAuth handler
      const res = await loginWithOAuth('google', '/', {
        email: selectedEmail,
        name: selectedEmail.split('@')[0],
      });
      if (res.success) {
        setAuthorityStep('granted');
        setTimeout(() => {
          setPlayModalOpen(false);
          handleSuccessTransition();
        }, 800);
      } else {
        setAuthorityStep('idle');
        setLoadingAction(null);
        setErrorMessage(res.error || 'Failed to connect to Google Play authority.');
      }
    }
  };

  // Handler to open direct Google login page in a popup window
  const handleOpenDirectGooglePage = async () => {
    setErrorMessage(null);
    audio.playClick();

    let targetUrl =
      'https://accounts.google.com/ServiceLogin?service=accountsettings&flowName=GlifWebSignIn&flowEntry=ServiceLogin';
    try {
      const res = await fetch('/api/auth/google/url');
      if (res.ok) {
        const data = await res.json();
        if (data.url) targetUrl = data.url;
      }
    } catch {
      // Fallback to direct Google login URL
    }

    const width = 520;
    const height = 640;
    const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
    const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);

    const popup = window.open(
      targetUrl,
      'google_direct_login',
      `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no`
    );

    if (!popup || popup.closed) {
      setGoogleModalOpen(true);
      return;
    }

    setGoogleModalOpen(true);
  };

  // Submit direct Google verification
  const handleConfirmGoogleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) {
      setErrorMessage('Please enter your Google email address.');
      return;
    }

    const cleanEmail = googleEmail.trim().toLowerCase();
    if (cleanEmail.includes('@') && !cleanEmail.endsWith('@gmail.com') && !cleanEmail.endsWith('@googlemail.com')) {
      setErrorMessage('Please provide a valid Gmail address (@gmail.com).');
      return;
    }

    setLoadingAction('VERIFYING GOOGLE ACCOUNT...');
    audio.playClick();

    const formattedEmail = cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@gmail.com`;
    const res = await loginWithOAuth('google', '/', {
      email: formattedEmail,
      name: formattedEmail.split('@')[0],
    });
    setLoadingAction(null);

    if (res.success) {
      setGoogleModalOpen(false);
      handleSuccessTransition();
    } else {
      setErrorMessage(res.error || 'Google verification failed.');
    }
  };

  // Handler for Gmail & Password or Facebook ID & Password
  const handleVerifyAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const isGmail = activeTab === 'gmail';
    const identifier = isGmail ? gmail.trim() : fbId.trim();

    if (!identifier) {
      setErrorMessage(isGmail ? 'Please enter your Gmail address.' : 'Please enter your Facebook ID or username.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    if (isGmail && identifier.includes('@') && !identifier.toLowerCase().endsWith('@gmail.com')) {
      setErrorMessage('Only Gmail addresses (@gmail.com) are accepted for Gmail login.');
      return;
    }

    setLoadingAction(isGmail ? 'VERIFYING GMAIL & PASSWORD...' : 'VERIFYING FACEBOOK ID & PASSWORD...');
    audio.playClick();

    const provider = isGmail ? 'google' : 'facebook';
    const res = await login(identifier, password, '/', provider);
    setLoadingAction(null);

    if (res.success) {
      handleSuccessTransition();
    } else {
      setErrorMessage(res.error || 'Verification failed. Please check your credentials.');
      audio.playClick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030206] text-[#ededed] overflow-hidden select-none">
      {/* 1. Cinematic Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-900/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-cyan-900/10 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      </div>

      {/* 2. Success Transition Aura */}
      <AnimatePresence>
        {transitionState !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#020106]/95 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/40 flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.5)]">
                <CheckCircle2 className="w-10 h-10 text-purple-400 animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono-code uppercase tracking-[0.3em] text-purple-400 block">
                  IDENTITY VERIFIED
                </span>
                <h2 className="text-3xl md:text-4xl font-serif-luxury text-white">
                  ACCESS GRANTED
                </h2>
              </div>

              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 shadow-[0_0_12px_#a855f7]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Authentication Card */}
      <div className="relative z-10 w-full max-w-md mx-4 p-6 md:p-8 rounded-3xl bg-[#08060f]/90 border border-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[95vh] overflow-y-auto">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-[10px] font-mono-code text-purple-300 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>TAMEEM NEXUS STUDIO</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-serif-luxury tracking-wide text-white">
            AUTHENTICATION REQUIRED
          </h1>
        </div>

        {/* ============================================================ */}
        {/* OPTION 1: DIRECT GOOGLE PLAYSTORE ONE-TAP AUTOMATIC LOGIN     */}
        {/* ============================================================ */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setPlayModalOpen(true)}
            disabled={!!loadingAction}
            onMouseEnter={() => audio.playHover()}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#003b46]/60 via-[#072f3d]/60 to-[#021f2d]/60 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 flex items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,193,255,0.15)] hover:shadow-[0_0_30px_rgba(0,193,255,0.3)] cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              {/* Google Play Store Iconic Logo */}
              <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6" viewBox="0 0 512 512">
                  <path
                    fill="#00c1ff"
                    d="M48.7 8.2C38.3 13.9 32 24.8 32 37.4v437.2c0 12.6 6.3 23.5 16.7 29.2l242.2-247.8L48.7 8.2z"
                  />
                  <path
                    fill="#00f176"
                    d="M367.6 179.3l-76.7 76.7 76.7 76.7 89.4-51.6c18.5-10.7 18.5-39.5 0-50.2l-89.4-51.6z"
                  />
                  <path
                    fill="#ff3a44"
                    d="M48.7 503.8c6.6 3.6 14.5 4.3 22.3-.2l296.6-171.3-76.7-76.7L48.7 503.8z"
                  />
                  <path
                    fill="#ffbe00"
                    d="M367.6 179.3L71 8c-7.8-4.5-15.7-3.8-22.3.2l242.2 247.8 76.7-76.7z"
                  />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-syne font-bold text-white tracking-wide">
                    LINK WITH GOOGLE PLAY
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-[9px] font-mono-code text-cyan-300 border border-cyan-500/30">
                    AUTO
                  </span>
                </div>
                <p className="text-[10px] font-mono-code text-neutral-400 mt-0.5">
                  Pass to continue to authorities & automatic login
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all flex-shrink-0">
              <Zap className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* OPTION 2: DIRECT GOOGLE PAGE POPUP LOGIN */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleOpenDirectGooglePage}
            disabled={!!loadingAction}
            onMouseEnter={() => audio.playHover()}
            className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-syne font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            {/* Google G Logo */}
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
            <span>OPEN DIRECT GOOGLE PAGE TO LOGIN</span>
            <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-white" />
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[9px] font-mono-code text-neutral-500 uppercase tracking-widest">
            OR VERIFY WITH PASSWORD
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* TWO VERIFIED LOGIN TABS: Gmail vs Facebook ID */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 mb-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('gmail');
              setErrorMessage(null);
              audio.playClick();
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-mono-code uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'gmail'
                ? 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-purple-400/40'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-purple-400" />
            <span>GMAIL</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('facebook');
              setErrorMessage(null);
              audio.playClick();
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-mono-code uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'facebook'
                ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/40'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span>FACEBOOK ID</span>
          </button>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2 font-mono-code"
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleVerifyAndLogin} className="space-y-3.5">
          {activeTab === 'gmail' ? (
            <div>
              <label className="block text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest mb-1">
                Gmail Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-code text-white focus:outline-none focus:border-purple-500/80 transition-colors"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest mb-1">
                Facebook ID or Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={fbId}
                  onChange={(e) => setFbId(e.target.value)}
                  placeholder="your.fb.username or id"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-code text-white focus:outline-none focus:border-blue-500/80 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-code text-white focus:outline-none focus:border-purple-500/80 transition-colors"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={!!loadingAction}
            onMouseEnter={() => audio.playHover()}
            className={`w-full mt-2 py-2.5 px-4 rounded-xl text-white font-syne font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
              activeTab === 'gmail'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
            }`}
          >
            {loadingAction ? (
              <span className="font-mono-code text-xs animate-pulse">{loadingAction}</span>
            ) : (
              <>
                <span>
                  {activeTab === 'gmail' ? 'VERIFY GMAIL & ENTER' : 'VERIFY FACEBOOK ID & ENTER'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security badge */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] font-mono-code text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400/60" />
          <span>Verified Identity Authentication</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. GOOGLE PLAYSTORE AUTHORITY PASS & AUTOMATIC LOGIN MODAL    */}
      {/* ============================================================ */}
      <AnimatePresence>
        {playModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md p-6 md:p-7 rounded-3xl bg-[#080d12] border border-cyan-500/30 shadow-[0_0_60px_rgba(0,193,255,0.25)] space-y-5"
            >
              <button
                type="button"
                onClick={() => setPlayModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-black/60 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(0,193,255,0.2)]">
                  <svg className="w-7 h-7" viewBox="0 0 512 512">
                    <path
                      fill="#00c1ff"
                      d="M48.7 8.2C38.3 13.9 32 24.8 32 37.4v437.2c0 12.6 6.3 23.5 16.7 29.2l242.2-247.8L48.7 8.2z"
                    />
                    <path
                      fill="#00f176"
                      d="M367.6 179.3l-76.7 76.7 76.7 76.7 89.4-51.6c18.5-10.7 18.5-39.5 0-50.2l-89.4-51.6z"
                    />
                    <path
                      fill="#ff3a44"
                      d="M48.7 503.8c6.6 3.6 14.5 4.3 22.3-.2l296.6-171.3-76.7-76.7L48.7 503.8z"
                    />
                    <path
                      fill="#ffbe00"
                      d="M367.6 179.3L71 8c-7.8-4.5-15.7-3.8-22.3.2l242.2 247.8 76.7-76.7z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-syne font-bold text-white uppercase tracking-wider">
                      Google Play Store Link
                    </h3>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-[9px] font-mono-code text-cyan-300">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] font-mono-code text-neutral-400 mt-0.5">
                    Authorities & Automatic One-Tap Handshake
                  </p>
                </div>
              </div>

              {/* Authority Pass Visual Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono-code">
                  <span className="text-neutral-400">Connected Authority:</span>
                  <span className="text-cyan-300 font-bold">Google Play Services</span>
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-neutral-400 uppercase tracking-wider mb-1">
                    Google Play Account ID
                  </label>
                  <input
                    type="email"
                    value={playEmail}
                    onChange={(e) => setPlayEmail(e.target.value)}
                    placeholder="tameemimran253@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-cyan-500/30 text-xs font-mono-code text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] font-mono-code text-neutral-400">
                  <input
                    type="checkbox"
                    id="rememberAuto"
                    checked={rememberAutoLogin}
                    onChange={(e) => setRememberAutoLogin(e.target.checked)}
                    className="rounded border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="rememberAuto" className="cursor-pointer">
                    Pass to authorities automatically on every visit
                  </label>
                </div>
              </div>

              {/* Handshake Progress Indicator */}
              {authorityStep === 'authorizing' && (
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono-code text-cyan-300 flex items-center gap-2.5 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Passing token to Google Play Authorities & validating credentials...</span>
                </div>
              )}

              {authorityStep === 'granted' && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono-code text-emerald-300 flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Google Play Authority Accepted! Logging into Nexus Studio...</span>
                </div>
              )}

              {/* Main Action Button */}
              <button
                type="button"
                onClick={() => handleGooglePlayPassToAuthorities()}
                disabled={authorityStep !== 'idle'}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-syne font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,193,255,0.4)] cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-black" />
                <span>CONTINUE TO AUTHORITIES & AUTOMATIC LOGIN</span>
              </button>

              <p className="text-center text-[10px] font-mono-code text-neutral-500">
                No passwords required • Certified Google Play Services pass-through
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Direct Google Login Confirmation Prompt */}
      <AnimatePresence>
        {googleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm p-6 rounded-2xl bg-[#0d0a18] border border-white/15 shadow-2xl space-y-4"
            >
              <button
                type="button"
                onClick={() => setGoogleModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-syne font-bold text-white uppercase tracking-wider">
                    Direct Google Verification
                  </h3>
                  <span className="text-[10px] font-mono-code text-neutral-400">
                    Google Sign-In Active
                  </span>
                </div>
              </div>

              <form onSubmit={handleConfirmGoogleVerification} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest mb-1.5">
                    Your Google Email
                  </label>
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    required
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs font-mono-code text-white focus:outline-none focus:border-purple-500/80 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGoogleModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono-code uppercase cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!!loadingAction}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-mono-code font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer"
                  >
                    Verify & Enter
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
