import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Lenis drives scrolling through GSAP's ticker so ScrollTrigger,
// the canvas, and the scroll position never fight each other.
export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Anchor links scroll through Lenis (with room for the fixed nav)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        lenis.scrollTo(id, {
          offset: id === '#hero' ? 0 : -72,
          duration: 1.3,
        });
      }
    });
  });

  return lenis;
}
