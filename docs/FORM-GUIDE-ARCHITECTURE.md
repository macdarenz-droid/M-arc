# M/ARC motion: 3D exercise guide architecture

Date: 2 October 2026. Owner request (2026-10-02, branch `claude/motion-upgrade-9n82lj`): one shared 3D figure, made with Meshy, doing each exercise on the right equipment, with the target muscles highlighted, proper posture, proper grip, mistakes and short key facts. Nothing guessed. One exercise first, then the 8 of Split 1 Upper Body, then the library.

This file replaces the paused 2D form-guide architecture of 26 September 2026 (history in git; the 2D code was removed by FG-OFF #98). `docs/FORM-GUIDE-PRODUCTION.md` stays as the record of the 2D production line.

## 1. Decisions in short

| Topic | Decision | Why |
|---|---|---|
| Look | Premium and calm: a realistic adult figure in matte clay, tinted with the theme's colours, soft studio light, technical callouts like the approved Technical Plates. No cartoon styling. | Owner rejected the 2D animation as "a kid app, not premium" (2026-09-29) and approved the Technical Plates (2026-09-30). |
| Figure | One figure for the whole library: Meshy multi-view reference image, then multi-image-to-3D, then Meshy rig (24 bones). Finger bones (3 per finger) added by our own Blender build step. | Meshy rigs have no finger bones (seen on rig task 01a0fc3c, 24 joints). The 3D prototype of 2026-10-02 showed an open hand on a dumbbell, which the owner flagged. |
| Equipment | Meshy makes each machine body once (frame, seat, pads, stack). Moving parts (lever arms, handles, bars, cables) are built in code to the researched sizes. Implements (dumbbell, attachments) are Meshy objects shared across exercises. | Meshy fuses parts into one mesh and is weak on thin parts like cables (Meshy help, 2026-08-15). Hands must sit exactly on handles, which needs exact handle geometry. |
| Motion | Geometry first: the machine defines the handle path, seat and pads; the body follows by two-bone IK with the researched elbow direction. Tempo comes from the exercise's approved tempo bar. No Meshy motion credits. | The fact check showed that literature joint angles do not fit together on a real machine (for example a 90° elbow cannot reach handles at the front of the chest). Meshy's motion catalog has no press, row, pulldown, raise, fly or pushdown. |
| Muscles | Per-vertex muscle regions on the figure, tinted in three tiers: Main, Helps, and Watch (where you should not feel it). | Owner critique of the prototype (2026-10-02): "Muscle highlights needed where u feel it, and where is wrong." |
| Runtime | three.js 0.186.1 (MIT), one lazy chunk loaded inside the How-to sheet only, from the APK, no network. WebGL2 with a fallback to today's 2D sheet. | Measured: 155 KB gzip with GLTFLoader and skinning; model-viewer, Babylon and PlayCanvas are 2–4× larger. Needs the supervisor's OK as a new dependency. |
| Review | Human-eye review of rendered frames by the builder itself, plus numeric contact probes in tests. A fresh reviewer only at hand-off. | Owner, 2026-10-02: parallel critique agents for obvious things waste tokens; do the visual check yourself. |

## 2. What we learned before

- 2D form guide (paused 2026-09-29): the comic figure read as childish. The plates that replaced it are approved and byte-locked, so the 3D view is added beside them, never on top.
- 3D prototype (other repo, 2026-10-02, 85 credits): cut shoulders from a 164° upper-arm twist, an open hand on the dumbbell (no finger bones), highlights on the armpit and lats instead of the deltoid, labels showing in the wrong phase, a 418k-triangle model over Meshy's 300k rigging limit, and a first figure that came back flexing (pose words in the prompt).
- Research fact check (2026-10-02, 8 exercises, 432 claims): 300 confirmed, 83 corrected, 48 unverified, 1 refuted. Most corrections are impossible joint-angle combinations and over-stated key facts. Research files: `docs/research/motion/`.

## 3. Assets and reuse

All files are built once and shared. The figure is never regenerated per exercise.

| Asset | Source | Shared by |
|---|---|---|
| `figure.glb` | Meshy multi-view image → multi-image-to-3D (textured, needed for rigging) → rig → Blender finger bones | every exercise |
| Machine bodies | Meshy multi-view image → multi-image-to-3D, about 30 bodies | each machine's exercises (for example, one pec deck for Pec Fly and Rear Delt Fly; one cable station for all 22 cable exercises) |
| Moving parts | code: tubes, grips, cables to researched sizes | per machine |
| Implements | Meshy, about 12 (hex dumbbell, barbell and plates, EZ bar, trap bar, kettlebell, D-handle, V-handle, lat bar, straight bar, rope, ankle strap, ab wheel) | every exercise using them |
| Simple shapes | code (medicine ball, band, jump rope, battle rope) | — |
| Motion data | `motion/<exerciseId>` data: contacts, handle path, elbow direction, tempo, camera, mistakes | one exercise |

Library count (src/data/exercises.json, 153 exercises): Bodyweight 34, Cable 22, Machine 21, Dumbbells 16+4, Barbell 14, Smith 5, others 1–4 each.

## 4. Meshy budget and prompting

Balance on 2026-10-02: 2,830 credits; after the pilot 2,699 (131 spent, every task in `tools/motion/meshy-ledger.json`). Prices from docs.meshy.ai/en/api/pricing (read 2026-10-02): text-to-image 9 (nano-banana-pro), multi-image-to-3D textured 30, rigging 5, remesh 5. Failed tasks are not charged.

| Item | Count | Credits each (with retries) | Total |
|---|---|---|---|
| Figure (image 9 + 3D 30 + rig 5) | 1 | 44, one retry allowed | 88 |
| Machine bodies (image 9 + 3D 30) | about 30 | 39 × 1.5 | 1,760 |
| Implements (image 9 + 3D 30, or text-to-3D 20) | about 12 | 30 × 1.3 | 470 |
| Reserve for owner-requested redos | | | about 500 |
| **Total** | | | **about 2,800** |

Prompt rules, from Meshy's prompt guide (help.meshy.ai/en/articles/11972484) and the failures above:
1. Always make a 9-credit reference image first and look at it before paying for 3D. Use `--generate-multi-view true` so the 3D step gets front, side and back.
2. Subject first, then parts and materials, then style; 20–80 words; no pose or mood words for the figure beyond the A-pose preset.
3. Say what to leave out in plain words ("the pressing arms and handles are removed"), since negative prompts are not supported.
4. Keep the figure's fingers straight and apart and the arms clear of the body, so rigging and finger weights work.
5. Never ask for thin moving parts (cables, bars, handles) on machine bodies; they are built in code.
6. One generation per asset; reuse task ids for any follow-up step (rig, remesh, convert) instead of generating again.
7. Download every result the same day; non-Enterprise outputs are deleted after 3 days.
8. For a machine, say where its pivots sit against the seat and pad ("pivots high above the back pad") and check that on the reference image against the measured real machine before paying for 3D. The pilot's first chest press body put the pivots in front of the face and cost a second body (39 credits).

## 5. Motion

For each exercise a small data file gives: the equipment and its settings (seat height, pad angle, handle choice), contacts (pelvis on seat, back on pad, feet on floor or plate, hands on handles), the handle path, the elbow direction (pole), the tempo phases, the camera views, and up to 3 mistakes. Each frame is a pure function of time, so renders repeat exactly:

1. Ease the tempo phase, move the machine's moving part along its path.
2. Place the pelvis and torso from the seat and pad.
3. Two-bone IK puts each hand on its handle and each foot on its contact, with the researched elbow or knee direction.
4. Fingers take the grip pose for the handle profile (diameter, thumb wrapped).
5. Clamp every joint to its researched range.

Pilot, Machine Chest Press (`docs/design/motion-lab/`):
- Machine body: Meshy's fused pressing arms are cut away in `machine_prep.py`; the top is raised 22 cm so the pivots sit about 0.77 m above the handle start, as on real overhead-pivot presses; the seat sits 9 cm lower on its post (`tools/motion/machines/chest-press.json`).
- Each lever is one rigid part turned about its pivot, so the handle path is the true arc: it rises 22.5 cm and ends 15.9 cm above the shoulder joint, inside the 5–25 cm rise measured on Cybex, Life Fitness and Technogym presses. The arc ends where the elbow is 14° short of straight, found on the real pose.
- The fingers close the way a hand closes: all joints together, each stopping where its phalanx meets the real handle, checked in 3D. The thumb closes over the index finger's middle phalanx.

Mistakes are the same exercise with one rule broken (for example, seat too low moves the handles to the collarbones), shown with the theme's `--mistake` colour on the body part at fault.

## 6. Muscles

Regions are stored per vertex (COLOR_0, which survives gltfpack/meshopt exactly; custom attributes do not). `tools/motion/regions.py` places them with surface-anatomy rules measured from the figure's own joints (ids match `src/data/muscles.ts`; every rule's numbers are written to `figure.regions.json` for review), then they are checked on rendered views. The pec's lower border is not level: it starts at the 6th rib beside the sternum, passes under the nipple and rises to the front armpit fold. Tiers come from the exercise's How-to feel data where it exists, else from `exercises.json`: Main (primary), Helps (secondary), Takes over (the muscle that takes over in a mistake, for example the front shoulders when the seat is too low). Colours: Main the theme accent, Helps the same accent weaker, Takes over `--mistake`. A gentle pulse; none with reduced motion.

