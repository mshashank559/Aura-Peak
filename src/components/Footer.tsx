import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = ['Home', 'About', 'Projects', 'Services', 'Journal', 'Contact'];

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'Pinterest', href: '#' },
  { label: 'LinkedIn', href: '#' },
];

interface FooterProps {
  isDark: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDark }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ctaRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollToSection = (label: string) => {
    const id = label.toLowerCase().replace("'", '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* CTA Band */}
      <section
        id="contact"
        ref={sectionRef}
        className="footer-cta-section"
        style={{
          background: 'var(--bg-primary)',
          borderTop: '1px solid rgba(212,177,106,0.1)',
        }}
      >
        <h2
          ref={ctaRef}
          style={{
            fontFamily: 'var(--font-serif)', fontWeight: 300,
            fontSize: 'clamp(1.8rem, 5vw, 4.2rem)',
            color: 'var(--color-white)', lineHeight: 1.1,
            marginBottom: '40px', maxWidth: '600px',
          }}
        >
          Let's create something<br />
          <em style={{ color: '#D4B16A', fontStyle: 'italic' }}>extraordinary</em> together.
        </h2>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '60px' }}>
          <a
            href="mailto:hello@aurapeak.com"
            className="btn-gold"
            data-cursor="open"
            style={{
              fontSize: 'clamp(12px, 1.4vw, 14px)',
              minHeight: '48px', // touch-friendly
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            Get In Touch <span className="arrow">→</span>
          </a>
        </div>

        {/* Contact info bar */}
        <div className="footer-contact-bar">
          {[
            { icon: '✉', label: 'Email', value: 'hello@aurapaakwoodcraft.com' },
            { icon: '☎', label: 'Phone', value: '+1 (234) 567-890' },
            { icon: '◎', label: 'Location', value: 'New York, USA' },
          ].map(c => (
            <div key={c.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <span style={{ color: '#D4B16A', fontSize: '16px', marginTop: '2px' }}>{c.icon}</span>
              <div>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: '10px',
                  letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-gray)',
                  marginBottom: '4px',
                }}>{c.label}</p>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: 'clamp(12px, 1.2vw, 14px)',
                  color: 'var(--color-white)',
                }}>{c.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Bottom Bar */}
      <footer className="footer-bottom-bar" style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid rgba(212,177,106,0.08)',
      }}>
        {/* Logo */}
        <img
          src={isDark
            ? '/Images/AuraPeak Transparent - White Font PNG.png'
            : '/Images/AuraPeak Transparent - Dark Font PNG.png'}
          alt="AuraPeak Woodcraft"
          style={{ height: 'clamp(24px, 3vw, 34px)', width: 'auto' }}
        />

        {/* Nav Links */}
        <nav className="footer-nav-links">
          {NAV_LINKS.map(link => (
            <button
              key={link}
              onClick={() => scrollToSection(link)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: '11px',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                color: 'var(--color-gray)', textDecoration: 'none',
                transition: 'color 0.3s',
                padding: '8px 4px', // enlarged touch target
                minHeight: '36px',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#D4B16A')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-gray)')}
            >{link}</button>
          ))}
        </nav>

        {/* Mobile Social Links Row (hidden on desktop where Hero sidebar is shown) */}
        <div className="footer-social-links">
          {SOCIAL_LINKS.map(s => (
            <a
              key={s.label}
              href={s.href}
              style={{
                fontFamily: 'var(--font-sans)', fontSize: '11px',
                letterSpacing: '1px', color: 'rgba(212,177,106,0.7)',
                textDecoration: 'none', transition: 'color 0.3s',
                padding: '6px 0',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#D4B16A')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,177,106,0.7)')}
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* Copyright + Back to Top */}
        <div className="footer-copyright-row">
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: 'clamp(10px, 1vw, 11px)',
            color: 'var(--color-gray)', letterSpacing: '0.5px',
          }}>
            © 2025 AuraPeak Woodcraft Ltd. All rights reserved.
          </p>
          <button
            ref={topRef}
            onClick={scrollTop}
            aria-label="Back to top"
            style={{
              width: '42px', height: '42px', borderRadius: '50%',
              border: '1px solid rgba(212,177,106,0.35)',
              background: 'none', cursor: 'pointer',
              color: '#D4B16A', fontSize: '16px',
              transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#D4B16A';
              (e.currentTarget as HTMLButtonElement).style.color = '#050505';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
              (e.currentTarget as HTMLButtonElement).style.color = '#D4B16A';
            }}
          >↑</button>
        </div>
      </footer>

      <style>{`
        /* ── CTA Section ── */
        .footer-cta-section {
          padding: 100px 8% 70px;
        }
        .footer-contact-bar {
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
          padding-top: 40px;
          border-top: 1px solid rgba(212,177,106,0.1);
        }

        /* ── Footer Bottom ── */
        .footer-bottom-bar {
          padding: 28px 8%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }
        .footer-nav-links {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          align-items: center;
        }
        .footer-social-links {
          display: none; /* shown only on mobile */
        }
        .footer-copyright-row {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        /* ── Tablet (<=1024px) ── */
        @media (max-width: 1024px) {
          .footer-cta-section {
            padding: 80px 8% 50px;
          }
          .footer-contact-bar {
            gap: 28px;
          }
        }

        /* ── Mobile (<=768px) ── */
        @media (max-width: 768px) {
          .footer-cta-section {
            padding: 60px 6% 40px;
          }
          .footer-contact-bar {
            flex-direction: column;
            gap: 22px;
          }
          .footer-bottom-bar {
            flex-direction: column;
            align-items: flex-start;
            padding: 32px 6%;
            gap: 28px;
          }
          .footer-nav-links {
            gap: 12px 20px;
            justify-content: flex-start;
          }
          .footer-social-links {
            display: flex; /* visible on mobile */
            gap: 16px;
            flex-wrap: wrap;
            padding-top: 8px;
            border-top: 1px solid rgba(212,177,106,0.1);
            width: 100%;
          }
          .footer-copyright-row {
            width: 100%;
            justify-content: space-between;
            border-top: 1px solid rgba(212,177,106,0.07);
            padding-top: 20px;
          }
        }

        /* ── Small Mobile (<=480px) ── */
        @media (max-width: 480px) {
          .footer-nav-links {
            gap: 10px 16px;
          }
          .footer-bottom-bar {
            padding: 28px 5%;
          }
        }
      `}</style>
    </>
  );
};
