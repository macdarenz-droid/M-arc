/**
 * Recalls what a person's own session notes were tagged as, recently. This
 * never diagnoses or infers anything: the flags themselves came from the
 * online coach reading the note's text (see src/ai/notes.ts), already
 * checked against the app's own vocabularies. All this does is decide
 * which ones are still worth recalling, and for how long.
 */
import { daysBetween } from '@/core/dates';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { finding } from './shared';

/** A note flag stops being worth recalling after a week. */
export const NOTE_FLAG_LOOKBACK_DAYS = 7;
/** At most this many distinct flags in one report, newest first, so a run of notes never floods it. */
export const MAX_NOTE_FLAGS = 3;

export function detectNoteFlags(ctx: BrainContext): Finding[] {
  const seen = new Map<string, { day: string; sessionId: string; kind: string; muscle: string | null }>();
  for (const s of ctx.sessions) {
    if (!s.noteFlags?.length) continue;
    if (daysBetween(s.day, ctx.today) > NOTE_FLAG_LOOKBACK_DAYS) continue;
    for (const f of s.noteFlags) {
      const key = `${f.kind}:${f.muscle ?? 'none'}`;
      const existing = seen.get(key);
      if (!existing || existing.day < s.day) seen.set(key, { day: s.day, sessionId: s.id, kind: f.kind, muscle: f.muscle });
    }
  }
  return [...seen.values()]
    .sort((a, b) => b.day.localeCompare(a.day))
    .slice(0, MAX_NOTE_FLAGS)
    .map(f => finding({
      kind: 'note_flag', target: `${f.kind}:${f.muscle ?? 'none'}`,
      subject: f.muscle ? { muscle: f.muscle as Finding['subject']['muscle'] } : {},
      metrics: { flagKind: f.kind, daysAgo: daysBetween(f.day, ctx.today), day: f.day },
      from: f.day, to: f.day, confidence: 'high', severity: f.kind === 'pain_or_discomfort' ? 1 : 0,
      evidence: { sessionIds: [f.sessionId], days: [f.day] },
    }));
}