## 7. In the app

- A new `motion` section at the top of the How-to sheet sections (`src/slices/howto/sections/index.ts`), under the tempo bar; the approved plate stays untouched and is the fallback.
- Code in `src/slices/howto/motion/`, chunk named `motion-*` (never `ht-*`), loaded on tap or idle so the 400 ms tap-to-plate budget holds.
- Models are bundled files, parsed with `GLTFLoader.parse` (no fetch, which the no-network rule bans in How-to chunks).
- Theme colours read through a hidden probe element and re-read when the theme changes.
- Battery: render only while visible; stop and free the GPU on close; pixel ratio capped.
- Rotation is horizontal drag only, so the sheet's vertical close gesture keeps working.

Needs a decision before app wiring (the lab page in `docs/design/motion-lab/` does not):
- supervisor: three.js as a dependency; a size budget row for models; whether bundled model files fit the no-network rule;
- owner: 4 of the 8 exercises (incline machine press, rear delt fly, biceps curl, triceps pushdown) have no How-to sheet yet, and the entry is locked to the 8 approved plates (D-HT1).

## 8. Review and checks

- Builder looks at every rendered frame set (start, middle, end, each mistake, grip close-up, five themes) against the research's reference photos, at human-eye level: contact, pose truth, grip, highlights in the right place, premium look.
- Numeric probes (`node tools/motion/probe.mjs <three dir>`, headless Chromium, 67 frames per mode, 17 checks): handle path and rise, start height at the nipple line, upper arm 45–70° from the torso, elbow 10–18° short of straight at the end, back on the pad and hips on the seat every frame, fingertips on the real handle (measured on the posed bones, within 8 mm and never more than 1 mm inside), thumb on its place, wrist bend ≤ 15°, and each mistake showing its fault. A still pose cannot pass. Mutation proofs, each failing as expected: elbows flared to 85°, fingers left open, thumb left open, roll-off without the trunk peel, and a still pose.
- Copy: headings 1–3 words, no sources or advice boilerplate in the app (LR-23), at most 3 mistakes, key facts short and only from verified claims.

