// m2: a 3 s block in a beforeAll.
import { beforeAll, expect, it } from 'vitest';
import { block } from './block';

beforeAll(() => { block(3); });
it('passes', () => { expect(1).toBe(1); });
