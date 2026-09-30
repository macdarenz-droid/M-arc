# How to do it for the whole library: hybrid design with automated visual QA

Design for the supervisor and the judges. Written 2026-09-30. Nothing in any repo was changed.
Inputs read: `census.md`/`census.json`, `pipeline.md`, `content.md` (this folder); the HT build plan (2.2-2.11, 4, 5, 6);
GA sections 3, 4.4, 6 and appendix B; golden B README and `copy-lint.mjs` (b3a90af); engine `SPEC.md`, `plate.mjs`,
`equipment.mjs`, `hand.mjs`; on main `cae1725`: `tools/plates/golden.mjs`, `plates.json`, `GOLDEN.json`, `ids.ts`,
`ids.test.ts`, `.github/workflows/build-apk.yml`, `scripts/screenshot-gate.mjs` (HT blocks).
Numbers marked **est.** are my arithmetic; every other number names its source.

---

## 0. In plain words (for the owner)

- **Every one of the 145 remaining library exercises gets the full How-to**: the plate with Trace and Mistake, and
  every layer under it. Nothing is dropped in the plan. Your own custom exercises never get one (a guide written for
  a library exercise can be wrong for yours).
- **Three ways to draw a plate.** 13 are small changes to an approved plate (chin-up from the pull-up). 65 come from
  15 new templates, where a family is tight (9 standing curls share one). 67 are drawn by hand from the closest
  approved plate, as the first 8 were. Every plate uses the same engine, byte for byte, that drew your approved 8.
  So the body, lines, colours and labels are the same code.
- **A robot quality gate checks every plate before anyone looks.** It checks label collisions, contacts (hands on
  the bar, feet on the floor), readability at 390 px, contrast in all 5 themes, and that the Mistake really shows.
  It also checks that the drawn angles match the researched ones. Then a separate critic compares each new plate
  with your approved 8, side by side. The critic is tested each time on a plate with a planted flaw, and must
  catch it.
- **You see one contact sheet per batch (10 batches, about 30-45 minutes each).** The sheet shows only what the
  robots can't judge: does it look as good as the 8, and is this how you want it taught. Flagged items come first.
  Once you say yes, the plate is locked like the first 8. CI then proves on every change that the app shows
  exactly what you approved.
- **It lands on your phone batch by batch.** After each merge you get the APK, and the button appears only on the
  exercises you approved. The Play Store build waits until all 153 are done and the final full check passes.
- **Time: about 4 weeks after the current How-to tasks finish** (best case about 3, worst case about 7). The limits
  are the drawing work, your review turnaround, and CI. Section 6 gives the assumptions.
- **What I need from you:** a yes to this plan; one look at 6 "direction" plates in the first sheet (how holds like
  the plank and repeating moves like mountain climbers are shown); then one sheet per batch. No money, no new
  services and no new saved or sent data.

---

## 1. Scope and order

### 1.1 Who gets a full How-to
- **All 153 library ids** (8 done + 145 new): plate (golden-A standard) plus all layers (golden-B standard).
- **Excluded by design:** custom exercises only (`custom: true`, `custom_<base36>`). Reason: content is researched per
  library id; a name match could put library advice on a different movement. Linking a custom exercise to a guide
  would need a stored link field, which is new saved data, so it is not proposed (content.md 8).
- **No planned exclusion among the 153.** No stretches or mobility drills exist in the library (census 6). The 12
  tier-3 and 26 tier-2 ids (census 1.5) get plates through three decisions below, not exclusion.
- **Not built:** a "Level 1" How-to without a plate (plan O8). It would ship something below the approved bar.
- **Last resort, owner only:** an id that cannot reach the bar after two approaches with no new evidence (AGENTS.md
  rule) goes on a **named list** with its reason. The owner either OKs "left out" before the Play Store build or
  waits. It is never shipped thin and never dropped silently. The release check (C6 add-only) fails while any
  `coverage.ts` row is `left-out` without the owner's recorded OK.

### 1.2 Three plate conventions for the hard cases (same locked chrome, no golden-A change)
The chrome always shows Trace, Mistake, 1-3 tells and a tempo strip (plan 2.7 F3). These conventions keep it
meaningful. They change what a plate teaches, not how it is drawn, so the owner approves them once, on 6
**direction plates** in the LB1 sheet (6.3).

| Convention | For | Start pose (dashed) | End pose (solid) | Trace | Tempo |
|---|---|---|---|---|---|
| **Hold plate** | isometric: plank, side plank, wall sit, hollow body hold, Pallof press (hold phase); dynamic holds bird dog, dead bug | the entry position (plank: forearms and knees down; wall sit: standing on the wall) | the held position | the path into the hold (hips rising into line; hips sliding down the wall) | e.g. Set 2 / Hold 30 / Rest. The strip is proportional (`flex: s`, sheet.mjs:86), so the hold dominates, which is the point. PQ-4 proves it fits at 340 px |
| **Cycle plate** | cyclic or travelling: mountain climbers, high knees, jumping jacks, jump rope, battle ropes, bear crawl, sled push and pull, farmer's carry, burpee | phase A of one cycle | phase B (burpee: `via` poses carry the squat-thrust sequence) | the limb or point that drives the cycle (knee, hand, hip, bell) | one cycle, e.g. Drive 0.5 / Switch 0.5 |
| **Drawable-fault rule** | faults that need roll or yaw (one-arm row, renegade row, single-arm pulldown, Pallof press, bird dog, single-leg RDL; census 4.2) | normal | normal | normal | normal |

For the drawable-fault rule, the Mistake pill shows the most common fault **the engine can draw**. The card must source
it as a real, common fault. The rotation fault is taught in the layers (a handling mistake or posture close-up
text). Small motions (shrugs 3-5 cm, wrist curl about 13 px of fist travel; census 6) use `camera.maxScale`. That is
flagged F1 (3.3) for the owner, and the hand close-up carries the detail.

**Roll and yaw (side plank, Russian twist, bicycle crunch):** an engine extension (2.3, E-R5). If it cannot reach
the bar, these 3 go to the owner's named list with the rendered attempts attached. That is an owner decision, not
a silent drop.

### 1.3 Order: 10 owner-review batches (LB1-LB10)
Each batch joins several census template groups (B01-B28), so templates stay tight inside a batch. The order is:
1. the pipeline shakedown on near-copies of approved plates;
2. then the most-used lifts and the tier-A injury path (presses, hinges, squats), as plan O4 recommended;
3. then the engine-hard cases last, so their engine work has time and never blocks early batches.

