# FloatingNavbar

A row of glass islands floating above the page, grouped by scope — global (brand and main destinations), project (name, project tabs, project actions) and tools, one island each, with space between. On mobile there is also a tab bar (TabBar) floating at the bottom; the two are presentations of the same set of destinations.

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
    <div class="lg-navbar__island lg-navbar__island--text lg-glass lg-nav-desktop" data-refract role="group" aria-label="Project Island Light">
      <span class="lg-navbar__crumb lg-nav-optional"><a href="/shows">Shows</a><span class="lg-navbar__crumb-sep">/</span></span>
      <b>Island Light</b>
      <span class="lg-progress lg-progress--md lg-progress--neutral lg-nav-optional" style="--lg-value: 38%"><span></span></span>
      <span class="mono lg-muted lg-nav-optional">18 / 48 selected</span>
    </div>
    <div class="lg-navbar__island lg-navbar__island--tight lg-glass lg-nav-desktop">
      (project tabs: SegmentedControl, role="tablist"; a pending count has hidden text, ", 3 pending")
    </div>
    <button class="lg-btn lg-glass lg-nav-desktop" type="button" aria-label="Export Island Light">(icon) Export</button>
    <span class="lg-navbar__spacer"></span>
    <div class="lg-navbar__island lg-navbar__island--tight lg-glass" data-refract>
      <button class="lg-btn lg-btn--plain lg-btn--icon lg-nav-desktop" type="button" aria-label="Search" data-tooltip>…</button>
      <button class="lg-btn lg-btn--plain lg-nav-desktop" type="button" aria-label="Queue, 2 running" data-tooltip="Queue">…<span class="lg-badge lg-badge--sm lg-badge--count" aria-hidden="true">2</span></button>
      <button class="lg-btn lg-btn--plain lg-btn--icon lg-navbar__menu-toggle" type="button"
              aria-label="Menu" aria-expanded="false" aria-controls="site-menu">…</button>
    </div>
  </div>
  <div class="lg-navbar__menu lg-menu lg-glass lg-glass--popover" id="site-menu" hidden>
    <span class="lg-menu__label">Island Light · 18 / 48 Selected</span>
    <a class="lg-menu__item lg-nav-mobile" href="/picks">(icon) Picks</a>
    <a class="lg-menu__item lg-nav-mobile" href="/sources">(icon) Sources · 3 Pending</a>
    <a class="lg-menu__item lg-nav-mobile" href="/export">(icon) Export “Island Light”</a>
    <a class="lg-menu__item lg-nav-mobile" href="/queue">(icon) Queue · 2 Running</a>
    <div class="lg-menu__sep lg-nav-mobile" role="separator"></div>
    <a class="lg-menu__item" href="/activity">(icon) Activity</a>
    <a class="lg-menu__item" href="/settings">(icon) Settings</a>
  </div>
