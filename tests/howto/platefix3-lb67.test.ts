// LIB-PLATEFIX-3 W6 items (PLAN ADDENDUM ruled #405 6683319630; W6 PANEL FIX #393 6683164302): machine_pullover,
// rear_delt_fly, high_to_low_cable_fly, smith_machine_squat. Values are read from the engine's landmarks, shapes and
// drawn svg (the render's own camera), never from the specs' constants. Main's drawings fail every block (recorded on
// the PR).
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, body: any, eq: any, qaEng: any, mp: any, mpMod: any, rdf: any, htl: any, sms: any;
beforeAll(async () => {
  [plate, body, eq, qaEng] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'qa/engine.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  mpMod = await import(/* @vite-ignore */ lib('specs/machine_pullover.mjs')); mp = mpMod.default;
  rdf = (await import(/* @vite-ignore */ lib('specs/rear_delt_fly.mjs'))).default;
  htl = (await import(/* @vite-ignore */ lib('specs/high_to_low_cable_fly.mjs'))).default;
  sms = (await import(/* @vite-ignore */ lib('specs/smith_machine_squat.mjs'))).default;
});
const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body });
const H = 1.75, B = { height: H };
const probe = { view: 'side', facing: 'right', near: 'r', pxm: 1, P: (w: number[]) => [w[2]!, -w[1]!] };

/** machine_pullover: the largest gap (px at the plate's scale) between the pad face and the back edge of the torso
 *  outline, from the buttock to the upper back, in one pose. */
const backGap = (pose: any, pxm: number) => {
  const pad = mpMod.PM.pad, off = (y: number, z: number) => ((y - pad.point[1]) * pad.normal[1] + (z - pad.point[2]) * pad.normal[2]) * pxm;
  const sk = body.fk(body.resolve(body.normPose(pose, B), B).q, B), lm = body.landmarks(sk);
  const torso = body.bodyShapes(sk, probe).find((s: any) => s.key === 'torso').poly;
  let best = -1e9;
  for (let y = lm.buttock[1] + 0.03; y <= lm.backUpper[1] - 0.03; y += 0.005) {
    let mn = 1e9;
    for (let i = 0; i < torso.length; i++) {
      const a = torso[i], b = torso[(i + 1) % torso.length], ya = -a[1], yb = -b[1];
      if ((ya - y) * (yb - y) > 0 || ya === yb) continue;
      mn = Math.min(mn, off(y, a[0] + (b[0] - a[0]) * (y - ya) / (yb - ya)));
    }
    if (mn < 1e9) best = Math.max(best, mn);
  }
  return { gap: best, backUpper: off(lm.backUpper[1], lm.backUpper[2]), buttock: off(lm.buttock[1], lm.buttock[2]), seat: lm.seat };
};

