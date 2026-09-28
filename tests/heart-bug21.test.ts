/**
 * BUG-21 (D-A1 points 4, 5, 7; RECOVERY-F18, F38, F39; COACHRULES-F24): heart-guided rest never
 * ends a main lift's rest before the timer; effort mismatch compares within one exercise; drift
 * follows COACHING-PLAN.md Appendix B; the rest target uses the real pre-set heart rate.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const remindersMock = vi.hoisted(() => ({ resyncReminders: vi.fn(async () => undefined) }));
vi.mock('@/slices/settings/reminders', () => remindersMock);

import { replaceState, state } from '@/core/store';
import { freshState, type LoggedSet, type Split } from '@/core/models';
import { latestMeasurement, type WatchMeasurement } from '@/native/watch';
import { effortMismatch, preSetBpmFromWindow, sessionDrift, DRIFT } from '@/brain/heart';
import { coachInsights } from '@/brain/coach/rules';
import { commitSet, restDone, restFollowsMainLift, setSet, startSession } from '@/slices/workout/session';
import { resetHeartCapture, startHeartCapture } from '@/slices/workout/heart';
import { baseCoachExtras, sessionAt } from './helpers';
import { emptySchedule } from '@/core/models';

const bench = 'lib_barbell_bench_press';
const fly = 'lib_cable_fly';

describe('A1: heart-guided rest and the main-lift floor (D-A1 point 4)', () => {
  it('heart-ready never ends a main lift rest before the timer; it can end an accessory rest', () => {
    expect(restDone(false, true, true)).toBe(false);
    expect(restDone(true, false, true)).toBe(true);
    expect(restDone(false, true, false)).toBe(true);
    expect(restDone(false, false, false)).toBe(false);
  });

  const split: Split = { id: 'sp', name: 'Push', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: bench, sets: 1 }, { exerciseId: fly, sets: 1 }] };
  const T0 = Date.parse('2026-09-22T10:00:00.000Z');
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(T0);
    replaceState({ ...freshState(), splits: [split], preferences: { ...freshState().preferences, autoRest: true } });
  });
  afterEach(() => { vi.useRealTimers(); });

  it('the rest follows the exercise of the latest committed set', () => {
    startSession(split);
    setSet(0, 0, { kg: 60, reps: 5 });
    vi.advanceTimersByTime(30_000);
    commitSet(0, 0);
    expect(restFollowsMainLift(state.value.active!, [])).toBe(true);
    setSet(1, 0, { kg: 20, reps: 12 });
    vi.advanceTimersByTime(90_000);
    commitSet(1, 0);
    expect(restFollowsMainLift(state.value.active!, [])).toBe(false);
  });

  it('with no committed set or an unknown exercise it is treated as a main lift (the timer stays the floor)', () => {
    startSession(split);
    expect(restFollowsMainLift(state.value.active!, [])).toBe(true);
    const a = state.value.active!;
    const unknown = { ...a, entries: [{ ...a.entries[0]!, exerciseId: 'nope', sets: [{ kg: 1, reps: 1, status: 'committed' as const, at: new Date(T0).toISOString() }] }] };
    expect(restFollowsMainLift(unknown, [])).toBe(true);
  });
});

describe('RECOVERY-F18: the rest target starts from the heart rate before the set', () => {
  const split: Split = { id: 'sp', name: 'Push', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: bench, sets: 2 }] };
  const T0 = Date.parse('2026-09-22T10:00:00.000Z');
  const m = (sec: number, bpm: number): WatchMeasurement => ({ bpm, contact: true, rrMs: [], energyKj: null, receivedAtEpochMs: T0 + sec * 1000, receivedAtElapsedMs: sec * 1000 });
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(T0);
    replaceState({ ...freshState(), splits: [split], preferences: { ...freshState().preferences, autoRest: true } });
    resetHeartCapture();
    latestMeasurement.value = null;
    startHeartCapture();
  });
  afterEach(() => { vi.useRealTimers(); });

  it('stores the trough before the set, not the end-of-set peak', () => {
    startSession(split);
    // 60 s resting at 85, then the set climbs to 150 by the commit at 90 s.
    for (let s = 0; s <= 60; s += 5) latestMeasurement.value = m(s, 85);
    for (let s = 65; s <= 90; s += 5) latestMeasurement.value = m(s, 110 + (s - 65) * 1.6);
    vi.setSystemTime(T0 + 90_000);
    setSet(0, 0, { kg: 60, reps: 5 });
    commitSet(0, 0);
    expect(state.value.active!.rest?.preSetBpm).toBe(85);
  });

  it('without enough heart signal the rest gets no pre-set bpm, so it runs on the timer', () => {
    startSession(split);
    latestMeasurement.value = m(85, 150);
    vi.setSystemTime(T0 + 90_000);
    setSet(0, 0, { kg: 60, reps: 5 });
    commitSet(0, 0);
    expect(state.value.active!.rest).toBeTruthy();
    expect(state.value.active!.rest!.preSetBpm).toBeUndefined();
  });

  it('preSetBpmFromWindow is the lowest 15-second median in the window and ignores a one-point dip', () => {
    const series: Array<[number, number]> = [[0, 100], [5, 95], [10, 60], [15, 94], [20, 92], [25, 93], [30, 140]];
    expect(preSetBpmFromWindow(series, 0, 30)).toBe(92);
    expect(preSetBpmFromWindow(series, 25, 30)).toBeNull();
  });
});

describe('A2: effort mismatch compares within one exercise (D-A1 point 5, P2)', () => {
  const s = (effort: 'easy' | 'ideal' | 'max', peakBpm: number) => ({ effort, heart: { peakBpm, endBpm: peakBpm } });
  it('an easy leg set is not flagged against curls it out-peaks (RECOVERY-F39 probe R65)', () => {
    const exercises = [{ sets: [s('easy', 150)] }, { sets: [s('max', 130), s('max', 132), s('max', 131), s('ideal', 125)] }];
    expect(effortMismatch(exercises)).toBeNull();
  });
  it('flags an easy set near the same exercise\'s hardest-rated set', () => {
    const exercises = [{ sets: [s('max', 170), s('easy', 160), s('ideal', 150)] }, { sets: [s('max', 190), s('ideal', 180)] }];
    expect(effortMismatch(exercises)).toEqual({ mismatched: 1, rated: 5, examplePct: Math.round(160 / 170 * 100) });
  });
  it('the reference is the set rated hardest, not a higher-peaking easier one', () => {
    // Max set peaked at 140; an ideal set at 180. The easy 130 is within 10% of the max-rated set.
    const exercises = [{ sets: [s('max', 140), s('ideal', 180), s('easy', 130), s('ideal', 150), s('ideal', 150)] }];
    expect(effortMismatch(exercises)?.examplePct).toBe(Math.round(130 / 140 * 100));
  });
  it('the coach note stays quiet for those two sessions (the rule used to compare across the whole session)', () => {
    const ctx = { sessions: [], splits: [], schedule: emptySchedule(), custom: [], today: '2026-09-18', now: new Date('2026-09-18T12:00:00Z').getTime(), ...baseCoachExtras };
    const set = (effort: 'easy' | 'ideal' | 'max', peakBpm: number): LoggedSet => ({ kg: 40, reps: 10, effort, heart: { peakBpm, endBpm: peakBpm } });
    const legsAndCurls = sessionAt('2026-09-18T10:00:00.000Z', '2026-09-18T11:00:00.000Z', [{ id: 'lib_barbell_back_squat', sets: [set('easy', 150)] }, { id: 'lib_dumbbell_curl', sets: [set('max', 130), set('max', 132), set('max', 131), set('ideal', 125)] }]);
    const onlyEasy = sessionAt('2026-09-18T10:00:00.000Z', '2026-09-18T11:00:00.000Z', [{ id: bench, sets: [150, 151, 152, 150, 149].map(p => set('easy', p)) }]);
    for (const s of [legsAndCurls, onlyEasy]) expect(coachInsights({ ...ctx, sessions: [s] }, 20).some(i => i.id.startsWith('heart-mismatch'))).toBe(false);
  });
  it('an exercise rated only easy has nothing to compare against', () => {
    const exercises = [{ sets: [s('easy', 150), s('easy', 151), s('easy', 152), s('easy', 150), s('easy', 149)] }];
    expect(effortMismatch(exercises)).toBeNull();
  });
});

/** Six sets committed 4 min apart; before set k the heart rate rests at pre(k), in the set it climbs to 150. */
const AT = [120, 360, 600, 840, 1080, 1320];
function series(pre: (k: number) => number, endSec = 1500, recover?: (k: number, sinceCommit: number) => number): Array<[number, number]> {
  return Array.from({ length: endSec / 5 + 1 }, (_, i): [number, number] => {
    const t = i * 5;
    const k = AT.findIndex(at => t <= at);
    const prev = (k < 0 ? AT.length : k) - 1;
    if (k >= 0 && AT[k]! - t <= 30) return [t, 150];
    if (recover && prev >= 0 && t - AT[prev]! <= 180) return [t, recover(prev, t - AT[prev]!)];
    return [t, k < 0 ? 100 : pre(k)];
  });
}
const base = { sessionSec: 1500, setAtSec: AT, restingHrBpm: 60, hrMaxBpm: 190 };

