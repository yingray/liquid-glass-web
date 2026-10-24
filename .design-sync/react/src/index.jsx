// Liquid Glass Web: React adapters for Claude Design.
// Each component renders the markup that its README in design-system/components/ documents,
// and binds the real window.LiquidGlass controller from bundle.js. No styling or behaviour lives here.
import '../../../design-system/components/bundle.js';
import { Children, cloneElement, createContext, forwardRef, isValidElement, useContext, useEffect, useId, useRef, useState } from 'react';

const cx = (...a) => a.filter(Boolean).join(' ');
const lg = () => (typeof window !== 'undefined' ? window.LiquidGlass : undefined);

function setRef(ref, value) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

// Binds a LiquidGlass controller to the rendered element for the component's lifetime.
function useController(name, props, forwardedRef) {
  const el = useRef(null);
  const ctrl = useRef(null);
  const latest = useRef(props);
  latest.current = props;
  useEffect(() => {
    const api = lg();
    if (!el.current || !api || !api[name]) return undefined;
    ctrl.current = api[name](el.current, latest.current);
    return () => {
      if (ctrl.current && ctrl.current.destroy) ctrl.current.destroy();
      ctrl.current = null;
    };
  }, [name]);
  const ref = (node) => {
    el.current = node;
    setRef(forwardedRef, node);
  };
  return [ref, ctrl, el];
}

/* ---------- Root ---------- */

const RootContext = createContext(false);

// The outermost root sets the page theme on <html>. A nested root only re-tones its own subtree
// (light or dark glass), keeping the page's solid or contrast mode, as LiquidGlass.setTone does.
export function LiquidGlassRoot({ theme = 'dark', transparency, contrast, motion, glass, refraction = true, className, style, children, ...rest }) {
  const nested = useContext(RootContext);
  const el = useRef(null);
  useEffect(() => {
    const api = lg();
    if (!api) return;
    if (nested) {
      if (el.current) api.setTone(el.current, theme === 'light' || theme === 'dark' ? theme : null);
      return;
    }
    api.applyTheme({ scheme: theme, transparency, contrast, motion, glass });
  }, [nested, theme, transparency, contrast, motion, glass]);
  useEffect(() => {
    const api = lg();
    if (api && el.current) api.init(el.current, { refraction });
  }, [refraction]);
  return (
    <div
      ref={el}
      className={cx('lg-root body', className)}
      style={{ background: 'var(--canvas)', color: 'var(--ink)', ...style }}
      {...rest}
    >
      <RootContext.Provider value={true}>{children}</RootContext.Provider>
    </div>
  );
}

export function toast(message, options) {
  const api = lg();
  return api ? api.toast(message, options) : null;
}

/* ---------- Icon ---------- */

const ICON_SIZE = { sm: 'var(--icon-sm)', md: 'var(--icon-md)', lg: 'var(--icon-lg)' };

export function Icon({ size, strokeWidth = 1.6, label, className, style, children, ...rest }) {
  return (
    <svg
      className={cx('lg-icon', className)}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : 'true'}
      aria-label={label}
      role={label ? 'img' : undefined}
      style={size ? { width: ICON_SIZE[size], height: ICON_SIZE[size], ...style } : style}
      {...rest}
    >
      {children}
    </svg>
  );
}

const CloseIcon = () => (
  <Icon strokeWidth={1.8}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </Icon>
);
const MenuIcon = () => (
  <Icon>
    <path d="M2.5 5h11M2.5 11h11" />
  </Icon>
);
const SearchIcon = () => (
  <Icon>
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5 14 14" />
  </Icon>
);
const Chevron = () => (
  <svg className="lg-row__chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 3.5 10.5 8 6 12.5" />
  </svg>
);

/* ---------- GlassButton ---------- */

const BUTTON_VARIANT = {
  accent: 'lg-btn--accent',
  inverse: 'lg-btn--inverse',
  tinted: 'lg-btn--tinted',
  plain: 'lg-btn--plain',
  outline: 'lg-btn--outline',
  danger: 'lg-btn--danger',
  media: 'lg-btn--media',
  'media-solid': 'lg-btn--media-solid',
  glass: 'lg-glass',
  'glass-media': 'lg-glass lg-glass--media',
};

