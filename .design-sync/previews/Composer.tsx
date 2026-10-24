import { Composer } from 'liquid-glass-web-react';

const wrap = { padding: 24, display: 'grid', gap: 16 } as const;

export function Empty() {
  return (
    <div style={wrap}>
      <Composer label="Instructions for the assistant" scope="@all" placeholder="Tell the assistant how to adjust these photos…" />
    </div>
  );
}

export function WithText() {
  return (
    <div style={wrap}>
      <Composer
        label="Instructions for the assistant"
        scope="@12–18"
        placeholder="Tell the assistant how to adjust these photos…"
        defaultValue="Match the white balance of Frames 12–18 to dusk"
      />
    </div>
  );
}

export function FlatNoScope() {
  return (
    <div style={wrap}>
      <Composer label="Ask the assistant" flat hint={null} sendLabel="Ask" placeholder="Ask about this show…" defaultValue="Which frames still need a decision?" />
    </div>
  );
}
