import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Trigger completion callback which starts the Hero timeline
        onComplete();
      }
    });

    // 1. Logo fades and slides up slightly
    tl.to(logoRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    // 2. Gold progress line draws across
    tl.to(lineRef.current, {
      width: '100%',
      duration: 1.0,
      ease: 'power2.inOut'
    }, '-=0.3');

    // 3. Subtle glow pulses
    tl.to(logoRef.current, {
      filter: 'drop-shadow(0 0 15px rgba(212, 177, 106, 0.6))',
      duration: 0.4,
      yoyo: true,
      repeat: 1
    }, '-=0.2');

    // 4. Smooth cinematic slide out / fade out of the preloader container
    tl.to(containerRef.current, {
      y: '-100%',
      duration: 1.0,
      ease: 'power4.inOut',
      delay: 0.2
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div className="preloader-container" ref={containerRef}>
      <img
        ref={logoRef}
        src="/Images/AuraPeak Transparent - White Font PNG.png"
        alt="AuraPeak Woodcraft Logo"
        className="preloader-logo"
        style={{ opacity: 0, transform: 'translateY(20px)' }}
      />
      <div className="preloader-line-container">
        <div ref={lineRef} className="preloader-line-glow"></div>
      </div>
    </div>
  );
};
