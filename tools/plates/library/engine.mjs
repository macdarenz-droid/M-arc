// Authoring helpers for library specs: the vendored engine's pure modules only. (engine/index.mjs also loads
// sheet.mjs, which reads the Inter woff2 that exists only in a mirror, so specs import from here instead.)
export { WINTER, REF, RADII, normPose, resolve, lerpPose, poseAt, fk, landmarks, landmarksOf, rootOnSeat, twoBone, bodyShapes } from '../vendor/engine/body.mjs';
export { PRIMITIVES, footplateFace, legPressFace, railDir, latBarPoint } from '../vendor/engine/equipment.mjs';
export { SIZE, REF_CAMERA } from '../vendor/engine/plate.mjs';
