import { describe, it, expect } from 'vitest';
import { buildGrounding, type EscobarInput } from '@/brain/coach/escobar';
import { allowedNumbers, validateText } from '@/brain/coach/grounding';
import { buildAskPayload } from '@/ai/ask';
import { emptySchedule, type Split } from '@/core/models';
import { recoveryStatus } from '@/brain/recovery';
import { muscleVolumeStatus } from '@/brain/volume';
import { suggestNext } from '@/brain/progression';
import { baseCoachExtras, session, sets } from './helpers';

const today = '2026-09-18';
const now = new Date(`${today}T12:00:00Z`).getTime();
const bench = 'lib_barbell_bench_press';
const sessions = [
  session('2026-08-28', [{ id: bench, sets: sets(60, 8) }]),
  session('2026-09-04', [{ id: bench, sets: sets(62.5, 8) }]),
  session('2026-09-11', [{ id: bench, sets: sets(65, 8) }]),
  session('2026-09-17', [{ id: bench, sets: sets(67.5, 6, 'max') }]),
];
const push: Split = { id: 'split_push', name: 'Push', color: '#fff', createdAt: '2026-01-01T00:00:00Z', focus: ['chest'], exercises: [{ exerciseId: bench, sets: 3 }] };
const schedule = { ...emptySchedule(), fri: 'split_push' };

function input(over: Partial<EscobarInput> = {}): EscobarInput {
  const ctx = { sessions, splits: [push], schedule, custom: [], today, now, ...baseCoachExtras, profile: { ...baseCoachExtras.profile, bodyWeightKg: 80, heightCm: 180 } };
  return {
    ctx, goal: 'growth', unit: 'kg', profile: ctx.profile, preferences: ['Bad left elbow, no skull crushers'],
    readiness: { score: 72, band: 'amber', confidence: 'medium', loadAdvice: 'no_increase', drivers: ['Slept 5.5 h, under your usual 7.2 h'], calibrating: false },
    recovery: recoveryStatus({ sessions, custom: [], now, profile: ctx.profile, healthDays: [], checkIns: [], freshMarks: [], recoveryModel: { tauScale: {}, observations: {} } }),
    volume: muscleVolumeStatus(sessions, today),
    deloadOffer: { suggest: false, reason: '' },
    todaySplit: push,
    nextTargets: [{ exerciseId: bench, suggestion: suggestNext(sessions, bench, 'growth', today) }],
    ...over,
  };
}

/** The deployed Worker's own validator. Loaded by a runtime path so the app typecheck doesn't pull in the Worker's types. */
async function proxyValidator(): Promise<(raw: unknown) => { ok: boolean; reason?: string }> {
  const path = '../proxy/src/handler';
  const mod = await import(/* @vite-ignore */ path) as { validateAskPayload: (raw: unknown) => { ok: boolean; reason?: string }; MAX_ASK_BODY_BYTES: number };
  return raw => {
    const bytes = new TextEncoder().encode(JSON.stringify(raw)).length;
    if (bytes > mod.MAX_ASK_BODY_BYTES) return { ok: false, reason: `body ${bytes} bytes` };
    return mod.validateAskPayload(JSON.parse(JSON.stringify(raw)));
  };
}

describe('Escobar grounding', () => {
  it('carries readiness, today, next targets, recovery, records and weekly volume', () => {
    const g = buildGrounding(input());
    expect(g.findings.find(f => f.id === 'readiness:today')?.metrics).toMatchObject({ score: 72, band: 'amber', loadAdvice: 'no_increase' });
    expect(g.findings.some(f => f.kind === 'today_scheduled' && f.subject.splitName === 'Push')).toBe(true);
    expect(g.proposals[0]).toMatchObject({ kind: 'load_next', subject: { exerciseId: bench } });
    expect(g.stats?.recovery.length).toBe(24);
    expect(g.stats?.prs.some(p => p.exerciseId === bench)).toBe(true);
    expect(g.stats?.weeklyVolume.length).toBe(8);
    expect(g.bmi).toBe(24.7);
    expect(g.preferences).toEqual(['Bad left elbow, no skull crushers']);
  });

  it('never sends session ids, names or raw body measurements', () => {
    const raw = JSON.stringify(buildGrounding(input()));
    for (const s of sessions) expect(raw).not.toContain(s.id);
    expect(raw).not.toContain('"bodyWeightKg"');
    expect(raw).not.toContain('"heightCm"');
    expect(raw).not.toContain('Test');
  });

  it('grounds the numbers inside an insight so an answer can repeat them', () => {
    const g = buildGrounding(input());
    const allowed = allowedNumbers(g);
    expect(validateText('You slept 5.5 h against your usual 7.2 h, readiness 72.', allowed).ok).toBe(true);
    expect(validateText('Your squat is 140 kg.', allowed).ok).toBe(false);
  });

  it('sends an active deload as a finding and an offer when one is suggested', () => {
    const active = buildGrounding(input({ ctx: { ...input().ctx, deload: { startDay: '2026-09-16', endDay: '2026-09-22', reason: 'Two lifts stalled', setFactor: 0.6, loadFactor: 0.9 } } }));
    expect(active.findings.find(f => f.id === 'deload:active')?.metrics).toMatchObject({ dayOfWeek: 3, lengthDays: 7, setFactor: 0.6 });
    const offer = buildGrounding(input({ deloadOffer: { suggest: true, reason: 'Two main lifts stalled for 3 sessions' } }));
    expect(offer.findings.some(f => f.id === 'deload:offer')).toBe(true);
  });

  it('builds an /ask payload the deployed proxy accepts, even with history and several splits', async () => {
    const validate = await proxyValidator();
    const g = buildGrounding(input());
    const splits: Split[] = Array.from({ length: 9 }, (_, i) => ({ id: `s${i}`, name: `A very long split name number ${i}`, color: '#fff', createdAt: '2026-01-01T00:00:00Z', focus: ['chest', 'triceps', 'front_delts'], exercises: Array.from({ length: 16 }, () => ({ exerciseId: bench, sets: 3 })) }));
    const history = Array.from({ length: 20 }, (_, i) => ({ role: (i % 2 ? 'assistant' : 'user') as 'user' | 'assistant', text: i === 3 ? '   ' : 'x'.repeat(900) }));
    const payload = buildAskPayload(g, history, 'What should I lift today?', { splits, customExercises: [], schedule });
    expect(validate(payload)).toEqual({ ok: true, payload: expect.anything() });
  });

  it('stays valid with no history at all', async () => {
    const validate = await proxyValidator();
    const bare = buildGrounding(input({ ctx: { ...input().ctx, sessions: [] }, readiness: null, todaySplit: undefined, nextTargets: [], recovery: [], volume: [] }));
    const payload = buildAskPayload(bare, [], 'What is progressive overload?', { splits: [], customExercises: [], schedule: emptySchedule() });
    expect(validate(payload).ok).toBe(true);
  });
});
