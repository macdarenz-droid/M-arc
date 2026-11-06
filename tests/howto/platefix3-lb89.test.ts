// LIB-PLATEFIX-3 (PLAN ADDENDUM ruled #405 6683319630; W7 PANEL FIX #394 6682923012), the lb8 and lb9 items: plate copy,
// Mistake overlays and the v_up tempo. Each block reads the spec, the card or the drawn svg; main's files fail each one.
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const src = (id: string) => readFileSync(`tools/plates/library/specs/${id}.mjs`, 'utf8');
const IDS = ['lying_leg_curl', 'pendulum_squat', 'standing_leg_curl', 'glute_bridge', 'bird_dog', 'hollow_body_hold', 'dead_bug', 'cable_crunch', 'v_up'];
const S: Record<string, any> = {};
let plate: any;
beforeAll(async () => {
  plate = await import(/* @vite-ignore */ lib('../vendor/engine/plate.mjs'));
  for (const id of IDS) S[id] = (await import(/* @vite-ignore */ lib(`specs/${id}.mjs`))).default;
}, 600_000);
const cue = (id: string, key: string, list = 'callouts') => (list === 'tells' ? S[id].mistake.tells : S[id].callouts).find((c: any) => c.key === key);
const lineOf = (id: string, needle: string) => src(id).split('\n').find(l => l.includes(needle)) ?? '';
const arrows = (id: string) => S[id].mistake.guides.filter((g: any) => g.kind === 'arrow');

describe('PF3 W7 plate copy (lb8, lb9)', () => {
  it('lying_leg_curl alt: knees close to the bench edge (c1), not "just past"', () => {
    expect(S.lying_leg_curl.alt).toContain('the knees close to the bench edge');
    expect(S.lying_leg_curl.alt).not.toContain('just past');
  });
  it('bird_dog "Leg too high" cue: higher than the low back can hold (c7), no "past parallel"', () => {
    expect(cue('bird_dog', 'high', 'tells').cue).toBe('The leg lifts higher than the low back can hold.');
    expect(lineOf('bird_dog', "key: 'high'")).toMatch(/\/\/ c7\b/);
  });
  it('hollow_body_hold: the low-back cue cites c1 c2; the Mistake cue says "might put too much stress on the hip flexors" (c5)', () => {
    expect(lineOf('hollow_body_hold', "key: 'lowback'")).toMatch(/\/\/ c1 c2\b/);
    expect(cue('hollow_body_hold', 'low', 'tells').cue).toBe('Your legs sink too low, which might put too much stress on the hip flexors.');
  });
  it('cable_crunch "Curl the spine" cue cites c4 c5', () => {
    expect(lineOf('cable_crunch', "key: 'curl'")).toMatch(/\/\/ c4 c5\b/);
  });
  it('dead_bug: hand and heel lightly touch (c4) in the cue and the alt', () => {
    expect(cue('dead_bug', 'opposite').cue).toBe('Lower one arm and the opposite leg together until hand and heel lightly touch.');
    expect(S.dead_bug.alt).toContain('until hand and heel lightly touch the floor');
    expect(S.dead_bug.alt).not.toContain('just above the floor');
  });
});

describe('PF3 W7 v_up tempo [Lift, Lower] (D-SHIP-W4-TEMPO form: card, spec and strip row in one commit)', () => {
  it('the spec, the card tempo and the strip row all lift first', () => {
    expect(S.v_up.tempo.map((t: any) => t.phase)).toEqual(['Lift', 'Lower']);
    const card = JSON.parse(readFileSync('docs/research/howto/cards/v_up.json', 'utf8'));
    expect(card.tempo.map((t: any) => t.phase)).toEqual(['Lift', 'Lower']);
    const strip = JSON.parse(readFileSync('tools/plates/library/strip/rows.json', 'utf8'));
    const row = strip.fallbackA.find((r: any) => r.id === 'v_up');
    expect(row.rows.map((r: any) => r.phase)).toEqual(['Lift', 'Lower']);
  });
});

