import { Callout, GlassButton } from 'liquid-glass-web-react';

export function Suggestion() {
  return (
    <div style={{ padding: 16, maxWidth: 380 }}>
      <Callout size="lg" eyebrow="Assistant’s Suggestion" title="Pick #2">
        Best tonal range, and its color temperature matches Frame 13, so it won’t jump out on the wall.
      </Callout>
    </div>
  );
}

export function SuggestionCompact() {
  return (
    <div style={{ padding: 16, maxWidth: 380 }}>
      <Callout eyebrow="Assistant’s Suggestion">Use #1 for Frame 17. The harbor lights keep their detail.</Callout>
    </div>
  );
}

export function WarnQuestion() {
  return (
    <div style={{ padding: 16, maxWidth: 380 }}>
      <Callout
        variant="warn"
        eyebrow="Frame 9 · Curator Question"
        actions={
          <>
            <GlassButton variant="inverse" size="sm">Crop to Landscape</GlassButton>
            <GlassButton variant="tinted" size="sm">Use Another</GlassButton>
          </>
        }
      >
        Portrait only, but the wall needs landscape. Crop it, or use another?
      </Callout>
    </div>
  );
}
