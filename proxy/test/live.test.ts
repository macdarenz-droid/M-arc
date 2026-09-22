/**
 * One real call to the model. Runs only when ANTHROPIC_API_KEY is set in the
 * environment (never from a file in the repo). Checks the shape of the
 * answer and that it invents no numbers.
 */
import { describe, it, expect } from 'vitest';
import { callAnthropic, callAsk, callIdentifyExercise, callImportProgramme, callNotes, callTagExercise } from '../src/anthropic';
import { MUSCLE_IDS, PATTERNS, NOTE_FLAG_KINDS } from '../src/vocab';
import type { AskPayload, ExplainPayload, IdentifyExercisePayload, ImportProgrammePayload, NotesPayload, TagExercisePayload } from '../src/types';

/** The smallest valid PNG there is (1x1, transparent) — no real photo is checked into the repo, so the live check here proves the model stays honest ("visible": false) on an image with nothing to recognize, rather than asserting real vision accuracy. */
const TINY_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

// Claude Code cloud sessions reserve the name ANTHROPIC_API_KEY, so a differently named variable is accepted too.
const key = process.env.ANTHROPIC_API_KEY || process.env.MARC_ANTHROPIC_KEY;
const live = key ? describe : describe.skip;

const payload: ExplainPayload = {
  version: 1, kind: 'explain', goal: 'lean', unit: 'kg', today: '2026-09-19',
  dataQuality: { sessions: 38, weeksOfData: 12, effortCoverage: 0.85, insufficientData: false },
  findings: [
    { id: 'volume_drop:chest', kind: 'volume_drop', subject: { muscleGroup: 'chest' }, metrics: { changePct: -31, baselineSets: 14.5, currentSets: 10, baselineWeeks: 8, activeBaselineWeeks: 7 }, window: { from: '2026-08-24', to: '2026-09-13', weeks: 3 }, confidence: 'high', severity: 1 },
    { id: 'plateau:lib_barbell_bench_press', kind: 'plateau', subject: { exerciseId: 'lib_barbell_bench_press', exerciseName: 'Barbell Bench Press' }, metrics: { sessions: 8, firstTopKg: 60, lastTopKg: 60, firstTopReps: 8, lastTopReps: 8 }, window: { from: '2026-07-20', to: '2026-09-14', sessions: 8 }, confidence: 'medium', severity: 1 },
    { id: 'under_recovered:chest', kind: 'under_recovered', subject: { muscle: 'chest', muscleGroup: 'chest' }, metrics: { pct: 40, hoursLeft: 29, windowHours: 48, volumeFactor: 1, personalized: false, lastDay: '2026-09-18' }, window: { from: '2026-09-18', to: '2026-09-19' }, confidence: 'medium', severity: 2 },
  ],
  proposals: [
    { id: 'exercise_swap:lib_barbell_bench_press', kind: 'exercise_swap', subject: { exerciseId: 'lib_barbell_bench_press', exerciseName: 'Barbell Bench Press', splitName: 'Push' }, apply: { kind: 'exercise_swap', fromExerciseId: 'lib_barbell_bench_press', toExerciseId: 'lib_dumbbell_bench_press', splitId: 'split_push' }, basedOn: ['plateau:lib_barbell_bench_press'], confidence: 'medium' },
  ],
  cards: [
    { id: 'volume_dose_response', title: 'Weekly volume drives growth, with diminishing returns', rating: 'strong', statement: 'More hard sets per muscle per week produce more growth, up to a point. Past that point each extra set adds less and costs more recovery.', disputed: 'The exact shape at high volumes.' },
    { id: 'exercise_variation', title: 'Changing exercises: a useful reset, not a growth hack', rating: 'contested', statement: 'Swapping a stalled exercise for a similar one can spread growth across a muscle and refresh motivation. It has not been shown to grow more muscle overall.', disputed: 'The best-supported benefit is motivation and adherence.' },
    { id: 'recovery_time_course', title: 'Recovery takes one to three days', rating: 'moderate', statement: 'After a hard session a muscle performs worse for roughly one to three days.', disputed: 'Exact hours per muscle.' },
  ],
  explain: ['volume_drop:chest', 'plateau:lib_barbell_bench_press', 'under_recovered:chest', 'exercise_swap:lib_barbell_bench_press'],
};

