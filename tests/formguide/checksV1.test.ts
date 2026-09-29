// V1-07: the add-only checks (docs/FORM-GUIDE-PRODUCTION.md §10.5 V1-07; readings in docs/COACHING-DECISIONS.md D-V1-07).
import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { ALL_CHECKS, CHECKS, CHECKS_V1, LIMITS, runChecks, type CheckId } from '@/formguide/check';
import { guideOf, inputFor } from '@/formguide/check/node';
import { rigFor, type Rig } from '@/formguide/check/view';
import { bbox, compile } from '@/formguide/check/svg';
import { fastBox, heldIn, textAsBoxes } from '@/formguide/check/framing';
import { researchMismatches } from '@/formguide/check/research';
import { contactsHeld } from '@/formguide/check/contacts';
import { dumbbell, dumbbellFar, dumbbellNear } from '@/formguide/parts/dumbbell';
import { themeReader } from '@/formguide/rig/paint';
import { CHANNELS, type ChannelId } from '@/formguide/rig/joints';
import { poseAt } from '@/formguide/sample';
import type { ExerciseGuide, Research } from '@/formguide/model';
import { lib_dumbbell_lateral_raise as LR } from '@/formguide/exercises/lib_dumbbell_lateral_raise';
import { lib_smith_machine_shoulder_press as SMITH } from './fixtures/solve/lib_smith_machine_shoulder_press';

const EX = 'src/formguide/exercises', FILE = `${EX}/lib_dumbbell_lateral_raise.ts`;
const research = JSON.parse(readFileSync('src/formguide/research/lib_dumbbell_lateral_raise.json', 'utf8')) as Research;
/** The lateral raise's input with another guide (and optional held-part drawings) in its place. */
const on = (g: ExerciseGuide, only: CheckId[], parts?: Record<string, string>) => runChecks({ ...inputFor(FILE, g), ...(parts ? { parts } : {}) }, only);
const one = (g: ExerciseGuide, c: CheckId, parts?: Record<string, string>) => on(g, [c], parts)[0]!;

describe('the lists', () => {
  it('CHECKS stays the 20; V1-07 adds 7 in their own list, and LIMITS is unchanged (A5)', () => {
    expect(CHECKS.length).toBe(20);
    expect([...CHECKS_V1]).toEqual(['contactsHeld', 'matchesResearch', 'framing', 'contrast', 'balance', 'targetDrawn', 'travelRange']);
    expect([...ALL_CHECKS]).toEqual([...CHECKS, ...CHECKS_V1]);
    // FG-3's §5 limits, as merged before V1-07
    expect(LIMITS).toEqual({
      jointSamples: 480, tellDeg: 5, tellShare: 0.2, tells: 2, speedDiff: 0.15, gap: 0.5, padDrift: 0.01, pivot: 0.05,
      land: 0.5, peakAt: 0.1, effortStep: 0.02, quiet: 0.2, sway: [0.2, 1.5], bladeAbove: 30,
      figurePaths: 260, machinePaths: 80, partPaths: 25, fileGzip: 2 * 1024, chunkGzip: 150 * 1024, repS: [3, 5],
    });
  });
});

describe('framing', () => {
  it('fastBox is svg.ts bbox, on every 1/48 of the lateral raise and its mistake', () => {
    const rig = rigFor(LR, 'front') as Rig;
    for (const m of [false, true]) {
      const c = compile(textAsBoxes(rig.markup(themeReader('paper'), m)));
      for (let i = 0; i <= 48; i++) {
        const f = rig.frame(poseAt(LR, i / 48, m ? 'mistake' : 'correct')), a = bbox(c, f), b = fastBox(c, f);
        for (const k of ['x0', 'y0', 'x1', 'y1'] as const) expect(Math.abs(a[k] - b[k]), `${k} at ${i}/48`).toBeLessThan(1e-3);
      }
    }
  });
  it('a held part put in the hand groups lands where the figure draws its own: the 7 kg library dumbbell keeps 3.48 units', () => {
    const rig = rigFor(LR, 'front') as Rig, read = themeReader('silent-black');
    expect(() => heldIn('<g/>', 'x')).toThrow(/0 of 4 hand part groups/);
    expect(one(LR, 'framing', { dumbbell: dumbbell({ g: 'fgc-i', kg: 7 }).svg }).note).toBe(one(LR, 'framing').note);
    expect(heldIn(rig.markup(read, false), '<g id="held"/>').match(/id="held"/g)).toHaveLength(2);
  });
  it('A2: the 12 kg head that pushed the mistake to x = -90.6 (D-FG5) fails framing, naming the side and the numbers', () => {
    const r = one(LR, 'framing', { dumbbell: dumbbell({ g: 'fgc-i', kg: 12 }).svg });
    console.info(`[V1-07] A2: ${r.fails[0]}`);
    expect(r.ok).toBe(false);
    expect(r.fails[0]).toMatch(/^framing lib_dumbbell_lateral_raise: mistake: left margin -2\.58 units < 1 in standingFront \[-88 -6 576 600\] at u=[\d.]+ \([\d.]+ s, mistake\)$/);
    expect(one(LR, 'framing').ok).toBe(true);
  });
  it('the widest label is measured as a box: a label too wide for the frame fails', () => {
    const wide = `${dumbbellFar('fgc-i')}${dumbbellNear('fgc-i')}<text x="0" y="0" text-anchor="middle" font-size="10">${'8'.repeat(20)}</text>`;
    expect(one(LR, 'framing', { dumbbell: wide }).fails.join()).toMatch(/margin -?[\d.]+ units < 1/);
  });
});

