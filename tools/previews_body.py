
# ======================================================================
# shared pieces (v3)
# ======================================================================
def navbar(menu_id='nav-menu', scrolled=False, menu_open=False, toast=None):
    sc = ' data-scrolled data-scroll-manual' if scrolled else ''
    # Main destinations live in the top islands (≥ 744) or the tab bar (< 744). Below 744 the project scope
    # (its areas, Export, Queue) moves into the menu, in its own group, so no task disappears with the islands.
    project = [('check', 'Picks'), ('folder', 'Sources · 3 Pending'), ('share', 'Export “Island Light”'), ('list', 'Queue · 2 Running')]
    items = [('clock', 'Activity'), ('gear', 'Settings')]
    menu_items = (''.join(f'<a class="lg-menu__item lg-nav-mobile" href="#">{icon(ic)}{t}</a>' for ic, t in project)
                  + '<div class="lg-menu__sep lg-nav-mobile" role="separator"></div>'
                  + ''.join(f'<a class="lg-menu__item" href="#">{icon(ic)}{t}</a>' for ic, t in items))
    return f"""<header class="lg-navbar lg-navbar--contained"{sc} data-lg="navbar">
  <div class="lg-scroll-edge" aria-hidden="true"></div>
  <div class="lg-navbar__row">
    <div class="lg-navbar__island lg-glass" data-refract>
      {BRAND}
      <span class="lg-nav-desktop">{nav_links(NAV_DEST)}</span>
    </div>
    <div class="lg-navbar__island lg-navbar__island--text lg-glass lg-nav-desktop" data-refract role="group" aria-label="Project Island Light">
      <span class="lg-navbar__crumb lg-nav-optional"><a href="#">Shows</a><span class="lg-navbar__crumb-sep">/</span></span>
      <b style="font-weight:600">Island Light</b>
      <span class="lg-progress lg-progress--md lg-progress--neutral lg-nav-optional" style="width:52px;--lg-value:38%"><span></span></span>
      <span class="mono lg-muted lg-nav-optional">18 / 48 selected</span>
    </div>
    <div class="lg-navbar__island lg-navbar__island--tight lg-glass lg-nav-desktop">
      {seg(['Picks', 'Sources'], 0, label='Project area', role='tablist', badge=(1, 3), values=['picks', 'sources'])}
    </div>
    <button class="lg-btn lg-glass lg-nav-desktop" type="button" aria-label="Export Island Light">{icon('share')}Export</button>
    <span class="lg-navbar__spacer"></span>
    <div class="lg-navbar__island lg-navbar__island--tight lg-glass" data-refract>
      <button class="lg-btn lg-btn--plain lg-btn--icon lg-nav-desktop" type="button" aria-label="Search" data-tooltip>{icon('search')}</button>
      <button class="lg-btn lg-btn--plain lg-nav-desktop" type="button" aria-label="Queue, 2 running" data-tooltip="Queue" style="--lg-px:8px">{icon('list')}<span class="lg-badge lg-badge--sm lg-badge--count" aria-hidden="true">2</span></button>
      <button class="lg-btn lg-btn--plain lg-btn--icon lg-navbar__menu-toggle" type="button" aria-label="Menu" aria-expanded="{'true' if menu_open else 'false'}" aria-controls="{menu_id}">{icon('close' if menu_open else 'menu')}</button>
    </div>
  </div>
  <div class="lg-navbar__menu lg-menu lg-glass lg-glass--popover" id="{menu_id}"{'' if menu_open else ' hidden'}>
    <span class="lg-menu__label">Island Light · 18 / 48 Selected</span>
    {menu_items}
  </div>
  {f'<div class="lg-toast lg-toast--contained lg-glass lg-glass--popover" role="status">{toast}</div>' if toast else ''}
</header>"""


def tabbar(tabs, cur=0, search=True, minimized=False, scrolled=False, label='Main tabs'):
    st = (' data-minimized' if minimized else '') + (' data-scrolled data-scroll-manual' if scrolled else '')
    t = ''.join(f'<a class="lg-tabbar__tab" href="#"{" aria-current=&quot;page&quot;" if i == cur else ""}>{icon(ic)}<span>{name}</span></a>'.replace('&quot;', '"') for i, (ic, name) in enumerate(tabs))
    s = f'<button class="lg-tabbar__search lg-glass" type="button" aria-label="Search">{icon("search")}</button>' if search else ''
    return f"""<nav class="lg-tabbar lg-tabbar--contained" aria-label="{label}" data-lg="tabbar" data-minimize="scroll-down"{st}>
  <div class="lg-scroll-edge lg-scroll-edge--bottom" aria-hidden="true"></div>
  <div class="lg-tabbar__tabs lg-glass">{t}</div>{s}
</nav>"""


def content_cards(n=8, top=0):
    cards = ''.join(f'<div class="nv-card"><div class="nv-thumb" style="{bg(i)}"></div><b>Frame {i + 11}</b><span>Forest · 2026.03</span></div>' for i in range(n))
    return f'<div class="nv-cards" style="top:{top}px">{cards}</div>'


def composer(value='', scope='@all', ph='Tell the assistant how to adjust these photos…', flat=False, shortcut=False, scope_label='All frames'):
    # an instruction field for the assistant, not site search: no role="search". The ⌘K / Ctrl K hint is written
    # by Composer() only when data-shortcut is set (one composer per page owns the shortcut).
    dis = '' if value else ' disabled'
    v = f' value="{value}"' if value else ''
    f = ' lg-glass--flat' if flat else ''
    sc = ' data-shortcut="k"' if shortcut else ''
    return f"""<form class="lg-composer lg-glass{f}" onsubmit="event.preventDefault()" aria-label="Instructions for the assistant" data-lg="composer"{sc}>
  <span class="lg-dot lg-dot--lg lg-dot--accent" aria-hidden="true"></span>
  <span class="lg-badge lg-badge--mono"><span class="lg-sr-only">Scope: {scope_label}, </span><span aria-hidden="true">{scope}</span></span>
  <input class="lg-composer__input" type="text" placeholder="{ph}" aria-label="Instructions for the assistant"{v}>
  <span class="lg-composer__hint" aria-hidden="true"></span>
  <button class="lg-btn lg-btn--accent" type="submit"{dis}>Send</button>
</form>"""


def media_toolbar(label='Play', first=('play', 'Play'), readout='0:13<small> / 0:47</small>', action='Review 4 Candidates'):
    return f"""<div class="lg-toolbar" role="toolbar" aria-label="{label}" data-lg="toolbar">
  <div class="lg-toolbar__group lg-toolbar__group--readout lg-glass lg-glass--media lg-glass--elevated">
    <button class="lg-btn lg-btn--media-solid lg-btn--icon" type="button" aria-label="{first[1]}" data-tooltip>{icon(first[0], 12)}</button>
    <span class="lg-toolbar__text">{readout}</span>
  </div>
  <button class="lg-btn lg-btn--accent" type="button">{action}</button>
  <div class="lg-toolbar__group lg-glass lg-glass--media lg-glass--elevated">
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Add Note" data-tooltip aria-pressed="false">{icon('pin')}</button>
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Share" data-tooltip>{icon('share')}</button>
  </div>
</div>"""


# one list of main destinations: links in the brand island at ≥ 744px, the tab bar below 744px
NAV_DEST = ['Studio', 'Library', 'Shows']
TABS_APP = [('grid', 'Studio'), ('folder', 'Library'), ('stack', 'Shows')]
TABS_SITE = TABS_APP

# ======================================================================
# FloatingNavbar (+ TabBar)
# ======================================================================
NAV_CSS = """
  .nv-1440 { height: 172px; }
  .nv-scroll { height: 300px; }
  .nv-cards { position: absolute; left: 20px; right: 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .nv-card { display: grid; gap: 4px; font-size: 13px; line-height: 18px; }
  .nv-card b { font-weight: 600; }
  .nv-card span { color: var(--ink-muted); font-size: 12px; }
  .nv-thumb { aspect-ratio: 16 / 10; border-radius: 18px; }
  .nv-mid { width: 980px; height: 120px; }
  .nv-phones { display: flex; gap: 24px; align-items: flex-start; }
  .nv-phone { width: 390px; height: 560px; border-radius: 40px; }
  .nv-phone .lg-navbar__menu { max-height: 400px; overflow-y: auto; }
  .nv-phone .nv-cards { grid-template-columns: 1fr 1fr; left: 16px; right: 16px; }
  .nv-hero { position: absolute; inset: 0; border-radius: 0; }
  .nv-phone figcaption { margin: 0 0 8px; }
"""
body = f"""<main class="d lg-root">
<section>
  <h2 class="d-h">Desktop 1440 (scaled): grouped by scope. Global (brand + app switcher) · project (name, its areas, and “Export” next to them, so it is clear what is exported) · tools (icons only, each with a tooltip). In a review screen the accent belongs to the review action, so Export stays glass</h2>
  <div class="d-frame nv-1440">{navbar('m1')}<div style="position:absolute;left:20px;right:20px;top:68px;bottom:-40px">{content_cards(4, 0)}</div></div>
</section>
<section>
  <h2 class="d-h">Scrolled: content passes under the islands and the scroll edge (data-scrolled) lays the canvas behind the glass; the toast uses thick glass</h2>
  <div class="d-frame nv-scroll">{content_cards(8, 28)}{navbar('m2', scrolled=True, toast='Added Frame 14 to the show.')}</div>
</section>
<section>
  <h2 class="d-h">744–1099px: optional context (breadcrumb, progress) hides automatically</h2>
  <div class="d-frame nv-mid">{navbar('m3')}</div>
</section>
<section>
  <h2 class="d-h">Mobile 390: only brand and menu at the top; main tabs move to the bottom tab bar, with search as a separate circle at the trailing end</h2>
  <div class="nv-phones">
    <div><p class="d-cap" style="margin:0 0 8px">① Top of the page</p><div class="d-frame nv-phone" data-density="comfortable"><div class="lg-stage lg-stage--no-scrim nv-hero" data-surface-tone="dark"><div class="lg-stage__media" style="{bg(2)}"></div></div>{navbar('m4')}{tabbar(TABS_SITE)}</div></div>
    <div><p class="d-cap" style="margin:0 0 8px">② Scrolled down: the tab bar gets shorter and drops its labels, but every tab stays one tap away; scroll edges top and bottom</p><div class="d-frame nv-phone" data-density="comfortable">{content_cards(8, 40)}{navbar('m5', scrolled=True)}{tabbar(TABS_SITE, 0, minimized=True, scrolled=True)}</div></div>
    <div><p class="d-cap" style="margin:0 0 8px">③ Menu: the project scope (areas, Export, Queue) in one group, secondary items in another</p><div class="d-frame nv-phone" data-density="comfortable">{content_cards(8, 70)}{navbar('m6', scrolled=True, menu_open=True)}{tabbar(TABS_SITE, 0, scrolled=True)}</div></div>
  </div>
</section>
</main>"""
write('FloatingNavbar', page('<!-- @dsCard group="Navigation" height=1450 width=1270 subtitle="Separate glass islands, scroll edge, mobile tab bar" -->', 'FloatingNavbar — preview', body, NAV_CSS))

