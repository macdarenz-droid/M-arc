Card LIB-SHIP W9: switch on the rows with a standing verdict (2026-11-16; status `ruled` 2026-11-16. The supervisor's rulings at the end win over the proposals.)

Form: `lib-ship-card.md` (steps a-f of W1, rulings 1-15), as W8b and W8c ran it:
- W8b on #417: PLAN RULED 6847824876, LAYERS READY 6854783313, panel 6856272493, STAMP 6856507580, REVIEW FAIL 6869580972, FIXED 6870869883.
- W8c on #429: PLAN RULED 6893626415, LAYERS READY 6895186807, rulings 6895200917, LAYERS APPROVED 6895226756.

Plan: `plan-w9.md` (the 58 rows, the waves W9-W13 and the lanes).

Sources (read at these heads; [est] is an estimate, [unverified] is what no run here checked):
- main `46e564ce` (train 100, #423 F-SHEET-COPY), read with `git show` / `git archive`. Nothing was built or run in the repo.
- W8c #429 head `4607c03f` (contains `46e564ce`; coverage.ts 84 shipped).
- Verdict comments by id (table below), read with `gh api`.
- `f-dl-liftoff-card.md` (rulings 3-4), `f-ht4-rightpose-card.md` (part 2), `lib-platefix-5-card.md`, `f-sheet-copy-card.md:135` (the "only copy moved" substitution).

id: LIB-SHIP W9
model: claude-opus-5-5 (card compares, holds, a round-2 sheet fix and guard replacements are judgement work). Mechanical sub-steps (config rows from the cited recipes, page builds, budgets from measured numbers, regenerate, MANIFEST by `manifestOf`) may go to a `sonnet` helper with every step spelled out.
mode: auto
title: 'Builder: LIB-SHIP W9, the standing verdicts on'
branch: `claude/lib-ship-w9` from main **after W8c (#429) merges**. The first push opens a draft PR 'LIB-SHIP W9'.
slot: after W8c in the LIB-SHIP merge order. The supervisor names the checklist slot in the start message.

## Why now
- Each row below already holds a layers verdict bound to a card, or a ruled single fix. The cards that freed bulgarian and conventional have merged: #426 in train 98 and #427 in train 97.
- PF5 (#419, train 92) approved 8 sheets on lb05-lb10, which have waited for "a separate lb05-lb10 wave card" (lib-ship-w8c-card.md, Order and dependencies). This is that wave.
- Main ships 84 once W8c merges. W9 takes it to 96, or to 98 with both conditional rows.

## Flip set
Lines are batch-file stage lines on main `46e564ce`. Every id is `approved-plate`.

| id | page (batch :line) | verdict that lets it ship | judged reference | check in W9 | still blocks it |
|---|---|---|---|---|---|
| barbell_bench_press | lb02 (:31) | lyr-pf11 sheet PASS, #410 **6750587189** @ `7b4e4866` (close-up 19 approved) | lb02 scratch layers page `4c4cf718…` (PF4's 6-id config) | **carry** | nothing on main. The dry-run gate decides it (Q-W9-3) |
| conventional_deadlift | lb03 (:108) | #427 fresh panel L5 PASS **6872578643** @ `2404f774`, and L4 round-2 PASS **6874288878** @ `e8e15f7a` | card `318f30ab…` (6874288878; F-DL-LIFTOFF READY 6879646757 "Binds") | **carry** | nothing (#427 merged in train 97) |
| sumo_deadlift | lb03 (:129) | W8b panel PASS **6856272493** @ `1fdf6975` | card `b1c29f89…` (f-dl-liftoff-card.md:12, :86) | **carry**, in the same head after conventional (D-LIB10-PARENTS, f-dl-liftoff ruling 4) | nothing |
| bulgarian_split_squat | lb04 (:208) | #426 fresh panel PASS **6869858026** @ `ea5cbca8` (L5 [4,4,4]); #426 merged in train 98 (delta PASS 6898578441) | card `bcd016a4…bb99` | **carry** | nothing |
| cable_curl | lb05 (:46) | PF5 panel **6851987591** (plate approved in round 1; the sheet failed only L3), with L3 cleared by **D-PF5-HANDPAIR 6852356177** | PF5 scratch lb05 page `5a81cdc4…` @ `f487c797` (6850595073) | **carry** | nothing. F-LAYERS-HANDPAIR is open (the risk below) |
| cable_chest_press | lb06 (:28) | PF5 round-2 PASS **6853178277** @ `50a35bb6` (L4) | lb06 page `a7ed5550…` (6853051025) | **carry** | nothing |
| hip_adduction | lb06 (:182) | PF5 layers approved in round 1, **6851987591** | lb06 page `ef403f7b…` @ `f487c797`. Its card is unchanged on `a7ed5550…` [unverified] | **carry** | nothing |
| cable_external_rotation | lb07 (:71) | PF5 layers approved in round 1 under D-BODYMAP-NOCUFF, **6851987591** | lb07 page `0fda01bc…` @ `f487c797`. Its card is unchanged on `fad1e931…` [unverified] | **carry** | nothing |
| diamond_push_up | lb07 (:160) | PF5 round-2 PASS **6853178277** (L5). L7 is under D-PF5-DIAMONDCAM; the hand is a GAP (hands/no-zoom.json:135-139) | lb07 page `fad1e931…` | **carry** | nothing |
| side_plank | lb09 (:59) | PF5 round-2 PASS **6853178277** (L4, abs Also working) | lb09 page `ce27e3b7…` | **carry**. `9b2eb113` later changed its `libraryDiff` (Q-W9-6) | nothing |
| wall_ball | lb10 (:208) | PF5 round-2 PASS **6853178277** (L1, L5, L6) | lb10 page `9707a074…` | **carry** | nothing |
| jumping_jacks | lb10 (:189) | **D-W8C-JJ** (lib-ship-w8c-card.md:27). W7 round 1 failed L1 [3,4,3], L5 [3,3,3] and L8 [3,3,4] (lib-platefix-5-card.md item 1 table) | its sheet at `c51ae277` | **round 2**: re-apply `c51ae277`'s sheet hunk, then the supervisor's crop check of L1 (with the `knees` text checkpoint, PF5 ruling 3), L5 and L8. **A second failure holds it** | nothing on main. Its HT4 and HT10 results on the zoom-only `ZOOM_ROT` Wrong are [unverified] |
| underhand_lat_pulldown (**conditional**) | lb01 (:129) | PF5 panel **6851987591** (plate approved; the sheet failed only L3), with L3 cleared by **6852356177**. W8a round 1 (6760254084) was the earlier look | PF5 scratch lb01 page `72732fc9…` @ `f487c797` (6850595073) | **carry** | **F-UNDERHAND-FAMILY** must merge by LAYERS READY (S4) |
| mountain_climbers (**conditional**) | pilot-a (:222) | W8a panel 6760254084 @ `29e4af37` (L7 passed, L3 failed). The round-2 evidence was recorded at `0523227e` under D-W8C-MCHOLD (**6895200917**) | the scratch card at `0523227e`: hand panel `594e9df8…` (`SCRATCH_PANEL`) | **round 2**: the supervisor's crop check of L3 and the hand panel. **A second failure holds it** | **F-PALMFLAT-APPTYPE** must merge by LAYERS READY (S4) |

**N:**
- 84 → 96 with the 12 unconditional rows;
- 97 or 98 with one or both conditional rows;
- one fewer for each hold.

### The two freed holds, exactly
- **conventional_deadlift ships on two comments:**
  - 6872578643, the fresh blind panel: L5 [4,4,4] PASS, and L4 [4,3,3] given one fix round (D-DL-L4);
  - 6874288878, the supervisor's round-2 crop check: "L4 PASS", which binds card `318f30ab…`.
  - #427's TRAIN HEAD review (6895022993) passed, and it merged as train 97.
- **bulgarian_split_squat ships on 6869858026:** "PASS on every item, L5 included (L5 [4,4,4])", bound to card `bcd016a4…bb99`. #426 merged as train 98, and its last review delta (6898578441) found C10 still asserting `cardOf(now) === PANEL_CARD`.
- **Both carries hold only if** the card on W9's base equals the bound card after #423's replacements (Q-W9-2). Any other moved byte is S1.

## What each page needs
The recipe for each new row:
- the id goes into `groups[0].ids` in batch-file order;
- a `closeups` row `{ "optionsKey": "<id without lib_>" }` is added where main has none.

Those are the recipes PF5 (6850595073) and W8b/W8c judged from.

| page | ids added | config rows |
|---|---|---|
| lb02 | barbell_bench_press | group entry before `lib_dumbbell_pullover`. The closeups row is on main |
| lb03 | conventional_deadlift, sumo_deadlift | group entries in the `1fdf6975` order (f-dl-liftoff-card.md:111). The closeups rows are on main |
| lb04 | bulgarian_split_squat | group entry, plus closeups `{ optionsKey: 'bulgarian_split_squat' }` (#426 config `b3ab788a…`) |
| lb05 | cable_curl | group entry, plus closeups `{ optionsKey: 'cable_curl' }`. Any `pair` field that gen/hands.mjs asks for is named in the PLAN [unverified] |
| lb06 | cable_chest_press, hip_adduction | group entries, plus two closeups rows |
| lb07 | cable_external_rotation, diamond_push_up | group entries, plus two closeups rows |
| lb09 | side_plank | group entry. The closeups row is on main |
| lb10 | jumping_jacks, wall_ball | group entries. The closeups rows are on main |
| lb01 (cond.) | underhand_lat_pulldown | group entry, plus the `29e4af37` closeups row (`pair: 'bar-pulldown-under'`, `pairFaults: ['curled']`) |
| pilot-a (cond.) | mountain_climbers | the three W8c changes (lib-ship-w8c-card.md, "What each id needs"): the `29e4af37` crop hunk 1, the `css.spine` closeups row, and the #424 layers row |

- **jumping_jacks' sheet:** only `c51ae277`'s `lib_jumping_jacks.howto.mjs` hunk (toe-out 39.75° by `ZOOM_ROT 40`, sizePx 110 → 100, 6850595073). `c51ae277`'s 48-line test block goes into W9's own test file (Q-W9-4).
- **Push hints:** bbp adds "Palm base, wrist not bent back." (`lib_barbell_bench_press.howto.mjs:199`), and cable_chest_press adds "Push through the palms." (:234). ids.ts goes from 1,569 B to about 1,690 B [est], against IDS_MAX 2,048.
- **New handpair sub-keys:** each gets a `handpair-` budget entry, named by `pairs.mjs:418`:
  - mountain_climbers: `palm-flat-floor-only-hand-ahead-over`;
  - underhand: its `bar-pulldown` `-only-curled-` key [derived, not built].

## Lessons carried in (each is a rule here)
1. **Scratch dry run before LAYERS READY** (Q-W8b-4, W8c lesson 1). In a scratch worktree that is never committed:
   - flip the wave with scratch stamps and provisional page entries;
   - run `generate`, `generate --check`, `npm run typecheck`, `npm run build`, `howto-rebuild`, `fidelity.mjs --ids <wave>` and the library unit suites;
   - run `familyRefusal` and `lintLibraryRow` per id (Q-W8c-8);
   - **run the gate once** (Q-W9-3).
   LAYERS READY lists every red with a hold recommendation.
2. **An exact LINK pin on every layers-page entry** (W8b REVIEW FAIL 6869580972). Each page W9 re-pins gets its appended `'supervisor'` entry checked whole, in the `checks/ship-w8b.ts` / `ship-w8c.ts` form, with its own reds: another sha, another comment id, a moved page pin, other ids, and a moved superseded pin. A check on some pages only is a FAIL.
3. **MANIFEST commits carry `[golden update]`** and change only by `manifestOf`.
4. **Regenerate headers on merges; never hand-merge them** (D-PFS-HEADERS). Other cards' MANIFEST or header pins get a W9-first transform (`lessW9`, `w9GenText`), with every old red kept.
5. **Holds go to main's bytes in the D-PF4 form,** and the held id's generated files are deleted by hand. generate does not delete them (D-W8C-MCHOLD; F-GEN-HELD-CLEAN is owed). A guard asserts that none remain (`ship-w8c.test.ts` form).
6. **A second failure holds the id (D-LIB13-PANEL2).** This binds jumping_jacks and mountain_climbers, and any carry that S1 turns into a check that then fails.
7. **Text-zoom rows** go in the D-W8C-TEXTZOOM-LOOPS exact set, if the dry run finds one in W9 (gen/ids.mjs:59).

## Do
0. **PLAN** (no app file): a 'W9 PLAN' section in `docs/howto/library/LIB-SHIP-DESIGN.md`, posted as 'SHIP W9 PLAN READY @ <sha>'. Wait for 'SHIP W9 PLAN RULED'. Re-checked on the base, it gives:
   - per id: page, config rows, check kind and judged reference;
   - **the judged card sha256 for each carry**, rebuilt from its judged page recipe at its judged head. bbp's comes from `4c4cf718` @ `7b4e4866`;
   - static pre-checks: `familyRefusal` null and `lintLibraryRow` []; visible words;
   - D-SHIP-FLAGS per id (lib-ship ruling 11, D-OWNER-FLAGS);
   - ids.ts bytes;
   - the other cards' test lines that go red (below).
1. **Configs and pages.** Write the config rows. Build each changed page twice from the committed configs, with equal sha256.
2. **Card compares** against each judged reference: the judged card plus #423's replacements, applied as a pure text substitution (Q-W9-2, `f-sheet-copy-card.md:135`), must equal the new card byte for byte. jumping_jacks' compare is main's card plus the `c51ae277` hunk only. Any other moved byte is posted, and that id goes to a supervisor delta check (S1).
3. **Dry run** (lesson 1). Then post 'SHIP LAYERS READY W9 @ <sha>' with:
   - each page's sha256 and bytes from two builds;
   - the compares;
   - the dry-run reds with hold recommendations;
   - jumping_jacks' measured toe-out and its L1, L5 and L8 shots, and mountain_climbers' hand panel shots (if joined), in Silent Black and Paper at 390 px.
4. **Wait** for the round-2 crop checks and any delta checks, then for 'W9 LAYERS APPROVED' with the STAMP list (D-SHIP-LPANEL). A fix goes in one round, with a test that is red before and green after, plus a mutation.
5. **Pins and flips:**
   - layers-page entries appended as `'supervisor'` (D-BODYMAP-APPEND), each with its LINK check (lesson 2);
   - reviews.json entries copied verbatim from the STAMP comment;
   - flip the stages and run the generator;
   - budgets at measured + 10 %, setBy LIB-SHIP: ht-, posture- and feel- per id, handpair- per new sub-key, loaders `perId n` = N, totals within `totalCeiling` at N;
   - the exact-set guards with reds (lib-ship A1 and the A9 guards of every page touched, in the W8b/W8c form; c15 `W9_RULED`; `checks/ship-w9.ts`);
   - the MANIFEST commit with `[golden update]`.
6. **QA and READY:**
   - merge `origin/main` with a merge commit and regenerate;
   - run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` once on the finished head;
   - CI must be green, including every howto-shard and gate-verdict;
   - post 'SHIP W9 READY @ <full sha>' with a "You will notice" line and every other-card test edit named. A fresh Opus reviewer follows.

## write_scope
- lib-ship-card.md's write_scope for these ids:
  - batch stage edits in `batches/{lb02,lb03,lb04,lb05,lb06,lb07,lb09,lb10}.json`, plus `lb01` and `pilot-a` for the conditional rows;
  - those pages' `pages/*.layers.json`, the `pilot-a` closeups row, and the golden `.json` chains (append only) and `.layers.html`;
  - `lib_jumping_jacks.howto.mjs` (the `c51ae277` hunk only) and `lib_mountain_climbers.howto.mjs` (the W8c crop hunk only);
  - generated files (by the generator only), `budgets.json`, `ci/times.json` (measured), reviews.json (verbatim STAMP), MANIFEST.json (`[golden update]`);
  - a new `tests/howto/checks/ship-w9.ts` and `tests/howto/ship-w9.test.ts`, guard replacements, and `LIB-SHIP-DESIGN.md`.
- **Other cards' test lines,** each named in the PR with before and after, and kept at least as strict (Q-W8b-1 form). Known now:
  - `platefix5-w6.test.ts`: the byte proof over 157 close-ups at main's digest includes jumping_jacks (`9b2eb113`). jumping_jacks leaves that set, and its new zoom is pinned in W9's own file;
  - `platefix5-w7.test.ts:290` (the hold note) and the PF5 tests that assume a PF5 id is in no committed group;
  - `checks/ship-w4.ts` W4_WAITING (bbp, conventional, sumo);
  - `checks/ship-w8b.ts` and `checks/ship-w8c.ts` held sets (conventional, sumo, bulgarian, underhand, mountain_climbers);
  - `ship-w8c.test.ts`'s no-generated-file check for those ids;
  - `f-dl-liftoff` (D-DL-NOFLIP) and `f-bss-rearknee` scratch builds, moved to an in-test, sha-pinned copy of main's pre-W9 config (Q-W8c-4 form);
  - lb2-lb10 A9 exact sets;
  - `pair-faults.test.ts` sub-key lists, if the new committed sub-keys turn them red.
  The dry run gives the exact list.
- **Never:**
  - the Never list of lib-ship-card.md;
  - the tool cards' files: `lint/family.mjs`, `src/howto/content-types.ts`, `gen/**`, `library/fidelity.mjs`, `fidelity/**`, `hands/pairs.mjs`, `build-layers-page.mjs`, `render/**`;
  - any plate spec or plate pin; research cards and quotes; the 8's chunks; held ids' bytes;
  - `scripts/screenshot-gate.mjs` (add-only; W9 adds nothing there).

## Stops (post on the PR and wait)
- S1: a card compare moves a byte that is neither named nor one of #423's replacements. That id is held for a supervisor delta check; never re-pin around it.
- S2: a check passes only by loosening a guard, a floor, a budget rule, a LINK pin or IDS_MAX.
- S3: the dry run finds a tool red (twin, fidelity, generate, typecheck) on an id. Hold that id in the D-PF4 form and recommend a follow-up. A tool fix never goes inside this wave.
- S4: F-UNDERHAND-FAMILY or F-PALMFLAT-APPTYPE has not merged by LAYERS READY. Its row is held at main's bytes and goes to the next wave; W9 does not wait.
- S5: the dry-run gate is red in another task's block because of a W9 flip (a Train card gains the pill and hint line). Hold that id; never edit the other block (AGENTS.md screenshot-gate rule).
- S6: two failed tries of one approach with no new evidence.

## Acceptance (each mutation turns red and is restored; the PR lists each red line)
- **A1 Exact set.** `shippedIds()` = main's set plus exactly the approved W9 ids, with conventional before sumo. Every held id is `approved-plate` at main's bytes and has no generated file.
  - Mutations: an unruled id shipped; a held id shipped; sumo shipped without conventional; an approved id left at `approved-plate`.
- **A2 Carry compares.** Each carried card = its judged card + #423's replacements, byte for byte. jumping_jacks' card = main's + the `c51ae277` hunk only.
  - Mutation: one byte elsewhere in a carried card is red.
- **A3 jumping_jacks.** Toe-out ≥ 30° per foot (39.75° expected), sizePx 100, the Wrong inside the panel, direction marks in the fault token in both themes, and the `knees` text checkpoint printed. `c51ae277`'s block, moved into `ship-w9.test.ts`, is green.
  - Mutations: toe-out 29.7° (main's value); sizePx 110.
- **A4 conditional rows.** underhand: `familyRefusal` null on the flip head (F-UNDERHAND-FAMILY's map). mountain_climbers: `npm run typecheck` exit 0 with its chunk, the panel sha `594e9df8…`, heads UNDER SHOULDER / HAND AHEAD, and the W8c feel line kept.
  - Mutations: the old family.mjs:69 entry restored (generate red); `pairNote` dropped.
- **A5 LINK pins** on every page W9 re-pins (lesson 2), each with a wrong-sha red and an other-comment red.
- **A6 Stamps.** `stampProblems(shippedIds())` is []. Each entry is copied from the STAMP comment.
  - Mutations: one sheet string edited after its stamp; one approval swapped.
- **A7 Size.** The budget rows above; ids.ts ≤ 2,048 B and ids.ts + lazy.tsx ≤ 3,072 B. The PR prints the How-to total gz against the 6 MB HT-11b trigger.
  - Mutation: a third new distinct hint, posted with its ids.ts bytes.
- **A8 Library CI.** gate-verdict reads `library: full`, and the proven ids equal the shipped library ids.
- **A9 Guards replaced, never loosened** (lib-ship ruling 3). The reviewer checks that every old mutation still turns red.
- **A10 Nothing else moves.** Every other shipped card on each re-pinned page is byte-equal to main's page, card for card. GOLDEN.json and the 8's chunks are unchanged.
- **A11 Green.** check, test:tz and the gate pass on the merged head, and CI is green.

## Mutations (summary)
| id | mutation | red |
|---|---|---|
| m1 | an unruled id at `shipped` | A1 |
| m2 | sumo shipped, conventional held | A1 (D-LIB10-PARENTS) |
| m3 | one byte outside #423's replacements in bulgarian's card | A2 |
| m4 | jumping_jacks toe-out back to 29.7° | A3 |
| m5 | family.mjs:69 back to main's entry (scratch) | A4, generate's library gate |
| m6 | another sha in one page's LINK entry | A5 |
| m7 | another comment id in one page's LINK entry | A5 |
| m8 | a sheet string edited after its stamp | A6 |
| m9 | a budget entry 1 B over measured + 10 % | A7 |
| m10 | one byte in another card on a re-pinned page | A10 |

## Order and dependencies
- **W9 starts after #429 W8c merges** (train 101). Both waves touch lib-ship A1, c15, budgets `n`, reviews.json, MANIFEST and the generated ids, loaders and coverage files, and W8c's lb03 entry is what W9's supersedes.
- **F-UNDERHAND-FAMILY and F-PALMFLAT-APPTYPE** build in parallel lanes and merge before W9's LAYERS READY, or their rows wait (S4).
- **W10** (the layers wave, plan-w9.md section 3) builds ahead in scratch from W9's PLAN and merges after W9. It re-pins lb02-lb07, lb10 and pilot-b again, in the D-PLATEFIX-SECOND form.

## Rulings asked (Q-W9-n, for the supervisor before 'LIB-SHIP W9 start')
1. **Q-W9-1: one lane, not split into W9a/W9b by page.**
   - Recommended: one lane. Every row is a carry or a single crop check, so the work per page is mechanical (a Sonnet helper).
   - A split would double the PLAN, the review and a 94-min CI cycle, and the second half would re-pin MANIFEST and the exact-set guards after a main merge.
   - The other lanes go to the tool cards and W10's build-ahead.
2. **Q-W9-2: the carry rule after #423.** A carried card may differ from its judged card only by #423's listed replacements, applied as a pure text substitution (`f-sheet-copy-card.md:135`, the W8c Do 2 form).
   - Recommended: yes. #423 (train 100) merged after every W9 verdict, so no row could meet a plain byte-equal rule.
3. **Q-W9-3: barbell_bench_press joins only if the dry-run gate is green.**
   - bbp is a fixture in 17 gate lines (for example screenshot-gate.mjs:1752, :6046, :8486). Its Train card gains the pill and its first hint line.
   - Recommended: yes. If another block goes red, hold bbp (S5), and the supervisor opens a gate card in the GATE-FLAKE exception form.
   - bbp's children (close_grip, decline, smith bench, incline_bb) then wait one wave longer.
4. **Q-W9-4: jumping_jacks round 2 (D-W8C-JJ).** W9 re-applies only `c51ae277`'s sheet hunk and moves its 48-line test block into `ship-w9.test.ts`. platefix5-w7.test.ts:290 and platefix5-w6's byte proof change only as named other-card edits. The round-2 look is the supervisor's crop check of L1, L5 and L8.
   - Recommended: yes.
5. **Q-W9-5: the conditional rows join only if their tool card merged by LAYERS READY (S4).** underhand carries against PF5's lb01 card (`72732fc9…`), the later and fuller look, not W8a's (W8c planned a delta against W8a's page). mountain_climbers' round-2 reference is the `0523227e` scratch card plus #423's replacements (D-W8C-MCHOLD said byte-equal; #423 merged after it).
   - Recommended: yes.
6. **Q-W9-6: side_plank's `libraryDiff` edit** (`9b2eb113`, after the round-2 build `50a35bb6`). If it moves card bytes, it is a named change, and the supervisor delta-checks only that change.
   - Recommended: yes.
7. **Q-W9-7: hip_adduction and cable_external_rotation** carry from their round-1 cards (`ef403f7b…`, `0fda01bc…` @ `f487c797`). The PLAN shows that each equals its card on the round-2 pages (`a7ed5550…`, `fad1e931…` @ `50a35bb6`). A difference is S1.
   - Recommended: yes.

## Risks and mitigations
- **A card byte moved silently** after its judging (shared renderer changes in #424-#427 and #423): Do 2's compares and S1. A held id goes to W10 and never blocks the others.
- **bbp's gate exposure** (17 fixture lines, the pill and hint line): Q-W9-3, the dry-run gate, and S5.
- **The two round-2 rows fail again** (jumping_jacks, mountain_climbers): a hold, not a delay. jumping_jacks then needs a close-up redraw card (PF6a).
- **Panels judged the module's hand zoom, but the app shows the pair panel** (cable_curl, underhand; F-LAYERS-HANDPAIR): D-PF5-HANDPAIR crop-checked the app render (6852356177). The card stays open for later waves.
- **Many pages in one wave** (8, up to 10): one LINK check helper for all pages (lesson 2), and a Sonnet helper for the per-page steps.
- **Holds leave generated files** (F-GEN-HELD-CLEAN not done): lesson 5 and its guard.
- **The gate O1 launch-skip probe flakes** (F-GATE-O1-TAPCLOCK, #429 6898918927): one re-run with the cause stated, as on W8c.
- **The worker-lag guard** (30 s per block; 15 s CI budget): any new W9 block over 10 s locally runs as an awaited `child.it` (#365 form).
- **Usage limits:** the 80 % pause rule, and a WAITING post with a HANDOFF block.

## Forecast [est]
Measured base:
- W8b: PLAN → READY 14 h for 17 ids;
- W8c: about 1.5 days to merge for 3 ids;
- full CI about 94 min (run 43542476170);
- fidelity 698-882 s per id (W8c dry run).

W9 (12-14 ids, 8-10 pages; no panel):
- PLAN 2 h;
- configs, pages and compares about 4 h;
- dry run about 3 h, of which fidelity is about 2.8 h serial for 12 ids, or less in parallel shards;
- the supervisor's crop checks about 1 h;
- pins, guards, budgets and the other-card tests about 6 h;
- merge, regenerate and CI about 2.5 h;
- review and one fix round about 3 h.

**Total: READY about 1.5 days after W8c merges, merged about 2 days after.** Main then goes 84 → 96 (98).

Uncertainty: an S1 moved byte (+0.5 day on that id only); bbp's gate result; the CI queue; the weekly limit.

## Not verified here
- No page was built and no card compared. Every carry assumes its card on W9's base equals the judged card plus #423's replacements.
- bbp's judged card sha (lyr-pf11 names the page `4c4cf718`, not a card).
- That hip_adduction's and CER's cards on the `50a35bb6` pages equal their round-1 cards.
- Whether cable_curl needs a `pair` field in its lb05 row, and the names of the new handpair sub-keys.
- jumping_jacks' HT4 result on its zoom-only `ZOOM_ROT` Wrong, and its HT10 floor.
- The gate effect of bbp's flip.
- D-SHIP-FLAGS per id (D-OWNER-FLAGS approved the 57 then-flagged ids as named exemptions; the PLAN lists them).
- Whether F-UNDERHAND-FAMILY and F-PALMFLAT-APPTYPE land before LAYERS READY.

return: PR and head sha; links to PLAN, LAYERS READY, the checks, LAYERS APPROVED, STAMP and READY; per id: page, check kind, compare result and stamp hash; each page's sha256 from two builds; the budgets diff, ids.ts bytes and the How-to total against 6 MB; the mutation list; check, test:tz, gate and CI output.

Resume rule: when WAITING, resume only on the supervisor's exact words 'LIB-SHIP W9 resume', sent to the session or posted on the PR.

## Supervisor rulings (2026-11-16; these win over the text above)
All seven are accepted as recommended:
- **D-W9-ONELANE** (Q-W9-1).
- **D-W9-CARRY-SC** (Q-W9-2): a carried card may differ from its judged card only by #423's listed replacements, as a pure text substitution. Any other byte is S1.
- **D-W9-BBP** (Q-W9-3): bbp joins only on a green dry-run gate; otherwise it is held under S5 and a gate card follows.
- **D-W9-JJ** (Q-W9-4): jumping_jacks round 2. The supervisor crop-checks L1, L5 and L8, and a second failure holds it.
- **D-W9-COND** (Q-W9-5): underhand and mountain_climbers join only if F-UNDERHAND-FAMILY / F-PALMFLAT-APPTYPE merged by LAYERS READY.
- **D-W9-SIDEPLANK** (Q-W9-6).
- **D-W9-HIPCER** (Q-W9-7).

Also:
- **Worker-lag:** no new exception entries. Every block stays at most 10 s locally and 15 s in CI, or moves to an awaited child.it.
- **Order:** W9 builds ahead now and merges after W8c (#429) and the two tool cards that its conditional rows need. Merge main at your turn.
- PLAN first.

