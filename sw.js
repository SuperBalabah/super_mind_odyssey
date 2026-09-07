/**
 * Super Mind Odyssey - Service Worker (Offline Cache Engine)
 * Network-first strategy for seamless updates when online, 100% offline fallback when disconnected.
 */

const CACHE_NAME = 'super-mind-odyssey-v1.6.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './src/styles/main.css',
  './src/scripts/starfield.js',
  './src/scripts/audio.js',
  './src/scripts/database.js',
  './src/scripts/sync.js',
  './src/scripts/app.js',
  './assets/icons/relics/relic_pig.svg',
  './assets/icons/relics/relic_prisoner.svg',
  './assets/icons/relics/relic_hourglass.svg',
  './assets/icons/relics/relic_whistle.svg',
  './assets/icons/relics/relic_glass.svg',
  './assets/icons/relics/relic_lemon.svg',
  './assets/icons/relics/relic_entropy.svg',
  './assets/icons/relics/relic_hawk.svg',
  './assets/icons/relics/relic_survivorship.svg',
  './assets/icons/relics/relic_emergence.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // If it's a call to GitHub API, let it go to network directly
  if (event.request.url.includes('api.github.com')) {
    return;
  }

  // Network-first strategy: fetch fresh content, fallback to offline cache if offline
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (networkResponse.type === 'basic' || networkResponse.type === 'cors')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
