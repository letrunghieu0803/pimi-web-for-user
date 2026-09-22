import { axiosClient } from './axiosClient';

export interface Booking {
  id: string;
  status: 'PENDING_PAYMENT' | 'EXPIRED' | 'PAID' | 'CHECKED_IN' | 'PAYOUT_COMPLETED';
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
  [key: string]: unknown;
}

// Khoảng ngày phòng đang bận — từ Booking ngắn hạn còn sống hoặc Contract dài hạn đang hiệu lực
// (xem RentRoomsService.getRoomAvailability phía backend). Dùng để tô xám ngày trong lịch chọn.
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

  getTenantBookings: (params?: { status?: string; pageNumber?: number; pageSize?: number }) => {
    return axiosClient.get('/v1/bookings/tenant', { params });
  },
};
