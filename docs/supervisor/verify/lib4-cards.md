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
| B2 | Equivalent to the HT blocks on the 8 | `--ids golden8` on the merged head, in the container (Chromium 141) and in a CI dispatch on the scratch branch (Chrome 153): every row passes, and the max px off per id equals HT-3's printed value (0 where HT-3 reports 0). Each fixture gives the same outcome as its HT block, on the same id and family. Amended 10-18 ~11:15 by D-LIB4b-B2FIX: `fixtureSection` is HT-3's sections guard 1, a pass guard (harness.mjs:909-914), so it must pass with at least 4 pairs compared. `fixtureLeakSection` (L2b word-spacing), the 1 px shift and HT-10's `inject` must each turn red | New | The 4 fixtures: section passes with ≥ 4 pairs; leak, shift and inject red |
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

## 12. Speed-up rulings (2026-10-17 evening)

Supervisor session_01SNCyDETVkqVxtLoQxn2Ue9, about 18:45 UTC. A planning workflow drafted these rulings and one adversarial critic checked them. An adversarial re-check then found 10 problems; the text below applies the supervisor's decisions on them and every other re-check fix. Checked at 18:42 UTC, all unchanged since 18:00: main `49a2853` (frozen until the GATE-SPLIT train, about 22:00 UTC [est]); #194 `06ce286`; #219 `82d896d`; LIB-2b #234 `ccf0250`; LIB-4a #233 `66f5cef`; LIB-4b #232 `379cdf4`; `claude/libht-research` `9dbc7e0`; the plan on `claude/howto-options` `4a9fd86`. Where this section and sections 1-11 disagree, this section wins.

Posting order:
- Now, with tonight's starts (LIB-4c and LIB-9a): items 1-6, 12 and 13. LIB-5's start is held until the owner answers item 12's question and its card's open points (merge routes, the clone test, commit order, the 8's research) are settled.
- The owner's back-box question (item 12) was sent at about 18:50 UTC, with option 2 marked as still needing one more wording check; if he picks option 2, a fresh critic reads its wording before it is used.
- When E8 ends: "E8 done" to the LIB-4c, LIB-5 and LIB-9a sessions by message, and as a comment on any PR they have opened, with item 1's check command and its reading line.
- Items 7-9 before the steps that need them (LIB-6-PM; LIB-9a Do 4-6). Item 10 before the LIB-7 fixer starts. Item 11 before LIB-4c READY. Item 14 before W2B starts.
- 20:3x UTC: item 13's research task for the 8 started; LIB-5's card carries item 12's route (b) word for word, item 13's fallback, the two-commit order and the clone-test line (the open points named above are settled). LIB-5 starts with Do 1 now (reading and writing only, no lane slot, item 2): item 3 already keeps the owner's answer off its path until Do 9, and Do 4's placeholder fails closed until then.

1. **CI manners while E8 runs (D-LIB-CIMANNERS).**
   - **Decision:**
     - One text. The LIB-4c, LIB-5 and LIB-9a cards, and every start before the GATE-SPLIT train merges, carry it unchanged as their CI-manners block:
       > CI manners while GATE-SPLIT's E8 proof runs: push nothing until the supervisor sends you 'E8 done' (by a message to your session, and as a comment on your PR if it exists). After 'E8 done' and until the GATE-SPLIT train has merged, before each push check that no M/ARC gate run is in progress on claude/sup-gate-split-ci, claude/gate-split, claude/sup-gate-split-e6, claude/sup-gate-split-e9 or claude/sup-merge-train-* (curl the Actions API); if one is, wait. Then at most one push per 2 hours until READY unless the supervisor asks for one. Never use [skip ci].
     - Reading line: the 2-hour limit runs from 'E8 done' to READY, and the check comes on top of it until the train merges. A start after 'E8 done' gets 'E8 done' in its start message.
     - The check, sent with 'E8 done'. It must print nothing. A branch name means wait, and so does API-ERROR (rate limit or no answer). A queued run counts as in progress. Re-check at most every 10 minutes: unauthenticated calls are limited to about 60 an hour per IP.
       `for s in queued in_progress; do curl -sS "https://api.github.com/repos/macdarenz-droid/M-arc/actions/workflows/build-apk.yml/runs?status=$s&per_page=100" | jq -rs 'if (.[0].workflow_runs|type)=="array" then .[0].workflow_runs[].head_branch else "API-ERROR" end'; done | grep -E '^(API-ERROR|claude/(gate-split|sup-gate-split-(ci|e6|e9)|sup-merge-train-.+))$'`
       build-apk.yml is the workflow named "M/ARC gate". Tested at 18:42 UTC: it printed `claude/sup-gate-split-ci` (E8's workflow_dispatch run 39057924732), and it prints API-ERROR on an empty or error reply.
     - Cards already pushing (LIB-2b, LIB-4a, LIB-4b, the critical path): until the train merges, push only at a milestone the card needs (a review fix or evidence), and only after the same check prints nothing. They have no 2-hour limit.
     - Unchanged, outside the text: never cancel, re-run or dispatch another card's run; the supervisor pushes scratch refs (11.1 item 16 (f)); LIB-4c's dispatches follow its Do 10; never write to the owner. If a D-LIB4-QUEUE trigger fires, the supervisor slows LIB-9a's pushes first, then LIB-5's.
   - **Why:**
     - The draft ruling and the draft cards had two texts. They disagreed on where 'E8 done' arrives, on the check after E8, and on who has the 2-hour limit, so a builder could not obey both.
     - The first draft checked `claude/gate-split` only. E8 runs on `claude/sup-gate-split-ci`, and `claude/gate-split` has had no run since 07:59 (run 39015691673), so that check always read "free". E8's evidence counts only on its own sha (D-LIB2b-ORDER: a main move voids it).
     - LIB-4c carries the 2-hour limit too: its work before 'E8 done' is local, its CI evidence (C11-C14) runs on scratch refs the supervisor pushes, and the supervisor can ask for an extra push when the critical path needs one.
   - **Why nothing is loosened:** scheduling only. No check, job or run is skipped, cancelled or capped. Every push runs the full workflow, and the check fails closed.

2. **Active builders (D-LIB-LANE-ACTIVE; amends plan 7 "Lanes" and HANDOVER 5.12).**
   - **Decision:**
     - The LIB lane cap of 4 builders counts **active** builders: those with permitted work in hand (building, fixing, running evidence, or local work before 'E8 done').
     - A builder is WAITING only when it has no permitted work in hand: it waits on another card's head, a ruling, a review or a resume message. A WAITING builder keeps its session, holds no slot, does no new work and pushes nothing.
     - LIB-2b, LIB-4a and LIB-4b count as separate slots.
     - The count at 18:00: LIB-2b (HANDCSS fix), LIB-4b (B5/B7 on `379cdf4`), LIB-4c and LIB-9a are active, which makes 4. LIB-4a waits for LIB-2b's PASS.
     - LIB-5 starts now with Do 1 only, cut to pure reading and writing: the design note states each method, and Do 1 builds and runs nothing. The HowToSheet chunk measurement (Do 1 a) and the lint dry run over the 8's copy (Do 1 h) move to Do 2, which posts their numbers first. So Do 1 holds no slot. LIB-5 takes a slot from Do 2, on the supervisor's "LIB-5 resume" once the note is ruled and a slot frees.
     - A freed slot goes, in this order, to: a D-LIB2b-ORDER chain card or LIB-4c; LIB-5 (Do 2 on); the LIB-7 fixer; LIB-6-PM; LIB-9a's second drawer.
     - If a chain card's resume would make 5, the newest other start parks at its next commit, in this order: LIB-9a's second drawer, LIB-6-PM, the LIB-7 fixer, LIB-9a, LIB-5. The chain cards and LIB-4c never park.
     - The "3 drawing, 1 enabler or fix" split gives way while drawing slots would sit empty: they may carry enablers, as LIB-2b, LIB-4a, LIB-4b and LIB-4c do. LIB-9a takes a drawing slot.
     - Only the supervisor sends resume messages, on the PR and by send_message. A merge, a CI result, a PR event or the builder's own timer never resumes it. The supervisor counts active builders before every start or resume message and writes the count in it.
     - The HT/gate lane keeps its own cap. Research agents and critics are still not builders.
   - **Why:**
     - At 17:00 the chain held 3 sessions but only 1 or 2 active builders. Counting sessions would leave slots idle while LIB-4c (the critical path), LIB-5 (the merge gate for LIB-6/7/8 and LIB-9) and LB1's plates wait 1-3 days for a merge.
     - The re-check found two ways past the cap: builders working locally before 'E8 done' counted as waiting, and LIB-5's Do 1 needed a build and new lint code. Both are closed above.
     - HANDOVER 5.12: "The real limits are the CI queue and the merge order, not the number of builders."
     - Authority: the owner's 10-01 ~16:50 delegation (HANDOVER 4.1: "i authorise u to do #3 And other decision that will make the app better without me"); his 10-01 ~16:40 ask to go faster on the library with the same quality; his 10-17 "if u can make it faster thats good" (owner chat, not yet in HANDOVER); and AGENTS.md's ULTIMATE RULE, "add workers only for independent work that review and CI capacity can absorb". cards.md says to preserve explicit lane restrictions, so this is recorded as an amendment, not a clarification.
     - Capacity: about 9 sessions at the peak, which is plan 7's stated peak ("about 9 agents"). CI after the train: about 14-17 runs on 10-18 [est] at 12-27 concurrent jobs. Review: one fresh Opus reviewer each for LIB-4c and LIB-5.
   - **Why nothing is loosened:** no check, test, review, gate or merge order changes. At most 4 LIB builders work at once, which is what the cap bounds (Opus throughput, pushes and review hand-offs). Do 2 still posts LIB-5's chunk sizes and dry-run hits before any shared module is built, and an over-budget chunk or a ban that hits approved copy still stops the card.

3. **LIB-5's slot (D-LIB5-ORDER).**
   - **Decision:**
     - LIB-5 keeps plan slot 4: it merges after LIB-4c (3c) and before LIB-6 #181, LIB-7 #193, LIB-8 #109 and LIB-9.
     - Section 2 item 6 now reads: "LIB-5, then #181 (LIB-6) and later, #109 (LIB-8), then LIB-9."
     - LIB-5 starts now under item 2, with Do 1 first.
     - The back-pain box text and its word cap wait for the owner's answer to his decision 6 (item 12). LIB-5's Do 4 builds a fail-closed placeholder, and the answer is recorded before LIB-5's Do 9, which builds the box. Until then no rule allows a box over 30 words, and every placement of the box stays inside the reach of golden B's `lintShared` and C7.
   - **Why:**
     - Plan 7 row 4 (:761) sets the order. Section 2 item 6 left LIB-5 out, which was an omission, not a ruling. LIB-9 depends on LIB-2..LIB-8 (:765), and AGENTS.md forbids out-of-order merges.
     - The box: four existing limits say 30 or fewer (copy-lint.mjs:50 `RED_FLAG_BOX_MAX_WORDS`, "owner 2026-09-30"; c7.ts:38 `redFlagBoxWords`; plan 8 owner decision 6; plan 4.2 "about 29 words each"). R-W0-1 (verify/w0.md) sets 50 for this box. The box is still `status: draft`, and the owner has not seen it. The conflict is with his own decision, so only he can settle it.
     - The placeholder lets LIB-5 build everything else while he decides, so his answer is not on the critical path.
   - **Why nothing is loosened:** it restores the approved order. No 30-word limit is raised, or avoided by where the box is placed, before he answers. The placeholder throws for any row flagged 'back', so no such row can generate before the box exists.

4. **LB1 build-ahead before the entry condition (D-LIB4-ENTRY-2; amends D-LIB4-ENTRY).**
   - **Decision:**
     - D-LIB4-ENTRY's "Before LIB-9 pushes" now reads "Before LIB-9 pushes a head on which any of these is true":
       - an LB1 row is at stage approved-plate or shipped;
       - an LB1 row is in `tools/plates/library/batches/`;
       - an LB1 entry is in `tests/howto/golden/library/`.
     - The build-ahead slice LIB-9a may push to `claude/lib-9-lb1` (after "E8 done", item 1) with LB1 rows at stage drawing or review, kept in `tools/plates/library/lb1/rows.json`. It ships no id.
     - Its test A9 turns red if any of the three conditions appears. A9's mutations (one row set to shipped; rows.json copied into batches/) are checked by the supervisor at the LIB-9a slice review, not at LIB-9 READY.
     - Every other D-LIB4-ENTRY condition is unchanged.
     - Posted on `claude/sup-lib4-cards` before LIB-9a's first push.
   - **Why:**
     - D-LIB4-ENTRY's own reason is plan 5.4's entry condition (:596, "before K goes above 1"), moved before LB1 because LB1 needs K = 5. It protects CI stability at K > 1. LIB-9a cannot raise K: with 0 shipped library ids, K stays 1.
     - The plan schedules LB1 drawing now: plan 9, "LB1 drawing from LIB-2's first push" (LIB-2 merged in train 19); plan 6.1:636, "LB1's D plates need only the 8, so they can start first".
     - The sister rulings word the same gate as shipping: D-LIB4-A9, "before LIB-9 pushes its first shipped row"; 11.1 item 14, "before LIB-9 ships an id".
     - cards.md: a dependency is clarified against the plan and never silently waived. This narrows a ruling's literal scope, so it is recorded as an amendment.
   - **Why nothing is loosened:** every D-LIB4-ENTRY condition (GATE-SPLIT; LIB-2b, LIB-4a, LIB-4b and LIB-4c merged; C14; C13's 5 identical K ≥ 2 runs; HT-3's 5 reruns) still holds before any LB1 id is approved-plate, pinned, in batches/ or shipped. A committed test, with its mutations checked early, enforces the stage ceiling, so no LB1 id can raise K sooner.

5. **LIB-4c's inputs (D-LIB4c-1; the draft's (c) is dropped).**
   - **Decision:**
     - **(a) Scratch inputs.**
       - D-LIB4-FIXTURE-3 (11.1 item 3) and D-LIB4b-F5 (item 17) extend to LIB-4c's scratch ids on `claude/lib-4c-scratch`, with the same limits: marked scratch, never pinned on main, never shipped, and the "card removed → QaRefused naming the id and PQ-H6" mutation.
       - The set is 6 targets outside LB1 and LB2 (item 6) with no How-to on main: two per usable pool source (`lat_pulldown`, `seated_cable_row`, `machine_chest_press`; `leg_press` is unusable per fixture.mjs's COPY_EDITS note), each with its own pair key. If fixture.mjs cannot build two per source, at least 4. `planK` must give K ≥ 2.
       - COPY_EDITS (11.1 item 19) applies with its limits. Its refusal strings name an id, so LIB-4c's evidence names its own target ids.
       - The supervisor pushes the scratch refs (11.1 item 16 (f)), and the builder dispatches.
     - **(b) L0-lib (`tools/plates/library/MANIFEST.json`).**
       - Scope: library rows that have a plate entry in a batch golden file. The count is exact: 0 on main.
       - For each such row it lists, with each file's sha256 and the approving entry's hash: `closureOf(spec)`, `closureOf(How-to source)`, and every input of that row's pinned pages. The page inputs are:
         - the esbuild metafile import closure of the page builders and renderer: `build-page.mjs`, `plates-page.mjs`, LIB-6's `build-layers-page.mjs` and `render/**` (`closeups.mjs` included), and the hand loader `hands/pairs.mjs` with the files its `inputsFor(key)` lists;
         - the `MANIFEST.json` of every locked tree a builder imports from or reads from (`tools/plates/vendor/`, `tools/plates/layers/`);
         - each non-locked file a builder reads at runtime, by explicit path: the batch page JSON, the batch's `layersConfig`, its options module, and the files a layers spec's `files` map copies. They come from the builders' static input lists or from an fs-read trace of one real page build, and the check-in says which.
       - Checked: a metafile lists imports only, and `closureOf` is for data sources only (inputs-closure.mjs:4 on `ccf0250`: "page-builder code keeps its static input lists"). The builders read files at runtime: build-page.mjs:63 reads `VENDORED_PAGE` (`vendor/artifact/build-page.mjs`); plates-page.mjs:20 on `ccf0250` reads the batch page JSON; build-layers-page.mjs:110-115 on #181 @ `9b8f76e` copies, patches and reads layers-tree files in a mirror.
       - Entries change only in the commit that adds or replaces that pin. It is not a LOCKED tree in `inputs-closure.mjs`.
       - Mutations, each red in C0: one byte in a pinned row's spec; one byte in a pinned row's page builder; one byte in the batch page JSON; a runtime-read file left out of the set; a missing or extra entry.
       - The supervisor extends the agent guard, add-only, before LIB-4c merges: a non-merge commit touching MANIFEST.json needs "[golden update]" (plan 3.5). This replaces 11.1 item 7's "the [golden update] guard does not exist", which was written about layers pages.
     - **(c) Dropped.** `tools/plates/generate.mjs` leaves LIB-4c's write_scope. For C4 class 3, `ci/affected.mjs` builds the per-output inputs itself from the exported `loadPlugins()` and each plugin's `outputs()` (`o.inputs`, falling back to `mod.inputs()`). If C4 cannot prove that, class 3 stays off and those paths select all ids, as the card allows. C10b reads: "`generate.mjs` byte-unchanged; `generate --check` green".
     - **(d) Affected classes.** Class 1 adds the research card named by an id's How-to `research.card`, and its quotes file. Every other `docs/research/howto/**` path goes to class 4 (all ids), ahead of class 5's `docs/**`.
   - **Why:**
     - (a) Without scratch research cards the generator's node-half gate refuses the scratch rows, so C11-C14 have no subject. 11.1 item 3 named only LIB-2b's E1 and LIB-4b's B5.
     - (b) MANIFEST.json is missing on main and on every open head. Plan 3.5 pins "every source (specs, templates, composers, hands, renderer, howto specs)", and plan 3.6's L0-lib adds the page builders. A spec-and-How-to set would leave out the files that build a row's pinned pages, and an import-only set would leave out the files the builders read at runtime; C0's builder mutation edits build-page.mjs itself, so it could not catch that gap. Scoping to pinned rows keeps #181, #193, #191, #109 and LIB-9a green as they land.
     - (c) `coreFiles()` (`tools/plates/lib/inputs.mjs:15`) puts `generate.mjs` into every generated file's `inputsSha256` (:31). Any edit rewrites every generated header (the last core edit, `384f576d`, touched 59 files), collides with LIB-2b, LIB-5 and the passed heads #181, #193, #191 and #109, and voids their evidence. The file's own header says: "The core is frozen after HT-2 (plan 2.2): a change to it is its own PR."
     - (d) `candidateOf` reads the card file named by `research.card` (candidate.mjs:44-48), and C15 reads `reviews.json`. Under the old rule `docs/**` selects 0 ids, so those inputs would be missed.
   - **Why nothing is loosened:** (a) keeps every limit of the rulings it extends. (b) pins every file that builds an approved row's pages, imported or read, to its approving entry, which is plan 3.5/3.6's L0-lib, and its mutations bite. (c) changes no file the generator hashes; class 3 is either proven or falls back to all ids. (d) only moves paths to stricter classes.

6. **Scratch targets (D-LIB-SCRATCHIDS).**
   - **Decision:**
     - From now on, scratch fixtures never target an LB1 or LB2 id. LIB-4c chooses its targets outside LB1 and LB2.
     - LIB-4b's B5 keeps `lib_underhand_lat_pulldown` and `lib_chest_supported_row` (fixture.mjs:27-28), so its critical-path evidence is not churned.
     - The push that first moves LB1 rows into batches/ (LIB-9, after D-LIB4-ENTRY) swaps those two targets for non-LB1 ids with the same sources, keys and COPY_EDITS, re-runs the fixture test and lists the changed lines in its PR.
   - **Why:** two B5 targets are LB1 ids (plan 6.2). Once LB1's real rows are in batches/, the fixture's `put()` overwrites the real spec, How-to and card in its scratch copy, and the registry throws on the duplicate id. Until then the clash cannot happen, because LIB-9a keeps its rows out of batches/ (item 4).
   - **Why nothing is loosened:** the same sources and checks run; only target names change, at the point the clash would start. The duplicate-id throw makes any earlier clash loud.

7. **Engine per plate (D-LIB9-ENGINE; settles 11.1 item 10 (a)).**
   - **Decision:**
     - A plate's QA, crops and layers page use the engine that drew it. The engine is chosen per row from the engine its spec imports (or as recorded in its plate entry), never by "library or the 8".
     - A spec that imports `tools/plates/library/engine.mjs` (which re-exports `tools/plates/vendor/engine/*`, golden A's engine) is drawn, checked and cropped by the vendor engine everywhere: plates page, QA, the app `ht-` chunk and its layers-page crops. New LB1 specs import it and may use `poly` and flat palm.
     - A spec that imports golden B's layers engine (`tools/plates/layers/engine/**`, MANIFEST-locked) stays on it: the 8, LIB-2b's fixture, LIB-4b's B5 clones and LIB-4c's scratch clones.
     - LIB-6's `crop.mjs` and `zbox*.mjs` take the engine as a parameter whose default is the layers engine.
     - LIB-6-PM implements this before LIB-6's delta review. Evidence:
       - the existing 8-closeup tests are unedited and green;
       - LIB-2b's committed fixture page `cable-lateral-raise.layers.html` and the B5 scratch pages stay byte-identical;
       - a library fixture crop with a `poly` part and a flat palm renders through the vendor engine;
       - mutations: that crop through the layers engine → red; a layers-engine spec cropped through the vendor engine → red.
     - Posted on #181, #232 and #234 before LIB-6-PM starts.
   - **Why:**
     - Checked on main: the vendor `PRIMITIVES` (equipment.mjs:316) include `poly` and the layers `PRIMITIVES` (:304) do not; the layers `renderPlate` throws "unknown equipment type" (layers plate.mjs:45); only the vendor body.mjs has flat palm. LIB-6's crop.mjs:13-14 imports the layers engine. Pilot A uses `poly` (eq/rope.mjs:60-64, safetyArms.mjs:24, barbell_overhead_press.mjs:189).
     - HT4-A5 cuts crops from the approved plate, so they must come from the engine that drew it. Every fixture so far clones a layers spec (lib2b/fixture.mjs:2-4, :29; LIB-4b's fixture.mjs:78), so choosing by row kind would break HT4-A5 for those rows and could change pages already pinned. Whether the two engines render those clones byte-identically is not verified, so no fixture changes engine.
   - **Why nothing is loosened:** golden B's locked engine and the 8's bytes are unchanged, because the default parameter keeps them on the layers engine. Every crop gains a check that it comes from its own plate's engine. No exemption is added, and no pinned page changes.

8. **Authoring-time QA (D-LIB9-AUTHORQA).**
   - **Decision:**
     - `candidateOf(id, { all, authoring: true })` in `tools/plates/library/candidate.mjs`:
       - returns the same candidate with `exemptions: []` and reads no pin;
       - resolves the How-to source from the injected `all`, through an optional `all` parameter on registry `sourceOf` whose default is `rows(root)`;
       - throws when the row's stage is approved-plate or shipped.
     - Every default call behaves exactly as before, and the default-path tests are unedited.
     - Owner: LIB-9a, after LIB-2b is on main. The generator, LIB-4b's PQH rows and LIB-4c never pass the option.
     - Posted before LIB-9a's Do 4.
   - **Why:** candidate.mjs:85 calls `pinOf(row, 'plate')`, which throws "no batch golden file" for an unpinned row (batch-golden.mjs:28), and `sourceOf` (registry.mjs:64-67) sees only batches/. So plan 3.2's authoring-time QA cannot run through the one candidate builder (11.1 item 2) for rows still in review.
   - **Why nothing is loosened:** zero exemptions is stricter than any pinned path, because every raised flag blocks `ok` (qa/index.mjs:56-61). The option is refused at approved-plate and shipped, so it can never stand in for the generator's gate. The default path and its tests are unedited.

9. **Research machine fields (D-LIB9-CARDFIELDS).**
   - **Decision:**
     - The three fields LIB-3 reads go at the top level of `docs/research/howto/cards/<id>.json`, in exactly the shape that candidate.mjs `researchOf` (:44-48), qa/node.mjs H6 (:153-176) and F7 (:293) read:
       - `plateFacts: [{kind: 'angle'|'contact'|'height', joint|landmark, pose?, deg|m, measure?, claim}]`;
       - `tempo`: the spec's phase array `[{phase, s, move?}]`, compared by `JSON.stringify`;
       - `topFault`: the card's mistake key.
     - Every value names the claim whose verbatim quote states it. Nothing else in a card changes.
     - Tempo: every numeric `s` maps to a verified research value (the card's verified `plate.tempo` up, down and pause seconds) or to a named constant ruled in LIB-9a's design note (for example Rest). The phase-name mapping is proposed in that note and ruled there. LIB-9a's A11 checks this; mutation: Rest changed → red.
     - Verification: a fresh Opus content verifier, with one planted wrong number, checks the 14 LB1 cards' fields right after LIB-9a's Do 6, before Do 7's QA and the critic. Every later batch does the same, after the fields are written and before QA. The 8's cards (item 13) get the same check before their exemptions are removed.
     - LIB-5 documents the fields in CARD-V2.md and writes them for the 8 (item 13). The supervisor merges the field commits back into `claude/libht-research`.
     - Posted before LIB-9a's Do 6, and in LIB-5's card.
   - **Why:** on `9dbc7e0` none of the 109 research cards has `plateFacts`, and `plate.tempo` is `{up, down, pause, claim}` (for example `chin_up`), so it cannot deep-equal a spec's phase array. Without these fields every LB1 row fails PQ-H6 (H6:no-card) and F7 ("no card top fault"). LIB-5 and LIB-9a must write one shape. The builder who writes the fields also draws the plates H6 checks against them, so the independent check has to come before QA, the critic and approvals; a later correction would redraw approved plates.
   - **Why nothing is loosened:** H6's ±2° and ±1 cm and its exact tempo equality are unchanged. The values come from verified research claims and are re-verified with a planted-error check before any QA uses them. None is taken from the spec under test.

10. **Library hand blocks (D-LIB9-HANDPAGE; settles 11.1 item 10 (b); post before the LIB-7 fixer starts).**
    - **Decision:**
      - LIB-7 implements main's loader contract exactly (`tools/plates/gen/handpairs.mjs:3-4`):
        - `HAND_OF_ID`: {lib id: key};
        - `inputsFor(key)`;
        - `pairPanel(key)`, returning an exercise-neutral `<div class="zx"` panel whose ids are keyed by pair key, with no chromeId and no exercise name.
      - A key is one drawn pair (variant × orientation × fault set), as LIB-7's design defines it. `renderPair(id)` may stay for the critic tooling.
      - The LIB-7 fixer, on LIB-6's branch, makes the layers page draw a library card's hand block from `pairPanel(HAND_OF_ID[id])`. It also carries 11.1 item 14's shared-key proof (page hand block === handpair panel; two ids on one key, each in a fresh context) and the per-key handpair budget (items 6 and 9).
      - It proposes keys for the 6 LB1 hand zooms that have none, for a supervisor ruling.
    - **Why:** on main, `handpairs.mjs` reads `pairs.HAND_OF_ID[id]` for every shipped id, the 8 included (:29-30), plus `inputsFor(key)` and `pairPanel(key)` (:45-51). LIB-7 @ `55e91e9` exports `INDEX`, `renderPair(id)` and `inputsFor(id)` (pairs.mjs:64, :229, :278), and no `HAND_OF_ID` or `pairPanel`. `generate --check` on main + `55e91e9` throws a TypeError at handpairs.mjs:30. So LIB-7, and LIB-12 that contains it, would turn a train red, and LB1 needs LIB-7.
    - **Why nothing is loosened:** the merged consumer's contract and the 8's `hand-` chunks are unchanged. Panel equality, the shared-key proof and the per-key budget are added checks. The 12 LIB-7 approvals carry over only if their pins stay byte-identical.

11. **Plan wording before LIB-4c READY (D-LIB4-DOCS-2; extends D-LIB4-DOCS).**
    - **Decision:**
      - Before LIB-4c is READY, the supervisor amends, on `claude/howto-options` (docs only, about 20 min), plan 5.4 :571-577 and :584-601, plan 3.6, and section 7 row 3: `howto-verdict` → the `gate-verdict` family; "ready-for-review heads" → the ref-and-event mode (D-LIB4-MODE); `android-gate`'s needs (D-LIB4-VERDICT); and the K wording (D-LIB4-SHARD). It posts the amended plan sha on LIB-4c's PR for its reviewer.
      - The LIB-4c card keeps its plan refs at `4a9fd86`. Its own clause already says lib4-cards section 1 and its rulings win where the plan differs.
      - SPEED.md :25 and :62 and GATE-SPLIT design 3.5 go in the first supervisor docs PR after the GATE-SPLIT train (main is frozen and is never pushed to directly).
      - Until then each card states that lib4-cards section 1 wins wherever a doc differs.
    - **Why:** D-LIB4-DOCS says "Supervisor, before the cards are `ready`". Plan 5.4 still says "ready-for-review heads", "`android-gate` keeps its current `needs`" and "`howto-verdict`" (:591-595 on `4a9fd86`, checked). Doing it before the start would delay the critical-path start and add load tonight, while the card's clause already covers the gap.
    - **Why nothing is loosened:** docs only. It makes the plan match rulings already in force, before the review that relies on it.

12. **Back box: the owner's question and LIB-5's merge routes (D-LIB5-BOX).**
    - **Decision:**
      - The supervisor asks the owner tonight: it is a choice only he can make. First, one fresh Opus critic reads option 2 against the NHS page (`nhs-back`) and main's checks. Any fix it makes is re-checked with main's copy-lint and C7 rules before the message goes.
      - The message gives both options in full. Both keep the name "Back pain" and the doctor line "No better in a few weeks? See a doctor."
        - Option 1, 50 words (R-W0-1), all six NHS emergency triggers: "Pain, numbness, tingling or weakness in both legs? Numb genitals or anus? Bladder, bowel or sexual changes? Chest pain? Serious accident? Get emergency help now. Sudden severe or fast-worsening pain? Hot, cold, shivery or unwell? See a doctor today." It is over his 30-word limit, so it needs its own card, written under his recorded answer, that adds a named limit for this box only (red at 51). LIB-5 never makes that change.
        - Option 2, 30 words, his limit kept: "Both legs painful, weak or numb? Numb genitals? Bladder or bowel changes? Get emergency help now. Fever? Doctor today." It passes main's checks unchanged.
        - The message says plainly what option 2 drops: three of the six emergency triggers (sexual changes, chest pain, after a serious accident), "anus", and the same-day trigger "severe pain that starts suddenly, or it's getting worse quickly". It also merges tingling into "numb" and narrows "hot, cold, shivery or generally unwell" to "Fever?".
      - The answer is recorded in three places before LIB-5's Do 9: a supervisor comment on LIB-5's PR; a `claude/libht-research` head whose `shared/back-pain-box.json` holds the answered text with a status other than 'draft'; and R-W0-1, updated in place in verify/w0.md.
      - Until Do 9, LIB-5's Do 4 placeholder holds, checked by S4-P. S4-P's "no string from the box fields under src/**" means each whole field value (`box.name.text`, `box.now.text` and `box.doctor.text` of the copied `shared/back-pain-box.json`), matched exactly. The test also asserts that each value is absent from src/** at main, so it is known to bite.
      - LIB-5 merges by one of two routes:
        - (a) The answer is recorded in time and passes every existing check unedited: Do 9 is built in LIB-5's PR, and S4 and S5 are green.
        - (b) By LIB-5's merge slot no answer is recorded, or the answer needs the cap card and that card has not merged: LIB-5 merges with the placeholder (S4-P green), so LIB-6, LIB-7 and LIB-8 are not held up. Do 9 then lands in its own PR from `claude/lib-5-back-box`, based on main, with its own fresh Opus review.
      - LIB-9a's merge_prerequisites gain: "LIB-5's back box (Do 9) on main before LIB-9 merges (LR-28)."
      - W2B's back-box `appliesTo` edit waits for the answer (item 14).
    - **Why:**
      - Checked: main's copy-lint `words()` gives 50 for option 1 and 30 for option 2, against `RED_FLAG_BOX_MAX_WORDS` 30. Option 2 has 'today' and 'doctor', its longest sentence is 6 words, and it has no BANNED, contact, source or safety-line hit. S4-P at `49a2853`: all three field values are absent from src/**. The only near matches are lowercase "back pain" (ht-hanging-leg-raise.ts:429) and "No better after a few weeks? See a doctor." (archetypes.ts:35, :48), which an exact whole-value match does not hit.
      - Asking now keeps the answer off the critical path. LIB-5 builds the rest meanwhile, and route (b) keeps LIB-6..8 moving if he answers late or picks 50.
      - LR-28: sheets that link `redFlag: back` cannot ship before the back-pain box. On `9dbc7e0`, 7 of the 14 LB1 cards link it (hanging_knee_raise, inverted_row, straight_arm_pulldown, chest_supported_row, resistance_band_row, shoulder_press, horizontal_leg_press). Under route (b), "LIB-2..LIB-8 merged" alone would let LIB-9 merge while the box is still missing.
      - No critic had read option 2, and it drops emergency triggers, so he must see that before he chooses.
    - **Why nothing is loosened:** no limit changes before he answers, and a 50-word cap would be its own card under his recorded answer. The placeholder throws, so no back-flagged row can generate, and S4-P is proven to bite on main. LIB-9 gains a prerequisite, and none is dropped.

13. **The 8's machine cards (D-LIB5-CARDS8).**
    - **Decision:**
      - LIB-5 adds the 8's machine research cards: `plateFacts`, `tempo` and `topFault` in the D-LIB9-CARDFIELDS shape, for the 8 ids in `qa/exemptions.json`. They join LIB-5's write_scope and acceptance.
      - Inputs: verified research for the 8, which does not exist yet. The supervisor first runs a research task for the 8 on `claude/libht-research` (started 20:37 UTC: writer session_01CMHvXUtmBKbNtQxcFGVPm9 on `claude/libht-research-the8` from `9dbc7e0`, blind to the 8's specs and plates; then the LR-29 verification) (claude-opus-5-5; the CARD-V2 shape with verbatim quotes; verified like every card). LIB-5 copies those cards byte for byte from the head the supervisor names and adds only the three keys. Every value names the claim whose verbatim quote states it, and none is taken from the 8's specs or plates.
      - Card path: `docs/research/howto/cards/<card id>.json` and `quotes/<card id>.json`, the D-LIB9-CARDFIELDS path, unless the design note (Do 1 d) gives a reason against it. The supervisor merges the field commits back into research.
      - Extra write scope, nothing else:
        - the 8's card and quote files at that path: byte copies plus the three keys (a carve-out from LIB-5's reserved `docs/research/howto/cards/**`, for these 8 only).
        - `tools/plates/library/qa/approved.mjs`: each of the 8's candidates gets its card's three keys as `research` and its plate's mistake key as `mistakeFault`, as candidate.mjs:84 does for library rows. Today :20 sets `research: null` and `mistakeFault: null`.
        - `tools/plates/library/qa/exemptions.json`: delete the 8's `H6:no-card` (7 ids) and `F7` (8 ids) entries, for the ids the verifier passed, in one commit after 'CARD FIELDS VERIFIED @ <sha>', together with the `approved.mjs` wiring and the clone-test line (LIB-5 Do 3 b, commit 2). Commit 1 (cards, quotes, pins, validator) leaves `approved.mjs`, `exemptions.json` and `library-qa.test.ts` untouched. Reason: the wiring with the exemptions still present leaves them unused, so `library-qa.test.ts:53` and `qa/selftest.mjs:36` turn red; removing them without the wiring turns H6 and F7 red. `lib_dumbbell_lateral_raise` keeps `H6:not-engine` (it has no spec), and every other entry stays.
        - `tests/howto/library-qa.test.ts`: the clone test (:64-72) spreads the pull-up's candidate into `lib_chin_up`, so it would inherit the card. Its two clone inputs (:65 and :70 on main) set `research: null, mistakeFault: null` (a new plate has no card), and every assertion stays. This is expected from the code, not run; the mutation 'nulls removed → red' proves it in LIB-5.
        - COACHING-DECISIONS.md: append D-LIB5-CARDS8 (exemptions.json changes only with a decision).
      - Proof, with these existing tests unedited: "every node problem of the 8 is one of its named exemptions" (:50) shows H6 passes with no exemption; "none unused" (:53) is red for any exemption left after its card lands; "each of the 8 is ok" (:60) shows F7 no longer blocks. Mutations, each red: one card's `plateFacts` deleted (H6:no-card); its `topFault` deleted (F7 blocks); one fact +3° (H6); one tempo second changed (H6.tempo).
      - Before any exemption goes, a fresh blind Opus content verifier with one planted wrong number checks the 8 cards' fields (item 9's rule).
      - If one of the 8's approved plates fails H6 or F7 against its verified card: stop and report. Never change the plate (locked), a fact, a tolerance or a test. That id keeps its exemption, and its reason changes only by a supervisor ruling with a COACHING-DECISIONS entry.
      - If the 8's verified research is not on a named head by LIB-5's merge slot, this part lands after LIB-5 in its own PR from `claude/lib-5-cards-8`, with its own fresh Opus review. The exemptions keep the 8's QA green until then, so no other card waits for it.
    - **Why:**
      - LIB-5 is the shared-research card: plan 7 row 4 (:761) gives it "the 19 shared cards, C15 stamps for the 8", and `qa/exemptions.json` on main gives the 8's H6:no-card and F7 exemptions the reason "LIB-5 adds their cards". The card now does what the exemption text says.
      - Checked: `9dbc7e0` has no card for any of the 8 (its 109 cards exclude them), and the verified cards the 8's How-to sources cite (for example `grip/research/pull_up.json`, layers/exercises/pull_up.howto.mjs:2) are not on main or on `9dbc7e0`. So the quotes need research first.
      - `qa/approved.mjs` builds the 8's candidates with no research, so cards alone would change nothing. The wiring line is what lets H6 and F7 run on the 8.
    - **Why nothing is loosened:** only exemptions are removed. H6's ±2°, ±1 cm and exact tempo and F7's equality are unchanged. The values come from verified quotes and are re-verified with a planted error before any exemption goes. The 8's bytes are unchanged (S10).

14. **Research wave 2's W2B (D-LIB-W2B).**
    - **Decision:**
      - W2B runs on claude-opus-5-5. It may run on claude-sonnet-5 only if the supervisor's prompt gives the exact replacement text, the exact claim list and the exact card list, and tells it to stop on any mismatch.
      - The 10 % re-fetch comparison (claims chosen by the head hash) stays with the supervisor. W2B never runs it on its own work.
      - W2B's back-box `appliesTo` edit waits until the owner answers decision 6 (item 12). It then lands in the same research head as the answered box text.
    - **Why:**
      - The draft kept W2B on claude-sonnet-5 while it derived claim lists from rules and rewrote user-facing copy: the underhand_lat_pulldown `feel.rows[0]` line, and the back box's `appliesTo`, which lists 3 cards while 35 cards on `9dbc7e0` link `redFlag: back`. That is judgement work, and AGENTS.md gives Sonnet only steps that are spelled out.
      - Plan 4.3 (:448): "the supervisor re-fetches 10 % of claims (chosen by the head hash)". A check run by the agent whose work it checks is not independent.
      - LIB-5's S1 pins `shared/back-pain-box.json`, and Do 9 re-copies it. One edit together with the answer means one re-copy and one re-pin.
    - **Why nothing is loosened:** W2B gets a stronger model, or exact inputs with a stop. The re-fetch keeps its 10 % and its independence, and S1 still pins every byte.
15. **LIB-4c check-in fail-safe (D-LIB4c-2, 19:15 UTC, sent to session_0192ePqaQfU5Vzq7Ft95uXcQ).** Accepted as stricter. A class-2 file (ids.ts etc.) changed with no row differing selects ALL ids, and a batch or golden file whose diff names no row selects that batch's ids. Evidence: a test that a class-2-only change selects every id. Mutation: return [] for it → red.
16. **Class 3 and shared outputs (D-LIB4c-3, 19:22 UTC).** Option (A): Do 3 stays literal. A path that any shared output lists (ids.ts, ids-node.mjs, sources.json, or any other output not owned by one id) selects ALL ids. C4's composer case asserts `{cls: 3, ids: 'all'}` and names the shared output that listed it.
    - Prove the single-id branch with a tools/plates/** path that only per-id outputs list, for example the batch's pages.layersConfig if it qualifies. If no such path exists, C4 states the branch is unreachable today and a test pins that.
    - Why: (A) needs no untested claim. Option (B) would rest on shared files changing only in one id's entries, and sources.json dedupes across exercises. The cost falls only on affected-mode pushes; main, train heads and dispatches run full.
17. **planK with a heavy fixed part (D-LIB4c-4, 21:1x UTC, sent to session_0192ePqaQfU5Vzq7Ft95uXcQ).** Accepted as a planning rule. When one shard's fixed part (the once-states) is over 900 s on its own, that shard holds no id (with a note), and every shard that holds ids still fits 900. K is the smallest K that does this.
    - Conditions: JOB_BUDGET_S = 1800 stays red on every shard, the fixed-only one included, and over 900 still prints "re-pick K/N" (D-GATESPLIT-BUDGET); the note names the shard, its fixed part and its seconds, in the PASS line and the proof; C2 tests both branches (fixed > 900 and fixed ≤ 900, the second unchanged from before), with mutations (the fixed shard takes an id → red; the 1800 check dropped on the fixed-only shard → red). C14 on CI decides times.json and records which branch CI took.
    - Why: local once-states were 1,267.7 s (P 1, this container), so under the literal rule no K fits, and one id per shard would put about 2,265 s on shard 1, over the 1,800 limit. The rule changes where ids go, never a limit.
    - Why nothing is loosened: every budget and check is unchanged; only id placement changes, and both branches are tested.
18. **HT-3's 5 identical reruns from E8 (D-LIB4-ENTRY-HT3, 21:3x UTC).** E8's 10 runs on `82d896d` count as HT-3's 5 identical reruns for D-LIB4-ENTRY. "Identical HT-3 lines" means identical once the timing numbers are removed: HT-3's phase ms and trailing total seconds, HT-3b A3's median, samples and page-clock cross-check, and HT-3b's total seconds. Every other character must match.
    - Evidence: GATE-SPLIT READY (6241237372) and the reviewer's own check (6241344488, row c): one md5 across all 20 run × time-zone copies after the removal; A3 medians 128-184 ms against the 400 ms limit (`screenshot-gate.mjs:6983`), so every timing passed its own check in every run.
    - Why: HT-3's rerun rule tests that its pixel, walk, markup and layer results are deterministic. Timings are measurements that vary from run to run by nature, and each run already checks them against their own limits.
    - Why nothing is loosened: every result HT-3 checks must still match character for character, and every timing must still pass its limit in every run. This is a count of reruns, not a change to any check.

## 13. LIB-9a design-note and slice rulings (D-LIB9a-NOTE, 2026-10-17 ~22:15 UTC; #245 @ `1a31cd46`)

Read by a 3-lens review (card and rulings; code and tests in a worktree; the 2 plates rendered in Chromium beside 4 approved plates), a judge, and one adversarial check per ruling. Where that check corrected a ruling, the corrected text below is the ruling.

Active LIB builders with this resume (D-LIB-LANE-ACTIVE): LIB-4a, LIB-4b, LIB-4c, LIB-9a = 4. LIB-5 is in Do 1 (no slot).

### Scope of this resume
- Merge origin/main (`b70ca58`: GATE-SPLIT and LIB-2b are on main) with a merge commit.
- Make the fixes below: both highs first, then the mediums and lows.
- Run Do 4 (the D path, Q5) and Do 6 for all 14 cards, copying from research head `9dbc7e0`. Re-copy once when research wave 2 and the 8's cards merge into `claude/libht-research`; I will name that head.
- Run Do 7 on both slice plates: the two-build plates-page sha256 and the QA table, with A9 and every mutation shown red and then restored.
- Post the full slice on this PR, then you are WAITING. **Do 5 (the bulk) is not yet open.** It opens on my look at that slice, with 'LIB-9a resume' again. Do 5(d) also still waits for the pilot A #109 review.
- The 2-hour push limit until READY stays.

### Rulings on DESIGN.md section 9

#### Q1
ACCEPT the rule change. The expected F7 on single_arm_lat_pulldown follows research, not this ruling.
(a) Turn round the topFault rule in DESIGN.md section 4. The ruled note maps each card's faults to keys. Do 6 writes topFault from the card through that map, never from the spec. The rule has two cases:
- drawable:true: topFault is the key of plate.mistake (for single_arm at 9dbc7e0, 'past', c10/c13).
- drawable:false: topFault is the key of the top fault that the card itself names, in mistake.why or handlingMistakes, sourced. That key differs from the drawn Mistake's key, so F7 is raised and needs the owner's yes (plan 3.3, LIB-3 mutations.mjs:107).
The spec's first Mistake tell carries plate.mistake's key and draws that fault.
The content verifier gets both cases. It is red if a drawable:true topFault names anything other than plate.mistake, or if a drawable:false topFault equals the drawn fault. The same rule goes into D-LIB9-CARDFIELDS for later batches and for LIB-5's 8.
Mutations: (1) one spec's first tell key changed turns F7 red; (2) on a test copy of one card set to drawable:false with topFault equal to the drawn key, the verifier fixture turns red.
(b) Before the content verifier runs (A13), the research owner rules on single_arm_lat_pulldown under CARD-V2:36 and content.md:109. The card lists the twist (c6) first in handlingMistakes. Its viewWhy says the engine cannot draw the twist. The census names a sideways lean (c11). Every mistake why says 'Frequency is not measured'.
- drawable:true stays only with a recorded reason that the past-end pull is the top fault, and handlingMistakes is reordered to match.
- Otherwise drawable becomes false, and research names the top fault: the twist or the lean.
Until this ruling is in, single_arm's expected F7 is undecided, and no Do 7 evidence for it counts. If research answers after the verifier has run, the Do 6 re-copy rule re-runs the verifier for that card. A drawable:false answer puts F7 into the expected set with a drawable-fault note, and the plate stays unchanged. LIB-9a never edits the card beyond its three keys.
(c) Only after (b): the supervisor amends the LIB-9a card's Do 1 expected-flag line. If drawable:true is kept, the supervisor also amends plan 3.1:85 (removing single-arm pulldown from the drawable-fault list) and plan 3.3:303's count of 6.

Why: D-LIB9-CARDFIELDS (item 9) says 'None is taken from the spec under test'. Under the note's rule, topFault is read from the spec (candidate.mjs:84 takes plate.mistake.firstKey from the built page), so F7 passes by construction. F7 is meant to compare the drawn fault with the card's top fault (plan 3.3, mutations.mjs:107-109). On a drawable-fault card those two differ, so an unconditional 'topFault = plate.mistake' would silence F7. On 9dbc7e0 the drawable:true on single_arm conflicts with the card's own viewWhy and handlingMistakes order, and with plan 3.1:85. That is a research question, and its answer must not be guessed (twist or lean).

Why nothing is loosened: F7 runs on every row with zero exemptions on the authoring path, and its expected value now comes from the card, which is stricter than the note. A drawable-fault card keeps F7 and the owner's yes. The expected set and the plan change only after research has ruled on a verified card fact, and before any QA evidence for that id counts.

#### Q2
ACCEPT: start = the top (chin over the bar), end = the dead hang. Conditions:
(a) Do 6 writes the card's tempo from c9 (up 2, down 3, pause 1 at the top) through the ruled Q3 map, never copied from the spec: [{phase:'Lower',s:3,move:true},{phase:'Pull',s:2,move:true},{phase:'Hold',s:1}]. H6 then checks the spec against it.
(b) The pose map is fixed by this ruling and recorded in DESIGN.md and lb1/tempo.json. Card plate.start (the hang) = spec 'end'; card plate.end (chin over bar) = spec 'start'; the Mistake = 'mistake'. Do 6 writes every plateFacts pose through this map. A fact with no pose defaults to the spec's 'end' (node.mjs h6), so every fact about the top must say pose 'start'. The content verifier is given the map.
(c) Per DRAWING-GUIDE section 4 ("Hidden start parts"), the top pose's pad, bracket and lever are redrawn as a dashed phantom: type `line`, cls 'eq-line m-line', added only when ctx.pose === 'end' (never in the 'mistake' pose), as machine_chest_press:143 does for its lever. leg_press:119-121 is the same engine workaround. The part must stay a `line` (an H9lineTypes type), so H9 passes on its own terms. A test proves the phantom is in the end pose and absent from the Mistake pose (fix 4).
(d) The contact proof is fixed first (fix 2).
(e) The alt text and the spec's header comment (line 14 still says "Start: dead hang") follow the drawn order.
(f) DESIGN.md section 6 replaces "masked by the solid end figure / mostly hidden" with the true reason. The engine builds the Mistake as end pose + override (plate.mjs:78) and outlines what differs from the end pose (:208), drawn over the end figure (:265). So a bottom-of-rep fault reads correctly only against a hang end, as in leg_press. The section also records that this plate differs on purpose from pull_up, which draws the top solid, because this card's fault is at the bottom.
(g) The critic judges the plate blind, under the plan 3.4 limit of one fix round and one recheck. If it names the order, or scores R5 below 4, the fallback is the card's order with:
- the Mistake still drawn as a pose (never guides only), and every hard check, H3's Mistake outline and deviation included, still passing;
- the (c) phantom moved to the hang;
- the pose map set to identity and the tempo reordered through the Q3 map (Pull 2, Hold 1, Lower 3).
Because that changes this card's tempo and pose fields after verification, tempo.json and the card are updated, the content verifier re-runs for this card, and QA re-runs before the recheck. If two rounds fail, the plate goes to the supervisor.
Why:
- plate.mjs:110-112 and :143: the start layer compares the start equipment with itself, so it never draws moving equipment in either order, which (c) fixes.
- plate.mjs:78 and :208: the Mistake is relative to the end pose.
- Precedents for starting with the lowering: the 8's leg_press (top start, Lower first, butt-wink fault at the bottom, drawn against the end pose), plus pilot A's dumbbell_bench_press, incline_dumbbell_press, romanian_deadlift and single_leg_romanian_deadlift. Pilot A's overhead presses start with Press.
- Reviewer 3's card-order render shows the half hang reading as pull_up's "Chin short" fault.
- The solid hang carries the card's "Knees on pad" and straight-arms checkpoint (c1, c3).
Why nothing is loosened:
- Both card positions, all 3 checkpoints, the card's Mistake and its exact tempo are drawn.
- Every hard check, H6's equality and the verifier gate are unchanged, and the fallback is bound to them too.
- The conditions only add drawing, bookkeeping and a re-verify.

#### Q3
ACCEPT the map, with corrected reasons and a stricter A11.

The map:
- Scope: lb1/tempo.json only. The 8's tempo stays LIB-5's under lib4-cards 12 item 13.
- The concentric phase takes plate.tempo.up and the eccentric phase takes plate.tempo.down.
- Hold takes plate.tempo.pause and comes right after the concentric phase. Hold is there if and only if pause > 0.
- No Rest phase. The set of named constants for LB1 is empty.
- Shape: {phase, s, move: true} for a moving phase and {phase, s} for Hold, in that key order, because H6 compares with JSON.stringify (qa/node.mjs:174).
- Phase names and order: as in the note's section 4 table.
- Order follows the card's plate.start, and the 13 other rows match it. assisted_pull_up's "Lower 3, Pull 2, Hold 1" stands only if Q2 is accepted. If Q2 is rejected, it is "Pull 2, Hold 1, Lower 3".

tempo.json:
- It records, per id, the phase rows, each row's source field (up, down or pause), and plate.tempo.claim.
- Each card's tempo array is built only from tempo.json and that card's plate.tempo, never from a spec.

The test (lb1-plates.test):
- It holds its own copy of the ruled table (14 rows: names, order, source field) and the ruled constant set (empty), both copied from this ruling. It asserts tempo.json equals them. It never takes expected values from tempo.json or from a spec.
- It asserts each card's tempo equals the array built from the table and plate.tempo.
- It asserts Hold is present if and only if pause > 0.
- It asserts each id's claim equals plate.tempo.claim.

A11's "Rest changed" is replaced by the mutations below. Record this as an amendment of lib4-cards 12 item 9's mutation line, for LB1. Each turns red and is then restored:
- (i) A Rest phase added to one card and its spec.
- (ii) A constant added to tempo.json, with or without a ruling citation.
- (iii) A Hold s that differs from the card's pause, set in both card and spec.
- (iv) A Hold of 0 s added to close_grip_pulldown (pause 0) in card, spec and tempo.json.
- (v) The Hold removed from chin_up (pause 1) in card, spec and tempo.json.
- (vi) up and down swapped in tempo.json for assisted_pull_up (2/3), with card and spec rebuilt to match.

Why:
- No LB1 card sources a rest. plate.tempo holds only up, down and pause. ACSM's "3- to 5-min rest periods" is a rest between sets, not a rest phase in the rep.
- A ruled constant would add a number that no verified card holds. D-LIB9-CARDFIELDS allows such a constant; it does not require one.
- Precedent: pilot A's mountain_climbers (approved, e6f39ff) has a Rest only because research sources it (R-W1-2, c13).
- Every s is a value from the verified card's plate.tempo. Several of those values are drawing conventions that the claims name as such (chin_up c8, hanging_knee_raise c9, inverted_row c6, assisted_pull_up c9). They stay allowed under item 9 and are re-checked by the planted-error verifier.
- Mutations (iv) to (vi) close the branches that a "maps to a verified value" check leaves open. The engine would draw (iv) as a "Hold 0 s" segment (vendor sheet.mjs:83-86).

Nothing is loosened:
- H6's exact equality is unchanged.
- No s comes from a spec.
- The expected map lives in the test, not in the builder's file.
- Every branch of the map has a red mutation.

#### Q4
ACCEPT the equivalent as A2's second mutation: the real assistMachine knee pad, drawn as a moving rackUpright, must turn H9.moving-line red, as LIB-3's M6 does. Conditions:
(a) Keep 'moving box pad: H9 green' as a record of how the engine behaves, and make it assert its own premise:
  - the swap replaced exactly one item, the z 'center' poly with part 'pad', in exactly one equipment entry i, in both the end and Mistake poses;
  - the rendered eq<i>.box.0 exists in both poses and carries poly;
  - its end and Mistake paths differ.
  Then it cannot pass if the pad stops moving or the swap stops applying.
(b) The mutation asserts exact equality: h9(mutated) toEqual(['H9.moving-line:eq<i>.rackUpright.1']), with i that same single swapped entry (17 on 1a31cd4). It also asserts that the clean run gives [].
(c) The note and the test comment say exactly what goes red: 'a moving item with no poly whose type is not in H9lineTypes (rackUpright's hole marks, j=1, the key family of LIB-3's M6)'.
(d) This does not count as A4's M6. A4 still runs LIB-3's M6 on its LB1 plate through runQa, on the node and browser halves.
(e) The supervisor records the amended A2 wording on claude/sup-lib4-cards.

Why: the box premise is false. Vendor box() returns bar() {d, poly} (equipment.mjs:301; geom.mjs:57-63), so plate.mjs:210-213 draws it in the Mistake and movingLines skips it. kneePad (circle and bar) also carries poly. The card's wording cannot turn red without editing LIB-3's H9 or the vendor engine, and both are reserved. A run on 1a31cd4 gives exactly ['H9.moving-line:eq17.rackUpright.1'], and the same rackUpright held still gives [].

Why nothing is loosened: H9 and the pinned H9lineTypes are unchanged. The substitute targets the same real moving part and the same key family as M6. The exact key, the single-swap premise and keeping A4's M6 separate make it stricter than M6's prefix check, and it cannot pass vacuously.

#### Q5
ACCEPT, with the subject and the H10 scope corrected. All 14 rows stay mode H. A7 and A4's raw-spec mutation are proven in Do 4 on an in-memory D copy of lib_close_grip_pulldown, with its plan parent lib_lat_pulldown (content.md:459). Do 4 starts on 'LIB-9a resume', after origin/main (b70ca58, LIB-2b) is merged in with a merge commit. D-LIB9-AUTHORQA is posted (fc825957 item 8).

Conditions:

(a) Real path only. The test runs candidateOf('lib_close_grip_pulldown', { all, authoring: true }) and then runQa, reading PQ-H10, or calls h10 on that candidate. It never hand-builds a candidate or a derivation. Mutations are applied to candidateOf's output or its injected inputs, the same way LIB-3's mutations.mjs applies them.

(b) Memory only.
- `all` comes from rows(root, { batches: [...batchFiles(root).map(p => [p, read(p)]), ['tools/plates/library/lb1/rows.json', copy]] }).
- In `copy`, the existing lib_close_grip_pulldown row is replaced, not added, with mode 'D', parent 'lib_lat_pulldown' and params { 'camera.maxScale': <a number> }. That is the only PARAMS key the engine reads.
- So registry.mjs:49 and its duplicate-id check still apply.
- Nothing is written to rows.json, batches/, tests/howto/golden/ or any other file. The copy's stage stays 'drawing'.

(c) Clean first, then each mutation must turn red and be restored:
- the clean copy is green on PQ-H10 (the parent rebuilt alone matches its GOLDEN.json fragments on main);
- a key outside PARAMS (for example gripWidth) gives H10.unknown (A7);
- a raw-spec key ('tempo') gives H10.raw (A4);
- one byte of one parent fragment changed in memory gives H10.byte.

(d) Mode test. lb1-plates.test.ts asserts that every rows.json row's mode equals the note: 14 H, 0 D. A7 loops over every D row in rows.json. The 0-D assertion is the guard for (f) and stays in place until (f) is fixed.

(e) Note, section 1, gets three changes:
- "proven in Do 4 (lb1-plates.test.ts)", since no H10 test exists at 1a31cd46;
- subject lib_close_grip_pulldown → lib_lat_pulldown, because chin_up is only drawn in Do 5(b);
- the envelope fact: qa/envelope.json names no PARAMS key, so derive() given that envelope (derive.mjs:2-3) refuses every param today, and no row can be a valid D.

(f) Known H10 gap. It is recorded here and not fixed by LIB-9a, because qa/ is a reserved path.
- On the real path, validateParams (qa/node.mjs:262-273) checks only key names against PARAMS (derive.mjs:4-12). It ignores PARAMS `values`, number ranges and the envelope, and it allows empty params.
- Checked on main: 'bar.kind':'banana', 'camera.maxScale':99 and 'handedness':7 all pass H10.
- The note's risks list it, and the clean copy's green is described as "H10's checks bite", never as "a valid D".
- The supervisor routes an H10 value and envelope fix (with the mutations 'bar.kind':'banana' and an out-of-envelope camera.maxScale, each red) to whoever owns qa/, before any D row exists on any branch.

### Fixes (from the review; each with its test or mutation listed in the PR)

- **high** `tools/plates/library/specs/close_grip_pulldown.mjs:92 (stack composer)`: The stack lift has the wrong sign: LIFT0 + cableLen(start) - cableLen(lm). I compared it with lat_pulldown.mjs:112, which uses cableLen(lm) - cableLen(start). Today the stack never rises, and its cable runs down through the plates and below the floor. Use lat_pulldown's form. Add a test that fails on 1a31cd46: lift > LIFT0 at the end and in the Mistake, and the stack cable end at or above the stack top. Every stack-cloning spec in the bulk gets the same test. Re-run QA afterwards, because the fit box changes.
- **high** `tools/plates/library/specs/assisted_pull_up.mjs (padTopOf, PAD_START/END/MIS, kneelRoot) with eq/assistMachine.mjs:54`: The contact proof cannot fail. The composer draws the pad from lm['knee.r'], and the checks plane comes from the same pose's knee, so the check always reads 0 cm (I confirmed this in the code). Drive the machine from named per-pose pad states (pad-top or lever angle) that do not depend on the knee being checked. The composer draws from ctx.pose's state, the checks plane uses the same constant, and the root and leg angles are solved to meet the pad. Add a test that reads the drawn pad poly in start, end and Mistake: knee.y minus pad-top = KNEE_R*H within 1 cm, and knee.z lies within the pad. These must turn red: the pad frozen at the start, and LEGS.knee 92 changed to 80. No knee.r contact plateFact may rely on these checks until this is fixed.
- **medium** `tools/plates/library/lb1/DESIGN.md section 4 (topFault rule)`: Turn the rule round as ruled in Q1. The key comes from the card's plate.mistake through the ruled mapping, Do 6 writes it from the card, the spec's first Mistake tell must carry it, and the verifier checks it against the card. Add the mutation: one spec's first tell key changed turns F7 red.
- **medium** `tools/plates/library/specs/assisted_pull_up.mjs (top pose = spec start)`: No pad, bracket or lever is drawn under the top pose's knees, because the engine draws no moving equipment in the start layer (vendor plate.mjs:110-114). Add leg_press's workaround (leg_press.mjs:119): a thin outline of the start pad, bracket and lever, added to the end pose only. Add a test that the end-pose items contain the start pad-top outline.
- **medium** `tests/howto/lb1-plates.test.ts composer tests (assistMachine, chestRowMachine, dHandle)`: These tests check helper maths: assistGeometry's hypot equals the lever by construction. Instead, assert on the drawn items in every pose: the lever poly's centreline ends at the pivot and leverEnd (length within 1 mm), the dHandle rails end at the ring, and the chestRowMachine lever ends at a handle on its circle. R2's mutations own-2, own-3 and own-4 must turn red and be listed in the PR. Correct the composer headers that cite the old test as proof.
- **medium** `tests/howto/lb1-plates.test.ts A5 'each plan 6.2 LB1 id once'`: JSON.parse merges duplicate keys, so new Set(Object.keys(...)).size cannot catch a duplicated row. Count each LB1 id's row key in the raw text of rows.json, or parse with a duplicate-key detector. List both A5 mutations (drop a row, duplicate a row) as red in the PR.
- **medium** `tests/howto/lb1-plates.test.ts A9 'no LB1 id is in tests/howto/golden/library/'`: Two problems. A substring match on id.slice(4) wrongly flags lib_dumbbell_shoulder_press, and it misses a file that names an LB1 exercise only by its hyphen chromeId or slug, or that holds only page entries for batch LB1. Match whole tokens: \b(lib_)?<id>\b for the underscore forms and (^|[^a-z0-9-])<slug>([^a-z0-9-]|$) for the hyphen forms. Also fail on a file name derived from an LB1 batch file or matching /lb1/i, and on text naming batch 'LB1'. Mutations: a page-only lb1.json turns red; chin-up.layers.html with data-id='chin-up' turns red; a file naming only lib_dumbbell_shoulder_press stays green.
- **medium** `PR #245 slice post (card Do 2)`: The post is not yet the full Do 2 slice. Merge origin/main (now b70ca58, which includes LIB-2b #234) with a merge commit. Then complete Do 4, Do 6 for all 14 cards, the content verifier, and Do 7 on both plates (the two-build plates-page sha256 and the QA table), with A9 and every mutation shown red and then restored. The supervisor names the research head (9dbc7e0 unless it has moved) and posts the Q3 tempo-map ruling, so Do 6 can run now.
- **medium** `main: tools/plates/library/candidate.mjs:74 (schema: PARAMS) vs qa/node.mjs:268-271 validateParams`: I found this myself. derive.mjs PARAMS writes enums as {type:'enum', values} and numbers with no min or max, but validateParams reads s.enum and s.min/s.max. So on the real candidate path H10.value never fires: a bad enum value or an out-of-range number passes. LIB-3's M21-M23 use a test schema with `enum`, which hides this. The supervisor assigns the fix. Recommended: LIB-9a Do 4, which already edits candidate.mjs: pass validateParams a schema built from PARAMS plus the envelope. Its failing-before test is Q5's test copy with an enum param outside its values, which must turn H10.value red. It does not block LB1, because LB1 has 0 D rows.
- **low** `tools/plates/library/lb1/DESIGN.md section 2`: inverted_row and straight_arm_pulldown also name their census closest plate among the 8 (seated_cable_row and lat_pulldown; verified in census.json @ 4a9fd86) next to pilot A's anchors, each with its approving sha (the 8 at bc0f378; pilot A at e6f39ff or the head D-PILOTA-R5 names). The pose class of close_grip, underhand and single_arm pulldown becomes 'seat + overhead' (verified).
- **low** `tools/plates/library/eq/polybar.mjs and DESIGN.md section 5`: Ruling: polybar.mjs is accepted by name as a composer-support file, under the same rules (a new file, pure, PRIMITIVES-only output, no file reads, covered by the import scan). The note records it as such.
- **low** `tools/plates/library/specs/assisted_pull_up.mjs header lines 13-17 and alt; lb1-plates.test.ts comment above swapPad; DESIGN.md section 9 item 4`: The header says start = the hang and end = the top. Correct it to the drawn order (start = top, end = hang) and add the note on the deliberate difference from pull_up. The alt text follows the drawn order: from chin over the bar, lower slowly to a straight-arm hang with the knees on the pad. Reword the rackUpright statement as ruled in Q4(c).
- **low** `assisted_pull_up Mistake layout (arrow guide; misBody root)`: Move the 'missing range' arrow clear of the 'Arms bent' pill, so the leader and the arrow read as separate marks. The Mistake body sits 6.6 cm back from the start and end with a 2° lean, which can read as a swing (c8). Either keep the trunk equal to the hang and record the arc shift, or choose pivot and lever so it shrinks, and record which one in the header. Check that the arm fault still reads before the heavier red pad dashes, and give the critic this as a note.
- **low** `close_grip_pulldown callouts and Mistake (spec:123, :127-135, header :17)`: Three changes. The 'Handle below chin' leader crosses the neck: give the callout an explicit box above or right of the handle. The faulty handle is hidden inside the solid arm: draw a dashed V-handle outline at MIS_G, as pull_up and hanging_leg_raise redraw hidden parts, and have the critic check R5 on this plate. Correct the header to say the elbows end at the front edge of the trunk, not in line with the hips.

### Supervisor follow-ups (not yours)
- Q1 (b): I settle single_arm_lat_pulldown's drawable question as research owner, inside the research verify that runs tonight (wave 2 plus the 8's cards). Until then its expected F7 is undecided, and no Do 7 evidence for it counts.
- Q3 and Q4: I record the amended A11 and A2 mutation lines on `claude/sup-lib4-cards` (section 12).
- Q5 (f): the H10 value and envelope gap in `qa/node.mjs` goes to a separate small card before any D row exists on any branch. LIB-9a does not touch `qa/`.

### Amendments recorded here
- Item 9's mutation line for LB1 (D-LIB9-CARDFIELDS, 'Rest changed → red') is replaced by Q3's six mutations (i)-(vi).
- LIB-9a's A2 'box pad' mutation is replaced by Q4's exact-key rackUpright mutation, with the premise assertions of Q4 (a); A4 still runs LIB-3's M6.

19. **D-LIB4c-1 (b) amended: the MANIFEST guard's one exemption (22:2x UTC; #249).** The guard rule (agent-guard.sh Rule 4) is: every non-merge commit that changes `tools/plates/library/MANIFEST.json` carries `[golden update]`. There is one exemption: the commit that creates the file as exactly `{"rows": {}}` (no parent file, one key, an empty map) needs no tag.
    - Why: LIB-4c's `2ee3a037` creates it that way untagged, on a branch that is never rewritten, and an empty manifest pins nothing. Without the exemption every head holding LIB-4c is red on that commit.
    - Why nothing is loosened: any later edit, deletion, non-empty creation or rename into the path stays red untagged (tested on #249). C0 still recomputes every row, file and sha256. The scratch ref's build commit (scratch.mjs) carries `[golden update]` so Agent guard is green there too.

20. **Red tests at 153 outside both PINS-2 lists (D-LIB4a-SCALE, 2026-10-18 ~00:4x UTC; #233 @ `0b2d3c1`, comment 6243767609).** LIB-4a edits none of them.
    - (a) Clone artifact: library-core's top-level `beforeAll` `render()` (:14) refused by LIB-2b's E3 `pagesOf` on a synthetic id with no pinned page. It names a synthetic id's missing page, so it qualifies under D-LIB4-PINS-2. LIB-4a's library-core evidence at 22 and 153 uses the one-line local bypass, with its exact diff in the PR; the bypass is never committed. At real scale every shipped id has its pinned page, so render() runs.
    - (b) Scale defects, not clone artifacts: L2-A13 and L2-A4 (`lb-test.json` uses `lib_barbell_row`); library-rows E1 (`zz-lib2b.json` uses `lib_cable_lateral_raise`); generate.test "plates.mjs writes exactly the 8 modules…" and zooms "HT2-A6 inline custom properties…" timing out at 5,000 ms at 153. Each fixture collision turns red for real when a batch ships that id (pilot A's batch rows hold `lib_barbell_row`), and the timeouts grow with the number of generated files (the pilot A review timed out HT2-A2 the same way). LIB-4a lists each in the PR under "scale defects (D-LIB4a-SCALE), routed", with its exact error line, and marks none known.
    - (c) Routing: one card, LIB-4d (scale test fixes), queued for a lane slot under D-LIB-LANE-ACTIVE. It must merge before the first merge that ships `lib_barbell_row` or `lib_cable_lateral_raise`, or takes main's shipped rows past 22. Its rules: every assertion stays; no timeout is raised; fixture tests read only their own batch rows (or an id no real batch can hold); the generated-file reader is not re-run per file. Evidence: each named test green under 5 s on the 8, the 22 and the 153 scratch trees. Mutations: a real duplicate inside a fixture is still red; the per-file re-read restored turns a 153 timing assertion red.
    - (d) LIB-4a's READY does not wait for LIB-4d: no LIB-4a acceptance row covers `npm test` at 153 beyond lib-4a.test's A1/A2 and A7, which pass.
    - Why nothing is loosened: no test, assertion, timeout or fixture changes in LIB-4a; the defects are named and owned, not hidden.

21. **Freed-slot queue and the LIB-3b card (D-LIB-LANE-ACTIVE amended, 2026-10-18 ~02:3x UTC).**
    - The freed-slot order (item 2) gains three cards after LIB-5 (Do 2 on): **LIB-3b** (PQ-H10 values and envelope, `docs/supervisor/verify/lib-3b-card.md`), then **LIB-4d** (D-LIB4a-SCALE, item 20), then **LIB-8-FIX** (the pilot A #109 review findings). The existing items (the LIB-7 fixer, LIB-6-PM, LIB-9a's second drawer) keep their place behind LIB-5. A card in this queue moves ahead of them only when its deadline is next in the merge queue: LIB-3b before any D or T row on any branch; LIB-4d before any merge that ships lib_barbell_row or lib_cable_lateral_raise or takes main past 22 shipped rows; LIB-8-FIX before pilot A's plan-slot-7 merge. If a park is needed, these three park before LIB-9a and LIB-5.
    - LIB-3b merges before #245 (LIB-9a). Section 13 Q5 (c) is amended: once LIB-3b is on main, the clean D copy gets `H10.envelope:camera.maxScale` (the envelope names no PARAMS key), and "green on PQ-H10" there reads "only H10.envelope, which proves the envelope is read". The two lb1-plates.test.ts expectations (the clean row and the one-byte row, at :790 and :801 on `e035bdf`) change in LIB-3b's PR only if #245 is already on main; otherwise LIB-9a updates them when it merges main after LIB-3b.
    - Open for LIB-10, before its first D or T row: (i) where approved PARAMS ranges live (envelope.json cannot hold a hand row: selftest.mjs:23-25 compares the whole file with a fresh measurement of the 8, and pin.mjs --write rewrites it); (ii) whether PQ-H10 must also prove the drawn D plate equals derive(parent, params) (candidate.mjs:66 takes a D row's drawing from its source file). Both are supervisor rulings; neither is LIB-3b's.
    - Why nothing is loosened: the queue change moves no check; LIB-3b only adds failures (fail-closed) to H10.

22. **Cards LIB-4d and LIB-8-FIX, and their rulings (2026-10-18 ~04:1x UTC).** Both cards were drafted, then checked and fixed in two adversarial rounds (round 1: 26 and 20 findings; round 2: 6 and 10, all applied). They are `docs/supervisor/verify/lib-4d-card.md` and `lib-8-fix-card.md`. Both wait in the freed-slot queue (item 21).
    - **LIB-4d deadline, read strictly (amends item 20 (c)).** LIB-4d merges before the first merge that ships any library row. registry.mjs:34-36 refuses a duplicate id, chromeId or prefix at every stage. Also, library-rows :92, :94 and :108 pin the counts to the 8, so E1 turns red on the old code as soon as any batch row ships. It also merges before any merge that takes main past 22 shipped rows. The card's deadline line is the full text. "Under 5 s" means each named test passes under vitest's default timeout, which is never raised.
    - **D-LIB8FIX-CARRY (accepted as the card proposes):** "#109's head is unfrozen for this card only. The 16 approvals at e6f39ff (D-PILOTA-R5) count on a later #109 head only when FX8 has run on that exact head and holds there: two builds each give the plates page f9f87b82da0aea546bbc6f022f8ed680b5149930403c13f2ba3668bbcfc958d7, 1,715,569 B, firstDiff -1 against blob d774614a; 17/17 report ok; every plate's flag ids equal Do 2's. This applies to each head this card pushes: the fix heads, the READY head and every main merge after a 'LIB-8-FIX resume'. Each needs its own FX8 run. A head without one carries no approval."
    - **D-LIB8FIX-ENV (gap 6; accepted as the card recommends):** pilot A's build.mjs keeps its ENVELOPE values. They set only the sheet's flag lines and the page order, and never stand in for LIB-3's flags. In pilot-a/build.mjs, only the :26 sentence "Re-measured by LIB-3 once it merges (plan 3.5, last bullet)." changes, to "Kept for this sheet and page order only (D-LIB8FIX-ENV): F2 and F3 here are other measures than LIB-3's; LIB-3's qa flags (qa/envelope.json) gate the merge." Plan 3.3 ("A flagged plate cannot merge without the owner's yes") is met by the LIB-8 merge card's gap 4 run (LIB-3's qa with qa/envelope.json). Every plate that run flags needs the owner's named exemption before pilot A merges.
    - The 'LIB-8-FIX start' message quotes both rulings word for word, with the active-builder count.
    - Why nothing is loosened: no check, envelope bound or approval rule changes. Approvals carry only on byte-identical proof, and the merge still needs LIB-3's own flags.

### 13.1 Slice look and Do 5 (D-LIB9a-SLICE, 2026-10-18 ~00:1x UTC; #245 @ `6285b4f`)

Reviewed from two sides: a fixes-and-evidence audit that re-ran the tests and 4 mutations in a worktree, and a blind plate critic that rendered both plates beside lat_pulldown and pull_up on the plan 3.4 rubric. A judge decided.

**Verdict:** GO for Do 5, with conditions. The slice evidence holds at 6285b4f: 53/53 tests, every mutation red, the same sha on both builds, QA as posted, CI green. The defects found are fixable layout and drawing defects on the two slice plates, plus bookkeeping. None of them breaks the evidence chain. They must land first, before any plate is cloned from them. Q2(g): the bound fallback does not apply now. This critic scored assisted_pull_up R5 = 4 and did not name the drawn order. It was also an uncalibrated pass (no planted defects, no hidden anchors), so it is not the plan 3.4 run that Q2(g) binds. The fallback stays armed for the calibrated Do 8 critic, and these fixes do not use up that run's one fix round.

**Must fix first** (before any plate is cloned from these two):
- **high** `tools/plates/library/specs/close_grip_pulldown.mjs: Mistake (MIS_G dashed V-handle, mistake arm.r)`: R5 = 3 (verified in zoom.m: the red handle and forearm dashes sit on the solid end forearm; the only fault drawn as a pose is a small elbow arc behind the back). Make the fault read as a pose outside the solid end figure. The mistake forearm, hand and V-handle need a red outline that clears the solid arm, with the handle readable at lower-chest level, separated as lat_pulldown's swing is. Keep every hard check green, H3's Mistake outline and deviation included. Recheck at 390 px in Paper and Silent Black beside lat_pulldown, and post before and after renders.
- **medium** `tools/plates/library/specs/close_grip_pulldown.mjs callout 'chin' (box left 150, top 132)`: The leader runs alongside the blue trace and the cable for about 30 plate px (1 to 4 px apart; verified in zoom.n). Box the label so the leader meets the handle from the open side, for example a box right of the handle at handle height with a short horizontal leader. No leader segment may run within about 6 px of the trace or a cable. The section 13 'box above or right' fix stays satisfied.
- **medium** `tools/plates/library/specs/close_grip_pulldown.mjs callout 'thighs' (box left 180, top 226)`: The selected box covers half of the thigh-pad roller and touches the tower upright, and the leader bend passes through the roller (verified in crop.thighs-label). Place the box in open space and bring the leader to the pad-on-thigh contact from the open side. The selected box must clear both the roller and the upright.
- **medium** `tools/plates/library/eq/assistMachine.mjs:93 (stack rods:false, no rod lines)`: Add two static eq-thin guide-rod lines through the stack, as close_grip_pulldown.mjs (the last equipment item) and vendor lat_pulldown do. Keep them static so H9 stays green, and update ASSIST_ITEMS. Add a composer test that the rods exist and pass through both the lifted and the resting plates. Every stack in the batch draws its rods the same way (R7).
- **medium** `tools/plates/library/specs/assisted_pull_up.mjs:81-87 (mistake arrow guide; tell 'partial' box); PR HANDOFF`: The section 13 low 'move the missing-range arrow clear of the Arms bent pill' was not made: the guide and tell lines are unchanged since 1a31cd46 (verified with git diff). Move the arrow or the pill so the arrow, the pill and the leader read as three separate marks. Add the 'arm fault reads before the heavier red pad dashes' point to the critic note. Correct the HANDOFF tick, which claims all the lows are done.
- **low** `PR #245 body; tools/plates/library/candidate.mjs:55-57 comment`: Meet Q-A's third condition. The body names the candidate.mjs path rule as the sourceOf part of D-LIB9-AUTHORQA, with the goldenInputs reason (registry.mjs:61). Refresh the stale body: the head is 6285b4f, Do 7 and the slice post are ticked, and Waiting on reflects the current state. Reword the candidate.mjs comment ('Ruling asked on #245') to cite the Q-A ruling (6242372604).
- **low** `tests/howto/lb1-plates.test.ts:181-188 (stack test) and :337-342 (Q-A in-test mutation)`: (1) The cable-end assertion repeats the spec's own formula: check it against an independent value (the drawn stack poly's top). (2) The Q-A 'changed path is red' test is vacuous (it edits the output string; `__setExtraBatches(...) ?? sourceOf` only ever compares with sourceOf). Either replace it with a module-level mutation, or drop it and rely on the listed source mutation (howto/ to howto2/, which is red). Reset the hook in finally.
- **low** `tests/howto/lb1-plates.test.ts:272-279 (A9 batches/ scan); lb1/DESIGN.md section 8`: Add an in-test mutation that feeds the batches/ text scan a file naming lib_chin_up (red) and one naming only lib_dumbbell_shoulder_press (green). Today its red comes only from the registry's duplicate-id throw. Add the H10 value and envelope gap to section 8's risks list (Q5 f), pointing to section 1 and the supervisor's separate qa/ card.
- **low** `tools/plates/library/eq/chestRowMachine.mjs:10-11 header; eq/assistMachine.mjs:81 comment`: The chestRowMachine header says the test proves 'the lever keeps its length in every pose'. The test proves only the drawn lever from the pivot to a handle on its circle at synthetic grips, so say that. Add the per-pose drawn-item check on the real chest_supported_row spec when it is drawn in Do 5(c). Fix the stale assistMachine comment 'lift0 ... (dead hang)': start is now the top.
- **low** `tools/plates/library/specs/assisted_pull_up.mjs (PAD_TOP/ROOT: knee 2.5 cm behind the pad front edge) and leaders 'high', 'pad', 'partial'`: On this tier-A right pose the kneecap overhangs the moving pad's front edge (verified in zoom.n and zoom.m). Re-solve the roots, or the pad and bracket geometry, so the kneecap sits inside the front edge with the shins along the pad. Keep the kneePlane checks and the drawn-pad contact test, and re-run the H2 mutations. Where room allows, route 'Pad stays up' and 'Knees on pad' around the shin and the bracket. Leave 'Arms bent' as it is only if no open-side box fits, and record why.

**Conditions for Do 5:**
- Order: the slice must-fix items land first. Do 5(a) and 5(c) start after them. The 5(b) pulldown clones (underhand_lat_pulldown, single_arm_lat_pulldown) start only from the fixed close_grip_pulldown. Never clone the pre-fix callout or Mistake pattern.
- After the slice fixes, re-run lb1-plates (with H1, H2a-c and own-2 to own-4 red again), qa.mjs on both plates and the two-build plates-page sha256. Post them, with before and after 390 px renders in both themes, in the next milestone post. This is not a new WAITING gate.
- Every stack-using spec in the bulk gets the stack test as a loop over all stack specs: lift > lift0 at the end and in the Mistake, the cable end on the drawn stack top (an independent value), and guide rods drawn the same way as close_grip.
- Each new composer use gets a per-pose drawn-item test on the real spec, as assistMachine has (chestRowMachine in 5(c), band in resistance_band_row).
- Supervisor: record a one-line ruling that LB1 How-to sources may hold `id` besides `research` (071e078c), because library-scale's synthetic N=153 reader needs it. Nothing else may be added to those files. The builder cites it in DESIGN.md.
- Q2(g) stays armed for the calibrated Do 8 critic: if that run names the order or scores assisted_pull_up R5 below 4, the bound fallback applies (card order, the phantom moved to the hang, the identity pose map, the tempo reordered through the Q3 map, the verifier and QA re-run, one fix round and one recheck; after two failed rounds the plate goes to the supervisor). This pre-critic look uses up none of that.
- Plan 3.4 R8 and R9 cannot be scored in LIB-9a (no close-ups or feel stills). Record in the critic plan that no LB1 approval counts as a full 3.4 pass until LIB-9 (or LIB-6/7) adds them and the critic scores R8 and R9.
- Carried, unchanged: Do 5(d) waits for the #109 pilot A code review verdict. single_arm_lat_pulldown's expected F7 stays undecided until Q1(b), and no Do 7 evidence for it counts before then. Re-copy the cards once when research wave 2 and the 8 merge, and re-verify the named cards. Do 8 and every approval wait for D-LIB9-F5. The 2-hour push limit until READY stays. Nothing goes under batches/, tests/howto/golden/, src/ or tools/plates/gen/, and every milestone post shows the three-dot diff.

**Ruling D-LIB9a-HOWTOID:** LB1 How-to sources may hold `id` beside `research` (071e078c), because library-scale's synthetic N = 153 reader needs it. Nothing else may be added to those files. DESIGN.md cites this.


### 13.2 Do 5(d) opens: pilot A anchors (D-LIB9-CLONE, 2026-10-18 ~00:30 UTC)

The pilot A code review is posted on #109 (6243689943 @ `e6f39ff`): FAIL on code (2 blockers, 1 medium, 2 lows), with the anchors sound to clone at `e6f39ff`. Its findings are pilot A's to fix before its plan-slot-7 merge; none changes a drawing. So Do 5(d) (straight_arm_pulldown, inverted_row) opens now, cloning from `e6f39ff`, under these rules:
- (a) Copy, never import. A clone copies the anchor code it needs (pose helpers, solvers, constants) into its own spec file. It never imports from a pilot A spec, so a later pilot A edit cannot move the clone's inputs closure. Evidence: the clone's `closureOf` lists no `specs/` file other than its own.
- (b) Checked solver. Every copied root finder throws when its bracket holds no root (`f(lo)` and `f(hi)` with the same sign), the way `barbell_row.mjs:68` (`solve`) does. `dumbbell_bench_press.mjs:56`'s `bisect` does not check this (verified at `e6f39ff`), so inverted_row's copy of `supine()` gets the check. Mutation: a bracket moved past the root throws.
- (c) Fresh brackets. Each hard-coded bracket (for example `barbell_row.mjs:77` [-0.40, -0.04], `romanian_deadlift.mjs:91` `Z_HANG`) is re-derived for the clone's geometry and recorded in the spec header with the value it solves to.
- Everything else in section 13 and 13.1 holds. LIB-3's H6 re-check of the anchors (gap 4) or a pilot A fix that changes a drawn anchor re-plans only these two ids (lib-9a-card.md risk_and_recovery).

### 13.3 Slice fixes and Do 5 a-d (D-LIB9a-DO5, 2026-10-18 ~02:4x UTC; #245 @ `e035bdf`)

Reviewed from three sides, then judged:
- an evidence audit that re-ran the tests, shas, QA and 10 mutations at `f94905c` and `e035bdf`;
- a blind plate critic that scored all 11 drawn plates on plan 3.4, each beside its anchor at the same scale;
- a plan-and-rules lens.

The judge re-measured every must-fix item below in a worktree at `e035bdf` (pose landmarks through the engine's `poseAt`, fit scales through `renderPlate`) or in the critic's zooms. Inputs: LIB-9a's posts 6244293298 (slice fixes @ `f94905c`) and 6244297640 (Do 5 a-d @ `e035bdf`).

**Verdict**
- **Slice fixes: ACCEPTED** at `f94905c`, with two bookkeeping corrections (must-fix 12 and 13).
  - The audit re-ran the posted evidence and it matches exactly: 56/56 tests, typecheck clean, plates-page sha256 `5ed250dc…628da` on four builds, the QA table row for row, and every mutation red.
  - Every 13.1 must-fix landed. The critic scored close_grip_pulldown 4 on every item, so the old R5 = 3 is fixed. assisted_pull_up scored 4 or more on every item, with R10 = 5.
- **Do 5 a-d: NOT GO as a set.** The evidence at `e035bdf` holds: 79/79 tests, sha256 `fd5dc4a7…b1eee2` on four builds, QA as posted, D-LIB9-CLONE (a)-(c) met, and every recorded bracket matches what the code solves to. The drawings are the problem:
  - Below the bar, to fix: straight_arm_pulldown, single_arm_lat_pulldown, chest_supported_row and inverted_row.
  - Redraw or hold: horizontal_leg_press (Q-D5-3).
  - Rescale under D-LIB8-floor: resistance_band_row (Q-D5-1).
  - At the bar on this pass, drawing unchanged: underhand_lat_pulldown, incline_machine_press and shoulder_press. They still owe the tell and header items (Q-D5-4, must-fix 14).
  - Not drawn and not reported: chin_up and hanging_knee_raise.
  - **leg_press_calf_raise is HELD.** No rule lets it pass without loosening something (see the calf-raise rulings).
- This critic pass was blind but uncalibrated: no hidden anchors and no planted defects. So it is not the plan 3.4 Do 8 run, and it uses none of that run's fix round or recheck. Q2(g) stays armed for Do 8. R8 and R9 are still unscored (13.1).

**Must fix** (before the next milestone post; each fix needs a test that is red at `e035bdf` and green after, listed in the PR):
1. **high** `specs/straight_arm_pulldown.mjs` (poses: only start and end):
   - The problem:
     - The three ghosts interpolate between the two grips, so their elbows bend 98°, 120° and 98°, against 15° at start and end (measured).
     - That is more bend than the plate's own Mistake (about 90°), so the normal plate teaches the fault (R1 = 2).
     - The trace is a straight line, where a straight arm sweeps an arc around the shoulder (R6 = 3).
   - The fix:
     - Add `via` keys at t = 1/4, 1/2 and 3/4 with the elbow kept at 15°. The arm goes forward in even steps between START_DEG 122.9 and END_DEG 3.57: about 93°, 63° and 33°.
     - Test: every ghost's elbow bend is 15° ± 2° (PQ-H6's angle tolerance, stricter than the critic's ±3°).
2. **high** `specs/single_arm_lat_pulldown.mjs` Mistake (MIS_G, tell `past`):
   - The problem: the red handle and fist are short dashes on the front edge of the solid forearm, and the elbow is only about 6 cm behind the back (verified in the zoom, R5 = 3). This is the same defect 13.1 rated high on close_grip, which says "never clone the pre-fix … Mistake pattern".
   - The fix:
     - Move the Mistake grip so the red handle and fist clear the solid forearm by at least 6 px (13.1's clearance) at lower-chest level.
     - Put the elbow clearly behind the back line (the critic's target is at least 10 cm).
     - Keep H3 green.
     - Test the clearance on the drawn items. Recheck at 390 px in Paper and Silent Black.
   - This fix does not wait for Q1(b): the drawn fault is the same under either answer (section 13 Q1(b): "the plate stays unchanged").
3. **medium** `specs/single_arm_lat_pulldown.mjs` (path between the poses):
   - The problem (measured; R1 = 3):
     - From t = 1/4 to 3/4 the elbow stays 24-27 cm above the shoulder.
     - At t = 1/2 and 3/4 it moves 7.2 and 13.2 cm behind the shoulder, and it rises from 0.241 to 0.246 m between those two steps.
     - In the last quarter it drops 55 cm.
   - The fix: add in-between keys.
   - Test: at t = 0, 1/4, 1/2, 3/4 and 1 the elbow's height falls at every step, and at every ghost the elbow is level with or in front of the shoulder. underhand_lat_pulldown already meets both; this plate fails both today.
4. **medium** `specs/chest_supported_row.mjs` (END_Y, lever, header line 16):
   - The problem:
     - The end elbow sits 9.1 cm in front of the upper-back surface (elbow z 0.009 against backUpper −0.082, measured).
     - The card says "just behind the body" (checkpoint 'Elbows past sides', c4, c5).
     - The approved seated_cable_row ends 3.1 cm behind its back (−0.157 against −0.126, measured).
     - The header's "the elbows just behind the trunk" is false.
   - The fix:
     - End the pull with the handles further back, beside the pad (they sit either side of it). Re-solve the lever and its ghosts.
     - Test: the end elbow.r z ≤ backUpper z − 0.03 m.
     - The same re-solve fixes Q-D5-6's start handle (test: the drawn start handle spans the shoulder joint's height). Move the gap mark between the chest and the pad. Correct the header.
5. **medium** `specs/inverted_row.mjs` (rackUpright, header line 26):
   - The problem: the J-hook is drawn, but the end forearm covers all of it, so the bar seems to float about 9 px from the upright (verified in the zoom, R2 = 3).
   - The fix: make part of the hook visible, for example a lip or hook plate showing past the fist.
   - Test: part of the hook's outline lies outside the end figure. Mutation: the hook moved back under the forearm turns it red.
6. **medium** chin_up and hanging_knee_raise (Do 5(b), both tier A):
   - The problem:
     - Neither is drawn at `e035bdf` (11 specs on the branch).
     - The PR says "5(a), 5(b), 5(c) and 5(d) are drafted (9 plates)", and no post, DESIGN.md line or commit message gives a reason.
     - Nothing posted blocks them: their anchors are pull_up and hanging_leg_raise, among the 8.
   - The fix: draw both in this round under 13 and 13.1. If a real blocker exists, name it on the PR with its evidence, and add it to the HANDOFF `Waiting on:` line.
7. **medium** `specs/horizontal_leg_press.mjs` (end knee 25°): rule Q-D5-3 applies: redraw the end at about 15°, then hold if H3 is red.
8. **medium** Mistake tells on seven plates: horizontal_leg_press, incline_machine_press, inverted_row, shoulder_press, single_arm_lat_pulldown, straight_arm_pulldown and underhand_lat_pulldown carry one tell each. DRAWING-GUIDE:24 says 2-3, all about the one fault (rule Q-D5-4).
9. **medium** `tests/howto/lb1-plates.test.ts:437-438` (STACK_SPECS):
   - The problem: straight_arm_pulldown draws a weight stack (cableColumn stack plus two static rods, spec:118, :128), but it is not in the stack loop that 13.1 requires for every stack-using spec. Its own test (:548) checks only that the stack rises. No test locks that the rods are static or reach the stops.
   - The fix:
     - Add it to the loop: lift above lift0 at the end and in the Mistake, the cable end on the drawn stack top, and static rods through the resting and lifted plates.
     - If its drawn items need an adapter, every assertion of the loop must still apply.
     - Mutations: rods removed, and cable 3 cm off the stack top. Both must be red.
10. **medium** resistance_band_row F2 0.1784 < 0.19113:
    - The problem: the raised flag is not in the expected set (DESIGN.md:79: "Any other raised flag is a defect to fix"), so A4 is not met.
    - The fix: apply Q-D5-1.
11. **low** PR #245: the Do 5 mutations are not listed. The card's Acceptance says "list each one in the PR". List every source mutation with its test and its red line.
12. **low** PR #245 slice table, row "a03f920 labels":
    - The problem: only the whole a03f920 file is red (the old column at 0.86/1.12 m). The a03f920 label boxes alone on the `f94905c` station are green at both heads.
    - The fix: rename the row "a03f920 file (labels and old station)", and add the Q-D5-2 proof mutation.
13. **low** `tests/howto/lb1-plates.test.ts`: add D-LIB9-CLONE (a)'s closureOf assertion for inverted_row (no `specs/` file but its own); today only straight_arm_pulldown has one. Make the leader-test path parser throw on any command other than M, L or H, so that a later path cannot slip through.
14. **low** Spec headers: list every number the card does not give under "Unsourced numbers:", as barbell_shrug.mjs:47-48 at e6f39ff does. These include:
    - the fault sizes (incline: 20°, the 8 cm GAP_M; shoulder_press: 5.5 cm, 10°, 28°);
    - the drawing numbers in Q-D5-6.

Not blocking, low: in close_grip_pulldown the first two ghosts keep the elbows 26-28 cm above the shoulder, then the third drops 36 cm (measured). Even in-between keys are recommended in the same round as fix 3.

**Rulings**

#### Q-D5-1 (resistance_band_row cover)
Ruling: apply D-LIB8-floor (#109 comment 5950197626) to this floor-sit plate.
- Camera: as plank and mountain_climbers at e6f39ff, `camera: { fit: true, maxScale: 1.35, y0: 339 }`. The floor line stays at the approved y.
- Measured: the fit fills the plate width at 186.29 px/m (×1.273, within the ruling's ×1.35). Cover then rises to about 0.289 (0.1784 × 1.273²), inside F2's [0.19113, 0.54943].
- F1 is raised. It is a named exemption by id and key on the LB1 sheet, citing D-LIB8-floor and this ruling (D-LIB3-flags: the supervisor signs, and the owner sees it and can overturn it).
- DESIGN.md section 3 adds "F1 on resistance_band_row (D-LIB8-floor)". Its "no other flag" line stays for everything else.
- Re-run QA. Any other new flag (F3 included) is a defect to fix. The critic rechecks it beside seated_cable_row.

Why:
- D-LIB8-floor was "decided once, for every floor exercise in later batches too". It names the defect this plate has: a low figure that leaves the band above it empty. At the reference scale, the critic scored plank and mountain_climbers R7 = 3 for exactly that.
- Both choices raise one flag, so they are equal on flags. This one is stricter: it uses an approved precedent and brings cover back inside the envelope. A per-plate F2 exemption would add a new kind of exemption for a figure smaller than any approved plate, with no precedent.
- The builder's other request, an F2 class exemption for floor sits, has no basis. F2 depends on how each plate is drawn, unlike F5, which is the same chrome on every plate.

Why nothing is loosened:
- No envelope bound moves; the F1 cap of 146.29 stays.
- F1 is still raised and still needs its named exemption. D-LIB8-floor's ×1.35 limit binds.
- Every hard check runs again on the rescaled plate.

#### Q-D5-2 (pulldown station 18 cm deeper)
Ruling: ACCEPT, only once a test shows it is needed.
- The proof mutation: the `f94905c` labels and leaders with the column at lat_pulldown's 0.86/1.12 m.
- It must turn a named test red: the leader test, the box-clearance checks or PQ-H1. List its red line in the PR as the station's proof.
- If it stays green, nothing forces the change. All three pulldowns go back to 0.86/1.12 m, as the approved lat_pulldown, and QA re-runs.

Why:
- The critic found the station reads as an ordinary pulldown at the same 132.6 px/m. The only difference side by side is a frame 24 px wider, and all three LB1 pulldowns match (R7 within LB1).
- But the claim "fits only with the column 18 cm back" is unproven: the mutation offered for it was the whole old file, and the labels alone are green (audit).
- When both depths look equally good, the approved anchor's geometry wins unless a check forces the change.

Why nothing is loosened: 13.1's 6 px leader rule and the box-clearance rule stay as they are. The station changes only on a red test, never by assertion.

#### Q-D5-3 (fault sizes against H3's 11.39 px)
Ruling, plate by plate:
- **incline_machine_press (11.9 px) and shoulder_press (12.9 px): ACCEPT.**
  - Pilot A did the same: the supervisor told it to clear the minimum through the Mistake (#109 comment 5966301778, "Don't change the check"), and dumbbell_bench_press and dumbbell_shoulder_press were approved at 11.7 and 12.0 px.
  - Both sizes go under "Unsourced numbers" in the header (must-fix 14). The critic read both faults at 4.
- **horizontal_leg_press: REJECT the 25° end.** Redraw the right (end) pose at about 15°, the approved leg_press top, and keep the lock Mistake.
  - The 15° is sourced in the anchor: "knees 15 deg short of lockout" (vendor leg_press.mjs:13, :23).
  - Re-run H3. The judge's estimate from the leg geometry is about 8 px at the knee anchor; the builder measures it.
  - If H3 is red, the plate is HELD under D-LIB8-shrug, like the calf raise:
    - the research owner checks the card's sources for an end-knee number;
    - a sourced number that turns H3 green is drawn;
    - otherwise the supervisor brings a design option to the owner with the calf raise.

Why:
- The 25° was chosen to pass H3. The post says "20° failed H3", and the 25° is the right pose, not the Mistake.
- The card says "relaxed and nearly straight" (c4), its quote says "stop just short of a full knee extension" (WebMD, c4), and the plate's own cue says "a small bend left". The critic called 25° "a clear bend" against both the card and leg_press's 15°.
- D-LIB8-shrug: "the drawing is not exaggerated" to fit H3.
- No card-true way to pass H3 was found:
  - The engine's knee cannot hyperextend: the angle comes from acos, and the two-bone reach is clamped below full length (body.mjs:179, :225).
  - Locking from 15° moves the sled only about 1 px.
  - Zooming does not reach it either: the full rig fits only up to 154.05 px/m (measured).

Why nothing is loosened:
- H3's minimum is unchanged.
- Mistake sizes may be illustrative, as pilot A's were.
- A right pose is never moved away from its card to pass a check.

#### Q-D5-4 (a second tell from the card's mistake text)
Ruling: ACCEPT `tip` on resistance_band_row.
- It is a visible sign of the card's one fault: "Slumping: the lower back rounds and the trunk tips forward" (c3).
- The first tell stays `slump`, which equals topFault, so F7 reads the right key.
- Its anchor sits on the open side, and H8 passes.

Also, for the seven one-tell plates (must-fix 8):
- Add a second tell wherever the card's mistake text names a second visible sign of the same fault. Examples:
  - inverted_row: "folds at the hips";
  - straight_arm_pulldown: "turning it into a … pushdown";
  - underhand_lat_pulldown: "the torso rocks back".
- Where the card names only one visible sign, or a second tell cannot be placed without crossing the solid figure or a cable, record that per id in DESIGN.md with the reason. The supervisor rules on each one; the builder does not decide it.
- A second tell is also the clean way to widen a thin H3 margin.

Why:
- DRAWING-GUIDE:24 (the card's design reference) says "2-3, all about the one fault", and DRAWING-GUIDE:40 says tells are "the visible signs of that fault". Pilot A's plates follow it.
- H2's 1-3 is a floor, not the design rule. Section 13 Q1 binds only the first tell's key.

Why nothing is loosened: a tell is never invented ("Never invent a … fault", DRAWING-GUIDE:37), and H2, H4, H8 and F7 apply to every tell.

#### Q-D5-5 (Mistakes partly inside the solid figure)
Ruling:
- **single_arm_lat_pulldown: FIX now** (must-fix 2). The unlabelled shoulder roll stays unlabelled, because anchors go on the open side (DRAWING-GUIDE:59-60).
- **shoulder_press: ACCEPT.** The arch is drawn as a red line on top of the body with a gap mark (verified in the zoom), which is pilot A's approved method. R5 = 4.
- **chest_supported_row: ACCEPT** on this pass (R5 = 4, it reads from the head and back). The re-solve in must-fix 4 must keep R5 at 4 or more.
- **close_grip_pulldown: ACCEPT** (R5 = 4). The engine masks the Mistake forearm inside the body on every plate, and the handle and elbow show.

Why: 13.1 ruled that the fault must "read as a pose outside the solid end figure", and plan 3.4 needs R5 ≥ 4. That is judged plate by plate on what reads, not on whether a part overlaps the body.

Why nothing is loosened: R5 ≥ 4 stays the bar, and the calibrated Do 8 critic still scores all of them.

#### Q-D5-6 (cue rewording and smaller choices)
Ruling:
- **Cue rewording: ACCEPT.** Cards hold facts, not user copy (CARD-V2.md:3). A cue must keep the card's meaning, stay at 15 words or fewer with no semicolons (DRAWING-GUIDE:39, PQ-H8), and follow the AGENTS UI-copy rule.
  - Add a table per id to the PR: the card's `what` and its claim, the plate cue, and the word count. The fresh PR reviewer checks it for the reader; the content verifier does not cover copy.
- **Drawing numbers the card does not give: ACCEPT,** each recorded in the header (must-fix 14):
  - incline pad 25°;
  - inverted_row bar 1.00 m, 30° sag and the start arms;
  - inverted_row tell text "Hips sagging", only if H4 passes;
  - straight_arm_pulldown Mistake drawn mid-pull and column 1.13 m;
  - single_arm end grip 12 cm under the chin;
  - underhand end bar 10 cm under the chin and a 25° rock.
- **chest_supported_row start handle 11 cm below the shoulder: FIX** with must-fix 4. The card says "at about shoulder height" (c1, c2), so the drawn start handle must span the shoulder joint's height. Move the pivot; never bend the fact.

Why: 11 cm is about 16 px at this scale, an R1 risk. The plate is being re-solved anyway.

Why nothing is loosened: H8's lint and H6's facts are unchanged, and every number not on the card is named in its header.

#### Calf raise blocker 1 (PQ-H3 trace 17.7 px against 22.11 px)
Ruling: HOLD leg_press_calf_raise. The other 13 go ahead.
- A per-plate H3 exemption, or an "ankle-only" trace rule, would lower a check, so neither is allowed:
  - no exemption path exists for a new plate (qa/index.mjs:24-28, exemptions.json "New plates inherit none");
  - the trace minimum is pinned (envelope.json traceLenMin 22.111).
- The plan's small-motion zoom (plan 1, F1 as a named exemption) is not usable now, for three reasons:
  - **No approved zoom convention exists.** Plan 8 item 3 approves the convention "as drawn" on pilot A. Pilot A's barbell_shrug dropped its zoom because the zoom cut the legs off at the knees, and the shrug is held. The anchor rule (plan 3.1) bars a plate that uses an unapproved convention.
  - **A zoom would be a crop.** The parent leg_press rig fits whole only up to 154.79 px/m (measured, ×1.058). The toe would then trace about 18.7 px, still short. The zoom needed (×1.25 for the toe, ×2.26 for the heel) would crop the rig, which is how the shrug failed R7.
  - **The toe is the wrong trace point.** The trace must be the point the card's cue is about (DRAWING-GUIDE:29; leg_press traces `heel.r`). Choosing the toe because it moves most serves H3, not R6.
- Route under D-LIB8-shrug:
  - The research owner checks the card for a sourced range larger than the drawn one. The card allows ankle extension "through about 30-45 degrees" (c4); at 45° the trace grows only ×1.07.
  - If nothing sourced passes H3, the supervisor brings a design option (for example, a magnified trace inset) to the owner. **Owner-only: it must wait for the owner.** Putting the id on the named list is also the owner's call (plan 1).
- The calf-raise numbers (17.7 px, 4.7 cm) come from an uncommitted spec and are not verified. When the plate is re-planned, its spec is committed first.

Why: no rule allows this plate without loosening something. Holding it is the shrug's precedent.

Why nothing is loosened: H3 stays as pinned, and no flag or envelope bound moves.

#### Calf raise blocker 2 (toes through the footplate)
Ruling: nothing is chosen now, because the plate is held on blocker 1. These bounds bind the re-plan:
- **(a) REJECTED.** The toe exits the plate by 4.7 cm in the solid right pose (an R3 failure).
  - The anchor's crossing is about 1.5 cm (12° about a 7.0 cm ball-to-toe length, body.mjs:25), inside the plate's thickness, and only in a red Mistake outline (leg_press.mjs:94-100). It does not cover a right pose.
- **(b) Tilting the plate: NOT ALLOWED as it stands.** The card fixes "the parent's rig", so a different rig needs a research change to the card first. Even then the toe still crosses (±2.6 cm), and R7 asks for "the same equipment drawn the same way".
- **(c) The smallest range: NOT ENOUGH.** It still crosses (±1.8 cm), and it shrinks the trace, so blocker 1 gets worse.
- **(d) or (e), a front-drawn plate composer or a toe joint:**
  - (e) is an engine change: vendor/** is reserved, and plan 2.4 allows only E-R5.
  - Either one comes only as part of the owner's design option, never as a builder choice.
- The re-plan bound: the solid start and end poses show no toe inside the footplate (R3).

Why: the builder recommended (b) plus a note, but a rig change is not the builder's call. Each option either breaks the card or leaves a visible contact error.

Why nothing is loosened: R3 and R7 keep the bar, the card is not bent, and no reserved engine file is touched.

**Owner-only, and it waits**
- The design option for leg_press_calf_raise, and for horizontal_leg_press if Q-D5-3 holds it (D-LIB8-shrug).
- Any named-list decision.
- Nothing else here is owner-only. The F1 exemption on resistance_band_row is the supervisor's, at the LB1 sheet, and visible to the owner (D-LIB3-flags).

**Conditions for the next round**
- Order:
  - Merge origin/main with a merge commit first (main is at `b99a9e2` since train 25; the branch's merge-base is `b70ca58`).
  - Then the must-fix items, highs first.
  - Then chin_up and hanging_knee_raise.
- The next milestone post includes:
  - lb1-plates with every mutation listed and shown red, then restored;
  - qa.mjs on every drawn id;
  - the two-build plates-page sha256;
  - 390 px before and after renders, in Paper and Silent Black, for every changed plate beside its anchor;
  - the cue table (Q-D5-6);
  - the three-dot diff.
  It is not a new WAITING gate.
- Carried, unchanged:
  - single_arm_lat_pulldown's expected F7 waits for Q1(b).
  - Do 8 and every approval wait for D-LIB9-F5.
  - The card re-copy follows research wave 2.
  - The 2-hour push limit until READY stays.
  - Nothing goes under batches/, tests/howto/golden/, src/ or tools/plates/gen/.
  - qa/ and vendor/ stay reserved.

### 13.4 Round 2 (D-LIB9a-R2, 2026-10-18 ~04:3x UTC; #245 @ `4257648`)

Reviewed from three sides, then judged:
- an evidence audit that re-ran the tests, the shas, QA, 8 of the listed mutations and 5 new ones;
- a blind plate critic that scored the 9 changed plates on plan 3.4, each beside its golden-A anchor at 390 px, in Paper and Silent Black, normal and Mistake;
- a rules lens.

Inputs: LIB-9a's round-2 post 6245258953 and its cue-table comment. The judge re-measured these points in a worktree at `4257648`, using the engine's `bodyShapes`, `poseAt` and `renderPlate`:
- the single_arm Mistake elbow and fist clearances, at 4257648 and on the critic's v5;
- the straight_arm Mistake bar against the solid bar path;
- `load: 0` on a direct stack;
- the resistance_band_row floor and label boxes at 186.29 px/m;
- incline_machine_press, inverted_row and underhand_lat_pulldown rendered in the Mistake at 390 px.

**Verdict: NOT GO for READY. One more fix round.**
- The evidence holds at `4257648`. lb1-plates passes 92/92 and typecheck is clean. The plates page gave sha256 `a93b2427…e411` on four builds plus the test's two. The QA table matches row for row, and every listed mutation is red. Row 67 is red with 2 problems, not 1 (must-fix 7).
- These 13.3 must-fix items landed: 1, 3, 4, 5, 6, 7 (plate held), 10, 11 and 12. Item 13 landed except for the PR row (must-fix 7). Item 14 landed except for one number (must-fix 8). Item 8 is closed by the rulings and must-fix 5. Item 9 is reopened as must-fix 3.
- Still open:
  - one plate below the bar (single_arm Mistake, R5 = 3);
  - one loosened test;
  - a hole in the stack loop, hidden by must-fix 9's false claim;
  - one tell whose words do not match its drawing;
  - the one-tell records.
- This critic pass was blind but uncalibrated (no hidden anchors, no planted defects). So it is not the plan 3.4 Do 8 run, and it uses none of that run's fix round. Q2(g) stays armed. R8 and R9 stay unscored (13.1).

**Per plate.** "At the bar" means every scored item is 4 or more on this uncalibrated pass. The Do 8 critic decides.

| plate | verdict | still owed |
|---|---|---|
| straight_arm_pulldown | at the bar. 13.3 must-fix 1 verified: every ghost elbow at 15.0°, and the trace is an arc | fix the `close` tell words (must-fix 4); stack loop (must-fix 3) |
| single_arm_lat_pulldown | **fix**: Mistake R5 = 3. The normal plate is at the bar (13.3 must-fix 3 verified: the elbow falls at every step, 20.1 cm in the last quarter) | must-fix 1 (Q-R2-1) |
| close_grip_pulldown | at the bar | stack loop (must-fix 3) |
| chest_supported_row | at the bar. 13.3 must-fix 4 verified: end elbow 8.31 cm behind backUpper; end grip 0.98 cm behind the pad face; start handle spans the shoulder (1.0335 m); lever 0.5766 m; clears the head by 11.7 cm | stale comments (must-fix 6) |
| inverted_row | at the bar. The hook shows (13.3 must-fix 5 verified, R2 = 4) | one tell accepted; DESIGN.md record (must-fix 5) |
| chin_up | at the bar (R10 = 4) | none (not blocking: the 'Elbows in front' leader) |
| hanging_knee_raise | at the bar (R10 = 4) | none |
| resistance_band_row | at the bar at 159 px/m (R4 = R7 = 4) | Q-R2-3 conditions |
| shoulder_press | at the bar. `gap` tell added (R10 = 4) | none |
| incline_machine_press | drawing at the bar (13.3); not re-scored | second tell, or evidence that none fits (must-fix 5) |
| underhand_lat_pulldown | at the bar (13.3); not re-scored | one tell accepted; DESIGN.md record (must-fix 5) |
| assisted_pull_up | at the bar (accepted at `f94905c`, unchanged since) | cue table (must-fix 7). Q2(g) stays armed for Do 8 |
| horizontal_leg_press | **HELD**. The Q-D5-3 route was followed: redrawn at 15°, H3 8.2 px against 11.39 | loosened test (must-fix 2); owner design option |
| leg_press_calf_raise | **HELD** (13.3) | unchanged |

**Must fix** (before the next milestone post). Each fix needs one of two proofs, listed in the PR: a test that is red at `4257648` and green after, or, where a test missed a defect, a mutation that is green at `4257648` and red after.
1. **high** `specs/single_arm_lat_pulldown.mjs` Mistake (MIS_G, misBody reach, guides, tells `past` and `low`). This is 13.3 must-fix 2 as restated by Q-R2-1.
   - The drawing:
     - The Mistake elbow ends at least 10 cm behind the end `backMid`.
     - The red elbow cap clears the solid end figure by at least 6 px.
     - The end pose and the normal plate do not change.
     - The moving cable shows in the Mistake (DRAWING-GUIDE section 4), in close_grip's pattern (a dashed line from the Mistake handle to the head-pulley tangent).
     - An elbow guide from the solid elbow to the red elbow is optional, kept only if it reads (an arc, or a short straight arrow behind the back).
     - The `past` and `low` boxes sit where the engine reports no issue.
     - The `low` anchor sits on a drawn red mark on the open side, never inside the figure (DRAWING-GUIDE:59-60).
     - The `low` cue drops "to the chest". Default: "The handle keeps going down well past the chin." (9 words).
     - The header lists every new number under "Unsourced numbers".
   - Tests:
     - (a) The Mistake `elbow.r` z ≤ the end `backMid` z − 0.10 m. At 4257648 it is −0.064 m, so red.
     - (b) The drawn outline of the Mistake elbow cap lies at least 6 px outside every trunk and near-side shape of the solid end figure. Build the shapes with the engine's `bodyShapes` at the plate's px/m, as the shoulder_press test does. At 4257648 it is 4.4 px, so red.
     - (c) The Mistake view draws the moving cable from the Mistake handle to the head pulley. It is absent at 4257648, so red.
     - Evidence, not a test: the normal plate's SVG is byte-identical to 4257648's.
   - Keep every hard check and H3 green. Post 390 px renders in both themes beside lat_pulldown and close_grip.
   - It can be done. The critic's v5 prototype (`r2look/variants/v5.mjs`) puts the elbow 12.2 cm behind backMid with the cap 9.8 px clear (judge-measured). It passes all 10 hard checks, its H3 deviation is 43.9 px, and its normal plate is pixel-identical (critic's runs).
2. **medium** `tests/howto/lb1-plates.test.ts:302` (horizontal_leg_press sled travel; see the sled-travel ruling).
   - Replace `toBeGreaterThan(0)` with two assertions:
     - the change in the drawn plate face (`legPressFace` at each travel) from end to Mistake equals the change in `sole.r` z within 1 mm;
     - that change is at least 0.007 m (0.00795 m now).
   - Delete the duplicate knee-lock line at :303 (it repeats :298).
   - Proof: a Mistake-only travel offset of +3 mm is green at 4257648 and red after. Setting the Mistake travel equal to the end travel is red after.
3. **medium** `tests/howto/lb1-plates.test.ts` stack loop (:580-655; see the stack-adapter ruling).
   - (a) The "drawn stack top" for the cable check is the top edge of a drawn block at least one plate high (0.025 m at the plate's px/m). In the end and the Mistake the lifted block holds at least one plate.
   - (b) For a cableColumn, read the lift from its drawn plates. Delete stackItem's copy of the vendor formula; the file's own header forbids "a helper's own maths".
   - (c) Correct the test comment and PR row 9. A spec edit can part the cable from the stack.
   - Proof, green at 4257648 and red after:
     - `STACK.load` 6 → 0 (`straight_arm_pulldown.mjs:55`);
     - `load: 8` → 0 (`close_grip_pulldown.mjs:110`). The judge re-ran this one: both stack tests pass at 4257648. The rules lens ran both mutations: 92/92 green.
   - List the audit's spec mutation `stack: { ...STACK, rods: false, base: [0, 0.03, SZ] }` as must-fix 9's proof. It is red at 4257648 (`3.9208 < 1`). Row 53 stays as an extra.
4. **medium** `specs/straight_arm_pulldown.mjs:163` (tell `close`).
   - The problem: "Bar to chest" and the cue "pulled in to the chest" do not match the drawing (judge-measured). The red bar is at y 1.319, 0.363 m from the chest. It is 18.5 cm nearer the shoulder than the solid bar path at the same height (0.472 against 0.657 m).
   - The fix: words that say what is drawn, as the card says it ("a bent-arm pulldown", c6). Default label "Bar pulled in". Default cue "The bar comes in close to the body, as in a bent-arm pulldown." (13 words). Update the cue-table row.
   - Tests:
     - (a) The drawn Mistake bar sits at least 0.15 m nearer the shoulder than the solid bar path at its own height. This pins the new claim.
     - (b) The `close` text and cue do not name the chest. Red at 4257648.
5. **medium** `lb1/DESIGN.md` and `specs/incline_machine_press.mjs` (Q-R2-2).
   - DESIGN.md records, per id, the one-tell reason as ruled below, with the measurement behind it. Q-D5-4 requires this; at 4257648 the reasons are only in the PR.
   - incline_machine_press: add the second tell. Test: its tell keys, in row 66's pattern, red at 4257648. Use the evidence route only if Q-R2-2's condition is met.
6. **low** `specs/chest_supported_row.mjs` comments.
   - The END_G line says "6 cm behind its face"; the measured gap is 0.98 cm.
   - The PIVOT_Y line says "24 cm in front of the face". The header says 17 cm; the audit measured about 18 cm.
   - Also correct the post's claim that the 1.85 m pivot "put the end lever across the face": on the same bisector it clears the head by 3.7 cm.
   - Comments and post only, so there is no test.
7. **low** PR #245 bookkeeping (post only, no test):
   - Row 13: name the lever test "start handle at the hands" and its mutation, the start reach target moved 3 cm down (`0.0210 < 0.005`) or 2 cm back (`0.0135 < 0.005`). Row 17 does not cover START_G.
   - Row 67: give the exact edit and the red line it gives now. At the audit's edit it is 2 problems (`…Thighs<br>pinned:126cells`, `…Handle<br>below chin:56cells`), and the A4 M1 test throws.
   - Row 1's red line reads "> 0.03".
   - Must-fix 3's numbers: the last-quarter drop is 20.1 cm; close_grip's steps drop 6.2-18.4 cm.
   - Cue table: 7 word counts are one low (chin_up elbows and arc; hanging_knee_raise curl; horizontal_leg_press ninety and soft; straight_arm straight and thighs). Add assisted_pull_up's table: Q-D5-6 asks for one per id.
8. **low** Spec headers (no test):
   - horizontal_leg_press lists 15° under "Unsourced numbers", citing its anchor source (vendor `leg_press.mjs:13`, `:23`). The card does not give it (13.3 must-fix 14).
   - single_arm lists must-fix 1's new numbers.

Not blocking (low):
- chin_up: the 'Elbows in front' label sits about 70 px below its elbow on a vertical leader. That is under F3's 82.26, but use a nearer open box if one exists.
- inverted_row: the cup under the bar is not distinct (R2 = 4).

**Rulings**

#### Q-R2-1 (single_arm_lat_pulldown Mistake)
Ruling: none of (a), (b) or (c). 13.3 must-fix 2 is restated as must-fix 1 above:
- the elbow stays at least 10 cm behind backMid;
- the 6 px clearance moves from the fist to the red elbow cap, measured against the solid end figure;
- the moving cable is drawn in the Mistake;
- the handle sits where the arm puts it, even if the solid torso hides it;
- the end pose does not move, H3 stays green, and the 390 px recheck must score R5 ≥ 4 in both themes.

Why:
- The card puts the fault in the elbow and the shoulder: "the elbow drives backward behind the body and the shoulder rolls forward" (c10, c13). The fist target came from 13.1's close_grip ruling, where the card's fault is "too low". On this card's end pose the two 13.3 targets conflict:
  - With the elbow 10 cm behind backMid, the 0.332 m elbow-to-grip reach ends at z ≈ 0.145 (rules lens).
  - A 6 px fist clearance at lower-chest height needs z 0.24. The builder's own numbers agree.
- (a) Relaxing the elbow target is the 4257648 drawing: elbow 6.4 cm behind, cap 4.4 px, fist −1.0 px (judge-measured), and R5 = 3. Even at 6 cm the fist reaches only z ≈ 0.185.
- (b) Relaxing the clearance accepts the 0 px pattern that 13.1 banned from cloning.
- (c) Changing the end pose moves a right pose off its card. A grip at z 0.24 puts the end elbow 16 cm in front of the shoulder (critic's probe), against c3, "upper arm flush with your side". Q-D5-3 forbids this.
- The restated target can be met (v5, must-fix 1).
- Strict option: the critic's route (the elbow plus a guide) and the rules lens's route (6 px on the elbow) both keep every rule. This ruling takes both together, plus the cable.
- c13's quote counts "nears or touches your chest" as the normal stop of the pull. So "to the chest" leaves the `low` cue (DRAWING-GUIDE:37).

Why nothing is loosened:
- Both 13.3 numbers (10 cm, 6 px) stay, measured on drawn items. The 6 px now applies to the mark the card names.
- Both are judge drawing targets, not QA checks. No check and no envelope bound moves. H3's minimum, every hard check and the R5 ≥ 4 bar stay.
- The critic designed v5, so its R5 = 4 is not a blind score. The next critic pass and Do 8 score the builder's drawing.
- The right pose is not moved (Q-D5-3).

#### Q-R2-2 (one tell kept), per id
Ruling: for every id, the reason goes into DESIGN.md with its measurement (must-fix 5).
- **horizontal_leg_press: ACCEPT one tell.**
  - The card's mistake names one sign: "Snapping the knees straight and locking them" (c7, c4, c8).
  - The heels (c7) and the low back (c4) are right-form tells or other faults. Drawing them as Mistake tells would add a second fault (DRAWING-GUIDE:24 "all about the one fault", :37).
- **incline_machine_press: REQUIRE a second tell for the forward roll.**
  - The card says "Shoulder blades roll forward off the pad at the top of the press" (c5). `blades` marks "off the pad" at backUpper, so "roll forward" is the second sign.
  - The builder's grounds were the solid arm "or the levers". The levers are not a Q-D5-4 ground, and leaders on this plate already cross the rear post and the pad.
  - The judge's 390 px render at 4257648 shows red marks of the roll outside the solid figure: the red head ahead of the solid head, and the red arm, handle and lever past the solid ones, in the open top right.
  - So: a second tell that names the roll, anchored on one of those marks on the open side, with H1, H4, H8 and F3 green and 13.1's 6 px leader rule kept.
  - Only if every open-side box fails one of those checks, or crosses the solid figure or a cable, does DESIGN.md list each box tried with its red check. The supervisor then rules again.
- **underhand_lat_pulldown: ACCEPT one tell.**
  - The card names one visible sign, "the torso rocks back".
  - "To drive the bar down" is the purpose. "Using momentum" cannot be seen in a still. c5's lean limit is the same sign.
  - The tried 'Bar driven down' leader also crossed the face and the arm, a Q-D5-4 ground.
  - Correction: 13.3 Q-D5-4's example for this id ("the torso rocks back") is tell 1 itself, `rock`. The example is withdrawn.
- **inverted_row: ACCEPT one tell, on the placement ground only.** The card names the fold (c3), and Q-D5-4 named it too, so "only one sign" is not the ground.
  - The fold's only open-side edge is the buttock, which `sag` already marks, and `sag`'s cue already says "the body folds". A second tell there would be one sign twice (DRAWING-GUIDE:40).
  - The other side of the fold lies inside the solid end figure.
  - The tried 'Folds at hips' leader runs 91 px through the solid thigh (the builder's figure; the judge did not re-measure it). That is over F3's 82.26, so it would raise a new flag (DESIGN.md:79).
  - DESIGN.md records the box tried and its leader length.

Why: Q-D5-4 asks for 2-3 tells wherever the card names more than one visible sign that can be placed (DRAWING-GUIDE:24, :40), and a per-id record otherwise.

Why nothing is loosened: no tell is invented. Where a second sign exists and can be placed (incline), it is required. H2, H4, H8 and F7 apply to every tell.

#### Q-R2-3 (resistance_band_row at 159 px/m)
Ruling: ACCEPT 159.02 px/m (×1.087 of 146.29) on four conditions:
- List the proof in Q-D5-2's form. With the floor back at 1.30 m and the 4257648 labels, the engine reports `figure:Band round<br>soles:169cells` (PQ-H1). The judge verified this: 1.40 m is also red, and 1.60 m is clean.
- The named F1 exemption on the LB1 sheet states 159.02 px/m (×1.087) and cites D-LIB8-floor, Q-D5-1 and this ruling. Q-D5-1's 186.29 was a measurement, not a target.
- The scale test pins 159.02 ± 0.5 px/m, so a floor or camera change turns red against the exemption. Today's test passes anything from 153.6 to 197.5.
- The floor's 1.60 m stays under "Unsourced numbers" (it is listed at spec :33-34).

Why:
- D-LIB8-floor sets a ceiling ("may go up … at most ×1.35"), and the camera is exactly Q-D5-1's. Cover is back inside F2 (0.211 against 0.19113), which was Q-D5-1's purpose.
- Of the two allowed scales, 159 is the stricter. F1 overshoots its 146.29 cap by ×1.087 instead of ×1.273, and the figure stays nearer its anchor's scale (R7). The critic scored R4 = R7 = 4 beside seated_cable_row.
- The long floor departs from plank, whose floor ends 1-3 cm past the feet. But it matches this plate's anchor, seated_cable_row, whose floor spans the plate.
- 186 is not proven impossible. The judge probed boxes at 186.29 px/m:
  - every box right of the foot hits the plate edge (`edge:`);
  - boxes above the foot pass the engine's box checks, but their leader runs down the upright toes. That is the builder's reason, and no check scores it.
  - So the ruling rests on the stricter flag, not on impossibility.

Why nothing is loosened:
- F1's cap, the ×1.35 limit and F2's range stay. F1 is still raised and needs its named exemption.
- Cover sits only 0.02 above F2's floor. Any later change re-runs QA, and an F2 flag is a defect to fix.
- The Do 8 critic rechecks the plate beside seated_cable_row and plank.

#### Stack adapter (13.3 must-fix 9)
Ruling: the adapter-level red (row 53) counts only as a check that the comparison can fail. It is not must-fix 9's proof. Must-fix 3 closes the gap.

Why:
- "No spec edit can part them" is false.
  - `cableColumn` spreads `...st` after `base` into `stack()` (`equipment.mjs:93`), while the cable end uses the column's own base (`:99`).
  - The audit's base-offset spec mutations are red in the loop and in the Do 5(d) test (`3.9208 < 1`; "cables over the stack: expected 0").
- The loop has a real hole.
  - `load: 0` draws a resting stack whose cable ends in mid-air: 1.083 m above the visible plates on straight_arm (rules lens).
  - Both stack tests stay green, because a zero-height lifted block counts as "the drawn stack top" (lb1-plates.test.ts:615, :627-628). The judge confirmed it on close_grip.
- stackItem's lift copies the vendor formula, which the test file's header forbids.

Why nothing is loosened: every loop assertion stays and two are added. Row 53 stays as an extra.

#### Sled-travel test (horizontal_leg_press)
Ruling: changing `> 0.01` to `> 0` loosened a test. Must-fix 2's replacement reverses it. The plate stays HELD.

Why:
- The 0.01 bound was set for the 25° pose that Q-D5-3 rejected. At the card-true 15° the lock moves the sled 0.795 cm, so no card-true drawing can meet it.
- But `> 0` passes a 0.1 mm move. The per-pose "sole on the plate face" check allows 1 cm, which is more than the whole travel. So nothing else catches a frozen or wrong sled.
- The added "knee lock" line repeats :298.

Why nothing is loosened: the replacement pins the travel to the leg's own movement within 1 mm and keeps a floor of 0.007 m. It is red on every mutation the old bound caught at this pose, and on one it missed: a Mistake travel off by 3 mm. Strict option: an exact match plus a floor, not a lower threshold alone.

**Owner-only, and it waits**
- The design option for horizontal_leg_press and leg_press_calf_raise (D-LIB8-shrug). It comes after the research owner checks the sources. The card at 9dbc7e0 gives no end-knee number, only "relaxed and nearly straight" and a 0-50° range, so the check is of c4's sources.
- Any named-list decision.
- Nothing else here is owner-only:
  - The F1 exemption at 159.02 px/m is the supervisor's (D-LIB3-flags: the owner sees it and can overturn it).
  - Q-R2-1's restatement is a supervisor drawing target.

**Supervisor actions**
- Record the F1 exemption on resistance_band_row at 159.02 px/m (×1.087) on the LB1 sheet.
- Ask the research owner to check horizontal_leg_press c4's sources for an end-knee number, together with the calf-raise check.
- Done by this section: 13.3 Q-D5-4's underhand example is withdrawn, and 13.3 must-fix 2 is restated.

**Conditions for the next round**
- Order: merge origin/main with a merge commit if it has moved. Then must-fix 1, then 2-5, then the lows.
- The next milestone post includes:
  - lb1-plates with every mutation, old and new, listed and shown red, then restored;
  - qa.mjs on every drawn id;
  - the two-build plates-page sha256;
  - 390 px before and after renders in Paper and Silent Black for every changed plate beside its anchor (single_arm also beside close_grip);
  - the updated cue table;
  - the three-dot diff.
  It is not a new WAITING gate.
- Carried, unchanged:
  - single_arm's expected F7 waits for Q1(b). Must-fix 1 does not wait for it.
  - Do 8 and every approval wait for D-LIB9-F5. Q2(g) stays armed. R8 and R9 stay unscored.
  - The card re-copy follows research wave 2.
  - The 2-hour push limit until READY stays.
  - Nothing goes under batches/, tests/howto/golden/, src/ or tools/plates/gen/.
  - qa/ and vendor/ stay reserved.

Also for LIB-9a's replacement, from research w2 (`claude/libht-verify-w2` @ `531b77c`, `verify/w2/w2-rulings-final.md`): LR-31 turns assisted_pull_up to drawable:false (a speed fault), and its Mistake then needs a fast-lowering fault key; underhand's spec draws `past`; LR-32's lib-9a-card.md edits are held until the w2 recheck. These take effect only when w2 merges into claude/libht-research and LIB-9a re-copies the cards.

### 13.5 LB1 calibrated critic (D-CRITIC-CAL3, 2026-10-18 ~11:00 UTC; #245 @ `a4458f1a`)

**What ran:** two rounds of the pilot-a-critic pattern (plan 3.4) on the 14 LB1 plates. Each round had a panel of 3 fresh Opus critics, 2 hidden approved anchors and 2 plants: P02 inverted_row (Mistake "Hips sagging" drawn as hips up, R5) and P05 underhand_lat_pulldown (the "Elbows down, back" leader moved to the shoulder, R4).

| Round | Anchors (low medians) | Plants | Script verdict |
|---|---|---|---|
| 1 | pull_up R6 = 3; lat_pulldown R4 = 3 | P02 R5 = 2, P05 R4 = 2: both caught | discarded (anchor below 4) |
| 2 | hanging_leg_raise R1 = 2, R7 = 3; leg_press R3 = 3, R5 = 2 | P02 R5 = 2, P05 R4 = 2: both caught | discarded (anchor below 4) |

**Ruling D-CRITIC-CAL3:** round 1 is the valid calibration. The fix list is the union of the LB1 findings from both rounds (`docs/supervisor/verify/lb1-critic-findings.md`), less one withdrawn row.

Why:
- The anchor check exists to catch a harsh critic. D-CRITIC-CAL2 already ruled that a golden plate with a verified weak spot is not a clean anchor. Round 1's only anchor lows are one item each, and the supervisor confirmed both on the PNGs:
  - pull_up R6: the trace lies on the forearm;
  - lat_pulldown R4: the lean-back mark sits at the elbow.
  Every other anchor item has a median of 4 or more, and both plants were caught. A critic that finds a real defect is accurate, not harsh.
- No clean anchor is left that resembles these plates. Seated_cable_row and machine_chest_press were excluded by D-CRITIC-CAL2, and barbell_back_squat is tier A without a rack. Round 1 and round 2 together have now flagged lat_pulldown, pull_up, hanging_leg_raise and leg_press. A third round could only repeat this.
- Round 2 is not used for validity, because its anchors got the wrong facts. Both anchors were given their research-card plateFacts, not their golden-B facts. hanging_leg_raise R1 = 2 compares the plate with the card's "toes to the bar".
- Round 2's LB1 findings are still kept. That is stricter: nothing is dropped, and each finding needs 2 of 3 critics either way.

**The rule from now on.** A round counts as calibrated only if all of these hold:
- both plants are caught (D-CRITIC-CAL);
- every anchor item has a median of 4 or more, except at most one item per anchor where:
  - the supervisor has confirmed the defect on the PNG;
  - it is recorded as a golden-B follow-up in HANDOVER;
  - the round's other anchor items are all 4 or more.
- Anchors are scored on their own golden-B facts.

**Withdrawn:** the round 2 row "hanging_knee_raise R7" [3, 3, 4]. Its ceiling mount matches the approved hanging_leg_raise mount pixel for pixel in every row sampled (dark.png y 38-126). The same panel scored that anchor R7 = 3 for the same mount. The mount is on purpose: the vendor spec says "ceiling mount (no wall for the swing to hit)". So this is a golden-B question, not an LB1 defect.

**Limit:** on resistance_band_row (R7 in both rounds), the critics' fix, "scale 1.3x", is not allowed. Q-R2-3 pins 159.02 px/m within 0.5 px/m, and 1.3x would also pass D-LIB8-floor's ×1.35 ceiling. LIB-9a fixes the framing some other way that keeps every check, or posts why none exists.

**For LIB-9a (card Do 8):**
- Fix only what the file names. One fix round, then a fresh calibrated recheck on the changed plates under the rule above.
- After two failed rounds on one plate, stop and report.
- A fix never edits a card. If a fix would break a hard check, a pinned test or a ruling, post the conflict with its evidence instead, and the supervisor rules.
- R8 and R9 stay unscored (13.1).

**Golden-B follow-ups**, owner-visible and not blocking LB1, recorded in HANDOVER:
- pull_up R6 trace;
- lat_pulldown R4 lean mark;
- hanging_leg_raise mount level with the SIDE VIEW title, and its bar style differs from pull_up's;
- leg_press: "Knees cave" cannot be seen side-on (R5), and a floating back (R3). The panel flagged both; the supervisor's check is pending.

### 13.6 LB1 fix round ruled (D-LIB9a-FIX1, 2026-10-18 ~11:55 UTC; #245 @ `1a4947d`)

LIB-9a's "LB1 FIX ROUND READY" (#245 comment 6249481646) fixed four rows and reported five as not fixable. The supervisor checked each report against the critics' own coordinates and the cards on `claude/libht-research` @ `9eaa2480`.

**Accepted, to the recheck:**
- chest_supported_row R4: tell at the sacrum, arrow, arch 16°. The arrow and the 12.8 px gap at mid-back stand in for the "10 px at the lumbar" ask. The engine's outline bends there by 8 px at most, with a label on the figure.
- close_grip_pulldown and underhand_lat_pulldown R4: the lean arc behind the back.
- inverted_row R7: a 2.0 m upright and one start ghost.

**R1 withdrawn on chin_up, close_grip_pulldown, underhand_lat_pulldown and single_arm_lat_pulldown (end elbow position).** No change.

Why:
- **The critics' targets need longer limbs than the body has.** At the plate scale (×2 in the PNGs), the vendored forearm-to-grip is 0.342 m: 90 px on chin_up and 91 px on the pulldowns.
  - chin_up: the critics' target elbows, (370,270) and (400,260), sit 122 px and 114 px from the hand (377,148). That is 1.27-1.35× the forearm.
  - underhand: an elbow under the shoulder (242,421) at the upper-arm length sits 114 px from the bar (285,402), which is 1.26×. The critics' (250,500) is 104 px, 1.15×, and it also shortens the upper arm to 79 px (the arm is 86.5 px).
- **The cards fix the grip above the shoulder joint.** Their stop points are "Bar just below the chin" (underhand), "Handle just below the chin" (close_grip), "Handle just past the chin" (single_arm), and chin over the bar for chin_up (pinned c3). With the arm's lengths, that puts the elbow in front. LIB-9a's pole sweeps show the drawn elbows are already the furthest back the cards allow. The supervisor checked the arithmetic above; the sweeps are LIB-9a's.
- **The asked fix would draw the Mistake as the Right.** close_grip's card Mistake is "Handle pulled past the chin, elbows moving back behind the body". The round 1 critic noted the same for underhand: its Mistake labels the elbows going back as the fault.
- The cards' "elbows down and back toward the glutes" and "upper arms tucked" describe the path of the pull. The end pose meets them as far as the stop point allows: the elbows are down from overhead, and on close_grip they are turned in.
- Not loosened: no card, check or pin changes. Each plate's DESIGN.md records the sweep numbers.

**Recheck brief change (every plate, anchors and plants alike).** Any pose fix a critic proposes must keep the drawn segment lengths, and must state the lengths it assumes. A finding whose own fix breaks that does not count. The rule applies to every plate in the set, so calibration is unchanged.

**inverted_row R3: fix it.** The start arm is right: the grip is on the bar, and the arm is straight at 0.665 m. But its middle is hidden behind the solid end torso, so it reads short. Draw the hidden part of the start arm as a dashed outline over the end torso. pull_up and hanging_leg_raise redraw hidden parts this way (13.4, close_grip's dashed handle). Pinned c1 (arms straight at the start) stays.

**resistance_band_row R7: no allowed fix in scale or floor.**
- The scale stays pinned by Q-R2-3 and the floor by D-LIB8-floor. A seated floor figure has no tall equipment, and at 186 px/m the plate's width is the limit (13.4 Q-R2-3).
- The recheck scores it beside floor-level approved plates as well as seated_cable_row. Use pilot A's panel-approved plank and mountain_climbers (#109 @ `e6f39ff`, D-CRITIC-CAL2), rendered at the same size.
- If R7 fails again, that is the plate's second failed round. LIB-9a stops on it and reports, and the supervisor rules.

**chest_supported_row R4, second half:** accepted as drawn above. The recheck decides.

**Next:**
- LIB-9a makes the inverted_row R3 dashed-arm fix and adds the DESIGN.md records.
- It renders plank and mountain_climbers @ `e6f39ff` into the recheck reference set.
- It pushes, as a supervisor-asked milestone under the 2-hour rule, and posts "LB1 RECHECK READY @ <sha>".
- The supervisor then runs the calibrated recheck under 13.5's rule, on chest_supported_row, close_grip_pulldown, underhand_lat_pulldown, inverted_row and resistance_band_row.

### 13.7 LB1 recheck (round 3) ruled (D-LIB9a-R3, 2026-10-18 ~13:00 UTC; #245 @ `17e3e98`)

**What ran.** A calibrated recheck under 13.5's rule, with 3 fresh Opus critics on 9 plates.
- The 5 plates: chest_supported_row, close_grip_pulldown, underhand_lat_pulldown, inverted_row and resistance_band_row.
- Hidden anchors: lat_pulldown and pull_up.
- Plants, rebuilt on `17e3e98`, both passing all 10 hard checks:
  - inverted_row's Mistake drawn as hips up (R5);
  - underhand's 'Elbows down, back' leader moved to the shoulder (R4, box at top 120).
- The references add pilot A's plank and mountain_climbers. The brief adds 13.6's segment-length rule.
- The supervisor rebuilt the plates page at `17e3e98` and got LIB-9a's sha256 `ed3b344c…`.

**Calibration: VALID.**
- Both plants were caught on their target items: inverted_row plant R5 [2, 1, 1]; underhand plant R4 [3, 3, 2].
- pull_up scored 4 or more on every item.
- lat_pulldown first scored R5 [3, 2, 2], and every other item 5. The cause was the supervisor's input error: its facts.json carried the research card's Mistake ("behind the neck") instead of golden B's "Lean and heave" (vendor lat_pulldown.mjs:19, :70, :164-165). That broke 13.5's "anchors are scored on their golden-B facts".
  - With only that field corrected, the same 3 critics re-scored P04 alone: 5 on every item.
  - Every other plate's entry stayed byte-identical. The pre-correction files are kept.
- Rule from now on: the supervisor diffs every anchor's facts.json against its vendor spec's mistake and tells before a round starts.

**Result:**
- Pass on every scored item: chest_supported_row, close_grip_pulldown, inverted_row and resistance_band_row. Under the floor-level references, band row R7 passes, so Q-R2-3's scale holds.
- underhand_lat_pulldown: R5 [3, 4, 3]. Its Mistake's low bar and arm are drawn under the solid forearm, so "Pulled too low" does not read. This is a new row; rounds 1 and 2 did not flag it. Since this is the plate's second failed round, LIB-9a stops on it and the supervisor rules:
  - One targeted fix: draw the Mistake's low bar and arm as red dashed lines above the solid figure, keeping the segment lengths. The critics' own fix checks out at 84.5 and 88.1 px against the drawn 84 and 88. The arrow ends on the low bar.
  - Then a single-plate calibrated recheck, with 2 anchors and 2 plants. A third failure goes to the supervisor, who rules again and does not loosen anything.
- The LB1 plates now passing the calibrated critic (R1-R7 and R10; R8 and R9 stay unscored, 13.1): chin_up, hanging_knee_raise, assisted_pull_up, inverted_row, close_grip_pulldown, single_arm_lat_pulldown, straight_arm_pulldown, chest_supported_row, resistance_band_row, incline_machine_press and shoulder_press. That is 11. underhand is open. horizontal_leg_press and leg_press_calf_raise stay held (13.3/13.4).

### 13.8 Underhand single-plate recheck (round 4) (D-LIB9a-R4, 2026-10-18 ~13:35 UTC; #245 @ `38b436d`)

**What ran.** 3 fresh Opus critics on 5 plates.
- The target: underhand_lat_pulldown @ `38b436d`. The supervisor rebuilt its page and got LIB-9a's sha256 `9b683745…`.
- The hidden anchors: lat_pulldown and pull_up. Their facts.json now carries golden B's own Mistake text (vendor lat_pulldown.mjs:70, :164-165; pull_up.mjs:112-120), per 13.7's rule.
- The plants:
  - inverted_row's Mistake drawn as hips up (R5);
  - underhand's 'Elbows down, back' leader on the shoulder (R4), rebuilt on `38b436d` and passing all 10 hard checks.

**Calibration: VALID.**
- Both anchors scored 4 or more on every item.
- Both plants were caught on their target items: inverted_row R5 [2, 2, 1], and the underhand plant R4 [2, 3, 2].

**Result: underhand_lat_pulldown passes every scored item.** All 12 drawn LB1 plates now pass the calibrated critic (R1-R7 and R10; R8 and R9 stay unscored, 13.1). Card Do 8's critic gate is met for LB1.
- horizontal_leg_press and leg_press_calf_raise stay held.
- LP check (#259, `claude/libht-research-lp` @ `dd54051e`, verify/lp-check.md):
  - horizontal_leg_press has no sourced number for the top knee angle;
  - the calf raise has a study-group range of -25° to +25° (kassiano2023, abstract), not a cue, and Yessis keeps 30-45° and "limit ROM".
- So both go to the owner as a design option (D-LIB8-shrug). The supervisor prepares the option images.

## 14. LIB-5 design-note rulings (D-LIB5-NOTE, 2026-10-17 ~23:xx UTC; #244 @ ee7f40f)

A 3-lens review read the note. A judge ruled each open point, and one adversarial verifier checked each ruling. Where the verifier corrected a ruling, the corrected text is the ruling. It is changed here only where it clashed with sections 12 and 13 or with another item, and each ruling says in one line what changed. An earlier re-check of the LIB-5 card found 23 defects. Their fixes are merged into the card amendments below.

Heads checked: main `2d1bbf3` (LIB-2b and GATE-SPLIT on main); #244 `ee7f40f`; LIB-4a #233 `aaff25e` (only COACHING-DECISIONS.md changed since `1746fd5`, so the write-ids and synthetic lines cited below hold); LIB-4b #232 `f1df4a7`; LIB-4c `claude/lib-4c-library-ci` `108eb5c`; LIB-9a #245 `6285b4f`; LIB-6 #181 `9b8f76e`; LIB-7 #193 `55e91e9`; LIB-12 #191 `0d268a7`; research `9dbc7e0`; `claude/libht-research-the8` `e6381fa` (unverified; never a source on its own); this file before section 14 `778e15b`.

Precedence: where this section and the LIB-5 card or section 12 differ, this section wins. Section 13 Q1 (topFault) and Q3 (tempo) bind, and every ruling below agrees with them. LIB-5 appends each D-LIB5-* id it builds to COACHING-DECISIONS.md in Do 8, and D-LIB5-RISKSTEST together with D-LIB5-BACKBOX in Do 9.

### Verdict

The note needs revision. Six findings block it:
1. The shared-module design (g) cannot pass S6 and S7 together on `9dbc7e0`: about 36 shown-field misses were verified (D-LIB5-SPLIT).
2. The gen/content.mjs edits rewrite reserved generated files: the 8's, archetypes.ts and ids.ts (D-LIB5-GATE).
3. The library layers page is a back-box placement outside the 30-word reach (D-LIB5-PAGE).
4. The 450-word total does not count the back box (D-LIB5-WORDS).
5. The '.git or ROOT' scratch-stamp refusal blocks B5 (D-LIB5-SCRATCH).
6. The bundle check scans dist/, but vite writes www/ (vite.config.ts:18) (D-LIB5-BUNDLE).
Two premises are also out of date: tempo (section 13 Q3 gives the 8's tempo to LIB-5) and topFault (section 13 Q1).

What the builder does next (still Do 1: reading and writing only, no lane slot):
1. Merge the newest origin/main (`72c94fc` at writing) with a merge commit. Since `2d1bbf3`, main changed only BUG-41's files, the handover, gate-times.json, gate-split.test.ts and screenshot-gate.mjs, so every line cited here on `2d1bbf3` still names the same code. Re-read the heads above.
2. Revise docs/howto/library/LIB-5-DESIGN.md under this section. Replace each OPEN point with its ruling id. Apply Note fixes N1-N16. Quote every old and new line the rulings name, with the head sha.
3. Section k: write the 8's tempo map (D-LIB5-TEMPO8) and the per-id TOPFAULT inputs (D-LIB5-TOPFAULT) on the research head the supervisor names. If no head is named when you re-post, say so. The map then follows as one addendum comment once the head is named (reading and writing only, no slot, no push).
4. Push once. CI manners: GATE-SPLIT's train has merged, so only the limit of one push per 2 hours applies. Post the revised note as one PR comment. You are then WAITING.

No code, build, test or lint run happens before the supervisor rules the revised note and sends "LIB-5 resume" (Stops 1, unchanged).

Still waiting after the resume:
- Do 2: the named research head (after tonight's LR-29 merge).
- Do 3 b: the TOPFAULT comment, the tempo-map ruling, then 'CARD FIELDS VERIFIED'.
- Do 4: CURL, ROPE and PALM_FLAT wait for the fault-key edits (D-LIB5-FAULTKEYS). Every module with a lint hit waits for reworded research (D-LIB5-SPLIT).
- Do 6: the 'stamps (O5)' ruling and the supervisor's approval of the entries.
- Do 9: the owner's back-box answer. He has not answered, so route (b) is likely.
- Generator enforcement of the variant line: the field card (D-LIB5-VARIANT).
- The back box on the layers page: LIB-6-PM, after LIB-5 is on main (D-LIB5-PAGE).

### Card amendments

Line numbers are the card's (msg/final-LIB-5.txt = docs/supervisor/verify/lib-5-card.md). Sources are in brackets.

1. [facts; N16] base (:32-35).
   Old: "base: origin/main @ 49a2853, plus a merge commit of origin/claude/lib-2b-library-rows @ ccf0250 (LIB-2b #234: HANDCSS fix in progress, then a delta review)." and its bullet "- When LIB-2b posts its final passed head, merge that head. Once LIB-2b is on main, merge main instead." and the bullet "  - after the GATE-SPLIT train merges (main is frozen at 49a2853 until then, about 22:00 UTC, an estimate);"
   New: "base: origin/main @ 2d1bbf3 (LIB-2b #234 and the GATE-SPLIT train are on main), merged in with a merge commit before the revised note is pushed." The two old bullets are removed. The other merge points stay.
2. [NEW-1] build_prerequisites (:45).
   Old: "- Code under tools/plates/gen/** is written only on LIB-2b's final passed head, merged in."
   New: "- Under tools/plates/gen/** LIB-5 writes one new file, tools/plates/gen/library-gate.mjs (D-LIB5-GATE), on a head that contains main 2d1bbf3. No other gen/ file is edited."
3. [NEW-7 (5); OPEN-4 (3)] build_prerequisites (:46).
   Old: "That is the head after research wave 2 merges, or 9dbc7e0 if wave 2 has not merged by then. In that case you re-copy and re-pin once when it merges."
   New: "That is the head where research wave 2 and the 8's cards merge into claude/libht-research after tonight's LR-29 verify, or 9dbc7e0 if they have not merged by then. In that case you re-copy and re-pin once when they merge. One more re-copy is allowed, for the modules that wait on research (D-LIB5-FAULTKEYS, D-LIB5-SPLIT), from the one research head the supervisor names for both. Each re-copy re-pins S1 and re-runs S2, S6 and S7."
4. [OPEN-3; NEW-4; CT-3; F2; L5-2] build_prerequisites (:47).
   Old: "Do 3 b also waits for a supervisor PR comment that rules the note's source list for the 8 (Do 1 k) and names the head that holds their verified claims and quotes."
   New: "Do 3 b also waits for a supervisor PR comment that rules the note's source list, the 8's tempo map and the plateFacts form table (Do 1 k; D-LIB5-TEMPO8) and names the head that holds their verified claims and quotes. Commit 1 also waits for the supervisor's 'TOPFAULT @ <named research sha>' comment (D-LIB5-TOPFAULT)."
5. [ITEM-8] build_prerequisites (:48).
   Old: "- Do 6 waits for the posted "stamps (O5)" wording ruling (lib4-cards.md 11.1 item 7), which sets approvedBy."
   New: "- Do 6 waits for the posted "stamps (O5)" wording ruling (lib4-cards.md 11.1 item 7), which sets approvedBy. Its commit lands only after the supervisor's approval comment on the 8's entries (D-LIB5-STAMPS)."
6. [CT-6; F6; L5-6; OPEN-3; NEW-4] merge_prerequisites (:60) and Do 3 b (:231).
   Old (:60): "on the 8's machine cards, at a sha whose 8 card files equal the merge head's"
   New: "on each of the 8's machine cards that stays in this PR, at a sha whose card files for those ids equal the merge head's"
   Old (both :60 and :231): "If the 8's verified research is not on a named head by LIB-5's merge slot, Do 3 b leaves this PR: it lands after LIB-5 in its own PR from claude/lib-5-cards-8 (based on main), with its own fresh Opus review, and the 8's exemptions stay until then (D-LIB5-CARDS8)."
   New: "Do 3 b leaves this PR for each of the 8 that, at LIB-5's merge slot, lacks any of these: verified research on a named head; its TOPFAULT answer; the ruled tempo map; a 'CARD FIELDS VERIFIED @ <sha>' at a sha whose card files for that id equal this head's. If that id's files are already pushed, one new commit before READY removes its card and quotes files and their library-cards8.test.ts pins. Never rebase, amend or force-push. The validator and the CARD-V2 'Machine fields' section stay. Commit 2 never covers such an id, so its approved.mjs lines and exemptions stay as on main. Those ids land after LIB-5 in one PR from claude/lib-5-cards-8 (based on main), with its own fresh Opus review and S12. Their exemptions stay until then (D-LIB5-CARDS8). An id that stops under risk_and_recovery (a miss, 'none', 'several', drawable false) is not a fallback id. It keeps both exemptions until the supervisor rules."
7. [NEW-6; NEW-1 (4)] merge_prerequisites (:61).
   Old: "- The scratch-stamp lines applied to every fixture builder on main (Do 7)."
   New: "- The three D-LIB5-SCRATCH lines (one import, two calls) in every fixture builder on main that runs the generator (Do 7): LIB-2b's stageTree() and pinTree(), and, once on main, LIB-4b's stage() and pin(). LIB-4a's scale/write-ids.mjs gets none. LIB-4c's ci/scratch.mjs gets none if it builds through stage() and pin()."
8. [NEW-2] merge_prerequisites: add after :61.
   New: "- LIB-5's reviewed final head merges in one train with the supervisor's add-only check-bundle step in build-apk.yml's source-gate job (D-LIB5-BUNDLE). The full run on the train head is S4-P's bundle evidence."
9. [CT-7; F5; L5-5; L5-10] merge_prerequisites route (b) (:64).
   Old: "Do 9 then lands in its own PR from claude/lib-5-back-box (based on main), with its own fresh review."
   New: "Do 9 then lands in its own PR from claude/lib-5-back-box (based on main), with its own fresh Opus review."
   Old: "Under option 1 (50 words), that PR is built only after the cap card has merged, under the limit that card records; LIB-5 never makes that change."
   New: "Under option 1 (50 words), route (b) applies whether or not the cap card has merged by LIB-5's merge slot. LIB-5 merges with the placeholder, and the claude/lib-5-back-box PR is built only after the cap card has merged, under Stops 3's one exception. LIB-5 never makes the cap change."
   This amends section 12 item 12 (b), which covered only a cap card that had not merged.
10. [OPEN-1; OPEN-2; NEW-9; NEW-2] Stops 2 (:20).
    Old: "The box item (Do 9: box text, RiskJoint 'back', the Risks map entry, the ht9 twin line, S4, S5) is blocked until then."
    New: "The box item (Do 9: box text, RiskJoint 'back', the Risks map entry, the two sections-risks.test.ts lines (D-LIB5-RISKSTEST), the ht9 twin's entry and FLAG lines (D-LIB5-TWIN), the count lines (D-LIB5-COUNTS), check-bundle's Do 9 rule (D-LIB5-BUNDLE), S4, S5 and S5-L) is blocked until then."
11. [F5; L5-5; CT-7] Stops 3: append after "The wordCap and words fields in shared/back-pain-box.json are data, never a limit."
    New: "One exception applies only under option 1, only in the claude/lib-5-back-box PR and only after the cap card has merged. Wherever this card holds the back box to 30 words (Do 9's first bullet, S4, S5-L and the D-LIB5-REACH differential), the back box is held to the cap card's named back-box limit, imported unchanged from where that card puts it. This card never writes, copies or edits that limit. In the D-LIB5-REACH differential and D-LIB5-REACH 3's checkC7 run on the back box: if the cap card gives c7 the named limit for 'back', both run unchanged; if it does not, for the back box only they leave out c7's 'C7: redFlag' word-count line and compare the lint's count with the imported named limit instead, and every other c7 and C19 line is still compared. S4's equality test then shows three things: c7's LIMITS.redFlagBoxWords is still 30, golden B's RED_FLAG_BOX_MAX_WORDS is still 30, and the lint reads the back-box limit only by importing it from where the cap card puts it, with no literal copy under lint/** (S7, next sentence), shown to bite by the limit + 1 mutation below. S7's 30-assert leaves out only that one imported limit, and its '50 added under lint/**' mutation stays red. Two added mutations, each red: the back box at the named limit + 1 words; another box at 31 words. Everything else stays as written: every other box, every other rule (today, doctor, contacts, sentence cap, BANNED, the 450-word total) and LIB-5's own PR."
12. [NEW-1] shared-file owners (:68).
    Old: "- tools/plates/gen/content.mjs and gen/ids.mjs belong to LIB-2b until it merges. Edit only the lines the design note names."
    New: "- tools/plates/gen/content.mjs, gen/ids.mjs, tools/plates/generate.mjs and tools/plates/lib/**: read only (D-LIB5-GATE). The gate is the new tools/plates/gen/library-gate.mjs."
13. [NEW-9] shared-file owners (:72).
    Old: "- tests/howto/library-core.test.ts (LIB-2, LIB-2b): you may change only the exact count line of the 'generator writes N files' test (:242 on ccf0250, now 60), and only if the note adds a generated module."
    New: "- tests/howto/library-core.test.ts (LIB-2, LIB-2b), tests/howto/library-rows.test.ts (LIB-2b) and tests/howto/library-ci.test.ts (LIB-4c; only once LIB-4c is on main and merged in): in Do 9 only, exactly the lines D-LIB5-COUNTS quotes. Find each by its text. Each stays an exact equality."
14. [NEW-6; NEW-1 (4)] shared-file owners (:74-78).
    Old: "- Once each of these files is on main, add one scratch-stamp call to it and list it in the PR:" and its four sub-bullets.
    New: "- Once each of these files is on main, add exactly the three D-LIB5-SCRATCH lines (one import line after the file's last import, and two calls) and list them in the PR:
      - LIB-2b's tests/howto/fixtures/lib2b/fixture.mjs (on main now): `import { markScratch, writeScratchStamps } from '../../../../tools/plates/library/research/stamps.mjs';`, `markScratch(root)` just before stageTree() returns its root, and `writeScratchStamps(root, [ID])` as the last statement before pinTree() returns;
      - LIB-4b's tools/plates/library/fidelity/fixture.mjs: `import { markScratch, writeScratchStamps } from '../research/stamps.mjs';`, `markScratch(root)` as the last statement of stage(), and `writeScratchStamps(root, <the ids it pinned>)` as the last statement before pin() returns;
      - LIB-4c's tools/plates/library/ci/scratch.mjs: no edit if it builds through stage() and pin() (it does on 108eb5c, :124-126). Otherwise the same import and two calls follow its own stage and pin steps;
      - LIB-4a's tools/plates/library/scale/write-ids.mjs: no line."
15. [OPEN-1; OPEN-2; NEW-9] shared-file owners, "Do 9 only" (:79-82).
    Old: "  - LIB-4b's fidelity/twins/ht9.mjs:29: the FLAG line gains 'back' after LIB-4b merges, with B2 re-run and the twin re-pinned per D-LIB4-OPEN."
    New: "  - LIB-4b's fidelity/twins/ht9.mjs, after LIB-4b merges, both lines found by content: the esbuild entry (:26 on f1df4a7) re-exports src/howto/red-flag-back.ts, and the FLAG line (:29) gains `back: C.RED_FLAG_BACK`. B2 is re-run and B3 stays green unedited. A re-pin under D-LIB4-OPEN happens only if a pinned text changes (D-LIB5-TWIN);
      - HT-9's tests/howto/sections-risks.test.ts: the two add-only lines of D-LIB5-RISKSTEST;
      - the count lines of D-LIB5-COUNTS."
16. [CT-12; N12] read_first (:134) and Do 1 k (:212).
    Old (:134): "research.card is 'grip/research/<slug>.json', which is not in this repo"
    New: "research.card is 'grip/research/<slug>.json', which is not on main or on 9dbc7e0. Golden B's copies at docs/howto/grip-and-feel/research/<slug>.json on claude/howto-options @ 4a9fd86 are a lead only, never a citation or a value source for Do 3 b"
    Old (:212): "Checked 2026-10-17: none of the 8 has a card on claude/libht-research @ 9dbc7e0 (109 cards), their How-tos name research.card 'grip/research/<slug>.json', which is not in this repo, and qa/approved.mjs:20 sets research: null and mistakeFault: null."
    New: "Checked 2026-10-17: none of the 8 has a card on claude/libht-research @ 9dbc7e0 (109 cards). claude/libht-research-the8 @ e6381fa holds unverified cards for all 8 without the three keys, and only the head the supervisor names counts. Their How-tos name research.card 'grip/research/<slug>.json', which is not on main or 9dbc7e0 (golden B's copies on claude/howto-options are a lead only). qa/approved.mjs:20 sets research: null and mistakeFault: null."
17. [CT-1; L5-7; N16] read_first (:143-145) and design_reference (:112, :114).
    Old (:143): "- LIB-4b #232 at its newest head: fidelity/twins/ht9.mjs:29 and fidelity/fixture.mjs. It was 379cdf4 at 18:00; re-read it with `git ls-remote origin refs/pull/232/head`."
    New: "- LIB-4b #232 at its newest head (f1df4a7 at 23:00; re-read it with `git ls-remote origin refs/pull/232/head`): fidelity/twins/ht9.mjs:26-31, fidelity/fixture.mjs stage() and pin(), and fidelity/twins/pins.json."
    Old (:144): "- LIB-4a #233 @ 66f5cef: scale/write-ids.mjs and scale/synthetic.mjs."
    New: "- LIB-4a #233 @ aaff25e: scale/write-ids.mjs, scale/synthetic.mjs and tests/howto/lib-4a.test.ts."
    Old (:145): "- docs/supervisor/verify/lib4-cards.md on origin/claude/sup-lib4-cards @ eb77d98: section 2, 11.1 items 3, 7 and 17-19, and section 12."
    New: "- docs/supervisor/verify/lib4-cards.md on origin/claude/sup-lib4-cards at the commit that adds section 14 (the supervisor's #244 comment names its sha): section 2, 11.1 items 3, 7 and 17-19, section 12 (items 1-19; item 13 as amended in section 14), section 13 Q1 and Q3, and section 14. Item 13 as read at 19a6017 is superseded.
    - LIB-4c claude/lib-4c-library-ci @ 108eb5c: ci/affected.mjs, ci/scratch.mjs and tests/howto/library-ci.test.ts.
    - LIB-6 #181 @ 9b8f76e: build-layers-page.mjs and its mirrored artifact/howto-layers.mjs (:217, :221, :271-278, :301-302).
    - On main 2d1bbf3: tests/howto/sections-risks.test.ts (:10, :29-31); tests/howto/library-rows.test.ts (:34-36, :90-108, :130-162); tests/howto/no-contacts-parity.test.ts (HT4b-A6); tests/howto/checks/c19.ts (checkC19Shared :49); tools/plates/generate.mjs (:20, :83-90); tools/plates/lib/inputs.mjs (:2-3, :31); vite.config.ts:18; .github/workflows/build-apk.yml:42."
    Old (:112): "- Where the plan or content.md differs from lib4-cards.md sections 1 and 12 or from this card, those win (D-LIB4-DOCS-2)."
    New: "- Where the plan or content.md differs from lib4-cards.md sections 1, 12, 13 or 14 or from this card, those win (D-LIB4-DOCS-2). Where this card and section 14 differ, section 14 wins."
    Old (:114): "(lib4-cards.md section 12), and D-LIB3-4"
    New: "(lib4-cards.md section 12), section 13 Q1 and Q3, the D-LIB5-* rulings of section 14, and D-LIB3-4"
18. [NEW-1; NEW-2; NEW-3; NEW-6; NEW-4] write_scope, new files (:149-158).
    Old (:155): "the stamp helpers contentHashOf, stampProblems and writeScratchStamps, with signatures fixed in the design note;"
    New: "the stamp helpers contentHashOf, stampProblems, writeScratchStamps, markScratch and SCRATCH_MARKER (D-LIB5-SCRATCH), and the builder's copy of the 8's ruled tempo table (D-LIB5-TEMPO8), with signatures fixed in the design note;"
    Add: "  - tools/plates/gen/library-gate.mjs (D-LIB5-GATE);
      - tools/plates/library/shared/check-bundle.mjs (D-LIB5-BUNDLE; under shared/**);
      - under tests/howto/fixtures/lib5/**: the per-case tree helper (D-LIB5-FIXTURE), the back-flagged fixture helper (D-LIB5-PAGE), the neutral boxes and sheet (D-LIB5-WORDS, D-LIB5-REACH), the fixture hand module (D-LIB5-FAULTKEYS), the S3 fixture card and quotes (D-LIB5-FIXTURE 4) and the 9dbc7e0 draft box.now.text (D-LIB5-BUNDLE);"
19. [CT-11; F14; L5-9; CT-5] write_scope (:163).
    Old: "(:65 and :70 on main, `{ ...c, id: 'lib_chin_up', mode: 'H' }`), each gaining `research: null, mistakeFault: null` (a new plate has no card). Every assertion stays (Do 3 b commit 2);"
    New: "(:66 and :70 on main: `{ ...c, id: 'lib_chin_up', mode: 'H' }` and `{ ...c, id: 'lib_chin_up', mode: 'H', exemptions: ['F5', 'F7'] }`; :65 `const c = …` stays unchanged). Each gains `research: null, mistakeFault: null` (a new plate has no card), and only if lib_pull_up is in commit 2. If it is not, both stay as on main and the PR says why. Every assertion stays (Do 3 b commit 2);"
20. [NEW-1] write_scope (:164-165).
    Old: "  - gen/content.mjs and gen/ids.mjs (or the one refusal point the note names): the lint call, the stamp gate and the back-box refusal. The back-box output comes only in Do 9;"
    New: removed. The back-box refusal, the family refusal, the library lint and the stamp gate live in the new tools/plates/gen/library-gate.mjs (D-LIB5-GATE). Its one output, src/howto/red-flag-back.ts, comes only in Do 9.
    Old (:165): "  - library-core.test.ts and the fixture-builder lines, as under shared-file owners;"
    New: "  - the count lines and the fixture-builder lines, as under shared-file owners;"
21. [OPEN-1; OPEN-2; NEW-5; NEW-9; NEW-2] write_scope, Do 9 (:168).
    Old: "- Do 9 only: Risks.tsx, content-types.ts, the ht9 twin line, and the one src module the note names for RED_FLAG_BACK."
    New: "- Do 9 only: Risks.tsx, content-types.ts, the ht9 twin's entry and FLAG lines (D-LIB5-TWIN), the two sections-risks.test.ts lines (D-LIB5-RISKSTEST), the count lines (D-LIB5-COUNTS), check-bundle.mjs's Do 9 rule (D-LIB5-BUNDLE), and tests/howto/library-back-page.test.ts (S5-L, D-LIB5-PAGE; only when the Do 9 change merges after LIB-6-PM's back patches). Under either route, also LIB-5's own files as Do 9's steps need them: tools/plates/library/shared/back-box.mjs (the placeholder replaced; backBox() keeps its name and signature), the re-copied shared/back-pain-box.json and its S1 pin, tools/plates/gen/library-gate.mjs (extraBoxes and the red-flag-back.ts output), the lint/** trigger pins, tests/howto/library-shared.test.ts (the check-bundle block's Do 9 cases and D-LIB5-TWIN's block) and library-lint.test.ts (S4's box tests). src/howto/red-flag-back.ts is written only by library-gate.mjs."
22. [NEW-1; NEW-6; NEW-9] reserved_paths: add after :172.
    New: "- tools/plates/gen/content.mjs, gen/ids.mjs, tools/plates/generate.mjs and tools/plates/lib/** (D-LIB5-GATE).
    - tests/howto/fixtures/lib2b/fixture.mjs, library-rows.test.ts, library-ci.test.ts, sections-risks.test.ts and lib-4a.test.ts, except the D-LIB5-SCRATCH, D-LIB5-COUNTS and D-LIB5-RISKSTEST lines."
23. [NEW-7; NEW-2; OPEN-4 (5); N7] Do 2 (:215).
    Old: "   - Then run Do 1 a's chunk measurement and Do 1 h's lint dry run (the rules as the note states them; Do 5 commits them). Post both results in one PR comment with your next allowed push, naming every hit. A chunk over budget, or a hit on approved golden-B copy, follows risk_and_recovery."
    New: "   - Then run three things: Do 1 a's chunk measurement on www/assets/HowToSheet-<hash>.js; `npm run build` followed by check-bundle.mjs, with its one seeded check in the scratch worktree (D-LIB5-BUNDLE); and Do 1 h's lint dry run over the 8's copy and all 18 non-box shared cards (the rules as the note states them; Do 5 commits them). Post in one PR comment with your next allowed push: both sizes with headroom; the scanner output; every hit with its rule, card or id, field, path, kind and text; the field split for ruling (D-LIB5-SPLIT); and every claim set filed under two fault keys (D-LIB5-FAULTKEYS 5). A chunk over budget, or a hit on approved golden-B copy, follows risk_and_recovery."
24. [CT-2; L5-1; CT-3; F2; L5-2; CT-4; F1; OPEN-3; NEW-4; section 13 Q1 and Q3] Do 3 b (:219-220).
    Old: "Where the copy lacks plateFacts, tempo or topFault, add only those top-level keys per D-LIB9-CARDFIELDS. Each value names the claim whose verbatim quote states it." and "      - Never fetch a source or write a quote yourself. Never take a value from the spec, plate or engine report under test."
    New: "Where the copy lacks plateFacts, tempo or topFault, add only those top-level keys per D-LIB9-CARDFIELDS.
      - plateFacts: each fact names the claim whose verbatim quote states it. An id with a spec gets a plateFacts key only if it is non-empty and holds an angle fact that H6 checks against the spec's measure, in the form the ruled plateFacts form table gives for that id (D-LIB5-TEMPO8 2). Otherwise it gets no plateFacts key, never [], and keeps 'H6:no-card'. plateFacts and tempo go in together or not at all.
      - tempo: built only from the ruled 8-row tempo map (D-LIB5-TEMPO8) and the card's verified plate.tempo. Each s is that card's up, down or pause, or a ruled constant with its verified claim and quote. Phase names, order and move flags are labels from the ruled map. No tempo entry carries a claim key (H6 compares by JSON.stringify, qa/node.mjs:174).
      - topFault: the key the supervisor's TOPFAULT comment gives for that id, citing plate.mistake.claim (on a drawable:false card, the claim of the top fault the card names, under section 13 Q1's drawable:false case). Never read mistake.firstKey to choose it (D-LIB5-TOPFAULT; section 13 Q1).
      - Never fetch a source or write a quote yourself. Never take a number or a fault choice from the spec, plate or engine report under test. Only labels come from them, each through a ruling: the tempo map's phase names, order and move flags; the plateFacts form labels of the ruled table (kind, `joint` or `measure: true`, pose, the spec's measure.vertex); and the tell keys the blind TOPFAULT pass chose from."
25. [OPEN-3; section 13 Q1] Do 3 b commit 1 (:223).
    Old: "a fresh, blind Opus content verifier with one planted wrong number, as D-LIB9-CARDFIELDS sets for every batch."
    New: "a fresh, blind Opus content verifier with one planted wrong number, as D-LIB9-CARDFIELDS sets for every batch. It re-checks each topFault on the TOPFAULT pass's blind inputs, never firstKey. It is red if a drawable:true topFault names anything other than plate.mistake's fault, or if a drawable:false topFault equals the drawn fault (section 13 Q1's two checks; D-LIB5-TOPFAULT). When commit 1 writes no plateFacts or tempo value (every id with a spec stopped, D-LIB5-TEMPO8 6), the supervisor plants the wrong number in one numeric value of the PR's stop report (a stopped id's computed fact or tempo second, each with its claim), which the verifier checks against the quotes like a written value."
26. [CT-5] Do 3 b commit 2 (:224).
    Old: "        - Commit 2, one commit, only after that comment and only for the ids it verifies:"
    New: "        - Commit 2, one commit, only after that comment. It covers only the ids the comment verifies whose card holds every value H6 and F7 read, all verified and clean against H6 and F7: plateFacts, tempo and topFault (topFault alone for lib_dumbbell_lateral_raise, which keeps 'H6:not-engine'). A drawable:false id never qualifies: its section 13 Q1 topFault raises F7. CARDS_8 lists exactly those ids. Every other id stays out: approved.mjs keeps research: null and mistakeFault: null for it, and all its exemptions stay. A test asserts that cardResearch(id) deep-equals researchOf's projection (candidate.mjs:44-48) for each CARDS_8 id:"
27. [OPEN-4; NEW-7; NEW-5; NEW-1] Do 4 (:232-236).
    Old: "   - The generator calls it for any row whose riskFlags include 'back', so such a row throws, naming the id."
    New: "   - library-gate.mjs calls refuseBack for every shipped row whose riskFlags include 'back', so such a row throws, naming the id.
       - The module exports BACK_BOX_WAITS, backBox() and refuseBack(id, riskFlags). backBox() keeps its name and signature in Do 9, because LIB-6-PM's page patch calls it (D-LIB5-PAGE).
       - Build the placeholder and every module whose card has no shown-copy hit at once. CURL, ROPE and PALM_FLAT wait for a copied head that holds D-LIB5-FAULTKEYS's research edits. A module with a hit waits for a named research head on which its shown fields pass (D-LIB5-SPLIT). LIB-5 never rewords, trims or exempts a string."
28. [NEW-1; OPEN-5; ITEM-8; NEW-10] Do 5 (:237).
    Old: "5. Put the library lint in the generator for shipped library rows; it throws naming the id, field and rule. Add a vitest sweep over every shipped row: C1-C4, C7 plus the library rules, C8, C15, C16 and C19."
    New: "5. Put the library lint in tools/plates/gen/library-gate.mjs for every shipped library row (not the 8, which the sweep covers; D-LIB5-GATE 1). It throws naming the id, field and rule. The variant-line rule runs only in the sweep until the field card lands (D-LIB5-VARIANT). Add a vitest sweep over every shipped row: C1-C4, C7 plus the library rules, C8, C15, C16 and C19, plus checkC19Shared on every red-flag box the row shows (D-LIB5-REACH). checkC15 gets the row's own fragments object, never `{}` (D-LIB5-STAMPS)."
29. [ITEM-8] Do 6 (:238).
    Old: "6. Stamps: compute the 8's hashes, draft entries that cite the S-2 record, and post them for approval."
    New: "6. Stamps: compute the 8's hashes (D-LIB5-STAMPS). Draft entries that cite both records per role (S-2, tools/plates/layers/README.md:27-45; the compact rewrite, :52-90) and list the recorded golden-B follow-ups that name each id (HANDOVER 8.2 items 1-11 and 8.0k follow-up 12). Post them for approval. The gate, the approved entries and every fixture builder's three D-LIB5-SCRATCH lines land in one commit."
30. [NEW-6; NEW-1] Do 7 (:239).
    Old: "7. After each merge listed under base, merge main and apply the listed fixture lines. Re-run everything on that head."
    New: "7. After each merge listed under base, merge main and apply the D-LIB5-SCRATCH lines to each fixture builder now on main. Re-run everything on that head: lib-4a.test.ts unedited, and, once LIB-4c is on main, D-LIB5-GATE's affectedIds test."
31. [OPEN-1; OPEN-2; NEW-2; NEW-8; NEW-9; NEW-5; F5; N14] Do 9 (:242-249).
    Old: "at most 30 words, 'today' in now"
    New: "at most 30 words (Stops 3's option-1 exception aside), 'today' in now"
    Old: "     - replace the placeholder with RED_FLAG_BACK, equal to the card's box text;"
    New: "     - replace the placeholder: backBox() returns the RedFlagBlock whose name, now and doctor are box.name.text, box.now.text and box.doctor.text, with claim from box.boxClaim. library-gate.mjs writes it as src/howto/red-flag-back.ts (RED_FLAG_BACK);"
    Old: "     - apply the ht9 twin line after LIB-4b merges;"
    New: "     - apply the ht9 twin's entry and FLAG lines after LIB-4b merges, re-run B2 and keep B3 green (D-LIB5-TWIN);
         - add the two sections-risks.test.ts lines (D-LIB5-RISKSTEST);
         - set extraBoxes to { back: backBox() } (D-LIB5-WORDS), and switch check-bundle.mjs to its Do 9 rule (D-LIB5-BUNDLE);
         - re-pin the count lines, with the before and after run (D-LIB5-COUNTS);
         - carry S5-L if this change merges after LIB-6-PM's back patches (D-LIB5-PAGE);"
    Old: "     - append D-LIB5-BACKBOX, citing the supervisor's comment;"
    New: "     - append D-LIB5-BACKBOX and D-LIB5-RISKSTEST, citing the supervisor's comment;"
32. [NEW-3] S3 (:261).
    Old: "candidateOf on a lib5 fixture card returns them, and H6 passes with matching facts, under every per-value rule the posted D-LIB9-CARDFIELDS sets."
    New: "candidateOf on the lib5 fixture card of D-LIB5-FIXTURE (4) returns them, and H6 passes with matching facts, under every per-value rule of D-LIB9-CARDFIELDS and D-LIB5-TEMPO8. candidateOf and runQa are called directly, with no generator."
33. [NEW-2; NEW-3] S4-P (:264-268).
    Old: "appears in any file under src/** or in the built bundle."
    New: "appears in any file under src/** or in any file under www/** after `npm run build` (check-bundle.mjs; D-LIB5-BUNDLE)."
    Old: "  - a lib5 scratch row with riskFlags ['back'] makes the generator throw the module's message, naming the id;"
    New: "  - E1's row, in a per-case copy of E1's tree with 'back' added to its riskFlags, makes the generator throw exactly `lib_cable_lateral_raise: LIB-5: back box waits for owner decision 6 (plan 8 item 6)` (D-LIB5-FIXTURE);"
    Old: "the throw removed (the scratch row then generates)"
    New: "the throw removed (E1's back-flagged copy then generates); each of the three values planted in a temp folder makes check-bundle exit 1, naming that field; a folder with no HowToSheet chunk makes it exit 1"
34. [NEW-10; NEW-2] S4 (:274).
    Old: "  - there is no CONTACT_RE, SOURCE_RE, SOURCE_CS_RE or SAFETY_LINE_RE hit;"
    New: "  - there is no CONTACT_RE, SOURCE_RE, SOURCE_CS_RE or SAFETY_LINE_RE hit, and checkC19Shared({ RED_FLAG_BACK, DISCLAIMER }, 'back') returns [] (c19.ts:49);
      - the D-LIB5-REACH differential holds on the box;
      - check-bundle's Do 9 rule passes (D-LIB5-BUNDLE);"
35. [NEW-5] S5 (:281).
    Old: "  - budgets.test is unedited and green, and the HowToSheet chunk is within its existing budget."
    New: "  - budgets.test is unedited and green, and www/assets/HowToSheet-<hash>.js is within its existing budget;
      - S5-L (D-LIB5-PAGE) is green on the first head that holds both Do 9 and LIB-6-PM's back patches. Whichever change merges second carries it."
36. [NEW-7] S6 (:283).
    Old: "- S6 The shared modules equal their card fields, and their refs resolve. Mutations: one string drifted; one ref broken."
    New: "- S6 The shared modules equal their card fields, and their refs resolve. Every shown field passes golden B's lint at its ruled path and kind (D-LIB5-SPLIT). No data value reaches src/** or a generator output, and a pinned list of each module's export keys holds no data field. Mutations: one string drifted; one ref broken; one notes string written into a generated file; a data key added to an export."
37. [OPEN-4; OPEN-5; OPEN-6; ITEM-7; NEW-8; NEW-10; NEW-3] S7 (:285-289).
    Old: "  - its rules: medical-claim bans, the variant line, FIX_VERBS closed, family consistency, and RED_FLAG_ROWS per stamped id;"
    New: "  - its rules: medical-claim bans; the variant line (D-LIB5-VARIANT); FIX_VERBS closed; family consistency (rule (a) with the fixture-proven hand reader, D-LIB5-FAULTKEYS, and the inheritance refusal, D-LIB5-FAMILY); the sheet's visible total with every box (D-LIB5-WORDS); the red-flag box reach (D-LIB5-REACH); and RED_FLAG_ROWS per stamped id;"
    Old: "  - the 8 pass, exempt by name only where the supervisor rules it."
    New: "  - the 8 pass in the sweep. The only by-name exemption ruled now is VARIANT_LINE_EXEMPT = ['lib_lat_pulldown', 'lib_leg_press'], for the variant-line rule only (D-LIB5-VARIANT8). Any other is added only by a supervisor ruling under risk_and_recovery's 'A new ban hits approved golden-B copy' line that names the exact id, rule and string, matched by exact id as D-LIB5-VARIANT8 matches. E1 reuses pull-up's copy under its own id and inherits no lib_pull_up exemption, so a hit on pull-up's copy also turns E1's generator cases red: stop and report it, and the ruling says how E1 is treated."
    Old: "a scratch row containing 'treats' makes the generator throw"
    New: "E1's row with 'treats' in one copy string makes the generator throw (D-LIB5-FIXTURE); every mutation listed under D-LIB5-VARIANT, D-LIB5-VARIANT8, D-LIB5-FAULTKEYS, D-LIB5-FAMILY, D-LIB5-WORDS and D-LIB5-REACH"
38. [ITEM-8; NEW-6] S8 (:293-294).
    Old: "  - a test fails if the committed reviews.json holds a scratch entry."
    New: "  - a test fails if the committed reviews.json holds a scratch entry, or if SCRATCH_MARKER exists at ROOT or is tracked;
      - stampProblems treats a missing, unparsable or empty reviews.json as a failure for every shipped id, never as c15.ts:26's stub pass. contentHashOf equals c15's contentHash on the 8 and on E1's row, over all 9 fragments (D-LIB5-STAMPS)."
    Old: "a committed scratch entry."
    New: "a committed scratch entry; entries emptied, so the generator throws once naming each of the 8 while checkC15 returns []; every D-LIB5-SCRATCH mutation."
39. [CT-4; F1; F4; L5-4; CT-3; F2; L5-2; OPEN-3; NEW-4; CT-5; section 13 Q1] S12 (:300, :304).
    Old: "  - every value names a claim whose verbatim quote is in its quotes file, and S2's validator passes;"
    New: "  - every plateFact names a claim whose verbatim quote is in its quotes file, and S2's validator passes;
      - each id that lost 'H6:no-card' has a non-empty plateFacts that holds its measured-joint fact in the ruled form (D-LIB5-TEMPO8 2);
      - each tempo equals the array the test builds from its own copy of the ruled 8-row map and that card's plate.tempo, and no s is unmapped (D-LIB5-TEMPO8);
      - each topFault equals the TOPFAULT comment's key for that id; each wired card has plate.mistake.drawable true; each drawable:false card's topFault, where written, differs from its plate's mistake.firstKey (section 13 Q1); and no topFault is written for an id stopped for 'none', 'several' or a key check (D-LIB5-TOPFAULT);
      - when no id of the 8 lost 'H6:no-card' (the expected path, D-LIB5-TEMPO8 6), every bullet and mutation here that needs such an id runs on the S3 lib5 fixture card (D-LIB5-FIXTURE 4), in a temp copy of E1's tree, through candidateOf and runQa, with a fixture map row in the test's own copy fed to the same tempo builder as the 8's. The topFault and F7 rows run on lib_dumbbell_lateral_raise when it is in CARDS_8, and otherwise on that fixture card. The test asserts that the set of cards each row checks is non-empty, and the PR lists each stopped real id with its reason;"
    Old: "tempo deleted turns H6.tempo red; topFault set to another key raises F7;"
    New: "plateFacts set to [] on one id that lost 'H6:no-card' turns library-cards8.test.ts red; its measured-joint fact removed turns it red; one angle fact +3° turns H6 red (H6.fact); tempo deleted turns H6.tempo red; one tempo second changed turns H6.tempo red; a mapped field swapped (up for down) turns the map test red; an s with no map entry, or a constant added without a ruling, turns it red; one card's topFault deleted makes F7 block (library-qa.test.ts:60 red); topFault set to another key raises F7; a wired card's drawable set to false turns the test red; on a test copy of one card set to drawable:false with topFault equal to the drawn key, the test turns red (section 13 Q1 mutation (2));"
    Old: "the clone inputs' `research: null, mistakeFault: null` removed turns the clone test red."
    New: "the clone inputs' `research: null, mistakeFault: null` removed turns the clone test red (only when lib_pull_up is wired)."
40. [CT-2; L5-1; CT-3; F2; CT-4; CT-7; NEW-1; NEW-6; NEW-7; NEW-9; OPEN-2; OPEN-3] risk_and_recovery (:312, :314, :315, plus new lines).
    Old (:312): "Do 9 then waits for the cap card and lands under route (b)."
    New: "Do 9 then waits for the cap card and lands under route (b), under Stops 3's one exception."
    Old (:314): "- A value of the 8 has no verified quote on the named head: do not write it, and report it on the PR."
    New: "- A value of the 8 has no verified quote on the named head (and, for a tempo s, no ruled constant): do not write it, and report it on the PR. If no measured-joint fact is verified, write no plateFacts key, never []."
    Old (:315): "(outside H6's ±2° or ±1 cm, a tempo array not equal to the spec's, or a topFault not equal to the plate's Mistake key): stop and report for that id."
    New: "(outside H6's ±2° or ±1 cm, or a tempo array not equal to the spec's), or its TOPFAULT answer is 'none' or 'several', or on a drawable:true card that answer differs from the plate's mistake.firstKey, or on a drawable:false card it equals firstKey, or its card has drawable false: stop and report for that id. A drawable:false id gets section 13 Q1's topFault only when its key differs from firstKey, and is never wired here (D-LIB5-TOPFAULT)."
    Add: "- A shown shared string fails golden B's lint: report it, and research rewords it (D-LIB5-SPLIT). Never reword, trim, exempt or reclassify it.
    - A plugin cannot gate as D-LIB5-GATE rules: stop and ask for a supervisor ruling.
    - An existing test turns red on the gate commit because a gate line now comes before the message it expects: stop and report. Never edit that test or reorder another plugin.
    - A quoted count line's text differs on the merged head, or another test turns red from the new output: stop and report (D-LIB5-COUNTS).
    - B2 is not identical after the twin lines: stop and report. Never change a3Probe or FLAG (D-LIB5-TWIN).
    - A generator case throws a different message from the one it asserts: stop and report. Never loosen the assertion."
41. [NEW-1; NEW-2; NEW-5] verification (:306).
    Old: "verification: the PR body maps each S row to a test or run. Before READY, merge origin/main and run S11 on that exact head. Under route (b), S4 and S5 run in the Do 9 PR."
    New: "verification: the PR body maps each S row to a test or run. On every head sent for review and on the READY head, the PR shows D-LIB5-GATE's byte-identity diff and `generate --check`, and check-bundle's output after `npm run build`. Before READY, merge origin/main and run S11 on that exact head. Under route (b), S4, S5 and (when due) S5-L run in the Do 9 PR."
42. [OPEN-3; NEW-4; NEW-7] return (:322-330): add "- the revised note's comment id, and the TOPFAULT, tempo-map and D-LIB5-SPLIT ruling comment ids;".
43. [NEW-4 (6); OPEN-3] outcome (:91) and finish (:99). On the expected path no id of the 8 with a spec is wired (D-LIB5-TEMPO8 6).
    Old (:91): "- the 8's machine research cards (plate facts, tempo, top fault), verified, with their 'H6:no-card' and 'F7' exemptions removed, in this PR or, under the D-LIB5-CARDS8 fallback, in the claude/lib-5-cards-8 PR;"
    New: "- the 8's machine research cards (plate facts, tempo, top fault), verified, in this PR or, under the D-LIB5-CARDS8 fallback, in the claude/lib-5-cards-8 PR. Their 'H6:no-card' and 'F7' exemptions are removed for each id in CARDS_8. Each stopped id is reported on the PR with its exemptions kept until the supervisor rules (D-LIB5-TOPFAULT; D-LIB5-TEMPO8 5);"
    Old (:99): "and the 8's machine cards on main (here or by the fallback PR)."
    New: "and the 8's machine cards on main (here or by the fallback PR), with each CARDS_8 id wired and each stopped id reported. An empty CARDS_8 still finishes, with S12 run on the fixture card (card amendment 39)."
44. [section 14 'What the builder does next' 3-4; D-LIB5-TEMPO8 2] Stops 1 (:13).
    Old: "apart from the one push and the comment that post the note after 'E8 done'."
    New: "apart from the one push and the comment that post the note after 'E8 done', and, under lib4-cards.md section 14, the one push and comment that post the revised note and the one tempo-map addendum comment (D-LIB5-TEMPO8 2)."
45. [CT-6; F6; L5-6; OPEN-3; NEW-4; N12] S12 (:301).
    Old: "names a sha whose 8 card files equal the head's;"
    New: "names a sha whose card files for each id in this PR equal the head's;"
46. [NEW-7 (5); OPEN-4 (3)] risk_and_recovery (:317).
    Old: "- The research head changes after Do 2 (wave 2): re-copy once, re-pin S1, and re-run S2 and S6."
    New: "- The research head changes after Do 2 (wave 2, then the one D-LIB5-FAULTKEYS/D-LIB5-SPLIT head): re-copy only as build_prerequisites allows, and on each re-copy re-pin S1 and re-run S2, S6 and S7."
47. [supervisor check: `git diff ccf0250 72c94fc` is empty over the four files] read_first (:138).
    Old: "- On LIB-2b @ ccf0250:"
    New: "- On main @ 72c94fc (LIB-2b merged; these four files are byte-equal to ccf0250):"
48. [NEW-5; card amendment 41] Do 9 (:250).
    Old: "- run S4, S5 and S11."
    New: "- run S4, S5, S5-L when due (D-LIB5-PAGE), and S11."

### Rulings

#### OPEN-1 (D-LIB5-RISKSTEST)
**Ruling.** Allowed in Do 9 only: in LIB-5's PR under route (a), or in the claude/lib-5-back-box PR under route (b). tests/howto/sections-risks.test.ts is HT-9's file. HT-9 is merged, the blob e44250bb is the same on main and on every open head that has the file (#181 @ 9b8f76e lacks it, because it predates HT-9), and no open card touches it. Find the lines by content on the merged head. The file gains exactly two new lines, and no existing line changes:
1. `import { RED_FLAG_BACK } from '@/howto/red-flag-back';` directly after the `@/howto/archetypes` import (:10 on 2d1bbf3).
2. `  back: RED_FLAG_BACK,` as a new line inside FLAG, after the `wrist: …, elbow: RED_FLAG_ELBOW,` line (:30) and before `};` (:31).

Evidence:
- Mutation: removing the import or the back line turns `npm run typecheck` red. List it next to S5.
- HT9-A3 stays unedited and green on the 8. None of them has 'back'.
- S5's renderRisks test proves the back block on the fixture. HT9-A3 reads only src/howto/generated/ht-*.ts (:26-27). It first checks a back block when a shipped back-flagged row exists (LB1/LIB-9).

**Why.** tsconfig includes tests, and FLAG is `Readonly<Record<RiskJoint, …>>` (:29). With RiskJoint 'back', typecheck fails without the entry. Risks.tsx:17 and this :29 are the only typed joint maps on every head. A Partial, a cast or dropping the file from typecheck would weaken the test.
**Why nothing is loosened.** The map gains the one entry its type needs, and every assertion stays. HT9-A3 covers back rows later with no edit.
**Changed:** recorded in this section 14 (the corrected text said section 12). The blob sha is e44250bb (`git rev-parse <head>:tests/howto/sections-risks.test.ts`); the cited a953c81 is not an object.

#### OPEN-2 (D-LIB5-TWIN)
**Ruling.** Allowed after LIB-4b merges. In fidelity/twins/ht9.mjs, find both lines by content on the merged head:
- The esbuild entry (:26 on f1df4a7) gains `export * from` src/howto/red-flag-back.ts, after the archetypes.ts re-export.
- FLAG (:29) gains `back: C.RED_FLAG_BACK`.
Nothing else in ht9.mjs changes, and a3Probe stays unexported. The gate's HT-9 block is untouched.

Pins: pins.json pins only the gate:HT-* texts and the harness, ht10 and goldenB functions. ht9.mjs is not pinned, so pins.json stays unedited and B3 must be green as is. The PR says why no re-pin was made. If a pinned text changes after all, re-run B2 and re-pin that key under D-LIB4-OPEN in the same PR.

Evidence:
- (1) B2 as LIB-4b defines it (`--ids golden8`, container and CI dispatch), on the merged head. Rows and max px must be identical to the run before the edit: the back lines join every id's A3 set with 0 owners. If they differ, stop and report. Never change a3Probe or FLAG.
- (2) A test in library-shared.test.ts, added in Do 9 with the twin lines, reads ht9.mjs as text. It asserts that FLAG's keys equal the RiskJoint members in content-types.ts and the keys of Risks.tsx's FLAG, and that the entry re-exports src/howto/red-flag-back.ts.
- Mutations: `back` dropped from FLAG turns (2) red. The re-export dropped turns (2) red, and B2 red on every id with `HT9/crashed@*`.

LIB-5 runs no back-flagged row through the twin. Golden B's page cannot render a back box yet: howto-layers.mjs:271 has 4 joints and :278 throws. D-LIB5-PAGE gives that gap to LIB-6-PM. The first PR that ships a back-linked row runs the twin on it.
**Why.** C.RED_FLAG_BACK is undefined unless the entry re-exports the module. archetypes.ts cannot carry it: HT5-A5 (content-gen.test.ts:207) keeps that file equal to golden B.
**Why nothing is loosened.** The twin only gets stricter. B2 on the 8, B3 and every pinned text are unchanged.
**Changed:** the open gap ("the supervisor assigns it to a card") is now settled by D-LIB5-PAGE.

#### OPEN-3 (D-LIB5-TOPFAULT)
**Ruling.**
- Commit 1 waits for one supervisor comment on #244, 'TOPFAULT @ <named research sha>'. It holds one answer per id from a fresh, blind Opus selection pass, run once per id.
- The pass gets only these inputs per id:
  - the card's plate.mistake.what, its claim id(s) and their verbatim quote(s);
  - the approved plate's Mistake tells (key and cue text), shuffled, with no selected marker and no firstKey.
- It answers with one key, 'none' (no tell names the card's fault) or 'several: <keys>'.
- An id whose plate.mistake.drawable is false gets the same pass under section 13 Q1's drawable:false case (CARD-V2 :36; the plan 3.3 F7 drawable-fault rule). In place of plate.mistake.what, its input is the top fault the card itself names in mistake.why or handlingMistakes, with its claim id(s) and verbatim quote(s), plus the same shuffled tells.
- The answers are posted before anyone compares them with firstKey. A pass is re-run for an id only when its plate.mistake or quotes change on a newly named head, never because of its answer.
- LIB-5 writes the posted key as topFault, citing plate.mistake.claim (on a drawable:false card, the claim of the top fault the card names). It never reads mistake.firstKey to choose it.
- The CARD FIELDS verifier re-checks each topFault on the same blind inputs, never firstKey. It gets section 13 Q1's two checks: it is red if a drawable:true topFault names anything other than plate.mistake's fault, or if a drawable:false topFault equals the drawn fault. Its planted error stays one wrong number (item 9; card amendment 25 says where it goes when no number is written).
- An id stops if any of these holds: its answer is 'none' or 'several'; on a drawable:true card, its key differs from its plate's mistake.firstKey; on a drawable:false card, its key equals firstKey (the card names the drawn fault while saying it cannot be drawn: a research question). A stopped id gets no topFault. A drawable:false id answered 'none' has no key for its top fault among the plate's tells; a new key needs a supervisor ruling, and LIB-5 never coins one.
- A drawable:false id whose key differs from firstKey gets that key as topFault (Q1's drawable:false case). Its F7 then stays raised, as plan 3.3 keeps it for the owner's yes.
- Every stopped id and every drawable:false id stays out of CARDS_8, keeps 'H6:no-card' and 'F7', and is reported on the PR. Wiring a drawable:false id needs a supervisor ruling with a COACHING-DECISIONS entry that changes its F7 reason (D-LIB3-4) and the owner's yes. That is not in LIB-5's scope.
- library-cards8.test.ts asserts that each wired card has drawable true and a topFault equal to its TOPFAULT key, and that each drawable:false card's topFault, where written, equals its TOPFAULT key and differs from its plate's mistake.firstKey. Mutations, each red: a wired card's drawable set to false; Q1's mutation (2), a test copy of one card set to drawable:false with topFault equal to the drawn key.
- LIB-5 appends D-LIB5-TOPFAULT in Do 8, citing the TOPFAULT comment.

**Why.**
- Research cards carry no fault key: plate.mistake is {what, why, claim, drawable} (CARD-V2 :34-36).
- Key strings exist only in the 8's spec tells and the plates built from them (pull_up.mjs:118; golden.mjs:126-130), and both are under test.
- So the plate supplies only the spellings, and the choice must come from research, made blind. This matches section 13 Q1's "never from the spec".
- Copying firstKey would make F7 pass by construction. golden.mjs:126 puts the selected tell first, so the list is shuffled.
- A forced single answer, or a re-run after a miss, could match firstKey by chance. So 'several' stops the id, and no answer is re-drawn.
- On e6381fa (unverified), leg_press has drawable false, and its mistake.what describes the drawn 'lift' tell. A pass on 'what' alone would clear the F7 that plan 3.3 keeps raised for the owner. So a drawable:false pass reads the fault the card names as its top fault, and Q1's check turns a key equal to the drawn one red.
**Why nothing is loosened.** F7 (node.mjs:293) and its equality are unchanged, and S12's 'another key raises F7' mutation stays. A stopped id keeps every exemption, and no drawable-fault F7 is cleared. The pass, its stop answers, the no-re-run rule and the verifier's blind re-check are all added checks.
**Changed:** the corrected text gave drawable:false ids no pass, put their case out of LIB-5's scope and had the verifier fail any topFault on a drawable:false card, which section 13 Q1 does not say. Q1's rule "goes into D-LIB9-CARDFIELDS ... for LIB-5's 8", so its two cases and its two verifier checks now apply as written, with its mutation (2) and the drawable mutation; a drawable:false id is still never wired here. This supersedes card defects CT-2 and L5-1. Their "firstKey where the verifier confirms" is weaker, because that verifier would see the selected tell.

#### OPEN-4 (D-LIB5-FAULTKEYS)
**Ruling.**
1. Research changes exactly these fields at the source, and nothing else:
   - shared/curl.json:
     - fault key `wrist-curl-cheat` becomes `curled`; the label 'Wrist curled' is unchanged;
     - `bent-back-bottom` becomes `bent-back`; the label 'Wrist bent back' is unchanged;
     - gaps[2] (:209 on 9dbc7e0), one exact replacement of the whole string. Old: "The fault names wrist-curl-cheat and bent-back-bottom come from GA; the sources name the wrong positions (flexion, extension, a forced bend at the bottom), not a cheating motion. The labels describe positions only." New: "The fault keys curled and bent-back are LIB-7's (hands/radial-rules.mjs), which replace GA's wrist-curl-cheat and bent-back-bottom; the labels are D-LIB7-10's. The sources name the wrong positions (flexion, extension, a forced bend at the bottom), not a cheating motion. The labels describe positions only."
   - shared/rope-rule.json: `rope-wrist-curl` becomes `curled`, and its label 'Wrists curl' becomes 'Wrist curled'.
   - shared/palm-flat.json: `hand-ahead` keeps its key, and its label 'Hands too far forward' becomes 'Hand ahead'.

   These are exact edits, each old and new string quoted above (keys, labels and the whole gaps[2] string), so the Sonnet W2B session may make them under section 12 item 14: the exact text, the exact claim and card lists, and a stop on any mismatch. A fresh Opus content critic (card and quotes only) checks each changed label and the new gaps[2] string against its claims inside tonight's LR-29 verify. The supervisor's 10 % re-fetch is unchanged.

   Evidence: each fault has the same claim refs and side as LIB-7 radial-rules.mjs:20 and :22 and hand-rope.mjs:22 (curl#c3,#c4; curl#c3-#c5; rope-rule#c6), and LIB-12 hand-palm-flat.mjs:20 (PF#c3). D-LIB7-10 already names rope-rule's 'Wrists curl' as the same fault. No quote or claim text changes.
2. LIB-7 and LIB-12 change nothing. Their pins stay byte-identical, including LIB-7's critic-approval pin over id/fault (hand-pairs.test.ts 'critic fixes (10-03)'; D-LIB9-HANDPAGE). No alias table and no exemption is added. LIB-5 never retypes a string.
3. Timing:
   - Do 2 copies the head the card names.
   - At Do 4, CURL, ROPE and PALM_FLAT are built only from a copied head that holds point 1. The other modules go ahead.
   - If the head copied at Do 4 lacks point 1, LIB-5 builds those three exports no further and reports. The supervisor routes the research fix.
   - There is no reverse route (LIB-7/12 taking the card keys): it would change LIB-7's critic-approval pin, split D-LIB7-10's one key per fault across the curl, ez, push, rope and d-handle variants, and it cannot fix a 4-word label.
4. Family check (one label per fault.key):
   - It reads three sources: the 8's handling.faults; the faults in LIB-5's shared modules; and every tools/plates/library/hands/hand-*.mjs present. For the last, it imports each module and reads VARIANTS[*].faults, an object keyed by fault key, as on #193 @ 55e91e9 and #191 @ 0d268a7. The curl and rope labels come in through radial-rules.mjs.
   - It prints the compared count per source and asserts three things: the 8's count is above 0; the shared modules' count is above 0; the hands count equals the fault entries the imported modules export, and is above 0 whenever any module it finds exports a fault.
   - No hand-*.mjs is on LIB-5's head, because LIB-7/12 merge after LIB-5 (D-LIB5-ORDER). So a fixture hand module in LIB-7's shape under tests/howto/fixtures/lib5/** proves the reader, with a known fault count.
   - Mutations, each red: the fixture's hand-ahead labelled 'Hands forward'; the reader returning 0 faults on the fixture.
5. Do 2's dry run lists every claim set filed under two keys. Palm-flat c3, under both hand-ahead and hands-rotated, will show. This is a report for the supervisor, not a rule.
6. D-LIB5-FAULTKEYS records that GA 3.1 and 3.1.1's key names (wrist-curl-cheat, bent-back-bottom, rope-wrist-curl) are superseded by LIB-7's.
**Why.** content.md 4 (:273) and plan 4.4 make family consistency key-based. Two keys for one fault backed by the same claims would let the labels drift with every check green. LABEL_MAX_WORDS (copy-lint.mjs:54) and c7 labelMaxWords are both 3, and 'Hands too far forward' is 4 words.
**Why nothing is loosened.** Family consistency, LABEL_MAX_WORDS, c7 and every LIB-7/12 pin stay as written, with no exemption and no alias table. Only the spelling at the research source changes, and a fresh critic checks it. A fixture proves the reader, so the check is not empty.
**Changed:** the corrected text named "W2B (claude-opus-5-5)". W2B runs on claude-sonnet-5 with exact edits only, so these spelled-out edits go to it under item 14, with the Opus critic in tonight's verify. gaps[2]'s new string is written here by the supervisor, because item 14 lets Sonnet make only edits whose replacement text it is given.

#### OPEN-5 (D-LIB5-VARIANT)
**Ruling.**
1. LIB-5 commits the rule as a pure function under tools/plates/library/lint/**. The note names it and fixes its signature. Each case gets a lib5 fixture, and the vitest is in library-lint.test.ts. The rule applies content.md 4's whole caption class, with copy-lint's exported pieces imported, never copied:
   - Red: equipment has '/' and the line is missing (undefined, null, or words() = 0).
   - Red: a line on a row whose equipment has no '/'.
   - Red: words(line) > CAPTION_MAX_WORDS (10).
   - Red: a hit on BANNED, OWN_RED_FLAG, CONTACT_RE, SOURCE_RE, SOURCE_CS_RE, a sourceNamePatterns name, or a library medical-claim ban. Each gets its own fixture.
   - Green: a clean line within the limit on a '/' row; no '/' and no line.
   - It returns the line's words(), so the visible total (D-LIB5-WORDS) can count it.
2. The tripwire is unconditional.
   - The Do 5 sweep calls the function for every registry shippedRows() row. It passes the row's src/data/exercises.json equipment, and takes the line from one accessor that returns undefined today.
   - Any shipped '/' row is red, naming the id, except VARIANT_LINE_EXEMPT's two ids (D-LIB5-VARIANT8).
   - The test pins the exact set of 23 exercises.json ids whose equipment has '/'.
   - Mutations, each red: injected rows with one shipped '/' row (red, naming it); lib_leg_press removed from the exemption; a third exempt id; one '/' dropped from a scratch copy of exercises.json.
3. The generator does not call this rule yet. B5's lib_underhand_lat_pulldown ('Cable / Machine', fixture.mjs:27 on #232) would throw with no field to fill. This amends plan 4.4's "runs at build" for this rule only, until the field card lands.
4. The field card. The supervisor writes it and names its owner and slot before LIB-9 READY. In its own PR it:
   - adds the shown field;
   - points the accessor at the field;
   - makes library-gate.mjs call the function for every shipped row and throw, naming the id, field and rule;
   - counts the line toward the imported VISIBLE_WORDS_MAX, in the generator and in the sweep;
   - has C7 count and scan the line (an add-only edit to c7.ts by its owner, ruled in that card).
   The sweep, its mutations and the exemption stay, and no test is deleted. The field's copy follows AGENTS.md's UI-copy rule. If the line cannot pass that rule, the supervisor asks the owner; builders never write to him.
5. Card half. LIB-5's validator (Do 3 a) is red when a card whose exercises.json equipment has '/' has a null or empty plate.variantLine, except VARIANT_LINE_EXEMPT's two ids. Mutation: variantLine set to null on a lib5 '/' fixture card turns it red. Found on 9dbc7e0: underhand_lat_pulldown's variantLine is null, and close_grip_pulldown's does not name the Machine kind. Both are LB1 ids, and the supervisor sends them to research.
6. The merge_prerequisites of LIB-9 and of every later batch card gain: "the variant-line field card is on main before any row whose exercises.json equipment has '/' ships".
   - Risk: LB1 holds close_grip_pulldown and underhand_lat_pulldown, so the field card is on LIB-9's critical path.
   - Mitigation: write the card early. Otherwise those two ids stay below 'shipped'. The rule is never weakened.
**Why.**
- content-types.ts has no variant field (HowToContent :302-330), and src is reserved until Do 9.
- 23 ids in exercises.json have '/': the 2 of the 8 plus 21 new.
- copy-lint's checkText is not exported, and copyFields and c7's visible map list their fields by name. So a new shown field is checked only if a ruling puts it in reach.
**Why nothing is loosened.**
- No existing check, cap or budget changes.
- From LIB-5's merge on, any shipped '/' row, except the two golden ids, is red on main.
- The line can never ship outside the caption class, the 450-word total or C7.
- The card half runs from LIB-5 on.
**Changed:** the generator call goes in library-gate.mjs (D-LIB5-GATE), and it is recorded here, not in section 12. The tripwire's mutation uses injected rows, not a new scratch root (D-LIB5-FIXTURE 6). The card-half exemption reads the same constant as ITEM-7; ITEM-7 says why the two agree.

#### ITEM-7 (D-LIB5-VARIANT8)
**Ruling.** Exempt exactly lib_lat_pulldown and lib_leg_press from the variant-line rule, and from nothing else. The rule has two halves: the lint's shown-line check (content.md 4, row 'Variant line') and the validator's card half (D-LIB5-VARIANT 5).
- Where it lives: one exported constant, VARIANT_LINE_EXEMPT = ['lib_lat_pulldown', 'lib_leg_press'], in a module under tools/plates/library/lint/**. The sweep, the validator and, after the field card, library-gate.mjs import that one constant. It never goes in qa/exemptions.json.
- Matching: the row's own id exactly; for a card, `lib_` plus the card id. It never matches by chromeId, LIB_OF of a copied module, a fixture's `from`, `extends` or a prefix. So B5's lib_underhand_lat_pulldown and any child of the two inherit nothing.
- Every other library rule still runs on the two ids: the medical bans, FIX_VERBS, family, the visible total and RED_FLAG_ROWS. Their cards are never edited (byte copies plus the three keys, D-LIB5-CARDS8).
- Test, in library-lint.test.ts:
  - A pure function eightWithSlash(eightIds, exercises) returns the ids among eightIds whose exercises.json equipment contains '/'.
  - eightIds come from golden.mjs LIB_OF values (tools/plates/plates.json), and the test asserts there are exactly 8. It never uses HOWTO_IDS or any list that grows.
  - It reads the committed src/data/exercises.json, read-only.
  - It asserts that VARIANT_LINE_EXEMPT, sorted, equals both the literal pair and eightWithSlash(...).
- Mutations, each red:
  - a third id added;
  - one id removed (the sweep also goes red on that id);
  - an injected exercises.json copy in which a third of the 8 gains '/';
  - an injected copy in which one of the two loses '/';
  - injected rows with '/' and no line, one of them with id lib_underhand_lat_pulldown;
  - an injected row with id lib_lat_pulldown carrying 'treats' (red under the medical ban).
  All of these are pure-function inputs, never a new generator tree (D-LIB5-FIXTURE 6).
- This does not settle B5 or LB1 rows with '/'; D-LIB5-VARIANT does.
**Why.**
- The two are approved golden-B sheets, kept byte-identical by S10. HowToContent has no field, and their golden-B copy has none.
- S7 allows by-name exemptions of the 8 only by ruling.
- The plan scopes the rule to the "21 new ids" (LIBRARY-HOWTO-ARCHITECTURE.md:78, :466, :931): 23 minus these two, checked on 49a2853 and b70ca58.
- The card half follows the same scope. lat_pulldown's plate.variantLine is null on the8 @ e6381fa, and its sheet shows no line. A card-half check there would block its machine card over a field no sheet of the 8 uses.
**Why nothing is loosened.** The rule stays whole for every library id. The exemption covers one rule and two exact ids, taken from the fixed golden-A list. The two-sided equality turns red if the list grows, shrinks or the data shifts. The card-half check is new, so no existing check narrows.
**Changed:** the corrected ITEM-7 limited the exemption to the shown-line check, while the corrected OPEN-5 (5) exempted the same two ids from the card half. I made both halves read one constant. The plan scopes the whole rule to the 21 new ids, and the alternative would block lat_pulldown's machine card.

#### ITEM-8 (D-LIB5-STAMPS)
**Ruling.** Do 6 waits for the "stamps (O5)" wording ruling and for the supervisor's approval comment on the 8's entries.
- Hash: c15's contentHash(content, plate).
  - content = loadContent(id).content.
  - plate = the whole `fragments` object of the id's latest plate entry, with 9 keys: normalSvg, normalOverlay, mistakeSvg, mistakeOverlay, tells, tempo, cues, alt, mistakeAlt. For the 8 it comes from GOLDEN.json via latestEntries. For a library row it comes from pinOf(row, 'plate', root) in the row's batch golden file.
  - scope = content.extends ?? content.id (c15.ts:28).
  - contentHashOf imports the given root's own gen/content.mjs, because loadContent has no root parameter (content.mjs:89-90). So it is async, and the synchronous writeScratchStamps reaches it through a child process (D-LIB5-SCRATCH 1). A test shows it equals c15's contentHash on the 8 and on E1's row.
  - The Do 5 sweep calls checkC15 with that same fragments object, never `{}` (content.test.ts:470).
- Gate:
  - stampProblems treats a missing, unparsable or empty reviews.json as a failure for every shipped id, never as c15's stub pass (c15.ts:26).
  - It runs in library-gate.mjs after the per-row loop (D-LIB5-GATE), never in gen/ids.mjs.
  - One commit holds the gate, the 8's approved entries, the three D-LIB5-SCRATCH lines of every fixture builder already on that head, and the lib5 cases' writeScratchStamps calls (D-LIB5-FIXTURE 3). E1's fixture.mjs is on main, and library-rows.test.ts:34-36 runs the full generator in its tree. Every test is green on that commit.
- S8 mutation added: entries emptied, so the generator throws once naming each of the 8, while checkC15 returns [] for each.
- Entries:
  - Each entry cites both records for each role: S-2 (tools/plates/layers/README.md:27-45, review line :45) and the compact rewrite (:52-90, checks :85-90). A role with no record says so.
  - `open: 0` counts only those reviews' unresolved findings.
  - `findings` also lists, by number, every recorded golden-B follow-up that names that id (HANDOVER 8.2 items 1-11 and follow-up 12 in 8.0k, numbered as on the main head merged at Do 6). Each is marked "recorded, not changed: golden B is locked (plan 2.8)".
**Why.** reviews.json is `{schema:1, entries:[]}` on main, so C15 can never fail today, and a gate that copied the stub rule would pass vacuously. content.md 3.5 names both records. E1 is on main, so a gate commit without its scratch lines is red.
**Why nothing is loosened.** C15 becomes strict as planned, and c15.ts is not edited. The gate cannot pass on an empty file. No commit is red, and no known golden-B issue is hidden by a stamp.
**Changed:** "the scratch-stamp line" became the three D-LIB5-SCRATCH lines (one import, two calls). The placement and LIB-4a questions this ruling left open are settled by D-LIB5-GATE and D-LIB5-SCRATCH.

#### NEW-1 (D-LIB5-GATE)
**Ruling.**
1. Placement.
   - The back-box refusal, the family refusal (D-LIB5-FAMILY), the library lint (D-LIB5-REACH, D-LIB5-WORDS, family rule (a)) and the stamp gate go in one new plugin, tools/plates/gen/library-gate.mjs. The note names it as "the one refusal point".
   - content.mjs, ids.mjs, generate.mjs and tools/plates/lib/** stay byte-unchanged. No gate helper goes under tools/plates/lib/, because core files are in every header.
   - Order inside outputs(): for each shipped row, refuseBack, then the family refusal, then, for a library row only (registry.mjs's rows after the 8), the lint (sheetWords included). The 8 are linted only by the Do 5 sweep (S7), as the card's Do 5 scopes the generator lint to library rows. After the loop comes stampProblems. Nothing goes in loadContent or pushHints.
2. Plugin rules.
   - `after: ['tools/plates/gen/content.mjs']`, so every existing refusal (pagesOf, QaRefused) keeps its message.
   - It never reads ctx.prev. Rows come from registry.mjs shippedRows(), content from content.mjs's exported loadContent(id), and M from sourceOf(id) (D-LIB5-WORDS). So it behaves the same when a test calls outputs() with an empty prev.
   - Before Do 9, outputs() returns []. From Do 9 it returns only src/howto/red-flag-back.ts, with its own `inputs`.
   - The plugin also exports inputsFor(path) with the same list, for HT2-A2 (generate.test.ts:85) and E2 (library-rows.test.ts:194).
   - The list holds back-box.mjs, every repo module it imports (shared/card.mjs if it uses it) and docs/research/howto/shared/back-pain-box.json. closureOf cannot be used, because it throws on back-box.mjs's file read. A test asserts that the list equals back-box.mjs's static imports plus that JSON file.
   - inputs() returns every file the plugin reads.
   - library-shared.test.ts runs checkC17 (c17.ts, unchanged) on two directories, because checkC17 takes directories and skips any path it cannot readdir (c17.ts:43-47): tools/plates/library/shared, and a temp directory holding a copy of tools/plates/gen/library-gate.mjs. It asserts [] and that each directory holds the file it is meant to scan. Mutations, each red: `fetch(` planted in the temp copy of library-gate.mjs; `fetch(` planted in a temp copy of the shared directory's back-box.mjs.
3. Evidence.
   - Committed, in library-shared.test.ts:
     - The paths render() attributes to library-gate.mjs are exactly [] while back-box.mjs holds no box text, and exactly ['src/howto/red-flag-back.ts'] once it does.
     - No other generated file's header names the plugin.
     - Mutations: the plugin returns any other path → red; it returns red-flag-back.ts while the placeholder holds → red.
   - PR evidence, never a committed pin, on every head sent for review and on the READY head:
     - `git diff --exit-code <the main sha last merged> HEAD` is empty over content.mjs, ids.mjs, generate.mjs, tools/plates/lib/** and every path render() returns, headers included;
     - `generate --check` is green;
     - after Do 9 the same holds, except for red-flag-back.ts.
     - The mutation is shown once, in a scratch worktree: one comment byte in content.mjs, then regenerate. The diff must then list the 8's ht-*.ts, ids.ts, archetypes.ts, sources.json and lib_*.json.
   - After LIB-4c merges, a test calls affectedIds on a registry with at least one shipped library row (E1's).
     - It makes one call each with changed = [library-gate.mjs], [one lint/** module], [research/stamps.mjs] and [docs/research/howto/reviews.json].
     - Each must give a reason row with ids 'all', with all: true.
     - If any case does not select every id, stop and report. LIB-4c owns affected.mjs.
4. Fixtures. The gate runs only through render(). So the scratch lines go only into builders that run the generator (D-LIB5-SCRATCH). LIB-4a's write-ids.mjs gets none: it calls ids.mjs's and handpairs.mjs's outputs() directly and never render(), and its clones have no How-to source. Evidence: lib-4a.test.ts is unedited and green on LIB-5's head.
5. Fallback, only if the builder shows a plugin cannot gate: stop and ask. That ruling may allow header and hashes: line rewrites only, with a test that each reserved file differs from main in those lines and nowhere else.
**Why.**
- reserved_paths close src/** until Do 9, archetypes.ts always, and the 8's generated files (S10).
- content.mjs:135 rewrites the 8's hashes: line, and lib/inputs.mjs:31 hashes each writer plugin's bytes. So a content.mjs edit rewrites reserved files, while L2-A3, which ignores headers, stays green.
- render() writes nothing until every plugin has returned (generate.mjs:83-90), so a throwing plugin blocks every output.
- Adding a plugin stales no other plugin's files (lib/inputs.mjs:2-3; generate.test.ts:154-162).
- Section 12 item 5(c) dropped core edits for the same reason.
- LIB-4a calls ids.mjs's outputs() directly, so a gate in ids.mjs would fire there.
**Why nothing is loosened.** This is stricter than S10: full byte identity instead of body identity. The gate throws the same messages before any write. No existing test is edited. C17 keeps its reach over the code that writes app content.
**Changed:** fixing the order inside outputs(), which D-LIB5-WORDS and D-LIB5-REACH need; keeping the generator lint to library rows, as the card's Do 5 and amendment 28 say, with the 8 in the sweep; and checkC17 run on directories, since it skips a file path.

#### NEW-2 (D-LIB5-BUNDLE)
**Ruling.** LIB-5 writes tools/plates/library/shared/check-bundle.mjs, run as `node tools/plates/library/shared/check-bundle.mjs [dir]`, with dir defaulting to www.
- It reads box.name.text, box.now.text and box.doctor.text from the S1-pinned docs/research/howto/shared/back-pain-box.json.
- It scans the bytes of every file under <dir>/**, index.html, sw.js and the manifest included.
- It exits 1 if any whole value appears as one exact, case-sensitive string, naming the file and the field.
- It also exits 1 if <dir>/assets holds no HowToSheet-*.js chunk, so it is never vacuous.

A vitest in library-shared.test.ts runs the scanner on temp folders it writes at run time from the copied card:
- each of the three values planted in turn → exit 1, naming that field;
- no HowToSheet chunk → exit 1;
- clean → exit 0.

Do 2 on its PR head: run `npm run build`, then the scanner, and post the output. Also run one seeded check in the scratch worktree: the doctor value planted in a shipped src string gives exit 1. Nothing seeded is committed.

CI. The supervisor drafts one add-only step in build-apk.yml's source-gate job, right after 'Typecheck, unit tests and production build' (:42 on 2d1bbf3).
- It runs `node tools/plates/library/shared/check-bundle.mjs`, with no `if:` and no continue-on-error.
- It lives on a supervisor branch that merges LIB-5's reviewed final head.
- The step and LIB-5 merge in one train, as section 6 does for LIB-4c's wiring. The full run on the train head is S4-P's merge evidence.
- The step never lands on main before the script.

Do 9, under either route, changes the scanner's rule and its vitest cases in library-shared.test.ts, in the commit that replaces the placeholder, and nothing else of check-bundle. Each answered value must appear in the bundle. The 9dbc7e0 draft box.now.text, kept as a tests/howto/fixtures/lib5 file, must not appear unless it is the answered value. Both options keep the name and the doctor line (section 12 item 12), so only `now` can differ. The Do 9 cases, each in a temp folder: all three answered values present → exit 0; each value missing in turn → exit 1, naming that field; the draft `now` planted when it is not the answer → exit 1; no HowToSheet chunk → exit 1. The CI step is never edited or removed.
**Why.**
- No gate block may be added, and scripts/** and .github/** are reserved for LIB-5.
- No current test reads the build.
- dist/ is never written (vite.config.ts:18, outDir 'www').
- A vitest that reads www/ is vacuous in `npm run check`, which builds after the tests.
- One train gives exact-commit evidence without breaking main.
- Defining the Do 9 rule now keeps route (a) mergeable without removing a check.
**Why nothing is loosened.** It adds S4-P's check on the full built output, with no skip path, and each field is shown to bite. At Do 9 the zero-hit rule is replaced by a stricter positive rule.
**Changed:** Do 9 also changes the scanner's vitest cases, which flip with the rule, and card amendment 21 lists every LIB-5 file Do 9 edits.

#### NEW-3 (D-LIB5-FIXTURE)
**Ruling.**
1. Every LIB-5 test that runs the generator on a scratch row uses E1's tree, unchanged. This covers S4-P test 3, S7's 'treats' mutation and the other generator-side lint fixtures, library-lint.test.ts's 31-word box, and D-LIB5-FAMILY's M1-M3.
   - Each test file builds one tree with fixtureTree() from tests/howto/fixtures/lib2b/fixture.mjs. The id is lib_cable_lateral_raise, with E1's own scratch QA card, which D-LIB4-FIXTURE-3 (11.1 item 3) already names.
   - No new scratch id. No extension of D-LIB4-FIXTURE-3, D-LIB4b-F5 or D-LIB4c-1. Section 12 item 6 holds: the id is not LB1 or LB2.
2. Each case edits only the staged How-to, in a copy of that tree.
   - Copy with `cpSync(root, r, { recursive: true, verbatimSymlinks: true })`, as library-rows.test.ts:150-157 does.
   - Edit only F.HOWTO, with one exact replacement that must match exactly once, or the case throws. Examples: the riskFlags line `['wrist', 'shoulder', 'elbow']` gains 'back'; one copy string that no pinned page carries gains 'treats'.
   - One exception: D-LIB5-FAMILY's M2, M3 and control edit only the `inherit` key of E1's scratch card in the copy, under the same exact-once rule.
   - A second exception: D-LIB5-PAGE's back-flagged fixture helper makes its three listed replacements in the How-to, each exact-once.
   - Never edit the spec, the page, the batch file or the batch golden file. The helper lives under tests/howto/fixtures/lib5/**. lib2b/fixture.mjs changes only by D-LIB5-SCRATCH's three lines.
3. Each case asserts its exact expected message, naming lib_cable_lateral_raise. Examples: `lib_cable_lateral_raise: LIB-5: back box waits for owner decision 6 (plan 8 item 6)`, or the lint's id, field and rule line. So a QaRefused, a stamp-gate line or any other earlier throw is red.
   - A case that edits the How-to and expects generation to pass first calls `writeScratchStamps(r, [id])` after its edit. These calls are added in the Do 6 gate commit (D-LIB5-STAMPS): before it there is no stamp gate, and the copy has no SCRATCH_MARKER until stageTree() marks it in that commit, so the call would throw.
   - Each such test file also includes "card removed (`rmSync(join(r, F.CARD_FILE))`) → `plate QA refused lib_cable_lateral_raise … PQ-H6`".
4. S3 uses no D-LIB4-FIXTURE-3 card. Its card is the subject: a fixture card under tests/howto/fixtures/lib5/** that passes the committed validator unedited.
   - Each value names a claim whose quote is in a fixture quotes file there.
   - Its plateFacts equal E1's measured facts. Its tempo equals E1's spec tempo, with each s traced in the test to the fixture card's plate.tempo.
   - It is marked scratch, written over F.CARD_FILE only in a temp copy, and never placed under docs/research/howto/cards/**.
   - candidateOf and runQa are called directly, with no generator.
5. S5 is a direct renderRisks test on a spread of a real sheet with riskFlags ['back'], as sections-risks.test.ts:89 does. No tree is needed.
6. The pure-function lint tests (D-LIB5-VARIANT, D-LIB5-VARIANT8, D-LIB5-WORDS, D-LIB5-REACH) take injected rows or fixture modules, never a new generator tree.
**Why.**
- stageTree() and pinTree() build only lib_cable_lateral_raise. ID, CHROME, CARD, PAIR, PAGES and CARD_FILE are constants (fixture.mjs:20-24), transformSources swaps only lib_pull_up for that ID (:44), and the committed page is cable-lateral-raise's, built by LIB-6 (#181).
- A new id would need an edit to LIB-2b's file, a page from LIB-6's builder, or LIB-4b's unmerged, reserved fixture.
- gateNodeHalf (gen/plates.mjs:133-143) runs before content.mjs and so before library-gate.mjs. Without E1's card, the row throws QaRefused PQ-H6 first.
- D-LIB4b-F5 is not needed: nodeHalf stops F5 from blocking (candidate.mjs:91, :98).
**Why nothing is loosened.** No new exemption, scratch id or ruling extension. The QA gate runs unchanged on every case, and the card-removed mutation stays. Exact-message assertions stop a different throw from passing. All edits stay in temp copies.
**Changed:**
- S3's tempo no longer cites "LIB-9a's ruled tempo mapping", because section 13 Q3 keeps that map to LB1.
- Point 6 and the inherit-key exception were added, so that ITEM-7, OPEN-5 and OPEN-6 need no new scratch id.
- The input verdict's "extends FIXTURE-3 to the lib5 ids" is withdrawn.

#### NEW-4 (D-LIB5-TEMPO8)
**Ruling.**
1. LIB-5 owns the 8's tempo map (section 13 Q3: "The 8's tempo stays LIB-5's"). For the 8, this replaces 12 item 9's "ruled in LIB-9a's design note". LIB-5 never imports or copies lb1/tempo.json, and LIB-9a's A11 imports nothing from LIB-5.
2. The revised note's section k holds an 8-row map on the head the supervisor names. If that head is not yet named, one addendum comment on #244 follows once it is (reading and writing only, no slot, no push).
   - For each phase in the spec tempo of the 7 ids that have a spec (tools/plates/vendor/exercises/<id>.mjs): the field of that card's verified plate.tempo it takes (up, down or pause), plus plate.tempo.claim.
   - Any other s (Rest, Brace, leg_press's bottom Pause, a Hold with no pause value) appears only as a named constant, with the verified claim and verbatim quote that state its seconds, or it is marked "no verified source".
   - lib_dumbbell_lateral_raise has no spec (H6:not-engine, node.mjs:154): "none".
   - With the map, a plateFacts form table for the same 7 ids: the measured-joint fact's kind ('angle'); whether it is `measure: true` (H6 compares it with spec.measure.expect and the drawn measure, node.mjs:163) or a `joint` fact (H6 compares it with the engine's angle at its pose, :161-162); its pose; the spec's measure.vertex; and the quantity measured. Examples on main: lat_pulldown's measure is 'Lean back' at hip.r from vertical, expect 15, so a `joint: 'hip.r'` fact would be compared with the hip angle and fail; machine_chest_press's measure has no expect, so only a `joint` fact can match.
   - The supervisor rules the map and the form table on #244, and Do 3 b's tempo and plateFacts values wait for that ruling.
3. Shape and rules.
   - {phase, s, move: true} for a moving phase and {phase, s} otherwise, in that key order, as in the spec arrays (pull_up.mjs:111). H6 compares with JSON.stringify (node.mjs:174).
   - As in section 13 Q3, a moving phase takes up or down and never a constant. A constant exists only with a verified source (Q3's mountain_climbers precedent).
4. Where the map lives.
   - The builder's copy of the ruled table may sit in the validator under tools/plates/library/research/.
   - tests/howto/library-cards8.test.ts holds its own copy, taken from the ruling. It asserts the validator's table equals that copy, and builds each card's expected tempo only from the ruled table and that card's plate.tempo. It never takes expected values from a spec, a plate or the builder's table (Q3's rule).
   - It also holds a literal copy of the ruled plateFacts form table, and asserts that each wired card's measured-joint fact matches its row and that the row's vertex equals the spec's measure.vertex.
   - Mutations, each red: one tempo second changed; an s with no map entry; a constant added without a ruling; a mapped field swapped (up for down); a pause-mapped phase whose s differs from the card's pause; a wired card's measured-joint fact in the other form (`joint` for `measure: true`, or the reverse).
   - When CARDS_8 holds no id that lost 'H6:no-card' (point 6's expected path), these checks and mutations run on the S3 lib5 fixture card as card amendment 39 says.
5. Stop rule. Stop and report for an id if any of its phases has no ruled entry or verified source, or if a mapped second differs from the spec's. That id is not added to CARDS_8, and it keeps both 'H6:no-card' and 'F7'. LIB-5 never changes a plate, a spec, a fact, a tolerance or the ruled map.
6. Expected result. On the8 @ e6381fa (unverified), each of the 7 cards has plate.tempo up 2 and down 2. Each spec's concentric phase is 1 s, and hanging_leg_raise's Lift is 1.5 s. So unless the named head differs, all 7 stop at H6.tempo, and LIB-5 reports them in one PR comment. Do 3 b uses only the head the supervisor names.
**Why.**
- Section 13 Q3 gave the 8's tempo to LIB-5 and kept LIB-9a's map to LB1 with no constants.
- A map in research/** that A11 imports would break LIB-9a's reserved_paths, its card's "Never write those here" and Q3's "the expected map lives in the test".
- LIB-9a cannot import from an unmerged LIB-5 branch.
- Two maps over different ids, each in its own card's file, are not one shared file.
**Why nothing is loosened.** H6's exact equality, ±2° and ±1 cm, and F7's equality are unchanged. No s comes from a spec. The expected table lives in the test, and every branch has a red mutation. An id that does not match keeps both exemptions.
**Changed:**
- The map goes in the revised note when the head is named; before, it was a separate addendum. Either way it comes before commit 1.
- Q3's "moving phase never a constant" rule and the pause mutation were added, so the 8's map reads like LB1's.
- This supersedes card defects CT-3, F2 and L5-2, which waited on LIB-9a.
- Note fix 13's "tempo-map.mjs as its one home" is withdrawn.
- The plateFacts form table was added, because H6 checks a `measure: true` fact and a `joint` fact differently (node.mjs:161-163), and no ruling fixed each id's form.
- The fixture route was added, because on the expected path no id of the 8 is H6-wired, and S12's and point 4's mutations would have nothing to run on.

#### NEW-5 (D-LIB5-PAGE)
**Ruling.** The library layers page becomes placement 6.
- LIB-6-PM (#181, LIB-6's branch, build-layers-page.mjs only) adds two exact-once patches to the mirrored artifact/howto-layers.mjs. They go on a #181 head that already contains LIB-5, which merges first (D-LIB5-ORDER).
  - (i) feelSection's `const RF = { true: 'wrist', shoulder: 'shoulder', knee: 'knee', elbow: 'elbow' };` (:217) gains `back: 'back'`.
  - (ii) risksSection's FLAG (:271) gains `back`, read lazily through LIB-5's backBox() from tools/plates/library/shared/back-box.mjs (an absolute file URL, as RENDERER_URL is). It is evaluated only when a sheet's riskFlags include 'back', for example as a getter.
  - Nothing under tools/plates/layers/** or copy-lint.mjs is written.
- LIB-5: backBox() keeps its name and signature in Do 9. Until then it throws BACK_BOX_WAITS. From Do 9 it returns the RedFlagBlock that src/howto/red-flag-back.ts is generated from, byte-equal to it.
- LIB-6-PM evidence:
  - the two new anchors in the existing 'every patch anchor … exactly once' test;
  - every existing #181 test unedited and green, including the 8's page at PAGE_SHA256 (e7b81413…);
  - LIB-2b's cable-lateral-raise.layers.html byte-identical;
  - before Do 9, E1's back-flagged fixture (below) makes buildLayersPage throw BACK_BOX_WAITS, naming the id;
  - L0-lib inputs: the page now loads back-box.mjs by URL and reads back-pain-box.json at run time, which LIB-4c's MANIFEST lists (ci/manifest.mjs BUILDERS and the static runtime-read lists, :5-13 and :27 on 108eb5c) do not hold. A follow-up line for manifest.mjs's owner (Supervisor actions 11) adds back-box.mjs, its imports and shared/back-pain-box.json to the page-input set of every back-flagged pinned row, with a C0 mutation: one byte of back-pain-box.json on a pinned back-flagged fixture row turns C0 red. It lands before any back-flagged row is pinned;
  - mutations: the RF patch dropped → 'red flag back missing'; the FLAG patch dropped → 'no shared red flag back'.
- E1's back-flagged fixture, for S5-L and the LIB-6-PM evidence: one named helper under tests/howto/fixtures/lib5/** makes exactly these replacements in a copy of E1's How-to, each exact-once or it throws (an exception to D-LIB5-FIXTURE 2's one replacement):
  - riskFlags `['wrist', 'shoulder', 'elbow']` gains 'back';
  - the first feel row that carries no redFlag gains `redFlag: 'back'`;
  - SOURCES gains an 'nhs-back' entry whose id, url, kind, access and checked are back-pain-box.json's sources entry, with cite 'NHS, Back pain' in the form of the nhs-* entries and `use: 'CONSENSUS'` (box.boxClaim.tags). `sources: Object.keys(SOURCES)` (pull_up.howto.mjs:385) then holds it.
  After Do 9 this is needed: risksSection throws unless every source of a shown red-flag box is in the sheet's sources (howto-layers.mjs:274-276; boxClaim.sources is ['nhs-back']), and copy-lint needs an evidence label or `use` for each source (copy-lint.mjs:309).
- S5-L is carried by whichever of #181 and the Do 9 change merges second: LIB-5's PR under route (a), claude/lib-5-back-box under route (b). It sits in its own test file (tests/howto/library-back-page.test.ts when LIB-5 carries it) and reads build-layers-page.mjs only. On E1's back-flagged page (the fixture above):
  - `#<pre>-redflag-back` holds exactly three `<p>`, whose unescaped texts equal RED_FLAG_BACK's name, now and doctor, imported from src/howto/red-flag-back.ts;
  - the row's rf-link has `data-flag="back"` and `aria-controls="<pre>-redflag-back"`;
  - Do 1 b's reach checks run on the page text (D-LIB5-REACH);
  - lintHowto's words.total plus words(back box) ≤ the imported VISIBLE_WORDS_MAX, because copy-lint.mjs:313 drops 'back';
  - mutations: one box byte drifted; a 31-word box; the extra-words term removed → red on a fixture at 450;
  - on the first head holding Do 9, the twin lines and both patches, the HT-9 twin runs that fixture at 0 px.
- LIB-9a's merge_prerequisites gain, beside 'LIB-5's back box (Do 9) on main': "LIB-6-PM's back patches and S5-L on main and green". Until then a back-flagged row is refused: by the placeholder (generator) and BACK_BOX_WAITS (page) before Do 9, and by howto-layers.mjs:221 after Do 9 if the patches are missing.
**Why.** LIB-4b's twin compares the app with pages[lib].layers, which #181 builds. 7 LB1 cards link redFlag 'back' (12 item 12). Both :221 and :278 throw for 'back'. An eager read would break the 8's page before Do 9.
**Why nothing is loosened.** It adds a checked placement, tests and a prerequisite. Golden B and copy-lint stay locked, and the 8's page stays at PAGE_SHA256. The page's 450-word total counts the back box.
**Changed:** the fixture row is E1's (D-LIB5-FIXTURE), not a new lib5 scratch row. Its helper also adds the nhs-back source, and the L0-lib inputs line was added.

#### NEW-6 (D-LIB5-SCRATCH)
**Ruling.**
1. Helpers. research/stamps.mjs exports these, with signatures fixed in LIB-5-DESIGN.md:
   - SCRATCH_MARKER: one file at the top level of a scratch root, not git-ignored; the note fixes its name;
   - markScratch(root);
   - writeScratchStamps(root, ids), with no default root. It throws on a root that lacks SCRATCH_MARKER. It writes every entry with scratch: true, and only into that root's docs/research/howto/reviews.json.
   - markScratch and writeScratchStamps are synchronous. contentHashOf is async (it imports the root's content.mjs, D-LIB5-STAMPS), so writeScratchStamps computes the hashes in a spawnSync child Node process run in root, which imports root's own stamps.mjs, as the lib2b fixture's node(root, code) runner does (fixture.mjs:71). Every builder and every caller stays synchronous.
2. The gate. stampProblems accepts an entry with scratch: true only when its root holds SCRATCH_MARKER; every other rule is unchanged. The stamp gate and the back-box refusal live only in library-gate.mjs's outputs() (D-LIB5-GATE), never in loadContent, pushHints or ids.mjs.
3. Fixture edits: exactly three lines per builder, nothing else (card amendment 14): one import line and two calls.
   - The import goes after the file's last import line: `import { markScratch, writeScratchStamps } from '../../../../tools/plates/library/research/stamps.mjs';` in lib2b/fixture.mjs, and `import { markScratch, writeScratchStamps } from '../research/stamps.mjs';` in fidelity/fixture.mjs. Both files import only node:* modules (and lib2b's `node`) today.
   - `markScratch(root)` goes just before LIB-2b's stageTree() returns its root, and as the last statement of LIB-4b's stage().
   - `writeScratchStamps(root, <the ids it pinned>)` goes as the last statement before pinTree() and pin() return. That puts it after the batch-golden plate entry, whose fragments contentHashOf needs, and before any generate, for every caller.
   - Evidence: a test asserts that the tree's reviews.json holds a scratch stamp for each pinned id when fixtureTree() returns (and when pin() returns, once LIB-4b is on main), and that generate run straight after fixtureTree() passes the stamp gate. Mutation: writeScratchStamps made async (returning before it writes) turns that test red.
4. LIB-4c. ci/scratch.mjs gets no edit if, on main, it builds through stage() and pin(). It does on 108eb5c (:124-126). Otherwise the same import and two calls follow its own staging and pin steps.
5. LIB-4a. write-ids.mjs leaves Do 7 and the merge prerequisite.
   - It calls only handpairs.mjs's and ids.mjs's outputs() (write-ids.mjs:68-69; synthetic.mjs:52-53 on #233 @ aaff25e), imported from its synthetic copy, not from ROOT (write-ids.mjs:63-65).
   - It reaches content.mjs only through pushHints → loadContent (ids.mjs:141-142, content.mjs:142-145), and never library-gate.mjs.
   - Evidence: a test runs writeIds(ROOT, 22), which passes, and asserts that syntheticRoot(ROOT, 22)'s copy holds no docs/research/howto/reviews.json (synthetic.mjs:14 copies no docs/). So a gate reached from ids.mjs would throw there (D-LIB5-STAMPS: a missing reviews.json fails every shipped id). lib-4a.test.ts A1/A2 are green on LIB-5's head.
6. Tests on main: there is no SCRATCH_MARKER at ROOT, and none is tracked (git ls-files). S8's "committed reviews.json holds no scratch entry" is unchanged. S8 stays absolute.
7. Mutations, each red:
   - the marker removed from the E1 tree → generate throws "LIB-5 stamp: lib_cable_lateral_raise …";
   - writeScratchStamps on an unmarked temp root → it throws;
   - a marker added at ROOT → the main test;
   - E1's stamps not written → generate throws, naming the id;
   - the gate called from pushHints, in a scratch worktree only → the writeIds test.
8. LIB-4c's scratch ref.
   - LIB-4c merges first, so C11-C14 run before LIB-5 merges.
   - A rebuild after LIB-5 commits the marker and the scratch stamps, so source-gate is red there by construction. gate-verdict needs source-gate (build-apk.yml:291 on claude/sup-lib4-ci), so C11's PASS line cannot be produced.
   - If such a rebuild is ever needed, stop and report. S8 is never made conditional, and no test learns to skip a scratch tree.
9. If an existing test turns red on the gate commit because a gate line now comes before the refusal it expects (for example a library-rows.test.ts:130-162 case), stop and report. Never edit that test.
**Why.**
- The gate throws for any unstamped shipped row. Without this, it turns E1's test on main red on LIB-5's own head (library-rows.test.ts:34-36), along with every later B5 use (LIB-7's shared-key proof, 11.1 item 14) and any LIB-4c rebuild.
- The note's ".git or ROOT" refusal would block B5, which builds in place in a worktree (fidelity/fixture.mjs:2). A worktree has a .git file.
- Only the generator gate reads the marker, and a main test pins it absent, so on main the gate equals S8.
**Why nothing is loosened.** On main no marker can exist, so the gate refuses every scratch stamp. S8's bullets and their mutations are unchanged, and the marker rule has its own mutations. Scratch stamps keep D-LIB4-FIXTURE-3's limits.
**Changed:**
- The gate lives in library-gate.mjs, not "gen/content.mjs outputs()" (D-LIB5-GATE).
- stageTree()'s line goes just before its return, because stageTree() returns the root.
- Stop rule 9 was added.
- Each builder gains one import line, because neither fixture imports stamps.mjs. The helpers are synchronous, because stageTree(), pinTree(), stage() and pin() and their callers are (library-rows.test.ts:34; ci/scratch.mjs:124-127 on 108eb5c).
- Point 5's evidence no longer makes stampProblems throw: write-ids.mjs imports the plugins from its copy, so a mock of ROOT's module could not reach them.

#### NEW-7 (D-LIB5-SPLIT)
**Evidence.** Checked with copy-lint.mjs's exported words, sentences, BANNED and limits (49a2853) over shared/*.json on 9dbc7e0.
- Labels over 3 words: palm-flat hand-ahead (settled by D-LIB5-FAULTKEYS); prone checkpoints[0] "Hips on the pad".
- Sentences over 15 words: the gripLines of curl, palm-flat, rope-rule, battle-ropes, jump-rope, kettlebell (also 23 words, over lead 22), medicine-ball and wall-ball; prone checkpoints[0].detail (16).
- Risk over 14 words: jump-rope handRisks[0] (16).
- Semicolons: palm-flat wrist, contactPoint and soreWrist; jump-rope wrist; unrack-rerack squat steps[0] and [1]; prone checkpoints[0] and [1] detail; dumbbell-kickup postureArchetype.right.
- Not a hit: floor-body checkpoints[0].detail (15 words, one sentence). Posture detail is 'prose' in copyFields and in c7 checkLength(detail, null, null), so it has no 10-word cap.
- Hits that depend on the split: rightPose, fault 'what', widthNote, handContact, grip, defaultCrop, exemption reason and replacementRule, and step lists longer than SETUP_MAX_STEPS 5 (get-in-out 7; unrack-rerack press-rack 8, squat 6, smith 6).

**Ruling.**
1. The split. The builder posts it with Do 2's results, and the supervisor rules it before Do 4 builds that module.
   - For every field of the 18 non-box cards, name the HowToContent text path (content-types.ts) or golden-B copyFields path the module writes it to, and that path's kind in copy-lint and C7.
   - A field written to any shown or app-copy path is shown copy. It is linted at that path's kind with golden B's constants as they stand (bans, MAX_SENTENCE_WORDS, the kind's word and sentence caps, and the list caps of the sheet it lands in), plus the LR-23 patterns and content.md 4's additions.
   - Every field that the note's g table gives a lint stays shown copy, unless the supervisor rules it data on the PR. The builder never moves a field to data to clear a hit.
2. Data. These are only the fields the module never writes to a text path: the note's "Not projected" list, plus any the supervisor rules.
   - library-shared.test.ts asserts that each whole free-text data value (every appliesToWhy, notes and gaps entry, and every data field's .text and .basis), matched exactly and case-sensitively, is absent from src/** and from every generator output. The 0 hits on origin/main are recorded first, as for S4-P.
   - A pinned list of each module's export keys shows that no data field is exported.
   - Typed enum values (thumbMode, loadAxis.value, handle, archetype) are not text, and typecheck keeps covering them.
   - Mutations: one notes string written into a generated file turns it red; a data key added to an export turns it red.
3. Fix route. Every shown hit goes back to research, as judgement work.
   - Either an Opus research writer rewords only the hit lines on a claude/libht-research-* branch from the named head, or the supervisor gives the Sonnet W2B session the exact replacement text (section 12 item 14).
   - Each changed line keeps its claim refs.
   - A fresh Opus critic checks each changed line against its claim's verbatim quotes (the LR-27 precedent), inside an LR-29 verify, with the supervisor's 10 % re-fetch.
   - The palm-flat hand-ahead label changes once, to 'Hand ahead' (D-LIB5-FAULTKEYS).
   - LIB-5 never rewords, trims or exempts a string, never adds a per-string cap, and never edits a research file (S1).
4. Do 2's dry run covers all 18 non-box cards under the split. It posts every hit with its rule, card, field, path, kind and text.
5. Order.
   - Do 4 builds the back-box placeholder and every module whose card has no hit, straight away.
   - A module with a hit waits until the supervisor names the one research head that holds every SPLIT reword and, if they missed LR-29, D-LIB5-FAULTKEYS's edits (Supervisor actions 3-4), and on which its shown fields pass. LIB-5 then re-copies, re-pins S1 and re-runs S2, S6 and S7. That is the one extra re-copy the card now allows.
6. Risk. If no such head exists by LIB-5's merge slot, the supervisor rules how the waiting modules land, for example in a follow-up PR as under D-LIB5-CARDS8. The answer is never an exemption or a cap change.
**Why.**
- S6 (module === card), S1 (byte copies) and reserved_paths mean only research may change these words.
- content.md 4 and plan 4.4 apply golden B's constants unchanged.
- Under LR-29 the shared cards carry content.md 2.1's copy fields, reused as-is. content.md 3.2's "no user copy" is for per-exercise cards.
- W2B runs on claude-sonnet-5 with exact edits, and item 14 keeps judgement rewording off Sonnet.
**Why nothing is loosened.** Every cap and ban stays golden B's. A field leaves the lint only by a supervisor ruling that names its path. The data test is new, and it is proven to bite on main. The fix is made in the research wording, and a fresh critic checks it again.
**Changed:** none. The supervisor will also route the hits already found on g-table fields to research early (Supervisor actions 4), so Do 2 adds only new hits.

#### NEW-8 (D-LIB5-WORDS)
**Ruling.** Add one library lint rule, a pure function in tools/plates/library/lint/: `sheetWords(M, shared, extraBoxes) -> { total, violations }`.
- M is the module namespace of sourceOf(id), imported as howto-layers.mjs:301 imports it. It is never loadContent's content, which drops THUMB_PAGE: on 49a2853, pull_up reads 449 as a namespace and 423 from content.
- shared is golden B's tools/plates/layers/howto/shared.mjs namespace.
- extraBoxes maps a flag to a RedFlagBlock, for flags not in RED_FLAG_BLOCKS. It is {} until Do 9. Do 9 sets it to { back: backBox() }, the value library-gate.mjs writes to src/howto/red-flag-back.ts.
- total = lintHowto(M, shared).words.total, plus copy-lint's exported words() of [name, now, doctor].join(' ') for each riskFlags entry that RED_FLAG_BLOCKS lacks. That is how lintHowto's boxText counts a box. Only .words.total is used from lintHowto.
- A violation names the id and rule when total > the imported VISIBLE_WORDS_MAX, or when a riskFlags entry has no box in RED_FLAG_BLOCKS and none in extraBoxes. It never counts 0 words.

Where it runs:
- library-gate.mjs's per-row loop, after refuseBack. So before Do 9 a back-flagged row still throws refuseBack's exact message (S4-P test 3).
- The Do 5 sweep, over every shipped row.
- Once the field card lands, the variant line's words() join the total (D-LIB5-VARIANT 4).

Tests (in S7):
- (a) For each of the 8, with extraBoxes {}, total equals lintHowto on its module namespace: lateral raise 444, back squat 450, pull-up 449, hanging leg raise 442, lat pulldown 449, seated cable row 449, leg press 449, chest press 444.
- (b) A neutral fixture box, never the real text: a plain .mjs module under tests/howto/fixtures/lib5/, never a typed HowToContent, because RiskJoint has no 'back' until Do 9. The box is at most 30 words and matches none of back-pain-box.json's three field values. A fixture whose riskFlags include 'back', with the box in extraBoxes, is green at exactly 450 and red at 451.

Mutations, each red:
- the extra-box addition removed (the 451 case passes);
- extraBoxes emptied for a back-flagged fixture (missing-box violation);
- M replaced by { default: M.default } (pull-up (a) gives 423);
- a literal limit above 450 in lint/** (the 451 case passes).
**Why.** content.md 4 item 2: "The 450-word total counts the warning boxes and the owner line". copy-lint.mjs:313 drops a flag that has no RED_FLAG_BLOCKS entry, and c7.ts:298 and :307 add only content.redFlag.
**Why nothing is loosened.** The rule only adds counting. VISIBLE_WORDS_MAX stays the imported 450. No box limit is added under lint/**, so S7's 30-assert holds. Golden B, c7 and S4-P are unchanged.
**Changed:**
- The rule runs in library-gate.mjs, not gen/content.mjs (D-LIB5-GATE).
- "RED_FLAG_BACK exported from back-box.mjs" became backBox(), the one accessor D-LIB5-PAGE fixes.

#### NEW-9 (D-LIB5-COUNTS)
**Ruling.** This amends the card's shared-file line for library-core.test.ts and adds lines to Do 9's write_scope. It applies on whichever head Do 9 is built: LIB-5's branch under route (a), or claude/lib-5-back-box under route (b). Its premise: Do 9 adds exactly one generator output, src/howto/red-flag-back.ts. library-gate.mjs writes it; it is not fingerprinted and not in generated-bodies.json. No output is added before Do 9, so none of these lines changes before Do 9.

Allowed edits. Each stays an exact toBe/toEqual, and only the base moves, by that one output.
- tests/howto/library-core.test.ts (:242, :243, :247 and :248 on 2d1bbf3):
  - title 'the generator writes 60 files: the 54 fingerprinted, the 2 it rewrites, and ids-node.mjs, lib-id.ts, loaders.ts, coverage.ts' becomes '… writes 61 files: …, coverage.ts, red-flag-back.ts';
  - comment '60 for the 8' becomes '61 for the 8's set (60 plus red-flag-back.ts)';
  - `60 + 5 * LIBRARY.length + new Set(keys).size` becomes `61 + …`;
  - the :248 presence list gains 'src/howto/red-flag-back.ts' (add-only, stricter).
- tests/howto/library-rows.test.ts (:90, :92, :94 and :108 on 2d1bbf3):
  - title 'the 60 files' becomes 'the 61 files';
  - `expect(mainOut.size).toBe(60)` becomes `toBe(61)`;
  - `60 + CLONE_OUTPUTS.length` becomes `61 + CLONE_OUTPUTS.length`, both at :94 and in :108's `PASS, ${…} files fresh`.
- tests/howto/library-ci.test.ts (LIB-4c's file; edit only after LIB-4c is on main and merged in; :298 and :300 on 108eb5c):
  - `expect(real.inputs.size).toBe(60)` becomes `toBe(61)`;
  - `n: 66` becomes `n: 67`.

Find each line by its quoted text on the merged head, never by line number. Stop and report, without editing, if a quoted line's text differs on that head, or if any other test turns red because of the new output (D-LIB2b-PINS (8)).

Evidence, recorded in the PR:
- On the Do 9 head, with the new output and the old values, run full `npm test`. Every listed assertion line is red (library-core :247; library-rows :92, :94 and :108; library-ci :298 and :300 once LIB-4c is merged in), and no other test is red because of the new output. List each red line. The two titles, the comment and the :248 presence list cannot be red; they change only to match.
- With the new values, everything is green.
- Mutation: library-gate.mjs's red-flag-back.ts output removed turns each re-pinned assertion line red, and the :248 presence check for 'src/howto/red-flag-back.ts' red.
- The note and LIB-5-DESIGN.md quote each old and new line exactly, with the head sha.
**Why.** Each line pins the generator's exact output set, and Do 9 adds exactly one output. L2-A3's 54 is keyed on generated-bodies.json, so it stays.
**Why nothing is loosened.** Every assertion stays an exact equality, and only its base moves by one. A failing-before and passing-after run, plus a mutation, show the new values bite. Any other red test goes to the supervisor before it is edited.
**Changed:** the writer is library-gate.mjs, not gen/content.mjs (D-LIB5-GATE). The red-before evidence names only assertion lines.

#### NEW-10 (D-LIB5-REACH)
**Ruling.**
1. The generator's library lint (tools/plates/library/lint/**, called once from library-gate.mjs's outputs(), Do 5) checks every red-flag box it generates or links.
   - It uses copy-lint.mjs's exports, imported unchanged: words, sentences, RED_FLAG_BOX_MAX_WORDS, MAX_SENTENCE_WORDS, BANNED, CONTACT_RE, SOURCE_RE, SOURCE_CS_RE, SAFETY_LINE_RE and sourceNamePatterns.
   - It also applies lintShared's per-box 'today' and 'doctor' rules (copy-lint.mjs:337-338).
   - It imports nothing from tests/**, and no gate block is added.
2. Pattern parity. The note cites HT4b-A6 (tests/howto/no-contacts-parity.test.ts), which already pins copy-lint's four patterns to tests/guards/no-contacts.ts by .source and .flags. No second parity test is added.
3. In vitest, both run unedited:
   - checkC7 on a clone of one of the 8's content, with redFlag replaced by the box under test;
   - checkC19Shared({ RED_FLAG_BACK: box, DISCLAIMER }, 'back') (c19.ts:49), which imports no-contacts.ts and applies SAFETY_LINE_RE to boxes.
4. Differential test, in library-lint.test.ts. For each fixture, the lint names exactly the rules named by checkC7's 'C7: redFlag' lines plus checkC19Shared's lines, so it is red exactly when either one is.
   - Fixtures:
     - 30 words, all clean;
     - 31 words: count only (c7);
     - no 'today': today only (c7);
     - no 'doctor' and no SAFETY_LINE_RE word: doctor only (c7);
     - 'Call 999': contact and safety line only (C19). c7 is clean here, because c7.ts:294-301 has no contact rule.
   - Every fixture is neutral stand-in text that equals no field value of back-pain-box.json, with every sentence at most 15 words and no BANNED hit. So only the rule under test differs.
   - The same comparison runs on every shipped row's redFlag.
5. An equality test checks LIMITS.redFlagBoxWords === RED_FLAG_BOX_MAX_WORDS === 30.
**Why.**
- c7's words() is not exported (c7.ts:116), and c7.ts and c19.ts are read-only.
- package.json engines '>=22' admits 22.0-22.17, which do not strip types by default. c19.ts's extensionless import would not resolve natively either.
- content.md 4 item 3 says "the lint runs twice": golden B's rules at build time, then C7 again on the generated content in tests.
- c7 has no contact rule, so C19 is the reference for contact wording.
**Why nothing is loosened.** Both limits stay imported. The generator applies every rule c7 applies to a box, and more. c7 and C19 run unedited in vitest on every placement and every shipped row. No check, limit or pattern changes, and no test is added twice.
**Changed:** the lint is called from library-gate.mjs, not gen/content.mjs (D-LIB5-GATE).

#### OPEN-6 (D-LIB5-FAMILY)
**Ruling.**
1. Rule (a), one label per fault.key, ships in LIB-5. It runs in library-gate.mjs's per-row loop and in the library-lint.test.ts sweep. It covers every shipped row's handling faults, the shared modules, and any hand-pair fault labels on main, read as D-LIB5-FAULTKEYS 4 rules. D-LIB5-FAULTKEYS settles the current hand-ahead, curl and rope conflicts.
2. The same loop and the sweep refuse a shipped row when either of these holds:
   - (i) its How-to content has `extends`;
   - (ii) the card file its How-to's research.card names, read as candidate.mjs researchOf reads it (main :44-48), has an `inherit` value other than absent or `[]`. Any non-array value counts.
   A card that is unnamed or missing gives no inherit. This covers the 8, whose grip/research paths are absent and stay so (S10). QA's H6:no-card already refuses a library row with no card. The refusal never reads cards/<id>.json by id, because E1 and B5 point at scratch cards.
3. The throw is `${id}: family: ${field}: inherited-string map not ruled (D-LIB5-FAMILY)`, where field is `extends` or `${research.card}#inherit`.
4. Tests, each red under its mutation, all in per-case copies of E1's tree (D-LIB5-FIXTURE):
   - (M1) `extends` added to the How-to → throws, naming `extends`;
   - (M2) no `extends`, and E1's scratch card gains one inherit[] entry → throws, naming `#inherit`;
   - (M3) `inherit: true` on that card → throws;
   - control: `inherit: []` generates, as resistance_band_row's real card on 9dbc7e0 has it.
   Green with the refusal in place: the 8, E1 and B5 now; LIB-4c's ci/scratch.mjs in Do 7, once LIB-4c is on main. LIB-4a's synthetic copies never run library-gate.mjs (write-ids.mjs:61-69 on #233), and the PR says so.
5. S7's family-consistency row is met in LIB-5 by rule (a), the refusal and M1-M3. The child comparator is not LIB-5 acceptance.
6. The comparator goes to LIB-9 on claude/lib-9-lb1, through a supervisor amendment of the LIB-9a/LIB-9 card.
   - It is built only after LIB-5 is on main and merged into that branch. It must merge before any LB1 child's layer copy is written or shipped.
   - On 9dbc7e0, 9 of the 14 LB1 cards have a non-empty inherit[]: incline_machine_press, shoulder_press, horizontal_leg_press, leg_press_calf_raise, underhand_lat_pulldown, single_arm_lat_pulldown, chin_up, hanging_knee_raise and close_grip_pulldown. The refusal blocks those until then.
   - Write scope: a carve-out from LIB-9a's reserved lint/ and LIB-5 paths, for exactly the family module under tools/plates/library/lint/ and its block in tests/howto/library-lint.test.ts.
   - Steps:
     - The builder posts the inherit[]-entry → sheet-path map on the PR, and the supervisor rules it.
     - The map lives only in the family module. Cards are never edited (D-LIB9-CARDFIELDS; A11's three-key diff).
     - The comparator replaces the refusal and stays fail-closed. It still throws for `extends` or any inherit[] entry with no ruled mapping, for a mapped string that is not `===` to the parent's shipped How-to string, and for `extends` that disagrees with the card's `parent`.
   - Mutations, each red: one inherited string drifted; one inherit[] entry unmapped; the parent's string changed; M1-M3 kept as unmapped cases.
   - It gets its own fresh Opus review.
**Why.** inherit[].field is free text (for example underhand_lat_pulldown's "setup: weight set and pin pushed all the way in; ..."), so no map can be built mechanically, and guessing one breaks the no-guessing rule. A plain deferral would let a child ship unchecked. A row can copy parent strings without declaring `extends`, hence trigger (ii). The read path matches QA's researchOf, so E1's and B5's scratch cards stay valid.
**Why nothing is loosened.** Rule (a) runs from LIB-5. No row that declares inheritance can ship until a ruled, fail-closed comparator exists. The replacement may only add comparisons, never skip an unmapped entry. No current check, test, cap, budget or card byte changes.
**Changed:**
- M1-M3 run in per-case copies of E1's tree, not on new scratch rows (D-LIB5-FIXTURE).
- The loop is library-gate.mjs's, not gen/content.mjs's (D-LIB5-GATE).

### Note fixes

Each fix is tied to a note section. Where a ruling covers the fix, the ruling's text applies; only what the ruling does not say is repeated.

- **N1 (g; Do 2's dry run).** Apply D-LIB5-SPLIT. Remove the claim that every exported string passes the lint. The per-field path and kind table goes with Do 2's results, for the supervisor to rule. The split is the supervisor's ruling, not the builder's. The data test follows D-LIB5-SPLIT 2, and typed enums stay under typecheck.
- **N2 (a, c, f: every gen/content.mjs and gen/ids.mjs edit).** Apply D-LIB5-GATE: every gate piece goes in library-gate.mjs, with inputsFor and the C17 scan. Byte identity is PR evidence, never a committed pin. The affectedIds test runs after LIB-4c merges, on a registry with at least one shipped row. Remove the note's "call site: gen/content.mjs outputs()" lines.
- **N3 (b, placement table).** Add placement 6 as D-LIB5-PAGE: owner LIB-6-PM, S5-L, and a LIB-9a prerequisite. Restate placement 5 as "content.redFlag stays RED_FLAG (wrist) for every library row, because loadContent re-exports it (HT5-A5, content-gen.test.ts:207). The back box never goes there."
- **N4 (b and h, library lint rules).** Add sheetWords as D-LIB5-WORDS rules it.
- **N5 (f, scratch stamps and the fixture list).** Apply D-LIB5-SCRATCH: SCRATCH_MARKER and an explicit root, S8 absolute, the line positions, LIB-4a out, and the LIB-4c scratch-ref timing. Re-derive the fixture list on #233 @ aaff25e, #232 @ f1df4a7 and LIB-4c @ 108eb5c (d2d1bac and 1746fd5 are no longer #233's head).
- **N6 (a, the pinned tests Do 9 changes).** Quote every count line's old and new text as D-LIB5-COUNTS gives it (titles, comment and presence list included). Name sections-risks.test.ts's two lines (D-LIB5-RISKSTEST) and ht9.mjs :26 and :29 (D-LIB5-TWIN).
- **N7 (a and c, chunk path and S4-P's bundle half).** The build writes www/ (vite.config.ts:18), so measure www/assets/HowToSheet-<hash>.js. The bundle half is check-bundle.mjs over all of www/**, not only assets/: never vacuous, with a seeded check, the CI step in one train, and the Do 9 rule (D-LIB5-BUNDLE).
- **N8 (b, placements 1-3 and the import mechanism).** Apply D-LIB5-REACH: copy-lint's exports, `sentences` included, and no .ts import. Add the differential test against checkC7 plus checkC19Shared. Cite HT4b-A6, with no second parity test. Placement 1 also applies BANNED, MAX_SENTENCE_WORDS and sourceNamePatterns. Run checkC19Shared on red-flag-back.ts's block.
- **N9 (c, S4-P test 3, S3, S5 and S7's scratch rows).** Apply D-LIB5-FIXTURE: E1's tree, per-case copies and exact messages; the S3 fixture card; S5 as a direct renderRisks test. No new lib5 ids. The input's "name lib5 ids under a FIXTURE-3 extension" is withdrawn.
- **N10 (e, the stamp hash and entries).** Apply D-LIB5-STAMPS: 9 fragments, not 4; scope; contentHashOf importing the root's own content.mjs; an empty reviews.json is a failure; the sweep's checkC15 gets the fragments; both records per role; the HANDOVER 8.2 follow-ups; one commit with the fixtures' lines.
- **N11 (g, fault and pair keys).** Add the table that maps each export to its LIB-7/LIB-12 module KEY and variant (pair = KEY/variant), with the claim ids per export. Restate OPEN-4 as D-LIB5-FAULTKEYS. Replace "LIB-12 parks these as GAPS" with "not drawn": GAPS lists card ids, and hand-battle-rope's GAPS is {}.
- **N12 (k, the 8's machine cards).** "Nothing pushed yet" is stale: claude/libht-research-the8 @ e6381fa has cards for all 8, unverified and without the three keys. Redo the table on the supervisor-named head, with columns for the measured-joint fact, the tempo map row and the TOPFAULT answer. CARDS_8 is all-or-nothing per id (card amendment 26), and the fallback is per id (card amendment 6). Add the cardResearch(id) deep-equality test. Expect most of the 7 to stop at H6.tempo (D-LIB5-TEMPO8 6).
- **N13 (d, tempo and topFault, and the open-points list).** d's tempo premise ("a constant LIB-9a names (Rest)"; "Do 3 waits for that ruling") is replaced by D-LIB5-TEMPO8: LIB-5's own 8-row map in section k, with no tempo-map.mjs and no LIB-9a dependency. d's OPEN-3 is replaced by D-LIB5-TOPFAULT. The open-points list gives each point's ruling id. The input's "tempo-map.mjs as its one home" is withdrawn, because it contradicts section 13 Q3.
- **N14 (a, Do 9 module shape).** State the mapping: name, now and doctor are box.name.text, box.now.text and box.doctor.text; claim comes from box.boxClaim, in RedFlagBlock's claim shape. words and wordCap are dropped: they are data (Stops 3).
- **N15 (a, the chunk method).** Add `claim: { tags: ['CONSENSUS'], sources: ['nhs-back'] }` to the stand-in, so the scratch build's tsc passes. Cite sizeOf at screenshot-gate.mjs:6853 on 2d1bbf3, found by `const sizeOf`. The input's :6753 is wrong on this head, and so is the note's :6425. Make the location reason precise: generate.mjs:20 GENERATED_DIRS includes 'src/howto', so `generate --check` covers red-flag-back.ts.
- **N16 (heads line).** Restate the heads as listed at the top of this section and re-check f and k against them. Research stays 9dbc7e0 until the supervisor names the merged head, and e6381fa is never a source on its own.

### Supervisor actions

1. **Now, with this section.**
   - Push section 14 on claude/sup-lib4-cards, and apply card amendments 1-48 to docs/supervisor/verify/lib-5-card.md in the same commit.
   - Post one comment on #244 with the sha and "revise the note under section 14". It is not 'LIB-5 resume'.
   - Send the same to the LIB-5 session by message. Say that item 13 as read at 19a6017 is superseded (CT-1, L5-7).
   - Record the step in HANDOVER and Relay. Nothing goes to the owner's chat.
2. **Section 12 lines that this section amends** (recorded here; no other edit):
   - item 13: ":65 and :70" reads ":66 and :70";
   - item 13: its fallback trigger reads as card amendment 6;
   - item 13: "none is taken from the 8's specs or plates" gains "except labels, each through a ruling: topFault spellings (D-LIB5-TOPFAULT), tempo phase names, order and move flags (D-LIB5-TEMPO8), and the plateFacts form labels of the ruled form table (kind, `joint` or `measure: true`, pose, measure.vertex; D-LIB5-TEMPO8 2)";
   - item 12 (b): route (b) holds under option 1 whether or not the cap card has merged (card amendment 9);
   - item 9, for the 8: the tempo map is ruled on #244 (section 13 Q3; D-LIB5-TEMPO8).
3. **Before tonight's LR-29 verify starts.**
   - Send D-LIB5-FAULTKEYS's exact edits to W2B, with every old and new string verbatim from D-LIB5-FAULTKEYS 1 (gaps[2] included): claude-sonnet-5, with the exact text, the exact claim and card lists, and a stop on any mismatch (item 14). Put the changed labels and the new gaps[2] string on the verify's fresh Opus critic list.
   - If W2B has already closed, make them one exact-edit commit on the claude/libht-research-* branch that action 4's D-LIB5-SPLIT rewords use. The critic checks it, and it merges with those rewords into one research head that the supervisor names once (card amendment 3).
   - Add D-LIB5-VARIANT 5's findings (underhand_lat_pulldown's null variantLine; close_grip_pulldown's variantLine without the Machine kind) to the verify as research judgement work for the Opus writer.
4. **After the LR-29 merge into claude/libht-research.**
   - Name that head on #244 (Do 2, Do 3 b).
   - Start the D-LIB5-SPLIT reword task for the hits already found on g-table fields. An Opus research writer works on a claude/libht-research-* branch from that head, with a fresh Opus critic and the 10 % re-fetch. Do 2's dry run adds any new hits to the same task before it is verified. Any action 3 fallback commit goes on the same branch. After its verify, merge it into claude/libht-research and name that one head on #244: it is LIB-5's one extra re-copy (D-LIB5-SPLIT 5).
5. **Once the head is named.**
   - Run the blind TOPFAULT pass: a fresh Opus agent, once per id, with inputs exactly as D-LIB5-TOPFAULT lists (for a drawable:false id, the top fault the card names in place of plate.mistake.what; section 13 Q1).
   - Post 'TOPFAULT @ <sha>' on #244 before anyone compares the answers with firstKey.
6. **On the revised note.**
   - Rule it on #244, including section k's source list, the tempo map and the plateFacts form table (D-LIB5-TEMPO8).
   - Send "LIB-5 resume" (PR comment and session message) only when a slot frees under D-LIB-LANE-ACTIVE, with the active-builder count.
7. **After Do 2's post.** Rule the D-LIB5-SPLIT field split, check the sizes and the scanner output, and rule any hit on approved golden-B copy: by exact id and string, in the sweep only (card amendment 37), and for a hit on pull-up's copy, how E1 is treated.
8. **Before Do 6.**
   - Post the "stamps (O5)" wording ruling (11.1 item 7). It sets approvedBy for LIB-5's entries and for LIB-2b's layers-page entries.
   - Then approve the 8's entries.
9. **After commit 1.** Run 'CARD FIELDS VERIFIED': a fresh, blind Opus agent with one planted wrong number (in the stop report when commit 1 writes no number, card amendment 25), section 13 Q1's two checks and the blind topFault inputs. Post it.
10. **Before LIB-5 READY.**
    - Draft the check-bundle step (D-LIB5-BUNDLE) on a supervisor branch that merges LIB-5's reviewed final head.
    - Merge both in one train. Never land the step first.
11. **LIB-6-PM card, before its back-patch step.** Add D-LIB5-PAGE's two patches, their evidence and mutations, the rule "only on a #181 head that contains LIB-5", and S5-L when #181 merges second. Add the L0-lib follow-up line (back-box.mjs, its imports and back-pain-box.json in the page-input set of back-flagged rows, with its C0 mutation) to the card of manifest.mjs's owner (LIB-4c), before any back-flagged row is pinned.
12. **LIB-9a/LIB-9 card, before LIB-9a's next resume.**
    - merge_prerequisites gain "LIB-6-PM's back patches and S5-L on main and green" (D-LIB5-PAGE).
    - They also gain "the variant-line field card is on main before any row whose exercises.json equipment has '/' ships" (D-LIB5-VARIANT 6).
    - Add the D-LIB5-FAMILY comparator step with its write-scope carve-out. It is built after LIB-5 is on main, and merged before any LB1 child's layer copy is written or shipped.
13. **Every later batch card.** Add the same variant-line prerequisite line.
14. **The variant-line field card.** Write it, naming its owner and slot, before LIB-9 READY. Write it early, because it is on LB1's critical path (D-LIB5-VARIANT 4).
15. **Next supervisor docs pass on claude/howto-options.** Amend GRIP-AND-FEEL-ARCHITECTURE.md 3.1 and 3.1.1's key names (D-LIB5-FAULTKEYS 6).
16. **Withdrawn from the input verdict.** There is no FIXTURE-3 extension to lib5 ids (D-LIB5-FIXTURE).
17. **Owner.** Nothing new goes to him. The back-box question stands as sent. If he has not answered by LIB-5's merge slot, route (b) applies.

### 14.1 Revised note ruling (D-LIB5-NOTE-2, 2026-10-18 ~01:0x UTC; #244 @ `738cdd3`)

A 3-lens review (rulings, quotes, scope) read the revised note against this section; one adversarial verifier checked each finding, and a judge merged them (18 into 12; 4 dropped as not holding). **Verdict: PASS WITH FIXES** (0 blocker, 0 high, 5 medium, 7 low). The note keeps Do 1's scope: only the note changed against main `72c94fc`, section k says the research head is not named, and it prints no selected Mistake key and no per-id TOPFAULT answer.

**What LIB-5 does now** (still Do 1, reading and writing only, no lane slot): make F1-F12 exactly as written below, in the note only, and push them with the next push the 2-hour limit allows; post one comment "LIB-5 NOTE FIXED: <sha>" listing F1-F12 with their new line numbers. No code, build, test or lint run happens before "LIB-5 resume". "LIB-5 resume" follows when a lane slot frees under D-LIB-LANE-ACTIVE (LIB-4a is under review; its merge frees one), with the active count.

**Fixes**

- **F1 (medium)** `LIB-5-DESIGN.md @ 738cdd3e, section g (:238-259)`: D-LIB5-SPLIT 1 and 2 point to two lists that the revision deleted: the per-field lint list (the shown-copy floor) and the 'Not projected' data list. The note now has no baseline, and card Do 1 g still asks for 'the lint each string passes'.
  - Fix: Under the g table, add a block headed 'D-LIB5-SPLIT anchors (from ee7f40f section g; they hold until the supervisor rules the split on Do 2's post)'. (1) 'Shown-copy floor (SPLIT 1). Each field is held to this lint at its ruled path and kind. This is not a claim that it passes.' Then the ee7f40f rows verbatim, with columns Module / Exports / From card / Lint held to. hands.mjs: gripLine lead (≤22 words, ≤2 sentences), cue ≤6, fault label 1-3, other prose sentence ≤15, all BANNED, LR-23 patterns and medical bans. implements.mjs: as hands, plus handRisks[] risk ≤14. moves.mjs: setup step ≤12 words, ≤5 steps per variant, posture right/wrong caption ≤10. exemptions.mjs: prose sentence ≤15, label 1-3. checkpoints.mjs: label 1-3, detail caption ≤10. back-box.mjs: (b). (2) 'Data list (SPLIT 2). Not projected (research data under LR-28): `appliesToWhy`, `loadAxis`, `thumbMode`, `byRule`, `byInference`, `notFor`, `gaps`, `notes`.' Keep the sentence 'No claim is made here that every exported string passes the lint'.
- **F2 (medium)** `Section a, Chunk measurement (Do 2) (:78-91); section c, Mutations (:140)`: N7 and D-LIB5-BUNDLE are only half applied. Do 2 never runs check-bundle.mjs after the build, never posts its output and has no seeded check. The card's S4-P mutation 'the doctor value added as a string under src/' was also dropped, so the src/** half of test 2 has no mutation.
  - Fix: In section a's Do 2 method, add a bullet: 'On the PR head, run `npm run build`, then `node tools/plates/library/shared/check-bundle.mjs`, and post its output in the Do 2 comment. In the scratch worktree only, plant `box.doctor.text` in a shipped src string, rebuild, and check-bundle exits 1 naming the doctor field. Nothing seeded is committed (D-LIB5-BUNDLE; card amendment 23).' In section c's Mutations line, add: 'the doctor value added as a string under `src/` → 2 red'.
- **F3 (medium)** `Section k (:311)`: The sentence says #244 can be a blind input. That is false: earlier #244 material prints the selected keys, and D-LIB5-TOPFAULT's input list is closed. The sentence also tells a reader where the keys are.
  - Fix: Delete 'The pre-revision table showed each plate's selected Mistake key; this revision leaves that column out, so #244 can be a blind input. The keys are listed in sorted order.' Replace it with: 'The TOPFAULT pass gets only the inputs D-LIB5-TOPFAULT lists. The plate half below is one of them. It never reads #244's other comments, its history or an earlier note.' Do not mention any earlier table.
- **F4 (medium)** `Section d, tempo (:151-155); section f Helpers`: Card research/** scope lists 'the builder's copy of the 8's ruled tempo table, with signatures fixed in the design note'. The note gives it no file, export or shape, and drops D-LIB5-TEMPO8 4's own-copy rule for library-cards8.test.ts.
  - Fix: Replace 'There is no tempo-map.mjs and no LIB-9a dependency.' with: 'There is no separate tempo-map.mjs and no LIB-9a dependency. The builder's copy of the ruled 8-row table sits in the validator, `tools/plates/library/research/<validator file, named here>.mjs`, as `export const TEMPO8`. It is keyed by lib id, and each entry is an ordered list of `{ phase, move?: true, from: 'up' | 'down' | 'pause' }` or `{ phase, constant: <s>, claim }` (D-LIB5-TEMPO8 4). tests/howto/library-cards8.test.ts keeps its own literal copies of the tempo map and the plateFacts form table, asserts that `TEMPO8` equals its copy, and never takes expected values from a spec, a plate or TEMPO8 (card S12).' Name the validator file in the note.
- **F5 (medium)** `Section g, family reader (:268)`: The reader's asserts are reworded as 'each count is above 0 where it must be'. This drops the hands-count equality and the fixture's known count, so a reader that drops some hand faults stays green.
  - Fix: Replace the second and third sentences of :268 with: 'It prints the compared count per source and asserts three things: the 8's count is above 0; the shared modules' count is above 0; the hands count equals the fault entries the imported modules export, and is above 0 whenever any module it finds exports a fault. A fixture hand module in LIB-7's shape under `tests/howto/fixtures/lib5/`, with a known fault count, proves the reader (D-LIB5-FAULTKEYS 4).' Add the mutation 'the reader drops one fixture fault → red'.
- **F6 (low)** `Section d, topFault (:156-162)`: The note gives only the drawable:true half of the library-cards8.test.ts assertion. It drops the drawable:false half, both red mutations and 'reported on the PR' for drawable:false ids.
  - Fix: Replace :162 with: 'library-cards8.test.ts asserts that each wired card has `drawable: true` and a topFault equal to its TOPFAULT key. It also asserts that each drawable:false card's topFault, where written, equals its TOPFAULT key and differs from its plate's `mistake.firstKey`. Mutations, each red: a wired card's drawable set to false; a test copy of one card set to drawable:false with topFault equal to the drawn key (section 13 Q1 (2)).' On :161, add ', and is reported on the PR'.
- **F7 (low)** `Section f, library-gate.mjs (:189-200)`: The D-LIB5-GATE summary leaves out N2's registry condition and stop, the render()-paths and header tests, the C17 asserts and fetch( mutations, the inputs() rule, the PR-evidence timing and the comment-byte demo.
  - Fix: Add these bullets. (1) 'inputs() returns every file the plugin reads. Before Do 9 outputs() returns []; from Do 9 it returns only src/howto/red-flag-back.ts.' (2) 'library-shared.test.ts: the paths render() attributes to library-gate.mjs are exactly [] while back-box.mjs holds no box text, and ["src/howto/red-flag-back.ts"] after Do 9. No other generated file's header names the plugin. Each has its mutation.' (3) 'checkC17 asserts [] and that each directory holds its file. Mutations: `fetch(` in a temp copy of library-gate.mjs, and in a temp copy of back-box.mjs, each red.' (4) Change the PR-evidence bullet to: 'on every head sent for review and on the READY head, headers included; after Do 9 the same, except red-flag-back.ts. Plus a one-time scratch-worktree demo: one comment byte in content.mjs, regenerate, and the diff lists the 8's ht-*.ts, ids.ts, archetypes.ts, sources.json and lib_*.json.' (5) Change :200 to: 'After LIB-4c merges, on a registry with at least one shipped library row (E1's), an affectedIds test makes one call per changed path for library-gate.mjs, a lint module, research/stamps.mjs and reviews.json, and expects ids 'all' with `all: true`. If any case does not select every id, stop and report (LIB-4c owns affected.mjs).'
- **F8 (low)** `Section a, D-LIB5-COUNTS table and red-before line (:51-64)`: The red-before line claims every assertion line is red, but the :248 presence list cannot be red. The 'Old (exact)' column also cuts lines short with '…' or describes them instead of quoting, against NEW-9 and step 2.
  - Fix: Replace the :64 sentence with: 'The PR records the red-before run: with the old values, library-core :247, library-rows :92, :94 and :108, and library-ci :298 and :300 (once LIB-4c is merged in) are red, each listed, and no other test is red. The :242 and :90 titles, the :243 comment and the :248 presence list cannot be red; they change only to match. Then the green-after run, plus the mutation "red-flag-back.ts output removed", which turns each re-pinned assertion line red and the :248 presence check red for src/howto/red-flag-back.ts.' Quote the full old and new text, with sha, of library-core :243-244 and :248 (the whole new array, with 'src/howto/red-flag-back.ts' last), library-rows :90 and :108 @ 72c94fc, and library-ci :300 @ 108eb5c. Also quote library-qa.test.ts :66 and :70 old lines in full, and add 'If lib_pull_up is not wired, both stay as on main and the PR says why.' Quote approved.mjs :20's full old line.
- **F9 (low)** `Section a, D-LIB5-TWIN (:72-76)`: The heading drops the card's 'Do 9 only' gate. The :26 ending is misquoted (the final `;` is missing), and the paragraph drops the 'no re-pin' reason, the conditional re-pin, the B2 stop, the 'nothing else changes' rule and both mutations.
  - Fix: Change the heading to '**D-LIB5-TWIN (Do 9 only, after LIB-4b merges).**' and the path to `tools/plates/library/fidelity/twins/ht9.mjs` @ f1df4a7. Quote :26's real end, ``…export * from ${JSON.stringify(join(root, 'src/howto/archetypes.ts'))};\n`;``, and the full new :26 and :29 lines. Replace :76 with: 'Nothing else in ht9.mjs changes, a3Probe stays unexported, and the gate's HT-9 block is untouched. pins.json stays unedited and B3 stays green; the PR says why no re-pin was made. If a pinned text changes after all, re-run B2 and re-pin that key under D-LIB4-OPEN in the same PR. B2 (`--ids golden8`) must be identical before and after; if it differs, stop and report, and never change a3Probe or FLAG. A library-shared.test.ts block, added in Do 9 with the twin lines, reads ht9.mjs as text and asserts that FLAG's keys equal RiskJoint's members and Risks.tsx's FLAG keys, and that the entry re-exports red-flag-back.ts. Mutations: `back` dropped from FLAG → that block red; the re-export dropped → that block red and B2 red on every id with HT9/crashed@*.'
- **F10 (low)** `Section b, placement 6 (:116)`: The note says both LIB-6-PM patches read backBox(). Under D-LIB5-PAGE only the FLAG patch does; the RF patch only adds `back: 'back'`.
  - Fix: Replace with: 'Owner LIB-6-PM (#181): the RF patch adds `back: 'back'` to feelSection's RF map, and the FLAG patch reads `backBox()` lazily, only when a sheet's riskFlags include 'back'.'
- **F11 (low)** `Section k (:340); section d (:146)`: Two node.mjs cites are wrong. The measure comparison is :163, not :162, and the joint fact is :161-162. h6 runs :153-176, not :151-176.
  - Fix: At :340, write '(`node.mjs:163`)' for `measure: true' and '(`:161-162`)' for the `joint` fact. At :146, write '`qa/node.mjs:153-176`'. The supervisor fixes the same :162 slip at lib4-cards.md:1991 (NEW-4 point 2).
- **F12 (low)** `Section b, mechanism (:93)`: The note drops 'by default' and the engines link from NEW-10. Node 22.6-22.17 can strip types behind a flag.
  - Fix: Replace with: 'It imports nothing from `tests/**`. package.json engines '>=22' admits Node 22.0-22.17, which do not strip types by default, and c19.ts's extensionless import would not resolve natively either.'

**Supervisor actions done with this ruling:** the :162 cite in NEW-4 point 2 now reads node.mjs:163 (measure) and :161-162 (joint), checked on main `72c94fc` (h6 runs :153-176). The blind TOPFAULT pass never reads #244 comment 6241270855 or any #244 material that prints a selected Mistake key; its inputs are only those D-LIB5-TOPFAULT lists.

### 14.2 Note fixes checked; LIB-5 resume (D-LIB5-NOTE-3, 2026-10-18 ~02:2x UTC; #244 @ `9628a35`)

- A fresh delta reviewer checked `738cdd3..9628a35`. Only LIB-5-DESIGN.md changed, in one non-merge commit. F2-F12 are applied as written. Blindness holds. The cites are right on main `b99a9e2` (node.mjs :153-176, :161-162, :163, :174).
- One low remains, F1b: the restored SPLIT table's From-card cells were condensed, not pasted verbatim. Examples: "(unrack, kick-up)" dropped, array markers dropped, slash lists turned into comma lists. No rule changes. LIB-5 pastes the From-card cells of the hands, moves and checkpoints rows from ee7f40f :113, :115 and :117 verbatim at the note's :273, :275 and :277, in its first resumed commit.
- **The note is ruled.** D-LIB5-NOTE-2 is closed, with F1b carried.
- **Do 2's research head is `9dbc7e0`.** This is lib-5-card.md build_prerequisites' fallback: wave 2 and the 8's cards have not merged into claude/libht-research yet. LIB-5 re-copies and re-pins once when they merge (S1, S2, S6, S7). Then it re-copies one more time, for the one D-LIB5-FAULTKEYS/D-LIB5-SPLIT head (card amendment 46). Do 3 b still waits for the merged head, the TOPFAULT comment, the tempo-map ruling and 'CARD FIELDS VERIFIED'.
- **LIB-5 resume**, with active LIB builders = 4: LIB-4b, LIB-4c, LIB-9a, LIB-5. The freed-slot queue after this: LIB-3b, LIB-4d, LIB-8-FIX.

### 14.3 D-LIB5-SPLIT ruled; B5(b) routed; research w2 and SPLIT in one verify (new supervisor, 2026-10-18 ~05:20 UTC; #244 @ `5592280`, #232 @ `316679e`)

**D-LIB5-SPLIT (NEW-7 point 1), on #244's HANDOFF 6245403672 table.** Checked against copyFields() in tools/plates/layers/artifact/copy-lint.mjs on main `b99a9e2` (:194-251). Every kind below is the kind copy-lint gives that path; no kind is chosen to clear a hit.
1. Accepted as posted, path and kind: gripLine → handling.gripLine (lead); cue → handling.cue (cue); wrist → handling.wrist.limitText (lead); soreWrist → handling.handleChoice.sore (lead); thumbRule, alternative → handling.thumb.options[].when (prose); widthNote, fingers, handContact, grip → handling.width.text (prose); rightPose → zooms[hand].hand.note (caption); faults[].label → handling.faults[].label (label); faults[].what → handling.faults[].alt (alt); handRisks[] → risks[] (risk); steps[] → setup[] (setup, with SETUP_MAX_STEPS); postureArchetype.right/.wrong → zooms[posture].caption.right/.wrong (caption); reason → handling.wrist.limitText (lead); replacementRule → handling.gripLine (lead); checkpoints[]/defaultCheckpoints[] .label → posture[].label (label) and .detail → posture[].detail (prose); defaultCrop → zooms[posture].caption.right (caption). Data: keys, implement.text and the note's "Not projected" list.
2. contactPoint → zooms[hand].rightNote, kind **label** (copy-lint :211). The caption alternative is refused: hand.note already carries rightPose, and NEW-7 point 1 bars picking a path to clear a hit. Its five hits (battle-ropes, jump-rope, kettlebell, wall-ball, palm-flat) go to research.
3. variants.<v>.steps, when a module writes a variant's steps, map to setup[] (setup), exactly as steps[]; the list cap counts the steps the sheet shows.
4. One path, several fields. Where one card has two or more fields mapped to one path (width.text; limitText from wrist and reason; gripLine from gripLine and replacementRule; caption.right from postureArchetype.right and defaultCrop), the module never concatenates or picks one. It throws `${card}: split: ${path} has ${fields}` and a test proves it on a fixture card (mutation: the throw removed → the fixture generates). If a real card hits this, LIB-5 stops that module and reports; the supervisor rules the card.
5. All 73 hits (#244 HANDOFF list) are research's, under NEW-7 point 3. No golden-B copy is hit (the 8: 0). LIB-5 rewords, trims and exempts nothing.
6. Do 4 builds foot-bar and selector-pin now. Note: the HELPER packet edits shared/selector-pin.json and shared/unrack-rerack.json, so those modules re-copy at the named head like the rest.

**Research route (Supervisor actions 3-4, combined for speed).** The w2 packets and the SPLIT rewords run in parallel on separate research branches, then share **one** fresh Opus recheck and one merge into claude/libht-research. The supervisor names that one head on #244 and #245. That is one re-copy for LIB-5 in place of card amendment 46's two; nothing is skipped: every w2 packet item, every SPLIT reword and the FAULTKEYS edits are on the recheck's list.
- FAULTKEYS (OPEN-4 point 1): the supervisor makes the exact edits itself, as the first commit of claude/libht-research-split, from the verify head `531b77c`. W2B is closed, so this is action 3's fallback.
- SPLIT rewords: one Opus research writer on claude/libht-research-split, hit lines only, claim refs kept, a Sonnet fetcher for any new quote. It leaves dumbbell-kickup's variants.*.steps alone (W2A's packet items 64-65 append steps there). Risk: those appends may break the 5-step cap; the recheck and LIB-5's lint on the named head catch it, and any hit goes back to the same writer before the head is named.

**B5(b) (#232 HANDOFF (d)).** PQ-H7 determinism did not trip on a deliberately nondeterministic pulley radius. Not LIB-4b's. It goes to LIB-3b (qa/** is its write scope) as an added first item: reproduce it, then either show the field never reaches the rendered bytes (H7 is right; record why) or add a failing fixture and fix H7. Nothing is loosened either way.

**LIB-4c (#246 HANDOFF (d)).** The meta.chrome comparison stays as built. If C11 shows the gate family and the library family differ, report with the run link; the supervisor rules. The smith incline offline/open timeout is root-caused if it repeats, never re-run to green.

### 14.4 D-LIB9-F5 ruled (new supervisor, 2026-10-18 ~05:30 UTC; 11.1 item 17)

**Ruling: (a), a named per-plate exemption, under the owner's 10-01 delegation.** No chrome change now.
1. A library plate may carry `exemptions: ['F5']` with the 8's reason quoted verbatim from tools/plates/library/qa/exemptions.json on main (`b99a9e2`), only when F5's measured element is the selected Mistake tell (button.plate-callout.m, pressed) in Midnight and its value equals the 8's 3.57 exactly. Any other F5 element or value is a defect, never exempt.
2. Each LB1 plate's QA table shows the measured F5 element and value. Mutation (LIB-9 acceptance): one plate's tell chrome colour changed so F5 reads 3.40 → that plate's PQH F5 row is red with the exemption still in place.
3. LB1's expected flag set keeps F5 with this reason. Do 8 and per-exercise approvals are unblocked on this point.
**Why.** F5 measures label text against WCAG AA 4.5:1 (qa/browser.mjs:14). The tell's chrome is locked, shared CSS that every shipped plate already carries, approved by the owner with golden A. A chrome fix is a golden update of the owner-approved plates (plan 2.8 step 3: the owner sees the contact sheet), and one such update later fixes every plate at once, so waiting costs nothing per plate. The fix stays an owner item in the O7 family: offered with the next sheet or APK message, never forced.
**Why nothing is loosened.** F5 runs on every row; the exemption names one element and one value, and the mutation proves any drift is caught.

### 14.5 Named research head for LIB-5 and LIB-9a; 14.3 data list amended (2026-10-18 ~05:50 UTC)

- **Named head: `claude/libht-research` @ `9eaa2480fea8f8f82a52ac2596c14d9a0da08ca5`.** It merges the w2 verify head `efc8feda` into `9dbc7e0`. It holds every w2 packet item, LR-30..LR-36, W2-R1..R12, the 45 SPLIT rewords plus W2-R10, and the FAULTKEYS edits. Record: docs/research/howto/verify/w2.md. The recheck was calibrated: two supervisor plants were caught as blockers. The copy lint at the 14.3 mapping shows 0 hits on the 18 shared cards.
- This is LIB-5's one re-copy (S1 re-pin, then S2, S6, S7; 14.3), and LIB-9a's Do 6 re-copy.
- **14.3 point 1, data list amended:** the `exempts` object of shared/*-exemption.json (for example `exempts.rule`) is data. No module writes it to a text path, and library-shared.test's data-absence test covers its strings (the recheck's Low; wrist-curl's holds a ';').
- Next, in this order: the blind TOPFAULT pass on this head (D-LIB5-TOPFAULT; Supervisor actions 5); then CARD FIELDS VERIFIED after LIB-5's Do 3 b commit 1, and after LIB-9a's Do 6 for its changed picks (assisted_pull_up, underhand_lat_pulldown, resistance_band_row, shoulder_press).

### 14.6 LIB-5 QUESTION @ b14ff79 ruled (D-LIB5-SPLIT-2, 2026-10-18 ~06:10 UTC)
1. **rope-rule width.text (14.3 point 4 hit).** Ruled per card: the module writes `handContact + ' ' + grip` into handling.width.text, in that order, each string byte-unchanged; claim refs are the union (c1, c2, c3). It is the only ruled join. A test pins the joined string and that the ruled-join list is exactly ['rope-rule'], and the 14.3 throw stays for every other card. Mutations, each red: the order swapped; a second card added to the join list without a ruling. Why: width.text is prose (shown=false, copy-lint :248), so the joined text is linted per sentence (12, 6 and 8 words); a research reword would change approved claim text for no reader-facing gain.
2. **floor-body `prone`** (a pointer to prone-checkpoints.json) is data: never written to a text path, and the data-absence test covers its string.
3. **implement.text** is a typed exercise id, like 14.3 point 2's enums. It leaves the absence check, and a new assertion requires it to resolve to an id in src/data/exercises.json (mutation: a misspelt id is red).
4. **Reading confirmed.** A list path takes one entry per field (cupped-thumb thumbRule and alternative become two thumb.options[] entries). get-in-out's setup and variants.thigh-pad.setup stay separate exports, and the sheet's setup cap counts what one sheet shows (seated_leg_curl 4 + 1 = 5).

### 14.7 D-LIB5-TEMPO8 ruled (#244 @ `b14ff79`; research `9eaa2480`; main `b99a9e2`)
Read: LIB-5-DESIGN.md d (:151-158) and k (:328-361); the 8 cards' `plate.tempo` and claims at `9eaa2480`; the 8 specs and qa/node.mjs on main; lib4-cards 12 items 9 and 13, 13 Q3, 14 NEW-4, 14.1-14.6 (lib4-cards.md @ `db948a4d`; its :NNNN cites below); LR-33. The note raises no QUESTION on either table.
Rule for every row: a moving phase takes `up` (concentric) or `down` (eccentric). The static phase right after the concentric takes `pause` (LR-33; Q3) and is left out when pause is 0 (Q3). Any other static phase is a constant only with a quote that states its seconds (NEW-4 3); otherwise it is "no verified source".

**Tempo map** (spec phase ← card field; card s at `9eaa2480` vs spec s). Labels (names, order, move flags) at note :338-345 match every spec line below: ACCEPT.
1. lib_dumbbell_lateral_raise: none. ACCEPT. The approved plate is drawn by ref-src ("H6:not-engine" in exemptions.json), so H6 returns at node.mjs:154. _test_front.mjs:1-2 is an engine re-draw, not that plate; its :27 Lift 1 against the card's up 2 is recorded for information only.
2. lib_barbell_back_squat (barbell_back_squat.mjs:126): Lower←down 2=2; Drive up←up 2≠1; Brace←pause 0, so no Brace where the spec has Brace 1. Claim c26. STOP.
3. lib_pull_up (pull_up.mjs:111): Pull←up 2≠1; Hold←pause 0, so no Hold where the spec has 0.5; Lower←down 2=2; Rest: no verified source (c11 has none). Claim c11. STOP.
4. lib_hanging_leg_raise (hanging_leg_raise.mjs:132): Lift←up 2≠1.5; Hold←pause 1≠0.5; Lower←down 2=2; Rest: no verified source. c10's "pause momentarily" has no seconds, and LR-33's 1 s applies only after the concentric. The spec's Rest 1 is not a source. Claim c10. STOP.
5. lib_lat_pulldown (lat_pulldown.mjs:152): Pull←up 2≠1; Hold←pause 1≠0.5; Return←down 2=2; Rest: no verified source. Claim c16. STOP.
6. lib_seated_cable_row (seated_cable_row.mjs:90): Pull←up 2≠1; Hold←pause 1=1; Return←down 2=2; Rest: no verified source. Claim c12. STOP.
7. lib_leg_press (leg_press.mjs:139): Lower←down 2=2; bottom Pause = constant 1, claim c15 (bells-of-steel: "If desired, you can pause for a second at the bottom."), ≠0.5; Press←up 2≠1; top Rest←pause 1≠0.5 (c25 places the pause there; LR-33). Claim [c15, c25]. STOP.
8. lib_machine_chest_press (machine_chest_press.mjs:164): Press←up 2≠1; Hold←pause 1≠0.3; Return←down 2≠1.5; Rest: no verified source. Claim [c9, c16]. STOP.
9. Correction, note :330, :339-345 and :347: replace "head not named" and "e6381fa" with rows 1-8 at `9eaa2480` (14.5). NEW-4 6 (:2521) holds on the named head: all 7 stop at H6.tempo.

**Seconds that differ.** The plates and specs keep their approved timing (NEW-4 5 :2520; 12 item 13). The cards keep their verified values (LR-33: a card value is never changed to match a spec). A stopped id gets no `tempo` or `plateFacts` key (note :153), stays out of CARDS_8 (:374), and keeps 'H6:no-card' and 'F7' with their reasons as on main. The difference is recorded once, in LIB-5's one #244 stop comment (NEW-4 6). Per id it gives the built array, the spec file:line, and each differing phase with its card field, card s, spec s and claim.

**plateFacts form table** (note :349-361). Vertex, title, value and expect match each spec's `measure`: ACCEPT.
10. Write `kind: 'angle'` on every row; only :353 has it now.
11. Add the "quantity measured" column that NEW-4 2 (:2509) requires; the note has none. Squat: knee bend from straight (barbell_back_squat.mjs:86, :118). Pull_up: elbow bend from straight (pull_up.mjs:82-86, :104). Hanging leg raise: trunk-to-thigh angle at the hip (:125). Lat pulldown: trunk lean back from a plumb line at the hip (lat_pulldown.mjs:51-53, :146). Seated row: the upper arm's sweep at the shoulder from its start to its end position, a two-pose angle (seated_cable_row.mjs:83). Leg press: thigh-to-shank angle at the knee (:133). Chest press: the engine report's elbow.r angle (node.mjs:147-152, :161-162).
12. ACCEPT `measure: true` with pose 'end' for squat, pull_up, hanging_leg_raise, seated_cable_row and leg_press; each has an expect (node.mjs:163). Pose is the spec's pose name, not the card's word: leg_press's 'end' is the bottom (leg_press.mjs:36), which the card calls plate.start. H6 ignores pose on this path, so the test pins it.
13. lat_pulldown (:356): ACCEPT `measure: true`, and add pose 'end' (lat_pulldown.mjs:51 "Lean construction (end pose").
14. machine_chest_press (:359): ACCEPT `joint: 'elbow.r'` (no expect, machine_chest_press.mjs:158). Replace "pose from the verified card" with pose 'end' (machine_chest_press.mjs:45 "end: arms long, elbows 18 deg short of straight").
15. One form per fact: a `measure: true` fact has no `joint`, and a `joint` fact has no `measure`. With both, H6 passes the fact on either path (node.mjs:164). No plateFacts value is ruled here; all 7 stop on tempo, so none is written.

**LIB-5 writes**
16. Section k: rows 1-15, with sha `9eaa2480`. TEMPO8 in validate.mjs keeps the :158 shapes and adds `{ phase, from: null }` for "no verified source" (the build throws `${id}: tempo: ${phase} has no verified source` and the id stops) and `lib_dumbbell_lateral_raise: null`. A `from: 'pause'` entry with pause 0 is left out of the built array.
17. library-cards8.test.ts holds literal copies of both tables and asserts TEMPO8 deep-equals its copy. It builds the expected tempo only from that copy and plate.tempo. For each of the 7, it asserts the id is outside CARDS_8, has no tempo or plateFacts key, and keeps both exemptions. It asserts each row's vertex equals spec.measure.vertex, and one form per fact.
18. Mutations, each red: NEW-4 4's six (:2518); pull_up's Rest given a constant 0.5; hanging_leg_raise's Rest given a constant 1 citing c10; leg_press's Pause constant changed from 1 to 0.5; the squat's Brace emitted as 0 s; a stopped id added to CARDS_8; a fact with both `joint` and `measure: true`; one row's vertex or pose changed. Checks that need a wired card run on the S3 lib5 fixture card (:2519, card amendment 39).

**Why.** Q3 and NEW-4 give moving phases up and down, and allow a constant only with a quote that states its seconds. LR-33 places plate.tempo.pause right after the concentric, so the squat's Brace and leg_press's top Rest take it. H6 compares tempo with JSON.stringify (node.mjs:174) and passes an angle fact on the joint path (:161-162) or the measure path (:163).
**Why nothing is loosened.** H6's exact tempo, ±2° and ±1 cm, and F7 are unchanged. No s comes from a spec. No plate, spec or card value moves. All 7 keep both exemptions. One form per fact closes the either-path pass. Every map branch has a red mutation.
**UNVERIFIED.** Whether the engine report's elbow.r angle is a bend from straight (pull_up.mjs:82) or the inside angle: this is not in the inputs, so LIB-5 cites the engine line before any chest-press value is used. The card quotes are taken as verified under 14.5 and were not re-fetched.

**Supervisor decisions on the open points**
- Rows 2 and 7 confirmed: the squat's Brace and leg_press's top Rest take `pause`, because each is the static phase right after the concentric (LR-33). This amends NEW-4 2's example list.
- exemptions.json: for the 7 stopped ids, the reason "LIB-5 adds their cards" becomes "the verified card's tempo differs from the approved plate's timing; approved timing kept (D-LIB5-TEMPO8)". LIB-5 writes it in commit 2, with the D-LIB5-TEMPO8 entry in COACHING-DECISIONS. The exemption itself is unchanged.
- No golden tempo update now. An O7-family offer to the owner (the plates' timing against the cards) goes with the next sheet or APK message, never forced.
- topFault-only wiring for the five TOPFAULT matches is declined for now. NEW-4 5 stands as written; the five keys are on record in TOPFAULT @ 9eaa248, for a later card.

### 14.8 stamps (O5) ruled (D-LIB-O5, 2026-10-18 ~07:10 UTC; main `b99a9e2`, cards `9f80173`, plan `4a9fd86`, LIB-5 `b14ff79`)
1. O5 (HOWTO-BUILD-PLAN.md:419): the supervisor pins the finished layers after a fresh review. The owner gets the contact sheet, then the APK. Any change he wants is a golden-B update (plan 2.8).
2. `approvedBy` names who approved, never the basis. It takes exactly two values: `'owner'` or `'supervisor'`. `'stamps (O5)'` and any other string are refused. The basis goes in `decision` and `why` (O5, or the owner's 10-01 delegation). Precedent: golden B's a7a0b74 record (layers/MANIFEST.json:18, D-LR23-2).
3. LIB-5's 8 stamps (reviews.json) get `'supervisor'`. They are agent-verification stamps the supervisor writes after checking the reports, so `'owner'` would be a false record.
4. LIB-2b's `layers-page` entries get `'supervisor'` under O5, on a first pin or a re-pin, only when the page holds golden-B design kinds alone and the entry it supersedes (if any) is not `'owner'`. The interim `'owner'` of D-LIB2b-PAGES ends. It stays only in scratch fixtures.
5. Under the 10-01 delegation, `'supervisor'` goes on each id's first `plate` entry and on a batch's first plates-page `page` entry. These stay `'owner'`, with his words and the date:
   - every GOLDEN.json entry;
   - every superseding `plate` or `page` entry (a golden update, plan 2.8);
   - any entry that supersedes an `'owner'` entry;
   - any golden-B design change.
6. verifyChain (golden.mjs:147-163; :152 accepts `'owner'` only) covers GOLDEN.json and every batch file. reviews.json is outside it.
   - (a) LIB-5's Do 6 needs no golden.mjs change. It waits only for the supervisor's approval comment on the 8's drafted entries.
   - (b) Before any real batch pin says `'supervisor'`, verifyChain changes. GOLDEN.json keeps `'owner'` only. verifyBatchChain accepts `'supervisor'` only in the cases in points 4-5, and only with a non-empty `decision` and `approval`. This goes in the LIB-8 merge card as its first commit, or in whichever card commits a real batch pin first, never in two. Until it is on main, no real batch golden file is committed.
   - (c) Tests, each red with the allowed cases green: `'supervisor'` in GOLDEN.json; `'stamps (O5)'`; `'supervisor'` on a superseding entry; `'supervisor'` superseding an `'owner'` layers-page entry; a `'supervisor'` entry with no decision or no approval. No existing assertion is edited.
7. Evidence each approval carries.
   - **Stamp:** D-LIB5-STAMPS's fields, plus `approvedBy: 'supervisor'`, `decision: 'D-LIB5-STAMPS'`, and `approval` (the #244 comment link with the approved head sha). LIB-5 adds a c15-stamps test: every committed non-scratch entry has `'supervisor'`, a decision, an approval and `open: 0`. Mutations, each red: `'owner'`; approvedBy missing; `open: 1`. stamps.mjs and c15.ts are not changed.
   - **`layers-page` entry:** D-LIB-<batch>; why = O5; approval = the fresh reviewer's PASS on the exact pinned head, with C9 and L1 green.
   - **First `plate` or `page` pin:** the supervisor's per-exercise comment, naming each id and the head sha, with the valid calibrated critic run, the green PQ hard checks and the supervisor's own look.
   - **`'owner'` entry:** his words verbatim, and the date.
8. Docs: 11.1 item 7 bullet 3 and D-LIB2b-PAGES (10) now read "approvedBy per D-LIB-O5". lib-5-card :206 and LIB-5-DESIGN section e follow this section. The architecture :346 and :351 corrections ride the next claude/howto-options docs pass (Supervisor actions 15).
**Why:** `approvedBy` records who decided. O5 and the 10-01 delegation give these approvals to the supervisor, so the chain keeps his decisions apart from the owner's.
**Why nothing is loosened:** GOLDEN.json and every golden update stay owner-only, and that rule gets its first test. `'supervisor'` needs a decision and an approval link. A false `'owner'` on a supervisor approval is now refused instead of required.
**Open:**
- Is a plates-page `page` re-pin that moves no pinned plate fragment a golden update? Until it is ruled, it needs `'owner'`.
- Before #109 or #245 merges, check whether either holds a real batch entry written with the interim `'owner'`.
- Check whether LIB-4c reads approvedBy.

## 15. LB2 rulings (D-LIB10-*, 2026-10-18)


Heads read: main `2078913c` (train 27, LIB-3b on main); claude/sup-lib4-cards `60767c0`; plan claude/howto-options `4a9fd86`; research claude/libht-research `0393aac`; pilot A claude/lib-8-pilot-a `200f8c3`; LIB-9a claude/lib-9-lb1 `38b436d`. Every file:line is on main `2078913c` unless another head is named. (i) and (ii) answer lib4-cards.md:1424 (section 13, amendment 21). Both hold before LB2's first T row (LB2 has no D row).

---

### (i) D-LIB10-RANGES: where approved PARAMS ranges live

1. Approved PARAMS ranges live in one new file, `tools/plates/library/qa/param-ranges.json`. envelope.json stays as it is: measured on the 8, never hand-set.
2. The file is keyed by family, then by PARAMS key, in exactly the envelope shape derive.mjs reads (`{ key: [min, max] }` or `{ key: [allowed values] }`, derive.mjs:14). A family is the template name for a T row (BENCH, SEATPRESS) and `D:<parent id>` for a D row. Each family row also carries its ruling id and, per bound or value, its basis.
3. A basis is either a pinned approved plate that shows the value (its batch golden entry), or a verified card claim that states it. A rig value with its own anchor (incline, decline, Smith, ...) enters a family only after that anchor's plate entry is pinned (plan 3.1:243-244). A child's own value also needs its own basis: a claim on its own verified card, cited next to the param in rows.json and checked by the CARD FIELDS verifier. A range only bounds; it never stands in for that claim.
4. Only the supervisor adds or changes rows, each by a ruling with a COACHING-DECISIONS entry. The builder proposes rows, with their basis, in its design note.
4b. Route: the supervisor's ruling quotes each family row byte for byte. LIB-3c commits it if the ruling is posted before LIB-3c's READY. Otherwise one small supervisor PR from claude/sup-param-ranges commits it, rows only, with the loader test green and a fresh review. LIB-10 never edits the file.
5. pin.mjs and selftest.mjs never read or write the file.
6. PQ-H10 and the child proof's derive() read one object per row (D-LIB3c-SHARED, 15.1): for each PARAMS key, the family row's range when the row's family names that key, else ctx.envelope's range. h10 builds it and passes it to the derivation's child rebuild; no other code reads the file. A D spec's own derive() call is not a check, and no spec or template imports the file. On the real path ctx.envelope is envelope.json, which names no PARAMS key, so a missing file, family or key fails closed with H10.envelope, as node.mjs:289 does today. (i)'s loader and any family row reach main only in the same merge as (ii)'s child proof, or after it. Mutation: with test family rows present, the child proof removed → the test that expects H10.child for "make, then move one callout" is red (ranges alone never pass it).
7. Built by LIB-3c (item 11). registry.mjs stays byte-identical (Q-A, #245 6242372604; registry.mjs:61). The `template` field rides on the row as data (registry.mjs:52 keeps it). candidate.mjs refuses a T row whose `template` is not a string matching /^[A-Za-z0-9_-]+$/ that names an existing tools/plates/library/templates/<name>.mjs (fail closed; `'../derive'` would otherwise pass). Mutation: `template` removed from a T row → candidateOf throws.
8. Tests, each red and then restored:
   - a PARAMS row added to envelope.json (not committed) turns red the 3b-A6 premise (library-qa-h10.test.ts:125, which runs in npm test), LIB-3c's 3c-A4 premise and a local selftest.mjs run (selftest.mjs:25; in CI only from LIB-4b #232's qa-selftest row);
   - a value outside its family's range gives H10.value;
   - a value ruled only for SEATPRESS, used on a BENCH row, is red;
   - with the pinned envelope, a family or key with no row gives H10.envelope; with a test envelope that names the key and no family row, the key is checked against the test envelope (the fallback);
   - a row without a ruling id or basis makes the loader throw;
   - derive() and H10 read one object: the object h10 passes to the child rebuild gives the same value result as H10's check; a changed family row changes it (in range: the object passed to the rebuild; out of range: H10.value, and no child rebuild runs).

Why: envelope.json cannot hold a hand row (plan 3.3 :292; pin.mjs:1-3, :64; selftest.mjs:23-25), and one global PARAMS range would let a value approved for one family pass on another; a supervisor-owned per-family file is narrower and keeps the limit apart from the plate under test.

---

### (ii) D-LIB10-CHILDPROOF: PQ-H10 proves the drawn plate equals its derivation

1. For every D and T row whose params have no other H10 problem (D-LIB3c-SHARED, 15.1), PQ-H10 also checks that the plate on the batch page (the candidate's `plate`, candidate.mjs:61) equals, on all 9 fragments, the child rebuilt alone from its derivation:
   - D: `derive(parentSpec, row.params, obj)`, obj being (i) 6's one object (derive.mjs:39-45);
   - T: `template.make(row.params, facts)`, with `facts` taken from the child's spec module export.
   A difference gives a new key, `H10.child:<fragment>`. A row with a param problem is already red and gets no child proof, so no verdict changes. A derivation with clean params and no child rebuild gives `H10.child:threw`; node.mjs:298's early return stays as it is, so M21-M23 (mutations.mjs:98-103, :116) keep their keys.
2. For T rows, the parent proof goes through the template: `make(parentParams, parentFacts)`, rebuilt alone, equals the parent's pinned fragments (plan 3.1:246). parentParams and parentFacts are exported by the template, which is frozen with it. Today's rebuild of the parent from its own source stays as well.
3. LIB-3c builds it, in candidate.mjs (the derivation gains a child rebuild and, for T, a template rebuild of the parent) and in qa/node.mjs h10. buildPlatesPage loads specs by file URL (build-page.mjs:47-48, :95). How a derived spec reaches it, for example a module written to a temp directory, is for LIB-3c's design note. A golden parent's spec is imported from a mirror (golden.mjs makeMirror), never from tools/plates/vendor in place: its engine needs the font only the mirror has (measured by the LIB-3c critic: ENOENT). A rebuild that throws gives `H10.child:threw`. LIB-3c reports every lb1-plates.test.ts row its change moves, with the exact new keys: at least the four `it`s of the in-memory D-copy describe (:1128-1153 @ `38b436d`: clean :1139, A7 :1143, A4 :1146, one byte :1149), measured on a local merge of its head into `38b436d` (LIB-3c 3c-A11); #245 changes those expectations when it merges main, as amendment 21 did for LIB-3b. LIB-3c's note gives the added seconds per row against LIB-4c's per-shard budget.
4. Mutations, each red and then restored:
   - a D source that derives and then sets one more field (tempo) → H10.child:tempo;
   - a T source that calls make and then moves one callout → H10.child;
   - a T source whose default export uses params other than row.params → H10.child;
   - one byte of a template constant → H10.byte on the template parent proof;
   - the template parent proof switched back to the parent's own source, with a template byte changed → red (proves the template path is the one checked).
5. Deadline: on main before any T row's QA counts as evidence, and before any D row exists on any branch (LB4's front_squat, goblet_squat and bodyweight_squat; LB6's smith_machine_squat).

Why: today h10 checks the params and rebuilds the parent only (node.mjs:299-302), while the drawing comes from the row's own file (candidate.mjs:66; plates-page.mjs:38), so a source that derives and then edits passes; that is the raw-spec escape hatch plan 3.1:232-233 forbids. Only comparisons are added.

---

### Other rulings

3. **D-LIB10-AHEAD (build-ahead stage ceiling for LB2).**
   - LIB-10 may push with its 7 LB2 rows at stage drawing or review in `tools/plates/library/lb2/rows.json`. Nothing goes under batches/, tests/howto/golden/, src/ or tools/plates/gen/, and its A9 test enforces this.
   - Every D-LIB4-ENTRY condition still holds before any of the 7 drawn here is approved-plate, pinned, in batches/ or shipped. The 4 reused ids follow pilot A's pins (D-LIB10-PA).
   - Why: D-LIB4-ENTRY-2 (12 item 4) names LIB-9 only, and its reason (K cannot rise while no id ships) holds for LB2; the ceiling is a committed test with mutations.

4. **D-LIB10-TEMPLATES (who builds BENCH and SEATPRESS).**
   - LIB-10 builds BENCH after pilot A is on main. It builds SEATPRESS only if the design-note ruling makes arnold_press T; otherwise SEATPRESS waits for its first T child in a later batch (plan 3.1:239 asks for at least 3 members).
   - Each template is proven by the byte proof against its parent's pinned fragments: the card's A7, and PQ-H10 once LIB-3c is in. This amends plan 3.1:248 ("in the PR of its parent").
   - Why: pilot A has no templates/ folder (`200f8c3`) and its head is frozen for LIB-8-FIX (lib-8-fix-card.md:11); the byte proof needs the parent's pin, which exists only after pilot A merges (candidate.mjs:28-41).

5. **D-LIB10-PA (the 5 pilot A ids in LB2).**
   - Reuse: the 4 approved plates (dumbbell_bench_press, dumbbell_shoulder_press, incline_dumbbell_press, barbell_overhead_press) ship as pilot A pins them. They are not redrawn and get no new plate entry or plate critic. The R8 and R9 scoring the ship card needs (card merge_prerequisites; 13.1) covers them too. LIB-10 adds no rows for them, because a second row throws (registry.mjs:34-36). The ship card moves their stage and adds their layers. Approval status: 16 approved at `e6f39ff` (HANDOVER:1223).
   - Modes: the LIB-8 merge card registers the two template parents as 'H' (they were hand-drawn), not 'P'; candidate.mjs:60 throws for 'P'. The template-parent link lives on the children (`parent`, `template`) and in the template module. incline_dumbbell_press stays as pinned; its plan mark "T" names its family only. LIB-10's note may, as an option, show that make(its params, its facts) rebuilds its pinned plate byte for byte, as a second anchor for BENCH's incline branch.
   - Card keys: the LIB-8 merge card writes the three keys for pilot A's cards. Each topFault comes from D-LIB5-TOPFAULT's blind pass (lib4-cards 14 OPEN-3: the card's fault and quotes, the plate's tells shuffled, no firstKey), on a head where LR-31 is applied, and never from mistake.firstKey. Any of its stop answers holds that id. The CARD FIELDS verifier re-checks the key on the same blind inputs. LIB-10 never writes these cards; they reach its branch when main, holding the merge card, is merged in.
     - Checked for the 4 reused cards: plate.tempo maps through Q3 exactly onto the pilot A specs' tempo (for example dumbbell_bench_press.mjs:143: Lower 2, Press 1; the card: up 1, down 2, pause 0). dumbbell_fly [unverified]. plateFacts against the pinned plates [unverified].
   - dumbbell_fly: held on pilot A ("needs a raised foot-end camera", pilot-a/plates.json; D-LIB8-fly). Its fix is `camera.pitch` in LIB-20 (D-SPIKE-pitch, COACHING-DECISIONS.md:2116), still a proposal (D-SPIKE-status, :2137). LB2 ships 11 ids. dumbbell_fly ships with LB2 only if LIB-20 with pitch is on main and its own drawing passes QA and the critic first; otherwise it rolls to the next sheet (plan 3.5:340). If the owner says no-go on pitch, it needs its own ruling.
   - Why: one writer per file; the pinned bytes are the approval; pilot A's plates still pass LIB-3's QA on the merge card, with every flag named.

6. **D-LIB10-DECLINE (decline_bench_press's mode).**
   - Draw it as H. Its spec copies dumbbell_bench_press's supine code from the #109 head D-LIB8FIX-CARRY names (D-LIB9-CLONE (a)-(c)), never imports it, and adds the declineBench composer. Once BENCH exists, the note lists every difference between decline's copy and the template.
   - 'decline' joins BENCH's range only after its plate is pinned. LB2's plan marks become P2 T5 H5 (P2 T4 H6 if arnold_press is ruled H).
   - Why: as a BENCH child it would use 'decline' before its own anchor is approved (plan 2.2:164; 3.1:243-244); an H plate runs every check. Cost about +2.5 Opus-hours [est].

7. **D-LIB10-FACTS (what a T child's `facts` may hold).**
   - Each template exports a closed facts schema, and unknown keys throw.
   - Allowed: callouts (text, landmark, box), tells, cue, tempo (from the verified card), alt, mistakeAlt, and the Mistake, chosen from the template's own list of fault builders, each with named magnitudes.
   - Not allowed: poses, equipment, camera, trace, measure, checks, datum, ghosts, view, or any other key.
   - Every number the card does not give is listed under "Unsourced numbers" in the child's spec header (13.3 must-fix 14).
   - The supervisor rules each template's schema at the design note.
   - Why: no facts schema exists yet (plan 3.1:238 names make(params, facts) only), and an open facts object would reopen the escape hatch that params close (node.mjs:17).

8. **D-LIB10-ANCHORS (the critic's hidden anchors for LB2).**
   - A hidden anchor may be an approved, pinned pilot A plate, scored on the card facts it was approved with at its approving head. 13.7's facts diff checks it before the round. A hidden anchor is never the plate shown as the visible reference beside an LB2 plate in the same round.
   - The pair: barbell_overhead_press (pilot A) and pull_up (valid in 13.7 and 13.8).
   - For a pilot A anchor, the one-item exception needs the defect confirmed on the PNG and recorded as a pilot A follow-up in HANDOVER. Every other part of 13.5 applies unchanged.
   - Why: 13.5 was written for the 8, and LB2's census closest plate, machine_chest_press, is excluded (D-CRITIC-CAL2); pilot A's plates passed a VALID panel (D-PILOTA-R5).

9. **D-LIB10-PARENTS (plate parent and card parent).**
   - Two BENCH T children (incline_barbell_bench_press, close_grip_bench_press) and the H decline_bench_press name barbell_bench_press as card `parent` (research `0393aac`). The children's template parent is dumbbell_bench_press (plan 6.2, P:BENCH).
   - The registry row's `parent` is the plate's derivation parent. The card's `parent` governs only copy inheritance and the D-LIB5-FAMILY comparator.
   - The comparator, when ruled on LIB-9's PR (Do 9), accepts a parent row at stage shipped in the same head and refuses a parent below shipped. barbell_bench_press ships in the same batch as its children [unverified: the comparator is not built yet].
   - Why: both proofs run: H10's byte proof covers the plate parent, and the comparator's `===` covers the copy parent.

10. **LIB-3c carries D-LIB9-AUTHORQA.**
    - LIB-3c starts from main now. Its first step lands #245's D-LIB9-AUTHORQA hunk byte for byte (candidate.mjs as on `38b436d`, from `git diff origin/main...38b436d -- tools/plates/library/candidate.mjs`), with #245's A8 assertions. No separate card.
    - #245's A8 tests read LB1's files, which are not on main, so LIB-3c ports their assertions to the LIB-2b fixture; #245 keeps its own.
    - When #245 next merges main, its candidate.mjs equals main's (it takes main's file whole if git reports a conflict there), so the AUTHORQA lines it was reviewed on do not change. LIB-3c's other changes (fresh-import PQ-H7, the ranges, the child proof) do change #245's results. #245 updates the expectations LIB-3c reports (D-LIB10-CHILDPROOF item 3: at least the four D-copy `it`s, with any other row 3c-A11 lists) when it merges main, as it did for LIB-3b (lib4-cards section 13 amendment 21), then re-runs its evidence on that merged head. LB2's QA (LIB-10 Do 5 and Do 8) waits only for LIB-3c, not for LB1's ship.
    - Why: one PR, one review and one lane slot carry both; the lane cap D-LIB-LANE-ACTIVE is 4, and LIB-4b, LIB-4c, LIB-10 and LIB-3c fill it.

11. **LIB-3c's scope.**
    - LIB-3c (card lib-3c-card.md) takes, in this order: D-LIB9-AUTHORQA (item 10); D-LIB3b-H7's queued fix, "PQ-H7 builds twice from fresh spec imports" (lib-3b-card.md:151; COACHING-DECISIONS.md:2452); (i) D-LIB10-RANGES; (ii) D-LIB10-CHILDPROOF.
    - It starts from main now and may merge before #245, in a merge train.
    - Its deadline is (ii)'s item 5, and D-LIB3b-H7's: before the first batch after LB1 is QA'd.
    - Why: all of these change the spec loader and the derivation in candidate.mjs and the H checks in qa/, so one PR avoids two edits of the same lines.

### 15.1 D-LIB3c-SHARED (supervisor, 2026-10-18; LIB-3c card critic B1)

**Ruling.**
- PQ-H10 and the child proof's derive() read one object: for each PARAMS key, the family row's range when the row's family names that key, else ctx.envelope's range.
- On the real path ctx.envelope is envelope.json, which names no PARAMS key (library-qa-h10.test.ts:125 guards that in CI), so such a key fails closed with H10.envelope.
- The child proof runs only when the row's params have no other H10 problem; such a row is already red, so no verdict changes.
- library-qa-h10.test.ts stays unedited and green.
- h10 builds the object and passes it to the derivation's child rebuild. No other code reads param-ranges.json; pin.mjs, selftest.mjs and loadPins never read it (15 (i) 5).
- A derivation with clean params and no child rebuild gives `H10.child:threw`. node.mjs:298's early return stays as it is.

**Amends:** 15 (i) items 6 and 8, and (ii) items 1 and 3. The same edit also fixes (i) 7 (LIB-3c critic L3) and item 10 (critic M7). Line changes below.

**Why:**
- It keeps the existing tests as the anti-loosening guard: LIB-3b's library-qa-h10.test.ts builds every case as a D child of lib_pull_up (:27-28) and injects test ranges through ctx.envelope. Under (i) 6 and (ii) 1 as first written, derive() would throw on every case (no `D:lib_pull_up` family row), so its `[[], true]` rows and exact-key rows would go red, and no design could meet both the ruling and an unedited test.
- The real path is unchanged: every runQa caller loads the pins (gen/plates.mjs:139; proof.mjs:15; fidelity.mjs:214 on #232/#246; lb1/qa.mjs:17-24 on #245), and envelope.json names no PARAMS key.
- The LIB-3c critic rendered the fixture's derived plates byte-identical to the vendored pull_up (svg and overlay, normal and mistake, for `camera.maxScale: 1`, `bar.kind: 'straight'` and `handedness: 'both'`), so the clean rows stay `[[], true]` with the child proof on [page-level fragments unverified].

**Why nothing is loosened:** a key with no family row still fails closed on the real path; a row with any param problem is already red; the child proof and every existing H10 key keep their meaning; the test that guards envelope.json (library-qa-h10.test.ts:125) runs in npm test.

## 16. LIB-8M rulings (D-LIB8M-*, 2026-10-18)

Supervisor rulings for card LIB-8M (the LIB-8 merge card), 2026-10-18. They apply with lib-8-merge-card.md and amend D-LIB8FIX-CARRY and D-LIB8FIX-ENV (lib4-cards.md:1429-1430) only where they say so. Heads: main 2078913c; #109 200f8c33; research #263 e777388d and 2fad80ce ("LB2-RESEARCH FIXED", 6255337111; R-LB2-16, 6255377801); LIB-4c #246 68f15560; LIB-5 #244 1d1fe9ea.

D-LIB8M-CHAIN (gap 2; implements D-LIB-O5 6(b)-(c))
- tools/plates/golden.mjs: `verifyChain(entries, { batch = false } = {})`. With batch false (GOLDEN.json; golden.mjs:271 and gen/plates.mjs:88) every rule is unchanged, so approvedBy is 'owner' only.
- verifyBatchChain passes { batch: true }. approvedBy is then 'owner' or 'supervisor', and nothing else.
- 'supervisor' is valid only on one of these:
  - an entry with supersedes null whose kind is 'plate' or 'page';
  - a 'layers-page' entry whose supersedes is null or names a 'supervisor' entry.
  In both cases it needs a non-empty `decision`, and an `approval` matching `https://github.com/macdarenz-droid/M-arc/(pull|issues)/<n>#issuecomment-<id> @ <40-hex sha>`.
- 14.8 point 4's "golden-B design kinds alone" is checked by the fresh reviewer on each layers-page pin and recorded in that entry's `why`.
- The change is LIB-8M's first non-merge commit. The generated files whose inputs include golden.mjs are regenerated in the same commit. Tests go in tests/howto/lib8-chain.test.ts; golden.test.ts and L2-A14 stay unedited.
- 6(b)'s "until it is on main" reads: earlier in the same PR, before any pin commit.
- Why: 14.8 fixed the scope; this fixes the mechanics and makes `approval` checkable, with the GOLDEN path untouched.

D-LIB8M-QA (gap 4)
- After 'PILOT A CARD FIELDS VERIFIED', on the exact head, for each pinned id: runQa's full report (node and browser halves) on `candidateOf(id, { all, authoring: true })`, with qa/envelope.json and zero exemptions.
- Every hard check must pass. No hard check is exempted. A failure goes to D-LIB8M-CARDTRUE.
- Each raised flag goes on the sheet with its value and range.
  - The owner names each non-F5 flag he accepts (D-LIB8FIX-ENV; Q1 and OPEN-3 for a drawable-fault F7).
  - F5 is the supervisor's under D-LIB9-F5: value exactly 3.57, element the selected Mistake tell. The report carries the value only (qa/browser.mjs:168), so the element is recorded in the Do 9 table from qa/browser.mjs's own measurePage output for that plate (cards[chromeId][theme][width][mode].where.label; browser.mjs:67, :90-111): at the cell where the label contrast is lowest, `where.label` must be a `button.plate-callout.m…[pressed]` element in midnight. A scratch script prints that cell, the value and the `where` string; it is never committed.
  - The pin's `exemptions` equal his names, plus 'F5' where D-LIB9-F5 holds.
- After the pin, the default path with pinned exemptions gives ok true for every pinned id.
- Plan 3.5's "changed-ids sheet" is met by this first full pilot A sheet.
- Why: pilot A rows are not shipped, so this is their only full QA before the pin, and zero exemptions shows every flag.

D-LIB8M-CARRY (replaces D-LIB8FIX-CARRY's whole-page test for LIB-8M)
- The baseline is extractPlates on blob d774614a with the card-box-jump and card-reverse-lunge article spans removed. Exactly 15 cards remain.
- An e6f39ff approval (D-PILOTA-R5) counts on a later #109 head for an id only when its 9 fragment shas there equal the baseline's.
- barbell_overhead_press counts on its 8 non-tempo fragments, plus H6.tempo green and the supervisor's look. The pilot A critic ignores tempo (HANDOVER:1596).
- The five redraws, and any CARDTRUE redraw, need a fresh calibrated critic run and the supervisor's per-exercise approval on that head.
- Why: the redraws, the OHP tempo, the refreshed sources lines and the held ids all move the page, while a plate entry pins exactly the 9 fragments.

D-LIB8M-SCOPE (what LIB-8M pins)
- The pin is the 14 ids approved at e6f39ff, minus any id held later:
  - dumbbell_bench_press, incline_dumbbell_press, dumbbell_shoulder_press, barbell_overhead_press;
  - barbell_row, romanian_deadlift, single_leg_romanian_deadlift;
  - dumbbell_biceps_curl, upright_row, triceps_pushdown, rope_triceps_pushdown;
  - pec_fly, plank, mountain_climbers.
- Held: barbell_shrug, dumbbell_fly, bent_over_dumbbell_rear_delt_fly, box_jump and reverse_lunge.
- Card keys, LR-31 and Do 9 cover all 14. LR-31 for the last 7 cards is at e777388d.
- The Mistakes LIB-8M redraws are:
  - dumbbell_shoulder_press (c10) and incline_dumbbell_press (c8): R-LB2-7;
  - dumbbell_biceps_curl (c6), triceps_pushdown (c11) and rope_triceps_pushdown (c12): R-LB2-7 with R-LB2-13 to R-LB2-15;
  - single_leg_romanian_deadlift, as a sixth redraw, only when D-LIB8M-SLRDL says so.
- Why: D-LIB10-PA and R-LB2-2 put every pilot A card under LR-31, and gap 4 needs each pinned id's card.

D-LIB8M-SLRDL (single_leg_romanian_deadlift's topFault)
- At e777388d the card is in conflict with itself:
  - plate.mistake is the rounding (c7), drawable false;
  - its why names the lifted hip rotating up (c5) as what the engine cannot draw;
  - its rankNote cites c7's "many trainees", which may be an LR-31 step-1 frequency word;
  - handlingMistakes[0] is the rounding.
- Research settles it by LR-31 under R-LB2-16 (#263 6255377801), verified in the run after 2fad80ce's, which is the last verify that covers SLRDL:
  - (a) If the top fault is c5 and drawable stays false: handlingMistakes[0] becomes "Opening the hip of the lifted leg." (c5), and topFault is the ruled key 'hip-open', citing c5. The verifier checks it differs from the drawn 'round'. F7 stays raised for the owner's named exemption.
  - (b) If the top fault is c7: drawable becomes true, the blind pass picks the key, and F7 is not raised.
- The plate changes only when research's verified head makes it change: when plate.mistake (branch (a): the next fault by R-LB2-16; branch (b): the top fault) is not the drawn first tell 'round', or when the blind pass answers 'low' or 'several'. c7's frequency quote is about touching the dumbbell to the floor, which is the second tell 'low' (specs/single_leg_romanian_deadlift.mjs:178-180), so this can happen.
  - Then SLRDL is a sixth redraw, in Do 6 with the other five and in the same critic set. Its Mistake tells are reordered, or its Mistake redrawn, so the first tell is plate.mistake's fault (Q1, lib4-cards.md:1256; D-LIB8M-CARDTRUE).
  - It is never exempted. If no card-true drawing passes every hard check, it is held. A card value is never moved to fit the drawing.
- Branch (b) makes SLRDL a drawable:true plate. The supervisor then amends the plan as a docs action on claude/howto-options (not the builder's), as Q1 (c) did: 3.1:85 and :155 (the drawable-fault list), 3.3:303 (the count of drawable-fault ids) and 6.1:646 (SLRDL's "drawable-fault" label). The Owner's sheet then lists the drawable-fault convention among those not judged on this sheet, and has no expected F7.
- Why: OPEN-3 stops a drawable:false id whose key equals firstKey, and a new key needs a ruling.

D-LIB8M-TEMPO (pilot A's tempo map)
- The concentric phase takes up and the eccentric takes down. Hold takes pause, right after the concentric, only if pause > 0.
- Any other static phase, and the Work and Rest phases of a cycle plate, is a constant only with a quote that states its seconds. This extends 14.7 to the cycle plate's moving Work phase.
- A range is written as the quote's string.
- Rows:
  - barbell_overhead_press: Press ← up 1, Hold ← pause 1, Lower ← down 2. No bottom rest from c20 (Q3: a constant is allowed, never required).
  - plank: Hold = '10–60' (c12, "Hold: 10–60 seconds").
  - mountain_climbers: Work 15 move, Rest 15 (c13, "15 seconds of work and 15 seconds of rest").
- The map lives in tools/plates/library/pilot-a/tempo.json, and lib8-pin.test.ts builds each card's tempo only from it.
- A spec whose seconds differ from its card follows the card (D-LIB8M-CARDTRUE).
- Why: one map rule for every batch; H6 compares exactly; pilot A has no owner approval of its timing to keep.

D-LIB8M-NOSTRIP (box_jump and reverse_lunge)
- Both are held: stage review, `held` in plates.json, off the page and the pin. Their held lines go in before LIB-8M's first build.
- The cause: the approved card structure needs a tempo strip (golden.mjs:115-116; PQ-H2 'H2.chrome:tempo', qa/node.mjs:92). The vendored builder draws none without seconds (vendor build-page.mjs:174), and neither verified card gives seconds.
- Research is not asked.
- Both go on the named follow-up list as "a tempo strip for plates with no sourced seconds", a design card shown to the owner. They are never exempted.
- Plan 8 decision 3's airborne convention stays open until then.
- Why: with either card on the page, extractPlates throws for every id.

D-LIB8M-CARDTRUE
- This applies when Do 9 shows H6 (a fact or tempo) or F7 red on a pinned id, or when LR-31 changes its pick.
- The plate follows the card. The spec is redrawn (eq/** only by a separate ruling), re-QA'd, re-critiqued and re-approved before the sheet.
- If no card-true drawing passes every hard check, the id is held (stage review, off the page and the pin), reported, and put on the follow-up list.
- A redraw of romanian_deadlift, barbell_row or dumbbell_bench_press is reported on #245 too.
- Why: the owner has approved nothing on pilot A yet, and a card value is never moved to fit a drawing (LR-33; D-LIB8-shrug).

D-LIB8M-PAGES (replaces the proposed PLATESONLY)
- batches/pilot-a.json carries the full `pages` object at D-LIB2b-PAGES (1)'s paths:
  - plates: 'tools/plates/library/pages/pilot-a.json';
  - layers: 'tests/howto/golden/library/pilot-a.layers.html';
  - layersConfig: 'tools/plates/library/pages/pilot-a.layers.json'.
- LIB-8M does not create the two layers files (D-LIB2b-PAGES (3)). The ship card creates them with its layers-page pin.
- No code changes: registry.mjs, LIB-4c's files and the page entry's fields stay as they are.
- lib8-pin.test.ts asserts that pilot-a.json has no 'layers-page' entry and that neither layers path exists.
- Why: that is the ruled state for an unshipped batch, and L1 and C0 already cover it, unchanged (shown at 68f15560).

D-LIB8M-PAGESET
- The pinned plates page holds exactly the 14 ids with plate entries.
- Held ids get no row in batches/pilot-a.json and no entry in the chain. Their specs and cards stay unpinned.
- An id the GO leaves out is held. The page and the sheet are rebuilt without it, and the sheet is re-sent. The pin waits for an approval naming the new page sha, and A9 holds for the rest.
- Why: pageConfig needs a row per page id, a held row would block the batch that later ships it (registry.mjs:34-36), and a held plate inside a pinned page would force an 'owner' re-pin.

D-LIB8M-CARDS
- Each pinned id's card and quotes file live only at docs/research/howto/cards/<id>.json and quotes/<id>.json. They are byte copies from <RESEARCH_HEAD>, plus the three keys inserted as one text block before the final brace.
- pilot-a/cards/ is deleted. build.mjs:23, the :138 research line and plates.json's `cards` field point at that path and head.
- The supervisor merges the field commit back into claude/libht-research.
- Why: 17 of the 19 pilot A copies are stale, and QA and the sheet must read one card.

D-LIB8M-SHEET (amends D-LIB8FIX-ENV's "sheet's flag lines")
- Each plate's aside lists LIB-3's flags from the Do 9 report as its only F-lines. The report is a JSON in the scratch folder, passed to build() and never committed.
- ENVELOPE's results show as 'Page order: …' and still set the page order.
- The critic's scores replace 'pending'.
- The hand renders shown, in plates.json `hands`:
  - LIB-12's cupped and front-rack, as committed today (evidence/lib12-*.png);
  - LIB-7's curl, rope and EZ pairs, one exercise id per kind: curl dumbbell_biceps_curl, rope rope_triceps_pushdown, EZ ez_bar_curl (the IDS maps in hands/hand-curl.mjs, hand-rope.mjs and hand-ez.mjs on #193 @ 55e91e9f). Each is rendered with renderPair(id) (hands/pairs.mjs:229) from main after #193 merges, at 390 px in Silent Black and Paper as LIB-12's are, and saved as tools/plates/library/pilot-a/evidence/lib7-<key>-silent-black.png and lib7-<key>-paper.png (key curl, rope or ez: 6 new files);
  - band: one line, no render. LIB-7 has no band pair yet (hands/hand-band.mjs:1-7 on 55e91e9f: "pilot A's band kind waits on a research band-hand claim"), so the owner's look at band (plan 2.3) waits for that pair.
- The back-pain box is not re-shown: the owner chose option 1 on 2026-10-18.
- Golden B is already approvedBy 'owner' on main (tools/plates/layers/MANIFEST.json pageApproval.current; COACHING-DECISIONS.md:1501). No record changes, and the sheet need not show it.
- Why: the owner names flags by F-number, so the sheet must show exactly the flags that gate the pin (plan 3.5; plan 2.3's pilot A kinds).

D-LIB8M-ENTRY
- 'page' entry: { kind: 'page', pageSha256, bytes, approvedBy: 'supervisor', decision: 'D-LIB-PILOTA', approval, date, why, supersedes: null, prev }.
- 'plate' entry, one per pinned id: { kind: 'plate', id, src, slug, prefix, chromeId, fragments (the 9), exemptions, approvedBy: 'supervisor', decision: 'D-LIB-PILOTA', approval, date, why, supersedes: null, prev }.
- `approval` is the supervisor's per-exercise approval comment, posted after Do 9 and Do 11 on the sheet head. It names each id, the head sha, the critic run each id rests on (wf_cad21b92-9ed @ e6f39ff for carried ids; the new run for redraws) and the Do 9 table.
- `why` holds: the 10-01 delegation; the owner's flag answers verbatim, with their date; for F5, the 8's reason quoted from qa/exemptions.json.
- No layers-page entry, template sha or card stamp hash: the ship card adds them with the layers.
- Why: 14.8 points 5 and 7 (first entries are the supervisor's, with this evidence); GOLDEN.json's entries set the field pattern.

D-LIB8M-PIN
- 'PILOT A PIN GO @ <head>' names:
  - the pinned ids and the page sha;
  - the supervisor's approval comment;
  - each id's exemptions;
  and quotes the owner's flag answers verbatim, with their date.
- After it, the builder makes the one `[golden update]` commit on #109, using golden.mjs's helpers: stages, chain and MANIFEST rows.
- The supervisor checks that the commit equals the GO before the fresh review.
- Why: the supervisor fixes the content (plan 3.5's intent), and one writer on the branch avoids a mid-card push.

D-LIB8M-O5GATE (LIB-5 review Low 2)
- In stampProblems (research/stamps.mjs:50 @ 1d1fe9ea), a matching entry that is not scratch is a problem when:
  - approvedBy is not 'supervisor';
  - decision or approval is empty;
  - or open is not 0.
- Scratch entries in a marked root behave as before.
- c15.ts and c15-stamps.test.ts stay unedited. Tests go in tests/howto/lib8-stamps.test.ts.
- stamps.mjs is in no generated file's inputsFor at 1d1fe9ea (gen/library-gate.mjs:28, :36 and :54). Confirm with generate --check on the commit.
- Why: 14.8 points 3 and 7 make every real stamp 'supervisor', and today the gate accepts an 'owner' or open: 1 stamp.

D-LIB8M-GENERATED
- LIB-8M may change generated files only through `node tools/plates/generate.mjs`:
  - gen/plates.mjs's outputs: line 1;
  - src/howto/coverage.ts: the 14 pinned ids' `stage` only ('review', then 'approved-plate');
  - ids.ts, loaders.ts and ids-node.mjs: line 1.
- After the merge nothing changes on screen:
  - no app file imports coverage.ts (only tests do);
  - the 14 still have no How-to entry;
  - the 8 are unchanged.
- The supervisor sends the train's APK to the owner after the merge.
- Why: coverage.ts and the ids files hash registryInputs(), which lists every batch file (gen/ids.mjs:117-130), so a batch row must regenerate them.

D-LIB8M-ORDER
- #109 merges in checklist slot 7, after LIB-6 #181, LIB-7 #193, LIB-4d and LIB-3c (or its first two commits, 8c1973ac and 8123b50f, as their own reviewed change if the supervisor amends 15 item 10). It merges before LIB-5v (7a) and LB1 (8).
- HANDOVER:1000 reads: LIB-4b → LIB-4c (+#249) → LIB-5 → BOX-CAP → LIB-5 Do 9 → LIB-4d → LIB-6 #181 → LIB-7 #193 → LIB-3c (AUTHORQA) → #109 pilot A (7) → LIB-5v (7a) → LIB-9a's Do 9 comparator → LB1.
- Only the stalled-batch rule (plan 6.3, owner decision 8) can move #109 behind LB1, after its sheet has waited more than 2 days.
- Why: AGENTS.md's checklist rule and lib-9a-card.md:28 put LB1 after LIB-8.

14.8's open items, closed
- #109 @ 200f8c33 holds no real batch entry written with the interim 'owner': it has no batches/ row and no golden/library file.
- LIB-4c @ 68f15560 does not read approvedBy outside golden.mjs.
- The page re-pin question is not needed by LIB-8M, whose page entry is a first entry. It stays 'owner' until ruled.

Supervisor follow-ups
- Add to lib-9a-card (LB1's pin): D-LIB8M-CHAIN's approval form, and the D-LIB8M-PAGES `pages` shape.
- LIB-10: D-LIB10-PA's "not redrawn" no longer holds for dumbbell_shoulder_press and incline_dumbbell_press; LIB-10 reuses whatever LIB-8M pins. barbell_overhead_press's approving head for D-LIB10-ANCHORS becomes the head of LIB-8M's approval. LIB-10's A5 ("dumbbell_fly is in no LB2 file") needs an amendment if LIB-20 lands in time.
- Plan docs, only under D-LIB8M-SLRDL branch (b): amend plan 3.1:85 and :155, 3.3:303 and 6.1:646 on claude/howto-options (SLRDL is no longer a drawable-fault plate).
- Band hand kind: the owner sees band on a pilot sheet before LB1 merges (plan 2.3); LIB-7 has no band pair yet, so this follows the research band-hand claim, not LIB-8M.
- Follow-up list: a tempo strip for plates with no sourced seconds (box_jump, reverse_lunge); the shrug zoom (D-LIB8-shrug); dumbbell_fly (LIB-20 pitch); the rear-delt fly front view.

## 17. LIB-6-PM rulings and merge order (D-LIB6PM-*, D-LIB-ORDER-2, 2026-10-18)

Rulings for card LIB-6-PM (supervisor, 2026-10-18; from lib-6-pm-rulings-proposed.md and lib-6-pm-critic.md, all findings accepted). Cites: cards claude/sup-lib4-cards @ 1e85584a; main 2078913c; #181 9b8f76e6.

D-LIB-ORDER-2 (merge order; amends D-LIB8M-ORDER at lib4-cards :3396 and HANDOVER :1000)
- Order: LIB-4b → LIB-4c + #249 → LIB-4d (slot 3d) → LIB-5 + sup-lib5-bundle → BOX-CAP → LIB-5 Do 9 → LIB-6 #181 + LIB-6-PM → LIB-7 #193 + LIB-7-FIX → LIB-8M #109 (7) → LIB-5v (7a) → LB1 #245 (8).
- LIB-3c may merge any time after its review.
- BOX-CAP and Do 9 do not gate #181 (lib4-cards :1181).
- Post on #181 and #261.
- Reason:
  - D-LIB8M-ORDER :3396 placed LIB-4d between Do 9 and #181.
  - LIB-4d's deadline (:1428, before the first merge that ships a library row) allows any earlier slot, so merging it before LIB-5 removes that wait.
  - LIB-5v was always 7a (variant-line-card :12).
  - Checked: three-way merges of #261 with #181 @ 9b8f76e6 and with #244 @ 1d1fe9ea are clean.

D-LIB6PM-FIXTURE (amends D-LIB5-PAGE's helper :2677-2681 and lib-5-card :165)
- The back-flagged helper makes these exact-once replacements in a copy of E1's How-to, each exact-once or it throws:
  - `riskFlags: ['wrist', 'shoulder', 'elbow']` → `riskFlags: ['wrist', 'back']`;
  - the row at pull_up.howto.mjs:285, `zoom: 'top', redFlag: 'shoulder', ` → `zoom: 'top', redFlag: 'back', `;
  - the row at :289, `redFlag: 'elbow', claim` → `claim`;
  - SOURCES gains 'nhs-back' as ruled (`use: 'CONSENSUS'`).
- Only S5-L's word row may add exact-once copy edits, for its two boundary variants (exactly 450 with the box, and words.total exactly 450).
- Owner: LIB-6-PM, at tests/howto/fixtures/lib5/back-page.mjs. LIB-5's write_scope loses the helper, and Do 9 never writes one.
- Do 9 writes S5-L only if #181 is on main first. In that case it uses this helper unchanged and D-LIB6PM-CAP (D-LIB5-PAGE :2682, "whichever merges second"; Do 9 does not gate #181, :1181).
- Post on #244 and on the Do 9 PR before Do 9 starts.
- Reason: the first form measures 449 + 50 = 499 words, over 450, so S5-L and the generator's lint would refuse it. This form measures 390 + 50 = 440 with 0 violations, verified twice (golden B lintHowto; BOX-CAP lintLibraryRow).

D-LIB6PM-CAP (extends lib-5-card :27 to S5-L wherever it runs)
- In S5-L, the back box is held to BOX-CAP's named limit, imported from tools/plates/library/lint/box-caps.mjs through boxReach's key 'back-pain-box' and never copied.
- Every other box stays at 30, and the total stays at 450.
- Mutations, each red: the back box at limit + 1 words; another box at 31 words.
- Reason: under D-LIB-ORDER-2, #181 carries S5-L, and 50 is the owner's answer for this one box (option 1, #244 6250331645).

D-LIB6PM-L0 (amends Supervisor action 11, lib4-cards :2944: the line moves from LIB-4c's card to LIB-6-PM)
- tools/plates/library/ci/manifest.mjs adds three files, add-only, for every pinned row whose batch has a row whose How-to riskFlags include 'back':
  - back-box.mjs;
  - every repo module it imports statically;
  - docs/research/howto/shared/back-pain-box.json.
- back-box.mjs is loaded only on pages with a back box (D-LIB6PM-ANCHORS), so it is not in BUILDERS.
- C0 mutation: one byte of back-pain-box.json on a pinned fixture row in such a batch → red.
- LIB-4c's library-manifest.test.ts stays unedited.
- Reason: LIB-4c merges before back-box.mjs exists, and the layers page is one file per batch (manifest.mjs:67-68), so the input lands with the patch that creates it, keyed per batch.

D-LIB6PM-PLATE (extends D-LIB9-ENGINE's implementation line, :1111)
- One exact-once patch to the mirrored build-page.mjs makes :59 and :63 render each spec with the engine its imports name. The default is the layers engine.
- Every patch is applied for every plan and spec; the engine is chosen at run time, never by skipping a patch.
- Evidence: the 8's page at PAGE_SHA256; E1 and B5 byte-identical; the poly and flat-palm fixture's plate block through the vendor engine.
- Mutation: the patch dropped → red.
- Reason: D-LIB9-ENGINE answers which engine draws a library plate on its layers page (:646), and the plate block uses the layers renderPlate, which throws on poly (layers plate.mjs:45). Vendor PLATE_CSS equals layers PLATE_CSS, so no CSS changes.

D-LIB6PM-ANCHORS (amends D-LIB5-PAGE's "two exact-once patches", :2665)
- One extra anchor is allowed: a module-scope holder (for example `const __BACK = {};`).
  - It is exact-once and applied for every plan.
  - It is covered by closeups.test.ts:66-73, with a red move-mutation.
- The existing 'renderer dispatch' replacement gains the load: `if (mods.some(M => (M.default.riskFlags ?? []).includes('back'))) __BACK.backBox = (await import(BACK_BOX_URL)).backBox;`. Its anchor is unchanged and already covered.
- FLAG's `back` getter calls `__BACK.backBox()`.
- back-box.mjs loads only on a page with a back-flagged sheet. It is never imported at module scope or statically, by either the mirror or build-layers-page.mjs.
- Mutation: the load made unconditional → red.
- Reason: risksSection is synchronous, so a lazy read needs a holder filled from the async dispatch, and loading only for flagged pages keeps the L0 set exact.

D-LIB6PM-WAITS (amends D-LIB5-PAGE's "before Do 9 … throw BACK_BOX_WAITS", :2674)
- A committed test writes LIB-5's placeholder (#244 @ 1d1fe9ea back-box.mjs, all 15 lines) into a tree copy. There:
  - the back-flagged page rejects, and its message contains the line `Error: lib_cable_lateral_raise: LIB-5: back box waits for owner decision 6 (plan 8 item 6)`;
  - the unflagged page builds byte-identical.
- Mutation: FLAG made eager → red.
- Reason: Do 9 merges before #181, so only a placeholder tree can show this after Do 9. The page runs in a child process (build-layers-page.mjs:103), which is LIB-5's own form (library-shared.test.ts :130).

D-LIB6PM-CI (fulfils #181 ruling D-LIB6-ci, comment 5936426770)
- The supervisor adds, add-only, a step `node --test tools/plates/library/test/*.test.mjs` to the existing source-gate job in .github/workflows/build-apk.yml, after "Unit tests in two more time zones" (:44), in #181's train.
- Reason: no LIB-4 card or workflow ever wired these tests, so nothing in CI would rebuild the 8's page through the renderer at e7b81413.

D-LIB6PM-BRANCH (amends D-LIB9-HANDPAGE, lib4-cards :1156, section 12 item 10)
- LIB-6-PM is the only writer of claude/lib-6-closeup-renderer until #181 merges.
- The LIB-7 fixer (LIB-7-FIX) works on #193, which is based on #181's branch, and may edit build-layers-page.mjs there.
- After #181 merges, the supervisor sets #193's base to main and #193 merges main.
- Reason: two writers on one branch collide, and slot 5 must not carry slot-6 code (hands/pairs.mjs).

D-LIB6PM-LANE (amends D-LIB-LANE-ACTIVE's freed-slot order, lib4-cards :1030)
- LIB-6-PM takes a freed slot before the LIB-7 fixer.
- Reason: slot 5 merges before slot 6, and no LIB-7 fixer card exists yet (HANDOVER :1033).

## 18. LIB-7-FIX and LIB-7b rulings (D-LIB7FIX-*, D-LIB7b-*, 2026-10-18)

Rulings for cards LIB-7-FIX and LIB-7b (supervisor, 2026-10-18; from lib-7-fix-rulings-proposed.md and lib-7-fix-critic.md, all findings accepted). Cites: cards claude/sup-lib4-cards @ 0b85c963; main 2078913c; #193 55e91e9f; #181 9b8f76e6; #246 68f15560.

D-LIB7FIX-CARRY
- #193's head is unfrozen for LIB-7-FIX only.
- The 12 approvals at 55e91e9 (D-PILOTA-R5; #193 5975538224) count on a later #193 head only when all of these hold on that exact head:
  - the pins at tests/library/hand-pairs.test.ts:132 (2f9d3b7f…), :403 (fcd57af5…) and :404 (5feecaf0…) pass, with those lines unedited;
  - these files are byte-identical to 55e91e9: hands/hand-*.mjs, radial-rules.mjs, checks.mjs, claims.json, claims-extract.mjs, census-scope.json, sheet.mjs, page.mjs and gate.mjs;
  - tools/plates/library/render/closeup/zoom-css.mjs is byte-identical to 9b8f76e;
  - for each approved id and fault, the SVG in `pairPanel(HAND_OF_ID['lib_'+id])` equals `renderPair(id, { fault }).svg` with every `hp-<id dashed>-<fault>` replaced by the panel's uid.
- This applies to each head the card pushes, including every merge. A head without that run carries no approval.
- Reason: approvals carry only on byte proof against the pinned render (critic R5: 22 of 22 pages hold), and the sheet's unpinned CSS is held fixed.

D-LIB7FIX-BRANCH (one text with D-LIB6PM-BRANCH, lib4-cards :3483; amends its "and may edit build-layers-page.mjs there" and 12 item 10's "on LIB-6's branch", :1156)
- LIB-6-PM is the only writer of claude/lib-6-closeup-renderer until #181 merges.
- LIB-7-FIX works on #193 only. It edits none of these: build-layers-page.mjs, layers-spec.mjs, gen/hands.mjs, gen/handpairs.mjs, tools/plates/library/fidelity/**.
- After #181 merges, the supervisor sets #193's base to main and #193 merges main.
- Split:
  - #193 merges with the contract, D-LIB7FIX-A21, D-LIB7FIX-SCALE, D-LIB7FIX-GATE, the two Lows, D-LIB7FIX-BUDGET and D-LIB7FIX-WORDS;
  - the page hook, the generator's pair-row lines, the runner's HT-6 twin and their proofs go to card LIB-7b, on main after #193 merges.
- D-LIB4-ENTRY and 11.1 item 10 (b) are unchanged.
- Reason: none of the moved items is a merge rule for #193. Shared keys gate LIB-9's shipping; page work gates a library layers page, and LIB-8M builds none (lib-8-merge-card.md:291). So #193 merges right after #181.

D-LIB7FIX-KEY
- **Key string:** `<KEY>-<variant>-<orientation>`.
- **Identity:** module KEY × variant × orientation × the ordered fault list.
- **The loader throws when:**
  - ids on one key differ in fault list;
  - two triples give one string;
  - a key is outside `/^[a-z0-9-]+$/`;
  - `k1 + '-'` is a prefix of another key;
  - a key equals a drawn id.
- **HAND_OF_ID** maps `lib_<card id>` → key for every drawn id of any owner. It never maps one of the 8 or a gap.
- **Panel ids** start with `hp-<key>-`.
- **pairs.mjs exports `keyIndexOf(index = INDEX)`,** so mutations run in memory.
- Ids that draw the same picture under different keys keep separate keys.
- Reason: this follows 12 item 10's "variant × orientation × fault set" (:1155) with a checked identity. The probe and R4 found 8 keys over 12 ids and 7 pictures.

D-LIB7FIX-API
- `inputsFor(x)` takes a pair key (main's contract, gen/handpairs.mjs:3-4) or a drawn id.
- Both give the same list for every id on a key.
- The loader throws if a key string equals a drawn id.
- LIB-7's tests (hand-pairs.test.ts:514-524) and LIB-12's (hand-views.test.ts:211, :217) stay unedited.
- Reason: ids and keys are disjoint (no exercises.json id has '-'; every key has two), so one name serves the contract with no edit to frozen tests.

D-LIB7FIX-A21
- Applies to tests/howto/library-core.test.ts, L2-A21's first test only.
- Its title becomes "with the repo's own pair loader (or none): the written pairs and HAND's pair imports follow the shipped rows' keys".
- In its `if (pairs)` branch, :411 `expect(keys.length).toBeGreaterThan(0);` is replaced by `expect(Object.keys(pairs.HAND_OF_ID).length).toBeGreaterThan(0);`, with the comment `// D-LIB7FIX-A21: LIB-7's loader lands before any row ships a key, so keys may be []; a shipped row that needs a pair and has none is refused by gen/ids.mjs missingChunks in this file's beforeAll render`.
- Every other line of the file is unedited.
- Covering proof, in tests/library/lib7-fix.test.ts:
  - `missingChunks([{ id: 'lib_x', chromeId: 'x', slug: 'x' }], n => n !== 'hand-x', {}, { lib_x: 'curl' }, () => true)` throws /lib_x: no .*hand pair/;
  - with pairOf `{ x: 'k' }` it does not throw;
  - mutation: a temp copy of gen/ids.mjs in os.tmpdir() (never under tools/plates/, so no plugin glob or core hash sees it), its relative imports rewritten to the repo files' file URLs and its hand clause (:58, `if (archetypes[r.id] !== 'none' && …) throw`) removed → the first call no longer throws → red. The copy is deleted in `finally`.
- The "before" is recorded on a local contract-only commit (:411 red) and never pushed alone.
- Reason: `> 0` is false for the correct tree (R3). The wrong tree it stood for stays refused by missingChunks, and the mutation proves it.

D-LIB7FIX-GATE
- At the main merge, LIB-7's gate block keeps its body unchanged and goes inside `if (gate.runs('LIB-7')) { … }` before `await gate.done();`.
- tests/gate-split.test.ts:55 goes 103 → 104 (exact toBe; "+ LIB-7" in its comment).
- scripts/gate-times.json gains "LIB-7", measured as 11.1 item 16 (b) says.
- Reason: this is the only merge conflict, and 11.1 item 16 (a)/(b) sets this pattern for every card that adds a block (R3: gate-split 29/29 at 104; LIB-7 gate PASS, 22 pages).

D-LIB7FIX-SCALE
- LIB-7-FIX adds one line to tools/plates/library/scale/synthetic.mjs, directly after :22 (`symlinkSync(...)`), in a block marked LIB-7-FIX: `rmSync(join(root, 'tools/plates/library/hands/pairs.mjs'), { force: true });   // LIB-7-FIX: the clones never use LIB-7's pairs; write-ids writes its own loader, and a real one imported here would stay cached (ESM) after write-ids replaces it`.
- Evidence: tests/howto/lib-4a.test.ts A1/A2 are red before with a real loader ('no hand pair', on the local contract-only commit), then green after (R8: 10/10).
- Mutation: the line removed → A1/A2 red.
- Reason: write-ids.mjs:35-56 already replaces the loader with one pair per clone. The line only stops a stale cached module being used, and no assertion changes, so nothing is loosened.

D-LIB7FIX-BUDGET
- The cap is `handCeiling('pull-up')` (gen/hands.mjs:131; 92,917 B raw, 26,286 B gz), the largest of the 8's hand ceilings.
- (a) For every key, `pairText(key, await pairPanel(key))` is within the cap.
- (b) tests/howto/budgets.test.ts gains one test named LIB-7-FIX:
  - every key a shipped row uses has a `handpair-<key>-*.js` entry, and none is stale;
  - each entry is within the cap;
  - it is proven red on a fixture shipped list.
- (c) LIB-7's gate block checks that:
  - the built `handpair-*.js` chunks equal the shipped keys;
  - each is within its entry and the cap;
  - a missing entry fails;
  - a self-check with an oversize fixture asset is red.
- The batch PR that first ships a key adds its entry at measured + 10 %, never above the cap.
- Reason: no per-chunk ceiling holds a built handpair chunk. Only LIB-2 A25's superset How-to total counts it (screenshot-gate.mjs:9228-9251), and 11.1 item 6 (:633) sends the per-key budget here.

D-LIB7FIX-WORDS
- Every shown word of `pairPanel(key)` is approved wording, recorded with its source in tools/plates/library/hands/panel-words.json. hand-*.mjs stays frozen.
- The heading is golden B's approved hand-zoom heading, 'Hand: right and wrong'.
- Each caption is at most 10 words (CAPTION_MAX_WORDS, golden B copy-lint.mjs:47, imported). It comes from the cards' approved wording, else it is the key's label only: the approved Right note and the D-LIB7-10 fault labels already in the approved SVG.
- Pager labels are the D-LIB7-10 fault labels.
- No explaining text (the owner's UI copy rule).
- The supervisor looks at the panels on a sheet before any key ships.
- Reason: the critic approved drawings only (#193 5975538224), and LIB-7's per-pair alt texts run up to 18 words.

D-LIB7b-SCOPE (card LIB-7b; after its design note)
Each item below is one block marked LIB-7b, with its own test and mutation. Anything else in another card's file means stop.
- (a) **tools/plates/library/build-layers-page.mjs:** one post-build replacement in `buildLayersPage`.
  - For each spec row whose closeups entry names `pair`, the hand zx block becomes `await pairPanel(key)` verbatim.
  - Every page reference to it names the panel's id.
  - The page's style gains the pair scope's rules once per key.
  - No exact-once anchor is added to the vendored text.
- (b) **tools/plates/library/layers-spec.mjs:** a row is a pair row only when its batch's layers config names it (`closeups: { <id>: { …, pair: '<key>' } }`). The entry is already copied whole (:57-60); this card adds its validation only. No page build reads a pairs loader to choose rows, so configs that name no pair (the 8, E1, B5, LIB-4c scratch) build exactly as today.
- (c) **tools/plates/gen/handpairs.mjs, add-only:**
  - `export const after = ['tools/plates/gen/hands.mjs']`;
  - a shipped row whose config names pair K must have `HAND_OF_ID[id] === K` and an archetype other than 'none';
  - a 'none' row whose page holds a pair panel throws;
  - a pair row's zoom-<chromeId>.css (ctx.prev) gains the rules that style its pair panel.
  - The converse, every keyed row naming its pair, is LIB-9's D-LIB4-ENTRY check, not a generator throw.
  - gen/hands.mjs is not edited.
- (d) **tools/plates/library/fidelity/twins/ht6.mjs** (:21, :48-51 and the readers that use them): it finds a pair row's panel by its pair markup. The 8's HT-6 gate block is never touched.
- Reason: this places the page and generator work with 0 header moves (R6: hands.mjs 27, the others 0) and no loop through the scratch loaders (critic finding 5).

D-LIB7b-PAGEDUP (open until LIB-7b's Do 3 (e) measurement)
- Two pair rows on one key may repeat the panel's ids on a batch page, or one after the other in an app context, only when all three hold:
  - (1) in Chromium 141 and Chrome 153, each card's panel renders pixel-equal to the same panel alone on a page, with the other copy hidden;
  - (2) the note names every id-uniqueness check: HT7-A2 (zooms.test.ts:147-176), gate HT-7 A2 (:7382) and its twin (ht7.mjs:201), and shoot2.mjs:200;
  - (3) a new check asserts that every repeated id belongs to byte-identical pair panels of one key.
- HT7-A2's "none between two" does not apply between two rows on one pair key, because they hold one shared chunk.
- An added probe runs in one app context: open card A's hand close-up, close it, open card B's on the same key; no duplicate id is in the document (the HT-7 A2 probe).
- If (1) fails, the options, each needing a ruling, are:
  - (B) a page-only id namespace per card, with equality checked after that one named rewrite;
  - (C) ids that share a key go on separate layers pages.
- Reason: per-card byte equality stays exact, and only exact copies may repeat.

D-LIB7b-SLOT (amends D-LIB-ORDER-2, lib4-cards :3416-3417, which amends D-LIB8M-ORDER :3396)
- LIB-7b takes checklist slot 6b. The order reads: LIB-4b → LIB-4c + #249 → LIB-4d (3d) → LIB-5 + sup-lib5-bundle → BOX-CAP → LIB-5 Do 9 → LIB-6 #181 + LIB-6-PM → LIB-7 #193 + LIB-7-FIX (6) → LIB-7b (6b) → LIB-8M #109 (7) → LIB-5v (7a) → LB1 #245 (8). LIB-3c may still merge any time after its review.
- No library pin commit is made on a head that lacks LIB-7b:
  - 'PILOT A PIN GO' (D-LIB8M-PIN; LIB-8M Do 13, lib-8-merge-card.md:53) is sent only after LIB-7b is on main and merged into #109;
  - #109's merge prerequisites (lib-8-merge-card.md:56) gain "6b LIB-7b".
- Post on #109, #193 and LIB-7b's PR.
- Reason:
  - A pinned row's MANIFEST.json entry lists the static closure of every page builder, build-layers-page.mjs and hands/pairs.mjs (with panel.mjs) included (ci/manifest.mjs:4-7, :27, :60-62).
  - A keyed row's entry also lists `inputsFor(key)` (:69-71). Pilot A's plates include dumbbell_biceps_curl and rope_triceps_pushdown (lib-8-merge-card.md:117, :119), which are LIB-7 keyed ids.
  - Entries are written in the pin commit (lib-8-merge-card.md:208, :262) and change only in a commit that adds or replaces a pin (ci/manifest.mjs:14; lib4-cards :1086).
  - So merging LIB-7b before #109 is not enough on its own. A pilot A pin made before LIB-7b reaches #109 goes stale (C0 red) when #109 merges main, and would need a `[golden update]` pin replacement.

Recheck (critic, 2026-10-18, against lib4-cards @ 0b85c963 sections 16-17):
- recheck N1: applied. In D-LIB7FIX-A21 the mutation is now "hand clause (:58) removed in a temp copy outside tools/plates/". The critic's original "`!pairOf[c]` deleted" makes the check throw more, so it could not go red.
- recheck N2: applied. D-LIB7b-SLOT states 6b only and writes out the amended order. It adds the pin-timing rule (no library pin on a head without LIB-7b; 'PILOT A PIN GO' after LIB-7b is merged into #109), because MANIFEST rows are written at pin time, not merge time. It also adds the #109 prerequisite and the posts.
- recheck N3: applied. D-LIB7FIX-BRANCH wording: "edits none of these".

- Supervisor (LIB-6-PM critic finding 12, from the LIB-7-FIX critic): no early hand-pairs check is added to LIB-6-PM; LIB-7-FIX catches a moved pin. Section 16 (LIB-8M) is amended by D-LIB7b-SLOT: #109 merge prerequisites gain LIB-7b (6b), and PILOT A PIN GO waits until LIB-7b is merged into #109.

## 19. Six-key rulings, LIB-7c and D-LIB7FIX-PERKEY (2026-10-19)

### Six LB1 hand keys: rulings (D-LIB7c-*), final

Answer to LIB-7-FIX's SIX-KEY PROPOSAL (#193 6256335507). The critic's findings (lib-7c-critic.md) are applied, and D-LIB7FIX-PERKEY is ruled as option A of the critic's H2 (lib-7-fix-amend-perkey.md). Card: lib-7c-card.md. Heads: main 2078913c; #193 da65b13a; #245 38b436d5; #246 f5174db1; cards 9d06627c; research 9eaa2480 (the six cards are byte-identical at 0393aac9 and at LB2 7bced914); plan and GA 6550ce28.

D-LIB7c-KEYS
- Two new key modules, OWNER 'LIB-7c', VIEW 'radial'. Each declares its own entries under PERKEY:
  - `hand-bar.mjs` (KEY 'bar'), with variants `hang` (32 mm, archetype hang), `row` (32 mm, pull) and `pulldown` (28 mm, pull);
  - `hand-v-handle.mjs` (KEY 'v-handle'), with variant `pull` (30 mm, pull).
- Keys, when every drawing passes:

| key | ids |
|---|---|
| `bar-hang-under` | chin_up |
| `bar-hang-over` | hanging_knee_raise, assisted_pull_up |
| `bar-row-over` | inverted_row |
| `bar-pulldown-under` | underhand_lat_pulldown |
| `v-handle-pull-neutral-overhead` | close_grip_pulldown |

- Fault list: `['curled']` for every id.
- Counts come from the key set: the drawn ids are the six minus the GAPS of D-LIB7c-SHIP; one words file per drawn key.
- Research head: 9eaa2480.

D-LIB7c-ORIENT (points 1 and 3)
- Every id cites its card's `#grip.type`. Its first orientation phrase must be the drawn orientation. That phrase is the earliest match among the PHRASES lists (ANGLED counted as 'angled'); a tie or no match is refused.
- chin_up's only orientation ref is `cards/chin_up.json#grip.type` ("Underhand (supinated), palms facing you, full closed grip."). This is the first stated-orientation use of `#grip.type`. #c1 is cited as a thumb claim.
- The other ids also cite: hanging_knee_raise#c2, assisted_pull_up#c1, inverted_row#c2, underhand_lat_pulldown#c1 and close_grip_pulldown#c1.
- inverted_row is drawn overhand. The sheet flags #c2 as naming both grips.
- A3's phrase list (hand-pairs.test.ts:302) is not widened. Widening it would be a loosening, and the file is reserved for LIB-7c. No research edit; no gap.
- LIB-7c's checker holds hand-pairs.test.ts:300-331 verbatim, with one substitution (`'LIB-7'` → `'LIB-7c'`), proven equal by a text test. Its added rules run in a separate function.

D-LIB7c-CONTACT (point 2)
- Contact is one flagged `ga:` convention per variant, never a claim:
  - `row`, `pulldown` and `v-handle/pull` cite `ga:pull-base`;
  - `hang` cites `ga:hang-base`: 'GA 3.1 hang: top of the palm where the fingers start; extension 0 to 35'. It is declared in hand-bar.mjs.
- chin_up#c25 and hanging_knee_raise#c17 are recorded in DESIGN §10 as agreeing with the convention.
- A variant's convention must belong to its archetype, and every `ga:` ref must be in the merged CONVENTIONS.

D-LIB7c-FAULT (point 4)
- The study claims are the `curled` evidence: chin_up#c20, hanging_knee_raise#c16, assisted_pull_up#c14, inverted_row#c15, close_grip_pulldown#c15 and underhand_lat_pulldown#c18.
- Golden B sets the drawing values only.
- The hang Wrong rests on each card's `zooms.hand.wrong` ("Wrist curled forward."). GA 3.1 hang lists no curled fault.
- Every Wrong is the curl at the wrist alone, -30, with contact and fingers as in the Right. Never hanging_leg_raise's slip pose (golden-B follow-up 11).
- Label: "Wrist curled".
- Each element of a variant cites at least one ref from each drawn id's own card.

D-LIB7c-SHARED (point 5)
- `bar-hang-over` stays one key for hanging_knee_raise and assisted_pull_up.
- LIB-7c needs no LIB-7b code.
- LB1 ships these two ids only with LIB-7b's 7b-A3 on main (D-LIB4-ENTRY). LB1's one layers page is D-LIB7b-PAGEDUP's case, ruled before LB1 pins its page.

D-LIB7c-HANDLE (point 6)
- Separate keys stand whatever the picture.
- Each handle equals the bar its plate draws:
  - hang and row: 32 mm (pullupBar d);
  - pulldown: 28 mm (latBar d);
  - v-handle: 30 mm (2 × the vHandle grip half-thickness, = HANDLES['v-handle']).
- hang Right:
  - golden B hanging_leg_raise's pose values (ext 10, contactAt 1.0, forearm 180, thumb wrapped, squeeze firm), gravity, wristRange [0, 35];
  - `loadLine: false`, so no force line (as pull_up);
  - the contact dot kept for G4 (as the lateral raise);
  - Right note 'Base of fingers';
  - flagged on the sheet: "hang: no force line (pull_up), contact dot kept (G4)".
- `row`, `pulldown` and `v-handle/pull` use LIB-7's pullVariant unchanged.

D-LIB7c-LB1NOTE (point 7)
- LIB-9a fixes its own note in its next allowed push:
  - lb1/DESIGN.md:54 becomes `d-handle-pull-unstated`;
  - the six "no key yet" cells take the drawn keys.
- LIB-7c never edits lb1/**.

D-LIB7c-SHIP (point 8)
- A row whose archetype is not 'none' ships only with its key on main (gen/hands.mjs:192).
- A key still failing the critic after one fix round moves its ids to its module's GAPS, with the finding as the reason, and its words file is removed. The card merges with the rest.
- This includes a median below 4 on palm direction for a `bar-*-under` key.
- A row's archetype is never set to 'none' to ship it.

D-LIB7c-SCOPE (E2)
- LIB-7c adds only new files under hands/: the two modules, words/<key>.json for its drawn keys, lib7c-claims.mjs/.json, lib7c-sheet.mjs and lib7c-gate.mjs. It also adds tests/library/lib7c.test.ts and its fixtures.
- The claims file is in no `inputsFor`. lib7c-sheet attaches CLAIMS_TEXT to module copies.
- Lines in other cards' files:
  - lib7-fix.test.ts:69 `8` → `8 + |D|` (exact);
  - one guarded 'LIB-7c' gate block;
  - gate-split.test.ts:55 +1 (exact);
  - one gate-times.json entry.
- D-LIB7FIX-CARRY's "hands/hand-*.mjs" means LIB-7's five key files (lib7-fix.test.ts:208-212).

D-LIB7c-CAMERA (E3)
- hand-v-handle.mjs declares orientation `neutral-overhead` → camera 'side', with camera words 'Seen from the thumb side' written as a literal: a key module never imports pairs.mjs, because the import never settles under its top-level await (:64). A test checks the literal equals THUMB_SIDE. The checker maps it to the `neutral` phrase list.
- For LIB-7c's keys, orientation `neutral` is allowed only with a level forearm (Right forearm 90). Follow-up for LIB-12, not this card: battle_ropes is drawn `neutral` at forearm 180, so "Seen from above" (hand-battle-rope.mjs:16, :27; #191).
- Overhead under and over draw no facing row; the mirror carries the palm direction. A facing row needs its own ruling.

D-LIB7c-OWNERLOOK (E1)
- No extra pilot sheet.
- LB1's owner sheet shows the drawn keys' panels in a labelled "New hand pairs" group, with two new views flagged: underhand overhead (mirrored), and the V-handle overhead from the thumb side.
- The five-second phone test for the new tier-A keys runs on the release APK (plan :839).

D-LIB7c-SLOT (E4, under D-LIB7FIX-PERKEY)
- Lane: LIB-7c takes the next free LIB builder slot after PERKEY lands on #193. Fallback: the LIB-7-FIX session while it WAITS on its review, counted as its slot, in its own worktree, with a handoff post at handback.
- Checklist slot 7b: after LIB-5v (7a), before LB1 #245 (8). The supervisor may renumber it to any point after #193 (6) when it is READY earlier.
- 'PILOT A PIN GO' does not wait for LIB-7c, and #109's prerequisites do not include it. LIB-7c moves no file a pinned row lists (PERKEY PK4; card 7c-A10), and none of its six ids is a pilot A plate (#109 pilot-a/plates.json).
- Under the PERKEY exception, keying a pinned id changes that row's MANIFEST set (ci/manifest.mjs:69-71). So LB1's pin commit is made only on a head that holds LIB-7c.
- The same exception binds LIB-12: mountain_climbers is a pilot A plate and a LIB-12 drawn id. Slot LIB-12 before 'PILOT A PIN GO', or accept an `'owner'` pin replacement for that row.
- 'PILOT A PIN GO' still waits for LIB-7b (D-LIB7b-SLOT unchanged).
- Order: … LIB-6 #181 + LIB-6-PM → LIB-7 #193 + LIB-7-FIX with PERKEY (6) → LIB-7b (6b) → LIB-8M #109 (7) → LIB-5v (7a) → **LIB-7c (7b)** → LB1 #245 (8).

Posts
- #193: these rulings and D-LIB7FIX-PERKEY, with 'LIB-7-FIX resume'.
- #245: D-LIB7c-LB1NOTE, D-LIB7c-OWNERLOOK and the PAGEDUP note.
- #109: 'PILOT A PIN GO' does not wait for LIB-7c.
- Record as lib4-cards section 19.

Recheck (critic, 2026-10-19):
- recheck N1: applied. D-LIB7c-CAMERA's level-forearm rule is scoped to LIB-7c's keys. LIB-12's battle_ropes (neutral, forearm 180) is a follow-up for LIB-12. The camera words are a literal, since a key module cannot import pairs.mjs (the import never settles; reproduced, exit 13).
- recheck N2: applied. D-LIB7c-SLOT states the PERKEY exception: keying a pinned id changes its MANIFEST set. So LB1 pins only on a head that holds LIB-7c, and LIB-12's mountain_climbers (a pilot A plate) is flagged.
- Checked, no change needed: rulings 1-8 and E1-E5 carry the critic's verdicts and fixes. The order line matches the card's slot 7b. No contradiction with lib4-cards sections 16-18: D-LIB7b-SLOT stands, #109's prerequisites are unchanged, and D-LIB7FIX-WORDS is amended through PERKEY.

### D-LIB7FIX-PERKEY (amendment to LIB-7-FIX, before its READY)



Ruled by the supervisor as option A of the LIB-7c critic's H2 (lib-7c-critic.md). It is sent with 'LIB-7-FIX resume'. Every file:line below was opened at #193 da65b13a (the head at amendment time, unchanged since the design note), main 2078913c or #246 f5174db1.

#### Decision

Adding a hand pair key never edits a file that a pinned row lists. A new key is new files only: its `hand-<KEY>.mjs` and one `hands/words/<key>.json` per pair key.

One exception, by design: a key that maps an id which is already a pinned row adds `inputsFor(key)` to that row's MANIFEST set (ci/manifest.mjs:69-71 @ f5174db1). Such a key lands before that id's pin, or together with that row's pin replacement (`'owner'`, lib4-cards :3083-3085).

1. **Words, one file per key.**
   - `tools/plates/library/hands/panel-words.json` splits into:
     - `hands/words/chrome.json`, holding its `about` and `chrome` objects;
     - `hands/words/<key>.json`, one per pair key, each holding exactly the old `keys.<key>` object.
   - The text and source of every word are unchanged.
   - panel-words.json is removed.
2. **Declarations per module.**
   - A key module may export `CONVENTIONS`, `ORIENTATIONS` and `CAMERA_TEXT` entries, written as literals.
   - A key module never imports pairs.mjs or any module that imports it. pairs.mjs loads key modules under top-level await (:64), so such an import never settles: node exits 13 with "unsettled top-level await" (checked on a two-file repro). A module that needs THUMB_SIDE's words writes the literal, and a test asserts it equals pairs.mjs's THUMB_SIDE.
   - pairs.mjs merges them into its exported objects of the same names (:21, :23-28, :34) after MODULES loads (:64) and before INDEX (:65). The frozen readers therefore see the merged objects: sheet.mjs:49 and checks.mjs:5, :144.
   - pairs.mjs's own entries stay as they are.
   - The loader throws when:
     - a name is already defined, by pairs.mjs or by another module;
     - a module's CAMERA_TEXT names an orientation the merge does not hold;
     - a module uses (an IDS orientation, or a variant's `ga:` ref) a name declared by another module.
3. **Discovery without a list.** Key modules stay found by filename (pairs.mjs:15, :37-45). No registry or list of keys is added anywhere.
4. **Inputs per key.** `inputsFor(x)` = the static import closure of pairs.mjs, zoom.mjs and the key's own FILE (with VIEW_FILES), plus the key's INPUTS, `words/chrome.json` and that key's own `words/<key>.json`.
   - So a pinned row's MANIFEST file list holds its own key's files and the shared engine only (ci/manifest.mjs:27, :60-62, :69-71 @ f5174db1).
   - The shared engine is pairs.mjs with its static closure (panel.mjs, render/closeup/common.mjs, golden B's engine/hand.mjs and copy-lint.mjs), zoom.mjs and words/chrome.json.

#### Changes on #193 (da65b13a or later)

- **tools/plates/library/hands/panel.mjs**
  - :12-13 (`PANEL_WORDS`, `WORDS`) are replaced by:
    - `WORDS_DIR = 'tools/plates/library/hands/words'`;
    - `CHROME_WORDS = WORDS_DIR + '/chrome.json'`;
    - `wordsFileOf(key)`, which gives `WORDS_DIR/<key>.json` and throws unless key matches `/^[a-z0-9-]+$/` (panel.mjs cannot import pairs.mjs: pairs.mjs imports it, :10);
    - `readWords(key)`, which gives `{ chrome, keys: { [key]: … } }` from those two files and throws `hand panel <key>: no words in <path>`;
    - `allWords()`, which gives every key file, for tests and sweeps only and never for a panel.
  - :25 becomes `wordsOf(key, faults, all = readWords(key))`. :38 becomes `panelHtml(key, pages, all = readWords(key))`.
  - The markup and output bytes are unchanged.
- **tools/plates/library/hands/panel-words.json:** removed. In its place come new `hands/words/chrome.json` and eight `hands/words/<key>.json` files, one for each key in the card's outcome list.
- **tools/plates/library/hands/pairs.mjs**
  - :10 imports `CHROME_WORDS`, `wordsFileOf` and `panelHtml`.
  - New, exported: `BASE`, a frozen deep copy of the three objects at :21-34, taken before any merge.
  - New, exported: `declarationsOf(mods, base = BASE)`, a pure function that gives `{ CONVENTIONS, ORIENTATIONS, CAMERA_TEXT, ownerOf }` and makes the decision's throws. It never reads the merged exports, so a second call on the loaded MODULES does not throw "already defined".
  - Between :64 and :65 the loader applies it with `Object.assign` onto the exported objects.
  - The merge state lives only in that pairs.mjs instance. A fresh import (hand-pairs.test.ts:505-513; F1's fresh import) builds its own.
  - :285: `PANEL_WORDS` becomes `CHROME_WORDS` plus `wordsFileOf(keyOfCfg(e.mod, e.cfg))`.
  - :21-34 are byte-identical.
- **tests/library/lib7-fix.test.ts** (this card's own file):
  - :74 asserts CHROME_WORDS and `wordsFileOf(k)`, and that no other `words/*.json` is listed;
  - :141 and :187-195 read `PN.allWords()`;
  - :181 becomes "the key files under hands/words/ equal keysOf()";
  - PK1-PK4 are added.
- **hands/DESIGN.md:**
  - §1 :26 reads "a change to another key, adding a key included, never marks it stale";
  - §8 names the words files and the declarations.
- **docs/COACHING-DECISIONS.md:** a D-LIB7FIX-PERKEY entry.
- **src/howto/generated/loaders.ts:** its header only, through generate.mjs (pairs.mjs bytes; gen/ids.mjs:121-122).
- Not changed:
  - the FROZEN files (lib7-fix.test.ts:202-217);
  - renderPair, pairSpec, indexOf, INDEX and MODULES (signatures and outputs);
  - zoom.mjs, gen/**, ci/**, build-layers-page.mjs.

#### Acceptance (each with evidence and the mutation that must turn red)

- **PK1 Words split, panels unchanged.**
  - Before the edit, on da65b13a:
    - record the sha256 of `await pairPanel(k)` for each of the 8 keys in the PR body, as evidence for that head only. They are not pinned in a test, because LIB-7b may change panelHtml's wrapper bytes (DESIGN §8 (b); Interactions below);
    - record the parsed panel-words.json in a test fixture, tests/library/fixtures/lib7fix/panel-words-da65b13a.json.
  - After the edit:
    - on the PERKEY head, the 8 panels' sha256 equal the recorded ones (in the PR body);
    - in the test, for each key, `await pairPanel(k)` equals `panelHtml(k, pages, fixtureWords(k))` byte for byte, through the same panelHtml, where fixtureWords(k) is `{ chrome, keys: { [k]: … } }` from the fixture;
    - `{ about, chrome }` from chrome.json plus every words/<key>.json deep-equals the fixture;
    - the key files equal `keysOf()`;
    - no tool or test file names panel-words.json, apart from PK1's fixture and its reader.
  - Mutations, each red, run in memory and never as files in the repo tree:
    - one word changed in curl-dumbbell-neutral's words (both the deep-equal and that panel's equality);
    - an extra key 'zz-extra' in the allWords() list (the :181 check);
    - `readWords('zz-missing')` (throws, naming the path).
- **PK2 Inputs per key.**
  - For every key k, the entries of `inputsFor(k)` that equal WORDS_DIR or start with `WORDS_DIR + '/'` are exactly [CHROME_WORDS, wordsFileOf(k)]. Every entry is a file (statSync().isFile()), and there is no other `hand-*.mjs` (F1 :69-77 as amended). A `words/*.json` glob alone would not catch the WORDS_DIR mutation.
  - Mutations, each red:
    - inputsFor lists every words file;
    - inputsFor lists WORDS_DIR.
- **PK3 Declarations per module.**
  - `declarationsOf(MODULES.filter(m => m.OWNER === 'LIB-7'))` equals BASE (LIB-7's modules declare nothing). It is filtered by owner, so a later card's declaring module (LIB-7c) leaves it green.
  - Over MODULES of every owner, `ownerOf` gives each name exactly one owner, and the exported objects equal `declarationsOf(MODULES)`.
  - Lines :21-34 of pairs.mjs equal da65b13a's (a text compare).
  - A fixture module in memory declares `ga:zz`, orientation `zz` and its CAMERA_TEXT. indexOf, pairSpec, sheet.mjs:49 and checks.mjs:144 read the exported objects. So the test applies `declarationsOf([...MODULES, fixture])` onto them with Object.assign in a try, and deletes the fixture's names in finally, as hand-pairs.test.ts:94-97 restores HAND_PROP. Its id then:
    - passes `indexOf` and `pairSpec`;
    - shows `ga:zz` resolved in `sheet.buildSheet({ mods })`, not as "convention: undefined";
    - is checked by G8 against its own camera text.
  - Mutations, each throwing and naming both modules or the name:
    - a module redefining `ga:pull-base`;
    - two fixture modules declaring one name;
    - a module using another module's declared orientation or convention;
    - CAMERA_TEXT for an undeclared orientation.
  - The H7 fresh import (hand-pairs.test.ts:505-513) and F1's fresh import stay green.
- **PK4 Adding a key moves no pinned row's files.**
  - (a) In memory, with `idx2 = indexOf([...MODULES, dummy])`, where dummy is a fixture key module with its own declaration, applied and removed as in PK3, and one drawn id. That id is outside LB1 and LB2 (D-LIB-SCRATCHIDS), in no module's IDS or GAPS, and not a pinned row (ci/manifest.mjs pinnedRows on a LIB-4c head; the exception in the decision). For every existing key k:
    - `inputsFor(k, idx2)` deep-equals `inputsFor(k)`;
    - `await pairPanel(k, idx2)` equals `await pairPanel(k)`.
  - (b) Files: a scratch git worktree of HEAD in os.tmpdir(), removed in `finally`, gains `hands/hand-zz-dummy.mjs` and `hands/words/<dummy key>.json`. Between that tree and HEAD:
    - for every existing key, `inputsFor(k)` is equal, and so is the sha256 of each listed file;
    - the esbuild import closure of `tools/plates/library/hands/pairs.mjs` is equal. It is computed as ci/manifest.mjs:34-38 does, and is the BUILDERS term of filesOf (:27, :60-62).
    - It holds no `hand-<KEY>.mjs` and no `words/<key>.json`.
  - (c) On a head that holds LIB-4c, which merges before #193 (D-LIB-ORDER-2), (b) uses ci/manifest.mjs's own `importClosure(BUILDERS)`. It also compares, on both trees, `inputsFor(HAND_OF_ID[id])` for each keyed id, which is filesOf's other hand term (:69-71).
  - Mutations, each red, made in the scratch worktree or in memory only:
    - pairs.mjs given a static `import './hand-curl.mjs'` (the closure gains a key file);
    - inputsFor listing every module FILE;
    - inputsFor listing WORDS_DIR.
- **PK5 Approvals carry (D-LIB7FIX-CARRY).**
  - The pins at hand-pairs.test.ts :132, :403 and :404 are unedited and green.
  - The FROZEN sha256s (lib7-fix.test.ts:202-217) match.
  - F4 is 22/22.
  - `generate --check` is clean, with only loaders.ts's header moved.
- **PK6 No regression:** F12 on the READY head.

#### Nothing is loosened

- No check is removed.
- F1's :74 and F3's :181 change only the file names they read. Each keeps its assertion: the own words file is listed, the words equal the keys, and every word is approved with a source.
- The eight panels are proven byte-equal to the panels built from da65b13a's words through the same panelHtml, their sha256 are recorded for that head, and the words deep-equal.
- The redefinition and cross-module throws, and the PK4 property, are new, each with a mutation.

#### Interactions

- **The 12 approvals.** D-LIB7FIX-CARRY holds unchanged:
  - no FROZEN file and no render path changes;
  - F4's SVG equality and the three pins are untouched;
  - the panels are proven byte-equal (PK1).
- **LIB-7b.** It starts on main after #193, on top of PERKEY.
  - Its depends_on line "panel-words.json" reads "hands/words/chrome.json and words/<key>.json".
  - Its right to change only panelHtml's wrapper bytes is unchanged.
  - 7b-A3's scratch-only IDS edit joins an existing LIB-7 key, so it needs no words file.
  - D-LIB7b-SLOT stands for LIB-7b itself. It edits build-layers-page.mjs, a BUILDER (ci/manifest.mjs:27), and may edit panel.mjs. So PILOT A PIN GO still waits for LIB-7b.
- **LIB-7c.** It adds only new files: two key modules with their own declarations, and one words file per drawn key.
  - PK4 proves that no pinned row's file list or MANIFEST entry moves.
  - So PILOT A PIN GO does not wait for LIB-7c, and its slot is "before LB1". LB1's pin commit is made on a head that holds LIB-7c, because the six ids become keyed (the decision's exception).
- **LIB-12 (#191).** When it merges #193, each LIB-12 key adds its own words file as a new file. Its camera words stay in its own view-common.mjs.
  - The decision's exception applies. mountain_climbers is a pilot A plate (#109 pilot-a/plates.json) and a LIB-12 drawn id (hand-palm-flat.mjs:27). If LIB-12 merges after 'PILOT A PIN GO', mountain_climbers' MANIFEST set gains LIB-12's inputsFor(key) and needs a pin replacement (`'owner'`). The supervisor slots LIB-12 before the pin or accepts that cost.
  - LIB-7c: none of its six ids is a pilot A plate (checked), so the exception does not bite before LB1.
- **Card text.** If accepted, the supervisor makes these edits to lib-7-fix-card.md and the rulings:
  - **write_scope:** "New: tools/plates/library/hands/panel-words.json …" reads "New: tools/plates/library/hands/words/chrome.json and words/<key>.json, one per key (D-LIB7FIX-PERKEY); panel-words.json is removed". The pairs.mjs line adds "and `declarationsOf` with its call (D-LIB7FIX-PERKEY)".
  - **risk line L0-lib (:364):** "Any later edit to the shared engine (pairs.mjs and its static closure, panel.mjs included; zoom.mjs; words/chrome.json) needs a pin replacement. Adding a key (its hand-<KEY>.mjs and words/<key>.json) does not (PK4)."
  - **D-LIB7FIX-WORDS (:3579):** "recorded with its source in tools/plates/library/hands/panel-words.json" reads "recorded with its source in tools/plates/library/hands/words/chrome.json (chrome) and words/<key>.json (one file per key)".
  - **Do:** add a Do 7b, "D-LIB7FIX-PERKEY: PK1-PK4", before Do 9. Do 9's re-runs include PK1-PK5.
  - **Design note:** post the §8 delta on #193. The supervisor's look 6256326739 stands for the words, because only file names change.
- **Cost:** one fix round of a few hours before READY [est]. #193 cannot merge before #181 and LIB-6-PM anyway, so the hours fit inside that wait unless #181 is ready first.

#### Recheck (critic, 2026-10-19, against #193 da65b13a, #246 f5174db1, #109 28853e71, #191 0d268a71)
- recheck N1: applied. PK3's first check, `declarationsOf(MODULES)` equal to the base, would turn red as soon as LIB-7c's declaring module lands, so LIB-7c would have to edit this card's test. It is now filtered to OWNER 'LIB-7', with an `ownerOf` check over every owner. `BASE` is a pre-merge snapshot, so a call after the load does not throw "already defined". The PK3 and PK4 (a) fixtures apply their declarations to the exported objects in try/finally, because indexOf (:55), pairSpec, sheet.mjs:49 and checks.mjs:144 read those objects. As written, `indexOf` would throw "unknown orientation zz".
- recheck N2: applied. PK1 no longer pins the 8 panel sha256s in a test. LIB-7b keeps its right to change panelHtml's wrapper bytes (DESIGN §8 (b)), and pinned panel bytes would turn red there and force a re-pin in this card's file. PK1 now proves each panel byte-equal to the panel built through the same panelHtml from da65b13a's recorded words. The sha256s go in the PR body. Its mutations run in memory, not as files in the repo tree. PK1's own fixture is exempt from "no file names panel-words.json".
- recheck N3: applied. PK2's mutation "inputsFor lists WORDS_DIR" could not turn red: the directory is not a `words/*.json`. PK2 now checks the entries at or under WORDS_DIR exactly, and that every entry is a file.
- recheck N4: applied. A key module that imports pairs.mjs never settles (the top-level await at :64; node exits 13, reproduced). Declarations are literals, and THUMB_SIDE's words are checked by a test.
- recheck N5: applied. "Adding a key moves no pinned row's files" does not hold when the key maps an id that is already pinned: filesOf adds `inputsFor(HAND_OF_ID[row.id])` (ci/manifest.mjs:69-71). This is now stated as the exception. PK4's dummy id must not be a pinned row. LIB-12 and mountain_climbers (a pilot A plate) is flagged. LB1 pins only on a head that holds LIB-7c.
- recheck N6: applied. PK4's mutations run only in the scratch worktree or in memory.
- Checked, no change needed: no FROZEN file is touched and no render path changes, so the three pins, F4 and CARRY hold. :21-34 stay byte-identical. The esbuild closure of pairs.mjs holds no key or words file: the hand modules are loaded by a computed dynamic import (:40), and panel.mjs reads its words with readFileSync, not import. No other importer of panel.mjs or panel-words.json exists on #193 (grep). LIB-12's A7 inputsFor tests (hand-views.test.ts:205-219) assert membership only. No contradiction with lib4-cards sections 16-18: D-LIB7FIX-WORDS is amended by its own text, D-LIB7b-SLOT stands, and D-LIB7FIX-API's "key and id give one list" holds through keyOfCfg.

- Supervisor note: LIB-12 (#191) keys mountain_climbers, a pilot A plate, so LIB-12 merges after #193 and before LIB-8M's pin commit (ci/manifest.mjs:69-71). LB1 pins only on a head that holds LIB-7c.

## 20. LIB-12-FIX rulings (D-LIB12FIX-*, D-LIBHANDS-COUNT, 2026-10-19)

LIB-12-FIX rulings (D-LIB12FIX-*, supervisor, 2026-10-19; from lib-12-fix-rulings-proposed.md and lib-12-fix-critic.md, all findings accepted). Heads: #191 0d268a71; #193 da65b13a (PERKEY head not yet on origin); main f125edab; #109 774becf9; cards 39c71b01.

D-LIB12FIX-CARRY
- LIB-12's reviews (#191 5976224674 @ 0d268a7 and before) and pilot A's LIB-12 evidence (rendered at 06519f9) count on a LIB-12-FIX head only when, on that exact head:
  - each of the 20 `renderPair(id, { fault }).svg` has the sha256 recorded at 0d268a71, pinned in tests/library/lib12-fix.test.ts (combined, by the card's M1 method: `0bc3ba3d…5fee0`);
  - the 15 LIB-12 files are byte-identical to 0d268a71: the 8 hand-<key>.mjs, the 5 view-*.mjs, lib12-claims.json and gate-lib12.mjs;
  - for each LIB-12 key and fault (6 pages), the panel's SVG equals renderPair(first id, { fault }).svg with the uid swapped (lib7-fix F4's method).
- A head without that run carries nothing. A moved render stops the card; only the critic fix round re-bases the pins, by a supervisor ruling that names the new head.

D-LIB12FIX-SHIP
- No LIB-12 key ships (no shipped row maps to it, gen/hands.mjs:192) until, for that key:
  - (1) a calibrated R8 critic panel, VALID under D-CRITIC-CAL3, passes it on a head where D-LIB12FIX-CARRY's pins hold; its approval then carries by that byte proof, as D-LIB7FIX-CARRY;
  - (2) the owner has seen its kind on its pilot sheet with the critic scores: cupped and front-rack on pilot A (D-LIB8M-SHEET), palm-flat, ball-contact and battle-rope on pilot B;
  - (3) the supervisor's words look (D-LIB12FIX-WORDS).

D-LIB12FIX-WORDS
- For LIB-12's keys, D-LIB7FIX-WORDS's "approved Right note and fault labels already in the approved SVG" reads: the key module's rightNote and fault label as drawn in the reviewed SVG (#191 5976224674). Where a research shared card carries the same fault key, the label must equal that card's label.
- Words, one hands/words/<key>.json each (PERKEY decision 1):
  | key | fault | right | wrong = pager |
  |---|---|---|---|
  | ball-contact-catch-under | side-sandwich | Hands under (hand-ball-contact.mjs:14) | Hands on sides (:18; implement-wall-ball faults[0]) |
  | battle-rope-rope-neutral | death-grip | Palms facing (hand-battle-rope.mjs:17) | Too tight (:21; implement-battle-ropes faults[1]) |
  | cupped-goblet-under | weight-away | Against the chest (hand-cupped.mjs:14) | Weight away (:18; no shared card) |
  | front-rack-rack-under | bar-off-shoulders | On the shoulders (hand-front-rack.mjs:15) | Bar on hands (:19; front-rack-exemption faults[0]) |
  | palm-flat-floor-over | cupped-palm | Whole hand down (hand-palm-flat.mjs:14) | Palm cupped (:18; palm-flat faults[1]) |
  | palm-flat-floor-over | hand-ahead | Whole hand down | Hand ahead (:20; palm-flat faults[0], D-LIB5-FAULTKEYS) |
  The heading is 'Hand: right and wrong' for all, with LIB-7's source.
- The supervisor looks at the five panels on a sheet (390 px, Silent Black and Paper) before READY. The look checks words only. It does not replace the calibrated R8 critic (hands/DESIGN.md §5; plan 3.4; D-CRITIC-CAL3) or the owner's pilot-sheet look (plan 2.3).

D-LIB12FIX-GATE
- LIB-12's gate block keeps its body byte-identical. The line `if (gate.runs('LIB-12'))` goes alone above its existing `{`, as LIB-7's block (screenshot-gate.mjs:9406-9407 @ da65b13a), directly after LIB-7's guarded block and before `await gate.done();`.
- tests/gate-split.test.ts:55 becomes the merged head's count + 1, exact, with "+ LIB-12" in its comment.
- scripts/gate-times.json gains "LIB-12", measured as 11.1 item 16 (b) says.

D-LIB12FIX-SLOT (amends D-LIB7b-SLOT and D-LIB7c-SLOT's order and lane lines)
- LIB-12 #191 + LIB-12-FIX takes checklist slot 6c: … LIB-6 #181 + LIB-6-PM → LIB-7 #193 + LIB-7-FIX with PERKEY (6) → LIB-7b (6b) → LIB-12 #191 + LIB-12-FIX (6c) → LIB-8M #109 (7) → LIB-5v (7a) → LIB-7c (7b) → LB1 #245 (8).
- The supervisor may renumber LIB-12 to 6a if it is READY before LIB-7b.
- Lane: the next free LIB builder slot after PERKEY lands on #193 goes to LIB-12-FIX, then LIB-7c. LIB-7c keeps its fallback (the LIB-7-FIX session while it WAITS).
- 'PILOT A PIN GO' is sent only after LIB-12 is on main and merged into #109, and after (b) below. lib-8-merge-card.md:53 gains "LIB-7b (6b) and LIB-12 (6c) on main and merged in", and :56 gains "6b LIB-7b; 6c LIB-12", in the cards commit that records this ruling.
- (b) The supervisor runs the calibrated R8 critic panel (hands/DESIGN.md §5, sheet.mjs `--plant`; D-CRITIC-CAL3) on LIB-12's 12 drawn ids on the LIB-12-FIX head, before the pilot A sheet goes to the owner if it fits, and in any case before 'PILOT A PIN GO'. The owner sees cupped and front-rack with the critic scores, as LIB-7's hands are shown: on the pilot A sheet when the panel runs first; otherwise the supervisor sends him their scores (with a changed-ids sheet if a picture changed) before 'PILOT A PIN GO', so D-LIB12FIX-SHIP (2) holds.
  - Findings get one fix round inside LIB-12-FIX. D-LIB12FIX-CARRY's pins are re-based by a supervisor ruling naming the new head.
  - A key that still fails moves its ids to its module's GAPS (the D-LIB7c-SHIP pattern), and its words file is removed.
  - If cupped or front-rack change after the pilot A sheet was sent, the owner gets a changed-ids sheet before the pin (plan 3.5).
- After the pin, any edit to hand-palm-flat.mjs, view-palm-flat.mjs, view-common.mjs (shared by every LIB-12 view and imported by hand-battle-rope.mjs) or words/palm-flat-floor-over.json needs an `'owner'` pin replacement for mountain_climbers. A later fix to another LIB-12 view is made without touching view-common.mjs, or carries that replacement; the builder tells the supervisor first.
- Fallback: if LIB-12-FIX is not READY when #109 is otherwise ready to pin, the supervisor may move LIB-12 after #109 and accept the `'owner'` pin replacement for mountain_climbers, recorded as a ruling.
- Posts: #191, #109, LIB-7b's PR once open, #193.

D-LIB12FIX-ROPE (D-LIB7c-CAMERA's follow-up for LIB-12): deferred
- battle_ropes stays as drawn (orientation `neutral`, Right forearm 180, relabelled "Seen from above", hand-battle-rope.mjs:16, :27, :33-38). LIB-12-FIX changes no battle_ropes byte.
- Its pilot B look (critic and owner) rules one of: (i) keep; (ii) redraw at a level forearm (Right forearm 90) with the camera words 'Seen from above' and no YOU / MACHINE row (D-LIB7-11, D-LIB12-7); (iii) another camera.
- battle_ropes' row does not ship until that look has ruled.
- LIB-12-FIX appends this to docs/COACHING-DECISIONS.md and flags it on its words sheet.

D-LIBHANDS-COUNT (as ruled on #193 6257376224 and amended by 6257562588; applied by LIB-12-FIX)
- In tests/howto/library-lint.test.ts (line numbers at f125edab), a card that adds hand modules raises these five lines to exact values, in the same commit as its modules or its main merge: :241 `hands <3 + Σ fault entries>`; :302 the exact fault-entry count; :305 the test title names the real set; :307 `mods.map(m => m.src)` equals the exact sorted module list; :308 the exact pair of counts.
- LIB-7: 13; 10; 5 modules; [10, 10]. With LIB-12: 19; 16; 13 modules; [16, 16].
- No other line changes. Each value is derived and shown in the PR body.
- Mutation: remove a hand module that has fault entries (LIB-7: hand-rope.mjs; LIB-12: hand-palm-flat.mjs); each line that depends on it turns red.

- Also ruled on #109 (01:1x): D-LIB8M-O5GATE-2 (c15-stamps.test.ts:52 input becomes a complete real stamp; bare entry pinned in lib8-stamps.test.ts) and D-LIB8M-MISTAKEPARTS, D-LIB8M-DEG, -NOFACTS, -SLRDLLINE (comments 6257604182, 6257123813, 6257000888). R-LB2-27 merged (#268, research f57e7944).

## 21. Pilot A critic panel and TOPFAULT (D-LIB8M-CRIT1, D-LIB8M-TF1, 2026-10-19 ~02:40 UTC; #109 @ `83735ab`)

### 21.1 Critic panel (D-LIB8M-CRIT1)
**What ran.** 13.5's calibrated panel: 3 fresh Opus critics on 9 plates, page sha256 `06d427a2…` rebuilt at `83735ab` (equal to #109's).
- The 5 redraws: triceps_pushdown, dumbbell_biceps_curl, rope_triceps_pushdown, dumbbell_shoulder_press, incline_dumbbell_press.
- Hidden anchors: pull_up and lat_pulldown, on golden B's own facts (13.7's facts diff done before the round: lat_pulldown.mjs:19, :70, :163-166; pull_up.mjs:112-120).
- Plants, both passing every hard check: the curl's 'Elbows at sides' leader moved to the shoulder (R4); triceps_pushdown's 'Leaning over' Mistake drawn leaning back (R5).

**Calibration: VALID.**
- Both plants caught on their target items: curl R4 [2, 2, 2]; pushdown R5 [2, 2, 2].
- Each anchor has one low item, R2 [3, 3, 4], every other item 4 or more. The supervisor confirmed both on the PNGs (13.5's one-item exception):
  - pull_up: the bar bracket ends in a wall plate with no wall, upright or floor line (dark.png x 365-494, y 118-185).
  - lat_pulldown: the thigh roller at (385, 512) has no post, and the seat base (x 228-362) is not joined to the tower base (x 458 on).
  - Both are golden-B follow-ups in HANDOVER. Rounds 13.7 and 13.8 scored R2 at 4 or more; the defects are real on the PNGs, so this panel is accurate, not harsh.

**Result** (medians; R8 and R9 unscored, 13.1):
- Pass on every scored item: triceps_pushdown (R1 5, R2 5, R3 5, R4 4, R5 4, R6 5, R7 4), dumbbell_biceps_curl (4, 5, 5, 5, 4, 5, 5), rope_triceps_pushdown (5, 4, 5, 5, 4, 5, 4), dumbbell_shoulder_press (4, 4, 5, 5, 4, 4, 4, R10 5).
- incline_dumbbell_press R5 [4, 3, 3] (the rest 5; R10 4): 'LOW BACK ARCHES' is a red dashed half-dome over the belly (mistake-dark.png x 313-390, y 467-535) with an arrow from (350, 512) to (375, 480). The low back never leaves the pad, so it reads as a belly, not an arch. Confirmed on the PNG.
- **Fix (card Do 10, round 1).** In the Mistake only: remove the dome. Draw the red dashed back outline in the approved Mistake style (plank 'LOW BACK SAGS'): it leaves the pad just below the shoulder blades (about (300-318, 455-462)), rises about 18-20 px off the pad at the lumbar spine (about (361-364, 482-491)) and meets the pad again at the buttock (about (400, 548-555)), leaving a visible gap of background between back and pad. The arrow runs perpendicular to the pad from inside that gap to the peak. 'HIPS TIP' stays as drawn. Shoulder (316, 433) and hip (420, 519) stay, so every measured segment is kept (trunk 134-135 px). The tells (keys, labels, cues, order) stay byte-identical, so 21.2's 'arch' answer stands. Every hard check passes; Do 9 re-runs for it.

### 21.2 TOPFAULT @ `f57e7944`, plate head `83735ab` (D-LIB8M-TF1)
**What ran.** D-LIB5-TOPFAULT's blind pass (OPEN-3), once per pinned id, each a fresh Opus agent reading one input file: the card's fault, its claim ids and verbatim quotes, and the plate's Mistake tells (key, label, cue) shuffled, with no firstKey. The 14 cards equal `f57e7944`'s blobs. The answers were posted on #109 before any comparison.

| id | answer | ruling |
|---|---|---|
| incline_dumbbell_press | arch | topFault 'arch' |
| dumbbell_shoulder_press | behind | topFault 'behind' |
| barbell_overhead_press | elbows | topFault 'elbows' |
| barbell_row | swing | topFault 'swing' |
| romanian_deadlift | round | topFault 'round' |
| single_leg_romanian_deadlift | round | topFault 'round' (D-LIB8M-SLRDL branch (b)) |
| mountain_climbers | hike | topFault 'hike' |
| dumbbell_bench_press | arch | stop: differs from firstKey 'hips' (point 2) |
| triceps_pushdown | several: lean, arch | stop (point 3) |
| rope_triceps_pushdown | several: lean, arch | stop (point 3) |
| upright_row | several: chin, elbows | stop (point 3) |
| pec_fly | several: apart, short | stop (point 3) |
| plank | several: sag, drop | stop (point 3) |
| dumbbell_biceps_curl | none (drawable:false; top fault: wrists bending, c6) | point 4 |

**Rulings.**
1. The seven single-key answers equal their firstKey: Do 7 writes them as topFault.
2. dumbbell_bench_press: the card's fault is the low-back arch; the plate's first tell is the hip lift. The plate follows the card (D-LIB8M-CARDTRUE, as D-LIB8M-SLRDL does): reorder the Mistake tells so 'arch' is first. If keys, labels and cues stay byte-identical, the blind inputs are unchanged and the posted 'arch' stands (no new pass). If the pose or any tell text must change, it is a redraw under point 3. It joins the critic recheck and Do 9. Report it on #245 (CARDTRUE) and for LIB-10 (D-LIB10-PA reuses this plate).
3. The 5 'several' ids: on each plate both tells name the card's one fault (the same fault said twice, or the card's fault split in two), so the plate does not say which drawn tell is the card's fault. The plate follows the card (CARDTRUE):
   - Redraw the Mistake tells, and the pose only where needed, so exactly one tell names plate.mistake.what's fault and is first. A second tell, if kept, names a different fault from the card's handlingMistakes that the pose shows. Never edit a card; every hard check passes.
   - Then Do 9 for the id, the critic recheck, and one fresh blind pass on the redrawn tells at the new plate head (card L6: TOPFAULT is read on the redrawn tells). That pass is final: 'none', 'several' or a key that differs from firstKey holds the id (CARDTRUE: stage review, off the page and the pin, on the follow-up list). The first answers stay posted; no pass is ever repeated on the same tells.
   - For these 5 the recheck is their first critic run, so plan 3.4's one fix round and one recheck apply. For incline_dumbbell_press the recheck is its second run, and a second fail goes to the supervisor.
4. dumbbell_biceps_curl (drawable:false since R-LB2-27): no tell names the bent wrist, so OPEN-3 needs a ruled key. topFault is 'wrist-bend', citing c6 (as D-LIB8M-SLRDL (a) ruled 'hip-open'; the key is unused at `83735ab`). The CARD FIELDS verifier checks it differs from the drawn 'elbows' (Q1's drawable:false check). F7 stays raised: the curl joins the expected flag set as a drawable-fault plate ("bent wrist, c6, not visible side-on; R-LB2-27") and needs the owner's named yes on the sheet. The plate is unchanged.
5. single_leg_romanian_deadlift is branch (b): drawable true, F7 not raised, not a redraw. The supervisor makes the plan amendments on claude/howto-options (3.1:85 and :155, 3.3:303, 6.1:646), and adds the curl as a drawable-fault plate in the same docs action.
6. Card amendments: A4 reads "F7 is not raised, except on dumbbell_biceps_curl (D-LIB8M-TF1 4)"; A4's redraw set adds the point 2 and point 3 ids; the note's expected flag set (Do 5 e) adds F7 on dumbbell_biceps_curl.
7. Order: one fix round holding the incline fix and the points 2 and 3 redraws, then 'PILOT A FIX READY @ <sha>'. The supervisor then runs the blind pass (point 3) and one calibrated recheck on every changed plate (2 anchors, 2 plants). Meanwhile Do 7 may write the keys for the 8 settled ids (points 1 and 4, plus the bench if point 2 is a pure reorder); one CARD FIELDS verify covers all 14 at the end.

**Why nothing is loosened.** F7, OPEN-3's stop answers and its no-repeat rule stand: no stopped id gets a key from its first answer, and each new pass reads new tells only. Each redraw follows the card, never the reverse, and passes every hard check, Do 9 and the critic. A plate that still fails is held, not exempted.
