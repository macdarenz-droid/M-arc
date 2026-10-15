#!/usr/bin/env node
// Load each compiled lite-wearable JS file (app.js and pages/**/*.js) the way the watch's JS engine does:
// a bare context with only the lite framework's globals, no Node `require`, `module` or `exports`.
// Each file must evaluate to an object. A webpack build that treated the sources as ES modules
// (for example under a package.json with "type": "module") leaves `require`/`exports` behind and
// fails here; on the watch that shows as a black, dead screen.
// Usage: check-lite-js.cjs <loader_out_lite/js/<name> folder>
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

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

let failed = 0;
for (const rel of files) {
  const quiet = () => {};
  const ctx = {
    ViewModel: function ViewModel(options) { this.options = options; },
    requireNative: () => ({}),
    console: { log: quiet, info: quiet, warn: quiet, error: quiet, debug: quiet },
  };
  try {
    const result = vm.runInNewContext(fs.readFileSync(path.join(root, rel), 'utf8'), ctx, { filename: rel });
    if (result === null || typeof result !== 'object') throw new Error(`evaluates to ${result === null ? 'null' : typeof result}, not an object`);
    console.log(`OK    ${rel}`);
  } catch (e) {
    failed++;
    console.log(`FAIL  ${rel}: ${e.constructor.name}: ${e.message}`);
  }
}
console.log(failed ? `RESULT: ${failed} of ${files.length} files would not load on the watch` : `RESULT: OK (${files.length} files)`);
process.exit(failed ? 1 : 0);
