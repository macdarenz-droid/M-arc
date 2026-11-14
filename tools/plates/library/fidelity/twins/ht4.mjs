// LIB-4b twin of gate group HT-4 (pinned in ../twins.mjs): HT4-A5 (every renderPlate call of the id's layers build:
// options, protected fields, an untouched base call, poses; the page's plate fragments) and HT4-A6 (goldenB.mjs's
// state-driver self-check on the id's layers page, per theme). The A5 capture build runs once per run.
// For the 8 the layers build is the vendored golden B (tools/plates/layers) with HT-4's exact path (D-LIB4b-POSES (6)).
// A library id's build is LIB-6's builder, captured through a shim on a mirror of tools/plates, and its pose rule is
// derived from source (D-LIB4b-POSES (1)-(5), libraryA5); without LIB-6 in the tree its A5 rows fail: never a skip.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { rows as registryRows, sourceOf } from '../../registry.mjs';
import { WIDTH, pinnedPlate } from '../tuples.mjs';
import { stateOf } from '../rows.mjs';

const GB = () => import('../../../fidelity/goldenB.mjs');
const A5 = s => stateOf('HT4', `A5-${s}`, null);

/** The capture of the vendored layers build: its renderPlate calls, its built page and golden A's specs (once). */
async function capture8(ctx) {
  if (!ctx.ht4) ctx.ht4 = (async () => {
    const layers = await import(pathToFileURL(join(ctx.root, 'tools/plates/layers.mjs')).href), gb = await GB();
    const mirror = layers.makeMirror();
    try {
      const specs = await gb.loadGoldenASpecs(), calls = await gb.captureRenderPlateCalls(mirror);
      return { specs, calls, html: readFileSync(join(mirror, 'artifact', 'technical-plates.html'), 'utf8'), entries: JSON.parse(readFileSync(join(ctx.root, 'tests/howto/golden/GOLDEN.json'), 'utf8')).entries.filter(e => e.kind === 'plate') };
    } finally { layers.cleanupMirror(mirror); }
  })();
  return ctx.ht4;
}

/** HT4-A5 for one id (theme '*'). */
export async function runNode(ctx, { lib, chrome }) {
  const { R } = ctx, gb = await GB();
  const eight = gb.IDS.includes(chrome);
  if (!eight) return runLibrary(ctx, { lib });
  const c = await capture8(ctx);
  const entry = c.entries.filter(e => e.id === lib).pop();
  R.check(lib, '*', A5('fragments'), entry ? gb.fragmentProblems(c.html, [entry]) : [`no GOLDEN.json plate entry for ${lib}`]);
  const specId = entry?.slug.replace(/-/g, '_'), goldenA = c.specs[specId], calls = c.calls.filter(x => x.spec.id === specId);
  if (!goldenA) {   // the reference plate (ref-src) draws its crops itself: never through renderPlate, pinned by its crop params
    R.check(lib, '*', A5('protected'), [...(calls.length ? [`${calls.length} renderPlate calls for the ref-src plate`] : []), ...await gb.validateLateralRaiseCrops(join(ctx.root, 'tools/plates/layers'))]);
    R.check(lib, '*', A5('poses'), calls.length ? [`${calls.length} renderPlate calls for the ref-src plate`] : []);
    return;
  }
  const bad = [];
  if (!calls.length) bad.push(`captured 0 renderPlate calls for ${specId}`);
  for (const x of calls) for (const k of Object.keys(x.opts ?? {})) if (!['id', 'mistake', 'selected'].includes(k)) bad.push(`call ${JSON.stringify(x.opts)} uses an option outside {id, mistake, selected}`);
  for (const x of calls) bad.push(...gb.protectedFieldProblems(specId, x, goldenA));
  if (!calls.some(x => JSON.stringify(x.spec) === JSON.stringify(goldenA))) bad.push(`no untouched base-plate call found for ${specId}`);
  R.check(lib, '*', A5('protected'), bad);
  R.check(lib, '*', A5('poses'), gb.validateCalls(calls, c.specs));
}

