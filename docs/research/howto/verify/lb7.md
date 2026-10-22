# LB7 research (lb7): writer record

Research session for library batch LB7, 2026-10-22. Brief: docs/supervisor/verify/lb7-research-card.md on `claude/sup-lib4-cards` @ `44344dec`. Branch `claude/libht-research-lb7`, from `claude/libht-research` @ `3812989f`. PR #288 (draft, into `claude/libht-research`).

## Scope
- 10 new cards: cable_lateral_raise and dumbbell_front_raise (children of dumbbell_lateral_raise), incline_push_up and diamond_push_up (children of push_up), and cable_rear_delt_fly, face_pull, cable_external_rotation, resistance_band_pull_apart, pike_push_up and bench_dip (each its own parent; content.md Appendix A).
- The LR-31 and LR-33 pass (lb4-research-card.md (0), (a) and (b)) on the 3 existing cards that lacked LR-31: bent_over_dumbbell_rear_delt_fly, renegade_row and weighted_dip.
- push_up (pilot B) already carries LR-31 (#277) and is not changed.

## How the cards were made
- **Writers:** four Opus writers, one per family: the raises with cable_external_rotation; the rear-delt cards; the push-up family; and the dips with renegade_row. Each read CARD-V2.md, RULINGS.md (all of it), the8.md, content.md 3.2-3.5 and 5.2 (`b41ac833`), the census rows (@ `4a9fd86`), and the lb4-lb6 supervisor verify records for precedent.
- **Fetching:** curl only, with a desktop browser user agent. WebFetch and WebSearch were never used. PubMed was read through E-utilities efetch, and PMC full text through efetch with db=pmc. Text found only in a page's served HTML (Motra's Tempo tooltip) counts as verbatim (R-LB6-7).
- **Fetchers:** one Sonnet fetcher per card, separate from the writer (R-W1-4). Each fetcher:
  - re-fetched every source;
  - set each quote's `status`, `closest` and `note`, and each source's `access` and `checked`;
  - scanned every read source, cited or not, for LR-31 step-1 frequency words, for harm words tied to a fault, and for LR-33 pause, hold and squeeze words.
  The writer then completed each rankNote from that scan, so that every frequency or harm quote about a fault that a step set aside is quoted with its reason.
- **Children (LR-34):** the 4 child cards have no inherit entries. Every line rests on the child's own claims, with quotes fetched by curl (way (1)). Each card's notes name the parent card @ `3812989f` and the shared cards it cites (palm-flat, floor-body, selector-pin).
- **Rulings applied at write time:**
  - D-SUP-PROTECT;
  - LR-31's list-sentence exclusion, read literally;
  - a "most people…" sentence about this exercise's own fault counts as a step-1 hit;
  - a speed-only fault is never drawable;
  - R-LB2-1 (tempo seconds from an exercise-specific source that fixes the phase);
  - R-LB3-4 and R-LB6-6 (stop lines);
  - R-LB6-9 (claim refs are a string or a list).

## Pre-push check (every card)
`check.mjs` (scratchpad tool) imports main's copy-lint.mjs and library lint unchanged. It checks:
- the JSON parses;
- every cited claim id resolves (including `inherit:<n>`);
- there is no orphan source;
- each quote is at most 50 words, counted like `words()` in tests/howto/checks/c7.ts;
- the card and the quotes file match one for one, and every quote is verbatim;
- CARD-V2 shape: 3 checkpoints, 1-3 tells, 2-4 zooms and the list caps;
- rankNote opens with LR-31's sentence;
- LR-33 has no null pause beside numeric up and down;
- muscle ids are in src/data/muscles.ts, with LR-35's roles;
- the LR-27/LR-23 and C8 wording on shown lines: main's lintHowto (contact, source and source-name patterns, own red-flag wording, claim wiring), medicalBans and C8's RED_FLAG_WORDING.

