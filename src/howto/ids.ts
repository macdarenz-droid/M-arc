// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/ids.mjs). inputsSha256=68562d6881febae87af2ddc8a04f1ec9c30365a6d9fc739c47f76263e1034576
// Main-bundle How-to module (plan 2.9, 5.2): 4-char hashes of the shipped ids, hinted ids first.
export type HowToId = string & { readonly __howTo: true };
export const HOWTO_LABEL = "How to do it";
const S = "2eTgR?oeeYPaW@NI22\\X@@[:2`_N8@HYEhDkS?6[UchTTX2:^6E>Z3X5\\Oki<MJcNH10lD2LH@Yo^1dH<?i73a7aZg4Je^l0TW3Dk1>[UMbGU]odja7aRNhn95CoIX2>bRa>ofn=8;biIm]41C[6O7mPM>dL;OVK`?G=\\g0E9:EPhjZ1e:>AXYn[Qaed\\bQ=5\\CX4jlLiQi]hf\\QRFiW3H^9PYedR^_<[73[EPK8XSB6D28ARLfF`oWU536mJcA9laHD7j_QRT_o18f@K=o^m`\\?c4GNk=d?iGCOPdhW`nVcbhh:?ZI_6k`ok=dIAg?mIom\\7CbKIl]VKcBh8hf>NRi4VEaOin<=h>K]W\\RdY5fg\\MVLnLUTZ3EFGBhgPcYPghfnRC0kAB;8]AoWehR35nXimjc=<_KkfDV7HoI5^aKXQJNIZSR^ZV5CX8Pi;Vh7c3;MeNI0U\\R=8Z4gj371Al;eU\\QeJB8c8TQ=37lXnTXNkbakR>BQdk<hdOVmW^Fj_IRSBP^gLXQ4b8Rl1HXc[XT2>?7I1T<2mgW_<4Z3<2cCmg`AML?QUWMZnWZCW\\RZ__19T>6MO=C?D84?^QOaDl4EX4eUCJNA6=g]";
const H = ["Heel of palm, wrist straight."];
const O = "A";
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
