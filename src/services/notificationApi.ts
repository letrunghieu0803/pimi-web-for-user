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

// Suy ra đường dẫn trang chi tiết tương ứng từ type + metadata của thông báo (xem các lệnh gọi
// notificationService.createNotification ở backend — mỗi type luôn kèm đúng 1 id trong metadata,
// vd APPOINTMENT -> { appointmentId }, NEWS -> { articleId }). Trả về null cho các type chưa có
// trang chi tiết riêng trên web này (INVOICE, ROOM_REPORT_*...) — dùng chung cho cả trang danh
// sách thông báo (Notifications.tsx) lẫn dropdown chuông thông báo (Navbar.tsx), tránh 2 nơi suy
// luận lệch nhau.
export const getNotificationLink = (item: NotificationItem): string | null => {
  const meta = item.metadata || {};
  switch (item.type) {
    case 'APPOINTMENT':
      return meta.appointmentId ? `/appointments?highlight=${meta.appointmentId}` : null;
    case 'NEWS':
      return meta.articleId ? `/news/${meta.articleId}` : null;
    case 'BOOKING':
      return '/bookings';
    default:
      return null;
  }
};

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

  markAsUnread: (id: string): Promise<any> => {
    return axiosClient.patch(`/v1/notifications/${id}/unread`);
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
