// FG-1: pattern → view table (docs/FORM-GUIDE-PRODUCTION.md §3 "Views"), one row for each of the 33 patterns in
// src/data/exercises.json, with the default kind and order an exercise file inherits (§2). An exercise may override
// the view only with `viewWhy`, and kind/order only with a `why`.
// Rule of §3: side for pushes, pulls, hinges, squats, lunges, curls, extensions and leg machines; front for abduction,
// pulldowns, shrugs, crossover, carries and jumps; back for horizontal abduction and rear-delt work. `why` is given where
// a row is not named by that rule.
import type { Kind, Order, View } from './joints';

export type PatternRow = { view: View; kind: Kind; order: Order; why?: string };

const r = (view: View, kind: Kind = 'rep', order: Order = 'lift_first', why?: string): PatternRow => (why ? { view, kind, order, why } : { view, kind, order });

export const PATTERNS = {
  horizontal_push: r('side', 'rep', 'lower_first', 'bench and push-up start by lowering; machine presses override'),
  incline_push: r('side', 'rep', 'lower_first', 'incline bench starts by lowering; machine presses override'),
  vertical_push: r('side'),
  chest_adduction: r('front'),
  shoulder_abduction: r('front'),
  shoulder_flexion: r('side', 'rep', 'lift_first', 'front raise moves in the sagittal plane'),
  horizontal_abduction: r('back'),
  horizontal_pull: r('side'),
  shoulder_external_rotation: r('front', 'rep', 'lift_first', 'the forearm swings out to the side, seen face on'),
  vertical_pull: r('front'),
  elbow_extension: r('side'),
  shoulder_extension: r('side', 'rep', 'lift_first', 'straight-arm pulldown and pullover move in the sagittal plane'),
  scapular_elevation: r('front'),
  hip_hinge: r('side', 'rep', 'lower_first'),
  elbow_flexion: r('side'),
  wrist_flexion: r('side'),
  knee_extension: r('side'),
  knee_flexion: r('side'),
  squat: r('side', 'rep', 'lower_first'),
  single_leg_squat: r('side', 'rep', 'lower_first'),
  lunge: r('side', 'alternating', 'lower_first'),
  hip_extension: r('side'),
  hip_abduction: r('front'),
  hip_adduction: r('front', 'rep', 'lift_first', 'the legs move in the frontal plane, like abduction'),
  plantar_flexion: r('side'),
  spinal_flexion: r('side', 'rep', 'lift_first', 'crunches flex the trunk in the sagittal plane'),
  hip_flexion: r('side', 'rep', 'lift_first', 'leg raises move in the sagittal plane'),
  anti_extension: r('side', 'hold', 'lift_first', 'plank sag is read from the side'),
  anti_lateral_flexion: r('front', 'hold', 'lift_first', 'side-plank hip drop is read face on'),
  rotation: r('front', 'rep', 'lift_first', 'trunk rotation is read face on'),
  anti_rotation: r('front', 'rep', 'lift_first', 'Pallof press resists rotation face on; bird dog overrides'),
  conditioning: r('side', 'locomotion', 'lift_first', 'sled, crawl and climber gaits read from the side; jumps override'),
  carry: r('front', 'hold', 'lift_first'),
} as const satisfies Record<string, PatternRow>;

export type PatternId = keyof typeof PATTERNS;

/** The view for a library pattern; custom exercises (unknown pattern) get no guide file (§6). */
export function viewFor(pattern: string): View | null {
  return pattern in PATTERNS ? PATTERNS[pattern as PatternId].view : null;
}
