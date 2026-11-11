# ABSTRUCT Construction — website

A full multi-page website for the ABSTRUCT brand, built from the Flo Studios case study
(https://www.flostudio.co/work/abstruct): same palette, monogram, taglines, beam sequence, palette strip
and the website mockup structure (hero → stats → services → featured projects → red CTA footer).

## Run
No build step, no dependencies. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Pages
`index.html` · `services.html` · `projects.html` (`#slug` deep-links a project) · `about.html` · `contact.html` (`?type=residential|commercial|management`)

## Structure
- `css/base.css` tokens, section theming, type, nav, footer, curtain, cursor, marquee
- `css/home.css`, `css/inner.css` page styles
- `js/core.js` nav/footer injection, page transitions, theme, reveals, counters, cursor
- `assets/img/projects/` project photographs (`slug.webp`) and edge-traced blueprints (`slug-bp.webp`), plus `hero.webp`
- `js/data.js` all copy and project data
- `docs/plan.md` the build plan

## From the case study
Palette (Ivory `#EBE5DC`, Charcoal `#111111`, Signal red `#C31C18`, Concrete `#8C8B87`), monogram and logo suite, taglines,
"Turning imaginations into permanence.", service names, 15+ / 250+ / 98% figures, the scroll-pinned crane/beam sequence,
the expanding palette strip, curtain intro and theme flip. Photography and logo files are Flo Studios' case-study assets.

## Placeholders to replace
Invented for this build: every project in `js/data.js` (names, specs, summaries), FAQ answers, value and step copy,
the About story, head-office address and email (`hello@abstruct.example`, set in `js/core.js` and `js/contact.js`),
and the "illustrative programme" formula in `js/contact.js`.

## Notes
- Project and hero photographs are AI-generated illustrative images (Figma AI); the blueprints are edge-traces of those photos. Replace with real project photography when you have it: keep the file names or update `js/data.js`.
- Font: Archivo (variable, Google Fonts) stands in for the licensed Neue Grostek; swap `--font` in `css/base.css`.
- The quote form has no backend: it validates, then opens a pre-filled `mailto:`. Replace `send` logic in `js/contact.js` with a `fetch()` when an endpoint exists.
- Respects `prefers-reduced-motion`; mobile layouts at ≤900px.
