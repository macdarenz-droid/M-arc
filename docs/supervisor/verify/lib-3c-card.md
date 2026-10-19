Card LIB-3c: AUTHORQA, fresh-import PQ-H7, PARAMS ranges and the D/T child proof (2026-10-18; queued by D-LIB3b-H7, lib-3b-card.md amendment 2; scope from the LIB-10 rulings items 10-11)

id: LIB-3c
model: claude-opus-5-5 (not mechanical: the fresh loader, the child rebuild, the ranges loader and the mutation proofs)
mode: auto
title: 'Builder: LIB-3c fresh H7, PARAMS ranges and child proof'
branch: claude/lib-3c (new). Your first allowed push opens draft PR 'LIB-3c: AUTHORQA, fresh-import PQ-H7, PARAMS ranges and the D/T child proof'.

base: origin/main @ 2078913c251633bbc5ea39a41dc4ca41a429c59e (train 27; LIB-3b #258 is on main).
- candidate.mjs there is blob aeae572e60cf94057d9ca7653eb7bb4cec3922ee, the same as at #245's merge base 0628270a. So #245's file applies whole (Do 1).
- Merge origin/main with a merge commit before review and before READY. Run `git pull --no-rebase` before each push. Never rebase, amend or force-push.
- #245 is read only. Copy its hunk with `git show`; never merge its head.

depends_on: LIB-2 (derive.mjs), LIB-3 #180 (qa/), LIB-2b #234 (candidate.mjs, tests/howto/fixtures/lib2b/fixture.mjs), LIB-3b #258 (h10 reads the envelope). All merged.

build_prerequisites:
- Lane (D-LIB-LANE-ACTIVE): this is a LIB builder card. It holds a slot. The cap is 4 active LIB builders: LIB-4b, LIB-4c, LIB-10 and LIB-3c fill it (supervisor, 2026-10-18; LIB-10 rulings item 10). Start only when the supervisor sends 'LIB-3c start' by session message, with the live count. Later messages also come as a PR comment. Never start on any other event.
- If the supervisor tells you to park, stop at your next local commit, push nothing, and wait for 'LIB-3c resume'.
- Do 1, Do 2 and Do 3 start at once. Do 4-6 wait for the supervisor's look at your design note (hard card).
- Family rows: none are needed to build. If the supervisor posts a family row under D-LIB10-RANGES 4b before your READY, commit it byte for byte as the ruling quotes it, in its own commit. Never write a row of your own.

CI manners (D-LIB-CIMANNERS, lib4-cards.md section 12 item 1, read as in section 14 'What the builder does next' item 4):
- The GATE-SPLIT train has merged, so: at most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci].
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them until it says go. Never cancel, re-run or dispatch a run that is not yours.
- Before your first push, work in local commits and end each turn with your HANDOFF block in your reply; from the first push it lives in the PR body. Never write to the owner.
- Run any job that may last over 1 hour (the local gate, a full test:tz run) as a detached process, for example `setsid nohup <cmd> > <log> 2>&1 &`. Then poll its log. A tool background job stops at about 2 hours, and a stopped run is never evidence.

merge_prerequisites:
- A fresh Opus review PASS against this card.
- Every check green on a head that contains the latest main.
- The owner's checklist order: the supervisor numbers this card. It merges in a merge train (claude/sup-merge-train-<n>), as LIB-3b did in train 27. It may merge before #245.
- Before it merges, the supervisor has posted on #245: when #245 merges main, take main's candidate.mjs whole if git reports a conflict there; after that merge, `git diff origin/main -- tools/plates/library/candidate.mjs` prints nothing. The same post carries every lb1-plates.test.ts row that 3c-A11 lists as changed, with its new keys (the D-copy tests 3c-A11 lists).
- Deadlines. It must be on main before:
  - any T row's QA counts as evidence, and before any D row exists on any branch (D-LIB10-CHILDPROOF item 5);
  - LIB-10's qa.mjs and Do 8 (D-LIB9-AUTHORQA);
  - the first batch after LB1 is QA'd (D-LIB3b-H7).

hard card: yes. Several designs are possible (the fresh loader, how a derived spec reaches the page builder, how the family object meets the envelope). Write the short design note in Do 2 and post it with your first push, before Do 4-6.

