// F-VITEST-RPC-2 (D-RPC2-GUARD): every vitest worker, child.it children included, fails a file whose event loop blocks
// 30 s or more, half of vitest's fixed 60 s worker RPC limit. One limit, no override.
import { installLagGuard } from './worker-lag';

installLagGuard(30_000);
