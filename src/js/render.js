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

  document.getElementById('hero-location').textContent = site.location;
  document.getElementById('hero-meta-right').textContent = `© ${new Date().getFullYear()}`;
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

// ---- featured gallery ------------------------------------------------

function renderGallery(projects) {
  const featured = projects.filter((p) => p.featured);
  const track = document.getElementById('gallery-track');

  track.innerHTML =
    featured
      .map(
        (p, i) => `<article class="g-card" data-project="${esc(p.id)}" data-cursor="hover">
          <div class="g-card-media">
            <div class="g-card-parallax">${coverHTML(p, i)}</div>
          </div>
          <div class="g-card-info">
            <div>
              <h3 class="g-card-title">${esc(p.title)}</h3>
              <p class="g-card-tagline">${esc(p.tagline)}</p>
            </div>
            <span class="g-card-open mono">open ↗</span>
          </div>
        </article>`
      )
      .join('') +
    `<div class="gallery-end">
      <h3 class="gallery-end-title">There's more in the archive<span class="accent">.</span></h3>
      <a href="#archive" class="btn magnetic" data-cursor="hover">all projects <span class="btn-arrow">↓</span></a>
    </div>`;
}

// ---- archive grid + filters -------------------------------------------

function cardHTML(p, index) {
  const tech = p.tech.slice(0, 4);
  const extra = p.tech.length - tech.length;
  return `<article class="p-card" data-project="${esc(p.id)}" data-category="${esc(p.category)}" data-cursor="hover">
    <div class="p-card-media">${coverHTML(p, index)}</div>
    <div class="p-card-body">
      <span class="p-card-cat">${esc(categories[p.category] ?? p.category)} · ${esc(p.year)}</span>
      <h3 class="p-card-title">${esc(p.title)}</h3>
      <p class="p-card-tagline">${esc(p.tagline)}</p>
      <div class="p-card-tech">${chipsHTML(tech)}${extra > 0 ? `<span class="chip">+${extra}</span>` : ''}</div>
    </div>
    <span class="p-card-hint">open ↗</span>
  </article>`;
}

function renderGrid(projects, onFilterChange) {
  const grid = document.getElementById('project-grid');
  const bar = document.getElementById('filter-bar');

  grid.innerHTML = projects.map((p, i) => cardHTML(p, i)).join('');

  const counts = { all: projects.length };
  projects.forEach((p) => {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
  });

  const pills = [
    { key: 'all', label: 'all' },
    ...Object.keys(categories)
      .filter((k) => counts[k])
      .map((k) => ({ key: k, label: categories[k].toLowerCase() })),
  ];

  bar.innerHTML = pills
    .map(
      (f, i) => `<button class="filter-pill${i === 0 ? ' is-active' : ''}" role="tab"
        aria-selected="${i === 0}" data-filter="${f.key}" data-cursor="hover">
        ${esc(f.label)}<span class="filter-count">${counts[f.key]}</span>
      </button>`
    )
    .join('');

  bar.addEventListener('click', (e) => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;
    bar.querySelectorAll('.filter-pill').forEach((b) => {
      b.classList.toggle('is-active', b === pill);
      b.setAttribute('aria-selected', b === pill);
    });
    const key = pill.dataset.filter;
    const cards = [...grid.querySelectorAll('.p-card')];
    cards.forEach((card) => {
      card.style.display =
        key === 'all' || card.dataset.category === key ? '' : 'none';
    });
    onFilterChange?.(cards.filter((c) => c.style.display !== 'none'));
  });
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

export function renderAll(site, projects, { onFilterChange } = {}) {
  applyTheme(site);
  renderHero(site);
  renderAbout(site);
  renderSkills(site);
  renderGallery(projects);
  renderGrid(projects, onFilterChange);
  renderContact(site);
}
