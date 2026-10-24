# Contributing

## Where to make a change

Some files are written by hand, others are generated. Edit the source, run `make build`, and commit both.

| To change | Edit | Generated |
| --- | --- | --- |
| A color value or its usage note | `tools/palette.py` | `design-system/tokens.json` |
| Any other token (spacing, radius, blur, motion, type…) | `tools/tokens_build.py` | `design-system/tokens.json` |
| A preview card | `tools/previews_body.py` (shared helpers and icons in `tools/previews_head.py`) | `design-system/components/<Component>/preview.html` |
| Component styles or behavior | `design-system/components/bundle.css`, `bundle.js`, `index.d.ts` | — |
| A behaviour contract (keyboard, cancel, disabled, overlays, lifecycle, layout) | `tools/contracts.py` | — |
| The Claude Design React adapter | `.design-sync/react/src/index.jsx`, `index.d.ts` (checks in `tools/react_contracts.py`) | — |
| Guidelines | `design-system/*.md`, `design-system/components/<Component>/README.md` | — |

Never hand-edit `tokens.json` or a `preview.html`; the next `make build` overwrites it, and CI fails if they differ from what the sources produce.

## Before you open a pull request

1. `make build` and commit everything it changed.
2. `make check` passes:
   - **Contrast** (`tools/check_contrast.py`, 1019 pairs): text ≥ 4.5:1 in regular themes and ≥ 7:1 in high-contrast themes, text-field boundaries (`field-edge`) ≥ 3:1, with translucent glass composited over pure white and pure black. A new color or state layer needs a new check here.
   - **Apple rules** (`tools/audit.py`, dark and light themes). The rules have three tiers:
     - **Hard** (never waived): `unlabeledIcons`, `wrongMaterial`, `nestedGlass`, `overlappingGlass`.
     - **Contract** (change the contract, not the page): `mixedIconText`, `menuIconsMixed` (icons are optional in menus, but consistent inside one group), `tintedControlsInBar`.
     - **Style** (house style): `uppercase`, `notTitleCase`, `nonConcentric`, `crowdedGlass` (glass closer than 6px). A page can waive one of these rules with `data-lint-waive="<rule>: <reason>"`; the audit prints each waiver. The budget of 8 blurred elements per frame is a project heuristic and has no waiver.
   - **Interaction** (`tools/interact.py`, 82 checks): keyboard, focus return, sheets, menus, tab bar, themes, widths 320–1920.
   - **Behaviour contracts** (`tools/contracts.py`, 99 checks): each check names the audit item (UI-xx) or the topic (SCROLL) that it guards. They cover the operating contracts that the cards cannot show: keyboard, cancel, disabled, dynamic items, overlays, lifecycle, hit areas and layout geometry.
3. Every behaviour change adds or updates a contract in `tools/contracts.py`, tagged with its UI-xx item. For a confirmed bug, write the failing test first, then fix the code.
4. If you change the React adapter, run `python3 tools/react_contracts.py` (16 checks; it skips when `.ds-sync/node_modules` is missing).
5. Look at the screenshots (`make shots`) in all six themes for anything you touched.
6. If the change affects how the system meets an Apple recommendation, update `design-system/5-apple-alignment.md` (status and evidence). Claim only what a check proves. Device and assistive-technology checks are still pending, so say so where a claim depends on them.

## Rules that are easy to break

The full set of principles and rule tiers is in [`design-system/0-principles.md`](design-system/0-principles.md).


- Glass is for the navigation and overlay layers only. Content — including thumbnails and lists that sit next to controls — is opaque `surface`.
- One kind of thing per glass background; groups are separated by `space-8`, not dividers. Icon-only groups; a text primary action stands alone.
- One accent per task scope: the next step of the current task (Review while reviewing, Send while the composer has text). Other actions stay tinted or glass. Progress and counts in navigation are neutral.
- Text uses a type role (`font: var(--type-<role>)`); never write a font size in `bundle.css`. Controls use `min-height`, not `height`, so larger text and comfortable density grow them.
- Never dim text with opacity; use a token pair that `check_contrast.py` proves (for example `ink-muted`, `ink-on-media-muted`).
- Menus, toasts and sheets use thick glass (`glass-thick`); full-height sheets are opaque.
- The tab bar (< 744px) and the brand-island links (≥ 744px) are rendered from one list of destinations. Below 744px no task disappears: it moves into the menu, a tab or the page header.
- Every movement, scale or morph sits inside `prefers-reduced-motion: no-preference`.
- Don't lower the alpha of `glass`, `glass-thick`, `scroll-edge` or `media-scrim-*`; they are contrast floors.

## Copy

English, following `tools/glossary-en.md`: Title Case for buttons, menu items, tabs and headers; sentence case for descriptions and messages; never all caps.

## Publishing to Claude Design

After a change is merged to `main`, run `/design-sync` in Claude Code from this repository. The Claude Design page is read-only and shows what was last synced.
