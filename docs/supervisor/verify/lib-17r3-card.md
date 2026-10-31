Card LIB-17R3: LB7 resume 3, the 3 PUSHUP rows drawn H (2026-10-31; status `ready`: the supervisor confirmed rulings D-LIB17R3-1 to -7 below as written (lib4-cards §48). It starts on 'LIB-17 resume 3 start' when a LIB slot frees.)

Sources (every file:line was read at these heads; [est] marks an estimate, [unverified] what no run here checked):
- main `6d34542c` (train 51). Scratch worktree of `6d34542c`, npm ci: the LB7 page is `c457ee86cc3851ec5af49b74a2e224e91c8f36de9055c30f5991ee3c1ab92194` (987262 B, two equal builds, lb7/build.mjs); pilot A L1 `5d0e562f…5ba8`/1325644 (lib8-pin.test.ts:39); pilot B `ff3e017c…583f` (lib11-pilot-b.test.ts:279).
- claude/sup-lib4-cards `49f2a947` (lib4-cards.md, lib-17-card.md, lib-15r2-card.md, lib-strip-card.md); claude/sup-handover-1445 `02c8d00a` (HANDOVER.md, verify/PANELS.md); #349 head `2e60be01`; plan claude/howto-options `d8d4b2e6`; census `4a9fd86`.
- Research head `a48b059400a74d5c9e3aceed21cf1aa67ab6f118`. The 3 cards and quotes have the same blobs as at the LB7 research head `8d750bfe` (LR-29 VALID on all 13, lb7/DESIGN.md:4-6; checked 10-31). None is on main yet; none is in tests/howto/fixtures/held-pairing.json.
- Scratch measures (scripts in the supervisor's scratchpad, never committed): push_up's own `solve` (push_up.mjs:52) with its straight body about the toe tips, on `landmarksOf` and `bodyShapes` (engine.mjs:3).

id: LIB-17R3
model: claude-opus-5-5 (3 H plates, the incline geometry and the strip calls: judgement work)
mode: auto
title: 'Builder: LIB-17 resume 3, LB7 PUSHUP rows drawn H'
branch: claude/lib-17-resume-3 (new, from the latest main; claude/lib-17-lb7, -resume and -resume-2 are the old branches). First push opens draft PR 'LIB-17 resume 3: LB7 push-up rows (build-ahead, nothing ships)'.
slot: plan 7 order 18 (LIB-18 in the plan = LB7, plan :818). The supervisor names the checklist slot in the start message.
lane: **one** LIB slot under D-LIB-LANE-ACTIVE (lib4-cards :1023), the slot after LB6's card (lib-16r2-card.md) starts. Separate from LB6 because the write scopes are disjoint (collision check below): one 3-row lane reaches its panel in about a day [est] instead of waiting behind LB6's nine rows.

## Why now
- push_up, the PUSHUP parent and a plank-class anchor, is pinned (tests/howto/golden/library/pilot-b.json:109), as is plank (pilot-a.json:322; plan :154). lb7/DESIGN.md:64 held the three rows only for that pin.
- The no-seconds strip is on main (strip/tempo-strip.mjs, strip/rows.json), so pike_push_up's and diamond_push_up's null tempo has a route; it needs only the S3 ruling below (strip/rows.json:519-526 leaves both out under S3).

## Modes: all 3 are H (measured against PARAMS)
A T row may set only derive.mjs's 7 PARAMS keys (derive.mjs:4-12); any other key is `H10.unknown` (qa/node.mjs:307), and a family row may name only these keys (qa/param-ranges.mjs:30). A pose or stance outside them makes the row H (plan 3.1:272; D-LIB15R2-MODES, lib-15r2-card.md:138-141).

| id | tier | plan mark | mode and why (outside PARAMS) | clone source | equipment | F7 | tempo |
|---|---|---|---|---|---|---|---|
| incline_push_up | C | T (PUSHUP) | **H**: the hands on a flat bench's top edge (card equipment; census need `flatBench`) and the body at about 45° (c1). Neither the hand surface nor the body angle is a PARAMS key: `bench.angle` is a bench's own angle from horizontal (derive.mjs:8), and this bench is flat. Its Mistake (feet too close, the blades shrugged, c10) is a new builder | push_up (pilot B) | vendor bench, floor | no | 3/3/0 (c9) |
| diamond_push_up | C | T (PUSHUP) | **H**: the hands under the upper chest (c1) and the elbows tucked (c3), against push_up's shoulders over the hands (push_up.mjs:10) and elbows flared out and back (:26, ELBOW_POLE :48). `grip.width` sets the hands' spacing only, not their place along the body or the elbow's aim | push_up | floor | no | null (c5) |
| pike_push_up | A | T (PUSHUP) | **H**: its card names no parent (parent null, "own parent") and the inverted V (c2) is a pose no PARAMS key gives | push_up | floor | yes (drawable false) | null (c14) |

- So no template, no family row and no ranges PR. PUSHUP is not built, as BENCH was not (D-LIB10-BENCH-H). LB7's plan marks become P1 T0 H13 (supervisor docs action; plan :716).
- D-LIB15R2-TPARENT does not apply: no T child, so the drawn-item tests bind every drawn item of every row in full; a defect copied from push_up is this row's to fix.

## Measured (scratch, main `6d34542c`; bars 22.11 / 11.39 px, qa/envelope.json:12-13)
- push_up's plate scale is 144.54 px/m (renderPlate report).
- **incline_push_up, c1 with c3** (do they hold together?). Top, arms straight and plumb, toe tips on the floor at push_up's TOE_Z: the toe-to-shoulder line is 25.8° with the hands on the floor (push_up), **48.0° with the hands at 0.43 m**, 52.4° at 0.50 m, 59.8° at 0.60 m. So c1's "about 45 degrees" needs a bench top near 0.39 m [est, interpolated]; the height is unsourced and solved from c1. Bottom, the same straight body with the chest landmark 2.5 cm over the bench top (c3, "about an inch"), neck 0 (c5): the lowest head point is **12.3 cm** over a 0.43 m top (13.6 cm over 0.50 m). The head clears the bench; c1 and c3 hold together.
- **Shrug size** (incline_push_up's c10 tell): 5 cm of `scap.elev` moves the shoulder 5.0 cm (body.mjs:143), 7.2 px at 144.54, under 11.39. So the Mistake needs a tell on a larger move (the feet or hips, as the body steepens), or a zoom [est until drawn].
- diamond_push_up's Mistake is push_up's approved sag (SAG_HIP −20, push_up.mjs:49), so its deviation is push_up's form [est: the hands' place moves the arms, not the sag].

## Files it may touch (write_scope)
- New: tools/plates/library/specs/{incline_push_up, diamond_push_up, pike_push_up}.mjs; tools/plates/library/howto/lib_<the 3 ids>.howto.mjs (`id` and `research` only, D-LIB9a-HOWTOID).
- tools/plates/library/lb7/{rows.json, tempo.json, sizes.json, cards.sha.json, DESIGN.md (a 'Resume 3' section), qa.mjs (F7_IDS, :47)}; tests/howto/lb7-plates.test.ts (its own blocks: NOT_HERE :26, A5, A9, and a new approved-fragments block).
- tools/plates/library/strip/rows.json: only diamond_push_up and pike_push_up, from leftOut to fallbackA (D-LIB17R3-STRIPROWS). tests/howto/lib-strip.test.ts: only the two LABELS literals (:68) and ROWS_PIN (:293), as ruled.
- docs/research/howto/cards/ and quotes/ for the 3 ids: byte copies from `a48b0594`, then the 3 keys. The supervisor merges the field commit back to research.
- docs/COACHING-DECISIONS.md: append one entry (keep both sides on a merge).
- **Never:** qa/**, derive.mjs, candidate.mjs, registry.mjs, build-page.mjs, plates-page.mjs, golden.mjs, MANIFEST.json, zoom/**, vendor/**, layers/**, templates/**, strip/tempo-strip.mjs, every eq/ file, tests/howto/fixtures/** (eq-composers.json and held-pairing.json need no change: no composer, no held marker), batches/**, tests/howto/golden/**, pages/**, pilot-a/**, pilot-b/**, src/**, gen/**, push_up.mjs, the 8 approved LB7 specs and cable_rear_delt_fly.mjs, every other lane's files, f-zoom-2.test.ts, .github/**, scripts/screenshot-gate.mjs, tests/theme.test.ts, src/ui/styles.css, package*.json.
- **Collision check** (10-31, `git diff --name-only origin/main...<head>`): no open LIB PR (#349 `2e60be01`, #348 `d5ab6a2c`, #346 `8c4d3264`, #340 `b5a18525`, #337 `13049ba4`) writes lb7/**, strip/** or lib-strip.test.ts. LB6's card writes lb6/**, two new eq/ files and eq-composers.json, none of them here. Neither card writes templates/, param-ranges.json or a test both use. **The only shared write is the COACHING-DECISIONS append.** f-zoom-2.test.ts builds its registry from lb7/rows.json (lb7All, :22, :34-35) and reads renegade_row's strip entry only, so new LB7 rows leave it green unedited (A2 runs it).

## Do (one wave: three rows)
1. **RESUME PLAN** in lb7/DESIGN.md, posted as 'LB7 R3 PLAN READY @ <sha>'; wait for 'LB7 R3 PLAN RULED'. It gives:
   - the mode table above, re-checked on your base; push_up's copied code and every copied bracket's solved value (D-LIB9-CLONE; its `solve` throws when it does not converge, push_up.mjs:52-70);
   - per row: the pose map (push_up's: spec start = card bottom, push_up.mjs:15-19), the fault→key map, the tempo map (incline 3/3/0 in the drawn order; the two null cards as fallbackA rows: the drawn phases, each blank, with claim c5 or c14), the facts plan (D-LIB8M-FACTS, D-LIB13-FACTS2: the palms on the bench or floor, the toes on the floor), the unsourced numbers (the incline bench height and its edge, the diamond hand place, the pike hip height);
   - the clearance table (D-LIB17R3-CLEAR), with the card contacts as the only exceptions;
   - a PQ-H3 estimate per row and the Mistake tells' anchors (incline_push_up's shrug alone is under the bar);
   - the expected flags (F5 on all, D-LIB9-F5; F7 on pike_push_up).
2. **Cards at start:** copy the 3 cards and quotes from `a48b0594` and update cards.sha.json.
3. **Strip rows** (after RULED): move both ids to fallbackA, edit only the two LABELS literals and ROWS_PIN, run lib-strip.test.ts.
4. **Draw** incline_push_up, then diamond_push_up, then pike_push_up. QA (Do 6), then 'LB7 R3 PLATES READY @ <sha> (page <sha256>)'. The supervisor runs PANELS §1 (hidden anchors golden B's pull_up and lat_pulldown, D-LIB14-ANCHORS, lib4-cards :4421; 2 plants; R10 for pike_push_up, tier A).
5. **Card fields** for the 3: the 3 keys, then 'LB7 R3 CARD FIELDS READY @ <sha>'. PANELS §3 once, one plant; fix only what it names.
6. **QA** for every row in rows.json: two builds of the LB7 page with equal sha256, then runQa node and browser per id on candidateOf(id, { all, authoring: true }), zero exemptions. Post the table. One fix round, then a focused recheck; a second failure holds the id.
7. **Merge** origin/main with a merge commit, re-run A2 and A9, post 'LB7 R3 READY @ <sha>'. A fresh Opus review follows. A row not approved when the others are goes to 'LIB-17 resume 4' (the D-LIB17-SPLIT form, lib4-cards :4470).

Stops (post on the PR and wait; never work around one):
- S1 Any pilot A, pilot B or other LB page byte moves, an approved LB7 plate's fragment moves, f-zoom-2 turns red, or C0 is not [].
- S2 A bar is met only with k > 4, r < 52, a trim change, a second label move, or a fault or body change. The row is held; never loosened.
- S3 A card's facts cannot hold on the body together (D-LIB10-BENCH-H form), for example pike_push_up's head within an inch of the floor (c3) with the hips high (c3) and the elbows about 45° (c3) [unverified until drawn].
- S4 A strip check needs a FORMS word, or any lib-strip.test.ts line other than the ruled ones.
- S5 Two failed tries of one approach with no new evidence.

## Acceptance (each mutation turns red, then is restored; the PR lists each red line)
- **A1 Scope.** rows.json holds the 8 approved ids and the released new ones, each once, every row mode 'H' with no `parent`, `template` or `params`. NOT_HERE (lb7-plates.test.ts:26) shrinks to push_up and bent_over_dumbbell_rear_delt_fly; HELD stays ['cable_rear_delt_fly'] (:33).
  Mutations: push_up added; one row set to 'T'; a row duplicated; cable_rear_delt_fly added.
- **A2 Nothing else moves.** The 8 approved LB7 plates' 72 fragment shas equal their values on page `c457ee86…2194`, pinned in a new block of lb7-plates.test.ts in the form of lb6-plates.test.ts:1300 (lb7-plates has no such block on main). Pilot A L1, pilot B and every other registry page's sha are equal before and after (listed in the PR). f-zoom-2.test.ts passes unedited. C0 is []. `git diff --exit-code origin/main...HEAD` is empty on the Never paths.
  Mutation (temporary worktree): one byte in bench_dip.mjs's alt turns its fragment check red; one byte in push_up.mjs turns C0 and pilot B red.
- **A3 Strip** (D-LIB17R3-AFALL, -STRIPROWS). Both ids are in fallbackA, every phase blank with its claim, and out of leftOut; the scope set is unchanged (lib-strip.test.ts:296-298); each card's tempo is tempoOf(its rows); H6 passes with `allBlank` (tempo-strip.mjs:59-68). Only the two LABELS literals and ROWS_PIN differ in lib-strip.test.ts (`git diff` shown).
  Mutations: diamond_push_up's Lower given the word 'Slow' (H6.tempo-word:…:fallback); pike_push_up in both leftOut and fallbackA (scope red); the old ROWS_PIN.
- **A4 Card-true poses** (drawn-item tests on every row, in full). incline_push_up: the hands on the bench's top edge at about shoulder width (c1); the top toe-to-shoulder line 45° ± 5° (c1); the bottom chest landmark 2.5 ± 0.5 cm over the edge (c3); the elbows about 45° from the body (c4). diamond_push_up: the grips under the upper chest, between the shoulder and chest landmarks along the body (c1); the elbows tucked by the torso (c3); the chest near the backs of the hands at the bottom (c3). pike_push_up: the hips above the shoulders with the legs straight (c2); at the bottom the head within 2.5 cm of the floor and in front of the hands (c3, c5).
  Mutations: diamond_push_up with push_up's ELBOW_POLE; pike_push_up's hips at plank height; incline_push_up at 30°.
- **A5 Clearance** (D-LIB17R3-CLEAR). Every part clears the body by 2 px or more in every drawn pose, except the card contacts (palms on the bench or floor, toes on the floor): the incline head over the bench top (12.3 cm measured at a 0.43 m top), the incline chest over the edge, the pike head over the floor, the diamond chest over the hands. Mutation: the incline chest gap set to 0.
- **A6 QA.** Every hard check passes per id, node and browser. The raised flags equal the ruled set exactly (qa.mjs): F5 on all, F7 on pike_push_up only, and its topFault differs from the drawn key. Mutations: LIB-3's M1-M7 on one new plate; pike_push_up's topFault set to its drawn key.
- **A7 Cards.** Each of the 3 cards differs from its `a48b0594` blob only in the 3 keys (cards.sha.json); validateCardFile gives [] (the fallbackA rows included, validate.mjs:244-246); CARD FIELDS VERIFIED with the plant caught. Mutations: another key edited; the verifier's plant.
- **A8 Nothing ships.** The A9 asserts cover the 3 new ids. Mutation: one row set to shipped.
- **A9 Panel and green.** The wave is VALID under PANELS §1, both plants caught, R10 scored for pike_push_up. Approvals are per id at that head. `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` pass on the merged head, and CI is green.

## Rulings (confirmed by the supervisor, 2026-10-31)
1. **D-LIB17R3-LANE:** one lane for LB7's three rows, separate from LB6's (disjoint write scopes).
2. **D-LIB17R3-MODES:** all 3 rows are H, with the reasons in the mode table; PUSHUP is not built; LB7 marks P1 T0 H13 (supervisor docs action).
3. **D-LIB17R3-AFALL** (the S3 question, strip/rows.json:519-526): pike_push_up and diamond_push_up take D-STRIP-AFALL (every phase blank, with the claim), in the D-LIB22-AFALL form (lib4-cards :4436). FORMS does not grow (D-STRIP-FORMS, lib-strip-card.md:234): diamond's "push back up forcefully" (c5) is effort, not a cadence, and the one FORMS word in its tempo text, "slow", is negated ("No source on the card gives seconds or a slow phase"); pike's text has no FORMS word, and "Moving too quickly without controlling" (c9) is a named mistake. Like sled_push, this departs from D-STRIP-ROWS's "at least one phase has a word" (lib-strip-card.md:231) only by that ruling.
4. **D-LIB17R3-STRIPROWS:** both ids move from leftOut to fallbackA in strip/rows.json. Only lib-strip.test.ts's two LABELS literals and ROWS_PIN are edited, a ruled exception to the other-task-block rule in the D-LIB22-STRIPROWS form (lib4-cards :4449). The scope count stays.
5. **D-LIB17R3-F7:** F7 is expected on pike_push_up (drawable false), added to lb7/qa.mjs F7_IDS (:47) and named at the sheet.
6. **D-LIB17R3-CLEAR:** the BARSTART lesson (#349 6542437139) from the start: a 2 px clearance test per row, card contacts excepted, each with a 0-value mutation. It adds checks only.
7. **D-LIB17R3-BENCH:** incline_push_up's bench height is an unsourced number solved from c1's 45° (about 0.39 m [est]; 48.0° measured at 0.43 m) and listed in the spec header; c1's "sturdy bench, box or platform" and c14's "sturdy desk, step platform or bench" fix no height.

## For the supervisor, not in either card: D-TEMPLDIR-LIST (a general fix for the "no templates folder" asserts)
- **Today** (#349, D-LIB15R2-TEMPLDIR, 6540882818 and 6541574440): lb2-plates.test.ts:704, lb3-plates.test.ts:114 and lib11-pilot-b.test.ts:274 each carry the literal list `['CURL.mjs', 'PUSHDOWN.mjs']`. Each new ruled template (SPLIT, SUPCORE, SHRUG ...) would need three more edits of other tasks' blocks. Neither LB6 nor LB7 adds a template, so neither card needs this; the next template card does.
- **Proposal:** one supervisor-owned list, `tests/howto/fixtures/ruled-templates.json` (`{ rule, templates: { "CURL.mjs": "D-LIB15R2-MODES", "PUSHDOWN.mjs": "D-LIB15R2-MODES" } }`), read as data by a small helper `tests/howto/ruled-templates.ts`, in the eq-composers.json / eq-composers.ts pattern (D-LIB-A16-REGISTRY, tests/howto/eq-composers.ts:1-31). The three lines change once (a ruled one-line exception, D-LIB4-CTRL form) to "every file in templates/ is in the ruled list"; the row-level all-H assert above each stays byte for byte.
- **Why it is not looser, and is stricter:** each block still fails on any unlisted file. A new supervisor block adds: the folder equals the list exactly (a listed file that does not exist is red, which today passes), each entry names a ruling id found in docs/COACHING-DECISIONS.md, and the shape is closed. A template then lands with its own file and one list entry under its ruling; no other task's block changes.
- **Mutations:** a stray templates/HROW.mjs turns all three blocks and the new block red; a listed file removed is red; an entry whose ruling is absent from COACHING-DECISIONS is red; an LB2, LB3 or pilot B row given mode 'T' stays red. The closure filters (lb2:640, lb3:789, lb4:734, lb5:334) match path prefixes, not existence, so they are untouched (#349 6541574440).
- **When:** after #349 merges (the list starts at CURL and PUSHDOWN), as a tests-only supervisor commit or in the next template card's PR.

## Risks and mitigations
- **incline_push_up's Mistake reads only as a shrug** (7.2 px). Mitigation: the PLAN anchors a tell on the steeper body (feet or hips), as c10 names the feet; else the zoom route (D-LIBZOOM-EXTEND), never a bigger shrug.
- **pike_push_up's head-only Mistake is close to its normal end** [est]. Mitigation: measure the head and elbow tells in the PLAN; zoom if under the bar (S2).
- **A diamond hand place or elbow tuck the side view cannot show** (the diamond itself is invisible from the side, card viewWhy; the hand zoom carries it at ship). Mitigation: A4 pins what the side view shows (fore-aft hand place, elbow tuck); the ship card owns the hand close-up (hands/hand-palm-flat.mjs:27).
- **The strip edit collides with another lane** (LB10's wall_ball S3, strip/rows.json:514-516). Mitigation: no open PR writes strip/** today; keep both sides on a merge and re-pin ROWS_PIN on the merged rows.
- **LIB-SPINE merges mid-lane** (body.mjs). Mitigation: no row uses its opt-in fields; merge main and re-run A2 and C0.
- **Usage.** The owner's 80 % pause applies (PANELS §9). Mitigation: post WAITING with a HANDOFF block.

## Forecast [est]
- Builder, about 21 Opus-hours: PLAN 2 h; 3 H rows × 4.75 h = 14.25 h (plan :894-897); strip rows 1 h; cards 2 h; tests and tooling 2 h. With 2-4 fix rounds, allow up to about 40 h.
- Supervisor: the PLAN and strip rulings; one CARD FIELDS verify (3 cards) plus a re-verify; one panel plus a recheck; the review.
- The panel can run about a day after start [est].
- Rows released if every step passes: 3. Nothing visible ships, so no APK.

return: PR and head sha; links to PLAN, PLATES READY, CARD FIELDS and READY; the per-id table (mode, clone source, flags, held or not); the LB7 page sha256 from two builds; A2's fragment table; the strip diff; the mutation list; check, test:tz and gate output.

Resume rule: when WAITING, resume only on the supervisor's exact words 'LIB-17 resume 3' (sent to the session or posted on the PR).
