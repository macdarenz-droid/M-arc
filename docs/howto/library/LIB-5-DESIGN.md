# LIB-5 design note (Do 1, revised under lib4-cards.md section 14)

Card LIB-5 (shared layer modules). Revised on `claude/lib-5-shared-layers` at the merge of main `72c94fc` (merge commit `5e24b45`). This is reading and writing only: nothing was built, run or tested. Where a number needs a measurement, the method is given and Do 2 runs it. Do 8 rewrites this file as built.

**Rulings applied:** lib4-cards.md section 14 (D-LIB5-NOTE) on `claude/sup-lib4-cards` @ `a0e5d69`, and the amended card `docs/supervisor/verify/lib-5-card.md` on the same head. Section 14 wins over the card and section 12, and item 13 as read at `19a6017` is superseded. Note fixes N1-N16 are applied and marked [Nn].

**Heads re-read [N16]:**
- main `72c94fc`. Since `2d1bbf3` only BUG-41's files, the handover, gate-times.json, gate-split.test.ts and screenshot-gate.mjs changed.
- LIB-4a #233 `0b2d3c1`. Since `aaff25e` only COACHING-DECISIONS.md and main merges changed; `git diff aaff25e 0b2d3c1 -- tools tests/howto` is empty.
- LIB-4b #232 `f1df4a7`; LIB-4c `claude/lib-4c-library-ci` `108eb5c`; LIB-9a #245 `6285b4f`; LIB-6 #181 `9b8f76e`; LIB-7 #193 `55e91e9`; LIB-12 #191 `0d268a7`.
- Research `9dbc7e0`, until the supervisor names the merged head.
- `claude/libht-research-the8` `e6381fa`: unverified, never a source on its own.

Line numbers below are on main `72c94fc` unless another sha is named. Every line a ruling names is also found by its quoted text.

## Ruling ids for the old open points [N13]

| Old point | Ruling |
|---|---|
| OPEN-1 (sections-risks.test.ts) | D-LIB5-RISKSTEST |
| OPEN-2 (ht9 twin) | D-LIB5-TWIN |
| OPEN-3 (topFault source) | D-LIB5-TOPFAULT |
| OPEN-4 (fault keys and labels) | D-LIB5-FAULTKEYS |
| OPEN-5 (variant-line field) | D-LIB5-VARIANT |
| OPEN-6 (child inheritance) | D-LIB5-FAMILY |
| item 7 (lat_pulldown, leg_press) | D-LIB5-VARIANT8 |
| item 8 (stamps) | D-LIB5-STAMPS |
| new: one refusal point | D-LIB5-GATE |
| new: bundle check | D-LIB5-BUNDLE |
| new: fixtures | D-LIB5-FIXTURE |
| new: the 8's tempo map | D-LIB5-TEMPO8 |
| new: layers-page placement | D-LIB5-PAGE |
| new: scratch stamps | D-LIB5-SCRATCH |
| new: shown or data split | D-LIB5-SPLIT |
| new: visible total | D-LIB5-WORDS |
| new: Do 9 count lines | D-LIB5-COUNTS |
| new: 30-word reach mechanism | D-LIB5-REACH |

## a. Where RED_FLAG_BACK lives

- **Source:** `tools/plates/library/shared/back-box.mjs`, exporting `BACK_BOX_WAITS`, `backBox()` and `refuseBack(id, riskFlags)`. `backBox()` keeps its name and signature in Do 9, because LIB-6-PM's page patch calls it (D-LIB5-PAGE).
- **App module:** `src/howto/red-flag-back.ts`, exporting `RED_FLAG_BACK: RedFlagBlock`.
  - It is written only by the new plugin `tools/plates/gen/library-gate.mjs` (D-LIB5-GATE), and only from Do 9. Before Do 9 the plugin's `outputs()` returns `[]`.
  - Location reason [N15]: `tools/plates/generate.mjs:20` reads `export const GENERATED_DIRS = ['src/howto', 'src/slices/howto/css', 'tools/plates/library'];`, so `generate --check` covers the file.
  - It is not under `src/howto/generated/`, so the prefix listings there are untouched. It is not in `archetypes.ts`, which HT5-A5 (`content-gen.test.ts:207`) keeps equal to golden B.
- **Do 9 module shape [N14]:** `backBox()` returns `{ name: box.name.text, now: box.now.text, doctor: box.doctor.text, claim }`. `claim` comes from `box.boxClaim` (`{ tags: ['CONSENSUS'], sources: ['nhs-back'] }` on `9dbc7e0`), in RedFlagBlock's `claim` shape. `box.words` and `box.wordCap` are dropped: they are data (Stops 3). library-gate.mjs writes that block as `RED_FLAG_BACK`.
- **Wiring (Do 9):** `Risks.tsx` imports `RED_FLAG_BACK` and adds `back: RED_FLAG_BACK` to `FLAG`; `content-types.ts` `RiskJoint` gains `'back'`.

**Do 9 count lines (D-LIB5-COUNTS) [N6].** Each is found by its text, and each assertion stays an exact equality.

