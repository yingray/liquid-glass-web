# Liquid Glass Web: how to build with it

Liquid Glass Web follows Apple's "Adopting Liquid Glass": glass is a separate functional layer for navigation, toolbars and overlays. Content stays opaque. Dark-first.

## Setup: always wrap the app in LiquidGlassRoot

`LiquidGlassRoot` applies the theme to `<html data-theme>`, paints the `--canvas` background, sets body text (the `--type-body` role) and starts the runtime (refraction, glass tone, tooltips, keyboard tracking). On unmount it releases every controller in its subtree. Without it, tones and themes do not switch. Use one root per app. A nested `LiquidGlassRoot theme="light"` gives only its subtree light tokens. `density="comfortable"` gives 16px body text and 15px controls; below 744px comfortable is already the default unless `density="compact"`.

For a page layout, use `AppShell`: it is one fluid layout from 320px to wide desktop.

```jsx
const { LiquidGlassRoot, AppShell, FloatingNavbar, TabBar, GlassPanel, ListRow, GlassButton } = window.LiquidGlassUI;

<LiquidGlassRoot theme="dark" style={{ minHeight: '100vh' }}>
  <AppShell
    navbar={<FloatingNavbar brand={<span>Lumen</span>} brandLabel="Lumen home" links={['Studio', 'Library', 'Shows']}
      action={<GlassButton variant="glass">Export</GlassButton>} />}
    tabbar={<TabBar tabs={[{ label: 'Studio', icon: studioIcon }, { label: 'Library', icon: libraryIcon }, { label: 'Shows', icon: showsIcon }]} search />}
    inspector={
      <GlassPanel label="Inspector">
        <GlassPanel.Group title="Needs Your Decision" count={3}>
          <ListRow title="Frame 14 · Forest" subtitle="4 versions · Pick #2" chevron />
        </GlassPanel.Group>
      </GlassPanel>
    }>
    <section style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-20)' }}>
      <h2 className="title-3">Island Light</h2>
      <p className="callout" style={{ color: 'var(--ink-muted)' }}>18 / 48 selected</p>
    </section>
  </AppShell>
</LiquidGlassRoot>
```

## Styling idiom

- Use the components for every control and glass surface. Never draw your own glass, blur or capsule buttons.
- For your own layout glue, use CSS variables, never raw colors:
  - surfaces: `var(--canvas)` page, `var(--surface)` opaque cards, `var(--surface-inset)` recessed areas, `var(--stage)` media
  - text: `var(--ink)` primary, `var(--ink-muted)` secondary (only two levels); `var(--accent-text)` for links. Never dim text with opacity.
  - state and lines: `var(--fill)`, `var(--fill-strong)`, `var(--line)`; status `var(--ok)`, `var(--warn)`, `var(--danger)`
  - spacing `var(--space-4)` … `var(--space-96)` (the name is the pixel value); radius `var(--radius-lg)`, `var(--radius-xl)`, `var(--radius-2xl)`, `var(--radius-panel)`
- Text styles are type roles. Use the class (`title-3`) or `font: var(--type-title-3)`, never a pixel size: `title-3` (panel and sheet titles), `body`, `callout` (lists and controls), `caption` and `footnote` (subtitles), `label-sm` (group headers, with `--ink-muted`), `mono` (numbers, IDs, timecodes). Sizes follow the density. No all caps.
- Content cards use no shadow, just a `var(--line)` inner border.

## Rules that keep designs on-brand

- One accent per task scope: the next step of the current task (Review while reviewing, Send while the composer has text). Other actions, Export included, stay `tinted` or `glass`. Accent buttons always have text.
- Glass never contains glass: buttons inside islands, toolbar groups and panels use `variant="plain"` or `tinted`.
- Toolbar groups hold only icon buttons; the labeled accent action stands alone. Icon-only buttons get `aria-label` and `tooltip`. Show a shortcut in a label or tooltip only when the app registers it.
- Choose the confirmation by consequence: a reversible action runs and offers Undo (`toast(msg, { action: { label: 'Undo', onClick } })`); a local destructive action uses `Menu.Confirm`; a consequence beyond what the user sees uses `<Modal presentation="center">`.
- Menu icons are optional, but inside one group (between separators or labels) every `Menu.Item` has an icon or none does. A disabled `Menu.Item` stays focusable and never runs.
- `ListRow selected` belongs inside a `SelectList` only. Elsewhere use `current` (the item shown on the stage) or `pressed` (a toggle).
- Media goes on a `Stage` (dark tone), and controls on it use the media variants. The stage shows the whole frame (`fit="contain"`, the default); use `fit="cover"` only for browsing or decoration. Scrims appear only where `top` or `bottom` holds controls; `inspect` hides controls and scrims.
- `Composer` is an assistant instruction field (`kind="assistant"`), not search. Give it `scopeLabel` for screen readers, `shortcut="k"` on one composer per page, and `status` / `statusMessage` for the request state.
- Give `SegmentedControl` items a stable `value`, and `badgeLabel` for a count badge ("3 pending").
- Copy: Title Case for buttons, tabs and headers ("Remove from Show"), never "OK". Status is always dot or badge plus text.
- Mobile (< 744px): `TabBar` for the main destinations; project tasks (areas, pending count, Export, Queue) move into the menu or an in-page project header, never away; the inspector becomes a `Modal` or follows the content (`AppShell` does this).

## Where the truth lives

- `styles.css` and `_ds_bundle.css`: every token and `lg-*` class.
- `components/<group>/<Name>/<Name>.prompt.md` and `.d.ts`: the API of each component.
- `guidelines/guides/0-principles.md` first (core principles, reuse model, overlay and confirmation choice, v1 scope), then `brand-book.md`, then `1-states.md` … `5-apple-alignment.md` and `guidelines/guides/components/*.md` (these show raw `lg-*` markup; in React, use the matching component).
