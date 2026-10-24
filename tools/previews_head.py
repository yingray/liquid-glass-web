import os as _os
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
DS = _os.path.join(ROOT, 'design-system')
CACHE = _os.path.join(ROOT, 'tools', '.cache')
# Generates design-system/components/<Comp>/preview.html (run tools/previews.py)
import os
OUT = _os.path.join(DS, 'components')

# ---------- icons: 16-unit grid, 1.6 stroke, round caps ----------
IC = {
    'play': ('<path d="M4.5 2.8v10.4L13 8z" fill="currentColor" stroke="none"/>', 1.6),
    'pause': ('<path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" stroke="none"/>', 1.6),
    'left': ('<path d="M10 3.5 5.5 8l4.5 4.5"/>', 1.6),
    'right': ('<path d="M6 3.5 10.5 8 6 12.5"/>', 1.6),
    'menu': ('<path d="M2.5 5h11M2.5 11h11"/>', 1.6),
    'close': ('<path d="M4 4l8 8M12 4l-8 8"/>', 1.8),
    'plus': ('<path d="M8 3v10M3 8h10"/>', 1.6),
    'search': ('<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/>', 1.6),
    'more': ('<circle cx="3" cy="8" r="1.4" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none"/><circle cx="13" cy="8" r="1.4" fill="currentColor" stroke="none"/>', 1.6),
    'pin': ('<path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 0 0-9 0c0 3.8 4.5 8 4.5 8z"/><circle cx="8" cy="6.5" r="1.5"/>', 1.5),
    'check': ('<path d="M3.5 8.5l3 3 6-7"/>', 2),
    'share': ('<path d="M8 2v8M5 4.8 8 2l3 2.8M3.5 8v4.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8"/>', 1.6),
    'list': ('<path d="M3 4h10M3 8h10M3 12h6"/>', 1.5),
    'grid': ('<rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/>', 1.5),
    'expand': ('<path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9"/>', 1.6),
    'undo': ('<path d="M5.5 3.5 2.5 6.5l3 3"/><path d="M2.5 6.5h7a4 4 0 0 1 0 8h-2"/>', 1.6),
    'redo': ('<path d="M10.5 3.5l3 3-3 3"/><path d="M13.5 6.5h-7a4 4 0 0 0 0 8h2"/>', 1.6),
    'compare': ('<rect x="2" y="3" width="12" height="10" rx="2"/><path d="M8 3v10"/>', 1.5),
    'sliders': ('<path d="M2.5 5h6M11.5 5h2M2.5 11h2M7.5 11h6"/><circle cx="10" cy="5" r="1.5"/><circle cx="6" cy="11" r="1.5"/>', 1.5),
    'home': ('<path d="M2.5 7.5 8 3l5.5 4.5V13a.5.5 0 0 1-.5.5H10V10H6v3.5H3a.5.5 0 0 1-.5-.5z"/>', 1.5),
    'image': ('<rect x="2" y="3" width="12" height="10" rx="2"/><circle cx="6" cy="6.5" r="1.2"/><path d="M2.5 11.5 6 8.5l3 2.5 2-1.5 2.5 2"/>', 1.5),
    'clock': ('<circle cx="8" cy="8" r="5.5"/><path d="M8 5v3.2l2 1.3"/>', 1.5),
    'folder': ('<path d="M2 5a1 1 0 0 1 1-1h3l1.5 1.5H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>', 1.5),
    'gear': ('<circle cx="8" cy="8" r="2"/><path d="M8 1.8v1.7M8 12.5v1.7M1.8 8h1.7M12.5 8h1.7M3.6 3.6l1.2 1.2M11.2 11.2l1.2 1.2M3.6 12.4l1.2-1.2M11.2 4.8l1.2-1.2"/>', 1.5),
    'trash': ('<path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5"/>', 1.5),
    'swap': ('<path d="M3 5.5h9l-2.5-2.5M13 10.5H4l2.5 2.5"/>', 1.5),
    'stack': ('<path d="M8 2.5 14 5.5 8 8.5 2 5.5z"/><path d="M2 8.5l6 3 6-3"/>', 1.5),
    'heart': ('<path d="M8 13.5S2.5 10.2 2.5 6.3A2.8 2.8 0 0 1 8 5a2.8 2.8 0 0 1 5.5 1.3C13.5 10.2 8 13.5 8 13.5z"/>', 1.5),
}


