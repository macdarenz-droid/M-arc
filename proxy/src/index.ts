import { callAnthropic, callAsk, callIdentifyExercise, callImportProgramme, callNotes, callTagExercise } from './anthropic';
import { createHandler, MAX_ASK_BODY_BYTES, MAX_BODY_BYTES, MAX_IDENTIFY_BODY_BYTES, MAX_IMPORT_BODY_BYTES, MAX_NOTES_BODY_BYTES, MAX_TAG_BODY_BYTES, validateAskPayload, validateIdentifyPayload, validateImportPayload, validateNotesPayload, validatePayload, validateTagPayload, type RouteConfig } from './handler';
import type { AskPayload, ExplainPayload, IdentifyExercisePayload, ImportProgrammePayload, NotesPayload, TagExercisePayload, WorkerEnv } from './types';

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

const askRoute: RouteConfig = {
  path: '/ask',
  maxBody: MAX_ASK_BODY_BYTES,
  validate: validateAskPayload,
  async call(payload, env: WorkerEnv) {
    const out = await callAsk(payload as AskPayload, env);
    return { scope: out.scope, category: out.category, answer: String(out.answer).trim(), model: out.model, usage: out.usage };
  },
};

const identifyExerciseRoute: RouteConfig = {
  path: '/identify-exercise',
  maxBody: MAX_IDENTIFY_BODY_BYTES,
  validate: validateIdentifyPayload,
  async call(payload, env: WorkerEnv) {
    const out = await callIdentifyExercise(payload as IdentifyExercisePayload, env);
    return { visible: out.visible, name: out.name, equipment: out.equipment, primary: out.primary, secondary: out.secondary, pattern: out.pattern, mode: out.mode, confidence: out.confidence, model: out.model, usage: out.usage };
  },
};

const importProgrammeRoute: RouteConfig = {
  path: '/import-programme',
  maxBody: MAX_IMPORT_BODY_BYTES,
  validate: validateImportPayload,
  async call(payload, env: WorkerEnv) {
    const out = await callImportProgramme(payload as ImportProgrammePayload, env);
    return { readable: out.readable, days: out.days, model: out.model, usage: out.usage };
  },
};

const handle = createHandler([explainRoute, tagExerciseRoute, notesRoute, askRoute, identifyExerciseRoute, importProgrammeRoute]);

export default {
  fetch(request: Request, env: WorkerEnv): Promise<Response> {
    return handle(request, env);
  },
};
