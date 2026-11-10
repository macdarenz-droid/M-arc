// F-GEN-WALK-SPEED: vitest globalSetup for tests/walk-cache.ts. Each run gets a new cache folder under the OS temp
// folder (mkdtemp), and the run removes it when it ends, so no cached result outlives the run that made it. A child
// vitest started by tests/child-test.ts (MARC_TEST_CHILD=1) is part of its parent's run: it uses the parent's folder
// and leaves its removal to the parent.
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CACHE_ENV, CACHE_PREFIX, isRunDir } from './walk-cache';

export default function setup(): () => void {
  const inherited = process.env[CACHE_ENV];
  if (process.env.MARC_TEST_CHILD === '1' && inherited && isRunDir(inherited)) return () => {};
  const dir = mkdtempSync(join(tmpdir(), CACHE_PREFIX));
  process.env[CACHE_ENV] = dir;
  return () => {
    rmSync(dir, { recursive: true, force: true });
    if (process.env[CACHE_ENV] === dir) delete process.env[CACHE_ENV];
  };
}
