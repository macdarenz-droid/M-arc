// LIB-PLATEFIX-4 dumbbell_fly, fix round after the pf12 plates panel (#410 6751563503: R1 [2,3,1], R2 [2,3,2], R3 [3,3,2],
// R5 [2,3,3], R7 [3,3,3]): "The foot-end view reads as a standing or seated figure. Fix: delete the upright rectangle
// behind the head; draw the flat pad end-on as a low band under the torso; keep each in-plane segment at its drawn length;
// put the start ghosts straight above the shoulders on the same arm length. Draw every dumbbell end-on as a hex (about
// 35 px, as in dumbbell_bench_press), centred on the grip. In the wrist zoom, bend the red hand about 30 deg off the
// forearm at the wrist, not the dumbbell." Kept from the previous round (#395 6655186998, 6653868933): one red dashed
// hand-plus-dumbbell outline per hand and one in the zoom, at k x the plate's.
// Units: the panel's px are the 716 px screenshot's, 2 x the plate's svg px (#410 6751563503 names the hip joint at
// (298,595) on a 358 svg; dumbbell_bench_press's hex is 17.4 svg px = 34.8 panel px, "about 35 px"). Every threshold
// below is in panel px (PX = 2 x svg).
// Measured at the render camera from the engine's landmarks and the rendered svg: the bench's `eq` paths, the arm
// segments shoulder->elbow and elbow->wrist of the start arms (both), the one ghost (arm.r, t 0.5) and the end arms
// (both), every drawn dumbbell (the `disc` paths: the end ones and the ghost's; the dashed start rings; the red ones in
// the Mistake), and the Mistake zoom's red outline against the forearm's landmarks mapped into the zoom.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const PX = 2;   // panel px per svg px
let plate: any, body: any, equip: any, qe: any, Z: any, golden: any, build: any, S: any;
beforeAll(async () => {
  [plate, body, equip, qe, Z, golden, build] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs',
    'qa/engine.mjs', 'zoom/inline.mjs', '../golden.mjs', 'pilot-a3/build.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  S = (await import(/* @vite-ignore */ lib('specs/dumbbell_fly.mjs'))).default;
}, T);

