# UI/UX audit tracking

This file tracks the 50 items of `docs/liquid-glass-web-ui-ux-audit-2026-10-24.md`. The principles and the reuse model that came out of the audit are in `design-system/0-principles.md`.

Last update: 2026-10-24, design system version 3.3.0.

## Status values

| Status | Meaning |
| --- | --- |
| Fixed | The code or docs changed, and an automated check covers the change |
| Design decision | The audit asked for a decision. The decision is written in the docs |
| Fixed, partial | Part of the item is done. The "Open" column states what is left |
| Needs repro | An automated check passes, but the item needs a real device or assistive technology to close |
| Not applicable | The item does not apply. The reason is in the "Change" column |

The audit also asked for a "Confirmed" status. All 50 items were confirmed, or accepted as a design gap, before the work started. The table shows the status after the work.

## Evidence

All automated checks ran in headless Chromium (Playwright) on macOS. Results on 2026-10-24:

| Check | Result |
| --- | --- |
| `make contrast` | 1019 pairs, 0 failures |
| `make audit` (dark and light) | No violations |
| `tools/interact.py` | 82 / 82 |
| `tools/contracts.py` | 96 / 96 |
| `tools/react_contracts.py` | 16 / 16 |

These checks did not run in WebKit or Firefox. Nobody tested on a real iPhone, an Android phone or desktop Safari. Nobody tested with VoiceOver, NVDA or TalkBack. TypeScript type checks did not run, because `tsc` is not installed in `.ds-sync/node_modules`. The types were updated by hand, and esbuild compiled the adapter and all previews.

The contract tests were written before the fixes. A rerun of `tools/contracts.py` against the old `bundle.js` and `bundle.css` on 2026-10-24 gave 23 failures and 6 passes in UI-25, UI-26, UI-27, UI-28 and UI-43. Then it stopped at the missing `refresh()` API (UI-44). That rerun does not prove a failure for every later item one by one.

## A · Layout, information architecture and hierarchy

| ID | Status | Change | Test | Open |
| --- | --- | --- | --- | --- |
| UI-01 | Needs repro | New fluid `AppShell` card and `lg-app*` layout classes, 320–1920px and landscape | contracts UI-01/02 (widths, no scroll, nothing under the nav) | Real phones and Safari; zoom to 200% and 400% |
| UI-02 | Fixed | Project scope moves to the menu or the in-page header below 744px. Every task has a path | contracts UI-01/02 | — |
| UI-03 | Fixed | Navbar grouped by scope: global, project (with Export), tools | Visual review of screenshots; audit | — |
| UI-04 | Fixed | Inspector shows "Selection" (Frame 14) before "Project" | Visual review of screenshots | — |
| UI-05 | Fixed | Rule: one accent per task scope. Export is glass. Docs updated | interact accent check | — |
| UI-06 | Fixed | Compact and comfortable density, `data-density`, `applyTheme({density})` | contracts UI-06 | — |
| UI-07 | Needs repro | `min-height` instead of `height`. Modal titles wrap. Row titles clamp at 2 lines. Hard Content card (German, zh-Hant, RTL) | contracts UI-07 | Browser text zoom and OS large text on devices |
| UI-08 | Fixed | Stage uses `contain` by default; `data-fit="cover"` opts in | contracts UI-08 | — |
| UI-09 | Needs repro | Scrims only where controls are, at most 25% of a short stage, inspection mode | contracts UI-09 | Review with real photos on real screens |
| UI-10 | Design decision | A contact sheet has uniform tiles. A timeline is not in v1 (`0-principles.md`, "v1 scope") | Screenshots | — |
| UI-11 | Design decision | Overlay table in `0-principles.md`. New `lg-modal--center` for desktop dialogs | contracts UI-33/34 | — |

## B · Material, color, state and tokens

| ID | Status | Change | Test | Open |
| --- | --- | --- | --- | --- |
| UI-12 | Fixed | New `danger-strong` token for danger text on hover and pressed | contrast check; contracts UI-12 | — |
| UI-13 | Fixed | Pressed media segmented: thumb uses `media-plate`, label stays white | contrast check; contracts UI-13 | — |
| UI-14 | Fixed | Timecode uses `ink-muted` and `ink-on-media-muted`, no opacity | contracts UI-14 | — |
| UI-15 | Needs repro | New `field-edge` token (3:1 boundary) and `.lg-field` helpers | contrast check; contracts UI-15 | Look on real screens in sunlight and at low brightness |
| UI-16 | Fixed | Dots differ in shape (circle, square, diamond, ring) and always have text | contracts UI-16 | — |
| UI-17 | Needs repro | Selection is a two-tone ring with a check mark. Outline stays free for focus | contracts UI-17 | Check on many real images and in forced colors on Windows |
| UI-18 | Design decision | Contrast themes drop elevation shadows. Solid themes keep a controlled media alpha (.90 / .92); `3-accessibility.md` states it | contracts UI-18 | — |
| UI-19 | Fixed | 20 `--type-<role>` shorthands. Components read roles, not literals | contracts UI-19 | — |
| UI-20 | Design decision | "Fixed principles and configurable brand" table in `0-principles.md` | — | Runtime brand switches are not in v1 |

