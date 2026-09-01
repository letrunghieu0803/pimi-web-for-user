import React from 'react';

/**
 * Render 1 khối dữ liệu có cấu trúc schema.org dạng JSON-LD. Không cần nằm trong <head> —
 * công cụ tìm kiếm đọc <script type="application/ld+json"> ở bất kỳ đâu trong <body>.
 */
export const JsonLd: React.FC<{ data: Record<string, unknown> }> = ({ data }) => {
  // `data` có thể chứa chuỗi lấy từ nội dung do admin nhập (vd tiêu đề/mô tả bài tin tức dùng làm
  // SEO). Nếu 1 chuỗi trong đó chứa "</script>", trình duyệt đóng thẻ <script> ngay tại vị trí đó
  // (HTML parser không quan tâm đang ở trong JS string hay không) — phần còn lại của trang bị hiểu
  // như HTML thường, cho phép chèn thẻ <script> mới thực thi (XSS). Escape mọi ký tự "<" thành
  // "<" trong JSON string trước khi render: vẫn là JSON hợp lệ (JSON.parse hiểu < như "<"
  // bình thường), nhưng chuỗi HTML thô không còn ký tự "<" nào để trình duyệt hiểu nhầm là thẻ mới.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    // eslint-disable-next-line react/no-danger
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
};
