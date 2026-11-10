// LIB-PLATEFIX-4 jump_rope, the Mistake overlay (#394 6701937875 D-PFR-JUMPROPE: "the Mistake figure is drawn about 165 px
// to the side, not over the Right pose"; pfc #394 6701001868 T02 c1: "Use the house overlay: draw the red dashed figure at
// the same x as the solid one, lifted, with the gap arrow under the feet. Keep the rope loop on the solid figure only.";
// pf7 R5 c2, c3: the red head top >= 42 px (critic, 21 px plate) over the solid one, the feet ~93 px (about 12 in) up).
// Measured from the engine's landmarks at the render's camera (plate px) and the Mistake render:
//  - the red figure's x within 3 px of the solid's (head, hips, hands, soles);
//  - the red head top >= 21 px over the solid head top; the red feet's lowest point >= 44 px over the floor (12 in);
//  - one gap arrow, vertical, from the floor (<= 2 px) up to the red feet's lowest point (<= 2 px), 9-14 px outside the
//    solid figure's outer edge below its top: beside the feet, not under them, since the house rule (lb10-plates.test.ts
//    'no solid red arrow comes within 6 px of the solid end figure', DESIGN.md 13.1/13.4 must-fix 1) forbids an arrow on
//    the solid feet; 9 px = the 6 px rule plus the 3 px arrowhead half width;
//  - no rope drawn on the red figure (no moved equipment in the Mistake layer); the red body is drawn.
// Red on main's spec (a41d350f): the red figure 80.5 px aside, its feet 29.3 px up, the arrow 4.2 px short of its feet, a red rope.
// The hand zoom, grip and wrist row are F-JUMPROPE-HAND, not tested here.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, qaEng: any, body: any, eq: any, M: any, S: any;
beforeAll(async () => {
  [plate, qaEng, body, eq, M] = await Promise.all(['../vendor/engine/plate.mjs', 'qa/engine.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'specs/jump_rope.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  S = M.default;
}, 600_000);

type V = number[];
const FOOT = ['heel.l', 'heel.r', 'ball.l', 'ball.r', 'toe.l', 'toe.r'];
const XS = ['head', 'hip.l', 'hip.r', 'grip.l', 'grip.r', 'sole.l', 'sole.r'];
/** Everything the checks read, for one spec. */
const measure = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf4' }), cam = qaEng.cameraOf(spec, r.report);
  const L = qaEng.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body }, spec);
  const P = (pose: string, k: string): V => cam.P(L.lm[pose][k]);
  const headTop = (pose: string) => Math.min(...body.bodyShapes(body.fk(L.q[pose], { height: 1.75 }), cam).find((s: any) => s.key === 'head').poly.map((p: V) => p[1]!));
  const floorY = cam.P([0, 0, 0])[1]!, lowM = Math.max(...FOOT.map(k => P('mistake', k)[1]!));
  const arrows = spec.mistake.guides.filter((g: any) => g.kind === 'arrow').map((g: any) => [g.from, g.to].map((p: any) => qaEng.resolvePoint(p, 'mistake', L.lm, cam)));
  const a = arrows[0], top = a ? Math.min(a[0][1], a[1][1]) : 0;
  const edge = Math.max(...body.bodyShapes(body.fk(L.q.end, { height: 1.75 }), cam, { armsFront: spec.armsFront }).flatMap((s: any) => s.poly).filter((p: V) => p[1]! >= top - 1.5).map((p: V) => p[0]!));
  const svg = plate.renderPlate(spec, { id: 'pf4', mistake: true }).svg as string;
  return {
    dx: Math.max(...XS.map(k => Math.abs(P('mistake', k)[0]! - P('end', k)[0]!))),
    headLift: headTop('end') - headTop('mistake'), feetUp: floorY - lowM,
    arrows: arrows.length, arrowDx: a ? Math.abs(a[0][0] - a[1][0]) : Infinity, beside: a ? a[1][0] - edge : NaN,
    arrowFloor: a ? Math.abs(Math.max(a[0][1], a[1][1]) - floorY) : Infinity, arrowFeet: a ? Math.abs(Math.min(a[0][1], a[1][1]) - lowM) : Infinity,
    redEq: (svg.match(/id="pf4-m-eq\d+"/g) ?? []).length, redBody: (svg.match(/id="pf4-m-(head|torso|thigh|shank|foot|upper|fore)\.?[lr]?"/g) ?? []).length,
  };
};
const xOk = (m: any) => m.dx <= 3;
const liftOk = (m: any) => m.headLift >= 21 && m.feetUp >= 44;
const arrowOk = (m: any) => m.arrows === 1 && m.arrowDx <= 1 && m.beside >= 9 && m.beside <= 14 && m.arrowFloor <= 2 && m.arrowFeet <= 2;
const ropeOk = (m: any) => m.redEq === 0 && m.redBody >= 5;

