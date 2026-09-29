// V1-07 `contactsHeld` and `travelRange` (docs/FORM-GUIDE-PRODUCTION.md §10.5). contactsHeld re-measures every contact
// and balance a file declares (V1-04, D-FG7 (b)) on the drawn frame, at every sample of every correct rep and of the
// mistake (a point the mistake releases is not held there), by the solver's own residuals: a one-channel contact is the
// distance to its part's line, a two-channel one to its pad or moving anchor, a balance the horizontal offset. It also
// holds the follow rule: a followed part's point is kept on that part by a contact. travelRange keeps every drive's
// travel (followed, keyed, or the mistake's) between the machine's stops, 0..1 of the drawn path. Node only, no DOM.
import type { AttachmentId, ExerciseGuide } from '../model';
import type { Pt } from '../rig/ik';
import { stateAt, type Figure } from '../sample';
import { pathOff } from '../solve';
import { anchorAt, type MachineDrawing } from './machines';
import type { Rig } from './view';

/** One sampled figure: its label, rep and seconds per rep. */
export type Pass = { fig: Figure; rep: number; T: number; L: string };
export type Where = (u: number, p: Pass) => string;

type Hold = { what: string; at: AttachmentId; off: (pt: (a: AttachmentId) => Pt, travel: number[]) => number };

/** The file's contacts and balance as measures, or the reason one cannot be measured. */
function holdsOf(g: ExerciseGuide, m: MachineDrawing | null): (Hold | string)[] {
  const drives = g.machine?.drive ?? [], out: (Hold | string)[] = [];
  for (const c of g.contacts ?? []) {
    const what = `contact ${c.at} on ${c.on}`, two = Array.isArray(c.solve) && c.solve.length === 2;
    if (c.on === 'pad') {
      const pad = m?.pads?.find(x => x.attach === c.at);
      out.push(pad ? { what, at: c.at, off: pt => { const q = pt(c.at); return Math.hypot(q[0] - pad.at[0], q[1] - pad.at[1]); } } : `${what}: no pad for ${c.at} in the machine drawing`);
      continue;
    }
    const p = m?.parts[c.on], k = drives.findIndex(d => d.part === c.on);
    if (!p) { out.push(`${what}: part ${c.on} is not in the machine drawing`); continue; }
    out.push(two
      ? { what, at: c.at, off: (pt, tr) => { const q = pt(c.at), t = anchorAt(p, tr[k]!); return Math.hypot(q[0] - t[0], q[1] - t[1]); } }
      : { what, at: c.at, off: pt => Math.abs(pathOff(p, pt(c.at))) });
  }
  const b = g.balance;
  if (b) out.push({ what: `balance ${b.at} over ${b.over}`, at: b.at, off: pt => Math.abs(pt(b.at)[0] - pt(b.over)[0]) });
  return out;
}

/** contactsHeld: the failing lines and the note. `rig` solves the file; `drawn` is the rig the points are read on (the
 * same one in the check; a test draws a shifted one). */
export function contactsHeld(g: ExerciseGuide, rig: Rig, m: MachineDrawing | null, passes: Pass[], samples: number, gap: number, where: Where, drawn: Rig = rig): { fails: string[]; note: string } {
  const fails: string[] = [], contacts = g.contacts ?? [];
  for (const d of g.machine?.drive ?? []) {
    if (!('follow' in d)) continue;
    const n = contacts.filter(c => c.at === d.follow && c.on === d.part).length;
    if (!n) fails.push(`${d.follow} leads ${d.part} (follow) but 0 of ${contacts.length} contacts hold it on ${d.part}`);
  }
  const holds = holdsOf(g, m);
  holds.filter((h): h is string => typeof h === 'string').forEach(s => fails.push(s));
  const hs = holds.filter((h): h is Hold => typeof h !== 'string');
  if (!hs.length) return { fails, note: 'no contacts or balance' };
  let worst = 0;
  const seen = new Set<string>();
  for (const p of passes) {
    const rel = new Set(p.fig === 'mistake' ? g.mistake.release ?? [] : []);
    for (let i = 0; i <= samples; i++) {
      const u = i / samples, st = stateAt(g, u, p.fig, p.rep, rig), f = drawn.frame(st.pose), pt = (a: AttachmentId) => drawn.point(f, a);
      for (const h of hs) {
        if (rel.has(h.at)) continue;
        const off = h.off(pt, st.travel);
        if (off > worst || Number.isNaN(off)) worst = Number.isNaN(off) ? Infinity : off;
        if (!(off <= gap) && !seen.has(h.what + p.L)) { seen.add(h.what + p.L); fails.push(`${h.what} is ${+off.toFixed(3)} units off (limit ${gap}) at ${where(u, p)}`); }
      }
    }
  }
  return { fails, note: `${hs.length} held, worst ${+worst.toFixed(4)} units` };
}

/** travelRange: the failing lines and the note. */
export function travelRange(g: ExerciseGuide, rig: Rig | undefined, passes: Pass[], samples: number, where: Where): { fails: string[]; note: string } {
  const drives = g.machine?.drive ?? [];
  if (!drives.length) return { fails: [], note: 'no machine drive' };
  const fails: string[] = [], lo = drives.map(() => Infinity), hi = drives.map(() => -Infinity), seen = new Set<string>();
  for (const p of passes) for (let i = 0; i <= samples; i++) {
    const u = i / samples, tr = stateAt(g, u, p.fig, p.rep, rig).travel;
    drives.forEach((d, k) => {
      const t = tr[k]!;
      lo[k] = Math.min(lo[k]!, t); hi[k] = Math.max(hi[k]!, t);
      if (!(t >= 0 && t <= 1) && !seen.has(d.part + p.L)) { seen.add(d.part + p.L); fails.push(`${d.part} travel ${+t.toFixed(4)} outside the machine's stops 0..1 at ${where(u, p)}`); }
    });
  }
  return { fails, note: drives.map((d, k) => `${d.part} ${+lo[k]!.toFixed(3)}..${+hi[k]!.toFixed(3)}`).join(', ') };
}
