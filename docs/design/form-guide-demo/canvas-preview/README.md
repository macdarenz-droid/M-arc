# Canvas preview

A static page that shows all 13 Design-canvas artboards in `../project/` (placed as in `canvas.json`, the 3 animated players first), for an account that has no Design canvas type.
`runtime.js` is a small stand-in for the Design canvas runtime, used only for that reason: it renders the `<x-dc>` markup and `DCLogic` class of each `.dc.html` file (holes, `sc-if`, `sc-for`, events, `dc-import`, props, state and lifecycle) and throws a visible `dc-runtime: unsupported construct` error for anything else.

- Build: `node build.mjs` writes `out/`: one wrapper page per artboard (`<Name>.html`), `runtime.js` and `index.html` (the canvas page, written as an Artifact page: the host adds the document skeleton). The output is deterministic; re-run it whenever a `.dc.html` file changes.
- Check: `MARC_CHROMIUM=/opt/pw-browsers/chromium node check.cjs` loads every page in Chromium, fails on any error or empty artboard, compares each player with its `anim-*/index.html` harness (`HARNESS=<dir>` points at another copy) and saves screenshots in `out/shots/`.
- `out/` is not committed; publish `out/index.html` with the wrapper pages and `runtime.js` as its files.
