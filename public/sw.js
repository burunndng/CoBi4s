const CACHE_NAME = 'cognibias-v11'; // ⚡️ FORCED_SYNC
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
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] PURGING_STALE_CACHE:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 🌊 Intelligent Asset Strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isInternal = url.origin === self.location.origin;
  const isFont = url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com');
  
  if (!isInternal && !isFont) return;

  // ⚡️ STRATEGY A: Entry Point (index.html) -> NETWORK-ONLY with NO-CACHE headers
  const isHtml = url.pathname.endsWith('/') || url.pathname.endsWith('index.html');
  if (isHtml) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } })
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // ⚡️ STRATEGY B: Hashed Assets -> CACHE-FIRST with 404 RECOVERY
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 404) {
            console.warn('[SW] Fatal Hash Mismatch! Clearing cache...');
            caches.delete(CACHE_NAME);
            return networkResponse;
          }

          if (networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // ⚡️ STRATEGY C: Others -> Stale-While-Revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      });
    })
  );
});
