this.addEventListener('install', function (event) {
    console.log('Service Worker Installed');
    this.skipWaiting();
});
this.addEventListener('activate', function (event) {
    console.log('Service Worker Activated');
});
this.addEventListener('push', function (event) {
    console.log('Service Worker received push message');
});
this.addEventListener('fetch', function (event) {
    console.log('Service Worker received fetch message');
});
//# sourceMappingURL=serviceworker.js.map