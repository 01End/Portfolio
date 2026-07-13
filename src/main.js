// fonts (self-hosted — zero external requests)
import '@fontsource-variable/syne';
import '@fontsource-variable/instrument-sans';
import '@fontsource-variable/jetbrains-mono';

// styles
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { site } from './data/site.js';
import { projects } from './data/projects.js';

import { renderAll } from './js/render.js';
import { initSmoothScroll } from './js/smooth-scroll.js';
import { initCursor } from './js/cursor.js';
import { initScramble } from './js/scramble.js';
import { initNeuralBg } from './js/neural-bg.js';
import { initModal } from './js/modal.js';
import { runPreloader } from './js/preloader.js';
import { heroIntro, initAnimations, animateFilterChange } from './js/animations.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) document.documentElement.classList.add('no-anim');

async function boot() {
  renderAll(site, projects, {
    onFilterChange: (visible) => animateFilterChange(visible, reduced),
  });

  const lenis = reduced ? null : initSmoothScroll();
  lenis?.stop(); // hold the page still behind the preloader

  initCursor();
  initScramble(reduced);
  initNeuralBg(reduced);
  initModal(projects, lenis);
  initAnimations({ lenis, reduced });

  await runPreloader(reduced);

  lenis?.start();
  heroIntro(reduced);
  ScrollTrigger.refresh();
}

boot();
