// LIB-7b shared-key scratch tree (card Do 6, 7b-A3; D-LIB-SCRATCHIDS). Never merged; the supervisor pushes the ref
// claude/lib-7b-scratch. Run inside a worktree of this branch's head, with node_modules installed:
//   node tests/library/fixtures/lib7b/scratch.mjs build      stage lib_barbell_row + lib_t_bar_row on curl-dumbbell-under,
//                                                            build the page, pin, real loader + scratch IDS lines, stamps,
//                                                            generate, vite build, budgets, pages file, generate --check,
//                                                            one commit "[do not merge] LIB-7b scratch …"
// Then, in the same tree:
//   MARC_CHROMIUM=… node tools/plates/library/fidelity.mjs --ids lib_barbell_row,lib_t_bar_row --families HT6 \
//     --pages tests/howto/fixtures/lib4b/pages.json --json lib7b-ht6.json
//   MARC_CHROMIUM=… node tests/library/fixtures/lib7b/app-probe.mjs lib_barbell_row lib_t_bar_row
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO, SCRATCH_7B, keyTree, pageOf, stagePairs } from './fixture.mjs';

export const SCRATCH_A3 = SCRATCH_7B.filter(s => s.key === 'curl-dumbbell-under');
const sh = (cmd, args) => execFileSync(cmd, args, { cwd: REPO, stdio: ['ignore', 'pipe', 'inherit'] }).toString();

if (process.argv[2] === 'build') {
  const root = REPO;
  await stagePairs(root, { scratch: SCRATCH_A3 });
  console.log('layers page bytes', pageOf(root).length);
  await keyTree(root, { scratch: SCRATCH_A3 });
  sh(process.execPath, ['tools/plates/generate.mjs']);
  sh(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--logLevel', 'error']);
  const F = await import(join(root, 'tools/plates/library/fidelity/fixture.mjs'));
  console.log('budgets', F.budgets(root, { scratch: SCRATCH_A3 }));
  // LIB-4b's helper stamps setBy 'LIB-4b B5 scratch', which HT-3c B3's setBy format refuses; this tree's entries name LIB-7b
  const bf = join(root, 'tests/howto/budgets.json'), bj = JSON.parse(readFileSync(bf, 'utf8'));
  for (const e of bj.budgets) if (e.setBy === F.SET_BY && SCRATCH_A3.some(s => e.chunk.includes(`-${s.pre}-`))) e.setBy = 'LIB-7b-scratch';
  writeFileSync(bf, `${JSON.stringify(bj, null, 2)}\n`);
  console.log('pages', F.pagesFile(root, { scratch: SCRATCH_A3 }));
  sh(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--logLevel', 'error']);
  console.log(sh(process.execPath, ['tools/plates/generate.mjs', '--check']).trim().split('\n').pop());
  sh('git', ['add', '-A']);
  sh('git', ['commit', '-q', '-m', '[do not merge] LIB-7b scratch: lib_barbell_row + lib_t_bar_row on curl-dumbbell-under (7b-A3, scratch-only IDS lines)']);
  console.log('scratch head', sh('git', ['rev-parse', 'HEAD']).trim());
} else throw new Error('usage: scratch.mjs build');
