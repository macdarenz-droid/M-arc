# LIB-5 design note (Do 1)

Card LIB-5 (shared layer modules). Written on `claude/lib-5-shared-layers` = main `49a2853` + merge of LIB-2b `ccf0250`. Reading only: nothing was built, run or tested. Where a number needs a measurement, the method is given and Do 2 runs it. Do 8 rewrites this file as built.

Heads read: main `49a2853`; LIB-2b `ccf0250`; research `claude/libht-research` `9dbc7e0`; plan `claude/howto-options` `4a9fd86`; lib4-cards `19a6017`; LIB-4a #233 `66f5cef`; LIB-4b #232 `f1df4a7` (moved since `379cdf4`); LIB-7 #193 `55e91e9`; LIB-12 #191 `0d268a7`. LIB-4c has no branch yet.

Open points for the supervisor are marked **OPEN-n** and listed at the end.

## a. Where RED_FLAG_BACK lives

- **Source:** `tools/plates/library/shared/back-box.mjs` (the Do 4 placeholder; Do 9 makes it read the answered box from `docs/research/howto/shared/back-pain-box.json`).
- **App module:** `src/howto/red-flag-back.ts`, generated (never hand-edited), written by `tools/plates/gen/content.mjs` next to `archetypes.ts`, with the same header style:
  `export const RED_FLAG_BACK: RedFlagBlock = {...};`.
  - Not in `archetypes.ts`: HT5-A5 keeps that file equal to golden B's `shared.mjs`.
  - Not under `src/howto/generated/`: six tests list that folder by prefix (`ht-`, `hand-`, `feel-`, `posture-`), so a file outside it changes none of them. `generate.test.ts:101` covers only `generated/`.
  - The output exists only from Do 9. Before Do 9 the generator writes nothing new.
- **Wiring (Do 9):** `Risks.tsx` imports it and adds `back: RED_FLAG_BACK` to `FLAG`; `content-types.ts` adds `'back'` to `RiskJoint`.
- **Pinned tests it changes (Do 9 only):**
  - `tests/howto/library-core.test.ts:242`: `60 + 5 * LIBRARY.length + …` becomes `61 + …`, and the title "writes 60 files" becomes "writes 61 files". This is the one line the card allows.
  - L2-A3 (`:34`, 54 fingerprinted bodies) is unchanged: the new file is not in `fixtures/generated-bodies.json`.
  - **OPEN-1:** `tests/howto/sections-risks.test.ts:29` declares `FLAG: Readonly<Record<RiskJoint, …>>` with the four joints. `tsconfig.json` includes `tests`, so adding `'back'` to `RiskJoint` makes `npm run typecheck` red there until that map gains `back: RED_FLAG_BACK` (plus its import). That file is HT-9's and is not in LIB-5's write_scope. Proposal: allow that one add-only entry and import in Do 9. No assertion changes.
  - **OPEN-2:** LIB-4b's `fidelity/twins/ht9.mjs` (on `f1df4a7`) builds its bundle entry at `:28` from `ht-*.ts` plus `export * from archetypes.ts`, and its `FLAG` at `:29`. `C.RED_FLAG_BACK` is undefined unless `:28` also re-exports `src/howto/red-flag-back.ts`. So Do 9 needs `:28` and `:29`, not just `:29`. Proposal: allow both lines.
