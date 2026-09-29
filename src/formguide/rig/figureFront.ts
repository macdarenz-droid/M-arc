// FG-1: the front view, ported from the Lateral Raise Lab's drawn figure (docs/design/form-guide-lab/lateral-raise-lab.html,
// "the drawn figure (front view)": TORSO_HALF, LEG_HALF, ARM, figureMarkup) and split into the 17 joint groups of §3.
// Proportions are the lab's: 7.5 heads, 1.78 m = 540 units from the top of the head (27) to the floor (567).
// Right-hand parts are drawn once and mirrored for the left; the figure faces you like your reflection (_r = screen right).
// Every joint is <g class="fg-j j-<name>"> with its pivot as transform-origin in its parent's user space; a static
// placement <g transform> sits outside it where the part is drawn in its own frame (arms, the left half).
import type { JointId } from './joints';
import { bodyPal, band, cel, lg, mix, packSl, sl, D_, L_, OC, SP, ringOf, tintMark, type BodyPal, type Token, type TokenReader } from './paint';
import { dumbbellFar, dumbbellNear } from '../parts/dumbbell';

export const P2 = 303;                                      // units per metre
export const SH_R: [number, number] = [260, 128], SH_L: [number, number] = [140, 128];
export const ELB: [number, number] = [3, 92], FIST: [number, number] = [0, 93];
export const HIP = 262, FLOOR = 566, KNEE = 440, ANKLE = 544, TRAP_X: [number, number] = [210, 258];
export const LEG_X = 228;                                   // the right leg's centre line (the left is mirrored)
/** Drawn heights of the thigh (hip → knee) and the shin with foot (knee → floor). */
export const THIGH_H = KNEE - HIP, SHIN_H = FLOOR - KNEE;

/** 2D affine matrix [a, b, c, d, e, f] as SVG/CSS matrix(). */
export type Mat = [number, number, number, number, number, number];
export const I: Mat = [1, 0, 0, 1, 0, 0];
const T = (x: number, y: number): Mat => [1, 0, 0, 1, x, y];
export const MIRROR: Mat = [-1, 0, 0, 1, 400, 0];
/** Static placement (in the parent joint's frame) and pivot of each joint in this view. */
export const FRONT_RIG: Record<JointId, { at: Mat; origin: [number, number] }> = {
  pelvis: { at: I, origin: [200, HIP] }, spine: { at: I, origin: [200, HIP] }, chest: { at: I, origin: [200, 190] },
  neck: { at: I, origin: [200, 99] }, head: { at: I, origin: [200, 90] },
  shoulder_r: { at: T(SH_R[0], SH_R[1]), origin: [0, 0] }, shoulder_l: { at: [-1, 0, 0, 1, SH_L[0], SH_L[1]], origin: [0, 0] },
  elbow_r: { at: T(ELB[0], ELB[1]), origin: [0, 0] }, elbow_l: { at: T(ELB[0], ELB[1]), origin: [0, 0] },
  wrist_r: { at: T(FIST[0], FIST[1]), origin: [0, 0] }, wrist_l: { at: T(FIST[0], FIST[1]), origin: [0, 0] },
  hip_r: { at: I, origin: [LEG_X, HIP] }, hip_l: { at: MIRROR, origin: [LEG_X, HIP] },
  knee_r: { at: I, origin: [LEG_X, KNEE] }, knee_l: { at: I, origin: [LEG_X, KNEE] },
  ankle_r: { at: I, origin: [LEG_X, ANKLE] }, ankle_l: { at: I, origin: [LEG_X, ANKLE] },
};
/** Pivots of the non-joint parts that move (breath scales the trunk drawing; traps shear; equipment stays level). */
export const PART_ORIGIN = { breath: [200, 190], trap: [0, 0], eq: [0, 0] } as const;

const num = (v: number) => +v.toFixed(4);
const matAttr = (m: Mat) => `matrix(${m.map(num).join(' ')})`;
const place = (m: Mat, inner: string) => (m === I ? inner : `<g transform="${matAttr(m)}">${inner}</g>`);
/** A joint group: static placement, then the animated group with its pivot. */
const joint = (j: JointId, inner: string) => { const r = FRONT_RIG[j]; return place(r.at, `<g class="fg-j j-${j}" style="transform-origin:${r.origin[0]}px ${r.origin[1]}px">${inner}</g>`); };
/** A moving part that is not a joint (only transform or opacity is animated on it). */
const part = (name: string, origin: readonly [number, number], inner: string) => `<g class="fg-p fg-${name}" style="transform-origin:${origin[0]}px ${origin[1]}px">${inner}</g>`;
const M = matAttr(MIRROR);

