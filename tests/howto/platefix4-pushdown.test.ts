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
