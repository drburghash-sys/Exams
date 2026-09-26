const CACHE='adaptive-v10-5-20260926';
const STATIC=['./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(STATIC)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==self.location.origin)return;
  const codeOrData=e.request.mode==='navigate'||e.request.destination==='script'||e.request.destination==='manifest'||/\.(?:js|json|webmanifest|html)$/.test(u.pathname);
  if(codeOrData){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>r).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp;
  })));
});
