# Development Log — Web-Pimi-for-user

Nhật ký các đợt phát triển tính năng (mới nhất ở trên cùng). Mỗi mục tương ứng với 1 (hoặc 1 nhóm) commit liên quan.

---

## 2026-08-31 — UI/UX Giai đoạn 3: sticky CTA đặt lịch xem phòng + thu gọn bộ lọc trên mobile

**Vì sao:** Tiếp tục audit UI/UX (sau Giai đoạn 1 `62f6ade` và Giai đoạn 2 cùng ngày) phát hiện 2 vấn đề riêng cho mobile: (1) `RoomDetail.tsx` dùng `grid grid-cols-1 lg:grid-cols-3` — dưới `lg`, sidebar chứa giá + nút "Đặt lịch xem phòng" nằm SAU toàn bộ gallery/thông số/tiện ích/mô tả/bản đồ khi xếp chồng 1 cột, người dùng phải cuộn rất xa mới thấy nút hành động chính; (2) `RoomFilterBar.tsx` luôn hiển thị TOÀN BỘ khối lọc (toggle ngắn/dài hạn, tìm kiếm, 4 mục lọc, GPS/bán kính, dải giá, 10 chip tiện ích, nút reset) ở mọi kích thước màn hình — trên mobile khối này đẩy danh sách phòng xuống rất xa trước khi người dùng thấy kết quả nào.

**Thay đổi:**
- `src/pages/RoomDetail.tsx`: tách khối nút hành động chính trong sidebar (biến `canBookShortTerm`/`activeAppointment`/mặc định "Đặt lịch xem phòng" — nguyên vẹn 4 nhánh JSX cũ, không đổi handler/logic) thành 1 biến `primaryActionButton` dùng chung. Thêm thanh CTA `fixed bottom-0 left-0 right-0 z-40` (`lg:hidden`, ẩn hẳn từ `lg` trở lên vì sidebar gốc đã đủ tốt) chứa giá phòng rút gọn (`formatPrice(room.price)`) + `{primaryActionButton}` — luôn hiển thị bất kể vị trí cuộn trên mobile (chấp nhận trùng 2 CTA khi đã cuộn tới sidebar gốc, quyết định đơn giản/ít rủi ro theo đúng yêu cầu, không làm logic ẩn/hiện theo scroll). Thêm `pb-28` (chỉ áp dụng dưới `lg`, `lg:pb-8` giữ nguyên như cũ) vào container chính để nội dung cuối trang (đánh giá, phòng tương tự) không bị thanh sticky che khuất; padding dưới thanh sticky dùng `pb-[calc(0.75rem+env(safe-area-inset-bottom))]` cho các máy có notch/home-indicator.
- `src/components/filter/RoomFilterBar.tsx`: tách khối lọc nâng cao (4 mục lọc dạng grid, GPS/bán kính, dải giá, chip tiện ích, nút reset — nguyên vẹn JSX gốc, không đổi logic) thành biến `advancedFilters` dùng chung ở 2 nơi — inline `hidden lg:block` (>= lg, hiện đầy đủ y hệt cũ) và bên trong modal full-screen mobile (< lg). Dưới `lg` chỉ hiện mặc định: toggle ngắn/dài hạn + ô tìm kiếm + nút "Bộ lọc" (badge số đếm filter đang áp dụng: quận/huyện, loại phòng, gác xép, đề cử, dải giá, số tiện ích đã chọn, GPS — cộng dồn). Modal có header (tiêu đề + nút đóng `X`), thân cuộn (`overflow-y-auto`) chứa `advancedFilters`, và footer 2 nút "Đặt lại bộ lọc" (gọi `onReset`, không tự đóng modal — cho phép xem ngay kết quả reset) và "Áp dụng" (đóng modal — filter đã áp dụng ngay lập tức qua `onChange` như cũ, không cần staged state). **Bug phát hiện lúc kiểm thử trực quan và đã sửa trong cùng đợt:** modal ban đầu dùng `fixed inset-0` là con trực tiếp của panel ngoài cùng có class `glass-panel` (CSS `backdrop-filter: blur(12px)`) — theo spec CSS, `backdrop-filter` trên ancestor tạo containing block mới cho `position: fixed`, khiến modal bị giam trong khung panel thay vì phủ toàn màn hình. Sửa bằng `createPortal(..., document.body)` (từ `react-dom`) để modal render thẳng vào `<body>`, thoát khỏi containing block đó.
- `src/i18n/locales/{vi,en}/common.json`: thêm 2 khoá `roomFilterBar.moreFiltersButton` ("Bộ lọc"/"Filters") và `roomFilterBar.applyFiltersButton` ("Áp dụng"/"Apply").