describe('A3: drift follows Appendix B (D-A1 point 7)', () => {
  it('drift% compares the mean pre-set HR of the last 3 sets with the first 3', () => {
    // First three 90, 90, 90; last three 98, 98, 98 → +8.9%.
    const d = sessionDrift({ ...base, series: series(k => (k < 3 ? 90 : 98)) });
    expect(d?.driftPct).toBe(8.9);
    expect(d?.drifting).toBe(true);
  });
  it('takes the mean of exactly the first 3 and the last 3 pre-set HRs', () => {
    const pre = [88, 90, 92, 96, 98, 106];
    // (100 - 90) / 90 = 11.1%.
    expect(sessionDrift({ ...base, series: series(k => pre[k]!) })?.driftPct).toBe(11.1);
  });
  it('8% or less is not drift', () => {
    // 100 → 108 is exactly +8%.
    const d = sessionDrift({ ...base, series: series(k => (k < 3 ? 100 : 108)) });
    expect(d?.driftPct).toBe(8);
    expect(d?.drifting).toBe(false);
  });
  it('needs a session of 20+ min and 6+ sets with a pre-set HR', () => {
    const rising = series(k => 90 + 4 * k);
    expect(sessionDrift({ ...base, series: rising, sessionSec: DRIFT.minSessionSec - 1 })).toBeNull();
    expect(sessionDrift({ ...base, series: rising, setAtSec: AT.slice(0, 5) })).toBeNull();
    expect(sessionDrift({ ...base, series: rising })?.drifting).toBe(true);
  });
  it('flags a timeToReady slope over +10 s per set with a flat pre-set HR', () => {
    // Pre-set HR flat at 90 (ready = min(102, 105.5) = 102). After set k, HR sits at 130 for 20 + 15k s, then 95.
    const slow = series(() => 90, 1500, (k, since) => (since <= 20 + 15 * k ? 130 : 95));
    const d = sessionDrift({ ...base, series: slow });
    expect(d?.driftPct).toBe(0);
    expect(d?.readySlopeSecPerSet).toBe(15);
    expect(d?.drifting).toBe(true);
    const steady = series(() => 90, 1500, (_k, since) => (since <= 30 ? 130 : 95));
    expect(sessionDrift({ ...base, series: steady })?.drifting).toBe(false);
  });
  it('without a resting HR only the drift% half is judged', () => {
    const slow = series(() => 90, 1500, (k, since) => (since <= 20 + 15 * k ? 130 : 95));
    const d = sessionDrift({ ...base, series: slow, restingHrBpm: null });
    expect(d?.readySlopeSecPerSet).toBeNull();
    expect(d?.drifting).toBe(false);
  });
});

