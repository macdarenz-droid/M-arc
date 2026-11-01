// the test passes in the child, but leaves an unhandled rejection there (and only there); the parent fails.
import { describe, expect } from 'vitest';
import { child, IN_CHILD } from '../../child-test';

describe('fixture', () => {
  child.it('passes', async () => {
    if (IN_CHILD) void Promise.reject(new Error('unhandled rejection in the child'));
    await new Promise<void>(r => setTimeout(r, 50));
    expect(1).toBe(1);
  });
});
