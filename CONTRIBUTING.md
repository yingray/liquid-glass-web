# Contributing

## Where to make a change

Some files are written by hand, others are generated. Edit the source, run `make build`, and commit both.

| To change | Edit | Generated |
| --- | --- | --- |
| A color value or its usage note | `tools/palette.py` | `design-system/tokens.json` |
| Any other token (spacing, radius, blur, motion, type…) | `tools/tokens_build.py` | `design-system/tokens.json` |
| A preview card | `tools/previews_body.py` (shared helpers and icons in `tools/previews_head.py`) | `design-system/components/<Component>/preview.html` |
| Component styles or behavior | `design-system/components/bundle.css`, `bundle.js`, `index.d.ts` | — |
| Guidelines | `design-system/*.md`, `design-system/components/<Component>/README.md` | — |

Never hand-edit `tokens.json` or a `preview.html`; the next `make build` overwrites it, and CI fails if they differ from what the sources produce.

## Before you open a pull request

1. `make build` and commit everything it changed.
2. `make check` passes:
   - **Contrast** (`tools/check_contrast.py`): text ≥ 4.5:1 in regular themes and ≥ 7:1 in high-contrast themes, with translucent glass composited over pure white and pure black. A new color or state layer needs a new check here.
   - **Apple rules** (`tools/audit.py`): no glass inside glass or overlapping control glass, no mixed icon/text on one glass background, every icon button labeled, no all caps, Title Case on controls and headers, menu items with icons, at most one tinted control per bar, concentric corners, no glass closer than 6px to its neighbor, ≤ 8 blurred elements per frame, every glass element computing the material it claims.
   - **Interaction** (`tools/interact.py`): keyboard, focus return, sheets, menus, tab bar, themes, widths 320–1920.
3. Look at the screenshots (`make shots`) in all six themes for anything you touched.
4. If the change affects how the system meets an Apple recommendation, update `design-system/5-apple-alignment.md` (status and evidence).

## Rules that are easy to break

- Glass is for the navigation and overlay layers only. Content — including thumbnails and lists that sit next to controls — is opaque `surface`.
- One kind of thing per glass background; groups are separated by `space-8`, not dividers. Icon-only groups; a text primary action stands alone.
- At most one accent per bar. Progress and counts in navigation are neutral.
- Menus, toasts and sheets use thick glass (`glass-thick`); full-height sheets are opaque.
- The tab bar (< 744px) and the brand-island links (≥ 744px) are rendered from one list of destinations.
- Every movement, scale or morph sits inside `prefers-reduced-motion: no-preference`.
- Don't lower the alpha of `glass`, `glass-thick`, `scroll-edge` or `media-scrim-*`; they are contrast floors.

## Copy

English, following `tools/glossary-en.md`: Title Case for buttons, menu items, tabs and headers; sentence case for descriptions and messages; never all caps.

## Publishing to Claude Design

After a change is merged to `main`, run `/design-sync` in Claude Code from this repository. The Claude Design page is read-only and shows what was last synced.
