// V1-05: the pure side of `npm run fg:render <id>` (docs/FORM-GUIDE-PRODUCTION.md §10.5 V1-05), bundled to node the
// same way check/cli.ts is bundled for `fg:check` (package.json "fg:render"). Every picture is a standalone,
// fully token-resolved SVG string built from player/scene.ts's sceneOf, so a render is pixel-for-pixel what the
// player would draw for that guide and moment. scripts/fg-render.mjs only turns each string into a PNG with the
// local Chromium; nothing here touches a page or the DOM.
import type { AttachmentId, ExerciseGuide } from '../model';
import { JOINTS, type JointId, type View } from '../rig/joints';
import type { Frame } from '../rig/pose';
import type { Pt } from '../rig/ik';
import { themeReader, type TokenReader } from '../rig/paint';
import { THEMES, THEME_IDS, type ThemeId } from '@/theme/themes';
import { posedMarkup, resolveVars } from '../snapshot';
import { poseAt, windowsFor, type Figure } from '../sample';
import { momentsOf, type Box } from '../player/guideView';
import { sceneOf, type Scene, type SceneOptions } from '../player/scene';
import { rigFor, viewOf, type Rig } from './view';
import { MACHINES, setupMarkup, type MachineDrawing } from './machines';
import libraryJson from '@/data/exercises.json';

export { guideOf } from './node';
export { rigFor, viewOf } from './view';
export { cameraOf } from '../player/guideView';
export { THEME_IDS };

type LibraryRow = { id: string; pattern?: string };
const library = libraryJson as LibraryRow[];

/** The pattern an id's library row gives (rigFor/viewOf need it, as runChecks reads it in check/index.ts). */
export const patternOf = (id: string): string | undefined => library.find(e => e.id === id)?.pattern;

/** `--sheet`'s bare rest pose: a real, fully-typed ExerciseGuide (not a hand-built untyped object in the .mjs
 * script, which is how the missing `joints` shipped uncaught) — bodyweight, standing, no movement. `evaluator`
 * (sample.ts) reads `joints` and `mistake.joints` unconditionally, even for a hold with no curves. */
export const SHEET_GUIDE: ExerciseGuide = {
  id: 'lib__sheet', kind: 'hold', order: 'lift_first',
  camera: { full: 'standingFront', zoom: 'standingFront', subject: 'pelvis' },
  pose: 'standing', equipment: { kind: 'none', attach: [], loadFrom: 'bodyweight' },
  tempo: { hold: 1 }, movement: { breathe: 'out on lift' },
  muscles: { target: [], helps: [], keepQuiet: [], effort: {} },
  cues: [], joints: {}, mistake: { name: '', joints: {}, tells: [] }, sources: [],
};
/** The views `--sheet` tries, in order (front, side, back). */
export const SHEET_VIEWS: readonly View[] = ['front', 'side', 'back'];

/** The page background behind a render (outside the figure's own floor shadow), for a non-transparent screenshot. */
export const bgOf = (theme: ThemeId): string => THEMES[theme].tokens.bg;

export const WIDTHS = [360, 390] as const;
export const FILM_FRAMES = 12;

/** The reps a file plays: one per `movement.slowdown` entry (the correct figure's own slowed-down reps), same rule
 * as check/index.ts's private `repsOf`. */
const repsOf = (g: ExerciseGuide): number[] => Array.from({ length: Math.max(1, g.movement.slowdown?.length ?? 1) }, (_, i) => i);
const grid = (n: number): number[] => Array.from({ length: n }, (_, i) => i / (n - 1));
/** The grip or foot points a file names, else every hand and foot (check/index.ts's private `grip`). */
const gripOf = (g: ExerciseGuide): AttachmentId[] => {
  const pts = g.equipment.attach.filter(a => /^(hand|foot)_/.test(a));
  return pts.length ? pts : ['hand_l', 'hand_r', 'foot_l', 'foot_r'];
};

/** One or more posed, fully resolved figures placed side by side (part i shifted by its own `dx`), in one document. */
function stripSvg(parts: { markup: string; frame: Frame; dx: number }[], read: TokenReader, box: Box): string {
  const w = box[2] * parts.length;
  const bodies = parts.map(p => (p.dx ? `<g transform="translate(${p.dx} 0)">${resolveVars(posedMarkup(p.markup, p.frame), read)}</g>` : resolveVars(posedMarkup(p.markup, p.frame), read)));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box[0]} ${box[1]} ${w} ${box[3]}" width="${w}" height="${box[3]}"><style>.fg-j,.fg-p{transform-box:view-box}</style>${bodies.join('')}</svg>`;
}

/** Contact markers, joint pivots and the centre-of-mass line (an unweighted mean of the drawn joint pivots — the
 * full de Leva model is V1-07's `balance` check, not needed for a debug picture), added to one moment's SVG. Tokens
 * only (`--guide` is exactly "guide lines" in the theme contract), like every other colour in src/formguide/**. */