export const GlassButton = forwardRef(function GlassButton(
  { variant = 'tinted', size = 'md', icon, iconOnly, thick, chip, block, armed, toggle, defaultPressed, onToggle, disabled, href, type = 'button', className, children, ...rest },
  forwardedRef,
) {
  const isToggle = toggle || defaultPressed !== undefined;
  const [ref] = useController('GlassButton', { toggle: isToggle, onToggle }, forwardedRef);
  const cls = cx(
    'lg-btn',
    BUTTON_VARIANT[variant],
    size !== 'md' && `lg-btn--${size}`,
    iconOnly && 'lg-btn--icon',
    block && 'lg-btn--block',
    thick && variant === 'glass' && 'lg-glass--thick',
    chip && 'lg-glass--chip',
    className,
  );
  const common = {
    ref,
    className: cls,
    'aria-pressed': isToggle ? String(!!defaultPressed) : undefined,
    'aria-disabled': disabled ? 'true' : undefined,
    'data-armed': armed ? '' : undefined,
    ...rest,
  };
  const content = (
    <>
      {icon}
      {iconOnly ? null : children}
    </>
  );
  if (href) return <a href={href} {...common}>{content}</a>;
  return <button type={type} {...common}>{content}</button>;
});

/* ---------- SegmentedControl ---------- */

function normItem(item) {
  return typeof item === 'string' ? { label: item, value: item } : { value: item.label, ...item };
}

export const SegmentedControl = forwardRef(function SegmentedControl(
  { items, index, defaultIndex = 0, onChange, label, mode = 'radio', size = 'md', block, media, disabled, className, ...rest },
  forwardedRef,
) {
  const list = items.map(normItem);
  const selected = index ?? defaultIndex;
  const linkMode = mode === 'links';
  const [ref, ctrl] = useController(linkMode ? '__none' : 'SegmentedControl', { onChange: (i, v, item) => onChange && onChange(i, v, item) }, forwardedRef);
  useEffect(() => {
    if (index != null && ctrl.current && ctrl.current.index !== index) ctrl.current.select(index);
  }, [index]);
  const cls = cx('lg-segmented', size !== 'md' && `lg-segmented--${size}`, block && 'lg-segmented--block', media && 'lg-segmented--media', className);
  const badge = (it) =>
    it.badge != null ? <span className={cx('lg-badge lg-badge--sm lg-badge--count', it.badgeWarn && 'lg-badge--warn')}>{it.badge}</span> : null;
  if (linkMode) {
    return (
      <nav ref={ref} className={cls} aria-label={label} {...rest}>
        {list.map((it, i) => (
          <a key={it.value} className={cx('lg-segmented__item', it.navbarLink && 'lg-navbar__link')} href={it.href ?? '#'} aria-current={i === selected ? 'page' : undefined}>
            {it.label}
            {badge(it)}
          </a>
        ))}
      </nav>
    );
  }
  const tabs = mode === 'tabs';
  return (
    <div ref={ref} className={cls} role={tabs ? 'tablist' : 'radiogroup'} aria-label={label} aria-disabled={disabled ? 'true' : undefined} {...rest}>
      {list.map((it, i) => (
        <button
          key={it.value}
          className="lg-segmented__item"
          type="button"
          role={tabs ? 'tab' : 'radio'}
          aria-checked={tabs ? undefined : String(i === selected)}
          aria-selected={tabs ? String(i === selected) : undefined}
          aria-controls={it.controls}
          aria-disabled={it.disabled ? 'true' : undefined}
        >
          {it.label}
          {badge(it)}
        </button>
      ))}
      <span className="lg-segmented__thumb" aria-hidden="true" />
    </div>
  );
});

/* ---------- Toolbar and Composer ---------- */

const ToolbarBase = forwardRef(function Toolbar({ label, float, className, children, ...rest }, forwardedRef) {
  const [ref] = useController('Toolbar', {}, forwardedRef);
  return (
    <div ref={ref} className={cx('lg-toolbar', float && 'lg-toolbar--float', className)} role="toolbar" aria-label={label} {...rest}>
      {children}
    </div>
  );
});

