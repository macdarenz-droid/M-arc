import { describe, expect, it } from 'vitest';
import type { ComponentChildren, VNode } from 'preact';
import { readFileSync } from 'node:fs';
import type { NearMiss } from '@/brain/coach/detectors/nearmiss';
import { NearMissNote, nearMissText } from '@/slices/workout/NearMissNote';

function text(node: ComponentChildren): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(text).join('');
  return text((node as VNode).props.children);
}

const base: NearMiss = { exerciseId: 'lib_barbell_bench_press', exerciseName: 'Barbell Bench Press', sessionId: 'current', day: '2026-09-18', kind: 'reps_at_load', value: 8, standing: 8, required: 9, gap: 1, kg: 60 };

describe('near-miss finish note', () => {
  it('renders one quiet matched-best note in kg and lb without asking for another set', () => {
    expect(nearMissText(base, 'kg')).toBe('Matched your 8-rep best at 60 kg. 1 more rep would be a new rep record.');
    expect(nearMissText(base, 'lb')).toBe('Matched your 8-rep best at 132.5 lb. 1 more rep would be a new rep record.');
    const rendered = text(NearMissNote({ miss: base, unit: 'kg' }));
    expect(rendered).toContain('Close to a recordBarbell Bench PressMatched your 8-rep best at 60 kg.');
    expect(rendered).toContain('no extra set needed now');
  });

  it('formats one-below, bodyweight, heaviest and strength cases from detector fields', () => {
    expect(nearMissText({ ...base, value: 7, gap: 2 }, 'kg')).toBe('7 reps at 60 kg; previous best 8. 9 would beat it.');
    expect(nearMissText({ ...base, kind: 'best_reps', value: 7, gap: 2, kg: null }, 'lb')).toBe('7 reps; previous best 8. 9 would beat it.');
    expect(nearMissText({ ...base, kind: 'heaviest', value: 28, standing: 30, required: 32, gap: 4, kg: null }, 'kg')).toBe('Logged 28 kg; heaviest previously 30 kg. A load above 30 kg would beat it; the next normal step is 32 kg.');
    expect(nearMissText({ ...base, kind: 'strength', value: 116.4, standing: 116.7, required: 117.9, gap: 1.5, kg: null }, 'kg')).toBe('Strength estimate 116.5 kg; the next record threshold is 118 kg.');
  });

  it('derives the note only from the fresh saved session and caps it at the first ranked miss', () => {
    const source = readFileSync(new URL('../src/slices/workout/Train.tsx', import.meta.url), 'utf8');
    expect(source).toContain('fresh ? sessionNearMisses(fresh, sessions, custom)[0] ?? null : null');
    expect(source).toContain('{nearMiss && <NearMissNote miss={nearMiss} unit={unit.value} />}');
  });
});