Main's copy caps (sentence length, label length, semicolons and the other BANNED style patterns) are reported as advisory, not as failures. Cards hold facts, and the sheet's words are written later under the full lint (CARD-V2). Earlier batches reported "0 hits" on cards that carry semicolons and long labels, so their gate was the wording rules. All 10 new cards have 0 advisory hits. The 3 existing cards keep the advisory hits on lines that no rule here changes.

Result: 0 problems on all 13 cards, except renegade_row's existing `core` in feel.secondary. LR-35 sends that to LIB-MUSCLE, and it is not changed here.

## Per card
| id | status | tier | LR-31 step | pick (plate.mistake) | drawable | tempo up/down/pause | sources (all fetched) | quotes verbatim | lint hits |
|---|---|---|---|---|---|---|---|---|---|
| cable_lateral_raise | new | C | 2 | Raising the arm above shoulder height (beyond 90 degrees). | true | 2/2/1 | 5 | 50/50 | 0 |
| dumbbell_front_raise | new | C | 2 | Swinging the dumbbells up with body momentum, the hips pushed forward. | true | 1/3/1 | 6 | 50/50 | 0 |
| cable_rear_delt_fly | new | C | 2 | top: Swinging, lower back overextending. (not drawable); plate: Shoulders not kept rolled back and down as the arms open. | false | null/null/null | 2 | 24/24 | 0 |
| face_pull | new | C | 2 | Elbows dropping down, below shoulder height, during the pull. | true | 2/3/1 | 4 | 40/40 | 0 |
| cable_external_rotation | new | C | 3 | top: Swinging with momentum. (not drawable); plate: Elbow flaring out, away from the side, as the handle turns. | false | 2/2/1 | 4 | 41/41 | 0 |
| resistance_band_pull_apart | new | C | 3 | Shoulders shrugging upward as the band is pulled apart. | true | 2/2/1 | 3 | 32/32 | 0 |
| incline_push_up | new | C | 2 | Feet too close to the bench, so the shoulder blades stay raised in a shrug. | true | 3/3/0 | 4 | 38/38 | 0 |
| diamond_push_up | new | C | 2 | Low back and hips sag toward the floor and the low back overextends. | true | null/null/null | 3 | 30/30 | 0 |
| pike_push_up | new | A | 2 | top: Elbows flaring out. (not drawable); plate: Only the head moves toward the floor, instead of forward and down. | false | null/null/null | 3 | 41/41 | 0 |
| bench_dip | new | B | 2 | top: Elbows flaring out. (not drawable); plate: Dropping too low into the dip, the upper arms well below level with the floor. | false | 1/2/1 | 5 | 50/50 | 0 |
| bent_over_dumbbell_rear_delt_fly | LR-31/33 pass | C | 2 | top: Swinging the torso to throw the weights up. (not drawable); plate: Shoulders shrug up toward the ears as the dumbbells rise. | false | 1/2/0 | 5 | 18/18 | 0 |
| renegade_row | LR-31/33 pass, PICK CHANGED | A | 2 | The dumbbell is lowered too quickly and lands on a corner. | true | null/null/null | 3 | 29/29 | 0 |
| weighted_dip | LR-31/33 pass, PICK CHANGED | A | 1 | Cutting reps short: stopping well above parallel at the bottom. | true | 1/2/0 | 5 | 35/35 | 0 |

Lint hits: copy lint (wording rules) and C8. renegade_row keeps its existing `core` in feel.secondary for LIB-MUSCLE (LR-35).

## Rulings asked (PR #288)
1. **weighted_dip, LR-31 step 1.** bb-dipcorrect ("Perfect Range of Motion"): "Another dip difficulty is a consistent range of motion. Many perform quarter or half reps when learning an exercise, then become frustrated…". Read as a step-1 hit for this exercise's fault (cutting reps short). If "when learning an exercise" makes it a statement about all training, step 1 finds nothing and the head's pick (the shrug, step 2) returns.
2. **incline_push_up, LR-31 candidates.** Is "feet too close to the box" a body position during the set or a setup choice LR-31 excludes? BarBend: "If your feet are too close to the box, then you're going to be doing the incline push-ups while the scapula is elevated, which might expose you to a greater risk of shoulder impingement." If it is setup, the pick becomes elbow flare (NASM: "increases shoulder stress"), which the side view cannot draw.
3. **cable_external_rotation, empty feel.primary.** The census primary is rotator_cuff, which LR-35 allows only in feel.secondary and feel.watch. The card leaves feel.primary empty (C2 allows it), with rotator_cuff and rear_delts (WEAK, one coach page) in feel.secondary. No head card has an empty feel.primary. The alternative is to promote rear_delts.

