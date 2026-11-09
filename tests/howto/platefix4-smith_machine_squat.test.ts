// LIB-PLATEFIX-4 smith_machine_squat (pf8 #405 6688665575 R2 [3,4,3], R5 [4,2,3]; pf9 #405 6689821636 R3 [3,4,2]; pf8-findings
// T04 c1, c2, c3; pf7 R3 c1, c3). Measured from the spec's own equipment items and the engine's body shapes at the render's
// camera (plate px, 358 px plate; the critics' px are about 2x plate px):
//  - R2 rail: the rod and the hook rail are drawn in the end layer's `center` level (over the opaque start figure and the
//    ghosts, behind the trunk and the near arm), from the top member down to the floor beam;
//  - R2 stop: a horizontal arm on the rail, 2.5-4.5 px tall, >= 24 px long, from the rod back, its top 0-4 px under the
//    bar's lowest drawn point, behind the near arm (`center`);
//  - R3 hand: one closed outline on the top layer (z front, over the near arm) that holds the elbow, the wrist and the grip
//    with no gap, closes round the bar (>= 1 px of hand outside the bar disc all round), the bar disc drawn over it;
//  - R5 fault leg: the Mistake's near thigh, shank and foot as whole red dashed outlines in the mistake layer (over the
//    solid body fill), each within 2 px of the engine's shape; the red foot under the bar (the bar's x >= 5 px inside it).
// Red on main's spec (0499c9cd): rod and hook rail in `back`, the stop a 7.3 px box in front, no hand piece, no leg outline.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, qaEng: any, body: any, eq: any, M: any, S: any;
beforeAll(async () => {
  [plate, qaEng, body, eq, M] = await Promise.all(['../vendor/engine/plate.mjs', 'qa/engine.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'specs/smith_machine_squat.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  S = M.default;
}, 600_000);

type V = number[];
const RIG = { stop: 3, rod: 4, upright: 5, member: 6, beam: 7 };   // spec.equipment indices: [floor, ...smith items x7, bar, startbar]
const bbox = (ps: V[]) => ({ x0: Math.min(...ps.map(p => p[0]!)), x1: Math.max(...ps.map(p => p[0]!)), y0: Math.min(...ps.map(p => p[1]!)), y1: Math.max(...ps.map(p => p[1]!)) });
const segDist = (p: V, a: V, b: V) => { const u = [b[0]! - a[0]!, b[1]! - a[1]!], l2 = u[0]! ** 2 + u[1]! ** 2, t = l2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * u[0]! + (p[1]! - a[1]!) * u[1]!) / l2)) : 0;
  return Math.hypot(p[0]! - a[0]! - t * u[0]!, p[1]! - a[1]! - t * u[1]!); };
const toLine = (p: V, t: V[], closed = true) => Math.min(...t.slice(0, closed ? t.length : t.length - 1).map((a, i) => segDist(p, a, t[(i + 1) % t.length]!)));
const inside = (p: V, t: V[]) => { let c = false; for (let i = 0, j = t.length - 1; i < t.length; j = i++) { const a = t[i]!, b = t[j]!;
  if ((a[1]! > p[1]!) !== (b[1]! > p[1]!) && p[0]! < (b[0]! - a[0]!) * (p[1]! - a[1]!) / (b[1]! - a[1]!) + a[0]!) c = !c; } return c; };

