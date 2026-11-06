// LIB-PLATEFIX-3 (card verify/lib-platefix-3-card.md; PLAN RULED #405 6682844211): the lb5 plate fixes, items 9, 10 and
// 14. Each test reads what the engine draws (svg, report, landmarks) and fails on main's spec (5023f5c6); the
// before values are in each test's name or comment. Items 8, 11, 12 and 13 are not built (reported on #405).
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const vendor = (f: string) => new URL(`../../tools/plates/vendor/engine/${f}`, import.meta.url).href;
const T = 120_000;

let plate: any, body: any, eq: any, qa: any;
const S: Record<string, any> = {};
beforeAll(async () => {
  [plate, body, eq, qa] = await Promise.all([vendor('plate.mjs'), vendor('body.mjs'), vendor('equipment.mjs'), lib('qa/engine.mjs')].map(f => import(/* @vite-ignore */ f)));
  for (const id of ['bayesian_cable_curl', 'cable_curl', 'dumbbell_overhead_triceps_extension']) S[id] = (await import(/* @vite-ignore */ lib(`specs/${id}.mjs`))).default;
}, T);

const E = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body });
const render = (spec: any, mistake = false) => plate.renderPlate(spec, { id: 't', mistake });
const camOf = (spec: any) => qa.cameraOf(spec, render(spec).report);
const lmOf = (spec: any) => qa.poseLandmarks(E(), spec).lm;
const dist = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);
/** Every equipment item a spec emits in one pose (functions called as the engine calls them). */
const itemsIn = (spec: any, pose: string) => {
  const L = qa.poseLandmarks(E(), spec), lm = L.lm[pose], ctx = { pose, start: L.lm.start, mistake: pose === 'mistake', body: L.body };
  return spec.equipment.flatMap((e: any) => [].concat(typeof e === 'function' ? e(lm, ctx) ?? [] : e)).filter(Boolean);
};
/** Points of an svg path (M, L and C commands; each cubic sampled at 20 steps). */
const pathPts = (d: string) => {
  const out: number[][] = []; let cur: number[] = [0, 0];
  for (const m of d.matchAll(/([MLCZ])([^MLCZ]*)/g)) {
    const n = [...m[2]!.matchAll(/-?[\d.]+/g)].map(x => +x[0]);
    if (m[1] === 'M' || m[1] === 'L') for (let i = 0; i + 1 < n.length; i += 2) { cur = [n[i]!, n[i + 1]!]; out.push(cur); }
    else if (m[1] === 'C') for (let i = 0; i + 5 < n.length; i += 6) {
      const p0 = cur, c1 = [n[i]!, n[i + 1]!], c2 = [n[i + 2]!, n[i + 3]!], p3 = [n[i + 4]!, n[i + 5]!];
      for (let k = 1; k <= 20; k++) { const t = k / 20, u = 1 - t; out.push([0, 1].map(j => u * u * u * p0[j]! + 3 * u * u * t * c1[j]! + 3 * u * t * t * c2[j]! + t * t * t * p3[j]!)); }
      cur = p3;
    }
  }
  return out;
};

