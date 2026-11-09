// LIB-PLATEFIX-3b item C (pfc-findings b5065795 set b T03 L5, critics c2, c3; card c9, c10): lying_leg_curl's Mistake
// "Low back arches" reads. Measured from the engine's landmarks and body shapes at the render's camera (plate px):
// one red dashed trunk (back) outline from the hips to the shoulders, a lower back hollow >= 8 px deep (3+ px deeper than the
// Right's, never above the solid back), the chest and shoulders 15-20 deg off the pad, the hips on the pad, and the zoom
// ring holding the hollow against the Right. Red on the base spec (e8615508): a 4-point back guide (184-240 px, not to
// the shoulders), hollow 7.0 px, lift 7.9 deg, the hollow outside its 14.9 px ring.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, qaEng: any, body: any, eq: any, Z: any, M: any, S: any;
beforeAll(async () => {
  [plate, qaEng, body, eq, Z, M] = await Promise.all(['../vendor/engine/plate.mjs', 'qa/engine.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'zoom/inline.mjs', 'specs/lying_leg_curl.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  S = M.default;
}, 600_000);

type V = number[];
const ang = (a: V, b: V) => Math.atan2(-(b[1]! - a[1]!), b[0]! - a[0]!) * 180 / Math.PI;
/** Everything the checks read, for one spec. */
const measure = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf3b' }), cam = qaEng.cameraOf(spec, r.report);
  const L = qaEng.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body }, spec);
  const P = (pose: string, k: string): V => cam.P(L.lm[pose][k]);
  const torso = (pose: string): V[] => body.bodyShapes(body.fk(L.q[pose], { height: 1.75 }), cam).find((s: any) => s.key === 'torso').poly;
  // the top of a closed outline at plate x (screen y down: the smallest y)
  const top = (t: V[], x: number) => { let m = Infinity; t.forEach((a, i) => { const b = t[(i + 1) % t.length]!;
    if ((a[0]! - x) * (b[0]! - x) <= 0 && a[0] !== b[0]) m = Math.min(m, a[1]! + (b[1]! - a[1]!) * (x - a[0]!) / (b[0]! - a[0]!)); }); return m; };
  const dashed = spec.mistake.guides.filter((g: any) => g.kind === 'dashed');
  const pts: V[] = dashed.length ? dashed[0].pts.map((p: any) => qaEng.resolvePoint(p, 'mistake', L.lm, cam)) : [];
  // the hollow: the deepest point of a back line under its buttock-upper back chord (the pose's landmarks)
  const hollow = (pose: string, back: V[]) => { const a = P(pose, 'buttock'), b = P(pose, 'backUpper'), u = [b[0]! - a[0]!, b[1]! - a[1]!], n = Math.hypot(u[0]!, u[1]!);
    let best = { d: -Infinity, p: [0, 0] as V };
    for (const p of back) if (p[0]! > a[0]! && p[0]! < b[0]!) { const d = (u[0]! * (p[1]! - a[1]!) - u[1]! * (p[0]! - a[0]!)) / n; if (d > best.d) best = { d, p }; }
    return best; };
  const hipY = P('mistake', 'hip.r')[1]!, back = pts.filter(p => p[1]! < hipY);   // the guide above the hip joints
  const tE = torso('end'), xs = Array.from({ length: 200 }, (_, i) => P('end', 'buttock')[0]! + i * (P('end', 'backUpper')[0]! - P('end', 'buttock')[0]!) / 199);
  const hM = hollow('mistake', back), hE = hollow('end', xs.map(x => [x, top(tE, x)]));
  const z = Z.zoomOf(spec), inRing = (p: V) => Math.hypot(p[0]! - z.src.c[0], p[1]! - z.src.c[1]) <= z.src.r;
  const ringRise = Math.max(0, ...back.filter(inRing).map(p => top(tE, p[0]!) - p[1]!));   // the dashed back above the solid one, inside the ring
  return { r, L, P, pts, nDashed: dashed.length, tM: torso('mistake'), tE, top, hM, hE, z, inRing, ringRise,
    lift: ang(P('mistake', 'hip.r'), P('mistake', 'shoulder.r')) - ang(P('end', 'hip.r'), P('end', 'shoulder.r')) };
};
const segDist = (p: V, a: V, b: V) => { const u = [b[0]! - a[0]!, b[1]! - a[1]!], l2 = u[0]! ** 2 + u[1]! ** 2, t = l2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * u[0]! + (p[1]! - a[1]!) * u[1]!) / l2)) : 0;
  return Math.hypot(p[0]! - a[0]! - t * u[0]!, p[1]! - a[1]! - t * u[1]!); };
