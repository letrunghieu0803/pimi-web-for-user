# Development Log — Web-Pimi-for-user

Nhật ký các đợt phát triển tính năng (mới nhất ở trên cùng). Mỗi mục tương ứng với 1 (hoặc 1 nhóm) commit liên quan.

---

## 2026-09-22 — Thêm section Nhà Ngắn Hạn / Nhà Dài Hạn ở trang chủ

**Vì sao:** Chủ nhà muốn trang chủ có thêm 2 section riêng cho nhà ngắn hạn và dài hạn, kèm nút "Xem thêm" dẫn tới trang tìm phòng đã lọc sẵn đúng loại hình. Trong lúc kiểm tra live phát hiện section "Phòng Trọ Nổi Bật" sẵn có không tự ẩn khi không có phòng nào — hiện tiêu đề trơ trọi không có nội dung bên dưới (dev DB hiện không có phòng SHORT_TERM nào), chủ nhà yêu cầu áp dụng luôn quy tắc "ẩn cả tiêu đề khi không có dữ liệu" cho mọi section liên quan.

**Thay đổi:** `Home.tsx` — thêm component `RentalTermSection` dùng chung cho 2 section mới (fetch theo `rentalTermType`, header + lưới phòng + nút "Xem thêm" trỏ `/rooms?rentalTermType=...`), tự ẩn HẲN section (kể cả tiêu đề) khi tải xong mà không có phòng nào — áp dụng cùng quy tắc cho section "Phòng Trọ Nổi Bật" sẵn có (trước đây luôn hiện tiêu đề dù rỗng).

**Đã kiểm tra:** `npx tsc -p tsconfig.app.json --noEmit` sạch. Live-test qua Browser pane với dữ liệu thật: section "Nhà Ở Dài Hạn" hiện đúng 3 phòng, nút "Xem thêm" điều hướng đúng `/rooms?rentalTermType=LONG_TERM` với filter tab tương ứng được chọn sẵn; section "Nhà Ở Ngắn Hạn" và "Phòng Trọ Nổi Bật" đều tự ẩn hoàn toàn (không có phòng SHORT_TERM nào trong dev DB) — xác nhận đúng bằng cách đọc lại nội dung trang, không còn tiêu đề trơ trọi.

---

## 2026-09-22 — Bỏ điểm đánh giá giả trên thẻ phòng, thêm thông tin nhận khách nước ngoài

**Vì sao:** Mọi thẻ phòng đều hiện badge "80đ" như 1 điểm đánh giá — kiểm tra `roomApi.ts` phát hiện `ratingScore` luôn mặc định = 80 ở phía FE khi backend không trả (thực tế BE có trả nhưng đây là điểm nội bộ dùng để sắp xếp thứ tự hiển thị, không phải đánh giá thật của người dùng), gây hiểu nhầm cho người thuê. Đồng thời cần bổ sung thông tin phòng có nhận khách nước ngoài hay không — dữ liệu này đã có sẵn ở backend (`RentHouse.acceptForeignTenants`, chủ nhà tự cấu hình) nhưng chưa được hiển thị ở app người thuê.

**Thay đổi:**
- `RoomCard.tsx` — bỏ hẳn badge điểm "80đ" (icon Star + `room.ratingScore`).
- `types/index.ts` + `roomApi.ts` — bỏ field `ratingScore` khỏi kiểu `Room`, thêm `acceptForeignTenants` map từ `item.rentHouse.acceptForeignTenants`.
- `RoomCard.tsx` + `RoomDetail.tsx` — thêm 1 dòng (icon địa cầu) hiện "Nhận khách nước ngoài"/"Không nhận khách nước ngoài" ngay dưới địa chỉ, màu xanh lá/xám tuỳ giá trị. Giữ nguyên phần "Đánh giá" (RoomReviews.tsx, sao thật do người thuê viết) theo yêu cầu — không thuộc phạm vi bỏ điểm giả này.

