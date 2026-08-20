import { Room } from '@/types';
import { axiosClient } from './axiosClient';
import { mapBackendRoomToRoom } from './roomApi';

// Phòng yêu thích — 3 endpoint RENT_USER-only ở backend (rent-rooms.controller.ts):
//   GET  /v1/rent-rooms/favorites/ids   -> id rút gọn, dùng hydrate trạng thái tim trên mọi thẻ
//                                          phòng đang hiển thị (feed/kết quả tìm kiếm) mà không
//                                          cần gọi API riêng cho từng thẻ.
//   GET  /v1/rent-rooms/favorites/mine  -> danh sách đầy đủ (dùng cho trang "Phòng yêu thích").
//   POST/DELETE /v1/rent-rooms/:roomId/favorite -> thêm/bỏ 1 phòng.
export const favoriteApi = {
  getFavoriteIds: async (): Promise<string[]> => {
    const res: any = await axiosClient.get('/v1/rent-rooms/favorites/ids');
    const ids = res?.data ?? res;
    return Array.isArray(ids) ? ids : [];
  },

  getMyFavorites: async (params?: { pageNumber?: number; pageSize?: number }): Promise<{
    rooms: Room[];
    totalItems: number;
    totalPages: number;
  }> => {
    const res: any = await axiosClient.get('/v1/rent-rooms/favorites/mine', {
      params: { pageNumber: params?.pageNumber ?? 1, pageSize: params?.pageSize ?? 50 },
    });
    const items = res?.data || [];
    const metadata = res?.metadata || {};
    return {
      rooms: Array.isArray(items) ? items.map(mapBackendRoomToRoom) : [],
      totalItems: metadata.totalItems ?? 0,
      totalPages: metadata.totalPages ?? 0,
    };
  },

  addFavorite: async (roomId: string): Promise<void> => {
    await axiosClient.post(`/v1/rent-rooms/${roomId}/favorite`);
  },

  removeFavorite: async (roomId: string): Promise<void> => {
    await axiosClient.delete(`/v1/rent-rooms/${roomId}/favorite`);
  },
};
