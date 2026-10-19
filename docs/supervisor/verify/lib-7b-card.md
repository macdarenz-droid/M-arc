Card LIB-7b: library hand blocks from the pair key (D-LIB9-HANDPAGE's page part, lib4-cards 12 item 10; the shared-key proof, 11.1 item 14; split from LIB-7-FIX by D-LIB7FIX-BRANCH; 2026-10-18)

Sources (every file:line below was opened at these heads; [unverified] marks the rest):
- main 2078913c;
- #193 55e91e9f;
- #181 9b8f76e6. LIB-6-PM will move it; re-read at #181's merged head;
- #232 0867c86f; #246 68f15560; #245 38b436d5;
- lib4-cards.md @ 0b85c963; HANDOVER @ 651a767f; plan @ 6550ce28;
- lib-7-fix-critic.md (R1-R8, a local merge, never pushed).
LIB-7-FIX's card is lib-7-fix-card.md. This card starts after it merges.

id: LIB-7b
model: claude-opus-5-5 (hard card: the page hook, panel styling in a fresh app context, the duplicate-id question and the shared-key proof need judgement)
mode: auto
title: 'Builder: LIB-7b library hand blocks from the pair key'
branch: claude/lib-7b-hand-blocks (new). Your first allowed push opens draft PR 'LIB-7b: library hand blocks from the pair key'.
- Builder: the LIB-7-FIX session continues on this new branch once #193 is on main, in the slot #193's merge frees. Fallback: a fresh Opus builder.

Stops (these override every other line in this card):
1. Lane (D-LIB-LANE-ACTIVE). This card holds a LIB builder slot.
   - Start only on 'LIB-7b start', sent with the live active count.
   - If told to park, stop at your next local commit and push nothing.
   - Resume only on 'LIB-7b resume'.
2. Approved drawings unchanged (D-LIB7FIX-CARRY, as on main).
   - LIB-7's three pins (tests/library/hand-pairs.test.ts :132, :403, :404) stay unedited and green.
   - The Stops 2 files of LIB-7-FIX's card are not edited.
   - LIB-7-FIX's F4 (each approved page's SVG in pairPanel equals the pinned default render with the uid swapped) still holds after any change to the panel's wrapper.
