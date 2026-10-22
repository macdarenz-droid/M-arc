// LIB-12-FIX (D-LIB12FIX-R8): the hand construction of golden B's close-ups, for LIB-12's own views. Drawing code
// only; the registry entries are the hand-<key>.mjs modules.
//
// Golden B's engine/hand.mjs draws the reference hands (radial view, closed round an end-on handle). It is reserved and
// exports handGeometry, HAND_PROP, HAND_OF_H and HAND_CSS, but not its drawing (drawHand, capsule, solveChain). This
// file rebuilds that drawing from the same parts:
//   - lengths: HAND_PROP and HAND_OF_H (imported), segment and thumb radii, the palm, back-of-hand and forearm profiles
//     (from handGeometry's own output where it returns them, else ENGINE_COPIED below);
//   - the outline: tapered capsules per segment, knuckle pads, the forearm with its wavy cut, the thenar pad;
//   - the detail: flexion creases, nails, the wrist crease, the forearm bones; the handle end-on with its core and +.
// Every value copied from hand.mjs internals is in ENGINE_COPIED with the source text it came from; R8-DRIFT
// (tests/library/lib12-fix.test.ts) pins each one against hand.mjs, so a golden-B change is caught, never drifted from.
//
// handPair() is view-common's viewPair chrome (golden B's pair layout) with layered parts drawn in order, so a view can
// put a skin outline, the finger detail and a thumb on top of each other as the engine does. R8-DRIFT also pins the
// chrome against viewPair.
import { HAND_PROP, handGeometry } from '../../layers/engine/hand.mjs';
import { f, pt, spline } from '../../layers/engine/geom.mjs';
import { CAMERA_TEXT, FINGER_T, add, arrowHead, capsule, dir, fingerScale, len, mul, polyD, sub } from './view-common.mjs';

export { HAND_PROP, handGeometry };
const RAD = Math.PI / 180;

