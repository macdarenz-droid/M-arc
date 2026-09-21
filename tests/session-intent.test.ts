import { beforeEach, describe, expect, it } from 'vitest';
import { capturePlan } from '@/brain/debrief';
import { captureSessionIntent } from '@/brain/coach/deload';
import { freshState, type AppState, type PlanAgreementChange, type Session, type WorkoutPlanSnapshot } from '@/core/models';
import { initStore, loadState, replaceState, STATE_KEY, state, update } from '@/core/store';
import { pauseSession, resumeSession, startSession } from '@/slices/workout/session';
import { ctx, pplSplits, PUSH_ID } from './coach-helpers';

const memory = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) }; };
const seed = (): AppState => { const next = freshState(new Date('2026-06-01T00:00:00Z')); next.splits = pplSplits(); return next; };
const savedStorage = (saved: AppState) => {
  const m = new Map([[STATE_KEY, JSON.stringify(saved)]]);
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
};

const basePlan = (over: Partial<WorkoutPlanSnapshot> = {}): WorkoutPlanSnapshot => ({
  version: 1,
  capturedAt: '2026-09-19T10:00:00.000Z',
  goal: 'strength',
  deload: null,
  entries: [
    { id: 'pe1', exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press', mode: 'weighted', origin: 'start', plannedSets: 3, targetSource: 'starter', allowIncrease: false, targets: [{ kg: null, reps: null, durationSec: null }, { kg: null, reps: null, durationSec: null }, { kg: null, reps: null, durationSec: null }] },
  ],
  ...over,
});

describe('I01/I02/I06: captureSessionIntent — the pure selector', () => {
  it('I01: no active deload captures normal, with a null cap — never an invented RIR-band ceiling', () => {
    const intent = captureSessionIntent(null, '2026-09-19', '2026-09-19T10:00:00.000Z');
    expect(intent).toEqual({ kind: 'normal', capturedAt: '2026-09-19T10:00:00.000Z', source: 'session_start', effortCap: null });
  });

  it('I02: an active accepted deload captures easier, with its own saved cap', () => {
    const deload = { from: '2026-09-18', to: '2026-09-24', loadFactor: 0.85, effortCap: 'easy' as const };
    const intent = captureSessionIntent(deload, '2026-09-20', '2026-09-20T08:00:00.000Z');
    expect(intent).toEqual({ kind: 'easier', capturedAt: '2026-09-20T08:00:00.000Z', source: 'accepted_deload', effortCap: 'easy' });
  });

  it('I06: the deload boundary is inclusive on both ends, matching deloadActive\'s own date policy', () => {
    const deload = { from: '2026-09-18', to: '2026-09-24', loadFactor: 0.85, effortCap: 'ideal' as const };
    expect(captureSessionIntent(deload, '2026-09-18', 't').kind).toBe('easier');
    expect(captureSessionIntent(deload, '2026-09-24', 't').kind).toBe('easier');
    expect(captureSessionIntent(deload, '2026-09-17', 't').kind).toBe('normal');
    expect(captureSessionIntent(deload, '2026-09-25', 't').kind).toBe('normal');
  });
});

describe('I01/I02: capturePlan attaches the matching assessment', () => {
  it('a normal capture gets an empty, version-1 assessment with a null cap', () => {
    const snapshot = capturePlan(ctx([]), [{ id: 'pe1', exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press', plannedSets: 3, origin: 'start' }], '2026-09-19T10:00:00.000Z');
    expect(snapshot.assessment).toEqual({
      version: 1,
      intent: { kind: 'normal', capturedAt: '2026-09-19T10:00:00.000Z', source: 'session_start', effortCap: null },
      changes: [], invalidatedEntryIds: [], seenWorkingRows: [],
    });
  });

  it('a deload-active capture gets easier intent with the actual saved cap', () => {
    const deload = { from: '2026-09-18', to: '2026-09-24', loadFactor: 0.85, effortCap: 'ideal' as const };
    const snapshot = capturePlan(ctx([], { deload, today: '2026-09-19' }), [{ id: 'pe1', exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press', plannedSets: 3, origin: 'start' }], '2026-09-19T10:00:00.000Z');
    expect(snapshot.assessment?.intent).toEqual({ kind: 'easier', capturedAt: '2026-09-19T10:00:00.000Z', source: 'accepted_deload', effortCap: 'ideal' });
  });
});

describe('I01/I04/I05: startSession — the one live capture path', () => {
  beforeEach(() => { initStore(memory()); replaceState(seed()); });

  it('a fresh start with no accepted deload captures normal intent', () => {
    startSession(state.value.splits.find(s => s.id === PUSH_ID)!);
    expect(state.value.active!.plan!.assessment!.intent.kind).toBe('normal');
    expect(state.value.active!.plan!.assessment!.intent.effortCap).toBeNull();
  });

  it('I04: a goal/deload change AFTER start never rewrites the already-captured intent', () => {
    startSession(state.value.splits.find(s => s.id === PUSH_ID)!);
    const capturedIntent = state.value.active!.plan!.assessment!.intent;
    update(s => ({ ...s, goal: 'growth', coach: { ...s.coach, deload: { from: '2026-06-01', to: '2026-06-07', loadFactor: 0.8, effortCap: 'easy' } } }));
    expect(state.value.active!.plan!.assessment!.intent).toEqual(capturedIntent);
  });

  it('I05: pause/resume never re-captures or touches the plan/assessment at all', () => {
    startSession(state.value.splits.find(s => s.id === PUSH_ID)!);
    const before = state.value.active!.plan;
    pauseSession();
    resumeSession();
    expect(state.value.active!.plan).toBe(before);
  });
});

describe('I03/D07: old saved and resumed old sessions never acquire intent (no backfill)', () => {
  it('a session whose plan predates P04 (no assessment key at all) stays without one after normalization', () => {
    const storage = memory();
    const saved = seed();
    const oldSession: Session = { id: 's1', splitId: PUSH_ID, splitName: 'Push', day: '2026-06-01', startedAt: '2026-06-01T10:00:00.000Z', endedAt: '2026-06-01T11:00:00.000Z', durationSec: 3600, exercises: [], plan: basePlan() };
    delete (oldSession.plan as { assessment?: unknown }).assessment;
    saved.sessions = [oldSession];
    storage.setItem(STATE_KEY, JSON.stringify(saved));
    const { state: loaded } = loadState(storage);
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
    // The plan itself, and the session it sits on, are otherwise untouched.
    expect(loaded.sessions[0]!.plan?.entries).toEqual(oldSession.plan!.entries);
  });

  it('an old RESUMED active session (plan with no assessment) also acquires nothing on load', () => {
    const storage = memory();
    const saved = seed();
    const activePlan = basePlan();
    delete (activePlan as { assessment?: unknown }).assessment;
    saved.active = { splitId: PUSH_ID, startedAt: '2026-06-01T10:00:00.000Z', pausedMs: 0, entries: [{ exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press', sets: [{}, {}, {}], done: false, skipped: false, planEntryId: 'pe1' }], plan: activePlan };
    storage.setItem(STATE_KEY, JSON.stringify(saved));
    const { state: loaded } = loadState(storage);
    expect(loaded.active?.plan?.assessment).toBeUndefined();
  });
});

describe('D01/D03/D06: assessment normalization — malformed metadata drops only itself', () => {
  const withAssessment = (assessment: unknown): AppState => {
    const saved = seed();
    saved.sessions = [{ id: 's1', splitId: PUSH_ID, splitName: 'Push', day: '2026-06-01', startedAt: '2026-06-01T10:00:00.000Z', endedAt: '2026-06-01T11:00:00.000Z', durationSec: 3600, exercises: [{ exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press', sets: [{ kg: 60, reps: 8, effort: 'ideal' }], planEntryId: 'pe1' }], plan: basePlan({ assessment: assessment as WorkoutPlanSnapshot['assessment'] }) }];
    return saved;
  };

  it('D01: a valid assessment round-trips exactly', () => {
    const valid = { version: 1, intent: { kind: 'normal', capturedAt: '2026-09-19T10:00:00.000Z', source: 'session_start', effortCap: null }, changes: [], invalidatedEntryIds: [], seenWorkingRows: [] };
    const { state: loaded } = loadState(savedStorage(withAssessment(valid)));
    expect(loaded.sessions[0]!.plan?.assessment).toEqual(valid);
    // The logged set that was there stays there.
    expect(loaded.sessions[0]!.exercises[0]!.sets).toHaveLength(1);
  });

  it('D03/D06: an unknown version drops only the assessment, keeping the rest of the plan and the logged sets', () => {
    const { state: loaded } = loadState(savedStorage(withAssessment({ version: 2, intent: { kind: 'normal', capturedAt: 't', source: 'session_start', effortCap: null }, changes: [], invalidatedEntryIds: [], seenWorkingRows: [] })));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
    expect(loaded.sessions[0]!.plan?.entries).toHaveLength(1);
    expect(loaded.sessions[0]!.exercises[0]!.sets).toHaveLength(1);
  });

  it('D03: an invalid intent.kind drops only the assessment', () => {
    const { state: loaded } = loadState(savedStorage(withAssessment({ version: 1, intent: { kind: 'medium', capturedAt: 't', source: 'session_start', effortCap: null }, changes: [], invalidatedEntryIds: [], seenWorkingRows: [] })));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
  });

  it('D03: an invalid effortCap drops only the assessment', () => {
    const { state: loaded } = loadState(savedStorage(withAssessment({ version: 1, intent: { kind: 'easier', capturedAt: '2026-09-19T10:00:00.000Z', source: 'accepted_deload', effortCap: 'brutal' }, changes: [], invalidatedEntryIds: [], seenWorkingRows: [] })));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
  });

  it('D03: a non-ISO capturedAt drops only the assessment', () => {
    const { state: loaded } = loadState(savedStorage(withAssessment({ version: 1, intent: { kind: 'normal', capturedAt: 'not-a-date', source: 'session_start', effortCap: null }, changes: [], invalidatedEntryIds: [], seenWorkingRows: [] })));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
  });

  it('D06: an oversized changes array (>256) drops the whole assessment, not a truncated 256', () => {
    const changes: PlanAgreementChange[] = Array.from({ length: 257 }, (_, i) => ({ id: `c${i}`, acceptedAt: '2026-09-19T10:00:00.000Z', kind: 'add', entryId: 'pe1' }));
    const { state: loaded } = loadState(savedStorage(withAssessment({ version: 1, intent: { kind: 'normal', capturedAt: 't', source: 'session_start', effortCap: null }, changes, invalidatedEntryIds: [], seenWorkingRows: [] })));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
  });

  it('D04: a duplicate change id drops the assessment', () => {
    const changes: PlanAgreementChange[] = [
      { id: 'c1', acceptedAt: '2026-09-19T10:00:00.000Z', kind: 'remove', entryId: 'pe1' },
      { id: 'c1', acceptedAt: '2026-09-19T10:01:00.000Z', kind: 'add', entryId: 'pe2' },
    ];
    const plan = basePlan({
      entries: [...basePlan().entries, { id: 'pe2', exerciseId: 'lib_machine_chest_press', name: 'Machine Chest Press', mode: 'weighted', origin: 'added', plannedSets: 3, targetSource: 'starter', allowIncrease: false, targets: [{ kg: null, reps: null, durationSec: null }, { kg: null, reps: null, durationSec: null }, { kg: null, reps: null, durationSec: null }] }],
      assessment: { version: 1, intent: { kind: 'normal', capturedAt: 't', source: 'session_start', effortCap: null }, changes, invalidatedEntryIds: [], seenWorkingRows: [] },
    });
    const saved = seed();
    saved.sessions = [{ id: 's1', splitId: PUSH_ID, splitName: 'Push', day: '2026-06-01', startedAt: '2026-06-01T10:00:00.000Z', endedAt: '2026-06-01T11:00:00.000Z', durationSec: 3600, exercises: [], plan }];
    const { state: loaded } = loadState(savedStorage(saved));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
  });

  it('D04: a dangling entryId reference (not in plan.entries) drops the assessment', () => {
    const { state: loaded } = loadState(savedStorage(withAssessment({ version: 1, intent: { kind: 'normal', capturedAt: 't', source: 'session_start', effortCap: null }, changes: [{ id: 'c1', acceptedAt: 't', kind: 'remove', entryId: 'does-not-exist' }], invalidatedEntryIds: [], seenWorkingRows: [] })));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
  });

  it('D04: an invalidatedEntryIds reference not present in plan.entries drops the assessment', () => {
    const { state: loaded } = loadState(savedStorage(withAssessment({ version: 1, intent: { kind: 'normal', capturedAt: 't', source: 'session_start', effortCap: null }, changes: [], invalidatedEntryIds: ['ghost'], seenWorkingRows: [] })));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
  });

  it('D04: a cycle in replace edges (A→B→A) drops the assessment', () => {
    const plan = basePlan({
      entries: [
        { id: 'pe1', exerciseId: 'lib_machine_chest_press', name: 'A', mode: 'weighted', origin: 'start', plannedSets: 3, targetSource: 'starter', allowIncrease: false, targets: [] },
        { id: 'pe2', exerciseId: 'lib_machine_chest_press', name: 'B', mode: 'weighted', origin: 'replacement', replaces: 'pe1', plannedSets: 3, targetSource: 'starter', allowIncrease: false, targets: [] },
      ],
      assessment: {
        version: 1, intent: { kind: 'normal', capturedAt: 't', source: 'session_start', effortCap: null },
        changes: [
          { id: 'c1', acceptedAt: '2026-09-19T10:00:00.000Z', kind: 'replace', fromEntryId: 'pe1', toEntryId: 'pe2' },
          { id: 'c2', acceptedAt: '2026-09-19T10:01:00.000Z', kind: 'replace', fromEntryId: 'pe2', toEntryId: 'pe1' },
        ],
        invalidatedEntryIds: [], seenWorkingRows: [],
      },
    });
    const saved = seed();
    saved.sessions = [{ id: 's1', splitId: PUSH_ID, splitName: 'Push', day: '2026-06-01', startedAt: '2026-06-01T10:00:00.000Z', endedAt: '2026-06-01T11:00:00.000Z', durationSec: 3600, exercises: [], plan }];
    const { state: loaded } = loadState(savedStorage(saved));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
  });

  it('D04: double-add (the same entryId introduced twice) drops the assessment — replay rejects double introduction', () => {
    const plan = basePlan({
      entries: [...basePlan().entries, { id: 'pe2', exerciseId: 'lib_machine_chest_press', name: 'B', mode: 'weighted', origin: 'added', plannedSets: 3, targetSource: 'starter', allowIncrease: false, targets: [] }],
      assessment: {
        version: 1, intent: { kind: 'normal', capturedAt: 't', source: 'session_start', effortCap: null },
        changes: [
          { id: 'c1', acceptedAt: '2026-09-19T10:00:00.000Z', kind: 'add', entryId: 'pe2' },
          { id: 'c2', acceptedAt: '2026-09-19T10:01:00.000Z', kind: 'add', entryId: 'pe2' },
        ],
        invalidatedEntryIds: [], seenWorkingRows: [],
      },
    });
    const saved = seed();
    saved.sessions = [{ id: 's1', splitId: PUSH_ID, splitName: 'Push', day: '2026-06-01', startedAt: '2026-06-01T10:00:00.000Z', endedAt: '2026-06-01T11:00:00.000Z', durationSec: 3600, exercises: [], plan }];
    const { state: loaded } = loadState(savedStorage(saved));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
  });

  it('D04: replacing into an already-active destination drops the assessment', () => {
    const plan = basePlan({
      entries: [
        ...basePlan().entries,
        { id: 'pe2', exerciseId: 'lib_machine_chest_press', name: 'B', mode: 'weighted', origin: 'start', plannedSets: 3, targetSource: 'starter', allowIncrease: false, targets: [] },
        { id: 'pe3', exerciseId: 'lib_machine_chest_press', name: 'C', mode: 'weighted', origin: 'replacement', replaces: 'pe1', plannedSets: 3, targetSource: 'starter', allowIncrease: false, targets: [] },
      ],
      assessment: {
        version: 1, intent: { kind: 'normal', capturedAt: 't', source: 'session_start', effortCap: null },
        // pe2 is already active (origin: start); replacing pe1 into pe2 targets an already-active destination.
        changes: [{ id: 'c1', acceptedAt: '2026-09-19T10:00:00.000Z', kind: 'replace', fromEntryId: 'pe1', toEntryId: 'pe2' }],
        invalidatedEntryIds: [], seenWorkingRows: [],
      },
    });
    const saved = seed();
    saved.sessions = [{ id: 's1', splitId: PUSH_ID, splitName: 'Push', day: '2026-06-01', startedAt: '2026-06-01T10:00:00.000Z', endedAt: '2026-06-01T11:00:00.000Z', durationSec: 3600, exercises: [], plan }];
    const { state: loaded } = loadState(savedStorage(saved));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
  });

  it('D04: double-retire (removing the same entry twice) drops the assessment', () => {
    const { state: loaded } = loadState(savedStorage(withAssessment({
      version: 1, intent: { kind: 'normal', capturedAt: 't', source: 'session_start', effortCap: null },
      changes: [
        { id: 'c1', acceptedAt: '2026-09-19T10:00:00.000Z', kind: 'remove', entryId: 'pe1' },
        { id: 'c2', acceptedAt: '2026-09-19T10:01:00.000Z', kind: 'remove', entryId: 'pe1' },
      ],
      invalidatedEntryIds: [], seenWorkingRows: [],
    })));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
  });

  it('D04: a targets event after that same entry was retired drops the assessment', () => {
    const { state: loaded } = loadState(savedStorage(withAssessment({
      version: 1, intent: { kind: 'normal', capturedAt: 't', source: 'session_start', effortCap: null },
      changes: [
        { id: 'c1', acceptedAt: '2026-09-19T10:00:00.000Z', kind: 'remove', entryId: 'pe1' },
        { id: 'c2', acceptedAt: '2026-09-19T10:01:00.000Z', kind: 'targets', entryId: 'pe1', reason: 'max_below_target', targets: [{ setIndex: 0, target: { kg: 60, reps: 8, durationSec: null } }] },
      ],
      invalidatedEntryIds: [], seenWorkingRows: [],
    })));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
  });

  it('D04: a second targets event on the same entry (more than one live-adjustment) drops the assessment', () => {
    const { state: loaded } = loadState(savedStorage(withAssessment({
      version: 1, intent: { kind: 'normal', capturedAt: 't', source: 'session_start', effortCap: null },
      changes: [
        { id: 'c1', acceptedAt: '2026-09-19T10:00:00.000Z', kind: 'targets', entryId: 'pe1', reason: 'max_below_target', targets: [{ setIndex: 0, target: { kg: 60, reps: 8, durationSec: null } }] },
        { id: 'c2', acceptedAt: '2026-09-19T10:01:00.000Z', kind: 'targets', entryId: 'pe1', reason: 'easy_above_target', targets: [{ setIndex: 1, target: { kg: 55, reps: 8, durationSec: null } }] },
      ],
      invalidatedEntryIds: [], seenWorkingRows: [],
    })));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
  });

  it('a valid single targets event on a start entry is accepted', () => {
    const valid = {
      version: 1, intent: { kind: 'normal', capturedAt: '2026-09-19T10:00:00.000Z', source: 'session_start', effortCap: null },
      changes: [{ id: 'c1', acceptedAt: '2026-09-19T10:00:00.000Z', kind: 'targets' as const, entryId: 'pe1', reason: 'max_below_target' as const, targets: [{ setIndex: 0, target: { kg: 60, reps: 8, durationSec: null } }] }],
      invalidatedEntryIds: [], seenWorkingRows: [{ entryId: 'pe1', setIndices: [0, 1] }],
    };
    const { state: loaded } = loadState(savedStorage(withAssessment(valid)));
    expect(loaded.sessions[0]!.plan?.assessment).toEqual(valid);
  });

  it('D04: a seenWorkingRows entry referencing an unknown entryId drops the assessment', () => {
    const { state: loaded } = loadState(savedStorage(withAssessment({ version: 1, intent: { kind: 'normal', capturedAt: 't', source: 'session_start', effortCap: null }, changes: [], invalidatedEntryIds: [], seenWorkingRows: [{ entryId: 'ghost', setIndices: [0] }] })));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
  });

  it('D04: duplicate setIndices within one seenWorkingRows entry drops the assessment', () => {
    const { state: loaded } = loadState(savedStorage(withAssessment({ version: 1, intent: { kind: 'normal', capturedAt: 't', source: 'session_start', effortCap: null }, changes: [], invalidatedEntryIds: [], seenWorkingRows: [{ entryId: 'pe1', setIndices: [0, 0] }] })));
    expect(loaded.sessions[0]!.plan?.assessment).toBeUndefined();
  });
});
