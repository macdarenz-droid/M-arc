import { describe, it, expect } from 'vitest';
import type { EquipmentProfile, LoadUnit } from '@/core/models';
import { chooseRung, jumpCap, repsAt, repsToEarn, type RungMenu } from '@/brain/retarget';
import { defaultProfile, loadableValues } from '@/brain/units';
import { KG_PER_LB } from '@/core/units';

const menuOf = (profile: EquipmentProfile): RungMenu => ({
  profile,
  unit: profile.unit,
  rungsKg: loadableValues(profile).map(v => Math.round(v * (profile.unit === 'lb' ? KG_PER_LB : 1) * 1000) / 1000),
});
const ladder = (values: number[], unit: LoadUnit = 'kg'): RungMenu => menuOf({ unit, ladder: values, source: 'user', updatedAt: '' });
const stack = (step: number): RungMenu => menuOf({ unit: 'kg', step, source: 'user', updatedAt: '' });
const lb50 = 50 * KG_PER_LB;

describe('LT-2 re-solve maths (§7)', () => {
  it('repsAt(25, 12, 2, 30, 2) = 4.67 (ratio form)', () => expect(repsAt(25, 12, 2, 30, 2)).toBeCloseTo(4.667, 2));
  it('repsToEarn(25, 12, 2, 30, 6, 1) = 13', () => expect(repsToEarn(25, 12, 2, 30, 6, 1)).toBe(13));
  it('caps per goal: 10 / 12.5 / 15 / 20 %', () => {
    expect([jumpCap('strength'), jumpCap('strength_muscle'), jumpCap('lean'), jumpCap('growth')]).toEqual([0.1, 0.125, 0.15, 0.2]);
  });
  it('for R ≤ 10 the ratio form equals the Epley re-solve', () => {
    const e = 60 * (1 + (8 + 2) / 30);
    expect(repsAt(60, 8, 2, 62.5, 2)).toBeCloseTo(30 * (e / 62.5 - 1) - 2, 9);
  });
});

describe('LT-2 A1: the worked rows of §3', () => {
  it('row 1: DB 25 × 12, lean main, 25/30/32.5/35 → earn 13', () => {
    const c = chooseRung({ topKg: 25, R: 12, rirObs: 2, rawKg: 27, menu: ladder([25, 30, 32.5, 35]), goal: 'lean', role: 'main' });
    expect(c).toMatchObject({ kind: 'earn', kg: 25, repWindow: [13, 13] });
    expect(c.text).toBe('No smaller step here. Keep 25 kg and work up to 13 reps; then 30 kg for 6 is ready.');
  });
  it('row 2: same rack, growth main at 25 × 15 → 30 for about 8, close to max', () => {
    const c = chooseRung({ topKg: 25, R: 15, rirObs: 2, rawKg: 27, menu: ladder([25, 30, 32.5, 35]), goal: 'growth', role: 'main' });
    expect(c).toMatchObject({ kind: 'rung', kg: 30, repWindow: [7, 9] });
    expect(c.text).toBe('No smaller step here: use 30 kg for about 8, close to max.');
  });
  it('row 3: barbell 60 × 8, strength_muscle main, 1.25 kg plates → 62.5 for 6 to 7; without them 65 for 4 to 5', () => {
    const withSmall = chooseRung({ topKg: 60, R: 8, rirObs: 2, rawKg: 62.5, menu: menuOf(defaultProfile('Barbell', 'kg')), goal: 'strength_muscle', role: 'main' });
    expect(withSmall).toMatchObject({ kind: 'rung', kg: 62.5, repWindow: [6, 7] });
    expect(withSmall.text).toBe('62.5 kg for 6 to 7.');
    const noSmall = chooseRung({ topKg: 60, R: 8, rirObs: 2, rawKg: 62.5, menu: menuOf({ ...defaultProfile('Barbell', 'kg'), plates: [25, 20, 15, 10, 5, 2.5] }), goal: 'strength_muscle', role: 'main' });
    expect(noSmall).toMatchObject({ kind: 'rung', kg: 65, repWindow: [4, 5] });
    expect(noSmall.text).toBe('65 kg for 4 to 5.');
  });
  it('row 4: stack 40 × 15, lean accessory, step 5 → 45 for about 9 to 10', () => {
    const c = chooseRung({ topKg: 40, R: 15, rirObs: 2, rawKg: 42.5, menu: stack(5), goal: 'lean', role: 'accessory' });
    expect(c).toMatchObject({ kind: 'rung', kg: 45, repWindow: [8, 11] });
    expect(c.text).toBe('45 kg for about 9 to 10.');
  });
  it('row 5: kettlebell 16 × 12, lean main, 16/20/24 → earn 15 = hi + 3 (the table\'s 16 is an arithmetic slip, D-LT2)', () => {
    const c = chooseRung({ topKg: 16, R: 12, rirObs: 2, rawKg: 17.5, menu: ladder([16, 20, 24]), goal: 'lean', role: 'main' });
    expect(c).toMatchObject({ kind: 'earn', kg: 16, repWindow: [15, 15] });
    expect(c.text).toBe('No smaller step here. Keep 16 kg and work up to 15 reps; then 20 kg for 6 is ready.');
  });
  it('row 5, one rep fewer: earn 16 > hi + 3 → lever with the table\'s wording', () => {
    const c = chooseRung({ topKg: 16, R: 11, rirObs: 2, rawKg: 17.5, menu: ladder([16, 20, 24]), goal: 'lean', role: 'main' });
    expect(c).toMatchObject({ kind: 'lever', kg: 16, extraSet: true });
    expect(c.text).toBe('20 kg is too big a jump for now (about 2 reps). Keep 16 kg and add a set, or try a harder variation.');
  });
  it('row 6: DB 50 lb × 12, lean main, 5 lb steps → 55 lb (24.948 kg) for about 8', () => {
    const c = chooseRung({ topKg: lb50, R: 12, rirObs: 2, rawKg: 24.5, menu: menuOf(defaultProfile('Dumbbells', 'lb')), goal: 'lean', role: 'main' });
    expect(c.kind).toBe('rung');
    expect(c.kg).toBeCloseTo(24.948, 3);
    expect(c.repWindow).toEqual([7, 9]);
    expect(c.text).toBe('55 lb for about 8.');
  });
  it('row 7: DB 30 × 5, strength main, 5 kg jumps → lever, move the lift to the barbell', () => {
    const c = chooseRung({ topKg: 30, R: 5, rirObs: 2, rawKg: 32, menu: ladder([20, 25, 30, 35, 40]), goal: 'strength', role: 'main' });
    expect(c).toMatchObject({ kind: 'lever', kg: 30, extraSet: true });
    expect(c.text).toBe('35 kg is too big a jump. Keep 30 kg and add a set, or move this lift to the barbell.');
  });
  it('row 8 (A3): top of the ladder → lever, never the same rung', () => {
    const c = chooseRung({ topKg: 35, R: 12, rirObs: 2, rawKg: 37.5, menu: ladder([25, 30, 32.5, 35]), goal: 'lean', role: 'main' });
    expect(c).toMatchObject({ kind: 'lever', kg: 35, extraSet: true });
    expect(c.text).toBe('Nothing heavier here: add a set, or a harder variation.');
  });
});
