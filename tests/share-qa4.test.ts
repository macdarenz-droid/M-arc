/** QA4 (LIVE-QA-4, "Share cards"): one block per finding; each fails without its fix. */
import { describe, it, expect } from 'vitest';
import { session, sets } from './helpers';
import { cardData } from '@/slices/share/cardData';
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
