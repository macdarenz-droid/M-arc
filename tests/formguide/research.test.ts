// V1-02/V1-03: the research.json validator (docs/FORM-GUIDE-PRODUCTION.md doc:148, D-FG7 (l)). research.json is
// written by the researcher and never edited by the author (model.ts); this proves every V1 research file is cited,
// has a drawable mistake, and stays inside the AAOS limits, before any exercise file reads it. Node only.
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import library from '@/data/exercises.json';
import type { Research } from '@/formguide/model';
import type { View } from '@/formguide/rig/joints';
import { viewFor } from '@/formguide/rig/patterns';
import { AAOS } from '@/formguide/rig/ranges';

const RESEARCH = 'src/formguide/research', BAD = 'tests/formguide/fixtures/research-bad';

/** Channels each view's frame code draws (doc §3 "Channels each view can draw", D-FG7 (l)); a mistake tell may only
 * name one of these for its exercise's view, or it points at motion nothing on screen shows.
 * Back is not drawn yet (V1-22: `figureBack.ts` is a stub). Until it ships its own list, this validator treats back
 * as the front list minus `wrist_pron`: horizontal abduction (the rear delt fly, D-FG7 (d)) moves the arm in the same
 * coronal plane as front abduction, just seen from behind, while a grip turn is not visible from behind. Builder
 * decision (V1-02), logged in docs/COACHING-DECISIONS.md; V1-22 may publish a different back list and this updates then. */
const FRONT_CHANNELS = ['shoulder_abd', 'elbow_lead', 'shrug_cm', 'scap_depress_cm', 'hip_abd', 'knee_flex', 'hip_flex', 'torso_lean', 'breath', 'sway', 'wrist_pron'];
const SIDE_CHANNELS = ['shoulder_flex', 'elbow_flex', 'hip_flex', 'knee_flex', 'ankle_flex', 'torso_lean', 'shrug_cm', 'scap_depress_cm', 'breath', 'sway'];
const BACK_CHANNELS = FRONT_CHANNELS.filter(c => c !== 'wrist_pron');
const DRAWABLE: Record<View, string[]> = { front: FRONT_CHANNELS, side: SIDE_CHANNELS, back: BACK_CHANNELS };

const baseChannel = (joint: string) => joint.replace(/_[lr]$/, '');

/** The exercise's view, from the shared pattern table (`rig/patterns.ts`) — never picked by hand per exercise. */
function viewOf(id: string): View {
  const row = (library as { id: string; pattern: string }[]).find(e => e.id === id);
  if (!row) throw new Error(`${id}: not in the exercise library`);
  const view = viewFor(row.pattern);
  if (!view) throw new Error(`${id}: pattern "${row.pattern}" has no view (a custom exercise takes no guide file)`);
  return view;
}

/** Every string leaf in a research.json, `id` excluded (an identifier, not prose). Feeds the ≤300-word check (doc:148). */
function proseWords(value: unknown, key?: string): string[] {
  if (key === 'id') return [];
  if (typeof value === 'string') return value.trim().split(/\s+/).filter(Boolean);
  if (Array.isArray(value)) return value.flatMap(v => proseWords(v));
  if (value && typeof value === 'object') return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) => proseWords(v, k));
  return [];
}

/** Every rule a research.json must pass (V1-02 A1-A4). One message per violation; empty means valid. */
export function validate(r: Research, view: View): string[] {
  const issues: string[] = [];
  for (const [channel, range] of Object.entries(r.ranges)) {
    if (!range.source?.trim()) issues.push(`${channel}: range has no source`);
    const lim = (AAOS as Record<string, readonly [number, number]>)[baseChannel(channel)];
    if (lim && (range.min < lim[0] || range.max > lim[1])) {
      issues.push(`${channel}: range ${range.min} to ${range.max} is outside the AAOS limit ${lim[0]} to ${lim[1]}`);
    }
  }
  if (r.mistake.tells.length < 2) issues.push(`mistake has ${r.mistake.tells.length} tell(s), needs at least 2`);
  if (!r.mistake.source?.trim()) issues.push('mistake has no source');
  for (const tell of r.mistake.tells) {
    if (!DRAWABLE[view].includes(baseChannel(tell.joint))) issues.push(`mistake tell on ${tell.joint}: the ${view} view cannot draw it`);
  }
  if (!r.muscles.peakSource?.trim()) issues.push('muscles.peakSource is missing');
  if (r.machine && !r.machine.unverified_on_machine && !r.machine.source?.trim()) {
    issues.push('machine.settings has no source and is not flagged unverified_on_machine');
  }
  if (!r.sources?.length) issues.push('sources is empty');
  const words = proseWords(r as unknown as Record<string, unknown>).length;
  if (words > 300) issues.push(`${words} words, over the 300-word limit (doc:148)`);
  return issues;
}

const V1_02_IDS = [
  'lib_dumbbell_biceps_curl', 'lib_romanian_deadlift', 'lib_hanging_leg_raise', 'lib_seated_cable_row',
  'lib_single_arm_triceps_pushdown', 'lib_lat_pulldown', 'lib_rear_delt_fly',
] as const;

describe('V1-02 research.json passes the validator', () => {
  const files = readdirSync(RESEARCH).filter(f => f.endsWith('.json'));
  it.each(V1_02_IDS)('%s has a research.json', id => expect(files).toContain(`${id}.json`));
  it.each(V1_02_IDS)('%s', id => {
    const r = JSON.parse(readFileSync(`${RESEARCH}/${id}.json`, 'utf8')) as Research;
    expect(r.id).toBe(id);
    expect(validate(r, viewOf(id))).toEqual([]);
  });
});

const V1_03_IDS = [
  'lib_machine_chest_press', 'lib_incline_machine_press', 'lib_shoulder_press', 'lib_leg_press',
  'lib_seated_leg_curl', 'lib_leg_extension', 'lib_seated_calf_raise',
] as const;

describe('V1-03 research.json passes the validator', () => {
  const files = readdirSync(RESEARCH).filter(f => f.endsWith('.json'));
  it.each(V1_03_IDS)('%s has a research.json', id => expect(files).toContain(`${id}.json`));
  it.each(V1_03_IDS)('%s', id => {
    const r = JSON.parse(readFileSync(`${RESEARCH}/${id}.json`, 'utf8')) as Research;
    expect(r.id).toBe(id);
    expect(validate(r, viewOf(id))).toEqual([]);
  });
});

describe('the validator rejects seeded bad research.json (A1)', () => {
  const CASES: Record<string, { view: View; rule: RegExp }> = {
    'missing-source': { view: 'side', rule: /range has no source/ },
    'one-tell': { view: 'side', rule: /needs at least 2/ },
    'wrist-pron-side-tell': { view: 'side', rule: /side view cannot draw/ },
    'range-outside-aaos': { view: 'side', rule: /outside the AAOS limit/ },
  };
  it('one seeded bad file per rule', () => {
    const files = readdirSync(BAD).map(f => f.replace(/\.json$/, ''));
    expect(files.sort()).toEqual(Object.keys(CASES).sort());
  });
  // Each fixture has exactly the one flaw its name says: removing that rule from `validate` empties its issue list
  // and this assertion fails, so the rule is proven load-bearing (A1: "the reviewer removes the channel rule and a
  // test fails").
  it.each(Object.entries(CASES))('%s', (name, { view, rule }) => {
    const r = JSON.parse(readFileSync(`${BAD}/${name}.json`, 'utf8')) as Research;
    const issues = validate(r, view);
    expect(issues.some(m => rule.test(m)), issues.join('\n') || '(no issues found)').toBe(true);
  });
});
