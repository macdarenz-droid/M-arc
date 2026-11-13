// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/ids.mjs). inputsSha256=493d64227f0d9a13563bc909fcdc6ecac09c0d26364849c0c89b907f9476a125
// Node twin of src/howto/ids.ts (tests and the gate's harness): the same literals and decoder template, emitted
// together by tools/plates/gen/ids.mjs (D-LIB2-hints).
const S = "2eTgEhDkUMbGU]od`?G=;OVKR?oeeYPaW@NI22\\X@@[:2`_N8@HYhf\\Qc3;MnWZC5\\CXiQi]D28A3H^9CJNAR^_<XSB6EPK8JcA97j_QlaHDin<=1T<2<4Z3<2cCbhh:k=d?K=o^m`\\?c4GNk=dIX8PiIX2>95CobRa>1C[6e^l0W\\RZIom\\Il]VKcBhmjc=;Vh7j371Dl4EZV5C^QOaeNI0JB8c_IRS[XT28TQ=b8RlnTXNPYedPcYPRC0kM>dLlD2L18f@U\\R=nLUTH@YoZg4JZSR^8hf>";
const H = ["Heel of palm, wrist straight.","Handle firm in palm, wrist neutral.","Palm heel, wrist not bent back.","Hands against the rope knobs.","Wrist in line with the forearm."];
const O = "ABBCDE";
function at(s) {
  if (!s.startsWith('lib_')) return -1;
  let x = 0x811c9dc5, t = '';
  for (let i = 0; i < s.length; i++) x = Math.imul(x ^ s.charCodeAt(i), 0x01000193) >>> 0;
  for (x = (x ^ (x >>> 24)) & 0xffffff; t.length < 4; x >>= 6) t = String.fromCharCode(48 + (x & 63)) + t;
  for (let i = 0; i < S.length; i += 4) if (S.startsWith(t, i)) return i / 4;
  return -1;
}
export function hasHowTo(id) { return at(id) >= 0; }
export function howToHint(id) { return H[O.charCodeAt(at(id)) - 65]; }
