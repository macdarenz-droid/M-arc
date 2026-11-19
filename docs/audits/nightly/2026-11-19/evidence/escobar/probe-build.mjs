import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

/** Portable scratch-only build. Dependencies and app source come from an explicit checkout. */
export async function buildProbe(entry, {exposeLiftTrend = false} = {}) {
  const checkoutArg = process.argv[2];
  if (!checkoutArg) throw new Error('Usage: node <build-helper.mjs> <checkout-directory> [output-directory]');
  const checkout = path.resolve(checkoutArg);
  const requireFromCheckout = createRequire(path.join(checkout, 'package.json'));
  const {build} = requireFromCheckout('esbuild');
  const pkg = requireFromCheckout('./package.json');
  const outputDir = process.argv[3] ? path.resolve(process.argv[3]) : await fs.mkdtemp(path.join(os.tmpdir(), 'marc-audit-escobar-'));
  await fs.mkdir(outputDir, {recursive: true});
  const outfile = path.join(outputDir, entry.replace(/\.ts$/, '.mjs'));
  await build({
    entryPoints: [fileURLToPath(new URL(entry, import.meta.url))],
    absWorkingDir: checkout,
    tsconfig: path.join(checkout, 'tsconfig.json'),
    bundle: true, platform: 'node', format: 'esm', outfile,
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {'@': path.join(checkout, 'src'), '@tests': path.join(checkout, 'tests')},
    define: {__APP_VERSION__: JSON.stringify(pkg.version), 'import.meta.env.MODE': '"test"'},
    logLevel: 'error',
    plugins: exposeLiftTrend ? [{name: 'expose-pure-leaf-for-audit', setup(b) {
      b.onLoad({filter: /[\\/]escobar[\\/]ui[\\/]components[\\/]index\.tsx$/}, async args => ({
        contents: (await fs.readFile(args.path, 'utf8')) + '\nexport { LiftTrend };\n', loader: 'tsx',
      }));
    }}] : [],
  });
  console.log(outfile);
}