describe('A3: the heart.drift note (coach)', () => {
  const baseCtx = { sessions: [], splits: [], schedule: emptySchedule(), custom: [], today: '2026-09-18', now: new Date('2026-09-18T12:00:00Z').getTime(), ...baseCoachExtras };
  const start = '2026-09-18T10:00:00.000Z';
  const live = (k: number, kg: number): LoggedSet => ({ kg, reps: 8, effort: 'ideal', fidelity: 'live', at: new Date(Date.parse(start) + AT[k]! * 1000).toISOString() });
  const mk = (sessionEnd = '2026-09-18T10:25:00.000Z') => sessionAt(start, sessionEnd, [{ id: bench, sets: [0, 1, 2].map(k => live(k, 60)) }, { id: fly, sets: [3, 4, 5].map(k => live(k, 20)) }]);

  it('fires on Appendix B drift across exercises and loads, and its advice is water and longer rest, never a load cut', () => {
    const s = mk();
    const out = coachInsights({ ...baseCtx, sessions: [s], heartSeries: id => (id === s.id ? series(k => 90 + 4 * k) : []) }, 20);
    const note = out.find(i => i.id === `heart-drift:${s.id}`);
    expect(note).toBeTruthy();
    expect(note!.noticed).toMatch(/before your last 3 sets was about \d+% higher than before your first 3/);
    expect(note!.action).toMatch(/water/i);
    expect(note!.action).toMatch(/rest a little longer/i);
    expect(`${note!.action} ${note!.means}`).not.toMatch(/trim|cut|drop|lighter|reduce|fewer|less weight|lower the load/i);
  });

  it('stays quiet under 20 minutes, without a series, or when set times are not trusted', () => {
    const short = mk('2026-09-18T10:19:00.000Z');
    const flagged = series(k => 90 + 4 * k);
    expect(coachInsights({ ...baseCtx, sessions: [short], heartSeries: () => flagged }, 20).some(i => i.id.startsWith('heart-drift'))).toBe(false);
    const s = mk();
    expect(coachInsights({ ...baseCtx, sessions: [s] }, 20).some(i => i.id.startsWith('heart-drift'))).toBe(false);
    const retro = { ...s, logging: { ...s.logging!, timingTrusted: false } };
    expect(coachInsights({ ...baseCtx, sessions: [retro], heartSeries: () => flagged }, 20).some(i => i.id.startsWith('heart-drift'))).toBe(false);
  });

  it('three same-load sets with rising peaks and shrinking HRR60 no longer fire (the old F1.4 metric)', () => {
    const withHrr = (peakBpm: number, hrr60: number): LoggedSet => ({ kg: 60, reps: 8, effort: 'ideal', heart: { peakBpm, endBpm: peakBpm, hrr60 } });
    const s = sessionAt(start, '2026-09-18T11:00:00.000Z', [{ id: bench, sets: [withHrr(150, 20), withHrr(160, 15), withHrr(172, 8)] }]);
    expect(coachInsights({ ...baseCtx, sessions: [s], heartSeries: () => [] }, 20).some(i => i.id.startsWith('heart-drift'))).toBe(false);
  });
});
