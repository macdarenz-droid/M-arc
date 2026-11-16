// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/ids.mjs). inputsSha256=881f43ad8ea01dc51c960fe3e10da53f3f9bf2dd3bde0f51f2a4a4549c8b1544
// Main-bundle How-to module (plan 2.9, 5.2): 4-char hashes of the shipped ids, hinted ids first.
export type HowToId = string & { readonly __howTo: true };
export const HOWTO_LABEL = "How to do it";
const S = "2eTgS?6[<MJce:>A9:EPNH10EhDkUMbGU]od`?G=;OVKR?oeeYPaW@NI22\\X@@[:2`_N8@HYhf\\Qc3;MRFiWnWZC5\\CX4jlLiQi]D28A3H^9CJNA`oWUR^_<XSB6ghfnAB;8]AoWEPK8JcA97j_Q536mlaHDin<=1T<2ML?Qmg`AmgW_Z3EF\\MVL<4Z3<2cCY5fgbhh:PdhW`nVck=d?K=o^m`\\?c4GNk=dIX8Pi<_KkfDV7IX2>95CobRa>1C[6e^l0__19W\\RZIom\\Il]VKcBhmjc=;Vh7j371Dl4E8Z4gZV5C^QOaeNI0JB8c_IRS[XT28TQ=b8RlnTXN1HXcPYedPcYPRC0kM>dLlD2L18f@U\\R=R>BQnLUT7CbKH@YoZg4JZSR^8hf>";
const H = ["Heel of palm, wrist straight.","Palm base, wrist not bent back.","Both hands round handle, palms up.","Wrist in line with the forearm.","Push through the palms.","Handle firm in palm, wrist neutral.","Palm heel, wrist not bent back.","Hands against the rope knobs."];
const O = "ABBCDEFFGHD";
function at(s: string): number {
  if (!s.startsWith('lib_')) return -1;
  let x = 0x811c9dc5, t = '';
  for (let i = 0; i < s.length; i++) x = Math.imul(x ^ s.charCodeAt(i), 0x01000193) >>> 0;
  for (x = (x ^ (x >>> 24)) & 0xffffff; t.length < 4; x >>= 6) t = String.fromCharCode(48 + (x & 63)) + t;
  for (let i = 0; i < S.length; i += 4) if (S.startsWith(t, i)) return i / 4;
  return -1;
}
export function hasHowTo(id: string): id is HowToId { return at(id) >= 0; }
export function howToHint(id: string): string | undefined { return H[O.charCodeAt(at(id)) - 65]; }
