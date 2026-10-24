# FloatingNavbar

A row of glass islands floating above the page — brand, current project context and tools, one island each, with space between. On mobile there is also a tab bar (TabBar) floating at the bottom; the two are presentations of the same set of destinations.

## When to use

- The main navigation of a website or app, one per page.
- Secondary tabs within a page use SegmentedControl (`role="tablist"`); don't stack a second row of glass below the islands.

## Structure

```html
<header class="lg-navbar" data-lg="navbar">
  <div class="lg-scroll-edge" aria-hidden="true"></div>
  <div class="lg-navbar__row">
    <div class="lg-navbar__island lg-glass" data-refract>
      <a class="lg-navbar__brand lg-focusable" href="/" aria-label="Brand home">(logo) Brand name</a>
      <span class="lg-nav-desktop">
        <nav class="lg-segmented" aria-label="App">
          <a class="lg-segmented__item lg-navbar__link" href="/studio" aria-current="page">Studio</a>
          <a class="lg-segmented__item lg-navbar__link" href="/library">Library</a>
          <a class="lg-segmented__item lg-navbar__link" href="/shows">Shows</a>
        </nav>
      </span>
    </div>
    <div class="lg-navbar__island lg-navbar__island--text lg-glass lg-nav-desktop" data-refract>
      <span class="lg-navbar__crumb lg-nav-optional"><a href="/shows">Shows</a><span class="lg-navbar__crumb-sep">/</span></span>
      <b>Island Light</b>
      <span class="lg-progress lg-progress--md lg-progress--neutral lg-nav-optional" style="--lg-value: 38%"><span></span></span>
      <span class="mono lg-muted lg-nav-optional">18 / 48 selected</span>
    </div>
    <div class="lg-navbar__island lg-navbar__island--tight lg-glass lg-nav-desktop">
      (project tabs: SegmentedControl, role="tablist")
    </div>
    <button class="lg-btn lg-btn--accent lg-nav-desktop" type="button">Export</button>
    <span class="lg-navbar__spacer"></span>
    <div class="lg-navbar__island lg-navbar__island--tight lg-glass" data-refract>
      <button class="lg-btn lg-btn--plain lg-btn--icon lg-nav-desktop" type="button" aria-label="Search" title="Search (⌘F)">…</button>
      <button class="lg-btn lg-btn--plain lg-nav-desktop" type="button" aria-label="Queue, 2 items">…<span class="lg-badge lg-badge--sm lg-badge--count">2</span></button>
      <button class="lg-btn lg-btn--plain lg-btn--icon lg-navbar__menu-toggle" type="button"
              aria-label="Menu" aria-expanded="false" aria-controls="site-menu">…</button>
    </div>
  </div>
  <div class="lg-navbar__menu lg-menu lg-glass lg-glass--popover" id="site-menu" hidden>
    <span class="lg-menu__label">Island Light · 18 / 48 Selected</span>
    <a class="lg-menu__item" href="/activity">(icon) Activity</a>
    <a class="lg-menu__item" href="/settings">(icon) Settings</a>
  </div>
</header>
```

You provide: the logo (using `currentColor` so it follows tone changes) and name, **one list of main destinations** (at most 5; rendered as links in the brand island at ≥ 744px and as the TabBar below 744px), the project name and tabs, at most one accent primary action, and the secondary items for the menu (each with an icon). The menu never repeats the main destinations.

- Islands come in a fixed order: **brand** with the main destinations (left), **context** (project name, neutral progress and count), **project tabs**, then **tools** (far right, pushed over with `lg-navbar__spacer`). Each island holds one kind of thing; don't use dividers to pack several kinds into one island. Pages without project context omit the context and project-tab islands.
- **The accent primary action doesn't go inside an island**: it is a direct child of `lg-navbar__row`, standing on its own at the same height as the islands. The islands themselves stay neutral: progress uses `lg-progress--neutral` and counts use `lg-badge--count`; only counts that need the user's attention (for example the number of questions on a tab) use `lg-badge--warn`.
- The tools island holds only icon buttons, each with an `aria-label`; buttons with a count include the count in the label.
- Islands are `nav-height` 42 tall, with `space-14` text padding on the left and 5px on the right, so the 32px buttons and the 32px segmented track inside are concentric with the island (5px all round). Islands that hold only controls use `lg-navbar__island--tight`; islands that end in text use `lg-navbar__island--text` (14px at both ends). On touch devices islands grow to 54px so 44px controls keep the same 5px inset.
- Buttons inside islands use `plain`, not glass buttons.
- `position: fixed` by default, with safe areas already included in its position; when placed inside a block (a preview frame, an embedded preview), add `lg-navbar--contained`.