**Breakpoint đã chọn:** `lg` (1024px) cho cả 2 việc — nhất quán với breakpoint gốc `RoomDetail.tsx` (`lg:grid-cols-3`) và `RoomFilterBar.tsx` (`lg:grid-cols-4` ở khối lọc chính), tránh có 2 điểm gãy khác nhau trong cùng 1 trang.

**Đã kiểm tra:** `npm run build` (`tsc -b && vite build && npm run sitemap`) sạch — bước sitemap tự fallback vì backend cục bộ không chạy trong môi trường này (không chặn build). `npm run lint` (oxlint) không phát sinh warning mới ở 2 file sửa. Chạy `npm run dev`, dùng browser tool `resize_window` (preset mobile, 375×812) xác nhận trực quan trên `/rooms`: toggle + tìm kiếm + nút "Bộ lọc" hiện đúng, khối lọc nâng cao ẩn hoàn toàn; bấm "Bộ lọc" mở modal phủ đúng toàn màn hình (sau khi sửa bug containing-block ở trên), chọn 1 dải giá trong modal cập nhật state đúng, bấm "Áp dụng" đóng modal và nút "Bộ lọc" hiện badge "1" đúng số filter đang áp dụng. Resize về desktop (1440×900) xác nhận khối lọc nâng cao vẫn hiện đầy đủ inline y hệt trước khi sửa, không có nút "Bộ lọc"/modal. Riêng thanh CTA sticky ở `RoomDetail.tsx` KHÔNG quan sát trực quan được với dữ liệu phòng thật trong phiên này vì backend cục bộ (`localhost:3333`) không chạy sẵn nên trang luôn rơi vào nhánh "Room not found" (return sớm trước đoạn JSX có thanh sticky) — đã xác nhận qua đọc lại code: `primaryActionButton` là nguyên văn JSX 4 nhánh đã hoạt động sẵn trong sidebar (chỉ đổi chỗ), và `tsc -b`/`vite build` không phát hiện lỗi type/cú pháp ở nhánh JSX này.

---

## 2026-08-31 — UI/UX Giai đoạn 2: Error Boundary toàn cục + tăng vùng chạm tối thiểu 44px

**Vì sao:** Tiếp tục audit UI/UX (sau Giai đoạn 1 cùng ngày, commit `62f6ade`) phát hiện 2 vấn đề: (1) `App.tsx` không có `ErrorBoundary`/`componentDidCatch` nào — 1 lỗi runtime bất kỳ (throw trong render, lifecycle...) làm React unmount toàn cây, người dùng thấy màn trắng không có lối thoát ngoài tự bấm reload trình duyệt; (2) 2 vùng chạm dưới ngưỡng khuyến nghị 44px, khó bấm trên di động — nút yêu thích (Heart) trên `RoomCard` chỉ 36px (`w-9 h-9`), nút số trang trên `Pagination` chỉ 32px (`min-w-[32px] h-8`), nút prev/next chỉ ~32px tổng (`p-2` bọc icon 16px).

