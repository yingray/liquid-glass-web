import { FloatingNavbar, Icon, Menu, Stage, TabBar } from 'liquid-glass-web-react';

const thumb = (h1: number, h2: number, h3: number, x: number) =>
  `radial-gradient(34% 46% at ${x}% 40%, hsl(${h1} 70% 78% / .92) 0%, transparent 70%), radial-gradient(52% 60% at 80% 74%, hsl(${h2} 55% 42%) 0%, transparent 72%), radial-gradient(24% 26% at 72% 20%, hsl(${h3} 60% 86% / .55) 0%, transparent 70%), linear-gradient(165deg, hsl(${h1} 35% 26%) 0%, hsl(${h2} 30% 9%) 100%)`;

const frames: Array<[number, number, number, number]> = [
  [220, 260, 60, 38], [28, 68, 228, 52], [300, 340, 140, 44], [175, 215, 15, 40],
  [250, 290, 90, 60], [12, 52, 212, 30], [140, 180, 340, 46], [330, 10, 170, 36],
];

const phone = { position: 'relative', overflow: 'hidden', isolation: 'isolate', width: 390, maxWidth: '100%', height: 520, borderRadius: 40, background: 'var(--canvas)', boxShadow: 'inset 0 0 0 1px var(--line)' } as const;

function Cards({ top }: { top: number }) {
  return (
    <div style={{ position: 'absolute', left: 16, right: 16, top, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {frames.map(([a, b, c, x], i) => (
        <div key={i} style={{ display: 'grid', gap: 4, fontSize: 13, lineHeight: '18px' }}>
          <div style={{ aspectRatio: '16 / 10', borderRadius: 18, backgroundImage: thumb(a, b, c, x) }} />
          <b style={{ fontWeight: 600 }}>Frame {11 + i}</b>
          <span style={{ color: 'var(--ink-muted)', fontSize: 12 }}>Forest · 2026.03</span>
        </div>
      ))}
    </div>
  );
}

const tabIcons = [
  <Icon size="lg" strokeWidth={1.5}><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="9" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="2.5" y="9" width="4.5" height="4.5" rx="1" /><rect x="9" y="9" width="4.5" height="4.5" rx="1" /></Icon>,
  <Icon size="lg" strokeWidth={1.5}><path d="M2 5a1 1 0 0 1 1-1h3l1.5 1.5H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" /></Icon>,
  <Icon size="lg" strokeWidth={1.5}><path d="M8 2.5 14 5.5 8 8.5 2 5.5z" /><path d="M2 8.5l6 3 6-3" /></Icon>,
];
const tabs = ['Studio', 'Library', 'Shows'].map((label, i) => ({ label, icon: tabIcons[i] }));

function TopBar({ scrolled }: { scrolled?: boolean }) {
  return (
    <FloatingNavbar
      contained
      scrolled={scrolled}
      brand={<><svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.8" /><circle cx="12.6" cy="7.4" r="2.6" fill="currentColor" /></svg><span>Lumen</span></>}
      brandLabel="Lumen home"
      links={['Studio', 'Library', 'Shows']}
      menu={<Menu.Item href="#" icon={<Icon strokeWidth={1.5}><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3.2l2 1.3" /></Icon>}>Activity</Menu.Item>}
    />
  );
}

/** Top of the page over a photo: all tabs, search as a separate circle at the trailing end. */
export function TopOfPage() {
  return (
    <div style={{ padding: 16 }}>
      <div style={phone}>
        <Stage media={thumb(300, 340, 140, 44)} noScrim data-surface-tone="dark" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
        <TopBar />
        <TabBar contained tabs={tabs} search />
      </div>
    </div>
  );
}

/** Scrolled down: the bar shrinks to the current tab, with scroll edges at the top and bottom. */
export function ScrolledMinimized() {
  return (
    <div style={{ padding: 16 }}>
      <div style={phone}>
        <Cards top={40} />
        <TopBar scrolled />
        <TabBar contained tabs={tabs} search data-minimized="" data-scrolled="" data-scroll-manual="" />
      </div>
    </div>
  );
}

/** Library is current; no search circle because the page has its own search field. */
export function LibraryNoSearch() {
  return (
    <div style={{ padding: 16 }}>
      <div style={phone}>
        <Cards top={40} />
        <TopBar scrolled />
        <TabBar contained tabs={tabs} current={1} data-scrolled="" data-scroll-manual="" />
      </div>
    </div>
  );
}
