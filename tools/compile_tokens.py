import os as _os
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
DS = _os.path.join(ROOT, 'design-system')
CACHE = _os.path.join(ROOT, 'tools', '.cache')
# Local stand-in for the page's tokens.css compiler (for testing only, not published)
import json,re,sys
src=_os.path.join(DS, 'tokens.json')
t=json.load(open(src))
themes=[x['id'] for x in t['color']['themes']]
def val(v,th):
    if isinstance(v,str): return v if th==themes[0] else None
    return v.get(th)
def css_val(x):
    m=re.fullmatch(r'\{(.+)\}',x)
    return f'var(--{m.group(1)})' if m else x
out=['/* Liquid Glass Web — generated from tokens.json (local test copy) */']
for i,th in enumerate(themes):
    sel=':root, [data-theme="%s"]'%th if i==0 else '[data-theme="%s"]'%th
    lines=[]
    for tok in t['color']['tokens']+t['shadow']['tokens']:
        v=tok['value']; x=val(v,th) if not isinstance(v,str) else (v if i==0 else None)
        if x is None and not isinstance(v,str): x=v.get(themes[0])
        if x is None: continue
        lines.append(f'  --{tok["name"]}: {css_val(x)};')
    out.append(sel+' {\n'+'\n'.join(lines)+'\n}')
lines=[]
for fam in ['spacing','radius','blur','glass','border','opacity','duration','easing','zIndex','layout']:
    for tok in t[fam]['tokens']: lines.append(f'  --{tok["name"]}: {tok["value"]};')
for k,v in t['type']['families'].items(): lines.append(f'  --font-{k}: {v};')
out.append(':root {\n'+'\n'.join(lines)+'\n}')
# type roles: each text style is also a --type-<name> font shorthand, so components follow the density.
# Compact is the default; comfortable applies below 744px (unless data-density="compact") or under data-density="comfortable".
def shorthand(s, fam, size, lh):
    return f'{s["fontWeight"]} {size}/{lh} var(--font-{fam})'
compact, comfy = [], []
for g in t['type']['groups']:
    for s in g['styles']:
        fam=s.get('family',g['family'])
        compact.append(f'  --type-{s["name"]}: {shorthand(s, fam, s["fontSize"], s["lineHeight"])};')
        c=s.get('comfortable')
        if c: comfy.append(f'  --type-{s["name"]}: {shorthand(s, fam, c["fontSize"], c["lineHeight"])};')
out.append(':root, [data-density="compact"] {\n'+'\n'.join(compact)+'\n}')
out.append('[data-density="comfortable"] {\n'+'\n'.join(comfy)+'\n}')
out.append('@media (max-width: 743px) {\n  :root:not([data-density="compact"]) {\n'+'\n'.join('  '+x for x in comfy)+'\n  }\n}')
for g in t['type']['groups']:
    for s in g['styles']:
        d=[f'font: var(--type-{s["name"]})']
        if 'letterSpacing' in s: d.append(f'letter-spacing: {s["letterSpacing"]}')
        out.append(f'.{s["name"]} {{ '+'; '.join(d)+'; }')
open(sys.argv[1],'w').write('\n'.join(out)+'\n'); print('ok')
