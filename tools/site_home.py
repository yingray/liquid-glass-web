"""Home page of the demo site (tools/site.py): the "Demo Landing" design from Claude Design, direction Immersive.

The design uses the React adapter (window.LiquidGlassUI). This page writes the same markup by hand, as each
component README documents, and binds it with LiquidGlass.init(), so the site stays framework-free.
The look comes from ?theme= and ?density=, like the card pages; the page keeps them in the URL when they change.
"""
import html, json, os, re

from previews_head import art

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C = os.path.join(ROOT, 'design-system', 'components')
REPO = 'https://github.com/yingray/liquid-glass-web'
THEMES = [('auto', 'Auto'), ('dark', 'Dark'), ('light', 'Light'), ('dark-solid', 'Dark Solid'), ('light-solid', 'Light Solid'),
          ('dark-contrast', 'Dark Contrast'), ('light-contrast', 'Light Contrast')]
DENSITIES = [('auto', 'Auto'), ('compact', 'Compact'), ('comfortable', 'Comfortable')]
DISCLAIMER = ('An independent project. It is not affiliated with or endorsed by Apple Inc. '
              '"Liquid Glass" names Apple\'s design language; this system applies Apple\'s public guidance to the web.')
PRINCIPLES = [('C1', 'Content first, material shows the control layer'), ('C2', 'Build hierarchy from task and scope'),
              ('C3', 'Responsive layouts keep the task'), ('C4', 'Look, semantics, data and behavior agree'),
              ('C5', 'Legibility and operability hold for real content and real users'),
              ('C6', 'The design system delivers verifiable contracts')]
# The same numbers as the README; change both together.
STATS = [('1019', 'Contrast pairs checked'), ('82', 'Interaction tests'), ('99', 'Behaviour contracts'), ('143', 'Tokens and 20 type roles')]
DOCS = [('Principles', 'design-system/0-principles.md'), ('Brand Book', 'design-system/README.md'),
        ('Accessibility', 'design-system/3-accessibility.md'), ('Apple Alignment', 'design-system/5-apple-alignment.md'),
        ('Contributing', 'CONTRIBUTING.md')]
SHOWCASE = [('ShowcaseDesktop', 'Desktop · 1440', 'Nav islands, stage, contact sheet, composer, inspector'),
            ('ShowcaseMobile', 'Mobile · 390', 'Tab bar, grouped stage toolbar, half-height sheet, inline confirmation')]
ORDER = ['Showcase', 'Controls', 'Navigation', 'Overlays']

HTML_CODE = '''<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="components/bundle.css">
<script src="components/bundle.js"></script>
<script>LiquidGlass.applyTheme();</script>

<script>
  addEventListener("DOMContentLoaded", () => LiquidGlass.init());
</script>'''
REACT_CODE = '''const { LiquidGlassRoot, AppShell, FloatingNavbar, GlassButton } = window.LiquidGlassUI;

<LiquidGlassRoot theme="dark" style={{ minHeight: '100vh' }}>
  <AppShell
    navbar={<FloatingNavbar brand={<span>Lumen</span>} links={['Studio', 'Library', 'Shows']}
      action={<GlassButton variant="glass">Export</GlassButton>} />}>
    …
  </AppShell>
</LiquidGlassRoot>'''

ICONS = {
    'prev': '<path d="M10 3 5 8l5 5"/>',
    'next': '<path d="M6 3l5 5-5 5"/>',
    'heart': '<path d="M8 13.5S2 10 2 5.8A3 3 0 0 1 8 4.2a3 3 0 0 1 6 1.6C14 10 8 13.5 8 13.5z"/>',
    'info': '<circle cx="8" cy="8" r="6"/><path d="M8 7.5v3.5M8 5h.01"/>',
}
MENU_ICON = ('<svg class="lg-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" '
             'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 5h11M2.5 11h11"/></svg>')
