// F-GENCHECK-SHARE PLAN probe (scratch branch only, never merged): one stderr line per test and per file start/end.
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
/* eslint-disable @typescript-eslint/no-explicit-any */
const say = (what: string, name: string) => process.stderr.write(`[gcs-probe] ${new Date().toISOString()} ${what} ${name}${process.env.MARC_TEST_CHILD === '1' ? ' (child)' : ''}\n`);
const full = (t: any): string => { const a: string[] = []; for (let s = t; s && s.type !== 'file' && s.name !== undefined; s = s.suite) a.unshift(s.name); return a.join(' > '); };
const fileOf = (t: any): string => { let f = t; while (f && f.type !== 'file') f = f.suite ?? f.file; return (f?.filepath ?? f?.name ?? '?').replace(/^.*\/tests\//, 'tests/'); };
beforeAll((s: any) => say('filestart', fileOf(s)));
afterAll((s: any) => say('fileend', fileOf(s)));
beforeEach((c: any) => say('start', `${fileOf(c.task)} > ${full(c.task)}`));
afterEach((c: any) => say('end', `${fileOf(c.task)} > ${full(c.task)}`));
