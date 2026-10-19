// LIB-5 (D-LIB5-FIXTURE): E1's tree (lib2b/fixture.mjs fixtureTree, unchanged) built in a child Node process. The
// builder is synchronous (spawnSync page builds and scratch stamps); run here it never blocks the vitest worker.
import { spawn } from 'node:child_process';

const FIXTURE = new URL('../lib2b/fixture.mjs', import.meta.url).href;

/** Resolves the root of a fresh E1 tree (the caller removes it). */
export function fixtureTreeAsync() {
  const code = `const F = await import(${JSON.stringify(FIXTURE)}); console.log('@@' + F.fixtureTree());`;
  return new Promise((resolve, reject) => {
    const c = spawn(process.execPath, ['--input-type=module', '-e', code]);
    let out = '';
    c.stdout.on('data', d => { out += d; }); c.stderr.on('data', d => { out += d; });
    c.on('close', k => {
      const line = out.split('\n').find(l => l.startsWith('@@'));
      if (k === 0 && line) resolve(line.slice(2)); else reject(new Error(`lib5 tree: fixtureTree failed (${k}):\n${out}`));
    });
  });
}
