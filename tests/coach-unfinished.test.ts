import { describe, expect, it } from 'vitest';
import type { AskThreadTurn, Session } from '@/core/models';
import { emptyCoach, emptySchedule } from '@/core/models';
import type { Finding, FindingsReport, Proposal } from '@/brain/coach/contract';
import { askTurnFingerprint, dismissalEvidence, pendingCoachItems, reopenReason } from '@/brain/coach/reopen';
import { addDays } from '@/core/dates';
import { pplSplits, PUSH_ID } from './coach-helpers';
import { session, sets } from './helpers';

const DAY = '2026-08-01';
const proposal = (over: Partial<Proposal> = {}): Proposal => ({ id: 'split_modify:push', kind: 'split_modify', subject: { splitId: PUSH_ID },
  apply: { kind: 'split_modify', splitId: PUSH_ID, add: [], remove: ['lib_triceps_pushdown'], setChanges: [] }, basedOn: ['chronic_skip:push:triceps'], principles: [], confidence: 'medium', dismissKey: 'split_modify:push', ...over });
const finding = (ids: string[], severity: Finding['severity'] = 1, confidence: Finding['confidence'] = 'low'): Finding => ({
  id: 'chronic_skip:push:triceps', kind: 'chronic_skip', subject: { splitId: PUSH_ID }, metrics: {}, window: { from: DAY, to: DAY }, confidence, severity,
  evidence: { sessionIds: ids, days: [] }, principles: [],
});
const workout = (day: string, id: string, kg = 40): Session => ({ ...session(day, [{ id: 'lib_barbell_bench_press', sets: sets(kg, 8) }]), id });
const report = (f: Finding): FindingsReport => ({ version: 1, generatedAt: `${DAY}T12:00:00.000Z`, today: DAY,
  dataQuality: { sessions: 3, weeksOfData: 3, effortCoverage: 1, insufficientData: false }, findings: [f], proposals: [] });

