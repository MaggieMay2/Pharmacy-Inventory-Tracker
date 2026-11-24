/* ShelfSafe service worker: lets the installed app open without internet.
   - The app's own files: fetched fresh when online (so new uploads show up), the saved copy when offline.
   - Firebase code from gstatic: saved the first time it loads, so on-device AI scanning can start offline.
   - Requests to the AI and other Google services are never cached. */
const CACHE = "shelfsafe-v1";
const APP_FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Our own files: network first, saved copy when offline
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true })
          .then((hit) => hit || (req.mode === "navigate" ? caches.match("./index.html") : undefined))
          .then((hit) => hit || Response.error()))
    );
    return;
  }

  // Firebase SDK files: these never change for a given version, so the saved copy is used first
  if (url.hostname === "www.gstatic.com" && url.pathname.startsWith("/firebasejs/")) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
  // Everything else (AI requests, App Check, reCAPTCHA) goes straight to the network
});
