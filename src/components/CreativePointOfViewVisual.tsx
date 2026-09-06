import React, { useState, useEffect } from 'react';

interface CreativePointOfViewVisualProps {
  className?: string;
}

export const CreativePointOfViewVisual: React.FC<CreativePointOfViewVisualProps> = ({
  className = '',
}) => {
  const [customImage, setCustomImage] = useState<string | null>(null);

  // Load custom image from localStorage if saved
  useEffect(() => {
    try {
      const saved = localStorage.getItem('custom_creative_pov_img');
      if (saved) {
        setCustomImage(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const displayImage =
    customImage ||
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop';

  return (
    <div
      className={`relative w-full h-full min-h-[380px] lg:min-h-[480px] overflow-hidden rounded-3xl group/pov border border-white/15 bg-[#07060e] shadow-2xl transition-all duration-500 hover:border-purple-500/50 ${className}`}
    >
      <div className="relative w-full h-full min-h-[380px] lg:min-h-[480px] bg-black overflow-hidden">
        <img
          src={displayImage}
          alt="Technology with a Creative Point of View - Glass crystal cube with refracted violet laser light, dark mineral rock, and metallic swirl"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover/pov:scale-105 transition-transform duration-700 ease-out opacity-95 group-hover/pov:opacity-100"
        />
        {/* Subtle Atmosphere & Technical Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06050c]/90 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,_rgba(168,85,247,0.25),_transparent_60%)] pointer-events-none" />
      </div>

      {/* Floating CAD Technical Grid Marker */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-purple-500/30 text-[10px] font-mono-code text-purple-300 uppercase tracking-widest pointer-events-none z-20">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        <span>CREATIVE POINT OF VIEW &bull; 2026 ARCHITECTURE</span>
      </div>

      {/* Bottom Technical Spec Footer Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 text-[9px] font-mono-code text-neutral-400">
          <span className="text-purple-400">ISO-9001</span>
          <span>&bull;</span>
          <span>OPTICAL REFRACTION MATRIX</span>
        </div>
        <div className="text-[9px] font-mono-code text-purple-300 hidden sm:block">
          TAMEEM NEXUS STUDIO &bull; 2026
        </div>
      </div>
    </div>
  );
};
