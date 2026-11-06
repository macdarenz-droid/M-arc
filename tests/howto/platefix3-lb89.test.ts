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
});
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
  it('dead_bug: hand and heel lightly touch (c4) in the cue and the alt, and the drawn GAP is 0', async () => {
    expect(cue('dead_bug', 'opposite').cue).toBe('Lower one arm and the opposite leg together until hand and heel lightly touch.');
    expect(S.dead_bug.alt).toContain('until hand and heel lightly touch the floor');
    expect(S.dead_bug.alt).not.toContain('just above the floor');
    const m = await import(/* @vite-ignore */ lib('specs/dead_bug.mjs'));
    expect(m.SIZES.GAP).toBe(0);
    const sizes = JSON.parse(readFileSync('tools/plates/library/lb9/sizes.json', 'utf8'));
    const row = Object.values(sizes).flatMap((v: any) => (v && typeof v === 'object' ? [v] : [])).find((v: any) => v.dead_bug?.GAP || v.GAP?.basis?.includes('lightly touch'));
    expect(row, 'lb9/sizes.json GAP row').toBeTruthy();
    expect(m.info().fistLowCm).toBe(0);
    expect(m.info().heelLowCm).toBe(0);
  });
  it('glute_bridge: one knee label, the "Knee about 90°" measure; no "Knees at 90" callout', () => {
    expect(S.glute_bridge.callouts.map((c: any) => c.key)).not.toContain('knee');
    expect(S.glute_bridge.measure).toMatchObject({ vertex: 'knee.r', title: 'Knee', value: 'about 90°', expect: 90 });
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
  it('standing_leg_curl: a red arrow points onto the arched low back', () => {
    expect(arrows('standing_leg_curl')).toEqual([expect.objectContaining({ to: expect.objectContaining({ along: ['backMid', 'sacrum'], pose: 'mistake' }) })]);
  });
});

describe('PF3 W7 hollow_body_hold leg label (#394 6683570453)', () => {
  it('one leg label, the "Legs about 15°" measure (c4); no "Legs low" callout beside the Mistake\'s "Legs too low"', () => {
    expect(S.hollow_body_hold.callouts.map((c: any) => c.key)).not.toContain('legs');
    expect(S.hollow_body_hold.callouts.some((c: any) => /Legs low/.test(c.text))).toBe(false);
    expect(S.hollow_body_hold.measure).toMatchObject({ vertex: 'hip.r', title: 'Legs', value: 'about 15°', expect: 15 });
  });
});
