// LIB-PLATEFIX-3 W7 lb10 items (W7 PANEL FIX #394 6682923012, routed 6682947098; ADDENDUM ruled #405 6683319630).
// Every value is read from the engine's own landmarks and angles (the render's camera), never from a spec constant.
// Main's drawing (8d23a558) fails every block below. Not built (see the PR): jumping_jacks (the 0.45 m stance breaks the
// 0.5 cm foot-contact limit; its toe-out is already 30 deg) and wall_ball (a 45 deg Wrong trunk puts the ball 1 px into
// the thighs, against D-SMALL-9's 2 px clearance); burpee's pose swap (the start knee, the "Soft landing" anchor, falls
// under the solid plank, so no box clears PQ-H1 and the no-crossing leader rule) is reverted, its alt copy kept.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, body: any, eq: any, qaEng: any;
const S: Record<string, any> = {};
const IDS = ['high_knees', 'farmer_s_carry', 'burpee', 'jump_rope', 'sled_pull'];
beforeAll(async () => {
  [plate, body, eq, qaEng] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'qa/engine.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  for (const id of IDS) S[id] = (await import(/* @vite-ignore */ lib(`specs/${id}.mjs`))).default;
});
const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body });
const pxOf = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf3' }), cam = qaEng.cameraOf(spec, r.report), L = qaEng.poseLandmarks(Eng(), spec);
  return { L, P: (pose: string, k: string) => cam.P(L.lm[pose][k]) as number[] };
};
const trunkDeg = (s: number[], h: number[]) => Math.atan2(Math.abs(s[0]! - h[0]!), h[1]! - s[1]!) * 180 / Math.PI;
const FOOT = ['heel.l', 'heel.r', 'ball.l', 'ball.r', 'toe.l', 'toe.r'];

describe('PF3 W7 copy (c5; the second farmer tell)', () => {
  it('high_knees: the "Knee too high" cue names the lower back arching (c5), not "the back gives way"', () => {
    const t = S.high_knees.mistake.tells.find((x: any) => x.key === 'high');
    expect(t.cue).toMatch(/lower back arches/);
    expect(t.cue).not.toMatch(/gives way/);
  });
  it('farmer_s_carry: one tell, "Steps too long" ("Long stride" had no claim)', () => {
    expect(S.farmer_s_carry.mistake.tells.map((x: any) => x.key)).toEqual(['long']);
  });
});

describe('PF3 W7 burpee copy (c2)', () => {
  it('the alt says shoulder-width apart (c2), not "under the shoulders"', () => {
    expect(S.burpee.alt).toMatch(/shoulder-width apart/);
    expect(S.burpee.alt).not.toMatch(/under the shoulders/);
  });
});

describe('PF3 W7 jump_rope: the too-high jump, tucked and clear (c9, L5)', () => {
  it('the lowest Mistake foot is at least 3x the Right hop over the floor; knees tucked 60 deg (+-1)', () => {
    const { L } = pxOf(S.jump_rope);
    const low = (pose: string) => Math.min(...FOOT.map(k => L.lm[pose][k][1]));
    expect(low('mistake')).toBeGreaterThanOrEqual(3 * low('end'));
    expect(Math.abs(L.q.mistake.knee.r - 60)).toBeLessThanOrEqual(1);
  });
  it('the dashed figure is clear of the solid one: hips at least 60 px apart, the faulty right hip outside the solid left hip', () => {
    const { P } = pxOf(S.jump_rope);
    expect(Math.abs(P('mistake', 'hips')[0]! - P('end', 'hips')[0]!)).toBeGreaterThanOrEqual(60);
    expect(P('mistake', 'hip.r')[0]).toBeGreaterThan(P('end', 'hip.l')[0]!);
  });
});

describe('PF3 W7 sled_pull: a quarter squat (c2, L1)', () => {
  it('the start knees bend 40-45 deg (main 29.4); the trunk stays upright, shoulders over hips (<= 1 px) at start and end', () => {
    const { L, P } = pxOf(S.sled_pull);
    for (const s of ['l', 'r']) { const k = L.q.start.knee[s]; expect(k >= 40 && k <= 45, `start knee.${s} ${k}`).toBe(true); }
    for (const pose of ['start', 'end']) expect(Math.abs(P(pose, 'shoulder.r')[0]! - P(pose, 'hip.r')[0]!), pose).toBeLessThanOrEqual(1);
  });
  it('the Mistake keeps the end\'s stepped-back knee (+-0.5 deg)', () => {
    const { L } = pxOf(S.sled_pull);
    expect(Math.abs(L.q.mistake.knee.r - L.q.end.knee.r)).toBeLessThanOrEqual(0.5);
  });
});
