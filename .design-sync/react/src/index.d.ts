// Liquid Glass Web: React adapters. Every component renders the markup documented in
// design-system/components/<Component>/README.md and binds the real window.LiquidGlass controller.
import * as React from 'react';

export type ThemeScheme = 'auto' | 'light' | 'dark';

export interface LiquidGlassRootProps {
  /** Default "dark". "auto" follows the OS. A nested root re-tones only its subtree (light or dark). */
  theme?: ThemeScheme;
  /** "reduce" switches to the opaque *-solid theme. */
  transparency?: 'auto' | 'full' | 'reduce';
  /** "more" switches to the *-contrast theme (7:1 text, opaque glass, strong borders). */
  contrast?: 'auto' | 'standard' | 'more';
  /** "reduce" turns off every transform, morph and spring. */
  motion?: 'auto' | 'reduce';
  /** "strong" raises blur and saturation; opacity is unchanged. */
  glass?: 'auto' | 'restrained' | 'strong';
  /** "comfortable": 16px body, 15px controls. Below 744px comfortable is already the default unless "compact". */
  density?: 'auto' | 'compact' | 'comfortable';
  /** SVG edge refraction on [data-refract] glass (Chromium only). Default true. */
  refraction?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
/**
 * Required app root. Applies the theme to <html data-theme>, sets the canvas background, ink color and
 * body text (the --type-body role), and calls LiquidGlass.init() for refraction, data-tone, tooltips and keyboard
 * tracking. On unmount it calls LiquidGlass.destroy() on its subtree.
 * Without it, every token resolves to the dark defaults only and glass tone switching does not run.
 * Use one root per app. A LiquidGlassRoot nested inside another does not change the page theme: it gives
 * its own subtree light or dark tokens (like a light section in a dark app) and keeps solid/contrast mode.
 * @example
 * <LiquidGlassRoot theme="dark" style={{ minHeight: '100vh' }}>…app…</LiquidGlassRoot>
 */
export declare const LiquidGlassRoot: React.FC<LiquidGlassRootProps>;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** sm 13px (small buttons, status rows), md 16px (default), lg 20px (tab bar, empty states). */
  size?: 'sm' | 'md' | 'lg';
  /** Default 1.6. Use 1.8 for a close (X) icon. */
  strokeWidth?: number;
  /** Accessible name. Omit for decorative icons next to text (they get aria-hidden). */
  label?: string;
  children?: React.ReactNode;
}
/**
 * Line icon on the system's 16 grid: currentColor stroke, round caps and joins, class lg-icon.
 * The system ships no icon set; pass <path>/<circle> children from an open-source set with the same stroke.
 * @example
 * <Icon><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" /></Icon>
 */
export declare const Icon: React.FC<IconProps>;

export type GlassButtonVariant =
  | 'accent'
  | 'inverse'
  | 'tinted'
  | 'plain'
  | 'outline'
  | 'danger'
  | 'glass'
  | 'glass-media'
  | 'media'
  | 'media-solid';

