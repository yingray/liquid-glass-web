# Apple alignment

This section goes through each recommendation in Apple's developer article "Adopting Liquid Glass" (developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass) and describes how the system handles it on the web. That article is written for native apps built with SwiftUI, UIKit and AppKit; the web doesn't have those system components, so many items can only reach "the same effect" with web technology.

**What the statuses mean**

- **Meets**: the system already does this, backed by automated checks or tests.
- **Web equivalent**: Apple's approach is a native API the web doesn't have; the system reaches the same goal with web technology.
- **Partial**: the direction matches, but some parts can't be done or haven't been verified; the table states the gap.
- **Not applicable**: relates only to native apps or specific Apple devices; websites have no equivalent.

**41 recommendations in total** (the article’s bold-faced recommendations; earlier versions of this table said 42 because a sentence about fixed spacers was counted as its own item — it is part of item 23): Meets 24, Web equivalent 7, Partial 4, Not applicable 6. Two additional control behaviors described at the start of the article are listed first under "Controls".

## Verification

- **Screen rules** (automated checks, rerun on every revision): every showcase card is rendered in the browser and checked for glass inside glass, overlapping control-layer glass, icons and text mixed in one piece of glass, icon buttons without labels, all-caps text, menu items without icons, more than one accent button per bar, the number of backdrop blurs per screen, whether the computed material of each piece of glass is the one it claims to be, and (since v3.2) title-style capitalization of control labels and headers, concentric corners, and neighbouring glass closer than 6px. Current result: 0 for all, except the deliberate "Don't" examples.
- **Contrast**: 905 color pairings, compositing translucent glass over pure white and pure black and taking the worse value; ≥ 4.5:1 in regular themes and ≥ 7:1 in high-contrast themes, all passing.
- **Independent review**: a separate reviewer that had not seen this table checked every card against the article; its findings are fixed in v3.2 (see the last table).
- **Interaction**: 81 browser tests, including the tab bar minimizing on scroll, sheets becoming opaque at full height, menus growing from the trigger, empty groups disappearing automatically, and no horizontal scrolling from 320 to 1920 wide.
- **Not verified**: not tested on physical iPhone or Android phones; actual frame rates not measured. Related items in the tables are marked "Partial".

## Visual refresh

| # | Apple recommendation | Status | How the system handles it |
| --- | --- | --- | --- |
| 1 | Leverage system frameworks to adopt Liquid Glass automatically. | Web equivalent | The web has no built-in Liquid Glass. The system's `lg-*` components are the site's "standard components": glass is always built from `lg-glass` plus modifier classes, never assembled by hand with `backdrop-filter`. |
| 2 | Reduce your use of custom backgrounds in controls and navigation elements. | Meets | Buttons in nav islands and toolbar groups use `plain` (no background of their own); the scroll edge sits behind the glass; sites change only the `accent` color group. |
| 3 | Test your interface with a variety of display and accessibility settings. | Meets | Six themes (dark, light, two Solid, two high-contrast) + glass strength, reduced motion and forced colors; all 10 showcase cards × 6 themes have been rendered and checked, including by an independent reviewer. The current tab in the tab bar gets a 2px ring in the high-contrast themes (it had disappeared in light-contrast before v3.2). See "Accessibility and fallback". |
| 4 | Avoid overusing Liquid Glass effects. | Meets | Only the navigation and overlay layers use glass; ≤ 8 backdrop blurs per viewport (7 in the desktop showcase, at most 7 in the mobile showcase); panels fixed on a solid color use `lg-glass--flat`. Content next to the controls (the contact sheet, the thumbnail strip) is opaque `surface`, not glass. |

## App icons

| # | Apple recommendation | Status | How the system handles it |
| --- | --- | --- | --- |
| 5 | Reimagine your app icon for Liquid Glass. | Not applicable | Websites have no app icon. Site icons (favicons) are outside the system's scope. |
| 6 | Design using layers. | Not applicable | Same as above. |
| 7 | Compose and preview in Icon Composer. | Not applicable | Same as above. |
| 8 | Preview against the updated grids. | Not applicable | Same as above. |

## Controls

