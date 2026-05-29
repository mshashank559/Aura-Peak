import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Fireplace } from './Fireplace';

interface HeroProps {
  isDark: boolean;
}

const SOCIAL_LINKS = [
  { label: 'FB', href: '#' },
  { label: 'IG', href: '#' },
  { label: 'PI', href: '#' },
  { label: 'LI', href: '#' },
];

const SLIDES = ['01 Living Room', '02 Kitchen', '03 Bedroom', '04 Outdoor'];

export const Hero: React.FC<HeroProps> = ({ isDark: _isDark }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxWrapperRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const fireplaceBoxRef = useRef<HTMLDivElement>(null);

  // Cinematic entrance timeline
  useEffect(() => {
    const tl = gsap.timeline({ paused: true });

    // Background reveal
    tl.fromTo(bgRef.current, 
      { scale: 1.06, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 1.4, ease: 'power3.out' }, 
      0
    );

    // Fireplace ignition flicker (matches background slide reveal)
    tl.fromTo(fireplaceBoxRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.6, ease: 'power2.in' }, 
      0.6
    );

    // Headline: word by word reveal
    if (headlineRef.current) {
      const words = headlineRef.current.querySelectorAll('.word');
      tl.fromTo(words,
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power4.out' },
        0.7
      );
    }

    // Sub description
    tl.fromTo(subRef.current, 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 
      1.3
    );

    // CTA Button
    tl.fromTo(ctaRef.current, 
      { opacity: 0, y: 12 }, 
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 
      1.6
    );

    // Scroll indicator
    tl.fromTo(scrollHintRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.6, ease: 'power2.out' }, 
      1.9
    );

    // Bind startup handler to window
    (window as any).__heroStart = () => tl.play();

    return () => { 
      delete (window as any).__heroStart; 
    };
  }, []);

  // Optimized mouse move parallax loop using LERP and requestAnimationFrame batching
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (isMobile) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth: W, innerHeight: H } = window;
      const dx = (e.clientX / W - 0.5);
      const dy = (e.clientY / H - 0.5);
      
      // Reduced parallax intensity by 40% for elegant restraint
      targetX = dx * 10.8;
      targetY = dy * 6.0;
    };

    const tick = () => {
      // Linear interpolation to make shifts smooth and fluid without dropping frames
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (parallaxWrapperRef.current) {
        // Grouped transform under a single container to prevent multiple reflows
        parallaxWrapperRef.current.style.transform = `translate3d(${-currentX}px, ${-currentY}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      style={{
        position: 'relative', width: '100vw', 
        minHeight: '100vh', // Fallback for browsers not supporting svh
        height: '100svh', // Prevents address bar shifts on mobile devices
        overflow: 'hidden', padding: 0, margin: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', // Vertically center content below navbar
        paddingTop: '80px', // Spacing below 80px navbar
      }}
    >
      {/* Single Parallax Wrapper Container */}
      <div
        ref={parallaxWrapperRef}
        style={{
          position: 'absolute',
          inset: '-20px', // slightly padded to handle translation offsets cleanly
          willChange: 'transform',
          zIndex: 0,
        }}
      >
        {/* Background Room Image */}
        <div
          ref={bgRef}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/Images/hero_lounge.png)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        />

        {/* Embedded horizontal wall fireplace - aligned with the lounge hearth slot */}
        <div
          ref={fireplaceBoxRef}
          style={{
            position: 'absolute',
            bottom: '22.8%', // locked strictly inside the concrete wall hearth slot
            left: '42.5%',    // center-left placement behind coffee table
            width: '15.4%',   // horizontal linear strip width
            height: '6.5%',   // low profile horizontal slot
            background: 'rgba(5,5,5,0.96)',
            boxShadow: 'inset 0 8px 16px rgba(0,0,0,0.98), 0 0 1px rgba(212,177,106,0.18)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '2px',
            overflow: 'hidden',
            zIndex: 3,
            opacity: 0,
          }}
        >
          <Fireplace />
          {/* Subtle reflection overlay inside slot */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(255,90,10,0.04), transparent)',
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* Fireplace Ambient Glow on Floor & Furniture */}
      <div style={{
        position: 'absolute',
        bottom: '8%',
        left: '32%',
        width: '38%',
        height: '24%',
        background: 'radial-gradient(circle, rgba(212,177,106,0.1) 0%, rgba(212,177,106,0.02) 60%, transparent 100%)',
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        zIndex: 2,
        animation: 'fireplaceFlicker 4s infinite alternate ease-in-out',
      }} />

      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to right, rgba(5,5,5,0.82) 38%, rgba(5,5,5,0.25) 70%, rgba(5,5,5,0.55) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom gradient */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%', zIndex: 2,
        background: 'linear-gradient(to top, rgba(5,5,5,0.96), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Social Links — Left sidebar (Hidden on Mobile/Tablet) */}
      <div 
        className="social-sidebar-desktop"
        style={{
          position: 'absolute', left: '2%', top: '50%',
          transform: 'translateY(-50%)', zIndex: 10,
          display: 'flex', flexDirection: 'column', gap: '18px', alignItems: 'center',
        }}
      >
        <div style={{ width: '1px', height: '60px', background: 'rgba(212,177,106,0.3)', marginBottom: '8px' }} />
        {SOCIAL_LINKS.map(s => (
          <a key={s.label} href={s.href} style={{
            color: 'rgba(247,245,242,0.45)', fontSize: '11px',
            letterSpacing: '1px', textDecoration: 'none', fontFamily: 'var(--font-sans)',
            transition: 'color 0.3s',
            writingMode: 'vertical-rl', textOrientation: 'mixed',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#D4B16A')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(247,245,242,0.45)')}
          >{s.label}</a>
        ))}
        <div style={{ width: '1px', height: '60px', background: 'rgba(212,177,106,0.3)', marginTop: '8px' }} />
      </div>

      {/* Right Slide Index (Hidden on Mobile/Tablet) */}
      <div 
        className="slide-index-desktop"
        style={{
          position: 'absolute', right: '3%', top: '50%',
          transform: 'translateY(-50%)', zIndex: 10,
          display: 'flex', flexDirection: 'column', gap: '14px',
        }}
      >
        {SLIDES.map((slide, i) => (
          <div key={slide} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            justifyContent: 'flex-end',
          }}>
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: '10px',
              letterSpacing: '1px', textTransform: 'uppercase',
              color: i === 0 ? '#D4B16A' : 'rgba(247,245,242,0.3)',
              transition: 'color 0.3s',
            }}>{slide}</span>
            <div style={{
              width: i === 0 ? '28px' : '14px', height: '1px',
              background: i === 0 ? '#D4B16A' : 'rgba(247,245,242,0.2)',
              transition: 'all 0.3s',
            }} />
          </div>
        ))}
      </div>

      {/* Hero Content */}
      <div 
        className="hero-content-container"
        style={{
          position: 'relative', zIndex: 10, padding: '0 8%',
          maxWidth: '850px',
          marginTop: '30px',
        }}
      >
        {/* Label */}
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px, 1.2vw, 12px)',
          letterSpacing: '3px', textTransform: 'uppercase',
          color: '#D4B16A', marginBottom: '20px',
        }}>My Design</p>

        {/* Main headline — 4 words allow proper mobile stacking */}
        <h1
          ref={headlineRef}
          className="hero-headline"
          style={{
            fontFamily: 'var(--font-serif)', fontWeight: 300,
            fontSize: 'clamp(2.0rem, 5.5vw, 6.2rem)',
            lineHeight: 1.05, color: '#F7F5F2',
            letterSpacing: '-1px', marginBottom: '24px',
            overflow: 'hidden',
          }}
        >
          {['SPACES', 'THAT', 'INSPIRE', 'LIFE'].map((word, i) => (
            <span key={i} className="hero-word-line" style={{ display: 'block', overflow: 'hidden' }}>
              <span className="word" style={{ display: 'inline-block' }}>{word}</span>
            </span>
          ))}
        </h1>

        {/* Description */}
        <p
          ref={subRef}
          className="hero-description"
          style={{
            fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px, 1.2vw, 15px)', lineHeight: 1.7,
            color: 'rgba(247,245,242,0.6)', maxWidth: '420px',
            marginBottom: '32px', opacity: 0,
          }}
        >
          We craft timeless, functional and beautiful interiors tailored to you — where luxury meets purpose.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="hero-cta-wrap" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', opacity: 0 }}>
          <button
            className="btn-gold hero-cta-btn"
            data-cursor="explore"
            onClick={scrollToAbout}
            style={{ 
              position: 'relative', 
              zIndex: 1,
              minHeight: '48px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Explore Our Work <span className="arrow" style={{ marginLeft: '6px' }}>→</span>
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        className="scroll-hint-container"
        onClick={scrollToAbout}
        style={{
          position: 'absolute', bottom: '3.5%', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          cursor: 'pointer', zIndex: 10, opacity: 0,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: '9px',
          letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(247,245,242,0.4)',
        }}>Scroll to Explore</span>
        <div style={{
          width: '20px', height: '34px', border: '1px solid rgba(212,177,106,0.3)',
          borderRadius: '10px', display: 'flex', justifyContent: 'center', paddingTop: '4px',
        }}>
          <div style={{
            width: '3px', height: '6px',
            background: '#D4B16A', borderRadius: '1.5px',
            animation: 'scrollDot 1.6s infinite ease-in-out',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          60% { transform: translateY(8px); opacity: 0.3; }
        }
        @keyframes fireplaceFlicker {
          0% { opacity: 0.75; transform: scale(0.98); }
          30% { opacity: 0.9; transform: scale(1.02); }
          70% { opacity: 0.8; transform: scale(0.95); }
          100% { opacity: 0.95; transform: scale(1.04); }
        }

        /* ── Tablet (<=1024px): hide desktop-only decorations ── */
        @media (max-width: 1024px) {
          .social-sidebar-desktop { display: none !important; }
          .slide-index-desktop { display: none !important; }
          .scroll-hint-container { display: none !important; }
        }

        /* ── Mobile (<=768px): full vertical stack hero layout ── */
        @media (max-width: 768px) {
          .hero-content-container {
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: flex-start !important;
            gap: 0 !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
            padding-top: 120px !important;
            padding-bottom: 80px !important;
            margin-top: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            box-sizing: border-box !important;
            text-align: left !important;
          }

          /* Headline: each word on its own line, no overflow */
          .hero-headline {
            font-size: clamp(3rem, 10vw, 5rem) !important;
            letter-spacing: -0.5px !important;
            line-height: 1.0 !important;
            margin-bottom: 20px !important;
            width: 100% !important;
            overflow: visible !important;
          }
          .hero-word-line {
            overflow: visible !important;
            display: block !important;
          }

          /* Description: full width, below headline */
          .hero-description {
            font-size: 14px !important;
            max-width: 100% !important;
            width: 100% !important;
            margin-bottom: 28px !important;
            line-height: 1.65 !important;
          }

          /* CTA: left-aligned, constrained width */
          .hero-cta-wrap {
            width: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .hero-cta-btn {
            width: fit-content !important;
            max-width: 220px !important;
          }
        }

        /* ── Small Mobile (<=480px) ── */
        @media (max-width: 480px) {
          .hero-headline {
            font-size: clamp(2.6rem, 11vw, 4rem) !important;
          }
          .hero-content-container {
            padding-left: 20px !important;
            padding-right: 20px !important;
            padding-top: 100px !important;
          }
        }
      `}</style>
    </section>
  );
};
