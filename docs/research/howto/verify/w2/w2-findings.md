# W2 verify findings (LR-29), fix round 1

For `docs/research/howto/verify/w2.md`. Head checked: `claude/libht-verify-w2` @ `5036283d1e69f617cc45d5b49689e9281f3d61f3` (W2A `a33d8f3a` + W2B `d4f30c70` + the8 `e6381fa4` merged on research `9dbc7e0a`). Rulings in force: D-LIB9-FACTPOSE, D-W2-TEMPO, lib4-cards 13 Q1, and the six below (LR-30 to LR-35).

Packets (scratchpad `w2fix/`): `packet-W2A.md` (70 items), `packet-THE8.md` (116 items), `packet-HELPER.md` (52 items). Each lists the exact head old value and the exact new value per field. Superseded fixes are listed at the end of each packet as "not to apply".

## Summary

| owner | blocker | high | medium | low | real items | rejected (by number range) |
|---|---|---|---|---|---|---|
| W2A | 0 | 1 | 5 | 7 | 13 | 2 (W2-4, W2-13) |
| THE8 | 1 | 1 | 6 | 13 | 21 | 2 (W2-27, W2-31) |
| HELPER | 0 | 0 | 2 | 5 | 7 | 3 (W2-41, W2-43, W2-48) |
| **total** | **1** | **2** | **13** | **25** | **41** | **7** |

Plus six open questions answered by the supervisor (W2-49 to W2-54, recorded as LR-30 to LR-35).

## Canonical items

"real (part)" means the judge found part of the claim true and refuted the rest; the reason says which. "superseded" means the item is real but a ruling replaced its fix.

