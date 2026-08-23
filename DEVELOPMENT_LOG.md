# Development Log — Web-Pimi-for-user

Nhật ký các đợt phát triển tính năng (mới nhất ở trên cùng). Mỗi mục tương ứng với 1 (hoặc 1 nhóm) commit liên quan.

---

## 2026-08-23 — Đánh giá phòng sau khi ở (điểm sao + bình luận)

**Vì sao:** Người thuê muốn đánh giá phòng đã ở, người thuê khác xem được trước khi quyết định thuê.

**Thay đổi:**
- `src/services/reviewApi.ts` (mới): `getRoomReviews`, `getEligibility`, `upsertMyReview`, `deleteMyReview`.
- `src/components/room/RoomReviews.tsx` (mới): khối hiển thị trên trang chi tiết phòng — điểm trung bình + số lượng, danh sách đánh giá (điểm/bình luận bị admin ẩn hiện đúng dấu hiệu "đã ẩn" thay vì trống trơn khó hiểu), nút "Viết đánh giá"/"Sửa đánh giá" chỉ hiện khi đủ điều kiện (gọi `/eligibility` 1 lần), form chọn sao + textarea, "Xem thêm" phân trang.
- `src/pages/RoomDetail.tsx`: gắn `<RoomReviews roomId={room.id} />` vào cuối trang.

**Đã kiểm tra:** `npm run build` sạch, đối chiếu i18n vi/en. Test sống qua trình duyệt thật: viết đánh giá 4 sao → hiện đúng ngay trong danh sách + điểm trung bình cập nhật; admin ẩn bình luận ở phía backend → tải lại trang hiện đúng "Bình luận đã bị ẩn bởi quản trị viên" thay vì nội dung thật.

---

## 2026-08-21 — Đồng bộ khối "trống dữ liệu" dùng chung (EmptyState)

**Vì sao:** 3 trang (Phòng yêu thích, Đã xem gần đây, Danh sách phòng khi lọc ra 0 kết quả) mỗi trang tự viết lại y hệt cấu trúc "icon tròn + tiêu đề + mô tả + nút hành động" — 2 trang mới (yêu thích/đã xem) giống nhau nhưng trang danh sách phòng (có từ trước) lại lệch hẳn: khung vuông bo góc thay vì tròn, tông màu/đệm khác, nút không có shadow/hover-scale như 2 trang kia.

**Thay đổi:**
- `src/components/common/EmptyState.tsx` (mới): component dùng chung — icon trong vòng tròn màu (`tone`: rose/indigo/amber/emerald), tiêu đề, mô tả, nút hành động (điều hướng qua `actionTo` hoặc chạy hàm qua `onAction`).
- `src/pages/FavoriteRooms.tsx`, `src/pages/RecentlyViewed.tsx`: thay khối tự viết tay bằng `<EmptyState />`.
- `src/pages/RoomList.tsx`: khối "Không tìm thấy phòng phù hợp" (khi lọc ra 0 kết quả) đổi sang dùng chung `<EmptyState />` (tone amber, nút "Reset filters" gọi `onAction`) — đồng bộ giao diện với 2 trang trên thay vì kiểu cũ.

**Đã kiểm tra:** `npm run build` sạch. Test sống qua trình duyệt thật: trang Yêu thích/Đã xem gần đây hiện đúng như trước khi tách; lọc phòng ra 0 kết quả hiện đúng khối mới (vòng tròn hổ phách + icon Info), bấm "Reset filters" trả lại đúng danh sách đầy đủ.

---

## 2026-08-21 — Đã xem gần đây — hoàn toàn phía trình duyệt, không gọi API

**Vì sao:** Người thuê muốn xem lại các phòng mình từng mở xem, khác "yêu thích" ở chỗ không cần chủ động lưu và không cần đăng nhập — chỉ đơn thuần là vết xem theo thiết bị. Yêu cầu rõ ràng từ đầu: không thêm bất kỳ API/bảng dữ liệu nào ở backend.

**Thay đổi:**
- `src/utils/recentlyViewed.ts` (mới): đọc/ghi thẳng `localStorage` (key theo **thiết bị**, không theo tài khoản — dùng chung cho khách lẫn mọi tài khoản đăng nhập, giống cách các sàn TMĐT vẫn làm). Giữ tối đa 24 phòng gần nhất kiểu LRU (xem lại 1 phòng đã có thì đẩy lên đầu thay vì trùng lặp); mỗi bản ghi chỉ giữ 1 ảnh đầu + bỏ `description`/`services` để không phình dữ liệu vô ích. Bọc try/catch quanh mọi thao tác `localStorage` (Safari riêng tư/hết quota không được phép làm gãy luồng xem phòng chính).
- `src/pages/RoomDetail.tsx`: gọi `recentlyViewedApi.add(room)` ngay sau khi fetch chi tiết phòng thành công (không ghi lúc đang loading/lỗi).
- `src/pages/Home.tsx`: thêm khối "Phòng đã xem gần đây" (đọc 1 lần lúc mount, không qua API), đặt trước "Phòng nổi bật" vì là nội dung cá nhân hoá; tự ẩn hoàn toàn nếu chưa từng xem phòng nào.
- `src/pages/RecentlyViewed.tsx` (mới): trang `/recently-viewed` — lưới đầy đủ + nút "Xoá lịch sử"; không yêu cầu đăng nhập.
- `src/components/common/Navbar.tsx`: thêm link "Đã xem gần đây" vào menu tài khoản (desktop dropdown + mobile drawer).