/** Everything the checks read, for one spec. */
const measure = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf4' }), cam = qaEng.cameraOf(spec, r.report);
  const L = qaEng.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body }, spec);
  const P = (pose: string, k: string): V => cam.P(L.lm[pose][k]);
  // the end pose's equipment items in drawing order (plate.mjs drawPose), with their entry index
  const items: any[] = [];
  spec.equipment.forEach((e: any, i: number) => {
    const ent = typeof e === 'function' ? e(L.lm.end, { pose: 'end', start: L.lm.start, body: L.body, mistake: false, q: L.q.end }) : e;
    if (!ent) return;
    for (const one of [].concat(ent) as any[]) eq.PRIMITIVES[one.type](one, cam).forEach((it: any) => items.push({ ...it, z: one.z ?? it.z, part: one.part ?? null, type: one.type, idx: i }));
  });
  const ofIdx = (i: number) => items.filter(it => it.idx === i);
  const disc = items.find(it => it.type === 'pulley' && it.part === 'bar' && it.cls === 'eq-solid');
  const db = bbox(disc.poly), bar = { c: [(db.x0 + db.x1) / 2, (db.y0 + db.y1) / 2], r: (db.x1 - db.x0) / 2 };
  // R2: rod and hook rail
  const rod = ofIdx(RIG.rod)[0], up = ofIdx(RIG.upright), member = bbox(ofIdx(RIG.member)[0].poly), beam = bbox(ofIdx(RIG.beam)[0].poly), rb = bbox(rod.poly);
  const stops = ofIdx(RIG.stop), sb = bbox(stops[0].poly);
  // R3: the near forearm and hand, a front-level outline holding the grip, drawn before the bar disc
  const front = items.filter(it => it.z === 'front' && it.poly);
  const hand = front.find(it => it.type !== 'pulley' && inside(P('end', 'grip.r'), it.poly));
  const chain = [P('end', 'elbow.r'), P('end', 'wrist.r'), P('end', 'grip.r')];
  const along = chain.slice(1).flatMap((b, k) => Array.from({ length: 11 }, (_, j) => [chain[k]![0]! + (b[0]! - chain[k]![0]!) * j / 10, chain[k]![1]! + (b[1]! - chain[k]![1]!) * j / 10]));
  // R5: the Mistake's near leg as dashed outlines
  const mShapes = body.bodyShapes(body.fk(L.q.mistake, { height: 1.75 }), cam);
  const dashed = spec.mistake.guides.filter((g: any) => g.kind === 'dashed').map((g: any) => g.pts.map((p: any) => qaEng.resolvePoint(p, 'mistake', L.lm, cam)));
  const legFit = (key: string) => { const sh = mShapes.find((s: any) => s.key === key).poly;
    return Math.min(...dashed.map((g: V[]) => Math.max(Math.max(...g.map(p => toLine(p, sh))), Math.max(...sh.map((p: V) => toLine(p, g, false)))))); };
  const foot = bbox(mShapes.find((s: any) => s.key === 'foot.r').poly);
  return {
    r, P, items, bar,
    rail: { rodZ: rod.z, uprightZ: up.map(u => u.z), rodTop: rb.y0, rodBottom: rb.y1, memberBottom: member.y1, beamTop: beam.y0, rodX: [rb.x0, rb.x1] },
    stop: { n: stops.length, z: stops[0].z, h: sb.y1 - sb.y0, w: sb.x1 - sb.x0, gap: sb.y0 - (bar.c[1]! + bar.r), x0: sb.x0, x1: sb.x1 },
    hand: hand && { z: hand.z, before: front.indexOf(hand) < front.indexOf(disc), gaps: along.filter(p => !inside(p, hand.poly)).length,
      ring: Math.min(...hand.poly.map((p: V) => Math.hypot(p[0]! - bar.c[0]!, p[1]! - bar.c[1]!))) - bar.r },
    leg: { thigh: legFit('thigh.r'), shank: legFit('shank.r'), foot: legFit('foot.r'), footIn: Math.min(bar.c[0]! - foot.x0, foot.x1 - bar.c[0]!) },
  };
};
const railOk = (m: any) => m.rail.rodZ === 'center' && m.rail.uprightZ.every((z: string) => z === 'center') && m.rail.rodTop <= m.rail.memberBottom + 0.5 && m.rail.rodBottom >= m.rail.beamTop - 0.5;
const stopOk = (m: any) => m.stop.n === 1 && m.stop.z === 'center' && m.stop.h >= 2.5 && m.stop.h <= 4.5 && m.stop.w >= 24 && m.stop.gap > 0 && m.stop.gap <= 4
  && m.stop.x1 >= m.rail.rodX[0] && m.stop.x0 <= m.rail.rodX[0] - 20;
