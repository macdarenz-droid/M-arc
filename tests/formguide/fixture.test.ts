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

// A1: sampleMove reproduces the demo's written stops (R1-11 equality: the demo's n4/n3 strings).
import { sampleMove, frameValue } from '@/formguide/moves/sample';
import { machineChestPress } from '@/formguide/moves/machineChestPress';
import { dumbbellLateralRaise } from '@/formguide/moves/dumbbellLateralRaise';
import { latPulldown } from '@/formguide/moves/latPulldown';
import type { Move } from '@/formguide/moves/types';

const MOVES: [string, Move][] = [['machineChestPress', machineChestPress], ['dumbbellLateralRaise', dumbbellLateralRaise], ['latPulldown', latPulldown]];
const PROP: Record<string, string> = { transform: 'transform', opacity: 'opacity', strokeDashoffset: 'stroke-dashoffset' };

describe('A1: sampleMove = the demo keyframes', () => {
  for (const [id, move] of MOVES) {
    it(`${id}: every group and stop equals the fixture's offset and value string`, () => {
      const kf = JSON.parse(read(`${id}.json`)) as { groups: Record<string, [number, string][]>; props: Record<string, string> };
      const s = sampleMove(move);
      const emitted = new Set(s.groups.map(g => g.className));
      // every pose channel of the demo is emitted (captions and rep pill are driven from currentTime by the player)
      expect(Object.keys(kf.groups).filter(n => !/^(cap|rep)\d$/.test(n)).sort()).toEqual([...emitted].filter(n => n !== 'lp-fbh').sort());
      for (const g of s.groups) {
        const want = kf.groups[g.className === 'lp-fbh' ? 'lp-fhd' : g.className]!;
        expect(g.frames.map(f => [f.offset, frameValue(f)]), g.className).toEqual(want);
        const prop = Object.keys(g.frames[0]!).find(k => k !== 'offset')!;
        expect(PROP[prop], g.className).toBe(kf.props[g.className === 'lp-fbh' ? 'lp-fhd' : g.className]);
      }
      expect(s.stops).toHaveLength(203);
    });
  }
  it('the lat pulldown also emits lp-fbh with the lp-fhd frames (the far bar follows the far hand)', () => {
    const g = sampleMove(latPulldown).groups;
    expect(g.find(x => x.className === 'lp-fbh')!.frames).toEqual(g.find(x => x.className === 'lp-fhd')!.frames);
  });
  it('failure path: one changed stop value fails the equality', () => {
    const kf = JSON.parse(read('machineChestPress.json')) as { groups: Record<string, [number, string][]> };
    const g = sampleMove(machineChestPress).groups.find(x => x.className === 'cp-ua')!;
    const got = g.frames.map(f => [f.offset, frameValue(f)]);
    got[50] = [got[50]![0]!, 'rotate(0deg)'];
    expect(got).not.toEqual(kf.groups['cp-ua']);
  });
});
