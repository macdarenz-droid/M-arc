/**
 * "Scan a photo" on the custom-exercise form. Sends one downscaled photo
 * and whatever equipment word the person already typed, and trusts none of
 * it blindly: every muscle id is checked against the app's own vocabulary,
 * exactly as if a person had typed it, and a photo with nothing
 * recognizable in it is reported honestly rather than guessed at.
 */
import { isMuscleId, type MuscleId } from '@/data/muscles';
import type { ResistanceMode } from '@/core/models';
import type { CapturedPhoto } from '@/native/photo';
import { postJson } from './client';

export interface IdentifyExercisePayload {
  version: 1;
  kind: 'identify-exercise';
  image: CapturedPhoto;
  equipmentHint?: string;
}

export function buildIdentifyPayload(image: CapturedPhoto, equipmentHint?: string): IdentifyExercisePayload {
  const payload: IdentifyExercisePayload = { version: 1, kind: 'identify-exercise', image };
  const hint = equipmentHint?.trim().slice(0, 40);
  if (hint) payload.equipmentHint = hint;
  return payload;
}

export interface IdentifySuggestion {
  name: string;
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

interface IdentifyReply { visible?: unknown; name?: unknown; equipment?: unknown; primary?: unknown; secondary?: unknown; pattern?: unknown; mode?: unknown; confidence?: unknown; model?: unknown; error?: unknown }

/** Keeps only ids the app actually knows, silently — an unknown id is dropped, never shown as if it were real. */
const knownMuscles = (v: unknown): MuscleId[] => (Array.isArray(v) ? v.filter(isMuscleId) : []);

export type IdentifyResult = { ok: true; suggestion: IdentifySuggestion } | { ok: false; error: string };

export async function requestExerciseFromPhoto(image: CapturedPhoto, equipmentHint: string | undefined, opts: { url: string; deviceId: string; fetchImpl?: typeof fetch; timeoutMs?: number }): Promise<IdentifyResult> {
  const payload = buildIdentifyPayload(image, equipmentHint);
  const result = await postJson<IdentifyExercisePayload, IdentifyReply>(payload, { url: opts.url, path: '/identify-exercise', deviceId: opts.deviceId, fetchImpl: opts.fetchImpl, timeoutMs: opts.timeoutMs ?? 40_000 });
  if (!result.ok) return result;
  const body = result.body;
  if (typeof body.equipment !== 'string' || typeof body.pattern !== 'string' || !isMode(body.mode)) return { ok: false, error: 'The coach sent back something we could not read.' };
  if (body.visible === false) return { ok: false, error: 'Could not tell what that photo shows. Try a clearer shot of the equipment or exercise.' };
  return {
    ok: true,
    suggestion: {
      name: typeof body.name === 'string' ? body.name.trim().slice(0, 60) : '',
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
