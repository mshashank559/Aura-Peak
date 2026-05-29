import React, { useEffect, useRef } from 'react';

export const Fireplace: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    // Resize observer to keep canvas dimensions responsive without resetting state
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        W = canvas.width = entry.contentRect.width;
        H = canvas.height = entry.contentRect.height;
      }
    });
    resizeObserver.observe(canvas);

    // --- Particle System ---
    interface Particle {
      x: number; y: number; vx: number; vy: number;
      life: number; maxLife: number;
      size: number; type: 'flame' | 'ember' | 'spark';
      hue: number;
    }

    const particles: Particle[] = [];
    const BASE_Y = H - 8;

    const spawnFlame = () => {
      // Linear fireplace: distribute flames horizontally across the inner slot width (10% to 90%)
      const px = W * 0.12 + Math.random() * (W * 0.76);
      particles.push({
        x: px,
        y: BASE_Y + 4,
        vx: (Math.random() - 0.5) * 0.3,
        // Lower vertical velocity to keep the linear flames low and elegant
        vy: -(0.5 + Math.random() * 0.8),
        life: 0,
        // Short life cycle to prevent flames from floating out of the horizontal opening
        maxLife: 30 + Math.random() * 20,
        size: 15 + Math.random() * 18,
        type: 'flame',
        hue: 12 + Math.random() * 14, // warm orange/red
      });
    };

    const spawnEmber = () => {
      const px = W * 0.15 + Math.random() * (W * 0.7);
      particles.push({
        x: px,
        y: BASE_Y - 2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.3 + Math.random() * 0.6),
        life: 0,
        maxLife: 60 + Math.random() * 40,
        size: 1.5 + Math.random() * 1.5,
        type: 'ember',
        hue: 20 + Math.random() * 15,
      });
    };

    const spawnSpark = () => {
      const px = W * 0.2 + Math.random() * (W * 0.6);
      particles.push({
        x: px,
        y: BASE_Y - 8,
        vx: (Math.random() - 0.5) * 1.8,
        vy: -(1.5 + Math.random() * 2),
        life: 0,
        maxLife: 20 + Math.random() * 18,
        size: 1.0 + Math.random() * 1.0,
        type: 'spark',
        hue: 35 + Math.random() * 12,
      });
    };

    let frame = 0;
    let isVisible = true;

    // IntersectionObserver to pause particle updates when off-screen
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = requestAnimationFrame(draw);
      }
    }, { threshold: 0.05 });
    
    io.observe(canvas);

    const draw = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, W, H);
      frame++;

      // Spawning throttled counts to maintain performance and elegant visual weight
      if (frame % 2 === 0) spawnFlame();
      if (frame % 4 === 0) spawnEmber();
      if (frame % 12 === 0) spawnSpark();

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        if (p.type === 'flame') {
          p.vx += (Math.random() - 0.5) * 0.1;
          const t = p.life / p.maxLife;
          const alpha = t < 0.25 ? t / 0.25 : (1 - t) * 1.1;
          const scale = 1 - t * 0.6;

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * scale);
          grad.addColorStop(0, `hsla(${p.hue + 32},100%,94%,${alpha * 0.85})`);
          grad.addColorStop(0.35, `hsla(${p.hue + 16},95%,66%,${alpha * 0.65})`);
          grad.addColorStop(0.75, `hsla(${p.hue},90%,42%,${alpha * 0.35})`);
          grad.addColorStop(1, `hsla(${p.hue},80%,20%,0)`);

          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size * scale * 0.7, p.size * scale, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        else if (p.type === 'ember') {
          const t = p.life / p.maxLife;
          const alpha = Math.sin(t * Math.PI) * 0.75;
          p.vx += (Math.random() - 0.5) * 0.05;

          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = `hsla(${p.hue},100%,75%,${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        else if (p.type === 'spark') {
          const t = p.life / p.maxLife;
          const alpha = (1 - t) * 0.85;
          p.vy += 0.04; // gravity curve
          p.vx *= 0.97;

          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.strokeStyle = `hsla(${p.hue},100%,82%,${alpha})`;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
          ctx.stroke();
          ctx.restore();
        }

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // Draw horizontal charcoal glowing bed at the bottom
      ctx.save();
      const coalGrad = ctx.createLinearGradient(W * 0.1, 0, W * 0.9, 0);
      coalGrad.addColorStop(0, 'rgba(30,12,6,0.3)');
      coalGrad.addColorStop(0.3, 'rgba(120,40,15,0.7)');
      coalGrad.addColorStop(0.5, 'rgba(180,60,20,0.9)');
      coalGrad.addColorStop(0.7, 'rgba(120,40,15,0.7)');
      coalGrad.addColorStop(1, 'rgba(30,12,6,0.3)');
      
      ctx.fillStyle = coalGrad;
      ctx.fillRect(W * 0.08, BASE_Y - 2, W * 0.84, 8);
      ctx.restore();

      // Ambient linear glow inside slot
      const glowIntensity = 0.08 + Math.sin(frame * 0.05) * 0.03;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const slotGlow = ctx.createLinearGradient(0, H, 0, 0);
      slotGlow.addColorStop(0, `rgba(255,100,20,${glowIntensity * 1.5})`);
      slotGlow.addColorStop(0.7, `rgba(180,50,10,${glowIntensity * 0.6})`);
      slotGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = slotGlow;
      ctx.fillRect(W * 0.1, 0, W * 0.8, H);
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      io.disconnect();
      resizeObserver.disconnect();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
};
