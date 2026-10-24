# Liquid Glass Web

A reusable design system for responsive websites, following Apple's [Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass) principles: glass is a separate functional layer for navigation, toolbars and overlays; content stays opaque and readable.

Demo: https://yingray.github.io/liquid-glass-web/ (every card in all six themes and both densities, built from `main`).

> An independent project. It is not affiliated with or endorsed by Apple Inc. "Liquid Glass" names Apple's design language; this system applies Apple's public guidance to the web.

Framework-free: one stylesheet, one small script, design tokens in JSON. Dark-first, six themes (dark, light, two Solid, two high-contrast), two text densities (compact and comfortable). Designs are drawn at 390px and 1440px; the fluid AppShell reference is tested from 320px to 1920px. Version 3.3.0.

## What's here

| Path | What |
| --- | --- |
| [`design-system/README.md`](design-system/README.md) | The brand book: principles, layers, materials, color, type, spacing, motion, icons, copy, integration |
| [`design-system/0-principles.md`](design-system/0-principles.md) | Read first: the six core principles (C1–C6), the reuse model, the source-of-truth map, the component contract checklist, rule tiers and the v1 scope |
| `design-system/1-states.md` … `5-apple-alignment.md` | Interaction states, responsive rules, accessibility and fallbacks, anti-patterns, and the item-by-item mapping to Apple's article |
| `design-system/tokens.json` | 143 tokens and 20 type roles (generated) |
| `design-system/components/bundle.css`, `bundle.js`, `index.d.ts` | The stylesheet, `window.LiquidGlass`, and its types |
| `design-system/components/<Component>/` | Guidelines (`README.md`) and a live preview (`preview.html`, generated) per component |
| `tools/` | The sources and checks that produce and verify everything above |
| `docs/` | The UI/UX audit (2026-10-24). Each behaviour contract in `tools/contracts.py` names the audit item (UI-xx) that it guards |

## Using it on a site

Load `tokens.css` (compiled from `tokens.json`, see `make build`), `components/bundle.css` and `components/bundle.js`, then call `LiquidGlass.applyTheme()` in `<head>` and `LiquidGlass.init()` once the DOM is ready. Before you remove a subtree that `init()` enhanced, call `LiquidGlass.destroy(root)`. Details: [Setup](design-system/README.md#setup).

## Working on it

```sh
pip install playwright pillow && python -m playwright install chromium
make build    # regenerate tokens.json, previews and tools/.cache/tokens.css
make check    # contrast (1019 pairs), Apple rule audit (dark and light), 82 interaction tests, 99 behaviour contracts
make shots    # screenshots of every card in all six themes → tools/shots/
make site     # static demo site → _site/ (GitHub Pages builds the same from main)
make serve    # the demo pages from disk on 127.0.0.1:8810, for review before you push
python3 tools/react_contracts.py   # 16 checks for the Claude Design React adapter; skips without .ds-sync/node_modules
```

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

**Demo site:** `.github/workflows/pages.yml` builds `make site` on every push to `main` and publishes `_site/` to GitHub Pages. It also fails when `tokens.json` or a `preview.html` differs from what the sources produce.

**CI:** a GitHub Actions workflow is ready at `tools/ci/check.yml`: it runs `make build` (generated files must be committed) and `make check` on every pull request. To turn it on, copy it to `.github/workflows/check.yml` (it is kept outside that folder because the tool that created this repository may not write workflow files).

## Claude Design

This repository is the source of truth for the "Liquid Glass Web" design system in Claude Design. It is published there with `/design-sync` from Claude Code, which makes the Claude Design page read-only: change things here, merge, then run `/design-sync` again.

## License

MIT. See [LICENSE](LICENSE).
