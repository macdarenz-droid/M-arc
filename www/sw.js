const BUILD="marc-v36-8-56-single-shell";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",event=>event.waitUntil((async()=>{try{const keys=await caches.keys();await Promise.all(keys.filter(k=>/^marc-/i.test(k)).map(k=>caches.delete(k)))}catch(_){}try{await self.clients.claim()}catch(_){}})()));
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;event.respondWith(fetch(event.request,{cache:"no-store"}));});
