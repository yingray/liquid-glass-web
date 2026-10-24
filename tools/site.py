"""Demo site: every preview card as a standalone page, plus a home page (tools/site_home.py).

    python3 tools/site.py [out_dir]       build the static site (default _site/) for GitHub Pages
    python3 tools/site.py --serve [port]  serve the same pages from disk (default 8810), for review

A preview.html carries only markup; Claude Design and the checks add tokens.css, bundle.css and
bundle.js. This script adds them the same way as tools/audit.py. Run `make build` first, so that
tools/.cache/tokens.css exists. The query string picks the look: ?theme=auto|dark|light|dark-solid|
light-solid|dark-contrast|light-contrast and ?density=auto|compact|comfortable.
"""
import http.server, os, re, sys, urllib.parse

import site_home

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C = os.path.join(ROOT, 'design-system', 'components')
TOK = os.path.join(ROOT, 'tools', '.cache', 'tokens.css')

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


def home_page(build_static):
    def size(d):
        w = canvas(d)
        return f'Fixed canvas, {w}px' if w else 'Fluid, 320px and up'
    return site_home.home_page(build_static, runtime('dark'), version(), cards(), size)


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
