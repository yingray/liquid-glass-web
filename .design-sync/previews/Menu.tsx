import { GlassButton, Icon, Menu } from 'liquid-glass-web-react';

const thumb = (h1: number, h2: number, h3: number, x: number) =>
  `radial-gradient(34% 46% at ${x}% 40%, hsl(${h1} 70% 78% / .92) 0%, transparent 70%), radial-gradient(52% 60% at 80% 74%, hsl(${h2} 55% 42%) 0%, transparent 72%), radial-gradient(24% 26% at 72% 20%, hsl(${h3} 60% 86% / .55) 0%, transparent 70%), linear-gradient(165deg, hsl(${h1} 35% 26%) 0%, hsl(${h2} 30% 9%) 100%)`;

const viewIcon = <Icon><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" /></Icon>;
const replaceIcon = <Icon strokeWidth={1.5}><path d="M3 5.5h9l-2.5-2.5M13 10.5H4l2.5 2.5" /></Icon>;
const trashIcon = <Icon strokeWidth={1.5}><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" /></Icon>;
const moreIcon = (
  <Icon>
    <circle cx="3" cy="8" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="13" cy="8" r="1.4" fill="currentColor" stroke="none" />
  </Icon>
);

/** The small "More" menu on a card: common actions with icons, the destructive one after a separator. */
export function CardMenu() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ position: 'relative', width: 300, height: 290 }}>
        <div className="lg-frame" data-tone="dark" style={{ position: 'absolute', inset: '0 0 auto 0', aspectRatio: '16 / 10', backgroundImage: thumb(175, 215, 15, 40) }}>
          <GlassButton variant="glass-media" chip size="sm" iconOnly aria-label="More actions for Frame 14" aria-controls="card-menu" aria-expanded="true" icon={moreIcon} style={{ position: 'absolute', right: 8, top: 8 }} />
        </div>
        <Menu id="card-menu" label="Frame 14" size="sm" defaultOpen style={{ position: 'absolute', right: -8, top: 48 }}>
          <Menu.Item icon={viewIcon}>View Larger</Menu.Item>
          <Menu.Item icon={replaceIcon}>Replace Image</Menu.Item>
          <Menu.Separator />
          <Menu.Item icon={trashIcon} danger>Remove from Show</Menu.Item>
        </Menu>
      </div>
    </div>
  );
}

/** "Remove from Show" confirms in place: the menu turns into a dialog that grows out of the More button. */
export function InlineConfirm() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ position: 'relative', width: 300, height: 396 }}>
        <div className="lg-frame" data-tone="dark" style={{ position: 'absolute', inset: '0 0 auto 0', aspectRatio: '16 / 10', backgroundImage: thumb(175, 215, 15, 40) }}>
          <GlassButton variant="glass-media" chip size="sm" iconOnly aria-label="More actions for Frame 14" aria-controls="confirm-menu" aria-expanded="true" icon={moreIcon} style={{ position: 'absolute', right: 8, top: 8 }} />
        </div>
        <div className="lg-frame" style={{ position: 'absolute', left: 0, top: 200, width: 300, aspectRatio: '16 / 10', backgroundImage: thumb(250, 290, 90, 60) }} />
        <Menu id="confirm-menu" role="dialog" aria-labelledby="confirm-menu-title" defaultOpen style={{ position: 'absolute', right: -8, top: 48 }}>
          <Menu.Confirm titleId="confirm-menu-title" title="Remove Frame 14 from the show?" confirmLabel="Remove">
            It’s in the layout of 2 walls. If you remove it, the assistant will rearrange both walls with Frame 15.
          </Menu.Confirm>
        </Menu>
      </div>
    </div>
  );
}

/** Queue status popover from the navbar tools island: a group label, then one status row per job. */
export function QueueStatus() {
  return (
    <div style={{ padding: 16 }}>
      <Menu id="queue-menu" label="Queue" defaultOpen role="group" style={{ position: 'relative', width: 300 }}>
        <Menu.Label>Running and Queued</Menu.Label>
        <Menu.Status status="accent" pulse title="Frame 15 · Color Correction" detail="2 / 5 · about 40 s" />
        <Menu.Status title="Frame 22 · Add Angle" detail="Queued" />
      </Menu>
    </div>
  );
}

/** The navbar menu: secondary destinations only, each with an icon. */
export function NavbarMenu() {
  return (
    <div style={{ padding: 16 }}>
      <Menu id="nav-menu" label="Menu" defaultOpen style={{ position: 'relative', width: 260 }}>
        <Menu.Label>Island Light · 18 / 48 Selected</Menu.Label>
        <Menu.Item href="#" icon={<Icon strokeWidth={1.5}><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3.2l2 1.3" /></Icon>}>Activity</Menu.Item>
        <Menu.Item href="#" icon={<Icon strokeWidth={1.5}><circle cx="8" cy="8" r="2" /><path d="M8 1.8v1.7M8 12.5v1.7M1.8 8h1.7M12.5 8h1.7M3.6 3.6l1.2 1.2M11.2 11.2l1.2 1.2M3.6 12.4l1.2-1.2M11.2 4.8l1.2-1.2" /></Icon>}>Settings</Menu.Item>
      </Menu>
    </div>
  );
}
