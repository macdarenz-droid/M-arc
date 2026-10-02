// LIB-12: shared drawing code for the non-radial hand views (palm-flat, cupped, front-rack, ball). Drawing code only:
// the id registry is LIB-7's hands/pairs.mjs, which finds the hand-<key>.mjs modules (D-LIB12-1).
//
// A view draws one half (Right or Wrong) as parts in mm on a screen frame (x right, y DOWN), then viewPair() fits both
// halves at ONE scale and puts them in golden B's pair chrome: dotted ground, camera label, check / cross heads with a
// note, a divider, then the two panels. Every class comes from golden-B HAND_CSS (engine/hand.mjs), so the theme
// colours the views as it colours the 8. Golden-B hand.mjs is imported, never edited.
import { HAND_CSS, HAND_OF_H, HAND_PROP } from '../../layers/engine/hand.mjs';
import { f, pt, spline } from '../../layers/engine/geom.mjs';

export { HAND_CSS, HAND_OF_H, HAND_PROP, f, pt, spline };
export const RAD = Math.PI / 180;
export const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
export const mul = (a, k) => [a[0] * k, a[1] * k];
export const len = a => Math.hypot(a[0], a[1]);
export const dir = deg => [Math.cos(deg * RAD), Math.sin(deg * RAD)];
export const rot = (p, deg, c = [0, 0]) => { const [x, y] = sub(p, c), cs = Math.cos(deg * RAD), sn = Math.sin(deg * RAD); return add(c, [x * cs - y * sn, x * sn + y * cs]); };
export const polyD = ps => 'M' + ps.map(pt).join('L') + 'Z';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/** Hand length (mm) for body height H (mm): golden-B HAND_OF_H, wrist crease to middle fingertip. */
export const handLength = (H = 1750) => HAND_OF_H * H;
/** Thickness scale: golden-B hand.mjs gives its thickness drawing values for HL 189 mm (hand.mjs:107). */
export const thickScale = HL => HL / 189;
// Finger segment radii (mm at HL 189): golden-B hand.mjs:115 tPP 9.8, tMP 8.6, tDP 7.4; little x .88, ring x .95.
export const FINGER_T = [9.8, 8.6, 7.4];
export const fingerScale = name => (name === 'little' ? 0.88 : name === 'ring' ? 0.95 : 1);
/** Segment lengths (mm) of a finger from golden-B HAND_PROP. */
export const fingerSegs = (name, HL) => HAND_PROP[name].seg.map((l, i) => ({ L: l * HL, t: FINGER_T[i] * thickScale(HL) * fingerScale(name) }));

/** Tapered capsule from P (radius r1) to Q (radius r2) as a point ring (same construction as hand.mjs capsule()). */
export function capsule(P, Q, r1, r2, n = 10) {
  const d = sub(Q, P), L = len(d) || 1e-6, u = mul(d, 1 / L), nrm = [-u[1], u[0]], ps = [];
  const ring = (C, r, a0, a1) => { for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; ps.push(add(C, add(mul(u, Math.cos(a) * r), mul(nrm, Math.sin(a) * r)))); } };
  ring(Q, r2, Math.PI / 2, -Math.PI / 2);
  ring(P, r1, -Math.PI / 2, -3 * Math.PI / 2);
  return ps;
}
/** Joint chain: from base along absolute screen angles (deg, y down) with the given segment lengths. */
export function chain(base, angles, segs) {
  const pts = [base];
  angles.forEach((a, i) => pts.push(add(pts[i], mul(dir(a), segs[i].L))));
  return pts;
}
/** Capsules of a chain (each segment tapers into the next one's radius, the tip to .85 of its own). */
export const chainCaps = (pts, segs) => pts.slice(0, -1).map((p, i) => capsule(p, pts[i + 1], segs[i].t, i === segs.length - 1 ? segs[i].t * 0.85 : segs[i + 1].t));

/** Arrow head (same construction as hand.mjs arrowHead). */
export const arrowHead = (tip, from, sz = 5) => { const L = Math.hypot(tip[0] - from[0], tip[1] - from[1]) || 1, t = [(tip[0] - from[0]) / L, (tip[1] - from[1]) / L], n = [-t[1], t[0]];
  return `M${pt([tip[0] - t[0] * sz + n[0] * sz * .62, tip[1] - t[1] * sz + n[1] * sz * .62])}L${pt(tip)}L${pt([tip[0] - t[0] * sz - n[0] * sz * .62, tip[1] - t[1] * sz - n[1] * sz * .62])}Z`; };

