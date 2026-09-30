import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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

  it('A3: no source, CSS or theme still refers to a removed FG-1 figure token', () => {
    const removed = ['mistake', 'target', 'help', 'quiet', 'pants', 'pants-hi', 'pants-sh', 'ink', 'iron', 'iron-hi', 'iron-sh', 'eye', 'floor', 'guide'];
    const token = new RegExp(`--(${removed.join('|')})(?![\\w-])`);
    const hits = [...srcFiles, 'index.html'].filter(f => token.test(readFileSync(f, 'utf8')));
    expect(hits).toEqual([]);
    const keys = ['mistake', 'target', 'help', 'quiet', 'pants', 'pantsHi', 'pantsSh', 'ink', 'iron', 'ironHi', 'ironSh', 'eye', 'floor', 'guide'];
    for (const id of THEME_IDS) {
      expect(themeToCss(THEMES[id]), id).not.toMatch(token);
      expect(Object.keys(THEMES[id].tokens).filter(k => keys.includes(k)), id).toEqual([]);
    }
  });
});
