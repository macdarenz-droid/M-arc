import { describe, it, expect } from 'vitest';
import { displayToKg, enteredLoad, formatSetLoad, kgToDisplay, setLoadIn, approxIn } from '@/core/units';
import { freshState, DEFAULT_GYM_ID } from '@/core/models';
import { loadState, STATE_KEY } from '@/core/store';
import { normalizeUnits } from '@/core/escobarState';

const steps = (from: number, to: number, step: number): number[] => {
  const out: number[] = [];
  for (let i = Math.round(from / step); i * step <= to + 1e-9; i++) out.push(Math.round(i * step * 100) / 100);
  return out;
};

describe('Plate Sense round trip (§25.7)', () => {
  it('every 2.5 lb value from 2.5 to 500 lb survives entry → store → display exactly', () => {
    const bad = steps(2.5, 500, 2.5).filter(v => {
      const stored = JSON.parse(JSON.stringify(enteredLoad(v, 'lb')));
      return setLoadIn(stored, 'lb') !== v || kgToDisplay(stored.kg, 'lb') !== v;
    });
    expect(bad).toEqual([]);
  });
  it('every 0.5 kg value from 0.5 to 300 kg survives entry → store → display exactly', () => {
    const bad = steps(0.5, 300, 0.5).filter(v => {
      const stored = JSON.parse(JSON.stringify(enteredLoad(v, 'kg')));
      return setLoadIn(stored, 'kg') !== v || kgToDisplay(stored.kg, 'kg') !== v;
    });
    expect(bad).toEqual([]);
  });
  it('the canonical kg of a lb entry is unrounded to 3 decimals', () => {
    expect(displayToKg(35, 'lb')).toBe(15.876);
    expect(displayToKg(23.75, 'kg')).toBe(23.75);
  });
  it('an old set without `entered` still displays by conversion', () => {
    expect(formatSetLoad({ kg: 100 }, 'kg')).toBe('100 kg');
    expect(formatSetLoad({ kg: 100 }, 'lb')).toBe('220.5 lb');
    expect(formatSetLoad({}, 'kg')).toBe('—');
  });
  it('the other-unit hint reads to one decimal', () => {
    expect(approxIn(displayToKg(45, 'lb'), 'kg')).toBe('≈ 20.4 kg');
  });
});

describe('units state', () => {
  it('fresh state has one gym, "My gym", in the display unit', () => {
    const u = freshState().units;
    expect(u.gyms).toHaveLength(1);
    expect(u.gyms[0]!.name).toBe('My gym');
    expect(u.activeGymId).toBe(DEFAULT_GYM_ID);
  });
  it('a pre-Plate-Sense lb user gets an lb gym', () => {
    const old = freshState() as unknown as Record<string, unknown>;
    delete old.units;
    (old.preferences as { weightUnit: string }).weightUnit = 'lb';
    const map = new Map([[STATE_KEY, JSON.stringify(old)]]);
    const { state } = loadState({ getItem: k => map.get(k) ?? null, setItem: () => {}, removeItem: () => {} });
    expect(state.units.gyms[0]!.defaultUnit).toBe('lb');
  });
  it('drops malformed gyms, duplicates, profiles for unknown gyms and caps at 8', () => {
    const gyms = Array.from({ length: 10 }, (_, i) => ({ id: `g${i}`, name: `G${i}`, defaultUnit: 'lb', createdAt: 'x' }));
    const u = normalizeUnits({
      gyms: [{ id: 'g0', name: 'dup' }, ...gyms, { name: 'no id' }],
      activeGymId: 'nope',
      byExercise: { g0: { bench: { unit: 'lb', ladder: [10, 5, -1], source: 'user' }, bad: { unit: 'stone' } }, zzz: { x: { unit: 'kg' } } },
      byEquipment: { g1: { dumbbell: { unit: 'lb', step: 5, barKg: 99 } } },
    }, 'kg');
    expect(u.gyms).toHaveLength(8);
    expect(u.gyms[0]!.name).toBe('dup');
    expect(u.activeGymId).toBe('g0');
    expect(u.byExercise.g0!.bench!.ladder).toEqual([5, 10]);
    expect(u.byExercise.g0!.bad).toBeUndefined();
    expect(u.byExercise.zzz).toBeUndefined();
    expect(u.byEquipment.g1!.dumbbell!.barKg).toBeUndefined();
  });
  it('no gyms at all falls back to the default', () => {
    expect(normalizeUnits({ gyms: [] }, 'kg').gyms[0]!.id).toBe(DEFAULT_GYM_ID);
  });
});

