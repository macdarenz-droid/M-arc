import { describe, it, expect } from 'vitest';
import { buildSplitPayload, requestSplitBuilderAnswer, MAX_SPLIT_MESSAGE_CHARS, MAX_SPLIT_HISTORY_TURNS, type SplitBuilderTurn } from '@/ai/splitBuilder';
import type { Exercise, Split } from '@/core/models';

const reply = (status: number, body: unknown): typeof fetch => async () => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const PUSH: Split = { id: 'split_push', name: 'Push', color: '#4d9dff', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }], createdAt: '2026-01-01T00:00:00.000Z' };

describe('buildSplitPayload', () => {
  it('carries the goal, unit, known splits (with real exercise names resolved) and the trimmed message', () => {
    const p = buildSplitPayload([PUSH], [], [], 'Add a shoulder exercise', { goal: 'lean', unit: 'kg' });
    expect(p.version).toBe(1);
    expect(p.kind).toBe('build-split');
    expect(p.goal).toBe('lean');
    expect(p.splits).toEqual([{ id: 'split_push', name: 'Push', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Barbell Bench Press', sets: 3 }] }]);
    expect(p.message).toBe('Add a shoulder exercise');
  });

  it('resolves a custom exercise\'s real name too, not just the library\'s', () => {
    const custom: Exercise = { id: 'custom_1', name: 'Garage Landmine Press', equipment: 'Barbell', primary: ['front_delts'], secondary: [], stabilizers: [], aliases: [], pattern: 'shoulder_flexion', defaultSets: 3, mode: 'weighted', custom: true };
    const split: Split = { ...PUSH, exercises: [{ exerciseId: 'custom_1', sets: 3 }] };
    const p = buildSplitPayload([split], [custom], [], 'ok', { goal: 'lean', unit: 'kg' });
    expect(p.splits[0]!.exercises[0]).toEqual({ exerciseId: 'custom_1', name: 'Garage Landmine Press', sets: 3 });
  });

  it('caps the message length and the number of history turns kept', () => {
    const long = 'x'.repeat(MAX_SPLIT_MESSAGE_CHARS + 50);
    expect(buildSplitPayload([], [], [], long, { goal: 'lean', unit: 'kg' }).message).toHaveLength(MAX_SPLIT_MESSAGE_CHARS);
    const history: SplitBuilderTurn[] = Array.from({ length: MAX_SPLIT_HISTORY_TURNS + 5 }, (_, i) => ({ role: i % 2 === 0 ? 'user' : 'assistant', text: `turn ${i}` }));
    const p = buildSplitPayload([], [], history, 'ok', { goal: 'lean', unit: 'kg' });
    expect(p.history).toHaveLength(MAX_SPLIT_HISTORY_TURNS);
    expect(p.history.at(-1)!.text).toBe(`turn ${history.length - 1}`);
  });
});

describe('requestSplitBuilderAnswer', () => {
  const payload = () => buildSplitPayload([PUSH], [], [], 'Add a shoulder exercise to Push', { goal: 'lean', unit: 'kg' });

  it('refuses locally on an empty message, never spending a call', async () => {
    const empty = buildSplitPayload([PUSH], [], [], '   ', { goal: 'lean', unit: 'kg' });
    const r = await requestSplitBuilderAnswer(empty, [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: () => { throw new Error('must not be called'); } });
    expect(r).toEqual({ ok: false, error: 'Type a message first.' });
  });

  it('accepts a real, catalog-only draft that modifies the named existing split', async () => {
    const fetchImpl = reply(200, {
      answer: 'Added Face Pull for rear-delt balance.',
      splitDrafts: [{ action: 'modify', splitId: 'split_push', name: 'Push', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }, { exerciseId: 'lib_face_pull', sets: 3 }] }],
    });
    const r = await requestSplitBuilderAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.answer).toBe('Added Face Pull for rear-delt balance.');
    expect(r.drafts).toEqual([{ action: 'modify', splitId: 'split_push', name: 'Push', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }, { exerciseId: 'lib_face_pull', sets: 3 }] }]);
  });

  it('an empty splitDrafts list (still clarifying) is a normal, successful answer', async () => {
    const fetchImpl = reply(200, { answer: 'Which muscles do you want this split to focus on?', splitDrafts: [] });
    const r = await requestSplitBuilderAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: true, answer: 'Which muscles do you want this split to focus on?', drafts: [] });
  });

  it('one message describing two splits at once gets back a draft for each, independently applicable', async () => {
    const fetchImpl = reply(200, {
      answer: 'Here are both — Push and Pull.',
      splitDrafts: [
        { action: 'create', splitId: null, name: 'Push', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] },
        { action: 'create', splitId: null, name: 'Pull', focus: ['lats'], exercises: [{ exerciseId: 'lib_lat_pulldown', sets: 3 }] },
      ],
    });
    const r = await requestSplitBuilderAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.drafts.map(d => d.name)).toEqual(['Push', 'Pull']);
  });

  it('when one of several drafts fails validation, the rest still come through — not all-or-nothing', async () => {
    const fetchImpl = reply(200, {
      answer: 'ok',
      splitDrafts: [
        { action: 'create', splitId: null, name: 'Push', focus: [], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] },
        { action: 'create', splitId: null, name: 'Empty', focus: [], exercises: [{ exerciseId: 'not_real', sets: 3 }] },
      ],
    });
    const r = await requestSplitBuilderAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.drafts.map(d => d.name)).toEqual(['Push']);
  });

  it('drops an exercise id the app does not recognize rather than showing it as real, and keeps the rest', async () => {
    const fetchImpl = reply(200, {
      answer: 'ok',
      splitDrafts: [{ action: 'modify', splitId: 'split_push', name: 'Push', focus: ['chest'], exercises: [{ exerciseId: 'lib_face_pull', sets: 3 }, { exerciseId: 'lib_totally_made_up_exercise', sets: 3 }] }],
    });
    const r = await requestSplitBuilderAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.drafts[0]!.exercises).toEqual([{ exerciseId: 'lib_face_pull', sets: 3 }]);
  });

  it('a draft left with no recognizable exercises at all is not shown as actionable', async () => {
    const fetchImpl = reply(200, { answer: 'ok', splitDrafts: [{ action: 'modify', splitId: 'split_push', name: 'Push', focus: [], exercises: [{ exerciseId: 'not_real', sets: 3 }] }] });
    const r = await requestSplitBuilderAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toMatchObject({ ok: true, drafts: [] });
  });

  it('a "modify" naming a split id that is not one this payload actually sent is not applied', async () => {
    const fetchImpl = reply(200, { answer: 'ok', splitDrafts: [{ action: 'modify', splitId: 'split_legs_not_sent', name: 'Push', focus: [], exercises: [{ exerciseId: 'lib_face_pull', sets: 3 }] }] });
    const r = await requestSplitBuilderAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toMatchObject({ ok: true, drafts: [] });
  });

  it('an invalid focus muscle id is dropped, real ones kept, capped at 2', async () => {
    const fetchImpl = reply(200, { answer: 'ok', splitDrafts: [{ action: 'create', splitId: null, name: 'Arms', focus: ['biceps', 'not_a_muscle', 'triceps', 'forearms'], exercises: [{ exerciseId: 'lib_hammer_curl', sets: 3 }] }] });
    const r = await requestSplitBuilderAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.drafts[0]!.focus).toEqual(['biceps', 'triceps']);
  });

  it('sets outside 1-6 are clamped, not rejected outright', async () => {
    const fetchImpl = reply(200, { answer: 'ok', splitDrafts: [{ action: 'create', splitId: null, name: 'Legs', focus: [], exercises: [{ exerciseId: 'lib_leg_press', sets: 20 }, { exerciseId: 'lib_leg_extension', sets: 0 }] }] });
    const r = await requestSplitBuilderAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.drafts[0]!.exercises).toEqual([{ exerciseId: 'lib_leg_press', sets: 6 }, { exerciseId: 'lib_leg_extension', sets: 1 }]);
  });

  it('rejects an unreadable reply rather than showing something empty', async () => {
    const fetchImpl = reply(200, { nothing: true });
    const r = await requestSplitBuilderAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl });
    expect(r).toEqual({ ok: false, error: 'The coach sent back something we could not read.' });
  });

  it('surfaces proxy errors in plain words', async () => {
    const r = await requestSplitBuilderAnswer(payload(), [], { url: 'https://proxy.example', deviceId: 'dev_test', fetchImpl: reply(429, { error: 'Too many requests. Wait a minute.' }) });
    expect(r).toEqual({ ok: false, error: 'Too many requests. Wait a minute.' });
  });
});
