# GlassPanel

GlassPanel covers the glass panels that float on the canvas: sidebars and inspectors, menus and popovers, and toasts.

## Which one to use

| Purpose | Class | Example |
| --- | --- | --- |
| Inspector, sidebar (fixed on solid canvas) | `lg-panel lg-glass lg-glass--flat` (add `lg-panel--rail` for a left rail) | Needs Your Decision, Notes, Activity; the category list in the library |
| Sidebar (floating over images, for example with a background extension) | `lg-panel lg-glass lg-glass--thick` | A sidebar next to a site hero |
| Menu, popover, inline confirmation | `lg-menu lg-glass lg-glass--popover` | A card's "More" menu, the queue, inline confirmations |
| Toast | `lg-toast lg-glass lg-glass--popover` or `LiquidGlass.toast()` | "Added Frame 14 to the show." |

## Inspector

```html
<aside class="lg-panel lg-glass lg-glass--flat" aria-label="Inspector">
  <div class="lg-panel__group">
    <div class="lg-panel__head"><h3>Needs Your Decision</h3><span class="lg-panel__count">3</span></div>
    <button class="lg-row" type="button">(thumbnail, title, subtitle, arrow)</button>
    <div class="lg-callout lg-callout--warn">(question and two options)</div>
  </div>
  <section class="lg-panel__section">
    <div class="lg-panel__head"><h3>Notes</h3><span class="lg-panel__count">3</span></div>
    …
  </section>
  <div class="lg-panel__footer">(primary action, fixed at the bottom)</div>
</aside>
```

- `aside-width` wide (`aside-width-compact` below 1100px), corner radius `radius-panel` 28, inset `space-6`; groups have corner radius `radius-2xl` 22, concentric with the panel. Content outside groups is inset a further `space-4`, with `space-24` between sections. When content overflows, the panel scrolls on its own.
- **Material**: the inspector is fixed on canvas and no content ever passes behind it, so it uses `lg-glass--flat` (same appearance as glass, no backdrop blur). If the sidebar floats over images (for example with the `lg-extend` background extension), use `lg-glass--thick` instead.
- What most needs the user goes at the top, framed by `lg-panel__group` (`fill` background); other sections have no background. Group headers use `lg-panel__label` (normal case).
- Nothing inside is glass: list rows `lg-row`, callouts, progress `lg-progress` and buttons all use opaque or `fill` styles.
- Mobile: the inspector becomes a half-height sheet (Modal).

## Menu

```html
<button class="lg-btn lg-glass lg-glass--media lg-glass--chip lg-btn--icon lg-btn--sm" type="button"
        aria-label="More actions for Frame 14" aria-expanded="false" aria-controls="card-menu">…</button>
<div class="lg-menu lg-menu--sm lg-glass lg-glass--popover" role="menu" aria-label="Frame 14" id="card-menu" hidden data-lg="panel">
  <button class="lg-menu__item" type="button" role="menuitem">(icon) View Larger</button>
  <button class="lg-menu__item" type="button" role="menuitem">(icon) Replace Image</button>
  <div class="lg-menu__sep" role="separator"></div>
  <button class="lg-menu__item lg-menu__item--danger" type="button" role="menuitem">(icon) Remove from Show</button>
</div>
```

- **Thick glass**: menus can cover any content, so they are always `glass-thick`. Any `.lg-menu` with `lg-glass` is thick glass, even if `lg-glass--popover` is forgotten.
- **Every item has an icon**, icon first and text after; the same action uses the same icon across the whole site. Destructive actions are separated with `lg-menu__sep` and placed last.
- **Grows from the trigger**: `GlassPanel()` sets `--lg-origin` from the trigger button's position, and the menu scales in from there (only fades in with reduced motion).
- `menu-width` wide (`menu-width-sm` for small menus on cards), padding `space-6`, items 40 tall with corner radius `radius-lg` (concentric with the menu's 22).
- **Inline confirmation**: when the user picks a destructive item, the menu content is replaced by `lg-menu__confirm` — a bold question, a description of what is affected, and "Cancel" and `lg-btn--danger` buttons. It is anchored next to the trigger button and is not modal; the rest of the screen stays usable. Don't open a separate dialog.
- **Status popover** (queue): `lg-menu__label` (a normal-case group header, for example "Running and Queued") plus `lg-menu__status` rows (status dot + name + description).
- **Swipe actions**: if list rows support swipe gestures, the first menu items list the same actions in the same order.

## Toast

```js
LiquidGlass.toast("Added Frame 14 to the show.", { timeout: 2800 });
```

One short sentence on one line, capsule, thick glass, centered at `content-top`, disappears after 2.8 seconds; toasts share one `role="status"` region, so repeated messages are announced too. Don't use a toast for messages that need the user to act; put them in the inspector's "Needs Your Decision".

## JavaScript (menus and popovers)

```js
const panel = LiquidGlass.GlassPanel(menu, { trigger: button, dismissible: true });
panel.show(); panel.hide(); panel.toggle();
```

Without `trigger`, it finds the button whose `aria-controls` points to it. It handles: toggling on trigger click, syncing `aria-expanded`, setting `--lg-origin` from the trigger button, closing on Esc and returning focus to the trigger button, and closing on outside click. Positioning is up to the page (you can use the native `popover` attribute or CSS anchor positioning).

## Accessibility

- Inspectors use `<aside aria-label>`; section headers use real heading elements (`h3`).
- Menus use `role="menu"` / `menuitem`; during inline confirmation, switch to `role="dialog"` + `aria-labelledby`.
- If the trigger button is icon only, its `aria-label` names the object ("More actions for Frame 14").
- Don't put continuously updating content (progress, activity) in an `aria-live` region.
