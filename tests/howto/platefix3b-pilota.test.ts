// LIB-PLATEFIX-3b item 23, barbell_overhead_press (pilot A; rulings: supervisor on #405 6682844211, PLAN on #408).
// Each value is read from the engine's own render (svg, report) and landmarks (camera of the render), never from the
// spec's constants. The base spec (branch head 30338191) fails both blocks: it drew the 'Forearm' measure label on the
// pill's forearm, and no guide on the start forearm's axis. Ruling (c) (lockout head/arm) is not tested here: its
// target is unreachable by a head pose (reported to the supervisor with the numbers).
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, body: any, eq: any, qaEng: any, ohp: any;
beforeAll(async () => {
  [plate, body, eq, qaEng] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'qa/engine.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  ohp = (await import(/* @vite-ignore */ lib('specs/barbell_overhead_press.mjs'))).default;
}, 600_000);
const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body });
const pxOf = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf3b23' }), cam = qaEng.cameraOf(spec, r.report), L = qaEng.poseLandmarks(Eng(), spec);
  return { r, P: (pose: string, k: string) => cam.P(L.lm[pose][k]) as number[] };
};
/** Labels the render draws on the start forearm: callouts anchored on its elbow/grip, and a measure whose vertex is its elbow. */
const forearmLabels = (spec: any) => {
  const { r } = pxOf(spec), onFore = (a: any) => a?.along && a.along.every((p: any) => p.pose === 'start' && ['elbow.r', 'grip.r', 'wrist.r'].includes(p.at));
  const drawn = new Set(r.report.labels.map((l: any) => l.key));
  return [...spec.callouts.filter((c: any) => onFore(c.anchor)).map((c: any) => c.key),
    ...(spec.measure?.vertex?.at === 'elbow.r' && spec.measure.vertex.pose === 'start' ? ['_arc'] : [])].filter(k => drawn.has(k));
};
/** Two-point dashed guide paths in the render's svg, as [[x, y], [x, y]]. */
const guides = (svg: string) => [...svg.matchAll(/<path class="eq-line m-line" d="M([\d.-]+) ([\d.-]+)L([\d.-]+) ([\d.-]+)"\/>/g)]
  .map(m => [[+m[1]!, +m[2]!], [+m[3]!, +m[4]!]]);
const onStartFore = (spec: any) => {
  const { r, P } = pxOf(spec), e = P('start', 'elbow.r'), w = P('start', 'wrist.r');
  const d = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);
  return { len: d(e, w), hits: guides(r.svg).filter(([a, b]) => Math.max(d(a!, e), d(b!, w)) <= 1 || Math.max(d(a!, w), d(b!, e)) <= 1) };
};

describe('PF3b item 23 (a): one label on the start forearm (the pill, no duplicate measure)', () => {
  it('exactly one label names the start forearm, the "Forearms vertical" pill', () => {
    expect(forearmLabels(ohp)).toEqual(['forearms']);
    expect(ohp.callouts.find((c: any) => c.key === 'forearms').text).toBe('Forearms<br>vertical');
  });
  it('mutation: the base measure ("Forearm" / "vertical" at the start elbow) back is red', () => {
    const m = { ...ohp, measure: { vertex: { at: 'elbow.r', pose: 'start' }, from: 'up', to: { at: 'grip.r', pose: 'start' }, radius: 12, title: 'Forearm', value: 'vertical', box: { left: 258, top: 172 } } };
    expect(forearmLabels(m)).toEqual(['forearms', '_arc']);
  });
});
describe('PF3b item 23 (b): the start forearm is drawn as a dashed overlay guide', () => {
  it('one dashed guide runs start elbow to start wrist (each end within 1 px), over the lockout figure', () => {
    const { len, hits } = onStartFore(ohp);
    expect(len).toBeGreaterThan(29);   // the 29.9 px start forearm the critic named
    expect(hits).toHaveLength(1);
  });
  it('the guide is not drawn in the Mistake plate (the start arm is not drawn there)', () => {
    const m = plate.renderPlate(ohp, { id: 'pf3b23m', mistake: true }), { P } = pxOf(ohp), e = P('start', 'elbow.r');
    expect(guides(m.svg).filter(([a]) => Math.hypot(a![0]! - e[0]!, a![1]! - e[1]!) <= 1)).toHaveLength(0);
  });
  it('mutation: the guide moved 2 px (or removed) is red', () => {
    const shift = (spec: any, f: (it: any) => any) => ({ ...spec, equipment: spec.equipment.map((e: any) => typeof e !== 'function' ? e
      : (lm: any, ctx: any) => { const out = e(lm, ctx); return Array.isArray(out) ? out.map(it => (it?.part === 'startfore' ? f(it) : it)).filter(Boolean) : out; }) });
    expect(onStartFore(shift(ohp, it => ({ ...it, pts: it.pts.map((p: number[]) => [p[0], p[1], p[2]! + 2 / pxOf(ohp).r.report.camera.pxPerM]) }))).hits).toHaveLength(0);
    expect(onStartFore(shift(ohp, () => null)).hits).toHaveLength(0);
  });
});
