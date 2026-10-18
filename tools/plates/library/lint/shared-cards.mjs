// LIB-5 S6 (D-LIB5-SPLIT 1): every shown field of a shared module, linted at its ruled sheet path and kind with golden
// B's own lintHowto (imported unchanged) plus the library's medical bans. Each sheet scope a module writes (the card's
// ids, or one variant's) becomes one How-to-shaped object holding only those fields, so the kind caps, the list caps
// (SETUP_MAX_STEPS per shown list), BANNED, the LR-23 patterns and claim wiring all apply as on a real sheet.
import { lintHowto, sourceNamePatterns } from '../../layers/artifact/copy-lint.mjs';
import { medicalBans } from './index.mjs';

/** A card claim ref ('c1' or ['c4', 'c5']) as lintHowto's claim: the union of the claims' tags and sources. Null when a
 *  ref does not resolve. */
export function claimOf(card, ref) {
  const cs = (Array.isArray(ref) ? ref : [ref]).map(id => card.claims?.find(c => c.id === id));
  if (!cs.length || cs.some(c => !c)) return null;
  return { tags: [...new Set(cs.flatMap(c => c.tags ?? []))], sources: [...new Set(cs.flatMap(c => c.sources ?? []))] };
}

/** The sheet scopes of a shared module export: [{ scope, H }], each H holding the shown fields at their SPLIT paths.
 *  The card's own scope holds every field but a variant's steps; each variant's scope is the setup list its ids show
 *  (the card's steps, then the variant's). */
function scopes(card, exp) {
  const claim = c => claimOf(card, c) ?? undefined, id = s => `${card.key}${s ? `/${s}` : ''}`;
  const setup = l => l.map(s => ({ text: s.text, claim: claim(s.claim) }));
  const t = f => exp[f]?.text, handling = {}, zooms = [], H = { id: id(''), riskFlags: [], handling, zooms };
  for (const [k, f] of [['gripLine', 'gripLine'], ['gripLine', 'replacementRule'], ['cue', 'cue']]) if (t(f) !== undefined) handling[k] = t(f);
  for (const f of ['wrist', 'reason']) if (t(f) !== undefined) handling.wrist = { limitText: t(f) };
  if (t('soreWrist') !== undefined) handling.handleChoice = { sore: t('soreWrist') };
  const opts = ['thumbRule', 'alternative'].filter(f => t(f) !== undefined).map(f => ({ when: t(f) }));
  if (opts.length) handling.thumb = { options: opts };
  for (const f of ['widthNote', 'fingers', 'handContact', 'grip', 'width']) if (t(f) !== undefined) handling.width = { text: t(f) };
  if (exp.faults) handling.faults = exp.faults.map(x => ({ key: x.key, label: x.label, alt: x.what }));
  if (t('rightPose') !== undefined || t('contactPoint') !== undefined) zooms.push({ key: 'hand', ...(t('contactPoint') !== undefined ? { rightNote: t('contactPoint') } : {}), ...(t('rightPose') !== undefined ? { hand: { note: t('rightPose') } } : {}) });
  const right = exp.postureArchetype?.right?.text ?? t('defaultCrop'), wrong = exp.postureArchetype?.wrong?.text;
  if (right !== undefined || wrong !== undefined) zooms.push({ key: 'posture', caption: { ...(right !== undefined ? { right } : {}), ...(wrong !== undefined ? { wrong } : {}) } });
  if (exp.handRisks) H.risks = exp.handRisks.map((r, i) => ({ key: `handRisks${i}`, text: r.text, claim: claim(r.claim) }));
  const cps = [...(exp.checkpoints ?? []), ...(exp.defaultCheckpoints ?? [])];
  if (cps.length) H.posture = cps.map(c => ({ key: c.key, label: c.label, detail: c.detail }));
  if (exp.setup) H.setup = setup(exp.setup);
  const out = [{ scope: '', H }];
  for (const [v, va] of Object.entries(exp.variants ?? {})) out.push({ scope: v, H: { id: id(v), riskFlags: [], setup: setup([...(exp.setup ?? []), ...va.setup]) } });
  return out;
}

/** Every lint finding on a shared module export, as [{ path, rule, detail }], each path prefixed with its scope. */
export function sharedShownLint(card, exp, shared) {
  const SOURCES = Object.fromEntries((card.sources ?? []).map(s => [s.id, { cite: s.title }])), out = [];
  for (const { scope, H } of scopes(card, exp)) {
    const M = { default: H, SOURCES }, at = p => `${card.key}${scope ? `.variants.${scope}` : ''}: ${p}`;
    out.push(...lintHowto(M, shared, sourceNamePatterns([M])).violations.map(x => ({ path: at(x.path), rule: x.rule, detail: x.detail })));
    out.push(...medicalBans(M).map(x => ({ ...x, path: at(x.path) })));
  }
  return out;
}