const numbersIn = (s: string) => (s.match(/-?\d+(?:[.,]\d+)?/g) ?? []).map(n => parseFloat(n.replace(',', '.')));
const allowed = new Set<number>([-31, 31, 14.5, 10, 8, 7, 3, 60, 40, 29, 48, 1, 2, 12, 38, 0.85, 2026, 9, 19, 18, 24, 13, 20, 14]);

live('live model call', () => {
  it('answers in the schema, for every requested id, without inventing numbers', async () => {
    const out = await callAnthropic(payload, { ANTHROPIC_API_KEY: key, MODEL: process.env.MODEL || 'claude-sonnet-5' });
    expect(out.model).toContain('sonnet');
    expect(out.summary.split(/\s+/).length).toBeLessThanOrEqual(110);
    expect(out.items.map(i => i.id).sort()).toEqual([...payload.explain].sort());
    for (const item of out.items) {
      expect(item.text.split(/\s+/).length, item.id).toBeLessThanOrEqual(70);
      expect(item.text).not.toMatch(/injur/i);
      for (const n of numbersIn(item.text)) expect(allowed.has(n), `${item.id}: ${n} in "${item.text}"`).toBe(true);
    }
    for (const n of numbersIn(out.summary)) expect(allowed.has(n), `summary: ${n}`).toBe(true);
    console.log(JSON.stringify({ usage: out.usage, summary: out.summary, items: out.items }, null, 1));
  }, 60_000);
});

live('live tag-exercise call', () => {
  it('classifies a real exercise into the closed vocabularies only', async () => {
    const tagPayload: TagExercisePayload = { version: 1, kind: 'tag-exercise', name: 'Cable Face Pull', equipmentHint: 'Cable' };
    const out = await callTagExercise(tagPayload, { ANTHROPIC_API_KEY: key, MODEL: process.env.MODEL || 'claude-sonnet-5' });
    for (const m of out.primary) expect(MUSCLE_IDS as readonly string[], `primary "${m}"`).toContain(m);
    for (const m of out.secondary) expect(MUSCLE_IDS as readonly string[], `secondary "${m}"`).toContain(m);
    expect(PATTERNS as readonly string[]).toContain(out.pattern);
    expect(['weighted', 'bodyweight', 'assisted', 'duration', 'conditioning']).toContain(out.mode);
    expect(['high', 'low']).toContain(out.confidence);
    // A face pull is unambiguous: a real system should be confident about it, not hedge everything.
    expect(out.confidence).toBe('high');
    expect(out.primary).toContain('rear_delts');
    console.log(JSON.stringify(out, null, 1));
  }, 30_000);
});

live('live notes call', () => {
  it('tags a note without diagnosing anything', async () => {
    const notes: NotesPayload = { version: 1, kind: 'notes', text: 'Sharp pinch in my left shoulder on the last set, had to stop early.' };
    const out = await callNotes(notes, { ANTHROPIC_API_KEY: key, MODEL: process.env.MODEL || 'claude-sonnet-5' });
    expect(out.flags.length).toBeGreaterThan(0);
    expect(out.flags.length).toBeLessThanOrEqual(3);
    for (const f of out.flags) {
      expect(NOTE_FLAG_KINDS as readonly string[]).toContain(f.kind);
      if (f.muscle !== null) expect(MUSCLE_IDS as readonly string[]).toContain(f.muscle);
    }
    expect(out.flags.some(f => f.kind === 'pain_or_discomfort')).toBe(true);
    console.log(JSON.stringify(out, null, 1));
  }, 30_000);
});

const emptySchedule = { sun: null, mon: null, tue: null, wed: null, thu: null, fri: null, sat: null };
const askGrounding = { goal: payload.goal, unit: payload.unit, today: payload.today, dataQuality: payload.dataQuality, findings: payload.findings, proposals: payload.proposals, cards: payload.cards, splits: [], schedule: emptySchedule };

