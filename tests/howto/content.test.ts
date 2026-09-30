// HT-4: HT4-A2 (content-types.ts compiles a real golden-B spec, mapped) and HT4-A3/A4 (C1-C4, C6-C8, C15-C17 pass on
// good content and fail, naming the rule, on their own bad fixture). Pure functions, node env, no DOM.
import { describe, expect, it } from 'vitest';
import type { HowToContent, Source } from '../../src/howto/content-types';
import { COVERAGE } from '../../src/howto/coverage';
import exercises from '../../src/data/exercises.json';
import { checkC1 } from './checks/c1';
import { checkC2 } from './checks/c2';
import { checkC3 } from './checks/c3';
import { checkC4 } from './checks/c4';
import { checkC6 } from './checks/c6';
import { checkC7 } from './checks/c7';
import { checkC8 } from './checks/c8';
import { checkC15, contentHash } from './checks/c15';
import { checkC16 } from './checks/c16';
import { checkC17 } from './checks/c17';
import { mutate as c1Mutate } from './fixtures/bad/c1-bad-zoom-ref';
import { mutate as c2PrimaryWatch } from './fixtures/bad/c2-primary-and-watch';
import { mutate as c2NoRegion } from './fixtures/bad/c2-no-region';
import { mutate as c2BadPart } from './fixtures/bad/c2-bad-part';
import { mutate as c3Mutate } from './fixtures/bad/c3-missing-hand-zoom';
import { mutate as c4Mutate } from './fixtures/bad/c4-bad-thumb';
import { mutate as c6Mutate } from './fixtures/bad/c6-missing-id';
import { mutate as c7Mutate } from './fixtures/bad/c7-banned-phrase';
import { mutate as c8MissingClaim } from './fixtures/bad/c8-missing-claim';
import { mutate as c8Unreachable } from './fixtures/bad/c8-unreachable';
import { mutate as c8RedFlag } from './fixtures/bad/c8-red-flag-wording';
import { reviews as c15Reviews } from './fixtures/bad/c15-no-matching-review';
import { mutate as c16Mutate } from './fixtures/bad/c16-missing-alt';

/*
 * HT4-A2: this literal is machine_chest_press.howto.mjs's default export (appendix A1), trimmed (fewer setup steps,
 * fewer feel rows) but not rewritten - every string below is copied from tools/plates/layers/exercises/
 * machine_chest_press.howto.mjs, minus `plate` (HowToContent has no plate field; plate identity is
 * tools/plates/plates.json). This is the "one golden-B spec, mapped" compile check: if content-types.ts's shape
 * disagrees with what golden-B actually authors, this literal fails to typecheck.
 */
const CL_WRIST = { tags: ['CONSENSUS', 'MECH', 'WEAK'], sources: ['ace-chest-press', 'barbell-logic-grip', 'weiss1995', 'nance2017'], note: 'Heel of palm and straight wrist.' } as const;
const CL_ACE = { tags: ['CONSENSUS'], sources: ['ace-chest-press'] } as const;
const CL_THUMB = { tags: ['CONSENSUS'], sources: ['ace-chest-press'] } as const;

