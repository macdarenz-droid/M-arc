import { describe, expect, it } from 'vitest';
import type { ComponentChildren, VNode } from 'preact';
import { readFileSync } from 'node:fs';
import { PrReachHint } from '@/slices/workout/PrReachHint';

function text(node: ComponentChildren): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(text).join('');
  return text((node as VNode).props.children);
}

describe('reachable record hint', () => {
  it('renders kg and lb from one identical underlying comparison', () => {
    const reach = { kind: 'reps_at_load' as const, kg: 60, standingReps: 8, requiredReps: 9 };
    expect(text(PrReachHint({ reach, unit: 'kg' }))).toBe('9 reps at 60 kg would beat your previous 8. Only if it feels right today.');
    expect(text(PrReachHint({ reach, unit: 'lb' }))).toBe('9 reps at 132.5 lb would beat your previous 8. Only if it feels right today.');
  });

  it('does not invent a load for bodyweight records', () => {
    const reach = { kind: 'best_reps' as const, kg: null, standingReps: 10, requiredReps: 11 };
    expect(text(PrReachHint({ reach, unit: 'lb' }))).toBe('11 reps would beat your previous 10. Only if it feels right today.');
  });

  it('resolves history once per entry memo and reuses it for row checks', () => {
    const source = readFileSync(new URL('../src/slices/workout/Train.tsx', import.meta.url), 'utf8');
    expect(source.match(/exerciseHistory\(/g)).toHaveLength(1);
    expect(source).toContain('() => exerciseHistory(s.sessions, entry.exerciseId, s.customExercises)');
    expect(source).toContain('[s.sessions, s.customExercises, entry.exerciseId]');
    expect(source).toContain('liveRecordFrom(prior, mode, set)');
    expect(source).toContain('prior,\n                mode,');
  });
});
