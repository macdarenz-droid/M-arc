import { describe, it, expect } from 'vitest';
import { evidenceKeyFor, selectMoment, type CoachTone, type PresenceDismissal } from '@/brain/coach/moments';
import type { Insight, Suggestion } from '@/brain/coach/words';
import type { Proposal } from '@/brain/coach/contract';

function insight(overrides: Partial<Insight> = {}): Insight {
  return {
    id: 'plateau:lib_barbell_bench_press', kind: 'plateau', category: 'progress', priority: 210,
    title: 'Bench press has plateaued', noticed: 'Your top set hasn’t moved in 4 weeks.',
    means: 'The load isn’t progressing.', action: 'Try a small jump next session.',
    confidence: 'high', severity: 2, evidence: [],
    ...overrides,
  };
}

function proposal(overrides: Partial<Proposal> = {}): Proposal {
  return {
    id: 'p1', kind: 'load_next', subject: { exerciseId: 'lib_barbell_bench_press' },
    apply: { kind: 'load_next', exerciseId: 'lib_barbell_bench_press', kg: 62.5, reps: [6, 8], mode: 'linear' },
    basedOn: ['plateau:lib_barbell_bench_press'], principles: [], confidence: 'medium', dismissKey: 'load_next:lib_barbell_bench_press',
    ...overrides,
  };
}

function suggestion(overrides: Partial<Suggestion> = {}): Suggestion {
  return {
    id: 'p1', kind: 'load_next', title: 'Push the top set', summary: 'Time for a small jump.',
    why: ['Bench has been flat for 4 weeks.'], changes: ['Next target: 62.5kg x 6-8'],
    acceptLabel: 'Use 62.5kg', evidence: [], confidence: 'medium', dismissKey: 'load_next:lib_barbell_bench_press',
    proposal: proposal(),
    ...overrides,
  };
}

const tones: CoachTone[] = ['steady', 'direct'];

describe('selectMoment: one cue or null, never filler', () => {
  it('M02: returns null with no evidence at all', () => {
    expect(selectMoment({ suggestions: [], insights: [], tone: 'steady', dismissed: [] })).toBeNull();
  });

  it('M02: a single insight with no suggestions still selects', () => {
    const m = selectMoment({ suggestions: [], insights: [insight()], tone: 'steady', dismissed: [] });
    expect(m?.id).toBe('insight:plateau:lib_barbell_bench_press');
  });

  it('M01/M03: a suggestion outranks a plain insight about the same evidence — the actionable next step wins', () => {
    const m = selectMoment({ suggestions: [suggestion()], insights: [insight()], tone: 'steady', dismissed: [] });
    expect(m?.kind).toBe('suggestion');
    expect(m?.id).toBe('suggestion:load_next:lib_barbell_bench_press');
  });

  it('deterministic tie-break by stable id when priority is equal', () => {
    const a = insight({ id: 'plateau:a', priority: 100 });
    const b = insight({ id: 'plateau:b', priority: 100 });
    const m1 = selectMoment({ suggestions: [], insights: [a, b], tone: 'steady', dismissed: [] });
    const m2 = selectMoment({ suggestions: [], insights: [b, a], tone: 'steady', dismissed: [] });
    expect(m1?.id).toBe('insight:plateau:a');
    expect(m2?.id).toBe('insight:plateau:a');
  });
});

describe('M01: stable id across surfaces, tones and clock ticks', () => {
  it('the same underlying evidence keeps the same id and evidenceKey across a tone change', () => {
    const results = tones.map(tone => selectMoment({ suggestions: [], insights: [insight()], tone, dismissed: [] }));
    expect(results[0]?.id).toBe(results[1]?.id);
    expect(results[0]?.evidenceKey).toBe(results[1]?.evidenceKey);
  });

  it('rendering the identical report twice (simulating separate tabs) yields identical identity', () => {
    const a = selectMoment({ suggestions: [suggestion()], insights: [], tone: 'steady', dismissed: [] });
    const b = selectMoment({ suggestions: [suggestion()], insights: [], tone: 'steady', dismissed: [] });
    expect(a).toEqual(b);
  });

  it('evidenceKeyFor hashes only the parts given it — order-sensitive, content-stable', () => {
    expect(evidenceKeyFor(['a', 1, 'b'])).toBe(evidenceKeyFor(['a', 1, 'b']));
    expect(evidenceKeyFor(['a', 1, 'b'])).not.toBe(evidenceKeyFor(['b', 1, 'a']));
  });
});