CHEVRON = ('<svg class="lg-row__chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" '
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5"/></svg>')

CSS = '''
  html { scroll-behavior: smooth; }
  @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
  body { margin: 0; background: var(--canvas); color: var(--ink); font: var(--type-body); }
  a { color: var(--accent-text); }
  .lp-skip { position: absolute; left: var(--space-16); top: var(--space-16); z-index: 100; }
  .lp-skip:not(:focus) { clip-path: inset(50%); width: 1px; height: 1px; overflow: hidden; }
  .lp-gutter { box-sizing: border-box; padding-left: max(var(--space-16), env(safe-area-inset-left)); padding-right: max(var(--space-16), env(safe-area-inset-right)); }
  @media (min-width: 744px) { .lp-gutter { padding-left: max(var(--space-24), env(safe-area-inset-left)); padding-right: max(var(--space-24), env(safe-area-inset-right)); } }

  .lp-hero { position: relative; min-height: max(640px, 100vh); min-height: max(640px, 100svh); display: grid; align-items: end; background: var(--stage); color: var(--ink); overflow: hidden; }
  .lp-hero__media, .lp-art { position: absolute; inset: 0; background-size: cover; background-position: center; }
  .lp-hero__fade { position: absolute; inset: auto 0 0 0; height: 70%; background: linear-gradient(to top, color-mix(in oklch, var(--stage) 92%, transparent), transparent); pointer-events: none; }
  .lp-hero__row { position: relative; width: 100%; max-width: 1200px; margin: 0 auto; padding-bottom: max(var(--space-64), env(safe-area-inset-bottom));
    display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: var(--space-36); }
  .lp-hero__copy { display: grid; gap: var(--space-20); max-width: 720px; }
  .lp-hero__copy > .lg-badge { justify-self: start; }
  .lp-hero h1 { margin: 0; font: var(--type-display-1); text-wrap: balance; }
  @media (max-width: 743px) { .lp-hero h1 { font: var(--type-display-1-sm); } }
  .lp-lead { margin: 0; font: var(--type-lead); color: var(--ink-muted); max-width: 56ch; text-wrap: pretty; }
  .lp-actions { display: flex; flex-wrap: wrap; gap: var(--space-12); }
  .lp-try { display: grid; gap: var(--space-8); }
  .lp-label { font: var(--type-label-sm); color: var(--ink-muted); }

  .lp-main { max-width: 1200px; margin: 0 auto; padding-top: var(--space-64); padding-bottom: max(var(--space-48), env(safe-area-inset-bottom)); display: grid; gap: var(--space-96); }
  .lp-main > section { scroll-margin-top: var(--space-96); display: grid; gap: var(--space-24); min-width: 0; }
  .lp-head { display: grid; gap: var(--space-8); }
  .lp-head h2 { margin: 0; font: var(--type-title-1); }
  .lp-head p { margin: 0; color: var(--ink-muted); max-width: 64ch; text-wrap: pretty; }
  .lp-box { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-16); align-content: start; min-width: 0; padding: var(--space-24); border-radius: var(--radius-xl); background: var(--surface); box-shadow: inset 0 0 0 1px var(--line); }
  @media (max-width: 743px) { .lp-box { padding: var(--space-16); } }
  .lp-row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-8) var(--space-16); }
  .lp-row > .lp-label { min-width: 72px; }
  .lp-wrap { display: flex; flex-wrap: wrap; gap: var(--space-12); align-items: center; }
  .lp-wrap--tight { gap: var(--space-8); }

  .lp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr)); gap: var(--space-16); }
  .lp-full { grid-column: 1 / -1; }
  @media (min-width: 760px) { .lp-span2 { grid-column: span 2; } }
  .lp-stage { position: relative; min-height: 360px; border-radius: var(--radius-xl); overflow: hidden; background: var(--stage); }
  .lp-stage__tag { position: absolute; top: var(--space-16); left: var(--space-16); }
  .lp-stage__bar { position: absolute; left: var(--space-8); right: var(--space-8); bottom: var(--space-16); display: flex; justify-content: center; }
  .lp-grid > .lg-panel { min-width: 0; }

  .lp-shots { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 460px), 1fr)); gap: var(--space-16); }
  .lp-shot { display: grid; gap: var(--space-12); min-width: 0; }
  .lp-shot__frame { position: relative; border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-inset); box-shadow: inset 0 0 0 1px var(--line); }
  .lp-shot__frame iframe { position: absolute; top: 0; left: 0; border: 0; transform-origin: 0 0; pointer-events: none; }
  .lp-shot__meta { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--space-8); }
  .lp-shot__meta div { display: grid; gap: var(--space-2); }
  .lp-shot__meta b { font: var(--type-headline); }
  .lp-shot__meta span { font: var(--type-footnote); color: var(--ink-muted); }

  .lp-principles { list-style: none; margin: 0; padding: 0; }
  .lp-principles li span:first-child { font: var(--type-mono); color: var(--accent-text); }
  .lp-principles li span:last-child { font: var(--type-title-3); text-wrap: balance; }

  .lp-code { padding: var(--space-20); }
  .lp-code__bar { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--space-12); }
  .lp-code pre { margin: 0; padding: var(--space-20); border-radius: var(--radius-lg); background: var(--surface-inset); font: var(--type-mono); overflow: auto; white-space: pre; }
  @media (max-width: 743px) { .lp-code { padding: var(--space-12); } .lp-code pre { padding: var(--space-16); font: var(--type-mono-sm); } }

  .lp-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr)); gap: var(--space-16); }
  .lp-stats .lp-box { gap: var(--space-4); }
  .lp-stats b { font: var(--type-title-1); font-family: var(--font-mono); }
  .lp-stats span { font: var(--type-callout); color: var(--ink-muted); }
  .lp-note { margin: 0; font: var(--type-footnote); color: var(--ink-muted); max-width: 72ch; }

  .lp-cards { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-12); grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); }
  .lp-card { display: grid; gap: var(--space-4); min-height: 44px; padding: var(--space-16); border-radius: var(--radius-lg); background: var(--surface);
    box-shadow: inset 0 0 0 1px var(--line); color: inherit; text-decoration: none; }
  @media (hover: hover) { .lp-card:hover { box-shadow: inset 0 0 0 1px var(--border-strong); } }
  .lp-card b { font: var(--type-headline); }
  .lp-card span { color: var(--ink-muted); font: var(--type-callout); }
  .lp-card i { color: var(--ink-muted); font: var(--type-footnote); font-style: normal; }
  .lp-cards-group { display: grid; gap: var(--space-12); }
  .lp-cards-group h3 { margin: 0; font: var(--type-title-3); }

  .lp-links { display: flex; flex-wrap: wrap; gap: var(--space-8); }
  .lp-links a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 var(--space-12); border-radius: var(--radius-capsule);
    background: var(--fill); color: var(--ink); text-decoration: none; font: var(--type-label); }
  @media (hover: hover) { .lp-links a:hover { background: var(--fill-strong); } }
  .lp-links a:focus-visible, .lp-card:focus-visible { outline: var(--focus-width) solid var(--focus); outline-offset: var(--focus-gap); }
  .lp-main > section#guidelines { gap: var(--space-16); }
  .lp-main > section#guidelines h2 { margin: 0; font: var(--type-title-3); }
  footer.lp-foot { display: grid; gap: var(--space-8); padding-top: var(--space-16); box-shadow: inset 0 1px 0 var(--line); }
'''


def e(s):
    return html.escape(s, quote=True)


def icon(name):
    return ('<svg class="lg-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{ICONS[name]}</svg>')


def icon_btn(name, label):
    return f'<button class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="{label}" data-tooltip="">{icon(name)}</button>'


def segmented(label, items, index, cls='', attrs=''):
    """A radio group: items are (label, value). The controller moves the thumb and fires lg:change."""
    btns = ''.join(f'<button class="lg-segmented__item" type="button" role="radio" data-value="{v}" aria-checked="{str(i == index).lower()}">{e(t)}</button>'
                   for i, (t, v) in enumerate(items))
    return (f'<div class="lg-segmented{cls}" role="radiogroup" aria-label="{label}" data-lg="segmented"{attrs}>'
            f'{btns}<span class="lg-segmented__thumb" aria-hidden="true"></span></div>')


def row(title, sub, chevron=False, current=False):
    cur = ' aria-current="true"' if current else ''
    return (f'<button class="lg-row" type="button"{cur}><span class="lg-row__text"><span class="lg-row__title"><span>{e(title)}</span></span>'
            f'<span class="lg-row__sub">{e(sub)}</span></span>{CHEVRON if chevron else ""}</button>')


def panel_head(title, count):
    return f'<div class="lg-panel__head"><h3>{e(title)}</h3><span class="lg-panel__count">{count}</span></div>'


def canvas_size(name):
    first = open(os.path.join(C, name, 'preview.html'), encoding='utf-8').readline()
    w, h = re.search(r'width=(\d+)', first), re.search(r'height=(\d+)', first)
    return int(w.group(1)) if w else 1440, int(h.group(1)) if h else 900


def card_index(cards, size, ext):
    groups = {}
    for g, d, s in cards:
        groups.setdefault(g, []).append((d, s))
    out = ''
    for g, items in sorted(groups.items(), key=lambda kv: (ORDER.index(kv[0]) if kv[0] in ORDER else len(ORDER), kv[0])):
        out += (f'<div class="lp-cards-group"><h3>{e(g)}</h3><ul class="lp-cards">' +
                ''.join(f'<li><a class="lp-card" data-look-link href="cards/{d}{ext}"><b>{d}</b><span>{e(s)}</span><i>{size(d)}</i></a></li>' for d, s in items) +
                '</ul></div>')
    return out


def home_page(build_static, runtime, version, cards, size):
    ext = '.html' if build_static else ''
    v = version
    nav_links = [('Components', '#components'), ('Showcase', '#showcase'), ('Principles', '#principles'), ('Get Started', '#start')]
    navbar = f'''<header class="lg-navbar" data-lg="navbar">
  <div class="lg-scroll-edge" aria-hidden="true"></div>
  <div class="lg-navbar__row">
    <div class="lg-navbar__island lg-glass" data-refract>
      <a class="lg-navbar__brand lg-focusable" href="#top" aria-label="Liquid Glass Web home"><span>Liquid Glass Web</span></a>
      <span class="lg-nav-desktop"><nav class="lg-segmented" aria-label="Sections">{''.join(f'<a class="lg-segmented__item lg-navbar__link" href="{h}">{t}</a>' for t, h in nav_links)}</nav></span>
    </div>
    <a class="lg-btn lg-glass lg-btn--nav lg-nav-desktop" href="{REPO}">View on GitHub</a>
    <span class="lg-navbar__spacer"></span>
    <div class="lg-navbar__island lg-navbar__island--tight lg-glass lg-nav-mobile" data-refract>
      <button class="lg-btn lg-btn--plain lg-btn--icon lg-navbar__menu-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="site-menu">{MENU_ICON}</button>
    </div>
  </div>
  <nav class="lg-navbar__menu lg-menu lg-glass lg-glass--popover" id="site-menu" aria-label="Sections" hidden>
    {''.join(f'<a class="lg-menu__item" href="{h}">{t}</a>' for t, h in nav_links)}<div class="lg-menu__sep" role="separator"></div><a class="lg-menu__item" href="{REPO}">View on GitHub</a>
  </nav>
</header>'''

    hero = f'''<div data-tone="dark" class="lg-root">
<section class="lp-hero" data-surface-tone="dark" aria-labelledby="hero-title">
  <div class="lp-hero__media" style="background-image:{art(3)}" role="img" aria-label="Soft teal and blue light field"></div>
  <div class="lp-hero__fade"></div>
  <div class="lp-hero__row lp-gutter">
    <div class="lp-hero__copy">
      <span class="lg-badge lg-glass lg-glass--media lg-glass--chip">Version {e(v)} · MIT</span>
      <h1 id="hero-title">Glass for the controls. Content stays clear.</h1>
      <p class="lp-lead">A framework-free design system that applies Apple's Liquid Glass guidance to responsive websites. One stylesheet, one small script, tokens in JSON.</p>
      <div class="lp-actions">
        <a class="lg-btn lg-btn--accent lg-btn--lg" href="#start">Get Started</a>
        <a class="lg-btn lg-glass lg-glass--thick lg-btn--lg" href="#components">Browse Components</a>
      </div>
    </div>
    <div class="lp-try">
      <span class="lp-label" id="try-theme">Try the theme</span>
      {segmented('Theme', [('Dark', 'dark'), ('Light', 'light'), ('Auto', 'auto')], 0, ' lg-segmented--media', ' id="hero-theme"')}
    </div>
  </div>
</section>
</div>'''

    chips = ''.join(f'<button class="lg-chip" type="button" data-theme-pick="{tv}" aria-pressed="false">{e(t)}</button>' for tv, t in THEMES)
    look = f'''<section id="look" aria-labelledby="look-title">
  <div class="lp-head"><h2 id="look-title">Six themes, two densities</h2>
    <p>Pick a look and the whole page follows: navigation, controls and the live showcases below. Auto follows your system settings for light or dark, Increase Contrast and Reduce Transparency.</p></div>
  <div class="lp-box">
    <div class="lp-row"><span class="lp-label" id="l-theme">Theme</span><div class="lg-chips" role="group" aria-labelledby="l-theme">{chips}</div></div>
    <div class="lp-row"><span class="lp-label">Density</span>{segmented('Density', [(t, dv) for dv, t in DENSITIES], 0, '', ' id="density"')}</div>
  </div>
</section>'''

    compare = [('Single', 'single'), ('Side by Side', 'side'), ('Grid', 'grid')]
    components = f'''<section id="components" aria-labelledby="components-title">
  <div class="lp-head"><h2 id="components-title">Real components, live</h2>
    <p>Every control below works: drag the segmented thumb, toggle the chips, type in the composer.</p></div>
  <div class="lp-grid">
    <div class="lp-box lp-full">
      <span class="lp-label">GlassButton · one accent per task</span>
      <div class="lp-wrap">
        <button class="lg-btn lg-btn--accent" type="button">Review Picks</button>
        <button class="lg-btn lg-btn--inverse" type="button">Keep Both</button>
        <button class="lg-btn lg-btn--tinted" type="button">Cancel</button>
        <button class="lg-btn lg-btn--outline" type="button" aria-pressed="false" data-lg="button">Compare</button>
        <button class="lg-btn lg-glass" type="button">Export</button>
        <button class="lg-btn lg-btn--danger" type="button">Remove from Show</button>
      </div>
    </div>
    <div class="lp-box">
      <span class="lp-label">SegmentedControl · drag the thumb</span>
      {segmented('Compare view', compare, 2, ' lg-segmented--lg')}
    </div>
    <div class="lp-box">
      <span class="lp-label" id="l-chips">Chip · inverted when on</span>
      <div class="lg-chips" role="group" aria-labelledby="l-chips">{''.join(f'<button class="lg-chip" type="button" data-chip aria-pressed="{str(t == "Backlit").lower()}">{t}</button>' for t in ('Back', 'Backlit', 'Wide', 'Portrait'))}</div>
    </div>
    <div class="lp-box">
      <span class="lp-label">Badge · status is never color alone</span>
      <div class="lp-wrap lp-wrap--tight">
        <span class="lg-badge lg-badge--accent">Recommended</span>
        <span class="lg-badge lg-badge--ok">Chosen</span>
        <span class="lg-badge lg-badge--outline-warn">Flagged</span>
        <span class="lg-badge lg-badge--mono">@12–18</span>
        <span class="lg-badge lg-badge--count lg-badge--warn" aria-hidden="true">3</span><span class="lg-sr-only">3 pending</span>
      </div>
    </div>
    <div class="lp-stage lp-full" data-tone="dark" data-surface-tone="dark">
      <div class="lp-art" style="background-image:{art(4)}" role="img" aria-label="Soft violet light field"></div>
      <div class="lp-stage__tag"><span class="lg-badge lg-glass lg-glass--media lg-glass--chip">Toolbar on a Stage</span></div>
      <div class="lp-stage__bar">
        <div class="lg-toolbar" role="toolbar" aria-label="Playback" data-lg="toolbar">
          <div class="lg-toolbar__group lg-glass lg-glass--media lg-glass--elevated">{icon_btn('prev', 'Previous Frame')}{icon_btn('next', 'Next Frame')}</div>
          <div class="lg-toolbar__group lg-glass lg-glass--media lg-glass--elevated">{icon_btn('heart', 'Favorite')}{icon_btn('info', 'Show Info')}</div>
        </div>
      </div>
    </div>
    <div class="lg-panel lg-glass lg-glass--flat" aria-label="Inspector" role="region">
      <div class="lg-panel__group">{panel_head('Needs Your Decision', 2)}{row('Frame 14 · Forest', '4 versions · Pick #2', True)}{row('Frame 22 · Harbor', '2 versions · Undecided', True)}</div>
      <section class="lg-panel__section">{panel_head('Shows', 2)}{row('Island Light', '18 / 48 selected', current=True)}{row('Harbor Mornings', 'Draft')}</section>
    </div>
    <div class="lp-box lp-span2">
      <span class="lp-label">Composer · instructions for the assistant</span>
      <form class="lg-composer lg-glass" aria-label="Instructions for the assistant" data-lg="composer" data-shortcut="k" id="composer">
        <span class="lg-dot lg-dot--lg lg-dot--accent" aria-hidden="true"></span>
        <span class="lg-badge lg-badge--mono"><span class="lg-sr-only">Scope: All frames, </span><span aria-hidden="true">@all</span></span>
        <input class="lg-composer__input" type="text" placeholder="Warm the shadows on every frame…" aria-label="Instructions for the assistant">
        <span class="lg-composer__hint" aria-hidden="true"></span>
        <span class="lg-composer__status" role="status"></span>
        <button class="lg-btn lg-btn--accent" type="submit" disabled>Send</button>
      </form>
    </div>
  </div>
</section>'''

    shots = ''
    for name, title, sub in SHOWCASE:
        w, h = canvas_size(name)
        shots += f'''<div class="lp-shot">
      <div class="lp-shot__frame" style="aspect-ratio:{w} / {h}" data-shot-w="{w}">
        <iframe data-look-src="cards/{name}{ext}" src="cards/{name}{ext}?theme=dark&amp;density=auto" title="{e(title)}" loading="lazy" tabindex="-1" aria-hidden="true" style="width:{w}px;height:{h}px;transform:scale(.4)"></iframe>
      </div>
      <div class="lp-shot__meta"><div><b>{e(title)}</b><span>{e(sub)}</span></div>
        <a class="lg-btn lg-btn--tinted lg-btn--sm" data-look-link href="cards/{name}{ext}" aria-label="Open {e(title)} full size">Open Full Size</a></div>
    </div>'''
    showcase = f'''<section id="showcase" aria-labelledby="showcase-title">
  <div class="lp-head"><h2 id="showcase-title">Drawn at 1440 and 390</h2>
    <p>The reference screens, loaded live in the look that you picked above.</p></div>
  <div class="lp-shots">{shots}</div>
</section>'''

    principles = f'''<section id="principles" aria-labelledby="principles-title">
  <div class="lp-head"><h2 id="principles-title">Six core principles</h2><p>Every component and check traces back to one of these.</p></div>
  <ol class="lp-grid lp-principles">{''.join(f'<li class="lp-box"><span>{i}</span><span>{e(t)}</span></li>' for i, t in PRINCIPLES)}</ol>
</section>'''

    tabs = [('HTML', 'code-html', HTML_CODE), ('React', 'code-react', REACT_CODE)]
    tab_btns = ''.join(f'<button class="lg-segmented__item" type="button" role="tab" id="{pid}-tab" aria-selected="{str(i == 0).lower()}" aria-controls="{pid}">{t}</button>'
                       for i, (t, pid, _) in enumerate(tabs))
    panels = ''.join(f'<pre id="{pid}" role="tabpanel" aria-labelledby="{pid}-tab" tabindex="0"{"" if i == 0 else " hidden"}>{e(code)}</pre>'
                     for i, (_, pid, code) in enumerate(tabs))
    start = f'''<section id="start" aria-labelledby="start-title">
  <div class="lp-head"><h2 id="start-title">Get started</h2>
    <p>Load the tokens, the stylesheet and the script, then initialize once the DOM is ready. Before you remove an enhanced subtree, call LiquidGlass.destroy(root).</p></div>
  <div class="lp-box lp-code">
    <div class="lp-code__bar">
      <div class="lg-segmented" role="tablist" aria-label="Code language" data-lg="segmented" id="code-tabs">{tab_btns}<span class="lg-segmented__thumb" aria-hidden="true"></span></div>
      <button class="lg-btn lg-btn--tinted lg-btn--sm" type="button" id="copy">Copy Code</button>
    </div>
    {panels}
  </div>
</section>'''

    checks = f'''<section id="checks" aria-labelledby="checks-title">
  <div class="lp-head"><h2 id="checks-title">Checked on every push</h2>
    <p>CI runs every check in headless Chromium and fails when a generated file drifts from its sources.</p></div>
  <div class="lp-stats">{''.join(f'<div class="lp-box"><b>{n}</b><span>{e(t)}</span></div>' for n, t in STATS)}</div>
  <p class="lp-note">Checks on real devices and with screen readers are still pending.</p>
</section>'''

    every = f'''<section id="cards" aria-labelledby="cards-title">
  <div class="lp-head"><h2 id="cards-title">Every card</h2>
    <p>Each card opens in the look that you picked. AppShell is the fluid layout reference; the other cards are fixed canvases, so a phone opens them zoomed out.</p></div>
  {card_index(cards, size, ext)}
</section>'''

    doc_links = ''.join(f'<a href="{REPO}/blob/main/{p}">{t}</a>' for t, p in DOCS) + f'<a href="{REPO}">Source on GitHub</a>'
    guidelines = f'<section id="guidelines" aria-labelledby="g-docs"><h2 id="g-docs">Guidelines</h2><nav class="lp-links" aria-labelledby="g-docs">{doc_links}</nav></section>'

    config = json.dumps({'themes': [t for t, _ in THEMES], 'densities': [d for d, _ in DENSITIES]})
    script = '''<script>(function () {
  var CFG = %s, LG = window.LiquidGlass;
  var q = new URLSearchParams(location.search);
  var look = { theme: CFG.themes.indexOf(q.get("theme")) >= 0 ? q.get("theme") : "dark",
               density: CFG.densities.indexOf(q.get("density")) >= 0 ? q.get("density") : "auto" };
  var ctrls = LG.init(document);
  function ctrl(el) { for (var i = 0; i < ctrls.length; i++) if (ctrls[i] && ctrls[i].element === el) return ctrls[i]; return null; }
  var hero = document.getElementById("hero-theme"), dens = document.getElementById("density");
  var HERO = ["dark", "light", "auto"];

  function apply(push) {
    var t = look.theme, base = t === "auto" ? "auto" : t.split("-")[0], mode = t.split("-")[1] || "";
    LG.applyTheme(t === "auto" ? { scheme: "auto", transparency: "auto", contrast: "auto", density: look.density }
      : { scheme: base, transparency: mode === "solid" ? "reduce" : "full", contrast: mode === "contrast" ? "more" : "standard", density: look.density });
    var qs = "?theme=" + t + "&density=" + look.density;
    if (push) history.replaceState(null, "", qs + location.hash);
    document.querySelectorAll("[data-theme-pick]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-pick") === t)); });
    var h = ctrl(hero); if (h) h.select(HERO.indexOf(base), { emit: false });
    var d = ctrl(dens); if (d) d.select(CFG.densities.indexOf(look.density), { emit: false });
    document.querySelectorAll("[data-look-link]").forEach(function (a) { a.href = a.getAttribute("href").split("?")[0] + qs; });
    document.querySelectorAll("iframe[data-look-src]").forEach(function (f) {
      var src = f.getAttribute("data-look-src") + qs;
      if (f.getAttribute("src") !== src) f.setAttribute("src", src);
    });
  }
  hero.addEventListener("lg:change", function (ev) { var v = HERO[ev.detail.index]; if (v) { look.theme = v; apply(true); } });
  dens.addEventListener("lg:change", function (ev) { var v = CFG.densities[ev.detail.index]; if (v) { look.density = v; apply(true); } });
  document.querySelectorAll("[data-theme-pick]").forEach(function (b) {
    b.addEventListener("click", function () { look.theme = b.getAttribute("data-theme-pick"); apply(true); });
  });
  document.querySelectorAll("[data-chip]").forEach(function (b) {
    b.addEventListener("click", function () { b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); });
  });

  // Fit each fixed canvas to the width of its frame.
  var frames = document.querySelectorAll("[data-shot-w]");
  function fit() { frames.forEach(function (fr) { var f = fr.querySelector("iframe"); f.style.transform = "scale(" + fr.clientWidth / Number(fr.getAttribute("data-shot-w")) + ")"; }); }
  if (window.ResizeObserver) { var ro = new ResizeObserver(fit); frames.forEach(function (fr) { ro.observe(fr); }); } else addEventListener("resize", fit);
  fit();

  var copy = document.getElementById("copy"), tabs = document.getElementById("code-tabs");
  function shown() { return document.querySelector("#start pre:not([hidden])"); }
  copy.addEventListener("click", function () {
    var text = shown().textContent;
    function done(ok) { copy.textContent = ok ? "Copied" : "Copy Failed"; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    else done(false);
  });
  tabs.addEventListener("lg:change", function () { copy.textContent = "Copy Code"; });

  document.getElementById("composer").addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (LG.toast) LG.toast("This is a demo. Nothing was sent.");
  });

  apply(false);
})();</script>''' % config

    return f'''<!doctype html>
<html data-theme="dark" lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Liquid Glass Web</title>
<meta name="description" content="A framework-free design system that applies Apple's Liquid Glass guidance to responsive websites.">
{runtime}
<style>{CSS}</style>
</head>
<body class="lg-root">
<a class="lg-btn lg-btn--accent lp-skip" href="#main">Skip to Content</a>
{navbar}
<div id="top"></div>
{hero}
<main class="lp-main lp-gutter" id="main" tabindex="-1">
{look}
{components}
{showcase}
{principles}
{start}
{checks}
{every}
{guidelines}
<footer class="lp-foot"><p class="lp-note">{e(DISCLAIMER)}</p><p class="lp-note">MIT License.</p></footer>
</main>
{script}
</body>
</html>
'''
