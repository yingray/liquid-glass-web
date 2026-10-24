# design-sync notes: Liquid Glass Web

## How this repo syncs

- The core principles and the reuse model are in `design-system/0-principles.md`; the build copies it to `guides/0-principles.md`. The adapter follows rule 3 there: it calls the core controllers and never copies their logic.

- The design system is framework-free (`design-system/components/bundle.css` + `bundle.js`, which sets `window.LiquidGlass`). Claude Design builds with React components, so the sync ships **React adapters** from `.design-sync/react/`.
- `.design-sync/react/src/index.jsx` renders the markup that each component README documents and binds the real `window.LiquidGlass` controller in `useEffect`. It imports `bundle.js` itself, so `_ds_bundle.js` carries both. Styling and behaviour stay in `design-system/`; the adapters add none.
- `.design-sync/react/src/index.d.ts` is the hand-written type contract. Its JSDoc becomes each `<Name>.prompt.md` (every component is pinned to it via `componentSrcMap`).
- `node .design-sync/react/build.mjs` (after `make build`) writes `dist/index.js`, `dist/index.d.ts`, `dist/liquid-glass.css` (= `tools/.cache/tokens.css` + `bundle.css`) and `guides/` (the brand book and component READMEs under distinct names). `dist/` and `guides/` are gitignored.
- Global is `window.LiquidGlassUI` (not `LiquidGlass`, which stays the framework-free API).
- Card groups come from the `categories/<Group>.md` stubs via `docsMap` (frontmatter only; the prompt body is still synthesized). `AppShell` is in Foundations; `SelectList` is in Patterns.
- Adapters pass controller options through a proxy that reads the latest props, so a new callback or flag applies without a rebind. `LiquidGlassRoot` calls `LiquidGlass.destroy()` on its subtree when it unmounts.
- `tools/react_contracts.py` (16 checks, mainly audit items UI-41 to UI-45) tests the adapter: callbacks and options follow the latest props, the controlled SegmentedControl `index` request contract, `data-value` and item changes, the TextField `helper` and merged `aria-describedby`, `SelectList` and `ListRow` semantics, the Composer role and hint, `Menu.Item disabled`, and that every adapter controller is in the `destroy()` registry. It skips when `.ds-sync/node_modules` is missing.

## Gotchas

- `.design-sync/node_modules` must be a symlink to `../.ds-sync/node_modules` (recreate per clone). Without it the converter cannot find `@types/react` from the adapter package and inherited props resolve to `any` (`[DTS_REACT]`).
- Prop JSDoc is cut at 120 characters in the emitted `.d.ts`. Keep per-prop comments short and put rules in the component-level comment.
- The converter prints only the `<Name>Props` body. A named type that a prop refers to (`items: SegmentedItem[]`) comes out undefined, so the design agent cannot see its fields. Write item shapes inline in the prop, and derive the public name from the prop (`export type SegmentedItem = Exclude<SegmentedControlProps['items'][number], string>`). Put the alias above the component JSDoc, or it takes that JSDoc. Field comments inside the inline shape do not reach the emitted `.d.ts`.
- Controllers mutate ARIA attributes (`aria-checked`, `aria-pressed`, `hidden`) directly. Adapters render those attributes from props that do not change on re-render, so React never fights the controller. A controlled `SegmentedControl index` is a request contract: a user change calls `onChange`, and the control returns to `index` on the next frame unless the host passes the new index.
- Deprecated props stay accepted: `Composer hint` is ignored (a hint must name a registered shortcut; use `shortcut`), and `Stage noScrim` maps to `scrim="none"`.
- `--font-sans` does not name `"SF Pro Text"`. `-apple-system` and `BlinkMacSystemFont` already resolve to SF Pro on Apple devices. A named SF Pro family makes Claude Design show a "Missing brand font" warning, and the brand book forbids shipping SF Pro files (Apple-only license). Do not add the name back, and do not add a `runtimeFontPrefixes` entry for it.
- Undefined `--lg-*` variables in validate are set at runtime by `bundle.js` (`--lg-value`, `--lg-origin`, `--lg-thumb-x`, ...). Expected.
- Contact-sheet scale is misleading for widths. Measure in the browser (`getBoundingClientRect`) before calling a layout wrong.

## Preview authoring

- Previews import from `'liquid-glass-web-react'`. Every cell is already wrapped in `LiquidGlassRoot` (dark theme) by `cfg.provider`.
- Port content from `design-system/components/<Name>/preview.html` (the reference renders): same copy ("Frame 14 · Forest", "Add an Angle to “Harbor”"), same gradient thumbnails. Icons are inline 16-grid paths via `<Icon>`.
- Put a `padding: 16` wrapper around content that does not fill the cell.
- Stage needs an explicit height and free children above the media need `position: relative` (the `top` and `bottom` slots already sit in the scrim bands). A band appears only for a filled `top` or `bottom` slot (or `scrim`), and each band covers at most 25% of a short stage; still use 240px or more so the controls have room. Media is `fit="contain"` by default; pass `fit="cover"` only where the preview.html does.
- Show one glass label per stage (Patterns rule).
- `Toolbar.Spacer` only works when the toolbar has a width (`style={{ width: '100%' }}`); the toolbar is inline-flex.
- Contained FloatingNavbar needs a frame of at least 744px for desktop islands; about 820px crops the tools island. Use 980px or 1180px frames scaled with CSS `zoom`. The card uses `cardMode: column`.
- Static TabBar minimized state: pass `data-minimized="" data-scrolled="" data-scroll-manual=""` through rest props.
- Static mobile Modal: no `block` button in the footer (the hint wraps one word per line).
- Capture viewport is 900x700; keep each story under about 650px tall.
- `lg-frame` (media frame) has no adapter. Previews use `className="lg-frame"` (+ `is-selected` or `aria-current="true"`) inside a `data-tone="dark"` wrapper. Selection draws an inset ring and a check mark, not an outline.
- `TextField error` renders a fragment; wrap it in a grid with a 6px gap. Do not name a preview export `Error`.
- A neutral pulsing `StatusDot` captures dim in a still frame. Expected.
- A nested `LiquidGlassRoot` re-tones only its subtree (`setTone`); only the outermost root calls `applyTheme`. This is what makes the LightTheme cell work under the dark provider.
- Wide cards use `cardMode: column` (LiquidGlassRoot, Composer, Toolbar, FloatingNavbar, AppShell), per `[GRID_OVERFLOW]`.
- Icon-only buttons in previews use `tooltip`, not `title`. Don't write shortcut text ("(⌘Z)", "(Space)") into labels; only a registered `Composer shortcut` shows a hint.

## Known render warns

(none; `[GRID_OVERFLOW]` was resolved with `cardMode: column`)

## Re-sync risks

- Wave graders missed real defects that a second look caught (a spacer that did nothing, two labels on one stage). Always open the sheets yourself before pushing a batch.

- The adapters duplicate the markup from the component READMEs. When a README's markup changes, update `src/index.jsx` and recheck the matching card.
- `tools/.cache/tokens.css` is generated by `make build`; the adapter build fails loudly if it is missing.
- After an adapter change, run `python3 tools/react_contracts.py` before you sync. Use a Python that has the `playwright` module (on this machine `/usr/bin/python3`; the Homebrew `python3` fails with `ModuleNotFoundError`).
