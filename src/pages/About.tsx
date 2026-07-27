import React from 'react';
import { Building2, ShieldCheck, HeartHandshake, Zap, Users, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50/70 to-slate-50 py-16 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Về Chúng Tôi - Pimi Platform</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-heading">
            Kết Nối Người Thuê & Chủ Nhà <br />
            <span className="gradient-text">Minh Bạch - Nhanh Chóng - An Toàn</span>
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Pimi được sinh ra với sứ mệnh tiên phong loại bỏ hoàn toàn các thông tin ảo, phí môi giới mập mờ và mang lại trải nghiệm thuê nhà trọ công bằng, chất lượng cao nhất cho người thuê tại Việt Nam.
          </p>
        </div>
      </section>

      {/* Core Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 font-heading">
              Câu Chuyện & Sứ Mệnh Của Pimi
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Việc tìm kiếm một căn phòng trọ sạch đẹp, giá cả hợp lý và hợp đồng minh bạch là thách thức lớn đối với hàng triệu sinh viên và người đi làm mỗi năm.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Pimi cung cấp nền tảng công nghệ tối ưu, xác thực 100% hình ảnh & địa chỉ thực tế từ chủ nhà chính chủ, cho phép người thuê đặt hẹn xem phòng trực tiếp hoàn toàn miễn phí chỉ với một vài thao tác.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <Target className="w-6 h-6 text-indigo-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm font-heading">Sứ Mệnh</h4>
                <p className="text-xs text-slate-500 mt-1">Chuẩn hóa thị trường cho thuê nhà trọ minh bạch & văn minh.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <Award className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm font-heading">Tầm Nhìn</h4>
                <p className="text-xs text-slate-500 mt-1">Trở thành ứng dụng & website quản lý - tìm trọ phổ biến nhất Việt Nam.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
              alt="Pimi Rental Platform"
              className="rounded-3xl shadow-2xl border border-slate-200 object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* 4 Core Values */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black font-heading">Giá Trị Cốt Lõi Của Pimi</h2>
            <p className="text-slate-400 text-sm">
              Chúng tôi xây dựng sản phẩm dựa trên nhu cầu thực tế và sự hài lòng bền vững của người đi thuê nhà.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <h3 className="text-lg font-bold font-heading">Xác Thực 100%</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tất cả tin đăng đều được kiểm duyệt địa chỉ và liên hệ chủ nhà trực tiếp trước khi hiển thị.
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-3">
              <Zap className="w-8 h-8 text-indigo-400" />
              <h3 className="text-lg font-bold font-heading">Tốc Độ Đặt Lịch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gửi yêu cầu xem phòng tức thì, chủ nhà gọi xác nhận ngay trong thời gian bạn chọn.
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-3">
              <HeartHandshake className="w-8 h-8 text-purple-400" />
              <h3 className="text-lg font-bold font-heading">Miễn Phí Hoàn Toàn</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Người tìm phòng không phải trả bất cứ khoản phí dịch vụ nào cho nền tảng.
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 space-y-3">
              <Users className="w-8 h-8 text-amber-400" />
              <h3 className="text-lg font-bold font-heading">Hỗ Trợ 24/7</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Đội ngũ CSKH hỗ trợ tư vấn và giải đáp thắc mắc hợp đồng liên tục trong tuần.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl font-black text-slate-900 font-heading">Sẵn Sàng Tìm Phòng Ngay Hôm Nay?</h2>
        <Link
          to="/rooms"
          className="gradient-bg text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-xl inline-block hover:scale-105 transition-transform"
        >
          Bắt đầu tìm phòng trọ
        </Link>
      </section>

    </div>
  );
};
