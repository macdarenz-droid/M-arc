# F-INCLINE-INSET: incline_barbell_bench_press's flare inset, in the approved ring form

Owner: supervisor (drafted 11-16; status `draft`). Branch: `claude/f-incline-inset`. Builder: `claude-opus-5-5`, lane L4 (plan-w9.md:165). A fresh Opus reviewer follows READY. Base: origin/main `2a898c3e` (train 103). Every file:line below was read on that commit unless another sha is named.

This is a plates card in the LIB-PLATEFIX form (`lib-platefix-5-card.md`): one plate, a fresh plates round 1, one fix round, then HOLD or approve. It flips nothing. Its layers round is W12's (plan-w9.md:53, :173).

Sources:
- PF3 #405: PLAN item 15 (6682819340), round-2 note (6687163987), pf8 result (6688665575);
- PF3b #408: PLATES READY (6704077435), pf10 result and rulings (6704679655), 3b FIX (6705100833), crop check (6705141445), READY (6706662454);
- `panels/pf7-findings.md:54-57`, `pf8-findings.md:3`, `:8`, `:12`, `:20`, `pf10-findings.md:7-14` (on `claude/sup-lib4-cards`);
- `plan-w8.md:53`, `:154`; `plan-w9.md:48`, `:53`, `:73`, `:79`, `:137-139`, `:165`, `:173` (this branch); `PANELS.md` §1 and §5 (on main).

Scratch checks (supervisor scratchpad `ficscripts/`, never committed):
- `centres.mjs`: `zoomOf` per view on main's engine and on `388db2e4`'s tree;
- `r7.mjs`: main's incline plate, `labelBoxes` and `leadersOf` (zoom/inline.mjs:138, :153).

## Why now
- It is the longest chain to the 142: this card, then incline_bb's layers round in W12, then smith_machine_incline_press's sheet (a 317 B stub) and its round 1 in W13 (plan-w9.md:173). So it starts now, in L4.
- smith_machine_incline_press waits on it: its card parent is incline_bb (Q-W6-9; plan-w9.md:73).

## History (three rounds, then held)
| round | head | R5 (flare reads in 2 s) | other | source |
|---|---|---|---|---|
| pf7 | #405 `1272f414` | [2,3,2] | — | pf7-findings.md:54-57 |
| pf8 | #405 `d8cd3ac7` | [3,2,3] | — | 6688665575: "goes to PLATEFIX-3b, whose head-end inset (item 15) is this fix" |
| pf10 | #408 `388db2e4` (head-end inset, no source ring) | [3,4,3] | R7 [3,3,3], R11 [2,1,2] | pf10-findings.md:7-14; 6704679655 |

- **D-PF3B-HOLD15** (6704679655): "R5 is the same finding as pf7 R5 and pf8 R5 ... Hold it, with the incline spec back to main's bytes ... Follow-up F-INCLINE-INSET: it can come back as one item once 22's ring form is approved. Also fix the 'BENCH AT 30°' leader that runs through the '30°' text (R7)."
- **22's ring form is approved.** D-PF3B-INSETRING (6704679655) added a dashed source ring on the side view over the shoulder and elbow; the crop check passed it (6705141445). It is on main: `specs/smith_machine_bench_press.mjs:148` (`SRC_RING`), `:212-215` (the two `project: 'head'` entries with `src`), and the engine's `src` rule at `zoom/inline.mjs:57-60`, `:279-287`, `:309-313`.
- PF3 round 2 asked for a side-view zoom, and QA refused it (`H3.zoom:not-needed`; "the tell moves 23.8 px", 6687163987). That was a tell zoom. A posture zoom (`focus`) is exempt from that row (qa/zoom.mjs:165-172).
- PF4 and PF5 never built it (plan-w9.md:53; lib-platefix-5-card.md:72).

## The findings to build to (pf10, 2 of 3 critics each)
**R5** (c1, c3; c2 passed at 4):
- c1: the side-view flare is "a 50-px cluster of red dashes ... a dashed ring over the shoulder dot, an arrow from the elbow". Fix: drop that dashed ring, keep the red arrow from the correct elbow to the flared one and the dashed forearm to the bar.
- c3: the inset "shows a cut-off torso edge and two unidentifiable rounded shapes". Fix: a readable top-down view (head, both shoulders, the bar line across the chest), the solid upper arm about 60° from the trunk and the red dashed one at 90°, with the arrow, keeping the drawn upper-arm length. In the side view, one leader (ELBOWS FLARE OUT) on the ghost elbow, and LEVEL WITH SHOULDERS as a short dashed line through the shoulder joint, perpendicular to the trunk, "as T02 does" (T02 was smith).

