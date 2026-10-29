Card LIB-8R: pilot A resume, the held rows (2026-10-29; status `confirmed` 10-29; rulings D-LIB8R-* confirmed by the supervisor (lib4-cards §46))

Sources (every file:line was read at these heads; [unverified] marks the rest):
- main `c7bdad7a` (train 44). C0 = [] there in 5.3 s (manifestProblems, measured 10-29).
- claude/sup-lib4-cards `b5206a78` (lib4-cards.md, lib-*-card.md); claude/sup-handover-1445 `bfd8ed12` (HANDOVER.md, PANELS.md).
- research claude/libht-research `0d832e18`. The 4 built cards and quotes have the same blobs there as at `42cf542a`, the head strip/rows.json was verified on (box_jump a4d66424/078d5bad, reverse_lunge 86a3b2bf/93ecd9da, dumbbell_fly 1066e646/7a8a679e, bent_over_dumbbell_rear_delt_fly 0e05ed0e/ffe68ca7).
- plan claude/howto-options (LIBRARY-HOWTO-ARCHITECTURE.md 1:95-96, 3.1:293-299, 3.5, 8 decisions 3, 4, 9).

id: LIB-8R
model: claude-opus-5-5 (two full redraws in new engine views, a Mistake redraw, zoom calls and a pin: judgement work)
mode: auto
title: 'Builder: LIB-8 resume, pilot A held rows (PILOT-A2)'
branch: claude/lib-8-resume (new, from the latest main). First push opens draft PR 'LIB-8 resume: pilot A held rows as batch PILOT-A2'.
slot: the supervisor names the checklist slot in 'LIB-8 resume start'. It must merge before the first ship card whose sheet uses box_jump or reverse_lunge as an anchor (below).
lane: one LIB slot under D-LIB-LANE-ACTIVE (lib4-cards :1023). 3 of 4 were active at 10-29 02:20 (HANDOVER :830-838).

