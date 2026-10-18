// BOX-CAP (D-BOXCAP-1; R-W0-1; D-BOXCAP-WIRE): the back-pain box's named 50-word limit, applied by its shared-card key
// at the three counting sites outside golden B (validate.mjs, the library lint's boxReach, c7). Every other box keeps
// its site's 30, and golden B's copy-lint.mjs stays byte-identical.
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { LIMITS, checkC7 } from './checks/c7';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = join(new URL('.', import.meta.url).pathname, '..', '..');
const HOWTO = 'docs/research/howto';
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const rd = (p: string) => JSON.parse(readFileSync(join(ROOT, HOWTO, p), 'utf8'));
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
let C: any, CL: any, V: any, L: any, pullUp: any;
const temps: string[] = [];
beforeAll(async () => {
  [C, CL, V, L] = await Promise.all(['tools/plates/library/lint/box-caps.mjs', 'tools/plates/layers/artifact/copy-lint.mjs',
    'tools/plates/library/research/validate.mjs', 'tools/plates/library/lint/index.mjs'].map(p => import(/* @vite-ignore */ url(p))));
  pullUp = (await (await import(/* @vite-ignore */ url('tools/plates/gen/content.mjs'))).loadContent('lib_pull_up')).content;
});
afterAll(() => { for (const t of temps) rmSync(t, { recursive: true, force: true }); });

type Box = { name: string; now: string; doctor: string };
/** The owner-approved 50-word box text (shared/back-pain-box.json; byte-equal from "box" on to 0393aac9's, BC-4). */
const back = (): Box => { const b = rd('shared/back-pain-box.json').box; return { name: b.name.text, now: b.now.text, doctor: b.doctor.text }; };
/** The same box, one word longer (51). */
const back51 = (): Box => ({ ...back(), doctor: 'No better in a few weeks? See a doctor soon.' });
/** A neutral box of exactly `n` words: "Spine pain", n - 9 one-word sentences, "See a doctor today.", "See a doctor.". */
const neutral = (n: number): Box => ({ name: 'Spine pain', now: `${Array.from({ length: n - 9 }, () => 'Numb?').join(' ')} See a doctor today.`, doctor: 'See a doctor.' });
const count = (b: Box) => CL.words([b.name, b.now, b.doctor].join(' '));

/** The three sites, each returning its full result for `box` under shared-card key `key` (undefined: no key). */
const viaValidate = (box: Box, key = 'back-pain-box') => {
  const s = clone(rd('shared/back-pain-box.json')), q = clone(rd('quotes/shared-back-pain-box.json'));
  s.key = key; q.id = `shared-${key}`; s.status = 'settled';
  s.box.name.text = box.name; s.box.now.text = box.now; s.box.doctor.text = box.doctor;
  return V.validateShared(s, q, { file: `${key}.json` });
};
const viaLint = (box: Box, key?: string) => L.boxReach('redFlag(back)', { ...box, claim: { tags: ['CONSENSUS'], sources: ['nhs-back'] } }, [], key);
/** c7's redFlag lines only: the sheet's visible budget also counts the box, and that is a separate rule. */
const viaC7 = (box: Box, boxKey?: string) => checkC7({ ...pullUp, redFlag: { ...box, claim: { tags: ['CONSENSUS'], sources: ['nhs-back'] } } }, boxKey === undefined ? {} : { boxKey })
  .filter(x => x.startsWith('C7: redFlag'));

describe('BOX-CAP: the named limit table', () => {
  it('names one key, back-pain-box at 50; every other key gets the site\'s fallback; no fallback throws', () => {
    expect(C.NAMED_BOX_CAPS).toEqual({ 'back-pain-box': 50 });
    expect(Object.isFrozen(C.NAMED_BOX_CAPS)).toBe(true);
    expect(C.boxCapOf('back-pain-box', 30)).toBe(50);
    for (const k of ['wrist-pain-box', 'back-pain-box ', 'Back-Pain-Box', 'back', 'toString', '', undefined]) expect([k, C.boxCapOf(k, 30)]).toEqual([k, 30]);
    expect(C.boxCapOf('x', 7)).toBe(7);
    for (const f of [undefined, NaN, Infinity, '30']) expect(() => C.boxCapOf('back-pain-box', f)).toThrow(/fallback must be a finite number/);
    expect(readFileSync(join(ROOT, 'tools/plates/library/lint/box-caps.mjs'), 'utf8')).not.toMatch(/^\s*import\b/m);
  });
  it('the fixtures count as named: 50, 51, and neutral 30, 31, 50', () => {
    expect([back(), back51(), neutral(30), neutral(31), neutral(50)].map(count)).toEqual([50, 51, 30, 31, 50]);
  });
});

