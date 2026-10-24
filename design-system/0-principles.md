# Principles and reuse model

Read this file first. It states the six principles behind every rule in this design system. It also states how to reuse the system without breaking them. The other guides (`1-states.md` to `5-apple-alignment.md`) and the component READMEs apply these principles to one topic each.

The principles come from the UI/UX audit of 2026-10-24 (`docs/liquid-glass-web-ui-ux-audit-2026-10-24.md`). `docs/ui-ux-audit-tracking.md` records the status of each audit item.

## The six principles

### C1 · Content first, material shows the control layer

People come to see images, read data and make decisions. Glass carries controls, shows what is in front of what, and keeps the content visible. If a material crops the frame, darkens it all the time, or makes every item an equally loud capsule, it no longer serves the content.

In this system:

- Content stays on opaque surfaces. Glass is for navigation, controls and short-lived overlays.
- The stage shows the whole frame by default (`contain`). Cropping is an explicit choice (`data-fit="cover"`).
- Scrims appear only where controls are, and inspection mode (`data-inspect`) removes them.
- The material follows the role of the control, not a wish for "more glass".

### C2 · Build hierarchy from task and scope

Group items first by scope: global, the current project, the current selection. Then express the groups with position, type, spacing, color and material. Layer count, z-index and capsule count do not answer an information-architecture question.

In this system:

- The navbar has three scopes: global (brand and destinations), project (name, project tabs, Export) and tools.
- The inspector names its scope: "Selection" (the frame on the stage) comes before "Project".
- **One accent per task scope.** The accent marks the next step of the current task: Review while the user reviews, Send while the composer has text. All other actions stay tinted or glass. A component never claims the accent for itself.
- The overlay form follows how much the task interrupts work (see "Overlays and confirmation" below).

### C3 · Responsive layouts keep the task

On a narrow screen, an item can change position or container, and fewer items can show at the same time. But every task needs a clear path. Do not remove a destination, a project tab or a selection action with `display: none` and leave no other way to reach it.

In this system:

- `AppShell` is the fluid layout reference. It goes from 320px to 1920px and landscape phones, and it has a desktop-to-mobile map (see `components/AppShell/README.md`).
- The navbar, the tab bar and the content read one set of geometry variables (`--lg-nav-inset`, `--lg-nav-block`, `--content-top`).
- An app inside a pane uses container queries (`.lg-app--contained`), so the navigation follows the pane width, not the window width.
- The minimized tab bar keeps every tab.
- A scroll area shows that it continues: the next item shows in part at the edge, and the platform scrollbar stays visible (thin in inner areas).

### C4 · Look, semantics, data and behavior agree

If a control looks draggable, it can be dragged. If markup says `role="menu"`, the menu keyboard model works. If an item is disabled, it never runs. If a controlled value did not change, the screen does not show a different committed state. This agreement lets people predict the system.

In this system:

- Menus follow the APG menu button pattern. `aria-disabled` items stay focusable but do not run.
- A segmented drag is a preview. Release commits, and cancel reverts.
- `aria-selected` appears only on `role="option"` inside a listbox. Other rows use `aria-current` or `aria-pressed`.
- A shortcut appears in a label or tooltip only when the app registers it.
- A read-only scrubber does not look like a slider.

### C5 · Legibility and operability hold for real content and real users

Contrast is not two swatches compared alone. A touch target is not the height of the outer box. Check states, the content behind the glass, local opacity, text length, zoom, keyboard use and assistive technology. Accessibility is a base condition of each component, not an extra theme.

In this system:

- The contrast check composes foreground, material, state and the content behind it (1019 pairs).
- Two densities exist, and controls grow with their text (`min-height`, never a fixed `height`).
- Status never relies on hue alone: each dot has a shape and a text.
- Touch targets measure the real hit area (44×44 on coarse pointers).
- The six themes keep their promises. Do not lower an alpha floor to make glass look clearer.

### C6 · The design system delivers verifiable contracts

Each component must answer these questions: who owns the state, who runs the side effects, which options can change after init, how to cancel, how to clean up, and which cases have tests. The docs keep three things separate: Apple principles, project style, and hard capability floors.

In this system:

