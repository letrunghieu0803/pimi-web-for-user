import React from 'react';

/**
 * Render 1 khối dữ liệu có cấu trúc schema.org dạng JSON-LD. Không cần nằm trong <head> —
 * công cụ tìm kiếm đọc <script type="application/ld+json"> ở bất kỳ đâu trong <body>.
 */
export const JsonLd: React.FC<{ data: Record<string, unknown> }> = ({ data }) => (
  // eslint-disable-next-line react/no-danger
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);