</header>
```

You provide: the logo (using `currentColor` so it follows tone changes) and name, **one list of main destinations** (at most 5; rendered as links in the brand island at ≥ 744px and as the TabBar below 744px), the project name, tabs and actions, and the secondary items for the menu. The menu never repeats the main destinations.

- Islands come in a fixed order, grouped by scope: **global** — brand with the main destinations (left); **project** — the project name with neutral progress and count (`role="group"` with an `aria-label`), the project tabs, and project actions such as Export next to them, so it is clear what they act on; then **tools** (far right, pushed over with `lg-navbar__spacer`). Each island holds one kind of thing; don't use dividers to pack several kinds into one island. Pages without project context omit the project islands.
- **One accent per task scope.** A project action such as Export doesn't go inside an island: it is a direct child of `lg-navbar__row`, standing on its own at the same height as the islands. It is accent only when it is the next step of the current task. In a review screen the accent belongs to the review action, so Export stays glass (`lg-btn lg-glass`) or tinted. The islands themselves stay neutral: progress uses `lg-progress--neutral` and counts use `lg-badge--count`; only counts that need the user's attention (for example the number of pending sources) use `lg-badge--warn`.
- The tools island holds only icon buttons, each with an `aria-label` and `data-tooltip`; buttons with a count include the count in the label, and the visible badge is `aria-hidden`.
- Islands are `nav-height` 42 tall (a minimum height), with `space-14` text padding on the left and 5px on the right, so the 32px buttons and the 32px segmented track inside are concentric with the island (5px all round). Islands that hold only controls use `lg-navbar__island--tight`; islands that end in text use `lg-navbar__island--text` (14px at both ends). On touch devices islands grow to 54px so 44px controls keep the same 5px inset.
- **Geometry.** The navbar row, its menu and the scroll edge use the same variables: `--lg-nav-inset` (gap above the navbar), `--lg-nav-block` (island height, taller on touch) and `--lg-nav-bottom`. `--content-top` and `html { scroll-padding-top }` come from them, so content always starts below the islands.
- Buttons inside islands use `plain`, not glass buttons.
- `position: fixed` by default, with safe areas already included in its position; when placed inside a block (a preview frame, an embedded preview), add `lg-navbar--contained`.

## Responsive (container queries on its own width)

| Width | Rendering |
| --- | --- |
| ≥ 1100px | Everything shown |
| 744–1099px | `lg-nav-optional` hidden (breadcrumbs, progress, secondary text) |
| < 744px | `lg-nav-desktop` hidden (project islands, app switcher, Export, search), leaving only the brand and menu button; main tabs move to TabBar; `nav-inset-mobile` from the edges. The project scope (areas, pending count, Export, Queue) appears in the menu as its own group (`lg-nav-mobile` items, shown only below 744px), or the page shows it in an in-page project header (see AppShell). No task disappears. |

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
- 2–5 tabs, each an `icon-lg` icon + a short label (one word; at most 4 characters in CJK) in the `tab` type role. The current tab has `aria-current="page"` and is drawn as a `fill-strong` capsule.
- Search is a separate 56px round glass button at the far right and doesn't share glass with the tabs. If the bottom of the page already has a search field or composer, omit it.
- `tabbar-height` 56 tall, 8px + safe area from the bottom and sides; stays above the on-screen keyboard when it opens. Content scrolls under it, so it has a built-in bottom scroll edge. Reserve `tabbar-height + space-24` at the bottom of the page (AppShell does this for you).
- **Minimize on scroll**: with `data-minimize="scroll-down"` (default), scrolling down more than 48px makes it shorter (`tabbar-height-min`) and drops the visible labels, but every tab stays visible as an icon, each at least 44px wide, and search becomes a smaller circle. Scrolling up restores it; `scroll-up` is the reverse; `off` never minimizes. It always restores when focus enters; with reduced motion it switches directly without a size animation. Minimized labels are hidden visually only, so every tab keeps its accessible name.

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

Menu: clicking the menu button toggles it; Esc closes it and returns focus to the menu button; clicking outside or clicking a link in the menu also closes it. The navbar menu is part of the overlay stack, so Esc closes only the top layer. The menu is thick glass; icons are optional, but inside one group every item has an icon or none does.

## Accessibility

- Link groups and the tab bar are wrapped in `<nav aria-label>`; the current page always has `aria-current="page"`. The project island is a `role="group"` with an `aria-label` that names the project.
- The menu button uses `aria-expanded` and `aria-controls`; when the menu is closed it uses `hidden`, not just transparency.
- Icon-only buttons use `data-tooltip`, not `title`. Show a shortcut only when the app registers it (`aria-keyshortcuts`).
- bundle.css sets `scroll-padding-top: var(--content-top)` on `html`. When the page has a tab bar, also set `scroll-padding-bottom: calc(var(--tabbar-height) + var(--space-24))`, so keyboard focus isn't hidden by the islands or the tab bar.
