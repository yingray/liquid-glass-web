# Accessibility and fallback

Regular glass is very transparent, so readability can't rely on the glass itself; it relies on what is behind it. Overlays that can cover arbitrary content use thick glass instead. The rules below make every combination verifiable by calculation: all 905 color pairings have been checked (≥ 4.5:1 in regular themes, ≥ 7:1 in high-contrast themes), by compositing the translucent glass over pure white and over pure black and taking the worse result.

## Required

1. **Control what is behind the glass.** Floating glass sits on `canvas` by default. When content scrolls under glass, always add `.lg-scroll-edge` (top) or `.lg-scroll-edge--bottom` (bottom): `ink-muted` on glass stays ≥ 4.5:1 in the worst case (pure white beneath in the dark theme, pure black beneath in the light theme). Without a scroll edge, dark glass over white content leaves primary text at only 2.7:1.
2. **Overlays use thick glass.** Menus, popovers, inline confirmations, toasts and half-height sheets can cover anything, so they always use `glass-thick` (`lg-glass--popover`, `lg-modal`): `ink`, `ink-muted` and `danger` on it are ≥ 4.5:1 over pure white or pure black, at rest, hover and pressed. A menu made of regular 0.5 glass over white content leaves primary text at only 2.7:1 and secondary text at about 1.2:1.
3. **Glass on the stage sits inside a scrim band.** The top 64px and bottom 88px are full-strength scrim; inside the bands, white text on `media-glass` stays ≥ 6.5:1 over a pure white frame. Outside the bands and on media frames, captions use `lg-plate` (≥ 7:1 over a pure white frame).
4. **Tint follows the surface underneath.** Don't put light glass on dark imagery. Add `data-tone="dark"` to the stage; add `data-surface-tone="dark"` to dark page sections, and nav islands switch tone automatically.
5. **Text colors come from an allowlist.** `ink`, `ink-muted`, `accent-text`, `ok`, `warn` and `danger` may go on `canvas`, `surface`, `surface-inset`, `fill`, glass and thick glass; only `ink` goes on `fill-strong` and `fill-pressed`; `ink-faint` only draws non-text marks; on the stage, use only `ink-on-media`, `ink-on-media-muted`, `media-warn` and `media-ok`.
6. **Every icon-only button has a text label.** `aria-label` names the action ("Share", "More actions for Frame 14"), and a shortcut also goes into `title`; icon buttons with a count include the count in the label ("Queue, 2 items"). Users who prefer text can bring up these names through a screen reader or voice control.
7. **Focus is visible.** The two-layer focus ring can't be removed or clipped by `overflow: hidden`; floating components can't cover the focused element (set `scroll-padding-top: var(--content-top)` and `scroll-padding-bottom: calc(var(--tabbar-height) + var(--space-24))` on `html`). When the tab bar is minimized, it restores to full size as soon as focus enters it.
8. **Touch targets ≥ 44 × 44.** On touch devices, all buttons, segmented items, tabs, menu items and toolbar groups grow automatically.
9. **Semantics before styling.** Navigation and tab bars use `<nav aria-label>`, with `aria-current="page"` on the current page; segmented controls are `radiogroup` / `radio`, or `tablist` / `tab` when they switch content panels; toolbars are `role="toolbar"` + `aria-label`, with a single Tab stop and arrow-key movement; menus use `role="menu"`, and an inline confirmation switches to `role="dialog"`; sheets use the native `<dialog>` with `showModal()`; toasts use `role="status"`.
10. **Not color alone.** Status is always a dot or badge plus text; selection changes both background and text color; destructive buttons state the consequence ("Remove from Show").

## User settings and browser support

