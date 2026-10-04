/** A3 verify ENG-06: the usual-duration baseline must come from trusted timing only. */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/slices/settings/reminders', () => ({ resyncReminders: vi.fn(async () => undefined) }));

import { replaceState, state } from '@/core/store';
import { freshState } from '@/core/models';
import { logPastSession } from '@/slices/workout/session';
import { postSessionInsights } from '@/brain/coach/post';
import { liveSessionLogging } from '@/brain/fidelity';
import type { Session } from '@/core/models';
import { session, sets } from './helpers';

const BENCH = 'lib_barbell_bench_press';

/** A finished live session whose 6 sets were all committed within one minute: the compressed case. */
function compressed(day: string): Session {
  const startedAt = `${day}T17:00:00.000Z`;
  const endedAt = `${day}T17:01:00.000Z`;
  const t0 = Date.parse(startedAt);
  const logging = liveSessionLogging({
    setFidelities: Array(6).fill('live'), startedAt, endedAt, loggedDurationSec: 60, workingSetCount: 6,
    commitMs: Array.from({ length: 6 }, (_, i) => t0 + i * 10_000),
  });
  return { ...session(day, [{ id: BENCH, sets: sets(60, 8, 'ideal', 6) }]), startedAt, endedAt, durationSec: 60, logging };
}

beforeEach(() => { vi.useFakeTimers({ now: Date.parse('2026-09-22T12:00:00.000Z'), toFake: ['Date'] }); replaceState(freshState()); });
afterEach(() => { vi.useRealTimers(); });

describe('ENG-06: duration drift baseline', () => {
  it('five "Log a past session" records (retro, user-typed 30 min) are not a trusted baseline', () => {
    for (const d of ['2026-09-01', '2026-09-05', '2026-09-09', '2026-09-13', '2026-09-17']) {
      expect(logPastSession({ splitId: 'split_push', trainedAtLocal: `${d}T17:00`, durationMin: 30, entries: [{ exerciseId: BENCH, name: 'Bench', sets: sets(60, 8, 'ideal', 6) }] })).not.toBeNull();
    }
    const prior = state.value.sessions;
    expect(prior.every(p => p.logging.mode === 'retro' && !p.logging.timingTrusted), 'premise: retro, untrusted').toBe(true);
    const today = session('2026-09-21', [{ id: BENCH, sets: sets(60, 8, 'ideal', 6) }]);
    const drift = postSessionInsights({ session: today, priorSessions: prior, custom: [] }, 10).find(i => i.id.startsWith('post:duration'));
    expect(drift, `retro baseline used: ${drift?.noticed} ${drift?.means}`).toBeUndefined();
  });

  it('five compressed one-minute sessions do not make a trusted 60-minute workout "longer than usual"', () => {
    const prior = ['2026-09-01', '2026-09-05', '2026-09-09', '2026-09-13', '2026-09-17'].map(compressed);
    expect(prior.every(p => p.logging.timingTrusted === false), 'premise: prior timing untrusted').toBe(true);
    const today = session('2026-09-21', [{ id: BENCH, sets: sets(60, 8, 'ideal', 6) }]);
    expect(today.logging.timingTrusted && today.durationSec === 3600, 'premise: trusted 60 min').toBe(true);
    const drift = postSessionInsights({ session: today, priorSessions: prior, custom: [] }, 10).find(i => i.id.startsWith('post:duration'));
    expect(drift, `untrusted baseline used: ${drift?.noticed} ${drift?.means}`).toBeUndefined();
  });

  it('untrusted sessions do not move a trusted baseline', () => {
    const trusted = ['2026-08-01', '2026-08-05', '2026-08-09', '2026-08-13', '2026-08-17'].map(d => session(d, [{ id: BENCH, sets: sets(60, 8, 'ideal', 6) }]));
    const noise = ['2026-09-01', '2026-09-05', '2026-09-09'].map(compressed);
    const today = session('2026-09-21', [{ id: BENCH, sets: sets(60, 8, 'ideal', 6) }]);
    const drift = postSessionInsights({ session: today, priorSessions: [...trusted, ...noise], custom: [] }, 10).find(i => i.id.startsWith('post:duration'));
    expect(drift, `baseline moved by untrusted sessions: ${drift?.noticed}`).toBeUndefined();
  });
});
