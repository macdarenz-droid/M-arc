# LIB-11 card (pilot B): adversarial critique (2026-10-19)

Read: `lib-11-card-draft.md` (cited as card:N). The supervisor rulings at card:323-333 are treated as binding. Checked against: main `565ea5a4` (= origin/main); claude/sup-lib4-cards `a3c69378` (lib-13-card.md, lib-13-critic.md, lib4-cards.md 14.4, 14.7, 14.8, 15, 16, 20-25, lib-8-merge-card.md, pb-research-card.md, lib-zoom-card.md); plan claude/howto-options `a5e87d9e`; research `892d6516` (= claude/libht-research head) and `8e9abb7d`; census `4a9fd86`; #109 `48d49bb8`; #265 `2dcbac15`; #191 `c99cb66d`; #190 `82ae2d40` and its parent `c19805aa`; #245 `38b436d5`; #274 `9994268d` and comments 6265033303, 6265126577, 6265616772; #109 5950197626; #265 6256170884; #276 (VITEST-RPC, `da488f7f`).

Count: **5 high, 9 medium, 12 low.**

Confirmed correct (no action): every sha cited exists; #190 is open, draft, '[do not merge]'; plan :137-138, :153-154, :161-162, :185-195, :258-269, :659-665, :705-717, :768, :775, :778, :820, :824, :869-872; candidate.mjs :84, :87, :94; registry.mjs :30; derive.mjs :4-12 (no Smith value in load.primitive or bar.kind); qa/envelope.json traceLenMin 22.11, deviationMin 11.39, H9lineTypes, F1 [123.91, 146.29]; qa/mutations.mjs M1-M7; D-LIB8-floor in 5950197626 (y≈1043, at most ×1.35, F1 named); D-LIB13-LANDMINE-2 and -TBAR texts; D-LIB10-BENCH-H ("BENCH is not built in LB2"); 21.4 (dumbbell_bench_press and plank approved @ `013f84e`), 21.6 (upright_row @ `94c551f`), 24, 14.4, 14.7, 14.8 point 5, 16, 20 (D-LIB12FIX-SLOT 6c order); the facts for all 7 cards at `892d6516` (claims, tempo, picks, R-W1-7, "no rankNote yet" notes on smith and cable_fly); russian_twist's pick at `8e9abb7d` and `892d6516` is hips and knees swinging; the census rows (views, poses, gaps, closest; feelMapAllPrimaryTextOnly's 6 ids); main's body.mjs and plate.mjs equal the spike parent's blobs `c4b01707` and `6113e70e`; the spike's side_plank uses roll and trunk.lat, and its russian_twist uses yaw, pitch 20, torso 'volume' and the arms-only Mistake; #191 IDS (palm-flat includes push_up, ball-contact wall_ball, battle-rope battle_ropes; dip-bar, ab-wheel and implement are GAPS); COACHING-DECISIONS.md:2137; lib-zoom-card.md:12; HANDOVER.md:110; lb2-plates.test.ts:106-174; close_grip_bench_press.mjs `flare` :93-170; coverage.ts has the 5 ids at 'queued'.

LIB-13 holes re-checked: M1, M3, M6, M8, L5 and L10 are closed here. H2 is closed, but its replacement check breaks after the pin (M3 below). H3 and L2 are reopened (H1 and H3 below). M2, M7, M9, L6 and L8 are only partly closed (L3, L4, L7, L8 and H4 below). LIB-13's A11 mutations (iii) and (iv) were dropped (M8).

---

## High

