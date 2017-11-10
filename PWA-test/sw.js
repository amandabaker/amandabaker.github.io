
const cacheFiles = async () => {
    const cache = await caches.open("PWA-test");
    cache.addAll([
        "/PWA-test/",
        "/PWA-test/style.css",
        "/PWA-test/app.js",
        "/PWA-test/index.html",
    ]);
};

const fetchFiles = async (event) => {
    let response = await caches.match(event.request);
    if (response) {
        return response;
    } else {
        response = await fetch(event.request);
        const cache = await caches.open("PWA-test");
        cache.put(event.request, response.clone());
        return response;
    }
}

this.addEventListener("install", (event) => {
    event.waitUntil(chacheFiles);
    this.skipWaiting();
});

this.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim());
    console.log("Activated!");
}, false /*useCapture*/);

this.addEventListener("fetch", async (event) => {
    event.respondWith(fetchFiles);
});