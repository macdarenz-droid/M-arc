import { describe, it, expect } from 'vitest';
import { buildPayload, allowedNumbers, validateText, extractNumbers, explanationKey, readCache, getCached, putCached, fetchExplanation, endpoint, newDeviceId, computeBmi, CACHE_SIZE, LIMITS, MAX_FINDINGS_PER_KIND, trimFindingsAndProposals, type ExplainPayload } from '@/brain/coach/explainer';
import { PREFERENCE_FACTS_MAX } from '@/brain/coach/preferences';
import { buildReport } from '@/brain/coach/report';
import type { Finding, FindingsReport } from '@/brain/coach/contract';
import { session } from './helpers';
import { ctx, pplHistory, std, LAST_MONDAY, PUSH_EX, PUSH_ID } from './coach-helpers';

const memory = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) }; };

function realReport() {
  const now = new Date('2026-09-19T18:00:00.000Z').getTime();
  const sessions = [...pplHistory(LAST_MONDAY, 12), session('2026-09-18', std(PUSH_EX), PUSH_ID)];
  return buildReport(ctx(sessions, { now, goal: 'strength', schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: PUSH_ID } }));
}

describe('payload', () => {
  it('carries findings, proposals and cards but no evidence, principles lists or profile', () => {
    const r = realReport();
    const p = buildPayload(r, { goal: 'strength', unit: 'kg' });
    expect(p.version).toBe(1);
    expect(p.findings.length).toBeGreaterThan(0);
    for (const f of p.findings) { expect('evidence' in f).toBe(false); expect('principles' in f).toBe(false); }
    for (const q of p.proposals) { expect(q.kind).not.toBe('load_next'); expect('principles' in q).toBe(false); }
    expect(JSON.stringify(p)).not.toMatch(/sessionIds|profile|bodyWeight|heightCm|"name":/);
    expect(p.explain.length).toBeGreaterThan(0);
    expect(p.explain.length).toBeLessThanOrEqual(LIMITS.explain);
    const known = new Set([...p.findings.map(f => f.id), ...p.proposals.map(q => q.id)]);
    for (const id of p.explain) expect(known.has(id)).toBe(true);
    // Only cards the explained items rest on.
    const cited = new Set([...r.findings, ...r.proposals].filter(x => p.explain.includes(x.id)).flatMap(x => x.principles));
    expect(p.cards.map(c => c.id).sort()).toEqual([...cited].sort());
    expect(p.cards.length).toBeLessThanOrEqual(LIMITS.cards);
    const chosen = buildPayload(r, { goal: 'strength', unit: 'lb', explain: [r.findings[0]!.id, 'nope'] });
    expect(chosen.explain).toEqual([r.findings[0]!.id]);
    expect(chosen.unit).toBe('lb');
    // No preferences given: an empty array, not a missing field.
    expect(p.preferences).toEqual([]);
  });

  it('carries preference facts, capped the same way findings and cards are', () => {
    const r = realReport();
    const many = Array.from({ length: PREFERENCE_FACTS_MAX + 3 }, (_, i) => `Fact ${i}.`);
    const p = buildPayload(r, { goal: 'strength', unit: 'kg', preferenceFacts: many });
    expect(p.preferences).toHaveLength(PREFERENCE_FACTS_MAX);
    expect(p.preferences).toEqual(many.slice(0, PREFERENCE_FACTS_MAX));
  });

  it('a kind that fires once per muscle never crowds every other kind out of the payload (a heavy day flags most muscles under_recovered, but every record that day must still survive)', () => {
    const bare = (over: Partial<Finding>): Finding => ({
      id: 'x', kind: 'under_recovered', subject: {}, metrics: {}, window: { from: '2026-09-20', to: '2026-09-20' },
      confidence: 'medium', severity: 2, evidence: { sessionIds: [], days: [] }, principles: ['recovery_time_course'], ...over,
    });
    const underRecovered = Array.from({ length: 20 }, (_, i) => bare({ id: `under_recovered:m${i}`, subject: { muscle: `m${i}` as never } }));
    const records = ['lib_assisted_pull_up', 'lib_incline_machine_press', 'lib_overhead_cable_triceps_extension', 'lib_seated_cable_row'].map(exerciseId =>
      bare({ id: `record:${exerciseId}:week`, kind: 'record', subject: { exerciseId }, severity: 0, confidence: 'high', principles: ['one_rm_estimation'] }));
    const report: FindingsReport = {
      version: 1, generatedAt: '2026-09-20T12:00:00.000Z', today: '2026-09-20',
      dataQuality: { sessions: 12, weeksOfData: 5, effortCoverage: 0.9, insufficientData: false },
      findings: [...underRecovered, ...records], // already sorted severity desc, as buildReport produces
      proposals: [],
    };
    const { findings } = trimFindingsAndProposals(report);
    const byKind = new Map<string, number>();
    for (const f of findings) byKind.set(f.kind, (byKind.get(f.kind) ?? 0) + 1);
    expect(byKind.get('under_recovered')).toBe(MAX_FINDINGS_PER_KIND);
    expect(byKind.get('record')).toBe(records.length); // every record that day reaches the payload, not just one
    expect(findings.length).toBeLessThanOrEqual(LIMITS.findings);
  });
});

