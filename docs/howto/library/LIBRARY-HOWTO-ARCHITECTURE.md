# Library How-to: architecture for all 153 exercises

Written 2026-09-30 for the owner and the supervisor. Nothing in any repo was changed.
Base: the judges' winner `design-hybrid.md`, with the grafts both judges named and the four rule conflicts fixed (list
at the end of this header). Numbers come from `census.json`, `content.md`, `pipeline.md`, the HT plan and code I read;
**est.** marks my own arithmetic. Batch, template and pilot membership was checked by script
(`arch/libarch.py`, `arch/libarch.json`, `arch/batchlines.md` in this folder): 145 ids, each once, plus the 8 = all 153
in `exercises.json` at `cae1725`; 47 new tier-A ids; D 13, P 12, T 44, H 76; every template has one view. A completeness
critic re-checked the census, the engine citations, the HT plan and the arithmetic on 2026-09-30 and corrected this
document in place.

**What changed from the hybrid design, and why**
- All plate authoring is on Opus (hybrid put 63 plates on Sonnet; pose and label tuning is judgement, 64 % of the
  8's labels were placed by hand).
- Owner-approved anchors come first: every template parent and every shared new pose, machine or rule is approved on
  a pilot sheet before anything is built from it. This replaces the 6 direction plates.
- Templates need at least 3 members with the same view. The three 2-member templates are dropped, and so are two
  members whose view differs (`cross_body_hammer_curl`, `bicycle_crunch`).
- The feel map gets an honest text-only state where no drawn muscle is true. The hybrid design forced a painted main
  muscle.
- Angle tolerance is ±2°, the engine's own measure.
- `ids.ts` stores only the shipped set. The hybrid's complement encoding answered "yes" for unknown ids.
- `LOADERS` gets its own lazy chunk, so no budget is raised.
- HT-10's card is amended before it is built. The library runs in new add-only jobs, and no merged gate block is
  edited.
- The close-up renderer must rebuild all 8 golden-B sheets, not 5 plus a stretch.
- Each PR gets a fresh reviewer, and batches merge only when the full proof is green.
- New plates inherit none of the 8's exemptions.

---

## 0. Summary for the owner

- **What gets built:** the other 145 library exercises get the same full "How to do it" as your approved 8: the
  plate with Trace and Mistake, and every layer under it. Your own custom exercises never get one.
- **Same quality, proven:** every plate is drawn by the same locked code as your 8. A robot check blocks any plate
  that is worse than your 8 or doesn't match its research. Then a separate reviewer compares it with your 8. That
  reviewer must first catch a planted flaw.
- **Order:** first a pilot sheet of 19 "pattern" plates, one for each new kind of pose, machine or rule (bench,
  deadlift, lunge, plank, curl, front view). The other plates copy only patterns you have approved. Then 10 batches:
  pulls and machines close to your 8, presses, hinges and rows, squats and lunges, arms, Smith and cable machines,
  shoulders and push-ups, leg machines, core, conditioning.
- **What you approve:** the pilot sheet (about an hour), then one sheet per batch about every 2 days (20-30 minutes
  each), plus a small second pilot sheet with batch 2. You see the exact plates that get locked. Once you say yes, CI
  proves on every change that the app still shows exactly that.
- **Layers** (grips, close-ups, feel map, setup, risks) use the design you already approved. They ship on
  the checks and on research that has been checked against its sources, and you see them on the next sheet and on
  your phone. Any new kind of drawing (flat palm, rope, front rack) is shown to you first.
- **Accuracy:** every claim quotes its source and is checked by a separate reviewer. Your safety line stays word for
  word; sources and evidence labels are research data only, never shown (LR-23). There is no paid expert, no money and no new data.
- **Your phone:** after each batch merges you get the APK. The button appears only on exercises you approved.
  Exercises not yet done look exactly as they do today.
- **Time:** it starts as soon as the current How-to tasks (up to HT-10) finish, and takes about 4½ weeks (best
  about 3½, worst about 8). The Play Store build waits for all 153 and one final full check.
- **Last resort:** if an exercise can't reach your 8's quality after two tries, it goes on a named list with
  pictures. The likely ones are side plank, Russian twist and bicycle crunch. At release you decide whether to wait
  or ship without its button. Nothing is dropped quietly.
- **What I need now:** a yes to this plan. Section 8 has 10 small decisions, each with a default, so no work waits.

---

## 1. Scope and exclusions

- **In scope: all 153 library ids.** The 8 are done, so 145 get the plate (golden-A standard) plus all layers
  (golden-B standard, compact copy under the lint).
- **Custom exercises (`custom: true`) never get a How-to.**
  - Reason: content is researched per library id, so a name match could put library advice on a different
    movement.
  - Linking a custom exercise to a guide would need a stored link field, which is a new kind of saved data (content.md
    8).
  - They show exactly what they show today: no button. HT-3's custom-exercise control (`HT_CUSTOM`,
    `tools/plates/fidelity/harness.mjs:190` on `claude/ht-3-howto-sheet`) keeps proving that.
