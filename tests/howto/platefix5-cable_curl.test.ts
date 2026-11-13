// LIB-PLATEFIX-5 item 3 (card verify/lib-platefix-5-card.md; PLAN RULED #419 6849391955), cable_curl (lb05), F-CURL-ELBOWZOOM:
// pf14 R11 [3,3,3] again (#410 6756215536): "the 2.3x zoom of a ring over the mid-arm repeats what already reads at plate size,
// and the ring sits about 13 px in front of the elbow and takes in the hip"; R5 passed. Poses from PF4's pf14-judged build
// 8dbb9a73. The card's call: at or above deviationMin (qa/envelope.json) the tell needs no zoom (D-PF4-PULLOVERNOZOOM).
// The deviation is PQ-H3's own (qa/node.mjs deviation(): the largest end -> Mistake move of a tell anchor, plate px).
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const T = 300_000;
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, body: any, eng: any, qn: any, spec: any, env: any;
beforeAll(async () => {
  [plate, body, eng, qn] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', 'engine.mjs', 'qa/node.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  spec = (await import(/* @vite-ignore */ lib('specs/cable_curl.mjs'))).default;
  env = JSON.parse(readFileSync('tools/plates/library/qa/envelope.json', 'utf8'));
}, T);
const devOf = (s: any) => qn.deviation({ spec: s }, { renderPlate: plate.renderPlate, PRIMITIVES: eng.PRIMITIVES, body },
  { normal: plate.renderPlate(s, { id: 'n' }), mistake: plate.renderPlate(s, { id: 'm', mistake: true }) });

describe('PF5 item 3 cable_curl: the elbow tell reads at plate size, so the Mistake has no zoom', { timeout: T }, () => {
  it('the tell is anchored on the Mistake elbow and moves at least deviationMin (11.39 px) at plate scale', () => {
    expect(spec.mistake.tells.map((t: any) => t.anchor)).toContainEqual({ at: 'elbow.r', pose: 'mistake' });
    const d = devOf(spec);
    console.log(`PF5 cable_curl: deviation ${d.toFixed(2)} px (min ${env.deviationMin})`);
    expect(env.deviationMin).toBeCloseTo(11.39, 2);
    expect(d).toBeGreaterThanOrEqual(env.deviationMin);
  });
  it('the spec carries no zoom (a zoom here would raise H3.zoom:not-needed:mistake, qa/zoom.mjs)', () => {
    expect(spec.zoom).toBeUndefined();
  });
  // The elbow joint rides the shoulder only, so the tell's move comes from the Mistake's shoulder flex, solved in the spec
  // (MIS_FLEX) to rest the locked arm's bar at the end bar's z. The mutation re-solves it, the spec's way, for a bottom elbow of
  // 20 deg (pf12's place, the elbows about 8.4 plate px apart).
  it('mutation: the bottom elbow at 20 deg (pf12\'s place), the Mistake re-solved the spec\'s way, moves under the bar', () => {
    const end = { ...spec.poses.end, elbow: 20 }, zEnd = eng.landmarksOf(end, 1.75)['grip.r'][2];
    const zAt = (f: number) => eng.landmarksOf({ ...end, elbow: 0, shoulder: { flex: f, rot: 0 } }, 1.75)['grip.r'][2];
    let lo = 0, hi = 40; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (zAt(m) < zEnd) lo = m; else hi = m; }
    const s = { ...spec, poses: { ...spec.poses, end }, mistake: { ...spec.mistake, pose: { elbow: 0, shoulder: { flex: (lo + hi) / 2, rot: 0 } } } };
    const d = devOf(s);
    console.log(`PF5 cable_curl mutation (20 deg): deviation ${d.toFixed(2)} px`);
    expect(d).toBeLessThan(env.deviationMin);
  });
});