## 9. Risks

| Risk | Mitigation |
|---|---|
| Meshy output differs from the request | 9-credit image first; look before paying for 3D; failed tasks cost nothing |
| Skin tears at shoulders or wrists when bones turn | keep forearm roll on the forearm bone, limit upper-arm twist, review the extremes on renders |
| Finger weights bleed between fused fingers | reference image asks for spread fingers; Blender automatic weights limited to the hand; fallback: shared pre-posed grip hands |
| Model size in the APK | remesh or simplify to about 25k triangles for the figure and 15k per machine, meshopt compression, measured per asset |
| Low-end phones | lazy chunk, render on demand, 2D fallback, frame time measured on the owner's phone |
| Licensing | paid Meshy plans own their output; the account's plan name is unverified. Owner confirms before store release |
| Over-building | pilot first, shown to the owner, before the other 7 |

## 10. Plan and time frame

1. Pilot, Machine Chest Press: figure, machine, motion, muscles, grip close-up, 3 mistakes, key facts, five themes, on a lab page for the owner. Built 2026-10-02; waiting for the owner's look.
2. The other 7 of Split 1, reusing the figure: 4 new machine bodies (incline press, pec deck, lat pulldown station, low row station), the dual cable station and the hex dumbbell. About 2–3 days after the pilot is approved.
3. App wiring behind the How-to sheet, once the supervisor approves the dependency.
4. The rest of the library in batches by equipment. About 2–3 weeks, mostly agent time; Meshy spend tracked per batch in this file.

