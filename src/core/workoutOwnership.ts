/** Crash-safe WebView → native ownership. No workout UI starts a handover yet. */
import { signal } from '@preact/signals';

export const WORKOUT_HANDOVER_KEY = 'marc.workout.handover.v1';
export type Ownership = 'web' | 'checking' | 'transferring' | 'native' | 'blocked';
export const workoutOwnership = signal<Ownership>('web');
export const ownershipMessage = 'Workout editing is paused until recovery is complete. Reopen M/ARC to retry.';
type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export interface HandoverSeed { handoverId: string; installationId: string; snapshot: string; inputs: string }
interface Checkpoint { version: 1; phase: 'prepared' | 'native'; seed: HandoverSeed }
export type OwnershipReply =
  | { owner: 'web'; cancelledHandoverId?: string }
  | { owner: 'native'; seed: HandoverSeed; snapshot: string }
  | { owner: 'blocked' };
export interface OwnershipBackend {
  read(): Promise<OwnershipReply>;
  handover(seed: HandoverSeed): Promise<OwnershipReply>;
  /** Atomically returns the owner, or records a cancellation that prevents a late seed. */
  settle(handoverId: string): Promise<OwnershipReply>;
}
export interface HandoverPhone {
  flush(): boolean;
  /** Called synchronously AFTER writes freeze. Must return detached, serialized inputs. */
  capture(): Pick<HandoverSeed, 'snapshot' | 'inputs'>;
  /** Restore the phone copy after cancellation, or persist a read-only native projection. */
  project(snapshot: string, inputs: string, restorePhone: boolean): boolean;
}

let storage: StorageLike | null = null;
let generation = 0;
let busy = false;
const validId = (v: unknown): v is string => typeof v === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(v);
const bounded = (v: unknown): v is string => typeof v === 'string' && new TextEncoder().encode(v).length <= 1_048_576;
function validSeed(v: HandoverSeed): boolean {
  return !!v && validId(v.handoverId) && validId(v.installationId) && bounded(v.snapshot) && bounded(v.inputs);
}
function checkpoint(): Checkpoint | null {
  if (!storage) throw new Error('Workout storage unavailable');
  const raw = storage.getItem(WORKOUT_HANDOVER_KEY);
  if (raw === null) return null;
  const c = JSON.parse(raw) as Checkpoint;
  if (!c || c.version !== 1 || !['prepared', 'native'].includes(c.phase) || !validSeed(c.seed))
    throw new Error('Unreadable workout handover');
  return c;
}
function save(c: Checkpoint): void {
  if (!storage) throw new Error('Workout storage unavailable');
  storage.setItem(WORKOUT_HANDOVER_KEY, JSON.stringify(c));
}
const sameSeed = (a: HandoverSeed, b: HandoverSeed): boolean =>
  a.handoverId === b.handoverId && a.installationId === b.installationId && a.snapshot === b.snapshot && a.inputs === b.inputs;

/** Native boots must query the DB even if localStorage lost its marker. */
export function initWorkoutOwnership(next: StorageLike, requireNativeCheck = false): void {
  generation++; busy = false; storage = next;
  try { workoutOwnership.value = requireNativeCheck || checkpoint() ? 'checking' : 'web'; }
  catch { workoutOwnership.value = 'blocked'; }
}

/** Also re-read the marker so another WebView cannot keep writing a stale active copy. */
export function assertPhoneWorkoutWriter(): void {
  if (workoutOwnership.peek() === 'web' && storage) {
    try { if (checkpoint()) workoutOwnership.value = 'checking'; }
    catch { workoutOwnership.value = 'blocked'; }
  }
  if (workoutOwnership.peek() !== 'web') throw new Error(ownershipMessage);
}

function applyReply(reply: OwnershipReply, prior: Checkpoint | null, phone: HandoverPhone): boolean {
  if (reply?.owner === 'native') {
    if (!validSeed(reply.seed) || !bounded(reply.snapshot) || (prior && !sameSeed(prior.seed, reply.seed)))
      throw new Error('Workout ownership mismatch');
    // Keep the recovery source before replacing the cached active workout.
    save({ version: 1, phase: 'native', seed: reply.seed });
    if (!phone.project(reply.snapshot, reply.seed.inputs, false)) throw new Error('Projection not saved');
    workoutOwnership.value = 'native';
    return true;
  }
  if (reply?.owner !== 'web') throw new Error('Workout owner requires review');
  if (prior) {
    // An empty DB is NOT proof that a prepared request will never arrive later.
    if (prior.phase !== 'prepared' || reply.cancelledHandoverId !== prior.seed.handoverId)
      throw new Error('Workout handover not cancelled');
    if (!phone.project(prior.seed.snapshot, prior.seed.inputs, true)) throw new Error('Recovery not saved');
    storage!.removeItem(WORKOUT_HANDOVER_KEY);
  }
  workoutOwnership.value = 'web';
  return true;
}

/** Failure and timeouts stay read-only. Never infer ownership from a failed bridge call. */
export async function reconcileWorkoutOwnership(backend: OwnershipBackend, phone: HandoverPhone): Promise<boolean> {
  if (busy) return false;
  busy = true;
  const run = generation;
  workoutOwnership.value = 'checking';
  try {
    const prior = checkpoint();
    const reply = prior?.phase === 'prepared' ? await backend.settle(prior.seed.handoverId) : await backend.read();
    if (run !== generation) return false;
    return applyReply(reply, prior, phone);
  } catch {
    if (run === generation) workoutOwnership.value = 'blocked';
    return false;
  } finally { if (run === generation) busy = false; }
}

export async function handoverWorkout(backend: OwnershipBackend, phone: HandoverPhone, handoverId: string, installationId: string): Promise<boolean> {
  if (busy) return false;
  assertPhoneWorkoutWriter();
  busy = true;
  const run = generation;
  workoutOwnership.value = 'transferring';
  try {
    if (!phone.flush()) throw new Error('Phone workout not saved');
    const seed: HandoverSeed = { handoverId, installationId, ...phone.capture() };
    if (!validSeed(seed)) throw new Error('Invalid workout handover');
    const prior: Checkpoint = { version: 1, phase: 'prepared', seed };
    save(prior); // A crash anywhere after this point must reconcile before edits.
    const reply = await backend.handover(seed);
    if (run !== generation) return false;
    if (reply?.owner !== 'native') throw new Error('Native ownership not confirmed');
    return applyReply(reply, prior, phone);
  } catch {
    if (run === generation) workoutOwnership.value = 'blocked';
    return false;
  } finally { if (run === generation) busy = false; }
}
