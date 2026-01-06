const CACHE_NAME = 'cognibias-v7'; // Bumped to force total purge of stale index.html
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.svg'
];

// ⚡️ PWA SENTINEL: Infrastructure Core
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return Promise.allSettled(
        STATIC_ASSETS.map(asset => cache.add(asset))
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => {
          console.log('[SW] Purging old cache:', key);
          return caches.delete(key);
        })
      );
    })
  );
  return self.clients.claim();
});

// 🌊 Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isInternal = url.origin === self.location.origin;
  const isFont = url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com');
  
  if (!isInternal && !isFont) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch((err) => {
          console.error('[SW] Fetch failed:', err);
          return cachedResponse;
        });

        // ⚡️ ARCHITECT PREFERENCE: For the main entry point (index.html), 
        // always prioritize network to prevent stale hashes in build.
        if (url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
          return fetchPromise || cachedResponse;
        }

        return cachedResponse || fetchPromise;
      });
    })
  );
});
