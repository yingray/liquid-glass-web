"""Demo site: every preview card as a standalone page, plus a home page.

    python3 tools/site.py [out_dir]       build the static site (default _site/) for GitHub Pages
    python3 tools/site.py --serve [port]  serve the same pages from disk (default 8810), for review

A preview.html carries only markup; Claude Design and the checks add tokens.css, bundle.css and
bundle.js. This script adds them the same way as tools/audit.py. Run `make build` first, so that
tools/.cache/tokens.css exists. The query string picks the look: ?theme=auto|dark|light|dark-solid|
light-solid|dark-contrast|light-contrast and ?density=auto|compact|comfortable.
"""
import html, http.server, os, re, sys, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C = os.path.join(ROOT, 'design-system', 'components')
TOK = os.path.join(ROOT, 'tools', '.cache', 'tokens.css')
REPO = 'https://github.com/yingray/liquid-glass-web'
THEMES = [('auto', 'Auto'), ('dark', 'Dark'), ('light', 'Light'), ('dark-solid', 'Dark Solid'), ('light-solid', 'Light Solid'),
          ('dark-contrast', 'Dark Contrast'), ('light-contrast', 'Light Contrast')]
DENSITIES = [('auto', 'Auto'), ('compact', 'Compact'), ('comfortable', 'Comfortable')]
DISCLAIMER = ('An independent project. It is not affiliated with or endorsed by Apple Inc. '
              '"Liquid Glass" names Apple\'s design language; this system applies Apple\'s public guidance to the web.')


def rd(p):
    return open(p, encoding='utf-8').read()


def version():
    m = re.search(r'version: "([^"]+)"', rd(os.path.join(C, 'bundle.js')))
    return m.group(1) if m else ''


def cards():
    out = []
    for d in sorted(os.listdir(C)):
        p = os.path.join(C, d, 'preview.html')
        if os.path.isfile(p):
            first = open(p, encoding='utf-8').readline()
            g = re.search(r'group="([^"]+)"', first)
            s = re.search(r'subtitle="([^"]*)"', first)
            if g:  # a card without a group (Cover) is the Claude Design project thumbnail, not a demo
                out.append((g.group(1), d, s.group(1) if s else ''))
    return out


def canvas(name):
    """Width of a fixed card canvas, or None when the card is fluid (it has its own viewport meta)."""
    p = os.path.join(C, name, 'preview.html')
    src = rd(p)
    if 'name="viewport"' in src:
        return None
    m = re.search(r'width=(\d+)', src.split('\n', 1)[0])
    return int(m.group(1)) if m else 980


ORDER = ['Showcase', 'Controls', 'Navigation', 'Overlays']


# Runs before bundle.js: reads ?theme and ?density, so a static page can show every look.
# "auto" leaves the choice to the user's system settings through LiquidGlass.applyTheme().
LOOK = '''<script>(function () {
  var q = new URLSearchParams(location.search), t = q.get("theme") || "%s", d = q.get("density") || "auto", r = document.documentElement;
  if (t !== "auto") r.setAttribute("data-theme", t);
  if (d !== "auto") r.setAttribute("data-density", d);
  addEventListener("DOMContentLoaded", function () { if (t === "auto" && window.LiquidGlass) LiquidGlass.applyTheme(); });
})();</script>'''


def runtime(default_theme):
    return (LOOK % default_theme + '<style>' + rd(TOK) + '</style><style>' + rd(os.path.join(C, 'bundle.css')) +
            '</style><script>' + rd(os.path.join(C, 'bundle.js')) + '</script>')


def card_page(name):
    src = rd(os.path.join(C, name, 'preview.html'))
    src = re.sub(r'^<!-- @dsCard[^\n]*\n', '', src)
    w = canvas(name)
    if w:  # a fixed canvas: phones open the whole canvas zoomed out, and people can pinch to zoom
        src = src.replace('<head>', f'<head><meta name="viewport" content="width={w}">', 1)
    return src.replace('<html lang', '<html data-theme="dark" lang', 1).replace('<head>', '<head>' + runtime('dark'), 1)


