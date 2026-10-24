# Liquid Glass Web v2 — colour source of truth, derived from the Studio reference.
# Theme order: dark first (the reference's default), then light, then the solid and high-contrast pairs.
THEMES = [("dark", "Dark"), ("light", "Light"), ("dark-solid", "Dark · Solid"), ("light-solid", "Light · Solid"),
          ("dark-contrast", "Dark · High contrast"), ("light-contrast", "Light · High contrast")]
COLORS = []


def c(name, D, L, usage, DS=None, LS=None, DC=None, LC=None):
    DS = D if DS is None else DS
    LS = L if LS is None else LS
    DC = DS if DC is None else DC
    LC = LS if LC is None else LC
    COLORS.append((name, {"dark": D, "light": L, "dark-solid": DS, "light-solid": LS, "dark-contrast": DC, "light-contrast": LC}, usage))


# ---- content layer
c("canvas", "#0e0d12", "#f2f1f5", "Page background. Floating glass (nav bar, sidebar, toolbar) sits on this color by default.", DC="#000000", LC="#ffffff")
c("surface", "#17161c", "#ffffff", "Opaque content surface: sheets (Modal), cards, forms.", DC="#0b0b0e", LC="#ffffff")
c("surface-inset", "#1f1e25", "#f0eef4", "Inset surface: inputs, text areas, completed notes. Place on surface or glass.", DC="#16151b", LC="#efedf3")
c("stage", "#09080c", "#09080c", "Background of the media stage (video, images, previews). Dark in every theme; always add data-tone=\"dark\" inside the stage.", DC="#000000", LC="#000000")
c("line", "#2a2930", "#e3e1e9", "Decorative dividers, progress-bar tracks, dashed add boxes. Carries no meaning (exempt from 3:1); high-contrast themes raise it to ≥ 3:1.", DC="#8a8698", LC="#6e6a7a")
c("line-outline", "rgba(255, 255, 255, 0.22)", "rgba(22, 20, 28, 0.18)", "1px border for outline buttons.", DC="#b8b4c4", LC="#4a4752")
# ---- text
c("ink", "#eeebf4", "#1a1920", "Primary text and icons. Use on canvas, surface, surface-inset, fill, and glass with a scroll edge (worst case verified ≥ 4.5:1).", DC="#ffffff", LC="#000000")
c("ink-muted", "#a19dad", "#625e6d", "Secondary text: descriptions, metadata, unselected tabs. Use on all opaque surfaces and glass (same conditions as ink).", DC="#e0dde7", LC="#2e2b36")
c("ink-faint", "#6f6b7b", "#858192", "Non-text marks only: arrows, ticks, status dots, decoration other than placeholders. ≥ 3:1, below the 4.5:1 text minimum; never use for text. Light value darkened from the reference's #8f8b9a to reach 3:1.", DC="#a7a3b3", LC="#5d5969")
c("ink-on-media", "#ffffff", "#ffffff", "Text and icons on the stage and images (pair with media-glass or media-scrim).")
c("ink-on-media-muted", "rgba(255, 255, 255, 0.72)", "rgba(255, 255, 255, 0.72)", "Secondary text on the stage. Raised from the reference's 0.62 to keep 4.5:1 on bright frames after the scrim.", DC="#e4e2ea", LC="#e4e2ea")
# ---- accent
c("accent", "#a78bfa", "#a78bfa", "Fill for primary actions (Export, Send, Approve), selection outlines, progress. Text on it always uses on-accent. In the light theme the fill is only 2.4:1 against the background, so light selection outlines use accent-text instead.", DC="#c4b3ff", LC="#5236c4")
c("on-accent", "#16141c", "#16141c", "Text and icons on accent (dark text, ≥ 5.9:1 in hover and pressed states).", DC="#000000", LC="#ffffff")
c("accent-text", "#b9a3fc", "#6a4bd6", "Accent-colored text, links, and light-theme selection outlines. Use on all opaque surfaces, fill, accent-soft and glass.", DC="#ddd3ff", LC="#4a2fc0")
c("accent-soft", "rgba(167, 139, 250, 0.14)", "rgba(167, 139, 250, 0.14)", "Soft accent background: recommendation callouts, selected rows.", DC="rgba(196, 179, 255, 0.22)", LC="rgba(91, 63, 208, 0.12)")
c("link", "{accent-text}", "{accent-text}", "Body-text links; alias of accent-text.", "{accent-text}", "{accent-text}", "{accent-text}", "{accent-text}")
c("focus", "#b9a3fc", "#6a4bd6", "Outer keyboard focus ring (2px). ≥ 3:1 against canvas, surface, glass and stage.", DC="#ffffff", LC="#000000")
c("focus-inner", "#0e0d12", "#ffffff", "Inner focus-ring gap (2px), keeping the ring visible on images and accent.", DC="#000000", LC="#ffffff")
# ---- status
c("ok", "#74c48a", "#247540", "Done, approved: status dots and status text. Light value darkened from the reference's #2f8f4e to keep 4.5:1 in the thick-glass worst case.", DC="#8ee0a2", LC="#16532a")
c("on-ok", "#10200f", "#ffffff", "Text on ok fill (“Approved” badge).", DC="#000000", LC="#ffffff")
c("warn", "#e8b45c", "#8f5a06", "Needs a decision, missing sources: status dots and status text. Light value darkened from the reference's #a86b0c to reach 4.5:1.", DC="#f5c97a", LC="#5f3b02")
c("on-warn", "#16141c", "#ffffff", "Text on warn fill (count badges).", DC="#000000", LC="#ffffff")
c("warn-soft", "rgba(232, 180, 92, 0.14)", "rgba(168, 107, 12, 0.12)", "Soft warn background: callouts for questions and missing items.", DC="rgba(245, 201, 122, 0.22)", LC="rgba(110, 69, 3, 0.12)")
c("danger", "#f47a75", "#b5242a", "Text for destructive actions (“Delete” in menus, tinted delete buttons). Dark value lightened from the reference's #e9504d and light value darkened to keep 4.5:1 in the menu-hover worst case.", DC="#ffa39f", LC="#8a1419")
c("danger-fill", "#d33a3c", "#d33a3c", "Fill for confirmed destructive actions (press again to delete). The reference's #e8605b with white text is only 3.4:1, so it is darkened.", DC="#ff8a85", LC="#9c1a1f")
c("on-danger", "#ffffff", "#ffffff", "Text on danger-fill.", DC="#000000", LC="#ffffff")
c("media-warn", "#f1c77e", "#f1c77e", "Issue markers on the stage (dashed circles, labels).")
c("media-ok", "#9be0ae", "#9be0ae", "Done-state text on the stage.")
# ---- fills (state layers, segmented)
c("fill", "rgba(255, 255, 255, 0.07)", "rgba(0, 0, 0, 0.05)", "Segmented-control tracks, tinted buttons, group backgrounds, list-row hover (rows inside a group add another fill layer). Can sit inside glass (it is not glass).", DC="rgba(255, 255, 255, 0.14)", LC="rgba(0, 0, 0, 0.08)")
c("fill-strong", "rgba(255, 255, 255, 0.16)", "#ffffff", "Segmented-control selected thumb, tinted-button hover. Only ink goes on it (ink-muted is only 4.2:1 here in the dark theme). List-row hover uses fill.", DC="#3d3a48", LC="#ffffff")
c("fill-pressed", "rgba(255, 255, 255, 0.22)", "rgba(0, 0, 0, 0.1)", "Pressed state for tinted and plain buttons.", DC="#4d4a59", LC="rgba(0, 0, 0, 0.16)")
# ---- glass material
c("glass", "rgba(32, 31, 40, 0.5)", "rgba(255, 255, 255, 0.58)", "Regular glass: nav island, tab bar, sidebar, toolbar, composer — on canvas, or with lg-scroll-edge when content scrolls beneath. Menus and toasts over arbitrary content use glass-thick. Opaque in Solid and high-contrast themes.", DS="#18171d", LS="#fbfafc", DC="#000000", LC="#ffffff")
c("glass-thick", "rgba(22, 21, 28, 0.94)", "rgba(255, 255, 255, 0.92)", "Thick glass: glass that covers arbitrary content — menus, popovers, toasts, half-height sheets, sidebars over a background extension. Even over pure white (dark theme) or pure black (light theme), all text including hover states stays ≥ 4.5:1.", DS="#18171d", LS="#fbfafc", DC="#000000", LC="#ffffff")
c("glass-edge", "rgba(255, 255, 255, 0.12)", "rgba(255, 255, 255, 0.75)", "1px outer edge of glass. White in the light theme, where the glass shadow separates glass from the background. A solid line ≥ 3:1 in high-contrast themes.", DS="#2c2b33", LS="rgba(22, 20, 28, 0.1)", DC="#b8b4c4", LC="#4a4752")
c("media-glass", "rgba(20, 19, 26, 0.45)", "rgba(20, 19, 26, 0.45)", "Glass on the stage: labels, playback toolbar, floating buttons. Dark in every theme. Only within the full-strength band of media-scrim; captions outside the band use media-plate.", DS="rgba(20, 19, 26, 0.9)", LS="rgba(20, 19, 26, 0.9)", DC="#000000", LC="#000000")
c("media-plate", "rgba(20, 19, 26, 0.72)", "rgba(20, 19, 26, 0.72)", "Caption plate on the stage (lg-plate): note captions mid-frame, numbers on media frames. Not glass (no blur), just a translucent backing; white and secondary text stay ≥ 4.5:1 even over a pure white frame.", DS="rgba(20, 19, 26, 0.92)", LS="rgba(20, 19, 26, 0.92)", DC="#000000", LC="#000000")
c("media-edge", "rgba(255, 255, 255, 0.14)", "rgba(255, 255, 255, 0.14)", "1px outer edge of media-glass.", DC="#ffffff", LC="#ffffff")
c("media-fill", "rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.1)", "Background for round icon buttons and segmented tracks on the stage.", DC="rgba(255, 255, 255, 0.2)", LC="rgba(255, 255, 255, 0.2)")
c("media-fill-hover", "rgba(255, 255, 255, 0.18)", "rgba(255, 255, 255, 0.18)", "Hover for media-fill.", DC="rgba(255, 255, 255, 0.3)", LC="rgba(255, 255, 255, 0.3)")
c("media-scrim-top", "rgba(0, 0, 0, 0.45)", "rgba(0, 0, 0, 0.45)", "Top scrim band on the stage: full strength for the top 64px, fading out by 140px. Top labels must sit within those 64px. Slightly darker than the reference's 0.4 so it can carry secondary text.", DS="rgba(0, 0, 0, 0.6)", LS="rgba(0, 0, 0, 0.6)", DC="rgba(0, 0, 0, 0.7)", LC="rgba(0, 0, 0, 0.7)")
c("media-scrim-bottom", "rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.5)", "Bottom scrim band on the stage: full strength for the bottom 88px, fading out by 180px. The playback toolbar must fall within those 88px.", DS="rgba(0, 0, 0, 0.65)", LS="rgba(0, 0, 0, 0.65)", DC="rgba(0, 0, 0, 0.75)", LC="rgba(0, 0, 0, 0.75)")
c("scroll-edge", "rgba(14, 13, 18, 0.9)", "rgba(242, 241, 245, 0.9)", "Scroll edge: canvas color laid behind glass when content scrolls under floating navigation. This density is the minimum that keeps ink-muted at 4.5:1 on glass.", DS="#0e0d12", LS="#f2f1f5", DC="#000000", LC="#ffffff")
c("scrim", "rgba(0, 0, 0, 0.24)", "rgba(0, 0, 0, 0.24)", "Scrim behind sheets (Modal).", DS="rgba(0, 0, 0, 0.5)", LS="rgba(0, 0, 0, 0.4)", DC="rgba(0, 0, 0, 0.8)", LC="rgba(0, 0, 0, 0.6)")
c("lightbox", "#08070b", "#08070b", "Background of the full-screen image preview.", DC="#000000", LC="#000000")

COLOR = {n: v for n, v, u in COLORS}
