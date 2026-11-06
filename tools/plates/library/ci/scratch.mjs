// LIB-4c (card LIB-4c Do 10; D-LIB4c-1 (a), D-LIB-SCRATCHIDS, D-LIB4-FIXTURE-3, D-LIB4b-F5, D-LIB4b-COPYEDITS): builds the
// scratch tree for the CI evidence C11-C14 on claude/lib-4c-scratch, and checks its inputs (C16). Never runs in main CI;
// the supervisor pushes the ref. Run inside the scratch worktree (its own modules):
//   node tools/plates/library/ci/scratch.mjs merge <sup-lib4-ci ref> <#181 sha>   merge commits: the wiring, then LIB-6
//   node tools/plates/library/ci/scratch.mjs seam                                 the ci-verdict.mjs CLI seam, one commit
//   node tools/plates/library/ci/scratch.mjs build                                the 6 scratch ids, generate, vite build,
//                                                                                 budgets, MANIFEST.json, C16, one commit
//   node tools/plates/library/ci/scratch.mjs check                                C16 on the built tree (prints the report)
//   node tools/plates/library/ci/scratch.mjs seed <1|2|3>                         one C12 seeded failure, one commit
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { BATCH, COPY_EDITS, budgets, exerciseOf, page, paths, pin, scratchTargetProblems, stage, transformSources } from '../fidelity/fixture.mjs';
import { manifestOf, manifestText, MANIFEST } from './manifest.mjs';

/** The scratch set: two targets per usable pool source, each with its own pair key (D-LIB4c-1 (a)). F-SCRATCH-SYNTH
 *  (#397, D-LIB8M-SCRATCH7B form): each id is synthetic, a copy of `copyOf`'s exercises.json entry in the tree only;
 *  copyOf is the real id the entry named before. */
export const SCRATCH_4C = [
  { id: 'lib_scratch_fourc_a', copyOf: 'lib_jumping_jacks', archetype: 'pull', from: 'lat_pulldown', key: 'lib4c-scratch-a' },   // D-LIB11-SCRATCHA: was lib_barbell_row (pilot A)
  { id: 'lib_scratch_fourc_b', copyOf: 'lib_one_arm_dumbbell_row', archetype: 'pull', from: 'lat_pulldown', key: 'lib4c-scratch-b' },
  { id: 'lib_scratch_fourc_c', copyOf: 'lib_t_bar_row', archetype: 'pull', from: 'seated_cable_row', key: 'lib4c-scratch-c' },
  { id: 'lib_scratch_fourc_d', copyOf: 'lib_landmine_row', archetype: 'pull', from: 'seated_cable_row', key: 'lib4c-scratch-d' },
  { id: 'lib_scratch_fourc_e', copyOf: 'lib_sled_push', archetype: 'push', from: 'machine_chest_press', key: 'lib4c-scratch-e' },   // D-LIB11-SCRATCHIDS (a): was lib_smith_machine_bench_press (pilot B)
  { id: 'lib_scratch_fourc_f', copyOf: 'lib_smith_machine_incline_press', archetype: 'push', from: 'machine_chest_press', key: 'lib4c-scratch-f' },
];
/** docs/howto/library/arch/batchlines.md @ 4a9fd86 (D-LIB-SCRATCHIDS): never a scratch target. */
export const LB1 = ['chin_up', 'hanging_knee_raise', 'assisted_pull_up', 'inverted_row', 'close_grip_pulldown', 'underhand_lat_pulldown', 'single_arm_lat_pulldown', 'straight_arm_pulldown', 'chest_supported_row', 'resistance_band_row', 'incline_machine_press', 'shoulder_press', 'horizontal_leg_press', 'leg_press_calf_raise'];
export const LB2 = ['dumbbell_bench_press', 'barbell_bench_press', 'incline_dumbbell_press', 'incline_barbell_bench_press', 'decline_bench_press', 'close_grip_bench_press', 'dumbbell_shoulder_press', 'barbell_overhead_press', 'arnold_press', 'dumbbell_fly', 'skull_crusher', 'dumbbell_pullover'];
/** Ids other fixtures use (LIB-2b's clone, LIB-4b's B5 set). */
export const TAKEN = ['lib_cable_lateral_raise', 'lib_scratch_fourb_a', 'lib_scratch_fourb_b', 'lib_scratch_fourb_c', 'lib_scratch_pull_row', 'lib_scratch_sevenb_row', 'lib_scratch_sevenb_press'];
/** D-LIB11-SCRATCHIDS (a) and D-LIB11-SCRATCHA: pinned batches' ids (pilot B's held crunch included), never a scratch target. */
export const PILOT_A = ['barbell_row', 'dumbbell_bench_press', 'dumbbell_shoulder_press', 'barbell_overhead_press', 'romanian_deadlift', 'single_leg_romanian_deadlift', 'upright_row', 'pec_fly', 'dumbbell_biceps_curl', 'rope_triceps_pushdown', 'plank', 'mountain_climbers', 'triceps_pushdown'];
export const PILOT_B = ['smith_machine_bench_press', 'seated_leg_curl', 'cable_fly', 'push_up', 'crunch'];
/** LIB-8R (D-LIB8R-PINLINES, D-LIB11-SCRATCHIDS): PILOT-A2's pinned ids, never a scratch target. */
export const PILOT_A2 = ['box_jump', 'bent_over_dumbbell_rear_delt_fly'];
/** PILOT-A3 (D-A3-PINLINES, D-LIB11-SCRATCHIDS): PILOT-A3's pinned ids, never a scratch target. */
export const PILOT_A3 = ['reverse_lunge', 'dumbbell_fly'];