**Thay đổi:**
- `src/components/common/ErrorBoundary.tsx` (mới): class component (bắt buộc — `getDerivedStateFromError`/`componentDidCatch` chưa có hook tương đương), hiện khối lỗi thân thiện tiếng Việt (icon `AlertTriangle`, tiêu đề "Đã có lỗi xảy ra") thay màn trắng, cùng style `glass-card`/`gradient-bg`/font `Outfit` (`font-heading`) đã dùng khắp app (mirror `EmptyState.tsx`). 2 nút: "Thử lại" gọi `window.location.reload()`, "Về trang chủ" gọi `window.location.href = '/'` — dùng điều hướng cứng thay vì `useNavigate`/`Link` vì đây là class component đứng trong cây đang crash, cần trang tải lại sạch thay vì chỉ đổi route trên React tree đã lỗi.
- `src/App.tsx`: bọc `ErrorBoundary` quanh `<Suspense>`/`<Routes>` bên trong `<main>` (ngoài `Suspense`, để lỗi ở bất kỳ route lazy-load nào cũng được bắt), không đổi gì khác trong cây provider (`QueryClientProvider`/`AuthProvider`/...).
- `src/components/common/RoomCard.tsx` (dòng ~130): nút yêu thích `w-9 h-9` (36px) → `w-11 h-11` (44px). Vị trí `absolute` dịch từ `bottom-3 right-3` sang `bottom-2 right-2` để tâm nút vẫn cách đều mép ảnh như trước, không đè lệch lên badge giá ở góc trái đối diện.
- `src/components/common/Pagination.tsx`: nút số trang `min-w-[32px] h-8` → `min-w-11 h-11`; nút prev/next (`p-2` bọc icon) → `w-11 h-11 flex items-center justify-center`. Giảm `gap` giữa các nút trong khối từ `gap-1.5` xuống `gap-1` để bù phần rộng thêm, tránh khối pagination tràn ngang trên màn hình hẹp khi nhiều nút (ellipsis 2 đầu).

**Đã kiểm tra:** `npm run build` (`tsc -b && vite build && npm run sitemap`) sạch — bước sitemap tự fallback về sitemap chỉ gồm trang tĩnh vì backend cục bộ không chạy trong môi trường này (không chặn build, đúng hành vi thiết kế sẵn của script). Chạy nhanh `npm run dev`, xác nhận `/rooms` vẫn render đúng bố cục (không có backend cục bộ nên danh sách trống, không quan sát trực quan được Pagination/nút yêu thích với dữ liệu thật trong phiên này) — kiểm tra chính dựa trên đọc lại JSX/class sau khi sửa.

---

## 2026-08-31 — UI/UX Giai đoạn 1: phân biệt lỗi mạng/API với "không tìm thấy kết quả" ở danh sách phòng

**Vì sao:** Kết quả audit UI/UX đọc code phát hiện `roomApi.ts` (`fetchPublicFeed`) bắt MỌI lỗi gọi API — mất mạng, lỗi server 500, timeout... — và trả về y hệt kết quả "không có phòng nào khớp" (`{ rooms: [], totalItems: 0, totalPages: 0 }`). `RoomList.tsx` không có cách nào phân biệt 2 trường hợp này, nên khi mất mạng/backend sập, người dùng thấy đúng khối "Không tìm thấy phòng phù hợp, thử đổi bộ lọc" — sai bản chất, khiến người dùng loay hoay đổi bộ lọc thay vì thử lại kết nối.

**Thay đổi:**
- `src/services/roomApi.ts`: **không** đổi `fetchPublicFeed` sang throw thẳng — hàm này còn được gọi gián tiếp qua `roomApi.getRooms()`/`getRoomsPaginated()` ở `Home.tsx` (phòng nổi bật) và `RoomDetail.tsx` (phòng tương tự), cả 2 nơi đều `.then()` không kèm `.catch()` riêng, throw thẳng ở tầng này sẽ tạo unhandled rejection ở 2 trang đó (ngoài phạm vi Giai đoạn 1). Thay vào đó, thêm field `hadError?: boolean` vào `PublicFeedResult` — `true` khi request thất bại, giữ nguyên hành vi trả mảng rỗng cho caller cũ (không đổi gì ở `Home.tsx`/`RoomDetail.tsx`, vì `getRooms()` chỉ trả `result.rooms`, không lộ field mới).
- `src/pages/RoomList.tsx`: chuyển việc gọi `getRoomsPaginated` từ `useEffect` + `useState` tay sang `useQuery` (React Query đã setup ở `App.tsx` từ trước nhưng chưa dùng ở trang này — đúng như mục "chưa làm" ghi ở log Giai đoạn 2 hiệu suất). Trong `queryFn`, tự `throw` khi `result.hadError` để react-query bắt đúng qua `isError`/`refetch` (giới hạn hành vi throw chỉ trong phạm vi trang này). Khi `isError`, hiện 1 khối `EmptyState` riêng — cùng cấu trúc/kích thước với khối "không tìm thấy" cũ nhưng đổi icon (`WifiOff`), tone màu (`rose` thay vì `amber`), nội dung ("Không tải được danh sách phòng...") và nút hành động gọi `refetch()` thay vì reset bộ lọc.
- `src/i18n/locales/{vi,en}/common.json`: thêm 3 khoá `roomList.errorTitle`/`errorDesc`/`retryButton`.

