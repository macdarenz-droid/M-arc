import { describe, it, expect } from 'vitest';
import { buildAskPayload, requestAskAnswer, MAX_QUESTION_CHARS, MAX_HISTORY_TURNS, type AskTurn } from '@/ai/ask';
import { allowedNumbers, LIMITS } from '@/brain/coach/explainer';
import { buildReport } from '@/brain/coach/report';
import { ctx, pplHistory, LAST_MONDAY, PUSH_ID } from './coach-helpers';

function realReport() {
  const now = new Date('2026-09-19T18:00:00.000Z').getTime();
  const sessions = pplHistory(LAST_MONDAY, 12);
  return buildReport(ctx(sessions, { now, goal: 'strength', schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: PUSH_ID } }));
}

const reply = (status: number, body: unknown): typeof fetch => async () => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

describe('buildAskPayload', () => {
  it('carries the report grounding plus a capped, trimmed conversation', () => {
    const report = realReport();
    const p = buildAskPayload(report, [], 'Why has my chest work dropped?', { goal: 'strength', unit: 'kg' });
    expect(p.version).toBe(1);
    expect(p.kind).toBe('ask');
    expect(p.findings.length).toBeGreaterThan(0);
    expect(p.history).toEqual([]);
    expect(p.question).toBe('Why has my chest work dropped?');
    expect(JSON.stringify(p)).not.toMatch(/sessionIds|profile|bodyWeight|heightCm|"name":/);
    expect(p.preferences).toEqual([]);
  });

  it('carries preference facts, capped', () => {
    const report = realReport();
    const p = buildAskPayload(report, [], 'ok', { goal: 'strength', unit: 'kg', preferenceFacts: ['Usually accepts schedule changes when the coach offers them.'] });
    expect(p.preferences).toEqual(['Usually accepts schedule changes when the coach offers them.']);
  });

  it('caps the question length and the number of history turns kept', () => {
    const report = realReport();
    const long = 'x'.repeat(MAX_QUESTION_CHARS + 50);
    expect(buildAskPayload(report, [], long, { goal: 'lean', unit: 'kg' }).question).toHaveLength(MAX_QUESTION_CHARS);
    const history: AskTurn[] = Array.from({ length: MAX_HISTORY_TURNS + 5 }, (_, i) => ({ role: i % 2 === 0 ? 'user' : 'assistant', text: `turn ${i}` }));
    const p = buildAskPayload(report, history, 'ok', { goal: 'lean', unit: 'kg' });
    expect(p.history).toHaveLength(MAX_HISTORY_TURNS);
    expect(p.history[0]!.text).toBe(`turn ${history.length - MAX_HISTORY_TURNS}`); // oldest kept turns are the most recent ones, chronological order preserved
    expect(p.history.at(-1)!.text).toBe(`turn ${history.length - 1}`);
  });

  it('includes load_next proposals — excluded from Suggestions and /explain, but needed to ground "what should I lift today" — capped and never over the proxy\'s own proposal limit', () => {
    const report = realReport();
    expect(report.proposals.some(p => p.kind === 'load_next')).toBe(true); // sanity: this fixture actually has one to include
    const p = buildAskPayload(report, [], 'What weight should I do for bench today?', { goal: 'strength', unit: 'kg' });
    const loadNextIds = p.proposals.filter(x => x.kind === 'load_next').map(x => x.id);
    expect(loadNextIds.length).toBeGreaterThan(0);
    expect(p.proposals.length).toBeLessThanOrEqual(LIMITS.proposals);
    const someNumber = [...allowedNumbers(p)].find(n => Number.isInteger(n) && n > 0);
    expect(someNumber).toBeDefined(); // a load_next's kg/reps are now grounded numbers an answer can cite
  });

  it('cards cover everything in view, not just one finding, unlike /explain\'s narrower selection', () => {
    const report = realReport();
    const p = buildAskPayload(report, [], 'anything', { goal: 'strength', unit: 'kg' });
    const includedIds = new Set([...p.findings.map(f => f.id), ...p.proposals.map(pr => pr.id)]);
    const principlesInView = new Set<string>();
    for (const f of report.findings) if (includedIds.has(f.id)) f.principles.forEach(x => principlesInView.add(x));
    for (const pr of report.proposals) if (includedIds.has(pr.id)) pr.principles.forEach(x => principlesInView.add(x));
    expect(new Set(p.cards.map(c => c.id))).toEqual(principlesInView.size <= LIMITS.cards ? principlesInView : new Set(p.cards.map(c => c.id)));
    expect(p.cards.length).toBeGreaterThan(0);
  });
});

