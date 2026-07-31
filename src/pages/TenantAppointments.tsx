import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CheckSquare,
  Home,
  MapPin,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { appointmentApi, Appointment, TimeSlot } from '@/services/appointmentApi';
import { useToast } from '@/context/ToastContext';
import { FilterTabs } from '@/components/common/FilterTabs';

export const TenantAppointments: React.FC = () => {
  const toast = useToast();
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected time slot per appointment id
  const [selectedSlots, setSelectedSlots] = useState<{ [appId: string]: string }>({});
  const [submittingAppId, setSubmittingAppId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res: any = await appointmentApi.getTenantAppointments({});
      const list = res.data?.data || res.data || [];
      setAllAppointments(list);
    } catch (err: any) {
      toast.error('Tải danh sách lịch hẹn thất bại!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const appointments =
    statusFilter === 'ALL' ? allAppointments : allAppointments.filter((app) => app.status === statusFilter);

  const filterTabs = [
    { key: 'ALL', label: 'Tất cả', count: allAppointments.length },
    { key: 'OWNER_OFFERED_TIMES', label: 'Yêu cầu xác nhận', count: allAppointments.filter((a) => a.status === 'OWNER_OFFERED_TIMES').length },
    { key: 'PENDING_OWNER', label: 'Đang chờ đối phương', count: allAppointments.filter((a) => a.status === 'PENDING_OWNER').length },
    { key: 'USER_ACCEPTED', label: 'Đã chốt lịch', count: allAppointments.filter((a) => a.status === 'USER_ACCEPTED').length },
    { key: 'COMPLETED', label: 'Đã hoàn thành', count: allAppointments.filter((a) => a.status === 'COMPLETED').length },
  ];

  const handleSelectSlotRadio = (appId: string, slotId: string) => {
    setSelectedSlots({ ...selectedSlots, [appId]: slotId });
  };

  const handleConfirmSlot = async (appId: string) => {
    const slotId = selectedSlots[appId];
    if (!slotId) {
      toast.warning('Vui lòng chọn 1 khung giờ xem phòng!');
      return;
    }

    setSubmittingAppId(appId);
    try {
      await appointmentApi.userConfirm(appId, {
        action: 'ACCEPT',
        selectedTimeSlotId: slotId,
      });
      toast.success('Đã xác nhận chốt lịch xem phòng thành công!');
      fetchAppointments();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Có lỗi xảy ra!');
    } finally {
      setSubmittingAppId(null);
    }
  };

  const handleRejectSlots = async (appId: string) => {
    const reason = window.prompt('Nhập lý do không thể tham gia các khung giờ này (không bắt buộc):');
    setSubmittingAppId(appId);
    try {
      await appointmentApi.userConfirm(appId, {
        action: 'REJECT',
        rejectReason: reason || undefined,
      });
      toast.info('Đã từ chối các khung giờ đề xuất.');
      fetchAppointments();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Có lỗi xảy ra!');
    } finally {
      setSubmittingAppId(null);
    }
  };

  const handleConfirmAttendance = async (appId: string) => {
    try {
      await appointmentApi.confirmAttendance(appId, true);
      toast.success('Đã xác nhận tham gia buổi hẹn!');
      fetchAppointments();
    } catch (err: any) {
      toast.error('Có lỗi xảy ra khi xác nhận!');
    }
  };

  const getStatusBadge = (app: Appointment) => {
    switch (app.status) {
      case 'PENDING_OWNER':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 flex items-center gap-1.5 w-fit">
            <Clock className="w-3.5 h-3.5" /> Đang chờ đối phương xác nhận
          </span>
        );
      case 'OWNER_OFFERED_TIMES':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 flex items-center gap-1.5 w-fit">
            <AlertCircle className="w-3.5 h-3.5" /> Yêu cầu xác nhận (Chọn khung giờ)
          </span>
        );
      case 'USER_ACCEPTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" /> Đã chốt lịch thành công
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 flex items-center gap-1.5 w-fit">
            <CheckSquare className="w-3.5 h-3.5" /> Đã hoàn thành
          </span>
        );
      case 'OWNER_REJECTED':
      case 'USER_REJECTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 flex items-center gap-1.5 w-fit">
            <XCircle className="w-3.5 h-3.5" /> Đã từ chối
          </span>
        );
      case 'EXPIRED_CANCELLED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 flex items-center gap-1.5 w-fit">
            <XCircle className="w-3.5 h-3.5" /> Đã hủy (Quá 48h)
          </span>
        );
      default:
        return null;
    }
  };

  const getSelectedSlot = (app: Appointment) => {
    return app.timeSlots?.find((s) => s.id === app.selectedTimeSlotId || s.isSelected);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-7 h-7 text-indigo-600" /> Lịch sử Đặt lịch xem phòng
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Quản lý các yêu cầu xem phòng, chọn khung giờ đề xuất từ chủ nhà và xác nhận chốt lịch.
        </p>
      </div>

      {/* Filter Tabs */}
      <FilterTabs tabs={filterTabs} active={statusFilter} onChange={setStatusFilter} />

      {/* Appointment Cards */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs">Đang tải lịch hẹn của bạn...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Bạn chưa có lịch hẹn xem phòng nào</h3>
          <p className="text-xs text-slate-400 mt-1">
            Hãy tìm kiếm phòng trọ và bấm "Đặt lịch xem phòng" để bắt đầu.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => {
            const selectedSlot = getSelectedSlot(app);
            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    {getStatusBadge(app)}
                    <span className="text-[11px] text-slate-400">
                      Gửi lúc: {new Date(app.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <Home className="w-4 h-4 text-indigo-600 shrink-0" />
                      {app.rentRoom?.name}
                      <span className="text-xs font-normal text-slate-500">({app.rentHouse?.name})</span>
                    </h3>

                    {app.rentHouse?.address && (
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {app.rentHouse.address}
                      </p>
                    )}

                    {app.rentHouse?.houseOwner && (
                      <p className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        Chủ nhà: {app.rentHouse.houseOwner.lastName} {app.rentHouse.houseOwner.firstName} - {app.rentHouse.houseOwner.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Confirmed Slot */}
                  {selectedSlot && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900">
                      <span className="font-bold block mb-1">Thời gian xem phòng đã chốt:</span>
                      <p className="text-sm font-semibold">
                        {new Date(selectedSlot.startTime).toLocaleString('vi-VN')} -{' '}
                        {new Date(selectedSlot.endTime).toLocaleTimeString('vi-VN')}
                      </p>
                    </div>
                  )}

                  {/* Select Slot Form if OWNER_OFFERED_TIMES */}
                  {app.status === 'OWNER_OFFERED_TIMES' && app.timeSlots && app.timeSlots.length > 0 && (
                    <div className="bg-indigo-50/60 border border-indigo-200 p-4 rounded-xl space-y-3">
                      <p className="text-xs font-bold text-indigo-900">
                        Chủ nhà đã đề xuất các khung giờ dưới đây. Vui lòng chọn 1 khung giờ phù hợp:
                      </p>
                      <div className="space-y-2">
                        {app.timeSlots.map((slot) => {
                          const slotId = slot.id || '';
                          const isChecked = selectedSlots[app.id] === slotId;
                          return (
                            <label
                              key={slotId}
                              onClick={() => handleSelectSlotRadio(app.id, slotId)}
                              className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                                isChecked
                                  ? 'border-indigo-600 bg-white shadow-sm font-semibold text-indigo-900'
                                  : 'border-indigo-100 bg-white/70 hover:bg-white text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`slot-${app.id}`}
                                checked={isChecked}
                                onChange={() => {}}
                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>
                                {new Date(slot.startTime).toLocaleString('vi-VN')} -{' '}
                                {new Date(slot.endTime).toLocaleTimeString('vi-VN')}
                              </span>
                            </label>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          onClick={() => handleRejectSlots(app.id)}
                          disabled={submittingAppId === app.id}
                          className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 text-slate-600 hover:bg-white"
                        >
                          Từ chối tất cả
                        </button>
                        <button
                          onClick={() => handleConfirmSlot(app.id)}
                          disabled={submittingAppId === app.id}
                          className="px-5 py-2 rounded-xl text-xs font-semibold text-white gradient-bg shadow-md hover:opacity-90 disabled:opacity-50"
                        >
                          {submittingAppId === app.id ? 'Đang chốt...' : 'Xác nhận chốt lịch'}
                        </button>
                      </div>
                    </div>
                  )}

                  {app.rejectReason && (
                    <div className="bg-rose-50 p-2.5 rounded-xl text-xs text-rose-800">
                      <span className="font-semibold">Lý do từ chối:</span> {app.rejectReason}
                    </div>
                  )}
                </div>

                {/* Attendance check button */}
                {app.status === 'USER_ACCEPTED' && !app.userAttendanceConfirmed && (
                  <div className="shrink-0 flex items-center">
                    <button
                      onClick={() => handleConfirmAttendance(app.id)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                    >
                      Xác nhận đã tham gia xem phòng
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
