// Mọi số tiền hiển thị trên toàn bộ ứng dụng đều theo dạng chấm ngăn cách hàng nghìn: 1.500.000.
// KHÔNG dùng Intl/toLocaleString — kết quả phụ thuộc locale của trình duyệt (vd 'en-US' ra dấu
// phẩy, 'vi-VN' trên vài môi trường thiếu dữ liệu locale ra không dấu), còn đây phải luôn giống
// nhau ở mọi máy và mọi ngôn ngữ giao diện.
const GROUP_THOUSANDS = /\B(?=(\d{3})+(?!\d))/g;

export const formatMoney = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') return '0';
  const numeric = Math.round(Number(value));
  if (!Number.isFinite(numeric)) return '0';
  const sign = numeric < 0 ? '-' : '';
  return sign + Math.abs(numeric).toString().replace(GROUP_THOUSANDS, '.');
};

/** formatMoney + hậu tố "đ" — dạng dùng để hiển thị giá/số tiền trong câu. */
export const formatVnd = (value: number | string | null | undefined): string => `${formatMoney(value)}đ`;

/** Giữ lại đúng các chữ số từ chuỗi người dùng nhập/dán (bỏ dấu chấm, phẩy, chữ, khoảng trắng). */
export const digitsOnly = (raw: string): string => raw.replace(/\D/g, '');
