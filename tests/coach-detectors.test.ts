import { describe, it, expect } from 'vitest';
import {
  detectVolumeTrend, detectSetsOutOfBand, detectUncovered, detectProgress, detectRecords, detectUnderRecovered, adjustedRecovery,
  detectEffortMissing, detectEffortDrift, detectEffortMismatch, detectRepRangeMismatch, detectRedundant, detectBalance, detectGap, detectFirstSessions, detectSleep,
  detectNoteFlags, NOTE_FLAG_LOOKBACK_DAYS, MAX_NOTE_FLAGS,
} from '@/brain/coach/detectors';
import { session, sets } from './helpers';
import { ctx, pplHistory, pplSplits, std, LAST_MONDAY, TODAY, PUSH_EX, PUSH_ID, history } from './coach-helpers';
import { addDays } from '@/core/dates';

describe('volume detectors', () => {
  it('flags a chest drop and an arm spike against the 8-week baseline, and stays quiet elsewhere', () => {
    const sessions = pplHistory(LAST_MONDAY, 14, (w, split, ex) => {
      if (split !== 'push' || w < 11) return ex; // last three complete weeks are w = 11, 12, 13
      return ex
        .filter(e => e.id !== 'lib_barbell_bench_press' && e.id !== 'lib_incline_dumbbell_press')
        .concat([{ id: 'lib_hammer_curl', sets: sets(12, 10, 'ideal', 6) }, { id: 'lib_skull_crusher', sets: sets(20, 10, 'ideal', 6) }]);
    });
    const out = detectVolumeTrend(ctx(sessions));
    const chest = out.find(f => f.kind === 'volume_drop' && f.subject.muscleGroup === 'chest');
    expect(chest).toBeDefined();
    expect(Number(chest!.metrics.changePct)).toBeLessThan(-30);
    expect(chest!.window.weeks).toBe(3);
    expect(chest!.principles).toContain('volume_dose_response');
    expect(chest!.confidence).toBe('high');
    const arms = out.find(f => f.kind === 'volume_spike' && f.subject.muscleGroup === 'arms');
    expect(arms).toBeDefined();
    expect(arms!.principles).toContain('load_monitoring_acwr');
    expect(out.some(f => f.subject.muscleGroup === 'legs')).toBe(false);
  });

  it('needs six weeks of data before it speaks', () => {
    const sessions = pplHistory(LAST_MONDAY, 4, (w, split, ex) => (split === 'push' && w >= 2 ? [] : ex));
    expect(detectVolumeTrend(ctx(sessions))).toEqual([]);
  });

  it('flags a muscle far above the weekly band for three weeks', () => {
    const heavyChest = ['lib_barbell_bench_press', 'lib_incline_dumbbell_press', 'lib_machine_chest_press', 'lib_cable_fly', 'lib_dumbbell_fly', 'lib_pec_fly'];
    const sessions = history(LAST_MONDAY, 4, [
      { weekday: 'mon', splitId: PUSH_ID, exercises: () => std(heavyChest, 30, 10, 'ideal', 5) },
      { weekday: 'thu', splitId: PUSH_ID, exercises: () => std(heavyChest, 30, 10, 'ideal', 5) },
    ]);
    const out = detectSetsOutOfBand(ctx(sessions));
    expect(out.map(f => f.subject.muscle)).toContain('chest');
    expect(Number(out[0]!.metrics.weeklySets)).toBeGreaterThan(25);
  });

  it('names major muscles nobody is training', () => {
    const noHams = pplHistory(LAST_MONDAY, 6, (_, split, ex) => (split === 'legs' ? ex.filter(e => e.id !== 'lib_romanian_deadlift' && e.id !== 'lib_seated_leg_curl') : ex));
    const out = detectUncovered(ctx(noHams));
    expect(out.map(f => f.subject.muscle)).toContain('hamstrings');
    expect(out.some(f => f.subject.muscle === 'quads')).toBe(false);
    const full = detectUncovered(ctx(pplHistory(LAST_MONDAY, 6)));
    expect(full.some(f => f.subject.muscle === 'hamstrings')).toBe(false);
  });
});

