// LIB-SHIP W3 (#384 6650401348): the re-citations of the W3 layers fix rounds live in fields, in the LIB-PLATEFIX-1 form
// (#385 ae37b940): How-to zooms[].cite.{right,wrong} (each half's callout, caption and alt) and handling.gripCite (the
// grip line). Until #385's lint rule (zoomCites/citeIds) is on main, this file pins each field to exactly its ids and
// checks every id is a claim of the row's own research card, with mutations.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = process.cwd();
const sheet = async (id: string): Promise<any> =>
  (await import(/* @vite-ignore */ pathToFileURL(join(ROOT, `tools/plates/library/howto/lib_${id}.howto.mjs`)).href)).default;
const cardIds = (id: string): Set<string> =>
  new Set(JSON.parse(readFileSync(join(ROOT, `docs/research/howto/cards/${id}.json`), 'utf8')).claims.map((c: any) => c.id));

/** Problems of one sheet's cite fields against its card: a non-list, an empty list, a repeated id, or an id not in the card. */
function citeProblems(id: string, H: any, ids = cardIds(id)): string[] {
  const out: string[] = [];
  const check = (path: string, list: unknown) => {
    if (!Array.isArray(list) || !list.length) { out.push(`${path}: not a non-empty list`); return; }
    if (new Set(list).size !== list.length) out.push(`${path}: an id twice`);
    for (const x of list) if (!ids.has(x)) out.push(`${path}: ${x} not in cards/${id}.json`);
  };
  for (const z of H.zooms ?? []) if (z.cite !== undefined) { check(`zooms[${z.key}].cite.right`, z.cite?.right); check(`zooms[${z.key}].cite.wrong`, z.cite?.wrong); }
  if (H.handling?.gripCite !== undefined) check('handling.gripCite', H.handling.gripCite);
  return out;
}

const PINS: Record<string, { grip?: string[]; zooms: Record<string, { right: string[]; wrong: string[] }> }> = {
  assisted_pull_up: { grip: ['c1', 'c12', 'c14'], zooms: { 'knee-pad': { right: ['c8', 'c1'], wrong: ['c8', 'c1'] }, shoulders: { right: ['c7', 'c8'], wrong: ['c7', 'c8'] } } },
  inverted_row: { grip: ['c2', 'c10', 'c14', 'c15'], zooms: { 'body-line': { right: ['c3'], wrong: ['c3'] }, top: { right: ['c4'], wrong: ['c4'] } } },
  single_arm_lat_pulldown: { grip: ['c1', 'c16'], zooms: { bottom: { right: ['c2', 'c3'], wrong: ['c10', 'c13'] } } },
  // W3 second recheck (#384 6653062201) content rows
  chin_up: { grip: ['c1', 'c21', 'c25'], zooms: {} },
  horizontal_leg_press: { grip: ['c2'], zooms: {} },
  close_grip_pulldown: { zooms: { pad: { right: ['c2', 'c3'], wrong: ['c2', 'c3'] } } },
};

describe('LIB-SHIP W3 cites (#384 6650401348): zooms[].cite and handling.gripCite carry card claim ids', () => {
  for (const [id, want] of Object.entries(PINS)) {
    it(`${id}: the cite fields are exactly the pinned ids, all in its card`, async () => {
      const H = await sheet(id);
      expect(H.handling?.gripCite).toEqual(want.grip);
      expect(Object.fromEntries((H.zooms ?? []).filter((z: any) => z.cite !== undefined).map((z: any) => [z.key, z.cite]))).toEqual(want.zooms);
      expect(citeProblems(id, H)).toEqual([]);
    });
  }
  it('mutation: an id not in the card, a repeated id and an empty list are refused', async () => {
    const H = await sheet('inverted_row');
    const withZoom = (cite: unknown) => ({ ...H, zooms: H.zooms.map((z: any) => (z.key === 'top' ? { ...z, cite } : z)) });
    expect(citeProblems('inverted_row', withZoom({ right: ['c4'], wrong: ['c99'] }))).toEqual(['zooms[top].cite.wrong: c99 not in cards/inverted_row.json']);
    expect(citeProblems('inverted_row', withZoom({ right: ['c4', 'c4'], wrong: ['c4'] }))).toEqual(['zooms[top].cite.right: an id twice']);
    expect(citeProblems('inverted_row', withZoom({ right: [], wrong: ['c4'] }))).toEqual(['zooms[top].cite.right: not a non-empty list']);
    const g = { ...H, handling: { ...H.handling, gripCite: ['c2', 'c77'] } };
    expect(citeProblems('inverted_row', g)).toEqual(['handling.gripCite: c77 not in cards/inverted_row.json']);
  });
  it('mutation: a real card id that is not the pinned one fails the exact pin', async () => {
    const H = await sheet('single_arm_lat_pulldown');
    expect({ ...H.handling, gripCite: ['c1', 'c15'] }.gripCite).not.toEqual(PINS.single_arm_lat_pulldown!.grip);
    expect(citeProblems('single_arm_lat_pulldown', { ...H, handling: { ...H.handling, gripCite: ['c1', 'c15'] } })).toEqual([]);
  });
});
