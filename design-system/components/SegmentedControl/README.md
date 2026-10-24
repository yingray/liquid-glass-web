# SegmentedControl

A switch for 2–5 mutually exclusive options: a `fill` track and a `fill-strong` thumb that you can click, drag or move with arrow keys. While pressed and dragged the thumb becomes a small piece of glass, and it springs back slightly on release.

## When to use

- Switching views of the same content (Single / Side by Side / Grid), switching project areas (Picks / Sources), or as app-level links (Studio / Library).
- Don't use it for more than 5 options (more than 4 on mobile), long option labels, or something that is really a toggle.

## Structure

```html
<div class="lg-segmented" role="radiogroup" aria-label="Compare view" data-lg="segmented">
  <button class="lg-segmented__item" type="button" role="radio" aria-checked="true">Single</button>
  <button class="lg-segmented__item" type="button" role="radio" aria-checked="false">Grid</button>
  <span class="lg-segmented__thumb" aria-hidden="true"></span>
</div>
```

- When switching content panels on the page, use `role="tablist"`, `role="tab"` and `aria-selected`, and point each tab to its `tabpanel` with `aria-controls`.
- **Link version**: for navigation, put `<a class="lg-segmented__item" aria-current="page">` inside `<nav class="lg-segmented">`, with no `data-lg` and no JavaScript needed.
- Items can carry a count badge: ordinary counts use `<span class="lg-badge lg-badge--sm lg-badge--count">3</span>` (neutral); add `lg-badge--warn` only for counts that need the user's attention (for example questions awaiting a reply).
- `lg-segmented--block`: fills the width with equal-width items (for mobile).
- `lg-segmented--media`: for the stage, with a white thumb and `stage`-colored text.
- Option labels are short: one or two words (at most 4 characters in CJK).

## Sizes

| Size | Class | Item height | Text |
| --- | --- | --- | --- |
| sm | `lg-segmented--sm` | `control-xs` 26 | 12/600 |
| md | (default) | 30 | 13/600 |
| lg | `lg-segmented--lg` | `control-sm` 32 | 13/600 |

The track has a 3px inset; thumb and track are both capsules. On touch devices items grow to 38 automatically (track 44).

## States

Unselected is `ink-muted`, becoming `ink` on hover; selected is a `fill-strong` thumb + `elevation-thumb` with `ink` text; while pressed (`data-pressed`) the thumb becomes glass (`glass` + `blur-chip` + highlight) and flattens to 1.05 × 0.94 — with reduced motion it doesn't deform, and in the Solid and high-contrast themes the glass is already opaque, so only the blur is dropped; focus is the two-layer focus ring; disabled items get `aria-disabled="true"` and are skipped by the keyboard; to disable the whole group, add `aria-disabled="true"` to the container.

Without JavaScript there is no sliding thumb; the selected item draws its own `fill-strong` background. It looks the same, just without animation.

## JavaScript

```js
const seg = LiquidGlass.SegmentedControl(el, { onChange: (index, value, item) => {} });
seg.select(1); seg.index; seg.destroy();
el.addEventListener("lg:change", (e) => e.detail /* { index, value } */);
```

Keyboard: ← → ↑ ↓ move and select (reversed automatically in RTL), Home / End go to the first and last; only the selected item is in the Tab order. Pointer: press and drag across items to change the selection.
