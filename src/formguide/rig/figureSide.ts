// FG-6: the side view (docs/FORM-GUIDE-PRODUCTION.md §3 "Views"), drawn in the FG-1 front figure's style and units: the
// same 7.5-head proportions (head top 27, hip 262, knee 440, ankle 544, floor 566 at 303 units per metre), the same
// painter (bodyPal gradients, rim light, brush lines, ink) and the same joint groups. The figure faces screen right; the
// other facing is this drawing mirrored with MIRROR about x = 200, with the sides swapped so the near limbs are the
// lifter's left (the mirror rule, pose.ts sideFrame). Every joint is <g class="fg-j j-<name>"> with its pivot as
// transform-origin, as in the front view.
//
// Draw order (§3 "Layering"): far leg, then the far arm (group fg-arms-behind, before the trunk), the trunk, the near
// leg, the hip block (pants over the pelvis, so the glute covers the thigh's root), then the near arm (group
// fg-arms-front, last). The near arm's group sits in the pelvis group so it can cover the near leg; its transform
// carries the spine and chest turn (pose.ts), so it moves as a child of the chest.
import type { MuscleId } from '@/data/muscles';
import type { JointId } from './joints';
import { bodyPal, band, lg, mix, packSl, sl, D_, L_, OC, SP, type Token, type TokenReader } from './paint';
import { MIRROR, type Mat } from './figureFront';
import { dumbbellFar, dumbbellNear } from '../parts/dumbbell';
import { barbell } from '../parts/barbell';
import { ironGrad } from '../parts/kit';

/** Pivots in the side view, figure facing right (x forward, y down). Arm pieces are drawn in their own frames. */
export const S_PELVIS: [number, number] = [200, 262], S_HIP: [number, number] = [200, 272], S_KNEE: [number, number] = [204, 440];
export const S_ANKLE: [number, number] = [200, 544], S_SH: [number, number] = [200, 134];
/** Shoulder → elbow and elbow → wrist in the arm's own frame (hanging), and the grip centre in the wrist's frame. */
export const S_ELB: [number, number] = [0, 92], S_WR: [number, number] = [0, 88], S_GRIP: [number, number] = [0, 12];
/** The far leg is drawn 6 units behind the near one, so a standing figure shows a sliver of the far foot. */
export const FAR_LEG: [number, number] = [-6, 0];
/** Sole point under the mid-foot (the foot attachment point) in the ankle's frame. */
export const S_SOLE: [number, number] = [206, 566];
/** Body points the supports meet: the upper back (bench pad, `back`), the sacrum (`hip`), the chest front (prone), the
 * bar seat on the upper traps (`shoulder_*` in the side view, the back squat). */
/** The trunk, the hip block and the arm pieces are drawn a little narrow and widened by these static x-scales (about
 * x = cx), so the side view has FG-1's mass: side depth over FG-1's front width follows the ANSUR II ratios (D-FG6). */
export const TRUNK_SX = { k: 1.2, cx: 204 } as const, HIP_SX = { k: 1.1, cx: 196 } as const, ARM_SX = 1.08;
const tx = (s: { k: number; cx: number }, x: number) => +(s.cx + s.k * (x - s.cx)).toFixed(4);
const sxAttr = (s: { k: number; cx: number }) => `matrix(${s.k} 0 0 1 ${+(s.cx * (1 - s.k)).toFixed(4)} 0)`;
export const S_BACK: [number, number] = [tx(TRUNK_SX, 167), 176], S_SACRUM: [number, number] = [tx(HIP_SX, 163), 286];
export const S_FRONT: [number, number] = [tx(TRUNK_SX, 240), 150];
/** The front of the hips (the prone contact in the pelvis's frame). */
export const S_HIP_FRONT: [number, number] = [tx(HIP_SX, 228), 280];
export const S_BAR: [number, number] = [tx(TRUNK_SX, 178), 118];

const I: Mat = [1, 0, 0, 1, 0, 0];
const T = (x: number, y: number): Mat => [1, 0, 0, 1, x, y];
export type Near = 'r' | 'l';
export type SideRig = Record<JointId, { at: Mat; origin: [number, number] }>;
/** Static placement and pivot of each joint; `near` is the side facing the viewer (r facing right, l mirrored). The near
 * shoulder is placed by its own transform (pose.ts writes its whole matrix), so its placement is I and origin 0 0. */