- The docs, CSS, core, adapter, types, previews and tests change together.
- Generated files come from one source (see "Source of truth").
- Each behavior has a contract test, tagged with its audit ID.
- A "Meets" claim in `5-apple-alignment.md` needs evidence. It also names the platforms that nobody checked.

## Reuse model

The system has one runtime and many consumers. Reuse means using the same contract, not copying the same look.

| Layer | What you reuse | Where it lives |
| --- | --- | --- |
| Tokens | Color, material, type roles, spacing, radius, motion | `tokens.json` → `tokens.css` |
| Styles | `lg-*` classes for each component and layout | `components/bundle.css` |
| Behavior | Controllers, overlay stack, shortcut, toast, tooltips | `components/bundle.js` (`window.LiquidGlass`) |
| Types | Public API and options | `components/index.d.ts` |
| Layout | Fluid AppShell regions and the desktop-to-mobile map | `components/AppShell/` |
| Adapter | React wrappers for Claude Design prototypes only | `.design-sync/react/` |

### Rules for reuse

1. **Compose existing parts before you add a new one.** A new screen is an `AppShell` with existing components. Add a component only when no composition gives the behavior.
2. **Use the semantic role, not the raw value.** Write `font: var(--type-body)` and `min-height: var(--control-md)`. Do not write `14px` or `height: 32px`. Then one token change reaches every component and both densities.
3. **One behavior, one implementation.** Keyboard models, overlay closing, disabled guards and lifecycle live in `bundle.js`. The React adapter calls the same controllers. It never copies their logic.
4. **Bind data with `data-value`, not with the visible label.** Labels get translated. Values stay stable.
5. **Every controller can be destroyed.** `LiquidGlass.destroy(root)` releases all controllers and filters under `root`. A long-running single-page app must call it when it removes a view.
6. **Keep showcase code out of the contract.** Showcase cards (`ShowcaseDesktop`, `ShowcaseMobile`) show the style. They are not layout references. Use `AppShell` for layout.
7. **Change the style, keep the principles.** See "Fixed principles and configurable brand".

## Source of truth

Never edit a generated file by hand. Change the source, then run `make build`.

| Output | Source | Generator |
| --- | --- | --- |
| `design-system/tokens.json` | `tools/palette.py`, `tools/tokens_build.py` | `tools/tokens_build.py` |
| `tools/.cache/tokens.css` | `tokens.json` | `tools/compile_tokens.py` |
| `components/*/preview.html` | `tools/previews_head.py`, `tools/previews_body.py` | `tools/previews.py` |
| `.design-sync/react/dist/`, `guides/` | `.design-sync/react/src/`, these docs | `node .design-sync/react/build.mjs` |

`bundle.css`, `bundle.js`, `index.d.ts` and the Markdown docs are hand-written sources.

## Component contract checklist

Answer each question in the component README before you merge a new or changed component.

| Question | Example answer (SegmentedControl) |
| --- | --- |
| Who owns the state? | The controller, or the host with `controlled: true` |
| Which options can change after init? | Callbacks and flags, read on each event |
| What is the payload? | `data-value`, else the visible label without badge text |
| How does the user cancel? | `pointercancel` or lost capture reverts the preview |
| What happens when the items change? | `refresh()` runs, and the selection keeps its identity |
| What do disabled items do? | They are skipped and never commit |
| How does it clean up? | `destroy()` removes listeners and observers, and is idempotent |
| Which tests cover it? | `tools/contracts.py` (UI-28, UI-29, UI-43, UI-44), `tools/react_contracts.py` (UI-42) |

## Overlays and confirmation

Choose the overlay by how much the task interrupts work.

| Situation | Use | Do not |
| --- | --- | --- |
| A short choice that belongs to one control | Anchored menu or popover (`GlassPanel`) | Open it far from its trigger |
| A small task that needs focus | Centered dialog at ≥ 744px (`lg-modal--center`), sheet on phones | Put every desktop task in a bottom sheet |
| Compare settings with the content | Non-modal inspector | Block the content without a reason |
| A long or complex flow | A full page or clear steps | Fit a whole product flow into a small sheet |

All overlays share one stack. Escape closes only the top layer.

Choose the confirmation by the consequence of the action.

