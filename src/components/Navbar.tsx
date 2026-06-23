import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const NAV_LINKS = ['Home', 'About', 'Projects', 'Services', 'Journal', 'Contact'];

const SOCIAL_LINKS = [
  { label: 'FACEBOOK', href: '#' },
  { label: 'INSTAGRAM', href: '#' },
  { label: 'PINTEREST', href: '#' },
  { label: 'LINKEDIN', href: '#' },
];

export const Navbar: React.FC<NavbarProps> = ({ isDark, onToggleTheme }) => {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Magnetic button effect (Desktop only)
  const btnRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (isMobile) return;

    const btn = btnRef.current;
    if (!btn) return;
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: 'power2.out' });
    };
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });
    };
    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);
    return () => {
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      (window as any).lenis?.stop();
    } else {
      document.body.style.overflow = '';
      (window as any).lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      (window as any).lenis?.start();
    };
  }, [menuOpen]);

  const scrollToSection = (label: string) => {
    const id = label.toLowerCase().replace("'", '');
    const el = document.getElementById(id);
    setMenuOpen(false);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' });
      }, 350); // wait for menu closing animation
    }
  };

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '0 8%',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
        background: scrolled
          ? isDark
            ? 'rgba(5,5,5,0.88)'
            : 'rgba(247,245,242,0.88)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
        borderBottom: scrolled 
          ? isDark 
            ? '1px solid rgba(212,177,106,0.12)' 
            : '1px solid rgba(5,5,5,0.06)'
          : 'none',
      }}
    >
      {/* Logo - responsive sizing */}
      <a 
        href="#home" 
        onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} 
        style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', zIndex: 1001 }}
      >
        <img
          src={isDark || menuOpen
            ? '/Images/AuraPeak Transparent - White Font PNG.png'
            : '/Images/AuraPeak Transparent - Dark Font PNG.png'}
          alt="AuraPeak Woodcraft"
          style={{ 
            height: 'clamp(28px, 4.5vw, 40px)', 
            width: 'auto', 
            objectFit: 'contain',
            transition: 'opacity 0.3s'
          }}
        />
      </a>

      {/* Desktop Navigation Links */}
      <ul style={{
        display: 'flex', gap: '36px', listStyle: 'none', margin: 0, padding: 0,
        alignItems: 'center',
      }} className="nav-desktop">
        {NAV_LINKS.map(link => (
          <li key={link}>
            <button
              onClick={() => scrollToSection(link)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontSize: '13px',
                letterSpacing: '1.5px', textTransform: 'uppercase',
                color: isDark ? 'rgba(247,245,242,0.75)' : 'rgba(5,5,5,0.7)',
                transition: 'color 0.3s',
                padding: '4px 0',
                position: 'relative',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#D4B16A')}
              onMouseLeave={e => (e.currentTarget.style.color = isDark ? 'rgba(247,245,242,0.75)' : 'rgba(5,5,5,0.7)')}
            >
              {link}
            </button>
          </li>
        ))}
      </ul>

      {/* Right Side Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 1001 }}>
        {/* Theme Toggle - Hidden when mobile menu is open */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          style={{
            background: 'none', 
            border: isDark || menuOpen 
              ? '1px solid rgba(212,177,106,0.35)' 
              : '1px solid rgba(5,5,5,0.25)',
            borderRadius: '50%', width: '38px', height: '38px',
            cursor: 'pointer', display: menuOpen ? 'none' : 'flex', 
            alignItems: 'center', justifyContent: 'center',
            color: '#D4B16A', fontSize: '16px', transition: 'all 0.3s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,177,106,0.15)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'none';
          }}
        >
          {isDark ? '☀' : '☾'}
        </button>

        {/* Let's Talk CTA */}
        <a
          ref={btnRef}
          href="#contact"
          onClick={e => { e.preventDefault(); scrollToSection('contact'); }}
          className="btn-gold nav-cta"
          data-cursor="open"
          style={{ 
            fontSize: '12px', 
            padding: '11px 22px', 
            letterSpacing: '1.5px',
            minHeight: '48px', // touch-friendly target size
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Let's Talk <span className="arrow" style={{ marginLeft: '6px' }}>→</span>
        </a>

        {/* Mobile Hamburger Toggle */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', background: 'none', border: 'none',
            cursor: 'pointer', flexDirection: 'column', gap: '6px',
            padding: '12px', // Touch target size padding
            minWidth: '48px', minHeight: '48px',
            justifyContent: 'center', alignItems: 'center',
          }}
          aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: '22px', height: '1.5px',
              background: '#D4B16A',
              transform: menuOpen && i === 0 ? 'translateY(7.5px) rotate(45deg)' : menuOpen && i === 2 ? 'translateY(-7.5px) rotate(-45deg)' : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }} />
          ))}
        </button>
      </div>

      {/* Luxury Full-Screen Mobile Menu Overlay */}
      <div 
        data-lenis-prevent
        style={{
          position: 'fixed',
          inset: 0,
          background: '#050505',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '120px 10% 60px',
          zIndex: 1050,
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          transform: menuOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, -20px, 0)',
          overflowY: 'auto',
          maxHeight: '100vh',
        }}
      >
        {/* Menu Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {NAV_LINKS.map((link, index) => (
            <button 
              key={link} 
              onClick={() => scrollToSection(link)} 
              style={{
                background: 'none', border: 'none', textAlign: 'left',
                fontFamily: 'var(--font-serif)', 
                fontSize: 'clamp(2.2rem, 5.5vw, 3.5rem)', 
                fontWeight: 300,
                color: '#F7F5F2', 
                cursor: 'pointer',
                letterSpacing: '1px',
                padding: '10px 0',
                display: 'flex',
                alignItems: 'baseline',
                gap: '16px',
                transition: 'transform 0.3s, color 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#D4B16A';
                e.currentTarget.style.transform = 'translateX(8px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#F7F5F2';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <span style={{ 
                fontFamily: 'var(--font-sans)', 
                fontSize: '11px', 
                color: '#D4B16A', 
                letterSpacing: '2px' 
              }}>
                {String(index + 1).padStart(2, '0')}.
              </span>
              {link}
            </button>
          ))}
        </div>

        {/* Integrated Social Links & Info */}
        <div style={{ 
          borderTop: '1px solid rgba(212,177,106,0.15)', 
          paddingTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '9px',
            letterSpacing: '2px',
            color: 'rgba(247,245,242,0.4)',
            textTransform: 'uppercase'
          }}>Connect with us</p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {SOCIAL_LINKS.map(s => (
              <a 
                key={s.label} 
                href={s.href} 
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  letterSpacing: '1.5px',
                  color: '#D4B16A',
                  textDecoration: 'none',
                  transition: 'opacity 0.3s',
                  padding: '8px 0', // touch buffer
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .nav-desktop { display: none !important; }
          .nav-cta { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};
