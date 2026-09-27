// GU-7a-2: a stand-in Guide so the player, its tests and the gate run before the rig (GU-7a-1)
// and the muscle lines (GU-7a-3) land. GU-7a-4 deletes this file and switches the imports.
// Texts are the demo's chest press (spec.md 3.1 and 2.10 at DEMO_COMMIT 3729f9b); the figure is
// a 4-polygon placeholder, not the demo's drawing. Colours are theme tokens only.
import type { MuscleId } from '../../data/muscles';
import type { Frame, GroupFrames, Guide, MoveSpec, Scheme, Stage } from '../rig/api';

/** Paint rules for the stub figure; the real one is `RIG_CSS` in rig/paint.ts (GU-7a-1). */
export const RIG_CSS = [
  '.form-guide .j{transform-box:view-box}',
  '.form-guide .t{fill:var(--tee)}',
  '.form-guide .b{fill:var(--skin)}',
  '.form-guide .olk{fill:none;stroke:var(--fg-line);stroke-width:calc(var(--sw) * 3px);stroke-linejoin:round}',
  '.form-guide .mm{fill:var(--muscle-main);stroke:color-mix(in srgb,var(--text) 35%,transparent);stroke-width:.6px;stroke-linejoin:round}',
  '.form-guide .mh{fill:var(--muscle-help);stroke:color-mix(in srgb,var(--text) 35%,transparent);stroke-width:.6px;stroke-linejoin:round}',
  '.form-guide .ovs{fill:none;stroke:var(--accent);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
  '.form-guide .floor{stroke:var(--border);stroke-width:1px}',
  '.form-guide .arrow{fill:none;stroke:var(--accent);stroke-width:3;stroke-linecap:round}',
  '.form-guide .olk,.form-guide .mm,.form-guide .mh,.form-guide .floor{vector-effect:non-scaling-stroke}',
].join('\n');

const HOT_STYLE = 'fill:transparent;stroke:transparent;stroke-width:30px;pointer-events:all;vector-effect:non-scaling-stroke';

// Regions sit 30+ units apart so each hotspot's 30 px stroke gives a full 44 px hit box at t 0 and 0.25.
const TORSO = '150,100 200,100 202,204 148,204';
const CHEST = '176,110 196,110 196,130 176,130';
const DELT = '110,130 130,130 130,150 110,150';
const TRICEPS = '110,182 130,182 130,202 110,202';

const spec: MoveSpec = {
  id: 'cp',
  exerciseId: 'lib_machine_chest_press',
  view: 'side',
  cam: 'Side view',
  rep: 4,
  caps: ['Press out, 1 s', 'Pause, don’t lock out', 'Back slowly, 2 s', 'Reset, light chest stretch'],
  tempo: '1 s out · 2 s back',
  picsLine: 'Press out 1 s, pause, back 2 s',
  srText: 'One rep: press out for 1 second, pause, back slowly for 2 seconds, reset.',
  chips: [
    { id: 'grip', label: 'Grip', caption: 'Hold the middle of the handle. Wrists straight, not bent back.' },
    { id: 'path', label: 'Path', caption: 'Handles stay at mid-chest height the whole way out and back.' },
    { id: 'seat', label: 'Seat', caption: 'Set the seat so the handles line up with the middle of your chest.' },
  ],
  pics: ['Setup: handles at mid-chest', 'Press straight out', 'Arms almost straight, no lock', 'Back slowly, 2 s'],
  picsAt: [0, 0.125, 0.31, 0.625],
  roles: { chest: 'chest', frontDelts: 'front_delts', triceps: 'triceps' },
};

const STOPS = [0, 0.25, 0.375, 0.875, 1];
const ARM: Frame[] = [
  { offset: 0, transform: 'rotate(0.0000deg)' },
  { offset: 0.25, transform: 'rotate(-60.0000deg)' },
  { offset: 0.375, transform: 'rotate(-60.0000deg)' },
  { offset: 0.875, transform: 'rotate(0.0000deg)' },
  { offset: 1, transform: 'rotate(0.0000deg)' },
];
const EFF: Frame[] = [
  { offset: 0, opacity: 0.75 },
  { offset: 0.25, opacity: 1 },
  { offset: 0.375, opacity: 1 },
  { offset: 0.875, opacity: 0.75 },
  { offset: 1, opacity: 0.75 },
];
const GROUPS: GroupFrames[] = [{ className: 'st-arm', frames: ARM }, { className: 'st-eff', frames: EFF }];

/** Linear value of a group at rep fraction u (the stub's stops are few, so no nearest-stop snap). */
function at(frames: Frame[], u: number, key: 'rot' | 'opacity'): number {
  const val = (f: Frame) => key === 'rot' ? Number(/rotate\((-?[\d.]+)deg\)/.exec(f.transform ?? '')?.[1] ?? 0) : f.opacity ?? 1;
  for (let i = 1; i < frames.length; i++) {
    const a = frames[i - 1]!, b = frames[i]!;
    if (u <= b.offset) return val(a) + (val(b) - val(a)) * ((u - a.offset) / (b.offset - a.offset || 1));
  }
  return val(frames[frames.length - 1]!);
}

