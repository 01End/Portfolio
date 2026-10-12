# Owner to-do

Everything here needs your facts, files, accounts or decisions. Nothing in the repo invents them: each item's feature is unpublished, flagged off, or blocked by `content-lint` until you supply it. The final run re-sorts this list by impact with time estimates.

| # | What | Why | Where (file / field / step) | Unlocks |
|---|---|---|---|---|
| 1 | Install and log in to the GitHub CLI (`winget install GitHub.cli`, then `gh auth login`), then run `node scripts/tools/open-prs.mjs` | This run could not open PRs (no `gh` on the machine) | — | Every milestone PR |
| 2 | Vercel dashboard check: project connected to `01End/Portfolio`, Production Branch `master`, preset Vite, build `npm run build`, output `dist`; note whether Deployment Protection covers previews; create the automation bypass secret if it does | Plan M0 step 1, §8 #29 | Vercel → Project → Settings | M0 done, preview scripts |
| 3 | After merging M0: `npm run check:m0-prod`; then `gh repo edit 01End/Portfolio --homepage https://ahmedkh11.vercel.app`; update the GitHub profile README, LinkedIn and CV links; then unpublish GitHub Pages (or publish the Appendix A redirect) | §8 #15, M0 step 10–11 | GitHub settings, LinkedIn, CV | M0 done |
| 4 | A real repo URL per project, or `private: true` + `privateReason`, or `published: false` | Lint E3: all 7 point at the profile root | `src/data/projects.json` `github` / `private` / `privateReason` (admin page) | M1 gate, production deploys |
| 5 | One measured metric per project with method and baseline | Lint E4/E5 | `projects.json` `metrics[]` | M1 gate |
| 6 | Case-study bodies in the §5.1 shape (≥150 words; 300–500 for featured) | Lint E13; case pages, search, assistant | `content/work/<id>.md` | M1 gate, M2 case pages, M5/M6 corpus |
| 7 | Arabic summary of the RAG project (≥80 words) | Lint E11 (RAG clause) | `content/work/rag-egyptian-schools.ar.md` | M1 gate, Arabic search |
| 8 | LinkedIn URL | Contact, byline, JSON-LD | `src/data/site.js` `socials[LinkedIn].url` | M1 |
| 9 | CV PDF (text-based, ≤200 kB) and its text version | Byline, nav, contact, corpus | `public/cv/ahmed-khaled-cv.pdf`, `content/cv.md`; set `site.cvUrl` | M1 |
| 10 | Real timeline (degree, university, dates, jobs, certificates) | About/Experience is hidden while empty | `site.js` `timeline` | M1 About section |
| 11 | Contradiction decisions: MekTrackX deployed? StreakFit URL; route-embeddings year; keep/back XGBoost, Docker, MLOps, Firebase | A technical reader notices | `projects.json`, `site.js` | M1 |
| 12 | Availability (roles, from month, reply time) and approval of the hero claim | Hero kicker, claim, contact line | `site.js` `availability`, `claim` | M1/M2 |
| 13 | Sign-off on four decisions: reduced motion honoured by default (reverses `ef2211b`), dark default, atlas demoted to S0 with the digit lab in the hero, English-only semantic model | They reverse earlier choices | PR comment on M2 and M5 | M2 / M5 |
| 14 | Real figures for featured projects (exported from each project's own run) with alt text and a caption naming the notebook/script | Lint E14: a featured project needs one | Admin upload; `images[0]` + `imageMeta` | Featured rows in M2 |
| 15 | Specimen review with one outside reviewer, and the 45-second recall test (legacy vs prototype A vs B, 3 people) | Chooses the hero; this run builds prototype B (plan of record) meanwhile | `docs/decisions/0003-hero-recall-test.md` | M2 sign-off |
| 16 | `digit-engine` case study (≥150 words for M2, full length for M3); empty public repo `01End/digit-engine` for M3 step 15 | Your strongest artifact's page and repo | `content/work/digit-engine.md`; GitHub | `digit-engine` publication |
| 17 | ~60 minutes of drawing on `dev/collect.html` (20 per digit on mouse + phone, 100 non-digits, A h m e d ×3 and "?" ×3 with picks marked before seeing verdicts) | Canvas accuracy, the "Ahmed" strip, favicon, section markers, 404 raster | `scripts/ml/digits/data/canvas_set.jsonl` | M3 identity pieces |
| 18 | Confirm dataset licences (MNIST, EMNIST, Quick, Draw! CC BY 4.0) | Colophon credits | Manifest `datasets`, colophon | M3 |
| 19 | Endurance data-ownership confirmation; your `ranges.yaml` values, HR rule coefficients and fatigue assumption in your words; approve the disclaimer | Phase 3 must not leak someone else's assets | `scripts/ml/endurance/ranges.yaml` (`owner_confirmed: true`), ADR 0005 | `features.endurance` |
| 20 | GitHub → Settings → Actions → Workflow permissions: Read and write | `embed.yml` commits regenerated vectors | GitHub settings | M5 embed workflow |
| 21 | `content/faq.md` (8 Q&As); optional review of `content/site-howto.md` | Search/assistant "about me" coverage | `content/` | M5 |
| 22 | ≥20 search queries written by you and 2+ testers without reading the passages | Unbiased search eval; decides hybrid vs keyword | `evals/search.queries.jsonl` (`author: "owner"`/`"tester"`) | `features.semantic` |
| 23 | Groq and Gemini API keys | Assistant providers | Vercel env vars + `.env.local` | M6 |
| 24 | Upstash Redis via the Vercel Marketplace | Rate limits, budgets | Vercel → Storage | M6 |
| 25 | `IP_SALT_SECRET`, `ASK_TEST_SECRET` (`openssl rand -hex 32`), and the `*_TPD`/`*_RPD` values | Guardrails, testable previews | Vercel env vars | M6 |
| 26 | Arabic summaries for every published project and `content/faq.ar.md` | Arabic answers about any project | `content/work/<id>.ar.md`, `content/faq.ar.md` | `features.ask` |
| 27 | Review of the 40 assistant eval questions | Eval quality | `evals/assistant.questions.jsonl` | `features.ask` |
| 28 | Optional: `GROQ_API_KEY`/`GEMINI_API_KEY` repo secrets | Monthly toolcheck | GitHub → Secrets | `toolcheck.yml` |
| 29 | Launch QA: real devices, usability test (3 people), 20 s recording, Search Console, LinkedIn Post Inspector | M7 steps 8–11 | `docs/decisions/0006-usability.md` | Launch |
