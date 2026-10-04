// LIB-2 (design 6.1): body fingerprints of generated files. A generated file's identity, apart from the two lines that
// carry input hashes (the GENERATED header and an `ht-*.ts` module's `hashes:` line), so the 8's content can be pinned
// while their inputs move. Committed in tests/howto/fixtures/generated-bodies.json; checked by library-core.test.ts.
import { createHash } from 'node:crypto';

const HEADER = /^(?:\/\/|\/\*) GENERATED, do not edit\.[^\n]*\n/;
const HASHES = /^ *hashes: \{ inputsSha256: "[0-9a-f]{64}", golden: "[0-9a-f]{64}" \},\n/m;

/** The file text without its header line and without the `hashes:` line (when present). */
export const body = text => text.replace(HEADER, '').replace(HASHES, '');
/** sha256 of body(text). */
export const bodySha = text => createHash('sha256').update(body(text)).digest('hex');
/** The generated files LIB-2 rewrites or adds (design 6.1): not fingerprinted, proven by their own tests. */
export const REWRITTEN = ['src/howto/ids.ts', 'src/howto/generated/index.ts'];