**Đã kiểm tra:** `npx tsc -p tsconfig.app.json --noEmit` sạch. Live-test qua Browser pane với dữ liệu thật (3 phòng cùng 1 nhà có `acceptForeignTenants: true`): xác nhận không còn badge điểm trên cả 3 thẻ, dòng "Accepts foreign tenants" hiện đúng trên thẻ lẫn trang chi tiết, chuyển ngôn ngữ sang tiếng Việt hiện đúng "Nhận khách nước ngoài".

---

## 2026-09-22 — Sửa validate mật khẩu mới thiếu đủ 4 điều kiện khi quên mật khẩu

**Vì sao:** Chủ nhà báo lỗi khi đổi mật khẩu mới ở luồng quên mật khẩu. Đối chiếu backend (`@IsStrongPassword()` mặc định) phát hiện FE trước đây chỉ kiểm tra độ dài, không kiểm tra chữ hoa/thường/số/ký tự đặc biệt — người dùng nhập mật khẩu qua được FE nhưng vẫn bị backend từ chối.

**Thay đổi:** `ForgotPassword.tsx` — `handleResetPassword` thêm đủ 4 điều kiện kiểm tra (trước đó không có điều kiện nào ngoài độ dài), mỗi điều kiện có toast riêng.

**Đã kiểm tra:** Live-test qua Browser pane chung với đợt sửa tương tự ở `bff-for-pimi`/`Web-Pimi-for-owner` cùng ngày — xem chi tiết kịch bản test ở đó.

---

## 2026-09-19 — Bấm vào thông báo điều hướng thẳng tới trang chi tiết liên quan

**Vì sao:** Người thuê yêu cầu (kèm ảnh chụp trang Thông báo): "khi bấm vào thông báo liên quan tới phần nào thì sẽ dẫn link luôn tới trang đó để xem" — ví dụ minh hoạ là thông báo lịch hẹn xem phòng nên bấm vào phải tới chi tiết lịch hẹn đó. Rà lại code: `Notifications.tsx` (trang danh sách đầy đủ) và `Navbar.tsx` (dropdown chuông thông báo) trước đây bấm vào bất kỳ thông báo nào cũng chỉ đánh dấu đã đọc — dropdown còn tệ hơn, luôn điều hướng cứng về `/notifications` bất kể nội dung.

**Thay đổi:** `src/services/notificationApi.ts` — thêm `getNotificationLink(item)` dùng chung cho cả 2 nơi, suy ra đường dẫn từ `type` + `metadata` của thông báo (khớp đúng shape backend luôn gửi kèm — xem các lệnh gọi `notificationService.createNotification` ở `bff-for-pimi`): `APPOINTMENT` → `/appointments?highlight=<appointmentId>`, `NEWS` → `/news/<articleId>`, `BOOKING` → `/bookings`; các type chưa có trang chi tiết riêng ở web này (`INVOICE`, `ROOM_REPORT_*`...) trả về `null`, giữ nguyên hành vi cũ (chỉ đánh dấu đã đọc). `Notifications.tsx`/`Navbar.tsx` gọi `navigate()` tới link này sau khi đánh dấu đã đọc.

`src/pages/TenantAppointments.tsx` — đọc `?highlight=<id>` qua `useSearchParams`, gọi API mới `appointmentApi.getAppointmentDetail(id)` để biết đúng trạng thái thật của lịch hẹn đó (chỉ biết id từ URL, không biết đang ở tab nào), tự chọn đúng tab lọc trước khi cuộn (`scrollIntoView`) tới và làm nổi bật thẻ tương ứng (viền + ring 3 giây).

**Đã kiểm tra:** `npx tsc --noEmit -p tsconfig.app.json` sạch hoàn toàn (repo này `build` script đã chạy `tsc -b` thật, không bị lỗi "no-op" như ghi nhận ở `Web-Pimi-for-owner` cùng ngày). Live-test qua Browser pane: seed 1 lịch hẹn trạng thái `OWNER_OFFERED_TIMES` + 1 thông báo `APPOINTMENT` trỏ đúng id → bấm vào thông báo ở trang `/notifications` → xác nhận điều hướng đúng `/appointments?highlight=<id>`, tự chọn tab "Needs confirmation" (khớp đúng trạng thái thật), hiện đúng thẻ lịch hẹn phòng 202; thông báo cũng được đánh dấu `isRead: true` (xác nhận qua DB). Đã xoá toàn bộ dữ liệu test.