Every member id is in census.json. `batch.py`-style check: 145 ids, each once.

| # | Batch | Census groups | Ids | Authoring (D/T/H, 2.1) | Tier A (content 5.1) | Needs first |
|---|---|---|---|---|---|---|
| LB1 | Near copies: pulls, hangs, pulldowns, lever and leg-press variants | B01, B02, B03, + incline_machine_press, shoulder_press, horizontal_leg_press, leg_press_calf_raise | 14 | D9 H5 | 4 | assist-machine, chest-row, band composers; floor-sit pose |
| LB2 | Free-weight presses and lying arm work | B07, B09, B13 | 12 | T8 H4 | 12 | incline/decline bench composers; supine, incline, decline poses; first real `dumbbell` primitive plate; gate negative-control switch (R17) |
| LB3 | Hinges, rows, shrugs | B04, B22 (without kettlebell swing), B15 | 15 | T10 H5 | 11 | landmine, roman-chair composers; hinge, single-leg poses; back-pain box |
| LB4 | Squats and lunges | B19, B21 | 14 | D3 T6 H5 | 5 | wall composer; split, airborne, wall poses; front-rack hand view |
| LB5 | Arms | B16, B17, B18 | 19 (2 PRs: 6 + 13) | T12 H7 | 2 | rope composer; preacher pad; curl hand pairs; rope and cupped hand |
| LB6 | Smith, cable press and fly, lever machines, seated front-view machines | B08, B12, B05 rest, B06 | 16 | D1 T12 H3 | 4 | Smith composer; front-view seated machine composers (pec deck, abduction) |
| LB7 | Raises, rear delts, cuff, push-ups, dips | B14, B10, B11 | 14 | T4 H10 | 3 | palm-flat hand view; dip-bar composer; plank pose |
| LB8 | Leg machines, calves, glutes | hack, pendulum, B24, B25, B23 | 13 | T6 H7 | 1 | hack-sled, pendulum, leg-curl, calf, ankle-cuff composers; prone pose |
| LB9 | Core | B26, B27 | 15 | T7 H8 | 1 | E-R5 roll and yaw; ab-wheel composer; quadruped, kneeling poses; hold plates |
| LB10 | Conditioning and implements | B28 + kettlebell_swing | 13 | H13 | 4 | sled, kettlebell, battle-rope, jump-rope, med-ball composers; implement hand views; cycle plates |

Totals: 145 ids; D 13, T 65 (15 template parents + 50 children), H 67; tier A 4+12+11+5+2+4+3+1+1+4 = all 47 new
tier-A ids (content 5.1). Membership and tier counts were checked by script against `census.json` (145 ids, each
once, none missing).

Until an id's batch merges, it shows **no button**, exactly as today (`hasHowTo` false). There is no "coming soon"
text (content.md 8). `coverage.ts` holds its status (`queued | researching | drawing | review | shipped |
blocked:<reason> | left-out:<reason>`).

---

## 2. Engine work first

### 2.1 Three authoring modes
- **D, derived (13):** the spec imports an approved spec and overrides named parameters. Examples: chin-up = pull-up
  with an underhand grip and elbows closer; close-grip pulldown = pulldown with a V-handle.
- **T, template child (50) under 15 template parents.** A template is `library/templates/<family>.mjs`, exporting
  `make(params, facts)`, where `facts` is the verified card's plate-facts block. Its first member (the **parent**) is
  hand-authored and QA-clean before any child starts. A child spec is a parameter set plus visible overrides (label
  boxes, camera).
  - Templates: bench (6 in LB2 + 2 Smith in LB6), seated DB press (2 + Smith 1), hinge row (4), hinge (4), shrug (2
    + Smith 1), split stance (6), standing curl (8), pushdown (4), cable fly (3), front-view seated machine (5),
    push-up (4), hip thrust/bridge (2), cable hip (2), calf (2), supine core (7).
  - Eligibility rule: at least 3 members share view, equipment set and pose class, and differ only by parameters.
- **H, hand-authored (67):** cloned from the closest approved spec (census 1.1 "closest") and tuned by hand, like
  the first 8. Examples: the front-view raises, dips, floor core oddities, every conditioning move.

A template edit re-renders its children and changes their bytes. After a child is approved, L1/L2 (5.3) refuse
that change until each changed child is re-approved (golden update, 3.5). So templates are effectively frozen once
their children ship. A needed change becomes a `v2` template file that only new children use.

### 2.2 Equipment: composers, not engine edits
The engine is byte-locked (`vendor/MANIFEST.json` pins `equipment.mjs`, `body.mjs`, `plate.mjs`, …; census 7). But
it already accepts **function-type equipment** `(lm, ctx) => item | item[]` that returns existing primitive types
(`plate.mjs:41-47`, SPEC 4; 6 of 7 approved specs use it). So new equipment is a **composer**:
`library/eq/<name>.mjs` returns `box`, `line`, `cable`, `pulley`, `bench`, `seat`, `backPad`, `kneePad`, `barbell`,
`rackUpright` and other items. Composers need **no locked-file change**. They draw only in the approved classes
(`eq`, `eq-line`, …), so theme colour and contrast are the approved tokens by construction (PQ-H2 checks it).
Curved parts (rope, band, bell handle) are sampled polylines, the same technique as the pull-up's own Catmull-Rom
`hangOutline()` (pipeline 2).

