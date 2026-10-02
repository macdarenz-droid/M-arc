// ENGINE SPIKE (do not merge): small vector helpers for the E-R5 test specs.
export const sub = (a, b) => a.map((v, i) => v - b[i]), add = (a, b) => a.map((v, i) => v + b[i]), mul = (a, k) => a.map(v => v * k);
export const norm = a => mul(a, 1 / Math.hypot(...a)), cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const mid = (a, b) => mul(add(a, b), 0.5);
/** Thorax axes from landmarks: lat (toward the left shoulder), up (hips to shoulders), fwd. */
export const axes = lm => { const lat = norm(sub(lm['shoulder.l'], lm['shoulder.r'])), up = norm(sub(mid(lm['shoulder.l'], lm['shoulder.r']), mid(lm['hip.l'], lm['hip.r']))); return { lat, up, fwd: norm(cross(lat, up)) }; };
