"""Contracts for the React adapter used by Claude Design (.design-sync/react). Audit items UI-41 to UI-45.

Needs the design-sync toolchain in .ds-sync/node_modules (react, react-dom, esbuild). Without it the run is skipped
with a message: the adapter is not part of the framework-free system, so `make check` does not depend on it.
"""
import os as _os
import subprocess
import sys

ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
NM = _os.path.join(ROOT, '.ds-sync', 'node_modules')
CACHE = _os.path.join(ROOT, 'tools', '.cache')
if not _os.path.isdir(_os.path.join(NM, 'react-dom')):
    print('SKIP react contracts: .ds-sync/node_modules is missing (design-sync toolchain)')
    sys.exit(0)
_os.makedirs(CACHE, exist_ok=True)
out = _os.path.join(CACHE, 'react-contracts.js')
subprocess.run([_os.path.join(NM, '.bin', 'esbuild'), _os.path.join(ROOT, 'tools', 'react', 'contracts.jsx'), '--bundle', '--format=iife',
                '--jsx=automatic', '--define:process.env.NODE_ENV="development"', f'--outfile={out}', '--log-level=warning',
                f'--alias:react={_os.path.join(NM, "react")}', f'--alias:react-dom={_os.path.join(NM, "react-dom")}'], check=True)
from playwright.sync_api import sync_playwright

tok = open(_os.path.join(CACHE, 'tokens.css')).read()
css = open(_os.path.join(ROOT, 'design-system', 'components', 'bundle.css')).read()
app = open(out).read()
R = []


def ok(c, m):
    R.append(bool(c))
    print(('PASS ' if c else 'FAIL ') + m)


with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1000, 'height': 900})
    errors = []
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.set_content(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><style>{tok}</style><style>{css}</style></head><body><div id="app"></div><script>{app}</script></body></html>')
    pg.wait_for_timeout(400)
    ok(not errors, f'the adapter renders without errors ({errors[:2]})')
    log = lambda: pg.evaluate('window.log')
    # UI-41
    pg.click('#s41 [data-value=Two]'); pg.evaluate('T.setVer(2)'); pg.wait_for_timeout(50); pg.click('#s41 [data-value=Three]')
    ok(log()[-2:] == ['v1:1', 'v2:2'], f'UI-41 after a rerender only the new onChange runs ({log()[-2:]})')
    pg.evaluate('window.log.length = 0')
    pg.evaluate('T.setDismiss(false)'); pg.click('#open'); pg.wait_for_timeout(450); pg.mouse.click(5, 5); pg.wait_for_timeout(450)
    ok(pg.evaluate('m41.open'), 'UI-41 dismissOnBackdrop=false, set after mount, keeps the sheet on a backdrop click')
    pg.evaluate('T.setDismiss(true)'); pg.wait_for_timeout(50); pg.mouse.click(5, 5); pg.wait_for_timeout(450)
    ok(not pg.evaluate('m41.open'), 'UI-41 dismissOnBackdrop back to true closes it again, with no rebuild')
    # UI-42
    pg.click('#s42 [data-value=B]'); pg.wait_for_timeout(120)
    st = pg.evaluate('[...document.querySelectorAll("#s42 .lg-segmented__item")].map(i => i.getAttribute("aria-checked"))')
    ok(st == ['true', 'false', 'false'] and log()[-1] == 'req:1', f'UI-42 the host refuses: the control returns to index 0 ({st}, {log()[-1:]})')
    pg.evaluate('T.setAccept(true)'); pg.wait_for_timeout(50); pg.click('#s42 [data-value=C]'); pg.wait_for_timeout(120)
    st = pg.evaluate('[...document.querySelectorAll("#s42 .lg-segmented__item")].map(i => i.getAttribute("aria-checked"))')
    ok(st == ['false', 'false', 'true'], f'UI-42 the host accepts: the change commits ({st})')
    pg.evaluate('T.setCtl(0)'); pg.wait_for_timeout(80)
    st = pg.evaluate('[...document.querySelectorAll("#s42 .lg-segmented__item")].map(i => [i.getAttribute("aria-checked"), i.tabIndex])')
    ok(st[0] == ['true', 0] and st[2] == ['false', -1], f'UI-42 an external reset moves aria state and the tab stop ({st})')
    # UI-43
    pg.click('#s43 [data-value=grid]')
    ok(log()[-1] == 'val:grid', f'UI-43 onChange reports data-value, not the label or its badge ({log()[-1]})')
    # UI-44
    pg.evaluate('T.setItems([{ label: "Side by Side", value: "side" }, { label: "格狀", value: "grid", badge: 3 }, { label: "Swipe", value: "swipe" }])'); pg.wait_for_timeout(120)
    st = pg.evaluate('[[...document.querySelectorAll("#s43 .lg-segmented__item")].map(i => [i.dataset.value, i.getAttribute("aria-checked"), i.tabIndex])]')[0]
    ok(st == [['side', 'false', -1], ['grid', 'true', 0], ['swipe', 'false', -1]], f'UI-44 after items change the selection keeps its value and its one tab stop ({st})')
    pg.focus('#s43 [data-value=grid]'); pg.keyboard.press('ArrowRight')
    ok(log()[-1] == 'val:swipe', f'UI-44 arrow keys follow the current items ({log()[-1]})')
    # UI-45
    d = pg.get_attribute('#tf', 'aria-describedby').split()
    ok(d[0] == 'ext' and len(d) == 3 and pg.get_attribute('#tf', 'aria-invalid') == 'true', f'UI-45 external hint, helper and error are all linked ({d})')
    pg.evaluate('T.setErr("")'); pg.wait_for_timeout(50)
    d = pg.get_attribute('#tf', 'aria-describedby').split()
    ok(len(d) == 2 and pg.get_attribute('#tf', 'aria-invalid') is None, f'UI-45 clearing the error keeps the helper ({d})')
    # UI-30 / UI-35 / UI-36 / UI-26 in the adapter
    ok(pg.evaluate('[...sl.children].every(r => r.getAttribute("role") === "option")') and pg.get_attribute('#lr', 'aria-selected') is None and pg.get_attribute('#lr', 'aria-current') == 'true',
       'UI-30 ListRow: aria-selected only inside SelectList; elsewhere selected maps to aria-current')
    ok(pg.get_attribute('#cp', 'role') is None and pg.evaluate('cp.querySelector(".lg-composer__hint").textContent') in ('⌘K', 'Ctrl K'), 'UI-35/36 Composer: no search role; the hint shows the registered shortcut')
    pg.click('#mt'); pg.evaluate('mi.click()')
    ok('disabled ran' not in log(), 'UI-26 Menu.Item disabled never runs its action')
    pg.evaluate('T.setVer(3)'); n = pg.evaluate('LiquidGlass.destroy(document)')
    ok(n >= 5, f'UI-46 every adapter controller is in the registry, so destroy(root) releases it ({n})')
    b.close()

print(sum(R), '/', len(R))
sys.exit(0 if all(R) else 1)
