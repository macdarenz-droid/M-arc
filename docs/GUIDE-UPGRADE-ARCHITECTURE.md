# Guide upgrade: exercise library, form guide and split-aware warm-up

## 1. Status

Design only. Building starts after owner checklist items 2-7.5 have merged (owner, 2026-09-26). Revision R1 (2026-09-27, 5.0): the owner asked for the form guide on every exercise, built by a lower-tier builder; the form-guide lane starts with GU-7a (card in 7.1) and may build ahead; merges keep the order.

Place against the rest of the checklist (from the supervisor's task board copy; the owner's checklist itself was not read here, so this is unverified against it): item 8+9 is marked "LAST" (full QA and 50 user sims on the final `main`), then item 10 (release readiness). **Recommended:** GU-1 to GU-13 and GU-15 build and merge after 7.5 and before 8/9, so the final full QA and user sims cover them. GU-14 (optional, decisions 6-7) and GU-16 (only after decision 4) join that window only if decided in time; otherwise they ship in a separate later release that gets its own full regression run.

This is the single document for this topic. It replaces `FORM-GUIDE-ARCHITECTURE.md` (draft PR #28, branch `claude/form-guide-architecture`, never merged; `docs/FORM-GUIDE-ARCHITECTURE.md` is not on `main`). Everything still valid from it is folded in below; the supervisor closes PR #28 or re-points it at this file when this doc is committed as `docs/GUIDE-UPGRADE-ARCHITECTURE.md`.

Evidence rule: every code claim was checked on 2026-09-26 against `main` at `b55986a` (read-only checkout). "Verified" means read in that checkout. "Research" means a cited outside source (section 9). "Proposed" means a design choice made here. Anything not verifiable is marked "unverified".

## 2. In plain words (for the owner)

- "Around the World" was missing because that one name means four different gym moves. We add all of them, so a search shows every meaning and you pick yours.
- We add the common missing exercises in waves. Wave 1 has 18. Cardio machines come next, with fixes so distance and time show properly (today a treadmill would show "0 kg"). You type cardio time as minutes and seconds. A daily walk or ride does not count as a hard leg workout in your weekly totals.
- Every exercise gets an About page: other names, muscles, equipment, 3-4 how-to steps and one tip.
- If your search matched another name for an exercise, its small info button glows a few times, then keeps a soft ring. Tap it and the About page starts with "You searched X; it's also called Y".
- If nothing matches: "Can't find it?" with "Create my own" and "Ask Escobar". Ask Escobar only shows when Escobar is turned on and you are online, asks before adding anything, can be undone, and cannot add a copy of an exercise the app already has.
- If you create your own exercise that the app already has, or one that looks close to a library exercise, it asks: "This looks like X. Use it?"
- Form guide: a drawn figure in your theme colours shows the lift moving. Play, pause, slow motion, replay. It does 3 reps and stops. You can zoom into the grip, the lift path and the feet or seat, or switch to still pictures. Machines get labelled drawings.
- It lives in the exercise's About page and in a "Form guides" page in Settings. Never on Today. It works with no signal.
- Your SPLIT 1 UPPER BODY (8 exercises) is the first set we animate. You judge the render demo before we draw the rest. Exercises done in a different body position (for example Bench Press lying down, or Push-Up on the floor) get their own demo later, never a copy of yours.
- Warm-up: before you start a split, a short warm-up (usually about 5 minutes; the row shows the real length) for the muscles that split trains. Upper day gets upper-body moves, leg day gets leg moves. Skip any time. Nothing new is saved. If Escobar starts the session for you, a "Warm up" button sits in the session header until your first set.
- Limits to know: your own custom exercises get no animation (they show their name, gear and muscles). Machine drawings show a typical machine; yours at Anytime Fitness may look a bit different, but the setup tips still apply. Demos for some warm-up moves arrive later than their text.

## 3. Owner decisions needed

Each item names the recommended option and why. Nothing else in this document needs the owner.

1. **Who draws the figure poses and the machine drawings.** Real count (verified against today's library and this plan): 32 shared pattern movements (about 3 key poses each) plus posture variants for rows done in a different body position than their pattern's drawing (for example Bench Press lying and Push-Up on the floor next to the seated Machine Chest Press; the exact count is fixed when GU-6 labels every row, 5.3); 11 one-off conditioning sequences; 11 cardio sequences; about 20 warm-up-only moves (6.3 lists 31 moves, and 11 of them reuse a library exercise's demo); full R2 overrides (5 in Wave 1, more per later wave); and 31 machine drawings for today's library (5.4). The earlier "45-60 drawings" estimate undercounted. Options: (A) agents draw them in the repo from the rig spec; (B) pay an illustrator; (C) trace AI-generated images. **Recommended: A**, starting with SPLIT 1 only (8 movements, 6 machines) and stopping for your verdict. Why: no cost, same hand-drawn SVG method the app already uses for the muscle map, and you judge before bulk work. Never C: who owns AI-traced art is unresolved.
2. **Approve the look from the render demo.** **Recommended:** give your changes on the SPLIT 1 render before patch GU-7 draws anything in bulk. Why: it is a taste call that sets every later drawing.
3. **Is warm-up completion ever saved?** **Recommended: no, not in phase 1.** It resets when the app restarts, exactly like today's check-in "Skip". Why: saving it (for a streak or history) needs a new `Session.warmupDone` field in `src/core/models.ts` and `src/core/store.ts`, which is a new kind of saved data and needs your approval. Ask again only if you want warm-up tracked over time.
4. **Optional paid real-video clips** for 15-25 technical lifts (snatch, clean and jerk, muscle-up, Turkish get-up). About $250-1,500 one time (Pond5 about $16-60 per clip, or Adobe Stock; perpetual licences only). **Recommended: not now;** decide after Wave 4 ships with drawings. Why: the drawn guide covers every exercise offline for free; clips are an upgrade that needs spending approval and self-hosting. Your approval must also cover a new kind of data kept on the phone: downloaded clip files saved for offline use (5.10), not only the spending. Never subscription stock (rights end when you cancel), never MuscleWiki (bans offline caching) or ExerciseDB (free tier non-commercial, paid terms unpublished).
5. **How machines are told apart.** 21 exercises are labelled just "Machine" and 22 just "Cable" (verified), but they are different machines (a pec deck is not a leg extension). **Recommended:** a private per-exercise machine map (a static app file). Lists keep showing "Machine". No change to `exercises.json`, search or saved data. Why: one label cannot split distinct machines, and relabelling would change search and the per-gym load steps for no gain. This replaces the earlier "split the hack squat equipment string" idea.
6. **May new movement patterns be added?** The library research says reuse the 33 existing patterns; the gap list proposed 13 new ones. **Recommended: the rule in 4.2** (reuse first; a new pattern only when at least 3 exercises share a motion no pattern describes, and it ships complete in one patch). Outcome: Waves 1, 2, 3 and 5 add zero new patterns; only Wave 4 adds `olympic_pull`. Why: a half-added pattern silently loses coach cues, substitutes and form-guide coverage, and hinge cues ("slow, hips back") would teach an explosive clean wrongly.
7. **Which missing exercises go in the first library patch.** **Recommended: Wave 1, 18 rows:** all 6 "Around the World" meanings plus 12 very common strength moves (4.3). Cardio goes in its own patch because it needs code fixes; technical lifts come later and are optional. Why: Wave 1 needs only one tiny code fix and answers your request directly.
8. **Tibialis Raise.** It trains the shin, which has no muscle id or body-map area. **Recommended: hold.** Why: a new muscle id touches the body map, recovery and the saved check-in soreness keys, an approval-level change for one exercise.
9. **Safety check of how-to and warm-up text.** **Recommended:** builders write from named sources; you read one sample (SPLIT 1's 8 About pages and the 5-6 warm-up moves it uses) and say OK or change it; the rest follow that style. Steps, tips and warm-up cues are written in our own words; no text is copied from sources (the repo is public). Why: this is safety-related copy the app states as fact.
10. **Small defaults, kept unless you object:** kettlebells use the dumbbell load steps (so a target can be a size kettlebells rarely come in, such as 12.5 kg; not changed now because the existing Kettlebell Swing already uses these steps and pound kettlebell sizes differ by maker), while single plates get real plate sizes (4.5); cardio machines stay in their current equipment groups; no gym-by-gym equipment list (none exists today); Olympic lifts use the normal recovery cost; "Create mine anyway" still lets you keep your own exercise with a library name.

## 4. Part 1: exercise library

### 4.1 Why "Around the World" was missing

Verified: `src/data/exercises.json` has 153 rows; no name or alias contains "around the world" or "halo". It is a real gap, not a search bug (`searchExercises` in `src/core/exercises.ts` already scores name and alias matches). The name covers four distinct exercises, plus a niche fifth. Add all of them as separate rows so each logs and progresses correctly:

| Meaning | Row name | Equipment | Pattern | Mode |
|---|---|---|---|---|
| Lying dumbbell arc: fly into an overhead pullover | Around the World (Dumbbell, Lying) | Dumbbells | chest_adduction | weighted |
| Plate or kettlebell circled around the head | Plate Halo; Kettlebell Halo | Plate; Kettlebell | shoulder_abduction (rule R2) | weighted |
| Kettlebell passed hand to hand around the waist | Around the World (Kettlebell Pass-Around) | Kettlebell | anti_rotation | weighted |
| Lunges to 8 clock directions (leg day) | Around the World Lunges (Clock Lunges) | Bodyweight | lunge (R2) | bodyweight |
| Niche: 360 degree pull-up | Around-the-World Pull-Up | Bodyweight | vertical_pull (R2) | bodyweight |

Correction applied: the library design proposed three implement variants of one fly row (dumbbell, kettlebell, plate). That is wrong: the plate and kettlebell "around the world" are halos, not flies.

Search behaviour (proposed, testable): no row gets the bare alias "around the world" (verified today: zero duplicate aliases across the library, and the parity test keeps it that way). The four "Around the World..." names start with the phrase (search score 70); Plate Halo carries alias "plate around the world" and Kettlebell Halo carries "around the world halo" (alias-contains score 40). The gap list's bare alias "halo" on Plate Halo is dropped as well: it would send "halo" searches for the kettlebell version to Plate Halo (both names already contain "halo"). So `searchExercises('around the world')` returns exactly these 6 rows, and `findExercise('around the world')` stays `undefined` because the substring step answers only for a single hit (ST-13, verified).

### 4.2 Movement pattern rule

Verified: the library uses exactly 33 `pattern` values and `src/data/coachCues.json` (422 cues) covers exactly the same 33. Role comes only from pattern (`roleOf`: `MAIN_PATTERNS` or `MAIN_IDS`), never from mode; for example `lib_box_jump` and `lib_jump_squat` are conditioning mode but role "main" because their pattern is `squat` (reviewer correction). An exercise-specific cue (`exerciseIds`) outranks a pattern cue (`lane()` in `src/brain/coach/cues.ts`: 0 before 1).

- **R1 Reuse.** Use an existing pattern when the exercise's key poses and that pattern's coach cues truly fit (same joint action, same main mistakes).
- **R2 Reuse plus override.** If the cues or poses do not fit but the closest pattern still gives the right role and sensible substitutes, reuse it and, in the same patch, add one `exerciseIds` coach cue (outranks the pattern cue) and label the exercise `override` in the form guide's `coverage.ts` (same patch, or GU-6 if `coverage.ts` does not exist yet), so it never shows its pattern's drawing and a full per-exercise movement file is required once its pattern is drawn (5.3).
- **R3 New pattern.** Only when at least 3 exercises share a motion that no pattern describes and R2 would teach unsafe or wrong cues. It ships in one patch with: its `coachCues.json` pattern cues, a `MAIN_PATTERNS` decision, its form-guide movement file (or a `PENDING_PATTERNS` entry if the form guide data layer exists but art is not drawn yet), and green parity tests.

Applied to the gap list's proposed patterns: `cardio` -> existing `conditioning`; `lateral_lunge` -> `lunge` (R2); `squat_to_press` -> `squat` (R2); `muscle_up` -> `vertical_pull` (R2); `hang` -> `vertical_pull` (R2) with `DURATION_NAMES`; `isometric_pull` -> `shoulder_extension` (R1, same joint action as straight-arm pulldown); `wrist_extension` -> `wrist_flexion` (R2); `olympic_lift` -> `olympic_pull` (R2 override for the jerk); `olympic_pull` -> **new pattern (R3, 6 lifts, Wave 4)**; `mobility_flow` -> not a library row (World's Greatest Stretch joins the warm-up move library, Part 3); `get_up`, `isometric_grip_hold` -> decided at their wave under R2; `dorsiflexion` -> held (needs a new muscle id, decision 8).

### 4.3 Missing exercises (77), grouped by priority

Final equipment strings obey 4.4 (exact "Bodyweight" for bodyweight mode; no 3-way compounds). "gap:" notes where the gap list proposed something different. Waves: W1 18 rows, W2 11, W3 27, W4 9 (optional), W5 10, held 1, moved to warm-up 1.

**Very common (27)**

| # | Name | Equipment | Pattern | Mode | Wave | Notes |
|---|---|---|---|---|---|---|
| 1 | Around the World (Dumbbell, Lying) | Dumbbells | chest_adduction | weighted | W1 | HIGH_DAMAGE_IDS (fly/pullover family) |
| 2 | Plate Halo | Plate | shoulder_abduction (R2) | weighted | W1 | needs the plate fix (4.5) |
| 3 | Kettlebell Halo | Kettlebell | shoulder_abduction (R2) | weighted | W1 | |
| 4 | Landmine Press | Landmine | incline_push | weighted | W1 | role main |
| 5 | Decline Push-Up | Bodyweight | horizontal_push | bodyweight | W1 | |
| 6 | Spider Curl | EZ Bar / Dumbbell | elbow_flexion | weighted | W1 | |
| 7 | Barbell 21s | EZ Bar / Barbell | elbow_flexion | weighted | W1 | |
| 8 | Machine Biceps Curl | Machine | elbow_flexion | weighted | W1 | machine map entry |
| 9 | Triceps Kickback | Dumbbell / Cable | elbow_extension | weighted | W1 | "kickback" today finds only the glute Cable Kickback |
| 10 | Lateral Lunge | Dumbbells / Bodyweight | lunge (R2; gap: lateral_lunge) | weighted | W1 | HIGH_DAMAGE_IDS (lunge family) |
| 11 | Single-Leg Calf Raise | Bodyweight | plantar_flexion | bodyweight | W1 | BODYWEIGHT_SHARE 0.97 (calf raise family) |
| 12 | Banded Lateral Walk (Monster Walk) | Resistance Band | hip_abduction | weighted | W1 | parity with the 2 existing band rows |
| 13 | Sit-Up | Bodyweight | spinal_flexion | bodyweight | W1 | |
| 14 | Rowing Machine | Rowing Machine | conditioning (gap: cardio) | conditioning (gap: duration) | W2 | CONDITIONING_NAMES |
| 15 | Stationary Bike | Stationary Bike | conditioning | conditioning | W2 | CONDITIONING_NAMES |
| 16 | Treadmill (Run/Walk) | Treadmill | conditioning | conditioning | W2 | CONDITIONING_NAMES |
| 17 | Stair Climber | Stair Climber | conditioning | conditioning | W2 | CONDITIONING_NAMES |
| 18 | Elliptical | Elliptical | conditioning | conditioning | W2 | CONDITIONING_NAMES |
| 19 | Outdoor Running | Outdoor | conditioning | conditioning | W2 | CONDITIONING_NAMES |
| 20 | Walking | Outdoor | conditioning | conditioning | W2 | CONDITIONING_NAMES |
| 21 | Kettlebell Clean | Kettlebell | olympic_pull (new, R3) | weighted | W4 | |
| 22 | Muscle-Up | Bodyweight | vertical_pull (R2; gap: muscle_up) | bodyweight | W4 | |
| 23 | Handstand Push-Up | Bodyweight | vertical_push | bodyweight | W1 | BODYWEIGHT_SHARE only with a sourced value |
| 24 | Power Clean | Barbell | olympic_pull | weighted | W4 | |
| 25 | Push Press | Barbell | vertical_push | weighted | W1 | role main |
| 26 | Thruster | Dumbbells / Barbell | squat (R2; gap: squat_to_press) | weighted | W3 | |
| 27 | Clean and Jerk | Barbell | olympic_pull (R2 override; gap: olympic_lift) | weighted | W4 | |

**Common (39)**

| # | Name | Equipment | Pattern | Mode | Wave | Notes |
|---|---|---|---|---|---|---|
| 28 | Around the World (Kettlebell Pass-Around) | Kettlebell | anti_rotation | weighted | W1 | |
| 29 | Y-Raise (Incline Dumbbell) | Dumbbells | shoulder_flexion (R2) | weighted | W3 | |
| 30 | Cuban Press | Dumbbells | shoulder_external_rotation | weighted | W3 | |
| 31 | Svend Press | Plate | chest_adduction | weighted | W3 | |
| 32 | Archer Push-Up | Bodyweight | horizontal_push | bodyweight | W3 | |
| 33 | Hindu Push-Up (Dive Bomber) | Bodyweight | horizontal_push (R2) | bodyweight | W3 | |
| 34 | Plyo Push-Up (Clap) | Bodyweight | horizontal_push | bodyweight | W3 | |
| 35 | Weighted Push-Up | Bodyweight / Weight | horizontal_push | weighted | W3 | compound already used by Russian Twist |
| 36 | Dumbbell Floor Press | Dumbbells | horizontal_push | weighted | W3 | |
| 37 | Rack Pull | Barbell | hip_hinge | weighted | W3 | |
| 38 | Good Morning | Barbell | hip_hinge | weighted | W3 | HIGH_DAMAGE_IDS (RDL family) |
| 39 | Dead Hang | Bodyweight | vertical_pull (R2; gap: hang) | duration | W3 | DURATION_NAMES |
| 40 | Drag Curl | EZ Bar / Barbell | elbow_flexion | weighted | W3 | |
| 41 | Zottman Curl | Dumbbells | elbow_flexion | weighted | W3 | test fixture swap (section 8) |
| 42 | Cable Rope Hammer Curl | Cable | elbow_flexion | weighted | W3 | changes old-app import mapping (section 8) |
| 43 | EZ-Bar Overhead Triceps Extension | EZ Bar | elbow_extension | weighted | W3 | |
| 44 | Machine Triceps Extension | Machine | elbow_extension | weighted | W3 | machine map entry |
| 45 | Around the World Lunges (Clock Lunges) | Bodyweight | lunge (R2) | bodyweight | W1 | HIGH_DAMAGE_IDS; BODYWEIGHT_SHARE 0.88 |
| 46 | Nordic Curl | Bodyweight | knee_flexion | bodyweight | W3 | HIGH_DAMAGE_IDS (eccentric) |
| 47 | Belt Squat | Belt Squat Machine | squat | weighted | W3 | machine map entry |
| 48 | Cossack Squat | Dumbbell / Bodyweight | lunge (R2; gap: lateral_lunge) | weighted | W3 | |
| 49 | Curtsy Lunge | Dumbbells / Bodyweight | lunge (R2) | weighted | W3 | HIGH_DAMAGE_IDS |
| 50 | Glute-Ham Raise | Bodyweight | knee_flexion | bodyweight | W3 | machine map: GHD bench |
| 51 | Tibialis Raise | - | - | - | held | needs a new muscle id (decision 8) |
| 52 | Frog Pumps | Bodyweight | hip_extension | bodyweight | W3 | |
| 53 | Toes-to-Bar | Bodyweight | hip_flexion | bodyweight | W3 | |
| 54 | Suitcase Carry | Dumbbell / Kettlebell | carry | conditioning | W3 | CONDITIONING_NAMES + CARRY_OR_SLED_IDS |
| 55 | Overhead Carry | Dumbbell / Kettlebell | carry | conditioning | W3 | CONDITIONING_NAMES + CARRY_OR_SLED_IDS |
| 56 | Assault Bike | Assault Bike | conditioning | conditioning | W2 | CONDITIONING_NAMES |
| 57 | Ski Erg | Ski Erg | conditioning (gap: cardio) | conditioning | W2 | CONDITIONING_NAMES |
| 58 | Outdoor Cycling | Bicycle | conditioning | conditioning | W2 | CONDITIONING_NAMES |
| 59 | Swimming | Pool | conditioning | conditioning | W2 | CONDITIONING_NAMES |
| 60 | Kettlebell Snatch | Kettlebell | olympic_pull | weighted | W4 | |
| 61 | Turkish Get-Up | Kettlebell | decided in W4 under R2 | weighted | W4 | full per-exercise movement |
| 62 | L-Sit | Bodyweight | hip_flexion | duration | W3 | DURATION_NAMES |
| 63 | Front Lever | Bodyweight | shoulder_extension (R1; gap: isometric_pull) | duration | W4 | DURATION_NAMES |
| 64 | Hang Clean | Barbell | olympic_pull | weighted | W4 | |
| 65 | Snatch (Barbell) | Barbell | olympic_pull | weighted | W4 | |
| 66 | World's Greatest Stretch | - | - | - | warm-up | joins the warm-up move library, not the exercise list |

**Niche (11)**

| # | Name | Equipment | Pattern | Mode | Wave | Notes |
|---|---|---|---|---|---|---|
| 67 | Around-the-World Pull-Up | Bodyweight | vertical_pull (R2) | bodyweight | W1 | completes the name family; BODYWEIGHT_SHARE 1 |
| 68 | Reverse Wrist Curl | Dumbbell / Barbell | wrist_flexion (R2; gap: wrist_extension) | weighted | W5 | |
| 69 | Plate Pinch | Plate | decided in W5 under R2 | duration | W5 | DURATION_NAMES |
| 70 | Trap Bar Shrug | Trap Bar | scapular_elevation | weighted | W5 | |
| 71 | Kroc Row | Dumbbell | horizontal_pull | weighted | W5 | |
| 72 | Rope Climb | Bodyweight | vertical_pull | bodyweight | W5 | |
| 73 | Tate Press | Dumbbells | elbow_extension | weighted | W5 | |
| 74 | Sissy Squat | Bodyweight | knee_extension | bodyweight | W5 | |
| 75 | Reverse Hyper | Machine | hip_extension | weighted | W5 | machine map entry |
| 76 | Copenhagen Plank | Bodyweight | anti_lateral_flexion | duration | W5 | DURATION_NAMES |
| 77 | Dragon Flag | Bodyweight | anti_extension | bodyweight | W5 | |

Muscles and aliases per row come from the gap research (`gap.json`), filtered through 4.4. The builder drops any alias that collides with an existing name or alias (the parity test fails otherwise). Checked for Wave 1: none of its 50 proposed names and aliases collide today.

### 4.4 Data rules per category

Every row (verified mechanics in `src/core/exercises.ts`):
- `id`: `lib_` + snake_case, unique. `name`: distinct; a gear word in the name must agree with `equipment` (`GEAR_WORDS`: barbell, dumbbell, cable, machine, ez, bar, kettlebell, smith, trap).
- `equipment`: one implement or an existing-style 2-way "A / B" compound; never 3-way (no precedent).
- Muscles: only the 24 ids in `src/data/muscles.ts`; anything else is silently dropped by `onlyMuscles()`. `primary` non-empty.
- `aliases` (new rows only; existing rows are not changed, and 64 of today's 153 have exactly 1): at least 1, and at least 2 where two real other names exist (Push Press has only "barbell push press" in the gap list, so 1 is correct there); none shared with another row; no bare family word that fits several rows (for example "halo", 4.1).
- `pattern`: per 4.2. `defaultSets`: as a comparable row.

Per category:
- **Weighted accessory** (Around the World, halos): mode falls out as weighted. Add to `HIGH_DAMAGE_IDS` only when the family is there (flies, pullovers, rear-delt flies, RDLs, lunges); `LOW_DAMAGE_IDS` only for short-range machine moves.
- **Kettlebell:** `equipmentGroup` already maps kettlebell to "Dumbbells"; `startingLoadKg` already starts kettlebells at 4 kg (verified). Nothing to add.
- **Bodyweight/calisthenics:** equipment must be exactly "Bodyweight" (`/^bodyweight$/i`) for bodyweight mode; "Bodyweight / X" is weighted. "assisted" in the name gives assisted mode. Add a `BODYWEIGHT_SHARE` entry (`src/brain/bodyweight.ts`) by copying the family value (push-up 0.64, pull-up 1, lunge 0.88, calf raise 0.97); leave out when no family value or source exists (safe null).
- **Timed holds:** the id must join `DURATION_NAMES`; it is the only path to duration mode (checked first in `inferMode`).
- **Cardio:** the id must join `CONDITIONING_NAMES` (else it silently becomes kg x reps); pattern `conditioning`; do not add to `CARRY_OR_SLED_IDS` (the fields-based fallback in progression already gives distance/time goals). The 11 cardio ids also join a new code-only set `CARDIO_IDS` in `src/core/exercises.ts` (not saved data) and `LOW_DAMAGE_IDS`. Requires the fixes in 4.5 (fixes 2-5).
- **Carries:** `CONDITIONING_NAMES` and `CARRY_OR_SLED_IDS`, pattern `carry` (farmer's carry precedent).
- **Olympic lifts (W4):** new pattern `olympic_pull` added to `MAIN_PATTERNS` with its cues; default damage (no new recovery tier, decision 10).
- **Role invariant:** role comes from pattern only. A conditioning-mode row on a main pattern is legitimately "main"; do not "fix" it.

No new saved-data kind: no new `ResistanceMode`, role, `Exercise` field or storage key. If a row does not fit, stop and ask the owner.

### 4.5 Required code fixes

1. **`equipmentGroup` plate collision** (`src/brain/coach/cues.ts:23-33`, verified). Today `'plate'` sits in the Machine branch, checked before dumbbell/kettlebell, so equipment "Plate" returns "Machine" (wrong coach cues and substitutes). Reviewer correction: reordering the two branches does not fix it; move the word. Change to `if (e.includes('machine') || e.includes('leg press')) return 'Machine'; if (e.includes('dumbbell') || e.includes('kettlebell') || e.includes('plate')) return 'Dumbbells';`. The only existing string with "plate", "Plate-Loaded / Machine", still returns "Machine". Load steps need a second change (second-review catch): `defaultProfile` (`src/brain/units.ts:30-37`, verified) gives the "Dumbbells" group `dumbbellLadder` (kg 2, 4, 6, 8, 10, 12.5 ...), so after the move a Plate Halo target could be 6 kg or 12.5 kg, plates that do not exist. So in `defaultProfile`, equipment exactly "Plate" (trimmed, any case) returns a ladder of single real plate sizes, reusing the existing constants: kg [1.25, 2.5, 5, 10, 15, 20, 25] (`KG_PLATES` ascending), lb [2.5, 5, 10, 25, 35, 45] (`LB_PLATES` ascending). And because `resolveProfile` (`units.ts:44-57`) checks the gym's group override before the default, "Plate" skips a gym-level "Dumbbells" group override (a plate is not a dumbbell) and falls to its per-exercise profile, else the plate default. Svend Press (W3) and Plate Pinch (W5) get the same steps. Kettlebells keep the dumbbell steps (decision 10). Ships with Wave 1 (first row that needs it). The two duplicated group lists (`src/escobar/tools/actions.ts:261`, `src/escobar/tools/schema.ts:170`) need no change: no group name changes.
2. **Distance-only cardio display.** For conditioning mode, `progressValue()` (`src/slices/history/progressTrend.ts:20`) returns `bestE1rm || topKg || bestReps`, so a treadmill logged as distance and time gives a flat zero trend; `lastTopStats()` (`src/brain/bodyweight.ts:100`) shows "0 kg"; the Body muscle sheet line (`src/slices/body/Body.tsx:361`) shows "0 reps". Fix with one shared pure helper next to `ExerciseSessionSummary` (`src/brain/history.ts`, which already has `bestDistanceM` and `bestDurationSec`): when `topKg` and `bestReps` are 0, use distance, else time. All three call sites use it. Ships with Wave 2.
3. **Input caps that break cardio** (same patch as fix 2). Distance input: `Train.tsx:733` silently drops values outside 1-1000 m (reviewer catch); raise to 1-100,000 m for conditioning (covers runs, rows, swims and most rides; 1000 m was set for sleds and carries). Seconds input: `parseDurationSec` (`src/core/parse.ts:32`) caps at 3600 s and takes plain seconds only (new catch here). A single "mm:ss" text box does not work either (second-review catch): the conditioning seconds box is `type="number" inputMode="numeric"` (`Train.tsx:734`, verified), number inputs reject ":" and the Android number pad has no colon. **Decided:** two boxes, **min** and **s**, both `inputMode="numeric"`, combined by a new pure `parseMinSec(minText, secText)` in `src/core/parse.ts` (minutes 0-360, seconds 0-59, total 1-21,600 s; otherwise null). Why: it keeps the fast number pad mid-session, with no colon to type. An invalid entry keeps the previous value, never 0 or cleared. The History editor gets the same two boxes plus a distance box for conditioning sets: today it has no distance box at all, and its seconds box (`History.tsx:179`, `type="number"`) uses `parseDurationSec(...) ?? 0`, which silently sets an out-of-range value to 0; that `?? 0` goes for conditioning. Train's "Last:" hint (`Train.tsx:690`, today `${durationSec}s`) shows mm:ss (h:mm:ss from an hour) for conditioning. Holds keep one seconds box and the 3600 s cap. Also rename `PR_LABEL.best_distance` from "Furthest carry" to "Furthest distance" (`src/brain/prs.ts:41`; still true for carries).
4. **Cardio-sized progression steps** (same patch). The conditioning branch in `src/brain/progression.ts:189-205` (verified) adds +10 m (best 100 m or more) or +5 s, with reasons "Go 10 m further at the same load." and "Add five seconds at the same load." A 5000 m row would get +10 m and a 30-minute ride +5 s. For ids in `CARDIO_IDS`: distance +2% rounded to the nearest 50 m, at least 50 m; time +60 s when best is 600 s or more (under 600 s keeps +5 s). The reason text drops "at the same load" when no load was logged ("Go 100 m further.", "Add a minute."). Sleds, carries, custom conditioning and rep-based conditioning keep today's steps and text.
5. **Cardio in weekly volume and recovery** (same patch; decided and recorded). Nothing in `src/brain/volume.ts`, `src/brain/exposure.ts` (`weeklyMuscleSets`) or `src/brain/recovery.ts` treats conditioning differently (verified), and the gap rows give Rowing Machine primary lats and quads and Treadmill primary quads and glutes, so a daily walk would count as a hard leg set every day. **Decided:** the 11 cardio ids join `LOW_DAMAGE_IDS` (recovery still sees a small cost; walking and cycling are mostly concentric, low-damage work), and `weeklyMuscleSets` skips `CARDIO_IDS`, so cardio never counts toward weekly hard sets (its callers, verified: volume bands, deload trigger, weekly summary, coach rules and Body's week sets; recovery does not use it). Why: the bands measure strength training volume; cardio in them would push legs to "over" and hide real under-training. Code-only, no saved-data change.

### 4.6 About info for every exercise

Content shape (proposed): new static file `src/data/exerciseAbout.json`, keyed by exercise id: `{ "steps": [3-4 strings], "tip": "string" }`. Steps at most 120 characters each, tip at most 140, plain words, no emoji. Other names, muscles and equipment are not duplicated: they come from the exercise record (`aliases`, `primary`/`secondary` via `muscleLabel`, `equipment`). A pure `aboutFor(ex)` in `src/core/about.ts` merges both.

Storage decision (decided, not asked): this is shipped content like `exercises.json`, not user data. It touches no `models.ts`/`store.ts`/migration, so the saved-data approval rule does not apply. The existing exercise-specific coach cues (123 of 153 exercises have one) are progress tips ("keep it comparable"), not form steps, so they are not reused as About content.

Custom exercises (pattern `other` from `makeCustomExercise`, or `custom` from Escobar): About shows name, equipment and muscles, plus "Your own exercise. No how-to steps yet." Never an error.

About sheet (`src/slices/workout/ExerciseAbout.tsx`, a nested `Sheet`, loaded with its content as its own chunk, 5.11), top to bottom: optional search header (4.7), other names (hidden if none), main and helping muscles, equipment (plus "See the machine" once the machine guide exists), "How to do it" (the form guide section once it exists, then numbered steps), the tip. Entry points: an info button on every `ExercisePicker` result row, and an "About this exercise" button in the live session's per-exercise sheet (`Train.tsx:758`). Later: the Guide screen (5.9).

### 4.7 Search alias glow and "also called" header

- Pure helper `aliasHit(ex, query): string | null` in `src/core/exercises.ts`, using `normalizeName` like `searchExercises`: returns null when the name matched (name contains the query, or contains every query word); otherwise returns the alias equal to the query, else the first alias containing it; null for an empty query. Custom exercises have no aliases, so they never glow.
- Each result row gets a quiet info button (44 px target, `aria-label="About {name}"`, or `"About {name}, also called {alias}"` on an alias hit). Tapping the row still adds the exercise; tapping the button opens About.
- Glow on alias hit only. The ring and the pulses apply only to `.ex-info.alias-hit`; a plain info button has no ring. CSS (block marked GU-3 in `src/ui/styles.css`): `.ex-info.alias-hit` gets a steady accent ring; plus `html:not([data-motion="reduce"]) .ex-info.alias-hit { animation: ex-info-glow calc(var(--dur-bounce) * 2) var(--ease-standard) 3; }`. Three pulses (about 2.8 s) then the ring stays. Reduced motion shows the ring only. Built only from motion tokens and not infinite, so `tests/ui/styles.tokens.test.ts` passes without an ALLOW entry. Precedent: `.palace-spotlight` (`styles.css:432-434`) is a steady ring plus a one-off glow gated the same way.
- About opened from a glowing button starts with: `You searched “{query}”; it's also called {exercise name}.`

### 4.8 No-match row

When the trimmed query is not empty and there are no results, the row "Nothing matches. You can create it below." (`ExercisePicker.tsx:41`) becomes "Can't find it?" with two buttons: **Create my own** (the existing custom form, name prefilled with the query) and **Ask Escobar**. Ask Escobar shows only when `state.value.escobar.enabled && online.value !== false && navigator.onLine !== false` (the Dock's own rule, `src/escobar/ui/Dock.tsx:21`, plus the browser flag; `online` is `src/escobar/state.ts:26`); with Escobar turned off or the phone offline, only Create my own shows.

### 4.9 Ask Escobar path

- The button calls the existing `openAndSend()` (`src/escobar/ui/open.ts:17`) with: `I can't find "{query}" in the exercise list. Is it in the library under another name? If not, help me add it as my own exercise.` The message asks Escobar to check the library first (its existing `search_exercises` tool) and only then use the existing `propose_custom_exercise` tool; the hard guard is the validation below, not the wording.
- Confirm and Undo already exist (verified): the proposal is a card the person must Apply (`buildAction` in `src/escobar/tools/actions.ts:330-343`), and Apply returns an Undo (`src/escobar/apply.ts:175-180`).
- Alias de-dup already exists and is kept: validation rejects any name that `findExerciseExact()` matches, which checks names and aliases of custom and library exercises, plural-insensitive. A new table test asserts it for every library name and alias.
- Near matches (second-review catch): the exact check misses the owner's own example, because no row has the bare alias "around the world" (4.1), so `findExerciseExact('Around the World')` is undefined and such a proposal passes validation. The proposal card therefore adds a line "Similar in the library: {up to 4 names}" from the same near-match helper as 4.10, so the person sees the library rows before tapping Apply. Client-side only; no schema change.
- Failure paths: with the daily limit reached, Escobar shows its existing notice "Escobar is resting until tomorrow (daily limit reached)." (`EscobarSheet.tsx:40,197`) and the picker keeps the query. Undo after the new exercise was already added to a split leaves the split usable: no crash, and the entry still shows its name.
- **No tool schema or description change.** `scripts/escobar-tools.mjs` regenerates `escobar-worker/src/tools.generated.json` from `src/escobar/tools/schema.ts`, and `tests/escobar/tools-sync.test.ts` fails on drift, so any schema edit becomes an owner-deployed worker PR. All logic stays client-side.
- After Apply, reopening the picker with the same query lists the new exercise first (custom exercises are searched first).

### 4.10 Custom duplicate prompt

In the custom form, on Create: if `findExerciseExact(name, custom)` returns an exercise, show "This looks like {X}. Use it?" with **Use {X}** (adds X, creates nothing) and **Create mine anyway** (creates the custom exercise; today's behaviour). With no exact match, a new pure helper `similarLibrary(name, limit = 4)` in `src/core/exercises.ts` reuses `searchExercises`' scoring (`exercises.ts:219-240`) and keeps library rows whose base score is 70 or more (exact name, exact alias, or name starting with the query). If any, the form shows "This looks like one of these. Use it?" with one **Use {X}** button per row and **Create mine anyway**. Limit 4, not 3: "Around the World" has 4 rows starting with it and every meaning must show. No prompt when nothing scores 70 or more. The "Create a custom exercise" button (`ExercisePicker.tsx:43`) is always visible, so this check runs on every Create, not only after a no-match search.

### 4.11 Parity tests

New `tests/exercise-parity.test.ts`, table-driven over the whole `LIBRARY` so every future row is covered. Per exercise:
1. Every muscle passes `isMuscleId`; `primary` non-empty.
2. Its pattern has at least one pattern cue in `CUES`; `pickCue(ex, 'coach', 'test')` is non-null.
3. `mode` is one of the 5; every id in `DURATION_NAMES`, `CONDITIONING_NAMES`, `CARRY_OR_SLED_IDS` exists in `LIBRARY` (catches typos); an explicit expected-mode table for every row added by this plan (catches a forgotten Set entry, which has no compiler guard).
4. `searchExercises(q)` and `findExercise(q)` find it for its name and every alias.
5. Role is main or accessory; `exerciseDamage` is finite and above 0.
6. A progression suggestion works for its mode on a synthetic one-session history.
7. `rolesFor` is non-empty; one working set gives every primary muscle a non-zero recovery dose.
8. `progressTrend`/`effortDrift` run on a synthetic history; for conditioning rows built from distance/time-only sets, `progressValue` is non-zero (added with fix 2, where it fails first).
9. The share-card line has no "NaN"/"undefined"; an unloaded conditioning line matches what `lib_burpee` produces today ("BW" is existing behaviour, not a defect).
10. `resolveProfile`/`defaultProfile` returns a valid profile. (There is no gym availability filter to test; `Gyms.tsx` is per-gym unit and load-step memory only.)
11. `buildAction('propose_custom_exercise', {name})` throws "already exists" for its name and every alias.
12. From GU-2: About content exists (3-4 steps, 1 tip, lengths, no emoji); no orphan About ids.
13. From GU-6: every library id carries a coverage label (`same_as_pattern` or `override`); `resolveGuide(ex)` resolves to ready, pending (only if allow-listed) or custom (5.3).

Whole-library: no duplicate ids, names or aliases (normalized); `equipmentGroup(e.equipment)` snapshot for the 153 existing rows unchanged. Per-mode probe (weighted, bodyweight, assisted, duration, conditioning): one row logged through `exerciseHistory`, records, recovery and `pickCue` without throwing.

## 5. Part 2: form guide and machine guide

### 5.0 Revision R1 (2026-09-27): built on the upgraded rig, for every exercise

The owner asked on 2026-09-27 for the form guide on every exercise in the app, built by a lower-tier builder agent from task cards. The reference is the upgraded demo in `docs/design/form-guide-demo/` (smooth minimum-jerk motion and the detailed figure; `UPGRADE-BRIEF.md`). That settles decision 1 (option A: agents draw in the repo) and decision 2 (the look is the upgraded demo, subject to the owner's notes on the published page). R1 wins where 5.1-5.14 or section 7 disagree; the superseded lines point here.

**R1-1 One rig in the app.** `src/formguide/rig/` (TypeScript, pure, node-testable) is a port of the demo's shared rig `rig-final/gen.mjs`: the part sets (side, front and top views, with head, clothing, hands that wrap the handle and muscle facets, RIG.md §20), the paint recipe, `solve3` (two-bone arm solve with a pole vector), `minJerk`/`progress`, `pace` and `smoothNumbers`. The lat pulldown's standalone generator (`anim-lat-pulldown/gen.mjs`, its fitted curves in `fit-motion.mjs`) merges into the same rig; the app has one rig, not two. Paint uses the rig's derived tokens (`--fg-line`, `--skin`, `--tee`, `--shorts`, `--rim` and the rest, all `color-mix()` of theme tokens) set on the player root by `rigVars(theme)` from `ThemeTokens.colorScheme`; no hex.

**R1-2 A movement is a motion spec, not key poses.** The earlier "3 key poses + tempo" cannot reproduce the demo: with few poses the hand leaves the handle between poses (RIG.md §8), and the approved motion comes from a solved pose every 0.5 % of the rep. Each movement is a small typed object `src/formguide/moves/<moveId>.ts`:
- `view` ('side' | 'front' | 'top'; 'threeQuarter' later), stage anchors (hip, shoulder), `equipment` (a rig equipment id);
- `tempo` in seconds: lift, hold, return, reset (the demo's 1 / 0.5 / 2 / 0.5, a 4 s rep; spec.md 2.5);
- `channels`: each animated group with its rotation origin and how it moves: an arm solve on an equipment path with a pole curve, or an angle curve in p, or opacity (glow, facets, captions);
- `path` (equipment arc or Bernstein control points), `pace` weights (fitted, D-S4), `stops` (0.5 %, or 0.25 % in the lift when check (b) needs it, D-L2);
- `captions` per phase, 3 `zoomChips` (id, label, caption, camera, subject), 4 `pictures` tiles (time, caption, arrow), `glow` muscle, secondary facets;
- `truth`: named measurements with ranges, copied from spec.md 3.x (for example the chest press pressed elbow 155-168 degrees), and `fixed` points (shoulder joints, hand on handle).

**R1-3 Runtime sampling, not baked keyframes.** When a guide opens, `sampleMove(spec)` computes every channel at every stop (the same numbers the demo writes, 4 decimals) and returns Web Animations keyframes. Measured on the demo, baked keyframes cost 4.7-21.8 KB gzip per movement; shipped as specs, a movement is about 1-3 KB and the rig ships once. Playback: `el.animate(frames, { duration, iterations: 3, easing: 'linear', fill: 'both' })` per group, 1x/0.5x through `updatePlaybackRate`, Replay restarts, 3 reps then hold the start pose, closing cancels everything. Pictures tiles and the reduced-motion view draw static poses from `poseAt(u)` with zero `animate()` calls. Sampling time is budgeted in `tests/perf/budgets.test.ts` style (target under 20 ms per movement on the CI machine, calibrated).

**R1-4 Movement kinds.** A pattern can be drawn only when the rig supports its kind. K1 arm solve on an equipment path (machine and cable presses, rows, pulldowns, pushdowns, flys) and K2 joint-angle curves (raises, curls, extensions, calf raise) exist in the demo. K3 lower-body chain (feet fixed, hip path, hip-knee-ankle solve: squat, hinge, lunge, leg press, hip thrust, step-up), K4 floor, lying and hanging postures (bench press, push-up, crunch, plank, hanging raise) and K5 whole-body one-offs (conditioning, cardio) are new rig work, each in its own card before its patterns (section 7, GU-10a/b). `coverage.json` records each row's kind.

**R1-5 Quality gates for every movement** (unit tests in node, no browser, so every new movement is checked in `npm run check`): the smoothness check (a)-(d) exactly as `docs/design/form-guide-demo/smooth-check.cjs` on the sampled stops (a <= 1 %, b <= 8 %, c <= 3 x its median for angles moving 10 degrees or more, d <= 4 degrees per 1/120 s; scope D-S1/D-S2 in `docs/COACHING-DECISIONS.md`); the truth ranges; the hand-to-equipment gap between stops under 0.5 units; fixed joints drifting under 0.01; the glow rising through the lift, falling on the return, never stepping more than 0.02 per 1/120 s; colours token-only; output deterministic (hash snapshot). A browser gate block per card samples the live player (481 points through `animation.currentTime`) and checks that it matches the unit numbers, that each zoom subject stays in the stage above the bubble, that nothing clips in the 5 themes, and that reduced motion shows Pictures with no animation. A movement that fails is fixed in its motion (pole, path, pace), as the demo was; limits are never raised.

**R1-6 Player contract = the approved demo.** 358 x 460 player, 358 x 276 stage, rep pill and camera label, caption row with tempo, 3 zoom chips, Play/Pause/Replay, 1x/0.5x, Animation/Pictures and the hint line (spec.md 2.x). Zoom keeps the animation running (supersedes 5.6 "pauses"); Pictures shows 4 tiles (supersedes 5.7 "3 poses"). App differences, as the demo already notes (spec.md 10): 3 reps then stop (never loops), reduced motion from `reduced()`/`html[data-motion]`, speed through `updatePlaybackRate`.

**R1-7 First host before the About sheet.** The form-guide lane no longer waits for the About sheet (GU-2: 171 texts and the owner's sample approval). The first host is a lazy `FormGuideSheet` opened from a "How to do it" row in the live-workout exercise Options sheet (`Train.tsx`, `EntryCard`). GU-2 later mounts the same `FormGuideSection` in the About sheet. Never on Today still holds (5.9).

**R1-9 Port method: the demo's generator becomes the app's runtime.** The demo already has proven, checked code that turns a motion spec into SVG markup and dense keyframes (`rig-final/gen.mjs`, plus the lat pulldown's `gen.mjs`). The app ports that code as pure TypeScript functions that return strings and arrays, and does not redraw the figure as JSX polygon by polygon. `renderStage(spec, theme)` returns the stage `<svg>` markup (the same string the demo writes between `<g id="rig-...">` and its overlays, plus the Pictures tiles) and `sampleMove(spec)` returns, per animated group class, a Web Animations keyframe list `[{ offset, transform | opacity | strokeDashoffset }]` with the same 4-decimal values the demo writes into `@keyframes`. The player mounts the markup once into a `<svg>` through `innerHTML` (the string is built only from constants in the repo, never from user input; this is the one allowed use, called out in the PR) and then calls `group.animate(frames, timing)` for each class. Nothing else in the demo's approach changes, so the demo's checks carry over one to one and A1 (bit-equal stops) is a mechanical comparison.

**R1-10 Module map** (`src/formguide/`, all pure except `player/`):
- `rig/math.ts`: `rad`, `deg`, `n2`, `n3`, `n4`, `pts`, `tr`, `mir`, `oct`, `ngon`, `hexv`, `norm`, `sub`, `add`, `mul`, `dot`, `solve3(S, G, a, b, pole)`, `minJerk`, `progress(u)`, `pace(w, p)`, `binom` (verbatim from `rig-final/gen.mjs`).
- `rig/parts.ts`: `LEN`, `SIDE`, `FR`, `TOP` part sets and `mirPart`, exactly the demo's numbers (RIG.md §19 lists them; the source is `gen.mjs`).
- `rig/paint.ts`: `layer()`, `fillPart()`, `olPart()`, `passer()`, `shadow()`, the paint class names, and `rigVars(scheme)` returning the derived token string; `RIG_CSS` = the demo's figure, equipment, guide and motion paint rules from `BASE_CSS` (without the `.anim`/`.capx`/`.repx` CSS-animation classes, which WAAPI replaces, and without the player chrome, which lives in `styles.css`, R1-12).
- `rig/stops.ts`: `stopsFor(spec)` (0.5 % while moving, holds at their boundaries; 0.25 % in the lift when the spec says so) and `smoothNumbers()` (the check, R1-5) ported from `rig-final/gen.mjs` and `smooth-check.cjs`.
- `moves/types.ts`: the `MoveSpec` type (R1-2) and `Channel` kinds (`rotate`, `scaleY`, `translateY`, `opacity`, `dashoffset`, `composite`).
- `moves/machineChestPress.ts`, `moves/latPulldown.ts`, `moves/dumbbellLateralRaise.ts`: the 3 specs with the demo players' final numbers (the card's reference table).
- `scenes/chestPress.ts`, `scenes/latPulldown.ts`, `scenes/lateralRaise.ts`: `renderStage()` per exercise, ported from `chestPress()` / `lateralRaise()` in `rig-final/gen.mjs` and `latPulldown()` in `anim-lat-pulldown/gen.mjs` (markup only; the keyframe fns become `sampleMove` channels).
- `registry.ts`: `{ lib_machine_chest_press, lib_lat_pulldown, lib_dumbbell_lateral_raise }` -> `{ spec, scene }`; `guideFor(exerciseId)` returns `undefined` for everything else (GU-6's resolver replaces it later).
- `player/FormGuidePlayer.tsx` (preact): the demo's `Component` state machine (R1-13); `player/useWaapi.ts`: mount, `animate()` per group, play/pause/rate/replay/cancel; `player/FormGuideSheet.tsx`: the `Sheet` wrapper with the failure line.
- `src/slices/formguide/lazy.tsx`: the dynamic import wrapper (R1-7).

**R1-11 Fixture and equality.** `scripts/formguide-fixture.mjs` (run by hand, like `scripts/extract-body-muscles.mjs`) reads each demo player's `index.html` at a named commit with `git show <commit>:docs/design/form-guide-demo/<player>/index.html`, parses every `@keyframes <name>-a { <pct>% { <prop>: <value> } ... }` block and writes `tests/formguide/fixtures/<moveId>.json` as `{ commit, groups: { "<name>": [[offset, "<value>"], ...] } }`. The unit test `tests/formguide/fixture.test.ts` runs `sampleMove(spec)` and requires, for every group and stop, the same offset and the same value string after normalising numbers to 4 decimals. The fixture is data the reviewer can regenerate; the test never reads the demo files at run time.

**R1-12 CSS and themes in the app.** The player chrome (`.player`, `.stage`, `.pill*`, `.cap-row`, `.chips`, `.chip`, `.controls`, `.btn-icon`, `.seg`, `.hint`, `.pics`, `.tile`, `.badge`, `.bubble`, `.cam`, `.ov*`, the `.sr` helper) goes into `src/ui/styles.css` in one block marked GU-7a, rewritten to the app's motion tokens: `.cam` uses `var(--dur-sheet) var(--ease-standard)` instead of `320ms cubic-bezier(...)` (the tokens lint bans time literals and `cubic-bezier` outside the token block), `.ov` uses `var(--dur-fast)`. The rig's derived colour tokens (`--fg-line`, `--fg-line-far`, `--fg-metal`, `--fg-cable`, `--fg-frame`, `--body*`, `--skin*`, `--tee*`, `--shorts*`, `--shoe*`, `--sole`, `--hair*`, `--rim`, `--equip*`, `--metal-lo`, `--seam`, `--lit`, `--shd`, `--hi`, `--lo`, `--rim-k`, `--muscle-*`) are declared in that same block on `.form-guide` with their dark-scheme values, and again under `[data-theme="paper"] .form-guide` with the light-scheme values, all as `color-mix()` of theme tokens (so `tests/theme.test.ts` QA-R7-4 sees every `var()` defined in the sheet and the inline allow-set is not touched). The rig paint rules (`RIG_CSS`) are injected once by the lazy chunk as `<style id="marc-formguide-rig">` (the same pattern as the theme engine's `marc-theme-tokens`), because they are generated with the markup and hold no time literal.

**R1-13 Player state = the demo's logic.** `FormGuidePlayer` keeps the demo `Component`'s state fields (`playing`, `started`, `ended`, `speed`, `mode`, `zoom`, `rm`) and its `renderVals()` outputs as the source of every class, label and hidden flag (`docs/design/form-guide-demo/anim-machine-chest-press/logic.js` is the shortest copy). Differences from the demo, and only these: `rm` comes from `reduced()`; `--play`/`--delay`/`--iter` CSS variables are replaced by WAAPI calls (`play()`, `pause()`, `updatePlaybackRate(0.5)`, `currentTime = 0`, `cancel()`); the `gen` a/b restart trick is not needed; the rep pill and captions are driven by the same `animation.currentTime` read in a `requestAnimationFrame` loop that stops when nothing plays (the `PulseLine.tsx` pattern); a speed change keeps the current phase (`updatePlaybackRate`) instead of restarting the rep.

**R1-15 Muscle info on tap (owner, 2026-09-27).** Every player lets the user tap a coloured muscle on the figure and read its common name, its anatomical name, its role (target or helps) and one line on what it does in this move, with the dot in the muscle's own colour; the design is `docs/design/form-guide-demo/spec.md` 2.10. Data: `src/data/muscles.ts` gains two fields per muscle, `anatomical` (the 24 names in spec 2.10) and `action` (a generic one-line role, own words), so every exercise in the library gets the feature the day its movement exists; a movement spec may override the line per muscle (`muscleNotes: Partial<Record<MuscleId, string>>`). Roles are never typed twice: the player reads `primary` (target) and `secondary` (helps) from the exercise row, and `tests/formguide/muscles.test.ts` fails when a spec's painted regions (its `roles` map from rig region names to `MuscleId`) name a muscle that is not in that row, or leave out one that is. The hotspot, bubble, outline, exclusivity with the zoom chips and the 44 px rule are as in spec 2.10; the About sheet (GU-2) lists the same muscles with the same colours for reduced-motion users.

**R1-14 Who builds it.** The owner assigns the app build to a lower-tier builder (Opus 5.5 at low effort). So every card in the form-guide lane names its files, functions, numbers, tests and the order of steps, and each step ends with a command that proves it. The builder decides nothing about motion or look: those numbers are the demo's. Where the card is silent, the builder stops and asks the supervisor (AGENTS.md), and never merges, loosens a check, or edits a supervisor-owned file.

**R1-8 Size.** Starting cap unchanged (150 KB gzip for the form-guide chunk, main chunk unchanged). GU-7a measures the rig, player and 3 specs and records them; each later card records its growth. Estimate to verify: rig and player under 60 KB gzip, all specs together under 60 KB gzip.


### 5.1 The judged choice

Three architectures were scored against this app's limits (no animation dependency in `package.json`, 5 themes, offline-first Capacitor + PWA, low-end Android, no trackers): licensed media first 28/45, own drawn rig 40/45, hybrid 38/45. **Chosen: own drawn rig** (SVG + Web Animations API), with the hybrid's optional real-video tier kept as a late, owner-gated extra (decision 4).

Why the rig (Research, sources in section 9): Lottie adds about 237 KB minified and ran about 17 FPS at 92% CPU on an Android benchmark; dotLottie needs about 500 KB of WASM; Rive was the best packaged option (about 60 FPS, 32% CPU) but is a new dependency with a proprietary editor; three.js is sized for games and its mobile guidance warns of WebView crashes. Video and GIFs cannot take the theme colours. The rig costs 0 KB of library, takes theme colours for free exactly like `src/svg/bodyMuscles.ts` + `src/ui/MuscleMap.tsx` (verified), and each part is a real SVG node. Honest limit: a 2D figure teaches multi-phase technical lifts (snatch, muscle-up, get-up) less well than footage; that is what the optional clip tier is for.

### 5.2 How it works

- **One shared rig** (superseded by 5.0 R1-1: `src/formguide/rig/`, the demo's detailed rig and derived paint tokens). Original text: (`src/svg/formGuideRig.ts`): a hand-drawn figure as named SVG groups (pelvis root, torso, head, upper arm, forearm, hand, thigh, shin, foot per side). Painted only with `var(--map-body)` (body), `var(--map-line)` (outline), `var(--accent)` (working limb and path), `var(--text-2)` (props). No hex colours.
- **Pattern-keyed movement files** (`src/data/formGuide/movements/<pattern>.json`): one per shared pattern, 32 in total (every pattern except `conditioning`). Authoring scales with patterns, not exercises: 153 exercises collapse to 33 patterns today (verified).
- **One file cannot serve every exercise on a pattern** (second-review catch, verified in `exercises.json`): `horizontal_push` holds Barbell Bench Press (lying), Push-Up (face down on the floor), Machine Chest Press (seated) and Cable Chest Press (standing); `vertical_pull` holds Upright Row and Pull-Up next to Lat Pulldown; `elbow_extension` holds Skull Crusher; `elbow_flexion` holds Preacher Curl. So every library id gets one of two reviewed labels in `coverage.ts`: `same_as_pattern` (the pattern drawing truly shows it) or `override` (it needs its own sequence). An override may point at a shared posture variant (`src/data/formGuide/variants/<variantId>.json`, for example one lying-press sequence for the barbell, dumbbell, decline and close-grip bench presses), so drawing work scales with body positions, not rows.
- **Conditioning is the exception** (reviewer correction): its 11 members (sled push/pull, burpee, mountain climbers, jumping jacks, high knees, jump rope, battle ropes, medicine ball slam, wall ball, bear crawl) share no pose, so each gets its own sequence, as do the 11 cardio rows.
- **Per-exercise overrides** (`src/data/formGuide/exercises/<exerciseId>.json`): joint-angle changes, one-arm versus two, prop, grip, stance, extra callouts; full sequences for R2 exercises, conditioning and cardio.
- **Custom exercises** resolve to status `custom`: no player, no error.
- **Playback** (superseded by 5.0 R1-2 and R1-3: motion specs sampled at runtime into dense Web Animations keyframes). Original text: (`src/ui/formguide/poseSequence.ts`, pure): key poses plus a 4-number tempo (seconds down, pause, up, pause) become Web Animations keyframes on joint-group `transform` only (compositor-friendly). Always a JS-timed, bounded run (3 reps, then hold the start pose), never a CSS `infinite` animation.
- **Loading:** everything sits behind a lazy chunk (`src/slices/formguide/lazy.tsx`), using the dynamic-import pattern of `src/slices/share/lazy.tsx` but **not its failure handler**: `shareLoadFailed(onClose)` calls `onClose()` before its toast (verified), which would close the About or Warm-up sheet. The form-guide wrapper never calls `onClose`; on a failed import it shows one line in place of the player, "Demo could not load.", with a **Reload** button (`location.reload()`, the same recovery the share toast offers, since a failed chunk keeps failing until reload). The rest of the sheet stays open and usable. Zero bytes in the main bundle.
- **Authoring reference:** self-shot or rights-cleared footage, optionally pose-traced offline with MediaPipe (Apache-2.0, authoring tool only, never shipped); CMU mocap or Mixamo only for timing. No AI-generated tracing sources (decision 1).

### 5.3 Data model and files

```
src/svg/formGuideRig.ts                    rig path data
src/svg/formGuideMachines.ts               machine drawings (path data)
src/data/formGuide/types.ts                JointId, Pose, Movement, Callout, Machine types
src/data/formGuide/movements/<pattern>.json   32 shared movements
src/data/formGuide/exercises/<id>.json     per-exercise overrides and one-off sequences
src/data/formGuide/variants/<variantId>.json  shared posture variants that overrides point at
src/data/formGuide/warmup/<moveId>.json    warm-up-only move sequences (Part 3), same format
src/data/formGuide/machines.json           {id, name, parts:[{id,label,tip}], fault}
src/data/formGuide/machineMap.ts           exerciseId -> machineId | null (5.4)
src/data/formGuide/resolve.ts              resolveGuide(ex) -> {status, movement, override?, machineId}
src/data/formGuide/coverage.json + coverage.ts   LABELS (id -> 'same_as_pattern' | 'override'),
                                           SEQUENCE_ONLY_PATTERNS = ['conditioning'],
                                           PENDING_PATTERNS, PENDING_EXERCISES, PENDING_MACHINES
src/ui/formguide/Rig.tsx, FormGuidePlayer.tsx, KeyPoseStrip.tsx, ZoomCallout.tsx,
                 MachineDiagram.tsx, MachineGuideSheet.tsx, FormGuideSection.tsx
src/slices/formguide/lazy.tsx
```

Movement file shape (superseded by the motion spec in 5.0 R1-2): `{ id, view: 'side'|'front', props[], keyPoses: [{id:'start'|'middle'|'finish', label, joints: {JointId: degrees}}] (3, or 4 where a pause matters), tempo: [down, pause, up, pause], phases: [{from, to, caption}], callouts: [{id:'grip'|'path'|'feet'|'seat', label, text, pose, focus:{x,y,w,h}}], mistakes: [{label, fix}] (2-3, plain external-focus cues like "push the floor away") }`.

Labels and lists are data in `coverage.json` (so a test can read the base branch's copy), re-exported with types by `coverage.ts`. `resolveGuide` returns **ready** only for a row labelled `same_as_pattern` whose pattern is drawn, or a row whose override (or one-off sequence) file exists; **custom** for custom exercises; otherwise **pending**. Conditioning and cardio rows are labelled `override` (their pattern is sequence-only).

Coverage ratchet (`tests/form-guide-coverage.test.ts`): it fails if
- (a) a pattern that is not in `SEQUENCE_ONLY_PATTERNS` has no movement file and is not in `PENDING_PATTERNS` (conditioning never gets a pattern file, 5.2, so it is exempt here and covered by (c));
- (b) a pattern in `PENDING_PATTERNS` now has a file (remove it from the list);
- (c) a row that needs its own sequence has no file and is not in `PENDING_EXERCISES`: every row on a `SEQUENCE_ONLY_PATTERNS` pattern, and every `override` row whose pattern is drawn; a `PENDING_EXERCISES` row that now has its file also fails (remove it);
- (d) a library id has no label, or a label names an unknown id, or a row added by this plan disagrees with the test's expected-label table (every R2 row in 4.3 is `override`; same idea as the expected-mode table, 4.11 item 3). This label list replaces a hand-kept `NEEDS_OVERRIDE` list, so a forgotten R2 row or a new row without review is caught;
- (e) a library id has no explicit `machineMap` key (a machine id or `null`); only the unambiguous string defaults listed in 5.4 count as explicit. This covers gear without "machine" or "cable" in its string (Treadmill, Stationary Bike, Elliptical, Dip Station and the like) and removes the old clash with the "Smith Machine" string default;
- (f) a mapped `machineId` is missing from `machines.json`, or has no drawing and is not in `PENDING_MACHINES`; a `PENDING_MACHINES` entry that now has a drawing also fails (remove it). While a machine is pending, "See the machine" is hidden.

**Growth rule** (second-review catch): pending lists may grow only by what is new in that same patch: a new `PENDING_EXERCISES` entry must be a row added in this patch, or a row whose pattern leaves `PENDING_PATTERNS` in this patch (drawing a pattern moves its `override` rows from pattern-pending to row-pending); a new `PENDING_PATTERNS` entry must be a pattern new in this patch (R3); a new `PENDING_MACHINES` entry must be a machine first mapped in this patch. The test reads the base branch's `coverage.json` and `exercises.json` with `git show origin/main:<path>` and fails loudly, never skips, if it cannot. CI's `build-apk.yml` checks out at depth 1 with no `origin/main` (verified), so GU-6 asks the supervisor to add a fetch of `origin/main` there (an added step, within the `.github/**` rule). The patch that creates `coverage.json` (GU-6) sets the starting lists. Once GU-11 has emptied them, a row can be pending only from the patch that adds and lists it, so every gap is visible in review.

### 5.4 Machine guide and the per-exercise machine map

Reviewer correction: 21 exercises carry the identical string "Machine" (for example leg extension, assisted pull-up, pec fly and hack squat) and 22 carry "Cable", so a map keyed by equipment string cannot tell machines apart. `machineMap.ts` maps by exercise id. String defaults are allowed only for unambiguous strings: "Smith Machine" -> smith_machine, "Leg Press" -> leg_press, "Dip Station" -> dip_station, "Sled" -> sled, "Landmine" -> landmine, "T-Bar / Machine" -> t_bar_row. Every other library id needs its own explicit key, either a machine id or `null` (rule (e) in 5.3), whatever its equipment string says.

Machines for today's library (31): chest_press_machine, incline_press_machine, shoulder_press_machine, pec_deck (Pec Fly and Rear Delt Fly), lateral_raise_machine, lat_pulldown_station (3 pulldowns), seated_row_station, cable_station (single-pulley cable moves), cable_crossover (two-pulley station: Cable Fly, Low-to-High Cable Fly, High-to-Low Cable Fly, Cable Chest Press; second-review catch), assisted_pullup_dip, chest_supported_row_machine, t_bar_row, pullover_machine, smith_machine (5 rows), back_extension_bench, preacher_bench, leg_extension_machine, leg_curl_seated, leg_curl_lying, leg_curl_standing, leg_press (plus leg press calf raise), horizontal_leg_press, hack_squat_machine, pendulum_squat_machine, hip_abduction_adduction, calf_raise_seated, calf_raise_standing, ab_crunch_machine, dip_station, sled, landmine. New rows add: biceps_curl_machine (W1), 7 cardio machines (W2), triceps_extension_machine, belt_squat, ghd (W3), reverse_hyper (W5).

Each drawing teaches the adjustable parts, not the whole machine: seat or pad height and depth, footplate, handle or pulley height, pin or stop, each tied to the one mistake it prevents. Parts are tappable labels (existing `Chip`/`Sheet` primitives) that show a one-line tip. The drawing is static; an optional single highlight on the tapped part is suppressed under reduced motion.

### 5.5 Player controls

- Default state: a still start pose with a Play button. Nothing autoplays when a sheet opens.
- **Play / Pause** (`animation.pause()`/`play()`), **1x / 0.5x** (`updatePlaybackRate`, costs nothing extra), **Replay** (restart from the start pose).
- One Play runs exactly 3 reps, then holds the start pose. Closing the sheet cancels every running animation.
- Controls are real `<button>` elements, 44 px, labelled.

### 5.6 Zoom callouts

(Superseded in part by 5.0 R1-6: zoom keeps the animation running, as in the approved demo.) Chips under the player: **Grip**, **Path**, and **Feet** or **Seat** (from the movement file). Tapping one pauses on the pose that shows it best, zooms the SVG to the `focus` box (transform on a wrapper group, `durFor('base')`, instant under reduced motion), and shows the one-line text. **Path** also draws a dashed accent trace of the hand or bar through the rep, computed from the key poses. "Back" returns to the full view.

### 5.7 Pictures mode (also the reduced-motion view)

(Superseded in part by 5.0 R1-6: 4 tiles, as in the approved demo.) A "Moving | Pictures" switch. Pictures shows the 3 key poses side by side (Start, Middle, Finish) as static theme-coloured drawings with short labels. When reduced motion is on (`reduced()` from `src/ui/motion.ts`, which reads `html[data-motion="reduce"]`, set from the system setting or the in-app `marc.motion` choice; reviewer correction: there is no CSS media-query block for this), Pictures is the only view and no animation call is made. The choice is not saved (no new stored data).

### 5.8 Useful info alongside

Under the player: the synced phase caption (for example "Lower for 2 seconds"), tempo in words, 2-3 common mistakes with their fixes, then the About steps and tip. The muscles and equipment lines stay at the top of the About sheet.

### 5.9 Quiet placement

1. **About sheet**, section "How to do it" (primary). "See the machine" opens `MachineGuideSheet` when `machineId` is set and that machine is drawn (not in `PENDING_MACHINES`).
2. **Guide screen** (`src/slices/guide/Guide.tsx`), reached only from a new "Form guides" row in Settings (same pattern as "Gyms and equipment", `Settings.tsx:142`; never the Watch-lab row). Tabs: Exercises (search reuses `searchExercises` + `aliasHit`) and Machines (each machine and the exercises that use it).
3. **Escobar deep link** (optional): one `PanelId` `exercise-guide` with required `exerciseId` in `src/app/router.ts`, plus one entry in `src/escobar/palace/registry.ts` modelled on `history.exercise-stats`, with `tab: 'train'`: Escobar's navigate calls `go(t.tab)` before opening the panel (`src/escobar/palace/navigate.ts:63`, verified), so the tab in the entry decides which screen the guide opens over, and it must never be Today. The palace manifest is sent by the app at runtime (`src/escobar/context/manifest.ts`), so no worker change is needed.

Never on Today, checked two ways (second-review catch): `Today.tsx:15` imports `requestStart` from `Train.tsx`, so once Train imports `WarmupSheet` and `ExerciseAbout`, a check that follows imports through other files would fail at once, and a direct-import check alone is weak. So: (1) `tests/today-isolation.test.ts` (GU-2) fails on any **direct** import from a file under `src/slices/today/**` of the About, formguide, guide or warm-up modules; (2) gate probes (add-only blocks GU-2, GU-5, GU-7 in `scripts/screenshot-gate.mjs`) find zero `.ex-info`, warm-up row and `.form-guide` elements on the Today screen in all 5 themes.

### 5.10 Online and offline

| Feature | Runs | With no signal |
|---|---|---|
| New library rows, search, alias glow, About content | bundled | works fully |
| Form guide: rig, movements, pictures, machine drawings | bundled lazy chunk; APK serves `www/` directly (`capacitor.config.json` webDir); PWA precaches every built asset, lazy chunks included (`scripts/sw-version.mjs`) | works fully |
| Create my own, duplicate prompt | on device | works fully |
| Ask Escobar | online, via the existing Escobar relay | button hidden; a mid-flow drop uses Escobar's existing offline handling |
| Warm-up | on device | works fully |
| Optional licensed clips (decision 4) | fetched on tap, cached with `@capacitor/filesystem` (Android) or Cache Storage (PWA), Wi-Fi only by default, self-hosted. The cached clip files are a new kind of data saved on the phone, so decision 4's approval must cover them too | drawn guide shows; clip says it needs a connection |

No CDN, no third-party embed, no analytics.

### 5.11 Size and performance budget

- Baseline, recorded numbers only (reviewer correction: the "760 KB" figure had no source): `index-*.js` 462 KB (128 KB gzip), `session-*.js` 148 KB, `EscobarSheet-*.js` 36 KB (`docs/QA-REGRESSION-AUDIT.md:30`). GU-7 runs `npm run build`, records the real totals in its PR, and sets the gate from them.
- Gate (add-only block GU-7 in `scripts/screenshot-gate.mjs`): the main chunk must not contain any formguide module; the form-guide chunk has a starting cap of 150 KB gzip, revisited from measured data.
- Main chunk growth (second-review catch): `App.tsx:2` imports `Train` directly (verified), so anything Train or `ExercisePicker` imports statically lands in the main chunk. **Decided:** the About sheet and `exerciseAbout.json` (171 entries after GU-1, growing with every wave) load as their own lazy chunk (`src/slices/workout/aboutLazy.tsx`), with the same failure rule as the form guide (5.2): never closes the picker or the session sheet; shows "About could not load." with a Reload button. The warm-up logic and `warmups.ts` stay in the main chunk, because the pre-session row needs them to name the regions and the minutes before any tap. GU-2 and GU-5 each record the main chunk's size before and after in the PR and add a cap in their own add-only gate block (measured size plus a small margin); the GU-2 block also fails if About step text appears in the main chunk.
- Runtime (updated by 5.0 R1-3 and R1-8: the demo animates 14-24 channels, including opacity for the glow, facets and captions; sampling time is budgeted): `transform` only, on about 13 groups; one player visible at a time; bounded reps; animations cancelled on close. Real-phone smoothness check on the owner's phone (budget Android devices run JS about 70% slower than mid-tier ones, Research).

### 5.12 Accessibility and motion rules

- The figure and machine SVGs are decorative (`aria-hidden`); all teaching content is real text. Phase captions go to an `aria-live="polite"` region during playback. With no audio, the text is the text alternative (WCAG 1.2.1).
- Reduced motion: Pictures only (5.7). Contrast and colours come from theme tokens only; a `tests/theme.test.ts` add-only block (GU-7) fails on any hex colour in the new SVG sources.
- Infinite loops: `tests/ui/styles.tokens.test.ts` allows six named loops (`esc-rot`, `esc-blink`, `esc-pulse`, `esc-lift`, `palace-glow`, `esc-spin`; verified). This design does not need one and adds none (reviewer correction on the earlier framing).
- Motion timing uses `durFor()`/`reduced()` from `src/ui/motion.ts`; no new raw `matchMedia` calls; no new time literals in CSS.

### 5.13 First proof set: the owner's SPLIT 1 UPPER BODY

The render demo animates these 8 exercises first, and GU-7/GU-8 build exactly this set. The 8 patterns hold 59 of 153 library exercises (39%) and avoid `conditioning`, so the pilot is not skewed (reviewer correction); Wave 1 adds 9 more on them (Plate Halo, Kettlebell Halo, Landmine Press, Decline Push-Up, Spider Curl, Barbell 21s, Machine Biceps Curl, Triceps Kickback, Around-the-World Pull-Up), 68 in all. Drawing these 8 patterns does not give all 68 a correct demo: only rows labelled `same_as_pattern` show it; the rest stay pending until their override lands (5.2, 5.3). All 8 ids exist (verified).

| Exercise (owner's plan) | Library id | Pattern / view | Machine | Callouts (draft text, pending decision 9) |
|---|---|---|---|---|
| Machine Chest Press (120 lb x 12, 3 sets) | lib_machine_chest_press | horizontal_push / side | chest_press_machine | Grip: handles level with mid-chest. Path: straight out, stop before elbows lock. Seat: height so handles meet mid-chest, back on pad. |
| Lat Pulldown (45 kg x 6-8, 3 sets) | lib_lat_pulldown | vertical_pull / side | lat_pulldown_station | Grip: a little wider than shoulders. Path: bar to upper chest, elbows drive down. Seat: thighs snug under the pad. |
| Incline Machine Press (55 lb x 11, 3 sets) | lib_incline_machine_press | incline_push / side | incline_press_machine | Grip: handles level with upper chest. Path: follow the machine's line up and out. Seat: low enough to start at upper chest. |
| Seated Cable Row (45 kg x 12, 3 sets) | lib_seated_cable_row | horizontal_pull / side | seated_row_station | Grip: close handle, palms facing. Path: pull to lower ribs, chest tall. Feet: on the plate, knees soft. |
| Dumbbell Lateral Raise (6 kg x 13, 3 sets) | lib_dumbbell_lateral_raise | shoulder_abduction / front | none | Grip: light hold. Path: arc out to shoulder height, no higher. Feet: hip-width, soft knees. |
| Rear Delt Fly (55 lb x 15, 2 sets) | lib_rear_delt_fly | horizontal_abduction / front | pec_deck (rear setup) | Grip: handles at shoulder height. Path: wide arc back until arms line up with shoulders. Seat: chest on the pad. |
| Dumbbell Biceps Curl (10 kg x 8-10, 2 sets) | lib_dumbbell_biceps_curl | elbow_flexion / side | none | Grip: palms forward. Path: elbows stay at your sides, lower slowly. Feet: hip-width, no swinging. |
| Single-Arm Triceps Pushdown (5 kg x 9, 2 sets) | lib_single_arm_triceps_pushdown | elbow_extension / side | cable_station (pulley high) | Grip: single handle, palm down. Path: elbow pinned, push down to the thigh. Feet: staggered, slight forward lean. |

Machine drawings for this set: chest_press_machine, lat_pulldown_station, incline_press_machine, seated_row_station, pec_deck, cable_station. Pec Fly shares pec_deck with Rear Delt Fly, which proves reuse by explicit map. Machine Chest Press and Incline Machine Press are both "Machine" but get different drawings, which proves the map splits them.

### 5.14 Optional licensed clips (owner-gated)

Only after decision 4. Perpetual licences only (Pond5 Standard/Premium, Adobe Stock). Clips are transcoded at build time into short, muted MP4s with real WebVTT captions (not auto-generated) and a themed player frame; each clip gets a licence ledger row in `THIRD_PARTY_NOTICES.md`. They are never bundled, so base size is unchanged. The drawn guide always stays underneath.

## 6. Part 3: split-aware warm-up

### 6.1 Model

RAMP (Raise, Activate, Mobilise, Potentiate; Research). The new warm-up is Raise + Activate/Mobilise for the split's muscles. Potentiate already exists: the 50/70/85% load ramp (`WARMUP_PCTS`/`WARMUP_REPS` in `src/brain/coach/pre.ts:51-52`), shown as "Show warm-up" inside each exercise card (`Train.tsx:666-668`) and as a pre-session card. They are two steps of one sequence and are never merged. Dynamic moves only; long static holds (over 60 s per muscle) are avoided before lifting.

### 6.2 Selection logic (pure: `src/brain/warmup.ts`, `selectWarmup(split, custom, checkIn, day, recentGymSessions)`)

1. **Input:** the split being started, after today's Escobar change (`todaySplit(...)`, already computed as `planned` in `PreSessionSheet`, `Train.tsx:891`). It works the same for unplanned and custom splits.
2. **Muscle weights:** new `plannedEmphasis(exercises, custom)` in `src/brain/exposure.ts`: for each planned exercise found by `findExercise` (skip missing ones), `weight[muscle] += sets * ROLE_WEIGHT[role]` using the existing `rolesFor` and `ROLE_WEIGHT = {primary 1, secondary 0.55, stabilizer 0.25}` (`exposure.ts:10`). It differs from `sessionEmphasis` on purpose: that function divides each role's weight among the muscles sharing the role (`exposure.ts:73`) and weighs by logged effort; this one gives every muscle the full role weight and uses planned sets. Why: it only ranks regions against a 20% threshold before any set is logged, and the undivided weight never lets a compound lift's many muscles push a trained region under the threshold, so the error leans toward warming up one region too many, never one too few. The 6.8 numbers use this rule.
3. **Region scores:** sum by `MuscleGroup` (chest, shoulders, arms, back, core, legs; `muscles.ts:14`).
4. **Which regions (reviewer correction, no 3-region cap):** every group scoring at least 20% of the top group qualifies, and every qualifying group gets at least one move. Order by score, ties broken by the fixed order legs, back, chest, shoulders, arms, core. Region moves last 30-60 s (both sides counted for a per-side move; a data test enforces at most 60 s per region move and exactly 90 s per raise move), so even all 6 groups plus the raise stay within the 480 s ceiling (90 + 6 x 60 = 450 s, 7 moves); no qualifying group is ever dropped.
5. **Time:** a raise move first (90 s). Then the first pass: one move per qualifying region, total at most 480 s. Then second moves round-robin in score order, added only while the total stays at or under 360 s and 6 moves. So the 360 s / 6-move limit applies to the round-robin only; the first pass may reach 7 moves and 450 s. The row's minutes are worked out from the real total: `Math.max(1, Math.round(total / 60))`.
6. **Move choice:** each region's candidate list is fixed. The start index rotates by date (`daysSinceEpoch(day) % list.length`). No `Math.random`.
7. **Equipment:** default moves need nothing or a bench. A band version is offered as "Swap to band version", never auto-swapped, and only if one of the last 10 sessions at the active gym (`Session.gymId`) logged an exercise whose equipment contains "band" or "cable". Reviewer correction: `UnitsState.byEquipment` is a unit/load-step override store, not an inventory, and is not read.
8. **Soreness:** today's `CheckIn.soreness` (`models.ts:300`) at 4 or 5 on a muscle swaps that region's loaded moves (push-up ramp, bench dip ramp, squat ramp) for its mobility moves. The region keeps at least one gentle move. Soreness never adds a region.

### 6.3 Move library (`src/data/warmups.ts`, typed array like `muscles.ts`)

`WarmupMove { id, name, otherNames?, regions: MuscleGroup[], muscles: MuscleId[], type: 'raise'|'activate'|'mobilise', loaded: boolean, equipment: 'none'|'bench'|'band', reps?, seconds?, perSide?, cue, safety?, source, demoExerciseId? }` (`source`: the section 9 link the cue and safety line rest on)

Starter set (31 moves listed; 11 point at a library exercise through `demoExerciseId`; cue and safety text pending decision 9, sources in section 9, written in our own words):
- Raise: jumping jacks (`lib_jumping_jacks`), high knees (`lib_high_knees`), rowing arm swings.
- Chest: scapular push-up, incline push-up ramp (`lib_incline_push_up`), wall push-up ramp.
- Shoulders: arm circles forward and back, band pull-apart (band, `lib_resistance_band_pull_apart`), band external rotation (band).
- Back: cat-camel, prone Y-T-W, towel row, band row (band), thoracic rotation.
- Arms: wrist and elbow circles, bench dip ramp (bench, `lib_bench_dip`), band curl (band), band pushdown (band).
- Legs: leg swings front-back and side-side, 90/90 hip rotation, hip opener lunge, World's Greatest Stretch (from the gap list), ankle rocks, bodyweight squat ramp (`lib_bodyweight_squat`), glute bridge (`lib_glute_bridge`), banded lateral walk (band), calf pumps.
- Core: dead bug (`lib_dead_bug`), bird dog (`lib_bird_dog`), front plank (`lib_plank`, 20-30 s), side plank (`lib_side_plank`).

Dosage defaults: 30-60 s per move in total, both sides counted (a per-side move gets 15-30 s per side), or 8-12 reps kept within that time; range built up each rep. Raise moves are 90 s. Research gaps named, not hidden: "6-8 moves" and "10% of session" are practice consensus, not trials; injury-reduction figures come from team-sport warm-ups; the 50/70/85% ramp is this app's own convention.

### 6.4 Placement in the pre-session flow

Never on Today. `Train()` gates CheckInSheet then PreSessionSheet (`Train.tsx:114-116`); no new gate state. In `PreSessionSheet` (`Train.tsx:886`), a "Warm up ({N} min)" card row renders **above and outside** the insight list, with N worked out from the selected total (6.2 step 5). Reviewer correction: `preSessionInsights()` sorts by priority and keeps only 3 (`pre.ts:101,134`), and SPLIT 1 has 4 main lifts, so with history it can make 4 priority-260 load-target cards and a warm-up insight would be cut. The subtitle names the regions ("Arms, back, shoulders, chest").

Tapping opens `WarmupSheet` (nested `Sheet`): one move per screen with name, demo area, cue, safety line, and a rep target or a seconds countdown (the user taps Done; no auto-advance). Also Skip move, progress dots, and a "Skip warm-up" text button on every step (same idea as CheckInSheet's Skip). Finishing or skipping returns to the unchanged "Start {split}" button. Done/skipped state is an in-memory signal like `checkInDismissed` (`Train.tsx:75`). The countdown ring uses `durFor()`/`reduced()`; reduced motion shows numbers only; the countdown is announced politely via `aria-live`.

Sessions started without the pre-session sheet (second-review catch): Escobar's `propose_start_session` (`src/escobar/apply.ts:128-131`, verified) calls `startSession` directly, skipping the check-in and pre-session sheets. So the live session header gets a quiet "Warm up" button, shown while no set of the session is saved yet and the warm-up was not finished or skipped in this app session; it opens the same `WarmupSheet` for the active split. It disappears once the first set is saved.

### 6.5 Demos

Warm-up moves use `FormGuidePlayer` and `KeyPoseStrip`: same Play, 3-rep bound, Pictures and reduced-motion behaviour. A move with `demoExerciseId` (11 of the 31: jumping jacks, high knees, incline push-up, band pull-apart, bench dip, squat ramp, glute bridge, dead bug, bird dog, plank, side plank) shows that library exercise's guide through `resolveGuide`, never a second copy; the other 20 get their own files on the same rig (`src/data/formGuide/warmup/<moveId>.json`). Jumping jacks and high knees are conditioning rows, so their one-off sequences (`exercises/lib_jumping_jacks.json`, `exercises/lib_high_knees.json`) are drawn in GU-9 and serve both places. A move whose library guide is still pending shows text only, from an allow-list in the warm-up test that may only shrink and is empty after GU-10. Before the rig ships, the sheet shows text only; the cue text is the primary channel anyway.

### 6.6 Edge cases

- First-ever session: works; it needs exercise data, not history. The load-ramp card is absent as today (it needs history).
- Rest day or no split started: PreSessionSheet never mounts, so there is no warm-up.
- Custom split: works from its real exercises; there is no split-type enum to branch on.
- Split whose exercises give no muscles: raise-only block (one 90 s move; the row reads "Warm up (2 min)" by the rounding in 6.2 step 5). An empty split shows no row.
- Deleted custom exercise: skipped, like `pre.ts`'s `if (!meta) continue`.
- Session started by Escobar (`propose_start_session`): no pre-session sheet, so the "Warm up" button in the live session header (6.4) offers the same warm-up until the first set is saved.
- Soreness: see 6.2 step 8.

### 6.7 Stored data

None in phase 1 (decision 3). The Escobar tie-in extends the existing `warmup` method text in `src/escobar/knowledge/methods.ts` to cover both steps. New catch here: adding a new MethodId would change the `explain_method` enum (`schema.ts:146` uses `METHOD_IDS`), which would regenerate `escobar-worker/src/tools.generated.json` and need an owner-deployed worker PR. So no new MethodId.

### 6.8 Worked example: SPLIT 1 UPPER BODY

Computed from the library rows and the owner's set counts (3, 3, 3, 3, 3, 2, 2, 2):

| Region | Score | Qualifies (at least 2.56 = 20% of 12.8) |
|---|---|---|
| Arms (triceps 5.3, biceps 5.3, forearms 2.2) | 12.80 | yes |
| Back (mid back 5.75, lats 4.65, upper traps 1.65) | 12.05 | yes |
| Shoulders (rear 3.65, front 3.3, side 3.0) | 9.95 | yes |
| Chest (chest 4.65, upper chest 3.0) | 7.65 | yes |
| Core, legs | 0 | no |

The old "top 3 regions" rule would have dropped chest on a day with two chest presses; the corrected rule keeps it. Plan on a day where every list starts at index 0: jumping jacks 90 s; wrist and elbow circles 30 s (arms); cat-camel 8 reps, about 40 s (back); arm circles forward then back, 60 s (shoulders); scapular push-ups 10 reps, about 40 s (chest); then a second arms move, bench dip ramp 10 reps, about 40 s. That is 6 moves, about 300 s, shown as "Warm up (5 min)". Then Start. The first main lift, Machine Chest Press, keeps its existing ramp in its exercise card at 50/70/85% of the working load, rounded to the machine's steps (about 60, 85 and 100 lb for 8, 5 and 2 reps from 120 lb). If triceps soreness is 4, the bench dip ramp is swapped for a mobility move; arms still get wrist and elbow circles.

The owner's SPLIT 2 LOWER AND CORE and third split are not worked here: their exercises were not provided, so their scores cannot be computed.

## 7. Part 4: continuous build plan

One ordered list. Builds may run ahead in three lanes (library: GU-1-4, 12, 14, 15; warm-up: GU-5, 9; form guide: GU-6-8, 10, 11, 13), and merges follow this order, with one exception: the library-wave patches GU-12, GU-14 and GU-15 may merge as soon as their dependencies have merged, ahead of art patches, so drawing never blocks new rows (the growth rule in 5.3 keeps coverage honest). Each patch is useful alone. Sizes: S up to about 300 changed lines; M 300-1000; L over 1000 or art/content-heavy.

**Every patch** also meets: `npm run check` and `npm run test:tz` green; `tests/ui/styles.tokens.test.ts` and `tests/theme.test.ts` pass with only add-only, task-ID blocks; CSS only in one `src/ui/styles.css` block marked with the patch ID; no import from `src/slices/today/` in new modules, and no new direct import of About, formguide, guide or warm-up modules from it (5.9); no change to `src/core/models.ts`, `src/core/store.ts`, migrations, `package.json` or `escobar-worker/**`; the PR lists head commit, changed paths, evidence per criterion, what needs a real phone, and open risks.

| # | Patch | Depends | Size |
|---|---|---|---|
| GU-1 | Library Wave 1 (18 rows) + whole-library parity test + plate fix | none | M |
| GU-2 | About sheet + About content for all 171 library exercises | GU-1 | L |
| GU-3 | Search: alias glow, "also called", no-match row, Ask Escobar, duplicate prompt | GU-2 | M |
| GU-4 | Cardio fixes + Wave 2 (11 rows) | GU-2 | M |
| GU-5 | Warm-up logic + WarmupSheet (text) | none (merges here) | M |
| GU-6 | Form-guide data layer, machine map, coverage ratchet | GU-4 | M |
| GU-7a | Rig + player + the 3 demo movements, in a Form guide sheet (5.0 R1; card in 7.1) | none (form-guide lane start) | L |
| GU-7b | The other 5 SPLIT 1 movements (kinds K1, K2) | GU-7a | M |
| GU-7 | (superseded by GU-7a and GU-7b; whichever of GU-2 and GU-7a merges second mounts `FormGuideSection` in the About sheet, R1-7) | - | - |
| GU-8 | Machine guide: SPLIT 1's 6 machines | GU-7 | M |
| GU-9 | Warm-up demos on the rig | GU-5, GU-7 | M |
| GU-10a | Rig kind K3 (lower-body chain) + squat, single_leg_squat, lunge, hip_hinge, hip_extension | GU-7b | L |
| GU-10b | Rig kind K4 (floor, lying, hanging) + its patterns and posture variants | GU-10a | L |
| GU-10 | Remaining K1/K2 patterns + R2 overrides (was all 24) | GU-7b, GU-6 | L |
| GU-11 | Remaining machines + conditioning/cardio one-offs | GU-8, GU-9 | L |
| GU-12 | Library Wave 3 (27 rows) with About + guide coverage | GU-4, GU-6 | L |
| GU-13 | Guide screen in Settings + Escobar deep link | GU-11 | M |
| GU-14 | Wave 4 technical lifts + `olympic_pull` (optional, decisions 6-7) | GU-12 | M |
| GU-15 | Wave 5 niche (10 rows) | GU-12 | M |
| GU-16 | Licensed clips (only after decision 4) | GU-13 | L |

**GU-1 Library Wave 1.** Goal: "Around the World" and 12 very common moves behave exactly like comparable exercises. Files: `src/data/exercises.json` (18 rows, added only); `src/core/exercises.ts` (add ids only: `HIGH_DAMAGE_IDS` += Around the World dumbbell, Around the World lunges, Lateral Lunge); `src/brain/bodyweight.ts` (`BODYWEIGHT_SHARE` += Around the World lunges 0.88, Single-Leg Calf Raise 0.97, Around-the-World Pull-Up 1); `src/brain/coach/cues.ts` and `src/brain/units.ts` (plate fix only, 4.5 fix 1); `src/data/coachCues.json` (one `exerciseIds` coach cue each for the R2 rows: both halos, Lateral Lunge, Around the World lunges, Around-the-World Pull-Up); `tests/exercise-parity.test.ts` (new; 4.11 items 1-11). Acceptance:
- A1 `searchExercises('around the world')` returns exactly the 6 rows of 4.1.
- A2 `findExercise('around the world')` is undefined; `findExerciseExact('dumbbell circles')` is the lying dumbbell row.
- A3 `equipmentGroup('Plate') === 'Dumbbells'`; `equipmentGroup('Plate-Loaded / Machine') === 'Machine'`; the snapshot of all 153 existing rows is unchanged. Plate Halo's first load target (after its first logged session; before that `startingLoadKg('Plate')` gives no load, verified) and every later one is a real plate size (kg [1.25, 2.5, 5, 10, 15, 20, 25], lb [2.5, 5, 10, 25, 35, 45]), also when the gym has a "Dumbbells" group override; Kettlebell Halo keeps the dumbbell steps (decision 10).
- A4 Parity passes for all 171 rows.
- A5 The diff adds rows and Set ids only.
- A6 No duplicate id, name or alias.
- A7 Failure paths, shown failing in the PR: a row with muscle "pecs", a row with an unknown pattern, and a timed-hold row missing from `DURATION_NAMES` each make the parity test fail.
- A10 New rows have at least 1 alias (2 where real names exist, 4.4); Plate Halo has no bare "halo" alias.
- A8 `propose_custom_exercise` refuses every new name and alias.
- A9 Plate Halo (weighted) and Sit-Up (bodyweight) pass the per-mode probe (History, records, Body ready times, coach cue).

**GU-2 About sheet and content.** Goal: every library exercise has an About page. Files: `src/data/exerciseAbout.json` (171 entries), `src/core/about.ts`, `src/slices/workout/ExerciseAbout.tsx` and its lazy wrapper `aboutLazy.tsx` (5.11), `ExercisePicker.tsx` (info button), `Train.tsx` (one "About this exercise" button in the per-exercise sheet), `tests/exercise-about.test.ts`, `tests/today-isolation.test.ts` (5.9), `scripts/screenshot-gate.mjs` block GU-2, parity item 12. Acceptance:
- A1 Every library id has 3-4 steps (at most 120 chars each) and 1 tip (at most 140); no orphan ids; no emoji; adding a row without content fails the test.
- A2 The sheet shows other names (hidden if none), muscles, equipment, steps and tip.
- A3 A custom exercise (pattern `other` or `custom`) shows its fields and the "no steps yet" line without error.
- A4 The info button is 44 px and labelled; tapping it does not add the exercise.
- A5 Content sources are listed in section 9 of the in-repo copy of this doc. Steps and tips are written in our own words; no text is copied from sources (the repo is public).
- A6 If decision 9 is yes: the owner has approved the SPLIT 1 sample.
- A7 About content loads as its own chunk: no About step text in the main chunk (gate); the main chunk's size before and after is recorded in the PR and capped in block GU-2.
- A8 Failure path: a failed About chunk load shows "About could not load." with Reload; the picker and the session sheet stay open (test).
- A9 `tests/today-isolation.test.ts` passes, and fails in the PR when a Today file imports `ExerciseAbout`; the gate finds zero `.ex-info` on Today in all 5 themes.

**GU-3 Search helpers.** Goal: 4.7-4.10. Files: `src/core/exercises.ts` (`aliasHit`, `similarLibrary`), `ExercisePicker.tsx`, `ExerciseAbout.tsx` (`searchedFor` prop), `src/escobar/tools/actions.ts` (one extra `preview` row on the `propose_custom_exercise` card, `actions.ts:330-343`; no schema change), styles block GU-3, `tests/search-alias.test.ts`, a picker UI test. Acceptance:
- A1 `aliasHit`: "dumbbell circles" returns that alias; query "around the world" on Plate Halo returns "plate around the world"; "plate halo" returns null; empty returns null.
- A2 Only alias-hit rows get `alias-hit`; the pulse rule is scoped to `html:not([data-motion="reduce"])`, uses tokens, runs 3 times; the tokens test is unmodified.
- A3 The About header reads exactly `You searched “{q}”; it's also called {name}.`
- A4 A no-match query shows "Can't find it?" with both buttons when Escobar is on and online; with Escobar turned off (`escobar.enabled === false`), with `online.value === false`, and with `navigator.onLine === false`, only Create my own shows (one test each).
- A5 Ask Escobar calls `openAndSend` with the 4.9 text; `tests/escobar/tools-sync.test.ts` is unchanged and green.
- A6 A proposal via the mock transport applies, and Undo removes the custom exercise.
- A7 Name "dumbbell circles" in the custom form shows "This looks like Around the World (Dumbbell, Lying). Use it?"; Use adds it and creates nothing; Create mine anyway creates; a unique name shows no prompt. Name "Around the World" (no exact match) shows "This looks like one of these. Use it?" listing the 4 rows whose names start with it; an Escobar proposal named "Around the World" shows "Similar in the library:" with the same 4 names.
- A8 Failure path: an Escobar import failure shows the existing toast and the picker keeps its query.
- A9 Failure path: with the daily limit reached (`quotaResetAt` in the future), Ask Escobar shows the existing "resting" notice and the picker keeps its query.
- A10 Failure path: Undo after the new custom exercise was already added to a split leaves the split usable: it renders and starts with no crash, and the entry still shows its name.

**GU-4 Cardio.** Goal: rower, bike, treadmill and the rest log and show distance and time properly. Files: `exercises.json` (+11), `exercises.ts` (`CONDITIONING_NAMES`, `CARDIO_IDS` and `LOW_DAMAGE_IDS` += 11), `src/brain/history.ts` (shared helper), `progressTrend.ts`, `bodyweight.ts` (`lastTopStats`), `Body.tsx:361`, `Train.tsx:733-734` (distance box, min and s boxes) and `Train.tsx:690` ("Last:" hint), `src/core/parse.ts` (`parseMinSec`), the History editor (`History.tsx:179`), `src/brain/progression.ts` (cardio steps), `src/brain/exposure.ts` (`weeklyMuscleSets` skips cardio), `src/brain/prs.ts:41`, About content for 11 rows, `tests/parse.test.ts`, UI tests for both editors, parity item 8. Acceptance:
- A1 A pure distance/time treadmill history gives a non-zero, rising `progressValue` (fails on main, passes after).
- A2 History's last-top line and Body's muscle line show "5000 m" or "25:00", not "0 kg" or "0 reps".
- A3 Typing 5000 m is kept after blur; 100,000 is kept; 100,001 is rejected.
- A4 Min 45 and s 0 give 2700; min 90 and s 0 give 5400; s 60, total 0, "abc" and a total over 21,600 are rejected, and a rejected entry keeps the previous value (Train and History, UI tests); the History editor has the distance box and never writes 0 for a bad entry; Train's "Last:" hint shows "25:00" for 1500 s; hold inputs keep one seconds box and 3600. Real phone: both boxes open the number pad and an entry survives blur.
- A5 A longer treadmill distance gives a PR labelled "Furthest distance".
- A6 The 11 ids are in `CONDITIONING_NAMES` and `CARDIO_IDS` (parity table).
- A7 Cardio steps: a 5000 m best gives a 5100 m target; an 1800 s best gives 1860 s; a 1000 m best gives 1050 m; unloaded reasons have no "at the same load"; sled, carry and rep-based conditioning targets are unchanged (snapshot).
- A8 A lifting history plus 7 daily 60-minute walks gives the same quads, glutes and hamstrings volume status and weekly set counts as the lifting history alone; a walk still leaves a small (low-damage) recovery dose.

**GU-5 Warm-up logic and sheet.** Goal: Part 3 working with text. Files: `src/data/warmups.ts`, `src/brain/warmup.ts`, `src/brain/exposure.ts` (`plannedEmphasis`), `src/slices/workout/WarmupSheet.tsx`, `Train.tsx` (one row + sheet state in `PreSessionSheet`, and the "Warm up" button in the live session header, 6.4), `src/escobar/knowledge/methods.ts` (`warmup` text), styles block GU-5, `scripts/screenshot-gate.mjs` block GU-5, `tests/warmup.test.ts`. Acceptance:
- A1 A table over the 7 `SPLIT_TEMPLATES`, a SPLIT 1 fixture, an arms fixture and a custom split: the chosen regions equal the groups at or above 20% of the top, none dropped (full_a/full_b asserted explicitly); SPLIT 1 gives arms, back, shoulders, chest; the arms fixture (Dumbbell Biceps Curl plus Triceps Pushdown; none of the 7 templates is an arms day, verified) gives arms only.
- A2 First pass: one move per qualifying region, total at most 480 s; the round-robin adds moves only while the total is at most 360 s and 6 moves. A data test: each region move lasts at most 60 s with both sides counted, each raise move 90 s. The row's minutes come from the real total (6.2 step 5).
- A3 Same split and day give the same moves; a different day can rotate; no `Math.random` in the module.
- A4 Soreness 4-5 swaps loaded moves for mobility moves, each region keeps at least one, and no region is added.
- A5 No-muscle split gives raise only; an empty split shows no row.
- A6 The row renders when `preSessionInsights` returns 3 items (4-main-lift fixture).
- A7 Opening, skipping or finishing leaves AppState unchanged, and both exits land on Start.
- A8 Reduced motion shows no ring animation; `src/ui/motion.ts` is used; no new `matchMedia`.
- A9 The band swap is offered only with band/cable history at the active gym, never automatic; `byEquipment` is not read.
- A10 `explain_method('warmup')` covers both steps; `METHOD_IDS` and the tools-sync test are unchanged.
- A11 Every move's cue and safety line cites a section 9 source (a `source` note per move, checked by the data test) and is written in our own words; the decision 9 sample (the SPLIT 1 warm-up moves) is approved by the owner before merge.
- A12 A session started through `propose_start_session` (mock transport) shows the "Warm up" button in the live header; it opens `WarmupSheet`; it is gone once the first set is saved and after the warm-up was finished or skipped.
- A13 The gate finds zero warm-up rows on Today in all 5 themes; the main chunk's size before and after is recorded in the PR and capped in block GU-5 (5.11).

**GU-6 Form-guide data layer.** Goal: types, per-exercise machine map, coverage labels, resolver and ratchet, with no UI. Files: 5.3 data files except drawings and movements, `tests/form-guide-coverage.test.ts`, parity item 13, and a request to the supervisor for the `origin/main` fetch step in CI (5.3 growth rule). Acceptance:
- A1 Every library id has an explicit `machineMap` key (a machine id or `null`), or one of the unambiguous string defaults of 5.4; every mapped id exists in `machines.json`; with no drawings yet, all 31 machines (plus the Wave 1-2 machines: biceps_curl_machine and the 7 cardio machines) are in `PENDING_MACHINES`.
- A2 The 21 original "Machine" rows map to exactly 19 distinct ids of the 5.4 list (only pec_deck and hip_abduction_adduction are shared); Machine Biceps Curl (Wave 1) maps to `biceps_curl_machine`; Cable Fly, Low-to-High Cable Fly, High-to-Low Cable Fly and Cable Chest Press map to `cable_crossover`.
- A3 `PENDING_PATTERNS` holds all 32 patterns outside `SEQUENCE_ONLY_PATTERNS = ['conditioning']`; adding a movement file without removing its pattern fails; a new row with an unknown pattern fails; the 22 conditioning and cardio rows are in `PENDING_EXERCISES`.
- A4 `resolveGuide` returns `custom` for custom exercises, and ready only for a `same_as_pattern` row on a drawn pattern or a row with its own file.
- A5 Every library id has a label; the 5 Wave 1 R2 rows (Plate Halo, Kettlebell Halo, Lateral Lunge, Around the World Lunges, Around-the-World Pull-Up) are labelled `override`; Barbell Bench Press, Push-Up, Cable Chest Press, Upright Row, Pull-Up, Skull Crusher and Preacher Curl are labelled `override` (a different body position or path from the SPLIT 1 drawing of their pattern, 5.2); every other label is reviewed row by row and listed in the PR.
- A6 Failure paths, shown failing in the PR: a row with no label; a pending entry for a row that already existed on `origin/main`; a mapped machine id missing from `machines.json`.
- A7 The build output shows the main chunk unchanged.

**GU-7 Rig, player and the SPLIT 1 set.** Goal: the first animated guide, inside the About sheet. Files: `src/svg/formGuideRig.ts`, `src/ui/formguide/*` (except the machine components), `src/slices/formguide/lazy.tsx`, 8 movement files (horizontal_push, vertical_pull, incline_push, horizontal_pull, shoulder_abduction, horizontal_abduction, elbow_flexion, elbow_extension), overrides for the 8 SPLIT 1 exercises, `coverage.json` (every `override` row on the 8 patterns, including Plate Halo, Kettlebell Halo and Around-the-World Pull-Up, moves into `PENDING_EXERCISES`; drawing them waits for GU-10 so the pilot stays small), the `ExerciseAbout.tsx` mount, `tests/theme.test.ts` block GU-7, `scripts/screenshot-gate.mjs` block GU-7. Acceptance:
- A1 The 8 SPLIT 1 exercises resolve ready; the other rows on the 8 patterns (68 in all: 59 + 9 Wave 1 rows) resolve ready only if labelled `same_as_pattern`, otherwise pending and listed in `PENDING_EXERCISES` (so ratchet rule (c) passes, including for the 3 Wave 1 R2 rows); Barbell Bench Press resolves pending, never to the seated machine press; `PENDING_PATTERNS` shrinks by 8.
- A2 `poseSequence` with tempo [2,0,1,0] gives a 3 s rep; 3 reps take 9 s at 1x and 18 s at 0.5x.
- A3 With a Web Animations stub: Play runs 3 reps then holds; Pause freezes; 0.5x sets the rate; Replay restarts; unmount cancels all animations.
- A4 Each SPLIT 1 exercise shows Grip, Path and Feet or Seat; tapping pauses on its pose and shows the text; Path draws the trace.
- A5 Pictures shows 3 labelled poses; reduced motion shows Pictures only with zero `animate()` calls.
- A6 The SVG sources use only CSS variables: the GU-7 theme-test block checks `src/svg/formGuide*.ts` and `src/data/formGuide/**` by glob, so later drawings (GU-8 machines and on) are covered without editing this block; gate screenshots in Silent Black and Paper.
- A7 No formguide module in the main chunk; chunk size recorded; cap enforced.
- A8 Failure path: a failing chunk load shows "Demo could not load." with a Reload button in place of the player, never calls `onClose`, and the About sheet stays open and still shows steps (test).
- A10 The gate finds zero `.form-guide` elements on Today in all 5 themes.
- A9 Real phone: airplane-mode playback and smoothness on the owner's phone.

**GU-8 Machine guide for SPLIT 1.** Files: `src/svg/formGuideMachines.ts` (6 drawings), `MachineDiagram.tsx`, `MachineGuideSheet.tsx`, `machines.json` parts, the chip in `FormGuideSection`. Acceptance:
- A1 Each machine shows at least 3 labelled tappable parts with tips and one fault line.
- A2 Pec Fly and Rear Delt Fly open the same drawing with their own setup note.
- A3 Machine Chest Press and Incline Machine Press open different drawings.
- A4 `machineId` null shows no chip.
- A5 Reduced motion suppresses the part highlight.
- A6 `PENDING_MACHINES` shrinks by these 6; "See the machine" shows for them and stays hidden for pending machines.
- A7 The GU-7 theme-test glob covers `src/svg/formGuideMachines.ts` and fails on a hex colour (shown failing in the PR); a 360 px gate screenshot (block GU-8) of one machine in Silent Black and Paper shows no overlapping labels.

**GU-9 Warm-up demos.** Files: `src/data/formGuide/warmup/*.json` for the 20 warm-up-only moves, `exercises/lib_jumping_jacks.json` and `exercises/lib_high_knees.json`, `WarmupSheet.tsx` uses the player. Acceptance:
- A1 Each move has a warm-up file or a `demoExerciseId` that resolves through `resolveGuide`; a move whose library guide is still pending shows text only and must be on the allow-list in `tests/warmup.test.ts`, which may only shrink (empty after GU-10); a move with neither fails.
- A2 Reduced motion shows Pictures.
- A3 Failure path: if the chunk fails to load, the demo area shows "Demo could not load." with Reload, `onClose` is never called, and the Warm-up sheet stays open and usable in text (test).

**GU-10 Remaining shared movements.** The 24 patterns: squat, hip_hinge, vertical_push, chest_adduction, spinal_flexion, scapular_elevation, single_leg_squat, lunge, hip_extension, plantar_flexion, hip_flexion, anti_extension, shoulder_extension, knee_flexion, rotation, anti_rotation, shoulder_flexion, shoulder_external_rotation, wrist_flexion, knee_extension, hip_abduction, hip_adduction, anti_lateral_flexion, carry. Front view as well for squat, hinge and lunge families (knee tracking). Adds the override or posture variant for every row labelled `override` outside `SEQUENCE_ONLY_PATTERNS`, including the rows on the 8 SPLIT 1 patterns that GU-7 left pending and any Wave 3 rows that merged first with pending entries. Acceptance:
- A1 `PENDING_PATTERNS` is empty (conditioning is sequence-only, 5.3).
- A2 `PENDING_EXERCISES` holds only conditioning and cardio rows; every `override` row on a drawn pattern has its file.
- A3 One recorded spot check per pattern in the PR.
- A4 The warm-up text-only allow-list (GU-9 A1) is empty.

**GU-11 Remaining machines and one-offs.** Adds the other 25 of the 31 machine drawings (cable_crossover included), 7 cardio machines and the biceps curl machine, plus 11 conditioning and 11 cardio sequences (jumping jacks and high knees reuse GU-9 files), and any machine or sequence still pending from rows that merged first. Acceptance:
- A1 At GU-11's head (after merging `main`), `PENDING_EXERCISES` and `PENDING_MACHINES` are empty (`PENDING_PATTERNS` already is, GU-10). From here on a row can be pending only through the growth rule (5.3): added and listed in its own patch, visible in review.
- A2 A recorded device check of 3 cardio sequences.

**GU-12 Wave 3 (27 rows).** Depends only on GU-4 and GU-6 and may merge ahead of art patches (section 7). Each row arrives with About content, a coverage label, an explicit map entry, its override or a `PENDING_EXERCISES` entry (growth rule, 5.3), its machine drawing or a `PENDING_MACHINES` entry (triceps_extension_machine, belt_squat, ghd), and Set memberships per 4.3. Acceptance:
- A1 Parity and coverage pass; every new pending entry is a row or machine added in this patch.
- A2 `tests/escobar/actions.test.ts:67` uses a name that stays custom, and a new assertion checks that Zottman Curl is refused as existing.
- A3 The QA3-2 guard in `tests/migrate.test.ts:130-139` (a legacy "Cable Hammer Curl|Cable" key must not merge into the dumbbell `lib_hammer_curl`) keeps its meaning: the gap row's alias "cable hammer curl" makes that key map to the new row, which would still pass `not.toBe('lib_hammer_curl')` while no longer testing a gear mismatch. So the original assertions move to a name that stays custom and still has mismatched gear (for example "Machine Hammer Curl|Machine", asserting it is not `lib_hammer_curl` and one custom exercise is created), and a separate assertion checks that "Cable Hammer Curl|Cable" maps to the new row. Nothing is deleted or loosened.
- A4 Failure path, shown failing in the PR: a timed or carry row missing from its Set fails the parity test.

**GU-13 Guide screen and Escobar link.** Files: `src/slices/guide/Guide.tsx`, one row in `Settings.tsx`, `src/app/router.ts` (`exercise-guide`, required `exerciseId`), `src/escobar/palace/registry.ts`, minimal `App.tsx` wiring (supervisor-owned, called out in the PR). Acceptance:
- A1 The Settings row opens the Guide; the Machines tab lists every machine with its exercises.
- A2 `validatePanelParams` rejects a missing `exerciseId`.
- A3 A mock-transport Escobar turn with a navigate card opens the lat pulldown guide; the registry entry uses `tab: 'train'`, and a navigate started on Today switches to Train before the guide opens.
- A4 `tests/escobar/palace-anchors.test.ts` passes.
- A5 No worker change.
- A6 A search with no match shows a plain empty state ("No exercise matches.") in both tabs.
- A7 Real phone: in airplane mode the Guide screen, a movement and a machine drawing open and play.

**GU-14 Wave 4 technical lifts (optional).** The new `olympic_pull` pattern in `MAIN_PATTERNS` with coach cues and a front+side movement file, 9 rows, R2 overrides (Clean and Jerk, Muscle-Up, Turkish Get-Up). Depends on GU-12 only and may merge ahead of art patches (section 7); pending entries follow the growth rule (5.3). Acceptance: parity and coverage pass; the pattern and its cues ship in this one patch (R3); failure path shown failing in the PR: a row missing from its Set, or a new pending entry for a row that existed before this patch, fails.

**GU-15 Wave 5 niche (10 rows).** Same rules as GU-12, including the growth rule and a failure path shown failing in the PR (a row missing from its Set fails the parity test).

**GU-16 Licensed clips.** Only after decision 4. Acceptance: base APK and PWA size unchanged; a licence receipt per clip; real WebVTT captions; Wi-Fi-only blocks a mobile-data download (device check).

### 7.1 Task card GU-7a (AGENTS.md format)

This card is written for a builder agent on a lower model tier. Everything it needs is named here; when something is unclear it stops and asks the supervisor (AGENTS.md: after two failed tries of the same approach with no new evidence, stop and report).

- **id:** GU-7a
- **outcome:** In the app, the Machine Chest Press, Lat Pulldown and Dumbbell Lateral Raise each have a form guide that looks and moves like the approved demo (5.0 R1), opened from a "How to do it" row in the live-workout exercise Options sheet, in all 5 themes, offline, with the demo's controls.
- **base:** `origin/main` (at or after `5f282d7`). Own branch `claude/<name>`; never merge into or push to `main`.
- **depends_on:** none for building. Merging waits for owner checklist item 7.5 (section 1) and the supervisor.
- **read_first:** `AGENTS.md`; this document 5.0 (R1-1 to R1-14), 5.5-5.13 and section 7's "Every patch" rules; `docs/design/form-guide-demo/` on branch `claude/marc-form-guide-smoothness-fiuy2y` (`git show origin/claude/marc-form-guide-smoothness-fiuy2y:<path>`): `UPGRADE-BRIEF.md`, `spec.md` 2.x, 3.1, 3.2, 3.5 and 10, `rig-final/RIG.md` §8 and §20, `rig-final/gen.mjs`, `anim-machine-chest-press/build.mjs` (the chest press patches, including its `PACE`), `anim-dumbbell-lateral-raise/build.mjs`, `anim-lat-pulldown/gen.mjs` and `fit-motion.mjs`, `smooth-check.cjs`; in the app: `src/ui/primitives.tsx` (`Sheet`), `src/ui/motion.ts`, `src/theme/themes.ts`, `src/slices/share/lazy.tsx`, `src/slices/workout/Train.tsx` (`EntryCard` and its Options sheet), `tests/ui/styles.tokens.test.ts`, `tests/theme.test.ts`, `scripts/screenshot-gate.mjs` (one existing block, for the pattern).
- **write_scope:** `src/formguide/**` (new: `rig/`, `moves/`, `scenes/`, `player/`, `registry.ts`), `src/slices/formguide/lazy.tsx` (new), `scripts/formguide-fixture.mjs` (new), `src/data/muscles.ts` (add the `anatomical` and `action` fields only; keys never change), `src/slices/workout/Train.tsx` (the one row and the lazy sheet state only), `src/ui/styles.css` (one block marked GU-7a), `tests/formguide/**` (new), `scripts/screenshot-gate.mjs` and `tests/theme.test.ts` (add-only blocks named GU-7a).
- **reserved_paths:** `docs/design/form-guide-demo/**` (reference, read only), `src/core/models.ts`, `src/core/store.ts`, migrations, `package.json`, `package-lock.json`, `.github/**`, `escobar-worker/**`, `src/slices/today/**`, and the watch agent's files (AGENTS.md table).
- **acceptance** (each maps to a test, a gate probe or a recorded device check; failure paths shown failing in the PR):
  - A1 `sampleMove` for each of the 3 specs reproduces the demo's written stops: every channel at every stop equals the demo's value within 0.001 (degrees, scale or px) for the chest press (`anim-machine-chest-press/index.html`), the lat pulldown and the lateral raise (a test fixture extracted from the demo files at a named commit).
  - A2 The unit gates of 5.0 R1-5 pass for the 3 movements, with the same numbers as the demo's `shoot.cjs` runs (record them); failure path: a spec with `stops` at 1.25 % fails check (a).
  - A3 Truth ranges from spec.md 3.1, 3.2 and 3.5 pass; failure path: moving the chest press end grip 10 units further fails the pressed-elbow range.
  - A4 Player: Play runs 3 reps of 4 s (8 s at 0.5x) and holds the start pose; Pause freezes; Replay restarts; closing the sheet cancels every animation (Web Animations stub test plus a gate probe).
  - A5 Zoom chips (the demo's labels and captions for each exercise) keep the animation running; each subject stays inside the stage and above the bubble for the whole rep (gate probe, 41 phases, as the demo's `shoot.cjs`).
  - A6 Pictures shows the 4 demo tiles with their captions; reduced motion (`html[data-motion="reduce"]`) shows Pictures only, with zero `animate()` calls, and the hint names the reason.
  - A7 Colours are theme tokens only: the GU-7a theme-test block fails on any hex or rgb literal under `src/formguide/**` (shown failing in the PR); gate screenshots of each guide in all 5 themes at t = 0 and 0.25.
  - A8 The "How to do it" row shows only for the 3 exercises (a local `registry.ts`, replaced by GU-6's resolver later); other exercises show no row and no error.
  - A9 Failure path: a failed chunk load shows "Demo could not load." with a Reload button in the sheet and never closes the Options sheet (test).
  - A10 No formguide module in the main chunk; the form-guide chunk size (raw and gzip) and the main chunk before and after are recorded in the PR; the cap (150 KB gzip) is enforced in block GU-7a.
  - A11 The gate finds no `.form-guide` element on Today in all 5 themes.
  - A12 Real phone (owner): playback is smooth at 1x and 0.5x, and a guide opens in airplane mode.
  - A13 Muscle info on tap (R1-15, spec 2.10): for each of the 3 exercises every target and helper muscle has a hotspot of at least 44 x 44 px at t 0 and t 0.25; tapping shows the exact spec 2.10 line with the dot in the muscle colour and the outline on that region only; tapping again, the stage or a zoom chip closes it; `tests/formguide/muscles.test.ts` fails when a spec's muscles differ from `exercises.json` (shown failing in the PR by adding a fake helper); `src/data/muscles.ts` has `anatomical` and `action` for all 24 ids (a test checks none is empty).
- **design_reference:** the published demo page (the owner's link) and the demo files above at the commit named in the PR.
- **connectivity:** offline. Bundled lazy chunk; no network call.
- **verification:** `npm ci`, `npm run check`, `npm run test:tz`, `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`.
- **risk_and_recovery:** Web Animations on SVG transforms can differ between Chrome and Android WebView: the gate samples the live player and compares with the unit numbers; if they differ, keep the unit numbers and report. Low-end phones: sampling is measured (R1-3) and only one player runs at a time. Size: measured against the cap before merge. Theme contrast: the demo's contrast table is ported as a unit test. A failed movement check is fixed in the motion, never by a raised limit.
- **reference_values** (the numbers the 3 specs carry; read them from these places at the named demo commit, never from memory):
  - Machine Chest Press: the PLAYER's values, not the rig defaults. `anim-machine-chest-press/build.mjs` patches (`one()` calls): `P = [203.5, 58]`, `R = 100`, `X0 = 181`, `X1 = 226`, `E0 = [144.5, 166]`, `pole1 = norm([0, 0.95, 1])`, pole blend `w = p ** 4`, and its `PACE` array; `HALF = 13`, `Z1 = 6`, `FAR = [5, -3]`, `H = [150, 206]`; the scene markup and overlays from `anim-machine-chest-press/rig/gen.mjs` (the patched copy the build writes); chips, captions, `picsAt`, `tileBox`, arrows from the same file's `ex` object; truth ranges from `anim-machine-chest-press/shoot.cjs` (section 1) and `spec.md` 3.1.
  - Dumbbell Lateral Raise: `rig-final/gen.mjs` `lateralRaise()` with `anim-dumbbell-lateral-raise/build.mjs` patches applied: `A(p) = 12 + 76 p`, `BEND = 15`, `DROP`, `H = [179, 156]`, the dumbbell part, chips, captions, tiles; truth from its `shoot.cjs` and `spec.md` 3.5.
  - Lat Pulldown: `anim-lat-pulldown/gen.mjs`: `LP_OPT`, `GRIP_Z = 14`, the fitted motion constants that `fit-motion.mjs` wrote into `gen.mjs` (search "fit-motion"), `DEPTH_K`, `BAR_*`, `PF`, the lat facets, the `lp-*` channels; truth from its `shoot.cjs` and `spec.md` 3.2.
  - Shared: `SAMPLES` density rules, `n4` rounding, `minJerk`, `progress`, `pace`, `solve3`, `rigVars`, the part sets and paint from `rig-final/gen.mjs`; the smoothness limits from `smooth-check.cjs`.
- **build_steps** (in this order; each ends with the command that proves it; commit after each step that is green):
  1. `git fetch origin claude/marc-form-guide-smoothness-fiuy2y`; record its head hash as DEMO_COMMIT in the PR body. Read the read_first list. Run `npm ci`, `npm run check` on your fresh branch from `origin/main` (must be green before you touch anything).
  2. `scripts/formguide-fixture.mjs` (R1-11) and the 3 fixtures. Prove: the JSON has 36 groups for the chest press, 28 for the lateral raise and the lat pulldown's count, each with the demo's stop count.
  3. `rig/math.ts`, `rig/parts.ts`, `rig/paint.ts`, `rig/stops.ts` ported verbatim (keep the demo's function names; add types). Prove: `tests/formguide/rig.test.ts` recomputes `rig-final/poses.json`'s `chestPress.keyTable` and `lateralRaise.keyTable` rows from the ported functions (fixture copied from the demo at DEMO_COMMIT) and matches to 2 decimals.
  4. `moves/types.ts` and the 3 specs; `sampleMove()`. Prove: A1 fixture test green for all 3.
  5. `smoothNumbers` and the unit gates (R1-5) in `tests/formguide/gates.test.ts`. Prove: A2 and A3 green, with the failure paths shown failing once (stops at 1.25 %; end grip moved 10 units) and reverted.
  6. `scenes/*.ts` (`renderStage`). Prove: `tests/formguide/scene.test.ts` compares the markup with the demo's `index.html` stage at DEMO_COMMIT after stripping the harness-only `data-*` attributes and whitespace (same polygons in the same order).
  7. `player/*` and `src/slices/formguide/lazy.tsx`; styles block GU-7a (R1-12). Prove: `npm run typecheck`, `tests/formguide/player.test.ts` with a Web Animations stub (A4, A6, A9), `tests/ui/styles.tokens.test.ts` and `tests/theme.test.ts` green.
  8. The `Train.tsx` row (R1-7) and `registry.ts`. Prove: A8 test; `npm run build`; record chunk sizes (A10).
  9. Gate block GU-7a in `scripts/screenshot-gate.mjs` (A5, A7 screenshots, A10 cap, A11) and the theme-test block. Prove: `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` green, and `npm run check`, `npm run test:tz`.
  10. Open the draft PR (AGENTS.md body); stop.
- **stop_conditions:** a demo number you cannot find at the named path; a check that fails twice with the same fix; a needed edit outside write_scope; a size over the cap. Report to the supervisor with the exact file, line and numbers.
- **return:** a draft PR into `main` with the head commit, changed paths, evidence per criterion (A1-A12), what needs a real phone, open risks, and the measured sizes; then stop for the reviewer (a fresh agent; builders never approve their own work).

### 7.2 GU-7a split into parallel builder cards (owner, 2026-09-27: three coders in parallel)

GU-7a is built by three builders at once on disjoint paths, then integrated by a fourth card. Every sub-card inherits 7.1's base, rules, reserved_paths, verification and return, and the acceptance numbers below refer to 7.1's list. The builders are Opus 5.5 (7.2-1 at medium effort, the others at low). Each opens its own draft PR into `main` from its own `claude/*` branch; a fresh reviewer checks each PR against its card; nobody merges. The only shared file is the contract below, copied verbatim into every branch (identical content merges cleanly).

**The contract, `src/formguide/rig/api.ts` (copy verbatim; 7.2-1 implements it, 7.2-2 consumes it, 7.2-3 uses `MuscleId`):**

```ts
// The contract between the rig (GU-7a-1), the player (GU-7a-2) and the muscle data (GU-7a-3).
// Every number a Guide returns is the demo's (docs/design/form-guide-demo at DEMO_COMMIT).
import type { MuscleId } from '../../data/muscles';

export type View = 'side' | 'front' | 'top';
export type Scheme = 'dark' | 'light';

/** One Web Animations keyframe. `offset` is 0..1 of the 4 s rep; values are the demo's 4-decimal strings. */
export type Frame = { offset: number; transform?: string; opacity?: number; strokeDashoffset?: number };
/** Keyframes for one animated group, found in the stage markup by `className` (the demo's class, e.g. "cp-ua"). */
export type GroupFrames = { className: string; frames: Frame[] };

export type ZoomChip = { id: string; label: string; caption: string };
export type MuscleRole = 'target' | 'helps';

export type MoveSpec = {
  id: string;                     // demo id: 'cp' | 'lp' | 'lr'
  exerciseId: string;             // library id, e.g. 'lib_machine_chest_press'
  view: View;
  cam: string;                    // camera label, e.g. 'Side view'
  rep: number;                    // seconds per rep (4)
  caps: [string, string, string, string];
  tempo: string;                  // e.g. '1 s out · 2 s back'
  picsLine: string;
  srText: string;
  chips: ZoomChip[];              // 3
  pics: [string, string, string, string];
  picsAt: [number, number, number, number];
  /** rig region name -> muscle id, for the painted target and helper regions; roles come from the exercise row */
  roles: Record<string, MuscleId>;
  muscleNotes?: Partial<Record<MuscleId, string>>;
};

export type Stage = {
  svg: string;     // the stage <svg> inner markup: the rig group, overlays, guides; ids and classes as in the demo
  tiles: string;   // the 4 Pictures tiles markup
  css: string;     // exercise-specific static CSS: zoom camera transforms, overlay visibility, static part transforms
};

export type Sample = { stops: number[]; groups: GroupFrames[] };

export interface Guide {
  readonly spec: MoveSpec;
  /** the same values the demo writes into @keyframes, one entry per animated class */
  sample(): Sample;
  /** markup and CSS for the given scheme (dark or light); no hex colours, tokens only */
  stage(scheme: Scheme): Stage;
  /** the rig's derived colour tokens for the scheme, as a style string (rigVars) */
  rigVars(scheme: Scheme): string;
}

/** the paint every Guide shares: figure, equipment, guide and overlay classes (the demo's BASE_CSS minus the player chrome and the CSS-animation classes) */
export declare const RIG_CSS: string;
```

**GU-7a-1 Rig, movements, scenes, fixture, gates** (Opus 5.5, medium). write_scope: `src/formguide/rig/**`, `src/formguide/moves/**`, `src/formguide/scenes/**`, `scripts/formguide-fixture.mjs`, `tests/formguide/{rig,fixture,gates,scene}.test.ts`, `tests/formguide/fixtures/**`. Build steps 1-6 of 7.1 and the R1-5 gates; `src/formguide/index.ts` exporting `guides: Record<string, Guide>` keyed by exercise id for the 3 moves. Acceptance: A1, A2, A3 and 7.1 step 3's `rig.test.ts`; plus every `Guide.stage()` string contains no `#[0-9a-f]{3,6}` or `rgb(` outside `RIG_CSS`'s token block. No UI, no styles.css, no Train.tsx.

**GU-7a-2 Player, sheet, styles, host row, gate** (Opus 5.5, low). write_scope: `src/formguide/player/**`, `src/formguide/registry.ts`, `src/slices/formguide/lazy.tsx`, `src/slices/workout/Train.tsx` (the one row and the lazy sheet state only), `src/ui/styles.css` block GU-7a, `tests/formguide/player.test.ts`, `scripts/screenshot-gate.mjs` block GU-7a, `tests/theme.test.ts` block GU-7a. Until 7a-1 merges, the player is built against `api.ts` with a stub Guide in `src/formguide/player/stubGuide.ts` (a 4-polygon figure, 2 groups, 5 stops; deleted by 7a-4) so tests and the gate run. Acceptance: A4-A9, A11, A13's interaction part (hotspot, bubble, outline, exclusivity; text from 7a-3's helper, stubbed until it merges), the styles and theme lints green.

**GU-7a-3 Muscle names and lines** (Opus 5.5, low). write_scope: `src/data/muscles.ts` (add `anatomical` and `action` per id; keys never change), `src/formguide/muscles.ts` (`muscleInfo(exerciseId, notes?)` -> `{ id, common, anatomical, role, line, colorVar }[]` from the exercise row's `primary`/`secondary`), `src/formguide/muscleNotes.ts` (the 3 demo exercises' lines from spec 2.10), `tests/formguide/muscles.test.ts`. Acceptance: A13's data part: all 24 ids have non-empty `anatomical` and `action`; the 3 demo exercises return spec 2.10's exact lines in order (target first); an unknown exercise id returns `[]`; a custom exercise (`custom: true`) returns its listed muscles with generic lines.

**GU-7a-4 Integration** (Opus 5.5, medium; starts when 7a-1, 7a-2 and 7a-3 are green and reviewed). On a new branch that merges the three branches (merge commits, no rebase): delete the stub Guide, wire `guides` into `registry.ts`, run the fixture script at DEMO_COMMIT and commit the fixtures, connect `muscleInfo` to the bubble, measure sizes (A10), run the full verification and the real gate, and open the PR that carries all of GU-7a's evidence (A1-A13). This is the PR the supervisor merges; the three part PRs close when it merges.

## 8. Risks and mitigations

| Risk | Mitigation |
|---|---|
| A new id misses its Set, so a treadmill silently becomes kg x reps. There is no compiler guard. | Parity expected-mode table (4.11 item 3) plus the per-mode probe. |
| The plate fix changes an existing classification. | Snapshot of `equipmentGroup` for all 153 rows (GU-1 A3). |
| Shared bare aliases ("around the world") make lookups ambiguous. | Zero-duplicate-alias test; halos use distinct aliases (4.1). |
| Existing tests use names that become library exercises (Zottman Curl in `tests/escobar/actions.test.ts:67`; Cable Hammer Curl in `tests/migrate.test.ts:130-139`). Rewriting an expectation to the new id would keep the test green but drop its guard. | Move each guard to a name that stays custom and still tests the same mismatch, and add a separate assertion for the new mapping; never delete or loosen one (GU-12 A2-A3). |
| Old-app imports map to new library rows as the library grows. | Intended and more accurate; called out in the PR; migrate test tightened. |
| Editing an Escobar tool schema or MethodId forces an owner-deployed worker change. | No schema, description or MethodId changes; validation stays client-side; the tools-sync test must stay unchanged. |
| The warm-up entry is hidden by the 3-insight cap. | The row renders outside the capped list (GU-5 A6). |
| The warm-up drops a region the split trains. | Threshold-only selection with time cap and tests on full_a, full_b and SPLIT 1. |
| Wrong form or warm-up text risks injury and trust. | Named sources, an owner sample check (decision 9), plain external cues, conditioning drawn per exercise, and optional clips for technical lifts. |
| Drawing effort is large (32 movements plus posture variants, 31 machines). | Pilot on SPLIT 1 with an owner verdict; posture variants shared across rows; library waves depend only on GU-4/GU-6 and may merge ahead of art, and the growth rule (5.3) lets only new rows enter the pending lists, so art lands in slices without blocking rows; pending exercises still show text. |
| Distinct machines forced onto one drawing. | Per-exercise map with an explicit key for every library id, mapped ids checked against `machines.json` and `PENDING_MACHINES` (5.3 rules (e)-(f), GU-6 A1-A2). |
| An exercise shows another exercise's demo (Bench Press shown as a seated machine press). | Every row carries a reviewed `same_as_pattern` or `override` label; unlabelled rows fail; `override` rows stay pending until their own file lands (5.2, 5.3, GU-7 A1). |
| A failed demo or About chunk load closes the sheet the user is in. | The form-guide and About wrappers never call `onClose`; they show one line with Reload; tested (GU-2 A8, GU-7 A8, GU-9 A3). |
| Cardio inflates weekly hard sets and recovery (a daily walk read as a hard leg set). | Cardio ids in `LOW_DAMAGE_IDS`; `weeklyMuscleSets` skips `CARDIO_IDS`; 7-walks test (4.5 fix 5, GU-4 A8). |
| Cardio targets use sled-sized steps (+10 m on a 5000 m row). | Cardio-sized steps for `CARDIO_IDS` with a snapshot that sled and carry targets are unchanged (GU-4 A7). |
| Plate targets land on sizes that do not exist (6 kg, 12.5 kg). | Plate ladder of real plate sizes, also past a gym's Dumbbells override (4.5 fix 1, GU-1 A3). |
| Jank or battery drain on budget phones. | Transform-only, one player, 3-rep bound, cancelled on close, real-phone check. |
| Bundle growth, including the main chunk (`App.tsx` imports `Train` directly). | Form guide and About content as lazy chunks; GU-2, GU-5 and GU-7 record the main chunk and cap it in their gate blocks (5.11). |
| Endless or unwanted motion. | No `infinite`; the tokens test is unchanged; reduced motion gives Pictures. |
| Theme drift (hex colours in SVG). | `tests/theme.test.ts` add-only block. |
| Feature creeps onto Today. | Direct-import test (`tests/today-isolation.test.ts`), gate probes for `.ex-info`, warm-up rows and `.form-guide` on Today in all 5 themes, and the Escobar guide entry on `tab: 'train'` (5.9). |
| A session started by Escobar skips the warm-up. | "Warm up" button in the live session header until the first set (6.4, GU-5 A12). |
| A custom exercise duplicates a library exercise under a near name ("Around the World"). | Near-match prompt in the custom form and a "Similar in the library" line on Escobar's proposal card (4.9, 4.10, GU-3 A7). |
| Copied how-to text in a public repo. | Steps, tips and warm-up cues written in our own words, with sources listed (decision 9, GU-2 A5, GU-5 A11). |
| Long cardio values silently cleared by old caps (1000 m, 3600 s), or a bad History entry saved as 0. | Raised for conditioning only in GU-4; min and s boxes on the number pad; an invalid entry keeps the previous value; boundary and UI tests plus a real-phone check (GU-4 A3-A4). |
| A custom exercise has no pattern-based guide. | Resolver status `custom`, tested. |
| Merge conflicts across parallel lanes in shared files. | Add-only task blocks in the shared test and gate files, one styles block per patch, and merges in list order. |
| After release, a regression in logging or progression from new rows. | Additive-only data; one-PR revert with no migration; the whole-library parity suite runs in every CI build. |

Reviewer catches applied (never repeated): the `equipmentGroup` reorder does not fix "Plate" (4.5); role is decided by pattern, not mode (4.2, 4.4); the 1000 m distance cap (4.5); "Machine" cannot key machines (5.4); conditioning is not poseable as one pattern (5.2, 5.13); the 760 KB figure had no source (5.11); reduced motion runs through `motion.ts` and `data-motion` (5.7, 6.4); the ALLOW list framing (5.12); the 3-region warm-up cap (6.2); the warm-up insight truncation (6.4); `byEquipment` is not an inventory (6.2); unsourced dosage (6.3, section 9). New catches in this document: the "3 implement rows" Around the World design (4.1); the gap list's cardio "duration" mode and 3-way compounds (4.3); the 3600 s seconds cap (4.5); new MethodIds and schema edits force worker deploys (4.9, 6.7). Second review, applied: one drawing per pattern cannot serve every row on it (5.2, 5.3); conditioning has no pattern file (5.3 rule (a)); Wave 1 R2 rows on SPLIT 1 patterns (GU-6, GU-7); art blocked new rows (section 7, 5.3 growth rule); the share loader closes its sheet on failure (5.2); plates got dumbbell steps (4.5 fix 1); sled-sized cardio steps (4.5 fix 4); "45:00" cannot be typed in a number box (4.5 fix 3); cardio counted as hard sets (4.5 fix 5); no warm-up for Escobar-started sessions (6.4); the Today check and the Escobar tab (5.9); near-duplicate custom names (4.9, 4.10); Ask Escobar ignored the on/off setting (4.8); main chunk growth (5.11); machine map gaps (5.3, 5.4); a test rewrite that would drop a guard (GU-12 A3); warm-up time and arms-day gaps (6.2, GU-5).

## 9. Sources

Rendering, size, accessibility and offline:
- https://github.com/airbnb/lottie-web/issues/1184
- https://bundlephobia.com/package/lottie-web
- https://www.npmjs.com/package/lottie-colorify
- https://github.com/lottiefiles/dotlottie-web
- https://github.com/LottieFiles/dotlottie-web/issues/357
- https://developers.lottiefiles.com/docs/tools/dotlottie-js/theming/
- https://developers.lottiefiles.com/docs/dotlottie-player/dotlottie-android/usage/theming/
- https://dotlottie.io/spec/2.0/
- https://rive.app/docs/runtimes/web/faq
- https://pixelpoint.io/blog/rive-react-optimizations/
- https://rive.app/docs/editor/data-binding/overview
- https://rive.app/blog/getting-started-with-data-binding
- https://www.callstack.com/blog/lottie-vs-rive-optimizing-mobile-app-animation
- https://discourse.threejs.org/t/three-js-file-size-when-importing-via-webpack/8904
- https://www.utsubo.com/blog/threejs-best-practices-100-tips
- https://dev.to/evilmartians/faster-webgl-three-js-3d-graphics-with-offscreencanvas-and-web-workers-43he
- https://www.svgator.com/blog/why-use-svg-animations/
- https://www.zigpoll.com/content/how-can-i-optimize-svg-animations-to-run-smoothly-on-both-desktop-and-mobile-browsers-without-significant-performance-loss
- https://www.jointjs.com/blog/svg-versus-canvas
- https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs
- https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html
- https://aaardvarkaccessibility.com/wcag-plain-english/1-2-1-audio-only-and-video-only-prerecorded/
- https://jaconir.online/blogs/sprite-sheet-animation-guide
- https://github.com/ionic-team/capacitor/discussions/3205
- https://web.dev/learn/pwa/caching
- https://csswizardry.com/2026/07/low-and-mid-tier-mobile-for-the-real-world-2026/
- https://en.wikipedia.org/wiki/Android_Go

Licensing (as cited by the research; full URLs were not recorded): Pond5 licence page "pond5.com/our-licenses"; Adobe Stock perpetual-licence terms from Adobe help and community pages (no URL recorded, unverified here).

Warm-up science and app practice:
- https://blog.teambuildr.com/understanding-and-implementing-the-ramp-protocol
- https://gcperformancetraining.com/gc-blog/rampwarmupmobilityflow
- https://www.thirdspace.london/this-space/effective-warm-ups/
- https://www.ptpioneer.com/personal-training/certifications/nsca-cscs/cscs-chapter-14/
- https://pubmed.ncbi.nlm.nih.gov/21373870/
- https://pubmed.ncbi.nlm.nih.gov/31567839
- https://www.sciencedirect.com/science/article/pii/S2095254624000693
- https://pmc.ncbi.nlm.nih.gov/articles/PMC13210987/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9140806/
- https://fitbod.me/blog/warmup-cooldown/
- https://help.fitbod.me/hc/en-us/articles/360006337634-Warm-Up-Sets
- https://www.hevyapp.com/warm-up-sets/
- https://www.hevyapp.com/features/warm-up-set-calculator/
- https://www.jefit.com/blog/set-types-new-in-jefit-customize-your-workouts-with-set-types/

Earlier form-guide draft (superseded by this file): https://github.com/macdarenz-droid/M-arc/pull/28

How-to step content sources: none chosen yet. GU-2's builder adds them here before its content merges.
