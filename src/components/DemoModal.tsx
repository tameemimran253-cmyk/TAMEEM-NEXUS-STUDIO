import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Sparkles,
  Smartphone,
  Monitor,
  Laptop,
  Play,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Send,
  Zap,
  ShoppingBag,
  Bell,
  User,
  Heart,
  TrendingUp,
  Activity,
  Layers,
  Database,
  Terminal,
  Workflow
} from 'lucide-react';
import { audio } from '../utils/audioSystem';
import { ServiceData } from '../data/servicesPricingData';

interface DemoModalProps {
  service: ServiceData | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPricing: (service: ServiceData) => void;
  onOpenContact: (serviceId: string) => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({
  service,
  isOpen,
  onClose,
  onOpenPricing,
  onOpenContact
}) => {
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');
  const [activeAppTab, setActiveAppTab] = useState<'home' | 'product' | 'cart' | 'profile'>('home');
  const [automationStep, setAutomationStep] = useState<number>(0);
  const [isSimulatingLead, setIsSimulatingLead] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiQueryOutput, setAiQueryOutput] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Reset states on open
  useEffect(() => {
    if (isOpen) {
      setAutomationStep(0);
      setIsSimulatingLead(false);
      setAiQueryOutput(null);
    }
  }, [isOpen]);

  // Handle ESC key
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

