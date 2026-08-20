import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Room } from '@/types';
import { favoriteApi } from '@/services/favoriteApi';
import { RoomCard } from '@/components/common/RoomCard';
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
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-200/80">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-rose-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{t('favoriteRooms.emptyTitle')}</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">{t('favoriteRooms.emptyDesc')}</p>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl gradient-bg text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:scale-105 transition-transform"
          >
            {t('favoriteRooms.browseRooms')}
          </Link>
        </div>
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