## Writer calls the rules settle (recorded, not asked)
- bench_dip: "strain" counts as harm (lb6 precedent: low_to_high_cable_fly, PureGym's "minimising strain to the shoulder joint"). The flared elbows win whether or not "pressure" counts.
- renegade_row: the dumbbell landing on a corner is a still sign that BarBend names, so it is drawable even though speed causes it (LR-31). BarBend's "Often a symptom of going too heavy…" is about the cause, not how often the fault happens. If counted, it picks the same fault.
- pike_push_up: the way out is unsourced, so it is in gaps (LR-3) and joins the owner's tier-A gap list. Garage Gym Reviews' "Squeeze your glutes, traps, and delts in the end position." is in its push-press section, and Fitness Volt's "Pause for 1-2 seconds" is in its machine-press section. Both are other exercises, so pause stays null.
- bent_over_dumbbell_rear_delt_fly: ACE's "Squeeze your scapulae … as you reach the end position." asks for no pause, and it is written for the incline version, so pause stays 0. The ACE incline-reverse-fly fault lines are another exercise and are not counted.
- dumbbell_front_raise: the swing is drawable through BarBend's still sign, "push your hips forward".
- resistance_band_pull_apart: Fitness Volt's "which can, and often does, cause shoulder problems" is about the grip, which LR-31 excludes.
- face_pull: "Avoid shoulder pinching by keeping elbows high" counts as stated harm. Step 3 gives the same fault (BarBend's first list item).

## Verify (LR-29) and fix round
The full record is docs/supervisor/verify/lb7-research-verify.md @ `6e710ace` (claude/sup-lib4-cards).

### Run
- Verified head: #288 @ `db914b11`. A history-free copy was split into three blind groups (5, 4 and 4 cards). Each group had a fresh Opus critic and 2 plants, with plantScope set to every field. All three groups are **VALID**: 6/6 plants caught, and each safety plant was rated blocker.
- Re-fetch: 478/478 quotes verbatim, across 52 sources. sl-front-raise answered 200 at scoring. Supervisor 10 % re-fetch: 48/48.
- LR-31: 13/13 agree. LR-33: 13/13 agree on values.
- Real findings, plants removed: 0 blocker, 0 high, 2 medium, 24 low.

### Rulings
- D-SUP-LB7-DIPREPS (weighted_dip), D-SUP-LB7-FEET (incline_push_up) and D-SUP-LB7-NOPRIMARY (cable_external_rotation) settle the three asks. The cards keep their picks.
- R-LB7-1: the plant findings are not on the real head.
- R-LB7-2: StrengthLog's front raise page answered 200, and its 4 quotes are verbatim.
- R-LB7-3: pike_push_up's "Forgetting to breathe is pretty common during exercise." stays set aside, as a statement about all training.
- R-LB7-4: incline_push_up's rankNote records D-SUP-LB6-CCP's count and cites D-SUP-LB7-FEET.
- R-LB7-5: bent_over_dumbbell_rear_delt_fly's ACE incline lines are another exercise and are not counted.
- R-LB7-6: both tempo styles stay. F-LB7-1 waits on the owner's no-seconds strip choice.
- R-LB7-7: the 3 LB7 "Front of the shoulder" rows become "Shoulder". F-LB7-2 covers other cards in a later pass.
- R-LB7-8: renegade_row's `core` (LIB-MUSCLE) and band c14's quote length are not actioned.
- R-LB7-9: every other finding takes its fix as written, in one round.

### Fix round checks
- Valid JSON on the 18 changed files.
- Pre-push check: 0 problems on all 13 cards, apart from renegade_row's `core` (R-LB7-8).
- Copy lint and C8: 0 hits. weighted_dip's advisory caps went from 14 to 13 (the checkpoint semicolon is gone).
- New quotes: 7 entries, each fetched by curl on 2026-10-22 and verbatim:
  - bent_over c5: StrengthLog's too-heavy item (40 words);
  - face_pull c15: three sentences from the PubMed 41964926 abstract (efetch);
  - incline_push_up c17: NASM's "Anterior Deltoid";
  - pike_push_up c8: the Garage Gym Reviews breath quote, extended to start at "Inhale".
- renegade_row: 8 quotes now carry ’ as both live pages print it, re-checked against fresh fetches. The bb-rr twist quote matches; the only difference is a stripper space before "." after a link.

### Findings and fixes (commit `d8c68f6f`)
| Finding | Fix |
|---|---|
| bent_over_dumbbell_rear_delt_fly-1 (medium) | rdfly-hinge claim ["c2","c4","c5"]; rdfly-grip right "Palms facing, elbow slightly bent." ["c2","c12"] |
| bent_over_dumbbell_rear_delt_fly-2 | risks[0] "Swinging the weights up can stress the lower back and shoulders."; c5 gains StrengthLog's too-heavy quote |
| bent_over_dumbbell_rear_delt_fly-3 | handlingMistakes[2] claim ["c3","c9"] |
| bent_over_dumbbell_rear_delt_fly-4 | rows[2].means "Fault: swinging from the hips adds stress here." |
| bent_over_dumbbell_rear_delt_fly-5 | c1 and c9 texts trimmed to their quotes |
| bent_over (R-LB7-5) | rankNote "(ruled R-LB7-5: another exercise, not counted)" |
| cable_lateral_raise-1 | libraryDiff.why names StrengthLog and Fitness Volt's stabilising line (c18) |
| renegade_row-1 | 8 quotes use ’ (card and quotes file) |
| renegade_row-2 | c8 and c9 ggr-rr where "Common mistakes: losing control" |
| renegade_row-3 | risks[2] "Too much weight can make your hip and shoulder hike up." |
| weighted_dip-1 | c9 names the 1 s up as a drawing convention |
| weighted_dip-2 | handlingMistakes[1] ["c6","c4"]; [2] ["c7","c8","c4"] |
| weighted_dip-3 | risks[2] "A swinging plate can make you unsteady." |
| weighted_dip-4 | checkpoints[2].what "Upper arm about level with the floor, or slightly below." |
| cable_external_rotation-1 | risks[0] "Shoulder: use only a very light weight. Keep strict form to avoid strain." |
| cable_rear_delt_fly-1 | risks[0] and risks[1] keep the source's hedges ("can", "may") |
| face_pull-1 | c15 gains three abstract sentences (aim, OpenSim model, the Tukey comparison) |
| face_pull-2 | plate.mistake.claim ["c9","c10"] |
| resistance_band_pull_apart-1 | c14 text drops "(surface EMG, moderate band)" |
| bench_dip-1 | rows[2].where "Shoulder" (R-LB7-7) |
| bench_dip-2 | c19 tagged WEAK; text names the two-bench version |
| diamond_push_up-1 | rows[1].where "Shoulder" (R-LB7-7) |
| incline_push_up-1 (medium) | risks[2] deleted (2 risks remain) |
| incline_push_up-2 | rankNote takes R-LB7-4's count text and D-SUP-LB7-FEET |
| incline_push_up-3 | c17 gains NASM's "Anterior Deltoid" |
| incline_push_up-4 | rows[1].where "Shoulder" (R-LB7-7) |
| pike_push_up-1 | c8's quote starts "Inhale during the concentric phase, or as you’re bending …" |
| pike_push_up (R-LB7-3) | rankNote quotes the "generally speaking" contrast for the set-aside breath line (commit after `d8c68f6f`, same push) |