# ======================================================================
# GlassButton
# ======================================================================
STATES = [('Rest', ''), ('Hover', ' data-state="hover"'), ('Pressed', ' data-state="active"'), ('Focus', ' data-state="focus"'), ('Disabled', ' disabled')]


def row(label, cls, text, ic=None, extra=''):
    cells = ''.join(f'<div><button class="lg-btn {cls}" type="button"{a}{extra}>{icon(ic) if ic else ""}{text}</button></div>' for _, a in STATES)
    return f'<p class="d-cap">{label}</p><div class="bt-cells">{cells}</div>'


BTN_CSS = """
  .bt-grid { display: grid; grid-template-columns: 140px 1fr; gap: 10px 16px; align-items: center; }
  .bt-cells { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; align-items: center; justify-items: start; padding: 12px 16px; border-radius: 18px; }
  .bt-canvas .bt-cells { background: var(--canvas); box-shadow: inset 0 0 0 1px var(--line); }
  .bt-stage { padding: 6px 0; }
  .bt-head { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; padding: 0 16px; }
"""
heads = ''.join(f'<p class="d-cap">{n}</p>' for n, _ in STATES)
canvas_rows = ''.join([
    row('accent', 'lg-btn--accent', 'Export'),
    row('inverse', 'lg-btn--inverse', 'Split in Two'),
    row('tinted', 'lg-btn--tinted', 'Cancel'),
    row('plain', 'lg-btn--plain', 'Redo All'),
    row('outline', 'lg-btn--outline', 'Add Note', 'pin'),
    row('danger', 'lg-btn--danger', 'Delete'),
    row('glass (≈ .glass)', 'lg-glass lg-btn--nav', 'Queue', 'list'),
])
media_rows = ''.join([
    row('media-solid', 'lg-btn--media-solid lg-btn--icon', '', 'play', extra=' aria-label="Play"'),
    row('media', 'lg-btn--media lg-btn--icon lg-btn--sm', '', 'left', extra=' aria-label="Previous"'),
    row('glass--media (≈ .clearGlass)', 'lg-glass lg-glass--media lg-glass--chip', 'Add This Angle'),
    row('outline (stage)', 'lg-btn--outline', 'Add Note', 'pin'),
])
body = f"""<main class="d lg-root">
<section>
  <h2 class="d-h">Buttons on canvas, surface and inside glass islands (accent maps to Apple’s .glassProminent: the primary action is an opaque accent fill so its dark label keeps 6.7:1)</h2>
  <div class="bt-grid bt-canvas"><span></span><div class="bt-head">{heads}</div>{canvas_rows}</div>
</section>
<section>
  <h2 class="d-h">Buttons on the stage (data-tone="dark", identical in every theme)</h2>
  <div class="lg-stage bt-stage" data-tone="dark" data-scrim="both"><div class="lg-stage__media" style="{bg(4)}"></div>
    <div class="bt-grid" style="position:relative;padding:10px 16px"><span></span><div class="bt-head">{heads}</div>{media_rows}</div>
  </div>
</section>
<section>
  <h2 class="d-h">Sizes: xs 26 · sm 32 · md 36 · lg 44; round icon buttons match the height. Always ≥ 44 on touch. Pressed toggles (aria-pressed) invert</h2>
  <div class="d-row">
    <button class="lg-btn lg-btn--tinted lg-btn--xs" type="button">2×</button>
    <button class="lg-btn lg-btn--tinted lg-btn--sm" type="button">Edit</button>
    <button class="lg-btn lg-btn--tinted" type="button">Redo All</button>
    <button class="lg-btn lg-btn--accent lg-btn--lg" type="button">Use #2, Then View Frame 15</button>
    <button class="lg-btn lg-btn--tinted lg-btn--icon lg-btn--sm" type="button" aria-label="Close">{icon('close')}</button>
    <button class="lg-btn lg-btn--tinted lg-btn--icon" type="button" aria-label="More">{icon('more')}</button>
    <button class="lg-btn lg-btn--outline" type="button" aria-pressed="true" data-lg="button">{icon('pin')}Add Note</button>
    <button class="lg-btn lg-btn--danger" type="button" data-armed>Press Again to Delete</button>
  </div>
</section>
</main>"""
write('GlassButton', page('<!-- @dsCard group="Controls" height=1080 width=1140 subtitle="Seven styles × five states, plus stage-only styles" -->', 'GlassButton — preview', body, BTN_CSS))

# ======================================================================
# SegmentedControl
# ======================================================================
SEG_CSS = """
  .sg-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .sg-card { padding: 20px; display: grid; gap: 14px; justify-items: start; align-content: start; }
  .sg-390 { width: 358px; }
"""
body = f"""<main class="d lg-root">
<div class="sg-cols">
  <section class="sg-card d-card">
    <h2 class="d-h" style="margin:0">Sizes: sm (26), md (30, default), lg (32). Track inset 3px</h2>
    {seg(['Fit', '2×', '4×'], 0, label='Zoom', cls=' lg-segmented--sm')}
    {seg(['Single', 'Side by Side', 'Grid', 'Swipe'], 2, label='Compare mode')}
    {seg(['Use Existing', 'Ask the Assistant'], 0, label='Source', cls=' lg-segmented--lg', role='tablist')}
    <h2 class="d-h" style="margin:4px 0 0">States: “Side by Side” hover, “Grid” keyboard focus, “Swipe” disabled; items can carry a count badge</h2>
    {seg(['Single', 'Side by Side', 'Grid', 'Swipe'], 0, label='States demo', states={1: 'hover', 2: 'focus'}, disabled=[3])}
    {seg(['Picks', 'Sources'], 0, label='Project area', role='tablist', badge=(1, 3))}
    <h2 class="d-h" style="margin:4px 0 0">While pressed and dragged, the thumb turns into glass and swells slightly; on release it settles back to solid</h2>
    {seg(['Single', 'Side by Side', 'Grid'], 1, label='Pressed demo', extra=' data-pressed')}
  </section>
  <section class="sg-card d-card">
    <h2 class="d-h" style="margin:0">Mobile 390: lg-segmented--block fills the width</h2>
    <div class="sg-390">{seg(['All', 'Undecided', 'Chosen'], 1, label='Filter', cls=' lg-segmented--block')}</div>
    <h2 class="d-h" style="margin:4px 0 0">For navigation: the link version (aria-current), no JavaScript needed</h2>
    {nav_links(NAV_DEST)}
    <h2 class="d-h" style="margin:4px 0 0">Group disabled</h2>
    {seg(['Standard', 'High'], 0, label='Quality', extra=' aria-disabled="true"')}
  </section>
</div>
<section>
  <h2 class="d-h">On the stage: lg-segmented--media (white thumb, dark text); right, while pressed the thumb turns into a dark plate and the label flips to white</h2>
  <div class="lg-stage" data-tone="dark" data-scrim="both" style="height:150px;display:grid;place-items:center"><div class="lg-stage__media" style="{bg(7)}"></div>
    <div class="d-row" style="position:relative">{seg(['Single', 'Side by Side', 'Grid', 'Swipe'], 2, label='Compare mode (stage)', cls=' lg-segmented--media')}{seg(['Fit', '2×', '4×'], 1, label='Zoom (stage, pressed)', cls=' lg-segmented--media', extra=' data-pressed')}</div>
  </div>
</section>
</main>"""
write('SegmentedControl', page('<!-- @dsCard group="Controls" height=700 width=1000 subtitle="Draggable selection thumb that turns into glass while pressed" -->', 'SegmentedControl — preview', body, SEG_CSS))