type V = number[];
const dist = (a: V, b: V) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);
const ptsOf = (d: string): V[] => { const n = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map(m => +m[0]), o: V[] = []; for (let k = 0; k + 1 < n.length; k += 2) o.push([n[k]!, n[k + 1]!]); return o; };
const paths = (svg: string, cls: string) => [...svg.matchAll(new RegExp(`<path class="${cls}" d="([^"]+)"`, 'g'))].map(m => ptsOf(m[1]!));
const uniq = (p: V[]) => p.filter((q, i) => p.findIndex(r => dist(q, r) < 1e-3) === i);
const deg = (a: number) => a * 180 / Math.PI;
const mod60 = (a: number) => ((a % 60) + 60) % 60;
const angDiff60 = (a: number, b: number) => { const d = Math.abs(mod60(a) - mod60(b)); return Math.min(d, 60 - d); };
/** A drawn hex from its points: the 6 distinct corners, their centre, across-corners (panel px), the corner angle mod 60 (deg). */
const hexOf = (p: V[]) => {
  const c6 = uniq(p);
  if (c6.length !== 6) return null;
  const c = [c6.reduce((t, q) => t + q[0]!, 0) / 6, c6.reduce((t, q) => t + q[1]!, 0) / 6], r = c6.map(q => dist(q, c));
  const rm = r.reduce((t, x) => t + x, 0) / 6, regular = Math.max(...r) - Math.min(...r) < 0.05 && c6.every((q, i) => Math.abs(dist(q, c6[(i + 1) % 6]!) - rm) < 0.05);
  return regular ? { c, across: 2 * rm * PX, rot: mod60(deg(Math.atan2(c6[0]![1]! - c[1]!, c6[0]![0]! - c[0]!))) } : null;
};
/** The red Mistake drawing: the dashed guides (`m-line`: the bent hands) and the masked Mistake outline's uses (the hexes). */
const redOf = (svg: string) => {
  const D = new Map([...svg.matchAll(/<path id="([^"]+)" d="([^"]+)"/g)].map(m => [m[1]!, m[2]!])), i = svg.indexOf('<g class="m-pose"'), j = svg.indexOf('</g></g>', i);
  return { hands: paths(svg, 'm-line'), hexes: i < 0 ? [] : [...svg.slice(i, j).matchAll(/<use href="#([^"]+)"/g)].map(m => ptsOf(D.get(m[1]!) ?? '')) };
};
/** A bent hand guide [w+n, g+n, g-n, w-n, w+n]: its grip end (the middle of the two corners farthest from the wrist W). */
const handEnd = (p: V[], W: V) => { const c = uniq(p).sort((a, b) => dist(b, W) - dist(a, W)).slice(0, 2); return [(c[0]![0]! + c[1]![0]!) / 2, (c[0]![1]! + c[1]![1]!) / 2]; };

/** Everything the checks read. */
const measure = (spec: any) => {
  const rN = plate.renderPlate(spec, { id: 'pf4n' }), rM = plate.renderPlate(spec, { id: 'pf4m', mistake: true }), cam = qe.cameraOf(spec, rN.report);
  const L = qe.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: equip.PRIMITIVES, body }, spec);
  const B = { height: spec.body?.height ?? 1.75 }, keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map((p: any) => body.normPose(p, B));
  const nG = spec.ghosts?.count ?? 3, ghosts = Array.from({ length: nG }, (_, i) => body.landmarks(body.fk(body.poseAt(keys, (i + 1) / (nG + 1), B).q, B)));
  const P = (w: V) => cam.P(w) as V, lm = { start: L.lm.start, end: L.lm.end };
  const seg = (l: any, s: string) => ({ up: dist(P(l[`shoulder.${s}`]), P(l[`elbow.${s}`])) * PX, fore: dist(P(l[`elbow.${s}`]), P(l[`wrist.${s}`])) * PX });
  const arms = [...['l', 'r'].map(s => ({ who: `start ${s}`, s, ...seg(lm.start, s) })), ...ghosts.map((g: any, i: number) => ({ who: `ghost ${i} r`, s: 'r', ...seg(g, 'r') })),
    ...['l', 'r'].map(s => ({ who: `end ${s}`, s, ...seg(lm.end, s) }))];
  const startGrips = ['l', 'r'].map(s => ({ s, dx: (P(lm.start[`grip.${s}`])[0]! - P(lm.start[`shoulder.${s}`])[0]!) * PX, above: P(lm.start[`grip.${s}`])[1]! < P(lm.start[`shoulder.${s}`])[1]!,
    reach: dist(P(lm.start[`shoulder.${s}`]), P(lm.start[`grip.${s}`])) * PX, endReach: dist(P(lm.end[`shoulder.${s}`]), P(lm.end[`grip.${s}`])) * PX }));
  // bench: every `eq` path (uprights, feet, pad); the shoulders' and hips' screen y; the body midline
  const eq = paths(rN.svg, 'eq'), shY = Math.min(...['l', 'r'].map(s => P(lm.end[`shoulder.${s}`])[1]!)), hipY = Math.max(...['l', 'r'].map(s => P(lm.end[`hip.${s}`])[1]!));
  const shX = ['l', 'r'].map(s => P(lm.end[`shoulder.${s}`])[0]!), midX = P([0, 0, 0])[0]!;
  const box = (p: V[]) => ({ x0: Math.min(...p.map(q => q[0]!)), x1: Math.max(...p.map(q => q[0]!)), y0: Math.min(...p.map(q => q[1]!)), y1: Math.max(...p.map(q => q[1]!)), n: uniq(p).length });
  // dumbbells: the drawn `disc` paths (end and ghost), the dashed start rings, each with the grip it belongs to
  const grips = [...['l', 'r'].map(s => ({ who: `end ${s}`, g: P(lm.end[`grip.${s}`]) })), ...ghosts.map((g: any, i: number) => ({ who: `ghost ${i} r`, g: P(g['grip.r']) })),
    ...['l', 'r'].map(s => ({ who: `start ${s}`, g: P(lm.start[`grip.${s}`]) }))];
  // the ghost layers draw their equipment as `<use>` of defs: the dumbbell defs with 6 or more points (the core circle has fewer)
  const defs = new Map([...rN.svg.matchAll(/<path id="([^"]+)" d="([^"]+)"/g)].map(x => [x[1]!, x[2]!]));
  const ghostDb = [...new Set([...rN.svg.matchAll(/<g class="ghost"[\s\S]*?(?=<g class="ghost"|<g class="pose-end")/g)]
    .flatMap(g => [...g[0].matchAll(/<use href="#([^"]+dumbbell[^"]*)"/g)].map(u => u[1]!)))].map(id => ptsOf(defs.get(id) ?? '')).filter(p => p.length >= 6);
  const discs = [...paths(rN.svg, 'disc'), ...ghostDb], rings = paths(rN.svg, 'eq-line m-line');
  const dumbbells = [...discs, ...rings].map(p => { const h = hexOf(p), b = box(p), c = [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2];
    const near = grips.reduce((x, y) => (dist(y.g, c) < dist(x.g, c) ? y : x)); return { who: near.who, hex: h, off: h ? dist(h.c, near.g) * PX : Infinity }; });
  // Mistake: per hand region (22 px round the end grip) the red hand guides and red hexes; the same in the zoom circle,
  // with the solid hex and the forearm mapped into it (zoom point = C + k (plate point - source centre))
  const red = redOf(rM.svg), hands = ['l', 'r'].map(s => { const G = P(lm.end[`grip.${s}`]), near = (p: V[]) => p.some(q => dist(q, G) <= 22);
    return { s, G, W: P(lm.end[`wrist.${s}`]), E: P(lm.end[`elbow.${s}`]), hands: red.hands.filter(near), hexes: red.hexes.filter(near) }; });
  const z = Z.zoomOf(spec, { prefix: 'pf4' }), C = (z.svg.match(/data-c="(-?[\d.]+) (-?[\d.]+)"/) ?? []).slice(1).map(Number), F = (z.svg.match(/data-src="(-?[\d.]+) (-?[\d.]+)"/) ?? []).slice(1).map(Number);
  const zmap = (p: V) => [C[0]! + z.k * (p[0]! - F[0]!), C[1]! + z.k * (p[1]! - F[1]!)];
  const zred = redOf(z.svg), inZ = (p: V[]) => p.some(q => dist(q, C) <= 52), side = hands.reduce((a, b) => (dist(b.G, F) < dist(a.G, F) ? b : a));
  const zDisc = paths(z.svg, 'disc').map(hexOf).filter(Boolean).find((h: any) => dist(h.c, zmap(side.G)) < 2) as any;
  return { arms, startGrips, eq: eq.map(box), shY, hipY, shX, midX, pitch: cam.pitch, pxm: cam.pxm, dumbbells, hands,
    zoom: { k: z.k, hands: zred.hands.filter(inZ), hexes: zred.hexes.filter(inZ), W: zmap(side.W), E: zmap(side.E), G: zmap(side.G), solidRot: zDisc?.rot ?? NaN, s: side.s } };
};

