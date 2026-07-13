# Ahmed Khaled — Portfolio

Dark, cinematic, single-page portfolio built from scratch. The concept: **a living ML system** — terminal boot preloader, an interactive neural constellation that reaches toward your cursor, a chrome 3D centerpiece in the hero, scroll progress rendered as training epochs, and a pinned horizontal gallery of featured work. A HUD instrument layer (live clock, cursor coordinates) and a blueprint grid overlay run across the whole site, and a `theme[d]`/`theme[l]` toggle in the nav switches between dark and light.

**Stack:** Vanilla JS + [Vite](https://vitejs.dev) · [GSAP ScrollTrigger](https://gsap.com) · [Lenis](https://lenis.darkroom.engineering) smooth scroll · [three.js](https://threejs.org) (lazy-loaded for the hero 3D) · self-hosted fonts (Syne, Instrument Sans, JetBrains Mono). No frameworks, no templates.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Editing content — no layout code required

Everything you'd ever want to change lives in two files:

| File | Controls |
|---|---|
| `src/data/site.js` | Name, title, tagline, about text, stats, skills, socials, accent color, CV link, HUD clock label/timezone |
| `src/data/projects.js` | Every project card, the featured gallery, filters, and modals |

### Add a new project

1. Append one object to the array in `src/data/projects.js` (copy an existing one).
2. Optional: drop screenshots into `public/projects/<id>/` and list them in `images: [...]`. With no images the site renders a styled placeholder cover using the project's `hue`.
3. Set `featured: true` to also show it in the big horizontal gallery.

### Change the accent color

One line in `src/data/site.js`: `accent: '#e10600'`.

### Add your CV

Drop the PDF at `public/cv/Ahmed-Khaled-CV.pdf` and set `cvUrl: 'cv/Ahmed-Khaled-CV.pdf'` in `site.js` — the hero button appears automatically.

## Motion & accessibility

The site honors `prefers-reduced-motion`: visitors with reduced motion enabled (including Windows "Animation effects" off) get a fully readable static version — no preloader, no smooth scroll, vertical gallery.

Override for demos/testing: append `?motion=1` (force full motion) or `?motion=0` (force static).

## Deploy

Pushing to `master` on GitHub triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages (enable **Settings → Pages → Source: GitHub Actions** once).
