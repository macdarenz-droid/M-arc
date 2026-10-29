# LB9 research (lb9): writer record

Research session for library batch LB9, 2026-10-22.
- Brief: docs/supervisor/verify/lb9-research-card.md on `claude/sup-lib4-cards` @ `e86ac8e9`.
- Branch `claude/libht-research-lb9`, from `claude/libht-research` @ `6d253b9e`.
- PR #295 (draft, into `claude/libht-research`).

## Scope
- 9 new cards:
  - H: cable_crunch, bird_dog, superman, pallof_press and bicycle_crunch.
  - T: reverse_crunch, dead_bug, v_up and hollow_body_hold.
- The LR-31 and LR-33 pass on the 3 existing cards without LR-31: plank, ab_wheel_rollout and flutter_kicks.
- crunch, side_plank and russian_twist are unchanged.
- Families (content.md Appendix A):
  - reverse_crunch and bicycle_crunch are children of crunch.
  - v_up is a child of hollow_body_hold.
  - The other new ids are their own parents.

## How the cards were made
- **Writers.** Four Opus writers worked in parallel:
  - the crunch family with cable_crunch;
  - bird_dog, superman and pallof_press;
  - the hollow family with dead_bug;
  - the pass cards.

  Each writer read the batch brief, CARD-V2.md, RULINGS.md (all of it), the8.md and lb7.md. Each also read content.md 3.2-3.5 and 5.2 (`b41ac833`), the census rows (@ `4a9fd86`), and the lb4-lb7 supervisor verify records.
- **Fetching.**
  - curl only, with a desktop browser user agent. WebFetch and WebSearch were never used.
  - PubMed abstracts were read through E-utilities efetch.
  - Text found only in a page's served HTML counts as verbatim (R-LB6-7). This covers Motra's Tempo tooltip and BarBend's text inside inline tags.
- **Fetchers.** One Sonnet fetcher per card, separate from the writer (R-W1-4). Each fetcher:
  - re-fetched every source;
  - set each quote's `status`, and each source's `access` and `checked`;
  - scanned every read source, cited or not, for LR-31 step-1 frequency words, for harm words tied to a fault, for LR-33 pause, hold and squeeze words, and for common-mistakes lists.

  The writers then completed each rankNote from those scans and fixed every `where`, title and year the fetchers flagged.
- **Motra tempo strings.**
  - Motra serves this tooltip: "The speed for each phase of the movement, written as four numbers (e.g., 3-1-2-0): eccentric (lowering), bottom pause, concentric (lifting), top pause. Each number represents seconds."
  - Its pages show three numbers, so the cards read them as lowering, bottom pause and lifting, with no top pause.
  - A bottom pause is named in tempo.text and never written in `pause` (LR-33).
  - Every Motra tempo claim is WEAK and says why: one coach page, read against a site-wide format.
- **Children (LR-34 way (1)).**
  - reverse_crunch, bicycle_crunch and v_up have no inherit entries. Every line rests on the child's own claims, with quotes fetched by curl.
  - Notes name the parent card: crunch @ `6d253b9e`; hollow_body_hold is new in this batch and not yet verified.
  - Notes also name the shared cards cited (floor-body, palm-flat, selector-pin, prone-checkpoints). No shared line is copied.
- **Rulings applied at write time:**
  - RULINGS.md in full;
  - D-SUP-PROTECT;
  - LR-31's list-sentence exclusion, read literally (R-LB4-2);
  - a "most people/many …" sentence about this exercise's own fault counts as a step-1 hit (D-SUP-LB7-DIPREPS), and one about all training does not (R-LB7-3);
  - a speed-only fault is never drawable;
  - R-LB2-1 and R-LB7-6 (tempo);
  - R-LB3-4 and R-LB6-6 (stop lines);
  - D-SUP-LB7-FEET;
  - D-SUP-LB6-CCP's step-3 count in the rankNote (R-LB7-4);
  - R-LB7-7 ("Front of the shoulder" appears on no LB9 card);
  - D-SUP-LB8-PILOTS (plank: see below).

