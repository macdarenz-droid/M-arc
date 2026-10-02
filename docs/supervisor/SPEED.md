# Finish speed: bottlenecks, improvements, schedule

The supervisor keeps this file current. It answers the owner's request of 2026-10-02 (~09:45 UTC): finish faster without lowering accuracy, plate quality or test coverage. Refresh it after LB1 and after LB2 with measured throughput.

Measured 10-02 09:50 UTC by four read-only analysts (in-chat workflow `wf_8a28ca54-d4e`): card timelines (Sonnet), CI (Opus), the library plan (Opus), recurring findings (Opus). The raw per-card data was in the session scratchpad (`speed/per_card.csv`) and is not kept; the numbers below are the record.

## 1. Where the time goes

**Cards (103 merged card PRs since 09-28, card-hours; cards overlap):**

| Phase | Share | Median |
|---|---|---|
| Build | 22 % | 0.43 h per card |
| Review (wait + review) | 23 % | 0.59 h per round (p90 1.67 h) |
| Fix after FAIL | 11 % | 0.65 h per round |
| Integration (final PASS → merged) | 38 % | 1.35 h per card |

- 54 of 103 cards had at least one FAIL (78 FAILs).
- Integration fell when merge trains started (10-01 04:30): from a mean of 2.6 h to 1.4 h per card. A train takes a median 0.74 h from creation to merge.
- On the How-to lane, "build" was mostly waiting on the previous card. For example, #111 HT-8 waited 15.4 h of its 31.9 h. 135 of 206 commits on HT-5..HT-9 are merges of `main`.
- Review is not the bottleneck.

**CI (2,927 gate jobs, 09-28 to 10-02):**
- The gate step has tripled as HT blocks were added: 13.6 min on main 09-29, then 30.9 (train 6), 35.5 (train 9) and 39.9 (train 10). Train 10 took 46.7 min from push to all green.
- Queueing is minor. Waiting starts at about 15 running jobs, which fits a cap of about 20.
- main failed 0 of 85 runs; trains failed 1 of 11 (a real conflict).
- Confirmed flakes: 6. Each one that was re-run took 1.5-2.4 h to reach green. One likely new flake is outside GATE-FLAKE-1's scope: the BUG-34 launch first frame on HT-10 `038cd4f` (job 110762812501). It is not verified.

**Library:**
- Accepted and integrated: **0 of 145** new ids.
- Verified research: 93/145, with 9 more plus 19 shared cards in the w0 recheck. 43 ids have no card yet.
- Pilot A plates: 19 drawn, 17 under a fresh critic recheck, 2 held, **0 approved**. Held plates count as 0.

**The real bottleneck:**
- How-to: the strict chain HT-9 → HT-10. Each step costs one review plus about 45 min of CI per push.
- Library:
  - the critical path HT-10 → LIB-1 → LIB-2 → LIB-4 → LB1;
  - repeat fix rounds (pilot A needed 3 critic rounds);
  - per-push CI time, which grows with every block added.
- Adding more agents does not help, because runners queue above about 15 jobs.

## 2. Improvements

### Applied under existing authority (10-02 ~10:10)

1. **Build ahead on real prerequisites, merge in plan order.**
   - Enabler session `session_01SFDFkUMFSboiREUAPVWPa2` (Opus, the one owner of shared engine files, generated registries and integration) is doing two things:
     - the LIB-2 design note ("design note only" before HT-10, plan 7);
     - one scratch engine spike for camera pitch (dumbbell_fly, bicycle_crunch), a front-view bent-over torso (rear-delt fly) and E-R5 roll and yaw (side_plank, russian_twist, bicycle_crunch). LIB-20 allows a "spike yes (scratch)". The spike gives each held or at-risk id an owner, a prerequisite and an acceptance test. The resulting golden-update card goes through the plan 2.8 procedure, with goldens byte-identical.
   - LIB-7 and LIB-12 ("yes" before HT-10) start in drawing lanes 2 and 3 once the w0 research (their shared hand cards) is merged into `claude/libht-research`.
   - Lane cap kept: LIB has at most 4 builders (3 drawing, 1 enabler).
