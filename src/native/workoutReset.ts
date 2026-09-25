import { registerPlugin } from '@capacitor/core';
import { isNative } from './capacitor';
const plugin = registerPlugin<{ workoutOwnership(options: { action: 'reset' }): Promise<{ owner: string; reset?: boolean }> }>('WearEngine');
export const PENDING_WORKOUT_RESET_KEY = 'marc.workout.reset.v1';
/** Web stays synchronous. Android must acknowledge the wipe before phone data is erased. */
export function wipeNativeWorkoutData(): Promise<void> | undefined {
  if (!isNative()) return;
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    Promise.resolve().then(() => plugin.workoutOwnership({ action: 'reset' })),
    new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('Native workout reset timed out')), 12000); }),
  ]).then(reply => {
    if (reply?.owner !== 'web' || reply.reset !== true) throw new Error('Native workout reset was not confirmed');
  }).finally(() => clearTimeout(timer));
}