| File @ sha | Old (exact) | New |
|---|---|---|
| library-core.test.ts:242 @ 72c94fc | `it('the generator writes 60 files: the 54 fingerprinted, the 2 it rewrites, and ids-node.mjs, lib-id.ts, loaders.ts, coverage.ts', async () => {` | `it('the generator writes 61 files: the 54 fingerprinted, the 2 it rewrites, and ids-node.mjs, lib-id.ts, loaders.ts, coverage.ts, red-flag-back.ts', async () => {` |
| :243 | `// LIB-2b (D-LIB2b-PINS (10)): 60 for the 8, plus …` | `// LIB-2b (D-LIB2b-PINS (10)): 61 for the 8's set (60 plus red-flag-back.ts), plus …` |
| :247 | `expect(out.size).toBe(60 + 5 * LIBRARY.length + new Set(keys).size);` | `expect(out.size).toBe(61 + 5 * LIBRARY.length + new Set(keys).size);` |
| :248 | `for (const p of ['src/howto/ids.ts', 'src/howto/generated/index.ts', 'tools/plates/library/ids-node.mjs', 'src/howto/lib-id.ts', 'src/howto/generated/loaders.ts', 'src/howto/coverage.ts']) expect(out.has(p), p).toBe(true);` | the same list plus `'src/howto/red-flag-back.ts'` (add-only) |
| library-rows.test.ts:90 @ 72c94fc | `it('generate writes the 60 files plus exactly the clone\'s 6 (…), never hand-<chromeId>', () => {` | `… the 61 files plus …` |
| :92 | `expect(mainOut.size).toBe(60);` | `expect(mainOut.size).toBe(61);` |
| :94 | `expect(treeOut.size).toBe(60 + CLONE_OUTPUTS.length);` | `expect(treeOut.size).toBe(61 + CLONE_OUTPUTS.length);` |
| :108 | ``expect(c.out).toContain(`PASS, ${60 + CLONE_OUTPUTS.length} files fresh`);`` | ``… `PASS, ${61 + CLONE_OUTPUTS.length} files fresh` …`` |
| library-ci.test.ts:298 @ 108eb5c (only after LIB-4c is on main and merged in) | `expect(real.inputs.size).toBe(60);` | `expect(real.inputs.size).toBe(61);` |
| :300 @ 108eb5c | `… .toEqual({ proven: true, why: [], n: 66 });` | `… n: 67 });` |

L2-A3 (54 bodies, keyed on generated-bodies.json) is unchanged. The PR records the red-before run (every assertion line above red with the old values, and no other test red) and the green-after run, plus the mutation "red-flag-back.ts output removed", which turns each re-pinned line red.

**D-LIB5-RISKSTEST (Do 9 only).** `tests/howto/sections-risks.test.ts` @ 72c94fc gains exactly two lines:
- after :10 `import { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_KNEE, RED_FLAG_ELBOW, DISCLAIMER } from '@/howto/archetypes';`, add `import { RED_FLAG_BACK } from '@/howto/red-flag-back';`;
- after :30 `  wrist: RED_FLAG, shoulder: RED_FLAG_SHOULDER, knee: RED_FLAG_KNEE, elbow: RED_FLAG_ELBOW,`, and before :31 `};`, add `  back: RED_FLAG_BACK,`.

No other line changes. Mutation: removing either line turns `npm run typecheck` red.

