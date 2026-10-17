# LIB-4: library CI (rulings and cards)

Drafted by supervisor workflow wf_30450ee7-ad0 on 2026-10-17 (three analysis lenses, one draft, one adversarial critique); corrected text below is the critique's. The supervisor adopted it with the decisions in section 7.

## LIB-4 rulings

Checked on main `c14212af`. Branch heads:
- #194 GATE-SPLIT `5c8a8faf`
- #219 wiring `4cbac5ae`
- #189 LIB-2 `54d37f2d`
- #180 LIB-3 `4540d827`
- #181 LIB-6 `9b8f76e6`
- #109 pilot A `e6f39ffb`
- #221 watch lane `a779532b`

Line numbers are on main unless a branch is named. On #189, `harness.mjs` moves by −1 between lines 183 and 196 and by −3 after them, so A1 is at :810. HT-6 A8 moves by +4, to sg.mjs:6574. Builders find each place by its function or test name on their own base.

## Summary

**Three cards.** LIB-4 is too big for one builder, so it becomes three cards. LIB-4 is done when all three have merged, so `depends_on: LIB-4` for LIB-8 and LIB-9 stays correct.
- **LIB-4a** (S, opus): the existing checks at scale. It changes no shared-file owner.
- **LIB-4b** (L, opus): the per-id runner.
- **LIB-4c** (M, opus): rebuild, plan, mode, shard and the verdict family.

**Four facts from the code.**
1. **Other tasks' blocks.** FG-OFF G6, HT-2 A9 and HT-6 A8 are other tasks' gate blocks. `.claude/rules/shared-files.md` says: stop, and the supervisor settles it "by changing the design so it avoids the change". No design avoids it:
   - At full coverage the no-How-to control has no subject.
   - A9's expected set is plates.json's 8 by construction (LIB-2 design 4).
   - Renaming library chunks away from `ht-` would hide them from HT-10's C17 and C18.

   So the ruling is an edit, made under plan risk 22 ("goes to the supervisor for that task's decision, never a silent edit"). The precedent is #224 (D-GF3-1), which edited HT-6's block lines 6487-6700 under a supervisor card. The AGENTS.md table gets a pointer line.

   HT-6 A7's prefix match cannot bite: library hands ship as `handpair-*`, and A7's count plus hands.test fire first. It is hardened through D-LIB4-A4 (b) in ht10.mjs, and HT-6's block stays untouched.
2. **Tuple keys.** `coverProblems` keys on `id|theme|state` (shard.mjs:72), so each library state must name its check and width.
3. **Needed jobs.** `tests/ci-verdict.test.ts:48` hard-codes the four needed jobs (`OK_NEEDS`). Changing `REQUIRED_NEEDS` would therefore turn GATE-SPLIT's own tests red. The library family checks its own two jobs. `verdict()` line 33 already turns any needed job that did not succeed red.
4. **Fixtures.** LIB-2's `syntheticRoot`:
   - copies no `scripts/` or `tests/`;
   - rewrites only `ids.ts` and `loaders.ts`, not `ids-node.mjs`, which the harness control reads;
   - makes clones that have no spec and no How-to source.

   So LIB-4a writes every `gen/ids.mjs` output into its copies, and LIB-4b and LIB-4c use source-level scratch ids (D-LIB4-FIXTURE).

**K.** Integer-aware packing under the 15-minute rule, and always at least 1.
- K = 5 at LB1 (14 ids) and K = 49 at 145 ids [est].
  - t = 270.8 s per id: LIB-1's 280.8 s minus 10.0 s per id of once-per-run blocks (HT-1, HT-2, HT-3b), local Chromium 141.
  - Per-id PQ-H, the offline open, the entry and the layers-page compare are not measured yet, so these K are lower bounds until C14.
- At LB10 a full run costs about 852 runner-min [est, model in `lib4/model.py`]:
  - 52 min wall at C = 20, 44 min at C = 27, 82 min at C = 12;
  - 2 full runs per merge.
- The APK now starts after the library shards. At C = 20 it arrives about 35 min later than with the gate alone [est].

**Owner question.** One fact goes into the next owner message that is already needed: which GitHub plan the account is on, since that sets the concurrent-job limit (27 jobs ran at once on 10-04).

## 1. Supervisor rulings

