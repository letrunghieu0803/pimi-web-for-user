// Nhãn loại phòng cho các giá trị RoomType của backend (xem enum RoomType ở bff-for-pimi) qua key i18n
// `roomType.<GIÁ_TRỊ>`. Giá trị enum mới thêm sau này mà chưa có bản dịch thì tự "người hoá"
// (MINI_CONDOMINIUM -> "Mini condominium") thay vì hiện chuỗi enum thô.
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
