# HT-11 design note: byte-preserving path encoding of the plate SVGs, and crop reuse

Card: `docs/supervisor/verify/ht-11-card.md` (claude/sup-lib4-cards fa3ce1a6). Base: main 565ea5a4. Do 0 only: no build
commit until the supervisor posts `HT-11 NOTE RULED`. Every number below comes from a scratch build of that base plus the
prototype (not committed), node 22.22.0, gzip at zlib's default level (the gate's A2 `gzipSync(b)`).

## 1. Format

Only path data is encoded: each ` d="X"` value inside the four figure strings of a plate (normal svg and overlay,
mistake svg and overlay). Everything else in the strings, and every other field of the module, stays a literal.
The four strings share one path table (the distinct paths in first-seen order), and each ` d` value becomes one of:

| Form | Meaning | Used for |
|---|---|---|
| `X` | raw, byte for byte | anything the forms below do not fit (H/V/A/relative commands, negative numbers) |
| `^n` | the table's n-th path, n in decimal | a repeat; this is the Mistake-against-Normal delta: most Mistake paths are Normal paths (counts below) |
| `~#…` | a Catmull-Rom spline as the engine draws it (`tools/plates/vendor/engine/geom.mjs:41-49`): segment count, closed flag, the n + 1 on-curve points (each as its step from the previous step), then each segment's four control numbers as their difference from the Catmull-Rom control of the decoded points | body outlines |
| `~~…` | a circle drawn as two arcs (`geom.mjs:51`): x, y, r and the width's difference from 2r | joints, dots |
| `~M…` | any path of absolute M C L Q Z: each number as its difference from a prediction (C: smooth join, end three c1 steps on, c2 a third back; L/Q: one step on) | bars, machine parts |

Numbers are hundredths, zigzag varints in a 64-character alphabet with no `"`, `\`, `~`, `^` or command letter. A
number only qualifies when it is canonical (`0|[1-9][0-9]*` with at most two fraction digits and no padding zero),
which every engine number is (`f = n => +(+n).toFixed(2)`).

Path forms per figure (N = normal svg, M = mistake svg):

| Exercise | N ref / spline / circle / walk / raw | M ref / spline / circle / walk / raw |
|---|---|---|
| barbell-back-squat | 11 / 23 / 11 / 7 / 6 | 82 / 7 / 6 / 4 / 1 |
| dumbbell-lateral-raise | 6 / 25 / 20 / 15 / 5 | 60 / 2 / 0 / 2 / 4 |
| hanging-leg-raise | 17 / 30 / 12 / 11 / 4 | 96 / 7 / 3 / 3 / 3 |
| lat-pulldown | 19 / 20 / 27 / 32 / 8 | 146 / 6 / 5 / 4 / 2 |
| leg-press | 13 / 20 / 10 / 19 / 6 | 106 / 5 / 1 / 3 / 1 |
| machine-chest-press | 13 / 10 / 8 / 45 / 6 | 115 / 4 / 3 / 5 / 3 |
| pull-up | 25 / 25 / 11 / 18 / 5 | 108 / 7 / 3 / 0 / 3 |
| seated-cable-row | 17 / 20 / 26 / 36 / 8 | 150 / 6 / 5 / 3 / 3 |

A numeric delta of a Mistake path against its Normal twin of the same shape was also measured: it saved at most 0.7 %
of a chunk (squat), so it is not in the format.

### Where it is decoded, and why the chunk imports nothing

`src/howto/delta.js` holds the one decoder, `unpack(frags, table)` (plain JS, typed by `delta.d.ts`; type-clean as
TypeScript through its default parameters). The generator writes its source text into each `ht-<slug>.ts`, inside the
module's own object literal:

```ts
import type { BuiltHowTo } from '../types';

