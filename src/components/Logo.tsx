import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'symbol';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
  variant = 'full',
}) => {
  const sizeMap = {
    sm: { icon: 24, text: 'text-xs', sub: 'text-[8px]' },
    md: { icon: 32, text: 'text-sm', sub: 'text-[9px]' },
    lg: { icon: 44, text: 'text-base md:text-lg', sub: 'text-[10px]' },
    xl: { icon: 60, text: 'text-xl md:text-2xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Geometric TNS Nexus Symbol */}
      <div
        className="relative shrink-0 transition-transform duration-300 group-hover:scale-105"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]"
        >
          <defs>
            <linearGradient id="tns-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="tns-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <linearGradient id="tns-grad-accent" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <filter id="nexus-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Hexagonal Outer Nexus Frame */}
          <polygon
            points="50,4 92,27 92,73 50,96 8,73 8,27"
            stroke="url(#tns-grad-1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-40 group-hover:opacity-80 transition-opacity duration-300"
          />

          {/* Geometric 'T' Top Bar & Pillar (Interlocking Nexus) */}
          <path
            d="M 24 28 L 76 28 L 76 36 L 54 36 L 54 74 L 46 74 L 46 36 L 24 36 Z"
            fill="url(#tns-grad-1)"
            className="transition-all duration-300"
          />

          {/* Geometric 'N' Slanted Bridge / Left Leg */}
          <path
            d="M 24 38 L 32 38 L 32 72 L 24 72 Z"
            fill="url(#tns-grad-2)"
            className="opacity-90"
          />
          <path
            d="M 28 42 L 50 68 L 50 74 L 42 74 L 28 54 Z"
            fill="url(#tns-grad-2)"
            className="opacity-75"
          />

          {/* Geometric 'S' Lower Flow / Right Leg */}
          <path
            d="M 68 38 L 76 38 L 76 72 L 68 72 Z"
            fill="url(#tns-grad-2)"
            className="opacity-90"
          />
          <path
            d="M 50 48 L 72 72 L 64 72 L 46 52 Z"
            fill="url(#tns-grad-accent)"
            className="opacity-80"
          />

          {/* Central Nexus Core Node */}
          <circle
            cx="50"
            cy="50"
            r="4.5"
            fill="#ffffff"
            filter="url(#nexus-glow)"
            className="animate-pulse"
          />
          <circle
            cx="50"
            cy="50"
            r="8"
            stroke="#a855f7"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            className="opacity-80"
          />

          {/* Dynamic Corner Node Pins */}
          <circle cx="50" cy="4" r="2" fill="#38bdf8" />
          <circle cx="92" cy="27" r="2" fill="#a855f7" />
          <circle cx="92" cy="73" r="2" fill="#c084fc" />
          <circle cx="50" cy="96" r="2" fill="#38bdf8" />
          <circle cx="8" cy="73" r="2" fill="#a855f7" />
          <circle cx="8" cy="27" r="2" fill="#c084fc" />
        </svg>
      </div>

      {/* Typography */}
      {showText && variant !== 'symbol' && (
        <div className="flex flex-col text-left leading-none">
          <div className={`font-syne font-extrabold tracking-[0.22em] text-white group-hover:text-purple-200 transition-colors ${currentSize.text}`}>
            TAMEEM NEXUS
          </div>
          <div className={`font-mono-code tracking-[0.35em] text-neutral-400 group-hover:text-purple-300 uppercase transition-colors mt-1 ${currentSize.sub}`}>
            STUDIO
          </div>
        </div>
      )}
    </div>
  );
};