## Motion fix architecture (2026-10-03)

Owner verdict on PR #197 (2026-10-03): the motion is not smooth, and the machine does not follow the body ("lifting, machines don't move up"). He asked for one simple design with posture, grips, muscle targets and machine motion all fixed, shown as an artifact he can judge. This section is the plan for that design. Nothing is built yet.

### Diagnosis

- **2D video (design C, `docs/design/howto-2d/motion/`).** This approach cannot be fixed.
  - The keys are uneven in time but are played as if they were even. The lever covers 40 % of its travel in about 3 frames, then 1.6 % in about 6 frames (`lit.py:58-59`).
  - Optical-flow in-betweens switch hard to the nearer key, which gives a kinked lever, ghost outlines and a doubled hand.
  - Every key and every muscle map is a new AI drawing, so the hand shape, the pec and the far arm drift from key to key.
  - `comp.py` copies the lower picture from the first key, so the stack can never rise. No cable joins the levers to the stack.
- **3D lab (`docs/design/motion-lab/`).** The ease is smooth, but four things are wrong.
  - The stack is fused into the Meshy body and never moves. There is no cable.
  - The lever turns on an axis worked out from its start and end points. That axis is 17.5° off the visible hub's shaft (`chestPress.js:43`).
  - The handle slides across the palm by up to 23° during the rep, and the fingers are wrapped again on every frame (`seated.js:181-198`). The setup's 8° oblique is ignored (`seated.js:164`).
  - The handle path climbs 28° against an 11.2° pad, so it reads as an incline press. The hands end 15.9 cm above the shoulder joint (fails W4 and R:205).
  - Helps is mixed at 0.34, so the front delts look faint (W8). The pulse runs on its own 1.4 s sine, not on the rep (`motion.js:202`).

### Principle (adopted)

**One source of truth per frame.** A single phase value p(t) drives everything. In order:
1. p(t) follows the tempo curve.
2. p sets the lever angle.
3. The lever angle sets the handles, the cable and the stack.
4. The hands are locked to the handles.
5. The arms follow by IK, under the posture constraints.
6. Muscle emphasis is worked out from p and the phase.

Nothing is drawn or solved separately and then matched up. Where one part follows another, the follower is placed from the leader in code on every frame. AI image, video or motion generation is never used per frame. Meshy is used only for static assets, and none are needed for the demo.

### Decisions

| Topic | Decision | Quality / effort / cost |
|---|---|---|
| Figure | Reuse the branch's `figure.glb`: the Meshy figure, 66 joints with 15 finger bones per hand, and muscle regions in COLOR_0. | A realistic adult body that is already reviewed. A procedural figure would read as a mannequin (the owner rejected "kid app" on 2026-09-29) and would need new skinning and new regions. Both cost 0 credits. |
| Machine | Keep the Meshy body (frame, back pad, seat, foot bar). Cut the fused stack, guide rods and hub discs out offline, using remove boxes recorded in `tools/motion/machines/chest-press.json`. Build every moving or exact part in code: lever groups, handles, hubs, cams, cable, pulleys, stack, rods and selector pin. | The premium body stays. Only the parts that must move are code. A fully procedural machine looks like a diagram, and a new Meshy body (39 credits) is not needed. |
| Look | Render the 3D figure close to design C: skin tone, dark shorts and shoes taken from the clothing mask, a soft key light, and the theme background, in all five themes. | C's painted muscle detail cannot be kept without per-frame AI. If the owner wants more definition, the next step is one static detail map, priced and asked first. |
| Tempo | The approved tempo bar: press 1 s, hold 0.3 s, return 1.5 s, rest 0.5 s. | The motion sits under that bar in the How-to sheet, so the two must agree. ACSM gives 1-2 s each way, and ACE's "pause momentarily" sources the hold. The research's own animation choice (press 2 s, return 2-3 s) is a change to approved copy, so it is not made here. |
| Artifact assets | Remove meshopt offline and keep KHR_mesh_quantization, which GLTFLoader reads in plain JS with no WebAssembly. Inline both GLBs as base64. Load three.js 0.186.1 from cdn.jsdelivr.net/npm. | Measured 2026-10-03: figure 1,255,728 B and machine 708,844 B decoded, about 2.62 MB as base64. Loaded headless with no meshopt decoder: 44,979 tris, 66 bones and 1 skinned mesh for the figure; 53,970 tris for the machine. |