const rimP = (d: string, w = 4.6, cap = 'round') => `<path d="${d}" fill="none" stroke="var(--rim)" stroke-width="${w}" stroke-linecap="${cap}" stroke-linejoin="round"/>`;

// Right half of the trunk, mirrored for the left. s picks the shading so both halves take light from the top left.
const TORSO_HALF = (p: string, s: 'R' | 'L') => { const m = `url(#${p}-m${s})`, R = s === 'R'; return `
  <path d="M231 188 C241 186 251 186 259 186 C254 200 248 214 245 228 C243 238 245 248 247 258 C240 252 233 251 226 255 C231 234 233 210 231 188 Z" fill="${m}"/>
  <path d="M201 126 C214 126.5 230 124.5 252 121 C259 129 264 137 267 146 C260 160 250 172 236 180 C224 186 211 186 201 183 Z" fill="${m}"/>
  <path d="M202 185 C212 184 224 185 231 189 C232 194 231 198 230 201 C221 204 210 204 202 202 Z" fill="${m}"/>
  <path d="M202 204 C212 206 222 205 230 203 C232 209 232 214 231 218 C221 221 210 221 202 219 Z" fill="${m}"/>
  <path d="M202 221 C212 223 222 222 231 220 C232 226 232 231 230 235 C221 238 210 238 202 236 Z" fill="${m}"/>
  <path d="M202 238 C212 240 222 239 230 237 C229 245 226 253 220 260 C214 263 207 265 202 266 Z" fill="${m}"/>
  ${sl([203, 186, 226, 192, 252, 178, 266, 153], 7, OC, .42, .38)}
  ${sl([266, 150, 268, 168, 262, 184, 254, 200], R ? 6 : 3, OC, .4, R ? .32 : .18)}
  ${sl([243, 238, 237, 250, 226, 259, 213, 268], 5, OC, .4, .3)}
  ${sl([202, 183, 226, 189, 252, 175, 267, 148], 2.8, L_, .4)}
  ${sl([203, 126.5, 218, 127, 238, 123.5], 1.3, D_, .35, .75)}
  ${sl([251, 123, 259, 130, 266, 146], 1.3, D_, .5)}
  ${sl([226, 146, 242, 146, 258, 146], 1, D_, .7, .4)}${sl([232, 166, 246, 160, 260, 151], 1, D_, .7, .4)}
  ${sl([267, 150, 268, 166, 263, 182, 256, 196], 1.4, D_, .4)}
  ${sl([265, 160, 258, 166, 249, 172], 1.4, D_, .35)}${sl([264, 172, 257, 178, 248, 184], 1.4, D_, .35)}${sl([261, 184, 254, 190, 247, 196], 1.3, D_, .35)}${sl([257, 196, 251, 201, 245, 206], 1.1, D_, .35)}
  ${sl([252, 204, 246, 211, 239, 216], 1, D_, .45, .55)}${sl([249, 216, 244, 222, 238, 226], 1, D_, .45, .5)}
  ${sl([231, 187, 234, 210, 233, 232, 226, 255], 1.7, D_, .45)}
  ${sl([204, 205.6, 216, 208.8, 228, 203.6], 3.6, OC, .35, .4)}${sl([204, 222.6, 216, 225.8, 229, 220.6], 3.6, OC, .35, .4)}${sl([204, 239.6, 216, 242.8, 228, 237.6], 3.4, OC, .35, .38)}${sl([203, 203, 216, 206, 230, 200], 2.3, D_, .35)}${sl([203, 220, 216, 223, 231, 217], 2.3, D_, .35)}${sl([203, 237, 216, 240, 230, 234], 2.1, D_, .35)}
  ${sl([245, 234, 241, 246, 230, 257, 215, 268], 2.2, L_, .35)}
  ${R ? sl([206, 133, 214, 128.5, 227, 128.5], 2.4, SP, .4, .5) : sl([228, 134, 240, 132, 252, 138], 2.4, SP, .5, .55)}
  ${R ? sl([204, 188, 209, 186.5, 214, 187], 1.3, SP, .5, .4) : sl([218, 188, 224, 187, 229, 191], 1.5, SP, .5, .5)}
  ${R ? '' : sl([219, 206, 225, 205.5, 229, 208], 1.3, SP, .5, .45) + sl([219, 223, 225, 222.5, 229, 225], 1.3, SP, .5, .4) + sl([262, 152, 263, 166, 259, 180], 1.6, SP, .5, .4)}`; };

