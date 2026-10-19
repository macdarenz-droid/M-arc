Card LIB-7-FIX: the LIB-7 loader contract (D-LIB9-HANDPAGE's contract part, lib4-cards section 12 item 10; the per-key handpair budget, 11.1 items 6 and 9; the two Lows of #193's delta review 5974981698; 2026-10-18)

Split (D-LIB7FIX-BRANCH): this card is the part #193 needs to merge. The page hook, the generator's pair-row lines, the runner's HT-6 twin and their proofs (draft F6-F8) are card LIB-7b (lib-7b-card.md), on main after #193 merges.

Sources (every file:line below was opened at these heads; [unverified] marks the rest):
- main 2078913c (train 27);
- #193 claude/lib-7-radial-pairs 55e91e9f;
- #181 claude/lib-6-closeup-renderer 9b8f76e6;
- #191 claude/lib-12-hand-views 0d268a71;
- #232 claude/lib-4b-runner 0867c86f;
- #246 claude/lib-4c-library-ci 68f15560;
- #245 claude/lib-9-lb1 38b436d5;
- #109 claude/lib-8-pilot-a 28853e71;
- lib4-cards.md on claude/sup-lib4-cards 0b85c963. Its lines 1-3104 are identical to 95928e1f; it adds section 16 (LIB-8M) and section 17 (LIB-6-PM, D-LIB-ORDER-2);
- HANDOVER on claude/sup-handover-1445 651a767f;
- plan LIBRARY-HOWTO-ARCHITECTURE.md on claude/howto-options 6550ce28.
Measured by the critic (lib-7-fix-critic.md) on a local merge of 55e91e9 into main, never pushed: R1-R8.

