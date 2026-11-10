// LIB-PLATEFIX-4 high_to_low_cable_fly (pf8 #405 6688665575, tile T03; R5 c2, c3; R4 c1, c2). Measured from the
// engine's render, landmarks and body shapes at the render's camera, never from the spec's constants. Distances are in
// the critics' px: their panel tile draws the 358-px plate at 704 px, so 1 plate px = 704/358 tile px (TILE).
//  R5: each red forearm is one dashed line from its own drawn elbow (the end pose's) to its red fist, at the plate's
//      forearm length (c2 about 76 px; 70-82 here) to the Mistake grip; the two cross as an X
//      below the solid fists; each red fist >= 10 px clear of both solid fists; no red capsule outlines.
//  R4: SOFT ELBOWS has its own leader ending on the drawn elbow (within 4 px), sharing no stretch with TRUNK UPRIGHT's
//      (>= 6 px apart, no crossing), and outside the figure past its first 8 px.
// Red on the base spec (main = lane ef67e7d7): 6 red dashed paths (4 capsules, 2 rings, no forearm line), the red fists
// 0.2 px clear of the solid ones; the SOFT ELBOWS leader ends on the start elbow (the faint start arm), 181 px off the
// drawn one. (Its shared stub with TRUNK UPRIGHT is pf8's d8cd3ac7 drawing, box 164, 80: a mutation below.)
// After: 2 forearm lines of 76.1 px crossing at (179.0, 205.7), under the solid fists' bottom (195.0); the red fists
// 21.6 px clear; SOFT ELBOWS 0.01 px off the drawn elbow, 28.2 plate px from TRUNK UPRIGHT's leader.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, qaEng: any, body: any, eq: any, S: any;
beforeAll(async () => {
  [plate, qaEng, body, eq, S] = await Promise.all(['../vendor/engine/plate.mjs', 'qa/engine.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'specs/high_to_low_cable_fly.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  S = S.default;
}, 600_000);

type V = number[];
const TILE = 704 / 358;
const segD = (p: V, a: V, b: V) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy, t = L2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)) : 0;
  return Math.hypot(p[0]! - a[0]! - dx * t, p[1]! - a[1]! - dy * t); };
const inPoly = (poly: V[], [x, y]: V) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!;
  if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
const xy = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
const segs = (p: V[]) => p.slice(1).map((q, i) => [p[i]!, q]);
const leadersOf = (svg: string) => [...svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)].map(([, d]) => { const p = xy(d!), h = /H(-?[\d.]+)$/.exec(d!); if (h) p.push([+h[1]!, p[p.length - 1]![1]!]); return p; });
const hit = (a: V, b: V, c: V, d: V): V | null => { const r = [b[0]! - a[0]!, b[1]! - a[1]!], s = [d[0]! - c[0]!, d[1]! - c[1]!], den = r[0]! * s[1]! - r[1]! * s[0]!;
  if (!den) return null; const t = ((c[0]! - a[0]!) * s[1]! - (c[1]! - a[1]!) * s[0]!) / den, u = ((c[0]! - a[0]!) * r[1]! - (c[1]! - a[1]!) * r[0]!) / den;
  return t > 0 && t < 1 && u > 0 && u < 1 ? [a[0]! + t * r[0]!, a[1]! + t * r[1]!] : null; };
const polyDist = (A: V[], B: V[]) => Math.min(...A.flatMap(p => B.map((q, i) => segD(p, q, B[(i + 1) % B.length]!))), ...B.flatMap(p => A.map((q, i) => segD(p, q, A[(i + 1) % A.length]!))));
const lineDist = (P: V[], Q: V[]) => Math.min(...segs(P).flatMap(([a, b]) => segs(Q).flatMap(([c, d]) => [segD(a!, c!, d!), segD(b!, c!, d!), segD(c!, a!, b!), segD(d!, a!, b!)])));

