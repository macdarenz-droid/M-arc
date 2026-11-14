// F-W8A-ASSISTED (F-W8A-HOLDS part 1: F-LAYERS-MGHOST + F-HT4-UNDER). The layers build applies applyMistakeGhosts before
// applyZooms (build-page.mjs:104's order), and HT4's libraryA5 attributes crop.mjs:142's `<key>-under` call. No held row
// flips here: assisted_pull_up is shown on a scratch tree whose lb01.layers config holds it in the W8a form (the
// e351f554^ row, W8a LAYERS READY 6759453858), built and checked with the tree's own modules (LIB-2b fixtureTree form).
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, afterAll, beforeAll } from 'vitest';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { PF5_MAIN, restorePF5 } from './platefix5-pins';   // LIB-PLATEFIX-5 (D-PF5-PINS): put PF5's own [golden update] keys/entries back to main before the A1 blanked compare
import { BSS_KEY, restoreBSS } from './f-bss-rearknee-pins';   // F-BSS-REARKNEE (D-RP-PINS): its moved how-to key put back to main 9139c29c's before the A1 blanked compare

const ROOT = process.cwd();
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
const COPY = ['package.json', 'scripts', 'src', 'tools', 'tests/howto/golden', 'docs/research/howto'];
const LB01 = 'tools/plates/library/pages/lb01.layers.json', LB09 = 'tools/plates/library/pages/lb09.layers.json';
const BUILDER = 'tools/plates/library/build-layers-page.mjs', HT4 = 'tools/plates/library/fidelity/twins/ht4.mjs';
const GHOSTS = 'tools/plates/library/mistake-ghosts.mjs';
// lb01.json:469, assisted_pull_up's plates pin (its Mistake svg with the ghosts off, D-HELD6-MGHOST)
const PLATES_MISTAKE = '5324dd0b14872b72dcc0b4186811e0b62cbc70b1decb4e62a5b4f386eff6c9fd';
// the CI reds of #415 head 5fe00e47 (run 42784492527, job 129724255451)
const CI_FRAGMENTS = `assisted-pull-up: mistakeSvg sha256 1a8b4e83d651d19bb2a55eb39899292f45ed0a3b46cc1822d85d70cb17d597e0 != golden-A ${PLATES_MISTAKE}`;
const CI_POSES = 'assisted_pull_up|knee-pad-under: a call that cannot be attributed to base, cam, the plate or a declared zoom side';
// the W8a row, as e351f554^ and #415's 5fe00e47 hold it
const ASSISTED_ROW = {
  optionsKey: 'assisted_pull_up', pair: 'bar-hang-over', pairFaults: ['curled'],
  pairWords: { curled: { right: { text: 'Overhand, thumb wrapped, wrist not curled.', source: 'docs/research/howto/cards/assisted_pull_up.json zooms[key=hand].right (W3 layers fix #384 6648454032, D-SHIP-CONVCOPY: no unsourced contact point)' } } },
};