function debugOverlay(g: ExerciseGuide, rig: Rig, read: TokenReader, frame: Frame, box: Box): string {
  const pivots: Pt[] = (JOINTS as readonly JointId[]).map(j => rig.pivot(frame, j));
  const com: Pt = pivots.reduce((a, p) => [a[0] + p[0] / pivots.length, a[1] + p[1] / pivots.length], [0, 0] as Pt);
  const guide = read('guide'), target = read('target'), mistake = read('mistake');
  const dots = pivots.map(p => `<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="2.5" fill="${guide}" stroke="${target}" stroke-width="0.6"/>`).join('');
  const grips = gripOf(g).map(a => rig.point(frame, a)).map(p => `<circle cx="${p[0].toFixed(2)}" cy="${p[1].toFixed(2)}" r="4.5" fill="none" stroke="${target}" stroke-width="1.6"/>`).join('');
  const line = `<line x1="${com[0].toFixed(2)}" y1="${box[1]}" x2="${com[0].toFixed(2)}" y2="${box[1] + box[3]}" stroke="${mistake}" stroke-width="1" stroke-dasharray="4 3"/>`;
  return `${dots}${grips}${line}`;
}
const withOverlay = (svg: string, overlay: string): string => svg.replace(/<\/svg>$/, `${overlay}</svg>`);

/** The 4 correct moments (start, mid lift, top, mid lower) and the mistake's own peak ("top" analog), one name each. */
function momentSpecs(g: ExerciseGuide): { name: string; figure: Figure; u: number }[] {
  const out = momentsOf(g, 'correct').map((u, i) => ({ name: `moment-${i}`, figure: 'correct' as Figure, u }));
  const mu = momentsOf(g, 'mistake');
  out.push({ name: 'mistake', figure: 'mistake', u: mu[2]! });
  return out;
}

/** `slots`: how many single-figure widths the composite spans (1 for a moment, 2 for compare, 12 for the
 * filmstrip) — at a render width of 360 or 390 px, each figure keeps that width and the composite is `slots` times
 * as wide, exactly like the app's own side-by-side compare (ExercisePlayer.tsx `cam.dx`), not squeezed to fit. */
export type RenderJob = { name: string; svg: string; slots: number };

/** Every picture of one exercise at one theme: the 4 moments, the mistake, compare mode (both at their own peak),
 * a filmstrip per rep, and the setup pair when the file has a machine drawing. Each is a standalone SVG string. */
export function svgsFor(g: ExerciseGuide, rig: Rig, theme: ThemeId, o: { debug?: boolean; machines?: Record<string, MachineDrawing> } = {}): RenderJob[] {
  const read = themeReader(theme), out: RenderJob[] = [];
  const loadKg = g.equipment.kg ?? null;
  const at = (figure: Figure, u: number, id: string, rep = 0, compare = false): Scene =>
    sceneOf(g, rig, read, { figure, u, rep, id, load: loadKg, compare } satisfies SceneOptions);

  for (const spec of momentSpecs(g)) {
    const s = at(spec.figure, spec.u, `fgr-${spec.name}`);
    let svg = stripSvg([{ markup: s.markup, frame: s.frame, dx: 0 }], read, s.box);
    if (o.debug) svg = withOverlay(svg, debugOverlay(g, rig, read, s.frame, s.box));
    out.push({ name: spec.name, svg, slots: 1 });
  }

  // compare mode: correct and mistake at their own peak, side by side (as ExercisePlayer.tsx draws it: the correct
  // figure at 0, the mistake translated by one box width — guideView.cameraOf's own `dx` for compare mode).
  const a = at('correct', momentsOf(g, 'correct')[2]!, 'fgr-cmp-a');
  const b = at('mistake', momentsOf(g, 'mistake')[2]!, 'fgr-cmp-b');
  out.push({ name: 'compare', svg: stripSvg([{ markup: a.markup, frame: a.frame, dx: 0 }, { markup: b.markup, frame: b.frame, dx: a.box[2] }], read, a.box), slots: 2 });

  // a 12-frame filmstrip per rep, one image per rep (the reps a real slowdown plays)
  for (const rep of repsOf(g)) {
    const frames = grid(FILM_FRAMES).map((u, i) => at('correct', u, `fgr-fs${rep}-${i}`, rep));
    const parts = frames.map((s, i) => ({ markup: s.markup, frame: s.frame, dx: i * s.box[2] }));
    out.push({ name: `filmstrip-rep${rep}`, svg: stripSvg(parts, read, frames[0]!.box), slots: FILM_FRAMES });
  }

  // the setup pair: only once a machine drawing exists for the file's machine (empty until FG-7)
  if (g.machine) {
    const lib = { ...MACHINES, ...o.machines };
    const drawing = lib[g.machine.id];
    if (drawing && drawing.view === rig.view) {
      const settings = g.machine.settings, su = g.mistake.setup;
      const right = setupMarkup(drawing, settings);
      out.push({ name: 'setup-correct', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${a.box.join(' ')}">${right}</svg>`, slots: 1 });
      if (su) {
        const wrong = setupMarkup(drawing, settings, { setting: su.setting, value: su.wrong });
        out.push({ name: 'setup-wrong', svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${a.box.join(' ')}">${wrong}</svg>`, slots: 1 });
      }
    }
  }

  return out;
}

/** How many pixels the hold tremor moves the loaded hand (or foot) at `width` px wide (D-FG7 (i)): the hand's figure-
 * space range across the correct figure's hold window, scaled by the render width. 0 when the file has no hold. */
export function tremorPx(g: ExerciseGuide, rig: Rig, box: Box, width: number): number {
  const hold = windowsFor(g.tempo, g.order, g.kind).find(w => w.name === 'hold');
  if (!hold || hold.u1 <= hold.u0) return 0;
  const attach = gripOf(g).find(a => a.startsWith('hand_')) ?? gripOf(g)[0]!;
  const pts = grid(40).map(t => hold.u0 + t * (hold.u1 - hold.u0)).map(u => rig.point(rig.frame(poseAt(g, u, 'correct', 0)), attach));
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), scale = width / box[2];
  return Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) * scale;
}