**D-LIB5-TWIN (after LIB-4b merges).** `fidelity/twins/ht9.mjs` @ f1df4a7:
- :26, the esbuild entry, which ends ``…export * from ${JSON.stringify(join(root, 'src/howto/archetypes.ts'))};\n` ``, gains a second re-export of `src/howto/red-flag-back.ts` after the archetypes one;
- :29 `const FLAG = { wrist: C.RED_FLAG, shoulder: C.RED_FLAG_SHOULDER, knee: C.RED_FLAG_KNEE, elbow: C.RED_FLAG_ELBOW };` gains `back: C.RED_FLAG_BACK`.

pins.json stays unedited, and B3 stays green. B2 (`--ids golden8`) must be identical before and after. A library-shared.test.ts block reads ht9.mjs as text and asserts that FLAG's keys equal RiskJoint's members and Risks.tsx's FLAG keys, and that the entry re-exports red-flag-back.ts.

**Chunk measurement (Do 2) [N7, N15].**
- Budget: `tests/howto/budgets.json` `HowToSheet-*.js`, rawMax 30,884 / gzMax 10,728 (HT-9). It is never raised.
- Method:
  - Create a scratch worktree (`git worktree add <scratchpad>/lib5-chunk HEAD`) and symlink `node_modules`.
  - Run `npm run build`. vite writes `www/` (`vite.config.ts:18` `outDir: 'www',`).
  - Size `www/assets/HowToSheet-<hash>.js` as the gate does. `const sizeOf` is at `scripts/screenshot-gate.mjs:6853` on 72c94fc (the same line on 2d1bbf3): `{ raw: b.length, gz: gzipSync(b).length }`.
  - Then, in the worktree only, add `src/howto/red-flag-back.ts` with the stand-in, the Risks entry, `RiskJoint 'back'` and the two sections-risks lines. Rebuild, measure again, and grep the chunk for the stand-in.
- Stand-in (30 words by c7's count; scratch only, never committed or pushed): `{ name: 'Spine pain', now: 'Alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima? Get it checked today.', doctor: 'Mike november oscar papa quebec romeo sierra tango uniform? See a doctor.', claim: { tags: ['CONSENSUS'], sources: ['nhs-back'] } }`.
- Report before and after, raw and gz, with headroom. Over budget means stop.

## b. The 30-word reach (D-LIB5-REACH) [N3, N8]

**Mechanism.**
- The generator's library lint imports copy-lint.mjs's exports unchanged: `words`, `sentences`, `RED_FLAG_BOX_MAX_WORDS`, `MAX_SENTENCE_WORDS`, `BANNED`, `CONTACT_RE`, `SOURCE_RE`, `SOURCE_CS_RE`, `SAFETY_LINE_RE`, `sourceNamePatterns`.
- It applies lintShared's per-box 'today' and 'doctor' rules (`copy-lint.mjs:337-338`).
- It imports nothing from `tests/**`. Node 22.0-22.17 does not strip types, and c19.ts's import is extensionless.
- Pattern parity is already pinned by HT4b-A6 (`tests/howto/no-contacts-parity.test.ts`), so no second parity test is added.

In vitest, both run unedited on every placement:
- `checkC7` on a clone of one of the 8's content with `redFlag` replaced by the box. c7's `words` is not exported (`c7.ts:116`).
- `checkC19Shared({ RED_FLAG_BACK: box, DISCLAIMER }, 'back')` (`c19.ts:49`).

**Differential test** (library-lint.test.ts): the lint names exactly the rules that checkC7's `C7: redFlag` lines plus checkC19Shared's lines name. Its neutral fixtures equal no back-pain-box.json value, keep every sentence at 15 words or fewer, and have no BANNED hit:
- 30 words, clean;
- 31 words (count only);
- no 'today';
- no 'doctor' and no SAFETY_LINE_RE word;
- 'Call 999' (contact and safety line only; c7 has no contact rule).

The same comparison runs on every shipped row's redFlag. An equality test asserts `LIMITS.redFlagBoxWords === RED_FLAG_BOX_MAX_WORDS === 30`.

| Placement | Test |
|---|---|
| 1. `shared/back-box.mjs` (`backBox()`) | library-shared.test.ts: before Do 9, the throw (S4-P). From Do 9, the imported pieces plus BANNED, MAX_SENTENCE_WORDS and sourceNamePatterns, then checkC7 (clone) and checkC19Shared, unedited. |
| 2. Generator library lint (library-gate.mjs, Do 5) | The same pieces, so `generate` throws on a 31-word box. Tested in library-lint.test.ts on a per-case copy of E1's tree (D-LIB5-FIXTURE). |
| 3. `src/howto/red-flag-back.ts` (Do 9) | Byte-equal to placement 1; checkC7 clone and `checkC19Shared` run on its block. |
| 4. `Risks.tsx` `FLAG.back` (Do 9) | S5: a direct `renderRisks` test on a spread of a real sheet with `riskFlags: ['back']` emits `<pre>-redflag-back` with exactly placement 3's three lines (D-LIB5-FIXTURE 5). |
| 5. A sheet's own `content.redFlag` | It stays `RED_FLAG` (wrist) for every library row, because loadContent re-exports it (`content.mjs:99`; HT5-A5). The back box never goes there. The sweep's checkC7 covers it as for the 8. |
| 6. The library layers page (D-LIB5-PAGE) | Owner LIB-6-PM (#181): the RF and FLAG patches read `backBox()` lazily. S5-L (`tests/howto/library-back-page.test.ts`, carried by whichever of #181 and Do 9 merges second) runs the reach checks on the page text. LIB-9a's merge_prerequisites gain "LIB-6-PM's back patches and S5-L on main and green". |

`lintShared` covers only RED_FLAG_BLOCKS' 4 joints and stays locked. No box limit under `tools/plates/library/lint/**` differs from the imported 30 (S7's assert).

## c. The fail-closed placeholder (Do 4, S4-P) [N2, N7, N9]

- **Module:** `tools/plates/library/shared/back-box.mjs`.
  - `export const BACK_BOX_WAITS = 'LIB-5: back box waits for owner decision 6 (plan 8 item 6)';`
  - `export function backBox() { throw new Error(BACK_BOX_WAITS); }`
  - `` export function refuseBack(id, riskFlags) { if (riskFlags?.includes('back')) throw new Error(`${id}: ${BACK_BOX_WAITS}`); } ``
  - No box text. It never reads back-pain-box.json before Do 9.
- **One call site:** library-gate.mjs `outputs()`, first in its per-row loop over registry `shippedRows()`, using `loadContent(id).content.riskFlags`. content.mjs, ids.mjs, generate.mjs and `tools/plates/lib/**` stay byte-unchanged. The old note's "call site: gen/content.mjs outputs()" is withdrawn.

**S4-P tests:**
1. The module holds no box value and no RedFlagBlock literal; `backBox()` throws the exact text.
2. None of `box.name.text`, `box.now.text` or `box.doctor.text` (whole value, case-sensitive) appears under `src/**`. `git grep -nF` gives 0 hits on `49a2853` and on this branch at `ee7f40f`. Do 2 re-runs it on the merged head.
   - The bundle half is `tools/plates/library/shared/check-bundle.mjs [dir]` (default `www`), D-LIB5-BUNDLE.
   - It reads the three values from the S1-pinned back-pain-box.json, scans every file under `<dir>/**` (index.html, sw.js and the manifest included), and exits 1 naming the file and field on any hit. It also exits 1 if `<dir>/assets` has no `HowToSheet-*.js`.
   - Vitest runs it on temp folders: each value planted, no HowToSheet chunk, clean.
   - The CI step (supervisor, add-only, in build-apk.yml's source-gate job after :42) merges in one train with LIB-5.
3. E1's row, in a per-case copy of E1's tree with `'back'` added to its riskFlags line `['wrist', 'shoulder', 'elbow']`, makes `generate` throw exactly `lib_cable_lateral_raise: LIB-5: back box waits for owner decision 6 (plan 8 item 6)`. The copy uses `cpSync(root, r, { recursive: true, verbatimSymlinks: true })` with one exact-once replacement in `F.HOWTO`. The file also holds "card removed → `plate QA refused lib_cable_lateral_raise … PQ-H6`".
4. `RiskJoint` has no `'back'`.
5. Guard: box text in the module requires D-LIB5-BACKBOX, and text equal to a non-draft card's box.

**Mutations:** draft text pasted → 1 and 5 red; throw removed → 3 red; each value planted in a temp folder → check-bundle exit 1 naming the field; no HowToSheet chunk → exit 1.

**Do 9 (D-LIB5-BUNDLE):** the scanner's rule flips. Each answered value must be present. The `9dbc7e0` draft `box.now.text`, kept as a `tests/howto/fixtures/lib5` file, must be absent unless it is the answer. The vitest cases flip with it.

## d. Machine fields (D-LIB9-CARDFIELDS, D-LIB5-TEMPO8, D-LIB5-TOPFAULT) [N13]

These are top-level keys of `docs/research/howto/cards/<card id>.json`, read by `researchOf` (`candidate.mjs:44-48`), H6 (`qa/node.mjs:151-176`) and F7 (`:293`).

- **plateFacts** `[{ kind, joint|landmark, pose?, deg|m, measure?, claim }]`.
  - Every fact names a claim whose verbatim quote states it; H6 ignores `claim`.
  - An id with a spec gets the key only if it is non-empty and holds its measured-joint angle fact in the form the ruled plateFacts form table gives (section k). Otherwise there is no key, never `[]`. plateFacts and tempo go in together or not at all.
- **tempo** `[{ phase, s, move? }]`.
  - Built only from LIB-5's own ruled 8-row map (section k) and the card's verified `plate.tempo`.
  - A moving phase takes `up` or `down`, never a constant. Any other `s` is a ruled constant with its verified claim and quote.
  - Key order is `{phase, s, move: true}` or `{phase, s}`. No entry carries `claim` (H6 compares with `JSON.stringify`, `node.mjs:174`).
  - There is no tempo-map.mjs and no LIB-9a dependency. The old premise ("a constant LIB-9a names", "Do 3 waits for that ruling") is withdrawn.
- **topFault**: the key from the supervisor's blind pass, posted as 'TOPFAULT @ <sha>'. It cites `plate.mistake.claim`, or, on a drawable:false card, the claim of the top fault the card names. LIB-5 never reads `mistake.firstKey` to choose it.
  - An id stops (no topFault, not in CARDS_8, both exemptions kept, reported) on:
    - 'none' or 'several';
    - a drawable:true key that differs from firstKey;
    - a drawable:false key equal to firstKey.
  - A drawable:false id whose key differs gets that key, is never wired here, and keeps its exemptions.
  - library-cards8.test.ts asserts each wired card has `drawable: true` and topFault equal to its TOPFAULT key.
- Only labels come from the spec or plate, each through a ruling: the tempo map's phase names, order and move flags; the form table's labels; and the tell keys the pass chose from.
- Paths: `docs/research/howto/cards/<card id>.json` and `quotes/<card id>.json`, where card id = lib id without `lib_`.

## e. Stamps (D-LIB5-STAMPS) [N10]

- **Hash:** c15's `contentHash(content, plate)`.
  - `content = loadContent(id).content`.
  - `plate` = the whole `fragments` object of the id's latest plate entry, with 9 keys: `normalSvg, normalOverlay, mistakeSvg, mistakeOverlay, tells, tempo, cues, alt, mistakeAlt`. For the 8 it comes from GOLDEN.json via `latestEntries`; for a library row, from `pinOf(row, 'plate', root)`.
  - `scope = content.extends ?? content.id` (`c15.ts:28`).
- **contentHashOf** imports the given root's own `gen/content.mjs` (loadContent has no root parameter), so it is async. A test shows it equals c15's `contentHash` on the 8 and on E1's row.
- **The Do 5 sweep** calls `checkC15` with that same fragments object, never `{}`.
- **stampProblems** treats a missing, unparsable or empty reviews.json as a failure for every shipped id, never as c15's stub pass (`c15.ts:26`).
- **Entries:** `{ scope, hash, date, fetcher, critic, safety?, reviewer, findings, open: 0 }`.
  - Each role cites both records: S-2 (`tools/plates/layers/README.md:27-45`, review line :45) and the compact rewrite (:52-90, checks :85-90). A role with no record says so.
  - `findings` lists by number every recorded golden-B follow-up naming that id (HANDOVER 8.2 items 1-11, and 8.0k follow-up 12, numbered on the main head merged at Do 6), each marked "recorded, not changed: golden B is locked (plan 2.8)". `open: 0` counts only those reviews' unresolved findings.
  - `approvedBy` waits for the "stamps (O5)" ruling.
  - The 8's machine cards do not enter the hash: they are never shown, and the `research` pointer stays byte-identical (S10).
- **One commit (Do 6)** holds:
  - the gate;
  - the 8's approved entries;
  - the three D-LIB5-SCRATCH lines of every fixture builder on that head;
  - the lib5 cases' `writeScratchStamps` calls.
  Every test is green on it. S8 adds the mutation "entries emptied → generate throws naming each of the 8 while checkC15 returns []".

## f. The stamp gate and scratch stamps (D-LIB5-GATE, D-LIB5-SCRATCH) [N2, N5]

**library-gate.mjs** is the one refusal point.
- Exports: `after = ['tools/plates/gen/content.mjs']`, `inputs()`, `inputsFor(path)` and `async outputs()`.
- It never reads `ctx.prev`.
- Order inside `outputs()`:
  1. per shipped row: `refuseBack`;
  2. the family refusal (D-LIB5-FAMILY);
  3. for library rows only (registry rows after the 8): the lint, including `sheetWords`;
  4. after the loop: `stampProblems(ids)`, which throws on any line.
- `inputsFor` lists `back-box.mjs`, its static imports and `docs/research/howto/shared/back-pain-box.json`; a test asserts that set.
- checkC17 runs on `tools/plates/library/shared` and on a temp directory holding a copy of library-gate.mjs.
- PR evidence (never a committed pin): `git diff --exit-code <main sha> HEAD` is empty over content.mjs, ids.mjs, generate.mjs, `tools/plates/lib/**` and every path render() returns, and `generate --check` is green.
- After LIB-4c merges, an affectedIds test gives `all: true` for each of library-gate.mjs, a lint module, research/stamps.mjs and reviews.json.

**Helpers** (`tools/plates/library/research/stamps.mjs`; signatures fixed):
- `export const SCRATCH_MARKER = 'LIB5-SCRATCH-ROOT';`: a file at the top level of a scratch root, not git-ignored (`.gitignore` has no matching pattern; `git check-ignore` gives no hit).
- `export function markScratch(root): void` writes it.
- `export function writeScratchStamps(root, ids): Array<{ scope, hash }>` is synchronous and has no default root.
  - It throws if `root` lacks SCRATCH_MARKER.
  - It computes hashes in a `spawnSync` child Node process run in `root` that imports root's own stamps.mjs (as `node(root, code)` does, `fixture.mjs:71`).
  - It writes `scratch: true` entries only into `<root>/docs/research/howto/reviews.json`.
- `export async function contentHashOf(id, { root = ROOT } = {}): Promise<string>`.
- `export async function stampProblems(ids, { root = ROOT, reviews } = {}): Promise<string[]>`.
  - Lines read `LIB-5 stamp: <id>: no reviews.json entry for scope <scope> hash <first 12>…`.
  - A `scratch: true` entry counts only when `root` holds SCRATCH_MARKER.
- Main tests: no SCRATCH_MARKER at ROOT and none tracked (`git ls-files`); S8's "committed reviews.json holds no scratch entry" stays absolute.

**Fixture lines** (exactly three per builder, added in the Do 6 commit):

| Builder @ sha | Import (after the last import line) | markScratch | writeScratchStamps |
|---|---|---|---|
| `tests/howto/fixtures/lib2b/fixture.mjs` @ 72c94fc (last import :16 `import { fileURLToPath, pathToFileURL } from 'node:url';`) | `import { markScratch, writeScratchStamps } from '../../../../tools/plates/library/research/stamps.mjs';` | `markScratch(root);` just before stageTree()'s `  return root;` (:67) | `writeScratchStamps(root, [ID]);` just before pinTree()'s `  return m;` (:121) |
| `tools/plates/library/fidelity/fixture.mjs` @ f1df4a7, once on main (last import :23 `import { node } from '../../../../tests/howto/fixtures/lib2b/fixture.mjs';`) | `import { markScratch, writeScratchStamps } from '../research/stamps.mjs';` | `markScratch(root);` as stage()'s last statement (after :101) | `writeScratchStamps(root, ids(scratch));` just before pin()'s `  return facts;` (:179) |
| `tools/plates/library/ci/scratch.mjs` @ 108eb5c | none: it builds through `stage()` and `pin()` (:124-126) | none | none |
| `tools/plates/library/scale/write-ids.mjs` @ 0b2d3c1 | none: it calls only ids.mjs's and handpairs.mjs's outputs() from its synthetic copy, never render() | none | none |

**Evidence:**
- A test asserts that the tree's reviews.json holds a scratch stamp per pinned id when `fixtureTree()` returns, and that generate then passes the gate.
- A writeIds test runs `writeIds(ROOT, 22)`, and asserts that `syntheticRoot(ROOT, 22)`'s copy has no reviews.json. lib-4a.test.ts stays unedited and green.

**Mutations:**
- marker removed from E1's tree → `LIB-5 stamp: lib_cable_lateral_raise …`;
- writeScratchStamps on an unmarked root → throws;
- marker at ROOT → red;
- E1's stamps not written → throws;
- writeScratchStamps made async → red;
- in a scratch worktree only, the gate called from pushHints → the writeIds test is red.

**LIB-4c's scratch ref:** LIB-4c merges first. If a C11-C14 rebuild is needed after LIB-5, stop and report.

## g. Shared modules (`tools/plates/library/shared/`) [N1, N11]

`card.mjs` provides `sharedCard(key)`. Each module projects card fields as `{ text, claim }` with the card's own refs, never retyped. **No claim is made here that every exported string passes the lint** (D-LIB5-SPLIT). The per-field path and kind table goes with Do 2's results, for the supervisor to rule. S6 checks module `===` card, that refs resolve, that each shown field passes golden B's lint at its ruled path and kind, and that no data value reaches `src/**` or a generator output (pinned export-key lists; typed enums stay under typecheck).

**Modules and their pairing to LIB-7 / LIB-12** (pair = module KEY/variant; LIB-7 #193 @ 55e91e9, LIB-12 #191 @ 0d268a7):

| Module export | Card (claims cited by its fields; research-only claims in brackets) | Hand module KEY/variant | Fault keys after D-LIB5-FAULTKEYS |
|---|---|---|---|
| `hands.mjs` CURL | curl c1-c5 | LIB-7 hand-curl.mjs `curl`/dumbbell, `curl`/bar | `curled` (curl#c3,#c4), `bent-back` (curl#c3-#c5), as radial-rules.mjs:20, :22 |
| `hands.mjs` ROPE | rope-rule c1-c6 | LIB-7 hand-rope.mjs `rope`/push | `curled` 'Wrist curled' (rope-rule#c6), as hand-rope.mjs:22 |
| `hands.mjs` PALM_FLAT | palm-flat c1-c6, c8, c9 [c7] | LIB-12 hand-palm-flat.mjs `palm-flat`/floor | `cupped-palm` (#c2), `hand-ahead` 'Hand ahead' (#c3), `hands-rotated` (not drawn) |
| `hands.mjs` CUPPED_THUMB | cupped-thumb c1-c3, c5 [c4] | not drawn (LIB-12 hand-cupped.mjs lists dumbbell_overhead_triceps_extension in GAPS) | none |
| `implements.mjs` BATTLE_ROPES | battle-ropes c1-c4 [c5] | LIB-12 hand-battle-rope.mjs `battle-rope`/rope | `death-grip` (#c4); `end-grip` not drawn |
| `implements.mjs` WALL_BALL | wall-ball c1-c5 | LIB-12 hand-ball-contact.mjs `ball-contact`/catch | `side-sandwich` (#c1,#c2,#c4) |
| `implements.mjs` JUMP_ROPE, KETTLEBELL_SWING [c6], MEDICINE_BALL_SLAM | their cards | not drawn (hand-implement.mjs and hand-ball-contact.mjs list the card ids in GAPS) | `white-knuckle`, `palm-grip`, `crush-grip` |
| `exemptions.mjs` FRONT_RACK | front-rack c1-c5 | LIB-12 hand-front-rack.mjs `front-rack`/rack | `bar-off-shoulders` (#c4 + front_squat#c7) |
| `exemptions.mjs` WRIST_CURL | wrist-curl c1-c3 | not drawn (hand-curl.mjs GAPS: wrist_curl, exempt) | `grip-opening` |
| `moves.mjs` GET_IN_OUT, SELECTOR_PIN, FOOT_BAR, UNRACK_RERACK, DUMBBELL_KICKUP [c5] | their cards | none | none |
| `checkpoints.mjs` FLOOR_BODY [c5], PRONE | their cards | none | none |
| `back-box.mjs` | none before Do 9 | none | none |

"Not drawn" means no IDS entry draws it; GAPS lists card ids (hand-battle-rope.mjs's GAPS is `{}`).

**D-LIB5-FAULTKEYS:** research makes exactly these edits at the source, and LIB-5 never retypes:
- curl `wrist-curl-cheat`→`curled` and `bent-back-bottom`→`bent-back`, plus gaps[2] replaced whole;
- rope-rule `rope-wrist-curl`→`curled` and 'Wrists curl'→'Wrist curled';
- palm-flat 'Hands too far forward'→'Hand ahead'.

CURL, ROPE and PALM_FLAT are built only from a copied head that holds these edits; otherwise LIB-5 stops and reports.

The family reader reads the 8's handling.faults, the shared modules' faults, and every `tools/plates/library/hands/hand-*.mjs` `VARIANTS[*].faults`. It prints the count per source and asserts that each count is above 0 where it must be. A fixture hand module under `tests/howto/fixtures/lib5/` proves the reader. Mutations: fixture hand-ahead labelled 'Hands forward'; the reader returning 0. Do 2 lists every claim set filed under two keys (palm-flat c3 under hand-ahead and hands-rotated).

**Order (Do 4):** the placeholder and every module whose card has no shown-copy hit are built at once. A module with a hit waits for the one named research head on which its fields pass. On that head LIB-5 re-copies, re-pins S1 and re-runs S2, S6 and S7.

## h. Library lint rules and the Do 2 dry run [N4]

Under `tools/plates/library/lint/` (pure functions; signatures fixed):
- `medicalBans(fields) -> violations`:
  - the regex is `/\bcure[sd]?\b|\bheal(?:s|ed|ing)?\b|\btreats?\b|\brehab\w*|\bdiagnos\w*|\binjury-proof\b|\bprevents? injur\w*/i`;
  - `fields` is golden B's `copyFields(M)`, every kind except sourceNote.
- `variantLine({ id, equipment, line }) -> { violations, words }` (D-LIB5-VARIANT).
  - Red when:
    - equipment has '/' and the line is missing;
    - there is a line and no '/';
    - `words(line) > CAPTION_MAX_WORDS`;
    - BANNED, OWN_RED_FLAG, the LR-23 patterns, a sourceNamePatterns name or a medical ban hits.
  - `VARIANT_LINE_EXEMPT = ['lib_lat_pulldown', 'lib_leg_press']` (D-LIB5-VARIANT8) is one exported constant, matched by exact row id. The validator imports it for the card half.
  - It runs only in the sweep until the field card lands.
  - The test pins the 23 '/' ids and `eightWithSlash(eightIds, exercises)`, where eightIds come from golden.mjs `LIB_OF`.
- `fixVerbs(rows) -> violations`: a feel-row fix's first word is in golden B's `FIX_VERBS`, imported.
- `familyLabels(sources) -> violations` (rule (a), one label per `fault.key`).
- `familyRefusal(id, content, card) -> violations`. The throw is `${id}: family: ${field}: inherited-string map not ruled (D-LIB5-FAMILY)`, with field `extends` or `${research.card}#inherit`. Tested as M1-M3 plus a control (`inherit: []`).
- `sheetWords(M, shared, extraBoxes) -> { total, violations }` (D-LIB5-WORDS).
  - `M` is `sourceOf(id)`'s module namespace; `extraBoxes` is `{}` until Do 9.
  - `total = lintHowto(M, shared).words.total` plus `words([name, now, doctor].join(' '))` per riskFlags entry missing from RED_FLAG_BLOCKS.
  - Pinned totals: lateral raise 444, back squat 450, pull-up 449, hanging leg raise 442, lat pulldown 449, seated cable row 449, leg press 449, chest press 444. A neutral fixture box is green at 450 and red at 451.
