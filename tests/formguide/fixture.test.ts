// GU-7a-1 step 2: the fixtures scripts/formguide-fixture.mjs wrote from the demo at DEMO_COMMIT are complete.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

export const DEMO_COMMIT = 'f49c6c9dab4771696ee16850aa10a87de413ad17';
const dir = new URL('./fixtures/', import.meta.url);
const read = (f: string) => readFileSync(new URL(f, dir), 'utf8');

const NAMES: Record<string, number> = { machineChestPress: 18, dumbbellLateralRaise: 15, latPulldown: 26 };

describe('form-guide fixtures (R1-11)', () => {
  for (const [id, count] of Object.entries(NAMES)) {
    it(`${id}: ${count} keyframe names, 203 stops on every pose channel, stage svg, poses`, () => {
      const kf = JSON.parse(read(`${id}.json`)) as { commit: string; groups: Record<string, [number, string][]> };
      expect(kf.commit).toBe(DEMO_COMMIT);
      expect(Object.keys(kf.groups)).toHaveLength(count);
      for (const [name, stops] of Object.entries(kf.groups)) {
        if (/^(cap|rep)\d$/.test(name)) continue;
        expect(stops, name).toHaveLength(203);
        expect(stops[0]![0]).toBe(0);
        expect(stops[202]![0]).toBe(1);
      }
      expect(read(`${id}.stage.html`).startsWith('<svg class="scene" viewBox="0 0 358 276"')).toBe(true);
      const poses = JSON.parse(read(`${id}.poses.json`)) as { commit: string; keyTable: unknown[] };
      expect(poses.commit).toBe(DEMO_COMMIT);
      expect(poses.keyTable.length).toBeGreaterThan(0);
    });
  }
});