describe('M04: Steady/Direct change wording only', () => {
  it('tone changes cue text but never id, priority, target fields, confidence-derived priority, sourceIds, evidence, or action label itself', () => {
    const steady = selectMoment({ suggestions: [], insights: [insight()], tone: 'steady', dismissed: [] })!;
    const direct = selectMoment({ suggestions: [], insights: [insight()], tone: 'direct', dismissed: [] })!;
    const { cue: steadyCue, ...steadyRest } = steady;
    const { cue: directCue, ...directRest } = direct;
    expect(steadyRest).toEqual(directRest);
    // The cue text itself is allowed — expected — to differ.
    expect(typeof steadyCue).toBe('string');
    expect(typeof directCue).toBe('string');
  });

  it('a suggestion also has tone-stable everything but its cue', () => {
    const steady = selectMoment({ suggestions: [suggestion()], insights: [], tone: 'steady', dismissed: [] })!;
    const direct = selectMoment({ suggestions: [suggestion()], insights: [], tone: 'direct', dismissed: [] })!;
    expect(steady.id).toBe(direct.id);
    expect(steady.priority).toBe(direct.priority);
    expect(steady.action).toBe(direct.action);
    expect(steady.title).toBe(direct.title);
  });
});

describe('M05: dismissal is exact-match on (id, evidenceKey), and bounded retention is the caller’s job', () => {
  it('dismissing the exact id+evidenceKey removes it from candidates, revealing the next one', () => {
    const dismissed: PresenceDismissal[] = [{ id: 'suggestion:load_next:lib_barbell_bench_press', evidenceKey: evidenceKeyFor(['suggestion', 'load_next', 'load_next:lib_barbell_bench_press', 'medium', 'Next target: 62.5kg x 6-8']) }];
    const m = selectMoment({ suggestions: [suggestion()], insights: [insight()], tone: 'steady', dismissed });
    expect(m?.kind).toBe('insight');
  });

  it('dismissing by id alone, with a stale evidenceKey, does not suppress a materially changed situation', () => {
    const dismissed: PresenceDismissal[] = [{ id: 'insight:plateau:lib_barbell_bench_press', evidenceKey: 'stale-hash-from-before' }];
    const m = selectMoment({ suggestions: [], insights: [insight({ severity: 3 })], tone: 'steady', dismissed });
    expect(m).not.toBeNull(); // severity changed -> evidenceKey changed -> requalifies
  });

  it('cosmetic-only differences (tone) never change the evidenceKey used for dismissal matching', () => {
    const steadyId = selectMoment({ suggestions: [], insights: [insight()], tone: 'steady', dismissed: [] })!;
    const directId = selectMoment({ suggestions: [], insights: [insight()], tone: 'direct', dismissed: [] })!;
    expect(steadyId.evidenceKey).toBe(directId.evidenceKey);
  });

  it('dismissing everything present leaves null, never a fallback filler', () => {
    const only = insight();
    const evidenceKey = selectMoment({ suggestions: [], insights: [only], tone: 'steady', dismissed: [] })!.evidenceKey;
    const m = selectMoment({ suggestions: [], insights: [only], tone: 'steady', dismissed: [{ id: `insight:${only.id}`, evidenceKey }] });
    expect(m).toBeNull();
  });
});

describe('M06: selection is pure — no I/O, no report/history recomputation, same input always yields same output', () => {
  it('calling selectMoment repeatedly with the same input never mutates it or drifts', () => {
    const input = { suggestions: [suggestion()], insights: [insight()], tone: 'steady' as CoachTone, dismissed: [] };
    const before = JSON.stringify(input);
    const first = selectMoment(input);
    const second = selectMoment(input);
    expect(JSON.stringify(input)).toBe(before);
    expect(first).toEqual(second);
  });
});

describe('PERF01 (selector-level slice): scales linearly, no repeated per-candidate work', () => {
  it('selecting among a large candidate set stays fast and deterministic', () => {
    const many = Array.from({ length: 500 }, (_, i) => insight({ id: `plateau:ex_${i}`, priority: i }));
    const start = performance.now();
    const m = selectMoment({ suggestions: [], insights: many, tone: 'steady', dismissed: [] });
    const elapsed = performance.now() - start;
    expect(m?.id).toBe('insight:plateau:ex_499'); // highest priority wins
    expect(elapsed).toBeLessThan(50);
  });
});
