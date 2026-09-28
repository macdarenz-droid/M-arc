# Form-guide production line

Approved approach (owner, 2026-09-27): every exercise in the library gets what the Lateral Raise Lab delivers, produced by agents from one data file each and drawn by one shared rig. Reference: `docs/design/form-guide-lab/lateral-raise-lab.html` (PR #36, version 6) and the reference renders committed with it under `docs/design/form-guide-lab/reference/` (the lab's own figure at rest, half-way, top and in the mistake, light and dark; the owner's outside pictures are not committed, they are third-party art). Written by the supervisor from three code maps, one architect draft and one adversarial critique (22 corrections applied). Decisions D-R16 and D-R17 in `docs/COACHING-DECISIONS.md`. This supersedes `docs/FORM-GUIDE-ARCHITECTURE.md` and the app-lane plan in `docs/GUIDE-UPGRADE-ARCHITECTURE.md` §7.3 (GU-7a-4); what is kept from GU-7a is listed in §6.

## 1. Goal and standard

Every exercise must deliver, in the app, on a phone:

- [ ] Comic-anatomy figure painted from the theme tokens (`--accent` mixes for the body; the mistake figure tinted toward `--mistake`, D-FG1), never a literal colour, in all five themes (Silent Black, Paper, Ember, Emerald, Midnight).
- [ ] Whole-body motion from the data file: the working joints plus breath, balance sway, shoulder-blade rhythm, tremor in the hold, slow-down across reps.
- [ ] Muscles that shimmer with computed effort: target, helpers and keep-quiet muscles, band phase driven by the effort curve, every target muscle visible in the chosen view.
- [ ] The common mistake side by side, from a delta on the same data (its own tempo, extra joint offsets), with the differing numbers shown.
- [ ] Readouts: joint angle, hand speed, effort bars per muscle, load from the last logged set, phase bar.
- [ ] Key moments: four stills from the same model (start, mid-lift, top, mid-lower) plus, for machines, the setup moment (right and wrong setting side by side).
- [ ] Guides: angle arc and one tag outside the face keep-out, hand path trace.
- [ ] Reduced motion (Pictures), captions `aria-live="polite"`, 44 px controls.
- [ ] All automated checks green (§5).

**Judge rubric** (0–5 each; total ≥ 24/30 ships, any single mark < 3 blocks). The judge scores from the gate screenshots at 360 px width in Silent Black and Paper with the reference renders open:

| Criterion | What 5 means | Pass |
|---|---|---|
| Likeness | Reads as the same character and brush style as the reference renders; the silhouette still reads blacked-out | 4 |
| Anatomy | Proportions, joint centres and limb overlaps right in this view; no limb longer than its rig bone | 4 |
| Motion truth | Angles inside the cited ranges, tempo as specified, minimum-jerk, no snap at phase ends, secondary motion present (breath, sway, blade rhythm) | 4 |
| Muscle truth | Effort peaks where the load is highest, helpers lower, keep-quiet muscles flat in the correct rep and lit in the mistake | 4 |
| Machine truth | Pivot at the joint, seat and pads where the cited setup source puts them, moving parts follow the hand or foot, stack rises with load | 4 (n/a for free weights) |
| Legibility | At 360 px: working joint centred, tag legible, nothing clipped, both themes | 4 |

Frame rate is not a judge mark: it is measured on the owner's phone (an owner action, once per batch and at every rig change) and recorded in the log at the end of this document.

## 2. Content model

One exercise = one file `src/formguide/exercises/<libraryId>.ts` (the library id as it is in `exercises.json`, e.g. `lib_lat_pulldown`; the checker asserts `guide.id` equals the file name and exists in the library) exporting `ExerciseGuide`. Data only: no functions in exercise files; curves are numbers, `[start, end]` pairs or keyed splines, and anything that needs code lives in the rig.

```ts
type View = 'front' | 'side' | 'back';
type Kind = 'rep' | 'hold' | 'alternating' | 'locomotion' | 'ballistic';
type Order = 'lift_first' | 'lower_first';        // squat, bench, leg press, RDL, lunges, push-up, dip start by lowering
type Curve = number | [number, number] | { keys: [t: number, v: number][] };
// number = fixed; [a, b] = minimum-jerk between them over the moving phases in `order`; keys = minimum-jerk spline over the rep (t 0..1)
type Side = '_l' | '_r';                            // every joint channel is sided; `symmetric: true` writes one curve to both

interface ExerciseGuide {
  id: string;                                       // = library id
  kind: Kind; order: Order;                         // default from the pattern table; may be overridden with `why`
  view?: View; viewWhy?: string;                    // view is derived from rig/patterns.ts; an override needs a reason
  mirror?: boolean;                                 // left-facing side view
  camera: { full: ViewBoxId; zoom: ViewBoxId; subject: JointId };
  pose: 'standing' | 'seated' | 'lying_supine' | 'lying_prone' | 'kneeling' | 'hanging' | 'plank' | 'quadruped';
  equipment: { kind: PartId; grip?: string; attach: AttachmentId[]; loadFrom: 'lastSet' | 'bodyweight' | 'fixed'; kg?: number; release?: [t: number, t2: number] };
  machine?: { id: MachineId; settings: { seat?: number; pad?: number; pulley?: 'high' | 'mid' | 'low'; bench?: number; rail?: number };
              drive: { part: string; travel: [number, number]; chain: JointId[] }[] };   // the machine part's travel is the source; the limb chain is solved to it
  tempo: { lift: number; hold: number; lower: number; rest: number };   // s, sum 3–5; holds use { hold: seconds }
  symmetric?: boolean;
  joints: Partial<Record<JointChannel, Curve>>;     // degrees, or cm where the channel name ends in _cm (shrug_cm, scap_depress_cm)
  movement: { breathe: 'out on lift' | 'out on lower'; leanDeg?: number; tremorDeg?: number; slowdown?: number[]; bladeRhythm?: string };
  muscles: { target: MuscleId[]; helps: MuscleId[]; keepQuiet: MuscleId[];
             effort: Partial<Record<MuscleId, Curve>> | { model: 'torque'; chain: JointId[] } };
  cues: string[];                                   // ≤ 3, each ≤ 60 characters
  mistake: { name: string; tempo?: Tempo; joints: Partial<Record<JointChannel, Curve>>; muscles?: Partial<Record<MuscleId, Curve>>;
             tells: { text: string; joint: JointChannel }[]; setup?: { setting: keyof Settings; wrong: number; text: string } };
  sources: string[];
}
```

`research.json` (one per exercise, written by the researcher and never edited by the author) holds the cited numbers the checks read: the coaching ranges per joint, the effort peak point `peakAt`, the machine settings and their source. The rig holds the hard anatomical limits (`rig/ranges.ts`, AAOS) shared by every exercise.

Mistake joint curves are deltas added to the correct curve, so the two figures share a base and "mistake differs" is measurable on the joints the `tells` name. The correct figure must stay inside the coaching ranges; the mistake may leave them on the joints its tells name but must stay inside the AAOS limits.

Kinds: `rep` is the lab's lift → hold → lower → rest (or lower first); `hold` (plank, side plank, wall sit, hollow hold, dead bug, farmer's carry) has a duration, a tremor that grows, an effort plateau and a sag mistake; `alternating` (alternating curl, walking lunge, step-up, bird dog, mountain climbers) is two half-reps with sided channels; `locomotion` (sled push and pull, bear crawl, high knees, jumping jacks) is a stored gait cycle with sway; `ballistic` (box jump, jump squat, kettlebell swing, medicine-ball slam, wall ball, burpee) allows a flight or release phase with a landing check.

