Card LIB-SPLIT: LB4 resume 3, step_up and the 5 SPLIT rows on the pinned reverse_lunge, all drawn H (2026-11-01; status `ready`: the rulings D-SPLIT-1 to -8 below wait for the supervisor. It starts on 'LIB-SPLIT start' once #358 (LIB-SMALL) has merged.)

Sources (every file:line was read at these heads; [est] marks an estimate, [unverified] what no run here checked):
- main `5bcbddcf` (train 55: LB7 R3 #356, LB9 R3 #361, PILOT-A3 #362). Scratch worktree of `5bcbddcf`, npm ci. Base pages (two equal builds each): LB4 `9a2b7881a4d8af9375c1c006cd2bcf918736763a30de8258538578fc10956a9e` (565102 B, lb4/build.mjs; 5 rows); PILOT-A3 `bebd7730…a7878` (465732 B, library-ci.test.ts:621). Pilot A L1 `5d0e562f…5ba8`/1325644 (lib8-pin.test.ts:46), PILOT-A2 `3e225bc1…bb0b`/280533 and pilot B `ff3e017c…583f`/409765 (library-ci.test.ts:620, :622).
- claude/sup-lib4-cards `00294f38`: lib4-cards.md §15 (:3161-3164 D-LIB10-TEMPLATES) and §47-§48 (:4474-4602), lib-16r2-card.md (house format), lib-15r2-card.md, pilot-a3-card.md, lib-small-card.md, lib-13s-card.md, lib-14-card.md. claude/sup-handover-1445 `9c37c171`: verify/PANELS.md §1 (:5-37), §3 (:50-68), §7 (:134-203). Held-row inventory (supervisor scratchpad, 10-31) §5 row B, §6, §7.
- Research head `a48b059400a74d5c9e3aceed21cf1aa67ab6f118` (claude/libht-research). The 5 SPLIT cards equal their LB4 research head `3812989f` blobs: bulgarian_split_squat `dc974c37`, walking_lunge `2f7d1553`, forward_lunge `f77e0f55`, bodyweight_lunge `f819e3e6`, bodyweight_split_squat `e312a507`; none is on main and none has a key. step_up's card on main equals `a48b0594` (`e5587df6`): plateFacts and topFault 'lean', no tempo key.
- Scratch measures (scripts in `<scratchpad>/split/scripts/`, never committed): `rl0.mjs` (the pinned reverse_lunge: Trace 69.67 px, tell 4.10 px, as pilot-a3-card.md:51, :69), `proto.mjs` (4 prototypes on reverse_lunge's geometry), `bss-geo.mjs`, `bss-proto.mjs`, `bss-rest.mjs` (the Bulgarian split squat on the engine), `db3d.mjs` (the rl-db.mjs 3D dumbbell model of D-A3-CLEAR), `stepup-qa.mjs` (step_up's full QA). Prototypes use `renderPlate`, `faultOf`, `zoomOf` and `bodyShapes` on main; none ran full QA except step_up.

id: LIB-SPLIT
model: claude-opus-5-5 (5 new H plates, a laces-down rear foot on a bench, a zoom, clearance fixes and a held row's resume: judgement work)
mode: auto
title: 'Builder: LIB-SPLIT, LB4 step_up and the SPLIT rows drawn H'
branch: claude/lib-split (new, from the latest main after #358 merges; no such branch on origin at 11-01). First push opens draft PR 'LIB-SPLIT: LB4 step_up and the lunge and split-squat rows (build-ahead, nothing ships)'.
slot: plan 7 order 14 (LIB-14 = LB4, lib-small-card.md:14). The supervisor names the checklist slot in the start message.
lane: **one** LIB slot under D-LIB-LANE-ACTIVE (lib4-cards :1023). Open LIB PRs at 11-01: #354, #358, #359, #362 [live count at start unverified]. **#358 writes lb4/DESIGN.md, lb4/rows.json, lb4/cards.sha.json, tests/howto/lb4-plates.test.ts and tests/howto/fixtures/held-pairing.json** (`git diff --name-only origin/main...88930520`), the same five files this card writes, so it starts after #358 merges (ruling 1).

## Why now
- reverse_lunge is pinned: batches/pilot-a3.json:10-26 (stage approved-plate, mode H) and its plate entry tests/howto/golden/library/pilot-a3.json:20-50 (exemptions F3 F4 F5), PILOT-A3 PIN GO @ `2edabdf0` (lib4-cards :4577).
- That was the only block on these 6 rows: step_up is drawn and held only "until reverse_lunge is redrawn, owner-approved and pinned" (lb4/DESIGN.md:96-99, :349; D-LIB14-STEPUP), and the 5 SPLIT rows waited for "the byte proof needs reverse_lunge pinned" (lb4/DESIGN.md:62; D-LIB10-TEMPLATES, lib4-cards :3161-3164; inventory §5 row B).
- Every strip row is verified on main: step_up (strip/rows.json:74-93), bulgarian_split_squat (:173), walking_lunge (:198), forward_lunge (:223), bodyweight_lunge (:253), bodyweight_split_squat (:281). No strip edit is needed.

## Modes: all 6 are H; SPLIT is not built (measured against PARAMS)
A T row may set only derive.mjs's 7 PARAMS keys (derive.mjs:4-12); any other key is `H10.unknown` (qa/node.mjs:307), and facts may never hold poses, equipment, camera, trace or checks (D-LIB10-FACTS, lib4-cards :3179-3184; lb3/DESIGN.md:19-23). A pose or stance outside PARAMS makes a row H (D-LIB15R2-MODES, lib-15r2-card.md:138-141). Two keys were checked for the two named cases:
- `stance.width` is lateral, "metres, mid-sole to mid-sole" (derive.mjs:11; the CURL family's basis is feet at ±0.11 m, qa/param-ranges.json:23). No key sets split length, step direction or travel, so **walking_lunge's walk is no PARAMS key**.
- `bench.angle` is "degrees from horizontal" of a bench under the body (derive.mjs:8); derive only writes that path (derive.mjs:32-45), and reverse_lunge has no bench (reverse_lunge.mjs:111-117). No key places a bench or a foot on it, so **the Bulgarian split squat's raised rear foot is no PARAMS key**.

| id | tier | card parent / hand | what differs from reverse_lunge (outside PARAMS) | mode | clone source (copy, never import; D-LIB9-CLONE) |
|---|---|---|---|---|---|
| step_up | B | null / hold | drawn on main (specs/step_up.mjs), own family STEPUP | **H** (D-LIB14-MODES, unchanged) | itself |
| bulgarian_split_squat | B | reverse_lunge / hold | rear foot laces-down on a bench about knee height (c2), a split start with no step, the Mistake's knee-on-floor fault (c3, c8) | **H** | reverse_lunge (pinned); bench_dip.mjs:129's vendor `bench` with `axis: 'x'` |
| walking_lunge | B | reverse_lunge / hold | steps forward, not back (c1, c2): the start sits on the rear foot's spot, 1.013 m behind the parent's (the parent's ball.l z −0.950 m measured, minus BALL−MID 0.063 m); rear kneecap on the floor (c2); the trunk-pitch Mistake (c7) | **H** | reverse_lunge |
| forward_lunge | B | reverse_lunge / hold | the same forward step (c1 "step forward with the right leg"); the shin-travel Mistake (c3) | **H** | reverse_lunge |
| bodyweight_lunge | C | null / none | forward step from feet together (c1), shin slightly forward (c4), trunk bent forward with a flat back (c5); no load | **H** | reverse_lunge |
| bodyweight_split_squat | C | null / none | both feet fixed in the split (no step), start with the front knee about straight (c3: measured 0.2° at hip y 0.845 m), rear kneecap on the floor (c1); no load | **H** | reverse_lunge |

- **SPLIT is not worth building.** 0 of the 5 children qualify, so with the parent 1 of 6 members passes, under the rule's 3 (lb3/DESIGN.md:23; D-LIB13S-MODES judged SHRUG not built at 2 of 3, lib-13s-card.md:148). `load.primitive: 'bodyweight'` (derive.mjs:9) would cover the two bodyweight rows' load only; their poses differ, and their cards name no parent because their hand archetype is none (cards' decisionNote; content.md 2.3).
- So: no templates/ file, no family row in qa/param-ranges.json (CURL and PUSHDOWN only, :3-42), no ranges PR, no H10 child proof. D-LIB15R2-TPARENT does not apply (lib4-cards :4514): the drawn-item tests bind every drawn item in full, and a defect copied from reverse_lunge is this row's to fix. The "no templates folder" asserts (lb2-plates.test.ts:704, lb3-plates.test.ts:114, lib11-pilot-b.test.ts:274; D-LIB15R2-TEMPLDIR, :4515) and D-TEMPLDIR-LIST (:4520; no ruled-templates.json in tests/howto/fixtures/ on main) are untouched.
- LB4's plan marks become D0 P1 T0 H13 (from D0 P1 T5 H8, lb4/DESIGN.md:36; P1 stays reverse_lunge's pilot mark, the LB3 "P3 T0" form, lb3/DESIGN.md:24). Supervisor docs action.

## Measured (scratch on `5bcbddcf`; bars traceLenMin 22.11 and deviationMin 11.39 px, qa/envelope.json:12-13; zoom k 1.5-4, zoom/inline.mjs:15; a Mistake zoom is red when the plate deviation already reaches 11.39, qa/zoom.mjs:122, H3.zoom:not-needed:mistake, as D-LIB13S-SMITHZOOM's withdrawal ruled, lib4-cards :4590)

### PQ-H3 per row (side view; the camera fits at the reference 146.29 px/m on every prototype, step_up at its own 128)
| id | basis | Trace px | Mistake tell and size | deviation px | zoom | verdict |
|---|---|---|---|---|---|---|
| step_up | main spec + tempo, **full QA** node and browser, zero exemptions (page `ba9214ca…8625`, 147396 B, step_up alone) | 59.41 | `lean`, thorax M_INCL 40 (step_up.mjs:37) | 30.24 | none | released after the 3 fixes below |
| forward_lunge | prototype: the parent's end; start on the rear foot's spot | 113.25 [est: prototype via 1 misses the rear foot by 11 cm] | knee.r; front shin 6° → 18°, hips held at the end height, 8.8 cm forward | 13.16 (12°: 6.59) | none at ≥ 17° [est]. At 12° the ladder finds **no place** at any k | released if the PLAN's card-true size is ≥ 17°; else S4 |
| walking_lunge | prototype: rear kneecap on the floor, front thigh 5° below parallel | 117.52 [est, as above] | sternum; pelvis pitched +10° (arms plumb), legs unmoved | 12.45 (+6°: 7.47; +15°: 18.64; backUpper +10°: 10.33) | none at ≥ +10° | released [est] |
| bodyweight_lunge | prototype: shin 12° (c4), trunk 20° (c5), no load | 110.77 [est] | knee.r; shin 12° → 24° | 13.16 (18°: 6.59, no place at any k) | none at ≥ 23° [est] | released if ≥ 23°; else S4 |
| bodyweight_split_squat | prototype: feet fixed; start front knee 0.2°; rear kneecap on the floor | 32.95 | knee.r; shin 6° → 18° | 13.16 (12°: 6.59; k 2 13.18 at (98, 204)) | none at ≥ 17° | released [est] |
| bulgarian_split_squat | prototype: bench 0.42 m, front toe 3 foot-lengths (heel 0.53 m) ahead, foot 2 cm over the edge; end kneecap on the floor | 62.36 | `seat`; hips 2 cm lower, knee kept on the floor (ruling 5) | 5.58 (3 cm: 10.81) | k 2.5: 13.96, place (286, 220); 3 cm: k 1.5 16.21 [est until full QA] | released only on rulings 4 and 5; else held (S3) |

- Mistake sizes are unsourced on every card. The PLAN picks each size from the card's words ("tips far forward", "pitches forward over the front thigh", "well past vertical") before measuring, lists it under "Unsourced numbers", and never enlarges it to pass (Q-D5-3). A size under its bar takes the smallest passing zoom; with no zoom place the row is held (S4).

### Bulgarian split squat: can c2 and c3 hold together on this body? (`bss-geo.mjs`, `bss-proto.mjs`)
The engine foot laces-down rests on its instep and toe dorsum (FOOT_SIDE, body.mjs:57-58), so the ankle sits 4.1 cm above the bench top; the shank is 0.246 H = 0.4305 m, the standing knee joint 0.285 H = 0.499 m and the kneecap radius 0.028 H = 4.9 cm (body.mjs:17-18, :28-29). Lowest rear kneecap gap with the front shin at 6° (the parent's; engine IK, errors ≤ 0.3 cm):

| bench top | front heel 0.80 m ahead (3 foot-lengths) | front heel 0.66 m | front toe 3 foot-lengths (heel 0.53 m) |
|---|---|---|---|
| 0.50 m (knee joint 0.499 m, kneecap top 0.548 m) | 10.2 cm | 8.5 cm | n/m |
| 0.45 m | 5.3 cm | 3.5 cm | n/m |
| 0.44 m | 4.3 cm | 2.5 cm | n/m |
| 0.42 m | n/m | 0.5 cm | **0.3 cm** (0.4 cm with the foot 2 cm over the edge) |
| 0.39 m | −0.4 cm | n/m | n/m |

- With any front shin, the bound is gap ≥ bench − 0.4385 m (a vertical rear shank), and a back-leaning front shin is needed to approach it. So **a knee-height bench (c2, ACE "about knee-height") and the rear knee lightly touching the floor (c3, Catalyst) cannot hold together on this body**; 0.42 m is the highest bench on a 1 cm grid that lets them (0.43 m leaves 1.3 cm) [computed].
- **Mistake:** c3's "lightly contacts the floor" is a contact quote, so the end needs the kneecap on the floor within 1 cm (D-LIB8M-FACTS; H6 tolerance LIMITS.cm 1, qa/node.mjs:20, :163-165). The knee cannot go lower, so "dropping into the bottom" (c8) shows as the hips sinking with the knee on the floor. The hips can sink only 4.5 cm (hip y 0.423-0.468 m) before the front shin tips forward, which is another fault (`bss-rest.mjs`).
- Alternative end "just above" (ACE c3 "Before the left knee hits the floor"; card plate.end allows it): end gap 2.1 cm, Mistake knee on the floor, knee.l 11.31 px → k 1.5 16.96 at (82, 216). It fails H6 if the CARD FIELDS verify rules c3 a contact (2.1 > 1 cm).

### Clearance (the D-LIB16R2-CLEAR scope ruled on #354 6543628951 point 1: parts in the body's plane tested at 2 px; parts beside the body listed with their 3D gap, which must not go negative, the PILOT-A3 A9 form, pilot-a3-card.md:193)
| id | part, pose | measured | fix |
|---|---|---|---|
| step_up | box top to the trailing foot, spec start (standing tall, card end; not a contact) | **0.40 px** (the `above` check has no margin, step_up.mjs:112-113) | lift the start trailing foot ≥ 1.25 cm more: 2 px = 1.56 cm at 128 px/m [computed]; its hip 15 / knee 35 are unsourced (step_up.mjs:31, :80) |
| step_up | box to the shank, end and Mistake | 5.15 px | none. The lead foot (−0.07 px) is the c6 contact |
| step_up | near dumbbell, 3D | ≥ 0.4 cm in every pose | none |
| bulgarian_split_squat | bench pad and post to the rear shank (rear foot excepted: c2 contact) | instep on the edge: start 3.23, end 1.53-1.95, Mistake **0.57 px**; foot 2 cm further over the edge (c2 "so that the shin can move freely"): 5.25 / 4.37-4.71 / 3.50 px | the overhang, in the PLAN |
| bulgarian_split_squat | far dumbbell to the rear thigh, 3D | start 0.1 cm, end **−2.1 cm**, Mistake **−4.6 cm** | a far-arm or grip change in the PLAN [est], listed |
| forward_lunge, walking_lunge | far dumbbell, 3D | end 0.1 cm (= the parent's, pilot-a3-card.md:84), Mistake 0.3 / 1.8 cm | none |
| bodyweight rows | no load | n/a | floor supports are `checks` |

### step_up's full QA (with tempo = tempoOf(strip/rows.json:74-93) = Rise blank, Lower 'Controlled' on spec and card, scratch only)
- One hard check is red: **H4.overlap:normal:foot|leg** (the callout boxes overlap by 91.71 px² at 340 px). Everything else passes, H6 included. Flags: **F4 0** (range 2-6, qa/envelope.json:23-26) and F5 3.57. step_up was never QA'd because held specs stay off every QA'd page (lb4/DESIGN.md:354-355), so these are new.

## Files it may touch (write_scope)
- New: tools/plates/library/specs/{bulgarian_split_squat, walking_lunge, forward_lunge, bodyweight_lunge, bodyweight_split_squat}.mjs; tools/plates/library/howto/lib_<the 5 ids>.howto.mjs (`id` and `research` only, D-LIB9a-HOWTOID).
- specs/step_up.mjs, only: `tempo`; the callout `box` fix for H4.overlap; the start trailing foot's lift (:80) and the header lines that name it (:22-24, :30-32). No other pose, fault-size, fact or equipment change.
- tools/plates/library/lb4/{rows.json, tempo.json, cards.sha.json, DESIGN.md (a 'LIB-SPLIT' section; :62, :349 and the held table), qa.mjs (EXPECTED, :48-50), build.mjs (HELD, :70)}; tests/howto/lb4-plates.test.ts (its own blocks: LB4 :14, NOT_HERE :17, HELD :20, A5 :64-116, A9 :117-132, A11 :186, A8 :526-548, Do 6 b :877-1032, and new blocks).
- tests/howto/fixtures/held-pairing.json: only the step_up entry removed (:5), as its rule says (:2).
- docs/research/howto/cards/ and quotes/: the 5 SPLIT cards and quotes as byte copies from `a48b0594`, then the 3 keys; step_up's card gains `tempo` only. The supervisor merges the field commit back to research.
- docs/COACHING-DECISIONS.md: append one entry (keep both sides on a merge).
- **Never:**
  - qa/**, zoom/**, vendor/**, layers/**, strip/**, templates/**, derive.mjs, candidate.mjs, registry.mjs, build-page.mjs, plates-page.mjs, golden.mjs, MANIFEST.json;
  - every eq/ file; specs/reverse_lunge.mjs (pinned in MANIFEST.json:626, :1144) and every other spec, the 6 approved LB4 specs included;
  - batches/**, tests/howto/golden/**, pages/**, pilot-a*/**, pilot-b/**, src/**, gen/**, eq-composers.json, lib8*.test.ts, lib-strip.test.ts;
  - .github/**, scripts/screenshot-gate.mjs, tests/theme.test.ts, src/ui/styles.css, package*.json.
- **Collision check** (11-01, `git diff --name-only origin/main...<head>`): #358 `88930520` writes the 5 shared files above (hence ruling 1); #354 `af2c6b0a` and #359 `7a98c6b9` write lb6/**, lb3/** and COACHING-DECISIONS; #362 `0ab56be3` writes pilot-a3/DESIGN.md only. After #358, **the only shared write is the COACHING-DECISIONS append.**

## Do (waves, so the 5 rows with no new rig reach a panel first)
1. **PLAN** in lb4/DESIGN.md ('LIB-SPLIT' section), posted as 'SPLIT PLAN READY @ <sha>'; wait for 'SPLIT PLAN RULED'. Base: the latest main with #358. It gives:
   - the mode table above re-checked on the base; reverse_lunge's copied code and every copied bracket's solved value (D-LIB9-CLONE);
   - per row: the pose map (identity for the 5; step_up keeps D-LIB14-STEPUP-POSE, lb4/DESIGN.md:172), the forward-step start and via poses (ruling 7), the fault→key map, the tempo (tempoOf of the strip rows above, D-STRIP-ROWS), the facts plan, the unsourced numbers;
   - the clearance table above re-measured, with the step_up and Bulgarian fixes;
   - a PQ-H3 measure per row at the PLAN's sizes, and the Bulgarian zoom's region and k;
   - the expected flags (F5 on all, D-LIB9-F5; all 5 SPLIT cards are drawable true, so no F7; step_up's F4 fixed or named).
2. **Cards at start:** copy the 5 cards and quotes from `a48b0594`; update lb4/cards.sha.json.
3. **Wave 1** (after RULED): step_up's resume (ruling 3), then forward_lunge, walking_lunge, bodyweight_lunge, bodyweight_split_squat. QA (Do 6), then 'SPLIT PLATES READY 1 @ <sha> (page <sha256>)'. The supervisor runs PANELS §1: hidden anchors golden B's pull_up and lat_pulldown (D-LIB14-ANCHORS, lib4-cards :4421), 2 plants; no tier-A row, so no R10.
4. **Card fields** for the 5 SPLIT cards: the 3 keys, then 'SPLIT CARD FIELDS READY @ <sha>'. PANELS §3 once, one plant. Items for the verify, read against the rules (PANELS.md:175; plural #289 6342086947; near side #306 6356303497 item 6 and D-LIB22-SIDES, lib4-cards :4539; grip #290 6349063103; "approximately N degrees" D-CFSMALL-ELEV, :4538):
   - knee contacts on the drawn end: walking_lunge c2 "very lightly touches the floor", bodyweight_split_squat c1 "lightly contacts the floor", bulgarian_split_squat c3 "lightly contacts the floor". Each is `knee.l` with a checks plane at the kneecap radius, the ab_wheel_rollout.mjs:172 form; forward_lunge c1 says "without touching", so none;
   - hand-on-dumbbell setup quotes at the start, at the wrist: forward_lunge c5 "one dumbbell in each hand" (each side), walking_lunge c12 and bulgarian_split_squat c9 "at the sides" (plural, by the rule);
   - bulgarian_split_squat c2 "the top of your rear foot on the support" is a setup quote (start only, D-LIB9-FACTPOSE). No landmark lies on the foot's top, so a note and no fact, unless the verifier names one;
   - walking_lunge c11's "~90º" is scoped to eccentric lunge walking, not the drawn lunge.
   Fix only what it names; a focused re-verify follows.
5. **Wave 2: bulgarian_split_squat** on rulings 4 and 5: the bench, the laces-down plant, the far dumbbell fix, the Mistake zoom. QA, then 'SPLIT PLATES READY 2 @ <sha> (page <sha256>)' and a PANELS §1 run with R11.
6. **QA** for every row in rows.json: two builds of the LB4 page with equal sha256, then runQa node and browser per id on candidateOf(id, { all, authoring: true }), zero exemptions. Whole-page builds inside vitest run in awaited child processes if the worker RPC times out (D-LIB13S-RPC, lib4-cards :4598). Post the table. One fix round per wave, then a focused recheck; a second failure holds the id (D-LIB8M-CARDTRUE, or D-LIB13-PANEL2).
7. **Merge** origin/main with a merge commit, re-run A2 and A10, post 'SPLIT READY @ <sha>'. A fresh Opus review follows. If wave 2 is not approved when wave 1 is, ruling 8 applies.

Stops (post on the PR and wait; never work around one):
- S1 Any page other than LB4's moves a byte (pilot A, PILOT-A2, PILOT-A3, pilot B, every other LB page), an approved LB4 plate's fragment moves, reverse_lunge.mjs or an eq/ file would need an edit, or C0 is not [].
- S2 A bar is met only with k > 4, r < 52, a trim change, a second label move on one plate, or a larger fault or a body change. The row is held; nothing is loosened.
- S3 A card's facts cannot hold on the body together (the D-LIB10-BENCH-H form): the Bulgarian bench against c3 (measured above), the laces-down plant over 0.5 cm, or the dumbbell 3D gap still negative after the PLAN's fix.
- S4 A Mistake under its bar finds no zoom place at any ladder k (the D-LIB17-RDFHOLD form). The row is held with its route.
- S5 Two failed tries of one approach with no new evidence.

## Acceptance (each mutation turns red, then is restored; the PR lists each red line)
- **A1 Scope.** lb4/rows.json holds the approved LB4 ids and the released new ones, each once, every row mode 'H' with no `parent`, `template` or `params` (A5's all-H assert, lb4-plates.test.ts:70, stays byte for byte). NOT_HERE shrinks to reverse_lunge and box_jump. HELD empties, or names only a ruled hold with its route in DESIGN.md. Mutations: reverse_lunge added; one row set to 'T'; a row duplicated; step_up left in HELD with its row added.
- **A2 Nothing else moves.** #358's approved-fragment block (the 5 at `9a2b7881…6a9e` plus jump_squat) stays byte for byte. Pilot A L1, PILOT-A2, PILOT-A3 `bebd7730…`/465732, pilot B and every other registry page sha are equal before and after (listed in the PR). reverse_lunge.mjs and box_jump.mjs are byte-identical to main. C0 is []. `git diff --exit-code origin/main...HEAD` is empty on the Never paths. Mutations (temporary worktree): one byte in reverse_lunge.mjs's alt turns C0 and the PILOT-A3 page red; one byte in goblet_squat.mjs's alt turns its fragment check red.
- **A3 Card-true poses** (drawn-item tests on every row, in full).
  - forward_lunge, walking_lunge, bodyweight_lunge: start on the rear foot's spot; the near (right) foot steps forward; the rear foot pivots on its ball (ball.l moves ≤ 0.5 cm from start to end).
  - walking_lunge, bodyweight_split_squat and bulgarian_split_squat: the end kneecap on the floor ±0.5 cm. forward_lunge: the end kneecap above the floor (c1 "without touching").
  - bodyweight_split_squat: both feet fixed in every pose, start front knee ≤ 10° (c3).
  - bodyweight_lunge: end front shin forward of vertical (c4), trunk forward with a flat back (c5).
  - bulgarian_split_squat: the rear foot's instep and toe dorsum on the bench top ±0.5 cm in every pose, the front foot flat, the bench at the ruled height.
  - The Mistakes at the PLAN's sizes, with every unmoved landmark ≤ 1e-9 m.
  Mutations: forward_lunge stepping back (the parent's start); walking_lunge's end kneecap 3.6 cm up; the Bulgarian rear foot sole-down.
- **A4 H3 and zooms.** Each row's plate Trace ≥ 22.11 and deviation ≥ 11.39, or its zoom is the PLAN's region and k with no H2.zoom, H3.zoom or H4.zoom key red, the ring inside the frame (D-LIB22-RINGFIT, lib4-cards :4448), and no smaller ladder k passing. Pinned (±0.01) at the PLAN's sizes. Mutations: forward_lunge's shin at 12° (6.59 px, H3.deviation); walking_lunge at +6° (7.47 px); the Bulgarian zoom removed (H3.deviation 5.58 px) and one rung lower; a zoom added to walking_lunge (H3.zoom:not-needed:mistake).
- **A5 Clearance** (ruling 6). The bench and the box clear every drawn body outline by 2 px or more in every drawn pose, card contacts excepted; every dumbbell's 3D gap is ≥ 0 and listed. Mutations: step_up's start trailing foot as on main (0.40 px); the Bulgarian foot back at the instep (0.57 px); the Bulgarian far arm as the parent's (−4.6 cm).
- **A6 QA.** Every hard check passes per id, node and browser. The raised flags equal the ruled set exactly (lb4/qa.mjs:48-50). Mutations: LIB-3's M1-M7 (qa/mutations.mjs) on one new plate; step_up's foot and leg boxes as on main (H4.overlap:normal:foot|leg, 91.71 px²).
- **A7 Cards.** Each SPLIT card differs from its `a48b0594` blob only in the 3 keys; step_up's from main only by `tempo`; each tempo equals tempoOf(its strip rows); validateCardFile gives [] on all 6, including step_up (lb4-plates.test.ts:928's pairing expectation and :940's held-tempo mutation are retired with step_up's hold); held-pairing.json no longer lists step_up; CARD FIELDS VERIFIED for the 5, plant caught. Mutations: another key edited; step_up put back in held-pairing.json; one tempo word changed (H6.tempo).
- **A8 Nothing ships.** The A9 asserts (lb4-plates.test.ts:117-132) cover the 6 ids. Mutation: one row set to shipped.
- **A9 Panel and green.** Each wave is VALID under PANELS §1, both plants caught, R11 scored for the Bulgarian zoom. Approvals are per id at that head. `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` pass on the merged head, and CI is green.
- **A10 LB4 page.** Two builds give the same sha256 (PQ-H7; lb4-plates.test.ts A10 :764 form). Mutation: a non-deterministic id in one spec.

## Proposed rulings (for the supervisor before 'LIB-SPLIT start')
1. **D-SPLIT-LANE:** one LIB slot; branch claude/lib-split; starts after #358 merges, because both write lb4/** and held-pairing.json. If wall_ball keeps #358 open while jumping_jacks and jump_squat are approved (mx17, lib4-cards :4570), D-SMALL-SPLIT lets #358 merge its approved rows first (lib-small-card.md:117).
2. **D-SPLIT-MODES:** all 6 rows are H, for the reasons in the mode table. SPLIT is not built: 0 of 5 children qualify, 1 of 6 members with the parent, under 3. LB4's marks become D0 P1 T0 H13 (supervisor docs action).
3. **D-SPLIT-STEPUP:** step_up resumes here with three ruled fixes: one callout box for H4.overlap:normal:foot|leg; the start trailing foot lifted to clear the box by ≥ 2 px (now 0.40 px); F4 0 fixed by that box or named. Its tempo is tempoOf(strip/rows.json:74-93) on the spec and the card, and its held-pairing entry goes.
   - No CARD FIELDS verify for step_up (the D-A3-NOCF form, pilot-a3-card.md:242). Its plateFacts and topFault were verified on #289 (LIB-14 CARD FIELDS VERIFIED @ `12651ff4`), and its tempo is the verified strip row. A supervisor diff-check covers it.
4. **D-SPLIT-BSSBENCH** (the S3 question): the bench top is drawn at 0.42 m, the highest that lets c3's floor contact hold on this body, with the front toe 3 foot-lengths (0.80 m) ahead of the bench. c2's quote names "the front foot", with no point on it, and "about knee-height". Both are listed under "Unsourced numbers": 0.42 m is 84 % of the knee joint height, and the rear foot sits 2 cm over the bench edge. This is the D-LIB13S-TBARFEET form (an engine-limit size listed against an "about" claim, lib-13s-card.md:154), and the panel judges R1 and R2.
   - Alternative: hold bulgarian_split_squat under S3 and route a research follow-up **F-SPLIT-BSSBENCH** (a sourced bench height, or a re-read of c3 against c2). A 0.50 m bench leaves the kneecap 8.5-10.2 cm off the floor (measured).
5. **D-SPLIT-BSSMIS:** the end puts the kneecap on the floor (c3 Catalyst, a `knee.l` contact). The Mistake ("dropping into the bottom and resting the rear knee", c3, c8) draws the hips lower, with the knee kept on the floor. The size is unsourced and capped by the measured 4.5 cm before the shin tips forward. The tell is on `seat`, with a Mistake zoom at the smallest passing k (2 cm: k 2.5, 13.96 px; 3 cm: k 1.5, 16.21 px).
   - Alternative: an end "just above" (ACE c3) with the knee dropping onto the floor (11.31 px at a 2.1 cm gap; k 1.5, 16.96 px). It is valid only if the CARD FIELDS verify rules c3 no contact.
6. **D-SPLIT-CLEAR:** D-LIB16R2-CLEAR in its ruled scope (#354 6543628951 point 1; D-A3-CLEAR, pilot-a3-card.md:238-241).
   - Tested at 2 px: the bench and step_up's box.
   - Listed with 3D gaps, each ≥ 0: the hanging dumbbells.
   - Card contacts excepted: the rear foot on the bench (c2), step_up's lead foot on the box (c6), the hands on the dumbbells.
   - This adds checks only.
7. **D-SPLIT-FWD:** forward_lunge, walking_lunge and bodyweight_lunge start on the rear foot's spot and step the near (right) leg forward (forward_lunge c1; walking_lunge c3 "aiming your left knee towards the heel of your right foot"). The parent's camera and floor hold at 146.29 px/m (measured).
   - walking_lunge draws one step (card plate.viewWhy: "the plate shows one step (census note)").
   - c1's "back foot steps forward to meet the front foot" goes in the alt and the sheet, not the drawing.
8. **D-SPLIT-WAVES:** wave 1 (step_up and the 4 rows with no new rig) goes to its panel first. If bulgarian_split_squat is not approved when wave 1 is, the PR goes to review with its approved rows (the D-LIB17-SPLIT form, lib4-cards :4470). The row then continues as 'LIB-SPLIT resume' on a new branch from main.

## Risks and mitigations
- **The Bulgarian 0.42 m bench reads as too low** for "about knee height" (R2), or ruling 4 is not taken. Mitigation: wave 2 alone; a hold with F-SPLIT-BSSBENCH never blocks the other 5.
- **The Bulgarian Mistake reads weakly**: the knee stays put and only the hips sink 2-3 cm. That is R5 risk, as dumbbell_fly's in mx7. Mitigation: the zoom on the seat and a tell naming the knee resting; never a larger drop than the measured 4.5 cm cap; a second round under D-LIB13-PANEL2, then a hold.
- **A small Mistake size finds no zoom place** (forward_lunge and bodyweight_lunge at 12-18° had none). Mitigation: the PLAN measures the ladder at its card-true size; S4.
- **The laces-down rear foot is a first for the engine** (an inverted plant; normal and toe as in `bss-proto.mjs`) [unverified on a drawn plate]. Mitigation: wave 2, with a plant-error check (≤ 0.5 cm) and drawn-item tests on the instep and toe dorsum.
- **The three forward-step plates look alike**, and alike with reverse_lunge at the bottom. Mitigation: card truth (each card's own end, Mistake and tempo); the panel sees each against its card.
- **#358 is late** (wall_ball). Mitigation: ruling 1's D-SMALL-SPLIT route.
- **The LB4 page grows to about 12 rows** [est 1.2 MB], and the vitest worker's RPC may time out. Mitigation: D-LIB13S-RPC child processes; no assertion changes.
- **Usage.** The 80 % pause applies after the 11-05 reset (PANELS §9). Mitigation: post WAITING with a HANDOFF block.

## Forecast [est]
- Builder, about 40 Opus-hours:
  - PLAN 3 h;
  - step_up resume 3 h;
  - 4 wave-1 H rows × 4.75 h = 19 h (plan 9: 4 h + 0.75 h QA, lib-16r2-card.md:128);
  - bulgarian_split_squat 4.75 h + 2 h (bench, laces-down plant, dumbbell fix, zoom);
  - cards 3 h; tests and tooling 4 h.
- LB lanes needed 2-4 fix rounds, so allow up to about 70 h.
- Supervisor: rulings 1-8; one PLAN ruling; step_up's diff-check; one CARD FIELDS verify (5 cards) plus a re-verify; two panels plus rechecks; the review; the LB4 marks docs action.
- Wave 1 can reach its panel about 1.5 days after start [est]. The calendar depends on #358's merge, the slot and the panel queue.
- Rows released if every step passes: 6 (5 if ruling 4 is not taken). Nothing visible ships, so no APK.

return: PR and head sha; links to PLAN, PLATES READY 1 and 2, CARD FIELDS and READY; the per-id table (mode, clone source, Mistake size, zoom region and k, clearances, flags, held or not); the LB4 page sha256 from two builds; A2's fragment table and diff output; the mutation list; check, test:tz and gate output.

Resume rule: when WAITING, resume only on the supervisor's exact words 'LIB-SPLIT resume' (sent to the session or posted on the PR).

## Supervisor rulings (11-01 ~00:40 UTC; status `ready`)
1. **D-SPLIT-LANE, amended.** One LIB slot, on branch claude/lib-split from origin/main `5bcbddcf` or newer. The PLAN and wave-1 prototypes may start now. Merge main containing #358 before the first push that touches lb4/rows.json, lb4/build.mjs or held-pairing.json. #358 (wall_ball) is in CARD FIELDS cfwb and panel mx21 now. If #358 is still open when wave 1 needs those files, post WAITING; never edit them on a base without #358.
2. **D-SPLIT-MODES: confirmed.** All 6 rows are H, and SPLIT is not built (0 of 5 children qualify). The LB4 marks change is a supervisor docs action.
3. **D-SPLIT-STEPUP: confirmed, with one change.** The three fixes stand. step_up's card **does** go into the CARD FIELDS set with the 5 new cards, because its tempo key is newly written. D-A3-NOCF does not apply: that ruling covers a card with no key change.
4. **D-SPLIT-BSSBENCH: confirmed.** The bench top is 0.42 m, the highest at which c3's floor contact holds on this body. c2's "about knee-height" is satisfied at 84 % of knee height. The value is listed under "Unsourced numbers" as an engine-limit size, the D-LIB13S-TBARFEET form, and the panel judges R1 and R2. If R2 fails twice, the row is held with F-SPLIT-BSSBENCH (research).
5. **D-SPLIT-BSSMIS: the primary option is confirmed.** c3's Catalyst quote states a light contact ("lightly contacts the floor without resting on it"), so the end puts the kneecap on the floor as a `knee.l` contact fact (D-LIB11-FACTS2). The "just above" alternative is out, because it would leave a stated contact undrawn. The Mistake is the hips sinking further with the knee resting, capped at the measured 4.5 cm. The tell sits on `seat`, with a Mistake zoom at the smallest passing k. That zoom is allowed only while the plate deviation stays below 11.39 px (H3.zoom:not-needed). Never enlarge. R5 follows D-LIB13-PANEL2, then a hold.
6. **D-SPLIT-CLEAR: confirmed** as written. It adds checks only.
7. **D-SPLIT-FWD: confirmed.** walking_lunge draws one step, and c1's "back foot steps forward" goes in the alt and on the sheet.
8. **D-SPLIT-WAVES: confirmed.** Wave 1 is step_up plus the 4 rows with no new rig. bulgarian_split_squat is wave 2 and may follow on a resume branch (the D-LIB17-SPLIT form).
- The forward-lunge prototypes are [est]. The PLAN measures each at its card-true size. A row with no zoom place below the bar goes to S4 and is never enlarged.
