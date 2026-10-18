/**
 * IMP-E05: get_live_session must report the same training time, rest left and done-set facts as
 * the workout helpers Train uses (session.ts elapsedSec :92, restRemainingSec :435, isCommitted :49).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const remindersMock = vi.hoisted(() => ({ resyncReminders: vi.fn(async () => undefined) }));
vi.mock('@/slices/settings/reminders', () => remindersMock);

import { replaceState, state } from '@/core/store';
import { freshState, type Split } from '@/core/models';
import { elapsedSec, isCommitted, pauseSession, restRemainingSec, setSet, startRest, startSession } from '@/slices/workout/session';
import { isWorkingSet } from '@/brain/exposure';
import { makeCtx } from '@/escobar/tools/context';
import { getLiveSession } from '@/escobar/tools/read';

const BENCH = 'lib_barbell_bench_press';
const split: Split = { id: 'sp', name: 'Push', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: BENCH, sets: 3 }] };
const T0 = Date.parse('2026-09-22T10:00:00.000Z');
const MIN = 60_000;
type Live = { elapsedMin: number; paused: boolean; restSecLeft: number | null; current: { setsDone: number; sets: unknown[] } };

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(T0); replaceState({ ...freshState(), splits: [split], sessions: [] }); });
afterEach(() => { vi.useRealTimers(); });

describe('IMP-E05 pause, rest and done counts agree with Train', () => {
  it('paused 10 minutes in with 60 s of rest left, asked 10 minutes later', () => {
    startSession(split);
    vi.setSystemTime(T0 + 10 * MIN - 60_000);
    startRest(120); // ends at T0+11min
    vi.setSystemTime(T0 + 10 * MIN);
    pauseSession();
    const now = T0 + 20 * MIN;
    vi.setSystemTime(now);
    const a = state.value.active!;
    expect(Math.round(elapsedSec(a, now) / 60)).toBe(10);
    expect(restRemainingSec(a, now)).toBe(60);
    const l = getLiveSession({}, makeCtx(state.value, now)) as Live;
    expect(l.paused).toBe(true);
    expect.soft(l.elapsedMin, 'elapsedMin').toBe(Math.round(elapsedSec(a, now) / 60));
    expect.soft(l.restSecLeft, 'restSecLeft').toBe(restRemainingSec(a, now));
  });

  it('a typed but uncommitted set: done count and the set list agree', () => {
    startSession(split);
    setSet(0, 0, { kg: 60, reps: 8 }); // typed, never committed
    const now = T0 + 5 * MIN;
    vi.setSystemTime(now);
    const a = state.value.active!;
    const committedWorking = a.entries[0]!.sets.filter(x => isCommitted(x) && isWorkingSet(x)).length;
    expect(committedWorking).toBe(0);
    const l = getLiveSession({}, makeCtx(state.value, now)) as Live;
    expect.soft(l.current.setsDone, 'setsDone vs committed working sets').toBe(committedWorking);
    expect.soft(l.current.setsDone, 'setsDone vs returned sets list').toBe(l.current.sets.length);
  });
});
