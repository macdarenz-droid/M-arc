// ENGINE SPIKE (do not merge): Newton solve with finite differences (as plank.mjs). x0: { name: value }, f(x) -> residuals.
export function newton(x0, f, { iters = 60, h = 1e-5, tol = 1e-9 } = {}) {
  const keys = Object.keys(x0); let x = { ...x0 };
  for (let it = 0; it < iters; it++) {
    const r = f(x); if (Math.hypot(...r) < tol) break;
    const J = keys.map(k => { const xp = { ...x, [k]: x[k] + h }; return f(xp).map((v, i) => (v - r[i]) / h); });   // J[k][i]
    // least squares step: (JᵀJ) d = -Jᵀ r, with J as columns per key
    const n = keys.length, A = keys.map((_, a) => keys.map((_, b) => J[a].reduce((s, v, i) => s + v * J[b][i], 0) + (a === b ? 1e-12 : 0))), g = keys.map((_, a) => -J[a].reduce((s, v, i) => s + v * r[i], 0));
    for (let c = 0; c < n; c++) { let p = c; for (let q = c + 1; q < n; q++) if (Math.abs(A[q][c]) > Math.abs(A[p][c])) p = q; [A[c], A[p]] = [A[p], A[c]]; [g[c], g[p]] = [g[p], g[c]];
      for (let q = c + 1; q < n; q++) { const m = A[q][c] / A[c][c]; for (let k = c; k < n; k++) A[q][k] -= m * A[c][k]; g[q] -= m * g[c]; } }
    const d = Array(n).fill(0); for (let c = n - 1; c >= 0; c--) d[c] = (g[c] - A[c].slice(c + 1).reduce((s, v, k) => s + v * d[c + 1 + k], 0)) / A[c][c];
    keys.forEach((k, i) => { x[k] += d[i]; });
  }
  const res = f(x); if (Math.hypot(...res) > 1e-4) throw new Error(`newton: residual ${Math.hypot(...res)}`);
  return x;
}