// ---- library ids (D-LIB4b-POSES) -----------------------------------------------------------------------------------
const strip = v => JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'function' ? undefined : x)));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
/** goldenB.mjs's mergeDeep (not exported there; LIB-6's render/closeup/common.mjs holds the same function). */
export const mergeDeep = (a, b) => {
  if (b === undefined) return a;
  if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
    const o = { ...a };
    for (const k of Object.keys(b)) o[k] = mergeDeep(a[k], b[k]);
    return o;
  }
  return b;
};
/** The spec ids of the 8 (golden A's plate specs, the lateral raise under both its names): never a library spec.id. */
export const SPEC_IDS_8 = ['lateral_raise', 'dumbbell_lateral_raise', 'barbell_back_squat', 'pull_up', 'hanging_leg_raise', 'lat_pulldown', 'seated_cable_row', 'leg_press', 'machine_chest_press'];

/** engine/plate.mjs's shim: every renderPlate call (opts, spec with functions stripped), written to `out` at exit. */
const shim = out => `export * from './plate.real.mjs';
import { renderPlate as __real } from './plate.real.mjs';
import { existsSync, writeFileSync } from 'node:fs';
const g = globalThis;
// D-SHIP-A5VENDOR: the twin's own process also loads the shimmed engines (it imports the mirror's builder); its exit runs
// after the mirror is gone, so it writes only while the mirror exists (the build's child process writes the record)
if (!g.__LIB4B_RP) { g.__LIB4B_RP = []; process.on('exit', () => { if (existsSync(${JSON.stringify(dirname(out))})) writeFileSync(${JSON.stringify(out)}, JSON.stringify(g.__LIB4B_RP)); }); }
export function renderPlate(spec, opts) {
  g.__LIB4B_RP.push({ opts: opts ? { ...opts } : opts, spec: JSON.parse(JSON.stringify(spec, (k, v) => typeof v === 'function' ? undefined : v)) });
  return __real(spec, opts);
}
`;

/**
 * D-LIB4b-POSES (1): LIB-6's layers build with every renderPlate call recorded (HT-4's captureRenderPlateCalls method on
 * a mirror of tools/plates: the mirrored engine/plate.mjs is a recording shim, so both golden B's scripts and LIB-6's
 * close-up renderer draw through it). `specOf(mirrorRoot, builder)` returns the buildLayersPage spec. -> { calls, html }.
 */
/** D-SHIP-A5BACK: the files MANIFEST.json pins for `ids` that lie outside tools/plates and src/data (sorted, unique). */
export function mirrorExtras(root, ids = []) {
  // D-SHIP-A5BACK-CARDS: the MANIFEST-pinned files first (sorted), then the pair rows' research cards (sorted, not repeated)
  const f = join(root, 'tools/plates/library/MANIFEST.json'), out = new Set();
  if (ids.length && existsSync(f)) {
    const m = JSON.parse(readFileSync(f, 'utf8'));
    for (const id of ids) for (const p of Object.keys(m.rows?.[id]?.files ?? {})) if (!p.startsWith('tools/plates/') && !p.startsWith('src/data/')) out.add(p);
  }
  const pinned = [...out].sort();
  return [...pinned, ...[...new Set(pairCardsOf(root))].filter(p => !out.has(p)).sort()];
}
/** LIB-SHIP W3 (D-SHIP-A5BACK-CARDS, #384 6648753200): hands/pairs.mjs checks, at import, every layers-config row that
 *  names pairFaults or pairWords against its research card, so any batch's build reads those cards: the research card
 *  of every such row in every pages/*.layers.json (the same dir and card path as pairs.mjs PAGES_DIR and cardFileOf). */
export function pairCardsOf(root) {
  const dir = join(root, 'tools/plates/library/pages'), out = [];
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir).filter(x => x.endsWith('.layers.json')).sort()) {
    for (const [howtoId, row] of Object.entries(JSON.parse(readFileSync(join(dir, n), 'utf8')).closeups ?? {})) {
      if (row && (row.pairFaults !== undefined || row.pairWords !== undefined)) out.push(`docs/research/howto/cards/${howtoId.replace(/^lib_/, '')}.json`);
    }
  }
  return out;
}

