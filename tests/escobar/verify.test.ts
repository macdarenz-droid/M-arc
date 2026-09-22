import { describe, it, expect } from 'vitest';
import { parseDirectives, DirectiveBuffer, checkGrounding, safetySignals, repairInstruction } from '@/escobar/verify';
import type { Fact } from '@/escobar/types';

const fact = (id: string, value: number, label: string, unit?: string): Fact => ({ id, value, label, ...(unit ? { unit } : {}), source: { tool: 't' }, turn: 0 });

describe('directives (§14.2)', () => {
  it('keeps citations and card refs, extracts chips, drops unknown directives', () => {
    const p = parseDirectives('Bench e1RM is 102.5 kg ⟦f12⟧, protein 1.6 g/kg ⟦k:protein_intake⟧ ⟦evil: run⟧. ⟦chips: Show squat | Why amber? | Plan tomorrow | Fourth⟧');
    expect(p.citations).toEqual(['f12']);
    expect(p.cards).toEqual(['protein_intake']);
    expect(p.chips).toEqual(['Show squat', 'Why amber?', 'Plan tomorrow']);
    expect(p.text).not.toContain('evil');
    expect(p.text).not.toContain('chips');
    expect(p.plain).toBe('Bench e1RM is 102.5 kg, protein 1.6 g/kg.');
  });
  it('multiple fact ids and chips only at the very end', () => {
    expect(parseDirectives('x ⟦f1, f2⟧').citations).toEqual(['f1', 'f2']);
    expect(parseDirectives('⟦chips: a | b⟧ then more').chips).toEqual([]);
    expect(parseDirectives('long '.repeat(3) + '⟦chips: ' + 'y'.repeat(60) + '⟧').chips[0]!.length).toBe(40);
  });
  it('the stream buffer never shows half a directive', () => {
    const b = new DirectiveBuffer();
    expect(b.push('Up 5% ⟦f')).toBe('Up 5%');
    expect(b.push('12')).toBe('Up 5%');
    expect(b.push('⟧ nice')).toBe('Up 5% ⟦f12⟧ nice');
  });
});

describe('grounding (§14.3)', () => {
  const ledger = [fact('f1', 102.456, 'bench e1RM', 'kg'), fact('f2', 62, 'quads recovery', '%'), fact('f3', 20.412, 'bar', 'kg'), fact('k1', 1.6, 'k:protein_intake numbers protein low'), fact('k2', 2.2, 'k:protein_intake numbers protein high')];
  const g = (answer: string, userTexts: string[] = []) => checkGrounding({ answer, ledger, userTexts });
  it('accepts exact and rounded ledger values (0 and 1 decimals)', () => {
    expect(g('Your bench estimate is 102.5 kg ⟦f1⟧ and quads are at 62% ⟦f2⟧.').ok).toBe(true);
    expect(g('About 102 kg.').ok).toBe(true);
  });
  it('flags invented numbers with their sentences', () => {
    const r = g('Bench is 102.5 kg ⟦f1⟧. You could hit 142.5 kg by spring.');
    expect(r.ok).toBe(false);
    expect(r.ungrounded).toEqual([142.5]);
    expect(r.sentences).toEqual(['You could hit 142.5 kg by spring.']);
  });
  it('lb within 1 lb of a converted kg fact is grounded', () => {
    expect(g('That bar is 45 lb.').ok).toBe(true);
    expect(g('Bench is about 226 lb.').ok).toBe(true);
    expect(g('Bench is about 240 lb.').ok).toBe(false);
  });
  it('small counts, set×rep notation, dates, times and quoted user text are allowed', () => {
    expect(g('Do 3 sets of 8, so 3x8 or 4×10, on 2026-09-17 at 07:30, or 17 Sep. You said "I bench 140".').ok).toBe(true);
  });
  it('checks both ends of a range', () => {
    expect(g('Aim for 62–102 kg.').ok).toBe(true);
    expect(g('Aim for 62–150 kg.').ungrounded).toEqual([150]);
  });
  it('a knowledge card citation grounds that card’s numbers in the same sentence only', () => {
    expect(g('Most people do well on 1.6 to 2.2 g/kg ⟦k:protein_intake⟧.').ok).toBe(true);
    expect(g('Most people do well on 1.6 to 2.2 g/kg.').ok).toBe(true); // values are also plain ledger facts
    expect(checkGrounding({ answer: 'Eat 1.6 g/kg.', ledger: [] }).ok).toBe(false);
  });
  it('numbers from the person’s own messages are allowed', () => {
    expect(g('Since you weigh 83 kg, keep going.', ['I weigh 83 kg now']).ok).toBe(true);
  });
  it('repair instruction lists the numbers', () => {
    expect(repairInstruction([142.5, 18])).toBe('These numbers are not from your tools, cards or the brief: 142.5, 18. Recompute them with tools or remove them, then restate the answer.');
  });
});

describe('safety pre-screen (§19)', () => {
  it.each([
    ['I want to kill myself', 'crisis'],
    ['some days I feel like I want to die', 'crisis'],
    ['I got chest pain on the treadmill', 'medical'],
    ['felt dizzy after squats', 'medical'],
    ['sharp pain in my shoulder when I press', 'pain_mentioned'],
    ['my fingers go numb on rows', 'pain_mentioned'],
    ['I want to lose 10 kg in a week', 'disordered_eating'],
    ['I have been eating 500 calories a day', 'disordered_eating'],
  ])('%s → %s', (text, signal) => expect(safetySignals(text)).toContain(signal));
  it('ordinary questions carry no signal', () => {
    expect(safetySignals('Why is my readiness amber?')).toEqual([]);
    expect(safetySignals('Build me a 4-day programme')).toEqual([]);
  });
});