| id | owner | severity | verdict | reason |
|---|---|---|---|---|
| W2-1 | W2A | high | real | shoulder_press sharp-pinch row sent the lifter back to the close handles next session, which c7 backs only for "some discomfort"; fix cut to "Stop the set.", means names c6's fault (LR-6), loadWording no longer credits "stop" to c6. |
| W2-2 | W2A | low | real (part) | hanging_knee_raise rows[2].means shows the label "(inference)" (LR-27, LR-23); only the label goes. The proposed stop line is refuted: no source on the card gives one (LR-6 R1). |
| W2-3 | W2A | low | real (part); overturned by LR-34 | The judge kept the inherited golden-B lines under LR-8 and fixed only notes[0]'s implied way down and the "(the inherited active hang)" label. LR-34 (W2-53) now removes the failed inherit lines, so the hanging_knee_raise edits come from W2-53; notes[0] is merged. |
| W2-4 | W2A | low | rejected | Rejected under LR-8 as in force (triage result.rejected); overturned by LR-34. W2-53 says W2-3, W2-4 and W2-5 "are applied in this form" (LR-34). |
| W2-5 | W2A | medium | real; fix superseded | chin_up and hanging_knee_raise hand zooms state where the bar sits with no cited claim (CARD-V2). The judge's fix (cite inherit:n) is superseded: LR-34 removes those inherit entries, so the bar-position words leave both zooms. |
| W2-6 | W2A | low | real (part) | hanging_knee_raise rows[3].means carries a study note "(measured in pull-ups)" (kept as a conditional edit). The rows[1] fix citing inherit:4 is void under LR-34; rows[1] goes through the LR-34 route with a no-change fallback (open point a). |
| W2-7 | W2A | medium | real | The NSCA thumb quote comes from a floor-to-thigh barbell drill but is tagged CONSENSUS only on three hang cards; now CONSENSUS+WEAK with the inference stated, and hanging_knee_raise setup[1] cites it for "thumbs wrapped". |
| W2-8 | W2A | medium | real (part) | chin_up and assisted_pull_up shrug and shoulder rows add "usually means" links no source gives (LR-6), and red-flag fixes use an untimed "if it lasts" (LR-28). The elbow "usually means" is refuted: NASM links elbow irritation to overuse. |
| W2-9 | W2A | low | real | assisted_pull_up lists the sourced pad mount (c1) as unsourced, and its log counts an ACE URL that redirects to the chin-ups page as read. |
| W2-10 | W2A | medium | real | shoulder_press draws the standard handles against LR-2 (draw the close handles until a wide-handle option exists); c7 gains the two verbatim ACE step-1 pose sentences (D-LIB9-FACTPOSE). |
| W2-11 | W2A | medium | real (part); fix superseded by LR-30 | The seated set-down is sourced (c6) but had no finish step, and gaps[0] was stale. LR-30's three c6 steps replace the judge's two; postureArchetype.wrong stays null. |
| W2-12 | W2A | low | real (part) | shoulder_press elbow row's means repeated the fix; it now names the fault (c6). The lower-back row already follows LR-6 (refuted). |
| W2-13 | not supplied | — | rejected | Not in the verified-real list given to this step; reason not supplied here. Number falls in the W2A range. |
| W2-14 | W2A | low | real | shoulder_press c12 joined the WEAK ACSM tempo and the CONSENSUS 2-10% load rule; split into c12 and c13. |
| W2-15 | W2A | low | real | Two kick-up quote notes rested on WebFetch; a curl re-check confirms both verbatim; only the notes change. |
| W2-16 | THE8 | blocker | real | barbell_back_squat tier-A way out dropped rep-fail's "lower the bar onto the safeties" step and left the backward dump unconditional (a spotter behind could be hit); reordered with two new verbatim quotes. |
| W2-17 | THE8 | medium | real | pull_up plate.end turned Youdas's elbow range into an unsourced top pose ("from the full hang"), against D-LIB9-FACTPOSE. |
| W2-18 | THE8 | medium | real (part) | hanging_leg_raise plate.end drew Yessis's mid-rise 30-45 degrees as an end angle whose vertical is unstated; notes misread the thigh wording. The MECH retag is refuted. |
| W2-19 | THE8 | medium | real (part) | barbell_back_squat breath risk added an unsourced "healthy lifters" scope; the hedge goes and the tier-A breathing gap is recorded. The proposed blood-pressure line is refuted (no source). |
| W2-20 | THE8 | low | real | Lander's with-belt vs no-belt times were described as a single-rep time range (c26, notes[1], the8.md lines 78 and 215). |
| W2-21 | THE8 | medium | real | The golden-B stool-clearance line was dropped as unsourced but no tier-A gap recorded it (LR-3, LR-20). |
| W2-22 | THE8 | medium | real | pull_up red-flag fixes used an untimed "if the pain persists" (LR-28, D-LR23-9). "Stop the set" is not added: no pull_up source says it. |
| W2-23 | THE8 | medium | real | lat_pulldown c11 overstated two EMG studies (Padovan favours front only on the way down) and left out Sperandei's null result on the same card. |
| W2-24 | THE8 | high | real | leg_press releases the safety handles (setup[4]) but never re-locks them; c22 (Bells of Steel) sources the re-lock. |
| W2-25 | THE8 | low | real (part) | leg_press notes[3] claimed a source ranks the lockout second; merged with LR-31 (drawable true). The rankNote/W2-51 part went to the ruling. |
| W2-26 | THE8 | low | real (part); fix superseded by LR-33 | leg_press pause 0 contradicted the card's own ACE "pause momentarily" (c24). LR-33 sets 1, not the judge's null. |
| W2-27 | not supplied | — | rejected | Not in the verified-real list given to this step; reason not supplied here. Number falls in the THE8 range. |
| W2-28 | THE8 | low | real | Claim details (populations, durations, loads, NASM's muscle groups) were true in the sources but missing from the quotes; verbatim quotes added on 6 cards. |
| W2-29 | THE8 | low | real | hanging_leg_raise mistake.why cited c9 outside its claim list; pull_up's "legs kick" had no source in plate.mistake, handlingMistakes[0] and zooms[3]. |
| W2-30 | THE8 | low | real (part) | barbell_back_squat wrist row's wrist half had no quote in the card; c23 gains the source's closing line and the row drops c24. The proposed cut to the elbow only is refuted (would weaken a safety row). |
| W2-31 | not supplied | — | rejected | Not in the verified-real list given to this step; reason not supplied here. Number falls in the THE8 range. |
| W2-32 | THE8 | low | real | pull_up plate.start mixed the open hang with the first move of the pull (c8), against D-LIB9-FACTPOSE. |
| W2-33 | THE8 | low | real | pull_up c17 joined two separate Prinold findings into one. |
| W2-34 | THE8 | low | real | lat_pulldown kept rear_delts watch-only on an unsourced "helper" reason; moved to secondary (libraryDiff.add is a proposal only). |
| W2-35 | THE8 | low | real | seated_cable_row tier-C fix carried load advice no cited source gives. |
| W2-36 | THE8 | low | real | seated_cable_row shoulder risk said "shown mainly" for an untested background line (LR-27). |
| W2-37 | THE8 | low | real (part) | deabreu2023 access "full" though only the abstract was read; plate.equipment carried a free-text citation (now claim c19). The nsca-low-row access point is refuted. |
| W2-38 | THE8 | low | real | hanging_leg_raise rows[0].means named the study's test set on a shown line (LR-27). |
| W2-39 | HELPER | medium | real | single_arm_lat_pulldown: handlingMistakes order contradicted plate.mistake (13 Q1(b)); three wrong quote "where" labels; "sideways" unsourced. Settled with LR-32. |
| W2-40 | HELPER | low | real; fix superseded by LR-34 | single_arm hand zoom restates inherit[0] uncited. Under LR-34 the parent lat_pulldown card does not source hand contact, so the LR-34 step settles the words (also close_grip_pulldown, underhand_lat_pulldown). |
| W2-41 | not supplied | — | rejected | Not in the verified-real list given to this step; reason not supplied here. Number falls in the HELPER range. |
| W2-42 | HELPER | medium | real | underhand_lat_pulldown ("Cable / Machine") had a null variantLine (content.md 4, D-LIB5-VARIANT 5); c19 from BarBend. |
| W2-43 | not supplied | — | rejected | Not in the verified-real list given to this step; reason not supplied here. Number falls in the HELPER range. |
| W2-44 | HELPER | low | real | cable_fly and low_to_high_cable_fly plate.tempo.claim was a comma string, not an id or list (CARD-V2). |
| W2-45 | HELPER | low | real | cable_shrug c7's tag set CONSENSUS+MECH+WEAK is not one the 8 use; split into c7 and c16, keeping both flags. |
| W2-46 | HELPER | low | real | Four cards joined the WEAK ACSM tempo and the CONSENSUS load rule in one claim; split. |
| W2-47 | HELPER | low | real | Three quotes files rewritten on 2026-10-17 kept checked 2026-09-30. |
| W2-48 | not supplied | — | rejected / closed | Not in the verified-real list given to this step. LR-35 (W2-54) closes its rotator_cuff point: rotator_cuff in feel.secondary is allowed by C2; no change. |

## Rulings

Final rulings: `w2-rulings-final.md` (supervisor final judge, 2026-10-18). All six are amended, none rejected, and the numbers stay: LR-30 = W2-49, LR-31 = W2-51, LR-32 = W2-50, LR-33 = W2-52, LR-34 = W2-53, LR-35 = W2-54. The table below is the draft summary. Where it differs from `w2-rulings-final.md`, the final file wins, including the RULINGS.md row texts and the supervisor edits. The three packets follow the final rulings: W2A 70 -> 92 items, THE8 116 -> 121, HELPER 52 -> 61. Old items keep their numbers; added items follow under "Added by the final rulings".

| id | LR | ruling | edits routed to |
|---|---|---|---|
| W2-49 | LR-30 | Dumbbell kick-up: no conflict. c5 (stuck rep, bench) is shown as the bench failed-rep step, MECH+WEAK; c6 gives three seated finish steps; no seated failed-rep way out without a spotter is sourced, so none is shown (the spotter way out is on dumbbell_shoulder_press c7 and arnold_press c10); "never over the face" has no quote. | W2A (7 edits, `variants` opened by name); supervisor (RULINGS row) |
| W2-50 | LR-32 | single_arm_lat_pulldown: no source measures frequency; the past-end pull is the top fault (LR-31 step 2); drawable stays true; handlingMistakes reordered; rankNote added. Then 13 Q1(c). | HELPER (4 edits); supervisor (RULINGS row; lib-9a-card.md:188; LIBRARY-HOWTO-ARCHITECTURE.md:85, :303) |
| W2-51 | LR-31 | Top-fault rule in three steps; every plate.mistake carries a rankNote; picks unchanged on the 8; LB1: assisted_pull_up drawable false (step 1, speed), underhand_lat_pulldown plate.mistake is the past-end pull (step 2); leg_press drawable false -> true. | THE8 (8 rankNotes, leg_press why/drawable, the8.md section); supervisor (RULINGS row; CARD-V2 x2) |
| W2-52 | LR-33 | A pause with no seconds after the concentric phase is 1 s, named a drawing convention in a WEAK tempo claim; 0 means no quote on the card asks for a pause there; null is never used for such a pause on a card with numeric up/down. | THE8 (machine_chest_press, leg_press, seated_cable_row); supervisor (RULINGS row) |
| W2-53 | LR-34 | Once a parent has a card, the child's inherited lines are checked against that card or a verified shared card (LR-29); ways out in order, fetched quote first; stop rule for feel rows, red flags, risks and tier-A points; golden-B is a source map, never a citation. | W2A (chin_up, hanging_knee_raise, shoulder_press check); HELPER (8 children re-checked); supervisor (RULINGS row; CARD-V2) |
| W2-54 | LR-35 | brachialis and rotator_cuff only in feel.secondary/watch; core in no feel role (C2). Three critic findings void. Recheck gains four quotes files, the C2 role check and this round's newly shown quotes. LIB-MUSCLE later. | supervisor (RULINGS row; CARD-V2; verify/w2.md; TASKS.md); HELPER (no change) |

## Conflicts merged

1. **hanging_knee_raise notes[0]** (W2-3 x W2-53): one edit. W2-3's fix to the implied way down is kept ("Not sourced: a safe way down from the bar."). Its new sentence about "the inherited box line (inherit[3])" is dropped, because LR-34 removes inherit[3]. W2-53's deletion of the inherit[5] sentence is applied.
2. **hanging_knee_raise feel.rows[3].fix** (W2-3, W2-6, W2-53): W2-53 wins. It is an LR-34 step: source a fix, or remove the row and add a gap. W2-6's means edit applies only if the row stays.
3. **hanging_knee_raise feel.rows[1]** (W2-6 x W2-53): W2-6's fix cites inherit:4, which LR-34 removes. W2A takes the LR-34 route. If no source is found, the row stays as on the head and a gap is added (open point a).
4. **chin_up and hanging_knee_raise zooms[0]** (W2-5 x W2-53): W2-53's new `right` text wins. W2-5's added inherit citations are not applied.
5. **single_arm_lat_pulldown zooms[0]** (W2-40 x W2-53): W2-40's inherit:0 citation is not applied. The words are settled in HELPER's LR-34 step, along with close_grip_pulldown and underhand_lat_pulldown, which have the same pattern.
6. **dumbbell-kickup variants.seated.steps, gaps[0], gaps[1], notes** (W2-11 x W2-49): the ruling wins.
   - Seated gets LR-30's three steps (5 in all, within the 5-step limit; each step ≤12 words).
   - gaps[0] merges W2-11's corrected reason (without "waits on the ruling") with LR-30's sentence.
   - gaps[1] and notes[5] use the ruling's text. W2-11's note is not added.
7. **leg_press notes[3]** (W2-25 x W2-51): rewritten under LR-31 step 1 (drawable true). W2-25's real point stays: NASM's list is unranked, and no source ranks the lockout second.
8. **leg_press plate.tempo.pause, .claim, .text and notes[2]** (W2-26 x W2-52): the ruling wins. Pause is 1, not null; tempo.claim is [c15, c25], not W2-26's [c15, c24].
9. **single_arm_lat_pulldown c6 where, handlingMistakes, rankNote** (W2-39 x W2-50): these are the same edits. The rankNote uses the ruling's text. W2-39's c10 and c11 where labels and its inherit[3].why edit are added.
10. **verify/the8.md fetcher table** (W2-30 x W2-16/W2-28): W2-30's change to the row (50 -> 51) is not applied.
    - The table is the dated 2026-10-17 run, and this round adds 7 squat quotes, not 1.
    - The post-round totals go in the new Fix round 1 fetcher line instead: squat 57, pull_up 37, hanging_leg_raise 37, lat_pulldown 41, seated_cable_row 34, leg_press 62, machine_chest_press 24, dumbbell_lateral_raise 21.
11. **verify/the8.md Fix round 1** (W2-51 x W2-16/23/28/30/37): the ruling's line "No quote was added or changed." would be false for this round. It is narrowed to "LR-31 added or changed no quote; LR-33's c16 and c25 copy verified ACE quotes (c7, c24)." W2-28's the8.md note and the fetcher line are added to the same section.
12. **quotes/barbell_back_squat.json** (W2-16, W2-28, W2-30): 6 inserts and 1 replace. They are applied by claim id, because head indices shift after each insert.
13. **quotes/shoulder_press.json** (W2-10 x W2-14): W2-14's head quotes[24] becomes quotes[26] after W2-10's two c7 inserts. It is applied by content.
14. **shoulder_press notes, pull_up notes, chin_up notes, assisted_pull_up notes, seated_cable_row notes, hanging_knee_raise notes**: several appends per card, listed in order. None of them overlaps another edit.

## Old values checked against the head

Every old value in the three packets was compared with `git show HEAD:<file>` on 5036283d by script (exact JSON equality, or exactly one occurrence for substring and markdown edits). Every value matches, with these exceptions:

- **W2-52, seated_cable_row plate.tempo.text:** the ruling gives the old as `2 s pull, brief pause, 2 s slow return.`, but the head field is `Drawing convention: 2 s pull, brief pause, 2 s slow return. No source gives seconds for this row; ACSM 1-2 s is stated for intermediate to advanced training (LR-15).` The given text occurs exactly once inside it, so the packet applies the edit as a substring edit. This is the only old value that does not equal its field.
- **Old values given as summaries:** the packets show the exact head values instead.
  - W2-49 notes[5] (abbreviated with "...");
  - W2-53's chin_up and hanging_knee_raise inherit arrays and chin_up notes[1]-[5];
  - W2-50's handlingMistakes (W2-39's exact array was used).