describe('dismissal evidence and reopening', () => {
  const old = [workout('2026-07-20', 'old-1'), workout('2026-07-27', 'old-2')];

  it('reopens the same action after 21 days only with two new working sessions and stronger severity', () => {
    const p = proposal();
    const snapshot = dismissalEvidence(p, report(finding(old.map(s => s.id))), old, DAY);
    expect(snapshot.findings[0]!.sessionIds).toEqual(['old-1', 'old-2']);
    const newer = [workout('2026-08-08', 'new-1'), workout('2026-08-18', 'new-2')];
    const current = finding([...old, ...newer].map(s => s.id), 2, 'medium');
    expect(reopenReason(p, { findings: [current] }, snapshot, [...old, ...newer], addDays(DAY, 21))).toMatchObject({
      elapsedDays: 21, newSessions: 2, previousSeverity: 1, currentSeverity: 2, previousConfidence: 'low', currentConfidence: 'medium',
    });
  });

  it('fingerprints the canonical action while excluding identity confidence and expiry metadata', () => {
    const original = proposal();
    const reordered = proposal({
      id: 'another-id', confidence: 'high', expiresOn: '2027-01-01',
      subject: { splitId: PUSH_ID },
      apply: { setChanges: [], remove: ['lib_triceps_pushdown'], add: [], splitId: PUSH_ID, kind: 'split_modify' },
    });
    expect(dismissalEvidence(reordered, report(finding(old.map(s => s.id))), old, DAY).proposalFingerprint)
      .toBe(dismissalEvidence(original, report(finding(old.map(s => s.id))), old, DAY).proposalFingerprint);
  });

  it('does not reopen for twenty days, time alone, one new session or a weaker finding', () => {
    const p = proposal();
    const snapshot = dismissalEvidence(p, report(finding(old.map(s => s.id))), old, DAY);
    const newer = [workout('2026-08-08', 'new-1'), workout('2026-08-18', 'new-2')];
    const strong = finding([...old, ...newer].map(s => s.id), 2, 'medium');
    expect(reopenReason(p, { findings: [strong] }, snapshot, [...old, ...newer], addDays(DAY, 20))).toBeNull();
    expect(reopenReason(p, { findings: [finding(old.map(s => s.id), 2)] }, snapshot, old, addDays(DAY, 21))).toBeNull();
    expect(reopenReason(p, { findings: [finding([...old, newer[0]!].map(s => s.id), 2)] }, snapshot, [...old, newer[0]!], addDays(DAY, 21))).toBeNull();
    expect(reopenReason(p, { findings: [finding([...old, ...newer].map(s => s.id), 0, 'high')] }, snapshot, [...old, ...newer], addDays(DAY, 21))).toBeNull();
    const malformed = [workout('2026-02-30', 'bad-1'), workout('not-a-day', 'bad-2')];
    expect(reopenReason(p, { findings: [finding([...old, ...malformed].map(s => s.id), 2)] }, snapshot, [...old, ...malformed], addDays(DAY, 21))).toBeNull();
  });

  it('allows a confidence increase only with new evidence and nondecreasing severity', () => {
    const p = proposal();
    const snapshot = dismissalEvidence(p, report(finding(old.map(s => s.id), 1, 'low')), old, DAY);
    const newer = [workout('2026-08-08', 'new-1'), workout('2026-08-18', 'new-2')];
    expect(reopenReason(p, { findings: [finding([...old, ...newer].map(s => s.id), 1, 'medium')] }, snapshot, [...old, ...newer], addDays(DAY, 21))).toMatchObject({ currentConfidence: 'medium', currentSeverity: 1 });
  });

  it('invalidates edited, deleted or duplicate supporting history', () => {
    const p = proposal();
    const snapshot = dismissalEvidence(p, report(finding(old.map(s => s.id))), old, DAY);
    const newer = [workout('2026-08-08', 'new-1'), workout('2026-08-18', 'new-2')];
    const current = finding([...old, ...newer].map(s => s.id), 2);
    expect(reopenReason(p, { findings: [current] }, snapshot, [old[0]!, ...newer], addDays(DAY, 21))).toBeNull();
    expect(reopenReason(p, { findings: [current] }, snapshot, [{ ...old[0]!, splitId: 'changed' }, old[1]!, ...newer], addDays(DAY, 21))).toBeNull();
    expect(reopenReason(p, { findings: [current] }, snapshot, [...old, { ...newer[0]!, id: old[0]!.id }, newer[1]!], addDays(DAY, 21))).toBeNull();
  });

  it('rejects a changed action, expired proposal, future snapshot or consumed reappearance', () => {
    const p = proposal();
    const snapshot = dismissalEvidence(p, report(finding(old.map(s => s.id))), old, DAY);
    const newer = [workout('2026-08-08', 'new-1'), workout('2026-08-18', 'new-2')];
    const current = finding([...old, ...newer].map(s => s.id), 2);
    expect(reopenReason(proposal({ apply: { kind: 'split_modify', splitId: PUSH_ID, add: [], remove: ['lib_incline_dumbbell_press'], setChanges: [] } }), { findings: [current] }, snapshot, [...old, ...newer], addDays(DAY, 21))).toBeNull();
    expect(reopenReason(proposal({ expiresOn: addDays(DAY, 20) }), { findings: [current] }, snapshot, [...old, ...newer], addDays(DAY, 21))).toBeNull();
    expect(reopenReason(p, { findings: [current] }, { ...snapshot, day: addDays(DAY, 22) }, [...old, ...newer], addDays(DAY, 21))).toBeNull();
    expect(reopenReason(p, { findings: [current] }, { ...snapshot, reopenedOnce: true }, [...old, ...newer], addDays(DAY, 21))).toBeNull();
  });

  it('uses a conservative empty snapshot when supporting evidence exceeds its cap', () => {
    const sessions = Array.from({ length: 65 }, (_, i) => workout(addDays('2026-05-01', i), `s${i}`));
    expect(dismissalEvidence(proposal(), report(finding(sessions.map(s => s.id))), sessions, DAY).findings).toEqual([]);
  });
});

