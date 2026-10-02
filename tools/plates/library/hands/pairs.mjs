// LIB-7 hand pairs (hands/DESIGN.md §1): one module per key, `hands/hand-<key>.mjs`, found by filename, so a new key
// (LIB-12's too) is a new file and no shared registry is edited. This loader builds the id index, `pairSpec(id)`,
// `renderPair(id, opts)` (the key's own `render`, or golden-B `renderHandPair` unchanged, then the extras) and
// `inputsFor(id)` (LIB-2's per-output inputs). Golden-B engine files and LIB-6's renderer are imported, never edited.
import { readdirSync, readFileSync } from 'node:fs';
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
    right, rightNote: V.rightNote, altRight: V.alt, panelHeight: V.panelHeight,
    wrong: cfg.faults.map(k => ({ key: k, ...V.faults[k] })),
    extras: { ...(H.ringMm ? { ringMm: H.ringMm } : {}), ...(V.loadLine === false ? { stripLoadLine: true } : {}), ...(cfg.orientation === 'unstated' ? { thumbSide: true } : {}) },
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
    const c = part.match(/<circle class="h-contact(?: m)?" cx="([\d.-]+)" cy="([\d.-]+)"/);
    out[role] = { handle: h && [+h[1], +h[2]], wrist: w && [+w[1], +w[2]], contact: c && [+c[1], +c[2]] };
  }
  return out;
}