- **W2-45, cable_shrug notes:** the card has no `notes` key on the head. The note is added as a new optional key (CARD-V2 line 55).
- **W2-9:** notes[0] and notes[1] were given as whole fields. Only one sentence differs in notes[0] and two passages in notes[1], so the packet gives those substrings. The result is the same.
- **Supervisor-owned old values:** all match.
  - CARD-V2.md: the plate.mistake line (:35), the parent rule (:69), the muscle-id rule (:62).
  - lib-9a-card.md:188 on `claude/sup-lib4-cards` @ `279cf08f`.
  - LIBRARY-HOWTO-ARCHITECTURE.md:85 and :303 on `claude/howto-options` @ `4a9fd865`.
  - RULINGS.md has no LR-30 to LR-35 yet; its last row is LR-29.
  - verify/w2.md does not exist yet.

**Dry run:** all 232 applied edits were run on scratch copies of 42 head files.

- Every file parses.
- Every touched card matches its quotes file claim by claim.
- No new missing-claim, orphan-source or quote-over-50-words issue appears.
- The one new reference issue is hanging_knee_raise feel.rows[3] `inherit:5`. W2A's LR-34 step removes it.
- cable_fly and low_to_high_cable_fly each lose their broken comma-string reference.

## Supervisor edits (not in any owner packet)

