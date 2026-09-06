import React from 'react';

export const SynapseFiberVisual: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full min-h-[220px] bg-[#03060c] overflow-hidden select-none flex flex-col justify-between ${className}`}>
      {/* Background Volumetric Beam / Dark Cyber Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(56,189,248,0.15),_transparent_70%)] pointer-events-none" />

      {/* TOP CIRCUIT BOARD SUBSTRATE */}
      <div className="relative z-10 w-full h-12 bg-gradient-to-b from-[#0e1726] to-[#050b14] border-b border-cyan-500/30 p-2 shadow-xl flex items-center justify-between">
        {/* Top Microchips & Solder Points */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-6 bg-neutral-900 border border-cyan-500/40 rounded flex items-center justify-center">
            <div className="w-4 h-3 bg-neutral-800 rounded-sm" />
          </div>
          <div className="flex gap-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_4px_#38bdf8]" />
            ))}
          </div>
        </div>
        <span className="text-[8px] font-mono-code text-cyan-400/80 tracking-widest uppercase">
          CORE INGEST &bull; SUBSTRATE-A
        </span>
      </div>

      {/* MIDDLE VERTICAL OPTICAL FIBER STRANDS & NEURAL BEAMS */}
      <div className="relative flex-1 w-full overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="fiber-cyan" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glow-bright" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Flowing Vertical Curving Fiber Strands */}
          <g stroke="url(#fiber-cyan)" fill="none" filter="url(#glow-bright)">
            <path d="M 50,0 C 70,50 30,150 60,200" strokeWidth="1.2" strokeOpacity="0.7" />
            <path d="M 90,0 C 130,60 70,140 110,200" strokeWidth="1.5" strokeOpacity="0.85" />
            <path d="M 140,0 C 110,70 170,130 150,200" strokeWidth="1.8" strokeOpacity="0.9" />
            <path d="M 180,0 C 230,80 160,120 200,200" strokeWidth="1.2" strokeOpacity="0.6" />
            <path d="M 230,0 C 200,60 270,140 240,200" strokeWidth="2.0" strokeOpacity="1" />
            <path d="M 270,0 C 310,70 240,130 280,200" strokeWidth="1.4" strokeOpacity="0.75" />
            <path d="M 320,0 C 290,50 360,150 330,200" strokeWidth="1.8" strokeOpacity="0.9" />
            <path d="M 370,0 C 420,80 340,120 390,200" strokeWidth="1.5" strokeOpacity="0.8" />
            <path d="M 420,0 C 390,60 450,140 430,200" strokeWidth="1.2" strokeOpacity="0.7" />
            <path d="M 460,0 C 480,70 440,130 470,200" strokeWidth="1.0" strokeOpacity="0.6" />
          </g>

          {/* Luminous Data Nodes / Light Pulses along the fibers */}
          <circle cx="65" cy="80" r="2.5" fill="#ffffff" filter="url(#glow-bright)" />
          <circle cx="105" cy="130" r="3.5" fill="#38bdf8" filter="url(#glow-bright)" />
          <circle cx="145" cy="50" r="2.5" fill="#ffffff" />
          <circle cx="155" cy="160" r="3" fill="#818cf8" filter="url(#glow-bright)" />
          <circle cx="215" cy="90" r="4" fill="#ffffff" filter="url(#glow-bright)" />
          <circle cx="250" cy="140" r="3" fill="#38bdf8" filter="url(#glow-bright)" />
          <circle cx="295" cy="65" r="3.5" fill="#ffffff" filter="url(#glow-bright)" />
          <circle cx="340" cy="120" r="4" fill="#38bdf8" filter="url(#glow-bright)" />
          <circle cx="380" cy="45" r="2.5" fill="#ffffff" />
          <circle cx="405" cy="155" r="3" fill="#818cf8" filter="url(#glow-bright)" />
          <circle cx="440" cy="95" r="2.5" fill="#ffffff" />
        </svg>

        {/* Ambient Floating Particle Dust */}
        <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-cyan-300 rounded-full shadow-[0_0_8px_#38bdf8] animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_10px_#60a5fa] animate-ping" style={{ animationDuration: '5s' }} />
      </div>

      {/* BOTTOM CIRCUIT BOARD SUBSTRATE */}
      <div className="relative z-10 w-full h-12 bg-gradient-to-t from-[#0e1726] to-[#050b14] border-t border-cyan-500/30 p-2 shadow-2xl flex items-center justify-between">
        <span className="text-[8px] font-mono-code text-cyan-400/80 tracking-widest uppercase">
          SYNAPSE OS &bull; NEURAL DISPATCH
        </span>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400/80 shadow-[0_0_4px_#818cf8]" />
            ))}
          </div>
          <div className="w-8 h-6 bg-neutral-900 border border-indigo-500/40 rounded flex items-center justify-center">
            <div className="w-4 h-3 bg-neutral-800 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
