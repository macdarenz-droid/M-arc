// LIB-PLATEFIX-4 machine_pullover (pf8 #405 6688665575, tile T11; R4 c1, c2, c3; R5 c1, c3; R11 c1, c2, c3). Measured from
// the engine's render, landmarks and body shapes at the render's camera, never from the spec's constants. Distances are
// in the critics' px: their panel tile draws the 358-px plate at 704 px, so 1 plate px = 704/358 tile px (TILE).
//  R4: the SHOULDERS AT PIVOT leader ends on the pivot hub drawn at the shoulder (within 4 px of its rim), and crosses
//      nothing: past its first 8 px it stays outside the solid figure, 6 px clear of the Trace and the machine, and
//      crosses no other leader (lb6-plates A15's rules).
//  R5: the back of the red head 25-30 px off the pad face; the red low back bowed >= 22 px forward of the solid back
//      (both the Mistake pose's torso and the drawn dashed back line); the seat on the seat.
// Red on the base spec (main = lane ef67e7d7): no hub drawn in front; the leader ends on the frame's drop, 213.5 px off
// the hub rim; the low back 15.6 px off the solid back, no dashed back line. The head was 25.8 px off the pad there already.
// After: the leader ends on the rim (0.00 px), 8.2 px clear; the head 27.5 px; the low back 25.0 px (drawn 24.8 px).
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, qaEng: any, body: any, eq: any, M: any, S: any;
beforeAll(async () => {
  [plate, qaEng, body, eq, M] = await Promise.all(['../vendor/engine/plate.mjs', 'qa/engine.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'specs/machine_pullover.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  S = M.default;
}, 600_000);

type V = number[];
const TILE = 704 / 358, HUB_R = 0.045;   // the composer's hub radius (eq/pulloverMachine.mjs hubR)
const segD = (p: V, a: V, b: V) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy, t = L2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)) : 0;
  return Math.hypot(p[0]! - a[0]! - dx * t, p[1]! - a[1]! - dy * t); };
const inPoly = (poly: V[], [x, y]: V) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!;
  if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
const xy = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
const segs = (p: V[]) => p.slice(1).map((q, i) => [p[i]!, q]);
const leadersOf = (svg: string) => [...svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)].map(([, d]) => { const p = xy(d!), h = /H(-?[\d.]+)$/.exec(d!); if (h) p.push([+h[1]!, p[p.length - 1]![1]!]); return p; });
const cross = (a: V, b: V, c: V, d: V) => { const o = (p: V, q: V, r: V) => Math.sign((q[0]! - p[0]!) * (r[1]! - p[1]!) - (q[1]! - p[1]!) * (r[0]! - p[0]!)); return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0; };

