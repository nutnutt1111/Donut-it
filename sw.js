/*
 * Simple service worker for Donut iT Tools.
 * This service worker provides basic lifecycle event handling to allow
 * progressive web app (PWA) installation. It doesn’t cache assets but
 * registers itself and claims control so the app can run offline if
 * caching is implemented later.
 */

self.addEventListener('install', (event) => {
  // Activate immediately after installation
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // For now, just fall back to the network. Caching could be added here.
  return;
});