const trees: string[] = [];
afterAll(() => { for (const t of trees) rmSync(t, { recursive: true, force: true }); });
/** A scratch tree: main's sources, with each `edit` applied (path -> text transform). */
function tree(edits: Record<string, (s: string) => string> = {}): string {
  const T = mkdtempSync(join(tmpdir(), 'f-w8a-assisted-'));
  trees.push(T);
  for (const p of COPY) if (existsSync(join(ROOT, p))) cpSync(join(ROOT, p), join(T, p), { recursive: true });
  symlinkSync(join(ROOT, 'node_modules'), join(T, 'node_modules'), 'dir');
  for (const [p, f] of Object.entries(edits)) {
    const before = readFileSync(join(T, p), 'utf8'), after = f(before);
    expect(after, `${p}: the edit must change the file`).not.toBe(before);
    writeFileSync(join(T, p), after);
  }
  return T;
}
/** Runs `fn` with `edits` applied to T's files (a mutation), then puts the files back. */
function mutated<R>(T: string, edits: Record<string, (s: string) => string>, fn: () => R): R {
  const keep = Object.keys(edits).map(p => [p, readFileSync(join(T, p), 'utf8')] as const);
  try {
    for (const [p, before] of keep) { const after = edits[p]!(before); expect(after, `${p}: the mutation must change the file`).not.toBe(before); writeFileSync(join(T, p), after); }
    return fn();
  } finally { for (const [p, before] of keep) writeFileSync(join(T, p), before); }
}
/** lb01.layers with assisted_pull_up back after hanging_knee_raise (group and closeups), as in W8a. */
const withAssisted = (s: string) => {
  const c = JSON.parse(s), ids: string[] = c.groups[0].ids;
  expect(ids).not.toContain('lib_assisted_pull_up');
  ids.splice(ids.indexOf('lib_hanging_knee_raise') + 1, 0, 'lib_assisted_pull_up');
  const rows = Object.entries(c.closeups), at = rows.findIndex(([k]) => k === 'lib_hanging_knee_raise') + 1;
  c.closeups = Object.fromEntries([...rows.slice(0, at), ['lib_assisted_pull_up', ASSISTED_ROW], ...rows.slice(at)]);
  return `${JSON.stringify(c, null, 2)}\n`;
};
/** lb09.layers with v_up (mistakeGhosts false and a Mistake zoom) staged in its group. */
const withVup = (s: string) => { const c = JSON.parse(s); c.groups[0].ids.push('lib_v_up'); return `${JSON.stringify(c, null, 2)}\n`; };
/** Replaces `a` (exactly once) by `b`. */
const swap = (a: string, b: string) => (s: string) => { expect(s.split(a).length - 1, a).toBe(1); return s.replace(a, b); };
// the step (the mirror's plates page rewritten through applyMistakeGhosts before applyZooms reads it, lib-ship.test.ts:1503)
const CALL = "    writeFileSync(plates, await applyMistakeGhosts(readFileSync(plates), specs));   // F-LAYERS-MGHOST, in the mirror\n";