**Đã kiểm tra:** `npm run build` (`tsc -b && vite build && npm run sitemap`) sạch. Live-test bằng `npm run dev`: backend cục bộ (`localhost:3333`) vốn không chạy sẵn trong môi trường này nên `/rooms` tự nhiên rơi vào nhánh lỗi thật (không cần giả lập) — xác nhận hiện đúng khối "Couldn't load rooms" (icon wifi-off, tone đỏ) thay vì khối "không tìm thấy phòng", và bấm "Try again" gọi lại `refetch()` đúng, không kẹt loading, không crash.

---

## 2026-08-30 — Tối ưu hiệu suất Giai đoạn 2: dùng ảnh thumbnail cho card lưới phòng

**Vì sao:** Backend vừa thêm tính năng tự sinh bản resize ~480px lúc upload ảnh (`sharp`, xem dev log bff-for-pimi cùng ngày) — nối ảnh thẻ phòng trong lưới/carousel vào bản thumbnail đó thay vì luôn tải ảnh gốc full-res.

**Thay đổi:**
- `src/types/index.ts`: thêm `imageThumbnails: string[]` song song với `images` trên type `Room`.
- `src/services/roomApi.ts` (`mapBackendRoomToRoom`): map thêm `imageThumbnails` ưu tiên `image.thumbnailLink`, rơi về `image.link` khi ảnh chưa có thumbnail (upload trước khi có tính năng này).
- `src/components/common/RoomCard.tsx`: ảnh thẻ dùng `room.imageThumbnails[0]` thay vì `room.images[0]`.
- `src/data/mockData.ts`: 6 phòng demo (không dùng ở đâu trong code — có thể là data sót lại từ lúc scaffold, chưa xoá vì ngoài phạm vi đợt này) cần thêm field `imageThumbnails` để khớp type `Room`, gán tạm bằng đúng `images` (ảnh Unsplash tĩnh, không có khái niệm thumbnail thật).

**Đã kiểm tra:** `npx tsc -b && vite build` sạch (bao gồm cả bước gọi API thật lúc build sitemap, xác nhận local backend đang chạy phản hồi đúng).

---

## 2026-08-30 — Tối ưu hiệu suất Giai đoạn 1: code-split theo route, debounce tìm kiếm, lazy ảnh

**Vì sao:** Rà soát hiệu suất phát hiện app public (traffic cao nhất, ảnh hưởng SEO/LCP trực tiếp) build thành 1 bundle 935KB/268KB-gzip duy nhất — khách vãng lai ghé "/" phải tải cả code booking/profile/admin-tool trước khi thấy phòng nào. Ô tìm kiếm cũng gọi API mỗi lần gõ phím (không debounce), và banner/gallery ảnh không lazy-load.

