// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/ids.mjs). inputsSha256=642e460d1d2731f89562f260225b16c3b6dcf9d35d93696064dac78bdd8b3c9a
// Node twin of src/howto/ids.ts (tests and the gate's harness): the same SET literal and hash template, emitted
// together by tools/plates/gen/ids.mjs.
const SET = "-iP_LL1ph7znQeqzCCuZmQQpumCws7qIQaBHC1kw";
const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function h(s) {
  let x = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) x = Math.imul(x ^ s.charCodeAt(i), 0x01000193) >>> 0;
  x = (x ^ (x >>> 30)) & 0x3fffffff;
  let o = '';
  for (let k = 0; k < 5; k++) { o = A[x & 63] + o; x >>>= 6; }
  return o;
}
export function hasHowTo(id) {
  if (!id.startsWith('lib_')) return false;
  const t = h(id);
  for (let i = 0; i < SET.length; i += 5) if (SET.startsWith(t, i)) return true;
  return false;
}
