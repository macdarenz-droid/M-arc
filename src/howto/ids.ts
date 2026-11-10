// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/ids.mjs). inputsSha256=439a056a4a013f3dd9d974b2210605aef6232b7fc1c452a52ca2bdd90531a7f4
// Main-bundle How-to module (plan 2.9, 5.2): 4-char hashes of the shipped ids, hinted ids first.
export type HowToId = string & { readonly __howTo: true };
export const HOWTO_LABEL = "How to do it";
const S = "2eTgEhDkUMbGU]od`?G=;OVKR?oeeYPaW@NI22\\X@@[:2`_N8@HYhf\\Qc3;MRFiWnWZC5\\CXiQi]D28A3H^9CJNAR^_<XSB6EPK8JcA97j_QlaHDin<=1T<2<4Z3<2cCbhh:k=d?K=o^m`\\?c4GNk=dIX8PiIX2>95CobRa>1C[6e^l0W\\RZIom\\Il]VKcBhmjc=;Vh7j371Dl4EZV5C^QOaeNI0JB8c_IRS[XT28TQ=b8RlnTXNPYedPcYPRC0kM>dLlD2L18f@U\\R=nLUT7CbKH@YoZg4JZSR^8hf>";
const H = ["Heel of palm, wrist straight.","Handle firm in palm, wrist neutral.","Palm heel, wrist not bent back.","Hands against the rope knobs.","Wrist in line with the forearm."];
const O = "ABBCDE";
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
