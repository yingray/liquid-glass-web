Liquid Glass Web is a design system for websites and web apps: dark-first, cinematic and minimal. Navigation and tools float on a transparent layer of glass; content and media sit on opaque surfaces and a dark stage. It follows Apple's "Adopting Liquid Glass" guidance — glass is a distinct functional layer above content, its appearance adapts to the content beneath it, and users can ask for less transparency — with values redefined for the web and verified by reproducible contrast calculations. For how each Apple recommendation is handled on the web, see "Apple alignment".

The system carries no brand. Each site replaces the `accent` color group, the logo and the name; every other value belongs to the system and should not change between sites.

## Six principles

1. **Content before effects.** Text on glass must stay ≥ 4.5:1 over the worst-case background. Regular glass is very transparent (0.5 dark, 0.58 light), so it goes only where the background is controlled: floating glass sits on `canvas` by default; when content scrolls under glass, always add a scroll edge; glass on the stage always sits inside a scrim band. Glass that can cover arbitrary content (menus, toasts, half-height sheets) uses thick glass, `glass-thick`.
2. **Glass is a material, not a container.** Only the navigation and overlay layers use glass: nav islands, tab bars, sidebars and inspectors, toolbar groups, the composer, menus, toasts and half-height sheets. Content — cards, images, articles, forms, thumbnail strips and contact sheets, full-height sheets — is always opaque. A panel of thumbnails is content even when it sits next to the controls.
3. **No glass on glass.** Anything inside glass is not glass: groups in a sidebar use `fill`, buttons in a nav island use `plain`, confirmation buttons in a menu use `tinted` or `danger`. Two pieces of control-layer glass never overlap; only the overlay layer (menus, sheets) may cover the control layer.
4. **Use as little as possible.** No more than 8 elements with backdrop blur in one viewport. Glass fixed on solid `canvas`, with no content ever passing behind it, uses `lg-glass--flat` (same appearance, no backdrop blur). Related buttons share one piece of glass instead of each button getting its own.
5. **Tint follows the surface underneath; color is for content.** The stage is always dark, so glass on the stage is always dark glass, in the light theme too. Navigation and toolbars stay neutral: at most one accent primary action per bar, set apart as its own piece; progress and counts use neutral colors, and only status badges that need the user's attention get color.
6. **Fall back cleanly.** Without refraction support there is only blur; without blur support it is opaque; when the user asks for reduced transparency or increased contrast, the whole system switches to an opaque theme. The fallback is the same design, not a broken one.

## Layers

| Layer | Contains | Material | z-index |
| --- | --- | --- | --- |
| Content | Cards, image grids, articles, forms | `canvas`, `surface`, `surface-inset` (opaque) | `z-content` |
| Stage | Video, photos, previews: the focus of the interface | `stage` (dark in every theme) + `media-scrim-*` | `z-content` |
| Navigation and controls | Nav islands, tab bars, sidebars and inspectors, toolbar groups, composer | `glass`; `media-glass` on the stage; `lg-glass--flat` when fixed on a solid color | `z-panel`, `z-nav` |
| Overlay | Menus, popovers, inline confirmations, toasts, sheets | `glass-thick` (`lg-glass--popover`, `lg-modal`); full-height sheets use `surface` | `z-menu`, `z-toast`, native dialog top layer |

Standard app layout (1440): a row of nav islands at the top; on the left, the stage, with a docked panel below it (for example a contact sheet or timeline) and a centered composer below that; on the right, an inspector `aside-width` wide. The first block below the nav islands uses `content-top` as its top margin; stage and panel are `space-10` apart. Mobile (390): only two islands remain at the top, brand and menu; the main tabs move to a tab bar (TabBar) at the bottom, and the inspector becomes a half-height sheet.

## Materials

All glass is built from `.lg-glass`: fill `glass` + backdrop blur `blur-glass` with saturation `glass-saturate` + a 1px outer edge `glass-edge` + a specular highlight on the top edge `specular` + an outer shadow `elevation-glass`. Don't assemble your own glass; add `lg-glass` and a modifier class to the element:

