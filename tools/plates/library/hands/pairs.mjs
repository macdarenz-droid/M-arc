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
// 'angled': the EZ bar's angled section, half-way between palms up and palms in (D-LIB7-15): the camera looks along that
// section, which the radial view always does, and the label says so instead of claiming palm up or palm in.
export const ORIENTATIONS = { under: 'side', over: 'side', neutral: 'above', unstated: 'side', angled: 'side' };
// Archetype defaults a card delegates to (GA 3.1, 3.1.1). Cited as `ga:<name>`; flagged on the sheet, never a claim.
export const CONVENTIONS = {
  'ga:push-heel': 'GA 3.1 push: heel of the palm, low, over the forearm; extension 0 to 15',
  'ga:pull-base': 'GA 3.1 pull: base of the fingers and top edge of the palm; extension 0 to 25',
  'ga:curl-mid': 'GA 3.1 curl: across the middle of the palm; extension -10 to +10 (shared/curl.json gap 1)',
  'ga:rope-fingers': 'GA 3.1.1 rope: load in the fingers, loadAxis across, lever check off (shared/rope-rule.json gap 1)',
};
// Palm up for an underhand grip and for the EZ bar's angled grip: the camera looks along the angled section, so the hand,
// square to that section, shows as a straight-bar underhand grip does from the side; the camera words carry the angle
// (D-LIB7-16). The engine mirrors V for these.
export const PALM_UP = new Set(['under', 'angled']);
export const THUMB_SIDE = 'Seen from the thumb side', ALONG_ANGLED = 'Seen along the angled grip';
export const CAMERA_TEXT = { unstated: THUMB_SIDE, angled: ALONG_ANGLED };

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
  const { mod, cfg } = e, V = mod.VARIANTS[cfg.variant], H = V.handle ?? mod.HANDLE ?? null;
  // a radial hand closes round a handle, so it needs its diameter (golden-B falls back to 32 mm otherwise); a view with
  // no handle (LIB-12's palm on the floor) has no honest diameter and passes none (LIB-12 ask, supervisor OK 10-02)
  if ((mod.VIEW === 'radial' || H?.profile) && !(H?.diameterMm > 0)) throw new Error(`hand pairs: ${mod.KEY}/${cfg.variant}: no explicit handle diameter`);
  const handle = H?.profile ? { profile: H.profile, diameterMm: H.diameterMm, ...(H.headMm ? { headMm: H.headMm } : {}) } : null;
  const right = mergePose(V.right, { ...(handle ? { handle } : {}), ...(PALM_UP.has(cfg.orientation) ? { mirror: true } : {}) });
  const radial = mod.VIEW === 'radial' && !mod.render, camera = ORIENTATIONS[cfg.orientation];
  return {
    id, key: mod.KEY, variant: cfg.variant, pair: `${mod.KEY}/${cfg.variant}`, mod, orientation: cfg.orientation,
    camera, loadAxis: V.loadAxis, wristRange: V.wristRange, contact: V.contact, handle: H,
    right, rightNote: V.rightNote, altRight: V.alt, panelHeight: V.panelHeight,
    wrong: cfg.faults.map(k => ({ key: k, ...V.faults[k] })),
    extras: { ...(V.loadLine === false ? { stripLoadLine: true } : {}), ...(radial && H?.plain ? { plainHandle: true } : {}),
      ...(radial && H?.knobMm ? { knobMm: H.knobMm } : {}), ...(radial && V.loadThroughPivot ? { loadThroughPivot: true } : {}), ...(radial && CAMERA_TEXT[cfg.orientation] ? { cameraText: CAMERA_TEXT[cfg.orientation] } : {}),
      // golden B's "seen from above" row names YOU and MACHINE; a hand-held weight has no machine, so it gets the camera
      // words alone (renderHandPair's side-camera label, reworded; D-LIB7-11)
      ...(radial && camera === 'above' && !V.machine ? { plainAbove: true } : {}), ...(radial ? { placeLabels: true } : {}) },
  };
}

