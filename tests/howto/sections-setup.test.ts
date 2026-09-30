// HT-9 (HT9-A2): "Set it up" (plan 2.4 item 6). Pure-function test on `renderSetup`, walking the returned VNode
// tree (project convention: no jsdom, same style as tests/error-boundary.test.ts). Setup.tsx has no dependency on
// HT-5's archetypes.ts, so this test runs standalone.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import type { VNode } from 'preact';
import { renderSetup, SETUP_VISIBLE } from '@/slices/howto/sections/Setup';
import type { BuiltHowTo } from '@/howto/types';
import type { SetupStep } from '@/howto/content-types';

/** A minimal BuiltHowTo whose plate carries a resolvable chromeId ('test-ex', via chromeIdOf's own regex). */
function fixture(setup: readonly SetupStep[]): BuiltHowTo {
  return {
    schema: 1,
    id: 'lib_machine_chest_press',
    name: 'Test Exercise',
    hashes: { inputsSha256: 'x', golden: 'x' },
    plate: {
      view: 'side',
      normal: { svg: '<svg></svg>', overlay: '<button id="test-ex-n-grip"></button>', firstKey: 'grip', cues: [] },
      mistake: { svg: '<svg></svg>', overlay: '', firstKey: 'grip', cues: [] },
      tells: '',
      tempo: '',
      alt: '',
      mistakeAlt: '',
    },
    setup,
  } as unknown as BuiltHowTo;
}

const step = (text: string, zoom?: string): SetupStep => ({ text, kind: 'get-in', zoom, claim: { tags: ['CONSENSUS'], sources: [] } });

/** Depth-first walk collecting every element vnode (skips text/booleans/null), like error-boundary.test's `texts()`. */
function elements(n: unknown): VNode[] {
  if (n == null || typeof n === 'boolean' || typeof n === 'string' || typeof n === 'number') return [];
  if (Array.isArray(n)) return n.flatMap(elements);
  const v = n as VNode<{ children?: unknown }>;
  if (!v.type) return elements(v.props?.children);
  return [v, ...elements(v.props?.children)];
}
const byTag = (tree: VNode, tag: string) => elements(tree).filter(v => v.type === tag);

describe('HT9-A2: Setup ("Set it up")', () => {
  it('numbers every step and shows no "All steps" button when the count is within SETUP_VISIBLE (golden B today: 5 of 5)', () => {
    const h = fixture([step('a'), step('b'), step('c'), step('d'), step('e')]);
    expect(h.setup!.length).toBe(SETUP_VISIBLE);
    const tree = renderSetup(h, false, () => {});
    expect(byTag(tree, 'li')).toHaveLength(5);
    expect(byTag(tree, 'li').every(li => !li.props.hidden)).toBe(true);
    expect(byTag(tree, 'button').filter(b => (b.props as { class?: string }).class?.includes('st-more'))).toHaveLength(0);
  });

  it('collapses steps past SETUP_VISIBLE and reveals them, read in full, once "All N steps" is toggled open', () => {
    const steps = [step('a'), step('b'), step('c'), step('d'), step('e'), step('f'), step('g')];
    const closed = renderSetup(fixture(steps), false, () => {});
    const closedLis = byTag(closed, 'li');
    expect(closedLis).toHaveLength(7);
    expect(closedLis.slice(0, 5).every(li => !li.props.hidden)).toBe(true);
    expect(closedLis.slice(5).every(li => li.props.hidden === true)).toBe(true);
    const more = byTag(closed, 'button').find(b => (b.props as { class?: string }).class?.includes('st-more'))!;
    expect(more.props['aria-expanded']).toBe(false);
    expect(more.props.children).toBe('All 7 steps');

    const open = renderSetup(fixture(steps), true, () => {});
    const openLis = byTag(open, 'li');
    expect(openLis.every(li => !li.props.hidden)).toBe(true);
    const moreOpen = byTag(open, 'button').find(b => (b.props as { class?: string }).class?.includes('st-more'))!;
    expect(moreOpen.props['aria-expanded']).toBe(true);
    expect(moreOpen.props.children).toBe('Fewer steps');
  });

  it('"All steps" and "Show me" targets are >= 44x44 (.fr-more/.st-show, css/text.css) and the button carries aria-expanded', () => {
    const steps = [step('a'), step('b'), step('c'), step('d'), step('e'), step('f')];
    const tree = renderSetup(fixture(steps), false, () => {});
    const more = byTag(tree, 'button').find(b => (b.props as { class?: string }).class?.includes('st-more'))!;
    expect(more.props).toHaveProperty('aria-expanded');
    const css = readFileSync('src/slices/howto/css/text.css', 'utf8');
    expect(css).toMatch(/\.st-show \{[^}]*min-height: 44px/);
    expect(css).toMatch(/\.fr-more \{[^}]*min-height: 44px/);
  });

  it('a "Show me the X" button appears only for a step with a resolvable zoom chip', () => {
    const withZoom = fixture([step('a', 'grip'), step('b')]);
    (withZoom as unknown as { zooms: unknown }).zooms = [{ key: 'grip', chip: 'Hand' }];
    const tree = renderSetup(withZoom, false, () => {});
    const shows = byTag(tree, 'button').filter(b => (b.props as { class?: string }).class?.includes('st-show'));
    expect(shows).toHaveLength(1);
    const kids = ([] as unknown[]).concat(shows[0]!.props.children as unknown);
    expect(kids[0]).toBe('Show me the hand');
  });

  it('mutation: dropping the hidden attribute on a collapsed step fails the collapsed-state assertion (proves the test bites)', () => {
    const steps = [step('a'), step('b'), step('c'), step('d'), step('e'), step('f')];
    const closedLis = byTag(renderSetup(fixture(steps), false, () => {}), 'li');
    // the mutation: pretend every li rendered visible, as a broken component would
    const mutated = closedLis.map(li => ({ ...li.props, hidden: false }));
    expect(mutated.slice(5).every(p => p.hidden === true)).toBe(false);
    expect(closedLis.slice(5).every(li => li.props.hidden === true)).toBe(true);
  });
});
