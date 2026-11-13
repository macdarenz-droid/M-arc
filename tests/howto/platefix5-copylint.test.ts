// LIB-PLATEFIX-5 fix round (#419): the eight close-up sheets PF5 changes pass golden B's copy lint (the same lintHowto the
// layers build runs before it renders a sheet, tools/plates/layers/artifact/howto-layers.mjs). The wall_ball fix first
// failed it on the layers build (zoom alts over 15 words a sentence), so it is pinned here, where `npm test` runs it.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (f: string) => new URL(`../../${f}`, import.meta.url).href;
const IDS = ['hack_squat', 'jumping_jacks', 'wall_ball', 'side_plank', 'cable_external_rotation', 'diamond_push_up', 'cable_chest_press', 'hip_adduction'];
let L: any, SH: any;
const M: Record<string, any> = {};
beforeAll(async () => {
  L = await import(/* @vite-ignore */ url('tools/plates/layers/artifact/copy-lint.mjs'));
  SH = await import(/* @vite-ignore */ url('tools/plates/layers/howto/shared.mjs'));
  for (const id of IDS) M[id] = await import(/* @vite-ignore */ url(`tools/plates/library/howto/lib_${id}.howto.mjs`));
}, 120_000);

describe('PF5 close-up sheets pass the copy lint', () => {
  it('no copy-lint violation on any of the eight How-tos', () => {
    for (const id of IDS) expect(L.lintHowto(M[id], SH).violations.map((v: any) => `${v.path} ${v.rule}`), id).toEqual([]);
  });
  it('mutation: wall_ball\'s first fix-round Right alt (16 words in one sentence) is red', () => {
    const H = M.wall_ball.default, long = 'Side view, standing about arm\'s length from the wall, arms out, the ball touching the wall.';
    const zooms = H.zooms.map((z: any) => (z.key === 'wall-distance' ? { ...z, alt: { ...z.alt, right: long } } : z));
    const v = L.lintHowto({ ...M.wall_ball, default: { ...H, zooms } }, SH).violations;
    expect(v.some((x: any) => /wall-distance\)\.alt\.right/.test(x.path) && /15 words/.test(x.rule))).toBe(true);
  });
});
