const CACHE = "precache";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

workbox.precaching.precacheAndRoute([
    { url: '/sample-data/ingredients.json', revision: '20201027' },
    { url: '/sample-data/recipes.json', revision: '20201027' },
    { url: '/scripts/online-status.js', revision: '20201027' }
]);

workbox.routing.registerRoute(
    new RegExp('https://localhost:44355/*'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: CACHE
    })
);

workbox.routing.registerRoute(
    new RegExp('/*'),
    new workbox.strategies.NetworkFirst({
        cacheName: CACHE
    })
);