export function sideRig(near: Near): SideRig {
  const far: Near = near === 'r' ? 'l' : 'r';
  return {
    pelvis: { at: I, origin: S_PELVIS }, spine: { at: I, origin: [200, 272] }, chest: { at: I, origin: [200, 190] },
    neck: { at: I, origin: [200, 112] }, head: { at: I, origin: [202, 92] },
    [`shoulder_${near}`]: { at: I, origin: [0, 0] }, [`shoulder_${far}`]: { at: T(S_SH[0], S_SH[1]), origin: [0, 0] },
    [`elbow_${near}`]: { at: T(S_ELB[0], S_ELB[1]), origin: [0, 0] }, [`elbow_${far}`]: { at: T(S_ELB[0], S_ELB[1]), origin: [0, 0] },
    [`wrist_${near}`]: { at: T(S_WR[0], S_WR[1]), origin: [0, 0] }, [`wrist_${far}`]: { at: T(S_WR[0], S_WR[1]), origin: [0, 0] },
    [`hip_${near}`]: { at: I, origin: S_HIP }, [`hip_${far}`]: { at: T(FAR_LEG[0], FAR_LEG[1]), origin: S_HIP },
    [`knee_${near}`]: { at: I, origin: S_KNEE }, [`knee_${far}`]: { at: I, origin: S_KNEE },
    [`ankle_${near}`]: { at: I, origin: S_ANKLE }, [`ankle_${far}`]: { at: I, origin: S_ANKLE },
  } as SideRig;
}
/** The group each joint sits in, in the markup (the near shoulder sits in the pelvis group; see the header). */
export function sideParent(near: Near): Record<JointId, JointId | null> {
  const far: Near = near === 'r' ? 'l' : 'r';
  return {
    pelvis: null, spine: 'pelvis', chest: 'spine', neck: 'chest', head: 'neck',
    [`shoulder_${near}`]: 'pelvis', [`shoulder_${far}`]: 'chest',
    [`elbow_${near}`]: `shoulder_${near}`, [`wrist_${near}`]: `elbow_${near}`, [`elbow_${far}`]: `shoulder_${far}`, [`wrist_${far}`]: `elbow_${far}`,
    [`hip_${near}`]: 'pelvis', [`knee_${near}`]: `hip_${near}`, [`ankle_${near}`]: `knee_${near}`,
    [`hip_${far}`]: 'pelvis', [`knee_${far}`]: `hip_${far}`, [`ankle_${far}`]: `knee_${far}`,
  } as Record<JointId, JointId | null>;
}

/** The muscles the side view draws (§3 "Muscle overlays by view", side): a tint and a shimmer band each, on the near side. */
export const SIDE_MUSCLES = ['side_delts', 'front_delts', 'rear_delts', 'upper_traps', 'mid_back', 'lats', 'chest', 'upper_chest', 'triceps', 'biceps',
  'forearms', 'abs', 'core', 'obliques', 'lower_back', 'hip_flexors', 'glutes', 'quads', 'hamstrings', 'calves'] as const satisfies readonly MuscleId[];
export type SideMuscle = (typeof SIDE_MUSCLES)[number];
export type Role = 'target' | 'help' | 'quiet';

const num = (v: number) => +v.toFixed(4);
const matAttr = (m: Mat) => `matrix(${m.map(num).join(' ')})`;
const place = (m: Mat, inner: string) => (m === I ? inner : `<g transform="${matAttr(m)}">${inner}</g>`);
const rimP = (d: string, w = 4.6, cap = 'round') => `<path d="${d}" fill="none" stroke="var(--rim)" stroke-width="${w}" stroke-linecap="${cap}" stroke-linejoin="round"/>`;
const inkP = (d: string, c: string, w = 2.2) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

