import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { roomApi } from '@/services/roomApi';
import { ViewingRequest, Room } from '@/types';
import { Calendar, Clock, MapPin, Building2, CheckCircle2, Clock3, XCircle, ChevronRight, PhoneCall, Trash2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BookingHistory: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [bookings, setBookings] = useState<ViewingRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const list = roomApi.getUserViewingRequests(user.phoneNumber);
      setBookings(list);
    }
  }, [user]);

  const handleCancelBooking = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Bạn có chắc chắn muốn hủy yêu cầu đặt lịch xem phòng này?')) return;

    setLoading(true);
    try {
      const res = await roomApi.cancelViewingRequest(id);
      if (res.success) {
        toast.success(res.message);
        if (user) {
          setBookings(roomApi.getUserViewingRequests(user.phoneNumber));
        }
      }
    } catch (err: any) {
      toast.error(err?.message || 'Không thể hủy lịch hẹn!');
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter((b) => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
          <Calendar className="w-4 h-4" />
          <span>Lịch Sử Đặt Lịch Xem Phòng</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 font-heading">
          Danh Sách Lịch Hẹn Với Chủ Nhà
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Theo dõi trạng thái các yêu cầu đặt hẹn xem phòng trọ bạn đã gửi.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {[
          { id: 'ALL', label: 'Tất cả' },
          { id: 'PENDING', label: 'Đang chờ xác nhận' },
          { id: 'CONFIRMED', label: 'Đã xác nhận' },
          { id: 'CANCELLED', label: 'Đã hủy' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === tab.id
                ? 'gradient-bg text-white shadow-md shadow-indigo-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="py-16 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-4 max-w-md mx-auto">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 font-heading">Chưa có lịch hẹn nào</h3>
          <p className="text-xs text-slate-500">
            Bạn chưa có yêu cầu xem phòng nào thuộc danh mục này.
          </p>
          <Link
            to="/rooms"
            className="gradient-bg text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md inline-block"
          >
            Khám phá danh sách phòng
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            let statusBadge = (
              <span className="badge-tag bg-amber-100 text-amber-800 border border-amber-300">
                <Clock3 className="w-3.5 h-3.5" />
                <span>Đang chờ xác nhận</span>
              </span>
            );

            if (item.status === 'CONFIRMED') {
              statusBadge = (
                <span className="badge-tag bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã xác nhận hẹn</span>
                </span>
              );
            } else if (item.status === 'CANCELLED') {
              statusBadge = (
                <span className="badge-tag bg-slate-100 text-slate-600 border border-slate-300">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Đã hủy</span>
                </span>
              );
            }

            return (
              <div
                key={item.id}
                className="glass-panel p-6 rounded-3xl border border-slate-200/90 shadow-lg space-y-4 hover:border-indigo-200 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest block">
                      Mã yêu cầu: #{item.id}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 font-heading mt-0.5">
                      {item.roomName || 'Phòng Trọ Đã Chọn'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {statusBadge}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-700 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Ngày hẹn xem</span>
                      <strong className="text-slate-900">{item.preferredDate}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Khung giờ hẹn</span>
                      <strong className="text-slate-900">{item.preferredTime}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Người đặt hẹn</span>
                      <strong className="text-slate-900">{item.tenantName} ({item.tenantPhone})</strong>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {item.notes && (
                  <p className="text-xs text-slate-600 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 italic">
                    Ghi chú: "{item.notes}"
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <Link
                    to={`/rooms/${item.roomId}`}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <span>Xem lại thông tin phòng trọ</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  {item.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancelBooking(item.id)}
                      disabled={loading}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hủy lịch hẹn</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
