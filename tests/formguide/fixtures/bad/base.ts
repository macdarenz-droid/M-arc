// FG-3 seeded bad files: the base. The lateral raise without its mistake's sway delta (that delta swings the mistake's
// left dumbbell 4.5 units out of the viewBox; D-FG3), so every bad file here is one defect away from a file that passes
// every other check. Each folder is named for the check its file must fail; a `fixture.json` beside it gives what a real
// file would have in the repo (research, drawings, its stored hash).
import type { ExerciseGuide } from '@/formguide/model';
import { lib_dumbbell_lateral_raise as LR } from '@/formguide/exercises/lib_dumbbell_lateral_raise';

const { sway: _sway, ...joints } = LR.mistake.joints as Record<string, unknown>;
export const BASE = { ...LR, mistake: { ...LR.mistake, joints } } as ExerciseGuide;
/** The base as a machine file (the machine lateral raise), for the machine checks. */
export const machineBase = (machine: NonNullable<ExerciseGuide['machine']>, extra: Partial<ExerciseGuide> = {}): ExerciseGuide =>
  ({ ...BASE, id: 'lib_machine_lateral_raise', machine, ...extra }) as ExerciseGuide;
