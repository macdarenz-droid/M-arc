// ENGINE SPIKE (do not merge): scratch re-vendor of the spike-edited engine files, the plan 2.8 step 4 shape
// (new sha256 + git blob + a source label) with the label SPIKE so it can never pass for a real pin.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { VENDOR } from '../../golden.mjs';
const m = JSON.parse(readFileSync(join(VENDOR, 'MANIFEST.json'), 'utf8'));
for (const p of ['engine/body.mjs', 'engine/plate.mjs']) {
  const b = readFileSync(join(VENDOR, p)), e = m.files[p];
  e.sha256 = createHash('sha256').update(b).digest('hex');
  e.gitBlob = createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
  if ('md5' in e) e.md5 = createHash('md5').update(b).digest('hex');
  e.source = `SPIKE:docs/howto/technical-plate/${p}`;
}
writeFileSync(join(VENDOR, 'MANIFEST.json'), JSON.stringify(m, null, 2) + '\n');
