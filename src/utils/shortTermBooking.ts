import type { Room } from '@/types';

/**
 * Thuê ngắn hạn có 2 hình thức độc lập (xem backend booking-pricing.helper.ts):
 *  - DAILY: khách chọn NGÀY nhận + NGÀY trả; giờ nhận/trả lấy theo cài đặt của phòng (mặc định 14:00 / 11:00).
 *  - HOURLY: khách chọn ngày + giờ bắt đầu + SỐ GIỜ (trong khoảng min–max, trong khung giờ nhận khách nếu có).
 * File này chỉ gom cấu hình đọc từ phòng + kiểm tra phía web cho UX mượt; backend vẫn là nguồn kiểm tra thật.
 */

export type BookingMode = 'DAILY' | 'HOURLY';

export interface ShortTermOptions {
  hasDaily: boolean;
  hasHourly: boolean;
  checkInMinute: number;
  checkOutMinute: number;
  minHours: number;
  maxHours: number;
  openMinute: number | null;
  closeMinute: number | null;
}

const positive = (v: unknown) => Number(v) > 0;

export const getShortTermOptions = (room: Partial<Room>): ShortTermOptions => {
  let hasDaily = positive(room.shortTermDayPrice);
  let hasHourly = positive(room.shortTermHourPrice);
  // Phòng chỉ còn giá ngắn hạn kiểu cũ (1 giá + 1 đơn vị) -> quy theo đơn vị cũ.
  if (!hasDaily && !hasHourly && positive(room.shortTermPrice)) {
    if (room.shortTermPriceUnit === 'PER_HOUR') hasHourly = true;
    else hasDaily = true;
  }
  return {
    hasDaily,
    hasHourly,
    checkInMinute: room.checkInMinute ?? 14 * 60,
    checkOutMinute: room.checkOutMinute ?? 11 * 60,
    minHours: room.hourlyMinHours ?? 2,
    maxHours: room.hourlyMaxHours ?? 12,
    openMinute: room.hourlyOpenMinute ?? null,
    closeMinute: room.hourlyCloseMinute ?? null,
  };
};

const pad2 = (n: number) => String(n).padStart(2, '0');

/** 840 -> "14:00" (1440 -> "24:00"). */
export const minuteToTime = (minute: number): string => `${pad2(Math.floor(minute / 60))}:${pad2(minute % 60)}`;

/** "14:00" -> 840; rỗng/sai định dạng -> null. */
export const timeToMinute = (time?: string | null): number | null => {
  const m = /^(\d{1,2}):(\d{2})$/.exec((time || '').trim());
  if (!m) return null;
  const minute = Number(m[1]) * 60 + Number(m[2]);
  return Number(m[2]) < 60 && minute <= 1440 ? minute : null;
};

/** 'YYYY-MM-DD' theo ngày lịch của Date (giờ máy — đúng ngày người dùng nhìn thấy trên lịch). */
export const toDateKey = (d: Date): string => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** 'YYYY-MM-DD' -> Date ở 00:00 giờ máy. */
export const fromDateKey = (key: string): Date => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** Thời điểm thật của "ngày d + phút trong ngày" theo GIỜ VIỆT NAM (UTC+7), không phụ thuộc múi giờ máy. */
export const vnInstant = (d: Date, minuteOfDay: number): Date =>
  new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) + (minuteOfDay - 7 * 60) * 60_000);

export const vnMinuteNow = (now = new Date()): number => {
  const shifted = new Date(now.getTime() + 7 * 3_600_000);
  return shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
};

/** Ngày lịch hiện tại theo giờ Việt Nam, dạng Date ở 00:00 giờ máy. */
export const vnToday = (now = new Date()): Date => {
  const shifted = new Date(now.getTime() + 7 * 3_600_000);
  return new Date(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate());
};

/** Khoá i18n (booking.*) của lỗi lựa chọn thuê theo giờ đầu tiên, hoặc null nếu hợp lệ. */
export const validateHourlySelection = (
  opts: ShortTermOptions,
  date: Date,
  startMinute: number,
  hours: number,
  now = new Date(),
): string | null => {
  if (!Number.isInteger(hours) || hours < opts.minHours || hours > opts.maxHours) return 'booking.errHoursRange';
  if (vnInstant(date, startMinute).getTime() < now.getTime()) return 'booking.errStartInPast';
  if (opts.openMinute !== null && opts.closeMinute !== null) {
    if (startMinute < opts.openMinute || startMinute + hours * 60 > opts.closeMinute) return 'booking.errOutsideWindow';
  }
  return null;
};

/** Giờ kết thúc "HH:mm" ("24:00" nếu đúng nửa đêm, kèm "(+1)" nếu sang ngày hôm sau). */
export const hourlyEndLabel = (startMinute: number, hours: number): string => {
  const end = startMinute + hours * 60;
  if (end <= 1440) return minuteToTime(end);
  return `${minuteToTime(end - 1440)} (+1)`;
};

export interface BookingSelection {
  mode: BookingMode;
  /** DAILY: 'YYYY-MM-DD' ngày nhận; HOURLY: ISO của giờ bắt đầu. */
  checkInDate: string;
  /** DAILY: 'YYYY-MM-DD' ngày trả. */
  checkOutDate?: string;
  /** HOURLY: số giờ. */
  hours?: number;
}
