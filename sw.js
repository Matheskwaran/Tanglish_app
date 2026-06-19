const CACHE_NAME = 'tamil-nlp-cache-v9';
const ASSETS = [
  '/',
  '/html/login.html',
  '/html/signup.html',
  '/html/forgot_password.html',
  '/html/dashboard.html',
  '/html/translator.html',
  '/html/history.html',
  '/html/profile.html',
  '/html/settings.html',
  '/html/children.html',
  '/css/main.css',
  '/css/auth.css',
  '/css/dashboard.css',
  '/css/profile.css',
  '/css/children.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/profile.js',
  '/js/translator.js',
  '/js/children.js',
  '/js/voice.js',
  '/js/gesture.js',
  '/sw.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(err => {
        console.warn('Caching failed for some assets, caching core assets instead');
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            return caches.delete(k);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Clone and cache successful GET requests
        if (res && res.status === 200 && e.request.method === 'GET') {
          const cacheCopy = res.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, cacheCopy);
          });
        }
        return res;
      })
      .catch(() => {
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (e.request.mode === 'navigate') {
            return caches.match('/html/login.html');
          }
        });
      })
  );
});
