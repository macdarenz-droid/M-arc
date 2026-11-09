// LIB-PLATEFIX-4, straight_bar_triceps_pushdown (D-PF2-PUSHDOWN-T; D-SHIP-W5-H10: "#385 head ... PQ-H10 red on 6
// fragments"): templates/PUSHDOWN.mjs is re-cloned from PF1's approved parent specs/triceps_pushdown.mjs (984d7b54: the
// merged dashed faulty figure with the near arm, no separate arm guides, the low-back arch guide and tell, ghosts 2, the
// new alt), so make(parentParams, parentFacts) rebuilds the parent plate byte for byte again (D-LIB10-CHILDPROOF 2).
// Red on main de91dd21: the template still draws the pre-PF1 parent (PQ-H10.byte on normalSvg, mistakeSvg,
// mistakeOverlay, tells, cues, alt). The full QA run (qa/index.mjs runQa) on this head: PQ-H10 [] for the row.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let T: any, parent: any, child: any, plate: any;
beforeAll(async () => {
  [T, parent, child, plate] = await Promise.all(['templates/PUSHDOWN.mjs', 'specs/triceps_pushdown.mjs', 'specs/straight_bar_triceps_pushdown.mjs', '../vendor/engine/plate.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
}, 600_000);

const render = (spec: any, mistake: boolean) => plate.renderPlate(spec, { id: 'pd', mistake }).svg;

describe('PF4 straight_bar: the PUSHDOWN template rebuilds PF1\'s approved parent', () => {
  it('make(parentParams, parentFacts) draws the parent plate byte for byte, in the normal and the Mistake view', () => {
    const t = T.make(T.parentParams, T.parentFacts), p = parent.default;
    expect(render(t, false)).toBe(render(p, false));
    expect(render(t, true)).toBe(render(p, true));
    for (const k of ['callouts', 'tempo', 'alt', 'ghosts', 'measure', 'trace']) expect(t[k], k).toEqual(p[k]);
    expect(t.mistake.tells).toEqual(p.mistake.tells);
    expect(t.mistake.parts).toEqual(p.mistake.parts);
  });
  it('the child takes the parent\'s PF1 Mistake form: one merged dashed figure with the near arm, the arch guide, ghosts 2', () => {
    const c = child.default;
    expect(c.mistake.parts).toEqual(['torso', 'head', 'arm.r', 'bar']);
    expect(c.mistake.guides.filter((g: any) => g.kind === 'line')).toEqual([]);
    expect(c.mistake.guides.some((g: any) => g.kind === 'dashed' && g.smooth && g.pts.map((q: any) => q.at).join() === 'sacrum,lumbar,backMid')).toBe(true);
    expect(c.ghosts.count).toBe(2);
  });
  it('mutation: the pre-PF1 ghosts count (3) or parts (no near arm) in the template no longer rebuild the parent', () => {
    const t = T.make(T.parentParams, T.parentFacts), p = parent.default;
    expect(render({ ...t, ghosts: { ...t.ghosts, count: 3 } }, false)).not.toBe(render(p, false));
    expect(render({ ...t, mistake: { ...t.mistake, parts: ['torso', 'head', 'bar'] } }, true)).not.toBe(render(p, true));
  });
});

// LIB-PLATEFIX-4 straight_bar fix round (pf12 R4 [3,3,3], #410 6751563503): "The HIP LEAN ONLY dot sits on the upper back
// at shoulder-blade height, about 105 px above the hip joint ... Give it a leader that ends on the hip or pelvis outline,
// swapping slots with the ELBOWS chip if needed." The hips callout is anchored on hip.r, its box takes the slot under
// ELBOWS PINNED (which moves to the top slot). Red on fd274f59: its leader ended on backUpper; no leader came within 22.9 px of the hip.
describe('PF4 straight_bar pf12 R4: the HIP LEAN ONLY leader ends on the hip', () => {
  const leaders = (spec: any) => {
    const r = plate.renderPlate(spec, { id: 'sb' });
    return { r, ends: [...r.svg.matchAll(/<path class="leader[^"]*"[^>]*d="M([\d.-]+) ([\d.-]+)L/g)].map(m => [+m[1]!, +m[2]!]) };
  };
  const projected = (spec: any, k: string, r: any) => { const L = E.landmarksOf(spec.poses.end, 1.75), c = r.report.camera; return [c.x0 + L[k][2] * c.pxPerM, c.y0 - L[k][1] * c.pxPerM]; };
  let E: any;
  beforeAll(async () => { E = await import(/* @vite-ignore */ lib('engine.mjs')); });
  const near = (spec: any, k: string) => { const { r, ends } = leaders(spec), p = projected(spec, k, r); return Math.min(...ends.map(e => Math.hypot(e[0]! - p[0]!, e[1]! - p[1]!))); };
  it('a leader ends within 0.5 px of the drawn hip joint, one within 0.5 px of the elbow, and the label layout has no issue', () => {
    const c = child.default;
    expect(c.callouts.find((x: any) => x.key === 'hips').anchor).toBe('hip.r');
    expect(near(c, 'hip.r')).toBeLessThanOrEqual(0.5);
    expect(near(c, 'elbow.r')).toBeLessThanOrEqual(0.5);
    expect(leaders(c).r.report.issues).toEqual([]);
  });
  it('mutation: the hips callout back on backUpper leaves no leader within 15 px of the hip', () => {
    const c = child.default, m = { ...c, callouts: c.callouts.map((x: any) => x.key === 'hips' ? { ...x, anchor: 'backUpper' } : x) };
    expect(near(m, 'hip.r')).toBeGreaterThan(15);
  });
});
