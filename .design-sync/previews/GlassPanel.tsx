import { Callout, GlassButton, GlassPanel, ListRow, ProgressBar } from 'liquid-glass-web-react';

const thumb = (h1: number, h2: number, h3: number, x: number) =>
  `radial-gradient(34% 46% at ${x}% 40%, hsl(${h1} 70% 78% / .92) 0%, transparent 70%), radial-gradient(52% 60% at 80% 74%, hsl(${h2} 55% 42%) 0%, transparent 72%), radial-gradient(24% 26% at 72% 20%, hsl(${h3} 60% 86% / .55) 0%, transparent 70%), linear-gradient(165deg, hsl(${h1} 35% 26%) 0%, hsl(${h2} 30% 9%) 100%)`;

const muted = { color: 'var(--ink-muted)' };

export function Inspector() {
  return (
    <div style={{ padding: 16 }}>
      <GlassPanel label="Inspector" style={{ maxWidth: 340 }}>
        <GlassPanel.Group title="Needs Your Decision" count={3}>
          <ListRow thumb={thumb(220, 260, 60, 38)} title="Frame 14 · Forest" subtitle="4 versions · Pick #2" chevron />
          <ListRow thumb={thumb(28, 68, 228, 52)} title="Frame 17 · Harbor" subtitle="3 versions · Pick #1" chevron />
          <Callout
            variant="warn"
            eyebrow="Frame 9 · Curator Question"
            actions={
              <>
                <GlassButton variant="inverse" size="sm">Crop to Landscape</GlassButton>
                <GlassButton variant="tinted" size="sm">Use Frame 10</GlassButton>
              </>
            }
          >
            Frame 9 is portrait only, but the wall needs landscape. Crop it to landscape, or use Frame 10 instead?
          </Callout>
        </GlassPanel.Group>
        <GlassPanel.Section title="In Progress">
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }} className="callout">
              <b>Frame 15 · Color Correction</b>
              <span style={muted}>2 / 5 · about 40 s</span>
            </div>
            <ProgressBar value={44} label="Frame 15 color correction" />
          </div>
        </GlassPanel.Section>
        <GlassPanel.Section title="Activity">
          <div className="callout" style={{ display: 'grid', gap: 8 }}>
            <span><span style={muted}>2 min · </span><b>Assistant</b> made 3 versions of Frame 17.</span>
            <span><span style={muted}>9 min · </span><b>You</b> chose #1 for Frame 12.</span>
          </div>
        </GlassPanel.Section>
      </GlassPanel>
    </div>
  );
}

export function WithFooter() {
  return (
    <div style={{ padding: 16 }}>
      <GlassPanel label="Library" rail style={{ maxWidth: 300 }}>
        <GlassPanel.Section title="Scenes" count={4}>
          <ListRow thumbSize="sm" thumb={thumb(300, 340, 140, 44)} title="After Rain" subtitle="12 photos" />
          <ListRow thumbSize="sm" thumb={thumb(160, 200, 20, 40)} title="Island Light" subtitle="48 photos" current />
          <ListRow thumbSize="sm" thumb={thumb(28, 68, 228, 52)} title="Harbor" subtitle="2 angles missing" />
        </GlassPanel.Section>
        <GlassPanel.Footer>
          <GlassButton variant="accent" block>New Scene</GlassButton>
        </GlassPanel.Footer>
      </GlassPanel>
    </div>
  );
}
