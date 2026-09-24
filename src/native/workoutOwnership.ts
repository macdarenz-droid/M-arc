import { registerPlugin } from '@capacitor/core';
import type { ActiveSession } from '@/core/models';
import { newId } from '@/core/models';
import { flushSave, projectOwnedWorkout, state } from '@/core/store';
import { handoverWorkout, reconcileWorkoutOwnership, type HandoverPhone, type HandoverSeed, type OwnershipBackend, type OwnershipReply } from '@/core/workoutOwnership';
import { captureHeartInputs, restoreHeartInputs, type RawSample } from '@/slices/workout/heart';

interface Plugin { workoutOwnership(options: { action: string; seed?: HandoverSeed; handoverId?: string }): Promise<OwnershipReply> }
const plugin = registerPlugin<Plugin>('WearEngine');

/** A timed-out write is uncertain; the durable checkpoint keeps phone edits closed. */
async function request(options: Parameters<Plugin['workoutOwnership']>[0]): Promise<OwnershipReply> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve().then(() => plugin.workoutOwnership(options)),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Ownership check timed out')), 12000); }),
    ]);
  } finally { clearTimeout(timer); }
}
export const nativeWorkoutOwner: OwnershipBackend = {
  read: () => request({ action: 'read' }),
  settle: handoverId => request({ action: 'settle', handoverId }),
  handover: seed => request({ action: 'handover', seed }),
};

const id = (v: unknown): v is string => typeof v === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(v);
function parseSnapshot(raw: string): ActiveSession {
  const a = JSON.parse(raw) as ActiveSession;
  if (!a || !id(a.id) || !Number.isFinite(Date.parse(a.startedAt)) || !Array.isArray(a.entries)
      || typeof a.splitId !== 'string' || !Number.isFinite(a.pausedMs) || a.pausedMs < 0
      || (a.pausedAt != null && (!Number.isFinite(a.pausedAt) || a.pausedAt < 0 || a.pausedAt > 8.64e15))) throw new Error('Invalid workout snapshot');
  const ids = new Set<string>([a.id]);
  for (const e of a.entries) {
    if (!e || !id(e.id) || ids.has(e.id) || typeof e.exerciseId !== 'string' || typeof e.name !== 'string'
        || typeof e.done !== 'boolean' || typeof e.skipped !== 'boolean' || !Array.isArray(e.sets))
      throw new Error('Invalid workout entry');
    ids.add(e.id);
    for (const s of e.sets) {
      if (!s || !id(s.id) || ids.has(s.id)) throw new Error('Invalid workout set');
      ids.add(s.id);
    }
  }
  return a;
}
interface Inputs {
  version: 1; sessionId: string; capturedAt: string;
  restPolicy: { autoRest: boolean; restDefaultSec: number; rest: ReturnType<typeof state.peek>['preferences']['rest'] };
  heartSource: 'ble'; heartSamples: RawSample[];
}
function parseInputs(raw: string, sessionId: string): Inputs {
  const v = JSON.parse(raw) as Inputs;
  if (!v || v.version !== 1 || v.sessionId !== sessionId || !Number.isFinite(Date.parse(v.capturedAt))
      || typeof v.restPolicy?.autoRest !== 'boolean' || !Number.isFinite(v.restPolicy?.restDefaultSec)
      || v.restPolicy.restDefaultSec < 15 || v.restPolicy.restDefaultSec > 600
      || !['time', 'heart'].includes(v.restPolicy?.rest?.mode) || v.heartSource !== 'ble'
      || !Number.isFinite(v.restPolicy.rest.heartTargetPct) || v.restPolicy.rest.heartTargetPct < 0 || v.restPolicy.rest.heartTargetPct > 1
      || !Number.isFinite(v.restPolicy.rest.minSec) || v.restPolicy.rest.minSec < 0 || v.restPolicy.rest.minSec > 600
      || !Array.isArray(v.heartSamples) || v.heartSamples.length > 14400) throw new Error('Invalid workout inputs');
  for (const s of v.heartSamples) {
    if (!s || !Number.isFinite(s.tSec) || s.tSec < 0 || !Number.isFinite(s.bpm) || s.bpm < 1 || s.bpm > 300
        || ![true, false, null].includes(s.contact) || !Number.isFinite(s.receivedAtEpochMs)
        || s.receivedAtEpochMs < 1 || s.receivedAtEpochMs > 8.64e15
        || !Number.isFinite(s.receivedAtElapsedMs) || s.receivedAtElapsedMs < 0) throw new Error('Invalid heart checkpoint');
  }
  return v;
}

export const workoutHandoverPhone: HandoverPhone = {
  flush: flushSave,
  capture: () => {
    const s = state.peek();
    const snapshot = JSON.stringify(s.active);
    const a = parseSnapshot(snapshot);
    const inputs = JSON.stringify({ version: 1, sessionId: a.id!, capturedAt: new Date().toISOString(),
      restPolicy: { autoRest: s.preferences.autoRest, restDefaultSec: s.preferences.restDefaultSec, rest: s.preferences.rest },
      heartSource: 'ble', heartSamples: captureHeartInputs() } satisfies Inputs);
    parseInputs(inputs, a.id!);
    return { snapshot, inputs };
  },
  project: (raw, inputs, restorePhone) => {
    const active = parseSnapshot(raw);
    const context = parseInputs(inputs, active.id!);
    if (!projectOwnedWorkout(active)) return false;
    if (restorePhone) restoreHeartInputs(context.heartSamples);
    return true;
  },
};

export const reconcilePhoneWorkout = (): Promise<boolean> => reconcileWorkoutOwnership(nativeWorkoutOwner, workoutHandoverPhone);
/** Infrastructure only. No screen, device callback or watch command invokes this. */
export const preparePhoneWorkoutHandover = (installationId: string): Promise<boolean> =>
  handoverWorkout(nativeWorkoutOwner, workoutHandoverPhone, newId('handover'), installationId);