describe('PF3 item 9 bayesian_cable_curl: the arm angle at the shoulder, the Wrong cable to the Wrong handle (c3; #392 6649453813 L7)', () => {
  it('the measure arc sits at the shoulder joint with radius <= 40 % of the drawn upper arm (main: 30 px of 43.5, 69 %)', () => {
    const s = S.bayesian_cable_curl, cam = camOf(s), L = lmOf(s), svg = render(s).svg;
    const m = svg.match(/<path class="arc measure" d="M([-\d.]+) ([-\d.]+)L[-\d.]+ [-\d.]+A([\d.]+) /)!;
    const V = [+m[1]!, +m[2]!], r = +m[3]!, sh = cam.P(L.start['shoulder.r']), arm = dist(sh, cam.P(L.start['elbow.r']));
    expect(dist(V, sh)).toBeLessThanOrEqual(0.5);
    expect(r / arm, `radius ${r} of the ${arm.toFixed(1)} px upper arm`).toBeLessThanOrEqual(0.4);
  });
  it('a vertical datum runs down from the shoulder joint, past the arc (main: none)', () => {
    const s = S.bayesian_cable_curl, sh = camOf(s).P(lmOf(s).end['shoulder.r']), svg = render(s).svg;
    const d = [...svg.matchAll(/<path class="datum" d="M([-\d.]+) ([-\d.]+)L([-\d.]+) ([-\d.]+)"/g)].map(x => x.slice(1, 5).map(Number))
      .filter(([x0, y0, x1, y1]) => Math.abs(x0! - x1!) <= 0.01 && dist([x0!, y0!], sh) <= 0.5 && y1! > y0!);
    expect(d.length).toBe(1);
    expect(d[0]![3]! - d[0]![1]!).toBeGreaterThanOrEqual(s.measure.radius + 5);
    expect(render(s, true).svg.includes('class="datum"'), 'correct plate only').toBe(false);
  });
  it('the Wrong cable is a dashed Mistake guide ending on the Wrong handle ring, 0 px (main: an equipment twin under the pose mask)', () => {
    const s = S.bayesian_cable_curl, cam = camOf(s), svg = render(s, true).svg;
    const handle = itemsIn(s, 'mistake').find((it: any) => it.type === 'poly' && it.cls === 'eq-solid' && it.part === 'handle');
    const ring = cam.P(handle.pts[0]);
    const layer = svg.slice(svg.indexOf('<g class="mistake-layer">'));
    const ends = [...layer.matchAll(/<path class="m-line" d="M[-\d.]+ [-\d.]+L([-\d.]+) ([-\d.]+)"/g)].map(x => [+x[1]!, +x[2]!]);
    expect(Math.min(...ends.map(e => dist(e, ring))), 'a two-point dashed guide ends on the ring (within the report camera\'s 0.01 rounding)').toBeLessThanOrEqual(0.25);
    expect(itemsIn(s, 'mistake').some((it: any) => it.type === 'poly' && it.cls === 'eq'), 'no equipment cable twin').toBe(false);
  });
});

describe('PF3 item 10 cable_curl: a visible bottom bend, the straight Wrong apart from it, no zigzag (c13; #392 6649453813 L5)', () => {
  it('the Right bottom elbow is 20 deg (main: 18)', () => {
    expect(render(S.cable_curl).report.angles.end.elbow?.r ?? qa.poseLandmarks(E(), S.cable_curl).q.end.elbow.r).toBeCloseTo(20, 6);
  });
  it('the Wrong is fully straight and its wrist >= 12 px from the Right wrist (main: 11.67 px)', () => {
    const s = S.cable_curl, cam = camOf(s), L = qa.poseLandmarks(E(), s);
    expect(L.q.mistake.elbow.r).toBe(0);
    const d = dist(cam.P(L.lm.end['wrist.r']), cam.P(L.lm.mistake['wrist.r']));
    expect(d, `wrist gap ${d.toFixed(2)} px`).toBeGreaterThanOrEqual(12);
  });
  it('the Mistake draws no thin cable twin (main: a poly twin, the unlabelled zigzag)', () => {
    expect(itemsIn(S.cable_curl, 'mistake').some((it: any) => it.type === 'poly' && it.cls === 'eq')).toBe(false);
  });
});

describe('PF3 item 14 dumbbell_overhead_triceps_extension: a deeper lumbar curve, the ribcage tipped back (c9; #392 6654466055 L5)', () => {
  const backAt = (pts: number[][], y: number) => Math.min(...pts.filter(p => Math.abs(p[1]! - y) < 0.75).map(p => p[0]!));
  /** The drawn back outline's lumbar depth: the rear edge's furthest point forward of the chord from the backUpper height
   *  to the buttock height (plate px; the figure faces right, so the back is the outline's least x). */
  const depthOf = (svg: string, id: string, top: number, bot: number) => {
    const pts = pathPts(svg.match(new RegExp(`id="${id}" d="([^"]*)"`))![1]!);
    const ys = Array.from({ length: Math.floor(bot - top) + 1 }, (_, i) => top + i), rear = ys.map(y => [backAt(pts, y), y]);
    const a = rear[0]!, b = rear.at(-1)!;
    return Math.max(...rear.map(p => p[0]! - (a[0]! + (b[0]! - a[0]!) * (p[1]! - a[1]!) / (b[1]! - a[1]!))));
  };
  const facts = (s: any) => {
    const svg = render(s, true).svg, cam = camOf(s), L = lmOf(s), P = (p: string, k: string) => cam.P(L[p][k]);
    const rib = (p: string) => { const a = P(p, 'backUpper'), c = P(p, 'chest'); return Math.atan2(c[1]! - a[1]!, c[0]! - a[0]!) * 180 / Math.PI; };
    return {
      deepen: depthOf(svg, 't-m-torso', P('mistake', 'backUpper')[1]!, P('mistake', 'buttock')[1]!) - depthOf(svg, 't-e-torso', P('end', 'backUpper')[1]!, P('end', 'buttock')[1]!),
      behind: P('end', 'backUpper')[0]! - P('mistake', 'backUpper')[0]!,
      ribBack: rib('end') - rib('mistake'),
    };
  };
  it('the Wrong lumbar curve is >= 6.5 px deeper than the Right (main: 6.11)', () => {
    const f = facts(S.dumbbell_overhead_triceps_extension);
    expect(f.deepen, `deepen ${f.deepen.toFixed(2)}`).toBeGreaterThanOrEqual(6.5);
  });
  it('the dashed upper back is >= 5 px behind the solid one (main: 10.35 px in front) and the ribcage tips back >= 10 deg (main: 0)', () => {
    const f = facts(S.dumbbell_overhead_triceps_extension);
    expect(f.behind, `behind ${f.behind.toFixed(2)}`).toBeGreaterThanOrEqual(5);
    expect(f.ribBack, `rib ${f.ribBack.toFixed(2)}`).toBeGreaterThanOrEqual(10);
  });
  it('the arch is the ruled 25 deg, never more: bow + trunk extension, pelvis tilt unchanged', () => {
    const m = S.dumbbell_overhead_triceps_extension.mistake.pose;
    expect(m.trunk.bow - m.trunk.flex).toBe(25);
    expect(m.root).toBeUndefined();
  });
});
