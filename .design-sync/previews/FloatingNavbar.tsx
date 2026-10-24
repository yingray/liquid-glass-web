import { FloatingNavbar, GlassButton, Icon, Menu, ProgressBar, SegmentedControl, Stage, TabBar } from 'liquid-glass-web-react';

const thumb = (h1: number, h2: number, h3: number, x: number) =>
  `radial-gradient(34% 46% at ${x}% 40%, hsl(${h1} 70% 78% / .92) 0%, transparent 70%), radial-gradient(52% 60% at 80% 74%, hsl(${h2} 55% 42%) 0%, transparent 72%), radial-gradient(24% 26% at 72% 20%, hsl(${h3} 60% 86% / .55) 0%, transparent 70%), linear-gradient(165deg, hsl(${h1} 35% 26%) 0%, hsl(${h2} 30% 9%) 100%)`;

const frames: Array<[number, number, number, number]> = [
  [220, 260, 60, 38], [28, 68, 228, 52], [300, 340, 140, 44], [175, 215, 15, 40],
  [250, 290, 90, 60], [12, 52, 212, 30], [140, 180, 340, 46], [330, 10, 170, 36],
];

const frame = { position: 'relative', overflow: 'hidden', isolation: 'isolate', borderRadius: 20, background: 'var(--canvas)', boxShadow: 'inset 0 0 0 1px var(--line)' } as const;

function Cards({ top, cols = 4, count = 4, inset = 20 }: { top: number; cols?: number; count?: number; inset?: number }) {
  return (
    <div style={{ position: 'absolute', left: inset, right: inset, top, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14 }}>
      {frames.slice(0, count).map(([a, b, c, x], i) => (
        <div key={i} style={{ display: 'grid', gap: 4, fontSize: 13, lineHeight: '18px' }}>
          <div style={{ aspectRatio: '16 / 10', borderRadius: 18, backgroundImage: thumb(a, b, c, x) }} />
          <b style={{ fontWeight: 600 }}>Frame {11 + i}</b>
          <span style={{ color: 'var(--ink-muted)', fontSize: 12 }}>Forest · 2026.03</span>
        </div>
      ))}
    </div>
  );
}

const brand = (
  <>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12.6" cy="7.4" r="2.6" fill="currentColor" />
    </svg>
    <span>Lumen</span>
  </>
);

const searchIcon = <Icon><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" /></Icon>;
const queueIcon = <Icon strokeWidth={1.5}><path d="M3 4h10M3 8h10M3 12h6" /></Icon>;

const context = (
  <>
    <span className="lg-navbar__crumb lg-nav-optional"><a href="#">Shows</a><span className="lg-navbar__crumb-sep">/</span></span>
    <b style={{ fontWeight: 600 }}>Island Light</b>
    <ProgressBar className="lg-nav-optional" size="md" neutral value={38} label="Island Light selection" style={{ width: 52 }} />
    <span className="mono lg-muted lg-nav-optional">18 / 48 selected</span>
  </>
);

const tools = (
  <>
    <GlassButton variant="plain" iconOnly className="lg-nav-desktop" aria-label="Search" title="Search (⌘F)" icon={searchIcon} />
    <GlassButton variant="plain" className="lg-nav-desktop" aria-label="Queue, 2 items" title="Queue" style={{ ['--lg-px' as string]: '8px' }} icon={queueIcon}>
      <span className="lg-badge lg-badge--sm lg-badge--count">2</span>
    </GlassButton>
  </>
);

const menu = (
  <>
    <Menu.Label>Island Light · 18 / 48 Selected</Menu.Label>
    <Menu.Item href="#" icon={<Icon strokeWidth={1.5}><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3.2l2 1.3" /></Icon>}>Activity</Menu.Item>
    <Menu.Item href="#" icon={<Icon strokeWidth={1.5}><circle cx="8" cy="8" r="2" /><path d="M8 1.8v1.7M8 12.5v1.7M1.8 8h1.7M12.5 8h1.7M3.6 3.6l1.2 1.2M11.2 11.2l1.2 1.2M3.6 12.4l1.2-1.2M11.2 4.8l1.2-1.2" /></Icon>}>Settings</Menu.Item>
  </>
);

function Navbar({ scrolled }: { scrolled?: boolean }) {
  return (
    <FloatingNavbar
      contained
      scrolled={scrolled}
      brand={brand}
      brandLabel="Lumen home"
      links={['Studio', 'Library', 'Shows']}
      context={context}
      tabs={<SegmentedControl mode="tabs" label="Project area" items={['Picks', { label: 'Sources', badge: 3, badgeWarn: true }]} />}
      action={<GlassButton variant="accent">Export</GlassButton>}
      tools={tools}
      menu={menu}
    />
  );
}

const tabIcons = [
  <Icon size="lg" strokeWidth={1.5}><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="9" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="2.5" y="9" width="4.5" height="4.5" rx="1" /><rect x="9" y="9" width="4.5" height="4.5" rx="1" /></Icon>,
  <Icon size="lg" strokeWidth={1.5}><path d="M2 5a1 1 0 0 1 1-1h3l1.5 1.5H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" /></Icon>,
  <Icon size="lg" strokeWidth={1.5}><path d="M8 2.5 14 5.5 8 8.5 2 5.5z" /><path d="M2 8.5l6 3 6-3" /></Icon>,
];
const tabs = ['Studio', 'Library', 'Shows'].map((label, i) => ({ label, icon: tabIcons[i] }));

/** 1180px layout zoomed to fit: every island, including the optional context, is visible. */
export function Desktop() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ ...frame, width: 1180, height: 210, zoom: 0.68 }}>
        <Navbar />
        <Cards top={72} />
      </div>
    </div>
  );
}

/** 980px layout, scrolled: optional context hides below 1100px; content passes under the islands and the scroll edge. */
export function Scrolled() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ ...frame, width: 980, height: 300, zoom: 0.8 }}>
        <Cards top={24} count={8} />
        <Navbar scrolled />
      </div>
    </div>
  );
}

/** 390px phone: only brand and menu stay at the top; destinations move to the TabBar. */
export function Mobile() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ ...frame, width: 390, maxWidth: '100%', height: 560, borderRadius: 40 }}>
        <Stage media={thumb(300, 340, 140, 44)} noScrim data-surface-tone="dark" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
        <Navbar />
        <TabBar contained tabs={tabs} search />
      </div>
    </div>
  );
}
