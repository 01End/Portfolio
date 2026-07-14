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
import { heroIntro, initAnimations } from './js/animations.js';
import { restoreTheme, initTheme } from './js/theme.js';
import { initHud } from './js/hud.js';
import { initHero3d } from './js/hero3d.js';
import { initWarp } from './js/warp.js';
import { initPlayground } from './js/playground.js';
import { initScrollbar } from './js/scrollbar.js';

restoreTheme(); // before first paint of the app shell

// The full motion experience plays for everyone by default — a portfolio's
// impact lives in the animation, and many machines have the OS "reduce motion"
// flag on for performance reasons rather than a real need for stillness.
// Anyone who genuinely wants the static version can append ?motion=0.
const motionParam = new URLSearchParams(location.search).get('motion');
const reduced = motionParam === '0';
if (reduced) document.documentElement.classList.add('no-anim');

async function boot() {
  // Chrome's deferred scroll restoration fights the pinned sections
  // (pin-spacers change the page height after load and the browser
  // re-applies the old scroll position seconds later). The site always
  // opens at the top — preloader into hero.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  renderAll(site, projects);

  const lenis = reduced ? null : initSmoothScroll();
  lenis?.stop(); // hold the page still behind the preloader

  initCursor();
  initTheme();
  initHud(site);
  initScramble(reduced);
  initNeuralBg(reduced);
  initModal(projects, lenis);
  initAnimations({ lenis, reduced });
  initWarp(reduced);
  initPlayground();

  await runPreloader(reduced);

  lenis?.start();
  heroIntro(reduced);
  ScrollTrigger.refresh();
  initScrollbar(lenis);

  // decorative — loads three.js after the intro is already playing
  initHero3d(reduced);
}

boot();
