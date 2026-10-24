import { GlassButton, Icon } from 'liquid-glass-web-react';

const row = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, padding: 16 } as const;
const cap = { color: 'var(--ink-muted)', fontSize: 12 } as const;

const search = (
  <>
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5 14 14" />
  </>
);

export function Sizes() {
  return (
    <div style={row}>
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Icon size={s} label={`Search, ${s}`}>
            {search}
          </Icon>
          <span style={cap}>{s === 'sm' ? 'sm · 13px' : s === 'md' ? 'md · 16px' : 'lg · 20px'}</span>
        </span>
      ))}
    </div>
  );
}

const icons: { label: string; stroke?: number; fill?: boolean; body: JSX.Element }[] = [
  { label: 'Search', body: search },
  { label: 'Close', stroke: 1.8, body: <path d="M4 4l8 8M12 4l-8 8" /> },
  { label: 'Menu', body: <path d="M2.5 5h11M2.5 11h11" /> },
  { label: 'Undo', body: <><path d="M5.5 3.5 2.5 6.5l3 3" /><path d="M2.5 6.5h7a4 4 0 0 1 0 8h-2" /></> },
  { label: 'Share', body: <path d="M8 2v8M5 4.8 8 2l3 2.8M3.5 8v4.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8" /> },
  { label: 'Add Note', body: <><path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 0 0-9 0c0 3.8 4.5 8 4.5 8z" /><circle cx="8" cy="6.5" r="1.5" /></> },
  { label: 'Grid', body: <><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="9" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="2.5" y="9" width="4.5" height="4.5" rx="1" /><rect x="9" y="9" width="4.5" height="4.5" rx="1" /></> },
  { label: 'More', fill: true, body: <><circle cx="3" cy="8" r="1.4" /><circle cx="8" cy="8" r="1.4" /><circle cx="13" cy="8" r="1.4" /></> },
];

export function InButtons() {
  return (
    <div style={{ ...row, gap: 8 }}>
      {icons.map((i) => (
        <GlassButton
          key={i.label}
          variant="tinted"
          iconOnly
          aria-label={i.label}
          title={i.label}
          icon={
            <Icon strokeWidth={i.stroke} {...(i.fill ? { fill: 'currentColor', stroke: 'none' } : {})}>
              {i.body}
            </Icon>
          }
        />
      ))}
    </div>
  );
}

export function NextToText() {
  return (
    <div style={{ ...row, gap: 12 }}>
      <GlassButton variant="accent" icon={<Icon>{icons[4].body}</Icon>}>Share Show</GlassButton>
      <GlassButton variant="tinted" size="sm" icon={<Icon size="sm">{icons[3].body}</Icon>}>Undo</GlassButton>
      <GlassButton variant="plain" icon={<Icon>{search}</Icon>}>Search Frames</GlassButton>
    </div>
  );
}
