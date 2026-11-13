// F-ZOOM-NONE (card docs/supervisor/verify/f-zoom-none-card.md): a library sheet with no drawn posture close-up.
// A3 baseline: the body (after the GENERATED header line, whose inputsSha256 moves with the generators) of every
// posture chunk and of loaders.ts stays byte-equal to main e623d3ef for every row that has posture zooms.
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { child, IN_CHILD } from '../child-test';
import { W4_IDS } from './checks/ship-w4';

const GEN = join(__dirname, '../../src/howto/generated');
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const body = (n: string) => { const t = readFileSync(join(GEN, n), 'utf8'); return t.slice(t.indexOf('\n') + 1); };

// sha256 of each body on main e623d3ef (train 68, LIB-SHIP W2; re-pinned from cb9a6dae as ruled on #388)
const BODY_MAIN: Record<string, string> = {
  // LIB-SHIP W3 (D-SHIP-A9 guard replacement): loaders.ts gains W3's 9 ids (was a168345b… on main e623d3ef); the 16 main
  // posture bodies below are unchanged, and W3's 9 posture chunks are pinned at the W3 flip
  'loaders.ts': 'e7bc1d4076c810044e534195d8cc2f6af4a8fe7d1e36372b5a7aae364561029b',
  'posture-chest-supported-row.ts': '9057b9c71faeb9b00d35e9762d832bde66d9c00d3792241a4b0d724ea1ede167',
  'posture-chin-up.ts': '90335f3138f0ffb5cc86075cdf845aae859cb45910234bbc56e3733c71a45d8f',
  'posture-close-grip-pulldown.ts': 'e1d097991fedb4e2fdbfec6b36ea15df0608ce732da6d1e41f4c35487e30442f',
  'posture-hanging-knee-raise.ts': 'c07a0edc3af8d980c1a322f6d36c180bfb5d72bfbcc168d04c7cff70cd20b77a',
  'posture-horizontal-leg-press.ts': 'a0192b1cfcbb3250bf732f9d7120e62c663dafc59878a5cd5f16f3f0990422cf',
  'posture-inverted-row.ts': '09ee0c7337d380f4316230ba8dae440d4244688570f45c4f0937f1000663f15a',
  'posture-resistance-band-row.ts': '0410b9130c5dd3d4f5b9a50af51d6fbed7b263b59a468eb97163770048ea5191',
  'posture-single-arm-lat-pulldown.ts': 'a536a4027af2f9dae65f38620c408f2435a51c3101e86d7886d67dd6a3c27241',
  'posture-straight-arm-pulldown.ts': '0a612d407a40d7c9f763530caa4f9b46ec3fedb5f12a21b31cfa5ed536b7c240',
  'posture-barbell-back-squat.ts': '8bdf3354ed3ce298e8bad7bb350da8b43d95518b760d9d5ffc70861ce94f49ff',
  'posture-barbell-row.ts': 'e850b0b614f48bba162455e1aa4184170c1bf1f055f8c9d27b7924ea49915076',
  'posture-cable-fly.ts': 'bc032278ce45e8254202c82398bdc26a4ba2cefde36f32b175d64b83cd6aba84',
  'posture-dumbbell-bench-press.ts': 'c11d62efa46549ca0b69b42c48a67da9e0566cbdcda9739a5b580b1bb0d77693',
  'posture-dumbbell-biceps-curl.ts': 'af709c0ebf1007fc9be41bc7d103f1a63a3155d27dbc4d242274605f57f80dfb',
  'posture-dumbbell-shoulder-press.ts': '203f9b3c5bbc7a3be33a8b8a88a9526afd9272b0b8fd2b543f51bdc7214c4d1e',
  'posture-hanging-leg-raise.ts': '3e110802371f1eb33bdc0d9f0d81351d14f06989988061a3546c5c2ee9490770',
  'posture-lat-pulldown.ts': 'e18443a93706e3b113f7fa396fab4280be8463751bd99d2df1dae0f6cdfe9b7a',
  'posture-lateral-raise.ts': 'bc056d612aa8708123f998b212080a210fe685faa217ebe477890d8705d238fe',
  'posture-leg-press.ts': '0a3042da1d567d8dc235efddc6403927a9df8cfc15785959446112452e640ead',
  'posture-machine-chest-press.ts': '3eea3f10928dd4746134bcdf4649cbcc24307ae2510a9f127634df01a6bcb396',
  'posture-plank.ts': '35d303d9a497c0668e0d8c9c6af19530e5a7252f34be3fc7108b4aa666cd18dd',
  'posture-pull-up.ts': 'fe028fcb5a6e5a15442fc550e00943d9e9532685b02497b4f4a02a9394e40989',
  'posture-push-up.ts': '14f6f8bc21c14f1c815a7e5c12efc17f75b2a7832f7ad481a12e58b872aae8ad',
  'posture-rope-triceps-pushdown.ts': '11ab224a6c1e0398f113da086e80f63f48a708d015ec8f388986c99017299df7',
  'posture-seated-cable-row.ts': '2007a1077ddab305d1c64494196cac0e6a388766834eb077a5207e7f6fe93d3a',
  'posture-upright-row.ts': '4ea58d5ad84139b2e9226623f9bd27235b79963c3945fc2f226636d522d5dcfd',
};

