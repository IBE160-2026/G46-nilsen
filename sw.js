const CACHE_NAME = 'samtalestotte-shell-v20-11-preview-8';

const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.webmanifest',
  '/src/client-data.js',
  '/src/privacy-name-data.js',
  '/src/privacy-detector.js',
  '/assets/icons/app-icon.svg',
  '/assets/images/logo.png',
  '/assets/images/logo-light.png',
  '/assets/images/logo-symbol.png',
  '/assets/images/logo-symbol-light.png',
  '/assets/images/hero-conversation-exact.png',
  '/assets/images/profile-ai.png',
  '/assets/images/profile-ai-light.png',
  '/assets/images/profile-human.png',
  '/assets/images/profile-human-light.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put('/', copy));
          }
          return response;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  if (!APP_SHELL.includes(url.pathname)) return;
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }))
  );
});