### H1. The at-start slice cannot be built or QA'd on its own head (LIB-13 H3 reopened, plus a second cause)
- Card lines: :27, :28, :174, :176, :178, :333 (ruling 10).
- Evidence:
  - (a) No cards. Do 4 copies lb2/build.mjs, whose `cardOf` reads `docs/research/howto/cards/<id>.json` and maps `card.sources` for every row (lb2/build.mjs:17-23 @ `2dcbac1`). That throws ENOENT without the card files. Main holds only the 8's cards, and Do 5 a copies pilot B's cards only after 'PILOT B research head' (:28, :178). So the slice's "two-build plates-page sha256" (:174) cannot be built at start.
  - (b) No Mistake. Ruling 1 bars any Mistake before the research head, so the slice plates have no `spec.mistake`. The vendored builder then emits no Mistake figure and no `<div class="tells" hidden>` (vendor/artifact/build-page.mjs:115, :160-161). extractPlates throws "the card does not have the approved structure" for that article (golden.mjs:115-116). It also throws inside the single loop over every article, and candidateOf calls it on the whole page (candidate.mjs:95). So qa.mjs cannot print the "authoring QA table" Do 2 asks for for any id, and cannot measure crunch's H3 in the slice (ruling 10). The same fact made D-LIB8M-NOSTRIP hold box_jump and reverse_lunge.
  - The builder's only ways out are to draw a Mistake early, which breaks ruling 1, or to post a slice with no QA, which breaks Do 2. Either way the builder has to guess.
- Fix:
  - Add a Do 5 a0, at start: "Copy the 5 cards and quotes byte for byte from `892d6516` (LR-29 verified), with cards.sha.json naming `892d6516`. When 'PILOT B research head' is posted, re-copy them under :180's rule." Add "Do 5 a0" to :27.
  - Split Do 2 into two posts:
    - 'PILOT B SLICE READY @ <sha> (right poses)', at start: renders, A2's composer tests and the two-build page sha. No QA table.
    - 'PILOT B SLICE READY @ <sha> (Mistakes)', after the research head: the Mistakes, the authoring QA table and crunch's H3 trace and deviation.
  - :30 then reads "Do 6 bulk: 'PILOT B BULK GO', after the supervisor's look at the Mistakes slice."
  - Ruling 10's early measure: "crunch's trace length may be read earlier from the engine report at the plate's px/m by a scratch script, never committed and never posted as QA."
  - Replace :174's last sentence with: "A plate with no Mistake breaks extractPlates for the whole page (golden.mjs:115-116), so QA starts with the Mistakes slice."

### H2. Do 8's engine drop-in fails the L0 lock, and the card forbids the only way round it
- Card lines: :192, :229, :242, :326 (ruling 3).
- Evidence:
  - buildPlatesPage runs verifyVendor first and throws "vendored engine is not the golden lock" on any mismatch (library/build-page.mjs:84-85 on main). verifyVendor checks each vendored file's sha256 and git blob against MANIFEST.json, and its `source` against SOURCE_RE (golden.mjs:42-58). On main, SOURCE_RE is built from pins.json `vendorSources` (golden.mjs:27).
  - #190 changed four non-spike files, not two: vendor/engine/body.mjs, vendor/engine/plate.mjs, vendor/MANIFEST.json (new sha256 179836fc…/a0bcabb4…, gitBlob 310756ab…/f242813e…, source "SPIKE:…") and tools/plates/golden.mjs (a hard-coded regex with SPIKE) (`git diff --name-only c19805aa 82ae2d40`).
  - Main has since moved that regex into pins.json, so the spike's golden.mjs cannot be dropped in either.
  - So "copy only … body.mjs and plate.mjs" (:192), followed by the spike's render.mjs, throws on its first build. The builder must either edit guard files that :192 does not allow or stop.
  - A7's leak check (:221), which A15 relies on, does not cover tools/plates/pins.json or tools/plates/golden.mjs.
- Fix:
  - :192, add: "In that scratch worktree only, also apply the spike's two MANIFEST.json entries for engine/body.mjs and engine/plate.mjs, and add `{ "commit": "SPIKE", "why": "LIB-11 Do 8 scratch render, never committed" }` to tools/plates/pins.json `vendorSources`. Nothing else. verifyVendor must return [] there. Post the scratch diff (4 files) with the renders."
  - Add `tools/plates/pins.json tools/plates/golden.mjs` to the leak check (see M3).

