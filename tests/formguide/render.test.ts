// V1-05: `npm run fg:render` and player/scene.ts's sceneOf (docs/FORM-GUIDE-PRODUCTION.md §10.5 V1-05).
// The pure job-building (check/render.ts, player/scene.ts) is asserted on every `npm test`. A1's Chromium-level PNG
// proof needs a real browser, so it runs only when MARC_CHROMIUM names one (as `npm run gate` already requires) —
// skipped, never loosened, without it. A6 uses V1-04's solver on its own test fixture (a real machine + contacts).
import { describe, expect, it, vi } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { THEME_IDS } from '@/theme/themes';
import { lib_dumbbell_lateral_raise } from '@/formguide/exercises/lib_dumbbell_lateral_raise';
import { rigFor, viewOf, type Rig } from '@/formguide/check/view';
import { inputFor } from '@/formguide/check/node';
import type { MachinePart } from '@/formguide/check/machines';
import { pathOff } from '@/formguide/solve';
import { patternOf, svgsFor, gripOf, pxScale, SHEET_GUIDE, SHEET_VIEWS } from '@/formguide/check/render';
import * as guideView from '@/formguide/player/guideView';
import { sceneOf } from '@/formguide/player/scene';
import { themeReader } from '@/formguide/rig/paint';
import { lib_smith_machine_shoulder_press as FX } from './fixtures/solve/lib_smith_machine_shoulder_press';

const g = lib_dumbbell_lateral_raise;
const rig0 = rigFor(g, viewOf(g, patternOf(g.id)));
if (typeof rig0 === 'string') throw new Error(`fixture: ${rig0}`);
const rig = rig0;
/** The lateral raise's own picture set: 4 moments, the mistake, compare mode, and one filmstrip per slowed rep
 * (`movement.slowdown` has 3 entries); it has no machine, so no setup pair. */
const NAMES = ['moment-0', 'moment-1', 'moment-2', 'moment-3', 'mistake', 'compare', 'filmstrip-rep0', 'filmstrip-rep1', 'filmstrip-rep2'];