export interface GlassButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onToggle'> {
  /** Default "tinted". See the component description for when to use each variant. */
  variant?: GlassButtonVariant;
  /** xs 26, sm 32, md 36 (default), lg 44 (primary confirmation), nav 42 (standalone glass next to the navbar). */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'nav';
  /** Icon element placed before the text. */
  icon?: React.ReactNode;
  /** Round icon-only button. Requires aria-label. */
  iconOnly?: boolean;
  /** variant="glass" only: thick glass for buttons over images or arbitrary content. */
  thick?: boolean;
  /** Small chip glass (for "More" buttons on media frames, with variant="glass-media"). */
  chip?: boolean;
  /** Full width. */
  block?: boolean;
  /** variant="danger": the destructive action is confirmed. */
  armed?: boolean;
  /** Toggle button (aria-pressed). Implied when defaultPressed is set. */
  toggle?: boolean;
  defaultPressed?: boolean;
  onToggle?(pressed: boolean, button: HTMLElement): void;
  /** Uses aria-disabled so the button stays focusable; clicks are blocked. */
  disabled?: boolean;
  /** Renders an <a> with the same style, for navigation. */
  href?: string;
  /** Icon-only buttons: true shows the accessible name in a tooltip on hover and keyboard focus; a string overrides it.
      Never put a shortcut in the label unless the app registers it (then add aria-keyshortcuts). */
  tooltip?: boolean | string;
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
}
/**
 * The capsule button. Labels are verb + object in Title Case ("Remove from Show"), never "OK".
 * Variants: accent is the one primary action per screen (always with text). inverse is an emphasized decision.
 * tinted is secondary (Cancel, Edit). plain goes inside nav islands and toolbar groups. outline is a toggleable
 * secondary. danger is destructive. glass stands alone on canvas. glass-media, media and media-solid go on a Stage only.
 * One accent per task scope: the next step of the current task (Review in a review screen, Send while the composer
 * has text). Other actions, Export included, stay tinted or glass. Glass containers never contain variant="glass".
 * @example
 * <GlassButton variant="accent">Export</GlassButton>
 * <GlassButton variant="tinted" size="sm" iconOnly aria-label="Close" icon={<Icon strokeWidth={1.8}><path d="M4 4l8 8M12 4l-8 8" /></Icon>} />
 */
export declare const GlassButton: React.ForwardRefExoticComponent<GlassButtonProps & React.RefAttributes<HTMLElement>>;

export interface SegmentedControlProps {
  /** 2 to 5 options (at most 4 on mobile), one or two words each. Set `value` when a label is translated or badged. */
  items: Array<string | {
    label: React.ReactNode;
    /** Stable identity: React key, data-value, and the value passed to onChange. Defaults to label when label is a
        string. Set it whenever the label is translated or carries a badge. */
    value?: string;
    /** mode="links" only. */
    href?: string;
    /** Count badge after the label (neutral). */
    badge?: React.ReactNode;
    /** Use the warn badge only for counts that need the user's attention. */
    badgeWarn?: boolean;
    /** Screen-reader text for the badge ("3 pending"); the number itself is then hidden from assistive tech. */
    badgeLabel?: string;
    disabled?: boolean;
    /** mode="tabs": id of the tabpanel this tab controls. */
    controls?: string;
  }>;
  /** Controlled selected index. A user change is a request: onChange reports it, and the control returns to
      `index` on the next frame unless the host passes the new index. */
  index?: number;
  /** Uncontrolled initial index. Default 0. */
  defaultIndex?: number;
  /** Once per committed change (or request, when controlled). Read from the latest props. */
  onChange?(index: number, value: string, item: HTMLElement): void;
  /** While a drag shows another item; nothing is committed until release, a cancelled drag reverts. */
  onPreview?(index: number, value: string, item: HTMLElement): void;
  /** mode="tabs": "manual" moves focus with arrows and switches on Enter or Space. Default "automatic". */
  activation?: 'automatic' | 'manual';
  /** Accessible name of the group ("Compare view"). */
  label: string;
  /** radio (default): switches a view. tabs: switches tab panels on the page. links: navigation (aria-current, no JS). */
  mode?: 'radio' | 'tabs' | 'links';
  /** sm 26, md 30 (default), lg 32. */
  size?: 'sm' | 'md' | 'lg';
  /** Fill the width with equal items (mobile). */
  block?: boolean;
  /** On a Stage: white thumb, dark text. */
  media?: boolean;
  /** Disable the whole group. */
  disabled?: boolean;
  className?: string;
}
export type SegmentedItem = Exclude<SegmentedControlProps['items'][number], string>;
/**
 * A switch for 2-5 mutually exclusive options. The thumb can be clicked, dragged or moved with arrow keys,
 * and turns into glass while pressed. Not for long labels or something that is really a toggle.
 * @example
 * <SegmentedControl label="Compare view" items={['Single', 'Side by Side', 'Grid']} defaultIndex={2} />
 */
