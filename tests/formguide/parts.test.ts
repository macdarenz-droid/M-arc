// FG-5: the free-weight parts library (docs/FORM-GUIDE-PRODUCTION.md §4, card FG-5): A1 budgets and tokens, A2 plates
// follow the load, A3 anchors and the machine-check hook, A4 the lateral raise with the library dumbbell.
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { THEME_IDS } from '@/theme/themes';
import type { ExerciseGuide } from '@/formguide/model';
import { KG_PER_LB } from '@/core/units';
import { figureFront, P2, SH_L, SH_R, LEG_X } from '@/formguide/rig/figureFront';
import { mix, themeReader } from '@/formguide/rig/paint';
import { CHECKS, runChecks, guideHash } from '@/formguide/check';
import { inputFor } from '@/formguide/check/node';
import { PARTS, rigFor, viewOf } from '@/formguide/check/view';
import { bbox, compile, countPaths, parseTransform } from '@/formguide/check/svg';
import { apply, frontFrame } from '@/formguide/rig/pose';
import { VIEWBOXES } from '@/formguide/model';
import { SWAY_DRIFT_DEG, poseAt } from '@/formguide/sample';
import library from '@/data/exercises.json';
import { lib_dumbbell_lateral_raise as LR } from '@/formguide/exercises/lib_dumbbell_lateral_raise';
import {
  FREE_WEIGHT_PARTS, PART_BUDGET_MARKUP, PART_GRAD, PART_SHAPES, VARIANTS, MAX_DRAWN, asDrawing, barbell, bench, box, dumbbell,
  dumbbellFar, dumbbellNear, ezBar, headScale, kettlebell, loadBar, loosePlate, partDefs, place, plateSize, pullUpBar, rack,
  restHeight, shapeCount, type Part,
} from '@/formguide/parts';
import { RIG_MM, UNITS_PER_M, mm } from '@/formguide/parts/kit';
import { colourLiterals } from './colourLint';

const g = PART_GRAD;
const EX = 'src/formguide/exercises/lib_dumbbell_lateral_raise.ts';