---

## 2026-09-15 — Đồng bộ mã lỗi hợp đồng (000216/000217)

**Vì sao:** `errors.json` không đổi thì thiếu 2 mã lỗi mới sinh ra ở đợt sửa hợp đồng bên `bff-for-pimi` (chi tiết đầy đủ ở `bff-for-pimi/DEVELOPMENT_LOG.md` cùng ngày) — không có gì hiển thị trong repo này dùng tới, nhưng đồng bộ cho nhất quán giữa các client.

**Thay đổi:** `src/i18n/locales/{vi,en}/errors.json` — thêm `000216` (ngày kết thúc hợp đồng phải sau ngày bắt đầu, tách khỏi mã cũ bị trùng `000044`) và `000217` (chồng chéo ngày tháng hợp đồng).

---

## 2026-09-14 — Đồng bộ tách mã lỗi trùng `000049`

**Vì sao:** bff-for-pimi có 2 lỗi khác nhau (user-not-found vs. `loginAs` escalation) dùng chung mã `000049` (chi tiết ở `bff-for-pimi/DEVELOPMENT_LOG.md` cùng ngày) — `errors.json` ở đây đang gán `000049` cho message sai (loginAs), khiến lỗi đăng nhập sai username/email hiện nhầm nội dung.

**Thay đổi:** `src/i18n/locales/{vi,en}/errors.json`: sửa `000049` về đúng nghĩa "Không tìm thấy người dùng"/"User not found"; thêm mới `000215` cho message "không được phép đăng nhập với vai trò yêu cầu" (khớp mã mới bên backend).

**Đã kiểm tra:** parse JSON hợp lệ, giá trị `000049`/`000215` đúng như mong đợi.

---

## 2026-09-14 — Xem hướng dẫn xem nhà + khảo sát khi xác nhận đã tham dự

**Vì sao:** Phần người thuê của tính năng "người phụ trách xem nhà" (chi tiết đầy đủ ở `bff-for-pimi/DEVELOPMENT_LOG.md` cùng ngày): sau khi chủ nhà/cộng tác viên gửi hướng dẫn xem nhà, người thuê cần xem được nội dung đó; khi xác nhận "đã tham dự", cần điền thêm khảo sát (bộ câu hỏi do admin quản lý).

**Thay đổi:**
- `TenantAppointments.tsx`: hiện khối "Hướng dẫn xem nhà" khi `app.guideContent` có giá trị — render HTML đã qua `DOMPurify.sanitize()` trước `dangerouslySetInnerHTML`, đúng cách `NewsDetail.tsx` đang làm (nội dung rich-text do người khác soạn, không sanitize là mở đường Stored XSS).
- `components/appointment/AttendanceSurveyModal.tsx` (mới): render động theo `type` (RATING = sao, SINGLE/MULTIPLE_CHOICE = danh sách, TEXT = ô nhập), thay cho việc gọi thẳng `confirmAttendance(id, true)` như trước — giờ mở modal khảo sát trước, gộp câu trả lời vào cùng 1 lệnh gọi.
- `services/appointmentSurveyApi.ts` (mới) + `appointmentApi.ts`: `confirmAttendance()` nhận thêm tham số `surveyAnswers`.

**Phát hiện & sửa qua đợt rà soát riêng trước khi commit (`code-review` đa góc nhìn):**
- Câu TEXT bắt buộc chỉ gõ toàn dấu cách vẫn được coi là "đã trả lời" (so `!== ''` không trim, trong khi backend đã trim) — người dùng tưởng đã điền đủ, bị BE từ chối với lỗi chung chung không rõ trường nào sai. Đã sửa khớp đúng ngữ nghĩa `isAnswerMeaningful` phía backend.
- `useQuery` tải bộ câu hỏi không kiểm tra `isError` — tải lỗi thì `questions` rơi về `[]`, khiến điều kiện "đủ câu bắt buộc" luôn đúng, cho submit khảo sát rỗng mà không báo gì. Đã thêm kiểm tra + thông báo lỗi + khoá nút Gửi khi tải lỗi.

