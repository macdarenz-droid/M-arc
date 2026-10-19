# LIB-13 card (LB3 build-ahead): adversarial critique (2026-10-19)

Read: `lib-13-card-draft.md` (cited as card:N), with the supervisor's rulings at card:363-376 treated as binding. Checked against: main `565ea5a4`; claude/sup-lib4-cards `321e77d4` (lib-10-card.md, lib4-cards.md 15, 15.1, 16, 19-24, ht-11-card.md, lb3-research-verify.md, lib-zoom-card.md); plan claude/howto-options `a5e87d9e`; research #272 `14ca323b` and its current head `f4907abe` (R-LB3-1..9 applied); research base `f57e7944`; pilot A #109 `48d49bb8`; LB2 #265 `2dcbac1`; census `4a9fd86`; PR comments on #109, #245, #265, #272. LIB-10 critic holes B1-L11 were not re-raised.

Count: **3 high, 9 medium, 11 low.** Size: one builder can carry it if the shrugs leave (section "Size").

Confirmed correct (no action): base sha and train 30; candidate.mjs:76-130 and :84 (`authoring`); registry.mjs:30-56, :35, :79; derive.mjs:4-12, :15-30; qa/envelope.json traceLenMin 22.11 / deviationMin 11.39; param-ranges.json present; eq/parts.mjs and eq/rope.mjs on main; plate.mjs:78, :208, :213; ci/scratch.mjs:22-24; library-ci.test.ts:160, :187-196; screenshot-gate.mjs:8573, :8930; #265 has 35 changed paths; lb2-plates.test.ts:73-174, :403-438, :440, :478-545, :555 @ `2dcbac1`; plan :85-94, :126-128, :140-141, :152, :159, :161, :240-253, :258-269, :341, :490-493, :636, :673, :693-696, :706, :769, :771; census rows, views, poses and gaps for the 15; tier A count 11 (7 of the 10 drawn); inherit counts (unchanged at `f4907abe`); 7 of 10 with redFlags 'back'; the Hold set for A11 (v); topFaults and CARD FIELDS VERIFIED @ `1d2a809` (21.7); pilot-a/plates.json barbell_shrug held line; comment ids 6255216039, 6256170884, 6256266008, 6243105672, 6242372604, 6263634987, 6264026949; HT-11 card finish ("before LIB-13 merges"); LIB-ZOOM's no-angle rule (:12, :34).

---

## High

### H1. F-LB3-1 is assigned to LIB-13, the card forbids it, and the comparator will be red without it
- Card lines: :32-42 (merge_prerequisites), :68, :82, :160.
- Evidence:
  - lb3-research-verify.md:18 (R-LB3-3): the breath line changes on the LB3 cards, and "Follow-up F-LB3-1: the same change on pilot A's barbell_row, barbell_shrug and romanian_deadlift. It is applied when LB3 ships (LIB-13)".
  - At `f4907abe`, pendlay_row (inherit[3]), t_bar_row (inherit[2]), landmine_row (inherit[3]), dumbbell_shrug (inherit[2]) and cable_shrug (inherit[2]) inherit `risks[breath]`, and read "Heavy reps with a held breath send blood pressure very high." barbell_row, barbell_shrug and romanian_deadlift still read "Holding your breath hard on heavy reps sends blood pressure very high." (also at `48d49bb8`).
  - D-LIB10-PARENTS (15 item 9): the D-LIB5-FAMILY comparator's `===` covers the copy parent. So pendlay_row, t_bar_row and landmine_row are refused at ship until barbell_row's card changes.
  - 21.7: the pilot A CARD FIELDS verdict carries only while the 13 pinned cards stay byte-identical to `1d2a809`. Changing barbell_row's card needs a re-verify.
  - The card never names F-LB3-1. It says LIB-13 "never edits a card's research fields" (:68) and never writes a pilot A card (:82, :160). A builder or the ship card meets a red comparator with two bad exits: edit a reserved card, or loosen the comparator.
- Fix:
  - After card:82, add: "F-LB3-1 (R-LB3-3; lb3-research-verify.md:18) is not this card's work. This card never edits a pilot A card. The supervisor rules its route before the ship card."
  - Add to merge_prerequisites: "F-LB3-1 is on main. barbell_row's, barbell_shrug's and romanian_deadlift's risks[breath] read 'Heavy reps with a held breath send blood pressure very high.' The route is a research commit, then a copy by the lane that owns pilot A's card copies, then a focused CARD FIELDS re-verify of those cards (21.7's carry needs byte-identical cards). The D-LIB5-FAMILY comparator is green for pendlay_row, t_bar_row and landmine_row against barbell_row."
  - Add to risk_and_recovery: "The comparator refuses a child over an inherited field that differs from its parent: stop and report. Never edit the parent card here, and never loosen the comparator."

