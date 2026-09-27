import { describe, it, expect } from 'vitest';
import { suggestNext } from '@/brain/progression';
import { session, sets } from './helpers';

const ex = 'lib_barbell_bench_press';
const today = '2026-09-18';
describe('progression', () => {
  it('starts light with no history', () => {
    const s = suggestNext([], ex, 'lean', today);
    expect(s.mode).toBe('start');
    expect(s.kg).toBe(20);
  });
  it('bodyweight start has no load', () => {
    expect(suggestNext([], 'lib_push_up', 'lean', today).kg).toBeNull();
  });
  it('adds a rep when under the top of the range', () => {
    const s = suggestNext([session('2026-09-15', [{ id: ex, sets: sets(60, 8) }])], ex, 'lean', today);
    expect(s.mode).toBe('hold');
    expect(s.reps).toEqual([9, 9]);
  });
  it('confirms once at the top, then increases (two for two)', () => {
    const a = session('2026-09-12', [{ id: ex, sets: sets(60, 12) }]);
    expect(suggestNext([a], ex, 'lean', today).mode).toBe('confirm');
    const b = session('2026-09-15', [{ id: ex, sets: sets(60, 12) }]);
    const s = suggestNext([a, b], ex, 'lean', today);
    expect(s.mode).toBe('increase');
    expect(s.kg).toBe(62.5);
  });
  it('never increases on max effort', () => {
    const a = session('2026-09-12', [{ id: ex, sets: sets(60, 12, 'max') }]);
    const b = session('2026-09-15', [{ id: ex, sets: sets(60, 12, 'max') }]);
    expect(suggestNext([a, b], ex, 'lean', today).mode).toBe('hold');
  });
  it('reduces after two under-range max sessions', () => {
    const a = session('2026-09-12', [{ id: ex, sets: sets(60, 4, 'max') }]);
    const b = session('2026-09-15', [{ id: ex, sets: sets(60, 4, 'max') }]);
    const s = suggestNext([a, b], ex, 'lean', today);
    expect(s.mode).toBe('reduce');
    expect(s.kg).toBe(57.5);
  });
  it('asks for effort when ratings are missing', () => {
    const a = session('2026-09-12', [{ id: ex, sets: sets(60, 8, null) }]);
    const b = session('2026-09-15', [{ id: ex, sets: sets(60, 8, null) }]);
    expect(suggestNext([a, b], ex, 'lean', today).mode).toBe('confirm_effort');
  });
  it('re-entry after a long gap', () => {
    const a = session('2026-07-01', [{ id: ex, sets: sets(60, 12) }]);
    const s = suggestNext([a], ex, 'lean', today);
    expect(s.mode).toBe('reentry');
    expect(s.kg).toBe(60);
  });
  it('a clearly declining lift gets an easier week at the same load', () => {
    const days = ['2026-08-20', '2026-08-24', '2026-08-27', '2026-08-31', '2026-09-03', '2026-09-07', '2026-09-10', '2026-09-14', '2026-09-17'];
    const s = days.map((d, i) => session(d, [{ id: ex, sets: sets(70 - i * 2.5, 9, i === 8 ? 'max' : 'ideal') }]));
    const r = suggestNext(s, ex, 'lean', today);
    expect(r.mode).toBe('plateau');
    expect(r.kg).toBe(50);
    expect(r.reason).toMatch(/slipped/);
  });
  it('duration exercises add time', () => {
    const a = session('2026-09-15', [{ id: 'lib_plank', sets: [{ durationSec: 40, effort: 'ideal' }] }]);
    const s = suggestNext([a], 'lib_plank', 'lean', today);
    expect(s.mode).toBe('duration');
    expect(s.sets[0]!.durationSec).toBe(45);
  });

  describe('readiness context (F2.1)', () => {
    const a = session('2026-09-12', [{ id: ex, sets: sets(60, 12) }]);
    const b = session('2026-09-15', [{ id: ex, sets: sets(60, 12) }]);
    it('red readiness holds the load and drops a set instead of increasing', () => {
      const s = suggestNext([a, b], ex, 'lean', today, 3, [], { readiness: { loadAdvice: 'reduce', reason: 'Readiness is red today.' } });
      expect(s.mode).toBe('hold');
      expect(s.sets.length).toBe(2);
      expect(s.reason).toBe('Readiness is red today.');
    });
    it('amber (no_increase) holds at confirm instead of increasing', () => {
      const s = suggestNext([a, b], ex, 'lean', today, 3, [], { readiness: { loadAdvice: 'no_increase' } });
      expect(s.mode).toBe('confirm');
    });
    it('low muscle recovery also blocks the increase', () => {
      const s = suggestNext([a, b], ex, 'lean', today, 3, [], { recoveryPct: 40 });
      expect(s.mode).toBe('confirm');
    });
    it('normal readiness does not interfere with a genuine increase', () => {
      const s = suggestNext([a, b], ex, 'lean', today, 3, [], { readiness: { loadAdvice: 'normal' }, recoveryPct: 90 });
      expect(s.mode).toBe('increase');
    });
  });

  describe('deload context (F3.3)', () => {
    const a = session('2026-09-12', [{ id: ex, sets: sets(60, 12, 'ideal', 3) }]);
    const b = session('2026-09-15', [{ id: ex, sets: sets(60, 12, 'ideal', 3) }]);
    const deload = { startDay: '2026-09-16', endDay: '2026-09-22', reason: 'test', setFactor: 0.6, loadFactor: 0.9 };
    it('cuts sets and load and names the day of the week', () => {
      const s = suggestNext([a, b], ex, 'lean', today, 3, [], { deload });
      expect(s.mode).toBe('deload');
      expect(s.kg).toBe(54);
      expect(s.sets.length).toBe(2);
      expect(s.reason).toBe('Lighter week, day 3 of 7.');
    });
    it('takes priority over a genuine increase', () => {
      const s = suggestNext([a, b], ex, 'lean', today, 3, [], { deload, readiness: { loadAdvice: 'normal' }, recoveryPct: 90 });
      expect(s.mode).toBe('deload');
    });
  });
});

