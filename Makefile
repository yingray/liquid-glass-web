# Liquid Glass Web — build and check. Requires Python 3.10+ and Playwright (Chromium) for the browser checks.
PY ?= python3

.PHONY: build check contrast audit test shots clean

build:            ## regenerate tokens.json and every preview.html from tools/
	$(PY) tools/tokens_build.py
	$(PY) tools/previews.py
	mkdir -p tools/.cache && $(PY) tools/compile_tokens.py tools/.cache/tokens.css

contrast:         ## 905 worst-case contrast pairs
	$(PY) tools/check_contrast.py

audit: build      ## Apple "Adopting Liquid Glass" rule checks on the rendered previews
	$(PY) tools/audit.py

test: build       ## interaction tests in headless Chromium
	$(PY) tools/interact.py

check: contrast audit test

shots: build      ## screenshots of every card in all six themes → tools/shots/
	$(PY) tools/render.py FloatingNavbar,GlassButton,SegmentedControl,Toolbar,GlassPanel,Modal,Patterns,Materials,ShowcaseDesktop,ShowcaseMobile,Cover dark,light,dark-solid,light-solid,dark-contrast,light-contrast

clean:
	rm -rf tools/.cache tools/shots tools/__pycache__
