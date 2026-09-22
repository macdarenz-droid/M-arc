/**
 * Persistence, restore and identity. A recording is only ever as trustworthy
 * as the workout it points at, so a malformed summary is dropped whole and a
 * bad backup is refused before anything is replaced.
 */
import { describe, it, expect } from 'vitest';
import { prepareHeartRateRestore } from '@/heart-rate/backup';
import type { HeartRateTrace } from '@/heart-rate/types';
import type { ActiveSession, AppState, HeartRateSummary, Session } from '@/core/models';
import { freshState } from '@/core/models';
import { loadState, STATE_KEY } from '@/core/store';

const HOUR = 3_600_000;
const START = Date.parse('2026-09-20T10:00:00.000Z');

const session = (id: string, startMs = START): Session => ({
  id, splitId: 'split_push', splitName: 'Push', day: new Date(startMs).toISOString().slice(0, 10),
  startedAt: new Date(startMs).toISOString(), endedAt: new Date(startMs + HOUR).toISOString(),
  durationSec: 3600, exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', sets: [{ kg: 60, reps: 8, effort: 'ideal' }] }],
});

const trace = (sessionId: string, count = 400): HeartRateTrace => ({
  sessionId, version: 1,
  samples: Array.from({ length: count }, (_, i) => ({
    bpm: 130, receivedAtEpochMs: START + i * 5_000, receivedAtElapsedMs: i * 5_000, source: 'ble-heart-rate' as const,
  })),
  summary: { sampleCount: 0, gapCount: 0 },
});

describe('prepareHeartRateRestore', () => {
  it('recomputes each summary against the workout it belongs to', () => {
    const sessions = [session('s_a')];
    const result = prepareHeartRateRestore(sessions, { version: 1, traces: [trace('s_a')] });
    expect(result.sessions[0]!.heartRate!.metricsVersion).toBe(2);
    expect(result.sessions[0]!.heartRate!.averageBpm).toBe(130);
    expect(result.payload.replace).toBe(true);
  });

  it('drops a trace whose workout is not in the restore rather than inventing one', () => {
    const result = prepareHeartRateRestore([session('s_a')], { version: 1, traces: [trace('s_a'), trace('s_ghost')] });
    expect(result.payload.traces.map(t => t.sessionId)).toEqual(['s_a']);
  });

  it('refuses the whole file when a trace is malformed, leaving nothing half-applied', () => {
    const bad = { ...trace('s_a'), version: 2 as unknown as 1 };
    expect(() => prepareHeartRateRestore([session('s_a')], { version: 1, traces: [bad] })).toThrow();
  });

  it('refuses a trace carrying an impossible reading', () => {
    const bad = trace('s_a');
    bad.samples[3] = { ...bad.samples[3]!, bpm: 900 };
    expect(() => prepareHeartRateRestore([session('s_a')], { version: 1, traces: [bad] })).toThrow();
  });

  it('refuses a duplicated workout id rather than picking one', () => {
    expect(() => prepareHeartRateRestore([session('s_a')], { version: 1, traces: [trace('s_a'), trace('s_a')] })).toThrow();
  });

  it('refuses a payload that is not a version-1 backup', () => {
    expect(() => prepareHeartRateRestore([session('s_a')], { version: 2, traces: [] } as never)).toThrow();
  });

  it('restores an older backup with no traces without touching the workouts', () => {
    const sessions = [session('s_a')];
    const result = prepareHeartRateRestore(sessions, undefined);
    expect(result.sessions).toEqual(sessions);
    expect(result.payload.traces).toEqual([]);
  });

  it('keeps a trace for the workout still in progress but gives it no summary in state', () => {
    const active = { id: 's_live', splitId: 'split_push', startedAt: new Date(START).toISOString(), pausedMs: 0, entries: [] } as ActiveSession;
    const result = prepareHeartRateRestore([session('s_a')], { version: 1, traces: [trace('s_live')] }, active);
    expect(result.payload.traces.map(t => t.sessionId)).toEqual(['s_live']);
    expect(result.payload.traces[0]!.endedAtEpochMs).toBeUndefined();
    expect(result.sessions.every(s => !s.heartRate)).toBe(true);
  });
});

