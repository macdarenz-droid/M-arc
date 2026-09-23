import { describe, it, expect, vi } from 'vitest';
import type { VNode } from 'preact';
import { ErrorBoundary, resetAppData } from '@/app/ErrorBoundary';

const texts = (n: unknown): string[] => {
  if (n == null || typeof n === 'boolean') return [];
  if (typeof n === 'string' || typeof n === 'number') return [String(n)];
  if (Array.isArray(n)) return n.flatMap(texts);
  const v = n as VNode<{ children?: unknown }>;
  const own = v.type === 'button' ? [`button:${texts(v.props.children).join('')}`] : [];
  return [...own, ...texts(v.props?.children)];
};

describe('the error card (QA-R1-8)', () => {
  it('offers a reset, so a crash on every render has a way out', () => {
    const b = new ErrorBoundary({});
    b.state = { error: new Error('x') };
    const out = texts(b.render());
    expect(out).toContain('button:Reload');
    expect(out).toContain('button:Reset app data');
  });
  it('the reset clears storage and the photo database', async () => {
    const clear = vi.fn();
    const deleteDatabase = vi.fn();
    resetAppData({ clear }, { databases: async () => [{ name: 'marc-escobar-img', version: 1 }], deleteDatabase });
    await Promise.resolve(); await Promise.resolve();
    expect(clear).toHaveBeenCalled();
    expect(deleteDatabase).toHaveBeenCalledWith('marc-escobar-img');
  });
});
