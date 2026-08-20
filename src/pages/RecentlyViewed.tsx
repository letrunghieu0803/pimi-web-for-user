import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { History, Trash2 } from 'lucide-react';
import { RoomCard } from '@/components/common/RoomCard';
import { EmptyState } from '@/components/common/EmptyState';
import { recentlyViewedApi, RecentlyViewedEntry } from '@/utils/recentlyViewed';
import { Seo } from '@/components/common/Seo';

// Trang "Đã xem gần đây" — 100% đọc từ localStorage (utils/recentlyViewed.ts), không gọi API
// nào. Khác trang Phòng yêu thích: không cần đăng nhập, và có nút xoá lịch sử.
export const RecentlyViewed: React.FC = () => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<RecentlyViewedEntry[]>(() => recentlyViewedApi.getAll());

  const handleClear = () => {
    recentlyViewedApi.clear();
    setEntries([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Seo title={t('recentlyViewed.title')} description={t('recentlyViewed.subtitle')} path="/recently-viewed" />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading flex items-center gap-2.5">
            <History className="w-7 h-7 text-indigo-600" />
            {t('recentlyViewed.title')}
          </h1>
          <p className="text-sm text-slate-500">{t('recentlyViewed.subtitle')}</p>
        </div>

        {entries.length > 0 && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 font-bold text-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('recentlyViewed.clearButton')}</span>
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={History}
          tone="indigo"
          title={t('recentlyViewed.emptyTitle')}
          description={t('recentlyViewed.emptyDesc')}
          actionLabel={t('recentlyViewed.browseRooms')}
          actionTo="/rooms"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map(({ room }) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};
