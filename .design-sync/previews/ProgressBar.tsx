import { ProgressBar } from 'liquid-glass-web-react';

const line = { display: 'flex', justifyContent: 'space-between', gap: 12 } as const;
const muted = { color: 'var(--ink-muted)' };

export function Accent() {
  return (
    <div style={{ padding: 16, display: 'grid', gap: 8, maxWidth: 360 }}>
      <div style={line} className="callout">
        <b>Frame 15 · Color Correction</b>
        <span style={muted}>3 / 5 · about 25 s</span>
      </div>
      <ProgressBar value={62} label="Frame 15 color correction" />
    </div>
  );
}

export function Sizes() {
  return (
    <div style={{ padding: 16, display: 'grid', gap: 14, maxWidth: 360 }}>
      <div style={{ display: 'grid', gap: 6 }}>
        <span className="footnote" style={muted}>sm · 3px</span>
        <ProgressBar value={62} label="Small progress" />
      </div>
      <div style={{ display: 'grid', gap: 6 }}>
        <span className="footnote" style={muted}>md · 4px</span>
        <ProgressBar value={62} size="md" label="Medium progress" />
      </div>
    </div>
  );
}

export function NeutralInIsland() {
  return (
    <div style={{ padding: 16 }}>
      <div
        className="lg-glass callout"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 999 }}
      >
        <b>Harbor</b>
        <ProgressBar neutral value={40} label="Harbor show progress" style={{ width: 96 }} />
        <span style={muted}>2 / 5</span>
      </div>
    </div>
  );
}
