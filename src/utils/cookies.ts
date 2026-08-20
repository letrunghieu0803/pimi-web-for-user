// Đọc giá trị 1 cookie không-httpOnly bằng document.cookie — dùng để lấy `pimi_csrf`
// (cookie CSRF cố tình KHÔNG httpOnly để JS đọc được, xem backend `auth-cookies.util.ts`).
// Không dùng để đọc cookie xác thực (`pimi_at`/`pimi_rt`) — 2 cookie đó httpOnly, JS không
// bao giờ đọc được, đúng như thiết kế.
export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
};