describe('contrast', () => {
  it('A3: the PR #58 "20 KG" label, ink under the head (off the iron), fails on the page in Silent Black', () => {
    // FG-5 before review commit c24c1b5: the load label below the dumbbell, `${kg} KG` at y = h/2 + 12 (h = 34.6 × ∛(20/7))
    const pr58 = `<g class="fg-part fg-part-dumbbell">${dumbbellFar('fgc-i')}${dumbbellNear('fgc-i')}<text x="0" y="36.53" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="800" font-size="10" fill="var(--ink)" opacity=".75">20 KG</text></g>`;
    const r = one(LR, 'contrast', { dumbbell: pr58 });
    const line = r.fails.find(m => /silent-black part dumbbell: text "20 KG" [\d.]+:1 < 4.5:1 on the stage/.test(m));
    console.info(`[V1-07] A3: ${line}`);
    expect(line).toBeDefined();
    expect(+/"20 KG" ([\d.]+):1/.exec(line!)![1]!).toBeLessThan(1.5);
  });
});

describe('contrast: guides (angle arc, tag, path trace) are marks against the stage', () => {
  it('a --guide stroke is read against the page at its opacity; a faint one fails, a solid one passes in Silent Black', async () => {
    const { paintedShapes, guideContrast, isGuide, parseColour } = await import('@/formguide/check/contrast');
    const read = themeReader('silent-black'), page = parseColour('#0f1011')!;
    const [faint, solid, other] = paintedShapes('<g><path class="fg-guide" d="M0 0 L10 0" fill="none" stroke="var(--guide)" opacity=".2"/><path d="M0 0 L10 0" fill="none" stroke="var(--guide)"/><path d="M0 0 L10 0 L0 10 Z" fill="var(--ink)"/></g>', read);
    expect([isGuide(faint!), isGuide(solid!), isGuide(other!)]).toEqual([true, true, false]);
    expect(guideContrast(faint!, page)).toBeLessThan(3);
    expect(guideContrast(solid!, page)).toBeGreaterThanOrEqual(3);
  });
});

describe('matchesResearch', () => {
  it('the lateral raise matches its research.json', () => {
    expect(researchMismatches(LR, research)).toEqual([]);
  });
  it('tempo, kind, order, muscles, tells and cues each fail with their numbers', () => {
    const m = (g: object) => researchMismatches({ ...LR, ...g } as ExerciseGuide, research);
    expect(m({ tempo: { ...LR.tempo, lift: 1.2 } })).toEqual(['tempo lift = 1.2 s, research.json gives 1 s']);
    expect(m({ kind: 'hold' })).toEqual(['kind hold, research.json gives rep']);
    expect(m({ order: 'lower_first' })).toEqual(['order lower_first, research.json gives lift_first']);
    expect(m({ muscles: { ...LR.muscles, helps: [] } })).toEqual(['muscles.helps none (0), research.json gives front_delts (1)']);
    expect(m({ muscles: { ...LR.muscles, target: ['front_delts', 'side_delts'] } })).toEqual(['muscles.target front_delts, side_delts (2), research.json gives side_delts (1)']);
    expect(m({ mistake: { ...LR.mistake, tells: LR.mistake.tells.slice(1) } })).toEqual(['research.json tell "knee_flex: The knees dip to swing it up." is missing from the file (2 tells here)']);
    expect(m({ cues: [...LR.cues, 'One more.'] })).toEqual(['4 cues > 3']);
    expect(m({ cues: ['x'.repeat(61)] })).toEqual(['cue 1 has 61 characters > 60']);
    expect(m({ cues: ['x'.repeat(60)] })).toEqual([]);
  });
  it('a file without research.json fails', () => {
    expect(runChecks({ ...inputFor(FILE, LR), research: null }, ['matchesResearch'])[0]!.fails).toEqual(['matchesResearch lib_dumbbell_lateral_raise: no research.json to match']);
  });
});

