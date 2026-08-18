#!/usr/bin/env node
/**
 * Sinh sitemap.xml + robots.txt vào thư mục dist/ SAU khi `vite build` xong (chạy như bước
 * postbuild). App này là SPA thuần CSR (Vite + React Router, không SSR/prerender) nên không
 * có cách nào để framework tự sinh sitemap lúc build như Next.js — phải tự viết script gọi
 * thẳng API backend để liệt kê phòng/tin tức công khai rồi build XML thủ công.
 *
 * Quan trọng: script này KHÔNG được làm hỏng `npm run build` nếu backend không gọi được lúc
 * build (CI không có mạng nội bộ, backend đang down...) — mọi lỗi fetch đều bị nuốt và fallback
 * về sitemap chỉ gồm các trang tĩnh, kèm cảnh báo rõ ràng ra console.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');

const SITE_URL = (process.env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/+$/, '');
const API_BASE_URL = (process.env.VITE_API_ENDPOINT || 'http://localhost:3333/api').replace(/\/+$/, '');

const STATIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/rooms', changefreq: 'hourly', priority: '0.9' },
  { path: '/news', changefreq: 'daily', priority: '0.7' },
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
  { path: '/faq', changefreq: 'monthly', priority: '0.5' },
  { path: '/contact', changefreq: 'monthly', priority: '0.4' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.2' },
];

// Các route riêng tư/theo phiên đăng nhập — KHÔNG được liệt kê cho bot thu thập dữ liệu.
const DISALLOWED_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/verify-email',
  '/profile',
  '/bookings',
  '/payment/',
  '/appointments',
  '/notifications',
];

/** Gọi 1 endpoint public phân trang, trả về mảng item đã gộp hết các trang. Trả [] nếu lỗi. */
async function fetchAllPages(label, urlBuilder, maxPages = 50) {
  const items = [];
  let pageNumber = 1;
  let totalPages = 1;
  try {
    do {
      const url = urlBuilder(pageNumber);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} khi gọi ${url}`);
      const body = await res.json();
      const pageData = body?.data?.data ?? body?.data ?? [];
      const metadata = body?.data?.metadata ?? body?.metadata;
      items.push(...pageData);
      totalPages = metadata?.totalPages ?? 1;
      pageNumber += 1;
    } while (pageNumber <= totalPages && pageNumber <= maxPages);
    return items;
  } catch (err) {
    console.warn(
      `[generate-sitemap] Không lấy được dữ liệu "${label}" từ backend (${err.message}). ` +
        'Sitemap sẽ chỉ gồm các trang tĩnh cho phần này — không chặn build.'
    );
    return [];
  }
}

function xmlEscape(value) {
  return String(value).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

function buildUrlEntry({ path: p, lastmod, changefreq, priority }) {
  const lines = [`  <url>`, `    <loc>${xmlEscape(SITE_URL + p)}</loc>`];
  if (lastmod) lines.push(`    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>`);
  if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority) lines.push(`    <priority>${priority}</priority>`);
  lines.push(`  </url>`);
  return lines.join('\n');
}

async function main() {
  if (!existsSync(DIST_DIR)) {
    console.warn('[generate-sitemap] Chưa thấy thư mục dist/ — chạy sau `vite build`. Bỏ qua.');
    return;
  }

  const rooms = await fetchAllPages(
    'phòng công khai',
    (pageNumber) => `${API_BASE_URL}/v1/rent-rooms/public/feed?pageNumber=${pageNumber}&pageSize=100`
  );
  const news = await fetchAllPages(
    'tin tức công khai',
    (pageNumber) => `${API_BASE_URL}/v1/news/public/feed?pageNumber=${pageNumber}&pageSize=100`
  );

  const entries = [
    ...STATIC_ROUTES.map(buildUrlEntry),
    ...rooms.map((room) =>
      buildUrlEntry({
        path: room.roomGroupId ? `/room-groups/${room.roomGroupId}` : `/rooms/${room.id}`,
        lastmod: room.updatedAt || room.createdAt,
        changefreq: 'weekly',
        priority: '0.8',
      })
    ),
    ...news.map((item) =>
      buildUrlEntry({
        path: `/news/${item.id}`,
        lastmod: item.updatedAt || item.createdAt,
        changefreq: 'monthly',
        priority: '0.6',
      })
    ),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
  await writeFile(path.join(DIST_DIR, 'sitemap.xml'), sitemap, 'utf-8');

  const robots = [
    'User-agent: *',
    'Allow: /',
    ...DISALLOWED_PATHS.map((p) => `Disallow: ${p}`),
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');
  await writeFile(path.join(DIST_DIR, 'robots.txt'), robots, 'utf-8');

  console.log(
    `[generate-sitemap] Đã sinh sitemap.xml (${entries.length} URL: ${STATIC_ROUTES.length} tĩnh + ${rooms.length} phòng + ${news.length} tin tức) và robots.txt tại dist/.`
  );
}

main();
