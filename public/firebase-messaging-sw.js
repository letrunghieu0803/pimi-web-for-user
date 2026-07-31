// Firebase Cloud Messaging background service worker.
// Fill in the values below with the Web SDK config from Firebase Console
// (Project Settings > General > Your apps > Web app). This file is static
// (not processed by Vite), so the config must be hardcoded here directly —
// it is safe to expose publicly, it is not a secret.
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'Pimi', {
    body: body || '',
    icon: '/favicon.svg',
    data: payload.data,
  });
});