// ---------- one half: parts in mm ----------
// part kinds: { kind: 'skin' | 'far' | 'near', ring, straight? }  union outlines (h-skin, h-far; 'near' is a second
//                                               h-skin union on top); smoothed unless `straight`
//             { kind: 'eq' | 'eq-core' | 'eq-thin', ring | circle: [c, r] | line }   equipment
//             { kind: 'floor', line }                       ground line (h-eq-core, open path)
//             { kind: 'load' | 'load-m', line }             load arrow along line[0] -> line[1]
//             { kind: 'contact' | 'contact-m', at, r }      contact dot
//             { kind: 'mark', line }                        a --mistake line (gap, ridge)
//             { kind: 'datum' | 'datum-m', line }           thin dashed reference line
//             { kind: 'joint', at }                         the wrist joint dot
const PATH_CLS = { eq: 'h-eq', 'eq-core': 'h-eq-core', 'eq-thin': 'h-eq-thin', floor: 'h-eq-core', mark: 'h-mark', datum: 'h-datum', 'datum-m': 'h-datum m' };

/** Every point a half draws (for the fit), in mm. */
function partPts(p) {
  if (p.ring) return p.ring;
  if (p.line) return p.line;
  if (p.circle) { const [c, r] = p.circle; return [[c[0] - r, c[1] - r], [c[0] + r, c[1] + r]]; }
  if (p.at) return [p.at];
  return [];
}
const bbox = ps => ps.reduce((b, p) => [Math.min(b[0], p[0]), Math.min(b[1], p[1]), Math.max(b[2], p[0]), Math.max(b[3], p[1])], [Infinity, Infinity, -Infinity, -Infinity]);

/** Draw one half's parts with the map M (mm -> px). Returns the SVG body and its defs. */
function drawHalf(parts, M, k, uid) {
  const defs = [], groups = { far: [], skin: [], near: [] };
  let n = 0, eqBack = '', eqFront = '', over = '';
  const def = (ring, straight) => { const id = `${uid}-p${n++}`; defs.push(`<path id="${id}" d="${straight ? polyD(ring.map(M)) : spline(ring.map(M))}"/>`); return id; };
  const uses = ids => ids.map(i => `<use href="#${i}"/>`).join('');
  const union = (ids, cls) => (ids.length ? `<g class="${cls}"><g class="u-stroke">${uses(ids)}</g><g class="u-fill">${uses(ids)}</g></g>` : '');
  for (const p of parts) {
    if (p.kind in groups) { groups[p.kind].push(def(p.ring, p.straight)); continue; }
    const cls = PATH_CLS[p.kind];
    if (cls) {
      let el;
      if (p.circle) { const c = M(p.circle[0]); el = `<circle class="${cls}" cx="${f(c[0])}" cy="${f(c[1])}" r="${f(p.circle[1] * k)}"/>`; }
      else if (p.ring) el = `<path class="${cls}" d="${polyD(p.ring.map(M))}"/>`;
      else el = `<path class="${cls}" d="M${p.line.map(M).map(pt).join('L')}"/>`;
      if (p.kind === 'mark' || p.kind.startsWith('datum')) over += el; else if (p.back) eqBack += el; else eqFront += el;
      continue;
    }
    if (p.kind === 'load' || p.kind === 'load-m') {
      const m = p.kind === 'load-m' ? ' m' : '', [a, b] = p.line.map(M);
      over += `<path class="h-load${m}" d="M${pt(a)}L${pt(b)}"/><path class="h-load-head${m}" d="${arrowHead(b, a, 6)}"/>`;
    } else if (p.kind === 'contact' || p.kind === 'contact-m') {
      const c = M(p.at); over += `<circle class="h-contact${p.kind === 'contact-m' ? ' m' : ''}" cx="${f(c[0])}" cy="${f(c[1])}" r="${f(p.r ?? 2.5)}"/>`;
    } else if (p.kind === 'joint') {
      const c = M(p.at); over += `<circle class="h-joint wrist" cx="${f(c[0])}" cy="${f(c[1])}" r="2.25"/>`;
    } else throw new Error(`view part: unknown kind ${p.kind}`);
  }
  const body = eqBack + union(groups.far, 'h-far') + union(groups.skin, 'h-skin') + union(groups.near, 'h-skin') + eqFront + over;
  return { defs, body };
}

const iconCheck = (x, y, sz) => `<path class="h-icon ok" transform="translate(${f(x)} ${f(y)}) scale(${f(sz / 24)})" d="M5 12l4 4L19 7"/>`;
const iconCross = (x, y, sz) => `<path class="h-icon no" transform="translate(${f(x)} ${f(y)}) scale(${f(sz / 24)})" d="M6 6l12 12M18 6L6 18"/>`;
const dots = id => `<pattern id="${id}-dots" width="16" height="16" patternUnits="userSpaceOnUse"><rect x="7.5" y="7.5" width="1" height="1" class="dot"/></pattern>`;
export const CAMERA_TEXT = { side: 'Seen from the side', front: 'Seen from the front', above: 'Seen from above' };