/** One red hand and its hex against the forearm E -> W (any scale k; px out at plate scale): the bend off the forearm (deg),
 *  the hex's turn against the solid hex (deg mod 60), its centre's offset from the hand's grip end, its size, the drop. */
const bent = (hand: V[], hexPts: V[], E: V, W: V, solidRot: number, k: number) => {
  if (uniq(hand).length < 2) return { hex: false, bend: NaN, drop: NaN, turn: NaN, off: NaN, across: NaN };
  const h = hexOf(hexPts), g = handEnd(hand, W), f = Math.atan2(W[1]! - E[1]!, W[0]! - E[0]!), a = Math.atan2(g[1]! - W[1]!, g[0]! - W[0]!);
  let b = Math.abs(deg(a - f)); if (b > 180) b = 360 - b;
  return { hex: !!h, bend: b, drop: g[1]! - W[1]!, turn: h ? angDiff60(h.rot, solidRot) : NaN, off: h ? dist(h.c, g) / k * PX : NaN, across: h ? h.across / k : NaN };
};
const zoomPiece = (m: any) => bent(m.zoom.hands[0] ?? [], m.zoom.hexes[0] ?? [], m.zoom.E, m.zoom.W, m.zoom.solidRot, m.zoom.k);

const problems = (m: any) => {
  const bad: string[] = [];
  // 1. no upright rectangle behind the head: no bench path reaches above the shoulders
  for (const b of m.eq) if (b.y0 < m.shY) bad.push(`bench: a ${((b.x1 - b.x0) * PX).toFixed(1)} x ${((b.y1 - b.y0) * PX).toFixed(1)} px shape reaches ${((m.shY - b.y0) * PX).toFixed(1)} px above the shoulders`);
  // 2. the pad end-on: one low band (4 corners, 12-20 px high, at least 4x as wide), centred on the midline +-1 px,
  //    between the shoulder joints, below the hip joints (under the torso)
  const bands = m.eq.filter((b: any) => b.n === 4 && (b.x1 - b.x0) >= 4 * (b.y1 - b.y0) && (b.y1 - b.y0) * PX >= 12 && (b.y1 - b.y0) * PX <= 20
    && Math.abs((b.x0 + b.x1) / 2 - m.midX) * PX <= 1 && b.x0 >= Math.min(...m.shX) && b.x1 <= Math.max(...m.shX) && b.y0 > m.hipY);
  if (bands.length !== 1) bad.push(`pad: ${bands.length} low end-on bands under the torso`);
  // 3. each arm segment at its drawn length: every start and ghost segment within 1 px of the end arm's
  for (const a of m.arms.filter((x: any) => !x.who.startsWith('end'))) {
    const e = m.arms.find((x: any) => x.who === `end ${a.s}`);
    for (const k of ['up', 'fore']) if (Math.abs(a[k] - e[k]) > 1) bad.push(`${a.who} ${k}: ${a[k].toFixed(2)} px, end ${e[k].toFixed(2)} px`);
  }
  // 4. the start grips straight above the shoulders (+-3 px) on the same arm length (shoulder to grip within 1 px of the end's)
  for (const g of m.startGrips) {
    if (!(g.above && Math.abs(g.dx) <= 3)) bad.push(`start ${g.s}: grip ${g.dx.toFixed(2)} px off the shoulder's vertical`);
    if (Math.abs(g.reach - g.endReach) > 1) bad.push(`start ${g.s}: reach ${g.reach.toFixed(2)} px, end ${g.endReach.toFixed(2)} px`);
  }
  // 5. every dumbbell an end-on hex 32-38 px across, centred on its grip +-1.5 px: 2 end, the ghost's, 2 start rings
  const want = ['end l', 'end r', ...m.arms.filter((a: any) => a.who.startsWith('ghost')).map((a: any) => a.who), 'start l', 'start r'];
  for (const w of want) {
    const ds = m.dumbbells.filter((d: any) => d.who === w);
    if (ds.length !== 1) { bad.push(`${w}: ${ds.length} dumbbell drawings`); continue; }
    const d = ds[0];
    if (!d.hex) bad.push(`${w}: dumbbell not a hex`);
    else {
      if (!(d.hex.across >= 32 && d.hex.across <= 38)) bad.push(`${w}: hex ${d.hex.across.toFixed(2)} px across`);
      if (d.off > 1.5) bad.push(`${w}: hex ${d.off.toFixed(2)} px off its grip`);
    }
  }
  if (m.dumbbells.length !== want.length) bad.push(`${m.dumbbells.length} dumbbell drawings, not ${want.length}`);
  // 6. the Mistake: per hand one red bent hand and one red hex; in the zoom one each
  for (const h of m.hands) {
    if (h.hands.length !== 1 || h.hexes.length !== 1) { bad.push(`${h.s}: ${h.hands.length} red hands and ${h.hexes.length} red hexes in the hand region`); continue; }
    const x = bent(h.hands[0], h.hexes[0], h.E, h.W, 0, 1);
    if (!x.hex) bad.push(`${h.s}: red dumbbell not a hex`);
    else {
      if (!(x.across >= 32 && x.across <= 38)) bad.push(`${h.s}: red hex ${x.across.toFixed(2)} px across`);
      if (x.off > 1.5) bad.push(`${h.s}: red hex ${x.off.toFixed(2)} px off the hand's grip`);
    }
  }
  if (m.zoom.hands.length !== 1 || m.zoom.hexes.length !== 1) bad.push(`zoom: ${m.zoom.hands.length} red hands and ${m.zoom.hexes.length} red hexes`);
  else {
    // 7. in the zoom: the red hand bent 25-35 deg off the forearm at the wrist, toward the floor; the red dumbbell a hex
    //    at the hand's grip (+-1.5 px), not turned against the solid hex (+-2 deg; the forearm is the solid's)
    const z = zoomPiece(m);
    if (!z.hex) bad.push('zoom: the red dumbbell is not a hex');
    else {
      if (!(z.bend >= 25 && z.bend <= 35)) bad.push(`zoom: red hand ${z.bend.toFixed(1)} deg off the forearm`);
      if (!(z.drop > 0)) bad.push('zoom: the red hand not toward the floor');
      if (z.turn > 2) bad.push(`zoom: red dumbbell turned ${z.turn.toFixed(1)} deg against the forearm`);
      if (z.off > 1.5) bad.push(`zoom: red hex ${z.off.toFixed(2)} px off the hand's grip`);
    }
  }
  return bad;
};

