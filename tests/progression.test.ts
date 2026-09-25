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