/** Refuses a scratch set that targets an LB1/LB2 id, a taken id, a shared key or an id outside exercises.json. */
export function setProblems(set, root = ROOT) {
  const known = new Set(JSON.parse(readFileSync(join(root, 'src/data/exercises.json'), 'utf8')).map(e => e.id)), out = [];
  for (const s of set) {
    const name = s.id.replace(/^lib_/, '');
    if (LB1.includes(name) || LB2.includes(name)) out.push(`${s.id} is an ${LB1.includes(name) ? 'LB1' : 'LB2'} id (D-LIB-SCRATCHIDS)`);
    if (TAKEN.includes(s.id)) out.push(`${s.id} is another fixture's id`);
    if (PILOT_A.includes(name) || PILOT_B.includes(name)) out.push(`${s.id} is a pilot ${PILOT_A.includes(name) ? 'A' : 'B'} id (D-LIB11-SCRATCHIDS)`);
    if (PILOT_A2.includes(name)) out.push(`${s.id} is a PILOT-A2 id (D-LIB11-SCRATCHIDS)`);
    if (PILOT_A3.includes(name)) out.push(`${s.id} is a PILOT-A3 id (D-LIB11-SCRATCHIDS)`);
    if (!s.copyOf && !known.has(s.id)) out.push(`${s.id} is not in src/data/exercises.json`);
  }
  out.push(...scratchTargetProblems(set, root));   // F-SCRATCH-SYNTH: a batches/ row; a real synthetic id; a missing copyOf
  if (new Set(set.map(s => s.id)).size !== set.length) out.push('an id is listed twice');
  if (new Set(set.map(s => s.key)).size !== set.length) out.push('a pair key is shared');
  return out;
}

/** The CLI block of scripts/ci-verdict.mjs at GATE-SPLIT 06ce286 (:123-137), which the seam replaces. */
export const CLI_BEFORE_SHA256 = '33b7bd90de6d3c41e3a49a94c68d7ae652a23b4a657825605169234981a8bb46';
export const CLI_START = "if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {\n";
/** The seam (D-GATESPLIT-ONE: the CLI block only): the library family's problems and notes join gate-verdict's, its
 *  line goes into the PASS line and the step summary. Do 11 commits these same bytes. */
