// m6: a 3 s block inside a child.it test: the child's guard fails it, so its parent test fails.
import { describe, expect } from 'vitest';
import { child } from '../../child-test';
import { block } from './block';

describe('fixture', () => {
  child.it('blocks in a child', () => { block(3); expect(1).toBe(1); });
});