const handOk = (m: any) => !!m.hand && m.hand.z === 'front' && m.hand.before && m.hand.gaps === 0 && m.hand.ring >= 1;
const legOk = (m: any) => m.leg.thigh <= 2 && m.leg.shank <= 2 && m.leg.foot <= 2 && m.leg.footIn >= 5;

describe('PF4 smith_machine_squat: full rail, stop arm, hand on the bar, red leg over the body', () => {
  let m: any;
  beforeAll(() => { m = measure(S); console.log('PF4 smith_machine_squat', JSON.stringify({ rail: m.rail, stop: m.stop, hand: m.hand, leg: m.leg, bar: m.bar }, (k, v) => typeof v === 'number' ? +v.toFixed(2) : v)); }, 600_000);
  it('R2: the rod and the hook rail are drawn in the end layer\'s center level (over the start figure and ghosts, behind the body), from the top member to the floor beam', () => {
    expect(m.rail.rodZ).toBe('center');
    expect(m.rail.uprightZ.length).toBeGreaterThan(0);
    for (const z of m.rail.uprightZ) expect(z).toBe('center');
    expect(m.rail.rodTop).toBeLessThanOrEqual(m.rail.memberBottom + 0.5);
    expect(m.rail.rodBottom).toBeGreaterThanOrEqual(m.rail.beamTop - 0.5);
    expect(railOk(m)).toBe(true);
  });
  it('R2: the safety stop is one horizontal arm on the rail, 2.5-4.5 px tall and >= 24 px long from the rod back, its top 0-4 px under the bar, behind the near arm', () => {
    expect(m.stop.n).toBe(1);
    expect(m.stop.z).toBe('center');
    expect(m.stop.h).toBeGreaterThanOrEqual(2.5);
    expect(m.stop.h).toBeLessThanOrEqual(4.5);
    expect(m.stop.w).toBeGreaterThanOrEqual(24);
    expect(m.stop.gap).toBeGreaterThan(0);
    expect(m.stop.gap).toBeLessThanOrEqual(4);
    expect(m.stop.x1).toBeGreaterThanOrEqual(m.rail.rodX[0]);
    expect(m.stop.x0).toBeLessThanOrEqual(m.rail.rodX[0] - 20);
  });
  it('R3: the near forearm and hand are one front-level outline over the near arm, elbow to grip with no gap, closed round the bar (>= 1 px all round), the bar drawn over it', () => {
    expect(m.hand).toBeTruthy();
    expect(m.hand.z).toBe('front');
    expect(m.hand.gaps).toBe(0);
    expect(m.hand.ring).toBeGreaterThanOrEqual(1);
    expect(m.hand.before).toBe(true);
  });
  it('R5: the Mistake\'s near thigh, shank and foot are whole red dashed outlines (within 2 px of the engine\'s shapes) in the mistake layer, the foot under the bar (>= 5 px each side)', () => {
    expect(m.leg.thigh).toBeLessThanOrEqual(2);
    expect(m.leg.shank).toBeLessThanOrEqual(2);
    expect(m.leg.foot).toBeLessThanOrEqual(2);
    expect(m.leg.footIn).toBeGreaterThanOrEqual(5);
  });
  it('mutations turn each check red', { timeout: 600_000 }, () => {
    const eqWith = (i: number, f: (it: any) => any) => S.equipment.map((e: any, k: number) => (k === i ? (lm: any, ctx: any) => { const v = e(lm, ctx); return v && f(v); } : e));
    // rail: the rod or the hook rail back in the static back level; a rod stopping 30 cm short of the top member
    expect(railOk(measure({ ...S, equipment: eqWith(RIG.rod, it => ({ ...it, z: 'back' })) }))).toBe(false);
    expect(railOk(measure({ ...S, equipment: eqWith(RIG.upright, it => ({ ...it, z: 'back' })) }))).toBe(false);
    expect(railOk(measure({ ...S, equipment: eqWith(RIG.rod, it => ({ ...it, len: it.len - 0.3 })) }))).toBe(false);
    // stop: in front of the arm; 7.3 px tall (main's 5 cm box); 15 px long; 10 px under the bar; off the rail
    expect(stopOk(measure({ ...S, equipment: eqWith(RIG.stop, it => ({ ...it, z: 'front' })) }))).toBe(false);
    expect(stopOk(measure({ ...S, equipment: eqWith(RIG.stop, it => ({ ...it, h: 0.05 })) }))).toBe(false);
    expect(stopOk(measure({ ...S, equipment: eqWith(RIG.stop, it => ({ ...it, w: 0.1, at: [0, it.at[1], it.at[2] + 0.04] })) }))).toBe(false);
    expect(stopOk(measure({ ...S, equipment: eqWith(RIG.stop, it => ({ ...it, at: [0, it.at[1] - 0.045, it.at[2]] })) }))).toBe(false);
    expect(stopOk(measure({ ...S, equipment: eqWith(RIG.stop, it => ({ ...it, at: [0, it.at[1], it.at[2] - 0.05] })) }))).toBe(false);
    // hand: dropped; under the near arm (mid); drawn over the bar; shrunk to the bar's radius; cut short of the elbow
    const barIdx = S.equipment.length - 2;
    const handEq = (f: (h: any) => any) => eqWith(barIdx, v => v.map((it: any) => (it.part === 'hand' ? f(it) : it)).filter(Boolean));
    expect(handOk(measure({ ...S, equipment: handEq(() => null) }))).toBe(false);
    expect(handOk(measure({ ...S, equipment: handEq(h => ({ ...h, z: 'mid' })) }))).toBe(false);
    expect(handOk(measure({ ...S, equipment: eqWith(barIdx, v => [...v.filter((it: any) => it.part !== 'hand'), ...v.filter((it: any) => it.part === 'hand')]) }))).toBe(false);
    const k = 0.025 / M.HAND_R, c = [M.BAR_LOW, M.RAIL_Z];   // the hand arc (its first 7 points) pulled in to the bar's radius
    expect(handOk(measure({ ...S, equipment: handEq(h => ({ ...h, pts: h.pts.map((p: V, i: number) => (i < 7 ? [p[0], c[0] + (p[1]! - c[0]) * k, c[1] + (p[2]! - c[1]) * k] : p)) })) }))).toBe(false);
    expect(handOk(measure({ ...S, equipment: handEq(h => ({ ...h, pts: h.pts.map((p: V) => [p[0], Math.max(p[1]!, M.BAR_LOW - 0.06), p[2]]) })) }))).toBe(false);
    // fault leg: no leg outlines (main's guides); the foot outline 3 px off; the Mistake feet left ahead of the bar
    const guides = S.mistake.guides, legG = guides.filter((g: any) => g.kind === 'dashed' && g.pts.length > 4);
    expect(legOk(measure({ ...S, mistake: { ...S.mistake, guides: guides.filter((g: any) => !legG.includes(g)) } }))).toBe(false);
    expect(legOk(measure({ ...S, mistake: { ...S.mistake, guides: guides.map((g: any) => (g === legG[3] ? { ...g, pts: g.pts.map((p: V) => [p[0], p[1]! + 0.021, p[2]]) } : g)) } }))).toBe(false);
    expect(legOk(measure({ ...S, mistake: { ...S.mistake, pose: { ...S.mistake.pose, plant: S.poses.end.plant } } }))).toBe(false);
  });
});