export const SEAM = `if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = process.argv[2];
  if (!dir) { console.error('usage: node scripts/ci-verdict.mjs <proof dir>'); process.exit(2); }
  const { gate, ht10 } = collect(dir);
  const { ht10AllTuples } = await import('../tools/plates/fidelity/harness.mjs');
  const { problems, notes } = verdict({
    gate, ht10, gateSrc: readFileSync(GATE_FILE, 'utf8'), times: JSON.parse(readFileSync(TIMES_FILE, 'utf8')),
    sha: process.env.GITHUB_SHA, event: process.env.GITHUB_EVENT_NAME, arrangement: process.env.MARC_GATE_ARRANGEMENT || 'split',
    needs: JSON.parse(process.env.MARC_NEEDS || '{}'), ht10Tuples: await ht10AllTuples(),
  });
  // LIB-4c (D-LIB4-VERDICT): the library family, from the same proof folder
  const L = await import('../tools/plates/library/ci/verdict.mjs'), { rebuild, shards } = L.collectLibrary(dir);
  const lib = await L.libraryVerdict({ lib: shards, rebuild, gate, sha: process.env.GITHUB_SHA, ref: process.env.GITHUB_REF, event: process.env.GITHUB_EVENT_NAME, needs: JSON.parse(process.env.MARC_NEEDS || '{}') });
  problems.push(...lib.problems); notes.push(...lib.notes);
  if (process.env.GITHUB_STEP_SUMMARY) (await import('node:fs')).appendFileSync(process.env.GITHUB_STEP_SUMMARY, \`\${lib.line}\\n\`);
  for (const m of gate) console.log(\`gate \${m.meta?.tz} job \${m.meta?.job?.k}/\${m.meta?.job?.K}: \${m.rows.filter(r => r.check === 'gate').length} groups, \${m.meta?.gateSeconds} s\`);
  for (const n of notes) console.log(\`note: \${n}\`);
  if (problems.length) { console.error(\`gate-verdict FAIL (\${problems.length}):\\n\${problems.join('\\n')}\`); process.exit(1); }
  console.log(\`gate-verdict PASS: \${gate.length} gate proofs and \${ht10.length} ht10 proofs on \${process.env.GITHUB_SHA}; every group x time zone once, every HT-10 tuple x time zone once; \${lib.line}\`);
}
`;
const sha = b => createHash('sha256').update(b).digest('hex');

/** scripts/ci-verdict.mjs with the seam in place of its CLI block. Throws if the block before it is not 06ce286's. */
export function seamed(text) {
  const i = text.indexOf(CLI_START);
  if (i < 0 || text.indexOf(CLI_START, i + 1) >= 0) throw new Error('scratch: ci-verdict.mjs has no single CLI block');
  if (CLI_BEFORE_SHA256 && sha(text.slice(i)) !== CLI_BEFORE_SHA256) throw new Error(`scratch: ci-verdict.mjs's CLI block is not GATE-SPLIT 06ce286's (${sha(text.slice(i))})`);
  return text.slice(0, i) + SEAM;
}

const sh = (root, cmd, args) => execFileSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 1 << 28 }).trim();
const commit = (root, msg) => { sh(root, 'git', ['add', '-A']); sh(root, 'git', ['commit', '-q', '-m', msg]); return sh(root, 'git', ['rev-parse', 'HEAD']); };

/** F-SCRATCH-SYNTH: the set problems on a built scratch tree (the check and seed steps). Every setProblems refusal is
 *  kept (LB1/LB2, TAKEN, the pilot ids, an id outside exercises.json, a batches/ row, a missing copyOf, a duplicate id, a
 *  shared pair key) except the two that the build itself makes true for each synthetic id:
 *    - "<id> is a row of batches/zz-lib4b.json": the build writes the scratch batch;
 *    - "<id> is in src/data/exercises.json (a copyOf id is synthetic)": addSynthetic writes the entry.
 *  In their place the built state is required: each id in exercises.json and a row of the scratch batch. */
export function builtProblems(set, root = ROOT) {
  const own = new Set(set.flatMap(s => [`${s.id} is a row of batches/${BATCH.split('/').pop()}`, `${s.id} is in src/data/exercises.json (a copyOf id is synthetic)`]));
  const out = setProblems(set, root).filter(p => !own.has(p));
  const known = new Set(JSON.parse(readFileSync(join(root, 'src/data/exercises.json'), 'utf8')).map(e => e.id));
  const rows = Object.keys(JSON.parse(readFileSync(join(root, BATCH), 'utf8')).rows ?? {});
  for (const s of set) {
    if (!known.has(s.id)) out.push(`${s.id} is not in the built tree's src/data/exercises.json`);
    if (!rows.includes(s.id)) out.push(`${s.id} is not a row of ${BATCH}`);
  }
  return out;
}

