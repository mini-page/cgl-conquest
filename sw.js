const CACHE_NAME = 'cgl-conquest-cache-v7';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './js/state.js',
  './js/navigation.js',
  './js/dashboard.js',
  './js/syllabus.js',
  './js/plan.js',
  './js/mocks.js',
  './js/toolkit.js',
  './js/speed.js',
  './data/plan.json',
  './data/quizzes.json',
  './data/syllabus.json',
  './data/vocab.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
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

self.addEventListener('fetch', (e) => {
  // Network First for HTML, JS, JSON code files
  const isCode = e.request.url.includes('.html') || e.request.url.includes('.js') || e.request.url.includes('.json') || e.request.url.endsWith('/');
  
  if (isCode) {
    e.respondWith(
      fetch(e.request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(e.request);
      })
    );
  } else {
    // Cache First / Stale-While-Revalidate for CSS/SVG/icons
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        const fetchPromise = fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, networkResponse.clone());
            });
          }
          return networkResponse;
        }).catch(() => {});
        return cachedResponse || fetchPromise;
      })
    );
  }
});