export async function captureLayersBuild(root, specOf, ids = []) {
  if (!existsSync(join(root, 'tools/plates/library/build-layers-page.mjs'))) throw new Error('HT4-A5: LIB-6\'s build-layers-page.mjs is not in this tree');
  const T = mkdtempSync(join(tmpdir(), 'lib4b-ht4-'));
  try {
    cpSync(join(root, 'tools/plates'), join(T, 'tools/plates'), { recursive: true });
    cpSync(join(root, 'src/data'), join(T, 'src/data'), { recursive: true });   // LIB-7b (D-LIB7b-SCRATCH2 P4): a pair row's build loads hands/pairs.mjs, which reads src/data/exercises.json
    // LIB-SHIP W2 (D-SHIP-A5BACK, #379 6640257406): the batch's rows can read files outside tools/plates and src/data (today
    // only the back box's research file, which shared/back-box.mjs reads for a back-flagged sheet). The mirror carries every
    // such file that MANIFEST.json pins for the batch's ids: the pinned list is manifest.mjs filesOf's output (manifestProblems
    // keeps them equal), and filesOf itself skips a missing file, so a pinned file that is missing fails loud by name here.
    const cards = new Set(pairCardsOf(root));
    for (const p of mirrorExtras(root, ids)) {
      if (!existsSync(join(root, p))) throw new Error(cards.has(p) ? `HT4-A5: ${p} is a pair row's research card (D-SHIP-A5BACK-CARDS) but missing from the tree` : `HT4-A5: ${p} is pinned in MANIFEST.json for this batch but missing from the tree`);
      mkdirSync(dirname(join(T, p)), { recursive: true });
      cpSync(join(root, p), join(T, p));
    }
    symlinkSync(join(root, 'node_modules'), join(T, 'node_modules'));
    const out = join(T, 'rp-calls.json');
    // LIB-SHIP D-SHIP-A5VENDOR (#376 6617194861): a library spec draws through the vendor engine (D-LIB9-ENGINE), so the
    // mirror's vendor plate.mjs records into the same list as golden B's layers engine; the A5 checks are unchanged.
    for (const eng of [join(T, 'tools/plates/layers/engine'), join(T, 'tools/plates/vendor/engine')]) {
      renameSync(join(eng, 'plate.mjs'), join(eng, 'plate.real.mjs'));
      writeFileSync(join(eng, 'plate.mjs'), shim(out));
    }
    const b = await import(pathToFileURL(join(T, 'tools/plates/library/build-layers-page.mjs')).href);
    const html = (await b.buildLayersPage(await specOf(T, b))).toString('utf8');
    return { calls: JSON.parse(readFileSync(out, 'utf8')), html };
  } finally { rmSync(T, { recursive: true, force: true }); }
}

/** The fault poses a Wrong side declares in source, resolved as LIB-6 resolves them (D-LIB4b-POSES (4)). */
function faultPoses(z, { ref, family, stills, stillPose }) {
  if (family === 'zbox') {
    const decl = (z.wrong === 'start' || z.wrong === 'end') ? stills?.[z.wrong] : stills?.[z.wrong?.still], over = z.wrong?.over ? stills?.[z.wrong.over] : null;
    return [decl, over].filter(Boolean).flatMap(s => [stillPose(s), strip(s.pose)]);
  }
  const poseOf = r => (typeof r === 'string' ? ref.poses?.[r] : r && mergeDeep(ref.poses?.[r.base], r.pose));
  return [poseOf(z.wrong), mergeDeep(poseOf(z.right), poseOf(z.wrong))].filter(p => p !== undefined).map(strip);
}

/**
 * F-HT4-RIGHTPOSE D-RP-OPTIN (#425 6868123318): the exact ruled list of `<spec id>|<zoom key>` pairs whose declared Right
 * pose (`right: { base, pose }`) the twin accepts. Each entry cites the ruling for that custom Right (a D- ruling id and a
 * file:line or a comment id). Every other zoom keeps the D-LIB4b-POSES rule: start, end or mistake only.
 */