**Đã kiểm tra:** `npx tsc --noEmit` sạch. Rà soát riêng xác nhận `DOMPurify` đã áp dụng đúng trước khi render, không có nhánh nào render `guideContent` thô.

---

## 2026-09-11 — Card phòng bấm thẳng vào chi tiết + gộp nút Báo cáo ngang hàng Chia sẻ/Lưu

**Vì sao:** Card phòng (trang chủ, danh sách tìm kiếm, đã xem gần đây, yêu thích) có 2 nút footer "Xem chi tiết"/"Hẹn xem phòng" — cả 2 đều chỉ dẫn tới cùng 1 nơi (trang chi tiết), thừa thao tác. Yêu cầu: bỏ 2 nút, bấm bất kỳ đâu trên thẻ đều vào thẳng chi tiết, nhưng vẫn phải là `<a href>` thật (không phải điều hướng bằng JS) để giữ giá trị SEO. Ngoài ra, nút "Tố cáo phòng" ở trang chi tiết đang nằm tách biệt phía dưới cùng trang — dời lên ngang hàng với "Chia sẻ"/"Lưu phòng" ở đầu trang.

**Thay đổi:**
- `RoomCard.tsx`: bỏ khối 2 nút footer. Cả thẻ giờ là 1 `<Link>` thật phủ toàn bộ diện tích (kỹ thuật "stretched link" — `<Link>` bọc tiêu đề, dùng `after:absolute after:inset-0` để vùng bấm phủ hết thẻ) thay vì gắn `onClick` điều hướng bằng tay — giữ nguyên `<a href>` thật cho crawler. Nút tim yêu thích đặt `z-10` để nổi lên trên lớp phủ này, tách bạch khỏi hành vi điều hướng (đã test: bấm tim không bị nhảy trang).
- `Home.tsx`/`RoomList.tsx`: xoá `onRequestTour`/`selectedRoomForTour`/`<RequestTourModal>` — dây dẫn này chỉ được gọi từ đúng 2 nút vừa bỏ, đã là code chết từ trước (RoomCard chưa từng thực sự gọi `onRequestTour`, cả 2 nút footer cũ đều chỉ là `<Link>` tới trang chi tiết). Xoá luôn file `components/common/RequestTourModal.tsx` (không còn nơi nào import). Trang chi tiết phòng có luồng đặt lịch/đặt phòng riêng, không đụng tới.
- `RoomDetail.tsx`: dời `<ReportRoomButton>` vào chung hàng nút Share/Save ở đầu trang, cùng kiểu dáng (thu gọn còn icon trên mobile).
- `ReportRoomButton.tsx`: biến thể `button` bọc thêm nhãn trong `<span className="hidden sm:inline">` để khớp hành vi ẩn chữ trên màn nhỏ của 2 nút cùng hàng (biến thể `link` dùng ở `BookingHistory.tsx` không đổi).
- Dọn 2 khoá i18n mồ côi `roomCard.viewDetails`/`roomCard.bookViewing` (vi + en).

**Bug tự phát hiện, sửa kèm (chặn thẳng việc kiểm thử thay đổi trên):** `roomApi.getRoomsPaginated()` âm thầm làm rớt 2 field `rentalTermType`/`isRecommended` khi forward xuống `fetchPublicFeed` (không có trong type tham số nên bị bỏ qua khi spread) — khiến nút chuyển "Thuê Ngắn Hạn ⇄ Thuê Dài Hạn" và filter "Đề Cử Admin" ở trang `/rooms` **chưa từng có tác dụng thật**, luôn tìm kiếm ngắn hạn bất kể người dùng chọn gì (phát hiện khi seed dữ liệu test dài hạn để chụp ảnh card nhưng danh sách luôn trống). Bổ sung lại 2 field vào type + lệnh forward.