// ---- the drawing (figure facing right) -------------------------------------------------------------------------------
export const HEAD = 'M198 27 C214 27 225 37 227.5 52 C228.2 56 228 58.5 227.6 61 C230.5 64.5 233 68 233.6 71.2 C232 73.2 230 74 228.2 74.6 C229 77.4 229 80 228 82.5 C227.8 87 226.6 90.5 223.4 93 C219.6 96 214 97 208.6 95.4 C201 93 193 92.6 186.4 90 C178 86 173 76 172 63 C171 42 181 27 198 27 Z';
const HEAD_RIM = 'M186.4 90 C178 86 173 76 172 63 C171 42 181 27 198 27 C214 27 225 37 227.5 52';
const EAR = 'M191 58 C196 56 200 60 199.6 66 C199.2 72 195.6 75 192 73 C189.6 71 189 62 191 58 Z';
const NECK = 'M185 84 C187 96 187.4 106 185.6 118 L222.6 123 C218.4 113 215.6 103 214.4 92 Z';
export const TORSO = 'M186 108 C181 116 175 122 171 132 C165 150 164 172 167 192 C170 210 177 224 180 236 C182 246 180 254 177 262 C175 272 174 284 178 296 L214 300 L226.6 266 C229.4 256 232 246 232 234 C233 222 231.4 206 229.4 194 C229.4 188 232 182 237 176 C242 166 243.4 150 238.6 138 C234.6 128 228.6 122 222 118 Z';
const BACK_EDGE = 'M186 108 C181 116 175 122 171 132 C165 150 164 172 167 192 C170 210 177 224 180 236 C182 246 180 254 177 262';
const FRONT_EDGE = 'M226.6 266 C229.4 256 232 246 232 234 C233 222 231.4 206 229.4 194 C229.4 188 232 182 237 176 C242 166 243.4 150 238.6 138 C234.6 128 228.6 122 222 118';
const PEC = 'M214 130 C226 126 236.6 131 240.2 143 C242.8 155 241 167 236.4 176 C228.4 180.6 218.4 178.6 212 172.6 C210 158 210.4 143 214 130 Z';
// hip block (pants over the pelvis): waistband, glute and groin
export const HIPS = 'M177 256 C193 258 211 260 228 262.4 C229 272 228.6 283 225 293 C216 302 204 309 192 313.6 C180 317 168 313 164 302 C159.6 290 164 272 177 256 Z';
const BAND = 'M180 255.4 C194 257.6 211 259.6 228.2 262 L228.4 272 C211.6 270 195 268.4 179.6 266.4 C178 263 178 258.4 180 255.4 Z';
// legs (the near leg; the far one is the same drawing, shaded and set back)
export const THIGH = 'M178 282 C180 262 222 256 225 272 C232 300 232.4 350 226.4 400 C223.6 420 221.4 434 220.4 448 C219 462 191 462 189.6 448 C188.8 432 187.2 414 185.4 400 C181 360 177 320 178 282 Z';
const THIGH_EDGE = 'M225 272 C232 300 232.4 350 226.4 400 C223.6 420 221.4 434 220.4 448 M189.6 448 C188.8 432 187.2 414 185.4 400 C181 360 177 320 178 282';
export const SHIN = 'M188.4 434 C190 420 220 420 221.4 434 C222.4 470 218.4 510 213 546 L188 546 C188 535 184 520 180 500 C176 480 180 458 188.4 434 Z';
const SHIN_EDGE = 'M221.4 436 C222.4 470 218.4 510 213 546 M188 546 C188 535 184 520 180 500 C176 480 180 458 188.4 436';
const FOOT = 'M186 538 L214 538 C224 545 243 551 256 555.4 C263.6 558.4 266 562 264.4 566 L184 566 C181.6 557 181.6 546 186 538 Z';
// arm pieces, each in its own frame (pivot at 0 0, hanging +y, forward +x)
export const UA = 'M-16 -4 C-12 -14 10 -16 18 -6 C22 2 20 16 18 28 C22 44 21 64 15 84 C12.6 92 8 97 0 98 C-8 98 -13.6 94 -15 88 C-19 72 -22 50 -20.6 30 C-19.6 18 -19 4 -16 -4 Z';
export const DELT = 'M-17.4 -2 C-13 -14.4 10 -17 19.4 -6 C23.4 4 21.4 20 16 34 C12 42 6 48 1 52.4 C-4 44 -12 34 -16 22 C-19 12 -19.4 4 -17.4 -2 Z';
export const FA = 'M-13 -6 C-15.4 8 -14.4 28 -10.4 48 C-9.2 62 -8.4 72 -8 84 L8 84 C8.4 72 10 60 12 46 C16 28 17 10 13 -4 C8 -10 -8 -10 -13 -6 Z';
const FIST_D = 'M-9.4 -2 C-12.4 8 -11.4 18 -6.4 24 C-0.4 28.4 9 26.4 12.2 18 C14.2 10 12.4 2 8.4 -2 Z';