/** Values copied from golden-B engine/hand.mjs internals (mm at HL 189 unless a factor), each with its source text. */
export const ENGINE_COPIED = {
  fingerT: { value: FINGER_T, src: ['const tPP = 9.8 * s, tMP = 8.6 * s, tDP = 7.4 * s;'] },
  fingerScale: { value: [0.88, 0.95], src: ["(name === 'little' ? 0.88 : name === 'ring' ? 0.95 : 1)"] },
  thumbT: { value: [11, 9.2, 8], src: ['t: [11 * s, 9.2 * s, 8 * s][i]'] },
  dorsal: { value: [[0, 19.5], [12, 19.5], [30, 18], [50, 16], [66, 14], [76, 12.8]], src: ['const mcpI = g.mcpI, dors = [[0, 19.5], [12, 19.5], [30, 18], [50, 16], [66, 14], [76, 12.8]]'] },
  knuckle: { value: [[5, 11], [9.5, 5], [10.5, -3]], src: ['const knuck = [[mcpI[0] + 5 * s, 11 * s], [mcpI[0] + 9.5 * s, 5 * s], [mcpI[0] + 10.5 * s, -3 * s]];'] },
  palmEnds: { value: [[-6, 16], [-6, -17], [-10, 0]], src: ['const palmRing = [[-6 * s, 16 * s], ...dors, ...knuck, ...resample([...g.palmar].reverse(), 4 * s).map(outsideCircle), [-6 * s, -17 * s], [-10 * s, 0]];'] },
  foreTip: { value: [[8, 14], [12, 0], [8, -15]], src: ['const foreRing = [...fore.top, [8 * s, 14 * s], [12 * s, 0], [8 * s, -15 * s], ...[...fore.bot].reverse(),'] },
  foreCut: { value: [[-2, -30], [3, -12], [-3, 6], [2, 20]], src: ['[Lcut - 2 * s, -30 * s], [Lcut + 3 * s, -12 * s], [Lcut - 3 * s, 6 * s], [Lcut + 2 * s, 20 * s]];'] },
  knucklePad: { value: [12.5, 1.04, 1.04], src: ['const knuckleR = [12.5 * s, isg[0].t * 1.04, isg[1].t * 1.04];'] },
  indexTaper: { value: [1.02, 1.02, 0.8], src: ["capsule(ix.pts[0], ix.pts[1], isg[0].t, isg[1].t * 1.02)", "capsule(ix.pts[1], ix.pts[2], isg[1].t, isg[2].t * 1.02)", "capsule(ix.pts[2], ix.pts[3], isg[2].t, isg[2].t * 0.8)"] },
  farTaper: { value: [2, 0.85], src: ['capsule(p0, fg.pts[i + 1], fg.segs[i].t, i === 2 ? fg.segs[i].t * 0.85 : fg.segs[i + 1]?.t ?? fg.segs[i].t)'] },
  thumbTaper: { value: [1.03, 0.8], src: ["capsule(th.pts[1], th.pts[2], ts[1].t, ts[2].t * 1.03)", "capsule(th.pts[2], th.pts[3], ts[2].t, ts[2].t * 0.8)"] },
  compression: { value: [3.5], src: ['comp = 3.5 * s;', 'const hug = circ.r - 3.5 * s;'] },
  ring: { value: [1.5], src: ["capsule(circ.c, circ.c, circ.r + 1.5 * s, circ.r + 1.5 * s, 12)"] },
  crease: { value: [0.45, 1.0], src: ['p0 = add(C, mul(n, side * t * 0.45)), p1 = add(C, mul(n, side * t * 1.0));'] },
  nail: { value: [0.42, 0.95, 0.92, 0.72, 0.42, 0.5], src: ['const p0 = add(add(A, mul(u, L * 0.42)), mul(n, t * 0.95)), p1 = add(add(A, mul(u, L * 0.92)), mul(n, t * 0.72)), p2 = add(add(A, mul(u, L * 0.42)), mul(n, t * 0.5));'] },
  nailT: { value: [0.9], src: ['nail(ix.pts[2], ix.pts[3], isg[2].t * 0.9, +1)'] },
  wristCrease: { value: [12, 25, 3, 2, 4.5, 19, 19, 5.5, 2.5], src: ['if (Math.abs(e) > 12) {', 'n = Math.abs(e) > 25 ? 3 : 2;', 'const a = (i - (n - 1) / 2) * 4.5 * s, v0 = side * 19 * s, v1 = side * (19 - 5.5 - (i === (n - 1) / 2 ? 2.5 : 0)) * s;'] },
  bones: { value: [10, -13, -8, -8, 9, 7, -12], src: ['F([Lcut + 10 * s, v0 * s]))}L${pt(F([a1 * s, v1 * s]))}', 'det += bone(-13, -8, -8) + bone(9, 7, -12);'] },
  barMark: { value: [0.62, 3], src: ['r="${f(hr * 0.62)}"', 'M${pt([hc[0] - 3, hc[1]])}L${pt([hc[0] + 3, hc[1]])}'] },
  resample: { value: [4], src: ['resample([...g.palmar].reverse(), 4 * s)'] },
};
const C = Object.fromEntries(Object.entries(ENGINE_COPIED).map(([k, v]) => [k, v.value]));

// ---------- projection (the engine's makeProj, at 1 px per mm: the pair fit scales afterwards) ----------
/** forearmDeg: 0 = the forearm points down the screen toward the hand, 90 = right, 180 = up (engine convention).
 *  Returns F (forearm frame [a along the forearm toward the hand, b toward the back] -> mm) and Hh (hand frame). */
export function projector({ W = [0, 0], forearmDeg, mirror = false, ext = 0 }) {
  const th = forearmDeg * RAD, U = [Math.sin(th), Math.cos(th)], m = mirror ? -1 : 1, V = [m * U[1], -m * U[0]];
  const F = ([a, b]) => [W[0] + a * U[0] + b * V[0], W[1] + a * U[1] + b * V[1]];
  const c = Math.cos(ext * RAD), sn = Math.sin(ext * RAD);
  const toF = ([u, v]) => [u * c - v * sn, u * sn + v * c];
  return { F, Hh: p => F(toF(p)), U, V, W, toF };
}

// ---------- finger chains (hand frame: u toward the fingers, v toward the back of the hand) ----------
/** A finger's segments: HAND_PROP lengths, engine radii (FINGER_T x fingerScale). */
export const segsOf = (name, HL, s) => HAND_PROP[name].seg.map((l, i) => ({ L: l * HL, t: FINGER_T[i] * s * fingerScale(name) }));
/** Forward kinematics: from the knuckle along a0 (deg, hand frame), each joint turning by flex[i] toward the palm
 *  (positive = flexion, negative = hyperextension). */
export function fingerFK(name, HL, s, flex, a0 = 0, base) {
  const segs = segsOf(name, HL, s), F0 = HAND_PROP[name], pts = [base ?? [F0.mcp[0] * HL, F0.mcp[1] * HL]];
  let a = a0;
  segs.forEach((q, i) => { a -= flex[i]; pts.push(add(pts[i], mul(dir(a), q.L))); });
  return { name, pts, segs };
}

