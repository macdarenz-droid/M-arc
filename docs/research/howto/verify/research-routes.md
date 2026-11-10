# Research routes: verify records

Route records for held rows (ruling 6 of RESEARCH-ROUTES-4). RESEARCH-ROUTES-1 kept its records on PR comments (#398 6648392748).

## RESEARCH-ROUTES-4

- Card: `docs/supervisor/verify/research-routes-card.md` § RESEARCH-ROUTES-4 on `claude/sup-lib4-cards` @ `56249acd`; its Supervisor rulings win.
- Base: research head `7f74d82d`. Branch `claude/libht-research-routes-4`, PR #414. PLAN: #414 6759592749.
- Roles: one Opus writer; one Sonnet fetcher, a separate helper agent, curl only (no WebFetch or WebSearch). Every page below was checked on 2026-11-10.
- Limits of this search:
  - html.duckduckgo.com returned a bot challenge (HTTP 202), so no discovery search ran. Pages were tried by known or likely URL only.
  - Every StrengthLog URL tried answered 403, as did Muscle & Strength and The Manual. A retry with extra headers was refused by the harness, so it was not repeated.
  - Every combatfitness.co path tried serves the same 6,958-byte JS app shell with no exercise text, so the #398 Combat Fitness quotes cannot be re-read today.
  - The #398 comments 6648279521, 6648297602 and 6648392748 log page names but no URLs or queries.
- Access: 200 = full; 403, 404, a redirect to a home or index page, and a reset are unreachable.

### Q1 arnold_press (LIB-WAYOUT, E3): NO SOURCE

| url | status | note |
|---|---|---|
| https://barbend.com/dumbbell-shoulder-press/ | 200 | end-of-set set-down only (below) |
| https://barbend.com/arnold-press/ | 200 | start position only |
| https://www.garagegymreviews.com/dumbbell-shoulder-press | 200 | nothing on a failed rep |
| https://www.garagegymreviews.com/arnold-press | 200 | nothing on a failed rep |
| https://www.muscleandfitness.com/exercise/workouts/shoulder-exercises/arnold-press/ | 200 | per-rep lowering only |
| https://www.strengthlog.com/seated-dumbbell-shoulder-press/ | 403 | unreachable |
| https://www.strengthlog.com/dumbbell-shoulder-press/ | 403 | unreachable |
| https://www.nasm.org/resource-center/exercise-library/seated-dumbbell-shoulder-press | 404 | unreachable |
| https://www.healthline.com/health/fitness/arnold-press | 404 | unreachable |
| https://www.healthline.com/health/fitness/dumbbell-shoulder-press | 404 | unreachable |
| https://www.muscleandstrength.com/exercises/seated-dumbbell-press.html | 403 | unreachable |
| https://barbend.com/arnold-press-form-guide/, https://www.garagegymreviews.com/how-to-do-the-arnold-press, https://www.muscleandfitness.com/exercise/workouts/shoulder-exercises/seated-dumbbell-press/ | 404 | unreachable |

PubMed (E-utilities esearch):
- `dumbbell AND (spotter OR spotting)`: 16 hits, none on lifting.
- `"resistance training" AND spotter`: 4 hits (37949578, 32740290, 31022106, 29590086), all on a spotter's effect on performance.
- `"overhead press" AND injury AND dumbbell`: 1 hit (42074620), on training to failure and posture.

Result: no reachable source says how to end a failed seated-press rep without a spotter. The only set-down line is BarBend's end-of-set one, under "Dropping the Dumbbells": "Consider getting your spotter to take one of your dumbbells once you’re finished. Alternatively, you can bring your knees up one at a time to “catch” the dumbbells when lowering the weight back down." That is a normal set-down, not a failed-rep way-out, and it is the source of dumbbell-kickup c6, which is already known. (b) No source gives "never over the face" or any other direction, so LR-30 still stands. The card is unchanged, and gaps[0] stays.

### Q2 skull_crusher (LIB-WAYOUT, E3): NO SOURCE

| url | status | note |
|---|---|---|
| https://barbend.com/skull-crushers/ | 200 | names the exit risk, gives no exit (below) |
| https://www.healthline.com/health/fitness/skull-crushers | 200 | spotter only |
| https://www.muscleandfitness.com/exercise/workouts/arm-exercises/skull-crusher/ | 200 | no set-down |
| https://www.garagegymreviews.com/skull-crushers | 404 | unreachable |
| https://www.strengthlog.com/skull-crusher/ | 403 | unreachable |
| https://www.nasm.org/resource-center/exercise-library/lying-triceps-extension | 404 | unreachable |
| https://www.muscleandstrength.com/exercises/ez-bar-skullcrusher.html | 403 | unreachable |
| https://www.garagegymreviews.com/how-to-do-skull-crushers, https://barbend.com/skullcrusher/ | 404 | unreachable |
| https://www.muscleandfitness.com/exercise/workouts/arm-exercises/lying-triceps-extension/ | 200 → index page | unreachable |

PubMed:
- `"triceps extension" AND (spotter OR failure)`: 7 hits, none on ending a rep.
- `"skull crusher"`: 9 hits, none on the exercise.

Result: (a) no failed-rep way-out without a spotter for any bar. (b) No end-of-set set-down. Healthline gives only a spotter: "It’s a good idea to use a spotter when you want to increase your weight." The card is unchanged, and gaps[0] stays.

Finding F-RR4-1 (no field change): BarBend, under "Lifting Too Heavy", says: "the setup of the movement can make it difficult to safely exit the set if things go wrong, depending on where you hit failure." This supports the gap as a risk but gives no way out and names no bar.

### Q3 jump_squat: DONE (ruling 1, D-RR4-JUMPSQ)
- `cmp` of jump_squat.json:94 and box_jump.json:405 at `7f74d82d`: byte-equal. D-LIB8R-AIR is ruled (LIB-SHIP-DESIGN.md:573 on main).
- Diff against `7f74d82d` (commit `9244e049`): inherit[] goes from one entry to `[]`; a new notes[] holds one line. parent stays box_jump. No claim, quote or other field changes.

### Q4 pendulum_squat: (a) ANSWERED c23, (b) NO SOURCE

| url | status | note |
|---|---|---|
| https://weareformfitness.com/training/equipment/specialist/pendulum-squat/ (wff-pend) | 200 | c6 (both quotes) and c7 still verbatim; c23 quotes |
| https://barbend.com/pendulum-squat/ | 404 | unreachable |
| https://www.garagegymreviews.com/pendulum-squat, https://www.garagegymreviews.com/best-pendulum-squat | 404 | unreachable |
| https://www.strengthlog.com/pendulum-squat/ | 403 | unreachable |
| https://www.healthline.com/health/fitness/pendulum-squat | 404 | unreachable |
| https://www.roguefitness.com/rogue-pendulum-squat, https://atlantisstrength.com/products/pendulum-squat, https://primefitnessusa.com/product/prime-pendulum-squat/ | 404 | unreachable |
| https://www.gym80.de/en/products/pendulum-squat | 200 → home page | unreachable |
| https://en.wikipedia.org/wiki/Pendulum_squat | 404 | unreachable |

PubMed: `"pendulum squat"`: 9 hits. None names the machine's pivot; 7595979 is a pendulum-swing training device.

- (a) **c23**, wff-pend, CONSENSUS, access full, checked 2026-11-10:
  - Intro: "The Primal Pendulum Squat uses a pendulum arc. The weight carriage swings through a curved path like a pendulum rather than travelling in a straight line."
  - Execution: descent: "Allow the carriage to swing forward and down, following the pendulum arc."
  - The claim names the Primal Pendulum Squat, as the page does. c6 and c7 are not edited.
- (b) No source names the pivot. wff-pend names the loading contact, not what rides the arc: "the shoulder pads or hip pads providing the loading contact point" and "The load is applied through the shoulders or at the hips depending on the machine design". So no claim is made.
- Edit: in plate.frames, only "Trace follows the knee." changes, to "Trace follows the machine's pendulum arc (c23)." Which point the plate draws is PF4's call.

### Q5 goblet_squat: NO SOURCE (thumb, wrist, way-out)

| url | status | note |
|---|---|---|
| https://www.nasm.org/resource-center/exercise-library/goblet-squat (nasm-goblet) | 200 | "both hands cupping the top of the weight"; no thumb |
| https://www.acefitness.org/resources/everyone/exercise-library/362/goblet-squat/ (ace-goblet) | 200 | no thumb |
| https://barbend.com/goblet-squat/ | 200 | no thumb; wrist comfort only (F-RR4-2) |
| https://www.garagegymreviews.com/goblet-squat | 200 | "grasp it firmly with both hands"; no thumb |
| https://www.muscleandfitness.com/exercise/workouts/leg-exercises/goblet-squat/ | 200 | "grab the head of a dumbbell with both hands"; no thumb |
| https://www.strengthlog.com/goblet-squat/ | 403 | unreachable |
| https://www.healthline.com/health/fitness/goblet-squat | 404 | unreachable |
| https://www.strongfirst.com/goblet-squat/, https://www.strongfirst.com/how-to-goblet-squat/ | 404 | unreachable |
| https://www.strongfirst.com/the-goblet-squat/ | 200 → a .jpg | unreachable |
| https://danjohn.net/the-goblet-squat/ | connection reset | unreachable |
| https://www.acefitness.org/resources/everyone/exercise-library/goblet-squat/ | 404 | unreachable |
| https://combatfitness.co/goblet-squat/ and 3 other paths | 200, JS shell | unreachable |

PubMed: `"goblet squat"`: 4 hits. The abstract of 34341315 was read and has no hand, grip, thumb or wrist text.

Result:
- (a) No source states a thumb position.
- (b) No source states a wrist position or angle.
- (c) No source gives a failed-rep way-out, and none gives a set-down either.

The card is unchanged. grip.thumb, grip.wrist, tierA.wayOut, gaps[0] and unsourced[0] stay.

Finding F-RR4-2 (no field change): BarBend's variations section says "clasping the bottom of the bell may be more comfortable on your wrists than holding the underside of a dumbbell". This compares comfort between the two weights. It states no wrist position, so it does not answer (b).

### Q6 bench_dip: thumb DISAGREE (no claim); wrist NO SOURCE

| url | status | note |
|---|---|---|
| https://learn.athleanx.com/articles/how-to-do-bench-dips (ATHLEAN-X, 2024-09-05) | 200 | thumb and rotation (below); new publisher |
| https://fitnessvolt.com/bench-dip/ (fv-benchdip) | 200 | two finger directions |
| https://www.healthline.com/health/fitness-exercise/bench-dips (hl-benchdip) | 200 | "hands next to your thighs" |
| https://www.muscleandfitness.com/exercise/workouts/arm-exercises/bench-dip/ (mf-benchdip) | 200 | "Grip the bench" |
| https://combatfitness.co/bench-dips/ and 2 other paths | 200, JS shell | unreachable |
| https://www.themanual.com/fitness/how-to-do-bench-dips/, https://www.themanual.com/fitness/bench-dips/ | 403 | unreachable |
| https://www.strengthlog.com/bench-dip/ | 403 | unreachable |
| https://barbend.com/bench-dips/, https://www.garagegymreviews.com/bench-dips, https://www.acefitness.org/resources/everyone/exercise-library/bench-dips/ | 404 | unreachable |
| https://learn.athleanx.com/how-to-do-bench-dips | 404 | unreachable |

PubMed: `"bench dip" OR "bench dips"`: 34 hits. 36293792 ("Bench, Bar, and Ring Dips") was read and has no hand text.

(a) Each source's thumb and hand placement:
- ATHLEAN-X, POSITION YOUR HANDS: "Most people take their thumbs, and they put them right next to their body." … "If you take my hands and turn them out, now you’re externally rotating." Form summary: "Turn them slightly outward to instantly improve shoulder stability."
- Fitness Volt, How to Perform: "Place your hands shoulder-width apart beside your hips, with fingers pointing forward." Exercise Instructions: "Place both hands flat on the bench so that your fingers are pointing laterally away from your body."
- Combat Fitness, on the #398 record only (not re-readable today): "fingers pointing forward over the edge, thumbs close to your thighs."
- Healthline: "Sit down on a bench, hands next to your thighs." This names no thumb.
- M&F: "Grip the bench". This names no thumb.

Result: DISAGREE. ATHLEAN-X calls thumbs next to the body the habit to change and says to turn the hands out. Combat Fitness, on the record, puts the thumbs close to the thighs, and Fitness Volt gives two finger directions. No claim is made, and grip.thumb stays "".

(b) No wrist angle or position is stated. M&F's "about shoulder-width apart" and Fitness Volt's "beside your hips" are placement. The card is unchanged.

### Q7 renegade_row: NO SOURCE (hand, thumb, way-out)

| url | status | note |
|---|---|---|
| https://barbend.com/renegade-row/ (bb-rr) | 200 | "Grip a pair of dumbbells"; no thumb, no set-down |
| https://www.garagegymreviews.com/how-to-do-a-renegade-row (ggr-rr) | 200 | "neutral grip" (already c1, c6) |
| https://www.muscleandfitness.com/exercise/workouts/back-exercises/renegade-row/ | 200 | "hands on the weights" |
| https://www.strengthlog.com/renegade-row/ | 403 | unreachable |
| https://www.healthline.com/health/fitness/renegade-row | 404 | unreachable |
| https://www.nasm.org/resource-center/exercise-library/renegade-row | 404 | unreachable |
| https://www.muscleandstrength.com/exercises/renegade-row.html | 403 | unreachable |
| https://www.acefitness.org/resources/everyone/exercise-library/renegade-row/ | 404 | unreachable |
| https://www.garagegymreviews.com/renegade-row | 404 | unreachable |
| https://www.hevyapp.com/exercises/renegade-row/, https://www.hevyapp.com/exercise/renegade-row/ | 404 | unreachable |
| https://www.themanual.com/fitness/how-to-do-renegade-rows/ | 403 | unreachable |
| "The Coach" page (#398) | no URL logged | not tried |

PubMed: `"renegade row"`: 0 hits.

Result:
- (a) No source describes the hand round the handle beyond "neutral grip" and "Grip a pair of dumbbells".
- (b) No source says whether the thumb is wrapped.
- (c) No source gives a set-down from the plank. BarBend's "scale back the weight" and "You can even start on your knees if need be." are a load choice and an easier version, not a bail-out.

archetype.hand stays null. The card is unchanged, and gaps[0] and gaps[1] stay.

Finding F-RR4-3 (archetype, for the supervisor; Q-W6-6, LR-10): no source gives a hand form that would fill a handle-grip key, so archetype.hand stays null. GGR says "Maintaining a neutral grip and wrist position is vital here", and BarBend says "keep your wrists in neutral". These are wrist lines, and grip.wrist is not in this card's edit list, so they are only recorded here.

### Q8 box_jump: the ankle box (a finding; not approved, not built)

| url | status | note |
|---|---|---|
| https://www.nhs.uk/symptoms/foot-pain/ankle-pain/ (nhs-ankle) | 200 | "Page last reviewed: 20 November 2025" |

- (a) Both c14 quotes are still verbatim. The c14 GP quote holds the first 4 of the 5 bullets in its list.
- The page's urgency tiers, verbatim:
  - **Important** box, above the self-care section: "If you think you may have broken your ankle, do not try to treat it yourself. Contact NHS 111 to find out what to do."
  - **Non-urgent advice: See a GP if:**
    - "ankle pain is stopping you doing normal activities"
    - "the pain is getting worse or keeps coming back"
    - "the pain has not improved after treating it at home for 2 weeks"
    - "you have any tingling or loss of feeling in your foot"
    - "you have diabetes and foot pain – foot problems can be more serious if you have diabetes"
  - **Urgent advice: Contact NHS 111 if:**
    - "you have severe ankle pain"
    - "you feel faint, dizzy or sick from the pain"
    - "your ankle or foot has changed shape or is at an odd angle"
    - "you heard a snap, grinding or popping noise at the time of injury"
    - "you are not able to walk"
- The page has no 999, A&E or urgent-GP tier.
- New claims, each from nhs-ankle with CONSENSUS (c14 is not edited):
  - **c18**: the 5th GP bullet (diabetes and foot pain).
  - **c19**: the Important box (a suspected broken ankle → urgent help, as c14 words the 111 tier).
- (b) The draft, in the LR-27 R1 form of the knee box:
  - name: "Ankle pain"
  - now: "Severe pain, faint, dizzy or sick from it, changed shape or odd angle, heard a snap, grind or pop, can't walk, or maybe broken? Get it checked today."
  - doctor: "Stops normal activities, worse or keeps coming back, no better after two weeks of home care, tingling or loss of feeling, or diabetes and foot pain? See a doctor."

Trigger to quote:

| draft phrase | quote phrase | claim |
|---|---|---|
| Severe pain | "you have severe ankle pain" | c14 |
| faint, dizzy or sick from it | "you feel faint, dizzy or sick from the pain" | c14 |
| changed shape or odd angle | "your ankle or foot has changed shape or is at an odd angle" | c14 |
| heard a snap, grind or pop | "you heard a snap, grinding or popping noise at the time of injury" | c14 |
| can't walk | "you are not able to walk" | c14 |
| maybe broken | "If you think you may have broken your ankle" | c19 |
| Stops normal activities | "ankle pain is stopping you doing normal activities" | c14 |
| worse or keeps coming back | "the pain is getting worse or keeps coming back" | c14 |
| no better after two weeks of home care | "the pain has not improved after treating it at home for 2 weeks" | c14 |
| tingling or loss of feeling | "you have any tingling or loss of feeling in your foot" | c14 |
| diabetes and foot pain | "you have diabetes and foot pain" | c18 |

Every quoted trigger is in the draft, and none is left out. "at the time of injury" and "in your foot" are shortened, and "2 weeks" is written "two weeks", as in the wrist and shoulder boxes.

- Word counts, by words() in tests/howto/checks/c7.ts: name 2, now 28, doctor 29. now + doctor = 57; with the name, 59.
- **R3**: every trigger is kept, so the box is over 30 words. The supervisor rules the cap with this count (ruling 5). No trigger is dropped and the cap is not raised here.
- **R2 scan**: main's CONTACT_RE, SOURCE_RE, SOURCE_CS_RE and SAFETY_LINE_RE (copy-lint.mjs:149-153) find 0 hits on all three lines. There is no number, service, GP, call or link. The "111" in the c19 quote stays in the claim and is not drawn into the box.
- (d) A RED_FLAG_BLOCKS ankle entry would match these trigger words: /severe/i, /faint|dizz|sick/i, /shape|angle/i, /snap|grind|pop/i, /can'?t walk|cannot walk/i, /broken/i, /normal activities/i, /worse|coming back/i, /two weeks/i, /tingl/i, /loss of feeling/i, /diabetes/i.
- appliesTo: [box_jump]. At `7f74d82d`, only box_jump's redFlags name "ankle" (["knee","ankle"]). jump_squat's unsourced[2] notes that its ankle row is not linked.

### Pre-push check (A9)
This is a scratchpad check (`check.mjs`) on the three changed cards: jump_squat, pendulum_squat and box_jump. It imports main's regexes (copy-lint.mjs:145, :149-153). It checks that:
- the JSON parses;
- the claim ids are unique;
- every cited claim id resolves, in "(cN)" text and in tierA claims;
- every source is cited by a claim, and every claim source has a quote;
- every quote is at most 50 words by words();
- the card and the quotes file match one for one, and every quote is `verbatim`;
- no shown string gains a hit from OWN_RED_FLAG, CONTACT_RE, SOURCE_RE, SOURCE_CS_RE or SAFETY_LINE_RE that it lacked at `7f74d82d`.

Result: 0 problems. Two mutations show the check bites, and each was restored:
- frames "(c23)" changed to "(c99)": 1 problem;
- one character added to the c18 text in the quotes file: 1 problem.

The other five cards are unchanged.
