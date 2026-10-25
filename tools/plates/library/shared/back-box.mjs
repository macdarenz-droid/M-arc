// LIB-5 (Do 9, D-LIB5-BOX, D-LIB5-BACKBOX): the back-pain red-flag box, as the owner answered decision 6 (option 1,
// #244 6250331645): the owner-approved shared/back-pain-box.json, S1-pinned at research 0393aac9. The module holds no
// box text: backBox() reads the card's three lines and its boxClaim, so the words exist only in the research card.
// library-gate.mjs writes the block as src/howto/red-flag-back.ts (RED_FLAG_BACK), and LIB-6-PM's page patch calls
// backBox() lazily (D-LIB5-PAGE). The box is held to BOX-CAP's named 50-word limit for this key only.
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../../../..', import.meta.url)));
export const BACK_CARD = 'docs/research/howto/shared/back-pain-box.json';
/** The box's shared-card key, which BOX-CAP's boxCapOf looks up (D-BOXCAP-WIRE). */
export const BACK_BOX_KEY = 'back-pain-box';

/** The back box as a RedFlagBlock: { name, now, doctor, claim } from the card's box (words and wordCap are data). */
export function backBox(root = ROOT) {
  const card = JSON.parse(readFileSync(join(root, BACK_CARD), 'utf8')), b = card.box ?? {};
  if (card.key !== BACK_BOX_KEY) throw new Error(`back-box: ${BACK_CARD} has key ${JSON.stringify(card.key)}`);
  if (card.status === 'draft') throw new Error(`back-box: ${BACK_CARD} is still a draft`);
  for (const f of ['name', 'now', 'doctor']) if (typeof b[f]?.text !== 'string' || !b[f].text) throw new Error(`back-box: ${BACK_CARD} has no box.${f}.text`);
  if (!Array.isArray(b.boxClaim?.tags) || !Array.isArray(b.boxClaim?.sources)) throw new Error(`back-box: ${BACK_CARD} has no box.boxClaim`);
  return { name: b.name.text, now: b.now.text, doctor: b.doctor.text, claim: { tags: [...b.boxClaim.tags], sources: [...b.boxClaim.sources] } };
}