### H2. A9's "equal origin/main's" assertions cannot run in CI
- Card lines: :263, :264.
- Evidence:
  - The unit run checks out at the default depth 1 (build-apk.yml:32, then `npm run check` at :43), so no `origin/main` ref exists in the test job. No test on main uses origin/main.
  - LB2's A9 (lb2-plates.test.ts:478-545 @ `2dcbac1`) has no such assertion. The bullet came from LIB-10's card but was never built.
  - tests/howto/library-lint.test.ts and hands/ change on main when LIB-7, LIB-12-FIX and LIB-7c land (D-LIBHANDS-COUNT, 20). A sha pinned in lb3-plates.test.ts would go red on a correct head after every such main merge.
  - The builder's only exits are a skip when the ref is missing (a loosening) or a pin that breaks on main merges. Either way the builder has to guess.
- Fix: replace card:263-264 with:
  > - once pilot A is on main: each of the 4 reused ids has exactly one registry row, whose `batchFile` is pilot A's batch file, and no lb3/ file names it;
  > - no LB3 spec, composer, How-to or test imports anything under hands/.
- Add after card:266:
  > Before each milestone post, run `git diff --exit-code origin/main...HEAD -- tools/plates/library/batches tests/howto/golden tools/plates/library/hands tests/howto/library-lint.test.ts src tools/plates/gen` on the merged head and paste its empty output. Seed it once in a temporary worktree: one uncommitted byte changed in tests/howto/library-lint.test.ts must give exit 1. This is a recorded check, not a unit test.

### H3. The H slice's evidence cannot be built from its own head
- Card lines: :24, :25, :186, :205.
- Evidence:
  - The H slice, its QA and Do 5 run "at start" (:24). Do 6, including its first commit (the card byte copies, :205), waits for the ruled tempo map and fault→key map (:25).
  - Main holds only the 8's cards (`docs/research/howto/cards/` @ `565ea5a4`: 8 files). LB2's build.mjs, which this card copies, reads each row's card for its sources lines (lb2/build.mjs:17-23 @ `2dcbac1`). candidateOf reads `howto.research.card` (candidate.mjs:70-73) and gives H6:no-card without it.
  - LB2 hit this. Its first head `2ca7b351` had no cards, and the supervisor's look rebuilt the page "using the 7 cards copied from `2b6747f8` (not committed)" (#265 6255216039). That evidence belongs to no commit, which AGENTS.md does not allow.
- Fix:
  - Split Do 6 (card:205-206):
    > a. At start, once 'LB3 research head' is posted: copy the 10 cards and quotes byte for byte and commit them, with lb3/cards.sha.json holding each copy's sha256.
    > b. After the ruled maps (:25): add the three keys.
  - card:24, add "Do 6 a".
  - card:186, append: "Before Do 6 b, every drawn id shows H6:no-card and F7 'no card top fault'. These are expected, and are not defects to fix."

---

## Medium

### M1. merge_prerequisites still read as if LIB-11 does not block, which contradicts ruling 11
- Card lines: :32-42, :357, :374.
- Evidence: ruling 11 (:374) keeps the AGENTS merge rule, "LIB-11 included". The list at :32-42 names neither that rule nor LIB-11, and :357 still recommends the opposite. The ship card will copy this list.
- Fix: add to merge_prerequisites: "Every lower-numbered item on the owner's checklist has merged, LIB-11 (pilot B) included (AGENTS merge rule; ruling 11)." At :357, append "(rejected: ruling 11)."

### M2. Two pilot A anchors that LB3 plates use are missing from the gates
- Card lines: :17-20, :174.
- Evidence:
  - Plan 2.2:162: "engine `dumbbell` primitive (28 ids) | `dumbbell_biceps_curl` (pilot A; also shows the drawable-fault rule)". one_arm_dumbbell_row, dumbbell_romanian_deadlift and dumbbell_shrug draw the dumbbell primitive.
  - The anchor rule (3.1:258-264) covers both "the anchor of each pose class with 3 or more users" and "any convention it uses (1)". one_arm_dumbbell_row uses the drawable-fault convention (plan :85-88), whose anchor is the curl's F7 with the owner's named yes (21.2 point 4).
  - depends_on (:19) lists only the hinge and front-view anchors and the 4 reused plates. Do 1 (:174) lists hinge, support and front view.
