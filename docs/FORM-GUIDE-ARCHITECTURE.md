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
