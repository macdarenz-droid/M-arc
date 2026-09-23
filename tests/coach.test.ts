import { describe, it, expect } from 'vitest';
import { coachInsights, deloadOffer } from '@/brain/coach/rules';
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

describe('heart.effort-mismatch', () => {
  const withHeart = (effort: 'easy' | 'ideal' | 'max', peakBpm: number) => ({ kg: 60, reps: 8, effort, heart: { peakBpm, endBpm: peakBpm } });
  it('fires when the last session has an easy set near its own hardest peak', () => {
    const sessions = [session('2026-09-18', [{ id: bench, sets: [withHeart('ideal', 160), withHeart('ideal', 170), withHeart('ideal', 180), withHeart('max', 190), withHeart('easy', 180)] }])];
    const out = coachInsights({ ...baseCtx, sessions }, 20);
    expect(out.some(i => i.id.startsWith('heart-mismatch'))).toBe(true);
  });
  it('stays quiet below 5 rated-and-heart sets', () => {
    const sessions = [session('2026-09-18', [{ id: bench, sets: [withHeart('ideal', 160), withHeart('easy', 180)] }])];
    const out = coachInsights({ ...baseCtx, sessions }, 20);
    expect(out.some(i => i.id.startsWith('heart-mismatch'))).toBe(false);
  });
});

describe('heart.drift', () => {
  const withHrr = (peakBpm: number, hrr60: number) => ({ kg: 60, reps: 8, effort: 'ideal' as const, heart: { peakBpm, endBpm: peakBpm, hrr60 } });
  it('fires when peak HR rises and HRR60 shrinks across same-load sets', () => {
    const sessions = [session('2026-09-18', [{ id: bench, sets: [withHrr(150, 20), withHrr(160, 15), withHrr(172, 8)] }])];
    const out = coachInsights({ ...baseCtx, sessions }, 20);
    expect(out.some(i => i.id.startsWith('heart-drift'))).toBe(true);
  });
  it('stays quiet without shrinking recovery', () => {
    const sessions = [session('2026-09-18', [{ id: bench, sets: [withHrr(150, 20), withHrr(160, 22), withHrr(172, 21)] }])];
    const out = coachInsights({ ...baseCtx, sessions }, 20);
    expect(out.some(i => i.id.startsWith('heart-drift'))).toBe(false);
  });
});

describe('readiness.today', () => {
  const day = (offset: number) => { const d = new Date('2026-09-18T00:00:00Z'); d.setUTCDate(d.getUTCDate() - offset); return d.toISOString().slice(0, 10); };
  it('fires red when resting heart rate is sharply elevated', () => {
    const healthDays = Array.from({ length: 28 }, (_, i) => ({ day: day(i), restingHr: i < 7 ? 75 : 55, source: 'health_connect' as const, syncedAt: '2026-09-18T00:00:00Z' }));
    const out = coachInsights({ ...baseCtx, healthDays }, 20);
    expect(out.some(i => i.id === 'readiness-today' && i.title === 'Readiness: red')).toBe(true);
  });
  it('is quiet with no health or check-in data at all', () => {
    const out = coachInsights({ ...baseCtx }, 20);
    expect(out.some(i => i.id === 'readiness-today')).toBe(false);
  });
});

describe('insight feedback (F3.6)', () => {
  it('hides an insight snoozed within the last 7 days', () => {
    const profileHistory = [{ at: '2026-09-17T08:00:00Z', field: 'bodyWeightKg' as const, from: 80, to: 78, source: 'user' as const }];
    const insight = coachInsights({ ...baseCtx, profileHistory })[0]!;
    const snoozed = coachInsights({ ...baseCtx, profileHistory, feedback: [{ id: insight.id, day: '2026-09-16', verdict: 'snoozed' }] });
    expect(snoozed.some(i => i.id === insight.id)).toBe(false);
  });
  it('stops hiding an insight once the 7-day snooze has passed', () => {
    const profileHistory = [{ at: '2026-09-17T08:00:00Z', field: 'bodyWeightKg' as const, from: 80, to: 78, source: 'user' as const }];
    const insight = coachInsights({ ...baseCtx, profileHistory })[0]!;
    const stillSnoozed = coachInsights({ ...baseCtx, profileHistory, feedback: [{ id: insight.id, day: '2026-09-11', verdict: 'snoozed' as const }] });
    expect(stillSnoozed.some(i => i.id === insight.id)).toBe(true);
  });
});

describe('programming.volume (F3.2)', () => {
  const push = { id: 'split_push', name: 'Push', color: '#fff', exercises: [{ exerciseId: bench, sets: 3 }], focus: [], createdAt: '2026-01-01' };
  it('flags a trained muscle that has run well over its band', () => {
    const s = [session('2026-09-18', [{ id: bench, sets: sets(60, 8, 'ideal', 12) }])];
    const out = coachInsights({ ...baseCtx, sessions: s, splits: [push] }, 20);
    expect(out.some(i => i.id === 'volume:chest')).toBe(true);
  });
  it('stays quiet for a muscle outside any split', () => {
    const s = [session('2026-09-18', [{ id: 'lib_lat_pulldown', sets: sets(60, 8, 'ideal', 12) }])];
    const out = coachInsights({ ...baseCtx, sessions: s, splits: [push] }, 20);
    expect(out.some(i => i.id?.startsWith('volume:'))).toBe(false);
  });
});

