import { StatusDot } from 'liquid-glass-web-react';

export function Legend() {
  return (
    <div style={{ padding: 16 }}>
      <div className="lg-legend footnote">
        <StatusDot status="ok" label="Chosen" />
        <StatusDot status="accent" label="Needs You" />
        <StatusDot status="neutral" label="Processing" />
        <StatusDot status="warn" label="Has Question" />
      </div>
    </div>
  );
}

export function Sizes() {
  return (
    <div style={{ padding: 16, display: 'grid', gap: 10 }}>
      <span className="footnote"><StatusDot status="accent" label="Needs You · md" /></span>
      <span className="callout"><StatusDot status="accent" size="lg" label="Needs You · lg" /></span>
    </div>
  );
}

export function PulseInRows() {
  const line = { display: 'flex', justifyContent: 'space-between', gap: 12 } as const;
  const muted = { color: 'var(--ink-muted)' };
  return (
    <div style={{ padding: 16, display: 'grid', gap: 10 }} className="callout">
      <div style={line}>
        <StatusDot status="neutral" pulse label="Frame 15 · Color Correction" />
        <span style={muted}>2 / 5 · about 40 s</span>
      </div>
      <div style={line}>
        <StatusDot status="warn" label="Frame 9 · Curator Question" />
        <span style={muted}>9 min</span>
      </div>
      <div style={line}>
        <StatusDot status="ok" label="Frame 12 · Island Light" />
        <span style={muted}>Chose #1</span>
      </div>
    </div>
  );
}