### H3. A7's whole-token scan turns red on a correct head once LB1 ships (LIB-13 L2's hole, worse here)
- Card lines: :219, :221, :222.
- Evidence:
  - LB1's hanging_knee_raise card cites "…the body saw, hanging leg raise and walkout from a push-up (McGill, Andersen, Cannon, J Sports Sci)" (source mcgill-2015, cards/hanging_knee_raise.json @ `892d6516`).
  - Batch rows carry `sources` lines built from the card title (pilot-a.json rows @ `48d49bb8`; lb2/build.mjs sourceLines). So LB1's ship puts "push-up" into batches/lb1.json, and the layers page can carry it into tests/howto/golden/library/lb1.layers.html.
  - "push-up" is push_up's hyphen slug, and it matches as a whole token both with `\b` and with LIB-13's `(^|[^a-z0-9-])…([^a-z0-9-]|$)` form.
  - LB1 is a merge prerequisite (:38), so it will be merged in before READY. A7 then fails on a correct head, and A8's "none elsewhere" fails after the pin. The builder's only way out is to loosen the test.
  - The same collisions sit ahead with `\bcrunch\b` against the hyphen slugs cable-crunch, reverse-crunch, machine-crunch and bicycle-crunch, and with push-up inside incline-push-up, pike-push-up and diamond-push-up.
  - A7 also has no `"batch": "PILOT-B"` text assertion (LIB-13 A9 has one). Its own page-only mutation `{"entries":[{"kind":"page","batch":"PILOT-B"}]}` turns red only if that file happens to be named pilot-b.*.
- Fix: replace A7's scan (and A8's "none elsewhere") with structural fields only:
  - batch files: the `rows` keys and each row's `src`, `slug`, `prefix` and `chromeId`;
  - golden JSON: each entry's `id`;
  - layers HTML: the `id="card-…"`, `data-ex` and `data-id` attributes;
  - file names;
  - plus "no text names `"batch": "PILOT-B"`".
  Add controls that must stay green:
  - a batch row whose sources line reads "walkout from a push-up";
  - a row keyed lib_cable_crunch with slug cable-crunch;
  - a row keyed lib_incline_push_up.
  Add LIB-13's assertion over exercises.json: list every real id that contains a pilot B id (crunch: 4; push_up: 3; cable_fly: 2), and prove that none of them matches.

### H4. 'PILOT B NOTE RULED' can come before R-PB exists, yet it gates card fields that R-PB changes
- Card lines: :29, :158, :167, :179.
- Evidence:
  - The note is posted at start (:158), with its Mistake rows "pending R-PB" (:27). Its fault→key map is written only "after the research head" (:167).
  - R-PB's (b) changes the tempo claims, for example crunch's pause needing a WEAK claim (pb-research-card.md:9). Its (a) may change three picks, the pose map or drawable.
  - Do 5 b waits only for 'PILOT B NOTE RULED' (:29). A ruling posted before R-PB therefore covers no fault→key map and a tempo map that may be stale.
  - The card has no words for posting the amended note and no second ruling. The builder must guess whether the early ruling unlocks Do 5 b. LIB-13 never faced this, because its research head existed at start.
- Fix:
  - :167: "After 'PILOT B research head', post 'PILOT B NOTE AMENDED @ <sha>' with the Mistake rows, the fault→key map, and every tempo-map or pose-map change from R-PB's 'PICK CHANGED' and 'STOP' lines."
  - :29: "Do 5 b: 'PILOT B MAPS RULED @ <sha>', naming the research head. 'PILOT B NOTE RULED' alone does not open Do 5 b."
  - A10's own tempo-table copy follows MAPS RULED.

### H5. The pin phase has fewer acceptance tests and mutations than the pattern the card says it follows
- Card lines: :101, :121 ("lib-8-merge-card.md … A1-A19"), :210-211, :222, :255.
- Evidence:
  - lib-8-merge-card.md pins pilot A with these, each with mutations:
    - A10: the page config through the registry equals the pinned sha. Mutations: two ids swapped; a sources line changed.
    - A12: exemptions equal the GO. Mutations: an exemption the GO does not name; the approval removed.
    - A13: after the pin, the default path gives ok true, and F5 is exactly 3.57. Mutations: the candidate's exemptions set to []; tell chrome at 3.40.
    - A14: C0 is green with the MANIFEST rows, and the commit carries [golden update]. Mutations: a spec byte → C0; a pages byte → C0 and L1; a missing row → C0.
    - A15: L1 howto-rebuild. Mutation: a composer constant changed on a scratch ref.
  - LIB-11 covers none of these with an A-number. Do 11's default-path run (:211) and Do 12's C0 and L1 runs (:212) have no criterion and no mutation, although the MANIFEST rows and the golden chain are deliverables (:100).
  - A8's mutation "approvedBy 'owner' … without the owner's words" bites only if the test asserts 'supervisor' itself: verifyBatchChain accepts 'owner' with no words check (golden.mjs:156 @ `48d49bb8`).
