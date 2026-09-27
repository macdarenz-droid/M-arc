// GU-7a-1 step 5: the unit gates of R1-5 for the 3 movements (A2, A3), in node, no browser.
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { sampleMove } from '@/formguide/moves/sample';
import { LIM, checkChannels, drawnAt, stopsFor } from '@/formguide/rig/stops';
import { progress } from '@/formguide/rig/math';
import { CP_OPT, chestPress, machineChestPress, makeChestPress } from '@/formguide/moves/machineChestPress';
import { dumbbellLateralRaise, lateralRaise } from '@/formguide/moves/dumbbellLateralRaise';
import { latPulldown, latPulldownRig } from '@/formguide/moves/latPulldown';
import type { Move, Truth } from '@/formguide/moves/types';
import type { Frame, Sample } from '@/formguide/rig/api';
import { guides } from '@/formguide/index';

const poses = (id: string) => JSON.parse(readFileSync(new URL(`./fixtures/${id}.poses.json`, import.meta.url), 'utf8'));
const MOVES: [string, Move][] = [['machineChestPress', machineChestPress], ['dumbbellLateralRaise', dumbbellLateralRaise], ['latPulldown', latPulldown]];

/** the rotate() angles a transform string sums to (smooth-check.cjs rotSum), or null when it has none */
const rotSum = (s: string | undefined): number | null => { let a = 0, hit = false; for (const m of (s || '').matchAll(/rotate\((-?[\d.e+-]+)deg\)/g)) { a += +m[1]!; hit = true; } return hit ? a : null; };
/** every rotating channel of a sample as [u, degrees] stops: what the browser sampler reads (smooth-check.cjs) */
const rotating = (s: Sample) => s.groups
  .filter(g => rotSum(g.frames[0]!.transform) !== null)
  .map(g => ({ name: g.className, stops: g.frames.map((f): [number, number] => [f.offset, rotSum(f.transform)!]) }));
const inRange = (t: Truth[]) => t.filter(x => !(x.value >= x.min && x.value <= x.max)).map(x => `${x.name} ${x.value.toFixed(2)} not in ${x.min}-${x.max}`);

describe('A2: smoothness', () => {
  it('Machine Chest Press: smoothNumbers equals the demo (a, b to 1e-4, c to 1e-2) and is under LIM', () => {
    const m = chestPress.smooth(), d = poses('machineChestPress').smooth;
    expect(Math.abs(m.a - d.a)).toBeLessThan(1e-4); expect(Math.abs(m.b - d.b)).toBeLessThan(1e-4); expect(Math.abs(m.c - d.c)).toBeLessThan(1e-2);
    expect(m.a).toBeLessThanOrEqual(LIM.a); expect(m.b).toBeLessThanOrEqual(LIM.b); expect(m.c).toBeLessThanOrEqual(LIM.c);
  });
  it('Dumbbell Lateral Raise: smoothNumbers equals the demo and is under LIM', () => {
    const m = lateralRaise.smooth(), d = poses('dumbbellLateralRaise').smooth;
    expect(Math.abs(m.a - d.a)).toBeLessThan(1e-4); expect(Math.abs(m.b - d.b)).toBeLessThan(1e-4); expect(Math.abs(m.c - d.c)).toBeLessThan(1e-2);
    expect(m.a).toBeLessThanOrEqual(LIM.a); expect(m.b).toBeLessThanOrEqual(LIM.b); expect(m.c).toBeLessThanOrEqual(LIM.c);
  });
  it('Lat Pulldown: the drawn-chain numbers equal the demo\'s smoothCheck per phase, (d) included, all under LIM', () => {
    const m = latPulldownRig.smooth(), d = poses('latPulldown').smoothCheck;
    for (const ph of ['lift', 'return']) {
      const a = m.phases[ph]!, b = d.phases[ph];
      expect(Math.abs(a.a - b.a)).toBeLessThan(1e-4); expect(Math.abs(a.b - b.b)).toBeLessThan(1e-4); expect(Math.abs(a.c - b.c)).toBeLessThan(1e-2);
      expect(a.a).toBeLessThanOrEqual(LIM.a); expect(a.b).toBeLessThanOrEqual(LIM.b); expect(a.c).toBeLessThanOrEqual(LIM.c);
    }
    expect(Math.abs(m.d.v - d.d.v)).toBeLessThan(1e-4);
    expect(m.d.v).toBeLessThanOrEqual(LIM.d);
  });
  for (const [id, move] of MOVES) {
    it(`${id}: smooth-check (a)-(d) on the sampled rotate channels, as the browser draws them`, () => {
      const r = checkChannels(rotating(sampleMove(move)));
      expect(r.rows.length).toBeGreaterThan(0);
      expect(r.a).toBeLessThanOrEqual(LIM.a);
      expect(r.b).toBeLessThanOrEqual(LIM.b);
      expect(r.c).toBeLessThanOrEqual(LIM.c);
      expect(r.d).toBeLessThanOrEqual(LIM.d);
    });
  }
  it('failure path: the chest press with stops every 1.25 % fails check (a)', () => {
    const coarse = sampleMove({ ...machineChestPress, stops: { lift: 1.25, return: 0.5 } });
    expect(coarse.stops).toHaveLength(stopsFor({ lift: 1.25, return: 0.5 }).length);
    expect(checkChannels(rotating(coarse)).a).toBeGreaterThan(LIM.a);
  });
});

