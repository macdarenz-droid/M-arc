// LIB-5 S1: the 38 shared research files (19 cards, 19 quote files) are byte copies of the named research head
// (claude/libht-research @ 9eaa248, lib4-cards.md 14.5: the one re-copy, after 9dbc7e0 of 14.2); the back box at 0393aac9 (Do 9).
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const ROOT = join(new URL('.', import.meta.url).pathname, '..', '..');
const HOWTO = 'docs/research/howto';
const RESEARCH_HEAD = '9eaa2480fea8f8f82a52ac2596c14d9a0da08ca5';
/** Do 9 (D-LIB5-BOX, #244 6250331645): the owner-approved back box is copied from this head; its box text equals 9eaa248's. */
const BOX_HEAD = '0393aac9ecfb67ad05b92a93308805158c1836ca';

/** path under docs/research/howto -> sha256 of the file bytes at RESEARCH_HEAD (shared/back-pain-box.json: at BOX_HEAD). */
const PINS: Record<string, string> = {
  'shared/back-pain-box.json': 'eb503620429d84b311d0e8c30ab7e164f49cacc1a8df577fc35496a069113aa4',
  'shared/cupped-thumb.json': 'd671abc3cef92e90bba70e1d204775b5f44cd57ab5e2611af3927f6de1ee7a89',
  'shared/curl.json': '8fda3d8dbc51a6480ca923178f627a8c585b60bdf6eea4e357faed4867a23d99',
  'shared/dumbbell-kickup.json': '45028bdde15be1a8a07197a1bed8c4ada1c2cc4a442275581c3042915b7b5719',
  'shared/floor-body.json': '1b75495ca05e318a4ea1c21b8ff6e8445925d7c5cf38835ce39eee11b74fb121',
  'shared/foot-bar.json': '87f9395ba84bc6b2fce7d8e09123cb8e833010db624138214d276f4b7828c7c3',
  'shared/front-rack-exemption.json': 'a5dec3c700a0865297a7338c70ea6eb7420b09f3c4db57142d33e5afa960c21e',
  'shared/get-in-out.json': '29ecf0ec5af07cf09c77a0335fdb09da1649e6829e5a5f1c4d90091b8c82e87f',
  'shared/implement-battle-ropes.json': 'd8bd68b613df28b78ef0e1de5cc2cb04448a2b43e219fc4c1744c9a28da4ab1d',
  'shared/implement-jump-rope.json': '4f8827ee3fd4e304db88f68c083c1ab68c17f28eaaaaf178bfff463b9bb07619',
  'shared/implement-kettlebell-swing.json': 'ab4a26f1db5105cff51ece93ebe74f5b295b38907923d114646f0cfe5028f097',
  'shared/implement-medicine-ball-slam.json': '121e8c402795b705c549532bde5400bcea3f35cf9b19a1e5e11720c7134392bd',
  'shared/implement-wall-ball.json': '42ce2cbfce4f84d9ee67ea3c76561e94ace51e2ecbb3bd14d0f0bba6c5c737e3',
  'shared/palm-flat.json': 'fb4e54fd3f6cf3f91b15cb0d17cf0297743962141b4c695d9e46a1eee1414d11',
  'shared/prone-checkpoints.json': 'e5a5e3dbecd12a8de0f51dba8cd6ac53b520e928376c2143cf8f8afcca6a85a6',
  'shared/rope-rule.json': 'eb0727e069d46e9e780fa76bab7a299d4ab241ade8d8ca484dfa333ef0759010',
  'shared/selector-pin.json': 'af4316219601c66beda13c2dbbacea6d3f592e30a6fbda3d3c9309d417c6abb9',
  'shared/unrack-rerack.json': '6f54cb7135f79212eb013812161774f4bf6662ca904a2ba3b62332788ef0025b',
  'shared/wrist-curl-exemption.json': '236c2b2cd91684ab119fbc29d0bf8e526762ee11265c61e25433b64ea10bcd9b',
  'quotes/shared-back-pain-box.json': '56186cf7f4ffb3c91d65c5410ba82791489efb5c751ca1739ed16af559712973',
  'quotes/shared-cupped-thumb.json': '4b070809fa75b1c79d80bdd13f5aef2855a12e9e15f4e48064b0f590cf9e60e8',
  'quotes/shared-curl.json': '86e7dd0b8940b7636d6dc17ea05d74bdab0b7f493b607f59aea3ceac29da19a2',
  'quotes/shared-dumbbell-kickup.json': 'c9dd68d1b0a1cefd9776b18e057f9d990aae3009dbb2fd3a96a43ee6484a5bd0',
  'quotes/shared-floor-body.json': '1ffad2a30eb7994c4fc136f3c87a76ba36f31077254ad3e23adb6ef09faea816',
  'quotes/shared-foot-bar.json': '4083d763e5ef82058735e28b2387d520d0d664c23d038bceb0b5ef207d903d82',
  'quotes/shared-front-rack-exemption.json': 'd3f4a5be9748352b0c1e219c332a5e2b0d532929664a72c0a67adebac6c2c15b',
  'quotes/shared-get-in-out.json': 'd50c4177c70229b9d9e8b7e776b547c1f9a20c8fdb289e36db394413786576eb',
  'quotes/shared-implement-battle-ropes.json': '82b746976627d776ab3465facce35f24ceaab5a46b72aacb21db9b0de18d1e60',
  'quotes/shared-implement-jump-rope.json': '415dc116b4ad68b4079b44bff5a9d2ddbd6c33cdd936c9ab20fa61307bc708fc',
  'quotes/shared-implement-kettlebell-swing.json': '37c0f95e83d7530cbe1d96f490e941f11bbc17152405703beb61709e8eccec22',
  'quotes/shared-implement-medicine-ball-slam.json': '500a23ae482c790408f0f68bbb03e7c160ca523f2192458b3c4421173e6700df',
  'quotes/shared-implement-wall-ball.json': 'd3e95d46b4dc8bf08bd55574101d8a67ce5820cb3163e977ee7690a1a6ee26e7',
  'quotes/shared-palm-flat.json': '3abb7518f0f41b73673bfeb1f333c4445c0fbe8bea723cb0ee787519977199fa',
  'quotes/shared-prone-checkpoints.json': '2eaf5be6e456c20af2a11633b1d635c831fa5327e3d7865fdcb2b9b766b6a7ef',
  'quotes/shared-rope-rule.json': '1814127c0ef6101fbac08270b3d9fd54afa6ee556eeb79693567edfed23cc3a5',
  'quotes/shared-selector-pin.json': 'db2b7d8c76511a2d93d2bf0c00eba72bf391b1dbeacb657a3464b79f326174e9',
  'quotes/shared-unrack-rerack.json': '5e66a6857549da2aed64b6481cdd6920108e319362e4424aa161d2f28cd9b474',
  'quotes/shared-wrist-curl-exemption.json': '125993ded83e0a95685291c20bcec259dc147856019fdb4c4699ca2f08ff2a88',
};