- **Chunk measurement (Do 2):**
  - Budget: `tests/howto/budgets.json`, entry `HowToSheet-*.js`, rawMax 30,884 B, gzMax 10,728 B (set by HT-9; measured then at 28,076 / 9,752). No budget is raised.
  - Method: create a scratch worktree with `git worktree add <scratchpad>/lib5-chunk HEAD` and symlink `node_modules`.
    - Run `npm run build` there.
    - Read `dist/assets/HowToSheet-<hash>.js`: raw = byte length, gz = `zlib.gzipSync(bytes).length`. This matches the gate's `sizeOf` (`scripts/screenshot-gate.mjs:6425`).
    - Then add, in the worktree only, `src/howto/red-flag-back.ts` holding the stand-in, the `Risks.tsx` entry, `RiskJoint 'back'` and the sections-risks map line, so it compiles. Rebuild and measure again.
    - Confirm the stand-in string is inside the HowToSheet chunk (grep the built file). If it lands elsewhere, report which chunk.
  - Stand-in (30 words by c7's count; scratch only, never committed or pushed): name "Spine pain"; now "Alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima? Get it checked today."; doctor "Mike november oscar papa quebec romeo sierra tango uniform? See a doctor."
  - Report before and after, raw and gz, with the headroom left. Over budget means stop and report (risk_and_recovery).

## b. The 30-word reach

Every place the box is made or shown, and the test that covers it. Each test uses:
- golden B's `RED_FLAG_BOX_MAX_WORDS` and c7's `LIMITS.redFlagBoxWords`, both imported, never copied;
- c7's `words()`;
- the "today" and "doctor" rules (`c7.ts:300-301`);
- the contact patterns.

c7's `words` is not exported (`c7.ts:116`, `const`), and c7.ts is read-only. So the tests reach it through `checkC7(content)` on a real sheet with `redFlag` replaced by the box under test. That one call runs c7's `words()`, `LIMITS.redFlagBoxWords`, the today/doctor rules and the C7 bans, all unedited. Golden B's own count runs through copy-lint's exported `words` (`copy-lint.mjs:177`). The contact patterns come from `tests/guards/no-contacts.ts` (`CONTACT_RE`, `SOURCE_RE`, `SOURCE_CS_RE`, `SAFETY_LINE_RE`). A test asserts `RED_FLAG_BOX_MAX_WORDS === LIMITS.redFlagBoxWords === 30`.

| Placement | Test |
|---|---|
| 1. `tools/plates/library/shared/back-box.mjs` (source of the text) | `library-shared.test.ts` "back box in reach": the module's block runs through checkC7 (clone of the pull-up's generated content with `redFlag` = box; the test asserts the clone's `C7: redFlag…` lines are `[]` and that a 31-word box adds one, so the sheet's own 450-word budget cannot mask or fake a result), copy-lint `words(name+now+doctor) <= RED_FLAG_BOX_MAX_WORDS`, and every contact pattern on each line. Before Do 9 it asserts the placeholder throws instead (S4-P). |
| 2. The generator (`gen/content.mjs`, library lint, Do 5) | The lint's box rule imports the same constants and calls the same check, so `npm run generate` throws on a 31-word box. Covered by `library-lint.test.ts` with a scratch root. |
| 3. `src/howto/red-flag-back.ts` (generated, Do 9) | `library-shared.test.ts`: the module equals the source block byte for byte, and the same checks run on the imported `RED_FLAG_BACK`. |
| 4. `Risks.tsx` `FLAG.back` (render, Do 9) | S5: `renderRisks` on a lib5 fixture row with `riskFlags: ['back']` emits `<pre>-redflag-back` with exactly name, now and doctor of placement 3. That proves the render shows nothing outside the checked text. |
| 5. Any sheet's own `redFlag` field (ht-<slug>.ts embeds `content.redFlag`) | The library-lint sweep runs checkC7 on every shipped row, as `content-gen.test.ts:147` does for the 8, and its `redFlag` is one of the checked blocks. A sheet may set `redFlag` to `RED_FLAG_BACK` only through the import, which keeps it inside 1-3. |

`lintShared` covers only `RED_FLAG_BLOCKS`' 4 joints. LIB-5 never edits it (golden B is locked). Instead, placement 1's test applies its per-box rules to the back box using the exported constants: name opener, count, today/doctor, `claim.sources` includes `nhs-back`, and the LR-23 patterns. Under Stops 3 no placement exists without these checks, and no limit anywhere in `tools/plates/library/lint/**` differs from the imported 30 (a test greps the folder for box limits).

## c. The fail-closed placeholder (Do 4, S4-P)

- **Module:** `tools/plates/library/shared/back-box.mjs`.
  - `export const BACK_BOX_WAITS = 'LIB-5: back box waits for owner decision 6 (plan 8 item 6)';`
  - `export function backBox() { throw new Error(BACK_BOX_WAITS); }`
  - `export function refuseBack(id, riskFlags) { if (riskFlags?.includes('back')) throw new Error(`${id}: ${BACK_BOX_WAITS}`); }`
  - No box text. It never imports or reads `shared/back-pain-box.json`.