HOME_CSS = '''
  body { margin: 0; background: var(--canvas); color: var(--ink); font: var(--type-body); }
  .site { box-sizing: border-box; max-width: 1080px; margin: 0 auto; display: grid; gap: var(--space-36);
    padding: max(var(--space-36), env(safe-area-inset-top)) max(var(--space-16), env(safe-area-inset-right)) max(var(--space-48), env(safe-area-inset-bottom)) max(var(--space-16), env(safe-area-inset-left)); }
  .site h1 { margin: 0; font: var(--type-title-1); }
  .site h2 { margin: 0 0 var(--space-12); font: var(--type-title-3); }
  .site p { margin: 0; }
  .lead { color: var(--ink-muted); max-width: 64ch; margin-top: var(--space-8) !important; }
  .note { color: var(--ink-muted); font: var(--type-footnote); max-width: 72ch; }
  .look { display: grid; gap: var(--space-12); }
  .look__row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-8) var(--space-12); }
  .look__label { min-width: 72px; color: var(--ink-muted); font: var(--type-footnote); }
  a.lg-chip { display: inline-flex; align-items: center; text-decoration: none; }
  a.lg-chip[aria-current="true"] { background: var(--ink); color: var(--canvas); font-weight: 600; }
  .grid { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-12); grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); }
  .card { display: grid; gap: var(--space-4); min-height: 44px; padding: var(--space-16); border-radius: 18px; background: var(--surface);
    box-shadow: inset 0 0 0 1px var(--line); color: inherit; text-decoration: none; }
  @media (hover: hover) { .card:hover { box-shadow: inset 0 0 0 1px var(--border-strong); } }
  .card:focus-visible { outline: var(--focus-width) solid var(--focus); outline-offset: var(--focus-gap); }
  .card b { font: var(--type-headline); }
  .card span { color: var(--ink-muted); font: var(--type-callout); }
  .card i { color: var(--ink-muted); font: var(--type-footnote); font-style: normal; }
  .links { display: flex; flex-wrap: wrap; gap: var(--space-8); }
  .links a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 var(--space-12); border-radius: var(--radius-capsule);
    background: var(--fill); color: var(--ink); text-decoration: none; font: var(--type-label); }
  .links a:focus-visible, a.lg-chip:focus-visible { outline: var(--focus-width) solid var(--focus); outline-offset: var(--focus-gap); }
  footer { display: grid; gap: var(--space-8); padding-top: var(--space-16); box-shadow: inset 0 1px 0 var(--line); }
'''