export declare const SegmentedControl: React.ForwardRefExoticComponent<SegmentedControlProps & React.RefAttributes<HTMLElement>>;

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Says what the toolbar controls ("Playback", "Edit"), never "Toolbar". */
  label: string;
  /** Fixed to the bottom of the viewport, above safe areas and the on-screen keyboard. */
  float?: boolean;
  children?: React.ReactNode;
}
export interface ToolbarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Play button + timecode (+ Toolbar.Scrubber). The only group that may hold text. */
  readout?: boolean;
  /** On a Stage: media glass, elevated. */
  media?: boolean;
  children?: React.ReactNode;
}
export interface ToolbarTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Shown after the value as " / total". */
  total?: React.ReactNode;
  children?: React.ReactNode;
}
export interface ToolbarScrubberProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Progress. 0-100 for the indicator; between min and max for the interactive range. */
  value?: number;
  /** A native range people can seek with (arrows, Home, End, drag). Implied by onChange. */
  interactive?: boolean;
  onChange?(value: number, event: React.ChangeEvent<HTMLInputElement>): void;
  min?: number;
  max?: number;
  step?: number;
  /** Accessible name. Default "Playback position". */
  label?: string;
  /** Spoken value, for example "0:13 of 0:47". */
  valueText?: string;
}
/**
 * Actions for the content in view, one piece of glass per group (Toolbar.Group), groups 8px apart.
 * A group holds only icon buttons (variant="plain", iconOnly). The labeled accent action is a direct child
 * of Toolbar, never inside a group. Toolbar.Spacer pushes later groups to the far side; it only works
 * when the toolbar has a width (style={{ width: '100%' }}), because the toolbar is inline-flex.
 * One Tab stop for the whole toolbar; arrow keys move across groups.
 * @example
 * <Toolbar label="Edit">
 *   <Toolbar.Group>
 *     <GlassButton variant="plain" iconOnly aria-label="Undo" tooltip icon={undoIcon} />
 *     <GlassButton variant="plain" iconOnly aria-label="Redo" tooltip icon={redoIcon} />
 *   </Toolbar.Group>
 *   <GlassButton variant="accent">Share</GlassButton>
 * </Toolbar>
 */
export declare const Toolbar: React.ForwardRefExoticComponent<ToolbarProps & React.RefAttributes<HTMLDivElement>> & {
  Group: React.FC<ToolbarGroupProps>;
  Text: React.FC<ToolbarTextProps>;
  Scrubber: React.FC<ToolbarScrubberProps>;
  Spacer: React.FC<{}>;
};

export interface ComposerProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Accessible name; the placeholder is not a label. */
  label: string;
  placeholder?: string;
  /** Neutral scope badge, e.g. "@all" or "@12–18". */
  scope?: React.ReactNode;
  /** Spoken scope ("Frames 12 to 18"), because "@12–18" does not read well aloud. */
  scopeLabel?: string;
  /** "assistant" (default): an instruction field. "search": site search (adds role="search"). */
  kind?: 'assistant' | 'search';
  /** A letter bound with ⌘ (Apple) or Ctrl (others) that focuses the input. The hint shows it; no shortcut, no hint.
      Give the shortcut to one composer per page. */
  shortcut?: string;
  /** @deprecated Ignored: a hint must name a registered shortcut. Use `shortcut`. */
  hint?: React.ReactNode;
  /** Default "Send". Disabled (neutral) while the input is empty or while status is "pending". */
  sendLabel?: React.ReactNode;
  defaultValue?: string;
  onSubmit?(value: string): void;
  /** Host-owned request state. "pending": busy, no second submit, the text stays. "error": statusMessage shows in a
      status region, the text stays, Send is ready for a retry. */
  status?: 'idle' | 'pending' | 'error';
  statusMessage?: string;
  /** Fixed on solid canvas with nothing passing behind it: no backdrop blur. */
  flat?: boolean;
}
/**
 * The input bar for instructions to the assistant, at the bottom of the main column.
 * On mobile it sits directly above the TabBar (then the TabBar has no search button).
 * @example
 * <Composer label="Instructions for the assistant" scope="@all" placeholder="Tell the assistant how to adjust these photos…" />
 */
