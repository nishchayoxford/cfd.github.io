# Nishchay Tiwari — Computational Portfolio

An Astro portfolio for computational science, Python and machine learning, adapted from the supplied [v4 template](https://github.com/guilyx/v4).

The design retains the template’s ink/periwinkle palette, typography, alternating media spotlights and interactive career trajectory. Content and media are specific to this portfolio; the original author's personal material is not redistributed.

## Local preview

Requires Node.js 22.19.0 or newer, matching the locked dependency graph (Node.js 24 is used in CI).

```sh
npm ci
npm run build
npm run preview -- --host 127.0.0.1 --port 4323
```

Open **http://127.0.0.1:4323/cfd.github.io/**. The project base is intentional: the production site lives under a GitHub Pages repository path.

For editing: `npm run dev`. Follow the URL printed by Astro, including `/cfd.github.io/`.

## Structure

- `src/data/site.ts` — biography, contact, experience, education and capabilities.
- `src/data/publications.json` — publication titles, authors, dates and verified DOI metadata.
- `src/components/` — hero, project films, background, timeline and publications.
- `src/pages/work/` — the optimisation and numerical-flow case studies.
- `src/pages/resume.astro` — public-safe résumé with print-to-PDF support.
- `src/styles/global.css` — supplied v4 base design tokens and components.
- `src/styles/portfolio.css` — portfolio composition, responsive behaviour and print treatment.
- `public/media/` — original demonstration films, posters and descriptions.
- `public/downloads/` — reproducible demonstration packages.
- `tests/portfolio*.spec.cjs` — production-build browser and accessibility tests.

## Verification

```sh
npm run check
npm run build
npx playwright install chromium
npm test
npm audit --audit-level=moderate
```

An installed Chrome can be used instead:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/google-chrome npm test
```

Tests run under the actual `/cfd.github.io/` base, not a root-only development shortcut. They cover keyboard interaction, no-JavaScript access, responsive layout, automated WCAG checks, print, media and local paths. Automated checks complement visual review.

## Content and media boundaries

The capstone is an educational project; the numerical-flow study is an independent portfolio demonstration. Neither should be described as a validated engineering product or an industrial deployment. Media documentation identifies the calculation, data and visual transformations behind each film.

The public site does not include private CV files, phone numbers, home addresses, unpublished doctoral results or original-template personal assets. Supplied reference folders are ignored by Git and are not copied to `dist/`.

## Deployment

The replacement is reviewed locally before release. The existing live URL is https://nishchayoxford.github.io/cfd.github.io/.

For an approved release, use the Pages build workflow and configure the repository's Pages source as **GitHub Actions**. Only the built `dist/` artifact is published. Do not publish the repository root: it contains tooling rather than a ready-to-serve site. The deployment workflow runs on `main` only, after its own build and browser checks.

Keep all local links routed through `src/lib/paths.ts`. The canonical URL, social image, sitemap and base path must change together if the site moves.

## Attribution

Original v4 template: Erwin Lejeune, MIT licence retained in `LICENSE`. Fonts are self-hosted through Fontsource; font licence notices are included under `public/licenses/`. See `ASSETS.txt` for media provenance and licences.
