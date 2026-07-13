import { categories } from '../data/projects.js';

// ------------------------------------------------------------------
// Renders every dynamic part of the page from site.js / projects.js.
// Layout lives in index.html + CSS; content lives in the data files.
// ------------------------------------------------------------------

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

export function applyTheme(site) {
  const root = document.documentElement;
  root.style.setProperty('--accent', site.accent);
  const rgb = /^#?(..)(..)(..)$/.exec(site.accent);
  if (rgb) {
    const [r, g, b] = [rgb[1], rgb[2], rgb[3]].map((x) => parseInt(x, 16));
    root.style.setProperty('--accent-soft', `rgba(${r}, ${g}, ${b}, 0.14)`);
  }
}

// Cover art: real screenshot when provided, otherwise a procedural
// placeholder tinted with the project's hue.
export function coverHTML(p, index) {
  if (p.images?.length) {
    return `<div class="cover" style="--h:${p.hue}">
      <img src="${esc(p.images[0])}" alt="${esc(p.title)} screenshot" loading="lazy" />
    </div>`;
  }
  const nodes = [
    [18, 26], [34, 62], [58, 30], [76, 58], [64, 78], [86, 22],
  ]
    .map(([x, y]) => `<span class="cover-node" style="left:${x}%;top:${y}%"></span>`)
    .join('');
  return `<div class="cover" style="--h:${p.hue}">
    ${nodes}
    <span class="cover-id">${esc(p.id)}.render()</span>
    <span class="cover-index">${String(index + 1).padStart(2, '0')}</span>
  </div>`;
}

export const chipsHTML = (tech) =>
  tech.map((t) => `<span class="chip">${esc(t)}</span>`).join('');

// ---- hero ---------------------------------------------------------

function renderHero(site) {
  document.getElementById('hero-eyebrow').textContent = site.eyebrow;

  document.getElementById('hero-name').innerHTML = [site.firstName, site.lastName]
    .map(
      (word) =>
        `<span class="word">${[...word]
          .map((c) => `<span class="char">${esc(c)}</span>`)
          .join('')}</span>`
    )
    .join('');

  document.getElementById('hero-title').textContent = site.title;
  document.getElementById('hero-tagline').textContent = site.tagline;

  const ctas = [
    `<a href="#work" class="btn btn--primary magnetic" data-cursor="hover">view work <span class="btn-arrow">→</span></a>`,
  ];
  if (site.cvUrl) {
    ctas.push(
      `<a href="${esc(site.cvUrl)}" class="btn magnetic" data-cursor="hover" download>download cv <span class="btn-arrow">↓</span></a>`
    );
  } else {
    const gh = site.socials.find((s) => s.label === 'GitHub');
    if (gh) {
      ctas.push(
        `<a href="${esc(gh.url)}" class="btn magnetic" data-cursor="hover" target="_blank" rel="noopener">github <span class="btn-arrow">↗</span></a>`
      );
    }
  }
  document.getElementById('hero-ctas').innerHTML = ctas.join('');

  document.getElementById('nav-status-text').textContent = site.status;
}

// ---- about ---------------------------------------------------------

function renderAbout(site) {
  document.getElementById('about-text').innerHTML = site.about
    .map((p) => `<p><span class="about-line">${esc(p)}</span></p>`)
    .join('');

  document.getElementById('about-stats').innerHTML = site.stats
    .map(
      (s) => `<div class="stat-card">
        <span class="stat-value" data-value="${s.value}" data-suffix="${esc(s.suffix)}">${s.value}${esc(s.suffix)}</span>
        <span class="stat-label">${esc(s.label)}</span>
      </div>`
    )
    .join('');
}

// ---- skills ---------------------------------------------------------

function renderSkills(site) {
  const groups = document.getElementById('skill-groups');
  groups.innerHTML = site.skillGroups
    .map(
      (g) => `<div class="skill-card" data-cursor="hover">
        <div class="skill-card-head">
          <h3 class="skill-card-name">${esc(g.name)}</h3>
          <span class="skill-card-tag mono">${esc(g.tag)}</span>
        </div>
        <ul class="skill-list">
          ${g.skills.map((s) => `<li class="chip">${esc(s)}</li>`).join('')}
        </ul>
      </div>`
    )
    .join('');

  // glow follows the mouse inside each card
  groups.querySelectorAll('.skill-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  const items = site.skillGroups.flatMap((g) => g.skills);
  const rowHTML = (list) =>
    `<div class="marquee-row">${list
      .map(
        (s) =>
          `<span class="marquee-item">${esc(s)}</span><span class="marquee-sep">◦</span>`
      )
      .join('')}</div>`;

  // each row's content is doubled so a -50% loop is seamless
  const half = Math.ceil(items.length / 2);
  const rowA = items.slice(0, half);
  const rowB = items.slice(half);
  document.getElementById('marquee-wrap').innerHTML =
    rowHTML([...rowA, ...rowA]) + rowHTML([...rowB, ...rowB]);
}

// ---- work: editorial showcase ------------------------------------------
// Featured projects get full-width blocks that alternate left/right;
// the rest flow in staggered two-up pairs — one continuous scroll.

function workItemHTML(p, index, variant, extraClass = '') {
  const info = [esc(p.year), esc(categories[p.category] ?? p.category).toLowerCase()]
    .filter(Boolean)
    .join(' · ');
  const arrow = p.live || p.github ? ' <span class="accent">↗</span>' : '';
  return `<article class="w-item w-item--${variant} ${extraClass}" data-project="${esc(p.id)}" data-cursor="hover">
    <div class="w-media">
      <span class="w-tag mono">${esc(categories[p.category] ?? p.category).toLowerCase()}</span>
      <div class="w-parallax">${coverHTML(p, index)}</div>
    </div>
    <div class="w-meta">
      <div>
        <h3 class="w-name mono">${esc(p.title)}</h3>
        <p class="w-tagline">${esc(p.tagline)}</p>
      </div>
      <span class="w-info mono">${info}${arrow}</span>
    </div>
  </article>`;
}

function renderWork(projects) {
  const flow = document.getElementById('work-flow');
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  let html = featured
    .map((p, i) =>
      workItemHTML(p, projects.indexOf(p), 'full', i % 2 ? 'w-right' : '')
    )
    .join('');

  for (let i = 0; i < rest.length; i += 2) {
    const pair = rest.slice(i, i + 2);
    html += `<div class="w-row">${pair
      .map((p) => workItemHTML(p, projects.indexOf(p), 'half'))
      .join('')}</div>`;
  }

  flow.innerHTML = html;
}

// ---- contact + footer -----------------------------------------------

function renderContact(site) {
  const email = document.getElementById('contact-email');
  email.textContent = site.email;
  email.href = `mailto:${site.email}`;

  document.getElementById('contact-socials').innerHTML = site.socials
    .filter((s) => s.url && s.url !== '#')
    .map(
      (s) => `<a class="social-btn magnetic" href="${esc(s.url)}" target="_blank"
        rel="noopener" aria-label="${esc(s.label)}" data-cursor="hover">${esc(s.short)}</a>`
    )
    .join('');

  document.getElementById('footer-left').textContent =
    `© ${new Date().getFullYear()} ${site.firstName} ${site.lastName} — ${site.footerNote}`.toLowerCase();
  document.getElementById('footer-right').textContent = 'vite + gsap + lenis · no templates';
}

// ---- entry ------------------------------------------------------------

export function renderAll(site, projects) {
  applyTheme(site);
  renderHero(site);
  renderAbout(site);
  renderSkills(site);
  renderWork(projects);
  renderContact(site);
}
