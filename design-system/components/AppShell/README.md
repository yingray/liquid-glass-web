# AppShell

The fluid page layout for an app: the navbar reservation at the top, a content grid with an optional aside, the main column and an optional inspector, and a bottom reservation for the tab bar. One layout and one set of markup serve every width from 320px to wide desktop. A task that leaves the screen moves into a menu, a tab or the page header; it never disappears.

## When to use

- The layout of an app page with navigation, a main work area and side columns (a contact sheet, an inspector).
- As the layout reference. The fixed ShowcaseDesktop and ShowcaseMobile cards are showcase cards only, not layout references.
- Website pages with long-form content use the website layout values (`layout-max`, `gutter-*`) instead.

## Structure

```html
<div class="lg-app">
  <header class="lg-navbar" data-lg="navbar">…</header>
  <div class="lg-app__body">
    <div class="lg-app__grid">
      <aside class="lg-app__aside" aria-label="Contact Sheet">
        <div class="lg-panel__head"><h2 class="label">Contact Sheet</h2><span class="lg-panel__count">48</span></div>
        <div class="lg-app__dock">(frame tiles, all one size)</div>
      </aside>
      <main class="lg-app__main">
        (project header: name, project tabs with a pending count, Export; below 744px a project actions menu)
        (tab panels: stage + composer, sources)
      </main>
      <div class="lg-app__inspector">(GlassPanel inspector: Selection, then Project)</div>
    </div>
  </div>
  <nav class="lg-tabbar" aria-label="Main tabs" data-lg="tabbar">…</nav>
</div>
```

- `.lg-app` holds the navbar, `.lg-app__body` and the tab bar. Its top padding is `var(--content-top)`, so the first block always starts below the islands, on touch and on mobile too.
- `.lg-app__body` is a size container (`lg-app-body`), so the grid follows the space the app really has. It keeps a 16px side gutter, or the safe area if that is larger.
- `.lg-app__aside` and `.lg-app__inspector` are sticky below the navbar and scroll on their own when they are taller than the window.
- `.lg-app__dock` holds the aside's list. Below 744px it becomes a horizontal row that scrolls on its own; the page itself never scrolls sideways. Each tile is `--lg-dock-tile` wide, so 3.4 tiles show (5.4 from a 480px container) and the next frame shows in part at the edge. Set your tiles to `width: var(--lg-dock-tile)` if a more specific rule sizes them.
- The side columns, the dock, panels and sheet bodies use a thin platform scrollbar in `ink-faint`. The side columns keep a stable gutter. They have no scroll edge, because no control floats above them.
- A contact sheet uses tiles of one size: a contact sheet is not a timeline. A timeline with widths in proportion to duration is not part of v1.
- **The project header** stays in the main column at every width: the project name, the project areas (Picks / Sources) with the pending count, and the project actions. At ≥ 744px Export is a tinted button in the header and Queue is in the tools island; below 744px both move into a project actions menu (`role="menu"`) in the header.
- **One accent per task scope**: in a review screen the accent is the review action on the stage; Export stays tinted or glass.
- `.lg-app--contained`: an app inside a pane (a preview, an embed). Its navigation follows the pane width, not the window width, and the tab bar (`lg-tabbar--contained`) appears when the pane is narrower than 744px.

## Responsive (container queries on `.lg-app__body`)

| Width | Rendering |
| --- | --- |
| ≥ 1100px | Three columns: aside, main, inspector |
| 744–1099px | Compact aside and main; the inspector moves below the main column |
| < 744px | One column; the aside becomes a horizontal dock that scrolls on its own; the inspector follows the content; the tab bar appears, and the page reserves room at the bottom for it |

## Desktop to mobile mapping

| Task | ≥ 744px | < 744px |
| --- | --- | --- |
| Main destinations | Links in the brand island | Tab bar |
| Search | Tools island | Tab bar search circle |
| Project name, areas, pending count | Project header | Project header |
| Export, Queue | Header button and tools island | Project actions menu in the header |
| Contact sheet | Aside column | Horizontal dock |
| Inspector | Right column (≥ 1100px); below the main column (744–1099px) | After the content |

## Verification

The AppShell preview card is fluid. An automated check in headless Chromium (`tools/contracts.py`, UI-01 / UI-02) loads it at widths from 320px to 1920px and in landscape, and confirms that there is no horizontal scrolling, that nothing starts under the navbar, and that the project, Picks / Sources with the pending count, search, Export and Queue are all reachable. It is not yet checked on physical devices.

## Accessibility

- The aside has an `aria-label` ("Contact Sheet"); the main column is `<main>`; the project areas are a tablist whose tabs name their panels with `aria-controls`.
- Tiles that show the frame on the stage use `aria-current="true"`, not `aria-selected`.
- The project actions button has an `aria-label`, `aria-controls` and `data-tooltip`; its menu follows the menu button pattern (see GlassPanel).
- Never hide a task by width. Move it into a menu, a tab or the header.