| # | Apple recommendation | Status | How the system handles it |
| --- | --- | --- | --- |
| A | Sliders and toggles become Liquid Glass during interaction | Meets | The segmented control thumb becomes a small piece of glass and flattens slightly while pressed and dragged, then springs back on release. The system has no slider or toggle components. |
| B | Buttons morph fluidly into menus and popovers | Partial | Menus, popovers and inline confirmations scale in from the position of the trigger button (`--lg-origin`). Gap: this is not a true morph of the button shape into the menu; the web has no general way to morph across elements. |
| 9 | Review updates to control appearance and dimensions. | Meets | All heights, corner radii and padding are tokens; glass controls are always capsules; on touch devices they grow automatically to ≥ 44px. |
| 10 | Review your use of color in controls. | Meets | Every color token has values for six themes. Navigation and toolbars stay neutral: neutral progress bars and count badges, at most one accent per bar, set apart as its own piece; `warn` only for counts that need the user's attention. The composer's Send stays neutral until it can be pressed, and its scope badge is neutral. Automated test: the nav progress bar computes to `ink` (a selector-order bug kept it accent until v3.2). |
| 11 | Check for crowding or overlapping of controls. | Meets | System spacing is used; automated checks for "glass inside glass" and "overlapping control-layer glass" are both 0. Menus and sheets belong to the overlay layer, so covering the control layer is intentional. A new check flags neighbouring glass closer than 6px: 0. On mobile the composer sits 8px above the tab bar as its accessory; this is a judgement call, kept because it mirrors the accessory above the iOS tab bar. |
| 12 | Optimize for legibility when content scrolls beneath controls. | Meets | `.lg-scroll-edge` (top, built into FloatingNavbar) and `.lg-scroll-edge--bottom` (bottom, built into TabBar); the density is the minimum derived from contrast calculations. |
| 13 | Consider aligning the shape of controls with other rounded elements throughout the interface. | Meets | Concentric corner rule: panel 28 − inset 6 → group 22; menu 22 − 6 → item 16; 32px buttons and the 32px segmented track in a 42px island (5px all round; 54px islands with 44px controls on touch); sheet 32. A new automated check measures every rounded child near a rounded parent's corner: 0 mismatches (the segmented control in the nav was off by 3px until v3.2). |
| 14 | Leverage new button styles. | Web equivalent | Mapping: glass → `lg-btn lg-glass`; prominent glass → `lg-btn--accent`; clear glass (on media) → `lg-btn lg-glass--media`. |

## Navigation

| # | Apple recommendation | Status | How the system handles it |
| --- | --- | --- | --- |
| 15 | Establish a clear navigation hierarchy. | Meets | Four layers: content, stage, navigation and controls, overlay. Glass appears only in the last two. |
| 16 | Consider adapting your tab bar into a sidebar automatically. | Web equivalent | Below 744px, a bottom tab bar (TabBar); at ≥ 744px the tab bar hides automatically and the same destinations, in the same order, return to the brand island at the top (tested); the menu holds only secondary items; with many tabs, desktop uses a left rail (`lg-panel--rail`). |
| 17 | Consider using split views to build sidebar layouts with an inspector panel. | Web equivalent | Stage + `aside-width` inspector (`aside-width-compact` below 1100px); below 744px the inspector becomes a half-height sheet. |
| 18 | Check content safe areas for sidebars and inspectors. | Meets | The stage ends at the inspector's edge and isn't covered; fixed elements all include `env(safe-area-inset-*)`. |
| 19 | Extend content beneath sidebars and inspectors. | Partial | `lg-extend` mirrors the adjacent hero image, blurs it and lays it under the sidebar, and the sidebar uses thick glass. Gap: only static images are supported; video and changing content don't stay in sync. |
| 20 | Choose whether to automatically minimize your tab bar in iOS. | Meets | By default TabBar shrinks to two small round buttons, current tab + search, when scrolling down, and restores when scrolling up; can be set to `scroll-up` or `off`; always restores when keyboard focus enters. |

## Menus and toolbars