def home_page(build_static):
    ext = '.html' if build_static else ''

    def look_links(key, items):
        # Links keep the other setting; the current one is set by the script below from the query string.
        return ''.join(f'<a class="lg-chip" data-pick-{key}="{v}" href="?{key}={v}">{html.escape(label)}</a>' for v, label in items)

    def size(d):
        w = canvas(d)
        return f'Fixed canvas, {w}px' if w else 'Fluid, 320px and up'

    groups = {}
    for g, d, s in cards():
        groups.setdefault(g, []).append((d, s))
    sections = ''.join(
        f'<section aria-labelledby="g-{i}"><h2 id="g-{i}">{html.escape(g)}</h2><ul class="grid">' +
        ''.join(f'<li><a class="card" data-card href="cards/{d}{ext}"><b>{d}</b><span>{html.escape(s)}</span><i>{size(d)}</i></a></li>' for d, s in items) +
        '</ul></section>' for i, (g, items) in enumerate(sorted(groups.items(), key=lambda kv: (ORDER.index(kv[0]) if kv[0] in ORDER else len(ORDER), kv[0]))))
    docs = [('Principles', 'design-system/0-principles.md'), ('Brand Book', 'design-system/README.md'),
            ('Accessibility', 'design-system/3-accessibility.md'), ('Apple Alignment', 'design-system/5-apple-alignment.md'),
            ('Contributing', 'CONTRIBUTING.md')]
    doc_links = ''.join(f'<a href="{REPO}/blob/main/{p}">{t}</a>' for t, p in docs) + f'<a href="{REPO}">Source on GitHub</a>'
    sync = '''<script>(function () {
  var q = new URLSearchParams(location.search), t = q.get("theme") || "auto", d = q.get("density") || "auto";
  document.querySelectorAll("a[data-pick-theme]").forEach(function (a) { var v = a.getAttribute("data-pick-theme"); a.href = "?theme=" + v + "&density=" + d; a.setAttribute("aria-current", v === t ? "true" : "false"); });
  document.querySelectorAll("a[data-pick-density]").forEach(function (a) { var v = a.getAttribute("data-pick-density"); a.href = "?theme=" + t + "&density=" + v; a.setAttribute("aria-current", v === d ? "true" : "false"); });
  document.querySelectorAll("a[data-card]").forEach(function (a) { a.href = a.getAttribute("href").split("?")[0] + "?theme=" + t + "&density=" + d; });
})();</script>'''
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Liquid Glass Web</title>
<meta name="description" content="A framework-free design system that applies Apple's Liquid Glass guidance to responsive websites.">
{runtime('auto')}
<style>{HOME_CSS}</style>
</head>
<body>
<main class="site">
  <header>
    <h1>Liquid Glass Web</h1>
    <p class="lead">A framework-free design system for responsive websites. Glass is a separate layer for navigation, toolbars and overlays; content stays opaque and readable. Version {version()}.</p>
  </header>
  <p class="note">{html.escape(DISCLAIMER)}</p>
  <section class="look" aria-label="Look">
    <div class="look__row"><span class="look__label" id="l-theme">Theme</span><nav class="lg-chips" aria-labelledby="l-theme">{look_links('theme', THEMES)}</nav></div>
    <div class="look__row"><span class="look__label" id="l-density">Density</span><nav class="lg-chips" aria-labelledby="l-density">{look_links('density', DENSITIES)}</nav></div>
    <p class="note">Auto follows your system settings: light or dark, Increase Contrast and Reduce Transparency. Each card opens with the look that you pick here. AppShell is the fluid layout reference; the other cards are fixed canvases, so a phone opens them zoomed out.</p>
  </section>
  {sections}
  <section aria-labelledby="g-docs"><h2 id="g-docs">Guidelines</h2><nav class="links" aria-labelledby="g-docs">{doc_links}</nav></section>
  <footer><p class="note">MIT License. Checked automatically in headless Chromium; checks on real devices and with screen readers are still pending.</p></footer>
</main>
{sync}
</body>
</html>
'''


def build(out):
    os.makedirs(os.path.join(out, 'cards'), exist_ok=True)
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(home_page(True))
    names = [d for _, d, _ in cards()]
    for d in names:
        open(os.path.join(out, 'cards', d + '.html'), 'w', encoding='utf-8').write(card_page(d))
    open(os.path.join(out, '.nojekyll'), 'w').close()
    print(f'site: {out} (home + {len(names)} cards)')


class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path
        m = re.fullmatch(r'/cards/([A-Za-z]+)(?:\.html)?', path)
        try:
            if path in ('/', '/index.html'):
                body = home_page(False)
            elif m and os.path.isfile(os.path.join(C, m.group(1), 'preview.html')):
                body = card_page(m.group(1))
            else:
                return self.send_error(404)
        except OSError as e:
            return self.send_error(500, str(e))
        b = body.encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def log_message(self, *a):
        pass


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--serve':
        port = int(sys.argv[2]) if len(sys.argv) > 2 else 8810
        print(f'serving on http://127.0.0.1:{port} (pages are read from disk on each request)')
        http.server.ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
    else:
        build(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, '_site'))