outcome:
Gap today (main 2078913c):
- D-LIB9-AUTHORQA lives only on #245 (candidate.mjs blob 5a5c559057189145d9f61b23dc3c6813ed35d6ac @ 38b436d). LIB-10's qa.mjs needs it.
- PQ-H7 renders twice in one process from one spec object (node.mjs:188-193). A value fixed at import time is missed (D-LIB3b-H7, COACHING-DECISIONS.md:2452-2461). h7Builds (node.mjs:202-205) is never called. candidate.mjs:66 imports an H/D/T spec once, in place.
- PARAMS ranges have no home. envelope.json names no PARAMS key, so every D/T param is H10.envelope (COACHING-DECISIONS.md:2451), and it cannot hold one (selftest.mjs:23-25; pin.mjs:1-3, :64).
- h10 checks the params and rebuilds the parent only (node.mjs:299-302). The drawing comes from the row's own file (candidate.mjs:66), so a source that derives and then edits passes PQ-H10.
After this card:
- candidate.mjs is #245's file plus this card's changes. `authoring: true` works as on #245.
- PQ-H7 keeps its in-process second render and adds a render from a fresh import, for every mode. The import-time case turns H7.determinism red. The per-call case, a per-call counter that a fresh import resets (M8) and a render that throws stay red.
- qa/param-ranges.json and its loader exist (D-LIB10-RANGES). They hold no family row unless a ruling posted before READY quotes one. PQ-H10 and the child proof's derive() read one object per row (D-LIB3c-SHARED). On the real path a missing file, family or key gives H10.envelope.
- PQ-H10 proves a D or T child with clean params equals its derivation (H10.child:<fragment>, H10.child:threw). For T, the parent proof also goes through the template.
- Every existing H7 and H10 key and message keeps its meaning. registry.mjs, derive.mjs, envelope.json, pin.mjs and selftest.mjs are byte-identical.

deliverable: one PR.
evidence: rows 3c-A1..3c-A11 below, each mutation shown red and then restored; the before output (red on the Do 1 commit) and the after output (green); the collision table; the measured timings.
finish: merged on main. You will notice: nothing visible (no library row is D or T on main, and the 8 are unchanged).

design_reference: none (no UI). The rules: D-LIB3b-H7; D-LIB10-RANGES and D-LIB10-CHILDPROOF (lib4-cards section 15 (i) and (ii)), as D-LIB3c-SHARED (section 15.1) amends them; D-LIB9-AUTHORQA as on #245.
connectivity: none. No stored or sent user data, no network call, no dependency.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md (before your first commit, and again on every start or wake); .claude/rules/shared-files.md.
- The posted LIB-10 rulings (lib4-cards section 15): (i) D-LIB10-RANGES, (ii) D-LIB10-CHILDPROOF, items 10 and 11, and 15.1 D-LIB3c-SHARED.
- On claude/sup-lib4-cards: lib-3b-card.md (amendments 1 and 2, D-LIB3b-H7, :126-159); lib4-cards.md section 12 items 1 and 2; section 13 amendment 21 (:1421-1424).
- On main @ 2078913c:
  - tools/plates/library/candidate.mjs (all 100 lines);
  - qa/index.mjs:19 (loadPins), :30-39 (runQa, the h7 and h10 calls at :38);
  - qa/node.mjs:16-30 (RAW_SPEC_KEYS, rendersOf), :188-205 (h7, h7Builds), :261-304 (PQ-H10);
  - qa/engine.mjs:13-22 (loadEngine; `spec` re-imports with `?qa=n` at :21), :84-104 (buildMirrorGallery, wrapSpec); qa/approved.mjs:14-19;
  - derive.mjs (all 45 lines); registry.mjs:23-27 (__setExtraBatches), :46-56, :61 (goldenInputs);
  - plates-page.mjs:24-44; build-page.mjs:42-59 (patchedBuilder, the spec import), :69-103 (a page build spawns one process);
  - gen/plates.mjs:130-145 (gateNodeHalf, its in-process cache);
  - COACHING-DECISIONS.md:2451-2461 (D-LIB3b-H10, D-LIB3b-H7);
  - qa/mutations.mjs:57-58 (M8, a per-call counter), :98-103 and :116 (M21-M23 and their derivation test double); qa/proof.mjs:15, :31, :35-38, :48; tests/howto/library-qa.test.ts:66-71 and :98-104;
  - tests/howto/library-qa-h10.test.ts (all; :125 is the 3b-A6 premise); the real-path test pattern lib-3b-card.md:82 names; tests/howto/fixtures/lib2b/fixture.mjs:18-30, :49, :56-60, :124-131.
