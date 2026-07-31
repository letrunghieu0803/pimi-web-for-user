import { useState } from 'react';
import { getToken } from 'firebase/messaging';
import { getMessagingInstance, isFirebaseConfigured, VAPID_KEY } from '@/config/firebase';
import { notificationApi } from '@/services/notificationApi';

export type NotificationPermissionState = 'idle' | 'requesting' | 'granted' | 'denied' | 'error';

export const useNotificationPermission = () => {
  const [state, setState] = useState<NotificationPermissionState>('idle');

  const enableNotifications = async () => {
    if (!isFirebaseConfigured) {
      setState('error');
      return;
    }

    setState('requesting');
    try {
      const messaging = await getMessagingInstance();
      if (!messaging) {
        setState('error');
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setState('denied');
        return;
      }

      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        await notificationApi.registerDeviceToken(token, 'WEB');
        setState('granted');
      } else {
        setState('error');
      }
    } catch (err) {
      console.error('Failed to enable push notifications:', err);
      setState('error');
    }
  };

  return { state, enableNotifications, isSupported: isFirebaseConfigured };
};