# ======================================================================
# Toolbar & Composer
# ======================================================================
TB_CSS = """
  .tb-stage { height: 300px; }
  .tb-stage .lg-stage__bottom { bottom: 18px; }
  .tb-review { height: 150px; }
  .tb-review .lg-stage__bottom { bottom: 16px; }
  .tb-canvas { padding: 24px; display: grid; gap: 18px; justify-items: center; }
  .tb-wrong { display: flex; gap: 20px; align-items: center; justify-content: center; flex-wrap: wrap; }
  .tb-wrong figure { margin: 0; display: grid; gap: 8px; justify-items: center; }
  .tb-wrong .one { display: inline-flex; align-items: center; gap: 4px; height: 48px; padding: 0 6px; border-radius: 999px; }
"""
review_tb = f"""<div class="lg-toolbar" role="toolbar" aria-label="Compare playback" data-lg="toolbar">
  <div class="lg-toolbar__group lg-toolbar__group--readout lg-glass lg-glass--media lg-glass--elevated">
    <button class="lg-btn lg-btn--media-solid lg-btn--icon" type="button" aria-label="Pause" data-tooltip>{icon('pause', 12)}</button>
    <span class="lg-toolbar__text">0:01<small> / 0:05</small></span>
    <input class="lg-scrub lg-scrub--input" type="range" min="0" max="50" value="11" aria-label="Playback position" aria-valuetext="0:01 of 0:05">
  </div>
  <div class="lg-toolbar__group lg-glass lg-glass--media lg-glass--elevated">{seg(['Fit', '2×', '4×'], 0, label='Zoom', cls=' lg-segmented--media lg-segmented--sm')}</div>
</div>"""
canvas_tb = f"""<div class="lg-toolbar" role="toolbar" aria-label="Edit" data-lg="toolbar">
  <div class="lg-toolbar__group lg-glass">
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Undo" data-tooltip>{icon('undo')}</button>
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Redo" data-tooltip>{icon('redo')}</button>
  </div>
  <div class="lg-toolbar__group lg-glass">
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Compare" aria-pressed="true">{icon('compare')}</button>
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Grid" aria-pressed="false">{icon('grid')}</button>
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Adjust" disabled>{icon('sliders')}</button>
  </div>
  <div class="lg-toolbar__group lg-glass">
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Share">{icon('share')}</button>
    <button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="More">{icon('more')}</button>
  </div>
</div>"""
wrong = f"""<div class="tb-wrong">
  <figure><div class="one lg-glass"><button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Undo">{icon('undo')}</button><button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Redo">{icon('redo')}</button><button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Annotate">{icon('pin')}</button><button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="More">{icon('more')}</button></div><figcaption class="d-cap"><span class="lg-badge" style="background:var(--danger-fill);color:var(--on-danger)">Don’t</span> Unrelated actions on one background</figcaption></figure>
  <figure><div class="one lg-glass"><button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Share">{icon('share')}</button><button class="lg-btn lg-btn--plain" type="button">Redo All</button></div><figcaption class="d-cap"><span class="lg-badge" style="background:var(--danger-fill);color:var(--on-danger)">Don’t</span> Icons and text mixed on one background</figcaption></figure>
</div>"""
body = f"""<main class="d lg-root">
<section>
  <h2 class="d-h">Toolbar on the stage: one glass background per group (play + timecode | note + share), the primary action “Review” stands alone; it must sit in the stage’s bottom scrim band</h2>
  <div class="lg-stage tb-stage" data-tone="dark"><div class="lg-stage__media" style="{bg(0)}"></div>
    <div class="lg-stage__top"><span class="lg-badge lg-glass lg-glass--media lg-glass--chip"><span class="lg-dot lg-dot--accent"></span>Frame 14 · Undecided</span></div>
    <div class="lg-stage__bottom">{media_toolbar()}</div>
  </div>
</section>
<section>
  <h2 class="d-h">For review: playback and a seek bar (a native range) in one group, zoom in another. Icon-only buttons show their name in a tooltip; a shortcut appears only when the app registers it (aria-keyshortcuts)</h2>
  <div class="lg-stage tb-review" data-tone="dark"><div class="lg-stage__media" style="{bg(8)}"></div><div class="lg-stage__bottom">{review_tb}</div></div>
</section>
<section class="d-frame tb-canvas">
  <h2 class="d-h" style="margin:0">On canvas: Undo + Redo, view (“Compare” on, “Adjust” disabled), Share + More — three groups, one glass background each</h2>
  {canvas_tb}
  {wrong}
  <h2 class="d-h" style="margin:6px 0 0">Composer: “Send” is enabled only while there is text; the ⌘K / Ctrl K hint appears because this composer registers the shortcut. Pending and error states come from Composer().setStatus()</h2>
  {composer(shortcut=True)}
  {composer('Match the white balance of Frames 12–18 to dusk', scope='@12–18', scope_label='Frames 12 to 18')}
</section>
</main>"""
write('Toolbar', page('<!-- @dsCard group="Navigation" height=1040 width=1040 subtitle="Grouped glass toolbars and the composer" -->', 'Toolbar — preview', body, TB_CSS))

# ======================================================================
# GlassPanel (inspector, menu, toast)
# ======================================================================
PANEL_CSS = """
  .pn-wrap { display: grid; grid-template-columns: 348px 1fr; gap: 28px; align-items: start; }
  .pn-aside { height: 860px; }
  .pn-side { display: grid; gap: 24px; align-content: start; }
  .pn-stack { display: flex; gap: 20px; flex-wrap: wrap; align-items: flex-start; }
  .pn-act { display: flex; gap: 10px; padding: 2px 4px; font-size: 12.5px; line-height: 18px; }
  .pn-act time { flex: none; width: 34px; color: var(--ink-muted); font: 11.5px/18px var(--font-mono); }
  .pn-act span { color: var(--ink-muted); }
  .pn-act b { color: var(--ink); font-weight: 600; }
  .pn-work { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border-radius: 14px; background: var(--fill); }
  .pn-work div { display: flex; align-items: baseline; gap: 8px; font-size: 13px; }
  .pn-work div span { flex: 1; min-width: 0; text-align: right; color: var(--ink-muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pn-toastbox { position: relative; height: 72px; border-radius: 18px; }
  .pn-anchor { position: relative; width: 300px; height: 396px; }
  .pn-anchor .lg-frame { position: absolute; left: 0; top: 0; width: 300px; aspect-ratio: 16 / 10; }
  .pn-anchor .pn-more { position: absolute; right: 8px; top: 8px; }
  .pn-anchor .lg-menu { position: absolute; right: -8px; top: 48px; }
  .pn-anchor .pn-under { position: absolute; left: 0; top: 200px; width: 300px; aspect-ratio: 16 / 10; }
"""
need_rows = ''.join(f"""<button class="lg-row" type="button"><span class="lg-row__thumb" style="{bg(i)}"></span><span class="lg-row__text"><span class="lg-row__title"><span>{t}</span></span><span class="lg-row__sub">{s}</span></span>{icon('right', cls='lg-row__chev')}</button>"""
                    for i, (t, s) in enumerate([('Frame 14 · Forest', '4 versions · Pick #2'), ('Frame 17 · Harbor', '3 versions · Pick #1'), ('Frame 21 · After Rain', '4 versions · Pick #2')]))
notes = ''.join(f"""<button class="lg-row" type="button" style="align-items:flex-start;padding:8px 10px"><span class="lg-pin lg-pin--sm{' lg-pin--done' if d else ''}">{n}</span><span class="lg-row__text"><span style="font-size:13px;line-height:19px"><b class="mono-label" style="margin-right:6px">#{sh}</b>{t}</span><span class="lg-row__sub" style="color:var({'--ink-muted' if d else '--accent-text'})">{st}</span></span></button>"""
                for n, sh, t, st, d in [(3, 21, 'Don’t brighten the sky further', 'Done', True), (2, 17, 'Keep the person at bottom right', 'Processing', False), (1, 14, 'Keep grain in the shadows', 'Done', True)])
notes14 = notes.split('</button>')[2] + '</button>'
acts = ''.join(f'<div class="pn-act"><time>{t}</time><span><b>{w}</b> {x}</span></div>' for t, w, x in [('2 min', 'Assistant', 'made 3 versions of Frame 17.'), ('6 min', 'Assistant', 'reworked Frame 21 per note 3.'), ('9 min', 'You', 'chose #1 for Frame 12.')])


def inspector(cls='pn-aside'):
    # two scopes, top to bottom: the selected frame (what the stage shows), then the whole project
    return f"""<aside class="lg-panel lg-glass lg-glass--flat {cls}" aria-label="Inspector">
  <div class="lg-panel__title"><span class="lg-navbar__scope">Selection</span><h2 class="title-3">Frame 14 · Forest</h2><p>Undecided · Pick #2 of 4 versions</p></div>
  <section class="lg-panel__section" aria-label="Notes on Frame 14">
    <div class="lg-panel__head"><h3>Notes on Frame 14</h3><span class="lg-panel__count">1</span></div>
    {notes14}
  </section>
  <div class="lg-panel__title"><span class="lg-navbar__scope">Project</span><h2 class="title-3">Island Light</h2></div>
  <div class="lg-panel__group">
    <div class="lg-panel__head"><h3>Needs Your Decision</h3><span class="lg-panel__count">3</span></div>
    {need_rows}
    <div class="lg-callout lg-callout--warn">
      <span class="lg-callout__eyebrow">Frame 9 · Curator Question</span>
      <p>Frame 9 is portrait only, but the wall needs landscape. Crop it to landscape, or use Frame 10 instead?</p>
      <div class="lg-callout__actions"><button class="lg-btn lg-btn--inverse lg-btn--sm" type="button">Crop to Landscape</button><button class="lg-btn lg-btn--tinted lg-btn--sm" type="button">Use Frame 10</button></div>
    </div>
  </div>
  <button class="lg-row" type="button" style="padding:10px 12px"><span class="lg-row__text"><span class="lg-row__title" style="font-size:14px;line-height:20px"><span>Library</span></span><span class="lg-row__sub" style="font-size:12.5px">4 scenes · where every photo comes from</span><span class="lg-row__sub" style="font-size:12.5px;color:var(--warn)">2 angles missing</span></span>{icon('right', cls='lg-row__chev')}</button>
  <section class="lg-panel__section">
    <div class="lg-panel__head"><h3>In Progress</h3></div>
    <div class="pn-work"><div><b>Frame 15 · Color Correction</b><span>2 / 5 · about 40 s</span></div><span class="lg-progress" style="--lg-value:44%"><span></span></span></div>
  </section>
  <section class="lg-panel__section">
    <div class="lg-panel__head"><h3>All Notes</h3><span class="lg-panel__count">3</span></div>
    {notes}
  </section>
  <section class="lg-panel__section">
    <div class="lg-panel__head"><h3>Activity</h3></div>
    {acts}
  </section>
</aside>"""


