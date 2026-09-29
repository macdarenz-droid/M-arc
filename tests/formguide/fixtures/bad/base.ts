// FG-3 seeded bad files: the base. The lateral raise without its mistake's sway delta (a file of its own, with no stored
// hash, so the hash bad file is the base itself), so every bad file here is one defect away from a file that passes
// every other check. Each folder is named for the check its file must fail; a `fixture.json` beside it gives what a real
// file would have in the repo (research, drawings, its stored hash).
import type { ExerciseGuide } from '@/formguide/model';
import { lib_dumbbell_lateral_raise as LR } from '@/formguide/exercises/lib_dumbbell_lateral_raise';

const { sway: _sway, ...joints } = LR.mistake.joints as Record<string, unknown>;
export const BASE = { ...LR, mistake: { ...LR.mistake, joints } } as ExerciseGuide;
/** The base as a machine file (the machine lateral raise), for the machine checks. The hands hold nothing here (the
 * equipment attaches no point), and `STACK` is a drive part that moves the weight stack and attaches no body point. */
export const machineBase = (machine: NonNullable<ExerciseGuide['machine']>, extra: Partial<ExerciseGuide> = {}): ExerciseGuide =>
  ({ ...BASE, id: 'lib_machine_lateral_raise', equipment: { ...BASE.equipment, kind: 'none', attach: [] }, machine,
    // D-V1-10: a machine file declares its force; these seed other checks, so they keep the gravity effort they had
    muscles: { ...BASE.muscles, effort: { ...(BASE.muscles.effort as object), force: 'gravity' } }, ...extra }) as ExerciseGuide;
export const STACK = { part: 'stack', travel: [0, 1], chain: [] } as NonNullable<ExerciseGuide['machine']>['drive'][number];
