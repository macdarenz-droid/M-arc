// FG-1: the colour-literal lint the form-guide tests share (tests/theme.test.ts on src/formguide/**, figure.test.ts on
// the markup). Catches hex, every CSS colour function and named colours in paint attributes or properties.
const HEX = /#[0-9a-fA-F]{3,8}(?![\w-])/g;
const FN = /(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\(/gi;
// fill="white", stroke: red, stop-color='navy', style="color:red"; none, url(, var(, currentColor, transparent pass.
const NAMED = /(?<![\w-])(?:fill|stroke|stop-color|flood-color|lighting-color|color)\s*[:=]\s*["']?(?!(?:none|currentColor|transparent|inherit|url|var)(?![\w-]))[a-z]+(?![\w(-])/gi;

/** Every colour literal in src; hex: false skips hex (the markup carries resolved hex colours by design). */
export function colourLiterals(src: string, { hex = true } = {}): string[] {
  return [...(hex ? [HEX] : []), FN, NAMED].flatMap(re => [...src.matchAll(re)].map(m => m[0]));
}
