import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from 'firebase/analytics';
import { getMessaging, isSupported as isMessagingSupported, Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

const app: FirebaseApp | null = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

let analyticsPromise: Promise<Analytics | null> | null = null;

export const getAnalyticsInstance = (): Promise<Analytics | null> => {
  if (!app) return Promise.resolve(null);
  if (!analyticsPromise) {
    analyticsPromise = isAnalyticsSupported().then((supported) =>
      supported ? getAnalytics(app) : null,
    );
  }
  return analyticsPromise;
};

let messagingPromise: Promise<Messaging | null> | null = null;

export const getMessagingInstance = (): Promise<Messaging | null> => {
  if (!app) return Promise.resolve(null);
  if (!messagingPromise) {
    messagingPromise = isMessagingSupported().then((supported) =>
      supported ? getMessaging(app) : null,
    );
  }
  return messagingPromise;
};
