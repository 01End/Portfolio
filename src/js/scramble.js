const GLYPHS = '!<>-_\\/[]{}=+*^?#01';

// Decode effect: characters shuffle, then resolve left to right.
export function scrambleText(el, { duration = 650 } = {}) {
  if (el._scrambling) return;
  el._scrambling = true;

  const original = el.dataset.text ?? el.textContent;
  el.dataset.text = original;

  const start = performance.now();

  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const resolved = Math.floor(p * original.length);

    let out = original.slice(0, resolved);
    for (let i = resolved; i < original.length; i++) {
      out += original[i] === ' '
        ? ' '
        : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;

    if (p < 1) {
      requestAnimationFrame(frame);
    } else {
      el.textContent = original;
      el._scrambling = false;
    }
  }

  requestAnimationFrame(frame);
}

export function initScramble(reduced) {
  if (reduced) return;
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    el.addEventListener('mouseenter', () => scrambleText(el));
  });
}
