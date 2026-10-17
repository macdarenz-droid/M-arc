// ENGINE SPIKE (do not merge): bent-over rear delt fly front view (__alt poses) with a raised camera.
import alt from '../../specs/bent_over_dumbbell_rear_delt_fly__alt.mjs';
export const rearPitched = (pitch, volume = false) => ({
  ...alt, id: `bent_over_dumbbell_rear_delt_fly__p${pitch}${volume ? 'v' : ''}`,
  camera: { fit: true, pitch }, ...(volume ? { torso: 'volume' } : {}),
});