describe('carries progress by distance or time (QA-R6-5)', () => {
  const id = 'lib_farmer_s_carry';
  it('a carry logged as 32 kg × 40 m aims 5 m further at the same load, never "1 reps"', () => {
    const h = [session('2026-09-10', [{ id, sets: [{ kg: 32, distanceM: 40, effort: 'ideal' }, { kg: 32, distanceM: 35, effort: 'ideal' }] }])];
    const n = suggestNext(h, id, 'lean', '2026-09-14');
    expect(n.target).toBe('32 kg · 45 m');
    expect(n.target).not.toMatch(/reps/);
    expect(n.mode).toBe('distance');
  });
  it('a max-effort carry repeats its distance; a timed one adds five seconds', () => {
    const max = [session('2026-09-10', [{ id, sets: [{ kg: 32, distanceM: 40, effort: 'max' }] }])];
    expect(suggestNext(max, id, 'lean', '2026-09-14').target).toBe('32 kg · 40 m');
    const timed = [session('2026-09-10', [{ id, sets: [{ kg: 24, durationSec: 60, effort: 'ideal' }] }])];
    expect(suggestNext(timed, id, 'lean', '2026-09-14').target).toBe('24 kg · 65s');
  });
  it('QA3-12: a timed carry or sled logged with reps still gets a duration goal, never a rep one', () => {
    const carry = [session('2026-09-10', [{ id, sets: [{ kg: 24, durationSec: 60, reps: 8, effort: 'ideal' }] }])];
    const cn = suggestNext(carry, id, 'lean', '2026-09-14');
    expect(cn.mode).toBe('duration');
    expect(cn.target).toBe('24 kg · 65s');
    const sled = [session('2026-09-10', [{ id: 'lib_sled_push', sets: [{ kg: 40, distanceM: 20, reps: 10, effort: 'ideal' }] }])];
    const sn = suggestNext(sled, 'lib_sled_push', 'lean', '2026-09-14');
    expect(sn.mode).toBe('distance');
    expect(sn.target).toBe('40 kg · 25 m');
  });
});

