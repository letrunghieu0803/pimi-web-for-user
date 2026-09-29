import { axiosClient } from './axiosClient';

// Lịch xem nhà (đọc công khai, không cần đăng nhập) — 1 khối 30 phút cho 1 ngày cụ thể. Slot
// hoàn toàn KHÔNG xuất hiện trong mảng = không được toà nhà mở (ngoài mẫu tuần), không phải
// "chưa tải xong". `isOpen: false` = có mở theo mẫu tuần nhưng chủ nhà đã khoá riêng slot đó
// (nghỉ lễ...). Chỉ `isOpen: true` mới đặt được — xem
// AppointmentAvailabilityService (bff-for-pimi) tính lưới này on-the-fly từ rule + override, không
// vật chất hoá theo ngày. Không có `bookedCount`/thông tin khách khác ở biến thể public này (khách
// không cần biết ai đã đặt trùng slot).
export interface AppointmentAvailabilitySlot {
  date: string; // yyyy-mm-dd
  startMinute: number; // bội số của 30, tính từ 00:00
  endMinute: number;
  isOpen: boolean;
}

export const appointmentAvailabilityApi = {
  // `to - from` bị chặn tối đa 62 ngày ở backend (400 nếu vượt) — người gọi tự chia nhỏ khoảng
  // nếu cần xem xa hơn.
  getPublicGrid: (rentHouseId: string, from: string, to: string) => {
    return axiosClient.get(`/v1/appointment-availability/public/${rentHouseId}/grid`, {
      params: { from, to },
    });
  },
};

