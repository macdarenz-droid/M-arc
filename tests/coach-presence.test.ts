import { describe, it, expect } from 'vitest';
import { loadState, STATE_KEY } from '@/core/store';
import { freshState, MAX_PRESENCE_DISMISSALS } from '@/core/models';

function mockStorage() {
  const store = new Map<string, string>();
  return { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k), store };
}

describe('D01: coach.presence loads with safe defaults', () => {
  it('a save from before this field existed loads with presence absent, not a crash or an invented value', () => {
    const storage = mockStorage();
    const legacy = freshState();
    // Simulate a pre-P01 save: no `presence` key at all on coach.
    const raw = JSON.parse(JSON.stringify(legacy));
    delete raw.coach.presence;
    storage.setItem(STATE_KEY, JSON.stringify(raw));
    const { state } = loadState(storage);
    expect(state.coach.presence).toBeUndefined();
    // The rest of the coach state, sessions, splits, etc. are untouched.
    expect(state.sessions).toEqual(legacy.sessions);
    expect(state.splits).toEqual(legacy.splits);
  });

  it('a fresh install has no presence object either', () => {
    expect(freshState().coach.presence).toBeUndefined();
  });
});

describe('D02: presence round-trips through export/import (JSON) unchanged', () => {
  it('a valid presence object with dismissals survives a save/reload cycle exactly', () => {
    const storage = mockStorage();
    const withPresence = freshState();
    withPresence.coach.presence = {
      version: 1, tone: 'direct',
      dismissed: [
        { id: 'insight:plateau:lib_barbell_bench_press', evidenceKey: 'abc123', dismissedAt: '2026-09-20T08:00:00.000Z' },
        { id: 'suggestion:load_next:lib_barbell_bench_press', evidenceKey: 'def456', dismissedAt: '2026-09-21T08:00:00.000Z' },
      ],
    };
    storage.setItem(STATE_KEY, JSON.stringify(withPresence));
    const { state } = loadState(storage);
    expect(state.coach.presence).toEqual(withPresence.coach.presence);
    // Logs/sessions untouched by the round-trip.
    expect(state.sessions).toEqual(withPresence.sessions);
  });

  it('an active workout survives alongside a presence round-trip', () => {
    const storage = mockStorage();
    const base = freshState();
    base.coach.presence = { version: 1, tone: 'steady', dismissed: [] };
    base.active = { splitId: 'split_push', startedAt: '2026-09-21T07:00:00.000Z', entries: [] } as never;
    storage.setItem(STATE_KEY, JSON.stringify(base));
    const { state } = loadState(storage);
    expect(state.coach.presence).toEqual(base.coach.presence);
    expect(state.active).not.toBeNull();
  });
});

describe('D03: malformed presence drops only that field, never history', () => {
  const wholeObjectCases: Array<[string, unknown]> = [
    ['not an object', 'garbage'],
    ['wrong version', { version: 2, tone: 'steady', dismissed: [] }],
    ['invalid tone', { version: 1, tone: 'aggressive', dismissed: [] }],
    ['dismissed not an array', { version: 1, tone: 'steady', dismissed: 'nope' }],
  ];

  it.each(wholeObjectCases)('drops the whole presence object for %s, never touching sessions or splits', (_label, badPresence) => {
    const storage = mockStorage();
    const base = freshState();
    base.sessions = [{ id: 's1', day: 'push', date: '2026-09-20', splitId: 'split_push', splitName: 'Push', exercises: [], durationSec: 1800 } as never];
    (base.coach as unknown as Record<string, unknown>).presence = badPresence;
    storage.setItem(STATE_KEY, JSON.stringify(base));
    const { state } = loadState(storage);
    expect(state.coach.presence).toBeUndefined();
    expect(state.sessions).toHaveLength(1);
    expect(state.sessions[0]!.id).toBe('s1');
  });

  const entryLevelCases: Array<[string, unknown]> = [
    ['a dismissal missing evidenceKey', { id: 'x', dismissedAt: '2026-09-21T00:00:00.000Z' }],
    ['a dismissal with a bad timestamp', { id: 'x', evidenceKey: 'y', dismissedAt: 'not-a-date' }],
  ];

  it.each(entryLevelCases)('drops just the bad entry for %s, keeping the rest of presence and all history', (_label, badDismissal) => {
    const storage = mockStorage();
    const base = freshState();
    base.sessions = [{ id: 's1', day: 'push', date: '2026-09-20', splitId: 'split_push', splitName: 'Push', exercises: [], durationSec: 1800 } as never];
    base.coach.presence = { version: 1, tone: 'direct', dismissed: [badDismissal as never] };
    storage.setItem(STATE_KEY, JSON.stringify(base));
    const { state } = loadState(storage);
    expect(state.coach.presence).toEqual({ version: 1, tone: 'direct', dismissed: [] });
    expect(state.sessions).toHaveLength(1);
    expect(state.sessions[0]!.id).toBe('s1');
  });

  it('a mix of valid and invalid dismissal entries keeps only the valid ones', () => {
    const storage = mockStorage();
    const base = freshState();
    (base.coach as unknown as Record<string, unknown>).presence = {
      version: 1, tone: 'steady',
      dismissed: [
        { id: 'ok', evidenceKey: 'k1', dismissedAt: '2026-09-21T00:00:00.000Z' },
        { id: 'bad', evidenceKey: 123, dismissedAt: '2026-09-21T00:00:00.000Z' },
        'not-even-an-object',
      ],
    };
    storage.setItem(STATE_KEY, JSON.stringify(base));
    const { state } = loadState(storage);
    expect(state.coach.presence?.dismissed).toEqual([{ id: 'ok', evidenceKey: 'k1', dismissedAt: '2026-09-21T00:00:00.000Z' }]);
  });

  it('dismissals beyond the cap keep only the newest, oldest dropped first', () => {
    const storage = mockStorage();
    const base = freshState();
    const dismissed = Array.from({ length: MAX_PRESENCE_DISMISSALS + 10 }, (_, i) => ({
      id: `id_${i}`, evidenceKey: `key_${i}`,
      dismissedAt: new Date(2026, 0, 1 + i).toISOString(),
    }));
    base.coach.presence = { version: 1, tone: 'steady', dismissed };
    storage.setItem(STATE_KEY, JSON.stringify(base));
    const { state } = loadState(storage);
    expect(state.coach.presence?.dismissed).toHaveLength(MAX_PRESENCE_DISMISSALS);
    expect(state.coach.presence?.dismissed[0]!.id).toBe('id_10'); // oldest 10 dropped
    expect(state.coach.presence?.dismissed.at(-1)!.id).toBe(`id_${MAX_PRESENCE_DISMISSALS + 9}`);
  });
});
