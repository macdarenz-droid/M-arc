# Coverage ledger and continuation contract

Baseline main: `57dcbfc7efa60218ba902d16d6e3329d2fc053f5`. **PARTIAL** is deliberate. A file/function inventory is navigation evidence, not proof every line, button or state transition is correct. Source review means reasoning through current text and important callers; a probe means an actual synthetic execution; browser means observed UI. None substitutes for physical-device or scientific validation.

## Whole-app inventory

Every one of the **3,069 tracked baseline paths** appears with mode/blob and inclusion in [main-manifest.tsv](main-manifest.tsv), and with review status in [coverage-ledger.tsv](coverage-ledger.tsv). Default coverage is unfinished/inventory-only, not implicitly passed. Named functions, callbacks and UI event handlers are listed in the linked lane JSON inventories; these are textual/AST navigation aids, not a type-resolved exhaustive call graph.

| Area | Source and interaction coverage | Executed evidence / outstanding scope |
|---|---|---|
| Core state/data | 13 core modules; repair/fill/load/save/quota/backup/cross-tab generation, migration, canonical units/dates, exercise identity, heart/coach state, rescue and logging defaults | Core probes; focused regression. Exhaustive malformed-schema/migration combinations and multi-process real-browser races remain |
| Training engine/session | All 30 brain modules + workout session lifecycle, 7,303 lines; changed code since earlier partial 9ca7f0 read with unchanged high-risk paths | [Brain ledger](evidence/brain/coverage.md), [function JSON](evidence/brain/coverage.json); six probe executions in three timezones; no physiological efficacy proof |
| Escobar/errors/Worker | All 77 assigned source/config/docs files, 12 test/support files and two generated/dependency artifacts; consent, context, tool dispatch, streams/retry/cancel, proposal fingerprints, Apply/Undo, plans, verification, images/memory/errors | [Coverage JSON](evidence/escobar/coverage.json); 163 Worker tests, original 8 + leaf 2 source probe records. No live model/provider/deployed infrastructure checks |
| Screens/native/PWA/how-to | Expanded source review 97 files; one targeted stylesheet; five delegated source files; 443 inventory-only generated art/CSS/assets/type data within 547-path lane | [Detailed ledger](evidence/ui-native/coverage.md), [function/handler JSON](evidence/ui-native/coverage.json); source callback/native-boundary probes and sampled browser flows. Physical-device behavior and generated library completeness remain |
| Theme engine/accessibility | Five catalog themes switched in real browser, computed colors and settings geometry checked; nested-button/History accessibility traced | Desktop sample plus 375px Body. Not every theme/screen/control, contrast state, screen reader or future theme |
| Relay | Targeted owner authentication, scoped links/MCP, bounded requests, static server and SQL adapters |16 local tests passed; complete Relay UI, all store operations, self-hosted/Worker deployment and long-lived operational/security behavior unfinished |
| Dependencies/build/performance | Lock identity checked; current scripts/configuration/CI contract sampled; current exact-head gate metadata verified | No fresh install, complete transitive dependency advisory audit, full local build, perf/solo suite or full benchmark. Localfull suite incomplete; exact-head remote CI evidence separate |
| Research/generated teaching assets | Targeted updated training/effort/energy/load-ratio evidence and selected exercise guide runtime | Not a systematic audit of every technique card, generated plate, source claim, clinical population or personalized prediction |

## Screens and flows actually traced

App/router/navigation â†’ Today â†’ readiness/planner; Train â†’ templates/splits/pre-session/check-in â†’ active session â†’ edit/set effort/rest â†’ pause/resume â†’ finish/summary â†’ History â†’ edit/provenance â†’ chart/insights; Body â†’ recovery/detail/levels/measure; Coach â†’ goals/schedule/weekly insights â†’ Escobar consent â†’ tools/proposals â†’ Apply/Undo; Settings/Profile â†’ theme/units/gyms/privacy/health â†’ backup/import/reset/export â†’ state replacement â†’ notifications/async guards. Callers and key edge cases are in the lane ledgers.

Actual browser subset and dimensions are recorded in [browser-evidence.md](evidence/browser-evidence.md). It uses a fresh local synthetic profile and development preview. The external aliases select `Coach.tsx` and `Profile.tsx` explicitly to avoid Windows casing ambiguity. A full release build is not inferred from preview behavior. Browser interactions never enabled paid Escobar requests.

