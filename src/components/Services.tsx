import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    id: 'interior-design',
    title: 'Interior Design',
    desc: 'Full custom interior design solutions tailored to your lifestyle.',
    img: '/Images/service_interior.png',
    icon: '◈',
  },
  {
    id: 'space-planning',
    title: 'Space Planning',
    desc: 'Smart layouts that maximise space and functionality.',
    img: '/Images/hero_lounge.png',
    icon: '⊞',
  },
  {
    id: '3d-visualization',
    title: '3D Visualization',
    desc: 'Photorealistic renders to visualise your future space.',
    img: '/Images/service_interior.png',
    icon: '◉',
  },
  {
    id: 'custom-furniture',
    title: 'Custom Furniture',
    desc: 'Designer pieces crafted to perfectly fit your home.',
    img: '/Images/service_furniture.png',
    icon: '⊡',
  },
  {
    id: 'lighting-design',
    title: 'Lighting Design',
    desc: 'Curated lighting designs that set the perfect mood.',
    img: '/Images/hero_lounge.png',
    icon: '◎',
  },
  {
    id: 'project-management',
    title: 'Project Management',
    desc: 'End-to-end project management with precision and care.',
    img: '/Images/service_interior.png',
    icon: '◇',
  },
];

const ServiceCard: React.FC<{ service: typeof SERVICES[0]; index: number }> = ({ service }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;

    gsap.to(card, { rotateX: rotX, rotateY: rotY, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
    glow.style.opacity = '1';
  };

  const onMouseLeave = () => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1,0.5)', transformPerspective: 800 });
    glow.style.opacity = '0';
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      id={service.id}
      data-cursor="explore"
      className="interactive-card"
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: '4px', cursor: 'pointer',
        background: hovered ? 'rgba(212,177,106,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? 'rgba(212,177,106,0.35)' : 'rgba(255,255,255,0.07)'}`,
        transition: 'background 0.4s, border-color 0.4s, box-shadow 0.4s',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,177,106,0.1)' : '0 4px 20px rgba(0,0,0,0.3)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Mouse glow */}
      <div ref={glowRef} style={{
        position: 'absolute', width: '180px', height: '180px',
        borderRadius: '50%', pointerEvents: 'none', opacity: 0,
        background: 'radial-gradient(circle, rgba(212,177,106,0.12) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.3s',
        zIndex: 0,
      }} />

      {/* Service image */}
      <div style={{
        height: '160px', overflow: 'hidden', position: 'relative',
      }}>
        <img
          src={service.img}
          alt={service.title}
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
            filter: 'brightness(0.7)',
          }}
        />
        <div style={{
          position: 'absolute', top: '14px', right: '14px',
          width: '32px', height: '32px',
          border: '1px solid rgba(212,177,106,0.5)',
          borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,5,5,0.6)',
          color: '#D4B16A', fontSize: '12px',
          transition: 'all 0.3s',
          transform: hovered ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>+</div>
      </div>

      {/* Content */}
      <div style={{ padding: '22px', position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '20px', color: '#D4B16A', marginBottom: '10px',
          transition: 'transform 0.3s',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        }}>{service.icon}</div>

        <h3 style={{
          fontFamily: 'var(--font-serif)', fontWeight: 400,
          fontSize: '18px', color: 'var(--color-white)',
          marginBottom: '8px', letterSpacing: '0.5px',
        }}>{service.title}</h3>

        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '13px', lineHeight: 1.7,
          color: 'var(--color-gray)',
        }}>{service.desc}</p>
      </div>
    </div>
  );
};

export const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(labelRef.current, {
        y: 20, opacity: 0, duration: 0.8,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.from(gridRef.current?.children ?? [], {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%' },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{ background: 'var(--bg-secondary)' }}
      className="services-section-container"
    >
      {/* Header row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', marginBottom: '50px', flexWrap: 'wrap', gap: '20px',
      }}>
        <div>
          <p ref={labelRef} style={{
            fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px, 1.2vw, 11px)',
            letterSpacing: '3px', textTransform: 'uppercase',
            color: '#D4B16A', marginBottom: '14px',
          }}>Our Services</p>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontWeight: 300,
            fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)', color: 'var(--color-white)',
            lineHeight: 1.1,
          }}>What We Craft</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px' }} className="services-arrows">
          <button style={{
            width: '44px', height: '44px', borderRadius: '50%',
            border: '1px solid rgba(212,177,106,0.3)',
            background: 'none', cursor: 'pointer', color: '#D4B16A', fontSize: '18px',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,177,106,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
          >‹</button>
          <button style={{
            width: '44px', height: '44px', borderRadius: '50%',
            border: '1px solid rgba(212,177,106,0.3)',
            background: 'none', cursor: 'pointer', color: '#D4B16A', fontSize: '18px',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,177,106,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
          >›</button>
        </div>
      </div>

      {/* 6-card grid */}
      <div ref={gridRef} className="services-grid">
        {SERVICES.map((s, i) => (
          <ServiceCard key={s.id} service={s} index={i} />
        ))}
      </div>

      <style>{`
        .services-section-container {
          padding: 120px 8%;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        @media (max-width: 1024px) {
          .services-section-container {
            padding: 80px 8%;
          }
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }
        @media (max-width: 768px) {
          .services-section-container {
            padding: 60px 6%;
          }
          .services-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .services-arrows {
            display: none !important;
          }
        }
      `}</style>
    </section>

  );
};
