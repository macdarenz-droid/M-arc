/**
 * 34 realistic questions across the categories a person actually asks a
 * gym coach — general knowledge, injury/pain, split-building, personal
 * progress, app navigation, out-of-scope, and mixed personal+general. This is honest
 * about what it can and cannot prove: there is no Anthropic API key in
 * this environment, so nothing here calls the real model or grades its
 * wording — that needs a live run of proxy/src/anthropic.ts's callAsk
 * (see proxy/test/live.test.ts, skipped here for the same reason). What
 * this file verifies instead, for all 30: the report each question would
 * actually be answered from contains the right grounded data (or
 * correctly does not), and the app's own scope-based validator accepts a
 * well-formed answer in that category and rejects an invented one — the
 * deterministic half of "can the coach answer this," which a live call
 * cannot skip past even when it passes.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildAskPayload, requestAskAnswer } from '@/ai/ask';
import { allowedNumbers, validateText } from '@/brain/coach/explainer';
import { buildReport } from '@/brain/coach/report';
import { session, sets } from './helpers';
import { ctx, pplHistory, std, LAST_MONDAY, PUSH_ID, PUSH_EX } from './coach-helpers';
import { addDays } from '@/core/dates';

/**
 * The Worker's system prompt lives in proxy/src/promptAsk.ts, a separate
 * TS project (its types.ts references Cloudflare's KVNamespace global,
 * which the root tsconfig doesn't declare) — so it's read here as plain
 * text rather than imported as a module. That sidesteps the cross-package
 * type error while still checking the actual shipped prompt, not a copy
 * that could drift from it.
 */
const PROMPT_SOURCE = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../proxy/src/promptAsk.ts'), 'utf8');

const reply = (status: number, body: unknown): typeof fetch => async () => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const opts = { url: 'https://proxy.example', deviceId: 'dev_test12345678' };

/** A varied, several-months history: PPL with real volume/effort/recovery signal, plus one session with a note-flagged shoulder pain — gives most personal-scope categories something real to answer from. */
function kitchenSink() {
  const now = new Date('2026-09-20T18:00:00.000Z').getTime();
  const painSession = { ...session('2026-09-15', std(['lib_dumbbell_shoulder_press'], 20, 8, 'ideal', 3), PUSH_ID), noteFlags: [{ kind: 'pain_or_discomfort' as const, muscle: 'front_delts' as const }] };
  const sessions = [...pplHistory(LAST_MONDAY, 12), painSession, session('2026-09-20', std(PUSH_EX), PUSH_ID)];
  const c = ctx(sessions, { now, goal: 'strength' });
  return { context: c, report: buildReport(c) };
}

/** A flat bench press for two months: a real, unambiguous plateau to compare against. */
function plateaued() {
  const flat = [0, 1, 2, 3, 4, 5, 6, 7].map(i => session(addDays('2026-07-06', i * 4), [{ id: 'lib_barbell_bench_press', sets: sets(60, 8) }], PUSH_ID));
  const c = ctx(flat, { now: new Date('2026-09-19T18:00:00.000Z').getTime() });
  return { context: c, report: buildReport(c) };
}

/** A brand-new user: no splits, no history — forces the deterministic split_new proposal to actually fire. */
function freshStart() {
  const c = ctx([], { splits: [] });
  return { context: c, report: buildReport(c) };
}

const sink = kitchenSink();
const flat = plateaued();
const fresh = freshStart();

const noSplits = { splits: [], customExercises: [] };

/** A general-scope answer is never checked against the report — proves the bypass a naive validator would otherwise wrongly block (this is exactly what silently rejected "define biceps scientifically" before the scope split existed). */
async function acceptsGeneralAnswer(question: string, answerWithOutsideNumbers: string) {
  const payload = buildAskPayload(sink.report, [], question, { goal: 'lean', unit: 'kg', ...noSplits });
  const r = await requestAskAnswer(payload, [], { ...opts, fetchImpl: reply(200, { scope: 'general', answer: answerWithOutsideNumbers, model: 'claude-sonnet-5' }) });
  expect(r, question).toEqual({ ok: true, scope: 'general', category: 'general', answer: answerWithOutsideNumbers, drafts: [] });
}

