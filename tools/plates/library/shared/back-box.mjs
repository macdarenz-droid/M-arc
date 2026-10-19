// LIB-5 (Do 4, D-LIB5-BOX, S4-P): the back-pain red-flag box, fail-closed until the owner answers decision 6 (plan 8
// item 6). It holds no box text and reads no research file, so no wording can reach src/ or the APK. library-gate.mjs
// calls refuseBack for every shipped row, and LIB-6-PM's page patch calls backBox() lazily (D-LIB5-PAGE). In Do 9
// backBox() keeps its name and signature and returns the answered box.
export const BACK_BOX_WAITS = 'LIB-5: back box waits for owner decision 6 (plan 8 item 6)';

/** The back box (a RedFlagBlock from Do 9). Throws until then. */
export function backBox() {
  throw new Error(BACK_BOX_WAITS);
}

/** Throws, naming the id, when a row's riskFlags link the back box. */
export function refuseBack(id, riskFlags) {
  if (Array.isArray(riskFlags) && riskFlags.includes('back')) throw new Error(`${id}: ${BACK_BOX_WAITS}`);
}
