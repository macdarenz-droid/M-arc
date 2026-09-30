# Library How-to, design B: per-exercise authoring in parallel batches

Date 2026-09-30. Status: architecture only. Nothing in any repo was changed.
Base: main `cae1725` (HT-1, HT-2 merged). Golden A `bc0f378` (page `e2bea90c…`). Golden B `b3a90af` (page `5aab1aca…`).
Inputs: `census.md`/`census.json`, `pipeline.md`, `content.md` (this folder), the HT plan and cards, GA, golden B, engine `SPEC.md`, main's `tools/plates/`, `tests/howto/`, `src/howto/` and `.github/workflows/build-apk.yml`.
Batch lists are checked by `dbatch.py` in this folder (every one of the 145 new ids is used exactly once; 47 tier-A ids).
Numbers marked **measured** come from those files. **est.** marks my arithmetic or judgement.

---

## 0. In plain words

- **Every exercise gets its own hand-tuned plate and its own sheet, like the first 8.** No shortcuts on drawing or on facts.
  What we share is the tooling: one engine, one close-up renderer, one set of checks, and the research on grips and joints.
- **Engine work comes first, for about a week.** It adds the missing equipment drawings, body positions and hand drawings.
  Every engine change must rebuild your 8 approved plates byte for byte, so nothing you approved can move.
- **Then 11 batches of 8 to 18 exercises.** Each batch goes through automatic checks, an independent critic and then one contact sheet from you.
  You approve the plates, so about 11 sheets in total, roughly one every 2 days.
- **Nothing is excluded up front.** Five exercises carry a real risk that the engine can't draw them at the approved quality
  (Russian twist, bicycle crunch, dumbbell fly, bent-over rear-delt fly, side plank). Spikes in the engine week settle each one.
  If one can't reach the bar, you decide what happens to it early on, with pictures, before the store build.
- **Batches reach your phone as they land.** The "How to do it" button appears only for exercises whose plate and sheet are both approved.
  The Play Store build waits for the whole library, as you asked.
- **Honest effort:** about 1,300 agent-hours (est.), 45 PRs and about 14 short sessions for you.
  Calendar time is about 5 weeks after the current How-to work (M1) is finished: best case 3.5 weeks, bad case 8.
  What sets the pace is your contact sheets and rework rounds, not agent capacity.

---

## 1. Scope

### 1.1 Target: all 153

| Group | Ids | What they get |
|---|---|---|
| Approved (golden A + B) | 8 | Unchanged, byte-locked (L0-L4 on every push) |
| Tier 1 in census (standard plate fits) | 107 new | Full How-to: plate (Trace, Mistake, tells, tempo) + all golden-B layers |
| Tier 2 (fits after a per-exercise decision) | 26 new | Full How-to. Each decision is written in the batch design note and shown on the contact sheet (1.3) |
| Tier 3 (plate concept strained) | 12 new | Full How-to planned. 9 use a "one stroke" plate and 3 need the lean/yaw engine work (1.3). Each has a go/no-go |
| Custom exercises (`custom: true`) | user-made | Never. No button. Library advice could be wrong for a user's own movement, and a link to a library guide would be new saved data (owner approval) |

The library has no stretches or mobility drills (census 6), so no id is out of scope by type.

### 1.2 Order: 11 delivery batches

The batch order puts pipeline calibration first, then batches in order of engine readiness.
It is not ordered by risk: the riskiest content (tier A) gets the safety checker in every batch.
Every family parent is in the same batch as its children or an earlier one (checked against content.md appendix A).
`smith_machine_shrug` sits with the shrugs (D5) and `bench_dip` with the push-ups (D9) for that reason.

| Batch | Ids | Tier A | Needs from the engine phase | Members |
|---|---|---|---|---|
| **D1 Pilot: close to the approved** | 15 | 4 | none for plates (14 R1, 1 R2); layers need E1 | chin_up, hanging_knee_raise, close_grip_pulldown, underhand_lat_pulldown, straight_arm_pulldown, incline_machine_press, shoulder_press, horizontal_leg_press, leg_press_calf_raise, barbell_overhead_press, triceps_pushdown, straight_bar_triceps_pushdown, single_arm_triceps_pushdown, dumbbell_biceps_curl, upright_row |
| D2 Bench and overhead presses | 16 | 16 | E2 (Smith, dip bars, incline and decline bench), E3 (lying contact), E5 (dumbbell-fly view spike) | dumbbell_bench_press, barbell_bench_press, incline_dumbbell_press, incline_barbell_bench_press, decline_bench_press, close_grip_bench_press, smith_machine_bench_press, smith_machine_incline_press, smith_machine_shoulder_press, smith_machine_squat, dumbbell_shoulder_press, arnold_press, skull_crusher, dumbbell_pullover, dumbbell_fly, weighted_dip |
| D3 Rows and pulls | 12 | 5 | E2 (landmine, rope, band, assist and chest-row machines), E3 (hinge, kneel, floor sit), E4 (lean; yaw for the one-arm row fault), E6 (band hand), E7 (back box) | assisted_pull_up, inverted_row, single_arm_lat_pulldown, chest_supported_row, resistance_band_row, barbell_row, pendlay_row, one_arm_dumbbell_row, t_bar_row, landmine_row, face_pull, resistance_band_pull_apart |
| D4 Arms | 15 | 2 | E2 (rope, preacher pad, incline bench, EZ bar), E5 (small-motion zoom for wrist curl), E6 (rope in the fist, cupped hold; curl archetype data) | rope_triceps_pushdown, overhead_cable_triceps_extension, dumbbell_overhead_triceps_extension, alternating_dumbbell_curl, barbell_curl, ez_bar_curl, hammer_curl, cross_body_hammer_curl, cable_curl, bayesian_cable_curl, reverse_curl, preacher_curl, incline_dumbbell_curl, concentration_curl, wrist_curl |
| D5 Shoulders, flyes, shrugs | 18 | 1 | E2 (pec deck, lat-raise and hip machines, Smith), E5 (seated front view with pivot arms, bent-over spike, small-motion zoom) | cable_chest_press, cable_fly, low_to_high_cable_fly, high_to_low_cable_fly, pec_fly, rear_delt_fly, machine_lateral_raise, cable_lateral_raise, dumbbell_front_raise, cable_rear_delt_fly, bent_over_dumbbell_rear_delt_fly, cable_external_rotation, dumbbell_shrug, barbell_shrug, cable_shrug, smith_machine_shrug, hip_abduction, hip_adduction |
| D6 Squats and lunges | 14 | 5 | E2 (wall), E3 (split, single leg, airborne), E6 (front rack, cupped hold) | front_squat, goblet_squat, box_jump, bodyweight_squat, jump_squat, wall_sit, bulgarian_split_squat, walking_lunge, reverse_lunge, forward_lunge, step_up, bodyweight_lunge, bodyweight_split_squat, pistol_squat |
| D7 Hinges and glutes | 11 | 8 | E2 (roman chair, kettlebell, ankle cuff), E3 (hinge, bridge), E4 (yaw for the single-leg RDL fault), E6 (kettlebell hands), E7 (back box) | romanian_deadlift, dumbbell_romanian_deadlift, single_leg_romanian_deadlift, conventional_deadlift, sumo_deadlift, back_extension, kettlebell_swing, hip_thrust, glute_bridge, cable_kickback, resisted_hip_flexion |
| D8 Leg and trunk machines | 11 | 0 | E2 (leg-extension, leg-curl, calf, pullover and crunch machines, hack sled, pendulum), E3 (prone) | machine_pullover, machine_crunch, hack_squat, pendulum_squat, leg_extension, seated_leg_curl, lying_leg_curl, standing_leg_curl, seated_calf_raise, standing_calf_raise, bodyweight_calf_raise |
| D9 Push-ups and floor core | 13 | 2 | E3 (plank, supine, prone), E4 (yaw for the renegade-row fault), E6 (palm-flat) | push_up, incline_push_up, diamond_push_up, pike_push_up, renegade_row, bench_dip, crunch, reverse_crunch, dead_bug, v_up, flutter_kicks, hollow_body_hold, superman |
| D10 Holds and rotation | 8 | 1 | E2 (ab wheel, rope), E3 (quadruped, kneel), E4 (lean for side plank; yaw spike), E7 (feel state) | plank, side_plank, ab_wheel_rollout, bird_dog, cable_crunch, pallof_press, russian_twist, bicycle_crunch |
| D11 Conditioning and carries | 12 | 3 | E2 (sled, rope, jump rope, battle rope, medicine ball, wall), E6 (ball, implements) | sled_push, sled_pull, farmer_s_carry, burpee, mountain_climbers, jumping_jacks, high_knees, jump_rope, battle_ropes, medicine_ball_slam, wall_ball, bear_crawl |

