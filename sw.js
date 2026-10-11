// Network first, cache as fallback: updates arrive as soon as the tablet is online, and the game still opens offline.
const CACHE = "bh-v1";
const SHELL = ["./", "./index.html", "./style.css", "./app.js", "./manifest.webmanifest", "./firebase-config.js", "./icon.svg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.hostname.endsWith("googleapis.com") && !u.hostname.startsWith("fonts.")) return; // Firestore traffic
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