/** Each side muscle's overlay outline, in the frame of the part that draws it (arm pieces, trunk, hip block, thigh,
 * shin). The parts draw their muscles from this table, so a muscle missing here is a muscle missing from the figure. */
export const OVERLAY_D: Record<SideMuscle, string> = {
  side_delts: 'M-6 -13 C-1 -15 2 -15 4 -14.6 C5.6 12 3.6 36 1 52.4 C-2 46 -5 38 -7.4 30 C-6.4 14 -5.4 0 -6 -13 Z',
  front_delts: 'M4 -14.6 C12 -14.4 17.6 -10.6 19.4 -6 C23.4 4 21.4 20 16 34 C12 42 6 48 1 52.4 C3.6 36 5.6 12 4 -14.6 Z',
  rear_delts: 'M-17.4 -2 C-15 -8.6 -11 -11.6 -6 -13 C-5.4 0 -6.4 14 -7.4 30 C-11 26 -14.4 20 -16 14 C-18.4 8 -19 3 -17.4 -2 Z',
  upper_traps: 'M186 104 C194 110 204 118 212 126 C200 129 188 128 175 125 C179 118 183 111 186 104 Z',
  mid_back: 'M171 132 C179 130 187 134 191 141 C187 155 181 165 172 170 C167.4 159 167 145 171 132 Z',
  lats: 'M176 150 C188 146 204 150 210 160 C206 180 196 206 184 229 C178 213 172 191 170 171 C170 161 172 155 176 150 Z',
  chest: PEC,
  upper_chest: 'M214 129 C224 125.4 233.4 128.6 237.6 137.4 C230 140.4 220.6 142.4 212.4 144 C212.4 138.6 213 133.6 214 129 Z',
  triceps: 'M-8 28 C-18.4 38 -21.4 56 -17.6 76 C-15 86 -9.6 92 -4.6 92.6 C-5 70 -6 48 -8 28 Z',
  biceps: 'M8 30 C18 36 20.4 56 16.6 76 C14.4 84 9.6 88 5 88.4 C4 70 4.4 48 8 30 Z',
  forearms: 'M-12.4 -2 C-14.4 14 -12.4 30 -9.6 44 L10.6 44 C14.4 28 15.4 12 12.2 -2 C6 -7 -6 -7 -12.4 -2 Z',
  abs: 'M221 184 C229.4 190 231.4 206 231.4 222 C232.4 238 229.4 252 225.8 265 L217 264.4 C219 240 219 210 218 186 Z',
  core: 'M206 190 C218 190 229 196 230.4 220 C231.4 242 228.6 256 225.4 265 L198 263 C200 240 201 212 206 190 Z',
  obliques: 'M196 186 C208 184 220 190 224 202 C226 222 224 244 220 262 L188 262 C186 244 187 214 196 186 Z',
  lower_back: 'M170.4 196 C176.4 196 184 204 186 214 C186.4 230 184.4 246 180.4 259 C177 251 177.4 241 179 231 C175 222 170.8 210 170.4 196 Z',
  hip_flexors: 'M226.4 268 C228.4 278 226.4 290 221 298 C213 294 208.4 284 210.4 272 Z',
  glutes: 'M178 266 C166 274 161 288 165 300 C169 310 180 314 190 310 C193 296 191 278 178 266 Z',
  quads: 'M212 280 C228 296 230.4 350 224.4 400 C221.4 420 218.4 432 214 441 C206 420 204 380 205 340 C206 310 208 292 212 280 Z',
  hamstrings: 'M180 300 C183 340 186 380 190.4 432 C194.4 420 196.4 390 196.4 360 C194.4 330 188.4 310 180 300 Z',
  calves: 'M189.6 446 C180.6 460 177.6 480 181.6 500 C184.6 512 187.6 520 189.6 526 C194.6 510 196.6 480 194.6 460 C193.6 452 191.6 448 189.6 446 Z',
};
/** One overlay pair: the tint (`fg-t-`) and the shimmer band (`fg-b-`), both hidden until the player sets opacity. */
type Paint = { tint: (m: SideMuscle) => string; band: (m: SideMuscle) => string; side: Near };
const overlay = (P: Paint, m: SideMuscle) => {
  const d = OVERLAY_D[m];
  return d ? `<path class="fg-p fg-t-${m}_${P.side}" d="${d}" fill="${P.tint(m)}" opacity="0"/><path class="fg-p fg-b-${m}_${P.side}" d="${d}" fill="${P.band(m)}" opacity="0"/>` : '';
};

