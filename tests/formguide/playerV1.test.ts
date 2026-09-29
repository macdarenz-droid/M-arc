// V1-19: the player standard of docs/FORM-GUIDE-PRODUCTION.md §1 (readouts, guides, hotspots) and GU-7a parity.
// Node only: readouts.ts, guides.ts and hotspots.ts are pure; the DOM side is the gate's V1-19 block.
import { describe, expect, it } from 'vitest';
import { lib_dumbbell_lateral_raise as LR } from '@/formguide/exercises/lib_dumbbell_lateral_raise';
import { poseAt, repSeconds, tempoOf, windowsFor } from '@/formguide/sample';
import { effortOf } from '@/formguide/check/effort';
import { REPS, cameraOf, guideRig, markupOf } from '@/formguide/player/guideView';
import { HOT_MIN_PX, HOT_PX, hotRadius, hotspotsFor, muscleBubble, withHotspots } from '@/formguide/player/hotspots';
import { themeReader } from '@/formguide/rig/paint';
import { MUSCLE_BY_ID } from '@/data/muscles';
import { effortRows, fmtDeg, fmtPct, readoutAt, readouts, workingChannel } from '@/formguide/player/readouts';
import { chainedFrames, guideMarkup, guidePlan, kMax, overlaps, placeTag, pxPerUnit, tagBox, tagClashes } from '@/formguide/player/guides';
import { VIEWBOXES, type ExerciseGuide } from '@/formguide/model';
import { findExercise } from '@/core/exercises';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const rig = guideRig(LR, 'shoulder_abduction');
const LEN = repSeconds(LR.tempo) * 1000;

describe('V1-19 A1: readouts match poseAt within 1° and effort within 2%, at 10 sampled times', () => {
  const times = Array.from({ length: 10 }, (_, i) => Math.round(((i + 0.37) / 10) * REPS * LEN));

  it('the working joint of the lateral raise is the right shoulder abduction', () => {
    expect(workingChannel(LR)).toBe('shoulder_abd_r');
  });

  for (const figure of ['correct', 'mistake'] as const) it(`${figure}: angle and effort at each time`, () => {
    for (const ms of times) {
      // the chained timeline: rep r of the correct figure is its own slowed rep; the mistake repeats its one rep
      const r = Math.min(REPS - 1, Math.floor(ms / LEN)), u = (ms - r * LEN) / LEN, rep = figure === 'mistake' ? 0 : r;
      const want = poseAt(LR, u, figure, rep).shoulder_abd_r;
      const got = readoutAt(LR, rig, figure, ms);
      expect(got.rep).toBe(r + 1);
      expect(got.angle!.channel).toBe('shoulder_abd_r');
      expect(Math.abs(got.angle!.deg - want)).toBeLessThanOrEqual(1);
      expect(Math.abs(parseFloat(fmtDeg(got.angle!.deg)) - want)).toBeLessThanOrEqual(1);
      const eff = effortOf(LR, figure, rep, rig);
      if (typeof eff === 'string') throw new Error(eff);
      const e = eff(u);
      expect(got.effort.map(x => x.id).sort()).toEqual(['front_delts', 'side_delts', 'upper_traps']);
      for (const x of got.effort) {
        expect(Math.abs(x.v - e[x.id]!)).toBeLessThanOrEqual(0.02);
        expect(Math.abs(parseFloat(fmtPct(x.v)) - 100 * e[x.id]!)).toBeLessThanOrEqual(2);
      }
    }
  });
});

