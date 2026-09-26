import { describe, it, expect } from 'vitest';
import { rubber, RUBBER_MAX_PX } from '@/ui/gesture';

describe('rubber() (A3)', () => {
  it('is 0 at 0 distance', () => {
    expect(rubber(0)).toBe(0);
  });
  it('grows monotonically but never reaches RUBBER_MAX_PX', () => {
    let prev = -1;
    for (const d of [10, 40, 80, 160, 400, 4000]) {
      const r = rubber(d);
      expect(r).toBeGreaterThan(prev);
      expect(r).toBeLessThan(RUBBER_MAX_PX);
      prev = r;
    }
  });
  it('approaches RUBBER_MAX_PX asymptotically for a large pull', () => {
    expect(rubber(100000)).toBeGreaterThan(RUBBER_MAX_PX * 0.99);
  });
});
