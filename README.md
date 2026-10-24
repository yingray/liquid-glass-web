# Liquid Glass Web

A reusable design system for responsive websites, following Apple's [Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass) principles: glass is a separate functional layer for navigation, toolbars and overlays; content stays opaque and readable.

Framework-free: one stylesheet, one small script, design tokens in JSON. Dark-first, six themes (dark, light, two Solid, two high-contrast), tested at 390px and 1440px.

## What's here

| Path | What |
| --- | --- |
| [`design-system/README.md`](design-system/README.md) | The brand book: principles, layers, materials, color, type, spacing, motion, icons, copy, integration |
| `design-system/1-states.md` … `5-apple-alignment.md` | Interaction states, responsive rules, accessibility and fallbacks, anti-patterns, and the item-by-item mapping to Apple's article |
| `design-system/tokens.json` | 140 tokens and 19 text styles (generated) |
| `design-system/components/bundle.css`, `bundle.js`, `index.d.ts` | The stylesheet, `window.LiquidGlass`, and its types |
| `design-system/components/<Component>/` | Guidelines (`README.md`) and a live preview (`preview.html`, generated) per component |
| `tools/` | The sources and checks that produce and verify everything above |

## Using it on a site

Load `tokens.css` (compiled from `tokens.json`, see `make build`), `components/bundle.css` and `components/bundle.js`, then call `LiquidGlass.applyTheme()` in `<head>` and `LiquidGlass.init()` once the DOM is ready. Details: [Setup](design-system/README.md#setup).

## Working on it

```sh
pip install playwright pillow && python -m playwright install chromium
make build    # regenerate tokens.json, previews and tools/.cache/tokens.css
make check    # contrast (905 pairs), Apple rule audit, 81 interaction tests
make shots    # screenshots of every card in all six themes → tools/shots/
```

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

**CI:** a GitHub Actions workflow is ready at `tools/ci/check.yml`: it runs `make build` (generated files must be committed) and `make check` on every pull request. To turn it on, copy it to `.github/workflows/check.yml` (it is kept outside that folder because the tool that created this repository may not write workflow files).

## Claude Design

This repository is the source of truth for the "Liquid Glass Web" design system in Claude Design. It is published there with `/design-sync` from Claude Code, which makes the Claude Design page read-only: change things here, merge, then run `/design-sync` again.
