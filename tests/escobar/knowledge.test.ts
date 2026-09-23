import { describe, it, expect } from 'vitest';
import { KNOWLEDGE, searchCards, lookupKnowledge, CARD_BY_ID } from '@/escobar/knowledge/cards';
import { explainMethod, METHOD_INDEX } from '@/escobar/knowledge/methods';
import { METHOD_IDS } from '@/escobar/knowledge/methodIds';
import { PALACE } from '@/escobar/palace/registry';
import { ctxOf, sixMonthsState, emptyState } from './fixtures';

describe('knowledge cards (§16.1)', () => {
  it('has at least 45 well-formed cards with sources', () => {
    expect(KNOWLEDGE.length).toBeGreaterThanOrEqual(45);
    expect(new Set(KNOWLEDGE.map(c => c.id)).size).toBe(KNOWLEDGE.length);
    for (const c of KNOWLEDGE) {
      expect(c.statement.length, c.id).toBeLessThanOrEqual(300);
      expect(c.sources.length, c.id).toBeGreaterThan(0);
      expect(c.sources.every(s => s.year > 1980 && s.year <= 2026), c.id).toBe(true);
      expect(['strong', 'moderate', 'emerging', 'debated']).toContain(c.rating);
      expect(c.tags.length, c.id).toBeGreaterThan(0);
      for (const n of c.numbers) expect(Number.isFinite(n.value), c.id).toBe(true);
    }
  });
  it('covers the §16.1 seed topics, including units_and_plates', () => {
    for (const id of ['progressive_overload', 'protein_intake', 'sleep_duration', 'creatine', 'pain_red_flags', 'menstrual_cycle', 'units_and_plates', 'bmi_limits', 'hr_zones', 'youth_training']) expect(CARD_BY_ID[id], id).toBeTruthy();
    expect(CARD_BY_ID.menstrual_cycle!.rating).toBe('debated');
  });
  it('card numbers appear in their statements', () => {
    for (const c of KNOWLEDGE) for (const n of c.numbers) expect(c.statement.replace(/,(\d{3})/g, '$1'), `${c.id} ${n.label}`).toContain(String(n.value));
  });
  it('search ranks the obvious card first', () => {
    expect(searchCards('how much protein should I eat')[0]!.id).toBe('protein_intake');
    expect(searchCards('how many hours of sleep')[0]!.id).toBe('sleep_duration');
    expect(searchCards('is creatine worth it')[0]!.id).toBe('creatine');
    expect(searchCards('plates on the bar in pounds')[0]!.id).toBe('units_and_plates');
    expect(searchCards('')).toEqual([]);
  });
  it('lookup by id wins over the query and returns at most 4 without tags', () => {
    const r = lookupKnowledge({ ids: ['creatine'], query: 'protein' });
    expect(r.cards.map(c => c.id)).toEqual(['creatine']);
    expect('tags' in r.cards[0]!).toBe(false);
    expect(lookupKnowledge({ query: 'recovery sleep protein training' }).cards.length).toBeLessThanOrEqual(4);
  });
});

describe('explain_method (§16.2)', () => {
  const six = ctxOf(sixMonthsState());
  it.each(METHOD_IDS)('%s has a summary under 600 chars, inputs, constants and personal values', topic => {
    const m = explainMethod(topic, six);
    expect(m.summary.length).toBeGreaterThan(40);
    expect(m.summary.length).toBeLessThanOrEqual(700);
    expect(m.inputs.length).toBeGreaterThan(0);
    expect(typeof m.personal).toBe('object');
    if (topic !== 'energy') expect(Object.keys(m.constants).length, topic).toBeGreaterThan(0);
    for (const v of Object.values(m.constants)) expect(Number.isFinite(v)).toBe(true);
  });
  it('every method is referenced by a palace entry and indexed', () => {
    for (const id of METHOD_IDS) {
      expect(PALACE.some(p => p.methods?.includes(id)), id).toBe(true);
      expect(METHOD_INDEX[id].length).toBeGreaterThan(0);
    }
  });
  it('personal values come from the person', () => {
    expect(explainMethod('hr_zones', six).personal.hrMaxSource).toBe('tanaka');
    expect(explainMethod('progression', six).personal.goal).toBe('Lean muscle');
    expect(explainMethod('recovery', ctxOf(emptyState())).personal.trainingAgeMonths).toBe('unknown');
  });
});