/**
 * Right and Wrong side by side in golden B's pair chrome (hand.mjs renderHandPair layout: 358 wide, heads at y 29-60,
 * panels from y 70). spec: { uid, camera, right: half, wrong: half, rightNote, wrongNote, alt: { right, wrong },
 * panelHeight? }, where a half is { parts, report } in mm. Both halves share one scale and one anchor (each half's
 * `anchor`, mm), so the two compare directly. Returns { svg, report }.
 */
export function viewPair(spec) {
  const { uid, camera, right, wrong, alt = {}, width = 358 } = spec;
  if (!uid || !/^[a-z][a-z0-9-]*$/.test(uid)) throw new Error(`viewPair: bad uid ${uid}`);
  if (!CAMERA_TEXT[camera]) throw new Error(`viewPair: unknown camera ${camera}`);
  const gap = 16, pw = (width - gap) / 2, top = 70, ph = spec.panelHeight ?? 262, height = top + ph + 6, pad = 12;
  const rel = h => h.parts.flatMap(partPts).map(p => sub(p, h.anchor));
  const b = bbox([...rel(right), ...rel(wrong)]);
  const k = Math.min((pw - 2 * pad) / (b[2] - b[0]), (ph - 2 * pad) / (b[3] - b[1]));
  const A = [pad - b[0] * k + ((pw - 2 * pad) - (b[2] - b[0]) * k) / 2, top + pad - b[1] * k + ((ph - 2 * pad) - (b[3] - b[1]) * k) / 2];
  const mapOf = (h, dx) => p => [A[0] + dx + (p[0] - h.anchor[0]) * k, A[1] + (p[1] - h.anchor[1]) * k];
  const dR = drawHalf(right.parts, mapOf(right, 0), k, `${uid}-r`), dW = drawHalf(wrong.parts, mapOf(wrong, pw + gap), k, `${uid}-w`);
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

/** Throw unless `items` holds exactly `n` entries (every LIB-12 sweep goes through this, so an empty input is red). */
export function sweep(items, n, what) {
  const list = [...items];
  if (list.length === 0) throw new Error(`sweep ${what}: no items`);
  if (list.length !== n) throw new Error(`sweep ${what}: ${list.length} items, expected ${n}`);
  return list;
}

/**
 * Wrap a finger chain round a circle (the same solve as golden-B hand.mjs solveChain, which is not exported): from
 * `base`, starting at screen angle a0 (deg), each joint turns by sign x theta from 0 until the segment's capsule first
 * touches the circle, or to its limit. Returns { pts, touched: [bool per segment] }.
 */
export function wrapChain({ base, a0, segs, circle, sign, limits = [95, 110, 80] }) {
  const segDist = (p, a, b) => { const ab = sub(b, a), t = Math.max(0, Math.min(1, ((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1]) / ((ab[0] ** 2 + ab[1] ** 2) || 1))); return len(sub(p, add(a, mul(ab, t)))); };
  const pts = [base], touched = []; let a = a0, P = base;
  segs.forEach((q, i) => {
    let th = limits[i], hit = false;
    if (len(sub(P, circle.c)) >= circle.r + q.t) {
      for (let t = 0; t <= limits[i]; t += 0.5) { const E = add(P, mul(dir(a + sign * t), q.L)); if (segDist(circle.c, P, E) <= circle.r + q.t) { th = t; hit = true; break; } }
    } else th = 0;
    a += sign * th; touched.push(hit); P = add(P, mul(dir(a), q.L)); pts.push(P);
  });
  return { pts, touched };
}
/** Distance from point p to segment a-b. */
export const segDist = (p, a, b) => { const ab = sub(b, a), t = Math.max(0, Math.min(1, ((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1]) / ((ab[0] ** 2 + ab[1] ** 2) || 1))); return len(sub(p, add(a, mul(ab, t)))); };

/** A limb leaving the panel: from P (radius r1) toward Q for `L` mm (radius r2 there), ending in a break line. */
export function cutLimb(P, Q, r1, r2, L) {
  const d = sub(Q, P), u = mul(d, 1 / (len(d) || 1)), n = [-u[1], u[0]], C = add(P, mul(u, L));
  const at = (X, w) => add(X, mul(n, w)), M = add(P, mul(u, L * 0.5));
  return [at(P, -r1), at(M, -(r1 + r2) / 2), at(C, -r2), add(at(C, -r2 / 2), mul(u, 3)), at(C, 0), add(at(C, r2 / 2), mul(u, -3)), at(C, r2), at(M, (r1 + r2) / 2), at(P, r1)];
}
