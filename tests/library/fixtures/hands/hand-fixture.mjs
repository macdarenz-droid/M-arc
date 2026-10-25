// LIB-7 test fixture (tests/library/hand-pairs.test.ts, inputsFor failure path): a key file with one planted import,
// whose own re-export reaches one more file, so importClosure must follow both the import and the re-export.
import { EXTRA } from './extra.mjs';

export const KEY = 'fixture', OWNER = 'LIB-7', VIEW = 'radial', USES = EXTRA;
