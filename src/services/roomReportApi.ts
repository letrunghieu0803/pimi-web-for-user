import { axiosClient } from './axiosClient';

// Khớp enum RoomReportReason bên backend (bff-for-pimi/prisma/schema.prisma).
export type RoomReportReason =
  | 'MISLEADING_INFO'
  | 'SCAM_FRAUD'
  | 'ROOM_NOT_AS_DESCRIBED'
  | 'CONTRACT_VIOLATION'
  | 'UNSAFE_CONDITION'
  | 'HARASSMENT'
  | 'OTHER';

// Tố cáo phòng — bắt buộc đăng nhập (AuthGuard, không giới hạn role — xem
// bff-for-pimi/src/modules/room-reports). Ảnh bằng chứng upload TRƯỚC qua /s3/upload/list (endpoint
// chung, KHÔNG dùng /images/list — endpoint đó chỉ mở cho HOUSE_OWNER/HOUSE_MANAGER/PIMI_ADMIN,
// RENT_USER gọi sẽ bị 403), lấy imageId rồi mới submit report tham chiếu tới.
export const roomReportApi = {
  uploadEvidenceImages: async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];
    const formData = new FormData();
    formData.append('fileType', 'ROOM_REPORT_EVIDENCE');
    files.forEach((file) => formData.append('files', file));
    const res: any = await axiosClient.post('/v1/s3/upload/list', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const uploaded = res?.data || res || [];
    return uploaded.map((img: any) => img.id).filter(Boolean);
  },

  // imageIds bắt buộc tối thiểu 1 ảnh (backend chặn ở CreateRoomReportDto) — UI (ReportRoomModal)
  // chặn trước khi gọi tới đây, kiểu ở đây khớp lại đúng ràng buộc đó thay vì để optional gây
  // hiểu lầm.
  create: async (data: {
    rentRoomId: string;
    reason: RoomReportReason;
    detail: string;
    imageIds: string[];
  }): Promise<any> => {
    const res: any = await axiosClient.post('/v1/room-reports', data);
    return res?.data || res;
  },
};
