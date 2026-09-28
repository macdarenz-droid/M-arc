// FG-3: `npm run fg:check <id | path/to/file.ts> [check ...]` runs the §5 checks (docs/FORM-GUIDE-PRODUCTION.md) on one
// exercise file and prints pass or fail per check with the failing numbers; exits 1 when any check fails.
// package.json first bundles src/formguide/check (with node.ts) to node_modules/.cache/fg-check.mjs, as `logo` does;
// this script bundles the exercise file itself the same way, then imports both.
import { build } from 'esbuild';
import { existsSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [arg, ...only] = process.argv.slice(2);
if (!arg) { console.error('usage: npm run fg:check <exercise id | path to an exercise file> [check ...]'); process.exit(2); }
const path = resolve(/[\\/]|\.ts$/.test(arg) ? arg : `src/formguide/exercises/${arg}.ts`);
if (!existsSync(path)) { console.error(`fg:check: no exercise file ${path}`); process.exit(2); }

const lib = await import(pathToFileURL(resolve('node_modules/.cache/fg-check.mjs')).href);
const out = resolve('node_modules/.cache/fg-check-guide.mjs');
await build({ entryPoints: [path], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'warning' });
const mod = await import(`${pathToFileURL(out).href}?t=${Date.now()}`);

const bad = only.filter(c => !lib.CHECKS.includes(c));
if (bad.length) { console.error(`fg:check: unknown check ${bad.join(', ')}; checks: ${lib.CHECKS.join(', ')}`); process.exit(2); }
const guide = lib.guideOf(mod, path);
const results = lib.runChecks(lib.inputFor(path, guide), only.length ? only : lib.CHECKS);
console.log(lib.report(basename(path).replace(/\.ts$/, ''), results));
process.exit(results.every(r => r.ok) ? 0 : 1);
