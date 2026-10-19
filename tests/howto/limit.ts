/** VITEST-RPC: maps `items` through `fn` with at most `n` calls in flight; results keep the input order.
 *  Used where each call starts a generator process, so a test never puts more than `n` of them on the runner's CPUs. */
export async function mapLimit<T, R>(items: readonly T[], n: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const lane = async () => { while (next < items.length) { const i = next++; out[i] = await fn(items[i]!, i); } };
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, lane));
  return out;
}
