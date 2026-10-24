import { Badge, GlassButton, Icon, Stage, StatusDot, Toolbar } from 'liquid-glass-web-react';

const photo =
  'radial-gradient(34% 46% at 38% 40%, hsl(220 70% 78% / .92) 0%, transparent 70%), radial-gradient(52% 60% at 81% 74%, hsl(260 55% 42%) 0%, transparent 72%), radial-gradient(24% 26% at 74% 20%, hsl(60 60% 86% / .55) 0%, transparent 70%), linear-gradient(165deg, hsl(220 35% 26%) 0%, hsl(260 30% 9%) 100%)';
const harbor =
  'radial-gradient(34% 46% at 52% 40%, hsl(28 70% 78% / .92) 0%, transparent 70%), radial-gradient(52% 60% at 80% 74%, hsl(68 55% 42%) 0%, transparent 72%), radial-gradient(24% 26% at 72% 20%, hsl(228 60% 86% / .55) 0%, transparent 70%), linear-gradient(165deg, hsl(28 35% 26%) 0%, hsl(68 30% 9%) 100%)';

const PlayIcon = () => (
  <Icon fill="currentColor" stroke="none" style={{ width: 12, height: 12 }}>
    <path d="M4.5 2.8v10.4L13 8z" />
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
const PrevIcon = () => (
  <Icon>
    <path d="M10 3.5 5.5 8l4.5 4.5" />
  </Icon>
);
const NextIcon = () => (
  <Icon>
    <path d="M6 3.5 10.5 8 6 12.5" />
  </Icon>
);

export function WithLabelAndToolbar() {
  return (
    <Stage
      media={photo}
      style={{ height: 260 }}
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
            <GlassButton variant="plain" iconOnly aria-label="Add Note" tooltip icon={<NoteIcon />} />
            <GlassButton variant="plain" iconOnly aria-label="Share" icon={<ShareIcon />} />
          </Toolbar.Group>
        </Toolbar>
      }
    />
  );
}

export function LabelOnly() {
  return (
    <Stage
      media={harbor}
      style={{ height: 180 }}
      top={
        <>
          <Badge glass>
            <StatusDot status="ok" />
            Frame 17 · Harbor · Chosen #1
          </Badge>
        </>
      }
    />
  );
}

export function NoScrim() {
  return (
    <Stage media={photo} noScrim style={{ height: 180, display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
        <GlassButton variant="media" iconOnly aria-label="Previous Frame" icon={<PrevIcon />} />
        <GlassButton variant="media-solid" iconOnly aria-label="Play" tooltip icon={<PlayIcon />} />
        <GlassButton variant="media" iconOnly aria-label="Next Frame" icon={<NextIcon />} />
      </div>
    </Stage>
  );
}
