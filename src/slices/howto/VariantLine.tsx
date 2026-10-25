// LIB-5v (D-LIB5-VARIANT 4, D-LIB5v-PLACE): the row's shown variant line (copy.variantLine), above the golden block.
// Nothing renders when the row has no line, so the 8's sheets are unchanged.
import type { BuiltHowTo } from '@/howto/types';

export function VariantLine({ howTo }: { readonly howTo: BuiltHowTo }) {
  const line = howTo.copy?.variantLine;
  return line ? <p class="ht-variant">{line}</p> : null;
}
