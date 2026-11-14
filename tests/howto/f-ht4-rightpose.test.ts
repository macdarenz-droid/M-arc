// F-HT4-RIGHTPOSE (f-ht4-rightpose-card.md part 1, C2). HT4's libraryA5 accepts a zoom's declared Right pose on the calls
// whose crop draws it (D-RP-SCOPE). No held row flips here (D-RP-NOFLIP): dumbbell_shrug and bulgarian_split_squat are
// shown on a scratch tree whose lb03/lb04 layers config holds the one target id in the W8b form (1fdf6975; Q-RP-1: the
// target id only), built and checked with the tree's own modules (the F-W8A-ASSISTED A2 form).
import { describe, expect, it, afterAll, beforeAll } from 'vitest';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const COPY = ['package.json', 'scripts', 'src', 'tools', 'tests/howto/golden', 'docs/research/howto'];
const LB03 = 'tools/plates/library/pages/lb03.layers.json', LB04 = 'tools/plates/library/pages/lb04.layers.json';
const CROP = 'tools/plates/library/render/closeup/crop.mjs';

const trees: string[] = [];
afterAll(() => { for (const t of trees) rmSync(t, { recursive: true, force: true }); });
/** A scratch tree: main's sources, with each `edit` applied (path -> text transform). */
function tree(edits: Record<string, (s: string) => string>): string {
  const T = mkdtempSync(join(tmpdir(), 'f-ht4-rightpose-'));
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
/** A layers config with `id` added to its group after `after` (or last), and its closeups row if it has none (W8b form). */
const staged = (id: string, after: string | null, optionsKey: string) => (s: string) => {
  const c = JSON.parse(s), ids: string[] = c.groups[0].ids;
  expect(ids).not.toContain(id);
  ids.splice(after ? ids.indexOf(after) + 1 : ids.length, 0, id);
  c.closeups[id] ??= { optionsKey };
  return `${JSON.stringify(c, null, 2)}\n`;
};
/** Replaces `a` (exactly once) by `b`. */
const swap = (a: string, b: string) => (s: string) => { expect(s.split(a).length - 1, a).toBe(1); return s.replace(a, b); };

/** HT4's runNode for one library id, in `T` with T's own modules (a child process): its problem rows. */
function ht4(T: string, lib: string, chrome: string): string[] {
  const code = `
    import { recorder } from './tools/plates/library/fidelity/rows.mjs';
    import { runNode } from './tools/plates/library/fidelity/twins/ht4.mjs';
    const R = recorder(), ctx = { R, root: process.cwd() };
    await runNode(ctx, { lib: ${JSON.stringify(lib)}, chrome: ${JSON.stringify(chrome)} });
    console.log(JSON.stringify(R.problems));`;
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', code], { cwd: T, encoding: 'utf8', maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error(r.stderr || r.stdout);
  return JSON.parse(r.stdout.trim().split('\n').pop()!) as string[];
}

describe('F-HT4-RIGHTPOSE C2: the two held rows pass HT4/A5 on a scratch tree that stages them', () => {
  let T = '';
  beforeAll(() => {
    T = tree({ [LB03]: staged('lib_dumbbell_shrug', 'lib_cable_shrug', 'dumbbell_shrug'), [LB04]: staged('lib_bulgarian_split_squat', null, 'bulgarian_split_squat') });
  }, 120_000);
  it('green: dumbbell_shrug (lb03) has protected, fragments and poses clean', () => {
    expect(ht4(T, 'lib_dumbbell_shrug', 'dumbbell-shrug')).toEqual([]);
  }, 300_000);
  it('green: bulgarian_split_squat (lb04) has protected, fragments and poses clean', () => {
    expect(ht4(T, 'lib_bulgarian_split_squat', 'bulgarian-split-squat')).toEqual([]);
  }, 300_000);
  it('m1 (real row): the Right crop drawing shrug\'s declared TOP with scap elev 13 is red, with the declared-Right text', () => {
    const got = mutated(T, { [CROP]: swap('const p = howto.plate, right = poseOf(z.right), solid', "const p = howto.plate, right = role === 'right' ? mergeDeep(poseOf(z.right), { scap: { elev: 13 } }) : poseOf(z.right), solid") },
      () => ht4(T, 'lib_dumbbell_shrug', 'dumbbell-shrug'));
    expect(got.length).toBeGreaterThan(0);
    for (const l of got) expect(l).toMatch(/^lib_dumbbell_shrug \* HT4\/A5-poses@\*: dumbbell_shrug\|dshrug-top-right: poses\.(start|end) matches neither a reference pose nor its declared Right pose \(/);
  }, 300_000);
});

// D-RP-OPTIN (#425 6868123318): the D-LIB4b-POSES (7) proof runs unchanged and passes; its two shipped Right pins
// (pull_up|shoulders-right, hanging_leg_raise|shoulders-right) are still reported, since neither pair is on the ruled list
describe('F-HT4-RIGHTPOSE D-RP-OPTIN: poses-proof.mjs passes unchanged', () => {
  it('green: PASS, the derived rule rejects only the two shipped Right pins', () => {
    const r = spawnSync(process.execPath, ['tools/plates/library/fidelity/poses-proof.mjs'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 });
    expect(r.stdout + r.stderr).toContain('PASS: HT-4 accepts every call; the derived rule rejects only pull_up|shoulders-right and hanging_leg_raise|shoulders-right');
    expect(r.stdout + r.stderr).not.toMatch(/FAIL|was not reported/);
  }, 300_000);
});
