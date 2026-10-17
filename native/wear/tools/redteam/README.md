# Watch red-team tools (from the watch lane session's scratch folder, 2026-10-17)

Not part of any build or CI run. The scripts were written for that session's scratch folder: they hard-code
`S=/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad`. To use them, copy this folder to a
scratch folder and set `S` (and the paths under it) to where you put them.

- `rt-e/`: the JerryScript harness. `build.sh <stackKB> <heapKB>` builds a desktop JerryScript (ES5.1) runner from
  JerryScript sources (clone jerryscript-project/jerryscript into `$S/jerry`); `jb/main.c` is its entry. `prelude.js`
  fakes the watch's storage, timers and P2P; `s*.js` are scenarios (bursts, slow storage, crashes, the restart guard);
  `run.sh <compiled page> <scenario>` runs one.
- `c2-rt/`: `fw.js` models ACE lite's ViewModel (data, watchers, if-blocks) to measure heap and mounts; `rtfw.sh`,
  `heap.sh`, `stk.sh`, `allsc.sh` run the page with it; `sc/w0.js` (start), `sc/w1.js` (a workout), `sc/r1.js`.
- `c2-final/rt3/`: the instrumented stack runs and the slot fuzz (`t/b.test.mjs`).
- `c2-build/`, `c2-fix/tools/`, `c3-rt/`, `c3-mut/`: builder scripts: scenarios s30 (plan), s50 (memory), s60 to s62
  (offline advance, Adjust, heart rate), mutation runners.
- `c2-feas/budget/tools/`: page-size tools (`split.cjs` splits a compiled page into modules; `tokeq.cjs` proves two
  builds token-identical; `nocomment.config.js` was the prototype of the babel wrapper now in `build-lite-bin.sh`).

The compiled page to test is `<out>/intermediates/loader_out_lite/js/default/pages/index/index.js` from
`native/wear/build/build-lite-bin.sh`. Findings these tools produced are in `native/wear/research/`.