describe('PF4 dumbbell_fly (pf12 fix round): a lying figure seen from the feet, every dumbbell an end-on hex, the red hand bent at the wrist', { timeout: T }, () => {
  let m: any;
  beforeAll(() => {
    m = measure(S);
    console.log('PF4 fly arms', m.arms.map((a: any) => `${a.who} ${a.up.toFixed(2)}/${a.fore.toFixed(2)}`).join('; '));
    console.log('PF4 fly start grips', m.startGrips.map((g: any) => `${g.s} dx ${g.dx.toFixed(2)} reach ${g.reach.toFixed(2)} (end ${g.endReach.toFixed(2)})`).join('; '));
    console.log('PF4 fly bench', m.eq.map((b: any) => `${((b.x1 - b.x0) * PX).toFixed(1)}x${((b.y1 - b.y0) * PX).toFixed(1)}@${(b.y0 * PX).toFixed(1)}`).join(' '), `shoulders y ${(m.shY * PX).toFixed(1)} hips y ${(m.hipY * PX).toFixed(1)}`);
    console.log('PF4 fly dumbbells', m.dumbbells.map((d: any) => `${d.who} ${d.hex ? `${d.hex.across.toFixed(2)} px, off ${d.off.toFixed(2)}` : 'not a hex'}`).join('; '));
    console.log('PF4 fly zoom', JSON.stringify(zoomPiece(m)));
  }, T);
  it('every ruled measure holds', () => {
    expect(problems(m)).toEqual([]);
  });
  it('mutations: each threshold turns red', () => {
    const one = (f: (x: any) => void) => { const x = structuredClone(m); f(x); return problems(x); };
    // 1. an upright rectangle behind the head (the base's pad top face): a bench shape reaching above the shoulders
    expect(one(x => x.eq.push({ x0: 158, x1: 200, y0: x.shY - 20, y1: x.shY + 10, n: 4 })).some(p => /^bench: .* above the shoulders/.test(p))).toBe(true);
    // 2. the band 21 px high, 1.5 px off the midline, above the hips: each red
    const band = (f: (b: any) => void) => one(x => { const b = x.eq.find((q: any) => q.n === 4 && q.y0 > x.hipY && (q.y1 - q.y0) * PX >= 12 && (q.y1 - q.y0) * PX <= 20); f(b); });
    expect(band(b => { b.y1 = b.y0 + 21 / PX; })).toContain('pad: 0 low end-on bands under the torso');
    expect(band(b => { b.y1 = b.y0 + 11 / PX; })).toContain('pad: 0 low end-on bands under the torso');
    expect(band(b => { b.x0 += 1.5 / PX; b.x1 += 1.5 / PX; })).toContain('pad: 0 low end-on bands under the torso');
    expect(one(x => { for (const b of x.eq) if (b.n === 4 && b.y0 > x.hipY) { const h = b.y1 - b.y0; b.y0 = x.hipY - 1; b.y1 = b.y0 + h; } })).toContain('pad: 0 low end-on bands under the torso');
    // 3. a start segment 1.1 px short (the pitch's foreshortening)
    expect(one(x => { x.arms[0].up -= 1.1 + (x.arms[0].up - x.arms.find((a: any) => a.who === 'end l').up); }).some(p => /^start l up/.test(p))).toBe(true);
    expect(one(x => { const g = x.arms.find((a: any) => a.who.startsWith('ghost')); g.fore += 1.1 - (g.fore - x.arms.find((a: any) => a.who === 'end r').fore); }).some(p => /^ghost 0 r fore/.test(p))).toBe(true);
    // 4. a start grip 3.1 px off the shoulder's vertical; its reach 1.1 px short
    expect(one(x => { x.startGrips[1].dx = 3.1; }).some(p => /^start r: grip 3\.10 px off/.test(p))).toBe(true);
    expect(one(x => { x.startGrips[0].reach = x.startGrips[0].endReach - 1.1; }).some(p => /^start l: reach/.test(p))).toBe(true);
    // 5. a hex 31.9 and 38.1 px across, 1.6 px off its grip, a side-on drawing (no hex), one missing
    const db = (w: string, f: (d: any) => void) => one(x => f(x.dumbbells.find((d: any) => d.who === w)));
    expect(db('end r', d => { d.hex.across = 31.9; })).toContain('end r: hex 31.90 px across');
    expect(db('start l', d => { d.hex.across = 38.1; })).toContain('start l: hex 38.10 px across');
    expect(db('ghost 0 r', d => { d.off = 1.6; })).toContain('ghost 0 r: hex 1.60 px off its grip');
    expect(db('start r', d => { d.hex = null; })).toContain('start r: dumbbell not a hex');
    expect(one(x => { x.dumbbells = x.dumbbells.filter((d: any) => d.who !== 'end l'); })).toContain('end l: 0 dumbbell drawings');
    // 6. a second red hand at a hand region and in the zoom; a red hex 31.9 px across, 1.6 px off the hand's grip, not a hex
    expect(one(x => { x.hands[0].hands.push(x.hands[0].hands[0]); })).toContain('l: 2 red hands and 1 red hexes in the hand region');
    expect(one(x => { x.zoom.hexes.push(x.zoom.hexes[0]); })).toContain('zoom: 1 red hands and 2 red hexes');
    const scaleHex = (p: V[], f: number) => { const c = hexOf(p)!.c; return p.map(q => [c[0]! + (q[0]! - c[0]!) * f, c[1]! + (q[1]! - c[1]!) * f]); };
    const a0 = bent(m.hands[1].hands[0], m.hands[1].hexes[0], m.hands[1].E, m.hands[1].W, 0, 1).across;
    expect(one(x => { x.hands[1].hexes[0] = scaleHex(x.hands[1].hexes[0], 31.9 / a0); })).toContain('r: red hex 31.90 px across');
    expect(one(x => { x.hands[0].hexes[0] = x.hands[0].hexes[0].map((q: V) => [q[0]! + 1.6 / PX, q[1]!]); }).some(p => /^l: red hex 1\.5[1-9] px off/.test(p))).toBe(true);
    expect(one(x => { x.hands[0].hexes[0] = x.hands[0].hexes[0].slice(0, 4); })).toContain('l: red dumbbell not a hex');
    // 7. the red hand at 24 and 36 deg (hand and hex turned about the wrist), bent up, the hex turned 3 deg about its centre,
    //    the hex 1.6 px off the hand's grip, and the previous round's piece (the hex turned with the hand, 23 deg)
    const turnAbout = (p: V[], c: V, d: number) => { const t = d * Math.PI / 180; return p.map(q => [c[0]! + (q[0]! - c[0]!) * Math.cos(t) - (q[1]! - c[1]!) * Math.sin(t), c[1]! + (q[0]! - c[0]!) * Math.sin(t) + (q[1]! - c[1]!) * Math.cos(t)]); };
    const z0 = zoomPiece(m), g0 = handEnd(m.zoom.hands[0], m.zoom.W), f0 = Math.atan2(m.zoom.W[1] - m.zoom.E[1], m.zoom.W[0] - m.zoom.E[0]);
    const sgn = Math.sign(Math.sin(Math.atan2(g0[1]! - m.zoom.W[1], g0[0]! - m.zoom.W[0]) - f0));   // the bend's screen sense
    const both = (d: number) => one(x => { x.zoom.hands[0] = turnAbout(x.zoom.hands[0], x.zoom.W, d); x.zoom.hexes[0] = turnAbout(x.zoom.hexes[0], x.zoom.W, d); });
    expect(both(sgn * (24 - z0.bend)).some(p => /^zoom: red hand 24\.0 deg/.test(p))).toBe(true);
    expect(both(sgn * (36 - z0.bend)).some(p => /^zoom: red hand 36\.0 deg/.test(p))).toBe(true);
    expect(both(-sgn * 2 * z0.bend).some(p => /^zoom: the red hand not toward the floor/.test(p))).toBe(true);
    expect(one(x => { x.zoom.hexes[0] = turnAbout(x.zoom.hexes[0], hexOf(x.zoom.hexes[0])!.c, 3); })).toContain('zoom: red dumbbell turned 3.0 deg against the forearm');
    expect(one(x => { x.zoom.hexes[0] = x.zoom.hexes[0].map((q: V) => [q[0]!, q[1]! + 1.6 / PX * x.zoom.k]); }).some(p => /^zoom: red hex 1\.60 px off/.test(p))).toBe(true);
    expect(one(x => { x.zoom.hexes[0] = turnAbout(x.zoom.hexes[0], hexOf(x.zoom.hexes[0])!.c, 23); }).some(p => /^zoom: red dumbbell turned/.test(p))).toBe(true);
  });
  it('mutation (the spec): the camera back at pitch 45 is red (segments, start reach, side-on dumbbells)', () => {
    const p = problems(measure({ ...S, camera: { ...S.camera, pitch: 45 } }));
    expect(p.some(x => /^start l up/.test(x))).toBe(true);
    expect(p.some(x => /^start l: reach/.test(x))).toBe(true);
    expect(p.some(x => /^end l: (dumbbell not a hex|[02-9] dumbbell drawings)$/.test(x))).toBe(true);
  });
});

