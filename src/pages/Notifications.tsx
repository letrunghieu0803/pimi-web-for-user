import React, { useEffect, useState, useCallback } from 'react';
import { Bell, CheckCheck, Calendar, FileText, Info, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { notificationApi, NotificationItem } from '@/services/notificationApi';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD'>('ALL');
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { pageSize: 50 };
      if (activeTab === 'UNREAD') {
        params.isRead = false;
      }
      const [resList, resCount] = await Promise.all([
        notificationApi.getNotifications(params),
        notificationApi.getUnreadCount()
      ]);

      const list = resList?.data || resList || [];
      setNotifications(Array.isArray(list) ? list : []);

      const count = resCount?.data?.count ?? resCount?.count ?? 0;
      setUnreadCount(count);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (item: NotificationItem) => {
    if (item.isRead) return;
    try {
      await notificationApi.markAsRead(item.id);
      setNotifications(prev =>
        prev.map(n => (n.id === item.id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await notificationApi.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'APPOINTMENT':
        return <Calendar className="w-5 h-5 text-indigo-600" />;
      case 'CONTRACT':
        return <FileText className="w-5 h-5 text-emerald-600" />;
      default:
        return <Info className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <Bell className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 font-heading">Thông báo của bạn</h1>
              <p className="text-sm font-medium text-slate-500">
                {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc` : 'Bạn đã đọc tất cả thông báo'}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs transition-colors self-start sm:self-auto"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Đánh dấu tất cả đã đọc</span>
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ALL'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab('UNREAD')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'UNREAD'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Chưa đọc</span>
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-slate-500">Đang tải thông báo...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Không có thông báo nào</h3>
            <p className="text-sm text-slate-500 mt-1">Danh sách thông báo của bạn sẽ xuất hiện ở đây.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => {
              const isUnread = !item.isRead;
              return (
                <div
                  key={item.id}
                  onClick={() => handleMarkAsRead(item)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 group ${
                    isUnread
                      ? 'bg-indigo-50/40 border-indigo-200/80 shadow-xs hover:border-indigo-300'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-3 rounded-2xl flex-shrink-0 ${isUnread ? 'bg-indigo-100/80' : 'bg-slate-100'}`}>
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        {isUnread && <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 flex-shrink-0"></span>}
                        <h4 className={`text-base font-bold truncate ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                          {item.title}
                        </h4>
                      </div>
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    title="Xóa thông báo"
                    className="p-2 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