menu_list = f"""<div class="lg-menu lg-menu--sm lg-glass lg-glass--popover" role="menu" aria-label="Frame 14">
  <button class="lg-menu__item" type="button" role="menuitem">{icon('expand')}View Larger</button>
  <button class="lg-menu__item" type="button" role="menuitem" data-state="hover">{icon('swap')}Replace Image</button>
  <button class="lg-menu__item" type="button" role="menuitem" aria-disabled="true">{icon('stack')}Add to Wall 3</button>
  <div class="lg-menu__sep" role="separator"></div>
  <button class="lg-menu__item lg-menu__item--danger" type="button" role="menuitem">{icon('trash')}Remove from Show</button>
</div>"""
menu_confirm = """<div class="lg-menu lg-glass lg-glass--popover" role="dialog" aria-labelledby="mc-t" id="mc">
  <div class="lg-menu__confirm">
    <b id="mc-t">Remove Frame 14 from the show?</b>
    <p>It’s in the layout of 2 walls. If you remove it, the assistant will rearrange both walls with Frame 15.</p>
    <div><button class="lg-btn lg-btn--tinted" type="button" style="--lg-h:34px">Cancel</button><button class="lg-btn lg-btn--danger" type="button" style="--lg-h:34px">Remove</button></div>
  </div>
</div>"""
anchored = f"""<div class="pn-anchor">
  <div class="lg-frame" data-tone="dark" style="{bg(3)}"><button class="lg-btn lg-glass lg-glass--media lg-glass--chip lg-btn--icon lg-btn--sm pn-more" type="button" aria-label="More actions for Frame 14" aria-expanded="true" aria-controls="mc">{icon('more')}</button></div>
  <div class="lg-frame pn-under" style="{bg(9)}"></div>
  {menu_confirm}
</div>"""
queue = """<div class="lg-menu lg-glass lg-glass--popover" aria-label="Queue">
  <span class="lg-menu__label">Running and Queued</span>
  <div class="lg-menu__status"><span class="lg-dot lg-dot--accent lg-dot--pulse" style="width:8px;height:8px"></span><span><b style="font-size:13px">Frame 15 · Color Correction</b><small>2 / 5 · about 40 s</small></span></div>
  <div class="lg-menu__status"><span class="lg-dot" style="width:8px;height:8px"></span><span><b style="font-size:13px">Frame 22 · Add Angle</b><small>Queued</small></span></div>
</div>"""
body = f"""<main class="d lg-root">
<div class="pn-wrap">
  <section><h2 class="d-h">Inspector (sidebar): fixed on the canvas with nothing passing behind it, so it uses lg-glass--flat (no backdrop blur); 6px inset, group radius 22 concentric with the panel’s 28</h2>{inspector()}</section>
  <div class="pn-side">
    <section><h2 class="d-h">Menu: thick glass (glass-thick); icons are consistent within a group; a disabled item stays focusable but never runs; the destructive action is set apart by a separator. Arrow keys, Home, End and typing move between items</h2>
      <div class="pn-stack">{menu_list}{anchored}</div>
      <p class="d-cap" style="margin-top:10px">Right: grows out of the card’s “More” button and confirms inline instead of opening a dialog; the cards underneath stay clickable.</p>
    </section>
    <section><h2 class="d-h">Queue (status popover): group header in title-style capitalization</h2>{queue}</section>
    <section><h2 class="d-h">Toast: one line, dismisses itself, role="status"</h2>
      <div class="d-frame pn-toastbox"><div class="lg-toast lg-toast--contained lg-glass lg-glass--popover" role="status" style="top:20px">Added Frame 14 to the show.</div></div>
    </section>
  </div>
</div>
</main>"""
write('GlassPanel', page('<!-- @dsCard group="Overlays" height=990 width=1140 subtitle="Inspector, menu, inline confirmation, queue, toast" -->', 'GlassPanel — preview', body, PANEL_CSS))

# ======================================================================
# Modal (bottom sheet)
# ======================================================================
picks = ''.join(f"""<button class="md-pick" type="button"{' aria-pressed="true"' if i == 1 else ''}><span class="md-pick__img" style="{bg(i + 3)}"></span><b>{t}</b><span>{s}</span></button>"""
                for i, (t, s) in enumerate([('Harbor · Dawn', 'Library'), ('Harbor · Backlit', 'Test v2'), ('Harbor · Rain', 'Test v3'), ('Pier Lights', 'Library')]))


def sheet(mobile=False, live=False, expanded=False):
    tag, attrs = ('dialog', ' class="lg-modal" id="live-sheet" aria-labelledby="ls-t" data-lg="modal"') if live else ('div', f' class="lg-modal lg-modal--static" role="dialog" aria-modal="false" aria-labelledby="st-{int(mobile)}"{" data-expanded" if expanded else ""}')
    tid = 'ls-t' if live else f'st-{int(mobile)}'
    close = ' data-lg-close' if live else ''
    return f"""<{tag}{attrs}>
  <span class="lg-modal__grabber" aria-hidden="true"></span>
  <div class="lg-modal__header"><h2 class="lg-modal__title title-3" id="{tid}">Add an Angle to “Harbor”</h2><button class="lg-btn lg-btn--tinted lg-btn--icon lg-btn--sm" type="button" aria-label="Close"{close}>{icon('close')}</button></div>
  <div class="lg-modal__body">
    <input class="lg-input" type="text" placeholder="Name the angle, e.g. low from the water" aria-label="Angle name">
    <div class="lg-chips" style="margin:10px 0 18px"><button class="lg-chip" type="button">Back</button><button class="lg-chip" type="button">Low</button><button class="lg-chip" type="button" aria-pressed="true">Backlit</button><button class="lg-chip" type="button">Wide</button></div>
    {seg(['Use Existing', 'Ask the Assistant'], 0, label='Source', cls=' lg-segmented--lg', role='tablist')}
    <p class="label-sm" style="margin:18px 0 10px;color:var(--ink-muted)">From the Library</p>
    <div class="md-grid">{picks}</div>
  </div>
  <div class="lg-modal__footer"><span class="lg-modal__hint">Choosing this locks the angle; later versions will follow it.</span><button class="lg-btn lg-btn--accent" type="button"{close}>Use “Harbor · Backlit”</button></div>
</{tag}>"""


MODAL_CSS = """
  .md-desk { height: 640px; }
  .md-phone { width: 390px; height: 760px; border-radius: 40px; flex: none; }
  .md-under { position: absolute; inset: 0; padding: 80px 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; align-content: start; }
  .md-phone .md-under { grid-template-columns: 1fr 1fr; padding: 70px 16px; }
  .md-under span { aspect-ratio: 16 / 10; border-radius: 18px; }
  .md-scrim { position: absolute; inset: 0; background: var(--scrim); }
  .md-anchor { position: absolute; left: 0; right: 0; bottom: 16px; display: flex; justify-content: center; }
  .md-anchor .lg-modal { width: min(var(--sheet-width), calc(100% - 32px)); max-height: 560px; }
  /* the mobile frame shows a full-height sheet: it meets the frame's side and bottom edges (as the < 744px rule does on a phone) */
  .md-phone .md-anchor { bottom: 0; top: 48px; align-items: stretch; }
  .md-phone .md-anchor .lg-modal { width: 100%; max-height: none; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
  .md-phone .lg-modal__footer { flex-direction: column; align-items: stretch; }
  .md-phone .lg-modal__footer .lg-btn { width: 100%; }
  .md-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 14px 10px; }
  .md-pick { display: grid; gap: 6px; padding: 0; border: 0; background: transparent; color: var(--ink); text-align: left; font: inherit; cursor: pointer; }
  .md-pick__img { aspect-ratio: 16 / 10; border-radius: 12px; outline: 1px solid var(--line); outline-offset: 2px; }
  .md-pick[aria-pressed="true"] .md-pick__img { outline: 2px solid var(--lg-ring); }
  .md-pick b { font-size: 12.5px; line-height: 16px; font-weight: 600; }
  .md-pick span:last-child { color: var(--ink-muted); font-size: 11.5px; line-height: 14px; }
"""
under = ''.join(f'<span style="{bg(i)}"></span>' for i in range(8))
body = f"""<main class="d lg-root">
<div class="d-row" style="justify-content:space-between">
  <p class="d-cap">A half-height sheet is thick glass, inset from the screen edges so the content beneath shows around it; expanded to full height it turns opaque so people can focus on the task. The live demo uses a native &lt;dialog&gt;.</p>
  <span class="d-row" style="gap:8px"><button class="lg-btn lg-btn--tinted" type="button" data-lg-open="#live-center">Open Centered Dialog</button><button class="lg-btn lg-btn--accent" type="button" data-lg-open="#live-sheet">Open Live Demo</button></span>
</div>
<div class="d-row" style="align-items:flex-start;gap:24px;flex-wrap:nowrap">
  <section style="flex:1;min-width:0"><h2 class="d-h">Desktop: half height, thick glass (glass-thick)</h2><div class="d-frame md-desk"><div class="md-under">{under}</div><div class="md-scrim"></div><div class="md-anchor">{sheet()}</div></div></section>
  <section><h2 class="d-h">Mobile 390: expanded to full height (data-expanded): opaque surface, meets the screen edges</h2><div class="d-frame md-phone"><div class="md-under">{under}</div><div class="md-scrim"></div><div class="md-anchor">{sheet(mobile=True, expanded=True)}</div></div></section>
</div>
{sheet(live=True)}
<dialog class="lg-modal lg-modal--compact lg-modal--center" id="live-center" aria-labelledby="lc-t" data-lg="modal">
  <div class="lg-modal__header" style="padding-top:var(--space-20)"><h2 class="lg-modal__title title-3" id="lc-t">Replace the Locked Angle of “Harbor”?</h2></div>
  <div class="lg-modal__body"><p>Versions that follow the locked angle stay as they are. New versions use “Harbor · Backlit”.</p></div>
  <div class="lg-modal__footer"><span class="lg-spacer"></span><button class="lg-btn lg-btn--tinted" type="button" data-lg-close="cancel">Cancel</button><button class="lg-btn lg-btn--accent" type="button" data-lg-close="replace">Replace Angle</button></div>
</dialog>
</main>"""
write('Modal', page('<!-- @dsCard group="Overlays" height=940 width=1340 subtitle="Sheet: glass at half height, opaque at full height" -->', 'Modal — preview', body, MODAL_CSS))