describe('deloadOffer (F3.3)', () => {
  it('offers nothing with no signal', () => {
    expect(deloadOffer(baseCtx).suggest).toBe(false);
  });
  it('offers nothing while a deload is already active', () => {
    const out = deloadOffer({ ...baseCtx, deload: { startDay: '2026-09-16', endDay: '2026-09-22', reason: 'x', setFactor: 0.6, loadFactor: 0.9 } });
    expect(out.suggest).toBe(false);
  });
  it('offers a lighter week once its endDay has passed', () => {
    const past = { startDay: '2026-08-01', endDay: '2026-08-07', reason: 'x', setFactor: 0.6, loadFactor: 0.9 };
    const days = ['2026-08-20', '2026-08-24', '2026-08-27', '2026-08-31', '2026-09-03', '2026-09-07', '2026-09-10', '2026-09-14', '2026-09-17'];
    const sessions = days.flatMap((d, i) => [
      session(d, [{ id: bench, sets: sets(70 - i * 2.5, 9, 'ideal') }]),
      session(d, [{ id: 'lib_barbell_back_squat', sets: sets(100 - i * 2.5, 9, 'ideal') }], 'split_legs'),
    ]);
    const out = deloadOffer({ ...baseCtx, sessions, deload: past });
    expect(out.suggest).toBe(true);
  });
});

describe('active lifts and one note per lift (BR-05, BR-27)', () => {
  const flat = (days: string[]) => days.map(d => session(d, [{ id: bench, sets: sets(60, 8, 'ideal', 3) }]));
  const eight = ['2026-06-01', '2026-06-04', '2026-06-08', '2026-06-11', '2026-06-15', '2026-06-18', '2026-06-22', '2026-06-25'];
  it('a lift not trained for six weeks gets no plateau note', () => {
    const out = coachInsights({ ...baseCtx, sessions: flat(eight) }, 20);
    expect(out.some(i => i.exerciseId === bench && i.category === 'progress')).toBe(false);
  });
  it('an active flat lift gets exactly one progress note', () => {
    const recent = ['2026-07-27', '2026-07-30', '2026-08-03', '2026-08-06', '2026-08-10', '2026-08-13', '2026-08-17', '2026-08-20', '2026-08-24', '2026-08-31', '2026-09-07', '2026-09-14'];
    const out = coachInsights({ ...baseCtx, sessions: flat(recent) }, 20);
    expect(out.filter(i => i.exerciseId === bench && i.category === 'progress')).toHaveLength(1);
  });
});

describe('heart notes after the session day (BR-26)', () => {
  it('an effort mismatch from three days ago is no longer shown', () => {
    const withHeart = (effort: 'easy' | 'ideal' | 'max', peakBpm: number) => ({ kg: 60, reps: 8, effort, heart: { peakBpm, endBpm: peakBpm } });
    const sessions = [session('2026-09-15', [{ id: bench, sets: [withHeart('ideal', 160), withHeart('ideal', 170), withHeart('ideal', 180), withHeart('max', 190), withHeart('easy', 180)] }])];
    expect(coachInsights({ ...baseCtx, sessions }, 20).some(i => i.id.startsWith('heart-mismatch'))).toBe(false);
  });
});

describe('plateau needs time and ignores the time before a break (QA-R3a-6, QA-R3a-7)', () => {
  it('two weeks of a 3x/week lift is not a plateau', () => {
    const days = ['2026-09-07', '2026-09-09', '2026-09-11', '2026-09-14', '2026-09-16', '2026-09-18'];
    const sessions = days.map((d, i) => session(d, [{ id: bench, sets: sets(100 + i * 0.25, 5, 'ideal', 1) }]));
    expect(coachInsights({ ...baseCtx, sessions }, 20).some(i => i.id.startsWith('plateau-lever'))).toBe(false);
  });
  it('a comeback after months away is not judged on the old sessions', async () => {
    const { deloadTrigger } = await import('@/brain/deload');
    const squat = 'lib_barbell_back_squat';
    const old = ['2026-01-05', '2026-01-12', '2026-01-19', '2026-01-26', '2026-02-02', '2026-02-09', '2026-02-16', '2026-02-23'];
    const sessions = [
      ...old.map((d, i) => session(d, [{ id: bench, sets: sets(100 - i * 2.5, 5, 'max', 3) }, { id: squat, sets: sets(140 - i * 2.5, 5, 'max', 3) }])),
      session('2026-09-21', [{ id: bench, sets: sets(80, 5, 'ideal', 3) }, { id: squat, sets: sets(120, 5, 'ideal', 3) }]),
    ];
    const out = coachInsights({ ...baseCtx, sessions }, 20);
    expect(out.some(i => i.id.startsWith('plateau:'))).toBe(false);
    expect(deloadTrigger(sessions, '2026-09-23').suggest).toBe(false);
  });
});
