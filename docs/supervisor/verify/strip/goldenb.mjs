// Golden B layers page with and without the NOSECS tempo patch: the bytes must be identical (timed strips only).
import { readFileSync, writeFileSync, rmSync } from 'node:fs'; import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto'; import { join } from 'node:path'; import { pathToFileURL } from 'node:url';
const [W] = process.argv.slice(2);
const L = await import(pathToFileURL(join(W, 'tools/plates/library/build-layers-page.mjs')).href);
const { makeMirror, cleanupMirror } = await import(pathToFileURL(join(W, 'tools/plates/layers.mjs')).href);
import { NOSECS_STRIP as NOSECS } from './nosecs-strip.mjs';
const between = (s, a, b) => { const i = s.indexOf(a); return s.slice(i, s.indexOf(b, i) + b.length); };
async function build(extra) {
  const spec = L.GOLDEN_B_SPEC, mirror = makeMirror();
  try {
    const hl = join(mirror, 'artifact', 'howto-layers.mjs'), bp = join(mirror, 'artifact', 'build-page.mjs');
    writeFileSync(hl, L.patchHowtoLayers(readFileSync(hl, 'utf8'), L.planOf(spec)));
    let s = L.patchBuildPage(readFileSync(bp, 'utf8'), spec);
    if (extra) s = L.patchOnce(s, 'tempo strip', between(s, 'const tempoStrip = tempo => {', '\n};\n'), NOSECS);
    writeFileSync(bp, s);
    const r = spawnSync(process.execPath, ['artifact/build-page.mjs'], { cwd: mirror, encoding: 'utf8' });
    if (r.status) throw new Error(r.stderr.slice(0, 2000));
    return createHash('sha256').update(readFileSync(join(mirror, 'artifact', 'technical-plates.html'))).digest('hex');
  } finally { cleanupMirror(mirror); }
}
const a = await build(false), b = await build(true);
console.log('golden B layers page, unpatched:', a); console.log('golden B layers page, patched:  ', b, a === b ? 'IDENTICAL' : 'DIFFERS');
