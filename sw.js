// Service worker: persists the mosaic images (and other same-origin images)
// in Cache Storage so they load instantly on repeat visits, even offline.
//
// Bump CACHE_VERSION whenever the image set changes so stale files get
// purged and re-fetched.

const CACHE_NAME = "callen-images-v1";
const IMAGE_EXTENSIONS = /\.(webp|jpg|jpeg|png|gif|svg|ico|avif)(\?.*)?$/i;

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== CACHE_NAME)
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    if (request.method !== "GET") return;

    const url = new URL(request.url);
    // Only cache our own origin's images; leave cross-origin requests
    // (Lanyard, Discord CDN, fonts, etc.) and everything else untouched.
    if (url.origin !== self.location.origin) return;
    if (!IMAGE_EXTENSIONS.test(url.pathname)) return;

    // Cache-first: serve from disk when available, otherwise fetch and store.
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;

            return fetch(request).then((response) => {
                if (response && response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                }
                return response;
            });
        })
    );
});
