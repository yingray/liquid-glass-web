import { Badge, Stage } from 'liquid-glass-web-react';

const photo = (h1: number, h2: number, h3: number, x: number) =>
  `radial-gradient(34% 46% at ${x}% 40%, hsl(${h1} 70% 78% / .92) 0%, transparent 70%), radial-gradient(52% 60% at 80% 74%, hsl(${h2} 55% 42%) 0%, transparent 72%), radial-gradient(24% 26% at 72% 20%, hsl(${h3} 60% 86% / .55) 0%, transparent 70%), linear-gradient(165deg, hsl(${h1} 35% 26%) 0%, hsl(${h2} 30% 9%) 100%)`;

const row = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, padding: 16 } as const;

export function Variants() {
  return (
    <div style={row}>
      <Badge variant="accent">Recommended</Badge>
      <Badge variant="ok">Chosen</Badge>
      <Badge variant="outline-warn">Flagged</Badge>
      <Badge variant="mono">@12–18</Badge>
      <Badge>Draft</Badge>
    </div>
  );
}

export function Counts() {
  return (
    <div style={row}>
      <Badge variant="count">2</Badge>
      <Badge variant="count">14</Badge>
      <Badge variant="count" warn>3</Badge>
      <Badge variant="count" size="sm">5</Badge>
      <Badge variant="count" size="sm" warn>1</Badge>
    </div>
  );
}

export function SmallNextToItems() {
  return (
    <div style={{ ...row, flexDirection: 'column', alignItems: 'flex-start' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '600 13px/18px var(--font-sans)' }}>
        <span className="mono-label">#2</span>
        <Badge variant="accent" size="sm">Recommended</Badge>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '600 13px/18px var(--font-sans)' }}>
        <span className="mono-label">#3</span>
        <Badge variant="outline-warn" size="sm">Flagged</Badge>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '600 13px/18px var(--font-sans)' }}>
        <span>Frame 12 · Island Light</span>
        <Badge variant="ok" size="sm">Chosen</Badge>
      </span>
    </div>
  );
}

export function GlassOnStage() {
  return (
    <Stage media={photo(220, 260, 60, 38)} style={{ height: 260 }} top={<Badge glass>Frame 14 · Undecided</Badge>} />
  );
}

export function PlateOnFrames() {
  return (
    <div data-tone="dark" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 16 }}>
      <div className="lg-frame" style={{ aspectRatio: '16 / 10', backgroundImage: photo(12, 52, 212, 30) }}>
        <Badge plate style={{ position: 'absolute', left: 10, top: 10 }}>#1</Badge>
      </div>
      <div className="lg-frame is-selected" style={{ aspectRatio: '16 / 10', backgroundImage: photo(140, 180, 340, 46) }}>
        <Badge plate style={{ position: 'absolute', left: 10, top: 10 }}>#2</Badge>
        <Badge variant="accent" style={{ position: 'absolute', right: 10, bottom: 10, boxShadow: 'var(--elevation-pin)' }}>Recommended</Badge>
      </div>
    </div>
  );
}