describe('PF3 W7 Mistake overlays (lb8, lb9)', () => {
  const arrowUp = (id: string) => { const a = arrows(id); return a.length === 1 && Array.isArray(a[0].from) && a[0].to[1] > a[0].from[1]; };
  it('dead_bug and v_up: only the arched trunk is outlined, and the floor gap is a red up-arrow (main: a dashed tick and every changed limb)', () => {
    for (const id of ['dead_bug', 'v_up']) {
      expect(S[id].mistake.parts, id).toEqual(['torso']);
      expect(arrowUp(id), id).toBe(true);
    }
  });
  it('v_up: the Mistake view leaves out the V start layer (D-HELD6-MGHOST)', () => {
    expect(S.v_up.mistakeGhosts).toBe(false);
  });
  it('pendulum_squat: the near shank and foot as dashed outlines with a heel up-arrow; no near-thigh outline (main: both legs, extra thigh line)', () => {
    const p = S.pendulum_squat.mistake;
    expect(p.parts).toEqual(['leg.l']);
    expect(p.guides.filter((g: any) => g.kind === 'dashed' && Array.isArray(g.pts[0]) && g.pts.length > 8).length).toBe(2);
    expect(arrows('pendulum_squat')).toEqual([expect.objectContaining({ from: expect.objectContaining({ at: 'heel.r', pose: 'end' }), to: expect.objectContaining({ at: 'heel.r', pose: 'mistake' }) })]);
    const m = plate.renderPlate(S.pendulum_squat, { id: 'pf3', mistake: true });
    expect((m.svg.match(/class="m-line[^"]*"/g) ?? []).length + (m.svg.match(/<path class="arrow/g) ?? []).length).toBeGreaterThan(0);
  });
  it('standing_leg_curl: a red arrow points onto the arched low back (round 2: at the lumbar apex)', () => {
    expect(arrows('standing_leg_curl')).toEqual([expect.objectContaining({ to: expect.objectContaining({ at: 'lumbar', pose: 'mistake' }) })]);
  });
});

// Mutations for the existing-test lines this card edits (D-PLATEFIX-PINS form, #405 6683313760)
describe('PF3 W7 pin-edit mutations', () => {
  it('lib-strip ROWS_PIN: v_up rows put back to [Lower, Lift] change the verified sha (red against the new pin)', async () => {
    const { createHash } = await import('node:crypto');
    const strip = JSON.parse(readFileSync('tools/plates/library/strip/rows.json', 'utf8')), sha = (x: any) => createHash('sha256').update(JSON.stringify(x)).digest('hex');
    expect(sha(strip)).toBe('2e1382e3460765e3d01f2286f80afb10e774402fd1743766ca4c33d10572815e');
    strip.fallbackA.find((r: any) => r.id === 'v_up').rows.reverse();
    expect(sha(strip)).not.toBe('2e1382e3460765e3d01f2286f80afb10e774402fd1743766ca4c33d10572815e');
  });
  it('lb8 pendulum guide kinds: dropping the heel arrow or an outline is red', () => {
    const kinds = (g: any[]) => g.map(x => x.kind), G = S.pendulum_squat.mistake.guides;
    expect(kinds(G)).toEqual(['dashed', 'dashed', 'arrow']);
    expect(kinds(G.slice(0, 2))).not.toEqual(['dashed', 'dashed', 'arrow']);
    expect(kinds(G.slice(1))).not.toEqual(['dashed', 'dashed', 'arrow']);
  });
  it('lb9 LUMBARTELL gap points: the up-arrow keeps the dashed tick\'s two points (on the floor, under the low back)', () => {
    for (const id of ['dead_bug', 'v_up']) {
      const a = S[id].mistake.guides[0];
      expect(a.kind, id).toBe('arrow');
      expect(a.from[1], id).toBe(0);
      expect(a.to[1], id).toBeGreaterThan(0.005);
      expect(a.to[2], id).toBe(a.from[2]);
    }
  });
});


