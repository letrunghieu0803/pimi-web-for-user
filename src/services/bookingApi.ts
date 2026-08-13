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
  rentRoomId: string;
  rentHouseId: string;
  [key: string]: unknown;
}

export const bookingApi = {
  createBooking: (rentRoomId: string) => {
    return axiosClient.post('/v1/bookings', { rentRoomId });
  },

  getOne: (id: string) => {
    return axiosClient.get(`/v1/bookings/${id}`);
  },

  getTenantBookings: (params?: { status?: string; pageNumber?: number; pageSize?: number }) => {
    return axiosClient.get('/v1/bookings/tenant', { params });
  },
};
