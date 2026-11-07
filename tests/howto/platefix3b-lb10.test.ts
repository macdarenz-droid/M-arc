// LIB-PLATEFIX-3b item B (pfc-findings b5065795 set b T02 L1, critics c1-c3; ruled D-PF3B-SLEDSQUAT, #408): sled_pull's
// "Quarter squat" checkpoint. The quarter squat is shown on the START pose only (the callout anchors on the start's
// knee.r): knee 40-45 deg, the thigh at least 30 deg forward of vertical (toward the sled), the trunk within 10 deg of
// vertical, shoulders over hips. The rope may hold the lean back only as the named exception (sled_pull, start), under
// all three of: the start rope taut, the trunk within 10 deg, the centre of mass at most 10 cm behind the heels.
// Every value is read from the engine's own landmarks with the render's camera, never from a spec constant.
// Base (claude/lib-platefix-3b @ e8615508) fails: start thigh 16.6 deg, the callout on the end's stepped-back knee
// (thigh 3.5 deg), no balanceProblems export.
// Mutation (recorded in the PR): restoring the base hip setting (the hips balanced over the soles' midpoint, START_Z
// -0.014) puts the start thigh at 16.6 deg: the thigh block is red.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, body: any, eq: any, qaEng: any, M: any, S: any, KS: any;
beforeAll(async () => {
  [plate, body, eq, qaEng, M, KS] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'qa/engine.mjs',
    'specs/sled_pull.mjs', 'specs/kettlebell_swing.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  S = M.default;
}, 600_000);
const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body });
const view = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf3b' }), cam = qaEng.cameraOf(spec, r.report), L = qaEng.poseLandmarks(Eng(), spec);
  return { r, L, P: (pose: string, k: string) => cam.P(L.lm[pose][k]) as number[] };
};
const deg = (dx: number, dy: number) => Math.atan2(dx, dy) * 180 / Math.PI;
/** Thigh angle from vertical in screen px, + = the knee toward the sled (screen right; the figure faces right). */
const thighOf = (P: any, pose: string, s: string) => { const h = P(pose, `hip.${s}`), k = P(pose, `knee.${s}`); return deg(k[0] - h[0], k[1] - h[1]); };
const trunkOf = (P: any, pose: string) => { const s = P(pose, 'shoulder.r'), h = P(pose, 'hip.r'); return Math.abs(deg(s[0] - h[0], h[1] - s[1])); };
/** The drawn start rope run (hitch to the upper fist): its outline's greatest distance from its chord, in m. */
const ropeSag = (spec: any, pose = 'start') => {
  const L = qaEng.poseLandmarks(Eng(), spec), ctx = { pose, mistake: false, start: L.lm.start, body: L.body };
  const run = spec.equipment.flatMap((e: any) => [].concat(typeof e === 'function' ? e(L.lm[pose], ctx) ?? [] : e)).filter((i: any) => i && i.part === 'rope')[0].pts as number[][];
  // eq/rope.mjs strandOutline: the left side (k points), a 3-point stopper cap, the right side reversed
  const n = (run.length - 3) / 2, c = run.slice(0, n).map((p, i) => p.map((v, j) => (v + run[run.length - 1 - i]![j]!) / 2));
  const a = c[0]!, b = c[n - 1]!, u = [b[1]! - a[1]!, b[2]! - a[2]!], Lu = Math.hypot(u[0]!, u[1]!);
  return Math.max(...c.map(p => Math.abs((p[1]! - a[1]!) * u[1]! - (p[2]! - a[2]!) * u[0]!) / Lu));
};

