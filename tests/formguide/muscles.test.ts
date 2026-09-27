// GU-7a-3: muscle names and lines (A13 data part, spec 2.10).
import { describe, expect, it } from 'vitest';
import { MUSCLES, MUSCLE_IDS } from '../../src/data/muscles';
import { findExercise } from '../../src/core/exercises';
import { muscleInfo, muscleText } from '../../src/formguide/muscles';
import { MUSCLE_NOTES } from '../../src/formguide/muscleNotes';
import type { Exercise } from '../../src/core/models';

const SPEC: Record<string, string[]> = {
  lib_machine_chest_press: [
    'Chest (pectoralis major), target. Pushes the handles away; hardest as the arms straighten.',
    'Front delts (anterior deltoid), helps. Lifts the upper arms forward with the chest.',
    'Triceps (triceps brachii), helps. Straightens the elbows at the end of the press.',
  ],
  lib_dumbbell_lateral_raise: [
    'Side delts (lateral deltoid), target. Lifts the arms out to the sides; hardest near shoulder height.',
    'Upper traps (upper trapezius), helps. Steadies the shoulder blades; keep them down, no shrug.',
  ],
  lib_lat_pulldown: [
    'Lats (latissimus dorsi), target. Pulls the elbows down and back; hardest at the bottom.',
    'Biceps (biceps brachii), helps. Bends the elbows as the bar comes down.',
    'Mid back (rhomboids and middle trapezius), helps. Squeezes the shoulder blades together.',
  ],
};

describe('GU-7a-3 muscle names', () => {
  it('all 24 ids have non-empty common, anatomical and action', () => {
    expect(MUSCLE_IDS).toHaveLength(24);
    for (const m of MUSCLES) {
      expect(m.common.trim(), m.id).not.toBe('');
      expect(m.anatomical.trim(), m.id).not.toBe('');
      expect(m.action.trim(), m.id).not.toBe('');
    }
  });
});

describe('GU-7a-3 muscleInfo', () => {
  for (const [id, lines] of Object.entries(SPEC)) {
    it(`${id} returns spec 2.10 lines, target first`, () => {
      const info = muscleInfo(id);
      expect(info.map(muscleText)).toEqual(lines);
      expect(info[0]?.role).toBe('target');
      expect(info[0]?.colorVar).toBe('var(--muscle-main)');
      for (const h of info.slice(1)) { expect(h.role).toBe('helps'); expect(h.colorVar).toBe('var(--muscle-help)'); }
      for (const l of lines) expect(l.length).toBeLessThanOrEqual(100); // bubble fits 2 lines (spec 2.10 at DEMO_COMMIT f49c6c9)
    });

    it(`${id} written muscles match the exercise row (primary + secondary)`, () => {
      const ex = findExercise(id)!;
      expect(Object.keys(MUSCLE_NOTES[id] ?? {}).sort()).toEqual([...ex.primary, ...ex.secondary].sort());
    });
  }

  it('unknown exercise id returns []', () => {
    expect(muscleInfo('lib_does_not_exist')).toEqual([]);
    expect(muscleInfo('')).toEqual([]);
    expect(muscleInfo('Lat Pulldown')).toEqual([]); // ids only, not names
  });

  it('custom exercise returns its listed muscles with generic lines', () => {
    const custom: Exercise = {
      ...findExercise('lib_machine_chest_press')!, id: 'custom_x', name: 'My Press',
      primary: ['chest'], secondary: ['triceps'], custom: true,
    };
    expect(muscleInfo(custom).map(muscleText)).toEqual([
      'Chest (pectoralis major), target. Pushes the arms forward and across the body.',
      'Triceps (triceps brachii), helps. Straightens the elbows.',
    ]);
  });

  it('explicit notes override the stored lines', () => {
    expect(muscleInfo('lib_lat_pulldown', { lats: 'X.' })[0]?.line).toBe('X.');
    expect(muscleInfo('lib_lat_pulldown', { lats: 'X.' })[1]?.line).toBe('Bends the elbows and turns the palms up.');
  });
});