Apply these on the research head after the three FIXED pushes, in this order. The exact text comes from the rulings.

1. `docs/research/howto/RULINGS.md`, new rows after LR-29:
```text
| LR-30 | W2-49 (W2A open question 1), supervisor 2026-10-18 | Dumbbell kick-up way outs. No conflict: c6 (BarBend) is the normal set-down after a seated press; c5 (Fitness Volt) is a stuck rep lying on a bench. c5 is shown as the bench failed-rep step "Failed rep: drop the dumbbells out to your sides." (MECH, WEAK: one coach source, flat bench, incline by inference; never the normal set-down). "Never over the face" (content.md 5.2) has no quote, so no line says it until LIB-WAYOUT finds one. variants.seated gets the c6 finish steps; no seated failed-rep way out is sourced, so none is shown (LR-3). |
| LR-31 | W2-51, supervisor 2026-10-18 | Top fault when no source measures frequency (plate.mistake; handlingMistakes[0]). Step 1: a quote says a technique fault of this exercise, or an injury it names as caused by that fault, happens commonly or frequently; a 'common mistakes' heading is not a frequency word for one item, and all-training injury counts are not a technique fault. Step 2: else a named fault (plate.mistake, handlingMistakes or a source's mistakes list) that a quote ties to harm (injury, pain, stress, discomfort or a study-linked injury sign); ties go to the one on a common-mistakes list, then more harm sources, then sourced directly (not MECH/WEAK), then list order. Step 3: else the first fault in a common-mistakes list; with no list, the fault the most read sources warn against. drawable is true when the census view shows the top fault; else false, the plate draws the next fault by the same steps, and handlingMistakes[0] stays the top fault. Every plate.mistake carries rankNote ('No source measures how often each fault happens.' + step + claim ids); rankNote is never shown (LR-28). D-LIB5-TOPFAULT and lib4-cards 13 Q1 are unchanged; the TOPFAULT comment names a head with these edits. |
| LR-32 | lib4-cards 13 Q1(b), W2-50, supervisor 2026-10-18 | single_arm_lat_pulldown: no source measures frequency. Under LR-31 step 2 the past-end pull (c10, c13) is the top fault: first in BarBend's common-mistakes list and the only named fault a quote ties to harm. Torso twisting is BarBend's third item with no stated harm; the twist line (c6) is a PureGym tip. drawable stays true; handlingMistakes is reordered (past-end, twist, lean) and plate.mistake gets a rankNote. Q1(c) follows: LIB-9a Do 1 drops F7 on single_arm_lat_pulldown; plan 3.1:85 drops single-arm pulldown from the drawable-fault list; plan 3.3:303 says 5. |
| LR-33 | W2-52, supervisor 2026-10-18 | A pause with no seconds: when a quote asks for a momentary or brief pause and gives no seconds, plate.tempo.pause is 1 and tempo.text names it a drawing convention (D-W2-TEMPO, WEAK); tempo.claim includes the pause quote's claim. pause 0 means no source asks for a pause; null is not used for a sourced pause. The pause is the one at the end of the lifting phase. For D-LIB5-TEMPO8 a spec Hold maps to it like up and down; leg_press's top 'Rest' and bottom 'Pause' stay the supervisor's map call on #244 (bottom: optional 1 s, c15). Other pause-1 cards without convention words join LIB-TEMPO. |
| LR-34 | W2-53, supervisor 2026-10-18 (amends LR-8) | Once a parent has a card on `claude/libht-research`, a child's inherited lines are checked against that card only, on the same named head; the check counts once the parent card passes verification and re-runs if it changes. Golden-B sheets and grip-and-feel research are a source map, never a citation (the8.md:7; CARD-V2). An unsupported inherited line gets the child's own sourced claim, becomes an LR-4 drawing convention in notes, or leaves the card (gaps); never kept on golden-B alone. LR-8's golden clause covers only golden exercises with no card. front_squat's unrack and walk-out lines are checked against cards/barbell_back_squat.json or the shared unrack-rerack card. |
| LR-35 | W2-54, supervisor 2026-10-18 | Muscle ids: `brachialis` and `rotator_cuff` are muscles.ts ids with no drawn region, allowed only in feel.secondary and feel.watch; `core` has a misleading region and goes in no feel role (C2, tests/howto/checks/c2.ts). W2-48's rotator_cuff in feel.secondary is allowed. The 10 cards with `core` in a feel role and reverse_curl's 'biceps (primary)' libraryDiff strings go to tracker item LIB-MUSCLE. Critic findings valid-4#20, invalid-2#66 and invalid-3#91 are void (the four quotes files exist and match). The W2 recheck adds quotes/{chin_up,hanging_knee_raise,assisted_pull_up,underhand_lat_pulldown}.json, the muscle-id and C2-role check from git show origin/main:src/data/muscles.ts, the newly shown kick-up quotes (c5, c6) and this wave's new shoulder_press quotes. |
```
2. `docs/research/howto/CARD-V2.md`:
   - W2-51, plate.mistake line (:35).
     - old: `"why": "why it is common or risky", "claim": "c5",`
     - new: `"why": "why it is common or risky", "claim": "c5", "rankNote": "the LR-31 step that picked the top fault, with claim ids",`
   - W2-51, append to the rules list (old: none):
