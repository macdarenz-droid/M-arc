Card LIB-SHIP W8c: switch on the rows freed by the W8a/W8b tool cards (2026-11-14; status `draft`: the supervisor's rulings go at the end and win over the proposals. Nothing starts before 'LIB-SHIP W8c start'.)

Form: `lib-ship-card.md` (steps a-f of W1, rulings 1-15) as W8b ran it on #417: PLAN READY 6847812935, PLAN RULED 6847824876, LAYERS READY 6854783313, rulings 6854831158, panel 6856272493, FIXED 6856468001, STAMP 6856507580, READY 6866684566, REVIEW FAIL 6869580972, FIXED 6870869883.

Sources (read at these heads; [est] is an estimate, [unverified] is what no run here checked):
- main `d92830c2` (train 94, #425). Batch files read with `git show origin/main:`; nothing built or run.
- W8b #417 head `d61ca89b` (contains main `9139c29c`, not `d92830c2`). F-SHEET-COPY #423 head `3a93c03a`. F-BSS-REARKNEE #426 head `f1eb8a2a`.
- Merged freeing cards: F-W8A-ASSISTED #418 (`a4796243`), F-HT10-TEXTZOOM #420 (`4ebc6d63`), F-HAND-PALMFLAT-SIZE #424 (`9139c29c`), F-HT4-RIGHTPOSE part 1 #425 (`d92830c2`), PF5 #419 (`5b7d6e80`).
- `f-w8a-holds-card.md` (each part's "Ship-wave cost"), `f-ht4-rightpose-card.md`, `lib-platefix-5-card.md` (ruling 3, Q-PF5-2), `plan-w8.md`.

id: LIB-SHIP W8c
model: claude-opus-5-5 (card compares, holds and guard replacements are judgement work). Mechanical sub-steps (budget entries from measured numbers, regenerate, MANIFEST by `manifestOf`) may go to a `sonnet` helper with every step spelled out.
mode: auto
title: 'Builder: LIB-SHIP W8c, the freed holds on'
branch: `claude/lib-ship-w8c` from main **after W8b (#417) merges**. First push opens a draft PR 'LIB-SHIP W8c'.
slot: after W8b in the LIB-SHIP merge order (W6 → W7 → W8a → W8b → W8c, plan-w8.md:148). The supervisor names the checklist slot in the start message.


## Supervisor rulings (2026-11-14; these win over the text below)
1. **D-W8C-START:** W8c starts after W8b (#417) merges. The merge order is #417 → #426 → #423 → W8c.
2. **D-W8C-SET: the 6 ids are accepted:** seated_leg_curl, dumbbell_shrug, bulgarian_split_squat, assisted_pull_up, underhand_lat_pulldown and mountain_climbers.
   - Carry: seated_leg_curl, shrug and bulgarian, each only with a byte-equal card.
   - Delta check: assisted_pull_up and underhand_lat_pulldown.
   - Round 2: mountain_climbers.
   - Bulgarian joins only if #426 has merged by LAYERS READY; otherwise it is held.
   - The supervisor's crop check of seated_leg_curl's two text checkpoints (6761492481 point 4) comes before LAYERS APPROVED.
3. **D-W8C-JJ: jumping_jacks is not in W8c.** It goes to the lb05-lb10 wave as F-JJ-TOE: re-apply c51ae277 plus a round-2 check. F-HT10-TEXTZOOM does not apply, because the sheet draws a posture zoom (gen/zooms.mjs:86-89).

## Why now
Every row below was held by a shared tool or a twin gap, not by its own content (D-W8A-SEATEDHOLD 6764870427, D-W8A-ASSISTEDHOLD 6763631846, mountain_climbers 6761492481 point 5, D-W8B-RIGHTPOSE 6854831158). The tool cards that free them have merged, except #426. On main 72 rows ship (64 library + 8; batch files on `d92830c2`); W8b takes it to 81.

Note: plan-w8.md:146 named a different "W8c": the lb06/lb07 A2 rows. PF5 took 3 of them (cable_external_rotation, diamond_push_up and cable_chest_press, D-PLAN-W8C). hip_abduction and weighted_dip were to be checked as drawn. This card is the freed-holds wave; those rows go to a later wave (Q-W8c-2).

## Flip set (checked on main `d92830c2`; every id is `approved-plate`)
| id | page (batch) | freed by | layers verdict | check in W8c | still blocks it |
|---|---|---|---|---|---|
| seated_leg_curl | pilot-b | F-HT10-TEXTZOOM #420 (seated passes at E 14 = floor 14 in 5 themes, #420 B1) | W8a panel 6760254084, rulings 6761492481 points 3-4; judged page pilot-b `d8230e88…` | **carry**, if its card is byte-equal to the card on `d8230e88…`. Plus the supervisor's crop check of the app's two text checkpoints from the flip head's gate screenshots (6761492481 point 4; never done, because W8a held it first) | nothing on main |
| assisted_pull_up | lb01 | F-W8A-ASSISTED #418 | W8a panel 6760254084, round 1; judged page lb01 `231eced9…` | **delta check** (Q-W8b-3 form, the supervisor). The one named change: the Mistake view loses the ghost groups, and its svg now equals the plates pin `5324dd0b…` (lb01.json:469). The judged page had the ghosts (6763627947 point 1), so the card cannot be byte-equal | nothing on main |
| mountain_climbers | pilot-a | F-HAND-PALMFLAT-SIZE #424 ("Under shoulder", Q-PFS-4 6860357671; panel `594e9df8…` approved 6860393119) | W8a panel 6760254084 @ `29e4af37` (judged page `708e7f7f…`): L7 passed, L3 failed, L4 recorded as D-W8A-MCFEEL | **round-2 check** (D-LIB13-PANEL2 round 2: the supervisor crop-checks L3 and the hand panel; f-w8a-holds ruling 4). **A second failure holds it** | nothing on main |
| dumbbell_shrug | lb03 | F-HT4-RIGHTPOSE #425 (D-RP-OPTIN; `dumbbell_shrug\|dshrug-top` is on the ruled list) | W8b panel PASS 6856272493 @ `1fdf6975` | **carry**, only if its card is byte-equal to `1495a28273eb…f6f6` (the judged card; #425 C14 rebuilt it on main `9139c29c`) | W8b merging (lb03's entry supersedes W8b's) |
| bulgarian_split_squat | lb04 | F-BSS-REARKNEE #426 (open) | fresh panel PASS 6869858026 @ `ea5cbca8` (L5 [4,4,4]), bound to card `bcd016a4…bb99` | **carry**, only if its card is byte-equal to `bcd016a4…` | #426 merging (it still needs: merge main `d92830c2`, C12, C14, READY, review). W8b merging |
| underhand_lat_pulldown (**add, Q-W8c-1**) | lb01 | PF5 #419 item 4 (F-UNDERHAND-PQH1: box `{16,288}`, no PQ-H1; 'owner' lb01 plate re-pin). L3 cleared by D-PF5-HANDPAIR 6852356177 | W8a panel 6760254084, round 1 | **delta check**. The one named change: its plate fragments, now the PF5 'owner' pin | nothing on main. Generate stops at `gen/hands.mjs:62` ("no scoped close-up CSS") until it is back on the lb01 layers page (#419 review note) |

**Not in W8c: jumping_jacks (lb10).** It still needs its own fix. A text-zoom flip is not enough. Evidence:
- PF5's toe close-up never landed. c51ae277 (toe-out 39.75° by `ZOOM_ROT 40`, sizePx 110 → 100) was reverted by 9b2eb113 (D-PF5-JJ). On main, `lib_jumping_jacks.howto.mjs`, `specs/jumping_jacks.mjs` and `pages/lb10.closeups.mjs` last changed in W7 (`dde40eb3`), and `platefix5-w7.test.ts:290` records the hold. L5 [3,3,3] and L8 [3,3,4] (W7) are therefore unfixed.
- F-HT10-TEXTZOOM does not apply to it. jumping_jacks draws a posture zoom (`toes-forward`, :71). `textZoomRow` (gen/zooms.mjs:86-89) refuses a text-zooms.json entry for any sheet with a drawn posture zoom, so `ht10Ruled` stays false and its floor stays max(15, E) (library/fidelity.mjs:202, :252).
- The text-zoom part needs no tool. Its sheet already prints the card zoom `landing-knees` (c5, c6) as the posture checkpoint `knees` (:6-9, :133-134). That is the form pec_fly shipped with: the `fly-elbow` zoom drawn and `fly-backpad` as text (D-SHIP-Q14, `lib_pec_fly.howto.mjs:72`, :134-138), with no text-zooms.json entry.
- **So F-JJ-TEXTZOOM reduces to:** re-apply c51ae277 (a sheet `zooms[]` change only, inside a ship wave's write_scope), put jumping_jacks in the lb10 layers group, and give it the round-2 check of L1 (with the text checkpoint, PF5 ruling 3), L5 and L8. A second failure holds it. Recommended home: the lb05-lb10 wave with wall_ball, which re-pins lb10 anyway (Q-W8c-2).

N goes 81 → 87 if all 6 pass (86 without underhand, 85 if #426 has not merged by LAYERS READY).

## What each id needs (the W8a/W8b forms on main's history)
- **seated_leg_curl:** the W8a form from `5fe00e47`:
  - `pilot-b.layers.json`: the id first in the group, plus the closeups row `{ "optionsKey": "seated_leg_curl" }`;
  - `pilot-b.closeups.mjs`: `seated_leg_curl: ZOOM`;
  - `text-zooms.json`: `lib_seated_leg_curl: { ruling: 'D-SHIP-TEXTZOOM', checkpoints: { 'knee-pivot': 'pivot', 'ankle-pad': 'ankle-pad' } }`.
  The sheet needs no change (byte-equal to its W8a sheet since `29e4af37`). Its floor is E 14 through `ht10Ruled`.
- **assisted_pull_up:** the `5fe00e47` lb01 config: the id after `lib_hanging_knee_raise`, plus its closeups row (`pair: 'bar-hang-over'`, `pairFaults: ['curled']`, `pairWords.curled.right`). The sheet is byte-equal since `29e4af37`. #418's scratch lb01 page was `2ab37576…` on its own head; the PLAN posts the page on W8c's base.
- **underhand_lat_pulldown (if ruled in):** the `29e4af37` lb01 config row (`pair: 'bar-pulldown-under'`, `pairFaults: ['curled']`). The sheet is byte-equal since `29e4af37`. Both lb01 rows go in the same re-pin.
- **mountain_climbers:** 3 changes.
  - The `29e4af37` hip-line crop, its first sheet hunk only: `off [5, 30]`, `sizePx 350`, and the spine guide `heel.l` → `shoulder.r`, extended `[0.04, 0.2]`. Main's feel line stays (D-W8A-MCFEEL); the second hunk is not applied.
  - The `29e4af37` `pilot-a.closeups.mjs` row (`css.spine`).
  - The pilot-a layers row from #424: `{ pair: 'palm-flat-floor-over', pairFaults: ['hand-ahead'], pairNote: { right: { text: 'Under shoulder', source: 'docs/research/howto/cards/mountain_climbers.json#c2' } }, pairWords: { 'hand-ahead': { right: { text: 'Hand directly under the shoulder', source: 'docs/research/howto/cards/mountain_climbers.json#c2, zooms[hand-under-shoulder].right' } } } }`. These are exactly the NOTE/CAP of `pair-faults.test.ts:375-378`.
  The page's hand panel must equal `SCRATCH_PANEL` `594e9df8…` (`pair-faults.test.ts:431`).
- **dumbbell_shrug:** `lib_dumbbell_shrug` after `lib_cable_shrug` in the lb03 group. Its closeups row is already on main (#425 C2). It has no hand pair: `hands/no-zoom.json:267`, D-SHIP-HANDW4.
- **bulgarian_split_squat:** the lb04 group entry and closeups `{ optionsKey: 'bulgarian_split_squat' }`, as `1fdf6975` and #426's config `b3ab788a…` hold them. Its sheet comes from #426.
- **New app chunks:** each new pair sub-key gets a `handpair-` budget entry. They are named by `pairs.mjs:418`: `palm-flat-floor-only-hand-ahead-over`, and for lb01 the `bar-hang`/`bar-pulldown` `-only-curled-` keys. Neither lb01 key is in `src/howto/generated/` on main [derived, not built].

## Lessons carried in (each is a rule here)
1. **Scratch dry run before LAYERS READY (Q-W8b-4).** In a scratch worktree that is never committed: flip the wave with scratch stamps and provisional layers-page entries, then run `generate`, `npm run build`, `howto-rebuild`, `fidelity.mjs --ids <wave>` and the library unit suites. LAYERS READY lists every red with a hold recommendation. W8b's run caught an invalid setup-step kind and both HT4/A5 twin gaps before the panel.
2. **An exact LINK pin on every layers-page entry (W8b REVIEW FAIL 6869580972).** For each page W8c re-pins (pilot-a, pilot-b, lb01, lb03, lb04), check the appended entry whole, in the `checks/ship-w8b.ts` `W8B_LAYERS`/`w8bLayersProblems` form (#417 6870869883): `approvedBy 'supervisor'`, the decision, the exact `W8C_LAYERS_APPROVAL` (comment id @ full sha), `supersedes`, ids, the page pin and the superseded pin. Each page gets its own reds: another sha, another comment id, a moved page pin, other ids, and a moved superseded pin. The PR lists the red lines for all pages. A check on one page only is a FAIL.
3. **MANIFEST commits carry `[golden update]`.** MANIFEST.json changes only by `manifestOf`, only in the commit that adds the pin, and that commit's message carries `[golden update]`.
4. **Regenerate headers on merges; never hand-merge them.** After each main merge, run `node tools/plates/generate.mjs`, rebuild MANIFEST, and check `generate --check` (D-PFS-HEADERS). Other cards' tests that pin MANIFEST hashes, moved keys or generated headers get a W8c-first transform (`lessW8c`, `w8cGenText`), as W8b did for #424's C1 and D-PFS-HEADERS (6870869883). Every old red stays, and each new W8c red is listed.
5. **Holds go to main's bytes in the D-PF4 form.** A held id's sheet, configs, closeups row, `text-zooms.json` entry and page entry all go back to main's bytes. The page is rebuilt without it, twice. The guards name it as held, with its red.
6. **A second failure holds the id (D-LIB13-PANEL2).** One fix round, crop-checked by the supervisor. This binds mountain_climbers (L3 is its second look) and any id whose delta check finds a moved byte that then fails.

## Do
0. **PLAN** (no app file): a 'W8c PLAN' section in `docs/howto/library/LIB-SHIP-DESIGN.md`, posted as 'SHIP W8c PLAN READY @ <sha>'. Wait for 'SHIP W8c PLAN RULED'. Re-checked on the base, it gives:
   - per id: page, the config rows above, the check (carry, delta or round 2) and its judged reference;
   - static pre-checks: `lintLibraryRow` [] and `familyRefusal` null for each id; visible words;
   - the exact flip set and N;
   - the other tests that go red when an id enters a committed config (Q-W8c-4);
   - D-SHIP-FLAGS: any raised F1-F4/F7 flag for the 6 (lib-ship ruling 11).
1. **Configs and pages.** Write the config rows above. Build each changed page twice from the committed configs (`layersSpecOf` + `buildLayersPage`), with equal sha256.
2. **Card compares** for each id, against its judged reference (the table): byte-equal for a carry, or only the named change for a delta. Any other moved byte is posted, and that id goes to a full check. If F-SHEET-COPY (#423) is on the base, the named changes also include its replacements, applied as a pure text substitution (#423 A2 form). The compare must show that nothing else moved.
3. **Dry run** (lesson 1), then post 'SHIP LAYERS READY W8c @ <sha>' with: each page's sha256 and bytes from two builds, the card compares, the dry-run reds with hold recommendations, and the gate screenshots of seated's two text checkpoints in Silent Black and Paper.
4. **Wait** for the delta checks, the round-2 check and the crop check, then 'W8c LAYERS APPROVED' with the STAMP list (D-SHIP-LPANEL). A fix goes in one round, with a test that is red before and green after plus a mutation (W8b FIXED form).
5. **Pins and flips:**
   - layers-page entries appended as `'supervisor'` (D-BODYMAP-APPEND), each with its LINK check and reds (lesson 2);
   - reviews.json entries copied verbatim from the STAMP comment;
   - flip the approved ids to `shipped` and run the generator;
   - budgets at measured + 10 %, setBy LIB-SHIP: ht-, posture-, feel- per id, handpair- per new sub-key, loaders `perId n` = N, totals within `totalCeiling` at N;
   - the exact-set guards with reds (lib-ship A1, the lb01/lb03/lb04 A9 guards and the pilot-a/pilot-b guards, c15 `W8C_RULED`), in W8b's form;
   - the MANIFEST commit with `[golden update]` (lesson 3).
6. **QA and READY:** merge `origin/main` with a merge commit and regenerate (lesson 4). Then run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` once on the finished head. CI must be green, including every howto-shard and gate-verdict. Post 'SHIP W8c READY @ <full sha>' with a "You will notice" line and every other-card test edit named. A fresh Opus reviewer follows.

## write_scope
- lib-ship-card.md's write_scope for these ids:
  - batch stage edits in `batches/{pilot-a,pilot-b,lb01,lb03,lb04}.json`;
  - `pages/{pilot-a,pilot-b,lb01,lb03,lb04}.layers.json` and the `pilot-a`/`pilot-b` closeups rows;
  - their golden `.json` chains (append only) and `.layers.html`;
  - `text-zooms.json` (seated only);
  - `lib_mountain_climbers.howto.mjs` (the crop hunk only);
  - generated files (by the generator only), `budgets.json`, `ci/times.json` (measured), reviews.json (verbatim STAMP), MANIFEST.json (`[golden update]`);
  - a new `tests/howto/checks/ship-w8c.ts`, guard replacements, and `LIB-SHIP-DESIGN.md`.
- **Other cards' test lines, each named in the PR with before/after and kept at least as strict (the Q-W8b-1 form):**
  - `zoom-none.test.ts:272-275` (the exact list; its comment says the shipping wave adds the entry);
  - `f-ht10-textzoom.test.ts:153` (`lib_seated_leg_curl` false → true, plus an unlisted shipped row asserted false);
  - the scratch builds that assert an id is not yet in a committed config: `f-ht4-rightpose.test.ts:42`, `f-w8a-assisted.test.ts:57`, and `f-bss-rearknee`'s once #426 merges. They move to an in-test, sha-pinned copy of main's pre-W8c config, with the same pins and a red for config drift;
  - the `pair-faults.test.ts` sub-key lists, if the new committed sub-key turns them red.
- **Never:** the Never list of lib-ship-card.md; `gen/zooms.mjs`, `library/fidelity.mjs`, `fidelity/twins/**`, `hands/pairs.mjs`, `build-layers-page.mjs` (the tool cards' files); any plate spec or plate pin; the 8's chunks; held ids' bytes.

## Stops (post on the PR and wait)
- S1 A card compare moves a byte that is neither named nor an F-SHEET-COPY replacement. Hold that id for a full check; never re-pin around it.
- S2 A check passes only by loosening a guard, a floor (HT10 `max(15, E)` for any row not ruled), a budget rule or a LINK pin.
- S3 The dry run finds a tool red (twin, fidelity, generate) on an id. Hold that id in the D-PF4 form and recommend a follow-up. A tool fix never goes inside this wave (D-W8A-SEATEDHOLD).
- S4 #426 has not merged by LAYERS READY. bulgarian is held at main's bytes and goes to the next wave; W8c does not wait.
- S5 Two failed tries of one approach with no new evidence.

## Acceptance (each mutation turns red and is restored; the PR lists each red line)
- **A1 Exact set.** `shippedIds()` = main's set plus exactly the approved W8c ids. Every held id is `approved-plate` at main's bytes. Mutations: an unruled id shipped; a held id shipped; an approved id left at `approved-plate`.
- **A2 Carry and delta compares.** Each carried card is byte-equal to its reference (seated `d8230e88…`'s card, shrug `1495a282…`, bulgarian `bcd016a4…`). Each delta card differs only by its named change (assisted: the Mistake svg = `5324dd0b…`; underhand: the PF5 plate fragments), plus F-SHEET-COPY's replacements when #423 is on the base. Mutation: one byte elsewhere in a carried card is red.
- **A3 mountain_climbers.** The page panel's sha is `594e9df8…`. The Right head reads UNDER SHOULDER and the Wrong head HAND AHEAD. No "Whole hand down" appears in its card or its app handpair chunk. The crop numbers equal `29e4af37`'s, and the feel line equals main's. Mutations: `pairNote` dropped; the W8a feel line applied; the crop at 170.
- **A4 seated.** `ht10Ruled(lib_seated_leg_curl)` is true. HT10 A1 passes at E 14 in 5 themes. The text-zooms entry passes `textZoomRow`. Mutations: the entry removed (HT10 red at 14 < 15); one checkpoint mapped to a key the sheet lacks.
- **A5 LINK pins** on all 5 pages (lesson 2), each with a wrong-sha red and an other-comment red.
- **A6 Stamps.** `stampProblems(shippedIds())` is []. Each entry is copied from the STAMP comment. Mutations: one sheet string edited after its stamp; one approval swapped.
- **A7 Size.** The budgets rows above. The PR prints the How-to total gz against the 6 MB HT-11b trigger.
- **A8 Library CI.** gate-verdict reads `library: full`, with the proven ids equal to the shipped library ids.
- **A9 Guards replaced, never loosened** (lib-ship ruling 3). The reviewer checks that every old mutation still turns red.
- **A10 Nothing else moves.** Every other shipped card on the 5 pages is byte-equal to main's page. GOLDEN.json and the 8's chunks are unchanged.
- **A11 Green.** check, test:tz and the gate pass on the merged head; CI is green.

## Order and dependencies
- **Scopes overlap, so W8c starts after W8b merges.** W8b appends lb03's entry 16 and lb04's entry 14 (6869580972), which W8c's entries supersede. Both waves also change lib-ship A1, c15, the lb3/lb4 A9 guards, budgets `n`, reviews.json, MANIFEST and the generated ids/loaders/coverage files.
- W8b first needs: a merge of main `d92830c2` (its head contains only `9139c29c`), green CI, and its re-review.
- **Recommended merge order: #417 W8b → #426 F-BSS-REARKNEE → #423 F-SHEET-COPY → W8c.**
  - #426 before #423: #426's C10 pins bulgarian's card at `bcd016a4`, and #423 moves every card's copy (#426 Risk line).
  - #423 before W8c: #423 is ready except for its one re-pin "once W8b and PF5 merge" (#423 body; card ruling 5). Putting W8c first would make it re-pin twice.
  - W8c compares then use the judged card plus #423's replacements (Do 2), which is a mechanical check.
  - W8c builds in parallel from W8b's merge (PLAN, dry run, compares, checks) and merges `origin/main` after #423 lands.
  - If #423 is not READY when W8c is, W8c merges first, and #423 re-pins once more (its own Risk line, D-PLATEFIX-SECOND form).
- These rows share no page with W8c, and they go in a separate lb05-lb10 wave card, after W8c in the merge order. They can build in a parallel lane under D-OWNER-PARALLEL.
  - PF5-cleared (#419 6857928317): cable_curl (lb05); cable_chest_press and hip_adduction (lb06); cable_external_rotation and diamond_push_up (lb07); pendulum_squat (lb08); side_plank (lb09); wall_ball (lb10).
  - plan-w8's as-drawn pair: hip_abduction (lb06) and weighted_dip (lb07).
  - jumping_jacks (lb10).

## Proposed rulings (for the supervisor before 'LIB-SHIP W8c start')
1. **Q-W8c-1: add underhand_lat_pulldown.** Recommended yes. PF5 freed it, and its layers passed W8a round 1. It rides assisted's lb01 re-pin, so it costs one delta check and no extra page.
2. **Q-W8c-2: jumping_jacks goes to the lb05-lb10 wave, not W8c.** Recommended yes. Its fix is c51ae277 (sheet only) plus a round-2 check. It needs no text-zoom tool and no separate F-JJ card, and that wave re-pins lb10 for wall_ball anyway.
3. **Q-W8c-3: the delta checks** (assisted, underhand) are run by the supervisor on the named change only, in the Q-W8b-3 form. A full check follows only on S1.
4. **Q-W8c-4: other cards' scratch tests** move to an in-test, sha-pinned copy of main's pre-W8c config (the Q-W8b-1 form). The PR names each one.
5. **Q-W8c-5: bulgarian joins only if #426 has merged by LAYERS READY (S4).** Otherwise it is held to the next wave.
6. **Q-W8c-6: the seated crop check** (6761492481 point 4) uses the dry-run gate screenshots at LAYERS READY, so the review does not wait for it.

## Risks and mitigations
- **A card byte moves silently** (a shared renderer, PF5 or #423 since the judging): mitigated by Do 2's compares and S1. A held id goes to the next wave and never blocks the others.
- **The first app use of three pair sub-keys** (palm-flat, and the two lb01 ones): their chunk bytes are new. Mitigated by A3, the handpair budgets, and the dry run's `fidelity.mjs`.
- **seated is the first shipped text-zoom row in the app** (only W6's 2 entries exist, and they are staged): mitigated by A4 and the supervisor's crop check.
- **Other cards' tests break when an id enters a config** (3 known, Q-W8c-4): the dry run lists them all before LAYERS READY.
- **Order slip** (#426 or #423 late): S4, and the fallback order above.
- **Usage limits:** the 80 % pause rule, and a WAITING post with a HANDOFF block.

## Forecast [est]
- W8b (measured on #417): 17 ids took PLAN → READY in 14 h, then a review FAIL and FIXED in 1.6 h. A full CI run takes about 94 min (run 43542476170). fidelity takes 769-882 s per id.
- **W8c, 6 ids (4 carried or delta, 1 round 2, plus seated's crop check):**
  - PLAN 1-2 h;
  - configs, pages and compares 2 h;
  - dry run about 1.5-2 h;
  - checks about 1 h of the supervisor's time;
  - pins, guards, budgets and the other-card tests about 4 h;
  - merge, regenerate and CI about 2 h;
  - review and one fix round about 3 h.
- **Total: READY about 1 day after W8b merges, and merged about 1.5 days after**, if #423 and #426 merge inside that window. Main then goes 81 → 87.
- Uncertainty: a moved card byte (one id per S1, about +0.5 day on that id only); mountain_climbers' second look (a hold, not a delay); the CI queue; the weekly limit.

## Not verified here
- No page was built and no card compared. The carries assume, but did not check, that seated's card on W8c's base equals `d8230e88…`'s, shrug's equals `1495a282…` after W8b merges, and bulgarian's equals `bcd016a4…` after #426 merges. The same goes for assisted and underhand differing only by their named change.
- The handpair sub-key names for the lb01 rows, and that their chunks are new (read from `pairs.mjs:418`; not generated).
- jumping_jacks: its E ≥ 15, and HT4 on its zoom-only `ZOOM_ROT` Wrong (no run).
- That every row in the lb05-lb10 list is free of other holds. pendulum_squat's F-PEND-HEEL was not traced, and neither was the verdict state of hip_abduction and weighted_dip. hack_squat stays held (F-HACK-PAD).
- D-SHIP-FLAGS status for the 6 ids.
- Whether #423 lands before W8c's READY.

return: PR and head sha; links to PLAN, LAYERS READY, the checks, LAYERS APPROVED, STAMP and READY; per id: page, check kind, compare result and stamp hash; each page's sha256 from two builds; the budgets diff and the How-to total against 6 MB; the mutation list; check, test:tz, gate and CI output.

Resume rule: when WAITING, resume only on the supervisor's exact words 'LIB-SHIP W8c resume', sent to the session or posted on the PR.