**Why D1 is the pilot:**
- It uses only proven poses and existing primitives, so it can start as soon as the core lands.
- It calibrates the whole pipeline (card, plate, lint, critic, sheet, layers, CI, phone) on work close to the approved 8.
- It carries three fidelity checkpoints the rest depend on:
  - `dumbbell_biceps_curl` is the first approved plate that uses the engine's `dumbbell` primitive (28 new ids depend on it; the approved lateral raise is hand-drawn in `ref-src`);
  - `upright_row` is the first engine-drawn front-view plate (22 new ids are front view, and today front view is proven only by the hand-drawn lateral raise). Barbell front view is unverified; if it fails the bar, the anchor switches to the cable version the data also lists;
  - `barbell_overhead_press` is the first standing overhead press (probe E).
- The planned HT-12 "presses batch" (plan 4.2) is replaced by D2 plus the push ids spread over D1, D4, D9, D10 and D11.

### 1.3 Ids at risk, and how each is settled

Nothing is excluded now. Each risk has a named test and an early decision point: the end of the engine phase, about day 7.
It never waits until the end.

| Risk | Ids | Test | If it fails |
|---|---|---|---|
| Trunk yaw (the movement *is* rotation) | russian_twist, bicycle_crunch | E4 spike: trunk yaw as an opt-in pose field. An arm-only approximation is rejected on purpose: arms-only twisting is the classic Russian-twist fault, so drawing it as "right" would teach the mistake | Owner decision (below) |
| Body roll | side_plank | E4: root lean (rotation about the front-back axis) in front view. This is an in-plane rotation of a front-view figure, so low risk (est.) | Owner decision |
| View conflict | dumbbell_fly (lying; the arc is only visible end-on), bent_over_dumbbell_rear_delt_fly (hinged trunk in front view is a foreshortened outline, SPEC 8) | E5 spike: an end-on lying silhouette and a hinged front-view silhouette, judged by the plate critic against the approved 8 | Owner decision |
| Faults that need roll or yaw | single_arm_lat_pulldown (lean), one_arm_dumbbell_row, renegade_row, pallof_press, bird_dog, single_leg_romanian_deadlift | Same E4 work | The plate shows the card's next most common *drawable* fault, and the card says so. It never shows a weaker fault silently |
| Cyclic, travelling or multi-phase | sled_push, sled_pull, farmer_s_carry, burpee, mountain_climbers, high_knees, jump_rope, battle_ropes, bear_crawl | Concept proof in the engine phase: a "one stroke" plate (below) for mountain_climbers and farmer_s_carry, shown to the owner as a concept question | Owner decision per id |

**Tier-2 and tier-3 plate conventions** (proposals; each batch design note confirms them per id, and the owner sees them on the sheet):
- **Isometric** (plank, wall_sit, hollow_body_hold, pallof_press, side_plank): the plate draws setup into the hold (for example, knees down into the plank). Trace follows the point that moves into position, and the tempo reads "Set / Hold".
- **One stroke** (the cyclic, travelling and ballistic moves): start and end are one half-cycle or one stride. The spec's optional `via` pose covers a third frame (burpee: stand, squat, plank). Trace follows the driving point, the tempo is per stroke, and the plate teaches the posture the whole set keeps.
- **Small motion** (4 shrugs, wrist_curl): a zoomed camera (`camera.maxScale`, already in the engine). The alt text says it is enlarged, and the plate lint exempts it by name (3.3).
- **Airborne** (jumping_jacks, box_jump, jump_squat): takeoff or landing frames only. The landing checkpoint has its own source (content.md 5.2).

