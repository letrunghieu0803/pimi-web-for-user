// Lưới thẻ phòng dùng chung cho mọi danh sách phòng (trang chủ, tìm phòng, yêu thích, đã xem, phòng tương tự):
// 1 → 2 → 3 → 4 → 5 thẻ mỗi hàng theo bề rộng màn hình (5 thẻ từ `xl` = 1280px). Số phòng tải mỗi lượt nên là bội
// của 5 (vd 5, 10) để hàng cuối không bị lẻ ở màn rộng.
export const ROOM_GRID_CLASS = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 xl:gap-5';

/** Số phòng hiển thị ở mỗi mục trang chủ (2 hàng × 5). */
export const HOME_SECTION_ROOM_COUNT = 10;
