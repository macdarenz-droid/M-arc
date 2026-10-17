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
| **D-LIB4-FIXTURE-2** (2026-10-17, on #232) | LIB-4b's day-1 check answered **no** to both questions on main c14212af + #189 54d37f2d + #180 4540d827: `gen/plates.mjs`, `content.mjs`, `feel.mjs`, `hands.mjs` and `zooms.mjs` read only `goldenRows()`, so a shipped library row gets no `ht-`, `feel-`, `hand-`, `posture-` or `zoom-` file and `loaders.ts` imports a chunk that does not exist (`vite build`: "Could not resolve"); and `ht-pull-up.ts`'s inputs leave out the composers its How-to imports (`layers/exercises/pull_up.mjs`, `layers/engine/hand.mjs`, `layers/engine/body.mjs`). Both are LIB-2's outcome (plan 5.3 "the layer generators HT-5..HT-8 add ... become data", "`inputsSha256` per file, over that file's own inputs"; LIB-2-DESIGN.md section 3, last row, and 6.1).<br>(a) A new card **LIB-2b** (section 10) does both. It builds now, on #189's head, by the LIB-2 builder. LIB-2 merges without it: nothing on main ships a library id before LIB-9, and LIB-2b corrects LIB-2-DESIGN.md section 13.<br>(b) LIB-4b builds the tuples, runner, twins and B1-B4, B6-B10 on the 8 now. B5 waits: LIB-4b merges LIB-2b's head when LIB-2b posts READY, then runs B5. LIB-4b's READY needs B5. LIB-4c's C4 class 3 and C11-C14 also wait for LIB-2b. | No check moves or is dropped; B5, C4 and C11-C14 keep their text and wait for real inputs. | Supervisor, now; LIB-2b; checklist slot 3a.1 (after LIB-4a, before LIB-4b); re-slotted to 3a.0 (after #219, before LIB-4a) by 11.1 item 15. |
| **D-LIB4-PINS-2** (2026-10-17, on #233) | Which card fixes each test that fails on LIB-4a's 22-id scratch (28 tests, the same with and without LIB-4a):<br>- **LIB-2b** owns every test whose subject is an output of `gen/plates.mjs`, `content.mjs`, `feel.mjs`, `hands.mjs` or `zooms.mjs`, or the generated-file count (for example content.test (d), zooms HT7-A1/A5, feel HT8-A6, generate.test HT2-A2, the HT2-A6 css tests, library-core L2-A4, L2-A21 and "60 files"). Where one is pinned to the 8, LIB-2b makes it follow the registry's shipped rows. LIB-4a does not edit them.<br>- **LIB-4a** owns the rest (ids.test HT2-A5, hint.test HT6-A8, no-form-guide D-HT1 A5, ht10-budgets D-HT10-A4, plate-state HT3-A4, library-scale L2-A22/A23, library-core L2-A2/A9/A12/A15/A16) and fixes them now: LIB-2 is frozen except for review fixes, and LIB-4a re-merges its final head before READY.<br>- A failure on the synthetic scratch counts as a clone artifact only if it names a synthetic id's missing source or generated file. Each one is listed in the PR with that reason. A count pinned to the 8 is never a clone artifact. | Every test keeps its assertion. Counts follow the registry, never a smaller number. | LIB-4a now; LIB-2b in its build. |
| **D-LIB4-ENTRY** | Before LIB-9 pushes, all of these hold:<br>- GATE-SPLIT (#194 and #219) is merged;<br>- LIB-2b, LIB-4a, LIB-4b and LIB-4c are merged (LIB-2b: D-LIB4-FIXTURE-2);<br>- the CI calibration is committed (LIB-4c C14);<br>- **5 consecutive identical full runs of the library family at K ≥ 2 on one sha** (LIB-4c C13). They are dispatched one after another and compared by `tools/plates/library/ci/compare.mjs`; a cancelled run is dispatched again and not counted;<br>- HT-3's 5 identical CI reruns (plan 5.4:596). E8's runs count only when they are on one sha with identical HT-3 lines; otherwise dispatch 5 runs on one main sha.<br>A flake is root-caused, never re-run to green. | It is the plan's own entry condition, moved before LB1 because LB1 needs K = 5. | Supervisor. |
| **D-LIB4-PAR** | LIB-4b measures 1 page against 4 pages inside a job on the 8 and reports `nproc` and the speed-up. It adopts more pages only when both modes give identical rows and identical px. If P > 1 is adopted, B2 (both browsers) and C13 run at that P. | It is adopted only at 0 px difference. It is the only lever on runner-minutes. | LIB-4b. |
| **D-LIB4-QUEUE** | No `max-parallel` cap for now; train and main runs are the merge critical path.<br>The supervisor acts on either trigger: the first howto-shard of a train or main run waits more than 15 min, or a non-library lane waits more than 30 min.<br>The fix is add-only and on the new jobs only: a cap for non-full refs, after the scratch branch shows that `strategy.max-parallel` accepts an expression (not verified yet). | Scheduling only. Full runs are never capped. | Supervisor. |
| **D-LIB4-DOCS** | Amend:<br>- plan 3.6: the L3 wording, and "the 8 keep their HT-1..HT-10 blocks, unchanged" becomes "unchanged for the 8; A1, A8 and A9 extended under D-LIB4-CTRL and D-LIB4-A9";<br>- plan 5.4: :551, :562-564, :571-577, :584-601;<br>- plan 5.5, section 7 row 3, section 9 item 3, risk 9;<br>- SPEED.md:62 and its capacity line :25 (C = 12-27);<br>- GATE-SPLIT design 3.5 (job name `howto-shard`);<br>- the AGENTS.md file-ownership row for `scripts/screenshot-gate.mjs`: one pointer line to D-LIB4-CTRL and D-LIB4-A9 (risk 22).<br>Figures:<br>- 269-281 s per id locally, and 274 s on CI with once-per-run included;<br>- about 852 runner-min per full run at 145 ids [est];<br>- 2 full runs per merge;<br>- the APK about 35 min later at C = 20 [est]. | Docs only. | Supervisor, before the cards are `ready`. |
| **Owner fact** | Which GitHub plan the account is on, since it sets the concurrent-job limit. Bundled into the next owner message that is already needed. | — | Supervisor. |

## 2. Order

1. **#194, then #219.** #219 must re-merge #194's final head, because it carries `0df96482`. LIB-4a's gate edits go inside GATE-SPLIT's guarded blocks.
2. **#189 (LIB-2), then #180 (LIB-3).**
   - **2a. LIB-2b #234** (slot 3a.0, 11.1 item 15): after #219, before LIB-4a; never while GATE-SPLIT's E8 pairs run.
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

> Amended by section 11.1 (2026-10-17): `LIB_ONCE.run` has four rows (item 8), B5's scratch ids, pairs and QA inputs follow items 3-5, and PQH rows import `candidateOf` (item 2). Where this card and 11.1 differ, 11.1 wins.

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

> Amended by section 11.1 item 9 (2026-10-17): C4 class 1 includes committed layers pages, C9 asserts committed == rebuilt == pin, and C6/C8 expect the four `LIB_ONCE.run` rows.

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
5. **Answered no (LIB-4b, #232, 2026-10-17); ruled D-LIB4-FIXTURE-2, card LIB-2b.** Was: can LIB-2's generator emit a library plate chunk from a spec and How-to source, and do its per-output inputs list shared composers? D-LIB4-FIXTURE and C4's class 3 depend on both. LIB-4b's day-1 design note answers this; if the answer is no, it blocks LIB-9 as well.
6. Not verified: whether strategy.max-parallel accepts an expression. This matters only if D-LIB4-QUEUE's trigger fires.
7. Not measured: per-id time for PQ-H (the full runQa), the offline open, the entry row and the layers-page compare. K = 5 at LB1 and K = 49 at 145 ids are therefore lower bounds until C14.
8. #194 is in delta review after a FAIL. A change to ci-verdict.mjs, shard.mjs or the guard shape moves LIB-4a's line lists and LIB-4c's seam; re-merge and re-run A9/A10 and C10.

## 10. Card LIB-2b: library rows in the layer generators (D-LIB4-FIXTURE-2)

> Amended by section 11.1 (2026-10-17): hands ship as `handpair-<key>` only, the QA candidate builder and E7 are added, budgets.test.ts and the new library modules join write_scope, and layers pages are committed. Where this card and 11.1 differ, 11.1 wins.

```
id: LIB-2b
model: claude-opus-5-5
base: #189's head (origin/claude/lib-2-scale-core, 54d37f2d or later); merge origin/main (c14212af or later) with a merge commit; after LIB-2 merges, merge main again
branch: claude/lib-2b-library-rows
depends_on: LIB-2
build_prerequisites: none (builds now)
merge_prerequisites: LIB-2 merged; review passed; green on a head containing latest main; checklist slot 3a.0 (after #194 and #219, before LIB-4a; 11.1 item 15, was 3a.1)
shared-file owners: none of the AGENTS shared files; the golden-B layers (`tools/plates/layers/**`) and vendor folder stay read-only (their MANIFESTs)
hard card: post the design note on the PR before bulk building; the supervisor rules at the next tick
```

**Outcome.** Plan 5.3 holds for the layer generators: a shipped library row gets every output a row of the 8 gets, made from its own sources, and every output's `inputsSha256` covers every file its text depends on.
- Deliverable: library-row emission in `gen/plates.mjs`, `content.mjs`, `feel.mjs`, `hands.mjs` and `zooms.mjs`; one inputs-closure helper; their tests.
- Evidence: the Acceptance rows.
- Finish: merged. Nothing is visible in the app (no library row is `shipped` on main).

**read_first:** LIB-2-DESIGN.md sections 3 (last row), 5, 6.1, 6.2, 9, 13; plan 2.7 and 5.3 (on claude/howto-options); #232's BLOCKED comment (the measured facts); D-LIB4-FIXTURE and D-LIB4-FIXTURE-2 above.

**write_scope:** `tools/plates/gen/{plates,content,feel,hands,zooms}.mjs`; `tools/plates/library/**` (new helper, registry readers); `tests/howto/**` (new tests; existing tests only where a LIB-2 test pins today's goldenRows-only behaviour, plus the plugin-output and file-count tests that D-LIB4-PINS-2 assigns here, each listed in the PR); the generated files the generator rewrites (never by hand); `docs/howto/library/LIB-2-DESIGN.md` section 13; `docs/COACHING-DECISIONS.md` (append-only, D-LIB2b-*).
**reserved:** the How-to sheet (golden B pixel-identical); `scripts/screenshot-gate.mjs`; `tools/plates/fidelity/**`; `.github/**`; budgets (no ceiling moves); LIB-6's code (#181): it is never merged into this branch.

**Do**
1. **Design note** on the draft PR, then wait for the ruling. For each plugin it states, for a library row:
   - the file(s) each output is made from: the plates chunk from the batch's pinned plates page (`buildPlatesPage`); the `ht-` content and `docs/research/howto/<id>.json` from `sourceOf(id)`; `feel-` from the feel renderer over the library sources; `hand-`, `posture-` and `zoom-<chromeId>.css` from the batch's pinned layers page; and where each pin lives (the batch golden file, design 6.2);
   - the inputs rule: one helper returns, per output, the files its text is made from, plus the transitive closure of their relative imports (computed, never hand-listed), plus the shared files the plugin reads. The same rule applies to the 8 and to library rows;
   - what a shipped row with a missing source or page does: the generator throws, naming the id and the file;
   - which fixture outputs need LIB-6's `build-layers-page.mjs`: proofs use a page built on a scratch branch that merges #181 (9b8f76e6); the page is an input file here.
2. Build it. For the 8 the paths and bytes read stay today's.
3. Correct LIB-2-DESIGN.md section 13 (as built) for both changes.

**Acceptance**

| ID | Criterion | Evidence | Red before because | Mutation |
|---|---|---|---|---|
| E1 | A shipped library row gets every output | Test on a scratch root with one source-level row (D-LIB4-FIXTURE: one of the 8's spec and How-to source, id and chromeId swapped, stage `shipped`, pinned pages): the generator writes the same output kinds the 8's row gets, `generate --check` passes, `npm run build` passes on that scratch tree; the file count is asserted | Today only `ids.ts`, `loaders.ts`, `coverage.ts` and `ids-node.mjs` change, and the build fails "Could not resolve" | One plugin back to `goldenRows()` → red, naming that plugin's missing output |
| E2 | Inputs cover every imported composer | Test over every output of the 8 and of the scratch row: its inputs contain the transitive relative-import closure of its sources (count asserted; an empty list is red). Touching one composer in a scratch copy changes `inputsSha256` of exactly the outputs whose closure holds it | `ht-pull-up.ts` leaves out `layers/exercises/pull_up.mjs`, `layers/engine/hand.mjs`, `layers/engine/body.mjs` | Direct sources only (no closure) → red |
| E3 | No dangling chunk | Test: every import in `loaders.ts` resolves to a generated file; a shipped row with no How-to source, or no pinned page → the generator throws naming the id and the file | `loaders.ts` imports `./ht-<slug>`, which does not exist | Emit the loader line before the source check → red |
| E4 | The 8 unchanged | L2-A3 (54 bodies), golden A and B checks, HT-3 L1/L2/L3, `budgets.test.ts` unedited and green. The 8's header and `hashes:` lines may change (6.1). If an `ht-*` gz then passes its ceiling, stop and report: no budget is re-set | — | The existing mutations |
| E5 | A non-shipped row changes nothing of the 8 | L2-A4 still green with a non-shipped batch row | — | L2-A4's mutation |
| E6 | No regression | `npm run check`, `npm run test:tz`, gate | — | — |

**risk_and_recovery**
- **The closure moves the 8's `hashes:` lines past a gz ceiling.** Stop and report; the supervisor rules (no silent re-set).
- **The feel renderer cannot run on library sources without LIB-6 code.** Say so in the design note with the exact import; the supervisor rules before any LIB-6 file is touched.

## 11. Design-note rulings for LIB-2b (#234) and LIB-4b (#232), 2026-10-17

The supervisor workflow wf_f45aa9b0-355 drafted these. It ran one Opus judge per note, each reading the code at the named refs, then one adversarial critic per judge. The rulings in 11.2 and 11.3 are the judge's text, plus the critic's amendments where it amended. Section 11.1 is the supervisor's: it settles every place where the two sets disagree, and it records the card changes. Where 11.1 and a ruling below disagree, 11.1 wins.

### 11.1 Supervisor decisions (these win over 11.2 and 11.3)

1. **Library hands ship only as `handpair-<key>`.** This follows D-LIB7-1, LIB-2 design 12, plan 2.3 and D-LIB4-A4 (b).
   - Card 10 Do 1 was wrong to say "`hand-` from the pinned layers page". It now reads: a library row's hand is its LIB-7/LIB-12 pair (`handpair-<key>`), or nothing when its archetype is `none`; its `zoom-<chromeId>.css` comes from the pinned layers page.
   - `hands.mjs` never writes `hand-<chromeId>.ts` for a library row. `tests/howto/hands.test.ts` is not edited, so the amendment rejects D-LIB2b-PINS (6).
   - On LIB-4a's synthetic scratch, a hands.test failure caused by syntheticRoot's `hand-<nc>` clones is a clone artifact (D-LIB4-PINS-2), listed with that reason.
2. **One QA candidate builder.** It lives at `tools/plates/library/candidate.mjs`, exports `candidateOf(id, { root, platesHtml, engine })` and is owned by LIB-2b. LIB-4b's PQH rows import it, which settles D-LIB2b-QA and D-LIB4b-QACAND under one name.
   - Census view comes from a required batch-row field `view`.
   - Research comes from the card file named in the How-to's `research.card`.
   - A T-mode parent's fragments come from the parent's latest `plate` entry, found as in D-LIB4b-KEYS.
   - Mode `P` throws until it is ruled.
   - The generator gates the node half, the batch sheet build and LIB-4b's PQH rows gate the full report, and D-LIB3-5 is amended to say so. Plan 3.2's sentence is amended to name these three places (D-LIB4-DOCS).
3. **Scratch QA inputs for fixtures (D-LIB4-FIXTURE-3; amends D-LIB4-FIXTURE's "nothing is mocked").**
   - **Where:** LIB-2b's E1 row and LIB-4b's B5 scratch ids only.
   - **What:** each may carry a scratch research card in LIB-3's shape. Its plateFacts are measured from the copied spec's own engine report, and its topFault equals the spec's mistakeFault.
   - **Limits:** it is marked scratch and is never pinned or shipped.
   - **Mutation:** every fixture test includes "card removed → the generator throws QaRefused naming the id and PQ-H6".
   - **Why:** without these inputs the generator's node-half gate refuses the row, and no output exists to test. Real research arrives with LIB-5 and the batch cards.
4. **Fixture pair panels are real.** E1's and B5's scratch `pairs.mjs` return the hand close-up block cut from that scratch id's own fixture layers page, which LIB-6 builds on a scratch worktree. They never return a placeholder `<div hidden>`. B5 includes two scratch ids that share one pair key. Its `HT6/A7-lazy` row runs in a fresh app context per id. If this needs LIB-7 code that the scratch branch lacks, the builder stops and reports.
5. **B5's scratch ids** are taken from {lat pulldown, seated cable row, leg press, machine chest press}, so no inherited Right override or exemption is involved. Scratch `budgets.json` entries are at measured + 10 %, on the scratch tree only. Criterion: every row passes, with the scratch QA inputs from item 3.
6. **Budgets follow the registry.**
   - `tests/howto/budgets.test.ts` joins LIB-2b's write_scope. It reads the registry's shipped rows: at the 8 nothing changes, and every shipped row's `ht-`, `posture-` and `feel-` chunk must have an entry.
   - The 8's ceilings (8,930 B gz per feel chunk, 24 KB gz per posture chunk) also apply to library chunks.
   - Batch PRs add their entries at measured + 10 %. No ceiling is raised.
   - A per-key budget for `handpair-<key>` goes to LIB-7's card, as a pre-merge line.
7. **Layers pages are committed (D-LIB2b-PAGES).**
   - Plan 3.5's "derived, not committed" is amended for layers pages only. Plates pages stay derived.
   - Plan 3.5's per-id `layers` entries become one batch `layers-page` pin plus the generator's per-id cuts, so a one-id layer change is a batch-page golden update.
   - `approvedBy` stays `'owner'` until the "stamps (O5)" wording is ruled.
   - Plan 3.5's `[golden update]` guard does not exist. The guards are the generator's pin check, LIB-2b's bijection test and LIB-4c's L1. Plan 3.5 is corrected (D-LIB4-DOCS).
   - Repo size is a named risk: about 43 MB working tree and 9-10 MB packed at 145 ids [est]. If packed growth under `tests/howto/golden/library/` passes 20 MB, the supervisor re-rules before the next pin.
8. **LIB_ONCE contract amendment (card 4).** `LIB_ONCE.run` = `qa-selftest/browser@*`, `guard/L-sections@390`, `guard/HT7-l3text@390` and `guard/HT9-A3-dup@390`, all ('*', 'silent-black'). LIB-4c's C6 and C8 expect all four, and B8 puts their seconds into `times.json` `once`. The per-shard rows are unchanged.
9. **Added to other cards:**
   - LIB-4c C4 class 1 includes `tests/howto/golden/library/<batch>.layers.html`, which selects that batch's ids. C9 asserts committed == rebuilt == pin.
   - LIB-6's pre-merge lines: an unconditional `spec.files` test that builds the LIB-2b fixture through `layersSpecOf` and compares bytes; and making D-LIB2b-FIXTURE (4)'s rebuild compare unconditional.
   - LIB-7's pre-merge line: the per-key handpair budget (item 6).
10. **Open before LIB-8 or LIB-9 builds a library layers page.** These are blockers for LIB-9, not for LIB-2b or LIB-4b.
    - **(a) D-LIB9-ENGINE.** Which engine draws a library plate on its layers page? Golden A's vendor engine carries `poly` and the flat-palm updates; golden B's layers engine does not. Owners: LIB-6 and LIB-8.
    - **(b) D-LIB9-HANDPAGE.** A library card's hand close-up on its layers page must be rendered from its pair key, so the page reference equals the app's `handpair` chunk. Owners: LIB-6 and LIB-7.
    - LIB-4b's T1 twin (`fragments ===`) covers every library id.
11. **Card 10 changes, in addition to the above.**
    - E1 now reads: the generator writes `ht-`, `feel-`, `posture-` and `zoom-<chromeId>.css`, the research JSON, and `handpair-<key>` for the row's key, never `hand-<chromeId>`; the file count is asserted against that list.
    - New acceptance row **E7**: QA node-half gate. A row failing any node-half problem other than the browser keys is refused with QaRefused naming the id. Mutations as in D-LIB2b-QA.
    - write_scope adds `tools/plates/library/candidate.mjs`, `tools/plates/library/layers-spec.mjs`, `tools/plates/library/inputs-closure.mjs`, `tests/howto/budgets.test.ts` (item 6), `tests/howto/fixtures/lib2b/**`, and new batch-format fields (`pages`, `view`) in the registry's validation.
12. **Inputs of a library row's layer outputs.** `feel-`, `posture-` and `zoom-<chromeId>.css` list, as inputs, the row's pinned page, its `layersConfig`, its batch golden file and batch file, the plugin code files, `tools/plates/layers/MANIFEST.json` and `tools/plates/layers.mjs`, because ZDOTS, HX_TAIL, HAND_CSS and FEEL_CSS enter their text or checks. E2 asserts this. Mutation: drop MANIFEST.json, and E2 is red.
13. **LIB-4b map gaps (2026-10-17, on #232).** Four groups of gaps are named; none of them drops a per-id check.
    - **X3b:** `ht3Behaviour` A1 negatives (bench press and the custom exercise show no entry). They have no library-id subject. HT-3 and LIB-4a's control block (D-LIB4-CTRL) cover them on every run.
    - **X9a:** `runHt10` `golden`, the C10/C18 exemptions on the 8's golden page. Library ids inherit no exemptions. If a batch entry ever names a C10 or C18 exemption, that id's row checks it on its own page, and the row is red until it does.
    - **X9b:** `runHt10` `fixtures` (19 checks). They guard `ht10Sweep` and `ht10DomProbe`, which the runner imports and never copies, and which HT-10 covers on every run. B3's pin proves the imports.
    - **X9c:** `runHt10` A5's per-shard time budget. For the library, LIB-4c's 1,800 s verdict covers it.
    - HT-3b A2's `HowToSheet-*.js` and `.css` budgets are build-wide and map to X4.
    - The count is **2,947** on the 8, not 2,979. `HT6/A6` and `HT9/A5` are one row per id and theme, covering N, M, T@2400 and R:end, so 64 rows each, equal to each block's printed "64 plate pairs". B1 pins 2,947.
14. **B5 pair keys (D-LIB4-FIXTURE-4, 2026-10-17, on #232; amends item 4).** Today a pair panel is cut from one exercise's layers page and carries that exercise's ids (`#<chromeId>-zoom-hand`, its close button, its labelling), and `ZoomHost.tsx:85` inserts it unchanged. So a real panel cannot yet be shared by two ids.
    - B5 runs now on 3 scratch ids with 3 separate pair keys, each panel cut from its own id's fixture page.
    - The shared-key proof moves to LIB-7's card, under D-LIB9-HANDPAGE (item 10b): an exercise-neutral `pairPanel(key)`, LIB-6 drawing a library card's hand block from its pair key, the runner's HT-6 twin finding a shared-key panel by its pair markup, and HT6/A7-lazy with two ids on one key, each in a fresh context.
    - D-LIB4-ENTRY gains: that shared-key proof passes before LIB-9 ships an id that shares a key.
    - Nothing is loosened: no shared key can ship before LIB-7's exercise-neutral panel exists, and the check moves with the capability.

15. **Order and the LIB-2b x LIB-4a conflict (D-LIB2b-ORDER, 2026-10-17, supervisor session_01SNCyDETVkqVxtLoQxn2Ue9; amends section 2 and card 10's slot).**
    - **The conflict (checked).** On any head that holds both cards, `tests/howto/lib-4a.test.ts` A1/A2 fails: `library: lib_dumbbell_bench_press (batch SYNTH, tools/plates/library/batches/zz-synthetic.json): shipped, but its batch file has no pages`. The path is `write-ids.mjs:61` → the copy's `generate.mjs` `render()` → `gen/plates.mjs` `libraryOutputs` → `batch-golden.mjs` `pagesOf`. Seen on #232's source-gate (job 117346820949 on 96ef793). Each branch alone is green; the text merges cleanly.
    - **Owner of the fix: LIB-4a**, in its own files (`tools/plates/library/scale/write-ids.mjs`, and `tests/howto/lib-4a.test.ts` only if a fixture line must change). LIB-2b's refusal (E3, `pagesOf`) and `missingChunks` stay exactly as LIB-2b ships them: a shipped row with no pinned page must throw.
    - **New order:** #194 → #219 → **LIB-2b #234** → LIB-4a #233 → LIB-4b #232 → LIB-4c. LIB-2b takes slot 3a.0 (was 3a.1). Why: the red then lands on the head of the card that owns the failing file, and its evidence runs on a real head that holds both; LIB-2b holds only main and is closer to its final PASS; LIB-4a holds #194 and cannot merge before it anyway; LIB-4b already holds LIB-2b.
    - **When LIB-2b merges:** in the GATE-SPLIT train behind #219 if its delta PASS is in by then, otherwise in the next train. Never while GATE-SPLIT's E8 pairs run (a main move voids them).
    - **LIB-4a's steps:** after LIB-2b's delta PASS, merge LIB-2b's passed head into `claude/lib-4a-checks-at-scale` with a merge commit (main instead, once LIB-2b is on main), then fix write-ids. Evidence on that merged head: `lib-4a.test`, `library-rows.test` and `library-scale.test` green; mutation "write-ids back to today's full `render()` call" → A1/A2 red. If write-ids also trips on `content.mjs` or `ids.mjs` for the clones, the same scope rule applies. If no fix inside LIB-4a's files works without loosening a check, stop and report on #233; the supervisor rules again.
16. **LIB-4a open points (2026-10-17, on #233).**
    - **(a) E1 pin.** `tests/gate-split.test.ts`'s pinned group count joins LIB-4a's write_scope for that one line: +1 per guarded block LIB-4a adds (101 → 102 today), still an exact `toBe`. D-LIB4a-2 is accepted.
    - **(b) Timing entry.** LIB-4a adds one `scripts/gate-times.json` entry for its own group `LIB-4a`, solo-measured locally in UTC and Pacific/Auckland and scaled by GATE-SPLIT's local→CI ratio, as D-GATESPLIT-LIB2/OA1 did. Add-only; that line joins its write_scope. Every later card that adds a block does the same.
    - **(c) A3 attribution past the import crash.** The without-card gate at 153 stops at FG-OFF's import, so errors from later blocks are attributed with `node tools/plates/generate.mjs --check` and `npm test` on the same without-card tree. Each with-card error must appear verbatim in that output or in the without-card gate output before the crash. Anything not shown there is a stop-and-report, never "known".
    - **(d) Duplicate D-A3-7b-3.** The second copy in `docs/COACHING-DECISIONS.md` on the branch is a merge artifact; drop it, so the file's net diff against main is add-only.
    - **(e) One floor shape for pinned-to-8 tests.** Each test LIB-4a edits under D-LIB4-PINS-2 asserts the exact count from the registry (never `>=`) and contains each of the 8. Where its subject is `shippedRows()`, it also asserts `shippedRows().slice(0, 8)` equals the `plates.json` keys in order (D-LIB2b-PINS), so both cards pin one shape. Each edited test keeps its "drop one id at the 8 → red" mutation.
    - **(f) Scratch pushes.** A builder session pushes only to its own branch. LIB-4a runs its scratch trees locally. When a CI run on a scratch tree is needed, it posts the exact `writeIds`/`exportTo` commands and its head sha on #233, and the supervisor pushes `claude/lib-4a-scratch`.

17. **B5's F5 (D-LIB4b-F5, 2026-10-17, on #232; ruling (a)).** All 3 scratch ids raise F5 at 3.57:1: the selected-Mistake-tell chrome contrast that each of the 8 carries as a named exemption in `tools/plates/library/qa/exemptions.json` ("approved chrome … the same on all 8 by construction (locked chrome CSS); an owner item like O7").
    - B5's scratch plate entries may carry `exemptions: ['F5']` with that reason quoted verbatim. Scratch only: never pinned or shipped (11.1 item 3's limits).
    - Evidence: each scratch id's measured F5 ratio equals the 8's 3.57:1. Mutation: the exemption removed from one id → only that id's PQH F5 row goes red.
    - Why nothing is loosened: F5 still runs on every row, and the exemption names exactly the known chrome property the 8 carry.
    - **Open for LIB-9 (D-LIB9-F5):** every real library plate will raise the same F5, and "new plates inherit none". Before LB1's sheet, the supervisor rules either a named per-plate exemption under the 10-01 delegation or a chrome fix through a golden update. This is not decided here.
18. **Library hand panels unstyled (D-LIB2b-HANDCSS, 2026-10-17, on #232 and #234; ruling (b)).** A library row's hand comes from the shared `handpair-<key>.ts`, which imports no CSS. Its `zoom-<chromeId>.css` arrives only through its `posture-` chunk. Opened first in a fresh context (as HT-6 and HT-10 do), the panel is unstyled: the pager tabs are 20 px (C10) and the boxes differ from the layers page. LIB-4b's B5 shows 31 HT6 and 15 HT10/sweep rows red. Adding the css import fixed lat pulldown 18/18.
    - **Owner: LIB-2b,** because a shipped library row must get every output and behaviour a row of the 8 gets (card 10 outcome; E1). The fix goes in its generator files (`tools/plates/gen/ids.mjs` loader emission, or `hands.mjs`/`handpairs.mjs`), never in app components.
    - **Constraints:**
      - no `hand-<chromeId>.ts` for a library row (11.1 item 1);
      - `handpair-<key>.ts` stays exercise-neutral, with no per-id import inside it (D-LIB9-HANDPAGE's direction);
      - D-LIB4-A4 and D-LIB4-A9's exact chunk sets still pass;
      - the 8's bytes and loaders are unchanged (E4).
    - **Evidence:**
      - a test that every shipped library row's HAND loader brings in that row's `zoom-<chromeId>.css` before the panel, both in the generated `loaders.ts` and in the E1 tree's built chunk graph (the vite manifest);
      - mutation: drop the css from the loader → red;
      - the 8's loaders.ts lines are byte-unchanged.
    - **Then:** "LIB-2b FIXED" and a delta review by the same reviewer. LIB-4a merges LIB-2b's final passed head. B5's final run waits for this fix through LIB-4a's final head. No B5 row is waived.
    - **Gotcha:** E1's node-level checks could not see this. Only a browser opening the hand close-up first does.
19. **COPY_EDITS (D-LIB4b-COPYEDITS, 2026-10-17, on #232; ruling (c)): accepted, with limits.**
    - Verbatim clones of lat pulldown and seated cable row are refused by PQ-H8 (`normal.chest.cue has 16 words (max 15)`; `normal.tall.cue … semicolon`). The fixture may edit only those two cues, minimally, in the scratch copies.
    - Evidence:
      - the edits are listed in the fixture code with the refusal they answer;
      - mutation: revert one edit → `QaRefused … PQ-H8` naming that id;
      - nothing else in the copied How-to sources differs from the 8 (a byte diff in the test).
    - Golden B itself carries those two cues. They are approved and byte-locked, so they are recorded as golden-B follow-up 12 (HANDOVER 8.2) and not changed. PQ-H8 is a library rule; it is not loosened.

### 11.2 LIB-2b rulings (#234)

#### D-LIB2b-PAGES

*Q1: should each batch's layers page be committed (tests/howto/golden/library/<batch>.layers.html), or built inside generate?* Owner: LIB-2b builds (1), (2) and (6). The supervisor amends plan 3.5 and adds the C9 compare in (4) to LIB-4c's card..

Commit it. Conditions the builder applies:
(1) The batch file's `pages` has three keys: `plates` (tools/plates/library/pages/<batch>.json, as the note says), `layers` (tests/howto/golden/library/<batch>.layers.html) and `layersConfig` (tools/plates/library/pages/<batch>.layers.json). `layersConfig` holds LIB-6's buildLayersPage spec as data, with repo-relative paths: { groups:[{id,title,ids:[libId]}], optionsModule, closeups:{libId:{optionsKey}}, jump }. Without it, LIB-4c's L1 has nothing to rebuild a layers page from (see D-LIB2b-LAYOUT).
(2) The batch golden file holds one `layers-page` entry {pageSha256, bytes}. The generator reads the committed file and throws, naming the batch and the file, if it is missing or its sha256 or byte count differs from the pin. It does this before any cut.
(3) The page enters the repo only in the same commit as its `layers-page` pin, which is the supervisor's [golden update] commit. A row needs no layers output before it is `shipped`.
(4) Provenance belongs to LIB-4c's L1 (C9). It rebuilds every committed layers page from its sources through layersSpecOf and LIB-6's builder, on every run, in both modes. It is red unless rebuilt bytes == committed bytes == pin.
(5) Plates pages stay rebuilt at generate time (card Do 1, as golden A is today).
(6) LIB-2b corrects LIB-2-DESIGN 6.2 in section 13 ('no library page is committed' becomes 'layers pages are committed and pinned; plates pages are derived; L1 rebuilds both'). The supervisor amends plan 3.5's 'Fixtures are derived, not committed' line the same way.

**Amended after critique:** Keep (1)-(6), and add:
(7) A LIB-2b vitest guard. The files in tests/howto/golden/library/ are exactly the batch golden files, plus one <batch>.layers.html for each batch file whose latest `layers-page` entry exists. Each page's sha256 and bytes equal that entry. Each batch file's pages.layers names that path. Mutations: an unpinned page added is red; a pin without its page is red.
(8) layersSpecOf translates layersConfig.closeups, keyed by lib id, to LIB-6's keys (howtoIdOf(card), build-layers-page.mjs:61). layersConfig never sets regionFix:false.
(9) LIB-2-DESIGN 13 gets a risk row: about 43 MB working tree and 9-10 MB packed at 145 ids [est, 21% gzip], plus one page per batch golden update. Trigger: if packed growth under tests/howto/golden/library/ passes 20 MB (2x the estimate), the supervisor re-rules (for example, a content-addressed build cache) before the next pin.
(10) Until the 'stamps (O5)' wording is ruled, `layers-page` entries carry approvedBy 'owner' (verifyChain).

#### D-LIB2b-FEEL

*Q2: may feel- for a library row be cut from the pinned layers page instead of coming from a renderer run (a deviation from card Do 1)?* Owner: LIB-2b.

Yes. Conditions:
(1) Cut it with the existing feelSectionOf(page, chromeId) (feel.mjs:34-42: exactly one section, nothing nested), only after the page's pin check (D-LIB2b-PAGES (2)).
(2) renderAll() and the 8's path stay on goldenRows, so the 8's bytes do not change (E4). feel.test.ts:44 is not edited.
(3) Per shipped library row, a test asserts that the feel-<chromeId>.ts section === feelSectionOf(that row's page, chromeId), and that the source's feel rows (keys) appear as fr-btn ids in the section, as the 8 are checked.
(4) The renderer equivalence is proven by D-LIB2b-FIXTURE (4): wherever LIB-6's builder exists, the fixture page is rebuilt and must be byte-equal. In production it is proven by L1.
Record this as D-LIB2b-FEEL in COACHING-DECISIONS and in LIB-2-DESIGN section 13.

**Amended after critique:** Keep (1), (2), (4) and the record. Replace (3): for every shipped library row, a test runs the same HT8-A1 checks the 8 get (rest map, each row's watch and pain marks, legend, no is-playing or is-focus). It uses `rendered.fm` from renderAll() and that row's own How-to `feel` spec, loaded in place through loadContent. It also asserts feel-<chromeId>.ts section === feelSectionOf(the row's pinned page, chromeId). Mutations: a 1-byte change in the library section is red; one row's mark moved to another muscle in the source, without a page rebuild, is red.

#### D-LIB2b-FIXTURE

*Q3: may the E1 fixture's layers page be built from #181 on a scratch worktree and committed as test-fixture bytes?* Owner: LIB-2b; the LIB-6 merge PR rebuilds the fixture if its bytes move.

Yes, with exact provenance:
(1) The fixture row is lib_cable_lateral_raise. Its spec and How-to come from tools/plates/layers/exercises/pull_up.mjs and pull_up.howto.mjs by one deterministic transform committed in the LIB-2b test helper: swap the id and chromeId, and re-point every relative import to its original target under tools/plates/layers/**.
(2) The page is built on a scratch worktree (main + #189 + LIB-2b + #181 9b8f76e6, never pushed). It is built from those transformed bytes, through layersSpecOf (D-LIB2b-LAYOUT), with one group holding only this card. Commit tests/howto/fixtures/lib2b/cable-lateral-raise.layers.html and tests/howto/fixtures/lib2b/provenance.json. The provenance file holds: pageSha256, bytes, sha256 of the transformed spec and How-to, the #181 sha, the LIB-2b sha, the node version and the exact command.
(3) The E1 test asserts:
- the transform's output shas equal provenance;
- the committed page sha equals provenance;
- then generate, generate --check and npm run build pass on the temp tree.
(4) When tools/plates/library/build-layers-page.mjs exists in the tree, the same test rebuilds the page through layersSpecOf and asserts byte equality with the committed fixture. This happens on LIB-4b B5 and the LIB-4c scratch branches, and on main after LIB-6 merges. The PR shows that path once, run on the scratch worktree.
(5) The fixture never goes into tests/howto/golden/library/ and is never pinned or shipped.
(6) If LIB-6's output changes later, the fixture is rebuilt with the recorded command in that PR.

**Amended after critique:** Keep (1)-(6), and add:
(7) The E1 temp tree writes tools/plates/library/hands/pairs.mjs, the path handpairs.mjs's loadPairs reads. It maps lib_cable_lateral_raise to one scratch key, and its pairPanel returns a zx panel. E1 asserts: HAND maps the clone's chromeId to handpair-<key>; no hand-cable-lateral-raise.ts exists.
(8) The temp batch row carries the clone's census view. A scratch research card in LIB-3's documented shape (qa/index.mjs:4-10) supplies plateFacts measured from the clone's own engine report and a topFault equal to its mistakeFault. It is test data only, never pinned or shipped. Mutation: remove the card, and generate throws QaRefused naming lib_cable_lateral_raise PQ-H6.
(9) On the scratch worktree, the fixture page is built from two checkouts at different absolute paths, with byte-equal results, and provenance.json records both.
(10) While build-layers-page.mjs is absent, the test asserts that tools/plates/library/render/ is also absent, so a half-merged or renamed LIB-6 is red. The LIB-6 merge PR makes the rebuild compare unconditional; the supervisor adds that line to LIB-6's card.

#### D-LIB2b-LAYOUT

*Gap found by the Q3 check: library sources cannot both be imported in place (content.mjs, closureOf, the QA candidate, LIB-4b tuples) and be copied verbatim into LIB-6's mirror.* Owner: LIB-2b.

Library specs and How-to sources keep in-repo relative imports, which is LIB-8's convention. Every Node consumer imports them in place: content.mjs's loadContent, closureOf, candidateOf, and LIB-4b via content.mjs's exported loadContent (it never calls import(sourceOf(id)) directly).
LIB-2b adds tools/plates/library/layers-spec.mjs with layersSpecOf(batchFile, { stageDir }). It imports no LIB-6 code and returns LIB-6's buildLayersPage spec:
- groups: from pages.layersConfig, with card id = chromeId with '-' replaced by '_';
- closeups and optionsUrl: from layersConfig;
- files: for each row, `exercises/<card>.mjs` and `exercises/<card>.howto.mjs` map to staged copies of the row's spec (`src`) and sourceOf(id). In each staged copy, every relative specifier is rewritten from its in-repo target. A target under tools/plates/layers/** becomes its path relative to the mirror's exercises/ folder, so the mirror's one engine instance is used. Any other target becomes its absolute file URL (golden B's own pattern, howto-layers.mjs:49).
LIB-4c's L1, LIB-4b's fixture.mjs, the E1 fixture and LIB-9 build layers pages only through it.
Test: staging the fixture's re-pointed sources gives text byte-equal to golden-B-layout copies. When the builder exists, the built page equals the committed fixture page.

**Amended after critique:** layersSpecOf stages the whole data closure (closureOf) of each row's spec and How-to source into the mirror, and imports nothing from outside it:
- a target under tools/plates/layers/** maps to its mirror path;
- the row's own spec (row.src) maps to exercises/<card>.mjs;
- every other closure file is copied to library/<its repo-relative path> inside the mirror, with its specifiers rewritten by the same rule (vendor-engine files included);
- node: builtins stay as they are.
Any specifier that would leave the mirror throws, naming the file. Tests: the fixture's staged text is byte-equal to the golden-B-layout copies; a planted composer that imports ../../layers/engine/body.mjs is staged with its import mapped into the mirror; no staged file contains 'file://'. Where the builder exists, the built page equals the committed fixture page from two checkout paths.

#### D-LIB2b-PINS

*D-LIB4-PINS-2 table in the addendum: is every edit at least as strict, are the floors right, is HT2-A2's split right?* Owner: LIB-2b.

The rule is accepted: literal becomes registry shippedRows(), with the same matcher and per-item checks. The floor is accepted too: shippedRows().length >= 8, and shippedRows().slice(0,8) ids === Object.keys(plates.json) in order.
Corrections:
(1) Add shippedRows(all = rows()) = all.filter(r => r.stage === 'shipped') to registry.mjs. It does not exist; only shippedIds does (:66).
(2) Do not edit tests whose subject is a golden-8 artifact and which cannot fail with library rows: generate.test.ts:28-31 (HT2-A1: the golden A fixture and GOLDEN.json latest), feel.test.ts:44 (HT8-A1: renderAll stays the 8 under D-LIB2b-FEEL), class-map.test.ts:38's golden A extract, library-core L2-A4 :72-73 (identity list) and L2-A19. Library per-item checks go in new `it` blocks against the batch golden and batch pages.
(3) HT2-A2 is generate.test.ts:88-95 (plates.mjs's exact output list), not :29-30. Expected = the 10 literal paths unchanged ∪ one ht-<slug>.ts per shipped library row, with exact toEqual. The :127 loop (hashes.inputsSha256 == header) covers every shipped row.
(4) HT8-A6 (feel.test.ts:435-441): count = shipped rows. The 8,930 B gz ceiling still applies to every feel-*.ts, library files included. HT7-A5 (zooms.test.ts:172-186): the 24 KB gz per posture chunk applies to every shipped row, and the loaders count = shipped rows. A library chunk over a ceiling means stop and report (card E4). There is no 'no ceiling here' class.
(5) HT7-A1 (zooms.test.ts:39-43, :53-61): the file set must equal shipped chromeIds exactly. The crop count is exact: n === Σ posturePanels(pageOf(row), chromeId).length over shipped rows, and the 8's subtotal stays === 16. A '≥ 16' bound may never replace an exact count. The per-id panel, zoom-key and ZDOTS checks run against each row's own page and source.
(6) Add hands.test.ts:31-35 (exact hand- set = shipped chromeIds without a LIB-7 pair) and :42-44 (distinct panels = that set's size). HT6-A7 (:90-100) stays unedited.
(7) css.test.ts:127-131 takes the slug from registry rows (plates.json, :18, has no library slug).
(8) Discover the list instead of guessing it. Run full `npm test` on the E1 tree and list every red test with its line and fix in the PR. A red test outside D-LIB4-PINS-2's LIB-2b set goes to the supervisor before it is edited.
(9) Each edit keeps its mutations: a 9th shipped row with the count re-pinned to 8 is red, and dropping one output kind for that row is red.

**Amended after critique:** Keep (1)-(5) and (7)-(9). Replace (6): hands.test.ts is not edited; :31-35 and :42-44 keep the 8, and LIB-2b writes no hand-<chromeId>.ts for a library row (see D-LIB2b-LOADERS). Add:
(10) library-core '60 files' = 60 + Σ over shipped library rows of {ht-<slug>.ts, feel-<c>.ts, posture-<c>.ts, zoom-<c>.css, docs/research/howto/<id>.json}, plus one handpair-<key>.ts per distinct key used by shipped rows. E1 asserts the exact number.
(11) New `it` blocks, one per shipped library row:
- HT2-A1's check: the ht- plate fragments (fragmentsOf) === the batch golden plate entry, and src/slug/prefix/chromeId agree;
- class-map.test.ts:38's 'no plate or plate-fit class' over the batch plates page's shipped plates;
- HT8-A1's checks per D-LIB2b-FEEL.
Each gets its mutation.

#### D-LIB2b-CSS

*(a) Is it sound that the shared CSS files stay built from the 8's pages only, plus the throw-on-mismatch rule?* Owner: LIB-2b.

Yes: plate.css, hand.css, feel.css and posture.css stay built from the 8's pages, so their bytes do not change. Replace the note's named-constant checks with one exact rule per file. For each shipped library row, rebuild the file from that row's pages with the same function, and throw unless the bytes are identical, naming the id and the file:
- plate.css: rewriteCss(galleryCss(batch plates page));
- hand.css: rewrite(HAND_CSS + chromeRules(howtoCss(build-page.mjs, layersStyle))). howtoCss already throws if HOWTO_CSS is not in the page;
- posture.css: cropPlateCss(galleryCss(layers page)) + the .zdot rule. The note has no posture.css check;
- feel.css: feelCss({ FEEL_CSS, pageCss: HOWTO_CSS, used: used8 ∪ the library sections' classes ∪ RUNTIME_CLASSES }), after checking that FEEL_CSS is in the page. A new unstyled class passes; a class HOWTO_CSS styles throws.
Also require:
- ZDOTS appears exactly once in the layers page;
- with comments and its own rows' `.hx-<chromeId>` rules removed, the layers page's style equals golden B's style with the same removal for the 8.
Give each shared file one mutation that makes the generator throw.

#### D-LIB2b-LOADERS

*(b) Is ids.mjs 'after: plates.mjs' with a ctx.prev check sound, or does the check belong elsewhere?* Owner: LIB-2b.

It is sound and belongs in ids.mjs, because ids.mjs writes the import lines. Precisions:
(1) Set `after = [...LAYERS, 'tools/plates/gen/plates.mjs']`, as an array of paths that keeps LAYERS. There is no cycle: plates.mjs has no `after`, and content.mjs keeps [plates, ids].
(2) Check through the existing `has` (ctx.prev when given, else the file on disk), so syntheticRoot's ctx-less outputs() call keeps working. Throw `ids: <id>: no src/howto/generated/ht-<slug>.ts` before any text is built.
(3) Extend the check to every map. For each shipped row, throw unless all of these exist: has(ht-<slug>), has(feel-<c>), has(posture-<c>), and has(hand-<c>) or pairOf[c]. Today chunkMaps silently drops a missing kind. For the 8 all four exist, so no bytes change.
(4) E3 test: parse every import('./X') in the rendered loaders.ts, on main and on the E1 tree, and assert X.ts is an output. E1 also asserts that HAND, POSTURE and FEEL each map the fixture's chromeId. Mutation: emit the loader line before the check, and it turns red.

**Amended after critique:** (3) becomes: for each shipped row, ids.mjs throws unless has(ht-<slug>), has(feel-<c>) and has(posture-<c>), and, unless coverage-archetypes.json gives the id 'none', has(hand-<c>) or pairOf[c]. Every map line it writes still points at an existing output.
The hand rules for library rows live in hands.mjs's library path:
- it emits zoom-<chromeId>.css only, never hand-<chromeId>.ts;
- it throws, naming the id, when a non-'none' row has no pair;
- it throws when a 'none' row's layers page holds a hand close-up for it.
Tests: on main and on the E1 tree, every import('./X') in loaders.ts is an output; syntheticRoot at n = 8, 22 and 153 still builds. Mutations: emit a loader line before the check (red); give the clone no pair (hands.mjs throws).

#### D-LIB2b-CLOSURE

*(c) Do the closure helper's import forms cover the real sources?* Owner: LIB-2b.

They cover today's data sources.
(1) closureOf applies only to data sources: How-to sources, plate specs and their composers. Plugin and page-builder code keeps its static lists.
(2) Build the graph from esbuild's metafile (bundle, platform 'node', packages 'external', write false), taking the repo-relative, sorted inputs. esbuild 0.28.2 is already a devDependency, so nothing new is added. It handles multi-line imports, export-from, comments and JSON import attributes.
(3) esbuild silently skips a computed import(), so closureOf also scans each closure file. It throws, naming file:line, on an import( with a non-literal argument, on require(, and on createRequire.
(4) File reads are not imports. A closure file outside the MANIFEST-locked trees (tools/plates/layers/**, tools/plates/vendor/**) that calls readFileSync or new URL(…, import.meta.url) throws. When a closure enters a locked tree, that tree's MANIFEST.json joins the inputs. This is because engine/sheet.mjs reads tokens.css and the Inter woff2.
(5) An unresolved import throws, naming the importer.
Tests: the pull_up.howto.mjs closure has exactly 13 files; a planted computed import throws; a planted readFileSync in a library composer throws.

**Amended after critique:** Keep (1)-(5), and add:
(6) In a data closure, a specifier that is neither relative nor `node:` throws, naming the file and specifier.
(7) The scan in (3) throws on any import( whose argument is not one plain string literal, template literals included.
Tests: a planted bare import throws; a planted template-literal import throws; the pull_up.howto.mjs closure is exactly 13 files, plus layers MANIFEST.json as an input.

#### D-LIB2b-QA

*(e) LIB-3 expects LIB-2 to supply a QA candidate builder. Does one exist, and which card owns it?* Owner: LIB-2b; the supervisor amends D-LIB3-5.

None exists. LIB-2b owns it.
(1) LIB-2b merges #180 at 4540d827 now; #180 merges before LIB-2b in checklist order.
(2) New tools/plates/library/candidate.mjs: candidateOf(row, { platesHtml, engine, batchEntry }), returning qa/index.mjs:4-10's shape:
- spec from row.src;
- plate and article from the batch plates page;
- research, tempo, topFault and mistakeFault from the row's sources;
- census.view from docs/howto/library/inputs/census.json;
- derivation via derive.mjs for D and T rows;
- exemptions from the batch golden plate entry (flags only, D-LIB3-flags).
(3) gen/plates.mjs runs runQa(candidate) with no browser half on each shipped library row before emitting. It throws QaRefused naming the id for any problem other than the browser-half keys: `browser:not-run` in PQ-H1/H4/H5, and F2/F5 'browser checks not run'.
(4) LIB-4b's PQH rows import candidateOf and gate the full report (report.ok).
(5) The supervisor amends D-LIB3-5: the generator gates the node half; the shards gate the full report.
(6) On day 1, measure whether the pull-up clone passes the node half (unverified). A hard-check failure is reported, never exempted.

**Amended after critique:** Keep (1), (4) and (5), and change the rest:
(2) candidateOf reads census.view from a required batch-row field `view` ('front' or 'side'). The batch file records the census source sha. The registry validates `view` for library rows.
- research (plateFacts, tempo, topFault) is read from the card file the row's How-to names in research.card, in the shape qa/index.mjs:4-10 documents;
- a missing card or field is not defaulted: runQa reports it, and the generator refuses the row (no exemption);
- the rest stays as the judge wrote it.
(3) The only problems ignored are exactly key 'browser:not-run' in PQ-H1, H4 and H5, and F2/F5 with why 'browser checks not run' (qa/index.mjs:47-48). Mutation: any other F2 or F5 reason is not ignored.
(6) E1 supplies scratch QA inputs per D-LIB2b-FIXTURE (8). Its mutation (card removed) gives QaRefused for PQ-H6 naming the id.
(7) Cache each row's QA result in-process, keyed by sha256 of its candidate inputs. Measure the node-half seconds per id on E1 and project them over 145 ids × about 9 renders per job. If a job would pass 30 min, the supervisor rules before LIB-9.
(8) The supervisor adds this as an acceptance row E7 to card 10, with the mutations above, and amends D-LIB3-5.

### 11.3 LIB-4b rulings (#232)

#### D-LIB4b-KEYS

*(1) Callout and tell keys come from the id's generated plate module ht-<slug>.ts (normal.cues / mistake.cues) instead of 'the batch golden entry', and theme-less rows carry theme '*'. Is this at least as strict, and still 'from source only'?* Owner: LIB-4b.

Adopt, with one addition that makes it strictly bound to the pin. libraryTuples reads src/howto/generated/ht-<slug>.ts and takes plate.normal.{firstKey,cues} and plate.mistake.{firstKey,cues}. Before it uses any key, it recomputes the `cues` fragment exactly as fragmentsOf does: sha256(JSON.stringify({normal:{firstKey,cues},mistake:{firstKey,cues}})). That value must equal the pinned entry's fragments.cues. For the 8, the pinned entry is the latest GOLDEN.json `plate` entry. For a library id, it is the latest `plate` entry for that id in tests/howto/golden/library/<row.batch>.json, and only after verifyBatchChain(file, GOLDEN.entries) returns []. It also asserts cues[0].key === firstKey for each figure. The N:<k> and M:<k> rows are cues.slice(1), in module order. libraryTuples throws, naming the id and the file, when any of these holds: the module is missing, the batch file is missing or invalid, the entry is missing, or the hash differs. It never returns fewer tuples. Theme '*' is allowed only on per-id rows whose state ends '@*': L2/*, PQH/*, HT4/A5-* and the size rows of D-LIB4b-SIZE. For every per-id row, theme === '*' must hold exactly when width === '*'; libraryTuples and the runner both assert this. LIB_ONCE rows stay fixed literals. In the doc, call these rows 'theme-less', not 'node-only': PQH has a browser half. Add to B1: a module copy with one tell dropped makes libraryTuples throw 'cues sha256 … != entry'.

**Amended after critique:** Adopt the judge's hash-bound rule, with two changes. (a) The pinned entry for a library id is found by scanning every tests/howto/golden/library/*.json, not by building a path from row.batch. Every file must pass verifyBatchChain(file, GOLDEN.entries). The id's `plate` entries must sit in exactly one file; otherwise libraryTuples throws 'plate entry for <id> in N files'. Use that file's latest `plate` entry for the id. (b) The module is read either by extracting the `plate:` object literal that moduleText writes as JSON literals, or through esbuild's transform, which is already a gate-time import. No new dependency. Any parse error shows up as the 'cues sha256 … != entry' throw. Everything else stands as the judge wrote it: cues[0].key === firstKey, rows from cues.slice(1), throw and never return fewer tuples, theme '*' ⇔ width '*' on per-id rows, the 'theme-less' wording, and the B1 mutation.

#### D-LIB4b-X1

*X1: is HT-1's golden self-check correctly not a per-id row?* Owner: LIB-4b.

Accepted. goldenSelfCheck (golden A, defaults exactly as the HT-1 group calls it) runs once per shard as LIB_ONCE.shard(k): self/0px@390 and self/1px-control@390. No per-id row.

#### D-LIB4b-SIZE

*X2 (chunk sizes) and X4's HT-3b A2: are the per-chunk size checks truly build-wide?* Owner: LIB-4b (rows); each batch card (entries); LIB-2b (budgets.test follows the registry, see other findings).

X2 is rejected for its size parts, and X4 is rejected for A2. Add these theme-less per-id rows, read from www/assets of the shard's build. (a) L2/chunk-size@*: exactly one ^ht-<slug>-[\w-]{8}\.js$; raw ≤ 153,600 and gzip at the default level ≤ 36,864 (HT-2 A9); within its tests/howto/budgets.json entry `ht-<slug>-*.js` (HT-3b A2, same gzip). A missing entry fails. (b) HT7/A5-size@*, for ids whose sourceOf(id) has at least one posture zoom: exactly one ^posture-<chromeId>-[\w-]{8}\.js$; gzip level 9 ≤ 24,576; within its entry `posture-<chromeId>-*.js`. A missing entry fails. (c) HT8/size@*, for ids with feel rows: exactly one ^feel-<chromeId>-[\w-]{8}\.js$, within its entry `feel-<chromeId>-*.js`. A missing entry fails. The rest of X2 is accepted. HT-2 L1 (generate --check) is build-wide and runs every gate. HT-6 A7's 'hand-*.js count = 8' is covered by LIB-4a's handChunkProblems (D-LIB4-A4 b), because library hands ship only as handpair-<key>. HT-6 A7's per-chunk hand- ceiling applies to the 8 only, for the same reason. Each batch PR that ships an id adds budgets.json entries for its ht-, posture- and feel- chunks at measured + 10 %, under the budgets.json rule (LIB-2 design: 'like any new chunk'). The B5 fixture writes such entries on its scratch branch only. LIB-4b recomputes the scope table: +24 rows on the 8.

**Amended after critique:** Keep rows (a)-(c), their limits and the missing-entry rule. Add three points. (1) B2 must show that, on the 8, L2/chunk-size raw/gz from www/assets equals both HT-2 A9's printed sizes and HT-3b A2's printed sizes. If the www bytes differ from A9's probe build, the twin runs A9's own probe build, the same vite call. (2) Rows (b) and (c) apply when the generator's output list for the id (LIB-2b) contains a posture-<chromeId> or feel-<chromeId> chunk. Each also asserts zero such chunks for an id whose output list has none. (3) The supervisor adds `tests/howto/budgets.test.ts` explicitly to LIB-2b's write_scope; budgets.json stays reserved apart from scratch fixtures. LIB-2b makes it read the registry's shipped rows: at the 8 the test is unchanged, and it requires an entry for every shipped row's ht-, posture- and feel- chunk. Batch PRs add their entries at measured + 10 %. Scope table: +24 on the 8.

#### D-LIB4b-X3

*X3: ht3Behaviour A3/A8, presentControls and ht3SectionGuards — no per-id rows?* Owner: LIB-4b.

Accepted, on these conditions. (i) ht3Behaviour A3/A8 run on plate 0 only for the 8, so no per-id row is needed. Per id, S0 ≤ 700 elements is in PQ-H7, the 44 px controls are in HT10/sweep (C10), and the return to S0 is in HT10/sweep (A2). (ii) presentControls tests the imported primitive presentGolden. The HT-3 group covers it on every gate run, on the same Chrome (D-LIB4-VERDICT is red when `chrome` differs). (iii) ht3SectionGuards guard ht3Fidelity's code. The runner re-implements that code, so its copy needs its own once-per-run guard: LIB_ONCE.run row guard/L-sections@390 (D-LIB4b-GUARDS).

**Amended after critique:** (i) No separate A3/A8 row. Instead, `entry/open@390` (paper) also asserts, per id, A3's S0 facts at the moment the entry opens the sheet: the h2 text equals the id's exercises.json name; the eyebrow is 'How to do it'; exactly one pressed normal callout, which equals the module's normal.firstKey; no Mistake figure before the first tap; Mistake aria-pressed false; dialog element count ≤ 700. On the 8, B2 must show this row passes. In the doc, state that PQ-H7's s0 is the article count, not the app sheet. (ii) presentControls stays as the judge accepted. (iii) guard/L-sections@390 as in D-LIB4b-GUARDS.

#### D-LIB4b-X4

*X4: HT-3b A1-A3, A4b-d and A5 — build-wide or once per run?* Owner: LIB-4b.

A1 (main-chunk content probe over every file in src/howto/generated), A3 (launch idle and tap-to-plate on the squat), A4b (build-B carry-over), A4c (chunk-load toast, squat) and A4d (PlateSheet chip) are accepted as once per run. HT-3b covers them on every gate run, and HT-10 `speed` once per run. A2 is rejected (D-LIB4b-SIZE). A5 is accepted, but the doc must name its real coverage. HT-3b A5 scans only HowToSheet and the 8's ht- chunks. C17 on library chunks is covered by HT-10 A4 `assets`, which runs checkChucks over every HowToSheet-, ht-, hand-, feel-, posture- and zoom- JS chunk, and by LIB-2 A26 (loaders-, handpair-). A4a stays per id as `offline/open@390`, including A4's localStorage-keys equality.

#### D-LIB4b-X5

*X5: HT-7 D-HT7-L3-text-9 (30 opens of the squat's 'Bony bump') and the planted L3-text probes (leg press foot).* Owner: LIB-4b.

Accepted as non-per-id. The 30-open label check is a once-per-run stability proof of the app host. HT-7 covers it on every run (150 opens asserted). The planted probes guard HT-7's L3 text re-open classifier. T3 re-implements that classifier, so add the LIB_ONCE.run row guard/HT7-l3text@390. It runs the same four planted cases (path moved 1 px → immediate fail; text-only change → one re-open; a kept text change ≠ 0 px; an exact re-open = 0 px) through T3 on leg press foot, golden B, silent-black.

#### D-LIB4b-X6

*X6: HT-8 early 'Feel it' chip and the shimmer tripwire.* Owner: LIB-4b.

Accepted. earlyChip runs on the squat (card 1) in HT_FULL, and shimmerCosts on HT_PLATES[2]. Both are sheet behaviour and performance, once per run, covered by the HT-8 group on every run and by HT-10 `speed`. Lazy loading of the feel chunk per id stays in HT8/lazy@390.

#### D-LIB4b-X7

*X7: HT-9's HT-3b A3 split and the A3 duplicate-line fixture.* Owner: LIB-4b.

The split is accepted. It is a property of the sheet component (Setup and Risks are inserted after the plate), checked on index 0 in silent-black and covered by the HT-9 group every run. The duplicate-line fixture guards HT-9's A3 check, which T5 re-implements, so add the LIB_ONCE.run row guard/HT9-A3-dup@390. It plants a second copy of a red-flag line in Setup and must be caught ('shows 2 times') by T5's A3, on index 0 in silent-black.

#### D-LIB4b-X8

*X8 (first half) and unlisted exemptions in HT-4: L0-B and the HT-4 assertions the note does not list.* Owner: LIB-4b.

L0-B is accepted. It is golden B's own lock; for library layers pages, LIB-4c's L1 rebuilds every pinned page to its sha. Two more named exemptions are added. X8b: validateLateralRaiseCrops (ref-src lateral raise only; no library id uses ref-src). X8c: HT4-A6's capture('#nope') throw probe (gb.capture is imported, not re-implemented, so the HT-4 group covers it every run). The remaining HT-4 A5 assertions are per id and fold into HT4/A5-protected@*: at least 1 renderPlate call captured for this id, every opts key in {id, mistake, selected}, and one untouched base call whose spec deep-equals the reference spec, which is the spec the id's pinned plates page is built from.

#### D-LIB4b-POSES

*(3) X8 question: does PQ-H cover poses, so that HT4/A5-poses can be exempt for library ids, or does a library pose list get added by LIB-2b or LIB-9?* Owner: LIB-4b (T1); no work for LIB-2b or LIB-9.

There is no exemption, and no hand-written pose list from LIB-2b or LIB-9. HT4/A5-poses@* stays for every library id, and T1 applies HT-4's rule with its exception tables replaced by a derivation from source. (1) Capture every renderPlate call made while building that id's layers page with LIB-6's build-layers-page.mjs. Use HT-4's shim method on a mirror of tools/plates (captureRenderPlateCalls pattern). (2) Attribute each call to the base or camera call, or to (zoom key, side ∈ {right, wrong}) from its opts.id as LIB-6 builds it: crop.mjs `${z.key}-${role}`, and the zbox uid. A call that cannot be attributed fails. Every right and wrong side of each zoom declared in sourceOf(id) must have at least one captured call (anti-blindness). (3) Right side, and every unattributed-to-wrong call: poses.start and poses.end must deep-equal one of classifyPose's references, taken from the reference spec: start, end, or mergeDeep(end, mistake.pose). (4) Wrong side: poses.start, poses.end and mistake.pose may also deep-equal the fault pose that the id's pinned How-to source declares for that zoom's wrong side, resolved exactly as LIB-6 resolves it: poseOf(z.wrong) or mergeDeep(poseOf(z.right), poseOf(z.wrong)) in the crop family; for the zbox family, the declared still for that side and the `over` still. (5) The 8's ENUMERATED_POSES and ENUMERATED_MISTAKE_POSES never apply to a library id. T1 asserts that a library spec.id is none of the 8's spec ids. A Right-side override is a new design kind: it needs an owner pilot-sheet approval and a named supervisor ruling that pins a literal in the batch golden entry, and none is allowed now. (6) On the 8, T1 keeps HT-4's exact path (golden-B build plus the enumerated tables), so B2 stays equivalent. (7) Test, on the scratch branch with #181: applied to LIB-6's build of the 8, the derived rule accepts every call HT-4 accepts except the two Right-side pins pull_up|shoulders-right and hanging_leg_raise|shoulders-right, which it reports. Mutation: the fixture's Right crop given a {base, pose} override → HT4/A5-poses fails.

**Amended after critique:** Keep (1), (2) and (4)-(6). Change the rest as follows. (3) On every call not attributed to a Wrong side (base, cam, plate -n/-m, Right): poses.start and poses.end must deep-equal start, end or mergeDeep(end, mistake.pose) of the reference spec. A present spec.mistake.pose must deep-equal the reference spec's mistake.pose or mergeDeep(end, mistake.pose), as classifyMistakePose does. (4) On a Wrong side the source-declared fault pose is allowed, exactly as the judge stated, for both poses and mistake.pose. (7) The test on the scratch branch with #181 runs every HT-4 A5 assertion on LIB-6's build of the 8: protected fields, opts keys, untouched base call, fragments and poses. It must accept everything HT-4 accepts except the two named Right pins. The mutation stays. Pin the source text of goldenB.mjs's classifyPose, classifyMistakePose, validateCalls, protectedFieldProblems and fragmentProblems in twins/pins.json (D-LIB4b-TWINS). Named risk: a D or T child whose How-to copies its parent's Right override is red under this rule. It goes to a supervisor ruling on the pilot or batch sheet that introduces it, and is never relaxed in T1.

#### D-LIB4b-OPEN2

*(4) The extra harness option ht10GoldenCounts(browser, {html, ids}): additive, with defaults unchanged?* Owner: LIB-4b.

Approved under D-LIB4-OPEN, and LIB-4b's harness write_scope gains these lines. Exact signature: `export async function ht10GoldenCounts(browser, { html = readFileSync(HT10_GOLDEN_B), ids = HT_PLATES.map(p => p[0]) } = {})`. The trailing `= {}` is required, because the 3 existing one-argument calls must keep working. The body changes only by passing `html` to openGolden and `ids` as the evaluate argument. The runner calls it with { html: pages[id].layers, ids: [chromeId] } and passes the result through ht10Sweep's existing `golden` option. ht10Sweep needs no further change beyond D-LIB4-OPEN's order, custom and indexOf. B9 gains a mutation: change the `ids` default → ht10-gate red.

#### D-LIB4b-QACAND

*(5) PQH rows for library ids need a QA candidate builder. Do the rows stay red until it exists, and who owns it?* Owner: LIB-2b (builder); LIB-4b (rows).

Confirmed: they stay red and are never skipped. Until a builder exists, the runner emits all 11 PQH/* rows for a library id as fail, with reason 'no QA candidate builder'. B6 covers the absence. libraryTuples always lists them. The owner is LIB-2b. LIB-2 is frozen except for review fixes, and LIB-2b is the card that carries LIB-2's unfinished outcomes (D-LIB4-FIXTURE-2 a). Add to LIB-2b's card a new file tools/plates/library/candidate.mjs (outside qa/, which stays LIB-3's), exporting libraryCandidate(id, { root, platesHtml, engine }). It returns qa/index.mjs's candidate shape, with these fields: mode from the registry row (H, T, D; 'P' throws until ruled); spec from the library spec loader; plate and article from extractPlates and articlesOf of the id's pinned plates page; research from the id's research facts as sourceOf(id) and the generated research card hold them (the exact field path goes in LIB-2b's design note); census view from census.json; derivation for D and T from derive.mjs, with rebuildParent and parentFragments from GOLDEN.json; exemptions from the batch golden entry's exemptions list (empty if none). A missing input throws, naming the id and the file. New acceptance row E7: for the 8, libraryCandidate in mode 'approved' deep-equals candidatesOf's output (ignoring functions); a scratch library row gets every field; a missing research or spec file throws. LIB-4b's B5 (and so its READY) waits for this, as it already waits for LIB-2b's READY.

**Amended after critique:** LIB-2b owns tools/plates/library/candidate.mjs `libraryCandidate(id, { root, platesHtml, engine })` as the judge wrote, with these changes. Its base also merges #180 (4540d827) now, and it re-merges main after #180 merges. Derivation for D: parentFragments from GOLDEN.json. For T: from the parent's latest `plate` entry, found as in D-LIB4b-KEYS (GOLDEN.json for one of the 8, otherwise the one batch or pilot file that verifyBatchChain accepts). research: read from the research card v2 file and fields that content 3.2 and LIB-5 define. When the card or a field is absent, it throws, naming the id and the file. Keep mode 'P' throwing until ruled, E7, and B5 waiting on it. The PQH rows stay red with 'no QA candidate builder' until it exists.

#### D-LIB4b-COUNTS

*(6) Do the scope-table counts on the 8 equal what each HT block observes (B1)? Spot-check two families.* Owner: LIB-4b.

The internal arithmetic is correct: 2,907 on this head. Spot-checks below. HT-3 families, with Σ(callouts+tells) over the 8 = 44 from the generated modules: F3 216 = HT-3 `f3`; L2b 328 = `l2b` 216 + title 40 + sections 72; L3 pixel 344 = `pairs` (≥ 300) + 16 slot-api; L4 72 = `anims` 40 + ends 16 + motion 16. HT-7, with 16 posture keys: 504 = 31 × 16 + 8 controls, against HT-7 counters pairs 96 (80 L3 + 16 reduced), anims 80, reduced 16, controls 8, restores 96. HT-6 401 matches 13 hand pages: `pairs` 105 = 65 pages + 40 grip, A6 32. The family totals do not equal single printed counters, so B1 must use an exact mapping table: each sub-state set → the block counter it equals (name and value on the 8), or 'formula × source count' for rows the block does not print (L2b title and sections, slot-api, L4 ends and motion, HT7 chip/A5/A4). Equality must be exact, and each block bound (≥ 300, ≥ 80, ≥ 200, ≥ 32, Show 17, 40 passes) is checked on the mapped count. The values are taken from the printed lines of B2's gate run on the merged head and quoted in the doc. Also add the missing HT-7 sheet-level row: HT7/A2@390 per theme plus HT7/A2:reduced@390 (paper). It carries 'no posture chunk fetched before the first posture tap', the data-motion match, and '#zdots removed after the sheet closed' (+48 on the 8). With D-LIB4b-SIZE (+24), the table becomes 2,979 on the 8. LIB-4b recomputes it and B1 pins it.

**Amended after critique:** Adopt the exact mapping table, the bounds checked on mapped counts, and HT7/A2@390 per theme plus HT7/A2:reduced@390 (paper), +48 on the 8, for a total of 2,979. HT7/A2 also carries: the DOM's posture chip keys equal sourceOf(id)'s posture zoom keys, in order. For the 8 the twin keeps the literal 2 so that B2 holds. For library ids the count is the source's. Printed values are quoted from B2's merged-head gate run. Where an arithmetic check was not run, the doc says 'unverified'.

#### D-LIB4b-TWINS

*(6) Is the twin list complete against card B3 and D-LIB4-OPEN, and how is the pin defined?* Owner: LIB-4b.

Keep T1-T7 and the extra source pins of ht3Fidelity and ht3Behaviour, and add two. T8 is the HT-2 group: L2/chunk re-implements A9's per-row 'bundled chunk = GOLDEN fragments' check, and L2/chunk-size re-implements A9's size check. A source pin is added for runHt10 (tools/plates/fidelity/ht10.mjs), because the HT10 family re-implements its a2 composition and thresholds (pairs ≥ 2 per plate, 15 steps per sheet). Pinned text for a group: `group.statements.map(s => src.slice(s.start, s.end)).join('\n')` from parseGate(readFileSync(GATE_FILE)). For a function: the export's Function.prototype.toString(). All pins live in one file, tools/plates/library/fidelity/twins/pins.json ({key: sha256}), so the line D-LIB4-OPEN asks the supervisor to add to a later card's write_scope is a single path. The B3 message stays 're-check the library twin', naming the key.

**Amended after critique:** Keep T1-T8 and the group-text definition. A function pin's text is the function's source plus, in file order, the source of every non-exported module-level binding it references, found by parsing the module with gate-blocks' parser. This covers ht3Fidelity, ht3Behaviour, runHt10, and every goldenB.mjs function that a twin re-implements instead of importing (at least classifyPose, classifyMistakePose, validateCalls, protectedFieldProblems and fragmentProblems). A twin imports every exported helper its block imports, and copies none. The runner launches Chromium with HT-3's exact args, which T7's pin covers. Pins and the assertion map live in the one file twins/pins.json ({key: {sha256, map}}), so a later card's write_scope line stays a single path. The B3 message is unchanged.

#### D-LIB4b-GUARDS

*How are guards and planted-defect fixtures that prove re-implemented check code covered for library ids?* Owner: LIB-4b (rows); LIB-4c consumes LIB_ONCE unchanged in form.

Add three LIB_ONCE.run rows, which run on shard 1 and are exported from tuples.mjs so LIB-4c's verdict expects them. ('*','silent-black','guard/L-sections@390'): the runner's L-family, on HT_PLATES[0] against golden A, with fixtureSection still compares and restores sections, and with fixtureLeakSection fails L2b. ('*','silent-black','guard/HT7-l3text@390'), per D-LIB4b-X5. ('*','silent-black','guard/HT9-A3-dup@390'), per D-LIB4b-X7. Each guard row fails when its guard does not fire. B2 gains a mutation per guard: blind the guarded check in the runner → that guard row is red. Guards of imported code (presentGolden, gb.capture, ht10Sweep's inject fixtures, LIB-3's selftest) stay covered by their own blocks or by qa-selftest/browser@*.

**Amended after critique:** Adopt the three LIB_ONCE.run rows and the B2 mutations. The supervisor amends card section 4's contract text and LIB-4-DESIGN section 1 so that LIB_ONCE.run = qa-selftest/browser@*, guard/L-sections@390, guard/HT7-l3text@390 and guard/HT9-A3-dup@390, all ('*', 'silent-black'). LIB-4c's C6 and C8 expect all four. B8 measures their seconds, and they go into times.json `once`.

#### D-LIB4b-MAP

*How do we prove that 'anything left out is a named supervisor exemption' (D-LIB4-SCOPE) for every twinned block?* Owner: LIB-4b.

LIB-4-DESIGN.md section 2 gets an assertion map, kept as data in tools/plates/library/fidelity/twins/map.mjs. For each pinned text (every T1-T8 group, ht3Fidelity, ht3Behaviour, runHt10), it lists, in order, every match of /\b(?:errors|problems)\.push\(|\bP\(|\bF\(|\bfail\(/g with its target. A target is a state formula in tuples.mjs, an exemption id (X1-X8c), or 'def' for a helper definition. Test in library-fidelity.test.ts: the number and order of matches in each pinned text equal its map entries, and every target resolves. Mutations: delete one map entry → red; add a P( call to a twinned block → red (together with B3).

**Amended after critique:** The map lists every match of /\b[A-Za-z_$][\w$]*\.push\(|\bthrow new Error\b|\b(?:P|F|S|fail|crashed)\(/g in each pinned text, in order. Each match maps to a state formula, an exemption id, 'def', or 'collect' (a push that gathers data and never reaches errors, e.g. sizes.push, fetched.push). Every 'collect' entry names the variable, and the test asserts that the variable never flows into errors/problems within that text. The map data lives in twins/pins.json with the pins. Mutations: delete one entry → red; add a bad.push( or a throw to a twinned block → red, together with B3.