// LIB-PLATEFIX-3 round 2 (plates panel #405 6685743439, D-LIB13-PANEL2): glute_bridge / hollow_body_hold callouts follow
// the edited cards (research-routes-3 2c82a0ca); hollow_body_hold R1; standing_leg_curl R2, R5, R11. Values read from the
// engine's landmarks (plate px at the render's camera); each block is red on 04c5a581's specs.
describe('PF3 round 2 lb8/lb9', () => {
  let eng: any, qaEng: any, body: any, eq: any;
  beforeAll(async () => {
    [eng, qaEng, body, eq] = await Promise.all(['engine.mjs', 'qa/engine.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  }, 600_000);
  const pxOf = (spec: any) => {
    const r = plate.renderPlate(spec, { id: 'pf3' }), cam = qaEng.cameraOf(spec, r.report), L = qaEng.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body }, spec);
    return { L, P: (pose: string, k: string) => cam.P(L.lm[pose][k]) as number[] };
  };
  it('glute_bridge and hollow_body_hold callouts are exactly the cards\' checkpoint labels, in card order', () => {
    for (const id of ['glute_bridge', 'hollow_body_hold']) {
      const card = JSON.parse(readFileSync(`docs/research/howto/cards/${id}.json`, 'utf8'));
      expect(S[id].callouts.map((c: any) => c.text.replace(/<br>/g, ' ')), id).toEqual(card.plate.checkpoints.map((c: any) => c.label));
    }
  });
  it('hollow_body_hold R1: no via ghost (it read as far limbs apart); the foot is pointed (ankle -50, the plantar flexion end) and the 15 deg arc clears the toe', () => {
    const s = S.hollow_body_hold, { L, P } = pxOf(s);
    expect(s.ghosts).toEqual({ count: 0 });
    expect(L.q.end.ankle.r).toBe(-50);
    const ang = (a: number[], b: number[]) => Math.atan2(-(b[1]! - a[1]!), b[0]! - a[0]!) * 180 / Math.PI;
    const off = ang(P('end', 'ankle.r'), P('end', 'toe.r')) - ang(P('end', 'knee.r'), P('end', 'ankle.r'));
    expect(off).toBeLessThanOrEqual(28);                                     // the foot 27 deg off the shin line (was 37)
    const toe = Math.hypot(...[0, 1].map(i => P('end', 'toe.r')[i]! - P('end', 'hip.r')[i]!));
    expect(s.measure.radius - toe).toBeGreaterThanOrEqual(5);               // the arc 5+ px beyond the toe
  });
  it('standing_leg_curl R5/R11: the arch is trunk.bow 12 (M_ARCH, not enlarged); the head stays (<= 1 px); the lumbar sits >= 3 px deeper off the back line; arrow, tell and dashed back on the lumbar', () => {
    const s = S.standing_leg_curl, { P } = pxOf(s);
    expect(s.mistake.pose).toEqual({ trunk: { flex: 0, bow: 12 } });
    expect(Math.hypot(...[0, 1].map(i => P('end', 'head')[i]! - P('mistake', 'head')[i]!))).toBeLessThanOrEqual(1);
    const dip = (pose: string) => { const a = P(pose, 'backUpper'), b = P(pose, 'buttock'), m = P(pose, 'lumbar');
      return Math.abs((b[0]! - a[0]!) * (m[1]! - a[1]!) - (b[1]! - a[1]!) * (m[0]! - a[0]!)) / Math.hypot(b[0]! - a[0]!, b[1]! - a[1]!); };
    expect(dip('mistake') - dip('end')).toBeGreaterThanOrEqual(3);
    expect(s.mistake.tells[0].anchor.at).toBe('lumbar');
    expect(s.mistake.guides[0].pts.map((p: any) => p.at)).toContain('lumbar');
  });
  it('standing_leg_curl R2: a column from the floor to the handle height in front of the handles, with arms to the handle and the thigh pad', async () => {
    const m = await import(/* @vite-ignore */ lib('specs/standing_leg_curl.mjs'));
    const lines = S.standing_leg_curl.equipment.filter((e: any) => e && typeof e === 'object' && !Array.isArray(e) && e.type !== 'floor' && !e.part);
    const ys = lines.flatMap((e: any) => (e.surface ?? e.pts ?? []).map((p: number[]) => p[1]));   // sideBar items carry their ends as `surface`
    expect(m.SIZES.COLUMN_DZ).toBe(0.35);
    expect(lines.length).toBeGreaterThanOrEqual(3);
    expect(Math.min(...ys)).toBeLessThanOrEqual(0.06);                        // the column stands on the floor beam
    expect(Math.max(...ys)).toBeGreaterThanOrEqual(1.0);                      // and reaches the handle height
  });
});