describe('BC-1: the back-pain box at 50 passes and at 51 fails, at all 3 sites', () => {
  it('validate.mjs', () => {
    expect(viaValidate(back())).toEqual([]);
    expect(viaValidate(back51())).toEqual(['shared/back-pain-box.json: box has 51 words, at most 50']);
  });
  it('library lint (boxReach with the key)', () => {
    expect(viaLint(back(), 'back-pain-box')).toEqual([]);
    expect(viaLint(back51(), 'back-pain-box')).toEqual([{ path: 'redFlag(back)', rule: 'red-flag box > 50 words', detail: '51 words' }]);
  });
  it('c7 (boxKey)', () => {
    expect(viaC7(back(), 'back-pain-box')).toEqual([]);
    expect(viaC7(back51(), 'back-pain-box')).toEqual(['C7: redFlag: 51 words, at most 50']);
  });
});

describe('BC-2: every other box at 31 still fails and at 30 passes, at all 3 sites; golden B is unchanged', () => {
  it('validate.mjs (another key)', () => {
    expect(viaValidate(neutral(30), 'spine-pain-box')).toEqual([]);
    expect(viaValidate(neutral(31), 'spine-pain-box')).toEqual(['shared/spine-pain-box.json: box has 31 words, at most 30']);
  });
  it('library lint (another key, and no key)', () => {
    for (const k of ['spine-pain-box', undefined]) {
      expect(viaLint(neutral(30), k)).toEqual([]);
      expect(viaLint(neutral(31), k)).toEqual([{ path: 'redFlag(back)', rule: 'red-flag box > 30 words', detail: '31 words' }]);
    }
  });
  it('c7 (another key, and no key: LIMITS.redFlagBoxWords stays the default)', () => {
    expect(LIMITS.redFlagBoxWords).toBe(30);
    for (const k of ['spine-pain-box', undefined]) {
      expect(viaC7(neutral(30), k)).toEqual([]);
      expect(viaC7(neutral(31), k)).toEqual(['C7: redFlag: 31 words, at most 30']);
    }
  });
  it('golden B\'s copy-lint.mjs is byte-identical to the base, and its cap is 30', () => {
    expect(sha(readFileSync(join(ROOT, 'tools/plates/layers/artifact/copy-lint.mjs')))).toBe('f568f938e0ac9d7555e8565848c1d5e7d9a6d3b78fb6f1d85cb7dabb4f6aeafe');
    expect(CL.RED_FLAG_BOX_MAX_WORDS).toBe(30);
  });
});

describe('BC-3: the limit follows the key, never the text or the count', () => {
  it('the owner\'s 50-word box under any other key fails at all 3 sites', () => {
    for (const k of ['spine-pain-box', 'back', 'back-pain-box-2']) expect([k, viaValidate(back(), k)]).toEqual([k, [`shared/${k}.json: box has 50 words, at most 30`]]);
    for (const k of ['spine-pain-box', 'back', undefined]) {
      expect([k, viaLint(back(), k)]).toEqual([k, [{ path: 'redFlag(back)', rule: 'red-flag box > 30 words', detail: '50 words' }]]);
      expect([k, viaC7(back(), k)]).toEqual([k, ['C7: redFlag: 50 words, at most 30']]);
    }
  });
  it('the back-pain key with other text is still capped at 50: green at 50, red at 51', () => {
    expect([viaValidate(neutral(50)), viaLint(neutral(50), 'back-pain-box'), viaC7(neutral(50), 'back-pain-box')]).toEqual([[], [], []]);
    expect(viaValidate(neutral(51))).toEqual(['shared/back-pain-box.json: box has 51 words, at most 50']);
    expect(viaLint(neutral(51), 'back-pain-box')).toEqual([{ path: 'redFlag(back)', rule: 'red-flag box > 50 words', detail: '51 words' }]);
    expect(viaC7(neutral(51), 'back-pain-box')).toEqual(['C7: redFlag: 51 words, at most 50']);
  });
  it('lintLibraryRow passes boxKeys[flag] to boxReach: a 50-word back box is green with { back: \'back-pain-box\' } and red without', async () => {
    const M = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib5/back-sheet.mjs'));
    const shared = await import(/* @vite-ignore */ url('tools/plates/layers/howto/shared.mjs'));
    const B = { ...back(), claim: { tags: ['CONSENSUS'], sources: ['nhs-back'] } };
    const capRule = (r: any[]) => r.filter(x => x.path === 'redFlag(back)' && /words/.test(x.rule));
    expect(capRule(L.lintLibraryRow(M, shared, { extraBoxes: { back: B }, boxKeys: { back: 'back-pain-box' } }))).toEqual([]);
    expect(capRule(L.lintLibraryRow(M, shared, { extraBoxes: { back: B } }))).toEqual([{ path: 'redFlag(back)', rule: 'red-flag box > 30 words', detail: '50 words' }]);
  });
});

