import { Badge, GlassButton, LiquidGlassRoot, ListRow } from 'liquid-glass-web-react';

const thumb = (h1: number, h2: number, h3: number, x: number) =>
  `radial-gradient(34% 46% at ${x}% 40%, hsl(${h1} 70% 78% / .92) 0%, transparent 70%), radial-gradient(52% 60% at 80% 74%, hsl(${h2} 55% 42%) 0%, transparent 72%), radial-gradient(24% 26% at 72% 20%, hsl(${h3} 60% 86% / .55) 0%, transparent 70%), linear-gradient(165deg, hsl(${h1} 35% 26%) 0%, hsl(${h2} 30% 9%) 100%)`;

function Sample({ scheme }: { scheme: string }) {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <b className="title-3">Island Light</b>
        <Badge variant="mono">{scheme}</Badge>
      </div>
      <ListRow thumb={thumb(220, 260, 60, 38)} title="Frame 14 · Forest" subtitle="4 versions · Pick #2" badge={<Badge variant="accent" size="sm">Recommended</Badge>} chevron />
      <div style={{ display: 'flex', gap: 8 }}>
        <GlassButton variant="accent">Review 4 Candidates</GlassButton>
        <GlassButton variant="tinted">Skip</GlassButton>
      </div>
    </div>
  );
}

export function DarkTheme() {
  return (
    <LiquidGlassRoot theme="dark" style={{ padding: 20 }}>
      <Sample scheme="dark" />
    </LiquidGlassRoot>
  );
}

export function LightTheme() {
  return (
    <LiquidGlassRoot theme="light" style={{ padding: 20 }}>
      <Sample scheme="light" />
    </LiquidGlassRoot>
  );
}
