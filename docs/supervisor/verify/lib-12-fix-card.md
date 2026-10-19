Card LIB-12-FIX: LIB-12's pre-merge work on #191 (the LIB-12 EFFECT of #193 6257189689; D-LIB7FIX-PERKEY "Interactions", lib4-cards :3897-3899; D-LIB7FIX-WORDS :3578-3585; 11.1 item 16 (a)(b) :674-675; the section 19 supervisor note :3917; D-LIBHANDS-COUNT, #193 6257376224 as amended by 6257562588; rulings D-LIB12FIX-* in lib-12-fix-rulings.md; 2026-10-19)

Sources (every file:line below was opened at these heads; [unverified] marks the rest):
- #191 claude/lib-12-hand-views 0d268a71 (live at card time, `git ls-remote`);
- #193 claude/lib-7-radial-pairs da65b13a (live at card time). The PERKEY head e8614950 named in 6257189689 is not on origin at card time, so every PERKEY line is cited from lib4-cards section 19, not from code [unverified in code];
- main f125edab (train 29: LIB-5 #244, sup-lib5-bundle, BOX-CAP #260; its tree equals claude/sup-merge-train-29 83075956, where the LIB-5 lines below were opened); main d9dbd067 (train 28) for ci/manifest.mjs, gen/ids.mjs and gen/hands.mjs, unchanged by train 29;
- #109 claude/lib-8-pilot-a 774becf9 (plates.json :160 and :171-193 byte-equal to 3b2902d1; no `[golden update]` commit); #245 38b436d5;
- lib4-cards.md, lib-7-fix-card.md, lib-7b-card.md, lib-7c-card.md, lib-8-merge-card.md and HANDOVER.md on claude/sup-lib4-cards 39c71b01;
- plan LIBRARY-HOWTO-ARCHITECTURE.md on claude/howto-options 6550ce28;
- #191 comments (21) and #193 comments up to 6257562588.
Measured on local scratch trees, never pushed (card writer M1-M5; critic K1-K3, lib-12-fix-critic.md):
- M1: the 20 LIB-12 `renderPair(id, { fault }).svg` are identical at 0d268a71, at 06519f9 (the head pilot A's LIB-12 evidence PNGs name, #109 plates.json `handsNote`) and on 0d268a71 + da65b13a: sha256 over the newline-joined per-SVG sha256s, sorted by id then fault, `0bc3ba3d2ef53820b72812a848fb9a8688b432025189e789295ed2cfd0e5fee0` (critic reproduced).
- M2: `git merge-tree`: main f125edab + 0d268a71 conflicts in scripts/screenshot-gate.mjs only; f125edab + da65b13a clean; da65b13a + 0d268a71 clean; (train 29 + da65b13a) + 0d268a71 clean.
- M3: LIB-7-FIX F3's neutral and word checks on LIB-12's 5 keys, with label-only words in memory: 0 problems. Panel bytes 5,498-37,241 (cap 92,917 raw).
- M4: LIB-5's family reader over the 13 hand modules of (train 29 + da65b13a + 0d268a71): LIB-7 5 modules / 10 fault entries, LIB-12 8 modules / 6, no label conflict.
- M5: `npx vitest run` on that tree: 28 red, 3299 passed. 20 from the unguarded LIB-12 block (gate-split.test.ts 11, ci-verdict.test.ts 3, tests/howto/library-fidelity.test.ts 6: "twins: the gate does not parse: E1: line 9406: a top-level BlockStatement without a guard"); lib7-fix.test.ts 5 (no LIB-12 words; da65b13a is pre-PERKEY); library-lint.test.ts 3 (D-LIBHANDS-COUNT; red on train 29 + da65b13a alone too).
- K1-K2 (critic): with D-LIBHANDS-COUNT's three lines raised, :308 stays red; with the five lines raised, library-lint.test.ts is 22/22 on that tree.

id: LIB-12-FIX
model: claude-opus-5-5 (not mechanical: approved wording with sources, a carry proof, a gate merge, a critic fix round and mutation proofs)
mode: auto
title: 'Builder: LIB-12-FIX pre-merge work on #191'
branch: claude/lib-12-hand-views (existing, PR #191, head 0d268a71d68153561b4da629da2d30f62a518002, base main).
- The head was frozen after DELTA REVIEW LIB-12 @ 0d268a7: PASS (#191 5976224674; HANDOVER :1047). This card unfreezes it for LIB-12-FIX only.
- The session that built it (session_01PsmZzeKjrgwWHjNntDBpMD, HANDOVER :1181) is gone.
- Continue on the same branch with merge commits only. Never rebase, amend or force-push. Run `git pull --no-rebase` before each push. If the branch moves without your push, stop and report.
- Never push to claude/lib-7-radial-pairs, claude/lib-6-closeup-renderer, claude/lib-8-pilot-a or any LIB-7b / LIB-7c branch.

Stops (these override every other line in this card):
1. Lane slot (D-LIB-LANE-ACTIVE, lib4-cards :1030-1031 as amended; D-LIB12FIX-SLOT's lane line). This card holds a LIB builder slot, and it takes the next free one after PERKEY lands on #193, ahead of LIB-7c. Start only on 'LIB-12-FIX start', sent with the live active count. If told to park, stop at your next local commit and push nothing. Resume only on 'LIB-12-FIX resume'.
2. LIB-12's reviewed pictures do not change (D-LIB12FIX-CARRY).
   - The 20 LIB-12 pair SVGs, `renderPair(id, { fault }).svg`, stay byte-identical to 0d268a71 (M1).
   - These 15 LIB-12 files stay byte-identical to 0d268a71: hands/hand-ab-wheel.mjs, hand-ball-contact.mjs, hand-battle-rope.mjs, hand-cupped.mjs, hand-dip-bar.mjs, hand-front-rack.mjs, hand-implement.mjs, hand-palm-flat.mjs; view-ball.mjs, view-common.mjs, view-cupped.mjs, view-front-rack.mjs, view-palm-flat.mjs; lib12-claims.json; gate-lib12.mjs.
   - LIB-12's gate block keeps its body byte-identical; only its guard line is added (Do 6).
   - tests/library/hand-views.test.ts: only the Low 1 lines (Do 8). :211 and :217 stay unedited (D-LIB7FIX-API, lib4-cards :3536).
   - The one exception is the critic fix round (Do 12): only what the supervisor's re-base ruling names, on the head it names.
   - Otherwise, if a render moves or one of these files must change: stop and report. Never re-pin.
3. LIB-7's files and approvals do not change (D-LIB7FIX-CARRY :3497-3505, as kept by PERKEY PK5).
   - Every file #193 owns stays as #193's merged head has it, apart from one line of tests/library/lib7-fix.test.ts (Do 5).
   - The pins at tests/library/hand-pairs.test.ts :132, :403 and :404 stay green and unedited, and lib7-fix.test.ts's FROZEN sha256s (:202-217 at da65b13a) match.
   - hands/pairs.mjs, panel.mjs, zoom.mjs, sheet.mjs, checks.mjs, words/chrome.json and LIB-7's words files are never edited. A key module never imports pairs.mjs (PERKEY decision 2, :3772-3775).
   - If a LIB-7 test or pin goes red for any reason other than the reds the base section lists: stop and report. Never edit it.
4. Golden B and the 8 do not change. tools/plates/layers/** and tools/plates/vendor/** untouched; tests/howto/hands.test.ts never edited; `node tools/plates/generate.mjs --check` clean. This card's own commits move no generated file: loaders.ts's declared inputs are the registry inputs, LAYERS and hands/pairs.mjs only (gen/ids.mjs:121, :127), and this card edits none of them. A merge may move loaders.ts's header line; then regenerate, never hand-edit.
5. Other cards' files: only the lines this card names:
   - lib7-fix.test.ts: the one exact key-count line (Do 5);
   - scripts/screenshot-gate.mjs: LIB-12's own block, its guard (Do 6);
   - tests/gate-split.test.ts :55 and one scripts/gate-times.json entry (Do 6);
   - tests/howto/library-lint.test.ts: :241, :302, :305, :307 and :308 only (line numbers at f125edab), as D-LIBHANDS-COUNT rules (Do 7).
   Anything else red in another card's file means stop and report.
6. Shown words (D-LIB12FIX-WORDS). Every shown word of `pairPanel(<LIB-12 key>)` is approved wording with its source: the heading 'Hand: right and wrong', and per fault the key's own labels as drawn in its reviewed SVG. Captions at most CAPTION_MAX_WORDS (golden B copy-lint.mjs:47, imported, never copied). No explaining text (AGENTS.md UI copy rule). If a word has no source: stop and report.
7. No new drawing, no new key, no new id. The nine LIB-12 gaps stay gaps (hand-views.test.ts:14-23), unless the critic round moves a failing key's ids to GAPS (Do 12). The battle_ropes camera question is recorded and deferred (D-LIB12FIX-ROPE, Do 9); it is not redrawn here.
8. A library pin first. If any library pin exists on main or on #109 before this card merges (tools/plates/library/MANIFEST.json gains a row, or a `[golden update]` commit lands on #109): stop and report. mountain_climbers is a pinned pilot A row (#109 plates.json:160; not on the held list, lib-8-merge-card.md:124), and keying it adds `inputsFor('palm-flat-floor-over')` to its MANIFEST set (ci/manifest.mjs:69-72; PERKEY's exception, lib4-cards :3764).

CI manners (D-LIB-CIMANNERS, lib4-cards 12 item 1):
- At most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci]. Gather local commits into the allowed pushes.
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them until it says go. Never cancel, re-run or dispatch a run that is not yours.
- Run any job that may last over 1 hour as a detached process: `setsid nohup <cmd> > <log> 2>&1 &`, then poll its log. This covers the full local gate, a full test:tz run, the LIB-12 gate and the LIB-7 gate on both browsers. A tool background job stops at about 2 hours, and a stopped or killed run is never evidence.
- Never write to the owner.

base: claude/lib-12-hand-views @ 0d268a71. It contains #193 @ 55e91e9 and main 4aa1b2a (train 12), and is 312 commits behind #193 da65b13a and over 420 behind main at card time.
- **First merge: #193's PERKEY head** (merge commit), once LIB-7-FIX has pushed it (its post on #193 names the sha). Never merge da65b13a: it still has panel-words.json, which PERKEY removes (lib4-cards :3797), so LIB-12's words would be written twice.
  - M2: da65b13a + 0d268a71 merges clean, and git places LIB-12's unguarded block just before LIB-7's guarded one. Expect the same on the PERKEY head [unverified: e8614950 not on origin].
  - That merge is red; never push it alone. Its known reds:
    - 6257189689's 22: lib7-fix.test.ts 9 (no words files; :69's exact 8), gate-split.test.ts 11 and ci-verdict.test.ts 3 (the unguarded block);
    - with main d9dbd067 or later in: tests/howto/library-fidelity.test.ts 6 (LIB-4b's twins cannot parse the unguarded gate; M5);
    - with LIB-5 (main f125edab) in: library-lint.test.ts :241, :302, :307 and :308 for LIB-12's modules (D-LIBHANDS-COUNT; LIB-7-FIX raises them for LIB-7's first).
  - It goes out together with Do 5, Do 6 and Do 10, and Do 7 when the merged head holds LIB-5.
- **After #193 merges:** merge origin/main instead of #193's head.
- **Before READY:** merge origin/main (it must contain #193, and LIB-7b when slot 6c holds). Re-run X3-X6 after every merge.

depends_on:
- #193 with D-LIB7FIX-PERKEY (lib4-cards :3754-3917): hands/words/chrome.json, `wordsFileOf(key)`, `readWords`, `allWords()`, `declarationsOf`, PK1-PK5. Read them; never edit them.
- main's GATE-SPLIT (gate.runs / gate.done; tests/gate-split.test.ts:55 = 103 on f125edab, 104 on da65b13a) and LIB-4c's ci/manifest.mjs:69-72 and ci/affected.mjs:144 (read only).
- LIB-5 on main (f125edab): lint/family.mjs reads every hands/hand-*.mjs (D-LIB5-FAULTKEYS 4, lib4-cards :2430-2434); D-LIBHANDS-COUNT.
- The supervisor's calibrated R8 critic panel on LIB-12's 12 drawn ids (D-LIB12FIX-SHIP, D-LIB12FIX-SLOT (b); hands/DESIGN.md §5 :159-171 @ 0d268a71).

build_prerequisites:
- 'LIB-12-FIX start' (Stops 1): the next free LIB builder slot after PERKEY lands on #193, ahead of LIB-7c.
- Posted on #191 by the supervisor before the start: section 19's "Interactions" (:3897-3899) and note (:3917); D-LIB7c-CAMERA's follow-up (:3726, :3750); 6257189689 (relayed); D-LIBHANDS-COUNT (6257376224, 6257562588); the D-LIB12FIX-* rulings.
- The start message quotes word for word: D-LIB7FIX-WORDS (as amended by PERKEY), D-LIB7FIX-GATE, 11.1 item 16 (b), D-LIBHANDS-COUNT as amended, and every D-LIB12FIX-* ruling.
- If a slot is free before the PERKEY head is on origin, the supervisor may start the card for Do 1-3 and Do 6's timing (local only, nothing pushed) and park it at the first WAITING.

merge_prerequisites:
- A fresh Opus review PASS against this card, on the delta 0d268a71..head (first parent), on that exact head.
- Every check green on a head that contains the latest main.
- Checklist slot 6c (D-LIB12FIX-SLOT): after LIB-7b (6b), before LIB-8M #109 (7).
  - Order: … LIB-6 #181 + LIB-6-PM → LIB-7 #193 + LIB-7-FIX with PERKEY (6) → LIB-7b (6b) → **LIB-12 #191 + LIB-12-FIX (6c)** → LIB-8M #109 (7) → LIB-5v (7a) → LIB-7c (7b) → LB1 #245 (8).
  - It merges in a supervisor merge train, one merge commit per PR in checklist order. The builder never merges.
- The calibrated R8 critic panel (Do 11-12): VALID under D-CRITIC-CAL3 on a LIB-12-FIX head where D-LIB12FIX-CARRY's pins hold (or as re-based by ruling), with every drawn key passing, or, after the one fix round, a still-failing key's ids moved to its module's GAPS by ruling.
- The supervisor's words look on #191 (Do 4).
- 'PILOT A PIN GO' is sent only after LIB-12 is on main and merged into #109, and after the critic panel. The supervisor adds "LIB-7b (6b) and LIB-12 (6c) on main and merged in" to lib-8-merge-card.md:53 and "6b LIB-7b; 6c LIB-12" to :56.
- Nothing ships here (gen/hands.mjs:192: a row ships only with its key on main, and none of the 12 is in a shipped batch). Shipping a LIB-12 key needs D-LIB12FIX-SHIP.

hard card: yes, with a short design note: Do 4, the words and the panel sheet, posted on #191 with the first push. Everything else is ruled.

outcome:
Gap today (#191 @ 0d268a71 merged with #193's PERKEY head, per 6257189689, and with main f125edab):
- **No words for LIB-12's 5 pair keys.** PERKEY reads one hands/words/<key>.json per key (:3766-3771, :3788-3797), so `pairPanel(k)` throws `hand panel <k>: no words in …`. lib7-fix F1 pairPanel, F2, F3, F6 (a), PK1, PK2 and PK4 go red.
- **lib7-fix.test.ts's key sweep is exact at 8** (:69 at da65b13a, `C.sweep(P.keysOf(), 8, 'pair keys')`); with LIB-12 there are 13 keys.
- **LIB-12's gate block is unguarded**, so GATE-SPLIT's E1, ci-verdict and LIB-4b's twins go red (20 tests, M5).
- **LIB-5's five no-hand-module lines** (library-lint.test.ts :241, :302, :305, :307, :308) hold LIB-7's values after #193 and must take LIB-12's (D-LIBHANDS-COUNT).
- **LIB-12's drawings were never critic-scored.** Its own design requires the calibrated R8 critic (hands/DESIGN.md §5 :159-171 @ 0d268a71: "LIB-12 uses the same sheet and `--plant`"), but #191 holds reviews only (5967803678 FAIL → 5972033371 PASS → 5975526312 PASS → 5976224674 PASS). No test pins a LIB-12 render; only the claims (hand-views.test.ts:140, :278). Pilot A's sheet shows cupped and front-rack (#109 plates.json :171-193, rendered at 06519f9) with no critic score.
- **One review Low is still open:** 5972033371 Low 1, hand-views.test.ts:235 passes with every claim line dropped from the sheet. (Low 2 is in LIB-7's frozen sheet.mjs:78; it stays a LIB-7 follow-up, Do 8.)
- **battle_ropes** is drawn `neutral` at Right forearm 180 (hand-battle-rope.mjs:16, :27) and labelled "Seen from above"; D-LIB7c-CAMERA left this to LIB-12 (:3726, :3750).
After this card:
- hands/words/ holds one file per LIB-12 pair key: ball-contact-catch-under, battle-rope-rope-neutral, cupped-goblet-under, front-rack-rack-under, palm-flat-floor-over, each the PERKEY per-key object with every text's source.
- lib7-fix.test.ts's sweep reads `8 + 5` (exact); lib7-fix is green over 13 keys.
- LIB-12's block runs under its own `if (gate.runs('LIB-12'))` line; gate-split.test.ts:55 is +1 exact; gate-times.json has "LIB-12".
- library-lint.test.ts's five lines hold the exact values with LIB-12's modules.
- tests/library/lib12-fix.test.ts pins the 20 reviewed renders and the 15 LIB-12 files and checks the words against the drawn and research labels.
- The supervisor's R8 critic has scored all 12 drawn ids on this card's head; any fix is done in one round here.
- Low 1 is fixed; the battle_ropes question is recorded as deferred.
- Unchanged: every LIB-7 file and approval, golden B and the 8; every LIB-12 picture unless the critic round changes it by ruling. Nothing ships.

deliverable: commits on #191, #191's body (HANDOFF, X1-X11 evidence, mutation list) and #191 comments: the words note with the sheet, the critic head, READY. No new PR.
evidence: X1-X11 below.
finish: merged on main in slot 6c. You will notice: nothing visible. No library row ships, and every approved and reviewed hand drawing is byte-identical unless a ruled critic fix changed it.

design_reference:
- lib4-cards.md @ 39c71b01: D-LIB7FIX-CARRY (:3497-3505), -KEY (:3517-3530), -API (:3532-3537), -GATE (:3551-3555), -BUDGET (:3563-3576), -WORDS (:3578-3585); D-LIB7b-SLOT (:3617-3627); D-LIB7c-SHIP (:3708-3712), -SCOPE (:3714-3722), -CAMERA (:3724-3727), -SLOT (:3734-3741); D-LIB7FIX-PERKEY (:3754-3917), PK1-PK6 (:3823-3874), "Interactions" (:3883-3906), the supervisor note (:3917); D-CRITIC-CAL3 (:1963-2006); 11.1 item 16 (:673-679); D-LIB5-FAULTKEYS (:2412-2440).
- #193 6257376224 and 6257562588 (D-LIBHANDS-COUNT).
- hands/DESIGN.md §5 (:159-171 @ 0d268a71); plan 2.3 (:173-182) and 3.4-3.5; section 7 row 12 (:769).
- lib-7b-card.md :68, :226, :248; lib-7c-card.md :256, :330, :357; lib-8-merge-card.md :53, :56, :124, :151.
- docs/COACHING-DECISIONS.md D-LIB12-1..9 (#191 0d268a71).
- #191: 5950950265, 5967803678, 5972033371, 5975526312, 5976192333, 5976224674. #193: 6256320337, 6256326739, 6256958660, 6257189689.

connectivity: none. No stored or sent user data, no storage key, no network call, no dependency.

read_first:
- AGENTS.md (main); .claude/skills/builder/SKILL.md and its gotchas; this card; lib-12-fix-rulings.md; #191's body and the comments above.
- At 0d268a71: hands/hand-ball-contact.mjs :6-24, hand-battle-rope.mjs :8-38, hand-cupped.mjs :6-24, hand-front-rack.mjs :7-25, hand-palm-flat.mjs :6-27; hands/DESIGN.md §5; tests/library/hand-views.test.ts :14-41, :205-240, :278; scripts/screenshot-gate.mjs LIB-12 block (19 lines).
- At #193's PERKEY head: hands/panel.mjs (wordsFileOf, readWords, allWords), pairs.mjs (keyOfCfg, keysOf, pairPanel, inputsFor, declarationsOf), hands/words/*.json, hands/sheet.mjs (`--plant`), tests/library/lib7-fix.test.ts (the :69 sweep, F1-F6, PK1-PK5), and LIB-7-FIX's library-lint.test.ts edits. At da65b13a for reference: pairs.mjs :229-235, :293, :322-332; panel.mjs :25-51; lib7-fix.test.ts :56-262; screenshot-gate.mjs :9405-9407 (LIB-7's guard form).
- On main f125edab: tests/gate-split.test.ts :45-60; scripts/gate-times.json; tests/howto/library-lint.test.ts :219-251, :254-310; tools/plates/library/lint/family.mjs; docs/research/howto/shared/implement-wall-ball.json, implement-battle-ropes.json, front-rack-exemption.json and palm-flat.json `faults`; tools/plates/library/ci/manifest.mjs :55-73; tools/plates/gen/ids.mjs :121-127; tools/plates/gen/hands.mjs :176-192.

write_scope:
- New: tools/plates/library/hands/words/ball-contact-catch-under.json, battle-rope-rope-neutral.json, cupped-goblet-under.json, front-rack-rack-under.json, palm-flat-floor-over.json (Do 3-5).
- tests/library/lib7-fix.test.ts: the one exact key-count line (:69 at da65b13a; the line 6257189689 names on the PERKEY head) `8` → `8 + 5` (Do 5).
- New: tests/library/lib12-fix.test.ts and tests/library/fixtures/lib12fix/**.
- tests/library/hand-views.test.ts: the Low 1 assertion only (Do 8), add-only; :211 and :217 unedited.
- scripts/screenshot-gate.mjs: LIB-12's own block: its guard line and placement (Do 6). Body byte-identical.
- tests/gate-split.test.ts: the one line at :55, +1 exact, "+ LIB-12" in its comment.
- scripts/gate-times.json: one added "LIB-12" entry.
- tests/howto/library-lint.test.ts: :241, :302, :305, :307 and :308 only (D-LIBHANDS-COUNT, Do 7).
- docs/COACHING-DECISIONS.md: appended D-LIB12FIX-* entries only.
- Only in the critic fix round, and only what the supervisor's re-base ruling names (Do 12): LIB-12's Stops 2 files, the words files, LIB-12's own sweeps and SCOPE in hand-views.test.ts, the LIB-12 gate block's pair count, lib7-fix.test.ts's count line, library-lint's five lines and lib12-fix.test.ts's pins.
- src/howto/generated/loaders.ts: its header line, only if a merge moves it, written by `node tools/plates/generate.mjs`.
- #191's body and title.

reserved_paths (out of scope; never edit):
- The LIB-12 files in Stops 2 (apart from the Low 1 lines and a ruled critic fix).
- Every #193 file apart from the one lib7-fix.test.ts line: hands/pairs.mjs, panel.mjs, zoom.mjs, page.mjs, sheet.mjs, checks.mjs, gate.mjs, radial-rules.mjs, claims*.json, census-scope.json, hand-band/curl/d-handle/ez/rope.mjs, words/chrome.json and LIB-7's words files, hands/DESIGN.md, tests/library/hand-pairs.test.ts, tests/library/fixtures/lib7fix/**.
- LIB-7b's paths: build-layers-page.mjs, layers-spec.mjs, gen/hands.mjs, gen/handpairs.mjs, tools/plates/library/fidelity/**.
- LIB-7c's new files (hand-bar.mjs, hand-v-handle.mjs, their words files, lib7c-*).
- tools/plates/layers/**, tools/plates/vendor/**, tools/plates/library/render/** and tools/plates/library/test/** (LIB-6).
- tools/plates/gen/**, tools/plates/generate.mjs, tools/plates/lib/**; registry.mjs, candidate.mjs, qa/**, lint/**, shared/**; docs/research/**.
- ci/** and tools/plates/library/MANIFEST.json (LIB-4c); pilot-a/** (LIB-8); lb1/** (LIB-9a); scale/**.
- tests/howto/hands.test.ts, library-rows.test.ts, zooms.test.ts, library-core.test.ts, budgets.test.ts, budgets.json, lib-4a.test.ts, library-fidelity.test.ts; tests/ci-verdict.test.ts; every other line of library-lint.test.ts.
- docs/evidence/lib-12/** (the committed PNGs).
- src/** apart from loaders.ts's header; src/ui/styles.css; src/app/App.tsx; src/main.tsx.
- Shared add-only files (AGENTS.md :73): scripts/screenshot-gate.mjs and tests/theme.test.ts. Never edit, move or delete another task's block; when merging main, keep both sides.
- Supervisor-owned: .github/** (:70); package.json and package-lock.json (:71), so no new dependency.
- Never touched: the saved data shape (:72); watch-agent paths; escobar-worker/**.
- AGENTS.md, CLAUDE.md, docs/supervisor/**, the plan docs.

Do:
1. On 'LIB-12-FIX start':
   - read this card, the rulings and #191;
   - check `git ls-remote origin refs/heads/claude/lib-12-hand-views` gives 0d268a71d68153561b4da629da2d30f62a518002; if not, stop and report;
   - subscribe to #191's activity.
2. Baseline on 0d268a71, before any edit, recorded in the PR:
   - `npm ci`; `npm run check` (5976192333 reports 2736 + 3);
   - for each of the 20 drawn pairs, the sha256 of `renderPair(id, { fault }).svg`, and the combined value by M1's method (it must equal `0bc3ba3d…5fee0`; if not, stop and report);
   - the sha256 of the 15 files in Stops 2;
   - gate-lib12.mjs alone on Chromium 141: `problems: []`, exactly 100 renders (5976224674).
3. Draft the words (local; D-LIB12FIX-WORDS). For each LIB-12 key, the PERKEY per-key object:
   | key | fault | right | wrong = pager |
   |---|---|---|---|
   | ball-contact-catch-under | side-sandwich | Hands under (hand-ball-contact.mjs:14) | Hands on sides (:18; = shared/implement-wall-ball.json faults[0].label) |
   | battle-rope-rope-neutral | death-grip | Palms facing (hand-battle-rope.mjs:17) | Too tight (:21; = implement-battle-ropes.json faults[1].label) |
   | cupped-goblet-under | weight-away | Against the chest (hand-cupped.mjs:14) | Weight away (:18; no research shared card carries this fault) |
   | front-rack-rack-under | bar-off-shoulders | On the shoulders (hand-front-rack.mjs:15) | Bar on hands (:19; = shared/front-rack-exemption.json faults[0].label) |
   | palm-flat-floor-over | cupped-palm | Whole hand down (hand-palm-flat.mjs:14) | Palm cupped (:18; = palm-flat.json faults[1].label) |
   | palm-flat-floor-over | hand-ahead | Whole hand down (:14) | Hand ahead (:20; = palm-flat.json faults[0].label, D-LIB5-FAULTKEYS) |
   - Heading for every key: 'Hand: right and wrong', with LIB-7's source string (golden B lat_pulldown.howto.mjs:254, dumbbell_lateral_raise.howto.mjs:202, machine_chest_press.howto.mjs:101).
   - Each source names the module file:line, "drawn in the reviewed SVG, #191 5976224674 @ 0d268a7", and for a research-backed label the docs/research/howto/shared file and fault key (on main f125edab; indexes verified at 83075956).
   - Every caption is 2 or 3 words (M3); none explains.
4. Merge #193's PERKEY head (base section). Then the design note: one #191 comment, "LIB-12-FIX WORDS NOTE: <sha>":
   - the five keys as built (`keysOf()` filtered to OWNER 'LIB-12'), each with its ids;
   - the words table of Do 3, every text with its source;
   - a sheet of the five panels at 390 px in Silent Black and Paper, every page shown, rebuilt by a script given in the comment, as LIB-7-FIX's 6256320337 did (no images can be attached);
   - flagged on the sheet: the battle_ropes camera question (D-LIB12FIX-ROPE).
   The supervisor's look checks words only. If it asks for other words: change only the words files, and re-run X1.
5. The words files and the count:
   - write the five words/<key>.json files from Do 3;
   - lib7-fix.test.ts: the key sweep `8` → `8 + 5`, exact (as D-LIB7c-SCOPE does for LIB-7c, :3718); no other line of that file changes;
   - run lib7-fix.test.ts: all green, with the 13 keys in its F6 (a) log line.
6. The gate (D-LIB12FIX-GATE):
   - scripts/screenshot-gate.mjs: the line `if (gate.runs('LIB-12'))` alone, then the block's existing `{` on the next line, as LIB-7's block (screenshot-gate.mjs:9406-9407 @ da65b13a). Body unchanged. Placed directly after LIB-7's guarded block and before `await gate.done();`;
   - tests/gate-split.test.ts:55: the merged head's count + 1 (104 → 105 when only LIB-7's block was added since main), exact toBe, "+ LIB-12" added to its comment;
   - scripts/gate-times.json: "LIB-12", solo-measured locally in UTC and Pacific/Auckland and scaled by GATE-SPLIT's local→CI ratio (11.1 item 16 (b)); record the two local times, the ratio and the value;
   - gate-split.test.ts, ci-verdict.test.ts and library-fidelity.test.ts green.
   Then the first push (the Do 4 merge + Do 5 + Do 6 + Do 10, and Do 7 when the merged head holds LIB-5), with Do 3's words, after the CI-manners check.
7. LIB-5's family lines (D-LIBHANDS-COUNT, #193 6257376224 as amended by 6257562588; line numbers at f125edab):
   - rule (a) stays clean over the 13 modules (M4);
   - raise the five lines from LIB-7's values (as LIB-7-FIX left them) to exact values with LIB-12's modules: :241 `hands 19` (3 + 16); :302 `16`; :305 the title names the real set; :307 `mods.map(m => m.src)` equals the exact sorted list of the 13 hand-*.mjs names; :308 the exact pair `[16, 16]`;
   - derive each value and show the derivation in #191's body; no other line changes;
   - mutation: hand-palm-flat.mjs (it has fault entries) removed in a scratch copy → each line that depends on it is red; hand-ab-wheel.mjs, hand-dip-bar.mjs and hand-implement.mjs have none, so they are not the mutation;
   - if LIB-7-FIX's values or line numbers differ from these, stop and report.
8. Review Lows of 5972033371:
   - Low 1 (LIB-12's own file): in hand-views.test.ts's buildSheet test, assert for each ref the drawn LIB-12 keys cite that the sheet holds `${ref}: ${text}` with text from lib12-claims.json (escaped as the sheet escapes it). Red first with claim lines removed from the sheet html in memory, green on the real sheet. :235's "(unresolved)" check stays.
   - Low 2 (sheet.mjs:78, "none" shown beside module FLAGS): LIB-7's frozen file (D-LIB7FIX-CARRY; pins :403-404). Not fixed here; listed in the HANDOFF as a LIB-7 follow-up.
9. battle_ropes (D-LIB12FIX-ROPE): append its text to COACHING-DECISIONS.md and flag it on Do 4's sheet. No drawing, module or test of battle_ropes changes.
10. lib12-fix.test.ts (X1, X3): write the tests, each with its mutation, before the first push (Do 6), so the critic head (Do 11) holds them.
11. The critic head: after the first push, with X1-X3 green on it, post "LIB-12-FIX CRITIC HEAD: <sha>" on #191, with the command that builds LIB-7's sheet with every LIB-12 tile (`hands/sheet.mjs`, `--plant` stays the supervisor's). The supervisor runs the calibrated R8 critic panel (D-CRITIC-CAL3) on the 12 drawn ids and posts the verdict. Keep working on Do 8-9 meanwhile; do not push a drawing change.
12. One fix round, only if the verdict names findings and the supervisor rules the fix:
   - make exactly the ruled changes, in LIB-12's files;
   - the supervisor's re-base ruling names the new head and the new pins; update lib12-fix.test.ts's pins, and any count the ruling names, in the same commit;
   - a key that still fails after the round: its ids move to its module's GAPS with the finding as the reason, and its words file is removed (the D-LIB7c-SHIP pattern), by ruling; recount every exact count the ruling names;
   - any edit to view-common.mjs is named in the ruling (it reaches mountain_climbers' MANIFEST set; risk line);
   - if cupped or front-rack change after the pilot A sheet went to the owner, tell the supervisor: the owner gets a changed-ids sheet before the pin (plan 3.5).
13. Before READY:
   - merge origin/main as the base section says (with #193, and with LIB-7b when slot 6c holds);
   - re-run X3-X6 there;
   - run X10 and the collision table on that exact head;
   - re-read your diff against write_scope;
   - update #191's body and post "LIB-12-FIX READY: <sha>".

Acceptance (each with evidence and the mutations that must turn red; list each red line in the PR):
- **X1 Words per key (D-LIB12FIX-WORDS).** tests/library/lib12-fix.test.ts, and lib7-fix.test.ts green on the head.
  - The LIB-12 key set (`keysOf()` filtered to OWNER 'LIB-12') equals the five words files' keys, swept at exactly 5.
  - For each LIB-12 key k and fault f: right.text === the variant's rightNote; wrong.text === pager.text === the fault's label; every source non-empty; heading 'Hand: right and wrong'.
  - The test holds the exact list of five research pairs (file, key, label): implement-wall-ball side-sandwich, implement-battle-ropes death-grip, front-rack-exemption bar-off-shoulders, palm-flat cupped-palm and hand-ahead, swept at exactly 5. It is red when a file is missing or a label differs. This part counts as evidence only on a head that holds LIB-5 (main f125edab or later).
  - lib7-fix F1 pairPanel, F2, F3, F6 (a) and PK1-PK4 green over 13 keys; :69 sweeps 13.
  - Mutations, each red, in memory or in a scratch worktree only (never files in the repo tree): one LIB-12 words file removed (PK2 or readWords names the key); the count at `8 + 4` ("pair keys: 13, expected 12"); an 11-word caption (F3); a source emptied (F3); a wrong text that differs from the drawn label (X1); a research label changed (X1).
- **X2 Guarded gate block (D-LIB12FIX-GATE).**
  - The block passes under `gate.runs('LIB-12')` on Chromium 141 and Chrome 153: exactly 100 renders, `problems: []`.
  - gate-split.test.ts green at the new exact count; ci-verdict.test.ts and library-fidelity.test.ts green; gate-times.json has its entry.
  - `git diff origin/main -- scripts/screenshot-gate.mjs` shows LIB-12's block and its guard only (plus LIB-7's block while #193 is unmerged).
  - Mutations, each red: the guard line removed (gate-split E1 and library-fidelity's twin parse); the :55 count left unraised. The block's own `stats.pairs !== 20 * 5` check is byte-unchanged; its red case was shown on #191 (5970895610, 5972033371).
- **X3 LIB-12's pictures carry (D-LIB12FIX-CARRY).** tests/library/lib12-fix.test.ts.
  - The 20 `renderPair(id, { fault }).svg` sha256 equal Do 2's values (or the re-base ruling's), pinned, sweep 20.
  - The 15 Stops 2 files' sha256 equal 0d268a71's (or the ruling's).
  - For each LIB-12 key k and fault f (6 pages), the SVG in `pairPanel(k)` equals `renderPair(firstId(k), { fault: f }).svg` with `hp-<id dashed>-<f>` replaced by `hp-<k>-<f>` (lib7-fix F4's method).
  - Mutations, each red: front-rack Right barLiftMm +15 in memory; palm-flat drawn at orientation 'under' in memory; one view file's bytes changed in a scratch worktree.
- **X4 LIB-7 unchanged (D-LIB7FIX-CARRY).** hand-pairs.test.ts pins :132, :403, :404 green and unedited; lib7-fix FROZEN green; `git diff <#193's merged head> HEAD -- <#193's files>` shows only the :69 line; PK5 green.
- **X5 Golden B and the 8.** generate --check clean, with no file moved by this card's own commits; hands.test.ts unedited and green; LIB-7 A1 and LIB-6's closeups.test.ts green.
- **X6 Family (D-LIBHANDS-COUNT).** library-lint.test.ts green with the five lines at 19, 16, the title, the 13 names and [16, 16], each derived in #191's body; rule (a) clean. Mutations, each red: hand-palm-flat.mjs removed in a scratch copy (each dependent line); palm-flat's hand-ahead relabelled 'Hands forward' in a scratch copy (the family check names hand-ahead).
- **X7 Low 1.** The strengthened buildSheet test is red with the claim lines removed and green on the real sheet; :211, :217 unedited.
- **X8 battle_ropes.** D-LIB12FIX-ROPE appended; X3 shows battle_ropes' render unchanged.
- **X9 Critic.** The supervisor's VALID R8 panel verdict on #191, naming the head where X3 held; every drawn key passes, or the ruled fix round and GAPS moves are in, with X1-X6 re-run on the new head.
- **X10 No pin first.** tools/plates/library/MANIFEST.json on the head holds no mountain_climbers row (`{ "rows": {} }` on main) and #109 has no `[golden update]` commit; LIB-4c's C0 green.
- **X11 No regression, on the READY head:** `npm run check`; `npm run test:tz` (both zones); `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, detached; the LIB-12 and LIB-7 gate blocks on both browsers; the diff against 0d268a71 touches only write_scope paths, apart from the merges.
Nothing is loosened:
- no tolerance, ceiling, timeout, pin or count is relaxed: :69, :55 and the five library-lint lines are raised exact, with their sweeps;
- no test is cut; LIB-12's gate count stays `!== 20 * 5` unless a ruled GAPS move recounts it exactly;
- each new check is proven by a mutation that turns it red.

verification: #191's body maps X1-X11 to a test or run, with commands and outputs, and lists every mutation with its red line. Evidence counts only for the exact head it ran on. After every merge and on the READY head, re-run X3-X6.

risk_and_recovery:
- **PERKEY's head differs from section 19** (e8614950 was not on origin at card time): read its panel.mjs and lib7-fix.test.ts first. If the words file shape or the :69 line differ from this card, stop and report; never adapt LIB-7's file.
- **LIB-7b changes panelHtml's wrapper** (its right, DESIGN §8 (b)): after merging main with LIB-7b, re-run X1 and X3's panel equality; lib7-fix F3 loops every key, LIB-12's included.
- **A pin before this card merges** (Stops 8): mountain_climbers' MANIFEST set would gain inputsFor('palm-flat-floor-over') and need an `'owner'` pin replacement (lib4-cards :3739, :3898).
- **After the pilot A pin:** any later edit to hand-palm-flat.mjs, view-palm-flat.mjs, view-common.mjs (shared by every LIB-12 view and imported by hand-battle-rope.mjs) or words/palm-flat-floor-over.json needs an `'owner'` pin replacement for mountain_climbers. A later fix to another LIB-12 view is made without touching view-common.mjs, or carries that replacement. Tell the supervisor before any such edit.
- **The critic fix round** may change pictures pilot A's sheet already showed; Do 12 routes it.
- **LIB-12-FIX stalls** while #109 is otherwise ready to pin: the supervisor may move LIB-12 after #109 and accept the `'owner'` pin replacement for mountain_climbers (D-LIB12FIX-SLOT fallback).
- **LIB-7c** (slot 7b) re-counts lib7-fix.test.ts's key sweep after this card (8 + 5 + |D|), gate-split :55 and the five library-lint lines; post the line numbers in #191's HANDOFF.
- **Timeouts.** New describes use hand-pairs.test.ts's 60_000; never raise an existing one.
- **Two failed tries of one approach:** stop and report.

return:
- #191 head sha and each merge commit's sha;
- Do 2's baseline (check counts, the 20 sha256 and the combined value, gate-lib12 output);
- the words note comment id and the supervisor's look;
- the five words files and the :69 line, before and after;
- the guard diff, the :55 value and the gate-times.json value with how it was measured;
- the five library-lint values and their derivation;
- the critic head, the verdict id and any fix-round commits;
- every mutation with its red line; X7's red-then-green;
- check, test:tz, full gate, LIB-12 and LIB-7 gate output on the final head.

Resume rule: when you are WAITING or parked, you resume only on the supervisor's exact words 'LIB-12-FIX resume', sent to your session or posted on #191. A prerequisite post alone is not a resume.

Collision check (card time; exact files):
| Path in write_scope | Open PRs that touch it | Effect |
|---|---|---|
| hands/words/<LIB-12 key>.json | none (new files; LIB-7c's keys start `bar-` / `v-handle-`, lib-7c-card.md:356) | none |
| tests/library/lib7-fix.test.ts (:69) | #193 (owner); LIB-7c (lib-7c-card.md:357) | one line each; the later merger re-counts exact |
| scripts/screenshot-gate.mjs, gate-split.test.ts :55, gate-times.json | #193 (LIB-7's block, guarded at da65b13a); LIB-7c; any card adding a block | own guarded block; re-count :55 at each main merge |
| tests/howto/library-lint.test.ts :241, :302, :305, :307, :308 | LIB-5 owns it (main f125edab); #193 raises them first; LIB-7c after | D-LIBHANDS-COUNT: each adder raises them exact |
| tests/library/hand-views.test.ts | none | none |
| docs/COACHING-DECISIONS.md | most open PRs | append-only; keep both sides |
Merge-tree at card time: M2.

---

Critic fixes applied (lib-12-fix-critic.md; 13 of 13; the supervisor accepted every finding and verdict):
- **1 (High):** D-LIBHANDS-COUNT is five lines (:241, :302, :305 title, :307 on `mods.map(m => m.src)`, :308 exact pair), as amended on #193 (6257562588). Stops 5, base, Do 7, X6, write_scope and the collision row name the five lines; Do 7 gives LIB-12's values (19, 16, 13 names, [16, 16]).
- **2 (High):** the R8 critic is now a gate. The supervisor runs a calibrated panel (D-CRITIC-CAL3) on all 12 drawn ids before 'PILOT A PIN GO' (Do 11-12, X9, merge_prerequisites); one fix round in this card, re-based by ruling; a still-failing key moves to GAPS. D-LIB12FIX-WORDS no longer says the look replaces the critic's; the look checks words only. D-LIB12FIX-SHIP added (critic, owner's pilot-sheet look with the critic scores, words look). D-LIB12FIX-SLOT (b) widened to the 12 ids.
- **3:** front-rack's fault is in shared/front-rack-exemption.json (faults[0] 'Bar on hands'); Do 3 and X1 cite it; five of six labels are research labels.
- **4:** the residual pin risk names view-common.mjs (shared by every LIB-12 view and hand-battle-rope.mjs) as well as palm-flat's files.
- **5:** lane: LIB-12-FIX takes the next free slot after PERKEY, ahead of LIB-7c; fallback (move after #109 with an 'owner' replacement) recorded in D-LIB12FIX-SLOT and the risk lines.
- **6:** X1's research check is an exact list of five (file, key, label), swept at 5, and counts only on a head with LIB-5 (now main f125edab).
- **7:** the mutation removes hand-palm-flat.mjs, which has fault entries; the zero-fault modules are named as not mutations.
- **8:** D-LIB12FIX-ROPE option (ii) keeps "Seen from above" with no YOU / MACHINE row (D-LIB7-11, D-LIB12-7), and battle_ropes does not ship until the look rules.
- **9:** the guard is `if (gate.runs('LIB-12'))` on its own line with `{` on the next, as LIB-7's (:9406-9407 @ da65b13a).
- **10:** R6 is replaced by the ruled D-LIBHANDS-COUNT (6257376224 as amended by 6257562588); "derive and show each value in #191's body" is in Do 7, X6 and return.
- **11:** #109 is cited at 774becf9 (plates.json :160 and :171-193 unchanged); main is f125edab.
- **12:** the supervisor edits lib-8-merge-card.md :53 and :56 for 6b and 6c in the cards commit that records D-LIB12FIX-SLOT.
- **13:** the first push is the Do 4 merge + Do 5 + Do 6, and Do 7 when the merged head holds LIB-5 (base section and Do 6 agree; recheck N1 adds Do 10).

Recheck (critic, 2026-10-19, against #191 0d268a71, #193 da65b13a (PERKEY head still not on origin), main f125edab (tree = 83075956, so K1-K3 hold there), #109 774becf9):
- recheck N1: applied. Do 11 asked for a critic head "with X1-X3 green on it" after the first push, but lib12-fix.test.ts (Do 10) was not in that push and Do 11 said to keep working on Do 7-10. Do 10 now goes in the first push (base section, Do 6, Do 10), and Do 11 keeps working on Do 8-9.
- recheck N2: applied (lib-12-fix-rulings.md, D-LIB12FIX-SLOT (b)). "If it fits" let the pilot A sheet go out before the panel, while D-LIB12FIX-SHIP (2) needs the owner to see cupped and front-rack with the critic scores. When the panel runs after the sheet, the supervisor sends him their scores (with a changed-ids sheet if a picture changed) before 'PILOT A PIN GO'.
- Checked, no change needed: findings 1-13 applied as meant. The five D-LIBHANDS-COUNT values for LIB-12 (hands 19; 16; the title; 13 names; [16, 16]) are right on train 29 + #193 + #191: K2 is 22/22 with exactly these, and f125edab's tree equals 83075956's. LIB-7's values (13; 10; 5; [10, 10]) match M5. M2 holds on f125edab (main + #191 conflicts in screenshot-gate.mjs only; main + #193 clean). The guard form, the five research pairs, the lane line, the fallback, view-common.mjs in the risk lines, the ROPE option (ii) and the lib-8-merge-card :53/:56 edits are in both files. The fix-round scope (write_scope, Stops 2, X2, "Nothing is loosened") only allows what a ruling names.