def icon(n, size=None, cls='lg-icon'):
    body, sw = IC[n]
    style = f' style="width:{size}px;height:{size}px"' if size else ''
    return (f'<svg class="{cls}"{style} viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="{sw}" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{body}</svg>')


# a neutral placeholder mark (not any real brand): a lens ring and a dot
MARK = ('<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">'
        '<circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.8"/>'
        '<circle cx="12.6" cy="7.4" r="2.6" fill="currentColor"/></svg>')
BRAND = f'<a class="lg-navbar__brand lg-focusable" href="#" aria-label="Lumen home">{MARK}<span>Lumen</span></a>'

# ---------- placeholder imagery: soft light fields (illustration only, not part of the system) ----------
SCENES = [(220, 38), (28, 52), (300, 44), (175, 40), (250, 60), (12, 30), (140, 46), (330, 36), (200, 58), (45, 42), (265, 34), (95, 48)]


def art(i):
    h, x = SCENES[i % len(SCENES)]
    h2, h3 = (h + 40) % 360, (h + 200) % 360
    return (f"radial-gradient(34% 46% at {x}% 40%, hsl({h} 70% 78% / .92) 0%, transparent 70%), "
            f"radial-gradient(52% 60% at {100 - x // 2}% 74%, hsl({h2} 55% 42%) 0%, transparent 72%), "
            f"radial-gradient(24% 26% at {86 - x // 3}% 20%, hsl({h3} 60% 86% / .55) 0%, transparent 70%), "
            f"linear-gradient(165deg, hsl({h} 35% 26%) 0%, hsl({h2} 30% 9%) 100%)")


def bg(i):
    return f'background-image:{art(i)}'


BRIGHT = ("background-image:radial-gradient(40% 60% at 70% 70%, hsl(28 70% 60% / .8) 0%, transparent 70%), "
          "linear-gradient(180deg, #fbf8f2 0%, #efe9df 45%, #b9ad9c 80%, #6d6257 100%)")


BASE_CSS = """
  html, body { margin: 0; }
  body { background: var(--canvas); }
  .d { box-sizing: border-box; padding: 24px; display: grid; gap: 32px; }
  .d-h { margin: 0 0 12px; color: var(--ink-muted); font-size: 12px; line-height: 16px; }
  .d-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
  .d-frame { position: relative; overflow: hidden; isolation: isolate; border-radius: 20px; background: var(--canvas); box-shadow: inset 0 0 0 1px var(--line); }
  .d-cap { margin: 0; color: var(--ink-muted); font-size: 12px; line-height: 16px; }
  .d-page { position: absolute; inset: 0; overflow: hidden; }
  .d-card { border-radius: 18px; background: var(--surface); box-shadow: inset 0 0 0 1px var(--line); }
"""


def page(marker, title, body, css='', script='LiquidGlass.init(document);', lang='en'):
    return f"""{marker}
<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<title>{title}</title>
<style>{BASE_CSS}{css}</style>
</head>
<body>
{body}
<script>
{script}
</script>
</body>
</html>
"""


def write(comp, html):
    d = os.path.join(OUT, comp)
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'preview.html'), 'w').write(html)


def seg(items, sel=0, label='View', cls='', role='radiogroup', states=None, disabled=(), extra='', badge=None):
    states = states or {}
    irole = 'tab' if role == 'tablist' else 'radio'
    attr = 'aria-selected' if role == 'tablist' else 'aria-checked'
    out = []
    for i, t in enumerate(items):
        a = f' {attr}="{"true" if i == sel else "false"}"'
        if i in states:
            a += f' data-state="{states[i]}"'
        if i in disabled:
            a += ' aria-disabled="true"'
        b = f'<span class="lg-badge lg-badge--sm lg-badge--count lg-badge--warn">{badge[1]}</span>' if badge and badge[0] == i else ''
        out.append(f'<button class="lg-segmented__item" type="button" role="{irole}"{a}>{t}{b}</button>')
    return (f'<div class="lg-segmented{cls}" role="{role}" aria-label="{label}" data-lg="segmented"{extra}>'
            + ''.join(out) + '<span class="lg-segmented__thumb" aria-hidden="true"></span></div>')


def nav_links(items, cur=0, label='App'):
    out = []
    for i, t in enumerate(items):
        c = ' aria-current="page"' if i == cur else ''
        out.append(f'<a class="lg-segmented__item lg-navbar__link" href="#"{c}>{t}</a>')
    return f'<nav class="lg-segmented" aria-label="{label}">' + ''.join(out) + '</nav>'