// LIB-SHIP W4 (ruling 3; D-SHIP-W4-FLIPSET): the 6 W4 ids add one posture chunk each (bodies measured on the W4 flip) and
// 4 loaders.ts lines each; main's chunks stay byte-equal, and loaders.ts's body with exactly the W4 lines taken out is main's.
const BODY_W4: Record<string, string> = {
  'posture-pendlay-row.ts': 'd575d913098ad3a1b626616bab30a0391c3b1996ec2cc98919babce1cb25f1fb',
  'posture-landmine-row.ts': '54626afb23bb0f2d82a1af2e316bceb2bb69f19fbdf54174bd9a69cbe42a61bf',
  'posture-t-bar-row.ts': '62bf33d2043ae4acacf44390a87a3dbe4fbea53af6aa92638b52e0b2e427170c',
  'posture-barbell-shrug.ts': '838528fb18d8fa95329c41ae41834187587472f0ac2a88e7a264088d5aeb0c6c',
  'posture-cable-shrug.ts': 'c0e41411c66a685bafb9765b65b3e97800bd3c08298ab16cf3ba003697b29cc8',
  'posture-smith-machine-shrug.ts': '0dd2be769e5c7992b65707cac2ec021ac2536b6809b3a491757a417c62fd4006',
};
const W4_SLUGS = W4_IDS.map(id => id.slice(4));
const W4_LINE = new RegExp(`^  (?:"lib_(?:${W4_SLUGS.join('|')})",|lib_(?:${W4_SLUGS.join('|')}): \\(\\) => |"(?:${W4_SLUGS.map(i => i.replace(/_/g, '-')).join('|')})": \\(\\) => )`);
const w4Less = (t: string) => { const lines = t.split('\n'), kept = lines.filter(l => !W4_LINE.test(l)); return { removed: lines.length - kept.length, sha: sha(kept.join('\n')) }; };
const w4Text = (t: string) => t.split('\n').filter(l => !W4_LINE.test(l)).join('\n');
// LIB-PLATEFIX-1 (#385, D-PLATEFIX-PINS / PIN GO; [golden update]): its 4 shipped ids add their posture chunks (bodies
// measured at this head) and 16 loaders.ts lines (4 per id: HOWTO_IDS, LOADERS, POSTURE, FEEL); loaders.ts's body is 3d77e3d4
// (was 767f919c before merging main 8841246c), and with exactly those 16 lines taken out it is main 8841246c's e7bc1d40
// (BODY_MAIN, W3's). Every other posture body stays main's.
const BODY_PF: Record<string, string> = {
  'posture-reverse-lunge.ts': '3eaee76ff32b753caddf525338c1735fd8e6fdb39e5f5948440d28a9441471e2',
  'posture-romanian-deadlift.ts': 'adae74d8d6b23020a6002e8fb0e781b9f623e7b4185a007aa160b8c8b7f08c32',
  'posture-single-leg-romanian-deadlift.ts': '8534eb908642a3145373c2e8c30d8b8ea0bf01f5bfe0eb3daefa30b50fed1c57',
  'posture-triceps-pushdown.ts': '67a7f7694b3ca03143e8926e0e4e352c63897f27a0782d5bd8f6ce1bf665a8fa',
};
// merge of main 7e060e83: loaders.ts's body with W4's 24 lines too (was main's 3d77e3d4 alone); less W4's and PLATEFIX's lines it is BODY_MAIN's
const LOADERS_PF = 'c96dafb8daa463b7e5ea7da81c3d2a199d7df9cb77bbc7ec0f50c16ed82d484c';
const PF_IDS = ['romanian_deadlift', 'single_leg_romanian_deadlift', 'triceps_pushdown', 'reverse_lunge'];
const PF_LINE = new RegExp(`^  (?:"lib_(?:${PF_IDS.join('|')})",|lib_(?:${PF_IDS.join('|')}): \\(\\) => |"(?:${PF_IDS.map(i => i.replace(/_/g, '-')).join('|')})": \\(\\) => )`);
// LIB-SHIP W5 (ruling 3; D-SHIP-W5-FLIPSET + D-SHIP-W5-PREACHER): its 10 shipped ids add their posture chunks (bodies measured
// at claude/lib-ship-w5 0e1c73d9) and 45 loaders.ts lines (4 per id, plus a HAND line for each of its 5 pair curls); with exactly
// those 45 lines taken out loaders.ts is LOADERS_PF (merge of main 05382042: main's body, with W4's and PLATEFIX's lines), so both checks hold as before
const BODY_W5: Record<string, string> = {
  'posture-front-squat.ts': '27f80279146bf18cac41b2b1f899fa2ec412b0916a3bcf907ff3f218b21d32f3',
  'posture-bodyweight-squat.ts': '81820bf553e31b7fe176a50c85ff93ac2e8c964e5e246ab230bdfce0ae83c3a4',
  'posture-bodyweight-lunge.ts': '4e1cc24d1756eb1b2c85ce31861dccffcc53fc1308453ba57b359d3c2aef1407',
  'posture-bodyweight-split-squat.ts': '283ae12f31e14a22cc577f01e948fb492ccbb3b596ad841020c0b82f2567e201',
  'posture-preacher-curl.ts': '9b54d6c3bdb8de0d5c4dd29a2e84def9f8461d6aa3e8d52734d60e59372cc87d',
  'posture-hammer-curl.ts': 'cc2d7b6b068df23d931ea7c68fa0b8e47a3477bb1b3ab10eaf83862c2a111713',
  'posture-alternating-dumbbell-curl.ts': '746f79ee7eefec23a5b56ae78bb14f585cd48104eba4717ec1f657070fd21858',
  'posture-barbell-curl.ts': '04bc46dcdb80063aced49b085a6fb17226a219b0723dddfd685149d7929fc9c8',
  'posture-ez-bar-curl.ts': '206cd8fe8416209d9899d5e74f682959b8738c7915ca7a63b559b3357c152c2a',
  'posture-reverse-curl.ts': 'ad960439598f91b4d7d7cba9f8cb0325d32e128a8655a075e3cf3491341fc5a1',
};
const LOADERS_W5 = 'ecbc24965edfc8dfdbc1ec0e68cf87212e38cf4c8ec7eb393f8143aff944e96b';   // merge of main 05382042 (W4's lines too; was 9fe77e84)
const W5_IDS = ['front_squat', 'bodyweight_squat', 'bodyweight_lunge', 'bodyweight_split_squat', 'preacher_curl', 'hammer_curl', 'alternating_dumbbell_curl', 'barbell_curl', 'ez_bar_curl', 'reverse_curl'];
const W5_LINE = new RegExp(`^  (?:"lib_(?:${W5_IDS.join('|')})",|lib_(?:${W5_IDS.join('|')}): \\(\\) => |"(?:${W5_IDS.map(i => i.replace(/_/g, '-')).join('|')})": \\(\\) => )`);
const w5Less = (b: string) => { const lines = b.split('\n'), kept = lines.filter(l => !W5_LINE.test(l)); return { removed: lines.length - kept.length, text: kept.join('\n') }; };
// LIB-SHIP W7 (ruling 3; D-SHIP-W7-STAMP #394 6711372615 @ a3e5b6e7, after D-PF10-W7JOIN): its 16 shipped ids add their
// posture chunks (bodies measured on claude/lib-ship-w7 after the W7 flip and generate; unchanged on the merge of main dc058207)
// and 64 loaders.ts lines (4 per id; no W7 row draws a hand pair, so no HAND line); D-SHIP-W7-SLEDHOLD and D-SHIP-W7-HOLD2
// (#394 6753333493): sled_pull, glute_bridge and high_knees are held, so none has a posture chunk or a line; with exactly those 64
// lines taken out loaders.ts is main dc058207's body (LOADERS_DC05), so the W6, W5, W4 and PLATEFIX checks hold as before
const BODY_W7: Record<string, string> = {
  'posture-leg-extension.ts': '58407e36be1a31ab1b47a8aeb3a89d4afc67373955adc41ff5a930d4b1a5f5d8',
  'posture-lying-leg-curl.ts': '768c0b401f218c35aa932302b71a7f5caf80a482d482e70a17c27dc19bfa96fe',
  'posture-standing-leg-curl.ts': 'a1548f0b1f27a6a6be0b6c9374f1bff1e998b6128c5d703b3f4f0d9c32eac5ef',
  'posture-cable-kickback.ts': 'f0f3dd39fd29dda9a64bf158f139a1bf05fbe7187286a73405feca78be7b5759',
  'posture-resisted-hip-flexion.ts': '34a60065b6b6c6e32f2fd454537dcab5ccc53a78669e25b986c1267b9c541b4a',
  'posture-ab-wheel-rollout.ts': '3df2fc16058777289a8d02307f3c35a0bd263a8265732ec75bf607dbfdf4cef5',
  'posture-bird-dog.ts': '74472965efc05c5e908f5edf759cc946d7e5ddc25e628f8f7ceb1a1bbfddd5a0',
  'posture-cable-crunch.ts': 'feb4931269735397a30f4eb504f0260ef065d29a72d99f96dd96c5a7ff7d32e8',
  'posture-hollow-body-hold.ts': '94f0e34f1b3a03b1079d8785c112afec673327e13eb44b445ec193cfcf0f081c',
  'posture-reverse-crunch.ts': '4b5f7a13432378353af4b94e20d62e347897e58dcae8cfe59a18056ede0f8784',
  'posture-dead-bug.ts': '40db8cfdfbfd63397f86af6626f4f0142785e8b09afca84d29563e3a06492477',
  'posture-kettlebell-swing.ts': '1e79ce02e065a060b0309f19d329c799d45862849e96c932cbda69f298aabe73',
  'posture-bear-crawl.ts': '1c40495980ad598d03c85e17a673834848445b8b7e3c18c10439fdd85da08b94',
  'posture-sled-push.ts': '4774d2301d179f1762b1bd8dbb41c25907c1366fa244628c2a0a6e06ff13f036',
  'posture-medicine-ball-slam.ts': 'e2f408299bc5bcc3c06da0ff426348879166c33c4898ef0312e3757de91e21ad',
  'posture-farmer-s-carry.ts': '14e3d8bcbb36a0fc6cb10a6f3f5201e2115b9a6fd7835ff66fc23fd538714ab7',
};
// merge of main dc058207 (W6 #393): loaders.ts with W6's and W7's lines, measured on the merged tree after generate (D-SHIP-W7-SLEDHOLD:
// was df31b275 with sled_pull's lines, then 54f783ad before the merge; D-SHIP-W7-HOLD2: glute_bridge's and high_knees' lines out too;
// was a67a1966 before high_knees was held)
const LOADERS_W7 = 'ea5ce253ce0771c1bb5a5ea03193506952c30be0facf18aacbba5a1e499bbf7f';
// LIB-SHIP W8a (ruling 3; #413 6761492481; D-W8A-ASSISTEDHOLD, D-W8A-SEATEDHOLD #415): loaders.ts gains the 3 W8a ids'
// 12 lines (HOWTO_IDS, LOADERS, POSTURE and FEEL each; no HAND line). With exactly those out, the body is LOADERS_W7.
// The 3 new posture chunks are pinned at the W8a flip.
const LOADERS_W8A = 'cb38a10df8e08364e19691dd845851facef1ee6e8c02102bb27c3edb6e0e0f5a';
const W8A_IDS = ['barbell_overhead_press', 'pec_fly', 'crunch'];
const W8A_LINE = new RegExp(`^  (?:"lib_(?:${W8A_IDS.join('|')})",|lib_(?:${W8A_IDS.join('|')}): \\(\\) => |"(?:${W8A_IDS.map(i => i.replace(/_/g, '-')).join('|')})": \\(\\) => )`);
const w8aLess = (b: string) => { const lines = b.split('\n'), kept = lines.filter(l => !W8A_LINE.test(l)); return { removed: lines.length - kept.length, text: kept.join('\n') }; };
const BODY_W8A: Record<string, string> = {
  'posture-barbell-overhead-press.ts': 'b0a7fab35095f3a41a7265ec95035aaca64c03aff2e5c6eff95e059497718749',
  'posture-pec-fly.ts': '13f7f32c2e102066a128ff29d1274391c23354df1d31819e95b2517f8f9e3cff',
  'posture-crunch.ts': '68fc649cbb2468cecbb03203961e8d4283f71c0d0a75c465dae32e3e5e7b14c1',
};
// LIB-SHIP W8b (ruling 3; D-SHIP-W8B-STAMP #417 6856507580): loaders.ts gains the 9 W8b ids' 36 lines (HOWTO_IDS, LOADERS,
// POSTURE and FEEL each; no HAND line). With exactly those out, the body is LOADERS_W8A (main 123c7299's). The 9 new
// posture chunks are pinned at the W8b flip.
const LOADERS_W8B = 'f57f5fe67706a904472440867722260c10db29a474a7a4a63b7725a2108f8867';
const W8B_IDS = ['dumbbell_pullover', 'dumbbell_romanian_deadlift', 'wall_sit', 'pistol_squat', 'forward_lunge', 'walking_lunge',
  'bayesian_cable_curl', 'dumbbell_overhead_triceps_extension', 'single_arm_triceps_pushdown'];