describe('pendingCoachItems', () => {
  const splitDraft = { action: 'create' as const, splitId: null, name: 'Upper', focus: ['chest' as const], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] };
  const assistant = (over: Partial<AskThreadTurn> = {}): AskThreadTurn => ({ role: 'assistant', text: 'Saved ideas', drafts: [splitDraft], applied: [false],
    scheduleDraft: { ...emptySchedule(), mon: PUSH_ID }, scheduleApplied: false, actions: [{ kind: 'goal_change', goal: 'strength' }], actionPrev: [null], ...over });

  it('lists newest assistant items in split schedule goal order with stable keys', () => {
    const coach = { ...emptyCoach(), askThread: [{ role: 'user' as const, text: 'help' }, assistant({ text: 'Older' }), assistant({ text: 'Newer' })] };
    const items = pendingCoachItems(coach, pplSplits(), emptySchedule(), 'lean', 7);
    expect(items.map(item => item.title)).toEqual(['Split draft: Upper', 'Schedule draft', 'Goal: Strength focus', 'Split draft: Upper', 'Schedule draft', 'Goal: Strength focus']);
    expect(items.slice(0, 3).every(item => item.turnIndex === 2)).toBe(true);
    expect(JSON.parse(items[0]!.key)).toEqual([2, items[0]!.turnFingerprint, 'split', 0]);
  });

  it('omits applied dismissed and already-satisfied items using actionPrev for goals', () => {
    const schedule = { ...emptySchedule(), mon: PUSH_ID };
    const done = assistant({ applied: [true], draftDismissed: [true], scheduleDraft: schedule, scheduleApplied: false, actions: [{ kind: 'goal_change', goal: 'strength' }], actionPrev: ['lean'] });
    expect(pendingCoachItems({ ...emptyCoach(), askThread: [done] }, pplSplits(), schedule, 'lean', 7)).toEqual([]);
    const dismissed = assistant({ draftDismissed: [true], scheduleDismissed: true, actionDismissed: [true] });
    expect(pendingCoachItems({ ...emptyCoach(), askThread: [dismissed] }, pplSplits(), emptySchedule(), 'lean', 7)).toEqual([]);
  });

  it('keeps changed references visible but unavailable and never turns a deleted update into a create', () => {
    const missing = { ...splitDraft, action: 'modify' as const, splitId: 'deleted' };
    const unknown = { ...splitDraft, name: 'Unknown exercise', exercises: [{ exerciseId: 'gone', sets: 3 }] };
    const turn = assistant({ drafts: [missing, unknown], applied: [false, false], scheduleDraft: { ...emptySchedule(), tue: 'deleted' }, actions: [] });
    const items = pendingCoachItems({ ...emptyCoach(), askThread: [turn] }, pplSplits(), emptySchedule(), 'lean', 7);
    expect(items).toHaveLength(3);
    expect(items.every(item => item.actionable === false)).toBe(true);
  });

  it('marks a create unavailable at the split cap', () => {
    const items = pendingCoachItems({ ...emptyCoach(), askThread: [assistant({ scheduleDraft: null, actions: [] })] }, pplSplits(), emptySchedule(), 'lean', pplSplits().length);
    expect(items).toMatchObject([{ kind: 'split', actionable: false }]);
  });

  it('fingerprints immutable content while ignoring lifecycle flags', () => {
    const turn = assistant();
    expect(askTurnFingerprint({ ...turn, applied: [true], draftDismissed: [true], scheduleApplied: true, scheduleDismissed: true, actionPrev: ['lean'], actionDismissed: [true] })).toBe(askTurnFingerprint(turn));
    expect(askTurnFingerprint({ ...turn, text: 'Changed' })).not.toBe(askTurnFingerprint(turn));
  });
});
