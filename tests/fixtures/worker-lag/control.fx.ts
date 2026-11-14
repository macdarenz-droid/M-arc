// m7 (control): a 1.5 s block, under the fixtures' 2 s limit, passes.
import { expect, it } from 'vitest';
import { block } from './block';

it('blocks under the limit', () => { block(1.5); expect(1).toBe(1); });
