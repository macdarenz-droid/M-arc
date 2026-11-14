// F-VITEST-RPC-2 A7(c) seed (never merged): the same 35 s block inside a child.it test; the child's guard fails it,
// so the parent test is red.
import { execFileSync } from 'node:child_process';
import { describe, expect } from 'vitest';
import { child } from './child-test';

describe('A7c seed', () => {
  child.it('a 35 s block in a child.it test', () => { execFileSync('sleep', ['35']); expect(1).toBe(1); }, 120_000);
});
