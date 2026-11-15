// m1: a 3 s block in a test body.
import { expect, it } from 'vitest';
import { block } from './block';

it('blocks in its body', () => { block(3); expect(1).toBe(1); });