- **Exact throw:** `LIB-5: back box waits for owner decision 6 (plan 8 item 6)`. The generator's message is `<id>: ` plus that text.
- **Call site, one:** `gen/content.mjs` `outputs()`, in the per-id loop right after `loadContent(id)`: `refuseBack(id, content.riskFlags)`. Every shipped row, golden or library, passes through that loop, and nothing is written before it ends. `gen/ids.mjs` gets no call: it never reads `riskFlags`.
- **S4-P tests** (`library-shared.test.ts`):
  1. The module source contains none of the three box values and no `RedFlagBlock` literal; `backBox()` throws the exact text.
  2. None of `box.name.text`, `box.now.text`, `box.doctor.text` of the copied `shared/back-pain-box.json` appears, case-sensitive and as one whole string, in any file under `src/**` or in `dist/` after build. The dist half runs in the gate job, where `dist` exists. Recorded on `49a2853` and on this branch with `git grep -nF`: 0 hits for all three.
  3. A lib5 scratch root (fixture tree as in LIB-2b E1) with one row whose How-to has `riskFlags: ['wrist', 'back']`: the generator throws `lib_<scratch>: LIB-5: back box waits for owner decision 6 (plan 8 item 6)`.
  4. `RiskJoint` has no `'back'`. This is a type-level test plus a read of `content-types.ts`.
  5. Guard: if `back-box.mjs` holds box text (a non-throwing `backBox`), then `COACHING-DECISIONS.md` holds `D-LIB5-BACKBOX`, and the text equals the box of a `shared/back-pain-box.json` whose `status` is not `'draft'`.
- **Mutations:** the draft text pasted into the module → 1 and 5 red; the throw removed → 3 red (the row generates); the doctor value added as a string under `src/` → 2 red.

## d. Machine fields (D-LIB9-CARDFIELDS)

At the top level of `docs/research/howto/cards/<card id>.json`, exactly as `researchOf` (candidate.mjs:44-48), H6 (`qa/node.mjs:151-176`) and F7 (`:293`) read them:
- `plateFacts: [{ kind: 'angle'|'contact'|'height', joint|landmark, pose?, deg|m, measure?, claim }]`. H6 ignores `claim`. The validator requires it, and it must resolve to a card claim.
- `tempo: [{ phase, s, move? }]`. H6 compares it to `spec.tempo` with `JSON.stringify`, so no `claim` key can sit inside the array: one extra key turns H6.tempo red. Provenance therefore stays outside the array. Each `s` must equal the card's verified `plate.tempo.up`, `.down` or `.pause` (cited by `plate.tempo.claim`) under the phase mapping LIB-9a's note rules, or a constant that note names (for example Rest). The validator checks this against that ruled mapping. Until LIB-9a's mapping is posted, Do 3 waits as the card says.
- `topFault`: a string, the plate's Mistake key that F7 compares to `mistakeFault`. Its claim is the card's `plate.mistake.claim`, and the validator requires that claim to exist. **OPEN-3:** the key strings (`hips`, `kick`, `swing`, `lift`, `round`, `shrug`) are the plates' own tell keys, so the string itself can only come from the plate vocabulary. Proposal: the verifier checks that the claim cited by `plate.mistake.claim` states the fault the key names, and the key spelling is accepted as a drawing label, not a research value. Otherwise every topFault "comes from the plate under test".
- Nothing else in a card changes. The CARD-V2 "Machine fields" section states the above word for word.
- Paths: `docs/research/howto/cards/<card id>.json` and `docs/research/howto/quotes/<card id>.json`, card id = lib id without `lib_` (CARD-V2 rule; same folder as the 109 research cards). No reason against the D-LIB9-CARDFIELDS path was found. They do not clash with main's generated `docs/research/howto/lib_<id>.json` manifests.

## e. Stamps

- **contentHash input:** exactly c15's `contentHash(content, plate)` = `sha256(JSON.stringify({ content, plate }))`. The two values:
  - `content` = `loadContent(id).content` from `gen/content.mjs`: the full normalized HowToContent minus `plate`. This is what the content checks already run on (C1-C8, C16), so one value serves the generator gate and the vitest sweep.
  - `plate` = the row's approved plate entry `fragments` (the 4 sha256s of the normal and mistake svg and overlay, from GOLDEN.json for the 8 and from the batch golden file for a library row). These are drawing parameters already pinned, and need no render.
