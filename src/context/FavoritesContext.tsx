import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
  useCallback,
} from 'react';
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

  // Mọi component gọi useFavorites() đều re-render khi `value` (object truyền vào Provider) đổi
  // reference — trước đây `value` là object literal tạo mới MỖI LẦN render, kể cả khi
  // FavoritesProvider re-render vì lý do không liên quan gì đến favorite (vd `loading` đổi lúc
  // mount). Giữ 1 ref đồng bộ với `favoriteIds` để `isFavorited`/`toggleFavorite` không cần liệt
  // kê `favoriteIds` trong dependency — 2 hàm này nhờ vậy giữ NGUYÊN reference qua mọi lần render
  // (trừ lần đầu), thay vì bị tạo lại mỗi khi có 1 toggle bất kỳ (dù ở phòng nào) chạy qua.
  const favoriteIdsRef = useRef(favoriteIds);
  favoriteIdsRef.current = favoriteIds;

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

  const isFavorited = useCallback(
    (roomId: string) => favoriteIdsRef.current.has(roomId),
    []
  );

  const toggleFavorite = useCallback(async (roomId: string): Promise<boolean> => {
    const wasFavorited = favoriteIdsRef.current.has(roomId);

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
  }, []);

  // `favoriteIds` (state thật) vẫn buộc phải đổi reference mỗi lần toggle — các consumer đọc trực
  // tiếp field này (vd FavoriteRooms.tsx) BẮT BUỘC phải re-render để thấy đúng dữ liệu mới. Nhưng
  // `isFavorited`/`toggleFavorite` giờ ổn định (xem trên), nên `useMemo` ở đây ít nhất chặn được
  // các lần Provider re-render KHÔNG do favoriteIds đổi (vd component cha re-render vì lý do khác)
  // tạo `value` mới một cách không cần thiết.
  const value = useMemo(
    () => ({ favoriteIds, isFavorited, toggleFavorite, loading }),
    [favoriteIds, isFavorited, toggleFavorite, loading]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};
