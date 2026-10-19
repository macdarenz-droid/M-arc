// BOX-CAP (D-BOXCAP-WIRE): types for box-caps.mjs, so c7.ts can import it under strict typecheck.
export declare const NAMED_BOX_CAPS: Readonly<Record<string, number>>;
export declare function boxCapOf(key: string | undefined, fallback: number): number;