- Fix:
  - card:19, add: "the engine-dumbbell anchor dumbbell_biceps_curl (plan 2.2:162) for one_arm_dumbbell_row, dumbbell_romanian_deadlift and dumbbell_shrug, and the drawable-fault convention (plan 1:85-88; the curl's F7 named yes, D-LIB8M-TF1 4) for one_arm_dumbbell_row".
  - card:174, add "engine dumbbell primitive (dumbbell_biceps_curl, pilot A)".

### M3. conventional_deadlift is drawn H in the H slice before its mode is ruled
- Card lines: :24, :186, :367 (ruling 4).
- Evidence: ruling 4 only says the note proves each id's mode. If the table made HINGE qualify, conventional_deadlift would be a T child. It would then have been started raw, before pilot A's yes, which plan 3.1:258 forbids. The fact that decides it can be checked today: a floor start and a dead stop are poses, D-LIB10-FACTS forbids poses in facts, and derive.mjs:4-12 has no key for them.
- Fix: in ruling 4, add: "pendlay_row, conventional_deadlift and sumo_deadlift are H now: their floor-start poses fall outside PARAMS (derive.mjs:4-12) and facts (D-LIB10-FACTS). The note's table decides only dumbbell_romanian_deadlift and the HROW and HINGE templates." Or gate conventional_deadlift in Do 2 a on the supervisor's mode ruling for that id.

### M4. Do 6 cannot meet its own rules for the two undrawn shrugs
- Card lines: :189, :206, :274, :277, :369 (ruling 6).
- Evidence:
  - 14.7: a fact's pose is the spec's pose name, and no shrug spec exists.
  - Q1: for a drawable:true card, topFault is the key the spec's first tell carries, and there is no tell. dumbbell_shrug and cable_shrug are drawable:true at `f4907abe`.
  - A11 (v) runs "in card, spec and tempo.json", and there is no spec.
  - H6 cannot run on an undrawn plate.
- Fix, if ruling 6 stands: add to Do 6:
  > For dumbbell_shrug and cable_shrug, the facts use pilot A's barbell_shrug pose names (start, end). topFault is the ruled map's key. When a shrug is drawn, its first tell carries that key, its plate runs H6 and Do 8, and a focused verifier with a new plant re-checks that card. A11 (v) runs on card and tempo.json only for an undrawn id.
- Preferred fix: move the shrugs' keys to the shrug card (see Size).

### M5. READY is undefined while the shrugs wait, and barbell_shrug's files are reserved
- Card lines: :98, :103-107, :188, :217, :157-160, :369.
- Evidence:
  - Ruling 6 draws the three shrugs "in LIB-13 if it is still open". LIB-ZOOM starts only after LB1 merges (lib-zoom-card.md:6), so at READY the builder cannot tell whether to wait.
  - If barbell_shrug is assigned here, its spec, its held line in pilot-a/plates.json and its card are all reserved (:157, :158, :160), so the builder could not touch them.
- Fix:
  - Add to finish: "The shrugs never block READY. Unless the supervisor has posted D-LIB13-SHRUG's extension by then, dumbbell_shrug and cable_shrug sit in DESIGN.md's held table (D-LIB8-shrug) and go to one shrug card with barbell_shrug."
  - At :98: "An extension that assigns barbell_shrug here names the files it opens. Until then they stay reserved."

### M6. The pose map is not given to the CARD FIELDS verifier
- Card lines: :179, :208.
- Evidence: Do 1 makes a pose map for pendlay_row, conventional_deadlift and sumo_deadlift, because a start fault is drawn against the end pose (plate.mjs:78). With the map, a fact the card states for plate.start carries the spec's other pose name (14.7). D-LIB9-FACTPOSE asks the verifier to judge each fact's pose from its quote. Without the map the verifier cannot judge it, and a swapped pose looks like an error or goes unseen. Do 6's inputs (:208) leave the map out.
- Fix: at :208, add "the ruled pose map" to the verifier's inputs and rules file. Add to A11: "each fact's pose equals the map's image of the pose its quote states. Mutation: a start fact named with the unmapped pose is red."

