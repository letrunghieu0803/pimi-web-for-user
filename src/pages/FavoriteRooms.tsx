import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Room } from '@/types';
import { favoriteApi } from '@/services/favoriteApi';
import { RoomCard } from '@/components/common/RoomCard';
import { EmptyState } from '@/components/common/EmptyState';
import { CardGridSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { Seo } from '@/components/common/Seo';

export const FavoriteRooms: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  // favoriteIds ở context được dùng để tự động rút thẻ phòng khỏi lưới ngay khi bấm bỏ tim,
  // không cần đợi gọi lại API — trải nghiệm khớp với các thẻ hiển thị nơi khác trong app.
  const { favoriteIds } = useFavorites();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/favorites');
      return;
    }

    let cancelled = false;
    setLoading(true);
    favoriteApi
      .getMyFavorites({ pageSize: 100 })
      .then((res) => {
        if (!cancelled) setRooms(res.rooms);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const visibleRooms = rooms.filter((r) => favoriteIds.has(r.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Seo title={t('favoriteRooms.title')} description={t('favoriteRooms.subtitle')} path="/favorites" />

      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading flex items-center gap-2.5">
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
          {t('favoriteRooms.title')}
        </h1>
        <p className="text-sm text-slate-500">{t('favoriteRooms.subtitle')}</p>
      </div>

      {loading ? (
        <CardGridSkeleton count={6} />
      ) : visibleRooms.length === 0 ? (
        <EmptyState
          icon={Heart}
          tone="rose"
          title={t('favoriteRooms.emptyTitle')}
          description={t('favoriteRooms.emptyDesc')}
          actionLabel={t('favoriteRooms.browseRooms')}
          actionTo="/rooms"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};