describe('requestAskAnswer', () => {
  const report = realReport();
  const payload = () => buildAskPayload(report, [], 'What is my main issue this week?', { goal: 'strength', unit: 'kg' });

  it('refuses locally on an empty question, never spending a call', async () => {
    const empty = buildAskPayload(report, [], '   ', { goal: 'strength', unit: 'kg' });
    const r = await requestAskAnswer(empty, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: () => { throw new Error('must not be called'); } });
    expect(r).toEqual({ ok: false, error: 'Type a question first.' });
  });

  it('accepts a grounded personal answer', async () => {
    const p = payload();
    const someNumber = [...allowedNumbers(p)].find(n => Number.isInteger(n) && n > 0) ?? 1;
    const fetchImpl = reply(200, { scope: 'personal', answer: `Your data shows a factor around ${someNumber} worth watching.`, model: 'claude-sonnet-5' });
    const r = await requestAskAnswer(p, { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: true, scope: 'personal', category: 'general', answer: `Your data shows a factor around ${someNumber} worth watching.` });
  });

  it('drops a personal-scope answer that invents a number not in the report', async () => {
    const fetchImpl = reply(200, { scope: 'personal', answer: 'Add exactly 999 kg to fix it.', model: 'claude-sonnet-5' });
    const r = await requestAskAnswer(payload(), { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('not in your data');
  });

  it('an unmarked answer defaults to the strict personal path, same as before scope existed', async () => {
    const fetchImpl = reply(200, { answer: 'Add exactly 999 kg to fix it.', model: 'claude-sonnet-5' });
    const r = await requestAskAnswer(payload(), { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(false);
  });

  it('a general-knowledge answer is not checked against the report — it is not a claim about this person\'s data', async () => {
    const fetchImpl = reply(200, { scope: 'general', answer: 'Biceps brachii has two heads and flexes the elbow; typical creatine protocols study 3 to 5 grams a day.', model: 'claude-sonnet-5' });
    const r = await requestAskAnswer(payload(), { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: true, scope: 'general', category: 'general', answer: 'Biceps brachii has two heads and flexes the elbow; typical creatine protocols study 3 to 5 grams a day.' });
  });

  it('a real category value passes through, and an invalid or missing one defaults to "general" rather than trusting the network', async () => {
    const withReal = reply(200, { scope: 'general', category: 'nutrition', answer: 'Protein needs vary, but a common range is a gram or two per kilogram of body weight.' });
    expect(await requestAskAnswer(payload(), { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: withReal })).toMatchObject({ ok: true, category: 'nutrition' });
    const withBogus = reply(200, { scope: 'general', category: 'not-a-real-category', answer: 'Protein needs vary, but a common range is a gram or two per kilogram of body weight.' });
    expect(await requestAskAnswer(payload(), { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: withBogus })).toMatchObject({ ok: true, category: 'general' });
    const withMissing = reply(200, { scope: 'general', answer: 'Protein needs vary, but a common range is a gram or two per kilogram of body weight.' });
    expect(await requestAskAnswer(payload(), { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: withMissing })).toMatchObject({ ok: true, category: 'general' });
  });

  it('rejects an unreadable reply rather than showing something empty', async () => {
    const fetchImpl = reply(200, { nothing: true });
    const r = await requestAskAnswer(payload(), { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: false, error: 'The coach sent back something we could not read.' });
  });

  it('surfaces proxy errors in plain words', async () => {
    const r = await requestAskAnswer(payload(), { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: reply(429, { error: 'Too many requests. Wait a minute.' }) });
    expect(r).toEqual({ ok: false, error: 'Too many requests. Wait a minute.' });
  });
});
