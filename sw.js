const CACHE='schedule-hub-v1';
const APP_SHELL=['./','./index.html','./manifest.webmanifest'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(c=>c.addAll(APP_SHELL))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch',event=>{
  const u=new URL(event.request.url);

  if(u.origin.includes('supabase.co') || u.pathname.includes('/auth/')) return;
  if(event.request.method!=='GET') return;

  event.respondWith(
    fetch(event.request).then(r=>{
      const copy=r.clone();
      caches.open(CACHE).then(c=>c.put(event.request,copy));
      return r;
    }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html')))
  );
});
