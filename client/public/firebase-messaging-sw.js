// firebase-messaging-sw.js
// Firebase config is injected via URL query parameters during SW registration
// (see src/config/registerSW.js). This avoids hardcoding sensitive values in
// the public folder, since Service Workers cannot access import.meta.env.

importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

// Read config values from the Service Worker's own URL query string
const swUrl = new URL(location.href);

const firebaseConfig = {
  apiKey: swUrl.searchParams.get('apiKey'),
  authDomain: swUrl.searchParams.get('authDomain'),
  projectId: swUrl.searchParams.get('projectId'),
  storageBucket: swUrl.searchParams.get('storageBucket'),
  messagingSenderId: swUrl.searchParams.get('messagingSenderId'),
  appId: swUrl.searchParams.get('appId'),
};

// Validate config before initializing
const missingParams = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missingParams.length > 0) {
  console.error(
    '[firebase-messaging-sw.js] Missing config params: ' + missingParams.join(', ') +
    '. Ensure all VITE_FIREBASE_* env vars are set in client/.env'
  );
} else {
  try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Received background message:', payload);

      const notificationTitle = payload.notification?.title || 'New Notification';
      const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/vite.svg',
        data: payload.data,
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  } catch (e) {
    console.error('[firebase-messaging-sw.js] Failed to initialize Firebase:', e);
  }
}

// Handle notification click
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
