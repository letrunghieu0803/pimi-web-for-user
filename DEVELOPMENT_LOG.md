# Development Log — Web-Pimi-for-user

Nhật ký các đợt phát triển tính năng (mới nhất ở trên cùng). Mỗi mục tương ứng với 1 (hoặc 1 nhóm) commit liên quan.

---

## 2026-08-20 — Sửa lỗi đăng nhập nhận sai vai trò cho tài khoản 2 vai trò

**Vì sao:** 1 tài khoản thông thường có thể vừa đăng nhập với vai trò khách thuê (ở web này) vừa với vai trò chủ nhà (ở web chủ nhà) — trước đó trang này không khai báo rõ đang xin vai trò nào khi đăng nhập, backend có thể trả nhầm JWT theo role thật trong DB (vd tài khoản có role thật `HOUSE_OWNER` đăng nhập ở đây sẽ nhận JWT role chủ nhà, khiến các API dành cho khách thuê như đặt lịch xem phòng/đặt phòng bị chặn 403 sai).

**Thay đổi:** `src/context/AuthContext.tsx` — `login()` gửi kèm `loginAs: 'RENT_USER'`; đồng thời sửa lỗi có sẵn: response đăng nhập của backend không có object `user` (chỉ `{accessToken, refreshToken, role}`), code trước đó âm thầm dùng object rỗng khiến hồ sơ hiển thị sau đăng nhập luôn thiếu id/email thật — nay gọi thêm `GET /v1/users/me` để lấy đúng hồ sơ. Nhân tiện sửa message mã lỗi `000065` (`errors.json` vi/en) cho đúng nội dung "Số điện thoại Việt Nam không hợp lệ" (trước đó bị đặt nhầm thành thông báo lỗi chung).

**Đã kiểm tra:** `tsc -b` sạch, đối chiếu i18n vi/en parity. Live browser test: đăng nhập bằng tài khoản có role thật `HOUSE_OWNER` ở web này → xác nhận JWT/role phiên đúng `RENT_USER`, hồ sơ hiển thị đúng tên/email thật thay vì rỗng.

---

## 2026-08-18 — Nút "Xem thêm" ở khối Tin tức trang chủ phản ánh đúng số bài còn lại

**Vì sao:** Nút trước đó hardcode "Xem thêm 10+ bài viết" bất kể thực tế còn bao nhiêu bài — sai khi tổng số bài ít hơn 10 (không nên hiện nút) hoặc nhiều hơn (con số "10+" không chính xác).

**Thay đổi:** `src/components/home/NewsArticlesSlider.tsx` — lấy `totalItems` từ response API, tính `remainingCount = totalItems - số bài đã hiện (tối đa 10)`; hiện "Xem thêm {remainingCount} bài viết" (cả nút desktop lẫn nút mobile), tự ẩn cả 2 nút khi `remainingCount <= 0`. Bấm vào vẫn dẫn tới `/news` như cũ.

**Đã kiểm tra:** `tsc -b` sạch. Live browser test với dữ liệu thật: 14 bài tổng → hiện đúng "Xem thêm 4 bài viết", bấm vào điều hướng đúng `/news`.

---

## 2026-08-18 — SEO (meta động, dữ liệu có cấu trúc, sitemap) + Banner slide trang chủ

**Vì sao:** App là SPA CSR thuần (Vite, không SSR/prerender) nên trước đó mọi trang dùng chung 1 tiêu đề/mô tả tĩnh trong `index.html`, không có sitemap/robots.txt, không có dữ liệu có cấu trúc — bất lợi cho SEO. Đồng thời cần khối banner quảng cáo/khuyến mãi do admin quản lý ở đầu trang chủ.

**SEO — thay đổi:**
- `src/components/common/Seo.tsx` (mới): quản lý `<title>/<meta>/<link>` theo từng trang bằng cơ chế hoisting-to-`<head>` có sẵn của React 19 (không cần react-helmet). Hỗ trợ `noindex` cho trang riêng tư.
- `src/components/common/JsonLd.tsx` (mới): render khối `<script type="application/ld+json">`.
- `src/config/seo.ts` (mới): `SITE_URL` (đọc từ env `VITE_SITE_URL`, **cần set domain thật khi deploy production**), helper `absoluteUrl()`.
- Áp dụng `<Seo>` + JSON-LD cho toàn bộ trang public (Home: Organization+WebSite+SearchAction; RoomList: canonical không kèm query + ItemList; RoomDetail: Product+BreadcrumbList; NewsDetail: Article; FAQ: FAQPage; About/Contact/Privacy: meta cơ bản) và gắn `noindex` cho toàn bộ trang riêng tư (Login, Register, Profile, Bookings, Payment, Appointments, Notifications...).
- `scripts/generate-sitemap.mjs` (mới) + `package.json`: sinh `dist/sitemap.xml` + `dist/robots.txt` sau `vite build` (đọc dữ liệu phòng/tin tức công khai thật từ API) — không chặn build nếu gọi API thất bại.
- **Lỗi thật phát hiện khi kiểm thử**: React 19 chỉ tự khử trùng `<title>` nó tự render, KHÔNG tự gỡ các thẻ `<meta name="description">/OG` tĩnh có sẵn trong `index.html` → 2 thẻ description cùng tồn tại, trình duyệt/bot luôn lấy thẻ đầu (bản chung chung sai). Sửa bằng cách đánh dấu `data-default="true"` cho thẻ tĩnh, để `Seo` tự dọn khi mount lần đầu.
- Tiện thể sửa 2 lỗi TypeScript có sẵn chặn build (không liên quan SEO): `RoomList.tsx`'s `handleResetFilters` thiếu field `rentalTermType`; `RoomDetail.tsx` so sánh sai giá trị `RoomStatus` ('AVAILABLE' → đúng phải là 'EMPTY').

**Banner slide — thay đổi:**
- `src/services/bannerApi.ts` (mới) + `src/components/home/BannerSlider.tsx` (mới): slide banner tự động chuyển (5s/lần) ở đầu trang chủ, mũi tên + chấm điều hướng, dừng khi rê chuột vào. Bấm vào: link nội bộ (`/rooms`) điều hướng SPA, link ngoài (`https://...`) mở tab mới.
- Theo yêu cầu sau đó: tiêu đề banner **chỉ hiện khi di chuột vào** (mặc định ẩn bằng `opacity`, không phải `display:none` — vẫn nằm trong DOM nên không mất giá trị SEO), **bỏ hẳn phần mô tả**.
- Tiện thể sửa 1 lỗi thật lộ ra khi kiểm thử: nếu số banner thay đổi khiến `activeIndex` cũ vượt quá phạm vi, không slide nào hiển thị — thêm phép tính chuẩn hoá lại `safeActiveIndex = activeIndex % banners.length`.

**Đã kiểm tra:** `tsc -b` sạch. Live browser test đầy đủ: title/description/canonical/OG/JSON-LD/robots đúng theo từng trang; sitemap.xml + robots.txt sinh đúng với dữ liệu thật; banner: cả link nội bộ/ngoài, auto-rotate, dot indicator, hover-hiện-tiêu-đề đều đúng.

**Việc còn để ngỏ:** chưa có ảnh chia sẻ mặc định (og:image) cho các trang chung chung (Home/RoomList/About...) — cần thiết kế ảnh banner 1200×630, ngoài phạm vi thay đổi code thuần.

---

## Trước 2026-08-18

*(Log bắt đầu từ đợt commit này trở đi — lịch sử phát triển trước đó xem `git log`.)*
