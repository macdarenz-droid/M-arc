// LIB-PLATEFIX-4 group 4, burpee (fresh round 1). pf8 T10 R5 (#405 6688665575: "the stiff landing is within about 12 px
// of the soft one"; critics c1-c3: the soft landing about 30 deg, the knee clearly forward of the hip-ankle line), pf7 R1/R5
// (#405 6685743439: "about 30 deg knee flexion") and the PF3 addendum (#405 6683300292: "the Wrong as dashed straight legs,
// offset"). Measured from the engine's landmarks at the render's camera (plate px): the landing knee bends 25-35 deg, the
// knee sits >= 14 px forward of the hip-ankle line, the Mistake leg stays straight (<= 2 deg) and its knee sits >= 12 px
// from the soft knee. Red on main's spec (KNEE_SOFT 15): knee 15.0 deg, 8.2 px forward, the knees 7.1 px apart.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, qaEng: any, body: any, eq: any, M: any, S: any;
beforeAll(async () => {
  [plate, qaEng, body, eq, M] = await Promise.all(['../vendor/engine/plate.mjs', 'qa/engine.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'specs/burpee.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  S = M.default;
}, 600_000);

type V = number[];
const BAR = { kneeMin: 25, kneeMax: 35, forward: 14, straight: 2, apart: 12 };
/** Everything the checks read, for one spec. */
const measure = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf4', mistake: true }), cam = qaEng.cameraOf(spec, r.report);
  const L = qaEng.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body }, spec);
  const P = (pose: string, k: string): V => cam.P(L.lm[pose][k]);
  // the knee's distance in front of the hip-ankle line (plate px; facing right, so in front is +x)
  const forward = (pose: string) => { const h = P(pose, 'hip.r'), k = P(pose, 'knee.r'), a = P(pose, 'ankle.r'), dx = a[0]! - h[0]!, dy = a[1]! - h[1]!;
    return ((k[0]! - h[0]!) * dy - (k[1]! - h[1]!) * dx) / Math.hypot(dx, dy); };
  const ke = P('end', 'knee.r'), km = P('mistake', 'knee.r');
  return { kneeEnd: M.kneeOf(L.lm.end, 'r'), kneeMis: M.kneeOf(L.lm.mistake, 'r'), forward: forward('end'), apart: Math.hypot(km[0]! - ke[0]!, km[1]! - ke[1]!) };
};
const problems = (spec: any) => {
  const m = measure(spec), out: string[] = [];
  if (!(m.kneeEnd >= BAR.kneeMin && m.kneeEnd <= BAR.kneeMax)) out.push(`landing knee ${m.kneeEnd.toFixed(1)} deg`);
  if (!(m.forward >= BAR.forward)) out.push(`knee ${m.forward.toFixed(1)} px forward`);
  if (!(m.kneeMis <= BAR.straight)) out.push(`Mistake knee ${m.kneeMis.toFixed(1)} deg`);
  if (!(m.apart >= BAR.apart)) out.push(`knees ${m.apart.toFixed(1)} px apart`);
  return out;
};

describe('LIB-PLATEFIX-4 burpee: the soft landing reads bent and the stiff landing reads straight beside it (pf8 T10 R5)', { timeout: 600_000 }, () => {
  it('the landing knee bends 25-35 deg, 14+ px forward of the hip-ankle line; the Mistake knee is straight and 12+ px from it', () => {
    const m = measure(S);
    console.log(`PF4 burpee: knee ${m.kneeEnd.toFixed(1)} deg, ${m.forward.toFixed(1)} px forward; Mistake knee ${m.kneeMis.toFixed(1)} deg, knees ${m.apart.toFixed(1)} px apart`);
    expect(problems(S)).toEqual([]);
    expect(M.SIZES.KNEE_SOFT).toBe(30);
  });
  it('the Mistake zoom is gone (the fault clears the plate-scale bar on its own) and the one axis guide stays', () => {
    expect(S.zoom).toBeUndefined();
    expect(S.mistake.guides.map((g: any) => g.kind)).toEqual(['line']);
  });
  it('mutations: the landing drawn with straight legs, a 15 deg landing (main\'s) and a bent Mistake are red', () => {
    const straight = { ...S, poses: { ...S.poses, end: { ...S.poses.end, root: S.mistake.pose.root } } };
    expect(problems(straight)).toEqual([expect.stringMatching(/^landing knee /), expect.stringMatching(/^knee .* px forward$/), expect.stringMatching(/^knees .* px apart$/)]);
    // main's landing: the hip height at which the knee bends 15 deg (the spec's bisect on the engine's landmarks)
    const e = S.poses.end, at = (y: number) => ({ ...e, root: { ...e.root, at: [e.root.at[0], y, e.root.at[2]] } });
    const y15 = M.bisect((y: number) => M.kneeOf(body.landmarksOf(at(y), 1.75), 'r') - 15, e.root.at[1], S.mistake.pose.root.at[1], 'mutation');
    expect(problems({ ...S, poses: { ...S.poses, end: at(y15) } })).toEqual([expect.stringMatching(/^landing knee 15\.0 deg$/), expect.stringMatching(/^knee .* px forward$/), expect.stringMatching(/^knees .* px apart$/)]);
    const bent = { ...S, mistake: { ...S.mistake, pose: { root: e.root } } };
    expect(problems(bent)).toEqual([expect.stringMatching(/^Mistake knee 30\.0 deg$/), 'knees 0.0 px apart']);
  });
});
