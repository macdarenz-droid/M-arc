// F-ZOOM-NONE (card docs/supervisor/verify/f-zoom-none-card.md): a library sheet with no drawn posture close-up.
// A3 baseline: the body (after the GENERATED header line, whose inputsSha256 moves with the generators) of every
// posture chunk and of loaders.ts stays byte-equal to main cb9a6dae for every row that has posture zooms.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const GEN = join(__dirname, '../../src/howto/generated');
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const body = (n: string) => { const t = readFileSync(join(GEN, n), 'utf8'); return t.slice(t.indexOf('\n') + 1); };

// sha256 of each body on main cb9a6dae
const BODY_MAIN: Record<string, string> = {
  'loaders.ts': '00a18e3c3dd9f50f3b0ef5e145f3668de51fefd860c950062c5422d7fa6a8d3b',
  'posture-barbell-back-squat.ts': '8bdf3354ed3ce298e8bad7bb350da8b43d95518b760d9d5ffc70861ce94f49ff',
  'posture-dumbbell-biceps-curl.ts': 'af709c0ebf1007fc9be41bc7d103f1a63a3155d27dbc4d242274605f57f80dfb',
  'posture-hanging-leg-raise.ts': '3e110802371f1eb33bdc0d9f0d81351d14f06989988061a3546c5c2ee9490770',
  'posture-lat-pulldown.ts': 'e18443a93706e3b113f7fa396fab4280be8463751bd99d2df1dae0f6cdfe9b7a',
  'posture-lateral-raise.ts': 'bc056d612aa8708123f998b212080a210fe685faa217ebe477890d8705d238fe',
  'posture-leg-press.ts': '0a3042da1d567d8dc235efddc6403927a9df8cfc15785959446112452e640ead',
  'posture-machine-chest-press.ts': '3eea3f10928dd4746134bcdf4649cbcc24307ae2510a9f127634df01a6bcb396',
  'posture-pull-up.ts': 'fe028fcb5a6e5a15442fc550e00943d9e9532685b02497b4f4a02a9394e40989',
  'posture-seated-cable-row.ts': '2007a1077ddab305d1c64494196cac0e6a388766834eb077a5207e7f6fe93d3a',
};

describe('F-ZOOM-NONE A3: rows with posture zooms generate what they generate on main', () => {
  it('every posture chunk and loaders.ts body is byte-equal to main', () => {
    const now = readdirSync(GEN).filter(n => /^posture-.*\.ts$|^loaders\.ts$/.test(n)).sort();
    expect(now).toEqual(Object.keys(BODY_MAIN).sort());
    for (const [n, want] of Object.entries(BODY_MAIN)) expect([n, sha(body(n))]).toEqual([n, want]);
  });
});