/** Everything the checks read, for one spec. */
const measure = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf4' }), rm = plate.renderPlate(spec, { id: 'pf4', mistake: true }), cam = qaEng.cameraOf(spec, r.report);
  const L = qaEng.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body }, spec), B = { height: 1.75 };
  const shapes = (pose: string) => body.bodyShapes(body.fk(L.q[pose], B), cam).filter((s: any) => s.poly);
  const pad = M.PM.pad, off = (y: number, z: number) => ((y - pad.point[1]) * pad.normal[1] + (z - pad.point[2]) * pad.normal[2]) * cam.pxm * TILE;   // tile px in front of the pad face
  // the back edge of a torso outline at world height y: its point nearest the pad face (tile px off the pad)
  const backAt = (t: V[], y: number) => { let m = Infinity; t.forEach((a, i) => { const b = t[(i + 1) % t.length]!, ya = -a[1]!, yb = -b[1]!;
    if ((ya - y) * (yb - y) > 0 || ya === yb) return; m = Math.min(m, off(y, a[0]! + (b[0]! - a[0]!) * (y - ya) / (yb - ya))); }); return m; };
  const probe = { view: 'side', facing: 'right', near: 'r', pxm: 1, P: (w: V) => [w[2]!, -w[1]!] };
  const world = (pose: string) => body.bodyShapes(body.fk(L.q[pose], B), probe);
  const tE = world('end').find((s: any) => s.key === 'torso').poly, tM = world('mistake').find((s: any) => s.key === 'torso').poly;
  const lmE = L.lm.end, ys = Array.from({ length: 201 }, (_, i) => lmE.sacrum[1] + (lmE.backUpper[1] - lmE.sacrum[1]) * i / 200);
  const bow = Math.max(...ys.map(y => backAt(tM, y) - backAt(tE, y)));
  const head = Math.min(...world('mistake').find((s: any) => s.key === 'head').poly.map(([z, my]: V) => off(-my!, z!)));
  // the drawn dashed back line (Mistake svg m-line paths), plate px -> world height and pad offset
  const toW = ([x, y]: V) => [(cam.y0 - y!) / cam.pxm, (x! - cam.x0) / cam.pxm];
  const drawnBow = Math.max(-Infinity, ...[...rm.svg.matchAll(/<path class="m-line" d="([^"]+)"/g)].flatMap(m => xy(m[1]!)).map(toW)
    .filter(([y]) => y! >= ys[0]! && y! <= ys[ys.length - 1]!).map(([y, z]) => off(y!, z!) - backAt(tE, y!)));
  // R4: the pivot leader (callouts in order; the leader's first point is its anchor)
  const i = spec.callouts.findIndex((c: any) => c.key === 'pivot'), Ls = leadersOf(r.svg), lead = Ls[i]!, hub = cam.P(M.PM.pivot), hubR = HUB_R * cam.pxm;
  const end = lead[0]!, rimOff = Math.abs(Math.hypot(end[0]! - hub[0]!, end[1]! - hub[1]!) - hubR) * TILE;
  const avoid: V[][] = [];
  for (const m of r.svg.matchAll(/<path class="(?:trace|eq-cable)[^"]*"[^>]*? d="([^"]+)"/g)) avoid.push(...segs(xy(m[1]!)));
  const ctx = { pose: 'end', start: L.lm.start, mistake: false, body: L.body };
  spec.equipment.forEach((e: any) => { for (const it of [].concat(typeof e === 'function' ? e(L.lm.end, ctx) ?? [] : e) as any[]) if (it && ['seat', 'backPad', 'line', 'poly'].includes(it.type))
    for (const p of eq.PRIMITIVES[it.type](it, cam)) { const pts = p.poly ?? p.line; if (pts) avoid.push(...segs([...pts, pts[0]])); } });
  const polys = shapes('end').map((s: any) => s.poly);
  let inside = 0, gap = Infinity;
  for (const [a, b] of segs(lead)) for (let k = 0; k <= 40; k++) { const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40];
    if (Math.hypot(q[0]! - end[0]!, q[1]! - end[1]!) < 8) continue;
    if (polys.some((p: V[]) => inPoly(p, q))) inside++;
    for (const g of avoid) gap = Math.min(gap, segD(q, g[0]!, g[1]!)); }
  const crossings = Ls.filter((o, j) => j !== i && segs(lead).some(([a, b]) => segs(o).some(([c, d]) => cross(a!, b!, c!, d!)))).length;
  const hubDrawn = spec.equipment.some((e: any) => typeof e === 'object' && e.type === 'line' && e.z === 'front' && e.pts.length > 12
    && e.pts.every((p: V) => Math.abs(Math.hypot(p[1]! - M.PM.pivot[1], p[2]! - M.PM.pivot[2]) - HUB_R) < 1e-9));
  return { r, rm, L, cam, bow, drawnBow, head, rimOff, inside, gap, crossings, hubDrawn, len: segs(lead).reduce((s, [a, b]) => s + Math.hypot(b![0]! - a![0]!, b![1]! - a![1]!), 0) };
};