describe('A1 each part stays within 25 shapes and paints from tokens only', () => {
  const all = FREE_WEIGHT_PARTS.flatMap(id => VARIANTS[id]().map((p, i) => [`${id}#${i} (${p.view})`, p] as const));
  it.each(all)('%s', (_, p) => {
    const n = shapeCount(p.svg);
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThanOrEqual(PART_SHAPES);
    expect(countPaths(p.svg)).toBeLessThanOrEqual(PART_SHAPES);
    expect(colourLiterals(p.svg)).toEqual([]);
    // Every paint is a token, the part gradient or none.
    const paints = [...p.svg.matchAll(/\s(?:fill|stroke)="([^"]*)"/g)].map(m => m[1]!);
    expect(paints.filter(v => !/^(?:none|var\(--(?:ink|iron|iron-hi|iron-sh)\)|url\(#fgp-i\))$/.test(v))).toEqual([]);
  });
  it('the budget markup the checks read is each part\'s biggest drawing (path counts recorded in the PR)', () => {
    const counts = Object.fromEntries(FREE_WEIGHT_PARTS.map(id => [id, shapeCount(PART_BUDGET_MARKUP[id])]));
    console.info('FG-5 shapes per part (worst case):', JSON.stringify(counts));
    for (const id of FREE_WEIGHT_PARTS) {
      expect(PARTS[id]).toBe(PART_BUDGET_MARKUP[id]);
      expect(counts[id]).toBe(Math.max(...VARIANTS[id]().map(p => shapeCount(p.svg))));
    }
  });
  it('the part gradient is the theme\'s iron tokens in every theme', () => {
    for (const t of THEME_IDS) {
      const read = themeReader(t), d = partDefs(read);
      const stops = [...d.matchAll(/stop-color="([^"]+)"/g)].map(m => m[1]);
      expect(new Set(stops)).toEqual(new Set((['iron-hi', 'iron', 'iron-sh'] as const).map(k => mix(read, k, 'white', 0))));
    }
  });
  it('the shape counter counts every drawing element, not only paths', () => {
    expect(shapeCount('<path d=""/><rect/><circle/><ellipse/><polygon/><polyline/><line/><text>x</text><g></g>')).toBe(7);
  });
  it('parts are in the rig\'s units and meet its shoulders and feet', () => {
    expect(UNITS_PER_M).toBe(P2);
    expect(mm(RIG_MM.shoulders)).toBeCloseTo(SH_R[0] - SH_L[0], 1);
    expect(mm(RIG_MM.stance)).toBeCloseTo(2 * (LEG_X - 200), 1);
  });
});

/** Plate values per side as the markup draws them (front: both sides; side: the near side). */
const drawnValues = (p: Part & { load: ReturnType<typeof loadBar> }) => p.load.drawn.map(x => x.value);
const plateCount = (svg: string, side: 'l' | 'r') => (svg.match(new RegExp(`class="fg-plate fg-plate-${side}"`, 'g')) ?? []).length;

describe('A2 the plate count follows the load', () => {
  const lb = (v: number) => v * KG_PER_LB;
  const CASES: [string, number, 'kg' | 'lb', number[], number][] = [
    ['0 kg: the empty bar (20 kg over)', 0, 'kg', [], -20],
    ['20 kg: the bar alone', 20, 'kg', [], 0],
    ['60 kg', 60, 'kg', [20], 0],
    ['62.5 kg: an odd change plate', 62.5, 'kg', [20, 1.25], 0],
    ['100 kg: 25 + 15', 100, 'kg', [25, 15], 0],
    ['102 kg: not loadable, 2 kg short', 102, 'kg', [25, 15], 2],
    ['140 kg: three plates a side', 140, 'kg', [25, 25, 10], 0],
    ['0 lb: the empty 45 lb bar', 0, 'lb', [], -lb(45)],
    ['95 lb', lb(95), 'lb', [25], 0],
    ['135 lb', lb(135), 'lb', [45], 0],
    ['185 lb', lb(185), 'lb', [45, 25], 0],
    ['225 lb', lb(225), 'lb', [45, 45], 0],
    ['230 lb: 2.5 lb odd plate', lb(230), 'lb', [45, 45, 2.5], 0],
  ];
  it.each(CASES)('%s', (_, kg, unit, perSide, short) => {
    for (const view of ['front', 'side'] as const) {
      const b = barbell({ g, kg, view, profile: { unit } });
      expect(drawnValues(b)).toEqual(perSide);
      expect(b.load.hidden).toBe(0);
      expect(b.load.breakdown.remainderKg).toBeCloseTo(short, 2);
      expect(plateCount(b.svg, 'r')).toBe(perSide.length);
      expect(plateCount(b.svg, 'l')).toBe(view === 'front' ? perSide.length : 0);
    }
  });
  it('front plates stand inner (biggest) to outer at their drawn sizes', () => {
    const b = barbell({ g, kg: 62.5 }), heights = [...b.svg.matchAll(/class="fg-plate fg-plate-r" d="M[-\d.]+ [-\d.]+h[-\d.]+v([-\d.]+)/g)].map(m => +m[1]!);
    expect(heights).toEqual([20, 1.25].map(v => mm(plateSize(v, 'kg').diaMm)));
    expect(plateSize(25, 'kg').diaMm).toBe(450);
    expect(plateSize(45, 'lb').diaMm).toBe(450);
    expect(plateSize(1.25, 'kg').diaMm).toBeLessThan(plateSize(2.5, 'kg').diaMm);
  });
  it('the gym\'s own plate set and bar weight are used (Plate Sense)', () => {
    const b = barbell({ g, kg: 60, profile: { unit: 'kg', barKg: 15, plates: [10, 5] } });
    expect(drawnValues(b)).toEqual([10, 10]);
    expect(b.load.breakdown.remainderKg).toBeCloseTo(5, 2);
  });
  it('a load past the sleeve or the budget draws what fits and counts the rest', () => {
    const b = barbell({ g, kg: 500 }), sleeve = b.load.drawn.reduce((a, p) => a + p.w, 0);
    expect(b.load.drawn.length).toBeLessThanOrEqual(MAX_DRAWN);
    expect(sleeve).toBeLessThanOrEqual(mm(415) + 1e-6);
    expect(b.load.drawn.length + b.load.hidden).toBe(b.load.breakdown.perSide.reduce((a, p) => a + p.count, 0));
    expect(b.load.hidden).toBeGreaterThan(0);
    expect(plateCount(b.svg, 'r')).toBe(b.load.drawn.length);
  });
  it('a gym with only small plates draws at most MAX_DRAWN a side, inside the budget', () => {
    const b = barbell({ g, kg: 120, profile: { unit: 'kg', plates: [2.5] } });
    expect(b.load.breakdown.perSide).toEqual([{ value: 2.5, unit: 'kg', count: 20 }]);
    expect(b.load.drawn.length).toBe(MAX_DRAWN);
    expect(b.load.hidden).toBe(20 - MAX_DRAWN);
    expect(shapeCount(b.svg)).toBeLessThanOrEqual(PART_SHAPES);
  });
  it('the bar rests on its biggest plate', () => {
    expect(restHeight(barbell({ g, kg: 60 }).load)).toBeCloseTo(mm(225), 1);
    expect(restHeight(barbell({ g, kg: 20 }).load)).toBeCloseTo(mm(25), 1);
  });
  it('the EZ bar weighs 10 kg unless the gym says otherwise', () => {
    expect(drawnValues(ezBar({ g, kg: 30 }))).toEqual([10]);
    expect(drawnValues(ezBar({ g, kg: 25 }))).toEqual([5, 2.5]);
    expect(drawnValues(ezBar({ g, kg: 25, profile: { unit: 'kg', barKg: 7 } }))).toEqual([5, 2.5, 1.25]);
    expect(plateCount(ezBar({ g, kg: 25 }).svg, 'l')).toBe(2);
  });
  it('a loose plate, a dumbbell\'s heads and a kettlebell\'s label follow the load', () => {
    const r = (p: Part) => Math.abs(p.anchors.hand_r![0]);
    expect(r(loosePlate({ g, value: 25, unit: 'kg' }))).toBeGreaterThan(r(loosePlate({ g, value: 5, unit: 'kg' })));
    expect(headScale(7)).toBe(1);
    expect(headScale(undefined)).toBe(1);
    expect(headScale(20)).toBeCloseTo(Math.cbrt(20 / 7), 6);
    expect(headScale(60)).toBe(1.6);
    expect(headScale(1)).toBe(0.75);
    const k = headScale(20), first = (svg: string) => +/points="([-\d.]+),/.exec(svg)![1]!;
    expect(first(dumbbellNear(g, 20, 20))).toBeCloseTo(7 * k + 20 * k * Math.cos(Math.PI / 6), 0);
    expect(first(dumbbellNear(g, 20))).toBeCloseTo(7 + 20 * Math.cos(Math.PI / 6), 1);   // no size: the lab's heads
    expect(dumbbell({ g, kg: 20 }).svg).toContain(dumbbellNear(g, 20, 20));   // on its own the part is sized by its load
    expect(first(dumbbellNear(g, 7))).toBeCloseTo(7 + 20 * Math.cos(Math.PI / 6), 1);
    expect(kettlebell({ g, kg: 24 }).svg).toContain('>24</text>');
  });
});

describe('A3 anchors for hand, back, shoulder and foot', () => {
  it('every part names its anchors', () => {
    const keys = (p: Part) => Object.keys(p.anchors).sort();
    for (const view of ['front', 'side'] as const) {
      expect(keys(barbell({ g, kg: 60, view }))).toEqual(['hand_l', 'hand_r', 'shoulder_l', 'shoulder_r']);
      expect(keys(ezBar({ g, kg: 30, view }))).toEqual(['hand_l', 'hand_r']);
      for (const p of [dumbbell({ g, view }), kettlebell({ g, view }), loosePlate({ g, value: 20, unit: 'kg', view }), pullUpBar({ g, view })]) expect(keys(p)).toEqual(['hand_l', 'hand_r']);
      expect(keys(bench({ g, view }))).toEqual(['back', 'hip']);
      expect(keys(rack({ g, view }))).toEqual(['shoulder_l', 'shoulder_r']);
      expect(keys(box({ g, view }))).toEqual(['foot_l', 'foot_r', 'hip']);
    }
  });
  it('anchors sit where the part is gripped, leaned on or stood on', () => {
    const b = barbell({ g, kg: 60, gripMm: 500 });
    expect(b.anchors.hand_l).toEqual([-mm(500) / 2, 0]);
    expect(b.anchors.hand_r).toEqual([mm(500) / 2, 0]);
    expect(rack({ g, hookMm: 1400 }).anchors.shoulder_r![1]).toBe(-mm(1400));
    expect(box({ g, heightMm: 610 }).anchors.foot_l![1]).toBe(-mm(610));
    expect(pullUpBar({ g, barMm: 2400, gripMm: 600 }).anchors.hand_r).toEqual([mm(600) / 2, -mm(2400)]);
    const top = -mm(440);
    for (const angle of [-20, 0, 30, 45, 90]) {
      const p = bench({ g, angle }).anchors.back!, dx = p[0], dy = p[1] - top;
      expect(Math.hypot(dx, dy)).toBeCloseTo(mm(450), 1);
      expect(Math.atan2(-dy, -dx) * 180 / Math.PI).toBeCloseTo(angle, 1);   // up the pad from the hinge
    }
    expect(bench({ g, angle: 120 }).svg).toContain('data-angle="90"');
    expect(bench({ g, angle: -45 }).svg).toContain('data-angle="-20"');
  });
  it('the barbell\'s shoulders sit on its axis at the rig\'s shoulder joints (front) and at its centre (side) (review 1)', () => {
    const f = barbell({ g, kg: 60 }).anchors, sh = mm(RIG_MM.shoulders) / 2;
    expect(f.shoulder_l).toEqual([-sh, 0]);
    expect(f.shoulder_r).toEqual([sh, 0]);
    const s = barbell({ g, kg: 60, view: 'side' }).anchors;
    expect(s.shoulder_l).toEqual([0, 0]);
    expect(s.shoulder_r).toEqual([0, 0]);
  });
  it('every load label sits on the iron, so it reads in every theme (review 2)', () => {
    for (const id of FREE_WEIGHT_PARTS) for (const p of VARIANTS[id]()) {
      const irons = [...p.svg.matchAll(/<(?:path|polygon)\b[^>]*fill="url\(#fgp-i\)"[^>]*\/>/g)].map(m => bbox(compile(m[0]), {}));
      for (const t of p.svg.matchAll(/<text x="([-\d.]+)" y="([-\d.]+)"/g)) {
        const x = +t[1]!, y = +t[2]!;
        expect(irons.some(b => x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1), `${id} ${p.view} label at ${x},${y}`).toBe(true);
      }
    }
  });
  it('the bench\'s back pad is drawn at the angle its anchor follows', () => {
    for (const angle of [-20, 0, 45]) {
      const p = bench({ g, angle }), m = /<g transform="([^"]+)"><path d="M([-\d.]+) 0/.exec(p.svg)!;
      // The pad's top line runs from the hinge up to its head end; the anchor lies on it.
      const head = apply(parseTransform(m[1]!), [+m[2]!, 0]), hinge = apply(parseTransform(m[1]!), [0, 0]), a = p.anchors.back!;
      const cross = (head[0] - hinge[0]) * (a[1] - hinge[1]) - (head[1] - hinge[1]) * (a[0] - hinge[0]);
      expect(Math.abs(cross) / Math.hypot(head[0] - hinge[0], head[1] - hinge[1])).toBeLessThan(0.6);   // within a stroke
    }
  });
  it('place moves the anchors with the markup', () => {
    const p = place(barbell({ g, kg: 60 }), [120, 300], 30), m = parseTransform(/transform="([^"]+)"/.exec(p.svg)![1]!);
    const b = barbell({ g, kg: 60 });
    for (const k of ['hand_l', 'hand_r', 'shoulder_r'] as const) {
      const q = apply(m, b.anchors[k]!);
      expect(p.anchors[k]![0]).toBeCloseTo(q[0], 3);
      expect(p.anchors[k]![1]).toBeCloseTo(q[1], 3);
    }
  });

  // The hook: a free-weight part's anchors become the machine checks' pads and handle paths. A still lateral-raise figure
  // (no joint moves) meets each part placed at its rig points; moved 1 unit off, the same check fails with the number.
  // Still: breath held, and a sway curve that cancels the rig's built-in balance drift (sample.ts SWAY_DRIFT_DEG sin 2πu).
  const cancel = { keys: Array.from({ length: 961 }, (_, i) => [i / 960, -SWAY_DRIFT_DEG * Math.sin((2 * Math.PI * i) / 960)] as [number, number]) };
  const still = { ...LR, joints: { sway: cancel, breath: 1 }, movement: { breathe: LR.movement.breathe }, mistake: { ...LR.mistake, joints: { shoulder_abd: 10 } } } as ExerciseGuide;
  const rig = rigFor(still, viewOf(still, (library as { id: string; pattern?: string }[]).find(e => e.id === LR.id)?.pattern));
  if (typeof rig === 'string') throw new Error(rig);
  const f = rig.frame(poseAt(still, 0));
  const run = (drawing: ReturnType<typeof asDrawing>, check: 'handsOnHandle' | 'bodyOnPad', drive: string[] = []) => {
    const g2 = { ...still, machine: { id: 'fg5', settings: {}, drive: drive.map(part => ({ part, travel: [0, 0] as [number, number], chain: [] })) } } as ExerciseGuide;
    return runChecks({ ...inputFor(EX, g2), machines: { fg5: drawing } }, [check])[0]!;
  };
  const at = (a: Parameters<typeof rig.point>[1]) => rig.point(f, a);
  const off = (p: Part, dx: number) => place(p, [dx, 0]);

  it('handsOnHandle: a barbell held at both hands, on its bar path', () => {
    const hl = at('hand_l'), hr = at('hand_r');
    const bar = place(barbell({ g, kg: 60, gripMm: Math.hypot(hr[0] - hl[0], hr[1] - hl[1]) * 1000 / P2 }), [(hl[0] + hr[0]) / 2, (hl[1] + hr[1]) / 2]);
    const path: [[number, number], [number, number]] = [[0, 0], [0, -80]];
    const drive = ['bar_hand_l', 'bar_hand_r'];
    expect(run(asDrawing('front', [], { part: bar, path, name: 'bar' }), 'handsOnHandle', drive).fails).toEqual([]);
    const r = run(asDrawing('front', [], { part: off(bar, 1), path, name: 'bar' }), 'handsOnHandle', drive);
    expect(r.ok).toBe(false);
    expect(r.fails.join('\n')).toMatch(/hand_[lr] is 1 units from the bar_hand_[lr] anchor/);
  });
  it('bodyOnPad: feet on a box, the back on a bench, the shoulders under a racked bar and under a barbell', () => {
    const [fl, fr] = [at('foot_l'), at('foot_r')];
    const bx = place(box({ g, view: 'front' }), [(fl[0] + fr[0]) / 2, fl[1] - box({ g, view: 'front' }).anchors.foot_l![1]]);
    const feet = { ...bx, anchors: { foot_l: bx.anchors.foot_l, foot_r: bx.anchors.foot_r } };
    const bk = bench({ g, view: 'front' }), bp = place(bk, [at('back')[0] - bk.anchors.back![0], at('back')[1] - bk.anchors.back![1]]);
    const back = { ...bp, anchors: { back: bp.anchors.back } };
    const rk = rack({ g, view: 'front' }), sh = at('shoulder_r'), rp = place(rk, [sh[0] - rk.anchors.shoulder_r![0], sh[1] - rk.anchors.shoulder_r![1]]);
    const bb = barbell({ g, kg: 60 }), sr = at('shoulder_r'), bbp = place(bb, [sr[0] - bb.anchors.shoulder_r![0], sr[1] - bb.anchors.shoulder_r![1]]);
    const onBack = { ...bbp, anchors: { shoulder_l: bbp.anchors.shoulder_l, shoulder_r: bbp.anchors.shoulder_r } };
    for (const p of [feet, back, rp, onBack]) {
      expect(run(asDrawing('front', [p]), 'bodyOnPad').fails).toEqual([]);
      const r = run(asDrawing('front', [off(p, 1)]), 'bodyOnPad');
      expect(r.ok).toBe(false);
      expect(r.fails.join('\n')).toMatch(/(foot_[lr]|back|shoulder_[lr]) is 1 units off its pad/);
    }
  });
});

describe('A4 the lateral raise with the library dumbbell', () => {
  it('passes all 20 checks, and its stops hash is unchanged (the hash reads joint stops, not the dumbbell)', () => {
    const rs = runChecks(inputFor(EX, LR));
    expect(rs.map(r => r.check)).toEqual([...CHECKS]);
    expect(CHECKS.length).toBe(20);
    expect(rs.filter(r => !r.ok).flatMap(r => r.fails)).toEqual([]);
    expect(guideHash(LR)).toBe('c1ac61634cd68bd4');
  });
  // sha256 (16 hex) of figureFront(read, { id: 'fg0', mistake, dumbbell: { kg } }). Before FG-5 the figure drew the
  // dumbbell itself, and FG-5's library dumbbell drew the same bytes (these were the pins until V1-07):
  //   silent-black 7 false 67389874953d94d8, true 577e342e06219254; - false e58cbe89462a39c2, true b21767b82d02c89d
  //   paper 7 false 37c3821d98292523, true 98824e5d7a5f904a; - false e274c70d7ce2d679, true 7bc38c2d2a8d5a4d
  //   ember 7 false 6bed627f32c9c764, true 63a29b5faf955009; - false ead68ecca2f2f396, true e75a19af81650ebb
  //   emerald 7 false 73e3b50c2e56c528, true c4571bee3699b5c2; - false 3ea271d5de7c93ee, true 45acb2ebcc588f26
  //   midnight 7 false 16faf364a7d5956b, true 7878a27954524e44; - false 2ec53bfd6823dcfa, true 6210ba51bfa9ea69
  // V1-07 (D-V1-07b/c) draws no load label, outlines the clothes, lifts Midnight's body and gives each tint its
  // two-tone boundary, so the pins are the V1-07 drawing's; with no label, a load and no load draw the same bytes.
  const PINNED: Record<string, string> = {
    'silent-black false': 'da868dd2f3a51e4c', 'silent-black true': '4a33d4eb1fa9a8ac', 'paper false': '6a8470447d8b7a89', 'paper true': '2099c9d003425fd5',
    'ember false': '8d261aa32b233e9c', 'ember true': '73403bcb5fd6d0cb', 'emerald false': '792569b19c251586', 'emerald true': '46a86e537d6b9b52',
    'midnight false': '2d3fa3ed999e7eaa', 'midnight true': '97f10f7034c5c315',
  };
  it('the figure\'s markup is byte for byte V1-07\'s in all five themes, the same at 7 kg and with no load', () => {
    for (const t of THEME_IDS) for (const kg of [7, undefined]) for (const mistake of [false, true]) {
      const svg = figureFront(themeReader(t), { id: 'fg0', mistake, dumbbell: { kg } });
      expect(createHash('sha256').update(svg).digest('hex').slice(0, 16), `${t} ${kg ?? '-'} ${mistake}`).toBe(PINNED[`${t} ${mistake}`]);
    }
  });
  it('in the figure the heads keep the lab\'s size at any load, so the lateral raise stays in its frame (FG-4 passes the logged kg)', () => {
    const vb = VIEWBOXES.standingFront, lab = figureFront(themeReader('paper'), { id: 'fg0', dumbbell: { kg: 7 } });
    for (const kg of [12, 20, 60]) {
      const svg = figureFront(themeReader('paper'), { id: 'fg0', dumbbell: { kg } });
      expect(svg.replace(/>\d+<\/text>/g, '><\/text>')).toBe(lab.replace(/>\d+<\/text>/g, '><\/text>'));
      const c = compile(svg);
      for (const fig of ['correct', 'mistake'] as const) for (let i = 0; i <= 120; i++) {
        const b = bbox(c, frontFrame('standing', poseAt(LR, i / 120, fig) as never));
        expect(b.x0 >= vb[0] && b.y0 >= vb[1] && b.x1 <= vb[0] + vb[2] && b.y1 <= vb[1] + vb[3], `${kg} kg ${fig} u=${i / 120}: ${b.x0.toFixed(1)}..${b.x1.toFixed(1)}`).toBe(true);
      }
    }
  });
  it('the dumbbell on its own is the figure\'s far and near heads about the grip', () => {
    expect(dumbbell({ g, kg: 7 }).svg).toBe(`<g class="fg-part fg-part-dumbbell">${dumbbellFar(g, 7)}${dumbbellNear(g, 7)}</g>`);
    // V1-07 (D-V1-07b): in the figure the near head carries no load label (the player's readout shows the load)
    const fig = figureFront(themeReader('paper'), { id: 'fg0', dumbbell: { kg: 20 } });
    expect(fig).toContain(dumbbellNear('fg0-i'));
    expect(fig).not.toContain('</text>');
  });
});
