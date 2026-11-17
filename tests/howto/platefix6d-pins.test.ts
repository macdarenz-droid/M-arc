// LIB-PLATEFIX-6d (D-PF6C-PINS): PF6d's 'owner' D-OWNER-REPIN entries in the batch golden files (#438 6938786967), the
// lessPF6DGolden form that the W9/W10 layers-entry checks run behind (library-ci scPinned, ship-w10), with its reds.
import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PF6D_ENTRIES, lessPF6DGolden } from './platefix6d-pins';

/* eslint-disable @typescript-eslint/no-explicit-any */
const DIR = 'tests/howto/golden/library';
const golden = (b: string) => JSON.parse(readFileSync(`${DIR}/${b}.json`, 'utf8'));
const batches = readdirSync(DIR).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)).sort();

describe('PF6d owner entries (lessPF6DGolden)', () => {
  it('lb03, lb05, lb06, lb10 end in exactly their PF6d entries; every other batch has none', () => {
    expect(Object.keys(PF6D_ENTRIES)).toEqual(['lb03', 'lb05', 'lb06', 'lb10']);
    for (const b of batches) { const f = golden(b), n = PF6D_ENTRIES[b] ? PF6D_ENTRIES[b]!.length + 1 : 0; expect(lessPF6DGolden(f, b).entries, b).toEqual(f.entries.slice(0, f.entries.length - n)); }
  });
  it('reds: another approval, an entry moved out of the tail, another superseded entry, another id, an extra trailing entry', () => {
    const red = (b: string, mut: (E: any[]) => void) => { const f = golden(b); mut(f.entries); expect(() => lessPF6DGolden(f, b), b).toThrow(/PF6d/); };
    red('lb06', E => { E.at(-1).approval = E.at(-1).approval.replace('6938786967', '6938786968'); });
    red('lb06', E => { E.splice(3, 0, E.pop()); });
    red('lb10', E => { E.at(-2).supersedes = 0; });
    red('lb05', E => { E.at(-2).id = 'lib_cable_curl'; });
    red('lb03', E => { E.push(structuredClone(E.at(-1))); });
  });
});