- **The 8's machine cards do not enter it.** They are research data and never shown. The How-to's `research: { card, rev }` pointer, which is in `content`, stays byte-identical (S10). Their correctness is pinned by S12 instead. A card fix does not stale a stamp, but it does re-run H6 and F7.
- **Entry shape** (content.md 3.5): `{ scope, hash, date, fetcher, critic, safety?, reviewer, findings, open: 0 }`.
  - For the 8: `scope` = lib id (none uses `extends`). `fetcher`, `critic` and `reviewer` cite the S-2 record (`tools/plates/layers/README.md:27-45`, "two independent fresh-context verifiers … a recheck").
  - `approvedBy` is left out until the "stamps (O5)" ruling (lib4-cards 11.1 item 7 keeps `'owner'` until then).
- **c15.ts unedited:** yes. It reads only `scope` and `hash`; the extra keys are JSON and its `ReviewEntry` type is not applied to the parsed file. Once `entries` is non-empty, `checkC15` is strict as written.

## f. The stamp gate

- **One location:** `gen/content.mjs` `outputs()`, after the per-id loop and before any `out.push` is returned: `const bad = await stampProblems(ids); if (bad.length) throw new Error(...)`. The generator writes all or nothing, so an unstamped shipped row leaves no `ids.ts` button. It goes in the same commit as the 8's approved stamps (Do 6), or the 8 themselves would throw.
- **Fixtures it would break,** since each generates shipped scratch rows with no stamp:
  - LIB-2b E1 (`tests/howto/fixtures/lib2b/fixture.mjs`, `lib_cable_lateral_raise`);
  - LIB-4a's synthetic trees at N = 22 and 153 (`scale/write-ids.mjs`, via `synthetic.mjs`);
  - LIB-4b B5 (`fidelity/fixture.mjs`, `lib_underhand_lat_pulldown`, `lib_chest_supported_row`, `lib_cable_chest_press`);
  - LIB-4c C11-C14 (`ci/scratch.mjs`, not pushed yet).
  Each gets one `writeScratchStamps(root, ids)` call after its tree is staged and before it runs the generator (Do 7, once on main).