| Composer | Unlocks (ids) | Batch needed by | Notes |
|---|---|---|---|
| `inclineBench` (seat + angled backPad) | 7 | LB2 | also upright bench for seated DB press, Arnold, Smith shoulder press, incline curl |
| `declineBench` + ankle hooks | 1 | LB2 | |
| `band` | 2 (+1 if resisted hip flexion uses a band) | LB1 | |
| `assistMachine`, `chestRowMachine` | 1 + 1 | LB1 | |
| `landmine` (angled bar on a floor pivot) | 2 | LB3 | T-bar row, landmine row |
| `romanChair` | 1 | LB3 | back extension |
| `wall` | 2 | LB4 | wall sit; wall ball in LB10 |
| `rope` (cable rope attachment) | 5 | LB5 | rope pushdown, overhead cable extension, face pull, cable crunch, sled pull |
| `preacherPad` | 1 | LB5 | |
| `smith` (rails, bar, hooks) | 5 | LB6 | largest single unlock of a missing drawing |
| `pecDeck`, `latRaiseMachine`, `hipAbdAddMachine`, `pulloverMachine`, `crunchMachine` | 2 + 1 + 2 + 1 + 1 | LB6 | front view of pivot arms is **unverified** (census 4.3); the pec-fly direction plate (6.3) proves it first |
| `dipBars` | 1 | LB7 | |
| `hackSled`, `pendulum`, `legCurlMachine`, `legExtMachine`, `calfMachine`, `ankleCuff` | 1 + 1 + 3 + 1 + 2 + 2 | LB8 | |
| `abWheel` | 1 | LB9 | |
| `medBall` (+ optional), `kettlebell`, `sled`, `jumpRope`, `battleRope` | 3 + 1 + 2 + 1 + 1 | LB9 (Russian twist ball), LB10 | |
| existing primitives with new parameters: single handle 11, straight bar 5, EZ bar 4, `legPress45` at `rail.angle: 0` 1 | 21 | as needed | census 4.1 `exists-param`; the probe drew the flat leg press |

Totals: 20 exercises that needed a "missing" drawing and 30 that needed a composed machine (census R3/R4) are all
covered by composers. **Fallback:** if a composer can't reach the bar (critic below 4 on "equipment realism" twice),
the item becomes a new primitive. That is an additive function plus a `PRIMITIVES` key in `equipment.mjs`, done as
a `[golden update]` PR that must rebuild golden A (`e2bea90c…`) and every approved batch page byte-identically (L1).

### 2.3 Pose capabilities
- **Already expressible, proven by probes but untuned (census 2.3):** supine, incline, decline, prone, plank,
  quadruped, single-leg, split, kneeling, bridge, floor-sit, overhead standing.
  - Each class is proven once on a **direction plate** (6.3) before its batch.
  - Known gaps with a fixed technique: lying poses place a back landmark and verify it with `checks {plane}`, not
    `rootOnSeat` (probe A); kneeling and prone have no contact IK, so they use angles plus a `checks` plane (probes
    C, G).
- **E-R5 (the only planned edit to a locked engine file):** `body.mjs` gains
  - `root.roll`, allowed in the front view only, where it is an in-plane rotation of the whole figure (side plank);
  - `trunk.yaw`, drawn as a front-view shoulder-line foreshortening (Russian twist, bicycle crunch).
  - Both default to 0 and take a code path that leaves every existing output unchanged.
  - Proof: golden A and every approved batch page rebuild byte-identically (L1), plus engine unit fixtures
    (`_test_front`, `_test_side`).
  - Built as a spike in phase 0, so its risk shows up weeks before LB9 needs it. Opus, M, design note first.
- **Not planned:** hands with fingers on the plate, foot inversion, a third camera. The close-ups carry the hand.

### 2.4 Hand close-ups
`hand.mjs` draws only the radial view of a hand closing round a round handle seen end-on. It throws for any other
view (`hand.mjs:106`), and handle profiles only set a diameter (`HANDLES`). Golden B is locked, so library hands
are **additive**:
- **New pairs in the radial view** (`library/hands/pairs.mjs`, same `renderHandPair`, same `HAND_CSS`):
  - curl (13 ids, faults `wrist-curl-cheat` and `bent-back-bottom`);
  - rope and battle rope (thick round profile);
  - kettlebell handle, ab-wheel handle, EZ-bar angled grip, dip bar, single D-handle.
  - Unknown profile names fall back to `machine-grip` (`hand.mjs:115`), so each new pair passes the diameter
    explicitly through an existing profile.
- **New views** (`library/hands/views.mjs`, a new renderer that reuses `hand.mjs`'s exported proportions
  `HAND_PROP`, `HAND_OF_H` and its CSS classes):
  - `palm-flat` (10 ids);
  - `cupped` (dumbbell overhead extension, goblet squat);
  - `front-rack` (front squat);
  - `ball-contact` (medicine ball slam, wall ball).
  - Each view gets C5-style geometry checks, and is judged by the critic and, for tier-A keys, by the owner's
    five-second test on a phone (GA 6.3).
- Pairs stay **shared by key** (`hand-<key>.ts` chunks). About 15 new keys serve 131 ids (est.).

### 2.5 Close-up renderer (replaces 29-44 KB of script per exercise)
The 8 used per-exercise renderers in two copy-pasted families (pipeline 3). LIB-R builds **one data-driven
renderer**, `library/render/closeups.mjs`. It draws the hand zoom, posture crops (cut from the approved plate with
`renderPlate`, the HT4-A5 rule), the thumb page and the feel section from a `*.howto.mjs` spec. It is built by
generalising `howto/render-*.mjs` (the family that shares 53-62 % of its lines).
- **Acceptance (proof of same design):** fed the specs of the 5 `howto/render-*` exercises, it reproduces their
  close-up fragments **byte for byte**; the 3 `*.howto-render.mjs` exercises are a stretch target.
- If byte identity fails after two approaches, the supervisor logs which bespoke hooks (for example `hookThumb`) stay
  data-driven options. Golden B itself is never edited.

---

## 3. Plate production and proof of quality

### 3.1 Production line (per id)
1. The card's **plate facts** are verified and stamped (4.3): top-3 checkpoints for callouts, the plate mistake and
   tells, tempo, and the cited angles, heights and contacts.
2. The author writes `tools/plates/library/specs/<id>.mjs` in mode D, T or H. Template parents and H plates post a
   short design note on the PR first (AGENTS.md "plan hard cards"), naming the pose sources, view and mistake.
3. The author runs `node tools/plates/library/qa.mjs <id>` (LIB-QA). It renders every state and prints the PQ
   scorecard (3.2, 3.3). The author iterates until every hard check passes.
   - A **label-search helper** runs the engine's own `placeLabels` with `prefer` and anchor-offset variants. It
     proposes `box` values scored by the PQ metrics. The author accepts or edits them, so any hand-placed box is
     visible in the spec.
   - This targets the 64 % hand-placed labels (pipeline 3) without an engine change.
4. When the batch is complete, the **visual critic** runs (3.4), followed by fixes and one recheck.
5. The PR reviewer checks the batch (6.2), then the **owner's contact sheet** (3.5), then the pin and merge.

### 3.2 The automated gate: hard checks (fail = the plate cannot reach the sheet or merge)
Tool `tools/plates/library/qa.mjs`, run in authoring **and** in CI for every shipped library id (5.4):

