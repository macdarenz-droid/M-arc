// V1-19: the player standard of docs/FORM-GUIDE-PRODUCTION.md §1 (readouts, guides, hotspots) and GU-7a parity.
// Node only: readouts.ts, guides.ts and hotspots.ts are pure; the DOM side is the gate's V1-19 block.
import { describe, expect, it } from 'vitest';
import { lib_dumbbell_lateral_raise as LR } from '@/formguide/exercises/lib_dumbbell_lateral_raise';
import { poseAt, repSeconds } from '@/formguide/sample';
import { effortOf } from '@/formguide/check/effort';
import { REPS, guideRig } from '@/formguide/player/guideView';
import { fmtDeg, fmtPct, readoutAt, workingChannel } from '@/formguide/player/readouts';
import { chainedFrames, guidePlan, kMax, overlaps, placeTag, tagBox, tagClashes } from '@/formguide/player/guides';
import { VIEWBOXES, type ExerciseGuide } from '@/formguide/model';
import { findExercise } from '@/core/exercises';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const rig = guideRig(LR, 'shoulder_abduction');
const LEN = repSeconds(LR.tempo) * 1000;

describe('V1-19 A1: readouts match poseAt within 1° and effort within 2%, at 10 sampled times', () => {
  const times = Array.from({ length: 10 }, (_, i) => Math.round(((i + 0.37) / 10) * REPS * LEN));

  it('the working joint of the lateral raise is the right shoulder abduction', () => {
    expect(workingChannel(LR)).toBe('shoulder_abd_r');
  });

  for (const figure of ['correct', 'mistake'] as const) it(`${figure}: angle and effort at each time`, () => {
    for (const ms of times) {
      // the chained timeline: rep r of the correct figure is its own slowed rep; the mistake repeats its one rep
      const r = Math.min(REPS - 1, Math.floor(ms / LEN)), u = (ms - r * LEN) / LEN, rep = figure === 'mistake' ? 0 : r;
      const want = poseAt(LR, u, figure, rep).shoulder_abd_r;
      const got = readoutAt(LR, rig, figure, ms);
      expect(got.rep).toBe(r + 1);
      expect(got.angle!.channel).toBe('shoulder_abd_r');
      expect(Math.abs(got.angle!.deg - want)).toBeLessThanOrEqual(1);
      expect(Math.abs(parseFloat(fmtDeg(got.angle!.deg)) - want)).toBeLessThanOrEqual(1);
      const eff = effortOf(LR, figure, rep, rig);
      if (typeof eff === 'string') throw new Error(eff);
      const e = eff(u);
      expect(got.effort.map(x => x.id).sort()).toEqual(['front_delts', 'side_delts', 'upper_traps']);
      for (const x of got.effort) {
        expect(Math.abs(x.v - e[x.id]!)).toBeLessThanOrEqual(0.02);
        expect(Math.abs(parseFloat(fmtPct(x.v)) - 100 * e[x.id]!)).toBeLessThanOrEqual(2);
      }
    }
  });
});

describe('V1-19 A2: the tag never meets the face keep-out, at any stop of any merged V1 file', () => {
  const files = readdirSync(join(ROOT, 'src/formguide/exercises')).filter(f => f.endsWith('.ts'));

  it('every exercise file in src/formguide/exercises', async () => {
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const id = f.slice(0, -3), g = (await import(`../../src/formguide/exercises/${id}.ts`))[id] as ExerciseGuide;
      const ex = findExercise(id), r = guideRig(g, ex?.pattern), plan = guidePlan(g, r);
      if (!plan) continue;
      expect(plan.tags.length).toBe(chainedFrames(g, r).length);
      expect(tagClashes(plan), id).toEqual([]);
    }
  });

  it('a seeded tag on the face fails', () => {
    const plan = guidePlan(LR, rig, (_p, face) => [(face.x0 + face.x1) / 2, (face.y0 + face.y1) / 2])!;
    expect(tagClashes(plan).length).toBe(plan.tags.length);
    // one stop only: the check names it
    let i = 0;
    const one = guidePlan(LR, rig, (p, face, k) => (i++ === 40 ? [face.x1, face.y1] : placeTag(p, face, 'r', 200, VIEWBOXES[LR.camera.zoom], k)))!;
    expect(tagClashes(one)).toEqual([one.tags[40]!.offset]);
  });

  it('the placement rule pushes a tag off the face and keeps it in the zoom camera', () => {
    const face = { x0: 168, y0: 23, x1: 232, y1: 103 }, zoom = VIEWBOXES.upperFront, K = kMax(VIEWBOXES.standingFront);
    for (const pivot of [[180, 30], [200, 60], [230, 90], [260, 128], [150, 10]] as [number, number][]) for (const side of ['l', 'r'] as const) {
      const at = placeTag(pivot, face, side, 200, zoom, K), b = tagBox(at, K);
      expect(overlaps(b, face), `${pivot} ${side}`).toBe(false);
      expect(b.x0).toBeGreaterThanOrEqual(zoom[0]); expect(b.x1).toBeLessThanOrEqual(zoom[0] + zoom[2]);
      expect(b.y0).toBeGreaterThanOrEqual(zoom[1]); expect(b.y1).toBeLessThanOrEqual(zoom[1] + zoom[3]);
    }
  });
});