**Owner decision when a test fails** (one question per id, with the spike's pictures). Options:
- (a) approve the best plate that is achievable;
- (b) leave it out: no button, with the reason recorded;
- (c) a sheet without a plate. This is plan O8 "Level 1"; it needs a one-time golden-B design approval, so it is only built if he picks it.

`coverage.ts` holds each id's status (`queued | researching | drafting | approved | left-out:<decision id>`).
The release-candidate check (C6, add-only) fails if any id is neither `approved` nor `left-out` with an owner decision id. So nothing is dropped silently.

### 1.4 What an id without a How-to shows

It shows what it shows today: the exercise with no "How to do it" button. There is no "coming soon" and no partial sheet.
The same rule covers custom exercises and any owner-approved left-out id.
The gate's negative control stops depending on `lib_barbell_bench_press` (plan A5/R17). It becomes a seeded custom exercise, which is permanent, plus the first `queued` id in `coverage.ts` while any remain. So D2 does not have to switch the control.

---

## 2. Engine work first

### 2.1 The rule for every engine change

- **Additive and opt-in.** New primitives, new pose fields, new helpers and new views are only used when a spec asks for them. When a field is absent, the old code path runs unchanged. That way the approved bytes cannot move.
- **Proof on every engine PR (`[golden update]`, plan 2.8):**
  - golden A rebuilds to `e2bea90c…`;
  - golden B rebuilds to `5aab1aca…`;
  - every approved library batch page rebuilds to its pinned sha;
  - every ref-fixture is unchanged.

  Because nothing approved changes, no owner review is needed for the engine itself. Its drawings reach the owner through the first plate that uses them.
- **Where it is authored:** on the golden branch `claude/howto-options` (a docs-only folder; the supervisor pins the commit, as plan 2.8 step 4 requires). It is then vendored into main verbatim, with new MANIFEST pins. LIB-0 makes the allowed source refs data, not the hard-coded `bc0f378|1a1e33b` regex.
- **Reference fixtures:** each new primitive, pose field and view gets one engine test fixture (like `_test_side`/`_test_front`), pinned by sha. This proves the path stays unchanged even before any approved plate uses it.
- **Byte-identity mutation check** in each engine PR: flip the new code path on for one of the 8 and show that L1 fails.

### 2.2 Engine cards and what each unlocks

Counts are new ids, from census 4. An id can need several cards.

| Card | Work | Unlocks | Model, size |
|---|---|---|---|
| **E1 Shared close-up renderer** (golden-B update) | Replaces the 8 per-exercise render scripts with one data-driven renderer for hand zooms, posture crops and the feel map. Today those scripts are 29-44 KB each, in two diverged families that share 53-62 % and 13-15 % of their lines (pipeline 3). Bespoke bits that can't be data (end-on inset, `hookThumb`, `fingerBaseMarks`) become named, reusable hook modules. The layer page builder takes a batch list. **Proof: golden B rebuilds to `5aab1aca…` (0 px).** | All 145 sheets. It removes about 5.4 MB of hand-written copy-paste code (145 × 37.3 KB avg, est.) | Opus, L, design note |
| **E2 Equipment** | *New primitives (engine):* Smith machine (5), cable rope (5: rope pushdown, overhead cable extension, face pull, cable crunch, sled pull), landmine or T-bar (2), sled (2), kettlebell (1, plus goblet's alternative), dip bars (1). *Kit compositions* from existing parts, in a shared `tools/plates/library/kit/` module, no engine change: incline/decline bench (8), leg-curl machine (3), pec deck (2), hip ab/adduction machine (2), calf machines (2), ankle cuff (2), band (2), medicine ball (3), wall (2), and one each: lat-raise machine, assist machine, chest-row machine, pullover machine, preacher pad, leg-extension machine, crunch machine, ab wheel, roman chair, hack sled, pendulum arm, jump rope, battle rope. *Parameter proofs:* single cable handle (11), straight bar (5), EZ bar (4), flat leg press (1) | All 20 R4 ids, all 30 R3 ids, and 21 parameter users (overlapping) | Opus, M-L (two builders: primitives; kit) |
| **E3 Pose helpers** | Additive exports next to `rootOnSeat`: lying on a surface (census probe A: the back contour is 8-10 cm below `seat`), knee on a surface (probe G: no knee IK today), hands-and-toes support, prone. They are authoring helpers plus `checks` planes; the solver already reaches these poses (probes A-M) | The 64 ids whose worst pose is "solved, untuned" and the 10 "same model, not probed" (airborne 5, support 4, wall 1) | Opus, M |
| **E4 Lean and yaw** | Root lean (roll) in front view. Trunk yaw spike with go/no-go (1.3) | side_plank; russian_twist and bicycle_crunch (if go); the 6 rotation or lean faults | Opus, M, spike |
| **E5 Views** | Seated front view with pivot-arm machines (the `chestPress` front view is unverified). End-on lying and hinged front-view spikes. A small-motion zoom proof | 5 seated front-view ids (pec_fly, rear_delt_fly, machine_lateral_raise, hip_abduction, hip_adduction); dumbbell_fly and bent-over rear-delt fly (if go); 5 small-motion ids | Opus, M, spike |
| **E6 Hands** (golden-B update, `hand.mjs`) | Today it draws only a hand closing round a round handle, radial view (census 2.5). New drawings: palm flat (10), cupped two-hand hold (2), front rack (1), palms on a ball (2), band (2), rope in the fist with the load on the little-finger edge (5), ab-wheel handle (1). Archetype data with first-of-kind sources: `curl` (13, round handles, so no new drawing), `implement` (5). C5 geometry and `hand-test` stay green, and the 8's hand pairs stay byte-identical | 28 ids in never-drawn archetypes, plus 13 special cases (some overlap) | Opus, L |
| **E7 Feel and warning box** (golden-B update) | A feel state for "main muscle not paintable". This is needed only if a card keeps `rotator_cuff` or `core` as the only main muscle (cable_external_rotation; the 5 core-only ids otherwise name abs/obliques with a `libraryDiff` reason, content.md 8). The NHS back-pain box plus an add-only "Call 999" lint rule (content.md 5.3); the owner sees the wording on a contact sheet | 1 to 6 ids; about 20 sheets that link the back box | Opus, S |

Not done, on purpose:
- **Better automatic label placement.** 64 % of the 8's labels were hand-boxed. Changing `layout.mjs` would move the 8's 16 auto-placed labels unless it were opt-in, and the saving is small next to the pose judgement. Hand boxes stay allowed.
- **Removing the 1 mm "twin handle" workaround.** It is not needed for new plates.

### 2.3 Pose classes still to prove

The first plate of each class is its batch's **anchor**. It leads that batch's contact sheet, and the rest of the class clones it.

| Class (ids of all 153, census 4.2) | First batch |
|---|---|
| supine 15, incline 4, decline 1, support 4 | D2 |
| hinge 17, kneel 3, floor sit 2 | D3 (straight_arm_pulldown's light hinge is proven in D1) |
| split 9 | D4 (bayesian_cable_curl's staggered stance is the first split plate; D6's lunges prove the deep split) |
| single leg 6, airborne 5, wall 1 | D6 |
| bridge 2 | D7 |
| prone 2 | D8 |
| plank 9 | D9 |
| quadruped 2 | D10 |
| roll 1, yaw 2 | D10 (E4 go/no-go) |

---

## 3. Plate production

### 3.1 Files

- **Spec:** `tools/plates/library/<id>.mjs` in main. It is a new source, not a vendored copy, and uses the same format as the 7 approved engine specs (SPEC 4).
  A named export `cites` maps each pose angle and tempo to claim ids in the exercise's research card. The engine ignores named exports.
- **Batch file:** `tools/plates/library/batches/<batch>.json` lists the batch's ids, anchors and tier-2/3 decisions.
  `coverage.ts` and the batch gallery page are generated from it. Nobody hand-edits a shared list.
- **Library MANIFEST:** `tools/plates/library/MANIFEST.json` gets the sha256 of each approved spec and kit file in the approval commit.
  Checking it is L0 for library sources: a later edit fails unless it comes in a `[golden update]`.

### 3.2 How a plate is made

1. **Inputs:**
   - the exercise's verified research card, including its plate-facts block: the top 3 checkpoints become callouts, the most common drawable fault becomes the Mistake and its tells, and tempo comes with its claim;
   - the census row (view, template, equipment, poses);
   - the batch anchor spec.
2. **Author** (Opus, one session per census group of 2-12 ids, so context stays small): clone the anchor, set the angles from the card's cited ranges, place equipment in metres at real sizes (SPEC 5), write the callouts, Mistake, guides, tells, tempo and alt.
3. **Iterate with one command, `tools/plates/author.mjs <id>`** (a new LIB-0 tool). It runs:
   - render in 5 themes × {normal, Mistake, every callout and tell} at 390, 360 and 340 px;
   - the engine report;
   - the plate lint (3.3);
   - a side-by-side PNG with the batch anchor and the closest approved plate.

   This is the loop that caught real errors on the 8 (SPEC 7): contacts, checks, angles, then the pictures.
4. Batch plates go to the critic only when every automatic check passes.

### 3.3 Proving a new plate reaches the approved 8's quality

There are four layers. None of them replaces another, and each catches something the others can't.

**(a) Automatic floor (LIB-1, runs in CI and in `author.mjs`):**
- **Engine report `ok`:**
  - no label edge, overlap, figure or joint hits (estimated and browser-measured boxes);
  - IK contact ≤ 0.5 cm;
  - every `checks` entry passes;
  - measure within 2°;
  - the font loaded, no horizontal scroll, the sheet fits.

  Today no CI check reads this report (pipeline 12). From LIB-1 on, generation refuses a library plate whose report is not `ok`. The 8 are measured first: any issue on an approved plate is exempted by name with its decision (like O10). It is never fixed silently and never allowed for a new plate.
- **Plate lint** (add-only, a new named block next to the copy lint):
  - structure: 3 callouts of 1-3 words; cue ≤ 15 words with no semicolons; 1-3 tells; 1-3 guides; tempo present and equal to the card's tempo; `trace` set; alt ≤ 51 words (the approved maximum); Mistake differs from the end pose;
  - every `cites` angle falls inside its card range;
  - the GA 6.2 bans;
  - C10 tap targets with no exemption (only O10's approved pair stays exempt).
- **Envelope against the approved 8** (`tools/plates/quality/envelope.json`, measured on the 8 in LIB-1):
  - reference scale 146.29 px/m;
  - longest label leader; smallest label-to-figure gap;
  - figure box fill of the 358 px plate;
  - element counts, normal and Mistake (the mistake plate is 284 elements today);
  - ghost count; Trace length in px;
  - area of the Mistake outline change;
  - chunk bytes after HT-11.

  A new plate must sit inside [min, max] of the 8, widened by a margin fixed once in LIB-1 from the 8's spread. The small-motion zoom ids are exempted by name, with reason. LIB-1's own PR proves the lint bites: the 8 pass, and mutated copies fail (a label moved 1 px into the figure, a contact 1 cm off, tempo removed, a 60-word alt, a Mistake equal to the end pose).

**(b) Plate critic (Opus, fresh context, one per batch, never sees the builder's reasoning):**
- **Input:** the renders; the card's plate facts; the approved 8's renders as the bar.
- **Rubric, pass or fail per plate:**
  - Q1 anatomy reads true and matches the cited ranges;
  - Q2 the equipment reads as the real machine;
  - Q3 ghosts and Trace show the key path;
  - Q4 each callout points exactly at its part;
  - Q5 the Mistake is the card's fault and is plainly visible, with tells on the difference;
  - Q6 the tempo matches the card;
  - Q7 same scale, strokes, density and look as the 8, with the batch consistent (the same equipment drawn the same way);
  - Q8 the alt text describes the plate;
  - Q9 for tier A, the "right" pose never shows an unsafe setup (J-hooks or safeties where the card requires them, bar path clear of the neck).
- One fix round and one recheck. Two failed rounds on the same plate go to the supervisor (AGENTS.md).
- **Planted-defect test, every batch.** The supervisor gives the critic, among the real plates, a scratch copy with 2 defects that automation can't catch: a callout whose leader points at the wrong joint, and a Mistake pose mirrored onto the wrong leg. If either is missed, that critic's batch findings are rejected and a fresh critic reruns. The copy is never committed.

**(c) Owner contact sheet, one per batch:**
- The sheet is the batch gallery page itself: the exact bytes that get pinned, with the same chrome as golden A, playable Trace, Mistake and tells.
- It shows only the new plates, tier-A plates first. Each plate has a one-line "look at" note and Approve / Change buttons with a note field.
- It is published by the supervisor as a private page, and the answers are recorded in the plates PR.
- The same sheet shows, for information, the previous batch's layer panels, plus any concept or go/no-go question that is due.

**(d) CI forever after:** L0-L4 for every approved plate on every push (5.4). "Same as approved" is proven continuously. Quality was proven once, by (a) to (c).

### 3.4 Becoming a golden

After the owner approves, the plates PR gets one commit, `[golden update] D<n>: owner-approved plates`, made by `generate --approve <batch> --decision D-LIB-<n>`. It touches only `GOLDEN.json` and the library MANIFEST. It appends:
```
{ kind:"page",  batch:"D2", ref:<approved head>, pageSha256, bytes, approvedBy:"owner", date, decision:"D-LIB-D2", why, supersedes:null, prev }
{ kind:"plate", id, slug, src:"library/<id>.mjs", page:<pageSha256>, fragments:{normalSvg, normalOverlay, mistakeSvg,
  mistakeOverlay, tells, tempo, cues, alt, mistakeAlt}, approvedBy, date, decision, supersedes:null, prev }
```
- This follows plan 2.8, with one adaptation for **new** plates (a supervisor decision to record): the approved sources live in main, pinned by `GOLDEN.json` and the library MANIFEST, instead of being vendored from `claude/howto-options`. Golden A, golden B and the engine keep the full 2.8 route.
- The hash chain (`prev`) stays. Batches append in merge order. `golden --rechain` rewrites `prev` only for the branch's own unmerged tail entries, and the chain test fails if any entry already on main changed.
- **Fixtures:** new batches commit **hashes, not page copies**. CI rebuilds each batch page from the pinned sources (L1) and checks its sha. The fragments and per-callout reference pages are extracted from that rebuild and checked against their shas.

  At 153 this avoids about 16.5 MB of golden-A pages, 40.5 MB of ref-fixtures and 45.6 MB of golden-B pages in main (pipeline 10). `GOLDEN.json` grows about 1.1 KB per plate, to about 170 KB. The 8's committed fixtures stay as HT-1 left them. The proof strength is the same: a sha256 of the full page.

### 3.5 Golden updates

| Change | Route |
|---|---|
| An approved library plate needs a fix (owner feedback, a found error) | Plan 2.8: spec change, the batch page rebuilt, the owner sees before and after for **that plate only**, then add-only entries with `supersedes` and a decision id. A test proves the page's other fragments still equal their entries. Reviewer sign-off, with "golden update" in the title |
| Engine or kit change | 2.1: every pinned page byte-identical, so there is no owner step. If a kit change *does* move a plate, it becomes the row above for every plate it moves |
| Golden A or B (the 8) | Unchanged procedure (plan 2.8, golden branch) |

---

## 4. Layer production

### 4.1 Shared and per exercise (content.md 2, measured: only 35 of 674 copy strings are shared)

- **Written once and reused:**
  - 10 hand archetypes and 8 contact archetypes;
  - 5 equipment moves;
  - the red-flag boxes (4 today, plus back);
  - the owner's safety line, verbatim;
  - `SHOW_EVIDENCE = true`;
  - 3 shared risk lines;
  - the source registry;
  - the hand pairs, shared by key.
- **Per exercise:** plate facts, feel spec (4 rows, `libraryDiff`), 5 setup steps, 3 handling mistakes, ≤ 3 risks, 6-7 posture checkpoints with 2 posture zooms, handling overrides, `riskFlags`, evidence labels.
- **Families:** 94 full cards and 51 difference cards. A child never inherits its feel spec or its mistakes.

### 4.2 Research cards and their verification (content.md 3)

- **Card v2** lives in the repo at `docs/research/howto/<id>.json` with a schema. Claims are atoms with verbatim quotes of up to 50 words. Sources are registry ids with `access` and `checked`, never null. The card holds no user copy. At least one anchor source is read in full. No source may be orphaned.
- **Roles per batch** (none repeats another's check):

  | Role | Model | Scope |
  |---|---|---|
  | Family writers | Opus | 2-3 in parallel |
  | Source fetcher | Sonnet | PubMed E-utilities and direct pages. Checks title, year and PMID match and that each quote is verbatim |
  | Critic | Opus, fresh | Does each quote support its claim; direction slips; numbers; `inherit` lines |
  | Safety checker | Opus, fresh, tier-A ids only | The content.md 5.2 list |

- **The supervisor:**
  - re-fetches a random 10 % of claims, picked from the head commit hash;
  - runs the planted-mistake test on the critic (a flipped direction and a misquoted number);
  - writes the C15 stamp.
- **C15 is strict from LIB-3.** A sheet whose content hash has no stamp fails CI. This is the owner's no-paid-review decision in practice.
- **Research runs one batch ahead** of plates, because the card is the plate's input.
- **Research wave 1 covers:**
  - D1 and D2 cards;
  - the 19 group cards: palm-flat, curl, implement ×5, floor-body, rope rule, cupped thumb, front-rack exemption, wrist-curl exemption, prone checkpoints, equipment moves ×5, back box;
  - the likely-thin ids: battle_ropes, bear_crawl, high_knees, jumping_jacks, flutter_kicks, sled_pull, pendulum_squat, bayesian_cable_curl, resisted_hip_flexion, renegade_row.

  A `blocked:evidence` result shows up in week 1, not week 5.

### 4.3 Writing the layer spec

- **File:** `tools/plates/library/<id>.howto.mjs`, the golden-B `*.howto.mjs` format, now pure data for the E1 renderer.
  It covers hand poses (right plus 2-3 faults under C5), crop windows and poses for the 2 posture zooms, feel rows, setup, mistakes, risks, `riskFlags`, sources and evidence labels.
- **The posture crops are cut from the approved plate spec.** A layer author may start once the plate passes the critic. After the owner approves the plate, `author.mjs --layers` re-renders the crops from the approved spec, and only the crop windows may need a touch.
- **Copy under the lint from the first draft:**
  - The golden-B limits apply unchanged: 15-word sentences, 450 visible words, setup 5 × 12, 3 mistakes, 4 feel rows, ≤ 3 risks, 30-word boxes, the owner's line verbatim, and the GA 6.2 bans.
  - The author sets the word budget before writing: choose `riskFlags` first (at most 3 boxes, about 29 words each), then write to what's left.
  - Each section opens with one line that states the idea and why it works, then short cues ("teach more on concept"). The lint can't judge this, so the reviewer does.
- **Add-only lint blocks for the library** (content.md 4):
  - plate copy lint for new plates;
  - medical-claim bans;
  - the variant line for the 23 ids with "A / B" equipment ("Shown with a barbell. Dumbbells: same rules.");
  - family consistency (an inherited string must be `===` its parent's, and one `fault.key` has one label everywhere);
  - `RED_FLAG_ROWS` pinned per id at stamp time;
  - the back box's "Call 999" rule.

### 4.4 Layer checks and review

- **Automatic** (build and CI):
  - the copy lint (the build throws on any violation);
  - C1-C8 and C15; C9 contrast; C16 accessibility; C17 no network;
  - the derivation test, extended per batch: a batch's layer page holds only that batch's approved plates, with deep-equal specs and crop inputs and fragments `===`;
  - the state check (every state opens, is visible and fits 390 px, in 5 themes);
  - `hand-test`.
- **Layer reviewer** (Opus, fresh, one per batch; this is the PR reviewer): a render review of the pictures against the cards (Right and Wrong not swapped, hands match the archetype), then a reader's view at 390 px in 5 themes, tone, and TRIPLET flags. It gets a planted-defect copy each batch (Right and Wrong panels swapped; a setup step with its direction flipped).
- **Owner:** the design was approved in golden B, so layers ship on agent stamps, as plan O5 already does for the 8.
  - He sees each batch's panels on the next contact sheet and on his phone, and any change he asks for is a golden-B update.
  - A **five-second test** (GA 6.3) is done once per new tier-A hand-pair key, not per exercise: palm-flat (pike push-up), cupped (dumbbell overhead extension, goblet squat), front rack, and rope (overhead cable extension). That is about 4 keys, in 1-2 phone sessions.

### 4.5 Layer goldens

- Each batch has a layer page built by the E1 builder, pinned in `GOLDEN.json` (`kind:"layers-page"`, plus `kind:"layers"` per id with fragment shas and the stamp hash). It is rebuilt in CI and not committed as a page, the same way as plates (3.4).
- The app's layer blocks (HT-6..9) compare every state of every approved id against the rebuilt page (L2-B `===`, L3 pixels).

---

## 5. App and CI at scale

### 5.1 Size

- **HT-11 goes first** (Phase 0). Mistake SVGs are delta-encoded against the normal SVG, and crops are reused. The target is ≥ 35 % smaller per base chunk, and L2 compares the decoded string with `===`. The plan requires it before about 40 plates, and D1 + D2 reach 39.
- **At 153** (est., arithmetic from measured per-plate values):

  | Asset | Before HT-11 | After HT-11 |
  |---|---|---|
  | Plate chunks | 3.4 MB gz | about 2.2 MB gz |
  | Layers (hand pairs shared by key) | 1.4-4.6 MB gz | |
  | All How-to assets | | about 3.6-6.8 MB gz |
  | APK (today 4,374,299 B, measured) | | about 8-11 MB |

  The APK is not a hard limit (Play allows 200 MB), but it is a download-size cost the owner should know about.
- **Budgets:** no per-chunk ceiling is raised; the per-plate, zoom, hand-pair and feel chunk limits of plan 2.9 stay hard. The "all How-to assets" total is set per batch, by decision, as the sum of approved ids × a per-exercise mean ceiling. That ceiling is measured on the 8 after HT-11, + 10 %. A batch whose mean is over fails.
- **The rehearsal (5.6) measures the real numbers before D1.**

### 5.2 `ids.ts` and the main bundle

- Today's format breaks the 2,048 B `ids.ts` test at about 60 ids and the 3,072 B footprint (`ids.ts` + `lazy.tsx`) at about 100 ids (measured, pipeline 10). A plain list of 153 ids is 3,468 B minified.
- **LIB-0 changes the encoding and keeps both budgets:**
  - `ids.ts` holds one string of 5-character, 30-bit FNV-1a hashes of the approved ids;
  - `hasHowTo(id) = id.startsWith('lib_') && inSet(hash(id))`;
  - the hints (HT-5's `HOWTO_HINTS`) become one small hash string per distinct hint text, about 3 texts.
- **Size at 153:** about 765 B of ids, plus about 130 B of push hints, plus about 700 B of code and header, ≈ **1.6 KB** (est.).
- **Tests:**
  - an exhaustive unit test proves `hasHowTo` and the hints equal the approved set for all 153 library ids, and are false for custom ids;
  - the generator refuses a hash collision among library ids (it adds a salt if one ever happens);
  - the size test also runs on a synthetic 153-id build.

  Readable ids stay in `LOADERS` and `coverage.ts`, both outside main.
- **Wiring changes, called out in the PR:**
  - `hasHowTo(id: string): boolean` loses its literal-union type guard;
  - HT-6's hint test moves from `HOWTO_HINTS[ex.id]` to `howToHint(ex.id)` with the same four failure paths (non-push, no How-to, custom, and dropping `!ex.custom` fails). The supervisor approves that migration; nothing in it is loosened.
- **`LOADERS`** (153 dynamic imports, about 12 KB raw, est.) moves out of the sheet chunk into its own lazy `ht-index` chunk. It loads in parallel with the sheet, so the sheet's measured + 10 % budget stays. The main content probe (plan 2.9) is unchanged.

### 5.3 Generator and repo (LIB-0)

- **Everything that names the 8 becomes data:**
  - `golden.mjs`'s `PINS` and `LIB_OF`;
  - the `verifyVendor` source regex;
  - `shoot2`'s `IDS`/`FLAGS`;
  - the fidelity check's `bc0f378` reference.

  They move into `GOLDEN.json` and `plates.json`. **Proof:** the 8 regenerate byte-identical (`generate --check` gives an empty diff, and all 72 fragment shas are unchanged).
- **Vendored `build-page.mjs` gets a v2 that takes a list of specs.** With the default list it rebuilds `e2bea90c…` exactly. Batch pages use the same builder, so their chrome is the golden chrome.
- **`inputsSha256` per file, over that file's own inputs only.** A batch touches only its own files, so parallel lanes don't collide (R13). Generated files are never hand-merged: after merging `main`, re-run the generator.
- **`coverage.ts` is generated** from the batch files and `GOLDEN.json`.
- **About 460-500 generated files, about 30 MB raw at 153** (est.). The rehearsal measures what that does to typecheck and vitest time. If it is too slow, the fallback is emitting `.js` plus `.d.ts` (a supervisor decision), never skipping a check.

### 5.4 Gate time and sharding, with every shipped plate still proven

- **Load at 153** (est.):

  | Part | Arithmetic | Minutes |
  |---|---|---|
  | Plates | 153 × 27.2 s (measured per plate, HT-3 #106) | 69.4 |
  | Layers | 153 × about 26.5 s (est., 70-80 L3 pairs at 0.35 s) | 67.6 |
  | Full HT matrix | | ≈ 137 per pass |

  Today both gate jobs run everything, and each has a 40-minute timeout (measured, `build-apk.yml`).
- **Design:**
  1. **Amend HT-10 now, before it is built.** Its proposed `MARC_HT_SHARD` becomes a generic `k/N` over sorted (id, theme, state) tuples instead of "by theme across two jobs". Each shard writes a proof manifest, `ht-proof-k.json`, listing every state key with its result. The default (unset) still runs everything. This keeps the add-only rule for gate blocks: HT-10 builds the mechanism once, and LIB-1 only raises N.
  2. **A `howto-golden` job** (supervisor, add-only `.github`) runs `npm ci`, the build, and L1/L1-B (rebuilding every pinned page and checking its sha), then uploads `www` and the pages. The pages are built in parallel child processes (est. 2-4 min at 153).
  3. **N shard jobs** each download those, re-verify the page shas (cheap) and run their slice of HT-3 and HT-6..10: L2b, F3, L3, L4, the per-id offline open and the tripwires. Each state is proven **once per push**, which is what plan R14 already allows ("shards the matrix … across the two existing gate jobs … states are never dropped").
  4. **A `howto-join` job** computes the expected matrix: every approved id in `GOLDEN.json`, × 5 themes, × every state defined by HT-3/6-10, × the widths. It fails if any key is missing, duplicated or not PASS, or if any shard proved nothing. Its own PR shows the mutation: delete one key from one shard's manifest and the join fails.
  5. The non-HT gate stays in `source-gate` and `visual-gate-tz` as today. The HT pixel blocks there run with the shard variable set to "none", and the join covers them.
  6. **Merges wait for every check.** `android-gate` keeps its current `needs` so the APK builds in parallel, but the supervisor's merge rule (AGENTS.md) requires the join green too.
- **N** is set from the rehearsal so that each shard does ≤ 15 min of HT work:
  - about 10 shards at today's serial rate;
  - about 4 if parallel pages inside a job give the roughly 2.5× I expect on 4 vCPUs (est., to be measured).

  Wall clock per push: roughly 26-30 min (est.: golden build about 6 min, then a shard up to about 19 min, then the join about 1 min), against about 20 min today.
- **Precondition:** HT-3's L3 pixels are stable on CI. Its runs 1175, 1185 and 1187 were red over Chromium compositing (pipeline 7). N is raised only after 5 consecutive identical reruns of the matrix. A flaky diff is root-caused, never retried to green.
- **Queue:** GitHub's free tier runs about 20 concurrent jobs. At about 10 jobs per push, two pushes at once can queue. Builders already push only after a finished task (AGENTS.md). If queueing hurts, lower N and use parallel pages; never skip shards on some branches.
- **Optional later lever,** only if measured useful: cache the golden-side captures, keyed by (page sha, Chromium build, font sha, viewport, theme, state). It is adopted only if a sampled fresh-vs-cached self-check is 0 px on every run.

### 5.5 Offline and speed

- **Offline:** unchanged by design. Everything is static and bundled, with no new data and no network (C17 scans every chunk).
  - A cheap unit/gate check proves every `ht-*` chunk is in the service-worker precache list.
  - The offline sheet-open probe runs for every id, inside the shards.
  - **Not verified:** whether the service worker precaches inside the APK's WebView. If it does, 153 exercises mean about 30 MB raw copied on first launch (est.). The rehearsal measures it on the owner's phone APK. Any change (for example, not precaching `ht-*` in the APK, where the assets are already local) is a supervisor decision that keeps the web offline probe.
- **Speed:** tap-to-plate (≤ 400 ms at 4× throttle), long tasks and the shimmer tripwire are measured per batch on its heaviest plate. Every plate's element count is checked statically against the budget, so no plate can be heavier than the one measured.

### 5.6 Scale rehearsal (LIB-2, before D1)

- A throwaway branch, `claude/ht-lib-rehearsal-do-not-merge`, clones the 8 approved plates and layers under the 145 real ids with fake content. No PR is opened. It is pushed only so CI runs.
- It measures:
  - shard times and N;
  - typecheck, vitest and build time;
  - chunk sizes, the APK and the service-worker precache;
  - `ids.ts` and the footprint;
  - `ht-index` size;
  - tap-to-plate with 153 loaders.
- Sonnet, about half a day. Its numbers replace the est. values above. The branch is deleted afterwards.

---

## 6. Delivery

### 6.1 Prerequisites (inside M1, flagged now)

1. **HT-4 vendors golden B `b3a90af`**, not the old `16a8edc` (pipeline 12).
2. **Golden B's 35 null source fields are filled**, and the HT-5 disclaimer text is corrected to the owner's line (content.md 1).
3. **HT-10 is amended with the generic shard key and proof manifest** (5.4). This is a card text change, made before HT-10 starts.
4. **HT-3's CI pixels are stable** (5.4).

### 6.2 Phases and cards

| Phase | Cards (model, size) | Starts | Ends (est.) |
|---|---|---|---|
| 0 Scale core | HT-11 size (Opus M) · LIB-0 golden lock and generator at scale, `ids.ts`, coverage, negative control, library MANIFEST, `author.mjs` (Opus L, design note) · LIB-1 plate quality gate (report `ok`, plate lint, envelope) and CI sharding with the join (Opus M; the supervisor adds the jobs) · LIB-2 rehearsal (Sonnet S) · LIB-3 content infra: card v2 schema, registry, strict C15, lint extensions (Sonnet S-M) | T0 = M1 merged | T0 + 4 days |
| 1 Engine | E1..E7 (2.2). E1 starts at T0 (it touches only golden-B layers). E2-E7 start at T0 + 1 on the golden branch. Spikes report go/no-go by T0 + 5 | T0 | T0 + 7 days |
| Research | Wave 1 at T0 (D1, D2, group cards, thin ids), then one batch ahead | T0 (docs-only; it may start before M1 ends if it takes no M1 builder slot, the supervisor's call) | ahead of D11 |
| 2 Batches | D1 pilot, then D2..D11 | D1 plates at T0 + 1 on the LIB-0 branch head | D11 about T0 + 27 days |
| 3 Release candidate | full regression and full QA on the RC commit, the C6 release check, the device list (plan O9 plus a first-launch check), owner device session | after D11 | + 2-3 days |

**Per batch** (each step's owner in brackets):
1. Cards [family writers, fetcher, critic, safety, supervisor stamp]. **PR "R"** (docs only; the research critic's report is its review).
2. Plate specs by group [Opus builders, 1 per census group]. Then the plate lint, the critic, fixes, and the contact sheet [supervisor]. Owner approval. `generate --approve` [Sonnet integrator]. **PR "P"** (specs, `GOLDEN.json`, library MANIFEST and generated plate modules; ids stay out of `ids.ts`). Its review is the supervisor's own diff check (scope, `GOLDEN.json`, generated files, the critic report and the recorded approval), because the pictures were already judged in 3.3 (b) and (c).
3. Layer specs by group [Opus builders]. Then the lint, stamps, the layer reviewer and fixes. **PR "S"** (sheet: layer specs, generated content, `ids.ts` plus `coverage.ts` regenerated with the ids **approved**). This is when the button goes live.
4. After S merges, the supervisor sends the owner that commit's APK (fingerprint step checked, AGENTS.md) and archives the batch's sessions.

### 6.3 Lanes, agents, models

- **Working sessions:** at most **8** at once, excluding the supervisor. A steady state looks like:
  - 2 research writers;
  - 1 fetcher or critic;
  - 2 plate builders (on consecutive batches);
  - 2 layer builders;
  - 1 reviewer.

  In the engine week it is 2 engine builders, 3 writers, 2 D1 plate builders and 1 core builder. The cap is there because the supervisor merges, stamps, runs the planted tests and re-checks 10 %: more lanes would queue on it (risk R9).
- **Opus (judgement):**
  - writing cards, including difference cards (whether an inherited line holds is a judgement);
  - all critics and reviewers, and the safety checker;
  - plate and layer authoring;
  - engine, LIB-0 and LIB-1;
  - the supervisor.
- **Sonnet (mechanical):**
  - fetching sources and quotes;
  - the rehearsal;
  - LIB-3 schema and registry plumbing;
  - per-batch integration (`generate --approve`, rechain, coverage, opening the PR, getting CI green);
  - building the contact-sheet page from its script.
- **No duplicate checks.** Each reviewer checks one thing nobody else checks: research critic = sources; safety = the tier-A list; plate critic = pictures against the approved bar; layer reviewer = sheet render and reader's view; supervisor = stamps, the 10 % re-fetch and the planted tests.

### 6.4 Merge order (the owner's checklist)

1. HT-11
2. LIB-0
3. LIB-1
4. LIB-3
5. E1
6. D1-R
7. D1-P
8. D1-S
9. E2
10. E3
11. E5
12. D2-R, D2-P, D2-S
13. E4
14. E6
15. E7
16. D3-R, D3-P, D3-S, then D4 … D11 in order, R → P → S within each.

Each engine card sits just before the first batch that needs it. Builds run ahead on branch heads; merges keep this order (AGENTS.md). P PRs must merge in batch order anyway, because of the `GOLDEN.json` chain.

**PR count:** Phase 0: 5 (HT-11, LIB-0, LIB-1 plus the supervisor's workflow PR, LIB-3). Engine: 7. Batches: 11 × 3 = 33. **About 45**, plus an estimated 3-6 golden-update PRs from owner rework. That is about 1.3 merges a day over 5 weeks. At about 30 min of CI per merge, merge time is not the bottleneck.

### 6.5 What the owner does, and how often

| What | How often | Time each (est.) |
|---|---|---|
| Contact sheet: approve or change each plate; see the previous batch's layer panels; answer any due concept or go/no-go question | 11 (about 1 every 2 days) | 15-30 min |
| Concept questions: one-stroke plates, isometric setup-to-hold, the lean/yaw/view spike results, any left-out id | 1-2 (on the D1/D2 sheets) | included above |
| Back-pain box wording | 1 (on the D2 or D3 sheet) | included |
| Five-second tests for new tier-A hand keys (gym users) | 1-2 sessions, about 4 keys | 20 min |
| APK after each S merge | 11, optional look | — |
| Release candidate: device list on the exact APK, then publish | 1 | 30-60 min |

That is about 14 required touchpoints, against about 18 in the linear projection (pipeline 10). No paid service, no new data, no spending.

### 6.6 Effort and time

**Agent-hours (est.).** Pace assumptions: an anchor plate takes 4.5 h and a cloned plate 1.75 h. That is derived from "the first 8 plates took about a day of design" with the engine built alongside, and from critic and fix rounds. A full sheet takes 2 h and a difference sheet 1 h, now that E1 and the verified cards exist. A full card takes 1.5 h, a difference card 0.6 h and a group card 1 h.

| Work | Arithmetic | Hours | Model |
|---|---|---|---|
| Research: cards | 94 × 1.5 + 51 × 0.6 + 19 × 1 | 191 | Opus |
| Research: fetching | 145 × 0.25 | 36 | Sonnet |
| Research: critic, safety, fixes | 11 × 5 + 47 × 0.3 + 20 | 89 | Opus |
| Plates: authoring | 24 anchors × 4.5 + 121 × 1.75 | 320 | Opus |
| Plates: critic and fixes | 11 × 3 + 145 × 0.4 | 91 | Opus |
| Layers: authoring | 94 × 2 + 51 × 1 | 239 | Opus |
| Layers: reviewer and fixes | 11 × 3 + 25 | 58 | Opus |
| Engine E1-E7 with reviews | | 106 | Opus |
| Phase 0 | LIB-2 and LIB-3 on Sonnet | 62 | mostly Opus |
| Batch integration | 11 × 3 | 33 | Sonnet |
| Supervisor | about 35 days × 3 h | 105 | Opus |
| **Total** | | **about 1,330** | about 90 % Opus |

**Calendar (base case about 5 weeks after M1; T0 = M1 merged):**

| When | What |
|---|---|
| T0 + 4 d | Phase 0 merged |
| T0 + 7 d | Engine merged, spike decisions made |
| T0 + 7-9 d | D1 lands (calibration: the supervisor publishes the measured hours per plate and sheet and re-plans; if the pace is over 1.5× the estimate, the owner hears the new date) |
| T0 + 9 to T0 + 27 d | D2..D11 at about one batch every 1.8 days, set by owner sheets and the two plate lanes |
| T0 + 30 d | Release candidate and device check |

Add rework, assuming about 1 in 3 batches needs a second owner round of 1-2 days, which gives about **T0 + 33-35 days**.

- **Best case about 3.5 weeks:** the owner answers each sheet the same day, there is no second round, and the spikes pass.
- **Bad case about 8 weeks:** the yaw or view spikes fail and go to owner decisions; 2+ rounds on the Smith or front-view batches; subscription usage limits cap parallel sessions at about 4 (a real risk with about 1,300 Opus hours; I can't verify the cap).

Compute alone would allow about 2.5 weeks (1,330 h ÷ 8 sessions at 60 % utilisation ≈ 11.5 days). The owner cadence, the owner-gated order (plates before layers) and the merge chain are what stretch it.

---

## 7. Risks, and what goes live when

### 7.1 Risks and mitigations

| # | Risk | Mitigation |
|---|---|---|
| R1 | Quality drifts across 145 plates (fatigue, careless clones) | Batch anchors approved first; envelope lint calibrated on the 8; a fresh critic with a rubric and planted defects every batch; the owner sees every plate; bytes locked afterwards |
| R2 | An engine change moves an approved plate | Opt-in code paths; every pinned page rebuilt to its sha in each engine PR; `[golden update]` guard; per-primitive ref-fixtures; a mutation that proves L1 bites |
| R3 | Engine-drawn front view or dumbbell doesn't match the hand-drawn lateral raise | D1 anchors (`upright_row`, `dumbbell_biceps_curl`) are judged against the lateral raise before D5's 13 front-view plates are drawn |
| R4 | Yaw or view spikes fail | Decided by about T0 + 7 with pictures; owner options (a)-(c) in 1.3; C6 release check; nothing dropped silently |
| R5 | Owner review becomes the bottleneck or approval fatigue sets in | New plates only, pre-screened by the critic, tier A first, one "look at" line each, one sheet per batch; the next batch keeps building meanwhile |
| R6 | CI time and flakiness at 153 | Shards with a join proof; rehearsal-sized N; a stable L3 before scaling; no retry-to-green; the golden build done once per push |
| R7 | A shard silently skips states | The join job checks the full expected matrix from `GOLDEN.json`; an empty shard fails; the mutation is proven in the LIB-1 PR |
| R8 | `GOLDEN.json` and generated-file conflicts between lanes | P PRs merge in batch order; `--rechain` touches only the unmerged tail; per-file `inputsSha256`; generated files are regenerated, never hand-merged; `coverage.ts` is generated |
| R9 | Supervisor overload with 8 lanes | Session cap of 8; scripted stamps, sheets and rechain; Sonnet integrators; event-driven ticks. If items wait on the supervisor for more than a day, the owner may name a second supervisor for research (only the owner can) |
| R10 | Content accuracy without paid review | content.md pipeline: quotes, independent critic, planted mistakes, 10 % re-fetch, strict C15, safety check on 47 tier-A ids, evidence labels shown, the owner's line verbatim |
| R11 | Thin evidence for some ids | Researched in wave 1; `blocked:evidence` goes on the owner's list in week 1 |
| R12 | APK and first-launch cost grow (about 8-11 MB APK, est.; the SW precache inside the WebView is not verified) | HT-11 first; per-chunk budgets unchanged; total budget per batch; rehearsal and device check measure first launch |
| R13 | Repo weight (about 100 MB of fixtures in the linear case) | Hashes, not page copies, for new batches; the pages are rebuilt in CI |
| R14 | `ids.ts` or main footprint breaks | Hash-set encoding, about 1.6 KB at 153; exhaustive test; `LOADERS` moved to the `ht-index` chunk |
| R15 | Wrong inheritance in families (the rope `loadAxis` trap) | `inherit[]` lines each carry a reason and are critic-checked; child hand archetype = parent's; hash chain re-flags children when a parent changes |
| R16 | Rotation faults are replaced by weaker ones | Only after E4 says no-go, and the card and PR say so explicitly |
| R17 | Usage or rate limits throttle the parallel Opus sessions | Sonnet for mechanical steps; one critic per batch; the shared renderer removes about 5 MB of per-exercise scripts; the calendar degrades gracefully to about 8 weeks at 4 sessions |
| R18 | Builder context overflow on large batches | One session per census group (2-12 ids); a fresh session per group; archived after merge |
| R19 | The negative control disappears as coverage grows | Seeded custom exercise (permanent) plus the first `queued` id from `coverage.ts` |
| R20 | The known issues found in the 8 repeat (O7 contrast, O10 hit boxes) | The approved 8 keep their named exemptions; new plates must pass C9/C10 with none |

### 7.2 What goes live when

| Moment | On the owner's phone | In the Play Store |
|---|---|---|
| Phase 0 and engine merges | Nothing visible changes (the 8 are byte-identical) | — |
| A batch's P PR merges | No change: approved plates are locked in, but the ids are not yet in `ids.ts` | — |
| A batch's S PR merges | **Button appears for that batch's ids**. The supervisor sends the APK from that commit's green run | — |
| After D11 and the release candidate | All approved ids, plus any owner-approved left-out ids with no button | Only the owner publishes, after the C6 release check, full regression on the RC commit and the device list |

The owner may choose to publish before D11 with the button only on approved ids. The design supports it: the C6 release check would then need his named OK for the ids still queued. That is his call. The default is the whole library first, as he asked.

### 7.3 Decisions this design needs

- **Supervisor** (decide and log):
  - the 2.8 adaptation for new plates (3.4);
  - hashes instead of page fixtures;
  - the `ids.ts` hash encoding and the HT-6 hint-test migration;
  - `LOADERS` in its own chunk;
  - the HT-10 shard amendment, N, and the join job;
  - the envelope margins;
  - the total-asset budget per batch;
  - the lint extensions and the back-box "Call 999" rule;
  - the negative-control switch;
  - the session cap;
  - the batch lists (1.2).
- **Owner:**
  - the 11 contact sheets;
  - the concept questions;
  - any id at risk (1.3);
  - the back-box wording;
  - the five-second tests;
  - the release candidate and publishing.
