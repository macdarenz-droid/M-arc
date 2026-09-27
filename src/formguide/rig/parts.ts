// Rig part sets (side, front and top views), ported verbatim from the demo's shared rig
// (docs/design/form-guide-demo/rig-final/gen.mjs at DEMO_COMMIT; RIG.md §19-§20). Numbers are the demo's; only types are added.
import { mir, ngon, half, sym, tr, type Pt } from './math';

export type Cloth = 'skin' | 'tee' | 'shorts' | 'shoe' | 'sole' | 'hair';
export type Region = { poly: Pt[]; cloth?: Cloth; tone?: 'hi' | 'lo'; muscle?: string; name?: string; ten?: boolean; far?: boolean; facet?: boolean; flare?: boolean };
export type Part = { base: Pt[]; cloth?: Cloth; regions?: Region[] };
type PartSetOf<T> = { [K in keyof T]: K extends 'joints' ? Record<string, Pt> : Part };
// Contextual typing for a part set literal: `joints` is a point table, every other key a Part.
const trRegions = (rs: Region[], dx: number, dy: number): Region[] => rs.map(r => ({ ...r, poly: tr(r.poly, dx, dy) }));
const sx = (a: readonly Pt[], s: number): Pt[] => a.map(([x, y]) => [x * s, y]);
const partSet = <T,>(t: PartSetOf<T>): PartSetOf<T> => t;

export const LEN = { upperArm: 38, forearm: 40, torso: 62, thigh: 50, shin: 47, sole: 102 };
export const trPart = (p: Part, dx: number, dy: number): Part => ({ ...p, base: tr(p.base, dx, dy), regions: (p.regions || []).map(r => ({ ...r, poly: tr(r.poly, dx, dy) })) });
// Every part: base (its silhouette) in its cloth (skin, tee, shorts, shoe, hair), then regions painted in order:
//   { poly, cloth?, tone?: 'hi' | 'lo', muscle?, name?, ten? }.
// A region with a muscle paints mm / mh when the exercise gives it a role; otherwise it paints its tone, or
// nothing when it has neither tone nor cloth (a muscle kept only for roles). ten: a secondary-motion facet that
// fades in with the move (drawn only when the exercise passes its channel). Section 20 of RIG.md.