- `boxReach(id, flag, box) -> violations` (b).
- `RED_FLAG_ROWS` per stamped id: golden B's constant for the 8, and `lint/red-flag-rows.json` (add-only) for library ids.

**Do 2 dry run (method; Do 2 runs it):** a scratch script, never committed, applies these rules to the 8's How-to modules and to all 18 non-box shared cards under the split. It posts every hit with its rule, card or id, field, path, kind and text, plus the field split for ruling and the two-key claim sets. A hit on approved golden-B copy is named by exact id and string; E1 reuses pull-up's copy, so a pull-up hit is reported with how E1 is affected.

## i. Shared risk lines

Bar over the face, breath-holding and jump landing are sourced by no shared card or quote. They are not written (LR-3) and stay research gaps.

## j. wordCap is data

`box.words` and `box.wordCap.limit` are never read as a limit. S2 includes: a card with `wordCap.limit: 999` and a 31-word box is still red under the imported 30.

## k. The 8's machine cards (Do 3 b) [N12]

**The research head is not named yet**, so the per-id table cannot be built on it. Research stays `9dbc7e0`, which has no card for any of the 8. `claude/libht-research-the8` @ `e6381fa` holds unverified cards for all 8 without the three keys, and is never a source on its own. Once the supervisor names the head, the tempo map, the measured-joint facts and the TOPFAULT inputs follow as one addendum comment on #244 (reading and writing only, no slot, no push), as D-LIB5-TEMPO8 2 allows.

