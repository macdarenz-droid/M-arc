import type { CoachTone } from '@/core/models';
import type { PlanFitResult } from '@/brain/planFit';

export interface PlanFitCopy {
  headline: string;
  summary: string;
  details: string[];
}

/** Steady/Direct changes delivery only; facts and decisions come from the same result. */
export function planFitCopy(result: PlanFitResult, tone: CoachTone): PlanFitCopy {
  const direct = tone === 'direct';
  let summary: string;
  switch (result.label) {
    case 'Followed the plan':
      summary = direct ? 'You completed the assessable saved work.' : 'The assessable work matched the plan saved at the start.';
      break;
    case 'Followed the adjusted plan':
      summary = direct ? 'You completed the accepted version of the plan.' : 'The work matched the changes you accepted during the session.';
      break;
    case 'Harder than planned':
      summary = direct ? 'A recorded effort rating went above the saved cap.' : 'At least one confidently linked effort rating was above the cap saved for this session.';
      break;
    case 'Less work than planned':
      summary = direct ? 'Some saved work was missing or below its target.' : 'The comparable evidence shows at least one saved row was not logged or finished below its target.';
      break;
    default:
      summary = direct ? 'The saved evidence is not complete enough to call plan fit.' : 'There is not enough linked evidence to describe this session’s plan fit confidently.';
  }

  const details: string[] = [];
  if (result.capBreaches.length) details.push(`${result.capBreaches.length} recorded effort ${result.capBreaches.length === 1 ? 'rating was' : 'ratings were'} above the saved cap.`);
  if (result.reasons.includes('incomplete_coverage')) details.push('Some other rows could not be assessed, so coverage is incomplete.');
  if (result.reasons.includes('required_effort')) details.push('A saved effort cap applies, but at least one linked working row has no valid effort rating.');
  if (result.reasons.includes('different_load')) details.push('At least one logged load differs from its saved target, so reps alone are not comparable.');
  if (result.reasons.includes('starter_target') || result.reasons.includes('unavailable_target')) details.push('At least one target was a starter estimate or unavailable, not a history-backed obligation.');
  if (result.reasons.includes('unsupported_mode')) details.push('At least one exercise mode is not supported by plan-fit comparison yet.');
  if (result.reasons.includes('invalid_mapping') || result.reasons.includes('invalidated_entry') || result.reasons.includes('projection_mismatch')) details.push('At least one row lost reliable identity or agreement evidence after editing.');
  if (result.reasons.includes('unadopted_extra')) details.push('Extra logged work had no explicitly accepted target, so it is shown without being graded.');
  if (result.notLoggedRows) details.push(`${result.notLoggedRows} saved ${result.notLoggedRows === 1 ? 'row is' : 'rows are'} not linked to logged work. “Not logged” describes this app’s record; it does not prove no exercise occurred.`);
  if (result.belowTargetRows) details.push(`${result.belowTargetRows} comparable ${result.belowTargetRows === 1 ? 'row was' : 'rows were'} below its saved target.`);
  if (result.reasons.includes('empty_plan')) details.push('No expected or logged work remains to assess.');
  if (result.reasons.includes('no_assessment') || result.reasons.includes('invalid_agreement')) details.push('This session has no valid captured assessment; its ordinary workout log is still available.');
  if (!details.length && result.label === 'Followed the plan' && !result.capBreaches.length) details.push('No effort ceiling was inferred for a normal session.');
  return { headline: result.label, summary, details };
}
