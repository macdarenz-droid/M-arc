// LIB-4c (card LIB-4c Do 1; D-LIB4-SHARD): the library shard plan. One sharding system: GATE-SPLIT's packShards, the
// 900 s target and the 1,800 s red line. K is the smallest K >= 1 for which every packed shard fits the target:
// c0 + its offset + the sum of its planned seconds <= 900. Shard 1's offset is the once-states (LIB_ONCE.run plus its
// own LIB_ONCE.shard rows); every other shard's is its LIB_ONCE.shard rows. Build and CI time only; never bundled.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { packShards } from '../../fidelity/shard.mjs';
import { ROOT } from '../../lib/inputs.mjs';
import { rows, shippedRows } from '../registry.mjs';

export const TIMES_FILE = 'tools/plates/library/ci/times.json';
/** GATE-SPLIT's numbers (scripts/ci-verdict.mjs SHARD_TARGET_S, JOB_BUDGET_S), unchanged. */
export const SHARD_TARGET_S = 900;
export const JOB_BUDGET_S = 1800;

/** The library ids CI proves: the shipped rows whose mode is not 'golden' (the 8 keep their HT blocks), in row order. */
export const libraryIds = (all = rows()) => shippedRows(all).filter(r => r.mode !== 'golden').map(r => r.id);

export const readTimes = (root = ROOT) => JSON.parse(readFileSync(join(root, TIMES_FILE), 'utf8'));

/** Planned seconds of one id: its measured time, else the largest measured time, else `default` (D-LIB4-SHARD). */
export function secondsOf(id, times) {
  const measured = Object.values(times.ids ?? {});
  return times.ids?.[id] ?? (measured.length ? Math.max(...measured) : times.default);
}

/** The head start of each of K shards: once.shard each, plus once.run on shard 1. */
export const offsetsOf = (K, times) => Array.from({ length: K }, (_, j) => (times.once?.shard ?? 0) + (j === 0 ? times.once?.run ?? 0 : 0));

/** Each shard's planned seconds: c0 + offset + its items. */
export function shardLoads(items, K, times) {
  const offsets = offsetsOf(K, times), shards = packShards(items, K, offsets), by = new Map(items.map(it => [it.id, it.seconds]));
  return { shards, offsets, loads: shards.map((ids, j) => (times.c0 ?? 0) + offsets[j] + ids.reduce((a, id) => a + by.get(id), 0)) };
}

/**
 * The smallest K >= 1 whose packed shards all fit SHARD_TARGET_S (a shard whose fixed part alone is over it must hold no id). When none does (an id alone is over the target, or
 * shard 1's head start leaves it no room), each id gets its own shard and `note` says why. K = 1 with 0 ids.
 */
export function planK(items, times) {
  const n = items.length;
  for (let K = 1; K <= Math.max(1, n) + 1; K++) {
    const { loads, shards } = shardLoads(items, K, times);
    // D-LIB4c-4: a shard whose fixed part (c0 + its once-states) is already over the target fits only with no id
    if (loads.every((s, j) => s <= SHARD_TARGET_S || shards[j].length === 0)) return { K, note: loads.some(s => s > SHARD_TARGET_S) ? `shard 1's once-states alone are ${loads[0]} s, over ${SHARD_TARGET_S} s; it holds no id` : null };
  }
  const over = items.filter(it => (times.c0 ?? 0) + it.seconds > SHARD_TARGET_S).map(it => it.id);
  return { K: Math.max(1, n), note: `no K fits ${SHARD_TARGET_S} s (${over.length ? `over alone: ${over.join(', ')}` : 'shard 1\'s once-states leave no room'}); one id per shard` };
}

/** { K, shards, hash, note, loads }: hash = sha256 over the sorted ids, the times, K, c0, the offsets and the target. */
export function libraryPlan({ ids, times }) {
  if (new Set(ids).size !== ids.length) throw new Error('plan: an id is listed twice');
  const items = ids.map(id => ({ id, seconds: secondsOf(id, times) }));
  const { K, note } = planK(items, times);
  const { shards, offsets, loads } = shardLoads(items, K, times);
  const hash = createHash('sha256').update(JSON.stringify({ ids: [...ids].sort(), times, K, c0: times.c0 ?? 0, offsets, target: SHARD_TARGET_S })).digest('hex');
  return { K, shards, hash, note, loads };
}

/** The ids of shard k (1-based, as CI matrix jobs name it) of a plan. */
export const idsOfShard = (plan, k) => plan.shards[k - 1] ?? [];
