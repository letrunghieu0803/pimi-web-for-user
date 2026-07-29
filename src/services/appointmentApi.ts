import { axiosClient } from './axiosClient';

export interface TimeSlot {
  id?: string;
  startTime: string;
  endTime: string;
  isSelected?: boolean;
}

export interface Appointment {
  id: string;
  status: 'PENDING_OWNER' | 'OWNER_REJECTED' | 'OWNER_OFFERED_TIMES' | 'USER_ACCEPTED' | 'USER_REJECTED' | 'EXPIRED_CANCELLED' | 'COMPLETED';
  note?: string;
  rejectReason?: string;
  tenantId: string;
  rentHouseId: string;
  rentRoomId: string;
  selectedTimeSlotId?: string;
  ownerAttendanceConfirmed?: boolean;
  userAttendanceConfirmed?: boolean;
  lastActionAt: string;
  createdAt: string;
  updatedAt: string;
  rentRoom?: {
    id: string;
    name: string;
    images?: Array<{ image?: { link?: string } }>;
  };
  rentHouse?: {
    id: string;
    name: string;
    address?: string;
    houseOwner?: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      email?: string;
    };
  };
  timeSlots?: TimeSlot[];
}

export const appointmentApi = {
  createAppointment: (payload: { rentRoomId: string; note?: string }) => {
    return axiosClient.post('/v1/appointments', payload);
  },

  getTenantAppointments: (params?: { status?: string; pageNumber?: number; pageSize?: number }) => {
    return axiosClient.get('/v1/appointments/tenant', { params });
  },

  userConfirm: (id: string, payload: { action: 'ACCEPT' | 'REJECT'; selectedTimeSlotId?: string; rejectReason?: string }) => {
    return axiosClient.put(`/v1/appointments/${id}/user-confirm`, payload);
  },

  confirmAttendance: (id: string, attended: boolean) => {
    return axiosClient.put(`/v1/appointments/${id}/attendance`, { attended });
  },
};