const hot = (muscle: MuscleId, label: string, points: string) =>
  `<polygon class="hot" data-muscle="${muscle}" role="button" tabindex="0" aria-label="${label}" points="${points}" style="${HOT_STYLE}"/>`;

/** The rig: torso with the chest (target), an arm group with front delts and triceps (helpers).
 * `u` given: a static copy posed at u (a Pictures tile), no hotspots needed but kept for parity. */
function rig(u?: number): string {
  const armStyle = u == null ? '' : ` style="transform:rotate(${at(ARM, u, 'rot').toFixed(4)}deg)"`;
  const effStyle = u == null ? '' : ` style="opacity:${at(EFF, u, 'opacity').toFixed(4)}"`;
  return `<g id="rig-stub">`
    + `<line class="floor" x1="16" y1="258" x2="342" y2="258"/>`
    + `<polygon class="olk" points="${TORSO}"/><polygon class="t" points="${TORSO}"/>`
    + `<g class="st-eff"${effStyle}><polygon class="mm" points="${CHEST}"/></g>`
    + hot('chest', 'Chest, target muscle', CHEST)
    + `<g class="j st-arm"${armStyle}>`
    + `<polygon class="mh" points="${DELT}"/><polygon class="mh" points="${TRICEPS}"/>`
    + hot('front_delts', 'Front delts, helps', DELT) + hot('triceps', 'Triceps, helps', TRICEPS)
    + `<circle class="ov ov-grip ovs" cx="120" cy="206" r="12"/>`
    + `</g>`
    + `<path class="ov ov-path ovs" d="M150 186A36 36 0 0 0 186 150"/>`
    + `<path class="ov ov-seat ovs" d="M191 212H121V226H191"/>`
    + `</g>`;
}

const TILE_BOX = '96 104 160 158';
const ARROWS = ['', '<path class="arrow" d="M188 180L205 180"/>', '', '<path class="arrow" d="M214 180L197 180"/>'];

function stage(_scheme: Scheme): Stage {
  const tiles = spec.picsAt.map((u, i) =>
    `<div class="tile"><svg viewBox="${TILE_BOX}" aria-hidden="true">${rig(u)}${ARROWS[i]}</svg><span class="badge">${i + 1}</span><p>${spec.pics[i]}</p></div>`).join('');
  return {
    svg: `<g class="cam">${rig()}</g>`,
    tiles,
    css: [
      '.st-arm{transform-origin:150px 140px}',
      '.zoom-1 .cam{transform:translate(179px,138px) scale(2) translate(-156px,-206px)}',
      '.zoom-2 .cam{transform:translate(179px,138px) scale(1.6) translate(-165px,-165px)}',
      '.zoom-3 .cam{transform:translate(179px,138px) scale(1.7) translate(-156px,-200px)}',
      '.zoom-1 .ov-grip,.zoom-2 .ov-path,.zoom-3 .ov-seat{opacity:1}',
    ].join('\n'),
  };
}

export const stubGuide: Guide = {
  spec,
  sample: () => ({ stops: STOPS, groups: GROUPS }),
  stage,
  rigVars: (scheme: Scheme) => scheme === 'light'
    ? '--fg-line:color-mix(in srgb,var(--text) 70%,var(--surface-1));--fg-frame:color-mix(in srgb,var(--text) 56%,var(--surface-1));--lit:var(--bg);--shd:var(--text);--hi:76%;--lo:84%;--eq-hi:40%;--rim-k:35%'
    : '--fg-line:color-mix(in srgb,var(--text) 60%,var(--surface-1));--fg-frame:color-mix(in srgb,var(--text) 38%,var(--surface-1));--lit:var(--text);--shd:var(--bg);--hi:90%;--lo:78%;--eq-hi:82%;--rim-k:62%',
};

export type MuscleLine = { id: MuscleId; common: string; anatomical: string; role: 'target' | 'helps'; line: string; colorVar: string };

/** Stand-in for GU-7a-3's `muscleInfo`: spec 2.10's chest press lines, target first; [] otherwise. */
export function muscleInfo(exerciseId: string): MuscleLine[] {
  if (exerciseId !== 'lib_machine_chest_press') return [];
  return [
    { id: 'chest', common: 'Chest', anatomical: 'pectoralis major', role: 'target', line: 'Pushes the handles away; hardest as the arms straighten.', colorVar: 'var(--muscle-main)' },
    { id: 'front_delts', common: 'Front delts', anatomical: 'anterior deltoid', role: 'helps', line: 'Lifts the upper arms forward with the chest.', colorVar: 'var(--muscle-help)' },
    { id: 'triceps', common: 'Triceps', anatomical: 'triceps brachii', role: 'helps', line: 'Straightens the elbows at the end of the press.', colorVar: 'var(--muscle-help)' },
  ];
}
