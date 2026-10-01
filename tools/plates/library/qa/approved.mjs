// LIB-3: the approved 8 as QA candidates, sliced from a gallery page (the golden fixture, or a mirror rebuild with a
// planted mutation). A library candidate (LIB-2) has the same shape; see index.mjs for the fields.
import { readFileSync } from 'node:fs';
import { FIXTURE, LIB_OF, extractPlates } from '../../golden.mjs';
import { specIdOf } from './engine.mjs';
import { plateStrings } from './node.mjs';

const ARTICLE = /<article class="sheet-card" id="card-([a-z-]+)"[\s\S]*?<\/article>/g;
/** chromeId -> the card's <article> markup. */
export const articlesOf = html => new Map([...html.matchAll(ARTICLE)].map(m => [m[1], m[0]]));

export const goldenHtml = () => readFileSync(FIXTURE, 'utf8');

/** Candidates for every plate in a gallery page. `E` (loadEngine) supplies the specs; null for the reference plate. */
export async function candidatesOf(html, E, extra = {}) {
  const arts = articlesOf(html), out = [];
  for (const p of extractPlates(html)) {
    const sid = specIdOf(p.chromeId);
    out.push({ id: LIB_OF[p.chromeId], chromeId: p.chromeId, mode: 'approved', spec: sid ? await E.spec(sid) : null, plate: p, article: arts.get(p.chromeId),
      research: null, census: CENSUS_8[LIB_OF[p.chromeId]] ?? null, mistakeFault: null, derivation: null, exemptions: [], ...(extra[LIB_OF[p.chromeId]] ?? {}) });
  }
  return out;
}

/** H8 "exempt by name": each approved id -> the exact strings its golden plate ships. Read from the golden fixture. */
export function approvedStrings(html = goldenHtml()) {
  return new Map(extractPlates(html).map(p => [LIB_OF[p.chromeId], new Set(plateStrings(p).map(s => s.text))]));
}

/** The 8 ids (the only ids that may carry mode 'approved' and the exemptions in exemptions.json). */
export const APPROVED_IDS = Object.values(LIB_OF);

/** F6 input for the 8: their census view (docs/howto/library/inputs/census.json @ 48153c4, field `view`). */
export const CENSUS_8 = {
  lib_dumbbell_lateral_raise: { view: 'front' }, lib_barbell_back_squat: { view: 'side' }, lib_pull_up: { view: 'side' },
  lib_hanging_leg_raise: { view: 'side' }, lib_lat_pulldown: { view: 'side' }, lib_seated_cable_row: { view: 'side' },
  lib_leg_press: { view: 'side' }, lib_machine_chest_press: { view: 'side' },
};