/** Every difference between `root`'s 38 shared files and the pins: changed, missing or extra. */
function s1Problems(root: string): string[] {
  const bad: string[] = [];
  const onDisk = [
    ...readdirSync(join(root, HOWTO, 'shared')).map(f => `shared/${f}`),
    ...readdirSync(join(root, HOWTO, 'quotes')).filter(f => f.startsWith('shared-')).map(f => `quotes/${f}`),
  ];
  for (const p of onDisk) if (!(p in PINS)) bad.push(`${p}: not pinned`);
  for (const [p, want] of Object.entries(PINS)) {
    let got: string;
    try { got = createHash('sha256').update(readFileSync(join(root, HOWTO, p))).digest('hex'); } catch { bad.push(`${p}: missing`); continue; }
    if (got !== want) bad.push(`${p}: sha256 ${got}, pinned ${want}`);
  }
  return bad;
}

const temps: string[] = [];
function copy(): string {
  const t = mkdtempSync(join(tmpdir(), 'lib5-s1-'));
  temps.push(t);
  cpSync(join(ROOT, HOWTO, 'shared'), join(t, HOWTO, 'shared'), { recursive: true });
  cpSync(join(ROOT, HOWTO, 'quotes'), join(t, HOWTO, 'quotes'), { recursive: true });
  return t;
}
afterAll(() => { for (const t of temps) rmSync(t, { recursive: true, force: true }); });

