const CACHE_NAME = 'quranic-light-v1';
const ASSETS_TO_CACHE = [
    './quran-light-index.html',
    './quran-light-style.css',
    './quran-light-script.js',
    './quran.json',
    './manifest.json',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png',
    'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Roboto:wght@300;400;500&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