describe('V1-19 A1 (re-guide): hand speed shows the rep, not tremor or sway', () => {
  it('every hold window of the three correct reps and the mistake reads below 0.05 m/s', () => {
    const read = readouts(LR, rig);
    let n = 0;
    for (const figure of ['correct', 'mistake'] as const) for (let r = 0; r < REPS; r++) {
      const ws = windowsFor(tempoOf(LR, figure, figure === 'mistake' ? 0 : r), LR.order, LR.kind);
      for (const w of ws.filter(x => x.name === 'hold' && x.u1 > x.u0)) for (let k = 1; k < 10; k++) {
        const u = w.u0 + ((w.u1 - w.u0) * k) / 10, s = read(figure, (r + u) * LEN);
        expect(s.phase).toBe('hold');
        expect(s.speed, `${figure} rep ${r + 1} u ${u.toFixed(3)}`).toBeLessThan(0.05);
        n++;
      }
    }
    expect(n).toBe(9 * 6);
  });

  it('a file with a large hold sway (±3° inside the hold) still reads under 0.05 m/s: sway is not hand speed', () => {
    // the lateral raise's own hold sway (a 0.2° drift) is too small to bite, so a scaled copy sways hard in the hold
    const hold = windowsFor(tempoOf(LR, 'correct', 0), LR.order, LR.kind).find(w => w.name === 'hold')!, d = (hold.u1 - hold.u0) / 4;
    const SWAY: ExerciseGuide = { ...LR, joints: { ...LR.joints, sway: { keys: [[0, 0], [hold.u0, 0], [hold.u0 + d, 3], [hold.u0 + 2 * d, -3], [hold.u0 + 3 * d, 3], [hold.u1, 0], [1, 0]] } } };
    const read = readouts(SWAY, rig);
    // the sway really moves the drawn hand in the hold: read on the raw pose, it is far above the bar
    const raw = (u: number) => rig.point(rig.frame(poseAt(SWAY, u)), 'hand_r');
    const a = raw(hold.u0 + d * 1.4), b = raw(hold.u0 + d * 1.6), dt = 0.2 * d * repSeconds(LR.tempo);
    expect(Math.hypot(b[0] - a[0], b[1] - a[1]) / 303 / dt).toBeGreaterThan(0.2);
    for (let k = 1; k < 10; k++) {
      const u = hold.u0 + ((hold.u1 - hold.u0) * k) / 10, s = read('correct', u * LEN);
      expect(s.phase).toBe('hold');
      expect(s.speed, `u ${u.toFixed(3)}`).toBeLessThan(0.05);
    }
  });

  it('the lift still reads a moving hand (well above the hold)', () => {
    const peak = Math.max(...Array.from({ length: 20 }, (_, i) => readoutAt(LR, rig, 'correct', ((i + 0.5) / 20) * 0.25 * LEN).speed));
    expect(peak).toBeGreaterThan(0.5);
  });
});

describe('V1-19 A2: the tag never meets the face keep-out, at any stop of any merged V1 file', () => {
  const files = readdirSync(join(ROOT, 'src/formguide/exercises')).filter(f => f.endsWith('.ts'));

  it('every exercise file in src/formguide/exercises', async () => {
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const id = f.slice(0, -3), g = (await import(`../../src/formguide/exercises/${id}.ts`))[id] as ExerciseGuide;
      const ex = findExercise(id), r = guideRig(g, ex?.pattern), plan = guidePlan(g, r);
      if (!plan) continue;
      expect(plan.tags.length).toBe(chainedFrames(g, r).length);
      expect(tagClashes(plan), id).toEqual([]);
    }
  });

  it('a seeded tag on the face fails', () => {
    const plan = guidePlan(LR, rig, (_p, face) => [(face.x0 + face.x1) / 2, (face.y0 + face.y1) / 2])!;
    expect(tagClashes(plan).length).toBe(plan.tags.length);
    // one stop only: the check names it
    let i = 0;
    const one = guidePlan(LR, rig, (p, face, k) => (i++ === 40 ? [face.x1, face.y1] : placeTag(p, face, 'r', 200, VIEWBOXES[LR.camera.zoom], k)))!;
    expect(tagClashes(one)).toEqual([one.tags[40]!.offset]);
  });

  it('the push comes first: with room beside the face, the tag moves sideways and keeps its height', () => {
    const face = { x0: 168, y0: 23, x1: 232, y1: 103 }, K = kMax(VIEWBOXES.standingFront), wide = VIEWBOXES.standingFront;
    for (const side of ['l', 'r'] as const) {
      const at = placeTag([200, 20], face, side, 200, wide, K), b = tagBox(at, K);
      expect(at[1]).toBe(64);
      expect(side === 'r' ? b.x0 >= face.x1 : b.x1 <= face.x0).toBe(true);
    }
  });

  it('the placement rule pushes a tag off the face and keeps it in the zoom camera', () => {
    const face = { x0: 168, y0: 23, x1: 232, y1: 103 }, zoom = VIEWBOXES.upperFront, K = kMax(VIEWBOXES.standingFront);
    for (const pivot of [[180, 30], [200, 60], [230, 90], [260, 128], [150, 10]] as [number, number][]) for (const side of ['l', 'r'] as const) {
      const at = placeTag(pivot, face, side, 200, zoom, K), b = tagBox(at, K);
      expect(overlaps(b, face), `${pivot} ${side}`).toBe(false);
      expect(b.x0).toBeGreaterThanOrEqual(zoom[0]); expect(b.x1).toBeLessThanOrEqual(zoom[0] + zoom[2]);
      expect(b.y0).toBeGreaterThanOrEqual(zoom[1]); expect(b.y1).toBeLessThanOrEqual(zoom[1] + zoom[3]);
    }
  });
});

