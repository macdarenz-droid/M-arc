Card LIB-6-PM: LIB-6's pre-merge work on #181 (2026-10-18)

Covers engine per plate, the back-box page patches, S5-L and the L0-lib back line. Sources: lib4-cards section 12 item 7 (D-LIB9-ENGINE); section 14 NEW-5 (D-LIB5-PAGE) and Supervisor action 11; 11.1 item 9; D-LIB2b-FIXTURE (10); and the rulings in lib-6-pm-rulings.md (D-LIB-ORDER-2, D-LIB6PM-*).

id: LIB-6-PM. "PM" is read as pre-merge, after lib4-cards :643 "LIB-6's pre-merge lines" (an inference).
model: claude-opus-5-5. This card is not mechanical: engine threading through the close-up renderer, a lazy patch into locked vendored chrome, fixture word budgets and mutation proofs.
mode: auto
title: 'Builder: LIB-6-PM engine per plate, back patches and pre-merge lines'

Form: a fixer on #181's branch, not a separate PR. Why:
- D-LIB5-PAGE names it so: "LIB-6-PM (#181, LIB-6's branch, build-layers-page.mjs only) … on a #181 head that already contains LIB-5" (lib4-cards :2665).
- D-LIB9-ENGINE: "LIB-6-PM implements this before LIB-6's delta review" (:1112).
- S5-L "is carried by whichever of #181 and the Do 9 change merges second" (:2682).
- A separate PR could not merge first: build-layers-page.mjs and render/** exist only on #181.
- Precedent: the 10-02 fixer pushed to this branch and got a delta review (#181 comments 5948723100, 5949031458).
- No other session owns the branch: the fixer and reviewer are archived (HANDOVER @ 0b90d09c :1595), and the builder's old-account session is gone (#181 5947836533).
- #193 (LIB-7) is based on this branch (GitHub base ref claude/lib-6-closeup-renderer @ 9b8f76e6). Its fixer stays on #193 (D-LIB6PM-BRANCH).

branch: claude/lib-6-closeup-renderer (#181, draft, head 9b8f76e6d942f63f54f07dcdceeebe81d2823130).
- Add commits and merge commits only. Never rebase, amend or force-push.
- Run `git pull --no-rebase` before each push.
- You are the only writer of this branch until #181 merges (D-LIB6PM-BRANCH).

base: #181 @ 9b8f76e6 (merge base with main: 9ca7f077, 2026-10-02).
- Merge origin/main with a merge commit (Do 1), again before each review, and before READY.
- Checked 2026-10-18: `git merge-tree --write-tree --name-only origin/main 9b8f76e6` (main 2078913c) is clean (tree 32ab3b84). Merges with #244 @ 1d1fe9ea and #260 @ 2bea5685 are clean too.
- If `git ls-remote origin refs/heads/claude/lib-6-closeup-renderer` is not 9b8f76e6 at your start, stop and report.

depends_on:
- Merged: LIB-2, HT-4, LIB-2b #234 (layers-spec.mjs, tests/howto/fixtures/lib2b/**), LIB-3b.
- Before #181, in D-LIB-ORDER-2's order:
  - LIB-4b #232: the fidelity runner and HT-9 twin, and the B5 scratch pages.
  - LIB-4c #246 + #249: ci/manifest.mjs (L0-lib) and L1.
  - LIB-4d #261 (slot 3d): edits library-rows.test.ts in other hunks.
  - LIB-5 #244 + sup-lib5-bundle: tools/plates/library/shared/back-box.mjs (backBox, BACK_BOX_WAITS), the library lint, tests/howto/fixtures/lib5/**.
  - BOX-CAP #260: tools/plates/library/lint/box-caps.mjs and boxReach's key (D-BOXCAP-WIRE).
  - LIB-5's Do 9 PR (claude/lib-5-back-box): src/howto/red-flag-back.ts, RiskJoint 'back', and the ht9 twin's entry and FLAG lines (D-LIB5-TWIN). Do 7 needs it, but it does not gate #181 (lib4-cards :1181).

build_prerequisites:
- Lane (D-LIB-LANE-ACTIVE, lib4-cards :1030, as D-LIB6PM-LANE amends it): this card holds a LIB builder slot, ahead of the LIB-7 fixer. Start only on the supervisor's 'LIB-6-PM start'. It comes by session message with the live count; later messages also come as PR comments. Never start on any other event.
- At the start, the supervisor:
  - posts D-LIB9-ENGINE on #181 and #232 (lib4-cards :1117; #234 is merged). It is not posted today: #181 has no comment after 2026-10-02 09:19, and no #232, #234 or #244 comment names it;
  - posts D-LIB6PM-FIXTURE's ownership lines on #244 and on the Do 9 PR: Do 9 never writes the helper, and it writes S5-L only if #181 is on main first.
- Work that may start before LIB-5 merges (Do 0-4: main merge, design note, engine per plate, pre-merge lines):
  - keep it in local commits;
  - first push only after LIB-4b and LIB-4c are on main, or when the supervisor names a push. Their evidence names #181 @ 9b8f76e (lib4-cards :85, :232; lib-4c-card :410).
- After LIB-5 is on main: Do 5. Merge main first, because the patches go "only on a #181 head that contains LIB-5" (D-LIB5-PAGE).
- After LIB-4c and LIB-5 are on main: Do 6.
- Do 7: write and run it before Do 9 is on main, on a local scratch merge of the Do 9 PR's reviewed head. Commit it only after Do 9 is on main.
- If the supervisor tells you to park, stop at your next local commit, push nothing, and wait for 'LIB-6-PM resume'.

CI manners (D-LIB-CIMANNERS, lib4-cards section 12 item 1, as read after the GATE-SPLIT train merged):
- At most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci].
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them until it says go.
- Never cancel, re-run or dispatch a run that is not yours.
- Before your first push, work in local commits and end each turn with your HANDOFF block in your reply.
- From the first push, the HANDOFF block lives in #181's PR body under a "LIB-6-PM" heading. Keep #181's existing text.
- Never write to the owner.
- Run any job that may last over 1 hour (the local gate, a full test:tz run, a fidelity run) as a detached process, for example `setsid nohup <cmd> > <log> 2>&1 &`. Then poll its log.
- A tool background job stops at about 2 hours. A killed or stopped run is never evidence.

merge_prerequisites:
- Two fresh-Opus delta PASSes against this card:
  - R1 on the first pushed head holding Do 0-6 and LIB-5;
  - R2 on R1-head..READY (Do 7 and the main merges).
  The 10-02 PASSes stand for 9b8f76e only.
- Every check green on a head that contains the latest main.
- Checklist slot 5 (plan 7 @ 6550ce28 :762, LIB-6), in a merge train (claude/sup-merge-train-<n>).
  - Order (D-LIB-ORDER-2): LIB-4b → LIB-4c + #249 → LIB-4d (3d) → LIB-5 + sup-lib5-bundle → BOX-CAP → LIB-5 Do 9 → LIB-6 #181 with this card → LIB-7 #193 + LIB-7-FIX → LIB-8M #109 (7) → LIB-5v (7a) → LB1 #245 (8). LIB-3c may merge any time after its review.
  - LIB-4b, LIB-4c, LIB-4d and LIB-5 have merged.
  - BOX-CAP and LIB-5's Do 9 PR come first in the order, but they do not gate #181 (lib4-cards :1181).
- S5-L and PM-A8:
  - If Do 9 is on main when the READY head merges main, S5-L (under D-LIB6PM-CAP, which imports BOX-CAP's limit) and PM-A8 are green here.
  - If it is not, #181 merges without them. The supervisor then posts on the Do 9 PR that Do 9 carries S5-L and PM-A8, using this card's helper unchanged and D-LIB6PM-CAP (lib-5-card :266).
- The supervisor's CI step for the page-level node tests lands in the same train (D-LIB6PM-CI).
- After this merges, LIB-9's prerequisite "LIB-6-PM's back patches and S5-L on main and green" (lib-9a-card :32) is met only if S5-L ran here.

hard card: yes. Several designs are possible: how a spec's engine is found and threaded, how the page's plate block uses it, and how the back box loads only for a page that shows it. Write the design note in Do 2. The supervisor looks at it before Do 3, Do 5 and Do 6. Do 4 is mechanical and may run meanwhile.

outcome:
Gap today (#181 @ 9b8f76e, main 2078913c):
- #181 is 16 days behind main. Once build-layers-page.mjs is present, LIB-2b's rebuild compare (tests/howto/library-rows.test.ts:116-126 on main) runs. Its absent-builder branch (:117-120) is still there (D-LIB2b-FIXTURE (10), lib4-cards :759).
- One engine only:
  - tools/plates/library/render/closeup/crop.mjs:13-14, zbox.mjs:6 and zbox-geometry.mjs:6 import golden B's layers engine;
  - the vendored chrome draws the plate block with the layers renderPlate (tools/plates/layers/artifact/build-page.mjs:6, :59, :63);
  - poly exists only in the vendor engine (vendor equipment.mjs poly :305, PRIMITIVES :316; layers PRIMITIVES :304). The layers renderPlate throws "unknown equipment type" (layers plate.mjs:45);
  - LB1 specs use poly (#245 @ 38b436d: eq/polybar.mjs, eq/rope.mjs).
- No back box on the layers page:
  - RF (howto-layers.mjs:217) and FLAG (:271) have no 'back', so a back-linked row throws at :221 or :278;
  - copy-lint drops 'back' from the page's word total (copy-lint.mjs:313).
- LIB-4c's L0-lib set (manifest.mjs BUILDERS :27, filesOf :53-74 @ 68f15560) holds no back-box input.
After this card:
- The 8's page is still at PAGE_SHA256 e7b81413… (layers.mjs:13). LIB-2b's E1 page and B5's scratch pages are byte-identical.
- A library spec's crops and its plate block on the layers page come from the engine its spec imports.
- A back-linked row shows exactly one back box, loaded only for a page with a back-flagged sheet, and its page total counts that box.
- The L0-lib set holds the back box's inputs for every pinned row whose batch has a back-flagged row.

deliverable: #181 brought to merge: this delta on its branch, plus two delta reviews.
evidence: PM-A1..PM-A11 below. Each mutation is shown red, then restored. The "before" outputs come from the Do 1 head; the "after" outputs come from the READY head.
finish: #181 merged in slot 5 with this delta. You will notice: nothing visible. No library row ships, and the 8's page and app are unchanged.

design_reference: none (no UI). The rules:
- D-LIB9-ENGINE (lib4-cards :1106-1121);
- D-LIB5-PAGE (:2663-2692) with F10 (:2981-2982);
- Supervisor actions 11-12 (:2944-2946); 11.1 item 9 (:643); D-LIB2b-FIXTURE (10) (:759);
- lib-5-card :27 (the option-1 exception); D-BOXCAP-WIRE (box-cap-card amendment 1);
- #181 rulings 1-4 (comment 5936426770);
- lib-6-pm-rulings.md.
connectivity: none. No stored or sent user data, no network call, no new dependency.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and gotchas.md (before your first commit, and again on every start or wake); .claude/rules/shared-files.md.
- lib-6-pm-rulings.md.
- On claude/sup-lib4-cards @ 1e85584a:
  - lib4-cards.md :1106-1121, :1156, :1181, :2663-2692, :2944-2946, :2981-2982, :643, :759, :1030;
  - lib-5-card.md :27, :165, :175, :248, :266, :302;
  - lib-4c-card.md :145, :288-290, :338, :410;
  - box-cap-card.md amendment 1;
  - lib-9a-card.md :32.
- #181 @ 9b8f76e:
  - tools/plates/library/build-layers-page.mjs, all 117 lines (RENDERER_URL :16, patchOnce :37-41, patchHowtoLayers :75-89 with the 'renderer dispatch' expansion :82-87, patchBuildPage :92-96, runNode :98-104, buildLayersPage :107-117, spec.files copy :110);
  - tools/plates/library/render/closeups.mjs:14-19;
  - render/closeup/zoom.mjs:7, :15; crop.mjs:1-40 (engine imports :13-14, engineCrop :30); zbox.mjs:6, :30-60; zbox-geometry.mjs:6; zbox-hand.mjs:4;
  - tests/library/closeups.test.ts:66-73 (the anchor test; it runs only the 8's all-legacy plan and `{ groups, jump: null }`);
  - tools/plates/library/test/layers-page.test.mjs (all);
  - docs/COACHING-DECISIONS.md D-LIB6-6 (:1726) and D-LIB6-9 (:1734);
  - PR comments 5936426770 and 5949031458.
- Main @ 2078913c:
  - tools/plates/layers/artifact/howto-layers.mjs:14-16, :217-229, :269-283, :297-305, :316-317 (feelSection runs before risksSection);
  - tools/plates/layers/artifact/build-page.mjs:6, :59, :63;
  - copy-lint.mjs:56, :273, :295-299, :309, :313;
  - tools/plates/layers.mjs:13, :59, :79;
  - tools/plates/library/engine.mjs:1-5;
  - layers-spec.mjs (all; vendor-engine files are staged under library/ in the mirror);
  - tests/howto/library-rows.test.ts:116-126;
  - tests/howto/fixtures/lib2b/fixture.mjs:20-60, stageTree :57, pinTree :78 (it pins the committed page, :88), fixtureTree :125;
  - tools/plates/layers/exercises/pull_up.howto.mjs:285, :289, :384-385;
  - .github/workflows/build-apk.yml:22 (source-gate), :44.
- #244 @ 1d1fe9ea:
  - tools/plates/library/shared/back-box.mjs (all 15 lines);
  - tests/howto/library-shared.test.ts:84, :126-131 (the child-output form `Error: <id>: LIB-5: …`);
  - tests/howto/fixtures/lib5/** (back-sheet.mjs, tree.mjs).
- #246 @ 68f15560: tools/plates/library/ci/manifest.mjs (all; batch-wide closure :67-68); tests/howto/library-manifest.test.ts (all 77 lines).
- #232 @ 0867c86f: tools/plates/library/fidelity/twins/ht9.mjs (the header and content()).

write_scope (exactly these):
- tools/plates/library/build-layers-page.mjs:
  - the RF patch, the FLAG patch and the holder anchor (Do 5, D-LIB6PM-ANCHORS);
  - the back-box load inside the existing 'renderer dispatch' expansion;
  - an exported BACK_BOX_URL (absolute file URL, built as RENDERER_URL is at :16);
  - the engine threading and the plate-block patch to the mirrored build-page.mjs (Do 3, D-LIB6PM-PLATE).
- The engine parameter (default: the layers engine) and the engine check (Do 3), in:
  - tools/plates/library/render/closeups.mjs;
  - tools/plates/library/render/closeup/zoom.mjs;
  - tools/plates/library/render/closeup/crop.mjs;
  - tools/plates/library/render/closeup/zbox.mjs;
  - tools/plates/library/render/closeup/zbox-geometry.mjs.
- tools/plates/library/ci/manifest.mjs: add-only lines (Do 6, D-LIB6PM-L0).
- tests/howto/library-rows.test.ts: only the LIB-6 rebuild test. Its `it(` title (:116) becomes 'LIB-6 rebuild: the page rebuilds byte for byte through layersSpecOf and build-layers-page.mjs', and the absent-builder branch (:117-120) is removed.
- New tests:
  - tests/library/layers-engine.test.ts (PM-A2);
  - tests/library/layers-back.test.ts (PM-A4, PM-A5);
  - tests/howto/library-back-page.test.ts (S5-L; the name lib-5-card :175 uses);
  - tests/howto/library-manifest-back.test.ts (PM-A6);
  - tests/library/fixtures/engine/** (the poly and flat-palm fixture spec and How-to).
- tests/howto/fixtures/lib5/back-page.mjs (new): the back-flagged helper, owned by this card (D-LIB6PM-FIXTURE). If any back-flagged helper already exists under tests/howto/fixtures/lib5/** at Do 5, stop and report. Never edit it. Never use a helper in D-LIB5-PAGE's first form, which is over the word cap.
- docs/howto/library/LIB-6-PM-DESIGN.md (new).
- docs/COACHING-DECISIONS.md:
  - in D-LIB6-9, "4 patch anchors" becomes "6 patch anchors". This is the 10-02 review Low on #181's own line, which is not on main yet; find the line by content after the main merge;
  - append D-LIB6-10 (engine per plate), D-LIB6-11 (the back patches and the new anchor count) and D-LIB6-12 (the pre-merge lines and the L0-lib line).
- Never commit a mutation.

reserved_paths (read only; everything outside write_scope is reserved, in particular):
- tools/plates/layers/** (golden B, MANIFEST-locked; this includes howto-layers.mjs, build-page.mjs and copy-lint.mjs) and tools/plates/vendor/**. Patches act only on the mirror copy. A mutation that moves an anchor in a working-tree copy is restored and never committed.
- LIB-6 files outside write_scope stay byte-identical to 9b8f76e:
  - tools/plates/library/render/closeups-8.mjs, legacy.mjs, region-fix.mjs, compare.mjs, fragments.mjs;
  - tools/plates/library/render/closeup/common.mjs, hand.mjs, hand-marks.mjs, thumb.mjs, zoom-css.mjs, zbox-css.mjs, zbox-hand.mjs, zbox-options.mjs. zbox-hand.mjs draws hands only, with the layers hand engine; tools/plates/vendor/engine/ has no hand.mjs;
  - tests/library/closeups.test.ts;
  - tools/plates/library/test/** (layers-page.test.mjs and fixtures/).
- LIB-5 and BOX-CAP files: tools/plates/library/shared/**, lint/** (box-caps.mjs included), research/**, gen/library-gate.mjs, and every existing tests/howto/fixtures/lib5/** file.
- tools/plates/library/layers-spec.mjs, tests/howto/fixtures/lib2b/** (the committed E1 page and provenance.json), and every other line of library-rows.test.ts.
- Other cards' files:
  - tests/howto/library-manifest.test.ts (LIB-4c; unedited);
  - tools/plates/library/fidelity/** (LIB-4b);
  - tools/plates/library/hands/** (LIB-7).
- tools/plates/gen/**, tools/plates/generate.mjs, tools/plates/lib/**, src/**, docs/research/**.
- AGENTS.md file ownership:
  - scripts/screenshot-gate.mjs and tests/theme.test.ts (shared add-only; this card adds no block);
  - src/ui/styles.css;
  - .github/**, scripts/prepare-android.sh and native/patch_manifest.py (supervisor; D-LIB6PM-CI's step is the supervisor's);
  - package.json and package-lock.json (no new dependency);
  - src/app/App.tsx and src/main.tsx;
  - src/core/models.ts, src/core/store.ts and migrations (no new saved data);
  - native/wear/**, src/native/wearEngine.ts and src/slices/settings/WatchLab.tsx (watch agent);
  - escobar-worker/**.

Collision check. Paths: build-layers-page.mjs, render/**, tests/library/**, tools/plates/library/test/**, ci/manifest.mjs, library-rows.test.ts, tests/howto/fixtures/lib5/**, shared/back-box.mjs, tools/plates/layers/**, library-manifest.test.ts and layers-spec.mjs. Method: `git diff --name-only $(git merge-base origin/main <head>) <head>` over those paths. Run 2026-10-18 on main 2078913c, after fetching every open PR head.
| PR | Head | Files it changes in those paths |
|---|---|---|
| LIB-7 #193 | 55e91e9f | Based on this branch, and contains 9b8f76e6. Its copies of #181's files equal 9b8f76e; it differs from 9b8f76e outside those paths in docs/COACHING-DECISIONS.md. Adds tests/library/hand-pairs.test.ts and tests/library/fixtures/hands/** |
| LIB-12 #191 | 0d268a71 | Based on main, and contains 9b8f76e6. The same as #193, plus tests/library/hand-views.test.ts |
| LIB-4d #261 | e7502cdb | library-rows.test.ts: other hunks (:31, :37, :167, :208), none in :116-126 |
| LIB-5 #244 / BOX-CAP #260 | 1d1fe9ea / 2bea5685 | tests/howto/fixtures/lib5/** (6 files, none a back-flagged helper); shared/back-box.mjs |
| LIB-4c #246 / #249 | 68f15560 / 4a4d29dc | ci/manifest.mjs; library-manifest.test.ts |
| LIB-4c scratch #257 | 42716893 | #181's files (a scratch merge; it never merges) |
| #190 | 82ae2d40 | tools/plates/library/test/build-page.test.mjs (a new file; [do not merge]) |
| every other open PR | | none |
- #193 and #191 take this card's changes when they merge main. After #181 merges, the supervisor sets #193's base to main (D-LIB6PM-BRANCH).
- Re-run this check on each head you send for review, and post it in the PR.

Do:
0. Start. Confirm the head is 9b8f76e6. Read read_first.
1. Main merge and the "before" evidence (local).
   - `git merge --no-ff origin/main` (a merge commit). If git reports any conflict, stop and report.
   - On that head, run:
     - `npx vitest run tests/library/closeups.test.ts tests/howto/library-rows.test.ts`. LIB-2b's rebuild compare now runs, because the builder exists. It must be green: E1's page rebuilds byte for byte before any change;
     - `node --test tools/plates/library/test/*.test.mjs`: 9 pass, page sha e7b81413….
   - Keep the outputs; they are PM-A1's "before" evidence.
2. Design note, docs/howto/library/LIB-6-PM-DESIGN.md. Post it as a PR comment with your first push; until then it stays in your HANDOFF.
   a. Engine per plate (D-LIB9-ENGINE, D-LIB6PM-PLATE):
      - how a spec's engine is found from its imports. On the page, layersSpecOf stages vendor-engine files under library/tools/plates/vendor/engine/ in the mirror;
      - how the engine reaches closeupApi → zoomApi/engineCrop and zboxApi/zbox-geometry, and the plate block (mirrored build-page.mjs :59, :63). The default is the layers engine;
      - the explicit check that a crop or plate comes from its own spec's engine. It throws, naming the id, and never relies on bytes differing;
      - every module the page loads by URL.
   b. Back patches (D-LIB5-PAGE, D-LIB6PM-ANCHORS):
      - each anchor's exact text and replacement;
      - the holder;
      - the conditional dynamic import in the 'renderer dispatch' expansion;
      - FLAG's `back` getter.
      The thrown Error's message is exactly `<id>: LIB-5: back box waits for owner decision 6 (plan 8 item 6)`. Tests match it as a line in the child's output (PM-A5).
   c. The fixture helper and S5-L, under D-LIB6PM-FIXTURE, D-LIB6PM-CAP and D-LIB6PM-WAITS, with the word totals re-measured on E1's tree.
   d. L0-lib (D-LIB6PM-L0): how filesOf learns that a row's batch has a back-flagged row, and the files it adds.
   e. Cost: the measured seconds each new test file adds to `npm test`.
   Then wait for the supervisor's look before Do 3, Do 5 and Do 6. Do 4 may run meanwhile.
3. Engine per plate (D-LIB9-ENGINE, D-LIB6PM-PLATE):
   - crop.mjs, zbox.mjs and zbox-geometry.mjs take the engine as a parameter. The default is the layers engine, so the 8, E1 and B5 stay on it.
   - closeups.mjs and zoom.mjs pass the engine through, and the engine check is in.
   - The plate-block patch is in patchBuildPage.
   - Write tests/library/layers-engine.test.ts, with its fixture under tests/library/fixtures/engine/**: a How-to whose plate spec imports tools/plates/library/engine.mjs and uses a `poly` part and a flat palm (vendor body.mjs: opts.hand 'flat').
   - Each new patch is applied by patchHowtoLayers or patchBuildPage for every plan and spec, the 8's included. Which engine draws a spec is decided at run time inside the patched code, never by skipping a patch.
4. Pre-merge lines (11.1 item 9; D-LIB2b-FIXTURE (10)):
   - In tests/howto/library-rows.test.ts, remove the absent-builder branch (:117-120) and retitle :116 as in write_scope. That test builds through layersSpecOf, whose spec carries `files`, so it is also the "unconditional spec.files test". No second test runs the same build (PM-A3).
   - In D-LIB6-9, "4" becomes "6"; append D-LIB6-10..12.
5. Back patches (after LIB-5 is on main; merge main first). In patchHowtoLayers, each exact-once and applied for every plan:
   - (i) RF (howto-layers.mjs:217) gains `back: 'back'`.
   - (ii) A module-scope holder anchor (for example `const __BACK = {};` after the copy-lint import, :16).
   - (iii) The 'renderer dispatch' expansion, which runs after every How-to module is in `mods`, gains `if (mods.some(M => (M.default.riskFlags ?? []).includes('back'))) __BACK.backBox = (await import(BACK_BOX_URL)).backBox;`.
   - (iv) FLAG (:271) gains a `back` getter that calls `__BACK.backBox()`, wrapped so the thrown message names the id.
   - Neither the mirror nor build-layers-page.mjs imports back-box.mjs statically. Nothing under tools/plates/layers/** or copy-lint.mjs is written.
   - Write tests/howto/fixtures/lib5/back-page.mjs (D-LIB6PM-FIXTURE) and tests/library/layers-back.test.ts.
6. L0-lib back line (after LIB-4c and LIB-5 are on main; D-LIB6PM-L0). manifest.mjs adds three files for every pinned row whose batch has a row whose How-to riskFlags include 'back':
   - tools/plates/library/shared/back-box.mjs;
   - every repo module it imports statically;
   - docs/research/howto/shared/back-pain-box.json.
   Write tests/howto/library-manifest-back.test.ts.
7. S5-L and the twin (PM-A7, PM-A8).
   - Before Do 9 is on main, write and run them on a local scratch merge of the Do 9 PR's reviewed head. Never commit Do 9's commits to this branch.
   - Once Do 9 is on main: merge main, commit tests/howto/library-back-page.test.ts and re-run both.
8. Finish:
   - Run every mutation below: a temporary edit, the red output, then restore. List each in the PR with its red line.
   - Merge origin/main (a merge commit). Re-run the collision check.
   - On that exact head, run:
     - `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` (the long ones detached);
     - `node --test tools/plates/library/test/*.test.mjs`;
     - PM-A1's B5 page identity.
   - Tick each row in the PR body. Add the HANDOFF block and the line "You will notice: nothing visible."
   - Post "LIB-6-PM READY: <sha>". Retitle #181 '[ready for review] LIB-6: close-up renderer (golden B byte for byte)'.

Acceptance (each criterion maps to a test or to PR evidence; each mutation turns red, then is restored):
- PM-A1 Approved pages do not move. On the Do 1 head and the READY head:
  - `node --test tools/plates/library/test/*.test.mjs` passes 9 of 9, including the 8's renderer page at PAGE_SHA256 e7b81413…;
  - tests/library/closeups.test.ts passes;
  - LIB-2b's committed tests/howto/fixtures/lib2b/cable-lateral-raise.layers.html rebuilds byte-identical (library-rows.test.ts);
  - B5's scratch pages (LIB-4b fidelity/fixture.mjs) are built in scratch worktrees with 9b8f76e and with this head, and have equal sha256. This is PR evidence; the runner command is unverified until LIB-4b is on main.
  Mutation: one byte in render/closeup/common.mjs → closeups.test.ts and the page test are red (#181 ruling 3).
- PM-A2 Engine per plate (D-LIB9-ENGINE, D-LIB6PM-PLATE), tests/library/layers-engine.test.ts:
  - the existing 8-closeup tests are unedited and green;
  - the library fixture's crop (poly part, flat palm) renders through the vendor engine;
  - a page built for that fixture draws its plate block with the vendor engine;
  - the 8's page stays at PAGE_SHA256;
  - the engine check throws, naming the id, when a crop or plate engine differs from its spec's.
  Mutations, each red:
  - that crop through the layers engine;
  - a layers-engine spec cropped through the vendor engine;
  - the plate-block patch dropped (the fixture page throws "unknown equipment type");
  - the default switched to the vendor engine (the 8's close-up test or the engine check turns red).
- PM-A3 Pre-merge lines. The library-rows.test.ts rebuild compare runs unconditionally. `git diff origin/main -- tests/howto/library-rows.test.ts` shows only the retitled :116 and the removed :117-120.
  Mutations:
  - build-layers-page.mjs and tools/plates/library/render/ both moved out of the working tree → main's test returns green through the absent-builder branch, and with the branch removed the test is red;
  - buildLayersPage's spec.files copy loop (:110) emptied → red;
  - one byte of the committed E1 page → red.
- PM-A4 Back patches, tests/library/layers-back.test.ts:
  - tests/library/closeups.test.ts:66-73 is unedited. Every new patch runs for every plan, so that test covers each new anchor;
  - each new anchor (RF, FLAG, holder, plate block), moved in a working-tree copy of its vendored file and restored, makes closeups.test.ts:66-73 fail, naming its patch. The dispatch load sits inside the existing 'renderer dispatch' replacement, whose anchor is already covered;
  - the 8's page and E1's page are byte-identical (PM-A1).
  Mutations, each red:
  - the RF patch dropped → a back-flagged fixture page throws 'red flag back missing' (howto-layers.mjs:221);
  - the FLAG patch dropped → 'no shared red flag back' (:278).
- PM-A5 Laziness and BACK_BOX_WAITS (D-LIB6PM-WAITS). Use a tree in which tools/plates/library/shared/back-box.mjs holds LIB-5's placeholder (#244 @ 1d1fe9ea, all 15 lines):
  - buildLayersPage on E1's back-flagged fixture rejects. Its message contains the line `Error: lib_cable_lateral_raise: LIB-5: back box waits for owner decision 6 (plan 8 item 6)`. That is runNode's wrapper (build-layers-page.mjs:103) in LIB-5's form (library-shared.test.ts @ 1d1fe9ea :130);
  - with `throw new Error('back-box.mjs loaded');` as the first line of the tree's back-box.mjs, E1's unflagged page still builds byte-identical to the committed page;
  - before Do 9 is on main, the first row also runs on the repo's own back-box.mjs.
  Mutations, each red:
  - the load made unconditional → the unflagged build rejects with 'back-box.mjs loaded';
  - FLAG made eager → the unflagged build rejects with BACK_BOX_WAITS.
- PM-A6 L0-lib back line (D-LIB6PM-L0), tests/howto/library-manifest-back.test.ts. On LIB-2b's fixtureTree with the back-page helper applied before pinTree:
  - manifestOf lists, for the pinned row, tools/plates/library/shared/back-box.mjs, each repo module it imports statically, and docs/research/howto/shared/back-pain-box.json;
  - on E1's unflagged fixtureTree, whose batch has no flagged row, it lists none of them;
  - every module the patched page loads by URL is in the row's set: BUILDERS for every row; back-box.mjs only where the batch is flagged;
  - tests/howto/library-manifest.test.ts is unedited and green.
  Mutations, each red:
  - one byte of the tree's back-pain-box.json → manifestProblems names `docs/research/howto/shared/back-pain-box.json sha256` (C0 red);
  - the new manifest.mjs lines removed → the listing row is red.
- PM-A7 S5-L (D-LIB5-PAGE, as D-LIB6PM-FIXTURE and D-LIB6PM-CAP amend it), tests/howto/library-back-page.test.ts. It reads build-layers-page.mjs only. On E1's back-flagged page:
  - `#<pre>-redflag-back` holds exactly three `<p>`, whose unescaped texts equal RED_FLAG_BACK's name, now and doctor, imported from src/howto/red-flag-back.ts;
  - the row's rf-link has `data-flag="back"` and `aria-controls="<pre>-redflag-back"`;
  - D-LIB5-REACH's reach checks run on the page text with the back box's key 'back-pain-box' (D-BOXCAP-WIRE boxReach);
  - lintHowto's words.total plus words(back box) ≤ the imported VISIBLE_WORDS_MAX (copy-lint.mjs:56; :313 drops 'back');
  - a variant at exactly 450 words with the box is green.
  Mutations, each red:
  - one box byte drifted;
  - the back box at the named limit + 1 words (51, imported from box-caps.mjs, never copied);
  - another box (the wrist box) at 31 words;
  - the extra-words term removed, on a variant whose words.total is 450 (the check must flag it; without the term it does not).
- PM-A8 HT-9 twin. On the first head that holds Do 9, the twin lines (D-LIB5-TWIN) and both patches, LIB-4b's HT-9 twin runs E1's back-flagged fixture at 0 px. This is PR evidence; the runner command is copied from LIB-4b's B5 (unverified until LIB-4b is on main).
- PM-A9 No loosening, no drift. PR evidence on each review head and the READY head, after `git fetch origin`, on a clean tree:
  - `git diff --exit-code 9b8f76e6 HEAD --` over the LIB-6 files reserved above prints nothing;
  - `git diff --exit-code origin/main HEAD -- tools/plates/layers tools/plates/vendor tools/plates/library/shared tools/plates/library/lint tools/plates/library/layers-spec.mjs tests/howto/fixtures/lib2b tests/howto/library-manifest.test.ts tools/plates/library/fidelity src` prints nothing;
  - `git diff --name-only origin/main HEAD` prints only #181's 23 files and the write_scope paths;
  - `git diff -U0 9b8f76e6 HEAD -- tools/plates/library/build-layers-page.mjs tools/plates/library/render | grep -E '^-' | grep -vE '^--- '` prints only lines the PR lists, each with its reason.
  Mutation: one line added to closeups.test.ts, not committed → the first command prints a diff.
- PM-A10 Green, locally on the merged head and in CI on that head:
  - `npm run check`, `npm run test:tz`, `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`;
  - `node --test tools/plates/library/test/*.test.mjs`.
  Post the measured seconds the new test files add to `npm test`.
- PM-A11 The collision table, re-run on each head sent for review.

verification: the PR body maps PM-A1..A11 to their tests or evidence, and lists every mutation with its red line. On each head sent for review and on the READY head, it posts PM-A9 and the collision table, each run on that exact head.

risk_and_recovery:
- Word budget. D-LIB5-PAGE's first-form fixture measures 449 + 50 = 499 words, over 450. D-LIB6PM-FIXTURE's form measures 390 + 50 = 440 on main's pull-up text. Re-measure on E1's tree. If it does not fit, stop and report. Never raise or bypass a limit.
- Engine bytes. The vendor engine may not render a layers-engine clone byte-identically (not verified, lib4-cards :1120). The default stays the layers engine, and no fixture changes engine.
- Locked text. The new anchors touch locked vendored text, but only in the mirror. Each is exact-once, applied for every plan, and covered by the anchor test.
- #193 and #191 carry #181's files unchanged and take this card's changes through their main merge. Their evidence pinned to #181 @ 9b8f76e may need a re-run; the supervisor relays this card's diff to both.
- If the remote head of this branch moves under you, stop and report (D-LIB6PM-BRANCH).
- If Do 9 slips past slot 5, #181 merges without S5-L and PM-A8, and the Do 9 PR carries them with this card's helper (merge_prerequisites).
- Timeouts. A page build takes about 7 s (layers-page.test.mjs:2 @ 9b8f76e). Give each describe and beforeAll a timeout, as library-rows.test.ts does (300_000). If a time budget is exceeded, report it; never drop a row.
- If any existing #181 or main test cannot stay green without loosening a check, stop and report.
- After two failed tries of one approach, stop and report.

return:
- the head sha and the Do 1 merge commit sha;
- the collision table re-run on that head;
- PM-A1's "before" outputs (Do 1) and "after" outputs (READY);
- every mutation with its red line;
- the measured word totals of the fixture variants, and the seconds added to `npm test`;
- `npm run check`, `npm run test:tz`, gate and `node --test` output on the final head.

Resume rule: when you are WAITING or parked, resume only on the supervisor's exact words 'LIB-6-PM resume', sent to your session or posted on #181. A prerequisite merging is not a resume.

---

Critic fixes applied (lib-6-pm-critic.md; 12 of 12; the supervisor accepted every finding):
- H1: merge order replaced by D-LIB-ORDER-2. LIB-4d now merges at 3d, before LIB-5, so #181 never waits on it. The stale LIB-5v question is dropped (LIB-5v is 7a). Applied in merge_prerequisites and depends_on.
- M1: BOX-CAP and Do 9 no longer gate #181 (:1181). The S5-L/PM-A8 line is split into the on-main and not-on-main cases.
- M2: PM-A5 and Do 2 b now match a line in the child's output (`Error: <id>: …`, build-layers-page.mjs:103; library-shared.test.ts :130). D-LIB6PM-WAITS changed to match.
- M3: back-box.mjs loads only on a page with a back-flagged sheet, through a holder plus a conditional dynamic import in the dispatch expansion; never at module scope. Applied in Do 5, PM-A5's load mutation and D-LIB6PM-ANCHORS.
- M4: every new patch is applied for every plan (Do 3, Do 5). PM-A4 now lists each anchor's move-mutation against closeups.test.ts:66-73.
- M5: PM-A3's first mutation now moves both build-layers-page.mjs and render/.
- M6: LIB-6-PM owns the helper. Stop if one exists; never use the first form. Posted on #244 and the Do 9 PR (build_prerequisites; D-LIB6PM-FIXTURE).
- M7: D-LIB6PM-LANE puts LIB-6-PM ahead of the LIB-7 fixer. Do 7 runs early on a scratch merge of Do 9. There are two delta reviews, R1 and R2.
- L1: BRANCH cites D-LIB9-HANDPAGE (:1156, section 12 item 10). It adds #193's base and the retarget to main after #181 merges.
- L2: the L0 line is keyed on the whole batch (manifest.mjs:67-68).
- L3: the library-rows `it(` title may change, to the new text in write_scope.
- L4: full render/closeup/ paths; collision table corrected (#193/#191 COACHING-DECISIONS diff, #193's base, #261's hunks); LIB-3b listed as merged; Form's archive facts corrected; cards head 1e85584a.

Recheck (critic, 2026-10-18): all 12 fixes are carried as intended, and D-LIB-ORDER-2 is carried in depends_on and merge_prerequisites. Checked: #261 merges cleanly with #181 @ 9b8f76e6 and with #244 @ 1d1fe9ea.
- recheck N1: applied. D-LIB6PM-FIXTURE said "Do 9 writes neither the helper nor S5-L", which contradicts merge_prerequisites' not-on-main case (Do 9 carries S5-L). It now says Do 9 never writes the helper, and writes S5-L only if #181 is on main first, using this helper and D-LIB6PM-CAP. build_prerequisites' post says the same.
- recheck N2: applied. D-LIB6PM-ANCHORS and PM-A4 listed the dispatch load as a new anchor. It sits inside the existing 'renderer dispatch' replacement, so the only extra anchor is the holder.
- recheck N3: applied. D-LIB-ORDER-2's reason said LIB-4d's deadline sat between Do 9 and #181. In fact D-LIB8M-ORDER :3396 placed it there, and the deadline allows any earlier slot.

Review note (supervisor, 2026-10-22, REVIEW LIB-6-PM @ 56d3bbb PASS, #181 6331958891 Low 1): PM-A5's "FLAG made eager" mutation is red, but the unflagged build rejects with `TypeError: __BACK.backBox is not a function`, not BACK_BOX_WAITS, because the back-box load stays conditional. Expect that TypeError when re-running it.
