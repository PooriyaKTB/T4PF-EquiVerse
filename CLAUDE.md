# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**ThisAbility** is a static, single-page business/pitch website for an AI-powered disability accessibility ecosystem called **EquiVerse**. Built for "Tech For Positive Futures, Team 3, 2026". No build system, no package manager, no backend.

## Running locally

Open `index.html` directly in a browser, or serve with any static file server:

```bash
python3 -m http.server 8080
# or
npx serve .
```

No build step required. All dependencies are loaded from CDN (Font Awesome 6.7.2 via `cdnjs.cloudflare.com`).

## Architecture

Three files make up the entire site:

| File | Purpose |
|------|---------|
| `index.html` | Full single-page site — all sections are here |
| `css/style.css` | All styles — design tokens, layout, components, animations |
| `js/main.js` | Navbar scroll/mobile toggle, scroll-reveal, stat counters |

**CSS design tokens** live in `:root` at the top of `style.css`. All colours, radii, shadows, and transitions are defined there — update tokens rather than individual rules when changing the visual theme.

**Scroll animations** work via `data-animate` and `data-delay` HTML attributes. `main.js` uses `IntersectionObserver` to add a `visible` class when elements scroll into view. New animated elements just need `data-animate="fadeUp"` (and optionally `data-delay="100"`) — no JS changes needed.

**Stat counter animations** auto-trigger for any `.stat-number` or `.market-number` element containing a digit. The parser in `main.js` handles `£`, `B`, `M`, `K`, and `+` suffixes.

## Sections (in order)

Navbar → Hero → Stats Band → Problem → Solution (with EquiVerse AI callout) → Competitive Edge → Market Opportunity → Roadmap → Business Model → Impact → Partners → Demo → CTA → Footer

Section IDs used for nav anchoring: `#problem`, `#solution`, `#edge`, `#market`, `#roadmap`, `#business`

## Accessibility commitments in the codebase

The site targets WCAG 2.1 AA. Maintain: `aria-label` on interactive elements, `aria-hidden="true"` on decorative icons, `role` attributes on landmark regions, and `:focus-visible` styles already present in the CSS.
