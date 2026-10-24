// Liquid Glass Web — window.LiquidGlass (framework-free). Types are documentation.
// Every function enhances existing markup (see each component's README) and returns a controller.

export type Tone = "light" | "dark";

export interface ThemePreferences {
  /** "auto" follows prefers-color-scheme. */
  scheme?: "auto" | "light" | "dark";
  /** "reduce" switches to the *-solid theme. Safari never reports the OS setting, so offer this in site settings. */
  transparency?: "auto" | "full" | "reduce";
  /** "more" switches to the *-contrast theme (7:1 text, opaque glass, strong borders). */
  contrast?: "auto" | "standard" | "more";
  /** "reduce" turns off every transform, morph and spring. */
  motion?: "auto" | "reduce";
  /** "strong" raises blur and saturation (html[data-glass="strong"]); opacity is unchanged, so contrast holds. */
  glass?: "auto" | "restrained" | "strong";
}

export interface FloatingNavbarProps {
  /** Each .lg-navbar__island switches to dark glass over sections marked data-surface-tone="dark". Default true. */
  adaptiveTone?: boolean;
  /** Custom scroll container. Default window. */
  scrollContainer?: Window | HTMLElement;
}
export interface FloatingNavbarController {
  element: HTMLElement;
  open(): void;
  close(): void;
  /** Re-read the scroll position and the tone under each island. data-scroll-manual on the header freezes data-scrolled. */
  refresh(): void;
  destroy(): void;
}
export declare function FloatingNavbar(header: HTMLElement, props?: FloatingNavbarProps): FloatingNavbarController;

export interface TabBarProps {
  /** "scroll-down" (default): shrink to the current tab + search after scrolling down 48px, restore on scroll up.
      "scroll-up" does the reverse; "off" never shrinks. Also read from data-minimize. Focus inside always restores it. */
  minimize?: "scroll-down" | "scroll-up" | "off";
  /** The tabs and the search button switch to dark glass over sections marked data-surface-tone="dark". Default true. */
  adaptiveTone?: boolean;
  /** Custom scroll container. Default window. */
  scrollContainer?: Window | HTMLElement;
}
export interface TabBarController {
  element: HTMLElement;
  setMinimized(minimized: boolean): void;
  destroy(): void;
}
/** Markup: nav.lg-tabbar > .lg-scroll-edge.lg-scroll-edge--bottom + .lg-tabbar__tabs.lg-glass > a.lg-tabbar__tab[aria-current] (+ optional trailing button.lg-tabbar__search.lg-glass).
    Shown below 744px only (add lg-tabbar--contained to show it inside a demo frame). data-scroll-manual freezes data-scrolled/data-minimized. */
export declare function TabBar(nav: HTMLElement, props?: TabBarProps): TabBarController;

export interface GlassButtonProps {
  /** Treat as a toggle (aria-pressed). Also inferred from an existing aria-pressed attribute. */
  toggle?: boolean;
  onToggle?(pressed: boolean, button: HTMLElement): void;
}
export interface GlassButtonController {
  element: HTMLElement;
  /** Uses aria-disabled so the button stays discoverable by keyboard and screen readers. */
  setDisabled(disabled: boolean): void;
  destroy(): void;
}
/** Markup: class="lg-btn lg-btn--{accent|inverse|tinted|plain|outline|danger|media|media-solid} [lg-btn--xs|sm|lg|nav] [lg-btn--icon]",
    or add lg-glass (+ lg-glass--thick over arbitrary content) / lg-glass lg-glass--media for a glass button.
    data-armed on lg-btn--danger marks a confirmed destructive action. Hide a button with the hidden attribute, never by emptying it. */
export declare function GlassButton(button: HTMLElement, props?: GlassButtonProps): GlassButtonController;

export interface SegmentedControlProps {
  onChange?(index: number, value: string, item: HTMLElement): void;
}
export interface SegmentedControlController {
  element: HTMLElement;
  select(index: number): void;
  readonly index: number;
  destroy(): void;
}
/** Also dispatches a bubbling "lg:change" CustomEvent with detail { index, value }. */
export declare function SegmentedControl(group: HTMLElement, props?: SegmentedControlProps): SegmentedControlController;