Below is only what can be fixed from main now. The pre-revision table showed each plate's selected Mistake key; this revision leaves that column out, so #244 can be a blind input. The keys are listed in sorted order.

**Spec phases to map** (labels only, from `tools/plates/vendor/exercises/<id>.mjs` on main; the field each `s` takes is filled from the named head's verified `plate.tempo`):

| id | Spec phases (name, s, move) | Map row (field per phase) |
|---|---|---|
| lib_dumbbell_lateral_raise | none (no spec; H6:not-engine) | none |
| lib_barbell_back_squat | Lower 2 move; Drive up 1 move; Brace 1 | head not named |
| lib_pull_up | Pull 1 move; Hold 0.5; Lower 2 move; Rest 0.5 | head not named |
| lib_hanging_leg_raise | Lift 1.5 move; Hold 0.5; Lower 2 move; Rest 1 | head not named |
| lib_lat_pulldown | Pull 1 move; Hold 0.5; Return 2 move; Rest 0.5 | head not named |
| lib_seated_cable_row | Pull 1 move; Hold 1; Return 2 move; Rest 0.5 | head not named |
| lib_leg_press | Lower 2 move; Pause 0.5; Press 1 move; Rest 0.5 | head not named |
| lib_machine_chest_press | Press 1 move; Hold 0.3; Return 1.5 move; Rest 0.5 | head not named |

Rest, Brace and leg_press's bottom Pause can only be named constants with a verified quote, or "no verified source". D-LIB5-TEMPO8 6 expects all 7 to stop at H6.tempo, because e6381fa's cards give up 2 / down 2 while each spec's concentric phase is 1 s and hanging_leg_raise's Lift is 1.5 s.

**plateFacts form table (proposal for ruling;** labels from each spec's `measure`):

| id | Spec measure (vertex, title, value, expect) | Proposed form |
|---|---|---|
| lib_barbell_back_squat | knee.r, 'Knee', 'about 125° bend', 125 | `kind: 'angle', measure: true`, pose end |
| lib_pull_up | elbow.r, 'Elbow', 'about 145° bend', 146.5 | `measure: true`, pose end |
| lib_hanging_leg_raise | hip.r, 'Hip', '90° to trunk', 90 | `measure: true`, pose end |
| lib_lat_pulldown | hip.r from vertical ('up'), 'Lean back', 'about 15°', 15 | `measure: true` (a `joint: 'hip.r'` fact would read the hip angle and fail) |
| lib_seated_cable_row | shoulder.r, 'Shoulder', 'about 90°', 87 | `measure: true`, pose end |
| lib_leg_press | knee.r, 'Knee', 'about 90° bend', 90 | `measure: true`, pose end |
| lib_machine_chest_press | elbow.r, 'Elbow', 'soft, not locked', no expect | `joint: 'elbow.r'` (only a joint fact can match), pose from the verified card |

`measure: true` compares the fact with `spec.measure.expect` and the drawn measure (`node.mjs:162`); a `joint` fact compares it with the engine's angle at its pose (`:161`). Values come only from verified quotes. Where none exists, the id gets no plateFacts key.

**TOPFAULT pass, plate half of the inputs** (each plate's Mistake tells from the golden fixture, sorted by key, with no selected marker). The card half (plate.mistake.what or, for drawable:false, the named top fault, with claims and quotes) comes from the named head.
- lateral-raise: dip "The knees dip to swing it up."; shrug "The shoulders shrug toward the ears."; thumbs "Thumbs turn down at the top."
- barbell-back-squat: chest "The chest falls and the trunk tips forward."; drift "The bar moves out over the toes."; hips "The hips come up before the shoulders."
- pull-up: kick "The legs kick to swing the body up."; short "The chin stops under the bar: a half rep."
- hanging-leg-raise: arch "The low back arches, no curl."; knees "Knees bend; thighs stop short."; swing "The body swings to fling the legs."
- lat-pulldown: shrug "The shoulders creep up toward the ears."; swing "The torso swings far back to heave the weight down."
- seated-cable-row: legs "The knees straighten to shove the body back."; swing "The torso swings back past upright to heave the weight."
- leg-press: cave "The knees fall in toward each other."; heels "The heels peel off the plate."; lift "Too deep; the hips and low back peel off the pad."
- machine-chest-press: lock "The elbows snap straight at the end of the press."; round "The shoulders roll forward and the upper back leaves the pad."

**Per-id rules (card amendments 6 and 26):**
- CARDS_8 lists exactly the ids that hold every value H6 and F7 read, all verified and clean (topFault alone for lib_dumbbell_lateral_raise, which keeps 'H6:not-engine'). It is all-or-nothing per id.
- The fallback is per id.
- A test asserts that `cardResearch(id)` deep-equals researchOf's projection for each CARDS_8 id.
- The clone inputs at `library-qa.test.ts:66` and `:70` gain `research: null, mistakeFault: null` only if lib_pull_up is wired.
- When no id lost 'H6:no-card', S12 runs on the S3 lib5 fixture card.

**qa/approved.mjs lines (commit 2), only these:**
- Imports: add `join` from `node:path` and `ROOT` from `../../golden.mjs` (exported at `golden.mjs:15`).
- New: `export const CARDS_8 = [<verified, wired ids>];`.
- New: `` const cardResearch = id => { const c = JSON.parse(readFileSync(join(ROOT, 'docs/research/howto/cards', `${id.slice(4)}.json`), 'utf8')); return Object.fromEntries(['plateFacts', 'tempo', 'topFault'].filter(k => k in c).map(k => [k, c[k]])); }; ``. It is inlined, because candidate.mjs imports approved.mjs.
- `:20`: `research: null` → `research: CARDS_8.includes(LIB_OF[p.chromeId]) ? cardResearch(LIB_OF[p.chromeId]) : null`, and `mistakeFault: null` → `mistakeFault: CARDS_8.includes(LIB_OF[p.chromeId]) ? p.mistake.firstKey : null` (candidate.mjs:84's rule; F7 compares the plate against the card's TOPFAULT key).

## Still waiting (after "LIB-5 resume")

- Do 2: the named research head.
- Do 3 b: the tempo-map and form-table ruling, 'TOPFAULT @ <sha>', then 'CARD FIELDS VERIFIED'.
- Do 4: D-LIB5-FAULTKEYS's edits for CURL, ROPE and PALM_FLAT, and SPLIT rewords for any module with a hit.
- Do 6: the "stamps (O5)" ruling and the entry approval.
- Do 9: the owner's answer (route (b) likely).
- Variant-line generator enforcement: the field card.
- The back box on the layers page: LIB-6-PM.
