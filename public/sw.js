// Clean-up for visitors who installed the old PWA version of this site: clears its offline
// caches and unregisters the service worker so they always get the live site.
// Safe to delete once old visitors have come back (a few months after launch).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) await caches.delete(key);
    await self.registration.unregister();
    for (const client of await self.clients.matchAll({ type: 'window' })) client.navigate(client.url);
  })());
});
