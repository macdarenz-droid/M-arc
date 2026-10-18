// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/ids.mjs). inputsSha256=cca3e722be901417c5854cd5eb27eb865324f32cfeb202d30607a018d42ca14c
// Node twin of src/howto/ids.ts (tests and the gate's harness): the same literals and decoder template, emitted
// together by tools/plates/gen/ids.mjs (D-LIB2-hints).
const S = "2eTgUchT\\OkiR?oeeYPaW@NI22\\X@@[:2`_N8@HYPYed[73[EPK8XSB6";
const H = ["Heel of palm, wrist straight."];
const O = "AAA";
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
