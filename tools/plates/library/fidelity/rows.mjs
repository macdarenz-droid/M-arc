// LIB-4b: the runner's row recorder. A check touches (id, theme, state) and passes or fails it; a state that is touched
// once failing stays failed. finish(tuples) turns every expected tuple that nothing touched into a fail row ("not
// proven"), and every touched state that is not expected into a fail row too, so a key missing on either side (the
// DOM against the source) is red, never a silent pass. Rows are writeProof's shape.
import { parseState } from './tuples.mjs';

const key = (id, theme, state) => `${id}|${theme}|${state}`;

/** The state string of a check, sub-state and width (null: '*'); throws unless it parses back to the same parts. */
export function stateOf(check, sub, width) {
  const state = `${check}/${sub}@${width ?? '*'}`, p = parseState(state);
  if (p.check !== check || p.sub !== sub || p.width !== (width ?? null)) throw new Error(`rows: ${state} does not encode check ${check}, sub ${sub}, width ${width}`);
  return state;
}

/** Problems of one row: its state must begin with `<check>/` and end with `@<width or *>` (LIB-4c's verdict, too). */
export function rowProblems(r) {
  const out = [];
  let p = null;
  try { p = parseState(r.state); } catch (e) { return [e.message]; }
  if (p.check !== r.check) out.push(`${r.id}|${r.theme}|${r.state}: state does not begin with its check ${r.check}/`);
  if (p.width !== r.width) out.push(`${r.id}|${r.theme}|${r.state}: state does not end with its width @${r.width ?? '*'}`);
  return out;
}

export function recorder() {
  const states = new Map(), pxByTuple = {}, problems = [];
  const touch = (id, theme, state) => {
    const k = key(id, theme, state);
    if (!states.has(k)) states.set(k, { id, theme, state, fail: [] });
    return states.get(k);
  };
  const R = {
    /** Marks a state passed (unless it already failed). */
    ok: (id, theme, state) => { touch(id, theme, state); },
    /** Marks a state failed with a message. */
    fail: (id, theme, state, msg) => { touch(id, theme, state).fail.push(msg); problems.push(`${id} ${theme} ${state}: ${msg}`); },
    /** Passes the state when `list` is empty, else fails it with each message. */
    check: (id, theme, state, list) => { touch(id, theme, state); for (const m of list) R.fail(id, theme, state, m); },
    /** Records the px off of one pixel compare of a tuple (the max is kept). */
    px: (id, theme, state, off) => { const k = key(id, theme, state); pxByTuple[k] = Math.max(pxByTuple[k] ?? 0, off); },
    touched: (id, theme, state) => states.has(key(id, theme, state)),
    failed: (id, theme, state) => (states.get(key(id, theme, state))?.fail.length ?? 0) > 0,
    problems,
    pxByTuple,
    /** Rows over `tuples`: every expected tuple once (untouched: fail "not proven"), plus every unexpected touched state (fail). */
    finish(tuples, why = {}) {
      const rows = [], want = new Set();
      const row = (t, fail) => {
        const p = parseState(t.state);
        rows.push({ id: t.id, check: p.check, state: t.state, theme: t.theme, width: p.width, result: fail.length ? 'fail' : 'pass', why: fail });
      };
      for (const t of tuples) {
        const k = key(t.id, t.theme, t.state);
        want.add(k);
        const s = states.get(k);
        if (!s) { const m = `not proven${why[t.id] ? `: ${why[t.id]}` : ''}`; problems.push(`${t.id} ${t.theme} ${t.state}: ${m}`); row(t, [m]); } else row(t, s.fail);
      }
      for (const [k, s] of states) if (!want.has(k)) { const m = 'proven but not expected from the source'; problems.push(`${s.id} ${s.theme} ${s.state}: ${m}`); row(s, [...s.fail, m]); }
      for (const r of rows) for (const m of rowProblems(r)) { r.result = 'fail'; r.why.push(m); problems.push(m); }
      return rows;
    },
  };
  return R;
}