# ======================================================================
# Patterns (page)
# ======================================================================
PAT_CSS = """
  .pt-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; align-items: start; }
  .pt-card { padding: 18px; display: grid; gap: 12px; align-content: start; }
  .pt-card h3 { margin: 0; font: 600 13px/18px var(--font-sans); }
  .pt-card .d-cap { margin-top: -6px; }
  .pt-on-glass { padding: 6px; border-radius: 28px; display: grid; gap: 4px; }
  .pt-frames { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .pt-frames .lg-frame { aspect-ratio: 16 / 10; }
  .pt-frames .lg-frame .lg-badge { position: absolute; left: 10px; top: 10px; }
  .pt-frames .lg-frame .lg-badge--accent { left: auto; right: 10px; box-shadow: var(--elevation-pin); }
  .pt-tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .pt-tiles > * { aspect-ratio: 16 / 10; }
  .pt-card .lg-stage__media[role="img"] { left: 50%; right: auto; width: 84px; transform: translateX(-50%); }
"""
rows3 = ''.join([
    f'<div class="lg-row" role="option" aria-selected="false" data-value="v1"><span class="lg-row__thumb lg-row__thumb--md" style="{bg(1)}"></span><span class="lg-row__text"><span class="lg-row__title"><span class="mono-label">#1</span></span><span class="lg-row__sub">The sky is blown out; the cloud detail is gone.</span></span></div>',
    f'<div class="lg-row" role="option" aria-selected="true" data-value="v2"><span class="lg-row__thumb lg-row__thumb--md" style="{bg(2)}"></span><span class="lg-row__text"><span class="lg-row__title"><span class="mono-label">#2</span><span class="lg-badge lg-badge--sm lg-badge--accent">Recommended</span></span><span class="lg-row__sub">Best tonal range; matches Frame 13.</span></span></div>',
    f'<div class="lg-row" role="option" aria-selected="false" data-value="v3" data-state="hover"><span class="lg-row__thumb lg-row__thumb--md" style="{bg(3)}"></span><span class="lg-row__text"><span class="lg-row__title"><span class="mono-label">#3</span><span class="lg-badge lg-badge--sm lg-badge--outline-warn">Flagged</span></span><span class="lg-row__sub">Flare at bottom left.</span></span></div>'])
# hard content (UI-49): long German, long Traditional Chinese, RTL, a portrait frame with corner marks
CORNERS = ("background-image:linear-gradient(135deg,#fff 0 10%,transparent 10%),linear-gradient(225deg,#fff 0 10%,transparent 10%),"
           "linear-gradient(45deg,#fff 0 10%,transparent 10%),linear-gradient(315deg,#fff 0 10%,transparent 10%),"
           "linear-gradient(90deg,#000 0 25%,#555 25% 50%,#aaa 50% 75%,#fff 75%)")
hard_rows = ''.join([
    '<div class="lg-row lg-row--static"><span class="lg-row__text"><span class="lg-row__title"><span>Farbabgleich der Abendaufnahmen am Hafen nach Rücksprache mit der Kuratorin überarbeiten</span></span><span class="lg-row__sub">Deutsch · long words wrap, the title clamps at two lines</span></span></div>',
    '<div class="lg-row lg-row--static" lang="zh-Hant"><span class="lg-row__text"><span class="lg-row__title"><span>依策展人回饋重新調整港口黃昏系列的白平衡與暗部顆粒，並保留右下角人物</span></span><span class="lg-row__sub">繁體中文 · 長標題兩行後截斷</span></span></div>',
    '<div class="lg-row lg-row--static" dir="rtl" lang="ar"><span class="lg-row__text"><span class="lg-row__title"><span>مطابقة توازن اللون الأبيض للإطارات من ١٢ إلى ١٨</span></span><span class="lg-row__sub">العربية · من اليمين إلى اليسار</span></span></div>'])
body = f"""<main class="d lg-root">
<div class="pt-grid">
  <section class="pt-card d-card"><h3>Rows (lg-row) in a list people choose from</h3><p class="d-cap">role="listbox" › role="option": rest · selected (aria-selected, accent-soft) · hover (fill). Arrow keys move and select (data-lg="list")</p><div class="lg-list pt-on-glass lg-glass lg-glass--flat" role="listbox" aria-label="Versions of Frame 14" data-lg="list">{rows3}</div></section>
  <section class="pt-card d-card"><h3>Badges and Status Dots</h3>
    <div class="d-row" style="gap:8px"><span class="lg-badge lg-badge--accent">Recommended</span><span class="lg-badge lg-badge--ok">Chosen</span><span class="lg-badge lg-badge--outline-warn">Flagged</span><span class="lg-badge lg-badge--count">2</span><span class="lg-badge lg-badge--sm lg-badge--count lg-badge--warn">3</span><span class="lg-badge lg-badge--mono">@12–18</span><span class="lg-badge">Draft</span></div>
    <div class="lg-legend footnote"><span><i class="lg-dot lg-dot--ok"></i>Chosen</span><span><i class="lg-dot lg-dot--accent"></i>Needs You</span><span><i class="lg-dot"></i>Processing</span><span><i class="lg-dot lg-dot--warn"></i>Has Question</span></div>
    <p class="d-cap" style="margin:0">Status is a shape plus text, never color alone: circle, rounded square, hollow ring, diamond.</p>
  </section>
  <section class="pt-card d-card"><h3>Callout</h3>
    <div class="lg-callout lg-callout--lg"><span class="lg-callout__eyebrow">Assistant’s Suggestion</span><b class="title-3" style="font-size:16px;letter-spacing:-.01em">Pick #2</b><p>Best tonal range, and its color temperature matches Frame 13, so it won’t jump out on the wall.</p></div>
    <div class="lg-callout lg-callout--warn"><span class="lg-callout__eyebrow">Frame 9 · Curator Question</span><p>Portrait only, but the wall needs landscape. Crop it, or use another?</p><div class="lg-callout__actions"><button class="lg-btn lg-btn--inverse lg-btn--sm" type="button">Crop to Landscape</button><button class="lg-btn lg-btn--tinted lg-btn--sm" type="button">Use Another</button></div></div>
  </section>
  <section class="pt-card d-card"><h3>Inputs and Chips</h3>
    <input class="lg-input" type="text" placeholder="Name the angle" aria-label="Angle name">
    <textarea class="lg-textarea" rows="2" placeholder="What should differ from the locked version?" aria-label="Notes"></textarea>
    <div class="lg-field"><label class="lg-field__label" for="f-name">Angle name</label><input id="f-name" class="lg-input" type="text" value="H" aria-invalid="true" aria-describedby="f-help f-err"><span id="f-help" class="lg-field__help">Shown on the wall label.</span><span id="f-err" class="lg-field__error">Use at least 2 characters.</span></div>
    <div class="lg-chips"><button class="lg-chip" type="button">Back</button><button class="lg-chip" type="button" aria-pressed="true">Backlit</button><button class="lg-chip" type="button">Wide</button></div>
  </section>
  <section class="pt-card d-card"><h3>Media Frames, Selection Rings and Plates</h3>
    <div class="pt-frames" data-tone="dark"><div class="lg-frame" style="{bg(5)}"><span class="lg-badge lg-plate">#1</span></div><div class="lg-frame is-selected" style="{bg(6)}"><span class="lg-badge lg-plate">#2</span><span class="lg-badge lg-badge--accent" style="top:auto;bottom:10px">Recommended</span></div></div>
    <p class="d-cap" style="margin:0">Media frames have no scrim, so numbers use lg-plate (a translucent backing with no blur). Selection is a two-tone inset ring plus a check mark; the outline stays free for keyboard focus.</p>
  </section>
  <section class="pt-card d-card"><h3>Progress, Pins, Add Tiles, Waiting</h3>
    <span class="lg-progress" style="--lg-value:62%"><span></span></span>
    <div class="d-row" style="gap:10px"><span class="lg-pin">2</span><span class="lg-pin lg-pin--sm">3</span><span class="lg-pin lg-pin--sm lg-pin--done">1</span><span class="lg-stage" data-tone="dark" style="width:56px;height:56px;border-radius:16px;display:grid;place-items:center"><span class="lg-spinner" style="width:22px;height:22px"></span></span></div>
    <div class="pt-tiles"><button class="lg-add-tile" type="button">{icon('plus', 20)}Add Angle</button><div class="lg-frame" style="{bg(9)}"></div></div>
  </section>
  <section class="pt-card d-card"><h3>Hard Content</h3><p class="d-cap">Test material with long words, CJK, RTL and a portrait test chart (contain: all four corners stay visible)</p>
    <div class="lg-list">{hard_rows}</div>
    <div class="lg-stage" data-tone="dark" style="height:150px"><div class="lg-stage__media" style="{CORNERS};background-size:auto 100%;background-repeat:no-repeat" role="img" aria-label="Portrait test chart with white corner marks"></div></div>
  </section>
</div>
</main>"""
write('Patterns', page('<!-- @dsCard group="Showcase" height=1180 width=1100 page subtitle="The small parts components are built from: rows, badges, callouts, inputs, media frames" -->', 'Patterns — preview', body, PAT_CSS))

