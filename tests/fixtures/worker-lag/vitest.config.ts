// tests/worker-lag.test.ts: the guard's fixtures run as their own vitest project, never in the suite (include is
// *.fx.ts), with a 2 s limit so a 3 s block proves each path quickly.
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// the fixtures get a 60 s test timeout, so only the guard (2 s), never vitest's 5 s default, fails them; the m6
// child.it parent waits on a child vitest (F-WLAG-M6-TIMEOUT, #426 job 132797121956).
export default defineConfig({
  root: fileURLToPath(new URL('../../..', import.meta.url)),
  test: { include: ['tests/fixtures/worker-lag/*.fx.ts'], environment: 'node', setupFiles: ['tests/fixtures/worker-lag/setup.ts'], testTimeout: 60_000, },
});