export declare const Composer: React.FC<ComposerProps>;

export interface GlassPanelProps extends React.HTMLAttributes<HTMLElement> {
  /** aria-label of the aside ("Inspector"). */
  label?: string;
  /** flat (default): fixed on solid canvas, no blur. thick: floats over images. */
  material?: 'flat' | 'thick';
  /** Left rail placement. */
  rail?: boolean;
  /** Element type. Default "aside"; "section" or "div" inside a page, "nav" for a navigation rail. */
  as?: 'aside' | 'section' | 'div' | 'nav';
  children?: React.ReactNode;
}
export interface PanelSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Section heading (h3), Title Case. */
  title?: React.ReactNode;
  /** Count shown after the heading. */
  count?: React.ReactNode;
  children?: React.ReactNode;
}
/**
 * Inspector or sidebar on the canvas. Put what most needs the user at the top in GlassPanel.Group
 * (fill background); other content goes in GlassPanel.Section; GlassPanel.Footer holds a fixed primary action.
 * Nothing inside is glass: use ListRow, Callout, ProgressBar and tinted/inverse buttons.
 * On mobile, show the same content in a Modal instead.
 * @example
 * <GlassPanel label="Inspector">
 *   <GlassPanel.Group title="Needs Your Decision" count={3}>
 *     <ListRow title="Frame 14 · Forest" subtitle="4 versions · Pick #2" chevron />
 *   </GlassPanel.Group>
 *   <GlassPanel.Section title="Notes" count={3}>…</GlassPanel.Section>
 * </GlassPanel>
 */
export declare const GlassPanel: React.ForwardRefExoticComponent<GlassPanelProps & React.RefAttributes<HTMLElement>> & {
  Group: React.FC<PanelSectionProps>;
  Section: React.FC<PanelSectionProps>;
  Footer: React.FC<React.HTMLAttributes<HTMLDivElement>>;
};

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Required: the trigger button points at it with aria-controls={id} and aria-expanded="false". */
  id: string;
  /** aria-label, usually the object the menu acts on ("Frame 14"). */
  label?: string;
  /** sm: the small menu on cards. */
  size?: 'md' | 'sm';
  /** Render already open (static mockups, inline confirmation in place). Default false (hidden). */
  defaultOpen?: boolean;
  /** Esc and outside click close it. Default true. */
  dismissible?: boolean;
  /** "dialog" while showing Menu.Confirm (then also set aria-labelledby). Default "menu". */
  role?: string;
  children?: React.ReactNode;
}
export interface MenuItemProps extends React.HTMLAttributes<HTMLElement> {
  /** Optional. Inside one group (between separators or labels) either every item has an icon or none does. */
  icon?: React.ReactNode;
  /** aria-disabled: still focusable so people can find it, but pointer, keyboard and script activation are blocked. */
  disabled?: boolean;
  /** Destructive: place last, after a Menu.Separator. */
  danger?: boolean;
  href?: string;
  children?: React.ReactNode;
}
export interface MenuStatusProps {
  status?: 'neutral' | 'accent' | 'ok' | 'warn';
  pulse?: boolean;
  title: React.ReactNode;
  detail?: React.ReactNode;
}
export interface MenuConfirmProps {
  /** Bold question: "Remove Frame 14 from the show?" */
  title: React.ReactNode;
  titleId?: string;
  cancelLabel?: React.ReactNode;
  /** Danger button label ("Remove"). */
  confirmLabel: React.ReactNode;
  onCancel?(): void;
  onConfirm?(): void;
  /** What is affected. */
  children?: React.ReactNode;
}
/**
 * Menus and popovers: thick glass that grows from its trigger. Toggles from the button whose aria-controls
 * names its id. role="menu" follows the menu button pattern: opening focuses the first item, arrows, Home, End and
 * typeahead move, Esc returns focus to the trigger, Tab and activating an item close it.
 * Positioning is up to the page (position it absolutely). Choose the confirmation by consequence: undo for
 * reversible actions (toast with an Undo action), Menu.Confirm for a local destructive action, a centered Modal
 * when the consequence reaches beyond what the user can see.
 * @example
 * <GlassButton variant="glass-media" chip size="sm" iconOnly aria-label="More actions for Frame 14" aria-controls="card-menu" aria-expanded="false" icon={moreIcon} />
 * <Menu id="card-menu" label="Frame 14" size="sm">
 *   <Menu.Item icon={viewIcon}>View Larger</Menu.Item>
 *   <Menu.Separator />
 *   <Menu.Item icon={trashIcon} danger>Remove from Show</Menu.Item>
 * </Menu>
 */
