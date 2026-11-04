# LIB-SHIP design: the PLAN (W0)

Card: `docs/supervisor/verify/lib-ship-card.md` on claude/sup-lib4-cards `1ee69c9a` (its Supervisor rulings win). Base: main `b9369130` (train 62). Every number below was measured on that base by scripts kept in the builder's scratchpad (never committed): the registry rows, the cards, `hands/pairs.mjs` `loadKeyModules`, each batch's `qa.mjs` `EXPECTED`, the pilot pins, and `ids-encoding.mjs` `hintsOutputs` run on the proposed hints. [unverified] marks what no run here checked.

## 1. Scope re-check

| What | Card | Measured on `b9369130` |
|---|---|---|
| Rows to switch on | 134 | 134: pilots 21 at `approved-plate` + 112 build-ahead rows at `drawing` + horizontal_leg_press (zoom) |
| leg_press_calf_raise | never ships | in lb1/rows.json; no spec; stage `left-out:D-OWNER-LIB142` in W3 (ruling 14) |
| Tier A / B / C | 45 / 25 / 64 | 45 / 25 / 64 |
| Hand archetype (coverage-archetypes.json) | hold 25, push 24, none 19, pull 17, balance 14, curl 13, palm-flat 10, implement 5, on-body 4, hang 3 | same. renegade_row's card has no `archetype.hand`; coverage-archetypes.json:138 gives palm-flat |
| Cards with inherit[] | 38 (133 fields), 8 mapped | 38 (133 fields); 8 shipping children mapped (family.mjs:19-33; the 9th entry is leg_press_calf_raise) → 30 children, 110 fields unmapped |
| Back link outside appliesTo | 21 | 21 (same ids as ruling 6) |
| Tier-A way-out gap | 18 | 18 (same ids as ruling 7) |
| Hand close-up wanted | 77: 24 key, 19 GAP, 34 neither | 77: 24 key, 19 GAP, 34 neither. push_up, incline_push_up and pike_push_up have a pair key but no card hand zoom |
| Two-kind equipment (variant line) | — | 19 ids |
| Line checks | — | library-lint.test.ts:385-386, the 15 guard lines, Train.tsx:830/:832, ids.ts 1,076 B with 8 ids: all at the cited lines |

## 2. Questions for 'SHIP PLAN RULED'

Each has a measured proposal. Nothing in W1 starts before the ruling.

- **Q1 barbell_overhead_press's hand close-up cannot be drawn on main.** Its card zoom `bar-heel-of-palm` (kind hand: right "Bar on the palm's heel, wrist almost straight, thumb wrapped", wrong "Bar in mid-palm, wrist bent back", c4) is a push heel-of-palm pair, and no pair key holds it. D-LIB7-19 (hands/DESIGN.md:211) measured that golden B's engine has no pose at wrist 8-35° and contactAt -0.8 to -0.2 that puts the handle low in the heel and on the forearm axis. That is why the two push pairs are parked until golden-B follow-up 9 (D-LIB7-19a, DESIGN.md:45, :74, :76). The engine cannot be edited (Never paths), so under ruling 8 this close-up is "not every number". **Proposal:** keep barbell_overhead_press in W1 and make its hand zoom a GAP by ruling 8, citing D-LIB7-19. Its grip copy (handling: contact, wrist, thumb) carries c4 and c3, and its posture zoom `ohp-forearm-vertical` stays. W1 still proves the push hint, the back box and a tier-A sheet. The per-id close-up path is proven first on a non-push "neither" id in W2 (barbell_row, pull). The other option is the card's swap: triceps_pushdown (C, push, no hand zoom) or mountain_climbers.
- **Q2 pec_fly has no variant line.** Its equipment is "Machine" (exercises.json), and lint/index.mjs:108 refuses a variant line on a one-kind row. So the card's "pec_fly (front view, variant line)" holds only for the front view. No W1 id has two-kind equipment. **Proposal:** keep pec_fly. W1 proves the negative rule (no line on a one-kind row, variant-gate.mjs). The first positive case is W2's upright_row ("Cable / Barbell", pilot A), with A3's mutation "a two-kind id without its variant line" run there. The other option is to swap upright_row into W1.
- **Q3 Pair-panel headings.** W1's two pair keys use approved words whose heading is "Hand: right and wrong" (hands/words/curl-dumbbell-under.json:3, rope-push-neutral.json:3, from golden B, D-LIB7FIX-WORDS). These are key-level, not per-id, and copy-lint does not pin the form: the `heading` kind has no cap and no pattern (copy-lint.mjs:188, :208). **Proposal:** keep the approved words byte-equal, as ruling 9 keeps the 8, and record both under the same golden-B follow-up. Per-id headings written here follow AGENTS.md (one to three words, e.g. "Hand", "Bar path").
- **Q4 Close-up options file.** `closeupApi` throws without an options record (render/closeups.mjs:75-76). A batch names its records with `optionsModule` in its layers config (layers-spec.mjs:98, ci/manifest.mjs:59, fixture lib2b). The 8's records (closeups-8.mjs) are bespoke per exercise (uid, rightNote, chip text), so a new id cannot borrow one card-true. No write_scope path holds a new options module. **Proposal:** add `tools/plates/library/pages/<batch>.closeups.mjs` (data only: `CLOSEUP_OPTIONS` for the batch's ids, built from `zbox-options.mjs`/`PAGED` as closeups-8.mjs does), one per batch, next to the batch's other page configs. It enters MANIFEST through ci/manifest.mjs:59 as it is.
- **Q5 W1 flags.** The 5 ids' raised flags (OHP F2, F3; dumbbell_biceps_curl F2, F4, F7; plank F1; pec_fly and rope pushdown none beyond F5) are their pilot A plate pins' `exemptions`. Those pins record the owner's 10-19 answer "Pilot a ok" on the sheet that showed each flag with its "approve as named exemptions" default (tests/howto/golden/library/pilot-a.json, `why`). **Proposal:** read the pilot A, A2, A3 and B flags as answered by those recorded owner answers, so they wait on nothing. Ruling 11's single owner question then lists the 53 build-ahead ids in section 6.
- **Q6 More W1 guards than the card lists.** Flipping the 5 also turns these red: lib8-pin.test.ts:110 (pilot A stages in review/approved-plate) and lib7-fix.test.ts:81 (no shipped row has a pair key), with library-lint.test.ts:386. **Proposal:** replace each under ruling 3 (a positive set assert that keeps every old red). At W1 start the builder flips the 5 locally, runs the generator and the howto and library tests once, and lists every red line on the PR before replacing it. Anything that is not a "nothing ships" guard is a stop (S2).
- **Q7 plank's primary `core` has no app state.** The card lists `core` as its only feel.primary (abs, obliques secondary; lower_back watch). C2 refuses `core` in any feel role (tests/howto/checks/c2.ts:15, :26). Golden B's squat carries `core` in `feel.textOnly` (layers/exercises/barbell_back_squat.howto.mjs:259-261). No generator or app file reads `textOnly` (grep of src/, tools/plates/gen/ and lint/: none), so the app shows no core line for the squat today. The card's own swaps carry their own blockers: mountain_climbers's only primary is also `core`, and triceps_pushdown's hand zoom is the parked push pair (hand-d-handle.mjs:21, D-LIB7-19a). **Proposal:** keep plank and follow the approved squat precedent: `core` in `feel.textOnly` with its card claim, abs and obliques drawn as secondary, and the sheet's text naming the core as the card says. The app shows what it shows for the squat; nothing new is built. The other option is to hold plank to W2 with a ruled text-only state, swapping in no id: W1 runs with 4.
- **Q8 Scratch targets the card's ruling 15 does not name.** From the prerequisites check (section 7): jumping_jacks and sled_push (LB10) are LIB-4c scratch targets (ci/scratch.mjs:21, :25). smith_machine_incline_press (ci/scratch.mjs:26) and smith_machine_shoulder_press (LIB-7b fixture.mjs:20) are LB6 targets that lib-16 does not name. Pilot A's barbell_row is in the lb-test.json fixture. **Proposal:** extend ruling 15 to every scratch or fixture target that is a to-ship id. Each is swapped to a never-shipping id (one of the 11) in the push that first moves its row, and the fixture test is re-run. barbell_row's fixture use is checked in W2.

- **Q9 Later-wave routes found by the check (no W1 effect).** cable_external_rotation (W6) has an empty `feel.primary` on its card, and main has no empty-primary feel state [unverified beyond grep]. The battle_ropes hand camera (W7) is still the owner's call: D-LIB12FIX-ROPE was deferred, and no ruling was found. **Proposal:** both are routed before their wave under ruling 7's pattern: a research route, else a GAP by ruling 8 (battle_ropes), else the id is held (S3) and goes to the owner as a later-update item.

- **Q10 Inherit map (ruling 4).** Section 8 maps 82 of the 110 unmapped child fields and flags 28. 12 of the flags are plate-only fields (view, equipment, frames) with no sheet path, so they leave inherit[] by research route, as F-LB1-SETUP did. 16 are conflicts or wording differences, each with a one-line reason. **Proposal:** rule each wave's entries at that wave's start, in the D-LIB9a-MAP form. A flagged field goes to research before its wave, and the child is held (S3) if it is not routed. The proposed keys also bind how each parent sheet is written. No W1 effect.

## 3. Wave plan

Parents ship no later than their children (D-LIB10-PARENTS). The check ran over every card `parent` with the wave mapping below: no child ships before its parent, and all 46 children with a card parent are covered. Where a parent and child share a wave, the parent comes first in its batch file and both are in the same head (the resolver reads the parent from that head).

| Wave | Ids | Batches (target files) | Children (same-wave parent) | Lands with it |
|---|---|---|---|---|
| W1 | 5 | pilot-a.json (stage flips only) | none | the first library layers page, budgets at N = 13, guard replacements for pilot A (Q6) |
| W2 | 16 | pilot-a (8), pilot-a2 (2), pilot-a3 (2), pilot-b less smith (3), pilot-b2.json (crunch, moved) | single_leg_romanian_deadlift → romanian_deadlift | ruling 4's resolver (library-gate.mjs:56); pilot A layers page re-pinned with 13 (A10) |
| W3 | 13 | lb01.json (12 + leg_press_calf_raise `left-out:D-OWNER-LIB142`), zoom.json (horizontal_leg_press) | 9 children, all on golden parents or LB1 itself | the 8 mapped INHERIT_MAP entries used for the first time |
| W4 | 21 | lb02.json (8), lb03.json (12), pilot-b.json (smith_machine_bench_press last) | 15, incl. barbell_bench_press ×4, barbell_shrug ×3, sumo → conventional_deadlift | pilot B layers page re-pinned |
| W5 | 27 | lb04.json (12), lb05.json (15) | 13 | back-box appliesTo edit on the research branch before this wave (ruling 6) |
| W6 | 23 | lb06.json (12), lb07.json (11) | 5, incl. standing_leg_curl → lying_leg_curl | — |
| W7 | 29 | lb08.json (8), lb09.json (9), lb10.json (12); the other 10 named rows at `left-out:D-OWNER-LIB142` | 3, incl. v_up → hollow_body_hold | C6R can run at LIB-23 |

