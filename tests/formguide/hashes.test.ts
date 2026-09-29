// V1-01: `check/hashes.json` is now one file per exercise, `check/hashes/<id>.txt`, so parallel exercise lanes never
// touch the same file (A1-A4).
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { CHECKS, runChecks } from '@/formguide/check';
import { inputFor, guideOf } from '@/formguide/check/node';
import { BASE } from './fixtures/bad/base';

const EX = 'src/formguide/exercises', BAD = 'tests/formguide/fixtures/bad';
const ID = 'lib_dumbbell_lateral_raise';

describe('A1: the hash file per exercise', () => {
  it(`${ID}.txt holds the stored snapshot`, () => {
    expect(readFileSync(`src/formguide/check/hashes/${ID}.txt`, 'utf8').trim()).toBe('c1ac61634cd68bd4');
  });
  it('all 20 checks pass for the real file, reading that folder', async () => {
    expect(CHECKS.length).toBe(20);
    const file = `${ID}.ts`;
    const g = guideOf(await import(`../../${EX}/${file}`), file);
    const rs = runChecks(inputFor(`${EX}/${file}`, g));
    expect(rs.map(r => r.check)).toEqual([...CHECKS]);
    expect(rs.filter(r => !r.ok)).toEqual([]);
  });
});

describe('A2: an id with no hash file fails `hash`, naming the new path', () => {
  it('names src/formguide/check/hashes/<id>.txt, not hashes.json', () => {
    const g = { ...BASE, id: 'no_such_exercise_id' };
    const r = runChecks(inputFor(`${EX}/${ID}.ts`, g as never), ['hash'])[0]!;
    expect(r.ok).toBe(false);
    const msg = r.fails.join('\n');
    expect(msg).toMatch(/record "[0-9a-f]{16}" in src\/formguide\/check\/hashes\/no_such_exercise_id\.txt/);
    expect(msg).not.toMatch(/hashes\.json/);
  });
});

describe('A3: no import of hashes.json remains', () => {
  it('no .ts file under src/ imports hashes.json', () => {
    const files = (readdirSync('src', { recursive: true }) as string[]).filter(f => f.endsWith('.ts'));
    const importsHashesJson = /(?:import[\s\S]*?from\s+|require\()\s*['"][^'"]*hashes\.json['"]/;
    const hits = files.filter(f => importsHashesJson.test(readFileSync(`src/${f}`, 'utf8')));
    expect(hits).toEqual([]);
  });
});

describe('A4: seeded bad fixtures still fail only their own check', () => {
  const dirs = readdirSync(BAD, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
  it.each(dirs)('%s', async dir => {
    const check = dir.split('.')[0] as (typeof CHECKS)[number];
    const f = readdirSync(`${BAD}/${dir}`).find(x => x.endsWith('.ts'))!;
    const g = guideOf(await import(`./fixtures/bad/${dir}/${f}`), f);
    const rs = runChecks(inputFor(`${BAD}/${dir}/${f}`, g));
    expect(rs.filter(r => !r.ok).map(r => r.check)).toEqual([check]);
  });
});
