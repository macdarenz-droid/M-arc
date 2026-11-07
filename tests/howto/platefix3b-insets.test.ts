// LIB-PLATEFIX-3b items 22 and 15 (#405 6682844211, #408 PLAN): the elbow flare a side view cannot show, in head-end
// insets (zoom/inline.mjs project 'head'). Measured on main's side plates: smith_machine_bench_press's flared upper arm
// 1.4 px side-on (the Right's 38.2 px); incline_barbell_bench_press's 9.8 px (end 25.9 px), a knot. Every value here is read
// from the engine's landmarks and the zoom's own projection and drawing (its joint markers and guide path), never from a
// spec constant. Main's specs have no zoom, so every block below is red there.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, body: any, eq: any, qaEng: any, zoom: any;
const S: Record<string, any> = {};
const IDS = ['smith_machine_bench_press', 'incline_barbell_bench_press'];
beforeAll(async () => {
  [plate, body, eq, qaEng, zoom] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'qa/engine.mjs', 'zoom/inline.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  for (const id of IDS) S[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`));
}, 600_000);
const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body });
const deg = (v: number) => v * 180 / Math.PI;
const sub = (a: number[], b: number[]) => [a[0]! - b[0]!, a[1]! - b[1]!];
const len = (v: number[]) => Math.hypot(v[0]!, v[1]!);
const angle = (a: number[], b: number[]) => deg(Math.acos((a[0]! * b[0]! + a[1]! * b[1]!) / (len(a) * len(b))));

/** The inset of `view`: its entry, drawn svg and circle, and a map of world points into the circle (zoom px), built from
 *  the zoom's own projection (postureUV), the plate camera's scale x k, and the region centre, as the zoom places it. */
function inset(id: string, view: 'normal' | 'mistake') {
  const spec = S[id].default, entry = zoom.zoomFor(spec, view);
  expect(entry, `${id}: a ${view} zoom entry`).toBeTruthy();
  const o = zoom.zoomOf(spec, { prefix: 't', view }), cam = qaEng.cameraOf(spec, plate.renderPlate(spec, { id: 't-n' }).report);
  const uv = zoom.postureUV(entry, cam, spec), s = cam.pxPerM * entry.k, R = zoom.focusPoints(spec, entry).map(uv);
  const xs = R.map((q: number[]) => q[0]), ys = R.map((q: number[]) => q[1]), mc = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
  const Z = (w: number[]) => { const q = uv(w); return [o.circle.c[0] + s * (q[0] - mc[0]!), o.circle.c[1] - s * (q[1] - mc[1]!)]; };
  const L = qaEng.poseLandmarks(Eng(), zoom.postureSpec(spec, entry)).lm, lm = L[view === 'mistake' ? 'mistake' : 'end'];
  return { spec, entry, o, Z, L, lm, arm: sub(Z(lm['elbow.r']), Z(lm['shoulder.r'])), torso: sub(Z(lm.hips), Z(lm.shoulders)) };
}
/** Plate px length of the right upper arm in the side plate, per pose (what main shows). */
const sideArm = (id: string, pose: string) => { const spec = S[id].default, cam = qaEng.cameraOf(spec, plate.renderPlate(spec, { id: 'q' }).report), L = qaEng.poseLandmarks(Eng(), spec).lm[pose];
  return len(sub(cam.P(L['elbow.r']), cam.P(L['shoulder.r']))); };
const joints = (svg: string) => [...svg.matchAll(/<circle class="joint" cx="([\d.-]+)" cy="([\d.-]+)"/g)].map(m => [+m[1]!, +m[2]!]);

