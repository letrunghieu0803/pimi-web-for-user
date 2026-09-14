import { axiosClient } from './axiosClient';

export interface TimeSlot {
  id?: string;
  startTime: string;
  // Không còn bắt buộc — chủ nhà chỉ chọn giờ bắt đầu, buổi xem phòng báo trước sẽ mất khoảng
  // 15-30 phút thay vì 1 khung giờ chính xác. Khung giờ cũ (tạo trước đợt đổi) vẫn có thể có
  // giá trị, khung giờ mới luôn null.
  endTime?: string | null;
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
    roomGroupId?: string | null;
    images?: Array<{ image?: { link?: string } }>;
  };
  // Không có houseOwner — GET /v1/appointments/tenant (getTenantAppointments) không trả thông
  // tin liên hệ chủ nhà cho người thuê (xem appointments.service.ts ở backend). Người thuê liên
  // hệ qua cộng tác viên (nút "Liên hệ cộng tác viên"), không liên hệ trực tiếp chủ nhà.
  rentHouse?: {
    id: string;
    name: string;
    address?: string;
  };
  timeSlots?: TimeSlot[];
  // Snapshot nội dung "hướng dẫn xem nhà" chủ nhà/cộng tác viên đã gửi (HTML, xem
  // AppointmentsService.sendGuide) — chỉ có sau khi status đã USER_ACCEPTED và đã được gửi.
  guideContent?: string | null;
  guideSentAt?: string | null;
}

export const appointmentApi = {
  createAppointment: (payload: { rentRoomId?: string; roomGroupId?: string; note?: string }) => {
    return axiosClient.post('/v1/appointments', payload);
  },

  getTenantAppointments: (params?: { status?: string; pageNumber?: number; pageSize?: number }) => {
    return axiosClient.get('/v1/appointments/tenant', { params });
  },

  userConfirm: (id: string, payload: { action: 'ACCEPT' | 'REJECT'; selectedTimeSlotId?: string; rejectReason?: string }) => {
    return axiosClient.put(`/v1/appointments/${id}/user-confirm`, payload);
  },

  // surveyAnswers chỉ được BE xử lý khi attended=true (xem AppointmentsService.confirmAttendance)
  // — bắt buộc kèm đủ câu trả lời cho các câu hỏi isRequired đang hoạt động.
  confirmAttendance: (
    id: string,
    attended: boolean,
    surveyAnswers?: Array<{ questionId: string; value: string | string[] }>,
  ) => {
    return axiosClient.put(`/v1/appointments/${id}/attendance`, { attended, surveyAnswers });
  },
};
