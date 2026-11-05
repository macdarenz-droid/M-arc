// F-SCRATCH-SYNTH (card docs/supervisor/verify/f-scratch-synth-card.md; #394 Q-W7-8, D-SHIP-W7-SCRATCH): the LIB-4b and
// LIB-4c scratch sets name synthetic ids (D-LIB8M-SCRATCH7B form), so no scratch or fixture target is a batches/ row.
// Baseline: on main no target of the three sets (lib7b, LIB-4b, LIB-4c) is a batches/ row yet.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = join(__dirname, '../..');
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
let FX: any, C: any, S7: any;
beforeAll(async () => {
  FX = await import(/* @vite-ignore */ url('tools/plates/library/fidelity/fixture.mjs'));
  C = await import(/* @vite-ignore */ url('tools/plates/library/ci/scratch.mjs'));
  S7 = await import(/* @vite-ignore */ url('tests/library/fixtures/lib7b/fixture.mjs'));
});
const batchIds = () => {
  const dir = join(ROOT, 'tools/plates/library/batches');
  return new Set(readdirSync(dir).filter(n => n.endsWith('.json')).flatMap(n => Object.keys(JSON.parse(readFileSync(join(dir, n), 'utf8')).rows ?? {})));
};

describe('F-SCRATCH-SYNTH baseline', () => {
  it('no target of the lib7b, LIB-4b or LIB-4c set is a batches/ row on this head', () => {
    const rows = batchIds(), all = [...S7.SCRATCH_7B, ...FX.SCRATCH, ...C.SCRATCH_4C].map((s: any) => s.id);
    expect(all.filter(id => rows.has(id))).toEqual([]);
  });
});