describe('LIB-PLATEFIX-3b B sled_pull: the quarter squat on the start pose (D-PF3B-SLEDSQUAT)', () => {
  it('start: knees 40-45 deg; both thighs >= 30 deg forward of vertical; trunk <= 10 deg and shoulders over hips (<= 1 px)', () => {
    const { L, P } = view(S);
    for (const s of ['l', 'r']) {
      const k = L.q.start.knee[s], t = thighOf(P, 'start', s);
      console.log(`PF3b sled_pull start ${s}: knee ${k.toFixed(1)} deg, thigh ${t.toFixed(1)} deg`);
      expect(k >= 40 && k <= 45, `start knee.${s} ${k}`).toBe(true);
      expect(t, `start thigh.${s}`).toBeGreaterThanOrEqual(30);
    }
    expect(trunkOf(P, 'start')).toBeLessThanOrEqual(10);
    expect(Math.abs(P('start', 'shoulder.r')[0]! - P('start', 'hip.r')[0]!)).toBeLessThanOrEqual(1);
  });
  it('the "Quarter squat" callout anchors on the start pose\'s knee.r', () => {
    expect(S.callouts.find((c: any) => c.key === 'squat').anchor).toEqual({ at: 'knee.r', pose: 'start' });
  });
  it('the end keeps its step-back and drag: the hips move back DRAG -12.4 cm (+-0.5 cm) start to end, at one height; shoulders over hips', () => {
    const { L, P } = view(S);
    expect(Math.abs(L.lm.end.hips[2] - L.lm.start.hips[2] + 0.124)).toBeLessThanOrEqual(0.005);
    expect(Math.abs(L.lm.end.hips[1] - L.lm.start.hips[1])).toBeLessThanOrEqual(1e-6);
    expect(Math.abs(P('end', 'shoulder.r')[0]! - P('end', 'hip.r')[0]!)).toBeLessThanOrEqual(1);
  });
  it('the spec checks (contacts, flat feet, shoulders over hips) pass in every pose and the Mistake', () => {
    for (const mistake of [false, true]) {
      const rep = plate.renderPlate(S, { id: 'x', mistake }).report;
      expect(rep.checks.length).toBe(21);   // S.checks with 'all' read per pose
      for (const k of rep.checks) {
        const tol = Math.min(...S.checks.filter((c: any) => c.landmark === k.landmark && (c.pose === k.pose || c.pose === 'all')).map((c: any) => c.tol));
        expect(k.cm, `${mistake} ${k.landmark} ${k.pose}`).toBeLessThanOrEqual(tol);
      }
    }
  });
});

describe('LIB-PLATEFIX-3b B: the balance rule and its named exception (sled_pull, start)', () => {
  const inputs = (spec: any, pose: string) => {
    const { L, P } = view(spec);
    return { id: spec.id, pose, lm: L.lm[pose], trunkDeg: trunkOf(P, pose), ropeSag: ropeSag(spec, pose) };
  };
  it('green: start (the exception: rope taut, trunk <= 10 deg, CoM <= 10 cm behind the heels) and end (inside the base)', () => {
    for (const pose of ['start', 'end']) {
      const x = inputs(S, pose), c = M.com(x.lm)[2], heel = Math.min(x.lm['heel.l'][2], x.lm['heel.r'][2]);
      console.log(`PF3b sled_pull balance ${pose}: CoM ${c.toFixed(3)} m, heels ${heel.toFixed(3)} m (${((heel - c) * 100).toFixed(1)} cm behind), trunk ${x.trunkDeg.toFixed(1)} deg, rope sag ${(x.ropeSag * 100).toFixed(2)} cm`);
      expect(M.balanceProblems(x), pose).toEqual([]);
    }
  });
  it('red 1: the start rope slack (sag 5 cm) is red', () => {
    expect(M.balanceProblems({ ...inputs(S, 'start'), ropeSag: 0.05 })).toEqual([expect.stringMatching(/rope not taut/)]);
  });
  it('red 2: the start trunk 11 deg from vertical is red', () => {
    expect(M.balanceProblems({ ...inputs(S, 'start'), trunkDeg: 11 })).toEqual([expect.stringMatching(/trunk 11\.0 deg/)]);
  });
  it('red 3: the start CoM more than 10 cm behind the heels (the hips 9 cm further back) is red', () => {
    const st = S.poses.start, bad = { ...S, poses: { ...S.poses, start: { ...st, root: { ...st.root, at: [0, st.root.at[1], st.root.at[2] - 0.09] } } } };
    expect(M.balanceProblems(inputs(bad, 'start'))).toEqual([expect.stringMatching(/cm behind the heels/)]);
  });
  it('the rule stays strict elsewhere: the same lean in another pose (end) or another id (kettlebell_swing start) is red', () => {
    const x = inputs(S, 'start');
    expect(M.balanceProblems({ ...x, pose: 'end' })).toEqual([expect.stringMatching(/outside the heel-toe base/)]);
    expect(M.balanceProblems({ ...x, id: KS.default.id })).toEqual([expect.stringMatching(/outside the heel-toe base/)]);
  });
});
