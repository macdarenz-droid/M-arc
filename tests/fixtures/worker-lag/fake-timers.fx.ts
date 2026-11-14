// m5: a 3 s block after vi.useFakeTimers().
import { afterEach, expect, it, vi } from 'vitest';
import { block } from './block';

afterEach(() => { vi.useRealTimers(); });
it('blocks under fake timers', () => { vi.useFakeTimers(); block(3); expect(1).toBe(1); });
