import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DUR, REDUCED_DUR } from '@/ui/motion';

const cssPath = fileURLToPath(new URL('../../src/ui/styles.css', import.meta.url));
const css = readFileSync(cssPath, 'utf8');

// Animation names allowed to keep a literal, infinite-running duration: the handful of
// decorative loops the plan keeps outside the token system. exercise-breathe/exercise-shimmer
// are a batch-b1-only addition — I3 (batch b2b) deletes both rules, at which point they come
// out of this list again.
const ALLOW = ['esc-rot', 'esc-blink', 'esc-pulse', 'esc-lift', 'palace-glow', 'esc-spin', 'exercise-breathe', 'exercise-shimmer'];

const TOKENS_START = '/* tokens:start */';
const TOKENS_END = '/* tokens:end */';

function stripTokenBlock(source: string): string {
  const start = source.indexOf(TOKENS_START);
  const end = source.indexOf(TOKENS_END);
  if (start === -1 || end === -1) throw new Error('tokens:start/tokens:end markers not found');
  return source.slice(0, start) + source.slice(end + TOKENS_END.length);
}

function extractBlock(source: string, selector: string): string {
  const at = source.indexOf(selector);
  if (at === -1) throw new Error(`selector not found: ${selector}`);
  const open = source.indexOf('{', at);
  const close = source.indexOf('}', open);
  return source.slice(open + 1, close);
}

function parseVars(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /--([\w-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block))) {
    const [, name, value] = m;
    if (name && value) out[name] = value.trim();
  }
  return out;
}

const TIME_RE = /\b\d*\.?\d+m?s\b/;
const DECL_PROPS = ['transition', 'transition-duration', 'transition-delay', 'animation', 'animation-duration', 'animation-delay'];

interface Decl { prop: string; value: string; }

function findDeclarations(source: string): Decl[] {
  const decls: Decl[] = [];
  // QA5-10: terminate on `;` OR `}` (a block's last declaration often omits the semicolon), and
  // anchor on a real delimiter before the property name instead of a bare \b (so e.g. a selector
  // ending in a class named `...-transition` can't be mistaken for the property).
  const re = new RegExp(`(?:^|[{;\\s])(${DECL_PROPS.join('|')})\\s*:\\s*([^;}]+)`, 'g');
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) {
    const [, prop, value] = m;
    if (prop && value) decls.push({ prop, value: value.trim() });
  }
  return decls;
}

function animationNameOf(value: string): string {
  return value.split(/\s+/)[0] ?? '';
}

const withoutTokens = stripTokenBlock(css);

describe('styles.css motion token lint (F1)', () => {
  it('has no bare time literal in transition/animation outside the token block, unless allow-listed', () => {
    const offenders = findDeclarations(withoutTokens).filter(d => {
      if (!TIME_RE.test(d.value)) return false;
      if (d.prop.startsWith('animation') && ALLOW.includes(animationNameOf(d.value))) return false;
      return true;
    });
    expect(offenders).toEqual([]);
  });

  it('has no bare time literal inside a ::view-transition-* rule', () => {
    // QA5-10: every ::view-transition-* pseudo-element takes a (name) argument
    // (::view-transition-old(root), -group(name), ...); the bare form has none.
    const re = /::view-transition(?:-[\w-]+)?(?:\([^)]*\))?\s*\{([^}]*)\}/g;
    const offenders: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(withoutTokens))) {
      for (const decl of findDeclarations(m[1] ?? '')) if (TIME_RE.test(decl.value)) offenders.push(decl.value);
    }
    expect(offenders).toEqual([]);
  });

  it('has no cubic-bezier( outside the token block', () => {
    expect(withoutTokens.includes('cubic-bezier(')).toBe(false);
  });

  it('has no `transition: all`', () => {
    expect(/transition\s*:\s*all\b/.test(withoutTokens)).toBe(false);
  });

  it('has no `infinite` animation outside the allow list', () => {
    const offenders = findDeclarations(withoutTokens).filter(d => {
      if (!d.prop.startsWith('animation') || !/\binfinite\b/.test(d.value)) return false;
      return !ALLOW.includes(animationNameOf(d.value));
    });
    expect(offenders).toEqual([]);
  });

  // QA5-10: the check above only reads DECL_PROPS (transition*/animation*), so the longhand
  // animation-iteration-count: infinite (not in DECL_PROPS) slipped past it entirely, ALLOW or not.
  it('has no `animation-iteration-count: infinite` (the longhand form) anywhere', () => {
    expect(/animation-iteration-count\s*:\s*infinite/.test(withoutTokens)).toBe(false);
  });

  describe('the lint itself catches what QA5-10 found', () => {
    it('a semicolon-less last declaration', () => {
      const offenders = findDeclarations('.x { color: red; transition: opacity 200ms }').filter(d => TIME_RE.test(d.value));
      expect(offenders).toEqual([{ prop: 'transition', value: 'opacity 200ms' }]);
    });
    it('the ::view-transition-old(name) form', () => {
      const re = /::view-transition(?:-[\w-]+)?(?:\([^)]*\))?\s*\{([^}]*)\}/g;
      const m = re.exec('::view-transition-old(root){animation-duration:200ms}');
      expect(m?.[1]).toBe('animation-duration:200ms');
      expect(findDeclarations(m![1]!).some(d => TIME_RE.test(d.value))).toBe(true);
    });
    it('animation-iteration-count: infinite as a standalone longhand', () => {
      expect(/animation-iteration-count\s*:\s*infinite/.test('.x{animation: esc-fade var(--dur-base); animation-iteration-count: infinite;}')).toBe(true);
    });
  });

  it('git grep for cubic-bezier( on the CSS file only matches inside the token range', () => {
    const start = css.indexOf(TOKENS_START);
    const end = css.indexOf(TOKENS_END);
    const re = /cubic-bezier\(/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(css))) {
      expect(m.index).toBeGreaterThan(start);
      expect(m.index).toBeLessThan(end);
    }
  });

  it('motion.ts DUR/REDUCED_DUR mirror the CSS duration tokens exactly', () => {
    const rootBlock = extractBlock(css, ':root {');
    const reduceBlock = extractBlock(css, 'html[data-motion="reduce"] {');
    const rootVars = parseVars(rootBlock);
    const reduceVars = parseVars(reduceBlock);

    const keyMap: Record<keyof typeof DUR, string> = {
      press: 'dur-press', fast: 'dur-fast', base: 'dur-base', enter: 'dur-enter', exit: 'dur-exit',
      sheet: 'dur-sheet', sheetExit: 'dur-sheet-exit', spring: 'dur-spring', bounce: 'dur-bounce',
      stagger: 'stagger', delayContent: 'delay-content',
    };

    for (const [key, cssVar] of Object.entries(keyMap) as [keyof typeof DUR, string][]) {
      const rootValue = rootVars[cssVar];
      if (!rootValue) throw new Error(`--${cssVar} missing from :root`);
      const rootMs = Number(rootValue.replace('ms', ''));
      expect(DUR[key], `DUR.${key} vs --${cssVar}`).toBe(rootMs);
      const reducedRaw = reduceVars[cssVar] ?? rootValue;
      const reducedMs = Number(reducedRaw.replace('ms', ''));
      expect(REDUCED_DUR[key], `REDUCED_DUR.${key} vs --${cssVar} under reduce`).toBe(reducedMs);
    }
  });
});
