import { axiosClient } from './axiosClient';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: string;
  isRead: boolean;
  metadata?: any;
  createdAt: string;
}

export interface NotificationResponse {
  data: NotificationItem[];
  metadata: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

export const notificationApi = {
  getNotifications: (params?: { pageNumber?: number; pageSize?: number; isRead?: boolean }): Promise<any> => {
    return axiosClient.get('/v1/notifications', { params });
  },

  getUnreadCount: (): Promise<any> => {
    return axiosClient.get('/v1/notifications/unread-count');
  },

  markAsRead: (id: string): Promise<any> => {
    return axiosClient.patch(`/v1/notifications/${id}/read`);
  },

  markAllAsRead: (): Promise<any> => {
    return axiosClient.patch('/v1/notifications/read-all');
  },

  deleteNotification: (id: string): Promise<any> => {
    return axiosClient.delete(`/v1/notifications/${id}`);
  },

  registerDeviceToken: (token: string, platform: 'WEB' | 'ANDROID' | 'IOS' = 'WEB'): Promise<any> => {
    return axiosClient.post('/v1/notifications/device-tokens', { token, platform });
  },

  unregisterDeviceToken: (token: string): Promise<any> => {
    return axiosClient.delete(`/v1/notifications/device-tokens/${token}`);
  },
};