```text
- When no source measures how often faults happen, the top fault follows LR-31. `plate.mistake.rankNote` records the step and claim ids, and `handlingMistakes[0]` is the top fault. `rankNote` is research data, never shown (LR-28).
```
   - W2-53, parent rule (:69).
     - old: `or an approved golden exercise. Parent picks follow`
     - new: `or an approved golden exercise. Once a golden parent has a card on the branch, that card governs the child's inherited lines, and golden-B research is a source map only (LR-34). Parent picks follow`
   - W2-54, muscle-id rule (:62).
     - old: ``- Muscle ids come from `src/data/muscles.ts` on main. `core`, `brachialis` and `rotator_cuff` are text-only.``
     - new: ``- Muscle ids come from `src/data/muscles.ts` on main. `brachialis` and `rotator_cuff` have no drawn region: use them only in `feel.secondary` and `feel.watch`. `core` has a misleading region: use it in no feel role (C2; LR-35).``
3. `docs/supervisor/verify/lib-9a-card.md:188` (on `claude/sup-lib4-cards`, W2-50):
   - old: `F7 on single_arm_lat_pulldown, and any other flag with its reason;`
   - new: `no F7 (single_arm_lat_pulldown keeps drawable:true, LR-32), and any other flag with its reason;`
4. `docs/howto/library/LIBRARY-HOWTO-ARCHITECTURE.md` (on `claude/howto-options`, W2-50):
   - :85
     - old: `(single-arm pulldown, one-arm row, renegade row, Pallof press, bird dog, single-leg RDL):`
     - new: `(one-arm row, renegade row, Pallof press, bird dog, single-leg RDL):`
   - :303
     - old: `(1), and F7 on the 6 drawable-fault ids.`
     - new: `(1), and F7 on the 5 drawable-fault ids.`
