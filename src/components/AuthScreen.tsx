import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { audio } from '../utils/audioSystem';

interface AuthScreenProps {
  onAuthenticated: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const { login, signup, loginWithOAuth, continueAsGuest } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === 'forgot') {
      if (!email) {
        setErrorMessage('Please enter your email address.');
        return;
      }
      setLoadingAction('SENDING RESET LINK...');
      try {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setSuccessMessage(data.message || 'Password reset link sent to your inbox.');
      } catch (err) {
        setErrorMessage('Could not connect to authentication services.');
      } finally {
        setLoadingAction(null);
      }
      return;
    }

    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup' && !name) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (mode === 'signup') {
      setLoadingAction('CREATING NEXUS ACCOUNT...');
      const res = await signup(name, email, password);
      setLoadingAction(null);
      if (res.success) {
        handleSuccessTransition();
      } else {
        setErrorMessage(res.error || 'Account creation failed. Please try again.');
        audio.playClick();
      }
    } else {
      setLoadingAction('AUTHENTICATING...');
      const res = await login(email, password);
      setLoadingAction(null);
      if (res.success) {
        handleSuccessTransition();
      } else {
        setErrorMessage(res.error || 'Invalid credentials.');
        audio.playClick();
      }
    }
  };

  const handleOAuthLogin = async (
    provider: 'google' | 'facebook',
    customDetails?: { name?: string; email?: string }
  ) => {
    setErrorMessage(null);
    setLoadingAction(provider === 'google' ? 'AUTHENTICATING WITH GOOGLE...' : 'AUTHENTICATING WITH FACEBOOK...');
    audio.playClick();

    const info = customDetails || {
      name: 'Tameem Imran',
      email: provider === 'google' ? 'tameemimran253@gmail.com' : 'tameem.imran@facebook.com',
    };

    const res = await loginWithOAuth(provider, '/', info);
    setLoadingAction(null);

    if (res.success) {
      handleSuccessTransition();
    } else {
      setErrorMessage(res.error || `Could not sign in with ${provider}.`);
    }
  };

  const handleGuestEntry = async () => {
    setErrorMessage(null);
    setLoadingAction('ENTERING PORTAL AS GUEST...');
    audio.playClick();
    const res = await continueAsGuest();
    setLoadingAction(null);
    if (res.success) {
      handleSuccessTransition();
    } else {
      setErrorMessage('Could not initialize guest session.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030206] text-[#ededed] overflow-hidden select-none">
      {/* 1. Cinematic Ambient Background Glows & Particles */}
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
                  AUTHENTICATED
                </span>
                <h2 className="text-3xl md:text-4xl font-serif-luxury text-white">
                  ACTIVATING NEXUS PORTAL
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
      <div className="relative z-10 w-full max-w-md mx-4 p-7 md:p-9 rounded-3xl bg-[#08060f]/90 border border-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-[10px] font-mono-code text-purple-300 uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>TAMEEM NEXUS STUDIO</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-serif-luxury tracking-wide text-white">
            WELCOME TO THE NEXUS
          </h1>

          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            Sign in to explore Tameem Nexus Studio and discover our digital, automation, and AI solutions.
          </p>
        </div>

        {/* Error / Success feedback */}
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

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 font-mono-code"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}

        {/* OAuth Social Buttons */}
        <div className="space-y-2.5 mb-5">
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            disabled={!!loadingAction}
            onMouseEnter={() => audio.playHover()}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-mono-code uppercase tracking-wider text-neutral-200 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>CONTINUE WITH GOOGLE</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('facebook')}
            disabled={!!loadingAction}
            onMouseEnter={() => audio.playHover()}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-mono-code uppercase tracking-wider text-neutral-200 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>CONTINUE WITH FACEBOOK</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-[1px] flex-1 bg-white/10" />
          <span className="text-[10px] font-mono-code text-neutral-500 uppercase tracking-widest">
            OR WITH EMAIL
          </span>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mohammad Tameem"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-code text-white focus:outline-none focus:border-purple-500/80 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-code text-white focus:outline-none focus:border-purple-500/80 transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage(null);
                    }}
                    className="text-[10px] font-mono-code text-purple-400 hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-code text-white focus:outline-none focus:border-purple-500/80 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!!loadingAction}
            onMouseEnter={() => audio.playHover()}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-syne font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loadingAction ? (
              <span className="font-mono-code text-xs animate-pulse">{loadingAction}</span>
            ) : (
              <>
                <span>
                  {mode === 'signup' ? 'CREATE ACCOUNT & ENTER' : mode === 'forgot' ? 'SEND RESET LINK' : 'SIGN IN'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle (Login vs Signup) */}
        <div className="mt-5 text-center text-xs font-mono-code text-neutral-400 flex items-center justify-center gap-2">
          {mode === 'login' ? (
            <>
              <span>New to the Studio?</span>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                  audio.playClick();
                }}
                className="text-purple-400 font-bold hover:underline cursor-pointer"
              >
                SIGN UP
              </button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  audio.playClick();
                }}
                className="text-purple-400 font-bold hover:underline cursor-pointer"
              >
                LOG IN
              </button>
            </>
          )}
        </div>

        {/* Security / Privacy Badge & Guest Exploration */}
        <div className="mt-5 pt-4 border-t border-white/5 flex flex-col items-center justify-center gap-3 text-[10px] font-mono-code text-neutral-500">
          <button
            type="button"
            onClick={handleGuestEntry}
            disabled={!!loadingAction}
            onMouseEnter={() => audio.playHover()}
            className="w-full py-2 px-3 rounded-lg bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20 text-purple-300 hover:text-purple-200 text-[11px] font-mono-code uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>ENTER AS GUEST EXPLORER</span>
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400/60" />
            <span>Encrypted Session &bull; Safe Lead Automation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