| Modifier | Used on | Difference |
| --- | --- | --- |
| (none) | Nav islands, tab bars, toolbar groups, composer | `glass`, `blur-glass` |
| `lg-glass--flat` | Sidebars, inspectors and the composer fixed on solid `canvas` | No backdrop blur (blurring a solid color changes nothing and only costs performance) |
| `lg-glass--thick` | Panels that float over images or arbitrary content (for example a sidebar over a background extension) | `glass-thick` |
| `lg-glass--popover` | Menus, popovers, inline confirmations, toasts | `glass-thick`, `blur-popover`, `elevation-menu` |
| `lg-glass--media` | Labels, toolbar groups and buttons on the stage | `media-glass`, `media-edge`, `specular-media`, text `ink-on-media` |
| `lg-glass--elevated` | Toolbar groups on the stage | Adds `elevation-media` |
| `lg-glass--chip` | Small labels and small round buttons on the stage | `blur-chip` |

Not glass, but often used with it: `lg-plate` (a caption plate on the stage and on media frames, `media-plate`, no blur) and `lg-extend` (background extension, see below).

**Two strengths.** The default is Restrained (`blur-glass` 18px, saturation 170%). A site can offer a Stronger option: `LiquidGlass.applyTheme({ glass: "strong" })` adds `data-glass="strong"` to `<html>` and switches to `blur-glass-strong` and `glass-saturate-strong`. Only blur and saturation change, not opacity, so contrast calculations are unaffected.

**Scroll edge.** Whenever content can scroll under floating glass, place `.lg-scroll-edge` behind the glass: the default at the top (built into FloatingNavbar), and `lg-scroll-edge--bottom` at the bottom (tab bars, floating toolbars, a composer fixed to the bottom; built into TabBar). It fills `scroll-edge` across the height of the glass, then fades out over `space-24`. This density is the minimum that keeps `ink-muted` on glass at 4.5:1 in the worst case; don't make it lighter.

**Stage scrim.** `.lg-stage` has two fixed-height scrim bands at full strength: 64px at the top edge and 88px at the bottom edge. Labels go inside the top band and toolbars inside the bottom band; captions in the middle of the frame and on media frames use `lg-plate` instead. The bands are in pixels rather than percentages, so they hold at any stage height.

**Background extension.** When a hero image should extend under a sidebar, place `<div class="lg-extend" style="--lg-extend-image: url(…)">` behind the sidebar: it mirrors the adjacent image, blurs it with `blur-extend` and lays it under the sidebar, and the sidebar switches to `lg-glass--thick`. Use it only for static images; it is removed automatically in the Solid and high-contrast themes and with reduced transparency.

**Refraction.** A band `refraction-edge` wide at the edge of the glass bends the background inward by `refraction-scale` px. Add it only to components ≤ 50px tall (nav islands, small buttons), marked with `data-refract`. It works only in Chromium-based browsers; other browsers stop at blur + highlight. Glass on solid `canvas` shows no visible refraction; this is expected.

## Color

