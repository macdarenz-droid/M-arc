#!/usr/bin/env node
// Load each compiled lite-wearable JS file (app.js and pages/**/*.js) the way the watch's JS engine does:
// a bare context with only the lite framework's globals, no Node `require`, `module` or `exports`.
// Each file must evaluate to an object. A webpack build that treated the sources as ES modules
// (for example under a package.json with "type": "module") leaves `require`/`exports` behind and
// fails here; on the watch that shows as a black, dead screen.
// Each file must also be pure ASCII: the old toolchain and the watch engine are unreliable with other
// bytes (community GT 6 notes), and the hello build that ran on the GT 6 was pure ASCII.
// Each file must be at most 48,000 B: Huawei's fix for install error 34 is "Reduced the size of single JS pages to
// 48 KB or less" (Lite Wearable BPTA guide); the smaller reading of KB is used.
// Every page listed in the compiled manifest.json must have its compiled .js.
// Usage: check-lite-js.cjs <loader_out_lite/js/<name> folder>
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const MAX_BYTES = 48000;

const root = process.argv[2];
if (!root || !fs.existsSync(path.join(root, 'app.js'))) {
  console.error('usage: check-lite-js.cjs <folder holding the compiled app.js>');
  process.exit(2);
}
const files = ['app.js'];
const walk = (dir) => {
  for (const name of fs.readdirSync(path.join(root, dir))) {
    const rel = path.join(dir, name);
    if (fs.statSync(path.join(root, rel)).isDirectory()) walk(rel);
    else if (name.endsWith('.js')) files.push(rel);
  }
};
if (fs.existsSync(path.join(root, 'pages'))) walk('pages');

// 1-based numbers of the lines holding a byte above 0x7f.
const nonAsciiLines = (buf) => {
  const lines = [];
  let line = 1;
  for (const b of buf) {
    if (b === 0x0a) line++;
    else if (b > 0x7f && lines[lines.length - 1] !== line) lines.push(line);
  }
  return lines;
};

const manifest = path.join(root, 'manifest.json');
const pages = fs.existsSync(manifest) ? JSON.parse(fs.readFileSync(manifest, 'utf8')).pages || [] : [];
const missing = pages.map((page) => path.join(...`${page}.js`.split('/'))).filter((rel) => !files.includes(rel));
for (const rel of missing) console.log(`FAIL  ${rel}: listed in manifest.json but not compiled`);
let failed = missing.length;
for (const rel of files) {
  const quiet = () => {};
  const ctx = {
    ViewModel: function ViewModel(options) { this.options = options; },
    requireNative: () => ({}),
    console: { log: quiet, info: quiet, warn: quiet, error: quiet, debug: quiet },
  };
  try {
    const buf = fs.readFileSync(path.join(root, rel));
    const bad = nonAsciiLines(buf);
    if (bad.length) throw new Error(`non-ASCII bytes on line${bad.length > 1 ? 's' : ''} ${bad.join(', ')}`);
    if (buf.length > MAX_BYTES) throw new Error(`${buf.length} B, over the ${MAX_BYTES} B page limit`);
    const result = vm.runInNewContext(buf.toString('utf8'), ctx, { filename: rel });
    if (result === null || typeof result !== 'object') throw new Error(`evaluates to ${result === null ? 'null' : typeof result}, not an object`);
    console.log(`OK    ${rel} (${buf.length} B)`);
  } catch (e) {
    failed++;
    console.log(`FAIL  ${rel}: ${e.constructor.name}: ${e.message}`);
  }
}
const total = files.length + missing.length;
console.log(failed ? `RESULT: ${failed} of ${total} files would not load on the watch` : `RESULT: OK (${files.length} files)`);
process.exit(failed ? 1 : 0);