describe(`LIB-5 S1: the 38 shared research files equal the named research heads ${RESEARCH_HEAD.slice(0, 7)} and ${BOX_HEAD.slice(0, 7)} (back box)`, () => {
  it('19 cards and 19 quote files, each byte-equal to its pin', () => {
    expect(Object.keys(PINS).filter(p => p.startsWith('shared/')).length).toBe(19);
    expect(Object.keys(PINS).filter(p => p.startsWith('quotes/shared-')).length).toBe(19);
    expect(s1Problems(ROOT)).toEqual([]);
  });
  it('mutation: one byte changed is red', () => {
    const t = copy(), f = join(t, HOWTO, 'shared/curl.json'), b = readFileSync(f);
    b.writeUInt8(b.readUInt8(b.length - 2) ^ 1, b.length - 2);
    writeFileSync(f, b);
    expect(s1Problems(t)).toEqual([expect.stringMatching(/^shared\/curl\.json: sha256 /)]);
  });
  it('mutation: a missing file is red', () => {
    const t = copy();
    rmSync(join(t, HOWTO, 'quotes/shared-curl.json'));
    expect(s1Problems(t)).toEqual(['quotes/shared-curl.json: missing']);
  });
  it('mutation: a 20th card is red', () => {
    const t = copy();
    writeFileSync(join(t, HOWTO, 'shared/extra.json'), '{}\n');
    expect(s1Problems(t)).toEqual(['shared/extra.json: not pinned']);
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
let V: any;
const rd = (p: string) => JSON.parse(readFileSync(join(ROOT, HOWTO, p), 'utf8'));
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));

describe('LIB-5 S2: every shared card is valid (tools/plates/library/research/validate.mjs)', () => {
  it('the 19 copied cards pass with no problem', async () => {
    V = await import(/* @vite-ignore */ new URL('../../tools/plates/library/research/validate.mjs', import.meta.url).href);
    const files = readdirSync(join(ROOT, HOWTO, 'shared'));
    expect(files.length).toBe(19);
    for (const f of files) expect([f, V.validateSharedFile(f)]).toEqual([f, []]);
  });
  it('mutation: an orphan source is red', () => {
    const c = rd('shared/curl.json'), q = rd('quotes/shared-curl.json');
    c.sources.push({ ...c.sources[0], id: 'orphan-x' });
    expect(V.validateShared(c, q, { file: 'curl.json' })).toEqual(['shared/curl.json: orphan source orphan-x (no claim cites it)']);
  });
  it('mutation: a 51-word quote is red', () => {
    const c = rd('shared/curl.json'), q = rd('quotes/shared-curl.json'), long = Array.from({ length: 51 }, (_, i) => `w${i}`).join(' ');
    const e = q.quotes.find((x: any) => x.claim === c.claims[0].id && x.source === c.claims[0].quotes[0].source && x.text === c.claims[0].quotes[0].text);
    e.text = long; c.claims[0].quotes[0].text = long;
    expect(V.validateShared(c, q, { file: 'curl.json' })).toEqual([`shared/curl.json: claim ${c.claims[0].id} quote from ${c.claims[0].quotes[0].source} has 51 words, at most 50`]);
  });
  it('mutation: a missing quote entry is red', () => {
    const c = rd('shared/curl.json'), q = rd('quotes/shared-curl.json'), cq = c.claims[0].quotes[0];
    q.quotes = q.quotes.filter((x: any) => !(x.claim === c.claims[0].id && x.source === cq.source && x.text === cq.text));
    expect(V.validateShared(c, q, { file: 'curl.json' })).toEqual([`shared/curl.json: claim ${c.claims[0].id} quote from ${cq.source} is not in its quotes file`]);
  });
  it('mutation: an unknown kind is red', () => {
    const c = rd('shared/curl.json');
    c.kind = 'grip';
    expect(V.validateShared(c, rd('quotes/shared-curl.json'), { file: 'curl.json' })).toEqual(['shared/curl.json: unknown kind "grip"']);
  });
  it('mutations: an unresolved claim ref, a missing kind key and a contact line are red', () => {
    const q = rd('quotes/shared-curl.json');
    const a = rd('shared/curl.json'); a.gripLine.claim = 'c99';
    expect(V.validateShared(a, q, { file: 'curl.json' })).toEqual(['shared/curl.json: gripLine.claim names unknown claim c99']);
    const b = rd('shared/curl.json'); delete b.cue;
    expect(V.validateShared(b, q, { file: 'curl.json' })).toEqual(['shared/curl.json: hand card lacks cue']);
    const d = rd('shared/curl.json'); d.cue.text = 'Call your GP.';
    expect(V.validateShared(d, q, { file: 'curl.json' }).map((x: string) => x.replace(/ hit .*/, ''))).toEqual(['shared/curl.json: cue.text: SAFETY_LINE_RE']);
  });
  // BOX-CAP (D-BOXCAP-WIRE Q3): the back-pain box is held to its named 50 (D-BOXCAP-1), every other key to golden B's 30;
  // in both, a card's own wordCap 999 never lifts the cap.
  it('wordCap and words are data: a settled back-pain box with wordCap 999 is red at 51 words under its named 50', () => {
    const c = rd('shared/back-pain-box.json'), q = rd('quotes/shared-back-pain-box.json'), s = clone(c);
    expect(V.validateShared(c, q, { file: 'back-pain-box.json' })).toEqual([]);   // owner-approved (Do 9): 50 words, its named cap
    s.status = 'settled'; s.box.wordCap = { limit: 999, basis: 'test' }; s.box.words = 51;
    s.box.name.text = 'Back pain'; s.box.now.text = Array.from({ length: 44 }, () => 'numb').join(' ') + ' today?'; s.box.doctor.text = 'See a doctor soon.';
    expect(V.validateShared(s, q, { file: 'back-pain-box.json' })).toEqual(['shared/back-pain-box.json: box has 51 words, at most 50']);
    s.box.doctor.text = 'See a doctor.';
    expect(V.validateShared(s, q, { file: 'back-pain-box.json' })).toEqual([]);
  });
  it('wordCap and words are data: a settled box under any other key with wordCap 999 and 31 words is red under golden B\'s 30', () => {
    const s = clone(rd('shared/back-pain-box.json')), q = clone(rd('quotes/shared-back-pain-box.json'));
    s.key = 'spine-pain-box'; q.id = 'shared-spine-pain-box';
    s.status = 'settled'; s.box.wordCap = { limit: 999, basis: 'test' }; s.box.words = 31;
    s.box.name.text = 'Back pain'; s.box.now.text = Array.from({ length: 24 }, () => 'numb').join(' ') + ' today?'; s.box.doctor.text = 'See a doctor soon.';
    expect(V.validateShared(s, q, { file: 'spine-pain-box.json' })).toEqual(['shared/spine-pain-box.json: box has 31 words, at most 30']);
    s.box.doctor.text = 'See a doctor.';
    expect(V.validateShared(s, q, { file: 'spine-pain-box.json' })).toEqual([]);
  });
});

describe('LIB-5 S9: the source registry is consistent', () => {
  it('one id, one URL across sources.json and the 19 shared cards; no URL in src/howto or src/slices/howto (C17)', async () => {
    const sets = V.registrySets();
    expect(sets.length).toBe(20);
    expect(sets.reduce((a: number, s: any) => a + s.sources.length, 0)).toBeGreaterThan(100);
    expect(V.registryProblems(sets)).toEqual([]);
    const { checkC17 } = await import('./checks/c17');
    expect(checkC17([join(ROOT, 'src/howto'), join(ROOT, 'src/slices/howto')])).toEqual([]);
  });
  it('mutation: a duplicate id with a different URL is red', () => {
    const sets = V.registrySets(), s0 = sets[1].sources[0];
    sets.push({ where: 'shared/extra.json', sources: [{ id: s0.id, url: `${s0.url}x` }] });
    expect(V.registryProblems(sets)).toEqual([`source ${s0.id}: shared/extra.json has ${s0.url}x, ${sets[1].where} has ${s0.url}`]);
  });
});
