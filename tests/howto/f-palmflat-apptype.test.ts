// F-PALMFLAT-APPTYPE (docs/supervisor/verify/f-palmflat-apptype-card.md; rulings D-PF-TYPE, D-PF-DRIFT, D-PF-SCOPE).
// The palm-flat key draws its own pose { forearmTilt, cup } (hands/view-palm-flat.mjs), and generated chunks end
// `satisfies BuiltHowTo`, so HandPose must name both keys or the chunk fails TS2353 (W8c, D-W8C-MCHOLD).
// P1: the key list and the two literals typecheck (`npm run typecheck`). P2: both @ts-expect-error lines stay used,
// so a misspelt key and a wrong type are still refused. P3: the drift guard reads the live key and view.
import { describe, expect, it } from 'vitest';
import type { HandFault, HandlingSpec, HandPose } from '../../src/howto/content-types';

const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;

/** Every HandPose key the palm-flat key and view use (P3 pins it against hand-palm-flat.mjs and view-palm-flat.mjs). */
export const PALM_FLAT_POSE_KEYS = ['forearmTilt', 'cup'] as const satisfies readonly (keyof HandPose)[];

// P1: mirrors lib_mountain_climbers.howto.mjs (handling.pose RIGHT_POSE, handling.faults FAULTS); P3 ties the numbers
// to PALM_FLAT_DEFAULT and VARIANTS.floor.faults['hand-ahead'].pose.
const claim = { tags: ['CONVENTION'], sources: ['shared/palm-flat.json#c2'] } as const;
const fault = {
  key: 'hand-ahead', label: 'Hand ahead', pose: { forearmTilt: 25, cup: 0 }, markers: [],
  alt: 'Hand flat but ahead of the shoulder, forearm leaning back.',
} satisfies HandFault;
const handling = {
  archetype: 'palm-flat', orientation: 'pronated', handle: 'floor', loadAxis: 'along-forearm',
  thumb: { mode: 'beside', claim }, contact: 'palm-flat',
  wrist: { exempt: 'Palm flat on the floor: the wrist is bent back under body weight.', claim },
  pose: { forearmTilt: 0, cup: 0 }, faults: [fault],
  gripLine: 'Hands flat on the floor, directly under your shoulders. Arms straight.', cue: 'Shoulders over wrists.',
} satisfies HandlingSpec;

// P2: the excess-property and value-type checks stay strict.
// @ts-expect-error misspelt key: 'forearmTil' is not a HandPose key
const misspelt = { forearmTil: 25 } satisfies Partial<HandPose>;
// @ts-expect-error wrong type: forearmTilt is a number of degrees
const wrongType = { forearmTilt: '25' } satisfies Partial<HandPose>;
void misspelt; void wrongType;

describe('F-PALMFLAT-APPTYPE', () => {
  it('P3: the palm-flat key and view use exactly PALM_FLAT_POSE_KEYS, and the literals carry their numbers', async () => {
    const PF = await import(/* @vite-ignore */ url('tools/plates/library/hands/view-palm-flat.mjs'));
    const KEY = await import(/* @vite-ignore */ url('tools/plates/library/hands/hand-palm-flat.mjs'));
    const used = new Set<string>(Object.keys(PF.PALM_FLAT_DEFAULT));
    const variants = Object.values(KEY.VARIANTS) as Array<{ right: object; faults: Record<string, { pose: object }> }>;
    expect(variants.length).toBeGreaterThan(0);
    for (const v of variants) {
      Object.keys(v.right).forEach(k => used.add(k));
      const faults = Object.values(v.faults);
      expect(faults.length).toBeGreaterThan(0);
      faults.forEach(f => Object.keys(f.pose).forEach(k => used.add(k)));
    }
    expect([...used].sort()).toEqual([...PALM_FLAT_POSE_KEYS].sort());
    expect(handling.pose).toEqual(PF.PALM_FLAT_DEFAULT);
    expect(fault.pose).toEqual({ ...PF.PALM_FLAT_DEFAULT, ...KEY.VARIANTS.floor.faults['hand-ahead'].pose });
  });
});
