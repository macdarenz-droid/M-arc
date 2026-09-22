import type { CoachTone, Exercise, Session } from '@/core/models';
import { assessPlanFit, type PlanFitResult } from '@/brain/planFit';
import { recordsForSession, type PersonalRecord } from '@/brain/prs';
import { planFitCopy, type PlanFitCopy } from './planFitWords';

export interface SessionFeedback {
  sessionId: string;
  day: string;
  splitName: string;
  fit: PlanFitResult;
  achievements: PersonalRecord[];
  copy: PlanFitCopy;
}

/** Selects today's latest completed workout; all interpretation stays local and deterministic. */
export function selectSessionFeedback(sessions: Session[], day: string, custom: Exercise[], tone: CoachTone): SessionFeedback | null {
  const session = sessions
    .filter(candidate => candidate.day === day)
    .sort((left, right) => right.startedAt.localeCompare(left.startedAt) || right.id.localeCompare(left.id))[0];
  if (!session) return null;
  const fit = assessPlanFit(session);
  return {
    sessionId: session.id,
    day: session.day,
    splitName: session.splitName,
    fit,
    achievements: recordsForSession(session, sessions, custom),
    copy: planFitCopy(fit, tone),
  };
}