- Fix: add, after A8:
  - A8b (page): buildPlatesPage(await pageConfig('tools/plates/library/pages/pilot-b.json')) equals the page entry's sha and bytes. Mutations: two ids swapped; one sources line changed.
  - A8c (exemptions and post-pin QA): each plate entry's exemptions equal the GO's list. runQa on candidateOf(id) gives ok true. F5 = 3.57 wherever 'F5' is exempted. Mutations: an exemption the GO does not name; the candidate's exemptions set to [] (applied to the candidate); tell chrome at 3.40.
  - A8d (L0-lib and L1): C0 is green with pilot B's MANIFEST rows, and the pin commit carries [golden update]. howto-rebuild proves pilot-b.json's page locally and on the train head's full run. Mutations: a spec byte → C0; a pages/pilot-b.json byte → C0 and L1; a MANIFEST row removed → C0; on a scratch ref the supervisor pushes, one smith.mjs geometry constant → L1 red.
  - A8: "the test asserts approvedBy 'supervisor', decision 'D-LIB-PILOTB' and an approval equal to the GO's comment link on every entry".

---

## Medium

### M1. The build-ahead split contradicts the slice and bulk gates
- Card lines: :27, :30, :92, :174, :181, :184, :215, :239, :305.
- Evidence:
  - :27 and :305 allow "the right poses of all 5" at start.
  - :92, Do 2, Do 6 and A1 say no bulk drawing comes before the 3-plate slice look and 'PILOT B BULK GO'. cable_fly and push_up are not slice plates, so drawing them at start is bulk.
  - :239 says cable_fly's clutter risk is judged "on the slice", but the slice is smith, seated_leg_curl and crunch (:174).
  - :184 says to check cable_fly first.
- Fix: choose one of these, and fix :27, :305 and :239 to match:
  - (a) cable_fly joins the slice as the front-view anchor and the clutter risk;
  - (b) at start, draw only the 3 slice ids' right poses, cable_fly and push_up wait for BULK GO, and :239 reads "R4 and R7 judge it on the bulk post".
  Recommended: (a). cable_fly is the only engine-drawn front-view plate, and it carries the clutter risk.

### M2. The pin commit's paths are incomplete
- Card lines: :143, :210, :222, :176, :223.
- Evidence:
  - write_scope's pin list (:143) names 4 paths plus the generated outputs.
  - Do 11 also deletes pilot-b/rows.json (:210), and A8 replaces the test's ceiling block in the same commit (:222).
  - build.mjs, qa.mjs and sheet.mjs read pilot-b/rows.json (Do 4), so A9's after-pin build needs them changed too.
  - The reviewer's "commit equals the GO" check (:40) and Do 12's scope diff (:212) will flag paths the card never listed.
- Fix: :143 adds "the deletion of pilot-b/rows.json; tests/howto/lib11-pilot-b.test.ts (ceiling block → pinned block only); pilot-b/build.mjs, qa.mjs and sheet.mjs switched from rows.json to the registry's batches/pilot-b.json row (no other change)". :40 then reads "the pin commit equals the GO on these paths only".

### M3. A7's recorded diff check fails after the pin, yet A15 and A16 rely on it "on every head"
- Card lines: :221, :229, :230, :242.
- Evidence: the pin commit changes batches/, tests/howto/golden and src/ (:143). So the A7 command exits 1 on the pin head and on the READY head, while A15 asks for it "on every head".
- Fix: split it in two:
  - Leak check, run before every post and on every head: `git diff --exit-code origin/main...HEAD -- tools/plates/vendor tools/plates/library/spike tools/plates/library/hands tools/plates/pins.json tools/plates/golden.mjs tools/plates/gen tests/howto/library-lint.test.ts`. Seed it once as now.
  - Ceiling check, pre-pin heads only: `… -- tools/plates/library/batches tests/howto/golden src tools/plates/library/pages tools/plates/library/MANIFEST.json`.
  - After the pin, A8's `git diff <parent> <pin>` takes over.

