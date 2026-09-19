import { describe, it, expect } from 'vitest';
import { buildPayload, allowedNumbers, validateText, extractNumbers, explanationKey, readCache, getCached, putCached, fetchExplanation, endpoint, newDeviceId, CACHE_SIZE, LIMITS, type ExplainPayload } from '@/brain/coach/explainer';
import { buildReport } from '@/brain/coach/report';
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
  it('extracts numbers and allows exactly what the payload contains, dates and rounded forms included', () => {
    expect(extractNumbers('down 18% from 14.5 to 11,9 sets')).toEqual([18, 14.5, 11.9]);
    const allowed = allowedNumbers(p);
    for (const n of [18, -18, 14.5, 15, 11.9, 12, 3, 150, 80, 30, 2026, 9, 19, 8, 24, 13, 40, 0.85]) expect(allowed.has(n), String(n)).toBe(true);
    expect(validateText('Chest work is down 18%: about 12 sets a week against your usual 14.5.', allowed).ok).toBe(true);
    expect(validateText('Since 24 August you did 3 weeks of lighter chest work.', allowed).ok).toBe(true);
    const bad = validateText('Add 5 kg to your bench and do 20 sets.', allowed);
    expect(bad.ok).toBe(false);
    expect(bad.offending).toEqual([5, 20]);
    expect(validateText('No numbers here at all.', allowed).ok).toBe(true);
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