### M7. The new rigs have no acceptance criterion with a mutation for their geometry
- Card lines: :197-198, :242-244, :287.
- Evidence: A2 checks types and H9 only. Risk :287 calls the landmine's pivot and grip attachment "[unverified until drawn]" and asks for drawn-item tests, but no A-number or mutation backs them. The rig is new and shared (plan 2.1:140).
- Fix: add to A2:
  > In every drawn pose (start, via, end, Mistake) the landmine bar's pivot end sits at one fixed floor point (±1 px). Its free end is within 1 cm of the grip on landmine_row (c4), and on t_bar_row the vHandle hooks under the bar 8-10 in from the plates (c1). romanChair's hip pad sits under the top of the thighs in every pose (c1, c2). Mutations: the pivot moved 2 cm in the Mistake is red; the bar end moved off the grip is red; the pad moved 5 cm is red.

### M8. A12 needs green CI, but main carries a real RPC defect whose fix is not landed
- Card lines: :89, :265, :276.
- Evidence: D-LIB8M-RPC (b) (#109 6262381933) rules the `[vitest-worker]: Timeout calling "onTaskUpdate"` a real defect. Library-ci calls generate 4 times, which runs past vitest's 60 s RPC limit, and the fix waits for VITEST-RPC (vitest-rpc-card.md). A9 adds another `generate --check` child process in lb3-plates.test.ts. The card says "stop and report" but names no prerequisite, so READY could stall with no owner.
- Fix:
  - build_prerequisites: "A12 and READY: VITEST-RPC on main and merged in (D-LIB8M-RPC (b))."
  - A9: "report the seconds of the generate --check child in the PR body."

### M9. A4's browser-half items have no evidence route
- Card lines: :150, :249-253.
- Evidence: lb3-plates.test.ts is node only. F5 (and F2, H1 boxes, H4, H5) is browser-half. LB2's node A4 leaves F2 and F5 out (lb2-plates.test.ts:703-706 @ `2dcbac1`), and lb2/qa.mjs has no mutation mode. So nothing says where "F5 reads 3.40" or the flag-set equality is proven.
- Fix: append to A4:
  > Browser-half evidence is qa.mjs output at the head. The F5 3.40 mutation runs qa.mjs in a temporary worktree with the tell chrome changed, never committed. Its table line goes in the mutation list. Flag-set equality is checked on qa.mjs's table.

---

## Low

### L1. Wrong or stale references
- :341 "HANDOVER :1595": D-LIB8-shrug's "held until a sourced elevation" is docs/supervisor/HANDOVER.md:1471 on main (:1107 on claude/sup-lib4-cards).
- :108 "(:868-871)": the rates are :869-870 and :872.
- :166 "plan 3.1:237" is D mode's rule. T eligibility is :239-248.
- :122 back_extension tempo "(c8, sourced)": at `f4907abe` the claim is [c8, c21], and c21 (WEAK) names up 1 and down 2 a drawing convention.
- :9 pins `565ea5a4`, while ruling 1 allows a later main. Add: "re-read every main line number cited here on the start head."

### L2. A9's controls contradict the pre-pilot-A rule
- Card line: :266.
- Evidence: before pilot A is on main, :262 forbids the 4 reused ids in batches/ and golden/. Yet the control naming lib_romanian_deadlift and lib_single_leg_romanian_deadlift must "stay green". No mutation tests the pre-pilot-A rule. lib_smith_machine_shrug contains none of the 10 drawn ids, so it controls nothing.
- Fix: "Controls run against the 10-id scan only. Add the mutation 'a batches/ file naming lib_upright_row before pilot A is on main → red'. Drop the smith_machine_shrug control, or keep it labelled as a plain negative."

### L3. A8 has no other family to test against
- Card line: :259.
- Evidence: qa/param-ranges.json on main has `"families": {}`.
- Fix: copy LIB-10's fallback: "a value ruled for another family, or, if none exists, a value ruled for no key of this family → red."

### L4. The forecast counts two shrugs, but ruling 6 draws three together
- Card lines: :108, :369.
- Fix: "+ about 13 h if the three shrugs are drawn here (3 × 4 h plus QA); 0 if they move to a shrug card."

### L5. Do 7's lessons, Do 1's R10 items and the Q-D5-6 cue table have no A-number
- Card lines: :176, :218-225.
- Fix: add an A15 with one mutation each: a red Mistake part moved inside the figure's 6 px clearance → red; a leader within 6 px of the landmine bar → red; one tier-A R10 item removed → red; a cue over 15 words → red.

### L6. No exact words for the note, the slice and the go
- Card lines: :26, :165, :190.
- Fix: the builder posts 'LB3 NOTE READY @ <sha>' and 'LB3 SLICE READY @ <sha> (<family>)'. The supervisor answers 'LB3 NOTE RULED' and 'LB3 <family> BULK GO'. Each family's bulk starts only on its GO.

### L7. The hold-wrist convention is still open
- Card line: :177.
- Evidence: R-LB3-5 / F-LB3-3: conventional_deadlift's wrist reads "neutral" and the shrugs' "bent back about 35°". The hand lane decides it later.
- Fix: in Do 1's hand bullet, add: "draw each card's recorded wrist convention. If F-LB3-3 rules otherwise, the affected hands are redrawn, re-QA'd and re-critiqued for that id."

### L8. LIB-13's place in the freed-slot queue and park order is not named
- Card line: :357.
- Evidence: D-LIB-LANE-ACTIVE (lib4-cards :1023-1032, :1421) gives no position for LIB-13, so it is unclear who parks when LIB-10 resumes after pilot A merges.
- Fix: name the position and the park order in the 'LIB-13 start' message.

### L9. The order of the field-commit merge-back
- Card line: :81.
- Evidence: the 10 LB3 cards exist in older form on claude/libht-research `f57e7944`, and #272 changes them. Merging LIB-13's field commit back before #272 merges gives a modify/modify conflict.
- Fix: "The supervisor merges the field commit back only after #272 is merged into claude/libht-research."

### L10. The range rule is stated for angles only
- Card lines: :51, :181.
- Evidence: D-LIB8M-FACTS's midpoint rule needs b − a ≥ 2 × LIMITS.angleDeg. t_bar_row's "8-10 inches" (c1) is a length.
- Fix: "for a length range the bound is 2 × LIMITS.cm (H6's ±1 cm); otherwise it needs a ruling."

### L11. D-LIB13-SUPPORT amends the plan, and the plan is not updated
- Card lines: :349, :370.
- Evidence: plan 2.2 wants the support anchor approved "before any other plate uses it", and its row says "approved before LB7's dips". Plan 3.1:266-269's same-sheet exception names pilot plates under a template parent only.
- Fix: the supervisor records the amendment on claude/howto-options (2.2 support row; 3.1 exception) as a docs action, as D-LIB8M-SLRDL did, so the card's "rulings win" line (:12) and the plan agree.

---

## Size

- As written, the card is about 1.4 times LIB-10: 10 drawn ids, 2 composers, the scripts, Do 6 for 10 cards and the critic run, 45-55 Opus-hours, doubled for risk. The shrug slice also waits on LIB-ZOOM, which cannot start before LB1 merges. That keeps the card open with an undefined finish (M4, M5).
- Proposal: split it in two.
  - **LIB-13** keeps the 8 non-shrug ids (landmine_row, t_bar_row, pendlay_row, one_arm_dumbbell_row, conventional_deadlift, sumo_deadlift, dumbbell_romanian_deadlift, back_extension), both composers and Do 6 for those 8. That is about 40-48 Opus-hours, LIB-10's size, so one builder fits.
  - **LIB-13s (shrugs)**, on the same branch and PR after LIB-13's READY: dumbbell_shrug, cable_shrug and barbell_shrug (with its reserved files named open), their Do 6 keys and their critic run. It starts on D-LIB13-SHRUG's extension after LIB-ZOOM is ruled. LB3 ships without them if it is late (plan 3.5:341).
  - Ruling 6's "Do 6 still writes all 10 cards' keys" would be amended to "the 8". This avoids writing keys whose pose names, tells and H6 cannot exist yet.
- No second drawer now (4 of 4 slots active). If one joins later, the seam is: rows (landmine composer, landmine_row, t_bar_row, pendlay_row, one_arm_dumbbell_row) against hinges (romanChair, conventional_deadlift, sumo_deadlift, dumbbell_romanian_deadlift, back_extension). Drawer A owns lb3/rows.json, DESIGN.md, cards.sha.json, build.mjs, qa.mjs and lb3-plates.test.ts. Drawer B adds only its own specs and its composer, and hands its rows lines to A.
