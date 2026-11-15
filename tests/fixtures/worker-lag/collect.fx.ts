// m3: a 3 s block at module top level.
import { expect, it } from 'vitest';
import { block } from './block';

block(3);
it('passes', () => { expect(1).toBe(1); });
