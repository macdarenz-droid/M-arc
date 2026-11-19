# M/ARC nightly research and QA audit — 2026-11-19

**Status: substantial findings published; whole-app audit coverage remains PARTIAL. This is not a release approval, an exhaustive correctness claim, or a successful no-change baseline.**

Audit-start Melbourne date: **19 November 2026**. Trigger/start `2026-11-19T06:32:01.163Z` (17:32 AEDT). The host was interrupted for several hours; review resumed and publication was prepared after midnight on 20 November Melbourne time. The directory retains the run's start date. The configured 21:00 Melbourne/DST schedule was not validated by this audit; the observed trigger was earlier. The initial October audit was already past its authorized start and remained incomplete; its evidence is preserved, not promoted into a completed baseline.

Current-app baseline: [`main@57dcbfc7efa60218ba902d16d6e3329d2fc053f5`](https://github.com/macdarenz-droid/M-arc/tree/57dcbfc7efa60218ba902d16d6e3329d2fc053f5). Main and all 16 open PR heads were verified through GitHub and relevant heads fetched locally; a final main fetch and open-head reread found the same commits. Twelve implementation/requirements inputs are conservatively fingerprinted, four verified audit-only PRs excluded. See [inputs.json](inputs.json), [fingerprint policy](coverage.md#fingerprints-and-stop-condition), and [full main manifest](main-manifest.tsv).

The review identifies **16 confirmed or source-confirmed current-app issues: 11 P2 and 5 P3; no P0/P1 established**. These include residual prior issues and newly confirmed cases; “newly confirmed” does not mean introduced since the last report. One additional conditional cache defect and separately labelled notification/privacy/isolation/scientific risks are not included in those 16. Exact conditions, confidence, source links, current reproduction, expected behavior and builder recommendations are in the [findings index](findings-index.md) and linked lane reports.

## Most consequential findings

1. **Reset/restore isolation:** a flush-detected cross-tab replacement does not invalidate an old Health Connect request. The executed synthetic read reconnects health and restores removed rows. Accepted malformed backups can also reach crashes in Train/analysis consumers. See [core findings](evidence/core/findings.md).
2. **Training adaptation:** warm-up-only logs still satisfy plan/adherence paths despite zero workouts in the summary. Recovery truncates the eight-week context its own load factor needs, delaying readiness in a normal return week. Time-based conditioning progress is flat or absent despite increasing durations. See [training findings B1–B3](evidence/brain/findings.md).
3. **Insight evidence:** disconnected heart samples are treated as a continuous 15-second window, supporting an unwarranted drift alert. Effort-calibration text can invent the chronological order of sets. See [B4–B5](evidence/brain/findings.md).
4. **Escobar actions and explanations:** Undo can remove the gym an active workout uses and change its unit fallback. A failed plan evaluation displays reassuring success text; assisted-exercise flags/units also disagree with the underlying model. See [Escobar findings](evidence/escobar/findings.md).
5. **UI and provenance:** keyboard Options activation fails, history expansion lacks an equivalent keyboard control, and distance-only history edits keep live provenance. Today overstates ready as fully recovered. The prior weekly-backup reminder reconciliation omission remains source-confirmed. See [UI/native findings](evidence/ui-native/findings.md).

## Current features and improvement direction

Current main includes training templates and live/past logging, per-gym equipment/load units, progression and substitutions, per-muscle recovery, readiness and personal check-ins, history/stats, goals and scheduling, weekly coaching, Health Connect/heart integrations, five themes, backup/import/export, native/PWA support and Escobar's consent, tools, proposals, Apply/Undo, memory and plan UI. These mechanisms were traced across source callers and selected actual flows; their existence does not prove predictive accuracy or exhaustive button correctness.

Gym profiles are present. A shipped map/geolocation Gym Finder was not found in current `src`/Worker code. The earlier [Gym Finder handoff](https://github.com/macdarenz-droid/M-arc/blob/claude/gym-finder-handoff-2026-10-01/docs/gym-finder/README.md) remains research/prototype context, not a current production feature. Unmerged watch/alternate-engine/prototype branches are separately labelled in the input and coverage records.

Prioritize consistency before adding more automatic advice: one completed-workout predicate, one metric/unit policy, one evidence-quality gate and one state-replacement boundary. For personalization, distinguish the user's explicit weight direction from training goal, retain decision provenance and uncertainty, evaluate comparable outcomes over time, and abstain when signals conflict. For Escobar, test semantic entity/unit/time grounding as well as numbers, preserve guarded action/Undo boundaries, and make tool errors visibly different from successful validation. No paid model benchmark was conducted; no claim is made that Escobar rivals general-purpose models.

The [research review](evidence/brain/research.md) checks current primary/official sources including the 2026 ACSM position stand. Broad training evidence does not validate this app's exact recovery percentages, personalized ready timestamps, fixed multipliers or readiness thresholds. The report separates numerical implementation defects from policy choices and missing physiological validation.

## Verification actually performed

| Check | Result and scope |
|---|---|
| Focused app regression | **13 files, 251 tests passed**; storage/backup/migration, body fat, progression/recovery/heart, notifications, plan/fidelity, stale-tab and warm-up cases, Escobar Apply. [Log](evidence/tests-focused.log) |
| Worker | Typecheck passed; **9 files, 163 tests passed** with mocked provider/D1/DO. [Log](evidence/escobar/worker-tests.log) |
| Relay | **16 tests passed**, isolated Node SQLite fixtures. [Log](evidence/relay-tests.log) |
| New defect probes | Actual source or extracted pure callbacks with synthetic fixtures; brain controls/assertions in Manila, Melbourne and UTC. Passing probes reproduce the reported defects, not fixes. Sources/results are beside each report |
| Browser | Fresh onboarding, five theme switches, starter workout, keyboard/pointer Options, guide close-up, set logging, pause/resume, finish, history edit, narrow Body and measurement validation, consent sheet without enabling paid services. [Record](evidence/browser-evidence.md) |
| Full local normal suite | Attempted with two workers; stopped after stalled progress and repeated Windows case, symlink, file-URL and CRLF/hash limitations. **No full-suite pass claimed.** SOLO/PERF/full TZ matrices not completed locally |
| Main local typecheck/build | Typecheck exit 2 with Windows case-resolution problems; complete release build not established locally. Preview-only external aliases explicitly select Coach.tsx and Profile.tsx; see the browser record |
| Exact-head GitHub checks | [M/ARC gate run 44212503979](https://github.com/macdarenz-droid/M-arc/actions/runs/44212503979) reports success at the audited SHA; 108 jobs include source, build, tests/TZ and visual lanes. Metadata corroboration only: not a fresh independent rerun or examination of every CI artifact |

Installed dependencies were reused through local junctions only after matching app and Worker lockfile hashes. No dependency installation, production source change, signing change, deployment, live provider/model call, real health/location/camera operation, or destructive production action was performed. Original `codex-audit.md` and `improvement-audit.md` remain separate and unchanged. No fixes are shipped with this documentation.

## Coverage limits and next work

The [coverage ledger](coverage.md), [all-path status ledger](coverage-ledger.tsv), and per-lane function/control inventories distinguish source review, targeted review, executed probes, browser checks, generated/support artifacts and unfinished areas. Inventoried is not audited; static review is not runtime proof.

Unfinished scope includes comprehensive generated exercise artwork/cue provenance, all build/release/dependency paths, full Relay UI/store review, every control across all themes/error states, complete unmerged implementation branches, physical Android/iOS/watch behavior, installed PWA lifecycle, native permission/notification races and prospective scientific/model validation. The broad local suite's failures were not all individually triaged. The owner asked for every corner; this publication preserves useful findings without claiming that request has been exhaustively fulfilled.

The previous scheduled audit was incomplete and unpublished. Therefore there is **no eligible successful baseline** for the automatic no-change stop rule. This run's incomplete coverage also cannot become one. Preserve candidate fingerprints and publication evidence, continue remaining coverage with verified inputs, and leave this automation active. An unchanged future snapshot alone must not stop it until a complete, verified published audit exists. Do not interpret this state as proof that the app is complete or bug-free.