function upperArm(p: string, far: boolean, P: Paint | null): string {
  const a = `url(#${p}-${far ? 'aF' : 'a'})`, d = `url(#${p}-${far ? 'dF' : 'd'})`;
  const ov = P ? overlay(P, 'biceps')
    + overlay(P, 'triceps') : '';
  const delts = P ? overlay(P, 'front_delts')
    + overlay(P, 'side_delts')
    + overlay(P, 'rear_delts') : '';
  return `<g transform="scale(${ARM_SX} 1)">${rimP(UA)}<path d="${UA}" fill="${a}"/>
    ${far ? '' : `${sl([8, 32, 15, 50, 13, 80], 3.6, OC, .5, .35)}${sl([-14, 40, -16, 58, -13, 82], 2.2, SP, .45, .55)}`}${ov}
    ${inkP('M18 28 C22 44 21 64 15 84 C12.6 92 8 97 0 98 M-15 88 C-19 72 -22 50 -20.6 30', L_)}
    ${rimP('M-17.4 -2 C-13 -14.4 10 -17 19.4 -6 C23.4 4 21.4 20 16 34')}<path d="${DELT}" fill="${d}"/>${delts}
    ${far ? '' : `${sl([4, -13, 6, 12, 3, 34, 1, 50], 1.4, D_, .45)}${sl([-6, -12, -5, 8, -6, 26], 1.2, D_, .5, .7)}${sl([-12, -9, -4, -14, 6, -14.4], 2, SP, .5, .75)}`}
    ${inkP('M-17.4 -2 C-13 -14.4 10 -17 19.4 -6 C23.4 4 21.4 20 16 34 C12 42 6 48 1 52.4 C-4 44 -12 34 -16 22', L_, 2.4)}</g>`;
}
function foreArm(p: string, far: boolean, P: Paint | null, hand: string): string {
  const a = `url(#${p}-${far ? 'aF' : 'af'})`;
  return `<g transform="scale(${ARM_SX} 1)">${rimP('M-13 -6 C-15.4 8 -14.4 28 -10.4 48 C-9.2 62 -8.4 72 -8 84 M8 84 C8.4 72 10 60 12 46 C16 28 17 10 13 -4')}<path d="${FA}" fill="${a}"/>
    ${far ? '' : `${sl([9, -2, 13, 14, 11, 34, 7, 56], 1.8, SP, .45, .6)}${sl([-10, 4, -12, 22, -9, 44], 1.2, D_, .5, .6)}`}
    ${P ? overlay(P, 'forearms') : ''}
    ${inkP('M-13 -6 C-15.4 8 -14.4 28 -10.4 48 C-9.2 62 -8.4 72 -8 84 M8 84 C8.4 72 10 60 12 46 C16 28 17 10 13 -4', L_)}
    <path d="M-8.6 72 C-3 74 3 74 8.6 72 L9.4 86 C3 88 -3 88 -9.4 86 Z" fill="var(--pants-sh)" stroke="var(--ink)" stroke-width="1.6"/></g>
    ${hand}`;
}
function fist(p: string, far: boolean): string {
  return `<path d="${FIST_D}" fill="url(#${p}-${far ? 'aF' : 'af'})" stroke="var(--l)" stroke-width="2"/>
    ${far ? '' : `${sl([10, 6, 11.4, 12, 10, 18], 1.1, D_)}${sl([-4, 22, 2, 25, 8, 22], 1, D_, .5, .8)}${sl([-8, 4, -9.4, 10, -7.6, 16], 1.3, SP, .5, .5)}`}`;
}

const thigh = (p: string, far: boolean, P: Paint | null) => `
  ${rimP(THIGH_EDGE, 4.6, 'butt')}<path d="${THIGH}" fill="url(#${p}-${far ? 'pF' : 'p'})"/>
  ${far ? '' : `${sl([222, 290, 228, 340, 220, 400], 4, 'var(--pants-sh)', .5, .55)}${sl([190, 300, 188, 350, 194, 410], 2.6, 'var(--ph)', .45, .7)}${sl([200, 420, 210, 428, 220, 424], 1.4, 'var(--ph)', .5, .7)}`}
  ${P ? overlay(P, 'quads')
    + overlay(P, 'hamstrings') : ''}
  ${inkP(THIGH_EDGE, 'var(--ink)')}`;
