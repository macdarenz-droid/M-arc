// LIB-PLATEFIX-3b item D (pfc-findings b5065795 set a T01 L7; layers critics c2, c3): v_up's top position (the V, the spec
// start, drawn by plate.mjs's dashed start layer) must read as a whole figure that fills the plate. Measured on the render:
// the svg's start-layer defs, and the engine's drawn shapes and landmarks projected with the render's own camera
// (qa/engine.mjs cameraOf on renderPlate's report). Red on the branch base (e8615508): the drawing's extent 141.5 px (48.0 % of
// the 295 px fit box), the ankle 0.69 m above the hip and the hands 22.4 px off the shin-and-foot line. Mutation: the
// floor put back to -1.3 .. 1.0 m (THORAX_V kept at 76) drops the fit scale to 141.74 px/m and the extent under 177 px: red.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const SIZE = 358, FIT_BOX = SIZE - 44 - 19;          // plate.mjs's fit margins (top 44, bottom 19): the content height
const B = { height: 1.75 };
let plate: any, qaEng: any, body: any, eq: any, spec: any;
beforeAll(async () => {
  [plate, qaEng, body, eq] = await Promise.all(['../vendor/engine/plate.mjs', 'qa/engine.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  spec = (await import(/* @vite-ignore */ lib('specs/v_up.mjs'))).default;
}, 600_000);

const partOf = (key: string) => { const [k, sd] = key.split('.'); return ['shcap', 'upper', 'elbowcap', 'fore', 'fist', 'palm'].includes(k!) ? `arm.${sd}` : ['thigh', 'kneecap', 'shank', 'foot'].includes(k!) ? `leg.${sd}` : 'trunk'; };
const inside = (p: number[], poly: number[][]) => { let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i]!, b = poly[j]!;
    if ((a[1]! > p[1]!) !== (b[1]! > p[1]!) && p[0]! < (b[0]! - a[0]!) * (p[1]! - a[1]!) / (b[1]! - a[1]!) + a[0]!) c = !c; }
  return c; };
const segDist = (p: number[], a: number[], b: number[]) => { const d = [b[0]! - a[0]!, b[1]! - a[1]!];
  const t = Math.max(0, Math.min(1, ((p[0]! - a[0]!) * d[0]! + (p[1]! - a[1]!) * d[1]!) / (d[0]! ** 2 + d[1]! ** 2)));
  return Math.hypot(p[0]! - a[0]! - t * d[0]!, p[1]! - a[1]! - t * d[1]!); };

/** The render (normal plate), its camera, the start and end landmarks and drawn shapes at that camera. */
function measure(s: any) {
  const r = plate.renderPlate(s, { id: 'x' }), cam = qaEng.cameraOf(s, r.report);
  const L = qaEng.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body }, s);
  const shapes = (pose: string) => body.bodyShapes(body.fk(L.q[pose], B), cam, { hand: s.hand }).filter((x: any) => x.poly);
  const st = shapes('start').filter((x: any) => s.startParts.includes(x.key) || s.startParts.includes(partOf(x.key))), en = shapes('end');
  const ys = [...st, ...en].flatMap((x: any) => x.poly.map((q: number[]) => q[1]));
  const floorY = cam.P([0, 0, 0])[1] as number;
  // the visible outline of a start shape: an edge is drawn where its midpoint is inside no other start shape of the same
  // or a later group (one union per group, far < trunk < near) and no end shape (the solid end layer is drawn over it)
  const ord: Record<string, number> = { far: 0, trunk: 1, near: 2 };
  const visible = (key: string) => { const x = st.find((y: any) => y.key === key), p = x.poly; let v = 0;
    for (let k = 0; k < p.length; k++) { const a = p[k], b = p[(k + 1) % p.length], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const hid = m[1]! > floorY || st.some((y: any) => y !== x && ord[y.group]! >= ord[x.group]! && inside(m, y.poly)) || en.some((y: any) => inside(m, y.poly));
      if (!hid) v += Math.hypot(b[0] - a[0], b[1] - a[1]); }
    return v; };
  const P = (k: string) => cam.P(L.lm.start[k]) as number[];
  return { r, cam, extent: Math.max(...ys) - Math.min(...ys), top: Math.min(...ys), floorY, visible, P };
}

describe('LIB-PLATEFIX-3b D: v_up\'s V is a whole dashed figure that fills the plate (L7, c3 c8)', () => {
  it('the start layer draws the V\'s torso, head, thigh, kneecap, shank and foot (svg defs), each with a visible outline', () => {
    const m = measure(spec);
    for (const k of ['torso', 'head', 'thigh.r', 'kneecap.r', 'shank.r', 'foot.r', 'upper.r', 'fore.r']) expect(m.r.svg, k).toContain(`id="x-st-${k}"`);
    // px of drawn outline (2026-11-07, at the fix: torso 125, thigh 78, shank 127, foot 78)
    expect(m.visible('torso')).toBeGreaterThanOrEqual(100);
    expect(m.visible('thigh.r')).toBeGreaterThanOrEqual(60);
    expect(m.visible('shank.r')).toBeGreaterThanOrEqual(100);
    expect(m.visible('foot.r')).toBeGreaterThanOrEqual(60);
  });
  it('the hands reach the shins or toes: the near grip within 15 px (about 10 cm) of the knee-ankle-toe line (base: 22.4 px; fix: 11.8 px)', () => {
    const { P } = measure(spec), g = P('grip.r');
    const d = Math.min(segDist(g, P('knee.r'), P('ankle.r')), segDist(g, P('ankle.r'), P('toe.r')));
    expect(d).toBeLessThanOrEqual(15);
  });
  it('the V\'s legs and torso rise from the hips: the ankle and the shoulder well above the hip (base: ankle 0.69 m)', () => {
    const { P, cam } = measure(spec), rise = (k: string) => (P('hip.r')[1]! - P(k)[1]!) / cam.pxPerM;
    expect(rise('ankle.r')).toBeGreaterThanOrEqual(0.7);       // metres of rise (fix: 0.84)
    expect(rise('shoulder.r')).toBeGreaterThanOrEqual(0.35);   // (fix: 0.38)
  });
  it('the drawing\'s vertical extent (the drawn start and end figures) is at least 60 % of the 295 px fit box (base: 141.5 px; fix: 179.9 px), at a scale inside F1\'s envelope', () => {
    const m = measure(spec);
    expect(m.cam.pxPerM).toBeLessThanOrEqual(146.29);   // qa/envelope.json F1 top: v_up is not a named F1 plate
    expect(m.extent).toBeGreaterThanOrEqual(0.6 * FIT_BOX);
    expect(m.top).toBeLessThan(m.floorY - 0.6 * FIT_BOX + 1);
  });
  it('mutation: the floor put back to -1.3 .. 1.0 m lowers the fit scale and the extent falls under 60 % (red)', () => {
    const m = measure({ ...spec, equipment: [{ type: 'floor', from: -1.3, to: 1.0 }] });
    expect(m.cam.pxPerM).toBeCloseTo(141.74, 1);
    expect(m.extent).toBeLessThan(0.6 * FIT_BOX);
  });
});
