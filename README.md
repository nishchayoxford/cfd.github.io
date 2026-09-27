# Nishchay Tiwari — Research Portfolio

**Live site:** https://nishchayoxford.github.io/cfd.github.io/

A static, responsive research portfolio about computational fluid dynamics, coastal scour, multiphase flow and aerodynamics. Plain HTML, CSS and JavaScript; no runtime libraries, analytics, remote fonts or build step.

## Edit the site

- `index.html`: biography, research, publication records, experience and contact details.
- `style.css`: responsive layout, visual tokens and print styles.
- `script.js`: progressively enhanced mobile navigation and publication filters.
- `assets/`: locally hosted fonts, favicon and social-sharing image. Font licences are included.

All research content is rendered in HTML and remains available with JavaScript disabled. The abstract flow illustration is decorative, not simulation data. Journal articles link to DOIs; presentations and the master's thesis link to their programme, event or institutional records. Do not commit private CVs, contact phone numbers, unpublished thesis material or research datasets.

To add a publication, copy one `.publication` article in `index.html` and set `data-kind` to `journal`, `conference` or `thesis`. The filter totals update automatically. Preserve author order, exact title, publication year, publication type and a verified source URL. The tests intentionally assert the current bibliography; update those expectations when records are added or removed.

## Preview

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/. Directly opening `index.html` also works.

## Browser and accessibility checks

Requires Node.js 24 and Python 3:

```sh
npm ci
npx playwright install chromium
npm test
```

Or use an installed Chromium-compatible browser:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/path/to/chrome npm test
```

The suite checks mobile keyboard navigation, publication filters and totals, no-JavaScript content, responsive overflow, local links/assets, metadata, automated WCAG checks, reduced motion and print output. Automated accessibility checks supplement, rather than replace, manual keyboard and visual review.

Regenerate the social-sharing image after a visual change:

```sh
npm run render:social
```

## Publishing

GitHub Pages serves the root of `main` at the existing project URL. `_config.yml` excludes development files from the Jekyll output. The Website checks workflow runs on pull requests and pushes to main. Use a pull request, wait for the checks, then merge; verify the Pages deployment and live URL after publishing.

Keep asset paths relative so the site works under `/cfd.github.io/`. The canonical and social-image URLs must be updated together if the site moves. The copyright year and career status are deliberately editorial rather than inferred from the visitor's clock.