  const handleSimulateAutomation = () => {
    audio.playClick();
    setIsSimulatingLead(true);
    setAutomationStep(1);

    const interval = setInterval(() => {
      setAutomationStep((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          setIsSimulatingLead(false);
          return 6;
        }
        return prev + 1;
      });
    }, 650);
  };

  const handleRunAiInsight = (prompt: string) => {
    audio.playClick();
    setIsGeneratingAi(true);
    setAiPromptInput(prompt);

    setTimeout(() => {
      setIsGeneratingAi(false);
      if (prompt.includes('Retention') || prompt.includes('retention')) {
        setAiQueryOutput(
          'Analysis Complete: Cohort retention is up +18.4% MoM following v2.4 onboarding redesign. Highest converting vector: Enterprise Team Invites (42% conversion).'
        );
      } else if (prompt.includes('Revenue') || prompt.includes('revenue')) {
        setAiQueryOutput(
          'Revenue Forecast: Projected ARR for Q4 is $1.42M (+34% growth). Primary growth catalyst: Autonomous workflow add-on adopted by 68% of active accounts.'
        );
      } else {
        setAiQueryOutput(
          'Intelligence Synthesis: Core system health optimal. 99.98% API uptime with sub-45ms inference latency across 14 global edge clusters.'
        );
      }
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#07070b] border border-white/15 rounded-3xl p-5 sm:p-8 md:p-10 shadow-[0_0_90px_rgba(168,85,247,0.3)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono-code text-purple-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span>INTERACTIVE AGENCY DEMO &bull; {service.title}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-cinzel font-light text-white">
              {service.demoName || `${service.title} Experience`}
            </h3>
            <p className="text-xs font-mono-code text-neutral-400">
              {service.demoTagline}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {service.pricingTiers && service.pricingTiers.length > 0 && (
              <button
                onClick={() => {
                  audio.playClick();
                  onClose();
                  onOpenPricing(service);
                }}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-purple-600/30 border border-white/20 hover:border-purple-500/50 text-xs font-syne font-semibold uppercase tracking-wider text-purple-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Pricing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => {
                audio.playClick();
                onClose();
              }}
              className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close demo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* DEMO CONTENT ACCORDING TO SERVICE TYPE */}
        <div className="py-6 space-y-6">
          {/* ========================================================
              1. WEB DEVELOPMENT DEMO: NOVA — AI SaaS Platform
              ======================================================== */}
          {service.id === 'web-dev' && (
            <div className="space-y-4">
              {/* Browser Preview Window */}
              <div className="rounded-2xl bg-[#0d0d14] border border-white/15 overflow-hidden shadow-2xl">
                {/* Browser Top Chrome */}
                <div className="px-4 py-3 bg-[#13131f] border-b border-white/10 flex items-center justify-between text-xs font-mono-code text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="hidden sm:inline-block ml-2 text-neutral-500 text-[11px]">
                      https://nova-platform.tameemnexus.dev
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-md text-[10px] text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Next.js 14 &bull; 60 FPS</span>
                    </div>

                    <div className="flex items-center gap-1 bg-black/30 p-1 rounded-lg">
                      <button
                        onClick={() => setActiveTab('desktop')}
                        className={`p-1.5 rounded ${
                          activeTab === 'desktop' ? 'bg-purple-500/30 text-white' : 'text-neutral-500 hover:text-white'
                        }`}
                        title="Desktop View"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setActiveTab('mobile')}
                        className={`p-1.5 rounded ${
                          activeTab === 'mobile' ? 'bg-purple-500/30 text-white' : 'text-neutral-500 hover:text-white'
                        }`}
                        title="Mobile View"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Simulated Web Application */}
                <div
                  className={`p-6 bg-gradient-to-b from-[#090912] to-[#040408] transition-all duration-300 ${
                    activeTab === 'mobile' ? 'max-w-sm mx-auto my-4 border border-white/10 rounded-2xl shadow-xl' : ''
                  }`}
                >
                  {/* SaaS Header */}
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-sky-400 flex items-center justify-center font-syne font-bold text-xs">
                        N
                      </div>
                      <span className="font-syne font-bold text-sm tracking-wider text-white">
                        NOVA AI
                      </span>
                    </div>

                    <div className="hidden md:flex items-center gap-4 text-xs font-mono-code text-neutral-400">
                      <span className="text-white">Dashboard</span>
                      <span>Pipelines</span>
                      <span>Analytics</span>
                      <span>API Docs</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono-code border border-purple-500/30">
                        PRO PLAN
                      </span>
                    </div>
                  </div>

                  {/* Main SaaS Body Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                    {/* Metric 1 */}
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="text-[10px] font-mono-code text-neutral-400 uppercase">
                        Real-Time Ingestion
                      </span>
                      <div className="text-2xl font-syne font-bold text-white flex items-baseline gap-2">
                        <span>1.48M</span>
                        <span className="text-xs text-emerald-400 font-normal">+24.8%</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 block">Events Processed / sec</span>
                    </div>

                    {/* Metric 2 */}
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="text-[10px] font-mono-code text-neutral-400 uppercase">
                        Inference Latency
                      </span>
                      <div className="text-2xl font-syne font-bold text-sky-400 flex items-baseline gap-2">
                        <span>42ms</span>
                        <span className="text-xs text-purple-300 font-normal">Edge Cached</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 block">Global p99 response</span>
                    </div>

                    {/* Metric 3 */}
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="text-[10px] font-mono-code text-neutral-400 uppercase">
                        AI Accuracy Index
                      </span>
                      <div className="text-2xl font-syne font-bold text-purple-300 flex items-baseline gap-2">
                        <span>99.4%</span>
                        <span className="text-xs text-emerald-400 font-normal">Verified</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 block">Autonomous accuracy</span>
                    </div>
                  </div>

                  {/* Interactive Query Assistant in Preview */}
                  <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-black/60 border border-purple-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-code text-purple-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        Interactive AI Assistant Query
                      </span>
                      <span className="text-[10px] font-mono-code text-neutral-500">Live Simulation</span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs font-mono-code">
                      <button
                        onClick={() => handleRunAiInsight('Analyze Q3 user retention metrics')}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 text-neutral-300 transition-colors"
                      >
                        ⚡ Retention Analysis
                      </button>
                      <button
                        onClick={() => handleRunAiInsight('Forecast Q4 recurring revenue growth')}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 text-neutral-300 transition-colors"
                      >
                        📈 Revenue Forecast
                      </button>
                      <button
                        onClick={() => handleRunAiInsight('Synthesize global cluster performance')}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 text-neutral-300 transition-colors"
                      >
                        🌐 Edge Cluster Health
                      </button>
                    </div>

                    {isGeneratingAi && (
                      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-mono-code text-purple-300 flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                        <span>Querying simulated edge database...</span>
                      </div>
                    )}

                    {aiQueryOutput && !isGeneratingAi && (
                      <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs font-mono-code text-purple-200 animate-in fade-in">
                        {aiQueryOutput}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              2. APP DEVELOPMENT DEMO: ORBIT — Mobile Commerce App
              ======================================================== */}
          {service.id === 'app-dev' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Phone Mockup Frame */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="relative w-[290px] sm:w-[320px] h-[580px] rounded-[42px] bg-[#000000] border-[5px] border-[#22222e] shadow-[0_0_60px_rgba(56,189,248,0.25)] p-3 flex flex-col justify-between overflow-hidden">
                  {/* Dynamic Island / Speaker */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-black border border-white/10 flex items-center justify-between px-3 z-30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[9px] font-mono-code text-neutral-400">ORBIT</span>
                  </div>

                  {/* Inner Screen Content */}
                  <div className="w-full h-full rounded-[34px] bg-[#090912] pt-8 pb-3 px-4 flex flex-col justify-between overflow-y-auto text-white">
                    {/* Top App Bar */}
                    <div className="flex items-center justify-between pt-2 pb-3 border-b border-white/10">
                      <div>
                        <span className="text-[10px] font-mono-code text-sky-400 block">DISCOVER</span>
                        <h4 className="text-sm font-syne font-bold">ORBIT TECH</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveAppTab('cart')}
                          className="relative p-1.5 rounded-full bg-white/10 text-white"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-sky-400" />
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-sky-500 text-black text-[9px] font-bold flex items-center justify-center">
                            2
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* App Screen Switcher */}
                    {activeAppTab === 'home' && (
                      <div className="space-y-3 py-2 animate-in fade-in">
                        {/* Hero Banner */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-900/60 to-purple-900/40 border border-sky-500/30 space-y-1">
                          <span className="text-[9px] font-mono-code text-sky-300">SPATIAL HARDWARE</span>
                          <h5 className="text-xs font-syne font-bold">Orbit Spatial Lens X1</h5>
                          <p className="text-[10px] text-neutral-300">Ultra-light holographic wearable.</p>
                          <div className="pt-1 text-xs font-bold text-sky-400">₹42,999</div>
                        </div>

                        {/* Product Cards */}
                        <div className="space-y-2">
                          <span className="text-[10px] font-mono-code text-neutral-400">POPULAR GEAR</span>
                          <div
                            onClick={() => setActiveAppTab('product')}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-sky-500/40 cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <div className="text-xs font-semibold">Nexus Neural Pods</div>
                              <div className="text-[10px] text-neutral-400">Lossless Spatial Audio</div>
                            </div>
                            <span className="text-xs font-bold text-sky-300">₹14,499</span>
                          </div>

                          <div
                            onClick={() => setActiveAppTab('product')}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-sky-500/40 cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <div className="text-xs font-semibold">Quantum Core Tracker</div>
                              <div className="text-[10px] text-neutral-400">Biometric Haptic Ring</div>
                            </div>
                            <span className="text-xs font-bold text-sky-300">₹9,999</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeAppTab === 'product' && (
                      <div className="space-y-3 py-2 animate-in fade-in">
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-sky-500/30 text-center space-y-2">
                          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-sky-500 to-purple-600 flex items-center justify-center">
                            <Cpu className="w-8 h-8 text-white animate-pulse" />
                          </div>
                          <div className="text-sm font-syne font-bold">Nexus Neural Pods Pro</div>
                          <div className="text-xs font-mono-code text-sky-400">₹14,499</div>
                          <p className="text-[10px] text-neutral-300">
                            Active noise cancellation with 64-bit spatial neural audio pipeline.
                          </p>
                          <button
                            onClick={() => setActiveAppTab('cart')}
                            className="w-full py-2 rounded-xl bg-sky-500 text-black text-xs font-bold uppercase tracking-wider"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    )}

                    {activeAppTab === 'cart' && (
                      <div className="space-y-3 py-2 animate-in fade-in">
                        <div className="text-xs font-mono-code text-neutral-400">YOUR CART (2 ITEMS)</div>
                        <div className="space-y-1.5 text-xs">
                          <div className="p-2 rounded-lg bg-white/5 flex justify-between">
                            <span>Orbit Spatial Lens</span>
                            <span className="font-bold">₹42,999</span>
                          </div>
                          <div className="p-2 rounded-lg bg-white/5 flex justify-between">
                            <span>Nexus Neural Pods</span>
                            <span className="font-bold">₹14,499</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-white/10 flex justify-between text-xs font-bold">
                          <span>Total</span>
                          <span className="text-sky-400">₹57,498</span>
                        </div>
                        <button
                          onClick={() => {
                            audio.playClick();
                            alert('Order transmission simulated: Instant checkout confirmed!');
                          }}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-sky-400 to-purple-500 text-black text-xs font-bold uppercase tracking-wider"
                        >
                          Confirm & Pay
                        </button>
                      </div>
                    )}

                    {/* Bottom App Navigation Tabs */}
                    <div className="pt-2 border-t border-white/10 grid grid-cols-3 text-center text-[10px] font-mono-code text-neutral-400">
                      <button
                        onClick={() => setActiveAppTab('home')}
                        className={`py-1 ${activeAppTab === 'home' ? 'text-sky-400 font-bold' : ''}`}
                      >
                        Home
                      </button>
                      <button
                        onClick={() => setActiveAppTab('product')}
                        className={`py-1 ${activeAppTab === 'product' ? 'text-sky-400 font-bold' : ''}`}
                      >
                        Product
                      </button>
                      <button
                        onClick={() => setActiveAppTab('cart')}
                        className={`py-1 ${activeAppTab === 'cart' ? 'text-sky-400 font-bold' : ''}`}
                      >
                        Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Architectural Highlights */}
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-mono-code text-sky-300">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Dual Platform: iOS & Android Ready</span>
                </div>

                <h4 className="text-xl sm:text-2xl font-serif-luxury font-light">
                  Production Mobile Architecture
                </h4>

                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  Every mobile app developed at Tameem Nexus Studio is engineered for maximum responsiveness, fluid 60 FPS gesture mechanics, secure authentication tokens, and seamless cloud database syncing.
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-white">Cross-Platform Codebase</div>
                      <div className="text-[11px] text-neutral-400">React Native / Flutter unified code reducing development cost and time-to-market.</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-white">Integrated Gateway & Push Engine</div>
                      <div className="text-[11px] text-neutral-400">Frictionless in-app payments, automated push triggers, and real-time order tracking.</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-white">Store Readiness & CI/CD</div>
                      <div className="text-[11px] text-neutral-400">Complete Apple App Store & Google Play Store compliance, metadata preparation, and automated builds.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              3. UI/UX DESIGN DEMO: NEBULA — SaaS Dashboard Experience
              ======================================================== */}
          {service.id === 'ui-ux' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#090912] border border-pink-500/30 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono-code text-pink-400 uppercase tracking-widest">
                      DESIGN SYSTEM PREVIEW &bull; NEBULA
                    </span>
                    <h4 className="text-xl font-cinzel font-light text-white">
                      Atomic Design & Component Tokens
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono-code">
                    <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/30">
                      WCAG AAA Contrast
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                      Figma Auto-Layout 5.0
                    </span>
                  </div>
                </div>

                {/* Color Palette Token Matrix */}
                <div className="space-y-2">
                  <span className="text-xs font-mono-code text-neutral-400">Design Tokens / Core Swatches</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono-code">
                    <div className="p-3 rounded-xl bg-[#050508] border border-white/15 space-y-1">
                      <div className="h-4 rounded bg-[#050508] border border-white/20" />
                      <div className="text-white font-bold">Canvas Base</div>
                      <div className="text-neutral-500 text-[10px]">#050508</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0d0d18] border border-white/15 space-y-1">
                      <div className="h-4 rounded bg-[#0d0d18] border border-white/20" />
                      <div className="text-white font-bold">Surface Glass</div>
                      <div className="text-neutral-500 text-[10px]">#0D0D18</div>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1">
                      <div className="h-4 rounded bg-[#a855f7]" />
                      <div className="text-purple-300 font-bold">Primary Glow</div>
                      <div className="text-neutral-400 text-[10px]">#A855F7</div>
                    </div>

                    <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 space-y-1">
                      <div className="h-4 rounded bg-[#38bdf8]" />
                      <div className="text-sky-300 font-bold">Accent Cyan</div>
                      <div className="text-neutral-400 text-[10px]">#38BDF8</div>
                    </div>

                    <div className="p-3 rounded-xl bg-pink-950/40 border border-pink-500/30 space-y-1">
                      <div className="h-4 rounded bg-[#ec4899]" />
                      <div className="text-pink-300 font-bold">Action Magenta</div>
                      <div className="text-neutral-400 text-[10px]">#EC4899</div>
                    </div>
                  </div>
                </div>

                {/* Interactive UI Kit Component Matrix */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono-code text-neutral-400">Interactive Component States</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                      <span className="text-[10px] font-mono-code text-purple-400 uppercase">Primary Button</span>
                      <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-syne font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                        Launch Experience
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                      <span className="text-[10px] font-mono-code text-sky-400 uppercase">Outline Pill</span>
                      <button className="w-full py-2.5 rounded-full border border-sky-400/50 hover:bg-sky-400/10 text-sky-300 text-xs font-mono-code uppercase tracking-wider transition-colors">
                        Inspect Tokens
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                      <span className="text-[10px] font-mono-code text-emerald-400 uppercase">Status Pill</span>
                      <div className="w-full py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center text-xs font-mono-code">
                        ● All Systems Nominal
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              4. SOFTWARE AUTOMATION DEMO: FLOWX
              ======================================================== */}
          {service.id === 'automation' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#090912] border border-amber-500/30 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono-code text-amber-400 uppercase tracking-widest">
                      ORCHESTRATION PIPELINE GRAPH
                    </span>
                    <h4 className="text-xl font-cinzel font-light text-white">
                      FLOWX — Autonomous Ingestion & Routing
                    </h4>
                  </div>

                  <button
                    onClick={handleSimulateAutomation}
                    disabled={isSimulatingLead}
                    className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black text-xs font-syne font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] disabled:opacity-50 cursor-pointer"
                  >
                    {isSimulatingLead ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Simulating Event...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>Simulate Inbound Event</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 6 Step Animated Pipeline Node Flow */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                  {[
                    { id: 1, label: 'Lead Received', sub: 'Webhook / Form', icon: '📥' },
                    { id: 2, label: 'AI Qualification', sub: 'Gemini Scoring', icon: '🧠' },
                    { id: 3, label: 'CRM Update', sub: 'HubSpot / DB', icon: '💾' },
                    { id: 4, label: 'Email / WhatsApp', sub: 'Instant Dispatch', icon: '💬' },
                    { id: 5, label: 'Task Assignment', sub: 'Slack / Linear', icon: '📋' },
                    { id: 6, label: 'Analytics', sub: 'Real-time KPI', icon: '📊' }
                  ].map((node) => {
                    const isActive = automationStep >= node.id;
                    const isCurrent = automationStep === node.id;

                    return (
                      <div
                        key={node.id}
                        className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between space-y-2 ${
                          isActive
                            ? 'bg-amber-950/40 border-amber-400 text-white shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                            : 'bg-white/[0.02] border-white/10 text-neutral-400'
                        } ${isCurrent ? 'ring-2 ring-amber-400 animate-pulse' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base">{node.icon}</span>
                          <span className="text-[10px] font-mono-code text-amber-400">0{node.id}</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold">{node.label}</div>
                          <div className="text-[10px] text-neutral-400">{node.sub}</div>
                        </div>
                        <div className="text-[9px] font-mono-code pt-1 border-t border-white/10">
                          {isActive ? '● PROCESSED' : '○ IDLE'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Execution Terminal Log */}
                <div className="p-4 rounded-xl bg-black/80 border border-white/10 font-mono-code text-xs space-y-1 text-neutral-300">
                  <div className="text-amber-400 text-[11px] pb-1 border-b border-white/10">
                    FLOWX Execution Telemetry:
                  </div>
                  <div>Status: {automationStep === 0 ? 'Awaiting incoming webhook trigger...' : 'Active execution cycle'}</div>
                  {automationStep >= 1 && <div className="text-emerald-400">✓ [T+0.02s] Inbound payload parsed from Webhook POST.</div>}
                  {automationStep >= 2 && <div className="text-emerald-400">✓ [T+0.14s] AI score: 94/100 (Tier-1 Enterprise Lead).</div>}
                  {automationStep >= 3 && <div className="text-emerald-400">✓ [T+0.28s] Record created in database with UUID #a89f-217.</div>}
                  {automationStep >= 4 && <div className="text-emerald-400">✓ [T+0.42s] Personalized notification delivered via WhatsApp & Email.</div>}
                  {automationStep >= 5 && <div className="text-emerald-400">✓ [T+0.58s] Account executive assigned on Slack channel.</div>}
                  {automationStep >= 6 && <div className="text-emerald-400 font-bold">✓ [T+0.65s] Flow completed successfully with 0 errors.</div>}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              5. AI SOLUTIONS & CUSTOM SOFTWARE DEMO: APEX
              ======================================================== */}
          {service.id === 'ai-solutions' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#090912] border border-purple-500/30 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono-code text-purple-400 uppercase tracking-widest">
                      AUTONOMOUS AI DECISION CORE
                    </span>
                    <h4 className="text-xl font-cinzel font-light text-white">
                      APEX — AI Business Intelligence Platform
                    </h4>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono-code border border-purple-500/40">
                    Vector RAG &bull; Gemini Powered
                  </span>
                </div>

                {/* AI Terminal Simulation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
                    <span className="text-xs font-mono-code text-purple-300">Natural Language Data Query</span>
                    <div className="flex flex-wrap gap-2 text-xs font-mono-code">
                      <button
                        onClick={() => handleRunAiInsight('Summarize quarterly revenue anomalies across SaaS tier accounts')}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 text-neutral-300 text-left transition-colors"
                      >
                        ⚡ "Summarize quarterly revenue anomalies"
                      </button>
                      <button
                        onClick={() => handleRunAiInsight('Generate automated retention report for product management')}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/40 text-neutral-300 text-left transition-colors"
                      >
                        📊 "Generate automated retention report"
                      </button>
                    </div>

                    {isGeneratingAi && (
                      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-mono-code text-purple-300 flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                        <span>Querying semantic vector cluster...</span>
                      </div>
                    )}

                    {aiQueryOutput && !isGeneratingAi && (
                      <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40 text-xs font-mono-code text-purple-200 animate-in fade-in">
                        {aiQueryOutput}
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2 text-xs font-mono-code text-neutral-300">
                    <span className="text-purple-300 block">Custom Architecture Capabilities</span>
                    <div className="space-y-1.5 text-[11px] text-neutral-400 pt-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Custom fine-tuned LLM agents & embeddings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Secure proprietary data isolation & zero leakage</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Interactive business dashboards with automated triggers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Full-stack web & cloud serverless architecture</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono-code text-neutral-400 text-center sm:text-left">
            <span>Ready to build a similar experience for your brand?</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {service.pricingTiers && service.pricingTiers.length > 0 && (
              <button
                onClick={() => {
                  audio.playClick();
                  onClose();
                  onOpenPricing(service);
                }}
                className="flex-1 sm:flex-none px-6 py-3 rounded-full border border-white/20 hover:border-purple-500/50 bg-white/5 text-xs font-syne font-bold uppercase tracking-wider text-white transition-colors cursor-pointer"
              >
                View Pricing Tiers
              </button>
            )}

            <button
              onClick={() => {
                audio.playClick();
                onClose();
                onOpenContact(service.id);
              }}
              className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-white hover:bg-[#a855f7] text-black hover:text-white text-xs font-syne font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <span>Start Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
