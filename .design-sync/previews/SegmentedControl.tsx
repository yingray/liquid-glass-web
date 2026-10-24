import { SegmentedControl, Stage } from 'liquid-glass-web-react';

const photo =
  'radial-gradient(34% 46% at 36% 40%, hsl(330 70% 78% / .92) 0%, transparent 70%), radial-gradient(52% 60% at 82% 74%, hsl(10 55% 42%) 0%, transparent 72%), radial-gradient(24% 26% at 74% 20%, hsl(170 60% 86% / .55) 0%, transparent 70%), linear-gradient(165deg, hsl(330 35% 26%) 0%, hsl(10 30% 9%) 100%)';

const col = { display: 'grid', gap: 14, justifyItems: 'start', padding: 16 } as const;

export function Sizes() {
  return (
    <div style={col}>
      <SegmentedControl size="sm" label="Zoom" items={['Fit', '2×', '4×']} />
      <SegmentedControl label="Compare mode" items={['Single', 'Side by Side', 'Grid', 'Swipe']} defaultIndex={2} />
      <SegmentedControl size="lg" mode="tabs" label="Source" items={['Use Existing', 'Ask the Assistant']} />
    </div>
  );
}

export function BadgesAndDisabled() {
  return (
    <div style={col}>
      <SegmentedControl mode="tabs" label="Project area" items={['Picks', { label: 'Sources', badge: 3, badgeWarn: true }]} />
      <SegmentedControl label="Compare mode" items={['Single', 'Side by Side', 'Grid', { label: 'Swipe', disabled: true }]} />
      <SegmentedControl label="Quality" items={['Standard', 'High']} disabled />
    </div>
  );
}

export function BlockOnMobile() {
  return (
    <div style={{ ...col, justifyItems: 'stretch', maxWidth: 358 }}>
      <SegmentedControl block label="Filter" items={['All', 'Undecided', 'Chosen']} defaultIndex={1} />
    </div>
  );
}

export function NavigationLinks() {
  return (
    <div style={col}>
      <SegmentedControl mode="links" label="App" items={[{ label: 'Studio', href: '#' }, { label: 'Library', href: '#' }, { label: 'Shows', href: '#' }]} />
    </div>
  );
}

export function OnTheStage() {
  return (
    <Stage media={photo} noScrim style={{ height: 150, display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'relative' }}>
        <SegmentedControl media label="Compare mode (stage)" items={['Single', 'Side by Side', 'Grid', 'Swipe']} defaultIndex={2} />
      </div>
    </Stage>
  );
}