function ToolbarGroup({ readout, media, className, children, ...rest }) {
  return (
    <div className={cx('lg-toolbar__group', readout && 'lg-toolbar__group--readout', 'lg-glass', media && 'lg-glass--media lg-glass--elevated', className)} {...rest}>
      {children}
    </div>
  );
}

function ToolbarText({ total, className, children, ...rest }) {
  return (
    <span className={cx('lg-toolbar__text', className)} {...rest}>
      {children}
      {total != null ? <small> / {total}</small> : null}
    </span>
  );
}

function ToolbarScrubber({ value = 0, className, style, ...rest }) {
  return (
    <span className={cx('lg-scrub', className)} style={{ '--lg-value': `${value}%`, ...style }} {...rest}>
      <span>
        <span />
      </span>
    </span>
  );
}

function ToolbarSpacer() {
  return <span className="lg-spacer" />;
}

export const Toolbar = Object.assign(ToolbarBase, { Group: ToolbarGroup, Text: ToolbarText, Scrubber: ToolbarScrubber, Spacer: ToolbarSpacer });

export function Composer({ label, placeholder, scope, hint = '⌘K', sendLabel = 'Send', defaultValue = '', onSubmit, flat, className, ...rest }) {
  const [value, setValue] = useState(defaultValue);
  const empty = value.trim() === '';
  return (
    <form
      className={cx('lg-composer lg-glass', flat && 'lg-glass--flat', className)}
      role="search"
      aria-label={label}
      onSubmit={(e) => {
        e.preventDefault();
        if (!empty && onSubmit) onSubmit(value);
      }}
      {...rest}
    >
      <span className="lg-dot lg-dot--lg lg-dot--accent" aria-hidden="true" />
      {scope ? <span className="lg-badge lg-badge--mono">{scope}</span> : null}
      <input className="lg-composer__input" type="text" placeholder={placeholder} aria-label={label} value={value} onChange={(e) => setValue(e.target.value)} />
      {hint ? <span className="lg-composer__hint" aria-hidden="true">{hint}</span> : null}
      <button className="lg-btn lg-btn--accent" type="submit" disabled={empty}>
        {sendLabel}
      </button>
    </form>
  );
}

/* ---------- GlassPanel (inspector, sidebar) ---------- */

function PanelHead({ title, count }) {
  if (title == null) return null;
  return (
    <div className="lg-panel__head">
      <h3>{title}</h3>
      {count != null ? <span className="lg-panel__count">{count}</span> : null}
    </div>
  );
}

const GlassPanelBase = forwardRef(function GlassPanel({ label, material = 'flat', rail, as: As = 'aside', className, children, ...rest }, ref) {
  return (
    <As ref={ref} className={cx('lg-panel lg-glass', material === 'thick' ? 'lg-glass--thick' : 'lg-glass--flat', rail && 'lg-panel--rail', className)} aria-label={label} {...rest}>
      {children}
    </As>
  );
});

function PanelGroup({ title, count, className, children, ...rest }) {
  return (
    <div className={cx('lg-panel__group', className)} {...rest}>
      <PanelHead title={title} count={count} />
      {children}
    </div>
  );
}

function PanelSection({ title, count, className, children, ...rest }) {
  return (
    <section className={cx('lg-panel__section', className)} {...rest}>
      <PanelHead title={title} count={count} />
      {children}
    </section>
  );
}

function PanelFooter({ className, children, ...rest }) {
  return (
    <div className={cx('lg-panel__footer', className)} {...rest}>
      {children}
    </div>
  );
}

export const GlassPanel = Object.assign(GlassPanelBase, { Group: PanelGroup, Section: PanelSection, Footer: PanelFooter });

/* ---------- Menu (popover glass, bound with LiquidGlass.GlassPanel) ---------- */

const MenuBase = forwardRef(function Menu({ id, label, size = 'md', defaultOpen = false, dismissible = true, role = 'menu', className, children, ...rest }, forwardedRef) {
  const [ref] = useController('GlassPanel', { dismissible }, forwardedRef);
  return (
    <div
      ref={ref}
      id={id}
      className={cx('lg-menu', size === 'sm' && 'lg-menu--sm', 'lg-glass lg-glass--popover', className)}
      role={role}
      aria-label={label}
      hidden={defaultOpen ? undefined : true}
      {...rest}
    >
      {children}
    </div>
  );
});