### Components and data flow

```
t ─► tempo bar ─► phase, f ─► p = minimum-jerk(f) per phase (C2: speed and acceleration are 0 at every phase edge)
p ─► θL, θR = θ0 + p·Δθ ─► lever groups turn about their fixed shaft axes
                         ├► handle frames ─► hand frame = handle frame × grip offset ─► analytic two-bone IK per arm
                         └► cam pay-out r_c·Δθ ─► cable over the idlers ─► moving pulley on the top plate ─► stack rises
p, phase ─► effort e ─► Main and Helps mix ─► figure shader
scene graph + CPU-skinned contact vertices ─► check(frame) ─► Sync readout / probe.mjs / gate
```

1. **Clock.** t gives the phase and the fraction f, read from the exercise's tempo bar. p = 10f³ − 15f⁴ + 6f⁵ in the press, 1 in the hold, the mirror of the press curve in the return, and 0 in the rest. It is a pure function, so the same t always gives the same frame. The two stops are real: the load reverses at the hold and at the rest.
2. **Machine rig (code).**
   - Each lever group is one rigid part: tube, handle, end cap, hub disc and cam. It turns about one shaft axis through its hub. The bearing housing is built coaxial with that same axis, so the lever stays seated in its hub by construction.
   - **Flat-press rule.** The pivot sits on the line through the midpoint of the handle path, parallel to the back pad. That makes the lever parallel to the pad at mid-press, and the path's chord climbs at the pad's recline (W4). It also keeps the end hand near shoulder height.
     - Worked from the pilot's numbers, this moves the hub about 15 cm forward of today's. A code-built bracket joins it to the Meshy top beam.
     - The axis tilt gives the convergence from 0.31 m to 0.22 m half-width.
   - **Cable and stack.** One cable runs from the left cam, over idlers, round a moving pulley on the top plate, and back to the right cam. So the stack travel s = r_c·(ΔθL + ΔθR)/2 and the cable length stays constant. A cable from the levers to the stack along two guides is sourced (Technogym, research R:129).
     - The ratio k = r_c / R_lever = 0.35 is a design value; no source gives this machine's ratio (R:141). That is about 15 cm of stack travel on the full press.
     - The idlers spin by pay-out / r_p.
     - Only the selected plates rise (pin in plate 6 of 15); the rest stay.
3. **Figure rig.**
   - **Setup solve, once per mode.** Hips on the seat, back and blades on the pad, feet flat, head neutral.
   - **Grip, solved once per hand.** The handle sits at 0.45 of the palm with the 8° oblique, all 4 fingers wrapped and the thumb over the fingers (W6). The finger pose is wrapped once and cached.
   - **Per frame.** The hand frame is the handle frame times the fixed grip offset. That gives the wrist target, then analytic two-bone IK with the 55° flare pole and the forearm twist split. The forearm takes the converging handle's yaw (W7); the wrist keeps 0-10° extension.
   - With no per-frame finger wrap and no 6-pass loop, a frame costs a few vector operations per arm.
4. **Muscles.**
   - Region weights are feathered once at load, by 2-ring smoothing over vertex neighbours, so the 401- and 77-vertex regions get soft edges. The muscle view adds thin border lines.
   - The effort level e comes from the phase: rest 0.30, press 1.00, hold 0.90, return 0.70. Each change is a minimum-jerk blend over the first 0.15 s of a phase.
   - The mix is Main = 0.60 + 0.35e and Helps = 0.45 + 0.25e. There is no free-running pulse. With reduced motion, e is fixed at 0.85.
   - The tiers come from the approved feel data. Main is the chest. Helps is the upper chest, triceps and front shoulders. Watch shows only in mistakes.
   - "Return lower than press" is a design emphasis; no EMG time course is in the research.
