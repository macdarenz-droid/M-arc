// LIB-PLATEFIX-5 item 2 (card verify/lib-platefix-5-card.md; PLAN RULED #419 6849391955), pendulum_squat: pf8 R6 [3,4,3] read the
// Trace as "a 45 px knee stub" (#405 6688665575). Research 207b8de8 (#414) adds c23 and plate.frames "Trace follows the machine's
// pendulum arc (c23)". D-PF5-PENDHIP: the Trace follows hip.r, which rides the carriage's back pad (c3), so its path is the arc
// about the pivot. Each value is read from the engine's own pose interpolation and the drawn svg (the render's camera).
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const T = 300_000;
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, body: any, mk: any, M: any, spec: any, env: any;
beforeAll(async () => {
  [plate, body, mk, M] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', 'qa/markup.mjs', 'specs/pendulum_squat.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  spec = M.default;
  env = JSON.parse(readFileSync('tools/plates/library/qa/envelope.json', 'utf8'));
}, T);
const B = { height: 1.75 };

/** The Trace as the engine samples it (plate.mjs trace block: n + 1 samples of poseAt over start, via, end), the camera of the
 *  render, the projected pivot, and the drawn trace path and arrowhead. */
const traceOf = (s: any) => {
  const r = plate.renderPlate(s, { id: 'pf5' }), c = r.report.camera;
  const P = (w: number[]) => [c.x0 + w[2]! * c.pxPerM, c.y0 - w[1]! * c.pxPerM];
  const keys = [s.poses.start, ...(s.poses.via ?? []), s.poses.end].map((p: any) => body.normPose(p, B));
  const n = s.trace.samples ?? 48, pts: number[][] = [];
  for (let i = 0; i <= n; i++) pts.push(P(body.landmarks(body.fk(body.poseAt(keys, i / n, B).q, B))[s.trace.point]));
  const head = /<path class="arrow" d="M(-?[\d.]+)[ ,](-?[\d.]+)L/.exec(r.svg);
  const drawn = mk.pathsOf(r.svg, 'trace').reduce((a: number, d: string) => a + mk.pathLength(d), 0);
  return { pts, piv: P(M.PIVOT), tip: head ? [+head[1]!, +head[2]!] : null, drawn, end: pts[n]! };
};
const dist = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);
/** Largest distance of any sample from the circle about the projected pivot through the start sample (the carriage's radius). */
const offCircle = (t: any) => { const r0 = dist(t.pts[0], t.piv); return Math.max(...t.pts.map((p: number[]) => Math.abs(dist(p, t.piv) - r0))); };
const arc = (t: any) => t.pts.slice(1).reduce((a: number, p: number[], i: number) => a + dist(p, t.pts[i]), 0);
const sha = (f: string) => createHash('sha256').update(readFileSync(f)).digest('hex');

describe('PF5 item 2 pendulum_squat: the Trace on the pendulum arc (hip.r, D-PF5-PENDHIP)', { timeout: T }, () => {
  it('the card and quotes are research 207b8de8\'s bytes, and plate.frames names the arc (c23)', () => {
    expect(sha('docs/research/howto/cards/pendulum_squat.json')).toBe('a71d1bc2e5faa96ad8611d1b78e16f2573d9d60372b0235e220615e7b85029f8');
    expect(sha('docs/research/howto/quotes/pendulum_squat.json')).toBe('b3ab1494652987aafb532f930391e2d3a864b249db1473d1601966c34f6193ef');
    expect(JSON.parse(readFileSync('docs/research/howto/cards/pendulum_squat.json', 'utf8')).plate.frames).toMatch(/Trace follows the machine's pendulum arc \(c23\)/);
  });
  it('the Trace point is hip.r, and every engine sample lies within 1.5 px of one circle about the projected pivot (hip.r 0.16 px; knee.r 23 px)', () => {
    expect(spec.trace.point).toBe('hip.r');
    const t = traceOf(spec), off = offCircle(t);
    console.log(`PF5 pendulum Trace: ${off.toFixed(3)} px off the pivot circle, arc ${arc(t).toFixed(2)} px, drawn ${t.drawn.toFixed(2)} px, tip ${t.tip ? dist(t.tip, t.end).toFixed(2) : '-'} px from the end hip`);
    expect(off).toBeLessThanOrEqual(1.5);
  });
  it('the arrowhead ends on the drawn end hip (within 1 px), and the drawn Trace is at least traceLenMin and 80 % of the start-to-end hip arc', () => {
    const t = traceOf(spec);
    expect(t.tip).not.toBeNull();
    expect(dist(t.tip!, t.end)).toBeLessThanOrEqual(1);
    expect(t.drawn).toBeGreaterThanOrEqual(env.traceLenMin);
    expect(t.drawn).toBeGreaterThanOrEqual(0.8 * arc(t));
  });
  it('mutation: knee.r (main\'s point) is off the pivot circle by more than 1.5 px', () => {
    expect(offCircle(traceOf({ ...spec, trace: { ...spec.trace, point: 'knee.r' } }))).toBeGreaterThan(1.5);
  });
  it('mutation: the via poses removed (start to end in a straight chord) is off the pivot circle by more than 1.5 px', () => {
    expect(offCircle(traceOf({ ...spec, poses: { ...spec.poses, via: [] } }))).toBeGreaterThan(1.5);
  });
  it('mutation: main\'s trim [6, 8] keeps under 80 % of the arc; a trim cutting more than 20 % ([6, 20]) is red too', () => {
    for (const trim of [[6, 8], [6, 20]]) {
      const t = traceOf({ ...spec, trace: { ...spec.trace, trim } });
      expect(t.drawn < 0.8 * arc(t) || dist(t.tip!, t.end) > 1, `trim ${trim}`).toBe(true);
    }
  });
});
