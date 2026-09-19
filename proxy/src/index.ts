import { createHandler } from './handler';
import { callAnthropic } from './anthropic';
import type { WorkerEnv } from './types';

const handle = createHandler(callAnthropic);

export default {
  fetch(request: Request, env: WorkerEnv): Promise<Response> {
    return handle(request, env);
  },
};
