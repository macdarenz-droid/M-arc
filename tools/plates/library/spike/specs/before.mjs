// ENGINE SPIKE (do not merge): what the locked engine can draw from a spike spec: the new fields stripped (root.roll,
// trunk.yaw/lat, camera.pitch, torso 'volume'), everything else unchanged.
const strip = p => { if (!p) return p; const o = { ...p };
  if (o.root && !Array.isArray(o.root)) { o.root = { ...o.root }; delete o.root.roll; }
  if (o.trunk && typeof o.trunk === 'object') o.trunk = o.trunk.flex ?? 0;
  return o; };
export const before = s => ({ ...s, id: `${s.id}__before`, torso: undefined,
  camera: s.camera ? Object.fromEntries(Object.entries(s.camera).filter(([k]) => k !== 'pitch')) : s.camera,
  poses: { start: strip(s.poses.start), end: strip(s.poses.end), ...(s.poses.via ? { via: s.poses.via.map(strip) } : {}) },
  mistake: s.mistake ? { ...s.mistake, pose: strip(s.mistake.pose) } : s.mistake });