**Đã kiểm tra:** `npx tsc --noEmit` + `npm run build` sạch. Live-test qua Browser: seed tạm 4 phòng dài hạn (xoá sau khi xong) → xác nhận bấm bất kỳ đâu trên card (không riêng tiêu đề) đều vào đúng trang chi tiết phòng đó; bấm tim yêu thích không bị điều hướng nhầm (đúng ra mở luồng đăng nhập vì chưa login — hành vi cũ, không đổi); trang chi tiết hiện đúng 3 nút Share/Save/Report cùng hàng, cả ở desktop lẫn mobile (375px, chỉ còn icon). Dọn sạch dữ liệu/script seed test sau khi xong.

---

## 2026-09-08 — Tố cáo phòng: ảnh bắt buộc ≥1 + đồng bộ fix ảnh không tới admin

**Vì sao:** Backend đổi `imageIds` từ optional sang bắt buộc tối thiểu 1 ảnh, đồng thời sửa bug gốc khiến ảnh tố cáo không bao giờ tới được admin dù trang báo gửi thành công (xem log `bff-for-pimi` cùng ngày) — `POST /s3/upload/list` (endpoint web này cũng dùng, giống mobile) trước đó không tạo dòng `Image`/không trả `id`, khiến `roomReportApi.uploadEvidenceImages()`'s `.map(img => img.id)` luôn ra mảng rỗng.

**Thay đổi:**
- `ReportRoomModal.tsx`: thêm kiểm tra `files.length === 0` trước khi submit, hiện toast `reportRoomModal.toastNeedImage`.
- `roomReportApi.ts`: kiểu `create()`'s `imageIds` đổi từ optional sang bắt buộc, khớp đúng ràng buộc backend.
- i18n (vi/en): `evidenceLabel` đổi "(không bắt buộc)" → "(bắt buộc)", `evidenceHint` ghi rõ "cần ít nhất 1 ảnh", thêm `toastNeedImage`.

**Đã kiểm tra:** `npx tsc -b --noEmit` sạch. Bug ảnh-không-tới-admin đã xác nhận hết qua test trực tiếp phía backend (curl end-to-end + live UI trên mobile, cùng 1 endpoint dùng chung `/s3/upload/list`) — không cần lặp lại test riêng cho web vì lỗi và bản sửa đều nằm hoàn toàn ở backend, web chỉ đổi UI validation.

---

## 2026-09-07 — Đồng bộ mã lỗi Room Report (theo fix bên bff-for-pimi)

**Vì sao:** Rà soát tính năng Tố cáo phòng trước khi đưa lên mobile phát hiện 3 mã lỗi Room Report trùng với 3 mã lỗi cũ khác nghĩa hoàn toàn (xem chi tiết ở `bff-for-pimi/DEVELOPMENT_LOG.md` cùng ngày) — backend đã đổi sang mã mới (`000202`/`000203`/`000204`), cần đồng bộ `errors.json` ở repo này vì `getApiErrorMessage` tra message hiển thị theo code cục bộ.

**Thay đổi:** Thêm 3 dòng `000202`/`000203`/`000204` vào `src/i18n/locales/{vi,en}/errors.json`, giữ nguyên các dòng cũ.

**Đã kiểm tra:** JSON hợp lệ (parse thử qua `node -e`).

---

## 2026-09-05 — Nút "Tố cáo phòng" trên trang chi tiết phòng + lịch sử đặt phòng

**Vì sao:** Phần khách thuê của tính năng tố cáo phòng (chi tiết đầy đủ ở `bff-for-pimi/DEVELOPMENT_LOG.md` cùng ngày) — khách cần tố cáo được ngay lúc xem phòng, hoặc từ trang lịch sử đặt phòng khi đang thuê/đã thuê xong. Bắt buộc đăng nhập mới tố cáo được.

