// Liquid Glass Web — window.LiquidGlass (framework-free). Types are documentation.
// Every function enhances existing markup (see each component's README) and returns a controller.
// Controller contract: one controller per element (calling again returns the same one); callbacks are read at
// call time; destroy() releases every listener and observer it added, and is safe to call twice.
// Overlay contract: navbar menus, panels, menus and modals form one stack. Escape closes the top layer only.

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
  /** "comfortable": 16px body, 15px controls (html[data-density]). Below 744px comfortable is the default unless "compact". */
  density?: "auto" | "compact" | "comfortable";
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
  /** "scroll-down" (default): get shorter and drop the labels after scrolling down 48px (every tab stays), restore on scroll up.
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
  /** Called once per committed change. `value` is the item's data-value, else its label without badges or .lg-sr-only text. */
  onChange?(index: number, value: string, item: HTMLElement): void;
  /** Called while a drag shows another item. Nothing is committed until release; a cancelled gesture reverts. */
  onPreview?(index: number, value: string, item: HTMLElement): void;
  /** true: a change is a request. The host commits it with select(index, { emit: false }); if it does not by the
      next frame, the control returns to the committed item. */
  controlled?: boolean;
  /** Tabs only. "automatic" (default): arrows switch. "manual": arrows move focus, Enter or Space switches. Also data-activation. */
  activation?: "automatic" | "manual";
}
export interface SegmentedControlController {
  element: HTMLElement;
  /** Commit by index. { emit: false } syncs from the host without another onChange. */
  select(index: number, options?: { emit?: boolean }): void;
  /** Re-read the items. Runs by itself when items are added or removed; the selection keeps its element or value,
      else falls back to the first enabled item. */
  refresh(): void;
  readonly index: number;
  readonly value: string | null;
  destroy(): void;
}
/** Also dispatches a bubbling "lg:change" CustomEvent with detail { index, value }.
    role="tablist": a horizontal tablist handles Left/Right only (aria-orientation="vertical" for Up/Down), and each
    tab shows the panel named by its aria-controls and hides the others. Horizontal drags select; vertical ones scroll. */
export declare function SegmentedControl(group: HTMLElement, props?: SegmentedControlProps): SegmentedControlController;

export interface ToolbarProps {}
/** Markup: div.lg-toolbar[role=toolbar][aria-label] > one .lg-toolbar__group.lg-glass per set of related icon buttons,
    with the text primary action (.lg-btn--accent) as a direct child. A group whose buttons are all hidden disappears.
    One tab stop for the whole toolbar; arrow keys move across groups and skip disabled or hidden buttons. */
export interface ToolbarController {
  element: HTMLElement;
  /** Re-pick the single tab stop. Runs by itself when buttons are hidden, disabled, added or removed. */
  refresh(): void;
  destroy(): void;
}
export declare function Toolbar(toolbar: HTMLElement, props?: ToolbarProps): ToolbarController;

export type CloseReason = "escape" | "backdrop" | "close-button" | "api";
export interface ModalProps {
  /** Close when the backdrop is clicked (pointer down and up both outside the sheet). Default true. */
  dismissOnBackdrop?: boolean;
  /** Return false to keep the sheet open, for example to protect unsaved input. Runs for Escape, the backdrop and
      [data-lg-close]; the cancelable "lg:closerequest" event (detail { reason }) runs after it. close() is never blocked. */
  beforeClose?(reason: CloseReason, dialog: HTMLDialogElement): boolean | void;
  onOpen?(dialog: HTMLDialogElement): void;
  onClose?(returnValue: string, dialog: HTMLDialogElement): void;
}
/** Partial-height sheets are thick glass; the controller sets data-expanded (opaque surface) while the sheet is at its
    max-height or covers ≥ 90% of the viewport, re-checked on resize and content changes. lg-modal--full is always opaque. */
export interface ModalController {
  element: HTMLDialogElement;
  /** Opens with showModal(); focus returns to `trigger` on close. */
  open(trigger?: HTMLElement): void;
  /** Animated close; `value` becomes dialog.returnValue. Not subject to beforeClose. */
  close(value?: string): void;
  /** Ask to close as the user would; returns false if beforeClose or an lg:closerequest listener refused. */
  requestClose(reason?: CloseReason): boolean;
  /** Safe while open: removes the resize listener and observer and leaves the overlay stack. */
  destroy(): void;
}
export declare function Modal(dialog: HTMLDialogElement, props?: ModalProps): ModalController;

export interface GlassPanelProps {
  /** Button that toggles the panel. Defaults to the element whose aria-controls names the panel's id. */
  trigger?: HTMLElement;
  /** Escape and outside click close the panel. Default true. */
  dismissible?: boolean;
}
/** role="menu": the menu button pattern. The trigger gets aria-haspopup="menu"; items are not tab stops; opening
    focuses the first item (ArrowUp on the trigger: the last); arrows, Home, End and typeahead move between visible
    items; Escape returns to the trigger; Tab closes; activating an item closes the menu (data-keep-open opts out).
    Items with aria-disabled="true" stay focusable and never run, for pointer, keyboard and script alike.
    role="dialog": opening focuses its first control. */
