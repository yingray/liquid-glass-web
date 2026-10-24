import os as _os
ROOT = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
DS = _os.path.join(ROOT, 'design-system')
CACHE = _os.path.join(ROOT, 'tools', '.cache')
import json, sys, collections
sys.path.insert(0, '.')
from palette import COLORS, THEMES

OUT = _os.path.join(DS, 'tokens.json')
NONE = "inset 0 0 0 0 rgba(0, 0, 0, 0)"


def fam(note, items):
    return {"note": note, "tokens": [{"name": n, "value": v, "usage": u} for n, v, u in items]}


def themed(D, L, DS=None, LS=None, DC=None, LC=None):
    DS = D if DS is None else DS
    LS = L if LS is None else LS
    DC = DS if DC is None else DC
    LC = LS if LC is None else LC
    return {"dark": D, "light": L, "dark-solid": DS, "light-solid": LS, "dark-contrast": DC, "light-contrast": LC}


def st(name, size, lh, w, usage, sample, ls=None, family=None, comfy=None):
    d = {"name": name, "fontSize": size, "lineHeight": lh, "fontWeight": w, "sample": sample, "usage": usage}
    if comfy:
        d["comfortable"] = {"fontSize": comfy[0], "lineHeight": comfy[1]}
    if ls:
        d["letterSpacing"] = ls
    if family:
        d["family"] = family
    return d


