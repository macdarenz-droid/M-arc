// HT6-A8 (critic fix 8): the push grip hint on the Train card. One `p.hint.muted`, whose text is only ever
// howToHint(ex.id) (generated from golden B's handling.cue by HT-5), behind `ex && !ex.custom &&`. Gate block HT-6
// shows it on screen once, and absent for a non-push How-to, a no-How-to exercise and a custom exercise.
// LIB-2 (ruling D-LIB2-hints): the hints moved from the HOWTO_HINTS object to plan 5.2's deduplicated encoding, read
// only through the decoder howToHint; these checks read it over every exercises.json id (the old ones read the keys).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { howToHint } from '@/howto/ids';
// LIB-2: the shipped id list moved out of the main bundle into the lazy loaders chunk (ids.ts keeps only hashes).
import { HOWTO_IDS } from '@/howto/generated/loaders';
import { SHIPPED } from './shipped-rows';
import { readHowTo } from './generated-module';

const walk = (d: string): string[] => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const TRAIN = readFileSync('src/slices/workout/Train.tsx', 'utf8');
const ALL_IDS = (JSON.parse(readFileSync('src/data/exercises.json', 'utf8')) as { id: string }[]).map(e => e.id);
/** Every hinted id and its text, through the decoder. */
const hinted = () => ALL_IDS.flatMap(id => { const t = howToHint(id); return t === undefined ? [] : [[id, t] as const]; });
/** The one hint line, as the plan writes it (2.4). */
export const HINT_LINE = /\{ex && !ex\.custom && hasHowTo\(ex\.id\) && howToHint\(ex\.id\) && <p class="hint muted">\{howToHint\(ex\.id\)\}<\/p>\}/;
/** Every problem of Train.tsx's hint wiring; [] when it is the plan's one line. */
export function hintProblems(src: string): string[] {
  const bad: string[] = [];
  const uses = src.split('\n').filter(l => /howToHint|HOWTO_HINTS/.test(l) && !/^import /.test(l.trim()));
  if (uses.length !== 1) bad.push(`howToHint used on ${uses.length} lines`);
  if (!HINT_LINE.test(src)) bad.push('the hint line is not `{ex && !ex.custom && hasHowTo(ex.id) && howToHint(ex.id) && <p class="hint muted">{howToHint(ex.id)}</p>}`');
  return bad;
}

describe('HT6-A8: the push hint', () => {
  it('howToHint gives golden B\'s cue for push exercises with an approved How-to, and nothing for any other exercises.json id', async () => {
    expect(ALL_IDS).toHaveLength(153);
    const keys = hinted().map(([id]) => id);
    expect(keys.length).toBeGreaterThan(0);
    for (const id of keys) expect(HOWTO_IDS as readonly string[]).toContain(id);
    for (const id of HOWTO_IDS) {
      const h = readHowTo(SHIPPED.find(r => r.id === id)!.slug) as unknown as { handling?: { archetype: string; cue?: string } };
      if (h.handling?.archetype === 'push') expect(howToHint(id), id).toBe(h.handling.cue);
      else expect(howToHint(id), id).toBeUndefined();
    }
    for (const id of ['custom_1727000000000', '', 'lib_', 'LIB_MACHINE_CHEST_PRESS']) expect(howToHint(id), id).toBeUndefined();
  });
  it('Train.tsx renders only howToHint(ex.id), behind ex && !ex.custom &&, in one p.hint.muted', () => {
    expect(hintProblems(TRAIN)).toEqual([]);
  });
  it('failure path: dropping !ex.custom, typing the text, or a second use fails', () => {
    expect(hintProblems(TRAIN.replace('ex && !ex.custom && hasHowTo(ex.id) && howToHint', 'ex && hasHowTo(ex.id) && howToHint'))).not.toEqual([]);
    expect(hintProblems(TRAIN.replace('<p class="hint muted">{howToHint(ex.id)}</p>', '<p class="hint muted">Heel of palm, wrist straight.</p>'))).not.toEqual([]);
    expect(hintProblems(`${TRAIN}\nconst x = howToHint;`)).not.toEqual([]);
  });
  it('no hint text is typed in any .tsx file', () => {
    const tsx = walk('src').filter(f => f.endsWith('.tsx')).map(f => [f, readFileSync(f, 'utf8')] as const);
    expect(hinted().length).toBeGreaterThan(0);
    for (const [, t] of hinted()) for (const [f, s] of tsx) expect(s.includes(t), `${f} types "${t}"`).toBe(false);
  });
});