describe('carries in lb and timed rep moves (QA2-FE-2, QA2-FE-7, QA2-FE-8)', () => {
  it('a carry done with 70 lb dumbbells targets 70 lb, not 31.751 kg', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const h = [session('2026-09-10', [{ id: 'lib_farmer_s_carry', sets: [{ kg: 31.751, entered: { value: 70, unit: 'lb' }, distanceM: 40, effort: 'ideal' }] }])];
    expect(suggestNext(h, 'lib_farmer_s_carry', 'lean', '2026-09-14', 3, [], { equipment: defaultProfile('Dumbbells', 'lb') }).target).toBe('70 lb · 45 m');
    expect(suggestNext(h, 'lib_farmer_s_carry', 'lean', '2026-09-14').target).not.toMatch(/31\.751/);
  });
  it('burpees logged with reps and seconds keep a rep goal', () => {
    const h = [session('2026-09-10', [{ id: 'lib_burpee', sets: [{ reps: 15, durationSec: 45, effort: 'ideal' }] }])];
    const n = suggestNext(h, 'lib_burpee', 'lean', '2026-09-14');
    expect(n.target).toBe('16 reps');
  });
});

describe('QA3-3, QA3-11: a conditioning load never snaps across the ladder', () => {
  it('a trap-bar carry heavier than the dumbbell rack keeps its logged load, not capped at 60 kg', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const h = [session('2026-09-10', [{ id: 'lib_farmer_s_carry', sets: [{ kg: 100, distanceM: 40, effort: 'ideal' }] }])];
    const n = suggestNext(h, 'lib_farmer_s_carry', 'lean', '2026-09-14', 3, [], { equipment: defaultProfile('Dumbbells', 'kg') });
    expect(n.target).toBe('100 kg · 45 m');
    expect(n.kg).toBe(100);
  });
  it('a lighter-week carry snaps down, never up towards last time\'s load', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const h = [session('2026-09-10', [{ id: 'lib_farmer_s_carry', sets: [{ kg: 32, distanceM: 40, effort: 'ideal' }] }])];
    const deload = { startDay: '2026-09-14', endDay: '2026-09-20', reason: 'test', setFactor: 1, loadFactor: 0.9 };
    const n = suggestNext(h, 'lib_farmer_s_carry', 'lean', '2026-09-14', 3, [], { equipment: defaultProfile('Dumbbells', 'kg'), deload });
    // half(32 * 0.9) = 29 kg, unreachable on the 2.5 kg-step ladder; 'nearest' rounds up to 30, 'down' picks 27.5.
    expect(n.kg).toBe(27.5);
  });
});

describe('QA3-3b: above the rack, an lb user still sees their own clean number', () => {
  it('a 225 lb trap-bar carry reads as 225 lb, not a rounded-kg conversion', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const h = [session('2026-09-10', [{ id: 'lib_farmer_s_carry', sets: [{ kg: 102.058, entered: { value: 225, unit: 'lb' }, distanceM: 40, effort: 'ideal' }] }])];
    const n = suggestNext(h, 'lib_farmer_s_carry', 'lean', '2026-09-14', 3, [], { equipment: defaultProfile('Dumbbells', 'lb') });
    expect(n.target).toBe('225 lb · 45 m');
    expect(n.value).toBe(225);
    expect(n.unit).toBe('lb');
  });
});

