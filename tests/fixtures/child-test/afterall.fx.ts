// the test passes in the child, but its describe's afterAll throws there (and only there); the parent fails.
import { afterAll, describe, expect } from 'vitest';
import { child, IN_CHILD } from '../../child-test';

describe('fixture', () => {
  afterAll(() => { if (IN_CHILD) throw new Error('afterAll threw in the child'); });
  child.it('passes', () => { expect(1).toBe(1); });
});
