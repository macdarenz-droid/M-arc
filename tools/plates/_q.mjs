const t0 = Date.now();
const proof = await import('./library/qa/proof.mjs');
console.log('import', Date.now() - t0);
const b = await proof.cleanBase();
console.log('base', Date.now() - t0);
b.drop();