describe('computeBmi', () => {
  it('is weight in kg over height in metres squared, one decimal place', () => {
    expect(computeBmi({ bodyWeightKg: 70, heightCm: 164 })).toBe(26);
    expect(computeBmi({ bodyWeightKg: 68, heightCm: 175 })).toBe(22.2);
  });

  it('is null when either figure is missing or not a real positive number — never a guess', () => {
    expect(computeBmi({})).toBeNull();
    expect(computeBmi({ bodyWeightKg: 70 })).toBeNull();
    expect(computeBmi({ heightCm: 164 })).toBeNull();
    expect(computeBmi({ bodyWeightKg: 0, heightCm: 164 })).toBeNull();
    expect(computeBmi({ bodyWeightKg: 70, heightCm: -164 })).toBeNull();
  });
});

describe('number validation', () => {
  const p: ExplainPayload = {
    version: 1, kind: 'explain', goal: 'lean', unit: 'kg', today: '2026-09-19', dataQuality: { sessions: 40, weeksOfData: 12, effortCoverage: 0.85, insufficientData: false },
    findings: [{ id: 'volume_drop:chest', kind: 'volume_drop', subject: { muscleGroup: 'chest' }, metrics: { changePct: -18, baselineSets: 14.5, currentSets: 11.9 }, window: { from: '2026-08-24', to: '2026-09-13', weeks: 3 }, confidence: 'high', severity: 1 }],
    proposals: [{ id: 'rest_default:*', kind: 'rest_default', subject: {}, apply: { kind: 'rest_default', seconds: 150 }, basedOn: [], confidence: 'medium' }],
    cards: [{ id: 'load_and_rep_range', title: 't', rating: 'strong', statement: 'Around eighty percent of a one-rep max, or 80 percent.', disputed: 'Under roughly 30 percent.' }],
    explain: ['volume_drop:chest'],
  };
  it('extracts numbers and allows exactly what the payload contains and the rounded forms of its decimals — deliberately not a date\'s own year/month/day parts', () => {
    expect(extractNumbers('down 18% from 14.5 to 11,9 sets')).toEqual([18, 14.5, 11.9]);
    expect(extractNumbers('total volume was 1,500 kg')).toEqual([1500]);
    const allowed = allowedNumbers(p);
    for (const n of [18, -18, 14.5, 15, 11.9, 12, 3, 150, 80, 30, 40, 0.85]) expect(allowed.has(n), String(n)).toBe(true);
    // A window's year/month/day-of-month must NOT be allowed just because a date string carries them —
    // otherwise a fabricated small number (reps, sets, weeks) can slip through as "grounded" purely
    // because some finding's window happens to start or end on a matching day-of-month.
    for (const n of [2026, 9, 19, 8, 24, 13]) expect(allowed.has(n), `date part ${n} must not be allowed`).toBe(false);
    expect(validateText('Chest work is down 18%: about 12 sets a week against your usual 14.5.', allowed).ok).toBe(true);
    const dated = validateText('Since 24 August you did 3 weeks of lighter chest work.', allowed);
    expect(dated.ok).toBe(false); // "24" is a date's day-of-month, not a grounded quantity — correctly rejected now
    expect(dated.offending).toEqual([24]);
    const bad = validateText('Add 5 kg to your bench and do 20 sets.', allowed);
    expect(bad.ok).toBe(false);
    expect(bad.offending).toEqual([5, 20]);
    expect(validateText('No numbers here at all.', allowed).ok).toBe(true);
  });
  it('allows "bmi" when present — a single derived number, the one deliberate exception to "no body measurements" — and doesn\'t invent one when absent', () => {
    const withBmi = allowedNumbers({ ...p, bmi: 26 });
    expect(withBmi.has(26)).toBe(true);
    expect(validateText('Your BMI is 26, in the overweight band on paper.', withBmi).ok).toBe(true);
    const withoutBmi = allowedNumbers({ ...p, bmi: null });
    expect(withoutBmi.has(26)).toBe(false);
    expect(validateText('Your BMI is 26.', withoutBmi).ok).toBe(false);
  });
  it('keys change with content and not with order of unrelated fields', () => {
    const k1 = explanationKey(p);
    expect(k1).toMatch(/^[0-9a-f]{16}$/);
    expect(explanationKey({ ...p })).toBe(k1);
    expect(explanationKey({ ...p, findings: [{ ...p.findings[0]!, metrics: { ...p.findings[0]!.metrics, changePct: -19 } }] })).not.toBe(k1);
    expect(explanationKey({ ...p, unit: 'lb' })).not.toBe(k1);
  });
});

