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
import { LegalContactList, LegalSection } from '@/components/legal/LegalSection';
import { CONTACT, CONTACT_MAILTO_HREF, LEGAL_VERSION } from '@/constants/contact';

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
        <p className="text-xs text-slate-500">
          Ngày hiệu lực: {LEGAL_VERSION.effectiveDate} · Phiên bản {LEGAL_VERSION.version} · {CONTACT.companyName}
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Tài liệu này giải thích Pimi thu thập, sử dụng, chia sẻ và bảo vệ thông tin cá nhân của Người thuê, Chủ nhà và các đối tác như thế nào — áp dụng cho website, ứng dụng di động và mọi dịch vụ mang thương hiệu Pimi. Bằng việc tạo tài khoản hoặc tiếp tục sử dụng Pimi, Bạn xác nhận đã đọc và đồng ý với Chính sách này cùng{' '}
          <Link to="/terms" className="text-indigo-600 font-bold hover:underline">Điều khoản sử dụng Pimi</Link>.
        </p>
        <div className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
          <p><strong>Tóm tắt nhanh (không thay thế nội dung đầy đủ bên dưới):</strong></p>
          <ul className="list-disc pl-4 space-y-0.5 font-medium">
            <li>Tiền đặt phòng ngắn hạn được chuyển vào <strong>tài khoản ngân hàng của Pimi</strong> trước; Pimi giữ hộ rồi chuyển cho Chủ nhà sau khi nhận phòng, đã trừ hoa hồng (mục 6).</li>
            <li>Ảnh giấy tờ xác minh chỉ <strong>nhân sự Pimi được phân quyền</strong> xem; Chủ nhà và người dùng khác không thấy. Ảnh được đọc bằng công cụ AI hỗ trợ nhưng <strong>luôn có người duyệt thủ công</strong>.</li>
            <li>Chúng tôi <strong>không bán</strong> dữ liệu cá nhân của Bạn cho bên thứ ba vì mục đích quảng cáo.</li>
            <li>Bạn có thể yêu cầu xem, sửa, xoá dữ liệu hoặc vô hiệu hoá tài khoản bất cứ lúc nào qua <strong>{CONTACT.email}</strong>.</li>
          </ul>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">

        <LegalSection icon={ShieldCheck} title="1. Phạm Vi Áp Dụng">
          <p>
            Chính sách này áp dụng cho mọi sản phẩm mang thương hiệu Pimi: website người thuê, website chủ nhà, ứng dụng di động Pimi, trang quản trị và các hệ thống vận hành phía sau, do <strong>{CONTACT.companyName}</strong> ("Pimi", "chúng tôi") vận hành. Chính sách áp dụng cho mọi vai trò — Người thuê, Chủ nhà, Quản lý toà nhà, Cộng tác viên/Môi giới; một tài khoản có thể giữ nhiều vai trò.
          </p>
        </LegalSection>

        <LegalSection icon={Database} title="2. Thông Tin Chúng Tôi Thu Thập">
          <p className="font-semibold text-slate-800">Thông tin Bạn cung cấp trực tiếp:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Thông tin tài khoản:</strong> họ tên, số điện thoại, email, mật khẩu (lưu dạng băm một chiều), ngày sinh, giới tính (tuỳ chọn), ảnh đại diện, ngôn ngữ hiển thị.</li>
            <li><strong>Giấy tờ xác minh danh tính (KYC):</strong> ảnh CCCD/CMND, bằng lái xe hoặc hộ chiếu (Bạn chọn một loại) và ảnh chân dung đối chiếu. Số giấy tờ chỉ được ghi vào hồ sơ sau khi được duyệt.</li>
            <li><strong>Thông tin ngân hàng:</strong> tên ngân hàng, số tài khoản, chủ tài khoản, chi nhánh — Chủ nhà cung cấp để nhận tiền thuê; Người thuê cung cấp khi yêu cầu hoàn tiền.</li>
            <li><strong>Nội dung Bạn tạo:</strong> tin đăng, ảnh phòng, mã giảm giá do Chủ nhà tạo, đánh giá, nội dung tố cáo kèm ảnh bằng chứng, hồ sơ hợp đồng dài hạn (người ở cùng, người liên hệ khẩn cấp nếu Bạn nhập), nội dung nhập vào công cụ viết/nhập liệu hỗ trợ bằng AI.</li>
          </ul>
          <p className="font-semibold text-slate-800">Thông tin phát sinh khi Bạn dùng dịch vụ:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Lịch sử đặt lịch xem phòng, đặt phòng, hoá đơn, voucher đã dùng, trạng thái thanh toán và hoàn tiền, mã tham chiếu giao dịch ngân hàng, lịch sử thông báo.</li>
          </ul>
          <p className="font-semibold text-slate-800">Thông tin kỹ thuật &amp; quyền truy cập thiết bị:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Vị trí gần đúng/chính xác của thiết bị</strong> — chỉ khi Bạn bật quyền định vị để dùng tính năng "phòng gần bạn" và tính khoảng cách; có thể từ chối mà vẫn tìm kiếm bình thường.</li>
            <li><strong>Máy ảnh và thư viện ảnh</strong> — chỉ khi Bạn chọn chụp/tải ảnh đại diện, ảnh phòng, ảnh giấy tờ hoặc ảnh bằng chứng.</li>
            <li>Token thiết bị để gửi thông báo đẩy, loại nền tảng (web/Android/iOS), nhật ký kỹ thuật ở mức hệ thống (địa chỉ IP, thời điểm và kết quả yêu cầu) phục vụ vận hành và bảo mật.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={Search} title="3. Cách Chúng Tôi Thu Thập Thông Tin">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Trực tiếp từ Bạn:</strong> khi đăng ký, cập nhật hồ sơ, đăng tin, đặt lịch/đặt phòng, gửi đánh giá/tố cáo, liên hệ hỗ trợ.</li>
            <li><strong>Tự động:</strong> qua thiết bị/trình duyệt khi dùng Nền tảng (vị trí nếu Bạn cho phép, token thông báo, nhật ký hệ thống).</li>
            <li><strong>Từ người dùng khác và đối tác:</strong> ví dụ Chủ nhà nhập thông tin người ở cùng khi tạo hợp đồng; một bên đánh giá/tố cáo liên quan đến Bạn; ngân hàng/đối tác thanh toán báo về giao dịch chuyển tiền vào tài khoản Pimi.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={Target} title="4. Mục Đích Sử Dụng Thông Tin">
          <p>Chúng tôi chỉ dùng dữ liệu cho các mục đích cần thiết để vận hành Nền tảng, thực hiện nghĩa vụ với Bạn, tuân thủ pháp luật hoặc khi Bạn đồng ý rõ ràng — không bán cho quảng cáo bên thứ ba:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Vận hành tài khoản &amp; xác thực:</strong> tạo, bảo mật, khôi phục tài khoản; phát hiện đăng nhập bất thường.</li>
            <li><strong>Kết nối cung — cầu:</strong> hiển thị tin đăng phù hợp, xử lý lịch xem phòng, đặt phòng, lập hợp đồng dài hạn.</li>
            <li><strong>Xử lý thanh toán:</strong> tạo mã QR, đối soát giao dịch ngân hàng, áp dụng voucher, tính hoa hồng, chi trả cho Chủ nhà, hoàn tiền, xuất hoá đơn.</li>
            <li><strong>Xác minh danh tính:</strong> giảm rủi ro lừa đảo, tin giả, tài khoản ảo — cho cả Người thuê lẫn Chủ nhà.</li>
            <li><strong>An toàn cộng đồng:</strong> xử lý tố cáo, khoá tài khoản vi phạm, điều tra gian lận, lưu bằng chứng phục vụ tranh chấp.</li>
            <li><strong>Thông báo dịch vụ:</strong> thông báo đẩy, email, tin nhắn Zalo về trạng thái lịch hẹn, đặt phòng, hoá đơn, kết quả xác minh, cảnh báo bảo mật.</li>
            <li><strong>Cải thiện sản phẩm:</strong> thống kê tổng hợp (không định danh khi có thể) về lượt xem, đặt phòng để quản lý và cải thiện dịch vụ.</li>
            <li><strong>Tuân thủ pháp luật:</strong> lưu chứng từ kế toán/thuế, phản hồi yêu cầu hợp pháp của cơ quan nhà nước có thẩm quyền.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={Share2} title="5. Chúng Tôi Chia Sẻ Thông Tin Như Thế Nào">
          <p className="font-semibold text-slate-800">Giữa Người thuê, Chủ nhà và người phụ trách toà nhà:</p>
          <p>Khi Bạn đặt lịch xem phòng hoặc đặt phòng, họ tên và số điện thoại được chia sẻ giữa các bên liên quan (Người thuê, Chủ nhà, Quản lý toà nhà, Cộng tác viên được gán toà nhà) để phối hợp xem/nhận/trả phòng. Chủ nhà <strong>không</strong> thấy ảnh giấy tờ xác minh của Người thuê; chỉ nhân sự Pimi được phân quyền xem khi xét duyệt hồ sơ.</p>
          <p className="font-semibold text-slate-800">Với bên xử lý thay Pimi (nhà cung cấp dịch vụ):</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Amazon Web Services (AWS S3):</strong> lưu ảnh phòng, ảnh hợp đồng, ảnh giấy tờ xác minh. Ảnh giấy tờ/hợp đồng ở chế độ riêng tư, chỉ truy cập qua đường dẫn có chữ ký, thời hạn ngắn.</li>
            <li><strong>Google Gemini (AI):</strong> hỗ trợ đọc thông tin từ ảnh giấy tờ để nhân sự duyệt nhanh hơn, hỗ trợ viết nội dung tin đăng và nhập liệu hàng loạt từ bảng tính. Kết quả AI luôn được người kiểm tra lại; hệ thống không tự động phê duyệt hồ sơ xác minh.</li>
            <li><strong>Tingee và ngân hàng liên kết:</strong> tạo mã QR thanh toán, nhận thông báo và đối soát giao dịch chuyển tiền vào tài khoản của Pimi (số tiền, nội dung chuyển khoản, thời điểm, thông tin tài khoản chuyển).</li>
            <li><strong>Zalo (ZNS):</strong> gửi tin nhắn thông báo dịch vụ tới số điện thoại của Bạn (ví dụ xác nhận lịch xem phòng). Đây là tin nhắn giao dịch, không phải quảng cáo.</li>
            <li><strong>Firebase Cloud Messaging (Google):</strong> gửi thông báo đẩy (token thiết bị, nội dung thông báo).</li>
            <li><strong>Dịch vụ email (SMTP):</strong> gửi email xác thực, mã OTP, khôi phục mật khẩu và thông báo giao dịch.</li>
            <li><strong>VietMap:</strong> hiển thị bản đồ, gợi ý địa chỉ, chỉ đường (toạ độ/địa chỉ phòng và toà nhà; vị trí thiết bị nếu Bạn bật tìm phòng gần bạn).</li>
          </ul>
          <p className="font-semibold text-slate-800">Vì lý do pháp lý:</p>
          <p>Chúng tôi có thể cung cấp thông tin khi cơ quan nhà nước có thẩm quyền yêu cầu hợp pháp, hoặc khi cần thiết để bảo vệ quyền, tài sản, an toàn của Pimi, người dùng hoặc cộng đồng.</p>
          <p className="font-semibold text-slate-800">Chúng tôi không:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Bán thông tin cá nhân của Bạn cho bên thứ ba vì mục đích quảng cáo.</li>
            <li>Chia sẻ ảnh giấy tờ xác minh cho Chủ nhà, môi giới hay bất kỳ người dùng nào khác.</li>
            <li>Chia sẻ dữ liệu cho đối tác chấm điểm tín dụng bên ngoài.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={Wallet} title="6. Thanh Toán Và Việc Giữ Hộ Tiền">
          <p>Khi Bạn thanh toán đặt phòng ngắn hạn qua mã QR trong ứng dụng, tiền được chuyển <strong>vào tài khoản ngân hàng của Pimi</strong> trước — không chuyển thẳng cho Chủ nhà.</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Sau khi Bạn xác nhận đặt phòng, hệ thống tạo mã QR chuyển khoản (VietQR) với số tiền và nội dung riêng cho đơn, có thời hạn thanh toán — quá hạn đơn tự hết hạn.</li>
            <li>Khi ngân hàng báo đã nhận tiền, đơn chuyển sang "Đã thanh toán" — số tiền này được <strong>Pimi giữ hộ cho Chủ nhà</strong> đến khi nhận phòng.</li>
            <li>Sau khi nhận phòng được xác nhận, Pimi đối soát và chuyển phần còn lại cho Chủ nhà, đã trừ hoa hồng (và đã tính voucher nếu có). Để chuyển khoản cho Chủ nhà, Pimi dùng thông tin tài khoản ngân hàng Chủ nhà đã cung cấp.</li>
            <li>Khi Bạn huỷ đơn đã thanh toán, tiền hoàn (nếu có) được chuyển về tài khoản Bạn đã khai trong yêu cầu huỷ.</li>
            <li>Hoá đơn thuê dài hạn có thể thanh toán qua mã QR vào tài khoản Pimi hoặc ghi nhận tiền mặt trực tiếp nếu hợp đồng chọn như vậy; khoản này hiện không bị trừ hoa hồng.</li>
          </ol>
          <p>Quy định huỷ và hoàn tiền xem tại <Link to="/terms" className="text-indigo-600 font-bold hover:underline">Điều khoản sử dụng</Link>, mục "Huỷ đơn, hoàn tiền &amp; tranh chấp". Pimi không lưu số thẻ ngân hàng của Bạn.</p>
        </LegalSection>

        <LegalSection icon={Lock} title="7. Bảo Mật Thông Tin">
          <ul className="list-disc pl-5 space-y-1">
            <li>Mật khẩu được băm một chiều — kể cả nhân viên Pimi cũng không xem được mật khẩu gốc.</li>
            <li>Kết nối giữa ứng dụng/website và máy chủ được mã hoá qua HTTPS.</li>
            <li>Ảnh giấy tờ xác minh và ảnh hợp đồng lưu ở chế độ riêng tư, chỉ truy cập qua đường dẫn có chữ ký, thời hạn ngắn.</li>
            <li>Chỉ nhân sự Pimi được phân quyền quản trị mới xét duyệt hồ sơ xác minh; hệ thống tự khoá tạm thời chức năng gửi hồ sơ sau 5 lần thất bại liên tiếp để hạn chế lạm dụng.</li>
            <li>Các thao tác nhạy cảm như đăng nhập, quên mật khẩu, vô hiệu hoá tài khoản có giới hạn tần suất và xác thực qua mã gửi tới email.</li>
            <li>Phiên đăng nhập dùng token có thời hạn, lưu trong cookie an toàn (HttpOnly) trên web để giảm rủi ro bị đánh cắp qua mã độc trên trình duyệt.</li>
          </ul>
          <p className="text-slate-500">Không hệ thống nào an toàn tuyệt đối. Nếu thấy dấu hiệu bất thường liên quan đến tài khoản, hãy đổi mật khẩu ngay và liên hệ Pimi qua {CONTACT.email} hoặc {CONTACT.phoneDisplay}.</p>
        </LegalSection>

        <LegalSection icon={Archive} title="8. Thời Gian Lưu Trữ Dữ Liệu">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Khi tài khoản đang hoạt động:</strong> lưu hồ sơ, tin đăng, lịch sử giao dịch để Bạn tiếp tục sử dụng dịch vụ.</li>
            <li><strong>Sau khi Bạn tự vô hiệu hoá tài khoản:</strong> dữ liệu được giữ ở trạng thái không hoạt động để Bạn có thể kích hoạt lại; tin đăng, hợp đồng, đánh giá liên quan vẫn hiển thị cho các bên liên quan trừ khi Bạn yêu cầu xoá riêng.</li>
            <li><strong>Chứng từ giao dịch, hoá đơn, đối soát thanh toán:</strong> lưu tối thiểu theo thời hạn pháp luật kế toán/thuế Việt Nam yêu cầu (hiện áp dụng mốc <strong>5 năm</strong>), kể cả khi Bạn đã yêu cầu xoá tài khoản.</li>
            <li><strong>Hồ sơ xác minh danh tính (đặc biệt hồ sơ bị từ chối):</strong> lưu trong thời gian cần thiết để xử lý khiếu nại, chống gian lận và tuân thủ pháp luật; bạn có thể yêu cầu xoá theo mục 9 (trừ phần pháp luật buộc phải giữ).</li>
            <li><strong>Ảnh tải lên nhưng không gắn vào tin đăng/hợp đồng/hồ sơ nào:</strong> được hệ thống tự dọn sau khoảng 24 giờ; ảnh bị xoá được loại khỏi kho lưu trữ theo lịch dọn hằng ngày.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={UserCheck} title="9. Quyền Của Bạn">
          <p>Theo quy định pháp luật Việt Nam về bảo vệ dữ liệu cá nhân, Bạn có các quyền sau:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Được biết:</strong> đọc chính sách này; hỏi thêm qua kênh hỗ trợ.</li>
            <li><strong>Truy cập, xem lại dữ liệu:</strong> xem/sửa trực tiếp trong Hồ sơ cá nhân; yêu cầu bản sao đầy đủ qua email.</li>
            <li><strong>Chỉnh sửa, cập nhật:</strong> tự cập nhật hồ sơ, hoặc gửi yêu cầu nếu trường thông tin đã bị khoá sau xác minh.</li>
            <li><strong>Rút lại sự đồng ý:</strong> với các quyền tuỳ chọn (vị trí, thông báo đẩy, máy ảnh, thư viện ảnh) — tắt trong cài đặt thiết bị/ứng dụng.</li>
            <li><strong>Hạn chế / phản đối xử lý:</strong> gửi yêu cầu qua email, nêu rõ mục đích muốn hạn chế.</li>
            <li><strong>Vô hiệu hoá tài khoản:</strong> tự thực hiện trong ứng dụng (xác thực qua mã OTP gửi tới email); có thể yêu cầu kích hoạt lại bằng cùng cách.</li>
            <li>
              <strong>Yêu cầu xoá dữ liệu:</strong> gửi yêu cầu tới{' '}
              <a href={CONTACT_MAILTO_HREF} className="font-semibold text-indigo-600 hover:underline">{CONTACT.email}</a>
              {' '}kèm họ tên và số điện thoại đăng ký để chúng tôi xác minh chính chủ. Chúng tôi xử lý trong thời hạn pháp luật quy định, trừ phần dữ liệu buộc phải giữ lại (mục 8).
            </li>
            <li><strong>Khiếu nại:</strong> liên hệ Pimi trước; nếu chưa thoả đáng, Bạn có quyền khiếu nại tới cơ quan nhà nước có thẩm quyền về bảo vệ dữ liệu cá nhân.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={Cookie} title="10. Cookie Và Công Nghệ Tương Tự">
          <p>Chúng tôi dùng cookie ở mức tối thiểu cần thiết để vận hành: cookie phiên đăng nhập (giữ Bạn đăng nhập giữa các lần truy cập) và cookie chống giả mạo yêu cầu (CSRF) — bắt buộc để website hoạt động đúng; tắt cookie sẽ khiến Bạn không đăng nhập được. Trình duyệt cũng có thể lưu cục bộ một số tuỳ chọn như ngôn ngữ hiển thị.</p>
          <p>Chúng tôi hiện <strong>không</strong> dùng cookie quảng cáo hay cookie theo dõi hành vi của bên thứ ba (ví dụ Google Ads, Facebook Pixel).</p>
        </LegalSection>

        <LegalSection icon={ShieldAlert} title="11. Người Dưới 18 Tuổi">
          <p>Pimi không hướng đến và không cố ý thu thập dữ liệu của người dưới 18 tuổi — đặt phòng, ký hợp đồng và giao dịch tài chính trên Nền tảng đòi hỏi đầy đủ năng lực hành vi dân sự. Nếu phát hiện tài khoản của người dưới 18 tuổi, chúng tôi sẽ vô hiệu hoá tài khoản và xoá dữ liệu liên quan, trừ phần pháp luật buộc phải lưu.</p>
        </LegalSection>

        <LegalSection icon={Globe2} title="12. Lưu Trữ Và Chuyển Dữ Liệu">
          <p>Dữ liệu được lưu trên hạ tầng máy chủ và lưu trữ đám mây do Pimi lựa chọn nhà cung cấp (hiện gồm AWS), có thể đặt tại trung tâm dữ liệu trong hoặc ngoài lãnh thổ Việt Nam tuỳ cấu hình từng thời điểm. Một số nhà cung cấp ở mục 5 (như Google, AWS) xử lý dữ liệu ngoài Việt Nam; khi đó chúng tôi yêu cầu bên xử lý áp dụng biện pháp bảo vệ tương đương chính sách này và tuân thủ quy định pháp luật hiện hành về chuyển dữ liệu cá nhân xuyên biên giới.</p>
        </LegalSection>

        <LegalSection icon={RefreshCw} title="13. Thay Đổi Chính Sách">
          <p>Chúng tôi có thể cập nhật chính sách này khi tính năng hoặc quy định pháp luật thay đổi. Thay đổi quan trọng được thông báo qua email hoặc thông báo trong ứng dụng trước khi có hiệu lực. Ngày "hiệu lực" ở đầu trang luôn phản ánh phiên bản mới nhất.</p>
        </LegalSection>

        <LegalSection icon={Phone} title="14. Thông Tin Liên Hệ">
          <p>Mọi câu hỏi, yêu cầu thực hiện quyền về dữ liệu cá nhân hoặc báo cáo sự cố bảo mật, vui lòng liên hệ:</p>
          <LegalContactList />
        </LegalSection>

        <p className="text-xs text-slate-400 pt-4 border-t border-slate-200">
          Bản quyền thuộc về {CONTACT.companyName}. Mọi sự sao chép hoặc phát hành lại một phần hay toàn bộ chính sách này mà không được sự đồng ý bằng văn bản của Pimi đều bị coi là vi phạm.
        </p>

      </div>
    </div>
  );
};
