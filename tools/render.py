import os as _os
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
DS = _os.path.join(ROOT, 'design-system')
CACHE = _os.path.join(ROOT, 'tools', '.cache')
import re, sys, os, json
from playwright.sync_api import sync_playwright
COMP=_os.path.join(DS,'components')
OUT=_os.path.join(ROOT,'tools','shots'); os.makedirs(OUT, exist_ok=True)
os.makedirs(CACHE, exist_ok=True); os.system(f'python3 {ROOT}/tools/compile_tokens.py {CACHE}/tokens.css >/dev/null')
css_tokens=open(_os.path.join(CACHE,'tokens.css')).read()
css_bundle=open(COMP+'/bundle.css').read()
js_bundle=open(COMP+'/bundle.js').read()
names=sys.argv[1].split(',')
themes=sys.argv[2].split(',') if len(sys.argv)>2 else ['light','dark']
with sync_playwright() as p:
    b=p.chromium.launch()
    for n in names:
        src=open(f'{COMP}/{n}/preview.html').read()
        m=re.search(r'@dsCard([^>]*)-->',src.splitlines()[0])
        width=int(re.search(r'width=(\d+)',m.group(1)).group(1)) if m and 'width=' in m.group(1) else 960
        for th in themes:
            html=src.replace('<html lang','<html data-theme="%s" lang'%th,1)
            html=html.replace('<head>','<head><style>'+css_tokens+'</style><style>'+css_bundle+'</style><script>'+js_bundle+'</script>',1)
            hm=re.search(r'height=(\d+)',m.group(1)) if m else None
            pg=b.new_page(viewport={'width':width,'height':int(hm.group(1)) if hm else 800}, device_scale_factor=1)
            errs=[]
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.on('console', lambda m: errs.append('console:'+m.text) if m.type=='error' else None)
            pg.route('**/fonts.googleapis.com/**', lambda r: r.abort())
            pg.set_content(html, wait_until='load')
            pg.wait_for_timeout(500)
            pg.screenshot(path=f'{OUT}/{n}-{th}.png', full_page=True)
            h=pg.evaluate('document.documentElement.scrollHeight')
            print(n, th, 'h=',h, 'errors:', [e for e in errs if 'fonts.googleapis' not in e and 'ERR_FAILED' not in e])
            pg.close()
    b.close()
