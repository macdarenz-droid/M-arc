import type { AskThreadTurn, CoachState, DismissalEvidence, ReopenReason, Session, Split, Weekday } from '@/core/models';
import { WEEKDAYS } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { daysBetween } from '@/core/dates';
import { GOAL_BY_ID, type GoalId } from '@/data/goals';
import { isWorkingSet } from '@/brain/exposure';
import type { Confidence, FindingsReport, Proposal } from './contract';

export type { DismissalEvidence, ReopenReason } from '@/core/models';

export interface PendingCoachItem {
  key: string;
  turnIndex: number;
  turnFingerprint: string;
  kind: 'split' | 'schedule' | 'goal';
  itemIndex: number;
  title: string;
  actionable: boolean;
}

const canonical = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      const entry = (value as Record<string, unknown>)[key];
      if (entry !== undefined) out[key] = canonical(entry);
    }
    return out;
  }
  return value;
};

const fingerprint = (value: unknown): string => JSON.stringify(canonical(value));
const proposalFingerprint = (proposal: Proposal): string => fingerprint([proposal.kind, proposal.subject, proposal.apply]);
const sessionFingerprint = (session: Session): string => fingerprint([session.day, session.splitId, session.exercises]);
const hasWork = (session: Session): boolean => session.exercises.some(exercise => exercise.sets.some(isWorkingSet));
const validDay = (day: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(day)
  && !Number.isNaN(Date.parse(`${day}T00:00:00Z`)) && new Date(`${day}T00:00:00Z`).toISOString().slice(0, 10) === day;
const CONFIDENCE_RANK: Record<Confidence, number> = { low: 0, medium: 1, high: 2 };

export function dismissalEvidence(proposal: Proposal, report: FindingsReport, sessions: Session[], today: string): DismissalEvidence {
  const sessionById = new Map<string, Session>();
  for (const session of sessions) if (!sessionById.has(session.id)) sessionById.set(session.id, session);
  const support = new Set(proposal.basedOn);
  const findings: DismissalEvidence['findings'] = [];
  for (const finding of report.findings.filter(item => support.has(item.id)).sort((a, b) => a.id.localeCompare(b.id))) {
    const ids = [...new Set(finding.evidence.sessionIds)];
    if (ids.length > 64) return { day: today, proposalFingerprint: proposalFingerprint(proposal), reopenedOnce: false, findings: [] };
    const cited = ids.map(id => sessionById.get(id)).filter((session): session is Session => !!session)
      .sort((a, b) => a.day.localeCompare(b.day) || a.id.localeCompare(b.id));
    if (cited.length !== ids.length) return { day: today, proposalFingerprint: proposalFingerprint(proposal), reopenedOnce: false, findings: [] };
    findings.push({
      id: finding.id,
      kind: finding.kind,
      severity: finding.severity,
      confidence: finding.confidence,
      sessionIds: cited.map(session => session.id),
      sessionFingerprints: cited.map(sessionFingerprint),
    });
  }
  return { day: today, proposalFingerprint: proposalFingerprint(proposal), reopenedOnce: false, findings };
}

export function reopenReason(
  proposal: Proposal,
  report: Pick<FindingsReport, 'findings'>,
  previous: DismissalEvidence | undefined,
  sessions: Session[],
  today: string,
): ReopenReason | null {
  if (!previous || previous.reopenedOnce || !previous.findings.length || previous.day > today) return null;
  const elapsedDays = daysBetween(previous.day, today);
  if (elapsedDays < 21 || (proposal.expiresOn && today > proposal.expiresOn) || previous.proposalFingerprint !== proposalFingerprint(proposal)) return null;
  const sessionById = new Map<string, Session>();
  for (const session of sessions) {
    if (sessionById.has(session.id)) return null;
    sessionById.set(session.id, session);
  }
  for (const prior of previous.findings) {
    if (prior.sessionIds.length !== prior.sessionFingerprints.length) return null;
    for (let index = 0; index < prior.sessionIds.length; index++) {
      const session = sessionById.get(prior.sessionIds[index]!);
      if (!session || sessionFingerprint(session) !== prior.sessionFingerprints[index]) return null;
    }
  }

  const candidates: Array<{ reason: ReopenReason; strength: number }> = [];
  for (const prior of previous.findings) {
    const current = report.findings.find(finding => finding.id === prior.id && finding.kind === prior.kind && proposal.basedOn.includes(finding.id));
    if (!current) continue;
    const oldIds = new Set(prior.sessionIds);
    const newIds = [...new Set(current.evidence.sessionIds)].filter(id => {
      if (oldIds.has(id)) return false;
      const session = sessionById.get(id);
      return !!session && validDay(session.day) && hasWork(session) && session.day > previous.day && session.day <= today;
    });
    if (newIds.length < 2) continue;
    const severityDelta = current.severity - prior.severity;
    const confidenceDelta = CONFIDENCE_RANK[current.confidence] - CONFIDENCE_RANK[prior.confidence];
    if (!(severityDelta >= 1 || (severityDelta >= 0 && confidenceDelta >= 1))) continue;
    candidates.push({
      strength: severityDelta * 3 + confidenceDelta,
      reason: {
        dismissedOn: previous.day,
        elapsedDays,
        newSessions: newIds.length,
        findingId: current.id,
        previousSeverity: prior.severity,
        currentSeverity: current.severity,
        previousConfidence: prior.confidence,
        currentConfidence: current.confidence,
      },
    });
  }
  return candidates.sort((a, b) => b.strength - a.strength || b.reason.newSessions - a.reason.newSessions || a.reason.findingId.localeCompare(b.reason.findingId))[0]?.reason ?? null;
}

export function askTurnFingerprint(turn: AskThreadTurn): string {
  const { applied: _applied, draftDismissed: _draftDismissed, scheduleApplied: _scheduleApplied, scheduleDismissed: _scheduleDismissed,
    actionPrev: _actionPrev, actionDismissed: _actionDismissed, ...immutable } = turn;
  return fingerprint(immutable);
}

const sameSchedule = (a: Record<Weekday, string | null>, b: Record<Weekday, string | null>): boolean => WEEKDAYS.every(day => a[day] === b[day]);

export function pendingCoachItems(
  coach: CoachState,
  splits: Split[],
  schedule: Record<Weekday, string | null>,
  goal: GoalId,
  maxSplits: number,
): PendingCoachItem[] {
  const out: PendingCoachItem[] = [];
  const splitIds = new Set(splits.map(split => split.id));
  for (let turnIndex = coach.askThread.length - 1; turnIndex >= 0; turnIndex--) {
    const turn = coach.askThread[turnIndex]!;
    if (turn.role !== 'assistant') continue;
    const turnFingerprint = askTurnFingerprint(turn);
    const add = (kind: PendingCoachItem['kind'], itemIndex: number, title: string, actionable: boolean) => out.push({
      key: JSON.stringify([turnIndex, turnFingerprint, kind, itemIndex]), turnIndex, turnFingerprint, kind, itemIndex, title, actionable,
    });
    for (const [itemIndex, draft] of (turn.drafts ?? []).entries()) {
      if (turn.applied?.[itemIndex] || turn.draftDismissed?.[itemIndex]) continue;
      const exercisesValid = draft.exercises.length > 0 && draft.exercises.every(entry => !!findExercise(entry.exerciseId) && Number.isInteger(entry.sets) && entry.sets >= 1 && entry.sets <= 6);
      const targetValid = draft.action === 'modify' ? !!draft.splitId && splitIds.has(draft.splitId) : draft.action === 'create' && !draft.splitId && splits.length < maxSplits;
      add('split', itemIndex, `Split draft: ${draft.name}`, exercisesValid && targetValid);
    }
    if (turn.scheduleDraft && !turn.scheduleApplied && !turn.scheduleDismissed && !sameSchedule(turn.scheduleDraft, schedule)) {
      add('schedule', 0, 'Schedule draft', WEEKDAYS.every(day => turn.scheduleDraft![day] === null || splitIds.has(turn.scheduleDraft![day]!)));
    }
    for (const [itemIndex, action] of (turn.actions ?? []).entries()) {
      if (turn.actionPrev?.[itemIndex] != null || turn.actionDismissed?.[itemIndex] || action.kind !== 'goal_change' || action.goal === goal) continue;
      add('goal', itemIndex, `Goal: ${GOAL_BY_ID[action.goal].name}`, !!GOAL_BY_ID[action.goal]);
    }
  }
  return out;
}
