/**
 * IMP-E05: get_live_session must report the same training time, rest left and done-set facts as
 * the workout helpers Train uses (session.ts elapsedSec :92, restRemainingSec :435).
 * A3-5 moved case 1 (pause and rest). A3-5b moves case 2, the done count, adjusted to ruling R11
 * (D-A3-5b): setsDone and the sets list both count what Train's exercise card counts (Train.tsx
 * `logged`): filled-in working sets, typed or saved; warm-ups and blank rows never.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const remindersMock = vi.hoisted(() => ({ resyncReminders: vi.fn(async () => undefined) }));
vi.mock('@/slices/settings/reminders', () => remindersMock);

import { replaceState, state } from '@/core/store';
import { freshState, type Split } from '@/core/models';
import { addSet, commitSet, elapsedSec, pauseSession, restRemainingSec, setSet, startRest, startSession } from '@/slices/workout/session';
import { makeCtx } from '@/escobar/tools/context';
import { getLiveSession } from '@/escobar/tools/read';

const BENCH = 'lib_barbell_bench_press';
const split: Split = { id: 'sp', name: 'Push', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: BENCH, sets: 3 }] };
const T0 = Date.parse('2026-09-22T10:00:00.000Z');
const MIN = 60_000;
type Live = { elapsedMin: number; paused: boolean; restSecLeft: number | null; current: { setsDone: number; sets: Array<{ reps?: number }> } };

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(T0); replaceState({ ...freshState(), splits: [split], sessions: [] }); });
afterEach(() => { vi.useRealTimers(); });

describe('IMP-E05 pause and rest agree with Train', () => {
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
});

// A3-5b (R11): Train's card shows `logged` = the working sets with an entry, typed or saved.
describe('IMP-E05 done count agrees with Train\'s card', () => {
  const live = () => getLiveSession({}, makeCtx(state.value, T0 + 5 * MIN)) as Live;

  it('a typed but unsaved set: Train counts 1, so setsDone is 1 and the list holds it', () => {
    startSession(split);
    setSet(0, 0, { kg: 60, reps: 8 }); // typed, never committed
    const l = live();
    expect(l.current.setsDone, 'setsDone vs Train card').toBe(1);
    expect(l.current.sets.map(x => x.reps), 'sets list').toEqual([8]);
  });

  it('a saved set: Train counts 1, setsDone 1, the list holds it', () => {
    startSession(split);
    setSet(0, 0, { kg: 60, reps: 8 });
    expect(commitSet(0, 0), 'precondition: committed').toBe(true);
    const l = live();
    expect(l.current.setsDone).toBe(1);
    expect(l.current.sets.map(x => x.reps)).toEqual([8]);
  });

  it('mixed: a saved warm-up, a saved and a typed working set, a blank row: Train counts 2', () => {
    startSession(split);
    setSet(0, 0, { kind: 'warmup', kg: 40, reps: 10 });
    expect(commitSet(0, 0), 'precondition: warm-up committed').toBe(true);
    setSet(0, 1, { kg: 60, reps: 8 });
    expect(commitSet(0, 1), 'precondition: working set committed').toBe(true);
    setSet(0, 2, { kg: 62.5, reps: 7 }); // typed only
    addSet(0); // a new row (it copies the last row's values)
    setSet(0, 3, { kg: undefined, reps: undefined }); // left blank
    expect(state.value.active!.entries[0]!.sets.map(x => x.reps ?? null), 'precondition: four rows').toEqual([10, 8, 7, null]);
    const l = live();
    expect(l.current.setsDone, 'setsDone vs Train card').toBe(2);
    expect(l.current.sets.map(x => x.reps), 'sets list: the same two sets').toEqual([8, 7]);
  });

  it('never setsDone without the matching list (no setsDone: 1 with sets: [])', () => {
    startSession(split);
    const states: Array<() => void> = [
      () => undefined,
      () => setSet(0, 0, { kg: 60, reps: 8 }),
      () => { commitSet(0, 0); },
      () => setSet(0, 1, { kind: 'warmup', kg: 40, reps: 10 }),
      () => setSet(0, 2, { reps: 0 }),
    ];
    for (const [i, step] of states.entries()) {
      step();
      const l = live();
      expect(l.current.setsDone, `step ${i}`).toBe(l.current.sets.length);
    }
  });
});
