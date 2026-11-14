import { execFileSync } from 'node:child_process';

/** A synchronous block of the worker's event loop for `s` seconds. */
export const block = (s: number) => { execFileSync('sleep', [String(s)]); };
