import sys
sys.path.insert(0, '.')
from contrast import cr, over
from palette import COLOR, THEMES

WHITE = (255, 255, 255, 1.0)
BLACK = (0, 0, 0, 1.0)


def v(n, t):
    x = COLOR[n][t]
    return v(x[1:-1], t) if x.startswith('{') else x


def bright(h, k):
    h = h.lstrip('#')
    return '#%02x%02x%02x' % tuple(min(255, round(int(h[i:i + 2], 16) * k)) for i in (0, 2, 4))


fails, rows = [], []


def chk(label, a, b, mn):
    r = cr(a, b)
    rows.append((label, round(r, 2), mn))
    if r < mn - 1e-9:
        fails.append((label, round(r, 2), mn))


for t, _ in THEMES:
    hc = 'contrast' in t
    TXT = 7.0 if hc else 4.5
    dark = t.startswith('dark')
    opposite = WHITE if dark else BLACK
    G = {k: v(k, t) for k in ['canvas', 'surface', 'surface-inset']}
    G['glass/canvas'] = over(v('glass', t), v('canvas', t))
    G['fill/canvas'] = over(v('fill', t), v('canvas', t))
    G['fill/surface'] = over(v('fill', t), v('surface', t))
    G['fill/glass'] = over(v('fill', t), G['glass/canvas'])
    G['fill/fill/glass'] = over(v('fill', t), G['fill/glass'])
    G['accent-soft/surface'] = over(v('accent-soft', t), v('surface', t))
    G['accent-soft/glass'] = over(v('accent-soft', t), G['glass/canvas'])
    G['warn-soft/glass'] = over(v('warn-soft', t), G['glass/canvas'])
    # every text colour on every resting ground
    for bgn, bg in G.items():
        for fg in (['ink', 'ink-muted'] if bgn == 'fill/fill/glass' else ['ink', 'ink-muted', 'accent-text']):
            chk(f'{t}: {fg} on {bgn}', v(fg, t), bg, TXT)
        chk(f'{t}: focus on {bgn}', v('focus', t), bg, 3.0)
    for bgn in ['canvas', 'surface', 'surface-inset', 'glass/canvas', 'fill/canvas']:
        chk(f'{t}: ink-faint (mark) on {bgn}', v('ink-faint', t), G[bgn], 3.0)
    for bgn in ['canvas', 'surface', 'surface-inset', 'glass/canvas', 'fill/glass', 'fill/surface']:
        for fg in ['ok', 'warn', 'danger']:
            chk(f'{t}: {fg} on {bgn}', v(fg, t), G[bgn], TXT)
    # selected / hover / pressed grounds carry ink only
    for bgn, bg in {'fill-strong/canvas': over(v('fill-strong', t), v('canvas', t)), 'fill-strong/surface': over(v('fill-strong', t), v('surface', t)),
                    'fill-strong/fill/glass': over(v('fill-strong', t), G['fill/glass']), 'fill-pressed/surface': over(v('fill-pressed', t), v('surface', t)),
                    'fill-pressed/glass': over(v('fill-pressed', t), G['glass/canvas'])}.items():
        chk(f'{t}: ink on {bgn}', v('ink', t), bg, TXT)
    # floating bar over scrolling content: scroll-edge over the opposite extreme, then glass
    W = over(v('glass', t), over(v('scroll-edge', t), opposite))
    for fg in ['ink', 'ink-muted', 'accent-text']:
        chk(f'{t}: {fg} on glass/scroll-edge/worst', v(fg, t), W, TXT)
    chk(f'{t}: ink-muted on fill/glass/scroll-edge/worst (unselected tab)', v('ink-muted', t), over(v('fill', t), W), TXT)
    chk(f'{t}: ink on fill-strong/fill/glass/worst (selected tab)', v('ink', t), over(v('fill-strong', t), over(v('fill', t), W)), TXT)
    chk(f'{t}: focus on glass/worst', v('focus', t), W, 3.0)
    chk(f'{t}: warn on warn-soft/glass', v('warn', t), G['warn-soft/glass'], TXT)
    chk(f'{t}: focus vs focus-inner', v('focus', t), v('focus-inner', t), 3.0)
    ks = [1.0, 0.9] if t == 'light-contrast' else [1.0, 1.08, 0.94]
    for k in ks:
        chk(f'{t}: on-accent on accent x{k}', v('on-accent', t), bright(v('accent', t), k), TXT)
    chk(f'{t}: on-ok on ok', v('on-ok', t), v('ok', t), TXT)
    chk(f'{t}: on-warn on warn', v('on-warn', t), v('warn', t), TXT)
    chk(f'{t}: on-danger on danger-fill', v('on-danger', t), v('danger-fill', t), TXT)
    chk(f'{t}: danger on fill/surface', v('danger', t), over(v('fill', t), v('surface', t)), TXT)
    chk(f'{t}: canvas (inverse btn text) on ink', v('canvas', t), v('ink', t), TXT)
    # selection outline: accent-text on light, accent on dark, vs canvas/surface (non-text 3:1)
    sel = v('accent', t) if dark else v('accent-text', t)
    for bgn in ['canvas', 'surface']:
        chk(f'{t}: selection ring vs {bgn}', sel, G[bgn], 3.0)
    if hc:
        for bgn in ['canvas', 'surface']:
            chk(f'{t}: line vs {bgn}', v('line', t), G[bgn], 3.0)
            chk(f'{t}: glass-edge vs {bgn}', v('glass-edge', t), G[bgn], 3.0)
            chk(f'{t}: line-outline vs {bgn}', v('line-outline', t), G[bgn], 3.0)
    # media: stage is always dark; worst case = brightest frame (white) under the scrims
    for zone in ['media-scrim-top', 'media-scrim-bottom']:
        for back, bn in [(WHITE, 'white'), (BLACK, 'black')]:
            dim = over(v(zone, t), back)
            mg = over(v('media-glass', t), dim)
            chk(f'{t}: ink-on-media on media-glass/{zone}/{bn}', v('ink-on-media', t), mg, TXT)
            muted = v('ink-on-media-muted', t)
            mc = over(muted, mg) if muted.startswith('rgba') else muted
            chk(f'{t}: ink-on-media-muted on media-glass/{zone}/{bn}', mc, mg, TXT)
            chk(f'{t}: media-warn on media-glass/{zone}/{bn}', v('media-warn', t), mg, TXT)
            chk(f'{t}: media-ok on media-glass/{zone}/{bn}', v('media-ok', t), mg, TXT)
            mf = over(v('media-fill', t), mg)
            chk(f'{t}: ink-on-media on media-fill/{zone}/{bn}', v('ink-on-media', t), mf, TXT)
            chk(f'{t}: focus (media, white ring) on media-glass/{zone}/{bn}', '#ffffff', mg, 3.0)
    for back, bn in [(WHITE, 'white'), (BLACK, 'black')]:
        ms = over(v('media-plate', t), back)
        muted = v('ink-on-media-muted', t)
        chk(f'{t}: ink-on-media on media-plate/{bn} (no scrim)', v('ink-on-media', t), ms, TXT)
        chk(f'{t}: ink-on-media-muted on media-plate/{bn} (no scrim)', over(muted, ms) if muted.startswith('rgba') else muted, ms, TXT)
        chk(f'{t}: media-warn on media-plate/{bn} (no scrim)', v('media-warn', t), ms, TXT if TXT < 7 else 4.5)
    # thick glass floats over anything: test both extremes, resting, hover and pressed
    for back, bn in [(WHITE, 'white'), (BLACK, 'black')]:
        T0 = over(v('glass-thick', t), back)
        for fg in ['ink', 'ink-muted', 'accent-text', 'danger', 'ok', 'warn']:
            chk(f'{t}: {fg} on glass-thick/{bn}', v(fg, t), T0, TXT)
        TH = over(v('fill', t), T0)
        for fg in ['ink', 'ink-muted', 'danger']:
            chk(f'{t}: {fg} on fill/glass-thick/{bn} (hover)', v(fg, t), TH, TXT)
        chk(f'{t}: ink on fill-pressed/glass-thick/{bn}', v('ink', t), over(v('fill-pressed', t), T0), TXT)
        chk(f'{t}: ink on fill-strong/fill/glass-thick/{bn} (segmented in sheet)', v('ink', t), over(v('fill-strong', t), over(v('fill', t), T0)), TXT)
        chk(f'{t}: ink-muted on fill/glass-thick/{bn} (segmented track)', v('ink-muted', t), TH, TXT)
        chk(f'{t}: ink-muted on surface-inset (input in sheet)', v('ink-muted', t), v('surface-inset', t), TXT)
        chk(f'{t}: focus on glass-thick/{bn}', v('focus', t), T0, 3.0)
    # inverse-on-media (white play button) text
    chk(f'{t}: dark text on white media button', '#16141c', '#ffffff', TXT)
    # the stage is always dark-toned: light themes resolve to their dark counterpart there
    dt = t.replace('light', 'dark')
    chk(f'{t}: accent (stage tone {dt}) on stage', v('accent', dt), v('stage', dt), 3.0)

print('checks:', len(rows), 'fails:', len(fails))
for f in fails:
    print('FAIL', f)
if '-v' in sys.argv:
    for r in rows:
        print(r)

if fails:
    sys.exit(1)
