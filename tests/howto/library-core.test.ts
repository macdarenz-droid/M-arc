// LIB-2 (library plan 5.2, 5.3; design docs/howto/library/LIB-2-DESIGN.md): the scale core. Each block names its
// design acceptance id (L2-A*). Every sweep asserts its count and is shown red on an empty input.
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
/* eslint-disable @typescript-eslint/no-explicit-any */
let gen: any, bodies: any, out: Map<string, { text: string; writers: string[]; hash: string }>;
beforeAll(async () => {
  gen = await import(/* @vite-ignore */ url('tools/plates/generate.mjs'));
  bodies = await import(/* @vite-ignore */ url('tools/plates/library/bodies.mjs'));
  out = await gen.render();
}, 180_000);

const fixture = () => JSON.parse(readFileSync('tests/howto/fixtures/generated-bodies.json', 'utf8')) as { count: number; bodies: Record<string, string> };

/** L2-A3: the listed bodies against fresh generator output; returns the problems. Red on an empty list or output. */
export function bodyProblems(want: Record<string, string>, got: Map<string, { text: string }>, bodySha: (t: string) => string, count: number): string[] {
  const keys = Object.keys(want);
  if (keys.length === 0) return ['no fingerprinted files'];
  if (got.size === 0) return ['no generator output'];
  const bad: string[] = [];
  if (keys.length !== count) bad.push(`${keys.length} fingerprints, expected ${count}`);
  for (const p of keys) {
    const o = got.get(p);
    if (!o) bad.push(`${p}: not generated`);
    else if (bodySha(o.text) !== want[p]) bad.push(`${p}: body changed`);
  }
  return bad;
}

describe('L2-A3: the bodies LIB-2 does not rewrite are unchanged', () => {
  it('54 fingerprinted files (all generated files but ids.ts and generated/index.ts) match, header and hashes: line excluded', () => {
    const f = fixture();
    expect(f.count).toBe(54);
    expect(bodyProblems(f.bodies, out, bodies.bodySha, 54)).toEqual([]);
  });

  it('red on an empty list, an empty output, a missing file and one changed byte', () => {
    const f = fixture(), first = Object.keys(f.bodies)[0]!;
    expect(bodyProblems({}, out, bodies.bodySha, 54)).toEqual(['no fingerprinted files']);
    expect(bodyProblems(f.bodies, new Map(), bodies.bodySha, 54)).toEqual(['no generator output']);
    const missing = new Map(out); missing.delete(first);
    expect(bodyProblems(f.bodies, missing, bodies.bodySha, 54)).toEqual([`${first}: not generated`]);
    const changed = new Map(out); changed.set(first, { ...out.get(first)!, text: `${out.get(first)!.text} ` });
    expect(bodyProblems(f.bodies, changed, bodies.bodySha, 54)).toEqual([`${first}: body changed`]);
  });

  it('the header and the hashes: line are the only lines ignored', () => {
    const t = '// GENERATED, do not edit. Written by tools/plates/generate.mjs (x). inputsSha256=' + '0'.repeat(64) + '\nexport default {\n  hashes: { inputsSha256: "' + '1'.repeat(64) + '", golden: "' + '2'.repeat(64) + '" },\n  a: 1,\n};\n';
    expect(bodies.body(t)).toBe('export default {\n  a: 1,\n};\n');
  });
});
