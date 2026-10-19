// HT-11: types for delta.js, the generated How-to modules' path decoder.
/** Decodes fragments that share one path table; `table` grows in place with each new path. */
export declare function unpack<T extends readonly string[]>(frags: T, table?: string[]): { -readonly [K in keyof T]: string };
