/**
 * OLD-ANDROID-1a: the app must open on Android 8.0-13 (API 26-33).
 * G1: Capacitor reflects on HealthConnectNativePlugin's declared methods at launch, so no Android 14
 * type (android.health.connect.*, OutcomeReceiver) may appear outside the nested Api34 class.
 * A3: the watch notification's small icon is a plain drawable, not the adaptive launcher icon.
 * CI's "OLD-ANDROID-1 native API floor" step checks the compiled classes; this checks the sources.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..');
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');

/** Blanks comments and string/char literals, keeping line breaks. */
export function stripJava(src: string): string {
  let out = '';
  for (let i = 0; i < src.length; ) {
    const c = src[i], n = src[i + 1];
    if (c === '/' && n === '/') {
      while (i < src.length && src[i] !== '\n') i++;
    } else if (c === '/' && n === '*') {
      const end = src.indexOf('*/', i + 2);
      const stop = end < 0 ? src.length : end + 2;
      out += src.slice(i, stop).replace(/[^\n]/g, ' ');
      i = stop;
    } else if (c === '"' || c === "'") {
      out += ' ';
      i++;
      while (i < src.length && src[i] !== c) i += src[i] === '\\' ? 2 : 1;
      i++;
      out += ' ';
    } else {
      out += c;
      i++;
    }
  }
  return out;
}

/** Returns [start, end) of the brace-matched body after the first match of `head`, or null. */
function braceBody(src: string, head: RegExp): [number, number] | null {
  const m = head.exec(src);
  if (!m) return null;
  const open = src.indexOf('{', m.index);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) return [open, i + 1];
  }
  return null;
}

/** Simple names an Android 14 type check must keep inside Api34. */
export function api34Names(code: string): string[] {
  const names = new Set<string>(['OutcomeReceiver']);
  for (const m of code.matchAll(/^\s*import\s+android\.health\.connect\.([\w.]+)\s*;/gm)) names.add((m[1] ?? '').split('.').pop() ?? '');
  return [...names];
}

/** Lines outside Api34 (and outside imports) that name an Android 14 type. */
export function leaks(javaSource: string): { hasApi34: boolean; hits: string[] } {
  const code = stripJava(javaSource);
  const names = api34Names(code);
  const body = braceBody(code, /\bclass\s+Api34\b/);
  const rest = body ? code.slice(0, body[0]) + code.slice(body[1]) : code;
  const hits: string[] = [];
  for (const line of rest.split('\n')) {
    if (/^\s*import\s/.test(line)) continue;
    for (const name of names) if (new RegExp(`\\b${name}\\b`).test(line)) hits.push(`${name}: ${line.trim()}`);
  }
  return { hasApi34: body !== null, hits };
}

describe('OLD-ANDROID-1a G1: Android 14 types stay inside Api34', () => {
  const src = read('native/HealthConnectNativePlugin.java');

  it('collects the Android 14 names from the imports', () => {
    const names = api34Names(stripJava(src));
    for (const n of ['HealthConnectManager', 'AggregationType', 'OutcomeReceiver', 'HealthConnectException']) expect(names).toContain(n);
  });

  it('has a nested Api34 class and no Android 14 type outside it', () => {
    const { hasApi34, hits } = leaks(src);
    expect(hasApi34).toBe(true);
    expect(hits).toEqual([]);
  });

  it('flags a signature that names an Android 14 type outside Api34', () => {
    const bad = src.replace(/\n}\s*$/, '\n    private HealthConnectManager leak() { return null; }\n}\n');
    expect(leaks(bad).hits.join('\n')).toMatch(/HealthConnectManager: private HealthConnectManager leak/);
  });

  it('ignores the names in comments and strings', () => {
    expect(stripJava('a // HealthConnectManager\nb /* OutcomeReceiver */ "HealthConnectManager" \'x\'')).not.toMatch(/HealthConnect|Outcome/);
  });
});

describe('OLD-ANDROID-1a A3: watch notification small icon', () => {
  const service = stripJava(read('native/watch/WatchService.java'));
  const m = /setSmallIcon\(\s*R\.(\w+)\.(\w+)\s*\)/.exec(service);

  it('uses a drawable, not a launcher mipmap', () => {
    expect(m?.[1]).toBe('drawable');
  });

  it('the drawable exists in native/res and is a plain (non-adaptive) image', () => {
    const name = m?.[2] ?? '';
    const found: string[] = [];
    for (const dir of readdirSync(join(ROOT, 'native/res')).filter((d) => d.startsWith('drawable'))) {
      for (const ext of ['xml', 'png']) {
        const p = join('native/res', dir, `${name}.${ext}`);
        if (existsSync(join(ROOT, p))) found.push(p);
      }
    }
    expect(found.length).toBeGreaterThan(0);
    for (const p of found.filter((f) => f.endsWith('.xml'))) {
      const xml = read(p);
      expect(xml).not.toMatch(/<adaptive-icon/);
      expect(xml).toMatch(/<vector[\s>]/);
    }
  });
});
