# M/ARC Audit 3

**Date:** 2 October 2026. **Prepared for:** Marc. **Version:** 37.1.0. **Audited main:** `94fd32cf4a743ea62f60dce8bba21a2796205219`.

**Report-only scope:** This report is the only intended repository change. The user asked to stop code changes and put the findings in Audit 3. Application, test, configuration and policy-document experiments described below remain unpublished local prototypes; none is presented as merged, deployed or applied remediation. Existing local work is preserved, not included in this report-only change.

## Executive assessment
M/ARC has a strong local-first training foundation and a substantial automated test suite. It is not yet supported by enough evidence for an unconditional release sign-off. The fresh review found concrete failures in consent retry, data import, export safety, workout timing and cross-feature state handling. Some have tested local repair prototypes; all findings below are assessed against the audited main, with implementation or product decisions still required. Phone behavior, the final signed Android bundle and Play Console declarations remain separate release gates.

The most useful next step is to close correctness and data-preservation gaps before adding more features. Preserve the full 153-exercise How-to goal. Eight guides are currently reachable; 145 remain pending. Eight approved guides are useful delivered functionality, but they do not establish completion of the intended 153-guide scope.

This report distinguishes three questions: what was true on the audited main snapshot; what this QA pass reproduced or source-confirmed; and what unpublished repair prototypes and release evidence establish. A passing unit suite does not certify every workout sequence, real phone, model response or scientific claim.

**Audited baseline:** main commit 94fd32cf4a743ea62f60dce8bba21a2796205219. Main subsequently advanced to 36b4b3f through documentation-only changes; the application audit baseline remains 94fd32c. Prior Codex and improvement audits were reviewed first. The original audit's 31 non-Windows fixes are merged according to the repository review; DEV-01 was owner-skipped. Those merged fixes are progress, not proof that every adjacent counterexample is closed. The improvement audit's 21 detailed findings plus secondary IMP-E06 remain a separate backlog, with specific repairs and residuals identified below.

**Status at handoff:** report only. No code or test changes from this pass were pushed, merged or deployed. The prototype hashes below identify preserved local experiments and are not linked to GitHub because those objects were not published. Their tests are feasibility evidence, not shipped fixes or final acceptance. There is no final combined-fix acceptance result and no fresh browser, APK or physical-device pass.

### Decisions and actions that matter most
1. Protect recorded work and personal data. Resolve substitution after committed sets, stale-tab reset resurrection and app-owned export-cache deletion. Keep imports unable to persist a state that crashes normal readers.
2. Use the findings and local prototype evidence to plan a later authorized repair pass. Before accepting any implementation, rerun the full checks on its exact combined commit.
3. Use one shared workout context for live targets, equipment, pause/rest facts and Escobar. A more capable model cannot repair false facts supplied by the app.
4. Complete the agreed guide coverage through the existing per-exercise review process. Do not silently redefine the scope to eight guides.
5. Verify Play declarations, the publicly accessible privacy policy, deployed reporting route and signed bundle on real devices before submission.

## Evidence and coverage
### What the checks establish
The fresh work used synthetic state, real source functions, controlled asynchronous completions and mocked transport/native boundaries. No paid AI call was made. Model behavior was exercised through scripted responses and source-boundary tests, not a live evaluation of model reasoning, training advice, latency or prompt-injection resistance.

| Check | Observed result | Boundary |
|---|---|---|
| Clean baseline app typecheck and build | Passed | Exact baseline source; desktop build evidence |
| Worker typecheck and tests | 163 of 163 passed | Local Worker tests; deployed configuration unverified |
| Offline test harness with unchanged app source | UTC, New York, Manila and Auckland: 2598 of 2598 unit tests passed; performance: 3 of 3 | Test-only isolation and fixture corrections; app bundle byte-identical to baseline |
| Auckland suite | 2598 of 2598 passed after local reviewed test-fixture corrections | Distinguish test-fixture correction from an application defect |
| Browser gate | Not run locally | Chromium could not create required OS sockets; no browser pass is claimed |
| Physical Android and wearable checks | Not performed | Native boundary simulations do not replace handset or sensor tests |
| Local combined repair experiment | Intermediate head 7c177de2 passed typecheck and 107 new regressions; later c27a0db0 was not finally validated | Unpublished experiment; no final combined-suite or release acceptance |

The unchanged baseline full test attempt passed 2596 of 2597 unit tests, with one timezone-dependent fixture failure; the separate timezone run was interrupted when an unstubbed health-check path was identified. Baseline performance did not run because the unit command short-circuited. The unpublished test-only harness blocks real fetch unless a test explicitly mocks it; attempted access fails the test even if application code catches the rejection. This improves test isolation. It does not establish that a production request succeeded, and the health check is not a paid model call.

The final test-only harness is `ffb18ee645e8c55ec76f8b96a33bc2eb54a715b1`; application source is unchanged. All four timezone suites, performance, typecheck and build passed on that harness, not on the untouched original test files. The initial Auckland fixture treated a timestamp one hour before local midnight as if it belonged to today. A further fixture crossed a real daylight-saving jump and expected 03:00 instead of 04:00. These are expectation problems in tests, not evidence to change correct local-date or elapsed-time behavior merely to make a suite green.

**How to read prototype proof:** “Failed before / passed after” below means the stated local synthetic cases changed as expected in an unpublished experiment. It does not close the finding on audited main, authorize implementation, or substitute for final integration, browser or device acceptance.

### Meaning of the labels
**New** means a counterexample newly established in this pass. **Reopened or residual** means another path remains within a previously repaired contract. **Known pending** means an earlier finding remains relevant; it is not counted again as a new root cause. **Carry-forward** means retained from the prior report without a fresh full reproduction in this pass.

**Confirmed reproduction** uses an executable counterexample against actual source logic with synthetic inputs. **Source-confirmed** identifies a reachable implementation path without a complete browser or phone reenactment. **Unverified** means evidence from a device, deployment, Console or live provider is still needed. A passing counterexample assertion can prove a defect exists; it is not necessarily an acceptance-test pass.

P1 means correct before release or reliance on the affected promise. P2 means a material incorrect result, data behavior, access problem or workflow defect. P3 means narrower inconsistency. These are engineering priorities, not clinical risk scores or a security certification. No new P0 or P1 issue was established by the fresh reproductions; several P2 data and privacy defects are still important release decisions.

### Coverage boundaries
The source review spans the app shell and five destinations, workout setup/live/finish, history, progression/recovery/readiness, profile/settings, backups/CSV/rescue, PWA, native wrappers, Escobar tools and Worker, and the guide registry. The first audit's control-family map remains useful context. This pass does not claim to click every control, validate every exercise's biomechanics, certify accessibility or systematically review every scientific claim.

The relay is a separate product and is outside this M/ARC assessment. Legacy material matters at migration boundaries. Generated guides were assessed through the registry and content system; their technique quality was not visually or scientifically certified here. No real health records, signing credentials or production data were used.

