import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROJECTS = [
  {
    id: 'modern-serenity',
    title: 'Modern Serenity',
    category: 'Residential',
    img: '/Images/project_serenity.png',
  },
  {
    id: 'urban-warmth',
    title: 'Urban Warmth',
    category: 'Apartment',
    img: '/Images/service_interior.png',
  },
  {
    id: 'earthy-elegance',
    title: 'Earthy Elegance',
    category: 'Villa',
    img: '/Images/service_furniture.png',
  },
  {
    id: 'outdoor-oasis',
    title: 'Outdoor Oasis',
    category: 'Terrace',
    img: '/Images/project_oasis.png',
  },
];

const ProjectCard: React.FC<{ project: typeof PROJECTS[0] }> = ({ project }) => {
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <div
      id={project.id}
      data-cursor="view"
      className="project-card interactive-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '4px', overflow: 'hidden', cursor: 'pointer',
        background: '#0d0d0d',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.55)' : '0 8px 24px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.4s, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
      }}
    >
      {/* Image container */}
      <div style={{ height: '320px', overflow: 'hidden' }}>
        <img
          ref={imgRef}
          src={project.img}
          alt={project.title}
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
            transform: hovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />
      </div>

      {/* Hover overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.3) 60%, transparent 100%)',
        opacity: hovered ? 1 : 0.65,
        transition: 'opacity 0.3s',
      }} />

      {/* Arrow button */}
      <div style={{
        position: 'absolute', top: '16px', right: '16px',
        width: '36px', height: '36px', borderRadius: '50%',
        border: '1px solid rgba(212,177,106,0.5)',
        background: 'rgba(5,5,5,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#D4B16A', fontSize: '13px',
        transform: hovered ? 'rotate(45deg)' : 'rotate(0deg)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), background 0.3s',
      }}>→</div>

      {/* Bottom info */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '24px 20px',
        transform: hovered ? 'translateY(0)' : 'translateY(6px)',
        transition: 'transform 0.3s',
      }}>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: '9px',
          letterSpacing: '2.5px', textTransform: 'uppercase',
          color: '#D4B16A', marginBottom: '6px',
        }}>{project.category}</p>
        <h3 style={{
          fontFamily: 'var(--font-serif)', fontWeight: 400,
          fontSize: 'clamp(20px, 2.5vw, 24px)', color: '#F7F5F2',
          letterSpacing: '0.5px',
        }}>{project.title}</h3>
      </div>
    </div>
  );
};

export const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Only register Horizontal Pinned ScrollTrigger on screen widths >= 1024px (desktop)
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    const ctx = gsap.context(() => {
      gsap.from(labelRef.current, {
        y: 20, opacity: 0, duration: 0.8,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });

      const track = trackRef.current;
      if (!track) return;
      const totalWidth = track.scrollWidth - track.offsetWidth;
      if (totalWidth <= 0) return;

      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${totalWidth + 400}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="projects-section-container"
      style={{
        background: 'var(--bg-primary)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', marginBottom: '50px', flexWrap: 'wrap', gap: '20px',
      }}>
        <div>
          <p ref={labelRef} style={{
            fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px, 1.2vw, 11px)',
            letterSpacing: '3px', textTransform: 'uppercase',
            color: '#D4B16A', marginBottom: '14px',
          }}>Featured Projects</p>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontWeight: 300,
            fontSize: 'clamp(1.8rem, 3.5vw, 3.2rem)', color: 'var(--color-white)',
            lineHeight: 1.1,
          }}>Our Portfolio</h2>
        </div>
        <a
          href="#"
          className="btn-gold"
          style={{ 
            fontSize: '12px', 
            padding: '11px 24px',
            minHeight: '48px', // touch-friendly
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          data-cursor="explore"
          onClick={e => e.preventDefault()}
        >
          View All Projects <span className="arrow" style={{ marginLeft: '6px' }}>→</span>
        </a>
      </div>

      {/* Horizontal scroll track / fallback grid */}
      <div 
        ref={trackRef} 
        className="projects-track"
        style={{
          display: 'flex', gap: '24px', willChange: 'transform',
          paddingBottom: '20px',
        }}
      >
        {PROJECTS.map(p => (
          <div key={p.id} className="project-card-wrap">
            <ProjectCard project={p} />
          </div>
        ))}
      </div>

      <style>{`
        .projects-section-container {
          padding: 120px 8%;
        }
        .project-card-wrap {
          width: clamp(260px, 28vw, 380px);
          flex-shrink: 0;
        }
        .project-card {
          width: 100%;
        }
        @media (max-width: 1024px) {
          .projects-section-container {
            padding: 80px 8%;
          }
          .project-card-wrap {
            width: 100% !important;
          }
          .projects-track {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
            transform: none !important;
          }
        }
        @media (max-width: 768px) {
          .projects-section-container {
            padding: 60px 6%;
          }
          .projects-track {
            display: flex !important;
            flex-direction: column !important;
            gap: 24px !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
};
