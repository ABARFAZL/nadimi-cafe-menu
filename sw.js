// Service Worker for Nadimi Coffee PWA & TV Menu
const CACHE_NAME = 'nadimi-cafe-v7';
const STATIC_ASSETS = [
  '/nadimi_logo_vector_hd.png',
  '/manifest.json?v=2',
  '/apple-touch-icon.png?v=2',
  '/icon-192.png?v=2',
  '/icon-512.png?v=2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Never cache API price calls; always fetch direct from network
  if (url.pathname.startsWith('/api/') || url.hostname.includes('restful-api.dev') || url.hostname.includes('vercel-storage.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 2. HTML navigation requests: ALWAYS Network-First, with fresh fetch
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname === '/admin') {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 3. Static assets: Cache-First with background revalidation
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
