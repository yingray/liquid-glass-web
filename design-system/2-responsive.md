# Responsive: 390 and 1440

Designs are drawn at only two widths: 390px (mobile) and 1440px (desktop). Widths in between are handled by breakpoints and fluid layout, with no separate designs; no width may ever scroll horizontally.

## Breakpoints

| Width | Layout |
| --- | --- |
| < 744px | Single column. Only two islands remain at the top, brand and menu; the main tabs move to a tab bar (TabBar) at the bottom; sidebars and inspectors become half-height sheets; the stage fills the width with 8px on each side. |
| 744–1099px | The tab bar is hidden and the same tabs return to the nav island at the top. Stage + narrow inspector (`aside-width-compact`) or narrow rail (`rail-width-compact`). The navigation hides optional context (`lg-nav-optional`). |
| ≥ 1100px | Full layout: stage + docked content panel (opaque) + composer + `aside-width` inspector, or `rail-width` rail + content. |

FloatingNavbar uses **container queries**: it looks at the width it is given, so the same HTML picks the right layout in a full-width header or in a 390px preview frame. Other components use media queries. 744 and 1100 are hard-coded in bundle.css; when changing a breakpoint, change both places.

## Tab bar and nav island swap

The mobile tab bar and the desktop nav island are two presentations of **the same set of destinations**, not two navigation systems:

- < 744px: `lg-tabbar` appears at the bottom with at most 5 tabs, each an icon + short label; search is a separate round glass button at the far right (`lg-tabbar__search`) and doesn't share glass with the tabs. If the bottom of the page already has a search field or composer, the tab bar doesn't include a search button.
- ≥ 744px: the tab bar hides automatically and the same links go into the brand island as `lg-segmented`; search returns to the tools island on the right.
- With more than 5 tabs, or when the site has multiple levels of categories, desktop uses a left rail (`lg-panel--rail`), and the mobile tab bar holds only the 4 most-used tabs, with the rest in a menu.

**Minimize on scroll**: with `data-minimize="scroll-down"` (default), scrolling down more than 48px shrinks the tab bar to two small round buttons — the current tab's icon on the left, search on the right; scrolling up restores it. It always restores when keyboard focus enters the tab bar. You can also set `data-minimize="scroll-up"` (minimize when scrolling up), or `data-minimize="off"` to never minimize.

## Component differences at the two widths

| Component | 390px | 1440px |
| --- | --- | --- |
| FloatingNavbar | `nav-inset-mobile` from the top and sides (plus safe area); two islands: brand (logo and name only) and menu button. Project context and secondary links go into the menu. | `nav-top` from the top, `nav-side` on the sides: brand + app switcher, project context (breadcrumbs, neutral progress, tabs), a separate accent primary action, tools (search, queue, menu). Below 1100, breadcrumbs and progress are hidden. |
| TabBar | Bottom, `tabbar-height` tall (`tabbar-height-min` when minimized), 8px + safe area from the bottom; stays above the on-screen keyboard when it opens. | Hidden. |
| Stage | Fills the width, `radius-panel`; one line of top-edge labels, keeping only the most important one if they overflow; the "More" button goes in the top-right corner. | Fills the remaining height of the main column, `radius-3xl`. |
| Toolbar | Fills the stage width: a frame-navigation group on the left (previous, number, next), a separate accent primary action on the right; other controls move to the "More" menu. | Centered, sized to content; one piece of glass per group, `space-8` between groups; primary action separate. |
| Composer | Fills the width; the ⌘K hint is hidden. | Centered, at most `composer-max` wide. |
| GlassPanel (inspector) | Becomes a half-height sheet (Modal), opened by a button or badge on the stage. | Fixed on the right, `aside-width`, with scrollable content. |
| Menu | Viewport width − 16px; grows from the trigger. | `menu-width`, anchored `space-8` from the trigger button; grows from the trigger. |
| Modal (sheet) | Viewport width − 16px, 8px plus safe area from the bottom; thick glass at half height; when content grows the sheet to its maximum height (viewport height minus 88px) or ≥ 90% of the viewport height, it becomes opaque `surface` and meets the left, right and bottom edges; buttons fill the width with the primary action at the bottom. | `sheet-width` (820) or `sheet-width-compact` (480) wide, centered, 16px from the bottom; description on the left, primary action on the right. |
| SegmentedControl | With 3 or more options, use `lg-segmented--block` to fill the width; with more than 4, use a menu instead. | Sized to content, at most 5 options. |
| Touch | All buttons, segmented items, menu items and toolbar groups ≥ 44px; nav islands grow to 50px. | Mouse-first; original sizes. |

## Safe areas and the on-screen keyboard

- The viewport must have `viewport-fit=cover`. The navbar, tab bar, floating toolbars and sheets already include `env(safe-area-inset-*)` in their positions, so they aren't covered by the notch, rounded corners or Home indicator.
- `LiquidGlass.init()` measures the on-screen keyboard with `visualViewport`, writes it to `--lg-keyboard-inset` on `html`, and adds `data-keyboard` while the keyboard is open. The tab bar and `lg-toolbar--float` stay above the keyboard; for custom bottom-fixed elements, use `bottom: calc(… + max(env(safe-area-inset-bottom, 0px), var(--lg-keyboard-inset, 0px)))`. They don't move when the page is pinch-zoomed.

## Type sizes

App interfaces use the same type scale at both widths (14px base); mobile doesn't shrink it. Hero titles on website pages: `display-1` (56/60) at 1440, `display-1-sm` (36/40) at 390.

## Layout values

- First block below the navigation: top margin `content-top` (68px).
- Main column and sidebar: `space-10` on both sides of the main column, `space-12` on the right of the sidebar; `space-10` between the stage, dock and composer.
- Website pages: content width `min(layout-max, 100% − 2 × gutter)`, with gutter `gutter-mobile` on mobile and `gutter-desktop` on desktop; section spacing `space-48` on mobile and `space-96` on desktop.
- Floating toolbars, tab bars and the composer must not cover the last piece of content: reserve `tabbar-height + space-24` at the bottom of the page (`control-xl + space-24` when there is a composer).
