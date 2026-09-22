import { beforeEach, describe, expect, it } from 'vitest';
import { report } from '@/app/selectors';
import { freshState } from '@/core/models';
import { initStore, replaceState, state, update } from '@/core/store';

const memory = () => { const values = new Map<string, string>(); return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => void values.set(key, value), removeItem: (key: string) => void values.delete(key) }; };

describe('PERF01 report selector boundary', () => {
  beforeEach(() => { initStore(memory()); replaceState(freshState(new Date('2026-09-21T00:00:00.000Z'))); });

  it('reuses the expensive report across tone and Ask-thread writes, then refreshes for a real report input', () => {
    const initial = report.value;
    update(current => ({ ...current, coach: { ...current.coach, presence: { version: 1, tone: 'direct', dismissed: [] } } }));
    expect(report.value).toBe(initial);
    update(current => ({ ...current, coach: { ...current.coach, askThread: [{ role: 'user', text: 'draft context' }] } }));
    expect(report.value).toBe(initial);

    update(current => ({ ...current, sessions: [...current.sessions, { id: 's', splitId: 'x', splitName: 'X', day: '2026-09-20', startedAt: '2026-09-20T10:00:00.000Z', endedAt: '2026-09-20T10:10:00.000Z', durationSec: 600, exercises: [] }] }));
    expect(report.value).not.toBe(initial);
    expect(state.value.sessions).toHaveLength(1);
  });
});