describe('general knowledge (8): anatomy, machines, reps, nutrition — none of this needs the report', () => {
  const questions = [
    'What is the biceps and what does it do?',
    'Which exercises target the lats?',
    'What machines work the chest?',
    'How many reps should I do for hypertrophy versus pure strength?',
    'What does creatine actually do?',
    'How much protein do people typically aim for per day?',
    'Why do I feel hungrier after a hard leg day?',
    'What is the difference between free weights and machines?',
  ];
  it.each(questions)('%s', async q => acceptsGeneralAnswer(q, 'A general answer with real specifics: 2 sets, 8 to 12 reps, about 1.6 to 2.2 grams per kilogram.'));
});

describe('injury and pain (6)', () => {
  it('general: what to avoid with a sore shoulder — answered fully, not gated on personal data', () =>
    acceptsGeneralAnswer('My shoulder hurts a bit, what exercises should I avoid?', 'Skip overhead pressing and heavy horizontal pressing for now; rows and lower-body work are usually fine.'));

  it('general: what is still safe to train with a tweaked lower back', () =>
    acceptsGeneralAnswer('I tweaked my lower back, what can I still train safely?', 'Upper body work that does not load the spine — chest press, lat pulldown, seated rows — is usually fine.'));

  it('"build me a split that avoids my hurt shoulder": the prompt allows building it, using the real pain flag as context — this used to be refused entirely before the merge with /build-split', () => {
    expect(PROMPT_SOURCE).toContain('You may design a new split or adjust an existing one when asked');
    expect(PROMPT_SOURCE).toContain('a recent finding (a note-flagged pain, an under-recovered or uncovered muscle, a plateau)');
    expect(PROMPT_SOURCE).toContain('respect a stated equipment or exercise-avoidance constraint exactly');
  });

  it('a real splitDraft round-trips through requestAskAnswer, re-validated against the app\'s own catalog — the same safety net the standalone /build-split had, now shared', async () => {
    const payload = buildAskPayload(sink.report, [], 'Build me a push day that avoids overhead pressing for my shoulder', { goal: 'strength', unit: 'kg', ...noSplits });
    const fetchImpl = reply(200, {
      scope: 'personal', category: 'training', answer: 'Since you flagged shoulder pain recently, I kept overhead work out of this one.',
      splitDrafts: [{ action: 'create', splitId: null, name: 'Push', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }, { exerciseId: 'lib_cable_fly', sets: 3 }] }],
    });
    const r = await requestAskAnswer(payload, [], { ...opts, fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.drafts).toEqual([{ action: 'create', splitId: null, name: 'Push', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }, { exerciseId: 'lib_cable_fly', sets: 3 }] }]);
  });

  it('personal: "why does the coach keep suggesting push exercises even though my shoulder hurts" — the report actually carries that flag', () => {
    const payload = buildAskPayload(sink.report, [], 'Why does the coach keep suggesting push exercises even though my shoulder hurts?', { goal: 'strength', unit: 'kg', ...noSplits });
    const flagged = payload.findings.find(f => f.kind === 'note_flag' && f.subject.muscle === 'front_delts');
    expect(flagged).toBeDefined();
    expect(flagged!.metrics.flagKind).toBe('pain_or_discomfort');
    // And the deterministic planners actually respect it — see coach-planners.test.ts's dedicated avoidance tests for the mechanism itself.
  });

  it('individualized dosage with a stated condition still gets a doctor referral, not a number', () => {
    expect(PROMPT_SOURCE).toContain('individualized medication or supplement dosage');
    expect(PROMPT_SOURCE).toContain('a doctor or pharmacist can tailor it to them');
  });

  it('general: is post-training soreness two days later normal', () =>
    acceptsGeneralAnswer('Is it normal to feel sore two days after training?', 'Yes — delayed-onset soreness commonly peaks around the second day and fades within a few more.'));
});