**Machine example, lat pulldown (abridged; front view per the pattern table):**

```ts
export const lib_lat_pulldown: ExerciseGuide = {
  id: 'lib_lat_pulldown', kind: 'rep', order: 'lift_first',
  camera: { full: 'seatedFront', zoom: 'upperFront', subject: 'shoulder_r' }, pose: 'seated',
  equipment: { kind: 'wide_bar', grip: 'overhand, 1.5x shoulders', attach: ['hand_l', 'hand_r'], loadFrom: 'lastSet' },
  machine: { id: 'lat_pulldown', settings: { seat: 0.45, pad: 0.62, pulley: 'high' },
    drive: [{ part: 'bar', travel: [0, 0.42], chain: ['shoulder_r', 'elbow_r', 'wrist_r'] }] },   // bar travel drives the arms (solved), the stack and the cable
  tempo: { lift: 1, hold: 0.5, lower: 2, rest: 0.5 }, symmetric: true,
  joints: { torso_lean: [0, -15], scap_depress_cm: [0, 3], hip_flex: 90, knee_flex: 90 },       // free joints only; the arm chain is solved to the bar
  movement: { breathe: 'out on lift', tremorDeg: 0.3, slowdown: [1, 1.06, 1.14], bladeRhythm: 'blades down and in through the pull' },
  muscles: { target: ['lats'], helps: ['biceps', 'mid_back', 'rear_delts'], keepQuiet: ['upper_traps', 'lower_back'], effort: { model: 'torque', chain: ['shoulder_r', 'elbow_r'] } },
  cues: ['Lean back no more than 20 degrees.', 'Elbows drive down to the hips.', 'Stop when the elbows stop moving.'],
  mistake: { name: 'Lean and heave', tempo: { lift: 0.6, hold: 0.1, lower: 0.8, rest: 2.5 },
    joints: { torso_lean: [0, -25], hip_flex: [0, -12], scap_depress_cm: [0, -3] },
    muscles: { lower_back: { keys: [[0, 0.1], [0.25, 0.9], [0.5, 0.2]] }, lats: { keys: [[0, 0], [0.25, 0.5], [0.5, 0]] } },
    tells: [{ text: 'Torso swings past 40 degrees.', joint: 'torso_lean' }, { text: 'The pull ends before the elbows do.', joint: 'scap_depress_cm' }],
    setup: { setting: 'pad', wrong: 0.75, text: 'Thigh pad too high: the hips lift off the seat.' } },
  sources: ['ACE lat pulldown page', 'AAOS ROM chart', 'Physiopedia scapulohumeral rhythm'],
};
```

