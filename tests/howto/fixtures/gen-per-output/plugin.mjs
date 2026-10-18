// LIB-2 test fixture plugin (not in tools/plates/gen, so the real generator never loads it): one output with its own
// inputs, one with the plugin-wide inputs, and (when asked) one with an empty input list, which must be refused.
export const inputs = () => ['tools/plates/plates.json'];
export async function outputs({ hashFor }) {
  const own = ['src/data/exercises.json'];
  const out = [
    { path: 'fixture/own.ts', inputs: own, text: `export const h = ${JSON.stringify(hashFor('fixture/own.ts', own))};\n` },
    { path: 'fixture/wide.ts', text: `export const h = ${JSON.stringify(hashFor('fixture/wide.ts'))};\n` },
  ];
  if (process.env.LIB2_EMPTY_INPUTS) out.push({ path: 'fixture/empty.ts', inputs: [], text: '\n' });
  return out;
}