// The lab's LEG_HALF split at the knee (y 438-440) and the ankle (544) into thigh, shin and foot. The leg rims end in
// butt caps so the split reads as one line; their outer ends sit under the trunk and the shoe as before.
const THIGH_EDGE_OUT = 'M251 262 C256 290 257 328 253 366 C249 396 246 416 245 438';
const THIGH_EDGE_IN = 'M211 440 C210 416 208 394 206 368 C205 356 204.5 348 204 342';
const SHIN_EDGE = 'M245 438 C244 470 243 506 242 544 M215 544 C214 506 212 472 211 440';
const THIGH_FILL = 'M200 262 L251 262 C256 290 257 328 253 366 C249 396 246 416 245 438 L211 440 C210 416 208 394 206 368 C204 344 202 322 200 306 Z';
const THIGH_INK = 'M211 440 C210 416 208 394 206 368 C204 344 202 322 200 306 L200 262 L251 262 C256 290 257 328 253 366 C249 396 246 416 245 438';
const SHIN_FILL = 'M245 438 C244 470 243 506 242 544 L215 544 C214 506 212 472 211 440 Z';
const SHIN_INK = 'M245 438 C244 470 243 506 242 544 L215 544 C214 506 212 472 211 440';
const THIGH = (p: string, s: 'R' | 'L', cl: string) => { const R = s === 'R', H = 'var(--ph)', S = 'var(--pants-sh)'; return `
  ${rimP(THIGH_EDGE_OUT + ' ' + THIGH_EDGE_IN, 4.6, 'butt')}
  <path d="${THIGH_FILL}" fill="url(#${p}-p${s})"/>
  ${R ? sl([246, 292, 250, 340, 243, 400], 4, S, .5, .6) : sl([206, 318, 209, 368, 212, 410], 3, S, .5, .5)}
  ${R ? sl([214, 300, 220, 350, 218, 400], 2.6, H, .45, .72) : sl([248, 290, 250, 340, 244, 396], 2.6, H, .45, .72)}
  ${sl([206, 292, 218, 284, 232, 280], 1.4, H, .5, .72)}${sl([207, 306, 220, 298, 234, 294], 1.1, H, .5, .72)}
  ${sl([214, 418, 228, 424, 243, 418], 1.5, H, .5, .72)}${sl([215, 428, 228, 433, 242, 428], 1.2, S, .5, .9)}
  <path d="${THIGH_INK}" fill="none" stroke="${cl}" stroke-width="2.2" stroke-linejoin="round"/>`; };
const SHIN = (p: string, s: 'R' | 'L', cl: string) => { const R = s === 'R', H = 'var(--ph)'; return `
  ${rimP(SHIN_EDGE, 4.6, 'butt')}
  <path d="${SHIN_FILL}" fill="url(#${p}-p${s})"/>
  ${R ? sl([219, 448, 221, 490, 221, 530], 2, H, .4, .72) : sl([240, 448, 239, 490, 238, 530], 2, H, .4, .72)}
  ${sl([217, 516, 228, 520, 240, 515], 1.2, H, .5, .72)}${sl([216, 530, 228, 534, 241, 529], 1.2, H, .5, .72)}
  <path d="${SHIN_INK}" fill="none" stroke="${cl}" stroke-width="2.2" stroke-linejoin="round"/>`; };
const FOOT = (cl: string) => `
  <path d="M213 544 L242 544 C249 549 253 557 251 566 L207 566 C205 557 206 549 213 544 Z" fill="var(--pants)" stroke="${cl}" stroke-width="2"/>
  ${sl([207, 561, 229, 562.5, 251, 561], 1.8, 'var(--ph)', .5, .9)}`;
