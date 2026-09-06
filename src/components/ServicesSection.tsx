import React, { useState } from 'react';
import {
  Globe,
  Smartphone,
  Layout,
  Workflow,
  Cpu,
  Layers,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Play,
  CreditCard,
  Bell,
  Code
} from 'lucide-react';
import { audio } from '../utils/audioSystem';
import { servicesDataFull, ServiceData, trustPoints } from '../data/servicesPricingData';

interface ServicesSectionProps {
  onOpenDemo: (service: ServiceData) => void;
  onOpenPricing: (service: ServiceData) => void;
  onOpenNotify: (service: ServiceData) => void;
  onOpenContact: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenDemo,
  onOpenPricing,
  onOpenNotify,
  onOpenContact
}) => {
  // Service Icon Helper with futuristic accents
  const getServiceIcon = (id: string, isUnavailable: boolean) => {
    switch (id) {
      case 'web-dev':
        return <Globe className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />;
      case 'app-dev':
        return <Smartphone className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />;
      case 'ui-ux':
        return <Layout className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />;
      case 'automation':
        return <Workflow className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />;
      case '3d-motion':
        return <Layers className="w-5 h-5 text-cyan-400/60" />;
      case 'ecommerce':
        return <ShoppingBag className="w-5 h-5 text-emerald-400/60" />;
      case 'seo-growth':
        return <TrendingUp className="w-5 h-5 text-indigo-400/60" />;
      case 'ai-solutions':
        return <Cpu className="w-5 h-5 text-purple-300 group-hover:scale-110 transition-transform" />;
      default:
        return <Code className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <section id="services" className="relative z-10 py-32 px-6 md:px-16 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-16 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono-code text-purple-400 uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>PRODUCTION DISCIPLINES &bull; 2026 CAPABILITIES</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-7xl font-cinzel font-light text-white leading-none">
              SERVICES &<br />SOLUTIONS.
            </h2>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 max-w-lg font-light leading-relaxed">
            High-performance web applications, native mobile ecosystems, autonomous AI workflows, and bespoke software systems crafted for conversion and scale.
          </p>
        </div>
      </div>

      {/* 8-Card Responsive Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesDataFull.map((service) => {
          const isUnavailable = service.status === 'unavailable';
          const isPrimary = service.isPrimary;

          return (
            <div
              key={service.id}
              className={`group relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-500 transform hover:-translate-y-2 ${
                isUnavailable
                  ? 'bg-white/[0.015] border border-white/5 opacity-80 hover:opacity-100 hover:border-white/15'
                  : isPrimary
                  ? 'bg-gradient-to-b from-[#110d22] via-[#090714] to-[#06050b] border border-purple-500/40 shadow-[0_0_40px_rgba(168,85,247,0.15)] hover:border-purple-500/80 hover:shadow-[0_0_60px_rgba(168,85,247,0.3)]'
                  : 'bg-white/[0.025] border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.04] shadow-[0_0_30px_rgba(0,0,0,0.5)]'
              }`}
            >
              {/* Primary Badge for App Development */}
              {isPrimary && (
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-sky-500 text-white font-syne font-bold text-[9px] uppercase tracking-widest shadow-[0_0_12px_rgba(168,85,247,0.4)] flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>HIGH DEMAND</span>
                </div>
              )}

              {/* CARD TOP & BODY (Strict Visual Hierarchy) */}
              <div className="space-y-5">
                {/* 1. ICON & NUMBER */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono-code text-purple-400 font-semibold tracking-wider">
                    {service.number}
                  </span>

                  <div
                    className={`p-3 rounded-2xl border transition-colors ${
                      isUnavailable
                        ? 'bg-white/[0.03] border-white/5 text-neutral-500'
                        : 'bg-white/5 border-white/10 group-hover:border-purple-500/40 group-hover:bg-purple-500/10'
                    }`}
                  >
                    {getServiceIcon(service.id, isUnavailable)}
                  </div>
                </div>

                {/* 2. SERVICE TITLE */}
                <div>
                  <h3
                    className={`text-xl md:text-2xl font-cinzel font-normal transition-colors ${
                      isUnavailable
                        ? 'text-neutral-300'
                        : 'text-white group-hover:text-purple-300'
                    }`}
                  >
                    {service.title}
                  </h3>
                </div>

                {/* 3. SHORT VALUE PROPOSITION / DESCRIPTION */}
                <p className="text-xs text-neutral-300 font-light leading-relaxed min-h-[56px]">
                  {service.shortDescription}
                </p>

                {/* 4. TECHNOLOGY / CAPABILITY PILLS */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {service.techTags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono-code transition-all duration-300 ${
                        isUnavailable
                          ? 'bg-white/[0.02] border border-white/5 text-neutral-500'
                          : 'bg-white/5 border border-white/10 text-neutral-300 group-hover:border-purple-500/30 group-hover:text-purple-200 group-hover:bg-purple-950/20'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CARD BOTTOM (Action Controls) */}
              <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
                {!isUnavailable ? (
                  <>
                    {/* Interactive Demo Button & Starting Price Indicator */}
                    <div className="flex items-center justify-between gap-2">
                      {service.demoId ? (
                        <button
                          onClick={() => {
                            audio.playClick();
                            onOpenDemo(service);
                          }}
                          onMouseEnter={() => audio.playHover()}
                          className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:text-purple-100 text-[11px] font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-purple-400" />
                          <span>View Demo</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono-code text-neutral-400">
                          Custom Architecture
                        </span>
                      )}

                      <div className="text-right">
                        <span className="text-[9px] font-mono-code text-neutral-400 block uppercase">
                          Starting At
                        </span>
                        <span className="text-xs font-syne font-bold text-white">
                          {service.pricingStarting || 'Custom Project'}
                        </span>
                      </div>
                    </div>

                    {/* Primary Card CTAs: View Pricing & Start Project */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {service.pricingTiers && service.pricingTiers.length > 0 ? (
                        <button
                          onClick={() => {
                            audio.playClick();
                            onOpenPricing(service);
                          }}
                          onMouseEnter={() => audio.playHover()}
                          className="py-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 text-neutral-200 hover:text-white font-syne font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                          <span>View Pricing</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            audio.playClick();
                            onOpenContact(service.id);
                          }}
                          onMouseEnter={() => audio.playHover()}
                          className="py-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 text-neutral-200 hover:text-white font-syne font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Custom Scope</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          audio.playClick();
                          onOpenContact(service.id);
                        }}
                        onMouseEnter={() => audio.playHover()}
                        className="py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white font-syne font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer"
                      >
                        <span>Start Project</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  /* Unavailable / Coming Soon Structure */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono-code">
                      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-400 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-purple-400/70" />
                        <span>CURRENTLY UNAVAILABLE</span>
                      </span>

                      <span className="text-[10px] text-purple-300 font-semibold tracking-wider uppercase">
                        COMING SOON
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        audio.playClick();
                        onOpenNotify(service);
                      }}
                      onMouseEnter={() => audio.playHover()}
                      className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/40 text-neutral-300 hover:text-white font-syne font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5 text-purple-400" />
                      <span>Notify Me</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* TRUST INFORMATION STRIP */}
      <div className="mt-16 p-8 rounded-3xl bg-[#08080f] border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-1 max-w-md">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono-code text-purple-400 uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PRODUCTION CREDIBILITY</span>
          </div>
          <h4 className="text-lg font-cinzel font-light text-white">
            Built for startups, creators, SMBs and growing digital businesses.
          </h4>
        </div>

        {/* 4 Mini Trust Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
          {trustPoints.map((point, pIdx) => (
            <div key={pIdx} className="flex items-center gap-2.5 text-xs font-mono-code text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING DISCLAIMER */}
      <div className="mt-8 p-6 rounded-2xl bg-white/[0.015] border border-white/5 text-xs font-mono-code text-neutral-400 space-y-1.5">
        <p className="text-neutral-300 leading-relaxed">
          Prices shown are starting estimates for standard project scopes. Final pricing depends on features, integrations, content, infrastructure, third-party services and project complexity.
        </p>
        <p className="text-[11px] text-neutral-500">
          Third-party platform, hosting, API, domain and transaction fees are billed separately where applicable.
        </p>
      </div>
    </section>
  );
};