| User setting | Detectable by web pages | System response |
| --- | --- | --- |
| Dark / light | Yes (`prefers-color-scheme`) | `dark` / `light` theme |
| Glass strength (Apple's Clear / Tinted appearance has no detectable equivalent on the web) | No; offered in site settings | `data-glass="strong"`: stronger blur and saturation, same opacity |
| Reduce transparency | **Chromium-based only** (`prefers-reduced-transparency`); not supported in Safari (including iOS), off by default in Firefox | `*-solid` theme: glass, thick glass and stage glass are opaque; blur, refraction and background extension are turned off; scrims are darker |
| Increase contrast | Yes (`prefers-contrast: more`) | `*-contrast` theme: text ≥ 7:1, opaque glass, a solid `border-strong` line on all glass and controls, highlights and shadows turned off |
| Reduce motion | Yes (`prefers-reduced-motion`) | Translation, scaling, deformation and springs are turned off (including menus growing from the trigger, the tab bar minimize animation and thumb flattening); only fades remain; spinners slow down |
| Forced colors (Windows high contrast) | Yes (`forced-colors: active`) | System colors are used; fills, blur, shadows and stage scrims are removed; a 1px solid line remains |
| Print | `@media print` | Glass is removed; floating components become normal flow |

Because Safari can't detect Reduce Transparency, sites must offer a "Transparency" switch in settings. When Increase Contrast is on in macOS, the system also forces Reduce Transparency on; web pages can detect Increase Contrast, so the `*-contrast` themes are opaque by design.

Without JavaScript, bundle.css still responds directly to `prefers-reduced-transparency` and `prefers-contrast` (glass switches to `surface`), but it doesn't switch to the 7:1 high-contrast color values, and sheets don't become opaque automatically at full height (add `lg-modal--full` directly).

## Fallback tiers

| Tier | Condition | Rendering |
| --- | --- | --- |
| 2 | Chromium-based, no reduced transparency, no increased contrast, no forced colors, device memory ≥ 4GB | Edge refraction on small components + blur + highlight |
| 1 | `backdrop-filter` supported (all modern browsers) | Blur + saturation + highlight |
| 0 | `backdrop-filter` not supported | Glass uses `surface`; stage glass uses `stage` at 90% |

Contrast holds at every tier: the contrast minimums are calculated for "background not visible at all" and "background is the worst-case color", independent of how much blur there is. To check whether refraction is available, call `LiquidGlass.supportsRefraction()`, not `CSS.supports()` — Safari reports support but can't render it.

## Performance budget

- No more than 8 elements with `backdrop-filter` in one viewport (one nav island or one toolbar group counts as 1); no more than 3 with refraction. The system's desktop showcase has 7; the mobile showcase has at most 7.
- Related buttons share one piece of glass (island, toolbar group); don't give each button its own backdrop blur.
- Glass fixed on solid `canvas` with no content passing behind it (inspector, composer) uses `lg-glass--flat`: same appearance, no backdrop blur.
- Don't animate `backdrop-filter`, `filter: blur()` or blur radius.
- Sheet backdrops are not blurred; full-screen previews use the opaque `lightbox`.
- Low-memory devices (`navigator.deviceMemory` < 4) don't enable refraction.
- These are limits on element counts, not measured frame rates. Before launch, use the browser's performance tools on target devices (at least one mid-range Android phone and one iPhone) to record scrolling and opening and closing menus, and confirm no frames drop.

## Acceptance checklist

- [ ] Check each of the six themes once: dark, light, two Solid, two high-contrast; then once more with "Glass: Stronger".
- [ ] Put the brightest photo on the stage and confirm the top-edge labels and toolbar are clear; scroll bright content under the nav islands and tab bar and confirm both top and bottom scroll edges appear.
- [ ] Open a menu over white content and over the stage and confirm the text is clear (thick glass).
- [ ] Scroll a dark section under the nav islands and the tab bar in the light theme and confirm both switch to dark glass.
- [ ] In the high-contrast themes, confirm the current tab in the tab bar has a 2px ring; minimize the tab bar and confirm a screen reader still announces the current tab's name.
- [ ] Drag a sheet to full height and confirm it becomes opaque.
- [ ] Go through once with the keyboard only: Tab order is logical, the focus ring is always visible, toolbars and segmented controls work with arrow keys, Esc closes menus and sheets, and focus returns to the trigger button after closing.
- [ ] Turn on VoiceOver / NVDA: the current page, segmented selection state, toolbar names, every icon button's name, sheet titles and toast messages are all announced.
- [ ] Turn on Reduce Motion: no scaling, springs or slide-ins.
- [ ] On a phone, tap search or the composer and confirm bottom bars stay above the on-screen keyboard when it opens.
- [ ] At widths 320, 390, 744, 1100, 1440 and 1920 and at 200% zoom, there is no horizontal scrolling and floating components don't cover content.
- [ ] Check tier 1 in Safari, Firefox and Chrome; check tier 0 in an environment without `backdrop-filter` support.
