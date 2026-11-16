// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/ids.mjs). inputsSha256=3ecb04080c81e5577f8da92f4382baeb9e51565e04cfbb5b946440c082117b29
// Node twin of src/howto/ids.ts (tests and the gate's harness): the same literals and decoder template, emitted
// together by tools/plates/gen/ids.mjs (D-LIB2-hints).
const S = "2eTgS?6[e:>A9:EPNH10EhDkUMbGU]od`?G=;OVKR?oeeYPaW@NI22\\X@@[:2`_N8@HYhf\\Qc3;MRFiWnWZC5\\CX4jlLiQi]D28A3H^9CJNA`oWUR^_<XSB6ghfnAB;8]AoWEPK8JcA97j_Q536mlaHDin<=1T<2ML?Qmg`AmgW_Z3EF\\MVL<4Z3<2cCY5fgbhh:PdhW`nVck=d?K=o^m`\\?c4GNk=dIX8Pi<_KkfDV7IX2>95CobRa>1C[6e^l0__19W\\RZIom\\Il]VKcBhmjc=;Vh7j371Dl4E8Z4gZV5C^QOaeNI0JB8c_IRS[XT28TQ=b8RlnTXN1HXcPYedPcYPRC0kM>dLlD2L18f@U\\R=R>BQnLUT7CbKH@YoZg4JZSR^8hf>";
const H = ["Heel of palm, wrist straight.","Palm base, wrist not bent back.","Both hands round handle, palms up.","Wrist in line with the forearm.","Push through the palms.","Handle firm in palm, wrist neutral.","Palm heel, wrist not bent back.","Hands against the rope knobs."];
const O = "ABCDEFFGHD";
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
