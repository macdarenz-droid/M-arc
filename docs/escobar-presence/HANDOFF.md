# Start here: Claude Sonnet, Medium effort

Status: READY FOR IMPLEMENTATION HANDOFF. Creating this package did not start app implementation. When the owner assigns this handoff for execution, continue through the workflow without asking for a new “continue” after each patch.

## Copy this assignment into Sonnet

> Implement the Escobar presence workflow in `docs/escobar-presence/` in `macdarenz-droid/M-arc`, using Claude Sonnet at Medium effort. Work on `claude/phase-9-readiness-preference-ckw91g`; verify the branch and current remote head before editing. Read this HANDOFF, the architecture, workflow, regression matrix and progress ledger. Preserve the completed F0/features 1–14 baseline and its integrity fixes. Execute P00 through P10 sequentially. For each patch, implement its behavior and named regressions, review the diff, run the required full local gate, make a focused commit, push, and verify both jobs of the M/ARC gate for that exact pushed SHA before starting the next patch. Fix failures autonomously. Include a final independent review and integrated regression pass; I should not have to request those later. Do not mark completion until the final SHA has a successful full gate and a current downloadable MARC-DEBUG-APK with checksum. Finish with the feature list in plain words, branch/commit, test/review results, CI link and APK link. Keep the app's optional online coach and proxy payload contract intact. Do not deploy the Worker, weaken validation, erase history, introduce numeric grades, or change the app's runtime model as part of this assignment. Persist progress and resume from the first unfinished patch if interrupted.

## Read in this order

1. This file and [PROGRESS.md](PROGRESS.md).
2. [01-ARCHITECTURE.md](01-ARCHITECTURE.md), [02-IMPLEMENTATION-WORKFLOW.md](02-IMPLEMENTATION-WORKFLOW.md), [03-REGRESSION-MATRIX.md](03-REGRESSION-MATRIX.md).
3. [Research and concept](00-CONCEPT-AND-RESEARCH.md) for product intent. The precise implementation contracts in 01 narrow its open-ended examples.
4. Root `PROJECT_STATE.md`, `MODEL_ROUTER.md`, `docs/ARCHITECTURE.md`, `docs/COACH_BRAIN.md`, and `docs/escobar-roadmap/HANDOFF.md` for existing behavior.
5. The owning source files and tests for the current patch. Use `rg`; verify symbols before relying on this source map.

The owner explicitly selected Sonnet Medium as executor. Do not silently switch executor or confuse it with the model named in the proxy configuration. Existing integrity/grounding review requirements still apply; use a separate reviewer when available. Report honestly if only a fresh self-review is possible; final independent review then remains outstanding.

## Resume protocol

- Read Git status, local/remote SHAs, the last ledger entry and exact-head Actions status.
- Preserve unrelated work, including untracked files. Do not reset, force-push or start again from an older baseline.
- Reconcile actual committed behavior with the ledger. A checkbox is not evidence of a passing gate.
- Finish the current patch and its red/pending gate before taking the next one.
- Before a session limit, record changed files, commands/results, unresolved findings and the next concrete action in PROGRESS. Never call an unfinished phase complete to fit a context window.
- Ordinary implementation choices and test failures do not require the owner to type “continue.” Stop only for a real missing authorization, irreconcilable scope/data decision, or unavailable external capability; state the exact blocked step and preserve completed work.

## Definition of finished

All patch exits and regression IDs are accounted for; new surfaces work offline and across all five themes; existing integrity guards remain; no new ignored/skipped test hides a failure; independent review findings are fixed and rechecked; both jobs pass on the final remote SHA; the APK artifact belongs to that SHA. Packaging success is not a claim that a physical phone installation was tested. State device validation separately.