export const RULED_RIGHT_POSES = Object.freeze([
  { id: 'dumbbell_shrug|dshrug-top', ruling: 'D-SHIP-DRAWVAL: TOP (howto/lib_dumbbell_shrug.howto.mjs:76-77)' },
  { id: 'bulgarian_split_squat|rear-knee', ruling: 'D-SHIP-DRAWVAL #376 6614695581: KNEE_GAP (howto/lib_bulgarian_split_squat.howto.mjs:59-60)' },
  { id: 'one_arm_dumbbell_row|oadr-top', ruling: 'D-LIB20-TRUNK: the end pose with trunk as an object (howto/lib_one_arm_dumbbell_row.howto.mjs:95-96)' },
  { id: 'cable_external_rotation|cer-turn', ruling: 'D-LIB20-TRUNK: the end pose with trunk as an object (howto/lib_cable_external_rotation.howto.mjs:135-136)' },
  { id: 'diamond_push_up|shoulder-blades', ruling: 'D-SHIP-DRAWVAL #376 6614695581: PINCH (howto/lib_diamond_push_up.howto.mjs:79-80)' },
  { id: 'hack_squat|knee-lock', ruling: 'D-PF4-W67LATER, D-SHIP-DRAWVAL: SOFT_BEND (howto/lib_hack_squat.howto.mjs:96-98)' },
  { id: 'wall_ball|wall-distance', ruling: 'D-SHIP-DRAWVAL, #419 6851987591: ZOOM_RIGHT (howto/lib_wall_ball.howto.mjs:85-86)' },
].map(Object.freeze));
/** A ruled entry's citation: a D- ruling id, and a file:line or a GitHub comment id. */
export const citesRuling = e => typeof e?.ruling === 'string' && /\bD-[A-Z0-9]+(?:-[A-Z0-9]+)+\b/.test(e.ruling)
  && (/\S+\.\w+:\d+(?:-\d+)?/.test(e.ruling) || /\b\d{10}\b/.test(e.ruling));

/** F-HT4-RIGHTPOSE (D-RP-SCOPE): a zoom-shell zoom's declared Right pose (`right: { base, pose }`), resolved as crop.mjs:45
 *  resolves it; [] for a string Right and for the zbox shell (reference poses only on its Right side). */
function rightPoses(z, { ref, family }) {
  if (family !== 'zoom' || !z.right || typeof z.right !== 'object') return [];
  return [mergeDeep(ref.poses?.[z.right.base], z.right.pose)].filter(p => p !== undefined).map(strip);
}

/**
 * HT4-A5 for a library id on LIB-6's build (D-LIB4b-POSES, amended): { protected, fragments, poses } problem lists.
 * calls: every captured renderPlate call; html: the built page; specId: the reference spec's id; ref: the reference spec
 * (functions stripped); howto: the id's How-to (its zooms); prefix: the plate's id prefix (`<prefix>-n`/`-m`); family:
 * LIB-6's close-up shell ('zoom': `<key>-right`/`-wrong` crops; 'zbox': `<key>-r`/`-w`); stills and stillPose (zbox):
 * the How-to's stills and still -> LIB-6's still spec pose; entry: the pinned plate entry. gb: goldenB.mjs (its
 * protectedFieldProblems and fragmentProblems). F-HT4-RIGHTPOSE: for a zoom on `ruled` (default RULED_RIGHT_POSES,
 * D-RP-OPTIN) the declared Right pose is accepted, exactly, on the Right, `-under` and dashed-Wrong calls only (rule (3b)).
 */
