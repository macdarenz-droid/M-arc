// LIB-8 pilot A (critic on ab0c553, R5): the barbell_overhead_press Mistake arm belongs to the drawn figure.
// Run: node --test tools/plates/library/test/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { landmarksOf } from '../engine.mjs';

const H = 1.75;   // the spec's body height (specs/barbell_overhead_press.mjs const H)
const SPEC = process.env.OHP_SPEC ? pathToFileURL(process.env.OHP_SPEC).href : new URL('../specs/barbell_overhead_press.mjs', import.meta.url).href;
const spec = (await import(SPEC)).default;
const lmEnd = landmarksOf(spec.poses.end, H), lmStart = landmarksOf(spec.poses.start, H);
const lmMis = landmarksOf({ ...spec.poses.end, ...spec.mistake.pose }, H);

test('the Mistake arm starts on the drawn shoulder joint (within 5 mm)', () => {
  const d = Math.hypot(...lmMis['shoulder.r'].map((v, i) => v - lmEnd['shoulder.r'][i]));
  assert.ok(d <= 0.005, `faulty shoulder is ${(d * 100).toFixed(1)} cm off the drawn shoulder joint`);
});

test('the elbow is below and behind the bar; the forearm lies in front of the chest, above the safety arms', () => {
  const el = lmMis['elbow.r'], gr = lmMis['grip.r'];
  assert.ok(el[1] < gr[1] && el[2] < gr[2], 'elbow below and behind the bar');
  assert.ok(el[2] > lmEnd.chest[2] + 0.06, `elbow ${el[2].toFixed(3)} m not clear in front of the chest ${lmEnd.chest[2].toFixed(3)} m`);
  const safetyTop = lmStart.grips[1] - 0.08;   // safety arms 8 cm under the front-rack bar (spec ARM_Y)
  assert.ok(el[1] - 0.05 > safetyTop, `elbow ${el[1].toFixed(3)} m too close to the safety arms ${safetyTop.toFixed(3)} m`);
  const tilt = Math.atan2(gr[2] - el[2], gr[1] - el[1]) * 180 / Math.PI;
  assert.ok(tilt >= 25 && tilt <= 35, `forearm tilt ${tilt.toFixed(1)} deg`);
});