Totals: 5 + 16 + 13 + 21 + 27 + 23 + 29 = 134. The batch files sort lb01 … lb10, pilot-a … pilot-b2, zoom (registry.mjs:28), so the registry order is LBs first. This changes generated order only, never `hasHowTo` (ruling 2). Row moves are shown as a byte diff of the row objects in each wave's PR (ruling 2).

## 4. Hints and ids.ts bytes (ruling 5)

The hint is the sheet's `handling.cue` on a push-archetype row (content.mjs:142-149). Each text is at most 6 words (copy-lint `cue`, CUE_MAX_WORDS; corrected on W1, #376) and restates the card's own grip claims (grip.handContact and grip.wrist). Ids with the same claim share one text, and a child inherits its parent's. ab_wheel_rollout and sled_push have no grip claim, so they get no hint.

| Text | Chars | Ids (card claim) |
|---|---|---|
| A "Heel of palm, wrist straight." (shipped) | 29 | machine_chest_press (shipped); children incline_machine_press, shoulder_press (inherited) |
| B "Palm heel, wrist not bent back." | 31 | barbell_overhead_press (c4), smith_machine_shoulder_press (c18) |
| C "Palm base, wrist not bent back." | 31 | barbell_bench_press (c5) and its children incline_barbell_bench_press, close_grip_bench_press, decline_bench_press, smith_machine_bench_press, smith_machine_incline_press |
| D "Handle firm in palm, wrist neutral." | 35 | dumbbell_bench_press (c3), dumbbell_shoulder_press (c2), incline_dumbbell_press (c3) |
| E "Hands against the rope knobs." | 29 | rope_triceps_pushdown (grip.handContact; shared/rope-rule.json c1) |
| F "Wrist in line with the forearm." | 31 | triceps_pushdown, single_arm_triceps_pushdown, straight_bar_triceps_pushdown (grip.wrist) |
| G "Squeeze the handle, wrist neutral." | 34 | arnold_press (c16; wrist inherited) |
| H "Push through palms, wrists over elbows." | 39 | cable_chest_press (c3) |
| I "Both hands round handle, palms up." | 34 | dumbbell_overhead_triceps_extension (c1, c4) |
| J "Drive through the palms." | 24 | weighted_dip (c5) |
| K "Wrist neutral." | 14 | skull_crusher (c3; the card states no hand placement) |

Bytes, from `hintsOutputs` run on these exact texts with exercises.json's 153 ids:
- **W1 (N = 13; texts A, B, E): 1,165 B.** Today: 1,076 B.
- **All 142 shipped, 11 texts: 1,977 B** of IDS_MAX 2,048 (71 B left). One more ~30-character text fits; a 13th distinct text goes to 2,069 B and is refused (ids-encoding.mjs:89-91). ids.ts + lazy.tsx (1,001 B) = 3,000 ≤ 3,072.
- Exact wording of each text is settled with its sheet in its wave and checked by copy-lint's `cue` kind. If a sheet's cue wording changes, the bytes are re-measured in that wave's PR.

## 5. W1 plan (after 'SHIP PLAN RULED')

Assuming Q1-Q7 are ruled as proposed:
1. **Scratch flip (Q6).** Flip the 5 locally, run the generator, then the howto and library vitest files once. List every red line on the PR. Nothing is committed from this step.
2. **Sheets (Do 1a).** Write the 5 `howto/lib_<id>.howto.mjs` in golden B's HowToContent shape, under lintLibraryRow from the first line. Every visible string cites its card claim. Headings are one to three words.
3. **Layers page (Do 1b).** Write `pages/pilot-a.layers.json` (one group, the 5) and `pages/pilot-a.closeups.mjs` (Q4). The curl and rope close-ups come from their pair keys (`pair`); posture crops come from the zbox shell; the feel map comes from golden B. Build `tests/howto/golden/library/pilot-a.layers.html` twice and check the sha256 match, then post 'SHIP LAYERS READY W1 @ <sha> (layers <sha256>)' and wait for 'W1 LAYERS APPROVED'.
4. **Pin, flip, generate (Do 1c-d).** Pin the layers-page entry and the MANIFEST rows, and copy reviews.json entries verbatim from the STAMP comment. Flip the 5 to `shipped` and run the generator. Add budget entries at measured + 10 % (`setBy: LIB-SHIP`), loaders perId n = 13, and totals within `totalCeiling(13)`. Replace the guards (Q6, ruling 3).
5. **QA (Do 1e-f).** Run fidelity.mjs on the 5. Merge origin/main (merge commit) and regenerate. Run `npm run check`, `npm run test:tz` and the gate on that head, then post 'SHIP W1 READY @ <sha>' with unit-tz and shard times (ruling 12).

