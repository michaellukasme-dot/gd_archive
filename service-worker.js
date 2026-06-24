/* Every Show — GD Archive · service worker (overwrites the OLD one of the same name so returning
   visitors — like the early copy Robert Garcia got — force-update to the new cassette). New cache name
   + skipWaiting + clients.claim evict the old cache and take control. */
const CACHE = 'gd-archive-v2-2026-06-24';
const SHELL = ['./', './index.html', './cassette-reader.js', './market-core.js', './syf.png',
  './manifest.webmanifest', './icons/steal-your-face-192.png', './icons/steal-your-face.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    if (r && (r.ok || r.type === 'opaque')) { const c = r.clone(); caches.open(CACHE).then(x => { try { x.put(e.request, c); } catch (z) {} }); }
    return r;
  }).catch(() => caches.match('./index.html'))));
});
