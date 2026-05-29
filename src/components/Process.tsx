import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { num: '01', title: 'Consultation', desc: 'Understanding your needs and vision.' },
  { num: '02', title: 'Concept', desc: 'Crafting the perfect design concept.' },
  { num: '03', title: 'Design', desc: 'Bringing ideas to life with detail.' },
  { num: '04', title: 'Execution', desc: 'Managing the project with precision.' },
  { num: '05', title: 'Completion', desc: 'Delivering spaces that inspire.' },
];

export const Process: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(labelRef.current, {
        y: 20, opacity: 0, duration: 0.8,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });

      // Gold line animation (Horizontal only)
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1, transformOrigin: 'left center', duration: 1.5, ease: 'power3.inOut',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
          }
        );
      }

      // Steps fade in
      stepsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="process-section-container"
      style={{
        background: 'var(--bg-secondary)',
        alignItems: 'start',
      }}
    >
      {/* Left — Timeline */}
      <div className="process-left-col">
        <p ref={labelRef} style={{
          fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px, 1.2vw, 11px)',
          letterSpacing: '3px', textTransform: 'uppercase',
          color: '#D4B16A', marginBottom: '14px',
        }}>Our Design Process</p>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontWeight: 300,
          fontSize: 'clamp(1.8rem, 3.5vw, 3.0rem)', color: 'var(--color-white)',
          marginBottom: '50px', lineHeight: 1.15,
        }}>How We Work</h2>

        {/* 1. Horizontal Timeline (Desktop/Tablet) */}
        <div className="process-timeline-horizontal">
          {/* Gold connector line */}
          <div style={{ position: 'relative', marginBottom: '40px' }}>
            <div style={{
              height: '1px', background: 'rgba(212,177,106,0.15)',
              position: 'relative', marginBottom: '40px',
            }}>
              <div ref={lineRef} style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '100%',
                background: 'linear-gradient(to right, #D4B16A, rgba(212,177,106,0.3))',
                transformOrigin: 'left center',
              }} />
            </div>

            {/* Step icons row */}
            <div style={{
              display: 'flex', gap: '0',
              justifyContent: 'space-between',
            }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  border: '1px solid rgba(212,177,106,0.5)',
                  background: 'var(--bg-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#D4B16A', fontSize: '11px',
                  fontFamily: 'var(--font-serif)',
                  flexShrink: 0,
                  zIndex: 2,
                }}>
                  {['👤','📐','✏','🔧','✓'][i]}
                </div>
              ))}
            </div>
          </div>

          {/* Steps description row */}
          <div style={{ display: 'flex', gap: '0', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                ref={el => { stepsRef.current[i] = el; }}
                style={{
                  width: 'calc(20% - 8px)', minWidth: '110px',
                  paddingTop: '20px',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-serif)', fontWeight: 300,
                  fontSize: '26px', color: '#D4B16A',
                  display: 'block', marginBottom: '8px',
                }}>{step.num}</span>
                <h3 style={{
                  fontFamily: 'var(--font-sans)', fontSize: '12px',
                  fontWeight: 500, color: 'var(--color-white)',
                  textTransform: 'uppercase', letterSpacing: '1.5px',
                  marginBottom: '8px',
                }}>{step.title}</h3>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '12px',
                  lineHeight: 1.6, color: 'var(--color-gray)',
                }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Vertical Timeline (Mobile only) */}
        <div className="process-timeline-vertical">
          <div className="vertical-line" />
          {STEPS.map((step, i) => (
            <div key={step.num} className="vertical-step-row" ref={el => { if (window.innerWidth < 768) stepsRef.current[i] = el; }}>
              <div className="vertical-step-icon">
                {['👤','📐','✏','🔧','✓'][i]}
              </div>
              <div className="vertical-step-content">
                <span className="vertical-step-num">{step.num}</span>
                <h3 className="vertical-step-title">{step.title}</h3>
                <p className="vertical-step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Arch image */}
      <div className="process-right-image">
        <img
          src="/Images/process_arch.png"
          alt="Design process"
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: 'brightness(0.85)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(5,5,5,0.6) 0%, transparent 60%)',
        }} />
      </div>

      <style>{`
        .process-section-container {
          display: grid;
          grid-template-columns: 1fr 0.7fr;
          gap: 60px;
          padding: 120px 8%;
        }
        .process-timeline-vertical {
          display: none;
        }
        .process-right-image {
          position: relative;
          borderRadius: '4px';
          overflow: 'hidden';
          height: 480px;
        }

        @media (max-width: 1024px) {
          .process-section-container {
            grid-template-columns: 1fr;
            gap: 48px;
            padding: 80px 8%;
          }
          .process-right-image {
            height: 380px;
          }
        }

        @media (max-width: 768px) {
          .process-section-container {
            padding: 60px 6%;
            gap: 36px;
          }
          .process-timeline-horizontal {
            display: none !important;
          }
          .process-timeline-vertical {
            display: block;
            position: relative;
            padding-left: 50px;
            margin-top: 10px;
          }
          .vertical-line {
            position: absolute;
            left: 17px;
            top: 10px;
            bottom: 10px;
            width: 1px;
            background: linear-gradient(to bottom, #D4B16A, rgba(212,177,106,0.15));
          }
          .vertical-step-row {
            position: relative;
            margin-bottom: 32px;
          }
          .vertical-step-row:last-child {
            margin-bottom: 0;
          }
          .vertical-step-icon {
            position: absolute;
            left: -50px;
            top: 2px;
            width: 34px;
            height: 34px;
            borderRadius: 50%;
            border: 1px solid rgba(212,177,106,0.45);
            background: var(--bg-secondary);
            display: flex;
            alignItems: center;
            justifyContent: center;
            color: '#D4B16A';
            fontSize: 11px;
            zIndex: 2;
          }
          .vertical-step-content {
            padding-left: 10px;
          }
          .vertical-step-num {
            font-family: var(--font-serif);
            font-weight: 300;
            font-size: 22px;
            color: #D4B16A;
            display: block;
            margin-bottom: 2px;
          }
          .vertical-step-title {
            font-family: var(--font-sans);
            font-size: 13px;
            font-weight: 500;
            color: var(--color-white);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
          }
          .vertical-step-desc {
            font-family: var(--font-sans);
            font-size: 12px;
            line-height: 1.6;
            color: var(--color-gray);
          }
          .process-right-image {
            height: 320px;
          }
        }
      `}</style>
    </section>
  );
};