describe('BC-4: the owner-approved card (claude/libht-research @ 0393aac9) validates', () => {
  // 0393aac9's card differs from the base's copy only before "box" (status, appliesTo, appliesToWhy); its quotes file is
  // byte-equal (sha 56186cf7…). The copy is rebuilt here and pinned to 0393aac9's blob sha256.
  const APPLIES = ['ab_wheel_rollout', 'back_extension', 'barbell_overhead_press', 'barbell_row', 'bent_over_dumbbell_rear_delt_fly',
    'chest_supported_row', 'conventional_deadlift', 'crunch', 'dumbbell_overhead_triceps_extension', 'dumbbell_romanian_deadlift',
    'flutter_kicks', 'front_squat', 'goblet_squat', 'hanging_knee_raise', 'horizontal_leg_press', 'inverted_row', 'landmine_row',
    'machine_crunch', 'overhead_cable_triceps_extension', 'pendlay_row', 'plank', 'resistance_band_row', 'resisted_hip_flexion',
    'romanian_deadlift', 'rope_triceps_pushdown', 'russian_twist', 'shoulder_press', 'single_leg_romanian_deadlift', 'sled_pull',
    'smith_machine_squat', 'straight_arm_pulldown', 'straight_bar_triceps_pushdown', 'sumo_deadlift', 't_bar_row', 'triceps_pushdown'];
  const WHY = 'Every verified card on claude/libht-research @ 9eaa2480 that links redFlag "back": 40 cards, less the 8 (barbell_back_squat, hanging_leg_raise, lat_pulldown, leg_press, seated_cable_row), whose sheets stay golden B unchanged (S10). LR-28: no sheet that links the box ships before it. A card joins this list when its own card links the box.';
  it('validateSharedFile on the copy is green', () => {
    const base = readFileSync(join(ROOT, HOWTO, 'shared/back-pain-box.json'), 'utf8'), k = '  "box": {';
    const card = `{\n  "key": "back-pain-box",\n  "kind": "red-flag-box",\n  "status": "owner-approved",\n  "appliesTo": [\n${APPLIES.map(a => `    "${a}"`).join(',\n')}\n  ],\n  "appliesToWhy": ${JSON.stringify(WHY)},\n${base.slice(base.indexOf(k))}`;
    expect(sha(card)).toBe('eb503620429d84b311d0e8c30ab7e164f49cacc1a8df577fc35496a069113aa4');
    const quotes = readFileSync(join(ROOT, HOWTO, 'quotes/shared-back-pain-box.json'));
    expect(sha(quotes)).toBe('56186cf7f4ffb3c91d65c5410ba82791489efb5c751ca1739ed16af559712973');
    const t = mkdtempSync(join(tmpdir(), 'boxcap-bc4-')); temps.push(t);
    for (const d of ['shared', 'quotes']) mkdirSync(join(t, HOWTO, d), { recursive: true });
    writeFileSync(join(t, HOWTO, 'shared/back-pain-box.json'), card);
    cpSync(join(ROOT, HOWTO, 'quotes/shared-back-pain-box.json'), join(t, HOWTO, 'quotes/shared-back-pain-box.json'));
    expect(JSON.parse(card).box.words).toBe(50);
    expect(V.validateSharedFile('back-pain-box.json', t)).toEqual([]);
  });
});
