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
