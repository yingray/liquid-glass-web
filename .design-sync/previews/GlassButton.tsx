import { GlassButton, Icon, Stage } from 'liquid-glass-web-react';

const photo =
  'radial-gradient(34% 46% at 38% 40%, hsl(220 70% 78% / .92) 0%, transparent 70%), radial-gradient(52% 60% at 81% 74%, hsl(260 55% 42%) 0%, transparent 72%), radial-gradient(24% 26% at 74% 20%, hsl(60 60% 86% / .55) 0%, transparent 70%), linear-gradient(165deg, hsl(220 35% 26%) 0%, hsl(260 30% 9%) 100%)';

const row = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, padding: 16 } as const;

const PinIcon = () => (
  <Icon>
    <path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 0 0-9 0c0 3.8 4.5 8 4.5 8z" />
    <circle cx="8" cy="6.5" r="1.5" />
  </Icon>
);
const CloseIcon = () => (
  <Icon strokeWidth={1.8}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </Icon>
);
const PlayIcon = () => (
  <Icon fill="currentColor" stroke="none">
    <path d="M5 3.2v9.6L13 8z" />
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
const MoreIcon = () => (
  <Icon fill="currentColor" stroke="none">
    <circle cx="3.5" cy="8" r="1.3" />
    <circle cx="8" cy="8" r="1.3" />
    <circle cx="12.5" cy="8" r="1.3" />
  </Icon>
);

export function Styles() {
  return (
    <div style={row}>
      <GlassButton variant="accent">Export</GlassButton>
      <GlassButton variant="inverse">Split in Two</GlassButton>
      <GlassButton variant="tinted">Cancel</GlassButton>
      <GlassButton variant="plain">Edit</GlassButton>
      <GlassButton variant="outline" icon={<PinIcon />} defaultPressed={false}>
        Add Note
      </GlassButton>
      <GlassButton variant="danger">Remove</GlassButton>
    </div>
  );
}

export function Sizes() {
  return (
    <div style={row}>
      <GlassButton variant="tinted" size="xs">Extra Small</GlassButton>
      <GlassButton variant="tinted" size="sm">Small</GlassButton>
      <GlassButton variant="tinted">Medium</GlassButton>
      <GlassButton variant="accent" size="lg">Use “Harbor · Backlit”</GlassButton>
    </div>
  );
}

export function IconsAndToggles() {
  return (
    <div style={row}>
      <GlassButton variant="tinted" size="sm" iconOnly aria-label="Close" icon={<CloseIcon />} />
      <GlassButton variant="outline" size="sm" icon={<PinIcon />} defaultPressed={false}>
        Add Note
      </GlassButton>
      <GlassButton variant="outline" size="sm" icon={<PinIcon />} defaultPressed>
        Add Note
      </GlassButton>
      <GlassButton variant="plain" iconOnly aria-label="More" icon={<MoreIcon />} />
    </div>
  );
}

export function DisabledAndArmed() {
  return (
    <div style={row}>
      <GlassButton variant="accent" disabled>
        Export
      </GlassButton>
      <GlassButton variant="tinted" disabled>
        Redo All
      </GlassButton>
      <GlassButton variant="danger">Remove from Show</GlassButton>
      <GlassButton variant="danger" armed>
        Remove from Show
      </GlassButton>
    </div>
  );
}

export function GlassOverContent() {
  return (
    <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', backgroundImage: photo, backgroundSize: 'cover', height: 140 }}>
      <div style={{ ...row, height: '100%', justifyContent: 'center' }}>
        <GlassButton variant="glass" size="nav" thick>
          Add Angle
        </GlassButton>
        <GlassButton variant="glass" size="nav" thick iconOnly aria-label="More" icon={<MoreIcon />} />
      </div>
    </div>
  );
}

export function OnTheStage() {
  return (
    <Stage media={photo} noScrim style={{ height: 150, display: 'grid', placeItems: 'center' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
        <GlassButton variant="media" iconOnly aria-label="Previous Frame" icon={<PrevIcon />} />
        <GlassButton variant="media-solid" iconOnly aria-label="Play" tooltip icon={<PlayIcon />} />
        <GlassButton variant="media" iconOnly aria-label="Next Frame" icon={<NextIcon />} />
        <GlassButton variant="glass-media" size="sm">
          Add Angle
        </GlassButton>
      </div>
    </Stage>
  );
}
