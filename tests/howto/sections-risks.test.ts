// HT-9 (HT9-A3): "Risks". Risks.tsx has no hooks, so it's called directly and its VNode tree
// walked (project convention: no jsdom, same style as tests/error-boundary.test.ts / sections-setup.test.ts).
// Runs against the real generated modules (HT-2/HT-5), not a synthetic fixture: proves the real 8 exercises, not
// just a shape.
import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import type { VNode } from 'preact';
import { renderRisks } from '@/slices/howto/sections/Risks';
import { chromeIdOf } from '@/slices/howto/PlateView';
import { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_KNEE, RED_FLAG_ELBOW, STOP_LINE } from '@/howto/archetypes';
import { RED_FLAG_BACK } from '@/howto/red-flag-back';
import type { BuiltHowTo } from '@/howto/types';
import type { RiskJoint } from '@/howto/content-types';
import { readHowTo } from './generated-module';

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
  .map(async f => readHowTo(f.slice(3, -3)));

const FLAG: Readonly<Record<RiskJoint, { name: string; now: string; doctor: string }>> = {
  wrist: RED_FLAG, shoulder: RED_FLAG_SHOULDER, knee: RED_FLAG_KNEE, elbow: RED_FLAG_ELBOW,
  back: RED_FLAG_BACK,
};

describe('HT9-A3: Risks ("Risks")', () => {
  it('renders every risk row, and for all real exercises one red-flag block per riskFlags entry, golden-B order, with golden-B ids', async () => {
    const all = await Promise.all(modules());
    expect(all.length).toBeGreaterThanOrEqual(8);
    const multiFlag = all.filter(h => (h.riskFlags?.length ?? 0) > 1);
    expect(multiFlag.length).toBeGreaterThan(0); // real content exercises more than the single-flag path

    for (const h of all) {
      const pre = chromeIdOf(h);
      const tree = renderRisks(h) as AnyVNode;

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

      // F-SHEET-COPY (R1 as amended by D-SHEETCOPY-STOPLINE): no "not medical advice" line. The render is the Risks
      // section alone, its heading is "Risks", no node carries "medical advice", and its last node is the stop line.
      expect(tree.type).toBe('section');
      expect(hasClass(tree, 'risks')).toBe(true);
      expect(elements(tree).filter(v => hasClass(v, 'ht-disclaimer'))).toHaveLength(0);
      expect(byTag(tree, 'h4').map(v => v.props.children)).toEqual(['Risks']);
      expect(JSON.stringify(elements(tree).map(v => v.props.children ?? null))).not.toMatch(/medical advice/i);
      const kids = elements(tree.props.children);
      const last = (tree.props.children as unknown[]).flat().filter(Boolean).at(-1) as AnyVNode;
      expect([last.type, last.props.class, last.props.children]).toEqual(['p', 'rk-stop', STOP_LINE]);
      expect(kids.filter(v => hasClass(v, 'rk-stop'))).toHaveLength(1);
    }
  });

  it('STOP_LINE is the owner\'s kept sentence, word for word (D-SHEETCOPY-STOPLINE)', () => {
    expect(STOP_LINE).toBe('If something hurts, stop and get it checked.');
  });

  it('mutation MB1: a render that puts the closing line back fails the absence check (proves the test bites)', async () => {
    const all = await Promise.all(modules());
    const h = all[0]!;
    const real = renderRisks(h) as AnyVNode;
    const back = { type: 'div', props: { children: [real, { type: 'p', props: { class: 'ht-disclaimer', children: 'General guidance, not medical advice.' } }] } } as unknown as AnyVNode;
    expect(elements(real).filter(v => hasClass(v, 'ht-disclaimer'))).toHaveLength(0);
    expect(elements(back).filter(v => hasClass(v, 'ht-disclaimer'))).toHaveLength(1);
    expect(JSON.stringify(elements(back).map(v => v.props.children ?? null))).toMatch(/medical advice/i);
  });

  it('mutation: a component that always renders the wrist block, ignoring riskFlags, fails on a shoulder/elbow exercise (proves the test bites)', async () => {
    const all = await Promise.all(modules());
    const pullUp = all.find(h => h.id === 'lib_pull_up')!;
    expect(pullUp.riskFlags).toEqual(['wrist', 'shoulder', 'elbow']);
    const real = elements(renderRisks(pullUp) as AnyVNode).filter(v => hasClass(v, 'redflag'));
    expect(real).toHaveLength(3);

    // the mutation: a broken component that always shows only the shared wrist block
    const broken = elements(renderRisks({ ...pullUp, riskFlags: ['wrist'] }) as AnyVNode).filter(v => hasClass(v, 'redflag'));
    expect(broken).toHaveLength(1);
    expect(broken.length === pullUp.riskFlags!.length).toBe(false);
    expect(real.length === pullUp.riskFlags!.length).toBe(true);
  });
});

// LR-23 (no evidence labels in the UI): golden B's shared module, which HT-5 generates archetypes.ts from, carries no
// SHOW_EVIDENCE flag either (moved here from HT-5's content-gen.test.ts, review of #113 finding 5).
describe('HT-9 LR-23: no SHOW_EVIDENCE flag', () => {
  it('golden B\'s shared module and archetypes.ts export no SHOW_EVIDENCE', async () => {
    const shared = await import(/* @vite-ignore */ new URL('../../tools/plates/layers/howto/shared.mjs', import.meta.url).href);
    const archetypes = await import('../../src/howto/archetypes');
    expect('SHOW_EVIDENCE' in shared).toBe(false);
    expect('SHOW_EVIDENCE' in archetypes).toBe(false);
  });
});