- **No planned exclusion among the 153.** The library has no stretches or mobility drills (census 6). The 26 tier-2 and
  12 tier-3 ids are covered by the five conventions below (the owner approves them once, on pilot A), plus E-R5 for
  side plank, Russian twist and bicycle crunch (2.4), the view-conflict go/no-go for `dumbbell_fly` and
  `bent_over_dumbbell_rear_delt_fly` (2.2), and composers for `decline_bench_press`, `weighted_dip`,
  `medicine_ball_slam`, `wall_ball` and `kettlebell_swing` (2.1). One plate per id: where `exercises.json` lists two
  kinds of equipment (21 new ids, for example "Dumbbells / Barbell"), the plate draws one and a sourced variant line
  covers the other (4.4). The conventions:
  - **Hold plate** (plank, wall sit, hollow body hold, Pallof press; bird dog, dead bug): the entry pose, then the held
    pose. Trace follows the path into the hold, and the tempo reads Set / Hold / Rest.
  - **Cycle plate** (mountain climbers, high knees, jumping jacks, jump rope, battle ropes, bear crawl, sled push and
    pull, farmer's carry, burpee): one half-cycle or stride. Trace follows the driving point, and the tempo covers one
    cycle. The burpee uses the engine's `via` poses.
  - **Drawable-fault rule** (single-arm pulldown, one-arm row, renegade row, Pallof press, bird dog, single-leg RDL):
    their top fault needs roll or yaw. The Mistake shows the most common fault the engine can draw, and the card must
    source it as real and common. The rotation fault is taught in the layers.
  - **Small-motion zoom** (4 shrugs, wrist curl; likely also the 4 calf raises, whose heel travel of about 10 cm is
    about 15 px at the reference 146.29 px/m, est.): `camera.maxScale`, with an alt text that says the view is
    enlarged. The scale falls outside the approved range, so it is flag F1, an owner-named exemption (3.3), never a
    margin. PQ-H3 decides which ids need it; `flutter_kicks` and `cable_external_rotation` (census: "two poses barely
    differ", "small range at plate scale") are checked against PQ-H3 first thing in their batch. `PARAMS` includes the
    camera scale, so `leg_press_calf_raise` can stay derived (D).
  - **Airborne** (box jump, jump squat, jumping jacks, high knees, jump rope): takeoff or landing frames only, with a
    sourced landing checkpoint.
- **Not built:** a How-to without a plate ("Level 1", plan O8). It is below the approved bar.
- **Ids still waiting** show no button and no "coming soon", exactly as today. HT-4's `src/howto/coverage.ts` (the
  153-id table; on HT-4's branch only tests import it, so it is not in the app bundle) gains each one's status in LIB-2:
  `queued | researching | drawing | review | approved-plate | shipped | blocked:<reason> | left-out:<decision>`.
- **Named list (last resort, owner only).** An id that fails the bar after two approaches with no new evidence (the
  AGENTS rule) is listed with its reason and renders. A release-mode C6 (add-only, `C6R`) fails while any id is neither
  `shipped` nor `left-out` with the owner's decision id. It runs in LIB-23's release-candidate check, not on every PR
  (it would be red until the last batch); the supervisor may add it as an add-only step to the release workflow, away
  from the signing steps.
- **Library growth:** if `exercises.json` gains an id, HT-4's C6 fails until it has a `coverage.ts` row, and it joins
  the next batch. `ids.ts` goes stale, and `generate --check` catches it.

---

## 2. Engine capability work, and what each piece unlocks

The engine is byte-locked (`vendor/MANIFEST.json`), so new capability is **added beside it**. Only E-R5 (2.4) and a
conditional `poly` primitive (2.5) touch a locked file. Both are `[golden update]` PRs that must rebuild golden A
(`e2bea90c…`, 860,766 B) and every approved library page byte-identically (L1). The vendored files are verbatim copies
of `bc0f378:docs/howto/technical-plate/engine/*` (MANIFEST `source`), so, as plan 2.8 step 4 requires, the change is
first made at the source as a new pinned commit on `claude/howto-options`, then re-vendored with its new MANIFEST
`source`, sha256 and blob, so L0 pins the new file.

### 2.1 Equipment: composers, no locked-file change
- **What a composer is.** A composer, `tools/plates/library/eq/<name>.mjs`, is function-type equipment
  `(lm, ctx) => item[]` that returns **only existing primitive types**. `plate.mjs:41-46` throws on any other type
  (verified). The 20 primitives are `floor, dumbbell, pullupBar, stack, cableColumn, latBar, vHandle, rowFootplate,
  bench, seat, backPad, kneePad, legPress45, chestPress, barbell, rackUpright, cable, pulley, box, line`
  (`equipment.mjs:304`).
- **Rule PQ-H9 (3.2).** Any equipment part that moves between the end pose and the Mistake must carry `poly`.
  `plate.mjs:213` draws a changed equipment item in the Mistake only if it has `poly`, and `:215` masks only `poly`
  items, so a moving part drawn with `line` or `cable` would silently drop out of the Mistake view.
- **Where a composer is built.** It lands in the PR of its **anchor**, the first plate that uses it (6.1). Its source
  is pinned in `library/MANIFEST.json` from then on.

| Composer (census 4.1) | New ids | Anchor (where approved) | Batches |
|---|---|---|---|
| `inclineBench` (seat + angled `backPad`) | 7 | `incline_dumbbell_press`, `dumbbell_shoulder_press` (pilot A) | LB2, LB5, LB6 |
| `rope` (+ the 2 "rope likely" cable ids) | 5 | `rope_triceps_pushdown` (pilot A) | LB5, LB7, LB9, LB10 |
| `pecDeck` (front view, pivot arms unverified) | 2 | `pec_fly` (pilot A, go/no-go) | LB6 |
| `smith` (rails, bar, hooks) | 5 | `smith_machine_bench_press` (pilot B) | LB6 |
| `legCurlMachine` | 3 | `seated_leg_curl` (pilot B) | LB8 |
| `band`, `wall` | 2 + 2 | `resistance_band_row` (LB1), `wall_sit` (LB4); the other user is in a later batch | LB1/LB7, LB4/LB10 |
| `landmine`, `hipAbdAddMachine`, `calfMachine`, `ankleCuff`, `sled`, `medBall` | 2 each | both users are in one batch and on one sheet | LB3, LB6, LB8, LB8, LB10, LB10 |
| single use: `assistMachine`, `chestRowMachine`, `declineBench`, `romanChair`, `preacherPad`, `pulloverMachine`, `crunchMachine`, `latRaiseMachine`, `dipBars`, `hackSled`, `pendulum`, `legExtMachine`, `abWheel`, `medBallOptional`, `jumpRope`, `battleRope`, `kettlebell` | 1 each | its own plate | LB1-LB10 |
| existing primitive, new parameter: single handle, straight bar, EZ bar, flat `legPress45` | 11 + 5 + 4 + 1 | no new drawing | as needed |

Together these cover all 20 exercises that need a new drawing (R4) and all 30 that need a composed machine (R3).

### 2.2 Pose classes (probe-solved, untuned; census 2.3, 4.2)
A class shared by 3 or more new ids gets an **owner-approved anchor** before any other plate uses it. A class with
fewer users is approved on its own batch sheet.

| Class | New ids | Anchor | Notes |
|---|---|---|---|
| hinge | 17 | `romanian_deadlift`, `barbell_row` (pilot A); `straight_arm_pulldown` (LB1) for a light cable hinge | back landmark checked with `checks {plane}` |
| supine | 15 | `dumbbell_bench_press` (pilot A, bench); `crunch` (pilot B, floor); `inverted_row` (LB1, under a bar) | `rootOnSeat` does not fit lying poses; use `checks {plane}` (probe A) |
| plank | 9 | `plank` (pilot A, hold); `push_up` (pilot B) | |
| split | 9 | `reverse_lunge` (pilot A) | |
| single leg | 6 | `single_leg_romanian_deadlift` (pilot A; also shows the drawable-fault rule) | |
| airborne | 5 | `box_jump` (pilot A) | `root.at` is free |
| incline | 4 | `incline_dumbbell_press` (pilot A) | |
| support | 4 | `one_arm_dumbbell_row` (LB3, approved before LB7's dips) | |
| kneel | 3 | `assisted_pull_up` (LB1) | no contact IK; angles plus a `checks` plane (probe C) |
| engine-drawn front view (22 ids) | 22 | `upright_row` (pilot A); falls back to the cable version if the barbell front view fails | today front view is proven only by the hand-drawn lateral raise |
| engine `dumbbell` primitive (28 ids) | 28 | `dumbbell_biceps_curl` (pilot A) | the approved lateral raise is hand-drawn (`ref-src`) |
| standing overhead press | 4 | `barbell_overhead_press` (pilot A) | probe E |
| view conflicts | 2 | `dumbbell_fly`, `bent_over_dumbbell_rear_delt_fly` (pilot A spikes, early go/no-go) | census 4.3 |
| floor-sit, prone, bridge, quadruped (2 each); decline, wall (1 each) | 10 | the first user, on its own batch sheet | |

### 2.3 Hand close-ups: additive, golden-B `hand.mjs` never reopened
`hand.mjs` draws only the radial view and throws for any other (`hand.mjs:106`). Library hands are new modules that
reuse its exported `HAND_PROP`, `HAND_OF_H` and `HAND_CSS`, and pass the diameter explicitly (an unknown profile falls
back to `machine-grip`, `hand.mjs:115`).
- **LIB-7, radial pairs.**
  - The pairs: band, curl (13 ids), rope, EZ angled grip, D-handle.
  - Needed by LB1 (band) and later.
- **LIB-12, new views and pairs.**
  - Views: `palm-flat` (10 ids), `cupped` (2), `front-rack` (1), `ball-contact` (2).
  - Pairs: dip bar, kettlebell handle, ab-wheel handle, implements.
  - Needed from LB4 on.
- **Checks.** Each view gets C5-style geometry checks. Pairs are shared by key (`hand-<key>.ts`). About 15 new keys
  serve the 123 new ids that need a hand close-up (131 of the 153; the other 22 have hand archetype `none`, census;
  key count est.).
- **Owner.** He sees each new kind on a pilot sheet before its first batch merges: band, curl, rope, EZ, cupped and
  front-rack on pilot A; palm-flat, dip bar, kettlebell, ab wheel, ball and implements on pilot B. The five-second
  phone test (GA 6.3) runs once per new tier-A key.

### 2.4 E-R5: roll and yaw (the only planned edit to a locked engine file)
- **The change.** `body.mjs` gains two fields, both default 0, on a code path that leaves every existing output
  unchanged:
  - `root.roll`, front view only, as an in-plane rotation of the whole figure (side plank);
  - `trunk.yaw`, drawn as a foreshortened shoulder line in front view (Russian twist, bicycle crunch).
- **What it unlocks:** `side_plank`, `russian_twist`, `bicycle_crunch`.
- **Rejected on purpose:** an arms-only twist. Twisting with the arms only is the classic Russian-twist fault, so
  drawing it as "right" would teach the mistake.
- **Schedule.** A spike runs in phase 0 in scratch. The owner rules go/no-go on the renders on pilot B. The PR
  (LIB-20) merges before LB9.
- **Fallback:** the 3 ids go on the named list with the renders.

### 2.5 Conditional `poly` primitive (LIB-25)
- **Trigger:** a composer fails PQ-H9, or scores below 4 on equipment realism twice. Examples: an angled closed sled
  or pendulum arm that `box`, which is axis-aligned, and `line`, which is an open polyline (`equipment.mjs:301-302`),
  cannot close.
- **The change:** one additive `PRIMITIVES` key with `poly`, in a `[golden update]` PR that is proven
  byte-identical by L1.
- It is not planned. It exists so a composer that can't reach the bar never ships a weaker drawing.

### 2.6 Close-up renderer (LIB-6)
- **What it replaces.** The 8 used per-exercise close-up scripts of 29-44 KB each, in two copy-pasted families
  (pipeline 3). LIB-6 builds one data-driven renderer, `tools/plates/library/render/closeups.mjs`, fed by
  `*.howto.mjs` data. The bespoke parts become named options (`hookThumb`, finger-base marks, blade outlines, the
  thumb page).
- **Acceptance.** It rebuilds **all 8** golden-B close-up fragments (page `5aab1aca…`, pin `b3a90af`) byte for byte.
- **Fallback.**
  - After two approaches with no new evidence, any of the 8 that it can't reproduce keeps its frozen legacy script,
    with its output unchanged. At least the 5 `howto/render-*` exercises must still reproduce exactly.
  - If one of the 3 `*.howto-render.mjs` exercises falls back (squat, leg press, chest press), the visual critic
    judges the library sheets in that family against the legacy output. Those close-ups are flagged on the batch
    sheet.
- Golden B is never edited.

### 2.7 Page builders (LIB-2, LIB-6): the owner's sheet and the CI golden come from the approved chrome
- **The gap.** The vendored `artifact/build-page.mjs` is a script with the 8 written in (its `GROUPS` and
  output path). It cannot build a batch page, and copying its chrome by hand would let batch chrome drift from golden A.
- **Plates page builder (LIB-2):** `tools/plates/library/build-page.mjs` takes a spec list and emits the same page
  chrome. **Proof:** with the 8's list it rebuilds golden A `e2bea90c…` byte-identically. Every batch and pilot page
  uses it, so the chrome the owner sees and CI pins is golden A's. The vendored script is not edited.
- **Layers page builder (LIB-6):** the same pattern for golden B's layers page. With the 8's list it rebuilds
  the LR-23 golden-B page (`e7b81413…`, no sources states) byte-identically (legacy close-up scripts included where 2.6's fallback applies).

---

## 3. Plate production and the per-plate quality proof

### 3.1 Three authoring modes (all on claude-opus-5-5)
- **D, derived (13).** The spec imports an approved spec of the 8 and changes it only through a validated `PARAMS`
  schema. There is no raw-spec escape hatch, and unknown keys throw.
  - **Byte proof:** `derive(approved, {})` must equal all 9 fragments of the approved plate's `GOLDEN.json` entry
    (`===`).
  - An id that needs anything outside `PARAMS` becomes H.
  - The 13: 9 in LB1, `front_squat`, `goblet_squat` and `bodyweight_squat` in LB4, and `smith_machine_squat` in LB6.
- **T, template (12 parents + 44 children).** `library/templates/<family>.mjs` exports `make(params, facts)`.
  - **Eligibility:** at least 3 members with the same view, the same body setup (lying on a bench, seated upright,
    standing hinge, split stance, seated front-view machine…) and the same traced joint action. What varies is declared
    in the template's `PARAMS`: bench angle (flat, incline, decline), the load (dumbbells, barbell, EZ bar, Smith bar,
    cable attachment), the machine composer, stance and grip width. A rig or pose class that has its own anchor (2.1,
    2.2: Smith, landmine, incline, decline, pec deck, lateral-raise and hip machines) becomes a parameter value only
    after that anchor is approved. FSEAT also swaps the moving limb (arms for the fly and raises, legs for hip
    abduction and adduction).
  - **Byte proof:** `make(parentParams)` must equal the parent's approved fragments. It proves the parent only: a child
    that changes angle, rig or limb is checked like any new plate (PQ-H, critic, owner sheet).
  - **Where it lands:** a template lands in the PR of its parent (pilot A or B), like a composer.
  - **Crop windows:** posture crop windows are defined by landmarks and shared per template (families 4.2).
  - **Frozen after approval:** once a child is approved, L1 refuses a template edit that moves a byte, and the source
    pin (L0-lib, 3.6) refuses any other edit. A needed change becomes a `v2` file that only new children use.
  - The 12 templates: BENCH 8, SEATPRESS 3, HROW 4, HINGE 4, SHRUG 3, SPLIT 6, CURL 6, PUSHDOWN 4, CFLY 3 (front),
    FSEAT 5 (front), PUSHUP 4, SUPCORE 6.
- **H, hand-authored (76).** Cloned from the closest approved or anchor spec (census 1.1 "closest") and tuned by
  hand, like the first 8.

**Anchor rule.** No plate goes on a sheet, and no T child or D plate is started, until everything it derives from is
owner-approved:
- its source plate among the 8;
- its template parent;
- the anchor of each pose class with 3 or more users that it uses (2.2);
- the anchor of each shared rig it uses (2.1);
- any convention it uses (1).

The two pilot sheets (6.1) carry every such anchor one batch or more before it is needed. One exception: a pilot plate
that is itself a child of a parent on the same pilot sheet (`incline_dumbbell_press` under BENCH,
`rope_triceps_pushdown` under PUSHDOWN, both pilot A) is drawn after the parent's design note, shown next to it, and
approved together. If the parent is rejected, the child is redrawn and shown again.

### 3.2 Hard checks (LIB-3, `tools/plates/library/qa.mjs`)
The generator refuses to emit a plate that fails any of these. They run in authoring and in CI for every shipped
library id.

| ID | Check | Basis |
|---|---|---|
| PQ-H1 | Engine report `ok` on every render: labels ≥ 8 px from the edge, no overlap, no label over ink or key joints (browser-measured boxes), IK contact ≤ 0.5 cm, author `checks`, measure ≤ 2°, font loaded, no horizontal scroll | SPEC 6. Today it is only a `console.warn` (build-page.mjs:117) |
| PQ-H2 | Structural parity: SVG element, attribute and class names are within the set the 8 use (pinned `qa/vocabulary.json`); no colour literal except the mask's `#fff`/`#000`; no `var(`; ids slug-prefixed and unique; chrome DOM of the same shape (1-3 callouts, 1-3 tells, tempo, Trace and Mistake pills); alt ≤ 51 words | same classes means the theme CSS colours it as it colours the 8 |
| PQ-H3 | Motion and Mistake visible: Trace length ≥ the shortest approved; start ≠ end; Mistake outline non-empty, with deviation at a tell anchor ≥ the smallest approved | catches invisible holds and mistakes |
| PQ-H4 | Readability and touch at 390, 360 and 340 px: all text inside the plate; callout hit boxes ≥ 44 × 44 CSS px and not overlapping (C10); tempo strip does not overflow. **No O10 exemption** for new plates | C10 |
| PQ-H5 | Contrast in 5 themes for each plate-drawn class (label text, figure ink, trace accent, `--mistake` outline) ≥ the approved minimum for that class and theme, measured on the 8 in the same job. Chrome text (tells, tempo, cue) comes from the locked chrome CSS, so it is identical for every plate by construction. O7 is a chrome property, not a plate exemption, and changes only by a golden update to all plates | "not worse than approved" |
| PQ-H6 | Drawing matches research: every numeric plate fact in the verified card (joint angle, bar or seat height, contact) has a `measure.expect`, `checks` or `angles` entry within **±2°** or ±1 cm; tempo equals the card's | the approved method |
| PQ-H7 | Determinism and size: two builds byte-identical; chunk ≤ 150 KB raw / 36 KB gz; S0 ≤ 700 elements | plan 2.9 |
| PQ-H8 | New-plate copy lint: callouts 1-3 words, cue ≤ 15 words, no semicolons, GA 6.2 bans, medical-claim bans. The 8's strings are exempt by name only | content 4 |
| PQ-H9 | Equipment rules: only `PRIMITIVES` types; every part that moves between end and Mistake carries `poly` | plate.mjs:44-45, :215 |
| PQ-H10 | Derivation proof for D and T (3.1); `PARAMS` validation | byte proof |

LIB-3's own PR proves the 8 pass, except their named exemptions, and that each check turns red on a planted mutation.
The mutations: a label moved 1 px onto the figure, a contact 1 cm off, a Trace below the minimum, a Mistake equal to
the end pose, a moving `line` part, a raw-spec override, and a colour literal.

### 3.3 Flags: a value outside the approved envelope becomes a named owner decision, never a margin
- The envelope `[min, max]` is measured on the 8 in LIB-3 and pinned. Nothing is set by hand.
- The flags:
  - F1: scale in px/m;
  - F2: figure coverage of the 358 px plate;
  - F3: longest leader;
  - F4: number of hand-boxed labels;
  - F5: plate label text below 4.5:1;
  - F6: view differs from the census;
  - F7: the Mistake is not the card's top fault (drawable-fault rule).
- **A flagged plate cannot merge without the owner's yes.** That yes is recorded in the golden entry as a named
  exemption, like O10. Known in advance: F1 on the 4 shrugs and the wrist curl (zoom), likely also the 4 calf raises
  (1), and F7 on the 6 drawable-fault ids.

### 3.4 Visual critic (Opus, fresh context, one per batch)
- **Input:**
  - each plate at 390 px in Silent Black and Paper (normal, each callout, Mistake, each tell), beside its closest
    approved plate or anchor at the same scale;
  - its close-ups and feel still;
  - the card's plate facts;
  - the PQ scorecard.
- **Rubric, 1-5 per plate:**
  - R1 pose truth;
  - R2 equipment realism and scale;
  - R3 contact plausibility;
  - R4 label placement "as a designer would";
  - R5 the Mistake reads in 2 seconds;
  - R6 the Trace means something;
  - R7 consistent with the 8 (line weight, density, framing, and the same equipment drawn the same way in the batch);
  - R8 close-ups: Right and Wrong not swapped, thumb and handle placement;
  - R9 feel regions match the card;
  - **R10, tier A only:** the "right" pose never shows an unsafe setup (safeties or J-hooks where the card requires
    them, bar path clear of the neck).
- **Pass:** every item ≥ 4. Otherwise there is one fix round and one recheck. Two failed rounds on the same plate go
  to the supervisor.
- **Calibration each run.**
  - Two approved plates are mixed in unlabelled. If either scores below 4, the run is discarded.
  - The supervisor plants two defects that automation can't catch, for example a leader on the wrong joint or a
    Mistake on the wrong leg. A miss discards the run.
  - A fresh critic reruns. Planted copies are never committed.

### 3.5 Owner sheet, pin, goldens, golden updates
- **The sheet is the exact bytes that get pinned.**
  - It is a private page built from the PR head, with the batch plates page sha printed on it.
  - Order: tier A first, flagged items first within each tier.
  - Each plate shows normal and Mistake, its anchor or closest approved plate beside it, a Paper thumbnail, the
    critic's scores and every flag.
  - New layer design kinds appear only on pilot sheets (2.3, 4.3).
  - He answers per exercise ("all yes except X: note").
  - Ids he doesn't pass stay `review`: no button, and they roll to the next sheet. The rest merge.
- **Pin.** After his yes, the supervisor adds one `[golden update]` commit to `tests/howto/golden/library/<batch>.json`.
  - There is one file per batch (and per pilot), so parallel batches never conflict at a chain tail.
  - Each file is a hash chain whose first entry names the current head entry of `GOLDEN.json`.
  - Entries:
    - `plates-page` with its sha, which must equal the sha printed on the sheet;
    - `layers-page`, with `approvedBy: 'stamps (O5)'`;
    - per id, `plate` with the 9 fragment shas and `layers` with its fragment shas;
    - the template sha and the parent entry's hash;
    - the card stamp hash;
    - exemptions;
    - `approvedBy: 'owner'`, his words, the date and `decision: D-LIB-<batch>`.

  `library/MANIFEST.json` pins every source (specs, templates, composers, hands, renderer, howto specs) to its
  approving entry.
- **Fixtures are derived, not committed.** CI rebuilds every pinned page from its sources and checks the sha (L1).
  This keeps about 100 MB of pages and fixtures out of the repo (pipeline 10). The 8's committed fixtures stay as HT-1
  left them.
- **Golden updates follow plan 2.8, adapted for library sources that live in main:**
  1. a spec, template or composer change;
  2. a rebuilt page;
  3. a sheet of **only the changed ids**, before and after;
  4. the owner's yes;
  5. an add-only entry with `supersedes` and a decision id;
  6. a fresh reviewer, with "golden update" in the title.
- An engine or composer change that moves no approved byte needs no owner session: its proof is L1 on every pinned
  page.
- **Guard:** `tests/howto/golden/library/**` is already inside the HT guard's `tests/howto/golden/**` (plan 2.8). The
  supervisor extends the agent guard, add-only, so that `[golden update]` is also required on non-merge commits that
  touch `tools/plates/library/MANIFEST.json`.
- **Pilot sheets built before LIB-3 merges** are re-checked on the merged LIB-3. If any pinned byte would have to
  change, the owner gets a changed-ids sheet before the pin.

### 3.6 CI forever after
Every shipped library id is proven in the library shards (5.4) on every full run:
- L0-lib: every source pinned in `library/MANIFEST.json` (specs, templates, composers, hands, renderer, page
  builders, howto specs) has its pinned sha256 (vitest);
- L1: pages rebuild to the pinned sha;
- L2: fragments `===` their entries;
- L2b: CSS walk;
- F3: markup;
- L3: pixels in 5 themes, every callout and tell, 390, 360 and 340 px;
- L4: Trace;
- the layer states (no sources states, LR-23);
- PQ-H1..H10.

The verdict job proves no id or state is missing. The 8 keep their HT-1..HT-10 blocks, unchanged, in both gate jobs.

---

## 4. Layer production

### 4.1 Shared once (verified once, reused)
- **Archetypes:** 10 hand and 8 contact archetypes (GA 3.1, 3.2, appendix B) in the generated
  `src/howto/archetypes.ts`. It gains data for the 3 archetypes golden B never drew: palm-flat 10, curl 13,
  implement 5.
- **Hand pairs** are shared by key (2.3).
- **Equipment moves:** get in and out, selector pin, foot bar, unrack and rerack, dumbbell kick-up.
- **Shared risk lines:** bar over the face, breath-holding, jump landing.
- **Red-flag boxes:** wrist, shoulder, knee, elbow, plus a new **back-pain box** from the NHS page, read in full by
  the fetcher.
  - It is linked from about 20 hinge, row, crunch and leg-press sheets. Its first user is LB1's leg-press variants.
  - Its urgent line is region-neutral ("Get emergency help now."), not the NHS page's "Call 999": the Play Store app
    is not UK-only, and the approved boxes already turn NHS "111" advice into "Get it checked today". The NHS 999
    triggers stay in the text, and the source note names the NHS page. The line needs one add-only lint rule (the
    current rule expects "today" on `now`).
  - LR-23 and LR-27: no number, service name, website or link in any box. The draft is name "Back pain"; now
    "Numb or weak in both legs, numb around your genitals, or bladder or bowel changes? Get emergency help now.";
    doctor "No better in a few weeks? See a doctor." (D-LR23-1). The final triggers come from the fetcher's full NHS
    read and the critic.
  - The owner sees the wording on pilot A.
- **`OWNER_DISCLAIMER`** is verbatim and pinned by the lint: "General guidance, not medical advice. If something
  hurts, stop and get it checked." There is no `SHOW_EVIDENCE` (LR-23).
- **Source registry:** `docs/research/howto/sources.json` (research data only, never shown, LR-23).
- **19 shared research cards** (content 6), done in phase 0:
  - palm-flat, curl, the 5 implements, floor-body;
  - the rope rule, cupped thumb, front-rack exemption, wrist-curl exemption, prone checkpoints;
  - the 5 equipment moves and the back box.

### 4.2 Per exercise
- **Research card** `docs/research/howto/<id>.json`, card v2 (content 3.2): 94 full cards and 51 **difference cards**
  for near-copies (content 2.3).
  - A child keeps its parent's hand archetype and primary contact, and never inherits the feel spec or the mistakes.
    Every inherited line carries "true because …".
  - **The parent card's content hash is part of each child's stamp**, so a parent fix makes the child stamps stale
    until they are re-checked.
- **Sheet spec** `library/howto/<id>.howto.mjs`, written under the lint from the first line:
  - `riskFlags` come first (at most 3 boxes, about 29 words each);
  - then the copy is written to the words left under 450;
  - every section opens with one concept line, then short cues (golden B's pattern).
  - It holds up to 4 feel rows, 5 setup steps, 3 handling mistakes and 3 risks (golden B's lint maxima), zoom picks and
    handling overrides.
- **Posture crops** are data: checkpoint landmarks plus the template's crop window, cut from the approved plate
  (HT4-A5 rule). Only the Wrong half uses the card's fault pose.
- **Feel map.**
  - `cable_external_rotation` has no honest drawn region (its main muscle is `rotator_cuff`, which is text-only), so it
    uses a **text-only feel state**. That is a golden-B design addition, shown to the owner on pilot B.
  - `plank`, `mountain_climbers`, `medicine_ball_slam`, `bear_crawl` and `bird_dog` list only `core`, which golden B
    keeps text-only because the body map draws it on the serratus (`feelmap.mjs:13`). They name drawn regions (abs,
    obliques) with a `libraryDiff` reason only where true. Otherwise they are text-only as well.
  - No new body-map region: `bodyMuscles.ts` is shared with other features.

### 4.3 Research and verification (content.md 3.3-3.5, adopted)
- **Roles per batch.** Nobody repeats another's check.
  - writers: Opus, up to 3, one family each;
  - source fetcher: Sonnet (E-utilities and plain fetches, verbatim quotes);
  - content critic: Opus, fresh, card and quotes only;
  - safety checker: Opus, the 47 tier-A ids;
  - the supervisor re-fetches 10 % of claims (chosen by the head hash), and runs a planted-mistake test on the critic
    (two errors planted in a card copy; a miss rejects the run).
- **Stamps.** C15 goes strict. A sheet whose content hash has no stamp in `reviews.json` (supervisor-owned) fails CI,
  and the generator writes a button only for ids with both an owner-approved plate entry and a stamp. LIB-5 first
  stamps the 8 from their golden-B approval (O5), so strict C15 never hides an approved sheet.
- **Timing.**
  - Research runs one batch ahead.
  - The thin-evidence ids are researched in phase 0, so any `blocked:evidence` shows up early: `battle_ropes`,
    `bear_crawl`, `high_knees`, `jumping_jacks`, `flutter_kicks`, `sled_pull`, `pendulum_squat`,
    `bayesian_cable_curl`, `resisted_hip_flexion`, `renegade_row`.
  - Verified cards are pushed as they pass to the docs-only branch `claude/libht-research`, because the scratchpad is
    not durable. They reach main in their batch PR.

### 4.4 Layer checks, all existing or add-only
- **The copy lint:** golden B's constants unchanged (among them ≤ 3 warning boxes, ≤ 450 visible words, sentences
  ≤ 15 words, the owner line verbatim), plus content 4's add-only rules:
  - new-plate copy (PQ-H8) and the medical-claim bans;
  - a `RED_FLAG_ROWS` entry per id when its stamp is written;
  - the variant line: required when `equipment` names two kinds (21 new ids), a caption-class line of ≤ 10 words
    such as "Shown with a barbell. Dumbbells: same rules.", and the card says whether each claim holds for both;
  - new `FIX_VERBS` only in the batch PR, named in its body;
  - family consistency: an inherited string is `===` to the parent's, and a `fault.key` has one label everywhere;
  - the back-box urgent-line rule (4.1).

  It runs at build, where the generator throws, and in C7.
- **The content checks:** C1-C18 on every shipped id.
- **Per batch layer page:** the golden-B state check at the LR-23 golden B (every state opens, is visible and fits 390 px,
  5 themes, no page errors; no link, source, evidence label or contact on any card, and the disclaimer last).
- **The rest:** C5 hand geometry, C9 feel contrast, C10 tap targets, C11 reduced motion, C12 no endless motion, C16
  accessibility, C17 no network, and the same localStorage keys before and after a sheet opens.
- **The PR reviewer** (fresh Opus) reads the copy at 390 px in 5 themes. Each batch it gets a planted-defect copy:
  Right and Wrong panels swapped, and a setup step with its direction flipped. A miss discards that review.
- **Owner:** layers use the approved golden-B design, so they merge on stamps and checks (plan O5). He sees them on
  the next sheet and his phone, and any change he asks for is a golden update. New design kinds (2.3, 4.2) reach him
  on a pilot sheet first.

---

## 5. App and CI at scale (no check loosened, no budget raised)

### 5.1 Size
- **HT-11 must merge before LB3.** HT-11 is the planned byte-preserving delta encoding of the Mistake SVG plus crop
  reuse, targeting at least 35 % smaller per base chunk, with L2 on the decoded string. It must land before LB3 because
  the 8 + LB1 + LB2 come to 34 plates in the app, and the plan's limit is about 40. Pilot plates add no app module
  until their batch ships.
- **Totals at 153 (est.).**
  - Plates: about 3.4 MB gz, and about 2.2 MB after HT-11.
  - All How-to assets: about 3.5-6.8 MB gz.
  - APK: from 4.37 MB (measured) to **about 8-11 MB**. Play's limit is 200 MB.
- **Per-chunk ceilings stay** (plan 2.9). A plate over one (a many-pose burpee, a busy machine) is fitted by its
  author at design time (PQ-H7), never by raising the ceiling. New layer styles ship inside their own `hand-*` or
  `feel-*` chunks, so the shared How-to CSS ceiling is not raised either.
- **The total is a fixed per-exercise mean ceiling times the shipped ids.** Plan 2.9's total (420 KB gz for the 8,
  "re-set per batch by decision") runs out at about 19 plates (pipeline 10), so inside LB1. LIB-2 therefore re-sets it
  once, as that decision: the ceiling is the 8's measured mean plus 10 %. HT-11 then lowers it to the post-HT-11 mean
  plus 10 %; it is never raised. A batch over the mean fails.
- **HT-11b** (conditional, LIB-24) deduplicates the body-map base, byte-preserving. It triggers if LB2 projects more
  than 6 MB gz at 153.

### 5.2 `ids.ts` and the main bundle
- **The limits.** `ids.ts` must stay ≤ 2,048 B, and `ids.ts` + `lazy.tsx` ≤ 3,072 B. A quoted list of 153 ids is
  3,467 B, and today's format breaks at about 60 ids (pipeline 10).
- **LIB-2's encoding:** `hasHowTo(id) = id.startsWith('lib_') && inSet(fnv1a30(id))`.
  - It is a string of 5-character hashes of the **shipped ids only**, so an unknown id is always false.
  - The generator hashes every id in `exercises.json`, and refuses a collision, or salts.
  - `exercises.json` is an input of `ids.ts`, so a new library id makes `generate --check` fail until regenerated.
- **Push hints** are deduplicated by text, with one index per push id.
- **Size at 153:** about 765 B of ids, 130 B of hints and 700 B of code, so ≈ 1.6 KB (est.).
  - If the rehearsal measures the footprint over, the fallback is 4-character, 24-bit hashes with the same collision
    refusal.
  - A synthetic 153-id build runs the size tests in LIB-2's PR.
- **New exhaustive unit test:** for every id in `exercises.json`, `hasHowTo(id) === (id in LOADERS)` and the hint
  equals the generated content's. Custom ids are false.
- **Wiring changes, called out in LIB-2's PR:**
  - `hasHowTo` loses its literal-union type guard, and `HowToId` becomes a branded `LibId`. HT-1's `LibId` in
    `src/howto/types.ts` (today a literal union of the 8) becomes generated from `exercises.json`; types cost no bytes;
  - HT-6's hint test moves from `HOWTO_HINTS[ex.id]` to `howToHint(ex.id)` with the same four failure paths.
- **`LOADERS`** (153 dynamic imports, about 12 KB raw, est.) moves to its own lazy `ht-index` chunk, which loads in
  parallel with the sheet on tap.
  - Its budget is set once at measured + 10 %, as for any new chunk.
  - The HowToSheet budget and the main content probe stay unchanged.
  - Tap-to-plate stays ≤ 400 ms at 4× throttle.

### 5.3 Generator (LIB-2)
- **Everything that names the 8 becomes data:** `golden.mjs`'s `PINS` and `LIB_OF`, the `verifyVendor` regex,
  `shoot2`'s ids and flags, the fidelity reference, and the layer generators HT-5..HT-8 add (content, hands, crops,
  feel), which read only golden B's 8 specs. Their exact files are known once those cards merge; LIB-2's design note
  lists them.
- **Plates page builder** (2.7) with its golden-A byte proof.
- **Proof:** the 8 regenerate with no byte change (L1 `e2bea90c…`, L2 `===`, HT-3's L3 unchanged), plus mutation
  proofs.
- **`inputsSha256` per file, over that file's own inputs.** Today one shared value re-headers every file
  (pipeline 12). Generated files are never hand-merged: after a `main` merge, re-run the generator.
- **About 460-500 generated files at 153 (est.).** The rehearsal measures typecheck and vitest time.
  - If they are too slow, the fallback is emitting `.js` + `.d.ts` (supervisor decision), never skipping a check.
- **The library tree:**
  - `tools/plates/library/{specs,templates,eq,hands,render,howto,qa}`;
  - `MANIFEST.json`;
  - per-batch golden files;
  - the status field in HT-4's `src/howto/coverage.ts`;
  - the D/T derivation helpers with the `PARAMS` validator.

### 5.4 Gate time: sharded, nothing dropped
- **The load.** 27.2 s per plate per job (measured, HT-3) plus about 26 s of layers (est.) is 53 s per exercise. For
  145 exercises that is about 128 min, against a 40-min job timeout.
- **The 8 stay exactly where they are:** HT-1..HT-10 in `source-gate` and `visual-gate-tz`, about 23 min per job at
  M1 (est.), and the time-zone canary.
- **HT-10 card amendment** (supervisor, now, before HT-10 is built):
  - Its shard proposal becomes an exported helper `htShard(k, N)` over sorted `(id, theme, state)` tuples, plus
    `writeProof()`, in a new module used by HT-10's own blocks. The default (unset) still runs everything.
  - The "by theme across two jobs" split is struck, because it would edit other tasks' blocks. If the 8's HT time is
    over budget, HT-10 stops and reports.
- **New add-only jobs** (the supervisor wires `.github`; LIB-4 writes the scripts):
  1. `howto-rebuild`:
     - L1 for every pinned library page, on parallel processes;
     - uploads `www` and the pages;
     - emits the shard plan (greedy packing on a committed timing file, K from `fromJSON`: 1 at LB1, about 8 at 153).
  2. `howto-shard-k`:
     - re-checks the page shas;
     - runs the golden-vs-golden 0 px self-check and the 1 px-shift control;
     - for its ids: PQ-H1..H10, L2b, F3, the full L3 matrix, L4, the layer states in 5 themes, and the per-id offline
       open;
     - writes a proof manifest `{sha, id, check, state, theme, width, result}`.
  3. `howto-verdict`:
     - fails unless every shard ran on the same sha;
     - fails unless the proven ids **equal** the shipped library ids;
     - fails unless each id's state count equals the count expected from its spec (callouts × tells × themes ×
       widths, plus the layer states).

     Its PR shows the mutation: delete one row from one manifest, and it goes red.
- **The library runner is new code, `tools/plates/library/fidelity.mjs`.**
  - It composes HT-3's exported primitives (`openAppTrain`, `openGolden({html})`, `htSeed`, `region`, `l2bWalk`,
    `blockMarkup`, `capture`, `diffPng`, `meetsRule`).
  - It cannot simply call `ht3Fidelity({plates})`: that function still looks up the hard-coded `HT_PLATES`
    (harness.mjs:638, :742) and one fixed golden page. HT-3's harness is not edited.
- **Unit tests:**
  - **each shipped id is in exactly one shard** for every K from 1 to 16;
  - **C-TZ:** no `Date`, `Intl` or `toLocale*` in `src/slices/howto/**` or the generated chunks, so running the
    library in UTC only drops no state that ever ran. Timers are relative time and stay allowed (HT-8's shimmer may
    use them).
- **K** keeps each shard ≤ 25 min, including setup: about 8 at 53 s per exercise, or 13-14 if layers measure at 2×.
  - LIB-4 measures 1 against 4 parallel pages on the 8. It adopts workers only if both modes give 0 px against each
    other.
- **When the full shards run:**
  - Pushes to `main`, ready-for-review heads and `workflow_dispatch` run the full shards.
  - Draft pushes run the existing jobs, the L0-L2 vitest checks, and shards for **the ids the diff changed**.
  - `android-gate` keeps its current `needs`, so the APK builds in parallel. A merge, and the APK sent to the owner,
    still require `howto-verdict` green on that exact head, which contains the latest `main`.
- **Entry condition:** HT-3's pixel checks give 5 consecutive identical reruns on CI before K goes above 1. A flake is
  root-caused, never retried to green.
- **Per-merge CI is about 30-35 min (est.).** With K = 8 a run uses about 13 jobs (the 3 existing `build-apk.yml`
  jobs, rebuild, 8 shards, verdict) plus the agent guard. GitHub Free allows 20 concurrent jobs (the owner's plan is
  not verified), so two full runs at once already queue. A queue adds latency, never a skip.

### 5.5 Library negative control
- **The problem.** HT-3 hard-codes bench press as "no How-to" in two places (branch `claude/ht-3-howto-sheet` at
  `894f5f4`): `HT_BENCH = 'lib_barbell_bench_press'` (harness.mjs:189, used in `HT_ORDER`), and the FG-OFF block's G6
  check in the gate (seeded with bench at screenshot-gate.mjs:5611, asserted at :5648). LB2 ships bench press, so both
  would turn red. (Lines 5315 and 5402 are BUG-15 and LT-3 blocks that only seed bench sessions; they assert
  nothing about How-to.)
- **Phase-0 fix (preferred):** the supervisor asks HT-3's builder, while HT-3 is still open, to derive both controls
  from data: the first library id in `exercises.json` order with no How-to. The custom control `HT_CUSTOM` stays
  permanent. The supervisor also adds one line to the HT-5..HT-10 cards (not built yet): any "no How-to" control reads
  that shared helper, never a literal id.
- **Fallback, if HT-3 merges first:** the switch HT plan R17 already sanctioned ("HT-12 must switch it deliberately,
  in the same PR"). It is made once, in LIB-2, as a data move with the owner told. It is never made silently.

### 5.6 Offline, data, cost
- **Offline:** everything is static and bundled. C17 runs on every library chunk. A unit check proves every `ht-*`
  chunk is in the service-worker list.
- **Not verified:** whether the service worker precaches inside the APK's WebView (about 30 MB raw copied on first
  launch, est.). The rehearsal measures it on the APK.
- **No new saved or sent data, and no new paid service.** Actions minutes are free for public repos, and research uses
  free public sources. Agent time uses the owner's existing Claude plan (usage-limit risk, 10).
- **No new npm dependency.** FNV-1a is a few lines, and everything else reuses the HT-1..HT-10 tooling (Playwright,
  the pixel diff, esbuild). Any exception is a supervisor decision (AGENTS file ownership).

---

## 6. Batches in order, with ids and the owner's approval per batch

Legend: `*` tier A · (P:X) template parent of X · (T) template child · (D) derived from an approved 8 plate · no mark =
hand-authored · pA / pB = anchor approved on pilot A / pilot B.

### 6.1 Pilot sheets (anchors first)
- **Pilot A, card LIB-8: 19 plates, 10 of them tier A.** Drawn in phase 0 if builder slots free up, otherwise on days
  0-3.
  - It must be answered before LB1's `straight_arm_pulldown` (hinge) and `inverted_row` (supine) start, and before
    any LB2 child. LB1's D plates need only the 8, so they can start first.
  - Plates:
    - `dumbbell_biceps_curl` (dumbbell primitive, CURL);
    - `upright_row` (engine front view);
    - `barbell_overhead_press`;
    - `dumbbell_bench_press` (BENCH, supine);
    - `incline_dumbbell_press`;
    - `dumbbell_shoulder_press` (SEATPRESS, `inclineBench`);
    - `barbell_row` (HROW);
    - `romanian_deadlift` (HINGE);
    - `single_leg_romanian_deadlift` (single leg, drawable-fault);
    - `barbell_shrug` (SHRUG, zoom F1);
    - `reverse_lunge` (SPLIT);
    - `box_jump` (airborne);
    - `triceps_pushdown` (PUSHDOWN);
    - `rope_triceps_pushdown` (`rope`);
    - `plank` (hold plate);
    - `mountain_climbers` (cycle plate);
    - `dumbbell_fly` and `bent_over_dumbbell_rear_delt_fly` (view-conflict go/no-go);
    - `pec_fly` (FSEAT, front-view pivot arms go/no-go).
  - Layer kinds shown: band, curl, rope, EZ, cupped and front-rack hands, and the back-pain box wording.
  - The E-R5 spike appears as a status note.
- **Pilot B, card LIB-11: 5 plates.** Shown with the LB2 sheet, and answered before LB6 starts.
  - Plates: `smith_machine_bench_press` (`smith`), `cable_fly` (CFLY), `push_up` (PUSHUP), `seated_leg_curl`
    (`legCurlMachine`), `crunch` (SUPCORE, floor supine).
  - The E-R5 go/no-go on `side_plank` and `russian_twist` renders.
  - Layer kinds shown: palm-flat, dip bar, kettlebell, ab-wheel, ball and implement hands, and the text-only feel
    state.
- **Pilot plates merge pinned but with no button.** Their app modules and layers ship in their own batch.

### 6.2 Batches LB1-LB10 (145 ids)

| # | Batch | N | Tier A | Modes | Needs before it (engine and layers) |
|---|---|---|---|---|---|
| LB1 | Pulls, hangs, pulldowns, lever and leg-press variants | 14 | 4 | D9 H5 | LIB-2..7; pilot A answered (hinge, supine anchors); `assistMachine`, `chestRowMachine`, `band`; floor-sit, kneel; back box |
| LB2 | Free-weight presses and lying arm work | 12 | 12 | P2 T6 H4 | pilot A answered; `inclineBench`, `declineBench` |
| LB3 | Hinges, rows, shrugs, upright row | 15 | 11 | P3 T7 H5 | HT-11; `landmine`, `romanChair` |
| LB4 | Squats and lunges | 14 | 5 | D3 P1 T5 H5 | LIB-12 (cupped, front-rack); `wall` |
| LB5 | Arms (PR a: 6 triceps; PR b: 13 curls) | 19 | 2 | P2 T8 H9 | `rope`, `preacherPad`; curl and rope hands |
| LB6 | Smith, cable press and fly, lever machines, front-view seated machines | 16 | 4 | D1 P2 T10 H3 | pilot B answered; `smith`, `pecDeck`, `latRaiseMachine`, `hipAbdAddMachine`, `pulloverMachine`, `crunchMachine` |
| LB7 | Raises, rear delts, cuff, push-ups, dips | 14 | 3 | P1 T3 H10 | palm-flat hand; `dipBars`; text-only feel state |
| LB8 | Leg machines, calves, glutes | 13 | 1 | H13 | `hackSled`, `pendulum`, `legExtMachine`, `legCurlMachine`, `calfMachine`, `ankleCuff`; prone, bridge |
| LB9 | Core | 15 | 1 | P1 T5 H9 | LIB-20 (E-R5); `abWheel`, `medBallOptional`; quadruped |
| LB10 | Conditioning, carries, kettlebell | 13 | 4 | H13 | `sled`, `jumpRope`, `battleRope`, `medBall`, `kettlebell`; ball and implement hands |

Totals: 145 ids; D 13, P 12, T 44, H 76; tier A 47. Checked by script.

**Ids per batch:**
- **LB1:** `chin_up`* (D), `hanging_knee_raise`* (D), `assisted_pull_up`*, `inverted_row`, `close_grip_pulldown` (D),
  `underhand_lat_pulldown` (D), `single_arm_lat_pulldown` (D), `straight_arm_pulldown`, `chest_supported_row`,
  `resistance_band_row`, `incline_machine_press` (D), `shoulder_press`* (D), `horizontal_leg_press` (D),
  `leg_press_calf_raise` (D)
- **LB2:** `dumbbell_bench_press`* (P:BENCH, pA), `barbell_bench_press`* (T), `incline_dumbbell_press`* (T, pA),
  `incline_barbell_bench_press`* (T), `decline_bench_press`* (T), `close_grip_bench_press`* (T),
  `dumbbell_shoulder_press`* (P:SEATPRESS, pA), `barbell_overhead_press`* (pA), `arnold_press`* (T),
  `dumbbell_fly`* (pA), `skull_crusher`*, `dumbbell_pullover`*
- **LB3:** `barbell_row`* (P:HROW, pA), `pendlay_row`* (T), `one_arm_dumbbell_row`, `t_bar_row`* (T),
  `landmine_row`* (T), `romanian_deadlift`* (P:HINGE, pA), `dumbbell_romanian_deadlift`* (T),
  `single_leg_romanian_deadlift`* (pA), `conventional_deadlift`* (T), `sumo_deadlift`* (T), `back_extension`*,
  `upright_row` (pA), `dumbbell_shrug`, `barbell_shrug`* (P:SHRUG, pA), `cable_shrug` (T)
- **LB4:** `front_squat`* (D), `goblet_squat`* (D), `box_jump`* (pA), `bodyweight_squat` (D), `jump_squat`*,
  `wall_sit`, `bulgarian_split_squat` (T), `walking_lunge` (T), `reverse_lunge` (P:SPLIT, pA), `forward_lunge` (T),
  `step_up`, `bodyweight_lunge` (T), `bodyweight_split_squat` (T), `pistol_squat`*
- **LB5a:** `triceps_pushdown` (P:PUSHDOWN, pA), `rope_triceps_pushdown` (T, pA), `straight_bar_triceps_pushdown` (T),
  `single_arm_triceps_pushdown` (T), `overhead_cable_triceps_extension`*, `dumbbell_overhead_triceps_extension`*
- **LB5b:** `dumbbell_biceps_curl` (P:CURL, pA), `alternating_dumbbell_curl` (T), `barbell_curl` (T),
  `ez_bar_curl` (T), `hammer_curl` (T), `reverse_curl` (T), `cross_body_hammer_curl`, `cable_curl`,
  `bayesian_cable_curl`, `preacher_curl`, `incline_dumbbell_curl`, `concentration_curl`, `wrist_curl`
- **LB6:** `smith_machine_bench_press`* (T, pB), `smith_machine_incline_press`* (T),
  `smith_machine_shoulder_press`* (T), `smith_machine_shrug` (T), `smith_machine_squat`* (D), `cable_chest_press`,
  `cable_fly` (P:CFLY, pB), `low_to_high_cable_fly` (T), `high_to_low_cable_fly` (T), `machine_pullover`,
  `machine_crunch`, `pec_fly` (P:FSEAT, pA), `machine_lateral_raise` (T), `rear_delt_fly` (T), `hip_abduction` (T),
  `hip_adduction` (T)
- **LB7:** `cable_lateral_raise`, `dumbbell_front_raise`, `cable_rear_delt_fly`,
  `bent_over_dumbbell_rear_delt_fly` (pA), `face_pull`, `cable_external_rotation`, `resistance_band_pull_apart`,
  `push_up` (P:PUSHUP, pB), `incline_push_up` (T), `renegade_row`*, `pike_push_up`* (T), `diamond_push_up` (T),
  `weighted_dip`*, `bench_dip`
- **LB8:** `hack_squat`, `pendulum_squat`, `leg_extension`, `seated_leg_curl` (pB), `lying_leg_curl`,
  `standing_leg_curl`, `seated_calf_raise`, `standing_calf_raise`, `bodyweight_calf_raise`, `hip_thrust`*,
  `glute_bridge`, `cable_kickback`, `resisted_hip_flexion`
- **LB9:** `crunch` (P:SUPCORE, pB), `cable_crunch`, `reverse_crunch` (T), `plank` (pA), `ab_wheel_rollout`*,
  `dead_bug` (T), `v_up` (T), `flutter_kicks` (T), `hollow_body_hold` (T), `bird_dog`, `superman`, `side_plank`,
  `russian_twist`, `pallof_press`, `bicycle_crunch`
- **LB10:** `sled_push`, `sled_pull`, `farmer_s_carry`*, `burpee`, `mountain_climbers` (pA), `jumping_jacks`,
  `high_knees`, `jump_rope`, `battle_ropes`, `medicine_ball_slam`*, `wall_ball`*, `bear_crawl`, `kettlebell_swing`*

**Why this order:**
- LB1 shakes the pipeline down on near-copies of approved plates.
- The most-used lifts and the tier-A injury path come next (presses, hinges, squats), which is plan O4's
  recommendation. This plan replaces HT-12.
- The engine-hard cases come last, so their engine work never blocks early batches.

### 6.3 Flow per batch, and the owner's approval
1. **Research.** Cards are verified and stamped one batch ahead (4.3).
2. **Build.**
   - The builder opens a draft PR with a design note for H plates and new composers, before bulk building (the "plan
     hard cards" rule). The supervisor reads it at the next tick.
   - Plates pass PQ-H, and layers pass the lint and checks.
   - The PR carries `origin/main`, merged with a merge commit.
3. **The visual critic** runs (3.4), then the fresh **PR reviewer**. The reviewer covers code, scope, tests that bite,
   and the reader's view with its planted layer defects.
4. **Owner sheet:** the plates of that batch, about every 2 days, 20-30 min, per exercise.
5. **Pin, merge `main`, full CI verdict, merge** in checklist order. Then the APK from that green run goes to the
   owner, with the fingerprint step checked.

**Stalled-batch rule (owner decision 8):** a batch waiting on its sheet for more than 2 days moves to the end of the
checklist, so it doesn't block the batches behind it. Merge order otherwise never changes. This works because each
batch card's dependency on the previous batch (section 7) is checklist order only; its real prerequisites are the
"Needs before it" column of 6.2, and a batch jumps ahead only when those are met.

---

## 7. Build cards (merge order)

All builders run in auto mode on `claude/lib-*` branches, with draft PRs from the first push and a fresh reviewer per
PR. Model `opus` = claude-opus-5-5, `sonnet` = claude-sonnet-5. `depends_on` = must merge first. "Before HT-10" means
the card may **build** earlier, in a free builder slot (M1 always has priority, and the cap is 4 builders), using only
new paths, and merges its dependencies' heads in before review. It still **merges** in this order after HT-10.

| Order | Id | Outcome | depends_on | Model | Size | Before HT-10? |
|---|---|---|---|---|---|---|
| — | LIB-1 | Scale rehearsal on `claude/lib-rehearsal`, with a draft PR titled "[do not merge]" (the AGENTS draft-PR rule), closed and the branch deleted after. The 145 ids get the 8's content cloned in, then it measures K, typecheck/vitest/build time, chunk sizes, APK, SW precache in the APK WebView, `ids.ts` and footprint, `ht-index`, and tap-to-plate with 153 loaders. It also runs the full existing gate on that all-153 build and lists every non-HT block that changes when library cards gain a How-to entry. Its numbers replace every est. here | HT-10 | sonnet | S | no |
| 1 | LIB-2 | Scale core (5.2, 5.3): the 8 as data (incl. HT-5..HT-8's layer generators), per-file `inputsSha256`, library tree, plates page builder (2.7), D/T helpers with `PARAMS`, per-batch golden files with parent-hash chain, `coverage.ts` status, hash-set `ids.ts`, generated `LibId`, `ht-index` chunk, derived fixtures, the total-size re-set (5.1), library negative control; the 8 byte-identical | HT-10, LIB-1 | opus | L | design note only |
| 2 | LIB-3 | Plate QA gate: PQ-H1..H10, flags F1-F7, vocabulary and envelope measured on the 8, label-search helper, generator refuses a non-ok report; mutation proofs | LIB-2 | opus | M | yes (new `library/qa/`) |
| 3 | LIB-4 | Library CI: runner on HT-3's exports, rebuild, shard and verdict scripts, one-shard-per-id test, C-TZ, changed-id draft mode (the supervisor wires `.github`, add-only) | LIB-2, LIB-3, HT-10 | opus | M | no |
| 4 | LIB-5 | Shared layer modules: new archetype data, equipment moves, back-pain box and its lint rule, the other add-only lint rules (4.4), research source registry (data only), the 19 shared cards, C15 stamps for the 8 | LIB-2 | opus | M | cards yes; code no |
| 5 | LIB-6 | Close-up renderer: all 8 golden-B close-ups byte for byte, with the legacy fallback (2.6); layers page builder (2.7) | LIB-2, HT-4 | opus | L | yes, after HT-4 merges |
| 6 | LIB-7 | Radial hand pairs: band, curl, rope, EZ, D-handle | LIB-6 | opus | M | yes |
| 7 | LIB-8 | Pilot A: 19 anchor plates, their composers (`inclineBench`, `rope`, `pecDeck`) and specs, pinned, no button | LIB-3, LIB-4 | opus | L | yes (authoring and sheet) |
| 8 | LIB-9 | LB1 (14) | LIB-2..LIB-8 | opus | L | no |
| 9 | LIB-10 | LB2 (12) | LIB-9, pilot A yes | opus | L | no |
| 10 | LIB-11 | Pilot B: 5 anchors, `smith` and `legCurlMachine` composers, E-R5 renders for go/no-go | LIB-8 | opus | M | no |
| 11 | HT-11 | Size (planned card) | LIB-2 | opus | M | no |
| 12 | LIB-12 | Hand views (palm-flat, cupped, front-rack, ball) and pairs (dip bar, kettlebell, ab wheel, implements) | LIB-7 | opus | M | yes |
| 13 | LIB-13 | LB3 (15) | HT-11, LIB-10 | opus | L | no |
| 14 | LIB-14 | LB4 (14) | LIB-12, LIB-13 | opus | L | no |
| 15 | LIB-15 | LB5a triceps (6) | LIB-14 | opus | M | no |
| 16 | LIB-16 | LB5b curls (13) | LIB-15 | opus | L | no |
| 17 | LIB-17 | LB6 (16) | LIB-11, LIB-16 | opus | L | no |
| 18 | LIB-18 | LB7 (14) | LIB-17 | opus | L | no |
| 19 | LIB-19 | LB8 (13) | LIB-18 | opus | L | no |
| 20 | LIB-20 | E-R5 roll and yaw, `[golden update]`, L1 byte-identical on golden A and every pinned page | LIB-2 | opus | M | spike yes (scratch) |
| 21 | LIB-21 | LB9 (15) | LIB-19, LIB-20 | opus | L | no |
| 22 | LIB-22 | LB10 (13) | LIB-21 | opus | L | no |
| 23 | LIB-23 | Release candidate: full regression and full QA once, on the finished build and exact APK; owner device checks; named list; C6 release check | all | opus | M | no |
| cond. | LIB-24 | HT-11b body-map base dedupe (trigger 5.1) | HT-11 | opus | M | no |
| cond. | LIB-25 | `poly` primitive, `[golden update]` (trigger 2.5) | LIB-3 | opus | M | no |

**Supervisor actions in phase 0 (no builder; now):**
1. Amend the HT-10 card (5.4).
2. Ask HT-3's builder for the data-driven library control, in both the harness and the FG-OFF block, and add the
   shared-control line to the HT-5..HT-10 cards (5.5).
3. At HT-4's merge, confirm it vendors golden B `b3a90af`. Its branch already re-vendored at that pin (`baa072c`,
   `cb6fa50`), replacing `16a8edc`.
4. Fill golden B's 35 null source fields (29 `checked`: 19 back squat, 8 chest press, 2 leg press; 6 `access`, chest
   press; counted at `b3a90af`, and HT5-A2 fails on them), and correct the HT-5 and HT-9 cards' disclaimer text
   ("This is coaching guidance, not medical advice.") to the owner's line.
5. Hold the HT-3 CI stability entry condition.
6. Start research wave 0.
7. Publish this plan to the owner, and mark HT-12 in the HT plan (4.2) as replaced by this plan, so there is one
   document per topic and no duplicate presses card.

**Who does what:**
- **Opus:**
  - all plates, composers, templates and sheet copy;
  - research writers, the content critic, the safety checker and the visual critic;
  - PR reviewers;
  - the supervisor.
- **Sonnet:** the source fetcher, the rehearsal, generator and rechain runs, and contact-sheet assembly (a script).
- **Lanes:** at most 4 builders (3 drawing, 1 enabler or fix). Research agents and critics are not builders, so the
  peak is about 9 agents.
- **Sessions are archived when their role ends.**

---

## 8. Owner decisions (each has a default, so work never waits)

1. **Go-ahead:** start the moment HT-10 merges, in this order. *Default: yes.*
2. **Scope:** all 153; custom exercises never; no plate-less "Level 1". *Default: yes.*
3. **The five conventions** (hold, cycle, drawable-fault, small-motion zoom, airborne), judged on pilot A. *Default:
   as drawn there.*
4. **View conflicts** (`dumbbell_fly`, `bent_over_dumbbell_rear_delt_fly`), go/no-go on pilot A. *Default: ship the
   view that passes every check with critic scores ≥ 4; otherwise the named list.*
5. **Roll and yaw** (side plank, Russian twist, bicycle crunch), go/no-go on pilot B. *Default: if E-R5 fails, the
   named list, decided at the release candidate.*
6. **Back-pain box** wording (NHS-sourced triggers, 30 words or fewer, a region-neutral "Get emergency help now."
   instead of the UK-only "Call 999"), on pilot A. *Default: the critic-checked draft.*
7. **Text-only feel state** where no drawn muscle is honest, on pilot B. *Default: yes.*
8. **Stalled-batch rule** (6.3). *Default: yes.*
9. **Flags** (zoom scale on shrugs, wrist curl and likely the calf raises; drawable-fault Mistakes), approved per
   plate on the sheets.
   *Default: approve as named exemptions.*
10. **Download size:** the APK grows to about 8-11 MB (est.). *Default: accept. HT-11b triggers above 6 MB gz of
    How-to assets.*

Already settled by the owner: no paid expert review (plan O1, now closed), no sources or evidence labels in the UI (LR-23), his safety line
verbatim, and "next batch" (plan O4, answered by this plan).

**What the Play Store upload needs from this plan:**
- LB1-LB10 merged, or the remaining ids on a named list he approved.
- LIB-23 green on the exact release APK: full regression, full QA, the release-mode C6 check (C6R: every id shipped
  or left-out by decision), C15 stamps on every sheet, and `howto-verdict`.
- His device checks on that APK: font scale (O9), open time, Trace and shimmer smoothness, TalkBack, and the
  five-second test for new tier-A hand keys.
- No change to data collection. How-to reads and sends nothing (C17), and storage keys are unchanged, so the Play
  data-safety answers should not change. **Not verified:** whether any Play health-content declaration applies. The
  owner checks this in the Play Console at upload.
- Play needs a "not a medical device…" line in the store description, and an in-app reminder to consult a
  healthcare professional (P3). It does not need sources or contacts (LR-23 plan, section 2).
- Only the owner publishes. Signing and keys are untouched.

---

## 9. Time estimate

**Assumptions** (each can move the total):
1. Pace, from the first 8:
   - H plates and parents 4 Opus-hours each; D and T plates 1.5 h;
   - composers 2 h;
   - layer spec 2 h full, 1 h difference;
   - QA, critic and fixes 0.75 h per id;
   - research 1.5 h per full card, 0.5 h per difference card and 1 h per shared card.
2. Builders do about 16 productive hours a day in auto mode, with at most 4 at once.
3. A full CI run takes about 30-35 min, and each batch needs about 3.
4. The owner answers a sheet within about 1 day. This is the largest unknown.
5. About 2 real content errors per first draft, so one fix round.
6. Opus usage limits hold for about 1,370 agent-hours over about 5 weeks. **Not verified.**

**Effort (est., agent-hours):**

| Work | Hours |
|---|---|
| Plates: 88 full-effort (76 H + 12 parents) × 4 + 57 light (13 D + 44 T) × 1.5 | ≈ 440 |
| Composers: 30 (13 shared + 17 single-use, 2.1) × 2 | ≈ 60 |
| Layers: 94 × 2 + 51 × 1 | ≈ 240 |
| QA, critics and fixes 145 × 0.75 ≈ 110; PR reviewers, content critics and safety checks ≈ 50 | ≈ 160 |
| Research: 94 × 1.5 + 51 × 0.5 + 19 × 1 | ≈ 190 |
| Enablers and RC: LIB-1..7, 12, 20, 23, HT-11 | ≈ 170 |
| Supervisor | ≈ 110 |
| **Total** | **≈ 1,370, about 93 % Opus** |

**Calendar (day 0 = HT-10 merged; est.):**

| Day | Milestone |
|---|---|
| before 0 | phase 0: supervisor actions; research wave 0; LIB-3, LIB-6, LIB-7 and pilot A built in free slots; pilot A sheet to the owner; E-R5 spike |
| 0-3 | LIB-1 (half a day); LIB-2; LB1 drawing from LIB-2's first push |
| 3-6 | LIB-2..LIB-8 merge; LB1 sheet |
| 7 | **LB1 on the phone** |
| 9 | LB2 (pilot B shown with its sheet) |
| 10-11 | LIB-11, HT-11, LIB-12; LB3 on day 11 |
| 13-25 | LB4 day 13, LB5a/b days 14-15, LB6 day 17, LB7 day 19, LB8 day 21, LIB-20 day 21, LB9 day 23, LB10 day 25 |
| 25-29 | LIB-23 release candidate, owner device checks, named list |

- **Expected:** about 4½ weeks after HT-10 merges (the calendar's day 29, plus a few days of slack for fix rounds
  and late sheet answers).
- **Best:** about 3½, with pilot A approved before day 0 and same-day replies.
- **Worst:** about 8, with CI pixel instability like HT-3's, E-R5 reworked, a convention rejected on pilot A, or Opus
  throughput halved by usage limits.
- **Checkpoint:** the supervisor re-projects after LB2 and tells the owner if the end date moved by more than a week.

**Critical path:** HT-10 → LIB-2 → LIB-3/LIB-4 → (LIB-5..LIB-8 merges, each a CI cycle) → LB1 → LB2 → … → LB10 → LIB-23.
- On the path: the owner's answer on pilot A before LB1's hinge and supine plates and LB2's children start, HT-11
  before LB3, LIB-12 before LB4, and LIB-20 before LB9.
- Off the path: research runs one batch ahead.
- If phase 0 gets no free builder slot, pilot A moves to days 0-3 and the path grows by about 3 days.

---

## 10. Risks and mitigations

| # | Risk | Mitigation |
|---|---|---|
| 1 | New plates are worse than the 8 | Same locked engine and classes (PQ-H2); hard checks PQ-H1..H10; flags that become owner-named exemptions, never margins; calibrated critic (anchors plus planted defects); owner-approved anchors first; all authoring on Opus; the owner sees the exact pinned bytes; L1-L4 on every shipped id forever |
| 2 | Critic is lenient or hallucinates | Unlabelled approved anchors plus planted defects each run; a failed calibration means a fresh critic; its scores are shown beside the pictures on the owner sheet |
| 3 | A rejected anchor wastes work | Anchor rule: nothing is built from an unapproved anchor; pilots come one batch or more ahead; a rejection re-plans only the dependent ids |
| 4 | A template or parent card change silently moves children | Frozen templates (`v2` files); L1 refuses byte moves; parent hash chained into child golden entries and card stamps |
| 5 | A composer can't draw a closed angled or moving part | PQ-H9; conditional `poly` primitive by golden update (LIB-25) |
| 6 | E-R5 fails the bar | Spike in phase 0; go/no-go on pilot B; named list for 3 ids with renders |
| 7 | Renderer can't reproduce all 8 | Legacy scripts frozen for any it can't; the 5 `render-*` must reproduce; critic and owner flag for the affected family |
| 8 | CI pixel instability (HT-3 red today) | Entry condition of 5 identical reruns; golden-vs-golden 0 px per shard; root-cause, never retry; the threshold never changes (plan R6) |
| 9 | Gate time or queueing | Shards sized by measurement; verdict proves full coverage; changed-id shards on drafts; full runs on ready heads and main |
| 10 | Opus usage limits or cost (≈ 1,370 h) | D and T modes, difference cards, one critic per batch, no duplicate checks; degraded calendar named (up to 8 weeks); re-projection after LB2 |
| 11 | Owner review fatigue (12 sheets) | Anchors front-loaded, so batch sheets hold plates only; flagged and tier-A items first; per-exercise answers; stalled-batch rule |
| 12 | Content accuracy at volume | Quote-backed claims, an independent critic, planted mistakes, 10 % re-fetch, tier-A safety checker, strict C15 stamps |
| 13 | Thin evidence blocks an id late | The 10 thin ids are researched in phase 0; `blocked:evidence` reaches the owner early |
| 14 | Size and first-launch cost | HT-11 before LB3; per-chunk ceilings; fixed per-exercise mean; HT-11b trigger; rehearsal measures SW precache on the APK |
| 15 | `ids.ts` wrong for some id | Shipped-set hashes only; collision refusal over all of `exercises.json`; exhaustive unit test; `generate --check` on new ids |
| 16 | Editing other tasks' gate blocks | HT-10 amended before it is built; library runner built from HT-3's exports; control made data-driven in HT-3 (fallback: plan R17 authority, owner told) |
| 17 | Merge conflicts on generated files | Per-batch golden files; per-file `inputsSha256`; regenerate, never hand-merge; checklist order |
| 18 | Scratchpad loss | Verified cards and pilot specs pushed to `claude/libht-research` and the pilot branch as they pass |
| 19 | M1 slips or phase-0 slots never free | The library starts at HT-10 regardless; pilot A then lands on days 0-3 (+3 days) |
| 20 | Pressure from a Play Store date | The only relief valve is the owner's named list; nothing ships below the bar |
| 21 | Android font scale distorts plates | O9 pass rule on every plate; checked on the RC APK |
| 22 | A new How-to entry changes another task's gate block (many blocks seed library ids, e.g. bench press in BUG-15, LT-3 and plate-sense) | LIB-1 runs the full existing gate on an all-153 build and lists every change; the app side is fixed, and a block whose own assertion assumes "no How-to" goes to the supervisor for that task's decision, never a silent edit |
| 23 | A plate shows one implement where the library lists two (21 new ids) | Sourced variant line required by the lint (4.4); the card says whether each claim holds for both |
| 24 | Batch or pilot chrome drifts from golden A | One page builder (2.7), proven by rebuilding golden A and golden B byte-identically; L3 compares against the app's shared chrome |
| 25 | A small motion fails PQ-H3 late (calf raises, flutter kicks, external rotation) | Checked first in their batch; zoom convention with an F1 flag, or the named list; the minimum is never lowered |
