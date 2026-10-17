// ENGINE SPIKE (do not merge): dumbbell_fly front view with a raised foot-end camera. The spec's hand-built torso dome
// and x-ray outlines (workarounds for a level camera) are dropped, so the engine draws the body itself.
import base from '../../specs/dumbbell_fly.mjs';
export const flyPitched = (pitch, volume = false) => ({
  ...base, id: `dumbbell_fly__p${pitch}${volume ? 'v' : ''}`,
  camera: { fit: true, pitch }, ...(volume ? { torso: 'volume' } : {}),
  // the floor line drawn at the feet (a pitched camera sees the floor as a plane; the line marks where the feet stand)
  equipment: base.equipment.filter(e => typeof e === 'function' || !['poly', 'line'].includes(e.type))
    .map(e => (e.type === 'floor' ? { type: 'floor', from: [-1.05, 0, 0.51], to: [1.05, 0, 0.51] } : e)),
  callouts: base.callouts.map(c => ({ ...c, box: undefined })),
});