describe.each(IDS)('PF3b %s: the head insets', id => {
  it('both views carry a head-projection inset with no source ring, inside the plate', () => {
    for (const view of ['normal', 'mistake'] as const) {
      const { o } = inset(id, view);
      expect(o.svg).toMatch(new RegExp(`^<g class="plate-zoom" data-view="${view}" data-k="1" data-c="[\\d. ]+" data-src="[\\d. ]+" data-focus="end" data-project="head" data-ring="none">`));
      expect(o.src).toBeNull();
      expect(o.posture).toEqual({ pose: 'end', project: 'head' });
    }
  });
  it('the measures are the drawing: the inset draws the end pose\'s shoulder and elbow joints where the projection puts them', () => {
    for (const view of ['normal', 'mistake'] as const) {
      const { o, Z, L } = inset(id, view), J = joints(o.svg);
      for (const k of ['shoulder.r', 'elbow.r']) {
        const p = Z(L.end[k]);
        expect(Math.min(...J.map(j => Math.hypot(j[0]! - p[0]!, j[1]! - p[1]!))), `${view} ${k}`).toBeLessThanOrEqual(0.01);
      }
    }
  });
  it('each upper arm is at least 20 px in the inset and inside its circle; the side plate cannot show the flared one', () => {
    for (const view of ['normal', 'mistake'] as const) {
      const { o, Z, lm, arm } = inset(id, view);
      expect(len(arm), `${view} upper arm px`).toBeGreaterThanOrEqual(20);
      for (const k of ['shoulder.r', 'elbow.r']) expect(len(sub(Z(lm[k]), o.circle.c)), `${view} ${k}`).toBeLessThanOrEqual(o.circle.r - 4);
    }
    expect(sideArm(id, 'mistake')).toBeLessThan(20);   // main: smith 1.4 px, incline 9.8 px
  });
});

describe('PF3b item 22 smith_machine_bench_press: about 45 deg vs level with the shoulders (c3, c7)', () => {
  it('Right: the upper arm 45 +-10 deg from the torso in the inset; Wrong: 90 +-10 deg', () => {
    const n = inset('smith_machine_bench_press', 'normal'), m = inset('smith_machine_bench_press', 'mistake');
    expect(Math.abs(angle(n.arm, n.torso) - 45), `Right ${angle(n.arm, n.torso).toFixed(1)}`).toBeLessThanOrEqual(10);
    expect(Math.abs(angle(m.arm, m.torso) - 90), `Wrong ${angle(m.arm, m.torso).toFixed(1)}`).toBeLessThanOrEqual(10);
  });
});

describe('PF3b item 15 incline_barbell_bench_press: the flared upper arm whole, red dashed (c7, c8, c9)', () => {
  it('the Mistake inset draws the flared upper arm as one closed dashed outline around the fault shoulder -> elbow, whole inside the circle', () => {
    const { o, Z, lm, arm } = inset('incline_barbell_bench_press', 'mistake');
    const paths = [...o.svg.matchAll(/<path class="m-line" d="([^"]+)"/g)].map(x => [...x[1]!.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map(q => [+q[1]!, +q[2]!]));
    expect(paths).toHaveLength(1);
    const P = paths[0]!, a = Z(lm['shoulder.r']), b = Z(lm['elbow.r']), ab = sub(b, a), L2 = ab[0]! ** 2 + ab[1]! ** 2;
    expect(len(sub(P[0]!, P[P.length - 1]!))).toBeLessThanOrEqual(0.01);   // closed
    for (const p of P) expect(len(sub(p, o.circle.c))).toBeLessThan(o.circle.r);   // whole: no point clipped
    // every outline point within the arm's radius band of the fault upper arm's axis, and the outline spans its whole length
    const t = P.map(p => ((p[0]! - a[0]!) * ab[0]! + (p[1]! - a[1]!) * ab[1]!) / L2);
    const d = P.map((p, i) => len(sub(p, [a[0]! + t[i]! * ab[0]!, a[1]! + t[i]! * ab[1]!])));
    expect(Math.min(...t)).toBeLessThan(0);
    expect(Math.max(...t)).toBeGreaterThan(1);
    expect(Math.max(...d)).toBeLessThanOrEqual(0.052 * 146.3 + 0.5);
    expect(len(arm)).toBeGreaterThanOrEqual(20);
    // red dashed: an m-line path in the zoom's mistake layer (.mistake-layer: stroke var(--mistake); .m-line: dashed; the
    // stroke colour is the browser QA's 'mistake' class, qa/browser.mjs)
    expect(o.svg).toMatch(/<g class="mistake-layer"><path class="m-line" d="/);
  });
  it('Wrong flared vs Right: the Wrong upper arm 90 +-10 deg from the torso, the Right 60 +-10 deg (c7: 45-75), at least 20 deg apart', () => {
    const n = inset('incline_barbell_bench_press', 'normal'), m = inset('incline_barbell_bench_press', 'mistake');
    const r = angle(n.arm, n.torso), w = angle(m.arm, m.torso);
    expect(Math.abs(w - 90), `Wrong ${w.toFixed(1)}`).toBeLessThanOrEqual(10);
    expect(Math.abs(r - 60), `Right ${r.toFixed(1)}`).toBeLessThanOrEqual(10);
    expect(w - r).toBeGreaterThanOrEqual(20);
  });
});
