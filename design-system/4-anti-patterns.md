# Anti-patterns

## Materials

| Don't | Why | Instead |
| --- | --- | --- |
| Wrap content in glass because it sits next to the controls (a thumbnail strip, a contact sheet, a list of results) | It is still content; glass makes it look like a control layer, and the glass count grows without anyone noticing, because `lg-glass--flat` looks the same as blurred glass | Put it on `surface` with a `line` inset border; keep glass for the bars and overlays that float over it |
| Make content cards, image grids or articles glass | Glass says "I float above the content". When content itself is glass, the hierarchy disappears, and what's behind it interferes with reading | Cards use `surface` + a `line` inner border; images sit directly on `canvas` |
| Glass on glass: glass buttons inside an island, glass cards inside a sidebar | Two layers of blur sample each other, edges get muddy, contrast can't be verified and performance cost doubles | Use `plain` inside islands; group with `fill` inside sidebars |
| Overlap two pieces of control-layer glass (a toolbar over the tab bar, two floating bars crowded together) | It's unclear which is on top, and it goes against Apple's "avoid stacking Liquid Glass elements on top of each other" | Separate them with system spacing; only the overlay layer (menus, sheets) may cover the control layer |
| Give each button its own piece of glass | The number of backdrop blurs grows fast, the screen looks fragmented and performance drops | Related buttons share one piece: nav islands, toolbar groups |
| Use regular 0.5 glass for menus, toasts or sheets | They can cover white content or bright photos, leaving primary text at only 2.7:1 and secondary text at about 1.2:1 | Use `lg-glass--popover` / `lg-modal` (`glass-thick`) |
| Keep a full-height sheet translucent | When a sheet fills the screen, the user needs to focus on finishing a task | `Modal()` switches to `surface` automatically when the sheet reaches its maximum height or ≥ 90% of the viewport; add `lg-modal--full` to sheets that are always full height |
| Apply backdrop blur to large panels fixed on a solid color | Blurring a solid color changes nothing and only wastes performance | Add `lg-glass--flat` |
| Lower the alpha of `glass`, `glass-thick`, `scroll-edge` or `media-scrim-*` to look "more see-through" | These values are minimums derived from contrast calculations | For a more see-through look, use Stronger (adds only blur and saturation), or make the background calmer |
| Turn on refraction for large areas of glass | Refraction distorts large areas of content and costs the most performance; on a solid color it isn't visible anyway | Add `data-refract` only to islands and small buttons ≤ 50px tall |
| Add colored glows, neon gradients or heavy shadows to glass | Those are decorative techniques from early frosted glass (glassmorphism) and overpower the content | Use only `specular` and `elevation-*` |
| Assemble your own glass with `backdrop-filter` | It misses scroll edges, fallback themes, forced colors and contrast verification | Use `lg-glass` and modifier classes |

## Readability

| Don't | Why | Instead |
| --- | --- | --- |
| Let content scroll under a nav island or tab bar without a scroll edge | 0.5 glass over white content leaves primary text at only 2.7:1 | Add `.lg-scroll-edge` at the top and `.lg-scroll-edge--bottom` at the bottom (built into FloatingNavbar and TabBar) |
| Place stage labels in the middle of the frame with regular `lg-glass--media` | Outside the scrim bands, white text over a pure white frame is only 3:1 | Put labels in the top 64px band; captions in the middle and on media frames use `lg-plate` |
| Use percentages for stage scrims | When the stage gets shorter, labels land in the already faded area | Use the system's scrim bands (built into `.lg-stage`): a fixed 64px / 88px, never more than 25% of a short stage |
| Darken the whole stage, or both edges when only one holds controls | The scrim hides the image that people came to judge | A band appears only where controls are (`.lg-stage__top`, `.lg-stage__bottom` or `data-scrim`); use `data-inspect` to hide controls and scrims |
| Crop the work to fill the stage | People judge a frame they can't see in full | The stage shows the whole frame (`contain`); use `data-fit="cover"` only for browsing or decoration |
| Put light glass on dark imagery | Secondary text drops to about 2:1 | Add `data-tone="dark"` to the stage; add `data-surface-tone="dark"` to dark sections |
| Hide scrollbars (`scrollbar-width: none`) or draw them as glass with `::-webkit-scrollbar` | Mouse and keyboard users lose the cue that more content exists, and glass scrollbars put glass on glass | Keep the platform scrollbar; inner areas use the built-in thin scrollbar |
| Fade the end of a scrolling row over its content, or add a scroll edge where no control floats | The fade darkens the work, and a scroll edge without floating controls is decoration | Size the items so the next one shows in part at the edge (built into `.lg-app__dock`) |
| Set text in `ink-faint` (timecodes, shortcuts, descriptions) | It is only about 3:1 and is meant for arrows and ticks | Use `ink-muted` for text |
| Dim secondary text with `opacity` | Opacity drops the text below 4.5:1, and no check proves the result | Use a proved token: `ink-muted`, or `ink-on-media-muted` on the stage |
| Write a font size in a component, or a fixed `height` on a control | Text no longer follows the density, and larger text gets cut off | Use `font: var(--type-<role>)` and `min-height` |
| Use all caps for group and section headers | All caps is hard to read, and Apple has moved back to normal case | Use `label-sm`; Title Case for Latin text |

## Navigation and toolbars