describe('PF3 W6 machine_pullover: the lower back arches off the pad (c8) and the pivot hub shows at the shoulder (c1)', () => {
  it('the Mistake back edge stands at least 15 px off the pad (main 14.2 px as a slide: the upper back 7.6 px off too); the upper back and the buttock stay within 1 px of the pad', () => {
    const r = plate.renderPlate(mp, { id: 'pf3' }), pxm = r.report.camera.pxPerM;
    const m = backGap({ ...mp.poses.end, ...mp.mistake.pose }, pxm), e = backGap(mp.poses.end, pxm);
    expect(m.gap, `gap ${m.gap.toFixed(2)} px (Right ${e.gap.toFixed(2)})`).toBeGreaterThanOrEqual(15);
    expect(Math.abs(m.backUpper - e.backUpper), 'upper back on the pad').toBeLessThanOrEqual(1);
    expect(Math.abs(m.buttock - e.buttock), 'buttock on the pad').toBeLessThanOrEqual(1);
  });
  it('the Mistake seat stays on the seat top (+-0.5 cm)', () => {
    const lm = qaEng.poseLandmarks(Eng(), mp).lm;
    expect(Math.abs(lm.mistake.seat[1] - lm.end.seat[1]) * 100).toBeLessThanOrEqual(0.5);
  });
  it('the arched back edge is drawn as a dashed guide over the figure', () => {
    expect(mp.mistake.guides.some((g: any) => g.kind === 'dashed' && g.pts.length >= 10)).toBe(true);
  });
  it('the hub rim is drawn in front of the figure in the end pose, centred within 10 px of the shoulder joint (main: hidden behind the figure)', () => {
    const L = qaEng.poseLandmarks(Eng(), mp), items = mp.equipment.flatMap((e: any) => [].concat(typeof e === 'function' ? e(L.lm.end, { pose: 'end', start: L.lm.start, mistake: false, body: L.body }) ?? [] : e));
    const front = items.filter((it: any) => it && it.z === 'front' && it.pts && it.pts.every((p: number[]) => Math.abs(Math.hypot(p[1]! - mpMod.PM.pivot[1], p[2]! - mpMod.PM.pivot[2]) - 0.045) < 1e-6));
    expect(front.length).toBe(1);
    const cam = qaEng.cameraOf(mp, plate.renderPlate(mp, { id: 'pf3' }).report), piv = cam.P(mpMod.PM.pivot), sh = cam.P(L.lm.end['shoulder.r']);
    expect(Math.hypot(piv[0] - sh[0], piv[1] - sh[1])).toBeLessThanOrEqual(10);
  });
});

describe('PF3 W6 rear_delt_fly: the chest pad in front of the chest (c1, c6)', () => {
  it('the chest pad (pecDeck backPad) is drawn at z front, and nothing else of the deck moves layer', () => {
    const L = qaEng.poseLandmarks(Eng(), rdf), ctx = { pose: 'end', start: L.lm.start, mistake: false, body: L.body };
    const items = rdf.equipment.map((e: any) => (typeof e === 'function' ? e(L.lm.end, ctx) : e));
    // entry 0 is the floor; entries 1.. are pecDeck's items in its order, item 1 the chest pad (the 30 cm wide backPad)
    const pad = items[2];
    expect(pad).toMatchObject({ type: 'backPad', width: 0.3, z: 'front' });
    expect(items.flat().filter((it: any) => it && it !== pad && it.z === 'front').length).toBe(0);
  });
});

describe('PF3 W6 high_to_low_cable_fly: the Trace drops first, then sweeps in (c6)', () => {
  it('the drawn Trace bows at least 15 px off its chord (main 2.0 px: a straight diagonal), below-outside of it', () => {
    const d = plate.renderPlate(htl, { id: 'pf3' }).svg.match(/<path class="trace" pathLength="1" d="([^"]*)"/)![1]!;
    const n = d.match(/-?[\d.]+/g)!.map(Number), pts: number[][] = [];
    for (let i = 0; i < n.length; i += 2) pts.push([n[i]!, n[i + 1]!]);
    const a = pts[0]!, b = pts.at(-1)!, ab = [b[0]! - a[0]!, b[1]! - a[1]!], l = Math.hypot(ab[0]!, ab[1]!);
    const dev = Math.max(...pts.map(p => Math.abs((p[0]! - a[0]!) * ab[1]! - (p[1]! - a[1]!) * ab[0]!) / l));
    expect(dev, `${dev.toFixed(1)} px`).toBeGreaterThanOrEqual(15);
    // "down first": at the chord's midpoint height the Trace is still on the open side (left of the chord for the
    // figure's right hand, viewer's left)
    const mid = pts[Math.floor(pts.length / 2)]!, side = (mid[0]! - a[0]!) * ab[1]! - (mid[1]! - a[1]!) * ab[0]!;
    expect(side).toBeLessThan(0);
  });
});

describe('PF3 W6 smith_machine_squat: the knees tell names no landmark (c3)', () => {
  it('the knees tell cue is "Your knees travel too far forward."', () => {
    expect(sms.mistake.tells.find((t: any) => t.key === 'knees').cue).toBe('Your knees travel too far forward.');
  });
});