**Free-weight example:** `lib_dumbbell_lateral_raise` is the lab's `SPEC` re-keyed: `kind: 'rep', order: 'lift_first', symmetric: true, joints: { shoulder_abd: [10, 88], elbow_flex: 14, elbow_lead: 8, knee_flex: 6 }, effort: { model: 'torque', chain: ['shoulder_r'] }`, mistake tempo 0.8/0.2/0.9/2.1 with deltas `knee_flex: [0, 14], torso_lean: [0, 10], shrug_cm: [0, 5], shoulder_abd: [0, 20], wrist_pron: [0, 40]` and tells on `knee_flex`, `shrug_cm` and `wrist_pron`. Custom exercises (pattern `other` or `custom`) get no file (§6).

## 3. The figure

**Rig.** One skeleton, three drawn part sets. Joints (17): `pelvis` (root), `spine`, `chest`, `neck`, `head`; per side `shoulder`, `elbow`, `wrist`, `hip`, `knee`, `ankle`. Named channels on top of joints: `torso_lean`, `shrug_cm`, `scap_depress_cm`, `elbow_lead`, `wrist_pron`, `breath`, `sway`, `layer`. Nesting: pelvis → spine → chest → neck → head; chest → shoulder → upper arm → forearm → hand → equipment; pelvis → thigh → shin → foot. Each joint is a `<g class="j-<name>">` with its own `transform-origin`; only `transform` and `opacity` animate. `rig/ik.ts` (ported from GU-7a's solve, with its own tests) solves a two-bone arm or leg chain to an equipment path when a machine or cable drives the movement.

**Views.** Front (seed: the lab's torso, head, hip band and `ARM()`), side, back. A side view is drawn once and mirrored with `scale(-1, 1)` for the other facing. Three-quarter view: not drawn; no pattern needs it and it would cost a fourth part set with hand-drawn foreshortening. The view is derived from the pattern by `rig/patterns.ts` (all 33 patterns, from the library census: side for pushes, pulls, hinges, squats, lunges, curls, extensions, leg machines; front for abduction, pulldowns, shrugs, crossover, carries, jumps, presses on machines drawn front; back for horizontal abduction and rear-delt work); an exercise may override it only with `viewWhy`. A machine is drawn in the view its exercises use, never the other way round.

**Layering when limbs cross the body.** Two pre-ordered arm groups per view (`arms-behind`, `arms-front`); the keyed `layer` channel toggles opacity between them at the pose where the crossing happens (rows: forearms move in front of the chest at the end of the pull; side view: the near arm is always in front). No `<g>` re-ordering at runtime.

**Poses.** `pose` selects the leg part set and the floor anchor: standing, seated, supine, prone, kneeling, hanging, plank, quadruped. Each pose is a stored start-angle set; the exercise file overrides only what moves.

**Attachment points** (per view, in rig units): `hand_l/r`, `foot_l/r`, `shoulder_l/r` (bar on the back, hack pads), `back` (chest pad, backrest), `hip` (hip-thrust pad), `knee_l/r` (seated calf pad), `ankle_l/r` (leg-curl and extension pads, ankle strap). Equipment is nested in the hand group as the lab does; machine pads are fixed and the body meets them, checked by `handsOnHandle` / `bodyOnPad`.

**Muscle overlays by view** (shimmer band + tint, one pair per muscle). Front: front_delts, side_delts, upper_traps, biceps, forearms, upper_chest, chest, lats (side wall), abs, core, obliques, hip_flexors, quads, adductors. Side: side_delts, front_delts, rear_delts, upper_traps, mid_back (rhomboid band under the blade), lats, chest, upper_chest, triceps, biceps, forearms, abs, core, obliques, lower_back, hip_flexors, glutes, quads, hamstrings, calves. Back: upper_traps, mid_back, lats, rear_delts, triceps, forearms, lower_back, abductors, glutes, hamstrings, calves, adductors (the adductor magnus, inner back of the thigh). Aliases stay as in the app: brachialis → biceps, rotator_cuff → rear_delts. The `targetVisible` check fails any file whose target muscle has no overlay in its view; recomputed in FG-3 over the library's primary muscles: the pattern table alone hides 4 targets on 3 exercises (cable external rotation: rotator_cuff in front; sumo deadlift: adductors in side; hip abduction: glutes and abductors in front), so those three files override the view to back with a `viewWhy` (`check/overlays.ts` `CENSUS_VIEW_OVERRIDES`, D-FG3), and then the count is zero. Follow-up after PR #37: `muscles.ts:51` (abductors view `front` vs the back SVG) → `back`.

**Colour.** The lab's painter (`bodyPal`, `cel`, `band`) moves into `src/formguide/rig/paint.ts` and reads only tokens. The figure tokens the lab introduced (`--pants`, `--pants-hi`, `--pants-sh`, `--ink`, `--iron`, `--iron-hi`, `--iron-sh`, `--eye`, `--floor`, `--guide`, `--target`, `--help`, `--quiet`) are added to every theme in `src/theme/themes.ts` by FG-1 (called out in its PR; `tests/theme.test.ts` parses that file), and the muscle band base reuses `--map-body` / `--map-line` where it fits. Mixes use CSS `color-mix(in srgb, var(--accent), white 30%)` in `stop-color` and `fill` when the app's minimum Android WebView is 111 or newer (FG-1 confirms the floor); otherwise one whitelisted `paint.ts` mixer that takes only token names and numeric white or black. Either way no hex, `rgb()` or `hsl()` literal in `src/formguide/**` (PR #38's theme-test block, extended by FG-1). The mistake tint and the band colours are derived in one place.

**Budgets.** Transforms on inner SVG groups are not composited in Chromium and WebView: the whole SVG repaints every frame, so the budget is a repaint budget, not a compositor one. Batch 0 measures the worst case (compare mode with a machine, Silent Black) on the owner's phone before any budget is final. Until measured: figure target 220 paths per view, hard cap 260; machine ≤ 80; bench or free-weight part ≤ 25; at most two live figures and one machine in the DOM; moments are static images, never live figures. Documented fallbacks if the phone drops under 30 fps: flat cel fills instead of the 16 gradients, fewer brush lines, or the non-moving parts rasterised to one `<image>`. Sizes: form-guide chunk ≤ 150 KB gzip total, a figure view ≤ 10 KB gzip source (the lab's front figure is 7.6 KB with no separate hip, knee, ankle, wrist, neck or spine groups; the jointed figure is measured in FG-1 and the number recorded here), an exercise file ≤ 2 KB gzip (level 9, the `.ts` source; the lateral raise is 1.43 KB).

## 4. Equipment and machines

**Parts library** `src/formguide/parts/`: dumbbell, kettlebell, barbell with plates (plate count from the load, plate sizes from the user's profile or 20 kg default), EZ bar, trap bar, straight bar, wide bar, V-handle, rope, D-handle, band with a fixed anchor, ankle strap, ab wheel, medicine ball (with `release`), jump rope, battle rope, loose plate, bench (flat, incline, decline as one part with an angle), box or step, wall, rack, sled, dip station, pull-up bar, landmine, farmer's handles. Each part: one `<g>` in the comic style (dark iron `--iron*` with one highlight edge), an anchor point, and an optional moving sub-part.

**Machine primitives** (four): pivoting lever (`rotate` about a fixed pivot), sliding carriage (`translate` along a rail angle), cable over pulley (one line endpoint follows the hand; the wrap is a fixed arc at the pulley), rising stack (`translateY` = handle travel × gain; plate count from the load). Every machine is these primitives plus a fixed frame, seat and pads. **Drive rule:** the machine part's path is the source of motion (an arc about the pivot, a line along the rail, the cable line from the pulley); the limb chain is solved to it with `rig/ik.ts`; the author writes the part's travel, the torso and the free joints only. The same rule holds for leg press, hack squat, Smith and pendulum (feet or shoulders fixed to the moving part).

**Machine library** (28 drawings, 60 exercises; view in brackets, equal to the view of its exercises):

- Seated chest press (side): machine_chest_press, incline_machine_press.
- Pec deck / reverse fly (front): pec_fly, rear_delt_fly (arms reversed).
- Shoulder press machine (side, with vertical_push): shoulder_press.
- Lateral raise machine (front): machine_lateral_raise.
- Assisted pull-up (front): assisted_pull_up. Dip station (side): weighted_dip.
- Chest-supported row (side): chest_supported_row. T-bar row (side): t_bar_row.
- Pullover machine (side): machine_pullover.
- Leg extension (side); seated leg curl (side); lying leg curl (side, prone); standing leg curl (side).
- 45° leg press (side): leg_press, leg_press_calf_raise. Horizontal leg press (side).
- Hack squat (side). Pendulum squat (side).
- Hip abduction (back) / hip adduction (front), pads out vs in.
- Seated calf (side). Standing calf (side).
- Ab crunch machine (side). 45° back extension (side). Preacher curl (side). Hip thrust bench (side).
- Lat pulldown station (front; grip zoom for the four grips): lat_pulldown, close_grip_pulldown, underhand_lat_pulldown, single_arm_lat_pulldown, straight_arm_pulldown.
- Seated row station (side): seated_cable_row.
- Dual adjustable pulley (pulley height high, mid or low as a setting; drawn front and side): 21 cable exercises (high 9, mid 4, low 8).
- Smith rack (side; bench or seat added by pose): 5 Smith exercises.

**"More when machines are added" means:** (1) a setup moment before rep one: seat height, pad position and pulley height drawn as adjustable parts with the right setting highlighted and a one-line rule ("pivot level with your knee"), shown as a right-and-wrong pair when the file has `mistake.setup`; (2) the load on the stack or the plates from the last logged set (read-only, no new saved data); (3) the cable path highlighted with a dash-offset flow during the lift; (4) the machine's pivot marked and checked to sit within 0.05 units of the joint; (5) the machine's own mistake in the rep (lean past 30°, hips off the seat) as a delta like any other.

## 5. The production line

**Roles** (one agent each, never more than 5 running):

- Researcher (light model): for one exercise returns `research.json`: joint channels with start and end degrees and cited coaching limits, tempo and order, target, helper and quiet muscles with the effort peak point, one mistake with two visible tells and the joint each tell names, machine settings, each with a source (ACE exercise library, AAOS range charts, NSCA Essentials, Physiopedia, an EMG review; a manufacturer manual for a machine setting when no ACE page exists, flagged `unverified_on_machine` for the owner's gym checklist). ≤ 300 words.
- Motion author (strong model): writes the exercise file from `research.json`, the rig's joint list and one sibling file of the same pattern; runs `npm run fg:check <id>` and returns the file with the output. Never edits `research.json`.
- Artist (strong model, only when the library lacks a part, machine or view): draws it in the reference style from the seed parts and the reference renders; returns the part file and renders in Silent Black and Paper.
- Checker (light model): runs `fg:check`, `fg:render` and the phone gate; returns pass or fail per check with the failing numbers.
- Judge (strong model, fresh context): scores the renders against the rubric with the reference renders open; returns the six marks with one sentence of evidence each, no fixes. Runs in a researcher slot between batches, so the cap of 5 holds.
- Supervisor (this session): the human-level pass on 1 in 5 exercises, every new machine and every new view; owns the batch board; records the owner's frame-rate result per batch.

**Per-exercise steps:** research → author → check → (fix, at most two tries on the same failure, then escalate to the supervisor with the evidence) → judge → merge. Author and checker run in one session when the exercise needs no new art.

**Prompt skeletons:**

- Researcher: "Exercise `<id>` (`<name>`, `<equipment>`, pattern `<pattern>`, kind `<kind>`, primary `<...>`). Fill `research.json`: joint channels with start and end degrees and cited coaching limits; tempo and order; muscles with when effort peaks; one common mistake with two visible tells and the joint each names; machine settings if any. Cite a source for every number."
- Author: "Write `src/formguide/exercises/<id>.ts` as `ExerciseGuide` from `research.json`. Use only channels in `rig/joints.ts`, parts in `parts/index.ts` and machines in `machines/index.ts`. Mistake joints are deltas. For a machine, write the part's travel and the free joints; the arm or leg chain is solved. Run `npm run fg:check <id>` and paste the output."
- Judge: "Open `renders/<id>/*.png` and `docs/design/form-guide-lab/reference/*.png`. Score each rubric row 0–5 with one sentence of evidence. Do not suggest fixes."

**Automated checks** (`tests/formguide/checks.test.ts`, every exercise file; each check has a seeded bad file it fails on):

| Check | Rule |
|---|---|
| smoothness | smooth-check (a)–(d) on the correct figure, with phase windows derived from the file's `tempo` and `order` (never fixed 1/0.5/2/0.5 s): end speeds ≤ 1 % of the phase's top speed, velocity change ≤ 8 % and ≤ 4° per 1/120 s, acceleration jump at stops ≤ 3× the median |
| stops | `stopsFor(tempo)` gives 100 even intervals across each moving phase (D-FG2: 203 stops for a 4 s rep with both moving phases) and no stop inside a hold or rest; a rep sums to 3–5 s and has both moving phases |
| jointRanges | correct figure inside the `research.json` coaching ranges and the AAOS limits at 481 samples |
| mistakeSane | mistake figure inside the AAOS limits, no NaN, nothing clipped, and a delta ≥ 5° or 20 % of range on every joint a tell names |
| mistakeDiffers | peak hand or foot speed differs by ≥ 15 %, or the file is `kind: 'hold'` and the sag delta is present |
| setupDiffers | when `mistake.setup` exists, the setup moment renders the wrong and right setting and they differ |
| handsOnHandle / bodyOnPad | hand-to-anchor gap < 0.5 units at all samples; fixed pads drift < 0.01 |
| feetPlanted | feet on the floor or footplate in standing and seated poses; `ballistic` kinds may leave it during the flight phase and must land within 0.5 units |
| targetVisible | every `muscles.target` id has an overlay in the file's view |
| muscleTiming | target effort peaks within 0.1 of the researcher's `peakAt`, falls in the lower, steps ≤ 0.02 per 1/120 s; keep-quiet muscles < 0.2 in the correct rep and higher in the mistake |
| secondaryMotion | breath amplitude > 0; sway amplitude inside [0.2°, 1.5°]; blade rhythm present when the shoulder rises above 30° |
| pathBudget | paths per figure, machine and part within §3 |
| sizeBudget | exercise file ≤ 2 KB gzip (level 9, the `.ts` source); chunk ≤ 150 KB gzip |
| themes | renders in all five themes with no literal colour; nothing clipped (bounding box inside the viewBox) at t = 0, 0.125, 0.25, 0.625; the moment snapshots are non-blank in every theme |
| everyPoseRenders | the four moments plus the setup moment produce non-empty SVG |
| noFilters | no `filter`, mask, or animated `d` or fill |
| machinePivot | lever pivot within 0.05 units of the bound joint; carriage and cable endpoints on their path within 0.5 units |
| idMatch | `guide.id` = file name and exists in `exercises.json` |
| hash | deterministic snapshot of the stops per channel |

**Batching:** by equipment family and view, so one artist's new parts serve the whole batch. Five agents: 1 artist (when needed) + 2 researchers + 2 author-checkers; the judge takes a researcher slot after every 10 exercises. Per batch the supervisor posts the token estimate before starting and the actual after; the owner can stop between batches.

**Cost estimate** (from the lab: 1.2M tokens for the figure redraw, 0.3M for a design pass; a data-only exercise is text): research 15k, author + check 40k, fixes 20k, judge 15k ≈ 90k tokens and about 25 min of wall time per data-only exercise. New machine drawing ≈ 250k (artist) + judge. New figure view ≈ 1.0M (side), 0.8M (back). Library: 153 × 90k ≈ 13.8M, 28 machines × 0.25M ≈ 7.0M, two views ≈ 1.8M, rig and checks ≈ 1.5M: about 24M tokens over seven batches of about 22 exercises, roughly 3.5M and 2–3 days each at 5 agents. If the budget is cut, the back view and the 30 uncued bodyweight and conditioning exercises drop first.

## 6. App integration

Keep from GU-7a: the player sheet, the host row in `Train.tsx`, `lazy.tsx` failure rule, `registry.ts` (keyed by library ids), `controller.ts` (one-bubble rule, zoom and muscle exclusive), the `waapi.ts` handle, `muscleInfo` and `muscleNotes` (PR #37), the gate blocks and the theme lint (PR #38). PRs #37 and #38 merge before FG-4 (listed as `depends_on`). PR #40 (the low-poly rig solved from the 3D demo) is closed unmerged: FG-1 and FG-2 port its solve, stop spacing and `Truth`/`Channel` types with their own tests, so no test is deleted to make room. Replaced: `parts.ts`, the low-poly `paint.ts`, `solve3` as the drawing source, the three `scenes/*.ts`. `api.ts` takes an `ExerciseGuide`; `RIG_CSS` is scoped under `.form-guide`.

Rendering: `registry` maps exercise id → `import('./exercises/<id>')` (one lazy chunk per exercise; the rig chunk is shared). `sampleGuide(guide)` produces the stops per channel → WAAPI keyframes on the joint groups; slow-down across reps is sampled as one keyframe set per rep (three sets, chained), so the kept `waapi.ts` needs no per-frame code. Effort curves drive band `dashoffset` and tint opacity. Shimmer uses the app's `MuscleId` directly. Load readout: the last logged set from the store (read only); bodyweight uses the F13 load. Mistake toggle: an `aria-pressed` chip; the second figure is mounted only when on. Key moments: static snapshots rendered by the snapshot generator, which resolves the tokens with `getComputedStyle` at capture time and inlines the resolved colours into the data URI (an SVG inside `<img>` cannot read the page's custom properties), regenerates on a `data-theme` change and caches per theme. Reduced motion → Pictures; captions `aria-live="polite"`; the SVG is `aria-hidden` with a text summary. Offline: everything is in the bundle. Custom exercises: the muscle map plus the equipment part chosen from the equipment string, no animation.

Ownership (AGENTS.md): the supervisor adds the `fg:check` and `fg:render` scripts to `package.json` and approves any dependency (prefer the gate's Chromium for renders; no new package expected); FG-1 owns the token additions in `src/theme/themes.ts` and the form-guide block in `src/ui/styles.css`, both called out in its PR; CI additions are add-only; the reference renders are committed by the supervisor from the lab.

## 7. Production order

0. **Batch 0, the rig** (FG-1 to FG-4): rig joints, painter port, checks, player wiring on the lateral raise; the owner's phone measurement of the worst case. Ships behind the existing GU-7a host row.

**Version 1 cut (owner, 2026-09-28).** Version 1 ships the form guide for the owner's own two splits first: 15 exercises. The other 138 follow in the batches below, after the release or in parallel if the budget allows. These 15 need FG-4, FG-5, FG-6 (side view), FG-7 (cables and the pulldown) and the machine parts below. They are built first, as **Batch V1**, before the numbered batches below:
- Free weights and bodyweight (4): `lib_dumbbell_lateral_raise` (done in FG-2), `lib_dumbbell_biceps_curl`, `lib_romanian_deadlift` (barbell), `lib_hanging_leg_raise`.
- Cable (3): `lib_seated_cable_row`, `lib_single_arm_triceps_pushdown`, `lib_lat_pulldown`.
- Machines (8): `lib_machine_chest_press`, `lib_incline_machine_press`, `lib_rear_delt_fly`, `lib_shoulder_press`, `lib_leg_press`, `lib_seated_leg_curl`, `lib_leg_extension`, `lib_seated_calf_raise`.
The numbered batches below then skip whatever Batch V1 already built.

1. **Batch 1, side view, benches and free weights** (FG-5, FG-6, then exercises): the free-weight starter-template exercises: bench presses, rows, RDL, deadlift, squat, lunges, overhead press, curls (13 of the 24 template exercises).
2. **Batch 2, the template machines**: leg press, leg extension, seated leg curl, standing calf, machine chest press, chest-supported row, seated row station, lat pulldown station (the remaining 11 template exercises finish here).
3. **Batch 3, the dual pulley** (FG-7 first): 21 cable exercises plus the remaining pulldowns (27).
4. **Batch 4, upper-body machines and Smith**: pec deck, shoulder press machine, lateral raise machine, assisted pull-up, pullover, preacher, ab crunch, Smith (about 18).
5. **Batch 5, front-view free weights and the rest of the leg machines**: lateral and front raises, shrugs, hip abduction and adduction, calves, hack and pendulum, back extension, hip thrust (about 22).
6. **Batch 6, back view, bodyweight and conditioning**: the `hold`, `alternating`, `locomotion` and `ballistic` kinds, the 30 exercises without coach cues last (about 40).

Definition of done per batch: every exercise file passes all checks; judge total ≥ 24 with no mark < 3; the supervisor sampled 1 in 5 and every new part; gate screenshots in Silent Black and Paper at phone width attached to the PR; chunk size recorded; the owner's frame-rate result recorded; PR merged with `main`.

## 8. Risks and mitigations

- Style drift between agents: only the artist role draws; parts are seeded from the lab; the judge compares with the committed reference renders; a silhouette check is in the judge prompt.
- Anatomical errors: ranges are cited by the researcher and checked by tests the author cannot edit; the judge marks anatomy separately.
- Machines drawn wrong: a cited setup source per machine (ACE, NSCA or a manufacturer manual, flagged when unverified); `machinePivot`; the owner sees every new machine before the batch merges and checks flagged settings in a real gym when convenient.
- Phone performance: measured on the owner's phone in batch 0 and per batch; two live figures max, moments as images, transform and opacity only, `noFilters`, and the documented fallbacks.
- Token cost: light models for research and checking; data-only exercises; the artist only when a part is missing; batch by family; the owner can stop between batches.
- GU-7a overlap: #37 and #38 merge as they are; #40 is closed and ported; no two rigs coexist.
- Views that never get drawn: the side view is batch 1 with the bench press; the back view is last but only the horizontal-abduction and rear-delt exercises depend on it; until then they use the front view with the rear delt drawn as a side overlay.
- Checks an author can game: `peakAt` and ranges come from the researcher's file; `mistakeDiffers` needs the delta on the named joints; `secondaryMotion` is measured, not judged.

## 9. Cards

**FG-1 Rig and painter.** `src/formguide/rig/{joints,patterns,ranges,pose,paint,ik,figureFront}.ts` from the lab's figure code and GU-7a's solve; 17 joint groups; standing and seated poses; front view; figure tokens in every theme; the styles block. Acceptance: A1 the front figure renders in all five themes with no literal colour (theme-test block FG-1); A2 path count recorded, ≤ 260; A3 the lab's four moments reproduce within 1 px on the hand position; A4 `applyPose` uses transforms and opacity only; A5 `ik.ts` solves the lab's arm to the dumbbell path within 0.5 units, with its own tests; A6 the WebView floor for `color-mix` is confirmed and the paint path chosen accordingly.

**FG-2 ExerciseGuide schema and sampler.** `src/formguide/model.ts`, `sampleGuide()`, `stopsFor(tempo)`, the lateral raise file, `research.json` for it. Acceptance: A1 the type compiles and `lib_dumbbell_lateral_raise.ts` matches the lab's numbers (hash snapshot); A2 the stops per channel sample in ≤ 20 ms; A3 the mistake deltas produce the lab's mistake figure; A4 a `lower_first` file and a `hold` file sample with the right phase windows.

**FG-3 Checks.** `tests/formguide/checks.test.ts` with every §5 check, `npm run fg:check` (scripts added by the supervisor). Acceptance: A1 each check fails on its seeded bad file and passes on the lateral raise; A2 the output names the failing numbers; A3 `targetVisible` recount over the library with the §3 lists is zero hidden targets.

**FG-4 Player wiring.** Replace GU-7a's scene source with `ExerciseGuide`; lazy chunk per exercise; mistake toggle; moments as token-resolved snapshots per theme; load from the last set; per-rep keyframe sets. Depends on PRs #37 and #38 merged. Acceptance: A1 the lateral raise plays in the Train sheet; A2 the main chunk grows by 0 KB of form-guide code and the chunk is ≤ 150 KB gzip; A3 reduced motion shows Pictures; A4 gate screenshots in Silent Black and Paper at phone width; A5 snapshots non-blank in all five themes; A6 the owner's frame-rate measurement of compare mode is recorded.

**FG-5 Parts library, free weights.** Dumbbell (from the lab), barbell with plates, EZ bar, kettlebell, bench with angle, rack, box, loose plate. Acceptance: A1 each part ≤ 25 paths, token-only; A2 plate count follows the load; A3 anchors exist for hand, back, shoulder, foot.

**FG-6 Side view figure.** The side part set, supine and prone poses, the mirror rule, the arm layering groups, the side muscle overlays. Acceptance: A1 ≤ 260 paths (number recorded); A2 bench press and squat stills render without clipping; A3 every muscle in the side list has an overlay; A4 judge likeness ≥ 4 against the reference renders.

**FG-7 Cable station and lat pulldown.** Machine primitives, the dual pulley (front and side), the pulldown station, `lib_lat_pulldown.ts` and `lib_triceps_pushdown.ts` with the drive rule. Acceptance: A1 the cable endpoint follows the hand within 0.5 units with the arm solved to it; A2 the stack rises with the load; A3 the setup moment shows the thigh pad and pulley height right and wrong; A4 `machinePivot` passes.

**FG-8 Batch 1 exercises.** The free-weight template exercises FG-1 to FG-6 can draw, by the researcher, author, checker and judge line. Acceptance: A1 every file passes `fg:check`; A2 judge ≥ 24 each; A3 the supervisor's sample of 3 accepted; A4 per-exercise token use recorded below.

## Log

- 2026-09-27: document written; no measurements yet. Frame-rate results and per-batch token use are appended here.