import { resolveProfile, loadableNear, loadableValues, plateBreakdown, formatPerSide, inferGym, defaultProfile, LB_BAR_KG } from '@/brain/units';
import { suspectAlternative } from '@/brain/fidelity';
import { suggestNext } from '@/brain/progression';
import { warmupSets } from '@/brain/coach/pre';
import { autoregulationSuggestion } from '@/brain/coach/live';
import { freshUnits, type EquipmentProfile, type UnitsState } from '@/core/models';
import { session, sets } from './helpers';

const prof = (p: Partial<EquipmentProfile>): EquipmentProfile => ({ unit: 'kg', source: 'user', updatedAt: '2026-09-01', ...p });

describe('resolveProfile precedence', () => {
  const units: UnitsState = {
    ...freshUnits('kg'),
    gyms: [{ id: 'home', name: 'Home', defaultUnit: 'kg', createdAt: '' }, { id: 'work', name: 'Work', defaultUnit: 'lb', createdAt: '' }],
    activeGymId: 'home',
    byExercise: { work: { bench: prof({ unit: 'lb', step: 5, updatedAt: '2026-09-02' }) } },
    byEquipment: { home: { Dumbbells: prof({ unit: 'lb', ladder: [10, 20] }) } },
  };
  it('1: the exercise at this gym', () => {
    expect(resolveProfile('bench', 'work', units, { equipment: 'Barbell' }).step).toBe(5);
  });
  it('2: the exercise at any gym', () => {
    expect(resolveProfile('bench', 'home', units, { equipment: 'Barbell' }).unit).toBe('lb');
  });
  it('3: the equipment group at this gym', () => {
    expect(resolveProfile('db_press', 'home', units, { equipment: 'Dumbbells' }).ladder).toEqual([10, 20]);
  });
  it('4: the gym default unit with built-in ladders', () => {
    const p = resolveProfile('db_press', 'work', units, { equipment: 'Dumbbells' });
    expect(p.unit).toBe('lb');
    expect(p.source).toBe('default');
    expect(p.ladder![0]).toBe(5);
    expect(resolveProfile('squat', 'work', units, { equipment: 'Barbell' }).barKg).toBe(LB_BAR_KG);
  });
});

describe('loadableNear', () => {
  const lbDumbbells = defaultProfile('Dumbbells', 'lb');
  it('snaps to the lb dumbbell ladder', () => {
    expect(loadableNear(24.9, lbDumbbells)).toEqual({ kg: 24.948, value: 55, unit: 'lb' });
    expect(loadableNear(24.0, lbDumbbells, 'up').value).toBe(55);
    expect(loadableNear(24.9, lbDumbbells, 'down').value).toBe(50);
    expect(lbDumbbells.ladder).toContain(22.5);
    expect(lbDumbbells.ladder).not.toContain(27.5);
  });
  it('snaps to the kg plate set on a 20 kg bar', () => {
    const p = defaultProfile('Barbell', 'kg');
    expect(loadableNear(101.1, p).value).toBe(100);
    expect(loadableNear(101.1, p, 'up').value).toBe(102.5);
  });
  it('handles a kg bar with lb plates', () => {
    const p = prof({ unit: 'lb', barKg: 20, plates: [45, 25, 10, 5, 2.5] });
    const l = loadableNear(100, p);
    // 20 kg bar = 44.09 lb; totals are 44.09 + 2 × plate sums.
    expect(Math.abs(l.kg - 100)).toBeLessThan(1.2);
    expect(l.unit).toBe('lb');
    expect(Math.round((l.value - 44.09) * 100) % 500).toBe(0);
  });
  it('handles a stack with add-ons', () => {
    const p = prof({ unit: 'kg', step: 5, addOns: [2.5] });
    expect(loadableValues(p).slice(0, 4)).toEqual([5, 7.5, 10, 12.5]);
    expect(loadableNear(41, p).value).toBe(40);
    expect(loadableNear(41, p, 'up').value).toBe(42.5);
  });
  it('clamps beyond the ladder', () => {
    expect(loadableNear(500, lbDumbbells, 'up').value).toBe(150);
  });
});

