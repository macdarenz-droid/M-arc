Card LIB-7c: LB1 hand pairs (the six keys of LIB-7-FIX's proposal, #193 6256335507, under the D-LIB7c-* rulings in six-key-rulings.md; built on D-LIB7FIX-PERKEY, lib-7-fix-amend-perkey.md; critic findings lib-7c-critic.md all applied; 2026-10-19)

Sources (every file:line below was opened at these heads; [unverified] marks the rest):
- main 2078913c;
- #193 da65b13a (LIB-7-FIX's head; PERKEY lands on a later head);
- #245 38b436d5; #246 f5174db1; #109 28853e71; #191 0d268a71;
- lib4-cards.md, lib-7-fix-card.md and lib-7b-card.md @ 9d06627c;
- research 9eaa2480. The six card files are byte-identical at 0393aac9 and at LB2 7bced914.
- plan and GA @ 6550ce28.
This card draws what LIB-7-FIX only proposed (lib-7-fix-card.md:267-273) and what LIB-7b never draws (lib-7b-card.md:41).

id: LIB-7c
model: claude-opus-5-5 (new drawings, claims, a critic panel and its calibration need judgement)
mode: auto
title: 'Builder: LIB-7c LB1 hand pairs'
branch: claude/lib-7c-lb1-hands (new). Your first allowed push opens draft PR 'LIB-7c: LB1 hand pairs'.
- Lane place (D-LIB7c-SLOT): a fresh Opus builder takes the next free LIB builder slot after D-LIB7FIX-PERKEY lands on #193. That means a #193 head where PK1-PK4 are green and the supervisor has checked them.
- Fallback: the LIB-7-FIX session, while it WAITS on its review, counted as that session's slot. It works in its own worktree. At handback it pushes its local head and posts a handoff on the LIB-7c PR: Goal · Done · Decisions · Files · Acceptance · next Do.
- PR base: claude/lib-7-radial-pairs until #193 merges; then the supervisor sets it to main. Never change the base yourself.

Stops (these override every other line in this card):
1. Lane (D-LIB-LANE-ACTIVE, lib4-cards :1023). This card holds a LIB builder slot.
   - Start only on 'LIB-7c start', sent with the live active count, the PERKEY head of #193 and the research head 9eaa2480.
   - If told to park, stop at your next local commit and push nothing.
   - Resume only on 'LIB-7c resume'.
2. LIB-7's approvals never move (D-LIB7FIX-CARRY, lib4-cards :3497-3505).
   - CARRY's "hands/hand-*.mjs" means LIB-7's five key files (lib7-fix.test.ts:208-212), not this card's new ones.
   - The pins in tests/library/hand-pairs.test.ts at :132, :403 and :404 stay green, and those lines stay unedited.
   - Every FROZEN file (lib7-fix.test.ts:202-217) stays byte-identical. LIB-7-FIX F4 stays green (22 pages).
   - Never run claims-extract.mjs's main: it reads every module (:14-23) and would rewrite claims.json.
   - If a pin moves: stop. Never re-pin.
3. No shared engine file changes (D-LIB7FIX-PERKEY). This card never edits:
   - pairs.mjs, panel.mjs, zoom.mjs, words/chrome.json or any other key's words file;
   - golden B (tools/plates/layers/**, tools/plates/vendor/**).
   Keys arrive as new files only. LIB-7 A1 (hand-pairs.test.ts:82) stays green with the new modules loaded. `node tools/plates/generate.mjs --check` is clean with no file moved, and loaders.ts's header stays as it is (gen/ids.mjs:121-122).
4. Other cards' files: only the lines listed under D-LIB7c-SCOPE in write_scope. JSON entries are marked by a source naming D-LIB7c-*, and gate-times.json by its "LIB-7c" key. Anything else means stop and report.
5. Words: no new shown or spoken word (D-LIB7FIX-WORDS, as amended by PERKEY).
   - The heading is 'Hand: right and wrong'.
   - The Right note is 'Base of fingers' (radial-rules.mjs:48; for hang, golden B render-hanging_leg_raise.mjs:138).
   - The Wrong and the pager say 'Wrist curled' (D-LIB7-10).
   - The camera words are 'Seen from the side', or 'Seen from the thumb side' (pairs.mjs:33).
   - Alt text reuses LIB-7's or golden B's approved strings.
   - A word with no approved source: stop and report.
6. Research is read-only. Cite only 9eaa2480. No research edit.
7. Nothing ships or pins: no batches/, layers config, budgets.json, MANIFEST.json or `[golden update]` change. lb1/** is LIB-9a's: never edit it.

CI manners (D-LIB-CIMANNERS, lib4-cards :1007):
- At most one push per 2 hours until READY, unless the supervisor asks for one. Never use [skip ci].
- If the supervisor asks you to hold pushes (D-LIB4-QUEUE), hold them until it says go. Never cancel, re-run or dispatch a run that is not yours.
- Run any job that may last over 1 hour as a detached process: `setsid nohup <cmd> > <log> 2>&1 &`, then poll its log. This covers the gate, a full test:tz run and lib7c-gate.mjs on both browsers. A tool background job stops at about 2 hours, and a stopped or killed run is never evidence.
- Never write to the owner.

base:
- Before #193 merges: claude/lib-7-radial-pairs at the PERKEY head named in 'LIB-7c start'.
  - If LIB-7-FIX pushes again, merge its new head with a merge commit, then re-run 7c-A1, 7c-A6, 7c-A7 and 7c-A10.
- After #193 merges: merge origin/main with a merge commit before review and before READY.
- Run `git pull --no-rebase` before each push. Never rebase, amend or force-push.

depends_on:
- LIB-7 + LIB-7-FIX with PERKEY (#193):
  - MODULES by filename (pairs.mjs:15, :37-45);
  - module declarations through `declarationsOf`;
  - `inputsFor` per key;
  - words/<key>.json and `readWords`;
  - keyIndexOf/HAND_OF_ID/keysOf (:298-324) and pairPanel (:328-333);
  - pullVariant (radial-rules.mjs:45-55);
  - lib7Gate's `owner` option (gate.mjs:23-26, :79-81);
  - buildSheet({ mods }) (sheet.mjs:66).
- Golden B, read only: engine/hand.mjs (:31-37); engine/equipment.mjs (:45, :113, :128-133); geom.mjs (:56-57); the approved hands of pull_up, hanging_leg_raise, lat_pulldown, seated_cable_row and dumbbell_lateral_raise, and their howto/render-*.mjs.
- Not a dependency: LIB-7b. Its hook is generic over pairPanel (lib-7b-card.md:226), and its shared-key proof uses scratch ids (D-LIB-SCRATCHIDS :1098).

build_prerequisites:
- 'LIB-7c start', quoting:
  - D-LIB7c-KEYS, -ORIENT, -CONTACT, -FAULT, -SHARED, -HANDLE, -SHIP, -SCOPE, -CAMERA and -SLOT (six-key-rulings.md);
  - D-LIB7FIX-PERKEY;
  - the research head.
- #193 at the PERKEY head. LIB-7-FIX's design note has been accepted (6256326739), and the §8 delta is posted.
- Can run before #193 merges: Do 1-8 (the note, modules, words files, claims, tests, the gate block, the sheet, the critic panel, approvals and pins). Approvals carry across merges only through the 7c-A5 pins.
- Waits for #193 on main: the main merge, READY and the merge.
- Do 4-8 wait for 'LIB-7c NOTE RULED' (Do 3).

merge_prerequisites:
- A fresh Opus review PASS against this card.
- Every check green on a head that contains the latest main.
- Checklist slot 7b (D-LIB7c-SLOT): after LIB-5v (7a), before LB1 #245 (8).
  - It is not a prerequisite of #109 or of 'PILOT A PIN GO': under PERKEY it moves no file any pinned row lists (7c-A10).
  - The supervisor may renumber it to any point after #193 (6) when it is READY earlier.
- Deadline: before LB1's pin commit pins any of the six ids (any plate or page entry), and before LB1 ships any of them (gen/hands.mjs:192). Keying an id that is already pinned adds `inputsFor(key)` to that row's MANIFEST set (ci/manifest.mjs:69-71; the PERKEY exception), so LB1 pins only on a head that holds LIB-7c.
- It merges in a supervisor merge train, one merge commit per PR in checklist order. The builder never merges.

hard card: yes. Write the design note in Do 3, in hands/DESIGN.md §10 "LB1 hand pairs (LIB-7c)", and post it alone with your first push.

outcome:
Gap today:
- **Six LB1 cards have a hand zoom and no key** (lb1/DESIGN.md:48-53, :63-65 @ 38b436d5).
- **A row with archetype other than 'none' and no pair cannot ship** (gen/hands.mjs:190-192; gen/ids.mjs:58).
- **No module draws a bar hang, a bar pull or a V-handle.** d-handle/pull is the only pull variant (hand-d-handle.mjs:14, :17).
After this card:
- New key modules hand-bar.mjs (KEY 'bar') and hand-v-handle.mjs (KEY 'v-handle'), OWNER 'LIB-7c', VIEW 'radial', each declaring its own entries (PERKEY):
  - hand-bar.mjs: `CONVENTIONS['ga:hang-base']` = 'GA 3.1 hang: top of the palm where the fingers start; extension 0 to 35';
  - hand-v-handle.mjs: `ORIENTATIONS['neutral-overhead'] = 'side'` and `CAMERA_TEXT['neutral-overhead'] = 'Seen from the thumb side'`.
- The keys if every drawing passes:

| key | ids | variant (handle; archetype) | Right | Wrong |
|---|---|---|---|---|
| bar-hang-under | chin_up | hang (32 mm; hang) | hanging_leg_raise's Right pose values: ext 10, contactAt 1.0, forearm 180, thumb wrapped, squeeze firm (:92-93); gravity; wristRange [0, 35]; `loadLine: false`, so no force line (as pull_up, render-pull_up.mjs:84-86); contact dot kept for G4 (as the lateral raise, render-dumbbell_lateral_raise.mjs:78-82) | curled: wrist -30 only |
| bar-hang-over | hanging_knee_raise, assisted_pull_up | hang | as above | as above |
| bar-row-over | inverted_row | row (32 mm; pull) | pullVariant unchanged (radial-rules.mjs:45-55) | pullVariant curled (:52) |
| bar-pulldown-under | underhand_lat_pulldown | pulldown (28 mm; pull) | pullVariant | pullVariant curled |
| v-handle-pull-neutral-overhead | close_grip_pulldown | pull (30 mm; pull) | pullVariant | pullVariant curled |

- Counts come from the key set (H1).
  - Let G be the ids moved to GAPS under D-LIB7c-SHIP, and D the drawn keys.
  - drawn ids = the six minus G; keys = D; gap ids = G.
  - One words/<key>.json exists per key in D.
  - lib7-fix.test.ts:69 = 8 + |D|.
  - Gate pages = the sum of faults over the drawn ids (one each).
  - DESIGN §10 states G, D and the reason for each gap before the 7c-A5 pins.
- HAND_OF_ID maps `lib_<id>` for every drawn id.
- The keys pass LIB-7-FIX's every-key checks and this card's own checks. A panel critic has approved them, and they are pinned.
- No pinned row's file list moves, and no row ships.

deliverable: one PR.
evidence: 7c-A1..7c-A10 below.
finish: merged on main in slot 7b. You will notice: nothing visible. LB1 can then ship the drawn ids once its own conditions hold.

design_reference:
- six-key-rulings.md; lib-7-fix-amend-perkey.md; lib-7c-critic.md.
- lib4-cards @ 9d06627c:
  - section 18: D-LIB7FIX-CARRY, -KEY, -WORDS, -BUDGET, -GATE; D-LIB7b-PAGEDUP;
  - 11.1 items 14 (:661-665) and 16 (a)(b) (:674-675);
  - 13.5 D-CRITIC-CAL3 (:1963).
- hands/DESIGN.md: §4, §5 (:160-171), §8.
- #193 5975538224: the LIB-7 panel critic's route, anchors, plants and approvals, and golden-B follow-up 11.
- GA :351-352; plan 2.3 (:166-182) and :839.

connectivity: none. No stored or sent user data, no storage key, no network call, no dependency.

read_first:
- AGENTS.md; .claude/skills/builder/SKILL.md and its gotchas; this card; the rulings; the PERKEY amendment.
- On #193's PERKEY head:
  - pairs.mjs: the whole file;
  - panel.mjs; words/chrome.json and one key file; radial-rules.mjs; hand-d-handle.mjs;
  - checks.mjs :1-12, :59-150;
  - sheet.mjs :20-30, :47-92; gate.mjs; page.mjs :15-28; claims-extract.mjs;
  - tests/library/hand-pairs.test.ts :40-66, :82-90, :120-135, :212-231, :248-256, :300-331, :333-362, :393-452, :474-524;
  - tests/library/lib7-fix.test.ts (all);
  - scripts/screenshot-gate.mjs :9400-9450; tests/gate-split.test.ts:55.
- Golden B (read only):
  - exercises/pull_up.howto.mjs :88-134; hanging_leg_raise.howto.mjs :86-102, :184-196; lat_pulldown.howto.mjs :84-106; seated_cable_row.howto.mjs :89-101, :167-170;
  - howto/render-pull_up.mjs :80-99; render-hanging_leg_raise.mjs :134-143; render-dumbbell_lateral_raise.mjs :78-82;
  - engine/hand.mjs :1-41; equipment.mjs :45, :113, :128-133; geom.mjs :56-57.
- The six research cards at 9eaa2480: grip, zooms (hand), and the claims cited in six-key-rulings.md.
- #191's lib12-claims.json pattern (hand-views.test.ts :10, :135-147).
- #245: lb1/DESIGN.md :46-65 and the bar lines of the specs (chin_up.mjs:94, hanging_knee_raise.mjs:125, inverted_row.mjs:156, underhand_lat_pulldown.mjs:128, close_grip_pulldown.mjs:16, :34-35, eq/assistMachine.mjs:20, :91).

write_scope:
- New, under tools/plates/library/hands/:
  - hand-bar.mjs and hand-v-handle.mjs, each with its own declarations, written as literals. Neither reads a claims file. Neither imports pairs.mjs or any module that imports it: pairs.mjs loads key modules under top-level await (:64), and such an import never settles (node exits 13). lib7c.test.ts asserts that hand-v-handle's camera words equal pairs.mjs's THUMB_SIDE.
  - words/<key>.json for each drawn key only (lib7-fix.test.ts:181 as amended). Every entry's source names its approved string and D-LIB7c-*.
  - lib7c-claims.mjs, which writes lib7c-claims.json. It imports `refsOf` and `textOf` from claims-extract.mjs, filters OWNER 'LIB-7c', and pins the research commit and each file's sha256.
  - lib7c-claims.json. It is in no module's INPUTS and in no `inputsFor`: no drawing reads it, and LIB-7's claims.json is outside inputsFor too.
  - lib7c-sheet.mjs. It calls `buildSheet({ mods })` on copies of the LIB-7c modules with CLAIMS_TEXT attached from lib7c-claims.json (sheet.mjs:47-49). It adds the labelled references:
    - hang tiles: golden B pull_up/p1 (approved hang), with the flag "hang: no force line (pull_up), contact dot kept (G4)";
    - V-handle tiles: seated_cable_row (approved V-handle).
    - It never passes `calibrate: true`.
    - `--anchors <json>` inserts the supervisor's two golden-B pages unlabelled, as sheet.mjs:83-87 does, and refuses a page that is also shown as a labelled reference. The anchor key goes to calibration-key.json, never to the PR.
  - lib7c-gate.mjs `<browser path>`: runs `lib7Gate(b, { owner: 'LIB-7c' })`. gate.mjs's main is fixed to LIB-7 (:140), and its name does not match KEY_FILE (pairs.mjs:15).
- New tests: tests/library/lib7c.test.ts and tests/library/fixtures/lib7c/**.
- D-LIB7c-SCOPE, other cards' files, these lines only:
  - tests/library/lib7-fix.test.ts:69: `8` → `8 + |D|` as a literal, still an exact sweep, with the comment "+ LIB-7c <|D|> (D-LIB7c-SCOPE)";
  - scripts/screenshot-gate.mjs: one new block `if (gate.runs('LIB-7c')) { … }` before `await gate.done();`;
  - tests/gate-split.test.ts:55: +1, still an exact toBe, with "+ LIB-7c" in its comment;
  - scripts/gate-times.json: one "LIB-7c" entry, measured as 11.1 item 16 (b) says.
- tools/plates/library/hands/DESIGN.md: a new §10 only.
- docs/COACHING-DECISIONS.md: appended D-LIB7c-* entries only.
- The PR body.

reserved_paths:
- Stops 2's frozen files.
- The shared engine (Stops 3); hand-pairs.test.ts; every other line of lib7-fix.test.ts.
- LIB-7b's paths: build-layers-page.mjs, layers-spec.mjs, gen/**, fidelity/**.
- LIB-12's files.
- tools/plates/layers/**, tools/plates/vendor/**, tools/plates/library/render/**.
- registry.mjs, candidate.mjs, qa/**, ci/**, MANIFEST.json, batches/**, scale/**, lb1/**, pilot-a/**, specs/**, howto/**, eq/**.
- tests/howto/**, src/**.
- Shared add-only files (AGENTS.md :73): never edit, move or delete another task's block; when merging main, keep both sides.
- .github/**, package.json, package-lock.json; AGENTS.md, CLAUDE.md, docs/supervisor/**, the plan docs, every research branch.

Do:
1. On 'LIB-7c start':
   - check that the named #193 head is the branch's head (`git ls-remote`);
   - open the branch from it and subscribe to your PR once it exists.
2. Baseline on that head, recorded in the PR:
   - `npm ci`; `npm run check`;
   - the three pins; F4 (22 pages); PK1-PK4;
   - `keysOf().length` = 8;
   - `generate --check` clean;
   - `inputsFor(k)` and the sha256 of each listed file, for each of the 8 keys (the 7c-A10 baseline);
   - `node tools/plates/library/hands/gate.mjs /opt/pw-browsers/chromium` = 22 pages.
3. Design note (DESIGN.md §10). Render each point from uncommitted scratch modules, and settle it with a measured render or fact:
   - (a) modules, variants and handles, each handle against its plate composer (D-LIB7c-HANDLE);
   - (b) the hang variant: hanging_leg_raise's Right pose values, `loadLine: false`, the contact dot kept, 'Base of fingers'; the curled Wrong at the wrist only (never the follow-up 11 slip pose);
   - (c) cameras and palm direction: under and over seen from the side, with the mirror carrying the palm direction and no facing row (D-LIB7c-CAMERA); the V-handle with 'Seen from the thumb side';
   - (d) the claims table per id at 9eaa2480, and the checker (7c-A3);
   - (e) the sheet wrapper, its labelled references, and a list of golden-B pages the supervisor may pick its two anchors from (none of them a labelled reference);
   - (f) every file:line it will touch in other cards' files.
   First push: DESIGN.md §10 only, after the CI-manners check. Post the note with its renders as images, then WAIT (no slot) for 'LIB-7c NOTE RULED'. After two approaches with no new evidence, stop and report.
4. After the ruling: the modules, the words files, lib7c-claims, and 7c-A1..A4. Commit locally.
5. lib7-fix.test.ts:69; then 7c-A6, 7c-A7 and 7c-A10.
6. The gate block and lib7c-gate.mjs (7c-A8). Push Do 4-6 at the next push the 2-hour limit allows.
7. The critic panel:
   - Post the lib7c-sheet normal and `--critic` sheets: 390 px, Silent Black and Paper, as images on the PR.
   - The supervisor runs the panel critic (D-CRITIC-CAL3: 3 fresh Opus critics, 2 rounds, 2 hidden approved anchors through `--anchors`, 2 supervisor plants through `--plant`, never committed). You never see the plants or the anchor key.
   - Valid run and every median ≥ 4: the supervisor posts approvals per id (owner delegation 10-01), for that exact sha (D-PILOTA-R5).
   - One fix round. A key whose median is still below 4 on any item moves its ids to its module's GAPS, with the critic's finding as the reason (D-LIB7c-SHIP). This includes palm direction on a `bar-*-under` key. Then delete its words file, record G and D in §10, and go on.
   - After approval, add the 7c-A5 pins on the approved sha.
   - Post the drawn keys' panels (`pairPanel(k)`) on a sheet for the supervisor's words look (D-LIB7FIX-WORDS). No key ships before it.
8. If #193 has merged: merge origin/main, then re-run 7c-A1..A10.
9. Before READY:
   - merge origin/main;
   - re-run 7c-A1..A10 on that head;
   - run the collision table;
   - re-read your diff against write_scope;
   - post "LIB-7c READY: <sha>".

Acceptance (each with evidence and the mutations that must turn red; list each red line in the PR):
- **7c-A1 Modules and keys (D-LIB7c-KEYS, D-LIB7FIX-KEY).** In tests/library/lib7c.test.ts, by OWNER 'LIB-7c':
  - Exact sweeps: 2 modules (`bar`, `v-handle`), 4 variants, drawn ids ∪ gap ids = exactly the six, and drawn ∩ gaps = ∅.
  - Each drawn key is the ruled one for its ids; each words file matches a key in D.
  - HAND_OF_ID maps exactly the drawn ids.
  - Each drawn id's variant archetype equals census-scope.json's archetype.
  - Gap ids keep their claims checked through a re-draw fixture, as LIB-7's parked push ids are (hand-pairs.test.ts:59-64, :436).
  - LIB-7-FIX's every-key tests stay green unedited (F1, F2's loop, F3, F6 (a), PK1-PK4). lib7-fix.test.ts:69 is exactly 8 + |D|.
  - Mutations, each red:
    - a seventh id added;
    - one of the six in neither IDS nor GAPS;
    - assisted_pull_up's faults differ from hanging_knee_raise's (the loader throws, naming both);
    - hanging_knee_raise's variant archetype set to 'pull';
    - a words file left for a gapped key (:181);
    - :69 left at 8.
- **7c-A2 Handles match the plates (D-LIB7c-HANDLE).** Each value is read from its source file, as hand-pairs.test.ts:449-451 does for the rope:
  - hang and row: 32 mm = pullupBar `d` (equipment.mjs:45);
  - pulldown: 28 mm = latBar `d` (:113);
  - v-handle: 30 mm = 2 × the vHandle grip half-thickness 0.015 m (equipment.mjs:132; geom.mjs:56-57 "half-thickness") = HANDLES['v-handle'].d (engine/hand.mjs:35).
  - G5 (checks.mjs:83) passes in both halves.
  - Mutations, each red: hang at 28 mm; pulldown at 32 mm; v-handle at 32 mm.
- **7c-A3 Claims (D-LIB7c-ORIENT, -CONTACT, -FAULT).**
  - lib7c-claims.json pins research 9eaa2480 and each file's sha256, and every LIB-7c ref resolves. A sha256 of its claims is pinned in the test (as hand-views.test.ts:140).
  - lib7c.test.ts holds hand-pairs.test.ts:300-331 (PHRASES, ANGLED, FACT and claimProblems) verbatim, with one named substitution: `x.OWNER === 'LIB-7'` → `x.OWNER === 'LIB-7c'`. A test reads both files and asserts the texts are equal after that substitution. `neutral-overhead` maps to PHRASES.neutral before the call.
  - LIB-7c's added rules run in a separate function:
    - (i) Each id cites its card's `#grip.type`, and its "first orientation phrase" belongs to the drawn orientation. That phrase is the earliest match in #grip.type among the PHRASES lists (ANGLED counted as 'angled'); a tie or no match is red.
    - (ii) Each element of a variant (thumb, wrist, each fault) cites at least one ref from each drawn id's own card.
    - (iii) A variant's contact is a `ga:` convention of its archetype (hang → ga:hang-base; pull → ga:pull-base).
    - (iv) Every `ga:` ref is in the merged CONVENTIONS.
    - (v) Orientation `neutral` only with a level forearm (Right forearm 90; seated_cable_row :89-91), for LIB-7c's keys only. LIB-12's battle_ropes (neutral, forearm 180, hand-battle-rope.mjs:16, :27) is outside this card; the supervisor raises it with LIB-12.
  - claims.json and claims-extract.mjs stay byte-identical (FROZEN).
  - Mutations, each red:
    - one line of the claimProblems copy changed;
    - chin_up citing #c1 as its orientation ("does not state");
    - inverted_row drawn `under`;
    - the hang variant's contact `ga:pull-base`;
    - assisted_pull_up#c14 dropped from the hang curled claims;
    - one character of lib7c-claims.json's text changed.
- **7c-A4 Drawing rules and close-up QA (D-LIB7c-FAULT, -CAMERA, -HANDLE).**
  - `C.pairProblems(id)` = [] for every drawn id (G1-G9; checks.mjs unedited).
  - The hang Right equals hanging_leg_raise :92-93's pose values, and its SVG has no h-load, no h-load-head and no h-tick, but does have h-contact. The hang Wrong differs from its Right only at the wrist (-30).
  - row, pulldown and v-handle use pullVariant's poses unchanged.
  - Overhead palm, measured from `report.measured` (pairs.mjs:99-108): at forearm 180 the Right handle centre is on the opposite side of the wrist for under than for over, and on the same side for every id of one orientation. No facing row is drawn.
  - Camera: G8 (checks.mjs:143-145) passes, and close_grip_pulldown's aria label starts "Seen from the thumb side".
  - LIB-7 A4's H2 and H7 (hand-pairs.test.ts:476-514) and A2's different-palm ink rule (:222-231) run over the drawn LIB-7c ids. They use LIB-7's vocabulary from approvedSvgs() (:45-51), and the copies are proven equal as in 7c-A3. page.zoomTextsOf is generic over pairSpec (page.mjs:16-19).
  - Mutations, each red:
    - the hang Wrong given the slip pose (contactAt 1.4, fingers open 0.4; golden-B follow-up 11);
    - chin_up's spec checked against bar-hang-over's pages, as :215-221;
    - a force line kept on a hang (G6);
    - the V-handle at orientation `neutral` (rule (v), and the aria line);
    - the H2 failure paths as :487-494;
    - bar-hang-under drawn with bar-hang-over's ink.
- **7c-A5 Critic panel, approvals and pins (D-CRITIC-CAL3; D-PILOTA-R5).**
  - Do 7's valid run, with every median ≥ 4, and the supervisor's approval comment per drawn id for sha S.
  - On S, pin one sha256 over every approved page (`id/fault\0svg\0`, as hand-pairs.test.ts:128-132), and the sha256 of lib7c-sheet.mjs's normal and `--critic` bodies.
  - The pins stay green and unedited on every later head.
  - Mutations, each red:
    - one pose value changed by 1°;
    - one LIB-7c ref text changed in the sheet;
    - an anchor that is also a labelled reference (lib7c-sheet refuses it).
- **7c-A6 Panels and words (D-LIB7FIX-WORDS, -BUDGET).**
  - For each drawn key k, `pairPanel(k)` passes F3: exercise-neutral, every id `hp-<k>-` and unique, `data-zoom="hand"`, and every word approved with its source.
  - Each panel is within `handCeiling('pull-up')` (F6 (a)).
  - The supervisor's words look is recorded.
  - Mutations, each red: an 11-word caption; a caption with no source; a key's words file removed (readWords throws).
- **7c-A7 LIB-7 unchanged (D-LIB7FIX-CARRY).**
  - The three pins are green with their lines unedited, F4 is 22/22, the FROZEN sha256s match, and PK1 is green. PK1 pins no panel bytes, so LIB-7b's wrapper change does not move it.
  - Mutations: the existing pin mutations stay red.
- **7c-A8 Gate block.**
  - `if (gate.runs('LIB-7c'))` calls `lib7Gate(browser, { owner: 'LIB-7c' })`.
  - Self-check: with an empty index the block reports "no hand pair page".
  - Pages = the sum of faults over the drawn ids, on Chromium 141 and Chrome 153 (lib7c-gate.mjs).
  - gate-split.test.ts:55 is +1 (exact), and gate-times.json has its entry.
  - Mutations, each red: 0 pages (the self-check); the guard removed (gate-split).
- **7c-A9 No regression, on the READY head:**
  - `npm run check`;
  - `npm run test:tz` (both zones);
  - `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, detached;
  - lib7c-gate.mjs on both browsers;
  - the diff touches only write_scope (merges apart).
- **7c-A10 No pinned input moves (D-LIB7FIX-PERKEY).**
  - For each of the 8 LIB-7 keys, `inputsFor(k)` and the sha256 of each listed file are equal on this head and on the base head it last merged (#193's head, or origin/main after LIB-7b, which may change panel.mjs). The base is computed in a scratch worktree, and Do 2 records the first pair. A fixed Do 2 baseline would turn red on a correct head after that merge.
  - None of the six ids is a pinned row on this head (ci/manifest.mjs pinnedRows :41-50 on a head with LIB-4c; pilot A holds none of them, #109 pilot-a/plates.json).
  - The esbuild closure of hands/pairs.mjs (ci/manifest.mjs:34-38 on a head with LIB-4c, else esbuild as there) equals the base head's, and holds no file of this card.
  - `git diff <base> --stat` shows no change to pairs.mjs, panel.mjs, zoom.mjs or words/chrome.json.
  - On a head where library pins exist: LIB-4c's C0 is green and MANIFEST.json is unchanged.
  - Mutation, red: a scratch-only edit of words/chrome.json, never committed.
Nothing is loosened:
- No phrase list, tolerance, ceiling, pin, timeout or count is relaxed.
- LIB-7's checker and QA are copied and proven equal.
- lib7-fix.test.ts:69 stays an exact count.
- Every new rule is added with its mutation: first phrase, per-id coverage, archetype conventions, `neutral` only level, handle = plate, overhead palm, and anchor/reference separation.

verification: the PR body maps 7c-A1..A10 to a test or run, with commands and outputs, and lists every mutation with its red line. Evidence counts only for the exact head it ran on. Approvals count only through the 7c-A5 pins.

risk_and_recovery:
- **The hang has no golden-B pure-curl precedent.** The angle is golden B's (hanging_leg_raise :95-99), and the pose is LIB-7's approved pull curl.
  - If the hang fails after one fix round, its three ids go to GAPS. LB1 then ships without chin_up, hanging_knee_raise and assisted_pull_up (tier A) until a ruling. Report it the same day.
- **golden-B follow-up 11.** hanging_leg_raise's Wrong is defective. Never copy its slip pose; it is not a reference here.
- **Overhead under and over** differ only by the mirror. A facing row needs its own ruling. If the palm-direction median stays below 4, D-LIB7c-SHIP applies.
- **The V-handle camera.** If the Do 3 (c) render does not read as the thumb side, stop and report. close_grip_pulldown then stays a gap until a ruling.
- **L0-lib.** This card touches no shared engine file (Stops 3; 7c-A10).
  - If any shared engine change seems needed: stop and report. Such a change stales every pinned row (ci/manifest.mjs:14, :27, :60-62, :69-71), and after 'PILOT A PIN GO' it needs a pin replacement.
- **Merge conflicts.** LIB-7-FIX's later heads and LIB-12 (#191) touch hands/**. Your files are new, so conflicts are limited to lib7-fix.test.ts:69 (LIB-12 re-counts it) and the gate files. Keep both sides.
- **LB1 follow-ups (the supervisor posts on #245; never this card):**
  - D-LIB7c-LB1NOTE;
  - each layers config names `pair:`;
  - each plate's bar equals its key's handle;
  - D-LIB7b-PAGEDUP covers the two `bar-hang-over` ids on LB1's one page;
  - LB1's owner sheet shows the drawn keys' panels in a labelled "New hand pairs" group, with two new views flagged: underhand overhead (mirrored), and the V-handle overhead from the thumb side (D-LIB7c-OWNERLOOK).
- **Two failed tries of one approach:** stop and report.

return:
- the PR number and head sha;
- Do 2's baseline;
- the design-note comment id and the 'LIB-7c NOTE RULED' comment;
- the claims table; G and D;
- the sheet comment ids;
- the critic run id and the approval comment id;
- the 7c-A5 pin values;
- 7c-A1..A10 outputs;
- every mutation with its red line;
- check, test:tz, gate and lib7c-gate output on the final head.

Resume rule: when you are WAITING or parked, you resume only on the supervisor's exact words 'LIB-7c resume' or 'LIB-7c NOTE RULED', sent to your session or posted on your PR. A prerequisite post alone is not a resume.

Collision check (card time; re-run at start against every open PR):
| Path in write_scope | Open PRs that touch it at card time | Effect |
|---|---|---|
| hands/hand-bar.mjs, hand-v-handle.mjs, words/<LIB-7c key>.json, lib7c-* | none. LIB-12's keys and ids do not overlap (#191: no `bar-` or `v-handle-` prefix, none of the six ids). | none |
| tests/library/lib7-fix.test.ts:69 | #193 (owner of the file) | one line; LIB-12 re-counts |
| scripts/screenshot-gate.mjs, gate-split.test.ts:55, gate-times.json | #191 and every card that adds a block | own guarded block; re-count :55 at each main merge |
| hands/DESIGN.md | #193 §8, LIB-7b §9, #191 | new §10 only |
| docs/COACHING-DECISIONS.md | most open PRs | append-only; keep both sides |

Recheck (critic, 2026-10-19, against #193 da65b13a, #246 f5174db1, #109 28853e71, #191 0d268a71; with lib-7-fix-amend-perkey.md as rechecked):
- recheck N1: applied. The deadline now reads "before LB1's pin commit pins any of the six ids". Keying a pinned id adds `inputsFor(key)` to its MANIFEST set (ci/manifest.mjs:69-71), so LB1 pins only on a head that holds LIB-7c. 7c-A10 asserts that none of the six is pinned (pilot A holds none; checked on #109's plates.json).
- recheck N2: applied. 7c-A10 compares against the base head LIB-7c last merged, not a fixed Do 2 baseline. LIB-7b (6b) may change panel.mjs, which is in every key's inputs through pairs.mjs's closure. After that main merge, a fixed baseline would be red on a correct head.
- recheck N3: applied. 7c-A7 reads "PK1 green", since PK1 no longer pins the panel sha256s (amendment recheck N2).
- recheck N4: applied. Key modules never import pairs.mjs: under the top-level await at :64, the import never settles (exit 13, reproduced). The camera words are a literal, checked against THUMB_SIDE.
- recheck N5: applied. Rule (v) "neutral only with a level forearm" is scoped to LIB-7c's keys. LIB-12's battle_ropes draws neutral at forearm 180 (hand-battle-rope.mjs:16, :27).
- Checked, no change needed: lib-7c-critic.md's H1, M1-M7 and Lows 1-10 are each applied as written (outcome counts and 7c-A1/A8 counts; Do 3/6 and the 'NOTE RULED' resume; the claimProblems text copy; the H2/H7/ink rule; the hang line, dot and note; --anchors; no facing row plus SHIP; the lane place; first phrase; measured palm; CARRY reading; JSON markers; lib7c-gate.mjs; the L0 line; the fallback handoff; renumbering; the v-handle composer value; the sources). Nothing is loosened.
