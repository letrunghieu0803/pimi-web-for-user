import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock, Database, Target, ServerCog, Share2, UserCheck, Phone } from 'lucide-react';

export const Privacy: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">

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
          Chào mừng Bạn đến với hệ sinh thái Pimi (bao gồm ứng dụng Pimi App, phần mềm quản lý Biz Pimi, nền tảng Pimi Hub và website chính thức pimi.vn). Chính sách Bảo mật này giải thích cách Công ty TNHH Pimi Nest (sau đây gọi tắt là "Pimi", "Chúng tôi") thu thập, xử lý, lưu trữ, chia sẻ và bảo vệ thông tin cá nhân của Bạn (Người thuê nhà, Chủ nhà/Nhà vận hành, Chuyên viên Môi giới/CTV và Khách truy cập).
        </p>
        <div className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
          LƯU Ý QUAN TRỌNG: Khi truy cập, đăng ký tài khoản, hoặc sử dụng bất kỳ dịch vụ nào trên hệ thống của Pimi, Bạn xác nhận đã đọc, hiểu và đồng ý hoàn toàn với toàn bộ nội dung của Chính sách Bảo mật này.
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            1. Nguyên Tắc Xử Lý Dữ Liệu Cá Nhân
          </h2>
          <p>Chúng tôi cam kết tuân thủ nghiêm ngặt các nguyên tắc bảo vệ dữ liệu theo Luật pháp Việt Nam:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Hợp pháp & Minh bạch:</strong> Dữ liệu cá nhân chỉ được xử lý khi có sự đồng ý tự nguyện của Bạn hoặc theo quy định của pháp luật (như nghĩa vụ Thông báo lưu trú).</li>
            <li><strong>Đúng mục đích:</strong> Dữ liệu thu thập chỉ phục vụ cho các mục đích đã được thông báo trước.</li>
            <li><strong>Tối thiểu hóa dữ liệu:</strong> Chỉ thu thập các trường thông tin thực sự cần thiết.</li>
            <li><strong>Bảo mật tối đa:</strong> Áp dụng các biện pháp kỹ thuật và tổ chức để chống truy cập, rò rỉ hoặc mất mát dữ liệu trái phép.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            2. Các Loại Dữ Liệu Pimi Thu Thập
          </h2>
          <p>Chúng tôi phân loại dữ liệu thu thập thành 2 nhóm chính:</p>
          <p className="font-semibold text-slate-800">A. Dữ liệu cá nhân cơ bản:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Thông tin định danh & Liên hệ:</strong> Họ và tên, Ngày tháng năm sinh, Giới tính, Số điện thoại chính chủ, Địa chỉ email, Địa chỉ thường trú/tạm trú.</li>
            <li><strong>Dữ liệu tài khoản:</strong> Tên đăng nhập, Mật khẩu đã mã hóa, Hình ảnh đại diện (Avatar).</li>
            <li><strong>Thông tin giao dịch & Vận hành:</strong> Lịch sử đặt phòng, Lịch sử xem phòng, Chi tiết hợp đồng thuê nhà điện tử, Lịch sử thanh toán/công nợ.</li>
            <li><strong>Dữ liệu kỹ thuật:</strong> Địa chỉ IP, Loại thiết bị, Mã định danh thiết bị (UDID), Hệ điều hành, Nhật ký hệ thống (System Logs), Vị trí địa lý (khi Bạn cho phép để tìm nhà gần trường học/nơi làm).</li>
          </ul>
          <p className="font-semibold text-slate-800">B. Dữ liệu cá nhân nhạy cảm (Đặc thù ngành Lưu trú & Định danh):</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Thông tin trên thẻ Căn cước công dân (CCCD) / Hộ chiếu:</strong> Số CCCD/Hộ chiếu, Ngày cấp, Nơi cấp, Mã QR mã hóa.</li>
            <li><strong>Dữ liệu định danh điện tử VNeID:</strong> Trạng thái xác thực Mức 1 / Mức 2.</li>
            <li><strong>Dữ liệu cư trú & lưu trú:</strong> Thời gian bắt đầu/kết thúc lưu trú, Lý do lưu trú, Mã hồ sơ biên nhận lưu trú do cơ quan Công an cấp.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            3. Mục Đích Xử Lý Dữ Liệu Cá Nhân
          </h2>
          <p>Pimi thu thập và xử lý dữ liệu của Bạn nhằm các mục đích sau:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Xác thực danh tính & Chống lừa đảo:</strong> Xác minh thông tin chủ nhà và người thuê chính chủ, loại bỏ tài khoản ảo, tin rác và rủi ro lừa đảo cọc.</li>
            <li><strong>Thực hiện nghĩa vụ Khai báo Lưu trú Pháp lý:</strong> Đồng bộ và đẩy dữ liệu tờ khai lưu trú lên Cổng thông tin của Bộ Công an (tbltkbtt.bocongan.gov.vn) nhằm tuân thủ Luật Cư trú và Nghị định 282/2025/NĐ-CP.</li>
            <li><strong>Cung cấp Dịch vụ & Tạo Hợp đồng:</strong> Khởi tạo Hợp đồng thuê nhà điện tử, Mã đặt phòng (Booking ID), nhắc lịch thanh toán tiền nhà, và tự động cập nhật trạng thái phòng trống theo thời gian thực.</li>
            <li><strong>Kết nối Hệ sinh thái Đối tác (VAS):</strong> Hỗ trợ kết nối các dịch vụ phụ trợ như Chuyển nhà, Sửa chữa, Vệ sinh, Hạ tầng Internet theo yêu cầu tự nguyện của Bạn.</li>
            <li><strong>Chăm sóc Khách hàng & Giải quyết Sự cố:</strong> Tiếp nhận yêu cầu bảo trì, phản ánh chất lượng phòng, xử lý khiếu nại giữa các bên.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <ServerCog className="w-4 h-4 text-indigo-600" />
            4. Biện Pháp Bảo Mật Kỹ Thuật Và Lưu Trữ
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Mã hóa dữ liệu (Encryption):</strong> Sử dụng giao thức SSL/TLS tiên tiến để mã hóa toàn bộ dữ liệu truyền tải qua đường truyền Internet, cùng thuật toán mã hóa dữ liệu lưu trữ (Encryption at Rest) đối với toàn bộ thông tin nhạy cảm như CCCD, Hộ chiếu trong Cơ sở dữ liệu.</li>
            <li><strong>Phân quyền hiển thị (Privacy by Design):</strong> Thông tin nhạy cảm (SĐT chính xác, Địa chỉ chi tiết tòa nhà) của Chủ nhà/Môi giới sẽ được lớp giao diện mã hóa/ẩn đi đối với các bên chưa xác thực giao dịch để tránh hiện tượng "cướp nguồn hàng" hay làm phiền trái phép.</li>
            <li><strong>Địa điểm lưu trữ (Data Localisation):</strong> Toàn bộ dữ liệu cá nhân của công dân Việt Nam được lưu trữ trên hạ tầng máy chủ đặt tại Việt Nam, tuân thủ Luật An ninh mạng.</li>
            <li><strong>Thời hạn lưu trữ:</strong> Dữ liệu tài khoản được lưu giữ trong suốt thời gian Bạn sử dụng dịch vụ. Nhật ký hệ thống (System Logs) và dữ liệu giao dịch/hợp đồng được lưu trữ tối thiểu theo thời hạn quy định của Luật Giao dịch điện tử và Luật An ninh mạng để phục vụ công tác đối soát.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-600" />
            5. Chia Sẻ Và Tiết Lộ Dữ Liệu Cá Nhân
          </h2>
          <p>
            Pimi <strong>TUYỆT ĐỐI KHÔNG</strong> bán, cho thuê hoặc kinh doanh dữ liệu cá nhân của Bạn cho bất kỳ bên thứ ba nào. Dữ liệu chỉ được chia sẻ trong các trường hợp giới hạn sau:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Cơ quan Công an & Quản lý Nhà nước:</strong> Chia sẻ thông tin khai báo lưu trú (Họ tên, CCCD, lý do, thời gian lưu trú) trực tiếp với Cơ quan Công an sở tại / Bộ Công an nhằm thực hiện đúng thủ tục Thông báo lưu trú bắt buộc theo Luật Cư trú.</li>
            <li><strong>Đối tác Tích hợp Dịch vụ Xác thực Định danh</strong> (Bộ Công an / C06 / Trung tâm RAR / VNPT / Viettel / FPT): Truyền tải dữ liệu an toàn để thực hiện xác thực căn cước chip hoặc định danh tài khoản VNeID.</li>
            <li><strong>Các Bên trong Giao dịch</strong> (Chủ nhà ↔ Người thuê ↔ Môi giới): Chỉ chia sẻ các thông tin cần thiết (Họ tên, SĐT, Thông tin căn hộ) giữa Người thuê và Chủ nhà/Môi giới sau khi giao dịch xem phòng, giữ phòng hoặc ký hợp đồng đã được xác thực.</li>
            <li><strong>Đối tác Dịch vụ Gia tăng</strong> (Chỉ khi có sự đồng ý của Bạn): Chuyển thông tin liên hệ cho đơn vị Chuyển nhà/Viễn thông nếu Bạn chủ động bấm đăng ký sử dụng các gói dịch vụ này trên app.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            6. Quyền Và Nghĩa Vụ Của Người Dùng
          </h2>
          <p>Căn cứ Nghị định 13/2023/NĐ-CP, Bạn có các quyền sau đối với dữ liệu cá nhân của mình:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Quyền Được biết & Quyền Đồng ý:</strong> Bạn có quyền được biết về hoạt động xử lý dữ liệu và tùy chọn đồng ý hoặc rút lại sự đồng ý bất kỳ lúc nào.</li>
            <li><strong>Quyền Truy cập & Chỉnh sửa:</strong> Bạn có thể tự kiểm tra, cập nhật hoặc chỉnh sửa thông tin cá nhân trực tiếp trên trang hồ sơ cá nhân của Pimi App / Biz Pimi.</li>
            <li><strong>Quyền Xóa dữ liệu & Rút lại sự đồng ý:</strong> Bạn có quyền yêu cầu Pimi xóa dữ liệu cá nhân hoặc đóng tài khoản (trừ trường hợp dữ liệu bắt buộc phải lưu trữ theo quy định của pháp luật về Thuế và An ninh mạng).</li>
            <li><strong>Nghĩa vụ của Bạn:</strong> Tự bảo vệ thông tin đăng nhập, Mật khẩu và mã Passcode/OTP của mình; cung cấp trung thực các thông tin định danh cá nhân khi ký hợp đồng và khai báo lưu trú.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-600" />
            7. Thông Tin Liên Hệ Bảo Vệ Dữ Liệu Cá Nhân
          </h2>
          <p>
            Nếu Bạn có bất kỳ câu hỏi, khiếu nại hoặc yêu cầu nào liên quan đến việc bảo vệ dữ liệu cá nhân trên hệ thống Pimi, vui lòng liên hệ với Bộ phận Pháp lý & An ninh thông tin của Chúng tôi qua:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Tên tổ chức:</strong> Công ty TNHH Pimi Nest</li>
            <li><strong>Người đại diện pháp luật:</strong> Ông Đào Quang Trọng (Founder & CEO)</li>
            <li><strong>Địa chỉ trụ sở:</strong> TP. Hà Nội, Việt Nam</li>
            <li><strong>Email tiếp nhận hồ sơ DPIA & Bảo mật:</strong> privacy@pimi.vn (hoặc hotro@pimi.vn)</li>
            <li><strong>Hotline hỗ trợ:</strong> 1900 xxxx</li>
          </ul>
        </section>

        <p className="text-xs text-slate-400 pt-4 border-t border-slate-200">
          Bản quyền thuộc về Công ty TNHH Pimi Nest. Mọi sự sao chép hoặc phát hành lại một phần hay toàn bộ chính sách này mà không được sự đồng ý bằng văn bản của Pimi Nest đều bị coi là vi phạm pháp luật.
        </p>

      </div>
    </div>
  );
};