**Thay đổi:**
- Service mới `src/services/roomReportApi.ts`: `uploadEvidenceImages()` gọi `POST /v1/s3/upload/list` (fileType `ROOM_REPORT_EVIDENCE`) — **cố tình KHÔNG dùng** `POST /v1/images/list` như pattern upload ảnh bên Web-Pimi-for-owner, vì route đó giới hạn role `[HOUSE_OWNER, HOUSE_MANAGER, PIMI_ADMIN]`, khách thuê (`RENT_USER`) gọi sẽ bị 403 — `/s3/upload/list` chỉ yêu cầu đăng nhập, không giới hạn role.
- `ReportRoomModal.tsx` (mới): dropdown lý do + chi tiết + upload tối đa 5 ảnh, submit qua `roomReportApi.create`.
- `ReportRoomButton.tsx` (mới): gate đăng nhập theo đúng pattern có sẵn (`toast.warning` + `navigate('/login?redirect=...')` nếu chưa đăng nhập), 2 biến thể hiển thị (nút/link).
- Gắn vào `RoomDetail.tsx` (trên `RoomReviews`, dùng được ngay khi đang xem phòng — không cần đã từng thuê, khác `RoomReviews` bên dưới) và `BookingHistory.tsx` (theo từng dòng đặt phòng, phủ đúng "đang thuê hoặc đã thuê xong").

**Đã kiểm tra:** `npx tsc -b` + `npx vite build` sạch. Live-test qua Browser pane (tài khoản test tạo riêng, xoá sau khi xong): đăng nhập → mở trang chi tiết 1 phòng thật → bấm "Report this room" → chọn lý do + nhập chi tiết → submit thành công (`POST /room-reports` → 201), xác nhận admin (ADMIN-Pimi) nhận đúng report + notification ngay sau đó.

---

## 2026-09-02 — Vá lỗi "đăng nhập giả" sau đăng ký — isAuthenticated không dựa trên phiên thật

**Vì sao:** Phát hiện qua live-test đăng ký tài khoản mới thật (xem `bff-for-pimi/DEVELOPMENT_LOG.md` cùng ngày để biết đầy đủ nguyên nhân + fix backend). Backend trước đây (`register()`/`verifyEmail()`) không hề cấp token/cookie nào, nhưng `AuthContext.tsx` vẫn tự đặt `user` (→ `isAuthenticated: true`) chỉ dựa vào dữ liệu form người dùng gõ — không có phiên đăng nhập thật nào phía sau, mọi API cần xác thực (kể cả badge thông báo hiển thị ngay trên header) âm thầm 401.

**Thay đổi:**
- `register()`: bỏ hẳn `setUser(profile)` lạc quan — đăng ký thành công KHÔNG còn nghĩa là "đã đăng nhập" (đúng bản chất: tài khoản còn `NEW_REGISTER`, chưa xác thực).
- Tách logic dùng chung (set csrfToken + gọi `/users/me` lấy hồ sơ thật + `setUser`) thành `applyAuthenticatedProfile()`, dùng lại cho cả `login()` và method mới `completeEmailVerification()` (thay `markEmailVerified()` cũ — chỉ đổi 1 field cục bộ, không có phiên thật).
- `VerifyEmail.tsx`: gọi `completeEmailVerification(response, email)` với response thật từ `POST /auth/verify-email` (giờ đã có `accessToken`/`refreshToken`/`csrfToken` — xem thay đổi backend) thay vì `markEmailVerified()`.

**Đã kiểm tra:** `npx tsc -b` sạch. Live-test qua Browser pane: đăng ký tài khoản mới → xác thực đúng OTP → `GET /users/me` trả `200` với hồ sơ thật ngay lập tức (trước đây `401`); mở tab mới xác nhận session cookie thật sự tồn tại, không phải chỉ state cục bộ; badge thông báo trên header hết báo lỗi 401.

---

## 2026-09-02 — P1: escape JSON-LD chống XSS, giảm re-render thừa ở FavoritesContext

**Vì sao:** Tiếp nối đợt vá P0 (sanitize HTML tin tức) — 2 hạng mục P1 còn lại của trang này.

**1. `JsonLd.tsx`:** `JSON.stringify(data)` render thẳng vào `<script type="application/ld+json">` qua `dangerouslySetInnerHTML` không escape gì — nếu 1 chuỗi trong `data` (vd tiêu đề bài tin tức, cùng nguồn dữ liệu admin-nhập với lỗi XSS đã vá ở P0) chứa `</script>`, trình duyệt đóng thẻ script ngay tại đó bất kể đang ở trong JS string hay không, cho phép chèn thẻ `<script>` mới thực thi. Thêm `.replace(/</g, '\\u003c')` sau `JSON.stringify` — vẫn là JSON hợp lệ, chỉ không còn ký tự `<` thô nào để trình duyệt hiểu nhầm là thẻ mới.