// The other plate on PILOT-A3's plates page (reverse_lunge) equals the base page's (claude/lib-platefix-4 @ b41db429,
// `howto-rebuild --page tests/howto/golden/library/pilot-a3.json page`, sha 0ff2a970…5d0b7a).
describe('PF4 dumbbell_fly: reverse_lunge on the pilot-a3 plates page is byte-equal to the base', { timeout: T }, () => {
  const BASE: Record<string, Record<string, string>> = {
    'reverse-lunge': {
      normalSvg: 'daef9d1853ad591429e164b58b585ded30d033815d2fdf325808142f098612be', normalOverlay: '6645b13ce61d9b41ff64f3783df4def786b61a1727ffe4259af0c34a6cc0b091',
      mistakeSvg: 'be28727b57b3de42087a2aa8e7136606adacbc87c11fd18347e46f11e7bd3903', mistakeOverlay: 'd01df0f98638836820224c93ad92449c069da07d4dcc05eb61011bb8dd918a54',
      tells: '3b8748e608100f4dcb452b89f729b28c4b5d63f8182c8696335fa9f931431afb', tempo: 'eb4dd9849731669ac1cb004437fd08e1f8ebe026741d9ab8e909cefe1963e5eb',
      cues: '1aafabb743a297bf7c4dbe6c5c9cb80f7a6686aa011524583e1cada148ea103d', alt: 'a1883259b099b3abe8c84d92f57e3a68286fef05761c15ceaca2b8e84d184f6c',
      mistakeAlt: '60290a011cf514287cd031deed5e9bd4b56cca18acd412b81c551576e06a70c0',
    },
  };
  let html = '';
  beforeAll(async () => { html = (await build.buildPa3Page()).html.toString('utf8'); }, T);
  const fragProblems = (h: string) => {
    const ps = golden.extractPlates(h), bad: string[] = [];
    if (ps.map((p: any) => p.chromeId).join() !== 'reverse-lunge,dumbbell-fly') bad.push(`plates ${ps.map((p: any) => p.chromeId).join()}`);
    for (const [c, want] of Object.entries(BASE)) { const p = ps.find((x: any) => x.chromeId === c), got = p ? golden.fragmentsOf(p) : {};
      for (const k of Object.keys(want)) if (got[k] !== want[k]) bad.push(`${c} ${k}`); }
    return bad;
  };
  it('reverse_lunge\'s 9 fragments equal the base', () => {
    expect(fragProblems(html)).toEqual([]);
  });
  it('mutation: one byte changed in reverse_lunge\'s Mistake alt is red', () => {
    const p = golden.extractPlates(html).find((x: any) => x.chromeId === 'reverse-lunge'), alt = p.mistakeAlt ?? '';
    expect(alt.length).toBeGreaterThan(0);
    expect(fragProblems(html.replace(alt, alt.slice(0, -1) + (alt.endsWith('.') ? '!' : '.')))).toContain('reverse-lunge mistakeAlt');
  });
});
