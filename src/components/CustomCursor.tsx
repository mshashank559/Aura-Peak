import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Skip on mobile devices
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (isMobile) return;

    const dot = dotRef.current;
    const follower = followerRef.current;
    const labelSpan = labelRef.current;
    if (!dot || !follower || !labelSpan) return;

    // Set initial position out of screen with GPU force3D
    gsap.set([dot, follower], { xPercent: -50, yPercent: -50, force3D: true });

    // Use fast GPU accelerated transforms with quickTo
    const xDotTo = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3', force3D: true });
    const yDotTo = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3', force3D: true });
    
    const xFollowerTo = gsap.quickTo(follower, 'x', { duration: 0.25, ease: 'power3.out', force3D: true });
    const yFollowerTo = gsap.quickTo(follower, 'y', { duration: 0.25, ease: 'power3.out', force3D: true });

    // Single passive mousemove handler to minimize thread overhead
    const onMouseMove = (e: MouseEvent) => {
      xDotTo(e.clientX);
      yDotTo(e.clientY);
      xFollowerTo(e.clientX);
      yFollowerTo(e.clientY);
    };

    // Direct DOM manipulation on hover - bypass React re-renders entirely
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactiveEl = target.closest('[data-cursor], button, a, .interactive-card, .btn-gold');
      
      if (interactiveEl) {
        dot.classList.add('active');
        follower.classList.add('active');
        const cursorAttr = interactiveEl.getAttribute('data-cursor');
        labelSpan.textContent = cursorAttr ? cursorAttr.toUpperCase() : '';
      } else {
        dot.classList.remove('active');
        follower.classList.remove('active');
        labelSpan.textContent = '';
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches;
  if (isMobile) return null;

  return (
    <>
      <div 
        ref={dotRef} 
        className="custom-cursor"
        style={{ willChange: 'transform', pointerEvents: 'none', position: 'fixed', zIndex: 10000 }}
      />
      <div 
        ref={followerRef} 
        className="custom-cursor-follower"
        style={{ willChange: 'transform', pointerEvents: 'none', position: 'fixed', zIndex: 9999 }}
      >
        <span ref={labelRef}></span>
      </div>
    </>
  );
};
