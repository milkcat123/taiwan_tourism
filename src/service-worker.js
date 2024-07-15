const cacheName = "testPWA";
import { precacheAndRoute } from "workbox-precaching";
// import { setCacheNameDetails } from "workbox-core";

precacheAndRoute(self.__WB_MANIFEST);

// setCacheNameDetails({ prefix: process.env.VUE_APP_VERSION });
// self.__precacheManifest = [].concat(self.__precacheManifest || []);
// precacheAndRoute(self.__precacheManifest, {});

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .open(cacheName)
      .then((cache) => cache.match(event.request, { ignoreSearch: true }))
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
