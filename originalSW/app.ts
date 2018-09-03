

const registerServiceWorker = () => {
    navigator.serviceWorker.register('serviceWorker.js');
}

if (navigator.serviceWorker) {
    registerServiceWorker();
}