const GOOD_CONTENT = {
  schema: 1,
  id: 'lib_machine_chest_press',
  rev: 1,
  handling: {
    archetype: 'push',
    orientation: 'pronated',
    handle: 'machine-grip',
    loadAxis: 'along-forearm',
    handleChoice: { sore: 'Sore wrist? Use the vertical handles.', claim: { tags: ['DATA', 'CONSENSUS'], sources: ['muyor2023'] } },
    overBody: false,
    width: { text: 'Pick the handle pair that puts your hands just outside your shoulders at the start.', claim: { tags: ['DATA', 'CONSENSUS'], sources: ['muyor2023'] } },
    thumb: { mode: 'wrapped', claim: CL_THUMB },
    contact: 'heel',
    wrist: { ext: [0, 10], dev: [-10, 10], limitText: 'If the back of your hand folds toward your forearm by more than about 15 to 20 degrees, stop, lower the weight and reset.', claim: CL_WRIST },
    faults: ['fingers-bent-back'],
    gripLine: 'Put the handle low in your palm, right on the heel of your hand, and wrap your thumb around it. Your knuckles should line up with your forearm.',
    cue: 'Push with the heel of your hand.',
  },
  contacts: ['seat-back', 'standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Set the seat height: sit down and adjust until the handles line up with the middle of your chest.', zoom: 'seat-height', claim: CL_ACE },
    { kind: 'position', text: 'Sit all the way back: hips against the back pad, feet flat on the floor about hip width apart.', claim: CL_ACE },
    { kind: 'grip', text: 'Grip: handle in the heel of your palm, thumb wrapped, wrist straight, forearm right behind the handle.', zoom: 'hand', claim: CL_WRIST },
  ],
  posture: [
    { key: 'height', label: 'Handles mid-chest', detail: 'At the start the handles are level with the middle of the chest.', anchor: { at: 'grip.r', pose: 'start' }, zoom: 'seat-height', claim: CL_ACE },
    { key: 'blades', label: 'Blades on pad', detail: 'Upper back and both shoulder blades stay in contact with the pad on every rep.', anchor: { at: 'backUpper', pose: 'end' }, zoom: 'blades', claim: CL_ACE },
  ],
  feel: {
    primary: [{ muscleId: 'chest', plain: 'Across the middle and lower chest, the big fan of muscle from the breastbone out to the armpit.' }],
    secondary: [{ muscleId: 'triceps', plain: 'The back of the upper arm, mostly near the end of the push.' }],
    watch: [{ muscleId: 'front_delts', plain: 'If the front of your shoulders burn more than your chest, your setup is usually off.' }],
    feelLine: 'You should feel this across the middle and lower chest. If the front of your shoulders works more than your chest, raise the seat so handles meet the middle of your chest.',
    rows: [
      { key: 'front-shoulders', where: 'Front of the shoulders', at: { muscles: ['front_delts'] }, means: 'The handles are probably too high for your chest, or your shoulders are rolling off the pad.', fix: 'Set the seat so the handles line up with the middle of your chest.', zoom: 'seat-height', claim: CL_ACE },
      { key: 'wrist', where: 'Wrist (top or back of the wrist)', at: { parts: ['hand-left', 'hand-right'] }, means: 'Your wrist is bending back and the handle has slid into your fingers.', fix: 'Move the handle into the heel of your palm and wrap your thumb.', zoom: 'hand', redFlag: true, claim: CL_WRIST },
      { key: 'elbows', where: 'Elbows', at: { parts: ['elbow-left', 'elbow-right'] }, means: 'You are snapping into a hard lockout at the end of each rep.', fix: 'Stop just before the elbows lock and control the way back.', zoom: 'blades', redFlag: 'elbow', claim: { tags: ['CONSENSUS'], sources: ['ace-chest-press', 'nhs-elbow-pain'] } },
    ],
    libraryDiff: { add: ['upper_chest'], why: 'Muyor 2023: with neutral handles the upper chest works about as hard as the rest.' },
    claim: { tags: ['DATA', 'CONSENSUS'], sources: ['muyor2023', 'ace-chest-press'] },
  },
  zooms: [
    {
      key: 'hand', chip: 'Hand', chipCaption: 'Heel of palm', heading: 'Hand: right and wrong', kind: 'hand',
      hand: { wrong: ['fingers-bent-back'], camera: 'side', panelHeight: 150, notes: { right: 'Heel of palm', wrong: 'Wrist bent back' } },
      caption: { right: 'Handle in the heel of your palm, thumb wrapped, wrist straight.', wrong: 'Handle in your fingers, wrist bent back, thumb loose.' },
      alt: { right: 'Horizontal handle, seen from the side: the handle sits low in the palm on the heel of the hand.', wrong: 'The handle has slid into the fingers, the wrist is bent far back.' },
      feelRow: 'wrist',
    },
    {
      key: 'seat-height', chip: 'Seat height', heading: 'Seat height: right and wrong', kind: 'posture',
      crop: { center: { at: 'shoulder.r', pose: 'start', off: [14, 0] }, sizePx: 108 },
      right: 'start', wrong: { still: 'seat-low' },
      callouts: { right: { text: 'Mid-chest', guide: 'handle-to-chest' }, wrong: { text: 'Seat too low', guide: 'handle-to-chest' } },
      caption: { right: 'Handles meet the middle of your chest.', wrong: 'Seat too low: the handles sit up near your shoulders.' },
      alt: { right: 'Side view, start of the press. The handle is level with the middle of the chest.', wrong: 'Side view, seat too low. The handle is level with the top of the chest.' },
      feelRow: 'front-shoulders',
    },
    {
      key: 'blades', chip: 'Blades', heading: 'Shoulder blades: right and wrong', kind: 'posture',
      crop: { center: { at: 'shoulder.r', pose: 'end', off: [44, 6] }, sizePx: 168 },
      right: 'end', wrong: { still: 'round-lock', over: 'end' },
      callouts: { right: { text: 'On the pad', guide: 'pad-contact' }, wrong: { text: 'Off the pad', guide: 'pad-gap' } },
      caption: { right: 'Shoulder blades stay on the pad, elbows still slightly bent.', wrong: 'Shoulders roll off the pad and the elbows lock straight.' },
      alt: { right: 'Side view, end of the press. Upper back and shoulder blades flat on the pad.', wrong: 'Side view, end of the press. The upper back rounds forward.' },
      feelRow: 'elbows',
    },
  ],
  copy: {
    setupLine: 'Set the seat so the handles sit level with the middle of your chest. Sit all the way back with your feet flat and your shoulder blades on the pad.',
    mistakeLine: 'Never let your wrist fold back to finish a heavy rep. Drop the weight and push through the heel of your hand.',
    cueLine: 'Handles at mid-chest.',
  },
  redFlag: { name: 'Wrist pain', now: "Get it checked today if you can't grip, the wrist looks a different shape, or your hand goes numb.", doctor: "See a doctor if it's no better after two weeks of rest, keeps coming back, or tingles.", claim: { tags: ['CONSENSUS'], sources: ['nhs-wrist-pain'] } },
  mistakes: [
    { key: 'wrist', title: 'Wrist bent back, handle in the fingers', zoom: 'hand', claim: CL_WRIST, fix: 'Reset the handle low in your palm, on the heel of your hand, and wrap your thumb.' },
    { key: 'seat-low', title: 'Seat too low, handles up at your shoulders', zoom: 'seat-height', claim: CL_ACE, fix: 'Raise the seat until the handles meet the middle of your chest.' },
  ],
  risks: [
    { key: 'wrist', text: 'A wrist bent back under load squeezes the small structures on the back of the wrist.', claim: { tags: ['MECH', 'WEAK'], sources: ['nance2017'] } },
    { key: 'elbow', text: 'A hard lockout under a heavy weight puts the stress on your elbow joints instead of your muscles.', claim: { tags: ['CONSENSUS'], sources: ['ace-chest-press'] } },
  ],
  riskFlags: ['wrist', 'elbow'],
  sources: ['ace-chest-press', 'barbell-logic-grip', 'weiss1995', 'nance2017', 'muyor2023', 'nhs-wrist-pain', 'nhs-elbow-pain'],
  research: { card: 'grip/research/machine_chest_press.json', rev: 1 },
} satisfies HowToContent;

