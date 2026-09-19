/**
 * "Suggest" on the custom-exercise form. Sends only the name and whatever
 * equipment word the person already typed, gets back a classification, and
 * trusts none of it blindly: every muscle id is checked against the app's
 * own vocabulary before it can reach the form, exactly as if a person had
 * typed it. A "low" confidence from the model is passed through so the
 * screen can ask the person to double-check before saving.
 */
import { isMuscleId, type MuscleId } from '@/data/muscles';
import type { ResistanceMode } from '@/core/models';
import { postJson } from './client';

export interface TagExercisePayload {
  version: 1;
  kind: 'tag-exercise';
  name: string;
  equipmentHint?: string;
}

export function buildTagPayload(name: string, equipmentHint?: string): TagExercisePayload {
  const payload: TagExercisePayload = { version: 1, kind: 'tag-exercise', name: name.trim().slice(0, 60) };
  const hint = equipmentHint?.trim().slice(0, 40);
  if (hint) payload.equipmentHint = hint;
  return payload;
}

export interface TagSuggestion {
  equipment: string;
  primary: MuscleId[];
  secondary: MuscleId[];
  pattern: string;
  mode: ResistanceMode;
  /** "low" means the model itself was not confident — the screen should ask the person to double-check before saving. */
  confidence: 'high' | 'low';
  model: string;
}

const MODES: ResistanceMode[] = ['weighted', 'bodyweight', 'assisted', 'duration', 'conditioning'];
const isMode = (v: unknown): v is ResistanceMode => typeof v === 'string' && (MODES as string[]).includes(v);

interface TagReply { equipment?: unknown; primary?: unknown; secondary?: unknown; pattern?: unknown; mode?: unknown; confidence?: unknown; model?: unknown; error?: unknown }

/** Keeps only ids the app actually knows, silently — an unknown id is dropped, never shown as if it were real. */
const knownMuscles = (v: unknown): MuscleId[] => (Array.isArray(v) ? v.filter(isMuscleId) : []);

export type TagResult = { ok: true; suggestion: TagSuggestion } | { ok: false; error: string };

export async function requestTagSuggestion(name: string, equipmentHint: string | undefined, opts: { url: string; deviceId: string; fetchImpl?: typeof fetch; timeoutMs?: number }): Promise<TagResult> {
  const payload = buildTagPayload(name, equipmentHint);
  if (!payload.name) return { ok: false, error: 'Type a name first.' };
  const result = await postJson<TagExercisePayload, TagReply>(payload, { url: opts.url, path: '/tag-exercise', deviceId: opts.deviceId, fetchImpl: opts.fetchImpl, timeoutMs: opts.timeoutMs ?? 15_000 });
  if (!result.ok) return result;
  const body = result.body;
  if (typeof body.equipment !== 'string' || typeof body.pattern !== 'string' || !isMode(body.mode)) return { ok: false, error: 'The coach sent back something we could not read.' };
  return {
    ok: true,
    suggestion: {
      equipment: body.equipment.trim().slice(0, 40) || 'Other',
      primary: knownMuscles(body.primary),
      secondary: knownMuscles(body.secondary),
      pattern: body.pattern,
      mode: body.mode,
      confidence: body.confidence === 'high' ? 'high' : 'low',
      model: typeof body.model === 'string' ? body.model : 'unknown',
    },
  };
}