const LEG = (p: string, s: 'R' | 'L', side: 'r' | 'l', cl: string) => joint(`hip_${side}`, joint(`knee_${side}`, SHIN(p, s, cl) + joint(`ankle_${side}`, FOOT(cl))) + THIGH(p, s, cl));

const TRAP_PATH = 'M210 88 C218 94 234 101 246 108 C253 112 258 117 258 125 C250 126.5 240 125.5 232 121.5 C224 117 216 108 212.5 100 C211 96 210 92 210 88 Z';

type Dumbbell = { kg?: number } | null;
// One arm (lab ARM), local frame: pivot at the shoulder joint, hanging down +y, outward +x.
function ARM(p: string, s: 'R' | 'L', db: Dumbbell, b: BodyPal): string {
  const side = s === 'R' ? 'r' : 'l';
  const a = `url(#${p}-a)`, am = `url(#${p}-am)`,
    ink = (d: string, w = 2.3) => `<path d="${d}" fill="none" stroke="var(--l)" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`,
    UA = 'M-15 6 C-17 22 -18 34 -19 48 C-20 62 -15 80 -10 94 C-4 99 10 99 15 94 C21 82 27 64 26 50 C24 36 21 24 20 6 Z',
    UI = 'M-19 36 C-19.1 40 -19 44 -19 50 C-19 64 -15 80 -10 94', UO = 'M20 14 C21 26 24 38 26 50 C27 64 21 82 15 93',
    TW = 'M-13 -1 C-18 2 -22 9 -22.4 17 C-22.6 25 -21 31 -19 38 L-10 38 L-10 -1 Z', TWO = 'M-17.4 5 C-20.6 9 -22.2 13 -22.4 18 C-22.6 25 -21 31 -19 38',
    FA = 'M-15 -6 C-18 8 -18 26 -13 44 C-11 54 -10 62 -9 70 L9 70 C10 62 12 52 15 40 C19 26 19 10 18 5 C17.3 2.4 16.2 0 15.7 -3 C15.2 -6.2 15.5 -9.8 16 -12.2 C16.3 -13.4 16.6 -14.6 17.1 -16.8 C11 -17.5 -9 -12 -15 -6 Z',
    FI = 'M-15 -6 C-18 8 -18 26 -13 44 C-11 54 -10 62 -9 68', FO = 'M17.1 -16.8 C16.6 -14.6 16.3 -13.4 16 -12.2 C15.5 -9.8 15.2 -6.2 15.7 -3 C16.2 0 17.3 2.4 18 5 C19 10 19 26 15 40 C12 52 10 62 9 68',
    FOr = 'M15.4 -6 C15.3 -5 15.4 -4 15.7 -3 C16.2 0 17.3 2.4 18 5 C19 10 19 26 15 40 C12 52 10 62 9 68', FIr = 'M-15.8 -2 C-17.6 8 -18 26 -13 44 C-11 54 -10 62 -9 68',
    DA = 'M-15 -2 C-11 -8 -3 -12 6 -12 C11 -12 16 -11 20 -8 C24 -4 25.5 3 25 12 C24.6 21 23.4 29 21.5 36 C17 44 11 50 6 56 C0 48 -8 36 -13 24 C-17 16 -18 6 -15 -2 Z',
    DF = 'M-15 -2 C-11 -8 -3 -12 6 -12 C8 8 9 32 6 56 C0 48 -8 36 -13 24 C-17 16 -18 6 -15 -2 Z',
    DS = 'M6 -12 C11 -12 16 -11 20 -8 C23 6 23 26 17 40 C13 46 9 51 6 56 C9 32 8 8 6 -12 Z',
    DP = 'M20 -8 C24 -4 25.5 3 25 12 C24.6 21 23.4 29 21.5 36 C17 44 11 50 6 56 C9 51 13 46 17 40 C23 26 23 6 20 -8 Z';
  // The library dumbbell (FG-5, src/formguide/parts/dumbbell.ts): far head behind the forearm, near head in the wrist.
  const eqFar = db ? `<g transform="translate(${FIST[0]} ${FIST[1]})">${part(`eqf_${side}`, [0, 0], dumbbellFar(`${p}-i`))}</g>` : '';
  const eqNear = db ? part(`eq_${side}`, [0, 0], dumbbellNear(`${p}-i`)) : '';
  const hand = `<g transform="translate(0 ${-FIST[1]})">
      <path d="M-11 77 C-15 86 -14 98 -7 105 C0 110 10 107 13 99 C15 90 12 81 8 77 Z" fill="url(#${p}-af)" stroke="var(--l)" stroke-width="2"/>
      ${sl([-8, 86, 0, 88, 9, 85], 1.1, D_)}${sl([-9, 93, 0, 95, 10, 92], 1.1, D_)}${sl([-7, 100, 0, 102, 8, 99], 1, D_)}</g>`;
  const fore = `
      ${eqFar}
      ${rimP(FOr)}${rimP(FIr)}<path d="${FA}" fill="url(#${p}-af)"/>
      <path d="M3 -6 C12 -4 18 10 17 26 C16 38 11 48 6 58 C5 40 3 18 3 -6 Z" fill="${am}"/>
      ${sl([-9, -5, -3, -1, 4, -4], 1.2, D_, .5, .8)}${sl([3, -3, 4, 20, 5, 40, 6, 57], 1.3, D_, .45)}${sl([-6, 30, -8, 40, -8, 50, -7, 60], .9, D_, .5, .6)}
      ${sl([9, 2, 13, 10, 14, 18, 13, 28], 1.8, SP, .45, .65)}${sl([-10, 6, -12, 18, -10, 32], 1.2, SP, .5, .35)}
      ${ink(FI)}${ink(FO)}
      <path d="M-10.5 62 C-4 64 4 64 10.5 62 L11.5 76 C4 78 -4 78 -11.5 76 Z" fill="var(--pants-sh)" stroke="${b.cloth}" stroke-width="1.6"/>
      ${sl([-9, 65.5, 0, 67.5, 9, 65.5], 1.4, 'var(--pants-hi)', .5)}
      ${joint(`wrist_${side}`, hand + eqNear)}`;
  return `
    ${rimP(TWO)}<path d="${TW}" fill="${a}"/>
    ${rimP(UO)}${sl([-19, 50, -19.2, 55, -19.1, 59, -19, 63], 4.6, 'var(--rim)', .97)}${rimP('M-19 62 C-18.5 70 -15 80 -10 94')}<path d="${UA}" fill="${a}"/>
    <path d="M3 34 C-8 30 -19 40 -19 56 C-19 70 -14 84 -9 92 C-3 98 5 97 8 92 C6 78 5 60 3 34 Z" fill="url(#${p}-ab)"/>
    <path d="M8 32 C18 32 26 42 26 56 C26 70 20 82 14 94 C12 97 9 96 8 92 C6 78 4 60 3 42 C3 36 5 33 8 32 Z" fill="${am}"/>
    ${sl([4, 36, 6, 56, 7, 74, 9, 93], 1.4, D_, .5)}${sl([16, 70, 13, 78, 11, 86, 10, 92], 1, D_, .5, .6)}${sl([-14, 19, -16.5, 24, -18.2, 30, -19, 36], 1, D_, .75, .7)}
    ${sl([-13, 46, -15.5, 54, -15.5, 62, -13, 72], 2.2, SP, .45, .7)}${sl([19, 52, 21, 58, 21, 66, 19, 74], 1.3, SP, .5, .45)}
    ${ink(TWO, 2.1)}${ink(UI)}${ink(UO)}
    ${joint(`elbow_${side}`, fore)}
    ${sl([-14, 27, -7, 40, 0, 51, 6, 60], 5, OC, .6, .32)}${sl([6, 60, 11, 54, 16, 47, 22.5, 39], 4, OC, .35, .26)}
    ${rimP('M6 -12 C11 -12 16 -11 20 -8 C24 -4 25.5 3 25 12 C24.6 21 23.8 27 23 31')}
    <path d="${DA}" fill="${a}"/><path d="${DF}" fill="url(#${p}-dA)"/><path d="${DS}" fill="url(#${p}-dL)"/><path d="${DP}" fill="url(#${p}-dP)"/>
    ${tintMark(`front_delts_${side}`, DF, 'var(--help)', ringOf(b, 'D', 'help'))}
    ${tintMark(`side_delts_${side}`, DS, 'var(--target)', ringOf(b, 'K', 'target'))}
    <path class="fg-p fg-b-side_delts_${side}" d="${DS}" fill="url(#${p}-shS)" opacity="0"/>
    ${sl([6, -11, 8, 8, 9, 32, 6.5, 54], 1.5, D_, .4)}${sl([20, -7, 23, 6, 23, 26, 17, 40], 1.2, D_, .45)}
    ${sl([-11, -1, -5, -8, 3, -9.5], 2, SP, .5, .75)}${sl([11, -8.5, 16, -6.5, 20, -1], 1.6, SP, .5, .6)}${sl([14, 4, 15.5, 12, 15.5, 20, 14, 28], 1.3, SP, .5, .35)}
    ${sl([6.5, 55, 1, 48, -7, 37, -13, 24], 1.1, L_, .8, .85)}${sl([22, 35, 18, 42, 12, 49, 6.5, 55], 1.1, L_, .2, .7)}${sl([-13, 24, -17, 16, -18, 6, -15, -2], 2, L_, .45)}
    ${ink('M-15 -2 C-11 -8 -3 -12 6 -12 C11 -12 16 -11 20 -8 C24 -4 25.5 3 25 12 C24.6 21 23.8 27 23 31', 2.6)}${sl([23.4, 29, 22.8, 33, 22.2, 35.5, 21.5, 37], 2, L_, .1)}`;
}

