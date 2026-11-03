Card LIB-SHIP: switch the 134 drawn library How-tos on in the app, in 7 waves after a PLAN (2026-11-03; status `ready`: the supervisor's rulings are at the end and win over the proposals. Nothing starts before 'LIB-SHIP start'.)

Sources (every file:line was read at these heads; [est] marks an estimate, [unverified] what no run here checked):
- main `b9369130` (train 62, "Main holds 142/153", lib4-cards.md:4696). Read with `git show origin/main:<path>` and `git grep … origin/main`; nothing checked out, built or run in the repo.
- claude/sup-lib4-cards `1ee69c9a`: lib4-cards.md (:73 D-LIB4-ENTRY, :1055-1070 D-LIB4-ENTRY-2, :1216 W2B and the back box, :2858-2875 OPEN-6 D-LIB5-FAMILY, :3193-3197 D-LIB10-PARENTS, :4697 D-OWNER-LIB142), lib-split-card.md (house format), lib-10/13/14/15/16/17/18/21/22-card.md merge_prerequisites, lib-8-merge-card.md:239/:291/:402.
- Plan: claude/howto-options `d8d4b2e6`, docs/howto/library/LIBRARY-HOWTO-ARCHITECTURE.md ("plan" below).
- CI: run 41642902064 (main `b9369130`), 41627562533 (`7ed2da4f`), 41549354538 (`2f6ca539`), read with `gh run view` / `gh api …/artifacts`.
- Scratch measures (scripts in `<scratchpad>/ship/`, never committed): `git archive origin/main tools/plates docs/research/howto src/data tests/howto/golden tests/howto/budgets.json` into `ship/tree`; Python over the rows, cards and budgets; `node ship/scripts/hands.mjs ship/tree` (loads `hands/pairs.mjs` loadKeyModules and lists each key's IDS and GAPS). No app build, no vitest, no gate run here.

id: LIB-SHIP
model: claude-opus-5-5 (134 How-to sheets written from verified cards, card-true hand close-ups, family maps, guard replacements: judgement work). Mechanical sub-steps (re-pins, budget entries from measured numbers, regenerate) may go to a `sonnet` helper with every step spelled out.
mode: auto
title: 'Builder: LIB-SHIP W<n>, the <batch> How-tos on'
branch: one per wave, `claude/lib-ship-w<n>` from the latest main; W1 first and alone. First push opens a draft PR 'LIB-SHIP W<n>: <ids count> How-tos on (<batches>)'.
slot: replaces plan 7 rows 8-22's per-batch ship cards (plan :805-819) with W1-W7 in that order (ruling 1). The supervisor names the checklist slot in each start message.
lane: W1 alone. After W1 merges, up to 3 wave lanes at once (plan cap 4 builders, plan :792), merges strictly W2 → W7.

## Why now
- The owner decided on 11-03: "release with the 142 drawn rows"; the 11 named rows "ship with no How-to button … and are added in a later update" (D-OWNER-LIB142, lib4-cards.md:4697). "Next: the ship card (switch the 142 on in the app), then the release candidate" (same line).
- The app ships 8 How-tos: ids.ts holds 8 four-character hashes (src/howto/ids.ts:5, 32 chars) and LOADERS 8 imports (src/howto/generated/loaders.ts:17-26). The Train card shows the entry only where `hasHowTo(ex.id)` is true (src/slices/workout/Train.tsx:830) and the hint line under it (Train.tsx:832).
- Every build-ahead card ended with "the ship card takes over the branch. You will notice: nothing in the app" (lib-10-card.md:92, lib-14:113, lib-15:115, lib-16:111, lib-17:127, lib-18:131, lib-21:126, lib-22:138).

## Scope: what ships, what stays off (counted on `b9369130`)
| Where the row is today | Rows | Ships here | Note |
|---|---|---|---|
| tools/plates/plates.json (the 8) | 8 | already shipped | unchanged |
| batches/pilot-a.json, -a2, -a3, pilot-b.json (stage `approved-plate`, pages and plate pins exist) | 13 + 2 + 2 + 4 = 21 | 21 | layers pages are named but **not committed**: `pilot-a.layers.html` and `pilot-a.layers.json` are absent (batches/pilot-a.json:6-7; `git ls-tree` of tests/howto/golden/library/ and pages/) |
| lb1..lb10/rows.json, pilot-b2/rows.json (stage `drawing`, never in batches/: lb1/rows.json note) | 13+8+12+12+15+12+11+8+9+12+1 = 113 | 112 | lb1/rows.json:114 holds `lib_leg_press_calf_raise`, which has **no spec** (specs/ lists none) and is on the owner's list: it never ships |
| zoom/rows.json | 1 (horizontal_leg_press) | 1 | held out of lb1/rows.json (lb1/DESIGN.md:48-49), approved @ `9fbdfb5` (lib4-cards.md:4167), pinned in zoom/approved.json (lib-zoom.test.ts:76-80) |
| the owner's 11 | 11 | 0 | 9 have a spec but no row (lb7/build.mjs:69, lb8/build.mjs:69, lb9/build.mjs:70, lb5-plates.test.ts:49); bicycle_crunch has neither |

- 8 + 21 + 112 + 1 = **142**; 134 to switch on. 142 + 11 = 153 = src/data/exercises.json (no id outside it; no overlap between the four sources; checked by script).
- The 134 by tier (card `tier`): A 45, B 25, C 64. By hand archetype (coverage.ts): hold 25, push 24, none 19, pull 17, balance 14, curl 13, palm-flat 10, implement 5, on-body 4, hang 3.

### What a "ship" is, from the code
A library row ships when its registry stage is `shipped` (registry.mjs:77). Then the generator:
- cuts its plate from its batch plates page after the page and plate pins and the QA node half (gen/plates.mjs:167-187);
- reads its How-to source as full HowToContent (`handling, contacts, setup, posture, zooms, chips, copy, mistakes, risks, riskFlags, redFlag, sources, research`, gen/content.mjs:32, :89-100);
- cuts its hand, posture and feel chunks from its batch's committed, pinned layers page (batch-golden.mjs:50-58);
- refuses on the family check, the library lint and a missing C15 stamp (gen/library-gate.mjs:52-63), and on the variant line (gen/variant-gate.mjs).

**All 144 library How-to sources on main are stubs**: `export default { id, research: { card } }`, "the ship card writes the layer copy later" (e.g. howto/lib_barbell_row.howto.mjs:1-2; all 144 match the stub form, checked by script). So this card **writes the How-to sheet of every one of the 134**, from its verified research card (cards carry grip, setup, posture, handlingMistakes, feel, risks, redFlags, zooms; e.g. docs/research/howto/cards/barbell_row.json). The plates are done and approved; they are not redrawn.

### What the user sees
- Train card: the "How to do it" pill on all 142 (Train.tsx:830, label from ids.ts:4); on push-archetype rows a hint line from the sheet's `handling.cue` (Train.tsx:832; content.mjs pushHints). The 11 show no pill and no hint, like every unshipped row today.
- The sheet: the approved plate, then the layer sections in golden B's chrome. This card adds no chrome, label or heading text outside per-id sheet data; per-id strings follow the AGENTS UI-copy and heading rules (AGENTS.md:14; ruling 9).
- No new saved or sent data: How-to reads and sends nothing (C17) and storage keys do not change (plan :652-657). No new dependency.

## Measured
| What | Number | How |
|---|---|---|
| CI on main today | 17 jobs, 73 min wall; unit-tz 70.3 min of its 75-min cap (build-apk.yml:89); howto-shard 1/1 with 0 ids 20.5 min | `gh run view 41642902064 --json jobs` |
| unit-tz on the 2 runs before | 40.6 min, 68.2 min | `gh run view 41627562533`, `41549354538` |
| Library shard plan at 134 shipped ids | **K = 135** (each unmeasured id plans the largest measured time, 915.6 s; c0 2.9 + 915.6 > 900, so one id per shard, and shard 1's once-states 1,186 s hold none) | ci/plan.mjs:22-26, :42-60 with ci/times.json |
| Runner time of one full library run at 134 [est] | 135 × ~18 min ≈ 40 runner-hours; wall ≈ 2-2.5 h at 20 concurrent jobs (plan :636, "not verified") | from the measured per-id 907-916 s (times.json) and the 20.5-min shard |
| Debug APK today | 4,775,096 B (artifact zip) | `gh api …/runs/41642902064/artifacts` |
| How-to total of the 8 | 1,324,521 B raw / 333,813 B gz; per-chunk means gz: ht 10,922, feel 8,042, posture 7,393, hand 12,025 | tests/howto/budgets.json totals and budgets; budgets/hands.json |
| Total ceiling at N = 142 | ceil(m·11·N/80): 25,861,273 B raw / 6,517,699 B gz; loaders chunk 89,054 / 21,244 B | budgets/total.mjs:4-7; ht10-budgets.test.ts:19-32 allows it per shipped N |
| Projected How-to total at 142 [est] | 3.87 MB gz (library rows with no own hand chunk) to 5.48 MB gz (each with an 8-like hand chunk); raw +14.7 to +20.2 MB | 8's per-chunk means × 134 |
| HT-11b trigger | 6 MB gz of How-to assets (plan :541, :869) | — |
| ids.ts at 142 ids | 1,647 B with 1 hint text; 1,953 B with 10 distinct ~30-char hints; 2,021 B with 12; **2,055 B with 13 (over IDS_MAX 2,048)**; 2,463 B with 25 | Python FNV-1a replica of ids-encoding.mjs:28-33 written into ids.ts; limit ids-encoding.mjs:8, footprint.test.ts:39; ids.ts + lazy.tsx (1,001 B) ≤ 3,072 (footprint.test.ts:42-43) holds in every case |
| Push ids that could carry a hint | 24 of the 134 + machine_chest_press = 25; at most 26 distinct texts (ids-encoding.mjs:60) | coverage.ts archetypes |
| Hash collisions among the 153 | none | same replica |
| Golden B layers page (the 8) | 2,320,561 B → ~290 KB per id; 134 ids ≈ 39 MB of committed layers pages [est] | `git ls-tree -l` tests/howto/golden/ |
| Card blockers among the 134 | 38 cards with non-empty `inherit[]` (133 fields), only 8 mapped in INHERIT_MAP (lint/family.mjs:19-33); 21 link `back` but are not in the back box's 35-id appliesTo; 18 carry a tier-A "way out" gap; 77 want a hand close-up: 24 drawn by a pair key, 19 a recorded GAP, 34 neither | cards; shared/back-pain-box.json; `ship/scripts/hands.mjs` |
| Gate lines naming a to-ship id | 48 lines, 13 ids (lib_barbell_bench_press 17, lib_farmer_s_carry 6, lib_plank 4, …) | grep of scripts/screenshot-gate.mjs |

### Blockers found in code (each turns the generator or a test red the moment the first library row ships)
- **Family resolver missing.** library-gate.mjs:56 calls `familyRefusal(row.id, content, readCard)` with no `shipped` argument, so every row with a mapped inherit[] is refused ("no shipped-content resolver", family.mjs:78), and the 30 unmapped children are refused earlier (family.mjs:76). LB1's 8 mapped children and every other child are blocked until this is wired.
- **library-lint.test.ts:386** asserts `SHIPPED.length` is 8.
- **15 "nothing ships" guard blocks in 11 test files**: lb1-plates.test.ts:968, lb2:709, lb3:123, lb4:136, lb5:154, lb6:181 and :1476, lb7:174, lb8:200, lb9:977, :1037 and :2067, lb10:273 and :1059, lib11-pilot-b2.test.ts:290. Each is red on a row at `approved-plate` or `shipped`.
- **lbN builds read rows.json as an extra batch** (lb1/build.mjs:27-29); a row in both a batch file and rows.json throws (registry.mjs:35).
- **Totals entry**: rawMax/gzMax (budgets.json `totals`) equal the 8's ceiling; the gate takes min(per-N rule, entry) (screenshot-gate.mjs:9311-9315), so the entry must be re-set per N within the rule.

## Files it may touch (write_scope)
- **Registry and pins:** new `tools/plates/library/batches/<lb>.json` per LB, pilot-b2 and zoom (ruling 2); stage edits in batches/pilot-a.json, -a2, -a3, pilot-b.json; new `tools/plates/library/pages/<batch>.json` and `<batch>.layers.json`; `tests/howto/golden/library/<batch>.json` (append-only chains) and `<batch>.layers.html`; tools/plates/library/MANIFEST.json (rows added or replaced only in the commit that adds the pin, ci/manifest.mjs:13).
- **Sheets:** tools/plates/library/howto/lib_<id>.howto.mjs for the wave's ids (full HowToContent); new hand key or view files under tools/plates/library/hands/ only under ruling 8.
- **Moved build-ahead sources:** tools/plates/library/lbN/rows.json, pilot-b2/rows.json, zoom/rows.json (rows leave as they enter a batch), lbN/build.mjs, pilot-b2/build.mjs, zoom/build.mjs (read the batch file), lbN/DESIGN.md (a 'LIB-SHIP' section).
- **Generator code:** tools/plates/gen/library-gate.mjs (pass the shipped resolver, ruling 4); tools/plates/library/lint/family.mjs (INHERIT_MAP entries only, as ruled).
- **Generated:** everything `node tools/plates/generate.mjs` writes (src/howto/**, src/slices/howto/css/**, docs/research/howto/sources.json and lib_*.json, tools/plates/library/ids-node.mjs). Never hand-edited or hand-merged: regenerate after each main merge.
- **Budgets:** tests/howto/budgets.json (new per-chunk entries at measured + 10 % with setBy LIB-SHIP; perId `n`; totals within budgets/total.mjs at N); tools/plates/library/ci/times.json (measured per-id times only, from CI proofs).
- **Tests:** the guards above, replaced under ruling 3; tests/howto/library-lint.test.ts (:386 and the INHERIT_MAP coverage test :385-391); tests/howto/lbN-plates.test.ts reads of rows.json; a new tests/howto/lib-ship.test.ts.
- **Scratch-target swaps** (D-LIB13-SCRATCHIDS lib-13-card.md:325, D-LIB16 lib-16-card.md:350, D-LIB17 lib-17-card.md:409): tools/plates/library/ci/scratch.mjs targets and tests/howto/library-ci.test.ts lines they name, in the push that first moves that row into batches/.
- **Gate:** scripts/screenshot-gate.mjs, **add-only**, one block named LIB-SHIP (AGENTS.md:73).
- **Docs:** docs/howto/library/LIB-SHIP-DESIGN.md (new: the PLAN and per-wave tables); docs/COACHING-DECISIONS.md (append).
- **Never:** tools/plates/library/specs/**, eq/**, vendor/**, layers/**, qa/**, zoom/inline.mjs, strip/**, templates/**, derive.mjs, candidate.mjs, registry.mjs, build-page.mjs, plates-page.mjs, build-layers-page.mjs, render/**, tools/plates/golden.mjs, tools/plates/generate.mjs, gen/plates.mjs, gen/content.mjs, gen/ids.mjs, ids-encoding.mjs (IDS_MAX), lint/index.mjs, copy-lint.mjs; docs/research/howto/cards/** and quotes/** (research's; route edits as follow-ups); docs/research/howto/reviews.json except entries copied verbatim from a supervisor STAMP comment (ruling 10); tools/plates/plates.json, GOLDEN.json, golden A and B pages; src/slices/**, src/app/App.tsx, src/main.tsx, src/core/**, src/ui/styles.css, tests/theme.test.ts, .github/**, package*.json (AGENTS.md:63-75).

## Do
0. **PLAN** (W0, no app file): docs/howto/library/LIB-SHIP-DESIGN.md on claude/lib-ship-w1, posted 'SHIP PLAN READY @ <sha>'; wait for 'SHIP PLAN RULED'. It gives, re-checked on its base:
   - the 134-row table above per id: batch, tier, archetype, card parent and inherit fields, back link and appliesTo, way-out gap, hand zoom (key, GAP or own), variant line, push hint text, F7 (from each batch qa.mjs EXPECTED);
   - the wave plan below with each parent shipping no later than its children (D-LIB10-PARENTS, lib4-cards.md:3193-3197);
   - the inherit map proposal for every unmapped child field (the D-LIB9a-MAP form, family.mjs:15-18);
   - the hint texts and the ids.ts bytes they give (ruling 5);
   - the D-LIB4-ENTRY conditions re-checked on the base (lib4-cards.md:73), and every merge_prerequisites line of lib-10/13/14/15/16/17/18/21/22-card.md marked met, routed or ruled.
1. **W1, path proof (5 ids, one batch file):** pilot A's barbell_overhead_press (A, push, own hand close-up, back box in appliesTo), dumbbell_biceps_curl (curl key), rope_triceps_pushdown (rope key, push hint), pec_fly (front view, variant line), plank (floor hold; its primary `core` is text-only on the body map, plan :473-476, with abs and obliques drawn). None has an inherit[], a back gap or a way-out gap; all five red flags have a box (back in appliesTo; shoulder, elbow, wrist in golden B's shared blocks). If the PLAN finds a layer kind not built on main for one of them [unverified here: the text-only feel state], the supervisor swaps in mountain_climbers or triceps_pushdown; no new kind is built in W1.
   a. Write the 5 sheets from their cards, under the lint from the first line (riskFlags first, ≤ 450 visible words, ≤ 4 feel rows, 5 setup steps, 3 mistakes, 3 risks; plan :461-466). Every user string cites its card claim.
   b. Build pilot A's layers page for the 5 (pages/pilot-a.layers.json → tests/howto/golden/library/pilot-a.layers.html) twice, equal sha256; post 'SHIP LAYERS READY W1 @ <sha> (layers <sha256>)'. The supervisor runs the layers panel and the content and safety checks (ruling 10), one fix round, then posts 'W1 LAYERS APPROVED' with the layers-page entry and the STAMP list.
   c. Pin: the layers-page entry and MANIFEST rows; reviews.json entries copied verbatim from the STAMP comment.
   d. Flip the 5 stages to `shipped`; run the generator; add budget entries (ht-, posture-, feel-, handpair- per id at measured + 10 %; loaders perId n; totals at N = 13); replace library-lint.test.ts:386 (ruling 3).
   e. QA: `npm run check`, `npm run test:tz`, `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` once on the finished head; `node tools/plates/library/fidelity.mjs --ids <the 5>` locally; CI's howto-shard proves them (affected mode).
   f. Merge origin/main with a merge commit, regenerate, post 'SHIP W1 READY @ <sha>'. Fresh Opus review; merge in its own train; the supervisor sends the APK (ruling 13).
2. **W2, anchors (16):** the other 8 of pilot A (barbell_row, dumbbell_bench_press, dumbbell_shoulder_press, romanian_deadlift, single_leg_romanian_deadlift, upright_row, mountain_climbers, triceps_pushdown), pilot A2 (box_jump, bent_over_dumbbell_rear_delt_fly), pilot A3 (reverse_lunge, dumbbell_fly), pilot B less smith (seated_leg_curl, cable_fly, push_up), pilot B2 (crunch; its rows move from pilot-b2/rows.json into batches/pilot-b2.json with its plate pin). Lands ruling 4's resolver (single_leg_romanian_deadlift → romanian_deadlift in the same head). pilot A's layers page is re-pinned by a superseding entry (golden.mjs:150-160) with all 13.
3. **W3, LB1 + zoom (13):** the 12 drawn LB1 rows and horizontal_leg_press move into batches; leg_press_calf_raise moves to stage `left-out:D-OWNER-LIB142` (ruling 14). 8 mapped children on golden parents (family.mjs:20-29).
4. **W4, LB2 + LB3 + smith (21):** barbell_bench_press with its 4 children; barbell_row's 3 and barbell_shrug's 3 children; the deadlift chain (conventional → romanian, sumo → conventional); smith_machine_bench_press last, with pilot B's layers page re-pinned.
5. **W5, LB4 + LB5 (27).**
6. **W6, LB6 + LB7 (23)** (smith_machine_incline_press after incline_barbell_bench_press in W4).
7. **W7, LB8 + LB9 + LB10 (29)**, then the other 10 named rows at `left-out:D-OWNER-LIB142`, so C6R can run at LIB-23 (plan :101-103, :877-878).
   - Every wave W2-W7 repeats W1's a-f: move rows into its batch files with the plate pins equal to the approved fragments (ruling 2), write the sheets, layers page, panel, stamps, flip, generate, budgets, QA, READY.
   - Waves W2-W7 may build in parallel lanes; each regenerates after merging main. Trains may carry several waves, so a pair of full CI runs covers them (ruling 12).

Stops (post on the PR and wait; never work around one):
- S1 An approved plate fragment, an approved page, golden A or B, or the 8's How-to chunks would move a byte; or a spec, eq/, vendor/ or layers/ file needs an edit.
- S2 A check passes only by editing a verified card claim, by dropping a card claim, zoom or red flag without a ruling, or by loosening a limit (IDS_MAX, the budgets rule, the copy lint, the family `===`).
- S3 A card cannot be taught card-true inside the lint maxima, or two of its claims conflict on the sheet. The id is held with a research route; shipping it later is the owner's call, since his list is the 11.
- S4 A CI job hits its timeout, or a full run cannot finish in a working day. Report with the job times; never skip or drop a check.
- S5 Two failed tries of one approach with no new evidence.

## Acceptance (each mutation turns red, then is restored; the PR lists each red line)
- **A1 Scope.** `shippedIds()` equals the 8 plus the waves merged so far plus this wave, in registry order; none of the 11 is shipped; after W7 each of the 11 is `left-out:D-OWNER-LIB142` and every other id is `shipped`. Mutations: one of the 11 set to `shipped`; a later wave's id set to `shipped`; leg_press_calf_raise at `shipped`; one wave id left at `approved-plate`.
- **A2 Nothing else moves.** The 8's ht-, hand-, posture- and feel- chunk bodies and GOLDEN.json are byte-equal before and after; every shipped plate's fragments equal its approved pin (the lbN test APPROVED_FRAGS, zoom/approved.json, the pilot pins); C0 is []; `git diff --exit-code origin/main...HEAD` is empty on the Never paths. Mutations: one byte in a spec's alt (fragment pin red); one byte in golden B's page (L1 red).
- **A3 Sheets card-true.** For every shipped id: lintLibraryRow [], the variant-line rule, the family check with the resolver, and C1-C18 pass; every visible string cites a claim of its own card (parent claims only through a ruled inherit map). Mutations: 'treats' in one copy string (MEDICAL_RE, lint/index.mjs:19); a 16-word sentence; an inherited string changed in a child; a two-kind id without its variant line; one red flag removed from riskFlags.
- **A4 Pins.** Every batch golden chain verifies; each shipped row has page, layers-page and plate entries; MANIFEST problems are []; two layers-page builds give one sha256. Mutations: one byte in a committed layers page; one MANIFEST file sha; a plate entry fragment.
- **A5 Stamps.** `stampProblems(shippedIds())` is [] on every wave head (library-gate.mjs:62); each entry has approvedBy supervisor, a decision, an approval link and open 0 (research/stamps.mjs:58-64). Mutation: one sheet string edited after its stamp.
- **A6 App.** For all 153 ids and a custom id, `hasHowTo(id)` is true exactly for the shipped ids and `howToHint` equals the generated content's (ids.test.ts:58-62 form). LIB-SHIP gate block, add-only: per wave, one shipped id per batch opens its card with exactly one 44 px `.ht-entry` and opens its sheet; each of the 11 present in exercises.json opens its card with none; Silent Black and Paper. Mutations: a wave id dropped from S; one of the 11 added to S.
- **A7 Size.** Every shipped row has ht-, posture- and feel- entries (budgets.test.ts:42-58) and every used pair key a handpair- entry (:60-80); loaders perId `n` = N and the per-id rule holds (screenshot-gate.mjs:9262-9268); the totals entry is within totalCeiling at N (ht10-budgets.test.ts:19-32); ids.ts ≤ 2,048 B and with lazy.tsx ≤ 3,072 B; each posture chunk ≤ 24 KB gz (screenshot-gate.mjs:7198). The PR prints the measured total gz against the 6 MB HT-11b trigger. Mutations: one entry 1 B over measured + 10 %; a 13th distinct ~30-char hint (ids.ts over 2,048, refused by ids-encoding.mjs:89-91).
- **A8 Library CI.** gate-verdict shows `library: full` on the train head, with the proven ids equal to the shipped library ids (plan :609). The existing verdict mutation (one manifest row dropped) stays red.
- **A9 Guards replaced, never loosened.** Each "nothing ships" block above is replaced (ruling 3) by an assert that the batch's shipped set equals the ruled list, each id with plate, layers-page and stamp pins. Each keeps its old mutations and adds: a non-ruled id at `shipped` is red; a ruled id with its stamp removed is red; its rows copied back into lbN/rows.json is red (registry.mjs:35).
- **A10 W1-only.** When W2 supersedes pilot A's layers page, the 5 W1 ids' hand-, posture- and feel- chunk bodies are byte-equal (headers aside). Mutation: one W1 close-up byte changed on the new page.
- **A11 Green.** `npm run check`, `npm run test:tz` and the gate pass on the merged head; CI is green on it.
- **A12 Device.** The W1 APK goes to the owner with what to check (ruling 13); the release candidate's device checks stay LIB-23's (plan :879-880).

## Proposed rulings (for the supervisor before 'LIB-SHIP start')
1. **D-SHIP-WAVES:** W0 PLAN, then W1-W7 as in Do, merged in that order; they replace plan 7 rows 8-22's per-batch ship cards. Why: W1 proves every step (layers page, panel, stamps, generate, budgets, CI shards, APK) on 5 clean ids before 129 depend on it; the later waves follow batch boundaries and ship each parent no later than its children.
2. **D-SHIP-MOVE:** a build-ahead row enters the registry by moving, not copying: its row object goes byte-equal into `batches/<batch>.json` with `pages` and stage `approved-plate`, lbN/rows.json drops it, and lbN/build.mjs reads the batch file. New file names `lb01.json` … `lb10.json`, `pilot-b2.json`, `zoom.json`. The pilots sort after the LBs; row order changes only generated bytes (ids.ts order, loaders order), never `hasHowTo`. Why: registry.mjs:35 forbids a row in two places, and renaming the pilot files would move their golden files (registry.mjs:72-73). Answers lib-8-merge-card.md:402.
3. **D-SHIP-A9:** the build-ahead "nothing ships" guards and library-lint.test.ts:386 are replaced, not deleted, by the stricter positive set assert of A9, in the push that first ships each batch. Why: D-OWNER-LIB142 changes the intended state; the replacement keeps every old red and adds three.
4. **D-SHIP-FAMILY:** library-gate.mjs:56 passes the shipped-content resolver (loadContent of a row shipped in this head), so family.mjs stays fail-closed (an unshipped parent is still refused, family.mjs:79-80). The 30 unmapped children get INHERIT_MAP entries from the PLAN, ruled per wave as D-LIB9a-MAP was. Why: OPEN-6 item 6 left the comparator to "before any LB1 child's layer copy is written or shipped" (lib4-cards.md:2873-2874); today no child can ship.
5. **D-SHIP-HINTS:** a push id's hint is its card's grip cue, and ids with the same claim share one text; ids.ts stays ≤ 2,048 B, so about 12 distinct ~30-character texts at most (measured). No hint is invented to fill a slot. Why: 25 distinct hints give 2,463 B; IDS_MAX is never raised.
6. **D-SHIP-BACKBOX:** the 21 back-linked ids outside appliesTo (cable_chest_press, smith_machine_shoulder_press, single_arm_triceps_pushdown, leg_extension, lying_leg_curl, standing_leg_curl, hack_squat, glute_bridge, cable_kickback, cable_crunch, reverse_crunch, dead_bug, sled_push, farmer_s_carry, kettlebell_swing, medicine_ball_slam, v_up, hollow_body_hold, bird_dog, superman, resistance_band_pull_apart) get an appliesTo edit on claude/libht-research in the W2B form (opus, the supervisor's 10 % re-fetch; lib4-cards.md:1212-1216), before W5. Recommended without a new owner question: the box text is his (decision 6), and this extends where it shows, as the cards already claim. If the supervisor reads :1216 as needing him, one line in the W1 APK message with the plan's default (plan :862-863).
7. **D-SHIP-WAYOUT:** the 18 tier-A ids with a "way out" gap (barbell_row, romanian_deadlift, single_leg_romanian_deadlift, dumbbell_shoulder_press, box_jump, shoulder_press, arnold_press, skull_crusher, goblet_squat, dumbbell_overhead_triceps_extension, renegade_row, pike_push_up, weighted_dip, ab_wheel_rollout, farmer_s_carry, kettlebell_swing, medicine_ball_slam, wall_ball) need a ruled route before their wave. Recommended: the shared equipment-move cards (plan :433) where one fits; otherwise the safety checker rules whether the sheet is safe with no way-out line; otherwise the id is held (S3). W1 has none.
8. **D-SHIP-HAND:** the 19 GAP ids ship with no hand close-up (R8 null, PANELS.md:95); their grip copy carries the claims. The 34 ids with neither a key nor a GAP get a per-id close-up from the sheet's handling through LIB-6's renderer only where the GA archetype and the card give every pose number; otherwise a GAP by ruling. Why: no hand drawing is guessed.
9. **D-SHIP-HEADINGS:** new per-id chip and zoom headings follow AGENTS.md:14 (one to three words, a noun phrase, e.g. "Bar path"), not golden B's "Bar path: right and wrong" (layers/exercises/lat_pulldown.howto.mjs:296); the 8 stay as approved, recorded as a golden-B follow-up. [unverified: whether copy-lint pins the golden form; the PLAN checks.]
10. **D-SHIP-LPANEL:** each wave's layers get a calibrated panel in the PANELS §1 form on the layers page (R8, R9 at 4 or more, PANELS.md:95-96; the plan's planted defects: Right and Wrong swapped, a setup step's direction flipped, plan :514-515), a content critic on card and quotes, and the safety checker on tier-A ids (plan :479-485). The supervisor then posts a STAMP comment; the builder copies its entries into reviews.json verbatim and the supervisor diff-checks. Why: reviews.json is supervisor-owned (plan :486) and stampProblems needs a decision and an approval link.
11. **D-SHIP-FLAGS:** the merge_prerequisites' "owner's named yes" for raised F1-F4 and F7 flags (e.g. lib-22-card.md:58) is read as given by D-OWNER-LIB142 ("release with the 142 drawn rows"), with plan 8 decision 9's default (approve as named exemptions, plan :866-868); the PLAN lists every such flag and the W1 APK message names them. Alternative: ask the owner once, with that default.
12. **D-SHIP-CI:** accept K = N + 1 at P = 1 (no check dropped; P stays 1, fidelity.mjs:24-26); the full run grows to about 2-2.5 h [est] and queues, never skips (plan :636). Builders push a wave branch at most once per step (each push that touches tests/howto/** or tools/plates/** selects every shipped id, affected.mjs:26-36). Trains may carry several waves. Before W3, the supervisor decides an add-only split of unit-tz (70.3 of 75 min today) if W1 shows it growing.
13. **D-SHIP-APK:** one APK after W1 (the first library How-tos; check open time and how the sheets look), then the next at LIB-23's release candidate. Why: the owner's chat stays quiet and the RC gets the full device check.
14. **D-SHIP-LEFTOUT:** the 11 get stage `left-out:D-OWNER-LIB142` in their LB batch files (leg_press_calf_raise in W3, the other 10 in W7), with no pages and no pin, so coverage.ts and LIB-23's C6R see the decision (registry.mjs:13, :20; plan :101-103).
15. **D-SHIP-SCRATCHIDS:** the swaps owed by D-LIB13-, D-LIB16- and D-LIB17-SCRATCHIDS happen in the push that first moves those rows into batches/, each with its fixture test re-run and the changed lines listed.

## Risks and mitigations
- **CI load grows with every shipped id.** K = N + 1 (135 at 134), about 40 runner-hours per full run [est], and every push touching tests/howto/** or tools/plates/** proves all shipped ids; unit-tz is already at 70.3 of 75 min. Mitigation: ruling 12; W1 measures the real per-id time into times.json; trains batch waves; nothing is skipped.
- **134 sheets of new user copy** (golden B's 8 are 23-38 KB of authored source each). Content or safety errors are likelier than in plates. Mitigation: card-only strings, lint from the first line, the layers panel with plants, content critic, tier-A safety checks (45 ids), the 10 % re-fetch, stamps last.
- **Late blockers hold ids** (38 family children, 21 back links, 18 way-out gaps, 53 hand close-ups without a key). A held id cannot drop to the named list without the owner. Mitigation: the PLAN routes each before its wave; W1 has none; parents ship first.
- **Size and first launch.** Projected 3.9-5.5 MB gz against a 6.52 MB ceiling and the 6 MB HT-11b trigger [est]; the service worker precaches every asset (scripts/sw-version.mjs:1-9), about 15-20 MB more raw on first launch [unverified on a device]. Mitigation: W1 measures the real per-id mean and extrapolates; over 6 MB the supervisor starts LIB-24 (HT-11b) before W5; the W1 APK shows first-launch time.
- **Guard replacement weakens a check.** 15 guard blocks in 11 test files, plus library-lint.test.ts:386, change. Mitigation: ruling 3; the reviewer checks each old mutation still goes red.
- **Gate screens move** where gate blocks seed a to-ship id (48 lines, 13 ids; lib-10-card.md:262, lib-22-card.md:65). Mitigation: the gate runs per wave; any change is settled add-only, never by editing another block (AGENTS.md:73).
- **Shared-file conflicts** between parallel lanes (budgets.json, MANIFEST.json, INHERIT_MAP, generated files). Mitigation: regenerate after each main merge; keep both sides of JSON lists; W1 runs alone.
- **Repo and artifact growth.** About 39 MB of committed layers pages [est], uploaded once and downloaded by each shard. Mitigation: measure on W2; if a shard's download dominates, the supervisor rules an add-only per-shard page subset.
- **Usage limits.** About 400-600 Opus-hours over 3-4 weeks [est]. Mitigation: the 80 % pause rule (PANELS §9) and a WAITING post with a HANDOFF block.

## Forecast [est]
Assumptions: plan rates (layer sheet 2 h full, 1 h for a child; plan :896); 96 full and 38 child sheets; plates need no redraw; one fix round per wave; at most 4 builders, about 16 productive hours a day each (plan :899); CI as measured above; the supervisor answers rulings within a few hours.
- Builder: sheets 192 + 38 = 230 h; 34 own hand close-ups about 34 h; panel fixes 0.5 h × 134 ≈ 67 h; moves, pins and guard replacements ≈ 24 h; resolver ≈ 6 h; PLAN 4 h; per-wave generate, budgets, gate and CI ≈ 28 h. **≈ 390 Opus-hours**; LB lanes needed 2-4 fix rounds, so allow up to about 600.
- Supervisor: rulings 1-15; the PLAN ruling; 7 layers panels plus rechecks; content critics and 45 tier-A safety checks; 134 stamps; INHERIT_MAP rulings for 30 children; 7 reviews; 4-7 trains. About 60-90 h.
- Calendar: W1 about 3 days from start (sheets 1 day, panel and stamps 1 day, CI and train about 1 day). W2-W7 in 3 lanes about 2-3 weeks more, set by panels, stamps and full CI runs. **Last wave merged about 2.5-4 weeks after start**, then LIB-23. The spread comes from CI queue time, fix rounds and usage limits.
- Rows switched on if every step passes: 134 (142 with the 8). Any id held under S3 lowers it and goes to the owner.

return: per wave: PR and head sha; links to PLAN, LAYERS READY, LAYERS APPROVED, STAMP and READY; the per-id table (batch, sheet words, close-ups, hint, flags, stamp hash); layers-page sha256 from two builds; the budgets diff and the How-to total against 6 MB; the mutation list; check, test:tz, gate and CI output.

Resume rule: when WAITING, resume only on the supervisor's exact words 'LIB-SHIP W<n> resume' (sent to the session or posted on the PR).

## Supervisor rulings (11-03 ~20:10 UTC; status `ready`)
These win over the proposals above. The card text was drafted by an Opus research agent from main `b9369130`, then read and ruled by the supervisor. Every file:line in it is to be re-checked on the builder's base; a mismatch is a question, not a licence.
1. **D-SHIP-WAVES: accepted.** W0 PLAN, then W1 alone, then W2 to W7 merged in order. At most 3 wave lanes at once after W1 merges, and the active LIB builder count stays at 4 or fewer.
2. **D-SHIP-MOVE: accepted**, with the file names `lb01.json` … `lb10.json`, `pilot-b2.json` and `zoom.json`. The PLAN shows each row moved byte-equal (a diff of the row objects).
3. **D-SHIP-A9: accepted.** A guard is replaced in the push that first ships its batch, never before, and never deleted on its own. The reviewer checks that every old mutation still turns red.
4. **D-SHIP-FAMILY: accepted.** The resolver lands in W2, the first wave with a child (W1 has none). INHERIT_MAP entries are ruled per wave in the D-LIB9a-MAP form; each entry needs the PLAN's field-by-field table.
5. **D-SHIP-HINTS: accepted.** IDS_MAX is never raised. If more than about 12 distinct texts would be needed, ids with the same claim share one text, and an id with no claim of its own gets no hint (it still gets the button).
6. **D-SHIP-BACKBOX: accepted, no new owner question.** The owner answered plan decision 6 on 10-18 (option 1, lib4-cards.md:3350), and W2B's appliesTo edit only waited for that answer (lib4-cards.md:1216). The edit lands on the research branch in the W2B form before W5, with the supervisor's 10 % re-fetch.
7. **D-SHIP-WAYOUT: accepted** as proposed: shared equipment-move card, else a safety-checker ruling, else the id is held (S3). An id held this way goes to the owner as a later-update item, never silently dropped.
8. **D-SHIP-HAND: accepted.** No hand pose is guessed. A per-id close-up is drawn only where the archetype and the card give every number; otherwise it is a GAP by ruling.
9. **D-SHIP-HEADINGS: accepted.** New per-id headings follow AGENTS.md (1-3 words, a noun phrase). The 8 approved sheets stay byte-equal, and golden B's "X: right and wrong" form is recorded as a follow-up. If copy-lint pins the golden form, that is a question in the PLAN, not an edit.
10. **D-SHIP-LPANEL: accepted.** Per wave: a calibrated layers panel (PANELS section 1 form, two plants, golden-B anchors), a content critic, and the safety checker on tier-A ids. The supervisor posts a STAMP comment; the builder copies it verbatim, and the supervisor diff-checks it.
11. **D-SHIP-FLAGS: modified.** D-OWNER-LIB142 is **not** read as the owner's named yes on flags. The PLAN lists every raised F1-F4 and F7 flag per id. The supervisor asks the owner once, with the W1 APK message, using plan decision 9's default (approve as named exemptions). Until he answers, no id whose pin depends on an unanswered flag merges. Ids with no such flag are not held.
12. **D-SHIP-CI: accepted.** K = N + 1 at P = 1; nothing is skipped or dropped. Push at most once per step. W1 reports unit-tz and the shard times. The supervisor decides an add-only unit-tz split before W3 if W1 shows growth.
13. **D-SHIP-APK: accepted.** One APK after W1 merges, the next at LIB-23's release candidate.
14. **D-SHIP-LEFTOUT: accepted.** The stage is `left-out:D-OWNER-LIB142`: leg_press_calf_raise in W3 and the other 10 in W7.
15. **D-SHIP-SCRATCHIDS: accepted.**
- **Owner context (11-03):** the release timing (all 134 sheets before the Play release, or an earlier release with updates) is asked and not yet answered. It does not change this card's order or checks. It only decides whether the release candidate waits for W7.
- **W1's 5 ids** are confirmed as proposed. If the PLAN finds an unbuilt layer kind for one of them, the swap is the supervisor's ruling, posted on the PR.