**Đã kiểm tra:** `npm run build` sạch, đối chiếu i18n vi/en. Test sống qua trình duyệt thật: mở 1 phòng → xác nhận đúng bản ghi (1 ảnh, không mô tả) xuất hiện trong `localStorage`; trang chủ hiện đúng khối "Phòng đã xem gần đây"; vào `/recently-viewed` thấy đúng phòng; bấm "Xoá lịch sử" → danh sách về rỗng, hiện đúng trạng thái trống.

---

## 2026-08-20 — Phòng yêu thích cho người thuê

**Vì sao:** Người thuê muốn bấm tim lưu lại các phòng đang quan tâm để xem lại sau, thay vì phải tìm kiếm lại từ đầu mỗi lần.

**Thay đổi:**
- `src/services/favoriteApi.ts` (mới): `getFavoriteIds`, `getMyFavorites`, `addFavorite`, `removeFavorite`.
- `src/context/FavoritesContext.tsx` (mới): fetch id yêu thích 1 lần ngay sau khi biết đã đăng nhập, giữ trong `Set` cục bộ; `toggleFavorite` cập nhật lạc quan trên UI trước, gọi API nền, tự revert nếu lỗi.
- `src/components/common/RoomCard.tsx`: thêm nút tim overlay góc dưới-phải ảnh (thẻ trước đây chưa có nút yêu thích nào) — bấm khi chưa đăng nhập thì báo + điều hướng `/login`, giống hệt pattern gate đăng nhập đã có ở `RoomDetail.tsx`.
- `src/pages/RoomDetail.tsx`: nút tim sẵn có ở trang chi tiết (trước đây chỉ là `useState` cục bộ giả, không gọi API nào) nay nối vào `FavoritesContext` thật.
- `src/pages/FavoriteRooms.tsx` (mới): trang "Phòng yêu thích" tại `/favorites` — lưới `RoomCard`, trạng thái rỗng có nút "Khám phá phòng trọ".
- `src/components/common/Navbar.tsx`: thêm link "Phòng yêu thích" vào menu tài khoản (cả bản desktop dropdown lẫn mobile drawer).

**Đã kiểm tra:** `npm run build` sạch, đối chiếu i18n vi/en. Test sống qua trình duyệt thật với tài khoản RENT_USER thật: bấm tim trên thẻ danh sách → API `POST` 201 → vào trang Phòng yêu thích thấy đúng phòng vừa lưu; bấm tim ở trang chi tiết phòng → đổi trạng thái đúng; bỏ tim tại trang Phòng yêu thích → API `DELETE` 200 → trang tự cập nhật về trạng thái rỗng.

---

## 2026-08-20 — Lịch sử thuê phòng dùng dữ liệu thật (thay 100% mock)

**Vì sao:** Trang "Lịch sử thuê phòng" trước đó toàn bộ là dữ liệu giả tĩnh (`INITIAL_RENTAL_HISTORY`), chưa từng gọi API thật dù backend đã có sẵn cả hợp đồng dài hạn lẫn đặt phòng ngắn hạn cho người thuê.

**Thay đổi:**
- `src/services/contractApi.ts` (mới): `getMyContracts(params)` → `GET /v1/contracts/mine`.
- `src/pages/BookingHistory.tsx`: viết lại hoàn toàn — gộp hợp đồng dài hạn (`contractApi.getMyContracts`) + đặt phòng ngắn hạn đã thanh toán (`bookingApi.getTenantBookings`, hàm đã có sẵn nhưng chưa từng được gọi), sắp theo ngày mới nhất. Bỏ khái niệm "xác nhận trực tiếp với chủ nhà" (mock cũ tự bịa, hệ thống thật không có luồng này). Nút liên hệ đổi thành "Nhắn Zalo" (mở `ContactCollaboratorModal`), modal chi tiết hợp đồng không còn hiển thị tên/SĐT chủ nhà (khớp chính sách chung — xem đợt dưới).
- `src/components/common/ContactCollaboratorModal.tsx`: thêm trạng thái rỗng khi toà nhà chưa có cộng tác viên nào.

**Đã kiểm tra:** `npm run build` sạch, đối chiếu i18n vi/en. Test sống qua trình duyệt thật: đăng nhập tài khoản có booking thật → hiện đúng thẻ "Đã thanh toán"/"Đã hoàn tất", bấm "Nhắn Zalo" mở đúng modal liên hệ cộng tác viên của toà nhà đó, bấm "Xem Đơn Đặt Phòng" điều hướng đúng sang trang trạng thái thanh toán.