// SIDE view: origin = hip joint, lifter faces +x. Light from the front and above.
const HEAD_S: Pt[] = [[-10.2, -3.5], [-8.6, -8.8], [-4.5, -11.8], [1.5, -12], [6.6, -9.6], [9.2, -5.6], [10, -2.6], [9.4, -1.2], [10.4, 0.6], [12.4, 3.4], [10.3, 4.6], [10.2, 6.2], [9.8, 8.5], [8, 10.8], [2.6, 11.2], [-1.2, 8.4], [-4.5, 6.8], [-8.8, 3.6]];
export const SIDE = partSet({
  joints: { hip: [0, 0], shoulder: [0, -62], elbow: [0, -24], grip: [0, 16], knee: [0, 50], ankle: [0, 97], head: [3, -82] },
  neck: {
    base: [[-6.2, -78], [1.2, -76], [3.2, -72.6], [6.8, -66], [5, -62.5], [-5.5, -62.5], [-7, -67]],
    regions: [
      { poly: [[1.2, -76], [3.2, -72.6], [6.8, -66], [4.4, -66.2], [0.6, -72.6], [-1.4, -75.6]], tone: 'hi', name: 'throat' },
      { poly: [[-6.2, -78], [-3.4, -77.4], [-4.8, -69], [-7, -67]], tone: 'lo', name: 'nape' },
    ],
  },
  head: {
    base: tr(HEAD_S, 3, -82),
    regions: trRegions([
      { poly: [[7.38, -8.4], [6.6, -9.6], [1.5, -12], [-4.5, -11.8], [-8.6, -8.8], [-10.2, -3.5], [-9.3, 1], [-6, -0.4], [-4.4, -3.6], [-1, -5.2], [2.8, -6], [5.2, -7.4]], cloth: 'hair', name: 'hair' },
      { poly: [[1.5, -12], [-4.5, -11.8], [-6.6, -10.2], [-1.6, -10.6], [3.6, -10.9]], cloth: 'hair', tone: 'hi', name: 'hairSheen' },
      { poly: [[7.38, -8.4], [5.2, -7.4], [2.8, -6], [-1, -5.2], [-4.4, -3.6], [-1.6, -2.8], [2, -3.6], [5.8, -3.4], [6.8, -5.6]], tone: 'hi', name: 'forehead' },
      { poly: [[-3.4, -1.8], [-0.6, -3.2], [1.6, -0.8], [1.4, 3.2], [-0.4, 5.4], [-2.8, 3.8]], tone: 'hi', name: 'ear' },
      { poly: [[-2.4, -0.6], [-0.6, -1.6], [0.4, 0], [0.2, 2.6], [-0.8, 3.8], [-2.2, 2.6]], tone: 'lo', name: 'earInner' },
      { poly: [[6.2, -2], [9.4, -1.2], [10.4, 0.6], [12.4, 3.4], [10.3, 4.6], [10.2, 6.2], [7, 6.4], [5, 2.4]], tone: 'hi', name: 'face' },
      { poly: [[5.8, -3.4], [10, -2.6], [9.4, -1.2], [6.4, -2.2]], tone: 'lo', name: 'brow' },
      { poly: [[9.8, 8.5], [8, 10.8], [2.6, 11.2], [-1.2, 8.4], [4, 8.6]], tone: 'lo', name: 'jaw' },
    ], 3, -82),
  },
  torso: {
    cloth: 'tee',
    base: [[-6.4, -72.6], [-1.5, -70.8], [3.8, -68.6], [7.2, -66.6], [11.4, -64.6], [15, -57], [15.8, -48.5], [14.2, -41.2], [11.8, -36.4], [10.2, -26], [9.8, -14], [10.8, -4], [7.8, 6], [-3, 8.5], [-10.5, 6], [-12.8, -3], [-10.8, -15], [-10, -26], [-11.9, -40], [-12.3, -52], [-11.2, -60.5], [-9.2, -67.2]],
    regions: [
      { poly: [[10.5, -7], [10.8, -4], [7.8, 6], [-3, 8.5], [-10.5, 6], [-12.8, -3], [-11.87, -8.6]], cloth: 'shorts', name: 'shorts' },
      { poly: [[10.5, -7], [-11.87, -8.6], [-12.1, -7.2], [10.64, -5.6]], cloth: 'shorts', tone: 'lo', name: 'waistband' },
      { poly: [[-3, 8.5], [-10.5, 6], [-12.8, -3], [-12.1, -6.8], [-6, -4.6], [-1.6, 2]], cloth: 'shorts', tone: 'lo', muscle: 'glutes' },
      { poly: [[-6.6, -71.1], [-1.8, -69.3], [0.6, -66.4], [-3.6, -61], [-11.2, -60.5], [-9.2, -67.2]], tone: 'hi', muscle: 'upperTraps' },
      { poly: [[-6.4, -72.6], [-1.5, -70.8], [3.8, -68.6], [7.2, -66.6], [6.4, -65.4], [3.2, -67.3], [-1.8, -69.3], [-6.6, -71.1]], tone: 'lo', name: 'collar' },
      { poly: [[-11.2, -60.5], [-3.6, -61], [-5.4, -54.6], [-12.3, -52]], muscle: 'midBack' },
      { poly: [[-12.3, -52], [-5.4, -54.6], [-2.6, -42], [-4.8, -30], [-10, -26], [-11.9, -40]], tone: 'lo', muscle: 'lats' },
      { poly: [[-3.4, -56.4], [1.4, -56], [0.8, -48.6], [-1.8, -47.4]], tone: 'lo', name: 'armpit' },
      { poly: [[-2.6, -42], [-4.8, -30], [-3.2, -29.6], [-0.8, -41]], tone: 'hi', name: 'latFold' },
      { poly: [[12.7, -38.6], [12.2, -35.6], [7, -36.2], [8.4, -38.2]], tone: 'lo', name: 'underChest' },
      { poly: [[11.4, -33.8], [10.2, -26], [9.8, -14], [10.5, -7], [5.8, -7.4], [5.6, -24], [6.6, -36.4]], muscle: 'abs' },
      { poly: [[5.6, -24], [5.8, -7.4], [-4, -8.2], [-4.8, -19], [-0.4, -27]], muscle: 'obliques' },
      // the pec as a fan: its fibres converge back toward the armpit, its top edge tucked under the front delt
      { poly: [[9.4, -64.4], [12.8, -61.2], [15.3, -52], [8, -50.2], [3.6, -52], [1.4, -56], [4.6, -61.4]], tone: 'hi', muscle: 'chest' },
      { poly: [[15.3, -52], [14.7, -44], [12.7, -38.6], [8.4, -38.2], [3.6, -42], [0.8, -48.6], [3.6, -52], [8, -50.2]], tone: 'hi', muscle: 'chest' },
      // secondary motion: the belly wall firms (brace) and the shoulder blade's inner edge shows (blades held back)
      { poly: [[10.2, -26], [9.8, -14], [10.5, -7], [8.6, -7.2], [8, -14], [8.4, -26.4]], tone: 'lo', ten: true, name: 'brace' },
      { poly: [[-8.8, -60.2], [-7.4, -60], [-9, -50.8], [-10.4, -51]], tone: 'lo', ten: true, name: 'bladeEdge' },
    ],
  },
  deltoid: {
    cloth: 'tee',
    base: tr([[-6.5, -4], [-2.5, -7.5], [4, -7], [7.5, -2.5], [7.8, 5], [5.6, 11.4], [0.6, 13], [-4.4, 12], [-6.5, 7.6]], 0, -62),
    regions: [
      { poly: tr([[2.4, -7.2], [4, -7], [7.5, -2.5], [7.8, 5], [5.6, 11.4], [3, 12.2], [2.2, 1]], 0, -62), tone: 'hi', muscle: 'frontDelts' },
      { poly: tr([[-2.2, -7.4], [2.4, -7.2], [2.2, 1], [3, 12.2], [0.6, 13], [-3.2, 12.3], [-2.4, 1]], 0, -62), muscle: 'sideDelts' },
      { poly: tr([[-6.5, -4], [-2.5, -7.5], [-2.2, -7.4], [-2.4, 1], [-3.2, 12.3], [-4.4, 12], [-6.5, 7.6]], 0, -62), tone: 'lo', muscle: 'rearDelts' },
    ],
  },
  upperArm: {
    base: tr([[-5.5, -2], [5.5, -2], [6.3, 9], [6.5, 17], [5.4, 28], [4.4, 35], [2.2, 38.2], [0, 39], [-4.6, 35], [-6.2, 14]], 0, -62),
    regions: [
      { poly: tr([[-5.5, -2], [5.5, -2], [6.3, 9], [6.5, 17], [6.3, 19], [-5.74, 20], [-6.2, 14]], 0, -62), cloth: 'tee', name: 'sleeve' },
      { poly: tr([[2.2, -2], [5.5, -2], [6.3, 9], [6.5, 17], [6.3, 19], [2.4, 19.3]], 0, -62), cloth: 'tee', tone: 'hi', muscle: 'biceps' },
      { poly: tr([[2.4, 19.3], [6.3, 19], [5.4, 28], [4.4, 35], [2.2, 36.8], [1.8, 28]], 0, -62), tone: 'hi', muscle: 'biceps' },
      { poly: tr([[-5.5, -2], [-2.4, -2], [-2.6, 19.7], [-5.74, 20], [-6.2, 14]], 0, -62), cloth: 'tee', tone: 'lo', muscle: 'triceps' },
      { poly: tr([[-5.74, 20], [-2.6, 19.7], [-2, 30], [-2.4, 36.8], [-4.6, 35]], 0, -62), tone: 'lo', muscle: 'triceps' },
      { poly: tr([[6.3, 19], [-5.74, 20], [-5.85, 18.6], [6.44, 17.6]], 0, -62), cloth: 'tee', tone: 'lo', name: 'sleeveHem' },
    ],
  },
  elbowCap: { base: ngon(0, -24, 4.8), regions: [{ poly: [[2.6, -27.2], [4.4, -24], [2.6, -20.8], [1.6, -24]], tone: 'lo', name: 'elbowCrease' }] },
  forearm: {
    base: tr([[-4.8, -1], [5, -1], [6.4, 4.5], [6.2, 10], [4.9, 21], [4, 31], [-4, 31], [-4.5, 18], [-4.9, 7]], 0, -24),
    regions: [
      { poly: tr([[0.6, -1], [5, -1], [6.4, 4.5], [6.2, 10], [4.9, 21], [4, 31], [0.8, 31]], 0, -24), tone: 'hi', muscle: 'forearms' },
      { poly: tr([[-4.8, -1], [-2.6, -1], [-2.2, 31], [-4, 31], [-4.5, 18], [-4.9, 7]], 0, -24), tone: 'lo', name: 'forearmUnder' },
    ],
  },
  // Hand round a vertical handle, seen from the back of the hand. In the hand's frame +x is up (thumb side) and
  // +y points forward along the forearm; the handle runs along x through the grip centre (0, 16).
  fist: {
    base: tr([[-3.7, -9.6], [3.7, -9.6], [5.6, -6.8], [7.2, -3], [7.3, 0.6], [6.2, 3.6], [4.8, 5.2], [2.2, 5.8], [-0.6, 5.8], [-3.2, 5.5], [-5.2, 4.6], [-6, 1.6], [-5.8, -3.6], [-4.8, -7]], 0, 16),
    regions: trRegions([
      { poly: [[-3.7, -9.6], [-4.8, -7], [-5.8, -3.6], [-4.6, -3.2], [-3.4, -8.6]], tone: 'lo', name: 'palmHeel' },
      { poly: [[3.3, -0.2], [3.3, 2.6], [4.6, 4.4], [3.4, 5.4], [2.2, 5.8], [-0.6, 5.8], [-3.2, 5.5], [-5.2, 4.6], [-6, 1.6], [-5.9, -0.4]], tone: 'lo', name: 'fingerGaps' },
      { poly: [[0.9, -0.2], [3.1, -0.4], [3.3, 2.6], [2.9, 4.9], [1.5, 5.5], [0.8, 2.8]], tone: 'hi', name: 'finger1' },
      { poly: [[-1.5, -0.2], [0.5, -0.2], [0.4, 2.8], [0.3, 5.6], [-1.3, 5.7], [-1.7, 2.8]], tone: 'hi', name: 'finger2' },
      { poly: [[-3.8, -0.2], [-1.9, -0.2], [-2, 2.8], [-2.1, 5.6], [-3.5, 5.4], [-4, 2.8]], tone: 'hi', name: 'finger3' },
      { poly: [[-5.9, -0.2], [-4.2, -0.2], [-4.4, 2.8], [-4.4, 5.2], [-5.3, 4.6], [-6, 1.6]], tone: 'hi', name: 'finger4' },
      // the thumb: a lit wedge along the top of the hand that crosses the handle and ends in front of it, over finger 1
      { poly: [[1.5, -8.6], [3.6, -6.4], [4.4, -2.6], [4, 2.2], [5.2, 3.6], [4.6, 4.4], [3.2, 2.6], [3.4, -2.6], [2.6, -6], [0.8, -7.9]], tone: 'lo', name: 'thumbCrease' },
      { poly: [[3.2, -9.4], [5.6, -6.8], [7.2, -3], [7.3, 0.6], [6.6, 2.6], [5.2, 3.6], [4, 2.2], [4.4, -2.6], [3.6, -6.4], [1.8, -8.4]], tone: 'hi', name: 'thumb' },
    ], 0, 16),
  },
  hipCap: { cloth: 'shorts', base: ngon(0, 0, 8.4) },
  thigh: {
    base: [[-8.5, -3], [8.5, -3], [8.9, 10], [8.3, 22], [6.4, 40], [4.6, 47.6], [0, 51], [-3.8, 49.8], [-6, 46], [-7.8, 32], [-8.5, 16]],
    regions: [
      { poly: [[-8.5, -3], [8.5, -3], [8.9, 10], [8.3, 22], [6.82, 36], [-7.09, 37.5], [-7.8, 32], [-8.5, 16]], cloth: 'shorts', name: 'shorts', far: true },
      { poly: [[3, -3], [8.5, -3], [8.9, 10], [8.3, 22], [6.82, 36], [3.2, 36.4]], cloth: 'shorts', tone: 'hi', muscle: 'quads' },
      { poly: [[3.2, 36.4], [6.82, 36], [6.4, 40], [4.6, 47.6], [2.4, 49.4], [1.6, 42]], tone: 'hi', muscle: 'quads' },
      { poly: [[-8.5, -3], [-3.4, -3], [-3.6, 37], [-7.09, 37.5], [-7.8, 32], [-8.5, 16]], cloth: 'shorts', tone: 'lo', muscle: 'hamstrings' },
      { poly: [[-7.09, 37.5], [-3.6, 37], [-2.8, 48.6], [-3.8, 49.8], [-6, 46]], tone: 'lo', muscle: 'hamstrings' },
      { poly: [[6.82, 36], [-7.09, 37.5], [-7.27, 36.1], [6.97, 34.6]], cloth: 'shorts', tone: 'lo', name: 'shortsHem' },
    ],
  },
  kneeCap: { base: ngon(0, 50, 6), regions: [{ poly: half(0, 50, 6, 0), tone: 'hi', name: 'patella' }] },
  shin: {
    base: [[-5.5, 49], [5.5, 49], [5.4, 60], [4.4, 80], [3.8, 94], [-4, 94], [-5.4, 84], [-7, 66], [-6.8, 58]],
    regions: [
      { poly: [[-5.5, 49], [-2, 49.5], [-2.2, 62], [-3.4, 78], [-5.4, 84], [-7, 66], [-6.8, 58]], tone: 'lo', muscle: 'calves' },
      { poly: [[2.6, 49.6], [5.5, 49], [5.4, 60], [4.4, 80], [3.8, 94], [2, 94], [2.4, 72]], tone: 'hi', name: 'shinFront' },
    ],
  },
  foot: {
    cloth: 'shoe',
    base: [[-5.6, 92.2], [3.4, 92.4], [7.4, 96.2], [13.6, 97.8], [17.2, 99.2], [17.9, 101], [17.6, 102], [-6.2, 102], [-6.8, 99], [-6.6, 95]],
    regions: [
      { poly: [[-5.6, 92.2], [3.4, 92.4], [4.4, 93.4], [-6.1, 93.6]], tone: 'lo', name: 'collar' },
      { poly: [[11, 97.2], [13.6, 97.8], [17.2, 99.2], [17.67, 100.4], [11.8, 100.4], [10.4, 98.6]], tone: 'hi', name: 'toeCap' },
      { poly: [[-6.52, 100.4], [17.67, 100.4], [17.9, 101], [17.6, 102], [-6.2, 102]], cloth: 'sole', name: 'sole' },
    ],
  },
});

