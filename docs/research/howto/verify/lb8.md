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
- seated_calf_raise and standing_calf_raise: Peloton's "The most common mistake I see is people moving too quickly or bouncing through the motion" is written for the bodyweight raise (another version, R-LB7-5) and counts only on bodyweight_calf_raise.
- pendulum_squat: up 1 is a WEAK drawing convention beside a sourced 3 s down, as weighted_dip c9.

## Ruling asks (PR #294)
1. cable_kickback: does BarBend's "a lot of lifters move other parts of their body" count as "many people" (LR-31 step 1)? Card: yes. If no: handlingMistakes[0] becomes the leg swing (step 3 count; speed only); plate.mistake unchanged.
2. seated_calf_raise: is Fitness Volt's "can cause tendon issues" a harm tie ("issues" is not one of LR-31's harm words)? Card: no, the plate draws the part range. If yes: the plate draws the overstretch.
3. lying_leg_curl: is the knee-to-axis line a candidate fault (D-SUP-LB7-FEET) or setup (as on seated_leg_curl)? Card: candidate, top fault, not drawable; plate the arch. If setup: top fault the arch, drawable true; plate unchanged.

## Pre-push check (every card)
`check.mjs` (scratchpad tool) checks: the JSON parses; every cited claim id resolves; no orphan source; each quote is at most 50 words, counted like `words()` in tests/howto/checks/c7.ts (copied verbatim); the card and quotes file match one for one and every quote is verbatim; CARD-V2 shape (3 checkpoints, 1-3 tells, 2-4 zooms, list caps); the rankNote opener; LR-33 (no null pause beside numeric up and down); muscle ids in src/data/muscles.ts with LR-35's roles; and on shown lines main's copy-lint contact, source and source-name patterns (copy-lint.mjs:149-170), the library lint's MEDICAL_RE and C8's RED_FLAG_WORDING. Main's copy caps run as advisory.

Result: 0 problems on all 12 cards; 0 advisory hits on the 10 new cards. pendulum_squat (9) and resisted_hip_flexion (6) keep advisory hits on lines the pass did not change.

## Per card
| id | status | tier | LR-31 step | pick (plate.mistake) | drawable | tempo up/down/pause | sources (all fetched) | quotes verbatim | lint hits |
|---|---|---|---|---|---|---|---|---|---|
| hack_squat | new | B | 1 | At the bottom, the lower back rounds and lifts off the back pad. | true | 1/3/1 | 6 | 47/47 | 0 |
| leg_extension | new | C | 1 | Back arching off the back pad as the legs extend. | true | 2/2/1 | 5 | 48/48 | 0 |
| lying_leg_curl | new (ask 3) | C | 2 | top: Knees off the machine's axis (not drawable); plate: Lower back arching as the legs curl. | false | 1/3/1 | 7 | 58/58 | 0 |
| standing_leg_curl | new, child | C | 1 | top: Dropping the weight down (speed only); plate: Lower back arching as the leg curls. | false | 1/2/1 | 4 | 32/32 | 0 |
| standing_calf_raise | new | B | 2 | Knees locked straight while the heels rise and lower. | true | 2/2/1 | 5 | 51/51 | 0 |
| seated_calf_raise | new (ask 2) | C | 2 | top: Bouncing at the bottom (speed only); plate: Heels moving only part way. | false | 2/2/1 | 6 | 55/55 | 0 |
| bodyweight_calf_raise | new | C | 1 | top: Moving too fast or bouncing (speed only); plate: Heels moving only part way up or down. | false | 2/2/1 | 3 | 33/33 | 0 |
| hip_thrust | new | A | 1 | Lower back arched (overextended) with the ribs up, instead of neutral. | true | 1/2/1 | 8 | 63/63 | 0 |
| glute_bridge | new | C | 2 | Lower back overarching at the top, the hips pushed too high. | true | 1/2/1 | 6 | 38/38 | 0 |
| cable_kickback | new (ask 1) | C | 1 | Lower back arching as the leg kicks back. | true | 1/2/1 | 5 | 33/33 | 0 |
| pendulum_squat | LR-31/33 pass, PICK CHANGED | B | 1 | top: Dropping into the bottom (speed only); plate: Heels lift off the platform at the bottom. | false (was true) | 1/3/0 (was null) | 5 | 38/38 | 0 (9 advisory, unchanged lines) |
| resisted_hip_flexion | LR-31/33 pass | C | 2 | Leaning back and arching the lower back to lift higher. | true | 2/2/2 (unchanged) | 3 | 41/41 | 0 (6 advisory, unchanged lines) |

## Tier A (hip_thrust)
- Way out: no read source covers failing a rep with the bar on the hips; it is in `gaps` only (LR-3, LIB-WAYOUT, the owner's tier-A gap list); `tierA.wayOut` is null.
- Load progression (c19); 3 risks; the lower-back row links `redFlag: "back"`; the breath line (c20) rests on Hackett 2013, tagged MECH, as goblet_squat g12; bar in the hip crease and a pad on the bar (c3, c4).
