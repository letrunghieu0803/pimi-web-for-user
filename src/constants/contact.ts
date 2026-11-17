// Thông tin liên hệ chính thức của Pimi — NGUỒN DUY NHẤT cho footer, trang Liên hệ, FAQ, trang chủ,
// Điều khoản và Chính sách bảo mật. Đổi ở đây là đổi toàn bộ website.
export const CONTACT = {
  companyName: 'Công ty TNHH Pimi Nest',
  representative: 'Ông Đào Quang Trọng — Nhà sáng lập & Tổng Giám đốc',
  phone: '0889625908',
  phoneDisplay: '0889.625.908',
  email: 'piminest.vn@gmail.com',
  address: 'Xóm Kim Tân, Xã Kim Phượng, tỉnh Thái Nguyên',
} as const;

export const CONTACT_TEL_HREF = `tel:${CONTACT.phone}`;
export const CONTACT_MAILTO_HREF = `mailto:${CONTACT.email}`;

// Ngày hiệu lực + phiên bản của Điều khoản sử dụng / Chính sách bảo mật hiện hành.
export const LEGAL_VERSION = {
  effectiveDate: '14/11/2026',
  version: '2.0',
} as const;
