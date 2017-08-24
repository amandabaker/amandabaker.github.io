this.addEventListener('install', function (evt) {
    console.log('The service worker is being installed.');
});

this.addEventListener('statechange', function (event) {
  console.log(`State changed to: ${e.target.state}`);
});

this.addEventListener('fetch', function (evt) {
    console.log('The service worker is serving the asset.');
});
