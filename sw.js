const CACHE='adaptive-v10-1-scopefix-20260923';
const FILES=['./','./index.html','./app.js','./core_bank.js','./third_bank.js','./fifth_bank.js','./scope_fix_bank.js','./curriculum_catalog.js','./curriculum_catalog.json','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
