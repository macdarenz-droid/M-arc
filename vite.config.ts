import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

/** F-GEN-SPEED (D-GSP-G): the files a run alone with MARC_SOLO=1; the normal run leaves them out. */
export const SOLO_TESTS = ['tests/library/lib7b.test.ts'];
/** The vitest include/exclude of the normal, solo (MARC_SOLO=1) and perf (MARC_PERF=1) runs; tests/ci-lib7b-solo.test.ts
 *  pins that the three partition tests/**\/*.test.ts. */
export function testSets(env: Record<string, string | undefined>): { include: string[]; exclude: string[] } {
  if (env.MARC_PERF) return { include: ['tests/perf/**/*.test.ts'], exclude: ['node_modules/**'] };
  if (env.MARC_SOLO) return { include: [...SOLO_TESTS], exclude: ['node_modules/**'] };
  return { include: ['tests/**/*.test.ts'], exclude: ['node_modules/**', 'tests/perf/**', ...SOLO_TESTS] };
}

// The Capacitor Android project and the PWA both consume `www/`.
export default defineConfig({
  plugins: [preact()],
  base: './',
  // R7.2: one version source for the app, backups and Escobar.
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    outDir: 'www',
    emptyOutDir: true,
    target: 'es2020',
    sourcemap: false,
    assetsInlineLimit: 4096,
  },
  test: {
    // Timing budgets run alone (MARC_PERF=1) so parallel test files don't skew them.
    // F-GEN-SPEED (D-GSP-G): lib7b.test.ts runs alone (MARC_SOLO=1), so 7b-A2's full render has the job's CPUs.
    ...testSets(process.env),
    environment: 'node',
    // F-GEN-WALK-SPEED: one cache folder per run for tests/walk-cache.ts, removed when the run ends
    globalSetup: ['tests/walk-cache-setup.ts'],
    // F-VITEST-RPC-2: the worker-lag guard (tests/worker-lag.ts) in every worker, child.it children included
    setupFiles: ['tests/worker-lag-setup.ts'],
  },
});