- #245 @ 38b436d (read only): tools/plates/library/candidate.mjs; tests/howto/lb1-plates.test.ts:1013-1041 (A8 and Q-A) and :1128-1153 (the in-memory D copy: clean :1139-1142, A7 :1143, A4 :1146, one byte :1149-1152).

write_scope (exactly these):
- tools/plates/library/candidate.mjs: Do 1 (the whole file from 38b436d), then Do 4-6.
- tools/plates/library/qa/node.mjs: h7 (async, fresh import), h7Builds (wired or removed), h10 (the family object and the child proof). validateParams (:263-274) and paramEnvelopeProblems (:281-294) stay byte-identical.
- tools/plates/library/qa/index.mjs: :38 (`await h7(...)`) and added header comment lines. loadPins (:19) is unchanged.
- tools/plates/library/qa/param-ranges.json (new) and one new loader module in qa/ (for example qa/param-ranges.mjs).
- tests/howto/library-authorqa.test.ts, tests/howto/library-qa-h7.test.ts and tests/howto/library-qa-h10-child.test.ts (new).
- docs/howto/library/LIB-3c-DESIGN.md (new).
- docs/COACHING-DECISIONS.md: append only (D-LIB3c-H7, and what D-LIB10-RANGES and D-LIB10-CHILDPROOF built).