const W8B_LINE = new RegExp(`^  (?:"lib_(?:${W8B_IDS.join('|')})",|lib_(?:${W8B_IDS.join('|')}): \\(\\) => |"(?:${W8B_IDS.map(i => i.replace(/_/g, '-')).join('|')})": \\(\\) => )`);
const w8bLess = (b: string) => { const lines = b.split('\n'), kept = lines.filter(l => !W8B_LINE.test(l)); return { removed: lines.length - kept.length, text: kept.join('\n') }; };
const BODY_W8B: Record<string, string> = {
  'posture-dumbbell-pullover.ts': '5ada20e9b21d876be1bd6a12839d01ab3c549e494864daccf495e4176b34a266',
  'posture-dumbbell-romanian-deadlift.ts': 'e076642629a9022dcf7199e9b7c2ec7251bdfc9bf09e2201aad8c7b154f600b0',
  'posture-wall-sit.ts': '4d0d13236f0edf1ec615ec9b20549821a6d3f9eaebccd95bed952c3aa2324629',
  'posture-pistol-squat.ts': '199c550b3c7ffdf1fe04dd09d14b0031643610cdbd03a98d13044159611d8f0a',
  'posture-forward-lunge.ts': '79ef9b165a970aeb13f22a4c8fcfa420be90092c0de1813cac1870aa2a904cb1',
  'posture-walking-lunge.ts': '4e66d32796efbfd2885f5d7ce39660bd92c0d3b48df2d6935d595fc8e1d922fc',
  'posture-bayesian-cable-curl.ts': '971deeb2d233e1fb091ca5630d344b6d5fff13cf37a5eba96c825c4efc2850e0',
  'posture-dumbbell-overhead-triceps-extension.ts': 'daa95dcb5c042eded1813b02dacd2d7ce841516b214f214e9d28b6a30a9d0cde',
  'posture-single-arm-triceps-pushdown.ts': '1fa96ddb15a992d3fe7d690c1ce24a8581ae61742eee72106787a48a95ddb7c7',
};
const W8B_HELD_POSTURE = ['conventional-deadlift', 'sumo-deadlift', 'dumbbell-shrug', 'step-up', 'bulgarian-split-squat', 'wrist-curl',
  'cross-body-hammer-curl', 'incline-dumbbell-curl'].map(s => `posture-${s}.ts`);
