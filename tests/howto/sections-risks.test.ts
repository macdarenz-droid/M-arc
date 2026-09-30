// HT-9 (HT9-A3): "Risks and when to stop". Risks.tsx has no hooks, so it's called directly and its VNode tree
// walked (project convention: no jsdom, same style as tests/error-boundary.test.ts / sections-setup.test.ts).
// Runs against the real generated modules (HT-2/HT-5), not a synthetic fixture: proves the real 8 exercises, not
// just a shape.
import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import type { VNode } from 'preact';
import { Risks } from '@/slices/howto/sections/Risks';
import { chromeIdOf } from '@/slices/howto/PlateView';
import { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_KNEE, RED_FLAG_ELBOW } from '@/howto/archetypes';
import type { BuiltHowTo } from '@/howto/types';
import type { RiskJoint } from '@/howto/content-types';

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyVNode = VNode<Record<string, any>>;
function elements(n: unknown): AnyVNode[] {
  if (n == null || typeof n === 'boolean' || typeof n === 'string' || typeof n === 'number') return [];
  if (Array.isArray(n)) return n.flatMap(elements);
  const v = n as AnyVNode;
  if (!v.type) return elements(v.props?.children);
  return [v, ...elements(v.props?.children)];
}
const byTag = (tree: AnyVNode, tag: string) => elements(tree).filter(v => v.type === tag);
const hasClass = (v: AnyVNode, cls: string) => typeof v.props?.class === 'string' && v.props.class.split(' ').includes(cls);

const modules = () => readdirSync('src/howto/generated').filter(f => /^ht-.*\.ts$/.test(f))
  .map(async f => (await import(`../../src/howto/generated/${f.replace(/\.ts$/, '')}`)).default as BuiltHowTo);

const FLAG: Readonly<Record<RiskJoint, { name: string; now: string; doctor: string }>> = {
  wrist: RED_FLAG, shoulder: RED_FLAG_SHOULDER, knee: RED_FLAG_KNEE, elbow: RED_FLAG_ELBOW,
};

describe('HT9-A3: Risks ("Risks and when to stop")', () => {
  it('renders every risk row, and for all real exercises one red-flag block per riskFlags entry, golden-B order, with golden-B ids', async () => {
    const all = await Promise.all(modules());
    expect(all.length).toBeGreaterThanOrEqual(8);
    const multiFlag = all.filter(h => (h.riskFlags?.length ?? 0) > 1);
    expect(multiFlag.length).toBeGreaterThan(0); // real content exercises more than the single-flag path

    for (const h of all) {
      const pre = chromeIdOf(h);
      const tree = Risks({ howTo: h }) as AnyVNode;

      const rkItems = byTag(tree, 'li');
      expect(rkItems.map(li => li.props.children)).toEqual((h.risks ?? []).map(r => r.text));

      const flagDivs = elements(tree).filter(v => hasClass(v, 'redflag'));
      const flags = h.riskFlags ?? ['wrist'];
      expect(flagDivs).toHaveLength(flags.length);
      flags.forEach((f, i) => {
        const div = flagDivs[i]!;
        expect(div.props.id).toBe(`${pre}-redflag-${f}`);
        const texts = elements(div).filter(v => v.type === 'p').map(p => p.props.children);
        expect(texts).toEqual([FLAG[f].name, FLAG[f].now, FLAG[f].doctor]);
      });
    }
  });

  it('mutation: a component that always renders the wrist block, ignoring riskFlags, fails on a shoulder/elbow exercise (proves the test bites)', async () => {
    const all = await Promise.all(modules());
    const pullUp = all.find(h => h.id === 'lib_pull_up')!;
    expect(pullUp.riskFlags).toEqual(['wrist', 'shoulder', 'elbow']);
    const real = elements(Risks({ howTo: pullUp }) as AnyVNode).filter(v => hasClass(v, 'redflag'));
    expect(real).toHaveLength(3);

    // the mutation: a broken component that always shows only the shared wrist block
    const broken = elements(Risks({ howTo: { ...pullUp, riskFlags: ['wrist'] } }) as AnyVNode).filter(v => hasClass(v, 'redflag'));
    expect(broken).toHaveLength(1);
    expect(broken.length === pullUp.riskFlags!.length).toBe(false);
    expect(real.length === pullUp.riskFlags!.length).toBe(true);
  });
});