reserved_paths (read only; everything outside write_scope is reserved, in particular):
- tools/plates/library/registry.mjs: byte-identical. It is an input of every generated file (registry.mjs:61), so any byte change stales every generated file of the 8 (Q-A, #245 comment 6242372604). A T row's `template` rides on the row as data (registry.mjs:52).
- derive.mjs, plates-page.mjs, build-page.mjs; qa/envelope.json, pin.mjs, selftest.mjs, mutations.mjs, proof.mjs, browser.mjs, approved.mjs, engine.mjs, vocabulary.json, exemptions.json (#244 and #260 edit it).
- tools/plates/library/templates/**, specs/**, howto/**, batches/** and tests/howto/golden/**. No template exists on main; tests write test-only templates, specs and family rows into the temp fixture tree only.
- tests/howto/library-qa.test.ts, library-qa-h10.test.ts, library-core.test.ts, library-rows.test.ts: unedited.
- tests/howto/fixtures/**: used as is (#244, #260 and #261 edit fixture.mjs).
- tests/howto/lb1-plates.test.ts (#245's; not on main).
- tools/plates/gen/** and tools/plates/generate.mjs.
- AGENTS.md file ownership: scripts/screenshot-gate.mjs and tests/theme.test.ts are shared add-only files, and this card adds no block to either; src/ui/styles.css; .github/**, scripts/prepare-android.sh and native/patch_manifest.py (supervisor); package.json and package-lock.json (no new dependency); src/app/App.tsx and src/main.tsx; src/core/models.ts, src/core/store.ts and migrations; native/wear/**, src/native/wearEngine.ts and src/slices/settings/WatchLab.tsx (watch agent); escobar-worker/**; src/**.

Collision check (`git merge-tree --write-tree origin/main <head>`, then `git diff --name-only origin/main <tree>` over candidate.mjs, registry.mjs, derive.mjs, plates-page.mjs, build-page.mjs, qa/**, templates/**, tests/howto/library-qa*.test.ts and tests/howto/fixtures/**; run 2026-10-18 on main 2078913c after `git fetch origin`):
| PR | Head | Files it changes in those paths |
|---|---|---|
| LIB-9a #245 | 38b436d5 | candidate.mjs: the hunk Do 1 copies |
| LIB-5 #244 | 1d1fe9ea | qa/exemptions.json; fixtures/lib2b/fixture.mjs; fixtures/lib5/** (all reserved here) |
| BOX-CAP #260 | 2bea5685 | the same files as #244 (reserved here) |
| LIB-4d #261 | e7502cdb | fixtures/lib2b/fixture.mjs (reserved here) |
| LIB-4c scratch #257 | 42716893 | fixtures/lib4b/** (reserved here) |
| #259, #249, #246, #232, #221, #209, #197, #193, #192, #191, #190, #188, #181, #158, #149, #144, #109, #94, #92, #88 | open heads | none |
| #1, #3 | no merge base | `git ls-tree` holds none of these paths |
- No open head calls h7 or h7Builds directly (git grep). runQa's callers: gen/plates.mjs:139 and proof.mjs:31, :38 and :48 on main; fidelity.mjs:214 on #232 and #246; lb1/qa.mjs:24 on #245. All of them load pins or ctx from loadPins.
- Re-run this check on the head you send for review, and post it in the PR.

Do:
1. AUTHORQA, as your first commit (D-LIB9-AUTHORQA; LIB-10 rulings item 10):
   - `git show 38b436d:tools/plates/library/candidate.mjs > tools/plates/library/candidate.mjs`. Then `git hash-object tools/plates/library/candidate.mjs` must print 5a5c559057189145d9f61b23dc3c6813ed35d6ac. If main's candidate.mjs is no longer blob aeae572e when you start, stop and report.
   - Commit it alone: 'LIB-3c: D-LIB9-AUTHORQA from #245 @ 38b436d, byte for byte'.
   - Port #245's A8 and Q-A assertions (lb1-plates.test.ts:1013-1041 @ 38b436d) into tests/howto/library-authorqa.test.ts, on the LIB-2b fixture. They cannot be copied byte for byte: they read LB1's build.mjs, specs and plates page, which are not on main. Keep every assertion:
     - F.ID's row set in memory to stage 'drawing', and the tree's batch golden file (F.BATCH_GOLDEN) deleted after the page is built: candidateOf(F.ID, { all, platesHtml, engine, authoring: true }) returns exemptions [] and the card's topFault in research; the same call without `authoring` rejects (no pin).
     - Stage 'shipped' and stage 'approved-plate', each with `authoring: true`: rejects with /authoring QA is refused/.
     - howtoOf(id, undefined, all) equals reg.sourceOf(id) for every main row, and for F.ID inside the tree; an unknown id throws /no row/.
2. The design note, docs/howto/library/LIB-3c-DESIGN.md, posted as a PR comment with your first push:
   a. H7: how each mode gets a fresh import ('approved' through ctx.engine.spec, qa/engine.mjs:21; H/D/T through a loader candidate.mjs carries). Whether a module the spec imports (a composer) is fresh too; if not, which case stays uncaught, and whether a fresh process (as a page build uses, build-page.mjs:69-76, :97) closes it. h7Builds wired or removed, and why.
   b. Ranges: param-ranges.json's exact shape (family, then PARAMS key, in the envelope shape of derive.mjs:14, plus the ruling id and a basis per bound or value), the loader and when it throws, and how h10 finds a row's family (T: row.template; D: `D:<parent id>`).
      - One object per row (D-LIB10-RANGES item 6, as amended by the supervisor on 2026-10-18, D-LIB3c-SHARED): for each PARAMS key, the row's family row in param-ranges.json when it names the key, else ctx.envelope's row for that key. PQ-H10's value check (`paramEnvelopeProblems(d.params, out, obj)`, byte-identical) and the child proof's derive() both take this one object. h10 builds it and passes it to the derivation's child rebuild. No other code reads the file. On the real path ctx.envelope is envelope.json: every runQa caller loads the pins (gen/plates.mjs:139; fidelity.mjs:214 and :232 on #232/#246; lb1/qa.mjs:17-24 on #245; proof.mjs:15). envelope.json names no PARAMS key (library-qa-h10.test.ts:125, the 3b-A6 premise, runs in npm test; selftest.mjs:25 also fails on it where it runs, which in CI is from LIB-4b #232's qa-selftest row), so on the real path a key with no family row fails closed with H10.envelope.
      - The child proof runs when validateParams and paramEnvelopeProblems found no problem. A key gets one problem, as in D-LIB3b-H10, and a D/T row with a param problem is already red, so no verdict changes (D-LIB10-CHILDPROOF item 1, as amended by the supervisor on 2026-10-18, D-LIB3c-SHARED). A derivation with clean params and no child rebuild gives `H10.child:threw`. h10 never returns early for it.
      - Evidence that this holds: library-qa-h10.test.ts passes unedited on the Do 6 head (3c-A6), including the `[[], true]` rows, which now also run the child proof.
   c. Child proof: how a D child (derive(parentSpec, row.params, obj), obj being Do 2 b's one object) and a T child (template.make(row.params, facts)) reach buildPlatesPage. config.specs takes an absolute path (build-page.mjs:78-81, :95), for example a module written to a temp directory. Where the rebuild runs (for example a rebuildChild beside rebuildParent, candidate.mjs:75-79 on main). The T parent proof through make(parentParams, parentFacts). The keys: H10.child:<fragment>, H10.child:threw. A golden parent's spec is imported from a mirror (golden.mjs makeMirror; its engine needs the font that only the mirror has, measured: ENOENT from tools/plates/vendor in place), kept until buildPlatesPage returns, never from tools/plates/vendor. Test D sources in the tree do the same, or import the golden B copy only where the note shows it renders identically.
   d. Cost, measured: the seconds added per H row (H7) and per D or T row (two more page builds; each spawns a process), against LIB-4c's per-shard budget (#246 @ 68f15560 tools/plates/library/ci/plan.mjs:13-15: SHARD_TARGET_S 900, JOB_BUDGET_S 1800). gen/plates.mjs:133-141 caches a report in-process only.
   e. Which lines of the Do 1 hunk your later changes touch. Keep them, and the lines next to them, unchanged where the design allows.
   Then wait for the supervisor's look before Do 4-6.
3. Tests first, run on the Do 1 commit (keep the output):
   - tests/howto/library-qa-h7.test.ts: 3c-A2 and 3c-A3. The import-time row is red there.
   - tests/howto/library-qa-h10-child.test.ts: 3c-A4 and 3c-A5. Red on the Do 1 commit: every value, child, loader, one-object and template row. Guards (already green): the H10.envelope rows with the pinned envelope, the fallback row (a test envelope that names the key), the no-import row, and the premise. Controls green. Import the loader inside the rows that use it, so beforeAll runs on Do 1.
   - The first push carries the Do 1 commit, library-authorqa.test.ts and the note. Do 3's red tests stay local until Do 4-6 make them green (their red output is kept).
   - Setup as library-qa-h10.test.ts does: F.fixtureTree(); modules imported from the tree with F.url(root, p); golden.makeMirror and eng.loadEngine; eng.dropMirror and F.drop in afterAll. Never hand-build a candidate. Test-only templates, spec edits and family rows go into the temp tree only.
4. PQ-H7 from a fresh import (D-LIB3b-H7):
   - h7 becomes async. It keeps today's second in-process render and comparison (node.mjs:191-192, unchanged) and adds a third render set from a freshly imported spec, compared with R: 'approved' through ctx.engine.spec(specIdOf(c.chromeId)), and H/D/T through the loader candidate.mjs carries. A difference gives `H7.determinism:<k>.<f>`, with the fresh-import message named in the note.
   - An engine candidate (c.spec set) of mode H, D or T without the fresh loader gives `H7.determinism:fresh-missing`. A fresh import or fresh render that throws gives `H7.determinism:fresh-threw`. Neither throws, and neither is skipped. (library-qa.test.ts:66-71 use arrayContaining or flags only, so they stay green.)
   - index.mjs:38 calls `await h7(c, env, R)`.
   - h7Builds is wired or removed. Record the reason in the note and in COACHING-DECISIONS (D-LIB3c-H7).
   - Existing H7 keys and messages stay. A new key, if any, is an `H7.determinism:<...>` key named in the note.
5. PARAMS ranges (D-LIB10-RANGES):
   - qa/param-ranges.json, with no family row unless one was posted (build_prerequisites), and its loader. A family row without a ruling id, or a bound or value without a basis, makes the loader throw. The loader also throws on a family key that is not in PARAMS, and on a row that rowOk (node.mjs:278-280) would call malformed.
   - The loader reads the file on each h10 call (no module-level cache), or each 3c-A4 row that edits the file uses its own fixture tree.
   - h10 builds the row's one object (D-LIB3c-SHARED; Do 2 b) and passes it to the derivation's child rebuild; its value check uses the same object. No spec or template imports the file.
   - Only h10 calls the loader, and only for a D or T row. Nothing on the 'approved' or H path, and nothing reachable from pin.mjs or selftest.mjs, reads param-ranges.json.
   - candidate.mjs refuses a T row whose `template` is not a string matching /^[A-Za-z0-9_-]+$/ that names an existing tools/plates/library/templates/<name>.mjs (fail closed).
6. The child proof (D-LIB10-CHILDPROOF):
   - For every D and T row whose params have no H10 problem (D-LIB3c-SHARED), PQ-H10 compares the candidate's `plate` with the child rebuilt alone from its derivation, on all 9 fragments (node.mjs:262 FRAG_KEYS). A difference gives H10.child:<fragment>. A rebuild that throws gives H10.child:threw.
   - node.mjs:298's early return stays as it is. A derivation without the child rebuild never returns early; with clean params it gives `H10.child:threw` (mutations.mjs:116's test double has none, and M21-M23 must keep their keys).
   - For T, the parent proof also runs make(parentParams, parentFacts), rebuilt alone, against the parent's pinned fragments. Today's rebuild of the parent from its own source stays.
7. Finish:
   - Run every mutation below: a temporary edit, the red output, then restore. List each one in the PR with its red line. Never commit a mutation.
   - Merge origin/main (merge commit). Re-run the collision check.
   - Run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` on that exact head, the long ones detached (CI manners).
   - Tick each row in the PR body. Add the HANDOFF block and the line "You will notice: nothing visible."

Acceptance (each criterion maps to a test or to PR evidence; each mutation turns red, then is restored):
- 3c-A1 AUTHORQA lands byte for byte. Evidence: `git rev-parse <Do 1 commit>:tools/plates/library/candidate.mjs` prints 5a5c559057189145d9f61b23dc3c6813ed35d6ac, and that commit changes no other file. tests/howto/library-authorqa.test.ts is green. Mutations:
  - AUTHORING_REFUSED emptied → the shipped and approved-plate rows are red;
  - `authoring ? [] :` removed from the exemptions line → the drawing row is red (it reads the missing pin and throws);
  - `howto/` changed to `how-to/` in howtoOf → the Q-A row is red.
- 3c-A2 PQ-H7 catches a value fixed at import time. In the tree, F.SPEC gets a module-top `const RR = <a> + Math.random() * <b>` that reaches a drawn dimension:
  - on the Do 1 commit PQ-H7 gives [] (the row is red); after this card it gives at least one H7.determinism problem;
  - the same on the 'approved' path: a scratch mirror with vendor seated_cable_row.mjs's pulley edited the same way, as D-LIB3b-H7 reproduced it (COACHING-DECISIONS.md:2452-2458);
  - controls: the unedited spec gives []; a per-call random value still gives H7.determinism; M8 (mutations.mjs:57-58: a per-call counter that a fresh import resets) still gives H7.determinism; a render that throws still gives H1.engine:render-threw;
  - an H, D or T engine candidate without the fresh loader gives `H7.determinism:fresh-missing`; a fresh import that throws gives `H7.determinism:fresh-threw`.
  Mutations: the fresh import replaced by the in-process spec → the import-time rows are red; the in-process second render removed → library-qa.test.ts's M8 row and the counter control are red.
- 3c-A3 h7Builds: wired, with a test that shows it bites, or removed, with `git grep -n h7Builds -- tools tests` printing nothing. The note and COACHING-DECISIONS give the reason.
- 3c-A4 PARAMS ranges (D-LIB10-RANGES items 6-8), with test family rows written into the tree:
  - a value outside its family's range gives H10.value:<key>; a value inside gives no H10 problem;
  - a value ruled only for SEATPRESS, used on a BENCH row, is red;
  - with the pinned envelope (runQa with no ctx.envelope), a family or key with no row gives H10.envelope:<key>, and so does a missing file; with a test envelope that names the key and no family row, the key is checked against the test envelope (the fallback, shown);
  - a family row without a ruling id, or a bound without a basis, makes the loader throw;
  - one object (no production hook: the test wraps the candidate's own `derivation` child rebuild, as library-qa-h10.test.ts:31-33's `edit` changes candidateOf's output, and calls node.mjs's exported paramEnvelopeProblems): params with two keys, k1 named by the test family row and k2 named only by a test envelope. The test records the object h10 passes to the child rebuild. With clean params, `paramEnvelopeProblems(params, [], recorded)` gives exactly H10's value problems (none), and the recorded object holds the family row's range for k1 and the test envelope's range for k2. Widening the family row changes the recorded object. Narrowing it so k1 falls outside gives exactly `H10.value:k1`, and the child rebuild is not called. Mutation: h10 passes the file's family row alone to the rebuild → this row is red (k2 missing from the recorded object; derive throws);
  - a T row with no `template`, or one naming no file under templates/, makes candidateOf throw;
  - premise: Object.keys(PARAMS).filter(k => k in pins.envelope) equals [] (as 3b-A6);
  - a PARAMS row added to envelope.json (not committed) turns the 3b-A6 premise, 3c-A4's premise, and a local `MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/qa/selftest.mjs` run red; the red lines are in the PR (ruling (i) 8, first bullet);
  - no file under tools/plates/library/specs/**, templates/** or eq/** names `param-ranges` (test; empty on main).
  The rows assert exact key lists. Mutations: the family lookup returns the union of all families' rows (`Object.assign({}, ...Object.values(file))`) → the SEATPRESS-on-BENCH row gives no H10 problem and is red; a test template in the tree that imports param-ranges.json → the no-import row is red; the loader's basis check removed → the no-basis row is red; the template check removed → the no-template row is red.
- 3c-A5 The child proof (D-LIB10-CHILDPROOF item 4), each red before the fix:
  - a D source that derives and then sets tempo → H10.child:tempo;
  - a T source that calls make and then moves one callout → H10.child:<fragment>;
  - a T default export with params other than row.params → H10.child;
  - one byte of a test template's constant → H10.byte on the template parent proof;
  - the template parent proof switched back to the parent's own source, with a template byte changed → red (the template path is the one checked);
  - a rebuild that throws → H10.child:threw;
  - controls: a clean D child and a clean T child, with test family rows present, give no H10.child key.
  Mutation (D-LIB10-RANGES item 6): with test family rows present, the child proof removed → the "make, then move one callout" row is red. Ranges alone never pass it.
- 3c-A6 Existing tests unedited and green: library-qa.test.ts, library-qa-h10.test.ts, library-core.test.ts and library-rows.test.ts all pass. On the review head and the READY head, after `git fetch origin`, on a clean tree (`git status --porcelain` prints nothing): `git diff --exit-code "$(git merge-base origin/main HEAD)" -- tests/howto/library-qa.test.ts tests/howto/library-qa-h10.test.ts tests/howto/library-core.test.ts tests/howto/library-rows.test.ts tests/howto/fixtures tools/plates/library/registry.mjs tools/plates/library/derive.mjs tools/plates/library/plates-page.mjs tools/plates/library/build-page.mjs tools/plates/library/qa/envelope.json tools/plates/library/qa/pin.mjs tools/plates/library/qa/selftest.mjs tools/plates/library/qa/mutations.mjs tools/plates/library/qa/approved.mjs tools/plates/library/qa/engine.mjs` prints nothing, and `git diff --name-only "$(git merge-base origin/main HEAD)" HEAD` prints only write_scope paths. PR evidence. Mutation: one line added to library-qa-h10.test.ts, not committed → the command prints a diff.
- 3c-A7 No loosening (PR evidence, same clean tree): `git diff -U0 "$(git merge-base origin/main HEAD)" -- tools/plates/library/qa/node.mjs tools/plates/library/qa/index.mjs | grep -E '^-' | grep -vE '^--- (a/|/dev/null)'` prints only lines the PR lists, each with its reason. validateParams and paramEnvelopeProblems are byte-identical. Every existing H7 and H10 key and message keeps its meaning. Mutation: one character changed in validateParams, not committed → the command prints a line the PR does not list.
- 3c-A8 L1 on a shipped scratch id (D-LIB3b-H7), only if LIB-4c is on main before your READY: the supervisor pushes a scratch ref (lib4-cards 11.1 item 16 (f)) carrying the import-time case on a shipped scratch id, and L1 (howto-rebuild) is red there. If LIB-4c is not on main at READY, this row moves to whichever of LIB-3c and LIB-4c merges second; the supervisor names it on both PRs.
- 3c-A9 Cost: the measured seconds per H row and per D or T row are posted against LIB-4c's per-shard budget (#246 @ 68f15560 tools/plates/library/ci/plan.mjs:13-15: SHARD_TARGET_S 900, JOB_BUDGET_S 1800). If a budget is exceeded, report it; never drop a check to fit.
- 3c-A10 Green: `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, run locally on the merged head, and CI on that head.
- 3c-A11 #245 handover (PR evidence): `git worktree add --detach <tmp>/wt-245 38b436d`, in a temporary directory outside the repo tree, then `git -C <tmp>/wt-245 merge --no-edit <this head>` (local only; never pushed; take this head's candidate.mjs whole if git reports a conflict there; `npm ci` there). Run tests/howto/lb1-plates.test.ts in full. Report every row that changes, with its exact new keys, at least each `it` of the describe at :1128-1153, plus the file's run time before and after. Include `git merge-tree --write-tree <this head> 38b436d`, showing whether candidate.mjs conflicts. The supervisor relays all of it to #245.

verification: the PR body maps 3c-A1..A11 to their tests or evidence, and lists every mutation with its red line. On every head sent for review and on the READY head, it posts 3c-A6, 3c-A7 and the collision table, each run on that exact head.

risk_and_recovery:
- #245's merge of main after this card: if a later commit here touches a line in or next to the Do 1 hunk, git may report a conflict in candidate.mjs. Recovery: #245 takes main's file whole (merge_prerequisites); its candidate.mjs diff is then empty. Keep those lines unchanged where the design allows, and list any you touch (Do 2 e).
- #245's lb1-plates.test.ts rows may change keys after this card: the D-copy tests 3c-A11 lists (the describe at :1128-1153 @ 38b436d; under D-LIB3c-SHARED a row whose params already have an H10 problem gets no child proof), and any row the fresh-import PQ-H7 moves. This card never edits that file. You report every changed row (3c-A11), and #245 changes them when it merges main, as amendment 21 did for LIB-3b.
- If #245 is on main when you merge main: stop and report. The D-copy tests 3c-A11 lists then go red with this card. The supervisor amends write_scope to add exactly those expectations; until then, never edit lb1-plates.test.ts.
- A fresh `?qa=n` import re-evaluates the spec module only; a composer it imports stays cached. The note states which case that leaves and how it is closed.
- Time: H7 adds a fresh render per plate, and D/T rows add page builds. Measure (3c-A9). vitest's defaults are 5 s per test and 10 s per hook: give each describe and beforeAll a timeout as library-qa-h10.test.ts does. If one still runs over, raise it and report. Never drop a row.
- If library-qa-h10.test.ts cannot stay green without loosening a check: stop and report; the supervisor rules.
- A family row posted before READY: commit it byte for byte. Never add one of your own, and never let a missing row pass.
- If fixture.mjs changes on main (#244, #260, #261): adapt only your tests' setup. Never hand-build a candidate.
- Two failed tries of one approach: stop and report.

return:
- PR number and head sha;
- the Do 1 commit sha and its candidate.mjs blob;
- the collision table re-run on that head;
- the before output (red on the Do 1 commit) and the after output (green) of 3c-A2..A5;
- every mutation with its red line;
- the measured timings (3c-A9);
- the 3c-A11 changed rows, timings and merge-tree result, for the supervisor to relay to #245;
- npm run check, npm run test:tz and gate output on the final head.

Resume rule: when you are WAITING or parked, you resume only on the supervisor's exact words 'LIB-3c resume' (sent to your session or posted on your PR). A prerequisite post alone is not a resume.

---

Critic fixes applied (lib-3c-critic.md; 19 of 19):
- B1: applied as ruled (D-LIB3c-SHARED, option C): Do 2 b's two sub-bullets replaced by the critic's three; Do 5 and Do 6 say h10 builds the one object and the child proof runs only on clean params; outcome, design_reference and read_first name the ruling; both 3c-A4 bullets replaced. "<date>" reads "2026-10-18, D-LIB3c-SHARED".
- H1: applied (Do 4; 3c-A2 control and mutation; outcome).
- M1: merged with B1: the guard cite sits inside B1's object bullet in M1's wording; the selftest row is added to 3c-A4.
- M2: applied (Do 6); also covered by B1's text.
- M3: applied (Do 4; 3c-A2).
- M4: applied (Do 2 c).
- M5: applied (write_scope; Do 5).
- M6: applied (3c-A3).
- M7: applied (3c-A11; merge_prerequisites; both risk lines; return). Changed: the worktree path reads `<tmp>/wt-245` in a temporary directory outside the repo tree, since the builder has no S.
- M8: applied (3c-A4 mutation; the rows assert exact key lists).
- M9: applied (3c-A4 row and mutation).
- L1: applied (read_first; Do 1; 3c-A2's :2452-2458; risk lines).
- L2: applied (Do 3, with the push line).
- L3: applied (Do 5).
- L4: applied (Do 5).
- L5: applied (3c-A6).
- L6: applied (collision check).
- L7: applied (Do 2 d; 3c-A9).
- L8: applied (Do 5).

Re-check fixes applied (lib-3c-recheck.md; 4 of 4): N1 (3c-A4 one-object row: evidence through the candidate's own `derivation` and the exported paramEnvelopeProblems, no production hook; pair :3128), N2 (Do 3 guards), N3 (the subsection is 15.1), N4 (Do 2 c).
