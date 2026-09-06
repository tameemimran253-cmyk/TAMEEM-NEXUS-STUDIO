import React, { useEffect, useState, useRef } from 'react';
import {
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  Layers,
  Cpu,
  Terminal,
  Globe,
  Smartphone,
  Layout,
  Workflow,
  ShoppingBag,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  User,
  Compass,
  Check,
  Send,
  ExternalLink,
  ShieldCheck,
  Code
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { NexusWebGLScene } from './components/3d/NexusWebGLScene';
import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';
import { IntroLoader } from './components/IntroLoader';
import { ContactModal } from './components/ContactModal';
import { ProjectModal } from './components/ProjectModal';
import { ServicesSection } from './components/ServicesSection';
import { DemoModal } from './components/DemoModal';
import { PricingModal } from './components/PricingModal';
import { NotifyMeModal } from './components/NotifyMeModal';
import { ReviewsSection } from './components/ReviewsSection';
import { AuthScreen } from './components/AuthScreen';
import { ProfileModal } from './components/ProfileModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { NexusAIAssistant } from './components/NexusAIAssistant';
import { ProjectVisualRenderer } from './components/project-visuals/ProjectVisualRenderer';
import { CreativePointOfViewVisual } from './components/CreativePointOfViewVisual';
import { SpatialCraftVisual } from './components/SpatialCraftVisual';
import { OrganicNatureFrame } from './components/OrganicNatureFrame';
import { Logo } from './components/Logo';
import { AuthProvider, useAuth } from './context/AuthContext';

import {
  studioInfo,
  servicesData,
  projectsData,
  processSteps,
  whyChooseTNS,
  ProjectItem,
  ServiceItem
} from './data/studioData';
import { ServiceData } from './data/servicesPricingData';
import { audio } from './utils/audioSystem';

gsap.registerPlugin(ScrollTrigger);

// Service Icon Mapping
const getServiceIcon = (id: string) => {
  switch (id) {
    case 'web-dev':
      return <Globe className="w-5 h-5 text-purple-400" />;
    case 'app-dev':
      return <Smartphone className="w-5 h-5 text-sky-400" />;
    case 'ui-ux':
      return <Layout className="w-5 h-5 text-pink-400" />;
    case 'automation':
      return <Workflow className="w-5 h-5 text-amber-400" />;
    case 'ai-solutions':
      return <Cpu className="w-5 h-5 text-purple-400" />;
    case '3d-motion':
      return <Layers className="w-5 h-5 text-cyan-400" />;
    case 'ecommerce':
      return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
    case 'seo-growth':
      return <TrendingUp className="w-5 h-5 text-indigo-400" />;
    default:
      return <Code className="w-5 h-5 text-purple-400" />;
  }
};

function MainStudioExperience() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [introLoading, setIntroLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<string>('web-dev');
  const [selectedTierForContact, setSelectedTierForContact] = useState<{ name: string; price: string } | undefined>(undefined);
  const [selectedDemoService, setSelectedDemoService] = useState<ServiceData | null>(null);
  const [selectedPricingService, setSelectedPricingService] = useState<ServiceData | null>(null);
  const [selectedNotifyService, setSelectedNotifyService] = useState<ServiceData | null>(null);

  const mainContainerRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger Animations (Hardware-accelerated transforms, zero blur lag)
  useEffect(() => {
    if (introLoading || !isAuthenticated) return;

    const ctx = gsap.context(() => {
      const revealElements = document.querySelectorAll('.gsap-reveal');
      revealElements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              once: true,
            },
          }
        );
      });
    }, mainContainerRef);

    return () => {
      ctx.revert();
    };
  }, [introLoading, isAuthenticated]);

  const handleOpenContactWithService = (serviceId: string) => {
    setSelectedServiceForContact(serviceId);
    setSelectedTierForContact(undefined);
    setIsContactOpen(true);
  };

  const handleSelectTierForContact = (serviceId: string, tierName: string, tierPrice: string) => {
    setSelectedServiceForContact(serviceId);
    setSelectedTierForContact({ name: tierName, price: tierPrice });
    setIsContactOpen(true);
  };

  const scrollToSection = (id: string) => {
    audio.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If not authenticated, display the cinematic Authentication Gate Screen
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="relative min-h-screen bg-[#030206] text-[#ededed]">
        <NexusWebGLScene />
        <OrganicNatureFrame />
        <AuthScreen onAuthenticated={() => {}} />
      </div>
    );
  }

  return (
    <div
      ref={mainContainerRef}
      className="relative min-h-screen bg-[#050505] text-[#ededed] selection:bg-[#a855f7]/40 selection:text-white font-sans overflow-x-hidden"
    >
      {/* Intro Loading Screen */}
      {introLoading && (
        <IntroLoader
          onComplete={() => {
            setIntroLoading(false);
          }}
        />
      )}

      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Top Floating Navigation */}
      <Navbar
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* 3D WebGL Canvas Scene in Background */}
      <NexusWebGLScene />

      {/* Cinematic Nature Terrarium Frame with Rocks & Bioluminescent Thistle Flora */}
      <OrganicNatureFrame />

      {/* Subtle Space Atmosphere Overlays */}
      <div className="fixed inset-0 vignette-overlay z-[1] pointer-events-none" />
      <div className="fixed inset-0 bg-noise opacity-25 z-[1] pointer-events-none" />

      {/* ========================================================
          1. HERO SECTION (Matching Video "BORN OF NATURE / DIGITAL EXPERIENCES")
          ======================================================== */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-between px-6 md:px-16 pt-28 pb-14 z-10 pointer-events-none"
      >
        {/* Upper Metadata */}
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pointer-events-auto">
          <div className="space-y-1">
            <span className="text-[10px] font-mono-code tracking-[0.35em] text-purple-400 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_#a855f7]" />
              CREATIVE TECHNOLOGY STUDIO &bull; BORN OF NATURE
            </span>
            <p className="text-xs font-mono-code text-neutral-400 tracking-wider">
              {studioInfo.location}
            </p>
          </div>

          <div className="text-left md:text-right space-y-1">
            <span className="text-[10px] font-mono-code tracking-[0.35em] text-neutral-400 uppercase block">
              BUILT FOR THE FUTURE
            </span>
            <span className="text-xs font-mono-code text-purple-300">
              {studioInfo.status}
            </span>
          </div>
        </div>

        {/* Center Typography Headline intersecting the 3D Lotus */}
        <div className="my-auto py-8 md:py-16 select-none max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6">
            {/* Left Headline Column */}
            <div className="lg:col-span-6 space-y-4">
              <h1 className="text-[14vw] lg:text-[7.5vw] font-serif-luxury font-light text-white tracking-tight leading-[0.88] gsap-reveal">
                BORN OF
              </h1>
              <p className="text-xs md:text-sm font-mono-code text-purple-300/80 uppercase tracking-widest pl-1">
                WE TRANSCEND DIMENSIONS
              </p>
            </div>

            {/* Right Headline Column */}
            <div className="lg:col-span-6 lg:text-right space-y-4">
              <div className="text-[14vw] lg:text-[7.5vw] font-serif-luxury font-normal text-white tracking-tight leading-[0.88] gsap-reveal flex lg:justify-end items-baseline gap-3">
                <span>NATURE</span>
                <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#a855f7] shadow-[0_0_20px_#a855f7]" />
              </div>
              <p className="text-xs md:text-sm font-mono-code text-neutral-400 uppercase tracking-widest pr-1">
                DIGITAL CRAFT &bull; 2026
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Supporting Statement + CTA Buttons (From Video Layout) */}
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pt-6 border-t border-white/10 pointer-events-auto">
          <div className="max-w-xl space-y-4">
            <p className="text-xs md:text-sm text-neutral-300 font-light leading-relaxed">
              Where the organic meets the digital, transforming visions into masterpieces that inspire and endure.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  audio.playClick();
                  setIsContactOpen(true);
                }}
                data-cursor="start"
                onMouseEnter={() => audio.playHover()}
                className="px-6 py-3 rounded-full bg-white text-black font-syne font-bold text-xs uppercase tracking-widest hover:bg-[#a855f7] hover:text-white transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer"
              >
                <span>GET STARTED</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => scrollToSection('work')}
                onMouseEnter={() => audio.playHover()}
                data-cursor="explore"
                className="px-6 py-3 rounded-full border border-white/20 hover:border-white/40 bg-white/5 text-neutral-200 hover:text-white font-mono-code text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                EXPLORE OUR WORK
              </button>
            </div>
          </div>

          {/* Quick Contact Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl glass-panel text-xs font-mono-code text-neutral-300">
            <div>
              <span className="text-[10px] text-purple-400 block uppercase tracking-widest">FOUNDER</span>
              <span className="text-white font-semibold">{studioInfo.founder}</span>
            </div>
            <div className="hidden sm:block w-[1px] h-8 bg-white/10" />
            <div>
              <span className="text-[10px] text-purple-400 block uppercase tracking-widest">DIRECT EMAIL</span>
              <a href={`mailto:${studioInfo.email}`} className="text-neutral-300 hover:text-purple-300 transition-colors">
                {studioInfo.email}
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="w-full flex justify-center pt-8 pointer-events-auto">
          <button
            onClick={() => scrollToSection('intro')}
            className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="text-[9px] font-mono-code uppercase tracking-[0.3em] text-neutral-400">
              SCROLL TO EXPLORE
            </span>
            <ChevronDown className="w-4 h-4 text-purple-400 animate-bounce" />
          </button>
        </div>
      </section>

      {/* ========================================================
          2. STUDIO INTRODUCTION
          ======================================================== */}
      <section id="intro" className="relative z-10 py-32 px-6 md:px-16 max-w-6xl mx-auto">
        <div className="p-8 md:p-16 rounded-3xl glass-panel border border-white/10 space-y-8 text-center gsap-reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono-code text-purple-300 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STUDIO INTRODUCTION &bull; LUCKNOW, UTTAR PRADESH</span>
          </div>

          <h2 className="text-3xl md:text-6xl font-serif-luxury font-light text-white leading-tight max-w-4xl mx-auto">
            "{studioInfo.introStatement}"
          </h2>

          <p className="text-sm md:text-base text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Based in Lucknow, Uttar Pradesh, India, <strong>Tameem Nexus Studio</strong> is an independent creative technology studio delivering high-precision websites, applications, and automated software solutions tailored for forward-thinking brands and organizations.
          </p>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs font-mono-code text-neutral-400">
            <span>&bull; DESIGN</span>
            <span>&bull; TECHNOLOGY</span>
            <span>&bull; MOTION</span>
            <span>&bull; AI & AUTOMATION</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SERVICES & PRICING SECTION (All 8 Disciplines)
          ======================================================== */}
      <ServicesSection
        onOpenDemo={(service) => setSelectedDemoService(service)}
        onOpenPricing={(service) => setSelectedPricingService(service)}
        onOpenNotify={(service) => setSelectedNotifyService(service)}
        onOpenContact={(serviceId) => handleOpenContactWithService(serviceId)}
      />

      {/* ========================================================
          4. SELECTED WORK / PROJECTS SHOWCASE
          ======================================================== */}
      <section id="work" className="relative z-10 py-32 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono-code text-purple-400 uppercase tracking-widest">
              <Layers className="w-4 h-4" />
              <span>SELECTED WORK &bull; FEATURED PROJECTS</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-cinzel font-light text-white leading-none">
              SELECTED<br />PROJECTS.
            </h2>
          </div>
          <p className="text-xs md:text-sm text-neutral-400 max-w-md">
            A showcase of modern websites, interactive 3D digital experiences, AI platforms, and automated software systems.
          </p>
        </div>

        {/* Large Cinematic Project Cards with Attached Imagery */}
        <div className="space-y-12">
          {projectsData.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => {
                audio.playClick();
                setSelectedProject(project);
              }}
              data-cursor="view"
              onMouseEnter={() => audio.playHover()}
              className="group relative cursor-pointer overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 md:p-10 border border-white/10 hover:border-purple-500/60 transition-all duration-500 hover:bg-white/[0.03]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Visual Image Preview Column */}
                <div className="lg:col-span-5 order-2 lg:order-1 relative overflow-hidden rounded-2xl border border-white/10 group-hover:border-purple-500/40 bg-black/60 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] transition-all duration-500 shadow-2xl">
                  <ProjectVisualRenderer project={project} />
                  
                  {/* Floating Overlay Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono-code text-purple-300 uppercase tracking-wider z-20 pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    <span>0{idx + 1} &bull; {project.category}</span>
                  </div>

                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono-code text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 z-20 pointer-events-none">
                    <span>VIEW CASE</span>
                    <ArrowUpRight className="w-3 h-3 text-purple-400" />
                  </div>
                </div>

                {/* Content & Metadata Column */}
                <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-xs font-mono-code text-purple-400 uppercase tracking-widest">
                      <span>0{idx + 1}</span>
                      <span>&bull;</span>
                      <span>{project.category}</span>
                      <span>&bull;</span>
                      <span>{project.year}</span>
                    </div>

                    <div className="p-3 rounded-full border border-white/15 group-hover:border-purple-500 group-hover:bg-purple-500 group-hover:text-black text-white transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-cinzel font-normal text-white group-hover:text-purple-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed font-light">
                    {project.description}
                  </p>

                  {/* Quick Metrics Bar */}
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 group-hover:border-purple-500/20 transition-colors">
                    {project.stats.map((stat, sIdx) => (
                      <div key={sIdx} className="space-y-0.5">
                        <span className="text-[9px] font-mono-code text-neutral-400 uppercase tracking-widest block truncate">
                          {stat.label}
                        </span>
                        <span className="text-sm sm:text-base md:text-lg font-syne font-bold text-purple-200 block">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono-code text-neutral-300 group-hover:border-purple-500/30 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          5. 3D / INTERACTIVE TECHNOLOGY SECTION
          ======================================================== */}
      <section id="interactive-3d" className="relative z-10 py-32 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="p-8 md:p-14 rounded-3xl glass-panel-glow border border-purple-500/30 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-mono-code text-purple-300 uppercase tracking-widest">
                <Cpu className="w-3.5 h-3.5" />
                <span>INTERACTIVE TECHNOLOGY &bull; 3D NEXUS CORE</span>
              </div>

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif-luxury font-light text-white leading-tight">
                SPATIAL CRAFT IN MOTION.
              </h2>

              <p className="text-sm md:text-base text-neutral-300 font-light leading-relaxed">
                Our WebGL 3D environment responds directly to cursor movement, scroll velocity, and viewport depth. Move your mouse across the interactive simulation to trigger kinetic ribbons, orbital gyroscope rings, and real-time volumetric light refractions.
              </p>

              {/* 3 Telemetry Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono-code text-neutral-300">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-colors">
                  <span className="text-purple-400 block mb-1 text-[10px]">CURSOR REACTIVITY</span>
                  <span className="text-[11px] text-white">Gyro & Parallax Lerp</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-colors">
                  <span className="text-cyan-400 block mb-1 text-[10px]">GRAPHICS ENGINE</span>
                  <span className="text-[11px] text-white">Three.js & WebGL 2.0</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-colors">
                  <span className="text-emerald-400 block mb-1 text-[10px]">FRAME STABILITY</span>
                  <span className="text-[11px] text-white">60 FPS Hardware-Sync</span>
                </div>
              </div>
            </div>

            {/* Right Visual / Kinetic Simulation Column */}
            <div className="lg:col-span-6">
              <SpatialCraftVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. PROCESS SECTION (4-Step Flow)
          ======================================================== */}
      <section id="process" className="relative z-10 py-32 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="mb-20 space-y-4 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-mono-code text-purple-400 uppercase tracking-widest">
            <Compass className="w-4 h-4" />
            <span>STRUCTURED METHODOLOGY &bull; 4 PHASES</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-cinzel font-light text-white leading-tight">
            OUR PROCESS.
          </h2>
          <p className="text-xs md:text-sm text-neutral-400">
            A clear, transparent 4-step framework from initial discovery to final deployment.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step) => (
            <div
              key={step.number}
              className="p-8 rounded-2xl glass-panel border border-white/10 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <span className="text-4xl font-syne font-bold text-purple-400/40 group-hover:text-purple-400 transition-colors">
                  {step.number}
                </span>
                <h3 className="text-xl font-cinzel font-normal text-white">
                  {step.title}
                </h3>
                <span className="text-[10px] font-mono-code text-purple-300 block uppercase tracking-wider">
                  {step.tagline}
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-1.5">
                <span className="text-[9px] font-mono-code text-neutral-400 uppercase tracking-widest block">
                  KEY DELIVERABLE
                </span>
                <span className="text-xs font-mono-code text-purple-300 block">
                  {step.deliverables[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          6.5 CLIENT REVIEWS & GENUINE TESTIMONIALS (18+ VERIFIED)
          ======================================================== */}
      <ReviewsSection onOpenContact={() => setIsContactOpen(true)} />

      {/* ========================================================
          7. ABOUT THE STUDIO & WHY CHOOSE TAMEEM NEXUS STUDIO
          ======================================================== */}
      <section id="about" className="relative z-10 py-32 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="p-8 md:p-14 rounded-3xl glass-panel border border-white/10 space-y-12">
          {/* Header Grid: Content Left + Artwork Column Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono-code text-purple-400 uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <span>ABOUT TAMEEM NEXUS STUDIO</span>
              </div>

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif-luxury font-light text-white leading-tight">
                {studioInfo.aboutHeading}
              </h2>

              <p className="text-sm md:text-base text-neutral-300 leading-relaxed font-light">
                {studioInfo.aboutDescription}
              </p>

              {/* Fast Capability Pills */}
              <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-mono-code text-neutral-300">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">SPATIAL COMPUTING</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">OPTICAL REFRACTION</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">AI & AUTOMATION</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">DIGITAL ARCHITECTURE</span>
              </div>
            </div>

            {/* Right Artwork Visual Column */}
            <div className="lg:col-span-5">
              <CreativePointOfViewVisual />
            </div>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/10">
            {whyChooseTNS.map((pillar) => (
              <div key={pillar.number} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono-code text-purple-400 font-bold">{pillar.number}</span>
                  <h3 className="text-base font-cinzel text-white">{pillar.title}</h3>
                </div>
                <p className="text-xs text-neutral-300 font-light leading-relaxed pl-7">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          8. ABOUT FOUNDER SECTION
          ======================================================== */}
      <section id="founder" className="relative z-10 py-32 px-6 md:px-16 max-w-5xl mx-auto">
        <div className="p-8 md:p-14 rounded-3xl glass-panel border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono-code text-purple-300 uppercase tracking-widest">
              <User className="w-3.5 h-3.5" />
              <span>STUDIO LEADERSHIP</span>
            </div>

            <div>
              <h2 className="text-3xl md:text-5xl font-cinzel font-normal text-white">
                {studioInfo.founder}
              </h2>
              <div className="text-sm font-mono-code text-purple-300 tracking-wider mt-1 uppercase">
                FOUNDER, TAMEEM NEXUS STUDIO
              </div>
            </div>

            <p className="text-xs md:text-sm text-neutral-300 font-light leading-relaxed">
              Leading the creative and technical vision at Tameem Nexus Studio. Directing the design, development, and execution of modern web experiences, mobile applications, software automations, and AI integrations.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-mono-code text-neutral-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>{studioInfo.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <a href={`mailto:${studioInfo.email}`} className="hover:text-purple-300 transition-colors">
                  {studioInfo.email}
                </a>
              </div>
            </div>
          </div>

          {/* Founder Emblem / Monogram Card */}
          <div className="shrink-0 p-8 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center space-y-4 text-center">
            <Logo size="lg" variant="symbol" />
            <div className="space-y-0.5">
              <span className="text-xs font-syne font-bold text-white block tracking-wider">
                MOHAMMAD TAMEEM IMRAN
              </span>
              <span className="text-[10px] font-mono-code text-purple-400 block tracking-widest uppercase">
                FOUNDER
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          9. CONTACT SECTION
          ======================================================== */}
      <section id="contact" className="relative z-10 py-32 px-6 md:px-16 max-w-5xl mx-auto text-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code text-purple-400 uppercase tracking-widest">
            <Send className="w-4 h-4" />
            <span>LET'S TALK &bull; DIRECT CONTACT</span>
          </div>

          <h2 className="text-4xl md:text-8xl font-serif-luxury font-light text-white leading-none tracking-tight">
            {studioInfo.contactHeading}
          </h2>

          <p className="text-sm md:text-base text-neutral-300 max-w-xl mx-auto font-light">
            Ready to build a modern website, mobile app, automation pipeline, or AI solution? Get in touch with us today.
          </p>

          {/* Contact Details Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto p-6 rounded-2xl glass-panel border border-white/10 text-xs font-mono-code text-neutral-300">
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest">LOCATION</span>
              <span className="text-white">{studioInfo.location}</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Phone className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest">PHONE</span>
              <a href={`tel:${studioInfo.phoneRaw}`} className="text-white hover:text-purple-300 transition-colors">
                {studioInfo.phone}
              </a>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest">EMAIL</span>
              <a href={`mailto:${studioInfo.email}`} className="text-white hover:text-purple-300 transition-colors truncate max-w-full">
                {studioInfo.email}
              </a>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                audio.playClick();
                setIsContactOpen(true);
              }}
              data-cursor="start"
              onMouseEnter={() => audio.playHover()}
              className="px-10 py-4 rounded-full bg-white text-black font-syne font-bold text-xs uppercase tracking-widest hover:bg-[#a855f7] hover:text-white transition-all transform hover:scale-105 shadow-[0_0_35px_rgba(255,255,255,0.25)] flex items-center gap-3 cursor-pointer"
            >
              <span>START A CONVERSATION</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          10. FOOTER
          ======================================================== */}
      <footer className="relative z-10 border-t border-white/10 bg-[#030305] pt-20 pb-12 px-6 md:px-16">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Upper Footer: Logo + Navigation Links */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <Logo size="lg" />

            <nav className="flex flex-wrap items-center gap-6 text-xs font-mono-code uppercase tracking-widest text-neutral-400">
              <button onClick={() => scrollToSection('work')} className="hover:text-white transition-colors cursor-pointer">
                WORK
              </button>
              <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors cursor-pointer">
                SERVICES
              </button>
              <button onClick={() => scrollToSection('reviews')} className="hover:text-white transition-colors cursor-pointer">
                REVIEWS
              </button>
              <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors cursor-pointer">
                ABOUT
              </button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors cursor-pointer">
                CONTACT
              </button>
            </nav>
          </div>

          {/* Large Editorial Statement */}
          <div className="py-8 border-y border-white/10 select-none">
            <div className="text-3xl md:text-6xl font-cinzel font-light text-neutral-400/80 tracking-wider">
              TAMEEM NEXUS STUDIO
            </div>
            <div className="text-xs md:text-sm font-mono-code text-neutral-500 uppercase tracking-[0.3em] mt-2">
              DESIGN &bull; TECHNOLOGY &bull; AI &bull; DIGITAL EXPERIENCES
            </div>
          </div>

          {/* Absolute Bottom End: Founder & Copyright */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono-code text-neutral-400">
            <div>
              <span className="text-white font-semibold">{studioInfo.founder}</span>
              <span className="text-neutral-500 ml-2">— {studioInfo.founderTitle}</span>
            </div>

            <div className="text-neutral-500">
              {studioInfo.copyright}
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Nexus AI Business Assistant */}
      <NexusAIAssistant
        onOpenProjectModal={() => setIsContactOpen(true)}
        onOpenPricingModal={() => {
          setSelectedPricingService(servicesData[0] as any);
        }}
        onNavigateSection={(secId) => scrollToSection(secId)}
      />

      {/* User Profile & Account Modal */}
      <ProfileModal />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal />

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Interactive Service Demo Modal */}
      <DemoModal
        service={selectedDemoService}
        isOpen={Boolean(selectedDemoService)}
        onClose={() => setSelectedDemoService(null)}
        onOpenPricing={(service) => {
          setSelectedDemoService(null);
          setSelectedPricingService(service);
        }}
        onOpenContact={(serviceId) => {
          setSelectedDemoService(null);
          handleOpenContactWithService(serviceId);
        }}
      />

      {/* Transparent Service Pricing Modal */}
      <PricingModal
        service={selectedPricingService}
        isOpen={Boolean(selectedPricingService)}
        onClose={() => setSelectedPricingService(null)}
        onSelectTierForContact={(serviceId, tierName, tierPrice) => {
          setSelectedPricingService(null);
          handleSelectTierForContact(serviceId, tierName, tierPrice);
        }}
        onOpenDemo={(service) => {
          setSelectedPricingService(null);
          setSelectedDemoService(service);
        }}
      />

      {/* Upcoming Service Notify Modal */}
      <NotifyMeModal
        service={selectedNotifyService}
        isOpen={Boolean(selectedNotifyService)}
        onClose={() => setSelectedNotifyService(null)}
        onOpenContact={(serviceId) => {
          setSelectedNotifyService(null);
          handleOpenContactWithService(serviceId);
        }}
      />

      {/* Start a Project / Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => {
          setIsContactOpen(false);
          setSelectedTierForContact(undefined);
        }}
        defaultService={selectedServiceForContact}
        defaultTier={selectedTierForContact}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainStudioExperience />
    </AuthProvider>
  );
}