describe('V1-19 A3: hotspot targets of at least 44 px at 360 px', () => {
  const m = markupOf(LR, rig, themeReader('silent-black'), { id: 't', mistake: false, load: 9 });
  // the stage at a 360 px phone is 326 × 251 px (the gate's V1-19 block measures it); full, zoom and compare cameras
  const at360 = (box: readonly number[]) => pxPerUnit(326, 251, box);

  it('one hotspot per target and helper, on opposite shoulders, spliced after its tint path', () => {
    const hs = hotspotsFor(LR, m);
    expect(hs.map(h => `${h.m}_${h.side}`)).toEqual(['side_delts_r', 'front_delts_l']);
    const out = withHotspots(m, hs);
    for (const h of hs) {
      const i = out.indexOf(`class="fg-p fg-t-${h.m}_${h.side}"`), j = out.indexOf(`class="fg19-hot" data-muscle="${h.m}"`);
      expect(i).toBeGreaterThan(0);
      expect(j).toBeGreaterThan(i);
      // same parent group: no group opens or closes between the tint path and its hotspot
      expect(out.slice(i, j)).not.toMatch(/<g[ >]|<\/g>/);
    }
  });

  it('the radius makes every target HOT_PX across (at least 44 px) in every camera', () => {
    for (const box of [VIEWBOXES.standingFront, VIEWBOXES.upperFront, cameraOf(LR, false, true).box]) {
      const px = at360(box), d = 2 * hotRadius(px) * px;
      expect(d).toBeGreaterThanOrEqual(HOT_PX);
      expect(d).toBeGreaterThanOrEqual(HOT_MIN_PX);
      expect(d).toBeLessThan(HOT_PX + 1);
    }
  });

  it("the bubble is GU-7a's shape, in the muscle's tint colour", () => {
    expect(muscleBubble(LR, 'side_delts')).toEqual({ name: 'Side delts', rest: `(${MUSCLE_BY_ID.side_delts.anatomical}), target. Lifts the arms out to the sides; hardest near shoulder height.`, dot: 'var(--target)' });
    expect(muscleBubble(LR, 'front_delts')?.dot).toBe('var(--help)');
    expect(muscleBubble(LR, 'chest')).toBeNull();
  });
});

describe('V1-19 F1: a guide with no muscles shows no hotspots and does not crash', () => {
  const NONE: ExerciseGuide = { ...LR, muscles: { target: [], helps: [], keepQuiet: [], effort: {} } };
  const m = markupOf(NONE, rig, themeReader('paper'), { id: 't', mistake: false, load: null });

  it('no hotspots, the markup unchanged, no bars, no bubble; readouts and guides still work', () => {
    expect(hotspotsFor(NONE, m)).toEqual([]);
    expect(withHotspots(m, [])).toBe(m);
    expect(effortRows(NONE)).toEqual([]);
    expect(muscleBubble(NONE, 'side_delts')).toBeNull();
    const r = readoutAt(NONE, rig, 'correct', 1000);
    expect(r.effort).toEqual([]);
    expect(r.angle?.channel).toBe('shoulder_abd_r');
    expect(guidePlan(NONE, rig)?.groups.length).toBe(3);
  });

  it('the torque model with no muscles still gives an empty effort (no throw)', () => {
    const T: ExerciseGuide = { ...NONE, muscles: { ...NONE.muscles, effort: { model: 'torque', chain: ['shoulder_r'] } } };
    expect(readoutAt(T, rig, 'mistake', 500).effort).toEqual([]);
  });
});

