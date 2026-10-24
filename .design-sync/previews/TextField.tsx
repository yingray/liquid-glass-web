import { TextField } from 'liquid-glass-web-react';

const col = { padding: 16, display: 'grid', gap: 12, maxWidth: 360 } as const;

export function Default() {
  return (
    <div style={col}>
      <TextField placeholder="Name the angle" aria-label="Angle name" />
      <TextField defaultValue="Harbor · Backlit" aria-label="Angle name, filled" />
    </div>
  );
}

export function Multiline() {
  return (
    <div style={col}>
      <TextField multiline rows={2} placeholder="What should differ from the locked version?" aria-label="Notes" />
    </div>
  );
}

export function Invalid() {
  return (
    <div style={{ ...col, gap: 6 }}>
      <TextField defaultValue="H" aria-label="Angle name" error="Use at least 2 characters." />
    </div>
  );
}
