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
import { restoreTheme, initTheme } from './js/theme.js';
import { initHud } from './js/hud.js';
import { initHero3d } from './js/hero3d.js';

restoreTheme(); // before first paint of the app shell

// Honors the visitor's reduced-motion preference.
// Override for demos/testing with ?motion=1 (force on) or ?motion=0 (force off).
const motionParam = new URLSearchParams(location.search).get('motion');
const reduced =
  motionParam !== null
    ? motionParam === '0'
    : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) document.documentElement.classList.add('no-anim');

async function boot() {
  // Chrome's deferred scroll restoration fights the pinned sections
  // (pin-spacers change the page height after load and the browser
  // re-applies the old scroll position seconds later). The site always
  // opens at the top — preloader into hero.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  renderAll(site, projects, {
    onFilterChange: (visible) => animateFilterChange(visible, reduced),
  });

  const lenis = reduced ? null : initSmoothScroll();
  lenis?.stop(); // hold the page still behind the preloader

  initCursor();
  initTheme();
  initHud(site);
  initScramble(reduced);
  initNeuralBg(reduced);
  initModal(projects, lenis);
  initAnimations({ lenis, reduced });

  await runPreloader(reduced);

  lenis?.start();
  heroIntro(reduced);
  ScrollTrigger.refresh();

  // decorative — loads three.js after the intro is already playing
  initHero3d(reduced);
}

boot();
