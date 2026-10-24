"""Behaviour contracts from the 2026-10-24 UI/UX audit (docs/liquid-glass-web-ui-ux-audit-2026-10-24.md).

Each check names the audit item it guards (UI-xx). They complement tools/interact.py: interact.py checks the
showcase cards; this file checks the operating contracts that the cards cannot show (keyboard, cancel, disabled,
dynamic items, overlays, lifecycle, hit areas, layout geometry). Run with `make test` (headless Chromium).
"""
import os as _os
import re
import sys

ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
DS = _os.path.join(ROOT, 'design-system')
CACHE = _os.path.join(ROOT, 'tools', '.cache')
from playwright.sync_api import sync_playwright

tok = open(_os.path.join(CACHE, 'tokens.css')).read()
css = open(_os.path.join(DS, 'components', 'bundle.css')).read()
js = open(_os.path.join(DS, 'components', 'bundle.js')).read()
R = []


def ok(c, m):
    R.append(bool(c))
    print(('PASS ' if c else 'FAIL ') + m)


def doc(body, theme='dark', init=True, head=''):
    return (f'<!doctype html><html lang="en" data-theme="{theme}"><head><meta charset="utf-8">'
            f'<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
            f'<style>{tok}</style><style>{css}</style><script>{js}</script>{head}</head>'
            f'<body style="margin:0">{body}<script>{"LiquidGlass.init();" if init else ""}</script></body></html>')


def card(comp, theme='dark'):
    f = _os.path.join(DS, 'components', comp, 'preview.html')
    src = open(f).read() if _os.path.exists(f) else '<!doctype html><html lang="en"><head></head><body>missing card</body></html>'

    return src.replace('<html lang', f'<html data-theme="{theme}" lang', 1).replace(
        '<head>', '<head><style>' + tok + '</style><style>' + css + '</style><script>' + js + '</script>', 1)


def active(pg):
    return pg.evaluate('document.activeElement && (document.activeElement.id || document.activeElement.textContent.trim())')


MENU = """
<button id="trig" class="lg-btn lg-btn--tinted" type="button" aria-controls="m">Actions</button>
<div id="m" class="lg-menu lg-glass lg-glass--popover" role="menu" aria-label="Actions" hidden data-lg="panel">
  <button id="i1" class="lg-menu__item" type="button" role="menuitem">View Larger</button>
  <button id="i2" class="lg-menu__item" type="button" role="menuitem" aria-disabled="true">Replace Image</button>
  <button id="i3" class="lg-menu__item" type="button" role="menuitem" hidden>Hidden Item</button>
  <a id="i4" class="lg-menu__item" href="#x" role="menuitem">Open Source</a>
  <div class="lg-menu__sep" role="separator"></div>
  <button id="i5" class="lg-menu__item lg-menu__item--danger" type="button" role="menuitem">Remove from Show</button>
</div>
<button id="after" type="button">After</button>"""

