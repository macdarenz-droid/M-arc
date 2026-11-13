# LIB-PLATEFIX-5 (PF5)

Owner: supervisor (drafted 11-13). Branch: `claude/lib-platefix-5`. Builder: Opus. Base: origin/main `e15e1c65` (train 88); merge the latest main before READY. The card form is LIB-PLATEFIX-4 (`lib-platefix-4-card.md`).

Sources: PF4 #410 (HANDOFF in the PR body, comments by id), W8a #413 and #415, RESEARCH-ROUTES-4 #414 (research head `207b8de8`), `plan-w8.md` §1-3, `panels/*-findings.md`. Checked on `e15e1c65`: every id below is `approved-plate` in its batch file, and every page it sits on is pinned on main.

## Supervisor rulings (2026-11-13; these win over the text below)
1. **D-PF5-PENDHIP: accepted.** The Trace follows `hip.r`, because the hip rides the carriage's back pad (c23, c3; spec :33-41), the engine traces landmarks only, and it is the house squat Trace point. The test measures that the sampled hip path is an arc.
2. **Q-PF5-1, concentration_curl: it stays staged (D-PF5-CONCSTAGED).**
   - No common hinge is invented. Ruling 12's 32° stands until a research card gives a sourced value.
   - It is out of PF5's build. Record it as follow-up F-CONC-HINGE (research).
3. **Q-PF5-2, jumping_jacks: not a named L1 exception.**
   - Use the text-zoom route (D-SHIP-TEXTZOOM) for `landing-knees` (c5, c6) once F-HT10-TEXTZOOM merges.
   - The panel then judges L1 again, with the text checkpoint in place. A second failure holds the id (D-LIB13-PANEL2).
   - Until F-HT10-TEXTZOOM merges, jumping_jacks waits last in PF5's order.