function MenuItem({ icon, danger, href, className, children, ...rest }) {
  const cls = cx('lg-menu__item', danger && 'lg-menu__item--danger', className);
  if (href)
    return (
      <a className={cls} href={href} role="menuitem" {...rest}>
        {icon}
        {children}
      </a>
    );
  return (
    <button className={cls} type="button" role="menuitem" {...rest}>
      {icon}
      {children}
    </button>
  );
}

function MenuSeparator() {
  return <div className="lg-menu__sep" role="separator" />;
}

function MenuLabel({ children }) {
  return <span className="lg-menu__label">{children}</span>;
}

function MenuStatus({ status = 'neutral', pulse, title, detail }) {
  return (
    <div className="lg-menu__status">
      <span className={cx('lg-dot', status !== 'neutral' && `lg-dot--${status}`, pulse && 'lg-dot--pulse')} />
      <span>
        <b>{title}</b>
        {detail ? <small>{detail}</small> : null}
      </span>
    </div>
  );
}

function MenuConfirm({ title, titleId, cancelLabel = 'Cancel', confirmLabel, onCancel, onConfirm, children }) {
  return (
    <div className="lg-menu__confirm">
      <b id={titleId}>{title}</b>
      {children ? <p>{children}</p> : null}
      <div>
        <button className="lg-btn lg-btn--tinted" type="button" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button className="lg-btn lg-btn--danger" type="button" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

export const Menu = Object.assign(MenuBase, { Item: MenuItem, Separator: MenuSeparator, Label: MenuLabel, Status: MenuStatus, Confirm: MenuConfirm });

/* ---------- Modal (sheet) ---------- */

export function Modal({
  open = false,
  onClose,
  onOpen,
  title,
  hint,
  actions,
  closeLabel = 'Close',
  compact,
  full,
  isStatic,
  expanded,
  dismissOnBackdrop = true,
  className,
  children,
  ...rest
}) {
  const titleId = useId();
  const [ref, ctrl, el] = useController(
    isStatic ? '__none' : 'Modal',
    { dismissOnBackdrop, onOpen, onClose: (value, dialog) => onClose && onClose(value, dialog) },
    null,
  );
  useEffect(() => {
    const d = el.current;
    if (isStatic || !ctrl.current || !d) return;
    if (open && !d.open) ctrl.current.open(document.activeElement instanceof HTMLElement ? document.activeElement : undefined);
    if (!open && d.open) ctrl.current.close();
  }, [open, isStatic]);
  const cls = cx('lg-modal', compact && 'lg-modal--compact', full && 'lg-modal--full', isStatic && 'lg-modal--static', className);
  const inner = (
    <>
      <span className="lg-modal__grabber" aria-hidden="true" />
      <div className="lg-modal__header">
        <h2 className="lg-modal__title title-3" id={titleId}>
          {title}
        </h2>
        <button className="lg-btn lg-btn--tinted lg-btn--icon lg-btn--sm" type="button" aria-label={closeLabel} data-lg-close="">
          <CloseIcon />
        </button>
      </div>
      <div className="lg-modal__body">{children}</div>
      {hint || actions ? (
        <div className="lg-modal__footer">
          {hint ? <span className="lg-modal__hint">{hint}</span> : null}
          {actions}
        </div>
      ) : null}
    </>
  );
  if (isStatic) {
    return (
      <div ref={ref} className={cls} role="dialog" aria-modal="false" aria-labelledby={titleId} data-expanded={expanded ? '' : undefined} {...rest}>
        {inner}
      </div>
    );
  }
  return (
    <dialog ref={ref} className={cls} aria-labelledby={titleId} {...rest}>
      {inner}
    </dialog>
  );
}

/* ---------- FloatingNavbar and TabBar ---------- */

function withClass(node, extra) {
  return isValidElement(node) ? cloneElement(node, { className: cx(node.props.className, extra) }) : node;
}

export const FloatingNavbar = forwardRef(function FloatingNavbar(
  { brand, brandHref = '/', brandLabel, links, currentLink = 0, context, tabs, action, tools, menu, menuLabel = 'Menu', defaultMenuOpen = false, contained, adaptiveTone = true, scrolled, className, ...rest },
  forwardedRef,
) {
  const menuId = useId();
  const [ref] = useController('FloatingNavbar', { adaptiveTone }, forwardedRef);
  return (
    <header
      ref={ref}
      className={cx('lg-navbar', contained && 'lg-navbar--contained', className)}
      data-scrolled={scrolled ? '' : undefined}
      data-scroll-manual={scrolled != null ? '' : undefined}
      {...rest}
    >
      <div className="lg-scroll-edge" aria-hidden="true" />
      <div className="lg-navbar__row">
        <div className="lg-navbar__island lg-glass" data-refract="">
          <a className="lg-navbar__brand lg-focusable" href={brandHref} aria-label={brandLabel}>
            {brand}
          </a>
          {links && links.length ? (
            <span className="lg-nav-desktop">
              <SegmentedControl mode="links" label="App" items={links.map((l) => ({ ...normItem(l), navbarLink: true }))} index={currentLink} />
            </span>
          ) : null}
        </div>
        {context ? <div className="lg-navbar__island lg-navbar__island--text lg-glass lg-nav-desktop" data-refract="">{context}</div> : null}
        {tabs ? <div className="lg-navbar__island lg-navbar__island--tight lg-glass lg-nav-desktop">{tabs}</div> : null}
        {action ? withClass(action, 'lg-nav-desktop') : null}
        <span className="lg-navbar__spacer" />
        {tools || menu ? (
          <div className="lg-navbar__island lg-navbar__island--tight lg-glass" data-refract="">
            {tools}
            {menu ? (
              <button className="lg-btn lg-btn--plain lg-btn--icon lg-navbar__menu-toggle" type="button" aria-label={menuLabel} aria-expanded={String(!!defaultMenuOpen)} aria-controls={menuId}>
                <MenuIcon />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      {menu ? (
        <div className="lg-navbar__menu lg-menu lg-glass lg-glass--popover" id={menuId} hidden={defaultMenuOpen ? undefined : true}>
          {menu}
        </div>
      ) : null}
    </header>
  );
});

export const TabBar = forwardRef(function TabBar({ tabs, current = 0, search, searchLabel = 'Search', onSearch, minimize = 'scroll-down', adaptiveTone = true, contained, label = 'Main tabs', className, ...rest }, forwardedRef) {
  const [ref] = useController('TabBar', { minimize, adaptiveTone }, forwardedRef);
  return (
    <nav ref={ref} className={cx('lg-tabbar', contained && 'lg-tabbar--contained', className)} aria-label={label} data-minimize={minimize} {...rest}>
      <div className="lg-scroll-edge lg-scroll-edge--bottom" aria-hidden="true" />
      <div className="lg-tabbar__tabs lg-glass">
        {tabs.map((t, i) => (
          <a key={t.label} className="lg-tabbar__tab" href={t.href ?? '#'} aria-current={i === current ? 'page' : undefined}>
            {t.icon}
            <span>{t.label}</span>
          </a>
        ))}
      </div>
      {search ? (
        <button className="lg-tabbar__search lg-glass" type="button" aria-label={searchLabel} onClick={onSearch}>
          <SearchIcon />
        </button>
      ) : null}
    </nav>
  );
});

/* ---------- Stage ---------- */

export const Stage = forwardRef(function Stage({ media, top, bottom, noScrim, tone = 'dark', className, children, ...rest }, forwardedRef) {
  const el = useRef(null);
  useEffect(() => {
    const api = lg();
    if (api && el.current) api.setTone(el.current, tone);
  }, [tone]);
  return (
    <div
      ref={(n) => {
        el.current = n;
        setRef(forwardedRef, n);
      }}
      className={cx('lg-stage', noScrim && 'lg-stage--no-scrim', className)}
      data-tone={tone}
      {...rest}
    >
      {media ? <div className="lg-stage__media" style={{ backgroundImage: media }} /> : null}
      {top ? <div className="lg-stage__top">{top}</div> : null}
      {children}
      {bottom ? <div className="lg-stage__bottom">{bottom}</div> : null}
    </div>
  );
});

/* ---------- Patterns: opaque parts that can go inside glass ---------- */

export function Badge({ variant = 'default', warn, size, glass, plate, className, children, ...rest }) {
  return (
    <span
      className={cx(
        'lg-badge',
        variant !== 'default' && `lg-badge--${variant}`,
        warn && 'lg-badge--warn',
        size === 'sm' && 'lg-badge--sm',
        glass && 'lg-glass lg-glass--media lg-glass--chip',
        plate && 'lg-plate',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

export function StatusDot({ status = 'neutral', size, pulse, label, className, ...rest }) {
  const dot = <span className={cx('lg-dot', status !== 'neutral' && `lg-dot--${status}`, size === 'lg' && 'lg-dot--lg', pulse && 'lg-dot--pulse', className)} aria-hidden={label ? 'true' : undefined} {...rest} />;
  if (!label) return dot;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-6)' }}>
      {dot}
      {label}
    </span>
  );
}

const THUMB_SIZE = { lg: null, md: 'lg-row__thumb--md', sm: 'lg-row__thumb--sm' };

export function ListRow({ thumb, thumbSize = 'lg', title, badge, subtitle, meta, chevron, selected, isStatic, className, children, ...rest }) {
  const As = isStatic ? 'div' : 'button';
  return (
    <As className={cx('lg-row', isStatic && 'lg-row--static', className)} type={isStatic ? undefined : 'button'} aria-selected={selected ? 'true' : undefined} {...rest}>
      {thumb ? (
        typeof thumb === 'string' ? (
          <span className={cx('lg-row__thumb', THUMB_SIZE[thumbSize])} style={{ backgroundImage: thumb }} />
        ) : (
          thumb
        )
      ) : null}
      <span className="lg-row__text">
        <span className="lg-row__title">
          <span>{title}</span>
          {badge}
        </span>
        {subtitle ? <span className="lg-row__sub">{subtitle}</span> : null}
        {children}
      </span>
      {meta ? <span className="lg-row__meta">{meta}</span> : null}
      {chevron ? <Chevron /> : null}
    </As>
  );
}

export function Callout({ variant = 'suggestion', size, eyebrow, title, actions, className, children, ...rest }) {
  return (
    <div className={cx('lg-callout', variant === 'warn' && 'lg-callout--warn', size === 'lg' && 'lg-callout--lg', className)} {...rest}>
      {eyebrow ? <span className="lg-callout__eyebrow">{eyebrow}</span> : null}
      {title ? <b className="title-3">{title}</b> : null}
      {children ? <p>{children}</p> : null}
      {actions ? <div className="lg-callout__actions">{actions}</div> : null}
    </div>
  );
}

export function ProgressBar({ value = 0, size, neutral, label, className, style, ...rest }) {
  return (
    <span
      className={cx('lg-progress', size === 'md' && 'lg-progress--md', neutral && 'lg-progress--neutral', className)}
      style={{ '--lg-value': `${value}%`, ...style }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      {...rest}
    >
      <span />
    </span>
  );
}

export const TextField = forwardRef(function TextField({ multiline, error, className, rows = 2, ...rest }, ref) {
  const errId = useId();
  const field = multiline ? (
    <textarea ref={ref} className={cx('lg-textarea', className)} rows={rows} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? errId : undefined} {...rest} />
  ) : (
    <input ref={ref} className={cx('lg-input', className)} type="text" aria-invalid={error ? 'true' : undefined} aria-describedby={error ? errId : undefined} {...rest} />
  );
  if (!error) return field;
  return (
    <>
      {field}
      <span id={errId} className="footnote" style={{ color: 'var(--danger)' }}>
        {error}
      </span>
    </>
  );
});

function ChipBase({ pressed, defaultPressed, onPressedChange, className, children, onClick, ...rest }) {
  const [own, setOwn] = useState(!!defaultPressed);
  const on = pressed ?? own;
  return (
    <button
      className={cx('lg-chip', className)}
      type="button"
      aria-pressed={String(on)}
      onClick={(e) => {
        if (pressed == null) setOwn(!on);
        if (onPressedChange) onPressedChange(!on);
        if (onClick) onClick(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

function ChipGroup({ className, children, ...rest }) {
  return (
    <div className={cx('lg-chips', className)} {...rest}>
      {Children.toArray(children)}
    </div>
  );
}

export const Chip = Object.assign(ChipBase, { Group: ChipGroup });
