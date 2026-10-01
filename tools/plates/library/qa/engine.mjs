// LIB-3 engine access. The QA never edits the locked engine: it imports the vendored files from an HT-1 mirror
// (golden.mjs makeMirror: the vendor tree plus the font) and re-derives only what renderPlate does not report:
// the end and mistake landmarks (H3 deviation) and the per-pose equipment items (H9). A parity test pins both
// re-derivations to the engine's own output (keyJoints and the drawn equipment paths).
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { buildGallery, extractPlates, makeMirror, LIB_OF } from '../../golden.mjs';

export { LIB_OF };
export const REF_CHROME = 'lateral-raise';   // drawn by ref-src/plate.mjs, not by the engine

let n = 0;
/** Imports the mirror's engine. A fresh query string per call keeps two mirrors' modules apart. */
export async function loadEngine(mirror) {
  const u = p => `${pathToFileURL(join(mirror, p)).href}?qa=${++n}`;
  const plate = await import(u('engine/plate.mjs'));
  const body = await import(u('engine/body.mjs'));
  const eq = await import(u('engine/equipment.mjs'));
  return { mirror, renderPlate: plate.renderPlate, SIZE: plate.SIZE, PRIMITIVES: eq.PRIMITIVES, body,
    spec: async id => (await import(`${pathToFileURL(join(mirror, 'exercises', `${id}.mjs`)).href}?qa=${++n}`)).default };
}

/** The spec file id of an approved plate (chrome id with underscores), or null for the reference plate. */
export const specIdOf = chromeId => (chromeId === REF_CHROME ? null : chromeId.replace(/-/g, '_'));

const mergeDeep = (a, b) => {   // plate.mjs:22-28, verbatim logic
  if (b === undefined) return a;
  if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
    const o = { ...a }; for (const k of Object.keys(b)) o[k] = mergeDeep(a[k], b[k]); return o;
  }
  return b;
};

/** The camera of a render, from its report (plate.mjs makeCamera). */
export function cameraOf(spec, report) {
  const side = report.view === 'side', facing = spec.facing ?? 'right', c = report.camera;
  const sx = side ? (w => (facing === 'left' ? -w[2] : w[2])) : (w => w[0]);
  return { view: report.view, facing, near: side ? (facing === 'left' ? 'l' : 'r') : null, pxm: c.pxPerM, pxPerM: c.pxPerM, x0: c.x0, y0: c.y0,
    P: w => [c.x0 + sx(w) * c.pxPerM, c.y0 - w[1] * c.pxPerM] };
}

/** Landmarks (world) of the start, end and mistake poses, as plate.mjs resolves them. */
export function poseLandmarks(E, spec) {
  const { normPose, poseAt, resolve, fk, landmarks } = E.body, body = { height: spec.body?.height ?? 1.75 };
  const keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map(p => normPose(p, body));
  const at = t => poseAt(keys, t, body);
  const s = at(0), e = at(1);
  const m = spec.mistake?.pose ? resolve(normPose(mergeDeep(spec.poses.end, spec.mistake.pose), body), body) : null;
  return { body, q: { start: s.q, end: e.q, ...(m ? { mistake: m.q } : {}) },
    lm: { start: landmarks(fk(s.q, body)), end: landmarks(fk(e.q, body)), ...(m ? { mistake: landmarks(fk(m.q, body)) } : {}) } };
}

/** Plate px of a point reference (plate.mjs makePointResolver), for one pose. */
export function resolvePoint(ref, pose, lm, cam) {
  if (Array.isArray(ref)) return ref.length === 3 ? cam.P(ref) : ref;
  if (typeof ref === 'string') { const [a, b] = ref.includes(':') ? ref.split(':') : [pose, ref]; const w = lm[a]?.[b]; if (!w) throw new Error(`unknown landmark ${ref}`); return cam.P(w); }
  if (ref.along) { const a = resolvePoint(ref.along[0], ref.pose ?? pose, lm, cam), b = resolvePoint(ref.along[1], ref.pose ?? pose, lm, cam), t = ref.t ?? 1, o = ref.off ?? [0, 0];
    return [a[0] + (b[0] - a[0]) * t + o[0], a[1] + (b[1] - a[1]) * t + o[1]]; }
  const p = resolvePoint(ref.at, ref.pose ?? pose, lm, cam), o = ref.off ?? [0, 0];
  return [p[0] + o[0], p[1] + o[1]];
}

/** Equipment items per pose, as plate.mjs drawPose builds them (mistake-plate context): Map(key -> item). */
export function equipmentItems(E, spec, report, poses = ['end', 'mistake']) {
  const L = poseLandmarks(E, spec), cam = cameraOf(spec, report), out = {};
  for (const pose of poses) {
    if (!L.lm[pose]) continue;
    const items = new Map(), ctx = { pose, start: L.lm.start, body: L.body, mistake: true, q: L.q[pose] };
    (spec.equipment ?? []).forEach((e, i) => {
      const ent = typeof e === 'function' ? e(L.lm[pose], ctx) : e;
      if (!ent) return;
      for (const one of [].concat(ent)) {
        const prim = E.PRIMITIVES[one.type];
        if (!prim) { items.set(`eq${i}.${one.type}`, { type: one.type, unknown: true }); continue; }
        prim(one, cam).forEach((it, j) => items.set(`eq${i}.${one.type}.${j}`, { ...it, type: one.type, z: one.z ?? it.z }));
      }
    });
    out[pose] = items;
  }
  return out;
}

/**
 * Builds the gallery with the vendored build-page in a mirror, after `mutate` (optional) has changed spec files:
 * mutate(mirror) writes into the mirror only. Returns { html, plates (extracted), mirror } and keeps the mirror.
 */
export async function buildMirrorGallery(mutate = null) {
  const mirror = makeMirror();
  if (mutate) await mutate(mirror);
  const html = (await buildGallery(mirror)).toString('utf8');
  return { html, plates: extractPlates(html), mirror };
}
export const dropMirror = m => rmSync(m, { recursive: true, force: true });

/**
 * Replaces exercises/<specId>.mjs in a mirror by a wrapper that applies `fnSource` (the text of a function
 * spec => spec) to the original spec. The original moves to <specId>.orig.mjs.
 */
export function wrapSpec(mirror, specId, fnSource) {
  const dir = join(mirror, 'exercises'), orig = join(dir, `${specId}.orig.mjs`);
  if (!existsSync(orig)) cpSync(join(dir, `${specId}.mjs`), orig);
  writeFileSync(join(dir, `${specId}.mjs`), `import s from './${specId}.orig.mjs';\nconst f = (${fnSource});\nexport default f(s);\n`);
}

/** A copy of a mirror (so one clean mirror can seed many mutated ones). */
export function copyMirror(src, dst) { mkdirSync(dst, { recursive: true }); cpSync(src, dst, { recursive: true }); return dst; }
export const readMirror = (mirror, p) => readFileSync(join(mirror, p), 'utf8');
