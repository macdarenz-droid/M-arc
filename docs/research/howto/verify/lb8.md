# LB8 research (lb8): writer record

Research session for library batch LB8 (leg machines, calves, glutes), 2026-10-22. Brief: docs/supervisor/verify/lb8-research-card.md on `claude/sup-lib4-cards` @ `e86ac8e9`. Branch `claude/libht-research-lb8`, from `claude/libht-research` @ `6d253b9e`. PR #294 (draft, into `claude/libht-research`).

## Scope
- 10 new cards: hack_squat, leg_extension, lying_leg_curl, standing_leg_curl (child of lying_leg_curl), seated_calf_raise, standing_calf_raise, bodyweight_calf_raise, hip_thrust (tier A), glute_bridge and cable_kickback (content.md Appendix A; the others are their own parents).
- The LR-31 and LR-33 pass (lb4-research-card.md (0), (a) and (b), plus the LB8 brief's shown-line checks) on pendulum_squat and resisted_hip_flexion.
- seated_leg_curl (pilot B, LR-31 on #277) is not changed. No LB8 card is drawn on a pilot plate, so D-SUP-LB8-PILOTS has no card to hold.

## How the cards were made
- **Writers:** four Opus writers, one per family: the knee machines (leg_extension, lying_leg_curl, standing_leg_curl); the squat machines with the two pass cards (hack_squat, pendulum_squat, resisted_hip_flexion); the calf raises; the glutes (hip_thrust, glute_bridge, cable_kickback). Each read the LB8 brief, RULINGS.md (all of it), CARD-V2.md, content.md 3.2-3.5, 5.2 and Appendix A/B (`b41ac833`), the8.md and lb7.md, the census rows (@ `4a9fd86`), and the lb4-lb7 supervisor verify records.
- **Fetching:** curl only, with a desktop browser user agent (an iPhone Safari agent for ACE's leg-curl page, which answered 403 to the desktop agent; Safari with extra headers for StrengthLog). WebFetch and WebSearch were never used. PubMed was read through E-utilities efetch. Text found only in a page's served HTML (Motra's Tempo tooltip) counts as verbatim (R-LB6-7).
- **Fetchers:** one Sonnet fetcher per card, separate from the writer (R-W1-4). Each re-fetched every source, set each quote's `status`, `closest` and `note` and each source's `access` and `checked`, checked each quote's `where`, and scanned every read source, cited or not, for LR-31 frequency words, harm words and LR-33 pause, hold and squeeze words. The writer then completed each rankNote from that scan.
- **Re-fetches:** hack_squat's Healthline source first answered 404: the card had a wrong path; the writer's fetched URL (`/health/fitness-exercise/hack-squat`) answers 200, and its 4 quotes were re-checked verbatim by the fetcher. resisted_hip_flexion c10 (Motra's muscle scores) was corrected to the page's spacing and re-checked verbatim.
- **Quote stamps:** two writers' rebuild scripts reset the fetchers' quote stamps on 5 cards. The quote text had not changed; each quotes file was restored from its committed fetcher version, checked equal entry for entry (claim, source, text).
- **Child (LR-34):** standing_leg_curl has no inherit entries. Every line rests on its own claims, fetched by curl (way (1)). Its parent lying_leg_curl is new in this batch and is verified in the same LR-29 run.
- **Shared cards** are cited in notes, never copied: get-in-out (hack_squat, leg_extension, lying_leg_curl, seated_calf_raise), selector-pin (leg_extension, cable_kickback), prone-checkpoints (lying_leg_curl), floor-body (glute_bridge).
- **Rulings applied at write time:** D-SUP-PROTECT; LR-31's list-sentence exclusion read literally (R-LB4-2); a "most people / many …" sentence about the exercise's own fault is a step-1 hit (D-SUP-LB7-DIPREPS), a sentence about all training is not (R-LB7-3); a cause statement ("often a symptom of …") is not a frequency hit (renegade_row, lb7 reading 4); a speed-only fault is never drawable; R-LB2-1 and R-LB7-6 for tempo; R-LB3-4 and R-LB6-6 for stop lines; D-SUP-LB7-FEET; D-SUP-LB6-CCP with R-LB7-4; R-LB7-5; R-LB7-7; LR-35.

## Writer calls (rules applied; not ruling asks)
- leg_extension: BarBend's "It's common to arch your back during the leg extension" states the frequency of this exercise's own fault, so it is a step-1 hit (D-SUP-LB7-DIPREPS), not a list sentence read onto an item. The rankNote writes out the R-LB4-2 alternative.
- lying_leg_curl and standing_leg_curl: Fitness Volt's "Lifting the hips … often introduces lower-back movement" and Hevy's "shortening the range of motion, often resulting from excessive loading" are cause statements and are set aside.
- hack_squat: Fitness Volt's "Incorrect foot placement is among the most common hack squat mistakes." is a list sentence (R-LB4-2); Fitness Volt's "Many people lift their lower back off the back pad …" decides step 1.
- Peloton's "The most common mistake I see is people moving too quickly or bouncing through the motion" was first set aside on seated_calf_raise and standing_calf_raise as another version (R-LB7-5). Corrected by R-LB8-4: the article's 'Common Mistakes to Avoid' is about the calf raise in general, so it is a step-1 hit on all three calf cards (standing_calf_raise: top fault bouncing, drawable false; seated_calf_raise: step 1, pick unchanged).
- pendulum_squat: up 1 is a WEAK drawing convention beside a sourced 3 s down, as weighted_dip c9.

## Supervisor rulings on the asks (PR #294)
1. cable_kickback: D-SUP-LB8-KICKBACK (6343216702): 'a lot of lifters' is LR-31's 'many people' in other words; step 1 stands. The other reading is recorded at LR-31 step 3's list order (R-LB8-5).
2. seated_calf_raise: D-SUP-LB8-ISSUES (6343216702): 'issues' names no load and no injury, so it is not a harm word (D-SUP-STRAIN); the plate draws the part range.
3. lying_leg_curl: D-SUP-LB8-AXIS (6343259275): the body stays where it is placed on the bench for the whole set, so the knee-to-axis line is a candidate (D-SUP-LB7-FEET).

## Pre-push check (every card)
`check.mjs` (scratchpad tool) checks: the JSON parses; every cited claim id resolves; no orphan source; each quote is at most 50 words, counted like `words()` in tests/howto/checks/c7.ts (copied verbatim); the card and quotes file match one for one and every quote is verbatim; CARD-V2 shape (3 checkpoints, 1-3 tells, 2-4 zooms, list caps); the rankNote opener; LR-33 (no null pause beside numeric up and down); muscle ids in src/data/muscles.ts with LR-35's roles; and on shown lines main's copy-lint contact, source and source-name patterns (copy-lint.mjs:149-170), the library lint's MEDICAL_RE and C8's RED_FLAG_WORDING. Main's copy caps run as advisory.

Result: 0 problems on all 12 cards; 0 advisory hits on the 10 new cards (after the fix round, glute_bridge has 1: glute_bridge-1's prescribed fix is 14 words). pendulum_squat (9) and resisted_hip_flexion (6) keep advisory hits on lines the pass did not change.

## Per card
| id | status | tier | LR-31 step | pick (plate.mistake) | drawable | tempo up/down/pause | sources (all fetched) | quotes verbatim | lint hits |
|---|---|---|---|---|---|---|---|---|---|
| hack_squat | new | B | 1 | At the bottom, the lower back rounds and lifts off the back pad. | true | 1/3/1 | 6 | 48/48 | 0 |
| leg_extension | new | C | 1 | Back arching off the back pad as the legs extend. | true | 2/2/1 | 5 | 51/51 | 0 |
| lying_leg_curl | new (D-SUP-LB8-AXIS) | C | 2 | top: Knees off the machine's axis (not drawable); plate: Lower back arching as the legs curl. | false | 1/3/1 | 7 | 58/58 | 0 |
| standing_leg_curl | new, child | C | 1 | top: Dropping the weight down (speed only); plate: Lower back arching as the leg curls. | false | 1/2/1 | 4 | 32/32 | 0 |
| standing_calf_raise | new (R-LB8-4) | B | 1 | top: Bouncing at the bottom (speed only); plate: Knees locked straight while the heels rise and lower. | false | 2/2/1 | 5 | 51/51 | 0 |
| seated_calf_raise | new (D-SUP-LB8-ISSUES) | C | 1 | top: Bouncing at the bottom (speed only); plate: Heels moving only part way. | false | 2/2/1 | 6 | 55/55 | 0 |
| bodyweight_calf_raise | new | C | 1 | top: Moving too fast or bouncing (speed only); plate: Heels moving only part way up or down. | false | 2/2/1 | 3 | 33/33 | 0 |
| hip_thrust | new | A | 1 | Lower back arched (overextended) with the ribs up, instead of neutral. | true | 1/2/1 | 8 | 63/63 | 0 |
| glute_bridge | new | C | 2 | Lower back overarching at the top, the hips pushed too high. | true | 1/2/1 | 6 | 38/38 | 0 |
| cable_kickback | new (D-SUP-LB8-KICKBACK) | C | 1 | Lower back arching as the leg kicks back. | true | 1/2/1 | 5 | 35/35 | 0 |
| pendulum_squat | LR-31/33 pass, PICK CHANGED | B | 1 | top: Dropping into the bottom (speed only); plate: Heels lift off the platform at the bottom. | false (was true) | 1/3/0 (was null) | 5 | 40/40 | 0 (8 advisory, unchanged lines) |
| resisted_hip_flexion | LR-31/33 pass | C | 2 | Leaning back and arching the lower back to lift higher. | true | 2/2/2 (unchanged) | 3 | 41/41 | 0 (6 advisory, unchanged lines) |

## Tier A (hip_thrust)
- Way out: no read source covers failing a rep with the bar on the hips; it is in `gaps` only (LR-3, LIB-WAYOUT, the owner's tier-A gap list); `tierA.wayOut` is null.
- Load progression (c19); 3 risks; the lower-back row links `redFlag: "back"`; the breath line (c20) rests on Hackett 2013, tagged MECH, as goblet_squat g12; bar in the hip crease and a pad on the bar (c3, c4).

## Verify (LR-29) and fix round
- Record: docs/supervisor/verify/lb8-research-verify.md on `claude/sup-lib4-cards` @ `174a8228`, run on #294 @ `8c490332`. Three blind groups of 4, each with a fresh Opus critic and 2 plants. h2 and h3 VALID; h1 (pendulum_squat, resisted_hip_flexion, hack_squat, leg_extension) NOT VALID: its stop-line safety plant was found but rated medium (R-LB8-2), so a fresh critic re-verifies h1's 4 cards on the fixed head with 2 new plants before the merge.
- Counts: 63/63 sources fetched; 537/537 quotes verbatim; the supervisor's 10 % re-fetch 54/54. LR-31 12/12 and LR-33 12/12 agree. Real findings, plants removed: 0 blocker, 0 high, 1 medium, 22 low. Routed (pilot cards): none.
- Rulings R-LB8-1 to R-LB8-8 accepted by the supervisor: R-LB8-3 (D-SUP-STRAIN: "strain" and "pressure" on a named body part are harm words; glute_bridge's "hurt my back" counts); R-LB8-4 (Peloton, Reading B); R-LB8-5 (cable_kickback's other reading at step 3's list order); R-LB8-6 (pendulum_squat count: heels lifting 4, knees caving 3, bouncing 2); R-LB8-7 (not actioned); R-LB8-8 (one round). F-LB8-1: hip_thrust, glute_bridge, cable_kickback and standing_leg_curl (2 s down / 1 s up by convention) and pendulum_squat (1 s up) join F-LB7-1's "slow quote, no seconds" list. F-LB9-1 closes for pendulum_squat and resisted_hip_flexion.
- Pick and drawable changes in the fix round: standing_calf_raise only (handlingMistakes[0] bouncing, drawable false; plate unchanged). The CARD FIELDS verifier runs for it when its fields are written.
- New quotes, each fetched by curl on 2026-10-22 and verbatim: cable_kickback c7 (bb-gk "Anchoring yourself in place …", 30 words) and c12 (fb-che "Hamstrings"). leg_extension c18 holds copies of c16's three verified quotes.

| finding | fix | commit |
|---|---|---|
| pendulum_squat-1 | rankNote count (heels 4, knees 3, bouncing 2; BoxLife's avoid line); handlingMistakes [dropping, heels lifting, knees caving] | a19855bb |
| pendulum_squat-2 | risks[1] "Heels lifting shifts your weight forward and strains your knees." | a19855bb |
| pendulum_squat-3 | checkpoint label "Back on pad" | a19855bb |
| resisted_hip_flexion-1 | checkpoint label "Thigh to hip" | a19855bb |
| hack_squat-1 | handlingMistakes[2] feet too close (c12); rankNote sentence | a19855bb |
| leg_extension-1 | new claim c18 (CONSENSUS, copies of c16's quotes); posture[3] cites c18 | a19855bb |
| lying_leg_curl-1 | rankNote cites D-SUP-LB8-AXIS | a19855bb |
| lying_leg_curl-2 | rankNote records the momentum-as-jerky reading | a19855bb |
| lying_leg_curl-3 | libraryDiff.why gives the secondary-muscle reason | a19855bb |
| seated_calf_raise-1 | libraryDiff.why names Fitness Volt's secondary muscles | a19855bb |
| seated_calf_raise-2 | rankNote cites D-SUP-LB8-ISSUES; Peloton a step-1 hit (R-LB8-4) | a19855bb |
| standing_calf_raise-1 | R-LB8-4: step 1 bouncing, drawable false, handlingMistakes reordered, why | a19855bb |
| standing_calf_raise-2 | libraryDiff.why gives the Fitness Volt reason | a19855bb |
| standing_calf_raise-3 | rankNote "pressure" and "strain" reasons (D-SUP-STRAIN) | a19855bb |
| bodyweight_calf_raise-1 | setup[0] "On a step: …" (c2, c3, c4) | a19855bb |
| cable_kickback-1 | rankNote cites D-SUP-LB8-KICKBACK | a19855bb |
| cable_kickback-2 | other reading at LR-31 step 3's list order (R-LB8-5) | a19855bb |
| cable_kickback-3 | c7 gains BarBend's anchoring quote | a19855bb |
| cable_kickback-4 | c12 gains Fitbod's "Hamstrings" | a19855bb |
| cable_kickback-5 | setup[2] claim ["c2","c4"] | a19855bb |
| cable_kickback-6 | c1 text drops "and face the machine" | a19855bb |
| glute_bridge-1 | handlingMistakes[1].fix keeps "roughly" and "at the top" | a19855bb |
| hip_thrust-1 | rankNote: the second cause line, counted, gives the same pick | a19855bb |

## h1 re-verify and fix round R-LB8-9
- The h1 re-verify on `594b5029` (pendulum_squat, resisted_hip_flexion, hack_squat, leg_extension; 2 new plants) is VALID (#294, 6345604635). Its real findings went into one short fix round (R-LB8-9), with no further blind run.
- Totals after the round: 12 cards, 63 sources, 545/545 quotes verbatim; check.mjs 0 problems on all 12.

| finding | fix | commit |
|---|---|---|
| hack_squat way out (blocker) | setup[4] "Too heavy? Pull the safety lock or lever to get out." (c16); the normal finish stays as setup[3]; setup merged to 5 steps of at most 12 words (LR-30) | ffd09a97 |
| pendulum_squat way out (blocker) | new claim c22 with BoxLife's "Make sure you’re very familiar with how the safety catch works in case you need to engage it mid-movement." and "Plus, it features a safety catch that gives you an “out” if you fail a rep, unlike traditional squats." (curl, 2026-10-22, verbatim); setup[4] "If you fail a rep, the safety catch gives you an out."; setup[1] and [2] merged | ffd09a97 |
| pendulum_squat lockout (medium) | posture[4] "Extend fully at the top, without locking out hard." (c21) | ffd09a97 |
| hack_squat c1 (medium) | c1 gains Healthline's "Step into the machine, placing your feet shoulder-width apart and your shoulders and back against the pads." (curl, verbatim, "How do you do it?") | ffd09a97 |
| pendulum_squat feel.rows[2].fix (low) | keeps c8's condition: "Reduce load if the collapse persists." | ffd09a97 |
| pendulum_squat c21 (low) | tags ["CONSENSUS","WEAK"] | ffd09a97 |
| resisted_hip_flexion feel.rows[2].fix (low) | "lighter weight" dropped: "Stand tall, core tight." | ffd09a97 |
| leg_extension loadProgression (low) | key "claims" (R-LB9-6, the majority shape) | ffd09a97 |
| lb8.md (low) | run sha `8c490332`; per-card quote counts | this commit |
