/**
 * 7.5: turns an arbitrary thrown error into the allowlisted, scrubbed Report shape.
 * Privacy is the point: nothing here copies a field it wasn't told to build, and the message
 * cleaning is mechanical (digits, quoted strings), not a guess at what looks personal.
 */
import type { Frame, Report, ReportKind } from './types';

const MAX_MESSAGE_LEN = 300;
const MAX_FRAMES = 15;
const MAX_NAME_LEN = 80;
const MAX_FILE_LEN = 200;

/** Quoted strings first (so any digits inside them are already gone), then every digit → '#'. */
export function scrubMessage(raw: string): string {
  const noQuotes = raw.replace(/'[^']*'|"[^"]*"|`[^`]*`/g, '"…"');
  const noDigits = noQuotes.replace(/\d/g, '#');
  return noDigits.slice(0, MAX_MESSAGE_LEN);
}

/** True only for a frame from this page's own origin (the app bundle). Anything else, a browser
 * internal, an extension, another host, a data: or blob: url (which can carry content) or a bare
 * path (which can carry a user's folder name), is not ours and never sent. */
export function isAppFrame(file: string, origin: string): boolean {
  if (!file || !origin) return false;
  return file.startsWith(`${origin}/`);
}

const FRAME_RE = /(?:^|\bat\s+)(?:[^(\n]*\()?([^\s()]+):(\d+):(\d+)\)?/;

/** Parses a V8-style Error.stack into frames, app-bundle only, at most MAX_FRAMES. */
export function framesFromStack(stack: string | undefined, origin = safeOrigin()): Frame[] {
  if (!stack) return [];
  const frames: Frame[] = [];
  for (const line of stack.split('\n')) {
    const m = FRAME_RE.exec(line);
    if (!m) continue;
    const [, rawFile, lineNo, col] = m;
    // Firefox/Safari write "fn@url": keep the url only. Query and hash never go.
    const file = (rawFile ?? '').replace(/^[^@\s]*@/, '').split(/[?#]/)[0]!.slice(0, MAX_FILE_LEN);
    if (!file || !isAppFrame(file, origin)) continue;
    frames.push({ file, line: Number(lineNo), col: Number(col) });
    if (frames.length >= MAX_FRAMES) break;
  }
  return frames;
}

function safeOrigin(): string {
  try { return typeof location !== 'undefined' ? location.origin : ''; } catch { return ''; }
}

/** An error name is code (TypeError, QuotaExceededError, save-failed), never free text: anything
 * that isn't a plain identifier becomes 'Error'. */
export function cleanName(raw: string): string {
  return /^[A-Za-z_$][\w$.-]*$/.test(raw) && raw.length <= MAX_NAME_LEN ? raw : 'Error';
}

/** A short, stable, non-cryptographic hash — good enough to dedupe by, not to authenticate. */
function hash32(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function signatureOf(kind: ReportKind, name: string, frames: Frame[]): string {
  const top = frames.slice(0, 3).map(f => `${f.file}:${f.line}`).join(',');
  return hash32(`${kind}|${name}|${top}`);
}

export interface BuildReportInput {
  installId: string;
  app: string;
  platform: 'android' | 'web';
  route: string;
  kind: ReportKind;
  name: string;
  rawMessage: string;
  stack?: string;
  os?: string;
  device?: string;
  now?: Date;
}

/** Builds a Report from an explicit allowlist of inputs only — an arbitrary Error or event object
 * is never spread into it, so an unknown field can't reach the wire. */
export function buildReport(input: BuildReportInput): Report {
  const frames = framesFromStack(input.stack);
  const name = cleanName(input.name);
  const message = scrubMessage(input.rawMessage);
  return {
    installId: input.installId,
    ts: (input.now ?? new Date()).toISOString(),
    app: input.app,
    platform: input.platform,
    ...(input.os ? { os: input.os } : {}),
    ...(input.device ? { device: input.device } : {}),
    route: input.route,
    kind: input.kind,
    name,
    message,
    frames,
    sig: signatureOf(input.kind, name, frames),
    count: 1,
  };
}
