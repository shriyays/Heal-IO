import { useEffect, useRef } from 'react';
import '../css/components/WaveBackground.css';

const WAVE_DEFS = [
  { y: 0.2, speed: 0.000007, amp: 55, freq: 0.004, color: 'rgba(104,185,157,', lw: 22 },
  { y: 0.5, speed: 0.000005, amp: 80, freq: 0.003, color: 'rgba(167,220,195,', lw: 20 },
  { y: 0.78, speed: 0.000009, amp: 60, freq: 0.005, color: 'rgba(134,200,170,', lw: 22 },
];

const LAYERS = [
  { lwMul: 2.8, alpha: 0.06 },
  { lwMul: 1.8, alpha: 0.1 },
  { lwMul: 1.2, alpha: 0.16 },
  { lwMul: 1.0, alpha: 1.0 },
];

export default function WaveBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let t = 0;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (const wave of WAVE_DEFS) {
        const baseY = h * wave.y;
        const pts = [];
        for (let x = 0; x <= w; x += 3) {
          const y =
            baseY +
            Math.sin(x * wave.freq + t * wave.speed * 1000) * wave.amp +
            Math.sin(x * wave.freq * 0.5 + t * wave.speed * 600) * (wave.amp * 0.5) +
            Math.sin(x * wave.freq * 2.3 + t * wave.speed * 400) * (wave.amp * 0.2);
          pts.push([x, y]);
        }
        for (const layer of LAYERS) {
          ctx.beginPath();
          ctx.strokeStyle = wave.color + layer.alpha + ')';
          ctx.lineWidth = wave.lw * layer.lwMul;
          pts.forEach(([x, y], i) => {
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();
        }
      }
      t++;
      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="wave-canvas" aria-hidden="true" />;
}
