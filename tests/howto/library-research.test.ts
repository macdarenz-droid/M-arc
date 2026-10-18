// LIB-5 S1: the 38 shared research files (19 cards, 19 quote files) are byte copies of the named research head
// (claude/libht-research @ 9dbc7e0, lib4-cards.md 14.2). A re-copy re-pins this table (card amendment 46).
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const ROOT = join(new URL('.', import.meta.url).pathname, '..', '..');
const HOWTO = 'docs/research/howto';
const RESEARCH_HEAD = '9dbc7e0af0f3da0490d1800012569973ed511c32';

/** path under docs/research/howto -> sha256 of the file bytes at RESEARCH_HEAD. */
const PINS: Record<string, string> = {
  'shared/back-pain-box.json': '4039694652f6ebf0ce3efdaf63b0531c43c5aa4a7d48e843f966face85a4cd00',
  'shared/cupped-thumb.json': '523e83fbf366f8baf2b8cbb571ea8cdeac6e9c49568b5a2c1d3bf30a7a337771',
  'shared/curl.json': '9d65a04d6076ee18e9c01f23c94a422be92ee210c5a07db0879f95693043b1d7',
  'shared/dumbbell-kickup.json': '59a8704133b1c7ce3e48c8bfdb64f968414f62bbfb3db29d5014e681b3f64d75',
  'shared/floor-body.json': '0ca0d5eabf8c696880435c0afed075db7275876a2d1aba9d6921c0ed9229253d',
  'shared/foot-bar.json': '87f9395ba84bc6b2fce7d8e09123cb8e833010db624138214d276f4b7828c7c3',
  'shared/front-rack-exemption.json': 'c5f6f6a4bea51bac78cccd0dbb1cdc09a8dfe0abcf8bc72853959434194fcad9',
  'shared/get-in-out.json': '7da63bb524b4924838e363e56c501979e7ca6cd093f944bae8c0a7317ac0efbe',
  'shared/implement-battle-ropes.json': '3fa15864b98fa6ecbf69535cdf30ac4fbf093a825bc0724983e31460c04da330',
  'shared/implement-jump-rope.json': '0ba8c7a7a4a6728d7b10d09503b243905b4b74f7a8b7c77573f7187eed615943',
  'shared/implement-kettlebell-swing.json': '6607b0b41be437847869bd67c4f930b6881db25ae76839d41975caa5d973e17a',
  'shared/implement-medicine-ball-slam.json': '873f2e5f5c64cce7893bc98ef9306a3fe43a7dddeaa1c0978094a3b70d43a172',
  'shared/implement-wall-ball.json': '58e4fbd11d9b55618a65cec60f44589eeb607dd43c5dd6af1788655a848a2263',
  'shared/palm-flat.json': '49d8ecac79d878c5fff6e8b4d858e7413dc9ad8795df358d3d6fe51824beff46',
  'shared/prone-checkpoints.json': 'cef85f05ab3f37328b6fe09b5d4b88bf55ab910196e2d44e453e1b6c764eb8cc',
  'shared/rope-rule.json': 'e650669b1c6af254fbfb159150b0110b296bef173838404cf21902abdd259c21',
  'shared/selector-pin.json': 'af4316219601c66beda13c2dbbacea6d3f592e30a6fbda3d3c9309d417c6abb9',
  'shared/unrack-rerack.json': 'f10ad305c81e48460fbc2dd6a56865b4d33e24454b6339a8e35c374a0d298510',
  'shared/wrist-curl-exemption.json': '3e310b439bd06bd1380474420b917d6207041110ecef7be59d5306b14d0b8683',
  'quotes/shared-back-pain-box.json': '56186cf7f4ffb3c91d65c5410ba82791489efb5c751ca1739ed16af559712973',
  'quotes/shared-cupped-thumb.json': '4b070809fa75b1c79d80bdd13f5aef2855a12e9e15f4e48064b0f590cf9e60e8',
  'quotes/shared-curl.json': '86e7dd0b8940b7636d6dc17ea05d74bdab0b7f493b607f59aea3ceac29da19a2',
  'quotes/shared-dumbbell-kickup.json': 'd4a61aee8b9b24bd30b93361aee08487e4d05e9818a00b22cfdacd760f785a61',
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

describe(`LIB-5 S1: the 38 shared research files equal the named research head ${RESEARCH_HEAD.slice(0, 7)}`, () => {
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
  it('wordCap and words are data: a settled box with wordCap 999 and 31 words is red under golden B\'s 30', () => {
    const c = rd('shared/back-pain-box.json'), q = rd('quotes/shared-back-pain-box.json'), s = clone(c);
    expect(V.validateShared(c, q, { file: 'back-pain-box.json' })).toEqual([]);   // the draft is not judged (S4-P keeps it out of the app)
    s.status = 'settled'; s.box.wordCap = { limit: 999, basis: 'test' }; s.box.words = 31;
    s.box.name.text = 'Back pain'; s.box.now.text = Array.from({ length: 24 }, () => 'numb').join(' ') + ' today?'; s.box.doctor.text = 'See a doctor soon.';
    expect(V.validateShared(s, q, { file: 'back-pain-box.json' })).toEqual(['shared/back-pain-box.json: box has 31 words, at most 30']);
    s.box.doctor.text = 'See a doctor.';
    expect(V.validateShared(s, q, { file: 'back-pain-box.json' })).toEqual([]);
  });
});
