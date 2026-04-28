# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the site

No build step. Serve statically from the project root:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Or open any `.html` file directly in a browser.

## Architecture

Static multi-page site with no framework or package manager.

**Pages:** `index.html` (home), `about.html`, `services.html`, `stories.html`, `contact.html`  
**Shared CSS:** `css/style.css` — all design tokens + global component styles  
**Shared JS:** `js/script.js` — all interactivity for every page  
**Page-specific styles** live in `<style>` blocks inside each HTML file, not in `style.css`

### Design tokens (css/style.css `:root`)

| Token | Purpose |
|---|---|
| `--sage` / `--sage-pale` | Primary green accent |
| `--terra` | Terracotta call-to-action color |
| `--cream` / `--cream-dark` | Page backgrounds |
| `--font-display` | Playfair Display (headings) |
| `--font-body` | DM Sans (body text) |
| `--radius`, `--shadow-soft` | Shared card styling |
| `--section-pad`, `--container` | Layout spacing |

### JavaScript modules (script.js)

All JS runs inside a single `DOMContentLoaded` listener. Sections:
1. Nav scroll class + mobile menu toggle
2. Scroll reveal — `IntersectionObserver` adds `.visible` to elements with `.reveal`, `.reveal-left`, `.reveal-right`; stagger via `.delay-1` through `.delay-4`
3. Marquee — clones `.marquee__track` for seamless loop
4. Active nav link highlighting
5. Smooth scroll for `a[href^="#"]`
6. Counter animation — elements with `data-count` and `data-suffix` attributes animate on scroll
7. Contact form validation (client-side only; submission logs to console — no backend wired)
8. Hero parallax (desktop only)
9. WhatsApp floating button — dynamically injected; phone number at `WA_PHONE` constant

### Contact form

`contact.html` → `#contactForm` → validated in `script.js`. Currently logs to `console.log` on submit. To wire up a real backend, replace the `console.log` block with a `fetch` to Formspree, EmailJS, or a similar service.

### Images

`images/` — flat directory plus `images/Reviews_Reports/` for client result screenshots. Hero and food card currently share the same buddha-bowl image; replace with Niharika's actual photo when available (`images/Niharika_Photo.jpg` exists but is not yet referenced in the hero).
