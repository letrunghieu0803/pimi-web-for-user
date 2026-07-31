import { logEvent as firebaseLogEvent } from 'firebase/analytics';
import { getAnalyticsInstance } from '@/config/firebase';

export const trackEvent = async (name: string, params?: Record<string, unknown>) => {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;
  firebaseLogEvent(analytics, name, params);
};

export const trackPageView = (pagePath: string) => {
  void trackEvent('page_view', { page_path: pagePath });
};
