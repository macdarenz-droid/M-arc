import { describe, expect, it } from 'vitest';
import { planSkips, usageProfile } from '@/brain/coach/planners';
import { reportNumbers, type Finding, type FindingsReport } from '@/brain/coach/contract';
import { renderFinding, renderProposal } from '@/brain/coach/words';
import { ctx, LEGS_ID } from './coach-helpers';

const finding = (basis: 'saved_plan' | 'current_template' = 'saved_plan'): Finding => ({
  id: 'chronic_skip:split_legs:lib_standing_calf_raise',
  kind: 'chronic_skip',
  subject: { splitId: LEGS_ID, splitName: 'Legs', exerciseId: 'lib_standing_calf_raise', exerciseName: 'Standing Calf Raise' },
  metrics: { sessions: 5, missingSessions: 4, presentSessions: 1, basis, exerciseName: 'Standing Calf Raise', splitName: 'Legs' },
  window: { from: '2026-08-20', to: '2026-09-18', sessions: 5 },
  confidence: basis === 'saved_plan' ? 'medium' : 'low',
  severity: 1,
  evidence: { sessionIds: ['1', '2', '3', '4', '5'], days: [] },
  principles: ['habit_formation_and_cues', 'exercise_variation'],
});

describe('chronic skip planner', () => {
  it('offers explicit split-scoped cut and swap alternatives for confirmed evidence', () => {
    const c = ctx([]);
    const proposals = planSkips(c, [finding()], usageProfile([], [], c.today), 1);
    expect(proposals.map(p => p.apply)).toEqual([
      { kind: 'split_modify', splitId: LEGS_ID, add: [], remove: ['lib_standing_calf_raise'], setChanges: [] },
      { kind: 'exercise_swap', splitId: LEGS_ID, fromExerciseId: 'lib_standing_calf_raise', toExerciseId: expect.any(String) },
    ]);
    expect(proposals.every(p => p.basedOn[0] === finding().id && p.expiresOn === '2026-09-26')).toBe(true);
  });

  it('keeps legacy evidence informational and honours the shared swap budget', () => {
    const c = ctx([]);
    expect(planSkips(c, [finding('current_template')], usageProfile([], [], c.today), 1)).toEqual([]);
    expect(planSkips(c, [finding()], usageProfile([], [], c.today), 0).map(p => p.kind)).toEqual(['split_modify']);
  });

  it('does not offer a cut when the exercise is the whole split', () => {
    const c = ctx([], { splits: [{ id: LEGS_ID, name: 'Legs', color: '#000', focus: [], createdAt: '2026-01-01T00:00:00.000Z', exercises: [{ exerciseId: 'lib_standing_calf_raise', sets: 3 }] }] });
    expect(planSkips(c, [finding()], usageProfile([], [], c.today), 0)).toEqual([]);
  });

  it('drops both alternatives after the source split no longer contains the exercise', () => {
    const c = ctx([]);
    c.splits.find(split => split.id === LEGS_ID)!.exercises = c.splits.find(split => split.id === LEGS_ID)!.exercises.filter(slot => slot.exerciseId !== 'lib_standing_calf_raise');
    expect(planSkips(c, [finding()], usageProfile([], [], c.today), 1)).toEqual([]);
  });

  it('labels confirmed and legacy copy without claiming plateau, duplication or cause', () => {
    const c = ctx([]);
    const render = { unit: 'kg' as const, splits: c.splits, custom: c.custom, today: c.today, goal: c.goal };
    const confirmed = renderFinding(finding(), render);
    const legacy = renderFinding(finding('current_template'), render);
    expect(confirmed.noticed).toBe('Standing Calf Raise was in the saved plan but had no work logged in 4 of 5 Legs sessions.');
    expect(confirmed.reviewInTrain).toBeUndefined();
    expect(legacy.noticed).toContain('Older plans were not saved.');
    expect(legacy.reviewInTrain).toBe(true);
    const proposals = planSkips(c, [finding()], usageProfile([], [], c.today), 1);
    const report: FindingsReport = { version: 1, generatedAt: new Date(c.now).toISOString(), today: c.today, dataQuality: { sessions: 5, weeksOfData: 5, effortCoverage: 1, insufficientData: false }, findings: [finding()], proposals };
    for (const item of proposals) {
      const copy = renderProposal(item, report, render);
      expect(copy.summary).not.toMatch(/stalled|duplicates/i);
      expect(copy.summary).toContain('Keep the work realistic');
    }
    expect(reportNumbers(report).has(4)).toBe(true);
    expect(reportNumbers(report).has(5)).toBe(true);
  });
});
