// LIB-PLATEFIX-3 (PLAN RULED #405 6682844211), lb1 items: underhand_lat_pulldown (item 1, option A on #405 6682900616)
// and assisted_pull_up (item 2). Each value is read from the engine's own landmarks and drawn svg (camera of the render),
// never from the spec's constants. Main's drawing fails every block below (recorded on the PR).
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, body: any, eq: any, qaEng: any, ulp: any, apu: any;
beforeAll(async () => {
  [plate, body, eq, qaEng] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'qa/engine.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  ulp = (await import(/* @vite-ignore */ lib('specs/underhand_lat_pulldown.mjs'))).default;
  apu = (await import(/* @vite-ignore */ lib('specs/assisted_pull_up.mjs'))).default;
});
const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body });
/** Plate px of every landmark per pose, with the render's own camera. */
const pxOf = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf3' }), cam = qaEng.cameraOf(spec, r.report), L = qaEng.poseLandmarks(Eng(), spec);
  return { r, L, P: (pose: string, k: string) => cam.P(L.lm[pose][k]) as number[] };
};
const segDist = (p: number[], a: number[], b: number[]) => {
  const ab = [b[0]! - a[0]!, b[1]! - a[1]!], t = Math.max(0, Math.min(1, ((p[0]! - a[0]!) * ab[0]! + (p[1]! - a[1]!) * ab[1]!) / (ab[0]! ** 2 + ab[1]! ** 2)));
  return Math.hypot(p[0]! - a[0]! - t * ab[0]!, p[1]! - a[1]! - t * ab[1]!);
};
const deg = (v: number) => v * 180 / Math.PI;

describe('PF3 item 1 underhand_lat_pulldown: elbows down and back (c6)', () => {
  it('the end upper arm is at most 27 deg forward of vertical (main 34.2) and the elbow at least 25 cm under the shoulder', () => {
    const { P, L } = pxOf(ulp), s = P('end', 'shoulder.r'), e = P('end', 'elbow.r');
    const fwd = deg(Math.atan2(e[0]! - s[0]!, e[1]! - s[1]!));
    expect(fwd, `upper arm ${fwd.toFixed(1)} deg forward`).toBeLessThanOrEqual(27);
    expect(L.lm.end['shoulder.r'][1] - L.lm.end['elbow.r'][1]).toBeGreaterThanOrEqual(0.25);
  });
  it('the Mistake elbow stays at least 10 px behind the end elbow ("Elbows go back" still reads)', () => {
    const { P } = pxOf(ulp);
    expect(P('end', 'elbow.r')[0]! - P('mistake', 'elbow.r')[0]!).toBeGreaterThanOrEqual(10);
  });
  it('the "Elbows down, back" leader ends on the elbow and meets it at least 30 deg off the upper arm (main 0.3 deg: along it, from the shoulder)', () => {
    const { r, P } = pxOf(ulp), e = P('end', 'elbow.r'), s = P('end', 'shoulder.r');
    const leaders = [...r.svg.matchAll(/<path class="leader[^"]*" d="M(-?[\d.]+) (-?[\d.]+)L(-?[\d.]+) (-?[\d.]+)/g)].map(m => m.slice(1, 5).map(Number));
    const l = leaders.find(x => Math.hypot(x[0]! - e[0]!, x[1]! - e[1]!) <= 1);
    expect(l, 'a leader ends on elbow.r').toBeTruthy();
    const a1 = Math.atan2(l![3]! - l![1]!, l![2]! - l![0]!), a2 = Math.atan2(s[1]! - e[1]!, s[0]! - e[0]!);
    let d = Math.abs(deg(a1 - a2)) % 360; if (d > 180) d = 360 - d;
    expect(d, `leader ${d.toFixed(1)} deg off the upper arm`).toBeGreaterThanOrEqual(30);
  });
});

describe('PF3 item 2 assisted_pull_up: the whole bent arm reads (c8, R5)', () => {
  it('the Mistake elbow is 90 deg (+-1; main 106)', () => {
    const { L } = pxOf(apu);
    expect(Math.abs(L.q.mistake.elbow.r - 90)).toBeLessThanOrEqual(1);
  });
  it('the fault elbow is at least 20 px from the solid end arm (main 14.9), the fault shoulder at least 10 px', () => {
    const { P } = pxOf(apu), arm = ['shoulder.r', 'elbow.r', 'wrist.r'].map(k => P('end', k));
    const d = (k: string) => Math.min(segDist(P('mistake', k), arm[0]!, arm[1]!), segDist(P('mistake', k), arm[1]!, arm[2]!));
    expect(d('elbow.r')).toBeGreaterThanOrEqual(20);
    expect(d('shoulder.r')).toBeGreaterThanOrEqual(10);
  });
  it('the bent arm is drawn whole as its own dashed outlines (upper arm, elbow cap, forearm, fist), not in the changed-parts union', () => {
    expect(apu.mistake.parts).not.toContain('arm.r');
    const dashed = apu.mistake.guides.filter((g: any) => g.kind === 'dashed');
    expect(dashed.length).toBe(4);
    const m = plate.renderPlate(apu, { id: 'pf3m', mistake: true });
    const { P } = pxOf(apu), el = P('mistake', 'elbow.r');
    // the elbow-cap outline (a closed ring) is centred on the drawn fault elbow
    const cam = qaEng.cameraOf(apu, m.report), cap = dashed[1].pts.map((w: number[]) => cam.P(w));
    const c = cap.reduce((a: number[], p: number[]) => [a[0]! + p[0]! / cap.length, a[1]! + p[1]! / cap.length], [0, 0]);
    expect(Math.hypot(c[0] - el[0]!, c[1] - el[1]!)).toBeLessThanOrEqual(1);
  });
  it('the knees stay on the pad in the re-solved Mistake (the spec checks, within their tolerance)', () => {
    const { L } = pxOf(apu), chk = apu.checks.find((c: any) => c.pose === 'mistake' && c.landmark === 'knee.r');
    const off = (L.lm.mistake['knee.r'][1] - chk.plane.point[1]) * 100;
    expect(Math.abs(off), `${off.toFixed(2)} cm`).toBeLessThanOrEqual(chk.tol);
  });
});