/** Everything the checks read, for one spec. */
const measure = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf4' }), rm = plate.renderPlate(spec, { id: 'pf4', mistake: true }), cam = qaEng.cameraOf(spec, r.report);
  const L = qaEng.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body }, spec), B = { height: 1.75 };
  const shapes = (pose: string) => body.bodyShapes(body.fk(L.q[pose], B), cam).filter((s: any) => s.poly);
  const P = (pose: string, k: string): V => cam.P(L.lm[pose][k]);
  const red = [...rm.svg.matchAll(/<path class="m-line" d="([^"]+)"/g)].map(m => xy(m[1]!));
  const elbows = ['r', 'l'].map(sd => P('end', `elbow.${sd}`));
  // a forearm line: a 2-point dashed path from a drawn elbow (within 0.5 px)
  const fore = elbows.map(e => red.find(p => p.length === 2 && Math.hypot(p[0]![0]! - e[0]!, p[0]![1]! - e[1]!) <= 0.5) ?? null);
  const fistsE = shapes('end').filter((s: any) => /^fist\./.test(s.key)).map((s: any) => s.poly);
  const fistsM = shapes('mistake').filter((s: any) => /^fist\./.test(s.key)).map((s: any) => s.poly);
  const rings = red.filter(p => p.length > 8 && Math.hypot(p[0]![0]! - p[p.length - 1]![0]!, p[0]![1]! - p[p.length - 1]![1]!) < 0.5);
  const X = fore.every(Boolean) ? hit(fore[0]![0]!, fore[0]![1]!, fore[1]![0]!, fore[1]![1]!) : null;
  const fistBottom = Math.max(...fistsE.flat().map((p: V) => p[1]!));
  // each line's far end on the Mistake grip (the red fist), plate px
  const len3 = fore.map((p, i) => (p ? Math.hypot(...[0, 1].map(j => p[1]![j]! - P('mistake', `grip.${['r', 'l'][i]}`)[j]!)) : Infinity));
  const fistClear = Math.min(...[...fistsM, ...rings].map(m => Math.min(...fistsE.map((e: V[]) => polyDist(m, e))))) * TILE;
  // R4
  const Ls = leadersOf(r.svg), iE = spec.callouts.findIndex((c: any) => c.key === 'elbows'), iU = spec.callouts.findIndex((c: any) => c.key === 'upright');
  const lead = Ls[iE]!, polys = shapes('end').map((s: any) => s.poly);
  let inside = 0;
  for (const [a, b] of segs(lead)) for (let k = 0; k <= 40; k++) { const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40];
    if (Math.hypot(q[0]! - lead[0]![0]!, q[1]! - lead[0]![1]!) >= 8 && polys.some((p: V[]) => inPoly(p, q))) inside++; }
  return { red, fore, rings, X, fistBottom, len3, fistClear, lens: fore.map(p => (p ? Math.hypot(p[1]![0]! - p[0]![0]!, p[1]![1]! - p[0]![1]!) * TILE : NaN)),
    elbowEnd: Math.hypot(lead[0]![0]! - elbows[0]![0]!, lead[0]![1]! - elbows[0]![1]!) * TILE, apart: lineDist(lead, Ls[iU]!), inside };
};

