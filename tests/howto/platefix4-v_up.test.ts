// LIB-PLATEFIX-4 F-VUP-V, the leader part (pf10 T09 R4 [3,3,3], #408 6704679655; critics c1-c3: "End the leader on the
// bottom outline at the floor contact under the lumbar spine"). Measured at the render's camera (plate px): the LOW BACK
// DOWN anchor lies on the lying torso's drawn outline (<= 0.5 px), on its underside (within 2 px of the floor line, at the
// lumbar landmark's x within 1 px). Red on main's spec (anchor 'navel', the belly side: 29.5 px above the floor).
// The V figure and the trace direction of F-VUP-V are not in this file: they need the pose swap, which the engine does
// not offer through the spec (the Mistake is always drawn on the spec end; see the PF4 report).
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, qaEng: any, body: any, eq: any, M: any, S: any;
beforeAll(async () => {
  [plate, qaEng, body, eq, M] = await Promise.all(['../vendor/engine/plate.mjs', 'qa/engine.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'specs/v_up.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  S = M.default;
}, 600_000);

type V = number[];
const BAR = { outline: 0.5, floor: 2, lumbarX: 1 };
/** Distance from p to a closed outline's edges. */
const toOutline = (poly: V[], p: V) => Math.min(...poly.map((a, i) => { const b = poly[(i + 1) % poly.length]!, dx = b[0]! - a[0]!, dy = b[1]! - a[1]!;
  const t = Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(p[0]! - a[0]! - t * dx, p[1]! - a[1]! - t * dy); }));
const measure = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf4' }), cam = qaEng.cameraOf(spec, r.report);
  const L = qaEng.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body }, spec);
  const c = spec.callouts.find((x: any) => x.key === 'lowback'), a = qaEng.resolvePoint(c.anchor, 'end', L.lm, cam);
  const torso = body.bodyShapes(body.fk(L.q.end, { height: 1.75 }), cam, { hand: 'flat' }).find((s: any) => s.key === 'torso').poly;
  return { outline: toOutline(torso, a), floor: Math.abs(cam.P([0, 0, 0])[1] - a[1]), lumbarX: Math.abs(cam.P(L.lm.end.lumbar)[0] - a[0]) };
};
const problems = (spec: any) => {
  const m = measure(spec), out: string[] = [];
  if (!(m.outline <= BAR.outline)) out.push(`anchor ${m.outline.toFixed(1)} px off the torso outline`);
  if (!(m.floor <= BAR.floor)) out.push(`anchor ${m.floor.toFixed(1)} px above the floor`);
  if (!(m.lumbarX <= BAR.lumbarX)) out.push(`anchor ${m.lumbarX.toFixed(1)} px from the lumbar x`);
  return out;
};
const withAnchor = (anchor: any) => ({ ...S, callouts: S.callouts.map((c: any) => (c.key === 'lowback' ? { ...c, anchor } : c)) });

describe('LIB-PLATEFIX-4 v_up: the LOW BACK DOWN leader ends on the floor contact under the low back (pf10 T09 R4)', { timeout: 600_000 }, () => {
  it('the anchor lies on the lying torso\'s underside, at the floor, under the lumbar landmark', () => {
    const m = measure(S);
    console.log(`PF4 v_up: anchor ${m.outline.toFixed(2)} px off the outline, ${m.floor.toFixed(2)} px above the floor, ${m.lumbarX.toFixed(2)} px from the lumbar x`);
    expect(problems(S)).toEqual([]);
  });
  it('mutations: main\'s navel anchor (the belly), the lumbar landmark inside the trunk and the contact 4 cm toward the hips are red', () => {
    expect(problems(withAnchor('navel'))).toEqual(['anchor 29.5 px above the floor', expect.stringMatching(/from the lumbar x$/)]);   // on the outline, but its top (belly) side
    expect(problems(withAnchor('lumbar'))).toEqual([expect.stringMatching(/off the torso outline$/), 'anchor 3.3 px above the floor']);
    const [x, y, z] = M.LOWBACK;
    expect(problems(withAnchor([x, y, z + 0.04]))).toEqual([expect.stringMatching(/from the lumbar x$/)]);
  });
});
