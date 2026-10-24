# Interaction states

Every interactive component has the same set of states: rest, hover, pressed, focus and disabled; toggleable components add "selected / open". States change only color, brightness and highlight; nothing moves and shadows don't grow. The one exception is the segmented control thumb: while pressed it becomes a small piece of glass, matching Apple's "controls become Liquid Glass during interaction".

## General rules

- **Hover is only for devices with a pointer.** All hover styles are inside `@media (hover: hover)`; a tap on a touch screen doesn't leave a sticky hover. Don't put information only in hover.
- **Pressed**: color changes within `duration-instant`; when motion is allowed, the button scales to 0.96 and springs back with `ease-spring` on release.
- **Two-layer focus ring**: an inner ring `focus-inner` that is `focus-gap` wide, and an outer ring `focus` that is `focus-width` wide. The inner ring keeps the focus ring visible on accent fills, images and glass. Show it only for `:focus-visible`; don't remove it with `outline: none`. Inputs and the composer draw the focus ring on their outer border.
- **Disabled** lowers the whole element to `opacity-disabled` with no separate color change (WCAG exempts disabled components from contrast). Use `disabled` when something temporarily can't be pressed and needs no explanation; use `aria-disabled="true"` when assistive technology should know "this feature exists but isn't available now" — `GlassButton()` blocks the click. When the composer is empty, "Send" is `disabled`.
- **Hide unneeded items entirely, not just their content.** Add `hidden` to the button itself; when every button in a toolbar group is hidden, the group (that piece of glass) disappears automatically, so no empty glass is left behind.
- **Toggles when on** (`aria-pressed="true"`) are always inverted: `ink` background, `canvas` text; on the stage, white background and `stage` text.
- **Selected**: segmented controls use the thumb; the current tab in the tab bar uses a `fill-strong` capsule; list rows use an `accent-soft` background; media frames use a `ring-selected` outline (`accent` on dark backgrounds, `accent-text` on light backgrounds).
- **Forced states for docs and screenshots**: add `data-state="hover|active|focus"` to an element to pin that state. Don't use it in production interfaces.

## Reference table

| Component | Rest | Hover | Pressed | Focus | Disabled | Selected / open |
| --- | --- | --- | --- | --- | --- | --- |
| accent, inverse, media-solid | Fill | `brightness-hover` | `brightness-pressed`, scale to 0.96 | Two-layer focus ring | `opacity-disabled` | — |
| tinted, danger | `fill` | `fill-strong` | `fill-pressed` | Two-layer focus ring | `opacity-disabled` | danger after confirmation (`data-armed`): `danger-fill` |
| plain, outline | Transparent (outline has a `line-outline` inner border) | `fill` | `fill-pressed` | Two-layer focus ring | `opacity-disabled` | `aria-pressed`: inverted |
| Glass button (`lg-glass`, `lg-glass--media`) | Glass | Adds a `fill` layer (`media-fill` on the stage) | Adds a `fill-pressed` layer | Two-layer focus ring | `opacity-disabled` | — |
| media (round stage button) | `media-fill` | `media-fill-hover` | Adds a `fill-pressed` layer | Two-layer focus ring | `opacity-disabled` | `aria-pressed`: white background |
| Segmented item | `ink-muted` | `ink` | Thumb becomes glass (`data-pressed`), flattened to 1.05 × 0.94 | Two-layer focus ring | `opacity-disabled`, skipped by keyboard | `fill-strong` thumb + `ink`; on the stage, white thumb + `stage` text |
| Tab bar tab | `ink-muted`, icon + 10.5px text | `ink` | `fill-pressed` | Two-layer focus ring | — | `aria-current="page"`: `fill-strong` capsule + `ink` |
| Tab bar search button | Round glass button | Adds a `fill` layer | Adds a `fill-pressed` layer | Two-layer focus ring | — | — |
| List row | Transparent | `fill` | — | Two-layer focus ring | — | `accent-soft` |
| Menu item | Transparent, icon + text | `fill` | `fill-pressed` | Two-layer focus ring | `opacity-disabled` | Current item: `fill` + weight 600 |
| Chip | `fill` + `ink-muted` | Text becomes `ink` | — | Two-layer focus ring | — | Inverted |

## Contrast

All of these states are included in the verification: `on-accent` is ≥ 5.9:1 on `accent` at rest, hover and pressed; `ink` is ≥ 4.5:1 on `fill-strong` and `fill-pressed`; `ink-muted` is ≥ 4.5:1 on `fill` (including two layers stacked in a group); on the thick glass of menus and sheets, `ink`, `ink-muted` and `danger` are ≥ 4.5:1 at rest, hover and pressed; high-contrast themes are all ≥ 7:1. The accent in the light high-contrast theme is a dark fill with white text, so its hover darkens (0.9) instead of brightening. When adding a new state overlay, recalculate the same way.