describe('A3: truth ranges (spec.md 3.1, 3.2, 3.5)', () => {
  it('Machine Chest Press', () => expect(inRange(chestPress.truth())).toEqual([]));
  it('Dumbbell Lateral Raise', () => expect(inRange(lateralRaise.truth())).toEqual([]));
  it('Lat Pulldown', () => expect(inRange(latPulldownRig.truth())).toEqual([]));
  it('failure path: the chest press end grip 10 units further fails the pressed-elbow range', () => {
    const far = makeChestPress({ ...CP_OPT, X1: CP_OPT.X1 + 10 });
    const bad = inRange(far.truth());
    expect(bad.some(x => x.startsWith('pressed elbow inside angle'))).toBe(true);
  });
});

describe('R1-5 gates: equipment, fixed joints, glow, colours, determinism', () => {
  it('hand on the equipment between stops: chest press hand-to-handle gap under 0.5 (demo maxDrift)', () => {
    const md = chestPress.maxDrift();
    expect(md).toBeLessThan(0.5);
    expect(Math.abs(md - poses('machineChestPress').maxDrift)).toBeLessThan(1e-9);
  });
  it('hand on the equipment between stops: lat pulldown far fist, cable end and near hand within 0.5 (demo drift)', () => {
    const dr = latPulldownRig.drift(), d = poses('latPulldown').drift;
    for (const k of ['far', 'cable', 'nearPath'] as const) { expect(dr[k]).toBeLessThan(0.5); expect(Math.abs(dr[k] - d[k])).toBeLessThan(1e-9); }
  });
  it('the dumbbells and the lat bar ride inside the hand groups, so the hand never leaves them', () => {
    const lr = guides.lib_dumbbell_lateral_raise!.stage('dark').svg;
    for (const s of ['r', 'l']) expect(lr).toMatch(new RegExp(`<g class="j lr-fa-${s}">(?:(?!</g></g>).)*<g class="j anim lr-db-${s}">`, 's'));
    const lp = guides.lib_lat_pulldown!.stage('dark').svg;
    expect(lp).toMatch(/<g class="j anim lp-hd"><g class="j anim lp-bar">/);
  });
  it('fixed joints: the shoulders of the chest press and lateral raise only rotate (drift 0 < 0.01); the hips never move', () => {
    const only = (s: Sample, cls: string) => s.groups.find(g => g.className === cls)!.frames.every(f => /^rotate\([-\d.e]+deg\)$/.test(f.transform!));
    const cp = sampleMove(machineChestPress), lr = sampleMove(dumbbellLateralRaise);
    expect(only(cp, 'cp-ua')).toBe(true);
    expect(only(lr, 'lr-ua-r') && only(lr, 'lr-ua-l')).toBe(true);
    // the torso group and the figure are static in every scene: no channel moves them
    for (const s of [cp, lr, sampleMove(latPulldown)]) expect(s.groups.some(g => /torso|figure/.test(g.className))).toBe(false);
  });
  for (const [id, move] of MOVES) {
    it(`${id}: the glow rises through the lift, falls on the return, never steps more than 0.02 per 1/120 s`, () => {
      const g = sampleMove(move).groups.find(x => x.className === move.glow)!;
      const st = g.frames.map((f: Frame): [number, number] => [f.offset, f.opacity!]);
      const lift = st.filter(([u]) => u <= 0.25), ret = st.filter(([u]) => u >= 0.375 && u <= 0.875);
      for (let i = 1; i < lift.length; i++) expect(lift[i]![1]).toBeGreaterThanOrEqual(lift[i - 1]![1]);
      for (let i = 1; i < ret.length; i++) expect(ret[i]![1]).toBeLessThanOrEqual(ret[i - 1]![1]);
      let step = 0; for (let i = 0; i < 480; i++) step = Math.max(step, Math.abs(drawnAt(st, (i + 1) / 480) - drawnAt(st, i / 480)));
      expect(step).toBeLessThanOrEqual(0.02);
      expect(drawnAt(st, 0)).toBe(0); expect(drawnAt(st, 0.3)).toBe(1);
    });
  }
  it('colours token-only: every Guide.stage() string has no hex colour or rgb()/hsl() (A7 pattern)', () => {
    for (const g of Object.values(guides)) for (const sch of ['dark', 'light'] as const) {
      const st = g.stage(sch), all = st.svg + st.tiles + st.css + (g.insetHtml() ?? '') + g.rigVars(sch);
      expect(all, g.spec.id).not.toMatch(/#[0-9a-fA-F]{3,8}(?![\w-])/);
      expect(all, g.spec.id).not.toMatch(/\b(rgba?|hsla?)\(/);
    }
  });
  it('failure path: a hex colour in the stage markup is caught', () => {
    expect('<polygon class="b" style="fill:#ffffff"/>').toMatch(/#[0-9a-fA-F]{3,8}(?![\w-])/);
    expect('<g clip-path="url(#cp-ten-clip0)">').not.toMatch(/#[0-9a-fA-F]{3,8}(?![\w-])/);
  });
  it('deterministic: sample and stage hash to the recorded snapshot, twice', () => {
    const h = () => createHash('sha256').update(JSON.stringify(MOVES.map(([, m]) => sampleMove(m)))).update(Object.values(guides).map(g => { const s = g.stage('dark'); return s.svg + s.tiles + s.css; }).join('')).digest('hex');
    const a = h();
    expect(h()).toBe(a);
    expect(a.slice(0, 16)).toBe(HASH);
  });
  it('the progress of every stop is the min-jerk timing', () => {
    const s = sampleMove(machineChestPress);
    expect(s.stops.map(pc => progress(pc / 100))[100]).toBe(1);
  });
});
const HASH = 'ebe51d2f6ef475b1';
