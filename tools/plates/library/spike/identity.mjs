// ENGINE SPIKE (do not merge): rebuilds golden A from the (spike-edited) vendored engine, golden B's layers page and
// the pilot A plates page, and prints each sha256 against its pin. L0 is skipped on purpose: the spike edits vendored
// bytes, so the proof here is L1 (the built pages), which is what a [golden update] PR must keep byte-identical.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { makeMirror, buildGallery, sha256, PINS, ROOT } from '../../golden.mjs';
import * as L from '../../layers.mjs';

const want = { goldenA: PINS.pageSha256, goldenB: 'e7b81413', pilotA: 'f4dc5ec3dd6ba2bbeda27da1648074a6834dda907b2c022e7fdd3456f19c1e09' };
const a = await buildGallery(makeMirror());
const mB = L.makeMirror(); const b = await L.buildLayerPage(mB); L.cleanupMirror(mB);
let p;
try { execFileSync(process.execPath, ['tools/plates/library/pilot-a/build.mjs'], { cwd: ROOT, stdio: ['ignore', 'ignore', 'pipe'], env: process.env });
  p = readFileSync(join(ROOT, 'tools/plates/library/pilot-a/out/pilot-a-plates.html'));
} catch (e) { const m = String(e.stderr ?? e).split('\n').find(l => /Error/.test(l)) ?? 'failed'; p = Buffer.from(`BUILD FAILED: ${m}`); console.log(`pilotA build failed: ${m.slice(0, 300)}`); }
const row = (k, buf) => { const s = sha256(buf); const ok = s.startsWith(want[k]); console.log(`${k}: ${s} ${buf.length} B ${ok ? 'IDENTICAL' : 'DIFFERS'}`); return ok; };
const ok = [row('goldenA', a), row('goldenB', b), row('pilotA', p)].every(Boolean) && a.length === PINS.pageBytes;
process.exit(ok ? 0 : 1);
