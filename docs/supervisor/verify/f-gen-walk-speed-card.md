# F-GEN-WALK-SPEED

Owner: supervisor (written 11-09). Branch: `claude/f-gen-walk-speed`. Builder: Opus. It merges independently of the wave order. It is a test-infrastructure card, so nothing here changes what the app shows.

## Problem

The library test walkers render or import every shipped and library row inside each test. Their time grows with every wave, and they have needed raised timeouts in the D-SHIP-W3-WALKTIME form (#384 6690918663, #391 6706600671). On W5's head (`d3f5e287`, 46 shipped) they ran:
- library-ci C4 class 3: 363 s;
- library-rows D-LIB2b-FEEL: 377 s;
- library-shared S6 render() walk: 285 s;
- lib7b 7b-A2: 309 s.

The limit is 600 s. W6 adds 7 shipped rows and W7 adds 19, so the walkers will cross it. unit-tz already takes about 75 minutes per zone.

## Goal

Make the walkers fast by doing the shared work once per test process instead of once per test, without changing what any test checks.

## Design (the builder may choose a better one and must record why)

- Memoize the expensive pure steps (sheet import, render(), generator outputs) in one test helper, keyed by the full input content hash (spec, sizes, engine files), so a changed input can never be served stale.
- Use vitest's per-worker module cache or a `globalSetup` that builds once and writes to a temp dir the tests read. No cache may outlive one test run.
- No `src/**` change. No change to any generator's output bytes.

## Acceptance

1. **Same checks.** Every walker test keeps its assertions exactly. Show the assertion lines are unchanged with `git diff`. The only allowed changes are where the data comes from and the timeout lines.
2. **Same results.** For each walker, the rendered or imported data it asserts on is byte-equal with and without the cache. Hash every row's data both ways and show the list.
3. **Speed.** Post a before/after table per walker from CI logs on the same runner type. The target is under 120 s for each named walker at 46 shipped rows, and a projection for 72 (after W7). If the target can't be met, post the measured gain.
4. **Lower timeouts.** Bring each walker's WALKTIME timeout down to about 3 times its new measured time (at least 60 s), with the measurement in the comment. The tests must still pass in both unit-tz zones and source-gate.
5. **Bite (mutations, each red):**
   - a cache keyed without one input file (a changed spec served stale) turns a walker red;
   - a cache that returns one row's data for another turns a walker red;
   - putting the cache across test runs (outside the temp dir) turns a guard red.
6. **Full regression:** `npm run check`, `npm run test:tz` and the gate are all green. A fresh Opus reviewer follows.

## Out of scope

- Splitting CI jobs. That is GATE-SPLIT's area and needs its own card.
- Changing any test's assertions, sets or counts.
- Anything under `escobar-worker/**`, `native/wear/**`, signing or keystore.

## Risks

- **A stale cache hides a real failure.** Mitigation: the content-hash key, plus mutations 5a and 5b.
- **Cross-test pollution.** Mitigation: the cache is read-only after it is built, tests get deep copies or frozen objects, and a mutation shows it.
- **Merge conflicts with W6 and W7, which also touch the timeout lines.** Mitigation: merge main before READY; the timeout lines take this card's values.
