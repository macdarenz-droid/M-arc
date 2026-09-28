// FG-1: the rig's data: joints and channels, the pattern → view table, AAOS limits, stored poses.
import { describe, expect, it } from 'vitest';
import exercises from '@/data/exercises.json';
import { CHANNELS, JOINTS, NAMED_CHANNELS, PARENT, both } from '@/formguide/rig/joints';
import { PATTERNS, viewFor } from '@/formguide/rig/patterns';
import { AAOS, AAOS_SOURCE, aaosTruth, inRange } from '@/formguide/rig/ranges';
import { POSES } from '@/formguide/rig/pose';
import { T, labChannels, pose2d } from './fixtures/labFront';

describe('joints and channels (§3)', () => {
  it('17 joints nested pelvis → spine → chest → neck → head, chest → shoulder → elbow → wrist, pelvis → hip → knee → ankle', () => {
    expect(JOINTS).toHaveLength(17);
    const chain = (j: (typeof JOINTS)[number]): string[] => (PARENT[j] ? [...chain(PARENT[j]!), j] : [j]);
    expect(chain('head')).toEqual(['pelvis', 'spine', 'chest', 'neck', 'head']);
    for (const s of ['l', 'r'] as const) {
      expect(chain(`wrist_${s}`)).toEqual(['pelvis', 'spine', 'chest', `shoulder_${s}`, `elbow_${s}`, `wrist_${s}`]);
      expect(chain(`ankle_${s}`)).toEqual(['pelvis', `hip_${s}`, `knee_${s}`, `ankle_${s}`]);
    }
    expect(JOINTS.filter(j => PARENT[j] === null)).toEqual(['pelvis']);
  });
  it('carries every named channel of the card, sided where it belongs to a limb', () => {
    expect(NAMED_CHANNELS).toEqual(['torso_lean', 'shrug_cm', 'scap_depress_cm', 'elbow_lead', 'wrist_pron', 'breath', 'sway', 'layer']);
    for (const c of NAMED_CHANNELS) expect(CHANNELS.some(x => x === c || x === `${c}_l` || x === `${c}_r`), c).toBe(true);
    expect(both('shrug_cm', 5)).toEqual({ shrug_cm_l: 5, shrug_cm_r: 5 });
  });
});

describe('pattern → view table', () => {
  const lib = (exercises as { pattern: string }[]).map(e => e.pattern);
  it('has one row for each of the 33 library patterns and no other', () => {
    const used = [...new Set(lib)].sort();
    expect(used).toHaveLength(33);
    expect(Object.keys(PATTERNS).sort()).toEqual(used);
  });
  it('follows the §3 rule on the named rows; custom patterns get no view', () => {
    expect(viewFor('shoulder_abduction')).toBe('front');
    expect(viewFor('vertical_pull')).toBe('front');
    expect(viewFor('scapular_elevation')).toBe('front');
    expect(viewFor('chest_adduction')).toBe('front');
    expect(viewFor('carry')).toBe('front');
    expect(viewFor('horizontal_abduction')).toBe('back');
    for (const p of ['horizontal_push', 'horizontal_pull', 'hip_hinge', 'squat', 'lunge', 'elbow_flexion', 'elbow_extension', 'knee_extension', 'knee_flexion']) expect(viewFor(p), p).toBe('side');
    expect(viewFor('custom')).toBeNull();
    expect(viewFor('other')).toBeNull();
    for (const p of ['squat', 'hip_hinge', 'lunge', 'horizontal_push']) expect(PATTERNS[p as keyof typeof PATTERNS].order, p).toBe('lower_first');
  });
});

describe('AAOS hard limits', () => {
  it('cite their source and are ordered min < max', () => {
    expect(AAOS_SOURCE).toMatch(/AAOS/);
    for (const [k, [a, b]] of Object.entries(AAOS)) expect(a, k).toBeLessThan(b);
    expect(aaosTruth('knee_flex_r', 140)).toEqual({ name: 'knee_flex_r', value: 140, min: 0, max: 135 });
    expect(inRange(aaosTruth('knee_flex_r', 140)!)).toBe(false);
    expect(aaosTruth('breath', 0.5)).toBeNull();
  });
  it('the lab rep and its mistake stay inside them at every one of 481 samples', () => {
    for (const m of ['correct', 'mistake'] as const) for (let i = 0; i <= 480; i++) {
      const ch = labChannels(pose2d(m, (i / 480) * T * 0.9999, 0));
      for (const [k, v] of Object.entries(ch)) { const t = aaosTruth(k, v); if (t) expect(inRange(t), `${m} ${k}=${v}`).toBe(true); }
    }
  });
  it('the stored poses start inside them', () => {
    for (const [id, p] of Object.entries(POSES)) for (const [k, v] of Object.entries(p.base)) { const t = aaosTruth(k, v!); if (t) expect(inRange(t), `${id} ${k}`).toBe(true); }
  });
});
