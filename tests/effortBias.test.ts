import { describe, it, expect } from 'vitest';
import { rirObservations, effortBiasByLabel } from '@/brain/effortBias';
import { exerciseHistory } from '@/brain/history';
import { session, sets } from './helpers';

const ex = 'lib_barbell_bench_press';

describe('rirObservations', () => {
  it('pairs a same-load max set with a non-max set within 14 days', () => {
    const a = session('2026-09-01', [{ id: ex, sets: sets(60, 8, 'ideal', 1) }]);
    const b = session('2026-09-05', [{ id: ex, sets: sets(60, 12, 'max', 1) }]);
    const hist = exerciseHistory([a, b], ex);
    const obs = rirObservations(hist);
    expect(obs).toHaveLength(1);
    expect(obs[0]).toMatchObject({ otherEffort: 'ideal', impliedRir: 4, kg: 60 });
  });
  it('ignores pairs more than 14 days apart', () => {
    const a = session('2026-09-01', [{ id: ex, sets: sets(60, 8, 'ideal', 1) }]);
    const b = session('2026-09-20', [{ id: ex, sets: sets(60, 12, 'max', 1) }]);
    const hist = exerciseHistory([a, b], ex);
    expect(rirObservations(hist)).toHaveLength(0);
  });
  it('ignores different loads', () => {
    const a = session('2026-09-01', [{ id: ex, sets: sets(60, 8, 'ideal', 1) }]);
    const b = session('2026-09-05', [{ id: ex, sets: sets(65, 12, 'max', 1) }]);
    const hist = exerciseHistory([a, b], ex);
    expect(rirObservations(hist)).toHaveLength(0);
  });
});

describe('effortBiasByLabel', () => {
  it('needs 3+ observations before reporting a bias', () => {
    const obs = [
      { day: '2026-09-01', kg: 60, otherEffort: 'ideal' as const, impliedRir: 4 },
      { day: '2026-09-05', kg: 60, otherEffort: 'ideal' as const, impliedRir: 4 },
    ];
    expect(effortBiasByLabel(obs)).toHaveLength(0);
  });
  it('reports the mean bias vs the assumed RIR once there are 3+', () => {
    const obs = [1, 2, 3].map(i => ({ day: `2026-09-0${i}`, kg: 60, otherEffort: 'ideal' as const, impliedRir: 4 }));
    const bias = effortBiasByLabel(obs);
    expect(bias).toHaveLength(1);
    expect(bias[0]).toMatchObject({ effort: 'ideal', n: 3 });
    expect(bias[0]!.bias).toBeCloseTo(2, 5); // implied 4 vs assumed 2
  });
  it('is capped at +-3 reps', () => {
    const obs = [1, 2, 3].map(i => ({ day: `2026-09-0${i}`, kg: 60, otherEffort: 'easy' as const, impliedRir: 20 }));
    expect(effortBiasByLabel(obs)[0]!.bias).toBe(3);
  });
});