5. **Invariant meter.** One pure `check(frame)` function, shared by the page, `probe.mjs` and the gate. It reads the rendered scene graph and CPU-skinned vertices (`SkinnedMesh.getVertexPosition`), never the solver's own plan.

### Invariants the build must expose

Each check runs at 60 fps over one full rep (198 frames) plus the loop seam, on both hands. "Kept" means an existing `probe.mjs` check that stays unchanged.

| Id | Check | Tolerance | Today |
|---|---|---|---|
| MI-1a | Hand-to-handle gap: handle centre in the hand frame vs its setup value | ≤ 1.0 mm every frame | slides; slant −4.5° to +23.4° |
| MI-1b | Handle axis in the hand frame | ≤ 0.5° drift | same |
| MI-1c | Wrist IK residual | ≤ 1.0 mm | — |
| MI-1d | Fingertips on the handle; thumb | 0-8 mm and never > 1 mm inside; thumb ≤ 12 mm (kept) | pass |
| MI-1e | Finger joint change between frames | ≤ 0.1° (the grip is fixed) | wrapped again each frame |
| MI-2a | Lever root on the hub centre | ≤ 0.5 mm | — |
| MI-2b | Lever axis vs the drawn shaft | ≤ 0.1° | 17.5° |
| MI-2c | Left vs right lever angle (right form) | ≤ 0.1° | — |
| MI-2d | Stack travel vs the linkage: \|s − k·arc\| | ≤ 1 mm every frame; ratio error ≤ 1 % once arc ≥ 2 cm | stack still |
| MI-2e | Cable length change | ≤ 1 mm | no cable |
| MI-2f | Idler spin vs pay-out | ≤ 0.5° | — |
| MI-2g | Unselected plates | 0 mm | — |
| MI-2h | Stack seated at p = 0 | gap ≤ 0.5 mm | — |
| MI-2i | Full-press stack travel | ≥ 12 cm (readable) | 0 |
| MI-3a | Rotation step of any bone between 60 fps frames | ≤ 6° (the elbow peaks near 4.5°, from minimum jerk and arm geometry) | — |
| MI-3b | Second difference of any bone's rotation | ≤ 0.8° per frame² | — |
| MI-3c | Elbow swivel step | ≤ 1° | — |
| MI-3d | Spine and hips step | ≤ 0.5° | — |
| MI-3e | Loop seam | passes MI-3a to MI-3d | — |
| MI-4a | p at every phase edge | \|p′\| ≤ 1e-6 /s and \|p″\| ≤ 1e-3 /s² | pass |
| MI-4b | Handle speed | exactly one peak in the press and one in the return | — |
| MI-4c | Peak handle jerk (third difference × fps³) | ≤ 1.1 × 60·D/T³ for that phase | — |
| MI-5a | Skin into cushioned parts (≥ 2,000 contact vertices: back, glutes, thighs, arms, hands) | pads ≤ 12 mm, seat ≤ 20 mm (kept) | pass |
| MI-5b | Skin into rigid parts (levers, hubs, frame, stack, cable) | ≤ 2 mm | unmeasured |
| MI-5c | Lever to frame, seat and pad | ≥ 10 mm apart | unmeasured |
| MI-5d | Cable to body | ≥ 10 mm apart | unmeasured |
| MI-6a | Start: handle at the nipple line | ± 1 cm (kept) | pass |
| MI-6b | Start: elbow flexion (V:146) | 115-140° | 142° |
| MI-6c | Start: upper arm from the torso | 45-70° (kept) | pass |
| MI-6d | Path chord elevation − pad recline (W4) | within ± 3° | +17° |
| MI-6e | End: elbow short of straight | 10-18° (kept) | pass |
| MI-6f | End: hand centre above the shoulder joint (R:205) | ≤ 3 cm | +15.9 cm |
| MI-6g | Elbow below the shoulder joint | every frame | — |
| MI-6h | Back, hips and blades on the pads | every frame (kept) | pass |
| MI-6i | Wrist (R:193, R:219) | extension 0-10° and deviation ≤ 8°, every frame | 11.7-12.9° |
| MI-6j | Heels and toes to the floor | ≤ 3 mm | — |
| MI-7a | Emphasis source | p only; no clock term | sine of t |
| MI-7b | Emphasis shape | monotonic inside each 0.15 s blend; constant elsewhere | — |
| MI-7c | Main mix − Helps mix | ≥ 0.15 every frame | — |
| MI-7d | Helps mix | ≥ 0.45 | 0.34 |
| MI-7e | Watch tier (right form) | 0 | — |
| MI-7f | Rendered colour difference, ΔE2000 per theme | Main vs body ≥ 20; Helps vs body ≥ 12; Main vs Helps ≥ 8 (design floors) | — |
| MI-8 | Determinism | same t gives identical pixels; t and t + cycle identical | — |
| MI-9 | Solve time per frame | shown in ms, not gated, so the owner's phone gives the first real number | unmeasured |

