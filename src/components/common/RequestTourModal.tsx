import React, { useState } from 'react';
import { Room, ViewingRequest } from '@/types';
import { roomApi } from '@/services/roomApi';
import { useToast } from '@/context/ToastContext';
import { X, Calendar, Clock, User, Phone, Mail, FileText, Send, Building2, ShieldCheck } from 'lucide-react';

interface RequestTourModalProps {
  room: Room | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RequestTourModal: React.FC<RequestTourModalProps> = ({ room, onClose, onSuccess }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('09:00');
  const [notes, setNotes] = useState('');

  if (!room) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tenantName.trim()) {
      toast.warning('Vui lòng nhập họ và tên của bạn!');
      return;
    }
    if (!tenantPhone.trim() || tenantPhone.length < 9) {
      toast.warning('Vui lòng nhập số điện thoại hợp lệ!');
      return;
    }
    if (!preferredDate) {
      toast.warning('Vui lòng chọn ngày bạn muốn xem phòng!');
      return;
    }

    setLoading(true);
    try {
      const payload: ViewingRequest = {
        roomId: room.id,
        roomName: room.name,
        tenantName: tenantName.trim(),
        tenantPhone: tenantPhone.trim(),
        tenantEmail: tenantEmail.trim() || undefined,
        preferredDate,
        preferredTime,
        notes: notes.trim() || undefined,
      };

      const res = await roomApi.submitViewingRequest(payload);
      if (res.success) {
        toast.success(res.message);
        onSuccess?.();
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.message || 'Có lỗi xảy ra khi gửi yêu cầu xem phòng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden my-8 transform transition-all">
        
        {/* Modal Header */}
        <div className="gradient-bg p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Đặt Lịch Xem Phòng Miễn Phí</span>
          </div>
          <h2 className="text-xl font-bold font-heading">Yêu Cầu Xem Phòng Trực Tiếp</h2>
          <p className="text-xs text-indigo-100 mt-1">Chủ nhà sẽ chủ động gọi điện xác nhận lịch hẹn với bạn.</p>
        </div>

        {/* Selected Room Banner */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
          <img
            src={room.images[0]}
            alt={room.name}
            className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">{room.name}</h4>
            <p className="text-xs text-indigo-600 font-semibold">{room.houseName} • {room.district}</p>
            <p className="text-xs font-bold text-emerald-600 mt-0.5">
              {(room.price / 1000000).toLocaleString('vi-VN')} triệu/tháng
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Tenant Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Họ và tên người xem phòng *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Tenant Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Số điện thoại liên hệ *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                placeholder="Ví dụ: 0987654321"
                value={tenantPhone}
                onChange={(e) => setTenantPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Ngày muốn xem *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="date"
                  value={preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Giờ hẹn xem *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                >
                  <option value="08:30">08:30 sáng</option>
                  <option value="10:00">10:00 sáng</option>
                  <option value="12:00">12:00 trưa</option>
                  <option value="14:30">14:30 chiều</option>
                  <option value="17:00">17:00 chiều</option>
                  <option value="18:30">18:30 tối</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tenant Email Optional */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email nhận thông báo (Không bắt buộc)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="example@gmail.com"
                value={tenantEmail}
                onChange={(e) => setTenantEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Ghi chú thêm cho chủ nhà
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <textarea
                rows={2}
                placeholder="Ví dụ: Tôi muốn hỏi thêm về chỗ đỗ xe ô tô..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Trust guarantee */}
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Pimi cam kết không thu bất kỳ phí dịch vụ nào từ người xem phòng.</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 rounded-xl gradient-bg text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Đang gửi...' : 'Gửi Yêu Cầu Xem Phòng'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
