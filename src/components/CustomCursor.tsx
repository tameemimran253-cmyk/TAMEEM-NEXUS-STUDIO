import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const pinRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Completely disable custom cursor on touch devices (phones, tablets)
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        if (pinRef.current) pinRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }
      if (pinRef.current) {
        pinRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      if (pinRef.current) pinRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible = true;
      if (pinRef.current) pinRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };

    // Smooth trailing ring loop without triggering ANY React re-renders
    const renderLoop = () => {
      if (isVisible && ringRef.current) {
        ringX += (mouseX - ringX) * 0.25;
        ringY += (mouseY - ringY) * 0.25;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      animId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <div className="hidden lg:block pointer-events-none select-none">
      {/* Precision Center Pin (Direct GPU transform) */}
      <div
        ref={pinRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 will-change-transform"
        style={{ margin: '-3px 0 0 -3px' }}
      >
        <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
      </div>

      {/* Trailing Outer Ring (Direct GPU transform) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] opacity-0 will-change-transform"
        style={{ margin: '-16px 0 0 -16px' }}
      >
        <div className="w-8 h-8 rounded-full border border-purple-400/50 bg-purple-500/10 transition-colors duration-200" />
      </div>
    </div>
  );
};
