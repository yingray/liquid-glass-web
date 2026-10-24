# Modal

A sheet that rises from the bottom (native `<dialog>`) for a small task that needs focus: adding, replacing, configuring. At half height it is thick glass, inset from the screen edges so the content beneath shows through the gap; at full height it becomes opaque so the user can focus on the task.

## When to use

- Small tasks with input and choices: adding an angle to a source, choosing a replacement image, export settings.
- The inspector on mobile: content that sits in a sidebar on desktop opens in a sheet at 390px.
- **Short decisions with a large consequence**: add `lg-modal--center` (usually with `lg-modal--compact`). At ≥ 744px it is a centered dialog; on mobile it is still a sheet. Choose the confirmation by consequence: a reversible action runs and offers Undo (toast); a local destructive action is confirmed inline in the menu (see GlassPanel); only a consequence beyond what the user sees, or an irreversible bulk action, uses a centered dialog.
- Don't open a sheet inside a sheet; when content exceeds one screen, use a separate page.

## Structure

```html
<button class="lg-btn lg-btn--tinted" type="button" data-lg-open="#add-angle">Add Angle</button>

<dialog class="lg-modal" id="add-angle" aria-labelledby="add-angle-title" data-lg="modal">
  <span class="lg-modal__grabber" aria-hidden="true"></span>
  <div class="lg-modal__header">
    <h2 class="lg-modal__title title-3" id="add-angle-title">Add an Angle to “Harbor”</h2>
    <button class="lg-btn lg-btn--tinted lg-btn--icon lg-btn--sm" type="button" aria-label="Close" data-lg-close>…</button>
  </div>
  <div class="lg-modal__body">
    (input, chips, segmented control)
    <p class="label-sm">From the Library</p>
    (thumbnails)
  </div>
  <div class="lg-modal__footer">
    <span class="lg-modal__hint">Choosing this locks the angle; later versions will follow it.</span>
    <button class="lg-btn lg-btn--accent" type="button" data-lg-close="confirm">Use “Harbor · Backlit”</button>
  </div>
</dialog>
```

- **Material follows height**:
  - Half height: `glass-thick` + `blur-popover`, 8px (mobile) or 16px (desktop) from the screen edges. Text on thick glass is ≥ 4.5:1 over pure white or pure black.
  - Full height: when content grows the sheet to its maximum height (viewport height minus 88px), or ≥ 90% of the viewport height, `Modal()` adds `data-expanded`, and the background switches to opaque `surface` with no blur. Below 744px a full-height sheet also stops being inset: it meets the left, right and bottom screen edges (only half-height sheets are inset). For a sheet that should fill the screen from the start, add `lg-modal--full` directly.
  - Always opaque in the Solid and high-contrast themes and with reduced transparency.
- Nothing inside the sheet is glass: inputs use `surface-inset`, groups `fill`, buttons `tinted` and `accent`. Group headers use `label-sm`, not all caps.
- Corner radius `radius-sheet` 32. Don't crowd content into the corners: keep a fixed `space-20` on the sides and bottom, and don't use negative margins to push thumbnails or buttons to the edge.
- The title uses `title-3` and says clearly what the task is; it wraps instead of being cut off. The primary button states the result ("Use “Harbor · Backlit”"), not "OK".
- The hint at the bottom (`lg-modal__hint`) tells users the consequence of the action.
- For a single question, use `lg-modal--compact` (480). `lg-modal--static` is only for docs and screenshots.

## Sizes and responsive

| | < 744px | ≥ 744px |
| --- | --- | --- |
| Width | Viewport − 16px | `sheet-width` (820) or `sheet-width-compact` (480) |
| Position | 8px + safe area from the bottom | Centered, 16px from the bottom; `lg-modal--center` is centered vertically too |
| Footer | Hint on top, primary button full width | Hint on the left, primary button on the right (`control-lg`) |
| Corner radius | `radius-sheet` | `radius-sheet` |

It enters by sliding up 28px + fading in (`duration-slow`, `ease-emphasized`); with reduced motion it only fades in. The background change between half and full height transitions over `duration-slow`. The backdrop is `scrim`, with no blur.

## JavaScript

```js
const m = LiquidGlass.Modal(dialog, {
  dismissOnBackdrop: true,          // close when pointer down AND up are both outside the sheet
  beforeClose: (reason, dialog) => !hasUnsavedInput(),   // reason: "escape" | "backdrop" | "close-button" | "api"
  onOpen: (dialog) => {},
  onClose: (returnValue, dialog) => {}
});
m.open(trigger); m.requestClose(); m.close("confirm"); m.destroy();
dialog.addEventListener("lg:closerequest", (e) => { if (hasUnsavedInput()) e.preventDefault(); });
```

Buttons with `data-lg-open="#id"` are bound automatically by `LiquidGlass.init()`. Esc, the backdrop and `data-lg-close` all go through the same animated close flow; `returnValue` is the value of `data-lg-close`.

- **Backdrop**: a click closes the sheet only when the pointer goes down and up outside the sheet, so a drag that starts in a field and ends on the backdrop doesn't close it.
- **Unsaved input**: `beforeClose(reason)` can return `false` to keep the sheet open; then the cancelable `lg:closerequest` event (detail `{ reason }`) runs, and a listener can also keep it. `requestClose(reason)` asks to close as the user would and returns `false` if refused. `close()` from code is never blocked.
- **Focus** returns to the opener; if the opener is gone or hidden (an item of a closed menu), it goes to the visible control whose `aria-controls` names the opener's container.
- **Overlay stack**: Esc closes only the top layer, so a menu open inside the sheet closes first, then the sheet.
- A toast shown while the sheet is open appears inside it; closing the sheet clears it.
- Page scrolling is locked while open. While the sheet is open, `Modal()` re-evaluates whether it is full height as content and viewport size change. `destroy()` is safe while the sheet is open.

## Accessibility

- Always use `showModal()` (handled by `init`) so the background becomes inert and focus stays in the sheet.
- `aria-labelledby` points to the title; the grabber is decorative only (`aria-hidden`), and there is always a separate close button.
