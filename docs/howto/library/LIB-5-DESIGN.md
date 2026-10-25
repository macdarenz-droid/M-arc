# LIB-5 design note (as built, Do 8)

Card LIB-5 (shared layer modules), on `claude/lib-5-shared-layers` (#244). The note was ruled as a design under lib4-cards.md section 14 (D-LIB5-NOTE, -2, -3). Do 8 rewrote it as built. The rulings applied while building: 14.3 (D-LIB5-SPLIT), 14.5 (the named research head and `exempts` as data), 14.6 (D-LIB5-SPLIT-2), 14.7 (D-LIB5-TEMPO8) and 14.8 (D-LIB-O5), all on `claude/sup-lib4-cards`. Where a section below still describes a ruled design step, the built code follows it, unless the section says otherwise.

**Heads:**
- main `b99a9e2` (merge commit `749a337`);
- research `claude/libht-research` @ `9eaa2480`: the one re-copy (19 shared cards, 19 quote files, the 8's cards and quotes);
- LIB-7 #193 `55e91e9` and LIB-12 #191 `0d268a7`, read for the family check only.

**What is built:**
| Part | Files | Evidence |
|---|---|---|
| S1 copies | `docs/research/howto/shared/*.json`, `quotes/shared-*.json`, the 8's `cards/` and `quotes/` | `library-research.test.ts`, `library-cards8.test.ts` (sha256 pins) |
| S2 validator | `tools/plates/library/research/validate.mjs` (`validateShared`, `validateCard`, `TEMPO8`, `buildTempo`, `registryProblems`) | `library-research.test.ts`, `library-cards8.test.ts` |
| S4-P back box | `shared/back-box.mjs` (placeholder), `shared/check-bundle.mjs`, `gen/library-gate.mjs` | `library-shared.test.ts` |
| S6 modules | `shared/card.mjs` (`cardExport`, `SPLIT`, `DATA`, `RULED_JOINS`), `hands`, `implements`, `exemptions`, `moves` and `checkpoints.mjs`: all 18 non-box cards | `library-shared.test.ts` |
| S7 lint | `lint/index.mjs`, `lint/family.mjs` (rule (a), the reader, the inheritance refusal), `lint/shared-cards.mjs` | `library-lint.test.ts` |
| S8 stamps | `research/stamps.mjs`, the gate's stamp check, `reviews.json` (the 8, approved at `33302cc`) | `c15-stamps.test.ts` |
| S3/S12 | the S3 fixture card `tests/howto/fixtures/lib5/research/` | `library-cards8.test.ts` |

Not built here: Do 9 (the owner's back-box answer, decision 6; route (b) holds, so the placeholder stays fail-closed), the variant-line field (D-LIB5-VARIANT: no shown field yet), and LIB-9's inheritance comparator (D-LIB5-FAMILY 6).

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

| File @ sha | Old (exact) | New (exact) |
|---|---|---|
| library-core.test.ts:242 @ 72c94fc | `  it('the generator writes 60 files: the 54 fingerprinted, the 2 it rewrites, and ids-node.mjs, lib-id.ts, loaders.ts, coverage.ts', async () => {` | `  it('the generator writes 61 files: the 54 fingerprinted, the 2 it rewrites, and ids-node.mjs, lib-id.ts, loaders.ts, coverage.ts, red-flag-back.ts', async () => {` |
| library-core.test.ts:243-244 @ 72c94fc | `    // LIB-2b (D-LIB2b-PINS (10)): 60 for the 8, plus for each shipped library row its ht-, feel-, posture-, zoom- css and` / `    // research card, plus one handpair-<key>.ts per distinct key the shipped rows use` | `    // LIB-2b (D-LIB2b-PINS (10)): 61 for the 8's set (60 plus red-flag-back.ts), plus for each shipped library row its ht-, feel-, posture-, zoom- css and` / :244 unchanged |
| library-core.test.ts:247 @ 72c94fc | `    expect(out.size).toBe(60 + 5 * LIBRARY.length + new Set(keys).size);` | `    expect(out.size).toBe(61 + 5 * LIBRARY.length + new Set(keys).size);` |
| library-core.test.ts:248 @ 72c94fc | `    for (const p of ['src/howto/ids.ts', 'src/howto/generated/index.ts', 'tools/plates/library/ids-node.mjs', 'src/howto/lib-id.ts', 'src/howto/generated/loaders.ts', 'src/howto/coverage.ts']) expect(out.has(p), p).toBe(true);` | `    for (const p of ['src/howto/ids.ts', 'src/howto/generated/index.ts', 'tools/plates/library/ids-node.mjs', 'src/howto/lib-id.ts', 'src/howto/generated/loaders.ts', 'src/howto/coverage.ts', 'src/howto/red-flag-back.ts']) expect(out.has(p), p).toBe(true);` |
| library-rows.test.ts:90 @ 72c94fc | `  it('generate writes the 60 files plus exactly the clone\'s 6 (ht, feel, posture, zoom css, research card, its hand pair), never hand-<chromeId>', () => {` | `  it('generate writes the 61 files plus exactly the clone\'s 6 (ht, feel, posture, zoom css, research card, its hand pair), never hand-<chromeId>', () => {` |
| library-rows.test.ts:92 @ 72c94fc | `    expect(mainOut.size).toBe(60);` | `    expect(mainOut.size).toBe(61);` |
| library-rows.test.ts:94 @ 72c94fc | `    expect(treeOut.size).toBe(60 + CLONE_OUTPUTS.length);` | `    expect(treeOut.size).toBe(61 + CLONE_OUTPUTS.length);` |
| library-rows.test.ts:108 @ 72c94fc | ``    expect(c.out).toContain(`PASS, ${60 + CLONE_OUTPUTS.length} files fresh`);`` | ``    expect(c.out).toContain(`PASS, ${61 + CLONE_OUTPUTS.length} files fresh`);`` |
| library-ci.test.ts:298 @ 108eb5c (only after LIB-4c is on main and merged in) | `    expect(real.inputs.size).toBe(60);` | `    expect(real.inputs.size).toBe(61);` |
| library-ci.test.ts:300 @ 108eb5c | `    expect(JSON.parse(r.out.split('\n').find(l => l.startsWith('@@'))!.slice(2))).toEqual({ proven: true, why: [], n: 66 });` | `    expect(JSON.parse(r.out.split('\n').find(l => l.startsWith('@@'))!.slice(2))).toEqual({ proven: true, why: [], n: 67 });` |

L2-A3 (54 bodies, keyed on generated-bodies.json) is unchanged. The PR records the red-before run: with the old values, library-core :247, library-rows :92, :94 and :108, and library-ci :298 and :300 (once LIB-4c is merged in) are red, each listed, and no other test is red. The :242 and :90 titles, the :243 comment and the :248 presence list cannot be red; they change only to match. Then the green-after run, plus the mutation "red-flag-back.ts output removed", which turns each re-pinned assertion line red and the :248 presence check red for src/howto/red-flag-back.ts.

**D-LIB5-RISKSTEST (Do 9 only).** `tests/howto/sections-risks.test.ts` @ 72c94fc gains exactly two lines:
- after :10 `import { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_KNEE, RED_FLAG_ELBOW, DISCLAIMER } from '@/howto/archetypes';`, add `import { RED_FLAG_BACK } from '@/howto/red-flag-back';`;
- after :30 `  wrist: RED_FLAG, shoulder: RED_FLAG_SHOULDER, knee: RED_FLAG_KNEE, elbow: RED_FLAG_ELBOW,`, and before :31 `};`, add `  back: RED_FLAG_BACK,`.

No other line changes. Mutation: removing either line turns `npm run typecheck` red.

**D-LIB5-TWIN (Do 9 only, after LIB-4b merges).** `tools/plates/library/fidelity/twins/ht9.mjs` @ f1df4a7, both lines found by content:
- :26 old (full line): ``    const entry = `${htFiles.map((f, i) => `import h${i} from ${JSON.stringify(join(genDir, f))};`).join('\n')}\nexport const HOWTOS = [${htFiles.map((_, i) => `h${i}`).join(', ')}];\nexport * from ${JSON.stringify(join(root, 'src/howto/archetypes.ts'))};\n`;``
- :26 new (full line): ``    const entry = `${htFiles.map((f, i) => `import h${i} from ${JSON.stringify(join(genDir, f))};`).join('\n')}\nexport const HOWTOS = [${htFiles.map((_, i) => `h${i}`).join(', ')}];\nexport * from ${JSON.stringify(join(root, 'src/howto/archetypes.ts'))};\nexport * from ${JSON.stringify(join(root, 'src/howto/red-flag-back.ts'))};\n`;``
- :29 old: `    const FLAG = { wrist: C.RED_FLAG, shoulder: C.RED_FLAG_SHOULDER, knee: C.RED_FLAG_KNEE, elbow: C.RED_FLAG_ELBOW };`
- :29 new: `    const FLAG = { wrist: C.RED_FLAG, shoulder: C.RED_FLAG_SHOULDER, knee: C.RED_FLAG_KNEE, elbow: C.RED_FLAG_ELBOW, back: C.RED_FLAG_BACK };`

Nothing else in ht9.mjs changes, a3Probe stays unexported, and the gate's HT-9 block is untouched. pins.json stays unedited and B3 stays green; the PR says why no re-pin was made. If a pinned text changes after all, re-run B2 and re-pin that key under D-LIB4-OPEN in the same PR. B2 (`--ids golden8`) must be identical before and after; if it differs, stop and report, and never change a3Probe or FLAG. A library-shared.test.ts block, added in Do 9 with the twin lines, reads ht9.mjs as text and asserts that FLAG's keys equal RiskJoint's members and Risks.tsx's FLAG keys, and that the entry re-exports red-flag-back.ts. Mutations: `back` dropped from FLAG → that block red; the re-export dropped → that block red and B2 red on every id with HT9/crashed@*.

**Chunk measurement (Do 2) [N7, N15].**
- Budget: `tests/howto/budgets.json` `HowToSheet-*.js`, rawMax 30,884 / gzMax 10,728 (HT-9). It is never raised.
- Method:
  - Create a scratch worktree (`git worktree add <scratchpad>/lib5-chunk HEAD`) and symlink `node_modules`.
  - Run `npm run build`. vite writes `www/` (`vite.config.ts:18` `outDir: 'www',`).
  - Size `www/assets/HowToSheet-<hash>.js` as the gate does. `const sizeOf` is at `scripts/screenshot-gate.mjs:6853` on 72c94fc (the same line on 2d1bbf3): `{ raw: b.length, gz: gzipSync(b).length }`.
  - Then, in the worktree only, add `src/howto/red-flag-back.ts` with the stand-in, the Risks entry, `RiskJoint 'back'` and the two sections-risks lines. Rebuild, measure again, and grep the chunk for the stand-in.
- Stand-in (30 words by c7's count; scratch only, never committed or pushed): `{ name: 'Spine pain', now: 'Alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima? Get it checked today.', doctor: 'Mike november oscar papa quebec romeo sierra tango uniform? See a doctor.', claim: { tags: ['CONSENSUS'], sources: ['nhs-back'] } }`.
- Report before and after, raw and gz, with headroom. Over budget means stop.
- On the PR head, run `npm run build`, then `node tools/plates/library/shared/check-bundle.mjs`, and post its output in the Do 2 comment. In the scratch worktree only, plant `box.doctor.text` in a shipped src string, rebuild, and check-bundle exits 1 naming the doctor field. Nothing seeded is committed (D-LIB5-BUNDLE; card amendment 23).

## b. The 30-word reach (D-LIB5-REACH) [N3, N8]

**Mechanism.**
- The generator's library lint imports copy-lint.mjs's exports unchanged: `words`, `sentences`, `RED_FLAG_BOX_MAX_WORDS`, `MAX_SENTENCE_WORDS`, `BANNED`, `CONTACT_RE`, `SOURCE_RE`, `SOURCE_CS_RE`, `SAFETY_LINE_RE`, `sourceNamePatterns`.
- It applies lintShared's per-box 'today' and 'doctor' rules (`copy-lint.mjs:337-338`).
- It imports nothing from `tests/**`. package.json engines '>=22' admits Node 22.0-22.17, which do not strip types by default, and c19.ts's extensionless import would not resolve natively either.
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
| 6. The library layers page (D-LIB5-PAGE) | Owner LIB-6-PM (#181): the RF patch adds `back: 'back'` to feelSection's RF map, and the FLAG patch reads `backBox()` lazily, only when a sheet's riskFlags include 'back'. S5-L (`tests/howto/library-back-page.test.ts`, carried by whichever of #181 and Do 9 merges second) runs the reach checks on the page text. LIB-9a's merge_prerequisites gain "LIB-6-PM's back patches and S5-L on main and green". |

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

**Mutations:** draft text pasted → 1 and 5 red; throw removed → 3 red; the doctor value added as a string under `src/` → 2 red; each value planted in a temp folder → check-bundle exit 1 naming the field; no HowToSheet chunk → exit 1.

**Do 9 (D-LIB5-BUNDLE):** the scanner's rule flips. Each answered value must be present. The `9dbc7e0` draft `box.now.text`, kept as a `tests/howto/fixtures/lib5` file, must be absent unless it is the answer. The vitest cases flip with it.

## d. Machine fields (D-LIB9-CARDFIELDS, D-LIB5-TEMPO8, D-LIB5-TOPFAULT) [N13]

These are top-level keys of `docs/research/howto/cards/<card id>.json`, read by `researchOf` (`candidate.mjs:44-48`), H6 (`qa/node.mjs:153-176`) and F7 (`:293`).

- **plateFacts** `[{ kind, joint|landmark, pose?, deg|m, measure?, claim }]`.
  - Every fact names a claim whose verbatim quote states it; H6 ignores `claim`.
  - An id with a spec holds its measured-joint angle fact in the form the ruled plateFacts form table gives (section k). `[]` means verified: no quote gives a number for a drawn pose (D-LIB8M-NOFACTS; D-PLATEFACTS-EMPTY, lib4-cards §40). plateFacts and tempo go in together or not at all.
- **tempo** `[{ phase, s, move? }]`.
  - Built only from LIB-5's own ruled 8-row map (section k) and the card's verified `plate.tempo`.
  - A moving phase takes `up` or `down`, never a constant. Any other `s` is a ruled constant with its verified claim and quote.
  - Key order is `{phase, s, move: true}` or `{phase, s}`. No entry carries `claim` (H6 compares with `JSON.stringify`, `node.mjs:174`).
  - There is no separate tempo-map.mjs and no LIB-9a dependency. The builder's copy of the ruled 8-row table sits in the validator, `tools/plates/library/research/validate.mjs`, as `export const TEMPO8`. It is keyed by lib id, and each entry is an ordered list of `{ phase, move?: true, from: 'up' | 'down' | 'pause' }` or `{ phase, constant: <s>, claim }` (D-LIB5-TEMPO8 4). tests/howto/library-cards8.test.ts keeps its own literal copies of the tempo map and the plateFacts form table, asserts that `TEMPO8` equals its copy, and never takes expected values from a spec, a plate or TEMPO8 (card S12). The old premise ("a constant LIB-9a names", "Do 3 waits for that ruling") is withdrawn.
- **topFault**: the key from the supervisor's blind pass, posted as 'TOPFAULT @ <sha>'. It cites `plate.mistake.claim`, or, on a drawable:false card, the claim of the top fault the card names. LIB-5 never reads `mistake.firstKey` to choose it.
  - An id stops (no topFault, not in CARDS_8, both exemptions kept, reported) on:
    - 'none' or 'several';
    - a drawable:true key that differs from firstKey;
    - a drawable:false key equal to firstKey.
  - A drawable:false id whose key differs gets that key, is never wired here, keeps its exemptions, and is reported on the PR.
  - library-cards8.test.ts asserts that each wired card has `drawable: true` and a topFault equal to its TOPFAULT key. It also asserts that each drawable:false card's topFault, where written, equals its TOPFAULT key and differs from its plate's `mistake.firstKey`. Mutations, each red: a wired card's drawable set to false; a test copy of one card set to drawable:false with topFault equal to the drawn key (section 13 Q1 (2)).
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
- **Entries:** `{ scope, hash, date, fetcher, critic, safety?, reviewer, findings, open: 0, approvedBy, decision, approval }`.
  - Each role cites both records: S-2 (`tools/plates/layers/README.md:27-45`, review line :45) and the compact rewrite (:52-90, checks :85-90). A role with no record says so.
  - `findings` lists by number every recorded golden-B follow-up naming that id (HANDOVER 8.2 items 1-11, and 8.0k follow-up 12, numbered on the main head merged at Do 6), each marked "recorded, not changed: golden B is locked (plan 2.8)". `open: 0` counts only those reviews' unresolved findings.
  - `approvedBy: 'supervisor'`, `decision: 'D-LIB5-STAMPS'` and `approval` (the #244 approval comment link with the approved head sha), per D-LIB-O5 (lib4-cards 14.8). Approved at `33302cc` (#244 comment 6247438837). `c15-stamps.test.ts` checks every committed non-scratch entry for these and `open: 0`.
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
- Order inside `outputs()` (as built):
  1. once: rule (a), one label per fault key, over every shipped row's How-to, the shared modules and every `hands/hand-*.mjs` (`lint/family.mjs` `treeFamily`). It throws `library family (rows N, shared N, hands N): ...`;
  2. per shipped row: `refuseBack`;
  3. the family refusal (D-LIB5-FAMILY);
  4. for library rows only (registry rows after the 8): the lint, including `sheetWords`;
  5. after the loop: `stampProblems(ids)`, which throws one error listing every line.
- `inputsFor` lists `back-box.mjs`, its static imports and `docs/research/howto/shared/back-pain-box.json`; a test asserts that set.
- checkC17 runs on `tools/plates/library/shared` and on a temp directory holding a copy of library-gate.mjs.
- inputs() returns every file the plugin reads. Before Do 9 outputs() returns []; from Do 9 it returns only src/howto/red-flag-back.ts.
- library-shared.test.ts: the paths render() attributes to library-gate.mjs are exactly [] while back-box.mjs holds no box text, and ["src/howto/red-flag-back.ts"] after Do 9. No other generated file's header names the plugin. Each has its mutation (the plugin returns any other path → red; it returns red-flag-back.ts while the placeholder holds → red).
- checkC17 asserts [] and that each directory holds its file. Mutations: `fetch(` in a temp copy of library-gate.mjs, and in a temp copy of back-box.mjs, each red.
- PR evidence (never a committed pin): `git diff --exit-code <main sha> HEAD` is empty over content.mjs, ids.mjs, generate.mjs, `tools/plates/lib/**` and every path render() returns, and `generate --check` is green, on every head sent for review and on the READY head, headers included; after Do 9 the same, except red-flag-back.ts. Plus a one-time scratch-worktree demo: one comment byte in content.mjs, regenerate, and the diff lists the 8's ht-*.ts, ids.ts, archetypes.ts, sources.json and lib_*.json.
- After LIB-4c merges, on a registry with at least one shipped library row (E1's), an affectedIds test makes one call per changed path for library-gate.mjs, a lint module, research/stamps.mjs and reviews.json, and expects ids 'all' with `all: true`. If any case does not select every id, stop and report (LIB-4c owns affected.mjs).

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

## g. Shared modules (`tools/plates/library/shared/`) [N1, N11], as built

`card.mjs`:
- `sharedCard(key)` reads the copied card.
- `SPLIT` is D-LIB5-SPLIT's ruled field → [sheet path, copy-lint kind] table (14.3 point 1-3; contactPoint → `zooms[hand].rightNote`, label).
- `DATA` holds the fields never written to a text path: the "Not projected" list, keys, implement, the registry fields, the typed enums, `exempts` (14.5) and `prone` (14.6). `appliesTo` scopes a field and is exported as ids.
- `splitOf(card)` throws for an unruled field, and when two fields share a one-value path on one id: `${card}: split: ${path} has ${fields}` (14.3 point 4). A list path (`[]`) takes one entry per field (14.6 point 4).
- `RULED_JOINS = { 'rope-rule': { 'handling.width.text': ['handContact', 'grip'] } }` is the only ruled join (14.6 point 1): `width.text = handContact + ' ' + grip`, with claims c1-c3.
- `cardExport(card)` returns `{ card, appliesTo }` plus every shown field under its card name, with the card's own text and claim refs: steps as `setup`; variants as `{ <v>: { appliesTo, setup } }`; postureArchetype as `{ right, wrong }`; checkpoints with their own `appliesTo`. An unruled field or shape throws. No module ever retypes a string.

| Module | Exports |
|---|---|
| `hands.mjs` | PALM_FLAT, CURL, CUPPED_THUMB, ROPE |
| `implements.mjs` | BATTLE_ROPES, JUMP_ROPE, KETTLEBELL_SWING, MEDICINE_BALL_SLAM, WALL_BALL |
| `exemptions.mjs` | FRONT_RACK, WRIST_CURL |
| `moves.mjs` | GET_IN_OUT, SELECTOR_PIN, FOOT_BAR, UNRACK_RERACK, DUMBBELL_KICKUP |
| `checkpoints.mjs` | PRONE, FLOOR_BODY |
| `back-box.mjs` | the placeholder (section c) |

**S6** (`library-shared.test.ts`):
- each export equals its card, read independently in the test;
- the top-level keys are pinned, and no data field is exported;
- every ref resolves, with its sources in the card's registry;
- `lint/shared-cards.mjs` `sharedShownLint` places each shown field at its ruled path in one How-to-shaped sheet per scope (the card's ids, or a variant's setup list: the card's steps, then the variant's). It runs golden B's `lintHowto` unchanged plus the medical bans: 0 hits on 9eaa248;
- no free-text data value (appliesToWhy, notes, gaps, `.text` and `.basis` of data fields, the strings in `exempts` and `prone`) appears under `src/**` or in any generator output. `implement.text` is a typed exercise id and must name an exercises.json row (14.6 point 3);
- each check has its mutations.

**Family (D-LIB5-FAULTKEYS 4, D-LIB5-FAMILY):**
- The reader collects the 8's `handling.faults`, every shared export's `faults` and every `hands/hand-*.mjs` `VARIANTS[*].faults`.
- It asserts three things: the rows' count is above 0; the shared count is above 0; the hands count equals the faults the hand modules export.
- The fixture hand module `tests/howto/fixtures/lib5/hands/hand-fixture.mjs` (LIB-7's shape, 3 faults) proves it.
- On this head: rows 11, shared 14, hands 0, and no conflict. It also has no conflict against #193 (10 hand faults) and #191 (16).

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

**Research head: `claude/libht-research` @ `9eaa2480`** (lib4-cards 14.5). The tempo map and the form table below are D-LIB5-TEMPO8 as ruled in lib4-cards 14.7 (rows 1-15). The builder's copy is `TEMPO8` in `tools/plates/library/research/validate.mjs`; `tests/howto/library-cards8.test.ts` holds its own literal copies.

**Tempo map** (spec phase ← card plate.tempo field; spec in `tools/plates/vendor/exercises/<id>.mjs`). A moving phase takes `up` or `down`. The static phase right after the concentric takes `pause`, and it is left out when pause is 0 (LR-33, Q3). Any other static phase is a constant with a quote that states its seconds, or it has "no verified source" (`{ phase, from: null }`: the build throws `${id}: tempo: ${phase} has no verified source`, and the id stops).

| id | Map row | Result at 9eaa2480 |
|---|---|---|
| lib_dumbbell_lateral_raise | none (no spec; H6:not-engine) | stops on TOPFAULT `none` |
| lib_barbell_back_squat (:126) | Lower←down; Drive up←up; Brace←pause | built [Lower 2, Drive up 2] ≠ spec; also TOPFAULT `none` |
| lib_pull_up (:111) | Pull←up; Hold←pause; Lower←down; Rest: no verified source | throws on Rest |
| lib_hanging_leg_raise (:132) | Lift←up; Hold←pause; Lower←down; Rest: no verified source | throws on Rest |
| lib_lat_pulldown (:152) | Pull←up; Hold←pause; Return←down; Rest: no verified source | throws on Rest; also TOPFAULT `none` |
| lib_seated_cable_row (:90) | Pull←up; Hold←pause; Return←down; Rest: no verified source | throws on Rest |
| lib_leg_press (:139) | Lower←down; Pause = constant 1 (c15); Press←up; Rest←pause | built [Lower 2, Pause 1, Press 2, Rest 1] ≠ spec |
| lib_machine_chest_press (:164) | Press←up; Hold←pause; Return←down; Rest: no verified source | throws on Rest |

All 8 stop, so CARDS_8 is empty: no card gains a machine key, and each id keeps 'H6:no-card' (or 'H6:not-engine') and 'F7'. Plates, specs and cards keep their values. Commit 2 changes only the 7 ids' 'H6:no-card' and 'F7' reason text, with the D-LIB5-TEMPO8 entry in COACHING-DECISIONS. S3 and S12 run on the S3 fixture card (`tests/howto/fixtures/lib5/research/`).

**plateFacts form table** (`kind: 'angle'` on every row; one form per fact: a `measure: true` fact has no `joint`, a `joint` fact has no `measure`). No value is written, because all 7 stop on tempo.

| id | Vertex (spec measure) | Quantity measured | Form, pose |
|---|---|---|---|
| lib_barbell_back_squat | knee.r | knee bend from straight | `measure: true`, end |
| lib_pull_up | elbow.r | elbow bend from straight | `measure: true`, end |
| lib_hanging_leg_raise | hip.r | trunk-to-thigh angle at the hip | `measure: true`, end |
| lib_lat_pulldown | hip.r | trunk lean back from a plumb line at the hip | `measure: true`, end |
| lib_seated_cable_row | shoulder.r | the upper arm's sweep at the shoulder from start to end | `measure: true`, end |
| lib_leg_press | knee.r | thigh-to-shank angle at the knee | `measure: true`, end (the spec's 'end' is the bottom) |
| lib_machine_chest_press | elbow.r | the engine report's elbow.r angle | `joint: 'elbow.r'`, end |

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
- The clone inputs at `library-qa.test.ts` @ 72c94fc gain `research: null, mistakeFault: null` only if lib_pull_up is wired. If lib_pull_up is not wired, both stay as on main and the PR says why. Old lines in full:
  - :66 `    const r = await I.runQa({ ...c, id: 'lib_chin_up', mode: 'H' }, { ...base.ctx, browser: cleanBrowser(['lib_chin_up']) });`
  - :70 `    const named = await I.runQa({ ...c, id: 'lib_chin_up', mode: 'H', exemptions: ['F5', 'F7'] }, { ...base.ctx, browser: cleanBrowser(['lib_chin_up']) });`
  - New: `{ ...c, id: 'lib_chin_up', mode: 'H', research: null, mistakeFault: null }` and `{ ...c, id: 'lib_chin_up', mode: 'H', exemptions: ['F5', 'F7'], research: null, mistakeFault: null }` in those two places; nothing else on either line changes.
- When no id lost 'H6:no-card', S12 runs on the S3 lib5 fixture card.

**qa/approved.mjs lines (commit 2), only these:**
- Imports: add `join` from `node:path` and `ROOT` from `../../golden.mjs` (exported at `golden.mjs:15`).
- New: `export const CARDS_8 = [<verified, wired ids>];`.
- New: `` const cardResearch = id => { const c = JSON.parse(readFileSync(join(ROOT, 'docs/research/howto/cards', `${id.slice(4)}.json`), 'utf8')); return Object.fromEntries(['plateFacts', 'tempo', 'topFault'].filter(k => k in c).map(k => [k, c[k]])); }; ``. It is inlined, because candidate.mjs imports approved.mjs.
- `:20` @ 72c94fc, old line in full: `      research: null, census: CENSUS_8[LIB_OF[p.chromeId]] ?? null, mistakeFault: null, derivation: null, exemptions: [], ...(extra[LIB_OF[p.chromeId]] ?? {}) });`. Change: `research: null` → `research: CARDS_8.includes(LIB_OF[p.chromeId]) ? cardResearch(LIB_OF[p.chromeId]) : null`, and `mistakeFault: null` → `mistakeFault: CARDS_8.includes(LIB_OF[p.chromeId]) ? p.mistake.firstKey : null` (candidate.mjs:84's rule; F7 compares the plate against the card's TOPFAULT key).

## Open after the build

- Do 9: the owner's back-box answer (decision 6). Route (b) holds: the placeholder stays fail-closed, and S4-P holds.
- The variant-line field: no shown field exists yet (D-LIB5-VARIANT 4). It comes with the field card.
- LIB-9's inheritance comparator (D-LIB5-FAMILY 6) replaces `familyRefusal` in `lint/family.mjs`.
- The 8's machine cards carry no machine key (CARDS_8 empty, D-LIB5-TEMPO8). A later card may wire the five TOPFAULT matches (14.7).
- The back box on the layers page: LIB-6-PM.
