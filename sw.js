const CACHE_NAME = 'ke-toan-calo-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(urlsToCache);
  }));
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(cacheNames) {
    return Promise.all(cacheNames.filter(function(n) {
      return n !== CACHE_NAME;
    }).map(function(n) { return caches.delete(n); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  if (event.request.url.includes('coze.com') || event.request.url.includes('sf-cdn')) return;
  event.respondWith(caches.match(event.request).then(function(response) {
    return response || fetch(event.request);
  }));
});
