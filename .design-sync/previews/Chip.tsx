import { Chip } from 'liquid-glass-web-react';

export function Group() {
  return (
    <div style={{ padding: 16 }}>
      <Chip.Group>
        <Chip>Back</Chip>
        <Chip defaultPressed>Backlit</Chip>
        <Chip>Wide</Chip>
      </Chip.Group>
    </div>
  );
}

export function States() {
  return (
    <div style={{ padding: 16, display: 'grid', gap: 12 }}>
      <Chip.Group>
        <Chip>Portrait</Chip>
        <Chip defaultPressed>Landscape</Chip>
      </Chip.Group>
      <Chip.Group>
        <Chip defaultPressed>Back</Chip>
        <Chip defaultPressed>Backlit</Chip>
        <Chip>Wide</Chip>
        <Chip>Close-Up</Chip>
        <Chip>Night</Chip>
      </Chip.Group>
    </div>
  );
}