| ID | Check | Basis |
|---|---|---|
| PQ-H1 | Engine report `ok` on every render (normal with each callout selected, mistake with each tell): labels ≥ 8 px from the edge, no label overlap, no label over drawn ink or key joints (measured boxes, browser), IK contacts ≤ 0.5 cm, author `checks`, measure ≤ 2°, font loaded, no horizontal scroll | SPEC 6, `plate.mjs:279-297`. Today it is an authoring tool only (pipeline 12); this makes it a CI check for library plates |
| PQ-H2 | **Structural parity with golden A.** SVG element names, attribute names and class names ⊆ the union used by the approved 8 (computed once from the golden fixture and pinned in `qa/vocabulary.json`); no colour literal except the mask's `#fff`/`#000`; no `var(`; ids slug-prefixed and unique; the chrome DOM is the same shape (1-3 callouts, 1-3 tells, tempo, Trace and Mistake pills); alt ≤ 51 words | Same engine and same classes means the theme CSS colours it exactly as it colours the 8 (plan 2.1) |
| PQ-H3 | **Motion and Mistake are visible.** Trace path length ≥ the shortest approved trace (px); start ≠ end; the mistake outline is non-empty and its largest deviation from the end pose at a tell anchor ≥ the smallest approved deviation (px) | Catches holds without the convention, tiny motions and invisible mistakes |
| PQ-H4 | **Readability and touch at 390, 360 and 340 px:** every text box inside the plate; callout hit boxes ≥ 44 × 44 CSS px and pairwise non-overlapping (C10); the tempo strip does not overflow | C10; the lateral raise's overlapping pair stays exempt by name (O10) |
| PQ-H5 | **Contrast in all 5 themes:** per element class (label text, figure ink, accent trace, `--mistake` outline), the measured pixel contrast against the actual backdrop ≥ the approved minimum for that class and theme, measured on the 8 in the same harness and job | "Not worse than approved". The approved Midnight tells at 4.12:1 set the floor for that class (O7) |
| PQ-H6 | **Drawing matches research.** Every numeric plate fact in the card (joint angle, bar or seat height, contact) has a matching `measure.expect`, `checks` entry or `angles` value within ±3° or ±1 cm; the tempo equals the card's | Ties geometry to verified sources; the 8 did this by hand (pipeline 2) |
| PQ-H7 | Determinism and size: two builds are byte-identical; chunk ≤ 150 KB raw / 36 KB gz; S0 ≤ 700 elements | plan 2.9 |
| PQ-H8 | Plate copy lint for new plates: callouts 1-3 words, cue ≤ 15 words, no semicolons, GA 6.2 bans, medical-claim bans | content.md 4 (add-only); the 8 stay exempt by name |

### 3.3 The automated gate: flags (need a judgement; they go to the critic and the owner with the value and the approved range)
- F1: scale (px/m) outside the approved range.
- F2: figure bounding-box coverage of the 358 px plate outside the approved range.
- F3: longest leader longer than the approved maximum.
- F4: number of hand-boxed labels.
- F5: text contrast below 4.5:1 (the O7 precedent).
- F6: view differs from the census recommendation.
- F7: the Mistake is not the card's top fault (drawable-fault rule).

An owner "yes" on a flag is recorded in the batch golden entry as a **named exemption**, like O10. It is never a
silent threshold change. The envelope values are measured from golden A in LIB-QA and pinned. They are not
measured in this design.

### 3.4 The visual critic (Opus, fresh context, one per batch)
- **Input:** each new plate at 390 px in Silent Black and Paper (normal, each callout, mistake, each tell), the
  close-ups and the feel-map still. Each is shown next to its closest approved plate, with the card's plate facts
  and the PQ scorecard.
- **Rubric, 1-5 per plate:**
  - R1 pose truth (it matches the card and reads as the real lift);
  - R2 equipment realism and scale;
  - R3 contact plausibility (nothing floats or sinks);
  - R4 label placement "as a designer would";
  - R5 the Mistake reads in 2 seconds;
  - R6 the Trace means something;
  - R7 consistency with the approved 8 (line weight, density, framing);
  - R8 close-ups: Right and Wrong not swapped, thumb, handle in the right part of the hand;
  - R9 feel regions match the card.
- **Pass:** every criterion ≥ 4. Anything lower is fixed, or goes to the owner as a flagged item with the critic's
  reason.
- **Calibration, the "fails before, passes after" for the critic:**
  - Two approved plates are mixed in unlabelled as anchors. If the critic scores an anchor below 4, the run is
    discarded and a fresh critic reruns.
  - One **planted-defect plate** is also mixed in, for example a label boxed onto the figure, a hand 3 cm off the
    bar, a mistake pose equal to the end pose, or swapped callout text. If the critic misses it, the run is
    discarded.
  - The supervisor picks and plants these; they are never committed.
- This critic judges the pictures. It does not repeat the content critic (4.3), which judges claims against sources.

### 3.5 Owner contact sheet, pin, and golden updates
- **Sheet (one per batch):** a private page built from the batch PR head, with its page sha printed.
  - Order: tier-A exercises first, flagged ones first within each tier.
  - For each exercise: the new plate (normal and mistake), its closest approved plate beside it, a Paper thumbnail,
    then the layers (hand Right/Wrong, posture Right/Wrong, feel map still, the text as shown at 390 px), the
    critic's scores and each flag.
  - The owner answers per exercise ("all yes except X: note").
  - The sheet shows only what automation can't settle: taste, and "is this how I want it taught".
- **Pin (supervisor, after the owner's yes):** `tests/howto/golden/library/<batch>.json`, one file per batch (no shared
  tail, so batches never conflict). Each file is a hash chain whose first entry links to the sha of the main
  `GOLDEN.json`. It holds:
  - `kind: 'plates-page'` and `kind: 'layers-page'`: page sha256 and bytes;
  - one `kind: 'plate'` entry per id with its 9 fragment hashes (as today);
  - one `kind: 'layers'` entry per id with its fragment hashes;
  - source shas;
  - exemptions;
  - `approvedBy: 'owner'`, the owner's words and the date.

  `library/MANIFEST.json` pins every source file (specs, templates, composers, hand pairs and views, renderer, howto
  specs) to the entry that approved it. The supervisor adds the pin commit to the builder's branch with
  `[golden update]` in the message (plan 2.8 guard).