3. Golden B and the 8 do not change.
   - tools/plates/layers/** and tools/plates/vendor/** are untouched.
   - The 8's page rebuilds at its pinned sha (LIB-6's test).
   - tools/plates/gen/hands.mjs is never edited: one byte moves 27 generated headers (critic R6).
   - `generate --check` is clean, and no generated file under src/ changes on main. handpairs.mjs, layers-spec.mjs and build-layers-page.mjs edits move 0 headers (R6).
4. Pages that exist today rebuild byte-identical:
   - the 8's page;
   - tests/howto/fixtures/lib2b/cable-lateral-raise.layers.html, through library-rows.test.ts:116-126;
   - LIB-4b's B5 scratch pages;
   - LIB-4c's scratch pages.
   Their layers configs name no pair, so they build exactly as today by construction (D-LIB7b-SCOPE (b)). If one byte moves, stop and report.
5. Other cards' files: only the lines D-LIB7b-SCOPE names, after the supervisor's look at the design note, each in one block marked `LIB-7b`. Anything else means stop and report.
6. Shown words follow D-LIB7FIX-WORDS: approved wording only, captions of at most 10 words, no explaining text.
7. No new drawing. The six LB1 keys are ruled and drawn elsewhere, never here.

CI manners (D-LIB-CIMANNERS):
- At most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci].
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them until it says go. Never cancel, re-run or dispatch a run that is not yours.
- Run any job that may last over 1 hour as a detached process: `setsid nohup <cmd> > <log> 2>&1 &`, then poll its log. This covers the gate, a full test:tz run and the runner on the scratch tree. A tool background job stops at about 2 hours, and a stopped or killed run is never evidence.
- Never write to the owner.

base: origin/main at 'LIB-7b start'. It must hold #181 with LIB-6-PM, #193 with LIB-7-FIX, and LIB-4b #232; if any is missing, stop and report.
- Merge origin/main with a merge commit before review and before READY.
- Run `git pull --no-rebase` before each push. Never rebase, amend or force-push.

depends_on:
- LIB-7-FIX (#193): HAND_OF_ID, `inputsFor`, `pairPanel(key)`, panel-words.json.
- LIB-6 #181 with LIB-6-PM: build-layers-page.mjs with D-LIB6PM-PLATE and D-LIB6PM-ANCHORS.
- LIB-4b #232: fidelity/twins/ht6.mjs, ht7.mjs and the B5 fixture.
- LIB-2b: layers-spec.mjs, gen/handpairs.mjs.
- LIB-4c #246: ci/manifest.mjs, the L0-lib pins.

build_prerequisites:
- 'LIB-7b start'.
- The start message quotes D-LIB7b-SCOPE, D-LIB7b-SLOT and D-LIB7b-PAGEDUP (lib-7-fix-rulings.md). PAGEDUP stays open until Do 3 (e)'s measurement.
- Do 4-7 wait for the supervisor's look at the design note (Do 3).

merge_prerequisites:
- A fresh Opus review PASS against this card.
- Every check green on a head that contains the latest main.
- Checklist slot 6b (D-LIB7b-SLOT): after LIB-7 #193 (6), before LIB-8M #109 (7).
  - A pinned row's MANIFEST.json entry lists the static closure of every page builder, build-layers-page.mjs and hands/pairs.mjs (with panel.mjs) included, plus `inputsFor(key)` for a keyed row (ci/manifest.mjs:27, :60-62, :69-71). Entries are written in the pin commit (lib-8-merge-card.md:208, :262) and change only in a commit that adds or replaces a pin (ci/manifest.mjs:14; lib4-cards :1086).
  - So no library pin is made on a head without this card: 'PILOT A PIN GO' (LIB-8M Do 13, lib-8-merge-card.md:53) waits until this card is on main and merged into #109. A pin made earlier would go stale (C0 red) when #109 merges main.
- Deadlines:
  - before LB1 (#245) pins its layers page or ships a keyed row (11.1 item 10 (b), :647);
  - the shared-key proof before LIB-9 ships an id that shares a key (D-LIB4-ENTRY, 11.1 item 14 :664).
- It merges in a supervisor merge train, one merge commit per PR in checklist order. The builder never merges.

hard card: yes. Write the design note in Do 3, in hands/DESIGN.md §9 "Library hand blocks (LIB-7b)", and post it with your first push.

outcome:
Gap today (main 2078913c, with LIB-7-FIX as its card states):
- **The page draws its own hand block.** A library card's hand block on its layers page comes from LIB-6's renderer per exercise. Its ids are `<chromeId>-zoom-hand` and `<chromeId>-z-…`, and its CSS is scoped `.hx-<chromeId>` (howto-layers.mjs:167-171, :319). It is not the app's handpair chunk, which D-LIB9-HANDPAGE requires.
- **The generator sees chromeId markup only.**
  - gen/hands.mjs:190 finds a library row's hand block by `<chromeId>-zoom-hand` only.
  - gen/hands.mjs:193 cuts only `.hx-<chromeId> ` rules (scopedRules :58-63) into zoom-<chromeId>.css, the file the HAND loader brings in before the pair chunk (D-LIB2b-HANDCSS; the pair chunk imports nothing, library-rows.test.ts:66).
- **LIB-4b's HT-6 twin finds the panel by `#<chromeId>-zoom-hand`** (ht6.mjs:21, :48-51).
- **Two ids on one key have never run** through the page, the app and the runner (11.1 item 14).
- **Repeated ids are unruled.** Two cards on one key on one page, or one after the other in an app context, repeat DOM and SVG ids.
After this card:
- A batch's layers config names each pair row: `closeups: { <lib id>: { …, pair: '<key>' } }`. layersSpecOf already copies each closeups entry whole (layers-spec.mjs:57-60). No page build reads a pairs loader to choose rows.
- For a pair row, the page's hand zx block is `await pairPanel(key)` byte for byte. Every page reference to it names the panel's own id: the chip's aria-controls (howto-layers.mjs:183) and the ht-also button (:292).
- gen/handpairs.mjs (add-only; `after = ['tools/plates/gen/hands.mjs']`, generate.mjs:7-10, :47-55):
  - a shipped row whose config names pair K must have `HAND_OF_ID[id] === K` and an archetype other than 'none';
  - a 'none' row whose page holds a pair panel throws;
  - a pair row's zoom-<chromeId>.css (from ctx.prev) gains the rules that style its pair panel.
  gen/hands.mjs is not edited.
- The HT-6 twin finds a pair row's panel by its pair markup.
- The shared-key proof passes: two ids on one key, each in a fresh context.
- D-LIB7b-PAGEDUP is measured and ruled.

deliverable: one PR.
evidence: 7b-A1..7b-A7 below.
finish: merged on main in slot 6b. You will notice: nothing visible. No library row ships.

design_reference:
- lib4-cards @ 0b85c963:
  - 12 item 10 (:1149-1159); 11.1 items 4 (:627), 10(b) (:647), 14 (:661-665) and 18 (:686-697);
  - 12 item 5 (b) (:1079-1089);
  - section 17: D-LIB6PM-PLATE, D-LIB6PM-ANCHORS and D-LIB6PM-BRANCH.
- LIB-7-FIX's card and rulings; lib-7-fix-critic.md findings 4, 5, 8, 9 and 12.
- HANDOVER @ 651a767f: the merge order.

connectivity: none. No stored or sent user data, no storage key, no network call, no dependency.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and its gotchas; this card; the rulings.
- On main at start:
  - tools/plates/library/build-layers-page.mjs (at 9b8f76e: :48-117; re-read at #181's merged head for LIB-6-PM's patches) and layers-spec.mjs :43-100;
  - gen/handpairs.mjs; gen/hands.mjs :42-49, :58-63, :175-196; generate.mjs :5-11, :47-55; lib/inputs.mjs :14-31;
  - golden B tools/plates/layers/artifact/howto-layers.mjs :160-183, :292, :319, and build-page.mjs :418-477 (the per-card panel runtime);
  - src/slices/howto/zoom/ZoomHost.tsx :62-63, :77-88 (read only);
  - tests/howto/library-rows.test.ts :49-66, :116-126, :491-517;
  - tests/howto/zooms.test.ts :147-176 (HT7-A2 idProblems);
  - scripts/screenshot-gate.mjs :7382 (HT-7 A2, "duplicate ids in the document");
  - tools/plates/layers/artifact/shoot2.mjs :200.
- LIB-4b's files on main: fidelity/twins/ht6.mjs (at 0867c86f: :15, :21, :45-52, :60-64, :129-164), twins/ht7.mjs :201, fidelity/fixture.mjs (:25-29, :164-176).
- LIB-4c on main: ci/manifest.mjs :1-14, :27, :55-73; LIB-4c's scratch builder [path unverified; on #246].
- LIB-2b fixture tests/howto/fixtures/lib2b/fixture.mjs :105-120.

write_scope:
- tools/plates/library/build-layers-page.mjs: one block marked LIB-7b, a post-build replacement in `buildLayersPage` for spec rows that name a pair.
  - It adds no exact-once anchor to the vendored text, so LIB-6-PM's anchor coverage (D-LIB6PM-ANCHORS) is untouched.
  - The page's style gains the pair scope's rules once per key.
- tools/plates/library/layers-spec.mjs: only a validation of `closeups[id].pair`: the key pattern, and the id is a row of the batch.
- tools/plates/gen/handpairs.mjs: add-only.
  - Add `after`, the pair-row checks and the CSS extension.
  - Leave as they are: `loadPairs`, `pairsOf`, `pairText`, `pairProblems`, and the outputs `outputs({ pairsFile })` already gives.
- tools/plates/library/hands/panel.mjs: wrapper bytes only, and only if the note shows page equality needs it. LIB-7-FIX's F3 and F4 are then re-run.
- tools/plates/library/fidelity/twins/ht6.mjs: the panel-locating lines (:21, :48-51) and the readers that use them, for a library id on a key. The 8's HT-6 gate block and twins/pins.json are never touched.
- New: tests/library/lib7b.test.ts and tests/library/fixtures/lib7b/** (scratch-marked; 11.1 item 3's limits: never pinned or shipped).
- tools/plates/library/hands/DESIGN.md: §9 only.
- docs/COACHING-DECISIONS.md: appended D-LIB7b-* entries only.
- The PR body.

reserved_paths:
- tools/plates/gen/hands.mjs, gen/ids.mjs, generate.mjs, lib/**.
- LIB-7's Stops 2 files.
- tools/plates/library/render/** (LIB-6).
- tools/plates/layers/**, tools/plates/vendor/**.
- registry.mjs, candidate.mjs, qa/**, ci/**, MANIFEST.json, scale/**, lb1/**, pilot-a/**.
- tests/howto/hands.test.ts, zooms.test.ts, library-rows.test.ts, library-core.test.ts.
- tests/howto/budgets.json, src/**.
- The other twins and pins.json.
- Shared add-only files (AGENTS.md :73): scripts/screenshot-gate.mjs and tests/theme.test.ts.
- .github/**, package.json, package-lock.json.
- AGENTS.md, CLAUDE.md, docs/supervisor/**, the plan docs.

Do:
1. On 'LIB-7b start': check that main holds #181 with LIB-6-PM, #193 with LIB-7-FIX, and LIB-4b; else stop. Open the branch and subscribe to your PR once it exists.
2. Baseline on main, recorded in the PR: the sha256 and byte count of each Stops 4 page rebuild; LIB-7's three pins; `generate --check` clean.
3. Design note (hands/DESIGN.md §9). Settle each point with a measured fact, or name the options:
   - (a) the config field and its validation;
   - (b) the hook:
     - where in `buildLayersPage` it runs;
     - which references move;
     - how the pair scope's CSS enters the page once per key;
     - why Stops 4's pages cannot change;
   - (c) app styling: the CSS extension in handpairs.mjs, with the pair chunk importing nothing (library-rows.test.ts:66), and one fresh-context open styled (D-LIB2b-HANDCSS);
   - (d) the pair-row checks;
   - (e) D-LIB7b-PAGEDUP:
     - in Chromium 141 and Chrome 153, a fixture page with two cards on one key, each card's panel opened while the other copy is hidden, pixel-compared with the panel alone;
     - every id-uniqueness check named: HT7-A2 (zooms.test.ts:147-176), gate HT-7 A2 (:7382), its twin (ht7.mjs:201) and shoot2.mjs:200;
     - in one app context: open card A's hand close-up, close it, open card B's on the same key, then the HT-7 A2 duplicate-id probe;
     - where that probe runs on every gate once LB rows ship (proposal);
   - (f) the twin edit and the shared-key scratch tree: two scratch ids, outside LB1 and LB2 (D-LIB-SCRATCHIDS), on one real LIB-7 key;
   - (g) every file:line it will touch in other cards' files.
   After two approaches with no new evidence, stop and report.
4. After the look: the config field, the hook and 7b-A1.
5. handpairs.mjs and 7b-A2.
6. The twin and the shared-key proof (7b-A3). The scratch tree is local. CI on it runs only through a ref the supervisor pushes (claude/lib-7b-scratch): post the exact commands and your head sha on the PR (the 11.1 item 16 (f) pattern).
7. 7b-A4 under the PAGEDUP ruling.
8. Before READY:
   - merge origin/main;
   - re-run 7b-A1..A7 on that head;
   - run the collision table;
   - re-read your diff against write_scope;
   - post "LIB-7b READY: <sha>".

Acceptance (each with evidence and the mutations that must turn red; list each red line in the PR):
- **7b-A1 Page hand block === pair panel (D-LIB9-HANDPAGE).** A fixture batch under tests/library/fixtures/lib7b/**, whose config names a pair, is built through `layersSpecOf` + `buildLayersPage`.
  - Each pair row has exactly one hand zx block, equal to `await pairPanel(key)` byte for byte.
  - Every reference to it names the panel's id.
  - Stops 4's pages are byte-identical to Do 2's baseline.
  - Mutations, each red: the hook off; an aria-controls left at `<chromeId>-zoom-hand`; the panel inserted twice; a config with no pair field (the block is then the renderer's, not the panel).
- **7b-A2 Generator by pair markup (handpairs.mjs).**
  - A config pair K with `HAND_OF_ID[id] !== K` throws.
  - A 'none' row with a pair panel throws.
  - A pair row's zoom-<chromeId>.css holds the pair scope's rules, and a fresh-context open is styled: pager tab height as on the page (C10).
  - library-rows.test.ts :491-517 and library-core :420-436 are unedited and green. The FIX loader still gives exactly its two handpair paths, because its rows are the 8 (critic finding 4).
  - generate --check is clean, with 0 headers moved on main.
  - Mutations, each red: the key check removed; the 'none' check removed; the CSS extension dropped (the fresh-context open is unstyled).
- **7b-A3 Shared-key proof (11.1 item 14).** On a scratch tree, two scratch ids sit on one real LIB-7 key, built and pinned through the real pipeline:
  - (i) 7b-A1 holds for both;
  - (ii) the HT-6 twin finds each panel by its pair markup, and every HT6 row passes for both ids;
  - (iii) HT6/A7-lazy for each id in a fresh context: no hand chunk before the first tap, then `handpair-<key>-` on the tap (ht6.mjs:134-136, :155);
  - (iv) the 8's HT-6 block and pins.json "gate:HT-6" are unchanged.
  - The two scratch ids join the key by a scratch-only edit of that key module's `IDS` (same variant, orientation and ordered faults; never committed to this branch). The reds this causes in LIB-7's own counted sweeps on the scratch tree (12 drawn ids; LIB-7-FIX F2's 8 keys) are listed as scratch artifacts, as D-LIB4-PINS-2 lists clone artifacts. Any other red: stop.
  - Mutations, each red: the twin's selector back to `#<chromeId>-zoom-hand`; both ids run in one context (the second tap requests no chunk); the hook off for one id.
- **7b-A4 Repeated ids (D-LIB7b-PAGEDUP).** The Do 3 (e) measurements, both browsers, as the ruling states. Mutations, each red: a repeated id that is not part of a byte-identical pair panel; card B's panel left in the document while card A's is opened.
- **7b-A5 Approvals and pins.** LIB-7's three pins and LIB-7-FIX's F3 and F4 are green on the final head.
- **7b-A6 L0-lib.** LIB-4c's C0 is green on the final head. No library pin exists on main or is made on any open PR before this card merges (D-LIB7b-SLOT), so this PR carries no MANIFEST.json change and no `[golden update]` commit. If a pin appears first: stop and report.
- **7b-A7 No regression, on the READY head:**
  - `npm run check`;
  - `npm run test:tz` (both zones);
  - `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, detached;
  - the diff touches only write_scope.
Nothing is loosened:
- no check, tolerance, pin, timeout or count is relaxed;
- every chromeId-path check stays;
- each pair-path check is added with its mutation.

verification: the PR body maps 7b-A1..A7 to a test or run, with commands and outputs, and lists every mutation with its red line. Evidence counts only for the exact head it ran on.

risk_and_recovery:
- **Merge slot.** #109 waits for this card, both its merge (6b before 7) and its pin ('PILOT A PIN GO' only after this card is merged into #109). That is the cost of D-LIB7b-SLOT. To keep the wait short, post the design note with the first push, and keep pushes to the CI-manners limit.
- **LB1's layers page.** LIB-9a (#245) builds it ahead of time. Any LB1 page built before this card merges must be rebuilt on a head that holds it before LB1 pins. Tell the supervisor, who posts on #245.
- **Six LB1 cards have a hand zoom and no key** (lb1/DESIGN.md:63-65). A non-'none' row with no pair cannot ship (gen/hands.mjs:192). This card does not draw keys; the supervisor rules the proposal LIB-7-FIX posted.
- **LIB-12's keys** (non-radial views with their own `render`) must also work through the hook when LIB-12 merges. Keep the hook generic over `pairPanel`, and test it with one LIB-7 key only.
- **LIB-6-PM's patches** sit in the same build-layers-page.mjs. The hook is a post-build step with no vendored anchor, so it does not collide with them. If the note shows it must patch vendored text, stop and report.
- **The scratch loaders** (LIB-2b E1, B5, LIB-4c) write their own pairs.mjs and cut panels from their own pages. Their configs name no pair, so the hook never calls them (Stops 4).
- **Two failed tries of one approach:** stop and report.

return:
- the PR number and head sha;
- Do 2's baseline shas;
- the design-note comment id and the rulings as applied;
- 7b-A1..A7 outputs;
- every mutation with its red line;
- the scratch tree's commands and, if pushed, the scratch ref sha;
- check, test:tz and gate output on the final head.

Resume rule: when you are WAITING or parked, you resume only on the supervisor's exact words 'LIB-7b resume', sent to your session or posted on your PR. A prerequisite post alone is not a resume.

Collision check (card time; re-run at start against every open PR):
| Path in write_scope | Open PRs that touch it at card time | Effect |
|---|---|---|
| build-layers-page.mjs | #181 (LIB-6-PM, merges first), #191 and #257 (copies) | starts from main after #181; post-build hook, no vendored anchor |
| layers-spec.mjs, gen/handpairs.mjs | none | none |
| fidelity/twins/ht6.mjs | #232 (owner, merges first); #246, #249, #257 (same blob 5880c594) | starts from main after LIB-4b |
| hands/panel.mjs, DESIGN.md | LIB-7-FIX on #193 (merges first); #191 (LIB-12 merges #193 later) | LIB-12 merges this head too, if panel.mjs changes |
| docs/COACHING-DECISIONS.md | most open PRs | append-only; keep both sides |

Recheck (critic, 2026-10-18, against lib4-cards @ 0b85c963 sections 16-17):
- recheck N1: applied. D-LIB7b-SLOT is 6b only. A merge before #109 is not enough on its own, because MANIFEST rows are written at pin time. So 'PILOT A PIN GO' waits until this card is on main and merged into #109, and #109's prerequisites gain 6b. The text is in merge_prerequisites, 7b-A6 and the risk line.
- recheck N2: applied. 7b-A3 says how the two scratch ids join a real LIB-7 key: a scratch-only `IDS` edit. It also says which sweep reds on the scratch tree are artifacts, so the scratch CI ref is not read as a failure.
- recheck N3: checked, no change. The hook, layers-spec validation, handpairs.mjs lines, twin and PAGEDUP each have one owner here. LIB-6-PM (#181) and LIB-4b merge before this card starts, so build-layers-page.mjs and ht6.mjs are edited on main with no second writer (D-LIB6PM-BRANCH as amended by D-LIB7FIX-BRANCH). golden B's page runtime finds panels by `.zx` and `data-zoom` per card (build-page.mjs:418-480), so a post-build id change does not break opening. Section 16: LIB-8M builds no layers page (lib-8-merge-card.md:291) and renders pairs with renderPair, which this card does not touch.

