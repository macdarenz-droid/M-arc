// a child.it test whose assertion fails in the child; the parent fails.
import { describe, expect } from 'vitest';
import { child } from '../../child-test';

describe('fixture', () => {
  child.it('passes', () => { expect(1).toBe(2); });
});
