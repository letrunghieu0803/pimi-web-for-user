import { Room } from '@/types';

// Phòng đã xem gần đây — hoàn toàn phía trình duyệt (localStorage), KHÔNG gọi API nào để đọc/ghi.
// Lưu theo THIẾT BỊ (không theo tài khoản) — dùng chung 1 danh sách bất kể đang đăng nhập ai hay
// đang là khách, giống cách các sàn TMĐT vẫn làm với "đã xem gần đây" (chỉ là vết xem, không phải
// dữ liệu có tính sở hữu như "yêu thích" nên không cần tách theo userId).
const STORAGE_KEY = 'pimi_recently_viewed';
const MAX_ITEMS = 24;

export interface RecentlyViewedEntry {
  room: Room;
  viewedAt: string;
}

// Cắt gọn Room trước khi lưu — RoomCard chỉ thực sự cần 1 ảnh đầu tiên (không phải cả mảng), và
// description/services không hiển thị ở dạng thẻ — bỏ đi để danh sách 24 phòng không phình to
// localStorage vô ích. Vẫn giữ đủ field để thoả kiểu Room (description để chuỗi rỗng vì là field
// bắt buộc, không dùng tới khi vẽ RoomCard).
const toSnapshot = (room: Room): Room => ({
  ...room,
  images: room.images.slice(0, 1),
  description: '',
  services: undefined,
});

const readAll = (): RecentlyViewedEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

const writeAll = (entries: RecentlyViewedEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    // Bỏ qua lỗi ghi (vd. Safari chế độ riêng tư chặn localStorage, hoặc hết quota) — tính năng
    // chỉ là tiện ích phụ, không được phép làm gãy luồng xem phòng chính.
  }
};

export const recentlyViewedApi = {
  // Gọi sau khi trang chi tiết đã fetch dữ liệu phòng thành công — không gọi lúc đang loading/lỗi.
  add: (room: Room): void => {
    if (!room?.id) return;
    const entries = readAll().filter((e) => e.room.id !== room.id);
    entries.unshift({ room: toSnapshot(room), viewedAt: new Date().toISOString() });
    writeAll(entries.slice(0, MAX_ITEMS));
  },

  getAll: (): RecentlyViewedEntry[] => readAll(),

  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  },
};
