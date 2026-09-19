import { callAnthropic, callNotes, callTagExercise } from './anthropic';
import { createHandler, MAX_BODY_BYTES, MAX_NOTES_BODY_BYTES, MAX_TAG_BODY_BYTES, validateNotesPayload, validatePayload, validateTagPayload, type RouteConfig } from './handler';
import type { ExplainPayload, NotesPayload, TagExercisePayload, WorkerEnv } from './types';

const explainRoute: RouteConfig = {
  path: '/explain',
  maxBody: MAX_BODY_BYTES,
  validate: validatePayload,
  async call(payload, env: WorkerEnv) {
    const p = payload as ExplainPayload;
    const out = await callAnthropic(p, env);
    const wanted = new Set(p.explain);
    const items = out.items.filter(i => wanted.has(i.id)).map(i => ({ id: i.id, text: String(i.text).trim() }));
    return { summary: String(out.summary).trim(), items, model: out.model, usage: out.usage };
  },
};

const tagExerciseRoute: RouteConfig = {
  path: '/tag-exercise',
  maxBody: MAX_TAG_BODY_BYTES,
  validate: validateTagPayload,
  async call(payload, env: WorkerEnv) {
    const out = await callTagExercise(payload as TagExercisePayload, env);
    return { equipment: out.equipment, primary: out.primary, secondary: out.secondary, pattern: out.pattern, mode: out.mode, confidence: out.confidence, model: out.model, usage: out.usage };
  },
};

const notesRoute: RouteConfig = {
  path: '/notes',
  maxBody: MAX_NOTES_BODY_BYTES,
  validate: validateNotesPayload,
  async call(payload, env: WorkerEnv) {
    const out = await callNotes(payload as NotesPayload, env);
    return { flags: out.flags, model: out.model, usage: out.usage };
  },
};

const handle = createHandler([explainRoute, tagExerciseRoute, notesRoute]);

export default {
  fetch(request: Request, env: WorkerEnv): Promise<Response> {
    return handle(request, env);
  },
};