| Don't | Why | Instead |
| --- | --- | --- |
| Put status text inside a toolbar group ("4 playing in sync") | The group stops reading as a set of controls | Keep only controls and their readout (timecode) in the group; put status in a stage label |
| Pack a breadcrumb, a divider, status and tabs into one island | Several kinds of thing on one background read as one control | One kind of thing per island: context (name, neutral progress, count), project tabs, tools |
| Show different destinations in the mobile tab bar and the desktop islands, or repeat the tab bar's destinations in the menu | People can't build one mental map of the site, and the menu duplicates the tabs | Keep one list of main destinations: links in the brand island at ≥ 744px, the tab bar below 744px; the menu holds only secondary items |
| Mix icon-only and labeled buttons in one piece of glass | The visual weight is inconsistent; it looks like two different things forced together | Group icon buttons together; set a labeled primary action apart as its own piece |
| Crowd buttons with different functions into one piece of glass | Users can't tell which actions belong together | Group by function (Undo + Redo, view options, Share + More), with `space-8` between groups |
| Use dividers to group within one piece of glass | The grouping isn't clear enough, and the glass gets too long | One piece of glass per group |
| Put the accent primary action inside a group or nav island | It makes the whole piece of glass look emphasized | Make the primary action its own button |
| Color everything in navigation and toolbars: progress bars, counts, several accent buttons | With too much color nothing stands out, and it overpowers the content showing through the glass | Neutral colors for progress and counts; one accent per task scope; `warn` only for counts that need the user's attention |
| Hide a button's icon or text, leaving an empty button or empty group | A piece of glass with no content appears on screen | Add `hidden` to the button itself; when everything in a group is hidden, the group disappears automatically |
| Icon-only buttons without `aria-label` | Screen reader and voice control users don't know what they do | Give every icon button an action name |
| Put all tabs in a hamburger menu at the top on mobile | The most-used destinations take an extra tap | Put the main tabs in a bottom tab bar (TabBar), with search as a separate round button at the far right |
| Use accent on every button, or keep Export accent while the user reviews | When everything is emphasized nothing is; in the light theme the accent fill is only 2.4:1 against the page | One accent per task scope: the next step of the current task (Review while reviewing, Send while the composer has text); use tinted, glass, plain or inverse for the rest |
| Hide project tasks below 744px (areas, pending count, Export, Queue) | People on a phone can't finish the task | Move them into the menu (their own group) or an in-page project header with a project actions menu; no task disappears |
| Put a shortcut in a label or tooltip ("Undo (⌘Z)") that the app doesn't register, or use `title` for tooltips | People try a shortcut that does nothing; `title` doesn't show on keyboard focus or touch | Show a shortcut only when the app registers it (`LiquidGlass.shortcut()`, `aria-keyshortcuts`); use `data-tooltip` |

## Menus and overlays

| Don't | Why | Instead |
| --- | --- | --- |
| Mix items with and without icons in one menu group | The text no longer lines up, and the group looks unfinished | Icons are optional, but inside one group (between separators or labels) every item has an icon or none does; separate destructive actions with a divider and put them last |
| Pop menus up from the center of the screen | Users can't tell which button opened them | Use `GlassPanel()`, which grows from the position of the trigger button |
| Confirm every action the same way | A dialog for a reversible action interrupts the flow; an inline confirmation for a large consequence is easy to miss | Choose by consequence: reversible → do it and offer Undo (`toast` with an action); local destructive → confirm inline in the menu (`lg-menu__confirm`) and say what is affected; a consequence beyond what the user sees, or an irreversible bulk action → a centered dialog (`lg-modal--center`) |
| Put `aria-selected` on a row that is not an option in a listbox | Screen readers announce a selection state that has no meaning there | Use `aria-current="true"` for the current item and `aria-pressed` for a toggle; use SelectList (`role="listbox"`) for rows people choose from |
| List rows have swipe gestures, but the top menu actions don't match the swipe actions | Two ways of acting on the same item give different answers | Order the first menu items to match the swipe actions (for example, if swiping left is "Remove", put "Remove" in the same group in the menu) |
| Open a sheet inside a sheet | The hierarchy gets out of control, and after closing it's unclear where you return to | When content exceeds one screen, use a separate page |

## Motion and platform

| Don't | Why | Instead |
| --- | --- | --- |
| Animate blur radius or `backdrop-filter` | Every frame recomposites the whole background, drops frames on phones and can cause motion sickness | Enter and exit with a fade + slight scale; use `duration-fast` for color changes |
| Write translation and scaling outside `prefers-reduced-motion` | Users who reduce motion still see it | Write it inside the `no-preference` block |
| Detect refraction with `CSS.supports()` | Safari reports support, but nothing appears on screen | Use `LiquidGlass.supportsRefraction()` |
| Rely only on the system Reduce Transparency setting | Safari doesn't expose this setting to web pages | Offer a "Transparency" switch in site settings |
| Remove the focus ring, or show actions only on hover | Keyboard and touch users can't find focus or features | Keep the two-layer focus ring; actions are always visible |
| Use color alone to show status | Users with color vision differences can't tell them apart | Dot or badge plus text: "● Chosen" |
| Add negative letter spacing to CJK headings or break lines inside words | CJK characters are square blocks, and negative letter spacing crowds them together | Set the correct `lang`; bundle.css handles it automatically |
| Embed SF Pro on a site, use SF Symbols, or copy the interface and branding of Apple or reference products | License and brand risk; this system borrows principles and finish, not appearance | Use system fonts and open-source icons; each site provides its own brand elements |
