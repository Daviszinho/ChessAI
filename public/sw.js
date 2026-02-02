// This is a basic service worker.
// A fetch event handler is required for an app to be installable.
self.addEventListener('fetch', (event) => {
  // For this simple app, we don't need complex caching.
  // This empty handler is enough to make the app installable.
});
