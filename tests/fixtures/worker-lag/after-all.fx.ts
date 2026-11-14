// m4: a 3 s block in the file's last afterAll.
import { afterAll, expect, it } from 'vitest';
import { block } from './block';

it('passes', () => { expect(1).toBe(1); });
afterAll(() => { block(3); });