| # | Apple recommendation | Status | How the system handles it |
| --- | --- | --- | --- |
| 21 | Adopt standard icons in menu items. | Meets | Every menu item puts the icon first and the text after (automated check: 0 missing). The web has no system icons: the system specifies the icon format (16 grid, 1.6px stroke, round caps), sites choose an open-source icon set in that format, and the same action uses the same icon across the whole site. |
| 22 | Match top menu actions to swipe actions. | Web equivalent | The system has no swipe gesture component, so this is a rule: if a site adds swipe actions to list rows, the first menu items match the same actions in order. See "Anti-patterns". |
| 23 | Determine which toolbar items to group together. | Meets | `lg-toolbar__group`: one piece of glass per group, grouped by function (Undo + Redo, view options, Share + More). The article's note on fixed spacers between items that share a background: groups are separated by a fixed `space-8`, `lg-spacer` pushes items apart, and dividers are no longer used inside one piece of glass. |
| 24 | Find icons to represent common actions. | Meets | Automated check for "mixed in one piece of glass" is 0 (only the deliberate examples remain); labeled primary actions stand as their own piece. |
| 25 | Provide an accessibility label for every icon. | Meets | Automated check for "icon buttons without labels" is 0; shortcuts also go into `title`. When the tab bar minimizes, labels are hidden visually only, so the current tab keeps its accessible name (tested). |
| 26 | Audit toolbar customizations. | Meets | Custom items inconsistent with system behavior were removed (toolbar dividers, hint text, special padding variants). |
| 27 | Check how you hide toolbar items. | Meets | Add `hidden` to the button itself; when everything in a group is hidden, the group disappears automatically (tested). |

## Windows and modals

| # | Apple recommendation | Status | How the system handles it |
| --- | --- | --- | --- |
| 28 | Support arbitrary window sizes. | Meets | Fluid layout between breakpoints, and container queries for navigation; the test page has no horizontal scrolling at widths 320, 390, 600, 744, 900, 1024, 1100, 1280, 1440 and 1920. |
| 29 | Use split views to allow fluid resizing of columns. | Partial | Column widths flow with the window width. Gap: users can't drag a divider to resize columns. |
| 30 | Use layout guides and safe areas. | Meets | The navbar, tab bar, floating toolbars and sheets all include safe areas; requires `viewport-fit=cover`. |
| 31 | Check the content around the edges of sheets. | Meets | `radius-sheet` 32; 8px from the edges and thick glass at half height; switches to opaque `surface` automatically at maximum height or ≥ 90% of the viewport, and below 744px stops being inset and meets the screen edges (tested). |
| 32 | Audit the backgrounds of sheets and popovers. | Meets | Panels no longer contain their own frosted glass; groups use `fill`. |
| 33 | Specify the source of an action sheet. | Meets | Destructive actions are confirmed inline in the menu, growing from the trigger button, not as a modal: the rest of the screen stays usable. |

## Organization and layout

| # | Apple recommendation | Status | How the system handles it |
| --- | --- | --- | --- |
| 34 | Check capitalization in section headers. | Meets | The auto-uppercasing `overline` was removed; group headers use `label-sm`; automated check for all-caps text is 0. |
| 35 | Adopt forms to take advantage of layout metrics across platforms. | Web equivalent | `lg-panel__group` (`fill` background, 22 corner radius concentric with the panel) + `lg-row` list rows + 46px `lg-input`. |

## Search

| # | Apple recommendation | Status | How the system handles it |
| --- | --- | --- | --- |
| 36 | Check the keyboard layout when activating your search interface. | Partial | `LiquidGlass.init()` measures the on-screen keyboard with `visualViewport` so the bottom tab bar and floating toolbars stay above it. Gap: the logic has only been verified in desktop Chromium, not yet tested on physical iPhone and Android devices. |
| 37 | Use semantic search tabs. | Meets | `lg-tabbar__search` is a separate round glass button at the far right of the tab bar. It isn't repeated when the bottom of the page already has a search field or composer. |

## Platform considerations

| # | Apple recommendation | Status | How the system handles it |
| --- | --- | --- | --- |
| 38 | In watchOS, adopt standard button styles and toolbar APIs. | Not applicable | Websites don't run on Apple Watch. |
| 39 | In tvOS, adopt standard focus APIs. | Not applicable | Websites aren't operated with the Apple TV remote. The web equivalent is the two-layer focus ring; see "Interaction states". |
| 40 | Combine custom Liquid Glass effects to improve rendering performance. | Web equivalent | Related buttons share one piece of glass (islands, toolbar groups); panels fixed on a solid color have no backdrop blur; ≤ 8 backdrop blurs and ≤ 3 refractions per viewport. |
| 41 | Performance test your app across platforms. | Partial | Element count limits with automated counting are in place. Gap: frame rates for scrolling and opening and closing menus haven't been measured on physical devices; before launch, test against the performance budget in "Accessibility and fallback". |

