import React, { useEffect, useState } from 'react';
import { audio } from '../utils/audioSystem';

interface IntroLoaderProps {
  onComplete: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
              onComplete();
            }, 800);
          }, 200);
          return 100;
        }
        // Organic increment
        const increment = Math.floor(Math.random() * 8) + 3;
        return Math.min(100, prev + increment);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#050505] flex flex-col items-center justify-between p-10 md:p-16 transition-opacity duration-700 select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Status */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono-code tracking-[0.3em] text-neutral-500 uppercase">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-ping" />
          SYSTEM_INITIALIZATION
        </span>
        <span>VERSION 2.6.4</span>
      </div>

      {/* Center Cinematic Brand Typography */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="text-[10px] md:text-xs font-mono-code tracking-[0.4em] text-purple-400 uppercase">
          TAMEEM NEXUS STUDIO
        </div>
        <h1 className="text-4xl md:text-7xl font-cinzel font-light tracking-widest text-white leading-tight">
          DIGITAL<br />INTELLIGENCE
        </h1>
        <p className="text-xs font-mono-code text-neutral-400 tracking-widest max-w-sm">
          SPATIAL 3D WEBGL &bull; AI AGENTS &bull; AUTOMATION
        </p>
      </div>

      {/* Bottom Progress Counter */}
      <div className="w-full max-w-md flex flex-col items-center space-y-3">
        <div className="w-full flex justify-between items-end text-xs font-mono-code text-neutral-400">
          <span className="tracking-widest">LOADING ASSETS & SHADERS</span>
          <span className="text-xl font-bold font-syne text-white tracking-tighter">
            {progress.toString().padStart(2, '0')}%
          </span>
        </div>
        <div className="w-full h-[2px] bg-neutral-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-cyan-400 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