describe('QA3-11b: carries snap down only for a genuine reduction, never in a normal week', () => {
  it('a 75 lb carry on the lb ladder stays 75', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const h = [session('2026-09-10', [{ id: 'lib_farmer_s_carry', sets: [{ kg: 34.019, entered: { value: 75, unit: 'lb' }, distanceM: 40, effort: 'ideal' }] }])];
    const n = suggestNext(h, 'lib_farmer_s_carry', 'lean', '2026-09-14', 3, [], { equipment: defaultProfile('Dumbbells', 'lb') });
    expect(n.value).toBe(75);
  });
  // BUG-11 (owner, 2026-09-27): a load already logged for the exercise stays loadable for every
  // activity, carries included, so a logged 32 kg carry is no longer moved to a rung at all.
  it('a normal-week 32 kg carry keeps the 32 kg the person really carried, not forced down to 30', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const h = [session('2026-09-10', [{ id: 'lib_farmer_s_carry', sets: [{ kg: 32, distanceM: 40, effort: 'ideal' }] }])];
    const n = suggestNext(h, 'lib_farmer_s_carry', 'lean', '2026-09-14', 3, [], { equipment: defaultProfile('Dumbbells', 'kg') });
    expect(n.kg).toBe(32);
  });
  it('a normal-week carry target of 32 kg that was never logged rounds to its nearest rung (32.5), not forced down to 30', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const h = [session('2026-09-10', [{ id: 'lib_farmer_s_carry', sets: [{ kg: 30, distanceM: 40, effort: 'ideal' }] }])];
    const n = suggestNext(h, 'lib_farmer_s_carry', 'lean', '2026-09-14', 3, [], { equipment: defaultProfile('Dumbbells', 'kg'), loadFactor: 32 / 30 });
    expect(n.kg).toBe(32.5);
  });
  it('an Escobar ×1.05 increase on a 30 kg carry is not lost to a forced-down snap', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const h = [session('2026-09-10', [{ id: 'lib_farmer_s_carry', sets: [{ kg: 30, distanceM: 40, effort: 'ideal' }] }])];
    const n = suggestNext(h, 'lib_farmer_s_carry', 'lean', '2026-09-14', 3, [], { equipment: defaultProfile('Dumbbells', 'kg'), loadFactor: 1.05 });
    expect(n.kg).toBe(32.5);
  });
  it('an Escobar ×0.95 cut on a 25 kg DB bench is not rounded back up', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const h = [session('2026-09-10', [{ id: 'lib_dumbbell_bench_press', sets: [{ kg: 25, reps: 8, effort: 'ideal' }] }])];
    const n = suggestNext(h, 'lib_dumbbell_bench_press', 'lean', '2026-09-14', 3, [], { equipment: defaultProfile('Dumbbells', 'kg'), loadFactor: 0.95 });
    expect(n.kg).toBe(22.5);
  });
  it('a lighter-week 32 kg carry still snaps down to 27.5 (QA3-11)', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const h = [session('2026-09-10', [{ id: 'lib_farmer_s_carry', sets: [{ kg: 32, distanceM: 40, effort: 'ideal' }] }])];
    const deload = { startDay: '2026-09-14', endDay: '2026-09-20', reason: 'test', setFactor: 1, loadFactor: 0.9 };
    const n = suggestNext(h, 'lib_farmer_s_carry', 'lean', '2026-09-14', 3, [], { equipment: defaultProfile('Dumbbells', 'kg'), deload });
    expect(n.kg).toBe(27.5);
  });
});

describe('QA3-12b: a custom or non-listed conditioning move still gets its own distance/time goal', () => {
  it('a custom carry (no library id) progresses by distance, then time, even logged with reps too', async () => {
    const { makeCustomExercise } = await import('@/core/exercises');
    const yoke = makeCustomExercise({ id: 'custom_yoke_walk', name: 'Yoke Walk', equipment: 'Other', primary: ['quads'], mode: 'conditioning' });
    const byDistance = [session('2026-09-10', [{ id: yoke.id, sets: [{ kg: 100, distanceM: 20, effort: 'ideal' }] }])];
    expect(suggestNext(byDistance, yoke.id, 'lean', '2026-09-14', 3, [yoke]).target).toBe('100 kg · 25 m');
    const byTime = [session('2026-09-10', [{ id: yoke.id, sets: [{ kg: 100, durationSec: 30, effort: 'ideal' }] }])];
    expect(suggestNext(byTime, yoke.id, 'lean', '2026-09-14', 3, [yoke]).target).toBe('100 kg · 35s');
    const withReps = [session('2026-09-10', [{ id: yoke.id, sets: [{ kg: 100, durationSec: 30, reps: 8, effort: 'ideal' }] }])];
    expect(suggestNext(withReps, yoke.id, 'lean', '2026-09-14', 3, [yoke]).mode).toBe('duration');
  });
  it('library conditioning moves outside CARRY_OR_SLED_IDS still get a distance/time goal when logged that way', () => {
    const ropes = [session('2026-09-10', [{ id: 'lib_battle_ropes', sets: [{ durationSec: 30, effort: 'ideal' }] }])];
    expect(suggestNext(ropes, 'lib_battle_ropes', 'lean', '2026-09-14').target).toBe('35s');
    const crawl = [session('2026-09-10', [{ id: 'lib_bear_crawl', sets: [{ distanceM: 20, effort: 'ideal' }] }])];
    expect(suggestNext(crawl, 'lib_bear_crawl', 'lean', '2026-09-14').target).toBe('25 m');
  });
});