## Pre-push check (every card)
`check.mjs` is a scratchpad tool. It imports main's copy-lint.mjs unchanged and reads muscles.ts from main. It checks:
- the JSON parses;
- every cited claim id resolves;
- there is no orphan source;
- every claim source has a quote;
- each quote is at most 50 words, counted like `words()` in tests/howto/checks/c7.ts (main);
- the card and the quotes file match one for one, and every quote is `verbatim`;
- CARD-V2 shape: 3 checkpoints, 1-3 tells of at most 8 words, 2-4 zooms, and the list caps;
- the rankNote opens with LR-31's sentence;
- LR-33: no null pause beside a numeric up and down;
- muscle ids are in muscles.ts, with LR-35's roles;
- R-LB7-7;
- on the shown lines: main's CONTACT_RE, SOURCE_RE, SOURCE_CS_RE and SAFETY_LINE_RE, the source names, and the own red-flag wording of C8.

Main's style caps (BANNED: semicolons, "your core" and the like) and LR-22's uncited claims are advisory, as in lb7.md.

**Result:** 0 problems on all 12 cards.
- Advisory counts: 0-3 on the new cards, all of them LR-22 uncited claims.
- On the pass cards, the advisory lines are ones this pass did not change. This includes `core` in feel.primary on plank and ab_wheel_rollout, which those cards keep for LIB-MUSCLE (LR-35, R-LB7-8).

## Per card
Columns:
- **LR-31** is the step that picked the top fault.
- **pick** is plate.mistake.what. When the top fault is not drawable, "top:" gives handlingMistakes[0] and "plate:" gives plate.mistake.what.
- **sources** counts sources fetched (all reachable).
- **verbatim** is quotes verbatim over quotes on the card.
- **lint** is lint hits (copy lint wording rules and C8).

| id | status | tier | LR-31 | pick | drawable | tempo up/down/pause (hold) | sources | verbatim | lint |
|---|---|---|---|---|---|---|---|---|---|
| cable_crunch | new (H) | B | 1 | Moving the hips to pull, instead of only the spine bending. | true | 2/3/1 | 4 | 39/39 | 0 |
| bird_dog | new (H) | C | 2 | Low back arching, sagging toward the floor as the leg rises. | true | 3/3/3 | 6 | 51/51 | 0 |
| superman | new (H) | C | 2 | Head lifted to look up, the neck out of line. | true | 1/2/3 | 6 | 44/44 | 0 |
| pallof_press | new (H) | C | 2 | Lower back over-arching while pressing and returning the handle. | true | 1/3/2 | 5 | 44/44 | 0 |
| bicycle_crunch | new (H), child of crunch | B | 2 | top: Pulling on your neck (not drawable from the front); plate: Hips rotating with the trunk instead of staying still. | false | 2/2/0 | 5 | 48/48 | 0 |
| reverse_crunch | new (T), child of crunch | C | 2, settled by the step-3 count | Knees tucked too far toward the chest, the knee angle closing and the weight rolling onto the upper back and neck. | true | 2/2/1 | 4 | 47/47 | 0 |
| dead_bug | new (T) | C | 2 | Back arching off the mat as the arm and leg lower. | true | null | 4 | 26/26 | 0 |
| v_up | new (T), child of hollow_body_hold | B | 2 | Lower back arching off the floor at the start of the rep. | true | null | 4 | 25/25 | 0 |
| hollow_body_hold | new (T), parent of v_up | C | 2, settled by the step-3 count | Legs too low, not lifted high enough off the floor. | true | hold: set 2, up to 30 s | 3 | 37/37 | 0 |
| plank | LR-31/33 pass (pilot A) | C | 3 | unchanged on the card: Low back sags (LR-31 gives hips hiked: finding P1) | true | hold 10-60 s, unchanged | 4 | 22/22 | 0 |
| ab_wheel_rollout | LR-31/33 pass | A | 2 | Low back arching as the arms reach forward overhead (pick unchanged; text fixed to c3, c13) | true | 1/2/0 | 7 | 35/35 | 0 |
| flutter_kicks | LR-31/33 pass | C | 1 | Lower back arches up off the floor as the legs kick (pick unchanged) | true | null | 4 | 23/23 | 0 |

