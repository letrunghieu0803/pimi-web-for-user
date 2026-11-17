import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  FileText,
  BookOpen,
  UserCheck,
  IdCard,
  Home,
  CalendarCheck,
  Wallet,
  Ticket,
  FileSignature,
  Percent,
  RotateCcw,
  Star,
  Ban,
  ShieldOff,
  Scale,
  Handshake,
  Gavel,
  ListChecks,
  Phone
} from 'lucide-react';
import { Seo } from '@/components/common/Seo';
import { LegalContactList, LegalSection } from '@/components/legal/LegalSection';
import { CONTACT, LEGAL_VERSION } from '@/constants/contact';

export const Terms: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <Seo title={t('seo.termsTitle')} description={t('seo.termsDescription')} path="/terms" />

      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>{t('terms.badge')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          {t('terms.title')}
        </h1>
        <p className="text-xs text-slate-500">
          Ngày hiệu lực: {LEGAL_VERSION.effectiveDate} · Phiên bản {LEGAL_VERSION.version} · {CONTACT.companyName}
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Điều khoản này là thoả thuận giữa Bạn và Pimi khi Bạn tạo tài khoản, đăng tin, đặt lịch xem phòng, đặt phòng hoặc sử dụng bất kỳ tính năng nào trên website và ứng dụng Pimi. Vui lòng đọc kỹ trước khi sử dụng, đặc biệt các mục về thanh toán, mã giảm giá, huỷ/hoàn tiền và giới hạn trách nhiệm — áp dụng cùng{' '}
          <Link to="/privacy" className="text-indigo-600 font-bold hover:underline">Chính sách bảo mật Pimi</Link>.
        </p>
        <div className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
          <p><strong>Tóm tắt nhanh (không thay thế nội dung đầy đủ bên dưới):</strong></p>
          <ul className="list-disc pl-4 space-y-0.5 font-medium">
            <li>Bạn phải từ <strong>18 tuổi</strong> trở lên và cung cấp thông tin đúng sự thật khi tạo tài khoản, đăng tin.</li>
            <li>Pimi là <strong>nền tảng trung gian kết nối</strong>, không phải bên cho thuê hay bên thuê; riêng tiền đặt phòng ngắn hạn, Pimi <strong>thu hộ và giữ hộ</strong> qua tài khoản ngân hàng của Pimi trước khi chuyển cho chủ nhà (mục 8).</li>
            <li>Đơn đã thanh toán muốn huỷ thì gửi <strong>yêu cầu huỷ trong ứng dụng</strong>; mức hoàn gợi ý theo mốc thời gian còn lại đến giờ nhận phòng, <strong>Pimi xem xét và chốt mức hoàn chính thức</strong> (mục 12).</li>
            <li>Xác minh danh tính (KYC) có công nghệ hỗ trợ đọc giấy tờ nhưng <strong>được nhân sự Pimi duyệt thủ công</strong> — giấy tờ giả có thể bị khoá tài khoản vĩnh viễn.</li>
          </ul>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">

        <LegalSection icon={BookOpen} title="1. Chấp Nhận Điều Khoản">
          <p>
            Điều khoản sử dụng này ("Điều khoản") là thoả thuận có giá trị ràng buộc giữa Bạn và <strong>{CONTACT.companyName}</strong> ("Pimi", "chúng tôi"), áp dụng cho website người thuê, website chủ nhà, ứng dụng di động và các dịch vụ liên quan mang thương hiệu Pimi ("Nền tảng").
          </p>
          <p>
            Bằng việc tạo tài khoản, nhấn "Đồng ý", hoặc tiếp tục sử dụng Nền tảng, Bạn xác nhận đã đọc, hiểu và đồng ý bị ràng buộc bởi Điều khoản này cùng Chính sách bảo mật Pimi. Nếu không đồng ý, vui lòng ngừng sử dụng Nền tảng.
          </p>
        </LegalSection>

        <LegalSection icon={ListChecks} title="2. Định Nghĩa">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Người thuê:</strong> người dùng tìm kiếm phòng, đặt lịch xem phòng, đặt phòng ngắn hạn hoặc ký hợp đồng thuê dài hạn qua Nền tảng.</li>
            <li><strong>Chủ nhà:</strong> người dùng đăng tin cho thuê phòng/toà nhà thuộc quyền sở hữu hoặc quyền cho thuê hợp pháp của mình.</li>
            <li><strong>Quản lý toà nhà:</strong> người được Chủ nhà uỷ quyền quản lý một phần hoạt động cho thuê của toà nhà.</li>
            <li><strong>Cộng tác viên / Môi giới:</strong> người được gán phụ trách toà nhà để tiếp khách, dẫn khách xem phòng và hỗ trợ xử lý lịch hẹn theo phân quyền trên Nền tảng.</li>
            <li><strong>Tin đăng:</strong> thông tin phòng/toà nhà do Chủ nhà đăng công khai trên Nền tảng.</li>
            <li><strong>Lịch xem phòng:</strong> yêu cầu hẹn xem phòng trực tiếp do Người thuê tạo và được Chủ nhà/Quản lý/Cộng tác viên xác nhận.</li>
            <li><strong>Đặt phòng ngắn hạn:</strong> giao dịch thuê phòng theo ngày hoặc theo giờ, thanh toán qua mã QR ngay trong Nền tảng.</li>
            <li><strong>Hợp đồng:</strong> hồ sơ thuê dài hạn được lập trên Nền tảng giữa Chủ nhà và Người thuê, có thời hạn tính theo tháng.</li>
            <li><strong>Voucher:</strong> mã giảm giá áp dụng cho đặt phòng ngắn hạn, do Pimi hoặc Chủ nhà phát hành.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={UserCheck} title="3. Tài Khoản Người Dùng">
          <ul className="list-disc pl-5 space-y-1">
            <li>Bạn phải đủ <strong>18 tuổi</strong> và có đầy đủ năng lực hành vi dân sự để tạo tài khoản và giao dịch trên Nền tảng.</li>
            <li>Thông tin đăng ký (họ tên, số điện thoại, email) phải chính xác, đầy đủ và được cập nhật khi có thay đổi. Pimi có quyền tạm khoá tài khoản nếu phát hiện thông tin sai sự thật.</li>
            <li>Bạn chịu trách nhiệm bảo mật mật khẩu và mọi hoạt động diễn ra dưới tài khoản của mình; báo ngay cho Pimi nếu nghi ngờ tài khoản bị truy cập trái phép.</li>
            <li>Một cá nhân có thể đồng thời giữ vai trò Người thuê và Chủ nhà trên cùng một tài khoản; mỗi người chỉ được sở hữu một tài khoản cá nhân.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={IdCard} title="4. Xác Minh Danh Tính (KYC)">
          <div className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <strong>Lưu ý quan trọng:</strong> quy trình xác minh của Pimi dùng công nghệ trí tuệ nhân tạo để hỗ trợ đọc thông tin từ ảnh giấy tờ, nhưng <strong>mọi hồ sơ đều được nhân sự Pimi trực tiếp kiểm tra và phê duyệt thủ công</strong> trước khi tài khoản được gắn nhãn "Đã xác minh". Đây không phải dịch vụ xác thực điện tử (eKYC) chính thức của cơ quan nhà nước và không thay thế các hình thức xác minh pháp lý khác khi cần thiết.
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Để đăng tin cho thuê hoặc dùng một số tính năng, Bạn có thể được yêu cầu cung cấp ảnh CCCD/CMND, bằng lái xe hoặc hộ chiếu (chọn một loại), kèm ảnh chân dung đối chiếu.</li>
            <li>Bạn cam kết giấy tờ là thật, hợp lệ và thuộc về chính mình. Cung cấp giấy tờ giả mạo hoặc mượn danh người khác có thể bị khoá tài khoản vĩnh viễn và bị báo cáo tới cơ quan chức năng khi cần.</li>
            <li>Hồ sơ có thể bị từ chối nếu ảnh không rõ, thông tin không khớp hoặc có dấu hiệu chỉnh sửa. Sau <strong>5 lần</strong> gửi thất bại liên tiếp, hệ thống tạm khoá chức năng gửi hồ sơ để chống lạm dụng — liên hệ Pimi để được hỗ trợ mở lại.</li>
            <li>Nhãn "Đã xác minh" giúp tăng độ tin cậy nhưng <strong>không phải bảo đảm tuyệt đối</strong>; Bạn vẫn nên kiểm tra thực tế hợp lý trước khi ký hợp đồng hoặc giao dịch giá trị lớn.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={Scale} title="5. Vai Trò Của Pimi">
          <p>Pimi vận hành nền tảng công nghệ giúp Người thuê và Chủ nhà tìm thấy, trao đổi và giao dịch với nhau. Trừ khi nêu rõ khác, <strong>Pimi không phải là một bên trong quan hệ thuê nhà</strong> giữa Người thuê và Chủ nhà — Chủ nhà chịu trách nhiệm về tính hợp pháp của việc cho thuê, tình trạng thực tế của phòng và việc thực hiện đúng cam kết với Người thuê.</p>
          <p>Ngoại lệ: với các khoản thanh toán đặt phòng ngắn hạn thực hiện qua Nền tảng, Pimi đóng vai trò <strong>thu hộ và giữ hộ tiền</strong> trước khi chuyển cho Chủ nhà (mục 8). Vai trò này chỉ giới hạn ở việc trung chuyển tài chính, không biến Pimi thành bên cho thuê hay bảo lãnh chất lượng phòng.</p>
        </LegalSection>

        <LegalSection icon={Home} title="6. Đăng Tin Cho Thuê">
          <ul className="list-disc pl-5 space-y-1">
            <li>Chủ nhà cam kết có quyền hợp pháp để cho thuê phòng/toà nhà đăng tin, và mọi thông tin trong tin đăng (giá, diện tích, tiện ích, hình ảnh, địa chỉ, giờ nhận/trả phòng) là chính xác, đúng thực tế.</li>
            <li>Hình ảnh đăng tải phải là ảnh thật của phòng/toà nhà và thuộc quyền sử dụng hợp pháp của Chủ nhà.</li>
            <li>Chủ nhà tự chịu trách nhiệm về giá, cấu hình thuê theo ngày/theo giờ và các mã giảm giá do mình tạo.</li>
            <li>Pimi có quyền, nhưng không có nghĩa vụ, rà soát, yêu cầu chỉnh sửa hoặc gỡ bất kỳ tin đăng nào vi phạm Điều khoản này hoặc pháp luật. Việc tin đăng xuất hiện trên Nền tảng không đồng nghĩa Pimi bảo đảm tính chính xác tuyệt đối của nội dung đó.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={CalendarCheck} title="7. Đặt Lịch Xem Phòng">
          <ul className="list-disc pl-5 space-y-1">
            <li>Người thuê có thể gửi yêu cầu hẹn xem phòng miễn phí; lịch chỉ có hiệu lực khi được Chủ nhà, Quản lý toà nhà hoặc Cộng tác viên phụ trách xác nhận.</li>
            <li>Khi lịch được tạo hoặc thay đổi, Pimi gửi thông báo (trong ứng dụng, thông báo đẩy, email hoặc tin nhắn Zalo) tới các bên liên quan, và chia sẻ họ tên, số điện thoại giữa các bên để phối hợp buổi xem.</li>
            <li>Vui lòng đến đúng giờ hoặc báo huỷ/dời lịch sớm để Chủ nhà và Cộng tác viên chủ động sắp xếp.</li>
            <li>Việc xem phòng không tạo ra nghĩa vụ thuê; thoả thuận thuê chỉ hình thành khi Bạn đặt phòng hoặc ký hợp đồng với Chủ nhà.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={Wallet} title="8. Đặt Phòng Ngắn Hạn & Thanh Toán">
          <p className="font-semibold text-slate-800">Quy trình đặt phòng:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Bạn chọn hình thức thuê theo ngày hoặc theo giờ, thời điểm nhận/trả phòng; hệ thống báo giá theo công thức đã công bố, hiển thị rõ giá niêm yết, mã giảm giá (nếu có) và số tiền phải trả <strong>trước khi</strong> Bạn xác nhận.</li>
            <li>Sau khi xác nhận, hệ thống kiểm tra phòng còn trống đúng khoảng thời gian đã chọn và tạo mã QR chuyển khoản (chuẩn VietQR) có thời hạn thanh toán hiển thị ngay trên màn hình thanh toán.</li>
            <li>Quá thời hạn mà chưa nhận được tiền, đơn tự động hết hạn và phòng được mở lại cho người khác đặt. Bạn cần chuyển <strong>đúng số tiền và đúng nội dung</strong> trên mã QR để hệ thống tự động ghi nhận.</li>
            <li>Khi ngân hàng xác nhận đã nhận tiền, đơn chuyển sang "Đã thanh toán". Bạn liên hệ Chủ nhà/Quản lý toà nhà theo thông tin hiển thị để nhận phòng đúng lịch.</li>
          </ol>
          <p className="font-semibold text-slate-800">Thu hộ &amp; giữ hộ tiền:</p>
          <p>Tiền thanh toán được chuyển vào tài khoản ngân hàng của Pimi và được giữ hộ cho Chủ nhà. Sau khi nhận phòng được xác nhận, Pimi đối soát và chuyển khoản phần còn lại cho Chủ nhà, đã trừ hoa hồng dịch vụ (mục 11). Giao dịch chuyển nhầm số tiền, chuyển sau hạn hoặc không đúng nội dung sẽ được Pimi đối soát thủ công, có thể mất thêm thời gian xử lý.</p>
          <p className="font-semibold text-slate-800">Phòng theo giờ và theo ngày:</p>
          <p>Một số phòng cho đặt theo giờ (số giờ tối thiểu/tối đa, khung giờ nhận khách và thời gian dọn phòng do Chủ nhà đặt), một số phòng đặt theo ngày/đêm với giờ nhận–trả phòng được công bố trên tin đăng. Một phòng có thể bán một hoặc cả hai hình thức.</p>
        </LegalSection>

        <LegalSection icon={Ticket} title="9. Mã Giảm Giá (Voucher)">
          <ul className="list-disc pl-5 space-y-1">
            <li>Voucher chỉ áp dụng cho đặt phòng ngắn hạn, nhập ở bước báo giá; mỗi đơn dùng một mã. Mã không phân biệt chữ hoa/chữ thường.</li>
            <li>Mỗi voucher có điều kiện riêng — thời hạn hiệu lực, tổng số lượt dùng, số lượt tối đa mỗi người, mức giảm tối đa và phạm vi toà nhà áp dụng. Mã hết hạn, hết lượt hoặc không áp dụng cho phòng bạn chọn sẽ bị từ chối kèm thông báo lý do.</li>
            <li>Voucher do <strong>Pimi</strong> phát hành được trừ vào phần hoa hồng của Pimi (Chủ nhà vẫn nhận đủ tiền phòng); voucher do <strong>Chủ nhà</strong> phát hành được trừ vào phần tiền Chủ nhà nhận (hoa hồng Pimi vẫn tính trên giá niêm yết). Nền tảng luôn để lại một khoản tối thiểu khách phải trả.</li>
            <li>Số tiền Bạn phải trả đã bao gồm giảm giá. Khi huỷ/hoàn tiền, mức hoàn được tính trên <strong>số tiền Bạn thực trả</strong>; voucher không quy đổi thành tiền mặt và có thể không được hoàn lượt dùng.</li>
            <li>Pimi và Chủ nhà có quyền tắt hoặc xoá voucher bất kỳ lúc nào, và từ chối/thu hồi ưu đãi nếu phát hiện lạm dụng (nhiều tài khoản để dùng lại mã, gian lận đơn…). Đơn đã xác nhận trước đó giữ nguyên mức giá đã báo.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={FileSignature} title="10. Hợp Đồng Thuê Dài Hạn & Hoá Đơn">
          <ul className="list-disc pl-5 space-y-1">
            <li>Với thuê dài hạn, Chủ nhà và Người thuê lập hồ sơ Hợp đồng trên Nền tảng, ghi nhận thời hạn thuê, chu kỳ thanh toán, ngày thu tiền và phương thức thanh toán (chuyển khoản qua mã QR hoặc tiền mặt trực tiếp, tuỳ hai bên thống nhất).</li>
            <li>Tại thời điểm ký, Nền tảng lưu lại thông tin phòng, dịch vụ, tiện ích đang áp dụng; thay đổi giá/tiện ích sau này của Chủ nhà không tự áp dụng ngược cho hợp đồng đã ký.</li>
            <li>Hoá đơn tiền thuê và dịch vụ định kỳ được hệ thống tự tạo trước ngày đến hạn và gửi thông báo nhắc thanh toán.</li>
            <li><strong>Hợp đồng lập trên Nền tảng là hồ sơ hỗ trợ quản lý và ghi nhận thoả thuận giữa hai bên</strong>, không thay thế việc công chứng/chứng thực nếu pháp luật hoặc giao dịch của Bạn yêu cầu hình thức đó.</li>
            <li>Việc chấm dứt hợp đồng trước hạn theo điều khoản hai bên đã thoả thuận; Pimi hỗ trợ ghi nhận và thông báo nhưng không tự ý can thiệp thoả thuận dân sự giữa hai bên, trừ khi có tố cáo vi phạm.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={Percent} title="11. Hoa Hồng & Phí Dịch Vụ">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Đặt phòng ngắn hạn:</strong> Pimi thu hoa hồng theo tỷ lệ phần trăm công bố trong cài đặt nền tảng, tính trên giá niêm yết của đơn. Tỷ lệ áp dụng được chốt tại thời điểm đặt phòng; Người thuê không phải trả thêm phí ẩn ngoài số tiền ghi trên báo giá.</li>
            <li><strong>Hợp đồng thuê dài hạn:</strong> hoá đơn tiền thuê/dịch vụ định kỳ hiện <strong>không</strong> bị trừ hoa hồng.</li>
            <li><strong>Gói thành viên của Chủ nhà (nếu áp dụng):</strong> Chủ nhà có thể đăng ký gói trả phí để mở rộng số lượng tin đăng hoặc tính năng; giá và quyền lợi hiển thị tại mục nâng cấp tài khoản.</li>
            <li>Pimi có quyền điều chỉnh tỷ lệ hoa hồng hoặc phí cho các giao dịch phát sinh <strong>sau</strong> thời điểm thay đổi có hiệu lực; đơn đã xác nhận trước đó giữ nguyên mức tại thời điểm đặt.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={RotateCcw} title="12. Huỷ Đơn, Hoàn Tiền & Tranh Chấp">
          <p className="font-semibold text-slate-800">Đơn chưa thanh toán:</p>
          <p>Bạn có thể huỷ ngay trong ứng dụng/website; vì chưa có tiền được chuyển nên không phát sinh khoản hoàn nào. Đơn quá thời hạn thanh toán tự động hết hạn.</p>
          <p className="font-semibold text-slate-800">Đơn đã thanh toán, chưa nhận phòng:</p>
          <p>Bạn gửi <strong>yêu cầu huỷ</strong> trong ứng dụng/website (kèm thông tin tài khoản ngân hàng nhận tiền hoàn). Hệ thống hiển thị mức hoàn <strong>gợi ý</strong> theo thời gian còn lại đến giờ nhận phòng:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Huỷ trong vòng <strong>2 giờ</strong> kể từ lúc đặt và còn ít nhất <strong>4 giờ</strong> tới giờ nhận phòng: hoàn <strong>100%</strong>.</li>
            <li>Còn từ <strong>3 ngày</strong> trở lên tới giờ nhận phòng: hoàn <strong>100%</strong>.</li>
            <li>Còn từ <strong>1 ngày</strong> đến dưới 3 ngày: hoàn <strong>50%</strong>.</li>
            <li>Còn dưới 1 ngày, hoặc không đến nhận phòng: <strong>không hoàn tiền</strong>, trừ trường hợp lỗi thuộc về Chủ nhà.</li>
          </ul>
          <p>Mức trên là <strong>gợi ý</strong>: Pimi xem xét từng yêu cầu và xác nhận mức hoàn chính thức (có thể khác gợi ý trong trường hợp đặc biệt, kèm lý do). Tiền hoàn được chuyển về tài khoản Bạn đã khai; trạng thái yêu cầu (đã gửi, đã duyệt, đã hoàn, chưa được chấp nhận) hiển thị trong ứng dụng và Bạn nhận thông báo khi có cập nhật. Phần tiền được giữ lại (nếu có) được chia cho Chủ nhà sau khi trừ hoa hồng theo tỷ lệ đã chốt lúc đặt.</p>
          <p className="font-semibold text-slate-800">Khi lỗi thuộc về Chủ nhà:</p>
          <p>Nếu Chủ nhà từ chối giao phòng dù Bạn đã thanh toán đúng hạn và đến đúng lịch, hoặc phòng thực tế sai khác nghiêm trọng so với tin đăng, hãy liên hệ Pimi ngay (mục 20) kèm mã đơn và bằng chứng, hoặc gửi tố cáo (mục 13) để Pimi xử lý và quyết định mức hoàn phù hợp, có thể lên tới 100%.</p>
          <p className="font-semibold text-slate-800">Đơn đã nhận phòng:</p>
          <p>Đơn đã ghi nhận nhận phòng không thể huỷ tự động trong ứng dụng; mọi khiếu nại sau thời điểm này vui lòng liên hệ Pimi để được xem xét theo từng trường hợp.</p>
          <p className="font-semibold text-slate-800">Hợp đồng dài hạn:</p>
          <p>Việc huỷ/chấm dứt hợp đồng dài hạn tuân theo thoả thuận trong hợp đồng giữa hai bên (xem mục 10).</p>
        </LegalSection>

        <LegalSection icon={Star} title="13. Đánh Giá & Tố Cáo">
          <p className="font-semibold text-slate-800">Đánh giá:</p>
          <p>Chỉ Người thuê đã đặt phòng thành công mới có thể để lại đánh giá cho phòng đó, mỗi người một đánh giá cho mỗi phòng. Đánh giá phải trung thực, dựa trên trải nghiệm thật — cấm đăng đánh giá giả hoặc công kích cá nhân. Pimi có quyền ẩn điểm số hoặc nội dung vi phạm mà không cần xoá toàn bộ đánh giá.</p>
          <p className="font-semibold text-slate-800">Tố cáo:</p>
          <p>Bạn có thể tố cáo một tin đăng vì thông tin sai lệch, dấu hiệu lừa đảo, không đúng mô tả, vi phạm cam kết, điều kiện không an toàn, quấy rối hoặc lý do khác, kèm mô tả và bằng chứng (nếu có). Pimi tiếp nhận, thông báo cho Chủ nhà phản hồi, rồi ra quyết định — có thể là bỏ qua, nhắc nhở/cảnh cáo, gỡ tin hoặc khoá tài khoản vi phạm tuỳ mức độ.</p>
          <p className="text-slate-500">Gửi tố cáo sai sự thật nhằm hạ uy tín người khác cũng là vi phạm Điều khoản này.</p>
        </LegalSection>

        <LegalSection icon={Ban} title="14. Hành Vi Bị Nghiêm Cấm">
          <p>Khi sử dụng Nền tảng, Bạn không được:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Cung cấp thông tin, giấy tờ, hình ảnh giả mạo hoặc gây hiểu nhầm.</li>
            <li>Lừa đảo, chiếm đoạt tài sản, rửa tiền hoặc lợi dụng Nền tảng cho giao dịch bất hợp pháp.</li>
            <li>Quấy rối, đe doạ, phân biệt đối xử với người dùng khác.</li>
            <li>Cố ý lách hoa hồng bằng cách hoàn tất ngoài Nền tảng một giao dịch đã bắt đầu trong ứng dụng.</li>
            <li>Lạm dụng voucher (tạo nhiều tài khoản để dùng lại mã, khai báo sai để hưởng ưu đãi).</li>
            <li>Thu thập, khai thác dữ liệu người dùng khác ngoài mục đích giao dịch hợp lệ; dùng bot, scraper để truy cập hoặc sao chép dữ liệu khi chưa được phép.</li>
            <li>Đăng tin trùng lặp, tin cho phòng không có thật hoặc không còn khả năng cho thuê.</li>
            <li>Can thiệp, phá hoại hoặc cố truy cập trái phép vào hệ thống, tài khoản của người khác.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={ShieldOff} title="15. Tạm Khoá & Chấm Dứt Tài Khoản">
          <ul className="list-disc pl-5 space-y-1">
            <li>Bạn có thể tự vô hiệu hoá tài khoản bất kỳ lúc nào qua xác thực mã OTP gửi tới email đã đăng ký, và yêu cầu kích hoạt lại bằng cùng cách.</li>
            <li>Pimi có quyền tạm khoá hoặc chấm dứt tài khoản vi phạm Điều khoản, có hoặc không báo trước tuỳ mức độ.</li>
            <li>Khi tài khoản bị khoá do vi phạm, các giao dịch đang chờ xử lý có thể bị huỷ; nghĩa vụ tài chính đã phát sinh vẫn còn hiệu lực.</li>
            <li>Việc chấm dứt tài khoản không ảnh hưởng quyền và nghĩa vụ đã phát sinh trước đó giữa các bên.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={Scale} title="16. Giới Hạn Trách Nhiệm">
          <p className="text-slate-500">Trong phạm vi tối đa pháp luật cho phép:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Pimi cung cấp Nền tảng trên cơ sở "hiện có", không cam kết hoạt động không gián đoạn hoặc không có lỗi tuyệt đối; việc ghi nhận thanh toán phụ thuộc vào hệ thống của ngân hàng và đối tác thanh toán.</li>
            <li>Pimi không chịu trách nhiệm về tình trạng thực tế của phòng/toà nhà, hành vi của Chủ nhà hoặc Người thuê, hay thoả thuận dân sự phát sinh ngoài phạm vi thanh toán xử lý qua Nền tảng.</li>
            <li>Trách nhiệm bồi thường của Pimi (nếu có, do lỗi trực tiếp của hệ thống Pimi) không vượt quá tổng phí dịch vụ Bạn đã trả cho Pimi liên quan tới giao dịch tranh chấp trong 6 tháng gần nhất.</li>
            <li>Pimi không chịu trách nhiệm cho thiệt hại gián tiếp, ngẫu nhiên hoặc hệ quả phát sinh từ việc sử dụng hoặc không thể sử dụng Nền tảng.</li>
            <li>Giới hạn trên không áp dụng cho các nghĩa vụ mà pháp luật không cho phép loại trừ hoặc giới hạn.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={Handshake} title="17. Bồi Thường Thiệt Hại">
          <p>Bạn đồng ý bồi thường và giữ cho Pimi không bị thiệt hại phát sinh từ khiếu nại của bên thứ ba liên quan tới việc Bạn vi phạm Điều khoản này, vi phạm pháp luật hoặc vi phạm quyền của bên thứ ba khi sử dụng Nền tảng.</p>
        </LegalSection>

        <LegalSection icon={Gavel} title="18. Luật Áp Dụng & Giải Quyết Tranh Chấp">
          <ul className="list-disc pl-5 space-y-1">
            <li>Điều khoản này được điều chỉnh bởi pháp luật nước Cộng hoà Xã hội Chủ nghĩa Việt Nam.</li>
            <li>Khi phát sinh tranh chấp, các bên ưu tiên thương lượng, hoà giải thiện chí thông qua Pimi trước.</li>
            <li>Nếu không đạt thoả thuận, tranh chấp được giải quyết tại Toà án có thẩm quyền theo pháp luật Việt Nam.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={ListChecks} title="19. Điều Khoản Chung Khác">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Thay đổi Điều khoản:</strong> Pimi có thể cập nhật Điều khoản này; thay đổi quan trọng được thông báo qua email hoặc thông báo trong ứng dụng trước khi có hiệu lực. Tiếp tục sử dụng Nền tảng sau khi thay đổi có hiệu lực nghĩa là Bạn chấp nhận Điều khoản mới.</li>
            <li><strong>Hiệu lực từng phần:</strong> nếu một điều khoản bị tuyên vô hiệu, các điều khoản còn lại vẫn có hiệu lực.</li>
            <li><strong>Không từ bỏ quyền:</strong> việc Pimi chưa thực hiện ngay một quyền không đồng nghĩa từ bỏ quyền đó.</li>
            <li><strong>Toàn bộ thoả thuận:</strong> Điều khoản này cùng Chính sách bảo mật là toàn bộ thoả thuận giữa Bạn và Pimi về việc sử dụng Nền tảng.</li>
          </ul>
        </LegalSection>

        <LegalSection icon={Phone} title="20. Liên Hệ">
          <p>Mọi câu hỏi về Điều khoản sử dụng, khiếu nại giao dịch hoặc yêu cầu hỗ trợ, vui lòng liên hệ:</p>
          <LegalContactList />
        </LegalSection>

        <p className="text-xs text-slate-400 pt-4 border-t border-slate-200">
          Bản quyền thuộc về {CONTACT.companyName}. Mọi sự sao chép hoặc phát hành lại một phần hay toàn bộ điều khoản này mà không được sự đồng ý bằng văn bản của Pimi đều bị coi là vi phạm.
        </p>

      </div>
    </div>
  );
};