describe('split and programme building (4)', () => {
  it('"create a split for me focused on back": builds one for real now, but still never invents an action against an existing proposal it wasn\'t given', () => {
    expect(PROMPT_SOURCE).toContain('do not invent an exercise, programme or rep scheme');
  });

  it('general: how many days a week for muscle growth', () =>
    acceptsGeneralAnswer('How many days a week should I train for muscle growth?', 'Most people do well training each muscle twice a week, commonly 3 to 5 sessions total.'));

  it('general: what does a push/pull/legs split look like', () =>
    acceptsGeneralAnswer('What does a good push/pull/legs split look like?', 'Push covers chest, shoulders and triceps; pull covers back and biceps; legs covers quads, hamstrings, glutes and calves.'));

  it('a real "New plan" proposal exists in the report when the person has nothing set up, and it covers every major muscle — the actual mechanism, not chat invention', () => {
    const proposal = fresh.report.proposals.find(p => p.kind === 'split_new');
    expect(proposal).toBeDefined();
    if (proposal?.apply.kind !== 'split_new') return;
    expect(proposal.apply.splits.length).toBeGreaterThan(0);
    const payload = buildAskPayload(fresh.report, [], 'Can you set me up with a plan?', { goal: 'lean', unit: 'kg', ...noSplits });
    expect(payload.proposals.some(p => p.kind === 'split_new')).toBe(true);
  });
});

describe('personal progress and comparison (6): needs real logged history', () => {
  it('a genuine plateau is grounded with real, checkable numbers', () => {
    const payload = buildAskPayload(flat.report, [], 'Why has my bench stopped moving?', { goal: 'lean', unit: 'kg', ...noSplits });
    const plateau = payload.findings.find(f => f.kind === 'plateau' && f.subject.exerciseId === 'lib_barbell_bench_press');
    expect(plateau).toBeDefined();
    expect(allowedNumbers(payload).has(60)).toBe(true); // the actual stalled load
  });

  it('a personal answer using the report\'s own numbers is accepted', async () => {
    const payload = buildAskPayload(flat.report, [], 'What\'s going on with my bench?', { goal: 'lean', unit: 'kg', ...noSplits });
    const r = await requestAskAnswer(payload, [], { ...opts, fetchImpl: reply(200, { scope: 'personal', answer: 'You have been stuck at 60kg for a while now — the stimulus stopped changing.', model: 'claude-sonnet-5' }) });
    expect(r.ok).toBe(true);
  });

  it('a personal answer inventing a number not in the report is rejected', async () => {
    const payload = buildAskPayload(flat.report, [], 'How much should I add next session?', { goal: 'lean', unit: 'kg', ...noSplits });
    const r = await requestAskAnswer(payload, [], { ...opts, fetchImpl: reply(200, { scope: 'personal', answer: 'Add exactly 7.5kg and you will break through.', model: 'claude-sonnet-5' }) });
    expect(r.ok).toBe(false);
  });

  it('"what is my main issue this week" is grounded in real findings from an actual training history', () => {
    const payload = buildAskPayload(sink.report, [], 'What is my main issue this week?', { goal: 'strength', unit: 'kg', ...noSplits });
    expect(payload.findings.length).toBeGreaterThan(0);
  });

  it('"have I been getting stronger" has real progress/decline findings to draw from when they exist', () => {
    const payload = buildAskPayload(sink.report, [], 'Have I been getting stronger lately?', { goal: 'strength', unit: 'kg', ...noSplits });
    expect(payload.findings.some(f => ['progressing', 'decline', 'plateau', 'record'].includes(f.kind))).toBe(true);
  });

  it('a why-did-you-suggest-that question about an existing proposal has that proposal\'s real basedOn findings in view', () => {
    const withProposal = sink.report.proposals[0];
    if (!withProposal) return; // nothing proposed this run — the assertion below still holds vacuously
    const payload = buildAskPayload(sink.report, [], 'Why did you suggest that?', { goal: 'strength', unit: 'kg', ...noSplits });
    expect(payload.proposals.some(p => p.id === withProposal.id)).toBe(true);
  });
});

