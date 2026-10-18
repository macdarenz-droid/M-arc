# Research wave 2 (w2) verify: state at the 2026-10-18 handoff

The verify head is `claude/libht-verify-w2` @ `5036283d`. It merges W2A (#242) @ `a33d8f3a`, W2B @ `d4f30c70` and the8 (#243) @ `e6381fa4` onto research `9dbc7e0a`. The supervisor owns this folder (verify/**).

## What happened
- **LR-29 verify** (`docs/supervisor/workflows/research-verify.js`):
  - Critic runs 1-3 were invalid: their plants fell outside the reviewed scope. The script then gained the `plantScope` arg.
  - Run 4 is **VALID**: both plants were caught (the squat way-out direction, the lateral-raise 60-70° changed to 30-40°), and the tier-A plant was rated blocker.
  - The valid run is `w2-verify-run.json`. The invalid runs' findings are real claims, so they are kept in `w2-invalid-critic-runs.json`.
  - The critic's re-fetch: 93 sources, 729/729 quotes verbatim.
- **Supervisor's 10 % re-fetch:** `w2-refetch.json` holds 41 claims (the first 41 of 407 by sha256('9dbc7e0a…:<card>:<claim>')) and 68 quotes, 68/68 verbatim.
- **Triage** (`docs/supervisor/workflows/w2-triage.js`): the 92 findings (`w2-all-findings.json`) were deduped into 54 items, then verified one by one against `5036283d`. 41 are real and 7 rejected. `w2-findings.md` has every item with its reason.
- **Rulings:** six draft rulings, W2-49..54. Each was reviewed by two lenses plus a final judge (`w2-rulings-review.js`). All six are amended, none rejected. They are `w2-rulings-final.md`, numbered LR-30..LR-35. Add them to RULINGS.md when w2 merges into `claude/libht-research`.
  - LR-30: BarBend and dumbbell-kickup c5 cover different situations, so they do not conflict.
  - LR-31: the rule for picking the single most common plate fault. It changes assisted_pull_up to drawable:false; LIB-9a must be told.
  - LR-32: single_arm_lat_pulldown keeps the past-end pull. The lib-9a-card edits are held until the recheck.
  - LR-33: "Pause momentarily" means a 1 s pause, named in a WEAK claim.
  - LR-34: inherit[] lines stay only if the parent's shipped string holds whole (D-LIB5-FAMILY); ways out are tried in order.
  - LR-35: the critic's coverage gap (the quotes files).

## Fix packets (send each to one session; exact old/new values per file)
- `packet-W2A.md`: chin_up, hanging_knee_raise, assisted_pull_up and shoulder_press cards and quotes; shared/dumbbell-kickup and its quotes. Some fields named here are reserved in W2A's original card; the packet routes them by name.
- `packet-THE8.md`: the 8 cards, their quotes and verify/the8.md.
- `packet-HELPER.md`: every other card (W2B's files). Give it to a Sonnet helper as spelled-out steps. W2B's own session refused cross-session instructions and is archived; never work around that.

Each session applies only its packet. Its Sonnet fetcher then checks every new or changed quote and fills `checked` dates (some entries still say `<YYYY-MM-DD>`). It pushes once and posts FIXED.

## Then
1. Re-merge the three branches into `claude/libht-verify-w2`.
2. Have a fresh Opus recheck of every changed line. Include `quotes/{chin_up,hanging_knee_raise,assisted_pull_up}.json`, which the critic's list missed (LR-35).
3. Write `verify/w2.md`: pipeline, calibration (why runs 1-3 were invalid), findings, recheck, re-fetch counts, LIB-WAYOUT outcomes.
4. Add the RULINGS.md rows and merge into `claude/libht-research`.
5. Post that head on #244 (LIB-5's re-copy) and #245 (LIB-9a's re-copy, plus LR-31's assisted_pull_up change and LR-32's held edits).

## tools/
- `gen.py` builds the packets from `edits_*.py`.
- `apply.py` dry-runs them on copies of the head files.
- `check.py` and `checked.json` check old values against the head.
- The scripts hold scratchpad paths from the old sandbox. Point them at your own copy before you run them.
