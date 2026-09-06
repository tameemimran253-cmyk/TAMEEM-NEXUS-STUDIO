import React, { useState, useEffect } from 'react';
import { X, Bell, CheckCircle2, Send, Clock, Sparkles } from 'lucide-react';
import { audio } from '../utils/audioSystem';
import { ServiceData } from '../data/servicesPricingData';

interface NotifyMeModalProps {
  service: ServiceData | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: (serviceId: string) => void;
}

export const NotifyMeModal: React.FC<NotifyMeModalProps> = ({
  service,
  isOpen,
  onClose,
  onOpenContact
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setEmail('');
    }
  }, [isOpen]);

  // ESC key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !service) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    audio.playClick();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      audio.playChime();
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0a0a10] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(168,85,247,0.2)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            audio.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono-code text-purple-300 uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5" />
              <span>UPCOMING SERVICE CAPACITY &bull; {service.number}</span>
            </div>

            <h3 className="text-2xl font-cinzel font-light text-white">
              {service.title}
            </h3>

            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              {service.shortDescription}
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <span className="text-xs font-mono-code text-neutral-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Get Early Priority Access
                </span>
                <p className="text-[11px] text-neutral-400">
                  Enter your email address to receive immediate priority notification when new production slots open for {service.title}.
                </p>

                <div className="pt-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 focus:border-purple-500 text-xs font-mono-code text-white placeholder-neutral-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-syne font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.3)] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Notify Me When Available</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    audio.playClick();
                    onClose();
                    onOpenContact(service.id);
                  }}
                  className="text-[11px] font-mono-code text-neutral-400 hover:text-purple-300 underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Have an urgent project requirement? Discuss custom timeline &rarr;
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-syne font-bold text-white">
                You're on the priority list!
              </h4>
              <p className="text-xs text-neutral-300 font-light max-w-sm mx-auto">
                We'll notify <strong>{email}</strong> the moment new client slots are released for {service.title}.
              </p>

              <button
                onClick={() => {
                  audio.playClick();
                  onClose();
                }}
                className="mt-4 px-6 py-2.5 rounded-full bg-white text-black text-xs font-syne font-bold uppercase tracking-wider hover:bg-purple-400 hover:text-white transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
