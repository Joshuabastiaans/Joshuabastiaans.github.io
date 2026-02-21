const VERSION = 'v4';
const CORE_CACHE = `portfolio-core-${VERSION}`;
const RUNTIME_CACHE = `portfolio-runtime-${VERSION}`;

// Only pre-cache lightweight core assets.
// Pre-caching large videos/audio can make the first visit feel laggy.
const CORE_ASSETS = [
  './',
  './index.html',
  './assets/css/styles.css',
  './assets/js/main.js',
  './assets/img/favicon.ico',
  './manifest.json'
];

const isSameOrigin = (requestUrl) => {
  try {
    return new URL(requestUrl).origin === self.location.origin;
  } catch {
    return false;
  }
};

const isMediaOrImage = (requestUrl) => {
  try {
    const { pathname } = new URL(requestUrl);
    const ext = pathname.split('.').pop()?.toLowerCase();
    return [
      'mp4', 'mp3',
      'webp', 'png', 'jpg', 'jpeg', 'gif',
      'svg', 'ico',
      'woff2'
    ].includes(ext);
  } catch {
    return false;
  }
};

const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
};

const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || (await fetchPromise) || fetch(request);
};

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CORE_CACHE).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  if (!isSameOrigin(request.url)) return;

  // Navigations: try network first so updates are picked up quickly.
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CORE_CACHE).then((cache) => cache.put('./index.html', copy));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Heavy assets (video/audio/images/fonts): cache on demand.
  if (isMediaOrImage(request.url)) {
    e.respondWith(cacheFirst(request, RUNTIME_CACHE));
    return;
  }

  // CSS/JS/other same-origin GETs: fast cached response, update in background.
  e.respondWith(staleWhileRevalidate(request, CORE_CACHE));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== CORE_CACHE && key !== RUNTIME_CACHE) {
              return caches.delete(key);
            }
          })
        );
      })
    ])
  );
});
