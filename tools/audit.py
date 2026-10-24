import os as _os
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
DS = _os.path.join(ROOT, 'design-system')
CACHE = _os.path.join(ROOT, 'tools', '.cache')
import json, sys
from playwright.sync_api import sync_playwright
tok=open(_os.path.join(CACHE,'tokens.css')).read(); css=open(_os.path.join(DS,'components','bundle.css')).read(); js=open(_os.path.join(DS,'components','bundle.js')).read()
ALL='FloatingNavbar,GlassButton,SegmentedControl,Toolbar,GlassPanel,Modal,Patterns,Materials,ShowcaseDesktop,ShowcaseMobile,AppShell'
CARDS=(sys.argv[1] if len(sys.argv) > 1 else ALL).split(',')
THEMES=(sys.argv[2] if len(sys.argv) > 2 else 'dark,light').split(',')
# Rule tiers (design-system/0-principles.md, "Rule tiers"):
#   hard     — a usability or accessibility floor. Never waived.
#   contract — a component contract that the bundle and the docs promise. Change the contract, not the page.
#   style    — this system's Apple-aligned house style. A page may waive one with
#              data-lint-waive="<rule>: <reason>" on the element or an ancestor; the waiver is printed.
TIERS={
  'hard': ['unlabeledIcons', 'wrongMaterial', 'nestedGlass', 'overlappingGlass'],
  'contract': ['mixedIconText', 'menuIconsMixed', 'tintedControlsInBar'],
  'style': ['uppercase', 'notTitleCase', 'nonConcentric', 'crowdedGlass'],
}
RULES=[r for t in TIERS.values() for r in t]
failed=[]
JS = r"""() => {
  const out = {};
  out.waivers = [...document.querySelectorAll('[data-lint-waive]')].map(e => e.getAttribute('data-lint-waive'));
  const waived = (el, rule) => { const w = el.closest('[data-lint-waive]'); return !!w && w.getAttribute('data-lint-waive').split(';').some(x => x.trim().startsWith(rule + ':')); };
  const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const glass = [...document.querySelectorAll('*')].filter(el => vis(el) && (getComputedStyle(el).backdropFilter || 'none') !== 'none');
  out.glassCount = glass.length;
  const dont = el => { const f = el.closest('figure, .d-frame'); return !!f && /Don’t/.test([...f.querySelectorAll('figcaption, .mt-tag')].map(x => x.textContent).join(' ')); };
  // per "frame" (each top-level demo frame / phone / stage) count glass
  // a "frame" is one simulated viewport: a phone, a desktop shot or a demo frame (outermost of those); a bare stage counts when it is not inside one
  let dev = [...document.querySelectorAll('.d-frame, .ph, .sc')];
  dev = dev.filter(f => !dev.some(o => o !== f && o.contains(f)));
  const frames = dev.concat([...document.querySelectorAll('.lg-stage')].filter(s => !dev.some(f => f.contains(s))));
  out.maxGlassPerFrame = Math.max(0, ...frames.map(f => glass.filter(g => f.contains(g)).length));
  // glass layered on glass: a glass element whose box intersects another glass element that is not its ancestor/descendant, or nested glass
  const nested = glass.filter(g => glass.some(o => o !== g && o.contains(g)));
  out.nestedGlass = nested.map(g => g.className.toString().slice(0, 60));
  const inter = (a, b) => { const r = a.getBoundingClientRect(), s = b.getBoundingClientRect(); return r.left < s.right - 1 && s.left < r.right - 1 && r.top < s.bottom - 1 && s.top < r.bottom - 1; };
  const overl = [], overlay = [];
  const isOverlay = el => el.matches('.lg-modal, .lg-menu, .lg-glass--popover, .lg-toast, .lg-navbar__menu, [role="dialog"], [role="menu"]');
  for (let i = 0; i < glass.length; i++) for (let j = i + 1; j < glass.length; j++) {
    const a = glass[i], b = glass[j];
    if (a.contains(b) || b.contains(a)) continue;
    if (!inter(a, b)) continue;
    const t = a.className.toString().slice(0, 40) + ' × ' + b.className.toString().slice(0, 40);
    (isOverlay(a) || isOverlay(b) ? overlay : overl).push(t);
  }
  out.overlappingGlass = overl.slice(0, 12);          // control on control: a real violation
  out.overlayAboveControls = overlay.slice(0, 12);    // a sheet or menu above the control layer: intended, reported for review
  // each glass element must compute the material its variant promises (catches cascade overrides like the v2 badge bug)
  const exp = el => el.matches('.lg-glass--media') ? '--media-glass' : el.matches('.lg-glass--thick, .lg-glass--popover, .lg-modal, .lg-menu') ? '--glass-thick' : '--glass';
  const resolved = (el, v) => { const p = document.createElement('i'); p.style.cssText = 'position:absolute;width:1px;height:1px;background-color:var(' + v + ')'; (el.matches('input, textarea, select, img') ? el.parentElement : el).appendChild(p); const c = getComputedStyle(p).backgroundColor; p.remove(); return c; };  // probe inside el, so a local data-tone theme applies
  out.wrongMaterial = [...document.querySelectorAll('.lg-glass, .lg-modal, .lg-menu')].filter(el => vis(el) && !dont(el) && !el.closest('.mt-ladder, [data-state], [aria-pressed="true"], [aria-current], [data-expanded], .lg-modal--full'))
    .map(el => { const want = resolved(el, exp(el)); const got = getComputedStyle(el).backgroundColor; return want === got ? null : el.className.toString().slice(0, 50) + ' :: want ' + exp(el) + ' ' + want + ' got ' + got; }).filter(Boolean).slice(0, 12);
  // shared backgrounds: glass containers holding 2+ buttons; classify each button as icon-only or text
  const mixed = [];
  out.dontExamples = 0;
  for (const g of glass) {
    if (g.matches('.lg-modal, .lg-panel, .lg-menu, [role="dialog"]')) continue;   // content containers, not shared control backgrounds
    const btns = [...g.querySelectorAll('button, a.lg-btn, a.lg-segmented__item')].filter(b => vis(b) && !b.closest('.lg-segmented'));
    if (btns.length < 2) continue;
    const kinds = new Set(btns.map(b => (b.textContent.trim().replace(/\d+/g, '').length ? (b.querySelector('svg') ? 'icon+text' : 'text') : 'icon')));
    if (kinds.size > 1 && dont(g)) { out.dontExamples++; continue; }
    if (kinds.size > 1) mixed.push(g.className.toString().slice(0, 50) + ' → ' + [...kinds].join('/') + ' :: ' + btns.map(b => b.getAttribute('aria-label') || b.textContent.trim()).join(' | '));
  }
  out.mixedIconText = mixed;
  out.unlabeledIcons = [...document.querySelectorAll('button, a')].filter(b => vis(b) && b.querySelector('svg') && !b.textContent.trim() && !b.getAttribute('aria-label')).length;
  out.uppercase = [...document.querySelectorAll('*')].filter(el => vis(el) && !waived(el, 'uppercase') && getComputedStyle(el).textTransform === 'uppercase' && el.textContent.trim()).map(el => el.textContent.trim().slice(0, 30));
  // icons are optional in menus, but consistent inside one logical group (items between separators or labels)
  out.menuIconsMixed = [];
  for (const m of document.querySelectorAll('.lg-menu')) {
    let group = [];
    const flush = () => { const v = group.filter(vis); const k = new Set(v.map(i => !!i.querySelector('svg'))); if (k.size > 1) out.menuIconsMixed.push(v.map(i => i.textContent.trim().slice(0, 16)).join(' | ')); group = []; };
    for (const c of m.children) { if (c.matches('.lg-menu__sep, .lg-menu__label')) flush(); else if (c.matches('.lg-menu__item')) group.push(c); }
    flush();
  }
  const navs = [...document.querySelectorAll('.lg-navbar, .lg-tabbar, .lg-toolbar')].filter(vis);
  out.tintedControlsInBar = navs.map(n => [...n.querySelectorAll('button, a')].filter(el => vis(el) && /lg-btn--(accent|danger)|lg-btn--tinted-accent/.test(el.className.toString()))).filter(a => a.length > 1).map(a => a.map(el => el.textContent.trim()).join(' | '));
  out.statusBadgesInBar = navs.reduce((n, b) => n + [...b.querySelectorAll('.lg-badge--warn, .lg-badge--accent, .lg-badge--ok, .lg-dot--accent, .lg-dot--warn')].filter(vis).length, 0);

  // ---- v3.1 checks ----
  // title-style capitalization on control labels and headers (Apple: section headers use title-style capitalization; HIG: buttons/menu items/tabs in title case)
  const minor = new Set(['a','an','the','and','but','or','for','nor','on','at','to','from','by','of','in','with','as','vs','per','via','then']);
  const isTitle = t => { const w = t.replace(/[“”"()]/g,'').split(/\s+/).filter(x => /^[A-Za-z]/.test(x)); return w.every((x, i) => /^[A-Z]/.test(x) || (i > 0 && i < w.length - 1 && minor.has(x.toLowerCase())) || /^e\.g\.?$/.test(x)); };
  const labelSel = '.lg-btn, .lg-menu__item, .lg-tabbar__tab span, .lg-segmented__item, .lg-panel__head h3, .lg-menu__label, .lg-panel__label, .lg-modal__title, .lg-callout__eyebrow, .lg-chip, .label-sm, .lg-badge:not(.lg-badge--count):not(.lg-badge--mono), .sc-dock__head b';
  out.notTitleCase = [...document.querySelectorAll(labelSel)].filter(el => vis(el) && !dont(el) && !el.matches('.lg-plate') && !waived(el, 'notTitleCase') && !el.closest('[lang]:not([lang^="en"])')).map(el => {
    const t = [...el.childNodes].filter(n => n.nodeType === 3 || (n.nodeType === 1 && !n.matches('.lg-badge, svg, .lg-dot, small, i, .lg-sr-only'))).map(n => n.textContent).join(' ').replace(/\s+/g,' ').trim();
    return t;
  }).filter(t => t && /[a-z]/.test(t) && !isTitle(t)).filter((v, i, a) => a.indexOf(v) === i).slice(0, 40);
  // concentric corners: a rounded child within 8px of its rounded parent's corner should have radius ≈ parent radius − gap
  const er = el => { const r = el.getBoundingClientRect(); const v = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0; return Math.min(v, r.height / 2, r.width / 2); };
  const conc = [];
  for (const [ps, cs] of [['.lg-panel', ':scope > .lg-panel__group'], ['.lg-menu', ':scope > .lg-menu__item'], ['.lg-navbar__island', '.lg-btn, .lg-segmented'], ['.lg-tabbar__tabs', '.lg-tabbar__tab[aria-current]'], ['.lg-toolbar__group', ':scope > .lg-btn, :scope > .lg-segmented'], ['.lg-segmented', '.lg-segmented__thumb'], ['.lg-composer', ':scope > .lg-btn'], ['.lg-callout', ':scope .lg-btn'], ['.lg-modal', ':scope .lg-modal__header .lg-btn']]) {
    for (const p of document.querySelectorAll(ps)) {
      if (!vis(p)) continue;
      const pr = p.getBoundingClientRect(), R = er(p);
      for (const c of p.querySelectorAll(cs)) {
        if (!vis(c) || waived(c, 'nonConcentric')) continue;
        const cr = c.getBoundingClientRect(), r = er(c);
        const corners = [[cr.left - pr.left, cr.top - pr.top], [pr.right - cr.right, cr.top - pr.top], [cr.left - pr.left, pr.bottom - cr.bottom], [pr.right - cr.right, pr.bottom - cr.bottom]];
        const near = corners.map(([x, y]) => Math.max(x, y)).filter(g => g >= 0 && g <= 8);
        if (!near.length || R < 6) continue;
        const g = Math.min(...near), want = Math.max(0, R - g);
        if (Math.abs(r - want) > 2.5) conc.push(`${ps} R${Math.round(R)} gap${Math.round(g)} > ${c.className.toString().split(' ')[0]} r${Math.round(r)} (want ≈${Math.round(want)})`);
      }
    }
  }
  out.nonConcentric = [...new Set(conc)].slice(0, 20);
  // crowding: neighbouring glass elements on one row closer than 6px
  const crowd = [];
  for (let i = 0; i < glass.length; i++) for (let j = i + 1; j < glass.length; j++) {
    const a = glass[i].getBoundingClientRect(), b = glass[j].getBoundingClientRect();
    if (glass[i].contains(glass[j]) || glass[j].contains(glass[i]) || waived(glass[i], 'crowdedGlass') || waived(glass[j], 'crowdedGlass')) continue;
    const vOverlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top), hOverlap = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const gapX = Math.max(b.left - a.right, a.left - b.right), gapY = Math.max(b.top - a.bottom, a.top - b.bottom);
    if ((vOverlap > 4 && gapX >= 0 && gapX < 6) || (hOverlap > 4 && gapY >= 0 && gapY < 6)) crowd.push(glass[i].className.toString().split(' ')[0] + ' ↔ ' + glass[j].className.toString().split(' ')[0] + ' ' + Math.round(Math.max(gapX, gapY)) + 'px');
  }
  out.crowdedGlass = crowd.slice(0, 12);
  return out;
}"""
with sync_playwright() as p:
    b = p.chromium.launch()
    import re
    for theme in THEMES:
        for comp in CARDS:
            src = open(_os.path.join(DS,'components',comp,'preview.html')).read()
            m = re.search(r'width=(\d+)', src.splitlines()[0]); w = int(m.group(1)) if m else 1200
            html = src.replace('<html lang', f'<html data-theme="{theme}" lang', 1).replace('<head>', '<head><style>' + tok + '</style><style>' + css + '</style><script>' + js + '</script>', 1)
            hm = re.search(r'height=(\d+)', src.splitlines()[0]); hh = int(hm.group(1)) if hm else 1000
            pg = b.new_page(viewport={'width': w, 'height': hh}); pg.set_content(html); pg.wait_for_timeout(300)
            r = pg.evaluate(JS)
            print('=====', comp, theme); [print(' ', k, ':', v) for k, v in r.items() if v not in ([], 0, [[]])]
            bad = [f'{k} ({t})' for t, ks in TIERS.items() for k in ks if r.get(k)] + (['maxGlassPerFrame>8 (style)'] if r.get('maxGlassPerFrame', 0) > 8 else [])
            if bad: failed.append((comp, theme, bad))
            pg.close()
    b.close()
print('violations:', failed or 'none')
sys.exit(1 if failed else 0)