// Bend labels off the ink (plan 3.2 PQ-H1: no label over the figure). The engine sets each value on its wedge's bisector,
// which can land on a curled hand; golden B moves such labels by hand (LIB-6 bendLabel). Here a label that would cover
// its half's hand outline (the half's <defs> paths as polygons, the wedge included) moves to the first free spot on rings
// round its wrist, forearm side first. The gate block measures the real boxes in the browser (isPointInFill).
const LABEL_W = 7.2, LABEL_H = 12, LABEL_PAD = 2;      // --fs-meta 12 px, tabular digits; box estimate plus margin
const poly = d => { const n = d.match(/-?[\d.]+/g).map(Number), ps = []; for (let i = 0; i + 1 < n.length; i += 2) ps.push([n[i], n[i + 1]]); return ps; };
const inPoly = (p, ps) => { let c = false; for (let i = 0, j = ps.length - 1; i < ps.length; j = i++) {
  const [xi, yi] = ps[i], [xj, yj] = ps[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const boxOf = (x, y, anchor, n) => { const w = n * LABEL_W, x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return [x0 - LABEL_PAD, y - 9 - LABEL_PAD, x0 + w + LABEL_PAD, y + 3 + LABEL_PAD]; };
const boxHits = (b, inks) => { for (let i = 0; i <= 6; i++) for (let j = 0; j <= 3; j++) {
  const p = [b[0] + (b[2] - b[0]) * i / 6, b[1] + (b[3] - b[1]) * j / 3]; if (inks.some(ps => inPoly(p, ps))) return true; } return false; };
/** The h-val labels of a pair SVG whose estimated box covers its half's ink: [{ role, text, x, y }]. */
export function labelsOnInk(svg, uid) {
  const out = [];
  for (const q of svg.matchAll(/<text class="h-val( m)?" x="([\d.-]+)" y="([\d.-]+)" text-anchor="(\w+)">([^<]*)<\/text>/g))
    if (boxHits(boxOf(+q[2], +q[3], q[4], q[5].length), inksOf(svg, uid, !!q[1]))) out.push({ role: q[1] ? 'wrong' : 'right', text: q[5], x: +q[2], y: +q[3] });
  return out;
}
function inksOf(svg, uid, wrong) {
  const inks = [...svg.matchAll(new RegExp(`<path id="${uid}-${wrong ? 'w' : 'r'}-[a-z0-9-]+" d="([^"]+)"`, 'g'))].map(q => poly(q[1]));
  const g = svg.indexOf(`<g class="h-panel ${wrong ? 'wrong' : 'right'}">`), arc = svg.slice(g).match(/<path class="h-arc" d="([^"]+)"/);
  if (arc) { const a = arc[1].match(/M([\d.-]+) ([\d.-]+)L([\d.-]+) ([\d.-]+)A[\d.]+ [\d.]+ 0 0 [01] ([\d.-]+) ([\d.-]+)Z/);
    if (!a) throw new Error('hand pairs: unreadable wedge'); inks.push([[+a[1], +a[2]], [+a[3], +a[4]], [+a[5], +a[6]]]); }
  return inks;
}
function placeLabels(svg, uid, pw) {
  const moved = [];
  svg = svg.replace(/<text class="h-val( m)?" x="([\d.-]+)" y="([\d.-]+)" text-anchor="(\w+)">([^<]*)<\/text>/g, (m0, m, x, y, anchor, text) => {
    const inks = inksOf(svg, uid, !!m), g = svg.indexOf(`<g class="h-panel ${m ? 'wrong' : 'right'}">`);
    if (!boxHits(boxOf(+x, +y, anchor, text.length), inks)) return m0;
    const wr = svg.slice(g).match(/<circle class="h-joint wrist" cx="([\d.-]+)" cy="([\d.-]+)"/), W = [+wr[1], +wr[2]];
    const H = +svg.match(/viewBox="0 0 [\d.]+ ([\d.]+)"/)[1], x0 = m ? pw + 16 : 0;
    const inside = b => b[0] >= x0 + 4 && b[2] <= x0 + pw - 4 && b[1] >= 70 && b[3] <= H - 4;
    for (const r of [22, 30, 38, 46, 54]) for (let a = 0; a < 360; a += 15) {
      // forearm side first: the hand lies toward +x in every LIB-7 pose, so start at 180 deg and sweep both ways
      const t = (180 + (a % 2 === 0 ? 1 : -1) * Math.ceil(a / 2 / 15) * 15) * Math.PI / 180;
      const px = W[0] + Math.cos(t) * r, py = W[1] + Math.sin(t) * r + 4, b = boxOf(px, py, 'middle', text.length);
      if (inside(b) && !boxHits(b, inks)) { moved.push({ role: m ? 'wrong' : 'right', text, from: [+x, +y], to: [f2(px), f2(py)] });
        return `<text class="h-val${m ?? ''}" x="${f2(px)}" y="${f2(py)}" text-anchor="middle">${text}</text>`; }
    }
    throw new Error(`hand pairs: no free spot for the ${text} label`);
  });
  return { svg, moved };
}

/** One rendered pair. opts: { uid, fault (key; default the first), panelHeight, index }. */
export function renderPair(id, opts = {}) {
  const s = pairSpec(id, opts.index);
  const F = opts.fault ? s.wrong.find(w => w.key === opts.fault) : s.wrong[0];
  if (!F) throw new Error(`hand pairs: ${id}: no fault ${opts.fault}`);
  const render = s.mod.render ?? renderHandPair;
  const out = render({ uid: opts.uid ?? `hp-${id.replace(/_/g, '-')}-${F.key}`, camera: s.camera, loadAxis: s.loadAxis, markers: F.markers,
    right: s.right, wrong: mergePose(s.right, F.pose), rightNote: s.rightNote, wrongNote: F.label,
    alt: { right: s.altRight, wrong: F.alt }, panelHeight: opts.panelHeight ?? s.panelHeight });
  let svg = out.svg, rings = null;
  if (s.extras.thumbSide) {
    svg = once(svg, '>SEEN FROM THE SIDE<', `>${THUMB_SIDE.toUpperCase()}<`, 'thumb-side label');
    svg = once(svg, 'aria-label="Seen from the side. ', `aria-label="${THUMB_SIDE}. `, 'thumb-side aria');
  }
  // no force line where the load does not run along the forearm (golden-B's lateral raise does the same, LIB-6
  // closeup/hand.mjs stripLoadLine): the line and its head in both halves, and the Right half's wrist tick
  if (s.extras.stripLoadLine) {
    const before = svg;
    svg = svg.replace(/<path class="h-load( m)?" d="[^"]*"\/><path class="h-load-head( m)?" d="[^"]*"\/>/g, '').replace(/<path class="h-tick" d="[^"]*"\/>/g, '');
    if (before === svg || /class="h-load/.test(svg)) throw new Error(`hand pairs: ${id}: load line not stripped cleanly`);
  }
  const uidUsed = opts.uid ?? `hp-${id.replace(/_/g, '-')}-${F.key}`, placed = placeLabels(svg, uidUsed, (358 - 16) / 2);
  svg = placed.svg;
  if (s.extras.ringMm) ({ svg, rings } = addRings(svg, s.extras.ringMm, out.report.scalePxPerMm));
  return { svg, spec: s, fault: F, report: { ...out.report, rings, labelsMoved: placed.moved, measured: measured(svg) } };
}

/** The repo files a module reads through its relative imports, itself included (static `from './…'` specifiers). */
export function importClosure(files) {
  const seen = new Set(), todo = [...files];
  while (todo.length) {
    const f = todo.pop();
    if (seen.has(f)) continue;
    seen.add(f);
    const src = readFileSync(join(ROOT, f), 'utf8');
    for (const m of src.matchAll(/(?:^|\n)\s*(?:import|export)\s[^;]*?from\s+'(\.{1,2}\/[^']+)'/g)) todo.push(rel(join(ROOT, dirname(f), m[1])));
  }
  return seen;
}

/** The files one id's drawing reads (LIB-2 per-output inputsSha256): its key file and the mechanism, with everything they
 *  import, plus the key's declared INPUTS (sizes matched to a composer). A change to another key never marks it stale. */
export function inputsFor(id, index = INDEX) {
  const e = index.drawn.get(id);
  if (!e) throw new Error(`hand pairs: inputsFor: ${id} has no pair`);
  const lib = p => `tools/plates/library/${p}`;
  return [...new Set([...importClosure([lib('hands/pairs.mjs'), lib('hands/zoom.mjs'), e.mod.FILE, ...(e.mod.VIEW_FILES ?? [])]), ...(e.mod.INPUTS ?? [])])].sort();
}