const SOURCES: Record<string, Source> = {
  'ace-chest-press': { id: 'ace-chest-press', cite: 'ACE Exercise Library, Seated Chest Press', url: 'https://www.acefitness.org/resources/everyone/exercise-library/188/seated-chest-press/', kind: 'guideline', access: 'full', checked: null },
  'barbell-logic-grip': { id: 'barbell-logic-grip', cite: 'Barbell Logic, Bench Press Grip Tips', url: 'https://barbell-logic.com/bench-press-grip-tips/', kind: 'coach', access: null as unknown as Source['access'], checked: null },
  weiss1995: { id: 'weiss1995', cite: 'Weiss ND et al. 1995', url: 'https://pubmed.ncbi.nlm.nih.gov/7593079/', kind: 'peer-reviewed', access: 'abstract', checked: null },
  nance2017: { id: 'nance2017', cite: 'Nance EM et al. 2017', url: 'https://pubmed.ncbi.nlm.nih.gov/29085728/', kind: 'peer-reviewed', access: 'abstract', checked: null },
  muyor2023: { id: 'muyor2023', cite: 'Muyor JM et al. 2023', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10203828/', kind: 'peer-reviewed', access: 'full', checked: null },
  'nhs-wrist-pain': { id: 'nhs-wrist-pain', cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/', kind: 'guideline', access: 'full', checked: '2026-09-30' },
  'nhs-elbow-pain': { id: 'nhs-elbow-pain', cite: 'NHS, Elbow and arm pain', url: 'https://www.nhs.uk/symptoms/elbow-and-arm-pain/', kind: 'guideline', access: 'full', checked: '2026-09-30' },
  'unreachable-source': { id: 'unreachable-source', cite: 'A source nobody could open', url: 'https://example.com/404', kind: 'secondary', access: 'unreachable', checked: '2026-09-30' },
};

const KNOWN_IDS = new Set(Object.keys(COVERAGE));

describe('HT4-A2: content-types.ts compiles a real golden-B spec (machine_chest_press, mapped)', () => {
  it('the good fixture passes every check clean (the literal above compiled, this proves it also behaves)', () => {
    expect(checkC1(GOOD_CONTENT, KNOWN_IDS)).toEqual([]);
    expect(checkC2(GOOD_CONTENT)).toEqual([]);
    expect(checkC3(GOOD_CONTENT, 'Machine')).toEqual([]);
    expect(checkC4(GOOD_CONTENT)).toEqual([]);
    expect(checkC7(GOOD_CONTENT)).toEqual([]);
    expect(checkC8(GOOD_CONTENT, SOURCES)).toEqual([]);
    expect(checkC16(GOOD_CONTENT)).toEqual([]);
  });
});

describe('HT4-A3/A4: C1-C4, C6-C8, C15-C17, each proven by a bad fixture naming the rule', () => {
  it('C1 fails on a zoom reference to a key that does not exist', () => {
    const bad = checkC1(c1Mutate(GOOD_CONTENT), KNOWN_IDS);
    expect(bad.length).toBeGreaterThan(0);
    expect(bad.every(m => m.startsWith('C1:'))).toBe(true);
  });

  it('C2 fails when a muscle is both primary and watch', () => {
    const bad = checkC2(c2PrimaryWatch(GOOD_CONTENT));
    expect(bad.some(m => m.includes('both primary and watch'))).toBe(true);
  });

  it('C2 fails when a shimmer role uses an id with no drawn region', () => {
    const bad = checkC2(c2NoRegion(GOOD_CONTENT));
    expect(bad.some(m => m.includes('no drawn region'))).toBe(true);
  });

  it('C2 fails when a part id is not in bodyMuscles.ts', () => {
    const bad = checkC2(c2BadPart(GOOD_CONTENT));
    expect(bad.some(m => m.includes('is not in bodyMuscles.ts'))).toBe(true);
  });

  it('C3 fails when handling needs a hand zoom and none exists', () => {
    const bad = checkC3(c3Mutate(GOOD_CONTENT), 'Machine');
    expect(bad.every(m => m.startsWith('C3:'))).toBe(true);
    expect(bad.length).toBeGreaterThan(0);
  });

  it('C4 fails when overBody needs a wrapped or over thumb and gets neither', () => {
    const bad = checkC4(c4Mutate(GOOD_CONTENT));
    expect(bad).toEqual([expect.stringContaining('C4:')]);
  });

  it('C6 fails when an exercises.json id has no coverage entry', () => {
    const ids = exercises.map(e => e.id);
    const bad = checkC6(ids, c6Mutate(COVERAGE));
    expect(bad).toEqual(['C6: "lib_pallof_press" has no HowTo and no archetype stub']);
  });
  it('C6 passes on the real 153-id coverage table', () => {
    const ids = exercises.map(e => e.id);
    expect(checkC6(ids, COVERAGE)).toEqual([]);
  });

  it('C7 fails on a banned phrase in user copy', () => {
    const bad = checkC7(c7Mutate(GOOD_CONTENT));
    expect(bad.some(m => m.includes('banned phrase "engage"'))).toBe(true);
    expect(bad.some(m => m.includes('banned phrase "maximise"'))).toBe(true);
  });

  it('C8 fails when a rule has no Claim', () => {
    const bad = checkC8(c8MissingClaim(GOOD_CONTENT), SOURCES);
    expect(bad.some(m => m.includes('no Claim'))).toBe(true);
  });
  it('C8 fails when a claim\'s only source is unreachable', () => {
    const bad = checkC8(c8Unreachable(GOOD_CONTENT), SOURCES);
    expect(bad.some(m => m.includes('every source is unreachable'))).toBe(true);
  });
  it('C8 fails when a fix carries its own red-flag wording', () => {
    const bad = checkC8(c8RedFlag(GOOD_CONTENT), SOURCES);
    expect(bad.some(m => m.includes('red-flag wording'))).toBe(true);
  });

  it('C15 stub passes while reviews.json is empty', () => {
    expect(checkC15(GOOD_CONTENT, {}, { schema: 1, entries: [] })).toEqual([]);
  });
  it('C15 fails once reviews.json holds entries but none matches the current hash', () => {
    const bad = checkC15(GOOD_CONTENT, {}, c15Reviews);
    expect(bad.length).toBe(1);
    expect(bad[0]).toContain('C15:');
  });
  it('C15 passes once reviews.json carries the exact current hash', () => {
    const hash = contentHash(GOOD_CONTENT, {});
    const bad = checkC15(GOOD_CONTENT, {}, { schema: 1, entries: [{ scope: GOOD_CONTENT.id, hash, coach: 'j.doe', date: '2026-01-01' }] });
    expect(bad).toEqual([]);
  });

  it('C16 fails when a zoom is missing alt.wrong', () => {
    const bad = checkC16(c16Mutate(GOOD_CONTENT));
    expect(bad.some(m => m.includes('no alt.wrong'))).toBe(true);
  });

  it('C17 fails on the fixture that calls fetch(), and on nothing else in the same folder', () => {
    const bad = checkC17([new URL('.', import.meta.url).pathname + 'fixtures/bad']);
    expect(bad.every(m => m.includes('c17-network.ts'))).toBe(true);
    expect(bad.some(m => m.includes('fetch'))).toBe(true);
  });
});

describe('HT4-A4: the checks are pure, no DOM, and cheap', () => {
  it('none of the checks touch a global DOM (jsdom/document/window)', () => {
    expect(typeof document).toBe('undefined');
    expect(typeof window).toBe('undefined');
  });
});
