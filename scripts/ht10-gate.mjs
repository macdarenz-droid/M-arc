// HT-10's own gate job (D-HT10-A5b): serves the built app as scripts/screenshot-gate.mjs does and runs only gate block
// HT-10 (tools/plates/fidelity/ht10.mjs), over MARC_HT_SHARD's shard ("k/N", 1-based) or, unset, every tuple.
// Builds must already exist in www/. Exits non-zero on any problem, as the gate does.
// Run: node scripts/ht10-gate.mjs   (MARC_CHROMIUM to use a local chrome; MARC_HT_SHARD=1/2 for one shard)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, 'screenshots');
mkdirSync(OUT, { recursive: true });
const PORT = process.env.MARC_GATE_PORT || '4173';
// the gate's server bootstrap, unchanged
const server = spawn(process.execPath, [join(ROOT, 'node_modules/vite/bin/vite.js'), 'preview', '--port', PORT, '--strictPort'], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
process.on('exit', () => { try { server.kill('SIGKILL'); } catch { /* already gone */ } });
server.stdout.on('data', d => process.stdout.write(`[preview] ${d}`));
server.stderr.on('data', d => process.stderr.write(`[preview] ${d}`));
let stopping = false;
server.on('exit', code => { if (code && !stopping) { console.error(`preview server exited with ${code}`); process.exit(1); } });
for (let i = 0; ; i++) {
  try { const r = await fetch(`http://localhost:${PORT}/`); if (r.ok) break; } catch { /* not yet */ }
  if (i > 120) { console.error('preview server did not start'); process.exit(1); }
  await new Promise(r => setTimeout(r, 250));
}
console.log('preview ready on', PORT);

const errors = [];
const clock = { t0: Date.now(), lines: [] };
try {
  await (await import('../tools/plates/fidelity/ht10.mjs')).runHt10({ errors, OUT, PORT, clock });
} catch (e) {
  errors.push(`HT-10: crashed: ${e.stack ?? e.message}`);
}
stopping = true;
server.kill();
if (errors.length) { console.error('Page errors:', errors); process.exit(1); }
console.log(`HT-10 gate PASS${process.env.MARC_HT_SHARD ? ` (shard ${process.env.MARC_HT_SHARD})` : ''}`);
