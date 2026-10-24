import re
def parse(c):
    c=c.strip()
    if c.startswith('#'):
        h=c[1:]
        if len(h)==3: h=''.join(x*2 for x in h)
        r,g,b=int(h[0:2],16),int(h[2:4],16),int(h[4:6],16); a=1.0
        if len(h)==8: a=int(h[6:8],16)/255
        return (r,g,b,a)
    m=re.match(r'rgba?\(([^)]*)\)',c)
    p=[float(x) for x in re.split(r'[ ,/]+',m.group(1).strip()) if x]
    return (p[0],p[1],p[2],p[3] if len(p)>3 else 1.0)
def over(top,bottom):
    r,g,b,a=parse(top) if isinstance(top,str) else top
    R,G,B,A=parse(bottom) if isinstance(bottom,str) else bottom
    assert A==1
    return (r*a+R*(1-a), g*a+G*(1-a), b*a+B*(1-a), 1.0)
def lum(c):
    r,g,b,a=parse(c) if isinstance(c,str) else c
    def ch(v):
        v/=255
        return v/12.92 if v<=0.04045 else ((v+0.055)/1.055)**2.4
    return 0.2126*ch(r)+0.7152*ch(g)+0.0722*ch(b)
def cr(a,b):
    la,lb=lum(a),lum(b)
    if la<lb: la,lb=lb,la
    return (la+0.05)/(lb+0.05)
