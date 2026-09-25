/** QA4 (LIVE-QA-4, "Share cards"): one block per finding; each fails without its fix. */
import { describe, it, expect } from 'vitest';
import { session, sets } from './helpers';
import { cardData } from '@/slices/share/cardData';
import { cardFileName } from '@/slices/share/cards';
import { weekSummary, weeklyVolumeHistory, workingTotals } from '@/brain/weekly';
import { modeOf } from '@/brain/history';
import type { Session } from '@/core/models';

const TODAY = '2026-09-23';
const ASSIST = 'lib_assisted_pull_up', BENCH = 'lib_barbell_bench_press';

describe('QA4-1: assisted exercises add no volume', () => {
  const s: Session = session('2026-09-22', [{ id: ASSIST, name: 'Assisted Pull-Up', sets: sets(40, 10) }, { id: BENCH, name: 'Barbell Bench Press', sets: sets(60, 5) }]);
  it('the library marks it assisted', () => expect(modeOf(ASSIST)).toBe('assisted'));
  it('workingTotals counts its sets but not the help as weight', () => {
    expect(workingTotals(s.exercises)).toEqual({ sets: 6, volumeKg: 900 });
  });
  it('Stats (weekSummary, weeklyVolumeHistory) and the card agree', () => {
    const d = cardData({ sessions: [s], custom: [], unit: 'kg', today: TODAY, period: 'week' });
    expect(weekSummary([s], TODAY).volumeKg).toBe(900);
    expect(weeklyVolumeHistory([s], TODAY, 1)[0]!.volumeKg).toBe(900);
    expect(d.volumeKg).toBe(900);
    expect(d.sets).toBe(6);
  });
  it('the receipt reads "@40 assist" and counts sets, not kg', () => {
    const w = cardData({ sessions: [s], custom: [], unit: 'kg', today: TODAY, period: 'workout', session: s });
    const line = w.lines.find(l => l.exerciseId === ASSIST)!;
    expect(line.detail).toBe('3×10 @40 assist');
    expect(line.value).toBe('3 sets');
    expect(line.volumeKg).toBe(0);
    const p = cardData({ sessions: [s], custom: [], unit: 'kg', today: TODAY, period: 'week' });
    expect(p.lines.find(l => l.exerciseId === ASSIST)!.value).toBe('3 sets');
  });
});

describe('QA4-2: carries, sleds and loaded holds read as distance or time, not "×0 … BW"', () => {
  const FARMER = 'lib_farmer_s_carry', SLED = 'lib_sled_push', PLANK = 'lib_plank';
  const s: Session = session('2026-09-22', [
    { id: FARMER, name: "Farmer's Carry", sets: Array.from({ length: 3 }, () => ({ kg: 32, distanceM: 40 })) },
    { id: SLED, name: 'Sled Push', sets: Array.from({ length: 3 }, () => ({ distanceM: 20 })) },
    { id: PLANK, name: 'Plank', sets: Array.from({ length: 3 }, () => ({ kg: 20, durationSec: 60 })) },
  ]);
  const line = (d: ReturnType<typeof cardData>, id: string) => d.lines.find(l => l.exerciseId === id)!;
  it('workout lines', () => {
    const d = cardData({ sessions: [s], custom: [], unit: 'kg', today: TODAY, period: 'workout', session: s });
    expect([line(d, FARMER).detail, line(d, FARMER).value]).toEqual(['3×40 m @32', '—']);
    expect([line(d, SLED).detail, line(d, SLED).value]).toEqual(['3×20 m', 'BW']);
    expect([line(d, PLANK).detail, line(d, PLANK).value]).toEqual(['3×60s @20', '—']);
  });
  it('period lines use the same BW rule', () => {
    const d = cardData({ sessions: [s], custom: [], unit: 'kg', today: TODAY, period: 'week' });
    expect([line(d, FARMER).value, line(d, SLED).value, line(d, PLANK).value]).toEqual(['—', 'BW', '—']);
  });
});

describe('QA4-4: every Save gets its own file name', () => {
  const at = (h: number, m: number, sec: number) => new Date(2026, 8, 23, h, m, sec);
  it('adds the local time, and the session id on workout cards', () => {
    expect(cardFileName({ period: 'week', style: 'poster', format: 'story', to: TODAY, now: at(9, 5, 7) })).toBe('marc-week-poster-9x16-2026-09-23-090507.png');
    expect(cardFileName({ period: 'workout', style: 'receipt', format: 'square', to: TODAY, now: at(18, 0, 0), sessionId: 's_mf2x_ab12' })).toBe('marc-workout-receipt-1x1-2026-09-23-180000-s_mf2x_ab12.png');
  });
  it('two saves a second apart, or two sessions on one day, never share a name', () => {
    const a = cardFileName({ period: 'week', style: 'poster', format: 'story', to: TODAY, now: at(9, 5, 7) });
    expect(cardFileName({ period: 'week', style: 'poster', format: 'story', to: TODAY, now: at(9, 5, 8) })).not.toBe(a);
    const s1 = cardFileName({ period: 'workout', style: 'poster', format: 'story', to: TODAY, now: at(9, 5, 7), sessionId: 's_1' });
    expect(cardFileName({ period: 'workout', style: 'poster', format: 'story', to: TODAY, now: at(9, 5, 7), sessionId: 's_2' })).not.toBe(s1);
  });
  it('keeps odd characters out of the name', () => {
    expect(cardFileName({ period: 'workout', style: 'poster', format: 'story', to: TODAY, now: at(1, 2, 3), sessionId: 'a/b c:d' })).toBe('marc-workout-poster-9x16-2026-09-23-010203-abcd.png');
  });
});
