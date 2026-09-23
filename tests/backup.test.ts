import { describe, it, expect, beforeEach } from 'vitest';
import { buildBackup, parseBackup } from '@/slices/settings/backup';
import { state } from '@/core/store';
import { freshState, type AppState } from '@/core/models';
import { exportHeart, restoreHeart, storeSeries } from '@/core/heartStore';
import { memoryStorage, setEscobarStorage } from '@/escobar/store';

function localStore(): Storage {
  const map = new Map<string, string>();
  return { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => { map.set(k, v); }, removeItem: (k: string) => { map.delete(k); }, clear: () => map.clear(), key: () => null, get length() { return map.size; } } as Storage;
}

const NOW = Date.parse('2026-09-22T12:00:00.000Z');
const session = (id: string, startedAt: string) => ({ id, splitId: 'x', splitName: 'Push', day: startedAt.slice(0, 10), startedAt, endedAt: startedAt, durationSec: 60, exercises: [{ exerciseId: 'a', name: 'A', sets: [{ kg: 50, reps: 5 }] }], logging: { mode: 'live' } });
const withSessions = (): AppState => ({ ...freshState(), sessions: [session('s1', '2026-09-20T10:00:00.000Z')] as never });

beforeEach(() => {
  (globalThis as { localStorage?: Storage }).localStorage = localStore();
  setEscobarStorage(memoryStorage());
  state.value = withSessions();
});

describe('parseBackup (R1.3)', () => {
  it('reads this version\'s backup with Escobar and heart', () => {
    storeSeries('s1', [[0, 120], [5, 130]]);
    const b = parseBackup(JSON.stringify(buildBackup(new Date(NOW))), NOW);
    expect(b).toMatchObject({ kind: 'v37', dropped: 0, exportedAt: '2026-09-22T12:00:00.000Z' });
    if (!('kind' in b) || b.kind !== 'v37') throw new Error('kind');
    expect(b.state.sessions.map(x => x.id)).toEqual(['s1']);
    expect(b.heart).toEqual({ s1: [[0, 120], [5, 130]] });
    expect(b.escobar).toEqual({ version: 1, activeId: null, conversations: [] });
  });
  it('reads a bare state', () => {
    const b = parseBackup(JSON.stringify(withSessions()), NOW);
    expect(b).toMatchObject({ kind: 'v37', dropped: 0 });
  });
  it('reads the previous app\'s data', () => {
    const legacy = { workouts: { completedExercises: [{ id: 'a', day: 'push', dayKey: '2026-09-10', name: 'Chest Press', type: 'Machine', muscle: 'Chest', sets: [{ kg: 40, reps: 8 }], finalizedAt: '2026-09-10T08:10:00.000Z' }] } };
    const b = parseBackup(JSON.stringify(legacy), NOW);
    expect('kind' in b && b.kind).toBe('legacy');
    if ('kind' in b) expect(b.state.sessions.length).toBe(1);
  });
  it('refuses garbage', () => {
    expect(parseBackup('{nope', NOW)).toEqual({ error: 'That file is not an M/ARC backup' });
    expect(parseBackup('{"state":{"version":2}}', NOW)).toEqual({ error: 'That file is not an M/ARC backup' });
    expect(parseBackup('[]', NOW)).toEqual({ error: 'That file is not an M/ARC backup' });
  });
  it('repairs a malformed session and counts what it dropped', () => {
    const s = { ...withSessions(), sessions: [{ splitId: 'x', splitName: 'P', day: '2026-09-21', startedAt: '2026-09-21T10:00:00.000Z', endedAt: '2026-09-21T10:00:00.000Z', durationSec: 1 }, 'junk'] };
    const b = parseBackup(JSON.stringify({ app: 'M/ARC', state: s }), NOW);
    if (!('kind' in b) || b.kind !== 'v37') throw new Error('kind');
    expect(b.dropped).toBe(1);
    expect(b.state.sessions).toHaveLength(1);
    expect(typeof b.state.sessions[0]!.id).toBe('string');
    expect(b.state.sessions[0]!.exercises).toEqual([]);
  });
  it('drops a live session older than 12 hours and keeps a recent one', () => {
    const active = (startedAt: string) => ({ ...withSessions(), active: { splitId: 'x', startedAt, pausedMs: 0, entries: [] } });
    const old = parseBackup(JSON.stringify(active('2026-09-21T20:00:00.000Z')), NOW);
    const recent = parseBackup(JSON.stringify(active('2026-09-22T08:00:00.000Z')), NOW);
    expect('kind' in old && old.state.active).toBeNull();
    expect('kind' in recent && recent.state.active?.startedAt).toBe('2026-09-22T08:00:00.000Z');
  });
});

describe('heart store round trip (UI-14, ST-21)', () => {
  it('restores only well-formed series', () => {
    restoreHeart({ a: [[0, 100], [5, 'x'], [10, 110]], b: 'nope' });
    expect(exportHeart()).toEqual({ a: [[0, 100], [10, 110]] });
    restoreHeart([1, 2]);
    expect(exportHeart()).toEqual({});
  });
  it('a stored value that is not an object reads as empty', () => {
    localStorage.setItem('marc.heart.v1', '[1,2,3]');
    expect(exportHeart()).toEqual({});
  });
});

import { repairState } from '@/core/store';
import { recoveryStatus } from '@/brain/recovery';
describe('sessions without a date (QA-R1-2, QA-R1-3)', () => {
  it('a restored session missing its day gets it from its start; one with neither is dropped', () => {
    const noDay = { ...session('s2', '2026-09-21T10:00:00.000Z'), day: undefined };
    const noDates = { ...session('s3', '2026-09-21T10:00:00.000Z'), day: undefined, startedAt: undefined };
    const b = parseBackup(JSON.stringify({ ...withSessions(), sessions: [session('s1', '2026-09-20T10:00:00.000Z'), noDay, noDates] }), NOW);
    if (!('kind' in b) || b.kind !== 'v37') throw new Error('kind');
    expect(b.dropped).toBe(1);
    expect(b.state.sessions.map(s => [s.id, s.day])).toEqual([['s1', '2026-09-20'], ['s2', '2026-09-21']]);
    // What Today reads must not throw on the restored state.
    expect(() => recoveryStatus({ sessions: b.state.sessions, custom: [], now: NOW, profile: b.state.profile, healthDays: [], checkIns: [], freshMarks: [], recoveryModel: b.state.recoveryModel })).not.toThrow();
  });
  it('boot repair does the same', () => {
    const out = repairState({ ...freshState(), sessions: [{ ...session('x', '2026-09-21T10:00:00.000Z'), day: 7 }] as never });
    expect(out.state.sessions[0]!.day).toBe('2026-09-21');
  });
});