- **Golden updates** keep plan 2.8 unchanged:
  1. a spec or engine change;
  2. a rebuilt page;
  3. a contact sheet of **only the changed ids**;
  4. the owner's yes;
  5. a superseding entry that names the decision;
  6. a reviewer.

  An engine or composer change that touches no approved bytes needs no owner session: its proof is L1 on every
  approved page.
- **Why not pin on `claude/howto-options`?** Golden A and B stay there, unchanged. For 145 more exercises, a second
  copy on a docs branch would double every source, need pushes to a branch the builders don't own, and add a
  vendoring step per batch. Content pins (sha256) prove the same thing in one place.

---

## 4. Layer production

### 4.1 Shared (written, sourced and verified once)
- **Archetypes:** 10 hand and 8 contact archetypes (GA 3.1, 3.2; appendix B assigns every id) in
  `src/howto/archetypes.ts`, generated.
- **Hand pairs**, shared by key (2.4).
- **Equipment moves:** get in and out, selector pin, foot bar, unrack and rerack, dumbbell kick-up.
- **Red-flag boxes:** wrist, shoulder, knee and elbow, plus a new **back-pain** box from the NHS page (content 5.3)
  in LB3's sheet. Its "Call 999" line needs an add-only lint rule.
- **Owner line** `OWNER_DISCLAIMER`, verbatim and pinned by the lint; `SHOW_EVIDENCE = true`.
- **Shared risk lines:** bar over face, breath-holding, jump landing.
- **Source registry** `docs/research/howto/sources.json`.
- **The close-up renderer** and the feel-map engine.

The **19 shared research cards** (content 6) come before the batches that need them:
- palm-flat, curl, the 5 implements, floor-body;
- the rope rule, cupped thumb, front-rack exemption, wrist-curl exemption, prone checkpoints;
- the 5 equipment moves and the back-pain box.

### 4.2 Per exercise
- **One research card per id** (`docs/research/howto/<id>.json`, card v2 schema, content 3.2): 94 full cards and
  51 **difference cards** for children (content 2.3, appendix A). A child keeps its parent's hand archetype and
  primary contact. It never inherits the feel spec or the mistakes. Every inherited line carries "true because …",
  and the critic checks it.