describe('cache', () => {
  it('stores most recent first, capped, and survives junk', () => {
    const s = memory();
    expect(readCache(s)).toEqual([]);
    for (let i = 0; i < CACHE_SIZE + 5; i++) putCached({ key: `k${i}`, at: '', model: 'm', summary: null, items: {}, rejected: 0 }, s);
    const all = readCache(s);
    expect(all).toHaveLength(CACHE_SIZE);
    expect(all[0]!.key).toBe(`k${CACHE_SIZE + 4}`);
    expect(getCached('k0', s)).toBeNull();
    expect(getCached(`k${CACHE_SIZE + 4}`, s)?.key).toBe(`k${CACHE_SIZE + 4}`);
    s.setItem('marc.coach.explanations', '{not json');
    expect(readCache(s)).toEqual([]);
    expect(readCache(null)).toEqual([]);
    expect(newDeviceId()).toMatch(/^dev_[a-z0-9]{8,24}$/);
    expect(endpoint('https://x.workers.dev/', '/explain')).toBe('https://x.workers.dev/explain');
  });
});

describe('fetchExplanation', () => {
  const p = buildPayload(realReport(), { goal: 'strength', unit: 'kg' });
  const reply = (status: number, body: unknown): typeof fetch => async () => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

  it('keeps validated lines, drops invented numbers, records the model', async () => {
    const first = p.explain[0]!;
    const numbers = [...allowedNumbers(p)].filter(n => n > 0 && Number.isInteger(n))[0] ?? 1;
    const fetchImpl = reply(200, { summary: `A fair week with ${numbers} in it.`, items: [{ id: first, text: 'Nothing invented here.' }, { id: p.explain[1] ?? 'x', text: 'You should add 999 kg.' }, { id: 'not_requested', text: 'ignored' }], model: 'claude-sonnet-5' });
    const r = await fetchExplanation(p, { url: 'https://proxy.example/', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.explanation.summary).toContain('fair week');
    expect(r.explanation.items[first]).toBe('Nothing invented here.');
    expect(Object.keys(r.explanation.items)).toHaveLength(1);
    expect(r.explanation.rejected).toBe(p.explain[1] ? 1 : 0);
    expect(r.explanation.model).toBe('claude-sonnet-5');
    expect(r.explanation.key).toBe(explanationKey(p));
  });

  it('surfaces proxy errors and network failures in plain words', async () => {
    const limited = await fetchExplanation(p, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: reply(429, { error: 'Daily limit for this device reached.' }) });
    expect(limited).toEqual({ ok: false, error: 'Daily limit for this device reached.' });
    const down = await fetchExplanation(p, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: async () => { throw new TypeError('fetch failed'); } });
    expect(down.ok).toBe(false);
    if (!down.ok) expect(down.error).toContain('Could not reach');
    const html = await fetchExplanation(p, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: async () => new Response('<html>', { status: 502 }) });
    expect(html).toEqual({ ok: false, error: 'The proxy answered 502.' });
  });
});
