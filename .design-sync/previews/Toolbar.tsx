import { Badge, GlassButton, Icon, SegmentedControl, Stage, StatusDot, Toolbar } from 'liquid-glass-web-react';

const photo =
  'radial-gradient(34% 46% at 38% 40%, hsl(220 70% 78% / .92) 0%, transparent 70%), radial-gradient(52% 60% at 81% 74%, hsl(260 55% 42%) 0%, transparent 72%), radial-gradient(24% 26% at 74% 20%, hsl(60 60% 86% / .55) 0%, transparent 70%), linear-gradient(165deg, hsl(220 35% 26%) 0%, hsl(260 30% 9%) 100%)';
const photo2 =
  'radial-gradient(34% 46% at 58% 40%, hsl(200 70% 78% / .92) 0%, transparent 70%), radial-gradient(52% 60% at 71% 74%, hsl(240 55% 42%) 0%, transparent 72%), radial-gradient(24% 26% at 67% 20%, hsl(40 60% 86% / .55) 0%, transparent 70%), linear-gradient(165deg, hsl(200 35% 26%) 0%, hsl(240 30% 9%) 100%)';

const PlayIcon = () => (
  <Icon fill="currentColor" stroke="none" style={{ width: 12, height: 12 }}>
    <path d="M4.5 2.8v10.4L13 8z" />
  </Icon>
);
const PauseIcon = () => (
  <Icon fill="currentColor" stroke="none" style={{ width: 12, height: 12 }}>
    <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
  </Icon>
);
const NoteIcon = () => (
  <Icon strokeWidth={1.5}>
    <path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 0 0-9 0c0 3.8 4.5 8 4.5 8z" />
    <circle cx="8" cy="6.5" r="1.5" />
  </Icon>
);
const ShareIcon = () => (
  <Icon>
    <path d="M8 2v8M5 4.8 8 2l3 2.8M3.5 8v4.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8" />
  </Icon>
);
const UndoIcon = () => (
  <Icon>
    <path d="M5.5 3.5 2.5 6.5l3 3" />
    <path d="M2.5 6.5h7a4 4 0 0 1 0 8h-2" />
  </Icon>
);
const RedoIcon = () => (
  <Icon>
    <path d="M10.5 3.5l3 3-3 3" />
    <path d="M13.5 6.5h-7a4 4 0 0 0 0 8h2" />
  </Icon>
);
const CompareIcon = () => (
  <Icon strokeWidth={1.5}>
    <rect x="2" y="3" width="12" height="10" rx="2" />
    <path d="M8 3v10" />
  </Icon>
);
const GridIcon = () => (
  <Icon strokeWidth={1.5}>
    <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
    <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
    <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
    <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
  </Icon>
);
const AdjustIcon = () => (
  <Icon strokeWidth={1.5}>
    <path d="M2.5 5h6M11.5 5h2M2.5 11h2M7.5 11h6" />
    <circle cx="10" cy="5" r="1.5" />
    <circle cx="6" cy="11" r="1.5" />
  </Icon>
);
const MoreIcon = () => (
  <Icon fill="currentColor" stroke="none">
    <circle cx="3" cy="8" r="1.4" />
    <circle cx="8" cy="8" r="1.4" />
    <circle cx="13" cy="8" r="1.4" />
  </Icon>
);

export function OnTheStage() {
  return (
    <Stage
      media={photo}
      style={{ height: 240 }}
      top={
        <Badge glass>
          <StatusDot status="accent" />
          Frame 14 · Undecided
        </Badge>
      }
      bottom={
        <Toolbar label="Playback">
          <Toolbar.Group readout media>
            <GlassButton variant="media-solid" iconOnly aria-label="Play" tooltip icon={<PlayIcon />} />
            <Toolbar.Text total="0:47">0:13</Toolbar.Text>
          </Toolbar.Group>
          <GlassButton variant="accent">Review 4 Candidates</GlassButton>
          <Toolbar.Group media>
            <GlassButton variant="plain" iconOnly aria-label="Add Note" tooltip defaultPressed={false} icon={<NoteIcon />} />
            <GlassButton variant="plain" iconOnly aria-label="Share" tooltip icon={<ShareIcon />} />
          </Toolbar.Group>
        </Toolbar>
      }
    />
  );
}

export function ReviewWithScrubber() {
  return (
    <Stage
      media={photo2}
      style={{ height: 150 }}
      bottom={
        <Toolbar label="Compare playback">
          <Toolbar.Group readout media>
            <GlassButton variant="media-solid" iconOnly aria-label="Pause" tooltip icon={<PauseIcon />} />
            <Toolbar.Text>0:01 / 0:05</Toolbar.Text>
            <Toolbar.Scrubber interactive value={22} label="Playback position" valueText="0:01 of 0:05" />
          </Toolbar.Group>
          <Toolbar.Group media>
            <SegmentedControl label="Zoom" items={['Fit', '2×', '4×']} media size="sm" />
          </Toolbar.Group>
        </Toolbar>
      }
    />
  );
}

export function OnCanvas() {
  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Toolbar label="Edit">
        <Toolbar.Group>
          <GlassButton variant="plain" iconOnly aria-label="Undo" tooltip icon={<UndoIcon />} />
          <GlassButton variant="plain" iconOnly aria-label="Redo" tooltip icon={<RedoIcon />} />
        </Toolbar.Group>
        <Toolbar.Group>
          <GlassButton variant="plain" iconOnly aria-label="Compare" defaultPressed icon={<CompareIcon />} />
          <GlassButton variant="plain" iconOnly aria-label="Grid" defaultPressed={false} icon={<GridIcon />} />
          <GlassButton variant="plain" iconOnly aria-label="Adjust" disabled icon={<AdjustIcon />} />
        </Toolbar.Group>
        <Toolbar.Group>
          <GlassButton variant="plain" iconOnly aria-label="Share" icon={<ShareIcon />} />
          <GlassButton variant="plain" iconOnly aria-label="More" icon={<MoreIcon />} />
        </Toolbar.Group>
      </Toolbar>
    </div>
  );
}

export function WithSpacerAndAction() {
  return (
    <div style={{ padding: 24 }}>
      <Toolbar label="Edit" style={{ width: '100%' }}>
        <Toolbar.Group>
          <GlassButton variant="plain" iconOnly aria-label="Undo" tooltip icon={<UndoIcon />} />
          <GlassButton variant="plain" iconOnly aria-label="Redo" tooltip icon={<RedoIcon />} />
        </Toolbar.Group>
        <Toolbar.Spacer />
        <Toolbar.Group>
          <GlassButton variant="plain" iconOnly aria-label="More" icon={<MoreIcon />} />
        </Toolbar.Group>
        <GlassButton variant="accent">Share</GlassButton>
      </Toolbar>
    </div>
  );
}