const resample = (ps, step) => { const o = [ps[0]]; for (let i = 1; i < ps.length; i++) { const a = ps[i - 1], b = ps[i], n = Math.max(1, Math.ceil(len(sub(b, a)) / step)); for (let j = 1; j <= n; j++) o.push(add(a, mul(sub(b, a), j / n))); } return o; };
const angAt = (pts, i) => Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0]) / RAD;
/** A flexion crease across a finger at joint C (hand frame), on the palm side (side -1) or the back (+1). */
const crease = (Cj, a, t, side) => { const d = dir(a), n = [-d[1], d[0]]; return [add(Cj, mul(n, side * t * C.crease[0])), add(Cj, mul(n, side * t * C.crease[1]))]; };
/** A nail on the back of the distal segment A-B (two strokes, as the engine's). */
const nail = (A, B, t, side) => { const d = sub(B, A), L = len(d), u = mul(d, 1 / L), n = mul([-u[1], u[0]], side), [a0, b0, a1, b1, a2, b2] = C.nail;
  const p0 = add(add(A, mul(u, L * a0)), mul(n, t * b0)), p1 = add(add(A, mul(u, L * a1)), mul(n, t * b1)), p2 = add(add(A, mul(u, L * a2)), mul(n, t * b2));
  return [[p0, p1], [p0, p2]]; };

/**
 * One side-view hand as layered parts in mm. geo: {
 *   s, HL, mcpI, palmar, fore: { top, bot } (handGeometry's scaled tables), e (wrist ext, deg),
 *   near: [chain] (own outline over the palm, with knuckle pads, creases and a nail), far: [chain] (behind, lighter),
 *   thumb: { pts: [cmc, mc, ip, tip], segs } | null, thumbLayer: 'thumb' | 'far' | null,
 *   grip: { c, r } | null (a handle the hand closes round), closed: bool }
 * A chain is { pts, segs } in the hand frame, or with `screen: true` already in the half's frame (mm); palmSide: the
 * side its creases go (-1 in the hand frame). geo.palmMap replaces Hh for the palm (a cupped palm turns about its heel);
 * geo.foreLen cuts the forearm shorter. P: projector(). Returns { layers, pts, near } (outline points, for checks).
 */
