import { describe, it, expect } from 'vitest';
import { coachInsights } from '@/brain/coach/rules';
import { emptySchedule } from '@/core/models';
import { baseCoachExtras, session, sets } from './helpers';

const baseCtx = { sessions: [], splits: [], schedule: emptySchedule(), custom: [], today: '2026-09-18', now: new Date('2026-09-18T12:00:00Z').getTime(), ...baseCoachExtras };
const bench = 'lib_barbell_bench_press';

describe('profile.changed', () => {
  it('reports a recent weight change with the delta from the prior entry', () => {
    const out = coachInsights({ ...baseCtx, profileHistory: [{ at: '2026-09-17T08:00:00Z', field: 'bodyWeightKg', from: 80, to: 78, source: 'user' }] });
    const insight = out.find(i => i.id.startsWith('profile-changed:weight'));
    expect(insight?.title).toBe('Weight updated to 78 kg');
    expect(insight?.noticed).toContain('down 2 kg');
  });

  it('reports a goal change with the new rep ranges and rest suggestion', () => {
    const out = coachInsights({ ...baseCtx, profileHistory: [{ at: '2026-09-17T08:00:00Z', field: 'goal', from: 'lean', to: 'strength', source: 'user' }] });
    const insight = out.find(i => i.id.startsWith('profile-changed:goal'));
    expect(insight?.title).toBe('Goal changed to Strength focus');
    expect(insight?.means).toContain('1–5 reps');
    expect(insight?.action).toContain('150s');
  });

  it('says nothing for a change older than 7 days', () => {
    const out = coachInsights({ ...baseCtx, profileHistory: [{ at: '2026-08-01T08:00:00Z', field: 'bodyWeightKg', from: 80, to: 78, source: 'user' }] });
    expect(out.some(i => i.id.startsWith('profile-changed'))).toBe(false);
  });

  it('keeps only the latest change per field', () => {
    const out = coachInsights({
      ...baseCtx,
      profileHistory: [
        { at: '2026-09-16T08:00:00Z', field: 'bodyWeightKg', from: 82, to: 80, source: 'user' },
        { at: '2026-09-17T08:00:00Z', field: 'bodyWeightKg', from: 80, to: 78, source: 'user' },
      ],
    });
    const weightInsights = out.filter(i => i.id.startsWith('profile-changed:weight'));
    expect(weightInsights).toHaveLength(1);
    expect(weightInsights[0]?.title).toBe('Weight updated to 78 kg');
  });

  it('ignores fields other than weight and goal', () => {
    const out = coachInsights({ ...baseCtx, profileHistory: [{ at: '2026-09-17T08:00:00Z', field: 'heightCm', from: 178, to: 180, source: 'user' }] });
    expect(out.some(i => i.id.startsWith('profile-changed'))).toBe(false);
  });
});

describe('readiness.effort-calibration', () => {
  it('fires once a max set at the same load beats a rated set by 2+ reps, 3+ times', () => {
    const sessions = [1, 2, 3].map(i => [
      session(`2026-09-0${i}`, [{ id: bench, sets: sets(60, 8, 'ideal', 1) }]),
      session(`2026-09-0${i + 1}`, [{ id: bench, sets: sets(60, 12, 'max', 1) }]),
    ]).flat();
    const out = coachInsights({ ...baseCtx, sessions }, 20);
    expect(out.some(i => i.id.startsWith('effort-calibration'))).toBe(true);
  });
  it('stays quiet with fewer than 3 matched pairs', () => {
    const sessions = [
      session('2026-09-01', [{ id: bench, sets: sets(60, 8, 'ideal', 1) }]),
      session('2026-09-02', [{ id: bench, sets: sets(60, 12, 'max', 1) }]),
    ];
    const out = coachInsights({ ...baseCtx, sessions }, 20);
    expect(out.some(i => i.id.startsWith('effort-calibration'))).toBe(false);
  });
});

describe('progress.plateau-lever', () => {
  it('fires with a volume lever when a flat main lift is under-trained', () => {
    const days = ['2026-07-06', '2026-07-20', '2026-08-03', '2026-08-10', '2026-08-17', '2026-08-24', '2026-08-31', '2026-09-18'];
    const sessions = days.map(d => session(d, [{ id: bench, sets: sets(60, 8, 'ideal', 1) }])); // 1 set/session, 10+ days apart -> low weekly volume
    const out = coachInsights({ ...baseCtx, sessions }, 20);
    const lever = out.find(i => i.id === `plateau-lever:${bench}`);
    expect(lever).toBeDefined();
    expect(lever!.action).toContain('sets at ideal');
  });
  it('stays quiet with too little history', () => {
    const sessions = [session('2026-09-18', [{ id: bench, sets: sets(60, 8, 'ideal', 1) }])];
    const out = coachInsights({ ...baseCtx, sessions }, 20);
    expect(out.some(i => i.id.startsWith('plateau-lever'))).toBe(false);
  });
});
