// LIB-2 (library plan 1 and 5.3, design 5): D (derived from one of the 8) and T (template child) plates are a parent
// spec plus `params`. PARAMS is the closed list of keys a child may set. The approved envelope (LIB-3's
// qa/envelope.json once it merges) is passed in, never imported, so this file has no LIB-3 dependency.
export const PARAMS = Object.freeze({
  'camera.maxScale': { type: 'number' },        // small-motion zoom (plan 1): keeps leg_press_calf_raise derived; outside the envelope = flag F1
  'grip.width': { type: 'number' },             // metres, grip centre to centre
  'bar.kind': { type: 'enum', values: ['straight', 'ez', 'single', 'rope', 'd-handle'] },
  'bench.angle': { type: 'number' },            // degrees from horizontal
  'load.primitive': { type: 'enum', values: ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight'] },
  'handedness': { type: 'enum', values: ['both', 'left', 'right'] },
  'stance.width': { type: 'number' },           // metres, mid-sole to mid-sole
});

/** Problems with `params` against PARAMS and `envelope` ({ key: [min, max] } or { key: [allowed values] }). */
export function paramProblems(params, envelope) {
  const bad = [];
  if (!params || typeof params !== 'object' || Object.keys(params).length === 0) return ['params: none given (a D/T row needs at least one)'];
  for (const [k, v] of Object.entries(params)) {
    if (k === 'view' || k.startsWith('view.')) { bad.push(`${k}: a child never changes the view (templates are one view)`); continue; }
    const p = PARAMS[k];
    if (!p) { bad.push(`${k}: not a PARAMS key`); continue; }
    const env = envelope?.[k];
    if (!env) { bad.push(`${k}: the envelope does not name it`); continue; }
    if (p.type === 'number') {
      if (typeof v !== 'number' || !Number.isFinite(v)) bad.push(`${k}: ${v} is not a number`);
      else if (v < env[0] || v > env[1]) bad.push(`${k}: ${v} is outside the envelope ${env[0]}..${env[1]}`);
    } else if (!p.values.includes(v) || !env.includes(v)) bad.push(`${k}: ${v} is not an allowed value`);
  }
  return bad;
}

const setPath = (obj, path, v) => {
  const [head, ...rest] = path;
  const base = obj && typeof obj === 'object' ? obj : {};
  return { ...base, [head]: rest.length ? setPath(base[head], rest, v) : v };
};

/** The child spec: the parent with exactly the params' paths set. Throws with every problem when one is refused. */
export function derive(parent, params, envelope) {
  const bad = paramProblems(params, envelope);
  if (bad.length) throw new Error(`derive: ${bad.join('; ')}`);
  let spec = parent;
  for (const [k, v] of Object.entries(params)) spec = setPath(spec, k.split('.'), v);
  return spec;
}
