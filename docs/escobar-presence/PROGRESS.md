# Execution ledger

Prepared 2026-09-21. **This is a new workflow: app implementation has not started.** Documentation review is not feature verification.

Target executor: Claude Sonnet, Medium effort. Repository: `macdarenz-droid/M-arc`. Working branch: `claude/phase-9-readiness-preference-ckw91g`.

## Baseline evidence

Application baseline: `564df825a281eb1c95cf71ab8bc82355b4f3c900`. Previous full gate: [run 35602531054](https://github.com/macdarenz-droid/M-arc/actions/runs/35602531054), both jobs successful. Historical local results: 627 app tests; 87 passing proxy tests, eight explicitly conditional skips; both typechecks, build and five-theme gate passed. P00 must verify the actual execution head again.

This planning package was checked against current source by separate brain/data and integration/regression reviewers. It does not establish that the proposed new modules, tests or features exist.

Planning review corrections incorporated: normal intent has no inferred effort ceiling; cap-breach precedence retains valid partial evidence; invalidated entries do not require live target projections; ordinary input corrections remain assessable; deleted work retains row provenance; missing work is distinct from missing effort; journal replay validates entry lifecycle and fresh Undo IDs; overdue review dates survive reload; patch tests respect dependencies; informational cue dismissals use the new store; chat reset invalidates every late handler and clears transient state. Document checks cover seven files, relative links, UTF-8, code fences, eleven ordered stages and 95 unique regression IDs.

## Status

| Stage | Deliverable | Status | Commit / local evidence / exact CI |
|---|---|---|---|
| P00 | Verify current baseline | NOT STARTED | — |
| P01 | Moment selector, tone, shared dismissals | NOT STARTED | — |
| P02 | Presence and local explanation surfaces | NOT STARTED | — |
| P03 | Shared guarded contextual Ask | NOT STARTED | — |
| P04 | Optional intent and normalization | NOT STARTED | — |
| P05 | Prospective agreements and evidence integrity | NOT STARTED | — |
| P06 | Fair plan-fit projection | NOT STARTED | — |
| P07 | Purpose-aware debrief and copy | NOT STARTED | — |
| P08 | Optional personal objective | NOT STARTED | — |
| P09 | Evidence review and surface integration | NOT STARTED | — |
| P10 | Integrated audit, exact-head gate and APK | NOT STARTED | — |

Allowed execution states: NOT STARTED, IN PROGRESS, LOCAL VERIFIED / CI PENDING, VERIFIED, BLOCKED. VERIFIED needs observed required evidence, not an expectation. Record blockers precisely; do not use BLOCKED for an ordinary failing test that can be fixed.

## Append one record per patch or corrective subpatch

```text
Patch / date / executor:
Starting local and remote SHA:
User-visible change:
Owned files and any reconciled baseline drift:
Architecture decisions (or none):
Regression IDs → concrete test/scenario names:
Focused failure reproduction and result:
Full commands → exit/result/test counts/skips:
Browser evidence paths, themes/widths and console/network result:
Reviewer identity, findings, fixes and re-review:
Commit and verified remote SHA:
Exact-head workflow URL + source/Android conclusions:
Known limits / remaining proof:
Next concrete action:
```

Record a commit's CI result in the next patch or final report, avoiding a self-referential final-SHA commit loop. Final report must account for all regression IDs and the final artifact, even if this ledger was committed before that run completed.

NEXT: On assignment to execute, start P00 from the actual current branch head. Do not restart the completed older roadmap.