Risks in W1: (a) the scratch flip finds guards beyond Q6. Mitigation: listed first; any that is not a "nothing ships" guard is a stop. (b) The layers panel finds a card-true problem. Mitigation: one fix round, then S3. (c) CI: each push touching tests/howto/** or tools/plates/** proves the 5 (K = 6 shards). Mitigation: push only at the three milestones (PLAN, LAYERS READY, W1 READY).

## 6. Raised flags (ruling 11)

Read from each id's pilot pin `exemptions` (pilots) or its batch qa.mjs `EXPECTED` (lb3-lb10, pilot-b2). For lb1, lb2 and zoom, which have no EXPECTED, the source is lb1/DESIGN.md:84-91 and lb2/DESIGN.md:145-150: F7 on a drawable:false card, plus F1 on resistance_band_row. F5 is on every row and is left out here. Pilot ids (24 flags over 14 ids, corrected 11-04, #379 6627967819) are recorded as owner-answered in their pins (Q5).

**Open for the one owner question (53 build-ahead ids):** assisted_pull_up (F7), resistance_band_row (F1+F7), shoulder_press (F7), barbell_shrug (F2+F3+F4+F7), dumbbell_shrug (F2+F4), one_arm_dumbbell_row (F7), pendlay_row (F2), smith_machine_shrug (F2), alternating_dumbbell_curl (F4+F7), barbell_curl (F2+F7), bodyweight_split_squat (F4), concentration_curl (F2), cross_body_hammer_curl (F2+F7), dumbbell_overhead_triceps_extension (F3+F4), ez_bar_curl (F2+F7), front_squat (F2), goblet_squat (F2), incline_dumbbell_curl (F7), pistol_squat (F7), reverse_curl (F2), step_up (F4), wrist_curl (F2+F3+F7), bench_dip (F7), cable_chest_press (F2), cable_external_rotation (F7), high_to_low_cable_fly (F2+F3+F7), hip_abduction (F7), hip_adduction (F7), low_to_high_cable_fly (F2+F7), machine_crunch (F2), machine_lateral_raise (F7), pike_push_up (F7), rear_delt_fly (F3+F7), smith_machine_squat (F2), battle_ropes (F2), bear_crawl (F1), bird_dog (F1+F3), burpee (F7), cable_crunch (F2+F3), cable_kickback (F2+F3), dead_bug (F1), farmer_s_carry (F7), glute_bridge (F2), hollow_body_hold (F2), jump_rope (F3), jumping_jacks (F7), lying_leg_curl (F7), medicine_ball_slam (F7), pendulum_squat (F7), reverse_crunch (F1), side_plank (F1+F7), standing_leg_curl (F7), superman (F2+F3).

Until he answers, none of these 53 ids merges (ruling 11). W1 has none of them.

## 7. Per-id table (134)

Columns: W = wave. hand close-up: `key` = drawn by a pair key; `GAP` = a recorded gap of that key; `own` = a card hand zoom with neither (ruling 8). hint = section 4's letter. ¹ = lb1/lb2/zoom flag rule (section 6).

| # | id | W | from → batch file | tier | hand arch. | card parent | inherit[] | back link / in box | way-out gap | hand close-up | variant line | hint | flags (F1-F4, F7) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | barbell_overhead_press | 1 | pilot-a → batches/pilot-a.json | A | push | — | — | yes / in box | — | own (neither) | — | B | F2, F3 |
| 2 | dumbbell_biceps_curl | 1 | pilot-a → batches/pilot-a.json | C | curl | — | — | — | — | key curl | — | — | F2, F4, F7 |
| 3 | pec_fly | 1 | pilot-a → batches/pilot-a.json | B | hold | — | — | — | — | — | — | — | — |
| 4 | plank | 1 | pilot-a → batches/pilot-a.json | C | none | — | — | yes / in box | — | — | — | — | F1 |
| 5 | rope_triceps_pushdown | 1 | pilot-a → batches/pilot-a.json | C | push | — | — | yes / in box | — | key rope | — | E | — |
| 6 | barbell_row | 2 | pilot-a → batches/pilot-a.json | A | pull | — | — | yes / in box | **yes** | own (neither) | — | — | F4 |
| 7 | dumbbell_bench_press | 2 | pilot-a → batches/pilot-a.json | A | push | — | — | — | — | own (neither) | — | D | F4 |
| 8 | dumbbell_shoulder_press | 2 | pilot-a → batches/pilot-a.json | A | push | — | — | — | **yes** | own (neither) | — | D | F3, F4 |
| 9 | mountain_climbers | 2 | pilot-a → batches/pilot-a.json | C | palm-flat | — | — | — | — | key palm-flat | — | — | F1, F3 |
| 10 | romanian_deadlift | 2 | pilot-a → batches/pilot-a.json | A | hold | — | — | yes / in box | **yes** | own (neither) | — | — | — |
| 11 | single_leg_romanian_deadlift | 2 | pilot-a → batches/pilot-a.json | A | hold | romanian_deadlift | 2 (unmapped) | yes / in box | **yes** | — | required | — | F4 |
| 12 | triceps_pushdown | 2 | pilot-a → batches/pilot-a.json | C | push | — | — | yes / in box | — | own (neither) | — | F | — |
| 13 | upright_row | 2 | pilot-a → batches/pilot-a.json | B | pull | — | — | — | — | own (neither) | required | — | F2 |
| 14 | bent_over_dumbbell_rear_delt_fly | 2 | pilot-a2 → batches/pilot-a2.json | C | hold | — | — | yes / in box | — | own (neither) | — | — | F2, F3, F7 |
| 15 | box_jump | 2 | pilot-a2 → batches/pilot-a2.json | A | none | — | — | — | **yes** | — | — | — | F2, F3, F4 |
| 16 | dumbbell_fly | 2 | pilot-a3 → batches/pilot-a3.json | A | hold | — | — | — | — | — | — | — | F3 |
| 17 | reverse_lunge | 2 | pilot-a3 → batches/pilot-a3.json | B | hold | — | — | — | — | — | required | — | F3, F4 |
| 18 | cable_fly | 2 | pilot-b → batches/pilot-b.json | B | hold | — | — | — | — | GAP (d-handle) | — | — | F2 |
| 19 | push_up | 2 | pilot-b → batches/pilot-b.json | C | palm-flat | — | — | — | — | key palm-flat (no card hand zoom) | — | — | — |
| 20 | seated_leg_curl | 2 | pilot-b → batches/pilot-b.json | C | balance | — | — | — | — | — | — | — | — |
| 21 | crunch | 2 | pilot-b2 rows.json → batches/pilot-b2.json | B | none | — | — | yes / in box | — | — | — | — | F1, F3 (pilot-b2/qa.mjs:49; D-OWNER-FLAGS per #379 6627803879, 6627967819) |
| 22 | assisted_pull_up | 3 | lb1 rows.json → batches/lb01.json | A | hang | — | — | — | — | key bar | — | — | F7 ¹ |
| 23 | chest_supported_row | 3 | lb1 rows.json → batches/lb01.json | C | pull | — | — | yes / in box | — | — | — | — | — ¹ |
| 24 | chin_up | 3 | lb1 rows.json → batches/lb01.json | A | hang | pull_up | 2 (mapped) | — | — | key bar | — | — | — ¹ |
| 25 | close_grip_pulldown | 3 | lb1 rows.json → batches/lb01.json | C | pull | lat_pulldown | 1 (mapped) | — | — | key v-handle | required | — | — ¹ |
| 26 | hanging_knee_raise | 3 | lb1 rows.json → batches/lb01.json | A | hang | hanging_leg_raise | 1 (mapped) | yes / in box | — | key bar | — | — | — ¹ |
| 27 | incline_machine_press | 3 | lb1 rows.json → batches/lb01.json | C | push | machine_chest_press | 7 (mapped) | — | — | — | — | A | — ¹ |
| 28 | inverted_row | 3 | lb1 rows.json → batches/lb01.json | C | pull | — | — | yes / in box | — | key bar | — | — | — ¹ |
| 29 | resistance_band_row | 3 | lb1 rows.json → batches/lb01.json | C | pull | — | — | yes / in box | — | — | — | — | F1, F7 ¹ |
| 30 | shoulder_press | 3 | lb1 rows.json → batches/lb01.json | A | push | machine_chest_press | 4 (mapped) | yes / in box | **yes** | — | — | A | F7 ¹ |
| 31 | single_arm_lat_pulldown | 3 | lb1 rows.json → batches/lb01.json | C | pull | lat_pulldown | 1 (mapped) | — | — | key d-handle | — | — | — ¹ |
| 32 | straight_arm_pulldown | 3 | lb1 rows.json → batches/lb01.json | C | hold | — | — | yes / in box | — | — | — | — | — ¹ |
| 33 | underhand_lat_pulldown | 3 | lb1 rows.json → batches/lb01.json | C | pull | lat_pulldown | 2 (mapped) | — | — | key bar | required | — | — ¹ |
| 34 | horizontal_leg_press | 3 | zoom rows.json → batches/zoom.json | B | balance | leg_press | 5 (mapped) | yes / in box | — | — | — | — | — ¹ |
| 35 | arnold_press | 4 | lb2 rows.json → batches/lb02.json | A | push | dumbbell_shoulder_press | 4 (unmapped) | — | **yes** | own (neither) | — | G | — ¹ |
| 36 | barbell_bench_press | 4 | lb2 rows.json → batches/lb02.json | A | push | — | — | — | — | own (neither) | — | C | — ¹ |
| 37 | close_grip_bench_press | 4 | lb2 rows.json → batches/lb02.json | A | push | barbell_bench_press | 6 (unmapped) | — | — | own (neither) | — | C | — ¹ |
| 38 | decline_bench_press | 4 | lb2 rows.json → batches/lb02.json | A | push | barbell_bench_press | 4 (unmapped) | — | — | own (neither) | — | C | — ¹ |
| 39 | dumbbell_pullover | 4 | lb2 rows.json → batches/lb02.json | A | hold | — | — | — | — | own (neither) | — | — | — ¹ |
| 40 | incline_barbell_bench_press | 4 | lb2 rows.json → batches/lb02.json | A | push | barbell_bench_press | 4 (unmapped) | — | — | own (neither) | — | C | — ¹ |
| 41 | incline_dumbbell_press | 4 | lb2 rows.json → batches/lb02.json | A | push | dumbbell_bench_press | 3 (unmapped) | — | — | own (neither) | — | D | — ¹ |
| 42 | skull_crusher | 4 | lb2 rows.json → batches/lb02.json | A | push | — | — | — | **yes** | GAP (ez) | required | K | — ¹ |
| 43 | back_extension | 4 | lb3 rows.json → batches/lb03.json | A | none | — | — | yes / in box | — | — | required | — | — |
| 44 | barbell_shrug | 4 | lb3 rows.json → batches/lb03.json | A | hold | — | — | — | — | own (neither) | — | — | F2, F3, F4, F7 |
| 45 | cable_shrug | 4 | lb3 rows.json → batches/lb03.json | B | hold | barbell_shrug | 6 (unmapped) | — | — | own (neither) | — | — | — |
| 46 | conventional_deadlift | 4 | lb3 rows.json → batches/lb03.json | A | hold | romanian_deadlift | 4 (unmapped) | yes / in box | — | own (neither) | — | — | — |
| 47 | dumbbell_romanian_deadlift | 4 | lb3 rows.json → batches/lb03.json | A | hold | romanian_deadlift | 2 (unmapped) | yes / in box | — | own (neither) | — | — | — |
| 48 | dumbbell_shrug | 4 | lb3 rows.json → batches/lb03.json | B | hold | barbell_shrug | 4 (unmapped) | — | — | own (neither) | — | — | F2, F4 |
| 49 | landmine_row | 4 | lb3 rows.json → batches/lb03.json | A | pull | barbell_row | 5 (unmapped) | yes / in box | — | own (neither) | — | — | — |
| 50 | one_arm_dumbbell_row | 4 | lb3 rows.json → batches/lb03.json | C | pull | — | — | — | — | — | — | — | F7 |
| 51 | pendlay_row | 4 | lb3 rows.json → batches/lb03.json | A | pull | barbell_row | 5 (unmapped) | yes / in box | — | — | — | — | F2 |
| 52 | smith_machine_shrug | 4 | lb3 rows.json → batches/lb03.json | B | hold | barbell_shrug | 3 (unmapped) | — | — | own (neither) | — | — | F2 |
| 53 | sumo_deadlift | 4 | lb3 rows.json → batches/lb03.json | A | hold | conventional_deadlift | 5 (unmapped) | yes / in box | — | own (neither) | — | — | — |
| 54 | t_bar_row | 4 | lb3 rows.json → batches/lb03.json | A | pull | barbell_row | 4 (unmapped) | yes / in box | — | own (neither) | required | — | — |
| 55 | smith_machine_bench_press | 4 | pilot-b → batches/pilot-b.json | A | push | barbell_bench_press | 5 (unmapped) | — | — | own (neither) | — | C | — |
| 56 | bodyweight_lunge | 5 | lb4 rows.json → batches/lb04.json | C | none | — | — | — | — | — | — | — | — |
| 57 | bodyweight_split_squat | 5 | lb4 rows.json → batches/lb04.json | C | none | — | — | — | — | — | — | — | F4 |
| 58 | bodyweight_squat | 5 | lb4 rows.json → batches/lb04.json | C | none | — | — | — | — | — | — | — | — |
| 59 | bulgarian_split_squat | 5 | lb4 rows.json → batches/lb04.json | B | hold | reverse_lunge | 3 (unmapped) | — | — | — | required | — | — |
| 60 | forward_lunge | 5 | lb4 rows.json → batches/lb04.json | B | hold | reverse_lunge | 3 (unmapped) | — | — | — | required | — | — |
| 61 | front_squat | 5 | lb4 rows.json → batches/lb04.json | A | on-body | barbell_back_squat | 2 (unmapped) | yes / in box | — | GAP (front-rack) | — | — | F2 |
| 62 | goblet_squat | 5 | lb4 rows.json → batches/lb04.json | A | on-body | barbell_back_squat | 1 (unmapped) | yes / in box | **yes** | GAP (cupped) | required | — | F2 |
| 63 | jump_squat | 5 | lb4 rows.json → batches/lb04.json | A | none | box_jump | 1 (unmapped) | — | — | — | — | — | — |
| 64 | pistol_squat | 5 | lb4 rows.json → batches/lb04.json | A | none | — | — | — | — | — | — | — | F7 |
| 65 | step_up | 5 | lb4 rows.json → batches/lb04.json | B | hold | — | — | — | — | — | required | — | F4 |
| 66 | walking_lunge | 5 | lb4 rows.json → batches/lb04.json | B | hold | reverse_lunge | 3 (unmapped) | — | — | — | required | — | — |
| 67 | wall_sit | 5 | lb4 rows.json → batches/lb04.json | C | none | bodyweight_squat | 2 (unmapped) | — | — | — | — | — | — |
| 68 | alternating_dumbbell_curl | 5 | lb5 rows.json → batches/lb05.json | C | curl | dumbbell_biceps_curl | 5 (unmapped) | — | — | key curl | — | — | F4, F7 |
| 69 | barbell_curl | 5 | lb5 rows.json → batches/lb05.json | C | curl | dumbbell_biceps_curl | 3 (unmapped) | — | — | key curl | — | — | F2, F7 |
| 70 | bayesian_cable_curl | 5 | lb5 rows.json → batches/lb05.json | C | curl | — | — | — | — | — | — | — | — |
| 71 | cable_curl | 5 | lb5 rows.json → batches/lb05.json | C | curl | — | — | — | — | key curl | — | — | — |
| 72 | concentration_curl | 5 | lb5 rows.json → batches/lb05.json | C | curl | — | — | — | — | — | — | — | F2 |
| 73 | cross_body_hammer_curl | 5 | lb5 rows.json → batches/lb05.json | C | curl | — | — | — | — | key curl | — | — | F2, F7 |
| 74 | dumbbell_overhead_triceps_extension | 5 | lb5 rows.json → batches/lb05.json | A | push | — | — | yes / in box | **yes** | GAP (cupped) | — | I | F3, F4 |
| 75 | ez_bar_curl | 5 | lb5 rows.json → batches/lb05.json | C | curl | dumbbell_biceps_curl | 3 (unmapped) | — | — | key ez | — | — | F2, F7 |
| 76 | hammer_curl | 5 | lb5 rows.json → batches/lb05.json | C | curl | dumbbell_biceps_curl | 3 (unmapped) | — | — | key curl | — | — | — |
| 77 | incline_dumbbell_curl | 5 | lb5 rows.json → batches/lb05.json | C | curl | — | — | — | — | key curl | — | — | F7 |
| 78 | preacher_curl | 5 | lb5 rows.json → batches/lb05.json | C | curl | — | — | — | — | key ez | required | — | — |
| 79 | reverse_curl | 5 | lb5 rows.json → batches/lb05.json | C | curl | — | — | — | — | key ez | required | — | F2 |
| 80 | single_arm_triceps_pushdown | 5 | lb5 rows.json → batches/lb05.json | C | push | triceps_pushdown | 4 (unmapped) | yes / **not in box** | — | GAP (d-handle) | — | F | — |
| 81 | straight_bar_triceps_pushdown | 5 | lb5 rows.json → batches/lb05.json | C | push | triceps_pushdown | 6 (unmapped) | yes / in box | — | own (neither) | — | F | — |
| 82 | wrist_curl | 5 | lb5 rows.json → batches/lb05.json | C | curl | — | — | — | — | GAP (curl) | required | — | F2, F3, F7 |
| 83 | cable_chest_press | 6 | lb6 rows.json → batches/lb06.json | C | push | — | — | yes / **not in box** | — | GAP (d-handle) | — | H | F2 |
| 84 | high_to_low_cable_fly | 6 | lb6 rows.json → batches/lb06.json | B | hold | — | — | — | — | — | — | — | F2, F3, F7 |
| 85 | hip_abduction | 6 | lb6 rows.json → batches/lb06.json | C | balance | — | — | — | — | — | — | — | F7 |
| 86 | hip_adduction | 6 | lb6 rows.json → batches/lb06.json | C | balance | — | — | — | — | — | — | — | F7 |
| 87 | low_to_high_cable_fly | 6 | lb6 rows.json → batches/lb06.json | C | hold | — | — | — | — | GAP (d-handle) | — | — | F2, F7 |
| 88 | machine_crunch | 6 | lb6 rows.json → batches/lb06.json | B | balance | — | — | yes / in box | — | — | — | — | F2 |
| 89 | machine_lateral_raise | 6 | lb6 rows.json → batches/lb06.json | C | balance | — | — | — | — | — | — | — | F7 |
| 90 | machine_pullover | 6 | lb6 rows.json → batches/lb06.json | B | balance | — | — | — | — | own (neither) | — | — | — |
| 91 | rear_delt_fly | 6 | lb6 rows.json → batches/lb06.json | C | pull | — | — | — | — | own (neither) | — | — | F3, F7 |
| 92 | smith_machine_incline_press | 6 | lb6 rows.json → batches/lb06.json | A | push | incline_barbell_bench_press | 5 (unmapped) | — | — | own (neither) | — | C | — |
| 93 | smith_machine_shoulder_press | 6 | lb6 rows.json → batches/lb06.json | A | push | — | — | yes / **not in box** | — | own (neither) | — | B | — |
| 94 | smith_machine_squat | 6 | lb6 rows.json → batches/lb06.json | A | on-body | — | — | yes / in box | — | own (neither) | — | — | F2 |
| 95 | bench_dip | 6 | lb7 rows.json → batches/lb07.json | B | palm-flat | — | — | — | — | GAP (palm-flat) | — | — | F7 |
| 96 | cable_external_rotation | 6 | lb7 rows.json → batches/lb07.json | C | pull | — | — | — | — | — | — | — | F7 |
| 97 | cable_lateral_raise | 6 | lb7 rows.json → batches/lb07.json | C | hold | dumbbell_lateral_raise | — | — | — | — | — | — | — |
| 98 | diamond_push_up | 6 | lb7 rows.json → batches/lb07.json | C | palm-flat | push_up | — | — | — | key palm-flat | — | — | — |
| 99 | dumbbell_front_raise | 6 | lb7 rows.json → batches/lb07.json | C | hold | dumbbell_lateral_raise | — | — | — | own (neither) | — | — | — |
| 100 | face_pull | 6 | lb7 rows.json → batches/lb07.json | C | pull | — | — | — | — | GAP (rope) | — | — | — |
| 101 | incline_push_up | 6 | lb7 rows.json → batches/lb07.json | C | palm-flat | push_up | — | — | — | key palm-flat (no card hand zoom) | — | — | — |
| 102 | pike_push_up | 6 | lb7 rows.json → batches/lb07.json | A | palm-flat | — | — | — | **yes** | key palm-flat (no card hand zoom) | — | — | F7 |
| 103 | renegade_row | 6 | lb7 rows.json → batches/lb07.json | A | palm-flat | — | — | — | **yes** | GAP (palm-flat) | — | — | — |
| 104 | resistance_band_pull_apart | 6 | lb7 rows.json → batches/lb07.json | C | pull | — | — | yes / **not in box** | — | GAP (band) | — | — | — |
| 105 | weighted_dip | 6 | lb7 rows.json → batches/lb07.json | A | push | — | — | — | **yes** | — | — | J | — |
| 106 | battle_ropes | 7 | lb10 rows.json → batches/lb10.json | C | implement | — | — | — | — | key battle-rope | — | — | F2 |
| 107 | bear_crawl | 7 | lb10 rows.json → batches/lb10.json | C | palm-flat | — | — | — | — | key palm-flat | — | — | F1 |
| 108 | burpee | 7 | lb10 rows.json → batches/lb10.json | B | palm-flat | — | — | — | — | key palm-flat | — | — | F7 |
| 109 | farmer_s_carry | 7 | lb10 rows.json → batches/lb10.json | A | hold | — | — | yes / **not in box** | **yes** | own (neither) | required | — | F7 |
| 110 | high_knees | 7 | lb10 rows.json → batches/lb10.json | C | none | — | — | — | — | — | — | — | — |
| 111 | jump_rope | 7 | lb10 rows.json → batches/lb10.json | B | implement | — | — | — | — | GAP (implement) | — | — | F3 |
| 112 | jumping_jacks | 7 | lb10 rows.json → batches/lb10.json | C | none | — | — | — | — | — | — | — | F7 |
| 113 | kettlebell_swing | 7 | lb10 rows.json → batches/lb10.json | A | implement | — | — | yes / **not in box** | **yes** | GAP (implement) | — | — | — |
| 114 | medicine_ball_slam | 7 | lb10 rows.json → batches/lb10.json | A | implement | — | — | yes / **not in box** | **yes** | GAP (ball-contact) | — | — | F7 |
| 115 | sled_pull | 7 | lb10 rows.json → batches/lb10.json | B | pull | — | — | yes / in box | — | GAP (implement) | — | — | — |
| 116 | sled_push | 7 | lb10 rows.json → batches/lb10.json | B | push | — | — | yes / **not in box** | — | own (neither) | — | — | — |
| 117 | wall_ball | 7 | lb10 rows.json → batches/lb10.json | A | implement | — | — | — | **yes** | GAP (ball-contact) | — | — | — |
| 118 | cable_kickback | 7 | lb8 rows.json → batches/lb08.json | C | balance | — | — | yes / **not in box** | — | — | — | — | F2, F3 |
| 119 | glute_bridge | 7 | lb8 rows.json → batches/lb08.json | C | none | — | — | yes / **not in box** | — | — | required | — | F2 |
| 120 | hack_squat | 7 | lb8 rows.json → batches/lb08.json | B | balance | — | — | yes / **not in box** | — | — | — | — | — |
| 121 | leg_extension | 7 | lb8 rows.json → batches/lb08.json | C | balance | — | — | yes / **not in box** | — | — | — | — | — |
| 122 | lying_leg_curl | 7 | lb8 rows.json → batches/lb08.json | C | balance | — | — | yes / **not in box** | — | — | — | — | F7 |
| 123 | pendulum_squat | 7 | lb8 rows.json → batches/lb08.json | B | balance | — | — | — | — | — | — | — | F7 |
| 124 | resisted_hip_flexion | 7 | lb8 rows.json → batches/lb08.json | C | balance | — | — | yes / in box | — | — | required | — | — |
| 125 | standing_leg_curl | 7 | lb8 rows.json → batches/lb08.json | C | balance | lying_leg_curl | — | yes / **not in box** | — | — | — | — | F7 |
| 126 | ab_wheel_rollout | 7 | lb9 rows.json → batches/lb09.json | A | push | — | — | yes / in box | **yes** | — | — | — | — |
| 127 | bird_dog | 7 | lb9 rows.json → batches/lb09.json | C | palm-flat | — | — | yes / **not in box** | — | key palm-flat | — | — | F1, F3 |
| 128 | cable_crunch | 7 | lb9 rows.json → batches/lb09.json | B | on-body | — | — | yes / **not in box** | — | GAP (rope) | — | — | F2, F3 |
| 129 | dead_bug | 7 | lb9 rows.json → batches/lb09.json | C | none | — | — | yes / **not in box** | — | — | — | — | F1 |
| 130 | hollow_body_hold | 7 | lb9 rows.json → batches/lb09.json | C | none | — | — | yes / **not in box** | — | — | — | — | F2 |
| 131 | reverse_crunch | 7 | lb9 rows.json → batches/lb09.json | C | none | crunch | — | yes / **not in box** | — | — | — | — | F1 |
| 132 | side_plank | 7 | lb9 rows.json → batches/lb09.json | C | none | — | — | — | — | — | — | — | F1, F7 |
| 133 | superman | 7 | lb9 rows.json → batches/lb09.json | C | none | — | — | yes / **not in box** | — | — | — | — | F2, F3 |
| 134 | v_up | 7 | lb9 rows.json → batches/lb09.json | B | none | hollow_body_hold | — | yes / **not in box** | — | — | — | — | — |

## 8. Inherit map proposal (D-LIB9a-MAP form)

Source: unmapped.json (30 children, 110 fields), each child card's `inherit[]`, the parent cards, `family.mjs` (atPath, leaves, THUMB) and `content-types.ts`. Base b9369130. Every parent sheet in `tools/plates/library/howto/` is still a stub (id + research.card), except `lib_barbell_back_squat`, which ships from the golden-B `tools/plates/layers/exercises/barbell_back_squat.howto.mjs`. So every key below except the squat's is a constraint on how the parent sheet gets written.

Rules that apply to every row:
- `THUMB` = `['handling.thumb.mode','handling.pose.thumb']`. `thumb.options` is not compared, so the parent's "straps allowed" line does not bind a child.
- `handling.wrist` compares `ext`, `dev` and `limitText` (or `exempt`). For a dumbbell, handle or V-handle child of a bar parent, the parent's `limitText` must not name "bar".
- `posture[key=k]` and `zooms[key=k]` compare `label`, `detail`, `anchor` and `zoom` (posture), or every crop, pose, caption and alt leaf (zoom). The anchor landmarks and stills must exist on the child's plate. A parent checkpoint that names a `zoom` forces the child to have a zoom with that same key.
- `setup[kind=k]` needs exactly one step of that kind in both sheets.
- `riskFlags` is compared as a whole, ordered array. A selector cannot pick one string out of it.
- Parent order: `incline_barbell_bench_press` (W4) has to ship before `smith_machine_incline_press` (W6). `conventional_deadlift` and `sumo_deadlift` are both in lb3, so the conventional sheet must be in the same head or an earlier one.

### W2
| child | parent | card field | proposed paths | note |
|---|---|---|---|---|
| single_leg_romanian_deadlift | romanian_deadlift | grip.thumb | THUMB | wrapped in both |
| single_leg_romanian_deadlift | romanian_deadlift | grip.wrist | ['handling.wrist'] | RDL limitText must not name "bar" (dumbbell child) |

### W3
None of the unmapped fields are in W3.

### W4
| child | parent | card field | proposed paths | note |
|---|---|---|---|---|
| arnold_press | dumbbell_shoulder_press | grip.thumb | THUMB | |
| arnold_press | dumbbell_shoulder_press | grip.wrist | ['handling.wrist'] | neutral in both (parent c2, c6) |
| arnold_press | dumbbell_shoulder_press | setup.spotter | ['setup[kind=safety]'] | parent's only safety step: "If using a spotter, they stand behind you, hands near your wrists." (child S3 is identical) |
| arnold_press | dumbbell_shoulder_press | zooms.seat-back-contact | ['zooms[key=seat-back-contact]'] | posture crop: stills and anchors must exist on the Arnold plate |
| cable_shrug | barbell_shrug | grip.thumb | THUMB | |
| cable_shrug | barbell_shrug | grip.wrist | ['handling.wrist'] | FLAG |
| cable_shrug | barbell_shrug | risks[breath] | ['risks[key=breath]'] | text identical in both cards |
| cable_shrug | barbell_shrug | redFlags | ['riskFlags'] | ['shoulder'] in both |
| cable_shrug | barbell_shrug | grip.type | ['handling.orientation','handling.handle'] | FLAG (handle) |
| cable_shrug | barbell_shrug | grip.width | ['handling.width'] | FLAG |
| close_grip_bench_press | barbell_bench_press | grip.thumb | THUMB | |
| close_grip_bench_press | barbell_bench_press | grip.handContact | ['handling.contact'] | |
| close_grip_bench_press | barbell_bench_press | grip.wrist | ['handling.wrist'] | |
| close_grip_bench_press | barbell_bench_press | setup.safety-pins | ['setup[kind=safety]'] | bench S0; this must be the only safety step in the bench family |
| close_grip_bench_press | barbell_bench_press | setup.spotter | ['setup[kind=get-in]'] | bench S3 (spotter, unrack); a kind used once in both sheets, never safety |
| close_grip_bench_press | barbell_bench_press | zooms.bar-low-palm | ['zooms[key=bar-low-palm]'] | strings identical |
| conventional_deadlift | romanian_deadlift | grip.thumb | THUMB | |
| conventional_deadlift | romanian_deadlift | grip.handContact | ['handling.contact'] | |
| conventional_deadlift | romanian_deadlift | grip.wrist | ['handling.wrist'] | |
| conventional_deadlift | romanian_deadlift | archetype.contact | ['contacts'] | ['standing-feet'] in both |
| decline_bench_press | barbell_bench_press | grip.thumb | THUMB | |
| decline_bench_press | barbell_bench_press | grip.handContact | ['handling.contact'] | |
| decline_bench_press | barbell_bench_press | grip.wrist | ['handling.wrist'] | |
| decline_bench_press | barbell_bench_press | zooms.bar-low-palm | ['zooms[key=bar-low-palm]'] | |
| dumbbell_romanian_deadlift | romanian_deadlift | grip.wrist | ['handling.wrist'] | limitText must not name "bar" |
| dumbbell_romanian_deadlift | romanian_deadlift | posture: knees fixed at a slight bend, movement at the hips (parent c4) | ['posture[key=hinge]'] | FLAG; parent P0 carries key hinge |
| dumbbell_shrug | barbell_shrug | grip.thumb | THUMB | |
| dumbbell_shrug | barbell_shrug | grip.wrist | ['handling.wrist'] | FLAG |
| dumbbell_shrug | barbell_shrug | risks[breath] | ['risks[key=breath]'] | |
| dumbbell_shrug | barbell_shrug | redFlags | ['riskFlags'] | ['shoulder'] in both |
| incline_barbell_bench_press | barbell_bench_press | grip.thumb | THUMB | |
| incline_barbell_bench_press | barbell_bench_press | grip.handContact | ['handling.contact'] | |
| incline_barbell_bench_press | barbell_bench_press | zooms.bar-low-palm | ['zooms[key=bar-low-palm]'] | |
| incline_barbell_bench_press | barbell_bench_press | setup.safety-pins | ['setup[kind=safety]'] | child S1 = bench S0. The incline "With a spotter, unrack…" step (S3) must not be safety |
| incline_dumbbell_press | dumbbell_bench_press | grip.thumb | THUMB | |
| incline_dumbbell_press | dumbbell_bench_press | grip.wrist | ['handling.wrist'] | |
| incline_dumbbell_press | dumbbell_bench_press | zooms.wrist-neutral-press | ['zooms[key=wrist-neutral-press]'] | strings identical |
| landmine_row | barbell_row | grip.type | ['handling.orientation','handling.handle'] | pronated in both; `pose.handle.axis` (one hand above the other) is not compared |
| landmine_row | barbell_row | grip.thumb | THUMB | |
| landmine_row | barbell_row | posture[back neutral] | ['posture[key=back]'] | FLAG; parent P0 "Back neutral the whole set." |
| landmine_row | barbell_row | risks[breath] | ['risks[key=breath]'] | |
| landmine_row | barbell_row | redFlags | ['riskFlags'] | ['back'] in both |
| pendlay_row | barbell_row | grip.type | ['handling.orientation','handling.handle'] | same barbell |
| pendlay_row | barbell_row | grip.thumb | THUMB | |
| pendlay_row | barbell_row | grip.handContact | ['handling.contact'] | |
| pendlay_row | barbell_row | risks[breath] | ['risks[key=breath]'] | |
| pendlay_row | barbell_row | redFlags | ['riskFlags'] | ['back'] in both |
| smith_machine_bench_press | barbell_bench_press | grip.thumb | THUMB | |
| smith_machine_bench_press | barbell_bench_press | grip.type | ['handling.orientation','handling.handle'] | no card gives the Smith bar's diameter, so the shared profile is unverified |
| smith_machine_bench_press | barbell_bench_press | grip.handContact | ['handling.contact'] | |
| smith_machine_bench_press | barbell_bench_press | grip.wrist | ['handling.wrist'] | |
| smith_machine_bench_press | barbell_bench_press | zooms.bar-low-palm | ['zooms[key=bar-low-palm]'] | hand-pose handle profile is unverified (as for grip.type) |
| smith_machine_shrug | barbell_shrug | grip.thumb | THUMB | |
| smith_machine_shrug | barbell_shrug | grip.handContact | ['handling.contact'] | |
| smith_machine_shrug | barbell_shrug | zooms.shrug-grip | ['zooms[key=shrug-grip]'] | FLAG |
| sumo_deadlift | conventional_deadlift | grip.thumb | THUMB | |
| sumo_deadlift | conventional_deadlift | grip.handContact | ['handling.contact'] | |
| sumo_deadlift | conventional_deadlift | grip.wrist | ['handling.wrist'] | |
| sumo_deadlift | conventional_deadlift | archetype.contact | ['contacts'] | |
| sumo_deadlift | conventional_deadlift | plate.equipment (bar on the floor with full-size plates, parent c23) | no sheet path; leave inherit[] by research route | FLAG |
| t_bar_row | barbell_row | posture[trunk angle stays the same] | ['posture[key=trunk]'] | FLAG; parent P3 |
| t_bar_row | barbell_row | grip.thumb | THUMB | V-handle; mode only |
| t_bar_row | barbell_row | risks[breath] | ['risks[key=breath]'] | |
| t_bar_row | barbell_row | redFlags | ['riskFlags'] | ['back'] in both |

### W5
| child | parent | card field | proposed paths | note |
|---|---|---|---|---|
| alternating_dumbbell_curl | dumbbell_biceps_curl | grip.type | ['handling.orientation','handling.handle'] | strings identical (supinated, dumbbell) |
| alternating_dumbbell_curl | dumbbell_biceps_curl | grip.thumb | THUMB | |
| alternating_dumbbell_curl | dumbbell_biceps_curl | grip.width | ['handling.width'] | FLAG |
| alternating_dumbbell_curl | dumbbell_biceps_curl | plate.view | no sheet path; leave inherit[] by research route | FLAG (plate-only) |
| alternating_dumbbell_curl | dumbbell_biceps_curl | redFlags | ['riskFlags'] | ['wrist'] in both |
| barbell_curl | dumbbell_biceps_curl | plate.view | no sheet path; leave inherit[] by research route | FLAG (plate-only) |
| barbell_curl | dumbbell_biceps_curl | grip.thumb | THUMB | |
| barbell_curl | dumbbell_biceps_curl | redFlags | ['riskFlags'] | ['wrist'] in both |
| bulgarian_split_squat | reverse_lunge | plate.view | no sheet path; leave inherit[] by research route | FLAG (plate-only) |
| bulgarian_split_squat | reverse_lunge | redFlags.knee | ['riskFlags'] | whole array; ['knee'] in both |
| bulgarian_split_squat | reverse_lunge | grip | ['handling'] | leg-press form; hold at the sides in both; whole handling, including gripLine, cue and faults, identical |
| ez_bar_curl | dumbbell_biceps_curl | plate.view | no sheet path; leave inherit[] by research route | FLAG (plate-only) |
| ez_bar_curl | dumbbell_biceps_curl | grip.thumb | THUMB | |
| ez_bar_curl | dumbbell_biceps_curl | redFlags | ['riskFlags'] | ['wrist'] in both |
| forward_lunge | reverse_lunge | plate.view | no sheet path; leave inherit[] by research route | FLAG (plate-only) |
| forward_lunge | reverse_lunge | redFlags.knee | ['riskFlags'] | ['knee'] in both |
| forward_lunge | reverse_lunge | grip | ['handling'] | FLAG |
| front_squat | barbell_back_squat | setup[2] (load the plates evenly, collars on) | none valid | FLAG |
| front_squat | barbell_back_squat | posture[3] (feet flat, knees follow the toes) | ['posture[key=feet]'] | FLAG; key from the shipped golden sheet (label "Knees follow toes") |
| goblet_squat | barbell_back_squat | posture[3] (feet flat, knees follow the toes) | ['posture[key=feet]'] | FLAG; same golden key |
| hammer_curl | dumbbell_biceps_curl | plate.view | no sheet path; leave inherit[] by research route | FLAG (plate-only) |
| hammer_curl | dumbbell_biceps_curl | grip.width | ['handling.width'] | FLAG |
| hammer_curl | dumbbell_biceps_curl | redFlags | ['riskFlags'] | ['wrist'] in both |
| jump_squat | box_jump | plate.frames (airborne convention: take-off and landing frames only) | no sheet path; leave inherit[] by research route | FLAG (plate-only); the strings are identical in both cards |
| single_arm_triceps_pushdown | triceps_pushdown | plate.view | no sheet path; leave inherit[] by research route | FLAG (plate-only) |
| single_arm_triceps_pushdown | triceps_pushdown | grip.thumb | THUMB | |
| single_arm_triceps_pushdown | triceps_pushdown | grip.wrist | ['handling.wrist'] | parent limitText must not name "bar" (one handle) |
| single_arm_triceps_pushdown | triceps_pushdown | redFlags | ['riskFlags'] | ['elbow','back'] in both, same order |
| straight_bar_triceps_pushdown | triceps_pushdown | plate.view | no sheet path; leave inherit[] by research route | FLAG (plate-only) |
| straight_bar_triceps_pushdown | triceps_pushdown | plate.equipment | no sheet path; leave inherit[] by research route | FLAG (plate-only) |
| straight_bar_triceps_pushdown | triceps_pushdown | grip.thumb | THUMB | |
| straight_bar_triceps_pushdown | triceps_pushdown | grip.wrist | ['handling.wrist'] | |
| straight_bar_triceps_pushdown | triceps_pushdown | zooms | ['zooms[key=pushdown-elbow]','zooms[key=pushdown-wrist].caption.right'] | FLAG (partial) |
| straight_bar_triceps_pushdown | triceps_pushdown | redFlags | ['riskFlags'] | ['elbow','back'] in both |
| walking_lunge | reverse_lunge | plate.view | no sheet path; leave inherit[] by research route | FLAG (plate-only) |
| walking_lunge | reverse_lunge | redFlags.knee | ['riskFlags'] | ['knee'] in both |
| walking_lunge | reverse_lunge | grip | ['handling'] | hold at the sides in both |
| wall_sit | bodyweight_squat | posture[1] (knees over the second toe, ankles not rolling) | ['posture[key=knees]'] | FLAG; parent P1 (b5) |
| wall_sit | bodyweight_squat | b10 / redFlags knee (NHS knee box) | ['riskFlags'] | ['knee'] in both; b10 is the parent's NHS knee claim |

### W6
| child | parent | card field | proposed paths | note |
|---|---|---|---|---|
| smith_machine_incline_press | incline_barbell_bench_press | grip.type | ['handling.orientation','handling.handle'] | pronated; the Smith bar profile is unverified |
| smith_machine_incline_press | incline_barbell_bench_press | grip.thumb | THUMB | value comes through the parent from barbell_bench_press c4 |
| smith_machine_incline_press | incline_barbell_bench_press | grip.handContact | ['handling.contact'] | the same, from bench c5 |
| smith_machine_incline_press | incline_barbell_bench_press | grip.wrist | ['handling.wrist'] | from the parent's own c4 |
| smith_machine_incline_press | incline_barbell_bench_press | zooms.bar-low-palm | ['zooms[key=bar-low-palm]'] | strings identical |

### W7
None of the unmapped fields are in W7.

**Count:** 82 mapped and 28 flagged (12 of the flags are plate-only). Total 110.

### Inherit flags
1. cable_shrug grip.wrist: the child says "bent back about 35 degrees" (c10, c11), but the parent's wrist text is "Not given by any shrug source read (hold archetype default)". The claims conflict.
2. cable_shrug grip.type: the orientation matches, but the handle is a straight cable bar, not a barbell. No card gives its diameter, so `handling.handle` may be wrong for this equipment. If it differs, map only `handling.orientation`.
3. cable_shrug grip.width: the child says "Shoulder width or slightly wider", the parent "About shoulder width". The `handling.width.text` values cannot be `===`.
4. dumbbell_romanian_deadlift posture: the parent P0 reads "Knees fixed at a slight bend. The movement is at the hips." The child card has no such line. Its P0, "Hips back, knees softly bent behind the toes.", is a different line.
5. dumbbell_shrug grip.wrist: the same conflict as flag 1 (the child says bent back 35 degrees; the parent's wrist is not given).
6. landmine_row posture[back neutral]: the child card's line is "Back straight, not rounded." (c9), not the parent's "Back neutral the whole set." The sheet would show the parent's wording, which the child's own posture list does not hold.
7. smith_machine_shrug zooms.shrug-grip: the parent's right line includes "hands shoulder width", but the child's width is "slightly wider than the shoulders" (c1), and the child's own right line drops the width. A mapped zoom would make the child repeat a width that is wrong for it.
8. sumo_deadlift plate.equipment: no sheet path carries this (it is plate data). The parent's c23 string is a setup step ("Load the bar on the floor with full-size plates."), which the sumo card's setup does not hold, so `setup[kind=load]` would fail.
9. t_bar_row posture[trunk angle stays the same]: no posture line in the child card holds the parent P3 "Trunk angle stays the same while the bar moves."
10. alternating_dumbbell_curl grip.width: the child drops the parent's "dumbbells close to the body". The texts differ.
11. hammer_curl grip.width: the child's text is "Dumbbells alongside the thighs; …", the parent's "Arms hanging at the sides, dumbbells close to the body; …". The texts differ.
12. forward_lunge grip: the child adds "palms facing in" (c5), and the parent states no palm direction. A whole-`handling` match fails if the child sheet carries an orientation the parent sheet lacks.
13. front_squat setup[2]: neither the child card nor the shipped golden parent has a "load the plates evenly" step. The golden sheet folds collars into its pins step, and it has two `kind: 'safety'` steps, so `setup[kind=safety]` matches 2. The index is also inconsistent: "setup[2]" is the card's 1-based S1, while posture[3] is 0-based.
14. front_squat posture[3]: the child card's P3 is "Whole-foot balance, knees in line with the feet.", and its stance is "toes out 15-30 degrees". The golden parent's `feet` detail says "Feet hip to shoulder width, toes out a little … may pass the toes". The child would repeat a stance its own card words differently.
15. goblet_squat posture[3]: the child card has no matching posture line. The card itself says no goblet source states the toe direction. The golden `feet` detail ("toes out a little", "may pass the toes") would rest only on the parent's research.
16. wall_sit posture[1]: the child's own w4 and P1 say "Knees directly above the ankles", which is a different rule from the parent's "Knees over the second toe, ankles not rolling" (b5).
17. straight_bar_triceps_pushdown zooms: the card inherits only zooms[1] in full plus zooms[0]'s right line. The parent's zooms[0] wrong line ("Wrists bent back over the bar.") is null in the child (LR-25), so zooms as a whole cannot be `===`. The proposed partial map assumes the card's right line is carried in `caption.right`, which is not verified.
18. to 29. plate-only, so no sheet path. Leave each inherit[] by research route, as in F-LB1-SETUP:
    - plate.view on alternating_dumbbell_curl, barbell_curl, bulgarian_split_squat, ez_bar_curl, forward_lunge, hammer_curl, single_arm_triceps_pushdown, straight_bar_triceps_pushdown and walking_lunge;
    - plate.equipment on straight_bar_triceps_pushdown (its string also drops the parent's "(above head height)");
    - plate.frames on jump_squat;
    - sumo's plate.equipment, already counted as flag 8.

## 9. Entry and merge prerequisites



Sources: `git log origin/main --first-parent`; `git show/grep origin/main:…`; lib4 = lib4-cards.md from claude/sup-lib4-cards (its lines 73 and 1230 read the same on main); cards = lib-NN-card.md from the same branch. "R<n>" = LIB-SHIP supervisor ruling n (lib-ship-card.md:171-189).

### D-LIB4-ENTRY on b9369130

| Condition | Status | Evidence |
|---|---|---|
| GATE-SPLIT #194 and #219 merged | met | b70ca58e "Merge train 22: GATE-SPLIT #194, GATE-SPLIT CI wiring #219, LIB-2b #234" |
| LIB-2b merged | met | b70ca58e (train 22, #234) |
| LIB-4a merged | met | b99a9e25 (train 25, #233) |
| LIB-4b and LIB-4c merged | met | d9dbd067 (train 28: LIB-4b #232, LIB-4c #246 + CI wiring #249) |
| CI calibration committed (C14) | met | tools/plates/library/ci/times.json (b6715328 from C14 runs 39133500575/39134810143; c0 6ccaa865); LIB-4-DESIGN.md:322 |
| 5 consecutive identical full runs, K >= 2, one sha (C13), compare.mjs | met | LIB-4-DESIGN.md:326: runs 39146621138…39153265130 on 42716893, compare.mjs PASS, 2,218 rows/752 px; K = 7 for 6 ids (lib4:2671) |
| HT-3's 5 identical CI reruns | met | D-LIB4-ENTRY-HT3, lib4:1230 (E8's 10 runs on 82d896d, timings removed); HANDOVER.md:2486 |
| 11.1 item 14 shared-key proof before an id sharing a key ships (lib4:664) | met | LIB-7b #284 merged 66ff5500 with 7b-A3 shared-key proof as acceptance, REVIEW PASS (HANDOVER.md:1365; lib-7b-card.md:200) |
| D-LIB4-ENTRY-2 (lib4:1055-1070): LB1 build-ahead ceiling | met, now superseded by R2/R3 | LIB-9a #245 merged a22d84e5; its A9 guard is replaced in W3 under R3 |
| Caveat (not a failed condition) | note | C13/C14 ran on LIB-4c's runner; ci/ and fidelity changed since in 14 commits (LIB-5, LIB-6-PM, LIB-7b, LIB-5v, pilot pins: `git log d9dbd067..origin/main`) |

### merge_prerequisites

#### lib-10 (LB2)
| Line | Status | Evidence / route |
|---|---|---|
| LIB-9 merged + every D-LIB4-ENTRY condition | ruled + met | R1 replaces the LIB-9 ship card (LB1 ships in W3 before W4); ENTRY table above |
| Pilot A's yes on main | met | owner "Pilot a ok" 10-19 (HANDOVER.md:1639); pilot A pinned, dd7116e9 (#109, train 34) |
| LIB-3c on main | met | 565ea5a4 (train 30, #264) |
| D-LIB5-FAMILY comparator + inherit[] map for LB2 children | routed | familyRefusal on main (lint/family.mjs:68) but no resolver (:78); R4 resolver in W2, map ruled per wave (W4) |
| LIB-5v before skull_crusher | met | cd6113c4 (train 35, #282) |
| LIB-5 back box on main | met | 07ad7f1c (train 32, #270) |
| dumbbell_fly only after LIB-20 with camera.pitch + plate approved | met | LIB-20 #311 1974a41a; vendor/engine/plate.mjs:54-56; pilot-a3.json stage approved-plate; PILOT-A3 PIN GO (golden/library/pilot-a3.json:51-76) |
| Pitch rulings await owner go/no-go | ruled | D-ER5-GO under the owner's 10-24 delegation (#278 6381385131), cited in golden/library/pilot-a3.json:76 |
| Calibrated critic R8, R9 >= 4 per plate | routed | R10 (layers panel per wave) |

#### lib-13 (LB3)
| Line | Status | Evidence / route |
|---|---|---|
| Lower checklist items merged, LIB-11 incl. | met + routed | #278 in 40f9ea93 (train 38); order now R1 |
| HT-11 on main | met | 40f9ea93 (train 38, #273) |
| LB1 #245 and LB2 #265 merged | met + routed | build-ahead merged: a22d84e5, 40f9ea93; shipping order W3 → W4 (R1) |
| Pilot A's yes | met | as lib-10 |
| Every D-LIB4-ENTRY condition | met | table above |
| F-LB3-1 breath risk + comparator green for 3 row children | met + routed | text on main: cards/barbell_row.json:682, barbell_shrug.json:436, romanian_deadlift.json:779; comparator → R4 (W4) |
| Comparator + inherit map for LB3 children | routed | R4 (resolver W2, map per wave); parents first (D-LIB10-PARENTS, W4 plan) |
| Back box on main (#270, LIB-6-PM) | met | 07ad7f1c; 2647c3a6 (train 33, #181) |
| LIB-5v before t_bar_row / back_extension | met | cd6113c4 |
| one_arm_dumbbell_row F7 owner yes | routed | R11 (asked with the W1 APK message) |
| Critic R8, R9 | routed | R10 |
| Shrugs only through LIB-13s | met | 9c8035fd (train 57, #359) |

#### lib-14 (LB4)
| Line | Status | Evidence / route |
|---|---|---|
| Checklist order (8.0o D 1-14, LIB-12, LIB-13) | met + routed | #191 b0370201, #274 40f9ea93; order R1 |
| LIB-12 on main; front_squat/goblet_squat no close-up (GAPS) | met + routed | b0370201; GAP ship under R8 |
| Pilot A's yes | met | as lib-10 |
| Every D-LIB4-ENTRY condition | met | table above |
| Comparator + inherit map (front_squat, goblet_squat, wall_sit) | routed | R4; wall_sit after bodyweight_squat (D-LIB10-PARENTS) in W5 plan |
| Back box on main | met | 07ad7f1c (+ appliesTo gaps via R6) |
| LIB-5v before goblet_squat / step_up | met | cd6113c4 |
| pistol_squat F7 owner yes | routed | R11 |
| step_up: reverse_lunge redrawn, approved, pinned | met | pilot-a3 PIN GO (golden/library/pilot-a3.json:15); step_up approved, #364 7ed2da4f |
| Five D-LIB14-NOSECS rows: strip card on main, pass QA/critic | met | LIB-STRIP #309 bec24ebd; rows in "142/153 approved" (lib4:4696) |
| Critic R8, R9 | routed | R10 |

#### lib-15 (LB5)
| Line | Status | Evidence / route |
|---|---|---|
| Checklist order (… LIB-14, LB5a before LB5b) | routed | R1 (W5 holds LB4 + LB5) |
| Pilot A anchors pinned (rope_triceps_pushdown, barbell_overhead_press, dumbbell_biceps_curl, upright_row) | met | batches/pilot-a.json, golden/library/pilot-a.json (dd7116e9) |
| Every D-LIB4-ENTRY condition | met | table above |
| Shared-key clause for 4 close-ups (LIB-7b proof) | met + routed | LIB-7b 66ff5500; per-wave layers page/panel R10, A4; GAPs R8 |
| Back box (overhead_cable_triceps_ext, dumbbell_overhead_triceps_ext) | met + ruled | 07ad7f1c; overhead_cable_triceps_extension left out (D-OWNER-LIB142, lib4:4697; R14) |
| LIB-5v before preacher_curl / wrist_curl | met | cd6113c4 |
| incline_dumbbell_press, reverse_lunge redrawn + pinned | met + routed | incline_dumbbell_press APPROVED lib4:4282; reverse_lunge pilot-a3 pin; batch pin at move (R2, W4 before W5) |
| preacher_curl approved; skull_crusher pinned first | met + routed | skull_crusher approved lib4:4152; preacher pinned lb5-plates.test.ts APPROVED_FRAGS (:982); batch pin R2 |
| F7 ids owner yes (wrist_curl: F2, F3, F7 per lb5/qa.mjs:54, no F1: the zoom route was taken; corrected 11-04, #379 6627967819) | routed | R11 |
| Critic R8, R9 | routed | R10 |

#### lib-16 (LB6)
| Line | Status | Evidence / route |
|---|---|---|
| Checklist order (… LIB-14, LB5) | routed | R1 (W6 after W5) |
| Pilot B answered + pinned | met | 40f9ea93 (#278); golden/library/pilot-b.json approvals cite 10-24 delegation |
| Every D-LIB4-ENTRY condition | met | table above |
| Shared-key clause does not arise; machine_pullover hand zoom gap | routed | R8 (GAP by ruling) |
| Back box; cable_chest_press 'back' not in appliesTo | met + routed | 07ad7f1c; appliesTo edit R6 (before W5) |
| No variant line | met | n/a |
| reverse_lunge pinned before cable_chest_press | met | pilot-a3 pin |
| pulloverMachine, crunchMachine approved new rigs | met | machine_pullover/crunch in 142 approved (lib4:4696); pins lb6-plates.test.ts |
| D-LIB8-shrug rows after LIB-ZOOM | met | LIB-ZOOM #279 a22d84e5; rows approved |
| LIB-4b scratch target off cable_chest_press | routed | R15 (ci/scratch.mjs:32 TAKEN, fidelity/fixture.mjs) |
| (found) smith_machine_incline_press is a LIB-4c target; smith_machine_shoulder_press a LIB-7b target | open | ci/scratch.mjs:26; tests/library/fixtures/lib7b/fixture.mjs:20; not named in the card |
| Critic R8, R9 | routed | R10 |

#### lib-17 (LB7)
| Line | Status | Evidence / route |
|---|---|---|
| Checklist order (… LB5, LB6) | routed | R1 (W6) |
| E-R5 go → LIB-20 first | met | LIB-20 #311 1974a41a, before LB7 #299 (9c3287cd) |
| Pilot A anchors pinned (upright_row, dumbbell_biceps_curl, rope_triceps_pushdown, plank) | met | pilot-a pins (dd7116e9); plank APPROVED lib4:4262 |
| Pilot B answered; push_up pinned | met | batches/pilot-b.json; golden/library/pilot-b.json |
| one_arm_dumbbell_row, resistance_band_row approved + pinned | met + routed | one_arm lib4:4241; LB1/LB3 in 142; batch pins W3/W4 before W6 (R1, R2) |
| dipBars / weighted_dip approved | met | lb7-plates.test.ts:1406 area; 142 approved |
| F7 ids (+F1 under D-LIB17-ER) | routed + ruled | R11; cable_rear_delt_fly left out (D-OWNER-LIB142) |
| cable_rear_delt_fly, renegade_row after strip card | met + ruled | LIB-STRIP bec24ebd; renegade_row approved; cable_rear_delt_fly out |
| D-LIB8-shrug rows after LIB-ZOOM | met | a22d84e5 |
| No key draws the 9 (gaps) | routed | R8 |
| Back box (resistance_band_pull_apart); renegade_row wrist box | routed + met | R6; wrist box exists: tools/plates/layers/artifact/copy-lint.mjs:76 |
| cable_external_rotation text-only feel (empty primary) | open | card feel.primary []; no text-only primary state found on main (c2.ts:26 refuses NO_REGION primary; no empty-primary rule found) [unverified] |
| No variant line | met | n/a |
| LIB-2b target off cable_lateral_raise | routed | R15 (ci/scratch.mjs:32 TAKEN) |
| Critic R8, R9 | routed | R10 |

#### lib-18 (LB8)
| Line | Status | Evidence / route |
|---|---|---|
| Checklist order (… LB7) | routed | R1 (W7) |
| E-R5 go → LIB-20 first | met | 1974a41a |
| Pilot A anchors (single_leg_rdl, rdl, barbell_row, dumbbell_biceps_curl) | met | pilot-a pins |
| straight_arm_pulldown approved + pinned | met + routed | LB1 in 142; batch pin W3 (R2) |
| Pilot B answered; seated_leg_curl pinned | met | pilot-b.json pins |
| Five composers approved with anchors | met + ruled | hack_squat, pendulum, leg_extension, cable_kickback, resisted_hip_flexion approved (lib4:4255, :4691); calf raises, hip_thrust out (D-OWNER-LIB142) |
| Every D-LIB4-ENTRY condition | met | table above |
| F7 ids owner yes | routed + ruled | R11 for pendulum_squat, lying/standing_leg_curl; 3 calf raises out (R14) |
| LIB-5v before hip_thrust/glute_bridge/resisted_hip_flexion | met | cd6113c4 (hip_thrust out) |
| D-LIB8-shrug after LIB-ZOOM; calf S4 owner answer | met + ruled | a22d84e5; calf S4 → D-OWNER-LIB142 (lib4:4697) |
| Shared-key does not arise; hip_thrust hand zoom | ruled | hip_thrust left out (R14) |
| Back box (7 ids); knee box | routed + met | R6 (hip_thrust out); knee box exists copy-lint.mjs:80 |
| No LB8 scratch target | met | ci/scratch.mjs:20-32, fixtures: no LB8 id |
| Critic R8, R9 | routed | R10 |

#### lib-21 (LB9)
| Line | Status | Evidence / route |
|---|---|---|
| Checklist order (pilots, LB1-LB8, LIB-20) | met + routed | pilots, LIB-20 merged; order R1 (W7) |
| Plank owner-approved + pinned (D-LIB8M-PLANKREDRAW) | met | lib4:4262; pilot-a pin |
| Other anchors (D-LIB21-CLASSES) | met + ruled | anchors in 142 / pilot pins; russian_twist, bicycle_crunch anchors moot (left out) |
| Every D-LIB4-ENTRY condition | met | table above |
| F7 (side_plank) + F1 floor plates owner yes | routed + ruled | R11; russian_twist, bicycle_crunch out (R14) |
| SIZE rows after LIB-ZOOM; NOSECS after LIB-STRIP | met | a22d84e5; bec24ebd; rows approved (142) |
| LIB-5v before russian_twist | ruled | russian_twist out (D-OWNER-LIB142) |
| Ship-time: palm-flat bird_dog shared-key; hand gaps | met + routed | LIB-7b proof; gaps R8 |
| Ship-time: back box; side_plank knee | routed + met | R6 (pallof out); knee box copy-lint.mjs:80 |
| Ship-time: ab_wheel_rollout wayOut null | routed | R7 |
| Ship-time: content.test pallof_press drop | ruled | pallof_press out (R14); re-run with W7 |
| Ship-time: gate names Ab Wheel/Cable Crunch | routed | A6 LIB-SHIP gate block, add-only (AGENTS.md:73) |
| No LB9 scratch target | met | no LB9 id in ci/scratch.mjs or fixtures |
| Critic R8, R9 | routed | R10 |

#### lib-22 (LB10)
| Line | Status | Evidence / route |
|---|---|---|
| Checklist order (… LB9, LIB-20) | met + routed | LIB-20 merged; order R1 (W7) |
| Pilot A anchors incl. box_jump (was held) | met | box_jump pinned PILOT-A2 (6b32d576, train 53; lib-small-card.md:22) |
| Pilot B; push_up pinned | met | pilot-b pins |
| wall_sit pinned; bird_dog approved | met + routed | both in 142; batch pins W5/W7 (R2) |
| Five composers approved (sled, medBall, jumpRope, battleRope, kettlebell) | met | lib4:4255; jump_rope released #368 (lib4:4691) |
| Every D-LIB4-ENTRY condition | met | table above |
| F7 ids + bear_crawl F1 owner yes | routed | R11 |
| jump_rope airborne convention judged on box_jump | ruled | D-LIB8R-AIR (lib-8r-card.md:190); box_jump pinned |
| NOSECS / SIZE rows | met | bec24ebd, a22d84e5; rows approved |
| LIB-5v before farmer_s_carry | met | cd6113c4 |
| Shared-key (burpee, bear_crawl palm-flat); hand gaps | met + routed | LIB-7b proof; gaps R8 |
| battle_ropes hand camera is the owner's choice | open | D-LIB12FIX-ROPE deferred (lib4:3968); no ruling found |
| Back box (4 ids); wrist/knee/shoulder boxes | routed + met | R6; boxes exist copy-lint.mjs:76-82 |
| medicine_ball_slam, wall_ball wayOut null | routed | R7 |
| farmer_s_carry in 3 gate blocks | routed | A6 add-only gate block |
| No LB10 id is a scratch target | not met | jumping_jacks, sled_push are LIB-4c targets (ci/scratch.mjs:21, :25; added 8ae48ed9, D-LIB11-SCRATCHIDS) |
| Critic R8, R9 | routed | R10 |

### Open
1. LB10 scratch targets: jumping_jacks and sled_push are LIB-4c targets on main (ci/scratch.mjs:21, :25). lib-22 said "no swap owed" (checked at 1ffd0dac, before 8ae48ed9). Does R15 cover this swap in W7?
2. LB6 scratch targets the lib-16 card does not name: smith_machine_incline_press (LIB-4c, scratch.mjs:26) and smith_machine_shoulder_press (LIB-7b, tests/library/fixtures/lib7b/fixture.mjs:20). Also pilot A's barbell_row in tests/howto/fixtures/batches/lb-test.json:5 (W2). Swap under R15?
3. cable_external_rotation (W6): card feel.primary is empty. No text-only/empty-primary feel state found on main [unverified]. Needs a route or the id is held (S3).
4. battle_ropes hand camera (owner's choice, D-LIB12FIX-ROPE deferred): no ruling found. Ship as a GAP under R8, or rule under the 10-24 delegation?
5. W1 note (not a card line): plank's card primary is `core`, and C2 refuses `core` in any feel role (tests/howto/checks/c2.ts:15, :26). The W1 swap rule may apply.
6. Caveat: C13/C14 ran on LIB-4c's runner, and ci/fidelity has changed since. The ENTRY text is met as written. A8's full runs per wave are the only fresh stability evidence.

## 10. W2 PLAN update (base main c4c34d75, train 63)

W2 is 20 ids: the other 8 of pilot A, the 4 W1 holdovers (barbell_overhead_press, pec_fly, plank, rope_triceps_pushdown),
pilot A2 (2), pilot A3 (2), pilot B less smith (3) and pilot B2's crunch. Columns are read from each card on this base.
GRIP is the D-SHIP-GRIP case: `full` (the card claims thumb, contact and wrist), `a` (a pair key fills the empty field),
`b` (NoHandling, no hand claim), `c` (some claims missing, no key), `none` (archetype none).

| id | batch | tier | arch. | GRIP (empty card fields) | hand zoom (card) | proposed no-zoom entry | text checkpoints (D-SHIP-TEXTZOOM) | flags (pin) | other |
|---|---|---|---|---|---|---|---|---|---|
| barbell_row | pilot-a | A | pull | full | row-grip, no key | key-join bar/`row` (Q-W2-1) else gap-ruled | — | F4 (owner 10-19) | tier-A way-out (Q-W2-3) |
| dumbbell_bench_press | pilot-a | A | push | full | wrist-neutral-press | gap-ruled D-SHIP-HANDW2 (push heel, D-LIB7-19) | — | F4 (owner) | — |
| dumbbell_shoulder_press | pilot-a | A | push | full | wrist-neutral-press | gap-ruled D-SHIP-HANDW2 (push) | — | F3, F4 (owner) | way-out (Q-W2-3) |
| romanian_deadlift | pilot-a | A | hold | full | rdl-grip, no key | gap-ruled D-SHIP-HANDW2 (no key variant holds a hanging bar) | — | — | way-out (Q-W2-3); parent of SLRDL |
| single_leg_romanian_deadlift | pilot-a | A | hold | full | none | card-no-zoom | — | F4 (owner) | way-out; variant line (Dumbbell / Bodyweight); inherit thumb, wrist |
| upright_row | pilot-a | B | pull | full | urow-grip, no key | gap-ruled D-SHIP-HANDW2 | none (front plate; crops in the plate's view) | F2 (owner) | variant line (Cable / Barbell) |
| mountain_climbers | pilot-a | C | palm-flat | a (thumb, handContact) | key palm-flat | — | — | F1, F3 (owner) | core text-only (D-SHIP-Q7) |
| triceps_pushdown | pilot-a | C | push | c (handContact) | pushdown-wrist, no key | gap-ruled D-SHIP-HANDW2 (push) | — | — (owner) | GRIP (c): Q-W2-2 |
| barbell_overhead_press | pilot-a | A | push | full | bar-heel-of-palm | gap-ruled D-SHIP-Q1 (listed) | — | F2, F3 (owner) | W1 holdover, LIB-SHAPES |
| pec_fly | pilot-a | B | hold | b (all) | none | — (NoHandling) | fly-backpad, fly-elbow (ruled) | — | W1 holdover; "overhand" kept (c3 quote) |
| plank | pilot-a | C | none | none | none | — | — | F1 (owner) | core in textOnly; fix shoulder-stack pair (W1 low) |
| rope_triceps_pushdown | pilot-a | C | push | full | rope-hand (key rope) | gap-ruled D-SHIP-ROPEPAIR | rope-spread (ruled) | — | the 3 panel fixes (6616096384) |
| box_jump | pilot-a2 | A | none | none | none | — | — | F2, F3, F4 (delegation only) | way-out (Q-W2-3); flags to the owner (Q5) |
| bent_over_dumbbell_rear_delt_fly | pilot-a2 | C | hold | full | rdfly-grip, no key | gap-ruled D-SHIP-HANDW2 | none (front plate) | F2, F3, F6, F7 (delegation only) | flags to the owner (Q5) |
| reverse_lunge | pilot-a3 | B | hold | b (all) | none | — (NoHandling) | — | F3, F4 (delegation only) | variant line (Dumbbells / Barbell); flags to the owner |
| dumbbell_fly | pilot-a3 | A | hold | full | none | card-no-zoom | none (front plate) | F3 (delegation only) | flags to the owner |
| seated_leg_curl | pilot-b | C | balance | b (all) | none | — (NoHandling) | — | — (owner) | — |
| cable_fly | pilot-b | B | hold | full | fly-handle | gap-key (hand-d-handle.mjs:24, D-SHIP-C3) | none (front plate) | F2 (owner) | — |
| push_up | pilot-b | C | palm-flat | a (thumb) | none on the card | card-no-zoom | — | — (owner) | the palm-flat key holds push_up, but the card has no hand zoom |
| crunch | pilot-b2 | B | none | none | none | — | — | none raised | moves from pilot-b2/rows.json into batches/pilot-b2.json with its plate pin = APPROVED_FRAGS (ruling 2) |

Counts: 20 ids; 8 new gap-ruled hand zooms (D-SHIP-HANDW2) plus OHP and rope; 1 gap-key; 3 card-no-zoom; 4 NoHandling or
none from the card plus 3 `none`; 2 GRIP (a); 1 GRIP (c). Tier-A way-out gaps: barbell_row, dumbbell_shoulder_press,
romanian_deadlift, single_leg_romanian_deadlift, box_jump; none is in a shared move card's appliesTo (unrack-rerack,
get-in-out, selector-pin).

**Inherit map (D-SHIP-FAMILY, D-LIB9a-MAP form)**, single_leg_romanian_deadlift → romanian_deadlift, both in W2 and in
the same head, the parent first in batches/pilot-a.json: `grip.thumb` → THUMB; `grip.wrist` → ['handling.wrist'] (the
RDL sheet's limitText must not say "bar"). The resolver lands here: library-gate.mjs:56 passes `shipped` = loadContent
of a row shipped in this head (family.mjs stays fail-closed for an unshipped parent).

**Drawing values (D-SHIP-DRAWVAL)** are listed per id in LAYERS READY once the sheets exist; the plate's own Mistake
pose is reused wherever a card zoom's Wrong is the plate's drawn fault.

**Layers pages.** pilot A's page is re-pinned by a superseding entry with its 13 ids (A10: the curl's hand-, posture- and
feel- chunk bodies stay byte-equal, headers aside); new pages for pilot A2, A3, B (3 ids, smith stays) and B2.

**Carried W1 lows (review 6624739613).** 1-2: the next READY restates budgets from the file and test:tz from the log.
3: the PR body names ht4.mjs:172 (`root: T`). 4: lib-ship.test.ts GRIP (a) derives `contact` from the curl key's
CONVENTIONS (`ga:curl-mid`) through a small map (`mid` → `mid-palm`), and the two tautological lines go; mutation:
editing the key's convention turns it red.

### W2 questions (for 'SHIP W2 PLAN RULED')

- **Q-W2-1 barbell_row's grip close-up.** hand-bar.mjs already draws a `row` variant (pull, overhand, 32 mm bar, approved
  panel words bar-row-over.json) for inverted_row. barbell_row's card claims the same grip (overhand, thumb wrapped,
  wrist straight). **Proposal:** add `barbell_row` to hand-bar.mjs IDS with its own claims (one line; the variant and its
  panel are unchanged), if the variant's recorded values match the card field by field (checked and posted before
  LAYERS READY); otherwise gap-ruled with the others.
- **Q-W2-2 triceps_pushdown's empty grip.handContact (GRIP (c)).** It claims thumb and wrist but not contact, and no key
  draws it (push, D-LIB7-19). **Proposal:** contact `heel` from the GA push convention `ga:push-heel`
  (hands/pairs.mjs CONVENTIONS), cited CONVENTION, as GRIP (a) cites a key's value; the hand zoom is gap-ruled.
  The other option is S3 (hold).
- **Q-W2-3 Tier-A way-out gaps (D-SHIP-WAYOUT)** on barbell_row, dumbbell_shoulder_press, romanian_deadlift,
  single_leg_romanian_deadlift and box_jump: no shared move card applies, so each needs the safety checker's ruling
  that the sheet is safe with no way-out line, or the id is held (S3, to the owner as a later-update item).
- **Q-W2-4 Flags without a recorded owner answer (D-SHIP-Q5 narrowed):** box_jump F2 F3 F4; rear delt fly F2 F3 F6 F7;
  reverse_lunge F3 F4; dumbbell_fly F3. Their pins record the supervisor's approval under the 10-24 delegation, not the
  owner's answer per flag. They wait on ruling 11's owner question; the other 16 ids do not.
- **Q-W2-5 New D-SHIP-HANDW2 gap-ruled ids:** dumbbell_bench_press, dumbbell_shoulder_press, triceps_pushdown (push,
  D-LIB7-19); romanian_deadlift, upright_row, bent_over_dumbbell_rear_delt_fly (no key variant fits the card; no
  per-id pose without every number). Each needs its ruling id in the no-zoom list and `handling.why`.
