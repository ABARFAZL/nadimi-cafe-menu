// Service Worker for Nadimi Coffee PWA
const CACHE_NAME = 'nadimi-cafe-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/admin.html',
  '/nadimi_logo_vector_hd.png',
  '/instagram_qr.png',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
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

  // Do not cache API price calls; always fetch fresh live prices
  if (url.pathname.startsWith('/api/') || url.hostname.includes('restful-api.dev')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network first, fallback to cache for HTML/assets
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
