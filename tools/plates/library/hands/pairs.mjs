// LIB-7 hand pairs (hands/DESIGN.md §1): one module per key, `hands/hand-<key>.mjs`, found by filename, so a new key
// (LIB-12's too) is a new file and no shared registry is edited. This loader builds the id index, `pairSpec(id)`,
// `renderPair(id, opts)` (the key's own `render`, or golden-B `renderHandPair` unchanged, then the extras) and
// `inputsFor(id)` (LIB-2's per-output inputs). Golden-B engine files and LIB-6's renderer are imported, never edited.
import { readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderHandPair } from '../../layers/engine/hand.mjs';
import { mergePose } from '../render/closeup/common.mjs';

export const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(HERE, '../../../..');
const rel = p => relative(ROOT, p).split('\\').join('/');
export const KEY_FILE = /^hand-([a-z0-9-]+)\.mjs$/;
// Grip orientation -> camera label (golden-B engine/hand.mjs:8-9: the handle is seen end-on, so a vertical handle is
// "seen from above" and a horizontal bar "seen from the side"). 'under' draws the palm up (mirror), 'over' down.
// 'unstated': no claim names the palm direction, so the label names the view only (D-LIB7-4).
export const ORIENTATIONS = { under: 'side', over: 'side', neutral: 'above', unstated: 'side' };
// Archetype defaults a card delegates to (GA 3.1, 3.1.1). Cited as `ga:<name>`; flagged on the sheet, never a claim.
export const CONVENTIONS = {
  'ga:push-heel': 'GA 3.1 push: heel of the palm, low, over the forearm; extension 0 to 15',
  'ga:pull-base': 'GA 3.1 pull: base of the fingers and top edge of the palm; extension 0 to 25',
  'ga:curl-mid': 'GA 3.1 curl: across the middle of the palm; extension -10 to +10 (shared/curl.json gap 1)',
  'ga:rope-fingers': 'GA 3.1.1 rope: load in the fingers, loadAxis across, lever check off (shared/rope-rule.json gap 1)',
};
export const THUMB_SIDE = 'Seen from the thumb side';

/** Every key module in `dir`, sorted by filename. The file name must match the module's KEY. */
export async function loadKeyModules(dir = HERE) {
  const out = [];
  for (const file of readdirSync(dir).filter(f => KEY_FILE.test(f)).sort()) {
    const m = await import(pathToFileURL(join(dir, file)).href);
    if (m.KEY !== file.match(KEY_FILE)[1]) throw new Error(`hand pairs: ${file} exports KEY ${m.KEY}`);
    out.push({ ...m, FILE: rel(join(dir, file)) });
  }
  return out;
}

/** id -> drawing, id -> gap. Throws when an id is drawn twice, or drawn by one key and a gap of another. */
export function indexOf(mods) {
  const drawn = new Map(), gaps = new Map(), seen = new Map();
  const claim = (id, key) => { if (seen.has(id)) throw new Error(`hand pairs: ${id} is in ${seen.get(id)} and ${key}`); seen.set(id, key); };
  for (const m of mods) {
    for (const [id, cfg] of Object.entries(m.IDS ?? {})) {
      claim(id, m.KEY);
      if (!m.VARIANTS?.[cfg.variant]) throw new Error(`hand pairs: ${id}: ${m.KEY} has no variant ${cfg.variant}`);
      if (!(cfg.orientation in ORIENTATIONS)) throw new Error(`hand pairs: ${id}: unknown orientation ${cfg.orientation}`);
      for (const k of cfg.faults) if (!m.VARIANTS[cfg.variant].faults[k]) throw new Error(`hand pairs: ${id}: no fault ${k}`);
      drawn.set(id, { mod: m, cfg });
    }
    for (const [id, reason] of Object.entries(m.GAPS ?? {})) { claim(id, m.KEY); gaps.set(id, { mod: m, reason }); }
  }
  return { drawn, gaps };
}

export const MODULES = await loadKeyModules();
export const INDEX = indexOf(MODULES);

/** The pair record of one drawn id: camera, poses, faults, notes, alt and extras. */
export function pairSpec(id, index = INDEX) {
  const e = index.drawn.get(id);
  if (!e) throw new Error(index.gaps.has(id) ? `hand pairs: ${id} is a gap: ${index.gaps.get(id).reason}` : `hand pairs: ${id} has no pair`);
  const { mod, cfg } = e, V = mod.VARIANTS[cfg.variant], H = V.handle ?? mod.HANDLE;
  if (!(H.diameterMm > 0)) throw new Error(`hand pairs: ${mod.KEY}/${cfg.variant}: no explicit handle diameter`);
  const handle = { profile: H.profile, diameterMm: H.diameterMm, ...(H.headMm ? { headMm: H.headMm } : {}) };
  const right = mergePose(V.right, { handle, ...(cfg.orientation === 'under' ? { mirror: true } : {}) });
  return {
    id, key: mod.KEY, variant: cfg.variant, pair: `${mod.KEY}/${cfg.variant}`, mod, orientation: cfg.orientation,
    camera: ORIENTATIONS[cfg.orientation], loadAxis: V.loadAxis, wristRange: V.wristRange, contact: V.contact, handle: H,
    right, rightNote: V.rightNote, altRight: V.alt,
    wrong: cfg.faults.map(k => ({ key: k, ...V.faults[k] })),
    extras: { ...(H.ringMm ? { ringMm: H.ringMm } : {}), ...(cfg.orientation === 'unstated' ? { thumbSide: true } : {}) },
  };
}