// A4: GU-7a parity. Every assertion of the gate's GU-7a block (the stub on the chest press) has a twin in the V1-19
// block on a real guide file. A GU-7a assertion with no row, or a row whose twin is missing from the V1-19 block, fails.
// [the GU-7a assertion (its message after `${tag}`, by prefix), its V1-19 twin, what the twin checks]
const PARITY: [string, string, string][] = [
  [' A10: no www/assets/index-*.js', 'P1', 'a main chunk exists'],
  [' A10: ${f} (main chunk) holds form-guide code', 'P2', 'no form-guide code in the main chunk (FG-4 probes plus fg19-), A5'],
  [' A10: www/assets/FormGuidePlayer-*.js is missing', 'P3', 'the player chunk exists and carries the V1-19 guides'],
  [' A10: ${chunk} is ${gz} B gzip', 'P4', 'the player chunk is under 150 KB gzip'],
  [' ${theme}: ${e.message}', 'P5', 'no page error'],
  [' ${theme} console:', 'P6', 'no console error'],
  [' A13 ${where}: expected 3 hotspots', 'P7', 'one hotspot per target and helper (2 on the lateral raise)'],
  [' A13 ${where}: hotspot ${s.m} hits', 'P8', 'each hotspot hits at least 44 × 44 px at 9 phases, 360 and 390 px (A3)'],
  [' A7 ${where}: the Play icon', 'P9', 'the Play icon is 20 × 20'],
  [' A7 ${where}: icons drawn off', 'P10', 'chrome icons keep their own size'],
  [' A7 ${where}: the player does not fit', 'P11', 'the player fits the sheet'],
  [' A7 ${where}: Play is', 'P12', 'Play is at least 44 px'],
  [' A7 ${where}: controls leave', 'P13', 'no control (nor the readout row) leaves the player'],
  [' A7 ${where}: controls overlap', 'P14', 'no control overlaps another or the readout row'],
  [' A7 ${where}: labels clipped', 'P15', 'no label or readout value clipped'],
  [' ${theme} A11:', 'P16', 'no guide on Today'],
  [' ${theme} A2: "How to do it" shows', 'P17', 'no button on the card of an exercise without a guide (bench press)'],
  [' ${theme} A3: "How to do it" still in the "..." sheet', 'P18', 'the "..." sheet does not list it'],
  [' ${theme}: the guide sheet did not open', 'P19', 'the sheet opens'],
  [' ${theme}: sheet title', 'P20', 'the sheet title names the exercise'],
  [' ${theme} A7: the player does not fit the sheet at 390 px', 'P21', 'fits at 390 px in all five themes'],
  [' A4: expected every animation', 'P22', 'every animation "running 12000 1 linear both" (the three reps chained)'],
  [' A4: 0.5x set playbackRate', 'P23', '0.5x sets every rate'],
  [' A4: no "Slow motion" pill', 'P24', 'the Slow motion pill'],
  [' A4: Pause did not freeze', 'P25', 'Pause freezes the figure, the guides and the readouts'],
  [' A4: after 3 reps expected finished', 'P26', 'finished after three reps'],
  [' A4: after 3 reps the arm', 'P27', 'the arm is back on the start pose'],
  [' A4: ended caption', 'P28', 'the ended caption and Replay'],
  [' A4: Replay did not restart', 'P29', 'Replay restarts from 0'],
  [' A4: no "Rep 1 of 3" pill', 'P30', 'Rep 1 of 3 after Replay'],
  [' A5: zoom ${chip} stopped', 'P31', 'the zoom chip keeps playing'],
  [' A5: zoom ${chip} subject leaves', 'P32', 'the working joint stays in the stage, above the tip, over 41 phases'],
  [' A5: zoom ${chip} shows no caption', 'P33', 'the zoom tip shows'],
  [' 5.12:', 'P34', 'the caption is aria-live="polite"'],
  [' A13: tapping the chest shows no bubble', 'P35', 'tapping the target opens its bubble'],
  [' A13: bubble text', 'P36', "the bubble's exact line and bold name"],
  [' A13: dot ${bub.dot}', 'P37', "the dot in the muscle's tint colour"],
  [' A13: .sel outline', 'P38', 'the outline on the tapped muscle only'],
  [' A13: a tap on the bubble closed it', 'P39', 'a tap on the bubble keeps it'],
  [' A13: a second tap on the chest', 'P40', 'a second tap closes it'],
  [' A13: a tap on the stage background', 'P41', 'a tap on the stage closes it'],
  [' A13: the chip did not replace', 'P42', 'a zoom chip replaces the muscle bubble'],
  [' A13: the outline stayed', 'P43', 'and clears the outline'],
  [' A13: a second chip tap', 'P44', 'a second chip tap leaves no bubble'],
  [' A6: Pictures', 'P45', "Pictures: four tiles with the file's captions, no hotspot, no readouts, the hint"],
  [' A4: closing left', 'P46', 'closing the sheet cancels every animation'],
  [' ${w} px: the guide did not open', 'P47', 'opens at 320 and 360 px (fit, hotspots at 360, tag, stage size)'],
  [' A6: the guide did not open under reduced motion', 'P48', 'opens under reduced motion'],
  [' A6: reduced motion', 'P49', 'reduced motion: Pictures, no animate() call, no readouts, the reason (A6)'],
  [' A6: the Path still', 'P50', 'the zoom still under reduced motion'],
  [' A9: no "Demo could not load."', 'P51', 'a failed chunk shows the failure line'],
  [' A9: failure sheet', 'P52', 'with the title and Reload'],
  [' A9: the sheet closed', 'P53', 'and the sheet stays open'],
];