export function sideHand(geo, P) {
  const { s, mcpI, palmar, fore, e, near = [], far = [], thumb = null, thumbLayer = null, grip = null, closed = false } = geo, { F, Hh } = P;
  const ringsFar = [], ringsSkin = [], ringsNear = [], ringsThumb = [], creases = [], nails = [], strong = [], bones = [], all = [], nearPts = [];
  const keep = ps => { ps.forEach(p => all.push(p)); return ps; };
  const tap = (segs, i) => (i === 2 ? segs[i].t * C.farTaper[1] : segs[i + 1]?.t ?? segs[i].t);
  const mapOf = ch => (ch.screen ? (p => p) : Hh);   // a chain posed in the half's own frame (mm) is not projected
  for (const ch of far) ch.pts.slice(0, -1).forEach((p, i) => ringsFar.push({ ring: keep(capsule(p, ch.pts[i + 1], ch.segs[i].t, tap(ch.segs, i)).map(mapOf(ch))) }));
  if (thumb && thumbLayer === 'far') thumb.pts.slice(1, -1).forEach((p, i) => ringsFar.push({ ring: keep(capsule(p, thumb.pts[i + 2], thumb.segs[i + 1].t, i ? thumb.segs[2].t * C.thumbTaper[1] : thumb.segs[2].t * C.thumbTaper[0]).map(mapOf(thumb))) }));
  // skin: forearm with the wavy cut, palm (back of the hand, knuckle bump, palm side), thenar pad
  // the forearm leaves the panel at foreLen (mm) from the wrist (default: the engine's 105 at HL 189), cut on its profile
  const cut = (tbl, L) => { if (!(L < -tbl[0][0])) return tbl; const i = tbl.findIndex(p => p[0] > -L), [a, b] = [tbl[i - 1], tbl[i]], v = a[1] + (b[1] - a[1]) * (-L - a[0]) / (b[0] - a[0]); return [[-L, v], ...tbl.slice(i)]; };
  const top = cut(fore.top, geo.foreLen), bot = cut(fore.bot, geo.foreLen);
  const Lcut = top[0][0], sc = ([a, b]) => [a * s, b * s];
  const foreRing = [...top, ...C.foreTip.map(sc), ...[...bot].reverse(), ...C.foreCut.map(([a, b]) => [Lcut + a * s, b * s])];
  ringsSkin.push({ ring: keep(foreRing.map(F)), smooth: true });
  const hug = grip ? grip.r - C.compression[0] * s : 0;
  const outside = p => { if (!grip) return p; const d = sub(p, grip.c), L = len(d); return L < hug ? add(grip.c, mul(d, hug / L)) : p; };
  const [pe0, pe1, pe2] = C.palmEnds.map(sc);
  const palmRing = [pe0, ...C.dorsal.map(sc), ...C.knuckle.map(([u, v]) => [mcpI[0] + u * s, v * s]), ...resample([...palmar].reverse(), C.resample[0] * s).map(outside), pe1, pe2];
  ringsSkin.push({ ring: keep(palmRing.map(geo.palmMap ?? Hh)), smooth: true });
  if (thumb && thumbLayer === 'thumb') ringsSkin.push({ ring: keep(capsule(thumb.pts[0], thumb.pts[1], thumb.segs[0].t, thumb.segs[1].t + 0.6 * s).map(mapOf(thumb))) });   // thenar pad
  if (grip && closed) {
    ringsSkin.push({ ring: capsule(grip.c, grip.c, grip.r + C.ring[0] * s, grip.r + C.ring[0] * s, 12).map(Hh) });
    if (near[0]) [0, 1].forEach(i => ringsSkin.push({ ring: [near[0].pts[i], near[0].pts[i + 1], grip.c].map(Hh), straight: true }));
  }
  // near fingers: tapered segments and knuckle pads, one outline over the palm
  for (const ch of near) {
    const t = ch.segs.map(q => q.t), [k0, k1, k2] = C.indexTaper, M = mapOf(ch), side = ch.palmSide ?? -1;
    const caps = [capsule(ch.pts[0], ch.pts[1], t[0], t[1] * k0), capsule(ch.pts[1], ch.pts[2], t[1], t[2] * k1), capsule(ch.pts[2], ch.pts[3], t[2], t[2] * k2)].map(c => keep(c.map(M)));
    caps.forEach(ring => { ringsNear.push({ ring }); nearPts.push(...ring); });
    [t[0] * C.knucklePad[1], t[1] * C.knucklePad[2]].forEach((r, i) => ringsNear.push({ ring: capsule(ch.pts[i + 1], ch.pts[i + 1], r, r, 8).map(M) }));
    for (const i of [1, 2]) creases.push(crease(ch.pts[i], (angAt(ch.pts, i - 1) + angAt(ch.pts, i)) / 2, ch.segs[i].t, side).map(M));
    nails.push(...nail(ch.pts[2], ch.pts[3], ch.segs[2].t * C.nailT[0], -side).map(l => l.map(M)));
  }
  // thumb (nearest): proximal and distal segments, crease and nail
  if (thumb && thumbLayer === 'thumb') {
    const ts = thumb.segs, tp = thumb.pts, M = mapOf(thumb);
    ringsThumb.push({ ring: keep(capsule(tp[1], tp[2], ts[1].t, ts[2].t * C.thumbTaper[0]).map(M)) }, { ring: keep(capsule(tp[2], tp[3], ts[2].t, ts[2].t * C.thumbTaper[1]).map(M)) });
    const side = thumb.palmSide ?? 1;
    creases.push(crease(tp[2], (angAt(tp, 1) + angAt(tp, 2)) / 2, ts[2].t, side).map(M));
    nails.push(...nail(tp[2], tp[3], ts[2].t * C.nailT[0], -side).map(l => l.map(M)));
  }
  // wrist crease on the side the wrist bends toward; forearm bones
  if (Math.abs(e) > C.wristCrease[0]) {
    const side = e > 0 ? 1 : -1, n = Math.abs(e) > C.wristCrease[1] ? C.wristCrease[2] : C.wristCrease[3], [, , , , sp, v0b, v1b, dv, dmid] = C.wristCrease;
    for (let i = 0; i < n; i++) {
      const a = (i - (n - 1) / 2) * sp * s, v0 = side * v0b * s, v1 = side * (v1b - dv - (i === (n - 1) / 2 ? dmid : 0)) * s;
      strong.push([F([a, v0]), F([a + side * 2 * s, (v0 + v1) / 2]), F([a, v1])]);
    }
  }
  const [b0, ...bv] = C.bones;
  for (const [v0, v1, a1] of [bv.slice(0, 3), bv.slice(3, 6)]) bones.push([F([Lcut + b0 * s, v0 * s]), F([a1 * s, v1 * s])]);   // radius and ulna
  const layers = [
    { union: 'h-far', rings: ringsFar }, { union: 'h-skin', rings: ringsSkin }, { union: 'h-skin', rings: ringsNear },
    { lines: 'h-bone', segs: bones }, { lines: 'h-crease', segs: creases }, { lines: 'h-nail', segs: nails }, { curves: 'h-crease strong', segs: strong },
  ];
  if (grip) layers.push(...barSection(Hh(grip.c), grip.r));
  layers.push({ union: 'h-thumb', rings: ringsThumb });
  return { layers, pts: all, near: nearPts };
}

