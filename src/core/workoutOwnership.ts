/** Crash-safe WebView → native ownership. No workout UI starts a handover yet. */
import { signal } from '@preact/signals';

export const WORKOUT_HANDOVER_KEY = 'marc.workout.handover.v1';
export type Ownership = 'web' | 'checking' | 'transferring' | 'native' | 'blocked';
export const workoutOwnership = signal<Ownership>('web');
/** Pending reads temporarily freeze live writes without establishing a known handover. */
export const checkingWorkoutOwnership = signal(false);
export const workoutOwnershipNotice = signal<string | null>(null);
export const ownershipMessage = 'Workout editing is paused until recovery is complete. Reopen M/ARC to retry.';
const unavailableMessage = 'Could not check the watch workout. You can keep using M/ARC on your phone.';
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
let nativeEnabled = false;
let knownHandover = false;
const validId = (v: unknown): v is string => typeof v === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(v);
const bounded = (v: unknown): v is string => typeof v === 'string' && new TextEncoder().encode(v).length <= 1_048_576;
function validSeed(v: HandoverSeed): boolean {
  return !!v && validId(v.handoverId) && validId(v.installationId) && bounded(v.snapshot) && bounded(v.inputs);
}
function checkpoint(): Checkpoint | null {
  if (!storage) throw new Error('Workout storage unavailable');
  const raw = storage.getItem(WORKOUT_HANDOVER_KEY);
  if (raw === null) return null;
  knownHandover = true; // Even a damaged marker must be retained for recovery.
  const c = JSON.parse(raw) as Checkpoint;
  if (!c || c.version !== 1 || !['prepared', 'native'].includes(c.phase) || !validSeed(c.seed))
    throw new Error('Unreadable workout handover');
  return c;
}
function save(c: Checkpoint): void {
  if (!storage) throw new Error('Workout storage unavailable');
  storage.setItem(WORKOUT_HANDOVER_KEY, JSON.stringify(c));
  knownHandover = true;
}
const sameSeed = (a: HandoverSeed, b: HandoverSeed): boolean =>
  a.handoverId === b.handoverId && a.installationId === b.installationId && a.snapshot === b.snapshot && a.inputs === b.inputs;

/** Native boots must query the DB even if localStorage lost its marker. */
export function initWorkoutOwnership(next: StorageLike, requireNativeCheck = false): void {
  generation++; busy = false; storage = next;
  nativeEnabled = requireNativeCheck; knownHandover = false;
  workoutOwnershipNotice.value = null;
  checkingWorkoutOwnership.value = requireNativeCheck;
  workoutOwnership.value = requireNativeCheck ? 'checking' : 'web';
  refreshWorkoutOwnership();
}

/** Web storage failures cannot manufacture a native owner. Known ownership stays sticky until settled. */
export function refreshWorkoutOwnership(): void {
  if (!nativeEnabled || !['web', 'checking'].includes(workoutOwnership.peek())) return;
  try { if (checkpoint() || knownHandover) workoutOwnership.value = 'checking'; }
  catch {
    if (knownHandover) workoutOwnership.value = 'blocked';
    else if (!checkingWorkoutOwnership.peek()) workoutOwnershipNotice.value = unavailableMessage;
  }
}

/** Also re-read the marker so another WebView cannot keep writing a stale active copy. */
export function assertPhoneWorkoutWriter(): void {
  refreshWorkoutOwnership();
  if (workoutOwnership.peek() !== 'web') throw new Error(ownershipMessage);
}

function applyReply(reply: OwnershipReply, prior: Checkpoint | null, phone: HandoverPhone): boolean {
  if (prior) {
    const current = checkpoint();
    if (!current || current.phase !== prior.phase || !sameSeed(current.seed, prior.seed))
      throw new Error('Workout handover changed during request');
  }
  if (reply?.owner === 'native') {
    knownHandover = true; // A read owner remains protected even if caching/validation fails.
    workoutOwnership.value = 'checking';
    if (!validSeed(reply.seed) || !bounded(reply.snapshot) || (prior && !sameSeed(prior.seed, reply.seed)))
      throw new Error('Workout ownership mismatch');
    // Keep the recovery source before replacing the cached active workout.
    save({ version: 1, phase: 'native', seed: reply.seed });
    if (!phone.project(reply.snapshot, reply.seed.inputs, false)) throw new Error('Projection not saved');
    workoutOwnership.value = 'native';
    return true;
  }
  if (reply?.owner === 'blocked') knownHandover = true; // Native reports an older, unowned active seed.
  if (reply?.owner !== 'web') throw new Error('Workout owner requires review');
  if (prior) {
    // An empty DB is NOT proof that a prepared request will never arrive later.
    if (prior.phase !== 'prepared' || reply.cancelledHandoverId !== prior.seed.handoverId)
      throw new Error('Workout handover not cancelled');
    if (!phone.project(prior.seed.snapshot, prior.seed.inputs, true)) throw new Error('Recovery not saved');
    storage!.removeItem(WORKOUT_HANDOVER_KEY);
  } else if (knownHandover) {
    throw new Error('Known workout handover requires recovery');
  }
  knownHandover = false;
  workoutOwnership.value = 'web';
  return true;
}

function failed(): void {
  // Catch a marker that appeared while an optional read was pending.
  try { checkpoint(); } catch { /* checkpoint records evidence before parsing */ }
  workoutOwnership.value = knownHandover ? 'blocked' : 'web';
  workoutOwnershipNotice.value = knownHandover ? null : unavailableMessage;
}

/** Failed optional reads leave ordinary phone users alone; known handovers remain protected. */
export async function reconcileWorkoutOwnership(backend: OwnershipBackend, phone: HandoverPhone): Promise<boolean> {
  if (busy) return false;
  busy = true; nativeEnabled = true;
  const run = generation;
  checkingWorkoutOwnership.value = true;
  workoutOwnership.value = 'checking'; // A missing local marker does not rule out a native owner.
  workoutOwnershipNotice.value = null;
  try {
    let prior: Checkpoint | null = null;
    try { prior = checkpoint(); } catch (err) { if (knownHandover) throw err; }
    const reply = prior?.phase === 'prepared' ? await backend.settle(prior.seed.handoverId) : await backend.read();
    if (run !== generation) return false;
    if (!prior) {
      try { if (checkpoint()) throw new Error('Workout handover changed during check'); }
      catch (err) { if (knownHandover) throw err; }
    }
    return applyReply(reply, prior, phone);
  } catch {
    if (run === generation) failed();
    return false;
  } finally { if (run === generation) { busy = false; checkingWorkoutOwnership.value = false; } }
}

export async function handoverWorkout(backend: OwnershipBackend, phone: HandoverPhone, handoverId: string, installationId: string): Promise<boolean> {
  if (busy) return false;
  assertPhoneWorkoutWriter();
  busy = true; nativeEnabled = true;
  const run = generation;
  workoutOwnership.value = 'transferring';
  workoutOwnershipNotice.value = null;
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
    if (run === generation) failed();
    return false;
  } finally { if (run === generation) busy = false; }
}
