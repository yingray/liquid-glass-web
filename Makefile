# Liquid Glass Web — build and check. Requires Python 3.10+ and Playwright (Chromium) for the browser checks.
PY ?= python3

.PHONY: build check contrast audit test shots site serve clean

build:            ## regenerate tokens.json and every preview.html from tools/
	$(PY) tools/tokens_build.py
	$(PY) tools/previews.py
	mkdir -p tools/.cache && $(PY) tools/compile_tokens.py tools/.cache/tokens.css

contrast:         ## worst-case contrast pairs (1019)
	$(PY) tools/check_contrast.py

audit: build      ## Apple "Adopting Liquid Glass" rule checks on the rendered previews
	$(PY) tools/audit.py

test: build       ## interaction tests and behaviour contracts in headless Chromium
	$(PY) tools/interact.py
	$(PY) tools/contracts.py

check: contrast audit test

shots: build      ## screenshots of every card in all six themes → tools/shots/
	$(PY) tools/render.py FloatingNavbar,GlassButton,SegmentedControl,Toolbar,GlassPanel,Modal,Patterns,Materials,ShowcaseDesktop,ShowcaseMobile,AppShell,Cover dark,light,dark-solid,light-solid,dark-contrast,light-contrast

site: build       ## static demo site for GitHub Pages → _site/ (home page + every card with the runtime added)
	$(PY) tools/site.py _site

serve: build      ## the same pages served from disk on 127.0.0.1:8810 for review (reload after make build)
	$(PY) tools/site.py --serve 8810

clean:
	rm -rf tools/.cache tools/shots tools/__pycache__ _site