/**
 * C16 (part, node side): the copied sources differ from the 8's only in the id, name, research-card and import lines and
 * the ruled COPY_EDITS (a line diff of each clone against its source).
 */
export function copyProblems(root, set = SCRATCH_4C) {
  const out = [];
  for (const s of set) {
    const t = transformSources(s, root), P = paths(s);
    for (const [kind, mine, src] of [['spec', t.spec, `tools/plates/layers/exercises/${s.from}.mjs`], ['howto', t.howto, `tools/plates/layers/exercises/${s.from}.howto.mjs`]]) {
      const a = readFileSync(join(root, src), 'utf8').split('\n'), b = mine.split('\n');
      // LIB-5v (D-LIB5v-FIXLINE): a target whose exercises.json equipment has '/' carries exactly one inserted line,
      // `    variantLine: '<second kind>.',`, directly after the clone's one `  copy: {` line; it is taken out here, so
      // every other line keeps the comparison below. Any other target carries none (the line count catches one).
      if (kind === 'howto') {
        const kinds = String(exerciseOf(s, JSON.parse(readFileSync(join(root, 'src/data/exercises.json'), 'utf8'))).equipment ?? '').split('/').map(k => k.trim());   // F-SCRATCH-SYNTH
        const at = b.flatMap((l, i) => (l === '  copy: {' ? [i] : []));
        if (at.length !== 1) { out.push(`${s.id} howto: ${at.length} copy lines, want 1`); continue; }
        if (kinds.length > 1) {
          const want = `    variantLine: '${kinds[1]}.',`;
          if (b[at[0] + 1] !== want) { out.push(`${s.id} howto:${at[0] + 2}: ${JSON.stringify(b[at[0] + 1]?.trim() ?? '').slice(0, 80)}, want the variant line ${JSON.stringify(want.trim())}`); continue; }
          b.splice(at[0] + 1, 1);
        }
      }
      if (a.length !== b.length) { out.push(`${s.id} ${kind}: ${b.length} lines, its source ${a.length}`); continue; }
      const edits = (COPY_EDITS[s.from] ?? []).map(([from, to]) => [from, to]);
      for (let i = 0; i < a.length; i++) {
        if (a[i] === b[i]) continue;
        const allowed = /\bimport\b|\bfrom\s*['"]/.test(a[i]) || (kind === 'spec' && a[i].includes(`id: '${s.from}', name: '`) && b[i].includes(`id: '${P.card}', name: '`))
          || (kind === 'howto' && ((a[i].includes(`id: 'lib_${s.from}'`) && b[i].includes(`id: '${s.id}'`)) || (a[i].includes('research: { card:') && b[i].includes(`research: { card: '${P.research}'`))))
          || edits.some(([from, to]) => a[i].includes(from) && b[i] === a[i].replace(from, to));
        if (!allowed) out.push(`${s.id} ${kind}:${i + 1}: ${JSON.stringify(a[i].trim()).slice(0, 80)} -> ${JSON.stringify(b[i].trim()).slice(0, 80)}`);
      }
    }
  }
  return out;
}

/** C12's seeded failures, each a one-place edit of scripts/howto-shard.mjs on its own scratch ref: [anchor, text, how]. */
export const SEEDS = {
  // 1 px: LIB-4b's 1 px shift fixture on lib_landmine_row's plate rows
  1: ['{ ids, pages, P: LIB_P, log: m => console.error(m) }', "{ ids, pages, P: LIB_P, log: m => console.error(m), fixtures: { shift: ['lib_landmine_row'] } }", 'replace'],
  // the plan hash: the shard job edits times.json after howto-rebuild planned
  2: ['  const { problems, hash } = inputProblems(', "  { const tf = join(ROOT, 'tools/plates/library/ci/times.json'), tt = JSON.parse(readFileSync(tf, 'utf8')); tt.default += 1; writeFileSync(tf, `${JSON.stringify(tt, null, 1)}\\n`); console.log('C12 seed 2: times.json default', tt.default); }\n", 'before'],
  // a dropped row: shard 2 drops its first library row from its proof before upload
  3: ["  mkdirSync(join(ROOT, 'screenshots/howto-evidence'), { recursive: true });", "  if (k === 2) { const pf = join(ROOT, `screenshots/howto-proof-${k}of${K}.json`), pj = JSON.parse(readFileSync(pf, 'utf8')), i = pj.rows.findIndex(r => r.id.startsWith('lib_')); console.log('C12 seed 3 dropped', JSON.stringify(pj.rows[i])); pj.rows.splice(i, 1); writeFileSync(pf, JSON.stringify(pj, null, 1)); }\n", 'before'],
};
/** scripts/howto-shard.mjs with seed n applied. Throws unless its anchor occurs exactly once. */
export function seededShard(text, n) {
  const [a, b, how] = SEEDS[n] ?? [];
  if (!a || text.split(a).length !== 2) throw new Error(`scratch: seed ${n} has no single anchor in howto-shard.mjs`);
  return text.replace(a, how === 'replace' ? b : b + a);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [step, ...rest] = process.argv.slice(2), root = ROOT;
  // F-SCRATCH-SYNTH: check and seed run on the built tree, where the build has added each synthetic id and its batch row
  const bad = ['check', 'seed'].includes(step) ? builtProblems(SCRATCH_4C, root) : setProblems(SCRATCH_4C, root);
  if (bad.length) { console.error(`scratch: refused:\n${bad.join('\n')}`); process.exit(1); }
  if (step === 'merge') {
    const [wiring, lib6] = rest;
    if (!wiring || !lib6) throw new Error('usage: scratch.mjs merge <sup-lib4-ci ref> <#181 sha>');
    for (const ref of [wiring, lib6]) sh(root, 'git', ['merge', '--no-ff', '--no-edit', ref]);
    console.log(`merged ${wiring} and ${lib6}: ${sh(root, 'git', ['rev-parse', 'HEAD'])}`);
  } else if (step === 'seam') {
    const f = join(root, 'scripts/ci-verdict.mjs'), next = seamed(readFileSync(f, 'utf8'));
    writeFileSync(f, next);
    console.log(`seam: scripts/ci-verdict.mjs sha256 ${sha(next)}; commit ${commit(root, 'scratch: the ci-verdict.mjs CLI seam (LIB-4c Do 11 bytes) [do not merge]')}`);
  } else if (step === 'build') {
    stage(root, { scratch: SCRATCH_4C });
    console.log('layers page bytes', page(root));
    console.log('facts', JSON.stringify(pin(root, { scratch: SCRATCH_4C })));
    sh(root, process.execPath, ['tools/plates/generate.mjs']);
    sh(root, process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--logLevel', 'error']);
    console.log('budgets', budgets(root, { scratch: SCRATCH_4C }));
    sh(root, process.execPath, ['tools/plates/generate.mjs', '--check']);
    writeFileSync(join(root, MANIFEST), manifestText(await manifestOf(root)));
    const c = copyProblems(root);
    if (c.length) { console.error(`C16 copy diff:\n${c.join('\n')}`); process.exit(1); }
    console.log(`scratch tree: ${commit(root, '[do not merge] [golden update] LIB-4c scratch: 6 source-level scratch ids and their MANIFEST.json rows (D-LIB4c-1 a)')}`);
  } else if (step === 'check') {
    const c = copyProblems(root);
    console.log(`C16 set (built tree): ${SCRATCH_4C.map(s => s.id).join(', ')}: every setProblems rule but the build's own zz-lib4b rows and exercises.json entries; each id a zz-lib4b row and in exercises.json`);
    console.log(c.length ? `C16 copy diff FAIL:\n${c.join('\n')}` : 'C16 copy diff: only id, name, research-card and import lines and the ruled COPY_EDITS differ');
    process.exit(c.length ? 1 : 0);
  } else if (step === 'seed') {
    const n = +rest[0], f = join(root, 'scripts/howto-shard.mjs');
    writeFileSync(f, seededShard(readFileSync(f, 'utf8'), n));
    console.log(`seed ${n}: commit ${commit(root, `[do not merge] LIB-4c C12 seed ${n}`)}`);
  } else throw new Error('usage: scratch.mjs merge|seam|build|check|seed <1|2|3>');
}
