import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export const Contact: React.FC = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !message) {
      toast.warning('Vui lòng điền đầy đủ các thông tin bắt buộc!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Cảm ơn bạn đã gửi tin nhắn! Bộ phận hỗ trợ Pimi sẽ phản hồi trong 24 giờ.');
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <Mail className="w-4 h-4" />
          <span>Liên Hệ Hỗ Trợ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          Chúng Tôi Luôn Sẵn Sàng Hỗ Trợ Bạn
        </h1>
        <p className="text-slate-600 text-sm">
          Nếu bạn gặp khó khăn trong việc tìm phòng, hẹn lịch xem phòng hoặc cần hợp tác đăng tin, hãy gửi tin nhắn ngay cho Pimi.
        </p>
      </div>

      {/* Main Grid: Form + Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Form */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <span>Gửi Tin Nhắn Phản Hồi</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  placeholder="0987654321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Địa chỉ Email
              </label>
              <input
                type="email"
                placeholder="youremail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nội dung tin nhắn *
              </label>
              <textarea
                rows={4}
                placeholder="Nhập câu hỏi hoặc yêu cầu cần hỗ trợ của bạn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gradient-bg text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Đang gửi...' : 'Gửi Yêu Cầu Hỗ Trợ'}</span>
            </button>
          </form>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-lg font-bold font-heading">Thông Tin Liên Hệ Pimi</h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-bold">Văn phòng chính</strong>
                  <span className="text-xs text-slate-400">188 Nguyễn Xí, Phường 26, Bình Thạnh, TP. Hồ Chí Minh & Cầu Giấy, Hà Nội</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-bold">Hotline tư vấn 24/7</strong>
                  <a href="tel:0987654321" className="text-xs text-indigo-300 hover:underline">
                    0987.654.321
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-bold">Email hỗ trợ</strong>
                  <span className="text-xs text-slate-400">support@pimi.vn</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-800">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-bold">Giờ làm việc</strong>
                  <span className="text-xs text-slate-400">Thứ 2 - Chủ Nhật: 08:00 - 20:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