const shin = (p: string, far: boolean, P: Paint | null) => `
  ${rimP(SHIN_EDGE, 4.6, 'butt')}<path d="${SHIN}" fill="url(#${p}-${far ? 'pF' : 'p'})"/>
  ${far ? '' : `${sl([196, 444, 208, 450, 218, 446], 1.6, 'var(--ph)', .5, .8)}${sl([184, 462, 182, 484, 186, 506], 3, 'var(--ph)', .45, .55)}${sl([214, 450, 216, 490, 211, 530], 2.4, 'var(--pants-sh)', .5, .6)}`}
  ${P ? overlay(P, 'calves') : ''}
  ${inkP(SHIN_EDGE, 'var(--ink)')}`;
const foot = (far: boolean) => `
  <path d="${FOOT}" fill="${far ? 'var(--pants-sh)' : 'var(--pants)'}" stroke="var(--ink)" stroke-width="2"/>
  ${far ? '' : sl([186, 561, 226, 562.6, 262, 561], 1.8, 'var(--ph)', .5, .9) + sl([214, 541, 232, 547, 250, 552], 1.4, 'var(--ph)', .4, .7)}`;

/** V1-06: a part held in the hands, drawn in the wrist groups at the grip centre (S_GRIP) so it moves with the hand. The
 * dumbbell is FG-5's end-on drawing in each hand (handle pointing at the viewer, the supinated curl grip; far head behind
 * the fist, near head in front), with no load label: the label would turn with the forearm, and the camera label
 * carries the load. The barbell is FG-5's end-on bar at the near hand only (the far hand's end is behind it). A bar on the
 * back is not a hand part: its caller places it (FG-6's squat still). */
export type Held = { kind: 'dumbbell' | 'barbell'; kg?: number };
function heldPart(p: string, h: Held | undefined, far: boolean): { behind: string; front: string } {
  const at = (inner: string) => (inner ? `<g transform="translate(${S_GRIP[0]} ${S_GRIP[1]})">${inner}</g>` : '');
  if (h?.kind === 'dumbbell') return { behind: at(dumbbellFar(`${p}-i`)), front: at(dumbbellNear(`${p}-i`)) };
  if (h?.kind === 'barbell' && !far) return { behind: '', front: at(barbell({ g: `${p}-i`, kg: h.kg ?? 0, view: 'side' }).svg) };
  return { behind: '', front: '' };
}

export type SideOptions = {
  /** Prefix for the gradient ids; unique per live figure on the page. */
  id: string;
  /** Facing left: the drawing mirrored about x = 200, the lifter's left side near (the mirror rule). */
  mirror?: boolean;
  /** The mistake figure: body tinted toward --mistake, keep-quiet tint in --mistake. */
  mistake?: boolean;
  /** Each drawn muscle's colour role in the exercise (default target). */
  roles?: Partial<Record<SideMuscle, Role>>;
  /** The part in the hands (V1-06), none by default. */
  held?: Held;
};

