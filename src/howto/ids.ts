// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/ids.mjs). inputsSha256=29e81099b0ca123059bfdb09465cbfdd66ced7c7371cc434f25e187554333ae8
// Main-bundle How-to module (plan 2.9: <= 2,048 B, no imports). SET: hashes of the shipped ids (plan 5.2).
export type HowToId = string & { readonly __howTo: true };
export const HOWTO_LABEL = "How to do it";
const SET = "-iP_LL1ph7znQeqzCCuZmQQpumCws7qIQaBHC1kw";
const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function h(s: string): string {
  let x = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) x = Math.imul(x ^ s.charCodeAt(i), 0x01000193) >>> 0;
  x = (x ^ (x >>> 30)) & 0x3fffffff;
  let o = '';
  for (let k = 0; k < 5; k++) { o = A[x & 63] + o; x >>>= 6; }
  return o;
}
export function hasHowTo(id: string): id is HowToId {
  if (!id.startsWith('lib_')) return false;
  const t = h(id);
  for (let i = 0; i < SET.length; i += 5) if (SET.startsWith(t, i)) return true;
  return false;
}
export const HOWTO_HINTS: Readonly<Record<string, string>> = {
  "lib_machine_chest_press": "Heel of palm, wrist straight.",
};
