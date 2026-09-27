// Write the form-guide test fixtures (docs/GUIDE-UPGRADE-ARCHITECTURE.md 5.0 R1-11) from the approved demo at DEMO_COMMIT.
// The demo is not on main and CI checks out at depth 1, so no test reads it at run time: this script is run by hand.
// Run: git fetch --depth=300 origin claude/marc-form-guide-smoothness-fiuy2y && node scripts/formguide-fixture.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const DEMO_COMMIT = 'f49c6c9dab4771696ee16850aa10a87de413ad17';
const DEMO = 'docs/design/form-guide-demo/';
const OUT = 'tests/formguide/fixtures/';
const show = p => execFileSync('git', ['show', `${DEMO_COMMIT}:${DEMO}${p}`], { encoding: 'utf8', maxBuffer: 64 << 20 });

const MOVES = [
  { id: 'machineChestPress', player: 'anim-machine-chest-press', names: 18,
    poses: () => { const j = JSON.parse(show('anim-machine-chest-press/rig/poses.json')).chestPress; return { keyTable: j.keyTable, smooth: j.smooth, truth: j.truth, maxDrift: j.maxDrift }; } },
  { id: 'dumbbellLateralRaise', player: 'anim-dumbbell-lateral-raise', names: 15,
    poses: () => { const j = JSON.parse(show('rig-final/poses.json')).lateralRaise; return { keyTable: j.keyTable, smooth: j.smooth, truth: j.truth }; } },
  { id: 'latPulldown', player: 'anim-lat-pulldown', names: 26,
    poses: () => { const j = JSON.parse(show('anim-lat-pulldown/poses.json')).latPulldown; return { keyTable: j.keyTable, smoothness: j.smoothness, smoothCheck: j.smoothCheck, truth: j.truth, drift: j.drift }; } },
];

mkdirSync(OUT, { recursive: true });
for (const m of MOVES) {
  const html = show(`${m.player}/index.html`);
  // every `@keyframes <name>-a{<pc>%{<prop>:<value>}...}` block (the -b copy is the same numbers)
  const groups = {}, props = {};
  for (const [, name, body] of html.matchAll(/@keyframes ([a-z0-9-]+)-a\{((?:[0-9.]+%\{[^}]*\})+)\}/g)) {
    const stops = [...body.matchAll(/([0-9.]+)%\{([a-z-]+):([^}]*)\}/g)];
    props[name] = stops[0][2];
    if (stops.some(s => s[2] !== props[name])) throw new Error(`${m.id} ${name}: mixed properties`);
    groups[name] = stops.map(s => [+(+s[1] / 100).toFixed(6), s[3]]);
  }
  const names = Object.keys(groups);
  if (names.length !== m.names) throw new Error(`${m.id}: ${names.length} keyframe names, expected ${m.names}`);
  for (const n of names) if (!/^(cap|rep)\d$/.test(n) && groups[n].length !== 203) throw new Error(`${m.id} ${n}: ${groups[n].length} stops, expected 203`);
  const i = html.indexOf('<svg class="scene"'), j = html.indexOf('</svg>', i);
  if (i < 0 || j < 0) throw new Error(`${m.id}: no stage svg`);
  // the stage ends at the first </svg> after its start: the scene holds no nested <svg>
  const stage = html.slice(i, j + 6);
  if (stage.slice(1).includes('<svg')) throw new Error(`${m.id}: nested svg in the stage`);
  writeFileSync(`${OUT}${m.id}.json`, JSON.stringify({ commit: DEMO_COMMIT, props, groups }) + '\n');
  writeFileSync(`${OUT}${m.id}.stage.html`, stage + '\n');
  if (m.id === 'latPulldown') {   // the Grip close-up inset: a front-view svg in a div over the stage
    const a = html.indexOf('<svg class="inset-fig"'), b = html.indexOf('</svg>', a);
    if (a < 0 || b < 0) throw new Error('latPulldown: no inset svg');
    writeFileSync(`${OUT}${m.id}.inset.html`, html.slice(a, b + 6) + '\n');
  }
  writeFileSync(`${OUT}${m.id}.poses.json`, JSON.stringify({ commit: DEMO_COMMIT, ...m.poses() }, null, 1) + '\n');
  console.log(`${m.id}: ${names.length} keyframe names, stage ${stage.length} chars`);
}
