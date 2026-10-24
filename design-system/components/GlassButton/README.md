# GlassButton

GlassButton is the capsule button, with seven styles for canvas, surface and glass and three for the stage.

## Which one to use

| Style | Class | Used for | Max per screen |
| --- | --- | --- | --- |
| accent | `lg-btn--accent` | The next step of the current task: Review while reviewing, Send while the composer has text, Use. In navbars and toolbars it stands on its own, not inside an island or group | 1 per task scope |
| inverse | `lg-btn--inverse` | Decisions that need emphasis but aren't the primary action (the first option in a question card) | 2 |
| tinted | `lg-btn--tinted` | Secondary actions: Cancel, Redo All, Edit, Close | — |
| plain | `lg-btn--plain` | Buttons in nav islands and toolbar groups (usually icon only), text actions next to lists | — |
| outline | `lg-btn--outline` | Toggleable secondary actions (Add Note); inverted when on | — |
| danger | `lg-btn--danger` | Destructive actions (inline confirmation in a menu, a centered dialog); `data-armed` means confirmed. On hover and press the text becomes `danger-strong` | 1 |
| glass | `lg-glass` added to the button | Standalone buttons floating directly on canvas, for example Export next to the navbar's project tabs; add `lg-glass--thick` when they float over images or arbitrary content; use `lg-btn--nav` for height | 3 |
| media-solid | `lg-btn--media-solid` | The white round Play / Pause button on the stage | 1 |
| media | `lg-btn--media` | Round icon buttons on the stage (previous, next) | — |
| glass--media | `lg-glass lg-glass--media` added to the button | Standalone buttons on the stage frame ("More" in the top-right corner, Add Angle); placed inside a scrim band | — |

Rule: glass containers (islands, sidebars, toolbar groups, menus) **don't contain** the glass style. Mapping to Apple's built-in styles: glass ≈ `lg-glass`, prominent glass ≈ `lg-btn--accent`, clear glass ≈ `lg-glass--media`. Accent is only for the next step of the current task; other actions, Export included, stay tinted or glass. In the light theme the accent fill is only 2.4:1 against the page, and the button is recognized by its dark label (6.7:1), so accent buttons must always have text.

## Structure

```html
<button class="lg-btn lg-btn--accent" type="button">Export</button>
<button class="lg-btn lg-btn--tinted lg-btn--icon lg-btn--sm" type="button" aria-label="Close">…</button>
<button class="lg-btn lg-btn--outline lg-btn--sm" type="button" aria-pressed="false">(icon) Add Note</button>
<button class="lg-btn lg-btn--media-solid lg-btn--icon" type="button" aria-label="Play" data-tooltip>…</button>
```

- Always write `type="button"` on `<button>`; use `<a>` for navigation, with the same styles.
- The icon goes before the text, `space-6` apart; for icon only, add `lg-btn--icon`, `aria-label` and `data-tooltip` (shows the name on hover and keyboard focus). When sharing a piece of glass with other buttons, put only icon buttons or only text buttons in it.
- Add `hidden` directly to buttons that aren't needed; don't hide only their icon or text.
- Stage buttons go inside a stage with `data-tone="dark"`.

## Sizes

| Size | Class | Minimum height | Horizontal padding | Type role (compact) |
| --- | --- | --- | --- | --- |
| xs | `lg-btn--xs` | `control-xs` 26 | `space-10` | `label-sm` 12/600 |
| sm | `lg-btn--sm` | `control-sm` 32 | `space-14` | `label` 13/600 |
| md | (default) | `control-md` 36 | `space-16` | `label` 13/600 |
| lg | `lg-btn--lg` | `control-lg` 44 | `space-24` | `body-strong` 14/600 |
| nav | `lg-btn--nav` | `nav-height` 42 | `space-14` | `label` 13/600 |

Heights are minimums: in the comfortable density (`label` 15px) and with larger text the button grows. Buttons inside nav islands become 32 automatically. On touch devices (`pointer: coarse`) they are always at least 44; with any touch pointer (`any-pointer: coarse`) an invisible `::before` extends the hit area to 44 × 44.

## States

See "Interaction states". Key points: hover for accent, inverse and media-solid is `brightness-hover`; tinted is `fill-strong`; plain and outline are `fill`; disabled is `opacity-disabled`; toggles are inverted when on.

## JavaScript (optional)

```js
LiquidGlass.GlassButton(el, { toggle: true, onToggle: (pressed, el) => {} });
```

Blocks clicks on `aria-disabled="true"` and toggles `aria-pressed` on click. `setDisabled(true)` uses `aria-disabled`, so the button stays focusable and discoverable. Ordinary buttons and links don't need it. `LiquidGlass.init()` shows `data-tooltip` tooltips on any element without this controller.

## Accessibility

- Labels name the action ("Remove from Show"), never "OK".
- Toggles use `aria-pressed`; don't change only the icon or color.
- Don't use `title`. Icon-only buttons use `data-tooltip`. Show a shortcut only when the app registers it (`LiquidGlass.shortcut()`); then set `aria-keyshortcuts`, and the tooltip shows it.
