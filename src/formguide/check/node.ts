// FG-3: the file-system side of the checks, shared by the test and the CLI: the inputs of one exercise file. A seeded
// bad file may sit next to a `fixture.json` giving its own research, machine or part drawings and stored hash.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import library from '@/data/exercises.json';
import type { ExerciseGuide, Research } from '../model';
import type { CheckInput } from './index';

const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));

/** The stored hash snapshots under `check/hashes/`, one `<id>.txt` file per exercise, so parallel exercise lanes never
 * touch the same file. */
function hashesIn(root: string): Record<string, string> {
  const dir = join(root, 'src/formguide/check/hashes');
  if (!existsSync(dir)) return {};
  return Object.fromEntries(
    readdirSync(dir).filter(f => f.endsWith('.txt')).map(f => [basename(f, '.txt'), readFileSync(join(dir, f), 'utf8').trim()]),
  );
}

/** Everything under src/formguide/ that ships in the form-guide chunk (not exercises/, research/ or check/). */
export function chunkSource(root: string): string {
  const dir = join(root, 'src/formguide');
  return (readdirSync(dir, { recursive: true }) as string[])
    .filter(f => /\.ts$/.test(f) && !/^(exercises|research|check)[\\/]/.test(f)).sort()
    .map(f => readFileSync(join(dir, f), 'utf8')).join('\n');
}

export type Fixture = Partial<Pick<CheckInput, 'machines' | 'parts'>> & { research?: Research; hash?: string };

/** The check input for the exercise file at `path` (its guide already loaded). */
export function inputFor(path: string, guide: ExerciseGuide, root = process.cwd()): CheckInput {
  const fx: Fixture = existsSync(join(dirname(path), 'fixture.json')) ? readJson(join(dirname(path), 'fixture.json')) : {};
  const rp = join(root, 'src/formguide/research', `${guide.id}.json`);
  const hashes = hashesIn(root);
  return {
    guide,
    research: fx.research ?? (existsSync(rp) ? readJson(rp) : null),
    file: { name: basename(path).replace(/\.ts$/, ''), source: readFileSync(path, 'utf8') },
    library: library as CheckInput['library'],
    hashes: fx.hash ? { ...hashes, [guide.id]: fx.hash } : hashes,
    chunk: chunkSource(root),
    ...(fx.machines ? { machines: fx.machines } : {}),
    ...(fx.parts ? { parts: fx.parts } : {}),
  };
}

/** The ExerciseGuide a module exports: the export named after the file, else its only object export with an `id`. */
export function guideOf(mod: Record<string, unknown>, path: string): ExerciseGuide {
  const name = basename(path).replace(/\.ts$/, '');
  const g = mod[name] ?? Object.values(mod).find(v => v && typeof v === 'object' && 'id' in (v as object));
  if (!g) throw new Error(`${path} exports no ExerciseGuide`);
  return g as ExerciseGuide;
}