**2. `FavoritesContext.tsx`:** `value` truyền vào `Provider` là object literal tạo mới MỖI LẦN render (không `useMemo`) — mọi component gọi `useFavorites()` re-render dù giá trị không đổi. `isFavorited`/`toggleFavorite` phụ thuộc `[favoriteIds]` nên cũng bị tạo lại mỗi khi có 1 toggle bất kỳ chạy qua (dù ở phòng nào), khuếch đại vấn đề. Sửa: giữ `favoriteIdsRef` đồng bộ với state, đọc qua ref bên trong 2 hàm này để chúng KHÔNG cần liệt kê `favoriteIds` trong dependency (giữ nguyên reference qua mọi lần render); bọc `value` bằng `useMemo`. `RoomCard.tsx` (render lặp lại nhiều lần trong danh sách) bọc thêm `React.memo`. **Giới hạn đã biết, không giải quyết trong đợt này:** khi `favoriteIds` THẬT SỰ đổi (ai đó toggle 1 phòng), Context API vẫn broadcast cho MỌI consumer đang mounted bất kể có liên quan hay không — cần tách context theo từng `roomId` (kiến trúc khác hẳn) mới giải quyết triệt để, ngoài phạm vi sửa nhanh này.

**Đã kiểm tra:** `npx tsc -b` + `npm run build` sạch cho cả 2 file.

---

## 2026-09-02 — P0: sanitize HTML tin tức trước khi render (chặn Stored XSS)

**Vì sao:** `NewsDetail.tsx` render `article.content`/`article.excerpt` (nội dung admin nhập ở CMS, dạng rich-text/HTML) thẳng qua `dangerouslySetInnerHTML`, không qua bước sanitize nào. Admin nhập nhầm hoặc tài khoản admin bị chiếm có thể chèn `<script>`/`onerror=...`/... chạy thẳng trên trình duyệt của MỌI người đọc bài viết đó (Stored XSS) — độc lập với việc backend có làm sạch HTML lúc lưu hay không, phía client vẫn nên tự vệ.

**Thay đổi:**
- Thêm dependency `dompurify` + `@types/dompurify`.
- `src/pages/NewsDetail.tsx`: thêm `sanitizedContent` (`useMemo`, phụ thuộc `article?.content`/`article?.excerpt`) gọi `DOMPurify.sanitize(...)`, dùng giá trị này thay cho `article.content || article.excerpt` ở `dangerouslySetInnerHTML`.
- Đã grep lại toàn bộ `src/` — chỗ `dangerouslySetInnerHTML` còn lại duy nhất là `JsonLd.tsx` (`JSON.stringify(data)` cho `<script type="application/ld+json">`, không phải HTML từ CMS — thuộc 1 hạng mục P1 khác trong kế hoạch: escape `</script>` trong chuỗi JSON, chưa xử lý ở đợt này).

**Đã kiểm tra:** `npx tsc -b` sạch, `npm run build` sạch (cảnh báo sitemap fetch-fail chỉ do backend cục bộ không chạy trong môi trường build, không liên quan).

---

## 2026-09-01 — Tìm kiếm: bỏ tự động tìm kiếm, lưu trạng thái vào URL (share/SEO)

**Vì sao:** Trước đây MỌI thay đổi ở `RoomFilterBar` (gõ từ khoá, đổi quận/huyện, bấm tiện ích, bật GPS...) gọi thẳng `onChange` khiến `RoomList` refetch API ngay lập tức — tự động tìm kiếm liên tục, tốn request. Đồng thời `filters` chỉ đọc từ URL 1 LẦN lúc mount rồi không bao giờ ghi ngược lại — URL luôn đứng yên dù người dùng đổi bộ lọc, không thể copy link chia sẻ đúng kết quả đang xem, cũng không có ngữ cảnh cho SEO.

