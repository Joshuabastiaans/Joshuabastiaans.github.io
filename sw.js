const CACHE_NAME = 'portfolio-v1';
const ASSETS = [
  './',
  './index.html',
  './assets/css/styles.css',
  './assets/js/main.js',
  './assets/img/favicon.ico',
  './assets/audio/lost_in_the_woods.mp3',
  './assets/img/heerema_bg.webp',
  './assets/img/posters/intro_poster.webp',
  './assets/img/forest_bg.webp',
  './assets/img/md_blusboot.webp',
  './assets/img/pfp.webp',
  './assets/img/psychedelic_bg.webp',
  './assets/img/posters/crane_controller_poster.webp',
  './assets/img/posters/context_showcase_poster.webp',
  './assets/img/posters/monopile_poster.webp',
  './assets/video/dont_blink_intro.mp4',
  './assets/video/intro.mp4'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});