describe('A1 every theme draws a real, deterministic picture set', () => {
  it.each(THEME_IDS)('%s: every job is the lateral raise’s picture set, and every SVG draws a real shape', theme => {
    const jobs = svgsFor(g, rig, theme);
    expect(jobs.map(j => j.name).sort()).toEqual([...NAMES].sort());
    for (const job of jobs) {
      expect(job.svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
      expect(job.svg).toMatch(/<path /);
      expect(job.svg).not.toMatch(/var\(--/);   // every token is resolved (snapshot.ts's resolveVars)
    }
  });
  it.each(THEME_IDS)('%s: two runs draw byte-identical SVGs (so the PNG a screenshot makes from them is byte-identical too)', theme => {
    const svgsOf = () => svgsFor(g, rig, theme).map(j => j.svg);
    expect(svgsOf()).toEqual(svgsOf());
  });
});

describe('--sheet: the front, side and back rest pose', () => {
  it('the front view has a rig and svgsFor draws a real, non-throwing moment-0 (review round 1: SHEET_GUIDE had no top-level `joints`, so evaluator threw before any picture was built)', () => {
    const front = rigFor(SHEET_GUIDE, 'front');
    expect(typeof front, front as string).not.toBe('string');
    if (typeof front === 'string') return;
    const jobs = svgsFor(SHEET_GUIDE, front, 'silent-black');
    const moment0 = jobs.find(j => j.name === 'moment-0');
    expect(moment0).toBeDefined();
    expect(moment0!.svg).toMatch(/<path /);
  });
  // V1-06 wired the side view, so the back view (V1-22) is the one with no rig and a not-ready reason
  it('the side view has a rig; the back has none yet, and rigFor gives the reason fg:render --sheet writes to <view>-not-ready.txt', () => {
    const side = rigFor(SHEET_GUIDE, 'side');
    expect(typeof side === 'string' ? side : side.view).toBe('side');
    expect(rigFor(SHEET_GUIDE, 'back')).toBe('back view not drawn yet (V1-22)');
  });
  it('SHEET_VIEWS is exactly front, side, back, in that order (what the CLI iterates)', () => {
    expect(SHEET_VIEWS).toEqual(['front', 'side', 'back']);
  });
});

describe('A2 the player and fg:render call the same guideView primitives through sceneOf', () => {
  it('sceneOf composes exactly the calls ExercisePlayer.tsx makes for its own Pictures tiles and zoom-still snapshot', () => {
    const markupSpy = vi.spyOn(guideView, 'markupOf');
    const momentSpy = vi.spyOn(guideView, 'momentFrame');
    const read = themeReader('paper');
    const scene = sceneOf(g, rig, read, { figure: 'correct', u: 0.5, id: 'fgt', load: null });
    expect(markupSpy).toHaveBeenCalledWith(g, rig, read, { id: 'fgt', mistake: false, load: null });
    expect(momentSpy).toHaveBeenCalledWith(g, rig, 'correct', 0.5, expect.any(String));
    // ExercisePlayer.tsx's own `markup` and `shots` (guideView.ts's markupOf and momentFrame, called directly from
    // ExercisePlayer.tsx) draw the exact same picture sceneOf just built for the same guide and moment.
    const playerMarkup = guideView.markupOf(g, rig, read, { id: 'fgt', mistake: false, load: null });
    const playerFrame = guideView.momentFrame(g, rig, 'correct', 0.5, playerMarkup);
    expect(scene.markup).toBe(playerMarkup);
    expect(scene.frame).toEqual(playerFrame);
    markupSpy.mockRestore();
    momentSpy.mockRestore();
  });
});

/** A minimal guide file whose view has no rig yet (back, until V1-22; the side view was until V1-06): rigFor's own reason, for A3. No import in the
 * written file — guideOf only reads the object's shape, so the temp file needs no path alias to resolve. */
function writeNoRigFixture(): { dir: string; file: string } {
  const dir = mkdtempSync(join(tmpdir(), 'fg-render-'));
  const file = join(dir, 'lib__no_rig.ts');
  const guide = {
    id: 'lib__no_rig', kind: 'hold', order: 'lift_first', view: 'back',
    camera: { full: 'standingFront', zoom: 'standingFront', subject: 'pelvis' },
    pose: 'standing', equipment: { kind: 'none', attach: [], loadFrom: 'bodyweight' },
    tempo: { hold: 1 }, movement: { breathe: 'out on lift' },
    muscles: { target: [], helps: [], keepQuiet: [], effort: {} },
    cues: [], mistake: { name: '', joints: {}, tells: [] }, sources: [],
  };
  writeFileSync(file, `export const lib__no_rig = ${JSON.stringify(guide)};\n`);
  return { dir, file };
}

describe('A3 an id with no rig exits 1 with the rig’s reason', () => {
  it('a back-view file (no rig until V1-22) exits 1 and never touches a browser', () => {
    const { dir, file } = writeNoRigFixture();
    try {
      // a bogus MARC_CHROMIUM: if the exit-1 path ever launched a browser first, this would fail loudly instead of
      // silently passing in an environment that happens to have a real one.
      const r = spawnSync('npm', ['run', '-s', 'fg:render', file], { encoding: 'utf8', env: { ...process.env, MARC_CHROMIUM: '/does/not/exist' } });
      expect(r.status).toBe(1);
      expect(r.stderr).toContain('back view not drawn yet (V1-22)');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }, 30_000);
});

describe('A6 the debug marker sits on the solved hand within 1 px', () => {
  const FX_PATH = 'tests/formguide/fixtures/solve/lib_smith_machine_shoulder_press.ts';
  const FX_MACHINE = inputFor(FX_PATH, FX).machines!.fx_press!;
  const fxRig: Rig = { ...(rigFor(FX, 'front') as Rig), machine: FX_MACHINE };
  const WIDTH = 360;
  const SCALE = pxScale(guideView.cameraOf(FX, false, false).box, WIDTH);
  /** Every `r="4.5"` circle (debugOverlay's grip markers, unfilled, drawn after the r="2.5" joint dots), in
   * `gripOf`'s own order — the fixture's `equipment.attach` is `['hand_l', 'hand_r']`. */
  const gripMarkers = (svg: string): [number, number][] =>
    [...svg.matchAll(/<circle cx="([-\d.]+)" cy="([-\d.]+)" r="4\.5"/g)].map(m => [+m[1]!, +m[2]!]);
  const topMarkers = (): [number, number][] => {
    const jobs = svgsFor(FX, fxRig, 'silent-black', { debug: true });
    const top = jobs.find(j => j.name === 'moment-2')!;   // the press's top, order lift_first (like the lateral raise)
    const markers = gripMarkers(top.svg);
    expect(markers, 'expected one grip marker per gripOf(FX) attachment (hand_l, hand_r)').toHaveLength(2);
    return markers;
  };

  it('hand_l and hand_r’s debug markers lie on their rail within 1 px at 360px (V1-04’s solved elbow_lead)', () => {
    const markers = topMarkers();
    const gaps = (['bar_l', 'bar_r'] as const).map((part, i) => Math.abs(pathOff(FX_MACHINE.parts[part]!, markers[i]!)) * SCALE);
    for (const gapPx of gaps) expect(gapPx).toBeLessThanOrEqual(1);
  });

  it('the same check correctly fails a 2 px offset (proves the 1 px bound actually discriminates)', () => {
    const markers = topMarkers();
    // the solve is untouched (still against FX_MACHINE); only the comparison rail used for measurement is shifted 2 px
    // worth of figure units, sideways, so the same marker now measures ~2 px off it — the check that just passed at
    // <= 1 px above must not pass here.
    const shiftUnits = 2 / SCALE;
    const shifted = (part: 'bar_l' | 'bar_r'): MachinePart => {
      const p = FX_MACHINE.parts[part]!;
      if (p.kind === 'lever') throw new Error('slide only');
      return { ...p, path: p.path.map(([x, y]) => [x + shiftUnits, y]) as [[number, number], [number, number]] };
    };
    const gaps = (['bar_l', 'bar_r'] as const).map((part, i) => Math.abs(pathOff(shifted(part), markers[i]!)) * SCALE);
    for (const gapPx of gaps) expect(gapPx).toBeGreaterThan(1);
  });
});

// A1 (Chromium), A4: needs a real local Chromium (as `npm run gate` does); skipped, not loosened, without one.
describe.skipIf(!process.env.MARC_CHROMIUM)('A1/A4 fg:render itself: byte-identical PNGs, non-blank, ≤ 60 s', () => {
  const readNames = (dir: string) => readdirSync(dir).filter(f => f.endsWith('.png')).sort();

  it('two runs of the lateral raise produce byte-identical PNGs in every theme and width, within 60 s each', () => {
    const dirA = mkdtempSync(join(tmpdir(), 'fg-render-a-'));
    const dirB = mkdtempSync(join(tmpdir(), 'fg-render-b-'));
    try {
      const runOne = (dir: string) => {
        const t0 = Date.now();
        const r = spawnSync('npm', ['run', '-s', 'fg:render', '--', 'lib_dumbbell_lateral_raise', '--out', dir], { encoding: 'utf8' });
        return { r, s: (Date.now() - t0) / 1000 };
      };
      const a = runOne(dirA), b = runOne(dirB);
      expect(a.r.status, a.r.stderr).toBe(0);
      expect(b.r.status, b.r.stderr).toBe(0);
      expect(a.s).toBeLessThanOrEqual(60);
      expect(b.s).toBeLessThanOrEqual(60);
      const names = readNames(dirA);
      // 5 themes x 2 widths x the picture set, plus report.txt
      expect(names.length).toBe(THEME_IDS.length * 2 * NAMES.length);
      expect(readNames(dirB)).toEqual(names);
      for (const name of names) {
        const bufA = readFileSync(join(dirA, name)), bufB = readFileSync(join(dirB, name));
        expect(bufA.equals(bufB), `${name} differs between two runs`).toBe(true);
        expect(bufA.length, `${name} is suspiciously small (blank?)`).toBeGreaterThan(500);
        expect(bufA.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');   // PNG signature: not corrupt
      }
    } finally {
      rmSync(dirA, { recursive: true, force: true });
      rmSync(dirB, { recursive: true, force: true });
    }
  }, 180_000);
});
