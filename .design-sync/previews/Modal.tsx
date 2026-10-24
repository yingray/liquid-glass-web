import { Chip, GlassButton, Modal, SegmentedControl, TextField } from 'liquid-glass-web-react';

const thumb = (h1: number, h2: number, h3: number, x: number) =>
  `radial-gradient(34% 46% at ${x}% 40%, hsl(${h1} 70% 78% / .92) 0%, transparent 70%), radial-gradient(52% 60% at 80% 74%, hsl(${h2} 55% 42%) 0%, transparent 72%), radial-gradient(24% 26% at 72% 20%, hsl(${h3} 60% 86% / .55) 0%, transparent 70%), linear-gradient(165deg, hsl(${h1} 35% 26%) 0%, hsl(${h2} 30% 9%) 100%)`;

const under: Array<[number, number, number, number]> = [
  [220, 260, 60, 38], [28, 68, 228, 52], [300, 340, 140, 44], [175, 215, 15, 40],
  [250, 290, 90, 60], [12, 52, 212, 30], [140, 180, 340, 46], [330, 10, 170, 36],
];

const picks: Array<[string, string, string, boolean]> = [
  ['Harbor · Dawn', 'Library', thumb(28, 68, 228, 52), false],
  ['Harbor · Backlit', 'Test v2', thumb(200, 240, 40, 44), true],
  ['Harbor · Rain', 'Test v3', thumb(210, 250, 180, 36), false],
  ['Pier Lights', 'Library', thumb(40, 280, 60, 60), false],
];

const frame = { position: 'relative', overflow: 'hidden', isolation: 'isolate', borderRadius: 20, background: 'var(--canvas)', boxShadow: 'inset 0 0 0 1px var(--line)' } as const;

function Under({ phone }: { phone?: boolean }) {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, padding: phone ? '70px 16px' : '60px 24px', display: 'grid', gridTemplateColumns: phone ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 14, alignContent: 'start' }}>
        {under.map(([a, b, c, x], i) => (
          <span key={i} style={{ aspectRatio: '16 / 10', borderRadius: 18, backgroundImage: thumb(a, b, c, x) }} />
        ))}
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--scrim)' }} />
    </>
  );
}

function AngleBody() {
  return (
    <>
      <TextField placeholder="Name the angle, e.g. low from the water" aria-label="Angle name" />
      <Chip.Group style={{ margin: '10px 0 18px' }}>
        <Chip>Back</Chip>
        <Chip>Low</Chip>
        <Chip defaultPressed>Backlit</Chip>
        <Chip>Wide</Chip>
      </Chip.Group>
      <SegmentedControl size="lg" mode="tabs" label="Source" items={['Use Existing', 'Ask the Assistant']} />
      <p className="label-sm" style={{ margin: '18px 0 10px', color: 'var(--ink-muted)' }}>From the Library</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '14px 10px' }}>
        {picks.map(([name, src, bg, on]) => (
          <button key={name} type="button" aria-pressed={on} style={{ display: 'grid', gap: 6, padding: 0, border: 0, background: 'transparent', color: 'var(--ink)', textAlign: 'left', font: 'inherit' }}>
            <span style={{ aspectRatio: '16 / 10', borderRadius: 12, backgroundImage: bg, outline: on ? '2px solid var(--lg-ring)' : '1px solid var(--line)', outlineOffset: 2 }} />
            <b style={{ fontSize: 12.5, lineHeight: '16px', fontWeight: 600 }}>{name}</b>
            <span style={{ color: 'var(--ink-muted)', fontSize: 11.5, lineHeight: '14px' }}>{src}</span>
          </button>
        ))}
      </div>
    </>
  );
}

const hint = 'Choosing this locks the angle; later versions will follow it.';

/** Desktop, half height: thick glass inset from the edges, so the grid beneath shows around it. */
export function HalfHeightGlass() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ ...frame, height: 600 }}>
        <Under />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center' }}>
          <Modal isStatic title="Add an Angle to “Harbor”" hint={hint} actions={<GlassButton variant="accent">Use “Harbor · Backlit”</GlassButton>} style={{ width: 'min(var(--sheet-width), calc(100% - 32px))', maxHeight: 560 }}>
            <AngleBody />
          </Modal>
        </div>
      </div>
    </div>
  );
}

/** Mobile 390, expanded to full height: an opaque surface that meets the screen edges. */
export function ExpandedMobile() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ ...frame, width: 390, maxWidth: '100%', height: 620, borderRadius: 40 }}>
        <Under phone />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 48, bottom: 0, display: 'flex' }}>
          <Modal
            isStatic
            expanded
            title="Add an Angle to “Harbor”"
            hint={hint}
            actions={<GlassButton variant="accent">Use “Harbor · Backlit”</GlassButton>}
            style={{ width: '100%', maxHeight: 'none', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
          >
            <AngleBody />
          </Modal>
        </div>
      </div>
    </div>
  );
}

/** Compact (480 wide) for one short question. */
export function Compact() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ ...frame, height: 340 }}>
        <Under />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center' }}>
          <Modal isStatic compact title="Name the New Scene" hint="You can rename it later." actions={<GlassButton variant="accent">Create Scene</GlassButton>} style={{ width: 'min(480px, calc(100% - 32px))' }}>
            <TextField defaultValue="Harbor at Dusk" aria-label="Scene name" />
          </Modal>
        </div>
      </div>
    </div>
  );
}