describe('targetDrawn', () => {
  it('A4: a front file targeting lats fails targetDrawn (the front figure tints side_delts, front_delts, upper_traps) while targetVisible passes', () => {
    const g = { ...LR, muscles: { ...LR.muscles, target: ['side_delts', 'lats'] } } as ExerciseGuide;
    const [tv, td] = on(g, ['targetVisible', 'targetDrawn']);
    expect(tv!.ok).toBe(true);
    expect(td!.fails[0]).toBe('targetDrawn lib_dumbbell_lateral_raise: correct front figure draws no fg-t- tint for lats (1 of 2 targets; it tints front_delts, side_delts, upper_traps)');
  });
});

describe('contactsHeld', () => {
  const smithIn = () => inputFor('tests/formguide/fixtures/solve/lib_smith_machine_shoulder_press.ts', SMITH);
  it('the V1-04 press holds its two contacts on the drawn frame', () => {
    const r = runChecks(smithIn(), ['contactsHeld'])[0]!;
    console.info(`[V1-07] contactsHeld on the V1-04 press: ${r.note}`);
    expect(r.ok).toBe(true);
    expect(r.note).toMatch(/^2 held, worst [\d.e-]+ units$/);
  });
  it('a hand drawn 1 unit off the point the solver held fails, naming the contact, the gap and where', () => {
    const inp = smithIn(), machine = inp.machines!.fx_press!, base = { ...(rigFor(SMITH, 'front') as Rig), machine };
    const shifted: Rig = { ...base, point: (f, a) => { const p = base.point(f, a); return a === 'hand_r' ? [p[0] + 1, p[1]] : p; } };
    const pass = [{ fig: 'correct' as const, rep: 0, T: 4, L: 'rep 0' }], where = (u: number, p: { L: string }) => `u=${u} (${p.L})`;
    // the solve runs on the true rig; the check reads the points on the drawn (shifted) one
    expect(contactsHeld(SMITH, base, machine, pass, 48, LIMITS.gap, where).fails).toEqual([]);
    const r = contactsHeld(SMITH, base, machine, pass, 48, LIMITS.gap, where, shifted);
    expect(r.fails[0]).toMatch(/^contact hand_r on bar_r is 1 units off \(limit 0.5\) at u=0 \(rep 0\)$/);
  });
});

describe('D-FG7 (l): the channels each view draws (perturbation)', () => {
  // D-FG7 (l), doc §4 "Channels each view can draw": front draws hip_flex seated only; tests/formguide/research.test.ts
  // holds the list the research validator uses
  const validator = (name: string) => JSON.parse(`[${new RegExp(`const ${name} = \\[([^\\]]*)\\]`).exec(readFileSync('tests/formguide/research.test.ts', 'utf8'))![1]!.replace(/'/g, '"')}]`) as string[];
  /** The base channels whose change moves some drawn transform, from a neutral pose of the rig. */
  function drawnBy(rig: Rig, start: Partial<Record<ChannelId, number>>): string[] {
    const base = { ...Object.fromEntries(CHANNELS.map(c => [c, 0])), breath: 0.5, shoulder_abd_l: 20, shoulder_abd_r: 20, ...start } as Record<ChannelId, number>;
    const f0 = JSON.stringify(rig.frame(base)), out = new Set<string>();
    for (const c of CHANNELS) {
      const step = c === 'breath' || c === 'layer' ? 0.3 : c.endsWith('_cm') ? 2 : 10;
      if (JSON.stringify(rig.frame({ ...base, [c]: base[c] + step })) !== f0) out.add(c.replace(/_[lr]$/, ''));
    }
    return [...out].sort();
  }
  const FRONT = ['shoulder_abd', 'elbow_lead', 'shrug_cm', 'scap_depress_cm', 'hip_abd', 'knee_flex', 'torso_lean', 'breath', 'sway', 'wrist_pron'];
  it('front standing draws the list without hip_flex; seated adds hip_flex; none draws shoulder_flex, elbow_flex, ankle_flex or layer', () => {
    const standing = drawnBy(rigFor(LR, 'front') as Rig, {});
    const seated = drawnBy(rigFor({ ...LR, pose: 'seated' } as ExerciseGuide, 'front') as Rig, { hip_flex_l: 90, hip_flex_r: 90, knee_flex_l: 90, knee_flex_r: 90 });
    expect(standing).toEqual([...FRONT].sort());
    expect(seated).toEqual([...FRONT, 'hip_flex'].sort());
    expect([...new Set([...standing, ...seated])].sort()).toEqual([...validator('FRONT_CHANNELS')].sort());
  });
});

