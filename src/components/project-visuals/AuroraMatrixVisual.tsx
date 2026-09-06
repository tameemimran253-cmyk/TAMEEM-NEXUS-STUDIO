import React from 'react';

export const AuroraMatrixVisual: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full min-h-[220px] bg-[#020208] overflow-hidden select-none ${className}`}>
      {/* Background Volumetric Nebula Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-cyan-950/20 to-transparent pointer-events-none" />

      {/* Cybernetic Geometric Polyhedral Wireframe SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="neon-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="neon-magenta-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="laser-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Triangular Constellation Lines */}
        <g stroke="rgba(56, 189, 248, 0.25)" strokeWidth="0.8">
          <line x1="40" y1="70" x2="120" y2="140" />
          <line x1="120" y1="140" x2="70" y2="220" />
          <line x1="70" y1="220" x2="40" y2="70" />
          <line x1="120" y1="140" x2="250" y2="150" />
          <line x1="430" y1="60" x2="380" y2="130" />
          <line x1="380" y1="130" x2="450" y2="210" />
          <line x1="450" y1="210" x2="430" y2="60" />
          <line x1="380" y1="130" x2="250" y2="150" />
        </g>

        {/* Left 3D Prism / Diamond Node */}
        <polygon
          points="80,100 130,120 100,170 50,150"
          fill="rgba(6, 182, 212, 0.15)"
          stroke="#06b6d4"
          strokeWidth="1.5"
          filter="url(#glow)"
        />
        <line x1="80" y1="100" x2="100" y2="170" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3,3" />

        {/* Right 3D Polyhedron / Octahedron Node */}
        <polygon
          points="400,90 440,140 390,180 350,130"
          fill="rgba(168, 85, 247, 0.15)"
          stroke="#c084fc"
          strokeWidth="1.5"
          filter="url(#glow)"
        />

        {/* Center Complex Isometric Hexagonal Cube Matrix */}
        <g transform="translate(250, 150)" filter="url(#glow)">
          {/* Main Laser Cross Beam */}
          <line x1="-150" y1="-30" x2="150" y2="30" stroke="url(#laser-line-grad)" strokeWidth="2.5" />
          
          {/* Isometric Inner Cubes */}
          {/* Top Hex Face */}
          <polygon
            points="0,-60 50,-30 0,0 -50,-30"
            fill="rgba(56, 189, 248, 0.25)"
            stroke="#38bdf8"
            strokeWidth="1.8"
          />
          {/* Right Hex Face */}
          <polygon
            points="0,0 50,-30 50,30 0,60"
            fill="rgba(192, 132, 252, 0.2)"
            stroke="#a855f7"
            strokeWidth="1.8"
          />
          {/* Left Hex Face */}
          <polygon
            points="0,0 -50,-30 -50,30 0,60"
            fill="rgba(236, 72, 153, 0.2)"
            stroke="#ec4899"
            strokeWidth="1.8"
          />

          {/* Concentric Wireframe Shell */}
          <polygon
            points="0,-85 75,-42 0,0 -75,-42"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* Central Glowing Energy Hub Core */}
          <circle cx="0" cy="0" r="6" fill="#ffffff" filter="url(#glow)" />
          <circle cx="0" cy="0" r="14" fill="none" stroke="#22d3ee" strokeWidth="1.2" className="animate-ping" style={{ animationDuration: '3s' }} />
        </g>

        {/* Floating Glowing Constellation Vertices */}
        <circle cx="40" cy="70" r="3.5" fill="#38bdf8" filter="url(#glow)" />
        <circle cx="120" cy="140" r="4.5" fill="#ffffff" filter="url(#glow)" />
        <circle cx="70" cy="220" r="3" fill="#ec4899" />
        <circle cx="430" cy="60" r="3" fill="#c084fc" />
        <circle cx="380" cy="130" r="4.5" fill="#ffffff" filter="url(#glow)" />
        <circle cx="450" cy="210" r="3" fill="#38bdf8" />
        <circle cx="190" cy="70" r="2.5" fill="#ffffff" />
        <circle cx="310" cy="230" r="2.5" fill="#22d3ee" />
      </svg>

      {/* Foreground Overlay HUD Badge */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono-code text-cyan-300">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>CYBER GEOMETRIC MATRIX &bull; 3D SPATIAL</span>
      </div>
    </div>
  );
};
