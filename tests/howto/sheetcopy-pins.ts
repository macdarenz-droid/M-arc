// F-SHEET-COPY (#421; D-PLATEFIX-PINS form, as platefix4-pins.ts): the tools/plates/library/MANIFEST.json keys its
// [golden update] commit moves (the golden-B files the copy change edits, layers.mjs, build-layers-page.mjs, the
// library How-to sources with a "right and wrong" heading and the hand-pair words), for the MANIFEST blanked-keys tests
// (crop-projection, lib-shapes, pair-faults, research-routes). No row's `entry` moves: no plate entry changes.
// scProblems: each moved key pins its file's current sha256. restoreSC: the same keys put back to main a4796243's
// values (one value per key in every row that lists it), so each test's pin, measured on main, holds.
// build-layers-page.mjs is not listed: those tests already pin it to its current file (LIB-SHIP W2's W2_MOVED in
// lib-shapes), so main's value is never restored for it.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = new URL('../../', import.meta.url);
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');

/** The moved keys and main a4796243's value of each. */
export const SC_MAIN: Record<string, string> = {
  'tools/plates/layers.mjs': '7c2c9f05aba10076d8865da2caa6bb277b54f1b07d62868cb23051d8aea8fb4b',
  'tools/plates/layers/MANIFEST.json': 'c70b1f287876a1adbd4cf7ba0d751d8e3d79534426032a0c31a03608aa635181',
  'tools/plates/layers/artifact/copy-lint.mjs': 'f568f938e0ac9d7555e8565848c1d5e7d9a6d3b78fb6f1d85cb7dabb4f6aeafe',
  'tools/plates/layers/artifact/howto-layers.mjs': '6ffc0eeb8617fa3902c72108c9b3e4ecec43121ac5893a8c364089aeca5bc675',
  'tools/plates/layers/engine/feelmap.mjs': '5591b59425a2ace2ddc0e2f7b8f6dd937bd6e60760a2c51636076d8ac862e85a',
  'tools/plates/layers/howto/shared.mjs': '60b52bc2e190e29dbd6a63bacbe38da26a7e94255c2a08fe94fde5143781c0d4',
  'tools/plates/library/hands/words/bar-hang-over.json': 'e434211dae2830bb1c26768214604654133854aaed5fdb3ce020294dd47d8164',
  'tools/plates/library/hands/words/bar-hang-under.json': 'e434211dae2830bb1c26768214604654133854aaed5fdb3ce020294dd47d8164',
  'tools/plates/library/hands/words/bar-pulldown-under.json': '36bac7b6bdea063fa194a8ef286f6ccddceebd627a7b365b0b50889249c66b18',
  'tools/plates/library/hands/words/bar-row-over.json': '36bac7b6bdea063fa194a8ef286f6ccddceebd627a7b365b0b50889249c66b18',
  'tools/plates/library/hands/words/battle-rope-rope-neutral.json': '6d98ae9b3242ab9b7402a7b793200006df36a3e7ea9c8d965ed7b6bd986e6028',
  'tools/plates/library/hands/words/curl-bar-under.json': '6adc150b370d3b44475824febfd985f8d61964aaaf155aea5df3d7215a947edd',
  'tools/plates/library/hands/words/curl-dumbbell-neutral.json': 'c0922f8b0adf6feb116df08818383d97e038c4cad04348fb38645d0fe2b470fa',
  'tools/plates/library/hands/words/curl-dumbbell-under.json': 'c0922f8b0adf6feb116df08818383d97e038c4cad04348fb38645d0fe2b470fa',
  'tools/plates/library/hands/words/d-handle-pull-unstated.json': '6b7237b2cc307d5f75a438d5f28b30e3958ba007322301ac707643fb1a4dfba9',
  'tools/plates/library/hands/words/ez-curl-angled.json': '6adc150b370d3b44475824febfd985f8d61964aaaf155aea5df3d7215a947edd',
  'tools/plates/library/hands/words/ez-curl-over.json': '4380738899a9538f19a8505a52ce4a4b7a260ee79eba711b2fa465e5da6fcb0e',
  'tools/plates/library/hands/words/ez-curl-under.json': '6adc150b370d3b44475824febfd985f8d61964aaaf155aea5df3d7215a947edd',
  'tools/plates/library/hands/words/palm-flat-floor-over.json': 'b352b9d173e2d9fe165eff2a4e18d50848472ed6c80883bcf2a8caddb316b3c9',
  'tools/plates/library/hands/words/rope-push-neutral.json': '4fa01997934b0785da420904d72440d984d4cbe6b6ef497143f168d7b0bf50e0',
  'tools/plates/library/hands/words/v-handle-pull-neutral-overhead.json': '36bac7b6bdea063fa194a8ef286f6ccddceebd627a7b365b0b50889249c66b18',
  'tools/plates/library/howto/lib_assisted_pull_up.howto.mjs': '7f2eb8b4a5924f5ad925bf148bdae885ba9a361de275e69be0350d86db49f94a',
  'tools/plates/library/howto/lib_chin_up.howto.mjs': '3b95f55990a26fcf54a71e336a45a47615fcf6f1de8944c8dc6e05c869f3d94e',
  'tools/plates/library/howto/lib_close_grip_pulldown.howto.mjs': '2ae670f9f0d2054b724047e97b0b936675aacaa232280a9f0e82dcac05eca89f',
  'tools/plates/library/howto/lib_hanging_knee_raise.howto.mjs': '78a232d306f9d772a8a46d06b658cbc676971831e528757790ee03c3d6e775af',
  'tools/plates/library/howto/lib_incline_machine_press.howto.mjs': '5b200b2a2821c714090754ad8035031340aaefb97400f997925f2ad29561f937',
  'tools/plates/library/howto/lib_inverted_row.howto.mjs': '2476658a0ddd1ae0eeb4068c4aad85fcfaa896c3b1db9142b906a9eb0e434a21',
  'tools/plates/library/howto/lib_shoulder_press.howto.mjs': '667189b194f622690d05469d63ba329f7e611739e15d72444f297c40e2f31962',
  'tools/plates/library/howto/lib_underhand_lat_pulldown.howto.mjs': 'e13a5d9b2ebd675b8f6dfe541e53228231434cbc8e6ad08cbce80b2a4f689520',
};