describe('progress detectors', () => {
  const bench = (kgs: number[]) => kgs.map((kg, i) => session(addDays('2026-07-06', i * 4), [{ id: 'lib_barbell_bench_press', sets: sets(kg, 8) }]));
  it('plateau, decline and progressing over eight sessions', () => {
    const flat = detectProgress(ctx(bench([60, 60, 60, 60, 60, 60, 60, 60])));
    expect(flat.map(f => f.kind)).toEqual(['plateau']);
    expect(flat[0]!.window.sessions).toBe(8);
    expect(flat[0]!.metrics.lastTopKg).toBe(60);
    const down = detectProgress(ctx(bench([70, 69, 68, 67, 66, 65, 64, 63])));
    expect(down.map(f => f.kind)).toEqual(['decline']);
    expect(down[0]!.severity).toBe(2);
    const up = detectProgress(ctx(bench([50, 52, 54, 56, 58, 60, 62, 64])));
    expect(up.map(f => f.kind)).toEqual(['progressing']);
    expect(up[0]!.severity).toBe(0);
    expect(detectProgress(ctx(bench([60, 60, 60, 60, 60, 60])))).toEqual([]);
  });

  it('reports records set this week', () => {
    const s = [...bench([60, 60, 60]), session('2026-09-17', [{ id: 'lib_barbell_bench_press', sets: sets(65, 8) }])];
    const out = detectRecords(ctx(s));
    expect(out.some(f => f.kind === 'record' && f.metrics.recordKind === 'heaviest')).toBe(true);
    expect(out[0]!.principles).toContain('one_rm_estimation');
  });
});

describe('recovery detector', () => {
  it('flags chest 24 h after an ideal session and widens the window after an unusually big session', () => {
    const now = new Date('2026-09-19T18:00:00.000Z').getTime();
    const prior = [0, 1, 2, 3].map(i => session(addDays('2026-09-01', i * 4), [{ id: 'lib_machine_chest_press', sets: sets(50, 8, 'ideal', 3) }]));
    const usual = [...prior, session('2026-09-18', [{ id: 'lib_machine_chest_press', sets: sets(50, 8, 'ideal', 3) }])];
    const base = detectUnderRecovered(ctx(usual, { now }));
    const chest = base.find(f => f.subject.muscle === 'chest')!;
    expect(chest).toBeDefined();
    expect(chest.metrics.pct).toBe(50);
    expect(chest.metrics.volumeFactor).toBe(1);
    expect(chest.principles).toEqual(['recovery_time_course']);
    const big = [...prior, session('2026-09-18', [{ id: 'lib_machine_chest_press', sets: sets(50, 8, 'ideal', 9) }])];
    const adj = adjustedRecovery(ctx(big, { now })).find(r => r.muscle === 'chest')!;
    expect(adj.volumeFactor).toBe(1.5);
    expect(adj.adjustedWindowHours).toBe(72);
    expect(adj.adjustedPct).toBe(33);
    const quads = adjustedRecovery(ctx(big, { now })).find(r => r.muscle === 'quads')!;
    expect(quads.adjustedPct).toBe(100);
  });
});

describe('effort detectors', () => {
  it('missing ratings', () => {
    const s = [0, 1, 2].map(i => session(addDays('2026-09-10', i * 2), std(PUSH_EX, 40, 8, null).map(e => ({ id: e.id, sets: e.sets }))));
    const out = detectEffortMissing(ctx(s));
    expect(out).toHaveLength(1);
    expect(out[0]!.metrics.ratedPct).toBe(0);
  });
  it('drift harder over six rated sessions', () => {
    const efforts = ['easy', 'easy', 'easy', 'max', 'max', 'max'] as const;
    const s = efforts.map((e, i) => session(addDays('2026-08-20', i * 4), [{ id: 'lib_barbell_bench_press', sets: sets(60, 8, e) }]));
    const out = detectEffortDrift(ctx(s));
    expect(out.map(f => f.kind)).toEqual(['effort_drift_harder']);
    expect(out[0]!.confidence).toBe('high');
  });
  it('effort against the goal band', () => {
    const allMax = [0, 1, 2, 3].map(i => session(addDays('2026-09-01', i * 4), [{ id: 'lib_barbell_bench_press', sets: sets(60, 5, 'max') }]));
    const strength = detectEffortMismatch(ctx(allMax, { goal: 'strength' }));
    expect(strength).toHaveLength(1);
    expect(strength[0]!.metrics.direction).toBe('harder_than_goal');
    expect(detectEffortMismatch(ctx(allMax, { goal: 'growth' }))).toEqual([]);
    const allEasy = allMax.map(s => ({ ...s, exercises: s.exercises.map(e => ({ ...e, sets: sets(60, 12, 'easy') })) }));
    expect(detectEffortMismatch(ctx(allEasy, { goal: 'growth' }))[0]!.metrics.direction).toBe('easier_than_goal');
  });
  it('rep range against the goal', () => {
    const twelves = [0, 1, 2, 3].map(i => session(addDays('2026-09-01', i * 4), [{ id: 'lib_barbell_bench_press', sets: sets(40, 12) }]));
    const out = detectRepRangeMismatch(ctx(twelves, { goal: 'strength' }));
    expect(out).toHaveLength(1);
    expect(out[0]!.metrics).toMatchObject({ direction: 'above', typicalReps: 12, rangeLow: 1, rangeHigh: 5 });
    expect(out[0]!.severity).toBe(1);
    expect(detectRepRangeMismatch(ctx(twelves, { goal: 'growth' }))).toEqual([]);
  });
});