## Open PR coverage

Exact SHAs, changed-path lists, classifications and fingerprints are in [inputs.json](inputs.json). No open branch result is silently attributed to main.

| PR | Treatment |
|---|---|
|438, platefix6d | All 182 changed paths inventoried; selected renderer/crop/template/spec deltas read against pinned main. Complete generated-art render/research review and head test suite unfinished; no approval |
|221, watch implementation | Selected watch protocol, command receipts/revisions, persistence-before-effects and gating traced by native reviewer. Entire branch/device/native bridge/release scope unfinished |
|1, alternative engine | No merge base with main; selected readiness/principles/load-planner reads only.81-file engine replacement not fully reviewed/executed |
|3,88 watch branches | Exact input trees fetched/fingerprinted; full implementation/device review unfinished |
|197,209,190 prototypes/spikes | Conservatively included despite parked/do-not-merge labels; inventory/fingerprint only. No implied production deployment or correctness |
|259,188,94,92 research/plans | Conservatively included as app requirements inputs; not treated as shipped features. Full document/implementation consistency review unfinished |
|144,149,158,192 audit/handoff | Changed paths verified as reports/research/prototype handoff. Excluded as audit-only inputs so this audit cannot keep itself alive |

## Fingerprints and stop condition

Policy v1: `SHA-256` over UTF-8 rows in `git ls-tree -r --full-tree` order, each `mode SP type SP blob TAB path LF`. Include every tracked blob/gitlink by default, including source, app assets/generated code, dependencies/locks, native, Worker/Relay, schemas/migrations, config, deployment/build tools, tests, privacy/requirements/research docs and ambiguous parked inputs. The filename and mode are part of the hash; rename/mode/content changes count.

Exact excluded paths: `codex-audit.md`, `improvement-audit.md`, `audit-3.md`, `docs/supervisor/HANDOVER.md`, `docs/research/user-adaptation-research.md`, `docs/research/escobar-evolution-research.md`. Excluded prefixes: `docs/audits/nightly/`, `docs/gym-finder/`. These are known report/handoff/bookkeeping locations, not a broad exclusion of documentation. At current main only one tracked path is excluded:3,068 included. Main fingerprint: `e40575c43dc91bcfb9d375381d6109a623be0db05e5ea4276bbc8c87c29bd9a1`.

Compare the main fingerprint and the sorted map of active relevant PR numberâ†’head-tree fingerprint. Opening/closing a relevant PR changes the input set; a commit containing only excluded reports does not. Audit-only PR classification must be verified from changed paths on each run. If implementation appears inside a previously excluded research/audit location, inspect it and version the policy before comparing; never silently discard ambiguous implementation.

Only a **completed audit whose publication is verified** can advance the successful baseline. Previous October work and this partial run do not qualify. Missing state, unavailable fetches, incomplete coverage or pending publication are blockers/continuation work, not an unchanged-app result. The durable chat state retains candidate fingerprints, report branch/PR/head and unfinished coverage. The automation stays active; no pause/delete was performed.

## Continuation priorities

1. Finish outstanding main generated-library/requirements, Relay, dependency/build/performance and complete control/theme/error coverage. Run full required checks in a case-sensitive Linux environment and triage every failure; retain exact commit identity.
2. Complete active implementation PR source/interactions with their own evidence, prioritizing current 438 and 221; explicitly decide how parked alternative branches remain in the conservative comparison set.
3. Validate installed Android/iOS/watch/PWA flows with synthetic test accounts/devices, permission denials, offline update/reset, Health Connect replacement races, notification payload ordering and cancellation. Do not deploy or incur provider charges to obtain evidence.
4. Complete researched claim provenance and calibration evaluation; keep group-level exercise evidence distinct from individual prediction accuracy.
5. Verify the actual automation timezone semantics and correct the 9pm Melbourne/DST schedule if needed. Saved RRULE has21:00 with no explicit timezone; this run's trigger was17:32 Melbourne. Do not claim reliable9pm delivery from that record alone.

No fix was implemented. These continuation items keep the run partial and prevent an erroneous no-change shutdown.
