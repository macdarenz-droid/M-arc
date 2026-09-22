import { describe, expect, it } from 'vitest';
import { planFitCopy } from '@/brain/coach/planFitWords';
import type { PlanFitReason, PlanFitResult } from '@/brain/planFit';

function result(label: PlanFitResult['label'], reasons: PlanFitReason[] = [], patch: Partial<PlanFitResult> = {}): PlanFitResult {
  return {
    label,
    rows: [],
    reasons,
    expectedRows: 2,
    loggedRows: 2,
    comparableRows: 2,
    metRows: 2,
    notLoggedRows: 0,
    belowTargetRows: 0,
    capBreaches: [],
    effectiveChange: false,
    coverageIncomplete: false,
    ...patch,
  };
}

describe('purpose-aware plan-fit wording', () => {
  it('tone changes delivery, never the label or factual details', () => {
    const fit = result('Harder than planned', ['incomplete_coverage', 'required_effort'], {
      comparableRows: 1,
      metRows: 1,
      capBreaches: [{ entryId: 'a', setIndex: 0, effort: 'max', cap: 'ideal' }],
      coverageIncomplete: true,
    });
    const steady = planFitCopy(fit, 'steady');
    const direct = planFitCopy(fit, 'direct');
    expect(steady.headline).toBe('Harder than planned');
    expect(direct.headline).toBe(steady.headline);
    expect(direct.summary).not.toBe(steady.summary);
    expect(direct.details).toEqual(steady.details);
    expect(steady.details).toEqual([
      '1 recorded effort rating was above the saved cap.',
      'Some other rows could not be assessed, so coverage is incomplete.',
      'A saved effort cap applies, but at least one linked working row has no valid effort rating.',
    ]);
  });

  it('states that normal sessions have no inferred effort ceiling', () => {
    expect(planFitCopy(result('Followed the plan'), 'steady').details).toContain('No effort ceiling was inferred for a normal session.');
  });

  it('explains uncertainty without turning it into failure', () => {
    const copy = planFitCopy(result('Not enough information', ['starter_target', 'different_load', 'invalidated_entry', 'unadopted_extra']), 'steady');
    expect(copy.details).toEqual([
      'At least one logged load differs from its saved target, so reps alone are not comparable.',
      'At least one target was a starter estimate or unavailable, not a history-backed obligation.',
      'At least one row lost reliable identity or agreement evidence after editing.',
      'Extra logged work had no explicitly accepted target, so it is shown without being graded.',
    ]);
  });

  it('keeps the careful not-logged qualification', () => {
    const copy = planFitCopy(result('Less work than planned', ['not_logged'], { loggedRows: 0, comparableRows: 0, metRows: 0, notLoggedRows: 2 }), 'direct');
    expect(copy.details).toContain('2 saved rows are not linked to logged work. “Not logged” describes this app’s record; it does not prove no exercise occurred.');
  });
});
