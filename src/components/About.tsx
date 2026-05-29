import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThreeScene } from './ThreeScene';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 120, suffix: '+', label: 'Projects Completed' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 12, suffix: '+', label: 'Years Experience' },
  { value: 25, suffix: '', label: 'Design Awards Won' },
];

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left text reveal
      gsap.from([labelRef.current, headlineRef.current, bodyRef.current, btnRef.current], {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });

      // Stats count-up
      countersRef.current.forEach((el, i) => {
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: STATS[i].value, duration: 2, ease: 'power2.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 75%' },
          onUpdate: () => { el.textContent = Math.round(obj.val).toString(); },
        });
      });

      // Stats fade in
      gsap.from(statsRef.current?.children ?? [], {
        y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: statsRef.current, start: 'top 75%' },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        background: 'var(--bg-primary)',
        gap: '60px',
        alignItems: 'center',
      }}
      className="about-section-grid"
    >
      {/* Left — Text */}
      <div className="about-text">
        <p ref={labelRef} style={{
          fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px, 1.2vw, 11px)',
          letterSpacing: '3px', textTransform: 'uppercase',
          color: '#D4B16A', marginBottom: '20px',
        }}>About Us</p>

        <h2 ref={headlineRef} style={{
          fontFamily: 'var(--font-serif)', fontWeight: 300,
          fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)', // Fluid sizing
          lineHeight: 1.15, color: 'var(--color-white)',
          marginBottom: '24px',
        }}>
          Design is not just<br />what it looks like.<br />
          <em style={{ color: '#D4B16A', fontStyle: 'italic' }}>It's how it feels.</em>
        </h2>

        <p ref={bodyRef} style={{
          fontFamily: 'var(--font-sans)', fontSize: 'clamp(13px, 1.2vw, 15px)', lineHeight: 1.8,
          color: 'var(--color-gray)', marginBottom: '32px',
        }}>
          We are a multidisciplinary interior design studio passionate about creating spaces that evoke emotion and elevate everyday living.
        </p>

        <a
          ref={btnRef}
          href="#contact"
          className="btn-gold"
          data-cursor="explore"
          style={{
            minHeight: '48px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
        >
          Our Story <span className="arrow" style={{ marginLeft: '6px' }}>→</span>
        </a>
      </div>

      {/* Center — 3D Apartment Model */}
      <div 
        className="about-model"
        style={{
          height: '480px', position: 'relative',
          borderRadius: '4px', overflow: 'hidden',
        }}
      >
        <ThreeScene type="apartment" />
        <p style={{
          position: 'absolute', bottom: '12px', left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-sans)', fontSize: '9px',
          letterSpacing: '2px', textTransform: 'uppercase',
          color: 'rgba(212,177,106,0.6)',
          display: 'flex', alignItems: 'center', gap: '8px',
          whiteSpace: 'nowrap',
        }}>
          <span>↺</span> Drag to Rotate
        </p>
      </div>

      {/* Right — Statistics */}
      <div 
        ref={statsRef} 
        className="about-stats"
        style={{
          display: 'flex', flexDirection: 'column', gap: '40px',
        }}
      >
        {STATS.map((stat, i) => (
          <div key={stat.label} style={{
            borderLeft: '2px solid rgba(212,177,106,0.3)',
            paddingLeft: '20px',
          }}>
            {/* Icon placeholder */}
            <div style={{
              width: '26px', height: '26px',
              border: '1px solid rgba(212,177,106,0.3)',
              borderRadius: '6px', marginBottom: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px',
            }}>
              {['🏠','✓','◷','✦'][i]}
            </div>
            <div style={{
              fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.0rem, 3vw, 3.2rem)',
              fontWeight: 300, color: '#D4B16A', lineHeight: 1,
              marginBottom: '6px',
            }}>
              <span ref={el => { countersRef.current[i] = el; }}>0</span>
              <span>{stat.suffix}</span>
            </div>
            <p style={{
              fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px, 1vw, 11px)',
              letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--color-gray)',
            }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <style>{`
        .about-section-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr 0.9fr;
          padding: 120px 8%;
        }
        @media (max-width: 1024px) {
          .about-section-grid {
            grid-template-columns: 1fr 1fr;
            padding: 80px 8%;
            gap: 48px;
          }
          .about-text { grid-column: 1; }
          .about-model { grid-column: 2; height: 380px !important; }
          .about-stats { 
            grid-column: span 2; 
            display: grid !important; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 30px !important;
            margin-top: 20px;
          }
        }
        @media (max-width: 768px) {
          .about-section-grid {
            grid-template-columns: 1fr !important;
            padding: 60px 6%;
            gap: 36px;
          }
          .about-text { order: 1; grid-column: auto; }
          .about-model { order: 2; grid-column: auto; height: 320px !important; }
          .about-stats { 
            order: 3; 
            grid-column: auto; 
            display: flex !important; 
            flex-direction: column; 
            gap: 32px !important;
            margin-top: 0;
          }
        }
      `}</style>
    </section>
  );
};
