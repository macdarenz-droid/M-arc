// V1-05: one pure "scene" for a static moment of a guide (docs/FORM-GUIDE-PRODUCTION.md §10.5 V1-05). It composes
// guideView.ts's own primitives — markupOf, momentFrame, frameFn, cameraOf — the exact functions the player calls
// for its Pictures tiles and zoom-still snapshots (ExercisePlayer.tsx `shots`). `fg:render` calls sceneOf for every
// picture it draws, so a render and the mounted player can never compute two different pictures for the same guide
// and moment (A2): both paths run through the same guideView functions, never a second implementation of them.
// frameFn + sampleGuide reuse momentFrame's own "nearest sampled stop" rule for a rep other than 0 (momentFrame
// itself only ever reads rep 0, the correct figure's first rep or the mistake's only rep), which the filmstrip
// needs to show reps 1 and 2 (the slowed-down reps, `movement.slowdown`). `rig` is always passed to sampleGuide
// (V1-04, D-FG7 (b)): a file with contacts, a balance or a followed part is solved on it and throws without one;
// any other file ignores it, so passing it is always safe. Pure: no DOM.
import type { ExerciseGuide } from '../model';
import type { Rig } from '../check/view';
import type { TokenReader } from '../rig/paint';
import type { Frame } from '../rig/pose';
import type { Pose } from '../rig/joints';
import { sampleGuide, type Figure } from '../sample';
import * as guideView from './guideView';
import type { Box } from './guideView';
import { layerFor, posedLayer } from './machineView';
import type { MachineArt } from '../machines';

export type Scene = { markup: string; frame: Frame; box: Box; dx: number };

export type SceneOptions = {
  figure: Figure;
  /** rep fraction (0..1) within `rep`, in that rep's own tempo */
  u: number;
  /** which rep's tempo and tremor phase to sample (0-based); default 0, momentFrame's own rep */
  rep?: number;
  /** prefix for the markup's gradient ids; unique per rendered figure in the same document */
  id: string;
  /** the load label the equipment shows, in the display unit (null draws no label) */
  load: number | null;
  /** true for the zoomed camera (model.ts `camera.zoom`) instead of the full one */
  zoom?: boolean;
  /** true widens the box for a second, mistake figure alongside this one (guideView.cameraOf) */
  compare?: boolean;
};

/** The frame at rep fraction u of rep `rep`: guideView's own momentFrame for rep 0, else the same nearest-stop rule
 * applied through frameFn (both guideView's), so every rep reads the same drawn numbers as the player. */
function frameAt(g: ExerciseGuide, rig: Rig, figure: Figure, rep: number, u: number, markup: string): Frame {
  if (rep === 0) return guideView.momentFrame(g, rig, figure, u, markup);
  const s = sampleGuide(g, figure, rep, rig);
  const i = s.stops.reduce((b, v, k) => (Math.abs(v - u) < Math.abs(s.stops[b]! - u) ? k : b), 0);
  const pose: Pose = {};
  for (const ch of s.channels) pose[ch.id] = ch.stops[i]![1];
  return guideView.frameFn(g, rig, figure, rep, markup)(pose, s.stops[i]!);
}

/** One static moment: the figure markup, its posed frame, and the camera box. */
export function sceneOf(g: ExerciseGuide, rig: Rig, read: TokenReader, o: SceneOptions): Scene {
  const figure = guideView.markupOf(g, rig, read, { id: o.id, mistake: o.figure === 'mistake', load: o.load });
  const frame = frameAt(g, rig, o.figure, o.rep ?? 0, o.u, figure);
  const { box, dx } = guideView.cameraOf(g, o.zoom ?? false, o.compare ?? false);
  // V1-09: a machine file's machine sits behind the figure, posed at the same moment (a free-weight file draws none,
  // so its markup is the figure's alone). The mistake's rep is its only one, as its figure plays it.
  const layer = g.machine ? (rig.machine as MachineArt | null | undefined) ?? layerFor(g, { stress: false, compare: false })!.art : null;
  const machine = layer ? posedLayer(g, rig, layer, o.figure, o.figure === 'mistake' ? 0 : o.rep ?? 0, o.u, o.load ?? 0) : '';
  return { markup: machine + figure, frame, box, dx };
}
