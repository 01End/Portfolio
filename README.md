# Ahmed Khaled — Portfolio

Dark, cinematic, single-page portfolio built from scratch. The concept: **a living ML system** — terminal boot preloader, an interactive neural constellation that reaches toward your cursor, a chrome 3D centerpiece in the hero, scroll progress rendered as training epochs, and a pinned horizontal gallery of featured work. A HUD instrument layer (live clock, cursor coordinates) and a blueprint grid overlay run across the whole site, and a `theme[d]`/`theme[l]` toggle in the nav switches between dark and light.

**Stack:** Vanilla JS + [Vite](https://vitejs.dev) · [GSAP ScrollTrigger](https://gsap.com) · [Lenis](https://lenis.darkroom.engineering) smooth scroll · [three.js](https://threejs.org) (lazy-loaded for the hero 3D) · self-hosted fonts (Syne, Instrument Sans, JetBrains Mono). No frameworks, no templates.

**The playground** (`// 05`) is a real neural network: an MLP (784→128→64→10, 97.3% on MNIST) trained with `scripts/train_digits.py`, its weights shipped as raw Float32 (`public/model/digits.dat`) and executed by a from-scratch JS inference engine ([src/js/nn.js](src/js/nn.js)) — verified to match the Python model's logits exactly (`node scripts/verify_digits.mjs`). Retrain any time with `python scripts/train_digits.py`.

**The journey timeline** reads from `timeline` in `src/data/site.js` — the shipped entries are placeholders; replace them with your real education/work/certificates.

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
| `src/data/projects.json` | Every project card, the work showcase, and modals |

### The admin page — `/admin.html`

Manage projects from the browser at **`https://01end.github.io/Portfolio/admin.html`**: add/edit/delete/reorder projects, upload screenshots (auto-resized to webp), and publish — every save is a git commit that auto-deploys in ~1 minute.

**Access:** paste a GitHub **fine-grained personal access token** (GitHub → Settings → Developer settings → Fine-grained tokens → Repository access: *Only 01End/Portfolio*, Permissions: *Contents — Read and write*, nothing else). The token lives only in your browser (session or device storage — your choice). There is no password stored in the site to crack: GitHub performs the authentication, and the page is inert without a valid token.

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
