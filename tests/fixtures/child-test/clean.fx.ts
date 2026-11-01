// control: a clean child.it test; the parent passes.
import { describe, expect } from 'vitest';
import { child } from '../../child-test';

describe('fixture', () => {
  child.it('passes', () => { expect(1).toBe(1); });
});
