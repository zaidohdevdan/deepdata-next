// Service Worker placeholder para evitar erros 404 de instalações locais anteriores.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.clients.claim().then(() => {
      // Opcional: desinstalar o service worker se não for mais necessário
      self.registration.unregister();
    })
  );
});
