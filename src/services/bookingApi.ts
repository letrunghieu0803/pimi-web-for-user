import { axiosClient } from './axiosClient';

export interface Booking {
  id: string;
  status: 'PENDING_PAYMENT' | 'EXPIRED' | 'PAID' | 'CHECKED_IN' | 'PAYOUT_COMPLETED' | 'CANCELLED';
  roomName: string;
  amount: string | number;
  commissionPercent: string | number;
  commissionAmount: string | number;
  payoutAmount: string | number;
  qrPaymentCode: string;
  qrRawContent?: string;
  qrImageBase64?: string;
  expiresAt: string;
  paidAt?: string | null;
  checkedInAt?: string | null;
  payoutCompletedAt?: string | null;
  checkInDate?: string | null;
  checkOutDate?: string | null;
  rentRoomId: string;
  rentHouseId: string;
  refund?: BookingRefund | null;
  [key: string]: unknown;
}

// Khoảng ngày phòng đang bận — từ Booking ngắn hạn còn sống hoặc Contract dài hạn đang hiệu lực
// (xem RentRoomsService.getRoomAvailability phía backend). Dùng để tô xám ngày trong lịch chọn.
export type RefundStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

// Yêu cầu huỷ + hoàn tiền của đơn đã thanh toán. Mức hoàn trong `suggested*` chỉ là GỢI Ý theo chính sách —
// mức chính thức (`approved*`) do Pimi quyết định.
export interface BookingRefund {
  id?: string;
  status: RefundStatus;
  suggestedPolicy?: string;
  suggestedPercent?: number;
  suggestedAmount?: string | number;
  approvedPercent?: number | null;
  approvedAmount?: string | number | null;
  adminNote?: string | null;
  refundReference?: string | null;
  refundBankName?: string;
  refundAccountNumber?: string;
}

export interface CancelPreview {
  bookingId: string;
  status: Booking['status'];
  amount: number;
  checkInDate?: string | null;
  // IMMEDIATE: chưa thanh toán → huỷ ngay. REQUEST: đã thanh toán → gửi yêu cầu cho Pimi. null: không huỷ được.
  mode: 'IMMEDIATE' | 'REQUEST' | null;
  suggestion: { policy: string; percent: number; amount: number } | null;
  rules: Array<{ key: string; percent: number }>;
}

export interface CancelBookingPayload {
  reason?: string;
  refundBankName?: string;
  refundAccountNumber?: string;
  refundAccountHolder?: string;
}

export interface BusyRange {
  start: string;
  end: string;
  source: 'booking' | 'contract';
}

export interface BookingQuote {
  amount: number;
  nights: number | null;
  hours: number | null;
  discountPercent: number;
  appliedTier: { minNights: number; discountPercent: number } | null;
}

export const bookingApi = {
  createBooking: (rentRoomId: string, checkInDate: string, checkOutDate: string) => {
    return axiosClient.post('/v1/bookings', { rentRoomId, checkInDate, checkOutDate });
  },

  getQuote: (rentRoomId: string, checkInDate: string, checkOutDate: string) => {
    return axiosClient.post('/v1/bookings/quote', { rentRoomId, checkInDate, checkOutDate });
  },

  getAvailability: (roomId: string) => {
    return axiosClient.get(`/v1/rent-rooms/public/${roomId}/availability`);
  },

  getOne: (id: string) => {
    return axiosClient.get(`/v1/bookings/${id}`);
  },

  getCancelPreview: (id: string) => {
    return axiosClient.get(`/v1/bookings/${id}/cancel-preview`);
  },

  cancel: (id: string, payload: CancelBookingPayload) => {
    return axiosClient.post(`/v1/bookings/${id}/cancel`, payload);
  },

  getTenantBookings: (params?: { status?: string; pageNumber?: number; pageSize?: number }) => {
    return axiosClient.get('/v1/bookings/tenant', { params });
  },
};
