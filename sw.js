const CACHE_NAME = 'samtalestotte-shell-v20-11-71';

const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/styles-core.css',
  '/styles-core-foundation.css',
  '/styles-core-dialogue.css',
  '/styles-core-simulation.css',
  '/styles-core-utilities.css',
  '/styles-core-01-shell.css',
  '/styles-core-02-forms.css',
  '/styles-core-03-situation.css',
  '/styles-core-04-topic-layout.css',
  '/styles-core-05-guidance.css',
  '/styles-core-06-auth-history.css',
  '/styles-core-07-reports.css',
  '/styles-core-08-simulation-flow.css',
  '/styles-core-09-simulation-controls.css',
  '/styles-core-10-auth-views.css',
  '/styles-core-11-speech-bubbles.css',
  '/styles-core-12-admin.css',
  '/styles-core-13-survey.css',
  '/styles-core-14-final-adjustments.css',
  '/styles-responsive.css',
  '/styles-overrides.css',
  '/app.js',
  '/manifest.webmanifest',
  '/src/client-data.js',
  '/src/client/guidance-fallback.js',
  '/src/client/admin-content.js',
  '/src/client/admin-data.js',
  '/src/client/topic-search.js',
  '/src/client/situation-analysis.js',
  '/src/privacy-name-data.js',
  '/src/privacy-detector.js',
  '/assets/icons/app-icon.svg',
  '/assets/icons/app-icon-maskable-512.png',
  '/assets/icons/app-icon-512.png',
  '/assets/icons/app-icon-192.png',
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
