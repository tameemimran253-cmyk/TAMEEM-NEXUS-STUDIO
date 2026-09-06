import React, { useState } from 'react';
import { X, Send, CheckCircle2, Sparkles, ShieldCheck, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audioSystem';
import { studioInfo } from '../data/studioData';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
  defaultTier?: {
    name: string;
    price: string;
  };
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultService,
  defaultTier
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    service: defaultService || 'web-dev',
    budget: defaultTier ? defaultTier.price : '₹20,000 - ₹70,000',
    timeline: 'Standard (2-4 Weeks)',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync state when opened with a new service or tier
  React.useEffect(() => {
    if (isOpen) {
      const selectedService = defaultService || 'web-dev';
      let prefilledMessage = '';
      if (defaultTier) {
        prefilledMessage = `Hi Mohammad Tameem Imran, I would like to inquire about starting a project with the ${defaultTier.name} package (${defaultTier.price}). Here are our initial project details: `;
      }
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user?.name || '',
        email: prev.email || user?.email || '',
        phone: prev.phone || user?.phone || '',
        service: selectedService,
        budget: defaultTier ? defaultTier.price : prev.budget,
        message: prefilledMessage || prev.message
      }));
      setIsSuccess(false);
    }
  }, [isOpen, defaultService, defaultTier, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    audio.playClick();
    setIsSubmitting(true);

    try {
      await fetch('/api/project-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          name: formData.name,
          email: formData.email,
          projectType: formData.service,
          budget: formData.budget,
          timeline: formData.timeline,
          description: formData.message,
        }),
      });
    } catch (err) {
      console.warn('[Contact] Server submission warning:', err);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    audio.playSuccess();
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#38bdf8', '#ffffff']
      });
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#08080c] border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_0_80px_rgba(168,85,247,0.25)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            audio.playClick();
            onClose();
          }}
          className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono-code text-purple-400 tracking-widest uppercase">
                TRANSMISSION RECEIVED
              </span>
              <h3 className="text-3xl font-serif-luxury">Message Sent to Studio.</h3>
              <p className="text-sm text-neutral-400 max-w-md mx-auto">
                Thank you, {formData.name}. Mohammad Tameem Imran will review your project requirements and connect with you shortly.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs font-mono-code text-neutral-300 max-w-md mx-auto space-y-1">
              <div>Direct: <a href={`mailto:${studioInfo.email}`} className="text-purple-400 underline">{studioInfo.email}</a></div>
              <div>Phone: <a href={`tel:${studioInfo.phoneRaw}`} className="text-purple-400 underline">{studioInfo.phone}</a></div>
            </div>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="px-8 py-3 rounded-full bg-white text-black font-syne font-bold text-xs uppercase tracking-widest hover:bg-purple-400 hover:text-white transition-all cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-code text-purple-400 tracking-widest uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>START A CONVERSATION &bull; TAMEEM NEXUS STUDIO</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif-luxury font-light">
                {studioInfo.contactHeading}
              </h2>
              <p className="text-sm text-neutral-400 mt-2 font-light">
                Reach out to discuss your website, mobile app, software automation, or AI solution.
              </p>
            </div>

            {/* Studio Quick Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono-code">
              <div className="flex items-center gap-2 text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{studioInfo.location}</span>
              </div>
              <a
                href={`tel:${studioInfo.phoneRaw}`}
                className="flex items-center gap-2 text-neutral-300 hover:text-purple-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>{studioInfo.phone}</span>
              </a>
              <a
                href={`mailto:${studioInfo.email}`}
                className="flex items-center gap-2 text-neutral-300 hover:text-purple-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{studioInfo.email}</span>
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono-code tracking-wider text-neutral-400 uppercase">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono-code tracking-wider text-neutral-400 uppercase">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. user@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono-code tracking-wider text-neutral-400 uppercase">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 ..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono-code tracking-wider text-neutral-400 uppercase">
                    Service of Interest
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#14141e] border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm"
                  >
                    <option value="web-dev">Web Development</option>
                    <option value="app-dev">App Development</option>
                    <option value="ui-ux">UI / UX Design</option>
                    <option value="automation">Software Automation</option>
                    <option value="ai-solutions">AI Solutions</option>
                    <option value="3d-motion">3D / Motion Design</option>
                    <option value="ecommerce">E-Commerce</option>
                    <option value="seo-growth">SEO & Digital Growth</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono-code tracking-wider text-neutral-400 uppercase">
                  Project Details / Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your project vision, timeline, and goals..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition-colors text-sm resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono-code text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Confidential Studio Inquiry</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black hover:bg-[#a855f7] hover:text-white font-syne font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      SENDING MESSAGE...
                    </span>
                  ) : (
                    <>
                      <span>START A CONVERSATION</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
