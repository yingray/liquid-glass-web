import { Badge, ListRow, SelectList } from 'liquid-glass-web-react';

const thumb = (h1: number, h2: number, h3: number, x: number) =>
  `radial-gradient(34% 46% at ${x}% 40%, hsl(${h1} 70% 78% / .92) 0%, transparent 70%), radial-gradient(52% 60% at 80% 74%, hsl(${h2} 55% 42%) 0%, transparent 72%), radial-gradient(24% 26% at 72% 20%, hsl(${h3} 60% 86% / .55) 0%, transparent 70%), linear-gradient(165deg, hsl(${h1} 35% 26%) 0%, hsl(${h2} 30% 9%) 100%)`;

const glass = { padding: 6, borderRadius: 28, display: 'grid', gap: 4, maxWidth: 380 } as const;

export function Versions() {
  return (
    <div style={{ padding: 16 }}>
      <SelectList label="Versions of Frame 14" className="lg-glass lg-glass--flat" style={glass}>
        <ListRow value="v1" thumbSize="md" thumb={thumb(28, 68, 228, 52)} title={<span className="mono-label">#1</span>} subtitle="The sky is blown out; the cloud detail is gone." />
        <ListRow
          thumbSize="md"
          thumb={thumb(300, 340, 140, 44)}
          title={<span className="mono-label">#2</span>}
          badge={<Badge variant="accent" size="sm">Recommended</Badge>}
          subtitle="Best tonal range; matches Frame 13."
          value="v2"
          selected
        />
        <ListRow
          thumbSize="md"
          thumb={thumb(175, 215, 15, 40)}
          title={<span className="mono-label">#3</span>}
          badge={<Badge variant="outline-warn" size="sm">Flagged</Badge>}
          subtitle="Flare at bottom left."
          value="v3"
        />
      </SelectList>
    </div>
  );
}

export function WithChevron() {
  return (
    <div style={{ padding: 16 }}>
      <div className="lg-glass lg-glass--flat" style={glass}>
        <ListRow thumb={thumb(220, 260, 60, 38)} title="Frame 14 · Forest" subtitle="4 versions · Pick #2" chevron />
        <ListRow thumb={thumb(28, 68, 228, 52)} title="Frame 17 · Harbor" subtitle="3 versions · Pick #1" chevron />
      </div>
    </div>
  );
}

export function ThumbSizesAndMeta() {
  return (
    <div style={{ padding: 16 }}>
      <div className="lg-glass lg-glass--flat" style={glass}>
        <ListRow thumbSize="lg" thumb={thumb(160, 200, 20, 40)} title="Island Light" subtitle="48 photos · lg" meta="2 min" />
        <ListRow thumbSize="md" thumb={thumb(300, 340, 140, 44)} title="After Rain" subtitle="12 photos · md" meta="1 h" />
        <ListRow thumbSize="sm" thumb={thumb(28, 68, 228, 52)} title="Harbor" subtitle="2 angles missing · sm" badge={<Badge variant="count" size="sm" warn>2</Badge>} />
      </div>
    </div>
  );
}

export function StaticRows() {
  return (
    <div style={{ padding: 16 }}>
      <div className="lg-glass lg-glass--flat" style={glass}>
        <ListRow isStatic title="Frame 12 · Island Light" badge={<Badge variant="ok" size="sm">Chosen</Badge>} subtitle="You chose #1 · 9 min ago" />
        <ListRow isStatic title="Frame 15 · Color Correction" subtitle="2 / 5 · about 40 s" />
      </div>
    </div>
  );
}