The joint-step ceilings were estimated before the build. If the correct motion breaks one, the motion is checked first. A ceiling changes only with its measured reason written here, and an existing check is never loosened. Each new check gets a mutation proof that turns red: the hand left free to slide, the stack frozen, a computed lever axis, a flow-style hard switch (a 5° pop), and a pulse driven by the clock.

### The demo page (one artifact)

- **Content.** The Machine Chest Press in the right form only. Mistakes keep using the lab and come later on the same pipeline as state overrides.
- **Controls.** Play/pause. A scrubber over one rep, marked Press, Hold, Return and Rest. Speed at 1×, 0.5× or 0.25×. Horizontal drag only, so the sheet's close gesture keeps working.
- **Views.**
  - Side and Front: the stack, cable and both levers stay in frame.
  - Grip: the camera rides the handle frame, so a locked grip holds still and any slip would show.
  - Muscles toggle: Main and Helps fill with border lines and a two-item legend.
- **Sync readout.** A small table with a pass mark per row: hand gap L/R (mm), stack (ratio error %), cable (mm), joint step (°/frame), overlap (mm), wrist (°), path vs pad (°), solve (ms). Each row shows this frame's value and the worst value over the rep.
- **Copy.** Headings are short noun phrases: Sync, Grip, Muscles, View. No sources, no advice lines and no explanations. The page follows light or dark through the app's Paper and Silent Black tokens, and works at phone width.

### Scaling to the 153-exercise library

The same p drives every exercise. Only who leads changes. For machines the lever or carriage leads and the body follows. For cables, free weights and bodyweight the driver joint leads (the D-FG7 amendment rule) and the implement or cable follows.

| Archetype | p drives | The follower, placed in code | Extra checks | Library (§3) |
|---|---|---|---|---|
| Lever on a fixed pivot (selectorised or plate-loaded) | lever angle | handles; hands by IK; cam, cable and stack | MI-2a to MI-2i | Machine 21: presses, lever rows, pec deck (vertical pivot), leg extension and curl (pad on the shin or heel) |
| Cable or pulley station | driver joint | handle fixed in the hand; cable straight from the last pulley; stack = (cable length − rest) / ratio | cable taut and never below rest; pulley swivel faces the cable | Cable 22 |
| Linear guide (sled, Smith, hack squat, leg press) | carriage travel | carriage on its rails; feet or hands locked; plates or stack ride along | on the rail ± 0.5 mm; bar level | Smith 5, sleds |
| Free weight | driver joint | implement = hand frame × grip offset | bar level ± 1°; both offsets constant | Barbell 14, Dumbbells 16 + 4, kettlebell |
| Bodyweight | driver joint | static contacts (floor, bar, bench) | contact slip ≤ 2 mm | 34 |

**Shared modules.** Stack (plates, rods, pin, top plate). Cable (pulley chain, pay-out, spin). Grip profiles (bar, D-handle, rope, dumbbell, lat bar), each with its offset and finger pose solved once and cached. Posture constraints. Effort e(p). `check(frame)`.