## Why now
- Pilot A's held rows roll to pilot A's resume PR (D-LIB-ORDER-3, lib4-cards :4305). #109 is merged, so this is a new PR.
- Every blocker of four held rows is now on main:
  - box_jump, reverse_lunge: the no-seconds strip (#309): strip/rows.json:52 and :120 hold their verified rows; build-page.mjs:58 swaps in NOSECS_STRIP. D-STRIP-NOTSCOPE gives the lift to pilot A's lane (lib-strip-card.md:258-259).
  - dumbbell_fly, bent_over_dumbbell_rear_delt_fly: LIB-20 (#311): `camera.pitch` (vendor/engine/plate.mjs:41-44) and `torso: 'volume'` (vendor/engine/body.mjs:306-307, :343). D-ER5-GO settled D-SPIKE-pitch and -hinge (COACHING-DECISIONS.md:2222, :2224, :2867).
  - Small faults: LIB-ZOOM (#279, zoom/inline.mjs), D-LIBZOOM-EXTEND (lib4-cards :4358-4369), F-ZOOM-INK (#329).
- Rows that wait on these pins: step_up (D-LIB14-STEPUP, lib-14-card.md:299), cable_chest_press's sheet (lib-16-card.md:27), bayesian_cable_curl (lib-15-card.md:303), and the airborne ids of LB10 and LIB-22 (lib-strip-card.md:267; lb10/DESIGN.md:127-129).
- Every anchor these four need is already pinned on main: dumbbell_bench_press (supine), romanian_deadlift and barbell_row (hinge), upright_row (front view), dumbbell_biceps_curl (engine dumbbell; drawable-fault F7). The closest plates are among the 8. So no anchor gap exists (plan 3.1:293-299).

## Scope (D-LIB8R-SCOPE)
| Held id (pilot-a/plates.json line) | Blocker on main? | Drawn elsewhere? | Here |
|---|---|---|---|
| box_jump (:68) | yes (#309); D-STRIP-AIR is ruled below | no | **build** |
| reverse_lunge (:148) | yes (#309) | no | **build**, with its Mistake redrawn to the c18 pick (F-LB4-1) |
| dumbbell_fly (:82) | yes (#311, pitch) | no (lb2/DESIGN.md:44: "in no LB2 file") | **build** |
| bent_over_dumbbell_rear_delt_fly (:140) | yes (#311, pitch and volume trunk) | no (lb7/DESIGN.md:65; lib-17-card.md:142: "reused as pilot A pins it or drawn by a later card") | **build** |
| barbell_shrug (:60) | yes (#279) | not yet; D-LIB13-PA routes it to LIB-13s (lib-13-card.md:318, :321; lb3/build.mjs:92) | **not here.** Its spec and held line are reserved for LIB-13s (lib-13-card.md:361). It stays held. |
| incline_dumbbell_press (:17) | n/a | **yes**: LB2 draws it as `lib_incline_dumbbell_press` from specs/incline_dumbbell_press__lb2.mjs (lb2/rows.json:24-32; D-LIB10-IDP-A, COACHING-DECISIONS.md:2897), approved in lb2n (HANDOVER :982) | **not here.** It ships with LB2. |

## How the pin changes (D-LIB8R-BATCH)
The four are pinned in a **new batch, PILOT-A2**, with its own batch file, page and chain. Pilot A's pin does not move:
- **Pilot A after:** the page stays `5d0e562f51ddbbeb0ebcf16fb80c121b5a783d7a421575ec2f84ecffa1bd5ba8` (1325644 bytes). No pilot A golden moves:
  - tests/howto/golden/library/pilot-a.json, batches/pilot-a.json, pages/pilot-a.json;
  - the 13 specs, specs/incline_dumbbell_press.mjs and the 13 How-to sources;
  - the 13 pilot A and 4 pilot B rows of MANIFEST.json.
  All of these stay byte-identical, and C0 is [] at every commit.
- **Byte-identical, proven by fragment shas:** the 13 pilot A plates and the 4 pilot B plates. Rebuild both pages at the pin head and run extractPlates. The 9 fragmentsOf shas of each id (golden.mjs:138) must equal its plate entry: 153 equalities. Pilot B's page must stay `ff3e017c…`.
- **Under `[golden update]` (one commit, added only):**
  - tests/howto/golden/library/pilot-a2.json: base {8, e48d731d…} as pilot A's; one `page` entry and one `plate` entry per pinned id; all first entries, approvedBy 'supervisor', decision 'D-LIB-PILOTA2' (golden.mjs:158-160);
  - batches/pilot-a2.json (stage approved-plate, mode H) and pages/pilot-a2.json;
  - MANIFEST.json: one new row per PILOT-A2 id;
  - the D-LIB8R-PINLINES lines.
- **Why not re-pin pilot A's page:**
  1. A second page entry supersedes the first. golden.mjs:156-160 allows that only with approvedBy 'owner', so the owner would have to approve the page himself. Pilot B's first entries rest on his delegations (pilot-b.json entry 0 `why`).
  2. Every pinned row's file set includes its batch file, its page config and the closure of every row in the batch (ci/manifest.mjs:55, :66, :68). A probe at `c7bdad7a` added the 4 rows to batches/pilot-a.json and got 117 C0 problems (13 rows × the batch sha + 8 new inputs). The same rows as a separate pilot-a2 batch gave C0 [].
  3. D-LIB8M-PAGESET already planned for "the batch that later ships it" and for avoiding an 'owner' re-pin (lib4-cards :3334).
- Registry: registry.mjs:27 reads every batches/*.json in name order. No code changes. 'pilot-a2.json' sorts after 'pilot-a.json'. registry.mjs:3's "checklist order" is already not kept by the lb* names. Order affects only shipped rows, and none ships here.

## Files it may touch (write_scope)
- tools/plates/library/specs/{box_jump, reverse_lunge, dumbbell_fly, dumbbell_fly__alt, bent_over_dumbbell_rear_delt_fly, bent_over_dumbbell_rear_delt_fly__alt}.mjs. None of these is in any MANIFEST row (checked: 0 hits). Both alts must keep importing (`makeFly` dumbbell_fly.mjs:143; `posesAt` rear-delt :106; lib8-pilot-a.test.ts:47-58).
- tools/plates/library/pilot-a2/** (new): DESIGN.md (the RESUME PLAN), rows.json (until the pin), tempo.json, sizes.json, cards.sha.json, build.mjs, qa.mjs, sheet.mjs. Copy these from pilot-b/ on main, never import them.
- tools/plates/library/howto/lib_{the 4}.howto.mjs (new; `id` and `research` only, D-LIB9a-HOWTOID).
- docs/research/howto/cards/ and quotes/ for the 4: byte copies from the research head plus the 3 keys (D-LIB8M-CARDS). The supervisor merges the field commit back to research.
- tests/howto/lib8r-pilot-a2.test.ts (new).
- tools/plates/library/pilot-a/plates.json: the `held` strings of the 4 and of incline, and the `cards` provenance. tools/plates/library/pilot-a/MERGE.md: section a's held table and the provenance. pilot-a/build.mjs:23: a comment only. None of these files is in any MANIFEST row.
- docs/COACHING-DECISIONS.md: append one entry.
- tests/howto/fixtures/eq-composers.json, only if a new composer is added (D-LIB-A16-REGISTRY).
- The pin commit only: the files D-LIB8R-PINLINES lists.
- **Never:**
  - qa/**, zoom/**, strip/**, .github/**, vendor/**, layers/**, golden.mjs, registry.mjs, candidate.mjs, build-page.mjs, plates-page.mjs, render/**, hands/**, eq/** files on main;
  - src/** (except the generated lines below);
  - every pilot A or pilot B pinned input;
  - barbell_shrug's spec and its held line;
  - lb2/** and every other lane's files.

## Do
1. **RESUME PLAN** in pilot-a2/DESIGN.md, posted as 'LIB-8R PLAN READY @ <sha>'. Wait for 'LIB-8R PLAN RULED'. Per id it gives:
   - the clone source;
   - the view fields: pitch value, `torso`, and `armsFront` if needed (body.mjs:297);
   - the Mistake plan, with the fault→key map (13 Q1(a)) and its expected first tell;
   - each zoom region, if one is needed (D-LIBZOOM-EXTEND);
   - a sizes.json row for each unsourced number, with its basis (never PQ-H3; D-LIB17-SIZE form);
   - the facts plan (D-LIB8M-FACTS);
   - the tempo source: timed rows from the card (D-LIB8M-TEMPO); untimed rows exactly from tempoOf(strip/rows.json) (D-STRIP-ROWS, lib-strip-card.md:229);
   - the expected flags: F5 on all 4; F7 on the rear-delt fly only; the others measured;
   - a PQ-H3 estimate per Mistake and Trace;
   - one line each for barbell_shrug and incline_dumbbell_press with their routes.
2. **Cards.**
   - At start: copy the 4 cards and quotes from the research head named in start. Write cards.sha.json.
   - After RULED: add plateFacts, tempo and topFault. Post 'LIB-8R CARD FIELDS READY'. The supervisor runs PANELS §3 (one plant).
   - Fix only what it names. A focused re-verify follows. Then 'CARD FIELDS VERIFIED @ <sha>'.
3. **Draw**, following DRAWING-GUIDE.md and the lane lessons (lib-17-card Do 7). Tests check drawn items:
   - box_jump: drop the `pilot` note (box_jump.mjs:167) and take its tempo from the strip rows. Poses stay as drawn (D-LIB8R-AIR).
   - reverse_lunge: redraw only the Mistake, to the flared-ribcage pick (c18). The first tell carries its key in c18's words. The normal plate stays byte-identical (D-LIB8R-REVLUNGE).
   - dumbbell_fly: the census front view at `camera.pitch` 45 (D-SPIKE-pitch). The Mistake follows c13 (wrists out of neutral), not the spike's fault and not today's 'deep'/'elbow' tells (dumbbell_fly.mjs:183-184).
   - rear-delt fly: the census front view at pitch 15 with `torso: 'volume'` (D-SPIKE-hinge). The Mistake is the shrug (c3); the card is drawable false; topFault is the ruled key of the swing (c5, c4) (D-LIB8R-FLIES).
4. **Build and QA**, from pilot-a2/rows.json through registry rows() with that extra batch, never writing under batches/ (lib-17 Do 5).
   - Build the page twice; the bytes must match.
   - Run runQa node and browser per id on `candidateOf(id, { all, authoring: true })` with zero exemptions (D-LIB8M-QA). Post the table.
5. **TOPFAULT and panel.**
   - The supervisor runs the blind pass on each final tell set (D-LIB8M-TF1's method, lib4-cards 21.2). A drawable-true id whose answer is not its firstKey is held.
   - Then 'LIB-8R PLATES READY @ <sha> (page <sha256>)'.
   - The supervisor runs PANELS §1:
     - candidates: the drawn rows;
     - hidden anchors: golden B's pull_up and lat_pulldown (D-LIB14-ANCHORS, lib4-cards :4421);
     - 2 plants;
     - R10 for box_jump and dumbbell_fly (tier A); R11 for any zoom plate.
   - One fix round, then a focused recheck. A second fail holds the id (D-LIB8M-CARDTRUE).
6. **Sheet** (sheet.mjs) for the supervisor's decision under the owner's delegations, as pilot B's was. It applies the defaults of decisions 3, 4 and 9 and is not posted to the owner's chat (AGENTS.md owner-chat rule). Then 'LIB-8R PIN GO @ <head>' names the ids, the page sha, each id's exemptions and the approval comment.
7. **Pin**, one `[golden update]` commit, as pilot B's `8ae48ed9`:
   - move the rows to batches/pilot-a2.json; write pages/pilot-a2.json and tests/howto/golden/library/pilot-a2.json;
   - add MANIFEST rows (new ids only);
   - run `node tools/plates/generate.mjs`;
   - make the D-LIB8R-PINLINES edits;
   - delete pilot-a2/rows.json, so build, qa and sheet read the registry;
   - update the held lines (pilot-a/plates.json, MERGE.md) and F-LIB8M-PROV's text.
   The supervisor diff-checks the commit against the GO before review.
8. Merge origin/main with a merge commit and re-run A2 and A12. Post 'LIB-8R READY @ <sha>'. A fresh Opus review follows (plan 3.5 step 6).

Stops (post on the PR and wait; never work around one):
- S1 Any C0 problem on a pilot A or pilot B row, any change to their page bytes, or any fragment mismatch in A2.
- S2 A fault the engine cannot draw (lib-17 S1), or a needed seventh engine field (LIB-20 Stop 4). Never edit the engine here.
- S3 A Mistake or Trace below its bar at every zoom k on the ladder (≤ 4): the id is held under D-LIB8-shrug. Never enlarge it.
- S4 A card's facts cannot hold together on the body (D-LIB10-BENCH-H).
- S5 Two failed tries of one approach with no new evidence.

## Acceptance (each mutation turns red, then is restored; the PR lists each red line)
- **A1 Scope.** pilot-a2 rows (then batches/pilot-a2.json) hold exactly the drawn, unheld ids among the 4, each once, mode H, census view. barbell_shrug and incline_dumbbell_press are in no PILOT-A2 file. Each still-held id keeps a held line with its route.
  Evidence: lib8r test. Mutations: barbell_shrug added; incline_dumbbell_press added; a row duplicated.
- **A2 Pilot A and pilot B untouched** (recorded check plus test).
  - `git diff --exit-code origin/main...HEAD` is empty on pilot A's and pilot B's chain, batch and page files, the 13 + 4 specs, incline_dumbbell_press.mjs and the 17 How-to sources.
  - The 17 MANIFEST rows are equal to main's (scratch script).
  - L1 gives `5d0e562f…`/1325644 and `ff3e017c…`; lib8-pin.test.ts:39 is unchanged.
  - The 153 fragment shas equal their entries.
  - C0 is [].
  Mutation (temporary worktree): one byte in specs/barbell_row.mjs's alt text makes C0 red on all 13 rows, L1 red, and the check reports `lib_barbell_row.alt`.
- **A3 PILOT-A2 chain.**
  - verifyBatchChain gives [].
  - The page entry equals the two-build sha.
  - Each plate entry's 9 fragments equal extractPlates of that page.
  - There is no layers-page entry and neither layers file exists (D-LIB8M-PAGES).
  - The batch, page and golden files name no other batch's id in the token forms of lib11-pilot-b.test.ts:320-321 or lb2-plates.test.ts:732.
  Mutations: a second page entry with supersedes 0 and approvedBy 'supervisor' (verifyChain red, golden.mjs:159); one fragment sha edited; a layers-page entry added; `"lib_crunch"` written into pilot-a2.json.
- **A4 C0 and the pins.**
  - MANIFEST rows are pilot A's 13, pilot B's 4 and PILOT-A2's, and manifestProblems is [].
  - library-manifest.test.ts and library-ci.test.ts name the new rows and page.
  Mutation: one PILOT-A2 MANIFEST row dropped.
- **A5 QA.**
  - Every hard check passes per id (node and browser halves; zero exemptions before the pin).
  - The raised flags equal the ruled set.
  - After the pin, the default path with pinned exemptions gives ok true.
  Mutations: LIB-3's M1-M7 (qa/mutations.mjs) on one PILOT-A2 plate; the rear-delt card with topFault set to the drawn key turns the expected-set test red.
- **A6 Cards.**
  - Each card differs from its research blob only in the 3 keys, and validateCardFile gives [].
  - The untimed rows' tempo equals tempoOf(their strip rows); the timed rows follow D-LIB8M-TEMPO.
  - CARD FIELDS VERIFIED (plant caught).
  Mutations: box_jump's Take-off word changed; seconds added to reverse_lunge's card and spec; another card key edited; the verifier's plant.
- **A7 Card truth.**
  - reverse_lunge's first tell carries the c18 key. The spec's export minus `mistake`, `tempo` and `pilot`, JSON-serialised, has the sha256 it has at main `c7bdad7a` (pinned in the test).
  - dumbbell_fly's first tell carries the c13 key.
  - The rear-delt fly raises F7, and its topFault differs from 'shrug'.
  Mutations: REAR_HEEL 45 → 46 (reverse_lunge.mjs:52); dumbbell_fly's 'deep' tell put first.
- **A8 Airborne** (D-LIB8R-AIR).
  - box_jump's start feet are on the floor and its end feet on the box (box_jump.mjs checks).
  - The full-extension ghost (:150) has ball.l and ball.r on the floor within 0.5 cm.
  - No drawn pose has both feet off every support.
  Mutation: the ghost root raised 2 cm.
- **A9 Views** (D-LIB8R-FLIES).
  - dumbbell_fly's `camera.pitch` is the ruled value. The rear-delt fly has pitch 15 and `torso: 'volume'`.
  - F6 is not raised (drawn view = census view).
  - Each alt still imports.
  Mutations: the pitch removed; `makeFly` renamed.
- **A10 Zoom**, for each zoom plate (D-LIBZOOM-EXTEND).
  - The region is the one in the RESUME PLAN.
  - H3 passes at zoom scale with k ≤ 4 on the ladder.
  - The plate is byte-identical outside the zoom, with no angle text and labels of 1-3 words.
  Mutations: k below the bar; an angle in the zoom label.
- **A11 Panel.** VALID under PANELS §1, and every pinned candidate has medians of 4 or more before the pin. Approvals are per exercise, at that head. Mutation: the two plants.
- **A12 Generated and nothing visible.**
  - `generate --check` is green.
  - The diff in src/** is only the coverage.ts stage lines of the pinned ids and line 1 of ids.ts and generated/loaders.ts. The diff in tools/plates/library/ids-node.mjs is only its line 1.
  - No row is shipped.
  - `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` pass on the merged head, and CI (library: full) is green.
  Mutation: one PILOT-A2 row set to shipped.
- **A13 Held markers and scratch ids** (D-LIB8R-PINLINES).
  - lib8-pin.test.ts:35's HELD splits into STILL_HELD (barbell_shrug, incline_dumbbell_press: in no batch or golden file) and MOVED (in exactly batches/pilot-a2.json and golden/library/pilot-a2.json).
  - ci/scratch.mjs refuses PILOT-A2 ids (the :44 form).
  - lib7-fix's fixture id leaves box_jump (lib7-fix.test.ts:298 says "not a pinned row"), and a new guard asserts it is in no batches/ file.
  Mutations: a moved id added to batches/pilot-a.json; a still-held id added to pilot-a2.json; scratch target lib_box_jump; the fixture id set back to box_jump.

## Rulings recorded (confirmed 10-29, lib4-cards §46)
1. **D-LIB8R-SCOPE**: as the scope table above.
2. **D-LIB8R-BATCH**: as "How the pin changes" above. A plan note (6.1, 7: PILOT-A2 carries pilot A's held rows) is a supervisor docs action on claude/howto-options.
3. **D-LIB8R-AIR** (settles D-STRIP-AIR, lib-strip-card.md:267). The airborne convention is plan 1:95-96 as written: take-off and landing frames only, with a sourced landing checkpoint.
   - One ghost may show the take-off's full extension, with the balls on the floor. The Trace may follow the hip along the arc. No body is drawn off every support.
   - box_jump is ruled as drawn: 'Soft knees', c5; card plate.frames. This is decision 3's default "as drawn there", under the 10-24 delegation.
   - It binds jump_squat (LIB-22). jump_rope's mid-air hop stays LB10's own ruling (lb10/DESIGN.md:144-145).
4. **D-LIB8R-FLIES** (decision 4's default, under the delegation):
   - Each fly ships the census front view with the LIB-20 fields. The other view is a sheet extra only.
   - If a front view is held after its last run, the other view may be the fallback only where it shows the card's own plate.mistake unchanged. It then gets QA and one panel, with F6 named. Otherwise the id goes on the named list.
   - The rear-delt fly's F7 is named under decision 9's default.
5. **D-LIB8R-REVLUNGE**: Mistake only, c18 (F-LB4-1; lib-strip-card.md:259). The normal plate stays byte-identical, unless a verified card fact needs a change, which is ruled on the PR. That keeps lb10/sizes.json:157, :286, :692, :707 and :801, which cite reverse_lunge.mjs @ dcac4a38, true.
6. **D-LIB8R-ZOOM**: D-LIBZOOM-EXTEND applies to the 4 unchanged (lib4-cards :4358-4369).
7. **D-LIB8R-PINLINES**: the pin commit may edit exactly these lines, in pilot B's pattern (#278 6393188049):
   - library-ci.test.ts:615-619 and library-manifest.test.ts:31-41 (add the page and rows);
   - lib8-pin.test.ts:35 and :114-118 (the A13 split; it is stronger);
   - ci/scratch.mjs:34-35, :44 (refusal list; D-LIB11-SCRATCHIDS);
   - lib7-fix.test.ts:298, :378, :381, :392, :411 and :436 (the fixture id, plus its guard);
   - src/howto/coverage.ts, src/howto/ids.ts, src/howto/generated/loaders.ts and tools/plates/library/ids-node.mjs, through generate.mjs only (D-LIB8M-GENERATED's scope).
8. **D-LIB8R-IDPSPEC**: F-IDP-SPEC ("the held spec retires at the next pilot A re-pin", HANDOVER :996) is closed as "kept".
   - dumbbell_shoulder_press.mjs:38 imports `reclined` from specs/incline_dumbbell_press.mjs, so the file is a pinned input of all 13 rows. Removing it would move a pinned spec.
   - incline's held line names LB2.
9. **D-LIB8R-PROV**: F-LIB8M-PROV (HANDOVER :1141) rides this card. With no pilot A re-pin, its trigger never comes. Its files are in no MANIFEST row, so C0 stays [].

## Risks and mitigations
- **The flies' Mistakes are too small.**
  - dumbbell_fly's wrist bend (c13) and the rear-delt fly's front-view shrug (c3) are small; the old front alt moved the shoulders about 2 px (rear-delt __alt.mjs:6-7).
  - Mitigation: a zoom under D-LIBZOOM-EXTEND. If none reaches the bar at k ≤ 4, S3 holds the id; it is never enlarged.
- **Pitched draw order.** The front draw order sorts by world z (body.mjs:297-298, :366-367; F-ENGINE-PITCHDEPTH, D-LIB21-BICYCLE). The fly's hands over the chest may draw under the torso [unverified until drawn].
  - Mitigation: try `armsFront` and the volume trunk's depth groups. Otherwise S2: held and routed to F-ENGINE-PITCHDEPTH, with no engine edit.
- **reverse_lunge's rib flare is small** (a lumbar-arch sign; LB8's arches held, lib4-cards §45 D-LIB18-RINGKEEP). Mitigation: a zoom, or held. If it is held, step_up and cable_chest_press keep rolling. Report that on #289 and #327.
- **Another lane's test reads batches/ or golden/library** (lb2-plates :732-748, lib11-pilot-b :320-330, lb3/5-9 A9 blocks).
  - Mitigation: PILOT-A2 files name only their own ids. The full suite runs on the pin head (A12).
- **A pinned pilot A or pilot B byte moves** through a shared input. Mitigation: write_scope excludes every builder and closure file; A2 and S1.
- **The research head moves** and changes one of the 4 cards. Mitigation: re-copy it, re-verify, re-QA. A changed pick re-plans that Mistake.
- **Usage.** The owner's 80 % pause applies (PANELS §9). Mitigation: post WAITING with a HANDOFF block if it stops the session.

## Forecast [est]
- Builder, about 23 Opus-hours: box_jump 2 h; reverse_lunge 3 h; each fly 5 h; tooling 3 h; QA 3 h; pin 2 h. Add about 2 h per zoom.
- LB lanes needed 2-4 fix rounds, so allow about 45 h.
- Supervisor: one CARD FIELDS verify plus one re-verify, 4 blind TOPFAULT passes, one panel plus one recheck, and the pin diff-check.
- Uncertainty: either fly may end held (zoom size or draw order) and roll to the named list. The calendar depends on a lane slot and the panel queue (mx3 is ahead).
- Nothing visible ships, so no APK.

return: PR and head sha; links to PLAN, CARD FIELDS, PLATES READY and PIN GO; the per-id table (view fields, zoom, flags, held or not); the page sha256 (two builds); A2's fragment table and diff output; the mutation list; check, test:tz and gate output.

Resume rule: when WAITING, resume only on the supervisor's exact words 'LIB-8 resume' (sent to the session or posted on the PR).