### M4. LIB-4c's scratch fixture targets the pilot B anchor, and the card is silent about it
- Card lines: :150 (ci/ reserved), :210.
- Evidence:
  - ci/scratch.mjs:25 on main (also on #109, #265, #191, #274 and #276) has `{ id: 'lib_smith_machine_bench_press', from: 'machine_chest_press', key: 'lib4c-scratch-e' }`. :26 targets lib_smith_machine_incline_press, a later smith user.
  - D-LIB-SCRATCHIDS (lib4-cards :1098-1103): once real rows are in batches/, "the fixture's put() overwrites the real spec, How-to and card in its scratch copy, and the registry throws on the duplicate id". The fix there was made by the push that first moves the batch's rows into batches/.
  - Pilot B's pin is that push for smith. setProblems refuses only LB1 and LB2 ids (scratch.mjs:35-39).
- Fix: the supervisor rules D-LIB11-SCRATCHIDS, choosing one of:
  - (a) the pin commit swaps scratch-e's target for an id outside LB1, LB2 and pilot B with the same source, key and COPY_EDITS; adds the 5 pilot B ids to setProblems' refused list; re-runs the fixture test; lists the changed lines; and opens ci/scratch.mjs for those lines only;
  - (b) a supervisor follow-up before the next scratch run.
  Either way, name it in :210 or in the supervisor follow-ups.

### M5. Battle_ropes' camera options (ii) and (iii) cannot be produced within the card's scope
- Card lines: :139, :204, :230, :276.
- Evidence:
  - D-LIB12FIX-ROPE (lib4-cards 20): (ii) is a redraw at a level forearm (Right forearm 90) with the words 'Seen from above'. (iii) is "another camera", undefined. LIB-12-FIX "changes no battle_ropes byte".
  - hands/** is read only here (:81). evidence/ is capped at 6 PNGs (:139), and A16 counts 6.
  - So the "three camera options" (:204) cannot be rendered, and the builder must guess between editing a reserved module, making uncommitted renders, or text lines.
- Fix: in :204 and :276, (i) is the committed render. (ii) is shown only from a render the supervisor supplies (LIB-12's lane), otherwise as one text line. (iii) is one text line. The sheet asks the owner to choose (i), (ii) or (iii).

### M6. The E-R5 renders rest on no reproducible input
- Card lines: :115, :191-195, :200, :205, :326 (ruling 3).
- Evidence:
  - Do 8 draws new side_plank and russian_twist specs from the cards, not the spike's, in a scratch worktree, and commits nothing (ruling 3).
  - The supervisor publishes the sheet (:207) and the critic scores them (:200), but neither can rebuild them from the head: only PNG sha256s are posted.
  - AGENTS counts evidence only for the commit it ran on, and LIB-13's critic H3 rejected evidence "that belongs to no commit".
  - The ball: russian_twist's plate.start holds a ball (c2). medBallOptional is an LB9 single-use composer (plan 2.1), and the spike dropped the ball (`equipment: [...].slice(0, 1)`). The card does not say what is drawn.
- Fix: ruling 3 stands (nothing committed). Do 8's post carries:
  - the full text of each scratch spec and helper;
  - the scratch diff from H2;
  - the exact render command;
  so the supervisor reproduces the PNG sha256s from <main sha> + #190's blobs + the posted text. sheet.mjs takes the E-R5 PNG folder as an input, as it takes the Do 7 JSON. Add: "russian_twist draws clasped hands (card variantLine; c2) and no ball; no composer is built."

### M7. The drawing-convention rule is applied more widely than D-LIB13-LANDMINE-2 ruled
- Card lines: :61, :169, :240.
- Evidence:
  - 6265033303 put research first (route 1) and HELD second (route 3). The drawing convention followed only after research recorded plate size as a gap on the cards (6265126577: "Plate size is a recorded gap on both cards").
  - :61 says "records as a gap", but :240 says "leaves as a gap", and :169 lets the builder pick which unsourced sizes become drawing-convention flags.
  - Smith rail spacing, hook heights and the leg-curl lever length are not recorded gaps on these cards. Picking a catalogue value that passes a check, with no ruling, moves a decision the supervisor made per rig to the builder.
- Fix: :240 becomes "If an unsourced size decides a hard check, post the measured table and stop that plate. The supervisor rules research (route 1) or a drawing convention (D-LIB13-LANDMINE-2, -TBAR). Never pick a value to pass a check without that ruling." In :169, "would become" becomes "proposed as".

### M8. A10 drops two tempo mutations from LIB-13's A11, and A11 drops the topFault checks
- Card lines: :224, :225, :179.
- Evidence:
  - LIB-13 A11 has (iii) "a Hold s that differs from the card's pause, set in card and spec" and (iv) "a Hold of 0 s added to a pause-0 card". They guard D-LIB8M-TEMPO's "Hold only if pause > 0". push_up, smith_machine_bench_press and seated_leg_curl are pause 0, and cable_fly and crunch are pause 1, so both apply here.
  - LIB-13 A13 also names "Q1's two topFault checks", and LIB-13 Do 6 b runs a focused re-verify with a new plant after a fix (21.5-21.7; 22). LIB-11's A11 and Do 5 b omit both.
- Fix:
  - A10: add "(iii) a Hold s that differs from the card's pause (card and spec); (iv) a Hold of 0 s added to push_up (card and spec)".
  - A11: "with Q1's two topFault checks".
  - Do 5 b: "A focused re-verify with a new plant runs on the changed cards; qa.mjs re-runs and H6 must pass."

### M9. The scale and trace for crunch's small-motion pre-check are not fixed before the measurement
- Card lines: :57, :171, :189, :333 (ruling 10).
- Evidence:
  - D-LIB8-floor lets a floor plate scale up to ×1.35, which is 197.5 px/m against F1's 146.29 cap. At that scale H3's 22.11 px is about 11.2 cm of travel instead of about 15.1 cm at 146.29 px/m.
  - DRAWING-GUIDE.md:29 (#109) says to trace "the point the card's cue is about".
  - Neither the scale nor the trace point is fixed before the measurement. A builder can then choose the largest scale, or a head trace, that passes. That is zoom by another name, which ruling 10 and D-LIB13-LANDMINE-2 forbid ("never a moved trace … landmark or threshold").
- Fix: :171 adds "The note fixes crunch's px/m by D-LIB8-floor's fill-the-width rule (cap ×1.35) and its trace point by DRAWING-GUIDE.md:29 (the shoulder-blade lift, c3 and c4), before measuring. Neither moves after the measure."

---

## Low

### L1. Ruling ids that do not exist, and one ruling stretched past its scope
- :23 "D-LIB11-DEPS" and :46 "D-LIB11-ANSWERS" are not among the 10 rulings (:324-333). They are D-LIB11-RPB (1) and D-LIB11-SLOT (8).
- :52 "D-LIB10-TEMPLATES: CFLY, PUSHUP and SUPCORE are built by their batch cards…": D-LIB10-TEMPLATES (lib4-cards 15 item 4) rules only BENCH and SEATPRESS. The pilot B families come from D-LIB11-TEMPLATES (ruling 9).
- Fix: rename all three.

### L2. plates.json "in pilot A's shape" names the wrong keys
- :138. Pilot A's plates.json (`48d49bb8`) has `plates[]` (tier, closest, view, class, and a per-plate `held`), `cards`, `handsNote` and `hands[]`. It has no top-level `held` list, and the copied sheet part orders by `plates[].tier`.
- Fix: "plates.json holds `plates[]` (tier, closest, view, class, `held` per held id), `cards`, `handsNote` and `hands[]`, as pilot A's".

### L3. A2's geometry cases and smith's rail angle
- :216.
  - No mutation covers "hooks sit on the rails" or "the thigh pad touches the thigh".
  - "One vertical line" is not what c8 says ("completely straight bar path", sl-smith-bench). A vertical rail is an unsourced number.
- Fix: add the mutations "a hook 1 cm off its rail" and "the thigh pad 3 cm off the thigh". Add "rail angle 0° (vertical)" to :169's Unsourced numbers.

### L4. LIB-3 flags and sheet flags are mixed in the expected set, and flag equality has no evidence route
- :163, :218, :97.
- Drawing-convention lines and new-rig lines are sheet flags, while A4's equality runs on qa.mjs's LIB-3 F-flags.
- LIB-13's M9 wording is missing: "Browser-half evidence is qa.mjs output at the head; flag-set equality is checked on qa.mjs's table."
- Fix: split :163 into "LIB-3 flags (A4 equality)" and "sheet flags", and add the M9 sentence to A4.

### L5. Hand-render details
- :204, :276.
- The R8 scores come from the supervisor's D-LIB12FIX-SLOT (b) panel, but the card does not say so.
- renderPair renders the first fault by default (pairs.mjs:254-256), so palm-flat's second fault 'hand-ahead' (D-LIB12FIX-WORDS) is not shown.
- Fix: "the supervisor supplies the R8 scores from the D-LIB12FIX-SLOT (b) panel". Either allow 2 more PNGs (`lib12-palm-flat-hand-ahead-*`) and raise :139 and A16 to 8, or record that the owner sees only 'cupped-palm'.

### L6. D-LIB11-SMITH's condition is not in the steps
- :160, :212, :330.
- Ruling 7's diff before READY is not in Do 12. It has no post words and no rule for a non-empty diff. The same risk applies to pilot A specs copied from `48d49bb8`.
- Fix: Do 12: "post 'PILOT B CLONE DIFF @ <head>' with `git diff <source sha>:<path> origin/main:<path>` for every file copied from #265 or #109. If a copied hunk differs, the supervisor rules it before READY."

### L7. The drawable-fault convention anchor is missing from depends_on (LIB-13 M2's pattern)
- :17-22.
- Fix: add "any id R-PB makes drawable:false: the drawable-fault convention (plan 1:85-88), anchored by dumbbell_biceps_curl's F7 (plan 2.2:162; D-LIB8M-TF1 4) on pilot A".

### L8. The start message has no park order (LIB-13 L8's pattern)
- :26. LIB-11 takes the slot that LIB-5 frees while it waits on review (ho-1130 :32).
- Fix: 'LIB-11 start' also names who parks if LIB-5 returns with CHANGES or LIB-10 resumes after pilot A merges.

### L9. Whether the sheet waits for E-R5 is not stated
- :94, :104, :205.
- If 'E-R5 SCOPE RULED' has not been posted when everything else is ready, the card does not say whether the sheet waits or goes with a status line. The finish line needs E-R5 on the sheet.
- Fix: "Without 'E-R5 SCOPE RULED', the sheet carries an E-R5 status line, and the renders follow on a changed-ids sheet (plan 3.5). Neither gates the pin."

### L10. A8's line count assumes no held id
- :222 "plus the 5 stage lines".
- Fix: "one stage line per pinned id".

### L11. The form of the three-key insert is not stated
- :178 ("the canonical form the test states").
- Fix: as D-LIB8M-CARDS, "the three keys inserted as one text block before the final brace; the test replaces that block by `\n}` and compares the bytes with the research-head copy".

### L12. Stale facts and missing words
- :293 names cards `5144ecc6`, but the cards head is now `a3c69378`.
- The forecast (:107) leaves out the dumbbell_fly and rear-delt E-R5 renders if the scope ruling adds them.
- There are no post words for the critic fix round, a STOP or conflict, or a held anchor (:188, :189, :201).
- After the pin, MANIFEST.json joins COACHING-DECISIONS.md as "keep both sides" on main merges (:144).
- Fix: update :293; add "+ about 2 h per extra E-R5 id"; add 'PILOT B FIX READY @ <sha>', 'PILOT B STOP <id> @ <sha>' and 'PILOT B HELD <id> @ <sha>'; extend :144 to MANIFEST.json.
