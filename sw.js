/* WrenchWorks Garage offline support. The game page is fetched fresh when online and cached for offline play. */
const CACHE='wrenchworks-v41';
const LOCAL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./maskable-512.png'];
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js?wwg=7.0','https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js?wwg=7.0'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(async c=>{await c.addAll(LOCAL);for(const u of CDN){try{await c.add(new Request(u,{mode:'no-cors'}));}catch(err){}}}).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;
 const isPage=req.mode==='navigate'||req.destination==='document';
 if(isPage){e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return r;}).catch(()=>caches.match('./index.html')));return;}
 e.respondWith(caches.match(req,{ignoreVary:true}).then(hit=>hit||fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return r;})));
});
