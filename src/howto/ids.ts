// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs, tools/plates/gen/plates.mjs). inputsSha256=d5e987a440c22961f3d982cf45309a41f98e7f34809d725f1f8ac95a3404991c
// The only How-to module in the main bundle (plan 2.9: <= 2,048 B, no runtime imports). LIB-1 prototype of #189 sec. 7.
import type { LibId } from './types';
export type HowToId = LibId & { readonly __howto: true };
export const HOWTO_LABEL = "How to do it";
const SET = "HC1kw-V4UFVjPE8vlz4LxkoA59uGUy2qDozesf7nTMdZjAeYBAB8UDcTYQruQuB1J5MP783DxEFlq3E_61u86CknAVK7BNi-ldzoglt9Wq6xEYzie5M-iP_L6JFRH7ZoC15yiw24_2926ILzCaZ9vcwBTp0LfH9rtdO0xbLfmAqwPWmSs3BGsJKWPL46pJh1KPxeop83Bhx00SsyicmQQpuCFsQpYE68E15h6bznQeqq42vI-iW6aJDYtDmCws7Mgp36RiutfqrHBDCVgYJGojTB5UCJpkic0wVw_nw9FDFDKazSAq8xb9PH6stjikudYBI1LbbN82J9wtHtzEXzx7N28R5XRMSg050xw-lBiy44o5PqaVqG7xU17N2uyR3NNtZ_8AuHTw3eZ8s5hbzQbqIQaBYI40UJei6ORmVwPL1ph7I5-PGM4OYiXnshgfpF0qksdm4x-cnXwqDWl-XS4JsgzrOa341ntiTCUzRSK6itR8GO14gPvF-qUP96zCRMvYpj2UnlSY_bVDuxZpYhafASqjg-BqmHQ7oIjBHLm6CzCCuZZzDLEf1eYeKlshEmIqGT96DF-rR8LeClsi0FaSK0xIkj-vDH-Fm-kr737yxMJiORrY07Pjr0flV0nuUM5vZgYASgt0FcohBVyIipYBYroZrokbwOPGoSBkOSz93leSMEoTEMCwUy93wj3dcPWNlnekk-nr2nnsiNZvvAR2kOGrpfNSneUIFQ0uhfFeU8HIBoE3mUTacHUGN35";
const B = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function h(s: string): string {
  let x = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; }
  x = ((x >>> 30) ^ x) & 0x3fffffff;
  let o = "";
  for (let i = 0; i < 5; i++) { o = B[x & 63] + o; x >>>= 6; }
  return o;
}
function at(id: string): number {
  if (!id.startsWith("lib_")) return -1;
  const k = h(id);
  for (let i = 0; i < SET.length; i += 5) if (SET.slice(i, i + 5) === k) return i / 5;
  return -1;
}
export function hasHowTo(id: string): id is HowToId { return at(id) >= 0; }
const HINTS = ["Heel of palm, wrist straight."];
const HINT_OF = "100000001000000010000000010000000100000001000000000010000000100000001000000010000000001000000010000000100000001000000001000000010000000100000001000000010";
export function howToHint(id: string): string | undefined { const i = at(id); const k = i < 0 ? 0 : +HINT_OF[i]!; return k ? HINTS[k - 1] : undefined; }
/** Kept for today's callers: a read-only view built from howToHint. */
export const HOWTO_HINTS: { readonly [id: string]: string | undefined } = new Proxy({}, { get: (_, id) => howToHint(String(id)) });