/** The side figure as SVG markup (a <g>, in the front figure's units; a standing figure fits the viewBox -88 -6 576 600). */
export function figureSide(read: TokenReader, o: SideOptions): string {
  const p = o.id, mistake = !!o.mistake, near: Near = o.mirror ? 'l' : 'r', far: Near = near === 'r' ? 'l' : 'r';
  const rig = sideRig(near), b = bodyPal(read, mistake);
  const joint = (j: JointId, inner: string) => { const r = rig[j]; return place(r.at, `<g class="fg-j j-${j}" style="transform-origin:${r.origin[0]}px ${r.origin[1]}px">${inner}</g>`); };
  const res = (t: Token) => mix(read, t, 'white', 0);
  const role = (m: SideMuscle): Role => o.roles?.[m] ?? 'target';
  const P: Paint = {
    side: near,
    tint: m => ({ target: 'var(--target)', help: 'var(--help)', quiet: mistake ? 'var(--mistake)' : 'var(--quiet)' })[role(m)],
    band: m => `url(#${p}-b${role(m)[0]!.toUpperCase()})`,
  };
  const skin: [number, string][] = [[0, b.lit], [.35, b.base], [.75, b.mid], [1, b.sh]];
  const skinFar: [number, string][] = [[0, b.mid], [.5, b.sh], [1, b.sh2]];
  const pn: [number, string][] = [[0, res('pants-hi')], [.35, res('pants')], [1, res('pants-sh')]];
  const pnFar: [number, string][] = [[0, res('pants')], [1, res('pants-sh')]];
  const arm = (s: Near) => {
    const isFar = s === far, Q = isFar ? null : P;
    const h = heldPart(p, o.held, isFar);
    return joint(`shoulder_${s}`, upperArm(p, isFar, Q) + joint(`elbow_${s}`, foreArm(p, isFar, Q, joint(`wrist_${s}`, h.behind + fist(p, isFar) + h.front))));
  };
  const leg = (s: Near) => {
    const isFar = s === far, Q = isFar ? null : P;
    return joint(`hip_${s}`, joint(`knee_${s}`, shin(p, isFar, Q) + joint(`ankle_${s}`, foot(isFar))) + thigh(p, isFar, Q));
  };
  const head = `
      ${rimP(HEAD_RIM)}<path d="${HEAD}" fill="url(#${p}-hg)"/>
      <path d="M227.6 61 C230.5 64.5 233 68 233.6 71.2 C232 73.2 230 74 228.2 74.6 C229 77.4 229 80 228 82.5 C227.8 87 226.6 90.5 223.4 93 C219.6 96 214 97 208.6 95.4 C216 92 221 86 222 78 C222.6 72 224 66 227.6 61 Z" fill="${b.sh}" opacity=".45"/>
      <ellipse cx="190" cy="42" rx="10" ry="5" transform="rotate(-28 190 42)" fill="var(--sp)" opacity=".3"/>${sl([178, 56, 180, 44, 186, 36, 194, 31], 1.4, SP, .5, .9)}
      <path d="${EAR}" fill="${b.mid}" stroke="var(--l)" stroke-width="1.5"/>${sl([193, 61, 196.6, 64, 195, 70], 1.1, D_, .5, .8)}
      <path d="M214 57.4 C216.6 55.4 220.4 55.2 223 57 C220.6 59.6 216.6 60 214 57.4 Z" fill="var(--eye)" stroke="var(--l)" stroke-width="1.3" stroke-linejoin="round"/>
      ${sl([212, 53, 219, 50.4, 226.6, 52.6], 2.4, L_, .6)}${sl([227.4, 62, 231, 67, 233, 71], 1.1, D_, .5, .7)}${sl([222, 84, 225, 83.6, 227.6, 82], 1.2, D_, .5, .8)}${sl([186, 88, 196, 91, 208, 93], 1.2, D_, .5, .6)}
      <path d="${HEAD}" fill="none" stroke="var(--l)" stroke-width="2.4"/>`;
  const neck = `
      <path d="${NECK}" fill="url(#${p}-t)"/>
      <path d="M185 84 C194 94 206 97 214.4 92 L215.4 101 C206 106 194 104 186.4 98 Z" fill="${b.occ}" opacity=".35"/>
      ${sl([212, 94, 214, 106, 220, 120], 1.4, D_, .55)}${sl([187, 90, 188, 104, 186, 116], 1.3, D_, .5)}${sl([199, 98, 206, 106, 209, 118], 2.2, SP, .45, .35)}`;
  const trunk = `
      ${rimP(BACK_EDGE)}${rimP(FRONT_EDGE)}<path d="${TORSO}" fill="url(#${p}-t)"/>
      <path d="${PEC}" fill="url(#${p}-m)"/>
      ${overlay(P, 'upper_traps')}
      ${overlay(P, 'mid_back')}
      ${overlay(P, 'lats')}
      ${overlay(P, 'lower_back')}
      ${overlay(P, 'obliques')}
      ${overlay(P, 'core')}
      ${overlay(P, 'abs')}
      ${overlay(P, 'chest')}
      ${overlay(P, 'upper_chest')}
      ${sl([212, 174, 224, 181, 237, 175], 5, OC, .45, .4)}${sl([168, 150, 164, 176, 170, 204], 4, SP, .45, .45)}
      ${sl([214, 131, 226, 127, 238, 136], 1.4, SP, .5, .6)}${sl([213, 172, 225, 179, 236.4, 176], 1.6, D_, .5, .8)}
      ${sl([222, 194, 228, 197, 231, 201], 1.2, D_, .5, .55)}${sl([222, 212, 228, 214, 232, 217], 1.2, D_, .5, .5)}${sl([222, 230, 228, 232, 232, 234], 1.1, D_, .5, .45)}
      ${sl([219, 186, 221, 220, 219, 258], 1.4, D_, .45, .55)}${sl([176, 146, 190, 150, 204, 160], 1.2, D_, .5, .55)}${sl([192, 172, 194, 200, 188, 226], 1.2, D_, .5, .45)}
      ${sl([176, 126, 180, 136, 180, 146], 1.3, D_, .5, .55)}${sl([172, 200, 176, 222, 180, 240], 1.6, D_, .45, .6)}
      <path d="${BACK_EDGE}" fill="none" stroke="var(--l)" stroke-width="2.4"/><path d="${FRONT_EDGE}" fill="none" stroke="var(--l)" stroke-width="2.4"/>`;
  const hips = `
      ${rimP('M177 256 C164 272 159.6 290 164 302 C168 313 180 317 192 313.6')}<path d="${HIPS}" fill="url(#${p}-ph)"/>
      ${overlay(P, 'glutes')}
      ${overlay(P, 'hip_flexors')}
      ${sl([168, 284, 172, 300, 184, 308], 2.6, 'var(--ph)', .45, .6)}${sl([200, 300, 212, 296, 222, 288], 2.2, 'var(--pants-sh)', .5, .6)}
      <path d="${BAND}" fill="var(--pants)" stroke="var(--ink)" stroke-width="1.8"/>${sl([180, 259, 204, 262, 226, 265], 1.3, 'var(--pants-hi)', .5, .9)}
      <path d="M177 256 C164 272 159.6 290 164 302 C168 313 180 317 192 313.6 C204 309 216 302 225 293" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round"/>`;
  const chest = `
      <g class="fg-arms-behind">${arm(far)}</g>
      ${`<g class="fg-p fg-breath" style="transform-origin:210px 170px"><g transform="${sxAttr(TRUNK_SX)}">${trunk}</g></g>`}
      ${neck}
      ${joint('neck', joint('head', head))}`;
  const ph = mix(read, 'pants-hi', 'white', 0.22);
  const fig = `
  <ellipse cx="214" cy="568" rx="84" ry="10" fill="var(--floor)"/>
  ${joint('pelvis', `
    ${leg(far)}
    ${joint('spine', joint('chest', chest))}
    ${leg(near)}
    <g transform="${sxAttr(HIP_SX)}">${hips}</g>
    <g class="fg-arms-front">${arm(near)}</g>`)}`;
  return packSl(`<g class="fg-fig fg-side" style="--l:${b.line};--d:${b.def};--oc:${b.occ};--sp:${b.spec};--rim:${b.rim};--ph:${ph}">
  <defs>${lg(p + '-t', 160, 110, 244, 150, [[0, b.lit], [.4, b.base], [.8, b.mid], [1, b.sh]], true)}${lg(p + '-m', 0, 0, .9, 1, [[0, b.lit], [.45, b.base], [1, b.sh]])}
    ${lg(p + '-a', -19, 0, 22, 0, skin, true)}${lg(p + '-af', -15, 0, 17, 0, skin, true)}${lg(p + '-aF', -19, 0, 22, 0, skinFar, true)}
    ${lg(p + '-d', -18, -14, 22, 40, [[0, b.hi], [.35, b.lit], [.75, b.base], [1, b.mid]], true)}${lg(p + '-dF', -18, -14, 22, 40, skinFar, true)}
    ${lg(p + '-p', 176, 0, 232, 0, pn, true)}${lg(p + '-pF', 176, 0, 232, 0, pnFar, true)}${lg(p + '-ph', 160, 256, 228, 300, pn, true)}
    <radialGradient id="${p}-hg" cx=".36" cy=".3" r=".85" fx=".3" fy=".22"><stop offset="0" stop-color="${b.hi}"/><stop offset=".45" stop-color="${b.base}"/><stop offset=".82" stop-color="${b.sh2}"/><stop offset="1" stop-color="${b.dk}"/></radialGradient>
    ${o.held ? ironGrad(read, p + '-i') : ''}${band(read, p + '-bT', 'target', 'y')}${band(read, p + '-bH', 'help', 'y')}${band(read, p + '-bQ', mistake ? 'mistake' : 'quiet', 'y')}</defs>
  ${o.mirror ? `<g transform="${matAttr(MIRROR)}">${fig}</g>` : fig}
</g>`);
}