# ======================================================================
# Materials (page)
# ======================================================================
MAT_CSS = """
  .mt-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .mt-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .mt-box { height: 190px; }
  .mt-tag { position: absolute; right: 12px; bottom: 12px; z-index: 50; }
  .mt-chiprow { position: absolute; left: 16px; right: 16px; top: 16px; display: flex; gap: 6px; }
  .mt-media { height: 190px; border-radius: 20px; }
  .mt-island { position: absolute; left: 20px; top: 14px; height: 42px; padding: 0 16px; display: flex; align-items: center; gap: 10px; border-radius: 999px; font-size: 13px; line-height: 18px; z-index: 40; }
  .mt-island .lg-muted { white-space: nowrap; }
  .nv-cards { position: absolute; left: 20px; right: 20px; top: 10px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .nv-card { display: grid; gap: 4px; font-size: 13px; line-height: 18px; }
  .nv-card b { font-weight: 600; } .nv-card span { color: var(--ink-muted); font-size: 12px; }
  .nv-thumb { aspect-ratio: 16 / 10; border-radius: 18px; }
  .mt-ladder { height: 160px; border-radius: 20px; display: grid; place-items: center; }
  .mt-ladder .lg-glass { height: 42px; padding: 0 18px; display: flex; align-items: center; border-radius: 999px; font: 600 13px/18px var(--font-sans); }
  .lg-glass.mt-opaque { background-color: var(--surface); -webkit-backdrop-filter: none; backdrop-filter: none; }
  .mt-menuover { height: 230px; }
  .mt-menuover .lg-menu { position: absolute; left: 24px; top: 24px; z-index: 5; }
  .mt-white { position: absolute; inset: 0; background: linear-gradient(90deg, #ffffff 0 50%, #0a0a0c 50% 100%); }
  .mt-ext { position: relative; height: 300px; border-radius: 20px; overflow: hidden; isolation: isolate; background: var(--canvas); box-shadow: inset 0 0 0 1px var(--line); }
  .mt-ext .mt-hero { position: absolute; left: 240px; right: 0; top: 0; bottom: 0; background-size: cover; background-position: 0% 50%; }
  .mt-ext .lg-extend { right: auto; width: 240px; }
  .mt-ext .lg-panel { position: absolute; left: 10px; top: 10px; bottom: 10px; width: 220px; z-index: 2; gap: 4px; }
  .mt-ext .lg-menu__item { min-height: 36px; }
"""
cards_light = ''.join(f'<div class="nv-card"><div class="nv-thumb" style="{bg(i)}"></div><b>Frame {i + 11}</b><span>Forest · 2026.03</span></div>' for i in range(4))
side_items = ''.join(f'<a class="lg-menu__item" href="#"{" aria-current=&quot;page&quot;" if i == 0 else ""}>{icon(ic)}{t}</a>'.replace('&quot;', '"') for i, (ic, t) in enumerate([('home', 'Overview'), ('image', 'Work'), ('stack', 'Shows'), ('clock', 'Activity')]))
HERO = art(4)
body = f"""<main class="d lg-root">
<section>
  <h2 class="d-h">1 · Content scrolling under glass: left, no scroll edge, so secondary text on the island is lost over bright thumbnails; right, with lg-scroll-edge, still ≥ 4.5:1 in the worst case</h2>
  <div class="mt-2">
    <div class="d-frame mt-box"><div class="nv-cards">{cards_light}</div><div class="mt-island lg-glass"><b>Island Light</b><span class="lg-muted">Picks · 18 / 48 selected</span></div><span class="lg-badge mt-tag" style="background:var(--danger-fill);color:var(--on-danger)">Don’t</span></div>
    <div class="d-frame mt-box" data-scrolled><div class="nv-cards">{cards_light}</div><div class="lg-scroll-edge lg-scroll-edge--contained" data-on></div><div class="mt-island lg-glass"><b>Island Light</b><span class="lg-muted">Picks · 18 / 48 selected</span></div><span class="lg-badge lg-badge--ok mt-tag">Do</span></div>
  </div>
</section>
<section>
  <h2 class="d-h">2 · A menu over arbitrary content: left, regular glass (0.5), nearly unreadable over white; right, thick glass (glass-thick), ≥ 4.5:1 over white and black</h2>
  <div class="mt-2">
    <div class="d-frame mt-menuover"><div class="mt-white"></div><div class="lg-menu lg-menu--sm lg-glass" style="--lg-shadow:var(--specular),var(--elevation-menu);background-color:var(--glass)"><span class="lg-menu__label">Frame 14</span><button class="lg-menu__item" type="button">{icon('expand')}View Larger</button><button class="lg-menu__item lg-menu__item--danger" type="button">{icon('trash')}Remove from Show</button></div><span class="lg-badge mt-tag" style="background:var(--danger-fill);color:var(--on-danger)">Don’t</span></div>
    <div class="d-frame mt-menuover"><div class="mt-white"></div><div class="lg-menu lg-menu--sm lg-glass lg-glass--popover"><span class="lg-menu__label">Frame 14</span><button class="lg-menu__item" type="button">{icon('expand')}View Larger</button><button class="lg-menu__item lg-menu__item--danger" type="button">{icon('trash')}Remove from Show</button></div><span class="lg-badge lg-badge--ok mt-tag">Do</span></div>
  </div>
</section>
<section>
  <h2 class="d-h">3 · Glass on the stage: left, scrims off (lg-stage--no-scrim); right, scrim bands (full strength over the top 64px and bottom 88px, at most a quarter of a short stage each). A band appears only where controls are (.lg-stage__top / __bottom or data-scrim); captions mid-frame use lg-plate</h2>
  <div class="mt-2">
    <div class="lg-stage lg-stage--no-scrim mt-media" data-tone="dark"><div class="lg-stage__media" style="{BRIGHT}"></div><div class="mt-chiprow"><span class="lg-badge lg-glass lg-glass--media lg-glass--chip">Frame 14</span><span class="lg-badge lg-glass lg-glass--media lg-glass--chip" style="font-weight:400;color:var(--ink-on-media-muted)">Forest · Undecided</span></div><span class="lg-badge mt-tag" style="background:var(--danger-fill);color:var(--on-danger)">Don’t</span></div>
    <div class="lg-stage mt-media" data-tone="dark" data-scrim="both"><div class="lg-stage__media" style="{BRIGHT}"></div><div class="mt-chiprow"><span class="lg-badge lg-glass lg-glass--media lg-glass--chip">Frame 14</span><span class="lg-badge lg-glass lg-glass--media lg-glass--chip" style="font-weight:400;color:var(--ink-on-media-muted)">Forest · Undecided</span></div><span class="lg-badge lg-plate" style="position:absolute;left:44%;top:46%">Don’t brighten the sky further</span><span class="lg-badge lg-badge--ok mt-tag">Do</span></div>
  </div>
</section>
<section>
  <h2 class="d-h">4 · Background extension: left, the sidebar floats over empty canvas; right, lg-extend mirrors and blurs the adjacent hero image beneath the sidebar, which uses thick glass</h2>
  <div class="mt-2">
    <div class="mt-ext"><div class="mt-hero" style="background-image:{HERO}"></div><nav class="lg-panel lg-glass lg-glass--thick" aria-label="Site">{side_items}</nav><span class="lg-badge mt-tag" style="background:var(--danger-fill);color:var(--on-danger)">Don’t</span></div>
    <div class="mt-ext"><div class="lg-extend" style="--lg-extend-image:{HERO}"></div><div class="mt-hero" style="background-image:{HERO}"></div><nav class="lg-panel lg-glass lg-glass--thick" aria-label="Site (extended)">{side_items}</nav><span class="lg-badge lg-badge--ok mt-tag">Do</span></div>
  </div>
</section>
<section>
  <h2 class="d-h">5 · Glass strength: Restrained (default, blur 18 · saturation 170%) and Stronger (data-glass="strong", blur 32 · saturation 210%)</h2>
  <div class="mt-2">
    <div class="lg-stage lg-stage--no-scrim mt-ladder" data-tone="dark"><div class="lg-stage__media" style="{bg(4)}"></div><div class="lg-glass">Restrained</div></div>
    <div class="lg-stage lg-stage--no-scrim mt-ladder" data-tone="dark"><div class="lg-stage__media" style="{bg(4)}"></div><div class="lg-glass" style="--lg-blur:var(--blur-glass-strong);--lg-sat:var(--glass-saturate-strong)">Stronger</div></div>
  </div>
</section>
<section>
  <h2 class="d-h">6 · Fallback ladder: the same island at three levels of browser support</h2>
  <div class="mt-3">
    <div class="lg-stage lg-stage--no-scrim mt-ladder" data-tone="dark"><div class="lg-stage__media" style="{bg(2)}"></div><div class="lg-glass" data-refract>Rung 2: Refraction + Blur (Chromium)</div></div>
    <div class="lg-stage lg-stage--no-scrim mt-ladder" data-tone="dark"><div class="lg-stage__media" style="{bg(2)}"></div><div class="lg-glass">Rung 1: Blur + Highlight</div></div>
    <div class="lg-stage lg-stage--no-scrim mt-ladder" data-tone="dark"><div class="lg-stage__media" style="{bg(2)}"></div><div class="lg-glass mt-opaque">Rung 0: Opaque Surface</div></div>
  </div>
</section>
</main>"""
write('Materials', page('<!-- @dsCard group="Showcase" height=1630 width=1240 page subtitle="Scroll edge, thick glass, stage scrims, background extension, strength and fallbacks" -->', 'Materials — preview', body, MAT_CSS, "LiquidGlass.init(document);"))