export type FrontOptions = {
  /** Prefix for the gradient ids; unique per live figure on the page. */
  id: string;
  /** The mistake figure: body tinted toward --mistake, keep-quiet tint in --mistake. */
  mistake?: boolean;
  /** A dumbbell in each hand (the lab's). The load is not drawn on it (V1-07, D-V1-07b: no label reaches 11 px and 4.5:1 on the iron at 360 px); the player's readout shows it. `kg` is kept for the caller. */
  dumbbell?: Dumbbell;
};

/** The front figure as SVG markup (a <g>, in the lab's units; the lab frames it with viewBox -80 -6 560 600). */
export function figureFront(read: TokenReader, o: FrontOptions): string {
  const p = o.id, mistake = !!o.mistake, db = o.dumbbell ?? null;
  const b = bodyPal(read, mistake);
  const res = (t: Token) => mix(read, t, 'white', 0);      // a token resolved (gradient stops, as the lab)
  const pn: [number, string][] = [[0, res('pants')], [.25, res('pants-hi')], [.55, res('pants')], [1, res('pants-sh')]];
  const mm: [number, string][] = [[0, b.lit], [.35, b.base], [.75, b.mid], [1, b.sh]];
  const skin: [number, string][] = [[0, b.sh], [.3, b.base], [.55, b.lit], [.85, b.base], [1, b.mid]];
  const TORSO = 'M200 99 C210 99 218 97 224 99 C234 102 244 108 252 114 C257 116 263 118 268 123 C270 128 271 138 270 146 C268 160 264 172 258 186 C254 200 248 214 245 228 C243 238 245 248 247 258 L248 270 L152 270 L153 258 C155 248 157 238 155 228 C152 214 146 200 142 186 C136 172 132 160 130 146 C129 138 130 128 132 123 C137 118 143 116 148 114 C156 108 166 102 176 99 C182 97 190 99 200 99 Z';
  const SIDE = 'M252 114 C257 116 263 118 268 123 C270 128 271 138 270 146 C268 160 264 172 258 186 C254 200 248 214 245 228 C243 238 245 248 247 258';
  const HEAD = 'M200 27 C219 27 228 41 228 58 C228 71 224 81 218 88 C212 95 206 99 200 99 C194 99 188 95 182 88 C176 81 172 71 172 58 C172 41 181 27 200 27 Z';
  // V1-07 (D-V1-07c): the trap's brush strokes are drawn over its tint (the delts' already are), so the tint lies on the
  // muscle's gradient alone and its boundary reads against that; at rest the tint is hidden and the drawing is the lab's.
  const trap = (s: 'R' | 'L') => { const side = s === 'R' ? 'r' : 'l'; return `<path d="${TRAP_PATH}" fill="url(#${p}-m${s})"/><path d="M230 120.5 C238 124.6 248 126.3 258 125 L258 117.5 C250 118.6 240 119.4 230 120.5 Z" fill="${b.sh}" opacity=".3"/>
        ${tintMark(`upper_traps_${side}`, TRAP_PATH, mistake ? 'var(--mistake)' : 'var(--quiet)', ringOf(b, 'K', 'quiet'))}<path class="fg-p fg-b-upper_traps_${side}" d="${TRAP_PATH}" fill="url(#${p}-shT)" opacity="0"/>
        ${sl([214, 102, 224, 116, 242, 125, 256, 125.5], 1.3, D_, .5, .7)}${sl([221, 98, 234, 104, 248, 111], 1.5, SP, .45, .5)}
        <path d="M217 93 C228 99 238 104 246 108 C253 112 258 117 258 124" fill="none" stroke="var(--rim)" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M210 88 C218 94 234 101 246 108 C253 112 258 117 258 125" fill="none" stroke="var(--l)" stroke-width="2.4" stroke-linecap="round"/>`; };
  // Pants gradients: the lab's objectBoundingBox gradients over the whole leg, fixed to that box in user space
  // (x 200-255.5, y 262-544) so splitting the leg at the knee keeps the same stripes.
  const pantsGrad = (id: string, x1: number, x2: number) => lg(id, x1, HIP, x2, HIP + 0.1 * (ANKLE - HIP), pn, true);
  const head = `
        <path d="M180 86 C175 80 172 71 172 58 C172 41 181 27 200 27 C219 27 228 41 228 58 C228 71 225 80 220 86" fill="none" stroke="var(--rim)" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${HEAD}" fill="url(#${p}-hg)"/>
        <path d="M226 48 C229 60 226 76 218 88 C212 95 206 99 200 99 C209 94 216 84 219 72 C221 62 223 54 226 48 Z" fill="${b.sh}" opacity=".5"/>
        ${sl([224, 70, 219, 84, 207, 95], 1.2, D_, .5, .6)}${sl([176, 70, 181, 84, 193, 95], 1, D_, .5, .3)}
        <ellipse cx="188" cy="41" rx="9" ry="4.6" transform="rotate(-38 188 41)" fill="var(--sp)" opacity=".3"/>${sl([181.5, 51, 182.5, 43, 186.5, 36.5, 193, 32.5], 1.4, SP, .5, .9)}
        <path d="M203 61 C209 60 216 56 222 52 C222 59 218 65 211 65 C207 65 204 63 203 61 Z M197 61 C191 60 184 56 178 52 C178 59 182 65 189 65 C193 65 196 63 197 61 Z" fill="var(--eye)" stroke="var(--l)" stroke-width="1.3" stroke-linejoin="round"/>
        ${sl([202, 61.5, 212, 58.5, 223, 51], 2.6, L_, .6)}${sl([198, 61.5, 188, 58.5, 177, 51], 2.6, L_, .6)}
        <path d="${HEAD}" fill="none" stroke="var(--l)" stroke-width="2.4"/>`;
  const trunk = `
        <path d="${SIDE}" fill="none" stroke="var(--rim)" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/><path d="${SIDE}" transform="${M}" fill="none" stroke="var(--rim)" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${TORSO}" fill="url(#${p}-t)"/>
        ${TORSO_HALF(p, 'R')}<g transform="${M}">${TORSO_HALF(p, 'L')}</g>
        ${sl([200, 128, 200, 154, 200, 183], 1.2, D_, .6, .7)}${sl([200, 185, 199.6, 215, 200, 256], 2.2, D_, .45, .95)}
        <path d="M198.4 239 C198 242 199 245.5 200 246 C201 245.5 202 242 201.6 239 C201 238 199 238 198.4 239 Z" fill="var(--l)"/>
        <path d="${SIDE}" fill="none" stroke="var(--l)" stroke-width="2.4"/><path d="${SIDE}" transform="${M}" fill="none" stroke="var(--l)" stroke-width="2.4"/>
        <path d="M152 257 C184 262 216 262 248 257 L249 270 C216 274 184 274 151 270 Z" fill="var(--pants)" stroke="${b.cloth}" stroke-width="1.8"/>
        ${sl([156, 260.5, 200, 265, 244, 260.5], 1.3, 'var(--pants-hi)', .5, .9)}`;
  const neckBase = `
      <path d="M185 84 C184 98 181 112 176 125 C184 126 192 126 200 127 C208 126 216 126 224 125 C219 112 216 98 215 84 Z" fill="url(#${p}-t)"/>
      ${sl([214, 111, 224, 119, 236, 121.5], 4, OC, .45, .28)}${sl([186, 111, 176, 119, 164, 121.5], 4, OC, .45, .28)}
      <path d="M184 90 C192 100 208 100 216 90 L217 103 C208 108 192 108 183 103 Z" fill="${b.occ}" opacity=".35"/>
      ${sl([212, 93, 210, 110, 204, 124], 1.4, D_, .55)}${sl([188, 93, 190, 110, 196, 124], 1.4, D_, .55)}${sl([191, 101, 193, 110, 196.5, 118], 1.3, SP, .5, .35)}${sl([196, 121.5, 200, 125.5, 204, 121.5], 1.3, D_, .5)}`;
  // Draw order is the lab's: trunk, neck, traps, head, arms. The neck's base is drawn on the chest so the traps
  // overlap it and the head overlaps the traps, as in the lab; the neck joint carries the head.
  const chest = `${neckBase}
      ${part('trap_r', [0, 0], trap('R'))}
      ${part('trap_l', [0, 0], `<g transform="${M}">${trap('L')}</g>`)}
      ${joint('neck', joint('head', head))}
      <g class="fg-arms-front">${joint('shoulder_r', ARM(p, 'R', db, b))}${joint('shoulder_l', ARM(p, 'L', db, b))}</g>`;
  const ph = mix(read, 'pants-hi', 'white', 0.22);
  return packSl(`<g class="fg-fig" style="--l:${b.line};--d:${b.def};--oc:${b.occ};--sp:${b.spec};--rim:${b.rim};--ph:${ph}">
  <defs>${lg(p + '-mR', 0, 0, .9, 1, mm)}${lg(p + '-mL', 1, 0, .1, 1, mm)}
    ${lg(p + '-t', 128, 100, 272, 150, [[0, b.mid], [.12, b.lit], [.45, b.base], [.8, b.mid], [1, b.sh]], true)}${lg(p + '-a', -20, 0, 27, 0, skin, true)}${lg(p + '-af', -23, 0, 19, 0, skin, true)}${lg(p + '-ab', 0, 0, 1, 0, skin)}
    ${lg(p + '-am', 0, 0, 1, .4, [[0, b.mid], [.3, b.lit], [.65, b.base], [1, b.sh]])}${lg(p + '-dA', .2, 0, .6, 1, [[0, b.hi], [.3, b.lit], [.7, b.base], [1, b.mid]])}${lg(p + '-dL', 0, 0, 1, .5, [[0, b.lit], [.5, b.base], [1, b.mid]])}${lg(p + '-dP', 0, 0, 1, .3, [[0, b.mid], [1, b.sh]])}
    <radialGradient id="${p}-hg" cx=".36" cy=".3" r=".85" fx=".3" fy=".22"><stop offset="0" stop-color="${b.hi}"/><stop offset=".45" stop-color="${b.base}"/><stop offset=".82" stop-color="${b.sh2}"/><stop offset="1" stop-color="${b.dk}"/></radialGradient>${pantsGrad(p + '-pR', 200, 255.5)}${pantsGrad(p + '-pL', 255.5, 200)}
    ${cel(p + '-i', res('iron-hi'), res('iron'), res('iron-sh'), 0.6)}
    ${band(read, p + '-shS', 'target', 'y')}${band(read, p + '-shT', mistake ? 'mistake' : 'quiet', 'x')}</defs>
  <ellipse cx="200" cy="568" rx="92" ry="11" fill="var(--floor)"/>
  ${joint('pelvis', `
    ${LEG(p, 'R', 'r', b.cloth)}${LEG(p, 'L', 'l', b.cloth)}
    ${joint('spine', `${part('breath', PART_ORIGIN.breath, trunk)}${joint('chest', chest)}`)}`)}
</g>`);
}
