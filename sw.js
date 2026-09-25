const CACHE='adaptive-v10-4-g5-decimal-hardfix-20260925';
const FILES=['./','./index.html','./app.js','./core_bank.js','./third_bank.js','./fifth_bank.js','./scope_fix_bank.js','./curriculum_catalog.js','./curriculum_catalog.json','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  const fresh=e.request.mode==='navigate'||/\/(?:index\.html|app\.js)$/.test(u.pathname);
  if(fresh){
    e.respondWith(fetch(e.request).then(r=>{
      const copy=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
      return r;
    }).catch(()=>caches.match(e.request)));
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
