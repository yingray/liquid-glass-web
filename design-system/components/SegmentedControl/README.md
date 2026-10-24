# SegmentedControl

A switch for 2–5 mutually exclusive options: a `fill` track and a `fill-strong` thumb that you can click, drag or move with arrow keys. While pressed and dragged the thumb becomes a small piece of glass, and it springs back slightly on release.

## When to use

- Switching views of the same content (Single / Side by Side / Grid), switching project areas (Picks / Sources), or as app-level links (Studio / Library).
- Don't use it for more than 5 options (more than 4 on mobile), long option labels, or something that is really a toggle.

## Structure

```html
<div class="lg-segmented" role="radiogroup" aria-label="Compare view" data-lg="segmented">
  <button class="lg-segmented__item" type="button" role="radio" aria-checked="true" data-value="single">Single</button>
  <button class="lg-segmented__item" type="button" role="radio" aria-checked="false" data-value="grid">Grid</button>
  <span class="lg-segmented__thumb" aria-hidden="true"></span>
</div>
```

- Give each item a stable `data-value`. It is the value that `onChange` and `lg:change` report; without it, the value is the label without badges or `.lg-sr-only` text, which changes when the label is translated.
- When switching content panels on the page, use `role="tablist"`, `role="tab"` and `aria-selected`, and point each tab to its `tabpanel` with `aria-controls`. `SegmentedControl()` shows the selected tab's panel and hides the others. A horizontal tablist handles Left and Right only; add `aria-orientation="vertical"` for Up and Down. Add `data-activation="manual"` so arrows only move focus and Enter or Space switches.
- **Link version**: for navigation, put `<a class="lg-segmented__item" aria-current="page">` inside `<nav class="lg-segmented">`, with no `data-lg` and no JavaScript needed.
- Items can carry a count badge: ordinary counts use `<span class="lg-badge lg-badge--sm lg-badge--count" aria-hidden="true">3</span>` (neutral); add `lg-badge--warn` only for counts that need the user's attention (for example sources awaiting a decision). Hide the number from screen readers and add hidden text instead: `<span class="lg-sr-only">, 3 pending</span>`.
- `lg-segmented--block`: fills the width with equal-width items (for mobile).
- `lg-segmented--media`: for the stage, with a white thumb and `stage`-colored text.
- Option labels are short: one or two words (at most 4 characters in CJK).

## Sizes

| Size | Class | Minimum item height | Type role (compact) |
| --- | --- | --- | --- |
| sm | `lg-segmented--sm` | `control-xs` 26 | `label-sm` 12/600 |
| md | (default) | `control-seg` 30 | `label` 13/600 |
| lg | `lg-segmented--lg` | `control-sm` 32 | `label` 13/600 |

The track has a 3px inset; thumb and track are both capsules. Heights are minimums, so the comfortable density and larger text grow the items. On touch devices items grow to 38 automatically (track 44); with any touch pointer each item also gets an invisible 44 × 44 hit area.

## States

Unselected is `ink-muted`, becoming `ink` on hover; selected is a `fill-strong` thumb + `elevation-thumb` with `ink` text; while pressed (`data-pressed`) the thumb becomes glass (`glass` + `blur-chip` + highlight) and flattens to 1.05 × 0.94 (on the stage, `lg-segmented--media`, the thumb becomes `media-plate` and the selected label turns white) — with reduced motion it doesn't deform, and in the Solid and high-contrast themes the glass is already opaque, so only the blur is dropped; focus is the two-layer focus ring; disabled items get `aria-disabled="true"` and are skipped by the keyboard; to disable the whole group, add `aria-disabled="true"` to the container.

Without JavaScript there is no sliding thumb; the selected item draws its own `fill-strong` background. It looks the same, just without animation.

## JavaScript

```js
const seg = LiquidGlass.SegmentedControl(el, {
  onChange: (index, value, item) => {},   // once per committed change
  onPreview: (index, value, item) => {},  // while a drag shows another item
  controlled: false,                      // true: a change is a request; the host commits it
  activation: "automatic"                 // tabs only: "manual" switches on Enter or Space
});
seg.select(1);                  // commit; seg.select(1, { emit: false }) syncs from the host without onChange
seg.index; seg.value; seg.refresh(); seg.destroy();
el.addEventListener("lg:change", (e) => e.detail /* { index, value } */);
```

Keyboard: in a radio group, ← → ↑ ↓ move and select; in a horizontal tablist, only ← →; in a vertical tablist (`aria-orientation="vertical"`), only ↑ ↓. ← → are reversed automatically in RTL; Home / End go to the first and last; only the selected item is in the Tab order. Pointer: press and drag across items to preview another item; release commits once, and a cancelled gesture (`pointercancel`) reverts. Only horizontal drags select (`touch-action: pan-y`), so a vertical swipe still scrolls the page.

- **Controlled**: with `controlled: true`, a user change is a request. The host commits it with `select(index, { emit: false })`; if it does not by the next frame, the control returns to the committed item.
- **Dynamic items**: `refresh()` re-reads the items, and it runs by itself when items are added or removed. The selection keeps its element or value; if that item is gone, it falls back to the first enabled item.