export interface ToolbarProps {}
/** Markup: div.lg-toolbar[role=toolbar][aria-label] > one .lg-toolbar__group.lg-glass per set of related icon buttons,
    with the text primary action (.lg-btn--accent) as a direct child. A group whose buttons are all hidden disappears.
    One tab stop for the whole toolbar; arrow keys move across groups and skip disabled or hidden buttons. */
export interface ToolbarController { element: HTMLElement; destroy(): void; }
export declare function Toolbar(toolbar: HTMLElement, props?: ToolbarProps): ToolbarController;

export interface ModalProps {
  /** Close when the backdrop is clicked. Set false while a form has unsaved input. Default true. */
  dismissOnBackdrop?: boolean;
  onOpen?(dialog: HTMLDialogElement): void;
  onClose?(returnValue: string, dialog: HTMLDialogElement): void;
}
/** Partial-height sheets are thick glass; the controller sets data-expanded (opaque surface) while the sheet is at its
    max-height or covers ≥ 90% of the viewport, re-checked on resize and content changes. lg-modal--full is always opaque. */
export interface ModalController {
  element: HTMLDialogElement;
  /** Opens with showModal(); focus returns to `trigger` on close. */
  open(trigger?: HTMLElement): void;
  /** Animated close; `value` becomes dialog.returnValue. */
  close(value?: string): void;
  destroy(): void;
}
export declare function Modal(dialog: HTMLDialogElement, props?: ModalProps): ModalController;

export interface GlassPanelProps {
  /** Button that toggles the panel. Defaults to the element whose aria-controls names the panel's id. */
  trigger?: HTMLElement;
  /** Escape and outside click close the panel. Default true. */
  dismissible?: boolean;
}
export interface GlassPanelController {
  element: HTMLElement;
  /** Also sets --lg-origin from the trigger so the panel grows out of it. */
  show(): void;
  hide(returnFocus?: boolean): void;
  toggle(): void;
  destroy(): void;
}
export declare function GlassPanel(panel: HTMLElement, props?: GlassPanelProps): GlassPanelController;

export interface InitOptions {
  navbar?: FloatingNavbarProps;
  tabbar?: TabBarProps;
  segmented?: SegmentedControlProps;
  toolbar?: ToolbarProps;
  modal?: ModalProps;
  button?: GlassButtonProps;
  panel?: GlassPanelProps;
  /** Set false to skip enableRefraction(). */
  refraction?: boolean;
}

declare global {
  interface Window {
    LiquidGlass: {
      version: string;
      /** Binds every [data-lg], [data-lg-open] and [data-tone] inside `root`; enables refraction where supported.
          Also tracks the on-screen keyboard: html gets --lg-keyboard-inset (px) and data-keyboard while it is open,
          so .lg-tabbar and .lg-toolbar--float sit above it (ignored while pinch-zoomed). */
      init(root?: ParentNode, options?: InitOptions): unknown[];
      /** Resolves scheme × transparency × contrast into html[data-theme]; persists explicit choices. Call in <head>. */
      applyTheme(preferences?: ThemePreferences): string;
      preferences(): Required<ThemePreferences> & { theme: string };
      /** Rung 2: SVG edge refraction for [data-refract]. Returns false (and does nothing) outside Chromium, under reduced transparency or increased contrast, or on low-memory devices. */
      enableRefraction(options?: { root?: ParentNode; force?: boolean }): boolean;
      disableRefraction(): void;
      supportsRefraction(): boolean;
      /** Give one element light or dark glass; keeps the page's solid/contrast mode. Pass null to follow the page again. */
      setTone(element: HTMLElement, tone: Tone | null): void;
      /** One polite status message at a time, centred at content-top; hides after `timeout` ms (default 2800, 0 keeps it). */
      toast(message: string, options?: { timeout?: number; root?: HTMLElement }): HTMLElement;
      FloatingNavbar: typeof FloatingNavbar;
      TabBar: typeof TabBar;
      GlassButton: typeof GlassButton;
      SegmentedControl: typeof SegmentedControl;
      Toolbar: typeof Toolbar;
      Modal: typeof Modal;
      GlassPanel: typeof GlassPanel;
    };
  }
}
