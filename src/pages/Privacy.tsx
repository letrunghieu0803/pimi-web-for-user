import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Bảo Vệ Thông Tin Người Dùng</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          Chính Sách Bảo Mật Quyền Riêng Tư
        </h1>
        <p className="text-xs text-slate-500">Cập nhật lần cuối: Tháng 07 năm 2026</p>
      </div>

      {/* Content Sections */}
      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            1. Thu Thập Thông Tin Cá Nhân
          </h2>
          <p>
            Khi bạn sử dụng tính năng <strong>"Yêu cầu xem phòng"</strong> trên nền tảng Pimi, chúng tôi thu thập các thông tin bao gồm: Họ và tên, Số điện thoại liên hệ, Địa chỉ Email (nếu có), Ngày giờ mong muốn xem phòng và các Ghi chú đi kèm.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-600" />
            2. Mục Đích Sử Dụng Thông Tin
          </h2>
          <p>Thông tin của người thuê chỉ được sử dụng cho các mục đích sau:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Chuyển thông tin lịch hẹn đến Chủ nhà (Owner) chính chủ của căn phòng bạn chọn xem.</li>
            <li>Xác nhận lịch hẹn qua điện thoại hoặc tin nhắn SMS/Email.</li>
            <li>Hỗ trợ giải quyết các khiếu nại hoặc tư vấn tìm phòng trọ phù hợp khi có yêu cầu.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            3. Cam Kết Không Săm Soi & Không Bán Dữ Liệu
          </h2>
          <p>
            Pimi cam kết tuyệt đối <strong>KHÔNG</strong> bán, trao đổi hoặc chia sẻ dữ liệu cá nhân của người thuê nhà cho bất kỳ bên thứ ba nào vì mục đích quảng cáo hoặc tiếp thị rác.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            4. Quyền Của Người Dùng
          </h2>
          <p>
            Bạn có quyền yêu cầu Pimi chỉnh sửa hoặc xóa thông tin yêu cầu xem phòng bất kỳ lúc nào bằng cách liên hệ với bộ phận CSKH qua Hotline: <strong>0987.654.321</strong> hoặc Email <strong>privacy@pimi.vn</strong>.
          </p>
        </section>

      </div>
    </div>
  );
};
