// LIB-PLATEFIX-3 (card verify/lib-platefix-3-card.md; plan ruled #405 6682844211): the lb2 / lb3 plate fixes.
//  item 15 (label only): incline_barbell_bench_press draws one bench-angle label (W4 L7 [3,3,3], w4-findings set b T08 c1).
//  item 20 (plate part): incline_dumbbell_press (LB2 copy) outlines the faulted trunk dashed (W4 L5 [3,3,3], set c T01).
// Every test reads what the engine draws. Each has a mutation that restores main's value and turns it red.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 120_000;
let plate: any, ibp: any, idpMod: any;
beforeAll(async () => {
  plate = await import(/* @vite-ignore */ lib('../vendor/engine/plate.mjs'));
  ibp = (await import(/* @vite-ignore */ lib('specs/incline_barbell_bench_press.mjs'))).default;
  idpMod = await import(/* @vite-ignore */ lib('specs/incline_dumbbell_press__lb2.mjs'));
}, T);

const num = (s: string) => s.match(/-?[\d.]+/g)!.map(Number);

/** Item 15 problems: the arc has a title (a second label), or the 'bench' leader does not end on the arc's pad end. */
function benchLabelProblems(spec: any): string[] {
  const r = plate.renderPlate(spec, { id: 'x' }), bad: string[] = [];
  const lab = /plate-arc-label[^>]*><b>([^<]*)<\/b><span>([^<]*)<\/span>/.exec(r.overlay);
  if (!lab) return ['no arc label'];
  if (lab[1] !== '') bad.push(`arc title "${lab[1]}" (a second label for the Bench at 30° checkpoint)`);
  if (lab[2] !== '30°') bad.push(`arc value "${lab[2]}"`);
  const arc = num(/<path class="arc measure" d="([^"]+)"/.exec(r.svg)![1]!);
  const padEnd = arc.slice(-2);   // M vertex L from A rx ry rot large sweep x y: the arc's end on the pad line
  const leaders = [...r.svg.matchAll(/<path class="leader[^"]*" d="M(-?[\d.]+) (-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
  const L = r.report.labels.find((l: any) => l.key === 'bench');
  if (!L) bad.push('no bench callout');
  if (!leaders.some(p => Math.hypot(p[0]! - padEnd[0]!, p[1]! - padEnd[1]!) <= 1)) bad.push(`no leader ends on the arc's pad end (${padEnd})`);
  return bad;
}

describe('LIB-PLATEFIX-3 item 15: incline_barbell_bench_press one bench-angle label', { timeout: T }, () => {
  it('the arc shows only its 30° value, and the Bench at 30° leader ends on the arc', () => {
    expect(benchLabelProblems(ibp)).toEqual([]);
  });
  it('mutation: main\'s measure title "Bench" and leader at onPadBack(0.62) are red', () => {
    const m = { ...ibp, measure: { ...ibp.measure, title: 'Bench' } };
    expect(benchLabelProblems(m).some(b => /arc title "Bench"/.test(b))).toBe(true);
    const c = ibp.callouts.find((x: any) => x.key === 'bench'), a = c.anchor;   // ARC_END; main's anchor sat 0.58 m further up the pad
    const up = [0, Math.cos(60 * Math.PI / 180), -Math.sin(60 * Math.PI / 180)];   // BACK 60 from vertical, reclined toward -z
    const old = { ...ibp, callouts: ibp.callouts.map((x: any) => (x.key === 'bench' ? { ...x, anchor: a.map((v: number, i: number) => v + up[i]! * 0.40) } : x)) };
    expect(benchLabelProblems(old).some(b => /no leader ends on the arc/.test(b))).toBe(true);
  });
  it('the arc still measures 30° (c1)', () => {
    expect(plate.renderPlate(ibp, { id: 'x' }).report.measure.drawnDeg).toBeCloseTo(30, 0);
  });
});

/** Item 20 problems: the faulted trunk is not outlined, or the lumbar gap off the pad is under 15 px (critics: 15-20 px). */
function archProblems(spec: any, info: any): string[] {
  const m = plate.renderPlate(spec, { id: 'x', mistake: true }), bad: string[] = [];
  const i = m.svg.indexOf('m-pose'), pose = i < 0 ? '' : m.svg.slice(i, m.svg.indexOf('</g>', i));
  if (!/href="#[^"]*-torso"/.test(pose)) bad.push('faulted torso not outlined');
  const px = info.lowBackGapCm / 100 * m.report.camera.pxPerM;
  if (px < 15) bad.push(`lumbar gap ${px.toFixed(1)} px < 15`);
  if (info.buttockGapCm !== 0) bad.push(`buttock ${info.buttockGapCm} cm off the pad (c4)`);
  return bad;
}

describe('LIB-PLATEFIX-3 item 20: incline_dumbbell_press Mistake trunk outlined', { timeout: T }, () => {
  it('the faulted trunk is a dashed outline, the low back 15+ px off the pad, the buttocks on it', () => {
    expect(archProblems(idpMod.default, idpMod.mistakeInfo())).toEqual([]);
  });
  it('mutation: main\'s parts (legs only) are red', () => {
    const s = idpMod.default, old = { ...s, mistake: { ...s.mistake, parts: ['leg.r', 'leg.l'] } };
    expect(archProblems(old, idpMod.mistakeInfo())).toEqual(['faulted torso not outlined']);
  });
  it('mutation: a 10 cm smaller arch peak is red', () => {
    const info = { ...idpMod.mistakeInfo() }; info.lowBackGapCm -= 10;
    expect(archProblems(idpMod.default, info).some(b => /lumbar gap/.test(b))).toBe(true);
  });
});

// Items 17 (sumo_deadlift, ruled #405 6683313760 (a)) and the W4 addition one_arm_dumbbell_row (#391 6682975122; ruled
// #405 6683319630 item 7): measured on the drawn landmarks with the render's own camera.
describe('LIB-PLATEFIX-3 item 17 and one_arm_dumbbell_row', { timeout: T }, () => {
  let qe: any, bd: any, eqm: any; const S: Record<string, any> = {};
  beforeAll(async () => {
    [bd, eqm, qe] = await Promise.all(['../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'qa/engine.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    for (const id of ['sumo_deadlift', 'conventional_deadlift', 'one_arm_dumbbell_row']) S[id] = (await import(/* @vite-ignore */ lib(`specs/${id}.mjs`))).default;
  }, T);
  const px = (spec: any) => { const cam = qe.cameraOf(spec, plate.renderPlate(spec, { id: 'x' }).report), L = qe.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eqm.PRIMITIVES, body: bd }, spec).lm;
    return (pose: string, k: string) => cam.P(L[pose][k]) as number[]; };
  const trunk = (P: any, pose: string) => { const s = P(pose, 'shoulder.r'), h = P(pose, 'hip.r'); return Math.atan2(Math.abs(s[0] - h[0]), h[1] - s[1]) * 180 / Math.PI; };
  it('sumo: the floor trunk is 9-11 deg more upright than conventional\'s (c4 "5-10 degrees", its maximum; main 7.5)', () => {
    const d = trunk(px(S.conventional_deadlift), 'end') - trunk(px(S.sumo_deadlift), 'end');
    expect(d, `${d.toFixed(2)} deg`).toBeGreaterThanOrEqual(9);
    expect(d).toBeLessThanOrEqual(11);
  });
  it('sumo: the higher-hips Mistake is re-solved from the new floor start (hips up, the bar still reached)', () => {
    const P = px(S.sumo_deadlift);
    expect(P('end', 'hip.r')[1]! - P('mistake', 'hip.r')[1]!).toBeGreaterThan(10);
    expect(trunk(P, 'mistake')).toBeGreaterThan(trunk(P, 'end') + 5);
  });
  const segd = (p: number[], a: number[], b: number[]) => { const ab = [b[0]! - a[0]!, b[1]! - a[1]!], t = Math.max(0, Math.min(1, ((p[0]! - a[0]!) * ab[0]! + (p[1]! - a[1]!) * ab[1]!) / (ab[0]! ** 2 + ab[1]! ** 2)));
    return Math.hypot(p[0]! - a[0]! - t * ab[0]!, p[1]! - a[1]! - t * ab[1]!); };
  /** The red arm as drawn: its joints moved by the spec's MIST_OFF, each >= 10 px from the support arm (main: elbow 1.0). */
  const offProblems = (spec: any, off: number[]) => {
    const P = px(spec), s = P('end', 'shoulder.l'), e = P('end', 'elbow.l'), w = P('end', 'wrist.l'), bad: string[] = [];
    for (const k of ['elbow.r', 'wrist.r', 'grip.r']) { const q = P('mistake', k), p = [q[0]! + off[0]!, q[1]! + off[1]!], d = Math.min(segd(p, s, e), segd(p, e, w)); if (d < 10) bad.push(`${k} ${d.toFixed(1)} px`); }
    const t = spec.mistake.tells.find((x: any) => x.key === 'short');
    if (JSON.stringify(t.anchor.off) !== JSON.stringify(off)) bad.push('the "Arm not straight" leader is not on the red arm');
    return bad;
  };
  it('one_arm_dumbbell_row: the red arm clears the support arm by >= 10 px at the elbow, wrist and grip, its leader on it', async () => {
    const m = await import(/* @vite-ignore */ lib('specs/one_arm_dumbbell_row.mjs'));
    expect(offProblems(S.one_arm_dumbbell_row, m.MIST_OFF)).toEqual([]);
    expect(offProblems(S.one_arm_dumbbell_row, [0, 0]).some(b => /elbow\.r/.test(b))).toBe(true);   // mutation: main's unshifted arm
  });
});