- Page background `canvas`; opaque content surfaces `surface`; inputs and recessed areas `surface-inset`; the media stage `stage`. Decorative dividers `line`; outline button borders `line-outline`.
- Text has only two levels: primary `ink` and secondary `ink-muted`. `ink-faint` is only for non-text marks (arrows, ticks, status dots); it is only 3:1, so don't set text in it. On the stage, use `ink-on-media` and `ink-on-media-muted`.
- `accent` is the fill for primary actions, and text on it is always `on-accent` (dark text). `accent-text` is accent-colored text and links; `accent-soft` is the light background for recommendation cards and selected rows. A screen has only one most-important accent action. In the light theme the `accent` fill is only 2.4:1 against the page, so selection outlines switch to `accent-text` automatically in the light theme.
- **Color in navigation and toolbars**: islands and toolbar groups themselves are not colored; progress bars use `lg-progress--neutral` and count badges use `lg-badge--count` (neutral); an accent primary action stands as its own piece and is not placed in a group; only counts that need the user's attention (for example 3 questions on "Sources") may use `lg-badge--warn`. In the composer, Send stays neutral (`fill`) while there is nothing to send and turns accent only when it can be pressed; the scope badge (`lg-badge--mono`) is neutral too.
- Status: `ok` (done, chosen), `warn` (needs a decision, missing sources), `danger` (destructive text), `danger-fill` (deletion confirmed). Each has `on-*` and `*-soft`. On the stage, issue markers use `media-warn` and completion uses `media-ok`. Status is always "dot or badge + text", never color alone.
- State layers: `fill` (segmented track, tinted buttons, list hover, sidebar groups), `fill-strong` (segmented thumb, tinted hover, current tab in the tab bar), `fill-pressed` (pressed). Only `ink` goes on `fill-strong`.
- Every color has values for six themes, including two high-contrast themes (text ≥ 7:1). When changing the brand color, change `accent`, `on-accent`, `accent-text`, `accent-soft` and `focus` together, give values for all six themes, and recalculate: `on-accent` ≥ 4.5:1 on `accent` and on its hover (`brightness-hover`) and pressed (`brightness-pressed`) states; `accent-text` ≥ 4.5:1 on `canvas`, `surface`, `fill`, glass and thick glass; `focus` ≥ 3:1 on every background.

## Typography

- Use system fonts: SF Pro and PingFang on Apple devices, Segoe UI and Microsoft JhengHei on Windows, Roboto and Noto Sans TC on Android. Numbers, IDs, timecodes and shortcuts use `--font-mono`. No font files need to be loaded; don't embed SF Pro on a site with `@font-face` (its license covers Apple platforms only).
- The interface is based on 14px: add `body` to `<html>`. Controls and lists use 13px (`label`, `callout`), subtitles 12px (`caption`), and marks, badges and group headers 12px or smaller (`label-sm`, `micro`). Panel and sheet titles use `title-3`; item titles use `title-1`.
- Website pages also have `display-1` (`display-1-sm` below 744px), `title-2` and `lead`. App interfaces don't use them.
- Set `lang="en"` on `<html>` for English pages. CJK pages should set their own `lang`; bundle.css uses it to handle CJK headings (no negative letter spacing, line breaks at punctuation).
- **No all caps.** Group and section headers use `label-sm` (weight 600, `ink-muted`); Latin headers use Title Case. Nothing in the system uses `text-transform: uppercase`.

## Spacing, sizes and corners

- Spacing is named in pixels (`space-2` to `space-96`); the name is the value. Island and panel insets use `space-6`, gaps between list rows `space-4`, gaps between panel sections `space-24`, gaps between toolbar groups `space-8`.
- Control heights: `control-xs` 26, `control-sm` 32, `control-md` 36 (default), `control-lg` 44 (primary confirmation), `control-xl` 50 (composer); nav island `nav-height` 42, toolbar group `toolbar-height` 48, tab bar `tabbar-height` 56 (`tabbar-height-min` 44 when minimized). On touch devices, always ≥ `target-min`.
- **Concentric corners**: when the gap between two nested corners is ≤ 8px, inner radius = outer radius − gap. Sidebar `radius-panel` 28, inset 6 → group `radius-2xl` 22; menu 22, inset 6 → item `radius-lg` 16; a 32px button in a 42px island has a 5px inset; the current tab in a 56px tab bar has a 4px inset and is also a capsule. With larger gaps, corners don't need to be concentric.
- Glass controls are always capsules (`radius-capsule`); the stage uses `radius-3xl`; sheets use `radius-sheet` 32, and at half height they sit `nav-inset-mobile` from the screen edges so the content beneath shows through the gap.

## Depth and motion

