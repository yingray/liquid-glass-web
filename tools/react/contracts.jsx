// Test app for tools/react_contracts.py: the React adapter for Claude Design (.design-sync/react/src/index.jsx).
// Each block names the audit item it guards. window.T exposes state setters to the test.
import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { LiquidGlassRoot, SegmentedControl, Modal, TextField, ListRow, SelectList, Composer, Menu } from '../../.design-sync/react/src/index.jsx';

window.log = [];
window.T = {};

function App() {
  // UI-41: callbacks and options follow the latest props
  const [ver, setVer] = useState(1);
  const [dismiss, setDismiss] = useState(true);
  const [open, setOpen] = useState(false);
  // UI-42: controlled index; the host may refuse
  const [accept, setAccept] = useState(false);
  const [ctl, setCtl] = useState(0);
  // UI-44: dynamic items
  const [items, setItems] = useState([{ label: 'Single', value: 'single' }, { label: 'Side by Side', value: 'side' }, { label: '格狀', value: 'grid', badge: 3 }]);
  // UI-45: helper + error
  const [err, setErr] = useState('Use at least 2 characters.');
  Object.assign(window.T, { setVer, setDismiss, setOpen, setAccept, setCtl, setItems, setErr });
  return (
    <LiquidGlassRoot theme="dark">
      <SegmentedControl id="s41" label="Callbacks" items={['One', 'Two', 'Three']} onChange={(i) => window.log.push(`v${ver}:${i}`)} />
      <SegmentedControl id="s42" label="Controlled" items={['A', 'B', 'C']} index={ctl} onChange={(i) => { window.log.push(`req:${i}`); if (accept) setCtl(i); }} />
      <SegmentedControl id="s43" label="Values" items={items} onChange={(i, v) => window.log.push(`val:${v}`)} />
      <button id="open" type="button" onClick={() => setOpen(true)}>Open</button>
      <Modal id="m41" open={open} onClose={() => setOpen(false)} dismissOnBackdrop={dismiss} title="Sheet">
        <p>Body</p>
      </Modal>
      <TextField id="tf" aria-label="Angle name" aria-describedby="ext" helper="Shown on the wall label." error={err || undefined} />
      <span id="ext">External hint</span>
      <SelectList id="sl" label="Versions">
        <ListRow title="#1" value="v1" />
        <ListRow title="#2" value="v2" selected />
      </SelectList>
      <ListRow id="lr" title="Frame 14" selected />
      <Composer id="cp" label="Instructions for the assistant" shortcut="k" scope="@all" scopeLabel="All frames" />
      <button id="mt" type="button" aria-controls="mn">More</button>
      <Menu id="mn" label="Frame 14">
        <Menu.Item id="mi" disabled onClick={() => window.log.push('disabled ran')}>Replace Image</Menu.Item>
      </Menu>
    </LiquidGlassRoot>
  );
}

createRoot(document.getElementById('app')).render(<App />);
