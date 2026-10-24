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
  /** SVG edge refraction on [data-refract] glass (Chromium only). Default true. */
  refraction?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
/**
 * Required app root. Applies the theme to <html data-theme>, sets the canvas background, ink color and
 * 14px body text, and calls LiquidGlass.init() for refraction, data-tone and keyboard tracking.
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

export interface GlassButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
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
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
}
/**
 * The capsule button. Labels are verb + object in Title Case ("Remove from Show"), never "OK".
 * Variants: accent is the one primary action per screen (always with text). inverse is an emphasized decision.
 * tinted is secondary (Cancel, Edit). plain goes inside nav islands and toolbar groups. outline is a toggleable
 * secondary. danger is destructive. glass stands alone on canvas. glass-media, media and media-solid go on a Stage only.
 * At most one accent per screen (plus one in the navbar). Glass containers never contain variant="glass".
 * @example
 * <GlassButton variant="accent">Export</GlassButton>
 * <GlassButton variant="tinted" size="sm" iconOnly aria-label="Close" icon={<Icon strokeWidth={1.8}><path d="M4 4l8 8M12 4l-8 8" /></Icon>} />
 */
export declare const GlassButton: React.ForwardRefExoticComponent<GlassButtonProps & React.RefAttributes<HTMLElement>>;

export interface SegmentedItem {
  label: React.ReactNode;
  /** Stable key and the value passed to onChange. Defaults to label. */
  value?: string;
  /** mode="links" only. */
  href?: string;
  /** Count badge after the label (neutral). */
  badge?: React.ReactNode;
  /** Use the warn badge only for counts that need the user's attention. */
  badgeWarn?: boolean;
  disabled?: boolean;
  /** mode="tabs": id of the tabpanel this tab controls. */
  controls?: string;
}
export interface SegmentedControlProps {
  /** 2 to 5 options (at most 4 on mobile), one or two words each. */
  items: Array<string | SegmentedItem>;
  /** Controlled selected index. */
  index?: number;
  /** Uncontrolled initial index. Default 0. */
  defaultIndex?: number;
  onChange?(index: number, value: string, item: HTMLElement): void;
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
export interface ToolbarScrubberProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Progress 0-100. */
  value?: number;
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
 *     <GlassButton variant="plain" iconOnly aria-label="Undo" title="Undo (⌘Z)" icon={undoIcon} />
 *     <GlassButton variant="plain" iconOnly aria-label="Redo" title="Redo (⇧⌘Z)" icon={redoIcon} />
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
  /** Shortcut hint. Default "⌘K". Pass null to hide. */
  hint?: React.ReactNode;
  /** Default "Send". Disabled (neutral) while the input is empty. */
  sendLabel?: React.ReactNode;
  defaultValue?: string;
  onSubmit?(value: string): void;
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
  /** Element type. Default "aside". */
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}
export interface PanelSectionProps extends React.HTMLAttributes<HTMLElement> {
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
  /** Every item has an icon, placed first. */
  icon?: React.ReactNode;
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
 * names its id; Esc returns focus to that button. Positioning is up to the page (position it absolutely).
 * Confirm destructive actions inline with Menu.Confirm, never with a separate dialog.
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
  /** Default true. Set false while a form has unsaved input. */
  dismissOnBackdrop?: boolean;
  children?: React.ReactNode;
}
/**
 * A sheet for a small focused task (add, replace, configure). Half height it is thick glass inset from the
 * screen edges; at full height it turns opaque. Never for confirming deletion (use Menu.Confirm) and never
 * a sheet inside a sheet. Nothing inside is glass.
 * @example
 * <Modal open={open} onClose={() => setOpen(false)} title="Add an Angle to “Harbor”"
 *   hint="Choosing this locks the angle; later versions will follow it."
 *   actions={<GlassButton variant="accent" data-lg-close="confirm">Use “Harbor · Backlit”</GlassButton>}>
 *   <TextField placeholder="Name the angle" aria-label="Angle name" />
 * </Modal>
 */
export declare const Modal: React.FC<ModalProps>;

export interface NavLink {
  label: React.ReactNode;
  href?: string;
  value?: string;
}
export interface FloatingNavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Logo (currentColor) + brand name. */
  brand: React.ReactNode;
  brandHref?: string;
  /** aria-label of the brand link ("Lumen home"). */
  brandLabel?: string;
  /** The main destinations, at most 5. Desktop: links in the brand island. Mobile: render the same list in a TabBar. */
  links?: Array<string | NavLink>;
  /** Index of the current destination. Default 0. */
  currentLink?: number;
  /** Context island (desktop only): project name, neutral ProgressBar, count. Optional parts: lg-nav-optional. */
  context?: React.ReactNode;
  /** Project tabs island (desktop only), usually a SegmentedControl mode="tabs". */
  tabs?: React.ReactNode;
  /** The one accent primary action, standing outside the islands (desktop only). */
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

export interface TabBarTab {
  label: React.ReactNode;
  /** 20px icon (Icon size="lg"). */
  icon: React.ReactNode;
  href?: string;
}
export interface TabBarProps extends React.HTMLAttributes<HTMLElement> {
  /** 2 to 5 tabs, the same destinations and order as FloatingNavbar links. One-word labels. */
  tabs: TabBarTab[];
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
/**
 * The mobile tab bar floating at the bottom (below 744px only). Reserve tabbar-height + 24px at the page bottom.
 * @example
 * <TabBar tabs={[{ label: 'Studio', icon: studioIcon }, { label: 'Library', icon: libraryIcon }]} search />
 */
export declare const TabBar: React.ForwardRefExoticComponent<TabBarProps & React.RefAttributes<HTMLElement>>;

export interface StageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** CSS background-image for the media (an url(...) or gradients). */
  media?: string;
  /** Top scrim band: one label per stage (Badge glass). */
  top?: React.ReactNode;
  /** Bottom scrim band: the stage Toolbar. */
  bottom?: React.ReactNode;
  /** No scrim bands. */
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

export interface ListRowProps extends React.HTMLAttributes<HTMLElement> {
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
  selected?: boolean;
  /** Non-interactive row (div). */
  isStatic?: boolean;
  children?: React.ReactNode;
}
/** List row: thumbnail, 13/600 title, 12px muted subtitle, optional arrow. Hover uses fill; selected uses accent-soft. */
export declare const ListRow: React.FC<ListRowProps>;

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
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

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Renders a textarea (radius-xl). */
  multiline?: boolean;
  rows?: number;
  /** Error message; sets aria-invalid and connects the message with aria-describedby. */
  error?: React.ReactNode;
}
/** 46px capsule input on surface-inset, no border. Always give an aria-label or a visible label. */
export declare const TextField: React.ForwardRefExoticComponent<TextFieldProps & React.RefAttributes<HTMLInputElement>>;

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

/** One short status message, thick glass, centered at content-top; hides after timeout ms (default 2800). */
export declare function toast(message: string, options?: { timeout?: number; root?: HTMLElement }): HTMLElement | null;