4. Items 1-4 otherwise go ahead as written. The plates panel uses R1-R11 and the layers panel L1-L8, and each changed sheet gets its D-PFC-ROUND1 check. On-main pages get appended `'owner'` re-pins (D-OWNER-REPIN), and lane-only pages are re-pinned under D-REPIN-UNMERGED.
5. **Order with other lanes:** W8b (#417) also touches lb02-lb05 pages. Merge main with a merge commit whenever main moves, and post a card compare against the judged pages after each merge.

## Scope

13 ids in 4 items. Each id starts a **fresh round 1** (F-FLY-START). Build to the critics' exact fixes and cite each finding by its comment id. Item 5 adds no id: every other B row is blocked elsewhere.

### Item 1: the 8 W6/W7 sheet close-ups (D-PF4-W67LATER, #410 6749684154; D-PLAN-W8C for the W6 three)
Zoom geometry stays in each sheet's `zooms[]` (D-PF4-ZOOMHOME, #410 6749451486). `pages/<batch>.closeups.mjs` gets shell options only.

| id | zoom on main | finding (source) | fix |
|---|---|---|---|
| hack_squat | `lib_hack_squat.howto.mjs:127` `knee-lock`; plate Mistake in `specs/hack_squat.mjs` | L5 [2,2,3]: the Right "slight bend" and the Wrong "locked" leg look the same (#394 6682487876; `w7-findings.md:18-21`). Plate: the Mistake hip rises 10.8 px and the lumbar does not move (#405 6683300292) | Close-up: Right knee bent 15-20° (critic c1's number, still "slight", c7), Wrong straight, a faint hip-to-ankle guide in both panels, an angle mark with no number. Plate Mistake: a wedge of at least 10 px between the pad and the lower back and hips (c8, c9) |
| jumping_jacks | `lib_jumping_jacks.howto.mjs:71` `toes-forward` | L5 [3,3,3]: the Wrong feet barely turn; L8 [3,3,4]: black arrowheads on Silent Black (`w7-findings.md:93-103`). Main's toe-out is 29.7° (#405 6683300292) | Wrong feet turned 30-45° each, larger in the panel, direction marks in the fault token in both themes (c12). The plate stance stays (#405 6684669717 item 14). The knee zoom is out: see Q-PF5-2 |
| wall_ball | `lib_wall_ball.howto.mjs:92` `wall-distance` | L8 [3,3,4]: the panel's left edge clips the Wrong, and it is not tilted (`w7-findings.md:87-89`). Main: trunk 26° Right, 38° Wrong, plus a 63 px shift back (#405 6683300292) | Close-up Wrong only: trunk at least 45° (c3), overlaid near the Right with no extra shift, the whole figure inside the panel. The plate Mistake stays (#405 6684669717 item 13) |
| side_plank | `lib_side_plank.howto.mjs:108` `shoulder` | L5 [3,3,4] in round 2, HELD: "a raised bottom shoulder with a shorter neck gap" (#394 6688202259; `w7-findings.md:51-54`) | Wrong bottom shoulder 20-30 px nearer the ear, neck gap shorter, an up-arrow toward the ear, elbow kept under the shoulder (c7; critic c3's numbers) |
| cable_external_rotation | `lib_cable_external_rotation.howto.mjs:131` `cer-turn` | L5 [2,2,2], L1 [3,3,3]: the twist cannot be seen (#393 6682570363; `w6-findings.md:71-82`) | Shoulder line turned against square hips (far shoulder back and narrower, near shoulder forward), a curved red arrow round the trunk (c8) |
| diamond_push_up | `lib_diamond_push_up.howto.mjs:142` `shoulder-blades`; `:120` `hip-line` | L5 [2,2,2], L1 [3,4,3] (`w6-findings.md:14-20`) | Wrong: shoulder rolled forward of the chest line and down past the hands, upper back rounded; Right: flat upper back, blades together; red dot on the rolled shoulder (c4, c9). Hip line Wrong: the shoulder joint stays on the trunk and the head inside the panel (L1 c1) |
| cable_chest_press | `lib_cable_chest_press.howto.mjs:130` `cable-press-stance` ("Back position") | L5 [2,3,2], L1 [3,4,3] (`w6-findings.md:27-33`) | Wrong: a clear lumbar arch (trunk back, ribs flared, pelvis tipped) and the handles at collarbone height, as the card's Wrong says (c4, c6); a red mark on the low back. The plate's locked arm stays (#405 6684669717 item 8; one critic only) |
| hip_adduction | `lib_hip_adduction.howto.mjs:74` `add-start` | L5 [3,3,3]: the Wrong width barely differs (`w6-findings.md:7-10`) | The amplitude stays (no card range, #405 6684669717 item 5). Add red outward arrows and a grey dashed line at the Right width, and frame the legs so the gap fills the panel. If the PLAN shows W6's fix (#393 6683164302) already has all three, it goes to the panel as drawn. L7 framing is F-PLATE-CROP |

- The W6 three (CER, diamond, cable_chest_press) draw the fault as the main stroke over the faded Right, as the W6 panel asked: `wrong.under` (`render/closeup/crop.mjs:141-142`). See Risks for F-HT4-UNDER.
- A close-up extra that `render/closeup/*` lacks (guide line, arrow) is added opt-in, default off, every other close-up byte-equal (the E3 form, #405 6683300292). Name each in the PLAN.

### Item 2: pendulum_squat, the Trace on the pendulum arc
- Finding: pf8 R6 [3,4,3], "the Trace is a 45 px knee stub" (#405 6688665575; `pf8-findings.md:6` shoulder-pad reading, `:17` hip reading).
- Card: research head `207b8de8` (#414) adds c23 and changes plate.frames to "Trace follows the machine's pendulum arc (c23)". Main still says "Trace follows the knee". Copy `docs/research/howto/cards/pendulum_squat.json` and `quotes/pendulum_squat.json` byte for byte from `207b8de8` (the D-RR-HEAD form), and add `recopied.pendulum_squat` to `lb8/cards.sha.json` (the 2c82a0ca form).
- **The point, this card's call (D-PF5-PENDHIP): the hip, `hip.r`** (pf8 c3). Why:
  - c23 names the swinging carriage, and the hip rides its back pad: the spec keeps the pad on the buttock in every key pose (`specs/pendulum_squat.mjs:33-41`), and c3 keeps the back on the pad throughout.
  - It is the longer arc (c3 ~532 px radius against c1's ~455, at the pf8 tile scale), so it reads better.
  - It runs through open space. A shoulder Trace would lie along the drawn pad and handles.
  - The engine traces landmarks only (`vendor/engine/plate.mjs:187`, `layers/engine/plate.mjs:159`), so c1's "shoulder pad" would be `shoulderTop.r` anyway. `hip.r` is the house squat Trace point (17 library specs).
- Fix: `trace.point` `knee.r` to `hip.r` (`specs/pendulum_squat.mjs:219`), trim re-picked so the arrowhead ends at the drawn end hip. The spec header (`:10-11`), the `lb8/sizes.json` `ids.pendulum_squat.trace` row (basis c23, c3) and `lb8/DESIGN.md:216` say the same.
- The via poses already turn the torso about the pivot (`:40-41`, `:129-130`), so the sampled hip path should be an arc. The test measures it.

### Item 3: fresh round-1 plates for PF4's holds
| id | finding (source) | fix |
|---|---|---|
| dumbbell_fly (pilot-a3) | pf14 R5 [3,3,4] again: "the wrist zoom's source ring sits on the dumbbell (about 138,590), so the wrist bend between hand and forearm does not read" (#410 6756215536, F-FLY-WRIST). pf14 cleared R1, R2, R3 and R7 | Start from PF4's pf14-judged build `8dbb9a73` (`specs/dumbbell_fly.mjs`, `pilot-a3/sizes.json`), with D-PF4-FLYPITCH's named 13° exception and its test back (6752927478). Then: the source ring centred on the wrist joint (a `focus` entry on the wrist, `zoom/inline.mjs:72`, `:86-89`), the red hand bent 25-35° off the forearm line (the 6752920542 rows). Fix the alt too: `specs/dumbbell_fly.mjs:146` says "Mistake: dumbbells sinking below the bench", but the card's Mistake is the bent wrist (c13) |
| cable_curl (lb05) | pf14 R11 [3,3,3] again: "the 2.3× zoom of a ring over the mid-arm repeats what already reads at plate size, and the ring sits about 13 px in front of the elbow and takes in the hip"; R5 passed (6756215536, F-CURL-ELBOWZOOM) | Poses from `8dbb9a73` (pf14 judged them). The card's call: measure the elbow tell at plate size. At or above `deviationMin` 11.39 px (`qa/envelope.json`): no zoom (D-PF4-PULLOVERNOZOOM, 6751721161). Below it: a `focus` ring on the solid elbow only, k 4 (`ZOOM.kMax`; source ring 52/4 = 13 px), the hip outside the ring |
| concentration_curl (lb05) | D-PF4-CONCHOLD (6750385605): at ruling 12's 32° (#405 6683313760) the Wrong elbow stops 16.9 px short of the knee crease, 5.3 px from the Right's (6750368972) | Ruling 12's rule stays: one hinge for both, the fault shown by where the elbow sits. Its 32° cannot stay. The PLAN measures the smallest common hinge at which the Wrong elbow sits in the near knee crease while the Right's upper arm stays near vertical on the inner thigh, short of the crease (c1, c2, c3). **Q-PF5-1:** the supervisor rules that hinge (it amends ruling 12's number). If none exists, stop: the id stays staged (class C), with no panel |

### Item 4: underhand_lat_pulldown, F-UNDERHAND-PQH1
- Finding: generate refuses the approved plate once the row is `shipped` (#413 6761832489, Q7):
  - `PQ-H1 normal: figure:Elbows<br>down, back:28cells`: the label box sits on the back;
  - `F3 raised without a named exemption (45.71; range 49.33–82.26)`: the longest leader is under the envelope floor.
- Ruling D-W8A-UNDERHANDHOLD (#413 6761836128): "A PQ-H1 hard fail is a plate fix, never an exemption." The follow-up is listed in the #415 body and in `LIB-SHIP-DESIGN.md` "W8a rulings and holds".
- Fix: move the `elbows` box (`specs/underhand_lat_pulldown.mjs:152`, `{ left: 2, top: 222 }`) off the figure. PF3 item 1's approved property stays: the leader ends on the elbow, at least 30° off the upper arm (`tests/howto/platefix3-lb1.test.ts:33`, unchanged and green). A longer leader may also bring F3 into range.

### Item 5: the other B rows of `plan-w8.md` §1-3
- PF4 finished 10 of the 31: barbell_bench_press, incline_dumbbell_press, decline_bench_press, back_extension, one_arm_dumbbell_row, straight_bar_triceps_pushdown, machine_pullover, high_to_low_cable_fly, smith_machine_squat, burpee (#410 HANDOFF).
- Items 1-3 hold 9: hack_squat, jumping_jacks, wall_ball, side_plank, hip_adduction, pendulum_squat, dumbbell_fly, cable_curl, concentration_curl. (cable_external_rotation, diamond_push_up and cable_chest_press are A2 rows moved here by D-PLAN-W8C; underhand is A.)
- The other 12 are out of scope:

| id | blocker | goes to |
|---|---|---|
| incline_barbell_bench_press | head-end inset failed twice (D-PF3B-HOLD15) | PF4b, F-INCLINE-INSET |
| smith_machine_shoulder_press | elbow flare needs a head-end inset (E4) | PF4b |
| smith_machine_incline_press | card parent incline_barbell_bench_press (Q-W6-9) | after PF4b |
| low_to_high_cable_fly | a front view cannot show the reach (D-PF3B-LTHHOLD) | PF4b, F-LTH-VIEW |
| resistance_band_pull_apart | `focus` posture zoom and an elbow view (E4) | PF4b |
| rear_delt_fly | the shrug reads only through arrows (pf8 R5, R11) | PF4b |
| bent_over_dumbbell_rear_delt_fly | a front view cannot show the hinge | PF4b, option (a) |
| incline_machine_press, shoulder_press | no machine-handle push key (D-SHIP-W3-NOPAIR) | F-HAND-MACHINEPUSH |
| jump_rope | the hand (its Mistake overlay passed pf13) | F-JUMPROPE-HAND |
| v_up | the V figure and Trace need an engine option (D-PF4-VUPSWAP); framing | F-VUP-SWAP, F-PLATE-CROP |
| superman | framing (D-PF4-CROPCARD) | F-PLATE-CROP |

## Files it may touch (write_scope)
- How-tos, `zooms[]` only: `tools/plates/library/howto/lib_{hack_squat,jumping_jacks,wall_ball,side_plank,cable_external_rotation,diamond_push_up,cable_chest_press,hip_adduction}.howto.mjs`. For items 2-4, a How-to only where the plate change moves one of its anchors, named in the PLAN.
- Shell options: `tools/plates/library/pages/{lb06,lb07,lb08,lb09,lb10}.closeups.mjs`. `render/closeup/*`: opt-in options only.
- Specs: `tools/plates/library/specs/{hack_squat,pendulum_squat,dumbbell_fly,cable_curl,concentration_curl,underhand_lat_pulldown}.mjs`; `pilot-a3/sizes.json`; `lb8/sizes.json` (hack_squat and pendulum_squat rows); `lb8/DESIGN.md:216`.
- Research copy: the two pendulum_squat files above (bytes of `207b8de8`) and `lb8/cards.sha.json`.
- Golden: `tests/howto/golden/library/{lb01,lb05,lb08,pilot-a3}.json`; `{lb08,lb09,lb10}.json` and `.layers.html` (only if a layers sha moves).
- `tools/plates/library/MANIFEST.json` and generated headers (`inputsSha256` only), in `[golden update]` commits.
- Tests: new `tests/howto/platefix5-*.test.ts` and `platefix5-pins.ts`; D-PF5-PINS lines once ruled.
- Never: `tools/plates/vendor/**`, `tools/plates/layers/engine/**`, `tools/plates/library/hands/**`, any other research card, batch stages, committed `pages/*.layers.json`, `src/**`, CI, `escobar-worker/**`, `native/wear/**`, signing, saved-data shapes.

## Steps
1. Read `.claude/skills/builder/SKILL.md`. Branch from origin/main (name the sha) and open a draft PR.
2. Post `PF5 PLAN @ <sha>`: per item, the value measured on main and the target, the test and its mutations, Q-PF5-1, Q-PF5-2, and the D-PF5-PINS list (every other task's test line, before and after; the D-PF4-PINS form). Wait for PLAN RULED.
3. Build item 4 first (smallest, unblocks a ship), then 2 and 3. Item 1 builds alongside.
4. Post `PF5 PLATES READY @ <sha>` per group with page shas built twice, plus the scratch recipe for each layers page that lacks the id.
5. Pins after approval. Merge the latest main with a merge commit, post `PF5 READY @ <sha>`, and a fresh Opus reviewer follows.

## Panels
- **Plates** (R1-R11, the pf13 form: 3 fresh Opus critics, blind, a hidden golden-B anchor and a plant): hack_squat's Mistake, pendulum_squat, dumbbell_fly, cable_curl, concentration_curl (if ruled), underhand_lat_pulldown.
- **Layers** (L1-L8, the D-PFC-ROUND1 form, the lyr-pf11 setup): the 8 close-up sheets and every sheet that shows a changed plate. It counts as round 1.
- **Pages:** lb08 (hack_squat, pendulum_squat), lb09 (side_plank) and lb10 (jumping_jacks, wall_ball) hold their ids in main's layers configs, so the rebuilt pinned pages are judged. lb06, lb07, lb01, lb05 and pilot-a3 do not: build those pages twice with the id added from a scratch config, not committed, and post the sha and recipe (the D-PF4-EARLY19 form).
- One fix round, a recheck, then HOLD (D-LIB13-PANEL2): spec back to main's bytes, `git diff origin/main` empty. New findings in round 2 get one fix and a check (D-SHIP-W5-NEWFIND).

## Pins
- Plate and page entries on main (lb01, lb05, lb08, pilot-a3): appended `'owner'` D-OWNER-REPIN entries. Main's entries are never edited.
- lb08, lb09, lb10 layers pages: rebuild twice. If the sha moves, append a `'supervisor'` `layers-page` entry (point 4); if not, post both shas.
- lb01, lb05, lb06, lb07 and pilot-a3 layers: no PF5 entry. The lane that ships the id pins the page (D-PF4-EARLY19).
- Entries that exist only in this lane are edited in place (D-REPIN-UNMERGED).
- Other tasks' test lines move only under the supervisor's D-PF5-PINS ruling, each at least as strict, with mutations kept red. Known so far: `lb8-plates.test.ts:4385-4387`, `:4410` (D-LIB18-TRACE), `lb5-plates.test.ts:1050` (`'cable-curl'`), and the `lib8r-pilot-a3` and `platefix2-zoom` lines PF4 listed (6750210340, 6752920542; their line numbers have moved since).
- Shared pages with W8b (lb05) and W8c (lb06, lb07) follow D-PLATEFIX-SECOND.

## Acceptance
Each row is a test that is red on main and green after; each mutation turns it red. Values marked "posted" are proposed in the PLAN with their source and ruled with it.

| id | test | mutations |
|---|---|---|
| hack_squat | Right knee 15-20°, Wrong 2° or less, the guide in both panels; plate wedge pad to lower back at least 10 px, hips off the pad | main's bend; guide removed; wedge 5 px; a root-only lift |
| jumping_jacks | Wrong toe-out 30-45° per foot; no (0,0,0) marker in either theme | 29.7° (main); black arrowheads |
| wall_ball | Wrong trunk at least 45°; Wrong box inside its panel; no shift beyond the tilt | 38° (main); the 63 px shift |
| side_plank | Wrong shoulder 20-30 px nearer the ear; elbow within 2 px of the Right's; arrow drawn | shrug 0; elbow moved |
| cable_external_rotation | shoulder line turned against the hips (posted), hips within 1 px of the Right; `wrong.under` drawn | the turn removed; hips turned too |
| diamond_push_up | shoulder forward and down, back rounded (posted); hip-line shoulder joint on the trunk within 1 px, head inside | the Right pose as Wrong; shoulder off the trunk |
| cable_chest_press | lumbar arch deeper than the Right (posted); handles at collarbone height | handles at the Right's height; arch removed |
| hip_adduction | amplitude unchanged; arrows and the dashed Right width drawn | amplitude widened; arrows removed |
| pendulum_squat | `hip.r`; every Trace sample within 1.5 px of one circle about the projected pivot; arrowhead at the end hip; length at least `traceLenMin` and 80 % of the start-to-end hip arc; card and quotes equal `207b8de8` | `knee.r`; vias removed (a chord); trims cutting more than 20 % |
| dumbbell_fly | the 6752920542 rows; pitch 13° on this spec only; ring centre within 3 px of the wrist; hand 25-35° off the forearm; alt names the wrist (c13) | ring on the dumbbell (pf14's place); hand on the forearm line; another spec at 13° |
| cable_curl | no zoom with the tell at least 11.39 px, else ring centre within 3 px of the elbow, k 4, hip outside | ring 13 px in front (pf14); hip inside; k 2.3 |
| concentration_curl (if ruled) | one hinge: 0.00 px apart at hips, shoulder, knee, head and back; Wrong elbow in the crease within 3 px | a different hinge; elbow 16.9 px short |
| underhand_lat_pulldown | no PQ-H1 problem in normal; F3 inside [49.33, 82.26]; generate exits 0 with the row at `shipped` on a scratch copy; `platefix3-lb1.test.ts:33` green, unchanged | box back at `{ left: 2, top: 222 }`; leader along the upper arm |

- Every other plate, zoom and page fragment is byte-proven unchanged (`fragmentsOf`). QA hard checks pass with no new flags.
- `npm run check`, `npm run test:tz` and the gate pass on the READY head, which contains the latest main.
- No closing keywords in commits or the body (F-COMMIT-KEYWORDS).
- Finish: PF5 READY with each item approved or held (D-LIB13-PANEL2), pins in, CI green, the review passed.

## Stops (post a question, wait)
- concentration_curl: no common hinge fits c1-c3 (Q-PF5-1).
- pendulum_squat: the hip path is more than 1.5 px off its circle, or a leader's clearance from the Trace falls below its current lb8 A15 value. Post the hip and `shoulderTop.r` numbers side by side.
- underhand_lat_pulldown: H1 cannot clear while `platefix3-lb1.test.ts:33` holds, or F3 stays out of range. An F3 exemption is the supervisor's to name, owner-visible on the sheet; an H1 exemption never is.
- A fix needs the vendor or layers engine, `hands/**` or a second plate view: that item moves to PF4b or a hands card.
- Any byte of another plate, zoom or pinned page moves.
- The research head has moved past `207b8de8` with more pendulum_squat edits.
- A walker crosses 480 s.

## Q-PF5-2: jumping_jacks L1
L1 [3,4,3] (`w7-findings.md:90-92`): the legs are drawn straight under SOFT KNEES, and the card's `landing-knees` zoom is missing (c5, c6). The stance is ruled (#405 6684669717 item 14). A front view cannot show the bend (D-LIB22-FRONT, `specs/jumping_jacks.mjs:3-5`), and close-ups use the plate's view (`render/closeup/crop.mjs:52`). **Recommended:** a named L1 exception in the D-BODYMAP-NOCUFF form, with the knee zoom routed to F-PLATE-SIDEVIEW (#415). Otherwise jumping_jacks waits for that card.

## Out of scope
- PF4b and the other cards in item 5's table; jumping_jacks' knee zoom.
- The W8a tool holds: F-HT4-UNDER, F-LAYERS-MGHOST, F-HT10-TEXTZOOM, F-HAND-PALMFLAT-SIZE (assisted_pull_up, seated_leg_curl, mountain_climbers).
- Flipping any row: the W8 lanes do that.
- Anything under `escobar-worker/**`, `native/wear/**`, signing or keystore; any change to saved-data shapes.

## Risks
- A fresh panel can fail again. Mitigation: build to the critics' exact fixes; HOLD after round 2.
- `wrong.under` turned howto-shard 4/67 red when assisted_pull_up tried to ship (#415 6763627947). Mitigation: PF5 ships nothing; W8c must not ship CER, diamond or cable_chest_press before F-HT4-UNDER lands. No F-HT4-UNDER card exists yet.
- Ruling 12's number changes (concentration_curl). Mitigation: Q-PF5-1 before any build.
- Other tasks' pins go red. Mitigation: the D-PF5-PINS list is ruled before any edit.
- No lane is named yet to ship lb08-lb10's held rows (plan-w8 names only W8a, W8b, W8c). Mitigation: the supervisor names one before PF5 READY.
- CI walk time. Mitigation: the PF4 form; if a walker crosses 480 s, tell the supervisor.

## Not verified
- `panels/pf11-findings.md` to `pf14-findings.md` are not on `claude/sup-lib4-cards` @ `56249acd`; the pf12-pf14 critic words above come from #410's supervisor comments.
- `lib4-cards.md` §48 @ `56249acd` records PF4's plan, not its rulings or holds; those come from #410.
- Whether lb08-lb10 layers pages embed plate bytes. PF4 READY (6761897411) found them unchanged after lb10's plates changed.
- Whether W6's or W7's fix rounds already meet part of item 1. The PLAN measures each on main.
- No card file exists yet for F-PLATE-SIDEVIEW or F-HT4-UNDER.
