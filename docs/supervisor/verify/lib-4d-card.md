Card LIB-4d: scale test fixes (D-LIB4a-SCALE, lib4-cards.md section 12 item 20; 2026-10-18)

id: LIB-4d
model: claude-opus-5-5 (not mechanical: each fix must be shown to keep every assertion and loosen nothing)
mode: auto
title: 'Builder: LIB-4d scale test fixes'
branch: claude/lib-4d-scale-fixes (new). Your first push opens draft PR 'LIB-4d: scale test fixes'.

Stops (these override every other line in this card):
1. Lane slot (D-LIB-LANE-ACTIVE, section 12 items 2 and 21: in the freed-slot queue LIB-4d follows LIB-5 Do 2 on and LIB-3b, and moves ahead only when its deadline is next; in a park it goes before LIB-9a and LIB-5). This card holds a LIB lane slot. Start only when one supervisor PR comment or session message says 'LIB-4d start' and gives the active-builder count. Before that, do nothing: no branch, no commit, no run. Never start on a merge, a CI result, a comment on another PR or a self-wake. If the supervisor says park, stop at your next local commit, push nothing and wait for 'LIB-4d resume'.
2. Nothing is loosened. Every assertion stays, with the same matcher. No timeout is added to an existing test, and none is raised or removed: vitest's default 5,000 ms and the files' own 180_000, 120_000, 300_000, 600_000 and 900_000 stay, and so does the 10,000 ms hook default. The one new limit is on the new test lib-4d R2 (Do 8): `}, 300_000);`, because R2 builds four repo copies (13.7 s at the 8, 25.8 s at 22, 26.6 s at 153). R1 keeps the 5,000 ms default. A local `--testTimeout` flag used only to measure a duration (S5) is never committed. No test, block or case is cut, skipped or split to fit a limit. If a fix below cannot keep a test green under its existing timeout on the 8, 22 or 153 tree, stop and report on the PR.
3. Never commit or push the scratch trees or any LOCAL PROBE line (the three probes of Do 7).

CI manners (D-LIB-CIMANNERS, lib4-cards.md section 12 item 1, read as in section 14 'What the builder does next' item 4): the GATE-SPLIT train has merged, so only this applies: at most one push per 2 hours until READY, unless the supervisor asks for a push. Never use [skip ci]. Never cancel, re-run or dispatch another card's run.