- **One sheet spec per id** (`library/howto/<id>.howto.mjs`): the copy, the 4 feel rows, 5 setup steps, 3 handling
  mistakes, up to 3 risks, `riskFlags`, zoom picks and handling overrides. It is written **under the lint from the
  first line**:
  - the author picks `riskFlags` first (at most 3 boxes, about 29 words each; content 4);
  - then writes to the words left under 450;
  - every section opens with one concept line, then short cues (golden B's pattern).
- **Posture crops** are data (checkpoint landmarks plus a crop window) cut from the approved plate. They never
  re-pose the figure except the Wrong half, which uses the card's fault pose.
- **Feel map:** `feel.primary` must be a painted region. For the 6 ids with no paintable primary (census 4.4) the card
  names drawn regions (for example abs and obliques) with a `libraryDiff` reason. A feel section with zero drawn main
  muscles is not a golden-B state, so it is not allowed.

### 4.3 Verification (content.md 3.3-3.5, adopted as is)
- **Roles per batch:**
  - family writer: Opus, up to 3 in parallel, one family each;
  - source fetcher: Sonnet (E-utilities and plain fetches, verbatim quotes);
  - content critic: Opus, fresh context; card and quotes only;
  - safety checker: Opus, tier A only;
  - the supervisor re-fetches 10 % of claims (chosen by the head commit hash) and runs the planted-mistake test
    (two known errors planted in a copy of a card; a missed error rejects the critic run).
- **Stamps:** C15 goes strict. A sheet whose content hash has no stamp in `reviews.json` (supervisor-owned) fails CI.
- **Thin evidence:** these ids are researched in phase 0, whatever their batch, so any `blocked:evidence` shows up
  early: `battle_ropes`, `bear_crawl`, `high_knees`, `jumping_jacks`, `flutter_kicks`, `sled_pull`,
  `pendulum_squat`, `bayesian_cable_curl`, `resisted_hip_flexion`, `renegade_row`.
- **Durability:** verified cards are pushed to a docs-only branch `claude/libht-research` as they pass, because the
  scratchpad is not durable (plan R1). They reach main in their batch PR.

### 4.4 Layer checks (all existing or planned; none loosened)
- Copy lint (golden B's constants unchanged, plus the add-only library rules in content 4) at build time **and** in
  C7.
- C1-C18 on the generated content of every shipped id.
- The golden-B state check per batch layer page (every state opens, is visible, fits 390 px, no page errors, 5
  themes).
- C5 hand geometry for every new pair and view.
- C9 feel contrast, C10 tap targets, C11 reduced motion, C12 no endless motion, C16 accessibility, C17 no network.
- The visual critic (3.4, R8 and R9) for the pictures.
- The PR reviewer for the reader's view of the copy at 390 px (6.2).

---

## 5. App and CI at scale

### 5.1 Enabler PRs (code, after M1 merges; the core is frozen after HT-2, so each is its own PR)
- **LIB-0, scale core (Opus, L, design note).** It makes the hard-coded 8 into data:
  - `LIB_OF` moves to `plates.json`;
  - `PINS` becomes a list of page pins;
  - the `verifyVendor` source regex becomes MANIFEST data;
  - `shoot2`'s ids and flags become data.

  It also adds:
  - `tools/plates/library/`, its MANIFEST and the per-batch golden files;
  - **per-file `inputsSha256` over each file's own inputs** (plan 2.2's intent; today one shared value re-headers
    every file, pipeline 12);
  - `coverage.ts` statuses;
  - the new `ids.ts` encoding (5.2);
  - **derived fixtures** (5.5).

  Acceptance: the 8 regenerate with **no byte change** (L1 `e2bea90c…`, L2 `===`, HT-3 L3 unchanged), plus
  mutation proofs.
- **LIB-QA, plate QA gate (Opus, M):** PQ-H1..H8, the flags, the pinned vocabulary and envelope measured from golden
  A, and the label-search helper. Acceptance includes: the 8 pass PQ-H except named exemptions, and each check
  fails on a planted mutation.
- **LIB-G, sharded library gate (Opus, M; the supervisor wires `.github`, add-only):** 5.4.
- **HT-11, size (planned, Opus, M):** must merge **before LB3**; LB2 brings the total to 34 plates, under plan
  4.2's limit of about 40.
- **LIB-R, close-up renderer (Opus, L):** 2.5.
- **LIB-H, hand pairs and views (Opus, M):** 2.4. The radial pairs first; the views just in time for LB4
  (front-rack), LB5 (cupped), LB7 (palm-flat) and LB10 (ball).
- **LIB-E1..E3, composers (Opus designs, Sonnet makes the mechanical variants):** just in time per batch (2.2).
- **E-R5, roll and yaw (Opus, M, `[golden update]`):** spike in phase 0, PR before LB9.

### 5.2 `ids.ts` and the main bundle, with no budget raised
- **The problem:**
  - `ids.ts` is capped at 2,048 B (`ids.test.ts:57`), and the main footprint (`ids.ts` + `lazy.tsx`) at 3,072 B
    (plan 2.9).
  - 153 ids as a quoted list are 3,467 B; pipe-joined without `lib_` they are 2,548 B (measured from
    `census.json`).
  - HT-5's per-id push hints add up to 572 B for the 26 push ids.
- **Design:** a generated **16-bit hash set**.
  - The generator picks a seed so that all 153 library ids in `exercises.json` hash to distinct 16-bit values, and
    writes them as 4 hex chars each.
  - It stores **whichever is shorter**: the shipped set, or the not-yet-shipped set. So the worst case is at 76-77
    shipped ids: 77 × 4 = 308 B.
  - Push hints are deduplicated by text (the archetype cue), with a 1-char index per push id.
  - Est. total ≤ about 1.2 KB of source, under both caps, at every coverage level. No runtime import.
  - `HOWTO_IDS` (readable) moves to the lazy `generated/index.ts` keys.
- **Why it is safe:**
  - `exercises.json` is an input of `ids.ts` (per-file `inputsSha256`), so a new library id makes `generate --check`
    fail until it is regenerated.
  - A new exhaustive unit test: for **every** id in `exercises.json`, `hasHowTo(id) === (id in LOADERS)`, and the
    hint equals the generated content's. This is stricter than today's test.
  - Custom ids never reach it (`!ex.custom &&` at the call site, HT-3).
- `generated/index.ts` grows to about 9 KB raw for 153 lazy imports (est.). It lives in the lazy HowToSheet chunk,
  and HT-3b's budget there is re-measured (+10 %) by supervisor decision in the LB1 PR.

### 5.3 Size: chunks and APK
- **Per-exercise chunk budgets stay:** plate ≤ 150 KB raw / 36 KB gz; zoom and feel ≤ 24 KB gz; hands ≤ 10 KB gz
  per key. All are lazy; nothing loads before the button is tapped (plan 2.5).
- **Totals, est.:** plates 153 × 22.2 KB gz = 3.4 MB, which HT-11's -35 % target brings to about 2.2 MB. Layers add
  about 9-30 KB gz per exercise, from the plan's 31-52 KB all-in minus the plate. So all How-to assets come to about
  3.5-6.7 MB gz, and the APK grows from 4.37 MB to **about 8-11 MB** (est.; Play's limit is 200 MB).
- **Tripwire:** the total How-to asset budget becomes "Σ per-id measured + 10 %", re-set per batch by the
  supervisor (plan 2.9 already says "re-set per batch").
- **Trigger for a second size card:** if the LB2 measurement projects more than 6 MB gz at 153, HT-11b
  deduplicates the body-map base shared by every feel state and posture crop. It is byte-preserving (L2-B `===` on
  the decoded string), the same technique as HT-11.

### 5.4 Gate time: shard, never drop
- **Today's pace:** HT-3 costs 27.2 s per plate per gate job (measured); layers are est. about 26 s per exercise per
  job (pipeline 7). So the library adds 145 × 53 s ≈ 128 min against a 40-minute job timeout (`build-apk.yml`).
- **The 8 stay exactly where they are:** HT-1..HT-10 blocks in `source-gate` and `visual-gate-tz`. That is about
  23 min per job at M1 (est.), and they are the TZ canary.
- **New jobs** (supervisor, add-only in `.github`; no existing job or block changes):
  1. `howto-rebuild`:
     - L1 for every approved library page (rebuilds from sources, sha == pin), about 2-5 min on 4 processes (est.);
     - uploads the pages;
     - outputs the shard plan: shipped ids split into K shards by greedy packing on a committed timing file.
     It uses a dynamic matrix (`fromJSON`), so K grows with coverage: 1 shard at LB1, about 8 at 153.
  2. `howto-shard-<k>`, for each shard:
     - downloads the pages and re-checks each sha;
     - runs the harness self-check (golden vs golden 0 px; a 1 px shift fails);
     - for its ids: PQ-H1..H7, L2b, F3, the full L3 matrix, L4 and the HT-6..9 layer states in 5 themes;
     - writes a **proof manifest** `{sha, id, check, state, result}`.
  3. `howto-verdict` (needs all shards): fails unless every shard ran on the same sha, the union of proven ids
     **equals** the shipped library ids, and each id's state count equals the count expected from its spec
     (callouts × tells × themes × widths, layer states). No id can fall through a crack.
  4. `android-gate` adds `howto-verdict` to `needs` (add-only).
- **Sizing rule:** K is chosen so that each shard stays ≤ 25 min at the measured per-exercise time. With 53 s per
  exercise that is K = 8: about 18 exercises × 53 s ≈ 16 min plus about 5 min setup (est.). If layers measure at
  2×, K is 13-14.
- **In-job workers (measured, adopted only if proven):** LIB-G measures 1 vs 4 parallel pages on the 8. It adopts
  workers only if the timing gain is real **and** both modes give 0 px against each other. Public-repo runners are
  4 vCPU per GitHub's documentation; `nproc` is not yet measured in this CI.
- **Where it runs, per event:**
  - The full shards run on pushes to `main`, on ready-for-review PR heads and on `workflow_dispatch`.
  - Draft pushes run the existing jobs plus the library L0-L2 byte checks (vitest, seconds) plus shards for the
    **ids changed in the diff**.
  - The merge rule is unchanged, and it needs the full verdict green on the exact head that contains the latest
    main. So every shipped plate is proven before every merge, and again on main after it.
- **TZ:** How-to rendering reads no clock. A unit check (C-TZ, add-only) forbids `Date`, `Intl` and timer-based
  content in `src/slices/howto/**` and the generated chunks, so running the library matrix in UTC only drops no
  state that ever ran.
- **Concurrency:** GitHub Free allows 20 concurrent jobs (which plan the owner has is not verified). With K = 8, one
  push uses about 12 jobs. That is why full shards run only on ready heads and main. A queue adds latency, never a
  skip.
- **Per-merge CI, est.:** about 30-35 min (today about 20).

### 5.5 Repo weight
- Committing built pages and ref-fixtures would add about 100 MB raw (pipeline 10). **Library fixtures are derived,
  not committed:** CI rebuilds them from the pinned sources and checks each sha, which L1 already does for golden A.
  Only sources, generated modules and the golden JSON files are committed.
- The 8's committed fixtures stay untouched (no change to HT-1).
- Committed growth, est.: about 8 MB of sources and cards, plus about 16-30 MB of generated `.ts` (text; git packs
  compress it).

### 5.6 Offline, data, cost
- Everything is static and bundled; the service worker precaches `www/assets` (plan 2.10). The SW asset list grows
  by about 500 entries (est.), in `sw.js`, not main.
- C17 (no network) runs on every library chunk.
- The gate checks that the localStorage keys are identical before and after opening a sheet.
- **No new saved or sent data, and no new paid service:** Actions minutes are free for public repos, and research
  uses free public sources.

---

## 6. Delivery

### 6.1 Phases
| Phase | When | What | Merges to main |
|---|---|---|---|
| 0 | while M1 (HT-3..HT-10) finishes | Research wave 0: the 19 shared cards and the 10 thin ids. **Direction plates** (6.3) authored in scratch and pushed to `claude/libht-research`. E-R5 spike. Supervisor fixes for M1 that pipeline and content found: HT-4 must vendor golden B `b3a90af`, not `16a8edc`; fill golden B's 35 null source fields before HT-5 (HT5-A2); correct HT-5's disclaimer text to the owner's line; HT-3's CI pixel checks must be stable (red today, pipeline 7) | none |
| 1 | days 1-5 after M1 | LIB-0 → LIB-QA → LIB-G → LIB-R → HT-11. LIB-E1 composers. LB1 authoring on scratch, then on its branch once LIB-0 is pushed | 5-6 PRs |
| 2 | days 5-25 | LB1 … LB10, two batches in flight: n in review or with the owner while n+1 is drawn, and research runs one batch ahead. LIB-H views, LIB-E2/E3 and E-R5 land just before the batch that needs them | 11 batch PRs + about 4 enablers |
| 3 | days 25-28 | Release candidate: full regression and full QA once, on the finished build (AGENTS.md); owner device checks; the named list (target: empty) | RC fixes only |

**PRs: about 21-22.** That is 6 enablers in phase 1, 4-5 just in time, and 11 batch PRs (LB5 split in two).
Merge order is the owner's checklist order: enablers as listed, then LB1 → LB10. The per-batch golden files mean
parallel batch PRs never conflict on a golden tail. `generated/index.ts`, `ids.ts` and `coverage.ts` are never
hand-merged; they are regenerated after merging main (plan R13).

### 6.2 Agents and models per step
| Step | Agent | Model | Why this model |
|---|---|---|---|
| Supervisor (board, stamps, sheets, pins, merges, 10 % re-fetch, planted tests) | 1 session | claude-opus-5-5 | judgement |
| Family research writer | up to 3 | Opus | research judgement |
| Source fetcher | 1 per batch | claude-sonnet-5 | mechanical |
| Content critic; safety checker (tier A) | 1 each per batch, fresh | Opus | independent judgement |
| Template parents, H plates, E-R5, LIB-0/QA/G/R/H | builders | Opus | geometry and design judgement |
| D plates and T children (parent already QA-clean; escalate to Opus after 2 failed PQ rounds) | builders | Sonnet | parameter work checked by PQ and the critic |
| Composer variants, CI wiring text, generator runs, contact-sheet assembly (a script) | builders | Sonnet | mechanical |
| Sheet copy (`*.howto.mjs`) | the batch builder | Opus | voice, concept-first |
| Visual critic | 1 per batch, fresh | Opus (vision) | the quality bar |
| PR reviewer (code, scope, tests bite, reader's view of copy) | 1 per PR, fresh | Opus | AGENTS.md |

- **At most 4 builders at once** (the plan's cap): typically 3 drawing lanes and 1 enabler or fix lane.
- Research agents and critics are not branch builders. Peak is about 9 agents at once.
- Nobody repeats another's check:
  - PQ does the objective checks;
  - the visual critic judges pictures;
  - the content critic judges claims;
  - the reviewer judges the PR;
  - the owner judges taste.
- Every session is archived when its role ends.

### 6.3 Direction plates (phase 0, shown in the LB1 sheet, shipped in their own batch)
Six plates prove each unproven pose class and convention against the approved bar before any bulk work depends on
them:
1. dumbbell bench press: supine, and the first real `dumbbell` plate;
2. Romanian deadlift: hinge;
3. reverse lunge: split;
4. plank: hold plate and plank support;
5. mountain climbers: cycle plate;
6. pec fly: front-view seated machine, with unverified pivot arms.

The E-R5 side-plank spike is attached as a status note. If the owner rejects a convention here, only the batches
that use it re-plan. Nothing already built is wasted.

### 6.4 What the owner approves, and how often
| When | What | Est. time |
|---|---|---|
| Once, now | This design: scope (all 153, no planned exclusions), batch order, conventions in principle | 10 min |
| LB1 sheet | 14 plates + layers, and the 6 direction plates | 45 min |
| LB2-LB10 sheets | one per batch, about every 2 days; flagged items and tier A first | 30-45 min each |
| Just-in-time items inside sheets | back-pain box wording (LB3); small-motion zoom flags (LB3, LB5); E-R5 result (LB9) | inside the sheets |
| Phone, with batch APKs | the five-second test for new tier-A hand keys (GA 6.3): about 4 keys (palm-flat, cupped, front-rack, ball) | 5 min each |
| RC | the release-candidate APK; the named list if not empty | 30 min |

**About 13 owner touches in total, instead of the about 18 that plain linear scaling predicts (pipeline 10).** He
never reviews anything the gate or the critic has not already passed.

### 6.5 Time estimate
**Assumptions** (each can move the total):
1. **Pace, from the first 8** (about a day of design for 8 plates with several agents; HT cards take hours each):
   - H plates and template parents: 3-5 agent-hours each;
   - D and T children: 1-2 h;
   - layer spec: 1-2 h;
   - QA, critic and fixes: about 0.75 h per id;
   - research: about 1.5 h per full card and 0.5 h per difference card.
2. Builders do about 16 productive hours a day. They work in auto mode, with gaps for CI and supervisor ticks.
3. CI is about 30-35 min per full run; each batch needs about 3 runs.
4. **The owner answers a sheet within about 1 day.** This is the largest unknown.
5. There are about 2 real content errors per first draft (content 1), which means one fix round.

**Effort, est.:**

| Work | Agent-hours |
|---|---|
| Plates: 82 full-effort (67 H + 15 parents) × 4 + 63 light (13 D + 50 children) × 1.5 | ≈ 420 |
| Layers: 94 full × 2 + 51 difference × 1 | ≈ 240 |
| QA, critic and fixes | ≈ 110 |
| Research: 94 × 1.5 + 51 × 0.5 + 19 shared × 1 | ≈ 190 |
| Enablers | ≈ 100 |
| **Total** | **≈ 1,060** |

**Calendar, est.:**
- Builder work is about 870 h. Over 4 lanes at 16 h a day that is about 14 days of pure building; research runs in
  parallel.
- Add about 30 % for serial steps (critic, owner, pin, merge) and 2-3 days for the RC.
- **Expected: about 4 weeks after M1 merges.** Best case about 3 weeks (same-day owner replies, no batch reworked).
  Worst case about 7 weeks: CI pixel instability like HT-3's, E-R5 reworked, one batch's style rejected.
- If the real pace is half of assumption 1 (about 5 exercises a day instead of 10), phase 2 doubles to about 6
  weeks in total.
- **Token cost is large (about 1,000 agent-hours).** The savings are the D and T modes (63 light plates), difference
  cards (51), Sonnet for all mechanical steps, one critic per batch rather than per plate, and no duplicate
  reviewers.

---

## 7. Risks and mitigations, and what goes live when

### 7.1 Risks
| # | Risk | Mitigation |
|---|---|---|
| 1 | New plates are worse than the 8 | Same locked engine and CSS classes (PQ-H2); hard checks PQ-H1..H8; envelope flags; a calibrated critic (anchors and a planted defect); the owner's sheet; locked at approval, and proven on every commit (L1-L4 per shipped id) |
| 2 | The critic is lenient or hallucinates | Unlabelled approved anchors plus a planted defect in every run; a failed calibration means a fresh critic; the owner sees the critic's scores next to the pictures |
| 3 | Engine work changes approved bytes | Composers instead of edits; only E-R5 (and any composer fallback) edits a locked file, as a `[golden update]` proven byte-identical on golden A and every approved batch page |
| 4 | E-R5 fails the bar | Spike in phase 0; fallback is the owner's named list for 3 ids, with the attempts shown |
| 5 | The owner dislikes the hold or cycle convention | Direction plates in the first sheet; only the affected batches (LB4, LB9, LB10) re-plan |
| 6 | A template edit silently changes shipped children | L1/L2 refuse it; frozen-after-approval rule, with `v2` templates |
| 7 | CI pixel checks are unstable (HT-3 is red today) | Entry condition: HT-3's blocks green on N consecutive main runs before LIB-G; the full-Chromium pin; a golden-vs-golden 0 px self-check per shard; never a threshold change (plan R6) |
| 8 | Gate time or CI queueing | Dynamic shards sized by measurement; the verdict job proves coverage; full runs on ready heads and main; K re-set by measurement, never by dropping states |
| 9 | Research accuracy drifts at volume | content 3.3-3.5: quotes, an independent critic, planted mistakes, a 10 % re-fetch, strict C15 stamps |
| 10 | Thin evidence blocks an id late | Thin ids researched in phase 0; `blocked:evidence` goes to the owner early |
| 11 | APK and asset growth | HT-11 before LB3; per-chunk budgets; a total tripwire per batch; HT-11b triggered by measurement |
| 12 | Merge conflicts on shared generated files | Per-batch golden files; per-file `inputsSha256`; regenerate, never hand-merge; checklist-order merges |
| 13 | Owner bandwidth (10 sheets in about 3 weeks) | Flagged-first sheets; approval per exercise, so unapproved ids roll into the next batch without blocking the rest |
| 14 | The first real `dumbbell` primitive looks unlike the hand-drawn lateral raise | It is a direction plate (dumbbell bench), and the critic compares it with the lateral raise in R7 |
| 15 | `exercises.json` grows during the work | C6 coverage fails without a `coverage.ts` row; new ids join the next batch; `ids.ts` goes stale, and `generate --check` catches it |
| 16 | Unsafe content before the stamps | Tier-A safety checker; pinned red-flag rows; the owner line verbatim; no button without a stamp |
| 17 | Android font scale distorts plates | M1's O9 pass rule applies to every library plate; checked on the RC |
| 18 | Scratchpad loss | Verified cards and direction plates pushed to `claude/libht-research` |
| 19 | Pressure to hit a Play Store date | The only relief valve is the owner's named list; nothing ships below the bar |

### 7.2 What goes live when
| Moment | On the owner's phone | Public |
|---|---|---|
| M1 (HT-10 merged) | the 8, complete | no |
| Each batch merge (LB1 … LB10) | the APK from that commit's green run (fingerprint step checked); the button on exactly the approved ids so far | no |
| RC | all 153 (or 153 minus an owner-approved named list), full regression and QA passed on that exact APK | the owner publishes, only when he chooses |

Batches go to the owner's phone as they land. The button is driven by the generated `ids.ts`, which is written only
from ids that have an owner-approved golden entry **and** a verified-content stamp. A drafted but unapproved id
cannot show a button: the exhaustive `hasHowTo` test and the verdict job's coverage check both fail.

---

## 8. Decisions this design needs

**Owner:** yes to this plan; the direction plates (conventions); one sheet per batch; the back-pain box wording;
the named list, if any, at RC.

**Supervisor (decide and log):**
- the library source area and per-batch golden files;
- derived fixtures;
- the `ids.ts` hash-set encoding with its exhaustive test;
- the add-only CI jobs, the dynamic shards and the verdict job;
- C-TZ;
- the per-batch total-size tripwire rule;
- re-measuring the HowToSheet chunk budget;
- the negative-control switch to a custom exercise in the LB2 PR (content 8, plan R17);
- the M1 fixes listed in phase 0.