---

## 2026-08-20 — Ẩn hoàn toàn thông tin liên hệ chủ nhà, chuyển sang liên hệ Zalo qua cộng tác viên

**Vì sao:** Người thuê không được liên hệ trực tiếp chủ nhà — mọi liên hệ đi qua cộng tác viên phụ trách toà nhà, kênh chính thức là Zalo (backend đã chặn từ trước, nhưng frontend còn sót code chết/mock hiển thị tên-SĐT chủ nhà nếu API từng đổi lại).

**Thay đổi:**
- `src/pages/RoomDetail.tsx`, `src/pages/TenantAppointments.tsx`: xoá hẳn khối "Chủ nhà"/nút gọi điện (`tel:`) — dữ liệu vốn luôn rỗng vì backend không trả `houseOwner` cho endpoint công khai/người thuê, nhưng vẫn dọn sạch để tránh sống lại nếu API đổi.
- `src/services/roomApi.ts`, `src/services/appointmentApi.ts`, `src/types/index.ts`, `src/data/mockData.ts`: bỏ hẳn field `landlordName`/`landlordPhone`/`landlordAvatar`/`houseOwner` khỏi type + mapping + mock data.
- `src/services/collaboratorApi.ts`: `HouseCollaborator` thêm `zaloLink` — kênh liên lạc chính thức admin cài đặt cho từng cộng tác viên.
- `src/components/common/ContactCollaboratorModal.tsx`: nút "Gọi điện" (`tel:`) đổi thành "Nhắn Zalo" (mở `zaloLink`), tự ẩn nếu admin chưa cài đặt link.
- Sửa vài chuỗi text còn nhắc "chủ nhà" như điểm liên hệ (`roomDetail.contactOwner`, `roomDetail.trustNote1`, `bookingPayment.paidText`) sang trung lập/cộng tác viên.

**Đã kiểm tra:** `npm run build` sạch, đối chiếu i18n vi/en.

---

## 2026-08-20 — Chuyển token sang cookie httpOnly, gắn CSRF

**Vì sao:** Backend (bff-for-pimi) vừa chuyển sang set token qua cookie `httpOnly` thay vì trả JSON để FE tự lưu `localStorage`. FE phải ngưng đọc/ghi token thủ công và để trình duyệt tự gửi cookie kèm request.

**Thay đổi:**
- `src/services/axiosClient.ts`: thêm `withCredentials: true`; bỏ hẳn việc tự gắn header `Authorization` (trình duyệt tự gửi cookie); gắn header `X-CSRF-Token` (đọc từ cookie `pimi_csrf`, không httpOnly) cho mọi request đổi dữ liệu — bắt buộc từ khi cookie xác thực bật `SameSite=None`.
- `src/context/AuthContext.tsx`: bỏ hẳn việc đọc/ghi `accessToken`/`refreshToken` vào `localStorage` (token giờ chỉ nằm trong cookie httpOnly); `token` bỏ khỏi context type (không còn nơi nào đọc được giá trị thật, chỉ 1 nơi dùng trước đây là socket — xem dưới); `logout()` giờ gọi thêm `POST /v1/auth/logout` (best-effort) để backend xoá cookie — trước đây chỉ xoá `localStorage` phía FE, với cookie httpOnly thì làm vậy KHÔNG đăng xuất thật.
- `src/context/SocketContext.tsx`: kết nối socket.io không còn tự gắn `auth.token` (đọc từ context, giờ luôn rỗng vì token httpOnly) — chuyển sang `withCredentials: true`, để cookie tự gửi kèm trong request handshake; kích hoạt kết nối theo `isAuthenticated` thay vì theo token.
- `src/utils/cookies.ts` (mới): helper đọc cookie `pimi_csrf`.
- Backend liên quan (bff-for-pimi, cùng đợt): `NotificationsGateway` giờ cũng đọc token từ cookie `pimi_at` trong handshake socket.io nếu không có `auth.token`/header.

**Đã kiểm tra:** `npx tsc -b` + `npm run build` sạch.

---

## 2026-08-20 — Audit bảo mật: bỏ log có thể lộ mật khẩu khi lỗi mạng

**Vì sao:** Rà soát bảo mật phát hiện `console.warn` ở luồng đăng nhập/đăng ký in nguyên object lỗi — khi request thất bại do lỗi mạng (không có response từ server), interceptor axios trả thẳng lỗi axios gốc, mà `err.config.data` chính là body request gốc chứa **mật khẩu dạng plaintext** vừa nhập.

**Thay đổi:** `src/context/AuthContext.tsx` — 2 chỗ `console.warn` (đăng nhập, đăng ký) chỉ log `{code, message}` thay vì nguyên `err`.

**Đã kiểm tra:** `tsc -b` sạch.

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