## Responsive (container queries on its own width)

| Width | Rendering |
| --- | --- |
| ≥ 1100px | Everything shown |
| 744–1099px | `lg-nav-optional` hidden (breadcrumbs, progress, secondary text) |
| < 744px | `lg-nav-desktop` hidden (context island, app switcher, primary action, search), leaving only the brand and menu button; main tabs move to TabBar; `nav-inset-mobile` from the edges |

## TabBar (mobile tab bar)

```html
<nav class="lg-tabbar" aria-label="Main tabs" data-lg="tabbar" data-minimize="scroll-down">
  <div class="lg-scroll-edge lg-scroll-edge--bottom" aria-hidden="true"></div>
  <div class="lg-tabbar__tabs lg-glass">
    <a class="lg-tabbar__tab" href="/studio" aria-current="page">(icon)<span>Studio</span></a>
    <a class="lg-tabbar__tab" href="/library">(icon)<span>Library</span></a>
    <a class="lg-tabbar__tab" href="/shows">(icon)<span>Shows</span></a>
  </div>
  <button class="lg-tabbar__search lg-glass" type="button" aria-label="Search">(icon)</button>
</nav>
```

- Shown only below 744px; at ≥ 744px it hides automatically and the `lg-segmented` links in the brand island show the same destinations, in the same order, with the same current item. Render both from one list. When placed in a preview frame, add `lg-tabbar--contained` (shown at any width).
- 2–5 tabs, each an `icon-lg` icon + a short label (one word; at most 4 characters in CJK). The current tab has `aria-current="page"` and is drawn as a `fill-strong` capsule.
- Search is a separate 56px round glass button at the far right and doesn't share glass with the tabs. If the bottom of the page already has a search field or composer, omit it.
- `tabbar-height` 56 tall, 8px + safe area from the bottom and sides; stays above the on-screen keyboard when it opens. Content scrolls under it, so it has a built-in bottom scroll edge. Reserve `tabbar-height + space-24` at the bottom of the page.
- **Minimize on scroll**: with `data-minimize="scroll-down"` (default), scrolling down more than 48px shrinks it to two 44px round buttons (the current tab's icon and search), and scrolling up restores it; `scroll-up` is the reverse; `off` never minimizes. It always restores when focus enters; with reduced motion it switches directly without a size animation. Minimized labels are hidden visually only, so the current tab keeps its accessible name.

```js
const tabs = LiquidGlass.TabBar(nav, { minimize: "scroll-down", adaptiveTone: true, scrollContainer: window });
tabs.setMinimized(true); tabs.destroy();
```

## States and behavior

- Link and tab states are the same as SegmentedControl; the current page uses `aria-current="page"`. For tab bar tab states, see "Interaction states".
- `data-scrolled`: added by JavaScript when the page scrolls more than 4px, showing the scroll edge. Embedded demos pin the state with `data-scroll-manual` (same for TabBar).
- Each island, and the tab bar's tabs and search button, reads the `data-surface-tone` beneath it on its own and switches to dark glass over dark sections (other floating layers are skipped when sampling).

```js
const nav = LiquidGlass.FloatingNavbar(header, {
  adaptiveTone: true,       // switch each island's tone based on the data-surface-tone beneath it
  scrollContainer: window   // pass the element when using a custom scroll container
});
nav.open(); nav.close(); nav.refresh(); nav.destroy();
```

Menu: clicking the menu button toggles it; Esc closes it and returns focus to the menu button; clicking outside or clicking a link in the menu also closes it. The menu is thick glass, and items always put the icon first.

## Accessibility

- Link groups and the tab bar are wrapped in `<nav aria-label>`; the current page always has `aria-current="page"`.
- The menu button uses `aria-expanded` and `aria-controls`; when the menu is closed it uses `hidden`, not just transparency.
- Set `scroll-padding-top: var(--content-top)` and `scroll-padding-bottom: calc(var(--tabbar-height) + var(--space-24))` on `html` so keyboard focus isn't hidden by the islands or the tab bar.