| Id | Decision | Why nothing is loosened | Implements / by when |
|---|---|---|---|
| **D-LIB4-SPLIT** | **LIB-4a** owns every edit to an existing check file: the harness control lines, FG-OFF G6, HT-2 A9, HT-6 A8, `ht10.mjs` A4, both error printers, the FG-OFF control test, the pinned-to-8 unit tests LIB-2 leaves (D-LIB4-PINS), and one new LIB-4a gate block.<br>**LIB-4b** owns the runner (new paths), additive harness options (D-LIB4-OPEN) and the scratch fixture builder (D-LIB4-FIXTURE).<br>**LIB-4c** owns the CI scripts (new paths) and a CLI-only seam in `scripts/ci-verdict.mjs`.<br>Checklist slots 3a, 3b and 3c replace slot 3, and merge in that order. | Each card keeps every existing assertion. Work is only divided up. | Supervisor, now. |
| **D-LIB4-SCOPE** | For each library id, the shards prove every per-id state that the HT-3..HT-10 blocks prove for the 8, including HT-4's HT4-A5/A6. They also prove plan 3.6's list: L2, L2b, F3, L3, L4, the layer states, PQ-H1..H10 as the full runQa report (node and browser halves, `ok`), and the offline open.<br>The matrices are HT-3's: N and M at 390 px in 5 themes; every callout and tell, A6's restore, and 360/340 px in `HT_FULL` = silent-black and paper (harness.mjs:576, :698-735; HT-3 card L3). Plan 3.6's L3 line means this matrix.<br>L1 is LIB-4c's job. L0-lib (`library/MANIFEST.json`, LIB-2 design 4) is LIB-2's; if #189 merges without it, LIB-4c builds it.<br>Layer pixels compare with the id's layers page from LIB-6; the 8 compare with golden B.<br>LIB-4b's design note lists each check with its source block and line. Anything left out is a named supervisor exemption. | It equals plan 3.6 for the layer states and adds HT-10's per-id sweep, which 3.6 does not list. Nothing is sampled, and no theme or width is dropped against the 8. | Supervisor rules on LIB-4b's design note before bulk build; amends plan 3.6. |
| **D-LIB4-OPEN** | Plan 5.4's "HT-3's harness is not edited" becomes "only additive options whose defaults keep every existing call identical".<br>The options:<br>- `openAppTrain(…, { order = HT_ORDER, custom = HT_CUSTOM })` (harness.mjs:231 and :235);<br>- `ht10Sweep(…, { order, custom, indexOf = id => HT_PLATES.findIndex(p => p[0] === id) })` (:1311, :1317, :1351).<br>Further options only if the design note shows they are needed, under the same rule.<br>The per-id checks that live in gate blocks cannot be imported: HT-4 A5/A6, HT-6, HT-7, HT-8, HT-9 C19, Show, Order and HT-9 itself. The runner re-implements them as twins, each pinned by B3's tripwire.<br>A later card that edits a twinned block re-runs B2 and re-pins that twin in the same PR. The supervisor adds the pin line to that card's write_scope. | The defaults are unchanged, so every HT block and `ht10-gate` stays green. Precedents: GATE-SPLIT's `writeProof` `meta`, and LIB-2's `HT_PLATES` move. | LIB-4b, first commit. |
| **D-LIB4-SHARD** | One sharding system:<br>- `packShards` and `jobFromEnv` (shard.mjs:111-143 on #194);<br>- `SHARD_TARGET_S = 900` and `JOB_BUDGET_S = 1800`;<br>- `timeout-minutes: 30` on both new jobs.<br>**K** is the smallest K ≥ 1 for which every packed shard has c0 + offset + Σ planned seconds ≤ 900. Shard 1's offset is the once-states. If one id alone is over the target, each id gets its own shard and a note is printed. K ≥ 1 even with 0 ids.<br>**Timing file:** `tools/plates/library/ci/times.json`. An unmeasured id uses the maximum measured per-id time, or `default` while none is measured. Batch PRs never edit the file; the supervisor refreshes it from the proofs.<br>**Plan edits:** amend plan 5.4:564 and :588. Reword :596: the entry condition stays and moves before LB1 (D-LIB4-ENTRY). Amend SPEED.md:62. | The 900 s target and the red line at 1,800 s are GATE-SPLIT's, unchanged. Integer-aware K is stricter than ceil(load/900), which would give 46 shards at 145 ids with 7 of them over 900 s. | LIB-4c builds it. Supervisor amends the docs. |
| **D-LIB4-MODE** | CI cannot see draft or ready: build-apk.yml:3-9 has push and `workflow_dispatch` only, with `contents: read`. The mode follows the ref and the event instead:<br>- **full** on `^refs/heads/(main\|claude/sup-merge-train-\d+)$` and on any `workflow_dispatch`;<br>- **affected** on every other push, using LIB-4c Do 3's ordered first-match rule.<br>The affected set fails safe for an unclassified path and when `git fetch --depth=1 origin main` fails: both select every id. The neutral classes are a stated bet: the 8's HT blocks cover the shared shell on every push, and the library gets it on the full train-head run.<br>The verdict recomputes the mode and prints it in the PASS line and the step summary. Only `library: full` counts as merge evidence. No nightly run, and no reuse of a green run for an identical tree (that would need `actions: read`). | Merges still need a full run on the train head and on main. This replaces plan 5.4:592 ("ready-for-review heads"), which cannot be built. | LIB-4c builds it. Supervisor amends plan 5.4 and risk 9. |
| **D-LIB4-VERDICT** | The library is a family inside `gate-verdict` (D-GATESPLIT-ONE); there is no `howto-verdict`.<br>The family recomputes at the sha: the mode, the ids (affected mode: from the rebuild proof's base sha and changed list), K, the plan hash and the expected tuples. It is red on any of these:<br>- a wrong sha, or a missing, duplicate or extra shard;<br>- a shard's `meta.ids` differ from its planned ids;<br>- a `coverProblems` miss;<br>- a fail row;<br>- a row whose state does not encode its check and width;<br>- the rebuild proof does not cover every pinned page in `tests/howto/golden/library/*.json` exactly once and passing;<br>- a shard's re-checked page shas differ from the rebuild proof;<br>- `www` differs from the gate family's, or `chrome` differs;<br>- `tz ≠ UTC`;<br>- a shard over 1,800 s (over 900 s prints a note);<br>- affected mode on a full ref;<br>- library ids ∪ the 8 ≠ `shippedIds()`;<br>- a needed `howto-*` job is missing, or did not succeed.<br>The library runs in UTC only, which is valid while the C-TZ test (C7) passes.<br>`android-gate` waits for the family through `gate-verdict`. That adds about 2.5 min after the verdict on the merge path, but the APK now starts after the library shards: about 35 min later at C = 20 [est]. | It is one more family under the same rules. GATE-SPLIT's `verdict()`, `collect()`, `REQUIRED_NEEDS` and their tests stay byte-identical. | LIB-4c. Supervisor records it in plan 5.4 (:571-577, :594-595) and GATE-SPLIT design 3.5. |
| **D-LIB4-CTRL** | The no-How-to control at full coverage:<br>(1) `firstWithoutHowTo()` returns `null` when every `exercises.json` id has a How-to. The empty-list throw stays, and `HT_ORDER` drops the null.<br>(2) FG-OFF G6 seeds and asserts the library control only while it is not null (sg.mjs:6223-6268).<br>(3) HT-3 A1 (in `ht3Behaviour`, harness.mjs:813) and HT-6 A8 (sg.mjs:6570) skip only the null library pair; both keep `HT_CUSTOM`.<br>(4) The new LIB-4a block always asserts, in silent-black and paper, that the seeded custom exercise's card opens and has no `.ht-entry`. That keeps G6's two themes covered: HT-3 A1 runs this negative only in paper, and HT-6 A8 checks hints, not the entry.<br>(5) A tripwire test: null ⇔ every `exercises.json` id ships.<br>(6) Every library id gets a positive `entry` row (LIB-4b).<br>This also fixes the full-coverage crash of `ci-verdict.mjs:127` and of the runner. | At full coverage the library negative has no subject. The `hasHowTo`-false branch stays pinned by no-form-guide.test.ts (:36, and the bad-id list at :157 on main) and by the tripwire. The custom negative keeps a guard that bites: LIB-4a A3's mutation removes both guards. | LIB-4a. Hard deadline: before LIB-22 starts. Planned: before LIB-9. Recorded under D-HT1 (risk 22). |
| **D-LIB4-A9** | HT-2 A9:<br>- The per-row checks on the 8 are unchanged (sg.mjs:6422-6431).<br>- The two-line extra-chunk filter (:6433-6434) becomes a call to a new helper. Every shipped registry row, the 8 included, must have exactly one chunk matching `^ht-${slug}-[\w-]{8}\.js$`, with the slug valid per `^[a-z0-9]+(-[a-z0-9]+)*$`. Every `ht-*.js` file must match exactly one row; any other `ht-` file is red.<br>- There is no exception for an index chunk: LIB-2's is `loaders-*.js` (D-LIB2-loaders). | It is stricter. Today a stray chunk passes when its name starts with an approved slug, as `ht-leg-press-calf-raise-*` did in LIB-1 job 111349253024. | LIB-4a, before LIB-9 pushes its first shipped row. Recorded under HT-2's decisions. |
| **D-LIB4-A4** | `ht10.mjs` A4, extending D-LIB2-A4:<br>(a) The `ht-` JS set is exactly one anchored chunk per shipped slug.<br>(b) The `hand-` set is exactly the 8's `^hand-${chromeId}-[\w-]{8}\.js$`. This also settles HT-6 A7's prefix risk; D-LIB4-ANCHOR folds in here.<br>(c) The C18 loop (`ht10CssProblems`, :195) also covers `handpair-*.js` and `loaders-*.js`. C17 on those chunks is LIB-2's A26 (#189 sg.mjs:8930-8975) and is not repeated.<br>The set at :168 and the total at :172-173 stay as they are. LIB-2's A25 covers the superset total, and batches re-set the "How-to total" per LIB-2's rule (L2-A23). `ids` at :70 stays the 8. | It is stricter: exact names, and two more chunk kinds under C18. No ceiling moves. | LIB-4a, before LIB-9. |
| **D-LIB4-ANCHOR** (replaces the triage proposal) | HT-6's block is **not** edited, and no new hand check is added: D-LIB4-A4 (b) makes the prefix matches at sg.mjs:6580, :6679 and :6724 unable to credit the wrong chunk. Plan 2.3:177 is corrected to `handpair-<key>.ts`. | It adds a check in A4. Nothing is removed. | LIB-4a. Supervisor fixes plan 2.3. |
| **D-LIB4-PINS** | Before it merges, LIB-2 makes these follow the data:<br>- `library-core.test.ts` :346 (a literal control id, red at LB2), :363 (`toBe(8)`, red at LB1) and L2-A16's null branch (:344-349);<br>- every unit test that LIB-1 R6 lists as pinned to exactly the 8 (27 today, 30 on lib2), for example no-form-guide.test.ts :157-162 on #189 (`lib.filter(hasHowTo)` must equal GOLDEN's 8).<br>Whatever LIB-2 leaves, LIB-4a changes. It lists them by running `npm test` on the 22-id scratch tree and names each changed assertion in its PR. | The assertions follow the registry, and each value at the 8 is unchanged. | LIB-2, or else LIB-4a. Before LIB-9. |
| **D-SUP-ERRLIST** | New `scripts/error-list.mjs` exports `formatErrors(errors)`: a count line `Page errors (N):`, then one `[i/N] …` line per error. The gate tail (sg.mjs:8883; #194 :8996) and `scripts/ht10-gate.mjs:37` print with it, then exit 1. | It only adds output. The tail is outside every block, and GATE-SPLIT's E7 is unaffected because LIB-4a merges after #194. | LIB-4a, before LIB-9 (soft). |
| **D-LIB4-FIXTURE** | Scratch ids for LIB-4b B5 and LIB-4c C11-C14 are built at the source level:<br>- each copies one of the 8's plate spec into `tools/plates/library/specs/` and its golden-B How-to source into `tools/plates/library/howto/<id>.howto.mjs`, with the id and chromeId swapped;<br>- they sit in a scratch batch file with stage `shipped`, and the repo generator writes every output;<br>- pages are built by `buildPlatesPage` and `build-layers-page.mjs` (with #181) and pinned in a scratch batch golden file;<br>- they are never merged.<br>`syntheticRoot` clones stay for LIB-4a only, through `write-ids.mjs`, which writes all five `gen/ids.mjs` outputs and re-sets the budgets in the copy.<br>If LIB-2's generator cannot emit a library id from source, LIB-4b stops and reports, because that would block LIB-9 too. | The tuples come from real sources, so nothing is mocked. | LIB-4b day 1, in its design note. |
| **D-LIB4-ENTRY** | Before LIB-9 pushes, all of these hold:<br>- GATE-SPLIT (#194 and #219) is merged;<br>- LIB-4a, LIB-4b and LIB-4c are merged;<br>- the CI calibration is committed (LIB-4c C14);<br>- **5 consecutive identical full runs of the library family at K ≥ 2 on one sha** (LIB-4c C13). They are dispatched one after another and compared by `tools/plates/library/ci/compare.mjs`; a cancelled run is dispatched again and not counted;<br>- HT-3's 5 identical CI reruns (plan 5.4:596). E8's runs count only when they are on one sha with identical HT-3 lines; otherwise dispatch 5 runs on one main sha.<br>A flake is root-caused, never re-run to green. | It is the plan's own entry condition, moved before LB1 because LB1 needs K = 5. | Supervisor. |
| **D-LIB4-PAR** | LIB-4b measures 1 page against 4 pages inside a job on the 8 and reports `nproc` and the speed-up. It adopts more pages only when both modes give identical rows and identical px. If P > 1 is adopted, B2 (both browsers) and C13 run at that P. | It is adopted only at 0 px difference. It is the only lever on runner-minutes. | LIB-4b. |
| **D-LIB4-QUEUE** | No `max-parallel` cap for now; train and main runs are the merge critical path.<br>The supervisor acts on either trigger: the first howto-shard of a train or main run waits more than 15 min, or a non-library lane waits more than 30 min.<br>The fix is add-only and on the new jobs only: a cap for non-full refs, after the scratch branch shows that `strategy.max-parallel` accepts an expression (not verified yet). | Scheduling only. Full runs are never capped. | Supervisor. |
| **D-LIB4-DOCS** | Amend:<br>- plan 3.6: the L3 wording, and "the 8 keep their HT-1..HT-10 blocks, unchanged" becomes "unchanged for the 8; A1, A8 and A9 extended under D-LIB4-CTRL and D-LIB4-A9";<br>- plan 5.4: :551, :562-564, :571-577, :584-601;<br>- plan 5.5, section 7 row 3, section 9 item 3, risk 9;<br>- SPEED.md:62 and its capacity line :25 (C = 12-27);<br>- GATE-SPLIT design 3.5 (job name `howto-shard`);<br>- the AGENTS.md file-ownership row for `scripts/screenshot-gate.mjs`: one pointer line to D-LIB4-CTRL and D-LIB4-A9 (risk 22).<br>Figures:<br>- 269-281 s per id locally, and 274 s on CI with once-per-run included;<br>- about 852 runner-min per full run at 145 ids [est];<br>- 2 full runs per merge;<br>- the APK about 35 min later at C = 20 [est]. | Docs only. | Supervisor, before the cards are `ready`. |
| **Owner fact** | Which GitHub plan the account is on, since it sets the concurrent-job limit. Bundled into the next owner message that is already needed. | — | Supervisor. |

## 2. Order

1. **#194, then #219.** #219 must re-merge #194's final head, because it carries `0df96482`. LIB-4a's gate edits go inside GATE-SPLIT's guarded blocks.
2. **#189 (LIB-2), then #180 (LIB-3).**
3. **3a LIB-4a.** It builds now on the #189 and #194 heads, and merges after #189, #194 and #180 (checklist order).
4. **3b LIB-4b.** It builds now on #189, #180 and LIB-4a's head. #181 is merged on scratch branches only.
5. **3c LIB-4c.** It builds now on #189, #180 and LIB-4b's head.
   - Its `ci-verdict.mjs` seam is the last commit, made after #194 merges.
   - It merges in one train with the supervisor's wiring branch.
6. **#181 (LIB-6) and later, #109 (LIB-8), then LIB-9.**

**Forecast** [est]:
- LIB-4a: 1-1.5 days to READY. The local scratch gate takes about 60 min per run at 153 ids.
- LIB-4b: design note with the fixture ruling on day 1; READY after 3-4 days.
- LIB-4c: plumbing in 1.5 days. Then the scratch-branch evidence: about 10 dispatch runs at 25-35 min wall each, run one after another.

**Uncertainties:**
- #194's delta review;
- whether LIB-2's generator emits a library id from source (D-LIB4-FIXTURE);
- how far D-LIB4-SCOPE grows LIB-4b;
- per-id PQ-H and layers-page times;
- runner capacity C;
- flakes in the 5 identical runs.

## 3. Card LIB-4a: existing checks at scale

```
id: LIB-4a
model: claude-opus-5-5
base: main c14212af; merge origin/claude/lib-2-scale-core (54d37f2d) and origin/claude/gate-split (5c8a8faf) first, and their final heads before review
depends_on: LIB-2, GATE-SPLIT
build_prerequisites: none (builds now on the heads above)
merge_prerequisites: #189, #194 and #180 merged (checklist order); review passed; checks green on a head containing latest main; checklist order (3a)
shared-file owners: scripts/screenshot-gate.mjs is shared and add-only. Under D-LIB4-CTRL/A9 (risk 22) this card edits exactly the lines listed in write_scope, adds one top-level block named LIB-4a, and edits nothing else. tools/plates/fidelity/ht10.mjs is HT-10's (D-LIB2-A4 hands the A4 count here). harness.mjs is HT-3's (control lines only).
```

**Outcome.** The checks this card owns stay correct and at least as strict at 22 and at 153 shipped ids, and nothing crashes at import when every id ships. Those checks are FG-OFF G6, HT-3 A1, HT-6 A8's control pair, HT-2 A9, HT-10 A4, the two error printers, and the pinned-to-8 unit tests that LIB-2 leaves.
- Deliverable: one PR.
- Evidence: the Acceptance rows.
- Finish: merged in a train. Nothing is visible in the app.

**read_first**
- AGENTS.md; `.claude/rules/shared-files.md`.
- The plan (on claude/howto-options): 5.5 (:602-614) and risk 22 (:930).
- `tools/plates/fidelity/harness.mjs`: :194-205 (the control), :805-830 (A1 at :813; :810 on #189), :576 (`HT_FULL`).
- `scripts/screenshot-gate.mjs`:
  - FG-OFF G6: :6223-6268;
  - HT-2 A9: :6414-6436;
  - HT-6 A8: :6566-6575;
  - HT-6 A7: :6580, :6679, :6718-6724;
  - the tail: :8879-8884.
  - On #194 the same blocks sit behind guard lines and the tail is at :8992-8996. On #189, LIB-2's block with A25 and A26 is at :8880-8975.
- `tools/plates/fidelity/ht10.mjs`: :64-70 and :165-200. `scripts/ht10-gate.mjs`: :28-38.
- `tests/workout/no-form-guide.test.ts`: :32-40, :150-173 (+1 on #189).
- On #189:
  - `tools/plates/library/registry.mjs` (rows :25-49, `shippedIds` :66);
  - `tools/plates/library/scale/synthetic.mjs` (`syntheticRoot`; what it copies and writes);
  - `tools/plates/gen/ids.mjs` :110-132 (its five outputs);
  - `tests/howto/library-core.test.ts` :344-349, :363;
  - COACHING-DECISIONS D-LIB2-A4-block (:2216).
- LIB-1 report R6 (the list of tests pinned to the 8).
- On #194: `docs/qa/GATE-SPLIT-DESIGN.md` 3.3-3.4 (:212-240) and E1-E2; `scripts/gate-split.mjs`.

**write_scope**
- `tools/plates/fidelity/harness.mjs`: `firstWithoutHowTo` / `HT_NO_HOWTO` / `HT_ORDER`, and A1's pair list in `ht3Behaviour`.
- `scripts/screenshot-gate.mjs`, these lines only:
  - G6's `exercises:` line in `seed`, and the three library-assert lines after `const other`;
  - A9's two-line extra-chunk filter;
  - A8's pair list (one line);
  - the tail's print line;
  - one new top-level block `LIB-4a` with its `if (gate.runs('LIB-4a'))` guard, placed after LIB-2's block.
- `tools/plates/fidelity/ht10.mjs`: :170 (the count) and :195 (the C18 loop).
- `scripts/ht10-gate.mjs`: :37.
- `tests/workout/no-form-guide.test.ts`: the test "the gate's no-How-to control …" (adds the null branch), plus any pinned-to-8 test LIB-2 left (D-LIB4-PINS).
- The other unit tests pinned to the 8 that LIB-2 left, each named in the PR with the exact assertion changed.
- `tests/howto/library-core.test.ts`: :344-349 and :363, only if LIB-2 merged without D-LIB4-PINS.
- New:
  - `tools/plates/library/chunk-set.mjs`;
  - `scripts/error-list.mjs`;
  - `tools/plates/library/scale/write-ids.mjs`;
  - `tests/howto/lib-4a.test.ts`.
- `docs/COACHING-DECISIONS.md`: append only.

**reserved_paths**
- Every other gate block, including HT-6 A7 (:6580, :6679, :6721-6724) and HT-3b's budgets.
- `.github/**`, `package*.json`.
- `scripts/gate-split.mjs`, `gate-blocks.mjs`, `gate-times.json`, `ci-verdict.mjs`.
- `tools/plates/fidelity/shard.mjs`, `tools/plates/library/qa/**`, `registry.mjs`, `scale/synthetic.mjs`.
- The watch agent's paths.
- The `openAppTrain` and `ht10Sweep` signatures (LIB-4b's).

**Do**
1. **Write `chunk-set.mjs`.**
   - `htChunkProblems(files, rows)`:
     - each row's slug must match `^[a-z0-9]+(-[a-z0-9]+)*$` and have exactly one file matching `^ht-${slug}-[\w-]{8}\.js$`;
     - every `ht-*.js` file must be matched by exactly one row;
     - anything else is a problem.
   - `handChunkProblems(files, chromeIds8)`: the `hand-*.js` set is exactly one `^hand-${chromeId}-[\w-]{8}\.js$` per chromeId of the 8.
2. **Harness control.**
   - `firstWithoutHowTo()` returns `null` when no id lacks a How-to; the empty-list throw stays.
   - `HT_NO_HOWTO` may be null, and `HT_ORDER` filters it out.
   - A1 iterates the library pair only when `HT_NO_HOWTO` is not null.
3. **FG-OFF G6.** The `seed` init script runs in the page, so it uses its parameter: `exercises: [{ exerciseId: 'lib_dumbbell_lateral_raise', sets: 2 }, ...(other ? [{ exerciseId: other, sets: 2 }] : [])]`.
   - Wrap the three library-assert lines in `if (noHowTo)`.
   - With null, log `G6 library control: none (every library id ships)`.
4. **HT-6 A8.** Build the pair list with `...(H.HT_NO_HOWTO ? [[H.HT_NO_HOWTO, null]] : [])`.
5. **HT-2 A9.** Replace the two-line filter with `htChunkProblems(files, shipped rows)`. The dynamic imports of the helper and the registry go inside those lines, block-scoped (GATE-SPLIT E2). The per-row block on the 8 is unchanged.
6. **`ht10.mjs`.**
   - :170 becomes `htChunkProblems` over the registry's shipped rows plus `handChunkProblems` over the 8.
   - :195's C18 loop also runs over `handpair-*.js` and `loaders-*.js`, from their own list, so :168's set and the total at :172-173 are unchanged.
   - Add no C17 on those chunks: that is LIB-2's A26.
7. **The LIB-4a block.** Use `H.openAppTrain`. Then, in `silent-black` and `paper`, `H.openCard(page, H.HT_ORDER.indexOf(H.HT_CUSTOM.id))`: the card opens (`.why-toggle` is visible) and has 0 `.ht-entry`. It mutates no module-scope binding (E2).
8. **Error lists.** `formatErrors` in `scripts/error-list.mjs`; both tails call it.
9. **`write-ids.mjs`.** `(root, n)`:
   - after `syntheticRoot`, writes every `gen/ids.mjs` output into the copy: `ids.ts`, `ids-node.mjs`, `lib-id.ts`, `loaders.ts`, `coverage.ts`;
   - re-sets that copy's `tests/howto/budgets.json` "How-to total" and loaders `perId` at n, by LIB-2's rule (L2-A23).
   - Never on the real tree.
10. **Scratch branch `claude/lib-4a-scratch`.** A draft PR "[do not merge]", closed and deleted afterwards. It holds this head plus the `write-ids` outputs at 22 and at 153, as two commits.
11. **D-LIB4-PINS.** Fix the leftovers, listed by `npm test` on the 22-id scratch commit.
12. **Tests in `tests/howto/lib-4a.test.ts`:** the tripwire; the null control on a `write-ids` copy at 153; the helper mutations; `formatErrors`.
13. **Decisions.** Append D-LIB4-CTRL, D-LIB4-A9, D-LIB4-A4, D-LIB4-ANCHOR, D-LIB4-PINS and D-SUP-ERRLIST, as built, to `docs/COACHING-DECISIONS.md`.

**Acceptance**

| ID | Criterion | Evidence | Red before because | Mutation |
|---|---|---|---|---|
| A1 | Null control | lib-4a.test: in a `write-ids` copy at 153, the copy's harness gives `firstWithoutHowTo()` = null and `HT_ORDER` = the 8 + custom; an empty list still throws | It throws at import | Restore the throw |
| A2 | Tripwire | lib-4a.test "null ⇔ every exercises.json id ships", at the 8 (false/false) and at 153 (true/true) | New test | `hasHowTo` true for every id → red at the 8; null returned early → red at the 8 |
| A3 | Gate at full coverage, differential | Local full gate on the 153 scratch commit, with and without this card. Without: crash at FG-OFF's import (as LIB-1 R6). With: runs to the end; G6 logs "none"; the LIB-4a block passes; no error from FG-OFF, HT-3 A1, HT-6 A8's control pair, HT-2 A9 or HT-10 A4; every remaining error is listed in the PR and appears in the run without the card (a clone artifact, e.g. HT-2 L1's stale clone files) | Import crash | (b) drop `!ex.custom` (Train.tsx:830) **and** put the custom id in the scratch hash set → the LIB-4a block and HT-3 A1 red; each change alone → green. (c) today's tree with `firstWithoutHowTo` forced to `lib_pull_up` → G6 red |
| A4 | A9 exact set | lib-4a.test helper cases; HT-2's A9 lines produce no error on the 22 and 153 scratch commits | 14 / 144 "unexpected chunks"; prefix credit | A stray `ht-zzz` chunk; a shipped row with no chunk; `ht-leg-press-calf-raise` present with leg press's chunk missing; two rows with one slug → each red |
| A5 | A4 exact sets, plus C18 on `handpair-`/`loaders-` | `node scripts/ht10-gate.mjs` on the 22 and 153 scratch commits (budgets re-set by `write-ids`): no A4 error | "expected 8 ht- and hand- chunks" | An extra `ht-` chunk; `hand-leg-press-x-ABCDEFGH.js` (A7's prefix case); a `@keyframes` that animates `width` inside a `handpair-` chunk → each red |
| A6 | Error list complete | Unit test on `formatErrors`: 155 errors give 1 count line plus 155 numbered lines; `[]` prints nothing | Node prints 100 items | `slice(0, 100)` → red |
| A7 | FG-OFF control test, null branch | The test "the gate's no-How-to control …" passes at the 8 (non-null branch unchanged) and on the 153 copy (null branch) | Throws at 153 | Assert the null branch at the 8 → red |
| A8 | Pinned-to-8 tests follow the registry | `npm test` on the 22 scratch commit: no failure from a test LIB-1 R6 lists; each changed assertion still gives the 8's value at the 8 | LIB-1 R6 (27/30) | Per test, drop one id at the 8 → red |
| A9 | Nothing else changed | `git diff` touches only write_scope lines; `tests/gate-split.test.ts` E1-E3 green, with E2's rules holding for the new block | — | — |
| A10 | No regression | `npm run check`, `npm run test:tz`, the full gate and `ht10-gate` on the merged head | — | — |

**risk_and_recovery**
- **#194 changes block guards in its delta.** Re-merge #194's final head and re-run A9 and A10.
- **A scratch run is slow:** about 60 min locally at 153 (LIB-1: 3,598 s). Run it locally and record the sha. CI runs only on the final head.
- **An error on the scratch tree cannot be attributed to a clone artifact.** Stop and post it on the PR. Never mark it known.
- **A block edit drifts past the listed lines.** Stop and post on the PR (the shared-files rule).

**return:** PR number, head, an evidence line per row, the scratch shas with the error lists with and without the card, and the mutation results.

## 4. Card LIB-4b: per-id library runner

```
id: LIB-4b
model: claude-opus-5-5
base: main c14212af; merge #189 (54d37f2d), #180 (4540d827) and LIB-4a's head (which carries #194); #181 (9b8f76e6) only on scratch branches
depends_on: LIB-2, LIB-3, HT-10, GATE-SPLIT, LIB-4a
build_prerequisites: none
merge_prerequisites: LIB-2, LIB-3, GATE-SPLIT and LIB-4a merged; review passed; green on a head containing latest main; checklist order (3b)
shared-file owners: tools/plates/fidelity/harness.mjs is HT-3's (additive options only, D-LIB4-OPEN); no AGENTS shared file
hard card: post the design note (D-LIB4-SCOPE table, the tuple contract, the twin list and the D-LIB4-FIXTURE result) on the PR before bulk building; the supervisor rules at the next tick
```

**Outcome.** `tools/plates/library/fidelity.mjs` proves, per library id, every per-id state the 8 get, against that id's pinned plates page and layers page. Run on the 8, it gives the same pass set and the same px as the HT blocks, on both browsers.
- Deliverable: the runner, the tuple contract, the source-level fixture builder, and their tests.
- Evidence: the Acceptance rows.
- Finish: merged. Nothing is visible in the app.

**Contract, fixed now (LIB-4c codes against it):**
- `libraryTuples(ids, { root }) → [{ id, theme, state }]`, in `tools/plates/library/fidelity/tuples.mjs`.
  - It is derived **from source only**: the batch golden entry (callout and tell keys), `sourceOf(id)` (zoom keys, feel rows, Show buttons, risks), `HT_THEMES`, `HT_FULL` and the widths. It never reads the DOM.
- `LIB_ONCE`:
  - per shard: `('shard-<k>', 'silent-black', 'self/0px@390')` and `('shard-<k>', 'silent-black', 'self/1px-control@390')`;
  - once per run: `('*', 'silent-black', 'qa-selftest/browser@*')`.
- `state` = `<check>/<sub-state>@<width or *>`, unique per (id, theme), because `coverProblems` keys on `id|theme|state`. The runner asserts that `state` begins with the row's `check` and ends with its `width`.
- Check names:
  - `entry`: exactly one 44 px "How to do it" button, and tapping it opens the sheet;
  - `L2`, `L2b`, `F3`, `L3`, `L4`;
  - `HT4`, `HT6`, `HT7`, `HT8`, `HT9`, `HT10`: the per-id states;
  - `PQH`: LIB-3's full `runQa` report per id, with node and browser halves (`browserResults`). One row per hard check (`PQH/PQ-H1@*` .. `PQH/PQ-H10@*`) plus `PQH/flags@*`; a row passes only when `report.ok` holds;
  - `offline`.
- `libraryFidelity(browser, port, { ids, pages, P = 1 }) → { rows, px, seconds: { id: s }, stats }`.
  - `pages[id] = { plates: html, layers: html }`.
  - `px` holds the max px off per pixel tuple.
  - Rows follow `writeProof`'s row shape: `check` is the family, and `width` is a number or null.
  - It enumerates keys **from the DOM**, so a key missing against the source shows up as a missing row.
- `onceStates(browser, port, k)` runs the per-shard self rows; shard 1 also runs `qa/selftest.mjs`.

**read_first**
- Plan 3.6 (:373-388), 5.4 (:550-600).
- `harness.mjs`:
  - :118 `goldenSelfCheck`;
  - :208-250 `htSeed` and `openAppTrain`;
  - :253-276 `openCard` / `openHowTo` / `closeHowTo`;
  - :279 `openGolden`;
  - :302-576 primitives, `HT_THEMES`, `HT_FULL`;
  - :618-800 `ht3Fidelity` (read; do not reuse);
  - :805-870;
  - :1311-1430 `ht10Sweep`;
  - :1644-1648.
- Gate blocks:
  - HT-3 (sg.mjs:6451-6468);
  - HT-6 (:6469-6730);
  - HT-3b (from :6741);
  - HT-7 (:7052-7367);
  - HT-4 (:7368-7463);
  - HT-9 C19, Show, Order and HT-9 (:7464-7847);
  - HT-8 (from :7848);
  - HT-10 (`ht10.mjs`).
- HT-3 card L3 (claude/howto-options `docs/howto/build-plan/cards/HT-3.md:62`).
- On #189: `registry.mjs`, `build-page.mjs` (`buildPlatesPage`), `gen/ids.mjs`, LIB-2 design 4, 6.1 and 6.2.
- On #181: `tools/plates/library/build-layers-page.mjs`.
- On #180: `qa/index.mjs` (`runQa`), `qa/browser.mjs` (`browserResults`), `qa/selftest.mjs`, and D-LIB3-ci (#180 COACHING-DECISIONS:1778).
- On #194: `scripts/gate-blocks.mjs` (`parseGate`).
- SPEED.md:57 (both browsers for pixel cards).

**write_scope**
- New:
  - `tools/plates/library/fidelity.mjs`;
  - `tools/plates/library/fidelity/**`, including `fixture.mjs` (D-LIB4-FIXTURE);
  - `tests/howto/library-fidelity.test.ts`;
  - `docs/howto/library/LIB-4-DESIGN.md` (the runner, contract and fixture sections; LIB-4c adds a CI section).
- `harness.mjs`: only the `openAppTrain` and `ht10Sweep` signatures and their seed and index lines (D-LIB4-OPEN).
- `docs/COACHING-DECISIONS.md`: append only.

**reserved_paths:** `scripts/**` (every gate block included); LIB-4a's harness lines; `tools/plates/library/ci/**` (LIB-4c); `tools/plates/library/qa/**`; `registry.mjs`; `.github/**`; `package*.json`; `shard.mjs`.

**Do**
1. **Design note on the PR, day 1:**
   - for each HT-3..HT-10 per-id check: its source line, its state formula, and the count it observes on the 8;
   - the twin list (every per-id check that lives in a gate block, HT-4 included);
   - the tuple contract and the exemption list;
   - the D-LIB4-FIXTURE result: can LIB-2's generator emit a library id from source? If not, stop and report.
2. **Harness options** (D-LIB4-OPEN), as the first code commit.
3. **`tuples.mjs`** and its node tests.
4. **The runner:**
   - Seed `[...ids, HT_CUSTOM.id]`.
   - Per theme, compare against `openGolden({ html: pages[id].plates })` and against the layers page.
   - Each twin carries `{ group key, sha256 of the group's text via parseGate }`.
   - Run the full `runQa` per id, and the offline open per id.
5. **CLI:** `node tools/plates/library/fidelity.mjs --ids <list|golden8> [--P n]`. It prints the rows, the per-id seconds and the max px off.
6. **`fidelity/fixture.mjs`:** builds the source-level scratch ids (D-LIB4-FIXTURE) on a scratch branch only.
7. **Equivalence and mutations on the 8** (B2), on both browsers, using the existing failure fixtures: `fixtureSection`, `fixtureLeakSection`, the 1 px shift, and HT-10's `inject`.
8. **P measurement** (D-LIB4-PAR).
9. **Design doc and decisions** (D-LIB4-SCOPE, D-LIB4-FIXTURE, as built).

**Acceptance**

| ID | Criterion | Evidence | Red before because | Mutation |
|---|---|---|---|---|
| B1 | Tuples come from source and match the 8's counts | library-fidelity.test: for each family, the count on the 8 equals the count its HT block observes and prints, and is at least every bound the block asserts (HT-6 A6 prints `stats.pairs` and asserts ≥ 32; HT-9 Show: 17). The list is exact | New module | Drop one tell in the parser → red |
| B2 | Equivalent to the HT blocks on the 8 | `--ids golden8` on the merged head, in the container (Chromium 141) and in a CI dispatch on the scratch branch (Chrome 153): every row passes, and the max px off per id equals HT-3's printed value (0 where HT-3 reports 0). Each failure fixture turns red on the same id and family as its block | New | The 4 fixtures, each red |
| B3 | Twin drift tripwire | Test: each twin's pinned sha256 equals `parseGate`'s text of its group at HEAD, for every twinned group | New | Edit one character in HT-7's or HT-4's block → red with "re-check the library twin" |
| B4 | Per-id entry | One `entry` row per id | New | Hide `.ht-entry` for one id (fixture) → that row fails |
| B5 | Library path | A scratch branch with #181 merged and 3 source-level scratch ids (D-LIB4-FIXTURE), pages from `buildPlatesPage` and `build-layers-page.mjs`: all rows pass, and the tuple count equals `libraryTuples` | New | A 1 px change in one id's plates page → only that id's L3 rows fail; one changed source byte in a PQ-H7-relevant field → that id's `PQH/PQ-H7` fails |
| B6 | A missing page is red | `pages` without an id → fail rows, never a skip | New | Skip on a missing page → test red |
| B7 | P pages | 1 vs 4 pages on the 8: identical rows and identical px; speed-up and `nproc` recorded; the default changes only if they are identical, and then B2 re-runs at that P | n/a | A forced 1-row difference keeps P = 1 |
| B8 | Seconds | Per-id and per-family seconds, local (`nproc` stated), PQH and offline included | n/a | n/a |
| B9 | Options change nothing | Full gate and `ht10-gate` green on the merged head | n/a | Change the `order` default → HT-3 red |
| B10 | No regression | `npm run check`, `npm run test:tz`, gate | — | — |

**risk_and_recovery**
- **Scope grows past size L.** The supervisor may split the twins into LIB-4b2. A state is never dropped.
- **A twin drifts from its block.** B3 forces a re-check; the supervisor's card for that edit carries the re-pin (D-LIB4-OPEN).
- **LIB-2's generator cannot emit a library id from source.** Stop at day 1 and report; it blocks LIB-9 too.
- **LIB-6 is not on main at merge.** Its builder is imported lazily. A library id without a layers page is red (B6), and none ships before LIB-9.
- **Flakes.** Root-cause them; never re-run to green.

**return:** PR number, head, design-note link, the rows and seconds tables for both browsers, the P result, and the fixture result.

## 5. Card LIB-4c: library CI

```
id: LIB-4c
model: claude-opus-5-5
base: main c14212af; merge #189, #180 and LIB-4b's head; #194 for imports (the ci-verdict.mjs seam lands only after #194 merges)
depends_on: LIB-2, LIB-3, HT-10, GATE-SPLIT (#194 + #219), LIB-4b
build_prerequisites: none
merge_prerequisites: #194, #219, LIB-2, LIB-3, LIB-4a and LIB-4b merged; review passed; merges in ONE train with the supervisor's wiring branch claude/sup-lib4-ci; checklist order (3c)
shared-file owners: scripts/ci-verdict.mjs is GATE-SPLIT's (CLI-block seam only, D-GATESPLIT-ONE); .github is the supervisor's
```

**Outcome.** Every push proves the shipped library ids exactly once: all of them on main, train heads and dispatch, and the affected ids elsewhere. `gate-verdict` is red on any gap.
- Deliverable: the scripts, the tests and the scratch-branch CI evidence.
- Finish: merged in a train with the wiring, and the first main run green.

**read_first**
- Plan 5.4.
- GATE-SPLIT design 2.2, 3.5, 4.1-4.3 (:107-353; E6 at :319, E8 at :328).
- On #194:
  - `shard.mjs` :57-78 and :87-143;
  - `ci-verdict.mjs` :14-35 and :105-137;
  - `scripts/gate-split.mjs` (`wwwHash`, `planHash`);
  - `scripts/gate-times.mjs` (`refreshTimes`);
  - `scripts/gate-compare.mjs`, as the pattern for `compare.mjs`.
- `build-apk.yml`: on main :3-13, :23, :81, :114, :145; on #219 :126-231.
- On #189: `registry.mjs`, `gen/ids.mjs` :110-132, LIB-2 design 6.1-6.2 (per-output `inputs`, batch golden files), D-LIB2-loaders.
- LIB-4b's contract and `fidelity/fixture.mjs`.
- LIB-1 report R2/R3 (the supervisor attaches it).

**write_scope**
- New:
  - `tools/plates/library/ci/{plan,mode,affected,verdict,times,compare}.mjs`;
  - `tools/plates/library/ci/times.json`;
  - `scripts/howto-rebuild.mjs`, `scripts/howto-shard.mjs`;
  - `tests/howto/library-ci.test.ts`.
- If #189 merges without it: `tools/plates/library/MANIFEST.json` and its L0-lib vitest (D-LIB4-SCOPE).
- The CI section of `docs/howto/library/LIB-4-DESIGN.md`.
- `scripts/ci-verdict.mjs`: about 8 lines in the CLI block (:123-137) only:
  - a dynamic import;
  - `collectLibrary(dir)`;
  - a `libraryVerdict` call;
  - merging its problems and notes;
  - one print line.
- `docs/COACHING-DECISIONS.md`: append only.

**reserved_paths:** in `ci-verdict.mjs`, `verdict()`, `collect()` and `REQUIRED_NEEDS`; `tests/ci-verdict.test.ts`; `tests/gate-split.test.ts`; `shard.mjs`; `gate-split.mjs`, `gate-blocks.mjs`, `gate-times.*`, `gate-compare.mjs`; `.github/**`; `docs/supervisor/**`; `package*.json`; LIB-4b's paths; `tools/plates/library/qa/**`; `registry.mjs`.

**Do**
1. **`plan.mjs`:**
   - `libraryIds()` = shipped rows whose mode is not `golden`;
   - `planK(items, times)` per D-LIB4-SHARD;
   - `libraryPlan({ ids, times })` → `{ K, shards, hash }`, where `hash` = sha256 of {sorted ids, times, K, c0, offsets, target}.
2. **`mode.mjs`:** `modeOf({ ref, event })` per D-LIB4-MODE.
3. **`affected.mjs`:** `affectedIds({ changed, base, root })`. `changed` is `null` when the fetch failed, which selects every id. The first matching class wins, in this order:
   1. **One id's own files** select that id:
      - its batch row (`git show FETCH_HEAD:<batch file>`);
      - `tools/plates/library/specs/<id>*` and `tools/plates/library/howto/<id>.howto.mjs`;
      - its entries in `tests/howto/golden/library/*.json`;
      - its per-id generated files (`src/howto/generated/{ht,hand,posture,feel}-*.ts`, `src/slices/howto/css/zoom-*.css`) whose `inputsSha256` differs from base.
   2. **Registry-derived generated files** select the ids whose rows differ: `src/howto/ids.ts`, `src/howto/lib-id.ts`, `src/howto/coverage.ts`, `src/howto/generated/index.ts`, `src/howto/generated/loaders.ts`, `tools/plates/library/ids-node.mjs`.
   3. **A file that some generated file at HEAD lists in its per-output `inputs`** (LIB-2 design 6.1) selects the ids whose generated files list it. This applies only once C4 proves it on the fixture; until then the file falls to class 4.
   4. **All ids:**
      - `src/data/exercises.json`;
      - `src/slices/howto/**` and `src/howto/**` not in classes 1-2;
      - every file in the esbuild import closure of `src/slices/howto/lazy.tsx` (today `src/ui/primitives.tsx`, `icons.tsx`, `sheetStack.ts`, `src/app/toast.ts`);
      - `src/ui/styles.css` (the theme tokens) and font assets;
      - `index.html`, `vite.config.ts`, `tsconfig.json`, `package.json`, `package-lock.json`;
      - `tools/plates/**` not in classes 1-3;
      - `tests/howto/**`;
      - `scripts/howto-*.mjs`, `scripts/ci-verdict.mjs`;
      - `.github/**`.
   5. **0 ids:**
      - `docs/**` not listed above, root `*.md`, `.claude/**`;
      - `escobar-worker/**`, `relay/**`, `native/**`;
      - `scripts/screenshot-gate.mjs`, `scripts/gate-*.mjs`, `scripts/ht10-gate.mjs`;
      - tests outside `tests/howto/**`;
      - other `src/**`, `src/slices/workout/Train.tsx` included. These are covered by the 8's HT blocks on every push and by the full train-head run.
   6. **Anything else:** all ids.
4. **`scripts/howto-rebuild.mjs`:**
   - Run `git fetch --depth=1 origin main` (here only, not in the workflow), then `git diff --name-only FETCH_HEAD HEAD`.
   - L1: rebuild every pinned page in `tests/howto/golden/library/*.json` (always all of them), on parallel processes (plan 5.4:562), each with its kind's builder. A kind with no builder at this sha is red.
   - Write `howto-pages/` (the pages and `plan.json`).
   - Write the rebuild proof `screenshots/howto-rebuild-proof.json` (`writeProof`): one row per page; meta holds the mode, base, changed, plan, seconds and page shas.
   - Append `ks=[1..K]`, `K` and `mode` to `$GITHUB_OUTPUT`.
5. **`scripts/howto-shard.mjs`:**
   - `jobFromEnv('MARC_LIB_SHARD')`;
   - recompute the plan hash from `plan.json`;
   - re-check the page shas against the rebuild proof;
   - run `onceStates`, then `libraryFidelity` for the shard's ids;
   - write `screenshots/howto-proof-<k>of<K>.json`, with meta: `job`, `tz`, `www` (`wwwHash`), `chrome`, `plan`, `mode`, `ids`, `pageShas`, `px`, `seconds`, `shardSeconds`.
6. **`verdict.mjs`:** `collectLibrary(dir)` and `libraryVerdict({ lib, rebuild, gate, sha, ref, event, needs, root })` per D-LIB4-VERDICT. It requires `howto-rebuild` and `howto-shard` in `needs` with result `success`.
7. **`times.json`:** `{ default, c0, once, ids: {} }`.
   - Seed `default` from LIB-1 R2 (280.8 s, local), then replace the values with C14's CI values.
   - `times.mjs` reuses `refreshTimes` if its input shape fits; otherwise it is a thin wrapper, with no copied logic.
8. **`compare.mjs`:** compares N library proof sets on one sha (rows, results, px per pixel tuple). Exit 1 on the first difference. Its mutation tests: one row dropped, one result flipped, one px value changed.
9. **Post "ready for wiring"** on the PR. The supervisor opens `claude/sup-lib4-ci` (section 6).
10. **Scratch branch `claude/lib-4c-scratch`.** A draft PR "[do not merge]", closed and deleted afterwards. It holds this card's head, `claude/sup-lib4-ci`, and 6 source-level scratch ids from `fidelity/fixture.mjs` with pinned pages (K = 2). It runs C11-C14, with dispatches one after another.
11. **The `ci-verdict.mjs` seam,** after #194 merges. Then the CI section of `LIB-4-DESIGN.md`, and the decisions.

**Acceptance**

| ID | Criterion | Evidence | Red before because | Mutation |
|---|---|---|---|---|
| C1 | Each shipped id is in exactly one shard | library-ci.test: for N ∈ {0, 1, 8, 14, 145, 153} and every K in 1..max(16, N), plus the real registry | New | Drop the last item; an off-by-one k; a duplicate id → each red |
| C2 | Integer-aware K | Fixture t = 271, c0 = 30: K(0) = 1, K(14) = 5, K(145) = 49; every packed shard ≤ 900 | New | `ceil(load/900)` → 46, with shards over 900 → red |
| C3 | Mode by ref | A table over main, train-18, train-18b, `claude/x`, a dispatch on `claude/x`, and a tag push | New | Train treated as affected → red; train-18b treated as full → red |
| C4 | Affected rule is ordered and fail-safe | On a real temporary git repo (a base commit, then one commit per case): one id's row → that id; one id's spec → that id; `src/data/exercises.json` → all; `src/ui/primitives.tsx` → all; `scripts/screenshot-gate.mjs` alone → 0; docs only → 0; an unknown path → all; `ids.ts` → the changed rows only; `changed: null` → all; on the fixture, a shared composer listed in 1 of 6 ids' inputs → that id (else class 3 stays off); a test that no class-5 path is in the esbuild import closure of `scripts/howto-shard.mjs`, `scripts/howto-rebuild.mjs` or `src/slices/howto/lazy.tsx` | New | Each class flipped → red; a class-5 path imported by the runner → red |
| C5 | Verdict family | Fixtures, each red: a row dropped; a row in two shards; wrong sha; wrong K; a plan hash differs; a shard's ids ≠ its plan; `www` ≠ the gate's; `tz` ≠ UTC; affected mode on main; a fail row; a state that does not encode its check or width; a pinned page missing from the rebuild proof; a shard page sha ≠ the rebuild proof; `shardSeconds` 1801 (900-1800 gives a note); a missing shard; an extra id; library ∪ 8 ≠ `shippedIds`; a `howto-shard` need missing or skipped | New | Each listed fixture is itself the mutation |
| C6 | Zero ids | K = 1 with shard 1's once rows only → green; shard 1's proof missing → red | New | Accept a skipped job → red |
| C7 | C-TZ | No `Date`, `Intl` or `toLocale` in `src/slices/howto/**`, `src/howto/**` or the built How-to chunks (HowToSheet-, ht-, hand-, handpair-, feel-, posture-, zoom-, loaders-); `Date.now()` and `performance.now()` allowed | New | A fixture file with `new Date()` → red; a built chunk with `toLocaleString` → red |
| C8 | `qa-selftest` once per run (D-LIB3-ci) | Shard 1 row | Not wired | Selftest exits non-zero → row fails → red |
| C9 | L1 | All pinned pages rebuild to their sha, on parallel processes | New | One changed byte in a page source → red; an unknown page kind → red |
| C10 | The seam is CLI-only | GATE-SPLIT tests unchanged and green; the diff of `ci-verdict.mjs` stays inside :123-137 | — | — |
| C11 | Affected run on CI | A scratch push in affected mode: the PASS line says `library: affected (6 of 6)` and prints the reasons (`.github/**`, new rows). The one-id case is C4's real-git test, plus the first builder push after merge that changes one id's row, recorded by the supervisor | — | — |
| C12 | Seeded defects on CI | Dispatch with a 1 px change in one scratch page → red; dispatch with `times.json` edited after the plan → red; a scratch commit that drops one row from shard 2/2's proof before upload → `gate-verdict` red, naming the tuple (plan 5.4:577; GATE-SPLIT E6) | — | — |
| C13 | 5 identical full runs at K = 2 | 5 consecutive dispatch run ids on one sha, run one after another (a cancelled run is re-dispatched and not counted): `compare.mjs` exits 0 on rows and px; at the adopted P | — | Any difference blocks LB1 and is root-caused |
| C14 | CI calibration | A table of t per family (PQH and offline included), c0, setup, rebuild seconds R and shard seconds on Chrome 153; `times.json` committed from it | — | — |
| C15 | No regression | `npm run check`, `npm run test:tz`, gate, then one full train-head run | — | — |

**risk_and_recovery**
- **#194 changes shape in delta review.** The seam is small; re-merge and re-run C10.
- **The wiring lands without this card, or the other way round.** Either way `gate-verdict` turns red (a failed step, or "needed job howto-rebuild missing"), so they always merge in one train.
- **Affected mode misses a shared input.** The train head runs in full mode; the cost is one train cycle, never a merge.
- **The class-3 generator-input rule cannot be proven.** Those paths stay "all ids" until it is.
- **Artifact size.** Only proofs use `MARC-*` names; pages use `howto-pages` with a short retention.
- **Runner capacity.** C is unknown; D-LIB4-QUEUE's triggers apply.

**return:** PR number, head, dispatch run ids for C11-C14, the calibration table, the K table, and `compare.mjs` output for C13.

## 6. `.github` wiring (supervisor, add-only)

Drafted on `claude/sup-lib4-ci` when LIB-4c posts "ready for wiring". It is first used on LIB-4c's scratch branch for C11-C14. After LIB-4c is READY and its review passes, the branch re-merges LIB-4c's final head. Both merge in one train after #219. #221's lines are never touched; when merging, keep both sides.

1. **`howto-rebuild`** (`timeout-minutes: 30`):
   - steps: `actions/checkout@v6`; `actions/setup-node@v6` (node-version '22', cache npm); `npm ci`; `node scripts/howto-rebuild.mjs` with `id: rebuild`. The script does its own `git fetch --depth=1 origin main`, so its fail-safe is the tested one;
   - job outputs `ks`, `K` and `mode` from `steps.rebuild.outputs`;
   - uploads `howto-pages` (short retention) and `MARC-howto-rebuild-proof` (`if: always()`, `if-no-files-found: error`);
   - no Chromium, unless C9 shows that a builder needs it.
2. **`howto-shard`** (`timeout-minutes: 30`):
   - `needs: howto-rebuild`;
   - `strategy: { fail-fast: false, matrix: { k: ${{ fromJSON(needs.howto-rebuild.outputs.ks) }} } }`;
   - `name: howto-shard (${{ matrix.k }}/${{ needs.howto-rebuild.outputs.K }})`;
   - env `TZ: UTC` and `MARC_LIB_SHARD: ${{ matrix.k }}/${{ needs.howto-rebuild.outputs.K }}`;
   - steps: `actions/checkout@v6`; `actions/setup-node@v6` (node-version '22', cache npm, the same as every gate job); `npm ci`; `npm run build`; `npx playwright install --with-deps chromium`; download `howto-pages`; `node scripts/howto-shard.mjs`;
   - uploads `MARC-howto-proof-${{ matrix.k }}` (proof JSON only; `if: always()`, `if-no-files-found: error`) and the evidence as `howto-evidence-${{ matrix.k }}`, which is not a `MARC-*` name, so `gate-verdict`'s `pattern: MARC-*` skips it.
3. **The one edit to an existing job: `gate-verdict.needs`.** Append `howto-rebuild` and `howto-shard`. `MARC_NEEDS` stays `toJSON(needs)`, and `gate-verdict` keeps `if: always()`. `android-gate` is not edited; it already needs `gate-verdict` (#219).
4. **`docs/supervisor/scripts/ci-watch.sh`:** require `howto-rebuild`, at least one `howto-shard` leg, and `gate-verdict`. Count only `library: full` as merge evidence.
5. **Nothing else changes:** no change to triggers, permissions or workflow concurrency, no other change to any existing job, and no change to the watch agent's lines (#221).
6. **Only if D-LIB4-QUEUE's trigger fires:** a `max-parallel` cap for non-full refs on `howto-shard` only, after a scratch run shows that `strategy.max-parallel` accepts an expression. Full runs are never capped.

## 7. Supervisor decisions on the open questions (2026-10-17)

1. **GitHub concurrency.** The plan uses C = 20, within the measured range of 12-27. The owner's GitHub plan is asked only if D-LIB4-QUEUE's trigger fires.
2. **MANIFEST.json.** If LIB-2 merges without it, LIB-4c builds it (the default).
3. **Unit tests pinned to the 8.** LIB-4a fixes whatever is left after LIB-2 merges (D-LIB4-PINS, the default).
4. **Editing other tasks' blocks.** Plan risks 16 and 22 give the authority: "goes to the supervisor for that task's decision, never a silent edit". Precedent: GATE-FLAKE-2 and GATE-FLAKE-3 (#224, D-GF3-1). Each edited line is listed in the card, and the reviewer checks it against the ruling. A pointer line goes in the AGENTS.md shared-file row.
5. **Unverified generator facts.** LIB-4b's day-1 design note answers them. A "no" blocks LIB-4b and LIB-9, and comes back for a ruling.
6. **max-parallel expression.** Checked only if D-LIB4-QUEUE fires.
7. **Per-id times.** Unmeasured. K values are lower bounds until C14 measures them.
8. **GATE-SPLIT churn.** Any change to ci-verdict.mjs, shard.mjs or the guard shape: re-merge, then re-run A9/A10 and C10.

Build order: LIB-4a and LIB-4b build in parallel now. LIB-4c starts after LIB-4b's design note is accepted. Merges follow the checklist order (3a → 3b → 3c).

## 8. Critique corrections applied

- 1. [Loosened, PQ-H] The draft makes the CI row PQH 'LIB-3's browser half per id' and Do 4 says 'call runQa (the browser half)'. That drops the node half (PQ-H2, H3, H6-H10, flags F1-F7) for every library id on every full run. PQ-H7 is the per-chunk ceiling that plan 5.1 relies on. LIB-3's vitest runs the node half only on the 8 and its mutations (#180 tests/howto/library-qa.test.ts:22-134). Plan 3.6 asks for PQ-H1..H10 on every shipped id. Fix: PQH is the full runQa(c, { browser: browserResults(...) }) report per id. There is one row per hard check (PQH/PQ-H1@* .. PQH/PQ-H10@*) plus PQH/flags@*. A row passes only when report.ok is true, which means no blocking flag.
- 2. [Unverifiable evidence, LIB-4a] A3, A4, A5 and A8 ask for a green gate, a green HT-2, a green ht10-gate and a green no-form-guide.test.ts on a synthetic 153-id scratch tree. That tree has reds that have nothing to do with LIB-4a. HT-2 L1 generate --check flags the clone files as stale (LIB-1 R6: 725 files). The synthetic ids.ts has no hints (synthetic.mjs comment), so HT-6 A8 reports 'no HOWTO_HINTS entry'. budgets.json totals are not re-set. About 30 unit tests pin the 8 (LIB-1 R6). Fix: use differential evidence. The scratch tree applies LIB-2's batch budget re-set (L2-A23). Run the full gate with and without this card. Show no import crash and no error from FG-OFF, HT-3 A1, HT-6 A8's control pair, HT-2 A9's chunk set, HT-10 A4's sets or LIB-4a. List every remaining error, and show the same error on the tree without the card. A8's evidence names the control test, not the whole file.
- 3. [Wrong fixture, LIB-4a A1/A2] LIB-2's syntheticRoot (#189 tools/plates/library/scale/synthetic.mjs) copies no scripts/ or tests/. It also rewrites only src/howto/ids.ts and generated/loaders.ts. It does not rewrite tools/plates/library/ids-node.mjs, which the harness's firstWithoutHowTo reads through hasHowTo, and it does not rewrite coverage.ts or lib-id.ts. So 'null at 153 on syntheticRoot(ROOT, 153)' would still return lib_dumbbell_bench_press, and the null path would never run. Fix: add a new helper, tools/plates/library/scale/write-ids.mjs. After syntheticRoot it writes every tools/plates/gen/ids.mjs output (:128-132) and re-sets the budgets in the copy. The scratch branch commits the result.
- 4. [Unverifiable, LIB-4b B5 and LIB-4c step 9 / C11-C14] The draft builds its scratch ids from LIB-2 synthetic clones. Those clones have no spec and no How-to source: src points at library/specs/<x>.mjs, which does not exist, and sourceOf() points at library/howto/<id>.howto.mjs, which is missing. libraryTuples ('from source only'), buildPlatesPage and build-layers-page therefore cannot run on them. Fix: a new ruling, D-LIB4-FIXTURE. Scratch ids are built at the source level: copy one of the 8's spec and its golden-B How-to source with the id and chromeId swapped, generate with the repo generator, build pages with buildPlatesPage and build-layers-page, and pin them in a scratch batch golden file. If LIB-2's generator cannot emit a library id from source, LIB-4b stops and reports.
- 5. [Main CI slower, affected rule] Under the draft's 'anything else: all ids', scripts/screenshot-gate.mjs selects every id. That file was touched by 254 of 502 commits on main since 09-26. relay/**, .claude/** and the root .md files also select every id. tools/plates/** selecting every id makes every batch push a full 49-shard run. Builder runs then compete with train and main runs; the model gives 75-93 min for two overlapping full runs at C = 20. In the other direction, src/data/exercises.json (a registry input and the sheet title) and the sheet's imports outside src/howto (src/ui/primitives.tsx Sheet, icons.tsx, sheetStack.ts, app/toast.ts) are classed as 'other src/**: 0 ids'. ht-index does not exist on #189 (D-LIB2-loaders: generated/loaders.ts). The glob {fidelity*,ci}/** misses fidelity.mjs itself. Fix: an ordered first-match rule (LIB-4c Do 3). Generator inputs select only the ids whose per-output inputs list them, and only where C4 proves it; otherwise all ids. Add an explicit list of neutral paths. Add a test that fails when a neutral path is in the esbuild import closure of the library entry points.
- 6. [Duplicate check] D-LIB4-A4 (c) adds C17 over handpair-/loaders- chunks. LIB-2's own block already does that as A26 (#189 sg.mjs:8930-8975; D-LIB2-A4-block, COACHING-DECISIONS:2216). A5's 'unseen before' is false on #189's head, which LIB-4a merges first. Fix: extend only the C18 loop (ht10CssProblems, ht10.mjs:195). The mutation becomes a @keyframes that animates width inside a handpair- chunk.
- 7. [Duplicate check] LIB-4a block (a), 'exactly the 8 anchored hand-*.js', is the same helper over the same set as D-LIB4-A4 (b) in ht10.mjs. HT-6 A7's count (sg.mjs:6721) and hands.test.ts:31-35 already cover it as well. Fix: drop (a). D-LIB4-ANCHOR is settled by A4 (b), and the LIB-4a block keeps only the custom negative.
- 8. [Mutation does not bite] A3 (b) drops '!ex.custom' (Train.tsx:830). The custom id custom_ht3_lateral already has hasHowTo false, so the entry stays hidden and nothing turns red. HT-6 A8 checks hint lines, not .ht-entry, so it cannot turn red here either. Fix: drop '!ex.custom' and also add the custom id to the scratch tree's hash set. The LIB-4a block and HT-3 A1 must then turn red, and each change alone must stay green.
- 9. [Vacuous check and hedge] D-LIB4-A9 has library rows 'pass the FG-OFF ban'. The ban regex ^(FormGuidePlayer|ExercisePlayer|lib_[a-z_]+)- can never match an ht- file name (sg.mjs:6426), and FG-OFF A2 already bans those names across the whole build (:6212). The phrase is dropped. 'LIB-2's index chunk if the build emits one' and extraExact are also dropped, because #189's index chunk is loaders-*.js (D-LIB2-loaders), outside the ht- set. This was checked, not guessed.
- 10. [Rule misquoted] .claude/rules/shared-files.md says the supervisor settles a pinned block 'by changing the design so it avoids the change'. It does not say 'unless a ruling settles it'. The ruling now records why no design avoids it: at full coverage the control has no subject; A9's expected set comes from plates.json's 8 by construction; moving library chunks off the ht- prefix would hide them from HT-10's C17 and C18. It cites plan risk 22 and the precedent: #224, D-GF3-1, edited HT-6's block lines 6487-6700 under a supervisor card. It also adds a pointer line to the AGENTS.md table so the reviewer does not fail LIB-4a on the add-only rule.
- 11. [Missing proof on CI] Plan 5.4:577 says 'delete one row from one manifest, and it goes red' and GATE-SPLIT has the matching E6 on CI. The draft has these only as unit fixtures. Fix: C12 gains a scratch commit that drops one row from howto-shard 2/2's proof before upload. gate-verdict must turn red and name the tuple.
- 12. [Missing tool] C13's '5 identical runs' has no comparer. scripts/gate-compare.mjs reads gate proofs only, and the proof meta carries no px. Fix: add tools/plates/library/ci/compare.mjs with mutation tests. The proof meta gets px per pixel state. The runs are sequential, because concurrency cancels runs on the same ref (build-apk.yml:11-13). A cancelled run is dispatched again and not counted.
- 13. [Test narrower than the plan] Plan 5.4:584 tests every K from 1 to 16. C1's 'K in 1..max(N,1)' skips K > N for N in {0, 1, 8, 14}. Fix: test K = 1..max(16, N).
- 14. [C-TZ narrower than the plan] Plan 5.4:585 covers 'src/slices/howto/** or the generated chunks'. C7 scans source only. Fix: also scan the built How-to chunk set (HowToSheet-, ht-, hand-, handpair-, feel-, posture-, zoom-, loaders-). Date.now() and performance.now() stay allowed as relative time; the sheet's Sheet in primitives.tsx uses Date.now() today.
- 15. [Plan item dropped] Plan 5.4:562 has L1 run 'on parallel processes'. The draft's rebuild step leaves that out. Fix: keep it, put rebuild seconds in C14, and apply the same 1,800 s budget as a shard.
- 16. [Verdict gaps] The family must also be red when: the rebuild proof does not cover every pinned page in tests/howto/golden/library/*.json exactly once with all passing; a shard's re-checked page shas differ from the rebuild proof; a row's state does not begin with '<check>/' and end with '@<width or *>'; a shard's meta.ids differ from its planned ids. In affected mode the verdict recomputes the affected set from the rebuild proof's base sha and changed list.
- 17. [Wiring bugs] howto-shard has no actions/setup-node step (Node 22, npm cache), while every gate job has one. Its www could then differ from the gate's, or behave differently. Item 5 says 'no change to existing jobs' but item 3 edits gate-verdict.needs. The main fetch runs twice, once as a workflow step and once in the script. Fix: add setup-node, reword item 5, and do the fetch only in the script, where the fail-safe is tested.
- 18. [Claim too narrow] '+2.5 min' is right for the merge path after the verdict. But android-gate now starts only after the library shards, so at C = 20 the APK arrives about 35 min later than with the gate alone [est, model 17.1 vs 52.1 min]. The owner sees that, so it is stated.
- 19. [Scope gap] HT-4's per-id checks HT4-A5 and HT4-A6 also live in a gate block (sg.mjs:7368-7463), but D-LIB4-OPEN and B3 name only HT-6..HT-9 twins. Fix: the design note lists HT-4 as a twin or a named exemption, B3 pins every twinned group, and read_first adds HT-4. B1: HT-6 A6 asserts only '>= 32' (sg.mjs:6718), so 'equals the count its block asserts' is not defined. Compare with the count the block observes and prints instead.
- 20. [Theme matrix stated loosely] HT-3's L3 is N and M at 390 px in 5 themes. Every callout and tell, A6's restore, and 360/340 px run only in HT_FULL = silent-black and paper (harness.mjs:576, :698-735; HT-3 card L3, cards/HT-3.md:62). Read literally, plan 3.6 says every callout at every width in 5 themes. The ruling states the exact matrix and the supervisor amends 3.6, so no reviewer reads the library runs as dropping themes or widths. The draft's claim 'stricter than plan 3.6' becomes 'equal for the layer states, plus HT-10's per-id sweep'.
- 21. [Owner gap] Plan 3.6's L0-lib (tools/plates/library/MANIFEST.json, vitest) appears in LIB-2's design (sections 4 and 9) but not on #189's head 54d37f2d. D-LIB4-SCOPE did not mention it. Fix: the supervisor confirms on #189. If LIB-2 merges without it, LIB-4c builds it.
- 22. [Gap] LIB-1 R6 lists 27 unit tests pinned to exactly the 8 (30 on lib2) that turn red at LB1. One example is #189 no-form-guide.test.ts:157-162, lib.filter(hasHowTo) toEqual(approved). D-LIB4-PINS covers only library-core.test.ts. Fix: extend it. LIB-2 fixes these before it merges; anything left goes to LIB-4a, listed by running npm test on the 22-id scratch tree. LIB-4a's outcome is narrowed to the checks it owns, because 'every existing check' was an overclaim.
- 23. [Doc edits] Plan 5.4:596 is the entry condition. It is reworded ('before the first library run counts as merge evidence'), not struck. Also amended: plan 5.4:571-577 (howto-verdict becomes a family) and :594-595 (android-gate needs), and plan 3.6's 'The 8 keep their HT-1..HT-10 blocks, unchanged' (A1, A8 and A9 are extended under D-LIB4-CTRL and D-LIB4-A9).
- 24. [Numbers] t = 271 s now gets its source: 280.8 s (LIB-1 R2) minus 10.0 s per id of once-per-run blocks (HT-1, HT-2, HT-3b), local Chromium 141. The per-id PQ-H, offline open, entry and layers-page compare are not measured, so K = 5 and K = 49 are lower bounds until C14. The D-LIB4-DOCS range becomes 269-281 s per id locally, and 274 s on CI with once-per-run included (triage). A scratch full gate at 153 ids takes about 60 min locally (LIB-1: 3,598 s), not 43.
- 25. [Both browsers] SPEED.md:57 says cards that touch pixel probes run both browsers before READY. B2 now runs on the container's Chromium 141 and on CI's Chrome 153. If P > 1 is adopted, B2 and C13 run at that P.
- 26. [Burden on other cards] A later card that edits a twinned block, such as a flake fix like #224, turns B3 red. Fix: the supervisor's card for that edit includes re-running B2 and re-pinning the twin, with the twin's pin line added to its write_scope.
- 27. [Precision] The LIB-4a block was placed 'after A7's position', which is inside HT-6's block. It is now a new top-level block with its own guard after LIB-2's block. In G6, the seed init script runs in the page and cannot see noHowTo, so it uses its own parameter (other). The D-SUP-ERRLIST formatter moves to a new module (scripts/error-list.mjs) so its unit test can import it, and the 'or a captured run' alternative is removed. LIB-4a's merge also waits for #180 (checklist order).
- 28. [Queue] D-LIB4-QUEUE's only trigger was 'a non-library lane waits more than 30 min'. Fix: add a concrete trigger on the merge path: a train or main run whose first howto-shard waits more than 15 min. The fix it allows is add-only, on the new jobs only: a cap for non-full refs, once the scratch branch shows that strategy.max-parallel accepts an expression. That was not verified. The owner question becomes 'which GitHub plan is the account on', because that sets the concurrent-job limit (27 jobs ran at once on 10-04).

## 9. Open questions as raised

1. Owner: which GitHub plan the account is on (it sets the concurrent-job limit). The LIB-1 triage measured C = 12-27 in practice. Bundle it into the next owner message that is already needed.
2. Supervisor, on #189: tools/plates/library/MANIFEST.json (L0-lib, plan 3.6) is in LIB-2's design (sections 4 and 9) but not on head 54d37f2d. Is it still in LIB-2's scope before merge? Default: if LIB-2 merges without it, LIB-4c builds it.
3. Supervisor, on #189: does LIB-2 make the 27-30 unit tests pinned to the 8 (LIB-1 R6) follow the registry? The FG-OFF test's A1-HT block at no-form-guide.test.ts:157-162 is still pinned on 54d37f2d. Default: LIB-4a fixes whatever is left (D-LIB4-PINS).
4. Supervisor: does plan risk 22 give enough authority for LIB-4a's edits to the FG-OFF, HT-2 and HT-6 blocks, or does this need an owner exception like GATE-SPLIT's (owner approval 10-02, SPEED.md:71)? Recommended: risk 22 is enough. It is an owner-approved delegation of "that task's decision", the #224 precedent supports it, and no design avoids the edit. Record a pointer line in the AGENTS.md table.
5. Not verified: can LIB-2's generator emit a library plate chunk from a spec and How-to source, and do its per-output inputs list shared composers? D-LIB4-FIXTURE and C4's class 3 depend on both. LIB-4b's day-1 design note answers this; if the answer is no, it blocks LIB-9 as well.
6. Not verified: whether strategy.max-parallel accepts an expression. This matters only if D-LIB4-QUEUE's trigger fires.
7. Not measured: per-id time for PQ-H (the full runQa), the offline open, the entry row and the layers-page compare. K = 5 at LB1 and K = 49 at 145 ids are therefore lower bounds until C14.
8. #194 is in delta review after a FAIL. A change to ci-verdict.mjs, shard.mjs or the guard shape moves LIB-4a's line lists and LIB-4c's seam; re-merge and re-run A9/A10 and C10.