export declare const Menu: React.ForwardRefExoticComponent<MenuProps & React.RefAttributes<HTMLDivElement>> & {
  Item: React.FC<MenuItemProps>;
  Separator: React.FC<{}>;
  Label: React.FC<{ children?: React.ReactNode }>;
  Status: React.FC<MenuStatusProps>;
  Confirm: React.FC<MenuConfirmProps>;
};

export interface ModalProps extends Omit<React.DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'onClose'> {
  /** Controlled open state. Opens with showModal(); focus returns to the trigger on close. */
  open?: boolean;
  /** Called after Esc, the backdrop, the close button or any [data-lg-close] button; set open to false here. */
  onClose?(returnValue: string, dialog: HTMLDialogElement): void;
  onOpen?(dialog: HTMLDialogElement): void;
  /** Says what the task is ("Add an Angle to “Harbor”"). */
  title: React.ReactNode;
  /** Consequence of the action, shown in the footer. */
  hint?: React.ReactNode;
  /** Footer buttons. The primary states the result. Add data-lg-close="confirm" to close with that value. */
  actions?: React.ReactNode;
  /** Close button aria-label. Default "Close". */
  closeLabel?: string;
  /** 480 wide, for a single question. */
  compact?: boolean;
  /** Fills the screen from the start (always opaque). */
  full?: boolean;
  /** Render in place as a static sheet (mockups and screenshots only). */
  isStatic?: boolean;
  /** isStatic only: show the full-height opaque state. */
  expanded?: boolean;
  /** Default true. Read from the latest props. */
  dismissOnBackdrop?: boolean;
  /** Return false to keep the sheet open (unsaved input). Runs for Esc, the backdrop and [data-lg-close]. */
  beforeClose?(reason: 'escape' | 'backdrop' | 'close-button' | 'api', dialog: HTMLDialogElement): boolean | void;
  /** "sheet" (default): bottom sheet. "center": a centered dialog at ≥ 744px for a short decision; still a sheet on mobile. */
  presentation?: 'sheet' | 'center';
  children?: React.ReactNode;
}
/**
 * A sheet for a small focused task (add, replace, configure). Half height it is thick glass inset from the
 * screen edges; at full height it turns opaque. Never a sheet inside a sheet. Nothing inside is glass.
 * Esc closes only the top layer: a menu open inside the sheet closes first.
 * @example
 * <Modal open={open} onClose={() => setOpen(false)} title="Add an Angle to “Harbor”"
 *   hint="Choosing this locks the angle; later versions will follow it."
 *   actions={<GlassButton variant="accent" data-lg-close="confirm">Use “Harbor · Backlit”</GlassButton>}>
 *   <TextField placeholder="Name the angle" aria-label="Angle name" />
 * </Modal>
 */
export declare const Modal: React.FC<ModalProps>;

