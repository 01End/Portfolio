import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ------------------------------------------------------------------
// Warp finale. A neuron node (echoing the cursor dot) sits centered;
// scrolling scales it up until you pass inside the model — a dark
// interior where data streaks fly past at light speed while ML
// phrases crossfade, ending on the closing line.
// The interior stays dark in both themes: inside the machine.
// ------------------------------------------------------------------

export function initWarp(reduced) {
  const section = document.getElementById('warp');
  const inner = document.getElementById('warp-inner');
  const node = document.getElementById('warp-node');
  const canvas = document.getElementById('warp-canvas');
  const phrases = [...document.querySelectorAll('.warp-phrase')];
  if (!section || !inner) return;

  // ---- starfield ---------------------------------------------------
  const ctx = canvas.getContext('2d');
  const accent = getAccentRGB();

  let w = 0;
  let h = 0;
  let cx = 0;
  let cy = 0;
  let stars = [];
  let raf = null;
  let active = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = section.clientWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w / 2;
    cy = h / 2;
    seed();
    if (reduced) drawStatic();
  }

  function spawn(nearCenter) {
    const maxR = Math.hypot(cx, cy);
    return {
      a: Math.random() * Math.PI * 2,
      r: nearCenter ? 2 + Math.random() * 30 : Math.random() * maxR,
      v: 0.6 + Math.random() * 1.6,
      red: Math.random() < 0.18,
    };
  }

  function seed() {
    const count = Math.min(360, Math.round((w * h) / 3800));
    stars = Array.from({ length: count }, () => spawn(false));
  }

  function step() {
    const maxR = Math.hypot(cx, cy) + 40;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.r += s.v * (1 + s.r * 0.045); // accelerate outward — light speed
      if (s.r > maxR) stars[i] = spawn(true);
    }
  }

  function draw() {
    ctx.fillStyle = 'rgba(5, 5, 9, 0.42)'; // motion trails
    ctx.fillRect(0, 0, w, h);
    for (const s of stars) {
      const r0 = Math.max(s.r * 0.88, 1);
      const alpha = Math.min(s.r / 130, 0.85);
      ctx.strokeStyle = s.red
        ? `rgba(${accent}, ${alpha})`
        : `rgba(235, 233, 226, ${alpha * 0.8})`;
      ctx.lineWidth = s.red ? 1.6 : 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(s.a) * r0, cy + Math.sin(s.a) * r0);
      ctx.lineTo(cx + Math.cos(s.a) * s.r, cy + Math.sin(s.a) * s.r);
      ctx.stroke();
    }
  }

  function drawStatic() {
    ctx.fillStyle = '#050509';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 3; i++) step();
    draw();
  }

  function loop() {
    step();
    draw();
    raf = requestAnimationFrame(loop);
  }

  const start = () => {
    if (!raf && active && !document.hidden) raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  };

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  resize();

  if (reduced) return; // static fallback: CSS shows the closing phrase

  // ---- scroll choreography ------------------------------------------
  gsap.set(inner, { clipPath: 'circle(2.5% at 50% 50%)' });
  gsap.set(phrases, { autoAlpha: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=340%',
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      onToggle: (self) => {
        active = self.isActive;
        active ? start() : stop();
      },
    },
  });

  // zoom into the neuron
  tl.to(
    node,
    { scale: 30, autoAlpha: 0, duration: 1.1, ease: 'power2.in' },
    0
  ).to(
    inner,
    { clipPath: 'circle(120% at 50% 50%)', duration: 1.15, ease: 'power2.in' },
    0
  );

  // phrases stream past
  phrases.forEach((p, i) => {
    const t = 1.05 + i * 0.62;
    tl.fromTo(
      p,
      { autoAlpha: 0, scale: 0.9 },
      { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
      t
    );
    if (i < phrases.length - 1) {
      tl.to(p, { autoAlpha: 0, scale: 1.08, duration: 0.3, ease: 'power2.in' }, t + 0.44);
    }
  });

  tl.to({}, { duration: 0.45 }); // hold the closing line
}

function getAccentRGB() {
  const hex = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent')
    .trim();
  const m = /^#?(..)(..)(..)$/.exec(hex);
  return m
    ? m.slice(1).map((x) => parseInt(x, 16)).join(', ')
    : '225, 6, 0';
}
