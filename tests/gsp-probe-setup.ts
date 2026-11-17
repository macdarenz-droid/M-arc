// F-GEN-SPEED PLAN probe (copied from #437) (scratch branch only, never merged): one stderr line per test and per file start/end.
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
/* eslint-disable @typescript-eslint/no-explicit-any */
const say = (what: string, name: string) => process.stderr.write(`[gsp-probe] ${new Date().toISOString()} ${what} ${name}${process.env.MARC_TEST_CHILD === '1' ? ' (child)' : ''}\n`);
// vitest 3: every task's .file is its File (a File's .file is itself), and only a File has .filepath.
const full = (t: any): string => { const a: string[] = []; for (let s = t; s && !s.filepath; s = s.suite) a.unshift(s.name); return a.join(' > '); };
const fileOf = (t: any): string => String((t?.file ?? t)?.filepath ?? '?').replace(/^.*\/tests\//, 'tests/');
beforeAll((s: any) => say('filestart', fileOf(s)));
afterAll((s: any) => say('fileend', fileOf(s)));
beforeEach((c: any) => say('start', `${fileOf(c.task)} > ${full(c.task)}`));
afterEach((c: any) => say('end', `${fileOf(c.task)} > ${full(c.task)}`));