### Separate in flight guide review context
Existing reviewers examined the unmerged PR 109 head `c19805a`. One [critic review](https://github.com/macdarenz-droid/M-arc/pull/109#issuecomment-5950197626) passed 13 of 17 visual cases but required four fixes and a conditional scorecard. A [subsequent review](https://github.com/macdarenz-droid/M-arc/pull/109#issuecomment-5950292136) reported narrow-width overlaps, duplicate IDs and measurement artifacts; Chrome 153 and H6 were not run.

These are other reviewers' evidence on an unmerged branch. They are not fresh reproductions against this audit's main, accepted exercise-library coverage, or proof that all 153 guides are ready. The main coverage count remains eight reachable guides. Keep this review stream separate from the main finding count and final content acceptance.

## Prioritized findings and prototype evidence
### Consent and coach actions
#### COACH 01 Retry can resend information after sharing is switched off
**P2 • New • Confirmed reproduction.** Start an online turn containing a synthetic body-weight or health fact. Let the first request return a retryable busy/timeout result before visible output. Switch off the relevant sharing gate during the two-second retry delay. On the baseline, the second request reused the already serialized payload and still contained the protected number.

**Effect:** a fresh transmission can occur after the user revokes that sharing choice. The source is loop.ts lines 375–390. The narrow local prototype rebuilds and redacts request messages against current state before every transport attempt, while retaining the online-enabled guard and retry limits.

**Proof and status:** two privacy assertions failed before; all four acceptance cases passed after, including unchanged sharing and coach-off behavior. The focused offline suite passed 216 tests across six files and typecheck passed. Local prototype reference: 404ac7193f2d0dd9b8d3bd3bd82bb3cb4cab0dba, unpublished and not applied on main.

**Residual:** this is a structured-data retry repair. It does not promise comprehensive retroactive redaction of numbers in historical prose, memories or summaries. Define that contract explicitly and test it separately. [S01](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/loop.ts#L375-L390)

#### IMP E02 and IMP E03 Undo can affect the wrong conversation or overwrite newer profile data
**P2 • Known pending on baseline • Confirmed reproduction and tested local prototype.** Proposal IDs repeat between chats. The baseline toast captured only proposal ID, so tapping one chat's Undo while viewing another could undo that other chat's same-numbered proposal. Separately, 80 → coach 82 → manual 81 → Undo could restore 80 and leave duplicate same-day weight rows or a false insight about the undone weight.

**Effect:** Undo can reverse a different action or a later correction. The local prototype binds the toast to its original conversation and makes profile inverses conditional on the identities of their own history event and day row. It refuses unsafe same-day inverses, preserves later-day/current values and unrelated edits, removes only its own history event, and prevents repeated Apply/Undo consumption.

**Proof and status:** the final 24-test suite had 11 failing correctness assertions against baseline source and passed 24 of 24 after repair; typecheck passed. Local prototype reference: 62103c63882e5547bcd9b177ddb1754d7ba31e51, unpublished and not applied on main.

**Residual:** conservative checks may refuse Undo after a state replacement. The eight-second UI window is unchanged. Other proposal families retain their own concurrency semantics; this is not a claim that every inverse is now conflict-safe. [S02](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/apply.ts#L152-L173)

#### IMP E01 and IMP E05 Escobar receives different workout facts from the live screen
**P2 • Known pending • Freshly reproduced.** A stored active load factor of 0.8 is ignored by Escobar's independently reconstructed context. A workout with ten active minutes and ten minutes in its current pause reports twenty minutes; a frozen 60-second rest reports zero; an entered but uncommitted draft can count as a completed set.

**Effect:** even a perfectly reasoned answer can advise from the wrong target, duration or completion count. Use the active entry's factor and the same elapsed-time, rest and committed-set helpers as Train. Test midnight, wrong-split overrides, pause/resume, restored sessions and draft versus committed sets.

**Proof and status:** ten new correctness tests failed before the bounded repair; the new suite plus existing read/brief tests passed 112 of 112 afterward, including separate New York and Manila runs. Typecheck passed. Local prototype reference: 0889ab76549dd419837a95b1b6ad497d450543a3, unpublished and not applied on main. The patch reuses persisted active factors, current working-row counts, plannedExercises, elapsed/rest helpers and the committed-working-set predicate. It preserves current-day readiness after midnight and the existing explicit plannedSets override.

**Residual:** this is not full unification of every Train/coach computation; replacement provenance and global history/progression policy retain their existing behavior. These are deterministic context defects and repairs, not measured model hallucinations. [S03](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/tools/context.ts#L98-L112)

#### IMP E04 and IMP E06 Apply has entity and side effect gaps
**IMP-E04 P2 • Known pending on baseline • Source-confirmed and tested local prototype.** A pending equipment proposal fingerprints equipment maps but not gym existence. Deleting an empty referenced gym can leave the fingerprint unchanged, allowing a profile to be saved under a missing gym ID and influence another gym's fallback. The proposed repair rechecks gym existence at Apply for exercise and equipment-group scopes, while allowing a surviving explicitly targeted gym after active-gym selection changes.

**IMP-E06 P3 • Known pending on baseline • Source-confirmed and tested local prototype.** A haptics proposal changes the saved preference without synchronizing the separate runtime switch. The proposed shared setting helper calls the existing runtime setter for haptics on both Apply and Undo; unrelated settings leave it alone.

**Proof and status:** four new correctness assertions failed before and all 30 focused tests passed after, including six new boundary cases, twelve Undo-integrity tests and existing Apply/reminder cases. Typecheck passed. Reference: f438ed4f2f95cdc6d4cc2d74fc08a051d93d8cf6, unpublished and not applied on main. Haptics proof uses the real web alert path with a mocked vibration adapter, not physical vibration.

**Independent review: CHANGES NEEDED.** The active-gym-change test never actually changes selection: adding the gym already makes it active, and selecting that same gym again does not exercise the intended boundary. The reviewer independently passed the 30 focused tests and typecheck and found the production diff apparently sound, but required a test that switches to a different existing gym and proves Apply still writes to the explicit target. That correction was not completed before the user stopped code work. This prototype is not review-approved, and the surviving-target-after-selection-change case is not established by the existing test.

**Residual:** the generic equipment writer and stored shape are unchanged. Conflicts when equipment Undo follows a later target deletion remain outside this bounded repair. [S04](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/tools/actions.ts#L102)

### Data preservation and privacy
#### DATA 01 Custom exercise imports can still produce an unreadable saved state
**P2 • Reopened • Confirmed reproduction.** Import an otherwise valid backup with a working-set session referencing a custom exercise containing only a string ID and name. Baseline repair accepts it with zero dropped records; recovery readers iterate missing muscle metadata and throw. On reload the saved state is still selected, so corruption fallback does not rescue this structurally accepted state.

**Effect:** a backup accepted as valid can cause persistent normal-reader failures. The local prototype validates required custom-exercise metadata and uses existing repair/drop counts while retaining session data; it adds no stored schema.

**Proof and status:** ten malformed-record cases failed before the repair; valid round trips were preserved. The focused storage/backup suite passed 55 tests; expanded combined tests passed 76 and legacy migration passed nine. Typecheck passed. The first local prototype was fab3b34d. Review found legitimate pre-role records would be dropped; a423eaa1 preserves missing-role inference while rejecting malformed explicit roles. Its historical import/reload regression passed, as did 65 focused storage/migration tests. This is a corrected prototype, not another baseline defect; unpublished and not applied on main.

**Residual:** validating these custom fields does not certify arbitrary imported state. Keep the invariant that every accepted, serialized and reloaded backup can execute major selectors safely. Show repair/drop counts before the user replaces their data. [S05](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/core/store.ts#L90-L105)

#### QA CSV 01 Text exports can become spreadsheet formulas
**P2 • New • Confirmed reproduction.** Export synthetic split/exercise names such as =1+1. Baseline CSV quoting preserves the leading formula syntax. A formula-interpreting spreadsheet can treat the cell as executable spreadsheet content rather than ordinary text.

**Effect:** untrusted names or notes can change behavior when opened in another app. No exfiltration, OS command or specific spreadsheet exploit was executed. The local prototype prefixes dangerous text with an apostrophe before standard CSV quoting, while preserving actual numeric fields and ordinary text.

**Proof and status:** ten new cases failed before and passed after, covering =, +, -, @, leading whitespace/control characters, quotes and all four free-text fields. Local prototype reference: 0fb2ad6a, unpublished and not applied on main. Keep spreadsheet compatibility and numeric typing in acceptance checks. [S06](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/settings/exportCsv.ts#L6-L33)

#### QA CACHE 01 Reset does not clear app owned export copies
**P2 • New • Source-confirmed.** Native text sharing writes plaintext JSON/CSV into dated files under the app's cache. Reset clears stores and photos but does not remove the app-owned export/share cache directories. The privacy policy promises erasure of on-phone data apart from defined quarantine/display-setting exceptions.

**Effect:** a completed Reset can leave app-owned copies until eviction or uninstall. This concerns temporary files controlled by the app, not external backups the user chose to save or send. Native filesystem persistence was not reenacted on a phone.

**Repair and proof:** the proposed reset-cache patch uses per-directory queues and an ephemeral generation to clean app-owned export/share cache after outstanding writes, discard stale queued work and retain new post-reset exports. An already-open chooser does not block cleanup; an obsolete result cannot recreate lastBackupAt. Only app cache paths are removed; external files and deliberate quarantine remain. Six cache regressions failed before; 48 focused cache/native tests and a final 17-test cache/wiring suite passed after. Removing both Settings wiring calls caused the two expected failures. Typecheck passed. Reference: 6e0d07a2e94b3219b1eb40af8a8293dd6f7f9688, unpublished and not applied on main.

**Residual:** filesystem errors produce explicit failure rather than a premature success message. The tests use the native adapter; a physical export → Reset → cache inspection remains required. [S07](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/native/share.ts#L6-L12)

#### DATA 02 A stale tab can restore data before reset events arrive
**P2 • Known residual • Confirmed reproduction.** Freeze an old tab's state, clear shared storage elsewhere without delivering the storage event, then flush the old state. Baseline persistence writes it back. Delivered-event tests pass, but the missed/deferred-event window remains.

**Effect:** data a user just deleted can reappear. A read-before-write check alone is not an atomic cross-tab solution. Choose a reset generation/tombstone or coordinated write protocol, with explicit review of any persistent data change. Test deferred/missed events, resume, close, concurrent replacement and normal writes.

**Status and residual:** the simulation establishes the window, not its frequency in real browsers. Durable metadata would require an owner-approved data design if implementation resumes; it is not an active implementation dependency in this report-only scope. No broad replacement of storage was made in this pass. [S08](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/core/store.ts#L320-L381)

### Workout timing and training calculations
#### UI 05 Completed workouts can end in the future
**P2 • Residual of a prior repair • Confirmed reproduction.** At noon, enter a workout beginning 11:59 with a 60-minute duration. Baseline start validation accepts the past start but saves a 12:59 finish through retrospective entry or timing correction. Invalid dates or non-finite durations also need rejection at the shared mutation boundary.

**Effect:** a completed record can be ordered into the future and distort history and derived training state. The local prototype validates the whole positive finite interval, shares that rule with the form and handles Skip after editing duration. A follow-on correction preserves the original minute-normalized instant when an unchanged default falls within a repeated daylight-saving hour; edited values keep ordinary local parsing.

**Proof and status:** initial new tests had ten failures and one pass before repair and eleven passes after. The review added two DST-specific regressions; the New York focused suite passed 131 tests in seven files. Final local timing/replay prototype reference: 7e2ef5a98f5b49727aba0258be24be46ab623e0e. The baseline finding remains open on main. [S09](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/workout/session.ts#L582-L635)

#### ENG 05 History insertion and timing correction leave recovery calibration stale
**P2 • Known pending • Freshly reproduced with a local repair prototype.** Retiming a max-effort session across the seven-day comparison boundary leaves the stored recovery model unchanged even when a clean replay returns a different result. Inserting a retro session between existing sessions can similarly omit context that should affect later calibration.

**Effect:** the same visible history can produce different recovery state depending on how it was edited. In the local prototype, both writers invoke the existing deterministic replay over the resulting history. This fixes consistency, not scientific validation of the model.

**Proof and status:** covered by the timing/replay red/green suite above. Require finish, insert, retime, edit, delete and Undo to match clean replay. Full replay adds work on these mutations; older-device and long-history latency still need measurement. [S09](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/workout/session.ts#L582-L635)

#### ENG 02 Red readiness and lighter weeks use stale set counts
**P2 • Known pending • Freshly reproduced with a local repair prototype.** A previous five-set session and a current three-set plan can produce four suggested sets under red readiness, so all three current rows remain available instead of two. Lighter-week reductions can use a previously reduced count and compound it. A newly executed related gap showed conditioning carry targets ignoring the lighter-week set factor.

**Effect:** the stated reduction is not consistently applied to the actual current plan. The local prototype computes applicable reductions once from the raw current plan, preserves the one-set floor, retains ordinary suggestion behavior and keeps the documented timed-hold lighter-week exemption.

**Proof and status:** 15 correctness assertions failed and nine passed before; all 24 passed after. With existing progression tests, 120 tests passed in each of New York, Manila and Auckland. Typecheck passed. Local prototype reference: 2b7e1f5afd2de8059b1695ba0d593668f9b0968c, unpublished and not applied on main.

**Residual:** this does not resolve different equipment-context or active-factor defects. Amber no_increase can still increase reps/time under the stated hold-load policy; that is a product-contract question, not a newly established bug. [S10](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/brain/progression.ts#L320-L465)

#### UI R01 Substitution can erase already committed work
**P2 • Known pending • Freshly reproduced.** Commit 60 kg × 8 for bench, substitute shoulder press, then Finish. Baseline substitution replaces all sets with blank drafts; a one-exercise example finishes with no saved session. Done/skipped flags can also survive onto the blank replacement.

**Effect:** performed work disappears. Decide whether to preserve the committed original entry and add remaining work as a new substitute, or refuse substitution after logging and direct the person to Add exercise. Either approach must preserve committed history and explain the action. Do not silently choose a destructive redesign.

**Acceptance:** committed original sets survive Finish; the replacement is unfinished; exact Undo semantics are tested; later work is not overwritten. No repair is included in this report-only change. [S11](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/workout/session.ts#L356-L373)

#### Remaining identity and provenance risks
**ENG-01 P2 • Known pending • Source-confirmed:** live adjustments still use an older equipment resolver that can select another gym's load steps. Reuse the current menu for initial targets, live retargeting, warmups, fields and plate display.

**UI-R02 P2 • Known pending • Source-confirmed:** same-name custom exercises can share history through name fallback despite distinct valid IDs. Treat known IDs as authoritative and confine name fallback to unresolved legacy records.

**UI-R04 P2 • Known pending • Source-confirmed:** History edits can retain trusted-live timing/heart provenance. Preserve corrected content for records and volume while marking its timing appropriately. Adding edit metadata is a deliberate data-model decision.

**UI-R06 P2 • Known pending • Source-confirmed:** deleting a gym used by an active workout leaves a missing gym reference and can change input/menu context. Block deletion while in use or preserve a resolvable retired/snapshotted context. These issues need explicit regression tests across related screens. [S12](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/brain/history.ts#L120-L130)

### Native asynchronous work
#### IMP N01 An older alert request can undo a newer cancellation
**P2 • Known pending • Freshly reproduced with mocked promises.** Let permission or scheduling work pause, cancel the rest alert or turn backup reminders off, then resolve the older request. It can requeue the cancelled notification and restore an enabled status.

**Repair and proof:** per-family queues serialize notification mutations, with synchronous intent revisions and obsolete-schedule cleanup after asynchronous boundaries. The reminder UI rejects old results. The native prototype reference is 06438b8239ae0351076daac6457fdae73d5f0e5b, plus the permission-race delta 999ba5c5, unpublished and not applied on main. The combined native suite passed 74 focused tests after ten primary regressions failed before; the additional permission delta passed 32 focused tests. The reset follow-on reconciles backup reminders after replacement using the existing native default.

**Residual:** each family waits for its in-flight native promise. A plugin/OS promise that never settles can delay later cancellation; tests prove latest-state behavior after settlement, not recovery from a hung native call. Permission, reboot and delivery behavior still need device checks. [S13](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/native/notifications.ts#L80-L205)

#### IMP N02 A health read can repopulate data after Reset
**P2 • Known pending • Freshly reproduced.** Start a health read, replace state with a fresh reset, then resolve the old read. Baseline code recreates a health day and sets connected true.

**Repair and proof:** the native patch uses an ephemeral replacement generation covering Reset, Restore and Undo, and drops obsolete health results before mutation. It requires no new persistent field. Focused tests distinguish state replacement from ordinary updates and preserve a new explicit sync. Included in the native repair and aggregate proof above, unpublished and not applied on main. Partial reads, failures, revoked permissions and resume still need device checks. [S14](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/settings/health.ts#L13-L30)

#### IMP N03 A late web wake lock survives switching it off
**P3 • Known pending • Freshly reproduced.** Switch keep-awake off while browser lock acquisition is pending. The old promise can resolve afterward and retain its sentinel; the synthetic release count stays zero.

**Repair and proof:** the native patch tracks current intent and releases obsolete granted sentinels. Tests cover reversed acquisition order and preserve the newest lock when an older acquisition rejects. Included in the native repair and aggregate proof above, unpublished and not applied on main. No physical battery drain or native-window failure was measured. [S15](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/native/keepAwake.ts#L1-L35)

### Store disclosure accuracy
#### PLAY 01 Submission draft understates the AI report data flow
**P2 • New • Source-confirmed.** The submission draft describes health sharing as occurring only with consent when answering. The in-app report flow can upload the displayed reply, up to 4000 characters, which may contain personal numbers from an earlier answer. The privacy policy already describes this report flow.

**Effect:** the release paperwork can disagree with actual behavior even though a reporting feature and disclosure exist. Proposed documentation changes align the submission matrix and privacy language with report text, recipient, purpose, retention and the fact that choosing a reason sends the report. Local documentation prototype: 0b890f43906e477bd92a7707b73a13f1bc8848f4; it is not included in this report-only change. Actual Console answers and the published policy remain separate checks. The in-app report feature is present. [S16](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/ui/Message.tsx#L218-L226)

#### Custom server encryption claim needs qualification
**Source-confirmed release risk.** Settings requires HTTPS when entering a custom coach server, but loading an existing local saved configuration preserves an HTTP URL, and transport uses it without a scheme check. An unconditional statement that every supported request is encrypted is therefore not established by source. No successful plain-HTTP transmission or interception was attempted, and platform restrictions may affect whether it can occur.

The unpublished documentation prototype limits the guarantee to the built-in HTTPS endpoints and identifies the custom-server exception. Ordinary backup import preserves the existing local trust/endpoint configuration; this is not a claim that importing a backup automatically replaces the endpoint. Decide and test the supported custom-endpoint contract before answering the Console encryption question unconditionally. Documentation alone does not repair transport. [S23](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/core/escobarState.ts#L68-L80)

## Feature ratings
Ratings describe the audited baseline, not a measured satisfaction score or a final release grade. Scale: 1 = unusable or largely absent for the intended job; 2 = major limitations; 3 = useful with material caveats; 4 = strong implementation with bounded remaining work; 5 = complete and convincingly verified across the intended scope. Static inspection alone cannot establish a 5 for usability or reliability. The ratings are qualitative engineering judgments, and fixes should not automatically increase them without integrated evidence.

The columns are correctness, usability, reliability and value. “Correctness” means fidelity to the intended implementation contract; it does not establish medical or scientific validity. Confidence describes confidence in the assessment and its coverage.

| Feature | Correctness | Usability | Reliability | Value |
|---|---:|---:|---:|---:|
| Live workouts | 3 | 4 | 3 | 5 |
| History editing | 3 | 3 | 3 | 4 |
| Progression and targets | 3 | 4 | 3 | 4 |
| Recovery and readiness | 4 | 4 | 3 | 4 |
| Past workout logging | 3 | 3 | 3 | 4 |
| How-to against all 153 exercises | 3 | 3 | 3 | 4 |
| Today and dashboard | 3 | 4 | 3 | 4 |
| Settings and preferences | 4 | 3 | 3 | 4 |
| Backup restore and rescue | 3 | 3 | 3 | 5 |
| CSV export | 4 | 3 | 3 | 4 |
| Navigation and accessibility | 4 | 3 | 3 | 5 |
| Offline core and online boundary | 4 | 3 | 3 | 5 |

**Workout features:** medium confidence. The real mutation and calculation probes establish important edge cases and valuable existing primitives, but browser/phone journeys remain incomplete. Live workout value is high; preserving committed work is essential. Recovery correctness reflects repaired arithmetic and implementation consistency, not validated physiological predictions.

**How-to:** high confidence in the eight-of-153 coverage count, medium in registry/approval architecture and low in technique/usability validation. A correctness score of 3 does not allege that the eight guides contain incorrect cues. The missing 145 guides limit delivery of the full intended job. [S17](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/howto/ids.ts#L3-L16)

**Product surfaces and access:** medium confidence on source behavior; low on actual TalkBack, large text, keyboard and phone usability. Native buttons, focus-aware sheets, explicit reorder controls and local-first assets are useful. Long Settings and repeated dashboard summaries are improvement hypotheses rather than proven user-study failures. [S18](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/app/App.tsx#L58-L119)

**Data and platform caution:** the feature table rates the broader user-facing capability. The stricter persistence boundary assessment is 2.5/5 because of accepted unreadable custom data and reset residuals. Native reliability is 2.5/5 because of reproduced async races and missing device evidence. Privacy outside AI is 3/5. Scale/performance is 3/5 based on desktop measurements and known growth costs. Do not average these figures into an apparently precise overall score.

## Escobar assessment and improvements
### Overall judgment
Escobar is useful and thoughtfully bounded, but its deterministic context and action consistency need attention before expanding it. As an engineering assessment, its usefulness is 3.5/5; its actual live-model answer quality is unmeasured in this pass. Do not present scripted model tests as proof of safe or scientifically sound real advice.

The architecture puts training arithmetic in deterministic code, exposes local read tools, bounds conversation/tool loops and requires preview plus Apply for mutating training/settings proposals. Offline navigation and local notes remain useful without the online coach. Structured sharing gates, redaction, request limits and Durable Object quota admission are meaningful controls.

| Dimension | Baseline score out of 5 | Evidence and limit |
|---|---:|---|
| Feature usefulness | 3.5 | Relevant tools and previewed actions; real-output usefulness not measured |
| Deterministic context accuracy | 2.5 | Active factor and paused/draft facts still disagree with Train |
| Apply and Undo reliability | 2 | Explicit Apply is strong; baseline identity/inverse defects are material |
| Privacy and consent boundary | 3 | Structured gates exist; retry defect and free-text contract remain |
| Cost and abuse controls | 4 | Configured Durable Object path; production binding/caps unverified |
| Failure handling | 3.5 | Bounded retry, staged history, abort/off behavior; remaining edge cases |
| Prompt injection defenses | 3 | Policy separation and allowlists; empirical effectiveness unmeasured |
| Semantic and scientific assurance | 2 | Numeric heuristic is not evidence entailment or advice validation |

These scores use the Escobar baseline engineering assessment, with the original ten-point judgments divided by two. Confidence is medium for implementation boundaries and low for real-model outcomes. The unpublished retry and Undo prototypes improve specific test contracts; they do not change the baseline rating or establish a fresh overall grade.

### What the red team established
A numeric verifier can accept the wrong relationship if the number matches some other ledger fact. A synthetic body-weight fact of 83.731 kg can allow “sleep was 83.731 hours”; quoted numerical text may also be excluded. This characterizes a known verifier limitation, not a newly observed live-model hallucination. Correct numbers need correct units, entities, dates, cited facts and interpretation. [S19](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/verify.ts#L138-L158)

Untrusted exercise names, notes, images and tool content remain potential instruction carriers. Server policy and local allowlisted schemas reduce direct effects, while explicit Apply limits many mutations. They do not prove that the model will ignore every hostile instruction or that automatic memory actions cannot be influenced. An offline contract suite can test boundaries; a real-output adversarial evaluation needs an approved budget and suitable test data.

The prior coach-off bug is fixed at the attempt/session boundary, and the new disabled-retry regression passed. The main quota Durable Object now reserves capacity before upstream work and fails closed on exceptions/timeouts. The optional KV/no-quota paths remain softer configuration choices. Verify the actual production binding and provider spend ceiling; do not repeat the fixed admission defect as though it still exists in the configured primary path. [S20](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/escobar-worker/src/quotaDO.ts)

### Highest value changes
1. Consolidate deterministic context. Reuse the exact current workout, gym/menu, planned rows, day override, recovery/readiness, pause/rest and completed-set selectors across UI and tools.
2. Make identity and consent invariants explicit. Bind actions to conversation and entity; revalidate at Apply; make inverses conditional; serialize/redact before each attempt. Define what sharing switches mean for old prose, summaries and stored memories.
3. Improve verification carefully. Check cited fact existence plus unit, entity and observation date. Preserve the label “heuristic” until semantic evidence can support a stronger claim. Remove any implication that number matching verifies the whole answer.
4. Build a versioned evaluation set. Include relevance, correctly cited evidence, abstention, pain/eating/minor safety, action-intent precision, malicious context, fabricated citations, wrong-unit numbers, truncated streams and maximum tool chains. Use approved recorded/synthetic fixtures for repeatable offline checks.
5. Keep cost and latency bounded. Reuse selectors and batch independent local reads; measure paid tokens and latency before changing models or adding repair calls. Do not add calls to compensate for incorrect local calculations.
6. Avoid expanding automatic memory effects until origin, evidence and adversarial-input behavior are tested. Whether model-authored injury notes need review is a product decision, not an unannounced implementation change.

## Scale optimization and product scope
### Measured scale
Five-run desktop medians used synthetic history with four exercises and three working sets per session. Node was 24.19.0; other work may have been running. These are algorithm and serialization measurements, not Android startup, typing, memory, battery or frame-rate results.

| Sessions | JSON size | Parse and repair ms | Serialize ms | Recovery status ms |
|---:|---:|---:|---:|---:|
| 600 | 560383 bytes | 5.47 | 2.27 | 36.59 |
| 3000 | 2799183 bytes | 21.60 | 11.82 | 95.34 |
| 6000 | 5598183 bytes | 35.50 | 18.02 | 173.73 |

A separate 600-session regression measurement recorded model replay 50.5 ms, recovery status 19.3 ms, coach insights 44.6 ms and 680-message windowing 0.9 ms. Different fixtures and measurement conditions explain why these should not be treated as directly interchangeable benchmarks.

At 6000 sessions the recovery calculation is too long to run casually on an input-critical path. This does not itself prove visible sustained jank on a phone. Whole-state serialization and synchronous localStorage grow with all history; backups can duplicate storage demand. Browser quota behavior was not measured. The live raw heart-sample list is unbounded and recent lookup scans/allocates across it; restore also bypasses the 60-session cap used by normal heart-series storage. These are scaling risks, not demonstrated memory exhaustion.

### Optimization order
First profile an older supported Android device: cold/warm startup, input delay while editing sets, long tasks, large-history load/save, long active watch capture, background/resume and battery. Set budgets from these measurements rather than bundle size alone.

Then centralize derived context and mutation invalidation; remove duplicate calculations and native scheduling owners. Bound recent-heart lookup and maintain downsampled buckets incrementally while preserving meaningful data semantics. Move non-urgent computation away from active input where measurement warrants it. Any new persistence design, import limit or stored-data change needs an explicit migration and recovery plan.

The current lazy guide/coach/share architecture and separated live clock are worth preserving. Scaling from eight to 153 guides also increases installed/offline cache size even if each guide opens lazily. Track asset size, install/storage budgets and offline availability per supported platform. The unconditional “Saved offline” guide label should be backed by verified installed availability. [S21](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/howto/PlateView.tsx#L28-L42)

### Feature work that should come next
**Finish the 153-guide library.** Prioritize default-plan movements and representative equipment/movement families without claiming popularity data that was not collected. Reuse shared renderers, but approve each exercise's grip, posture, feel, cues, text alternatives and visual content. Completion means matching 153/153 coverage, loaders and reachable entry points, with the supported offline contract verified.

**Make recovery and exports trustworthy.** Keep JSON backup, CSV and rescue. Distinguish cancellation, preparation, sharing, download and durable saved backup outcomes. Show repair/drop counts before replacement. Verify export → locate file → clean-install restore on Android and web. A resolved share promise is not by itself proof of an external recoverable copy.

**Verify complete accessible journeys.** Start, log, reorder, finish, edit, guide, export and restore using TalkBack/keyboard, large text, reduced motion and Android Back. No essential action should depend solely on dragging, long-press, color or a tiny diagram point.

**Consolidate repeated summaries.** Reuse week summaries and top-note selectors between Today and Escobar. Keep Today focused on the next workout action, with full details reachable. Check meaning and period consistency before changing layout, then validate with a short task-based usability check.

### What to merge hide or remove
The recommended changes are targeted consolidation, not a reduction of exercise scope or core functionality. Merge repeated week/top-note presentation into shared components. Group test alerts, test haptics and exceptional diagnostics after routine Settings, while keeping privacy, data controls and needed rescue prominent. Daily spark can remain optional; changing its default is Marc's decision.

Do not remove themes, CSV, backups, local coaching or supported exercise modes simply to shrink the product. Remove unsupported certainty from claims, and remove duplicated calculation/scheduling implementations only after shared invariants are tested. Do not add social feeds, subscriptions, more AI features or the parked gym finder as a shortcut to release readiness.

## Google Play readiness
### Repository facts that are already in place
The repository uses Capacitor 8.5 and targets API 36, with a bundle check verifying the target. It is not appropriate to report an obsolete target-SDK defect from an older policy assumption. For phone/tablet submissions the current requirement is API 36 from 31 August 2026, with a possible Console extension to 1 November for eligible apps. The final bundle still needs verification. [P01]

AI-generated-content reporting exists in the app: Message opens Report, the report service sends the displayed reply and the Worker has a reporting route. The privacy URL/settings link and native Health Connect rationale exist. The health-related store disclaimer draft uses the appropriate non-medical framing. Those implementation facts do not prove that the deployed route, public URL or Console declarations are correct. [S16](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/ui/Message.tsx#L218-L226)

The Android manifest requests five read-only health types. Legacy Bluetooth/location permissions have version limits, modern scan declares non-location use, and a connected-device foreground service is present. These are source facts, not device certification. Android app backup is disclosed in the privacy policy; it should not be described as an undisclosed backup feature. [S22](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/native/patch_manifest.py)

There are no current accounts or payments in this product scope. Account-deletion and billing requirements are therefore conditional future checks, rather than present blockers invented for functionality that does not exist.

### Launch evidence still needed
| Release area | Evidence required before claiming readiness |
|---|---|
| Privacy and reports | Public privacy link loads; report endpoint works; intended D1/bindings/retention exist; report flow matches declarations |
| Health and data | Console Health apps declaration and Data safety answers match actual SDK, health, diagnostics, AI and report flows |
| Audience and listing | Ages, target audience, IARC/content rating and listing claims match the product and actual guide coverage |
| Foreground service | Console declaration and permitted connected-device use match final manifest and behavior |
| Android release artifact | Signed final AAB effective target SDK, permissions and native 16 KB compatibility verified |
| Device operation | Health/notification/Bluetooth permissions, denial/revocation, background/kill/resume, wearable silence/reconnect, sharing and reset tested |
| Production access | Account-specific testing and production-access requirements satisfied and approval actually granted |

For personal developer accounts created after 13 November 2023, the closed-test requirement is at least 12 testers opted in continuously for at least 14 days before a production-access application. Completing the test does not automatically grant production access. Verify the account's type and creation date; do not apply that rule indiscriminately to every developer account. [P02]

The current official 16 KB page-size guidance includes an update-block date of 1 February 2027. Verify the actual native libraries in the final AAB rather than infer compatibility from framework version or successful Java compilation. [P03]

This is a source-based readiness assessment checked against official policy on 2 October 2026. It is not Google approval or legal advice. Recheck the Console and official policy immediately before release, because deadlines, eligibility and account-specific requirements can change.

### Submission text repair
Correct the draft's statement about health sharing so it covers both answering a consent-enabled online request and a user-initiated report that includes the displayed reply. The wording should explain that an earlier reply may contain personal information, who receives it and why. The existing privacy disclosure and actual payload are the source of truth; do not broaden what is collected or imply that reporting uploads only a category label.

Before submission, trace a small data-flow inventory from collection through local storage, optional transmission and retention/deletion. Include report text, diagnostics, model-provider requests, Health Connect reads, photos if used and OS backup. Keep the Data safety form, privacy policy, in-app disclosure and implementation consistent. [P04–P08]

## Recommended delivery order
### For a later authorized repair pass
Keep this change report-only. If implementation is authorized later, start from the then-current main, review each repair and identify the exact combined commit. Run app typecheck, all unit tests, performance tests, Worker checks, build/source validation and the timezone matrix with network blocked by default. Obtain remote browser/Android CI evidence where local browser execution is blocked. Retain red-before/green-after tests for each repaired contract and inspect any failed or skipped gate before claiming completion. Unpublished prototypes are starting evidence, not merge-ready guarantees.

### Before relying on affected features
Resolve remaining data loss, deletion, stale actions and context inconsistencies. Prioritize substitution, stale-tab reset, export-cache cleanup, native cancellation/reset races and false live coach facts. Close the carried-forward weekly, completion, duration, historical-debrief, day-off and onboarding items with fresh proof. Treat design choices about data provenance, gym history, consent history and substitution semantics as explicit owner decisions.

### Before store submission
Complete the agreed guide scope or obtain an explicit staged-release decision with accurate listing claims. Verify the final signed artifact, device journeys, public/deployed endpoints and Console declarations. Capture the actual results, dates, devices and versions. A green CI run alone cannot answer these checks.

## Appendix A Prior finding reconciliation
### Original Codex audit
The first audit recorded 32 primary findings: four P1 and 28 P2, including scientific-validation/claim-precision gaps. The 31 non-Windows fixes are reported merged; DEV-01 was deliberately skipped by the owner. This report does not replay all 31 as independently validated closures. The fresh review found residual counterexamples for DATA-01, DATA-02 and UI-05, so a merged fix count must not be used as a universal acceptance statement.

Source-observed improvements include paid admission reservations/fail-closed handling on the configured Durable Object path, coach-off cancellation, PWA cached navigation fallback on 5xx, profile/keyboard/reorder improvements, and prior heart freshness/pause repairs. The original scientific validation caveats remain caveats even where wording or implementation was corrected. [A01](https://github.com/macdarenz-droid/M-arc/blob/7596ee385fe622b8f4635146368505644960c352/codex-audit.md)

### Improvement audit backlog
The following index avoids counting prior defects as new. “Prior evidence only” means the earlier report supplies a specific source/probe, but this pass does not assert a fresh runtime reproduction. It must be revalidated before final closure or release reliance.

| ID | Baseline disposition in this pass | Next acceptance proof |
|---|---|---|
| ENG-01 | Source-confirmed pending | Current gym/menu across target, warmup and live retarget |
| ENG-02 | Open on main; local prototype tested | Current-plan reductions across modes and timezones |
| ENG-03 | Carry-forward; prior evidence only | Later-week sessions cannot alter prior-week verdict |
| ENG-04 | Carry-forward; prior evidence only | Warmup-only records cannot satisfy working-session completion |
| ENG-05 | Open on main; local prototype tested | Every mutation equals clean recovery replay |
| ENG-06 | Carry-forward; prior evidence only | Duration baseline contains enough trusted sessions |
| ENG-07 | Carry-forward; prior evidence only | Historical debrief uses only earlier workouts |
| UI-R01 | Reproduced pending | Substitution preserves committed work |
| UI-R02 | Source-confirmed pending | Known distinct IDs retain separate history |
| UI-R03 | Carry-forward; prior evidence only | Day-off and Undo update every actionable schedule consumer |
| UI-R04 | Source-confirmed pending | Edited content retains truthful timing provenance |
| UI-R05 | Carry-forward; prior evidence only | Last profile field cannot unmount an unsaved draft |
| UI-R06 | Source-confirmed pending | Live gym deletion cannot silently change context |
| IMP-E01 | Open on main; local prototype tested | Coach and live target use the same active factor |
| IMP-E02 | Open on main; local prototype tested | Cross-chat toast cannot consume another inverse |
| IMP-E03 | Open on main; local prototype tested | Undo preserves later edits and truthful history |
| IMP-E04 | Open; prototype review needs test correction | Apply rejects a deleted referenced gym |
| IMP-E05 | Open on main; local prototype tested | Pause, rest and done counts agree with Train |
| IMP-N01 | Open on main; local prototype tested | Latest notification intent wins after every await |
| IMP-N02 | Open on main; local prototype tested | Old reads cannot repopulate replaced state |
| IMP-N03 | Open on main; local prototype tested | Obsolete wake-lock grants are released |
| IMP-E06 | Open P3; prototype review needs test correction | Haptic preference and runtime agree immediately |

The earlier report has seven engineering findings, six workflow findings, five primary Escobar findings and three native findings, plus secondary IMP-E06. Several share causes. Do not mechanically add the first and second audits or every reproduced assertion into a count of independent vulnerabilities. [A02](https://github.com/macdarenz-droid/M-arc/blob/83463cf0cdf1f93c57a06a4933267318f2cfa31e/improvement-audit.md)

### Carry forward scenarios to revalidate
All six items below are P2 findings from the earlier improvement audit. They are not newly reproduced defects in this pass and no closure is claimed. The linked original report provides the exact historical source ranges and proof. [A02](https://github.com/macdarenz-droid/M-arc/blob/83463cf0cdf1f93c57a06a4933267318f2cfa31e/improvement-audit.md)

**ENG-03 Weekly-period contamination.** With six chest sets in the reviewed prior week and twelve in the next week, the review can call the earlier six-set week “over” a six-to-ten range. A later session must not change an earlier week's verdict. Bound volume and training-level inputs to the actual reviewed interval; preserve separate current-week warnings.

**ENG-04 Warmup-only completion.** Three saved warmup-only sessions can satisfy three planned workouts and enable a weekly review despite zero working sets and a zero training streak. Preserve the warmup records, but share a qualifying-working-session predicate across completion, review eligibility and volume judgments. Mixed sessions should count once.

**ENG-06 Untrusted duration baseline.** Five one-minute compressed, untrusted sessions can make a trusted sixty-minute workout look unusually slow and prompt an idle-time/superset explanation. Build the baseline from enough trusted comparable sessions and suppress the judgment when evidence is insufficient. Do not infer idle time merely from total duration.

**ENG-07 Future history contaminates a past debrief.** A backfilled 55 kg workout between earlier 50 kg and later 60 kg workouts can lose its genuine historical record when the Finish screen supplies every other session. Use only chronologically earlier evidence with a defined tie policy; Finish, History and Escobar should agree.

**UI-R03 Day-off intent is not shared.** After taking Thursday off, Today can show rest while the local coach still warns about scheduled Push and suggests moving it. Resolve effective schedule through a date-aware shared selector that honors exceptions. Day-off, Undo and next-session copy must agree, while the recurring schedule remains editable.

**UI-R05 Onboarding draft can disappear.** With only sex missing, change the draft weight and fill that last profile field. The eligibility trigger can turn false and unmount the editor before Save, losing the weight draft. Keep an opened flow mounted until an explicit finish/close and use a consistent draft/commit policy. Test every partial-profile combination; voluntary completion and Later are separate product semantics.

### Reproduction conditions
For a later authorized verification pass, pin the audited baseline before constructing synthetic fixtures. Use controlled clocks and in-memory state; block fetch, XHR, WebSocket, HTTP/TCP and native side effects unless a specific mock is supplied. Do not run an unisolated test command against a configured production coach endpoint. No paid provider call is needed for these deterministic defects.

For each finding, the scenario above names the triggering state and expected versus observed output. Useful entry points include `EscobarLoop` with a scripted retry transport; `parseBackup`/`loadState` followed by `recoveryStatus`; the CSV exporter with formula-prefixed text; `logPastSession` and `resolveSessionTiming` with a controlled now; `suggest` with prior and current set counts; `substituteEntry` followed by `finishSession`; proposal Apply/Undo with two conversations and later profile edits; and native wrappers supplied deferred permission, schedule, health-read or wake-lock promises. Assert both the intended mutation and the absence of changes to unrelated or later state.

The prototype test files are not added by this report-only change. Their pass counts identify the bounded experiments recorded above; exact-source regression tests and final execution evidence must accompany any future code change. Preserve valid historical backups and documented intentional policies when turning a counterexample into a repair.

## Appendix B Source references
All current-baseline code links below are pinned to 94fd32cf4a743ea62f60dce8bba21a2796205219. Unpublished prototype hashes are identified in the relevant finding solely to preserve the experimental record; they are not public source links or merged fixes. Earlier-report links are historical evidence with their own original source snapshots. Code line references explain where the finding lives; they are not claims of deployed behavior.

**S01 Retry serialization:** [src/escobar/loop.ts#L375-L390](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/loop.ts#L375-L390).

**S02 Profile inverse and toast conversation:** [src/escobar/apply.ts#L152-L173](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/apply.ts#L152-L173); [src/escobar/apply.ts#L272-L293](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/apply.ts#L272-L293).

**S03 Active factor and live workout facts:** [src/escobar/tools/context.ts#L98-L112](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/tools/context.ts#L98-L112); [src/escobar/tools/read.ts#L416-L434](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/tools/read.ts#L416-L434).

**S04 Equipment fingerprint and settings Apply:** [src/escobar/tools/actions.ts#L102](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/tools/actions.ts#L102); [src/escobar/apply.ts#L188-L207](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/apply.ts#L188-L207).

**S05 Custom exercise repair and readers:** [src/core/store.ts#L90-L105](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/core/store.ts#L90-L105); [src/brain/exposure.ts#L18-L27](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/brain/exposure.ts#L18-L27); [src/core/exercises.ts#L135-L139](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/core/exercises.ts#L135-L139).

**S06 CSV text serialization:** [src/slices/settings/exportCsv.ts#L6-L33](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/settings/exportCsv.ts#L6-L33).

**S07 App owned sharing cache and reset promise:** [src/native/share.ts#L6-L12](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/native/share.ts#L6-L12); [src/slices/settings/Settings.tsx#L76-L85](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/settings/Settings.tsx#L76-L85); [docs/PRIVACY-POLICY.md#L56-L57](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/docs/PRIVACY-POLICY.md#L56-L57).

**S08 Storage events and persistence writer:** [src/core/store.ts#L320-L381](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/core/store.ts#L320-L381).

**S09 Workout timing and replay mutation sites:** [src/slices/workout/session.ts#L582-L635](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/workout/session.ts#L582-L635); [src/slices/workout/Train.tsx#L1145-L1189](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/workout/Train.tsx#L1145-L1189).

**S10 Current plan set reductions:** [src/brain/progression.ts#L320-L465](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/brain/progression.ts#L320-L465).

**S11 Workout substitution:** [src/slices/workout/session.ts#L356-L373](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/workout/session.ts#L356-L373).

**S12 Identity and provenance:** [src/brain/history.ts#L120-L130](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/brain/history.ts#L120-L130); [src/slices/history/History.tsx#L293-L308](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/history/History.tsx#L293-L308); [src/slices/workout/units.ts#L108-L125](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/workout/units.ts#L108-L125).

**S13 Notification requests:** [src/native/notifications.ts#L80-L205](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/native/notifications.ts#L80-L205); [src/slices/settings/reminders.ts#L15-L24](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/settings/reminders.ts#L15-L24).

**S14 Health sync mutation:** [src/slices/settings/health.ts#L13-L30](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/settings/health.ts#L13-L30).

**S15 Wake lock acquisition:** [src/native/keepAwake.ts#L1-L35](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/native/keepAwake.ts#L1-L35).

**S16 Report entry and payload disclosure:** [src/escobar/ui/Message.tsx#L218-L226](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/ui/Message.tsx#L218-L226); [src/escobar/ui/Report.tsx#L35-L49](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/ui/Report.tsx#L35-L49); [src/escobar/report.ts#L92-L98](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/report.ts#L92-L98); [docs/PLAY-SUBMISSION.md#L44-L65](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/docs/PLAY-SUBMISSION.md#L44-L65); [docs/PRIVACY-POLICY.md#L48-L51](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/docs/PRIVACY-POLICY.md#L48-L51).

**S17 Approved guide IDs and full coverage:** [src/howto/ids.ts#L3-L16](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/howto/ids.ts#L3-L16); [src/howto/generated/index.ts#L4-L13](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/howto/generated/index.ts#L4-L13); [src/howto/coverage.ts](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/howto/coverage.ts).

**S18 Navigation settings and local coach:** [src/app/App.tsx#L58-L119](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/app/App.tsx#L58-L119); [src/ui/primitives.tsx#L14-L70](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/ui/primitives.tsx#L14-L70); [src/slices/settings/Settings.tsx#L151-L250](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/settings/Settings.tsx#L151-L250); [src/slices/coach/Coach.tsx#L47-L95](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/coach/Coach.tsx#L47-L95).

**S19 Numeric ledger verifier:** [src/escobar/verify.ts#L138-L158](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/verify.ts#L138-L158).

**S20 Quota admission and configuration:** [escobar-worker/src/quotaDO.ts](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/escobar-worker/src/quotaDO.ts); [escobar-worker/src/quota.ts](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/escobar-worker/src/quota.ts); [escobar-worker/wrangler.toml](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/escobar-worker/wrangler.toml).

**S21 Guide offline label and asset strategy:** [src/slices/howto/PlateView.tsx#L28-L42](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/slices/howto/PlateView.tsx#L28-L42); [public/sw.js#L4-L59](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/public/sw.js#L4-L59); [capacitor.config.json#L1-L6](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/capacitor.config.json#L1-L6).

**S22 Native declarations and privacy:** [native/patch_manifest.py](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/native/patch_manifest.py); [native/HealthConnectNativePlugin.java](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/native/HealthConnectNativePlugin.java); [docs/PRIVACY-POLICY.md#L16-L23](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/docs/PRIVACY-POLICY.md#L16-L23).

**S23 Saved custom endpoint and transport:** [src/core/escobarState.ts#L68-L80](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/core/escobarState.ts#L68-L80); [src/escobar/transport.ts#L78-L84](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/escobar/transport.ts#L78-L84); [src/core/store.ts#L230-L239](https://github.com/macdarenz-droid/M-arc/blob/94fd32cf4a743ea62f60dce8bba21a2796205219/src/core/store.ts#L230-L239).

**A01 Original Codex audit:** [report at its original report commit](https://github.com/macdarenz-droid/M-arc/blob/7596ee385fe622b8f4635146368505644960c352/codex-audit.md); [PR 144](https://github.com/macdarenz-droid/M-arc/pull/144).

**A02 Improvement audit:** [report at its original report commit](https://github.com/macdarenz-droid/M-arc/blob/83463cf0cdf1f93c57a06a4933267318f2cfa31e/improvement-audit.md); [PR 149](https://github.com/macdarenz-droid/M-arc/pull/149). Historical source snapshot: `d5ebc771b3194dc557d469e40945dfa2ddf1f8ab`.

### Official Google and Android policy sources
P01 [Target API level requirements](https://support.google.com/googleplay/android-developer/answer/11926878)
P02 [App testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en-en)
P03 [Support 16 KB page sizes](https://developer.android.com/guide/practices/page-sizes)
P04 [Health apps policy and declarations](https://support.google.com/googleplay/android-developer/answer/14738291?hl=en)
P05 [Current health policy guidance](https://support.google.com/googleplay/android-developer/answer/16679511?hl=en-GB)
P06 [AI generated content policy](https://support.google.com/googleplay/android-developer/answer/13985936)
P07 [Data safety requirements](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en-en)
P08 [Account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en)
P09 [Foreground service requirements](https://support.google.com/googleplay/android-developer/answer/13392821?hl=en)
P10 [Health Connect permissions and policy guidance](https://support.google.com/googleplay/android-developer/answer/12991134?hl=en-GB)

Policy sources were checked on 2 October 2026. Final eligibility and approval depend on the actual app, account, declarations and review outcome.
