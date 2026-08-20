import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { favoriteApi } from '@/services/favoriteApi';
import { useAuth } from '@/context/AuthContext';

interface FavoritesContextType {
  favoriteIds: Set<string>;
  isFavorited: (roomId: string) => boolean;
  // true = đã thêm thành công / đang chờ; false = bỏ yêu thích / lỗi (đã revert lạc quan).
  toggleFavorite: (roomId: string) => Promise<boolean>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      // Đăng xuất — không còn biết phòng nào là của ai, dọn sạch state cục bộ.
      setFavoriteIds(new Set());
      return;
    }
    let cancelled = false;
    setLoading(true);
    favoriteApi
      .getFavoriteIds()
      .then((ids) => {
        if (!cancelled) setFavoriteIds(new Set(ids));
      })
      .catch(() => {
        // Không chặn UI nếu lỗi — chỉ đơn giản là chưa biết trạng thái tim, không phải lỗi
        // nghiêm trọng cần báo người dùng.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const isFavorited = useCallback((roomId: string) => favoriteIds.has(roomId), [favoriteIds]);

  const toggleFavorite = useCallback(
    async (roomId: string): Promise<boolean> => {
      const wasFavorited = favoriteIds.has(roomId);

      // Cập nhật lạc quan ngay trên UI, gọi API nền, revert nếu lỗi.
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorited) {
          next.delete(roomId);
        } else {
          next.add(roomId);
        }
        return next;
      });

      try {
        if (wasFavorited) {
          await favoriteApi.removeFavorite(roomId);
        } else {
          await favoriteApi.addFavorite(roomId);
        }
        return !wasFavorited;
      } catch (err) {
        // Revert lại trạng thái cũ khi API lỗi.
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (wasFavorited) {
            next.add(roomId);
          } else {
            next.delete(roomId);
          }
          return next;
        });
        throw err;
      }
    },
    [favoriteIds]
  );

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorited, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