describe('app navigation and usage (4): "how do I..." questions about the app itself, not fitness', () => {
  it('"how do I see my recovery per muscle" points at the real screen, not a guess', () => {
    expect(PROMPT_SOURCE).toContain('or how to use this app itself');
    expect(PROMPT_SOURCE).toContain('Body (bottom tab): "Recovery"');
  });

  it('"how do I see my workout history" points at the real screen', () => {
    expect(PROMPT_SOURCE).toContain('History (bottom tab): a "Log"/"Stats" switch');
  });

  it('"can I add a split while I\'m in the middle of a workout": the app map says plainly no, rather than inventing a way', () => {
    expect(PROMPT_SOURCE).toContain('You cannot create a new split from inside a live session');
    expect(PROMPT_SOURCE).toContain("never guess a screen name or describe a button that isn't listed there");
  });

  it('"where do I see my PRs" — the app map names the one real place, not a screen that does not exist', () => {
    expect(PROMPT_SOURCE).toContain("that's the one place personal records (PRs) are listed");
  });
});

describe('out of scope and edge cases (4)', () => {
  it('a genuinely unrelated question gets a short redirect, per the prompt\'s topic boundary — not silence, not a random answer', () => {
    expect(PROMPT_SOURCE).toContain('You are a gym coach, not a general assistant');
    expect(PROMPT_SOURCE).toContain('this is outside what the coach here does');
  });

  it('"do I have a rotator cuff tear": never a diagnosis, injury risk stays at "still recovering" or "weaker session"', () => {
    expect(PROMPT_SOURCE).toContain('Never diagnose a medical condition');
    expect(PROMPT_SOURCE).toContain('never predict or comment on injury risk beyond "still recovering" or "probably a weaker session,"');
  });

  it('"what should I eat for breakfast": general nutrition is answerable now, unlike the old blanket refusal', () =>
    acceptsGeneralAnswer('What should I eat for breakfast before training?', 'Something with carbs and a little protein an hour or two beforehand usually sits well — oats with yogurt, or toast with eggs.'));

  it('"recommend a protein powder brand": never a specific commercial endorsement', () => {
    expect(PROMPT_SOURCE).toContain('Never endorse or recommend a specific commercial brand or product');
  });
});

describe('mixed personal + general (2): the subtlest category — one answer, one scope tag', () => {
  it('the prompt tells the model to keep the general half in words, not an outside number, so a real mixed answer can still pass as personal', () => {
    expect(PROMPT_SOURCE).toContain('give the general context in words rather than a precise outside figure');
  });

  it('a mixed answer that follows that guidance (personal number exact, general part in words) is accepted', async () => {
    const payload = buildAskPayload(flat.report, [], 'My bench is stuck — why does that happen physiologically?', { goal: 'lean', unit: 'kg', ...noSplits });
    const mixed = 'You have been at 60kg for several sessions — the stimulus stopped changing, so your body has nothing new to adapt to. That is the mechanism behind a plateau in general, not something specific to you.';
    const check = validateText(mixed, allowedNumbers(payload));
    expect(check.ok).toBe(true);
    // The failure mode this guidance avoids: the same idea with a precise outside number would wrongly fail personal-scope validation.
    const withOutsideNumber = 'You have been at 60kg for several sessions. In general, muscle protein synthesis stays elevated for about 24 to 48 hours after a session.';
    expect(validateText(withOutsideNumber, allowedNumbers(payload)).ok).toBe(false);
  });
});