describe('PF4 jump_rope: the red Mistake figure is the house overlay', () => {
  let m: any;
  beforeAll(() => { m = measure(S); console.log('PF4 jump_rope', JSON.stringify(m, (k, v) => typeof v === 'number' ? +v.toFixed(2) : v)); }, 600_000);
  it('the red figure is drawn at the solid one\'s x (head, hips, hands and soles within 3 px)', () => {
    expect(m.dx).toBeLessThanOrEqual(3);
  });
  it('lifted at least the critics\' height: the red head top >= 21 px over the solid one, the red feet >= 44 px (12 in) over the floor', () => {
    expect(m.headLift).toBeGreaterThanOrEqual(21);
    expect(m.feetUp).toBeGreaterThanOrEqual(44);
  });
  it('one gap arrow beside the feet: vertical, 9-14 px outside the solid figure, from the floor up to the red feet\'s lowest point', () => {
    expect(m.arrows).toBe(1);
    expect(m.arrowDx).toBeLessThanOrEqual(1);
    expect(m.beside).toBeGreaterThanOrEqual(9);
    expect(m.beside).toBeLessThanOrEqual(14);
    expect(m.arrowFloor).toBeLessThanOrEqual(2);
    expect(m.arrowFeet).toBeLessThanOrEqual(2);
  });
  it('the rope loop is on the solid figure only: the Mistake layer draws the red body and no equipment', () => {
    expect(m.redEq).toBe(0);
    expect(m.redBody).toBeGreaterThanOrEqual(5);
  });
  it('mutations turn each check red', { timeout: 600_000 }, () => {
    const shift = (dx: number) => ({ ...S.mistake.pose, root: { ...S.mistake.pose.root, at: [S.mistake.pose.root.at[0] + dx, ...S.mistake.pose.root.at.slice(1)] } });
    const lift = (dy: number) => ({ ...S.mistake.pose, root: { ...S.mistake.pose.root, at: [S.mistake.pose.root.at[0], S.mistake.pose.root.at[1] + dy, S.mistake.pose.root.at[2]] } });
    expect(xOk(measure({ ...S, mistake: { ...S.mistake, pose: shift(0.03) } }))).toBe(false);            // 4.4 px aside
    expect(xOk(measure({ ...S, mistake: { ...S.mistake, pose: shift(0.55) } }))).toBe(false);            // main's offset
    expect(liftOk(measure({ ...S, mistake: { ...S.mistake, pose: lift(-0.105) } }))).toBe(false);        // main's M_HOP 0.2
    const g = S.mistake.guides[0], at = (p: V, dx: number, dy = 0) => [p[0]! + dx, p[1]! + dy, p[2]];
    const withArrow = (gd: any) => ({ ...S, mistake: { ...S.mistake, guides: [gd] } });
    expect(arrowOk(measure({ ...S, mistake: { ...S.mistake, guides: [] } }))).toBe(false);
    expect(arrowOk(measure(withArrow({ ...g, from: at(g.from, 0.04), to: at(g.to, 0.04) })))).toBe(false);   // 5.9 px further out
    expect(arrowOk(measure(withArrow({ ...g, from: at(g.from, -0.03), to: at(g.to, -0.03) })))).toBe(false); // 4.4 px in: on the 6 px band
    expect(arrowOk(measure(withArrow({ ...g, from: [0, g.from[1], g.from[2]], to: [0, g.to[1], g.to[2]] })))).toBe(false); // on the midline
    expect(arrowOk(measure(withArrow({ ...g, from: at(g.from, 0, 0.03) })))).toBe(false);                   // off the floor
    expect(arrowOk(measure(withArrow({ ...g, to: at(g.to, 0, -0.05) })))).toBe(false);                      // short of the feet
    expect(arrowOk(measure(withArrow({ ...g, to: at(g.to, 0.02, 0) })))).toBe(false);                       // slanted
    expect(ropeOk(measure({ ...S, mistake: { ...S.mistake, parts: undefined } }))).toBe(false);               // the rope moves with the red figure
    expect(ropeOk(measure({ ...S, mistake: { ...S.mistake, parts: ['rope'] } }))).toBe(false);                // no red body
  });
});
