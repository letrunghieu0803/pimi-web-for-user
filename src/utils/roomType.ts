// Nhãn loại phòng cho các giá trị RoomType của backend (xem enum RoomType ở bff-for-pimi) qua key i18n
// `roomType.<GIÁ_TRỊ>`. Giá trị enum mới thêm sau này mà chưa có bản dịch thì tự "người hoá"
// (MINI_CONDOMINIUM -> "Mini condominium") thay vì hiện chuỗi enum thô.
/** Kiểu thiết kế / bố cục phòng (enum RoomType ở backend) theo danh mục chuẩn + Phòng ở ghép. */
export const ROOM_TYPE_VALUES = [
  'STUDIO',
  'LOFT',
  'ONE_BEDROOM',
  'TWO_BEDROOM',
  'THREE_PLUS_BEDROOM',
  'STANDARD_ROOM',
  'BUNK_BED',
  'SHARED_ROOM',
] as const;

export const isKnownRoomType = (value: string | null | undefined): boolean =>
  !!value && (ROOM_TYPE_VALUES as readonly string[]).includes(value);

const humanizeRoomType = (type: string): string =>
  type
    .toLowerCase()
    .split('_')
    .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');

export const formatRoomTypeLabel = (type: string, t: (key: string) => string): string => {
  const key = `roomType.${type}`;
  const label = t(key);
  return label === key ? humanizeRoomType(type) : label;
};