export interface GlassPanelController {
  element: HTMLElement;
  /** Also sets --lg-origin from the trigger so the panel grows out of it. `focus`: "first" (default), "last" or false. */
  show(focus?: "first" | "last" | false): void;
  hide(returnFocus?: boolean): void;
  toggle(): void;
  destroy(): void;
}
export declare function GlassPanel(panel: HTMLElement, props?: GlassPanelProps): GlassPanelController;

export interface ComposerProps {
  /** A letter bound with ⌘ (Apple) or Ctrl (others) that focuses the input; also data-shortcut. Writes the hint. */
  shortcut?: string | null;
  /** Called on submit with the text; the form's default submit is prevented. */
  onSubmit?(value: string, form: HTMLFormElement): void;
}
export interface ComposerController {
  element: HTMLFormElement;
  focus(): void;
  /** "pending": aria-busy, Send disabled, text kept. "error": the message shows in a role=status region, text kept,
      Send enabled for a retry. "idle": clears both. */
  setStatus(status: "idle" | "pending" | "error", message?: string): void;
  readonly status: "idle" | "pending" | "error";
  destroy(): void;
}
/** Markup: form.lg-composer.lg-glass[aria-label][data-lg="composer"] > scope badge + input.lg-composer__input +
    span.lg-composer__hint (empty) + button[type=submit]. An assistant instruction field, not role="search". */
export declare function Composer(form: HTMLFormElement, props?: ComposerProps): ComposerController;

export interface SelectListProps {
  onChange?(values: string[], option: HTMLElement): void;
}
export interface SelectListController {
  element: HTMLElement;
  readonly values: string[];
  select(index: number): void;
  refresh(): void;
  destroy(): void;
}
/** Markup: [role="listbox"][aria-label][data-lg="list"] > .lg-row[role="option"][aria-selected][data-value].
    Single selection follows focus; with aria-multiselectable="true" arrows only move and Space toggles. */
export declare function SelectList(list: HTMLElement, props?: SelectListProps): SelectListController;

export interface ShortcutBinding {
  /** "⌘K" on Apple platforms, "Ctrl K" elsewhere: the only text a shortcut hint may show. */
  label: string;
  /** For aria-keyshortcuts, for example "Meta+K". */
  aria: string;
  destroy(): void;
}

export interface InitOptions {
  navbar?: FloatingNavbarProps;
  tabbar?: TabBarProps;
  segmented?: SegmentedControlProps;
  toolbar?: ToolbarProps;
  modal?: ModalProps;
  button?: GlassButtonProps;
  panel?: GlassPanelProps;
  composer?: ComposerProps;
  list?: SelectListProps;
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
      /** Releases every controller bound inside `root` (and its refraction filters). Returns how many. Call before
          removing a subtree that init() enhanced (a route change, an unmounted React root). */
      destroy(root?: ParentNode): number;
      /** Resolves scheme × transparency × contrast into html[data-theme]; persists explicit choices. Call in <head>. */
      applyTheme(preferences?: ThemePreferences): string;
      preferences(): Required<ThemePreferences> & { theme: string };
      /** Rung 2: SVG edge refraction for [data-refract]. Returns false (and does nothing) outside Chromium, under reduced transparency or increased contrast, or on low-memory devices. */
      enableRefraction(options?: { root?: ParentNode; force?: boolean }): boolean;
      disableRefraction(): void;
      supportsRefraction(): boolean;
      /** Give one element light or dark glass; keeps the page's solid/contrast mode. Pass null to follow the page again. */
      setTone(element: HTMLElement, tone: Tone | null): void;
      /** One polite status message at a time, centred at content-top. Messages queue; while a modal is open the toast
          shows inside it and closing the modal clears it. `action` adds a button (Undo), jumps the queue and stays 8 s;
          hover or focus pauses it. Default timeout 2800 ms; 0 keeps it. */
      toast(message: string, options?: { timeout?: number; root?: HTMLElement; replace?: boolean; action?: { label: string; onClick?(): void } }): HTMLElement;
      /** Bind ⌘key (Apple) or Ctrl+key. Skips IME composition and contenteditable. */
      shortcut(key: string, handler: (event: KeyboardEvent) => void, options?: { shift?: boolean; inEditable?: boolean }): ShortcutBinding;
      FloatingNavbar: typeof FloatingNavbar;
      TabBar: typeof TabBar;
      GlassButton: typeof GlassButton;
      SegmentedControl: typeof SegmentedControl;
      Toolbar: typeof Toolbar;
      Modal: typeof Modal;
      GlassPanel: typeof GlassPanel;
      Composer: typeof Composer;
      SelectList: typeof SelectList;
    };
  }
}
