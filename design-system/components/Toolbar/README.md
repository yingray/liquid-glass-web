# Toolbar

A row of actions that act on the content in view, grouped by function with **one piece of glass per group**, fixed spacing between groups and the primary action on its own. The whole toolbar has a single Tab stop, and arrow keys move across all buttons (across groups). There is one variant: the composer (Composer).

## When to use

- Actions on the content in view: playback and review on the stage (Play, timecode, Review, Add Note, Share), editing on canvas (Undo, Redo, view options, Share, More).
- For an input bar that gives instructions to the assistant or system, use Composer.
- Don't use it for site navigation (that's FloatingNavbar and TabBar).

## Structure

```html
<div class="lg-toolbar" role="toolbar" aria-label="Edit" data-lg="toolbar">
  <div class="lg-toolbar__group lg-glass">
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Undo" title="Undo (⌘Z)">…</button>
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Redo" title="Redo (⇧⌘Z)">…</button>
  </div>
  <div class="lg-toolbar__group lg-glass">
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Compare" aria-pressed="true">…</button>
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Grid" aria-pressed="false">…</button>
  </div>
  <div class="lg-toolbar__group lg-glass">
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Share">…</button>
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="More">…</button>
  </div>
</div>
```

**On the stage** (inside `.lg-stage__bottom`, within the 88px scrim band at the bottom edge):

```html
<div class="lg-toolbar" role="toolbar" aria-label="Playback" data-lg="toolbar">
  <div class="lg-toolbar__group lg-toolbar__group--readout lg-glass lg-glass--media lg-glass--elevated">
    <button class="lg-btn lg-btn--media-solid lg-btn--icon" type="button" aria-label="Play (Space)">…</button>
    <span class="lg-toolbar__text">0:13<small> / 0:47</small></span>
  </div>
  <button class="lg-btn lg-btn--accent" type="button">Review 4 Candidates</button>
  <div class="lg-toolbar__group lg-glass lg-glass--media lg-glass--elevated">
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Add Note" aria-pressed="false">…</button>
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Share">…</button>
  </div>
</div>
```

- **Grouping**: put buttons that do similar things, or affect the same area of the screen, in the same `lg-toolbar__group`. Groups are a fixed `space-8` apart; use `lg-spacer` to push a group to the other side. Don't use dividers to group within one piece of glass.
- **A group holds only icon buttons.** A labeled primary action (`lg-btn--accent`) doesn't go in any group; it goes directly in `lg-toolbar`.
- **Readout group** `lg-toolbar__group--readout`: a play button + monospaced timecode, optionally with a scrubber `lg-scrub` (`--lg-value` sets progress). This is the only group that can contain text, because the text is a readout of the control next to it, not a button. Status text ("4 playing in sync") doesn't belong in the toolbar: put it in a stage label at the top edge.
- Each group is `toolbar-height` (48) tall with a 6px inset on each side, and buttons use `plain`; groups on the stage use `lg-glass--media lg-glass--elevated`.
- A choice such as zoom can be a whole group as one `lg-segmented--media lg-segmented--sm`.
- **Hiding**: add `hidden` directly to buttons that aren't needed; when every button in a group is hidden, that piece of glass disappears automatically.
- When fixed to the bottom of the viewport, add `lg-toolbar--float` to `lg-toolbar` (safe areas and the on-screen keyboard are handled); when content scrolls under it, place `lg-scroll-edge lg-scroll-edge--bottom` behind it.

## Composer

```html
<form class="lg-composer lg-glass" role="search" aria-label="Instructions for the assistant">
  <span class="lg-dot lg-dot--lg lg-dot--accent" aria-hidden="true"></span>
  <span class="lg-badge lg-badge--mono">@all</span>
  <input class="lg-composer__input" type="text" placeholder="Tell the assistant how to adjust these photos…" aria-label="Instructions for the assistant">
  <span class="lg-composer__hint" aria-hidden="true">⌘K</span>
  <button class="lg-btn lg-btn--accent" type="submit" disabled>Send</button>
</form>
```

- `control-xl` tall, at most `composer-max` wide, centered at the bottom of the main column; the Send button is 38px. When fixed on solid `canvas` with no content passing behind it, add `lg-glass--flat`.
- The scope badge (`@all`, `@12–18`) tells users where the instruction will apply; it updates when the selection changes.
- "Send" is `disabled` while the input is empty and is drawn neutral (`fill`) until then, so the accent appears only when it can be pressed; Enter sends, and ⌘K focuses it from anywhere.
- On mobile the composer sits directly above the tab bar as its accessory, the same width as the tab bar.
- On mobile, the composer is the input field at the very bottom of the page, so a TabBar on the same page doesn't include a search button.

## Sizes and responsive

Toolbar groups are `toolbar-height` (48) tall, 56 on touch devices. Mobile: the stage toolbar fills the stage width — a frame-navigation group on the left (previous, number, next) and a separate accent primary action on the right; other controls go into the "More" menu in the top-right corner of the stage. The composer fills the width and hides ⌘K.

## JavaScript

```js
LiquidGlass.Toolbar(el); // returns { element, destroy }
```

Reduces the Tab stops to one (the last focused button), enables ← →, Home and End (moving across groups, skipping disabled and hidden buttons), and binds GlassButton behavior to buttons with `aria-pressed` or `aria-disabled`. Composer needs no JavaScript.

## Accessibility

- A toolbar always has an `aria-label` that says what it controls ("Playback", not "Toolbar").
- Every icon button has an `aria-label`; shortcuts go into `title`.
- If the timecode updates continuously, don't put it in an `aria-live` region.
- The composer's placeholder is not a label: always add `aria-label`.
