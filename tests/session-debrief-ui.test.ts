import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const debrief = readFileSync(new URL('../src/slices/workout/SessionDebrief.tsx', import.meta.url), 'utf8');
const train = readFileSync(new URL('../src/slices/workout/Train.tsx', import.meta.url), 'utf8');
const history = readFileSync(new URL('../src/slices/history/History.tsx', import.meta.url), 'utf8');
const today = readFileSync(new URL('../src/slices/today/Today.tsx', import.meta.url), 'utf8');
const coach = readFileSync(new URL('../src/slices/coach/Coach.tsx', import.meta.url), 'utf8');

describe('purpose-aware debrief wiring', () => {
  it('keeps achievement, plan fit, and evidence as separate rendered sections', () => {
    expect(debrief).toContain('<Section title="Achievement">');
    expect(debrief).toContain('<Section title="Plan fit">');
    expect(debrief).toContain('<Section title="Evidence">');
    expect(debrief).toContain('Original target');
    expect(debrief).toContain('Accepted target');
  });

  it('uses the same local classifier and PR engine after finish and in history', () => {
    for (const source of [train, history]) {
      expect(source).toContain('assessPlanFit');
      expect(source).toContain('recordsForSession');
      expect(source).toContain('fit={fit}');
      expect(source).toContain('achievements={achievements}');
      expect(source).toContain('tone={tone}');
    }
  });

  it('uses the shared completed-session selector on Today and Coach', () => {
    expect(today).toContain('sessionFeedback.value');
    expect(coach).toContain('sessionFeedback.value');
    expect(coach).toContain('View plan evidence');
  });
});
