# Rebuild progress (unattended run)

Source of truth: `docs/PLAN.md`. Owner-only inputs: `docs/OWNER-TODO.md`.
Resume rule: a new session reads this file, skips every milestone marked **done**, and continues from the first one that is not.

## Ground rules for this run

- **DEFER** anything that needs the owner's facts, files, accounts or decisions (§8). Each one is logged in `docs/OWNER-TODO.md`, its feature stays behind its flag or unpublished, and work moves on.
- **DO** everything else: code, design system, templates, pipelines, scripts, synthetic-data training, tests, gates, CI, mocks, docs.
- Branches chain: `m0-hosting` → `m1-content` → `m2-foundation` → `m3-digits` → `m4-endurance` → `m5-search` → `m6-ask` → `m7-launch`. Nothing is merged, nothing is pushed to `master`.

## Plan summary (what gets built, what gets deferred)

| M | Build (DO) | Defer to owner |
|---|---|---|
| M0 hosting | README Deploy section, storage try/catch in the old site, WebGL guard, `vercel.json` headers, Playwright + storage/no-GPU spec, gate runner + `gates.json` + `check-prod.mjs`, delete `deploy.yml`, minimal `ci.yml` | Vercel dashboard check, `check:m0-prod` after merge, repo homepage, profile README/LinkedIn/CV links, unpublishing GitHub Pages |
| M1 content | JSON schema, taxonomy, migration script, `content-lint` (E1–E14, W1–W5) with unit tests, `prebuild`, admin migration (§6) with tests, old-renderer fixes, `m1-legacy` spec, `dist-grep`, `m1` gate | Repo URLs, metrics + baselines, case-study bodies, Arabic RAG summary, LinkedIn, CV PDF + `cv.md`, timeline, contradiction decisions, availability, manual admin test |
| M2 foundation | Font subsetting, tokens/CSS, specimen, hero prototypes A/B, core modules, templates, markdown, PNG encoder, `build-facts`, `build-figures`, prerender plugin (work pages, 404, sitemap, robots), UI modules, Lab 01 v0 in the hero, JSON-LD, OG card, budget + css-lint, the full M2 e2e suite, delete the decorative stack, README, CI, `vercel.json`, Lighthouse | Specimen review + recall test (ADR 0003; plan-of-record prototype B is used meanwhile), claim approval, sign-offs §8 #10, real project figures, `digit-engine` case study, phone/laptop review, `v1-legacy` tag push is done by code |
| M3 digits v1 | Python venv, preprocess v2 + Python twin + parity, `dev/collect.html`, dataset builder (MNIST, capsule-rendered digits, EMNIST letters, Quick, Draw!, procedural), CNN `nn.js` v2 with margin gradient, train/evaluate/export, verify v2, Lab UI v1, raster identity pipeline, `lab-digits` spec, ADR 0001 | The ~60 min canvas drawing set (canvas accuracy, the "Ahmed" strip, favicon, section markers, 404 raster use it), dataset licence confirmation, full `digit-engine` case study, the `01End/digit-engine` repo (step 15) |
| M4 endurance | Venv, `hr_rule.py`, `synth.py`, leakage tests, LightGBM training with property check, export, JS `gbdt`/`pava`/`rollout`/`post` with unit tests, `verify/endurance.mjs` (parity + 10k property test), Lab 02 UI, Work-row figure, ADR 0005 | Data-ownership confirmation, the owner's `ranges.yaml` values and fatigue wording (a draft from the plan's example values is used and flagged unconfirmed), disclaimer approval; `features.endurance` stays off until confirmed |
| M5 search | `measure-models`, ADR 0002, chunker, embedder, corpus build, `build-search`, BM25/normalise/RRF, palette, Worker with the plain-wasm alias, load policy, eval harness, parity/no-model specs, `embed.yml` | `faq.md`, ≥20 human-written queries, Actions write permission, sign-off on the English-only model |
| M6 ask | `api/ask.js` + `api/_lib/*` complete, mocked provider, all unit tests, drawer/SSE/trace client, Lab 03 templates, eval/toolcheck harnesses, `check-eval`, `ask-preview`, `vercel.json` functions, ADR 0004 (draft) | Groq + Gemini keys, Upstash, secrets, free-tier limits, Arabic summaries + `faq.ar.md`, review of the 40 questions, preview spike; `features.ask` stays **false** |
| M7 launch | CSP (+ admin CSP), `csp-hash`, `csp.spec`, `print.css` + test, full colophon, `llms.txt`, JSON-LD, full matrix, `lighthouserc.prod.cjs`, `check-provenance.mjs`, README | Real-device checks, usability test, recording, Search Console, LinkedIn inspector, production Lighthouse/provenance runs after merge |

## Environment notes

- Host is Windows 11 without WSL; all scripts are written in Node (or Python in venvs) so they run the same on Windows, macOS, Linux and CI.
- `gh` (GitHub CLI) is not installed or authenticated here, so PRs cannot be opened from this run. Each milestone's PR title and body are written to `docs/prs/mN.md`, and `scripts/tools/open-prs.mjs` opens all of them in merge order once `gh auth login` has been run (OWNER-TODO #1).

## Milestones

| M | Branch | Status | Gate | PR |
|---|---|---|---|---|
| M0 | m0-hosting | in progress | — | — |
| M1 | m1-content | pending | — | — |
| M2 | m2-foundation | pending | — | — |
| M3 | m3-digits | pending | — | — |
| M4 | m4-endurance | pending | — | — |
| M5 | m5-search | pending | — | — |
| M6 | m6-ask | pending | — | — |
| M7 | m7-launch | pending | — | — |

## Decisions taken where the plan left a choice open

- PR creation deferred (no `gh`); PR bodies are committed under `docs/prs/`.

## Log
