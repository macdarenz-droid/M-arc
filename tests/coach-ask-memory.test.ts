import { describe, it, expect } from 'vitest';
import { appendAskTurn, clearAskThread, clearStatedConstraints, mergeStatedConstraints, updateAskTurn } from '@/slices/coach/askMemory';
import { emptyCoach, MAX_ASK_THREAD_TURNS, MAX_STATED_CONSTRAINT_CHARS, MAX_STATED_CONSTRAINTS, type AskThreadTurn } from '@/core/models';

const userTurn = (text: string): AskThreadTurn => ({ role: 'user', text });
const assistantTurn = (text: string): AskThreadTurn => ({ role: 'assistant', text, scope: 'general', category: 'general', concern: null });

describe('appendAskTurn', () => {
  it('appends a turn to an empty thread', () => {
    const coach = appendAskTurn(emptyCoach(), userTurn('hi'));
    expect(coach.askThread).toEqual([userTurn('hi')]);
  });

  it('keeps the conversation in order across several turns', () => {
    let coach = emptyCoach();
    coach = appendAskTurn(coach, userTurn('one'));
    coach = appendAskTurn(coach, assistantTurn('two'));
    coach = appendAskTurn(coach, userTurn('three'));
    expect(coach.askThread.map(t => t.text)).toEqual(['one', 'two', 'three']);
  });

  it('drops the oldest turn once past MAX_ASK_THREAD_TURNS, keeping the thread bounded', () => {
    let coach = emptyCoach();
    for (let i = 0; i < MAX_ASK_THREAD_TURNS + 5; i++) coach = appendAskTurn(coach, userTurn(`turn ${i}`));
    expect(coach.askThread).toHaveLength(MAX_ASK_THREAD_TURNS);
    expect(coach.askThread[0]!.text).toBe('turn 5'); // the first 5 rolled off
    expect(coach.askThread.at(-1)!.text).toBe(`turn ${MAX_ASK_THREAD_TURNS + 4}`);
  });
});

describe('updateAskTurn', () => {
  it('patches only the turn at the given index, leaving the rest untouched', () => {
    let coach = emptyCoach();
    coach = appendAskTurn(coach, userTurn('question'));
    coach = appendAskTurn(coach, { ...assistantTurn('answer'), drafts: [{ action: 'create', splitId: null, name: 'Push', focus: [], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }] }], applied: [false] });
    coach = updateAskTurn(coach, 1, { applied: [true] });
    expect(coach.askThread[0]!.text).toBe('question'); // untouched
    expect(coach.askThread[1]!.applied).toEqual([true]);
    expect(coach.askThread[1]!.text).toBe('answer'); // rest of the patched turn preserved
  });
});

describe('clearAskThread', () => {
  it('empties the thread — the person\'s own "start over" action', () => {
    let coach = emptyCoach();
    coach = appendAskTurn(coach, userTurn('hi'));
    coach = clearAskThread(coach);
    expect(coach.askThread).toEqual([]);
  });
});

describe('mergeStatedConstraints', () => {
  it('adds a new constraint to an empty list', () => {
    const coach = mergeStatedConstraints(emptyCoach(), ['Avoid curls — elbow discomfort.']);
    expect(coach.statedConstraints).toEqual(['Avoid curls — elbow discomfort.']);
  });

  it('is a no-op — returns the same coach reference — when there is nothing real to add', () => {
    const coach = emptyCoach();
    expect(mergeStatedConstraints(coach, [])).toBe(coach);
    expect(mergeStatedConstraints(coach, ['   '])).toBe(coach);
  });

  it('trims and length-caps each constraint before storing it', () => {
    const long = 'x'.repeat(200);
    const coach = mergeStatedConstraints(emptyCoach(), [`  ${long}  `]);
    expect(coach.statedConstraints[0]).toBe(long.slice(0, MAX_STATED_CONSTRAINT_CHARS));
  });

  it('bumps an exact-string duplicate to most-recent rather than storing it twice', () => {
    let coach = mergeStatedConstraints(emptyCoach(), ['Avoid curls.', 'Only has dumbbells.']);
    coach = mergeStatedConstraints(coach, ['Avoid curls.']);
    expect(coach.statedConstraints).toEqual(['Only has dumbbells.', 'Avoid curls.']);
  });

  it('drops the oldest constraint once past MAX_STATED_CONSTRAINTS', () => {
    let coach = emptyCoach();
    for (let i = 0; i < MAX_STATED_CONSTRAINTS + 3; i++) coach = mergeStatedConstraints(coach, [`fact ${i}`]);
    expect(coach.statedConstraints).toHaveLength(MAX_STATED_CONSTRAINTS);
    expect(coach.statedConstraints[0]).toBe('fact 3');
    expect(coach.statedConstraints.at(-1)).toBe(`fact ${MAX_STATED_CONSTRAINTS + 2}`);
  });
});

describe('clearStatedConstraints', () => {
  it('empties the list — the person\'s own "forget what I told you" action', () => {
    let coach = mergeStatedConstraints(emptyCoach(), ['Avoid curls.']);
    coach = clearStatedConstraints(coach);
    expect(coach.statedConstraints).toEqual([]);
  });
});