describe('QA3-3c: above the rack, a scaled lb carry still lands on a clean number', () => {
  const h = [session('2026-09-10', [{ id: 'lib_farmer_s_carry', sets: [{ kg: 102.058, entered: { value: 225, unit: 'lb' }, distanceM: 40, effort: 'ideal' }] }])];
  it('a lighter week (0.9) reads as 200 lb, not a rounded-kg conversion', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const deload = { startDay: '2026-09-14', endDay: '2026-09-20', reason: 'test', setFactor: 1, loadFactor: 0.9 };
    const n = suggestNext(h, 'lib_farmer_s_carry', 'lean', '2026-09-14', 3, [], { equipment: defaultProfile('Dumbbells', 'lb'), deload });
    expect(n.target).toBe('200 lb · 40 m');
  });
  it('an Escobar ×0.95 cut reads as 210 lb', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const n = suggestNext(h, 'lib_farmer_s_carry', 'lean', '2026-09-14', 3, [], { equipment: defaultProfile('Dumbbells', 'lb'), loadFactor: 0.95 });
    expect(n.target).toBe('210 lb · 45 m');
  });
  it('an Escobar ×1.05 increase reads as 235 lb', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const n = suggestNext(h, 'lib_farmer_s_carry', 'lean', '2026-09-14', 3, [], { equipment: defaultProfile('Dumbbells', 'lb'), loadFactor: 1.05 });
    expect(n.target).toBe('235 lb · 45 m');
  });
});

describe('F13 Part B: a carry logged as kg × reps shows its weight in the target', () => {
  const id = 'lib_farmer_s_carry';

  it('adds a rep at the same load', () => {
    const h = [session('2026-09-10', [{ id, sets: [{ kg: 32, reps: 2, effort: 'ideal' }] }])];
    const n = suggestNext(h, id, 'lean', '2026-09-14');
    expect(n.target).toBe('32 kg · 3 reps');
    expect(n.kg).toBe(32);
    expect(n.mode).toBe('reps');
  });

  it('re-entry after 44 days repeats the load, with a rep range', () => {
    const h = [session('2026-08-01', [{ id, sets: [{ kg: 32, reps: 2, effort: 'ideal' }] }])];
    const n = suggestNext(h, id, 'lean', '2026-09-14');
    expect(n.target).toMatch(/^32 kg · \d+–\d+ reps$/);
    expect(n.kg).toBe(32);
  });

  it('a deload week scales the kg down, no equipment', () => {
    const h = [session('2026-09-10', [{ id, sets: [{ kg: 32, reps: 2, effort: 'ideal' }] }])];
    const deload = { startDay: '2026-09-14', endDay: '2026-09-20', reason: 'test', setFactor: 1, loadFactor: 0.9 };
    const n = suggestNext(h, id, 'lean', '2026-09-15', 3, [], { deload });
    expect(n.target).toBe('29 kg · 2 reps · easy');
    expect(n.kg).toBe(29);
  });

  it('a lb-equipment carry snaps its target to the ladder', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const h = [session('2026-09-10', [{ id, sets: [{ kg: 31.751, entered: { value: 70, unit: 'lb' }, reps: 2, effort: 'ideal' }] }])];
    const n = suggestNext(h, id, 'lean', '2026-09-14', 3, [], { equipment: defaultProfile('Dumbbells', 'lb') });
    expect(n.target).toBe('70 lb · 3 reps');
  });

  it('bodyweight and assisted moves, and a carry with no kg logged, are unaffected pins', () => {
    const sled = suggestNext([session('2026-09-10', [{ id: 'lib_sled_push', sets: [{ reps: 10, effort: 'ideal' }] }])], 'lib_sled_push', 'lean', '2026-09-14');
    expect(sled.target).toBe('11 reps');
    expect(sled.kg).toBeNull();
    const pushup = suggestNext([session('2026-09-10', [{ id: 'lib_push_up', sets: sets(0, 10) }])], 'lib_push_up', 'lean', '2026-09-14');
    expect(pushup.target).toBe('11 reps');
    expect(pushup.kg).toBeNull();
  });
});

