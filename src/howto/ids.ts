// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/ids.mjs). inputsSha256=768e3498b2053e3d745a4b44b531d09b3b8c80072994381876070b778a806aa4
// Main-bundle How-to module (plan 2.9, 5.2): 4-char hashes of the shipped ids, hinted ids first.
export type HowToId = string & { readonly __howTo: true };
export const HOWTO_LABEL = "How to do it";
const S = "2eTge:>A9:EPEhDkUMbGU]od`?G=;OVKR?oeeYPaW@NI22\\X@@[:2`_N8@HYhf\\Qc3;MnWZC5\\CXiQi]D28A3H^9CJNA`oWUR^_<XSB6ghfnEPK8JcA97j_QlaHDin<=1T<2ML?Qmg`AZ3EF\\MVL<4Z3<2cCbhh:`nVck=d?K=o^m`\\?c4GNk=dIX8PiIX2>95CobRa>1C[6e^l0W\\RZIom\\Il]VKcBhmjc=;Vh7j371Dl4EZV5C^QOaeNI0JB8c_IRS[XT28TQ=b8RlnTXNPYedPcYPRC0kM>dLlD2L18f@U\\R=nLUTH@YoZg4JZSR^8hf>";
const H = ["Heel of palm, wrist straight.","Both hands round handle, palms up.","Wrist in line with the forearm.","Handle firm in palm, wrist neutral.","Palm heel, wrist not bent back.","Hands against the rope knobs."];
const O = "ABCDDEFC";
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
