import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  FileText,
  BookOpen,
  UserCheck,
  IdCard,
  Home,
  Wallet,
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
        <p className="text-xs text-slate-500">{t('terms.effectiveDate')}</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Điều khoản này là thoả thuận giữa Bạn và Pimi khi Bạn tạo tài khoản, đăng tin, đặt phòng, hoặc sử dụng bất kỳ tính năng nào trên website và ứng dụng Pimi. Vui lòng đọc kỹ trước khi sử dụng, đặc biệt các mục về thanh toán, huỷ/hoàn tiền và giới hạn trách nhiệm — áp dụng cùng{' '}
          <Link to="/privacy" className="text-indigo-600 font-bold hover:underline">Chính sách bảo mật Pimi</Link>.
        </p>
        <div className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
          <p><strong>Tóm tắt nhanh (không thay thế nội dung đầy đủ bên dưới):</strong></p>
          <ul className="list-disc pl-4 space-y-0.5 font-medium">
            <li>Bạn phải từ <strong>18 tuổi</strong> trở lên, cung cấp thông tin đúng sự thật khi tạo tài khoản và đăng tin.</li>
            <li>Pimi là <strong>nền tảng trung gian kết nối</strong>, không phải bên cho thuê hay bên thuê, nhưng <strong>có thu hộ và giữ hộ tiền</strong> thanh toán ngắn hạn qua tài khoản ngân hàng của Pimi trước khi chuyển cho chủ nhà (mục 7).</li>
            <li>Xác minh danh tính (KYC) có hỗ trợ AI đọc giấy tờ nhưng <strong>được nhân sự Pimi duyệt thủ công</strong> — cung cấp giấy tờ giả có thể bị khoá tài khoản vĩnh viễn.</li>
          </ul>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            1. Chấp Nhận Điều Khoản
          </h2>
          <p>
            Điều khoản sử dụng này ("Điều khoản") là thoả thuận có giá trị ràng buộc giữa Bạn và <strong>Công ty TNHH Pimi Nest</strong> ("Pimi", "chúng tôi"), áp dụng cho toàn bộ website, ứng dụng di động và dịch vụ liên quan mang thương hiệu Pimi ("Nền tảng").
          </p>
          <p>
            Bằng việc tạo tài khoản, nhấn "Đồng ý", hoặc tiếp tục sử dụng Nền tảng, Bạn xác nhận đã đọc, hiểu và đồng ý bị ràng buộc bởi Điều khoản này cùng Chính sách bảo mật Pimi. Nếu không đồng ý, vui lòng ngừng sử dụng Nền tảng.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-indigo-600" />
            2. Định Nghĩa
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Người thuê:</strong> người dùng tìm kiếm, đặt phòng ngắn hạn hoặc ký hợp đồng thuê dài hạn qua Nền tảng.</li>
            <li><strong>Chủ nhà:</strong> người dùng đăng tin cho thuê phòng/toà nhà thuộc quyền sở hữu hoặc quyền cho thuê hợp pháp của mình.</li>
            <li><strong>Quản lý toà nhà / Cộng tác viên:</strong> người được Chủ nhà uỷ quyền quản lý một phần hoạt động cho thuê, hoặc hỗ trợ dẫn khách xem phòng.</li>
            <li><strong>Tin đăng:</strong> thông tin phòng/toà nhà do Chủ nhà đăng công khai trên Nền tảng.</li>
            <li><strong>Đặt phòng ngắn hạn:</strong> giao dịch thuê phòng theo ngày/giờ, thanh toán và xác nhận ngay trong ứng dụng.</li>
            <li><strong>Hợp đồng:</strong> hồ sơ thuê dài hạn được lập trên Nền tảng giữa Chủ nhà và Người thuê, có thời hạn tính theo tháng.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            3. Tài Khoản Người Dùng
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Bạn phải đủ <strong>18 tuổi</strong> và có đầy đủ năng lực hành vi dân sự để tạo tài khoản và giao dịch trên Nền tảng.</li>
            <li>Thông tin đăng ký phải chính xác, đầy đủ và được cập nhật khi có thay đổi. Pimi có quyền tạm khoá tài khoản nếu phát hiện thông tin sai sự thật.</li>
            <li>Bạn chịu trách nhiệm bảo mật mật khẩu và mọi hoạt động diễn ra dưới tài khoản của mình; báo ngay cho đội hỗ trợ nếu nghi ngờ tài khoản bị truy cập trái phép.</li>
            <li>Một cá nhân có thể đồng thời giữ vai trò Người thuê và Chủ nhà trên cùng một tài khoản.</li>
            <li>Mỗi người chỉ được sở hữu một tài khoản cá nhân.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <IdCard className="w-4 h-4 text-indigo-600" />
            4. Xác Minh Danh Tính (KYC)
          </h2>
          <div className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <strong>Lưu ý quan trọng:</strong> quy trình xác minh của Pimi sử dụng công nghệ hỗ trợ đọc thông tin từ ảnh giấy tờ để rút ngắn thời gian nhập liệu, nhưng <strong>mọi hồ sơ đều được nhân sự Pimi trực tiếp kiểm tra và phê duyệt thủ công</strong> trước khi tài khoản được gắn nhãn "Đã xác minh". Đây không phải là dịch vụ xác thực điện tử (eKYC) chính thức của cơ quan nhà nước và không thay thế cho các hình thức xác minh pháp lý khác khi cần thiết.
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>Để đăng tin cho thuê hoặc nhận một số quyền lợi nhất định, Bạn có thể được yêu cầu cung cấp ảnh CCCD/CMND, bằng lái xe hoặc hộ chiếu, kèm ảnh chân dung đối chiếu.</li>
            <li>Bạn cam kết giấy tờ cung cấp là thật, hợp lệ và thuộc về chính mình. Cung cấp giấy tờ giả mạo hoặc mượn danh người khác có thể bị khoá tài khoản vĩnh viễn và bị báo cáo tới cơ quan chức năng nếu cần.</li>
            <li>Hồ sơ có thể bị từ chối nếu ảnh không rõ, thông tin không khớp, hoặc có dấu hiệu chỉnh sửa; sau nhiều lần thất bại liên tiếp, hệ thống tạm khoá chức năng gửi hồ sơ để chống lạm dụng — liên hệ hỗ trợ để được mở lại.</li>
            <li>Trạng thái "Đã xác minh" giúp tăng độ tin cậy nhưng <strong>không phải bảo đảm tuyệt đối</strong> — Pimi khuyến khích Bạn vẫn thực hiện các bước xác minh thực tế hợp lý trước khi ký hợp đồng hoặc giao dịch giá trị lớn.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            5. Vai Trò Của Pimi
          </h2>
          <p>Pimi vận hành một nền tảng công nghệ giúp Người thuê và Chủ nhà tìm thấy, trao đổi và giao dịch với nhau. Trừ khi được nêu rõ khác, <strong>Pimi không phải là một bên trong quan hệ thuê nhà</strong> giữa Người thuê và Chủ nhà — Chủ nhà chịu trách nhiệm về tính hợp pháp của việc cho thuê, tình trạng thực tế của phòng và việc thực hiện đúng cam kết với Người thuê.</p>
          <p>Ngoại lệ quan trọng: đối với các khoản thanh toán thực hiện qua Nền tảng, Pimi đóng vai trò <strong>thu hộ và giữ hộ tiền</strong> trước khi chuyển tiếp cho Chủ nhà, như mô tả tại mục 7. Vai trò này chỉ giới hạn ở việc trung chuyển tài chính, không biến Pimi thành bên cho thuê hay bảo lãnh cho chất lượng phòng.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Home className="w-4 h-4 text-indigo-600" />
            6. Đăng Tin Cho Thuê
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Chủ nhà cam kết có quyền hợp pháp để cho thuê phòng/toà nhà đăng tin, và mọi thông tin trong tin đăng (giá, diện tích, tiện ích, hình ảnh, địa chỉ) là chính xác, đúng với thực tế.</li>
            <li>Hình ảnh đăng tải phải là ảnh thật của phòng/toà nhà, không dùng ảnh minh hoạ gây hiểu nhầm hoặc ảnh không thuộc quyền sử dụng hợp pháp.</li>
            <li>Pimi có quyền, nhưng không có nghĩa vụ, rà soát, chỉnh sửa yêu cầu hoặc gỡ bỏ bất kỳ tin đăng nào vi phạm Điều khoản này hoặc pháp luật hiện hành.</li>
            <li>Việc một tin đăng xuất hiện trên Nền tảng không đồng nghĩa Pimi xác nhận hay bảo đảm tính chính xác tuyệt đối của nội dung tin đăng đó.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Wallet className="w-4 h-4 text-indigo-600" />
            7. Đặt Phòng Ngắn Hạn &amp; Thanh Toán
          </h2>
          <p className="font-semibold text-slate-800">Quy trình đặt phòng:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Bạn chọn ngày/giờ nhận và trả phòng, hệ thống báo giá theo đúng công thức tính giá và mức giảm giá (nếu có), hiển thị rõ trước khi Bạn xác nhận.</li>
            <li>Sau khi xác nhận, hệ thống kiểm tra phòng còn trống đúng khoảng thời gian Bạn chọn và tạo mã QR thanh toán có thời hạn.</li>
            <li>Quá thời hạn thanh toán mà chưa nhận được tiền, đơn tự động huỷ và phòng được mở lại cho người khác đặt.</li>
            <li>Sau khi thanh toán được xác nhận, Bạn liên hệ Chủ nhà/Quản lý toà nhà theo thông tin hiển thị để nhận phòng đúng lịch.</li>
          </ol>
          <p className="font-semibold text-slate-800">Thanh toán &amp; giữ hộ tiền:</p>
          <p>Tiền thanh toán được chuyển vào tài khoản ngân hàng của Pimi và được giữ hộ cho Chủ nhà đến khi Chủ nhà xác nhận Bạn đã nhận phòng, sau đó Pimi chuyển khoản phần còn lại cho Chủ nhà, đã trừ phí hoa hồng dịch vụ (mục 9).</p>
          <p className="font-semibold text-slate-800">Phòng theo giờ và theo ngày:</p>
          <p>Một số phòng hỗ trợ đặt theo giờ (nhận/trả trong cùng ngày là bình thường), một số phòng chỉ nhận đặt theo ngày (tối thiểu 1 đêm). Loại hình và đơn vị tính giá được Chủ nhà công bố rõ trên tin đăng.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <FileSignature className="w-4 h-4 text-indigo-600" />
            8. Hợp Đồng Thuê Dài Hạn
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Với thuê dài hạn, Chủ nhà và Người thuê lập một hồ sơ Hợp đồng trên Nền tảng, ghi nhận thời hạn thuê, chu kỳ thanh toán, ngày thu tiền, phương thức thanh toán (chuyển khoản qua Pimi hoặc tiền mặt trực tiếp, tuỳ hai bên thống nhất).</li>
            <li>Tại thời điểm ký, Nền tảng lưu lại toàn bộ thông tin phòng, dịch vụ, tiện ích đang áp dụng — các thay đổi giá/tiện ích sau này của Chủ nhà không tự động áp dụng ngược lại cho hợp đồng đã ký.</li>
            <li>Hoá đơn tiền thuê và dịch vụ định kỳ được hệ thống tự tạo trước ngày đến hạn, gửi thông báo nhắc thanh toán.</li>
            <li><strong>Hợp đồng lập trên Nền tảng là hồ sơ hỗ trợ quản lý và ghi nhận thoả thuận giữa hai bên</strong>, không thay thế cho việc công chứng/chứng thực theo quy định pháp luật nếu giao dịch của Bạn yêu cầu hình thức đó.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Percent className="w-4 h-4 text-indigo-600" />
            9. Hoa Hồng &amp; Phí Dịch Vụ
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Đặt phòng ngắn hạn:</strong> Pimi thu phí hoa hồng theo tỷ lệ phần trăm trên tổng giá trị đơn, công bố công khai và hiển thị rõ trong bước báo giá trước khi Bạn xác nhận đặt — không phát sinh phí ẩn.</li>
            <li><strong>Hợp đồng thuê dài hạn:</strong> hoá đơn tiền thuê/dịch vụ định kỳ hiện <strong>không</strong> bị trừ hoa hồng.</li>
            <li><strong>Gói nâng cao cho Chủ nhà (nếu áp dụng):</strong> Chủ nhà có thể đăng ký các gói trả phí để mở rộng số lượng tin đăng hoặc tính năng nâng cao; chi tiết và giá hiển thị tại mục nâng cấp tài khoản.</li>
            <li>Pimi có quyền điều chỉnh tỷ lệ hoa hồng hoặc phí dịch vụ cho các giao dịch phát sinh <strong>sau</strong> thời điểm thay đổi có hiệu lực; giao dịch đã xác nhận trước đó giữ nguyên mức phí tại thời điểm đặt.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-indigo-600" />
            10. Huỷ, Hoàn Tiền &amp; Tranh Chấp
          </h2>
          <p className="font-semibold text-slate-800">Huỷ trước khi nhận phòng (đặt phòng ngắn hạn):</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Huỷ trước giờ nhận phòng từ <strong>48 giờ</strong> trở lên: hoàn 100% (trừ phí xử lý ngân hàng nếu có).</li>
            <li>Huỷ từ <strong>24 đến dưới 48 giờ</strong> trước giờ nhận phòng: hoàn 50%.</li>
            <li>Huỷ dưới <strong>24 giờ</strong> trước giờ nhận phòng, hoặc không đến nhận phòng: không hoàn tiền, trừ trường hợp lỗi thuộc về Chủ nhà.</li>
          </ul>
          <p className="text-slate-500">Khung trên áp dụng mặc định; một số tin đăng có thể công bố chính sách huỷ riêng, hiển thị rõ trước khi Bạn đặt — chính sách riêng đó có hiệu lực thay cho khung mặc định.</p>
          <p className="font-semibold text-slate-800">Khi lỗi thuộc về Chủ nhà:</p>
          <p>Nếu Chủ nhà từ chối giao phòng dù Bạn đã thanh toán đúng hạn và đến đúng lịch, hoặc phòng thực tế sai khác nghiêm trọng so với tin đăng, Bạn được hoàn 100% và có thể gửi tố cáo (mục 11) để Pimi xử lý thêm với Chủ nhà.</p>
          <p className="font-semibold text-slate-800">Cách yêu cầu hoàn tiền:</p>
          <p>Liên hệ đội hỗ trợ kèm mã đơn đặt phòng trong vòng 48 giờ kể từ khi phát sinh vấn đề. Yêu cầu hợp lệ được xử lý và hoàn tiền về tài khoản ngân hàng Bạn đã dùng để thanh toán trong tối đa 7 ngày làm việc.</p>
          <p className="font-semibold text-slate-800">Hoá đơn thuê dài hạn:</p>
          <p>Việc huỷ/chấm dứt hợp đồng dài hạn trước hạn tuân theo điều khoản hai bên đã thoả thuận trong hợp đồng; Pimi hỗ trợ ghi nhận và thông báo nhưng không tự ý can thiệp nội dung thoả thuận dân sự giữa hai bên trừ khi có tố cáo vi phạm.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Star className="w-4 h-4 text-indigo-600" />
            11. Đánh Giá &amp; Tố Cáo
          </h2>
          <p className="font-semibold text-slate-800">Đánh giá:</p>
          <p>Chỉ Người thuê đã thực sự đặt phòng thành công mới có thể để lại đánh giá cho phòng đó, mỗi người một đánh giá cho mỗi phòng. Đánh giá phải trung thực, dựa trên trải nghiệm thật — cấm đăng đánh giá giả hoặc mang tính công kích cá nhân. Pimi có quyền ẩn điểm số hoặc nội dung bình luận vi phạm mà không cần xoá toàn bộ đánh giá.</p>
          <p className="font-semibold text-slate-800">Tố cáo:</p>
          <p>Bạn có thể tố cáo một tin đăng vì các lý do như thông tin sai lệch, có dấu hiệu lừa đảo, không đúng mô tả, vi phạm hợp đồng, điều kiện không an toàn, quấy rối, hoặc lý do khác, kèm mô tả và bằng chứng (nếu có). Pimi tiếp nhận, thông báo cho Chủ nhà phản hồi, sau đó ra quyết định cuối cùng — có thể là bỏ qua, cảnh cáo Chủ nhà, gỡ tin đăng, hoặc khoá tài khoản vi phạm tuỳ mức độ.</p>
          <p className="text-slate-500">Gửi tố cáo sai sự thật nhằm hạ uy tín người khác cũng là hành vi vi phạm Điều khoản này.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Ban className="w-4 h-4 text-indigo-600" />
            12. Hành Vi Bị Nghiêm Cấm
          </h2>
          <p>Khi sử dụng Nền tảng, Bạn không được:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Cung cấp thông tin, giấy tờ, hình ảnh giả mạo hoặc gây hiểu nhầm.</li>
            <li>Lừa đảo, chiếm đoạt tài sản, hoặc thực hiện giao dịch rửa tiền dưới bất kỳ hình thức nào.</li>
            <li>Quấy rối, đe doạ, phân biệt đối xử với người dùng khác.</li>
            <li>Cố ý lách phí bằng cách liên hệ ngoài Nền tảng để hoàn tất giao dịch đã bắt đầu trong ứng dụng nhằm né hoa hồng.</li>
            <li>Thu thập, khai thác dữ liệu người dùng khác ngoài mục đích giao dịch hợp lệ trên Nền tảng.</li>
            <li>Sử dụng công cụ tự động (bot, scraper) để truy cập, sao chép dữ liệu khi chưa được phép.</li>
            <li>Đăng tin trùng lặp, đăng tin cho phòng không có thật hoặc không còn khả năng cho thuê.</li>
            <li>Can thiệp, phá hoại, hoặc cố gắng truy cập trái phép vào hệ thống, tài khoản người khác.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <ShieldOff className="w-4 h-4 text-indigo-600" />
            13. Tạm Khoá &amp; Chấm Dứt Tài Khoản
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Bạn có thể tự vô hiệu hoá tài khoản bất kỳ lúc nào qua xác thực OTP gửi tới email đã đăng ký, và có thể yêu cầu kích hoạt lại bằng cùng cách thức.</li>
            <li>Pimi có quyền tạm khoá hoặc chấm dứt tài khoản vi phạm Điều khoản này, có hoặc không báo trước tuỳ mức độ vi phạm.</li>
            <li>Khi tài khoản bị khoá do vi phạm, các giao dịch đang chờ xử lý có thể bị huỷ; các nghĩa vụ tài chính đã phát sinh trước đó vẫn còn hiệu lực.</li>
            <li>Việc chấm dứt tài khoản không ảnh hưởng tới các quyền, nghĩa vụ đã phát sinh trước đó giữa các bên liên quan.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            14. Giới Hạn Trách Nhiệm
          </h2>
          <p className="text-slate-500">Trong phạm vi tối đa pháp luật cho phép:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Pimi cung cấp Nền tảng trên cơ sở "hiện có", không cam kết Nền tảng hoạt động không gián đoạn hoặc không có lỗi tuyệt đối.</li>
            <li>Pimi không chịu trách nhiệm về tình trạng thực tế của phòng/toà nhà, hành vi của Chủ nhà hoặc Người thuê, hay các thoả thuận dân sự phát sinh ngoài phạm vi thanh toán được xử lý qua Nền tảng.</li>
            <li>Trách nhiệm bồi thường của Pimi (nếu có phát sinh do lỗi trực tiếp của hệ thống Pimi) được giới hạn không vượt quá tổng phí dịch vụ Bạn đã thanh toán cho Pimi liên quan tới giao dịch phát sinh tranh chấp trong vòng 6 tháng gần nhất.</li>
            <li>Pimi không chịu trách nhiệm cho các thiệt hại gián tiếp, ngẫu nhiên, hoặc hệ quả phát sinh từ việc sử dụng hoặc không thể sử dụng Nền tảng.</li>
            <li>Giới hạn trên không áp dụng cho các nghĩa vụ mà pháp luật quy định không được loại trừ hoặc giới hạn trách nhiệm.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Handshake className="w-4 h-4 text-indigo-600" />
            15. Bồi Thường Thiệt Hại
          </h2>
          <p>Bạn đồng ý bồi thường và giữ cho Pimi không bị thiệt hại phát sinh từ khiếu nại của bên thứ ba liên quan tới: việc Bạn vi phạm Điều khoản này, vi phạm pháp luật, hoặc vi phạm quyền của bên thứ ba trong quá trình Bạn sử dụng Nền tảng.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Gavel className="w-4 h-4 text-indigo-600" />
            16. Luật Áp Dụng &amp; Giải Quyết Tranh Chấp
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Điều khoản này được điều chỉnh bởi pháp luật nước Cộng hoà Xã hội Chủ nghĩa Việt Nam.</li>
            <li>Khi phát sinh tranh chấp, các bên ưu tiên thương lượng, hoà giải thiện chí thông qua đội ngũ hỗ trợ của Pimi trước.</li>
            <li>Nếu không đạt được thoả thuận, tranh chấp được đưa ra giải quyết tại Toà án có thẩm quyền theo quy định pháp luật Việt Nam.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-indigo-600" />
            17. Điều Khoản Chung Khác
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Thay đổi Điều khoản:</strong> Pimi có thể cập nhật Điều khoản này; thay đổi quan trọng được thông báo qua email/thông báo trong ứng dụng trước khi có hiệu lực. Tiếp tục sử dụng Nền tảng sau khi thay đổi có hiệu lực đồng nghĩa Bạn chấp nhận Điều khoản mới.</li>
            <li><strong>Hiệu lực từng phần:</strong> nếu một điều khoản bị tuyên vô hiệu, các điều khoản còn lại vẫn giữ nguyên hiệu lực.</li>
            <li><strong>Không từ bỏ quyền:</strong> việc Pimi không thực hiện ngay một quyền theo Điều khoản này không đồng nghĩa từ bỏ quyền đó.</li>
            <li><strong>Toàn bộ thoả thuận:</strong> Điều khoản này cùng Chính sách bảo mật là toàn bộ thoả thuận giữa Bạn và Pimi về việc sử dụng Nền tảng.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-600" />
            18. Liên Hệ
          </h2>
          <p>Mọi câu hỏi về Điều khoản sử dụng, khiếu nại giao dịch, hoặc yêu cầu hỗ trợ, vui lòng liên hệ:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Đơn vị vận hành:</strong> Công ty TNHH Pimi Nest</li>
            <li><strong>Người đại diện:</strong> Ông Đào Quang Trọng — Nhà sáng lập &amp; Tổng Giám đốc</li>
            <li><strong>Mã số doanh nghiệp:</strong> <em>[Bổ sung mã số thuế / đăng ký kinh doanh]</em></li>
            <li><strong>Trụ sở đăng ký:</strong> <em>[Bổ sung địa chỉ đăng ký kinh doanh chính thức]</em></li>
            <li><strong>Văn phòng giao dịch:</strong> 188 Nguyễn Xí, P.26, Bình Thạnh, TP. Hồ Chí Minh &amp; Cầu Giấy, Hà Nội</li>
            <li><strong>Email hỗ trợ chung:</strong> support@pimi.vn</li>
            <li><strong>Hotline:</strong> <em>[Bổ sung số hotline chính thức]</em></li>
          </ul>
        </section>

        <p className="text-xs text-slate-400 pt-4 border-t border-slate-200">
          Bản quyền thuộc về Công ty TNHH Pimi Nest. Mọi sự sao chép hoặc phát hành lại một phần hay toàn bộ điều khoản này mà không được sự đồng ý bằng văn bản của Pimi Nest đều bị coi là vi phạm pháp luật.
        </p>

      </div>
    </div>
  );
};