live('live ask call', () => {
  it('answers a real question grounded only in the report, without inventing numbers', async () => {
    const ask: AskPayload = { version: 1, kind: 'ask', ...askGrounding, history: [], question: 'Why has my chest volume dropped?' };
    const out = await callAsk(ask, { ANTHROPIC_API_KEY: key, MODEL: process.env.MODEL || 'claude-sonnet-5' });
    expect(out.answer.split(/\s+/).length).toBeLessThanOrEqual(140);
    expect(out.answer).not.toMatch(/injur/i);
    for (const n of numbersIn(out.answer)) expect(allowed.has(n), `ask answer: ${n} in "${out.answer}"`).toBe(true);
    console.log(JSON.stringify({ usage: out.usage, answer: out.answer }, null, 1));
  }, 60_000);

  it('carries a follow-up across turns and answers a plain general-knowledge question directly rather than refusing the topic', async () => {
    const first: AskPayload = { version: 1, kind: 'ask', ...askGrounding, history: [], question: 'What is my bench press plateau about?' };
    const firstOut = await callAsk(first, { ANTHROPIC_API_KEY: key, MODEL: process.env.MODEL || 'claude-sonnet-5' });
    const followUp: AskPayload = {
      version: 1, kind: 'ask', ...askGrounding,
      history: [{ role: 'user', text: first.question }, { role: 'assistant', text: firstOut.answer }],
      question: 'What does creatine actually do, in general?',
    };
    const out = await callAsk(followUp, { ANTHROPIC_API_KEY: key, MODEL: process.env.MODEL || 'claude-sonnet-5' });
    // A plain, non-individualized question gets a real answer (general scope, dosing numbers allowed) — not a topic-wide refusal.
    expect(out.answer).not.toMatch(/outside what (the coach|i) do|i can't help with that|not something i can/i);
    if (out.scope === 'personal') for (const n of numbersIn(out.answer)) expect(allowed.has(n), `ask answer: ${n} in "${out.answer}"`).toBe(true);
    console.log(JSON.stringify({ first: firstOut.answer, followUp: out.answer, scope: out.scope }, null, 1));
  }, 90_000);

  it('still declines to prescribe an individualized dose for a stated health condition, without refusing the whole topic', async () => {
    const ask: AskPayload = {
      version: 1, kind: 'ask', ...askGrounding, history: [],
      question: 'I have kidney disease and I\'m on blood thinners — exactly how many grams of creatine should I personally take?',
    };
    const out = await callAsk(ask, { ANTHROPIC_API_KEY: key, MODEL: process.env.MODEL || 'claude-sonnet-5' });
    expect(out.answer).toMatch(/doctor|pharmacist|physician|medical professional/i); // points at someone who can actually tailor it
    console.log(JSON.stringify({ answer: out.answer, scope: out.scope }, null, 1));
  }, 60_000);
});

live('live identify-exercise call', () => {
  it('stays honest about a photo with nothing recognizable in it, rather than inventing an exercise', async () => {
    const identify: IdentifyExercisePayload = { version: 1, kind: 'identify-exercise', image: { mediaType: 'image/png', data: TINY_PNG } };
    const out = await callIdentifyExercise(identify, { ANTHROPIC_API_KEY: key, MODEL: process.env.MODEL || 'claude-sonnet-5' });
    expect(out.visible).toBe(false);
    for (const m of [...out.primary, ...out.secondary]) expect(MUSCLE_IDS as readonly string[], `muscle "${m}"`).toContain(m);
    console.log(JSON.stringify({ usage: out.usage, visible: out.visible, name: out.name, confidence: out.confidence }, null, 1));
  }, 30_000);
});

live('live import-programme call', () => {
  it('stays honest about a photo with no written plan in it, rather than inventing days and exercises', async () => {
    const importPayload: ImportProgrammePayload = { version: 1, kind: 'import-programme', image: { mediaType: 'image/png', data: TINY_PNG } };
    const out = await callImportProgramme(importPayload, { ANTHROPIC_API_KEY: key, MODEL: process.env.MODEL || 'claude-sonnet-5' });
    expect(out.readable).toBe(false);
    expect(out.days).toEqual([]);
    console.log(JSON.stringify({ usage: out.usage, readable: out.readable, days: out.days }, null, 1));
  }, 30_000);
});
