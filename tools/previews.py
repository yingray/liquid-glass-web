"""Regenerate every design-system/components/<Comp>/preview.html from previews_head.py + previews_body.py."""
import os
here = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(here, 'previews_head.py')).read() + '\n' + open(os.path.join(here, 'previews_body.py')).read()
exec(compile(src, 'previews', 'exec'), {'__file__': os.path.join(here, 'previews_head.py'), '__name__': '__main__'})