**R7** (all three): the BENCH AT 30° leader runs straight through the separate '30°' value. Each critic offers moving the value off the leader, or dropping it.
- **Reproduced on main** (`r7.mjs`): the bench leader runs (172.4,269.6) → (114.2,274) → (104.2,274). The arc label box spans x 124.0-145.0, y 262.0-294.0, and 18 of the leader's 101 samples fall inside it.
- 388db2e4 changed no label (its diff against main is the inset block and the alt only), so R7 is a defect of main's bytes: PF3 item 15's layout, `specs/incline_barbell_bench_press.mjs:210` (measure box `{ left: 124, top: 262 }`) and `:213` (bench box `{ left: 56, top: 252 }`, anchor `ARC_END`).

**R11** (all three; [2,1,2]):
- no dashed source ring, so the circle and the lifter do not read as a pair (c1, c2, c3);
- the circle moves between views (c2: "about 150 px"; c3);
- c3: a short dashed connector to the inset; remove the "two unexplained bulbs" at about x 575-670, y 435-500 (dark.png). c1 and c2 also name two knees or humps at the bottom.
- c1 and c2 ask for a true magnification instead. That is Q-FII-1.

**Measured** (`centres.mjs`, plate px):
- 388db2e4's inset: normal circle (258,106), Mistake circle (274,184), r 62. That is 79.6 px apart; the critics' "about 150 px" is at the panel's PNG scale [est about 2×].
- The same entries with `src: ['shoulder.r','elbow.r']` in place of `ring: false`, on main's engine: the same two centres; the source ring (165.2,243.8), r 16, in both views; the link drawn in both views.
- smith on main, for comparison: both views at (258,126), r 68; ring (154.4,270.8), r 22.1; no link (D-PF3B-INSETRING accepted that, 6705141445).
- So the ring alone does not fix the move. The placement search runs once per view and takes the free spot nearest the focus (zoom/inline.mjs:256-269, :280); the two views' ink and labels differ.

3b's inset numbers (6704077435): Right upper arm 45.8 px, 60.7° from the torso (spec 60°, c7 45-75); Wrong 46.6 px, 91.4°, a full red dashed outline; headPitch 66.9° on the 30° bench.

## What to build (one item, four parts)
Start from the pf10-judged inset (`git show 388db2e4:tools/plates/library/specs/incline_barbell_bench_press.mjs`: `headCapsule`, `HEAD_GHOST`, `HEAD_INSET` and the two `zoom` entries), on main's spec (keep main's alt, :230). This is the F-FLY-START form, as PF5 started dumbbell_fly from its judged build (lib-platefix-5-card.md:54).

