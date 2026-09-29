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

// "chính mình" vs "xem hộ" — chỉ áp dụng lịch hẹn tự đặt (luồng mới), null/undefined trên lịch
// hẹn cũ (không có field này).
export type AppointmentViewerType = 'SELF' | 'PROXY';

export interface Appointment {
  id: string;
  // 'CONFIRMED' — MỚI, lịch hẹn khách tự đặt trực tiếp trên lịch trống, xác nhận ngay lúc tạo
  // (không qua bước chủ nhà đề xuất giờ). Các giá trị còn lại là legacy — chỉ còn phát sinh từ
  // lịch hẹn tạo trước khi đổi luồng.
  status: 'PENDING_OWNER' | 'OWNER_REJECTED' | 'OWNER_OFFERED_TIMES' | 'USER_ACCEPTED' | 'USER_REJECTED' | 'EXPIRED_CANCELLED' | 'COMPLETED' | 'CONFIRMED';
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
    // Prisma Decimal serialize qua JSON thành string (vd "5600000"), không phải number — xem
    // ViewingConfirmationPanel.tsx#formatPrice.
    price?: number | string;
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
  // AppointmentsService.sendGuide) — với lịch hẹn CONFIRMED (luồng mới), đã được điền sẵn NGAY
  // lúc tạo (nếu toà nhà có cấu hình mẫu mặc định) thay vì đợi gửi tay. Luôn sanitize bằng
  // DOMPurify trước khi render (HTML do chủ nhà soạn) — xem cách TenantAppointments.tsx đang làm.
  guideContent?: string | null;
  guideSentAt?: string | null;

  // ---- Luồng tự đặt lịch (mới) — chỉ có trên lịch hẹn status CONFIRMED, undefined trên lịch hẹn
  // tạo theo luồng cũ (những field này không tồn tại trên các dòng cũ). ----
  viewerType?: AppointmentViewerType;
  contactPhone?: string;
  contactEmail?: string;
  expectedOccupantsCount?: number;
  expectedOccupantName?: string;
  viewingDate?: string; // yyyy-mm-dd
  viewingStartTime?: string; // ISO datetime
  viewingEndTime?: string; // ISO datetime
  tenant?: {
    id: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
  };
  viewingContact?: {
    id: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
  };
}

export const appointmentApi = {
  createAppointment: (payload: {
    rentRoomId?: string;
    roomGroupId?: string;
    note?: string;
    // Bắt buộc khi đặt qua luồng mới (khách tự chọn slot trên lịch trống) — xem
    // ViewingSlotPicker.tsx/ViewingBookingForm.tsx. Vẫn optional ở type để không phá vỡ luồng cũ
    // (không còn dùng ở FE này nhưng type vẫn phản ánh đúng DTO backend đang chấp nhận cả 2 dạng).
    viewingDate?: string; // yyyy-mm-dd
    startMinute?: number; // bội số 30
    slotCount?: 1 | 2;
    viewerType?: AppointmentViewerType;
    contactPhone?: string;
    contactEmail?: string;
    expectedOccupantsCount?: number;
    expectedOccupantName?: string;
  }) => {
    return axiosClient.post('/v1/appointments', payload);
  },

  getTenantAppointments: (params?: { status?: string; pageNumber?: number; pageSize?: number }) => {
    return axiosClient.get('/v1/appointments/tenant', { params });
  },

  // Lấy đúng 1 lịch hẹn theo id — dùng khi mở từ thông báo (biết id nhưng không biết status,
  // nên không biết tab lọc/trạng thái nào chứa nó) để tự chọn đúng tab trước khi cuộn tới.
  getAppointmentDetail: (id: string) => {
    return axiosClient.get(`/v1/appointments/${id}`);
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
