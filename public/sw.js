const CACHE_NAME = 'cognibias-v5'; // Bumped for CDN purge
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
];

// ⚡️ PWA SENTINEL: Infrastructure Core
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      // Use addAll with map to catch individual failures if needed, 
      // but here we trust fonts + local assets
      return cache.addAll(STATIC_ASSETS);
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
  // Skip cross-origin (except fonts) and API calls
  const isInternal = event.request.url.startsWith(self.location.origin);
  const isFont = event.request.url.includes('fonts.googleapis.com') || event.request.url.includes('fonts.gstatic.com');
  
  if (!isInternal && !isFont) return;
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Cache successful responses
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch((err) => {
          console.error('[SW] Fetch failed:', err);
          return cachedResponse;
        });

        // Return cached immediately, fallback to network
        return cachedResponse || fetchPromise;
      });
    })
  );
});
