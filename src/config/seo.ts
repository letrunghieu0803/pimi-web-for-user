/**
 * Cấu hình dùng chung cho toàn bộ tính năng SEO (canonical URL, Open Graph, sitemap...).
 *
 * SITE_URL PHẢI được set qua biến môi trường VITE_SITE_URL khi deploy production — nếu để
 * mặc định localhost thì canonical/OG/sitemap sẽ trỏ sai domain. Dùng chung 1 nguồn duy nhất
 * ở đây (thay vì rải rác window.location.origin) để scripts/generate-sitemap.mjs (chạy ở
 * Node, không có window) cũng đọc được cùng giá trị qua process.env.
 */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/+$/, '');

export const SITE_NAME = 'Pimi';

export const DEFAULT_SEO = {
  titleTemplate: (title: string) => (title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Tìm Phòng Trọ & Đặt Lịch Xem Phòng Miễn Phí`),
  description:
    'Nền tảng tìm kiếm và đặt lịch xem phòng trọ, chung cư mini chính chủ xác thực. Trải nghiệm thuê nhà minh bạch, không qua trung gian.',
};

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