const LOADERS_DC05 = '1843ca08a1737174a024468871df55cb2316b4139cb6c9904e50c1c8ec30e23e';   // main dc058207's loaders.ts body (measured from its own file)
const W7_IDS = ['leg_extension', 'lying_leg_curl', 'standing_leg_curl', 'cable_kickback', 'resisted_hip_flexion',
  'ab_wheel_rollout', 'bird_dog', 'cable_crunch', 'hollow_body_hold', 'reverse_crunch', 'dead_bug',
  'kettlebell_swing', 'bear_crawl', 'sled_push', 'medicine_ball_slam', 'farmer_s_carry'];
const W7_LINE = new RegExp(`^  (?:"lib_(?:${W7_IDS.join('|')})",|lib_(?:${W7_IDS.join('|')}): \\(\\) => |"(?:${W7_IDS.map(i => i.replace(/_/g, '-')).join('|')})": \\(\\) => )`);
const w7Less = (b: string) => { const lines = b.split('\n'), kept = lines.filter(l => !W7_LINE.test(l)); return { removed: lines.length - kept.length, text: kept.join('\n') }; };
const pfLess = (b: string) => { const lines = b.split('\n'), kept = lines.filter(l => !PF_LINE.test(l)); return { removed: lines.length - kept.length, sha: sha(kept.join('\n')) }; };
const pfText = (b: string) => b.split('\n').filter(l => !PF_LINE.test(l)).join('\n');
// LIB-SHIP W6 (D-SHIP-A9 guard replacement; #393 6689822595 flip set, 6701002884 ships 7): loaders.ts gains W6's 7 ids,
// 4 lines each (HOWTO_IDS, LOADERS, POSTURE, FEEL; no HAND line, all 7 on hands/no-zoom.json), 28 lines. With exactly those
// taken out, loaders.ts's body is main 8841246c's (e7bc1d40…, computed from main 8841246c's own loaders.ts, which W3 pinned
// above), so BODY_MAIN stays as it is. W6's 7 posture chunks are new files, pinned at the W6 flip b00d309a.
const W6_IDS = ['machine_crunch', 'machine_lateral_raise', 'cable_lateral_raise', 'dumbbell_front_raise', 'face_pull', 'incline_push_up', 'pike_push_up'];
const W6_LINE = new RegExp(`^  (?:"lib_(?:${W6_IDS.join('|')})",|lib_(?:${W6_IDS.join('|')}): \\(\\) => |"(?:${W6_IDS.map(i => i.replace(/_/g, '-')).join('|')})": \\(\\) => )`);
/** A body without the W6 lines: how many were taken out, and the rest's sha. */
const lessW6 = (b: string) => { const lines = b.split('\n'), kept = lines.filter(l => !W6_LINE.test(l)); return { removed: lines.length - kept.length, sha: sha(kept.join('\n')) }; };
const BODY_W6: Record<string, string> = {
  'posture-machine-crunch.ts': 'e9b8d7f7b2f5c90a60741641d118fb1d30901fbb81580476f5673b3fb248c923',
  'posture-machine-lateral-raise.ts': 'afb073489bd4a86986900726af6bd04615c74dd2cc44f7e550ff35f9744e3321',
  'posture-cable-lateral-raise.ts': '35772c7a9ed65012fe15df9d02b9adbacb636f368e2468fefda7873d42e5388b',
  'posture-dumbbell-front-raise.ts': 'e942142605943f14f32430cd65b7707de22e0aa86e984ef23d4ad962bb22a7be',
  'posture-face-pull.ts': 'c3641acfbb20dc2ad16692c9f11359cae4af2413a106757e31279b5bb2322724',
  'posture-incline-push-up.ts': '28aa2a2479a8c7754ae806df17bd69bff60455f034b5a0f24b25235813333b0a',
  'posture-pike-push-up.ts': 'e0ae2608e2b88787104eb48e0fc007aaa36300c0dc00d94acc436aa5d50c22b1',
};
// LIB-SHIP W6 (merge of main 7e060e83): W6's 7 posture chunks join PLATEFIX-1's 4; loaders.ts less W6's 28 lines is main
// 7e060e83's body LOADERS_PF (3d77e3d4…, which LIB-PLATEFIX-1 pinned and is measured again from main 7e060e83's own
// loaders.ts), and that less PLATEFIX's 16 lines is main 8841246c's BODY_MAIN, so both waves strip back in turn.
const w6Kept = (b: string) => b.split('\n').filter(l => !W6_LINE.test(l)).join('\n');
// merge of main de91dd21: loaders.ts less W6's 28 lines is main de91dd21's body LOADERS_W5 (ecbc2496…, measured again from main
// de91dd21's own loaders.ts); W5's, W4's and PLATEFIX's lines then strip back in turn as on main.