# ======================================================================
# ShowcaseDesktop (1440 × 900 app workspace)
# ======================================================================
STATUS = {'lg-dot--ok': 'Chosen', 'lg-dot--accent': 'Needs You', '': 'Processing', 'lg-dot--warn': 'Has Question'}


def clip(i, d, label_id=True):
    cur = ' aria-current="true"' if i == 3 else ''
    idl = f'<span class="sc-clip__id" aria-hidden="true">{i + 11}</span>' if label_id else ''
    return (f'<button class="sc-clip lg-frame" type="button" style="{bg(i)}" aria-label="Frame {i + 11}, {STATUS[d]}"{cur}>'
            f'{idl}<span class="lg-dot lg-dot--ring {d}" aria-hidden="true"></span></button>')


contact = ''.join(clip(i, d) for i, d in enumerate(['lg-dot--ok', 'lg-dot--ok', 'lg-dot--accent', 'lg-dot--accent', 'lg-dot--ok', 'lg-dot--accent', '', 'lg-dot--warn', 'lg-dot--ok', '']))
SC_CSS = """
  body { overflow: hidden; }
  .sc { position: relative; width: 1440px; height: 900px; display: flex; overflow: hidden; background: var(--canvas); }
  .sc-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 10px; padding: 68px 0 12px 10px; }
  .sc-stage { flex: 1; min-height: 0; }
  .sc-stage .lg-stage__bottom { bottom: 18px; }
  .sc-pin { position: absolute; left: 46%; top: 44%; display: flex; gap: 6px; align-items: flex-start; transform: translate(-2px, -28px); }
  .sc-pin .lg-plate { max-width: 230px; padding: 6px 11px; border-radius: 12px; font-size: 12.5px; line-height: 17px; }
  .sc-pin .lg-plate i { display: block; font-style: normal; font-size: 11px; color: var(--ink-on-media-muted); }
  .sc-dock { flex: none; padding: 10px 14px 12px; border-radius: 24px; display: flex; flex-direction: column; gap: 8px; background: var(--surface); box-shadow: inset 0 0 0 1px var(--line); }
  .sc-dock__head { display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--ink-muted); }
  .sc-dock__head b { color: var(--ink); font-size: 13px; font-weight: 600; }
  .sc-strip { display: flex; gap: 3px; height: 62px; }
  .sc-clip { flex: 1 1 0; min-width: 0; padding: 0; border: 0; border-radius: 10px; cursor: pointer; background-size: cover; background-position: 50% 50%; }
  .sc-clip__id { position: absolute; left: 5px; bottom: 5px; padding: 1px 7px; border-radius: 7px; background: rgba(0,0,0,.55); color: #fff; font: 600 11px/16px var(--font-mono); }
  .sc-clip .lg-dot { position: absolute; left: 6px; top: 6px; width: 8px; height: 8px; }
  .sc-clip .sc-clip__id, .sc-clip .lg-dot { z-index: 5; }
  .sc-bottom { flex: none; display: flex; justify-content: center; }
  .sc-aside { flex: none; width: 348px; padding: 68px 12px 12px 10px; display: flex; }
  .sc-aside .lg-panel { flex: 1; }
""" + PANEL_CSS.split('.pn-toastbox')[0]
body = f"""<div class="sc lg-root">
{navbar('sc-menu')}
<main class="sc-main">
  <div class="lg-stage sc-stage" data-tone="dark" aria-label="Stage">
    <div class="lg-stage__media" style="{bg(3)}"></div>
    <div class="lg-stage__top"><span class="lg-badge lg-glass lg-glass--media lg-glass--chip" style="min-height:28px;padding:0 12px">Frame 14 · Forest<span class="lg-dot lg-dot--accent" style="margin-left:6px"></span><span style="font-weight:400">Undecided · Pick #2</span></span></div>
    <div class="sc-pin"><span class="lg-pin lg-pin--done">3</span><span class="lg-plate">Don’t brighten the sky further<i>Done</i></span></div>
    <div class="lg-stage__bottom">{media_toolbar(first=('play', 'Slideshow (Space)'), readout='14<small> / 48</small>')}</div>
  </div>
  <section class="sc-dock" aria-label="Contact Sheet">
    <div class="sc-dock__head"><b>Contact Sheet</b><span>48 frames · 18 selected</span><span class="lg-spacer"></span><span class="lg-legend"><span><i class="lg-dot lg-dot--ok"></i>Chosen</span><span><i class="lg-dot lg-dot--accent"></i>Needs You</span><span><i class="lg-dot"></i>Processing</span><span><i class="lg-dot lg-dot--warn"></i>Has Question</span></span></div>
    <div class="sc-strip">{contact}</div>
  </section>
  <div class="sc-bottom">{composer(flat=True, shortcut=True)}</div>
</main>
<div class="sc-aside">{inspector('')}</div>
</div>"""
write('ShowcaseDesktop', page('<!-- @dsCard group="Showcase" height=900 width=1440 page subtitle="1440: nav islands, stage, contact sheet, composer, inspector" -->', 'ShowcaseDesktop — preview', body, SC_CSS))

# ======================================================================
# ShowcaseMobile (three 390 × 844 frames)
# ======================================================================
SM_CSS = SC_CSS.replace('body { overflow: hidden; }', '') + """
  .sm { display: flex; gap: 32px; padding: 24px; align-items: flex-start; }
  .sm figure { margin: 0; display: grid; gap: 10px; }
  .sm figcaption { color: var(--ink-muted); font-size: 12px; line-height: 16px; max-width: 390px; }
  .ph { position: relative; overflow: hidden; isolation: isolate; width: 390px; height: 844px; border-radius: 48px; background: var(--canvas); box-shadow: inset 0 0 0 1px var(--line); }
  .ph-main { position: absolute; inset: 0; display: flex; flex-direction: column; gap: 8px; padding: 60px 8px 72px; }
  .ph-stage { flex: 1; min-height: 0; border-radius: 28px; }
  .ph-stage .lg-stage__bottom { left: 8px; right: 8px; bottom: 12px; }
  .ph-stage .lg-toolbar { width: 100%; justify-content: space-between; }
  .ph-stage .lg-toolbar__group { flex: none; }
  .ph-more { position: absolute; right: 12px; top: 12px; z-index: 3; }
  .ph-strip { display: flex; gap: 3px; height: 54px; padding: 8px; border-radius: 22px; background: var(--surface); box-shadow: inset 0 0 0 1px var(--line); }
  .ph-strip .sc-clip { flex: 1 1 0; }
  .ph .lg-composer { width: 100%; }
  .ph .lg-composer .lg-composer__hint { display: none; }
  .ph-scrim { position: absolute; inset: 0; background: var(--scrim); z-index: 50; }
  .ph-sheet { position: absolute; left: 8px; right: 8px; bottom: 8px; z-index: 51; }
  .ph-sheet .lg-modal { width: 100%; max-height: 560px; }
  .ph-menu { position: absolute; right: 14px; top: 122px; z-index: 52; }
  .ph-menu .lg-menu { width: 300px; }
"""
ph_tb = f"""<div class="lg-toolbar" role="toolbar" aria-label="View" data-lg="toolbar">
  <div class="lg-toolbar__group lg-glass lg-glass--media lg-glass--elevated">
    <button class="lg-btn lg-btn--media lg-btn--icon" type="button" aria-label="Previous">{icon('left')}</button>
    <span class="lg-toolbar__text">14<small> / 48</small></span>
    <button class="lg-btn lg-btn--media lg-btn--icon" type="button" aria-label="Next">{icon('right')}</button>
  </div>
  <button class="lg-btn lg-btn--accent" type="button">Use #2</button>
</div>"""
strip_m = ''.join(clip(i, d, label_id=False) for i, d in enumerate(['lg-dot--ok', 'lg-dot--ok', 'lg-dot--accent', 'lg-dot--accent', 'lg-dot--ok', 'lg-dot--accent']))


def ph_frame(extra='', stage_i=3, more_expanded=False, menu_id='ph-mc'):
    exp = f' aria-expanded="true" aria-controls="{menu_id}"' if more_expanded else ' aria-expanded="false"'
    return f"""<div class="ph" data-density="comfortable">
  <div class="ph-main">
    <div class="lg-stage ph-stage" data-tone="dark"><div class="lg-stage__media" style="{bg(stage_i)}"></div>
      <div class="lg-stage__top" style="left:12px;top:12px;right:60px"><span class="lg-badge lg-glass lg-glass--media lg-glass--chip"><span class="lg-dot lg-dot--accent"></span>Frame 14 · Pick #2</span></div>
      <button class="lg-btn lg-glass lg-glass--media lg-glass--chip lg-btn--icon ph-more" type="button" aria-label="More actions for Frame 14"{exp}>{icon('more')}</button>
      <div class="lg-stage__bottom">{ph_tb}</div>
    </div>
    <div class="ph-strip">{strip_m}</div>
    {composer(ph='Ask the assistant…', flat=True)}
  </div>
  {navbar('ph-menu-' + str(stage_i))}
  {tabbar(TABS_APP, 0, search=False)}
  {extra}
</div>"""