5. `docs/research/howto/verify/w2.md` (new file, W2-54): this findings file, plus the critic-coverage text below.
```text
Void: valid-4#20, invalid-2#66, invalid-3#91 (files exist; 35/35, 27/27, 37/37, 24/24 match, all verbatim). Re-run invalid-1#43's muscle check from git show origin/main:src/data/muscles.ts with the C2 role rule. Add to the blind recheck: quotes/{chin_up,hanging_knee_raise,assisted_pull_up,underhand_lat_pulldown}.json; shoulder_press's new quotes; any new HKR shoulder-fix quote. Re-fetched verbatim 2026-10-18 (judge): shared-dumbbell-kickup c5, c6 x3, ggr c4; single_arm_lat_pulldown c10, c11, c6 (where: Single Arm Lat Pulldown Tips); leg_press c7, c8, c10 (NASM list starts 'Using excessive weight'); NSCA pulldown list (open grip first); BarBend single-arm list (Dumping Your Shoulders Forward, Going Too Heavy, Torso Twisting).
```
6. Relay `tasks/TASKS.md`, new tracker item (W2-54):
```text
LIB-MUSCLE (research, later pass): replace `core` in feel roles on ab_wheel_rollout, mountain_climbers, plank (primary) and battle_ropes, cable_chest_press, high_knees, push_up, renegade_row, side_plank, sled_pull (secondary/watch) with a drawn id the sources support (abs, obliques) or move it to text; write reverse_curl libraryDiff as plain muscle ids with the role in why.
```

