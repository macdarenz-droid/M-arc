// LIB-1 (never merged): print every gate error. The gate ends with console.error('Page errors:', errors), and Node's
// default inspect cuts an array at 100 items and a string at 10,000 chars. Loaded via .npmrc node-options.
import { inspect } from 'node:util';
inspect.defaultOptions.maxArrayLength = null;
inspect.defaultOptions.maxStringLength = null;
