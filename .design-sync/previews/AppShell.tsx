import { AppShell, Composer, FloatingNavbar, GlassButton, Icon, SegmentedControl, Stage, TabBar } from 'liquid-glass-web-react';

const photo = 'radial-gradient(34% 46% at 40% 40%, hsl(175 70% 78% / .92) 0%, transparent 70%), linear-gradient(165deg, hsl(175 35% 26%) 0%, hsl(215 30% 9%) 100%)';
const icon = (d: string) => <Icon size="lg"><path d={d} /></Icon>;

export function FluidWorkspace() {
  return (
    <div style={{ height: 720, overflow: 'auto' }}>
      <AppShell
        contained
        navbar={<FloatingNavbar contained brand={<span>Lumen</span>} brandLabel="Lumen home" links={['Studio', 'Library', 'Shows']} />}
        tabbar={<TabBar contained search tabs={[{ label: 'Studio', icon: icon('M3 3h10v10H3z') }, { label: 'Library', icon: icon('M2 5h12v8H2z') }, { label: 'Shows', icon: icon('M8 2.5 14 5.5 8 8.5 2 5.5z') }]} />}
        asideLabel="Contact Sheet"
        aside={<p className="footnote lg-muted">48 frames</p>}
        inspector={<p className="footnote lg-muted">Selection · Frame 14</p>}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <h1 className="title-2" style={{ margin: 0, flex: '1 1 200px' }}>Island Light</h1>
          <SegmentedControl mode="tabs" label="Project area" items={[{ label: 'Picks', value: 'picks' }, { label: 'Sources', value: 'sources', badge: 3, badgeLabel: '3 pending' }]} />
          <GlassButton variant="tinted" aria-label="Export Island Light">Export</GlassButton>
        </div>
        <Stage media={photo} style={{ aspectRatio: '3 / 2' }} />
        <Composer label="Instructions for the assistant" scope="@all" scopeLabel="All frames" flat />
      </AppShell>
    </div>
  );
}
