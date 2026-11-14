// F-VITEST-RPC-2 A7(b) seed (never merged): a 35 s synchronous block in a plain test; the guard must name it.
import { execFileSync } from 'node:child_process';
import { expect, it } from 'vitest';

it('A7b seed: a 35 s block in a plain test', () => { execFileSync('sleep', ['35']); expect(1).toBe(1); }, 120_000);
