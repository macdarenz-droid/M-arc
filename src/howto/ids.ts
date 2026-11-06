// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/ids.mjs). inputsSha256=4fe9716224a6d997b70268bb13b131a82887e032320a0c6d18388c34bca702c7
// Main-bundle How-to module (plan 2.9, 5.2): 4-char hashes of the shipped ids, hinted ids first.
export type HowToId = string & { readonly __howTo: true };
export const HOWTO_LABEL = "How to do it";
const S = "2eTgEhDkUMbG`?G=R?oeeYPaW@NI22\\X@@[:2`_N8@HYhf\\Qc3;MnWZC5\\CXiQi]D28A3H^9CJNAR^_<XSB6EPK8JcA97j_QlaHDPYedM>dL18f@U\\R=H@YoZg4J8hf>";
const H = ["Heel of palm, wrist straight.","Handle firm in palm, wrist neutral.","Hands against the rope knobs."];
const O = "ABBC";
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