tokens = {
    "name": "Liquid Glass Web", "version": 2,
    "color": {
        "note": "Six themes: dark (default) and light, each with Solid (reduced transparency) and high-contrast versions. The alpha of glass, stage and scrims is this system's transparency design variable. Each text color's usage note states which backgrounds it may sit on; every pairing, including hover and pressed states, is verified by calculation in tools/check_contrast.py (≥ 4.5:1 normal, ≥ 7:1 high contrast, ≥ 3:1 for required non-text boundaries).",
        "themes": [{"id": i, "name": n} for i, n in THEMES],
        "tokens": [{"name": n, "value": v, "usage": u} for n, v, u in COLORS]},
    "type": {
        "fonts": [],
        "families": {
            "sans": "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang TC\", \"Noto Sans TC\", \"Microsoft JhengHei\", system-ui, sans-serif",
            "mono": "ui-monospace, \"SF Mono\", Menlo, Consolas, monospace"},
        "groups": [
            {"name": "Display", "family": "sans", "note": "Titles are always 600 weight with negative tracking (bundle.css resets tracking to zero for CJK titles). display-1 is only for website hero headings; app interfaces start at title-1.", "styles": [
                st("display-1", "56px", "60px", 600, "Website hero heading, at most once per page. Below 744px, use display-1-sm.", "Light, shaped.", "-0.03em"),
                st("display-1-sm", "36px", "40px", 600, "Mobile version of display-1.", "Let content lead.", "-0.024em"),
                st("title-1", "30px", "34px", 600, "Page or item title (one character, one project). Unchanged on mobile.", "Mia", "-0.02em"),
                st("title-2", "22px", "28px", 600, "Section headings on website pages.", "Views and scenes", "-0.015em"),
                st("title-3", "17px", "22px", 600, "Titles for panels and sheets (Modal).", "Add a Version", "-0.01em")]},
            {"name": "Text", "family": "sans", "note": "Two densities. Compact (the default at ≥ 744px with a fine pointer) is based on 14px: 13px is the workhorse size for controls and lists. Comfortable (the default below 744px, or html[data-density=\"comfortable\"]) is based on 16px, for phones, forms and long reading. Each style is also a --type-<name> font shorthand, so components follow the density. Text 13px or smaller on glass uses the 600-weight styles. Key navigation and status never rely on micro.", "styles": [
                st("headline", "15px", "20px", 600, "Subsection headings in the content area.", "Views and scenes", comfy=("17px", "22px")),
                st("body-strong", "14px", "20px", 600, "Subsection headings in panels, current item in the nav bar.", "Needs Your Action", comfy=("16px", "24px")),
                st("body", "14px", "20px", 400, "Default interface text; set on <html>.", "On an opaque surface, effects never get in the way of reading.", comfy=("16px", "24px")),
                st("body-lg", "15px", "22px", 400, "Descriptions, explanatory paragraphs, inputs in sheets.", "25, short black hair, red raincoat", comfy=("17px", "24px")),
                st("lead", "17px", "26px", 400, "Intro paragraphs on website pages.", "Glass belongs only to the navigation layer; content always comes first."),
                st("label", "13px", "18px", 600, "md buttons, segmented controls, nav links, list-row titles.", "Export", comfy=("15px", "20px")),
                st("callout", "13px", "18px", 400, "List-row body text, toasts, text in the nav bar.", "Act 2 · 4 candidates", comfy=("15px", "20px")),
                st("footnote", "12.5px", "18px", 400, "Activity log, captions on media, secondary sentences.", "2 min ago · You approved #1", comfy=("13px", "18px")),
                st("label-sm", "12px", "16px", 600, "sm buttons, badges, small segmented controls; with ink-muted, group headers (title-style capitalization, never all caps).", "Running and Queued", comfy=("13px", "18px")),
                st("caption", "12px", "16px", 400, "List-row subtitles, legends.", "Keyframe · 4 candidates", comfy=("13px", "18px")),
                st("tab", "10.5px", "14px", 600, "Tab bar labels under their icon. Comfortable raises them to 12px: do not shrink tab labels to fit more tabs; use a menu for the rest.", "Library", comfy=("12px", "16px")),
                st("micro", "10.5px", "14px", 700, "Smallest badge text (“Recommended”, numbers on thumbnails). Never the only carrier of key information.", "Pick", comfy=("12px", "16px"))]},
            {"name": "Mono", "family": "mono", "note": "Numbers, IDs, timecodes and shortcuts are always monospaced.", "styles": [
                st("mono", "12px", "16px", 400, "Quantities, timecodes, counts.", "0:13 / 0:47", comfy=("13px", "18px")),
                st("mono-label", "12px", "16px", 600, "ID and scope labels (S03, @film).", "S03", comfy=("13px", "18px")),
                st("mono-sm", "11px", "14px", 400, "Shortcut hints, timeline ticks.", "⌘K", comfy=("12px", "16px"))]}]},
    "spacing": fam("Named in pixels; the name is the value. 2, 6, 10 and 14 are half steps for capsule insets and compact lists.", [
        ("space-2", "2px", "Between segmented-control items; between a label and its subtitle."),
        ("space-4", "4px", "Between list rows; minimum gap between icon and text."),
        ("space-6", "6px", "Capsule inset (30–32px controls in a 42px capsule), list-row vertical padding."),
        ("space-8", "8px", "Between buttons, card-grid gaps, mobile nav margins."),
        ("space-10", "10px", "Between nav islands, panel horizontal padding, gap between stage and sidebar."),
        ("space-12", "12px", "Gap between thumbnail and text in list rows, block spacing in sheets."),
        ("space-14", "14px", "Panel vertical padding, left text padding in capsules."),
        ("space-16", "16px", "Button horizontal padding (md), card padding, mobile page margins."),
        ("space-20", "20px", "Sheet horizontal padding, distance from the desktop nav bar to the window sides."),
        ("space-24", "24px", "Between sections inside a panel."),
        ("space-28", "28px", "Content-area horizontal padding (apps)."),
        ("space-36", "36px", "Between the two columns of the content area."),
        ("space-48", "48px", "Website pages: mobile section spacing."),
        ("space-64", "64px", "Website pages: desktop page margins."),
        ("space-96", "96px", "Website pages: desktop section spacing, hero vertical whitespace.")]),
    "radius": fam("Concentric rule: when the gap between two nested corners is ≤ 8px, inner radius = outer radius − gap (sidebar 28 inset 6 → group 22; menu 22 inset 6 → item 16). Glass controls are always capsules.", [
        ("radius-xs", "8px", "Smallest thumbnails (48 × 30)."),
        ("radius-sm", "10px", "List thumbnails, timeline clips, small blocks inside forms."),
        ("radius-md", "12px", "List rows, small media thumbnails, hint boxes."),
        ("radius-lg", "16px", "Media frames in the stage, rows in panel groups, menu items, callouts."),
        ("radius-xl", "18px", "Content cards, recommendation callouts, text areas."),
        ("radius-2xl", "22px", "Menus and popovers, groups in the sidebar, long toolbars on the stage."),
        ("radius-3xl", "24px", "Stage, panels docked at the bottom."),
        ("radius-panel", "28px", "Sidebar and inspector (GlassPanel)."),
        ("radius-sheet", "32px", "Sheets (Modal)."),
        ("radius-capsule", "999px", "Nav islands, buttons, segmented controls, toolbars, composer, badges.")]),
    "shadow": {"note": "Glass depth = inner specular highlight (a 1px bright top line) + outer elevation-* shadow, combined with a comma. High-contrast themes turn every highlight and elevation off: a border-strong line separates the layers instead.", "tokens": [
        {"name": "specular", "value": themed("inset 0 1px 0 rgba(255, 255, 255, 0.18)", "inset 0 1px 0 rgba(255, 255, 255, 0.95)", DS="inset 0 1px 0 rgba(255, 255, 255, 0.06)", LS="inset 0 1px 0 rgba(255, 255, 255, 0.9)", DC=NONE, LC=NONE), "usage": "Top-edge specular highlight for all glass."},
        {"name": "specular-media", "value": themed("inset 0 1px 0 rgba(255, 255, 255, 0.18)", "inset 0 1px 0 rgba(255, 255, 255, 0.18)", DC=NONE, LC=NONE), "usage": "Top-edge highlight for media-glass on the stage (dark glass in every theme)."},
        {"name": "elevation-glass", "value": themed("0 10px 30px rgba(0, 0, 0, 0.4)", "0 10px 30px rgba(40, 30, 80, 0.14)", DC="0 0 0 0 rgba(0, 0, 0, 0)", LC="0 0 0 0 rgba(0, 0, 0, 0)"), "usage": "Nav islands, sidebar, toolbar, composer. In the light theme, this violet-tinted shadow separates glass from the background."},
        {"name": "elevation-menu", "value": themed("0 16px 40px rgba(0, 0, 0, 0.28)", "0 16px 40px rgba(0, 0, 0, 0.28)", LS="0 16px 40px rgba(40, 30, 80, 0.2)", DC=NONE, LC=NONE), "usage": "Menus, popovers, toasts."},
        {"name": "elevation-sheet", "value": themed("0 -8px 48px rgba(0, 0, 0, 0.35)", "0 -8px 48px rgba(0, 0, 0, 0.35)", DC=NONE, LC=NONE), "usage": "Sheets (Modal)."},
        {"name": "elevation-media", "value": themed("0 10px 30px rgba(0, 0, 0, 0.35)", "0 10px 30px rgba(0, 0, 0, 0.35)", DC=NONE, LC=NONE), "usage": "Playback toolbar on the stage."},
        {"name": "elevation-thumb", "value": themed("0 1px 3px rgba(0, 0, 0, 0.12)", "0 1px 3px rgba(0, 0, 0, 0.12)", DC=NONE, LC=NONE), "usage": "Selected thumb of segmented controls."},
        {"name": "elevation-pin", "value": themed("0 4px 14px rgba(0, 0, 0, 0.45)", "0 4px 14px rgba(0, 0, 0, 0.45)", DC=NONE, LC=NONE), "usage": "Markers on the stage, recommendation badges."}]},
    "blur": fam("Restrained blur. Restrained (default) uses blur-glass; websites may offer a Stronger option (data-glass=\"strong\"). Never animate blur.", [
        ("blur-chip", "12px", "Small labels and small round buttons on the stage."),
        ("blur-glass", "18px", "Nav islands, sidebar, toolbar, composer (Restrained)."),
        ("blur-glass-strong", "32px", "blur-glass in Stronger mode."),
        ("blur-popover", "28px", "Menus, popovers, toasts, half-height sheets: they cover other interface elements and need more blur."),
        ("blur-extend", "40px", "Background extension (lg-extend): blur used when the image beside the sidebar is mirrored to extend beneath it.")]),
    "glass": fam("Glass filter parameters. bundle.js writes refraction-* into an SVG displacement filter; Chromium only.", [
        ("glass-saturate", "170%", "Backdrop saturation boost (Restrained)."),
        ("glass-saturate-strong", "210%", "Saturation in Stronger mode."),
        ("refraction-scale", "14", "Refraction displacement (px). Above 20, text distorts noticeably."),
        ("refraction-edge", "14", "Width of the refraction edge band (px); the center stays sharp.")]),
    "border": fam("Glass edges, selection outlines and focus rings.", [
        ("border-hairline", "1px", "Glass edges, outline buttons."),
        ("border-strong", "2px", "Glass and control borders in high-contrast themes."),
        ("ring-selected", "3px", "Outline of a selected media frame (inset 3px)."),
        ("focus-width", "2px", "Outer focus-ring width."),
        ("focus-gap", "2px", "Inner focus-ring gap width.")]),
    "opacity": fam("Disabled and hover intensities.", [
        ("opacity-disabled", "0.5", "Disabled buttons and controls (colors unchanged; overall opacity reduced)."),
        ("brightness-hover", "1.08", "Hover for accent and solid fills (filter: brightness)."),
        ("brightness-pressed", "0.94", "Pressed state for accent and solid fills.")]),
    "duration": fam("With reduced motion, all translation, scaling and morphing is off; only fades ≤ duration-fast remain.", [
        ("duration-instant", "90ms", "Press feedback."),
        ("duration-fast", "150ms", "Color, hover, focus, media zoom."),
        ("duration-base", "240ms", "Segmented thumb movement, menu expansion."),
        ("duration-slow", "380ms", "Sheet entrance and exit."),
        ("duration-progress", "300ms", "Progress-bar width changes.")]),
    "easing": fam("The gel-like feel comes only from the small overshoot of ease-spring (about 8%), used only for press release and thumb settling.", [
        ("ease-standard", "cubic-bezier(0.2, 0, 0, 1)", "Default: color, fade-in, translation."),
        ("ease-emphasized", "cubic-bezier(0.32, 0.72, 0, 1)", "Sheets, menu expansion."),
        ("ease-exit", "cubic-bezier(0.4, 0, 1, 1)", "Exits."),
        ("ease-spring", "linear(0, 0.064 4%, 0.26 9%, 0.542 15%, 0.821 22%, 1.011 30%, 1.079 38%, 1.076 46%, 1.043 55%, 1.01 65%, 0.995 76%, 0.994 88%, 1)", "Bounce on press release, segmented thumb settling.")]),
    "zIndex": fam("Fixed layer order.", [
        ("z-content", "0", "Content layer and stage."),
        ("z-panel", "5", "Sidebar and inspector pinned beside content."),
        ("z-menu", "20", "Menus and popovers."),
        ("z-nav", "40", "Floating nav islands and scroll edge."),
        ("z-toast", "45", "Toasts."),
        ("z-overlay", "60", "Full-screen preview (sheets use the native dialog top layer and don't need this value).")]),
    "layout": fam("Fixed sizes. The 744px and 1100px breakpoints live in CSS container and media queries and cannot use variables.", [
        ("control-xs", "26px", "Small segmented controls and filter chips on the stage."),
        ("control-seg", "30px", "Default segmented-control item height (a 36px track with the 3px inset)."),
        ("control-sm", "32px", "Buttons in nav islands, compact buttons, close buttons."),
        ("control-md", "36px", "Default buttons and round icon buttons."),
        ("control-lg", "44px", "Primary confirm buttons; minimum size on touch devices."),
        ("control-xl", "50px", "Composer."),
        ("nav-height", "42px", "Nav island height."),
        ("nav-top", "14px", "Nav island offset from the top of the viewport."),
        ("nav-side", "20px", "Nav island offset from the viewport sides (below 744px, use nav-inset-mobile)."),
        ("nav-gap", "10px", "Between nav islands."),
        ("nav-inset-mobile", "8px", "Mobile nav island and tab bar offset from the viewport edges (plus safe area)."),
        ("tabbar-height", "56px", "Mobile tab bar (< 744px) capsule height; the search button on the right is a circle of the same height."),
        ("tabbar-height-min", "44px", "Tab bar height after shrinking on scroll down (every tab stays, icons only, each at least 44px wide)."),
        ("content-top", "68px", "Top margin of the first block below the nav (nav-top + nav-height + 12). This is the desktop, fine-pointer value: bundle.css derives the live value from the same navbar geometry (inset + safe area + island height, which is taller on touch), so content, scroll-padding, the scroll edge and the menu never disagree."),
        ("toolbar-height", "48px", "Toolbar capsule height (36px controls + 6px inset)."),
        ("aside-width", "348px", "Right inspector width (≥ 1100px)."),
        ("aside-width-compact", "300px", "Right inspector width (744–1099px)."),
        ("rail-width", "270px", "Left rail width (≥ 1100px)."),
        ("rail-width-compact", "200px", "Left rail width (744–1099px)."),
        ("composer-max", "760px", "Maximum composer width."),
        ("menu-width", "300px", "Width of menus, the queue and other popovers."),
        ("menu-width-sm", "240px", "Width of small menus on cards."),
        ("sheet-width", "820px", "Sheet width."),
        ("sheet-width-compact", "480px", "Width of a single-question sheet."),
        ("layout-max", "1280px", "Maximum content width on website pages."),
        ("layout-text", "680px", "Long-form text column width."),
        ("gutter-mobile", "16px", "Page side margins (< 744px)."),
        ("gutter-desktop", "64px", "Side margins on website pages (≥ 1100px)."),
        ("target-min", "44px", "Minimum touch target size."),
        ("icon-sm", "13px", "Icons in small buttons and status bars."),
        ("icon-md", "16px", "Default icons (16 grid, 1.6px stroke, round caps)."),
        ("icon-lg", "20px", "Icons in large buttons and empty states.")]),
}
json.dump(tokens, open(OUT, 'w'), ensure_ascii=False, indent=1)
names = [t['name'] for t in tokens['color']['tokens']]
for k, v in tokens.items():
    if isinstance(v, dict) and 'tokens' in v and k != 'color':
        names += [t['name'] for t in v['tokens']]
print('written; tokens', len(names), 'dupes', [n for n, c in collections.Counter(names).items() if c > 1])
print('styles', sum(len(g['styles']) for g in tokens['type']['groups']))
