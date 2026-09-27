// The form guides by library exercise id (R1-10). Imported only by the player, so it lives in the lazy chunk.
import type { Guide, Sample, Scheme, Stage } from './rig/api';
import { rigVars } from './rig/paint';
import { sampleMove } from './moves/sample';
import type { Move } from './moves/types';
import { machineChestPress } from './moves/machineChestPress';
import { dumbbellLateralRaise } from './moves/dumbbellLateralRaise';
import { latPulldown } from './moves/latPulldown';
import { chestPressStage } from './scenes/chestPress';
import { lateralRaiseStage } from './scenes/lateralRaise';
import { latPulldownStage, lpInsetHtml } from './scenes/latPulldown';

/** A Guide plus what the app needs beyond the contract: the motion spec, and the lat pulldown's Grip close-up inset. */
export type AppGuide = Guide & { readonly move: Move; insetHtml(): string | null };

function makeGuide(move: Move, render: (s: Sample) => Stage, inset?: () => string): AppGuide {
  let sample: Sample | null = null, stage: Stage | null = null;
  const g: AppGuide = {
    spec: move.spec,
    move,
    sample: () => (sample ??= sampleMove(move)),
    // paint is token-only (colour-mix of theme tokens), so the markup is the same for both schemes
    stage: (_scheme: Scheme) => (stage ??= render(g.sample())),
    rigVars,
    insetHtml: () => (inset ? inset() : null),
  };
  return g;
}

export const guides: Record<string, AppGuide> = {
  lib_machine_chest_press: makeGuide(machineChestPress, chestPressStage),
  lib_lat_pulldown: makeGuide(latPulldown, latPulldownStage, lpInsetHtml),
  lib_dumbbell_lateral_raise: makeGuide(dumbbellLateralRaise, lateralRaiseStage),
};