// FRONT view: origin = midway between the hip joints, lifter faces the viewer.
// Screen-right side (the lifter's left) is defined; screen-left = mirror in x. Light from the front and above:
// tops of forms light, faces toward the camera mid, sides and undersides dark.
const HEAD_F = sym([[0, -12], [5.6, -11], [8.8, -7.6], [9.7, -3.8], [11.1, -3.9], [11.9, -1.4], [11.3, 2.4], [9.5, 3.6], [8.3, 6], [5.4, 9.4], [2.4, 11.2], [0, 11.6]]);
const both = (r: Region): Region[] => [r, { ...r, poly: mir(r.poly) }];
export const FR = partSet({
  joints: { hipR: [10, 0], shoulderR: [22, -62], elbowR: [22, -24], gripR: [22, 16], kneeR: [10, 50], ankleR: [10, 97], head: [0, -83] },
  neck: {
    base: [[-5.2, -80], [5.2, -80], [5.6, -73], [8.2, -67.4], [6.4, -64], [-6.4, -64], [-8.2, -67.4], [-5.6, -73]],
    regions: [
      ...both({ poly: [[5.2, -78], [5.6, -73], [8.2, -67.4], [6, -67], [4.2, -72.4]], tone: 'lo', name: 'neckSide' }),
      { poly: [[-5.4, -73.4], [5.4, -73.4], [5.6, -71], [0, -69.4], [-5.6, -71]], tone: 'lo', name: 'underChin' },
    ],
  },
  head: {
    base: tr(HEAD_F, 0, -83),
    regions: trRegions([
      { poly: sym([[0, -12], [5.6, -11], [8.8, -7.6], [9.7, -3.8], [8.7, -4.4], [7.6, -6.8], [4.6, -8.2], [0, -8.8]]), cloth: 'hair', name: 'hair' },
      { poly: [[-4.6, -11.1], [1.6, -11.9], [4.2, -10.4], [-1.8, -10]], cloth: 'hair', tone: 'hi', name: 'hairSheen' },
      { poly: sym([[0, -8.8], [4.6, -8.2], [7.6, -6.8], [8.7, -4.4], [6.4, -3.2], [0, -3.6]]), tone: 'hi', name: 'forehead' },
      ...both({ poly: [[9.7, -3.8], [11.1, -3.9], [11.9, -1.4], [11.3, 2.4], [9.5, 3.6], [9.3, 0]], tone: 'hi', name: 'ear' }),
      ...both({ poly: [[10.2, -2.6], [11.2, -1.6], [10.9, 1.6], [9.9, 2.2], [9.6, -0.4]], tone: 'lo', name: 'earInner' }),
      ...both({ poly: [[6.4, -2.6], [9.3, -3.2], [9.3, 0], [9.5, 3.6], [8.3, 6], [5.4, 9.4], [4.6, 5.6]], tone: 'lo', name: 'cheek' }),
      { poly: [[0.2, -1.4], [1.5, 3.2], [0.1, 4.1]], tone: 'lo', name: 'nose' },
    ], 0, -83),
  },
  torso: {
    cloth: 'tee',
    base: sym([[0, -65.8], [3.4, -67], [6.2, -71.2], [11.6, -69], [17.2, -66.2], [21, -62.6], [20.2, -52], [16.6, -38], [14, -26], [15, -14], [16.5, -4], [15, 4], [6, 10.5], [0, 11.5]]),
    regions: [
      { poly: sym([[0, -7], [16.05, -7], [16.5, -4], [15, 4], [6, 10.5], [0, 11.5]]), cloth: 'shorts', name: 'shorts' },
      { poly: sym([[0, -5.6], [12.6, -5.6], [13.2, -1.6], [12, 3.6], [5.4, 9.2], [0, 10.2]]), cloth: 'shorts', tone: 'hi', name: 'shortsFront' },
      { poly: [[-0.45, -5.6], [0.45, -5.6], [0.35, 8.2], [-0.35, 8.2]], cloth: 'shorts', tone: 'lo', name: 'fly' },
      { poly: [[16.05, -7], [-16.05, -7], [-16.2, -5.6], [16.2, -5.6]], cloth: 'shorts', tone: 'lo', name: 'waistband' },
      ...both({ poly: [[6.2, -71.2], [11.6, -69], [17.2, -66.2], [21, -62.6], [13, -63.4], [7.4, -67.6]], tone: 'hi', muscle: 'upperTraps' }),
      { poly: sym([[0, -65.8], [3.4, -67], [6.2, -71.2], [7.4, -70.7], [4.2, -65.6], [0, -64.4]]), tone: 'lo', name: 'collar' },
      ...both({ poly: [[16.4, -45.4], [8.6, -43.2], [1, -44.6], [1, -42.6], [8.6, -41], [15.9, -43.4]], tone: 'lo', name: 'underChest' }),
      ...both({ poly: [[20.2, -52], [16.6, -38], [15.2, -33.4], [14.8, -40.6], [16.8, -45.6], [19.9, -53]], tone: 'lo', muscle: 'lats' }),
      ...both({ poly: [[15.2, -33.4], [14, -26], [15, -14], [16.05, -7], [9.6, -7.8], [9.4, -37.6], [14.8, -40.6]], tone: 'lo', muscle: 'obliques' }),
      { poly: sym([[0, -42.6], [8.6, -41], [9.4, -37.6], [9.6, -7.8], [0, -7.4]]), muscle: 'abs' },
      ...both({ poly: [[1, -64.2], [13, -63.4], [20, -61.6], [19.9, -53], [16.4, -45.4], [8.6, -43.2], [1, -44.6]], tone: 'hi', muscle: 'chest' }),
      // secondary motion: the belly wall firms (brace) and the collarbone line shows as the shoulders stay down
      ...both({ poly: [[8.6, -38], [10, -37.8], [10.4, -9.6], [9, -9.6]], tone: 'lo', ten: true, name: 'brace' }),
      ...both({ poly: [[7.4, -67.6], [13, -63.4], [20.4, -62.4], [20.2, -61], [13, -61.5], [7, -66]], tone: 'lo', ten: true, name: 'collarbone' }),
    ],
  },
  deltoidR: {
    cloth: 'tee',
    base: tr([[-5.2, -3], [1, -4], [6, -2.5], [8.2, 2.5], [7.8, 9.5], [4.8, 14.5], [-1, 13], [-5.2, 5.5]], 22, -62),
    regions: [
      { poly: tr([[1, -4], [6, -2.5], [8.2, 2.5], [7.8, 9.5], [4.8, 14.5], [2.5, 4.5]], 22, -62), tone: 'hi', muscle: 'sideDelts' },
      { poly: tr([[-5.2, -3], [1, -4], [2.5, 4.5], [4.8, 14.5], [-1, 13], [-5.2, 5.5]], 22, -62), muscle: 'frontDelts' },
    ],
  },
  upperArmR: {
    base: tr([[-5.2, -2], [5.5, -2], [6.4, 9], [6.2, 14], [4.6, 35], [0, 39], [-4.6, 35], [-5.8, 14]], 22, -62),
    regions: [
      { poly: tr([[-5.2, -2], [5.5, -2], [6.4, 9], [6.2, 14], [5.82, 19], [-5.48, 19.6], [-5.8, 14]], 22, -62), cloth: 'tee', name: 'sleeve' },
      { poly: tr([[-2.4, 1], [2.8, 1], [3, 19.2], [-2.4, 19.45]], 22, -62), cloth: 'tee', tone: 'hi', muscle: 'biceps' },
      { poly: tr([[-2.4, 19.45], [3, 19.2], [3.2, 27], [0.4, 31.4], [-2.4, 27]], 22, -62), tone: 'hi', muscle: 'biceps' },
      { poly: tr([[-5.2, -2], [-3.4, -2], [-3.6, 19.5], [-5.48, 19.6], [-5.8, 14]], 22, -62), cloth: 'tee', tone: 'lo', muscle: 'triceps' },
      { poly: tr([[-5.48, 19.6], [-3.6, 19.5], [-3.2, 33], [-4.6, 35]], 22, -62), tone: 'lo', muscle: 'triceps' },
      { poly: tr([[5.82, 19], [-5.48, 19.6], [-5.56, 18.2], [5.93, 17.6]], 22, -62), cloth: 'tee', tone: 'lo', name: 'sleeveHem' },
    ],
  },
  elbowCapR: { base: ngon(22, -24, 4.8), regions: [{ poly: tr([[-2.6, -27.2], [-4.4, -24], [-2.6, -20.8], [-1.6, -24]], 22, 0), tone: 'lo', name: 'elbowCrease' }] },
  forearmR: {
    base: tr([[-4.8, -1], [5, -1], [6.2, 5], [6, 11], [4.8, 22], [4, 31], [-4, 31], [-4.5, 18], [-4.9, 7]], 22, -24),
    regions: [
      { poly: tr([[0.6, -1], [5, -1], [6.2, 5], [6, 11], [4.8, 22], [4, 31], [0.9, 31]], 22, -24), tone: 'hi', muscle: 'forearms' },
      { poly: tr([[-4.8, -1], [-2.8, -1], [-2.2, 31], [-4, 31], [-4.5, 18], [-4.9, 7]], 22, -24), tone: 'lo', name: 'forearmInner' },
    ],
  },
  // Hand round a dumbbell handle that points at the camera, seen from the front and a little above: the index
  // finger curls round the handle, the middle, ring and little finger knuckles step up behind it, the thumb
  // crosses the inner side. The handle and the near head are in the dumbbell group (drawn over the hand).
  fistR: {
    base: tr([[-3.6, -9.6], [3.6, -9.6], [4.8, -8.2], [5.7, -6.8], [5.3, -5.7], [6.1, -4.4], [5.7, -3.2], [6.4, -1.8], [6, -0.6], [6.5, 0.8], [6, 3], [4.4, 4.9], [1.4, 5.8], [-1.8, 5.5], [-4.2, 4], [-5.6, 1.2], [-6.1, -2.8], [-5.6, -6.4]], 22, 16),
    regions: trRegions([
      { poly: [[4.8, -8.2], [5.7, -6.8], [5.3, -5.7], [6.1, -4.4], [5.7, -3.2], [6.4, -1.8], [6, -0.6], [6.5, 0.8], [6, 3], [4.4, 4.9], [1.4, 5.8], [-1.8, 5.5], [-4.2, 4], [-5.6, 1.2], [-6.1, -2.8], [-3.2, -4.6], [1.2, -8]], tone: 'lo', name: 'grip' },
      { poly: [[4.6, -8], [5.5, -6.9], [5.1, -5.9], [1.8, -6.2], [1.5, -7.7]], tone: 'hi', name: 'finger4' },
      { poly: [[5.4, -5.5], [5.9, -4.4], [5.5, -3.4], [2, -3.8], [1.9, -5.4]], tone: 'hi', name: 'finger3' },
      { poly: [[5.6, -3], [6.2, -1.8], [5.8, -0.9], [2.2, -1.2], [2.1, -2.8]], tone: 'hi', name: 'finger2' },
      { poly: [[5.8, -0.5], [6.3, 0.8], [5.8, 2.8], [4.2, 4.5], [1.4, 5.3], [-1.8, 5], [-3.6, 3.9], [-2.6, 2.7], [-0.2, 3.3], [2, 2.7], [2.4, -0.3]], tone: 'hi', name: 'finger1' },
      { poly: [[-6, -5.6], [-4.8, -7.2], [-3.4, -5.4], [-1.4, -1.6], [-0.9, 1], [-2, 2.2], [-3.6, 1.5], [-5.4, -1.6]], tone: 'hi', name: 'thumb' },
    ], 22, 16),
  },
  thighR: {
    base: tr([[-8, -4], [8, -4], [8.4, 10], [8, 20], [6, 44], [3.6, 49], [0, 50.5], [-4, 49], [-6, 46], [-7.2, 30], [-7.6, 16]], 10, 0),
    regions: [
      { poly: tr([[-8, -4], [8, -4], [8.4, 10], [8, 20], [6.95, 34], [-7.3, 34.6], [-7.2, 30], [-7.6, 16]], 10, 0), cloth: 'shorts', name: 'shorts' },
      { poly: tr([[-5.4, -4], [5.6, -4], [6.4, 10], [6.1, 20], [5.3, 34.1], [-5.3, 34.5], [-5.8, 20], [-5.6, 10]], 10, 0), cloth: 'shorts', tone: 'hi', muscle: 'quads' },
      { poly: tr([[5.6, -4], [8, -4], [8.4, 10], [8, 20], [6.95, 34], [5.3, 34.1], [6.1, 20], [6.4, 10]], 10, 0), cloth: 'shorts', tone: 'lo', name: 'thighOuter' },
      { poly: tr([[-3.6, 34.5], [4, 34.3], [4.6, 44], [2.4, 48.2], [-1, 48.6], [-3.4, 43]], 10, 0), tone: 'hi', muscle: 'quads' },
      { poly: tr([[6.95, 34], [-7.3, 34.6], [-7.34, 33.2], [7.05, 32.6]], 10, 0), cloth: 'shorts', tone: 'lo', name: 'shortsHem' },
    ],
  },
  kneeCapR: { base: ngon(10, 50, 5.8), regions: [{ poly: half(10, 50, 5.8, 270), tone: 'hi', name: 'patella' }] },
  shinR: {
    base: tr([[-5.5, 49], [5.5, 49], [6.9, 60], [6.4, 68], [5.2, 78], [4, 94], [-4, 94], [-5, 78], [-6.4, 68], [-6.9, 60]], 10, 0),
    regions: [
      ...[1, -1].map((s): Region => ({ poly: tr(sx([[5.5, 49], [6.9, 60], [6.4, 68], [5.2, 78], [4, 94], [2.8, 92], [3.6, 74], [3.6, 56]], s), 10, 0), tone: 'lo', muscle: 'calves' })),
    ],
  },
  footR: {
    cloth: 'shoe',
    base: tr([[-4.5, 92.4], [4.5, 92.4], [7.2, 96.6], [8, 99.4], [7.6, 102], [-6.6, 102], [-7.2, 99.4], [-6.4, 96.4]], 10, 0),
    regions: [
      { poly: tr([[-4.5, 92.4], [4.5, 92.4], [5, 93.6], [-4.8, 93.6]], 10, 0), tone: 'lo', name: 'collar' },
      { poly: tr([[-4.4, 96], [4.8, 96], [7, 98.4], [7.3, 100.4], [-6.4, 100.4], [-6.6, 98.4]], 10, 0), tone: 'hi', name: 'toeCap' },
      { poly: tr([[-7, 100.4], [7.8, 100.4], [7.6, 102], [-6.6, 102]], 10, 0), cloth: 'sole', name: 'sole' },
    ],
  },
});
export const mirPart = (p: Part): Part => ({ ...p, base: mir(p.base), regions: (p.regions || []).map(r => ({ ...r, poly: mir(r.poly) })) });

