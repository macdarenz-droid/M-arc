# F-GEN-HELD-CLEAN: `generate` deletes the generated files that no plugin writes any more

Owner: supervisor (drafted 11-16; status `draft`). Branch: `claude/f-gen-held-clean`. Base: origin/main `2a898c3e` (train 103). Every file:line below was read on that commit unless another sha is named.

Builder: `claude-sonnet-5` (plan-w9.md:163, lane L2), with every step spelled out below, under Q-GHC-4; a fresh Opus reviewer follows. This is a tool card: no app screen changes, no stage flips, no saved or sent data. It frees no row, but every wave pays for its absence (plan-w9.md:151, :153).

Sources:
- W8c #429: LAYERS READY 6895186807 ("Found on the way: `generate` does not delete a held id's generated files, so a hold must remove them by hand") and rulings 6895200917 (D-W8C-MCHOLD: "remove the held id's generated files by hand, and add a check that no generated file exists for a held id. Follow-up: F-GEN-HELD-CLEAN, so `generate` deletes them itself");
- `plan-w9.md:129-134` (tool batch 1), `:151-153` (throughput cards); `lib-ship-card.md:80`, `:86`; `lib-ship-w9-card.md:96`, `:148`; `lib-ship-w10-card.md:269`.

Scratch checks (supervisor scratchpad, never committed), in a detached worktree of `2a898c3e` (`gen-scratch`):
- `ficscripts/ondisk.mjs`: plant five stray generated files, copies of dumbbell_shrug's with their headers, renamed `zz-held`, then list what `generatedOnDisk()` sees;
- the same tree through `node tools/plates/generate.mjs --check` (7 min 36 s on this box).
- A first try un-shipped a main id (dumbbell_shrug) and ran `generate`. It stopped in `gen/zooms.mjs:207` (lb03's pinned layers style), so that is not a fair model of a hold; the planted files are.

## The problem, in the code
- **A write run never deletes.** The main block writes every output and stops (generate.mjs:88-91). `generate.mjs` and `lib/inputs.mjs` contain no `rmSync` or `unlink`.
- **`--check` already fails on most strays.** It reports any file under `GENERATED_DIRS` whose first line is the GENERATED header and that no plugin wrote this run, as "stale: no plugin writes it" (generate.mjs:20, :67-68, :78).
- **But `GENERATED_DIRS` misses one folder.** It is `['src/howto', 'src/slices/howto/css', 'tools/plates/library']` (:20). `gen/content.mjs` also writes `docs/research/howto/sources.json` and one `docs/research/howto/<id>.json` per shipped row, each with the header (content.mjs:207, :211; lib-ship-card.md:80). Today that is 84 `lib_*.json` plus `sources.json`, and they are the only header files under `docs/`.
- **Measured** (`ondisk.mjs` on the planted tree):

  | planted stray | seen by the stale scan |
  |---|---|
  | `src/howto/generated/ht-zz-held.ts` | yes |
  | `src/howto/generated/feel-zz-held.ts` | yes |
  | `src/howto/generated/posture-zz-held.ts` | yes |
  | `src/slices/howto/css/zoom-zz-held.css` | yes |
  | `docs/research/howto/lib_zz_held.json` | **no** (0 `docs/` paths scanned) |

  `generate --check` on that tree: FAIL (exit 1), listing exactly the four `src/` strays as "stale: no plugin writes it" and nothing else. The research card is not reported, and nothing else on main is stale.
- **What a held id leaves behind.** A flip writes these per-id files:
  - `ht-<slug>.ts` (gen/plates.mjs, content.mjs:189-192);
  - `feel-<chromeId>.ts` (gen/feel.mjs:224);
  - `posture-<chromeId>.ts` (gen/zooms.mjs:199, :213), unless it is a text-zoom row;
  - `hand-<chromeId>.ts` and `zoom-<chromeId>.css` (gen/hands.mjs:159-160, :213);
  - `handpair-<key>.ts` (gen/handpairs.mjs:15, :60), per pair key, so it goes stale only when no shipped row uses the key;
  - `docs/research/howto/<id>.json` (content.mjs:211).
  The whole-set files (`loaders.ts`, `index.ts`, `ids.ts`, `lib-id.ts`, `coverage.ts`, `archetypes.ts`, `ids-node.mjs`, `sources.json`, the shared CSS) are rewritten whole each run (gen/ids.mjs:163-167, gen/plates.mjs:131, :135), so a held id drops out of them by itself.
- **Today each wave cleans up by hand.**
  - W8c deleted the files and added its own guard (`ship-w8c.test.ts:54-70`: `stray()` lists the ht/feel/posture/hand chunks, `docs/research/howto/<id>.json` and `zoom-<chromeId>.css` for its 3 held ids).
  - W9's card repeats the hand step (lib-ship-w9-card.md:96).
  - The lib2b test fixture already does what this card asks of `generate`: `for (const b of diff(out)) if (b.why.startsWith('stale')) rmSync(b.path)` (tests/howto/fixtures/lib2b/fixture.mjs:86-90).

## The change (smallest)
All of it is in `tools/plates/generate.mjs`. Exact code, against main's lines:

1. `:19-20`: add `'docs/research/howto'` to the list, and extend the comment:
   ```js
   /** The folders generated files live in; --check fails on a GENERATED file here that no plugin writes, and a write run
    *  deletes it (F-GEN-HELD-CLEAN). docs/research/howto holds gen/content.mjs's sources.json and <id>.json cards; only a
    *  file whose first line is the GENERATED header counts, so hand-written files there are never read as generated. */
   export const GENERATED_DIRS = ['docs/research/howto', 'src/howto', 'src/slices/howto/css', 'tools/plates/library'];
   ```
2. `:66-68`: `generatedOnDisk` takes `root = ROOT` (tests pass a temp tree); `ROOT` becomes `root` in its body.
3. A new export after it:
   ```js
   /** F-GEN-HELD-CLEAN: the GENERATED files on disk that no output of `out` is (a held or removed id's files). */
   export const staleOf = (out, root = ROOT) => generatedOnDisk(root).filter(p => !out.has(p));
   ```
4. `:70-80`: `diff(out, root = ROOT)`: `join(root, p)` for `join(ROOT, p)`, and its last loop reads `staleOf(out, root)`. Messages unchanged.
5. A new export, `write(out, root = ROOT)`: the write loop moved from `:89`, then `rmSync(join(root, p))` for each `staleOf(out, root)` path; it returns the removed paths. Add `rmSync` to the `node:fs` import (:14).
6. `:88-91`: the else branch calls `write(out)`, prints `generate: removed stale <path>` for each removed path, and keeps the last line byte-for-byte, `generate: wrote ${out.size} files (${ms} ms)`. Four suites match that text (c15-stamps.test.ts:363, lib-5v.test.ts:234, library-lint.test.ts:304, library-shared.test.ts:157), and a fifth matches `--check`'s `PASS, N files fresh` (library-rows.test.ts:115).

- `render()` (:40-63) is untouched, and `write` runs only after `await render()` has returned (:83). So a plugin error deletes nothing.
- `--check` is unchanged except that it now also scans `docs/research/howto`.
- Rejected:
  - (a) a per-id delete list. It must track every plugin's file names, and `handpair-<key>` is per key, not per id; the stale set is already what `--check` uses.
  - (b) a separate `clean` script or package.json step. Cards and tests call `node tools/plates/generate.mjs` directly, and package.json is the supervisor's.
  - (c) a plugin that deletes. Plugins only return outputs, and `--check` runs them too.

## The header churn (unavoidable)
- `tools/plates/generate.mjs` is a core file, hashed into every generated header's `inputsSha256` (lib/inputs.mjs:2-3, :15, :31). Any byte change to it moves line 1 of every generated file (about 455 files [est]: the 370 under today's dirs plus the 85 under `docs/research/howto`), and the `hashes: { inputsSha256 … }` line inside each `ht-` chunk.
- MANIFEST.json has no `tools/plates/generate.mjs` key (0 hits), so it does not move.
- **Known pin that goes red:** `pair-faults.test.ts:505-600` (F-HAND-PALMFLAT-SIZE's D-PFS-HEADERS block). Its `blanked()` hash (:534-537, constant `PFS_GEN_MAIN_SC` at :557) blanks line 1 only for its named lists, so a header moved anywhere else turns it red.
  - The fix is the W8b and W8c form: a `ghcGenText` transform that blanks line 1 and drops the `hashes:` line, for exactly the files whose only change against main is the header. It runs first, and every other red in the block is kept.
  - This is the D-GHC-PINS list, ruled at PLAN (Q-GHC-3).
- Other suites that read headers match a pattern, not a value (lib-shapes.test.ts:141, :256; library-shared.test.ts:108; generated-module.ts:7). The PLAN's full `npm test` run finds any other red.

## Open PRs and the merge slot
`git diff --stat origin/main...origin/<branch>` on 11-16:
- **#433 W9** (`claude/lib-ship-w9` @ `1c99e51a`, 357 files) and **#434 W10** (`claude/lib-ship-w10` @ `2937e831`, stacked on W9, 357 files).
  - Neither touches `tools/plates/generate.mjs`, `tools/plates/lib/**` or `gen/**`.
  - Both touch 174 files in `src/howto/generated`, 56 in `docs/research`, 61 in `src/slices/howto`, `src/howto/coverage.ts`, `src/howto/ids.ts`, `ids-node.mjs` and MANIFEST.json. Each of those headers is one this card also moves.
- **#435 F-HARNESS-FEEL-GRIP** (`claude/f-harness-feel-grip` @ `8c460a40`, 9 files): tests, `tools/plates/fidelity/goldenB.mjs`, `library/fidelity.mjs` and `fidelity/**`. No generated file and no generator file, so there is no conflict.
- **Why it cannot go inside a wave:** ship waves never touch `tools/plates/generate.mjs` (lib-ship-card.md:86) or `gen/**` (lib-ship-w9-card.md:148, lib-ship-w10-card.md:269). So it is its own PR, merged between waves (plan-w9.md:129-134: tool batch 1, "before W11's LAYERS READY").
- **How it avoids conflicts:**
  - It edits no file a wave edits by hand. The only overlaps are generated header lines, and the rule there is to regenerate, never hand-merge (D-PFS-HEADERS; lib-ship-w9-card.md:95; lib-ship-w8c-card.md:73).
  - So whichever lands second merges main with a merge commit and runs `node tools/plates/generate.mjs` once.
  - The slot (Q-GHC-2): merge right after W9 merges and before W10's READY. W10 must merge main after W9 anyway (D-W10-STACK), so one regenerate covers both. Never merge it while a wave is in READY review, because that moves main under the review.

## Rulings asked
1. **Q-GHC-1: "stale" is any header file under `GENERATED_DIRS` that no plugin writes this run** (the set `--check` already reports), not a per-id list; and `docs/research/howto` joins `GENERATED_DIRS`.
   - Recommended: yes. It covers every per-id file kind without a list to keep in step. It is what `--check` and the lib2b fixture already use. Hand files in `docs/research/howto` (cards/, quotes/, shared/, reviews.json, CARD-V2.md) carry no header, so they are never deleted.
2. **Q-GHC-2: the merge slot.** After W9 merges, before W10's READY (or else right after W10 merges); never during a READY review.
   - Recommended: yes. One regenerate serves the stacked W10, and the next wave cards (W10 onward) can drop their "delete by hand" step.
3. **Q-GHC-3: D-GHC-PINS, the header pins it must re-measure,** starting with `pair-faults.test.ts:505-600`.
   - Recommended: the W8c form (`checks/ship-w8c.ts:315` `w8cGenText`). A `checks/ghc.ts` helper holds `GHC_GEN_HEADERS`, the exact list of files whose only change against main is line 1 and the `hashes:` line, and `ghcGenText`. The PFS block applies it first; its constants and every red stay. New reds: a body byte moved in a GHC header-only file; a file left out of the list.
   - Each other red the full run finds is listed in the PLAN and ruled one by one.
4. **Q-GHC-4: a Sonnet builder.** The code change and its test are spelled out exactly above and below. The only judgement work is the D-GHC-PINS transform, and Q-GHC-3 rules it line by line at PLAN.
   - Recommended: Sonnet, with a fresh Opus reviewer. If the PLAN's full run shows more than header-only reds, or a red outside `pair-faults.test.ts`, the supervisor moves the card to Opus, since those need judgement the card cannot spell out.

## Write scope
- `tools/plates/generate.mjs`: the six edits above only.
- A new `tests/howto/f-gen-held-clean.test.ts`.
- A new `tests/howto/checks/ghc.ts` and the ruled D-GHC-PINS lines in `tests/howto/pair-faults.test.ts` (and any other test the PLAN lists and the ruling names).
- Every generated file, header lines only, by running `node tools/plates/generate.mjs` (one commit, `[golden update]`, D-PFS-HEADERS). Never hand-edited.
- No AGENTS exception is needed: `scripts/screenshot-gate.mjs` (its `generate --check` call at :6538 is unchanged) and `tests/theme.test.ts` are not touched.
- No saved or sent data: a build tool in `tools/`, plus header lines of generated files.

## Steps (every step spelled out)
1. Read `.claude/skills/builder/SKILL.md`. Branch `claude/f-gen-held-clean` from origin/main (name the sha). Open a draft PR 'F-GEN-HELD-CLEAN'.
2. Write `tests/howto/f-gen-held-clean.test.ts` (Acceptance G1-G4) and run it on the base. Post the red lines.
3. In a scratch worktree of the base (never committed), make the six edits, run `node tools/plates/generate.mjs`, then the full `npm test`. Post every red file:line, with whether it is header-only.
4. Post `F-GEN-HELD-CLEAN PLAN @ <sha>` with: the reds of step 2; the step-3 list as the D-GHC-PINS proposal, each line before and after; the G5 recipe; the merge slot. Wait for 'F-GEN-HELD-CLEAN PLAN RULED'.
5. Make the six edits on the branch. Run the new test, `generate.test.ts`, `library-core`, `library-rows`, `library-shared`, `library-lint`, `lib-5v`, `lib-4d`, `c15-stamps`, `library-ci`, `feel.test.ts` and `ship-w8c.test.ts`. All are green with no edit except the ruled D-GHC-PINS lines.
6. Run `node tools/plates/generate.mjs` and commit the header lines alone as `[golden update] F-GEN-HELD-CLEAN: regenerate headers (generate.mjs is a core input)`. Check that `git diff origin/main` on the generated files touches line 1 and `hashes:` lines only (a grep of `+`/`-` lines without `inputsSha256` is empty).
7. Apply the ruled D-GHC-PINS lines. Run `node tools/plates/generate.mjs --check` (PASS).
8. **Scratch end-to-end (G5, never committed):** in a scratch worktree of the branch, plant the five `zz-held` strays as in the scratch check above. Run `generate`: it prints five `removed stale` lines, the five planted files no longer exist, and `git status --short` is empty. Then `generate --check`: PASS. Post the output.
9. Merge origin/main with a merge commit and regenerate (never hand-merge headers). Run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate` once. Post `F-GEN-HELD-CLEAN READY @ <full sha>`.

## Acceptance
| id | check | evidence |
|---|---|---|
| G1 | Every tracked file whose first line is the GENERATED header (`git ls-files`, first line read) lies under a `GENERATED_DIRS` entry. On main: 85 `docs/research/howto` files lie outside | the test, red on main |
| G2 | `write(out, tmp)` on a temp tree with one planted header stray of each kind (ht-, feel-, posture-, hand-, handpair-, zoom-*.css, `docs/research/howto/lib_zz.json`), one headerless file in each folder, and one output: removes exactly the 7 strays, returns them sorted, writes the output, keeps every headerless file | the test (on main `write` does not exist: red) |
| G3 | `diff(out, tmp)` on the same planted tree, before `write`, lists all 7 strays as "stale: no plugin writes it", the research card included; after `write`, it lists none | the test (on main the card stray is missing: red) |
| G4 | A write run prints one `generate: removed stale <path>` line per removed file, and its last line is still `generate: wrote N files (… ms)` | the suites named in change point 6, unchanged and green; G5's posted output |
| G5 | The scratch end-to-end (step 8): five strays removed, `--check` PASS; before the change, `--check` reports the four `src/` strays and not the research card | posted output |
| G6 | Nothing else moves: the diff is generate.mjs, the new test files, the ruled D-GHC-PINS lines, and header lines only; MANIFEST.json unchanged; `generate --check` PASS | `git diff --stat`; the grep in step 6 |
| G7 | `ship-w8c.test.ts:54-70` (W8c's held-id guard) is byte-identical and green | `git diff`; the suite |
| G8 | The READY head contains the latest main; check, test:tz, the gate and CI are green; no closing keywords in commits or the body | CI links; a grep |

## Mutations
Each must turn a named check red. Post the red lines.

| id | mutation | red |
|---|---|---|
| m1 | `'docs/research/howto'` left out of `GENERATED_DIRS` | G1, G2 (the card stray kept), G3 |
| m2 | the `parseHeader` filter dropped from `generatedOnDisk` | G2 (a headerless file deleted) |
| m3 | `write` stops after the write loop (no delete) | G2 |
| m4 | `write` deletes before writing, with an output path also planted as a stray | G2 (the output's text must be the new text; the stray list must not hold it) |
| m5 | the D-GHC-PINS transform blanks one more file than `GHC_GEN_HEADERS` lists, or a body byte moves in a header-only file | the ruled pair-faults reds |

## Stops (post and wait)
- A suite in step 5 goes red for a reason other than the header churn (for example, a temp-tree test whose tree now loses a file it expected to keep).
- The full run shows a red outside `pair-faults.test.ts` that is not header-only.
- `generate --check` on the branch finds a stale file under `docs/research/howto` on main's own tree. That would be a real stray on main; name it and do not delete it here.
- A wave PR is in READY review when this card is ready to merge (Q-GHC-2).

## Never
- `tools/plates/gen/**`, `tools/plates/lib/**`, any plugin's outputs by hand, `render()`'s body.
- `scripts/screenshot-gate.mjs`, `tests/theme.test.ts`, `.github/**`, `package*.json`, `tests/howto/fixtures/lib2b/fixture.mjs`.
- `src/**` beyond regenerated header lines; any research card, quote or `reviews.json`.
- `escobar-worker/**`, `native/wear/**`, signing and keystores, saved-data shapes.
- Loosening a check: `--check` keeps every row it has; no skip, no wider list, no removed mutation.

## Risks
- **Deleting something that is not generated.** Mitigation: only files whose first line is the exact GENERATED header (lib/inputs.mjs:41), only under `GENERATED_DIRS`, and only after a full `render()`. G2 and m2 cover it.
- **Header churn collides with W9 and W10.** Mitigation: the merge slot (Q-GHC-2), and regenerate-only merges (D-PFS-HEADERS). It costs one 7-minute regenerate and one CI run for the lane that lands second.
- **Temp-tree tests change behaviour.** Many suites run `generate` on a copied tree (library-ci, library-rows, library-shared, library-lint, lib-5v, c15-stamps). A write run now deletes strays there too. Mitigation: step 3's full run before PLAN; any change is a Stop.
- **Other tasks' header pins.** Mitigation: Q-GHC-3, in the W8c form, with its reds kept.
- **CI time.** A core change puts the PR in a full CI class (ci/affected.mjs:22 `NOT_CLASS3`). Mitigation: one full run per push; push once per step.

## Forecast [est]
- Tests and the scratch full run 2-3 h (one full `npm test` and two 7-minute generates); PLAN and ruling 1 h; build, regenerate and pins 2 h; G5 0.5 h; CI about 94 min; review 1-2 h.
- **READY in about 1 working day; merged at the next slot between waves.**
- Uncertainty: the number of D-GHC-PINS lines (one block known), and the merge slot.

## Unverified
- That `pair-faults.test.ts:558-570` goes red under the churn. This is read from its `blanked()` code (:534-537), not run.
- That `generate.test.ts`'s header recompute (:137-) passes for the 85 research files once they are scanned. content.mjs's `inputsFor` covers both paths (content.mjs:56-61), but the test was not run.
- That no temp-tree suite relied on a stray surviving a write run.
- The exact count of moved headers (about 455 [est]).

## Supervisor rulings (2026-11-16; these win over the text above)
- **D-GHC-STALE** (Q-GHC-1): yes. Add a test that a header-less file planted in `docs/research/howto` survives `generate`, and that a planted stale header file there is removed and is red on `--check` before the run. Every hand file in `docs/research/howto` stays byte-equal (list them in the PR).
- **D-GHC-SLOT** (Q-GHC-2): yes. It starts after W9 merges and merges before W10's READY, or right after W10 merges; never while a READY review is open.
- **D-GHC-PINS** (Q-GHC-3): yes, the W8c form, ruled line by line at PLAN.
- **D-GHC-MODEL** (Q-GHC-4): a Sonnet builder with a fresh Opus reviewer. If the PLAN's full run shows any red that is not header-only, or a red outside `pair-faults.test.ts`, the builder stops and the supervisor moves the card to Opus.
