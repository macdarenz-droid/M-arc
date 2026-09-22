/**
 * The recorder needs an identity before the first sample arrives. The old code
 * minted Session.id at finish, which left nothing for a recording to attach to
 * while the workout was actually happening.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { freshState, type AppState } from '@/core/models';
import { initStore, state } from '@/core/store';
import { addSet, commitSet, discardSession, finishSession, startSession } from '@/slices/workout/session';
import { pplSplits, PUSH_ID } from './coach-helpers';

const memory = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) }; };
const seed = (): AppState => { const next = freshState(new Date('2026-06-01T00:00:00Z')); next.splits = pplSplits(); return next; };

const push = () => state.value.splits.find(s => s.id === PUSH_ID)!;

function logOneSet() {
  const entry = state.value.active!.entries[0]!;
  const sets = entry.sets.map((s, i) => (i === 0 ? { ...s, kg: 60, reps: 8, effort: 'ideal' as const } : s));
  state.value = { ...state.value, active: { ...state.value.active!, entries: state.value.active!.entries.map((e, i) => (i === 0 ? { ...e, sets } : e)) } };
  return commitSet(0, 0);
}

describe('workout identity', () => {
  beforeEach(() => { initStore(memory()); state.value = seed(); });

  it('exists the moment the workout starts', () => {
    startSession(push());
    expect(typeof state.value.active!.id).toBe('string');
    expect(state.value.active!.id!.length).toBeGreaterThan(0);
  });

  it('is the same id the saved workout keeps', () => {
    startSession(push());
    const started = state.value.active!.id;
    expect(logOneSet()).toBe(true);
    const finished = finishSession(false);
    expect(finished!.session.id).toBe(started);
    expect(state.value.sessions.at(-1)!.id).toBe(started);
  });

  it('is fresh for each workout, so two never share a recording', () => {
    startSession(push()); const first = state.value.active!.id;
    discardSession();
    startSession(push()); const second = state.value.active!.id;
    expect(second).not.toBe(first);
  });

  it('survives a discarded workout without leaving one behind', () => {
    startSession(push());
    discardSession();
    expect(state.value.active).toBeNull();
  });
});

describe('logging marks', () => {
  beforeEach(() => { initStore(memory()); state.value = seed(); });

  it('a committed row records when it was committed', () => {
    startSession(push());
    expect(logOneSet()).toBe(true);
    const at = state.value.active!.entries[0]!.sets[0]!.loggedAt;
    expect(typeof at).toBe('string');
    expect(Number.isNaN(Date.parse(at!))).toBe(false);
  });

  it('a second commit of the same row does not move the mark', () => {
    startSession(push());
    logOneSet();
    const first = state.value.active!.entries[0]!.sets[0]!.loggedAt;
    commitSet(0, 0);
    expect(state.value.active!.entries[0]!.sets[0]!.loggedAt).toBe(first);
  });

  it('an uncommitted row carries no mark', () => {
    startSession(push());
    addSet(0);
    const last = state.value.active!.entries[0]!.sets.at(-1)!;
    expect(last.loggedAt).toBeUndefined();
  });

  it('the mark survives into the saved workout', () => {
    startSession(push());
    logOneSet();
    const finished = finishSession(false);
    expect(finished!.session.exercises[0]!.sets[0]!.loggedAt).toBeDefined();
  });
});