- **Scratch stamps:** entries carry `scratch: true` and are written only into the scratch root's `docs/research/howto/reviews.json`.
  - `writeScratchStamps` refuses a root that holds `.git` (the real tree; scratch copies are `cpSync`'d subsets with no `.git`), and refuses `resolve(root) === resolve(ROOT)`.
  - S8 fails if the committed `reviews.json` holds any `scratch` entry.
- **Fixed signatures** (`tools/plates/library/research/stamps.mjs`):
  - `contentHashOf(id, { root = ROOT } = {}) -> Promise<string>`: loads `root`'s own `gen/content.mjs` and the plate entry. It equals `contentHash(content, plate)` from c15.ts (a test checks this on the 8).
  - `stampProblems(ids, { root = ROOT, reviews = readReviews(root) } = {}) -> Promise<string[]>`: one line per id, `LIB-5 stamp: <id>: no reviews.json entry for scope <scope> hash <first 12>…`.
  - `writeScratchStamps(root, ids, { date = '2026-01-01' } = {}) -> Promise<Array<{ scope, hash }>>`.

## g. Shared modules (`tools/plates/library/shared/`)

One loader, `card.mjs`: `sharedCard(key)` reads `docs/research/howto/shared/<key>.json`. Each module projects card fields into the authoring shape, and every exported string is `{ text, claim }` with the card's own claim ref (string or list), never retyped. S6 checks that each value `===` its card field and that each ref resolves to a claim in that card.

| Module | Exports | From card | Lint each string passes |
|---|---|---|---|
| `hands.mjs` | `PALM_FLAT`, `CURL`, `ROPE`, `CUPPED_THUMB` | palm-flat, curl, rope-rule, cupped-thumb: `gripLine`, `cue`, `thumbRule`, `wrist`, `rightPose`, `faults[{key,label,what}]`, palm-flat `soreWrist`, `fingers`, `contactPoint`, curl `widthNote`, rope `grip`/`handContact`, cupped `alternative`/`handContact` | gripLine: lead (≤22 words, ≤2 sentences); cue: ≤6; fault label: label (1-3); other prose: sentence ≤15; all: BANNED, LR-23 patterns, medical bans |
| `implements.mjs` | `BATTLE_ROPES`, `JUMP_ROPE`, `KETTLEBELL_SWING`, `MEDICINE_BALL_SLAM`, `WALL_BALL` | the 5 implement cards: `gripLine`, `cue`, `contactPoint`, `thumbRule`, `wrist`, `rightPose`, `faults`, `handRisks[]` | as hands; `handRisks[]`: risk (≤14) |
| `moves.mjs` | `GET_IN_OUT`, `SELECTOR_PIN`, `FOOT_BAR`, `UNRACK_RERACK`, `DUMBBELL_KICKUP` | `steps[]` / `variants.<v>.steps[]` `{kind,text}`, `postureArchetype` (unrack, kick-up), variant `appliesTo` | setup step ≤12 words, ≤5 steps per variant; posture right/wrong: caption ≤10 |
| `exemptions.mjs` | `FRONT_RACK`, `WRIST_CURL` | `exempts`, `reason`, `replacementRule`, `faults` | prose sentence ≤15; label 1-3 |
| `checkpoints.mjs` | `FLOOR_BODY`, `PRONE` | `defaultCheckpoints[]` / `checkpoints[]` `{key,label,detail,appliesTo}`, `defaultCrop`, `prone` | label 1-3; detail: caption ≤10 |
| `back-box.mjs` | placeholder (c) | none until Do 9 | (b) |

Not projected (research data under LR-28): `appliesToWhy`, `loadAxis`, `thumbMode`, `byRule`, `byInference`, `notFor`, `gaps`, `notes`. The research-only claims no line cites (back c3 and c5, cupped c4, kick-up c5, floor c5, battle-ropes c5, kettlebell c6, palm-flat c7) stay in the cards.

**Fault and pair keys against LIB-7 (#193 `55e91e9`) and LIB-12 (#191 `0d268a7`):**

| Card fault (key: label) | LIB-7 / LIB-12 hand key (label) | Match |
|---|---|---|
| curl `wrist-curl-cheat`: "Wrist curled" | LIB-7 `radial-rules.mjs:20` `curled` ("Wrist curled") | key differs, label same |
| curl `bent-back-bottom`: "Wrist bent back" | LIB-7 `:22` `bent-back` ("Wrist bent back") | key differs, label same |
| rope-rule `rope-wrist-curl`: "Wrists curl" | LIB-7 `hand-rope.mjs:22` `curled` ("Wrist curled") | key and label differ |
| palm-flat `hand-ahead`: "Hands too far forward" | LIB-12 `hand-palm-flat.mjs:20` `hand-ahead` ("Hand ahead") | key same, label differs; card label is 4 words (label max 3) |
| palm-flat `cupped-palm`: "Palm cupped" | LIB-12 `:18` `cupped-palm` ("Palm cupped") | yes |
| palm-flat `hands-rotated`: "Hands turned" | none | n/a |
| battle-ropes `death-grip`: "Too tight" | LIB-12 `hand-battle-rope.mjs:21` `death-grip` ("Too tight") | yes |
| battle-ropes `end-grip`: "Hand at end" | none | n/a |
| wall-ball `side-sandwich`: "Hands on sides" | LIB-12 `hand-ball-contact.mjs:18` `side-sandwich` ("Hands on sides") | yes |
| front-rack `bar-off-shoulders`: "Bar on hands" | LIB-12 `hand-front-rack.mjs:19` (same) | yes |
| jump-rope `white-knuckle`, kettlebell `palm-grip`/`crush-grip`, wrist-curl `grip-opening` | none (LIB-12 parks these ids as GAPS) | n/a |

Family consistency ("the same `fault.key` has one label everywhere") would be red on palm-flat `hand-ahead`. The curl and rope keys differ by name, so the rule cannot see them, but they are the same fault under two keys. **OPEN-4:** LIB-5 exports the cards' keys and labels unchanged and renames nothing (research is copied byte for byte). Proposal: LIB-7 and LIB-12 map their keys to the card keys, or the supervisor rules a key alias table in the lint; the 4-word palm-flat label goes back to research. No rule is weakened meanwhile.

## h. Lint dry run over the 8 (method; Do 2 runs it)

A scratch script in the scratchpad (never committed) imports the rule functions as stated below. It walks each of the 8's `tools/plates/layers/exercises/*.howto.mjs` with golden B's exported `copyFields(M)` (every kind except `sourceNote`, as C19 does), plus every string in the shared modules (g) and the B5/E1 scratch rows.

| Rule | Strings read | Hit reported as |
|---|---|---|
| Medical-claim bans: `/\bcure[sd]?\b\|\bheal(?:s\|ed\|ing)?\b\|\btreats?\b\|\brehab\w*\|\bdiagnos\w*\|\binjury-proof\b\|\bprevents? injur\w*/i` | all copyFields text; shared strings | `rule \| id \| path \| match \| full text` |
| Variant line: required when `exercises.json` `equipment` contains `/`; a caption-class line ≤10 words | the row's How-to (field: OPEN-5) | `variant \| id \| equipment` |
| FIX_VERBS closed: a feel-row fix's first word is in golden B's `FIX_VERBS` (imported) | `feel.rows[].fix` | `fix-verb \| id \| path \| first word` |
| Family consistency: one label per `fault.key` | `handling.faults[]` of the 8, the shared modules, LIB-7 and LIB-12 hand faults | `family \| key \| label A (where) \| label B (where)` |
| RED_FLAG_ROWS per stamped id: rows keep key and flag | `feel.rows[].redFlag` etc. vs golden B `RED_FLAG_ROWS` (the 8) and `lint/red-flag-rows.json` (library) | `rows \| id \| key \| want \| got` |

Known before running, from reading:
- `lib_lat_pulldown` ("Cable / Machine") and `lib_leg_press` ("Plate-Loaded / Machine") have `/`. They are approved golden B, so they are exempt by name only if the supervisor rules it.
- B5's `lib_underhand_lat_pulldown` is also "Cable / Machine".
- Palm-flat's `hand-ahead` label hits family consistency, and the length cap.

A hit on approved golden-B copy is named and needs a ruling (risk_and_recovery).

**OPEN-5:** HowToContent has no variant-line field (`content-types.ts:317` `copy` = setupLine, mistakeLine, cueLine?, gripLine?), and src is reserved until Do 9. If the generator enforced the rule on shipped rows, it would throw on B5 (`lib_underhand_lat_pulldown`) and on every two-kind LB1 row, and no field exists to hold the line. Proposal: LIB-5 commits the rule, its fixtures and its vitest. Generator enforcement starts with the card that adds the shown field (a src card). The rule is not weakened, only placed where it can bite.

Family consistency for D/T children ("an inherited string `===` the parent's") needs a map from card `inherit[]` fields (for example `grip.thumb`) to sheet paths, and no shipped row is a child yet. **OPEN-6:** proposal: commit rule (a), one label per key, now, and add the child comparator with LIB-9a's first difference card under a map ruled there.

## i. Shared risk lines are not written

Plan 4.1 and content.md 2.1 list "bar over the face", "breath-holding" and "jump landing". None of the 19 shared cards or their quotes sources them (searched: the only "bar over" is unrack-rerack's "move the bar over your shoulders"; there is no breath or landing text). Under LR-3 nothing unsourced is written, so no shared risk line ships in LIB-5. They stay gaps for research.

## j. wordCap is data

`shared/back-pain-box.json` `box.words` (50) and `box.wordCap.limit` (50) are the only numeric limit fields in the 19 cards. The validator and the lint never read `wordCap` or `words`. S2 includes a test that a card with `wordCap.limit: 999` and a 31-word box is still red under the imported 30.

## k. The 8's machine cards (Do 3 b)

Paths: `docs/research/howto/cards/<card id>.json` and `quotes/<card id>.json`. Values: **no verified quote in the repo** for any of them. `9dbc7e0` has no card for any of the 8, the How-tos cite `grip/research/<slug>.json` (not in this repo), and research for the 8 started on `claude/libht-research-the8` at 20:37 UTC with nothing pushed.

The column "H6/F7 compare against" shows what each value must match on the approved plate, read from main, so a miss can be caught. It is never a source for the value.

| id (card id) | plateFacts | tempo | topFault | H6/F7 compare against (main) |
|---|---|---|---|---|
| lib_dumbbell_lateral_raise (`dumbbell_lateral_raise`) | no verified quote in the repo (H6 stops at `not-engine`; no spec) | no verified quote in the repo (not read by H6) | no verified quote in the repo | firstKey `shrug`; keeps `H6:not-engine` |
| lib_barbell_back_squat (`barbell_back_squat`) | no verified quote in the repo | no verified quote in the repo | no verified quote in the repo | measure knee.r expect 125; tempo `[Lower 2 move, Drive up 1 move, Brace 1]`; firstKey `hips` |
| lib_pull_up (`pull_up`) | no verified quote in the repo | no verified quote in the repo | no verified quote in the repo | measure elbow.r expect 146.5; tempo `[Pull 1 move, Hold 0.5, Lower 2 move, Rest 0.5]`; firstKey `kick` |
| lib_hanging_leg_raise (`hanging_leg_raise`) | no verified quote in the repo | no verified quote in the repo | no verified quote in the repo | measure hip.r expect 90; tempo `[Lift 1.5 move, Hold 0.5, Lower 2 move, Rest 1]`; firstKey `swing` |
| lib_lat_pulldown (`lat_pulldown`) | no verified quote in the repo | no verified quote in the repo | no verified quote in the repo | measure hip.r expect 15; tempo `[Pull 1 move, Hold 0.5, Return 2 move, Rest 0.5]`; firstKey `swing` |
| lib_seated_cable_row (`seated_cable_row`) | no verified quote in the repo | no verified quote in the repo | no verified quote in the repo | measure shoulder.r expect 87; tempo `[Pull 1 move, Hold 1, Return 2 move, Rest 0.5]`; firstKey `swing` |
| lib_leg_press (`leg_press`) | no verified quote in the repo | no verified quote in the repo | no verified quote in the repo | measure knee.r expect 90; tempo `[Lower 2 move, Pause 0.5, Press 1 move, Rest 0.5]`; firstKey `lift` |
| lib_machine_chest_press (`machine_chest_press`) | no verified quote in the repo | no verified quote in the repo | no verified quote in the repo | no `measure.expect` (facts via `angles` or contacts); tempo `[Press 1 move, Hold 0.3, Return 1.5 move, Rest 0.5]`; firstKey `round` |

Risk named: H6 compares tempo exactly. Research seconds that differ from a plate's (for example Hold 0.3 or Lift 1.5) mean stop and report for that id, never change either side.

**qa/approved.mjs lines (Do 3 b commit 2), and nothing else in that file:**
- Imports: add `join` (from `node:path`) and `ROOT` (from `../../golden.mjs`, which exports it at `:15`).
- New, after `APPROVED_IDS`:
  - `/** D-LIB5-CARDS8: the 8 whose machine cards are verified (CARD FIELDS VERIFIED @ <sha>). */ export const CARDS_8 = [<verified ids>];`
  - `const cardResearch = id => { const c = JSON.parse(readFileSync(join(ROOT, 'docs/research/howto/cards', `${id.slice(4)}.json`), 'utf8')); return Object.fromEntries(['plateFacts', 'tempo', 'topFault'].filter(k => k in c).map(k => [k, c[k]])); };`
  - This is the same three-key projection as `researchOf`. It is inlined because `candidate.mjs` imports this file, so importing back would make a cycle.
- `:20`: `research: null` → `research: CARDS_8.includes(LIB_OF[p.chromeId]) ? cardResearch(LIB_OF[p.chromeId]) : null`, and `mistakeFault: null` → `mistakeFault: CARDS_8.includes(LIB_OF[p.chromeId]) ? p.mistake.firstKey : null`. That is `candidate.mjs:84`'s rule for library rows.
- With the same commit: in `exemptions.json`, remove only those ids' `H6:no-card` and `F7`; the two clone inputs in `library-qa.test.ts:65,70` gain `research: null, mistakeFault: null`; append D-LIB5-CARDS8.

## Open points for the supervisor

1. **OPEN-1:** Do 9 needs one add-only `back` entry and import in `tests/howto/sections-risks.test.ts:29` (HT-9's file), or typecheck is red. Not in write_scope.
2. **OPEN-2:** the ht9 twin needs `:28` (re-export `src/howto/red-flag-back.ts`) as well as `:29`.
3. **OPEN-3:** where a topFault key comes from (d).
4. **OPEN-4:** curl and rope fault keys differ from LIB-7's; palm-flat `hand-ahead` label differs from LIB-12's and is over the label cap (g).
5. **OPEN-5:** the variant-line rule has no shown field; generator enforcement would break B5 and two-kind LB1 rows (h).
6. **OPEN-6:** the child-inheritance comparator waits for a ruled field map (h).
7. lat_pulldown and leg_press need a by-name variant exemption ruling, or a ruling that OPEN-5 defers it.
8. Stamps wait for the "stamps (O5)" ruling (approvedBy). The stamp gate lands in the same commit as the 8's stamps.