**Thay đổi:**
- `src/App.tsx`: toàn bộ ~20 trang chuyển từ import tĩnh sang `React.lazy` + `<Suspense>`, mỗi route giờ là 1 chunk riêng chỉ tải khi điều hướng tới.
- `src/components/common/PageLoadingFallback.tsx` (mới): spinner fallback cho `Suspense`, mirror style đã dùng ở `BookingHistory.tsx`/`VerifyEmail.tsx`.
- `src/components/filter/RoomFilterBar.tsx`: ô tìm kiếm tách state cục bộ (`keywordInput`) khỏi `filters.keyword` — gõ vẫn mượt ngay lập tức, chỉ đẩy lên `onChange` (kích hoạt gọi API ở `RoomList.tsx`) sau khi ngừng gõ 350ms. Dùng `filtersRef`/`onChangeRef` để tránh bug đè mất các filter khác (quận/huyện, giá...) nếu người dùng đổi chúng trong lúc timer debounce còn đang chờ.
- `src/components/home/BannerSlider.tsx`: chỉ slide đầu tải `eager`, các slide còn lại `loading="lazy"` + `fetchPriority` ưu tiên đúng slide đang active — trước đây mọi slide (kể cả đang ẩn opacity-0) đều tải full ảnh cùng lúc, tranh băng thông với ảnh LCP thật.
- `src/pages/RoomDetail.tsx`: ảnh gallery chính giữ `eager`+`fetchPriority="high"` (là LCP của trang), các ảnh thumbnail chuyển `loading="lazy"`.

**Đã kiểm tra:** `npx tsc --noEmit` sạch. `npm run build`: bundle chính giảm từ 935KB → **386KB** (gzip 268KB → **120KB**) — `vietmapService` (thư viện bản đồ) tự động tách thành chunk riêng nhờ code-splitting theo route (trước đây bị cuốn vào bundle chính vì không có điểm chia nào).

**Chưa làm (Giai đoạn 2/3):** ảnh vẫn chưa qua CDN resize/srcset (ảnh gốc); Home/RoomList vẫn dùng `useEffect` tay thay vì `useQuery` (React Query đã setup nhưng chưa dùng ở 2 trang này); RoomDetail/Home vẫn fetch 100 phòng chỉ để lọc lấy vài phòng gợi ý/nổi bật; Firebase Messaging vẫn load cho khách ẩn danh.

---

## 2026-08-28 — Đồng bộ mã lỗi mới cho việc chặn đăng nhập ngoài phạm vi + sửa dịch sai 000049

**Vì sao:** Đi kèm thay đổi backend chặn `PIMI_ADMIN`/`HOUSE_PARTNER` chỉ được đăng nhập ở trang quản trị (xem dev log `bff-for-pimi` cùng ngày) — web này cần bản dịch cho 2 mã lỗi mới (000196/000197) để hiện đúng tiếng Việt nếu 1 tài khoản admin/cộng tác viên thử đăng nhập nhầm ở đây.

Lúc sửa phát hiện thêm mã `000049` (`src/i18n/locales/{vi,en}/errors.json`) bị dịch sai thành "Không tìm thấy người dùng"/"User not found" (trùng nghĩa `000050`), trong khi ý nghĩa thật của BE là "tài khoản không được phép đăng nhập với role yêu cầu ở app này" — sửa lại cho đúng.

**Đã kiểm tra:** JSON hợp lệ (parse bằng Python). `Login.tsx` của web này đã gọi đúng `getApiErrorMessage(err)` từ trước (không cần sửa code, chỉ cần bản dịch).

---

## 2026-08-25 — Sửa vỡ layout Navbar ở khoảng 768-1024px

**Vì sao:** Người dùng báo màn đăng nhập vỡ layout ở khoảng 770-1000px (nút "Đăng ký" hình vuông tím bị đẩy tràn ra ngoài màn hình). Root cause: menu điều hướng desktop (`nav`, 4 mục "Tìm phòng trọ/Tin tức/Về Pimi/Hỏi đáp") bật ở breakpoint `md` (768px, `hidden md:flex`), đồng thời nút mở menu mobile ẩn CÙNG breakpoint đó (`md:hidden`) — nhưng tổng bề rộng logo + menu 4 mục + khối đăng nhập/đăng ký thực tế cần tới `lg` (1024px) mới đủ chỗ trên 1 hàng. Khoảng 768-1024px vì vậy bị kẹt giữa 2 layout: menu desktop đã hiện nhưng chưa đủ chỗ, nút mobile-menu đã ẩn nên không có gì thay thế.

