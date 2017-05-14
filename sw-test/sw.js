this.addEventListener('install', function (event) {
  console.log('INSTALLED');
  event.waitUntil(
    caches.open('v1').then(function (cache) {
      return cache.addAll([
        '/sw-test/',
        '/sw-test/index.html',
        '/sw-test/style.css',
        '/sw-test/app.js',
        '/sw-test/image-list.js',
        '/sw-test/star-wars-logo.jpg',
        '/sw-test/gallery/bountyHunters.jpg',
        '/sw-test/gallery/myLittleVader.jpg',
        '/sw-test/gallery/snowTroopers.jpg'
      ]);
    })
  );
});

// this.addEventListener('activate', function (event) {
//   console.log("ACTIVATED");
//   var cacheWhitelist = ['v2'];

//   event.waitUntil(
//     caches.keys().then(function (keyList) {
//       return Promise.all(keyList.map(function (key) {
//         if (cacheWhitelist.indexOf(key) === -1) {
//           return caches.delete(key);
//         }
//       }));
//     })
//   );
// }, false /*useCapture*/);

this.addEventListener('fetch', function (event) {
  console.log('FETCHING');
  var response;
  event.respondWith(caches.match(event.request).catch(function () {
    return fetch(event.request);
  }).then(function (r) {
    response = r;
    caches.open('v1').then(function (cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  }).catch(function () {
    return caches.match('/sw-test/gallery/myLittleVader.jpg');
  }));
});

this.addEventListener('statechange', function (event) {
  console.log(`STATECHANGE ${e.target.state}`);
});

this.addEventListener('push', function (event) {
  console.log(event.data);
})