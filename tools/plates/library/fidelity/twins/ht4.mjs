// LIB-4b twin of gate group HT-4 (pinned in ../twins.mjs): HT4-A5 (every renderPlate call of the id's layers build:
// options, protected fields, an untouched base call, poses; the page's plate fragments) and HT4-A6 (goldenB.mjs's
// state-driver self-check on the id's layers page, per theme). The A5 capture build runs once per run.
// For the 8 the layers build is the vendored golden B (tools/plates/layers) with HT-4's exact path (D-LIB4b-POSES (6)).
// A library id's build is LIB-6's builder, captured through a shim on a mirror of tools/plates, and its pose rule is
// derived from source (D-LIB4b-POSES (1)-(5), libraryA5); without LIB-6 in the tree its A5 rows fail: never a skip.
import { cpSync, existsSync, mkdtempSync, readFileSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
import { writeFileSync } from 'node:fs';
const g = globalThis;
if (!g.__LIB4B_RP) { g.__LIB4B_RP = []; process.on('exit', () => writeFileSync(${JSON.stringify(out)}, JSON.stringify(g.__LIB4B_RP))); }
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
export async function captureLayersBuild(root, specOf) {
  if (!existsSync(join(root, 'tools/plates/library/build-layers-page.mjs'))) throw new Error('HT4-A5: LIB-6\'s build-layers-page.mjs is not in this tree');
  const T = mkdtempSync(join(tmpdir(), 'lib4b-ht4-'));
  try {
    cpSync(join(root, 'tools/plates'), join(T, 'tools/plates'), { recursive: true });
    cpSync(join(root, 'src/data'), join(T, 'src/data'), { recursive: true });   // LIB-7b (D-LIB7b-SCRATCH2 P4): a pair row's build loads hands/pairs.mjs, which reads src/data/exercises.json
    symlinkSync(join(root, 'node_modules'), join(T, 'node_modules'));
    const eng = join(T, 'tools/plates/layers/engine'), out = join(T, 'rp-calls.json');
    renameSync(join(eng, 'plate.mjs'), join(eng, 'plate.real.mjs'));
    writeFileSync(join(eng, 'plate.mjs'), shim(out));
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
 * HT4-A5 for a library id on LIB-6's build (D-LIB4b-POSES, amended): { protected, fragments, poses } problem lists.
 * calls: every captured renderPlate call; html: the built page; specId: the reference spec's id; ref: the reference spec
 * (functions stripped); howto: the id's How-to (its zooms); prefix: the plate's id prefix (`<prefix>-n`/`-m`); family:
 * LIB-6's close-up shell ('zoom': `<key>-right`/`-wrong` crops; 'zbox': `<key>-r`/`-w`); stills and stillPose (zbox):
 * the How-to's stills and still -> LIB-6's still spec pose; entry: the pinned plate entry. gb: goldenB.mjs (its
 * protectedFieldProblems and fragmentProblems).
 */
export function libraryA5({ calls, html }, { specId, ref, howto, prefix, family, stills = null, stillPose = null, entry }, gb) {
  const out = { protected: [], fragments: [], poses: [] };
  if (SPEC_IDS_8.includes(specId)) out.poses.push(`library spec.id ${specId} is one of the 8's (D-LIB4b-POSES (5))`);
  const mine = calls.filter(c => c.spec?.id === specId);
  if (!mine.length) out.protected.push(`captured 0 renderPlate calls for ${specId}`);
  for (const c of mine) for (const k of Object.keys(c.opts ?? {})) if (!['id', 'mistake', 'selected'].includes(k)) out.protected.push(`call ${JSON.stringify(c.opts)} uses an option outside {id, mistake, selected}`);
  out.protected.push(...mine.flatMap(c => gb.protectedFieldProblems(specId, c, ref)));
  if (!mine.some(c => same(c.spec, ref))) out.protected.push(`no untouched base-plate call found for ${specId}`);
  out.fragments.push(...(entry ? gb.fragmentProblems(html, [entry]) : [`no pinned plate entry for ${specId}`]));
  // (2) attribution: base, cam, the plate's -n/-m, or one side of a posture zoom the source declares
  const posture = (howto.zooms ?? []).filter(z => z.kind === 'posture'), seen = new Map(posture.flatMap(z => [[`${z.key}|right`, 0], [`${z.key}|wrong`, 0]]));
  const suffix = family === 'zbox' ? { right: 'r', wrong: 'w' } : family === 'zoom' ? { right: 'right', wrong: 'wrong' } : null;
  if (!suffix) out.poses.push(`unknown close-up shell ${family}`);
  const sideOf = id => {
    if (id === 'base' || id === 'cam' || id === `${prefix}-n` || id === `${prefix}-m`) return { role: null };
    for (const z of posture) for (const role of ['right', 'wrong']) if (suffix && id === `${z.key}-${suffix[role]}`) return { z, role };
    return null;
  };
  // (3) every call not on a Wrong side: a reference pose; (4) a Wrong side may also draw its source-declared fault pose
  const refs = [ref.poses?.start, ref.poses?.end, ...(ref.mistake?.pose ? [mergeDeep(ref.poses?.end, ref.mistake.pose)] : [])].filter(p => p !== undefined);
  const mrefs = ref.mistake?.pose ? [ref.mistake.pose, mergeDeep(ref.poses?.end, ref.mistake.pose)] : [];
  for (const c of mine) {
    const id = c.opts?.id ?? '', at = sideOf(id);
    if (!at) { out.poses.push(`${specId}|${id}: a call that cannot be attributed to base, cam, the plate or a declared zoom side`); continue; }
    if (at.z) seen.set(`${at.z.key}|${at.role}`, seen.get(`${at.z.key}|${at.role}`) + 1);
    const fault = at.role === 'wrong' ? faultPoses(at.z, { ref, family, stills, stillPose }) : [];
    for (const which of ['start', 'end']) {
      if (!c.spec.poses || !(which in c.spec.poses)) continue;
      if (![...refs, ...fault].some(r => same(c.spec.poses[which], r))) out.poses.push(`${specId}|${id}: poses.${which} matches neither a reference pose${at.role === 'wrong' ? ' nor its declared fault pose' : ''} (${JSON.stringify(c.spec.poses[which]).slice(0, 200)})`);
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
    const s = layersSpecOf(row.batchFile, { stageDir: mkdtempSync(join(tmpdir(), 'lib4b-ht4-stage-')), root });
    return s.optionsUrl ? { ...s, optionsUrl: s.optionsUrl.replace(pathToFileURL(join(root, 'tools/plates')).href, pathToFileURL(join(T, 'tools/plates')).href) } : s;
  }));
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

/** HT4-A6 for one id in one theme: the golden-B state driver self-check on the id's layers page. */
export async function run(ctx, { lib, chrome, theme }) {
  const gb = await GB(), st = stateOf('HT4', 'A6', WIDTH);
  const { browser: b, page, errs } = await gb.openPage(ctx.layersFile(lib), theme, { chromePath: process.env.MARC_CHROMIUM });
  try {
    const bad = await gb.selfCheck(page, chrome);
    ctx.R.check(lib, theme, st, [...bad, ...errs.map(e => `page error: ${e}`)]);
  } finally { await b.close(); }
}