with sync_playwright() as p:
    b = p.chromium.launch()

    # ---------- UI-25 · Menu: role=menu gets the menu-button keyboard contract ----------
    pg = b.new_page(viewport={'width': 900, 'height': 700})
    pg.set_content(doc(MENU))
    ok(pg.get_attribute('#trig', 'aria-haspopup') == 'menu', 'UI-25 the trigger of a role=menu panel announces aria-haspopup="menu"')
    pg.focus('#trig'); pg.keyboard.press('Enter')
    ok(not pg.evaluate('m.hidden') and active(pg) == 'i1', f'UI-25 Enter on the trigger opens the menu and focuses the first item ({active(pg)})')
    pg.keyboard.press('ArrowDown')
    ok(active(pg) == 'i2', f'UI-25 ArrowDown moves to the next item; a disabled item stays focusable so it can be discovered ({active(pg)})')
    pg.keyboard.press('ArrowDown')
    ok(active(pg) == 'i4', f'UI-25 hidden items are skipped ({active(pg)})')
    pg.keyboard.press('End'); ok(active(pg) == 'i5', 'UI-25 End goes to the last item')
    pg.keyboard.press('ArrowDown'); ok(active(pg) == 'i1', 'UI-25 ArrowDown wraps to the first item')
    pg.keyboard.press('ArrowUp'); ok(active(pg) == 'i5', 'UI-25 ArrowUp wraps to the last item')
    pg.keyboard.press('Home'); ok(active(pg) == 'i1', 'UI-25 Home goes to the first item')
    pg.keyboard.press('r'); ok(active(pg) == 'i2', f'UI-25 typing a character moves to the next item that starts with it, disabled items included ({active(pg)})')
    pg.keyboard.press('r'); ok(active(pg) == 'i5', f'UI-25 typing it again moves on to the next match ({active(pg)})')
    pg.keyboard.press('Escape')
    ok(pg.evaluate('m.hidden') and active(pg) == 'trig' and pg.get_attribute('#trig', 'aria-expanded') == 'false', 'UI-25 Escape closes the menu and returns focus to the trigger')
    pg.keyboard.press('ArrowUp')
    ok(not pg.evaluate('m.hidden') and active(pg) == 'i5', f'UI-25 ArrowUp on the closed trigger opens the menu on the last item ({active(pg)})')
    pg.keyboard.press('Tab')
    ok(pg.evaluate('m.hidden'), 'UI-25 Tab leaves the menu and closes it')
    ok(pg.evaluate('[...m.querySelectorAll(".lg-menu__item")].every(i => i.tabIndex === -1)'), 'UI-25 menu items are not separate tab stops')
    pg.close()

    # ---------- UI-26 · Menu: aria-disabled items never run their action ----------
    pg = b.new_page(viewport={'width': 900, 'height': 700})
    pg.set_content(doc(MENU + '<script>window.hits=0; i2.addEventListener("click", () => hits++); i4.addEventListener("click", e => { if (!e.defaultPrevented) hits += 10; });</script>'))
    pg.click('#trig'); pg.click('#i2', force=True)
    pg.focus('#i2'); pg.keyboard.press('Enter'); pg.keyboard.press(' ')
    ok(pg.evaluate('hits') == 0, f'UI-26 a disabled item ignores pointer, Enter and Space ({pg.evaluate("hits")} runs)')
    pg.evaluate('i2.click()'); ok(pg.evaluate('hits') == 0, 'UI-26 a disabled item also ignores a scripted click()')
    pg.evaluate('i4.setAttribute("aria-disabled","true"); i4.click()')
    ok(pg.evaluate('hits') == 0 and pg.evaluate('location.hash') == '', 'UI-26 a disabled link item does not navigate')
    pg.evaluate('i2.removeAttribute("aria-disabled")'); pg.click('#trig') if pg.evaluate('m.hidden') else None
    pg.evaluate('i2.click()'); ok(pg.evaluate('hits') == 1, 'UI-26 the item runs again once it is enabled')
    bg = pg.evaluate('(() => { i5.setAttribute("aria-disabled","true"); i5.setAttribute("data-state","active"); return getComputedStyle(i5).backgroundColor; })()')
    ok(bg == 'rgba(0, 0, 0, 0)', f'UI-26 a disabled item shows no pressed feedback ({bg})')
    pg.close()

    # ---------- UI-27 · Toolbar: the single tab stop survives hidden, disabled and late-shown items ----------
    TB = """<div id="tb" class="lg-toolbar" role="toolbar" aria-label="Edit" data-lg="toolbar"><div class="lg-toolbar__group lg-glass">
      <button id="a" class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Undo">u</button>
      <button id="b" class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Redo">r</button>
      <button id="c" class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Share" aria-disabled="true">s</button></div></div>
      <dialog id="dl" class="lg-modal" aria-label="Late"><div class="lg-toolbar" role="toolbar" aria-label="Late" data-lg="toolbar"><div class="lg-toolbar__group lg-glass">
      <button id="d1" class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="One">1</button><button id="d2" class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Two">2</button></div></div></dialog>"""
    pg = b.new_page(viewport={'width': 900, 'height': 700})
    pg.set_content(doc(TB))
    stops = 'sel => [...document.querySelectorAll(sel + " .lg-btn")].filter(x => x.tabIndex === 0).map(x => x.id)'
    pg.evaluate('a.disabled = true'); pg.wait_for_timeout(50)
    ok(pg.evaluate(stops, '#tb') == ['b'], f'UI-27 disabling the tab stop moves it to the next usable button ({pg.evaluate(stops, "#tb")})')
    pg.evaluate('b.hidden = true'); pg.wait_for_timeout(50)
    ok(pg.evaluate(stops, '#tb') == ['c'], f'UI-27 hiding it moves it on; aria-disabled buttons stay reachable by design ({pg.evaluate(stops, "#tb")})')
    pg.evaluate('c.remove()'); pg.evaluate('a.disabled = false'); pg.wait_for_timeout(50)
    ok(pg.evaluate(stops, '#tb') == ['a'], f'UI-27 removing it falls back to the first usable button ({pg.evaluate(stops, "#tb")})')
    pg.evaluate('dl.showModal()'); pg.wait_for_timeout(50)
    ok(pg.evaluate(stops, '#dl') == ['d1'], f'UI-27 a toolbar initialised inside a closed dialog has one tab stop when shown ({pg.evaluate(stops, "#dl")})')
    pg.focus('#d1'); pg.keyboard.press('ArrowRight'); ok(active(pg) == 'd2', 'UI-27 arrow keys still work after a refresh')
    ok(pg.evaluate('typeof LiquidGlass.Toolbar(document.getElementById("tb")).refresh') == 'function', 'UI-27 the controller exposes refresh()')
    pg.close()

    # ---------- UI-28 / UI-29 / UI-43 / UI-44 · SegmentedControl ----------
    SEG = """<div id="sg" class="lg-segmented" role="radiogroup" aria-label="View" data-lg="segmented">
      <button class="lg-segmented__item" type="button" role="radio" aria-checked="true" data-value="single">Single</button>
      <button class="lg-segmented__item" type="button" role="radio" aria-checked="false" data-value="side">Side by Side</button>
      <button class="lg-segmented__item" type="button" role="radio" aria-checked="false" data-value="grid">格狀<span class="lg-badge lg-badge--sm lg-badge--count">3</span></button>
      <span class="lg-segmented__thumb" aria-hidden="true"></span></div>
      <div id="tl" class="lg-segmented" role="tablist" aria-label="Area" data-lg="segmented">
      <button id="t1" class="lg-segmented__item" type="button" role="tab" aria-selected="true" aria-controls="p1">Picks</button>
      <button id="t2" class="lg-segmented__item" type="button" role="tab" aria-selected="false" aria-controls="p2">Sources<span class="lg-badge lg-badge--sm lg-badge--count">3</span></button>
      <span class="lg-segmented__thumb" aria-hidden="true"></span></div>
      <div id="p1" role="tabpanel" aria-labelledby="t1">Picks panel</div><div id="p2" role="tabpanel" aria-labelledby="t2" hidden>Sources panel</div>
      <script>window.ev=[]; document.addEventListener("lg:change", e => ev.push(e.detail));</script>"""
    pg = b.new_page(viewport={'width': 900, 'height': 700})
    pg.set_content(doc(SEG))
    it = pg.locator('#sg .lg-segmented__item')
    b0, b2 = it.nth(0).bounding_box(), it.nth(2).bounding_box()
    y = b0['y'] + b0['height'] / 2
    pg.evaluate('''([x0, x2, y]) => { const el = sg, o = {bubbles: true, pointerId: 7, pointerType: "touch", isPrimary: true, clientY: y};
      el.querySelectorAll(".lg-segmented__item")[0].dispatchEvent(new PointerEvent("pointerdown", {...o, clientX: x0}));
      el.dispatchEvent(new PointerEvent("pointermove", {...o, clientX: x2}));
      el.dispatchEvent(new PointerEvent("pointercancel", {...o, clientX: x2})); }''', [b0['x'] + 5, b2['x'] + 5, y])
    ok(pg.evaluate('sg.querySelector("[aria-checked=true]").dataset.value') == 'single' and pg.evaluate('ev.length') == 0,
       f'UI-28 a cancelled drag returns to the starting item and commits nothing ({pg.evaluate("ev")})')
    it.nth(0).hover(); pg.mouse.down(); pg.mouse.move(b2['x'] + 8, y, steps=4); pg.mouse.up(); pg.wait_for_timeout(50)
    ok(pg.evaluate('ev.length') == 1 and pg.evaluate('ev[0].value') == 'grid', f'UI-28 a drag commits once, on release ({pg.evaluate("ev")})')
    ok(pg.evaluate('ev[0].value') == 'grid', 'UI-43 the payload is data-value, not the visible label or its badge')
    pg.evaluate('ev.length = 0; sg.querySelector("[data-value=grid]").removeAttribute("data-value"); LiquidGlass.SegmentedControl(sg).select(1); LiquidGlass.SegmentedControl(sg).select(2)')
    ok(pg.evaluate('ev[1] && ev[1].value') == '格狀', f'UI-43 without data-value, the fallback is the label without its badge ({pg.evaluate("ev[1] && ev[1].value")})')
    pg.evaluate('ev.length = 0')
    # dynamic items
    pg.evaluate('''(() => { const c = LiquidGlass.SegmentedControl(sg); c.select(1);
      sg.querySelectorAll(".lg-segmented__item")[0].remove(); c.refresh(); })()''')
    st = pg.evaluate('(() => { const c = LiquidGlass.SegmentedControl(sg); return [c.index, c.value, [...sg.querySelectorAll(".lg-segmented__item")].map(i => i.tabIndex)]; })()')
    ok(st == [0, 'side', [0, -1]], f'UI-44 after removing an earlier item the selection keeps its identity and its single tab stop ({st})')
    pg.evaluate('(() => { const n = document.createElement("button"); n.className = "lg-segmented__item"; n.type = "button"; n.setAttribute("role", "radio"); n.dataset.value = "swipe"; n.textContent = "Swipe"; sg.insertBefore(n, sg.querySelector(".lg-segmented__thumb")); })()')
    pg.wait_for_timeout(80)
    pg.focus('#sg [aria-checked=true]'); pg.keyboard.press('End')
    ok(pg.evaluate('LiquidGlass.SegmentedControl(sg).value') == 'swipe', 'UI-44 an appended item is picked up automatically (keyboard reaches it)')
    pg.evaluate('sg.querySelector("[aria-checked=true]").remove()'); pg.wait_for_timeout(80)
    st = pg.evaluate('(() => { const c = LiquidGlass.SegmentedControl(sg); return [c.index, sg.querySelectorAll("[aria-checked=true]").length, document.activeElement === document.body || sg.contains(document.activeElement)]; })()')
    ok(st[0] == 0 and st[1] == 1, f'UI-44 removing the selected item falls back to the first enabled item ({st})')
    # tabs
    pg.focus('#t1'); pd = pg.evaluate('(() => { const e = new KeyboardEvent("keydown", {key: "ArrowDown", bubbles: true, cancelable: true}); t1.dispatchEvent(e); return e.defaultPrevented; })()')
    ok(not pd and pg.get_attribute('#t1', 'aria-selected') == 'true', 'UI-29 a horizontal tablist leaves ArrowUp and ArrowDown to the page')
    pg.keyboard.press('ArrowRight')
    ok(pg.evaluate('[p1.hidden, p2.hidden]') == [True, False], 'UI-29 tabs show the panel named by aria-controls and hide the others')
    pg.evaluate('tl.setAttribute("data-activation","manual"); LiquidGlass.SegmentedControl(tl).destroy(); LiquidGlass.SegmentedControl(tl)')
    pg.focus('#t2'); pg.keyboard.press('ArrowLeft')
    ok(active(pg) == 't1' and pg.get_attribute('#t2', 'aria-selected') == 'true', 'UI-29 manual activation: arrows move focus without switching the panel')
    pg.keyboard.press('Enter'); ok(pg.get_attribute('#t1', 'aria-selected') == 'true' and pg.evaluate('p1.hidden') is False, 'UI-29 manual activation: Enter switches the panel')
    pg.close()

    # ---------- UI-31 / UI-32 / UI-33 / UI-40 / UI-46 · Modal ----------
    MOD = """<button id="open" type="button" data-lg-open="#dl">Open</button>
    <dialog id="dl" class="lg-modal" aria-labelledby="dt" data-lg="modal"><span class="lg-modal__grabber" aria-hidden="true"></span>
      <div class="lg-modal__header"><h2 id="dt" class="lg-modal__title title-3">Export Settings</h2><button id="x" class="lg-btn lg-btn--tinted lg-btn--icon lg-btn--sm" type="button" aria-label="Close" data-lg-close>×</button></div>
      <div class="lg-modal__body"><input id="draft" class="lg-input" aria-label="Name">
        <button id="mt" class="lg-btn lg-btn--tinted" type="button" aria-controls="mm">More</button>
        <div id="mm" class="lg-menu lg-glass lg-glass--popover" role="menu" aria-label="More" hidden data-lg="panel"><button class="lg-menu__item" type="button" role="menuitem">Duplicate</button></div>
      </div></dialog>"""
    pg = b.new_page(viewport={'width': 1200, 'height': 800})
    pg.set_content(doc(MOD)); pg.click('#open'); pg.wait_for_timeout(450)
    r = pg.evaluate('(() => { const d = dl.getBoundingClientRect(); return [d.left + 24, d.top + 6]; })()')
    pg.mouse.click(r[0], r[1]); pg.wait_for_timeout(450)
    ok(pg.evaluate('dl.open'), 'UI-31 a click on empty sheet chrome (beside the grabber) does not count as a backdrop click')
    pg.mouse.move(r[0], r[1] + 60); pg.mouse.down(); pg.mouse.move(5, 5, steps=3); pg.mouse.up(); pg.wait_for_timeout(450)
    ok(pg.evaluate('dl.open'), 'UI-31 a drag that starts inside the sheet and ends outside does not close it')
    pg.mouse.click(5, 5); pg.wait_for_timeout(450)
    ok(not pg.evaluate('dl.open'), 'UI-31 a real backdrop click closes the sheet')
    # close requests
    pg.evaluate('''window.reasons = []; LiquidGlass.Modal(dl).destroy();
      LiquidGlass.Modal(dl, { beforeClose: (reason) => { reasons.push(reason); return draft.value === ""; } });''')
    pg.click('#open'); pg.wait_for_timeout(450); pg.fill('#draft', 'Island Light')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(450)
    pg.click('#x'); pg.wait_for_timeout(450)
    pg.mouse.click(5, 5); pg.wait_for_timeout(450)
    ok(pg.evaluate('dl.open') and pg.evaluate('draft.value') == 'Island Light', 'UI-32 with a draft, Escape, the close button and the backdrop all keep the sheet and the text')
    ok(pg.evaluate('reasons') == ['escape', 'close-button', 'backdrop'], f'UI-32 the close request names its reason ({pg.evaluate("reasons")})')
    pg.fill('#draft', ''); pg.click('#x'); pg.wait_for_timeout(450)
    ok(not pg.evaluate('dl.open'), 'UI-32 without a draft the sheet closes with no extra step')
    # overlay stack
    pg.evaluate('LiquidGlass.Modal(dl).destroy(); LiquidGlass.Modal(dl)')
    pg.click('#open'); pg.wait_for_timeout(450); pg.click('#mt'); pg.wait_for_timeout(50)
    pg.keyboard.press('Escape'); pg.wait_for_timeout(450)
    ok(pg.evaluate('mm.hidden') and pg.evaluate('dl.open') and active(pg) == 'mt', 'UI-33 Escape closes only the menu on top; the sheet stays and focus returns to the menu button')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(450)
    ok(not pg.evaluate('dl.open') and active(pg) == 'open', 'UI-33 the next Escape closes the sheet and focus returns to its opener')
    # toast scope
    pg.click('#open'); pg.wait_for_timeout(450)
    pg.evaluate('LiquidGlass.toast("Saved the export preset.")'); pg.wait_for_timeout(80)
    ok(pg.evaluate('!!document.querySelector(".lg-toast") && document.querySelector(".lg-toast").closest("dialog") === dl'), 'UI-40 a toast raised while a sheet is open shows inside the sheet (top layer)')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(450)
    ok(pg.evaluate('document.querySelector(".lg-toast").hidden'), 'UI-40 closing the sheet clears its toast')
    pg.evaluate('LiquidGlass.toast("One"); LiquidGlass.toast("Two");'); pg.wait_for_timeout(80)
    ok(pg.evaluate('document.querySelector(".lg-toast").textContent') == 'One', 'UI-40 a second message waits for the first instead of replacing it')
    pg.evaluate('LiquidGlass.toast("Removed Frame 14.", { action: { label: "Undo", onClick: () => { window.undone = true; } } })'); pg.wait_for_timeout(3200)
    ok(pg.evaluate('!!document.querySelector(".lg-toast button")'), 'UI-34/40 a toast with an Undo action stays longer than a plain message')
    pg.click('.lg-toast button'); ok(pg.evaluate('window.undone === true'), 'UI-34 the Undo action runs')
    # lifecycle
    pg.evaluate('''window.rs = 0; const add = window.addEventListener, rem = window.removeEventListener;
      window.addEventListener = function (t, f, o) { if (t === "resize") rs++; return add.call(this, t, f, o); };
      window.removeEventListener = function (t, f, o) { if (t === "resize") rs--; return rem.call(this, t, f, o); };''')
    pg.evaluate('LiquidGlass.Modal(dl).destroy(); const c = LiquidGlass.Modal(dl); c.open(); c.destroy(); c.destroy();')
    ok(pg.evaluate('rs') == 0, f'UI-46 destroying an open sheet removes its resize listener; destroy can run twice ({pg.evaluate("rs")})')
    pg.evaluate('dl.close(); LiquidGlass.Modal(dl)')
    n = pg.evaluate('LiquidGlass.destroy(document)')
    ok(isinstance(n, int) and n >= 2, f'UI-46 LiquidGlass.destroy(root) releases every controller bound inside root ({n})')
    pg.close()

    # ---------- UI-21 / UI-22 / UI-24 · touch geometry ----------
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True, device_scale_factor=2)
    pg = ctx.new_page()
    pg.set_content(doc("""<header class="lg-navbar" data-lg="navbar"><div class="lg-scroll-edge" aria-hidden="true"></div><div class="lg-navbar__row">
      <div class="lg-navbar__island lg-glass"><a id="brand" class="lg-navbar__brand lg-focusable" href="#" aria-label="Lumen home"><span>Lumen</span></a></div>
      <span class="lg-navbar__spacer"></span><div class="lg-navbar__island lg-navbar__island--tight lg-glass"><button id="mt" class="lg-btn lg-btn--plain lg-btn--icon lg-navbar__menu-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nm">m</button></div></div>
      <div class="lg-navbar__menu lg-menu lg-glass lg-glass--popover" id="nm" hidden><a class="lg-menu__item" href="#">Activity</a></div></header>
      <main style="padding:var(--content-top) 16px 200px;display:flex;flex-direction:column;align-items:flex-start;gap:12px"><p id="first">First block</p>
      <div id="sg" class="lg-segmented" role="radiogroup" aria-label="Zoom" data-lg="segmented"><button class="lg-segmented__item" type="button" role="radio" aria-checked="true">Fit</button><button class="lg-segmented__item" type="button" role="radio" aria-checked="false">2×</button><span class="lg-segmented__thumb"></span></div>
      <div class="lg-chips"><button id="chip" class="lg-chip" type="button">Low</button><button class="lg-chip" type="button">Wide</button></div>
      <button id="close" class="lg-btn lg-btn--tinted lg-btn--icon lg-btn--sm" type="button" aria-label="Close">×</button>
      <div style="height:2000px"></div></main>
      <nav class="lg-tabbar" aria-label="Main tabs" data-lg="tabbar"><div class="lg-scroll-edge lg-scroll-edge--bottom" aria-hidden="true"></div><div class="lg-tabbar__tabs lg-glass">
      <a class="lg-tabbar__tab" href="#" aria-current="page"><span>Studio</span></a><a class="lg-tabbar__tab" href="#"><span>Library</span></a><a class="lg-tabbar__tab" href="#"><span>Shows</span></a></div>
      <button class="lg-tabbar__search lg-glass" type="button" aria-label="Search">s</button></nav>"""))
    pg.wait_for_timeout(200)
    ok(pg.evaluate('matchMedia("(pointer: coarse)").matches'), 'touch emulation reports pointer: coarse')
    probe = '''([sel, idx]) => { const el = document.querySelectorAll(sel)[idx || 0]; const r = el.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const hit = (x, y) => { const h = document.elementFromPoint(x, y); return !!h && (h === el || el.contains(h)); };
      return [hit(cx, cy - 21.5), hit(cx, cy + 21.5), hit(cx - 21.5, cy), hit(cx + 21.5, cy)]; }'''
    for sel, idx, name in [('.lg-segmented__item', 1, 'segmented item'), ('.lg-chip', 0, 'chip'), ('#brand', 0, 'brand link'), ('#close', 0, 'close button'), ('.lg-navbar__menu-toggle', 0, 'menu button')]:
        h = pg.evaluate(probe, [sel, idx])
        ok(all(h), f'UI-21 touch: the {name} answers taps across a 44 × 44 area ({h})')
    nb = pg.evaluate('document.querySelector(".lg-navbar__island").getBoundingClientRect().bottom')
    ct = pg.evaluate('first.getBoundingClientRect().top')
    ok(ct >= nb + 8, f'UI-22 touch: content-top clears the taller touch island ({ct} ≥ {nb} + 8)')
    pg.click('#mt'); mtop = pg.evaluate('nm.getBoundingClientRect().top')
    ok(nb < mtop <= nb + 12, f'UI-22 touch: the menu opens just below its island ({mtop} vs island bottom {nb})')
    sp = pg.evaluate('getComputedStyle(document.documentElement).scrollPaddingTop')
    ok(sp not in ('auto', '0px'), f'UI-22 html scroll-padding-top follows the same geometry ({sp})')
    pg.mouse.wheel(0, 900); pg.wait_for_timeout(600)
    ok(pg.evaluate('document.querySelector(".lg-tabbar").hasAttribute("data-minimized")'), 'UI-24 the tab bar still minimizes on scroll down')
    vis = pg.evaluate('[...document.querySelectorAll(".lg-tabbar__tab")].map(t => { const r = t.getBoundingClientRect(); return r.width >= 44 && r.height >= 40 && getComputedStyle(t).display !== "none"; })')
    ok(all(vis) and len(vis) == 3, f'UI-24 minimized, every destination stays one tap away ({vis})')
    pg.close(); ctx.close()

    # ---------- UI-13 / UI-14 / UI-12 / UI-15 / UI-17 / UI-18 · state colors ----------
    pg = b.new_page(viewport={'width': 900, 'height': 700})
    pg.set_content(doc("""<div class="lg-stage" data-tone="dark" style="height:200px"><div class="lg-stage__media"></div>
      <div class="lg-stage__bottom"><div class="lg-toolbar" role="toolbar" aria-label="Play"><div class="lg-toolbar__group lg-toolbar__group--readout lg-glass lg-glass--media">
      <span id="tc" class="lg-toolbar__text">0:13<small>/ 0:47</small></span></div>
      <div id="ms" class="lg-segmented lg-segmented--media" role="radiogroup" aria-label="Zoom" data-pressed><button class="lg-segmented__item" type="button" role="radio" aria-checked="true">Fit</button><button class="lg-segmented__item" type="button" role="radio" aria-checked="false">2×</button><span class="lg-segmented__thumb"></span></div></div></div></div>
      <div class="lg-menu lg-glass lg-glass--popover" role="menu" aria-label="m"><button id="dz" class="lg-btn lg-btn--danger" type="button" data-state="active">Delete</button><button id="dh" class="lg-btn lg-btn--danger" type="button" data-state="hover">Delete</button>
      <button id="dm" class="lg-menu__item lg-menu__item--danger" type="button" role="menuitem" data-state="active">Remove</button></div>
      <input id="in" class="lg-input" aria-label="Name"><div id="fr" class="lg-frame is-selected" style="width:120px;height:80px"></div>""", init=False))
    pg.evaluate('LiquidGlass.init()'); pg.wait_for_timeout(100)
    col = pg.evaluate('getComputedStyle(ms.querySelector("[aria-checked=true]")).color')
    th = pg.evaluate('getComputedStyle(ms.querySelector(".lg-segmented__thumb")).backgroundColor')
    ok(col == 'rgb(255, 255, 255)' and th == 'rgba(20, 19, 26, 0.72)', f'UI-13 media segmented while pressed: white label on a media-plate thumb ({col} on {th})')
    sm = pg.evaluate('(() => { const s = getComputedStyle(tc.querySelector("small")); return [s.opacity, s.color]; })()')
    ok(sm == ['1', 'rgba(255, 255, 255, 0.72)'], f'UI-14 timecode total uses ink-on-media-muted, not opacity ({sm})')
    dc = pg.evaluate('[getComputedStyle(dz).color, getComputedStyle(dm).color]')
    ok(dc == ['rgb(255, 196, 192)', 'rgb(255, 196, 192)'], f'UI-12 pressed danger button and danger menu item switch to danger-strong ({dc})')
    ok(pg.evaluate('matchMedia("(hover: hover)").matches') is False or pg.evaluate('getComputedStyle(dh).color') == 'rgb(255, 196, 192)', 'UI-12 hovered danger button switches to danger-strong')
    sh = pg.evaluate('getComputedStyle(document.getElementById("in")).boxShadow')
    ok('124, 120, 138' in sh, f'UI-15 text fields show a field-edge boundary before focus ({sh})')
    fr = pg.evaluate('(() => { const s = getComputedStyle(fr); return [s.outlineStyle, getComputedStyle(fr, "::after").boxShadow, getComputedStyle(fr, "::before").content]; })()')
    ok(fr[0] == 'none' and fr[1].count('inset') >= 2 and fr[2] not in ('none', 'normal'), f'UI-17 selection is a two-tone inset ring plus a check mark, leaving the outline free for focus ({fr})')
    pg.evaluate('document.documentElement.setAttribute("data-theme","dark-contrast")')
    ms = pg.evaluate('getComputedStyle(document.querySelector(".lg-menu")).boxShadow')
    ok('40px' not in ms, f'UI-18 high contrast: menus drop their elevation shadow ({ms})')
    pg.close()

    # ---------- UI-06 / UI-07 / UI-19 · type roles and density ----------
    pg = b.new_page(viewport={'width': 1200, 'height': 700})
    pg.set_content(doc('<button id="bt" class="lg-btn lg-btn--tinted" type="button">Export</button><p id="tx">Body</p><dialog class="lg-modal" open style="position:static"><div class="lg-modal__header"><h2 id="mt" class="lg-modal__title title-3">A long sheet title that must wrap instead of being cut off at the edge of the sheet</h2></div></dialog>'))
    ok(pg.evaluate('getComputedStyle(bt).fontSize') == '13px' and pg.evaluate('getComputedStyle(tx).fontSize') == '14px', 'UI-06 compact density at 1200px: 13px controls, 14px body')
    pg.evaluate('document.documentElement.style.setProperty("--type-label", "600 20px/24px sans-serif")')
    ok(pg.evaluate('getComputedStyle(bt).fontSize') == '20px', 'UI-19 buttons read the --type-label role, so one token change reaches them')
    pg.evaluate('document.documentElement.style.removeProperty("--type-label"); document.documentElement.setAttribute("data-density","comfortable")')
    ok(pg.evaluate('getComputedStyle(bt).fontSize') == '15px' and pg.evaluate('getComputedStyle(tx).fontSize') == '16px', 'UI-06 data-density="comfortable": 15px controls, 16px body')
    ok(pg.evaluate('getComputedStyle(mt).whiteSpace') != 'nowrap', 'UI-07 sheet titles wrap instead of truncating')
    ok(pg.evaluate('getComputedStyle(bt).height') == pg.evaluate('getComputedStyle(bt).minHeight') or pg.evaluate('getComputedStyle(bt).height') == 'auto' or pg.evaluate('parseFloat(getComputedStyle(bt).minHeight) > 0'), 'UI-07 buttons use min-height, so larger text grows them')
    pg.close()
    pg = b.new_page(viewport={'width': 390, 'height': 800})
    pg.set_content(doc('<p id="tx">Body</p><nav class="lg-tabbar" aria-label="t"><div class="lg-tabbar__tabs lg-glass"><a id="tab" class="lg-tabbar__tab" href="#" aria-current="page"><span>Studio</span></a></div></nav>'))
    ok(pg.evaluate('getComputedStyle(tx).fontSize') == '16px' and pg.evaluate('getComputedStyle(tab).fontSize') == '12px', 'UI-06 below 744px comfortable is the default: 16px body, 12px tab labels')
    pg.close()

    # ---------- UI-08 / UI-09 · Stage fit and scrims ----------
    pg = b.new_page(viewport={'width': 900, 'height': 900})
    pg.set_content(doc("""<div id="s1" class="lg-stage" data-tone="dark" style="height:200px"><div class="lg-stage__media"></div></div>
      <div id="s2" class="lg-stage" data-tone="dark" data-fit="cover" style="height:200px"><div class="lg-stage__media"></div><div class="lg-stage__bottom">x</div></div>
      <div id="s3" class="lg-stage" data-tone="dark" style="height:200px"><img class="lg-stage__media" alt="Frame 14" src="data:image/gif;base64,R0lGODlhAQABAAAAACw="><div class="lg-stage__top">t</div></div>
      <div id="s4" class="lg-stage" data-tone="dark" data-inspect style="height:200px"><div class="lg-stage__media"></div><div class="lg-stage__top">t</div><button class="lg-stage__exit lg-btn lg-glass lg-glass--media" type="button">Show Controls</button></div>"""))
    fit = pg.evaluate('[getComputedStyle(s1.firstChild).backgroundSize, getComputedStyle(s2.firstChild).backgroundSize, getComputedStyle(s3.querySelector("img")).objectFit]')
    ok(fit == ['contain', 'cover', 'contain'], f'UI-08 the stage shows the whole frame by default (contain); cover is opt-in ({fit})')
    sc = pg.evaluate('[s1, s2, s3, s4].map(s => getComputedStyle(s, "::after").backgroundImage)')
    ok(sc[0] == 'none', f'UI-09 a stage without controls has no scrim ({sc[0][:40]})')
    ok(sc[1].count('linear-gradient') == 1 and sc[2].count('linear-gradient') == 1, f'UI-09 only the band that holds controls is darkened ({[x[:30] for x in sc[1:3]]})')
    ok(sc[3] == 'none' and pg.evaluate('getComputedStyle(s4.querySelector(".lg-stage__top")).display') == 'none' and pg.evaluate('getComputedStyle(s4.querySelector(".lg-stage__exit")).display') != 'none',
       'UI-09 inspect mode removes controls and scrims and keeps one way back')
    pg.close()

    # ---------- UI-23 · navigation mode follows the app's own width ----------
    APP = """<div class="lg-app lg-app--contained" style="width:{w}px;height:600px">
      <header class="lg-navbar lg-navbar--contained" data-lg="navbar"><div class="lg-navbar__row"><div class="lg-navbar__island lg-glass"><a class="lg-navbar__brand" href="#">Lumen</a><span class="lg-nav-desktop">links</span></div></div></header>
      <nav class="lg-tabbar lg-tabbar--contained" aria-label="Main tabs"><div class="lg-tabbar__tabs lg-glass"><a class="lg-tabbar__tab" href="#" aria-current="page"><span>Studio</span></a></div></nav></div>"""
    pg = b.new_page(viewport={'width': 1440, 'height': 900})
    pg.set_content(doc(APP.format(w=390) + APP.format(w=900)))
    m = pg.evaluate('[...document.querySelectorAll(".lg-app")].map(a => [getComputedStyle(a.querySelector(".lg-tabbar")).display, getComputedStyle(a.querySelector(".lg-nav-desktop")).display])')
    ok(m[0][0] != 'none' and m[0][1] == 'none', f'UI-23 a 390px app pane inside a 1440px window shows its tab bar and hides desktop links ({m[0]})')
    ok(m[1][0] == 'none' and m[1][1] != 'none', f'UI-23 a 900px app pane shows desktop links and no tab bar ({m[1]})')
    pg.close()

    # ---------- UI-35 / UI-36 / UI-37 · Composer ----------
    COMP = """<form id="cf" class="lg-composer lg-glass" aria-label="Instructions for the assistant" data-lg="composer" data-shortcut="k">
      <span class="lg-badge lg-badge--mono">@12–18</span><input id="ci" class="lg-composer__input" type="text" aria-label="Instructions for the assistant">
      <span class="lg-composer__hint" aria-hidden="true"></span><button class="lg-btn lg-btn--accent" type="submit">Send</button></form>
      <form id="cf2" class="lg-composer lg-glass" aria-label="Other" data-lg="composer"><input class="lg-composer__input" type="text" aria-label="Other"><span class="lg-composer__hint" aria-hidden="true"></span><button class="lg-btn lg-btn--accent" type="submit">Send</button></form>
      <input id="other" aria-label="Elsewhere">"""
    pg = b.new_page(viewport={'width': 1000, 'height': 600})
    pg.set_content(doc(COMP))
    ok(pg.get_attribute('#cf', 'role') != 'search', 'UI-35 the assistant composer is not a search landmark')
    hints = pg.evaluate('[...document.querySelectorAll(".lg-composer__hint")].map(h => [h.textContent.trim(), getComputedStyle(h).display])')
    ok(hints[0][0] in ('⌘K', 'Ctrl K') and hints[1][1] == 'none', f'UI-36 a shortcut hint shows only when the shortcut is registered ({hints})')
    pg.focus('#other'); pg.keyboard.press('Meta+k' if hints[0][0] == '⌘K' else 'Control+k')
    ok(pg.evaluate('document.activeElement.id') == 'ci', 'UI-36 the shortcut focuses the composer input')
    st = pg.evaluate('''(() => { const c = LiquidGlass.Composer(cf); ci.value = "Match the white balance"; c.setStatus("pending");
      const s1 = [cf.getAttribute("aria-busy"), cf.querySelector("[type=submit]").disabled, ci.value];
      c.setStatus("error", "The assistant is offline. Try again."); const s2 = [cf.getAttribute("aria-busy"), cf.querySelector("[type=submit]").disabled, ci.value, cf.textContent.includes("offline")];
      return [s1, s2]; })()''')
    ok(st[0] == ['true', True, 'Match the white balance'], f'UI-37 pending: busy, no second submit, the text stays ({st[0]})')
    ok(st[1] == [None, False, 'Match the white balance', True], f'UI-37 error: the message is shown, the text stays, Send is ready to retry ({st[1]})')
    pg.close()

    # ---------- UI-38 · Scrubber ----------
    pg = b.new_page(viewport={'width': 900, 'height': 400})
    pg.set_content(doc('<span id="ind" class="lg-scrub" role="progressbar" aria-label="Progress" aria-valuenow="22" style="--lg-value:22%"><span><span></span></span></span><input id="rg" class="lg-scrub lg-scrub--input" type="range" min="0" max="5" step="1" value="1" aria-label="Playback position" aria-valuetext="0:01 of 0:05">'))
    ok(pg.evaluate('getComputedStyle(ind).cursor') != 'pointer', 'UI-38 the progress indicator does not look clickable')
    pg.focus('#rg'); pg.keyboard.press('ArrowRight'); pg.keyboard.press('End')
    ok(pg.evaluate('rg.value') == '5', 'UI-38 the seek variant is a native range: arrows and End work')
    pg.close()

    # ---------- UI-39 · Tooltip ----------
    pg = b.new_page(viewport={'width': 900, 'height': 400})
    pg.set_content(doc('<button id="a" type="button">a</button><button id="sh" class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Share" data-tooltip>s</button><button id="nx" class="lg-btn lg-btn--plain lg-btn--icon" type="button" aria-label="Play" data-tooltip aria-keyshortcuts="Space">p</button>'))
    pg.focus('#a'); pg.keyboard.press('Tab'); pg.wait_for_timeout(700)
    tip = pg.evaluate('(() => { const t = document.querySelector(".lg-tooltip"); return t && !t.hidden ? t.textContent : null; })()')
    ok(tip == 'Share', f'UI-39 keyboard focus shows the tooltip with the accessible name ({tip})')
    pg.keyboard.press('Escape')
    ok(pg.evaluate('document.querySelector(".lg-tooltip").hidden') and pg.evaluate('document.activeElement.id') == 'sh', 'UI-39 Escape hides the tooltip and keeps focus')
    pg.hover('#nx'); pg.wait_for_timeout(700)
    ok(pg.evaluate('document.querySelector(".lg-tooltip").textContent') == 'Play (Space)', 'UI-39 the tooltip adds the registered shortcut')
    ok(pg.get_attribute('#sh', 'title') is None, 'UI-39 no native title tooltip competes with it')
    pg.close()

    # ---------- UI-30 / UI-16 · semantics in the generated previews ----------
    pg = b.new_page(viewport={'width': 1440, 'height': 900})
    bad, dots = [], set()
    for comp in ('FloatingNavbar', 'GlassButton', 'SegmentedControl', 'Toolbar', 'GlassPanel', 'Modal', 'Patterns', 'Materials', 'ShowcaseDesktop', 'ShowcaseMobile', 'AppShell'):
        pg.set_content(card(comp)); pg.wait_for_timeout(120)
        bad += [comp + ': ' + x for x in pg.evaluate('''[...document.querySelectorAll("[aria-selected]")].filter(e => !["option","tab","gridcell","row","treeitem","columnheader","rowheader"].includes(e.getAttribute("role"))).map(e => e.tagName + "." + e.className)''')]
        bad += [comp + ': composer search' for _ in range(pg.evaluate('document.querySelectorAll(".lg-composer[role=search]").length'))]
    ok(not bad, f'UI-30/35 no aria-selected outside option/tab roles, no assistant composer as search ({bad[:4]})')
    pg.set_content(card('ShowcaseDesktop')); pg.wait_for_timeout(120)
    names = pg.evaluate('[...document.querySelectorAll(".sc-clip")].map(c => c.getAttribute("aria-label"))')
    ok(all(re.search(r'(Chosen|Needs You|Processing|Has Question)', n or '') for n in names), f'UI-16 every contact-sheet frame names its status ({names[:3]})')
    shapes = pg.evaluate('''["lg-dot--ok","lg-dot--accent","lg-dot--warn",""].map(c => { const d = document.createElement("i"); d.className = "lg-dot " + c; document.body.appendChild(d); const s = getComputedStyle(d); const k = [s.borderRadius, s.transform, s.backgroundColor === "rgba(0, 0, 0, 0)" ? "hollow" : "filled", s.clipPath].join("|"); d.remove(); return k; })''')
    ok(len(set(shapes)) == 4, f'UI-16 status dots differ in shape, not only hue ({shapes})')
    pg.close()

    # ---------- UI-01 / UI-02 · the fluid AppShell keeps every task at every width ----------
    shell = card('AppShell')
    probs = []
    for w, h in [(320, 640), (390, 844), (600, 900), (743, 900), (744, 900), (900, 800), (1099, 800), (1100, 800), (1440, 900), (1920, 1080), (844, 390), (1280, 600)]:
        pg = b.new_page(viewport={'width': w, 'height': h}); pg.set_content(shell); pg.wait_for_timeout(250)
        sw = pg.evaluate('document.documentElement.scrollWidth')
        if sw > w: probs.append((w, 'scrollWidth', sw))
        res = pg.evaluate('''(() => {
          const vis = e => !!e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== "hidden";
          const find = (sel) => [...document.querySelectorAll(sel)].filter(vis);
          const nav = document.querySelector(".lg-navbar__island").getBoundingClientRect().bottom;
          const first = document.querySelector(".lg-app__main > :not([hidden])");
          return { picks: find("[data-task=picks]").length, sources: find("[data-task=sources]").length, pending: find("[data-task=sources] .lg-badge").length,
                   export_: find("[data-task=export]").length, queue: find("[data-task=queue]").length, search: find("[data-task=search]").length,
                   project: find("[data-task=project]").length, actions: find("[data-task=project-actions]").length, top: first.getBoundingClientRect().top, nav,
                   overflowHidden: getComputedStyle(document.body).overflow === "hidden" || getComputedStyle(document.documentElement).overflow === "hidden" };
        })()''')
        if res['overflowHidden']: probs.append((w, 'overflow hidden'))
        if res['top'] < res['nav']: probs.append((w, 'content under nav', res['top'], res['nav']))
        for k in ('picks', 'sources', 'pending', 'search', 'project'):
            if not res[k]: probs.append((w, 'missing ' + k))
        if not (res['export_'] and res['queue']):
            if not res['actions']: probs.append((w, 'no route to export/queue'))
            else:
                pg.click('[data-task=project-actions] >> visible=true'); pg.wait_for_timeout(80)
                r2 = pg.evaluate('[...document.querySelectorAll("[data-task=export], [data-task=queue]")].filter(e => e.getClientRects().length).length')
                if r2 < 2: probs.append((w, 'project actions lack export/queue', r2))
        pg.close()
    ok(not probs, f'UI-01/02 AppShell 320–1920 and landscape: no horizontal scroll, nothing under the nav, project, Picks/Sources (+ pending count), search, export and queue all reachable ({probs[:6]})')

    # ---------- SCROLL · inner scroll areas (HIG "Scroll views": show that content continues; leave indicators to the platform) ----------
    pg = b.new_page(viewport={'width': 1440, 'height': 700}); pg.set_content(shell); pg.wait_for_timeout(200)
    sb = pg.evaluate('''[".lg-app__aside", ".lg-app__inspector"].map(s => { const c = getComputedStyle(document.querySelector(s)); return [s, c.scrollbarWidth, c.scrollbarColor, c.scrollbarGutter]; })''')
    ok(all(w == 'thin' and col != 'auto' and g.startswith('stable') for _, w, col, g in sb), f'SCROLL side columns use a thin scrollbar in token colors and keep a stable gutter ({sb})')
    pg.close()
    pg = b.new_page(viewport={'width': 900, 'height': 700})
    pg.set_content(doc('<div class="lg-panel lg-glass" style="max-height:120px">' + '<p>Line</p>' * 20 + '</div><dialog class="lg-modal" open><div class="lg-modal__body">x</div></dialog>'))
    sb = pg.evaluate('''[".lg-panel", ".lg-modal__body"].map(s => getComputedStyle(document.querySelector(s)).scrollbarWidth)''')
    ok(sb == ['thin', 'thin'], f'SCROLL panels and sheet bodies use a thin scrollbar ({sb})')
    pg.close()
    probs = []
    for rtl in (False, True):
        src = shell.replace('<html ', '<html dir="rtl" ', 1) if rtl else shell
        for w in (320, 390, 479, 480, 600, 743):
            pg = b.new_page(viewport={'width': w, 'height': 800}); pg.set_content(src); pg.wait_for_timeout(200)
            r = pg.evaluate('''(rtl) => {
              const d = document.querySelector(".lg-app__dock"), dr = d.getBoundingClientRect(), cs = getComputedStyle(d);
              const tiles = [...d.children].map(t => t.getBoundingClientRect());
              const edge = rtl ? dr.left : dr.right;
              const cut = tiles.find(t => t.left < edge && t.right > edge);
              const frac = cut ? (rtl ? (cut.right - edge) : (edge - cut.left)) / cut.width : 0;
              return { scrolls: d.scrollWidth > d.clientWidth + 1, frac: Math.round(frac * 100) / 100, minW: Math.round(Math.min(...tiles.map(t => t.width))), thin: cs.scrollbarWidth };
            }''', rtl)
            if not r['scrolls'] or not (0.2 <= r['frac'] <= 0.8) or r['minW'] < 44 or r['thin'] != 'thin': probs.append((w, 'rtl' if rtl else 'ltr', r))
            pg.close()
    ok(not probs, f'SCROLL the phone dock shows part of the next frame at its trailing edge (LTR and RTL, 320–743), tiles ≥ 44px, thin scrollbar ({probs[:4]})')

    b.close()

print(sum(R), '/', len(R))
sys.exit(0 if all(R) else 1)
