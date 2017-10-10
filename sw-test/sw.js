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
  this.skipWaiting();
});

this.addEventListener('activate', function (event) {
  event.waitUntil(clients.claim());
  console.log("ACTIVATED");
  var cacheWhitelist = ['v2'];

  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
}, false /*useCapture*/);

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();

        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/sw-test/gallery/myLittleVader.jpg');
      });
    }
  }));
});

this.addEventListener('push', function (event) {

  console.log('Received push message');
  var data = {};
  // if (event.data) {
  //   data = event.data.json();
  // }
  var title = data.title || "Placeholder Title";
  console.log("Another arbitrary change");
  // var message = data.message || "Placeholder Message";
  // var icon = "images/bountyHunters.jpg";

  // var title = "Placeholder Title";
  // var message = "Placeholder Message";
  // var icon = "images/bountyHunters.jpg";
  // var tag = 'push-notification';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: "test message",
      tag: "test tag"
    })
  );
});

// this.addEventListener('notificationclick', function(event) {
//   event.notification.close();
// });

// this.addEventListener('statechange', function (event) {
//   console.log(`STATECHANGE ${e.target.state}`);
// });

// this.addEventListener('push', function (event) {
//   console.log(event.data);
// })