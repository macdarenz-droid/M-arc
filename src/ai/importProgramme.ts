/**
 * "Import from a photo" on Train. Sends one downscaled photo of a written
 * plan and trusts none of what comes back blindly: every muscle id is
 * checked against the app's own vocabulary, sets are clamped to what the
 * app actually accepts, and a photo with no readable plan in it is
 * reported honestly rather than guessed at. Nothing is saved here — this
 * only turns a photo into candidates for the person to review.
 */
import { isMuscleId, type MuscleId } from '@/data/muscles';
import type { ResistanceMode } from '@/core/models';
import type { CapturedPhoto } from '@/native/photo';
import { postJson } from './client';

export interface ImportProgrammePayload {
  version: 1;
  kind: 'import-programme';
  image: CapturedPhoto;
}

export function buildImportPayload(image: CapturedPhoto): ImportProgrammePayload {
  return { version: 1, kind: 'import-programme', image };
}

export interface ImportedExercise {
  name: string;
  sets: number;
  equipment: string;
  primary: MuscleId[];
  secondary: MuscleId[];
  mode: ResistanceMode;
  confidence: 'high' | 'low';
}

export interface ImportedDay {
  name: string;
  exercises: ImportedExercise[];
}

const MODES: ResistanceMode[] = ['weighted', 'bodyweight', 'assisted', 'duration', 'conditioning'];
const isMode = (v: unknown): v is ResistanceMode => typeof v === 'string' && (MODES as string[]).includes(v);
const knownMuscles = (v: unknown): MuscleId[] => (Array.isArray(v) ? v.filter(isMuscleId) : []);

interface RawImportedExercise { name?: unknown; sets?: unknown; equipment?: unknown; primary?: unknown; secondary?: unknown; mode?: unknown; confidence?: unknown }
interface RawImportedDay { name?: unknown; exercises?: unknown }
interface ImportReply { readable?: unknown; days?: unknown; model?: unknown; error?: unknown }

function readExercise(raw: unknown): ImportedExercise | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as RawImportedExercise;
  if (typeof r.name !== 'string' || !r.name.trim() || typeof r.equipment !== 'string' || !isMode(r.mode)) return null;
  const sets = typeof r.sets === 'number' && Number.isFinite(r.sets) ? Math.max(1, Math.min(10, Math.round(r.sets))) : 3;
  return {
    name: r.name.trim().slice(0, 60),
    sets,
    equipment: r.equipment.trim().slice(0, 40) || 'Other',
    primary: knownMuscles(r.primary),
    secondary: knownMuscles(r.secondary),
    mode: r.mode,
    confidence: r.confidence === 'high' ? 'high' : 'low',
  };
}

function readDay(raw: unknown): ImportedDay | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as RawImportedDay;
  if (typeof r.name !== 'string' || !r.name.trim()) return null;
  const exercises = Array.isArray(r.exercises) ? r.exercises.map(readExercise).filter((e): e is ImportedExercise => e != null) : [];
  if (!exercises.length) return null;
  return { name: r.name.trim().slice(0, 28), exercises };
}

export type ImportResult = { ok: true; days: ImportedDay[] } | { ok: false; error: string };

export async function requestProgrammeImport(image: CapturedPhoto, opts: { url: string; deviceId: string; fetchImpl?: typeof fetch; timeoutMs?: number }): Promise<ImportResult> {
  const payload = buildImportPayload(image);
  const result = await postJson<ImportProgrammePayload, ImportReply>(payload, { url: opts.url, path: '/import-programme', deviceId: opts.deviceId, fetchImpl: opts.fetchImpl, timeoutMs: opts.timeoutMs ?? 55_000 });
  if (!result.ok) return result;
  const body = result.body;
  if (body.readable === false) return { ok: false, error: 'Could not read a workout plan in that photo. Try a clearer shot of the whole page.' };
  if (!Array.isArray(body.days)) return { ok: false, error: 'The coach sent back something we could not read.' };
  const days = body.days.map(readDay).filter((d): d is ImportedDay => d != null);
  if (!days.length) return { ok: false, error: 'Could not find any exercises to import in that photo.' };
  return { ok: true, days };
}
