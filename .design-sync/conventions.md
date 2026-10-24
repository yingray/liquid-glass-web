# Liquid Glass Web: how to build with it

Liquid Glass Web follows Apple's "Adopting Liquid Glass": glass is a separate functional layer for navigation, toolbars and overlays. Content stays opaque. Dark-first.

## Setup: always wrap the app in LiquidGlassRoot

`LiquidGlassRoot` applies the theme to `<html data-theme>`, paints the `--canvas` background, sets 14px body text and starts the runtime (refraction, glass tone, keyboard tracking). Without it, tones and themes do not switch. Use one root per app. A nested `LiquidGlassRoot theme="light"` gives only its subtree light tokens.

```jsx
const { LiquidGlassRoot, FloatingNavbar, GlassPanel, ListRow, GlassButton } = window.LiquidGlassUI;

<LiquidGlassRoot theme="dark" style={{ minHeight: '100vh' }}>
  <FloatingNavbar contained brand={<span>Lumen</span>} brandLabel="Lumen home" links={['Studio', 'Library', 'Shows']}
    action={<GlassButton variant="accent">Export</GlassButton>} />
  <main style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-24)', padding: 'var(--space-24)' }}>
    <section style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-20)' }}>
      <h2 className="title-3">Island Light</h2>
      <p className="callout" style={{ color: 'var(--ink-muted)' }}>18 / 48 selected</p>
    </section>
    <GlassPanel label="Inspector">
      <GlassPanel.Group title="Needs Your Decision" count={3}>
        <ListRow title="Frame 14 · Forest" subtitle="4 versions · Pick #2" chevron />
      </GlassPanel.Group>
    </GlassPanel>
  </main>
</LiquidGlassRoot>
```

## Styling idiom

- Use the components for every control and glass surface. Never draw your own glass, blur or capsule buttons.
- For your own layout glue, use CSS variables, never raw colors:
  - surfaces: `var(--canvas)` page, `var(--surface)` opaque cards, `var(--surface-inset)` recessed areas, `var(--stage)` media
  - text: `var(--ink)` primary, `var(--ink-muted)` secondary (only two levels); `var(--accent-text)` for links
  - state and lines: `var(--fill)`, `var(--fill-strong)`, `var(--line)`; status `var(--ok)`, `var(--warn)`, `var(--danger)`
  - spacing `var(--space-4)` … `var(--space-96)` (the name is the pixel value); radius `var(--radius-lg)`, `var(--radius-xl)`, `var(--radius-2xl)`, `var(--radius-panel)`
- Text styles are classes: `title-3` (panel and sheet titles), `body`, `callout` (13px lists and controls), `caption` and `footnote` (12px), `label-sm` (group headers, with `--ink-muted`), `mono` (numbers, IDs, timecodes). No all caps.
- Content cards use no shadow, just a `var(--line)` inner border.

## Rules that keep designs on-brand

- One accent action per screen (plus one in the navbar). Accent buttons always have text.
- Glass never contains glass: buttons inside islands, toolbar groups and panels use `variant="plain"` or `tinted`.
- Toolbar groups hold only icon buttons; the labeled accent action stands alone. Menus confirm deletion inline with `Menu.Confirm`.
- Media goes on a `Stage` (dark tone), and controls on it use the media variants.
- Copy: Title Case for buttons, tabs and headers ("Remove from Show"), never "OK". Status is always dot or badge plus text.
- Mobile (< 744px): `TabBar` for the main destinations, the inspector becomes a `Modal`.

## Where the truth lives

- `styles.css` and `_ds_bundle.css`: every token and `lg-*` class.
- `components/<group>/<Name>/<Name>.prompt.md` and `.d.ts`: the API of each component.
- `guidelines/guides/brand-book.md`, then `1-states.md` … `5-apple-alignment.md` and `guidelines/guides/components/*.md` (these show raw `lg-*` markup; in React, use the matching component).