export interface FloatingNavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Logo (currentColor) + brand name. */
  brand: React.ReactNode;
  brandHref?: string;
  /** aria-label of the brand link ("Lumen home"). */
  brandLabel?: string;
  /** The main destinations, at most 5. Desktop: links in the brand island. Mobile: render the same list in a TabBar. */
  links?: Array<string | { label: React.ReactNode; href?: string; value?: string }>;
  /** Index of the current destination. Default 0. */
  currentLink?: number;
  /** Context island (desktop only): project name, neutral ProgressBar, count. Optional parts: lg-nav-optional. */
  context?: React.ReactNode;
  /** Project tabs island (desktop only), usually a SegmentedControl mode="tabs". */
  tabs?: React.ReactNode;
  /** A project-scoped action next to the project islands (desktop only). Accent only when it is the next step of the
      current task; in a review screen keep Export glass or tinted. */
  action?: React.ReactElement;
  /** Tools island, far right: icon-only plain buttons with aria-label. lg-nav-desktop hides one on mobile. */
  tools?: React.ReactNode;
  /** Menu items (Menu.Item / Menu.Label) for secondary destinations; adds the menu button. Never repeats links. */
  menu?: React.ReactNode;
  menuLabel?: string;
  /** Render the menu open (static mockups). Default false. */
  defaultMenuOpen?: boolean;
  /** Inside a block (preview frame) instead of position: fixed. */
  contained?: boolean;
  /** Islands switch to dark glass over sections with data-surface-tone="dark". Default true. */
  adaptiveTone?: boolean;
  /** Pin the scrolled state (scroll edge shown) for static mockups. */
  scrolled?: boolean;
}
export type NavLink = Exclude<NonNullable<FloatingNavbarProps['links']>[number], string>;
/**
 * The main navigation: separate glass islands in a fixed order: brand + destinations, context, project tabs,
 * the accent action on its own, then tools at the far right. Container queries hide lg-nav-optional below
 * 1100px and lg-nav-desktop below 744px. One per page.
 * @example
 * <FloatingNavbar brand={<><Icon>…</Icon><span>Lumen</span></>} brandLabel="Lumen home"
 *   links={['Studio', 'Library', 'Shows']} action={<GlassButton variant="accent">Export</GlassButton>}
 *   tools={<GlassButton variant="plain" iconOnly aria-label="Search" icon={searchIcon} />}
 *   menu={<Menu.Item icon={gearIcon} href="/settings">Settings</Menu.Item>} />
 */
export declare const FloatingNavbar: React.ForwardRefExoticComponent<FloatingNavbarProps & React.RefAttributes<HTMLElement>>;

export interface TabBarProps extends React.HTMLAttributes<HTMLElement> {
  /** 2 to 5 tabs, the same destinations and order as FloatingNavbar links. One-word labels. */
  tabs: Array<{
    label: React.ReactNode;
    /** 20px icon (Icon size="lg"). */
    icon: React.ReactNode;
    href?: string;
  }>;
  /** Index of the current tab. Default 0. */
  current?: number;
  /** Round search button at the far right. Omit when the page has a Composer or search field at the bottom. */
  search?: boolean;
  searchLabel?: string;
  onSearch?(): void;
  /** Default "scroll-down": shrink after scrolling down 48px. */
  minimize?: 'scroll-down' | 'scroll-up' | 'off';
  adaptiveTone?: boolean;
  /** Show inside a preview frame at any width (otherwise only below 744px). */
  contained?: boolean;
  label?: string;
}
export type TabBarTab = TabBarProps['tabs'][number];
/**
 * The mobile tab bar floating at the bottom (below 744px only). Reserve tabbar-height + 24px at the page bottom.
 * @example
 * <TabBar tabs={[{ label: 'Studio', icon: studioIcon }, { label: 'Library', icon: libraryIcon }]} search />
 */
export declare const TabBar: React.ForwardRefExoticComponent<TabBarProps & React.RefAttributes<HTMLElement>>;