export default {
  schema: 1, id: …, name: …, hashes: { … },
  plate: (() => {
    const unpack = function unpack(frags = [''], table = frags.slice(0, 0)) { … };   // delta.js, verbatim
    const [nSvg = '', nOverlay = '', mSvg = '', mOverlay = ''] = unpack(["…", "…", "…", "…"]);
    return { view: …, normal: { svg: nSvg, overlay: nOverlay, firstKey: …, cues: […] }, mistake: { … }, tells: …, … };
  })(),
  …
} satisfies BuiltHowTo;
```

So the module keeps its shape: one `import type` line, `export default {` right after it, the `satisfies BuiltHowTo`
tail, and no import or export inside the literal. HT2-A4 and LIB-4d's `readHowTo` (tests/howto/generated-module.ts)
accept it unchanged, and `readHowTo` returns the decoded strings, so every test that reads a module (L2 HT2-A1 by
import, HT2-A2, HT2-A6, HT6-A8, HT9-A3, LIB-4b) sees the golden bytes. The app code is unchanged: PlateView and
share/png.ts read the same fields (`PlateView.tsx:26,32`).

A shared decoder chunk was built and measured first. Any import in an `ht-*` chunk makes Vite wrap its loader line in
a preload list, which grows `loaders-*.js` by about 60 B per id: 4,561 → 5,037 B raw with a `delta-*.js` chunk, and
5,166 B with the decoder in HowToSheet, both over the loaders ceiling of 5,018 B (per-id rule, D-LIB2-loaders-budget),
and a `delta-*.js` chunk would sit outside every budget (the A25 total matches `HowToSheet-|ht-|hand-|…|loaders-`
only). The copy per chunk costs 1,643 B raw / about 950 B gz after minification, already inside the measurements below.

### Why it is byte-preserving

- `pack()` (tools/plates/gen/codec/delta.mjs) runs the real decoder on its own output on every `generate` and throws
  unless every fragment comes back `===`; the generator then refuses to write. A form is chosen only for a value that
  re-formats to its own bytes; anything else stays raw.
- Numbers are integers (hundredths); predictions use `+ - * /` and `Math.round` on them, which IEEE 754 and the
  language define exactly, and the decoder and the check run the same function.
- The forms hold only the alphabet above, so no character outside ASCII is ever produced, split or moved. Text outside
  ` d="…"` is untouched.
- A source string that already contains ` d="~` or ` d="^` is refused, so no raw value is mistaken for a code.

### Decoder size

`src/howto/delta.js` `unpack`: 2,684 B of source in each module, 1,643 B raw and 957 B gz on its own after Vite's
minifier. Nothing is added to HowToSheet-*.js or loaders-*.js (measured: 24,014 / 8,945 B and 4,561 / 1,088 B, as on
main).

## 2. Prototype measurement (the 8 base chunks)

Scratch build of main 565ea5a4 vs main 565ea5a4 + prototype, `www/assets/ht-<slug>-*.js`:

| Chunk | raw before | gz before | raw after | gz after | gz saved | ≤ 65 % of before? |
|---|---|---|---|---|---|---|
| ht-dumbbell-lateral-raise | 70,331 | 15,286 | 32,274 | 9,532 | 37.6 % | yes (limit 9,935) |
| ht-barbell-back-squat | 100,317 | 24,008 | 39,643 | 10,448 | 56.5 % | yes |
| ht-pull-up | 131,399 | 31,339 | 41,705 | 11,615 | 62.9 % | yes |
| ht-hanging-leg-raise | 124,442 | 30,631 | 45,059 | 11,623 | 62.1 % | yes |
| ht-lat-pulldown | 119,134 | 27,005 | 46,321 | 11,780 | 56.4 % | yes |
| ht-seated-cable-row | 124,789 | 28,371 | 49,449 | 12,271 | 56.7 % | yes |
| ht-leg-press | 101,192 | 20,813 | 37,854 | 10,153 | 51.2 % | yes |
| ht-machine-chest-press | 106,902 | 22,590 | 40,685 | 9,958 | 55.9 % | yes |

The 8 together: 200,043 → 87,380 B gz. The smallest chunk, the lateral raise, carries the least path data and has the
least margin (403 B under its 65 % line); the spline form is what gets it there (without it: 10,465 B, 31.5 %).

## 3. Crop reuse

Measured for every zoom chunk against its base chunk's decoded path table (distinct ` d` values):

| Chunk | paths shared with its base | strings gz, own encoding | strings gz, with base refs | gain from refs |
|---|---|---|---|---|
| posture-barbell-back-squat | 29,736 B of 42,340 | 5,325 | 3,658 | 1,667 B |
| posture-lateral-raise | 87,304 B of 89,269 | 6,483 | 3,851 | 2,632 B |
| posture-machine-chest-press | 59,376 B of 71,120 | 6,432 | 4,637 | 1,795 B |
| posture-seated-cable-row | 5,634 B of 79,384 | 7,155 | 6,972 | 183 B |
| posture-hanging-leg-raise, -lat-pulldown, -leg-press, -pull-up | 0 | 6,514 / 6,598 / 5,044 / 6,960 | +8 to +12 B | none |
| hand-* (8), feel-* (8) | 0 | – | – | none |

(Before, those posture strings are 12,077 / 22,499 / 14,884 / 16,171 / 16,294 / 15,233 / 10,281 / 17,371 B gz.)

Load order: a posture chunk loads only from the open sheet, after its base: HowToSheet.tsx:30 loads the base
(`LOADERS[id]`) and renders the sections only with it (`setHowTo`, :39), and Posture.tsx:17 imports `POSTURE[chromeId]`
from there. For the refs the posture chunk imports its base chunk's default export and rebuilds the table from its
four decoded strings (so the base module gains no export); that import adds the base file to the posture loader's
preload list, an estimated 35 B per such id in loaders-*.js (headroom 457 B at the 8; measured in the build).

## 4. Decode cost

`unpack` on each plate's four strings, node 22.22.0, 20 warm-up runs then 100 timed runs:

| Plate (decoded bytes) | median | max |
|---|---|---|
| pull-up (122,388, the largest) | 0.85 ms | 3.04 ms |
| hanging-leg-raise (115,421) | 0.60 ms | 1.14 ms |
| seated-cable-row (115,102) | 1.02 ms | 2.86 ms |
| barbell-back-squat (90,838) | 1.16 ms | 2.25 ms |

It runs once per sheet open, when the chunk is evaluated. The gate's A3b (tap-to-plate at 4x CPU, hard fail over
400 ms) and A3c (no long task over 100 ms) keep measuring it on the real app.

## 5. Build plan

Files and lines:
- New: `src/howto/delta.js`, `src/howto/delta.d.ts` (the decoder), `tools/plates/gen/codec/delta.mjs` (the encoder; in
  a subfolder, so `generate`'s plugin glob does not load it as a plugin).
- `tools/plates/gen/plates.mjs`: `moduleText(id, p, entry, hash, packed = false)`; the two output calls pass `true`
  (the 8 at :129, library rows at :185); `inputsFor` adds the two codec files to each `ht-*.ts`'s inputs. Without
  `packed` the text is byte-identical to main, so LIB-3 H7's `chunkBytes` and L2-A19's pinned sha256s are unchanged
  (H7 then sizes the unpacked form: stricter than what ships).
- Generated by `node tools/plates/generate.mjs` only: the 8 `ht-*.ts`; `index.ts` and `plate.css` get a new header
  hash only (their writer plates.mjs changed).
- If R3 is yes: `tools/plates/gen/zooms.mjs` `postureText` and the 8 `posture-*.ts`.
- `tests/howto/budgets.json`: the 8 `ht-*` rows (and posture rows if R3) to measured + 10 %, setBy HT-11; totals[0]
  measuredGz / measuredRaw lowered to the new 8's total (D-LIB2-total), so its ceiling only goes down.
- No app source change: the modules decode themselves.

Tests added (each fails before and passes after; mutations listed in the PR):
- `tests/howto/delta.test.ts`: decode(encode(s)) === s for every fragment of every shipped plate and posture panel;
  a fragment with non-ASCII text and paths next to it; a fragment with no path (empty delta); each form at least once;
  pack refuses a source with ` d="~` / ` d="^` and a codec whose prediction is off by one; one flipped digit in a
  generated module's encoded string makes the HT2-A1 comparison red; the decoder text in every `ht-*.ts` equals
  `String(unpack)` of delta.js.
- Size: each base chunk's gz ≤ 65 % of its main 565ea5a4 value, the 8 values pinned with their source.
- Gate: an HT-11 block (add-only) imports each built `ht-*-*.js` in the served app (Chromium, minified decoder) and checks
  the sha256 of its four figure strings against the latest GOLDEN.json entry; the HT-3 F3 and L3 blocks (figure
  innerHTML and pixels against the golden) stay as they are and prove the screenshots unchanged.

## 6. Risks

| Risk | Mitigation |
|---|---|
| An op splits a multi-byte character or an attribute | Only ` d="…"` values change; codes are ASCII; pack() and the round-trip test (with non-ASCII text) prove every fragment; L2 HT2-A1 compares with `===` |
| A stale encoded string | Modules come only from `generate`; inputsSha256 covers both codec files; HT2-A2 freshness and the gate's `generate --check` |
| Encoder and decoder drift | One decoder; pack() runs it on every generate and refuses a mismatch |
| A gate screenshot changes | Decoded bytes are the golden's: HT-3 F3 / L3 unchanged, plus the HT-11 browser sha256 probe |
| Decode cost on a budget phone | 0.85 ms median in node for the largest plate; A3b and A3c measure the real open at 4x CPU |
| A future plate with paths the forms do not fit | Those values stay raw (no failure); the plate is only larger; per-chunk ceilings still catch it |
| The decoder copy per chunk (about 950 B gz each, about 145 KB gz at 153 ids) | Measured against the shared-chunk option (section 1); a supervisor-owned `vite.config.ts` change (modulePreload) would allow one shared copy later |
| Lane branches that touch `ht-*.ts` (#109) | They regenerate after merging main; generated files are never merged by hand |
| Other tasks' pins on the module text (R1, R2) | Changed only as ruled |

## 7. Rulings asked

- **R1, L2-A3 (LIB-2, tests/howto/library-core.test.ts:35-50).** It pins the body sha256 of 54 generated files at main
  c542ae9 (tests/howto/fixtures/generated-bodies.json), the 8 `ht-*.ts` among them, so HT-11's intended change turns it
  red. Proposal: re-pin those 8 entries only, noting HT-11 and the commit in the fixture's `$comment`; the other 46 stay.
  The meaning the guard kept for them (same content) moves to HT-11's test: each packed module deep-equals the object of
  its unpacked `moduleText`.
- **R2, D-LIB2b-PINS (LIB-2b, tests/howto/library-rows.test.ts:478-481).** It checks that the module *text* contains
  `JSON.stringify(s)` for each plate string, which no encoding can keep for svg and overlay. Proposal: for those four,
  compare `readHowTo(slug, base)`'s strings with `===` (stricter than a substring); tells and tempo keep the text check.
- **R3, crop reuse scope.** Proposal: pack all 8 posture chunks with the same codec (their path strings 51-83 % fewer gz bytes; per chunk less, after the decoder copy),
  with base refs for the four rows in section 3 where they gain. Hand and feel chunks share nothing with their base and
  stay as they are (hands.test pins their imports).
- **R4.** LIB-3 H7 keeps sizing the unpacked `moduleText` (stricter than shipped), so L2-A19 stays pinned. Proposal: keep.

## 8. As built (after HT-11 NOTE RULED and D-HT11-CROPREF)

- R1-R4 as ruled. Crop refs are not built (D-HT11-CROPREF = (b): HT7-A5 keeps its one import). The 8 posture chunks are
  packed with their own tables.
- The generated modules carry `decoderSource()`, which is unpack read from the src/howto/delta.js file text, not
  `String(unpack)`. vitest's loader transforms delta.js, so `String()` gave other bytes under vitest than under node,
  and L2-A3's fingerprints differed between the two. tests/howto/delta.test.ts D4 checks that each module holds that
  text once.
- R1 re-pins the 8 posture bodies with the 8 ht bodies: R3 packs them, so their bodies change on purpose.
- Built sizes (gz, zlib default) are in the PR's READY table. Hand and feel chunks are unchanged, and loaders-*.js is
  4,561 / 1,088 B against its 5,018 / 1,197 B ceiling.
- F-HT11-1 (follow-up, not this card): one shared decoder copy needs a supervisor-owned `vite.config.ts` change.
