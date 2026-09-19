/**
 * Turns a session note into flags the app can act on. Sends only the note
 * text — nothing else about the session, the person, or their training.
 * The reply can only ever be a kind from the closed list plus an optional
 * real muscle id; anything else is dropped rather than shown.
 */
import { isMuscleId, muscleLabel } from '@/data/muscles';
import type { NoteFlag, NoteFlagKind } from '@/core/models';
import { postJson } from './client';

export interface NotesPayload {
  version: 1;
  kind: 'notes';
  text: string;
}

export const MAX_NOTE_CHARS = 280;

const FLAG_KINDS: NoteFlagKind[] = ['pain_or_discomfort', 'equipment_issue', 'fatigue', 'schedule', 'form_check', 'positive'];
const isFlagKind = (v: unknown): v is NoteFlagKind => typeof v === 'string' && (FLAG_KINDS as string[]).includes(v);

interface NotesReply { flags?: unknown; error?: unknown }

export type NotesResult = { ok: true; flags: NoteFlag[] } | { ok: false; error: string };

const FLAG_LABEL: Record<NoteFlagKind, string> = {
  pain_or_discomfort: 'possible discomfort',
  equipment_issue: 'an equipment issue',
  fatigue: 'unusual fatigue',
  schedule: 'a schedule note',
  form_check: 'a form check',
  positive: 'good news',
};

/** Plain words for a flag, for a chip or a toast. Never a diagnosis or a cause — just what kind of thing was noted. */
export function noteFlagLabel(flag: NoteFlag): string {
  const base = FLAG_LABEL[flag.kind];
  return flag.muscle ? `${base} — ${muscleLabel(flag.muscle).toLowerCase()}` : base;
}

export async function requestNoteFlags(text: string, opts: { url: string; deviceId: string; fetchImpl?: typeof fetch; timeoutMs?: number }): Promise<NotesResult> {
  const trimmed = text.trim().slice(0, MAX_NOTE_CHARS);
  if (!trimmed) return { ok: true, flags: [] };
  const payload: NotesPayload = { version: 1, kind: 'notes', text: trimmed };
  const result = await postJson<NotesPayload, NotesReply>(payload, { url: opts.url, path: '/notes', deviceId: opts.deviceId, fetchImpl: opts.fetchImpl, timeoutMs: opts.timeoutMs ?? 15_000 });
  if (!result.ok) return result;
  const raw = Array.isArray(result.body.flags) ? result.body.flags : [];
  const flags: NoteFlag[] = raw
    .filter((f): f is { kind: unknown; muscle: unknown } => !!f && typeof f === 'object')
    .filter(f => isFlagKind(f.kind))
    .slice(0, 3)
    .map(f => ({ kind: f.kind as NoteFlagKind, muscle: isMuscleId(f.muscle) ? f.muscle : null }));
  return { ok: true, flags };
}
