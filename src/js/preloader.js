import gsap from 'gsap';

const BOOT_LINES = [
  '<span class="accent">&gt;</span> boot ak.portfolio --env=production',
  '<span class="accent">&gt;</span> loading weights ......... <span class="ok">ok</span>',
  '<span class="accent">&gt;</span> attaching gpu:0 .......... <span class="ok">ok</span>',
  '<span class="accent">&gt;</span> compiling layers ......... <span class="ok">ok</span>',
  '<span class="accent">&gt;</span> model ready — rendering interface',
];

// Terminal-style boot sequence. Resolves as the wipe starts so the
// hero intro plays underneath the reveal. Repeat visits (same tab
// session) get a fast version.
export function runPreloader(reduced) {
  const el = document.getElementById('preloader');
  if (!el) return Promise.resolve();

  if (reduced) {
    el.remove();
    return Promise.resolve();
  }

  const terminal = document.getElementById('preloader-terminal');
  const bar = document.getElementById('preloader-bar');
  const percent = document.getElementById('preloader-percent');

  const seen = sessionStorage.getItem('ak_booted');
  const total = seen ? 0.7 : 2.3;
  sessionStorage.setItem('ak_booted', '1');

  return new Promise((resolve) => {
    const tl = gsap.timeline();
    const state = { v: 0 };

    // boot lines appear staggered across the load
    BOOT_LINES.forEach((line, i) => {
      tl.call(
        () => {
          const div = document.createElement('div');
          div.innerHTML = line;
          terminal.appendChild(div);
        },
        [],
        (total * 0.82 * i) / BOOT_LINES.length
      );
    });

    tl.to(
      state,
      {
        v: 100,
        duration: total,
        ease: 'power2.inOut',
        onUpdate: () => {
          const v = Math.round(state.v);
          bar.style.width = `${v}%`;
          percent.textContent = `${v}%`;
        },
      },
      0
    );

    tl.call(() => resolve(), [], `+=0.1`);

    tl.to(el, {
      yPercent: -100,
      duration: 0.85,
      ease: 'power4.inOut',
      onComplete: () => el.remove(),
    });
  });
}
