import { describe, it, expect } from 'vitest';
import { askTurnFingerprint, pendingCoachItems } from '@/brain/coach/askDrafts';
import { emptyCoach, emptySchedule, type AskThreadTurn, type Split } from '@/core/models';

const push: Split = { id: 'split_push', name: 'Push', color: '#fff', createdAt: '2026-01-01T00:00:00Z', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] };
const reply = (over: Partial<AskThreadTurn>): AskThreadTurn => ({ role: 'assistant', text: 'Here you go.', ...over });
const coachWith = (...turns: AskThreadTurn[]) => ({ ...emptyCoach(), askThread: [{ role: 'user' as const, text: 'q' }, ...turns] });

describe('pendingCoachItems', () => {
  it('lists an unapplied split, schedule and goal draft, newest first', () => {
    const coach = coachWith(
      reply({ drafts: [{ action: 'create', splitId: null, name: 'Arms', focus: ['biceps'], exercises: [{ exerciseId: 'lib_barbell_curl', sets: 3 }] }] }),
      reply({ scheduleDraft: { ...emptySchedule(), mon: 'split_push' }, actions: [{ kind: 'goal_change', goal: 'strength' }] }),
    );
    const items = pendingCoachItems(coach, [push], emptySchedule(), 'growth', 7);
    expect(items.map(i => [i.kind, i.turnIndex, i.actionable])).toEqual([['schedule', 2, true], ['goal', 2, true], ['split', 1, true]]);
  });

  it('marks a draft unactionable when its split is gone or the cap is reached', () => {
    const coach = coachWith(
      reply({ drafts: [{ action: 'modify', splitId: 'split_gone', name: 'Old', focus: [], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] }] }),
      reply({ drafts: [{ action: 'create', splitId: null, name: 'New', focus: [], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] }] }),
    );
    const items = pendingCoachItems(coach, [push], emptySchedule(), 'growth', 1);
    expect(items.every(i => !i.actionable)).toBe(true);
  });

  it('drops applied, dismissed, already-current and same-goal items', () => {
    const coach = coachWith(reply({
      drafts: [{ action: 'create', splitId: null, name: 'Arms', focus: [], exercises: [{ exerciseId: 'lib_barbell_curl', sets: 3 }] }], applied: [true],
      scheduleDraft: emptySchedule(), actions: [{ kind: 'goal_change', goal: 'growth' }],
    }));
    expect(pendingCoachItems(coach, [push], emptySchedule(), 'growth', 7)).toEqual([]);
  });

  it('a fingerprint ignores applied/dismissed flags but changes with content', () => {
    const base = reply({ drafts: [{ action: 'create', splitId: null, name: 'Arms', focus: [], exercises: [{ exerciseId: 'lib_barbell_curl', sets: 3 }] }] });
    expect(askTurnFingerprint({ ...base, applied: [true] })).toBe(askTurnFingerprint(base));
    expect(askTurnFingerprint({ ...base, text: 'Other' })).not.toBe(askTurnFingerprint(base));
  });
});