export interface StageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** CSS background-image for the media (an url(...) or gradients). */
  media?: string;
  /** Describes the media (role="img"). */
  alt?: string;
  /** "contain" (default): the whole frame, nothing cropped. "cover": fill and crop (browsing, decoration). */
  fit?: 'contain' | 'cover';
  /** "auto" (default): a band only where top or bottom holds controls. Or "top", "bottom", "both", "none". */
  scrim?: 'auto' | 'top' | 'bottom' | 'both' | 'none';
  /** Inspect mode: hides controls and scrims to judge the image, and shows one exit button. */
  inspect?: boolean;
  onExitInspect?(): void;
  /** Default "Show Controls". */
  exitLabel?: string;
  /** Top scrim band: one label per stage (Badge glass). */
  top?: React.ReactNode;
  /** Bottom scrim band: the stage Toolbar. */
  bottom?: React.ReactNode;
  /** @deprecated Use scrim="none". */
  noScrim?: boolean;
  /** Default "dark". */
  tone?: 'light' | 'dark';
  children?: React.ReactNode;
}
/**
 * The media stage (photos, video) with dark tone and scrim bands at the top and bottom edges. Controls on the
 * stage use the media variants (GlassButton media / media-solid / glass-media, SegmentedControl media,
 * Toolbar.Group media). Give it a height with style.
 * @example
 * <Stage style={{ height: 360 }} media="url(photo.jpg)" top={<Badge glass>Frame 14 · Undecided</Badge>} bottom={<Toolbar label="Playback">…</Toolbar>} />
 */
export declare const Stage: React.ForwardRefExoticComponent<StageProps & React.RefAttributes<HTMLDivElement>>;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** accent: Recommended. ok: Chosen. outline-warn: Flagged. count: neutral monospaced number. mono: scope (@12–18). */
  variant?: 'default' | 'accent' | 'ok' | 'outline-warn' | 'count' | 'mono';
  /** Only for counts that need the user's attention. */
  warn?: boolean;
  /** Next to items and thumbnails. */
  size?: 'sm' | 'md';
  /** Stage label in the top scrim band (media chip glass). */
  glass?: boolean;
  /** Plate backing for numbers on media frames (no blur). */
  plate?: boolean;
  children?: React.ReactNode;
}
/** Small label or count. Status is always a badge or dot plus text, never color alone. */
export declare const Badge: React.FC<BadgeProps>;

export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** neutral: Processing. ok: Chosen. accent: Needs You. warn: Has Question. */
  status?: 'neutral' | 'ok' | 'accent' | 'warn';
  size?: 'md' | 'lg';
  pulse?: boolean;
  /** Text shown next to the dot. */
  label?: React.ReactNode;
}
/** Status dot, always paired with text. */
export declare const StatusDot: React.FC<StatusDotProps>;

export interface ListRowProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** CSS background-image string for the thumbnail, or a custom element. */
  thumb?: string | React.ReactNode;
  /** lg 76×46 (default), md 68×40, sm 48×30. */
  thumbSize?: 'lg' | 'md' | 'sm';
  title: React.ReactNode;
  /** Badge after the title (size="sm"). */
  badge?: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  /** Trailing arrow for rows that open something. */
  chevron?: boolean;
  /** Inside SelectList: the chosen option (aria-selected). Elsewhere it maps to `current`. */
  selected?: boolean;
  /** The item shown elsewhere, for example on the stage (aria-current="true"). */
  current?: boolean;
  /** A toggle row (aria-pressed). */
  pressed?: boolean;
  /** Inside SelectList: the stable value reported by onChange. */
  value?: string;
  /** Non-interactive row (div). */
  isStatic?: boolean;
  children?: React.ReactNode;
}
/** List row: thumbnail, label-role title (two lines, then clamped), caption subtitle, optional arrow. Hover uses
 * fill; selected, current and pressed use accent-soft. Rows people choose from go in a SelectList. */
export declare const ListRow: React.FC<ListRowProps>;

export interface SelectListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Accessible name ("Versions of Frame 14"). */
  label: string;
  /** Several options can be chosen: arrows move, Space toggles. Default: single, selection follows focus. */
  multiple?: boolean;
  onChange?(values: string[], option: HTMLElement): void;
  children?: React.ReactNode;
}
/**
 * A list people choose rows from (role="listbox"); its ListRow children become options.
 * @example
 * <SelectList label="Versions of Frame 14"><ListRow value="v1" title="#1" /><ListRow value="v2" title="#2" selected /></SelectList>
 */