2. **Catch defects before review.**
   - Pilot A gets the LIB-3 plate-QA scorecard now, in scratch, before approval. Plan 3.5 re-checks it on merged LIB-3 anyway.
   - Template P1 (builder start):
     - the supervisor names the mutation per criterion;
     - every loop, sweep or sampled probe asserts its count or full grid and is shown red on main or empty input (class A: about 24 FAILs);
     - cards that touch pixel or timing probes run both browsers before READY.
   - P1 and P4 (fix after FAIL): set the PR body HANDOFF to the posted sha (class C: 18 findings). write_scope always includes `docs/COACHING-DECISIONS.md` (append-only), which covers class D.
   - Reviewer skill: a head behind `main` is a note, never a blocker (class B: 12 FAILs rested only on it).
3. **CI reliability before CI parallelism.** GATE-FLAKE-1 (#179) stays the single owner of the flaky probes; its residuals went to HT-9 and HT-10 on 10-02. No extra parallel CI until runner capacity allows it.
   - ht10-gate (2 shards) lands with HT-10's train, as already approved.
   - LIB-4 stays at K = 1 for LB1. K > 1 needs plan 5.4's 5 identical reruns, which come after GATE-FLAKE-1 merges.

**Expected saving: about 3-6 days off the library**, an estimate to check after LB1 and LB2.
- Build-ahead takes LIB-2 design and the engine findings off the critical path, and stops the same engine limit being found in LB2, LB7 and LB9.
- Fewer fix rounds: each avoided round saves about 2 h of card time (0.65 h fix, 0.6 h review, about 0.75 h CI).
- Fewer flakes: about 2 h each.

### Proposals that need the owner (not applied)

- **GATE-SPLIT rule exception.**
  - The problem: splitting the existing gate across jobs means moving other tasks' blocks in `scripts/screenshot-gate.mjs`, which AGENTS.md makes add-only.
  - The proposal: after HT-10, allow the supervisor to assign existing blocks to shard jobs without editing them, only with an equivalence proof:
    - a block × time zone × theme coverage test, run for every K;
    - a proof file per shard and a verdict job (wrong sha, missing, duplicated or miscounted item = red);
    - 5 paired runs with identical results;
    - a seeded failure that turns both red;
    - a mutation that drops one proof row.
  - Gain: per-push CI from about 45 min to about 25 min.
- **Closed test start.** Google Play's 12 testers × 14 days can run alongside library work if the owner opens it earlier. That saves about 2 weeks before store launch. Only the owner publishes.
- **Back-pain box at 50 words** (ruling R-W0-1). The plan's owner default (8.6) says 30 words. All six NHS emergency triggers plus the same-day line cannot fit in 30. The owner sees the wording on pilot A.

## 3. Schedule (re-estimated 10-02; refine after LB1 and LB2)

- **How-to finish line (HT-9 → HT-10):** likely 10-03, range late 10-02 to 10-04. It depends on one clean delta review each, about 45-50 min of CI per train, and HT-10's new `ht10-gate` job.
- **Library (145 ids), from HT-10's merge:**

  | Case | Estimate |
  |---|---|
  | Plan (09-30) | 4½ weeks expected, 3½ best, about 8 worst |
  | Now, measured | about 4-5 weeks expected, 3½ best, about 8 worst |
  | With the improvements above | about 4 weeks expected, about 3-3½ best |

  - Delegated approval removes the sheet waits, about 3 days.
  - Slower CI, the extra critic rounds on pilot A and the 13.5 h pause take that back.
  - A 1-2 week finish is not supported by the data: the plan needs about 7.6 accepted packages a day, and the measured rate is 0 so far.
- **Store launch:** library, then LIB-23 (full regression, full QA and the owner's device checks on the exact APK), then Play's closed test (12 testers, 14 days) unless that starts earlier.
- **Assumptions:**
  - about 16 productive hours a day and at most 4 LIB builders;
  - one fix round per batch;
  - CI about 45 min per run, or about 25 with GATE-SPLIT;
  - no further usage pauses;
  - engine holds resolved before LB2.
- **Target:** no known unresolved blocking defect, backed by evidence. Zero bugs cannot be guaranteed.

## 4. Throughput log (fill after each batch)

| Batch | Ids accepted and integrated | Days | Packages/day | Fix rounds | CI runs | Notes |
|---|---|---|---|---|---|---|
| Pilot A | 0 of 19 (17 in recheck, 2 held) | — | — | 3 critic rounds | — | 10-02 |