describe('PF4 machine_pullover (pf8 T11): the pivot leader on the hub; the head and the low back off the pad', () => {
  let m: any;
  beforeAll(() => { m = measure(S);
    console.log(`PF4 machine_pullover: leader end ${m.rimOff.toFixed(2)} px off the hub rim, ${m.len.toFixed(1)} plate px long, inside ${m.inside}, gap ${m.gap.toFixed(2)} plate px, crossings ${m.crossings}; head ${m.head.toFixed(1)} px off the pad; low back ${m.bow.toFixed(1)} px (drawn ${m.drawnBow.toFixed(1)}) off the solid back`); }, 600_000);
  it('R4: the hub is drawn in front of the figure at the pivot, and the SHOULDERS AT PIVOT leader ends on its rim (within 4 px)', () => {
    expect(m.hubDrawn).toBe(true);
    expect(m.rimOff).toBeLessThanOrEqual(4);
  });
  it('R4: the leader crosses nothing: past its first 8 px outside the solid figure, 6 px clear of the Trace and the machine, across no other leader', () => {
    expect(m.inside).toBe(0);
    expect(m.gap).toBeGreaterThanOrEqual(6);
    expect(m.crossings).toBe(0);
  });
  it('R5: the back of the red head is 25-30 px off the pad face', () => {
    expect(m.head).toBeGreaterThanOrEqual(25);
    expect(m.head).toBeLessThanOrEqual(30);
  });
  it('R5: the red low back bows >= 22 px forward of the solid back (the Mistake torso and the drawn dashed back line)', () => {
    expect(m.bow).toBeGreaterThanOrEqual(22);
    expect(m.drawnBow).toBeGreaterThanOrEqual(22);
  });
  it('R5: the hip stays on the seat (the Mistake seat landmark at the end pose\'s seat height, within 0.5 cm)', () => {
    expect(Math.abs(m.L.lm.mistake.seat[1] - m.L.lm.end.seat[1]) * 100).toBeLessThanOrEqual(0.5);
  });
  it('mutation: the bowed pose without its root drop (the seat lifted off the seat) is red', () => {
    const P = S.mistake.pose, up = { ...P, root: S.poses.end.root };
    expect(Math.abs(measure({ ...S, mistake: { ...S.mistake, pose: up } }).L.lm.mistake.seat[1] - m.L.lm.end.seat[1]) * 100).toBeGreaterThan(0.5);
  });
  it('mutations: the leader back on the frame drop is red; the hub anchor with the old Trace trim (10 px) runs into the Trace', () => {
    const drop = { ...S, callouts: S.callouts.map((c: any) => (c.key === 'pivot' ? { ...c, anchor: [0, 1.84, M.PM.pivot[2] + 0.03], box: { left: 214, top: 24 } } : c)) };
    expect(measure(drop).rimOff).toBeGreaterThan(4);
    expect(measure({ ...S, trace: { ...S.trace, trim: [10, 12] } }).gap).toBeLessThan(6);
  });
  it('mutations: the leader from the hub centre runs inside the figure; the hub left out is red; the old box (214, 24) crosses the PUSH WITH ELBOWS leader', () => {
    const centre = measure({ ...S, callouts: S.callouts.map((c: any) => (c.key === 'pivot' ? { ...c, anchor: M.PM.pivot } : c)) });
    expect(centre.inside).toBeGreaterThan(0);
    expect(measure({ ...S, equipment: S.equipment.filter((e: any) => !(typeof e === 'object' && e.type === 'line' && e.z === 'front')) }).hubDrawn).toBe(false);
    expect(measure({ ...S, callouts: S.callouts.map((c: any) => (c.key === 'pivot' ? { ...c, box: { left: 214, top: 24 } } : c)) }).crossings).toBeGreaterThan(0);
  });
  it('mutations: the neck kept at the start\'s (head on the pad) and the bow halved are red', () => {
    const P = S.mistake.pose;
    expect(measure({ ...S, mistake: { ...S.mistake, pose: { ...P, neck: S.poses.end.neck } } }).head).toBeLessThan(25);
    expect(measure({ ...S, mistake: { ...S.mistake, pose: { ...P, neck: P.neck + 10 } } }).head).toBeGreaterThan(30);
    const half = measure({ ...S, mistake: { ...S.mistake, pose: { ...P, trunk: { ...P.trunk, bow: P.trunk.bow / 2 } } } });
    expect(half.bow).toBeLessThan(22);
  });
  it('mutation: the dashed back line dropped (the bow drawn only by the masked outline) is red', () => {
    expect(measure({ ...S, mistake: { ...S.mistake, guides: [] } }).drawnBow).toBeLessThan(22);
  });
});
