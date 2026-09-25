/** QA4 (LIVE-QA-4, "Share cards"): one block per finding; each fails without its fix. */
import { describe, it, expect } from 'vitest';
import { session, sets } from './helpers';
import { cardData, isEmptyCard, latestSession } from '@/slices/share/cardData';
import { hasWorkingSets } from '@/brain/exposure';
import { cardFileName, cardSvg, paletteFor } from '@/slices/share/cards';
import { THEMES } from '@/theme/themes';
import { weekSummary, weeklyVolumeHistory, workingTotals } from '@/brain/weekly';
import { modeOf } from '@/brain/history';
import { allRecords } from '@/brain/prs';
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

describe('QA4-6: ramped sets are not written as if every set was at the top load', () => {
  const lines = (sets: Session['exercises'][number]['sets'], id = BENCH) => {
    const s = session('2026-09-22', [{ id, name: 'X', sets }]);
    return cardData({ sessions: [s], custom: [], unit: 'kg', today: TODAY, period: 'workout', session: s }).lines[0]!.detail;
  };
  it('identical sets keep the short form', () => expect(lines(sets(80, 5))).toBe('3×5 @80'));
  it('a ramp shows the set count and the top set', () => {
    expect(lines([{ kg: 60, reps: 5 }, { kg: 70, reps: 5 }, { kg: 80, reps: 5 }])).toBe('3 sets, top 5@80');
    expect(lines([{ kg: 80, reps: 5 }, { kg: 80, reps: 4 }, { kg: 80, reps: 3 }])).toBe('3 sets, top 5@80');
  });
  it('assisted ramps name the least help; bodyweight ramps the best reps', () => {
    expect(lines([{ kg: 40, reps: 10 }, { kg: 35, reps: 10 }, { kg: 30, reps: 8 }], ASSIST)).toBe('3 sets, top 8@30 assist');
    expect(lines([{ reps: 12 }, { reps: 10 }, { reps: 9 }], 'lib_push_up')).toBe('3 sets, top 12');
  });
});

describe("QA4-7: a workout card shows only its own session's records", () => {
  it('records carry their session, and a second session that day keeps its PRs to itself', () => {
    const first = session('2026-09-15', [{ id: BENCH, sets: sets(60, 5) }]);
    const am = session('2026-09-22', [{ id: BENCH, sets: sets(70, 5) }]);
    const pm = { ...session('2026-09-22', [{ id: BENCH, sets: sets(75, 5) }]), startedAt: '2026-09-22T19:00:00.000Z' };
    const all = [first, am, pm];
    const recs = allRecords(all);
    expect(recs.every(r => typeof r.sessionId === 'string')).toBe(true);
    expect(recs.filter(r => r.sessionId === pm.id).length).toBeGreaterThan(0);
    const card = (s: Session) => cardData({ sessions: all, custom: [], unit: 'kg', today: TODAY, period: 'workout', session: s });
    expect(card(am).records.every(r => r.sessionId === am.id)).toBe(true);
    expect(card(pm).records.every(r => r.sessionId === pm.id)).toBe(true);
    expect(card(am).records.length + card(pm).records.length).toBe(recs.filter(r => r.day === '2026-09-22').length);
  });
});

describe('QA4-8: a warm-up-only session is not shareable', () => {
  const warm = session('2026-09-22', [{ id: BENCH, sets: [{ kind: 'warmup', kg: 20, reps: 10 }, { kind: 'warmup', kg: 40, reps: 5 }] }]);
  const real = session('2026-09-20', [{ id: BENCH, sets: sets(60, 5) }]);
  it('hasWorkingSets tells them apart', () => {
    expect(hasWorkingSets(warm)).toBe(false);
    expect(hasWorkingSets(real)).toBe(true);
  });
  it('its card is empty, and "This workout" on Stats skips it for the newest real session', () => {
    expect(isEmptyCard(cardData({ sessions: [real, warm], custom: [], unit: 'kg', today: TODAY, period: 'workout', session: warm }))).toBe(true);
    expect(isEmptyCard(cardData({ sessions: [real, warm], custom: [], unit: 'kg', today: TODAY, period: 'workout', session: real }))).toBe(false);
    expect(latestSession([real, warm])?.id).toBe(real.id);
    expect(latestSession([warm])).toBeNull();
  });
});

describe('QA4-9: a bodyweight-only card headlines sets, not "0 kg lifted"', () => {
  const s = session('2026-09-22', [{ id: 'lib_push_up', name: 'Push-Up', sets: [{ reps: 20 }, { reps: 18 }, { reps: 15 }] }, { id: 'lib_pull_up', name: 'Pull-Up', sets: [{ reps: 8 }, { reps: 7 }] }]);
  const d = cardData({ sessions: [s], custom: [], unit: 'kg', today: TODAY, period: 'workout', session: s });
  const pal = paletteFor(THEMES['silent-black']);
  it('poster and sticker show the 5 working sets as "sets done"', () => {
    for (const style of ['poster', 'sticker'] as const) {
      const svg = cardSvg(d, style, 'story', pal);
      expect(svg, style).not.toMatch(/KG LIFTED/i);
      expect(svg, style).toMatch(/SETS DONE/i);
      expect(svg, style).toMatch(/>5</);
    }
  });
  it('the receipt drops TOTAL LIFTED', () => {
    expect(cardSvg(d, 'receipt', 'story', pal)).not.toContain('TOTAL LIFTED');
    expect(cardSvg(d, 'receipt', 'square', pal)).not.toContain('TOTAL LIFTED');
  });
});