- Glass always carries both `specular` and one `elevation-*`. In the light theme glass has a white edge and is separated from the background only by the violet-tinted shadow of `elevation-glass`. Content cards don't use shadows; they use a `line` inner border.
- Accent and solid fills use `brightness-hover` on hover and `brightness-pressed` when pressed; tinted and plain use `fill-strong` and `fill-pressed`; glass buttons add a `fill` layer. Hover only brightens; it doesn't move anything.
- **Becomes glass during interaction**: the segmented control thumb is normally `fill-strong`; while pressed and dragged (`data-pressed`) it becomes a small piece of glass and flattens slightly, then settles with `ease-spring` on release.
- **Grows from the trigger**: menus, popovers and inline confirmations scale in from the position of the button that opened them (`GlassPanel()` sets `--lg-origin` from the trigger button), and shrink back when closed.
- Timing: color and hover `duration-fast`, segmented thumb and menus `duration-base`, sheets `duration-slow`. The gel feel comes only from `ease-spring`. Don't animate blur or `backdrop-filter`.
- All translation, scaling and deformation is written only inside `prefers-reduced-motion: no-preference`; when the user reduces motion, only fades remain.

## Icons

- 16 grid, 1.6px stroke (1.8 for the close button), round caps and joins, `currentColor`, inline SVG on `lg-icon`. Sizes: `icon-sm` 13 (small buttons, status rows), `icon-md` 16 (default), `icon-lg` 20 (tab bar, empty states, add tiles). Play and pause are solid shapes; everything else is line.
- Common actions in toolbars and navigation use icons, not text; don't mix icon-only and labeled buttons in one piece of glass. Menu items always put the icon first and the text after.
- The system ships no icon set; choose an open-source icon set with the same stroke and round caps, and use the same icon for the same action across the whole site. Don't use SF Symbols on a website (its license covers Apple platforms only), and don't use emoji as icons.
- Icon-only buttons always have an `aria-label`; if a shortcut applies, put it in both `title` and `aria-label` ("Play (Space)").

## Copy

- Use Title Case for buttons, menu items, tabs, segmented items, headers, sheet titles and toolbar labels (as Apple does): "Remove from Show", "Add Angle". Use sentence case for descriptions, hints, captions, messages, toasts and placeholders.
- Buttons are verb + object: "Use #2", "Remove from Show", "Split in Two"; never "OK". A primary button can include the next step: "Use #2, Then View Frame 15".
- State results, not mechanisms: "Done", "Processing", "Queued". Write progress as "2 / 5 · about 40 s".
- When the user must decide, ask directly and give two concrete options: "Frame 9 is portrait only, but the wall needs landscape. Crop it to landscape, or use Frame 10 instead?" Destructive confirmations say what is affected: "It's in the layout of 2 walls. If you remove it, the assistant will rearrange both walls with Frame 15."
- Localization: in CJK locales, put a half-width space between CJK text and Latin letters or numbers, and use full-width punctuation.

## Setup

1. Load `tokens.css`, `components/bundle.css` and `components/bundle.js` in that order. Put `bundle.js` in `<head>` without `defer`, then call `LiquidGlass.applyTheme()` so the theme applies before first paint. Set the viewport to `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` so safe areas (notch, Home indicator) take effect.
2. When the DOM is ready, call `LiquidGlass.init()`: it binds every `data-lg="navbar|tabbar|segmented|toolbar|modal|button|panel"`, every `data-lg-open="#id"` and every `data-tone` element, tracks the on-screen keyboard height (bottom tab bars and floating toolbars stay above the keyboard), and turns on refraction where possible.
3. Add `data-tone="dark"` to the stage; add `data-surface-tone="dark"` to dark page sections (for example a site hero), and nav islands switch to dark glass automatically as they pass over.
4. In site settings, offer "Appearance: Auto / Dark / Light", "Transparency: Auto / Full / Reduced" and "Glass: Restrained / Stronger", calling `applyTheme({ scheme })`, `applyTheme({ transparency })` and `applyTheme({ glass })` respectively. Safari doesn't expose the system Reduce Transparency setting to web pages, so this switch is the only option for Safari users.
5. For one-off feedback, use `LiquidGlass.toast("Added Frame 14 to the show.")`.