/** HT4's runNode for one library id, in `T` with T's own modules (a child process); its rows and the batch's page. */
function ht4(T: string, lib: string, chrome: string) {
  const code = `
    import { recorder } from './tools/plates/library/fidelity/rows.mjs';
    import { runNode } from './tools/plates/library/fidelity/twins/ht4.mjs';
    import { rows } from './tools/plates/library/registry.mjs';
    import { createHash } from 'node:crypto';
    const R = recorder(), ctx = { R, root: process.cwd() };
    await runNode(ctx, { lib: ${JSON.stringify(lib)}, chrome: ${JSON.stringify(chrome)} });
    const { html } = await ctx.ht4lib.get(rows().find(r => r.id === ${JSON.stringify(lib)}).batchFile);
    const card = html.slice(html.indexOf('id="card-${chrome}"'));
    const mis = card.match(/<figure class="plate" data-mode="mistake" hidden>(<svg class="plate-svg"[^>]*>[\\s\\S]*?<\\/svg>)/)[1];
    console.log(JSON.stringify({ problems: R.problems, mistake: createHash('sha256').update(mis).digest('hex') }));`;
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', code], { cwd: T, encoding: 'utf8', maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error(r.stderr || r.stdout);
  return JSON.parse(r.stdout.trim().split('\n').pop()!) as { problems: string[]; mistake: string };
}
/** One pinned layers page built in `T` (howto-rebuild --page, T's own modules). */
function layersPage(T: string, golden: string): Buffer {
  const out = join(T, 'out.layers.html');
  const r = spawnSync(process.execPath, ['scripts/howto-rebuild.mjs', '--page', golden, 'layers-page', out], { cwd: T, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(r.stderr || r.stdout);
  return readFileSync(out);
}

describe('F-W8A-ASSISTED A2: assisted_pull_up passes HT4/A5 on a scratch tree that stages it on lb01.layers', () => {
  let T = '';
  beforeAll(() => { T = tree({ [LB01]: withAssisted }); }, 120_000);
  it('green: protected, fragments and poses pass; its layers Mistake svg is the plates pin 5324dd0b…', () => {
    const got = ht4(T, 'lib_assisted_pull_up', 'assisted-pull-up');
    expect(got.problems).toEqual([]);
    expect(got.mistake).toBe(PLATES_MISTAKE);
  }, 300_000);
  it('m1: without the applyMistakeGhosts call, the CI fragments line', () => {
    const got = mutated(T, { [BUILDER]: swap(CALL, '') }, () => ht4(T, 'lib_assisted_pull_up', 'assisted-pull-up'));
    expect(got.problems).toEqual([`lib_assisted_pull_up * HT4/A5-fragments@*: ${CI_FRAGMENTS}`]);
  }, 300_000);
  it('m4: sideOf without the under branch, the CI poses line', () => {
    const got = mutated(T, { [HT4]: swap("    for (const z of posture) if (underOf(z) && id === `${z.key}-under`) return { z, role: 'under' };\n", '') }, () => ht4(T, 'lib_assisted_pull_up', 'assisted-pull-up'));
    // the CI line, and the under side's own anti-blindness entry (still declared) on the same poses row
    expect(got.problems).toEqual([`lib_assisted_pull_up * HT4/A5-poses@*: ${CI_POSES}`,
      'lib_assisted_pull_up * HT4/A5-poses@*: assisted_pull_up|knee-pad|under: no renderPlate call captured for this declared zoom side (anti-blindness)']);
  }, 300_000);
});

describe('F-W8A-ASSISTED A1/m3: a pinned layers page keeps its bytes; ghosts stripped for every spec moves them', () => {
  const LB01_GOLDEN = 'tests/howto/golden/library/lb01.json', committed = () => readFileSync(join(ROOT, 'tests/howto/golden/library/lb01.layers.html'));
  let T = '';
  beforeAll(() => { T = tree(); }, 120_000);
  it('lb01.layers rebuilt in a tree equals the committed page', () => {
    expect(sha(layersPage(T, LB01_GOLDEN))).toBe(sha(committed()));
  }, 300_000);
  it('m3: mistakeGhostsOff true for every spec (the field ignored) changes the lb01 layers page', () => {
    const got = mutated(T, { [GHOSTS]: swap('export const mistakeGhostsOff = spec => spec?.mistakeGhosts === false;', 'export const mistakeGhostsOff = spec => !!spec;') }, () => layersPage(T, LB01_GOLDEN));
    expect(sha(got)).not.toBe(sha(committed()));
  }, 300_000);
});

// Q1 (PLAN RULED 176d0526): m2 (the calls swapped) is an equivalent mutation, so it has no test: applyZooms puts zoomOf's
// group, already passed through mistakeSvg, before the Mistake </svg>, and the scratch lb09 page with v_up built a6b8c65c…
// in both orders. This guard keeps v_up's layers Mistake svg equal to its plates pin.
describe('F-W8A-ASSISTED (Q1): v_up, ghosts off with a Mistake zoom, on a scratch lb09.layers', () => {
  it('HT4/A5 passes; its layers Mistake svg equals its lb09.json plates pin (fragments)', () => {
    const got = ht4(tree({ [LB09]: withVup }), 'lib_v_up', 'v-up');
    expect(got.problems).toEqual([]);
  }, 300_000);
});

// A1 MANIFEST (F-PAIR-FAULTS A2 form): MANIFEST.json, made by manifestOf in this card's [golden update] commit, moves only
// build-layers-page.mjs's key. With that key blanked in every row, it is main e15e1c65's MANIFEST.json with the same blank
// (134 rows carry the key), and each row pins the file's current sha256.
// LIB-PLATEFIX-5 (D-PF5-PINS): PF5's own [golden update] also moves its re-pinned keys and entries; they are put back to
// main a4796243's values first (restorePF5, plus crop.mjs which restorePF5 leaves to the D-CROP-PIN tests), so the blanked
// hash is still main's MANIFEST_BLANKED_MAIN and this card's "only build-layers-page.mjs moved" pin, measured on main, holds.
const MOVED = 'tools/plates/library/build-layers-page.mjs';
const CROP = 'tools/plates/library/render/closeup/crop.mjs';
const CROP_MAIN = '9c1fe67d96ce08f6f5df084ef3efe692260d09be9ca60eaf254a899c70dc03b3';   // crop.mjs on main a4796243 (PF5 moved it; the 4 D-CROP-PIN tests pin it to the current file instead)
// F-HAND-PALMFLAT-SIZE (#424, F-W8A-HOLDS part 3; card rule "add that key to its moved-key list"): its [golden update] also moves
// hands/pairs.mjs's key (134 rows); it is put back to main a4796243's value here too. That card's own blanked-keys test pins
// the key to the current file.
const PFS_PAIRS = 'tools/plates/library/hands/pairs.mjs', PFS_PAIRS_MAIN = '3e89feda3da3f017c970dae250ef4bd6c9c8c82500f861b0c6a720c5c7856ffa';
const toMain = (m: any) => { restorePF5(m); for (const r of Object.values<any>(m.rows)) { if (CROP in r.files) r.files[CROP] = CROP_MAIN; if (PFS_PAIRS in r.files) r.files[PFS_PAIRS] = PFS_PAIRS_MAIN; } return m; };   // F-HAND-PALMFLAT-SIZE: + the pairs.mjs key
const MANIFEST_BLANKED_MAIN = 'ab3f030b4f4be65d64ea3d0431000526c88e1feb5c48882c113605c9fa21ad95';
const blanked = (m: any) => { const c = structuredClone(m); let n = 0; for (const r of Object.values<any>(c.rows)) if (MOVED in r.files) { r.files[MOVED] = ''; n++; } return { n, sha: sha(JSON.stringify(c)) }; };
describe('F-W8A-ASSISTED A1: the MANIFEST blanked-keys test', () => {
  const raw = () => JSON.parse(readFileSync(join(ROOT, 'tools/plates/library/MANIFEST.json'), 'utf8'));
  it('only build-layers-page.mjs\'s key differs from main, and it pins the current file', () => {
    const m = raw(), now = sha(readFileSync(join(ROOT, MOVED)));
    for (const [id, r] of Object.entries<any>(m.rows)) if (MOVED in r.files) expect([id, r.files[MOVED]]).toEqual([id, now]);
    expect(blanked(restoreBSS(toMain(m)))).toEqual({ n: 134, sha: MANIFEST_BLANKED_MAIN });   // F-BSS-REARKNEE (D-RP-PINS): was blanked(toMain(m)), now restoreBSS too (its key pins the current file, then main's value); same hash and n   // LIB-PLATEFIX-5 (D-PF5-PINS): was blanked(m), now blanked(toMain(m)) (PF5's re-pinned keys/entries put back to main first); same hash and n
  });
  it('red: any other key moved', () => {
    const m = raw(), [id, r] = Object.entries<any>(m.rows).find(([, x]) => Object.keys(x.files).length > 1 && Object.keys(x.files).some(k => k !== MOVED && k !== CROP && k !== PFS_PAIRS && k !== BSS_KEY && !(k in PF5_MAIN)))!;
    const other = Object.keys(r.files).find(k => k !== MOVED && k !== CROP && k !== PFS_PAIRS && k !== BSS_KEY && !(k in PF5_MAIN))!;   // F-BSS-REARKNEE (D-RP-PINS): not the bulgarian how-to key either (restoreBSS would undo it)     // F-HAND-PALMFLAT-SIZE: not the pairs.mjs key either   // LIB-PLATEFIX-5 (D-PF5-PINS): a key PF5 does not re-pin, so toMain leaves the mutation in place
    m.rows[id].files[other] = '0'.repeat(64);
    expect(blanked(restoreBSS(toMain(m))).sha).not.toBe(MANIFEST_BLANKED_MAIN);   // F-BSS-REARKNEE (D-RP-PINS): + restoreBSS   // LIB-PLATEFIX-5 (D-PF5-PINS): was blanked(m), now blanked(toMain(m)); the moved key still shows against main's hash
  });
});
