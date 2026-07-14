// ------------------------------------------------------------------
// Custom scrollbar — haoqi-style. The native bar is hidden; a thin
// rail on the right edge carries a proportional accent thumb that
// tracks scroll, is draggable, jumps on track-click, and fades when
// idle. Driven by Lenis when present (falls back to window scroll).
// Desktop / fine-pointer only; touch keeps the native overlay bar.
// ------------------------------------------------------------------
export function initScrollbar(lenis) {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const root = document.documentElement;
  root.classList.add('custom-sb'); // CSS hides the native root scrollbar

  const bar = document.createElement('div');
  bar.className = 'scrollbar';
  bar.setAttribute('aria-hidden', 'true');
  const thumb = document.createElement('div');
  thumb.className = 'scrollbar-thumb';
  bar.appendChild(thumb);
  document.body.appendChild(bar);

  const scrollTop = () => (lenis ? lenis.scroll : window.scrollY);
  const scrollTo = (y, immediate) =>
    lenis
      ? lenis.scrollTo(y, { immediate, duration: immediate ? 0 : 0.6 })
      : window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });

  let trackH = 0;
  let thumbH = 0;
  let maxTravel = 0;
  let scrollable = 0;
  let queued = false;

  function measure() {
    trackH = window.innerHeight;
    scrollable = Math.max(document.documentElement.scrollHeight - trackH, 0);
    thumbH = scrollable > 0 ? Math.max((trackH / (scrollable + trackH)) * trackH, 44) : 0;
    maxTravel = trackH - thumbH;
    thumb.style.height = `${thumbH}px`;
    bar.style.display = scrollable > 4 ? '' : 'none';
  }

  function paint() {
    queued = false;
    if (scrollable <= 0) return;
    const p = Math.min(Math.max(scrollTop() / scrollable, 0), 1);
    thumb.style.transform = `translateY(${p * maxTravel}px)`;
  }

  function onScroll() {
    reveal();
    if (!queued) {
      queued = true;
      requestAnimationFrame(paint);
    }
  }

  // --- fade in on activity, out when idle ---------------------------
  let idle = null;
  function reveal() {
    bar.classList.add('is-visible');
    clearTimeout(idle);
    idle = setTimeout(() => {
      if (!dragging) bar.classList.remove('is-visible');
    }, 1400);
  }

  // --- drag the thumb ------------------------------------------------
  let dragging = false;
  let startY = 0;
  let startScroll = 0;

  thumb.addEventListener('pointerdown', (e) => {
    dragging = true;
    startY = e.clientY;
    startScroll = scrollTop();
    thumb.setPointerCapture(e.pointerId);
    bar.classList.add('is-drag', 'is-visible');
    lenis?.stop();
    e.preventDefault();
  });

  thumb.addEventListener('pointermove', (e) => {
    if (!dragging || maxTravel <= 0) return;
    const dy = e.clientY - startY;
    const target = startScroll + (dy / maxTravel) * scrollable;
    scrollTo(Math.min(Math.max(target, 0), scrollable), true);
    if (lenis) paint();
  });

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    thumb.releasePointerCapture?.(e.pointerId);
    bar.classList.remove('is-drag');
    lenis?.start();
    reveal();
  };
  thumb.addEventListener('pointerup', endDrag);
  thumb.addEventListener('pointercancel', endDrag);

  // --- click the rail to jump ---------------------------------------
  bar.addEventListener('pointerdown', (e) => {
    if (e.target === thumb) return;
    const p = Math.min(Math.max((e.clientY - thumbH / 2) / maxTravel, 0), 1);
    scrollTo(p * scrollable, false);
    reveal();
  });

  // --- wiring --------------------------------------------------------
  if (lenis) lenis.on('scroll', onScroll);
  else window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('resize', () => {
    measure();
    paint();
  });

  // page height changes after pins/images settle — re-measure a few times
  measure();
  paint();
  [200, 600, 1500].forEach((t) => setTimeout(() => { measure(); paint(); }, t));
}