/** A bar or handle end-on (the engine's handle section): outline, core at .62 and a + at the centre (3 px each way). */
export function barSection(c, r) {
  return [{ circle: 'h-eq', c, r }, { circle: 'h-eq-core', c, r: r * C.barMark[0] }, { plus: 'h-eq-core', c, px: C.barMark[1] }];
}

// ---------- the pair (view-common viewPair's chrome; layers drawn in order) ----------
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const iconCheck = (x, y, sz) => `<path class="h-icon ok" transform="translate(${f(x)} ${f(y)}) scale(${f(sz / 24)})" d="M5 12l4 4L19 7"/>`;
const iconCross = (x, y, sz) => `<path class="h-icon no" transform="translate(${f(x)} ${f(y)}) scale(${f(sz / 24)})" d="M6 6l12 12M18 6L6 18"/>`;
const dots = id => `<pattern id="${id}-dots" width="16" height="16" patternUnits="userSpaceOnUse"><rect x="7.5" y="7.5" width="1" height="1" class="dot"/></pattern>`;
const bbox = ps => ps.reduce((b, p) => [Math.min(b[0], p[0]), Math.min(b[1], p[1]), Math.max(b[2], p[0]), Math.max(b[3], p[1])], [Infinity, Infinity, -Infinity, -Infinity]);

/** Every point a layer draws (mm), for the fit. */
function layerPts(L) {
  if (L.rings) return L.rings.flatMap(r => r.ring);
  if (L.ring) return L.ring;
  if (L.segs) return L.segs.flat();
  if (L.line) return L.line;
  if (L.circle) return [[L.c[0] - L.r, L.c[1] - L.r], [L.c[0] + L.r, L.c[1] + L.r]];
  if (L.at) return [L.at];
  if (L.fit) return L.fit;
  return [];
}

function drawLayers(layers, M, k, uid) {
  const defs = []; let n = 0, body = '';
  const def = (ring, smooth) => { const id = `${uid}-p${n++}`; defs.push(`<path id="${id}" d="${smooth ? spline(ring.map(M)) : polyD(ring.map(M))}"/>`); return id; };
  const uses = ids => ids.map(i => `<use href="#${i}"/>`).join('');
  for (const L of layers) {
    if (L.union) { if (!L.rings.length) continue; const ids = L.rings.map(r => def(r.ring, r.smooth)); body += `<g class="${L.union}"><g class="u-stroke">${uses(ids)}</g><g class="u-fill">${uses(ids)}</g></g>`; }
    else if (L.lines) { if (L.segs.length) body += `<path class="${L.lines}" d="${L.segs.map(sg => 'M' + sg.map(M).map(pt).join('L')).join('')}"/>`; }
    else if (L.curves) { if (L.segs.length) body += `<path class="${L.curves}" d="${L.segs.map(([a, b, c]) => `M${pt(M(a))}Q${pt(M(b))} ${pt(M(c))}`).join('')}"/>`; }
    else if (L.poly) body += `<path class="${L.poly}" d="${polyD(L.ring.map(M))}"/>`;
    else if (L.path) body += `<path class="${L.path}" d="M${L.line.map(M).map(pt).join('L')}"/>`;
    else if (L.circle) { const c = M(L.c); body += `<circle class="${L.circle}" cx="${f(c[0])}" cy="${f(c[1])}" r="${f(L.r * k)}"/>`; }
    else if (L.plus) { const c = M(L.c), d = L.px; body += `<path class="${L.plus}" d="M${pt([c[0] - d, c[1]])}L${pt([c[0] + d, c[1]])}M${pt([c[0], c[1] - d])}L${pt([c[0], c[1] + d])}"/>`; }
    else if (L.load) { const m = L.load === 'm' ? ' m' : '', [a, b] = L.line.map(M); body += `<path class="h-load${m}" d="M${pt(a)}L${pt(b)}"/><path class="h-load-head${m}" d="${arrowHead(b, a, 6)}"/>`; }
    else if (L.contact) { const c = M(L.at); body += `<circle class="h-contact${L.contact === 'm' ? ' m' : ''}" cx="${f(c[0])}" cy="${f(c[1])}" r="${f(L.r ?? 2.5)}"/>`; }
    else if (L.joint) { const c = M(L.at); body += `<circle class="h-joint wrist" cx="${f(c[0])}" cy="${f(c[1])}" r="2.25"/>`; }
    else if (L.fit) continue;
    else throw new Error(`handPair layer: unknown ${JSON.stringify(Object.keys(L))}`);
  }
  return { defs, body };
}

