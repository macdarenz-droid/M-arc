// LIB-PLATEFIX-1 (#385 6649353130): the W2 fix round's re-citations live in fields, not only in source comments.
// Each string the fix round re-cited carries its card claim ids in a field: How-to zooms[].cite.{right,wrong} (the
// half's callout, caption and alt), handling.gripCite (the grip line), and the plate spec's callout or tell `cite`.
// The library lint (lint/index.mjs zoomCites, inside lintLibraryRow) checks every How-to cite against the card; this
// file pins each cite to exactly the ids its fix names, so a string citing any other id fails.
import { describe, expect, it } from 'vitest';
// @ts-expect-error untyped .mjs
import { cardReader, citeIds, lintLibraryRow, zoomCites } from '../../tools/plates/library/lint/index.mjs';

type Sides = { right: string[]; wrong: string[] };
const HOWTO: Record<string, { zooms: Record<string, Sides>; grip?: string[] }> = {
  barbell_overhead_press: { zooms: { 'ohp-forearm-vertical': { right: ['c5', 'c2'], wrong: ['c5'] } }, grip: ['c3', 'c4'] },
  romanian_deadlift: { zooms: { 'rdl-bottom': { right: ['c2', 'c5', 'c4', 'c6'], wrong: ['c7'] } }, grip: ['c9', 'c22'] },
  single_leg_romanian_deadlift: { zooms: { 'slrdl-line': { right: ['c8', 'c9'], wrong: ['c7'] } }, grip: ['c1', 'c18'] },
  triceps_pushdown: { zooms: { 'pushdown-elbow': { right: ['c5', 'c7'], wrong: ['c6'] } } },
};
// plate spec strings: [spec, where ('callouts' or 'tells'), key, ids]
const SPEC: [string, 'callouts' | 'tells', string, string[]][] = [
  ['barbell_overhead_press', 'callouts', 'head', ['c6']],
  ['reverse_lunge', 'callouts', 'weight', ['c3']],
  ['reverse_lunge', 'tells', 'flare', ['c18']],
];

// @ts-expect-error untyped .mjs
const shared = async () => import('../../tools/plates/layers/howto/shared.mjs');
const howto = async (id: string) => import(`../../tools/plates/library/howto/lib_${id}.howto.mjs`);
const spec = async (id: string) => (await import(`../../tools/plates/library/specs/${id}.mjs`)).default;
const card = (id: string) => cardReader()(`docs/research/howto/cards/${id}.json`);
const citedZooms = (H: any) => Object.fromEntries((H.zooms ?? []).filter((z: any) => z.cite !== undefined).map((z: any) => [z.key, z.cite]));
const specCite = (S: any, where: string, key: string) => (where === 'tells' ? S.mistake.tells : S.callouts).find((c: any) => c.key === key)?.cite;
const withZoomCite = (M: any, key: string, cite: unknown) =>
  ({ ...M, default: { ...M.default, zooms: M.default.zooms.map((z: any) => (z.key === key ? { ...z, cite } : z)) } });

describe('PLATEFIX cites: each re-cited string carries the ids its fix names (#385 6649353130)', () => {
  for (const [id, want] of Object.entries(HOWTO)) {
    it(`${id}: zoom and grip cites are exactly the fix's ids, and the lint passes them`, async () => {
      const M = await howto(id), H = M.default;
      expect(citedZooms(H)).toEqual(want.zooms);
      expect(H.handling?.gripCite).toEqual(want.grip);
      expect(zoomCites(M)).toEqual([]);
      expect(lintLibraryRow(M, await shared()).filter((x: any) => /^cite /.test(x.rule))).toEqual([]);
    });
  }
  for (const [id, where, key, ids] of SPEC) {
    it(`${id} plate ${where}.${key}: cite is exactly ${ids.join(', ')}, all in the card`, async () => {
      const ids2 = specCite(await spec(id), where, key);
      expect(ids2).toEqual(ids);
      expect(citeIds(`${id}.${key}`, ids2, card(id))).toEqual([]);
    });
  }

  it('mutation: a zoom citing another real card id fails the pin; one not in the card fails the lint', async () => {
    const M = await howto('triceps_pushdown');
    const other = withZoomCite(M, 'pushdown-elbow', { right: ['c5', 'c7'], wrong: ['c11'] });
    expect(citedZooms(other.default)).not.toEqual(HOWTO.triceps_pushdown!.zooms);
    expect(zoomCites(other)).toEqual([]);   // c11 is a real card id: only the exact pin catches it
    const bad = withZoomCite(M, 'pushdown-elbow', { right: ['c5', 'c99'], wrong: ['c6'] });
    expect(zoomCites(bad).map((x: any) => x.rule)).toEqual(['cite id not in the card']);
    expect(lintLibraryRow(bad, await shared()).some((x: any) => x.rule === 'cite id not in the card')).toBe(true);
  });
  it('mutation: a zoom citing one half only, a non-id, a repeat or an empty list is refused', async () => {
    const M = await howto('romanian_deadlift');
    const rules = (cite: unknown) => zoomCites(withZoomCite(M, 'rdl-bottom', cite)).map((x: any) => x.rule);
    expect(rules({ right: ['c2'] })).toEqual(['cite must be a non-empty list of card claim ids']);
    expect(rules({ right: ['card c2'], wrong: ['c7'] })).toEqual(['cite id is not a card claim id']);
    expect(rules({ right: ['c2', 'c2'], wrong: ['c7'] })).toEqual(['cite lists an id twice']);
    expect(rules({ right: [], wrong: ['c7'] })).toEqual(['cite must be a non-empty list of card claim ids']);
  });
  it('mutation: a grip cite not in the card, and a spec cite not in the card, are refused', async () => {
    const M = await howto('barbell_overhead_press');
    const g = { ...M, default: { ...M.default, handling: { ...M.default.handling, gripCite: ['c3', 'c40'] } } };
    expect(zoomCites(g).map((x: any) => x.path)).toEqual(['handling.gripCite']);
    expect(citeIds('reverse_lunge.flare', ['c18', 'c77'], card('reverse_lunge')).map((x: any) => x.rule)).toEqual(['cite id not in the card']);
    expect(citeIds('x', ['c1'], null).map((x: any) => x.rule)).toEqual(['cite id not in the card']);
  });
});
