import React, { useState, useEffect } from 'react';

interface SpatialCraftVisualProps {
  className?: string;
}

export const SpatialCraftVisual: React.FC<SpatialCraftVisualProps> = ({
  className = '',
}) => {
  const [customImage, setCustomImage] = useState<string | null>(null);

  // Load custom image from localStorage if saved
  useEffect(() => {
    try {
      const saved = localStorage.getItem('custom_spatial_craft_img');
      if (saved) {
        setCustomImage(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const displayImage =
    customImage ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';

  return (
    <div
      className={`relative w-full h-full min-h-[380px] lg:min-h-[460px] overflow-hidden rounded-3xl group/spatial border border-white/15 bg-[#06050b] shadow-2xl transition-all duration-500 hover:border-purple-500/50 ${className}`}
    >
      <div className="relative w-full h-full min-h-[380px] lg:min-h-[460px] bg-black overflow-hidden">
        <img
          src={displayImage}
          alt="Spatial Craft in Motion - 3D kinetic fluid motion, illuminated violet ribbons and spatial depth"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover/spatial:scale-105 transition-transform duration-700 ease-out opacity-95 group-hover/spatial:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06050b]/90 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,_rgba(168,85,247,0.2),_transparent_60%)] pointer-events-none" />
      </div>

      {/* Floating Status Pill */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-purple-500/30 text-[10px] font-mono-code text-purple-300 uppercase tracking-widest pointer-events-none z-20">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>SPATIAL CRAFT &bull; 60 FPS WEBGL</span>
      </div>

      {/* Bottom Technical Spec Footer Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 text-[9px] font-mono-code text-neutral-400">
          <span className="text-cyan-400">GYRO-LERP</span>
          <span>&bull;</span>
          <span>KINETIC FLUID MOTION</span>
        </div>
        <div className="text-[9px] font-mono-code text-purple-300 hidden sm:block">
          TAMEEM NEXUS CORE &bull; 2026
        </div>
      </div>
    </div>
  );
};