The compatibility mode mentioned at the end of Apple's article (`UIDesignRequiresCompatibility`, which lets an app keep the old appearance temporarily) is a native app setting with no website equivalent; the closest option is letting users choose "Transparency: Reduced" to switch to the opaque Solid theme.

## Changes in v3 to align with the article

| Change | Related items |
| --- | --- |
| Menus, toasts and half-height sheets now use thick glass `glass-thick`; `.lg-menu` is always thick glass even if the popover class is forgotten | 10, 11, 31 |
| Sheets changed from "always opaque" to "thick glass at half height, opaque at full height" | 31 |
| Toolbars changed from "one strip of glass + dividers" to "one piece of glass per group", with the primary action separate; empty groups hide automatically | 23, 24, 26, 27 |
| The nav island's accent primary action moved out of the island; progress and counts changed to neutral colors | 10 |
| Added a bottom tab bar (TabBar) on mobile: separate search button at the far right, minimizes on scroll, returns to the top island automatically at ≥ 744px | 16, 20, 37 |
| Added the bottom scroll edge `lg-scroll-edge--bottom` | 12 |
| Menu items gained icons and dividers; menus grow from the trigger | 21, B |
| The segmented thumb becomes glass while pressed | A |
| Removed the all-caps `overline` in favor of normal-case group headers | 34 |
| Added background extension `lg-extend` and the thick glass panel `lg-glass--thick` | 19 |
| Added `lg-glass--flat` without backdrop blur, for inspectors and composers fixed on a solid color | 4, 40 |
| Captions on the stage and media frames now use the unblurred `lg-plate` (replacing `lg-glass--media-strong`) | 4, 11 |
| Added safe areas to the navbar; added on-screen keyboard height tracking | 30, 36 |
| Fixed a v2 style override bug: the default badge background overrode stage glass, so labels on the stage were actually only about 3:1 | 3 |

## Changes in v3.2 after the independent review

| Finding | Fix | Related items |
| --- | --- | --- |
| The contact sheet dock and the mobile thumbnail strip were content wrapped in glass | Both are now opaque `surface` with a `line` border | 4, 15 |
| The nav progress bar was accent although marked neutral (two rules with the same specificity, the accent one later) | Neutral rule given higher specificity; tested | 10 |
| Three accent fills on the desktop screen (Export, Review, a disabled Send) | Send is neutral until it can be pressed; the scope badge is neutral | 10 |
| The current tab disappeared in light-contrast (white on white, shadows off) | 2px `ink` ring in the high-contrast themes | 3 |
| The tab bar didn't switch to dark glass over dark sections | TabBar samples the surface beneath its tabs and search button, like the nav islands | 3, 12 |
| The minimized tab bar removed the current tab's label from the accessibility tree | Label hidden visually only | 25 |
| The context island packed a breadcrumb, a divider, status and tabs together | Split into a context island and a project-tab island; the divider class is removed | 23, 11 |
| The segmented control in the nav was not concentric with the island (3px top, 5px end) | 26px items → 32px track, 5px all round; 54px islands on touch | 13 |
| The tab bar and the desktop islands listed different destinations; the menu repeated them | One destination list for both; the menu holds secondary items only | 15, 16 |
| Status text ("4 playing in sync") inside a toolbar group | Removed from the group | 24 |
| Full-height sheets stayed inset on mobile; the mobile demo overrode the sheet padding | Full-height sheets meet the screen edges below 744px; the override is removed | 31 |
| A menu header wasn't in title-style capitalization ("18 / 48 selected") | "Island Light · 18 / 48 Selected"; new automated check | 34 |
| Light glass over dark imagery in the light-theme Materials demos; a badge covering a plate; a two-line toast | Demos fixed (dark tone on imagery, badge moved, one-sentence toast) | 3, 11 |