| Consequence | Confirmation |
| --- | --- |
| Reversible | Do it, then show a toast with Undo (`toast(msg, {action})`) |
| Destructive, but local and visible | Inline confirmation in the menu (`Menu.Confirm`) |
| Affects things the user cannot see, or irreversible bulk | Centered modal dialog |

A sheet with unsaved input uses `beforeClose` or the `lg:closerequest` event to keep the input. A call to `close()` from code is never blocked.

## Density

| Density | When | Body | Controls |
| --- | --- | --- | --- |
| Compact | Default at ≥ 744px | 14px / 20px | 13px |
| Comfortable | Default below 744px, or `data-density="comfortable"` | 16px / 24px | 15px |

Set `data-density="compact"` to keep compact on a narrow screen. If the space is too small, change the structure, the order or the line breaks first. Do not make important text smaller.

## Rule tiers

`tools/audit.py` puts each design rule in one tier. Passing these rules is not Apple certification. It is not a full UX review either.

| Tier | Rules | Waiver |
| --- | --- | --- |
| Hard (function and accessibility) | `unlabeledIcons`, `wrongMaterial`, `nestedGlass`, `overlappingGlass` | Never |
| Contract (testable product design) | `mixedIconText`, `menuIconsMixed`, `tintedControlsInBar` | Change the design or the rule |
| Style (preference) | `uppercase`, `notTitleCase`, `nonConcentric`, `crowdedGlass` | `data-lint-waive="<rule>: <reason>"` |
| Style budget | `maxGlassPerFrame` (8 blurred surfaces in one frame) | Change the design; the budget is a project heuristic, not a measured device limit |

The audit prints every waiver with its reason, so a reviewer can read them. Menu icons are optional. In one logical group (between separators or labels), use icons on all items or on none.

## Fixed principles and configurable brand

| Fixed (do not change) | Configurable (product choice) |
| --- | --- |
| Glass only for controls, navigation and overlays | Accent color |
| Content on opaque surfaces | Neutral color temperature |
| State contrast floors and alpha floors | Font family |
| One behavior model for each pattern | Density default |
| The six themes, reduced motion, forced colors, RTL | Corner strength (capsule or rounder rectangle) |
| Focus return and the overlay stack | Shadow strength in the standard themes |

Today the token build supports a different accent and density out of the box. A different neutral temperature, font or corner strength needs a change in `tools/palette.py` or `tools/tokens_build.py`. The system does not provide those as runtime switches yet. The default (violet-tinted neutrals, capsules) is a style choice, not an Apple rule.

## v1 scope

| Supported in v1 | Host responsibility | Not in v1 |
| --- | --- | --- |
| Framework-free runtime (`bundle.css`, `bundle.js`) | Routing and data loading | Timeline with duration-based widths |
| Six themes and two densities | Calls to `destroy(root)` when a view leaves | Server-side rendering of the React adapter |
| `AppShell`, navigation, toolbar, menus, sheets, lists, fields | Commit of controlled values | A production React package |
| Claude Design React adapter (prototypes only) | Real search results and settings logic | Brand switches beyond accent and density |
| Automated checks in headless Chromium | Device, Safari and screen reader checks | Guaranteed frame rate for glass |

A contact sheet is not a timeline. Contact sheet tiles have a uniform width, so a width never suggests a duration. A timeline needs its own composition and is out of scope for v1.

## Verification

| Check | Command | Covers |
| --- | --- | --- |
| Contrast | `make contrast` | 1019 foreground, material and state pairs in six themes |
| Design audit | `make audit` | Rule tiers in dark and light themes |
| Interaction | `tools/interact.py` | 82 checks on the preview cards |
| Behavior contracts | `tools/contracts.py` | 99 checks, each tagged with an audit ID or a topic |
| React adapter | `tools/react_contracts.py` | 16 checks, skipped without `.ds-sync/node_modules` |

All of these run in headless Chromium. They do not replace checks on a real iPhone, an Android phone, Safari, Firefox, VoiceOver, NVDA or TalkBack. Do not mark an item "Meets" or "verified" until somebody runs those checks and records the device, browser and result. For a confirmed bug, write the failing test first, then fix it.
