const CACHE = 'spicy-v4';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if(e.request.method !== 'GET' || u.hostname.includes('pollinations')) return;
  if(u.origin !== location.origin && !u.hostname.includes('fonts.g')) return; // Openverse searches and audio downloads always go to the network
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    if(res.ok && (u.origin === location.origin || u.hostname.includes('fonts.g'))) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => hit)));
});
