import React from 'react';

export const OrganicNatureFrame: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden select-none">
      {/* 1. Subtle Outer Border Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.9)]" />

      {/* 2. Top-Left Spores & Ambient Glow */}
      <div className="absolute -top-16 -left-16 w-80 h-80 bg-purple-900/15 rounded-full blur-3xl" />
      <div className="absolute -top-16 -right-16 w-80 h-80 bg-purple-900/15 rounded-full blur-3xl" />

      {/* 3. Bottom Organic Foreground (Pebbles, Rocks, Illuminated Purple Thistles & Bioluminescence) */}
      <div className="absolute bottom-0 left-0 right-0 h-28 md:h-36 flex items-end justify-between px-2 md:px-8 opacity-75 md:opacity-85 pointer-events-none">
        {/* Left Thistle & Dark River Stones Group */}
        <div className="relative flex items-end -mb-4 -ml-4 md:-ml-2">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-purple-600/25 blur-xl rounded-full pointer-events-none" />
          {/* Glowing Purple Flora Thistle SVG */}
          <div className="relative w-36 h-28 md:w-52 md:h-36">
            <svg
              viewBox="0 0 200 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* Back Stones */}
              <ellipse cx="60" cy="135" rx="45" ry="18" fill="#08070d" stroke="#1f182c" strokeWidth="1.5" />
              <ellipse cx="110" cy="140" rx="35" ry="14" fill="#040306" />
              <ellipse cx="25" cy="142" rx="28" ry="10" fill="#090810" />

              {/* Bioluminescent Spores / Thistle Spikes */}
              <g className="animate-pulse-slow">
                {/* Radial Glow Burst */}
                <circle cx="75" cy="90" r="32" fill="url(#purpleGlow)" opacity="0.8" />
                
                {/* Spiky Spores */}
                {Array.from({ length: 28 }).map((_, i) => {
                  const angle = (i / 28) * Math.PI - Math.PI / 1.1;
                  const length = 22 + (i % 3) * 10;
                  const x1 = 75 + Math.cos(angle) * 8;
                  const y1 = 90 + Math.sin(angle) * 8;
                  const x2 = 75 + Math.cos(angle) * length;
                  const y2 = 90 + Math.sin(angle) * length;
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={i % 2 === 0 ? '#c084fc' : '#a855f7'}
                      strokeWidth={1.2}
                      strokeLinecap="round"
                    />
                  );
                })}
                <circle cx="75" cy="90" r="6" fill="#e879f9" />
                <circle cx="75" cy="90" r="3" fill="#ffffff" />
              </g>

              {/* Second smaller thistle cluster */}
              <g className="opacity-90">
                <circle cx="125" cy="105" r="22" fill="url(#purpleGlow)" opacity="0.6" />
                {Array.from({ length: 20 }).map((_, i) => {
                  const angle = (i / 20) * Math.PI - Math.PI / 1.1;
                  const length = 16 + (i % 2) * 8;
                  const x1 = 125 + Math.cos(angle) * 6;
                  const y1 = 105 + Math.sin(angle) * 6;
                  const x2 = 125 + Math.cos(angle) * length;
                  const y2 = 105 + Math.sin(angle) * length;
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#c084fc"
                      strokeWidth={1}
                      strokeLinecap="round"
                    />
                  );
                })}
                <circle cx="125" cy="105" r="4" fill="#d8b4fe" />
              </g>

              <defs>
                <radialGradient id="purpleGlow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#7e22ce" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#581c87" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Center Grounding Shadow & Dark River Stones Bed */}
        <div className="hidden sm:flex items-end justify-center gap-3 -mb-3 opacity-60">
          <div className="w-16 h-5 rounded-full bg-[#07060c] border border-white/5 shadow-inner" />
          <div className="w-24 h-7 rounded-full bg-[#040307] border border-white/5 shadow-inner" />
          <div className="w-14 h-4 rounded-full bg-[#08070d] border border-white/5 shadow-inner" />
          <div className="w-20 h-6 rounded-full bg-[#050409] border border-white/5 shadow-inner" />
          <div className="w-12 h-4 rounded-full bg-[#07060c] border border-white/5 shadow-inner" />
        </div>

        {/* Right Thistle & Dark Bed Group */}
        <div className="relative flex items-end -mb-4 -mr-4 md:-mr-2">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-purple-600/25 blur-xl rounded-full pointer-events-none" />
          <div className="relative w-36 h-28 md:w-52 md:h-36">
            <svg
              viewBox="0 0 200 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              {/* Back Stones */}
              <ellipse cx="140" cy="135" rx="45" ry="18" fill="#08070d" stroke="#1f182c" strokeWidth="1.5" />
              <ellipse cx="90" cy="140" rx="35" ry="14" fill="#040306" />
              <ellipse cx="175" cy="142" rx="28" ry="10" fill="#090810" />

              {/* Right Bioluminescent Thistle */}
              <g className="animate-pulse-slow">
                <circle cx="125" cy="90" r="32" fill="url(#purpleGlowRight)" opacity="0.8" />
                {Array.from({ length: 28 }).map((_, i) => {
                  const angle = (i / 28) * Math.PI - Math.PI / 1.1;
                  const length = 22 + (i % 3) * 10;
                  const x1 = 125 + Math.cos(angle) * 8;
                  const y1 = 90 + Math.sin(angle) * 8;
                  const x2 = 125 + Math.cos(angle) * length;
                  const y2 = 90 + Math.sin(angle) * length;
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={i % 2 === 0 ? '#c084fc' : '#a855f7'}
                      strokeWidth={1.2}
                      strokeLinecap="round"
                    />
                  );
                })}
                <circle cx="125" cy="90" r="6" fill="#e879f9" />
                <circle cx="125" cy="90" r="3" fill="#ffffff" />
              </g>

              {/* Cyan Accent Spore */}
              <circle cx="170" cy="115" r="3" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="170" cy="115" r="2" fill="#e0f2fe" />

              <defs>
                <radialGradient id="purpleGlowRight" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#7e22ce" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#581c87" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
