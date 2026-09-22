/**
 * Recovering summaries from the native store after a restart.
 *
 * Every native call here is awaited, and the workout log can change underneath
 * those awaits — the person can edit or delete a workout while the recorder is
 * still answering. Both cases have to leave the log alone.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { HeartRateSummary, Session } from '@/core/models';
import { freshState } from '@/core/models';

const HOUR = 3_600_000;
const START = Date.parse('2026-09-20T10:00:00.000Z');

const summary = (averageBpm: number): HeartRateSummary => ({
  metricsVersion: 2, sampleCount: 600, capturedMs: 3_200_000, durationMs: HOUR,
  coveragePct: 89, averageBpm, recordedPeakBpm: averageBpm + 30,
  firstSampleAt: new Date(START).toISOString(), lastSampleAt: new Date(START + 3_200_000).toISOString(), gapCount: 0,
});

const session = (id: string, startMs = START): Session => ({
  id, splitId: 'split_push', splitName: 'Push', day: new Date(startMs).toISOString().slice(0, 10),
  startedAt: new Date(startMs).toISOString(), endedAt: new Date(startMs + HOUR).toISOString(),
  durationSec: 3600, exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench', sets: [{ kg: 60, reps: 8, effort: 'ideal' }] }],
});

/** Resolves when the test releases it, so a workout can be edited mid-flight. */
let gate: { promise: Promise<void>; release: () => void };
const getSessionSummary = vi.fn();

vi.mock('@/heart-rate/native', () => ({
  heartRateNativeAvailable: () => true,
  heartRateNative: () => ({
    getSessionSummary,
    addListener: vi.fn(async () => ({ remove: vi.fn() })),
    getStatus: vi.fn(async () => ({ available: true, state: 'lost', title: '', detail: '' })),
    listDevices: vi.fn(async () => ({ devices: [] })),
    reconnectRemembered: vi.fn(async () => ({ started: false })),
  }),
}));

describe('refreshHeartRateSummaries', () => {
  beforeEach(() => {
    let release!: () => void;
    const promise = new Promise<void>(resolve => { release = resolve; });
    gate = { promise, release };
    getSessionSummary.mockReset();
  });

  it('adopts a summary the native store holds but app state has lost', async () => {
    const { state } = await import('@/core/store');
    const { refreshHeartRateSummaries } = await import('@/heart-rate/store');
    state.value = { ...freshState(), sessions: [session('s_a')] };
    getSessionSummary.mockResolvedValue({ summary: summary(131) });

    await refreshHeartRateSummaries();
    expect(state.value.sessions[0]!.heartRate?.averageBpm).toBe(131);
  });

  it('writes nothing when the stored summary already matches', async () => {
    const { state } = await import('@/core/store');
    const { refreshHeartRateSummaries } = await import('@/heart-rate/store');
    const existing = summary(131);
    state.value = { ...freshState(), sessions: [{ ...session('s_a'), heartRate: existing }] };
    const before = state.value;
    getSessionSummary.mockResolvedValue({ summary: { ...existing } });

    await refreshHeartRateSummaries();
    expect(state.value).toBe(before);
  });

  /** The bug this replaced: a summary computed for times the workout no longer has. */
  it('discards a summary whose workout was re-timed while the call was in flight', async () => {
    const { state } = await import('@/core/store');
    const { refreshHeartRateSummaries } = await import('@/heart-rate/store');
    state.value = { ...freshState(), sessions: [session('s_a')] };
    getSessionSummary.mockImplementation(async () => { await gate.promise; return { summary: summary(131) }; });

    const pending = refreshHeartRateSummaries();
    // The person edits the workout's start and end while the recorder answers.
    state.value = { ...state.value, sessions: [session('s_a', START + 5 * HOUR)] };
    gate.release();
    await pending;

    expect(state.value.sessions[0]!.heartRate).toBeUndefined();
  });

  it('does not resurrect a workout deleted while the call was in flight', async () => {
    const { state } = await import('@/core/store');
    const { refreshHeartRateSummaries } = await import('@/heart-rate/store');
    state.value = { ...freshState(), sessions: [session('s_a')] };
    getSessionSummary.mockImplementation(async () => { await gate.promise; return { summary: summary(131) }; });

    const pending = refreshHeartRateSummaries();
    state.value = { ...state.value, sessions: [] };
    gate.release();
    await pending;

    expect(state.value.sessions).toEqual([]);
  });

  it('keeps the saved summary when the recorder is not answering yet', async () => {
    const { state } = await import('@/core/store');
    const { refreshHeartRateSummaries } = await import('@/heart-rate/store');
    const existing = summary(140);
    state.value = { ...freshState(), sessions: [{ ...session('s_a'), heartRate: existing }] };
    getSessionSummary.mockRejectedValue(new Error('service not bound'));

    await refreshHeartRateSummaries();
    expect(state.value.sessions[0]!.heartRate).toEqual(existing);
  });

  it('ignores an empty recording rather than overwriting a good one', async () => {
    const { state } = await import('@/core/store');
    const { refreshHeartRateSummaries } = await import('@/heart-rate/store');
    const existing = summary(140);
    state.value = { ...freshState(), sessions: [{ ...session('s_a'), heartRate: existing }] };
    getSessionSummary.mockResolvedValue({ summary: { sampleCount: 0, gapCount: 0 } });

    await refreshHeartRateSummaries();
    expect(state.value.sessions[0]!.heartRate).toEqual(existing);
  });
});
