
// register service worker

const registerServiceWorker = async () => {
    try {
        const registration = await navigator.serviceWorker.register('/PWA-test/sw.js', { scope: '/PWA-test/' });

        if (registration.installing) {
            console.log('Service worker installing');
        } else if (registration.waiting) {
            console.log('Service worker installed');
        } else if (registration.active) {
            console.log('Service worker active');
        }
    } catch (error) {
        console.log(`Service worker registration failed: ${error}`)
    }
}

if ('serviceWorker' in navigator) {
    registerServiceWorker();
}

const toggleRegistration = async () => {
    let registration = await navigator.serviceWorker.getRegistration("/PWA-test/");
    if (registration) {
        await registration.unregister();
    } else {
        registration = await navigator.serviceWorker.register("/PWA-test/sw.js", { scope: "/PWA-test/" });
        
        if (registration.installing) {
            console.log('Service worker installing');
        } else if (registration.waiting) {
            console.log('Service worker installed');
        } else if (registration.active) {
            console.log('Service worker active');
        }
    }

    outputRegistrations();
}

const outputRegistrations = async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();

    let text = "";

    if (!registrations || registrations.length == 0) { 
        text = "No registrations found"; 
    } else {
        for (const registration of registreations) {
            text += `Scope ${registration.scope} is registered`;
        }
    }

    document.getElementById('registrations').textContent = text;
}

const section = document.getElementsByTagName("section")[0];

window.onload = function () {
    var unregister = document.createElement('button');
    unregister.textContent = "Toggle Registration";
    unregister.addEventListener('click', toggleRegistration);
  
    var registrations = document.createElement('p');
    registrations.id = "registrations";
  
    section.appendChild(unregister);
    section.appendChild(registrations);
  
    outputRegistrations();
};

