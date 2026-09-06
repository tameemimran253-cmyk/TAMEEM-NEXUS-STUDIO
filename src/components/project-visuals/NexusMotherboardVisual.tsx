import React from 'react';

export const NexusMotherboardVisual: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full min-h-[220px] bg-[#03050a] overflow-hidden select-none ${className}`}>
      {/* Background Dark PCB Texture with Circuit Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pcb-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.8" />
            <circle cx="12" cy="12" r="1" fill="rgba(168, 85, 247, 0.2)" />
          </pattern>
          <linearGradient id="cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="rgb-ram" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="rtx-green" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#pcb-grid)" />

        {/* Glowing Circuit Bus Traces */}
        <path
          d="M 20,40 L 90,40 L 130,80 L 220,80 L 250,110 L 340,110"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="1.5"
          strokeDasharray="4,4"
          className="animate-pulse"
        />
        <path
          d="M 40,160 L 110,160 L 150,120 L 200,120 L 230,150 L 380,150"
          fill="none"
          stroke="#a855f7"
          strokeWidth="1.5"
          strokeOpacity="0.7"
        />
        <path
          d="M 60,20 L 120,80 L 120,180 L 180,240"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeOpacity="0.5"
        />
      </svg>

      {/* Motherboard Components Layer */}
      <div className="relative z-10 w-full h-full p-4 sm:p-6 flex flex-col justify-between">
        {/* Top Section: VRM Heatsinks + Trident Z5 RAM */}
        <div className="flex items-start justify-between gap-4">
          {/* Top-Left VRM Black Aluminium Block */}
          <div className="flex gap-2">
            <div className="w-12 sm:w-16 h-8 sm:h-12 bg-gradient-to-br from-neutral-800 to-neutral-950 rounded border border-neutral-700/60 shadow-lg flex flex-col justify-around px-1.5 py-1">
              <div className="h-0.5 bg-neutral-600 rounded-full w-full" />
              <div className="h-0.5 bg-neutral-600 rounded-full w-full" />
              <div className="h-0.5 bg-neutral-600 rounded-full w-4/5" />
            </div>
            {/* CPU Power Copper Heatpipe */}
            <div className="w-2 h-10 sm:h-14 bg-gradient-to-b from-amber-600 via-amber-500 to-amber-700 rounded-full shadow-inner opacity-80" />
          </div>

          {/* Top-Right: G.Skill Trident Z5 RGB Dual RAM Sticks */}
          <div className="flex gap-2 bg-black/60 p-2 rounded-lg border border-white/10 backdrop-blur-sm shadow-xl">
            {/* RAM Stick 1 */}
            <div className="w-5 sm:w-6 h-16 sm:h-20 bg-neutral-900 rounded-sm border border-neutral-700 flex flex-col justify-between p-0.5 relative overflow-hidden">
              <div className="w-full h-3 rounded-t bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse shadow-[0_0_12px_#06b6d4]" />
              <div className="text-[6px] font-mono-code text-neutral-400 rotate-90 text-center tracking-tighter my-auto">
                TRIDENT Z5
              </div>
              <div className="h-1 bg-amber-500/80 w-full" />
            </div>
            {/* RAM Stick 2 */}
            <div className="w-5 sm:w-6 h-16 sm:h-20 bg-neutral-900 rounded-sm border border-neutral-700 flex flex-col justify-between p-0.5 relative overflow-hidden">
              <div className="w-full h-3 rounded-t bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 animate-pulse shadow-[0_0_12px_#a855f7]" />
              <div className="text-[6px] font-mono-code text-neutral-400 rotate-90 text-center tracking-tighter my-auto">
                DDR5 7200
              </div>
              <div className="h-1 bg-amber-500/80 w-full" />
            </div>
          </div>
        </div>

        {/* Center: Intel LGA Processor Socket & MSI M.2 Shield */}
        <div className="flex items-center justify-center my-2 gap-4">
          {/* Intel CPU Socket */}
          <div className="relative w-24 sm:w-28 h-24 sm:h-28 rounded-lg bg-gradient-to-br from-neutral-700 via-neutral-900 to-black p-2 border-2 border-neutral-500/70 shadow-[0_0_20px_rgba(6,182,212,0.25)] flex flex-col items-center justify-center">
            <div className="w-full h-full bg-gradient-to-b from-neutral-300 via-neutral-400 to-neutral-500 rounded flex flex-col items-center justify-center shadow-inner text-black font-mono-code">
              <span className="text-[8px] font-bold tracking-widest text-neutral-800">intel</span>
              <span className="text-[6px] text-neutral-700 tracking-tighter">CORE i9 / LGA1700</span>
              <div className="w-4 h-0.5 bg-neutral-600 my-1 rounded" />
              <span className="text-[5px] text-neutral-600">MALAYSIA 2026</span>
            </div>
            {/* Corner Alignment Gold Marker */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-amber-400 rounded-full" />
          </div>

          {/* MSI SPATIUM M.2 NVMe SSD Heatsink */}
          <div className="hidden sm:flex flex-col justify-center w-28 h-8 bg-neutral-950 border border-neutral-700 rounded px-2 relative shadow-lg">
            <div className="flex items-center justify-between text-[7px] font-mono-code text-neutral-300">
              <span>MSI</span>
              <span className="text-cyan-400">SPATIUM M480 PRO</span>
            </div>
            <div className="w-full h-1 mt-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full shadow-[0_0_8px_#06b6d4]" />
          </div>
        </div>

        {/* Bottom Section: NVIDIA GeForce RTX GPU Shroud with Glowing Logo */}
        <div className="w-full bg-gradient-to-r from-neutral-900 via-black to-neutral-900 border border-white/15 rounded-xl p-2.5 sm:p-3 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Glowing GeForce RTX Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-syne font-extrabold text-emerald-400 tracking-wider">
                GEFORCE RTX
              </span>
            </div>
            <span className="text-[8px] font-mono-code text-neutral-400 hidden sm:inline">
              ADA LOVELACE / 24GB G6X
            </span>
          </div>

          {/* Dual Fan Hub Indicator */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border border-neutral-700 bg-neutral-950 flex items-center justify-center animate-spin" style={{ animationDuration: '6s' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
            </div>
            <div className="w-6 h-6 rounded-full border border-neutral-700 bg-neutral-950 flex items-center justify-center animate-spin" style={{ animationDuration: '6s' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
