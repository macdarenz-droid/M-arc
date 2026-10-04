/** A3 verify ENG-07: the Finish debrief for a backfilled workout must use only earlier workouts. */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/slices/settings/reminders', () => ({ resyncReminders: vi.fn(async () => undefined) }));

import { replaceState, state } from '@/core/store';
import { freshState } from '@/core/models';
import { logPastSession } from '@/slices/workout/session';
import { postSessionInsights } from '@/brain/coach/post';
import { getSession } from '@/escobar/tools/read';
import { ctxOf } from '../../escobar/fixtures';
import { establishedProfile, session, sets } from '../../helpers';

const BENCH = 'lib_barbell_bench_press';

beforeEach(() => { vi.useFakeTimers({ now: Date.parse('2026-09-22T18:00:00'), toFake: ['Date'] }); });
afterEach(() => { vi.useRealTimers(); });

describe('ENG-07: past-session debrief', () => {
  it('a backfilled 55 kg workout between 50 kg and 60 kg keeps its record on Finish, as Escobar reports', () => {
    const early = session('2026-09-10', [{ id: BENCH, name: 'Bench', sets: sets(50, 8, 'ideal', 2) }]);
    const late = session('2026-09-20', [{ id: BENCH, name: 'Bench', sets: sets(60, 8, 'ideal', 2) }]);
    replaceState({ ...freshState(), profile: establishedProfile, sessions: [early, late] });
    // "Log a past session" → onSaved → lastFinish → FinishScreen (Train.tsx:205, 204, 1258).
    const r = logPastSession({ splitId: 'split_push', trainedAtLocal: '2026-09-15T17:00', durationMin: 60, entries: [{ exerciseId: BENCH, name: 'Bench', sets: sets(55, 8, 'ideal', 2) }] });
    expect(r).not.toBeNull();
    const s = state.value;
    // FinishScreen's own inputs, verbatim (Train.tsx:1264-1265).
    const priorSessions = s.sessions.filter(x => x.id !== r!.session.id);
    const finish = postSessionInsights({ session: r!.session, priorSessions, custom: s.customExercises, goal: s.goal, unit: s.preferences.weightUnit })
      .filter(i => i.id.startsWith('post:record')).map(i => i.title);
    const escobar = getSession({ sessionId: r!.session.id }, ctxOf(s)).notes.map(n => n.title).filter(t => /new record/.test(t));
    expect(escobar.length, 'premise: Escobar (prior-only input) sees a record').toBeGreaterThan(0);
    expect(finish, 'Finish screen compared the backfilled workout against a later one').toEqual(escobar);
  });
});
