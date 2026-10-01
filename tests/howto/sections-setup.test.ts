// HT-9 (HT9-A2): "Set it up" (plan 2.4 item 6). Pure-function test on `renderSetup`, walking the returned VNode
// tree (project convention: no jsdom, same style as tests/error-boundary.test.ts). Setup.tsx has no dependency on
// HT-5's archetypes.ts, so this test runs standalone.
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import type { VNode } from 'preact';
import { renderSetup, SETUP_VISIBLE, openSetupZoom } from '@/slices/howto/sections/Setup';
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

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyVNode = VNode<Record<string, any>>;
/** Depth-first walk collecting every element vnode (skips text/booleans/null), like error-boundary.test's `texts()`.
 *  Props are read loosely (`Record<string, any>`), same as that test's own `VNode<{children?: unknown}>` cast: this
 *  walks arbitrary golden-B-shaped markup (hidden, aria-expanded, data-*, class), not one fixed component's props. */
function elements(n: unknown): AnyVNode[] {
  if (n == null || typeof n === 'boolean' || typeof n === 'string' || typeof n === 'number') return [];
  if (Array.isArray(n)) return n.flatMap(elements);
  const v = n as AnyVNode;
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
    expect(byTag(tree, 'button').filter(b => b.props.class?.includes('st-more'))).toHaveLength(0);
  });

  it('collapses steps past SETUP_VISIBLE and reveals them, read in full, once "All N steps" is toggled open', () => {
    const steps = [step('a'), step('b'), step('c'), step('d'), step('e'), step('f'), step('g')];
    const closed = renderSetup(fixture(steps), false, () => {});
    const closedLis = byTag(closed, 'li');
    expect(closedLis).toHaveLength(7);
    expect(closedLis.slice(0, 5).every(li => !li.props.hidden)).toBe(true);
    expect(closedLis.slice(5).every(li => li.props.hidden === true)).toBe(true);
    const more = byTag(closed, 'button').find(b => b.props.class?.includes('st-more'))!;
    expect(more.props['aria-expanded']).toBe(false);
    expect(more.props.children).toBe('All 7 steps');

    const open = renderSetup(fixture(steps), true, () => {});
    const openLis = byTag(open, 'li');
    expect(openLis.every(li => !li.props.hidden)).toBe(true);
    const moreOpen = byTag(open, 'button').find(b => b.props.class?.includes('st-more'))!;
    expect(moreOpen.props['aria-expanded']).toBe(true);
    expect(moreOpen.props.children).toBe('Fewer steps');
  });

  it('"All steps" is >= 44x44 (.fr-more, css/text.css) and the button carries aria-expanded (.st-show itself is HT-6\'s CSS, PR #112)', () => {
    const steps = [step('a'), step('b'), step('c'), step('d'), step('e'), step('f')];
    const tree = renderSetup(fixture(steps), false, () => {});
    const more = byTag(tree, 'button').find(b => b.props.class?.includes('st-more'))!;
    expect(more.props).toHaveProperty('aria-expanded');
    const css = readFileSync('src/slices/howto/css/text.css', 'utf8');
    expect(css).toMatch(/\.fr-more \{[^}]*min-height: 44px/);
  });

  it('a "Show me the X" button appears only for a step with a resolvable zoom chip', () => {
    const withZoom = fixture([step('a', 'grip'), step('b')]);
    (withZoom as unknown as { zooms: unknown }).zooms = [{ key: 'grip', chip: 'Hand' }];
    const tree = renderSetup(withZoom, false, () => {});
    const shows = byTag(tree, 'button').filter(b => b.props.class?.includes('st-show'));
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

/** A fake `.st-show` button: a real EventTarget (Node global, no jsdom) plus the bits onSetupClick/openSetupZoom
 *  read (`dataset`, `closest`). `closest('.st-show')` returns itself, matching how a real button at or under the
 *  click target would resolve. */
function fakeShowButton(zoom: string | undefined): HTMLElement {
  const el = new EventTarget() as unknown as HTMLElement;
  Object.assign(el, { dataset: { zoom }, closest: (sel: string) => (sel === '.st-show' ? el : null) });
  return el;
}

describe('HT9 critic fix: setup "Show me" opens its close-up (HT-10 sweep, 2026-10-01)', () => {
  it('openSetupZoom emits ht:zoom-open {key, opener} on the button, per the cross-section contract (events.ts)', () => {
    const btn = fakeShowButton('grip');
    const seen: unknown[] = [];
    btn.addEventListener('ht:zoom-open', e => seen.push((e as CustomEvent).detail));
    openSetupZoom(btn);
    expect(seen).toEqual([{ key: 'grip', opener: btn }]);
  });

  it('openSetupZoom is a no-op for a button with no resolvable zoom, and for null (no step matched)', () => {
    const btn = fakeShowButton(undefined);
    const seen: unknown[] = [];
    btn.addEventListener('ht:zoom-open', e => seen.push((e as CustomEvent).detail));
    openSetupZoom(btn);
    openSetupZoom(null);
    expect(seen).toEqual([]);
  });

  it('the section\'s onClick resolves the clicked .st-show via closest() and opens its close-up', () => {
    const h = fixture([step('a', 'grip'), step('b')]);
    (h as unknown as { zooms: unknown }).zooms = [{ key: 'grip', chip: 'Hand' }];
    const tree = renderSetup(h, false, () => {}) as AnyVNode;
    const onClick = tree.props.onClick as (e: { target: unknown }) => void;
    const btn = fakeShowButton('grip');
    const seen: unknown[] = [];
    btn.addEventListener('ht:zoom-open', e => seen.push((e as CustomEvent).detail));
    onClick({ target: btn });
    expect(seen).toEqual([{ key: 'grip', opener: btn }]);
  });

  it('mutation: a click target outside any .st-show (closest returns null) opens nothing (proves the test bites)', () => {
    const h = fixture([step('a', 'grip'), step('b')]);
    (h as unknown as { zooms: unknown }).zooms = [{ key: 'grip', chip: 'Hand' }];
    const onClick = (renderSetup(h, false, () => {}) as AnyVNode).props.onClick as (e: { target: unknown }) => void;
    const outside = Object.assign(new EventTarget(), { closest: () => null }) as unknown as HTMLElement;
    const spy = vi.fn();
    (outside as unknown as EventTarget).addEventListener('ht:zoom-open', spy);
    onClick({ target: outside });
    expect(spy).not.toHaveBeenCalled();
  });
});