need_sheet = f"""<div class="ph-scrim"></div><div class="ph-sheet"><div class="lg-modal lg-modal--static" role="dialog" aria-labelledby="ph-st">
  <span class="lg-modal__grabber" aria-hidden="true"></span>
  <div class="lg-modal__header"><h2 class="lg-modal__title title-3" id="ph-st">Needs Your Decision</h2><button class="lg-btn lg-btn--tinted lg-btn--icon lg-btn--sm" type="button" aria-label="Close">{icon('close')}</button></div>
  <div class="lg-modal__body">{need_rows}
    <div class="lg-callout lg-callout--warn" style="margin-top:8px"><span class="lg-callout__eyebrow">Frame 9 · Curator Question</span><p>Portrait only, but the wall needs landscape. Crop it, or use another?</p><div class="lg-callout__actions"><button class="lg-btn lg-btn--inverse lg-btn--sm" type="button">Crop to Landscape</button><button class="lg-btn lg-btn--tinted lg-btn--sm" type="button">Use Frame 10</button></div></div>
  </div>
</div></div>"""
confirm_menu = f'<div class="ph-menu">{menu_confirm.replace("id=\"mc\"", "id=\"ph-mc\"").replace("mc-t", "ph-mc-t")}</div>'
body = f"""<main class="sm lg-root">
<figure><figcaption>① Viewing: only brand and menu at the top (the menu holds the project scope: Picks, Sources, Export, Queue); the frame-switching controls share one glass group and “Use” stands alone; the composer talks to the assistant, it is not search. Comfortable density</figcaption>{ph_frame()}</figure>
<figure><figcaption>② The inspector becomes a half-height sheet: thick glass, inset from the edges, with the stage showing beneath</figcaption>{ph_frame(need_sheet, stage_i=5)}</figure>
<figure><figcaption>③ The menu grows out of the “More” button at the stage’s top right and confirms inline; the rest of the stage stays usable</figcaption>{ph_frame(confirm_menu, stage_i=8, more_expanded=True)}</figure>
</main>"""
write('ShowcaseMobile', page('<!-- @dsCard group="Showcase" height=950 width=1330 page subtitle="390: tab bar, grouped stage toolbar, half-height sheet, inline confirmation" -->', 'ShowcaseMobile — preview', body, SM_CSS))
# ======================================================================
# AppShell (fluid reference: one page from 320px to 1920px)
# ======================================================================
# Desktop → mobile mapping (UI-02), the same markup at every width:
#   main destinations  : navbar links (≥ 744) → tab bar (< 744)
#   search             : tools island (≥ 744) → tab bar search circle (< 744)
#   project + areas    : in-page project header, always visible (name, Picks / Sources tabs, pending count)
#   export, queue      : header buttons + tools island (≥ 744) → project actions menu in the header (< 744)
#   contact sheet      : aside column (≥ 744) → horizontal dock that scrolls on its own (< 744)
#   inspector          : right column (≥ 1100) → below the stage (744–1099) → after the content (< 744)
AS_CSS = """
  .as-head { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-8) var(--space-12); }
  .as-head__name { display: flex; flex-direction: column; min-width: 0; flex: 1 1 200px; }
  .as-head__name h1 { margin: 0; overflow-wrap: anywhere; }
  .as-head__name p { margin: 0; color: var(--ink-muted); font: var(--type-caption); }
  .as-head__actions { display: flex; gap: var(--space-8); align-items: center; position: relative; }
  .as-stage { aspect-ratio: 3 / 2; max-height: min(62dvh, 640px); width: 100%; }
  .as-stage .lg-stage__bottom { left: var(--space-8); right: var(--space-8); bottom: var(--space-12); }
  .as-stage .lg-toolbar { flex-wrap: wrap; justify-content: center; row-gap: var(--space-8); white-space: normal; }
  .as-clips { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-6); }
  .as-clips .sc-clip { flex: none; width: 100%; aspect-ratio: 16 / 10; height: auto; }
  .as-panel { display: flex; flex-direction: column; gap: var(--space-12); }
  .as-panel[hidden] { display: none; }
  .as-sources { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--space-10); }
  .as-actions-menu { position: absolute; right: 0; top: calc(100% + var(--space-8)); z-index: var(--z-menu); }
  .lg-app__inspector .lg-panel { overflow: visible; }
  @container lg-app-body (max-width: 743px) {
    .as-clips { display: flex; }
    .as-clips .sc-clip { width: 96px; }
    .as-head__actions .as-wide { display: none; }
  }
  @container lg-app-body (min-width: 744px) { .as-head__actions .as-narrow { display: none; } }
  /* narrow stages: the toolbar wraps, so the stage grows to keep it clear of the top label */
  @container lg-app-body (max-width: 479px) { .as-stage { aspect-ratio: auto; min-height: 320px; } }
"""
as_clips = ''.join(clip(i, d) for i, d in enumerate(['lg-dot--ok', 'lg-dot--ok', 'lg-dot--accent', 'lg-dot--accent', 'lg-dot--ok', 'lg-dot--accent', '', 'lg-dot--warn']))
as_sources = ''.join(f'<div class="lg-frame" style="{bg(i + 4)};aspect-ratio:16/10" role="img" aria-label="Source {n}"></div>' for i, n in enumerate(['Harbor · Dawn', 'Harbor · Backlit', 'Pier Lights']))
as_nav = f"""<header class="lg-navbar" data-lg="navbar">
  <div class="lg-scroll-edge" aria-hidden="true"></div>
  <div class="lg-navbar__row">
    <div class="lg-navbar__island lg-glass">{BRAND}<span class="lg-nav-desktop">{nav_links(NAV_DEST)}</span></div>
    <span class="lg-navbar__spacer"></span>
    <div class="lg-navbar__island lg-navbar__island--tight lg-glass">
      <button class="lg-btn lg-btn--plain lg-btn--icon lg-nav-desktop" type="button" aria-label="Search" data-tooltip data-task="search">{icon('search')}</button>
      <button class="lg-btn lg-btn--plain lg-nav-desktop" type="button" aria-label="Queue, 2 running" data-tooltip="Queue" data-task="queue" style="--lg-px:8px">{icon('list')}<span class="lg-badge lg-badge--sm lg-badge--count" aria-hidden="true">2</span></button>
      <button class="lg-btn lg-btn--plain lg-btn--icon lg-navbar__menu-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="as-menu">{icon('menu')}</button>
    </div>
  </div>
  <div class="lg-navbar__menu lg-menu lg-glass lg-glass--popover" id="as-menu" hidden>
    <a class="lg-menu__item" href="#">{icon('clock')}Activity</a><a class="lg-menu__item" href="#">{icon('gear')}Settings</a>
  </div>
</header>"""
as_head = f"""<div class="as-head" data-task="project">
  <div class="as-head__name"><span class="lg-navbar__scope">Project</span><h1 class="title-2">Island Light</h1><p>18 / 48 selected · Shows / Island Light</p></div>
  {seg(['Picks', 'Sources'], 0, label='Project area', role='tablist', badge=(1, 3), values=['picks', 'sources'], controls=['as-picks', 'as-sources'], tasks=['picks', 'sources'])}
  <div class="as-head__actions">
    <button class="lg-btn lg-btn--tinted as-wide" type="button" data-task="export" aria-label="Export Island Light">{icon('share')}Export</button>
    <button class="lg-btn lg-btn--tinted lg-btn--icon as-narrow" type="button" aria-label="Project actions" aria-controls="as-actions" data-task="project-actions" data-tooltip>{icon('more')}</button>
    <div class="lg-menu lg-menu--sm lg-glass lg-glass--popover as-actions-menu" id="as-actions" role="menu" aria-label="Project actions" hidden data-lg="panel">
      <button class="lg-menu__item" type="button" role="menuitem" data-task="export">{icon('share')}Export “Island Light”</button>
      <button class="lg-menu__item" type="button" role="menuitem" data-task="queue">{icon('list')}Queue · 2 Running</button>
    </div>
  </div>
</div>"""
body = f"""<div class="lg-app lg-root">
{as_nav}
<div class="lg-app__body"><div class="lg-app__grid">
  <aside class="lg-app__aside" aria-label="Contact Sheet">
    <div class="lg-panel__head"><h2 class="label">Contact Sheet</h2><span class="lg-panel__count">48</span></div>
    <div class="lg-app__dock as-clips">{as_clips}</div>
  </aside>
  <main class="lg-app__main">
    {as_head}
    <section class="as-panel" id="as-picks" role="tabpanel" aria-labelledby="as-picks-tab">
      <div class="lg-stage as-stage" data-tone="dark"><div class="lg-stage__media" style="{bg(3)}"></div>
        <div class="lg-stage__top"><span class="lg-badge lg-glass lg-glass--media lg-glass--chip"><span class="lg-dot lg-dot--accent" aria-hidden="true"></span>Frame 14 · Undecided</span></div>
        <div class="lg-stage__bottom">{media_toolbar(first=('play', 'Slideshow'), readout='14<small> / 48</small>', action='Review 4 Candidates')}</div>
      </div>
      {composer(flat=True, shortcut=True)}
    </section>
    <section class="as-panel" id="as-sources" role="tabpanel" aria-labelledby="as-sources-tab" hidden>
      <p class="callout" style="margin:0">3 sources need a decision.</p>
      <div class="as-sources">{as_sources}</div>
    </section>
  </main>
  <div class="lg-app__inspector">{inspector('')}</div>
</div></div>
{tabbar(TABS_APP, 0, search=True).replace('lg-tabbar lg-tabbar--contained', 'lg-tabbar').replace('class="lg-tabbar__search lg-glass"', 'class="lg-tabbar__search lg-glass" data-task="search"')}
</div>"""
# the contact-sheet clips and inspector parts reuse the showcase styles
AS_CSS += '\n'.join(l for l in SC_CSS.splitlines() if l.strip().startswith(('.sc-clip', '.pn-')))
write('AppShell', page('<!-- @dsCard group="Showcase" height=900 width=1440 page subtitle="Fluid reference app: one layout from 320px to 1920px, every task kept" -->', 'AppShell — preview', body, AS_CSS, viewport=True))

print('previews v3 written')