describe('F-ZOOM-NONE A3: rows with posture zooms generate what they generate on main', () => {
  it('every posture chunk and loaders.ts body is byte-equal to main (LIB-SHIP W4: plus the W4 chunks, and loaders.ts less the W4 lines)', () => {
    const now = readdirSync(GEN).filter(n => /^posture-.*\.ts$|^loaders\.ts$/.test(n)).sort();
    expect(now).toEqual([...Object.keys(BODY_MAIN), ...Object.keys(BODY_W4), ...Object.keys(BODY_PF), ...Object.keys(BODY_W5), ...Object.keys(BODY_W6), ...Object.keys(BODY_W7), ...Object.keys(BODY_W8A), ...Object.keys(BODY_W8B)].sort());   // LIB-SHIP W5: + its 10; LIB-SHIP W6: + its 7; W7: + its 16; W8a: + its 4
    for (const [n, want] of Object.entries({ ...BODY_MAIN, ...BODY_W4 })) if (n !== 'loaders.ts') expect([n, sha(body(n))]).toEqual([n, want]);
    for (const [n, want] of Object.entries(BODY_PF)) expect([n, sha(body(n))]).toEqual([n, want]);
    for (const [n, want] of Object.entries(BODY_W5)) expect([n, sha(body(n))]).toEqual([n, want]);
    for (const [n, want] of Object.entries(BODY_W6)) expect([n, sha(body(n))]).toEqual([n, want]);
    for (const [n, want] of Object.entries(BODY_W7)) expect([n, sha(body(n))]).toEqual([n, want]);
    for (const [n, want] of Object.entries(BODY_W8A)) expect([n, sha(body(n))]).toEqual([n, want]);
    for (const [n, want] of Object.entries(BODY_W8B)) expect([n, sha(body(n))]).toEqual([n, want]);   // LIB-SHIP W8b
    for (const n of W8B_HELD_POSTURE) expect([n, now.includes(n)]).toEqual([n, false]);   // LIB-SHIP W8b: the 8 held write none
    expect(now).not.toContain('posture-seated-leg-curl.ts');   // D-W8A-SEATEDHOLD
    expect(now).not.toContain('posture-underhand-lat-pulldown.ts');   // D-W8A-UNDERHANDHOLD
    expect(now).not.toContain('posture-mountain-climbers.ts');   // D-W8A-MCFEEL
    expect(now).not.toContain('posture-assisted-pull-up.ts');   // D-W8A-ASSISTEDHOLD
    // LIB-SHIP W8a: loaders.ts is LOADERS_W8A; W8a's 12 lines out gives LOADERS_W7, then the W7 chain below
    // LIB-SHIP W8b: loaders.ts is LOADERS_W8B; W8b's 36 lines out gives LOADERS_W8A (main 123c7299's), then the W8a chain
    expect(sha(body('loaders.ts'))).toBe(LOADERS_W8B);
    const w8b = w8bLess(body('loaders.ts'));
    expect([w8b.removed, sha(w8b.text)]).toEqual([36, LOADERS_W8A]);
    const w8a = w8aLess(w8b.text);
    expect([w8a.removed, sha(w8a.text)]).toEqual([12, LOADERS_W7]);
    // LIB-SHIP W7 (merge of main dc058207): W7's 64 lines out gives main dc058207's body (LOADERS_DC05)
    const w7 = w7Less(w8a.text);
    expect([w7.removed, sha(w7.text)]).toEqual([64, LOADERS_DC05]);
    expect(now).not.toContain('posture-sled-pull.ts');   // D-SHIP-W7-SLEDHOLD: the held sled_pull writes no posture chunk
    expect(now).not.toContain('posture-glute-bridge.ts');   // D-SHIP-W7-HOLD2: nor the held glute_bridge
    expect(now).not.toContain('posture-high-knees.ts');   // nor the held high_knees
    // LIB-SHIP W5: loaders.ts is LOADERS_W5; W5's 45 lines out gives LOADERS_PF (main 05382042's body), and then W4's and PLATEFIX's lines out give main's
    // LIB-SHIP W6 (merge of main de91dd21): W6's 28 lines out gives LOADERS_W5 (main de91dd21's body), then W5's as before
    expect(lessW6(w7.text)).toEqual({ removed: 28, sha: LOADERS_W5 });
    const w5 = w5Less(w6Kept(w7.text));
    expect([w5.removed, sha(w5.text)]).toEqual([45, LOADERS_PF]);
    // merge of main 7e060e83: each lane's lines taken out after the other's, so each lane's own count and main's body still hold
    expect(w4Less(pfText(w5.text))).toEqual({ removed: 24, sha: BODY_MAIN['loaders.ts'] });
    expect(pfLess(w4Text(w5.text))).toEqual({ removed: 16, sha: BODY_MAIN['loaders.ts'] });
  });
  it('LIB-SHIP W8b mutations (ruling 3): a W8b loaders line dropped, a HAND line for a W8b id, another line changed, a W8b posture byte changed, or a held id shipped, is red', () => {
    const b = body('loaders.ts'), line = '  "wall-sit": () => import(\'./posture-wall-sit\'),\n';
    expect(b).toContain(line);
    expect(w8bLess(b.replace(line, '')).removed).toBe(35);
    expect(w8bLess(b.replace(line, `${line}  "wall-sit": () => import('./hand-wall-sit'),\n`)).removed).toBe(37);
    expect(sha(w8bLess(b.replace('export const HAND', 'export const HAND_X')).text)).not.toBe(LOADERS_W8A);
    expect(sha(`${body('posture-pistol-squat.ts')} `)).not.toBe(BODY_W8B['posture-pistol-squat.ts']);
    // a held W8b id's line put back is red: not W8B_LINE's, so the W8a chain no longer holds
    expect(b).toContain('  "lib_walking_lunge",\n');
    expect(sha(w8bLess(b.replace('  "lib_walking_lunge",\n', '  "lib_walking_lunge",\n  "lib_bulgarian_split_squat",\n')).text)).not.toBe(LOADERS_W8A);
  });
  it('LIB-SHIP W8a mutations (ruling 3): a W8a loaders line dropped, a HAND line for a W8a id, another line changed, or a W8a posture byte changed, is red', () => {
    const b = w8bLess(body('loaders.ts')).text;   // LIB-SHIP W8b: its lines out first
    expect(w8aLess(b.replace('  "pec-fly": () => import(\'./posture-pec-fly\'),\n', '')).removed).toBe(11);
    expect(w8aLess(b.replace('  "pec-fly": () => import(\'./posture-pec-fly\'),\n', '  "pec-fly": () => import(\'./posture-pec-fly\'),\n  "pec-fly": () => import(\'./hand-pec-fly\'),\n')).removed).toBe(13);
    expect(sha(w8aLess(b.replace('export const HAND', 'export const HAND_X')).text)).not.toBe(LOADERS_W7);
    expect(sha(`${body('posture-crunch.ts')} `)).not.toBe(BODY_W8A['posture-crunch.ts']);
    // the held underhand_lat_pulldown's line put back is red: not W8A_LINE's, so the W7 chain no longer holds
    expect(sha(w8aLess(b.replace('  "lib_crunch",\n', '  "lib_crunch",\n  "lib_underhand_lat_pulldown",\n')).text)).not.toBe(LOADERS_W7);
  });
  it('LIB-SHIP W7 mutations (ruling 3): a W7 loaders line dropped, a HAND line for a W7 id, another line changed, or a W7 posture byte changed, is red', () => {
    const b = w8aLess(w8bLess(body('loaders.ts')).text).text;   // LIB-SHIP W8a: its lines out first (W8b: its own before)
    expect(w7Less(b.replace('  "dead-bug": () => import(\'./posture-dead-bug\'),\n', '')).removed).toBe(63);
    expect(w7Less(b.replace('export const HAND: ', '  "bird-dog": () => import(\'./hand-bird-dog\'),\nexport const HAND: ')).removed).toBe(65);
    expect(sha(w7Less(b.replace('export const HAND', 'export const HAND_X')).text)).not.toBe(LOADERS_DC05);
    expect(sha(`${body('posture-sled-push.ts')} `)).not.toBe(BODY_W7['posture-sled-push.ts']);
    // D-SHIP-W7-SLEDHOLD: sled_pull's 4 lines put back (it shipped) are red: not W7_LINE's, so the dc058207 chain no longer holds
    const shipped = b.replace('  "lib_sled_push",\n', '  "lib_sled_push",\n  "lib_sled_pull",\n');
    expect(shipped).not.toBe(b);
    expect(sha(w7Less(shipped).text)).not.toBe(LOADERS_DC05);
    // D-SHIP-W7-HOLD2: glute_bridge's line put back is red the same way
    expect(sha(w7Less(b.replace('  "lib_sled_push",\n', '  "lib_sled_push",\n  "lib_glute_bridge",\n')).text)).not.toBe(LOADERS_DC05);
  });
  it('LIB-SHIP W6 mutations: a W6 loaders line dropped, a HAND line for a W6 id, and another loaders line changed are red', () => {
    const b = w7Less(w8aLess(w8bLess(body('loaders.ts')).text).text).text,   // LIB-SHIP W8b: its lines out first; LIB-SHIP W7 merge: W7's lines out first (W8a: then its own before)
      drop = '  "face-pull": () => import(\'./posture-face-pull\'),\n';
    expect(b).toContain(drop);
    expect(lessW6(b.replace(drop, '')).removed).toBe(27);
    const head = 'export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {\n';
    expect(b).toContain(head);
    expect(lessW6(b.replace(head, `${head}  "face-pull": () => import('./hand-face-pull'),\n`)).removed).toBe(29);
    expect(lessW6(b.replace('export const HAND', 'export const HAND_X')).sha).not.toBe(LOADERS_W5);   // LIB-SHIP W6 merge: was BODY_MAIN, then LOADERS_PF; main de91dd21's body is LOADERS_W5
    expect(sha(body('posture-face-pull.ts').replace('posture', 'Posture'))).not.toBe(BODY_W6['posture-face-pull.ts']);
  });
  it('LIB-SHIP W5 mutations (ruling 3): a W5 loaders line dropped, a HAND line for a no-pair W5 id, or another line changed, is red', () => {
    const b = w6Kept(body('loaders.ts'));   // LIB-SHIP W6 merge: W6's lines taken out first
    expect(w5Less(b.replace('  "hammer-curl": () => import(\'./posture-hammer-curl\'),\n', '')).removed).toBe(44);
    expect(w5Less(b.replace('export const HAND: ', '  "front-squat": () => import(\'./hand-front-squat\'),\nexport const HAND: ')).removed).toBe(46);
    expect(sha(w5Less(b.replace('export const HAND', 'export const HAND_X')).text)).not.toBe(LOADERS_PF);
  });
  it('LIB-SHIP W4 mutations: a W4 loaders line dropped, another loaders line changed, and a W4 posture byte changed are red', () => {
    const t = pfText(w5Less(w6Kept(body('loaders.ts'))).text);   // LIB-SHIP W6 merge: W6's lines taken out first
    expect(w4Less(t.replace('  "t-bar-row": () => import(\'./feel-t-bar-row\'),\n', '')).removed).toBe(23);
    expect(w4Less(t.replace('export const FEEL', 'export const FEEL_X')).sha).not.toBe(BODY_MAIN['loaders.ts']);
    expect(sha(`${body('posture-cable-shrug.ts')} `)).not.toBe(BODY_W4['posture-cable-shrug.ts']);
  });
  it('LIB-PLATEFIX-1 mutations: a PLATEFIX loaders line dropped, or another loaders line changed, is red', () => {
    const b = w4Text(w6Kept(body('loaders.ts')));   // LIB-SHIP W6 merge: W6's lines taken out first
    expect(pfLess(b.replace('  "reverse-lunge": () => import(\'./posture-reverse-lunge\'),\n', '')).removed).toBe(15);
    expect(pfLess(b.replace('export const HAND', 'export const HAND_X')).sha).not.toBe(BODY_MAIN['loaders.ts']);
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
let Z: any, I: any, F: any, L: any;
const SHEET = { zooms: [{ key: 'hand', kind: 'hand' }], posture: [{ key: 'pivot' }, { key: 'pad' }], setup: [{ zoom: 'hand' }], mistakes: [], feel: { rows: [] } };
const CARD = { zooms: [{ key: 'knee-pivot', kind: 'posture' }, { key: 'ankle-pad', kind: 'posture' }, { key: 'grip', kind: 'hand' }] };
const ENTRY = { ruling: 'D-SHIP-TEXTZOOM', checkpoints: { 'knee-pivot': 'pivot', 'ankle-pad': 'pad' } };
const ok = (list: any = { lib_x: ENTRY }, sheet: any = SHEET, card: any = CARD) => Z.textZoomRow('lib_x', sheet, card, list);

beforeAll(async () => {
  Z = await import(/* @vite-ignore */ url('tools/plates/gen/zooms.mjs'));
  I = await import(/* @vite-ignore */ url('tools/plates/gen/ids.mjs'));
  F = await import(/* @vite-ignore */ url('tests/howto/fixtures/zoom-none/fixture.mjs'));
  L = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));
});

describe('F-ZOOM-NONE A2: textZoomRow, the zero-zoom guard', () => {
  it('a ruled zero-zoom row gives its entry; a row with posture zooms and no entry gives null; the real list is empty on main', () => {
    expect(ok()).toEqual(ENTRY);
    expect(Z.textZoomRow('lib_y', { ...SHEET, zooms: [{ key: 'back', kind: 'posture' }] }, CARD, {})).toBeNull();
    // LIB-SHIP W6 (#393 6653994390, D-SHIP-W6-ZOOMNONE): was toEqual({}) on main; the wave that ships a row adds its entry
    expect(Z.readTextZooms()).toEqual({
      lib_machine_pullover: { ruling: 'D-SHIP-TEXTZOOM', checkpoints: { 'pullover-pivot': 'pivot' } },
      lib_smith_machine_shoulder_press: { ruling: 'D-SHIP-TEXTZOOM', checkpoints: { 'smith-ohp-bench': 'bench' } },
    });
    expect(I.TEXT_ZOOMS).toBe(Z.TEXT_ZOOMS);
    expect([...Z.TEXT_ZOOM_RULINGS]).toEqual(['D-SHIP-TEXTZOOM']);
  });
  it('red 1: a card posture zoom not mapped, or mapped to a checkpoint the sheet lacks (the card zoom is drawable)', () => {
    expect(() => ok({ lib_x: { ...ENTRY, checkpoints: { 'knee-pivot': 'pivot' } } })).toThrow(/card zoom ankle-pad is drawable/);
    expect(() => ok({ lib_x: { ...ENTRY, checkpoints: { ...ENTRY.checkpoints, 'ankle-pad': 'calves' } } })).toThrow(/maps to checkpoint calves, which the sheet's posture does not hold/);
  });
  it('red 2: no entry, no ruling, a ruling outside the set', () => {
    expect(() => ok({})).toThrow(/no posture zoom, and no tools\/plates\/library\/text-zooms.json entry/);
    expect(() => ok({ lib_x: { checkpoints: ENTRY.checkpoints } })).toThrow(/ruling undefined is not one of D-SHIP-TEXTZOOM/);
    expect(() => ok({ lib_x: { ...ENTRY, ruling: 'D-SHIP-C3' } })).toThrow(/ruling "D-SHIP-C3" is not one of/);
  });
  it('red 4: an entry for a row with posture zooms, a zoom the card lacks, a dangling link, a ruled page holding a posture close-up', () => {
    expect(() => ok(undefined, { ...SHEET, zooms: [...SHEET.zooms, { key: 'pivot', kind: 'posture' }] })).toThrow(/has posture zooms \[pivot\], but tools\/plates\/library\/text-zooms.json names it/);
    expect(() => ok({ lib_x: { ...ENTRY, checkpoints: { ...ENTRY.checkpoints, seat: 'pivot' } } })).toThrow(/names card zoom seat, which the card's posture zooms do not hold/);
    expect(() => ok(undefined, { ...SHEET, posture: [{ key: 'pivot', zoom: 'knee-pivot' }, { key: 'pad' }] })).toThrow(/links to close-ups the sheet does not have: knee-pivot/);
    expect(() => ok(undefined, { ...SHEET, feel: { rows: [{ zoom: 'pad-zoom' }] } })).toThrow(/does not have: pad-zoom/);
    const page = '<div class="zx" id="x-zoom-hand" data-zoom="hand"></div><div class="zx" id="x-zoom-pivot" data-zoom="pivot"></div>';
    expect(() => Z.textZoomPageCheck('lib_x', page, 'x', 'p.html')).toThrow(/ruled in .*, but p.html holds posture close-ups \[pivot\]/);
    const card = (inner: string) => `<article class="sheet-card" id="card-x">${inner}<div class="zx" id="x-zoom-hand" data-zoom="hand"></div></article>`;
    expect(() => Z.textZoomPageCheck('lib_x', card('<button class="zx-chip" data-zoom="hand"></button>'), 'x', 'p.html', ['hand'])).not.toThrow();
    expect(() => Z.textZoomPageCheck('lib_x', card('<button class="fr-show" data-zoom="pivot"></button>'), 'x', 'p.html', ['hand'])).toThrow(/its card on p.html opens close-ups it does not have \[pivot\]/);
  });
  it('the zero-zoom path only (#388 review, Low): a drawn-zoom row with no entry never reads its card', () => {
    const none = () => { throw new Error('card read'); };
    expect(Z.textZoomOfSheet('lib_y', { ...SHEET, zooms: [{ key: 'back', kind: 'posture' }] }, {}, none)).toBeNull();
    expect(() => Z.textZoomOfSheet('lib_x', SHEET, { lib_x: ENTRY }, none)).toThrow(/card read/);
    expect(Z.textZoomOfSheet('lib_x', SHEET, { lib_x: ENTRY }, () => CARD)).toEqual({ entry: ENTRY, own: ['hand'] });
  });
  it('ids.mjs missingChunks: a ruled row needs no posture chunk; without the ruling (the guard removed) it throws as today', () => {
    const row = { id: 'lib_x', slug: 'x', chromeId: 'x' }, has = (n: string) => n !== 'posture-x';
    expect(() => I.missingChunks([row], has, { x: 'k' }, {}, () => true, {}, new Set(['lib_x']))).not.toThrow();
    expect(() => I.missingChunks([row], has, { x: 'k' }, {}, () => true)).toThrow(/ids: lib_x: no src\/howto\/generated\/posture-x.ts/);
    expect(() => I.missingChunks([row], () => true, { x: 'k' }, {}, () => true, {}, new Set(['lib_x']))).not.toThrow();
  });
});

// A1 (amended, D-TEXT-GOLDEN): LIB-2b's scratch row made zero-zoom in a temp tree (tests/howto/fixtures/zoom-none)
// generate runs in an awaited child process, so no long synchronous block holds this worker's RPC (F-VITEST-RPC)
type Gen = { status: number; stderr: string };
const gen = (root: string) => new Promise<Gen>(res => execFile(process.execPath, ['tools/plates/generate.mjs'], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 26 },
  (e, _out, stderr) => res({ status: e ? ((e as { code?: number }).code ?? 1) : 0, stderr: String(stderr) })));
let tree = '', first: Gen, guardless: Gen, keptPanel: Gen, keptButton: Gen;
const extra: string[] = [];
describe('F-ZOOM-NONE A1: a ruled zero-zoom row generates no posture chunk; with the guard removed it throws', () => {
  beforeAll(async () => {
    if (!IN_CHILD) return;   // the tree is built in the child process (F-VITEST-RPC)
    tree = F.zeroZoomTree();
    first = await gen(tree);
    F.guardOff(tree);
    guardless = await gen(tree);
    // the page-check reds through generate (#388 review, Medium): the ruled row's page keeps one posture close-up, or
    // one control that opens it
    for (const keep of ['panel', 'button']) {
      const t = F.zeroZoomTree({ keep });
      extra.push(t);
      const r = await gen(t);
      if (keep === 'panel') keptPanel = r; else keptButton = r;
    }
  }, 900_000);
  afterAll(() => { if (tree) L.drop(tree); for (const t of extra) L.drop(t); });
  child.it('generate passes, writes the row\'s ht- and feel- chunks and no posture chunk; loaders.ts has no POSTURE line for it', () => {
    expect([first.status, first.stderr.split('\n').filter((l: string) => /Error/.test(l)).slice(0, 3)]).toEqual([0, []]);
    const g = join(tree, 'src/howto/generated');
    expect(existsSync(join(g, `ht-${L.CHROME}.ts`))).toBe(true);
    expect(existsSync(join(g, `feel-${L.CHROME}.ts`))).toBe(true);
    expect(existsSync(join(g, `posture-${L.CHROME}.ts`))).toBe(false);
    const loaders = readFileSync(join(g, 'loaders.ts'), 'utf8'), posture = loaders.slice(loaders.indexOf('export const POSTURE'), loaders.indexOf('export const FEEL'));
    expect(posture.length).toBeGreaterThan(0);
    expect(posture).not.toContain(`"${L.CHROME}"`);
    expect(loaders).toContain(`lib_cable_lateral_raise: () => import('./ht-${L.CHROME}')`);
  }, 600_000);
  child.it('red 3: the same tree with the guard removed (today\'s code) throws "no posture close-up"', () => {
    expect(guardless.status).not.toBe(0);
    expect(guardless.stderr).toContain(`zooms: ${L.CHROME}: no posture close-up in the golden-B page`);
  }, 600_000);
  child.it('red 4 through generate: a ruled row whose page keeps a posture close-up, or a control that opens one, is refused', () => {
    expect(keptPanel.status).not.toBe(0);
    expect(keptPanel.stderr).toContain(`zooms: ${L.ID}: ruled in tools/plates/library/text-zooms.json, but tests/howto/golden/library/zz-lib2b.layers.html holds posture close-ups [top]`);
    expect(keptButton.status).not.toBe(0);
    expect(keptButton.stderr).toContain(`zooms: ${L.ID}: ruled in tools/plates/library/text-zooms.json, but its card on tests/howto/golden/library/zz-lib2b.layers.html opens close-ups it does not have [top]`);
  }, 900_000);
});
