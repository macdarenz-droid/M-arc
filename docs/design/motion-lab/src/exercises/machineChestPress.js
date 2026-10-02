// MO: Machine Chest Press motion data. Copy reuses the approved How-to wording (src/howto/generated/*-machine-
// chest-press.ts); numbers come from docs/research/motion/lib_machine_chest_press(.verify).json, cited per field.
export default {
  id: 'lib_machine_chest_press',
  name: 'Machine Chest Press',
  machine: 'chest-press',
  // approved tempo bar: press 1 s, hold 0.3 s, return 1.5 s, rest 0.5 s
  tempo: [
    { key: 'press', label: 'Press', s: 1.0 },
    { key: 'hold', label: 'Hold', s: 0.3 },
    { key: 'return', label: 'Return', s: 1.5 },
    { key: 'rest', label: 'Rest', s: 0.5 },
  ],
  setup: {
    // upper arm to torso: 45-70 deg with horizontal handles (coach range; research posture.start.shoulder)
    flareDeg: 55,
    // blades back and down on the pad (ACE; research setup step 7)
    retractDeg: 8, depressDeg: 4,
    // wrist neutral, 0-10 deg extension target (research posture.start.wrist)
    wristExtDeg: 5,
    // handle in the heel/middle of the palm, thumb wrapped (approved grip line; research grip.horizontal)
    handle: { at: 0.47, oblique: 8, radius: 0.016 },
    // feet flat, about hip width (research setup step 5; width unverified)
    feet: { x: 0.14, zAhead: 0.03 },
    // handle spacing: start ~155% of shoulder width, converging (design choice inside Muyor 2023's 150-200%)
    startHalfWidth: 0.31, endHalfWidth: 0.22,
    // end: elbows extended but not locked (ACE, Technogym); degrees not published, 14 deg chosen and reviewed
    endElbowFlexDeg: 14,
  },
  // feel map tiers: Main chest; Helps upper chest, triceps, front shoulders (approved How-to feel section)
  tiers: { chest: 1, upper_chest: 2, triceps: 2, front_delts: 2 },
  callouts: [
    { key: 'handles', text: 'Handles mid-chest', anchor: 'handle', phases: ['rest', 'press'] },
    { key: 'blades', text: 'Blades on pad', anchor: 'blades', phases: ['press', 'hold', 'return'] },
    { key: 'elbow', text: 'Elbow soft, not locked', anchor: 'elbow', phases: ['hold'] },
  ],
  modes: {
    right: { label: 'Right' },
    seat: {
      label: 'Seat low',
      tell: 'Seat too low: handles up near your shoulders.',
      fix: 'Raise the seat until the handles meet the middle of your chest.',
      tiers: { front_delts: 3 },
      state: () => ({ seatDrop: -0.085 }),
    },
    wrist: {
      label: 'Wrist',
      view: 'grip',
      tell: 'Handle in your fingers, wrist bent back, thumb loose.',
      fix: 'Push through the heel of your palm, so your wrist stays straight.',
      state: () => ({ wristExtDeg: 32, gripAt: 0.6, thumbLoose: true }),
    },
    rolloff: {
      label: 'Roll-off',
      tell: 'Shoulders roll off the pad, elbows locked.',
      fix: 'Finish the press while your shoulder blades still touch the pad.',
      // grows over the press: blades slide forward round the ribs, the upper back peels off, elbows snap
      // straight; the pelvis stays on the seat (research mistakes[roll-off-lockout])
      state: (u) => ({ retractDeg: 8 - 30 * u, upperFlexDeg: 16 * u, keepHips: true, endElbowFlexDeg: 0 }),
    },
  },
  grip: 'Heel of your palm, thumb wrapped, wrist straight.',
  facts: [
    // Muyor 2023 (confirmed: no meaningful difference between grips)
    'Horizontal and vertical handles work the chest about the same. Pick by comfort.',
    // Haugen 2023 meta-analysis (confirmed for muscle growth)
    'Machines build as much muscle as free weights.',
    // Technogym Selection Chest Press manual p.29 (confirmed)
    'The foot bar is for getting in and out: push it to bring the handles to you, and set the weight down on it after the last rep.',
  ],
  views: {
    three: { yaw: 38, pitch: 10, dist: 3.3, target: [0.0, 0.98, 0.25] },
    side: { yaw: 90, pitch: 4, dist: 3.1, target: [0.0, 0.95, 0.3] },
    front: { yaw: 8, pitch: 6, dist: 3.2, target: [0.0, 1.0, 0.2] },
    grip: { yaw: 58, pitch: 22, dist: 0.62, target: 'handle' },
  },
};