**Recheck scope after this round (LR-35).** The recheck covers:
- the four quotes files;
- the C2 role check;
- every quote marked [fetcher] in the packets: W2A 2 items (shoulder_press c7 card and file), THE8 40 items, HELPER 2 items (underhand c19 card and file);
- any quote that W2A or HELPER adds in an LR-34 step.

## Open points for the supervisor

These are flagged here and not edited in any packet.

a. **hanging_knee_raise feel.rows[1]** (W2-6 x LR-34): if W2A finds no source that links straps to grip, the row stays as on the head. Its means ("The knee-up with arm straps showed some of the highest ab muscle activity.") is then still not a "usually means" line. Rule whether it stays as it is, is rewritten from c10 only, or is removed.
b. **Back-squat way out vs the shared card** (W2-16): barbell_back_squat's tier-A way out now teaches the backward bail when on your own (rep-fail, c15). shared/unrack-rerack.json says "Failed back squat: squat straight down onto the pins." (its c18, stronglifts-squat: "Don't drop it forward or back or you'll lose balance."), and that card covers barbell_back_squat. The two sources disagree. A ruling is needed on which way out the back-squat sheet shows, or whether it shows both in order.
c. **Copy limits on cards:** W2-6 cites the 12- and 15-word row limits (golden-B copy-lint) as a defect. W2-24 says those limits do not apply to cards, because cards hold facts. Neither changes an edit here, but the two judges disagree.
d. **Rejected items without reasons:** five items have none here (W2-13, W2-27, W2-31, W2-41, W2-43). Fill them in from the judge outputs before this table goes into verify/w2.md.
e. **Owner tier-A gap list:**
   - drop "get on" for assisted_pull_up (W2-9);
   - drop the bench failed-rep and seated set-down gaps for the kick-up, and keep the seated failed-rep gap for training without a spotter (LR-30);
   - add the squat breathing gap (W2-19) and the hanging_leg_raise stool-clearance gap (W2-21).
   - add the hanging_knee_raise box and stool-clearance gap (LR-34) and, if way (1) fails, chin_up's "bar fixed" (LR-34).
