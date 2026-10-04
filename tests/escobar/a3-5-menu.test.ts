/**
 * A3-5 (D-A3-5): AC5, get_live_session reads the gym's load menu like Train; AC6, one profile source.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const remindersMock = vi.hoisted(() => ({ resyncReminders: vi.fn(async () => undefined) }));
vi.mock('@/slices/settings/reminders', () => remindersMock);

import { replaceState, state } from '@/core/store';
import { DEFAULT_GYM_ID, freshState, type LoggedSet, type Split } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { commitSet, setSet, startSession } from '@/slices/workout/session';
import { profileFor } from '@/slices/workout/units';
import { entryTarget } from '@/slices/workout/Train';
import { refreshClock } from '@/app/clock';
import { loadMenu, loggedLoads } from '@/brain/units';
import { exerciseHistory } from '@/brain/history';
import { autoregulationSuggestion } from '@/brain/coach/live';
import { makeCtx } from '@/escobar/tools/context';
import { getLiveSession } from '@/escobar/tools/read';
import { session, sets } from '../helpers';

const CP = 'lib_machine_chest_press';
const split: Split = { id: 'sp', name: 'Push', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: CP, sets: 3 }] };
const T0 = new Date(2026, 8, 22, 10, 0).getTime();

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(T0); refreshClock(T0); });
afterEach(() => { vi.useRealTimers(); });

const ROOT = join(__dirname, '../../src');
const files = (dir: string): string[] => readdirSync(dir).flatMap(n => { const f = join(dir, n); return statSync(f).isDirectory() ? files(f) : /\.tsx?$/.test(n) ? [f] : []; });

describe('A3-5 AC5: get_live_session uses the gym\'s menu', () => {
  // A learned menu: no saved profile, 29 and 27 kg each logged in two sessions. The 5 kg default steps have neither.
  function setup(): { kg: number; reps: number } {
    const prev = [29, 29, 27, 27].map((kg, i) => session(`2026-09-${10 + i * 2}`, [{ id: CP, sets: sets(kg, 12, 'ideal', 3) }]));
    replaceState({ ...freshState(), splits: [split], sessions: prev });
    const menu = loadMenu(CP, DEFAULT_GYM_ID, state.value.units, findExercise(CP, []), loggedLoads(state.value.sessions, CP, []));
    expect(menu.confidence).toBe('learned');
    startSession(split);
    const t = entryTarget(state.value, state.value.active!.entries[0]!).sets[0]!;
    expect({ kg: t.kg, reps: t.reps }).toEqual({ kg: 29, reps: 8 }); // Train's target is the learned 29 kg rung.
    return { kg: t.kg!, reps: t.reps! };
  }
  /** What Escobar should say: the live advice measured against Train's own target. */
  const againstTrain = (first: LoggedSet, t: { kg: number; reps: number }) => autoregulationSuggestion({
    exerciseId: CP, exerciseName: findExercise(CP, [])!.name, firstSet: first, targetKg: t.kg, targetReps: t.reps,
    historyCount: exerciseHistory(state.value.sessions, CP, []).length, equipment: profileFor(CP, DEFAULT_GYM_ID), holdLoad: false,
  })?.action ?? null;
  const liveAdvice = (first: LoggedSet) => {
    setSet(0, 0, first); commitSet(0, 0);
    return (getLiveSession({}, makeCtx(state.value, T0 + 60_000)) as { adjustment: string | null }).adjustment;
  };

  it('an easy set short of the planned reps is not told to add load past Train\'s target', () => {
    const t = setup();
    const first: LoggedSet = { kg: 26, reps: 7, effort: 'easy', fidelity: 'live' };
    expect(liveAdvice(first)).toBe(againstTrain(first, t));
  });

  it('a max-effort set under Train\'s target is told to drop', () => {
    const t = setup();
    const first: LoggedSet = { kg: 26, reps: 6, effort: 'max', fidelity: 'live' };
    const want = againstTrain(first, t);
    expect(want).toMatch(/^Drop to/);
    expect(liveAdvice(first)).toBe(want);
  });
});

describe('A3-5 AC6: one profile source', () => {
  it('resolveProfile( is called only inside src/brain/units.ts', () => {
    const hits = files(ROOT).filter(f => !f.endsWith(join('brain', 'units.ts')) && readFileSync(f, 'utf8').includes('resolveProfile(')).map(f => f.slice(ROOT.length + 1));
    expect(hits).toEqual([]);
  });
});