const offOutline = (p: V, t: V[]) => Math.min(...t.map((a, i) => segDist(p, a, t[(i + 1) % t.length]!)));

describe('PF3b lb8 lying_leg_curl: the arched trunk reads', () => {
  let m: any;
  beforeAll(() => { m = measure(S); console.log(`PF3b lying_leg_curl: lift ${m.lift.toFixed(2)} deg; hollow ${m.hM.d.toFixed(2)} px at ${m.hM.p.map((v: number) => v.toFixed(1))} (Right ${m.hE.d.toFixed(2)}); ring k ${m.z.k} r ${m.z.src.r.toFixed(1)}, back rise in ring ${m.ringRise.toFixed(2)} px`); }, 600_000);
  it('one red dashed trunk outline from the hips (the rear of the pelvis at the hip joints\' height) over the back to the shoulders, on the drawn Mistake torso (within 2 px of its outline)', () => {
    expect(m.nDashed).toBe(1);
    const xs = m.pts.map((p: V) => p[0]!);
    expect(Math.min(...xs)).toBeLessThanOrEqual(m.P('mistake', 'buttock')[0]! - 5);  // round the buttock to the rear of the hips
    expect(Math.max(...m.pts.map((p: V) => p[1]!))).toBeGreaterThanOrEqual(m.P('mistake', 'hip.r')[1]! - 3);   // down to the hip joints' height
    expect(Math.max(...xs)).toBeGreaterThanOrEqual(m.P('mistake', 'shoulder.r')[0]!); // to the shoulders
    expect(Math.max(...m.pts.map((p: V) => offOutline(p, m.tM)))).toBeLessThanOrEqual(2);
  });
  it('the lower back hollow is >= 8 px deep, 3+ px deeper than the Right\'s, and never above the solid back', () => {
    expect(m.hM.d).toBeGreaterThanOrEqual(8);
    expect(m.hM.d - m.hE.d).toBeGreaterThanOrEqual(3);
    expect(m.hM.p[1] - m.top(m.tE, m.hM.p[0])).toBeGreaterThanOrEqual(-0.5);       // the hollow at or below (inside) the solid back line
  });
  it('the chest and shoulders lift 15-20 deg off the pad (the hip-shoulder line, Mistake vs the Right); the chest leaves the pad', () => {
    expect(m.lift).toBeGreaterThanOrEqual(15);
    expect(m.lift).toBeLessThanOrEqual(20);
    expect(m.L.lm.mistake.chest[1] - m.L.lm.end.chest[1]).toBeGreaterThan(0.05);
  });
  it('the hips stay on the pad: the Mistake navel check passes, the hip joints hold (<= 0.5 cm), the drawn pelvis front 0.65 cm over the pad as at the end', () => {
    const c = m.r.report.checks.filter((k: any) => k.pose === 'mistake' && k.landmark === 'navel');
    expect(c.length).toBe(1);
    expect(c[0].cm).toBeLessThanOrEqual(0.5);
    for (const k of ['hip.l', 'hip.r']) expect(Math.hypot(...[1, 2].map(i => m.L.lm.mistake[k][i] - m.L.lm.end[k][i])) * 100, k).toBeLessThanOrEqual(0.5);
    const pf = (p: any) => +(M.pelvisFront(p) * 100).toFixed(2);
    expect(pf({ ...S.poses.end, ...S.mistake.pose })).toBe(pf(S.poses.end));
    expect(pf(S.poses.end)).toBe(0.65);
  });
  it('the zoom ring holds the hollow and the back\'s rise (>= 4 px) above the Right', () => {
    expect(m.inRing(m.hM.p)).toBe(true);
    expect(m.ringRise).toBeGreaterThanOrEqual(4);
  });
  it('mutations: the 12 deg arch (base M_ARCH) is under the lift band; the base 4-point back guide misses the shoulders and the hollow', () => {
    expect(measure({ ...S, mistake: { ...S.mistake, pose: { trunk: -12 } } }).lift).toBeLessThan(15);
    const base = measure({ ...S, mistake: { ...S.mistake, guides: [{ kind: 'dashed', smooth: true, pts: ['backUpper', 'backMid', 'sacrum', 'buttock'].map(at => ({ at, pose: 'mistake' })) }] } });
    expect(Math.max(...base.pts.map((p: V) => p[0]!))).toBeLessThan(base.P('mistake', 'shoulder.r')[0]!);
    expect(Math.max(...base.pts.map((p: V) => p[1]!))).toBeLessThan(base.P('mistake', 'hip.r')[1]! - 3);
  });
});