describe('BUG-11: a load the user really lifted is never snapped away', () => {
  const lat = 'lib_dumbbell_lateral_raise';
  const last = [{ kg: 7, reps: 13, effort: 'ideal' as const }, { kg: 7, reps: 13, effort: 'ideal' as const }, { kg: 7, reps: 12, effort: 'max' as const }];

  it('A1: no dumbbell profile saved, last 7x13 with a max set → 7 kg x 14, not 6 kg', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const n = suggestNext([session('2026-09-15', [{ id: lat, sets: last }])], lat, 'lean', today, 3, [], { equipment: defaultProfile('Dumbbells', 'kg') });
    expect(n.mode).toBe('hold');
    expect(n.kg).toBe(7);
    expect(n.value).toBe(7);
    expect(n.target).toBe('7 kg · 14 reps');
    expect(n.sets.every(x => x.kg === 7)).toBe(true);
    expect(n.snappedFromKg).toBeUndefined();
  });

  it('A1: the logged lb value is kept when the gym profile is in lb', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const lbSet = { kg: 7.711, entered: { value: 17, unit: 'lb' as const }, reps: 12, effort: 'max' as const };
    const n = suggestNext([session('2026-09-15', [{ id: lat, sets: [lbSet, lbSet] }])], lat, 'lean', today, 3, [], { equipment: defaultProfile('Dumbbells', 'lb') });
    expect(n.target).toBe('17 lb · 13 reps');
  });

  it('A2: an increase from a logged off-ladder load still snaps up to the rack', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const top = sets(7, 15, 'ideal');
    const n = suggestNext([session('2026-09-12', [{ id: lat, sets: top }]), session('2026-09-15', [{ id: lat, sets: top }])], lat, 'lean', today, 3, [], { equipment: defaultProfile('Dumbbells', 'kg') });
    expect(n.mode).toBe('increase');
    expect(n.kg).toBe(8);
    expect(n.snappedFromKg).toBeUndefined();
  });

  it('A3: a first-time off-ladder start still snaps to the rack, and says so', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const n = suggestNext([], lat, 'lean', today, 3, [], { equipment: defaultProfile('Dumbbells', 'kg') });
    expect(n.mode).toBe('start');
    expect(n.kg).toBe(2);
    expect(n.snappedFromKg).toBe(2.5);
    expect(n.reason).toMatch(/nearest weight your equipment has/);
  });

  it('a load logged in another unit is not treated as loadable on this profile', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const n = suggestNext([session('2026-09-15', [{ id: lat, sets: last }])], lat, 'lean', today, 3, [], { equipment: defaultProfile('Dumbbells', 'lb') });
    expect(n.unit).toBe('lb');
    expect(n.value).toBe(15);
    expect(n.snappedFromKg).toBe(7);
    expect(n.reason).toMatch(/Moved to 15 lb, the nearest weight your equipment has/);
  });
});

