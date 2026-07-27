import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart, ArrowUpRight, PhoneCall, Shield, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-lg">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white font-heading">
                Pimi<span className="text-indigo-400">Rent</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Nền tảng tìm kiếm và đặt lịch xem phòng trọ, căn hộ mini trực tiếp từ chủ nhà xác thực. Trải nghiệm minh bạch, nhanh chóng và an toàn tuyệt đối.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-emerald-400 bg-emerald-950/40 p-3 rounded-2xl border border-emerald-800/40 w-fit">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% phòng trọ được xác thực địa chỉ & chủ nhà chính chủ</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-base font-bold font-heading mb-4">Khám Phá Pimi</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/rooms" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <span>Danh sách phòng trọ</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-indigo-400 transition-colors">
                  Câu hỏi thường gặp (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-300 font-semibold">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Chính sách bảo mật</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-indigo-300 font-semibold">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Liên hệ hỗ trợ</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <h4 className="text-white text-base font-bold font-heading mb-4">Khu Vực Hot</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Phòng trọ Cầu Giấy (Hà Nội)</li>
              <li>Phòng trọ Hai Bà Trưng (Hà Nội)</li>
              <li>Phòng trọ Tây Hồ (Hà Nội)</li>
              <li>Căn hộ dịch vụ Phú Nhuận (TP.HCM)</li>
              <li>Căn hộ mini Bình Thạnh (TP.HCM)</li>
            </ul>
          </div>

          {/* Contact & Hotline Section */}
          <div>
            <h4 className="text-white text-base font-bold font-heading mb-4">Hotline & Văn Phòng</h4>
            <div className="space-y-4 text-sm">
              {/* Highlighted Hotline Button */}
              <a
                href="tel:0987654321"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 hover:bg-indigo-900 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <PhoneCall className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">Hotline Tư Vấn 24/7</span>
                  <span className="text-base font-black text-white font-heading">0987.654.321</span>
                </div>
              </a>

              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-400 text-xs">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>188 Nguyễn Xí, Phường 26, Bình Thạnh, TP.HCM & Cầu Giấy, Hà Nội</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400 text-xs">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>support@pimi.vn</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Pimi Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/privacy" className="hover:text-slate-200 transition-colors">Bảo mật</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-200 transition-colors">Liên hệ</Link>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span>Thiết kế dành riêng cho người thuê nhà</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