id: LIB-7-FIX
model: claude-opus-5-5 (not mechanical: the contract, the panel markup and words, and the mutation proofs)
mode: auto
title: 'Builder: LIB-7-FIX loader contract on #193'
branch: claude/lib-7-radial-pairs (existing, PR #193, head 55e91e9f7730afc87d8383fe5b3c9eaa7bc29bd4).
- The head was frozen by the panel post (#193 issuecomment-5975538224). D-LIB7FIX-CARRY unfreezes it for this card only.
- The session that built it (session_01GaUBBUdEvc7JYd3caGTHwF) is gone with its account.
- Continue on the same branch with merge commits only. Never rebase, amend or force-push. Run `git pull --no-rebase` before each push. If the branch moves without your push, stop and report.
- Never push to claude/lib-6-closeup-renderer. LIB-6-PM is its only writer until #181 merges (D-LIB6PM-BRANCH, lib4-cards :3483).
- #193's base stays claude/lib-6-closeup-renderer until #181 merges; then the supervisor sets it to main. Never change the base yourself.

Stops (these override every other line in this card):
1. Lane slot (D-LIB-LANE-ACTIVE: lib4-cards :1030-1031, amended by section 13 amendment 21 :1421-1425 and D-LIB6PM-LANE in section 17).
   - LIB-6-PM takes a freed slot before the LIB-7 fixer.
   - This card holds a LIB builder slot.
   - Start only on 'LIB-7-FIX start', sent with the live active count.
   - If told to park, stop at your next local commit and push nothing.
   - Resume only on 'LIB-7-FIX resume'.
2. The approved drawings do not change (D-LIB7FIX-CARRY).
   - The three pins in tests/library/hand-pairs.test.ts stay green, with those lines unedited: :132 `2f9d3b7f…` (10 approved ids), :403 `fcd57af5…` (the LIB-7 sheet) and :404 `5feecaf0…` (the critic sheet). Together they cover all 12 approved ids.
   - These files stay byte-identical to 55e91e9: hands/hand-*.mjs, radial-rules.mjs, checks.mjs, claims.json, claims-extract.mjs, census-scope.json, sheet.mjs, page.mjs, gate.mjs.
   - tools/plates/library/render/closeup/zoom-css.mjs stays byte-identical to 9b8f76e. It is the approved sheet's CSS (page.mjs:3, :9), and no pin covers it.
   - `renderPair(id, opts)`, `pairSpec`, `indexOf`, `INDEX` and `MODULES` keep their signatures and outputs. They have readers:
     - pilot A's sheet uses renderPair(id) (#109 pilot-a/plates.json:171 @ 28853e71);
     - LIB-8M renders LIB-7 pairs once #193 is on main (lib-8-merge-card.md:197 @ 0b85c963);
     - LIB-5 reads the hand-*.mjs fault keys and claims.json (lib-5-card.md:151).
   - If a pin moves or one of these files must change: stop and report. Never re-pin.
3. Golden B and the 8 do not change.
   - tools/plates/layers/** and tools/plates/vendor/** are untouched.
   - LIB-7 A1 (hand-pairs.test.ts describe at :82) and LIB-6's tests/library/closeups.test.ts stay green.
   - tests/howto/hands.test.ts is never edited (11.1 item 1, :611-614).
   - `node tools/plates/generate.mjs --check` is clean. One generated file changes, and only its header line: src/howto/generated/loaders.ts, whose declared inputs include hands/pairs.mjs once that file exists (gen/ids.mjs:121; critic R3). Any other moved file means stop and report.
4. Other cards' files: only the lines this card names:
   - L2-A21's one line (D-LIB7FIX-A21);
   - the one synthetic.mjs line (D-LIB7FIX-SCALE);
   - gate-split.test.ts :55 and one gate-times.json entry (D-LIB7FIX-GATE);
   - one added budgets.test.ts test.
   Anything else in another card's file means stop and report. build-layers-page.mjs, layers-spec.mjs, gen/hands.mjs, gen/handpairs.mjs and the LIB-4b twin are LIB-7b's, not this card's.
5. No new drawing.
   - single_arm_triceps_pushdown and skull_crusher stay gaps (D-LIB7-19a, #193 5974886107; golden-B follow-up 9, HANDOVER :1559).
   - The six LB1 keys are a proposal only (Do 7).
6. Shown words (D-LIB7FIX-WORDS). Every shown word of pairPanel is approved wording.
   - Captions are at most 10 words (golden B copy-lint.mjs:47 `CAPTION_MAX_WORDS = 10`, imported, never copied).
   - A caption comes from the cards' approved wording, else it is the key's label only.
   - No explaining text (the owner's UI copy rule, AGENTS.md).
   - If a word has no approved source: stop and report.

CI manners (D-LIB-CIMANNERS, lib4-cards 12 item 1; the GATE-SPLIT train has merged):
- At most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci]. Gather local commits into the allowed pushes.
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them until it says go. Never cancel, re-run or dispatch a run that is not yours.
- Run any job that may last over 1 hour as a detached process: `setsid nohup <cmd> > <log> 2>&1 &`, then poll its log. This covers the local gate, a full test:tz run and the LIB-7 gate on both browsers. A tool background job stops at about 2 hours, and a stopped or killed run is never evidence.
- Never write to the owner.

base: claude/lib-7-radial-pairs @ 55e91e9. It contains #181 @ 9b8f76e and main 4aa1b2a7 (train 12), and it is 307 commits behind main 2078913c at card time.
- **Merge origin/main first.** The first commit is that merge (merge commit).
  - `git merge-tree --write-tree origin/main 55e91e9` gives one conflict, in scripts/screenshot-gate.mjs: main's guarded blocks end with `await gate.done();`, and LIB-7's block sits unguarded after it.
  - docs/COACHING-DECISIONS.md auto-merges.
  - Resolve the conflict as Do 3 says.
- **That merge is red; never push it alone.**
  - `generate --check` throws a TypeError at main gen/handpairs.mjs:28 (critic R1; the card-time probe gave the same).
  - tests/howto/library-core.test.ts fails in its beforeAll and skips all 39 tests (R2).
  - tests/howto/lib-4a.test.ts A1/A2 are red, from the same TypeError inside syntheticRoot.
  It goes out together with Do 5.
- **Before READY:**
  - while #181 is not merged, merge #181's latest head (LIB-6-PM) with a merge commit;
  - after #181 merges, merge origin/main;
  - re-run F4 and F5 after every such merge.

depends_on:
- LIB-2 and LIB-2b on main: gen/handpairs.mjs (contract :3-4), gen/ids.mjs, tools/plates/library/scale/**.
- LIB-6 #181 with LIB-6-PM: #193's base.
- LIB-4c #246 reads this card's exports: ci/manifest.mjs:69-71 reads HAND_OF_ID and `await inputsFor(key)`, and ci/affected.mjs:144 reads HAND_OF_ID. Read them; never edit them.

build_prerequisites:
- 'LIB-7-FIX start' (Stops 1). At 651a767f the lane is 4 of 4: LIB-4b, LIB-10, LIB-3c and LIB-8M are active, and LIB-4c and LIB-4d are WAITING.
- Posted on #193 by the supervisor before the start (section 12 posting order, :1004):
  - lib4-cards 12 item 10 (:1149-1159);
  - 11.1 item 14 (:661-665);
  - D-LIB6PM-BRANCH (:3483).
  At card time #193's last comment is 5975538224 (2026-10-04).
- The start message quotes these rulings word for word (lib-7-fix-rulings.md): D-LIB7FIX-CARRY, -BRANCH, -KEY, -API, -A21, -GATE, -SCALE, -BUDGET and -WORDS.

merge_prerequisites:
- A fresh Opus review PASS against this card, on the delta 55e91e9..head (first parent).
- Every check green on a head that contains the latest main.
- Checklist slot 6 (plan :763; D-LIB-ORDER-2, lib4-cards :3416-3418):
  - the order is LIB-4b → LIB-4c + #249 → LIB-4d → LIB-5 + sup-lib5-bundle → BOX-CAP → LIB-5 Do 9 → LIB-6 #181 + LIB-6-PM → **LIB-7 #193 + LIB-7-FIX** → LIB-7b (6b, D-LIB7b-SLOT) → LIB-8M #109 (7) → LIB-5v (7a) → LB1 #245 (8);
  - it merges in a supervisor merge train (claude/sup-merge-train-<n>), one merge commit per PR in checklist order. The builder never merges.
- #193's base has been set to main after #181 merged (supervisor).
- D-LIB7FIX-CARRY holds on the exact merge head (F4).
- F6, the per-key budget, is in force (11.1 item 6 :633 and item 9 :644).
- Not prerequisites:
  - the shared-key proof and D-LIB9-HANDPAGE's page work. They are LIB-7b's, before LB1 (D-LIB4-ENTRY, 11.1 item 14 :664; 11.1 item 10 (b) :647). LIB-8M builds no library layers page (lib-8-merge-card.md:291);
  - LIB-12 #191, which merges this head later with its own delta review.

hard card: yes, with a short design note: Do 4, in hands/DESIGN.md §8, posted with your first push. It covers the panel markup and the panel words only. Everything else is ruled.

outcome:
Gap today (main 2078913c; #193 @ 55e91e9):
- **The loader contract.**
  - main's consumer needs `HAND_OF_ID`, `inputsFor(key)` and `pairPanel(key): Promise<string>` (gen/handpairs.mjs:3-4, read at :28 and :48-51).
  - LIB-7 exports INDEX, `renderPair(id)` and `inputsFor(id)` (pairs.mjs:64, :229, :278). It has no HAND_OF_ID and no pairPanel, though its own design promises HAND_OF_ID (hands/DESIGN.md:22).
  - So `generate --check` throws on any head that holds main and LIB-7 (R1). Every train with LIB-7, or with LIB-12 (#191 contains 55e91e9), goes red.
- **A real loader turns two existing tests red** (R3):
  - L2-A21's `keys.length > 0` (library-core.test.ts:411) is red when no shipped row has a key;
  - lib-4a.test.ts A1/A2 are red: syntheticRoot's import of the copy's real pairs.mjs stays in the ESM cache after write-ids replaces that file, so the clones get no pair (synthetic.mjs:21-22, :52-53; write-ids.mjs:50-55, :69; gen/ids.mjs:58).
- **pairZoom keys its HTML by card id** (zoom.mjs:13; page.mjs:18). With a fixed uid, the pair SVGs hold no id and no exercise name (card-time probe).
- **No per-chunk ceiling holds a built handpair chunk.** Only LIB-2 A25's superset How-to total counts it (screenshot-gate.mjs:9228-9251). HT-3b A2 covers HowToSheet and the 8's ht- chunks (:6955-6957), and HT-6 A7's hand ceiling covers the 8 only (lib4-cards :900).
- **The two Lows (5974981698)** ride the pre-merge main merge (5975538224):
  - DESIGN.md:132 says "16 gap ids";
  - claimProblems skips the parked ids, so skull_crusher#c1 goes unchecked.
- **LIB-7's gate block is unguarded,** so it conflicts with main's GATE-SPLIT layout.
After this card:
- **pairs.mjs exports:**
  - `HAND_OF_ID`, `keyIndexOf(index = INDEX)` and `keysOf()`;
  - `inputsFor(x)`, where x is a pair key or a drawn id (D-LIB7FIX-API);
  - `pairPanel(key)` (async; an exercise-neutral `<div class="zx"` panel).
  renderPair, pairSpec, indexOf, INDEX and MODULES are unchanged.
- **HAND_OF_ID** maps `lib_<card id>` → key for every drawn id of any owner. It never maps one of the 8 or a gap.
- **LIB-7's 8 keys** (probe and R4: one fault list and one picture per key, 7 distinct pictures; curl-bar-under and ez-curl-under draw the same picture):
  - curl-dumbbell-under: dumbbell_biceps_curl, alternating_dumbbell_curl, incline_dumbbell_curl;
  - curl-dumbbell-neutral: hammer_curl, cross_body_hammer_curl;
  - curl-bar-under: barbell_curl, cable_curl;
  - ez-curl-angled: ez_bar_curl;
  - ez-curl-under: preacher_curl;
  - ez-curl-over: reverse_curl;
  - rope-push-neutral: rope_triceps_pushdown;
  - d-handle-pull-unstated: single_arm_lat_pulldown.
- **The red tests are fixed without loosening:** L2-A21 by D-LIB7FIX-A21, and lib-4a.test.ts by D-LIB7FIX-SCALE.
- **The rest is in:** the per-key budget, the guarded gate block and both Lows.
- **Unchanged:** the 8, golden B and every approved drawing.

deliverable: commits on #193, #193's body (HANDOFF, F1-F12 evidence, mutation list) and #193 comments: the design note, the six-key proposal, the LIB-12 effect list, and READY. No new PR.
evidence: F1-F12 below.
finish: merged on main in slot 6. You will notice: nothing visible. No library row ships, and the 8 and every approved hand drawing are byte-identical.

design_reference:
- lib4-cards.md @ 0b85c963:
  - 12 item 10 (:1149-1159);
  - 11.1 items 1 (:611-614), 6 (:629-633), 9 (:641-644), 10(b) (:647), 14 (:661-665) and 16(a)(b) (:674-675);
  - 12 item 5 (b) (:1079-1089);
  - section 17: D-LIB-ORDER-2 (:3416-3426), D-LIB6PM-BRANCH (:3483-3487), D-LIB6PM-LANE.
- Plan @ 6550ce28: 2.3 (:166-182), section 7 rows 5-8 (:762-765).
- hands/DESIGN.md @ 55e91e9: §1 (:8-42), §3 (:82-105), §4 (:107-157).
- #193 comments: 5974886107, 5974933886, 5974981698 and 5975538224.
- The critic's file lib-7-fix-critic.md.

connectivity: none. No stored or sent user data, no storage key, no network call, no dependency.

read_first:
- AGENTS.md (main); .claude/skills/builder/SKILL.md and its gotchas; this card; the rulings; #193's body and the comments above.
- At 55e91e9:
  - pairs.mjs :35-61, :63-64, :67-88, :229-261, :263-283;
  - zoom.mjs :8-21; page.mjs :1-28;
  - DESIGN.md :22, :132;
  - tests/library/hand-pairs.test.ts :55, :66, :82, :108-111, :127-135, :393-404, :475-524.
- On main:
  - gen/handpairs.mjs (all 67 lines);
  - gen/ids.mjs :20, :37-41, :52-58, :119-127;
  - gen/hands.mjs :131 handCeiling;
  - tools/plates/generate.mjs :5-11, :47-55;
  - tools/plates/lib/inputs.mjs :14-31;
  - tools/plates/library/scale/synthetic.mjs :18-24, :50-54; scale/write-ids.mjs :30-69;
  - tests/howto/library-core.test.ts :398-441; tests/howto/lib-4a.test.ts; tests/howto/budgets.test.ts :42-58;
  - tests/howto/fixtures/handpairs/pairs.mjs :3-6;
  - tools/plates/layers/artifact/howto-layers.mjs :160-172; tools/plates/layers/artifact/copy-lint.mjs :47, :209;
  - the hand zooms in tools/plates/layers/exercises/*.howto.mjs: chip 'Hand', heading 'Hand: right and wrong', seen in lat_pulldown, dumbbell_lateral_raise and machine_chest_press;
  - scripts/screenshot-gate.mjs :6940-6958, :9228-9253; tests/gate-split.test.ts :55; scripts/gate-times.json.
- At #246 68f15560: ci/manifest.mjs :1-14, :27, :55-73; ci/affected.mjs :140-146.
- At #191 0d268a7: tests/library/hand-views.test.ts :205-220; hands/hand-palm-flat.mjs :26-27.
- At #245 38b436d5: tools/plates/library/lb1/DESIGN.md :46-65.

write_scope:
- tools/plates/library/hands/pairs.mjs: the contract (Do 5). The Stops 2 functions keep their behaviour.
- New: tools/plates/library/hands/panel.mjs, statically imported by pairs.mjs, so `importClosure` (pairs.mjs:264-273) and LIB-4c's BUILDERS closure (ci/manifest.mjs:27) cover it.
- New: tools/plates/library/hands/panel-words.json: the panel's words per key, each with its approved source (D-LIB7FIX-WORDS).
- tools/plates/library/hands/zoom.mjs: only an added key-based panel path. `pairZoom(id, …)` output stays byte-identical; it feeds H7 :494-502 and the gate.
- tools/plates/library/hands/DESIGN.md: §1's loader text, the :132 Low and a new §8.
- tests/library/hand-pairs.test.ts: only the Low 2 claimProblems line. Every other line is unedited, including :514-524, which D-LIB7FIX-API keeps working.
- New: tests/library/lib7-fix.test.ts and tests/library/fixtures/lib7fix/** (including wrap-pairs.mjs, F1).
- scripts/screenshot-gate.mjs: LIB-7's own block only: its GATE-SPLIT guard and F6 (c).
- tests/gate-split.test.ts: the one line at :55 (D-LIB7FIX-GATE).
- scripts/gate-times.json: one added "LIB-7" entry (D-LIB7FIX-GATE).
- tests/howto/library-core.test.ts: L2-A21's first test, its title and :411 only (D-LIB7FIX-A21).
- tools/plates/library/scale/synthetic.mjs: one line after :22, in a block marked LIB-7-FIX (D-LIB7FIX-SCALE).
- tests/howto/budgets.test.ts: one added test named LIB-7-FIX (F6 b).
- src/howto/generated/loaders.ts: its header line, written by `node tools/plates/generate.mjs` and never by hand.
- docs/COACHING-DECISIONS.md: appended D-LIB7-FIX-* entries only.
- #193's body and title.

reserved_paths (out of scope; never edit):
- The LIB-7 files in Stops 2.
- Every LIB-12 file (hand-<LIB-12 key>.mjs, view-*.mjs, gate-lib12.mjs, lib12-claims.json, tests/library/hand-views.test.ts).
- LIB-7b's paths: tools/plates/library/build-layers-page.mjs, tools/plates/library/layers-spec.mjs, tools/plates/gen/hands.mjs, tools/plates/gen/handpairs.mjs, tools/plates/library/fidelity/**.
- tools/plates/layers/**, tools/plates/vendor/**, tools/plates/library/render/** and tools/plates/library/test/** (LIB-6).
- tools/plates/gen/ids.mjs, tools/plates/generate.mjs, tools/plates/lib/**.
- tools/plates/library/registry.mjs, candidate.mjs, qa/**.
- ci/** and MANIFEST.json (LIB-4c).
- scale/** except the SCALE line; lb1/** (LIB-9a); pilot-a/** (LIB-8); every LIB-5 path.
- tests/howto/hands.test.ts; tests/howto/library-rows.test.ts; tests/howto/zooms.test.ts.
- Every other line of library-core.test.ts, budgets.test.ts and lib-4a.test.ts.
- tests/howto/budgets.json: no entry, because no key ships here.
- src/** apart from loaders.ts's header (ZoomHost.tsx included); src/ui/styles.css; src/app/App.tsx; src/main.tsx.
- Shared add-only files (AGENTS.md :73): scripts/screenshot-gate.mjs and tests/theme.test.ts. Never edit, move or delete another task's block; when merging main, keep both sides.
- Supervisor-owned: .github/** (:70); package.json and package-lock.json (:71), so no new dependency.
- Never touched: the saved data shape (:72); watch-agent paths; escobar-worker/**.
- AGENTS.md, CLAUDE.md, docs/supervisor/**, the plan docs.

Do:
1. On 'LIB-7-FIX start':
   - read this card, the rulings and #193;
   - check `git ls-remote origin refs/heads/claude/lib-7-radial-pairs` gives 55e91e9f7730afc87d8383fe5b3c9eaa7bc29bd4; if not, stop and report;
   - subscribe to #193's activity.
2. Baseline on 55e91e9, before any edit, recorded in the PR:
   - `npm ci`; `npm run check` (5974933886 reports 2,704 tests);
   - the three pins green;
   - `node tools/plates/library/hands/gate.mjs /opt/pw-browsers/chromium` gives 22 pages.
3. Merge origin/main (merge commit). Resolve scripts/screenshot-gate.mjs:
   - take main's side whole;
   - put LIB-7's block, body unchanged, inside `if (gate.runs('LIB-7')) { … }` just before `await gate.done();`;
   - tests/gate-split.test.ts:55: 103 → 104, still an exact toBe, with "+ LIB-7" added to its comment;
   - scripts/gate-times.json: add "LIB-7", measured as 11.1 item 16 (b) says.
   On this merge, record F1's "fails before": the generate --check TypeError, and library-core.test.ts failing in its beforeAll with the same TypeError. Do not push.
4. Design note: DESIGN.md §8, "Loader contract and pair panels (LIB-7-FIX)":
   - (a) the keys as built (D-LIB7FIX-KEY);
   - (b) pairPanel's markup:
     - the zx wrapper as howto-layers.mjs:167-171 builds it, with `data-zoom="hand"` (ZoomHost.tsx:63 finds the panel by it);
     - every id is `hp-<key>-…`, and the hx scope class is keyed by the key;
     - no chromeId, lib id, card id or exercise name;
     - LIB-7b may change only the wrapper bytes, under its own review, while F3 and F4 still hold;
   - (c) the words. For each key: the heading, and the Right and Wrong caption and pager label per fault, each with its approved source (D-LIB7FIX-WORDS). The heading is golden B's approved hand-zoom heading 'Hand: right and wrong'. Captions follow the rule in Stops 6. Pager labels are the D-LIB7-10 fault labels. For every word the supervisor must see first, post a sheet of the 8 panels at 390 px in Silent Black and Paper on #193 [no key ships before that look].
   After two approaches with no new evidence, stop and report.
5. The contract:
   - (i) In pairs.mjs add HAND_OF_ID, `keyIndexOf(index)`, `keysOf()`, `inputsFor(x)` (key or drawn id) and `pairPanel(key)`, through panel.mjs. The loader throws when:
     - two triples give one key string;
     - ids on one key have different ordered fault lists;
     - a key is outside `/^[a-z0-9-]+$/`;
     - `k1 + '-'` is a prefix of another key k2;
     - a key string equals a drawn id;
     - `lib_<id>` is not in src/data/exercises.json.
     Commit this locally, alone. On that commit run library-core.test.ts and lib-4a.test.ts, and record the "before" for F7 ('expected 0 to be greater than 0' at :411) and for F8 (A1/A2 'no hand pair'). Never push it alone.
   - (ii) Edit L2-A21 (D-LIB7FIX-A21) and add the synthetic.mjs line (D-LIB7FIX-SCALE).
   - (iii) Fix Low 1 (DESIGN.md:132 → 18) and Low 2 (claimProblems also over `redrawPush(clone())`).
   - (iv) Write panel-words.json.
   - (v) Regenerate (`node tools/plates/generate.mjs`). Only loaders.ts's header may move (Stops 3).
   - (vi) Write the tests for F1-F5 and F7-F10.
   Then make the first push (Do 3 + Do 4 + Do 5) after the CI-manners check, and post the note on #193.
6. The per-key budget (F6).
7. Post the six-key proposal on #193 for the supervisor's ruling. The six are chin_up, hanging_knee_raise, assisted_pull_up, inverted_row, close_grip_pulldown and underhand_lat_pulldown (lb1/DESIGN.md:63-65 @ 38b436d5). For each card give:
   - the proposed module KEY, variant, orientation, ordered fault list and key string;
   - the claim refs for orientation, contact and each fault (`file#cid` at the research head the supervisor names), or "no claim", which makes it a gap (D-LIB7-12);
   - which existing module could carry it. None draws a bar or V-handle pull today: d-handle/pull is the only pull variant (hand-d-handle.mjs:17).
   - Note that LIB-9a's note names the key "d-handle/pull (LIB-7 @ 55e91e9)" (lb1/DESIGN.md:54); its new string is d-handle-pull-unstated.
   - Note that a non-'none' row with no pair cannot ship (gen/hands.mjs:192).
   No module file, drawing or test is made.
8. The LIB-12 effect:
   - in a local scratch worktree that is never pushed, merge your head into #191's head and run its tests;
   - post every red line on #193 for the supervisor to relay. Under D-LIB7FIX-API, hand-views.test.ts:211 and :217 stay green;
   - never edit a LIB-12 file.
9. Before READY:
    - merge #181's head or main as the base section says;
    - re-run F4 and F5 on that head;
    - run F12 and the collision table on that exact head;
    - re-read your diff against write_scope;
    - update #193's body and post "LIB-7-FIX READY: <sha>".

Acceptance (each with evidence and the mutations that must turn red; list each red line in the PR):
- **F1 Loader contract.** tests/library/lib7-fix.test.ts, plus `generate --check` clean on the merged head.
  - `Object.keys(HAND_OF_ID)` equals `lib_` + every drawn id, of any owner (survives LIB-12's merge). The LIB-7 subset is swept at 12 by OWNER.
  - No key of HAND_OF_ID is in plates.json, and none is a gap. Every value is in `keysOf()` and matches `/^[a-z0-9-]+$/`.
  - For each key k and each id on it: `inputsFor(k)` and `inputsFor(id)` are non-empty and equal, hold the key's module file and no other key file.
  - `await pairPanel(k)` starts with `<div class="zx"`.
  - With the real loader and main's registry, `pairsOf` gives `{ pairOf: {}, keys: [] }`.
  - Fresh-importing pairs.mjs at the repo root does not throw (ci/affected.mjs:144 swallows import errors).
  - The test-only loader tests/library/fixtures/lib7fix/wrap-pairs.mjs re-exports LIB-7's `inputsFor` and `pairPanel` with `HAND_OF_ID = { lib_pull_up: 'curl-dumbbell-under' }` (library-core's FIX technique, :398-436). On it, `hp.outputs({ pairsFile })` gives one handpair output whose text is `pairText('curl-dumbbell-under', await pairPanel(...))`.
  - Before: the throw from Do 3. Mutations, each red:
    - HAND_OF_ID's export deleted (handpairs.mjs:28);
    - skull_crusher mapped;
    - lib_dumbbell_lateral_raise mapped;
    - through the wrapper: `inputsFor` returns [] (:49), pairPanel returns `<section` (:51), a key `Curl_x` (:30, and lib7-fix's own pattern check).
- **F2 Key identity (D-LIB7FIX-KEY).**
  - 8 keys over 12 LIB-7 ids (sweep n = 8), 7 distinct pictures (`tiles()`).
  - Per key, one ordered fault list, and the panel built through each of its ids is byte-identical.
  - Mutations run in memory on `keyIndexOf(P.indexOf(withMods(…)))`, as A2 does (hand-pairs.test.ts:55, :110). Each must throw, naming both:
    - hammer_curl's faults reversed;
    - a fixture module whose triple repeats an existing string;
    - a key that dash-prefixes another;
    - a key equal to a drawn id.
- **F3 Exercise-neutral, approved words.**
  - pairPanel(k) holds no chromeId, lib id, card id (underscored or dashed) or exercise name (src/data/exercises.json) of any row.
  - Every id starts with `hp-<k>-` and is unique within the panel. `data-zoom="hand"`.
  - Every shown word is either in the approved SVG or in panel-words.json under k, with its source.
  - Each caption passes golden B's caption limit (CAPTION_MAX_WORDS imported from copy-lint.mjs:47) and lintHowto's banned words.
  - The heading is 'Hand: right and wrong'.
  - Mutations, each red: a uid from an id (zoom.mjs:13); an 11-word caption; a caption with no source; a heading taken from a card.
- **F4 Approvals carry (D-LIB7FIX-CARRY).**
  - The three pin lines are unedited and green.
  - `git diff 55e91e9 HEAD --` over the Stops 2 files is empty. zoom-css.mjs equals 9b8f76e's.
  - For each of the 12 approved ids and each fault, the panel's SVG equals `renderPair(id, { fault }).svg` with every `hp-<id dashed>-<fault>` replaced by the panel's uid U (R5: 22 of 22 pages).
  - Mutations, each red: the existing pin mutations; a panel drawn with another orientation.
- **F5 Golden B and the 8.**
  - LIB-7 A1 and LIB-6's closeups.test.ts are green.
  - generate --check is clean, with only loaders.ts's header moved.
  - hands.test.ts is unedited and green.
  - A1's own mutations stay red.
- **F6 Per-key budget (D-LIB7FIX-BUDGET).**
  - (a) For every key, `pairText(k, await pairPanel(k))` is within `handCeiling('pull-up')` (gen/hands.mjs:131: 92,917 B raw and 26,286 B gz). R7 measured 23.6-49.2 KB raw and 7.0-12.8 KB gz from pairZoom pages.
  - (b) budgets.test.ts LIB-7-FIX: every key a shipped row uses has a `handpair-<key>-*.js` entry, none is stale, and each is within the cap. Proven red on a fixture shipped list.
  - (c) LIB-7's gate block: the built `handpair-*.js` chunks equal the shipped keys, and each is within its entry and the cap. A missing entry fails. A self-check with an oversize fixture asset is red.
  - At this head no key ships, so (b) and (c) require 0 entries and print that count.
  - Mutations, each red: a panel padded past the cap; an entry removed with a fixture key shipped; the gate self-check asset.
- **F7 L2-A21 (D-LIB7FIX-A21).**
  - Red before on the local contract-only commit (:411); green after.
  - The fixture test (:420-436) keeps exact keys ['bar-grip', 'd-handle'].
  - The covering proof in lib7-fix.test.ts: `missingChunks([{ id: 'lib_x', chromeId: 'x', slug: 'x' }], n => n !== 'hand-x', {}, { lib_x: 'curl' }, () => true)` throws /lib_x: no .*hand pair/, and with pairOf `{ x: 'k' }` it does not throw.
  - Mutation: a temp copy of gen/ids.mjs in os.tmpdir() (never under tools/plates/, so no plugin glob or core hash sees it), its relative imports rewritten to the repo files' file URLs and its hand clause (:58) removed. The first call no longer throws → red. The copy is deleted in `finally`.
- **F8 Scale trees (D-LIB7FIX-SCALE).**
  - lib-4a.test.ts is red before (A1/A2 'no hand pair', on the local contract-only commit) and 10/10 green after (R8).
  - Mutation: the line removed → A1/A2 red.
- **F9 Guarded gate block.**
  - The block passes under `gate.runs('LIB-7')` on Chromium 141 and Chrome 153: 22 pages.
  - gate-split.test.ts is 29/29 at 104 (R3). gate-times.json has its entry.
  - `git diff origin/main -- scripts/screenshot-gate.mjs` shows LIB-7's block only.
  - Mutations, each red: 0 pages (the existing self-check); the guard removed (gate-split.test).
- **F10 The two Lows.**
  - DESIGN.md §4 A3 says 18 gap ids.
  - claimProblems also runs over `redrawPush(clone())`.
  - Mutation: skull_crusher#c1's phrase broken in memory → red.
- **F11 LIB-12 effect.** The Do 8 post: the scratch merge sha and every red line.
- **F12 No regression, on the READY head:**
  - `npm run check`;
  - `npm run test:tz` (both zones);
  - `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, detached;
  - the LIB-7 gate on both browsers;
  - the diff against 55e91e9 touches only write_scope paths, apart from the merges.
Nothing is loosened:
- no tolerance, ceiling, timeout, pin or count is relaxed;
- no test is cut;
- each changed check is proven by a mutation that turns it red.

verification: #193's body maps F1-F12 to a test or run, with commands and outputs, and lists every mutation with its red line. Evidence counts only for the exact head it ran on. Before each review hand-off and on the READY head, re-run F4, F5 and the collision table there.

risk_and_recovery:
- **Any other test that goes red only because a real loader exists:** stop and report. Never edit it. Only L2-A21 and lib-4a A1/A2 are ruled (R3 found no other).
- **#181's later heads (LIB-6-PM) change render/closeups.mjs.** sheet.mjs:24 calls `closeupApi(mod, CLOSEUP_OPTIONS[id])`, and its output enters pins :403-404. After each #181 merge, re-run F4. A moved pin: stop.
- **L0-lib.** After LIB-8M pins pilot A, MANIFEST.json lists hands/pairs.mjs and its static closure (panel.mjs included) for every pinned row (ci/manifest.mjs:27, :60-62). Its entries change only in a pin's own commit (:14; lib4-cards :1086). This card merges before LIB-8M (D-LIB-ORDER-2), so its bytes are pinned as they are. Any later edit to pairs.mjs or panel.mjs needs a pin replacement. Tell the supervisor before any such edit.
- **pairs.mjs bytes move loaders.ts's header** (gen/ids.mjs:121). When a main merge conflicts only on that header line, regenerate; never hand-edit.
- **LIB-12 merges this head later** (Do 8). Under D-LIB7FIX-API its tests stay unedited.
- **Timeouts.** Give new describes the timeouts hand-pairs.test.ts uses (60_000 at :135). Never raise an existing one. If a run goes over, report it.
- **Two failed tries of one approach:** stop and report.

return:
- #193 head sha and each merge commit's sha;
- the Do 3 and Do 5 (i) before evidence, and every F1-F10 after-run;
- the design-note comment id and the panel sheet;
- HAND_OF_ID and the keys as built, with the F2 counts;
- F4: the three pins and the 22 SVG equalities;
- every mutation with its red line;
- the loaders.ts header line, before and after;
- the six-key proposal comment id; the LIB-12 effect comment id;
- the gate-times.json value and how it was measured;
- check, test:tz, gate and LIB-7 gate output on the final head.

Resume rule: when you are WAITING or parked, you resume only on the supervisor's exact words 'LIB-7-FIX resume', sent to your session or posted on #193. A prerequisite post alone is not a resume.

Collision check (card time; each open PR head against its merge base with main 2078913c; exact files):
| Path in write_scope | Open PRs that touch it | Effect |
|---|---|---|
| tools/plates/library/hands/**, tests/library/hand-pairs.test.ts | #191 LIB-12 (contains 55e91e9; adds its modules); #257 LIB-4c scratch (its own pairs.mjs; never merges) | LIB-12 merges this head (Do 8). #257: none |
| scripts/screenshot-gate.mjs | #191 (the same unguarded LIB-7 block, plus LIB-12's) | LIB-12 inherits the guarded LIB-7 block and guards its own |
| tests/gate-split.test.ts :55, scripts/gate-times.json | none | each later guarded block re-counts :55 when it merges |
| tests/howto/library-core.test.ts (L2-A21 :406-418) | #261 LIB-4d (hunks :1-7, :69-89, :347-358 only) | no overlap. LIB-4d merges first (D-LIB-ORDER-2, 3d), and the lines shift by +8 |
| tools/plates/library/scale/synthetic.mjs | none | none |
| tests/howto/budgets.test.ts | none (#257 changes budgets.json only) | none |
| docs/COACHING-DECISIONS.md | most open PRs | append-only; keep both sides |
Merge-tree at card time:
- 55e91e9 with main conflicts in scripts/screenshot-gate.mjs only;
- 9b8f76e with main is clean;
- 0d268a7 with main conflicts in scripts/screenshot-gate.mjs only.

---

Critic fixes applied (lib-7-fix-critic.md; 16 of 16; the supervisor accepted every finding and verdict):
- **1 (High):** D-LIB7FIX-SCALE added and ruled now. The synthetic.mjs line is in write_scope; F8; the risk line is replaced.
- **2 (High):** D-LIB7FIX-A21 uses the critic's text: HAND_OF_ID non-empty, plus the missingChunks covering proof and its mutation (F7). "stricter" and "independent count" are removed.
- **3:** F1's before is on the Do 3 merge (the throw, and library-core failing in beforeAll). F7's and F8's befores are on the local contract-only commit (Do 5 (i)).
- **4:** Header churn re-measured (hands.mjs 27, handpairs/layers-spec/build-layers-page 0). This card edits none of them. Stops 3 allows loaders.ts's header only. The handpairs.mjs placement is in LIB-7b's SCOPE.
- **5:** The pair key comes from the layers config. Moved to LIB-7b (D-LIB7b-SCOPE (b)).
- **6:** Panel words: D-LIB7FIX-WORDS (the supervisor's caption rule), panel-words.json, Do 4 (c), F3, Stops 6.
- **7:** F1's handpairs mutations run through wrap-pairs.mjs.
- **8:** Split. LIB-7-FIX is the contract, A21, SCALE, gate, Lows and budget. The page hook, generator lines, twin and draft F6-F8 are LIB-7b. Done with D-LIB7FIX-BRANCH as one text with D-LIB6PM-BRANCH.
- **9:** PAGEDUP covers HT7-A2 and the app-document duplicate-id checks. Moved to LIB-7b.
- **10:** D-LIB7FIX-API is the dual `inputsFor`, with an id/key disjointness throw. LIB-7's :514-524 and LIB-12's :211 and :217 stay unedited.
- **11:** CARRY compares against the pinned default render with the uid swapped. zoom-css.mjs is in the byte-identical list.
- **12:** LIB-6-PM collisions: none in files under the split (build-layers-page.mjs is LIB-7b's). After each #181 merge, F4 is re-run (risk line). The LIB-6-PM card's PM-A1 line and its rulings typo are for that card (supervisor).
- **13:** References refreshed: lib4-cards 0b85c963, #109 28853e71 (plates.json:171), lane at 651a767f, LIB-4d before LIB-7 under D-LIB-ORDER-2.
- **14:** `keyIndexOf(index)` added. F2's mutations run in memory.
- **15:** F1 checks `lib_` + every drawn id (any owner); the LIB-7 subset is swept at 12.
- **16:** The dash-prefix throw added (Do 5 (i), F2).
- Also new: the L0-lib risk line. Any edit to pairs.mjs's closure after LIB-8M's pin needs a pin replacement (ci/manifest.mjs:14, :27, :60-62). This is why LIB-7b's slot is 6b, before LIB-8M, and why pilot A's pin waits for LIB-7b (D-LIB7b-SLOT).

Recheck (critic, 2026-10-18, against lib4-cards @ 0b85c963 sections 16-17):
- recheck N1: applied. F7's mutation (and D-LIB7FIX-A21's) was wrong in the critic's own text: deleting `&& !pairOf[c]` makes missingChunks throw more, so the first call still throws. The mutation is now "the hand clause (gen/ids.mjs:58) removed in a temp copy in os.tmpdir() with its imports re-pointed". The temp copy stays out of tools/plates/, because the plugin glob (lib/inputs.mjs:17) and the core hash (:15) read those folders.
- recheck N2: applied. merge_prerequisites names LIB-7b at 6b as ruled, not as proposed; the L0-lib line says pilot A's pin waits for LIB-7b.
- recheck N3: checked, no change. Every finding (1-16) is fixed as meant. Split: each moved item has one owner (LIB-7b: hook, config key, handpairs.mjs lines, twin, shared-key proof, PAGEDUP). Each kept item stays here (contract, A21, SCALE, gate, Lows, budget, words, six-key proposal, LIB-12 effect). LIB-7b's 7b-A5 re-runs F3/F4; it does not redo them. D-LIB6PM-BRANCH's "may edit build-layers-page.mjs there" is amended by D-LIB7FIX-BRANCH; D-LIB6PM-LANE matches Stops 1.
- recheck N4: open, for the supervisor (not this card's file). Finding 12's early check is not in lib-6-pm-card.md @ 0b85c963: run tests/library/hand-pairs.test.ts on a local merge of LIB-6-PM's head into #193. This card's re-run of F4 after each #181 merge still catches a moved pin, only later.

