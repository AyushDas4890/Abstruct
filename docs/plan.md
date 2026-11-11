# ABSTRUCT Construction — website plan

**Goal:** a full, working, motion-rich website for ABSTRUCT Construction, built from the Flo Studios case study (flostudio.co/work/abstruct): same palette, monogram, taglines, beam sequence, palette strip and website mockup structure.

**Stack:** static HTML + CSS + vanilla JS. No frameworks, no build step, no new dependencies. Classic scripts (no ES modules) so it works by double-clicking `index.html`. Fonts via Google Fonts link (Archivo variable as stand-in for licensed Neue Grostek; Libre Caslon Condensed for the quote, as in the case study).

## Source of truth (from the case study)
- Palette: Ivory `#EBE5DC`, Charcoal `#111111`, Signal red `#C31C18`, Concrete `#8C8B87`; paper `#F4EFE7` for ink on red.
- Monogram: three pillars of different heights rising through an open arc. Wordmark wide-spaced light caps.
- Voice: Building stability. Shaping the future. / Spaces that perform. / Precision today. Stronger tomorrow. / We build. You live. / People. Spaces. Progress. / Building with purpose. / Spaces that last. / Design · Build · Deliver.
- Quote: "Turning imaginations into permanence."
- Website mockup: nav (Home, Services, Projects, About, Get a Quote) → hero + red plane + concrete → stats 15+ years / 250+ projects / 98% satisfaction → /01 Our Services (Residential, Commercial, Project Management) → /02 Featured Projects (dark) → red CTA footer "Let's build a stronger tomorrow".
- Motion from the case study: curtain + clip-reveal intro, scroll-pinned crane/beam "We build trust" with sparks and shake, expanding palette strip, theme flip ivory/charcoal/red on scroll, spring reveals, line-draw labels.

## Files
| File | Responsibility |
|---|---|
| `index.html`, `services.html`, `projects.html`, `about.html`, `contact.html` | page content |
| `css/base.css` | tokens, theme flip, type, nav, footer, buttons, reveal, cursor, curtain |
| `css/home.css`, `css/inner.css` | home sections; services/projects/about/contact |
| `js/core.js` | injects nav+footer, page transitions, theme flip, reveal, counters, cursor, marquee |
| `js/art.js` | seeded concrete-building generator (render + blueprint modes) |
| `js/data.js` | projects, services, FAQ — **placeholder content** |
| `js/home.js`, `js/services.js`, `js/projects.js`, `js/about.js`, `js/contact.js` | page behaviour |

## Verification
Playwright: load each page desktop + mobile, no console errors, no horizontal overflow, screenshots at several scroll positions, beam sequence progress states, project overlay, quote builder + validation, reduced-motion.

## Placeholders (invented, flagged)
Project names/specs, FAQ answers, address, email, story copy. Stats and service names come from the mockup.