export function libraryA5({ calls, html }, { specId, ref, howto, prefix, family, stills = null, stillPose = null, entry, ruled = RULED_RIGHT_POSES }, gb) {
  const out = { protected: [], fragments: [], poses: [] };
  if (SPEC_IDS_8.includes(specId)) out.poses.push(`library spec.id ${specId} is one of the 8's (D-LIB4b-POSES (5))`);
  const mine = calls.filter(c => c.spec?.id === specId);
  if (!mine.length) out.protected.push(`captured 0 renderPlate calls for ${specId}`);
  for (const c of mine) for (const k of Object.keys(c.opts ?? {})) if (!['id', 'mistake', 'selected'].includes(k)) out.protected.push(`call ${JSON.stringify(c.opts)} uses an option outside {id, mistake, selected}`);
  out.protected.push(...mine.flatMap(c => gb.protectedFieldProblems(specId, c, ref)));
  if (!mine.some(c => same(c.spec, ref))) out.protected.push(`no untouched base-plate call found for ${specId}`);
  out.fragments.push(...(entry ? gb.fragmentProblems(html, [entry]) : [`no pinned plate entry for ${specId}`]));
  // (2) attribution: base, cam, the plate's -n/-m, or one side of a posture zoom the source declares
  // F-HT4-UNDER (F-W8A-HOLDS part 1): crop.mjs cropHalf's `<key>-under` call, the Right crop drawn faded under a solid
  // Wrong, is attributed (role 'under', reference poses only) only for a zoom-shell posture zoom that declares crop.mjs's
  // exact condition: wrong.under, and wrong.solid or wrongAlone; such a zoom also gets a `<key>|under` anti-blindness entry
  const posture = (howto.zooms ?? []).filter(z => z.kind === 'posture');
  const underOf = z => family === 'zoom' && !!z.wrong?.under && !!(z.wrong?.solid || z.wrongAlone);
  const seen = new Map(posture.flatMap(z => [[`${z.key}|right`, 0], [`${z.key}|wrong`, 0], ...(underOf(z) ? [[`${z.key}|under`, 0]] : [])]));
  const suffix = family === 'zbox' ? { right: 'r', wrong: 'w' } : family === 'zoom' ? { right: 'right', wrong: 'wrong' } : null;
  if (!suffix) out.poses.push(`unknown close-up shell ${family}`);
  const sideOf = id => {
    if (id === 'base' || id === 'cam' || id === `${prefix}-n` || id === `${prefix}-m`) return { role: null };
    for (const z of posture) for (const role of ['right', 'wrong']) if (suffix && id === `${z.key}-${suffix[role]}`) return { z, role };
    for (const z of posture) if (underOf(z) && id === `${z.key}-under`) return { z, role: 'under' };
    return null;
  };
  // (3) every call not on a Wrong side: a reference pose; (4) a Wrong side may also draw its source-declared fault pose
  // F-HT4-RIGHTPOSE (D-RP-SCOPE, D-RP-OPTIN): (3b) a zoom-shell zoom on the ruled list (RULED_RIGHT_POSES, its entry
  // citing a ruling) has its declared Right pose (rightPoses) accepted as poses.start/end
  // only on the calls whose crop draws it (crop.mjs cropSpec): the Right crop, the `<key>-under` crop and a dashed Wrong
  // (neither wrong.solid nor wrongAlone); never for mistake.pose, base, cam, -n/-m or a solid Wrong. A declaration equal
  // to one of the zoom's own fault poses is a poses problem and is not accepted (never the fault on the Right side).
  const refs = [ref.poses?.start, ref.poses?.end, ...(ref.mistake?.pose ? [mergeDeep(ref.poses?.end, ref.mistake.pose)] : [])].filter(p => p !== undefined);
  const mrefs = ref.mistake?.pose ? [ref.mistake.pose, mergeDeep(ref.poses?.end, ref.mistake.pose)] : [];
  const declared = new Map(posture.map(z => {
    const opt = ruled.find(e => e.id === `${specId}|${z.key}`);
    if (!opt) return [z, null];
    if (!citesRuling(opt)) { out.poses.push(`${specId}|${z.key}: a ruled Right pose entry with no ruling citation`); return [z, null]; }
    const own = rightPoses(z, { ref, family }), faults = own.length ? faultPoses(z, { ref, family, stills, stillPose }) : [];
    if (own.some(p => faults.some(f => same(p, f)))) { out.poses.push(`${specId}|${z.key}: declares a fault pose as its Right`); return [z, []]; }
    return [z, own];
  }));
  const drawsRight = at => at.role === 'right' || at.role === 'under' || (at.role === 'wrong' && !(at.z.wrong?.solid || at.z.wrongAlone));
  for (const c of mine) {
    const id = c.opts?.id ?? '', at = sideOf(id);
    if (!at) { out.poses.push(`${specId}|${id}: a call that cannot be attributed to base, cam, the plate or a declared zoom side`); continue; }
    if (at.z) seen.set(`${at.z.key}|${at.role}`, seen.get(`${at.z.key}|${at.role}`) + 1);
    const fault = at.role === 'wrong' ? faultPoses(at.z, { ref, family, stills, stillPose }) : [];
    const draws = !!at.z && drawsRight(at) && declared.get(at.z) !== null, right = draws ? declared.get(at.z) : [];
    const rightText = draws && family === 'zoom' && at.z.right && typeof at.z.right === 'object' ? ' nor its declared Right pose' : '';
    for (const which of ['start', 'end']) {
      if (!c.spec.poses || !(which in c.spec.poses)) continue;
      if (![...refs, ...fault, ...right].some(r => same(c.spec.poses[which], r))) out.poses.push(`${specId}|${id}: poses.${which} matches neither a reference pose${at.role === 'wrong' ? ' nor its declared fault pose' : ''}${rightText} (${JSON.stringify(c.spec.poses[which]).slice(0, 200)})`);
    }
    if (c.spec.mistake?.pose && ![...mrefs, ...fault].some(r => same(c.spec.mistake.pose, r))) out.poses.push(`${specId}|${id}: mistake.pose matches neither the reference mistake pose${at.role === 'wrong' ? ' nor its declared fault pose' : ''} (${JSON.stringify(c.spec.mistake.pose).slice(0, 200)})`);
  }
  for (const [k, n] of seen) if (!n) out.poses.push(`${specId}|${k}: no renderPlate call captured for this declared zoom side (anti-blindness)`);
  return out;
}

