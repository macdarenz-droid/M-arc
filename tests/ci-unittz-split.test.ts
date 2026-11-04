// D-SUP-CI-TZSPLIT (supervisor, 11-04): the unit-tz job runs test:tz's zones as parallel matrix legs.
// This pins that the legs cover exactly the zones package.json's test:tz runs, so no zone can be dropped.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const yml = readFileSync('.github/workflows/build-apk.yml', 'utf8');
const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> };

function zonesOfTestTz(script: string): string[] {
  return [...script.matchAll(/TZ=([A-Za-z_]+\/[A-Za-z_]+) vitest run/g)].map(m => m[1]!).sort();
}
function unitTzJob(text: string): string {
  const start = text.indexOf('\n  unit-tz:\n');
  expect(start, 'job unit-tz exists').toBeGreaterThan(-1);
  const rest = text.slice(start + 1);
  const next = rest.slice(1).search(/\n  [a-z0-9-]+:\n/);
  return next === -1 ? rest : rest.slice(0, next + 1);
}
function matrixZones(job: string): string[] {
  const m = job.match(/tz: \[([^\]]+)\]/);
  expect(m, 'unit-tz has a tz matrix').not.toBeNull();
  return m![1]!.split(',').map(s => s.trim()).sort();
}

describe('D-SUP-CI-TZSPLIT', () => {
  it('the unit-tz matrix runs exactly the zones of test:tz, each with plain vitest run under TZ', () => {
    const zones = zonesOfTestTz(pkg.scripts['test:tz']!);
    expect(zones).toEqual(['America/New_York', 'Asia/Manila']);
    const job = unitTzJob(yml);
    expect(matrixZones(job)).toEqual(zones);
    expect(job).toContain('run: npx vitest run');
    expect(job).toContain('TZ: ${{ matrix.tz }}');
    expect(job).toContain('fail-fast: false');
  });
  it('android-gate still needs unit-tz', () => {
    const gate = yml.slice(yml.indexOf('\n  android-gate:\n'));
    expect(gate.split('\n').find(l => l.includes('needs:'))).toContain('unit-tz');
  });
  it('mutation: a matrix missing one zone is red', () => {
    const bad = yml.replace('tz: [America/New_York, Asia/Manila]', 'tz: [America/New_York]');
    expect(matrixZones(unitTzJob(bad))).not.toEqual(zonesOfTestTz(pkg.scripts['test:tz']!));
  });
});
