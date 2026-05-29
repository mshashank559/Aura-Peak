import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Projects } from './components/Projects';
import { Process } from './components/Process';
import { Footer } from './components/Footer';

import './index.css';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Lenis smooth scroll — init only after preloader completes
  useEffect(() => {
    if (!preloaderDone) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP's ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger in sync
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [preloaderDone]);

  // Trigger hero entrance after preloader
  const handlePreloaderComplete = () => {
    setPreloaderDone(true);

    // 0.3s: navbar fades in via CSS class
    setTimeout(() => {
      document.getElementById('ap-navbar')?.classList.add('navbar-visible');

      // 0.5s later: start hero cinematic timeline
      setTimeout(() => {
        if (typeof (window as any).__heroStart === 'function') {
          (window as any).__heroStart();
        }
      }, 500);
    }, 300);
  };

  // Theme body class
  useEffect(() => {
    document.body.className = isDark ? '' : 'light-mode';
    document.documentElement.style.background = isDark ? '#050505' : '#F7F5F2';
  }, [isDark]);

  // Global ambient dust particles
  useEffect(() => {
    if (!preloaderDone) return;
    const container = document.getElementById('dust-container');
    if (!container) return;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < 18; i++) {
      const dot = document.createElement('div');
      dot.className = 'ambient-dust';
      dot.style.left = `${Math.random() * 100}vw`;
      dot.style.top = `${Math.random() * 100}vh`;
      container.appendChild(dot);
      particles.push(dot);

      gsap.to(dot, {
        y: `-${60 + Math.random() * 120}vh`,
        x: `${(Math.random() - 0.5) * 60}vw`,
        opacity: 0,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 6,
        repeat: -1,
        ease: 'none',
        repeatDelay: Math.random() * 4,
        onRepeat: () => {
          dot.style.left = `${Math.random() * 100}vw`;
          dot.style.top = `${90 + Math.random() * 10}vh`;
          gsap.set(dot, { opacity: 0.15 + Math.random() * 0.2 });
        },
      });
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, [preloaderDone]);

  return (
    <>
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Ambient dust overlay */}
      <div
        id="dust-container"
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none',
          zIndex: 9998, overflow: 'hidden',
        }}
      />

      {/* Preloader */}
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Main site — hidden until preloader done */}
      <div style={{
        opacity: preloaderDone ? 1 : 0,
        transition: 'opacity 0.5s',
        background: 'var(--bg-primary)',
      }}>
        {/* Navbar */}
        <div id="ap-navbar" style={{
          opacity: 0,
          transition: 'opacity 0.8s ease',
        }}>
          <Navbar isDark={isDark} onToggleTheme={() => setIsDark(d => !d)} />
        </div>

        {/* Sections */}
        <main>
          <Hero isDark={isDark} />
          <About />
          <Services />
          <Projects />
          <Process />
          <Footer isDark={isDark} />
        </main>
      </div>

      {/* Navbar visibility via class */}
      <style>{`
        #ap-navbar.navbar-visible {
          opacity: 1 !important;
        }
        * {
          cursor: none !important;
        }
        @media (max-width: 1024px) {
          * { cursor: auto !important; }
        }
      `}</style>
    </>
  );
}