describe('normalization on load', () => {
  const store = (state: unknown) => {
    const map = new Map<string, string>([[STATE_KEY, JSON.stringify(state)]]);
    return { getItem: (k: string) => map.get(k) ?? null, setItem: () => undefined, removeItem: () => undefined };
  };
  const withSession = (heartRate: unknown): AppState => ({ ...freshState(), sessions: [{ ...session('s_a'), heartRate } as Session] });

  it('keeps a well-formed summary', () => {
    const good: HeartRateSummary = { metricsVersion: 2, sampleCount: 600, capturedMs: 3_200_000, durationMs: HOUR, coveragePct: 89, averageBpm: 130, recordedPeakBpm: 168, firstSampleAt: new Date(START).toISOString(), lastSampleAt: new Date(START + 3_200_000).toISOString(), gapCount: 2 };
    expect(loadState(store(withSession(good))).state.sessions[0]!.heartRate).toEqual(good);
  });

  it.each([
    ['a negative sample count', { sampleCount: -1, gapCount: 0 }],
    ['a missing gap count', { sampleCount: 10 }],
    ['an impossible BPM', { sampleCount: 10, gapCount: 0, averageBpm: 900 }],
    ['an unknown metrics version', { metricsVersion: 7, sampleCount: 10, gapCount: 0 }],
    ['coverage above 100%', { sampleCount: 10, gapCount: 0, coveragePct: 140 }],
    ['a non-date sample time', { sampleCount: 10, gapCount: 0, firstSampleAt: 'never' }],
    ['a string where a number belongs', { sampleCount: '10', gapCount: 0 }],
    ['nonsense entirely', 'not an object'],
  ])('drops a summary with %s, and keeps the workout', (_label, heartRate) => {
    const loaded = loadState(store(withSession(heartRate))).state;
    expect(loaded.sessions).toHaveLength(1);
    expect(loaded.sessions[0]!.heartRate).toBeUndefined();
    expect(loaded.sessions[0]!.exercises).toHaveLength(1);
  });

  it('gives a workout already in progress an id so the recorder can attach to it', () => {
    const legacyActive = { splitId: 'split_push', startedAt: new Date(START).toISOString(), pausedMs: 0, entries: [] };
    const loaded = loadState(store({ ...freshState(), active: legacyActive })).state;
    expect(typeof loaded.active!.id).toBe('string');
    expect(loaded.active!.id!.length).toBeGreaterThan(0);
  });

  it('never rewrites an id a workout already has', () => {
    const active = { id: 's_keepme', splitId: 'split_push', startedAt: new Date(START).toISOString(), pausedMs: 0, entries: [] };
    expect(loadState(store({ ...freshState(), active })).state.active!.id).toBe('s_keepme');
  });
});

describe('a person with no watch gains no new screens', () => {
  it('the surfaces stay hidden with no sensor and no recording', async () => {
    const { heartRateSurfacesVisible } = await import('@/heart-rate/store');
    const { state } = await import('@/core/store');
    state.value = { ...freshState(), sessions: [session('s_a')] };
    expect(heartRateSurfacesVisible.value).toBe(false);
  });

  it('they appear once any workout carries a recording', async () => {
    const { heartRateSurfacesVisible } = await import('@/heart-rate/store');
    const { state } = await import('@/core/store');
    const recorded: Session = { ...session('s_a'), heartRate: { metricsVersion: 2, sampleCount: 600, capturedMs: 3_200_000, durationMs: HOUR, coveragePct: 89, averageBpm: 130, recordedPeakBpm: 168, gapCount: 0 } };
    state.value = { ...freshState(), sessions: [recorded] };
    expect(heartRateSurfacesVisible.value).toBe(true);
  });

  it('an empty recording does not count as one', async () => {
    const { heartRateSurfacesVisible } = await import('@/heart-rate/store');
    const { state } = await import('@/core/store');
    state.value = { ...freshState(), sessions: [{ ...session('s_a'), heartRate: { sampleCount: 0, gapCount: 0 } }] };
    expect(heartRateSurfacesVisible.value).toBe(false);
  });
});
