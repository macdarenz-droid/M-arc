// Usage: node path/to/brain/run.cjs /path/to/pinned/checkout
// Requires that checkout's existing esbuild dependency. No install, network or app writes.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(process.argv[2] || process.cwd());
const esbuild = require(path.join(root, 'node_modules/esbuild'));
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'marc-brain-audit-'));
const expected = '57dcbfc7efa60218ba902d16d6e3329d2fc053f5';
const head = cp.execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding:'utf8'}).trim();
if (head !== expected) throw new Error(`Expected ${expected}, got ${head}; evidence is commit-specific.`);
for (const name of ['confirmed','insights']) {
  const outfile = path.join(scratch, name+'.cjs');
  esbuild.buildSync({entryPoints:[path.join(__dirname,name+'.ts')],bundle:true,platform:'node',format:'cjs',alias:{'@':path.join(root,'src'),'@audit-helpers':path.join(root,'tests/helpers.ts')},outfile});
  for (const [label,TZ] of [['manila','Asia/Manila'],['melbourne','Australia/Melbourne'],['utc','UTC']]) {
    const result = cp.spawnSync(process.execPath,[outfile],{env:{...process.env,TZ},encoding:'utf8'});
    if (result.status !== 0) throw new Error(`${name}/${TZ}: ${result.stderr || result.stdout}`);
    const parsed = JSON.parse(result.stdout);
    fs.writeFileSync(path.join(__dirname,`${name}-${label}.json`),JSON.stringify(parsed,null,2)+'\n');
    console.log(`${name} ${TZ}: ${parsed.status}`);
  }
}
console.log(`Bundles retained outside the app in ${scratch}`);
