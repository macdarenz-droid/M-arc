// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/ids.mjs). inputsSha256=2ff1e5d822cd77a82065f088fcbd9e2d723ccb864f2275796708358d94729d30
// Node twin of src/howto/ids.ts (tests and the gate's harness): the same literals and decoder template, emitted
// together by tools/plates/gen/ids.mjs (D-LIB2-hints).
const S = "2eTgEhDkUMbG`?G=R?oeeYPaW@NI22\\X@@[:2`_N8@HYhf\\Qc3;MnWZC5\\CXiQi]D28A3H^9CJNAPYedM>dL18f@U\\R=H@YoZg4J8hf>";
const H = ["Heel of palm, wrist straight.","Handle firm in palm, wrist neutral.","Hands against the rope knobs."];
const O = "ABBC";
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
