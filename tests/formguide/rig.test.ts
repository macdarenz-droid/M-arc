// GU-7a-1 step 3: the ported rig recomputes the demo's key tables (R1-11 equality: key-table numbers as the demo writes
// them, 2 decimals, fu/ff 3), and its pure helpers behave as the demo's.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { minJerk, n2, n3, n4, pace, progress, solve3 } from '@/formguide/rig/math';
import { FR, SIDE, TOP, LEN } from '@/formguide/rig/parts';
import { RIG_CSS, RIG_TOKENS, rigVars } from '@/formguide/rig/paint';
import { SAMPLES, stopsFor } from '@/formguide/rig/stops';
import { chestPress } from '@/formguide/moves/machineChestPress';
import { lateralRaise } from '@/formguide/moves/dumbbellLateralRaise';
import { latPulldownRig } from '@/formguide/moves/latPulldown';
import { latPulldownStage } from '@/formguide/scenes/latPulldown';
import { sampleMove } from '@/formguide/moves/sample';
import { latPulldown } from '@/formguide/moves/latPulldown';

const poses = (id: string) => JSON.parse(readFileSync(new URL(`./fixtures/${id}.poses.json`, import.meta.url), 'utf8')) as { keyTable: unknown[] };

describe('rig maths (rig-final/gen.mjs)', () => {
  it('rounds as the demo writes: n2/n3/n4, never "-0"', () => {
    expect([n2(1.005), n2(-0.001), n3(2.0004), n4(-0.00004), n4(12.34567)]).toEqual(['1', '0', '2', '0', '12.3457']);
  });
  it('timing: min-jerk lift 0-25 %, hold, return 37.5-87.5 %, reset', () => {
    expect([minJerk(0), minJerk(0.5), minJerk(1)]).toEqual([0, 0.5, 1]);
    expect([progress(0), progress(0.25), progress(0.3), progress(0.625), progress(0.875), progress(0.95)]).toEqual([0, 1, 1, 0.5, 0, 0]);
    expect(pace([1, 1, 1], 0)).toBe(0);
    expect(pace([1, 1, 1], 1)).toBeCloseTo(1, 12);
  });
  it('203 stops: 0.25 % in the lift, 0.5 % in the return, holds at their boundaries', () => {
    expect(SAMPLES).toHaveLength(203);
    expect(SAMPLES.slice(0, 3)).toEqual([0, 0.25, 0.5]);
    expect(SAMPLES.slice(100, 104)).toEqual([25, 37.5, 38, 38.5]);
    expect(SAMPLES.slice(-2)).toEqual([87.5, 100]);
    expect(stopsFor({ lift: 1.25, return: 0.5 })).toHaveLength(21 + 101 + 1);
  });
  it('solve3 keeps both bones full length in 3D and throws when the grip is out of reach', () => {
    const r = solve3([0, 0, 0], [30, 50, 10], 38, 40, [0, 1, 1]);
    const d = (a: number[], b: number[]) => Math.hypot(...a.map((x, i) => x - b[i]!));
    expect(d(r.E, [0, 0, 0])).toBeCloseTo(38, 9);
    expect(d(r.E, [30, 50, 10])).toBeCloseTo(40, 9);
    expect(() => solve3([0, 0, 0], [0, 90, 0], 38, 40, [0, 1, 0])).toThrow(/unreachable/);
  });
  it('part sets carry the demo numbers (spot checks) and the lat pulldown never changes the shared side torso', () => {
    expect(LEN).toEqual({ upperArm: 38, forearm: 40, torso: 62, thigh: 50, shin: 47, sole: 102 });
    expect(SIDE.joints.shoulder).toEqual([0, -62]);
    expect(TOP.joints.shoulderR).toEqual([22, 0]);
    expect(FR.upperArmR.base.length).toBeGreaterThan(3);
    const before = JSON.stringify(SIDE.torso);
    latPulldownStage(sampleMove(latPulldown));
    expect(JSON.stringify(SIDE.torso)).toBe(before);
    expect((SIDE.torso.regions || []).filter(r => r.flare)).toHaveLength(0);
  });
});

describe('key tables recomputed from the ported rig (R1-11)', () => {
  it('Machine Chest Press = anim-machine-chest-press/rig/poses.json chestPress.keyTable (the player\'s patched rig)', () => {
    const k = chestPress.keyTable();
    expect(k).toEqual(poses('machineChestPress').keyTable);
    // row 0 as the card names it
    expect(k[0]).toMatchObject({ grip: ['181', '155.44', '42.99'], elbow: ['144.5', '166', '30.49'], lever: '13', inside: '88.03' });
  });
  it('Dumbbell Lateral Raise = rig-final/poses.json lateralRaise.keyTable', () => {
    const k = lateralRaise.keyTable();
    expect(k).toEqual(poses('dumbbellLateralRaise').keyTable);
    expect(k[0]).toMatchObject({ A: '12', inside: '165', gripR: ['206.81', '171.11'] });
  });
  it('Lat Pulldown = anim-lat-pulldown/poses.json latPulldown.keyTable', () => {
    expect(latPulldownRig.keyTable()).toEqual(poses('latPulldown').keyTable);
  });
});

describe('paint tokens (R1-12)', () => {
  it('rigVars gives the demo values for dark and light', () => {
    expect(rigVars('dark')).toBe('--fg-line:color-mix(in srgb,var(--text) 60%,var(--surface-1));--fg-frame:color-mix(in srgb,var(--text) 38%,var(--surface-1));--lit:var(--text);--shd:var(--bg);--hi:90%;--lo:78%;--eq-hi:82%;--rim-k:62%');
    expect(rigVars('light')).toBe('--fg-line:color-mix(in srgb,var(--text) 70%,var(--surface-1));--fg-frame:color-mix(in srgb,var(--text) 56%,var(--surface-1));--lit:var(--bg);--shd:var(--text);--hi:76%;--lo:84%;--eq-hi:40%;--rim-k:35%');
  });
  it('RIG_CSS and RIG_TOKENS hold no colour literal: tokens and color-mix only', () => {
    for (const css of [RIG_CSS, RIG_TOKENS]) {
      expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}(?![\w-])/);
      expect(css).not.toMatch(/\b(rgba?|hsla?)\(/);
    }
    expect(RIG_TOKENS.split('\n')).toHaveLength(33);   // --sw plus the 32 tokens from --fg-line to --seam
    expect(RIG_CSS).toContain('.j{transform-box:view-box}');
    expect(RIG_CSS).not.toMatch(/animation|@keyframes|\.ov\{|\.hot\{|\.sel/);
  });
});
