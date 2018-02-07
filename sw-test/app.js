// register service worker

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.oncontrollerchange = (e) => { console.log(`OnControllerChange ${e.target}`); }
  navigator.serviceWorker.register('/sw-test/sw.js', { scope: '/sw-test/' }).then(function (reg) {

    // subscribe to push manager
    // reg.pushManager.subscribe({ userVisibleOnly: true }).then((pushSubscription) => {
    //   console.log(pushSubscription.subscriptionId);
    //   console.log(pushSubscription.endpoint);
    // }, (error) => {
    //   console.log(error);
    // });

    if (reg.installing) {
      console.log('Service worker installing');
      reg.installing.onstatechange = (e) => { console.log(`Service worker state changed: ${e.target.state}`) };
    }
    if (reg.waiting) {
      console.log('Service worker installed');
      reg.waiting.onstatechange = (e) => { console.log(`Service worker state changed: ${e.target.state}`) };
    }
    if (reg.active) {
      console.log('Service worker active');
      reg.active.onstatechange = (e) => { console.log(`Service worker state changed: ${e.target.state}`) };
    }
  }).catch(function (error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}

// function for loading each image via XHR

function imgLoad(imgJSON) {
  // return a promise for an image loading
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', imgJSON.url);
    request.responseType = 'blob';

    request.onload = function () {
      if (request.status == 200) {
        var arrayResponse = [];
        arrayResponse[0] = request.response;
        arrayResponse[1] = imgJSON;
        resolve(arrayResponse);
      } else {
        reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
      }
    };

    request.onerror = function () {
      reject(Error('There was a network error.'));
    };

    // Send the request
    request.send();
  });
}

function toggleRegistration() {
  navigator.serviceWorker.getRegistration().then((reg) => {
    if (reg == [] || reg == undefined) {
      navigator.serviceWorker.register('/sw-test/sw.js', { scope: '/sw-test/' }).then(function (reg) {

        if (reg.installing) {
          console.log('Service worker installing');
          reg.installing.onstatechange = (e) => { console.log(`Service worker state changed: ${e.target.state}`) };
        } else if (reg.waiting) {
          console.log('Service worker installed');
          reg.waiting.onstatechange = (e) => { console.log(`Service worker state changed: ${e.target.state}`) };
        } else if (reg.active) {
          console.log('Service worker active');
          reg.active.onstatechange = (e) => { console.log(`Service worker state changed: ${e.target.state}`) };
        }
        return
      }).catch(function (error) {
        // registration failed
        console.log('Registration failed with ' + error);
      }).then(() => {
        outputRegistrations();
      })
    } else {
      reg.unregister().then(() => outputRegistrations());
    }
  })
}

async function updateRegistration() {
  let registration = await navigator.serviceWorker.getRegistration();
  if (registration) {
    registration.update();
  } else {
    console.warn('No registration found');
  }
}

function outputRegistrations() {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    let text = "";
    if (!registrations || registrations.length == 0) { text = "No registrations found"; }
    else {
      for (let i = 0; i < registrations.length; i++) {
        text += `Scope ${registrations[i].scope} is registered`;
      }
    }
    document.getElementById('registrations').textContent = text;
  })
}

function fetchFiles() {
  fetch("sw-test/index.html");
  fetch("sw-test/style.css");
  fetch("sw-test/app.js");
}

var imgSection = document.querySelector('section');

window.onload = function () {
  var unregister = document.createElement('button');
  unregister.textContent = "Toggle Registration";
  unregister.addEventListener('click', toggleRegistration);

  var update = document.createElement('button');
  update.textContent = "Update Registration";
  update.addEventListener('click', updateRegistration);

  var registrations = document.createElement('p');
  registrations.id = "registrations";

  var fetch = document.createElement('button');
  fetch.textContent = "Fetch Files";
  fetch.addEventListener("click", fetchFiles);

  imgSection.appendChild(unregister);
  imgSection.appendChild(registrations);
  imgSection.appendChild(update);
  imgSection.appendChild(fetch);

  outputRegistrations();

  // load each set of image, alt text, name and caption
  for (var i = 0; i <= Gallery.images.length - 1; i++) {
    imgLoad(Gallery.images[i]).then(function (arrayResponse) {

      var myImage = document.createElement('img');
      var myFigure = document.createElement('figure');
      var myCaption = document.createElement('caption');
      var imageURL = window.URL.createObjectURL(arrayResponse[0]);

      myImage.src = imageURL;
      myImage.setAttribute('alt', arrayResponse[1].alt);
      myCaption.innerHTML = '<strong>' + arrayResponse[1].name + '</strong>: Taken by ' + arrayResponse[1].credit;

      imgSection.appendChild(myFigure);
      myFigure.appendChild(myImage);
      myFigure.appendChild(myCaption);

    }, function (Error) {
      console.log(Error);
    });
  }
};

