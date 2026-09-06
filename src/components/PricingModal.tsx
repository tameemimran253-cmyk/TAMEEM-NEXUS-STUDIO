import React, { useEffect } from 'react';
import {
  X,
  Check,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { audio } from '../utils/audioSystem';
import { ServiceData, PricingTier } from '../data/servicesPricingData';

interface PricingModalProps {
  service: ServiceData | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectTierForContact: (serviceId: string, tierName: string, tierPrice: string) => void;
  onOpenDemo: (service: ServiceData) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  service,
  isOpen,
  onClose,
  onSelectTierForContact,
  onOpenDemo
}) => {
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

  if (!isOpen || !service || !service.pricingTiers || service.pricingTiers.length === 0) {
    return null;
  }

  const tierCount = service.pricingTiers.length;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-7xl max-h-[94vh] overflow-y-auto bg-[#07070b] border border-white/15 rounded-3xl p-5 sm:p-8 md:p-10 shadow-[0_0_100px_rgba(168,85,247,0.25)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono-code text-purple-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span>PRODUCTION PACKAGES &bull; {service.title.toUpperCase()}</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-cinzel font-light text-white">
              {service.title} Pricing & Packages
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-light">
              Clear, transparent investment estimates engineered with production-ready standards and post-launch support.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            {service.demoId && (
              <button
                onClick={() => {
                  audio.playClick();
                  onClose();
                  onOpenDemo(service);
                }}
                className="px-4 py-2 rounded-full bg-white/5 hover:bg-purple-600/20 border border-white/15 hover:border-purple-500/40 text-xs font-syne font-semibold uppercase tracking-wider text-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => {
                audio.playClick();
                onClose();
              }}
              className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close pricing modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Pricing Grid */}
        <div
          className={`py-8 grid gap-5 ${
            tierCount === 1
              ? 'max-w-2xl mx-auto grid-cols-1'
              : tierCount === 3
              ? 'grid-cols-1 lg:grid-cols-3'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
          }`}
        >
          {service.pricingTiers.map((tier) => {
            const isHighlighted = tier.isPopular;

            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-gradient-to-b from-[#140e24] to-[#0a0714] border-2 border-purple-500/80 shadow-[0_0_35px_rgba(168,85,247,0.25)] transform xl:-translate-y-2'
                    : 'bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                {/* Most Popular Badge */}
                {isHighlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-syne font-bold text-[10px] tracking-widest uppercase shadow-[0_0_15px_rgba(236,72,153,0.5)] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>MOST POPULAR</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Tier Title */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-syne font-bold uppercase tracking-wider text-white">
                      {tier.name}
                    </h4>
                    <p className="text-[11px] text-neutral-400 min-h-[32px] font-light leading-relaxed">
                      {tier.bestFor}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="pt-2 pb-3 border-y border-white/10">
                    <div className="text-2xl sm:text-3xl font-syne font-bold text-white tracking-tight">
                      {tier.price}
                    </div>
                    {tier.priceFormatted && (
                      <span className="text-[11px] font-mono-code text-purple-300 block">
                        Estimated from {tier.priceFormatted}
                      </span>
                    )}
                    <span className="text-[10px] font-mono-code text-neutral-500 uppercase tracking-wider block mt-0.5">
                      {tier.price === 'Custom Quote' ? 'Scope-Based Quote' : 'Starting Investment'}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[10px] font-mono-code text-neutral-400 uppercase tracking-widest block">
                      PACKAGE INCLUDES:
                    </span>
                    <ul className="space-y-2 text-xs text-neutral-300">
                      {tier.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 leading-snug">
                          <Check
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isHighlighted ? 'text-pink-400' : 'text-purple-400'
                            }`}
                          />
                          <span className="font-light">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA & Note */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <button
                    onClick={() => {
                      audio.playClick();
                      onClose();
                      onSelectTierForContact(service.id, tier.name, tier.price);
                    }}
                    className={`w-full py-3 rounded-xl font-syne font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      isHighlighted
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white shadow-[0_0_25px_rgba(236,72,153,0.35)]'
                        : 'bg-white/10 hover:bg-white text-neutral-200 hover:text-black border border-white/15'
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  {tier.note && (
                    <p className="text-[10px] font-mono-code text-neutral-500 text-center leading-tight">
                      {tier.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Disclaimers & Value Strip */}
        <div className="mt-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono-code text-neutral-400">
          <div className="flex items-start gap-2.5 max-w-3xl">
            <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-neutral-300">
                Prices shown are starting estimates for standard project scopes. Final pricing depends on features, integrations, content, infrastructure, third-party services and project complexity.
              </p>
              <p className="text-[11px] text-neutral-500">
                Third-party platform, hosting, API, domain and transaction fees are billed separately where applicable.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-purple-300">
            <ShieldCheck className="w-4 h-4" />
            <span>Guaranteed Production Quality</span>
          </div>
        </div>
      </div>
    </div>
  );
};
