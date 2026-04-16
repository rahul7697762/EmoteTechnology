importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

const params = new URL(location).searchParams;

const firebaseConfig = {
  apiKey: "AIzaSyA7ClDGE9VHta2_rUSOhpXX9SdDpeajMMY",
  authDomain: "edutech-9df89.firebaseapp.com",
  projectId: "edutech-9df89",
  storageBucket: "edutech-9df89.firebasestorage.app",
  messagingSenderId: "563925551683",
  appId: "1:563925551683:web:5b651bfb99542b38a122f6"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      // You can add an icon here
      // icon: '/logo.png',
      data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (e) {
  console.log('Failed to initialize Firebase SW', e);
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
