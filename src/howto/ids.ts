// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/plates.mjs). inputsSha256=3b85310687ae043c928246d7b0bf72feb0c8b3a3e68dab9fbd1dd28a1d69189c
// The only How-to module in the main bundle (plan 2.9: <= 2,048 B, no runtime imports).
export const HOWTO_IDS = [
  "lib_dumbbell_lateral_raise",
  "lib_barbell_back_squat",
  "lib_pull_up",
  "lib_hanging_leg_raise",
  "lib_lat_pulldown",
  "lib_seated_cable_row",
  "lib_leg_press",
  "lib_machine_chest_press",
] as const;
export type HowToId = (typeof HOWTO_IDS)[number];
export const HOWTO_LABEL = "How to do it";
export function hasHowTo(id: string): id is HowToId {
  return (HOWTO_IDS as readonly string[]).includes(id);
}