**Thay đổi (`src/components/common/Navbar.tsx`):** Đổi breakpoint của nav menu, nút mobile-menu, và mobile drawer từ `md` sang `lg` — khớp nhau cả 3, không còn khoảng hở giữa 2 layout.

**Đã kiểm tra:** `npx tsc --noEmit` sạch. Live trên trình duyệt: resize 850px (đúng khoảng bị báo lỗi) — header gọn gàng (logo + bell + avatar + hamburger), không còn gì tràn; resize 1100px (≥1024px) — menu desktop đầy đủ hiện đúng, vẫn vừa khít không tràn.

---

## 2026-08-25 — Sửa CSRF token luôn thiếu do đọc cookie cross-domain

**Vì sao:** Phát hiện khi điều tra "Missing or invalid CSRF token" bên ADMIN-Pimi — cùng pattern `getCookie(CSRF_COOKIE_NAME)` đọc `document.cookie`, nhưng web này deploy khác domain hoàn toàn với API (cross-site), nên JS không bao giờ đọc được cookie CSRF do BE set (dù không httpOnly) — `X-CSRF-Token` không bao giờ được gắn, mọi request ghi dữ liệu (POST/PUT/DELETE) bị chặn 1 khi có phiên đăng nhập. Web này chưa có cơ chế tự refresh token (không có handler `handleRefreshToken`), nên chỉ cần vá điểm login.

**Thay đổi (`src/services/axiosClient.ts`, `src/context/AuthContext.tsx`):** Bỏ `getCookie(CSRF_COOKIE_NAME)`, lưu CSRF token vào biến nhớ (`csrfTokenMemory`) — lấy từ response body lúc đăng nhập (backend giờ trả `csrfToken` trong JSON body), tự gọi `GET /v1/auth/csrf-token` (endpoint mới bên `bff-for-pimi`) khi thiếu (lần đầu load hoặc sau reload trang).

**Đã kiểm tra:** `npx tsc --noEmit` sạch. Xem dev log bên ADMIN-Pimi/bff-for-pimi để biết đầy đủ quá trình điều tra + verify backend.

---

## 2026-08-25 — Sửa mã lỗi 000065 dịch sai thành "SĐT không hợp lệ"

**Vì sao:** Phát hiện khi điều tra báo cáo "đăng nhập bằng email nhưng báo lỗi SĐT" bên phongtroapp — `errors.json` map `000065` → "Số điện thoại Việt Nam không hợp lệ", nhưng bên `bff-for-pimi` mã này giờ là `ERR_MSG_INTERNAL_SERVER_ERROR` (fallback chung cho lỗi server không xác định, đã đổi ý nghĩa từ lúc nào đó, client chưa cập nhật). Xác nhận cả 4 app (kể cả web này) đều dính y hệt.

**Thay đổi:** `src/i18n/locales/{vi,en}/errors.json` — `000065` đổi thành thông báo lỗi server chung, khớp đồng bộ với 3 app còn lại.

**Đã kiểm tra:** JSON hợp lệ (`python3 -m json.tool`). Xem dev log bên phongtroapp để biết đầy đủ quá trình điều tra.

---

## 2026-08-25 — Sửa vỡ layout khi thông báo có nội dung dài

**Vì sao:** Người dùng báo thông báo dài làm "UI không đáp ứng được" trên cả 3 trang web. Điều tra sống (seed thông báo thật ~800 ký tự kèm 1 chuỗi liên tục không khoảng trắng bên `bff-for-pimi`, kiểm tra trên Web-Pimi-for-owner trước — cấu trúc component giống hệt bên này) cho thấy: nội dung không có `overflow-wrap: break-word` (Tailwind `break-words`) nên chuỗi dài không khoảng trắng làm `<p>` tràn ngang, kéo theo tràn ngang toàn trang. `Navbar.tsx` và `Notifications.tsx` dùng đúng cấu trúc class y hệt (`line-clamp-2`/`truncate` không kèm `break-words`) nên áp cùng cách sửa mà không cần seed dữ liệu riêng.