describe('plateBreakdown', () => {
  it('100 kg on a 20 kg bar', () => {
    const b = plateBreakdown(100, defaultProfile('Barbell', 'kg'));
    expect(formatPerSide(b)).toBe('25 + 15 kg');
    expect(b.exactTotalKg).toBe(100);
    expect(b.remainderKg).toBe(0);
  });
  it('225 lb on a 45 lb bar', () => {
    const b = plateBreakdown(225 * 0.45359237, defaultProfile('Barbell', 'lb'));
    expect(formatPerSide(b)).toBe('45 + 45 lb');
    expect(b.remainderKg).toBeCloseTo(0, 2);
  });
  it('60 kg on a 45 lb bar with kg plates', () => {
    const b = plateBreakdown(60, prof({ unit: 'kg', barKg: LB_BAR_KG, plates: [25, 20, 15, 10, 5, 2.5, 1.25] }));
    expect(formatPerSide(b)).toBe('15 + 2.5 + 1.25 kg');
    expect(b.exactTotalKg).toBeCloseTo(57.912, 3);
    expect(b.remainderKg).toBeGreaterThan(0);
  });
  it('just the bar', () => {
    expect(formatPerSide(plateBreakdown(20, defaultProfile('Barbell', 'kg')))).toBe('Just the bar');
  });
});

describe('suggestNext with equipment', () => {
  const lbDumbbells = defaultProfile('Dumbbells', 'lb');
  const days = ['2026-09-01', '2026-09-04', '2026-09-08', '2026-09-11'];
  it('never returns a load off the ladder, and states it in lb', () => {
    const values = new Set(loadableValues(lbDumbbells));
    for (const kg of [9, 11.3, 15.9, 20, 22.7, 24.9, 31]) for (const effort of ['easy', 'ideal', 'max'] as const) {
      const hist = days.map(d => session(d, [{ id: 'lib_dumbbell_bench_press', sets: sets(kg, effort === 'max' ? 6 : 12, effort) }]));
      const s = suggestNext(hist, 'lib_dumbbell_bench_press', 'lean', '2026-09-14', 3, [], { equipment: lbDumbbells });
      expect(s.unit).toBe('lb');
      expect(values.has(s.value!)).toBe(true);
      for (const set of s.sets) if (set.kg != null) expect(values.has(Math.round(set.kg / 0.45359237 * 100) / 100)).toBe(true);
      expect(s.target).toContain(' lb');
    }
  });
  it('increases snap up, never down to the same load', () => {
    const hist = days.map(d => session(d, [{ id: 'lib_dumbbell_bench_press', sets: sets(22.68, 12, 'ideal') }]));
    const s = suggestNext(hist, 'lib_dumbbell_bench_press', 'lean', '2026-09-14', 3, [], { equipment: lbDumbbells });
    expect(s.mode).toBe('increase');
    expect(s.value).toBe(55);
  });
  it('without a profile the old step behaviour stays', () => {
    const hist = days.map(d => session(d, [{ id: 'lib_dumbbell_bench_press', sets: sets(20, 12, 'ideal') }]));
    const s = suggestNext(hist, 'lib_dumbbell_bench_press', 'lean', '2026-09-14');
    expect(s.unit).toBeUndefined();
    expect(s.kg).toBe(22);
  });
  it('warm-up ramp and autoregulation snap too', () => {
    const ramp = warmupSets(100, defaultProfile('Barbell', 'lb'));
    const values = new Set(loadableValues(defaultProfile('Barbell', 'lb')));
    for (const w of ramp) expect(values.has(Math.round(w.kg / 0.45359237 * 100) / 100)).toBe(true);
    const tip = autoregulationSuggestion({ exerciseId: 'x', exerciseName: 'DB press', firstSet: { kg: 22.68, reps: 12, effort: 'easy', fidelity: 'live' }, targetKg: 22.68, targetReps: 10, historyCount: 4, equipment: lbDumbbells });
    expect(tip!.action).toBe('Try 55 lb for the next set.');
  });
});