describe('BUG-11: every equipment kind and unit keeps a load already logged for that exercise', () => {
  const kinds: Array<[string, string, number, 'kg' | 'lb']> = [
    ['kettlebell', 'lib_kettlebell_swing', 16, 'kg'],
    ['dumbbell / kettlebell', 'lib_goblet_squat', 16, 'kg'],
    ['machine stack', 'lib_machine_chest_press', 42, 'kg'],
    ['cable', 'lib_cable_fly', 17, 'kg'],
    ['barbell and plates', 'lib_barbell_bench_press', 61, 'kg'],
    ['smith machine', 'lib_smith_machine_bench_press', 61, 'kg'],
    ['bodyweight + added load (dip belt)', 'lib_weighted_dip', 11, 'kg'],
    ['barbell and plates, lb', 'lib_barbell_bench_press', 137, 'lb'],
    ['machine stack, lb', 'lib_machine_chest_press', 72, 'lb'],
    ['kettlebell, lb', 'lib_kettlebell_swing', 53, 'lb'],
    ['cable, lb', 'lib_cable_fly', 17, 'lb'],
  ];
  it.each(kinds)('%s: a hold at the logged %s load stays there', async (_kind, id, value, unit) => {
    const { defaultProfile, loadableValues } = await import('@/brain/units');
    const { findExercise } = await import('@/core/exercises');
    const { displayToKg } = await import('@/core/units');
    const profile = defaultProfile(findExercise(id)!.equipment, unit);
    // The load really is off this equipment's built-in steps, so the old snap would have moved it.
    expect(loadableValues(profile)).not.toContain(value);
    const kg = unit === 'kg' ? value : displayToKg(value, 'lb');
    const set = { kg, ...(unit === 'lb' ? { entered: { value, unit } } : {}), reps: 8, effort: 'max' as const };
    const n = suggestNext([session('2026-09-15', [{ id, sets: [set, set, set] }])], id, 'lean', today, 3, [], { equipment: profile });
    expect(n.mode).toBe('hold');
    expect(n.kg).toBe(kg);
    expect(n.value).toBe(value);
    expect(n.target.startsWith(`${value} ${unit} · `)).toBe(true);
    expect(n.sets.every(x => x.kg === kg)).toBe(true);
    expect(n.snappedFromKg).toBeUndefined();
  });

  it('a loaded carry keeps its logged 16 kg (conditioning)', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const n = suggestNext([session('2026-09-15', [{ id: 'lib_farmer_s_carry', sets: [{ kg: 16, distanceM: 40, effort: 'ideal' }] }])], 'lib_farmer_s_carry', 'lean', today, 3, [], { equipment: defaultProfile('Dumbbells', 'kg') });
    expect(n.target).toBe('16 kg · 45 m');
  });

  it('a bodyweight move with added load has no load target to snap (reps progress)', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const n = suggestNext([session('2026-09-15', [{ id: 'lib_pull_up', sets: sets(7, 6) }])], 'lib_pull_up', 'lean', today, 3, [], { equipment: defaultProfile('Bodyweight', 'kg') });
    expect(n.kg).toBeNull();
    expect(n.target).toBe('7 reps');
  });

  it.each([
    ['machine stack', 'lib_machine_chest_press', 42, 45],
    ['barbell and plates', 'lib_barbell_bench_press', 61, 65],
    ['kettlebell', 'lib_kettlebell_swing', 16, 17.5],
  ] as Array<[string, string, number, number]>)('%s: an increase from a logged %s kg still snaps up to the rack, to %s kg', async (_kind, id, logged, up) => {
    const { defaultProfile } = await import('@/brain/units');
    const { findExercise } = await import('@/core/exercises');
    const top = sets(logged, 15, 'ideal');
    const n = suggestNext([session('2026-09-12', [{ id, sets: top }]), session('2026-09-15', [{ id, sets: top }])], id, 'lean', today, 3, [], { equipment: defaultProfile(findExercise(id)!.equipment, 'kg') });
    expect(n.mode).toBe('increase');
    expect(n.kg).toBe(up);
  });

  it('a hold-type target exactly between two rungs goes up to the heavier one, never a step back', async () => {
    const { defaultProfile } = await import('@/brain/units');
    const lat = 'lib_dumbbell_lateral_raise';
    // Logged 6 kg; an Escobar ×7/6 adjustment makes 7 kg, which was never logged and sits between 6 and 8.
    const n = suggestNext([session('2026-09-15', [{ id: lat, sets: sets(6, 10, 'max') }])], lat, 'lean', today, 3, [], { equipment: defaultProfile('Dumbbells', 'kg'), loadFactor: 7 / 6 });
    expect(n.kg).toBe(8);
    expect(n.snappedFromKg).toBe(7);
    expect(n.reason).toMatch(/Moved to 8 kg, the nearest weight your equipment has, so the reps may need to change/);
  });
});