base: origin/main @ b99a9e25 (train 25: LIB-4a #233 @ 0b2d3c18 and #251 merged). Every file this card edits has the same blob on b99a9e25 as on LIB-4a's head 0b2d3c18, so the line numbers below hold on b99a9e25.
- Merge origin/main with a merge commit before review and again before READY. Run `git pull --no-rebase` before each push. Never force-push, rebase or amend. If the branch moves without your push, stop and report.

depends_on: LIB-4a (merged in train 25; tools/plates/library/scale/write-ids.mjs builds the scratch trees). LIB-2 and LIB-2b (merged; the tests this card fixes).

build_prerequisites: the supervisor's 'LIB-4d start' (Stops 1), sent only after the supervisor records under section 12 item 20 the reading of D-LIB4a-SCALE (c)'s "under 5 s" given in outcome. Nothing else: every file is on main.

merge_prerequisites:
- Deadline (D-LIB4a-SCALE (c), read strictly; the supervisor records this reading under section 12 item 20 (c) and item 21 together with the 'under 5 s' reading): LIB-4d merges before the first merge that does any of these: (1) adds a row with id lib_barbell_row or lib_cable_lateral_raise, or with chromeId or prefix barbell-row or cable-lateral-raise, to any file under tools/plates/library/batches/, at any stage (registry.mjs:34-36 refuses a duplicate at every stage, so L2-A4's lb-test.json row and E1's zz-lib2b.json row would throw); (2) ships any library row (library-rows.test.ts :92, :94 and :108 pin mainOut, today the repo's own render, to 60 and the E1 tree to 66); (3) takes main's shipped rows past 22. At 02:3x UTC (re-checked 03:5x UTC) no open PR head adds a file under tools/plates/library/batches/, except LIB-4a's scratch #237, which never merges. Pilot A #109 holds lib_barbell_row's card and will ship it once it has batch rows.
- Merge order: none forced. This card's lines are disjoint from LIB-4b #232, LIB-4c #246 and LIB-5 #244, including LIB-5's planned D-LIB5-SCRATCH and D-LIB5-COUNTS lines. A three-way merge of each pair is clean (collision table). Checklist order still applies.
- If LIB-4c #246 is on main when LIB-4d merges main, LIB-4d runs tests/howto/library-ci.test.ts and library-manifest.test.ts on its merged head and lists the results. They call fixtureTree() (#246 @ 0e703495: library-ci.test.ts :275, :393 and :514; library-manifest.test.ts C0, describe :38, call :42). If LIB-4d merges first, the supervisor adds the same run to LIB-4c's merge prerequisites.
- A fresh Opus review PASS against this card.
- Every check green on a head that contains the latest main.

shared-file owners:
- tests/howto/library-core.test.ts (LIB-2). LIB-4a's PINS-2 lines are :150-159, :358-361, :377, :380 and :454-455. LIB-5's D-LIB5-COUNTS lines (Do 9 only) are :248, :249, :253 and :254. This card edits only the write_scope lines. L2-A4's identity lines :73-75 stay byte-equal (D-LIB2b-PINS (2)).
- tests/howto/library-rows.test.ts (LIB-2b). LIB-5's D-LIB5-COUNTS lines are :90, :92, :94 and :108. They keep their exact text, so LIB-5 still finds each one by its text.
- tests/howto/fixtures/lib2b/fixture.mjs (LIB-2b). LIB-5's three D-LIB5-SCRATCH lines go after the last import line (:16), before stageTree()'s own `  return root;` (:67 on main, :91 after this card; ownRowsTree's `return root;` lines at :66 and :79 are not the anchor) and before pinTree()'s `  return m;` (:121 on main, :145 after this card; both as built in the prototype with Do 2's golden and pages removal). Each keeps its text and its function; only its line number moves. ownRowsTree gets no D-LIB5-SCRATCH line: its tree holds only the 8, whose stamps LIB-5 commits, and markScratch stays just before stageTree()'s own `return root;`.
- tests/howto/generate.test.ts (HT-2, LIB-2b), tests/howto/css.test.ts (HT-2, LIB-2b) and tests/howto/hint.test.ts (HT-6; PINS-2 gave it to LIB-4a, now merged). css.test.ts's HT2-A6 blocks also run inside feel.test.ts, hands.test.ts and zooms.test.ts, because those files import it. That is where D-LIB4a-SCALE's "zooms HT2-A6" comes from. Those three files are not edited.
- tests/howto/sections-risks.test.ts (HT-9). LIB-5's two add-only D-LIB5-RISKSTEST lines (section 14 OPEN-1: after the `@/howto/archetypes` import, :10, and inside FLAG after :30) are not this card's lines. A simulated `git merge-file` of them against this card's two lines is clean.
- tools/plates/generate.mjs is the frozen HT-2 core (generate.mjs:3, plan 2.2): read only. tools/plates/library/registry.mjs is read only. It is an input of every generated file, so any edit there changes every generated header on main and on every open head.
- docs/COACHING-DECISIONS.md: append only.

hard card: no design note. The fixes below were built and run on scratch trees at 8, 22 and 153 shipped ids while this card was written (see Reproduction). Build them as written. Where your code has to differ from this text, the Acceptance rows decide.

outcome: the five tests that D-LIB4a-SCALE names, plus three more with the same cause (two found by this card's reproduction, one by its review), pass at 8, 22 and 153 shipped ids, each under its existing timeout, with every assertion kept:
- library-core L2-A13 and L2-A4 read only their own rows. L2-A13 builds its rows from the 8 (`reg.rows(undefined, { batches: [] })`) plus its own row. L2-A4 runs in a tree of the 8 alone (the new ownRowsTree) plus lb-test.json.
- library-rows E1 builds its tree from the 8 alone plus its own row (stageTree uses ownRowsTree), and compares it with the same tree without that row. E2 and E3 still read the repo's own output.
- generate.test 'plates.mjs writes exactly the 8 modules…' reads generatedOnDisk() once, not once for each file in generated/.
- D-LIB4a-SCALE (c)'s "under 5 s" applies to the tests on vitest's 5,000 ms default (L2-A13, 'plates.mjs writes exactly…', HT2-A6, 'own hashes', HT6-A8, HT9-A3). L2-A4 and E1 render a whole tree and keep their own 180_000 / 600_000 / 900_000 (L2-A4 took 33.5 s at the 8 and 66.7 s at 153 with one render). The supervisor records this reading under item 20 before 'LIB-4d start'.
- The tests that load every shipped ht-<slug>.ts read it from its text (the new readHowTo in tests/howto/generated-module.ts), not through vite's transform: css.test HT2-A6 'every style="" custom property…' (it runs in 4 files), generate.test 'the module's own hashes.inputsSha256 equals its header' (new), hint.test HT6-A8 'howToHint gives golden B's cue…' (new) and sections-risks.test HT9-A3 'renders every risk row…' (new: its modules() at :26-27 feeds :35, :70 and :82; it timed out at 5,012 ms in the full run on the fixed 153 tree, once the HT2-A6 tests stopped warming vite's transform).
deliverable: one PR.
evidence: S0-S9.
finish: merged before the deadline above. You will notice: nothing visible.

design_reference:
- lib4-cards.md on origin/claude/sup-lib4-cards @ 9cf84d4c or later:
  - section 12 item 20 (D-LIB4a-SCALE), item 2 (D-LIB-LANE-ACTIVE) and item 21 (the freed-slot queue);
  - section 1 D-LIB4-PINS-2: a failure on a synthetic scratch tree is a clone artifact only if it names a synthetic id's missing source or generated file, and a count pinned to the 8 never is;
  - 11.2 D-LIB2b-PINS (2): L2-A4's identity list is not edited (today :73-75 on main);
  - section 14 NEW-3 (D-LIB5-FIXTURE: LIB-5's tests use E1's tree), NEW-6 (D-LIB5-SCRATCH) and NEW-9 (D-LIB5-COUNTS).
- LIB-4a's evidence comment 6243767609 and review PASS 6244211629 on #233: the scratch method, the library-core :14 probe and the error lines.
- tools/plates/generate.mjs: :20 GENERATED_DIRS and :67 generatedOnDisk, which walks src/howto, src/slices/howto/css and tools/plates/library and reads every file in them on each call; :71-80 diff(), whose 'stale: no plugin writes it' marks files to remove.
- tools/plates/gen/ids.mjs:147: inside render(), has() reads ctx.prev, not the disk. So render() reads no generated file, and a tree's stale generated files do not change its output (checked on the 153 tree, Do 2).
- Precedent for reading a file's literal with new Function: tests/theme.test.ts:43, tests/howto/hands.test.ts:46, tools/plates/library/scale/write-ids.mjs:44.

connectivity: none. No stored or sent user data, no storage key, no network call, no dependency.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md; .claude/rules/shared-files.md.
- The design_reference sections above, and this card's Reproduction and collision table.
- On main b99a9e25:
  - tests/howto/library-core.test.ts :1-15, :57-88, :238-256 and :337-362;
  - tests/howto/library-rows.test.ts :1-126 and :160-232;
  - tests/howto/fixtures/lib2b/fixture.mjs (whole file) and tests/howto/fixtures/batches/lb-test.json;
  - tests/howto/generate.test.ts :1-27 and :78-170;
  - tests/howto/css.test.ts :1-20 and :128-142; tests/howto/hint.test.ts :1-42; tests/howto/sections-risks.test.ts :1-40 and :66-82; tests/howto/shipped-rows.ts;
  - tests/howto/library-rows.test.ts :424-462 (D-LIB2b-PAGES (7): the E1 tree's tests/howto/golden/library);
  - tools/plates/generate.mjs; tools/plates/library/registry.mjs :22-56; tools/plates/gen/ids.mjs :108-119 and :138-159; tools/plates/library/scale/write-ids.mjs.
- LIB-4c #246 @ 0e703495: tests/howto/library-ci.test.ts :270-300 and tests/howto/library-manifest.test.ts :1-60 (they use fixtureTree()).

write_scope (line numbers on main b99a9e25):
- New files:
  - tests/howto/generated-module.ts (readHowTo, about 22 lines);
  - tests/howto/lib-4d.test.ts (R1 and R2, about 70 lines).
- tests/howto/fixtures/lib2b/fixture.mjs:
  - :13: add readdirSync to the node:fs import;
  - :56-60 become the new `export function ownRowsTree({ src = REPO } = {})` (Do 2), whose first three lines are today's :58-60, followed by stageTree's own doc comment (:56) and signature (:57) unchanged and one line `const root = ownRowsTree({ src });`. Nothing from :61 on changes.
- tests/howto/library-core.test.ts:
  - :3: add cpSync to the node:fs import; add one line `import { join } from 'node:path';`;
  - :4: add onTestFinished to the vitest import;
  - L2-A4: :72, :78, :82 and :84-86 (Do 3). :73-77, :79-81 and :83 stay byte-equal;
  - L2-A13: one new line before :350 (`const own = reg.rows(undefined, { batches: [] });`), and `reg.rows()` becomes `own` on :350, :352 and :355. :348 and :354 stay.
- tests/howto/library-rows.test.ts: :31 (add `repoOut`), :37 (Do 4), and `mainOut` becomes `repoOut` on :167 and :208.
- tests/howto/generate.test.ts: one import line after :8; :79; :94; :101 plus one line after it (Do 5); :137.
- tests/howto/css.test.ts: one import line after :9; :133.
- tests/howto/hint.test.ts: :11 (LOADERS is no longer imported) plus two import lines; :36.
- tests/howto/sections-risks.test.ts (HT-9; LIB-5's two add-only D-LIB5-RISKSTEST lines are not these): one import line after :12, `import { readHowTo } from './generated-module';`; :27 becomes `  .map(async f => readHowTo(f.slice(3, -3)));`. :26, :11 (the BuiltHowTo type import, then unused; tsconfig has no noUnusedLocals and the repo has no lint step) and every call site stay.
- docs/COACHING-DECISIONS.md: append D-LIB4d-OWNROWS and D-LIB4d-READ, as built.

reserved_paths:
- tools/** (the generate.mjs core, registry.mjs, write-ids.mjs, synthetic.mjs, fidelity/** and qa/**), src/** and tests/howto/checks/**.
- tests/howto/fixtures/batches/lb-test.json and every other fixture file stay unchanged. The mutations edit them only in a scratch copy.
- Every line of the edited files outside write_scope, in particular:
  - the D-LIB5-COUNTS lines (library-core :248, :249, :253 and :254; library-rows :90, :92, :94 and :108);
  - LIB-4a's PINS-2 lines (library-core :150-159, :358-361, :377, :380 and :454-455);
  - fixture.mjs :16 and :61-122;
  - sections-risks.test.ts: every line but the two above, and LIB-5's D-LIB5-RISKSTEST lines once they land.
- feel.test.ts, hands.test.ts, zooms.test.ts, lib-4a.test.ts, library-scale.test.ts and budgets.test.ts.
- scripts/** (screenshot-gate.mjs included), tests/theme.test.ts and src/ui/styles.css. No gate block is added.
- .github/**, package.json, package-lock.json and vite.config.ts.
- Every timeout value and every budget file.
- The watch agent's paths.

Do:
1. On 'LIB-4d start', branch from origin/main @ b99a9e25. Build the scratch trees first (Do 7) and run S0 on the 153 tree, so the PR shows each red before the fix.
2. ownRowsTree in lib2b/fixture.mjs. It returns a temp repo copy that holds the 8 and no batch row:
   - copy COPY into a new mkdtemp root and symlink node_modules, exactly as :58-60 do today;
   - if the copy's tools/plates/library/batches/ holds no .json file, return the root. This is the plain copy it always was;
   - else, for each .json file there (README.md stays), remove it, its batch golden file tests/howto/golden/library/<same file name> (registry.mjs:72 batchGoldenOf) and every path its `pages` names, each with `rmSync(…, { force: true })`. Readers glob that folder, not the registry: main's library-rows D-LIB2b-PAGES (7) (:444 flags any file there with no batch, :452 wants exactly zz-lib2b's two files in the E1 tree), candidate.mjs parentEntry (:32-33), LIB-4c's pinnedPages (#246 verdict.mjs:36-49) and LIB-4b's fidelity/tuples.mjs pinnedPlate (#232 :56-57). Then, in one `node(root, …)` child (the file's own runner, :71), run: `import { rmSync, writeFileSync } from 'node:fs'; import { diff, render } from './tools/plates/generate.mjs'; const out = await render(); for (const b of diff(out)) if (b.why.startsWith('stale')) rmSync(b.path); for (const [p, { text }] of out) writeFileSync(p, text);`. Every generated file that only the dropped rows had is now gone, and the rest are the copy's own output for the 8;
   - stageTree() calls it in place of :58-60: `const root = ownRowsTree({ src });`.
   What this rests on (checked on the 153 tree): a copy with the batches dropped and the same copy after the rewrite render the same 60 files byte for byte, because render() reads no generated file; ownRowsTree took 13 s on the 153 tree with nothing else running. A dropped row's research output (docs/research/howto/<id>.json) is outside GENERATED_DIRS, so `generate --check` does not cover it and it stays. Nothing in the tree reads it unless a row names it.
3. library-core L2-A4 (:72-86). Every expect line stays; only the source of the rows and of the base changes:
   - :72 becomes: `const F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));`, `const t = F.ownRowsTree(), LB = 'tests/howto/fixtures/batches/lb-test.json';`, `onTestFinished(() => F.drop(t));`, `cpSync(LB, join(t, LB));`, `const ID_FILES = [<the four id files of :85>];`, and `reg` and a new `tgen` imported from the tree (`await import(/* @vite-ignore */ F.url(t, 'tools/plates/library/registry.mjs'))` and `await import(/* @vite-ignore */ F.url(t, 'tools/plates/generate.mjs'))`), not from the repo. Every new import() carries `/* @vite-ignore */`, as every url() import in these files does (library-core :11-13, library-rows :33, :37);
   - :78 becomes `const base = new Map([...paths, ...ID_FILES].map(p => [p, { text: readFileSync(join(t, p), 'utf8') }]));` then `reg.__setExtraBatches([LB]);`. `base` is the tree's generated files, which are its own generator's output for the 8: ownRowsTree rewrote them if it dropped a batch, and with no batch file they are main's committed files, which generate --check keeps fresh;
   - :82: `withRow = await tgen.render();`;
   - :84-86: `out` becomes `base`, and :85's literal list becomes ID_FILES.
   Why base comes from the disk: one render instead of two. A variant with two renders took 145 s of its 180 s on the 153 tree in a 9-file run. This one took 67 s. The test's 180_000 stays.
4. library-rows E1 (:31, :37, :167 and :208). :37 becomes three steps:
   - `const eight = F.ownRowsTree();`
   - `try { mainOut = await (await import(/* @vite-ignore */ F.url(eight, 'tools/plates/generate.mjs'))).render(); } finally { F.drop(eight); }`
   - `repoOut = await (await import(/* @vite-ignore */ url('tools/plates/generate.mjs'))).render();`
   mainOut is now the same tree of the 8 alone. It equals the repo's own output while only the 8 ship, so :90-:108 (E1's counts and its extra list) compare the E1 tree with it at any scale. E3 (:167) and E2 (:208) read repoOut, the repo's own output, as before. `eight` is removed inside beforeAll and never added to tmps: the afterAll rmSync loop already hit its 10,000 ms hook timeout twice here (Reproduction), and this card adds nothing to it.
5. generate.test HT2-A2 'plates.mjs writes exactly…' (:93-102):
   - :79 becomes `let reads = 0;` and `const onDisk = () => { reads++; return gen.generatedOnDisk() as string[]; };`;
   - in the test: `const r0 = reads, disk = onDisk();` at :94; `disk` in place of both onDisk() calls (:94, :101); and a last line `expect(reads - r0).toBe(1);`. A re-read per file is then red at the 8 too, not only as a 153 timeout.
6. readHowTo, in the new tests/howto/generated-module.ts. `readHowTo(slug, root = '.')` reads src/howto/generated/ht-<slug>.ts and requires:
   - the header line, matching /^\/\/ GENERATED, do not edit\. Written by tools\/plates\/generate\.mjs \([^)]+\)\. inputsSha256=[0-9a-f]{64}\n/;
   - then exactly `import type { BuiltHowTo } from '../types';\n\nexport default {` … `} satisfies BuiltHowTo;\n`, with no `\n(import|export)\b` inside.
   It returns `new Function(`return {${literal}};`)()`, with `// eslint-disable-next-line no-new-func` above it. Any other shape throws, naming the path. Use it at four call sites:
   - css.test.ts :133: `const m = readHowTo(SLUG_OF.get(id)!);`
   - generate.test.ts :137: `readHowTo(slug).hashes.inputsSha256` in place of `(await load(slug)).hashes.inputsSha256`. `load` stays, for HT2-A1's 8;
   - hint.test.ts :36: `readHowTo(SHIPPED.find(r => r.id === id)!.slug)` in place of `(await LOADERS[id]!()).default`. :11 drops LOADERS, and SHIPPED is imported from './shipped-rows';
   - sections-risks.test.ts :27: `.map(async f => readHowTo(f.slice(3, -3)))` in place of the import() line.
   lib-4d.test R1 ties readHowTo to what it replaces:
   - it deep-equals import() for each of the 8;
   - for every shipped id, loaders.ts has exactly one LOADERS line `  <id>: () => import('./ht-<slug>'),`, and readHowTo(slug).id === id;
   - it refuses a file with no header, with an extra import line, with an extra export line, and with no satisfies tail.
7. Scratch trees (local only, never pushed):
   - for n = 22 and n = 153: `git worktree add` a copy of your head (not `git archive`: in S8's full run tests/gate-split.test.ts cannot load outside a git checkout, `Error: Command failed: git rev-parse HEAD`), symlink node_modules, then from a checkout of main run `node tools/plates/library/scale/write-ids.mjs <n> <copy>`. The 8 is your head itself;
   - on the 22 and 153 copies only, add these two LOCAL PROBE lines (D-LIB4a-SCALE (a): the repo's own render() refuses every synthetic row, because no synthetic row has a pinned page, LIB-2b E3 pagesOf):
     - library-core.test.ts, the beforeAll line `out = await gen.render();` (:14 on main, :15 after this card's import line): `try { out = await gen.render(); } catch { out = new Map(); }   // LOCAL PROBE ONLY`;
     - library-rows.test.ts, the repoOut line: `try { repoOut = …render(); } catch { repoOut = new Map(); }   // LOCAL PROBE ONLY`.
   - on the 153 copy only, LOCAL PROBE 3 (the hint probe), for the S0 and S5 hint timing run only, in a run of its own: in hint.test.ts HT6-A8, the two expect lines inside `for (const id of HOWTO_IDS)` (main :37-38, after the readHowTo or LOADERS line) become one line `void h;   // LOCAL PROBE ONLY`, so the loop times only the reads. S8's run uses only the first two probes.
   Show every probe diff in the PR. With the probes in place, the tests that read `out` or `repoOut` stay red on the scratch trees. List them as clone artifacts, with their error lines (S8).
8. R2 in lib-4d.test (ownRowsTree). Build every check relative to `eight`, never to the repo, so R2 still holds when main ships rows:
   - `eight = F.ownRowsTree()` holds no batch .json file, at any scale;
   - ownRowsTree({ src: eight }) lists the same files as eight in tools/plates/library/batches, src/howto, src/howto/generated, src/slices/howto/css, tests/howto/golden/library and tools/plates/library/pages (a missing folder lists as []; the plain copy);
   - make a source from eight plus four changes: lb-test.json as a batch file with `pages: { plates: 'tools/plates/library/pages/lb-test.json', layers: 'tests/howto/golden/library/lb-test.layers.html', layersConfig: 'tools/plates/library/pages/lb-test.layers.json' }` and those three files planted (`{}`), a planted tests/howto/golden/library/lb-test.json (`{}`; mkdir the folder, main has none), a planted src/howto/generated/ht-zz-stale.ts (`core.header(...)` + 'export default {};'), and one byte appended to src/howto/ids.ts. ownRowsTree of that source lists the same files as eight in the same six folders, and its ids.ts equals eight's;
   - R2 has its own limit, `}, 300_000);` (Stops 2).
9. Decisions: append to docs/COACHING-DECISIONS.md:
   - D-LIB4d-OWNROWS: fixture trees hold the 8 alone plus their own rows (no other batch's golden file or pages), why L2-A4's base comes from the disk, and why L2-A4 and E1 are held to their own timeouts, not 5 s (one render per tree: 33.5 s / 66.7 s for L2-A4 at the 8 / 153);
   - D-LIB4d-READ: the generated-module reader, and the rule that generatedOnDisk() is read once per test.
10. Run S1-S9 on each tree. Record each named test's duration, and list each mutation's red line in the PR.

Acceptance (each with mutations that must turn red; list them in the PR with their exact red lines):
| ID | Criterion | Evidence | Red before because | Mutations (each red) |
|---|---|---|---|---|
| S0 | The reds reproduce before the fix | On the 153 tree built from main, with the :14 probe: the error lines in Reproduction 2, plus 'own hashes' run alone and the hint probe | — | — |
| S1 | L2-A13 reads only its own rows | Green under 5 s on the 8, 22 and 153 trees | 153: `AssertionError: expected [ Array(153) ] to not include 'lib_barbell_row'` | `own` back to `reg.rows()` → red on 153 with that line. A duplicate own row (`[...own, { id: 'lib_barbell_row', stage: 'shipped' }, …approved-plate row]`) → red on the 8: `expected [ 'lib_dumbbell_lateral_raise', …(8) ] to not include 'lib_barbell_row'` |
| S2 | L2-A4 reads only its own batch row | Green on the 8, 22 and 153 trees within its 180,000 ms; durations listed | 153: `Error: registry: tests/howto/fixtures/batches/lb-test.json: id lib_barbell_row already used by tools/plates/library/batches/zz-synthetic.json lib_barbell_row` | In a scratch copy of lb-test.json: its row's id becomes lib_pull_up → `Error: registry: tests/howto/fixtures/batches/lb-test.json: id lib_pull_up already used by tools/plates/plates.json lib_pull_up`. A second row lib_dumbbell_bench_press (an exercises.json id that does not ship) with chromeId barbell-row and its own slug and prefix → `Error: registry: tests/howto/fixtures/batches/lb-test.json: chromeId barbell-row already used by tests/howto/fixtures/batches/lb-test.json lib_barbell_row` |
| S3 | library-rows E1's tree holds the 8 and its own row | beforeAll green, and E1's tests (:79-126) and the E1/E3/E7 failure paths green on the 8, 22 and 153 trees within their timeouts | 153: `Error: registry: tools/plates/library/batches/zz-synthetic.json: id lib_cable_lateral_raise already used by tools/plates/library/batches/zz-lib2b.json lib_cable_lateral_raise`. 22: `Error: generate failed in the E1 tree:` with `Error: library: lib_dumbbell_bench_press (batch SYNTH, tools/plates/library/batches/zz-synthetic.json): shipped, but its batch file has no pages` (LIB-2b E3, pagesOf, on the copied synthetic rows) | stageTree back to the plain copy → red on 153 with that line. BATCH_ROW's chromeId set to 'pull-up' in a scratch copy → `Error: registry: tools/plates/library/batches/zz-lib2b.json: chromeId pull-up already used by tools/plates/plates.json lib_pull_up` |
| S4 | generatedOnDisk() read once | 'plates.mjs writes exactly…' green under 5 s on the 8, 22 and 153 trees | 153: `Error: Test timed out in 5000ms.` With a long timeout it ran 42.6 s | :101's `disk` back to `onDisk()` → red on the 8 (`expected 35 to be 1`) and on 153 (`Test timed out in 5000ms.`) |
| S5 | Every shipped module read from its text | Green under 5 s on the 8, 22 and 153 trees: css HT2-A6 'every style="" custom property…' in all 4 files (css, feel, hands, zooms), and generate 'own hashes', both alone and in the set. hint HT6-A8's loop under 5 s on 153 with the hint probe (Reproduction 3). sections-risks HT9-A3 under 5 s on the 8, 22 and 153 trees, alone and in the full `npx vitest run` (alone 21 / 32 / 195 ms; 172-177 ms in 3 more runs at 153) | 153: `Test timed out in 5000ms.` in feel.test (5,013 ms) and zooms.test (5,019 ms) in the full run; css.test timed out (5,021 ms) when run with generate.test only. 'own hashes' alone timed out at 5,025 ms. The hint probe timed out at 5,004 ms. sections-risks HT9-A3, in the full run on the 153 tree with the other fixes: `Error: Test timed out in 5000ms.` (5,012 ms); alone, unfixed, 4.0-4.5 s in 14 of 18 runs and timed out (5,011-5,048 ms) in 4 | Each call site back to import() or LOADERS, each file run alone on the 153 tree (css.test.ts, generate.test.ts -t 'own hashes', hint.test.ts with the hint probe) → `Test timed out in 5000ms.` The same run with a local `--testTimeout=60000` (measurement only, never committed) records its duration: 'own hashes' about 5.8-6.2 s, css HT2-A6 about 6.2 s and the hint probe about 5.6-5.7 s, against 140-320 ms after the fix. sections-risks :27 back to import() → red in the full `npx vitest run` on the 153 tree (`Test timed out in 5000ms.`); alone it is reported, not counted. A mutation that runs under 5,000 ms is reported, not counted as red |
| S6 | readHowTo returns what import() returns | lib-4d R1 green on the 8, 22 and 153 trees | new | `text.match(HEADER)` made `text.match(HEADER) ?? ['']` → `expected [Function] to throw an error`. The shape check's `if` line deleted → `expected [Function] to throw error matching /module shape/ but got '<path>…'`. The `/\n(import|export)\b/` check deleted → `expected [Function] to throw error matching /import or export line/ but got 'Unexpected token \'export\''`. readHowTo returns `{}` for slug pull-up → `lib_pull_up: expected {} to deeply equal { schema: 1, id: 'lib_pull_up', …(17) }`. In a scratch copy, loaders.ts's lib_pull_up line pointed at ./ht-leg-press → `lib_pull_up: expected [ Array(1) ] to deeply equal [ Array(1) ]` |
| S7 | ownRowsTree drops rows, their outputs, batch golden files and pages, else copies | lib-4d R2 green on the 8, 22 and 153 trees | new | Batch removal removed → `tools/plates/library/batches: expected [ 'README.md', 'lb-test.json' ] to deeply equal [ 'README.md' ]`. Stale removal removed → `src/howto/generated: expected [ 'feel-barbell-back-squat.ts', …(34) ] to deeply equal [ 'feel-barbell-back-squat.ts', …(33) ]`. The rewrite removed → `expected '// GENERATED, do not edit. Written by…' to be '// GENERATED, do not edit. Written by…' // Object.is equality` (ids.ts). Golden and pages removal removed → `tests/howto/golden/library: expected [ 'lb-test.json', …(1) ] to deeply equal []`. The golden file left out of the removal → `tests/howto/golden/library: expected [ 'lb-test.json' ] to deeply equal []`. The pages left out → `tests/howto/golden/library: expected [ 'lb-test.layers.html' ] to deeply equal []` |
| S8 | Nothing else turns red; the rest is listed | Run the 9 files plus sections-risks.test.ts, then the full `npx vitest run`, on each scratch tree with the two probes. List every red with its error line. Each one is a clone artifact: under D-LIB4-PINS-2 it names a synthetic id's missing source or generated file; under D-LIB4a-SCALE (a) it names a synthetic id's missing page (which (a) rules qualifies under PINS-2), or reads `out`/`repoOut`, which the probe empties in place of the render() that (a) rules a clone artifact. Expected on 22 and 153 (Reproduction 4): library-core L2-A3 ×2, L2-A20, '60 files', L2-A21 and L2-A5; generate 'each header's inputsSha256 is recomputed'; hint HT6-A8; zooms HT7-A1 'LIB-2b: each shipped library row's panels'; library-rows E3 dangling, E2, D-LIB2b-FEEL and D-LIB2b-PINS (11). Also budgets.test HT-3c B3 ×2 when the full suite runs. For the three whose error line names no missing file, the PR gives the cause line: zooms HT7-A1, zooms.test.ts:67 `r.pages!.layers` on a synthetic row with no `pages`; D-LIB2b-FEEL, library-rows.test.ts:333 `row.pages.layers`, the same cause; hint HT6-A8, tools/plates/gen/ids.mjs:141, write-ids' measuring mode gives hints only to ids with a How-to source, and no synthetic id has one. Not a clone artifact and not this card's: library-rows' afterAll `Error: Hook timed out in 10000ms.` (seen on the 22 run here and on LIB-4a's head at the 8). If it occurs, list it with its run under "pre-existing, reported (risk_and_recovery)", never as known, and go on | — | — |
| S9 | Scope and no regression | `git diff origin/main...HEAD` touches only write_scope lines. No existing timeout literal changes; the only new one is lib-4d R2's `300_000`. `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` green on the merged head; CI green | — | — |

verification: the PR body maps each S row to its run. For each run it names the tree (8, 22 or 153), the sha the trees were built from, and each named test's duration. Before READY, merge origin/main, then re-run S1-S7 on the 8 and 153 trees, and S9 (`npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`), on that exact head. Also before READY, re-run the collision diff over write_scope on every open head and post it in the PR.

risk_and_recovery:
- A batch PR reaches the merge queue before LIB-4d and meets the deadline's (1), (2) or (3). Its own CI is red on L2-A4 or E1. Stop and report; the supervisor holds that train until LIB-4d merges (the deadline).
- LIB-5 relies on E1's tree being unchanged (D-LIB5-FIXTURE). At the 8, ownRowsTree is the plain copy (R2), so LIB-5's tree stays byte-identical until main ships a batch. After that, the tree holds the 8 plus lib_cable_lateral_raise only, which is what LIB-5's cases assume. If a LIB-5 case on main reads a real batch row through fixtureTree(), stop and report.
- LIB-4c's library-ci.test.ts and library-manifest.test.ts build fixtureTree() too, and LIB-4c's pinnedPages() (#246 verdict.mjs:36-39, used by rebuildAll and libraryVerdict) lists every .json in tests/howto/golden/library. ownRowsTree removes each dropped batch's golden file and pages (R2), so at scale their tree holds one row and only zz-lib2b's pinned pages, which C0's "1 row" and C9's list (library-ci.test.ts :528) expect. Main's own D-LIB2b-PAGES (7) (library-rows.test.ts :449-453) reads the same folder in the E1 tree: without that removal, the first real batch with a golden file turns :451 and :452 red (checked: a planted batch with pages and golden file left ['lb-test.json', 'lb-test.layers.html', 'zz-lib2b.layers.html'] in the staged tree; with the removal, ['zz-lib2b.layers.html']). The re-run is in merge_prerequisites.
- tests/howto/fixtures/lib2b/build-page.mjs:6 (LIB-2b's provenance command, never run in CI) calls stageTree({ page: null, src: W }). With a batch in W it now drops W's rows, their batch golden files and their pages first. The page comes from layersSpecOf(F.BATCH), which keeps only that batch file's rows (tools/plates/library/layers-spec.mjs:46), so the provenance page is unchanged. Do not edit build-page.mjs (reserved: every other fixture file).
- Latent, outside this card (report it to the supervisor, do not fix it here):
  - Tests that a clone artifact stops early on the scratch trees (S8) cannot be timed there. One of them, generate 'each header's inputsSha256 is recomputed', calls a writer's outputs() once per file when the writer has no inputsFor (handpairs.mjs). The first real batch (LB1 or pilot A) will time them. A 5 s timeout there falls under the same rule: no timeout is raised.
  - LIB-4b's fidelity/fixture.mjs stage() writes zz-lib4b.json into a tree that keeps the repo's batches. Its three scratch ids (lib_underhand_lat_pulldown, lib_chest_supported_row, lib_cable_chest_press; #232 fidelity/fixture.mjs:27-29) will collide the same way once a real batch ships one of them. The first two are LB1 ids whose specs LIB-9a #245 adds, so LB1's shipping merge is that deadline. LIB-4c's 6 (ci/scratch.mjs SCRATCH_4C, scratch ref only, never main CI) include lib_barbell_row, pilot A's id. LIB-4b's file is reserved here.
- library-rows' afterAll hit its 10,000 ms hook timeout twice here, unchanged by this card: once on LIB-4a's head at the 8 (5 files in parallel), and once on the 22 tree (9 files). Its rmSync loop runs over the E1 trees. CI was green on 0b2d3c1. If it fails on your head, report it with the run. Do not raise the hook timeout.
- A scratch run is slow. The 9 named files took 3-6 min per tree here (4 cores). Run them locally; CI runs only your head.
- An error on a scratch tree that is not a listed clone artifact, and is not the afterAll hook timeout above (listed as pre-existing in S8): stop and post it on the PR. Never mark it known.

return: PR number, head sha, the sha the scratch trees were built from, one evidence line per S row with each named test's duration on the 8, 22 and 153 trees, the mutation red lines, and the S8 list of clone artifacts.

Reproduction (this card's own runs, 2026-10-18 01:30-02:32 UTC)
1. Setup. The trees were built from LIB-4a's head 0b2d3c18, which equals main b99a9e25 for every file here. They were made with `node tools/plates/library/scale/write-ids.mjs 153|22 <copy>`: 878 files at 153 in 1.8 s, 92 files at 22 in 0.4 s. The machine has 4 cores and Node v22.22.0. The :14 probe was on the 153 tree. At 153 the synthetic batch holds lib_barbell_row and lib_cable_lateral_raise; at 22 it holds 14 chest ids and neither of the two.
2. The reds at 153 before the fix: full `npx vitest run`, 16 failed tests in 8 files, 3,084 passed, 154.6 s. The named ones:
   - L2-A13: `AssertionError: expected [ Array(153) ] to not include 'lib_barbell_row'`;
   - L2-A4: `Error: registry: tests/howto/fixtures/batches/lb-test.json: id lib_barbell_row already used by tools/plates/library/batches/zz-synthetic.json lib_barbell_row`;
   - library-rows, the whole suite: `Error: registry: tools/plates/library/batches/zz-synthetic.json: id lib_cable_lateral_raise already used by tools/plates/library/batches/zz-lib2b.json lib_cable_lateral_raise`;
   - generate 'plates.mjs writes exactly…': `Error: Test timed out in 5000ms.` It was still running at 54.3 s; alone with --testTimeout=300000 it took 42.6 s;
   - HT2-A6 'every style="" custom property…': feel.test 5,013 ms and zooms.test 5,019 ms (`Test timed out in 5000ms.`); css.test 2,592 ms and hands.test 715 ms passed on the warm transform cache. With only generate.test and css.test running, css timed out at 5,021 ms; with a long timeout it took 10.9 s;
   - found by this card: 'own hashes' alone timed out at 5,025 ms (684 ms on a warm cache). The hint HT6-A8 loop, with its two assertions turned off in a probe copy, timed out at 5,004 ms. Unprobed, it fails first on the clone artifact `lib_decline_bench_press: expected undefined to be 'Heel of palm, wrist straight.'`;
   - the cause, measured: importing the 153 ht- modules through vitest took 17.4 s one by one and 8.9 s in parallel; readHowTo read all 153 in 129 ms. generatedOnDisk() reads all of src/howto (44 MB of generated files at 153) again for each of the 614 files in generated/.
3. After the fix (the prototype in this card), the 9 named files on each tree, in ms. The 22 and 153 trees ran with both probes:
   | Test | 8 | 22 | 153 |
   |---|---|---|---|
   | L2-A13 | 124 | 38 | 43 |
   | L2-A4 (180,000 ms limit) | 33,526 | 48,451 | 66,730 |
   | E1 'generate --check and npm run build' (600,000 ms limit); every other E1 test | 24,382; ≤ 4 | 21,733; ≤ 4 | 17,599; ≤ 4 |
   | E1/E3/E7 '7 mutations, each refused' (900,000 ms limit) | 39,708 | 40,045 | 30,492 |
   | 'plates.mjs writes exactly…' | 82 | 37 | 142 |
   | 'own hashes' (alone at 153: 193) | 18 | 60 | 319 |
   | HT2-A6 css / feel / hands / zooms | 65 / 13 / 28 / 18 | 74 / 44 / 43 / 36 | 253 / 536 / 486 / 317 |
   | hint HT6-A8 | 27 | clone artifact | clone artifact; the hint probe took 139 |
   | R1 ×3 | ≤ 1,188 | ≤ 1,437 | ≤ 1,109 |
   | R2 (300,000 ms limit) | 13,708 | 25,751 | 26,613 |
   | sections-risks HT9-A3 with readHowTo at :27, alone (review round 2; with the import() line kept, the full run at 153 timed out at 5,012 ms) | 21 | 32 | 195 |
   - The 8: 9 files, 290 passed, 0 failed (202 s). `tsc --noEmit` is clean.
   - 22 and 153: every red is in S8's list. The library-rows afterAll hook timed out once on the 22 run.
   - Mutations run on the 8: M5 read-once (`expected 35 to be 1`); L2-A4 id → lib_pull_up and the duplicate chromeId; L2-A13's duplicate own row; BATCH_ROW chromeId pull-up; the three R2 removals; and the readHowTo header check. Each was red with the line quoted in Acceptance.
   - The probe at 153 showed the two copies (batches dropped only, and rewritten) render the same 60 files.
4. Clone artifacts after the fix, 22 and 153 (the same set on both; error lines):
   - library-core L2-A3 ×2: `expected [ 'no generator output' ] …`;
   - library-core L2-A20: `Cannot read properties of undefined (reading 'writers')`;
   - library-core '60 files': `expected +0 to be 930` (153) / `144` (22);
   - library-core L2-A21: `expected [ Array(1) ] to deeply equal []`;
   - library-core L2-A5: `closure: tools/plates/library/howto/lib_dumbbell_bench_press.howto.mjs does not exist`;
   - generate 'each header's inputsSha256…': `library: lib_ab_wheel_rollout (batch SYNTH, …zz-synthetic.json): shipped, but its batch file has no pages`;
   - hint HT6-A8: `lib_decline_bench_press: expected undefined to be 'Heel of palm, wrist straight.'`;
   - zooms HT7-A1 (LIB-2b rows): `Cannot read properties of undefined (reading 'layers')`;
   - library-rows E3: `Cannot read properties of undefined (reading 'text')`;
   - library-rows E2: `ht-dumbbell-lateral-raise.ts: expected 0 to be greater than 0`;
   - library-rows D-LIB2b-FEEL: `reading 'layers'`;
   - library-rows D-LIB2b-PINS (11): `lib_dumbbell_bench_press … has no pages`.
   Each of these reads an output emptied by a probe, or names a synthetic id's missing page, source or generated file.

Collision table (open heads at 02:30 UTC, against main b99a9e25; `git diff --name-only origin/main...<head>` over library-core, library-rows, fixtures/lib2b/fixture.mjs, fixtures/batches/**, generate, css, hint, feel, zooms, hands and sections-risks .test.ts, shipped-rows.ts, generated-module.ts, lib-4d.test.ts, tools/plates/library/batches/**, tests/howto/golden/library/**, generate.mjs, registry.mjs and docs/COACHING-DECISIONS.md; re-checked 03:5x UTC, 27 open heads)
| Head | Touches | Lines | Result |
|---|---|---|---|
| LIB-4b #232 @ 575fa75b | none but docs/COACHING-DECISIONS.md (row below; its library-core lines are LIB-4a's, now on main). Imports only `node` from lib2b/fixture.mjs (unchanged) | — | no collision |
| LIB-4c #246 @ 0e703495 | library-core.test.ts: an older copy of LIB-4a's lines; docs/COACHING-DECISIONS.md (row below) | main :157-159 (L2-A12) and :377 (L2-A15); it takes main's text when it merges main | disjoint from :3-4, :72-86 and :349-355; `git merge-file` clean. Uses fixtureTree() in library-ci.test.ts and library-manifest.test.ts (merge_prerequisites re-run) |
| LIB-5 #244 @ 9628a35c | none today (738cdd3e..9628a35c changes only docs/howto/library/LIB-5-DESIGN.md). Planned: fixture.mjs D-LIB5-SCRATCH (after :16, before :67 and before :121); library-core :248/:249/:253/:254 and library-rows :90/:92/:94/:108 (D-LIB5-COUNTS, Do 9); sections-risks.test.ts after :10 and after :30 (D-LIB5-RISKSTEST, Do 9) | — | disjoint. Simulated `git merge-file` of LIB-4d against the D-LIB5-SCRATCH, D-LIB5-COUNTS and D-LIB5-RISKSTEST edits is clean for all four files |
| #92, #181, #188, #191, #193, #232, #242, #243 and #246 | docs/COACHING-DECISIONS.md: each adds entries | near or at the end of its base | append-only: on each main merge, on a conflict keep both sides, theirs first, LIB-4d's two entries last, and change no other line |
| LIB-4a scratch #237 @ 05a5ce58 | tools/plates/library/batches/zz-synthetic.json | — | do not merge; never lands |
| LIB-9a #245 @ 42576484, pilot A #109 @ e6f39ffb, and #88, #94, #144, #149, #158, #190, #192, #197, #209, #221, #249 and #253 | none of the listed paths | — | no collision; none adds a batch file |
| LIB-6 #181, LIB-12 #191 and LIB-7 #193 | only docs/COACHING-DECISIONS.md (row above) | — | no collision; none adds a batch file |
| #1, #3 (no merge base with main) | no commit touches tests/howto or tools/plates | — | no collision |
