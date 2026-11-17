// "Đăng X trước" trên thẻ phòng thuê dài hạn: cho người xem biết phòng mới đăng được bao lâu.
// Đơn vị phút -> giờ -> ngày; quá 7 ngày thì không hiện nữa (phòng đã cũ, không còn là điểm "mới").

export type PostedAgo =
  | { unit: 'justNow' }
  | { unit: 'minute' | 'hour' | 'day'; count: number };

/** Số ngày tối đa vẫn hiển thị "đăng N ngày trước". */
export const POSTED_AGO_MAX_DAYS = 7;

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** createdAt (ISO/Date) -> khoảng cách tới `now`; null nếu thiếu/sai ngày hoặc đã quá 7 ngày. */
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
  return days <= POSTED_AGO_MAX_DAYS ? { unit: 'day', count: days } : null;
};