describe('PF4 high_to_low_cable_fly (pf8 T03): the crossed forearms as one X under the fists; SOFT ELBOWS on its own leader', () => {
  let m: any;
  beforeAll(() => { m = measure(S);
    console.log(`PF4 high_to_low: ${m.red.length} red dashed paths, forearm lines ${m.fore.filter(Boolean).length} (${m.lens.map((v: number) => v.toFixed(1))} px), X at ${m.X?.map((v: number) => v.toFixed(1))} (solid fists' bottom ${m.fistBottom.toFixed(1)}), red fists ${m.fistClear.toFixed(1)} px clear; SOFT ELBOWS leader ${m.elbowEnd.toFixed(2)} px off the drawn elbow, ${m.apart.toFixed(1)} plate px from TRUNK UPRIGHT's`); }, 600_000);
  it('R5: each red forearm is one dashed line from its own drawn elbow; the other red paths are the two fist rings (no capsules)', () => {
    expect(m.fore.every(Boolean)).toBe(true);
    expect(m.rings.length).toBe(2);
    expect(m.red.length).toBe(4);
  });
  it('R5: each red forearm is the plate\'s forearm length: 70-82 px drawn (c2 about 76), from the drawn elbow to the Mistake grip', () => {
    for (const v of m.lens) { expect(v).toBeGreaterThanOrEqual(70); expect(v).toBeLessThanOrEqual(82); }
    for (const v of m.len3) expect(v).toBeLessThanOrEqual(0.5);
  });
  it('mutations: forearm lines stopped half-way (38 px) or run past the grip (+40%), and lines to points 25 cm above the red fists (an X over the fists), are red', () => {
    const lmM = qaEng.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body }, S).lm;
    const lines = (f: (e: V, g: V) => V) => ({ ...S, mistake: { ...S.mistake, guides: [...['l', 'r'].map(sd => ({ kind: 'dashed', pts: [lmM.end[`elbow.${sd}`], f(lmM.end[`elbow.${sd}`], lmM.mistake[`grip.${sd}`])] })), ...S.mistake.guides.slice(2)] } });
    expect(measure(lines((e, g) => e.map((v, i) => v + (g[i]! - v) * 0.5))).lens.every((v: number) => v < 70)).toBe(true);
    expect(measure(lines((e, g) => e.map((v, i) => v + (g[i]! - v) * 1.4))).lens.every((v: number) => v > 82)).toBe(true);
    const up = measure(lines((e, g) => [g[0]!, g[1]! + 0.25, g[2]!]));
    expect(up.X).not.toBeNull();
    expect(up.X![1]).toBeLessThanOrEqual(up.fistBottom);
  });
  it('R5: the two forearm lines cross as an X below the solid fists', () => {
    expect(m.X).not.toBeNull();
    expect(m.X[1]).toBeGreaterThan(m.fistBottom);
  });
  it('R5: each red fist (the Mistake fist outline and its ring) is >= 10 px clear of both solid fists', () => {
    expect(m.fistClear).toBeGreaterThanOrEqual(10);
  });
  it('R4: SOFT ELBOWS ends on the drawn elbow (within 4 px), >= 6 plate px from TRUNK UPRIGHT\'s leader along its whole length (no shared stub), outside the figure past its first 8 px', () => {
    expect(m.elbowEnd).toBeLessThanOrEqual(4);
    expect(m.apart).toBeGreaterThanOrEqual(6);
    expect(m.inside).toBe(0);
  });
  it('mutations: the forearms drawn as the base capsules, and the red fists at the base\'s crossed grips (over the solid fists), are red', () => {
    const cap = (a: V, b: V, r: number, n = 8) => { const au = Math.atan2(b[1]! - a[1]!, b[0]! - a[0]!), pts: V[] = [];
      for (let i = 0; i <= n; i++) { const t = au + Math.PI / 2 - Math.PI * i / n; pts.push([b[0]! + r * Math.cos(t), b[1]! + r * Math.sin(t), b[2]!]); }
      for (let i = 0; i <= n; i++) { const t = au - Math.PI / 2 - Math.PI * i / n; pts.push([a[0]! + r * Math.cos(t), a[1]! + r * Math.sin(t), b[2]!]); }
      return [...pts, pts[0]!]; };
    const lmM = qaEng.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body }, S).lm.mistake;
    const guides = [...['l', 'r'].map(sd => ({ kind: 'dashed', pts: cap(lmM[`elbow.${sd}`], lmM[`grip.${sd}`], 0.036) })), ...S.mistake.guides.slice(2)];
    expect(measure({ ...S, mistake: { ...S.mistake, guides } }).fore.some((f: any) => !f)).toBe(true);
    // the base Mistake grips (MIS_CROSS 0.11 past the midline on the arm sphere, the right hand 6 cm above the left)
    const base = { r: [0.11, 1.226316746765115, 0.5401334654567461], l: [-0.11, 1.166316746765115, 0.5178746571384951] }, pole = [-0.7349680356563135, -0.6719601679807562, 0.09105777951813841];
    const reach = { r: { at: base.r, pole }, l: { at: base.l, pole: [-pole[0]!, pole[1], pole[2]] } };
    expect(measure({ ...S, mistake: { ...S.mistake, pose: { reach } } }).fistClear).toBeLessThan(10);
  });
  it('mutations: SOFT ELBOWS back on the start elbow with the base box (252, 168) ends off the drawn elbow; with the pf8 box (164, 80, d8cd3ac7) it shares TRUNK UPRIGHT\'s stub', () => {
    const at = (box: any) => measure({ ...S, callouts: S.callouts.map((c: any) => (c.key === 'elbows' ? { ...c, anchor: { at: 'elbow.l', pose: 'start', off: [0, 5] }, box } : c)) });
    expect(at({ left: 252, top: 168 }).elbowEnd).toBeGreaterThan(4);
    expect(at({ left: 164, top: 80 }).apart).toBeLessThan(6);
    const across = measure({ ...S, callouts: S.callouts.map((c: any) => (c.key === 'elbows' ? { ...c, box: { left: 240, top: 214 } } : c)) });
    expect(across.inside).toBeGreaterThan(0);   // its box right of the body: the leader runs across the torso
  });
});
