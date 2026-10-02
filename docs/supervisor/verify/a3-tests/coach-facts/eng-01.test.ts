/**
 * ENG-01: at gym B, every live number must come from gym B's load menu (loadMenu, brain/units.ts:126),
 * not from another gym's exercise profile picked by the older resolveProfile (brain/units.ts:46-59).
 * Train's `profile` (Train.tsx:643, profileFor -> resolveProfile) feeds the live retarget (:737),
 * autoregulation (:741), warm-ups (:747), the entry unit (:646) and plate display (:712).
 * Escobar's progressionCtxFor (escobar/tools/context.ts:101) uses the same old resolver.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const remindersMock = vi.hoisted(() => ({ resyncReminders: vi.fn(async () => undefined) }));
vi.mock('@/slices/settings/reminders', () => remindersMock);

import { replaceState, state } from '@/core/store';
import { DEFAULT_GYM_ID, freshState, type AppState, type EquipmentProfile, type Split } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { KG_PER_LB } from '@/core/units';
import { commitSet, setSet, startSession } from '@/slices/workout/session';
import { profileFor } from '@/slices/workout/units';
import { entryTarget } from '@/slices/workout/Train';
import { refreshClock } from '@/app/clock';
import { liveRetarget } from '@/brain/retarget';
import { loadMenu, loadableValues, loggedLoads } from '@/brain/units';
import { warmupOffer } from '@/brain/coach/pre';
import { exerciseHistory } from '@/brain/history';
import { firstWorkingSet } from '@/brain/exposure';
import { makeCtx } from '@/escobar/tools/context';
import { getEquipment, getLiveSession, getNextTarget } from '@/escobar/tools/read';
import { session, sets } from '../../helpers';

const CP = 'lib_machine_chest_press'; // Machine, main, weighted
const GYM_A = DEFAULT_GYM_ID, GYM_B = 'gym_b';
const split: Split = { id: 'sp', name: 'Push', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: CP, sets: 3 }] };
const T0 = new Date(2026, 8, 22, 10, 0).getTime();
const step = (n: number, updatedAt: string): EquipmentProfile => ({ unit: 'kg', step: n, source: 'user', updatedAt });

function setup(): void {
  const base = freshState();
  const prev = [session('2026-09-15', [{ id: CP, sets: sets(28, 8, 'ideal', 3) }]), session('2026-09-18', [{ id: CP, sets: sets(28, 8, 'ideal', 3) }])].map(s => ({ ...s, gymId: GYM_B }));
  const s: AppState = {
    ...base, splits: [split], sessions: prev,
    units: {
      ...base.units,
      gyms: [...base.units.gyms, { id: GYM_B, name: 'Gym B', defaultUnit: 'kg', createdAt: base.createdAt }],
      activeGymId: GYM_B,
      // Gym A: this exercise's own profile, 5 kg steps. Gym B: its Machine group, 4 kg steps.
      byExercise: { [GYM_A]: { [CP]: step(5, '2026-09-01T00:00:00.000Z') } },
      byEquipment: { [GYM_B]: { Machine: step(4, '2026-09-02T00:00:00.000Z') } },
    },
  };
  replaceState(s);
}
const menuB = () => loadMenu(CP, GYM_B, state.value.units, findExercise(CP, []), loggedLoads(state.value.sessions, CP, []));
const onMenu = (kg: number, rungs: number[]) => rungs.some(r => Math.abs(r - kg) < 0.011);

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(T0); refreshClock(T0); setup(); });
afterEach(() => { vi.useRealTimers(); });

describe('ENG-01 current gym/menu across target, warm-up and live retarget', () => {
  it('the profile Train uses at gym B is gym B\'s menu profile', () => {
    expect(menuB().profile.step).toBe(4);
    expect(menuB().confidence).toBe('known');
    expect(profileFor(CP, GYM_B).step).toBe(menuB().profile.step);
  });

  it('live retarget after a failed first set lands on gym B\'s menu (Train.tsx:736-737 composition)', () => {
    startSession(split);
    const entry0 = state.value.active!.entries[0]!;
    expect(state.value.active!.gymId).toBe(GYM_B);
    const next = entryTarget(state.value, entry0);
    const planned1 = { kg: next.sets[0]!.kg!, reps: next.sets[0]!.reps! };
    expect(planned1).toEqual({ kg: 28, reps: 9 });
    setSet(0, 0, { kg: 28, reps: 4, effort: 'max' }); commitSet(0, 0);
    const entry = state.value.active!.entries[0]!;
    const first = firstWorkingSet(entry.sets)!;
    // Exactly what Train.tsx:737 builds, with Train's own `profile` (Train.tsx:643).
    const profile = profileFor(CP, state.value.active!.gymId);
    const trainMenu = { profile, unit: profile.unit, rungsKg: loadableValues(profile).map(v => Math.round(v * (profile.unit === 'lb' ? KG_PER_LB : 1) * 1000) / 1000) };
    const opts = { historyCount: exerciseHistory(state.value.sessions, CP, []).length, holdLoad: !!next.holdLoad, prompts: true };
    const train = liveRetarget([first], planned1, state.value.goal, 'main', trainMenu, opts)!;
    const withB = liveRetarget([first], planned1, state.value.goal, 'main', menuB(), opts)!;
    expect.soft(onMenu(train.kg, menuB().rungsKg), `Train retarget ${train.kg} x ${train.reps}; gym B menu gives ${withB.kg} x ${withB.reps}`).toBe(true);
    expect.soft(train).toEqual(withB);
  });

  it('warm-ups at gym B are gym B loads (Train.tsx:747, warmupOffer with Train\'s profile)', () => {
    const w = warmupOffer(28, profileFor(CP, GYM_B))!;
    const off = w.filter(x => !onMenu(x.kg, menuB().rungsKg)).map(x => x.kg);
    expect.soft(off, `warm-ups ${w.map(x => x.kg).join('/')}`).toEqual([]);
  });

  it('Escobar at gym B: get_equipment, get_next_target warm-ups and live advice use gym B\'s menu', () => {
    const ctx = makeCtx(state.value, T0);
    const eq = getEquipment({ exerciseId: CP, gymId: GYM_B }, ctx) as unknown as { confidence: string; profile: { step: number | null } };
    expect.soft(eq.profile.step, `get_equipment says confidence ${eq.confidence}`).toBe(4);
    const t = getNextTarget({ exerciseId: CP, plannedSets: 3 }, ctx) as unknown as { warmup: Array<{ value?: number; kg?: number }> };
    const wkg = t.warmup.map(x => x.kg ?? x.value ?? 0);
    expect.soft(wkg.filter(kg => !onMenu(kg, menuB().rungsKg)), `get_next_target warm-ups ${wkg.join('/')}`).toEqual([]);
    startSession(split);
    setSet(0, 0, { kg: 28, reps: 4, effort: 'max', fidelity: 'live' }); commitSet(0, 0);
    const live = getLiveSession({}, makeCtx(state.value, T0 + 60_000)) as { adjustment: string | null };
    const kgs = [...(live.adjustment ?? '').matchAll(/(\d+(?:\.\d+)?) kg/g)].map(m => Number(m[1]));
    expect.soft(kgs.filter(kg => !onMenu(kg, menuB().rungsKg)), `get_live_session: ${live.adjustment}`).toEqual([]);
  });
  it('a scaled first target (Escobar 0.9 factor) at gym B snaps to gym B\'s menu (Train.tsx:152 equipment: profileFor)', () => {
    startSession(split);
    const entry = { ...state.value.active!.entries[0]!, loadFactor: 0.9 };
    const next = entryTarget(state.value, entry);
    expect.soft(onMenu(next.kg!, menuB().rungsKg), `scaled target ${next.kg} kg; gym B rungs ${menuB().rungsKg.slice(4, 9).join('/')}`).toBe(true);
  });
});
