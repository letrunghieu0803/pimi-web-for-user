// "Đăng X trước" trên thẻ phòng thuê dài hạn: cho người xem biết phòng mới đăng được bao lâu.
// Đơn vị phút -> giờ -> ngày; tối đa hiển thị "7 ngày trước" (phòng đăng lâu hơn vẫn giữ nhãn 7 ngày).

export type PostedAgo =
  | { unit: 'justNow' }
  | { unit: 'minute' | 'hour' | 'day'; count: number };

/** Số ngày tối đa hiển thị; quá mốc này vẫn hiện đúng mốc ("đăng 7 ngày trước"). */
export const POSTED_AGO_MAX_DAYS = 7;

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** createdAt (ISO/Date) -> khoảng cách tới `now`; null nếu thiếu/sai ngày. */
export const getPostedAgo = (createdAt: string | Date | null | undefined, now: number = Date.now()): PostedAgo | null => {
  if (!createdAt) return null;
  const created = new Date(createdAt).getTime();
  if (!Number.isFinite(created)) return null;
  // Lệch đồng hồ máy (thời điểm tạo nằm sau "bây giờ" vài giây) thì coi như vừa đăng, không âm.
  const diff = Math.max(now - created, 0);
  if (diff < MINUTE) return { unit: 'justNow' };
  if (diff < HOUR) return { unit: 'minute', count: Math.floor(diff / MINUTE) };
  if (diff < DAY) return { unit: 'hour', count: Math.floor(diff / HOUR) };
  const days = Math.floor(diff / DAY);
  return { unit: 'day', count: Math.min(days, POSTED_AGO_MAX_DAYS) };
};
