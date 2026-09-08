/**
 * Super Mind Odyssey - Service Worker (Offline Cache Engine)
 * Network-first strategy for seamless updates when online, 100% offline fallback when disconnected.
 */

const CACHE_NAME = 'mind-odyssey-v2.4.5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
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
  // If it's an external API call, never cache or intercept: pass straight to network
  if (
    event.request.url.includes('api.github.com') ||
    event.request.url.includes('openrouter.ai') ||
    event.request.url.includes('googleapis.com') ||
    event.request.url.includes('api.groq.com')
  ) {
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
