import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { THEMES, THEME_IDS, themeToCss } from '@/theme/themes';

// FG-OFF: the owner paused the form-guide animation (2026-09-29; backup branch
// claude/backup-fg-2026-09-29-main). The app carries no "How to do it" button, no guide player,
// and none of FG-1's figure theme tokens. The built bundle is checked by the gate's FG-OFF block.
const srcFiles = (readdirSync('src', { recursive: true }) as string[])
  .filter(f => /\.(ts|tsx|css)$/.test(f))
  .map(f => `src/${f.replace(/\\/g, '/')}`);

describe('FG-OFF: the form guide is out of the app', () => {
  it('A1: the Train exercise card has no "How to do it" button and opens no guide sheet', () => {
    const train = readFileSync('src/slices/workout/Train.tsx', 'utf8');
    expect(train).not.toContain('How to do it');
    expect(train).not.toContain('btn-how-to');
    expect(train).not.toMatch(/FormGuideSheet|hasGuide|guideOpen/);
    expect(readFileSync('src/ui/styles.css', 'utf8')).not.toContain('.btn-how-to');
  });

  it('A2: no form-guide code or player is left in src', () => {
    expect(existsSync('src/formguide')).toBe(false);
    expect(existsSync('src/slices/formguide')).toBe(false);
    const hits = srcFiles.filter(f => /formguide|ExercisePlayer|FormGuidePlayer|\.form-guide\b|\bfg4?-/.test(readFileSync(f, 'utf8')));
    expect(hits).toEqual([]);
  });

  // D-HT1 (HT-2, owner approval 2026-09-30): the old guide's 14 figure tokens stay banned except
  // `mistake`, which returns for the How-to plate with the D-FG1 values (A3-HT.a-c replace it).
  it('A3: no source, CSS or theme still refers to a removed old form guide figure token', () => {
    const removed = ['target', 'help', 'quiet', 'pants', 'pants-hi', 'pants-sh', 'ink', 'iron', 'iron-hi', 'iron-sh', 'eye', 'floor', 'guide'];
    const token = new RegExp(`--(${removed.join('|')})(?![\\w-])`);
    const hits = [...srcFiles, 'index.html'].filter(f => token.test(readFileSync(f, 'utf8')));
    expect(hits).toEqual([]);
    const keys = ['target', 'help', 'quiet', 'pants', 'pantsHi', 'pantsSh', 'ink', 'iron', 'ironHi', 'ironSh', 'eye', 'floor', 'guide'];
    for (const id of THEME_IDS) {
      expect(themeToCss(THEMES[id]), id).not.toMatch(token);
      expect(Object.keys(THEMES[id].tokens).filter(k => keys.includes(k)), id).toEqual([]);
    }
  });

  const mistake = /--mistake(?![\w-])/;
  it('A3-HT.a: --mistake is defined once in themes.ts and read only under src/slices/howto/', () => {
    const outside = [...srcFiles, 'index.html'].filter(f => !f.startsWith('src/slices/howto/') && mistake.test(readFileSync(f, 'utf8')));
    expect(outside).toEqual(['src/theme/themes.ts']);
    const themes = readFileSync('src/theme/themes.ts', 'utf8');
    expect(themes.match(/--mistake(?![\w-])/g)).toEqual(['--mistake']);
    expect(themes).toContain('`--mistake:${t.mistake}`,');
    expect(themes).not.toMatch(/var\(--mistake/);
  });

  const D_FG1 = { 'silent-black': '#eb5757', paper: '#c0392b', ember: '#b36bff', emerald: '#f04438', midnight: '#ff5c5c' } as const;
  it('A3-HT.b: every theme\'s CSS holds exactly one --mistake, with its D-FG1 value', () => {
    for (const id of THEME_IDS) {
      const css = themeToCss(THEMES[id]);
      expect([...css.matchAll(/--mistake(?![\w-])\s*:\s*([^;}]*)/g)].map(m => m[1]), id).toEqual([D_FG1[id]]);
    }
  });

  it('A3-HT.c: tokens.mistake is exactly the D-FG1 value in all 5 themes', () => {
    expect(Object.fromEntries(THEME_IDS.map(id => [id, THEMES[id].tokens.mistake]))).toEqual(D_FG1);
  });
});

// D-HT1 A4 (HT-2): the How-to stays out of the main bundle. Following static imports only (not
// `import type`, which the build erases, and not `import()`), main reaches no src/howto/** module
// except ids.ts (and HT-3's src/slices/howto/lazy.tsx, once it lands), and no src file imports tools/.
const SPEC = /^\s*(?:import|export)\s+(?!type\b)(?:[^'"()]*?\s+from\s+)?['"]([^'"]+)['"]/gm;
function resolveImport(from: string, spec: string): string | null {
  let base: string;
  if (spec.startsWith('@/')) base = `src/${spec.slice(2)}`;
  else if (spec.startsWith('.')) base = normalize(join(dirname(from), spec)).replace(/\\/g, '/');
  else return null;
  for (const ext of ['', '.ts', '.tsx', '/index.ts', '/index.tsx']) if (existsSync(base + ext) && !base.endsWith('/') && (ext || /\.\w+$/.test(base))) return base + ext;
  return null;
}
export function staticGraph(entry: string): Set<string> {
  const seen = new Set<string>();
  const walk = (f: string) => {
    if (seen.has(f)) return;
    seen.add(f);
    if (!/\.(ts|tsx)$/.test(f)) return;
    for (const m of readFileSync(f, 'utf8').matchAll(SPEC)) {
      const r = resolveImport(f, m[1]!);
      if (r) walk(r);
    }
  };
  walk(entry);
  return seen;
}

describe('D-HT1 A4: the How-to is reached from main only through ids.ts', () => {
  it('the static graph from src/main.tsx reaches no src/howto/** but ids.ts, and no src/slices/howto/** but lazy.tsx', () => {
    const graph = [...staticGraph('src/main.tsx')];
    expect(graph.length).toBeGreaterThan(50);
    expect(graph).toContain('src/app/App.tsx');
    const howto = graph.filter(f => f.startsWith('src/howto/') || f.startsWith('src/slices/howto/'));
    expect(howto.filter(f => f !== 'src/howto/ids.ts' && f !== 'src/slices/howto/lazy.tsx')).toEqual([]);
  });
  it('no src file imports tools/', () => {
    const hits = srcFiles.filter(f => [...readFileSync(f, 'utf8').matchAll(/(?:from\s+|import\s*\(\s*|import\s+)['"]([^'"]+)['"]/g)]
      .some(m => /^\/?tools\//.test(m[1]!) || (m[1]!.startsWith('.') && normalize(join(dirname(f), m[1]!)).replace(/\\/g, '/').startsWith('tools/'))));
    expect(hits).toEqual([]);
  });
});
