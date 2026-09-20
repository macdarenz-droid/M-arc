import { describe, it, expect } from 'vitest';
import { buildAskPayload, requestAskAnswer, MAX_QUESTION_CHARS, MAX_HISTORY_TURNS, type AskTurn } from '@/ai/ask';
import { allowedNumbers, LIMITS } from '@/brain/coach/explainer';
import { buildReport } from '@/brain/coach/report';
import type { Exercise, Split } from '@/core/models';
import { emptySchedule } from '@/core/models';
import { ctx, pplHistory, LAST_MONDAY, PUSH_ID } from './coach-helpers';

function realReport() {
  const now = new Date('2026-09-19T18:00:00.000Z').getTime();
  const sessions = pplHistory(LAST_MONDAY, 12);
  return buildReport(ctx(sessions, { now, goal: 'strength', schedule: { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: PUSH_ID } }));
}

const reply = (status: number, body: unknown): typeof fetch => async () => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const PUSH: Split = { id: 'split_push', name: 'Push', color: '#4d9dff', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }], createdAt: '2026-01-01T00:00:00.000Z' };
const noSplits = { splits: [] as Split[], customExercises: [] as Exercise[], schedule: emptySchedule() };

describe('buildAskPayload', () => {
  it('carries the report grounding plus a capped, trimmed conversation', () => {
    const report = realReport();
    const p = buildAskPayload(report, [], 'Why has my chest work dropped?', { goal: 'strength', unit: 'kg', ...noSplits });
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
    const p = buildAskPayload(report, [], 'ok', { goal: 'strength', unit: 'kg', preferenceFacts: ['Usually accepts schedule changes when the coach offers them.'], ...noSplits });
    expect(p.preferences).toEqual(['Usually accepts schedule changes when the coach offers them.']);
  });

  it('caps the question length and the number of history turns kept', () => {
    const report = realReport();
    const long = 'x'.repeat(MAX_QUESTION_CHARS + 50);
    expect(buildAskPayload(report, [], long, { goal: 'lean', unit: 'kg', ...noSplits }).question).toHaveLength(MAX_QUESTION_CHARS);
    const history: AskTurn[] = Array.from({ length: MAX_HISTORY_TURNS + 5 }, (_, i) => ({ role: i % 2 === 0 ? 'user' : 'assistant', text: `turn ${i}` }));
    const p = buildAskPayload(report, history, 'ok', { goal: 'lean', unit: 'kg', ...noSplits });
    expect(p.history).toHaveLength(MAX_HISTORY_TURNS);
    expect(p.history[0]!.text).toBe(`turn ${history.length - MAX_HISTORY_TURNS}`); // oldest kept turns are the most recent ones, chronological order preserved
    expect(p.history.at(-1)!.text).toBe(`turn ${history.length - 1}`);
  });

  it('includes load_next proposals — excluded from Suggestions and /explain, but needed to ground "what should I lift today" — capped and never over the proxy\'s own proposal limit', () => {
    const report = realReport();
    expect(report.proposals.some(p => p.kind === 'load_next')).toBe(true); // sanity: this fixture actually has one to include
    const p = buildAskPayload(report, [], 'What weight should I do for bench today?', { goal: 'strength', unit: 'kg', ...noSplits });
    const loadNextIds = p.proposals.filter(x => x.kind === 'load_next').map(x => x.id);
    expect(loadNextIds.length).toBeGreaterThan(0);
    expect(p.proposals.length).toBeLessThanOrEqual(LIMITS.proposals);
    const someNumber = [...allowedNumbers(p)].find(n => Number.isInteger(n) && n > 0);
    expect(someNumber).toBeDefined(); // a load_next's kg/reps are now grounded numbers an answer can cite
  });

  it('cards cover everything in view, not just one finding, unlike /explain\'s narrower selection', () => {
    const report = realReport();
    const p = buildAskPayload(report, [], 'anything', { goal: 'strength', unit: 'kg', ...noSplits });
    const includedIds = new Set([...p.findings.map(f => f.id), ...p.proposals.map(pr => pr.id)]);
    const principlesInView = new Set<string>();
    for (const f of report.findings) if (includedIds.has(f.id)) f.principles.forEach(x => principlesInView.add(x));
    for (const pr of report.proposals) if (includedIds.has(pr.id)) pr.principles.forEach(x => principlesInView.add(x));
    expect(new Set(p.cards.map(c => c.id))).toEqual(principlesInView.size <= LIMITS.cards ? principlesInView : new Set(p.cards.map(c => c.id)));
    expect(p.cards.length).toBeGreaterThan(0);
  });

  it('carries the person\'s real splits today, with real exercise names resolved — this is the one route that may design or adjust one', () => {
    const report = realReport();
    const p = buildAskPayload(report, [], 'ok', { goal: 'lean', unit: 'kg', splits: [PUSH], customExercises: [], schedule: emptySchedule() });
    expect(p.splits).toEqual([{ id: 'split_push', name: 'Push', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', sets: 3 }] }]);
  });

  it('resolves a custom exercise\'s real name too, not just the library\'s', () => {
    const report = realReport();
    const custom: Exercise = { id: 'custom_1', name: 'Garage Landmine Press', equipment: 'Barbell', primary: ['front_delts'], secondary: [], stabilizers: [], aliases: [], pattern: 'shoulder_flexion', defaultSets: 3, mode: 'weighted', custom: true };
    const split: Split = { ...PUSH, exercises: [{ exerciseId: 'custom_1', sets: 3 }] };
    const p = buildAskPayload(report, [], 'ok', { goal: 'lean', unit: 'kg', splits: [split], customExercises: [custom], schedule: emptySchedule() });
    expect(p.splits[0]!.exercises[0]).toEqual({ exerciseId: 'custom_1', name: 'Garage Landmine Press', sets: 3 });
  });

  it('a brand-new user with no splits yet gets an empty list, not an error', () => {
    const report = realReport();
    expect(buildAskPayload(report, [], 'ok', { goal: 'lean', unit: 'kg', ...noSplits }).splits).toEqual([]);
  });

  it('carries the person\'s real weekly schedule today — this is the one route that may also rearrange it', () => {
    const report = realReport();
    const schedule = { ...emptySchedule(), mon: 'split_push', wed: 'split_pull' };
    const p = buildAskPayload(report, [], 'ok', { goal: 'lean', unit: 'kg', splits: [PUSH], customExercises: [], schedule });
    expect(p.schedule).toEqual(schedule);
  });
});

describe('requestAskAnswer', () => {
  const report = realReport();
  const payload = () => buildAskPayload(report, [], 'What is my main issue this week?', { goal: 'strength', unit: 'kg', ...noSplits });
  const withPush = () => buildAskPayload(report, [], 'Add a shoulder exercise to Push', { goal: 'strength', unit: 'kg', splits: [PUSH], customExercises: [], schedule: emptySchedule() });

  it('refuses locally on an empty question, never spending a call', async () => {
    const empty = buildAskPayload(report, [], '   ', { goal: 'strength', unit: 'kg', ...noSplits });
    const r = await requestAskAnswer(empty, [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: () => { throw new Error('must not be called'); } });
    expect(r).toEqual({ ok: false, error: 'Type a question first.' });
  });

  it('accepts a grounded personal answer, with an empty drafts list', async () => {
    const p = payload();
    const someNumber = [...allowedNumbers(p)].find(n => Number.isInteger(n) && n > 0) ?? 1;
    const fetchImpl = reply(200, { scope: 'personal', answer: `Your data shows a factor around ${someNumber} worth watching.`, model: 'claude-sonnet-5' });
    const r = await requestAskAnswer(p, [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: true, scope: 'personal', category: 'general', answer: `Your data shows a factor around ${someNumber} worth watching.`, drafts: [], scheduleDraft: null, concern: null });
  });

  it('drops a personal-scope answer that invents a number not in the report', async () => {
    const fetchImpl = reply(200, { scope: 'personal', answer: 'Add exactly 999 kg to fix it.', model: 'claude-sonnet-5' });
    const r = await requestAskAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain('not in your data');
  });

  it('an unmarked answer defaults to the strict personal path, same as before scope existed', async () => {
    const fetchImpl = reply(200, { answer: 'Add exactly 999 kg to fix it.', model: 'claude-sonnet-5' });
    const r = await requestAskAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(false);
  });

  it('a general-knowledge answer is not checked against the report — it is not a claim about this person\'s data', async () => {
    const fetchImpl = reply(200, { scope: 'general', answer: 'Biceps brachii has two heads and flexes the elbow; typical creatine protocols study 3 to 5 grams a day.', model: 'claude-sonnet-5' });
    const r = await requestAskAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: true, scope: 'general', category: 'general', answer: 'Biceps brachii has two heads and flexes the elbow; typical creatine protocols study 3 to 5 grams a day.', drafts: [], scheduleDraft: null, concern: null });
  });

  it('a real category value passes through, and an invalid or missing one defaults to "general" rather than trusting the network', async () => {
    const withReal = reply(200, { scope: 'general', category: 'nutrition', answer: 'Protein needs vary, but a common range is a gram or two per kilogram of body weight.' });
    expect(await requestAskAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: withReal })).toMatchObject({ ok: true, category: 'nutrition' });
    const withBogus = reply(200, { scope: 'general', category: 'not-a-real-category', answer: 'Protein needs vary, but a common range is a gram or two per kilogram of body weight.' });
    expect(await requestAskAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: withBogus })).toMatchObject({ ok: true, category: 'general' });
    const withMissing = reply(200, { scope: 'general', answer: 'Protein needs vary, but a common range is a gram or two per kilogram of body weight.' });
    expect(await requestAskAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: withMissing })).toMatchObject({ ok: true, category: 'general' });
  });

  it('rejects an unreadable reply rather than showing something empty', async () => {
    const fetchImpl = reply(200, { nothing: true });
    const r = await requestAskAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: false, error: 'The coach sent back something we could not read.' });
  });

  it('surfaces proxy errors in plain words', async () => {
    const r = await requestAskAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: reply(429, { error: 'Too many requests. Wait a minute.' }) });
    expect(r).toEqual({ ok: false, error: 'Too many requests. Wait a minute.' });
  });

  it('accepts a real, catalog-only draft that modifies the named existing split', async () => {
    const fetchImpl = reply(200, {
      scope: 'personal', category: 'training', answer: 'Added Face Pull for rear-delt balance.',
      splitDrafts: [{ action: 'modify', splitId: 'split_push', name: 'Push', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }, { exerciseId: 'lib_face_pull', sets: 3 }] }],
    });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.answer).toBe('Added Face Pull for rear-delt balance.');
    expect(r.drafts).toEqual([{ action: 'modify', splitId: 'split_push', name: 'Push', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }, { exerciseId: 'lib_face_pull', sets: 3 }] }]);
  });

  it('a personal-scope answer describing a real splitDraft is not dropped for citing the split\'s own rep/set numbers — those are a design choice, not a report claim', async () => {
    // Seen live: "create a 5-day full body split" always cites its own numbers ("3 sets of 8-12 reps") in
    // "answer", and every one of those got silently dropped before this exemption existed.
    const fetchImpl = reply(200, {
      scope: 'personal', category: 'training',
      answer: 'Since your goal is strength, I built this around 5 sessions a week, 999 sets of 888-777 reps each.',
      splitDrafts: [{ action: 'create', splitId: null, name: 'Full Body', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] }],
    });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.drafts).toHaveLength(1);
  });

  it('still drops a personal-scope answer that invents a number, when the reply proposes no valid splitDraft at all', async () => {
    const fetchImpl = reply(200, { scope: 'personal', category: 'training', answer: 'Add exactly 999 kg to fix it.', splitDrafts: [] });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(false);
  });

  it('an empty splitDrafts list (still clarifying, or an ordinary answer) is a normal, successful answer', async () => {
    const fetchImpl = reply(200, { scope: 'general', category: 'training', answer: 'Which muscles do you want this split to focus on?', splitDrafts: [] });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: true, scope: 'general', category: 'training', answer: 'Which muscles do you want this split to focus on?', drafts: [], scheduleDraft: null, concern: null });
  });

  it('one message describing two splits at once gets back a draft for each, independently applicable', async () => {
    const fetchImpl = reply(200, {
      scope: 'general', category: 'training', answer: 'Here are both — Push and Pull.',
      splitDrafts: [
        { action: 'create', splitId: null, name: 'Push', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] },
        { action: 'create', splitId: null, name: 'Pull', focus: ['lats'], exercises: [{ exerciseId: 'lib_lat_pulldown', sets: 3 }] },
      ],
    });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.drafts.map(d => d.name)).toEqual(['Push', 'Pull']);
  });

  it('when one of several drafts fails validation, the rest still come through — not all-or-nothing', async () => {
    const fetchImpl = reply(200, {
      scope: 'general', category: 'training', answer: 'ok',
      splitDrafts: [
        { action: 'create', splitId: null, name: 'Push', focus: [], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] },
        { action: 'create', splitId: null, name: 'Empty', focus: [], exercises: [{ exerciseId: 'not_real', sets: 3 }] },
      ],
    });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.drafts.map(d => d.name)).toEqual(['Push']);
  });

  it('drops an exercise id the app does not recognize rather than showing it as real, and keeps the rest', async () => {
    const fetchImpl = reply(200, {
      scope: 'general', category: 'training', answer: 'ok',
      splitDrafts: [{ action: 'modify', splitId: 'split_push', name: 'Push', focus: ['chest'], exercises: [{ exerciseId: 'lib_face_pull', sets: 3 }, { exerciseId: 'lib_totally_made_up_exercise', sets: 3 }] }],
    });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.drafts[0]!.exercises).toEqual([{ exerciseId: 'lib_face_pull', sets: 3 }]);
  });

  it('drops a repeated exerciseId within one splitDraft, keeping only the first occurrence\'s sets — seen live, "Push-Up" listed three times built a split with three duplicate entries', async () => {
    const fetchImpl = reply(200, {
      scope: 'general', category: 'training', answer: 'ok',
      splitDrafts: [{ action: 'create', splitId: null, name: 'Full Body (Home)', focus: ['chest'], exercises: [
        { exerciseId: 'lib_push_up', sets: 3 },
        { exerciseId: 'lib_glute_bridge', sets: 3 },
        { exerciseId: 'lib_push_up', sets: 3 },
        { exerciseId: 'lib_push_up', sets: 2 },
        { exerciseId: 'lib_plank', sets: 3 },
      ] }],
    });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.drafts[0]!.exercises).toEqual([
      { exerciseId: 'lib_push_up', sets: 3 },
      { exerciseId: 'lib_glute_bridge', sets: 3 },
      { exerciseId: 'lib_plank', sets: 3 },
    ]);
  });

  it('a draft left with no recognizable exercises at all is not shown as actionable', async () => {
    const fetchImpl = reply(200, { scope: 'general', category: 'training', answer: 'ok', splitDrafts: [{ action: 'modify', splitId: 'split_push', name: 'Push', focus: [], exercises: [{ exerciseId: 'not_real', sets: 3 }] }] });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toMatchObject({ ok: true, drafts: [] });
  });

  it('a "modify" naming a split id that is not one this payload actually sent is not applied', async () => {
    const fetchImpl = reply(200, { scope: 'general', category: 'training', answer: 'ok', splitDrafts: [{ action: 'modify', splitId: 'split_legs_not_sent', name: 'Push', focus: [], exercises: [{ exerciseId: 'lib_face_pull', sets: 3 }] }] });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toMatchObject({ ok: true, drafts: [] });
  });

  it('an invalid focus muscle id is dropped, real ones kept, capped at 2', async () => {
    const fetchImpl = reply(200, { scope: 'general', category: 'training', answer: 'ok', splitDrafts: [{ action: 'create', splitId: null, name: 'Arms', focus: ['biceps', 'not_a_muscle', 'triceps', 'forearms'], exercises: [{ exerciseId: 'lib_hammer_curl', sets: 3 }] }] });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.drafts[0]!.focus).toEqual(['biceps', 'triceps']);
  });

  it('sets outside 1-6 are clamped, not rejected outright', async () => {
    const fetchImpl = reply(200, { scope: 'general', category: 'training', answer: 'ok', splitDrafts: [{ action: 'create', splitId: null, name: 'Legs', focus: [], exercises: [{ exerciseId: 'lib_leg_press', sets: 20 }, { exerciseId: 'lib_leg_extension', sets: 0 }] }] });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.drafts[0]!.exercises).toEqual([{ exerciseId: 'lib_leg_press', sets: 6 }, { exerciseId: 'lib_leg_extension', sets: 1 }]);
  });

  it('accepts a full-week scheduleDraft naming real splits and rest days', async () => {
    const fetchImpl = reply(200, {
      scope: 'general', category: 'training', answer: 'Moved Push to Wednesday.',
      scheduleDraft: { sun: null, mon: null, tue: null, wed: 'split_push', thu: null, fri: null, sat: null },
    });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.scheduleDraft).toEqual({ sun: null, mon: null, tue: null, wed: 'split_push', thu: null, fri: null, sat: null });
  });

  it('a missing day invalidates the whole scheduleDraft — a partial week is not shown as actionable', async () => {
    const fetchImpl = reply(200, {
      scope: 'general', category: 'training', answer: 'ok',
      scheduleDraft: { sun: null, mon: null, tue: null, wed: 'split_push', thu: null, fri: null }, // sat missing
    });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toMatchObject({ ok: true, scheduleDraft: null });
  });

  it('a day naming a split id this payload never sent invalidates the whole scheduleDraft', async () => {
    const fetchImpl = reply(200, {
      scope: 'general', category: 'training', answer: 'ok',
      scheduleDraft: { sun: null, mon: 'split_never_sent', tue: null, wed: null, thu: null, fri: null, sat: null },
    });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toMatchObject({ ok: true, scheduleDraft: null });
  });

  it('an ordinary answer with no schedule change carries scheduleDraft: null', async () => {
    const fetchImpl = reply(200, { scope: 'general', category: 'training', answer: 'ok' });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toMatchObject({ ok: true, scheduleDraft: null });
  });

  it('a personal-scope answer describing a real scheduleDraft is not dropped for citing frequency numbers — a design choice, not a report claim', async () => {
    const fetchImpl = reply(200, {
      scope: 'personal', category: 'training',
      answer: 'Since you train 5 days a week, I spaced Push and Pull with 2 rest days between them.',
      scheduleDraft: { sun: null, mon: 'split_push', tue: null, wed: null, thu: null, fri: null, sat: null },
    });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.scheduleDraft).not.toBeNull();
  });

  it('still drops a personal-scope answer that invents a number when neither a splitDraft nor a scheduleDraft is present', async () => {
    const fetchImpl = reply(200, { scope: 'personal', category: 'training', answer: 'You now train 999 days a week.' });
    const r = await requestAskAnswer(withPush(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(false);
  });

  it('a real concern value passes through', async () => {
    const fetchImpl = reply(200, { scope: 'general', category: 'general', answer: 'That sounds really hard to carry.', concern: 'crisis' });
    const r = await requestAskAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toMatchObject({ ok: true, concern: 'crisis' });
  });

  it('an invalid or missing concern defaults to null rather than trusting the network', async () => {
    const withBogus = reply(200, { scope: 'general', category: 'general', answer: 'ok', concern: 'not-a-real-concern' });
    expect(await requestAskAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: withBogus })).toMatchObject({ ok: true, concern: null });
    const withMissing = reply(200, { scope: 'general', category: 'general', answer: 'ok' });
    expect(await requestAskAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: withMissing })).toMatchObject({ ok: true, concern: null });
  });
});