**Per-exercise data.** Archetype and parameters, contacts, driver, grip profile and cameras. Tempo, tiers, mistakes and key facts are generated from the same inputs as the plates (`tools/plates/gen`), so the motion and the plate cannot disagree.

**App runtime.**
- The torso, legs and fingers are baked into tracks at build time; in the right form they are mostly static.
- Followers and arm IK stay live because they are cheap, so the sync is exact at any frame rate.
- The APK keeps meshopt (Android WebView runs WebAssembly). Only the artifact uses the decoded files.

### Plates pipeline and golden quality

- The approved plates stay byte-locked. Motion is its own `[data-section]` under the tempo bar.
- `hideSections()` (`tools/plates/fidelity/harness.mjs:458`) hides every section during L2b, F3 and the L3 capture. So the L3 rule (no channel off by more than 1/255, at most 0.02 % of pixels off by 1) and the golden A/B pixels do not change.
- The motion section must meet Guard 4: golden B's section width, 358 / 328 / 308 px at 390 / 360 / 340.
- The section draws nothing until it is tapped. It renders only while visible and stops when closed. So the shimmer tripwire (≤ 1.2 × golden B, 20 ms floor) and the 400 ms tap-to-plate budget see no WebGL work. A new gate block, add-only and named with its task id, runs `check(frame)` for each exercise and measures the tripwire with the section open.
- The plate stays the fallback when WebGL2 is missing.

### Cost

- **Demo: 0 Meshy credits.** Every fix is code or offline asset prep. No Meshy login or key is needed, so the owner's offer of access is not taken up.
- **Library:** the machine bodies and implements in §4 stay the only spend, about 39 credits per body. Each needs the owner's yes.
- **Why the 2D path stops:** at about 170 credits per exercise per view, it would need about 26,000 credits for one view of the library, against a balance of 2,393.

### Risks

| Risk | Mitigation |
|---|---|
| The hub moves about 15 cm forward and may float off the Meshy top beam | A code-built bracket; check renders from 4 views |
| Cutting the stack leaves holes in the frame or shroud | Remove boxes stay inside the stack cage; open edges get a code-built cap; renders checked |
| The stack sits behind a shroud and the lift is hard to see | Side and Front cameras are picked so the stack is in frame; a windowed shroud as a fallback |
| Blocky fingers; 3 fused bridge edges on the right hand (`figure.meta.json`) | The grip view frames the left hand; the fixed finger pose cannot flicker; any hand rebuild is asked and priced first |
| The C look is not matched exactly | The owner judges the page; a static detail map is the only next step |
| Phone frame time unmeasured | MI-9 shows solve time on his phone; the app bakes tracks with live IK only |
| Cam ratio and plate count are design values, not specs | Recorded here as design values; not shown in the app |

### Plan and acceptance

1. **Asset prep (mechanical, Sonnet).** Decoded GLBs, the stack and hub cut boxes, and the region feathering.
2. **Solver changes (Opus).** Fixed shaft axis and flat-press pivot, linkage and stack, fixed grip offset with live IK, effort-driven emphasis, and `check(frame)` in `probe.mjs` with its mutation proofs.
3. **Demo page (Opus).** Published as a private artifact.
4. **Fresh review at hand-off.**

- **Deliverable:** one artifact page of the Machine Chest Press.
- **Acceptance evidence:** every MI check green on the published page's exact source, the existing 17 checks still green, and renders of Side, Front, Grip and Muscles in Paper and Silent Black reviewed by the builder.
- **Finish:** the owner's verdict on the page. App wiring is a separate phase that needs the supervisor's dependency OK (§7).
- **Forecast:** about 1-1.5 days of agent time. The stack cut and the pivot move are the uncertain parts.

### Corrections to §5 and §8

- §5's "inside the 5-25 cm rise measured on Cybex, Life Fitness and Technogym presses" and `machine_prep.py`'s "0.72-0.78 m pivot" have no source in the research files (R:141 lists pivot height and lever length as undocumented). They are replaced by the W4 rule (MI-6d).
- The probe's rise-range check is replaced by MI-6d, which is sourced and stricter.
- The wrist check moves from ≤ 15° to the research's 0-10° extension (MI-6i).