// Extras, applied to the rendered pair. Each one checks its anchor and throws when it isn't there exactly once.
function once(svg, find, repl, what) {
  const n = svg.split(find).length - 1;
  if (n !== 1) throw new Error(`hand pairs: ${what}: anchor found ${n} times`);
  return svg.replace(find, repl);
}
const f2 = v => +v.toFixed(2);
function addRings(svg, ringMm, k) {
  const rings = [];
  for (const role of ['right', 'wrong']) {
    const g = `<g class="h-panel ${role}">`, i = svg.indexOf(g);
    const c = svg.slice(i).match(/<circle class="h-eq" cx="([\d.-]+)" cy="([\d.-]+)" r="([\d.]+)"\/>/);
    if (i < 0 || !c) throw new Error(`hand pairs: ring: no ${role} handle`);
    const ring = { cx: +c[1], cy: +c[2], r: f2(ringMm / 2 * k), handleR: +c[3] };
    rings.push(ring);
    // behind everything in the panel (the knob sits past the little finger, away from the camera)
    svg = once(svg, g, `${g}<circle class="h-eq-thin" cx="${ring.cx}" cy="${ring.cy}" r="${ring.r}"/>`, `ring ${role}`);
  }
  return { svg, rings };
}
/** Screen geometry measured on the rendered SVG: handle centre and wrist of each half. */
export function measured(svg) {
  const out = {};
  for (const role of ['right', 'wrong']) {
    const part = svg.slice(svg.indexOf(`<g class="h-panel ${role}">`));
    const h = part.match(/<circle class="h-eq" cx="([\d.-]+)" cy="([\d.-]+)"/), w = part.match(/<circle class="h-joint wrist" cx="([\d.-]+)" cy="([\d.-]+)"/);
    out[role] = { handle: h && [+h[1], +h[2]], wrist: w && [+w[1], +w[2]] };
  }
  return out;
}

/** One rendered pair. opts: { uid, fault (key; default the first), panelHeight, index }. */
export function renderPair(id, opts = {}) {
  const s = pairSpec(id, opts.index);
  const F = opts.fault ? s.wrong.find(w => w.key === opts.fault) : s.wrong[0];
  if (!F) throw new Error(`hand pairs: ${id}: no fault ${opts.fault}`);
  const render = s.mod.render ?? renderHandPair;
  const out = render({ uid: opts.uid ?? `hp-${id.replace(/_/g, '-')}-${F.key}`, camera: s.camera, loadAxis: s.loadAxis, markers: F.markers,
    right: s.right, wrong: mergePose(s.right, F.pose), rightNote: s.rightNote, wrongNote: F.label,
    alt: { right: s.altRight, wrong: F.alt }, panelHeight: opts.panelHeight });
  let svg = out.svg, rings = null;
  if (s.extras.thumbSide) {
    svg = once(svg, '>SEEN FROM THE SIDE<', `>${THUMB_SIDE.toUpperCase()}<`, 'thumb-side label');
    svg = once(svg, 'aria-label="Seen from the side. ', `aria-label="${THUMB_SIDE}. `, 'thumb-side aria');
  }
  if (s.extras.ringMm) ({ svg, rings } = addRings(svg, s.extras.ringMm, out.report.scalePxPerMm));
  return { svg, spec: s, fault: F, report: { ...out.report, rings, measured: measured(svg) } };
}

/** The files one id's drawing reads (LIB-2 per-output inputsSha256): a change to another key never marks it stale. */
export function inputsFor(id, index = INDEX) {
  const e = index.drawn.get(id);
  if (!e) throw new Error(`hand pairs: inputsFor: ${id} has no pair`);
  const lib = p => `tools/plates/library/${p}`;
  return [...new Set([lib('hands/pairs.mjs'), lib('hands/zoom.mjs'), e.mod.FILE, ...(e.mod.INPUTS ?? []), ...(e.mod.VIEW_FILES ?? ['tools/plates/layers/engine/hand.mjs']),
    lib('render/closeup/common.mjs')])].sort();
}