No PICK CHANGED on ab_wheel_rollout or flutter_kicks.

## Pass cards: what changed
- **ab_wheel_rollout:**
  - New rankNote.
  - New claims: c13 (BarBend's harm line on lumbar extension and rotation) and c14 (a WEAK tempo claim holding "slowly roll the wheel forward", which names 2 s down and 1 s up as a drawing convention, R-LB7-6).
  - c8 gains the case report's title and case sentence; c5 keeps "can".
  - Shown-line fixes under CARD-V2:68:
    - mistake.what;
    - the zoom wrong (drops "hips sagging");
    - tells[1] "The roll-out stays slow";
    - handlingMistakes[1].fix "Roll out slowly.";
    - the low-back row, now in LR-6 shape;
    - the risks: unsupported "too far" and "strain" were dropped;
    - widened claim refs.
  - BarBend's "Pause at the bottom" (a harder option) is named in tempo.text, not in pause.
- **flutter_kicks:**
  - New rankNote.
  - New sources: Fitness Volt, read in full, and Healthline's lower-ab page (flutter kicks is its exercise 10).
  - New claims: c14 (Fitness Volt's "many people" line and the arch) and c15 (Healthline's "Stop if it hurts.").
  - c9 and c11 quotes use the pages' ’, and c4 and c11 are trimmed to their quotes.
  - Shown-line fixes:
    - "flatten" in place of "press";
    - the "Feet lifted" label;
    - "extended range" in place of "sweeping";
    - the back-pain row's stop cites c15, and its fix is "Stop the set. Don't train through the pain." (R-LB3-4, R-LB6-6).
  - Tempo stays null, with the reason in tempo.text.
- **plank** (pilot A, D-SUP-LB8-PILOTS): only the rankNote, claims and quotes changed.
  - New rankNote.
  - New claim c13: Harvard's tips, including "Don't bend at your hips.".
  - c11 gains Cortell's sentence that defines the four positions.
  - c9 keeps Schoenfeld's "tends".
  - Harvard's final URL and page title are used.
  - No shown line, pick or drawable changed. The findings below are for the supervisor to route.

## Findings for the supervisor (plank, pilot A; not made on the card)
The verify routed these to pilot A's owner sheet with its own ids (R-LB9-3); they are not made on the card. D-SUP-LB9-PLANK rules P1's reading: Harvard's line counts for the hiked hips, so there is no 4-way tie. P5 needs no change.
- **P1 Pick (plank-R1, high; routed).** LR-31 step 3 (D-SUP-LB6-CCP count, no common-mistakes list on any source) gives the hips hiked up:
  - hips hiked 2: ACE c4, and Harvard's "Don't bend at your hips." c13, read as the hips piking up;
  - sag 1, bent knees 1, shrug 1.

  The plate draws the sag. The hiked hips would also be drawable from the side. If "Don't bend at your hips." names no direction, the four faults tie 1-1-1-1. viewWhy names all four, so LR-36 does not settle that tie and a ruling is needed. handlingMistakes has no hiked-hips item.
- **P2 (plank-R4, low; routed).** mistake.what: "hips drop below the shoulder-heel line" is not in c4's words.
- **P3 (plank-R2, medium; routed).** handlingMistakes[0].fix: "Brace harder; if you can't hold it, end the hold." c4 has no fix words, and "end the hold" has no source.
- **P4 (plank-R3, low; routed).** handlingMistakes[2], "Holding the breath.": no source names it as a mistake. c6 is an instruction (the flutter A10 precedent).
- **P5 (no change: every word is c4's, R-W1-3).** risks[0], "Low back sagging (arching) during the hold.": no quote ties the sag to harm. By incline_push_up-1, the risk is cut.
- **P6 (plank-R5, low; routed).** Zoom words not in c4 or c5: "in line with shoulders and heels", "hips dropped" and "ahead of the elbows".
- **P7 (plank-R6, low; routed).** posture[3]: "tuck the pelvis" and "draw the shoulder blades together" are not words from c11's quotes, which say posterior tilt and scapular adduction.
- **P8 (plank-R7, low; routed).** feel.rows[1].means, "Not a training feeling.": this is not in c8.

## Rulings asked (PR #295)
All nine were ruled on #295 (comment 6343350047). The ruling ids are under "Verify (LR-29) and fix round".
Each card keeps the value shown in the table until a ruling. Where a ruling would change a line, the other reading is written in that card's rankNote or tempo.text.
1. **plank (P1).** Does Harvard's "Don't bend at your hips." count for the hiked hips?
   - If yes: a pick-change finding for the pilot A plate.
   - If no: a 4-way tie to rule.
2. **hollow_body_hold, list.** Does Fitness Volt's "a few drawbacks to consider" list count as a common-mistakes list? The list is: A tendency to arch the lower back, Hyperextended neck, Breath holding.
   - If yes: the neck is on a list and two sources tie it to harm (c9), so the hyperextended neck wins step 2. It is drawable from the side.
3. **cable_crunch, step 1.** The card counts Fitness Volt's "You will see a lot of people doing this exercise by moving their hips too, but that’s a mistake." as LR-31's "many people".
   - If not: step 2 picks losing control, which is speed-only. Step 3 (Motra's list, item 1) then gives the same drawn fault.
4. **cable_crunch, tempo direction.** Motra's 3-1-2 can be read two ways, because on a cable crunch the tooltip's "eccentric (lowering)" and "concentric (lifting)" point opposite ways.
   - Card: by muscle action, down 3 for the return and up 2 for the crunch. Pause 1 is then the LR-33 convention for "Pause briefly at bottom to squeeze abs."
   - Other reading: by direction, up 3, then a sourced 1 s pause after the crunch, then down 2.
   - Pause is 1 either way.
5. **Pause value from a sourced range.**
   - bird_dog: pause 3 from Motra's "Hold position for 3-5 seconds", which sits right after the reach.
   - pallof_press: pause 2, the one value in both ACE's 2-3 s and Motra's 1-2 s for the same hold.
6. **bicycle_crunch, drawable.** The card calls the neck pull not drawable from the census front view, because the head pulled forward reads from the side.
   - If drawable: plate.mistake becomes the neck pull.
7. **pallof_press, step 2.** The pick reads Motra's cue "Maintain neutral spine to protect back" as the harm tie for its own "Over-arching lower back" item (D-SUP-PROTECT). No other listed fault carries a harm word.
   - If not: step 3's count gives torso rotation (3 sources, arch 2). Rotation is not drawable from the side, so only handlingMistakes[0] changes and the plate stays the arch.
8. **bird_dog, step 1.** Two lines were set aside:
   - Garage Gym Reviews' "not hold our breath; something many of us are guilty of, especially when the going gets tough!", as a statement about all training (R-LB7-3);
   - BarBend's "For many athletes, it's tempting to move quickly…", where "tempting" is read like "tend".

   If either counts, only handlingMistakes[0] changes (breath or speed, neither drawable); the plate stays the arch.
9. **bird_dog, feel.primary.** The census primary is `core`, which LR-35 bars. The card promotes lower_back, glutes and abs from its own claims, which include an EMG abstract, rather than leaving primary empty as D-SUP-LB7-NOPRIMARY did for cable_external_rotation.

## Writer calls the rules settle (recorded, not asked)
- **flutter_kicks.** Fitness Volt's "The way that many people perform flutter kicks is a recipe for lower back pain." counts at step 1 for the arch named in the next sentences (D-SUP-LB7-DIPREPS). Hevy's "A common mistake …" is a list sentence (R-LB4-2). Either way the pick is the same.
- **flutter_kicks.** Healthline's "Stop if it hurts." is a fetched, verbatim stop quote on a page whose exercise 10 is flutter kicks, so the stop line cites it (R-LB3-4).
- **bicycle_crunch.** BarBend's "one common mistake is pulling on your neck" is a list sentence (R-LB4-2). Counted, it gives the same pick.
- **reverse_crunch.** The tuck (BarBend item 3) and the arch (Motra item 2) tie on harm and on the step-3 count (2-2). The first of the tied faults on the earliest list written for this exercise, in source order, is BarBend's tuck. The rankNote says Motra's list alone would give the arch.
- **dead_bug.** None of Garage Gym Reviews' six frequency hits is about a fault of this exercise. One is the "most common mistakes" list sentence; the rest are about the intro, equipment, a muscle, training in general and the author's bio. The pick stays at step 2.
- **hollow_body_hold.** BarBend's "Oftentimes, people trying to train their abs can’t help but feel a distinct pinching sensation in the crease of their hips." is about ab training in general and describes a muscle working, so it is set aside. Counted, its fix points at legs too low, so the pick is the same.
- **superman.**
  - Liftosaur's "Keep your movements controlled to … minimize risk of injury" ties Motra's "Jerky uncontrolled movements" to harm (handlingMistakes[1] only).
  - The "Sharp pain" row cites Motra's "Stop if sharp pain occurs" and links the back box, because Motra's safety notes are about the lower back.
- **v_up.** One risk line rests on ACE's seated V-up page (c13). It is tagged WEAK and the claim names the other version (bench_dip-2 precedent).
- **dead_bug.** Tempo stays null. ACE asks for slow movement both down and back, so a 1 s up would be stricter than its quote (R-LB7-6).

## Gaps
- StrengthLog returned HTTP 429 on every try for bird_dog, reverse_crunch, hollow_body_hold, v_up and dead_bug. Verywell Fit returned 402. None of these is cited, and each card's notes say so.
- No ACE page was found for cable_crunch or bicycle_crunch.
- No BarBend or Garage Gym Reviews superman technique page was found. BarBend's superman benefits article is used.
- There is no neck red-flag box, so neck rows link none.

## Verify (LR-29) and fix round
The full record is docs/supervisor/verify/lb9-research-verify.md @ `56bcb7dc` (claude/sup-lib4-cards).

### Run
- Verified head: #295 @ `5ee54944`. A history-free copy of the 12 changed cards was split into three blind groups of 4. crunch, side_plank and russian_twist were unchanged and out of scope.
  - Each group had a fresh Opus critic and 2 plants, with plantScope set to every field.
  - All three groups are **VALID**: 6/6 plants caught, and each safety plant was rated blocker.
- Re-fetch: 441/441 quotes verbatim, across 56 sources. Supervisor 10 % re-fetch (seed 20261022): 45/45.
- LR-31: 12/12 agree, under D-SUP-STRAIN. LR-33: 12/12 agree on values.
- Census check: every plate.view matches its census view.
- Real findings, plants removed: 0 blocker, 0 high, 0 medium, 20 low (18 from the critics, 2 from the scoring).
- Routed (plank, pilot A): 1 high, 1 medium, 5 low, never made on the card.
- 11 critic items were not actioned, 4 of them void under D-SUP-STRAIN.

### Rulings
- The nine asks:
  1. plank P1: D-SUP-LB9-PLANK. Harvard's line counts for the hiked hips. The pick change is routed (plank-R1).
  2. hollow_body_hold list: D-SUP-LB9-DRAWBACKS. The drawbacks list is not a common-mistakes list.
  3. cable_crunch step 1: D-SUP-LB9-CRUNCH1. It is a step-1 hit.
  4. cable_crunch tempo: D-SUP-LB9-TEMPODIR. The card's reading (by muscle action) stands.
  5. Pause from a range: D-SUP-LB9-RANGE. Take the lowest value every source allows (bird_dog 3, pallof_press 2).
  6. bicycle_crunch drawable: the card's call stands. The verify checked it against the census view.
  7. pallof_press step 2: D-SUP-LB9-PALLOF. Motra's cue ties the arch to harm (D-SUP-PROTECT).
  8. bird_dog step 1: both set-asides stand (#295, point 8).
  9. bird_dog feel.primary: D-SUP-LB9-PRIMARY. Each promoted muscle rests on its own claim, and the verify checked each.
- D-SUP-STRAIN: "strain", and "pressure" on a named body part, are LR-31 step-2 harm words.
- R-LB9-1: the plant findings are not on the real head.
- R-LB9-2: D-SUP-STRAIN voids two highs (h2's superman and bicycle_crunch) and h3's reverse_crunch medium. It also voids the neck-count part of h3's hollow_body_hold medium. The picks stand.
- R-LB9-3: on plank (pilot A), only plank-1, the new Harvard claim c14 and the rankNote change on the card. The pick and the shown-line fixes go to pilot A's owner sheet.
- R-LB9-4: `core` in feel.primary on plank and ab_wheel_rollout stays for LIB-MUSCLE.
- R-LB9-5: superman's Motra "Tempo 0-5-0" is read by its Tempo tooltip. Pause 3 stands.
- R-LB9-6: six critic lows are not actioned, because no rule asks for them.
- R-LB9-7: every other low takes its fix as written, in one round, and every "ruling asked" string takes its ruling id.
  - F-LB9-1: these verified cards have checkpoint labels over 3 words: high_knees, pendulum_squat and resisted_hip_flexion. The next research pass shortens them.

### Fix round checks
- Valid JSON on the 15 changed files. Each keeps its indent and trailing newline.
- Pre-push check: 0 problems on all 12 cards.
  - The check is a scratch script, not committed. It runs main @ `0f1f73de`'s `validateCardFile` (tools/plates/library/research/validate.mjs).
  - On the shown lines it runs copy-lint's CONTACT_RE, SOURCE_RE, SOURCE_CS_RE, SAFETY_LINE_RE and OWN_RED_FLAG, the source names, and C8's RED_FLAG_WORDING.
  - It also checks the CARD-V2 shape, LR-31's opening sentence, LR-33, muscles.ts and LR-35.
  - At `5ee54944` it finds 3 problems: the 4-word labels that bird_dog-3 and superman-3 fix.
- Copy lint and C8: 0 hits.
- Advisory, unchanged, and not on shown lines:
  - cable_crunch grip.handContact names BarBend and Motra;
  - ab_wheel_rollout grip.note says "source";
  - `core` stays on plank and ab_wheel_rollout (R-LB9-4).
- New quotes: 6, each verbatim, at most 50 words by c7's `words()`:
  - plank c14: Harvard's knees line (28 words), fetched 2026-10-24;
  - superman c16: Ekstrom's methods sentence (36 words), PubMed efetch, 2026-10-24;
  - pallof_press c14: StrengthLog's "Primary muscles worked: Obliques Abs" (5 words; an h3 and two list items, tags removed), 2026-10-24;
  - pallof_press c16: Motra's "Glutes" under Secondary Muscles (1 word), 2026-10-24;
  - dead_bug c10: ACE's Step 4 clause (18 words), checked in the supervisor's verify copy of 2026-10-22, not fetched again;
  - hollow_body_hold c12: BarBend's warm-up line (14 words), 2026-10-24.
- Quotes now: 447/447 verbatim (441 + 6).

### Findings and fixes (commit `e3cf79aa`)
| Finding | Fix |
|---|---|
| plank-1 | c11 text drops "(not more than backward tilt with the shoulder blades apart)" |
| plank (R-LB9-3) | new claim c14, Harvard's knees line (CONSENSUS); rankNote cites D-SUP-LB9-PLANK and routes the pick (plank-R1) |
| cable_crunch-1 | tempo.text "so the labels conflict; D-SUP-LB9-TEMPODIR rules Reading A (by muscle action)." |
| flutter_kicks-1 | loadProgression.text "For endurance: 30-50 kicks to fatigue; ankle weights make it harder." (c12) |
| flutter_kicks-2 | setup[0].claim ["c1","c4"] |
| bird_dog-1 | tempo.text "3 is the lowest value the range allows (D-SUP-LB9-RANGE)." |
| bird_dog-2 | rankNote: both step-1 set-asides cite the supervisor's ruling (#295 point 8) |
| bird_dog-3 | checkpoints[0].label "Hands, knees under"; [2].label "Arm, leg level" |
| superman-1 | tempo.text quotes Calgary's range (c19, D-SUP-LB9-RANGE) and reads Motra's "Tempo 0-5-0" by its tooltip (R-LB9-5) |
| superman-2 | c16 text kept to its quotes; c16 gains Ekstrom's methods sentence; libraryDiff.why "(c14; c16: one of three exercises at a mean 77-82 % of maximum back-extensor EMG)" |
| superman-3 | checkpoints[1].label "Arms, legs up" |
| superman-4 | rankNote "(c18; D-SUP-PROTECT: the cue that corrects it, as D-SUP-LB9-PALLOF reads Motra's cue)" |
| pallof_press-1 | c14 gains StrengthLog's primary list and "two coaching pages list the obliques and abs as primary"; c16 gains Motra's "Glutes" and "one coaching page lists the glutes as secondary" |
| pallof_press-2 | rankNote "Reading not taken (D-SUP-LB9-PALLOF rules the tie above): if Motra's neutral-spine cue were not read as ..." |
| pallof_press-3 | tempo.text: the "waits on a supervisor ruling" sentence becomes "2 s is the lowest (and only) value in the overlap of the two ranges (D-SUP-LB9-RANGE)."; both quoted ranges kept |
| dead_bug-1 | c10 gains ACE's Step 4 clause as its second quote |
| reverse_crunch-1 | handlingMistakes[2].mistake "Knees moving past your hips on the way down." |
| hollow_body_hold-1 | rankNote "LR-31 step 2, settled by step 3's count (D-SUP-LB6-CCP)", and the closing sentence cites D-SUP-LB9-DRAWBACKS; the per-card table cell is corrected (this file) |
| hollow_body_hold-2 | c12 gains BarBend's "Three rounds of 15-20 seconds at the start of your workout should do wonders." |
| v_up-1 | rankNote: "one named fault is tied to harm, the arch"; ACE's "control movement speed" is set aside |
| v_up-2 | zooms[1].wrong "Legs flopping around." |

P1-P8 above carry the verify's routed ids (plank-R1 to plank-R7), so no plank shown line changed here.

## F-RESEARCH-2 (F-PALLOF-ARCH): pallof_press

Card: docs/supervisor/verify/f-research-2-card.md on claude/sup-lib4-cards. Branch claude/libht-research-f-research-2 from `0d832e18`. One Opus writer and one Sonnet fetcher, curl only. Checked 2026-10-29. New claims c20-c23 and source fv-pallof. No other card field changed.

**Search log**
- PubMed (E-utilities esearch, db=pubmed). Each term with its hit count:
  - "pallof press" 3 (42346761, 40005429, 39000910);
  - "anti-rotation press" 1 (42811247, a prosthesis paper, not relevant);
  - "pallof AND lumbar" 1 (39000910);
  - "anti-rotation AND core AND lumbar extension" 0;
  - "pallof press electromyography" 0;
  - "anti-rotation exercise electromyography" 0;
  - "Pallof" AND trunk 2 (40005429, 39000910);
  - "cable anti-rotation AND lumbar" 0.
  The writer re-ran the first three terms on 2026-10-29 and got the same counts.
- Abstracts read (access abstract):
  - 40005429 (Juan-Recio 2025) measures pelvis acceleration in m/s², not a lumbar angle or a rotation angle;
  - 39000910 (Franco-Lopez 2024) stops its test at a "deviation from the initial position" and gives no size;
  - 42346761 (Saeterbakken 2026) uses the press only as a strength test.
- Pages read in full (200, checked 2026-10-29):
  - https://barbend.com/pallof-press/
  - https://www.garagegymreviews.com/pallof-press-exercise
  - https://www.garagegymreviews.com/anti-rotation-exercises
  - https://www.motra.com/exercises/cablePallofPress
  - https://breakingmuscle.com/pallof-press/
  - https://fitnessvolt.com/pallof-press/ (new source fv-pallof)
  - https://fitnessvolt.com/pallof-press-vs-plank/
  - https://fitnessvolt.com/rotation-anti-rotation-exercises/
  - https://fitnessvolt.com/cable-vertical-pallof-press-obliques/
  - https://www.muscleandfitness.com/exercises/abs/pallof-press/
- Unreachable:
  - ACE standing anti-rotation press: 403 (WAF), and web.archive.org was blocked by egress;
  - StrengthLog pallof-press: 403, archive blocked;
  - Verywell Fit (402); Muscle & Strength, T-Nation, Physiopedia and ExRx (403);
  - Healthline, Men's Health, NASM and others: 404 on guessed slugs.
  - DuckDuckGo and Bing gave no results, so URLs were guessed.

**Result per part**
| Part | Result |
|---|---|
| Q1(a) arch size | **NO SOURCE.** Gap: "F-RESEARCH-2 Q1(a), 2026-10-29: no source read gives a size (degrees, distance or stated comparison) for the over-arched lower back. …" |
| Q1(b) another tell | **ANSWERED, c20, with no size.** FitnessVolt: "Pressing the hands forward can tempt you to lift the chest and extend the lumbar spine. Exhale, bring the lower ribs over the pelvis, and use a shorter reach until you can keep that position." (full, 2026-10-29). Size: NO SOURCE (gap). No page names the hips pushing forward. |
| Q1(c) rotation | **Direction ANSWERED, c22, from one source.** "Watch for the near shoulder rotating toward the anchor, the hips shifting sideways, or the feet gripping the floor to stop a loss of balance." BarBend, Garage Gym Reviews and Motra state no direction (c7). Size: NO SOURCE. |
| Q1(c) hand drift | **Direction ANSWERED: c6 (BarBend, already on the card) and c21 (FitnessVolt).** "Do not let the cable drag your hands toward the anchor." Size: NO SOURCE. |
| Q1(c) new fault | **c23, Motra "Leaning toward cable" (direction toward the anchor).** It was named in the rankNote and is now a claim. The hips shifting sideways (c22) has no stated side. Size: NO SOURCE. |

**Findings for the supervisor (not made on the card)**
- F-R2-PALLOF-1. Q1(b) is answered with a tell but no size. That fits "another stated tell" (lb9/DESIGN.md:422-423), but the size of the drawn chest lift or rib flare would still be unsourced. Q1(a) gives no arch size, so the 33° bar is not met. This is for the LB9 lane under the card's fates.
- F-R2-PALLOF-2. c22 is the only quote that gives torso rotation a direction (near shoulder toward the anchor). It may bear on the turned-view ruling (lb9/DESIGN.md §20). No change was made.
- F-R2-PALLOF-3. FitnessVolt's "Common Pallof Press Errors" adds a read source to D-SUP-LB6-CCP's counts:
  - rotation and leaning (c22);
  - hand drift (c21);
  - ribs and arch (c20).
  The page ties none of these faults to harm. Its "pain, or injury outcomes" lines say research does not establish them. So LR-31 step 2 is unchanged (only Motra's arch is tied to harm), and the pick stands. The rankNote's step-3 "reading not taken" counts would change; the supervisor decides whether to update the rankNote.
- F-R2-PALLOF-4. ACE and StrengthLog answered 403 on 2026-10-29, and their archive copies are blocked by this container's egress. Their `checked` 2026-10-22 records were left unchanged. If the verify cannot re-read them, it needs an archiveUrl (LR-25).

**Pre-push check (A6).** Main's `tools/plates/library/research/validate.mjs` `validateCardFile` was run on main `c7bdad7a` with the card copied in. It returned 0 problems. A plant (an orphan source plus an edited quote) was caught, so the check bites. The writer's own script confirmed:
- every new quote was re-fetched by curl and is verbatim;
- words() is at most 50 on every quote;
- the quotes file matches the card one for one;
- there are no orphan sources;
- only `claims`, `sources` and `gaps` differ from `0d832e18`, so no shown line changed and the LR-27, copy-lint and C8 results are unchanged.

Main's tests on main `c7bdad7a` were run with the two cards and quotes files copied in: library-research, content (C7 and C8), no-contacts-parity, library-lint (copy lint) and library-ci all pass, 479 of 481 tests. The 2 failures are the byte-copy pins, LIB-21 A11 (lb9-plates, research head f574bb4b) and LIB-22 A11 (lb10-plates, research head 596dbe07). They pass on main's own copies and fail only because the cards gained claims, which is expected. The lane updates them when it re-copies the cards (the card's "after the merge" step). This PR does not touch main.
