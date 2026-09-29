import { describe, it, expect } from 'vitest';
import * as retarget from '@/brain/retarget';

// LT-3 (docs/LOAD-AWARE-TARGETS.md §4): the live retarget owns the placeholders for sets 2..n.
const menu = { rungsKg: [20, 22.5, 25, 27.5, 30, 32, 32.5, 35], unit: 'kg' as const };

describe('liveRetarget: a different load on set 1 (LT3-A1)', () => {
  it('32 kg against a 27.5 plan, 5 at Max: sets 2..n get 32 × 3 and the exact line', () => {
    const live = (retarget as unknown as { liveRetarget?: (...a: unknown[]) => { kg: number; reps: number; text: string | null } }).liveRetarget;
    expect(live).toBeTypeOf('function');
    const r = live!([{ kg: 32, reps: 5, effort: 'max' }], { kg: 27.5, reps: 8 }, 'lean', 'main', menu);
    expect(r.kg).toBe(32);
    expect(r.reps).toBe(3);
    expect(r.text).toBe("32 kg is above today's plan: about 3 clean reps. Back to 27.5 for 8, or stay at 32 for 3.");
  });
});
