// LIB-4d (D-LIB4d-READ): a shipped ht-<slug>.ts read from its text, not through vite's transform, so a test that reads
// every shipped module stays fast at 153 ids. Only the generator's exact shape is accepted; anything else throws.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { BuiltHowTo } from '../../src/howto/types';

const HEADER = /^\/\/ GENERATED, do not edit\. Written by tools\/plates\/generate\.mjs \([^)]+\)\. inputsSha256=[0-9a-f]{64}\n/;
const HEAD = "import type { BuiltHowTo } from '../types';\n\nexport default {", TAIL = '} satisfies BuiltHowTo;\n';

/** The default export of src/howto/generated/ht-<slug>.ts under `root`. */
export function readHowTo(slug: string, root = '.'): BuiltHowTo {
  const path = join(root, `src/howto/generated/ht-${slug}.ts`), text = readFileSync(path, 'utf8');
  const h = text.match(HEADER);
  if (!h) throw new Error(`${path}: no GENERATED header`);
  const body = text.slice(h[0].length);
  if (!body.startsWith(HEAD) || !body.endsWith(TAIL)) throw new Error(`${path}: not the generated module shape`);
  const literal = body.slice(HEAD.length, -TAIL.length);
  if (/\n(import|export)\b/.test(literal)) throw new Error(`${path}: an import or export line inside the literal`);
  // eslint-disable-next-line no-new-func
  return new Function(`return {${literal}};`)() as BuiltHowTo;
}