describe('V1-19 A4: every GU-7a assertion maps to a passing V1-19 assertion', () => {
  const gate = readFileSync(join(ROOT, 'scripts/screenshot-gate.mjs'), 'utf8');
  const between = (a: string, b: string) => { const i = gate.indexOf(a), j = gate.indexOf(b, i + 1); expect(i).toBeGreaterThan(0); expect(j).toBeGreaterThan(i); return gate.slice(i, j); };
  const gu7a = between('// GU-7a-2: the form guide', '// FG-4: the ExerciseGuide player');
  const v119 = between('// V1-19: the player standard', '\n// BUG-17');
  const pushed = (block: string) => [...block.matchAll(/errors\.push\(`\$\{tag\}([^`]*)`/g)].map(m => m[1]!);

  it('the GU-7a block has its 53 assertions, each matched by exactly one row', () => {
    const asserts = pushed(gu7a);
    expect(asserts.length).toBe(53);
    for (const a of asserts) expect(PARITY.filter(([p]) => a.startsWith(p)).map(r => r[1]), a).toHaveLength(1);
    for (const [p] of PARITY) expect(asserts.some(a => a.startsWith(p)), p).toBe(true);
  });

  it('each twin is an assertion of the V1-19 block, and each is distinct', () => {
    expect(v119).toContain("const tag = 'V1-19';");
    const ids = new Set(pushed(v119).map(a => /^ (P\d+)\b/.exec(a)?.[1]).filter(Boolean));
    for (const [, id] of PARITY) expect(ids.has(id), id).toBe(true);
    expect(new Set(PARITY.map(r => r[1])).size).toBe(PARITY.length);
  });
});

describe('V1-19: the guide layer adds no SVG <text> to the scene', () => {
  it("FG-4's dumbbell-label probe reads every `.fg4-scene text`, so the tag's number is HTML in a foreignObject", () => {
    const g = guideMarkup(guidePlan(LR, rig)!);
    expect(g).not.toMatch(/<text[\s>]/);
    expect(g).toMatch(/<foreignObject[^>]*><div class="fg19-tag-t">0°<\/div><\/foreignObject>/);
  });
});
