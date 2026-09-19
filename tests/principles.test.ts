import { describe, it, expect } from 'vitest';
import { PRINCIPLES, PRINCIPLE_BY_ID, PRINCIPLES_VERSION, principlesFor } from '@/brain/coach/principles';
import { FINDING_KINDS, PROPOSAL_KINDS, PRINCIPLES_BY_FINDING, PRINCIPLES_BY_PROPOSAL, dismissKey, emptyReport, reportNumbers } from '@/brain/coach/contract';

const RATINGS = ['strong', 'moderate', 'contested', 'coaching_consensus'];

describe('principle cards', () => {
  it('has a version and unique ids', () => {
    expect(PRINCIPLES_VERSION).toBeGreaterThanOrEqual(1);
    const ids = PRINCIPLES.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(15);
  });

  it('every card is complete and honestly rated', () => {
    for (const c of PRINCIPLES) {
      expect(c.title.length, c.id).toBeGreaterThan(5);
      expect(c.statement.length, c.id).toBeGreaterThan(40);
      expect(c.disputed.length, c.id).toBeGreaterThan(10);
      expect(c.appUse.length, c.id).toBeGreaterThan(10);
      expect(RATINGS, c.id).toContain(c.rating);
      expect(c.citations.length, c.id).toBeGreaterThan(0);
      for (const ref of c.citations) {
        expect(ref.authors.length, `${c.id}/${ref.key}`).toBeGreaterThan(3);
        expect(ref.title.length, `${c.id}/${ref.key}`).toBeGreaterThan(10);
        expect(ref.journal.length, `${c.id}/${ref.key}`).toBeGreaterThan(2);
        expect(ref.year, `${c.id}/${ref.key}`).toBeGreaterThanOrEqual(1980);
        expect(ref.year, `${c.id}/${ref.key}`).toBeLessThanOrEqual(2026);
        expect(['search-index', 'full-text']).toContain(ref.verified);
      }
    }
  });

  it('cards reference only real finding and proposal kinds', () => {
    for (const c of PRINCIPLES) {
      for (const k of c.findingKinds) expect(FINDING_KINDS as readonly string[], `${c.id} → ${k}`).toContain(k);
      for (const k of c.proposalKinds) expect(PROPOSAL_KINDS as readonly string[], `${c.id} → ${k}`).toContain(k);
    }
  });

  it('every kind cites at least one existing card, and the card lists the kind back', () => {
    for (const kind of FINDING_KINDS) {
      const ids = PRINCIPLES_BY_FINDING[kind];
      expect(ids.length, kind).toBeGreaterThan(0);
      for (const id of ids) {
        const card = PRINCIPLE_BY_ID.get(id);
        expect(card, `${kind} → ${id}`).toBeDefined();
        expect(card!.findingKinds, `${id} should list ${kind}`).toContain(kind);
      }
    }
    for (const kind of PROPOSAL_KINDS) {
      const ids = PRINCIPLES_BY_PROPOSAL[kind];
      expect(ids.length, kind).toBeGreaterThan(0);
      for (const id of ids) {
        const card = PRINCIPLE_BY_ID.get(id);
        expect(card, `${kind} → ${id}`).toBeDefined();
        expect(card!.proposalKinds, `${id} should list ${kind}`).toContain(kind);
      }
    }
  });

  it('principlesFor keeps order, drops unknowns and duplicates', () => {
    const cards = principlesFor(['recovery_time_course', 'nope', 'volume_dose_response', 'recovery_time_course']);
    expect(cards.map(c => c.id)).toEqual(['recovery_time_course', 'volume_dose_response']);
  });
});

describe('contract helpers', () => {
  it('dismiss keys are stable per subject', () => {
    expect(dismissKey('exercise_swap', { exerciseId: 'lib_barbell_bench_press', muscle: 'chest' })).toBe('exercise_swap:lib_barbell_bench_press');
    expect(dismissKey('add_exercise', { muscle: 'hamstrings' })).toBe('add_exercise:hamstrings');
    expect(dismissKey('schedule', {})).toBe('schedule:*');
  });

  it('empty report is insufficient data and reportNumbers collects metrics', () => {
    const r = emptyReport('2026-09-19', new Date('2026-09-19T10:00:00Z'));
    expect(r.dataQuality.insufficientData).toBe(true);
    expect(reportNumbers(r).size).toBe(0);
    r.findings.push({
      id: 'volume_drop:chest', kind: 'volume_drop', subject: { muscleGroup: 'chest' },
      metrics: { changePct: -18, windowWeeks: 3, baselineSets: 14.5, currentSets: 11.9 },
      window: { from: '2026-08-29', to: '2026-09-18', weeks: 3 }, confidence: 'medium', severity: 2,
      evidence: { sessionIds: [], days: [] }, principles: ['volume_dose_response'],
    });
    const nums = reportNumbers(r);
    expect(nums.has(-18)).toBe(true);
    expect(nums.has(14.5)).toBe(true);
    expect(nums.has(3)).toBe(true);
  });
});
