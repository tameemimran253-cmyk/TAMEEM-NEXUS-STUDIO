import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ArrowUpRight, Menu, X, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { UserAccountMenu } from './UserAccountMenu';
import { audio } from '../utils/audioSystem';

interface NavbarProps {
  onOpenContact: () => void;
  scrollProgress?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMuted(audio.getIsMuted());
    let lastScrolled = false;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          if (total > 0) {
            const pct = Math.round((window.scrollY / total) * 100);
            setScrollPercent((prev) => (prev !== pct ? pct : prev));
          }
          const scrolled = window.scrollY > 40;
          if (scrolled !== lastScrolled) {
            lastScrolled = scrolled;
            setIsScrolled(scrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const isUnmuted = audio.toggleMute();
    setIsMuted(!isUnmuted);
  };

  const scrollTo = (id: string) => {
    audio.playClick();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'WORK (12)', id: 'work' },
    { label: 'CASE STUDY', id: 'services' },
    { label: 'REVIEWS (18)', id: 'reviews' },
    { label: 'ABOUT US', id: 'about' },
    { label: 'STUDIO', id: 'contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3.5 bg-[#050505]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'py-6 md:py-8 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Mark Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onMouseEnter={() => audio.playHover()}
            className="cursor-pointer focus:outline-none"
            aria-label="Tameem Nexus Studio Home"
          >
            <Logo size="md" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono-code uppercase tracking-[0.25em] text-neutral-300">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                onMouseEnter={() => audio.playHover()}
                className="hover:text-white transition-colors relative py-1 group flex items-center gap-1 cursor-pointer"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#a855f7] group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </nav>

          {/* Actions: Sound Toggle + CTA + User Menu + Mobile Menu Button */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Scroll Indicator (desktop) */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono-code text-neutral-400">
              <span className="text-purple-400 font-medium">
                {scrollPercent}%
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleSoundToggle}
              onMouseEnter={() => audio.playHover()}
              className="p-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/50 text-neutral-300 hover:text-white transition-all cursor-pointer"
              title={isMuted ? 'Enable Atmospheric Audio' : 'Mute Audio'}
              aria-label="Toggle Sound"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#a855f7] animate-pulse" />
              )}
            </button>

            {/* CTA Button */}
            <button
              onClick={() => {
                audio.playClick();
                onOpenContact();
              }}
              onMouseEnter={() => audio.playHover()}
              data-cursor="start"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-syne font-bold uppercase tracking-wider text-black bg-white hover:bg-[#a855f7] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] cursor-pointer"
            >
              <span>LET'S BUILD SOMETHING EXTRAORDINARY</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Authenticated User Account Menu */}
            <UserAccountMenu onOpenProjectModal={onOpenContact} />

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => {
                audio.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2.5 rounded-full border border-white/10 bg-white/5 text-neutral-300 hover:text-white"
              aria-label="Open Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-2xl md:hidden flex flex-col justify-between pt-28 pb-10 px-8 animate-in fade-in duration-300">
          <nav className="flex flex-col space-y-6">
            {navLinks.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left font-serif-luxury text-3xl text-neutral-200 hover:text-purple-300 transition-colors flex items-center justify-between border-b border-white/10 pb-4"
              >
                <span>{item.label}</span>
                <span className="text-xs font-mono-code text-purple-400">0{idx + 1}</span>
              </button>
            ))}
          </nav>

          <div className="space-y-4 pt-6">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-4 rounded-full bg-white text-black font-syne font-bold text-xs uppercase tracking-widest hover:bg-[#a855f7] hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>START A PROJECT</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[10px] font-mono-code text-neutral-500 uppercase tracking-widest">
              TAMEEM NEXUS STUDIO &bull; LUCKNOW, INDIA
            </div>
          </div>
        </div>
      )}
    </>
  );
};
