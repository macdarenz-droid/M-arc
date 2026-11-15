// tests/worker-lag.test.ts: the guard's fixtures run as their own vitest project, never in the suite (include is
// *.fx.ts), with a 2 s limit so a 3 s block proves each path quickly.
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: fileURLToPath(new URL('../../..', import.meta.url)),
  test: { include: ['tests/fixtures/worker-lag/*.fx.ts'], environment: 'node', setupFiles: ['tests/fixtures/worker-lag/setup.ts'] },
});