export declare const SelectList: React.ForwardRefExoticComponent<SelectListProps & React.RefAttributes<HTMLDivElement>>;

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** suggestion (accent-soft, default) or warn (a question that needs a decision). */
  variant?: 'suggestion' | 'warn';
  size?: 'md' | 'lg';
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  /** Two concrete options: first GlassButton inverse, second tinted (size="sm"). */
  actions?: React.ReactNode;
  children?: React.ReactNode;
}
/** A suggestion or a direct question with two concrete options. */
export declare const Callout: React.FC<CalloutProps>;

export interface ProgressBarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 0-100. */
  value?: number;
  /** md: 4px (default 3px). */
  size?: 'sm' | 'md';
  /** Ink instead of accent; required inside navbar islands. */
  neutral?: boolean;
  label?: string;
}
/** Thin progress bar. Write progress text as "2 / 5 · about 40 s". */
export declare const ProgressBar: React.FC<ProgressBarProps>;

interface TextFieldBase {
  /** Help text under the field, linked with aria-describedby. */
  helper?: React.ReactNode;
  /** Error message; sets aria-invalid and is linked with aria-describedby after the helper and any host ids. */
  error?: React.ReactNode;
}
export type TextFieldProps =
  | (TextFieldBase & React.InputHTMLAttributes<HTMLInputElement> & { multiline?: false })
  | (TextFieldBase & React.TextareaHTMLAttributes<HTMLTextAreaElement> & { multiline: true; rows?: number });
/** 46px capsule input on surface-inset with a 3:1 field-edge boundary. Always give an aria-label or a visible label.
 * The ref points at the real <input> or <textarea>. */
export declare const TextField: React.ForwardRefExoticComponent<TextFieldProps & React.RefAttributes<HTMLInputElement | HTMLTextAreaElement>>;

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** A FloatingNavbar (fixed, or contained inside a pane). */
  navbar?: React.ReactNode;
  /** A TabBar: it shows below 744px of the app's own width. */
  tabbar?: React.ReactNode;
  /** Left column (contact sheet, scenes). Below 744px it becomes a block; give its list class lg-app__dock to scroll it sideways; tiles are var(--lg-dock-tile) wide, so the next one shows in part at the edge. */
  aside?: React.ReactNode;
  asideLabel?: string;
  /** Right column ≥ 1100px; below main at 744–1099px; after the content below 744px. */
  inspector?: React.ReactNode;
  /** Inside a pane or preview: navigation follows the pane's width, not the window's. */
  contained?: boolean;
  children?: React.ReactNode;
}
/**
 * The fluid page layout: navigation reservation, main column, optional aside and inspector, bottom reservation for
 * the tab bar. One layout from 320px to wide desktop; tasks move (into menus, tabs, the page header), never vanish.
 * @example
 * <AppShell navbar={<FloatingNavbar …/>} tabbar={<TabBar …/>} aside={contactSheet} inspector={<GlassPanel …/>}>…</AppShell>
 */
export declare const AppShell: React.FC<AppShellProps>;

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Controlled pressed state. */
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?(pressed: boolean): void;
  children?: React.ReactNode;
}
/**
 * Toggle chip, inverted when on. Wrap a set in Chip.Group.
 * @example
 * <Chip.Group><Chip>Back</Chip><Chip defaultPressed>Backlit</Chip><Chip>Wide</Chip></Chip.Group>
 */
export declare const Chip: React.FC<ChipProps> & { Group: React.FC<React.HTMLAttributes<HTMLDivElement>> };

/** One short status message, thick glass, centered at content-top. Messages queue; inside an open Modal it shows
 * in the sheet. `action` adds a button (Undo) and keeps it 8 s. Default timeout 2800 ms. */
export declare function toast(message: string, options?: { timeout?: number; root?: HTMLElement; replace?: boolean; action?: { label: string; onClick?(): void } }): HTMLElement | null;
