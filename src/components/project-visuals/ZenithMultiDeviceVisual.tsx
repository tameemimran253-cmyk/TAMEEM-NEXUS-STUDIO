import React from 'react';

export const ZenithMultiDeviceVisual: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full min-h-[220px] bg-[#070612] overflow-hidden select-none flex items-center justify-center p-3 sm:p-4 ${className}`}>
      {/* Deep Space / Nebula Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(168,85,247,0.25),_transparent_60%)] pointer-events-none" />

      {/* Composition Container with 3 Devices: Laptop (Left), Tablet (Center/Right), Phone (Right Foreground) */}
      <div className="relative w-full max-w-lg aspect-[16/9] flex items-center justify-center">
        {/* 1. LAPTOP (MacBook Pro) - Left/Center Background */}
        <div className="absolute left-0 bottom-2 w-[65%] h-[80%] bg-neutral-900 rounded-t-xl border border-neutral-700/80 p-2 shadow-2xl flex flex-col justify-between transform -rotate-1 origin-bottom-left">
          {/* Laptop Screen Bezel */}
          <div className="w-full h-full bg-[#0b0c16] rounded-lg border border-neutral-800 p-2.5 flex flex-col justify-between overflow-hidden">
            {/* Top Brand Bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded bg-purple-500 flex items-center justify-center text-[5px] font-bold text-white">Z</div>
                <span className="text-[8px] font-syne font-bold text-white">Zenith</span>
              </div>
              <div className="flex items-center gap-1 text-[6px] font-mono-code text-neutral-400">
                <span className="text-purple-300">Dashboard</span>
                <span>Projects</span>
                <span>Team</span>
              </div>
            </div>

            {/* Laptop Hero Text & Metrics */}
            <div className="grid grid-cols-2 gap-2 my-auto">
              <div className="space-y-1">
                <span className="text-[10px] font-syne font-extrabold text-white leading-tight block">
                  Productivity &<br /><span className="text-purple-400">Wellbeing</span>
                </span>
                <span className="text-[6px] text-neutral-400 leading-tight block">
                  Glassmorphic AI OS
                </span>
                <div className="inline-block px-2 py-0.5 rounded bg-blue-600 text-[6px] text-white font-bold">
                  Get Started
                </div>
              </div>

              {/* Glassmorphic Active Users Widget */}
              <div className="bg-white/[0.05] border border-white/10 rounded-md p-1.5 space-y-1">
                <div className="flex justify-between text-[6px] font-mono-code text-neutral-300">
                  <span>Active Users</span>
                  <span className="text-emerald-400 font-bold">22,57%</span>
                </div>
                {/* Mini Bar Chart */}
                <div className="flex items-end gap-1 h-5 pt-1">
                  <div className="w-1.5 h-2 bg-purple-400/60 rounded-t" />
                  <div className="w-1.5 h-4 bg-purple-400 rounded-t" />
                  <div className="w-1.5 h-3 bg-purple-300 rounded-t" />
                  <div className="w-1.5 h-5 bg-cyan-400 rounded-t" />
                  <div className="w-1.5 h-3.5 bg-purple-500 rounded-t" />
                </div>
              </div>
            </div>

            {/* Bottom Laptop Notch/Base */}
            <div className="h-0.5 bg-neutral-800 rounded-full w-full" />
          </div>
        </div>

        {/* 2. TABLET (iPad Pro) - Right Middle Layer */}
        <div className="absolute right-4 sm:right-8 top-1 w-[48%] h-[82%] bg-neutral-900 rounded-xl border border-neutral-700 p-2 shadow-2xl transform rotate-2">
          <div className="w-full h-full bg-[#0d0e1a] rounded-lg p-2 flex flex-col justify-between border border-white/5">
            {/* Tablet Header */}
            <div className="flex items-center justify-between text-[7px] font-syne font-bold text-white">
              <span>Today's Tasks</span>
              <div className="w-3 h-3 rounded-full bg-purple-500/30 flex items-center justify-center text-[5px]">🔔</div>
            </div>

            {/* Circular Progress Rings */}
            <div className="flex items-center justify-between bg-white/[0.04] p-1.5 rounded-md border border-white/5">
              <div className="space-y-0.5">
                <span className="text-[6px] font-mono-code text-neutral-400 block">Overall Target</span>
                <span className="text-[9px] font-bold text-cyan-300 block">75% Done</span>
              </div>
              {/* Dual Ring SVG */}
              <svg className="w-7 h-7" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#38bdf8"
                  strokeDasharray="75, 100"
                  strokeWidth="3"
                />
              </svg>
            </div>

            {/* Task Category Grid */}
            <div className="grid grid-cols-2 gap-1 text-[6px]">
              <div className="p-1 rounded bg-blue-500/20 border border-blue-500/30 text-blue-300 font-medium">
                Content Creation
              </div>
              <div className="p-1 rounded bg-orange-500/20 border border-orange-500/30 text-orange-300 font-medium">
                Design Feedback
              </div>
            </div>
          </div>
        </div>

        {/* 3. SMARTPHONE (iPhone 16 Pro) - Front Right Foreground */}
        <div className="absolute right-1 bottom-0 w-[28%] h-[84%] bg-black rounded-2xl border-2 border-neutral-600 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-20 transform translate-y-1">
          <div className="w-full h-full bg-[#0a0a14] rounded-xl p-1.5 flex flex-col justify-between border border-white/10">
            {/* Dynamic Island */}
            <div className="w-6 h-1.5 bg-black rounded-full mx-auto" />

            {/* User Greeting */}
            <div className="space-y-0.5 mt-1">
              <span className="text-[7px] font-syne font-bold text-white block">Hello, Alex!</span>
              <div className="p-1 rounded bg-white/[0.06] border border-purple-500/40">
                <span className="text-[5px] font-mono-code text-purple-300 block">UI/UX Review</span>
                <span className="text-[7px] font-bold text-white block">75% Completed</span>
              </div>
            </div>

            {/* Quick Action Tiles */}
            <div className="grid grid-cols-2 gap-0.5">
              <div className="h-4 rounded bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-[5px] text-white font-bold">
                Project
              </div>
              <div className="h-4 rounded bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-[5px] text-white font-bold">
                Design
              </div>
            </div>

            {/* Bottom Nav Bar */}
            <div className="flex justify-around items-center border-t border-white/10 pt-0.5 text-[6px] text-neutral-400">
              <span className="text-purple-400 font-bold">●</span>
              <span>■</span>
              <span>▲</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Product Tag */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-purple-500/30 text-[9px] font-mono-code text-purple-300">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        <span>ZENITH &bull; MULTI-DEVICE SUITE</span>
      </div>
    </div>
  );
};