/** Problems with `m`'s F-SHEET-COPY changes (empty when each moved key pins its file's current sha256). */
export function scProblems(m: any): string[] {
  const bad: string[] = [];
  for (const [id, r] of Object.entries<any>(m.rows)) for (const k of Object.keys(SC_MAIN)) {
    const now = sha(readFileSync(new URL(k, ROOT)));
    if (k in r.files && r.files[k] !== now) bad.push(`${id} ${k}: ${r.files[k]} != ${now}`);
  }
  return bad;
}
/** `m` with the F-SHEET-COPY keys put back to main a4796243's values; no checks. */
export function restoreSC(m: any): any {
  for (const r of Object.values<any>(m.rows)) for (const [k, v] of Object.entries(SC_MAIN)) if (k in r.files) r.files[k] = v;
  return m;
}

// ---- the copy change itself, undone (for the body/page pins that were measured on main before F-SHEET-COPY) ----
/** The B1 stems: each "<stem>: right and wrong" heading of the 8 became "<stem>". */
export const SC_STEMS = ['Hand', 'Bar on back', 'Depth', 'Top height', 'Shoulders', 'Pelvis curl', 'Knee pad', 'Bar path', 'Back on pad',
  'Feet', 'Seat height', 'Shoulder blades', 'Top position', 'Back line', 'Finish'];
const DISCLAIMER_OLD = 'General guidance, not medical advice. If something hurts, stop and get it checked.';
const DISCLAIMER_CSS = "/* the owner's safety line, once per sheet, small, last, after the risks */\n.ht-disclaimer { margin-top: var(--sp-2); font-size: var(--fs-meta); line-height: var(--lh-meta); color: var(--text-2); }\n";
const Q = '\\\\?"';   // a double quote, raw (HTML) or escaped inside a generated string literal
const stems = SC_STEMS.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
/**
 * `text` with every F-SHEET-COPY copy replacement reversed: the old headings, the old map label and, for a layers page
 * (`page: true`), the closing line after each Risks section and its CSS rule. Applied to a file this PR changed, the
 * result is main's bytes exactly when only the copy moved (the pins below then hold unchanged).
 */
export function toMainCopy(text: string, { page = false } = {}): string {
  let t = text
    .replace(new RegExp(`(sheet-eyebrow${Q}>)Technique(</span>)`, 'g'), '$1How to do it$2')
    .replace(new RegExp(`(-setup-h${Q}>)Setup(</h4>)`, 'g'), '$1Set it up$2')
    .replace(new RegExp(`(-feel-h${Q} tabindex=${Q}-1${Q}>)Target muscles(</h4>)`, 'g'), '$1Where you should feel it$2')
    .replace(new RegExp(`(${Q})Target muscles\\. `, 'g'), '$1Where you should feel it. ')
    .replace(new RegExp(`(fr-head${Q}>)Off-target feel(</h5>)`, 'g'), '$1If you feel it in…$2')
    .replace(new RegExp(`(-risks-h${Q}>)Risks(</h4>)`, 'g'), '$1Risks and when to stop$2')
    .replace(new RegExp(`(-h${Q} tabindex=${Q}-1${Q}>)(${stems})(</h4>)`, 'g'), '$1$2: right and wrong$3')
    .replace(new RegExp(`(role=${Q}group${Q} aria-label=${Q})(${stems})(${Q})`, 'g'), '$1$2: right and wrong$3')
    .replace(new RegExp(`("heading": ")(${stems})(")`, 'g'), '$1$2: right and wrong$3')
    .replaceAll('Thumbless grip', 'Option: thumb over the bar')
    .replace('// One string per exercise: golden B\'s "Target muscles" section', '// One string per exercise: golden B\'s "Where you should feel it" section');   // feel-*.ts line 2
  if (page) {
    t = t.replace(/(<section class="hw-sec risks" id="([a-z0-9-]+)-risks"[\s\S]*?<\/section>)/g, (_m, s, pre) => `${s}\n  <p class="ht-disclaimer" id="${pre}-disclaimer">${DISCLAIMER_OLD}</p>`);
    const at = '.hw-sec { margin-top: var(--sp-5); padding-top: var(--sp-4); border-top: 1px solid var(--border-subtle); }';
    t = t.replace(at, DISCLAIMER_CSS + at);
  }
  return t;
}