describe('A1 each V1-07 check fails its own seeded bad file (badV1/, the folder rule of checks.test.ts), naming the numbers', () => {
  const BAD = 'tests/formguide/fixtures/badV1';
  const dirs = readdirSync(BAD, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
  const checkOf = (dir: string) => dir.split('.')[0] as CheckId;
  it('one folder or more per V1-07 check, and every folder names one', () => {
    expect([...new Set(dirs.map(checkOf))].sort()).toEqual([...CHECKS_V1].sort());
  });
  /** What each folder must say: its case's own rule (A2, A3, the three boundary cases, the follow rule, the stop). */
  const CASE: Record<string, RegExp> = {
    contactsHeld: /hand_r leads bar_r \(follow\) but 0 of 2 contacts hold it on bar_r/,
    matchesResearch: /cue 4 has 75 characters > 60/,
    framing: /mistake: left margin -2\.58 units < 1 in standingFront/,
    contrast: /silent-black part dumbbell: text "20 KG" 1\.05:1 < 4\.5:1 on the stage/,
    'contrast.noring': /mark fg-t-forearms_r has no two-tone boundary \(0 of 2 lines\)/,
    'contrast.weakring': /mark fg-t-forearms_r outer line [\d.]+:1 < 3:1 against the body at full effort[^]*mark fg-t-forearms_r inner line [\d.]+:1 < 3:1 against the tint at full effort/,
    'contrast.restring': /mark fg-t-forearms_r outer line shows at rest \(opacity 1\), not with the effort/,
    balance: /mistake: centre of mass x [\d.]+ is 18\.54 units outside the foot base/,
    targetDrawn: /correct front figure draws no fg-t- tint for lats \(1 of 2 targets/,
    travelRange: /bar_r travel 1\.0859 outside the machine's stops 0\.\.1 at u=[\d.]+ \([\d.]+ s, mistake\)/,
  };
  it('every folder has its expected line', () => expect(Object.keys(CASE).sort()).toEqual([...dirs].sort()));
  it.each(dirs)('%s', async dir => {
    const check = checkOf(dir), f = readdirSync(`${BAD}/${dir}`).find(x => x.endsWith('.ts'))!, path = `${BAD}/${dir}/${f}`;
    const g = guideOf(await import(`./fixtures/badV1/${dir}/${f}`), f), rs = runChecks(inputFor(path, g), ALL_CHECKS);
    const r = rs.find(x => x.check === check)!;
    console.info(`[V1-07] ${dir}: ${r.fails.find(m => CASE[dir]!.test(m)) ?? r.fails[0]}`);
    expect(rs.filter(x => !x.ok).map(x => x.check)).toEqual([check]);
    expect(r.fails.join('\n')).toMatch(CASE[dir]!);
    for (const m of r.fails) { expect(m.startsWith(`${check} ${g.id}: `), m).toBe(true); expect(m, 'names a number').toMatch(/\d/); }
  }, 30_000);
});

describe('A6 fg:check stays within 5 s a file', () => {
  it('the lateral raise, all 27 checks, bundling included', () => {
    const t = performance.now(), r = spawnSync('npm', ['run', '-s', 'fg:check', 'lib_dumbbell_lateral_raise'], { encoding: 'utf8' }), s = (performance.now() - t) / 1000;
    console.info(`[V1-07] A6: fg:check lib_dumbbell_lateral_raise ${s.toFixed(2)} s`);
    expect(r.stdout).toMatch(/all 20 checks passed\nall 7 V1-07 checks passed/);
    expect(r.status).toBe(0);
    expect(s).toBeLessThanOrEqual(5);
  }, 30_000);
});
