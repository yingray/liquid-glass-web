import { Badge, ListRow, SelectList } from 'liquid-glass-web-react';

const glass = { padding: 6, borderRadius: 28, display: 'grid', gap: 4, maxWidth: 380 } as const;

export function SingleSelection() {
  return (
    <div style={{ padding: 16 }}>
      <SelectList label="Versions of Frame 14" className="lg-glass lg-glass--flat" style={glass}>
        <ListRow value="v1" title={<span className="mono-label">#1</span>} subtitle="The sky is blown out." />
        <ListRow value="v2" title={<span className="mono-label">#2</span>} badge={<Badge variant="accent" size="sm">Recommended</Badge>} subtitle="Best tonal range." selected />
        <ListRow value="v3" title={<span className="mono-label">#3</span>} subtitle="Flare at bottom left." />
      </SelectList>
    </div>
  );
}

export function MultipleSelection() {
  return (
    <div style={{ padding: 16 }}>
      <SelectList label="Frames for the wall" multiple className="lg-glass lg-glass--flat" style={glass}>
        <ListRow value="f12" title="Frame 12 · Island Light" subtitle="Chosen" selected />
        <ListRow value="f14" title="Frame 14 · Forest" subtitle="Undecided" />
        <ListRow value="f17" title="Frame 17 · Harbor" subtitle="Chosen" selected />
      </SelectList>
    </div>
  );
}
