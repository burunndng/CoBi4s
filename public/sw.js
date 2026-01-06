const CACHE_NAME = 'cognibias-v8'; // ⚡️ AGGRESSIVE PURGE
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.svg'
];

// ⚡️ PWA SENTINEL: Infrastructure Core
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the waiting service worker to become the active service worker.
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
  // Claim all clients immediately to prevent stale state in existing tabs
  return self.clients.claim();
});

// 🌊 Network-First Strategy for Entry Points, Stale-While-Revalidate for Assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isInternal = url.origin === self.location.origin;
  const isFont = url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com');
  
  if (!isInternal && !isFont) return;

  // ⚡️ CRITICAL FIX: Bypass cache entirely for index.html and root to prevent stale hashes
  const isEntryPoint = url.pathname.endsWith('/') || url.pathname.endsWith('index.html');

  if (isEntryPoint) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Standard Stale-While-Revalidate for other assets
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      });
    })
  );
});