/**
 * Right and Wrong in golden B's pair chrome, as view-common viewPair (358 wide, heads at y 29-60, panels from y 70, one
 * scale and one anchor for both halves). A half is { layers, anchor, report } in mm. Returns { svg, report }.
 */
export function handPair(spec) {
  const { uid, camera, right, wrong, alt = {}, width = 358 } = spec;
  if (!uid || !/^[a-z][a-z0-9-]*$/.test(uid)) throw new Error(`handPair: bad uid ${uid}`);
  if (!CAMERA_TEXT[camera]) throw new Error(`handPair: unknown camera ${camera}`);
  const gap = 16, pw = (width - gap) / 2, top = 70, ph = spec.panelHeight ?? 262, height = top + ph + 6, pad = 12;
  const rel = h => h.layers.flatMap(layerPts).map(p => sub(p, h.anchor));
  const b = bbox([...rel(right), ...rel(wrong)]);
  const k = Math.min((pw - 2 * pad) / (b[2] - b[0]), (ph - 2 * pad) / (b[3] - b[1]));
  const A = [pad - b[0] * k + ((pw - 2 * pad) - (b[2] - b[0]) * k) / 2, top + pad - b[1] * k + ((ph - 2 * pad) - (b[3] - b[1]) * k) / 2];
  const mapOf = (h, dx) => p => [A[0] + dx + (p[0] - h.anchor[0]) * k, A[1] + (p[1] - h.anchor[1]) * k];
  const dR = drawLayers(right.layers, mapOf(right, 0), k, `${uid}-r`), dW = drawLayers(wrong.layers, mapOf(wrong, pw + gap), k, `${uid}-w`);
  const camText = CAMERA_TEXT[camera];
  const head = (x, ok, note) => (ok ? iconCheck(x, 29, 18) : iconCross(x, 29, 18)) + `<text class="h-head" x="${f(x + 23)}" y="43">${ok ? 'Right' : 'Wrong'}</text>`
    + (note ? `<text class="h-note${ok ? '' : ' m'}" x="${f(x + 23)}" y="60">${esc(note.toUpperCase())}</text>` : '');
  const aria = `${camText}. Right: ${alt.right ?? ''} Wrong: ${alt.wrong ?? ''}`.trim();
  const svg = `<svg class="hand-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(aria)}" xmlns="http://www.w3.org/2000/svg">`
    + `<defs>${dots(uid)}${dR.defs.join('')}${dW.defs.join('')}</defs>`
    + `<rect width="${width}" height="${height}" fill="url(#${uid}-dots)"/>`
    + `<text class="h-cam" x="${f(width / 2)}" y="21" text-anchor="middle">${camText.toUpperCase()}</text>`
    + head(10, true, spec.rightNote) + head(pw + gap + 10, false, spec.wrongNote)
    + `<path class="h-divider" d="M${f(pw + gap / 2)} ${top - 4}V${height - 10}"/>`
    + `<g class="h-panel right">${dR.body}</g><g class="h-panel wrong">${dW.body}</g></svg>`;
  return { svg, report: { camera, scalePxPerMm: +k.toFixed(3), right: right.report, wrong: wrong.report } };
}

/** The engine's geometry for a hand of height H (scaled tables, radii), for views that pose the fingers themselves. */
export function baseGeometry(H = 1750, ext = 0) {
  const g = handGeometry({ wrist: { ext }, fingers: { curl: 0 }, thumb: 'beside' }, { H });
  return { g, s: g.s, HL: g.HL, mcpI: g.mcpI, palmar: g.palmar, fore: g.fore, e: ext, tsegs: g.tsegs };
}