describe('structure and consistency detectors', () => {
  it('redundant exercises inside a split', () => {
    const splits = pplSplits();
    splits[0]!.exercises.push({ exerciseId: 'lib_dumbbell_bench_press', sets: 3 });
    const out = detectRedundant(ctx([], { splits }));
    expect(out).toHaveLength(1);
    expect(out[0]!.metrics.count).toBe(2);
    expect(String(out[0]!.metrics.exerciseIds).split(',')).toContain('lib_dumbbell_bench_press');
    expect(out[0]!.subject.splitId).toBe(PUSH_ID);
  });
  it('push-only weeks trail on pull', () => {
    const s = history(LAST_MONDAY, 3, [
      { weekday: 'mon', splitId: PUSH_ID, exercises: () => std(PUSH_EX) },
      { weekday: 'thu', splitId: PUSH_ID, exercises: () => std(PUSH_EX) },
    ]);
    const out = detectBalance(ctx(s));
    expect(out).toHaveLength(1);
    expect(out[0]!.metrics.weak).toBe('Pull');
    expect(out[0]!.principles).toEqual(['push_pull_balance']);
  });
  it('gap, first sessions and short sleep', () => {
    const s = [session('2026-09-09', std(PUSH_EX))];
    expect(detectGap(ctx(s))[0]!.metrics.days).toBe(10);
    expect(detectGap(ctx([session('2026-09-16', std(PUSH_EX))]))).toEqual([]);
    expect(detectFirstSessions(ctx(s))[0]!.metrics.sessions).toBe(1);
    const sleepy = ctx(s, { health: { connected: true, lastSync: `${TODAY}T08:00:00.000Z`, sleepMinutes: 300 } });
    expect(detectSleep(sleepy)[0]!.metrics.sleepMinutes).toBe(300);
    expect(detectSleep(ctx(s, { health: { connected: true, lastSync: '2026-09-10T08:00:00.000Z', sleepMinutes: 300 } }))).toEqual([]);
    expect(detectSleep(ctx(s, { health: { connected: true, lastSync: `${TODAY}T08:00:00.000Z`, sleepMinutes: 420 } }))).toEqual([]);
  });
});

describe('note flags', () => {
  it('recalls the most recent flag per kind and muscle, newest first, with real evidence', () => {
    const s = [
      { ...session('2026-09-14', std(PUSH_EX)), noteFlags: [{ kind: 'pain_or_discomfort' as const, muscle: 'rear_delts' as const }] },
      { ...session('2026-09-16', std(PUSH_EX)), noteFlags: [{ kind: 'pain_or_discomfort' as const, muscle: 'rear_delts' as const }, { kind: 'positive' as const, muscle: null }] },
    ];
    const out = detectNoteFlags(ctx(s));
    expect(out).toHaveLength(2);
    const pain = out.find(f => f.metrics.flagKind === 'pain_or_discomfort')!;
    expect(pain.metrics.day).toBe('2026-09-16'); // the newer of the two mentions, not the older
    expect(pain.metrics.daysAgo).toBe(3);
    expect(pain.subject.muscle).toBe('rear_delts');
    expect(pain.severity).toBe(1);
    expect(pain.confidence).toBe('high');
    expect(pain.evidence.sessionIds).toEqual([s[1]!.id]);
    expect(pain.principles).toEqual(['subjective_readiness_monitoring']);
    const positive = out.find(f => f.metrics.flagKind === 'positive')!;
    expect(positive.subject.muscle).toBeUndefined();
    expect(positive.severity).toBe(0);
  });

  it('drops a flag once it falls outside the lookback window', () => {
    const old = [{ ...session('2026-09-09', std(PUSH_EX)), noteFlags: [{ kind: 'fatigue' as const, muscle: null }] }];
    expect(NOTE_FLAG_LOOKBACK_DAYS).toBe(7); // 2026-09-19 minus 2026-09-09 is 10 days: outside the window
    expect(detectNoteFlags(ctx(old))).toEqual([]);
  });

  it('never fires on a session with no note flags, and caps at the newest few', () => {
    expect(detectNoteFlags(ctx([session('2026-09-17', std(PUSH_EX))]))).toEqual([]);
    const kinds = ['pain_or_discomfort', 'equipment_issue', 'fatigue', 'schedule', 'form_check'] as const;
    const s = kinds.map((k, i) => ({ ...session(`2026-09-1${5 + i}`, std(PUSH_EX)), noteFlags: [{ kind: k, muscle: null }] }));
    expect(detectNoteFlags(ctx(s))).toHaveLength(MAX_NOTE_FLAGS);
  });
});
