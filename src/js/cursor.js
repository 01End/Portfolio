import gsap from 'gsap';

// Dot follows the pointer 1:1; the ring lags behind with an eased
// tween. Anything clickable grows the ring. Touch devices never
// see any of this.
export function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  document.body.classList.add('has-cursor');

  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

  const dotX = gsap.quickSetter(dot, 'x', 'px');
  const dotY = gsap.quickSetter(dot, 'y', 'px');
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

  let visible = false;

  window.addEventListener('mousemove', (e) => {
    if (!visible) {
      visible = true;
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      gsap.set(ring, { x: e.clientX, y: e.clientY });
    }
    dotX(e.clientX);
    dotY(e.clientY);
    ringX(e.clientX);
    ringY(e.clientY);
  });

  document.documentElement.addEventListener('mouseleave', () => {
    visible = false;
    gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
  });

  const HOVERABLE = 'a, button, [data-cursor="hover"], .w-item';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(HOVERABLE)) {
      ring.classList.add('is-hover');
      gsap.to(ring, { scale: 1.8, duration: 0.35, ease: 'power3.out' });
      gsap.to(dot, { scale: 0.5, duration: 0.35 });
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(HOVERABLE)) {
      ring.classList.remove('is-hover');
      gsap.to(ring, { scale: 1, duration: 0.35, ease: 'power3.out' });
      gsap.to(dot, { scale: 1, duration: 0.35 });
    }
  });
}