**Thay đổi:**
- `src/components/filter/RoomFilterBar.tsx`: chuyển từ "gọi API ngay khi đổi filter" sang "form + nút Tìm kiếm". Component tự giữ state `draft` (mọi thao tác — gõ, chọn, bấm tiện ích, bật GPS, đổi loại thuê — chỉ cập nhật `draft`, không gọi API). Bọc toàn bộ trong `<form onSubmit>` — bấm nút "Tìm kiếm" (đặt cạnh ô từ khoá + trong `advancedFilters`) hoặc nhấn Enter trong ô từ khoá mới thật sự submit. Bỏ hẳn cơ chế debounce-tự-động-tìm-kiếm cũ (`SEARCH_DEBOUNCE_MS`) — không cần nữa vì gõ không còn tự bắn request. Props đổi từ `filters`/`onChange` sang `appliedFilters`/`onSubmit` (đúng ngữ nghĩa: 1 bên là trạng thái ĐANG ÁP DỤNG THẬT, 1 bên là hành động submit). Riêng modal bộ lọc mobile (render qua `createPortal` ra `document.body`) không nằm trong cây DOM thật của `<form>` nên nút "Tìm kiếm" ở đó gọi `handleSubmit()` bằng tay thay vì dựa vào `type="submit"`. Nhân tiện thêm `type="button"` cho các nút lọc trước đây thiếu (price pill, tiện ích, nút Đặt lại) — nếu không, khi nằm trong `<form>` mới, các nút này sẽ MẶC ĐỊNH `type="submit"` và vô tình submit ngay khi bấm.
- `src/pages/RoomList.tsx`: thêm `filtersFromSearchParams`/`sortFromSearchParams`/`pageFromSearchParams` (đọc toàn bộ trạng thái tìm kiếm — filter, sort, trang — từ URL, không chỉ vài field như trước) và `buildSearchParams` (chiều ngược lại, bỏ qua field đang ở giá trị mặc định để URL gọn). Thêm effect ghi `filters`/`sortBy`/`pageNumber` vào URL qua `setSearchParams(..., { replace: true })` mỗi khi đổi — `replace: true` để tránh spam lịch sử trình duyệt mỗi lần đổi trang/sắp xếp. Effect reset về trang 1 khi đổi filter/sort được thêm cờ bỏ qua lần chạy đầu (`isFirstRender` ref) để không xoá mất `?page=N` của 1 link chia sẻ vừa mở.
- Giữ nguyên hành vi canonical URL trong `<Seo>` (luôn trỏ `/rooms` không kèm query) — đã đúng từ trước, tránh Google index trùng lặp các tổ hợp filter khác nhau, không phải sửa gì thêm ở phần này.
- `src/i18n/locales/{vi,en}/common.json`: đổi khoá `applyFiltersButton` (không còn dùng) thành `searchButton`.

**Đã kiểm tra:** `npx tsc -b` sạch, `npm run build` sạch. Test trực tiếp qua browser (dev server, không có backend cục bộ nên phần kết quả luôn ở trạng thái lỗi tải — không ảnh hưởng test hành vi filter/URL):
- Gõ vào ô từ khoá + bấm 1 price pill → xác nhận URL KHÔNG đổi trong lúc thao tác.
- Bấm nút "Tìm kiếm" → URL đổi thành `?search=...&priceRange=...` đúng cả 2 giá trị cùng lúc.
- Mở lại chính URL đó ở tab mới (giả lập mở link chia sẻ) → ô từ khoá và price pill tự động hiện đúng trạng thái đã lưu.
- Bấm "Đặt lại bộ lọc" → URL về lại `/rooms` trần, áp dụng ngay (không cần bấm Tìm kiếm) — đúng thiết kế (Reset là hành động tức thời, khác với đang soạn 1 lượt tìm kiếm mới).
- Luồng modal mobile: mở "Bộ lọc" → chọn 1 pill (không đổi URL) → bấm "Tìm kiếm" ở footer modal → URL cập nhật đúng + modal tự đóng.

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