**Thay đổi:**
- `src/pages/Notifications.tsx`: thêm `break-words` vào đoạn nội dung; thêm `min-w-0` vào wrapper + tiêu đề `truncate`.
- `src/components/common/Navbar.tsx`: thêm `break-words` vào đoạn nội dung trong dropdown chuông thông báo; thêm `min-w-0` vào tiêu đề `truncate`.

**Đã kiểm tra:** Đã verify cơ chế tràn ngang + cách sửa trực tiếp trên Web-Pimi-for-owner (xem dev log bên đó) bằng đo `scrollWidth`/`clientWidth` trước/sau qua trình duyệt thật. Bên này áp cùng thay đổi do cấu trúc JSX/class giống hệt (đã đối chiếu qua grep) — `npx tsc --noEmit` sạch, chưa test lại sống qua UI của web này (không có gì khác biệt về logic để cần test riêng).

---

## 2026-08-25 — Đặt lịch xem phòng: bỏ hiển thị giờ kết thúc, thêm ghi chú thời lượng

**Vì sao:** Nối UI cho thay đổi bên bff-for-pimi — khung giờ chủ nhà đề xuất giờ chỉ còn giờ bắt đầu (`endTime` sẽ là `null`), người thuê cần được báo trước buổi xem phòng dự kiến mất khoảng 15-30 phút thay vì thấy khung giờ chính xác.

**Thay đổi:**
- `src/pages/TenantAppointments.tsx`: bỏ hiển thị `endTime` ở khung giờ đã chốt lẫn danh sách khung giờ chủ nhà đề xuất; thêm dòng ghi chú thời lượng ngay trên danh sách khung giờ để chọn.
- `src/services/appointmentApi.ts`: `TimeSlot.endTime` chuyển optional/nullable.
- `src/i18n/locales/{vi,en}/common.json`: thêm `tenantAppointments.durationHint`, đối chiếu vi/en đủ.

**Đã kiểm tra:** `npx tsc --noEmit` sạch. Logic khung giờ đã verify ở tầng backend (xem dev log bff-for-pimi) — chưa test sống qua trình duyệt (cần tài khoản người thuê thao tác trên 1 lịch hẹn thật).

---

## 2026-08-24 — Gắn header `X-Client-App` — sửa lỗi đăng nhập đè cookie với 2 web kia

**Vì sao:** bff-for-pimi tách tên cookie theo từng web (`pimi_at_user` thay vì `pimi_at` chung) để 3 web (người thuê/chủ nhà/admin) không còn ghi đè cookie đăng nhập của nhau khi mở cùng lúc trên 1 trình duyệt — xem DEVELOPMENT_LOG.md bên `bff-for-pimi` để hiểu đầy đủ nguyên nhân. Web này cần tự gắn header định danh để backend biết đọc/ghi đúng cookie `..._user`.

**Thay đổi:**
- `src/services/axiosClient.ts`: thêm hằng số `CLIENT_APP = 'user'`, gắn header `X-Client-App` mặc định cho mọi request; đổi cookie CSRF đọc từ `pimi_csrf` sang `pimi_csrf_user`.
- `src/context/SocketContext.tsx`: thêm `auth: { clientApp: 'user' }` khi kết nối socket (không dùng header tuỳ chỉnh được vì đây là upgrade request thuần WebSocket).

**Ảnh hưởng:** phiên đăng nhập cũ (cookie `pimi_at` không hậu tố) sẽ không còn hợp lệ sau khi deploy — cần đăng nhập lại 1 lần.

**Đã kiểm tra:** `npx tsc --noEmit` sạch. Cơ chế tách cookie đã verify ở tầng backend (xem dev log bff-for-pimi) bằng JWT mint trực tiếp, không qua UI — chưa test lại round-trip đăng nhập thật qua UI của web này (cần người dùng tự đăng nhập, không tự động hoá được bước nhập mật khẩu).

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
