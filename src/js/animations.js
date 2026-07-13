import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ------------------------------------------------------------------
// Every scroll-driven and micro animation on the site.
// All of it is skipped when the visitor prefers reduced motion.
// ------------------------------------------------------------------

// Hero entrance — plays as the preloader wipes away.
export function heroIntro(reduced) {
  if (reduced) return;

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.to('#hero-name .char', {
    y: 0,
    duration: 1.1,
    stagger: 0.045,
  })
    .fromTo(
      '#hero-eyebrow',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7 },
      0.35
    )
    .fromTo(
      '.hero-sub',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8 },
      0.55
    )
    .fromTo(
      '#hero-ctas .btn',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
      0.7
    )
    .fromTo(
      ['.hero-footer', '#nav'],
      { opacity: 0 },
      { opacity: 1, duration: 0.9 },
      0.9
    );
}

// Wrap each <br>-separated line of a heading for the slide-up reveal.
function splitLines(el) {
  el.innerHTML = el.innerHTML
    .split(/<br\s*\/?>/)
    .map((line) => `<span class="reveal-line"><span>${line}</span></span>`)
    .join('');
}

export function initAnimations({ lenis, reduced }) {
  const nav = document.getElementById('nav');
  const epochFill = document.getElementById('epoch-fill');
  const epochLabel = document.getElementById('epoch-label');

  // --- scroll chrome (nav glass + epoch progress) — always on ------
  const onScroll = (y) => {
    nav.classList.toggle('is-scrolled', y > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(y / max, 1) : 0;
    epochFill.style.width = `${p * 100}%`;
    epochLabel.textContent = `epoch ${String(Math.round(p * 100)).padStart(3, '0')}/100`;
  };
  if (lenis) {
    lenis.on('scroll', (e) => onScroll(e.scroll));
  } else {
    window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
    onScroll(window.scrollY);
  }

  if (reduced) return;

  // --- section title reveals ---------------------------------------
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    splitLines(el);
    gsap.to(el.querySelectorAll('.reveal-line > span'), {
      y: 0,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.09,
      scrollTrigger: { trigger: el, start: 'top 82%' },
    });
  });

  // --- about: scrubbed line "ink" reveal + counters ------------------
  document.querySelectorAll('.about-line').forEach((line) => {
    gsap.fromTo(
      line,
      { '--p': '100%' },
      {
        '--p': '0%',
        ease: 'none',
        scrollTrigger: {
          trigger: line.parentElement,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 0.6,
        },
      }
    );
  });

  document.querySelectorAll('.stat-value').forEach((el) => {
    const target = Number(el.dataset.value);
    const suffix = el.dataset.suffix ?? '';
    const state = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          v: target,
          duration: 1.6,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = `${Math.round(state.v)}${suffix}`;
          },
        }),
    });
  });

  // --- skills: cards in + marquee loops ------------------------------
  gsap.from('.skill-card', {
    opacity: 0,
    y: 44,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '.skill-groups', start: 'top 80%' },
  });

  document.querySelectorAll('.marquee-row').forEach((row, i) => {
    gsap.fromTo(
      row,
      { xPercent: i % 2 ? -50 : 0 },
      { xPercent: i % 2 ? 0 : -50, duration: 38, ease: 'none', repeat: -1 }
    );
  });

  // --- featured gallery: pinned horizontal scroll (desktop only) -----
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const pin = document.getElementById('gallery-pin');
    const track = document.getElementById('gallery-track');
    const amount = () => Math.max(track.scrollWidth - pin.clientWidth, 0);

    const tween = gsap.to(track, {
      x: () => -amount(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top 15%',
        end: () => `+=${amount()}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // parallax drift inside each card while the track pans
    document.querySelectorAll('.g-card-parallax').forEach((el) => {
      gsap.fromTo(
        el,
        { xPercent: -5 },
        {
          xPercent: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('.g-card'),
            containerAnimation: tween,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        }
      );
    });
  });

  // --- grid cards batch in --------------------------------------------
  gsap.set('.p-card', { autoAlpha: 0, y: 40 });
  ScrollTrigger.batch('.p-card', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
      }),
  });

  // --- contact reveal ----------------------------------------------
  gsap.from(['.contact-prompt', '.contact-email', '.contact-socials'], {
    opacity: 0,
    y: 26,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '#contact', start: 'top 70%' },
  });

  // --- magnetic buttons (fine pointers only) --------------------------
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * 0.32,
          y: (e.clientY - r.top - r.height / 2) * 0.32,
          duration: 0.4,
          ease: 'power3.out',
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
      });
    });
  }
}

// Re-animate the visible cards after a filter change, then let
// ScrollTrigger re-measure the page (grid height changed).
export function animateFilterChange(visibleCards, reduced) {
  if (!reduced && visibleCards.length) {
    gsap.fromTo(
      visibleCards,
      { autoAlpha: 0, y: 22 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05 }
    );
  }
  ScrollTrigger.refresh();
}