f. **Leftovers outside each item's fields** (not edited; for a later pass or a ruling):
   - chin_up shoulder row still cites c13, which its text no longer uses (W2-8).
   - The shared-dumbbell-kickup source fv-db-bench URL now redirects 301 to /dumbbell-bench-press-guide/ (W2-15).
   - horizontal_leg_press and leg_press_calf_raise release their catches with no re-lock line (W2-24).
   - hanging_leg_raise has the same unsourced "kick the legs up" in three places: plate.mistake.what, handlingMistakes[0] and the body-line zoom's wrong text (W2-29).
   - "build" is not in copy-lint FIX_VERBS, so pull_up rows[2].fix "Build up gradually..." may fail lint (W2-22).
   - single_arm c12's BarBend quote has where "Setup"; the source section is "Step 1 — Find Your Angle" (W2-39).
   - back_extension ("Bodyweight / Machine") has a null variantLine (W2-42).
   - 162 comma-string claim references remain in 34 cards. Cross-card references such as `barbell_bench_press:c5` have no CARD-V2 form and need a ruling (W2-44).
   - 34 other W2B quotes files keep a top-level checked date of 2026-09-30 (W2-47).
   - seated_cable_row c15's text "this was tested on a wide-grip seated row" can read as if the injury link was tested (W2-36).
   - verify/g1.md:130 and :152 quote assisted_pull_up's old gaps[0] as a historical record (W2-9).
g. **Expected effect of LR-31 on F7** (from W2-51): the lat_pulldown pick (behind the neck), the squat pick (back rounding) and the dumbbell_lateral_raise pick may match none of their approved plates' Mistake tells. The blind pass may then stop them, and F7 stays raised.
h. **Hand zooms on the lat_pulldown children:** under LR-34, single_arm, close_grip and underhand say "across the base of the fingers" while the parent card does not source hand contact. HELPER's LR-34 step removes those words unless way (1) finds a verbatim quote for the handle contact. A shown grip line leaves three sheets; this is not a safety line.
