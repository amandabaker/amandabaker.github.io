// register service worker

export var activateCount;

activateCount = 0;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('oncontrollerchange', () => {
    console.log('On Controller Change');
  })
  navigator.serviceWorker.register('/sw-test/sw.js', { scope: '/sw-test/' }).then(function (reg) {

    if (reg.installing) {
      console.log('Service worker installing');
    } else if (reg.waiting) {
      console.log('Service worker installed');
    } else if (reg.active) {
      console.log('Service worker active');
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
        } else if (reg.waiting) {
          console.log('Service worker installed');
        } else if (reg.active) {
          console.log('Service worker active');
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

function outputRegistrations() {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    let text = "";
    if (!registrations || registrations.length == 0) { text = "No registrations found"; }
    else {
      for (let i = 0; i < registrations.length; i++) {
        text += `Scope ${registrations[0].scope} is registered`;
      }
    }
    document.getElementById('registrations').textContent = text;
  })
}

var imgSection = document.querySelector('section');

window.onload = function () {
  var unregister = document.createElement('button');
  unregister.textContent = "Toggle Registration";
  unregister.addEventListener('click', toggleRegistration);

  var registrations = document.createElement('p');
  registrations.id = "registrations";

  var activateEventCounter = document.createElement('p');
  activateEventCounter.id = "activateEventCounter";
  activateEventCounter.textContent = `Number of time activate has been triggered: ${activateCount}`;

  imgSection.appendChild(unregister);
  imgSection.appendChild(registrations);
  imgSection.appendChild(activateEventCounter);


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
