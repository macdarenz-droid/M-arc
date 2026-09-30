// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=5e5ebf94317632e7eda358ed3ecb7c01566feec1a193a94a73625e8e7c9ea628
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
export const HOWTO_HINTS: Partial<Record<HowToId, string>> = {
  "lib_machine_chest_press": "Heel of palm, wrist straight.",
};
