import { axiosClient } from './axiosClient';

export interface RoomReviewAuthor {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface RoomReview {
  id: string;
  rentRoomId: string;
  authorId: string;
  score: number | null; // null nếu admin đã ẩn điểm
  comment: string | null; // null nếu admin đã ẩn bình luận
  isHiddenScore: boolean;
  isHiddenComment: boolean;
  createdAt: string;
  updatedAt: string;
  author: RoomReviewAuthor;
}

export interface RoomReviewSummary {
  avgScore: number | null;
  scoredReviewCount: number;
  totalReviews: number;
}

export interface RoomReviewsResult {
  reviews: RoomReview[];
  summary: RoomReviewSummary;
  totalPages: number;
}

// Đánh giá sau khi ở — công khai (ai xem cũng được, kể cả khách chưa đăng nhập), chỉ RENT_USER
// từng thuê phòng (có hợp đồng hoặc đã nhận phòng qua đặt ngắn hạn) mới được viết.
export const reviewApi = {
  getRoomReviews: async (
    roomId: string,
    params?: { pageNumber?: number; pageSize?: number }
  ): Promise<RoomReviewsResult> => {
    const res: any = await axiosClient.get(`/v1/reviews/room/${roomId}`, {
      params: { pageNumber: params?.pageNumber ?? 1, pageSize: params?.pageSize ?? 10 },
    });
    return {
      reviews: res?.data || [],
      summary: res?.summary || { avgScore: null, scoredReviewCount: 0, totalReviews: 0 },
      totalPages: res?.metadata?.totalPages ?? 0,
    };
  },

  // {canReview, myReview} — dùng để quyết định hiện nút "Viết đánh giá" / "Sửa đánh giá" / ẩn hẳn.
  getEligibility: async (
    roomId: string
  ): Promise<{ canReview: boolean; myReview: RoomReview | null }> => {
    const res: any = await axiosClient.get(`/v1/reviews/room/${roomId}/eligibility`);
    return res?.data || { canReview: false, myReview: null };
  },

  upsertMyReview: async (
    roomId: string,
    data: { score: number; comment?: string }
  ): Promise<RoomReview> => {
    const res: any = await axiosClient.put(`/v1/reviews/room/${roomId}`, data);
    return res?.data || res;
  },

  deleteMyReview: async (roomId: string): Promise<void> => {
    await axiosClient.delete(`/v1/reviews/room/${roomId}/mine`);
  },
};
