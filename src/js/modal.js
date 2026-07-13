import gsap from 'gsap';
import { categories } from '../data/projects.js';
import { coverHTML, chipsHTML } from './render.js';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

// Full-screen project case study. Opens from any element carrying
// data-project="<id>" (gallery cards + grid cards).
export function initModal(projects, lenis) {
  const modal = document.getElementById('project-modal');
  const panel = document.getElementById('modal-panel');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');
  const content = document.getElementById('modal-content');

  let isOpen = false;
  let lastFocus = null;

  function sectionHTML(title, text) {
    return text
      ? `<div class="modal-section"><h4>${title}</h4><p>${esc(text)}</p></div>`
      : '';
  }

  function build(p) {
    const index = projects.indexOf(p);
    const links = [];
    if (p.live) {
      links.push(
        `<a href="${esc(p.live)}" class="btn btn--primary" target="_blank" rel="noopener" data-cursor="hover">live demo <span class="btn-arrow">↗</span></a>`
      );
    }
    if (p.github) {
      links.push(
        `<a href="${esc(p.github)}" class="btn" target="_blank" rel="noopener" data-cursor="hover">github <span class="btn-arrow">↗</span></a>`
      );
    }

    const gallery =
      p.images?.length > 1
        ? `<div class="modal-gallery">${p.images
            .slice(1)
            .map(
              (src) =>
                `<img src="${esc(src)}" alt="${esc(p.title)} screenshot" loading="lazy" />`
            )
            .join('')}</div>`
        : '';

    content.innerHTML = `
      <div class="modal-media">${coverHTML(p, index)}</div>
      <div class="modal-body">
        <p class="modal-kicker">// ${esc(categories[p.category] ?? p.category)} · ${esc(p.year)}</p>
        <h3 class="modal-title">${esc(p.title)}</h3>
        <p class="modal-desc">${esc(p.description)}</p>
        <div class="modal-sections">
          ${sectionHTML('problem', p.problem)}
          ${sectionHTML('approach', p.approach)}
          ${sectionHTML('results', p.results)}
        </div>
        <div class="modal-tech">${chipsHTML(p.tech)}</div>
        <div class="modal-links">${links.join('')}</div>
        ${gallery}
      </div>`;
  }

  function open(id) {
    const project = projects.find((p) => p.id === id);
    if (!project || isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement;

    build(project);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    panel.scrollTop = 0;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';

    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    gsap.fromTo(
      panel,
      { y: 60, opacity: 0, clipPath: 'inset(6% 4% 6% 4%)' },
      {
        y: 0,
        opacity: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.6,
        ease: 'power4.out',
      }
    );

    closeBtn.focus({ preventScroll: true });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;

    gsap.to(backdrop, { opacity: 0, duration: 0.3, delay: 0.1 });
    gsap.to(panel, {
      y: 40,
      opacity: 0,
      duration: 0.35,
      ease: 'power3.in',
      onComplete: () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        lenis?.start();
        document.documentElement.style.overflow = '';
        lastFocus?.focus({ preventScroll: true });
      },
    });
  }

  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-project]');
    if (card && !e.target.closest('a')) open(card.dataset.project);
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}
