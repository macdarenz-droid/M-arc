// tests/child-test.test.ts: the fixtures run as their own vitest project, never in the suite (include is *.fx.ts).
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: fileURLToPath(new URL('../../..', import.meta.url)),
  test: { include: ['tests/fixtures/child-test/*.fx.ts'], environment: 'node' },
});