describe('suspectAlternative', () => {
  it('reads a 2.2× typo as lb', () => {
    expect(suspectAlternative(175, 80)).toEqual({ unit: 'lb', value: 175, kg: 79.379 });
  });
  it('reads a 0.45× typo as kg', () => {
    const alt = suspectAlternative(36.287, 80)!;
    expect(alt.unit).toBe('kg');
    expect(alt.value).toBe(80);
  });
  it('null when the load is plausible', () => {
    expect(suspectAlternative(82.5, 80)).toBeNull();
    expect(suspectAlternative(100, null)).toBeNull();
  });
});

describe('inferGym', () => {
  const gyms = ['home', 'work', 'travel'].map(id => ({ id, name: id, defaultUnit: 'kg' as const, createdAt: '' }));
  const at = (iso: string, gymId: string) => ({ ...session(iso.slice(0, 10), []), startedAt: iso, logging: { ...session(iso.slice(0, 10), []).logging, trainedAt: iso }, gymId });
  // 2026-09-22 is a Tuesday.
  const now = new Date('2026-09-22T18:00:00');
  it('picks the gym used most on this weekday near this hour', () => {
    const hist = [
      at('2026-09-15T18:30:00', 'work'), at('2026-09-08T17:10:00', 'work'), at('2026-09-01T19:00:00', 'home'),
      at('2026-09-17T18:00:00', 'home'), at('2026-09-16T18:00:00', 'home'), // other weekdays
      at('2026-09-15T07:00:00', 'travel'), // same day, wrong hour
      at('2026-06-02T18:00:00', 'travel'), at('2026-06-09T18:00:00', 'travel'), at('2026-06-16T18:00:00', 'travel'), // too old
    ];
    expect(inferGym(hist, gyms, now)).toBe('work');
  });
  it('null with no matching history or unknown gyms', () => {
    expect(inferGym([], gyms, now)).toBeNull();
    expect(inferGym([at('2026-09-15T18:00:00', 'gone')], gyms, now)).toBeNull();
  });
});

describe('plateBreakdown finds the best combination (BR-24)', () => {
  it('90 kg on a 20 kg bar with 25/20/15 plates is 20 + 15 a side', async () => {
    const { plateBreakdown } = await import('@/brain/units');
    const b = plateBreakdown(90, { unit: 'kg', barKg: 20, plates: [25, 20, 15] } as never);
    expect(b.perSide.map(p => ({ value: p.value, count: p.count }))).toEqual([{ value: 20, count: 1 }, { value: 15, count: 1 }]);
    expect(b.exactTotalKg).toBe(90);
  });
  it('uses the fewest plates for a standard set', async () => {
    const { plateBreakdown } = await import('@/brain/units');
    const b = plateBreakdown(140, { unit: 'kg', barKg: 20, plates: [25, 20, 15, 10, 5, 2.5, 1.25] } as never);
    expect(b.perSide.map(p => [p.value, p.count])).toEqual([[25, 2], [10, 1]]);
  });
});
