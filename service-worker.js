const CACHE_NAME = "inventory-cache-v1";
const urlsToCache = [
  "/inventory-app/",
  "/inventory-app/index.html",
  "/inventory-app/login.html",
  "/inventory-app/style.css",
  "/inventory-app/app.js",
  "/inventory-app/sheet-config.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(
      response => response || fetch(event.request)
    )
  );
});