// Extras, applied to the rendered pair. Each one checks its anchor and throws when it isn't there exactly once.
function once(svg, find, repl, what) {
  const n = svg.split(find).length - 1;
  if (n !== 1) throw new Error(`hand pairs: ${what}: anchor found ${n} times`);
  return svg.replace(find, repl);
}
const f2 = v => +v.toFixed(2);
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
const LABEL_W = 7.2, LABEL_PAD = 3;      // --fs-meta 12 px, tabular digits; box estimate plus margin
// a <defs> outline as a polygon: absolute M, L, H, V, Q, C and Z, curves flattened in 8 steps
export function poly(d) {
  const ps = []; let cur = [0, 0];
  for (const [, c, args] of d.matchAll(/([MLHVQCZ])([^MLHVQCZ]*)/g)) {
    const n = (args.match(/-?[\d.]+(?:e-?\d+)?/g) ?? []).map(Number);
    if (c === 'M' || c === 'L') for (let i = 0; i + 1 < n.length; i += 2) ps.push(cur = [n[i], n[i + 1]]);
    else if (c === 'H') ps.push(cur = [n[0], cur[1]]);
    else if (c === 'V') ps.push(cur = [cur[0], n[0]]);
    else if (c === 'Q') for (let i = 0; i + 3 < n.length; i += 4) { const p0 = cur; for (let t = 1; t <= 8; t++) { const u = t / 8, a = (1 - u) ** 2, b = 2 * (1 - u) * u, e = u * u;
      ps.push([a * p0[0] + b * n[i] + e * n[i + 2], a * p0[1] + b * n[i + 1] + e * n[i + 3]]); } cur = [n[i + 2], n[i + 3]]; }
    else if (c === 'C') for (let i = 0; i + 5 < n.length; i += 6) { const p0 = cur; for (let t = 1; t <= 8; t++) { const u = t / 8, a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, e = 3 * (1 - u) * u * u, g = u ** 3;
      ps.push([a * p0[0] + b * n[i] + e * n[i + 2] + g * n[i + 4], a * p0[1] + b * n[i + 1] + e * n[i + 3] + g * n[i + 5]]); } cur = [n[i + 4], n[i + 5]]; }
  }
  return ps;
}
const inPoly = (p, ps) => { let c = false; for (let i = 0, j = ps.length - 1; i < ps.length; j = i++) {
  const [xi, yi] = ps[i], [xj, yj] = ps[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const boxOf = (x, y, anchor, n) => { const w = n * LABEL_W, x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return [x0 - LABEL_PAD, y - 12 - LABEL_PAD, x0 + w + LABEL_PAD, y + 4 + LABEL_PAD]; };
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

// Rope and push extras (critic run on #193, 10-03; D-LIB7-13, D-LIB7-14). Each throws when an anchor is missing.
/** A rope seen end-on is one plain section: golden B's handle core ring and cross (a rigid handle's) are left out. */
function plainHandle(svg) {
  const before = svg.match(/<(?:circle|path) class="h-eq-core"[^>]*\/>/g)?.length ?? 0;
  if (before !== 4) throw new Error(`hand pairs: plain handle: ${before} core marks, expected 4`);
  return svg.replace(/<(?:circle|path) class="h-eq-core"[^>]*\/>/g, '');
}
/** The knob, coaxial with the rope and past the little-finger edge, so the fist hides it: a dashed outline (golden B's
 *  hidden-equipment line, h-eq-thin) drawn over the hand at the composer's size. */
function knobRings(svg, knobMm, k) {
  const knobs = [];
  for (const role of ['right', 'wrong']) {
    const g = `<g class="h-panel ${role}">`, at = svg.indexOf(g);
    if (at < 0) throw new Error(`hand pairs: knob: no ${role} panel`);
    let depth = 0, close = -1;                                  // the panel's own closing </g>
    const re = /<g[\s>]|<\/g>/g; re.lastIndex = at;
    for (let m; (m = re.exec(svg));) { depth += m[0] === '</g>' ? -1 : 1; if (depth === 0) { close = m.index; break; } }
    const c = svg.slice(at, close).match(/<circle class="h-eq" cx="([\d.-]+)" cy="([\d.-]+)" r="([\d.]+)"\/>/);
    if (close < 0 || !c) throw new Error(`hand pairs: knob: no ${role} rope`);
    const knob = { role, cx: +c[1], cy: +c[2], r: f2(knobMm / 2 * k) };
    knobs.push(knob);
    svg = svg.slice(0, close) + `<circle class="h-eq-thin" cx="${knob.cx}" cy="${knob.cy}" r="${knob.r}"/>` + svg.slice(close);
  }
  return { svg, knobs };
}
/** A push on the heel runs through the wrist: the Right half's force line is re-aimed from its handle end through the
 *  wrist pivot, same length (the Wrong half keeps the engine's line behind the wrist, which is the lever it shows). */
function loadThroughPivot(svg) {
  const at = svg.indexOf('<g class="h-panel right">'), end = svg.indexOf('<g class="h-panel wrong">');
  let part = svg.slice(at, end);
  const line = part.match(/<path class="h-load" d="M([\d.-]+) ([\d.-]+)L([\d.-]+) ([\d.-]+)"\/>/), head = part.match(/<path class="h-load-head" d="[^"]*"\/>/);
  const w = part.match(/<circle class="h-joint wrist" cx="([\d.-]+)" cy="([\d.-]+)"/);
  if (!line || !head || !w) throw new Error('hand pairs: load through pivot: anchors missing');
  const A = [+line[1], +line[2]], B = [+line[3], +line[4]], W = [+w[1], +w[2]], L = Math.hypot(B[0] - A[0], B[1] - A[1]);
  const d = [W[0] - A[0], W[1] - A[1]], dl = Math.hypot(...d), u = [d[0] / dl, d[1] / dl], E = [A[0] + u[0] * L, A[1] + u[1] * L];
  const n = [-u[1], u[0]], tip = [E[0] + u[0] * 4, E[1] + u[1] * 4], sz = 6;
  const hd = `M${f2(tip[0] - u[0] * sz + n[0] * sz * .62)} ${f2(tip[1] - u[1] * sz + n[1] * sz * .62)}L${f2(tip[0])} ${f2(tip[1])}L${f2(tip[0] - u[0] * sz - n[0] * sz * .62)} ${f2(tip[1] - u[1] * sz - n[1] * sz * .62)}Z`;
  part = part.replace(line[0], `<path class="h-load" d="M${f2(A[0])} ${f2(A[1])}L${f2(E[0])} ${f2(E[1])}"/>`).replace(head[0], `<path class="h-load-head" d="${hd}"/>`);
  // the engine's tick marks where its own line crossed the wrist level; the re-aimed line crosses at the pivot itself
  part = part.replace(/<path class="h-tick" d="[^"]*"\/>/, '');
  return { svg: svg.slice(0, at) + part + svg.slice(end), pivot: { from: [f2(A[0]), f2(A[1])], to: [f2(E[0]), f2(E[1])], wrist: W } };
}

/** One rendered pair. opts: { uid, fault (key; default the first), panelHeight, index }. */
export function renderPair(id, opts = {}) {
  const s = pairSpec(id, opts.index);
  const F = opts.fault ? s.wrong.find(w => w.key === opts.fault) : s.wrong[0];
  if (!F) throw new Error(`hand pairs: ${id}: no fault ${opts.fault}`);
  const render = s.mod.render ?? renderHandPair;
  const out = render({ uid: opts.uid ?? `hp-${id.replace(/_/g, '-')}-${F.key}`, camera: s.extras.plainAbove ? 'side' : s.camera, loadAxis: s.loadAxis, markers: F.markers,
    right: s.right, wrong: mergePose(s.right, F.pose), rightNote: s.rightNote, wrongNote: F.label,
    alt: { right: s.altRight, wrong: F.alt }, panelHeight: opts.panelHeight ?? s.panelHeight });
  let svg = out.svg;
  if (s.extras.cameraText) {
    svg = once(svg, '>SEEN FROM THE SIDE<', `>${s.extras.cameraText.toUpperCase()}<`, 'camera label');
    svg = once(svg, 'aria-label="Seen from the side. ', `aria-label="${s.extras.cameraText}. `, 'camera aria');
  }
  if (s.extras.plainAbove) {
    svg = once(svg, '>SEEN FROM THE SIDE<', '>SEEN FROM ABOVE<', 'plain-above label');
    svg = once(svg, 'aria-label="Seen from the side. ', 'aria-label="Seen from above. ', 'plain-above aria');
  }
  // no force line where the load does not run along the forearm (golden-B's lateral raise does the same, LIB-6
  // closeup/hand.mjs stripLoadLine): the line and its head in both halves, and the Right half's wrist tick
  if (s.extras.stripLoadLine) {
    const before = svg;
    svg = svg.replace(/<path class="h-load( m)?" d="[^"]*"\/><path class="h-load-head( m)?" d="[^"]*"\/>/g, '').replace(/<path class="h-tick" d="[^"]*"\/>/g, '');
    if (before === svg || /class="h-load/.test(svg)) throw new Error(`hand pairs: ${id}: load line not stripped cleanly`);
  }
  if (s.extras.plainHandle) svg = plainHandle(svg);
  let knobs = null, pivot = null;
  if (s.extras.knobMm) ({ svg, knobs } = knobRings(svg, s.extras.knobMm, out.report.scalePxPerMm));
  if (s.extras.loadThroughPivot) ({ svg, pivot } = loadThroughPivot(svg));
  const uidUsed = opts.uid ?? `hp-${id.replace(/_/g, '-')}-${F.key}`, placed = s.extras.placeLabels ? placeLabels(svg, uidUsed, (358 - 16) / 2) : { svg, moved: [] };
  svg = placed.svg;
  return { svg, spec: s, fault: F, report: { ...out.report, labelsMoved: placed.moved, knobs, pivot, measured: measured(svg) } };
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

