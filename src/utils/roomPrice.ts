import type { Room } from '@/types';

// Loại hình đang tìm/xem. Đơn vị tháng/năm chỉ thuộc thuê DÀI hạn, giờ/ngày chỉ thuộc thuê NGẮN hạn; giá và đơn vị luôn đi
// cùng nhau theo đúng loại hình (không ghép số tiền loại này với đơn vị loại kia).
export type RoomPriceTerm = 'SHORT_TERM' | 'LONG_TERM';

export interface SecondaryPrice {
  amount: number;
  unitKey: string;
}

export interface RoomPriceDisplay {
  amount: number | undefined;
  // Khoá i18n của đơn vị: roomCard.unit{Hour,Day,Month,Year}
  unitKey: string;
  // Bội số thời lượng (vd "2 tháng") — chỉ > 1 mới hiện; thuê ngắn hạn luôn 1 (đã bỏ khái niệm "block" ở backend).
  durationValue: number;
  // Thuê ngắn hạn mà phòng bán CẢ theo ngày lẫn theo giờ: giá chính là giá ngày, giá giờ nằm ở đây.
  secondary?: SecondaryPrice;
}

type PriceFields = Pick<
  Room,
  | 'price'
  | 'shortTermPrice'
  | 'shortTermPriceUnit'
  | 'shortTermDayPrice'
  | 'shortTermHourPrice'
  | 'longTermPriceUnit'
  | 'longTermDurationValue'
>;

const positive = (v: unknown): number | undefined => (Number(v) > 0 ? Number(v) : undefined);

/** Giá thuê ngắn hạn theo NGÀY và theo GIỜ của phòng (bản ghi cũ chỉ có 1 giá + 1 đơn vị thì quy theo đơn vị đó). */
export const getShortTermPrices = (room: Partial<PriceFields>): { day?: number; hour?: number } => {
  let day = positive(room.shortTermDayPrice);
  let hour = positive(room.shortTermHourPrice);
  if (day === undefined && hour === undefined) {
    const legacy = positive(room.shortTermPrice);
    if (legacy !== undefined) {
      if (room.shortTermPriceUnit === 'PER_HOUR') hour = legacy;
      else day = legacy;
    }
  }
  return { day, hour };
};

const shortDisplay = (room: Partial<PriceFields>): RoomPriceDisplay => {
  const { day, hour } = getShortTermPrices(room);
  if (day !== undefined) {
    return {
      amount: day,
      unitKey: 'roomCard.unitDay',
      durationValue: 1,
      secondary: hour !== undefined ? { amount: hour, unitKey: 'roomCard.unitHour' } : undefined,
    };
  }
  return { amount: hour, unitKey: 'roomCard.unitHour', durationValue: 1 };
};

const longDisplay = (room: Partial<PriceFields>): RoomPriceDisplay => ({
  amount: Number(room.price) > 0 ? Number(room.price) : undefined,
  unitKey: room.longTermPriceUnit === 'PER_YEAR' ? 'roomCard.unitYear' : 'roomCard.unitMonth',
  durationValue: Number(room.longTermDurationValue) || 1,
});

/**
 * Giá + đơn vị hiển thị của phòng.
 * - Có `term` (đang tìm/xem theo loại nào): CHỈ lấy giá loại đó; phòng không có giá loại đó thì `amount` = undefined
 *   (không lấy giá loại kia thay thế — nếu không phòng chỉ thuê dài hạn sẽ hiện "…/tháng" trong danh sách ngắn hạn).
 * - Không có `term` (yêu thích, đã xem...): giữ cách cũ — có giá ngắn hạn thì hiện giá ngắn hạn, không thì giá dài hạn.
 */
export const getRoomPriceDisplay = (room: Partial<PriceFields>, term?: RoomPriceTerm): RoomPriceDisplay => {
  const short = shortDisplay(room);
  const long = longDisplay(room);
  if (term === 'LONG_TERM') return long;
  if (term === 'SHORT_TERM') return short;
  return short.amount !== undefined ? short : long;
};

/** Phòng có giá của loại hình này không. */
export const hasRoomPriceForTerm = (room: Partial<PriceFields>, term: RoomPriceTerm): boolean =>
  (term === 'LONG_TERM' ? longDisplay(room) : shortDisplay(room)).amount !== undefined;

/**
 * Loại hình thực sự áp dụng khi xem chi tiết phòng: theo loại người dùng đang tìm nếu phòng có giá loại đó; phòng không có
 * giá loại đó (mở trực tiếp từ link/yêu thích) thì theo loại phòng có giá (ngắn hạn ưu tiên khi không biết loại đang tìm).
 */
export const resolveRoomPriceTerm = (room: Partial<PriceFields>, term?: RoomPriceTerm | null): RoomPriceTerm => {
  const hasShort = hasRoomPriceForTerm(room, 'SHORT_TERM');
  const hasLong = hasRoomPriceForTerm(room, 'LONG_TERM');
  if (term === 'LONG_TERM') return hasLong || !hasShort ? 'LONG_TERM' : 'SHORT_TERM';
  if (term === 'SHORT_TERM') return hasShort || !hasLong ? 'SHORT_TERM' : 'LONG_TERM';
  return hasShort ? 'SHORT_TERM' : 'LONG_TERM';
};

/** Chuỗi "/ 2 giờ" / "/ tháng" (có dấu / đầu) từ kết quả getRoomPriceDisplay. */
export const formatPriceUnit = (display: RoomPriceDisplay, t: (key: string) => string): string =>
  `/ ${display.durationValue > 1 ? `${display.durationValue} ` : ''}${t(display.unitKey)}`;