// TOP view (camera above a SEATED or STANDING lifter): origin = midpoint between the
// shoulder joints, lifter faces -y (up the screen). A LYING lifter seen from above is
// the front view (the camera sees the front of the body), so it reuses FR.
export const TOP = partSet({
  joints: { shoulderR: [22, 0], elbowR: [22, 38], gripR: [22, 78], head: [0, -2] },
  torso: {
    cloth: 'tee',
    base: [[-10, -12], [10, -12], [21, -8.5], [27, -1.5], [26, 6], [20, 11], [8, 13.5], [-8, 13.5], [-20, 11], [-26, 6], [-27, -1.5], [-21, -8.5]],
    regions: [
      { poly: [[6, -7], [19, -6], [23, -1], [9, 3]], muscle: 'upperTraps' },
      { poly: mir([[6, -7], [19, -6], [23, -1], [9, 3]]), muscle: 'upperTraps' },
      { poly: [[0, 2], [9, 3], [20, 11], [8, 13.5], [0, 13.5]], tone: 'lo', muscle: 'midBack' },
      { poly: mir([[0, 2], [9, 3], [20, 11], [8, 13.5], [0, 13.5]]), tone: 'lo', muscle: 'midBack' },
    ],
  },
  head: {
    cloth: 'hair',
    base: [[0, -12], [5, -11], [8.5, -7.5], [10, -2], [8.5, 4], [4.5, 7.5], [0, 8.5], [-4.5, 7.5], [-8.5, 4], [-10, -2], [-8.5, -7.5], [-5, -11]],
    regions: [{ poly: [[-2.2, -11.6], [0, -15], [2.2, -11.6]], cloth: 'skin', name: 'nose' }, { poly: [[-8.5, 4], [-4.5, 7.5], [0, 8.5], [4.5, 7.5], [8.5, 4], [0, 1]], tone: 'hi', name: 'crown' }],
  },
  deltoidR: {
    cloth: 'tee',
    base: tr([[-5, -6], [0, -8.5], [6, -7], [8.5, -1], [7.5, 6], [3, 9], [-3, 8], [-6, 2]], 22, 0),
    regions: [
      { poly: tr([[-5, -6], [0, -8.5], [6, -7], [8.5, -1], [1, 0]], 22, 0), tone: 'hi', muscle: 'frontDelts' },
      { poly: tr([[8.5, -1], [7.5, 6], [3, 9], [-3, 8], [1, 0]], 22, 0), muscle: 'rearDelts' },
    ],
  },
  // arms seen from above = the front-view arm parts moved so the shoulder joint is at (22, 0)
  upperArmR: trPart(FR.upperArmR, 0, 62),
  elbowCapR: trPart(FR.elbowCapR, 0, 62),
  forearmR: trPart(FR.forearmR, 0, 62),
  fistR: trPart(FR.fistR, 0, 62),
});