## C · Responsive, navigation, keyboard and overlays

| ID | Status | Change | Test | Open |
| --- | --- | --- | --- | --- |
| UI-21 | Fixed | 44×44 hit areas on coarse pointers; chips 36px tall | contracts UI-21 | — |
| UI-22 | Needs repro | One set of nav variables for content, menu and scroll edge; `scroll-padding-top` | contracts UI-22 | Safe areas and the dynamic toolbar on a real iPhone |
| UI-23 | Needs repro | `.lg-app--contained` uses container queries for navbar and tab bar | contracts UI-23 | Embedded panes in real host apps |
| UI-24 | Needs repro | Minimized tab bar keeps every tab (each ≥ 44 wide) | contracts UI-24; interact | Scroll behavior on a real phone |
| UI-25 | Fixed | Menu button pattern: focus, arrows, Home/End, typeahead, Tab, Escape | contracts UI-25 (15 checks) | Screen reader output is not checked |
| UI-26 | Fixed | `aria-disabled` menu items and buttons never run | contracts UI-26 | — |
| UI-27 | Fixed | Toolbar re-checks its tab stop when items change; `refresh()` | contracts UI-27 | — |
| UI-28 | Fixed | Drag previews, release commits once, cancel reverts | contracts UI-28 | — |
| UI-29 | Fixed | Tabs show and hide panels by `aria-controls`; manual activation; orientation | contracts UI-29 | — |
| UI-30 | Fixed | `aria-selected` only on options in a listbox; `SelectList` | contracts UI-30 | — |
| UI-31 | Needs repro | Backdrop close needs pointer down and up outside the sheet | contracts UI-31 | Touch drag that ends outside the sheet on real devices |
| UI-32 | Fixed | `beforeClose` and the cancelable `lg:closerequest` event; `close()` never blocked | contracts UI-32 | — |
| UI-33 | Fixed | One overlay stack. Escape closes the top layer only | contracts UI-33 | — |
| UI-34 | Design decision | Confirmation by consequence (Undo, inline, dialog) in `0-principles.md` | contracts UI-34 | — |

## D · Task controls, learnability and feedback

| ID | Status | Change | Test | Open |
| --- | --- | --- | --- | --- |
| UI-35 | Fixed | The composer is not `role="search"`; scope has hidden text | contracts UI-35 | — |
| UI-36 | Fixed | `data-shortcut` and `LiquidGlass.shortcut` register ⌘K or Ctrl+K. No shortcut, no hint | contracts UI-36 | — |
| UI-37 | Fixed | `Composer.setStatus("pending" \| "error" \| "idle")`; text kept on error | contracts UI-37 | — |
| UI-38 | Fixed | Read-only scrubber is a progress bar. A seek control is a range input | contracts UI-38 | — |
| UI-39 | Fixed | `data-tooltip` on hover after 500 ms and on keyboard focus, replaces `title` | contracts UI-39 | — |
| UI-40 | Needs repro | Toast queue, hosted in the open dialog, Undo action, pause on hover and focus | contracts UI-40 | Screen reader announcements on devices |

## E · React adapter and lifecycle

| ID | Status | Change | Test | Open |
| --- | --- | --- | --- | --- |
| UI-41 | Fixed | Controllers read the latest props through a proxy | react UI-41 | — |
| UI-42 | Fixed | Controlled `index` is a request. The host commits | react UI-42 | — |
| UI-43 | Fixed | `data-value` payload; the index API stays | contracts UI-43 | — |
| UI-44 | Fixed | `refresh()` and a mutation observer keep selection identity | contracts UI-44; react UI-44 | — |
| UI-45 | Fixed | TextField merges host, helper and error ids in `aria-describedby` | react UI-45 | — |
| UI-46 | Needs repro | Controller registry, idempotent `destroy()`, `LiquidGlass.destroy(root)` | contracts UI-46 | Memory profile of a long session in a real SPA |

## F · Rules, verification and product scope

| ID | Status | Change | Test | Open |
| --- | --- | --- | --- | --- |
| UI-47 | Fixed | Rule tiers and waivers in `audit.py`; menu icons consistent per group; `5-apple-alignment.md` evidence | `make audit` | — |
| UI-48 | Fixed, partial | `make test` runs 96 contract checks. React checks added. Audit covers dark and light | All checks above | WebKit and Firefox runs; device performance; `tools/ci/check.yml` is still a template, not an active GitHub workflow |
| UI-49 | Needs repro | Hard Content card: long German and zh-Hant names, RTL, a corner chart | Screenshots | Real photos, white documents and video under the glass |
| UI-50 | Fixed, partial | v1 scope and host responsibilities in `0-principles.md`. Field and listbox examples in Patterns | — | A full settings form and a search results page as reference screens |

## Items that need a device or assistive technology

Do not mark these items closed until somebody records the device, browser, assistive technology and result here: UI-01, UI-07, UI-09, UI-15, UI-17, UI-22, UI-23, UI-24, UI-31, UI-40, UI-46, UI-48 and UI-49.

| ID | Device or tool | Result | Date | By |
| --- | --- | --- | --- | --- |
| — | — | — | — | — |
