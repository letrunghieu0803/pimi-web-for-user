import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Database,
  Search,
  Target,
  Share2,
  Wallet,
  Archive,
  UserCheck,
  Cookie,
  ShieldAlert,
  Globe2,
  RefreshCw,
  Phone
} from 'lucide-react';
import { Seo } from '@/components/common/Seo';

export const Privacy: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <Seo title={t('seo.privacyTitle')} description={t('seo.privacyDescription')} path="/privacy" />

      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>{t('privacy.badge')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          {t('privacy.title')}
        </h1>
        <p className="text-xs text-slate-500">{t('privacy.effectiveDate')}</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Tài liệu này giải thích Pimi thu thập, sử dụng, chia sẻ và bảo vệ thông tin cá nhân của Người thuê, Chủ nhà và các đối tác như thế nào — áp dụng cho website, ứng dụng di động và mọi dịch vụ mang thương hiệu Pimi. Bằng việc tạo tài khoản hoặc tiếp tục sử dụng Pimi, Bạn xác nhận đã đọc và đồng ý với Chính sách này cùng{' '}
          <Link to="/terms" className="text-indigo-600 font-bold hover:underline">Điều khoản sử dụng Pimi</Link>.
        </p>
        <div className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
          <p><strong>Tóm tắt nhanh (không thay thế nội dung đầy đủ bên dưới):</strong></p>
          <ul className="list-disc pl-4 space-y-0.5 font-medium">
            <li>Tiền thuê phòng ngắn hạn được chuyển vào <strong>tài khoản ngân hàng của Pimi</strong> trước, Pimi giữ hộ rồi chuyển tiếp cho chủ nhà sau khi khách nhận phòng, có trừ phí dịch vụ (xem mục 6).</li>
            <li>Xác minh danh tính (KYC) hiện dùng công nghệ hỗ trợ đọc giấy tờ, <strong>đội ngũ Pimi trực tiếp kiểm tra và duyệt thủ công</strong> trước khi gắn nhãn "Đã xác minh" — không phải xác thực điện tử của cơ quan nhà nước.</li>
            <li>Chúng tôi không bán dữ liệu cá nhân của Bạn cho bên thứ ba vì mục đích quảng cáo.</li>
          </ul>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            1. Phạm Vi Áp Dụng
          </h2>
          <p>
            Chính sách này áp dụng cho mọi sản phẩm mang thương hiệu Pimi: website người thuê, website chủ nhà, ứng dụng di động Pimi và các hệ thống vận hành phía sau, do <strong>Công ty TNHH Pimi Nest</strong> ("Pimi", "chúng tôi") vận hành. Chính sách áp dụng cho tất cả vai trò: Người thuê, Chủ nhà, Quản lý toà nhà, Cộng tác viên/Môi giới — một tài khoản có thể đồng thời giữ nhiều vai trò.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            2. Thông Tin Chúng Tôi Thu Thập
          </h2>
          <p className="font-semibold text-slate-800">Thông tin bạn cung cấp trực tiếp:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Thông tin tài khoản:</strong> Họ tên, số điện thoại, email, mật khẩu (mã hoá một chiều), ngày sinh, giới tính (tuỳ chọn, có thể chọn "không chia sẻ"), ngôn ngữ hiển thị.</li>
            <li><strong>Giấy tờ xác minh danh tính (KYC):</strong> Ảnh CCCD/CMND, bằng lái xe hoặc hộ chiếu (Bạn chọn 1 loại), kèm 1 ảnh chân dung đối chiếu. Số giấy tờ chỉ được ghi vào hồ sơ sau khi được duyệt.</li>
            <li><strong>Thông tin ngân hàng:</strong> Tên ngân hàng, số tài khoản, chủ tài khoản, chi nhánh — Chủ nhà cung cấp để nhận tiền cho thuê; áp dụng tương tự cho hợp đồng dài hạn.</li>
            <li><strong>Nội dung Bạn tạo ra:</strong> Tin đăng phòng, ảnh phòng, đánh giá sau khi ở, nội dung tố cáo kèm ảnh bằng chứng, hồ sơ hợp đồng thuê dài hạn (người ở cùng, người liên hệ khẩn cấp nếu Bạn nhập).</li>
          </ul>
          <p className="font-semibold text-slate-800">Thông tin phát sinh khi Bạn dùng dịch vụ:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Lịch sử đặt phòng, hoá đơn, trạng thái thanh toán, mã tham chiếu giao dịch, lịch sử xem phòng đã đặt lịch.</li>
          </ul>
          <p className="font-semibold text-slate-800">Thông tin kỹ thuật &amp; vị trí:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Vị trí gần đúng của thiết bị</strong> — chỉ thu thập khi Bạn chủ động bật quyền định vị để dùng tính năng "phòng gần bạn"; có thể từ chối mà vẫn tìm kiếm bình thường.</li>
            <li>Token thiết bị để gửi thông báo đẩy, loại nền tảng (web/Android/iOS), nhật ký kỹ thuật ở mức hệ thống phục vụ vận hành và bảo mật.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-600" />
            3. Cách Chúng Tôi Thu Thập Thông Tin
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Trực tiếp từ Bạn:</strong> khi đăng ký, cập nhật hồ sơ, đăng tin, đặt phòng, gửi đánh giá/tố cáo, liên hệ hỗ trợ.</li>
            <li><strong>Tự động:</strong> qua thiết bị/trình duyệt khi sử dụng Nền tảng (vị trí nếu Bạn cho phép, token đẩy thông báo, nhật ký hệ thống).</li>
            <li><strong>Từ người dùng khác:</strong> ví dụ khi Chủ nhà tạo hồ sơ hợp đồng và nhập thông tin người ở cùng, hoặc khi một bên tố cáo/đánh giá liên quan đến Bạn.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            4. Mục Đích Sử Dụng Thông Tin
          </h2>
          <p>Chúng tôi chỉ dùng dữ liệu cho các mục đích cần thiết để vận hành Nền tảng, thực hiện đúng nghĩa vụ hợp đồng với Bạn, tuân thủ pháp luật, hoặc khi Bạn đồng ý rõ ràng — không dùng để bán cho quảng cáo bên thứ ba:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Vận hành tài khoản &amp; xác thực:</strong> tạo, bảo mật, khôi phục tài khoản; phát hiện đăng nhập bất thường.</li>
            <li><strong>Kết nối cung — cầu:</strong> hiển thị tin đăng phù hợp, xử lý yêu cầu xem phòng, đặt phòng, tạo hồ sơ hợp đồng dài hạn.</li>
            <li><strong>Xử lý thanh toán:</strong> tạo mã QR thanh toán, đối soát giao dịch, tính hoa hồng, giải ngân cho Chủ nhà, xuất hoá đơn.</li>
            <li><strong>Xác minh danh tính:</strong> giảm rủi ro lừa đảo, tin giả, tài khoản ảo — cho cả Người thuê lẫn Chủ nhà.</li>
            <li><strong>An toàn cộng đồng:</strong> xử lý tố cáo, đình chỉ tài khoản vi phạm, điều tra gian lận, lưu bằng chứng phục vụ tranh chấp.</li>
            <li><strong>Thông báo dịch vụ:</strong> email/thông báo đẩy về trạng thái đặt phòng, hoá đơn, lịch hẹn, kết quả xác minh, cảnh báo bảo mật.</li>
            <li><strong>Tuân thủ pháp luật:</strong> lưu trữ chứng từ kế toán/thuế, phản hồi yêu cầu hợp pháp từ cơ quan nhà nước có thẩm quyền.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-600" />
            5. Chúng Tôi Chia Sẻ Thông Tin Như Thế Nào
          </h2>
          <p className="font-semibold text-slate-800">Giữa Người thuê và Chủ nhà:</p>
          <p>Khi Bạn đặt phòng hoặc xác nhận lịch xem phòng, một số thông tin liên hệ (họ tên, số điện thoại) được chia sẻ giữa hai bên để phối hợp nhận/trả phòng. Chủ nhà <strong>không</strong> thấy giấy tờ xác minh danh tính của Người thuê — đội ngũ Pimi là bên duy nhất xem ảnh giấy tờ khi xét duyệt hồ sơ.</p>
          <p className="font-semibold text-slate-800">Với bên xử lý thay Pimi (nhà cung cấp dịch vụ):</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Hạ tầng lưu trữ đám mây (AWS S3):</strong> lưu ảnh phòng, ảnh hợp đồng, ảnh giấy tờ xác minh. Ảnh giấy tờ/hợp đồng ở chế độ riêng tư, chỉ truy cập qua đường dẫn có thời hạn, không công khai như ảnh phòng.</li>
            <li><strong>Dịch vụ trích xuất thông tin bằng AI (mô hình ngôn ngữ bên thứ ba):</strong> hỗ trợ đọc và điền sẵn thông tin từ ảnh giấy tờ để nhân sự duyệt nhanh hơn — kết quả AI luôn được người thật kiểm tra lại, hệ thống không tự động phê duyệt.</li>
            <li><strong>Firebase Cloud Messaging:</strong> gửi thông báo đẩy (token thiết bị, nội dung thông báo).</li>
            <li><strong>Dịch vụ email:</strong> gửi email xác thực, khôi phục mật khẩu, hoá đơn, thông báo giao dịch.</li>
            <li><strong>VietMap:</strong> hiển thị bản đồ, gợi ý địa chỉ, tính khoảng cách (toạ độ phòng/toà nhà; vị trí thiết bị nếu Bạn bật tìm "phòng gần bạn").</li>
          </ul>
          <p className="font-semibold text-slate-800">Vì lý do pháp lý:</p>
          <p>Chúng tôi có thể tiết lộ thông tin khi được yêu cầu hợp pháp bởi cơ quan nhà nước có thẩm quyền, hoặc khi cần thiết để bảo vệ quyền, tài sản, an toàn của Pimi, người dùng hoặc cộng đồng.</p>
          <p className="font-semibold text-slate-800">Chúng tôi không:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Không bán thông tin cá nhân của Bạn cho bên thứ ba vì mục đích quảng cáo.</li>
            <li>Không chia sẻ ảnh giấy tờ xác minh cho Chủ nhà, môi giới hay bất kỳ người dùng nào khác.</li>
            <li>Không chia sẻ dữ liệu cho các đối tác chấm điểm tín dụng bên ngoài.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Wallet className="w-4 h-4 text-indigo-600" />
            6. Thanh Toán Và Việc Giữ Hộ Tiền
          </h2>
          <p>Đây là phần nhiều người dùng quan tâm nhất nên chúng tôi giải thích rõ cơ chế thật: khi Bạn thanh toán đặt phòng ngắn hạn qua mã QR trong ứng dụng, tiền được chuyển <strong>vào tài khoản ngân hàng đứng tên Pimi</strong> trước — không chuyển thẳng cho Chủ nhà.</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Sau khi Bạn xác nhận đặt phòng, hệ thống tạo mã QR chuyển khoản (chuẩn VietQR) với số tiền và mã giao dịch riêng, có thời hạn thanh toán — quá hạn đơn tự huỷ.</li>
            <li>Khi ngân hàng xác nhận đã nhận tiền, đơn chuyển sang "Đã thanh toán" — số tiền này được xem là <strong>Pimi giữ hộ cho Chủ nhà</strong> đến khi Bạn nhận phòng thành công.</li>
            <li>Sau khi Chủ nhà xác nhận Bạn đã nhận phòng, đội ngũ Pimi đối soát và chuyển khoản phần tiền còn lại cho Chủ nhà, sau khi trừ phí hoa hồng dịch vụ theo tỷ lệ đã công bố công khai.</li>
            <li>Hoá đơn tiền thuê dài hạn định kỳ cũng thanh toán qua cùng cơ chế (mã QR vào tài khoản Pimi), không thu hoa hồng trên khoản này, và hỗ trợ ghi nhận thanh toán tiền mặt trực tiếp nếu Chủ nhà chọn phương thức đó trong hợp đồng.</li>
          </ol>
          <p>Chính sách huỷ và hoàn tiền được quy định chi tiết tại <Link to="/terms" className="text-indigo-600 font-bold hover:underline">Điều khoản sử dụng</Link>, mục "Huỷ, hoàn tiền và tranh chấp".</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            7. Bảo Mật Thông Tin
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Mật khẩu được băm một chiều — kể cả nhân viên Pimi cũng không xem được mật khẩu gốc của Bạn.</li>
            <li>Toàn bộ kết nối giữa ứng dụng/website và máy chủ được mã hoá qua HTTPS.</li>
            <li>Ảnh giấy tờ xác minh và ảnh hợp đồng lưu ở chế độ riêng tư, chỉ truy cập qua đường dẫn có chữ ký, thời hạn ngắn.</li>
            <li>Chỉ nhân sự Pimi được phân quyền quản trị mới xét duyệt hồ sơ xác minh danh tính; hệ thống tự khoá tạm thời tài khoản sau nhiều lần xác minh thất bại liên tiếp để hạn chế lạm dụng.</li>
            <li>Phiên đăng nhập dùng token có thời hạn, lưu trong cookie an toàn (HttpOnly), hạn chế rủi ro bị đánh cắp qua mã độc trên trình duyệt.</li>
          </ul>
          <p className="text-slate-500">Không hệ thống nào an toàn tuyệt đối 100%. Nếu phát hiện dấu hiệu bất thường liên quan đến tài khoản, hãy đổi mật khẩu ngay và liên hệ đội hỗ trợ.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Archive className="w-4 h-4 text-indigo-600" />
            8. Thời Gian Lưu Trữ Dữ Liệu
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Trong thời gian tài khoản hoạt động:</strong> lưu dữ liệu hồ sơ, tin đăng, lịch sử giao dịch để Bạn tiếp tục sử dụng dịch vụ bình thường.</li>
            <li><strong>Sau khi Bạn tự vô hiệu hoá tài khoản:</strong> dữ liệu được giữ ở trạng thái không hoạt động để Bạn có thể yêu cầu kích hoạt lại; tin đăng, hợp đồng, đánh giá liên quan vẫn hiển thị cho các bên liên quan trừ khi Bạn yêu cầu xoá riêng.</li>
            <li><strong>Chứng từ giao dịch, hoá đơn:</strong> lưu tối thiểu theo thời hạn pháp luật kế toán/thuế Việt Nam yêu cầu, hiện áp dụng mốc <strong>5 năm</strong>, kể cả khi Bạn đã yêu cầu xoá tài khoản.</li>
            <li><strong>Hồ sơ xác minh danh tính bị từ chối:</strong> lưu tối đa 90 ngày để phục vụ khiếu nại rồi tự động xoá, trừ trường hợp có dấu hiệu gian lận cần lưu lâu hơn.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            9. Quyền Của Bạn
          </h2>
          <p>Căn cứ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, Bạn có các quyền sau:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Được biết:</strong> đọc chính sách này; hỏi thêm qua kênh hỗ trợ.</li>
            <li><strong>Truy cập, xem lại dữ liệu:</strong> xem/sửa trực tiếp trong Hồ sơ cá nhân; yêu cầu bản sao đầy đủ qua email hỗ trợ.</li>
            <li><strong>Chỉnh sửa, cập nhật:</strong> tự cập nhật hồ sơ, hoặc gửi yêu cầu nếu trường thông tin đã bị khoá sau xác minh.</li>
            <li><strong>Rút lại sự đồng ý:</strong> với các quyền tuỳ chọn (vị trí, thông báo đẩy) — tắt trực tiếp trong cài đặt thiết bị/ứng dụng.</li>
            <li><strong>Hạn chế / phản đối xử lý:</strong> gửi yêu cầu qua email hỗ trợ, nêu rõ mục đích muốn hạn chế.</li>
            <li><strong>Vô hiệu hoá tài khoản:</strong> tự thực hiện trong ứng dụng (xác thực qua mã OTP gửi tới email) — có thể yêu cầu kích hoạt lại bất cứ lúc nào bằng cùng cách này.</li>
            <li><strong>Yêu cầu xoá dữ liệu:</strong> gửi yêu cầu tới <span className="font-semibold">privacy@pimi.vn</span>. Chúng tôi phản hồi và xử lý trong vòng <strong>30 ngày</strong>, trừ phần dữ liệu buộc phải giữ lại theo nghĩa vụ pháp luật (mục 8).</li>
            <li><strong>Khiếu nại:</strong> liên hệ Pimi trước; nếu chưa thoả đáng, Bạn có quyền khiếu nại tới cơ quan nhà nước có thẩm quyền về bảo vệ dữ liệu cá nhân.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Cookie className="w-4 h-4 text-indigo-600" />
            10. Cookie Và Công Nghệ Tương Tự
          </h2>
          <p>Chúng tôi dùng cookie ở mức tối thiểu cần thiết để vận hành: cookie phiên đăng nhập (giữ Bạn đăng nhập giữa các lần truy cập), cookie chống giả mạo yêu cầu (CSRF) — bắt buộc để website hoạt động đúng, tắt cookie trình duyệt sẽ khiến Bạn không đăng nhập được.</p>
          <p>Chúng tôi hiện <strong>không</strong> dùng cookie quảng cáo hay cookie theo dõi hành vi của bên thứ ba (ví dụ Google Ads, Facebook Pixel).</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
            11. Người Dưới 18 Tuổi
          </h2>
          <p>Pimi không hướng đến và không cố ý thu thập dữ liệu của người dưới 18 tuổi — việc đặt phòng, ký hợp đồng và giao dịch tài chính trên Nền tảng đòi hỏi năng lực hành vi dân sự đầy đủ. Nếu phát hiện tài khoản thuộc về người dưới 18 tuổi, chúng tôi sẽ vô hiệu hoá tài khoản và xoá dữ liệu liên quan trừ phần buộc phải lưu theo pháp luật.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-indigo-600" />
            12. Lưu Trữ Và Chuyển Dữ Liệu
          </h2>
          <p>Dữ liệu được lưu trữ trên hạ tầng máy chủ và lưu trữ đám mây do Pimi lựa chọn nhà cung cấp, có thể đặt tại trung tâm dữ liệu trong hoặc ngoài lãnh thổ Việt Nam tuỳ cấu hình vận hành tại từng thời điểm. Khi dữ liệu được xử lý ngoài Việt Nam, chúng tôi yêu cầu bên xử lý áp dụng các biện pháp bảo vệ tương đương chính sách này và tuân thủ quy định pháp luật hiện hành về chuyển dữ liệu cá nhân xuyên biên giới.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-indigo-600" />
            13. Thay Đổi Chính Sách
          </h2>
          <p>Chúng tôi có thể cập nhật chính sách này khi tính năng hoặc quy định pháp luật thay đổi. Thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo trong ứng dụng trước khi có hiệu lực. Ngày "hiệu lực" ở đầu trang luôn phản ánh phiên bản mới nhất.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-600" />
            14. Thông Tin Liên Hệ
          </h2>
          <p>Mọi câu hỏi, yêu cầu thực hiện quyền dữ liệu cá nhân, hoặc báo cáo sự cố bảo mật, vui lòng liên hệ:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Đơn vị vận hành:</strong> Công ty TNHH Pimi Nest</li>
            <li><strong>Người đại diện:</strong> Ông Đào Quang Trọng — Nhà sáng lập &amp; Tổng Giám đốc</li>
            <li><strong>Mã số doanh nghiệp:</strong> <em>[Bổ sung mã số thuế / đăng ký kinh doanh]</em></li>
            <li><strong>Trụ sở đăng ký:</strong> <em>[Bổ sung địa chỉ đăng ký kinh doanh chính thức]</em></li>
            <li><strong>Văn phòng giao dịch:</strong> 188 Nguyễn Xí, P.26, Bình Thạnh, TP. Hồ Chí Minh &amp; Cầu Giấy, Hà Nội</li>
            <li><strong>Email phụ trách dữ liệu:</strong> privacy@pimi.vn</li>
            <li><strong>Email hỗ trợ chung:</strong> support@pimi.vn</li>
            <li><strong>Hotline:</strong> <em>[Bổ sung số hotline chính thức]</em></li>
          </ul>
        </section>

        <p className="text-xs text-slate-400 pt-4 border-t border-slate-200">
          Bản quyền thuộc về Công ty TNHH Pimi Nest. Mọi sự sao chép hoặc phát hành lại một phần hay toàn bộ chính sách này mà không được sự đồng ý bằng văn bản của Pimi Nest đều bị coi là vi phạm pháp luật.
        </p>

      </div>
    </div>
  );
};