1. **The ring (R11).** Both entries take `src: ['shoulder.r', 'elbow.r']` (smith's `SRC_RING`, :148) instead of `ring: false`. The link is drawn in both views; the measured build already draws it.
2. **One place in both views (R11).** The two circles share one centre, and the ring is the same in both views. Q-FII-2 rules how.
3. **The inset content (R5 c3; R11 bulbs).**
   - It shows the head, both shoulder joints and the bar line across the chest. The bar line is an entry `ref` (zoom/inline.mjs:42, :291: a grey dashed line drawn only inside the zoom), from `grip.l` to `grip.r` in the end pose.
   - The Right upper arm stays 45-75° from the torso (c7) and the Wrong 85-95° (the spec's 90°, :39-40), each at least 40 px long in the circle. The 85-95° band and the 40 px are proposed here and ruled with the PLAN; 3b drew 45.8 and 46.6 px, and c3 asks to keep that length.
   - Neither knee is inside the circle. Q-FII-2 rules how.
4. **The side view (R5 c1, c3; R7).**
   - Drop the 2.25 px dashed joint ring (`RING`, :150, :222) if the PLAN shows it is c1's "dashed ring over the shoulder dot" (see Unverified). The arrow (:223) then ends at the flared elbow.
   - Add the shoulder line: a short dashed guide through the Mistake shoulder joint along the chest normal (`NB`, :98), smith's `SHOULDER_LINE` form (smith :142).
   - Move the 'level' tell's anchor to the line's far end with an `off`, in smith's `LEVEL_AT` form (smith :146), so it stays a landmark that the inset's deviation row can read (qa/zoom.mjs:127-134) and the two Mistake leaders end apart.
   - R7: move the measure box (:210) and, if needed, the bench box (:213) so that no leader crosses a label box other than its own. Keep the '30°' value and the leader ending on the arc, which PF3 item 15 pins (platefix3-lb23.test.ts:20-50). See Q-FII-4.

The poses, the bench, the rack, the tempo, the callout texts and the alt stay as they are on main.

## Shared code and other rows (bytes unchanged unless named here)
- **smith_machine_bench_press** (pilot-b, 3b item 22) shares `project: 'head'`, `src` and `headCapsule`'s form. It was approved by crop check (6705141445) and is pinned with `'owner'` entries 10-11 (#408 6706662454). Its plate, inset and page stay byte-equal. It ships via W10's round 2 (plan-w9.md:48).
- **smith_machine_incline_press** (lb06) cloned this spec by copy, never import (`specs/smith_machine_incline_press.mjs:6`, imports at :27-30), so its bytes cannot move. Its sheet is a 317 B stub, written in W13 after incline_bb ships (plan-w9.md:73). Not touched here.
- **smith_machine_shoulder_press** (lb06) needs its own head-end inset (E4; plan-w9.md:79, PF6b). Not here. Any opt-in this card adds is named so PF6b can reuse it.
- `eq/inclineBench.mjs` is imported by 8 specs (arnold_press, dumbbell_shoulder_press, incline_dumbbell_curl, incline_dumbbell_press and its `__lb2`, smith_machine_incline_press, smith_machine_shoulder_press, this one). Never touched.
- `zoom/inline.mjs` and `qa/zoom.mjs` serve every zoom entry (MANIFEST.json names `zoom/inline.mjs` 134 times). Any change there is an opt-in, default off, with a byte proof over every other entry (the #395 form, as 6705100833 did).
- The incline How-to sheet (`howto/lib_incline_barbell_bench_press.howto.mjs`, 16,582 B) has one card zoom, `back-on-incline-pad` (:101-110), on the lumbar. Nothing here moves it; if the PLAN finds that a plate change moves a sheet anchor, stop.
- The lb02 layers page holds only dumbbell_pullover (`pages/lb02.layers.json`, groups), so incline's plate should not move it [unverified]. The PLAN rebuilds it twice.

## Rulings asked
1. **Q-FII-1: the head-end inset with its own source ring** (smith's D-PF3B-INSETRING form), not a side-view magnification.
   - Recommended: the head-end inset. The flare happens across the body: side-on, the flared upper arm projects to 9.8 px (6682819340 item 15), so a magnified side view would show a bigger knot. D-PF3B-HOLD15 named this route, and smith's form passed (6705141445). The card's own view stays side (`cards/incline_barbell_bench_press.json` viewWhy).
2. **Q-FII-2: how the inset gets one place, and keeps the knees out.**
   - Recommended, in this order:
     - (a) spec only: the PLAN finds what blocks each view's spot (ink, label or leader) and steers both searches to one free spot by `r`, the focus region or a box move;
     - (b) if (a) cannot, two named opt-ins, default off: a Mistake entry that takes its normal entry's centre (the build stops if that disc is not free on the Mistake plate under the same rules), and a head projection that leaves out the legs (the `noForearms` form, zoom/inline.mjs:315-319). Each needs a qa/zoom.mjs row and a byte proof that every other entry, smith's included, is unchanged.
   - Why: three critics flagged both. Spec-only changes move 8 MANIFEST keys (the incline spec's); an engine opt-in moves up to 134, plus the generated headers that read it, which collide with W9 and W10 (see Risks).
3. **Q-FII-3: the side-view clean-up** (R5 c1 and c3) edits LIB-10's R5 pins (`lb2-plates.test.ts:503-533`, #265 6396940823): the 2.25 px ring, the arrow ending on it, and 'level' exactly on the shoulder joint.
   - Recommended: yes, under D-FII-PINS. The replacement is at least as strict:
     - no dashed ring item;
     - the arrow from the correct elbow to the flared elbow, each end within 1 px;
     - the shoulder line through the Mistake shoulder within 1 px, and square to the pad within 2°;
     - the two Mistake leader ends at least as far apart as smith's (posted in the PLAN; never under the current 6 px, :518);
     - each tell anchor a landmark.
   - Its mutations stay: ring back, short arrow, level back on the upper arm.
4. **Q-FII-4: R7 moves the value, never drops it.**
   - Recommended: move. The engine always draws the arc value (`vendor/engine/plate.mjs:272`, `:299`), and dropping it would edit PF3 item 15's pin (platefix3-lb23.test.ts:25: value '30°'). All three critics offered moving it.
5. **Q-FII-5: one sentence in the critic prompt for R11.** For example: "The circle on this plate is a head-end inset of the bottom pose (the lifter seen from above the chest, head at the top); its dashed source ring marks the shoulder-elbow region it shows."
   - Recommended: yes. R11's text defines the circle as a magnification (PANELS.md §5). All three pf10 R11 notes faulted the inset for not being one, and smith's ring form was approved by a crop check, never by a blind panel. Without the sentence the panel may judge the ruled form, not the drawing. It is the "one prompt sentence" form of PANELS.md §1 step 5. Critics still judge whether the pair reads.

## Write scope
- `tools/plates/library/specs/incline_barbell_bench_press.mjs`. No other spec.
- Only if Q-FII-2 (b) is ruled: `tools/plates/library/zoom/inline.mjs` and `qa/zoom.mjs`, the named opt-ins only, default off.
- `tools/plates/library/lb2/DESIGN.md`: the incline section only.
- `tests/howto/golden/library/lb02.json`: appended `'owner'` D-OWNER-REPIN plate and page entries only (the form of entries 9 and 10).
- `tools/plates/library/MANIFEST.json` by `manifestOf`, in `[golden update]` commits.
- Tests: new `tests/howto/f-incline-inset.test.ts` and `f-incline-inset-pins.ts`; other tasks' lines only under the ruled D-FII-PINS list.
- No AGENTS exception is needed: `scripts/screenshot-gate.mjs` and `tests/theme.test.ts` are not touched.
- No saved or sent data: a plate drawing in `tools/` only. `src/**` moves only if a `[golden update]` regenerates `inputsSha256` header lines (PF3b's form, #408 6709007833 row 1).

## Steps
1. Read `.claude/skills/builder/SKILL.md`. Branch `claude/f-incline-inset` from origin/main (name the sha). Open a draft PR 'F-INCLINE-INSET'.
2. Post `F-INCLINE-INSET PLAN @ <sha>` with:
   - every number above re-measured on the base (centres, ring, R7 samples, 3b's inset numbers after the copy);
   - which drawn item is c1's "dashed ring over the shoulder dot", with its plate px;
   - for Q-FII-2, what blocks each view's spot and the spec-only attempt, with numbers;
   - the region, `ref`, `r` and `off` values proposed, and the knee positions against the circle;
   - the test list and mutations (below);
   - the D-FII-PINS list: every other task's line, before and after (the D-PF5-PINS form). Known so far:
     - `lb2-plates.test.ts:503-533` (Q-FII-3);
     - `platefix2-zoom.test.ts:20` (OURS) and `:58-69` (the PF2 (a) hash and `n`);
     - `platefix3b-zoomhead.test.ts:15` (OURS; its comment names this hold) and `:23-`;
     - `library-ci.test.ts:885` (the lb02 page pin).
     The PF3b form applies: OURS gains incline_barbell_bench_press. Main's incline spec has no zoom, so the "every other spec" set and its count stay the same (#408 6709007833 row 1b).
   Wait for 'F-INCLINE-INSET PLAN RULED'.
3. Write the tests first and run them on the base: each acceptance row is red there. Post the red lines.
4. Build the four parts. Run the new tests, `lb2-plates`, `platefix3-lb23`, `platefix3b-*`, `platefix2-zoom` and `lb2/qa.mjs` (10 hard checks).
5. Build the lb02 plates page twice (`node tools/plates/library/lb2/build.mjs`), and the pilot-b plates page and the lb02 layers page twice for the byte proofs. Post `F-INCLINE-INSET PLATES READY @ <sha>` with the page sha, crops of both views at 390 px in Silent Black and Paper, and the byte proofs.
6. The supervisor runs the blind plates panel (below). On a fail: one fix round to the critics' exact fixes, posted as `F-INCLINE-INSET FIX @ <sha>`, then the focused recheck.
7. After approval: the pins (appended `'owner'` entries, `[golden update]` MANIFEST, the ruled D-FII-PINS lines). Merge the latest main with a merge commit. Run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` once. Post `F-INCLINE-INSET READY @ <full sha>`.
8. On a second failure: HOLD (D-LIB13-PANEL2). Put the spec and every touched test back to main's bytes (`git diff origin/main` empty on them), post HELD, and name the follow-up.

## Panel
- **Plates panel** (PANELS.md §1, the pf13 form): 3 fresh Opus critics, blind, R1-R11, one hidden golden-B anchor and a plant, in a set of 8 tiles or fewer (plan-w9.md:168). It is a fresh round 1 (F-FLY-START). It may share a set with PF6a or PF6b ids to save a panel.
- A finding counts when 2 of 3 critics score an item 3 or less. One fix round, a focused recheck, then HOLD. A new finding in round 2 gets one fix and a check (D-SHIP-W5-NEWFIND).
- **No layers round here.** It is W12's, on the approved plate (plan-w9.md:53).

## Acceptance
Each row is a test, red on main and green after, unless marked.

| id | check | evidence |
|---|---|---|
| I1 | Both views carry a `head` inset with `src` ['shoulder.r','elbow.r']; the drawn `pz-src` ring holds both dots (qa/zoom.mjs:117); the link is drawn in both views | test, plus lb2 QA |
| I2 | One place: the normal and Mistake circle centres within 1 px of each other, the rings equal | test |
| I3 | Content: head, both shoulder joints and the bar `ref` inside the circle; both knees outside it; Right upper arm 45-75°, Wrong 85-95°, each at least 40 px long | test (inset projection, postureUV) |
| I4 | Side view: no dashed ring item; arrow ends within 1 px of the correct and flared elbows; shoulder line through the Mistake shoulder within 1 px and square to the pad within 2°; leader ends apart (Q-FII-3); every tell anchor a landmark | test |
| I5 | R7: no leader's path enters a label box other than its own (2 px margin; on main the bench leader is inside the arc box for 18 of 101 samples); the value is '30°' and the bench leader ends on the arc (platefix3-lb23.test.ts:35-50 unchanged and green) | test |
| I6 | QA: lb2 `qa.mjs` 10/10 hard checks with no new flags; H3.zoom:posture rows clean (hold, fill, source, deviation) | output |
| I7 | Nothing else moves: every other plate, zoom and page fragment is byte-equal (`fragmentsOf` over all page configs; the zoom-hash loop over every other entry, smith's included); the pilot-b plates page and the lb02 layers page keep their pinned shas | output |
| I8 | Panel: approved at the READY plate's sha, or HELD with the spec at main's bytes | the supervisor's result comment |
| I9 | The READY head contains the latest main; check, test:tz, the gate and CI are green; no closing keywords in commits or the body | CI links; a grep |

## Mutations
Each turns its row red. Post the red lines.

| id | mutation | red |
|---|---|---|
| m1 | `ring: false` back on either entry | I1 |
| m2 | the Mistake entry placed by the search again (388db2e4's (274,184)) | I2 |
| m3 | the focus region back to `HEAD_INSET` with the knees in the circle (388db2e4's region) | I3 |
| m4 | the Wrong arm's ghost removed, or the Right arm at 30° | I3 |
| m5 | `RING` back in `mistake.guides` | I4 |
| m6 | 'level' back on `{ at: 'shoulder.r', pose: 'mistake' }`, no offset | I4 |
| m7 | the measure box back at `{ left: 124, top: 262 }` | I5 |
| m8 | one byte of smith's spec or of another zoom entry changed | I7 |

## Stops (post and wait)
- No spot passes both views' rules, even with the Q-FII-2 (b) opt-in.
- The knees cannot leave the circle while the head, both shoulders and both arms stay in it.
- A part needs `vendor/**`, `layers/engine/**`, `eq/**`, `hands/**`, another spec or the sheet.
- Any byte of another plate, zoom entry or pinned page moves.
- A QA hard check or an H3/H4 zoom row turns red and is not cleared by the spec.
- A walker crosses 480 s.

## Never
- `tools/plates/vendor/**`, `tools/plates/layers/engine/**`, `tools/plates/library/eq/**`, `hands/**`, `render/**`, `gen/**`, `tools/plates/generate.mjs`.
- Any other spec, sheet, research card or quote; batch stages; committed `pages/*.layers.json`.
- `src/**` except regenerated header lines; `scripts/screenshot-gate.mjs`, `tests/theme.test.ts`, `.github/**`, `package*.json`.
- `escobar-worker/**`, `native/wear/**`, signing and keystores, saved-data shapes (`src/core/models.ts`, `store.ts`, migrations).
- Flipping any row. Loosening any check: no skip, no wider tolerance, no removed mutation.

## Risks
- **A fourth R5 failure.** Three rounds failed on the side view alone. Mitigation: the inset carries the fault in the approved form, both R5 critics' exact fixes are built, and Q-FII-5 keeps R11 judging the drawing.
- **The panel judges a head-end inset against a magnification rubric** (PANELS.md §5 R11). Mitigation: Q-FII-5.
- **Engine opt-ins collide with the waves.** A `zoom/inline.mjs` change moves up to 134 MANIFEST values and the generated headers that read it, and W9 #433 and W10 #434 both touch MANIFEST.json (364 lines) and lb02.json. Mitigation: spec-only first (Q-FII-2 (a)); merge main with merge commits; MANIFEST only by `manifestOf`; headers only by the generator (D-PFS-HEADERS); append after the other lane's entries (D-PLATEFIX-SECOND).
- **smith's approved inset moves.** Mitigation: I7's byte proof and m8; any opt-in is default off.
- **Supervisor time.** Mitigation: share a panel set with PF6a or PF6b ids.
- **W12 sees a different sheet.** Mitigation: the PLAN builds incline's sheet from a scratch lb02 layers config (never committed, the D-PF4-EARLY19 form) and posts its sha, so W12 knows what it judges.

## Forecast [est]
- PLAN 2 h; build and tests 5-7 h; PLATES READY. The panel takes 2-3 h of supervisor time. A fix round and recheck add 4-6 h. Pins, CI (about 94 min a run) and review add 4 h.
- **About 2-3 working days to merge, if the panel passes in round 1 or 2.** Uncertainty: Q-FII-2 (b) adds about a day (opt-ins, byte proofs, header churn).
- Then W12 runs incline_bb's layers round, and W13 writes and judges smith_machine_incline_press (plan-w9.md:173).

## Unverified
- Which drawn item c1 calls "a dashed ring over the shoulder dot". The 2.25 px `RING` sits on the flared elbow, not the shoulder. The PLAN names it from the pf10 crop.
- Whether a spot exists that both views' placement rules accept (Q-FII-2 (a)). Only the two searched centres were measured.
- Where the knees fall in the inset for any region other than 388db2e4's.
- That the lb02 layers page and the pilot-b page do not move. Neither was rebuilt here.
- The PNG-to-plate scale of the pf10 coordinates (about 2× [est]; the y axis also carries an offset).
- How many generated headers read `zoom/inline.mjs`. MANIFEST shows 134 key entries; the generated-header count was not measured.

## Supervisor rulings (2026-11-16; these win over the text above)
- **D-FII-INSET** (Q-FII-1): the head-end inset with its own source ring, in smith's D-PF3B-INSETRING form.
- **D-FII-PLACE** (Q-FII-2): (a) spec only first. Route (b), the two default-off engine opt-ins, is a Stop: post the evidence that (a) cannot work, plus the byte proof plan and the MANIFEST and header count, and wait for a second ruling. The engine opt-ins move generated headers that collide with W9 (#433) and W10 (#434).
- **D-FII-PINS** (Q-FII-3): yes, exactly the replacement listed, each item at least as strict, with the three mutations kept. Name every edited line of `lb2-plates.test.ts` in the PR, with before and after.
- **D-FII-R7** (Q-FII-4): move the '30°' value; never drop it. PF3 item 15's pin stays byte-equal.
- **D-FII-R11** (Q-FII-5): yes, one descriptive sentence in the plates critic prompt for this row only. It says what the circle shows and never that it is right. The supervisor writes it into the panel brief; the builder does not edit PANELS.md.