/** HT4-A5 for one library id: LIB-6's build of its batch's layers page (captured once per batch), checked by libraryA5. */
async function runLibrary(ctx, { lib }) {
  const { R, root } = ctx, gb = await GB();
  const row = registryRows(root).find(r => r.id === lib);
  if (!row?.batchFile) { for (const s of ['protected', 'fragments', 'poses']) R.fail(lib, '*', A5(s), `${lib} has no batch file`); return; }
  ctx.ht4lib ??= new Map();
  if (!ctx.ht4lib.has(row.batchFile)) ctx.ht4lib.set(row.batchFile, captureLayersBuild(root, async T => {
    const { layersSpecOf } = await import(pathToFileURL(join(T, 'tools/plates/library/layers-spec.mjs')).href);
    // D-SHIP-A5VENDOR: staged from the mirror T, so a vendor-engine spec's staged closure holds the recording shim
    const s = layersSpecOf(row.batchFile, { stageDir: mkdtempSync(join(tmpdir(), 'lib4b-ht4-stage-')), root: T });
    return s.optionsUrl ? { ...s, optionsUrl: s.optionsUrl.replace(pathToFileURL(join(root, 'tools/plates')).href, pathToFileURL(join(T, 'tools/plates')).href) } : s;
  }, registryRows(root).filter(r => r.batchFile === row.batchFile).map(r => r.id)));
  const cap = await ctx.ht4lib.get(row.batchFile);
  const cfg = JSON.parse(readFileSync(join(root, row.pages.layersConfig), 'utf8'));
  const options = (await import(pathToFileURL(join(root, cfg.optionsModule)).href)).CLOSEUP_OPTIONS[cfg.closeups?.[lib]?.optionsKey];
  const mod = await import(pathToFileURL(join(root, sourceOf(lib, root))).href), howto = mod.default;
  const ref = strip((await import(pathToFileURL(join(root, 'tools/plates', row.src)).href)).default);
  let stillPose = null;
  if (options?.shell === 'zbox') {
    const { CAMERAS, STILLS } = await import(pathToFileURL(join(root, 'tools/plates/library/render/closeup/zbox-geometry.mjs')).href);
    const plateSpec = howto.plate, REF = CAMERAS[options.camera.kind](plateSpec, options.camera);
    const stillSpec = STILLS[options.still.kind]({ mod, howto, plateSpec, stills: mod.stills, H: options.bodyHeight, REF }, options.still);
    stillPose = s => strip(stillSpec(s).poses.end);
  }
  const entry = (await pinnedPlate(lib, root).catch(() => null))?.entry ?? null;
  const got = libraryA5(cap, { specId: ref.id, ref, howto: strip(howto), prefix: row.chromeId, family: options?.shell, stills: mod.stills ? strip(mod.stills) : null, stillPose, entry }, gb);
  for (const s of ['protected', 'fragments', 'poses']) R.check(lib, '*', A5(s), got[s]);
}

/** D-SHIP-A6NOGRIP: false only for a sheet whose handling hands.mjs noPairRuling rules 'D-SHIP-GRIP' (no Grip block). */
export async function gripOf(root, lib) {
  const { noPairRuling } = await import(pathToFileURL(join(root, 'tools/plates/gen/hands.mjs')).href);
  const src = sourceOf(lib, root);
  if (!src) return true;
  const sheet = (await import(pathToFileURL(join(root, src)).href)).default;
  return noPairRuling(sheet) !== 'D-SHIP-GRIP';
}

/** HT4-A6 for one id in one theme: the golden-B state driver self-check on the id's layers page. */
export async function run(ctx, { lib, chrome, theme }) {
  const gb = await GB(), st = stateOf('HT4', 'A6', WIDTH);
  const { browser: b, page, errs } = await gb.openPage(ctx.layersFile(lib), theme, { chromePath: process.env.MARC_CHROMIUM });
  try {
    const bad = await gb.selfCheck(page, chrome, { grip: await gripOf(ctx.root, lib) });
    ctx.R.check(lib, theme, st, [...bad, ...errs.map(e => `page error: ${e}`)]);
  } finally { await b.close(); }
}
