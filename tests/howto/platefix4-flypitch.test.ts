// LIB-PLATEFIX-4 D-PF4-FLYPITCH (#410 6752927478, Q14 ruled (a)): dumbbell_fly's camera pitch is 13 deg, not
// D-SPIKE-pitch's 45, for this plate only (all 3 pf12 critics read the 45 deg foot-end view as seated or standing).
// A named exception: dumbbell_fly pins 13, every other pitched spec pins its own ruling's value
// (bent_over_dumbbell_rear_delt_fly__alt 15, D-SPIKE-hinge; russian_twist 20, LIB-21 SIZES.CAM_PITCH), and no other spec
// sets a pitch. Red on main de91dd21: dumbbell_fly is at 45.
import { readdirSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const DIR = new URL('../../tools/plates/library/specs/', import.meta.url);
const PITCH: Record<string, number> = {
  'dumbbell_fly.mjs': 13,                                 // D-PF4-FLYPITCH
  'bent_over_dumbbell_rear_delt_fly__alt.mjs': 15,        // D-SPIKE-hinge
  'russian_twist.mjs': 20,                                // LIB-21 SIZES.CAM_PITCH
};
let specs: Record<string, any> = {};
beforeAll(async () => {
  const files = readdirSync(DIR).filter(f => f.endsWith('.mjs')).sort();
  specs = Object.fromEntries(await Promise.all(files.map(async f => [f, (await import(/* @vite-ignore */ new URL(f, DIR).href)).default])));
}, 600_000);

const problems = (all: Record<string, any>) => Object.entries(all).flatMap(([f, s]) => {
  const p = s?.camera?.pitch;
  return p === PITCH[f] ? [] : [`${f}: pitch ${p} != ${PITCH[f]}`];
});

describe('PF4 D-PF4-FLYPITCH: dumbbell_fly alone takes pitch 13', () => {
  it('every spec\'s camera pitch is its ruling\'s value; dumbbell_fly is 13', () => {
    expect(Object.keys(specs).length).toBeGreaterThan(100);
    expect(problems(specs)).toEqual([]);
  });
  it('mutation: any other spec set to pitch 13 is red, and dumbbell_fly back at 45 is red', () => {
    for (const f of Object.keys(specs).filter(f => f !== 'dumbbell_fly.mjs')) {
      const s = specs[f];
      expect(problems({ [f]: { ...s, camera: { ...s?.camera, pitch: 13 } } }), f).toHaveLength(1);
    }
    const fly = specs['dumbbell_fly.mjs'];
    expect(problems({ 'dumbbell_fly.mjs': { ...fly, camera: { ...fly.camera, pitch: 45 } } })).toHaveLength(1);
  });
});
