import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Pagination } from '@/components/common/Pagination';
import { AppointmentListSkeleton } from '@/components/ui/Skeleton';
import { getApiErrorMessage } from '@/utils/apiError';

const PAGE_SIZE = 10;
const STATUS_KEYS = ['ALL', 'OWNER_OFFERED_TIMES', 'PENDING_OWNER', 'USER_ACCEPTED', 'COMPLETED'];

export const TenantAppointments: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [pageNumber, setPageNumber] = useState(1);

  // Selected time slot per appointment id
  const [selectedSlots, setSelectedSlots] = useState<{ [appId: string]: string }>({});
  const [submittingAppId, setSubmittingAppId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res: any = await appointmentApi.getTenantAppointments({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        pageNumber,
        pageSize: PAGE_SIZE,
      });
      const list = res.data?.data || res.data || [];
      setAppointments(list);
      setTotalItems(res.data?.metadata?.total ?? res.metadata?.total ?? 0);
      setTotalPages(res.data?.metadata?.totalPages ?? res.metadata?.totalPages ?? 0);
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusCounts = async () => {
    const entries = await Promise.all(
      STATUS_KEYS.map(async (key) => {
        const res: any = await appointmentApi.getTenantAppointments({
          status: key !== 'ALL' ? key : undefined,
          pageNumber: 1,
          pageSize: 1,
        });
        const total = res.data?.metadata?.total ?? res.metadata?.total ?? 0;
        return [key, total] as const;
      }),
    );
    setStatusCounts(Object.fromEntries(entries));
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, pageNumber]);

  useEffect(() => {
    fetchStatusCounts();
  }, []);

  const handleStatusFilterChange = (key: string) => {
    setStatusFilter(key);
    setPageNumber(1);
  };

  const filterTabs = [
    { key: 'ALL', label: t('tenantAppointments.filterAll'), count: statusCounts.ALL ?? 0 },
    { key: 'OWNER_OFFERED_TIMES', label: t('tenantAppointments.filterOffered'), count: statusCounts.OWNER_OFFERED_TIMES ?? 0 },
    { key: 'PENDING_OWNER', label: t('tenantAppointments.filterPending'), count: statusCounts.PENDING_OWNER ?? 0 },
    { key: 'USER_ACCEPTED', label: t('tenantAppointments.filterAccepted'), count: statusCounts.USER_ACCEPTED ?? 0 },
    { key: 'COMPLETED', label: t('tenantAppointments.filterCompleted'), count: statusCounts.COMPLETED ?? 0 },
  ];

  const handleSelectSlotRadio = (appId: string, slotId: string) => {
    setSelectedSlots({ ...selectedSlots, [appId]: slotId });
  };

  const handleConfirmSlot = async (appId: string) => {
    const slotId = selectedSlots[appId];
    if (!slotId) {
      toast.warning(t('tenantAppointments.toastNeedSlot'));
      return;
    }

    setSubmittingAppId(appId);
    try {
      await appointmentApi.userConfirm(appId, {
        action: 'ACCEPT',
        selectedTimeSlotId: slotId,
      });
      toast.success(t('tenantAppointments.toastConfirmSuccess'));
      fetchAppointments();
      fetchStatusCounts();
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmittingAppId(null);
    }
  };

  const handleRejectSlots = async (appId: string) => {
    const reason = window.prompt(t('tenantAppointments.promptRejectReason'));
    setSubmittingAppId(appId);
    try {
      await appointmentApi.userConfirm(appId, {
        action: 'REJECT',
        rejectReason: reason || undefined,
      });
      toast.info(t('tenantAppointments.toastRejectSuccess'));
      fetchAppointments();
      fetchStatusCounts();
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmittingAppId(null);
    }
  };

  const handleConfirmAttendance = async (appId: string) => {
    try {
      await appointmentApi.confirmAttendance(appId, true);
      toast.success(t('tenantAppointments.toastAttendanceSuccess'));
      fetchAppointments();
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const getStatusBadge = (app: Appointment) => {
    switch (app.status) {
      case 'PENDING_OWNER':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 flex items-center gap-1.5 w-fit">
            <Clock className="w-3.5 h-3.5" /> {t('tenantAppointments.badgePending')}
          </span>
        );
      case 'OWNER_OFFERED_TIMES':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 flex items-center gap-1.5 w-fit">
            <AlertCircle className="w-3.5 h-3.5" /> {t('tenantAppointments.badgeOffered')}
          </span>
        );
      case 'USER_ACCEPTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" /> {t('tenantAppointments.badgeAccepted')}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 flex items-center gap-1.5 w-fit">
            <CheckSquare className="w-3.5 h-3.5" /> {t('tenantAppointments.badgeCompleted')}
          </span>
        );
      case 'OWNER_REJECTED':
      case 'USER_REJECTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 flex items-center gap-1.5 w-fit">
            <XCircle className="w-3.5 h-3.5" /> {t('tenantAppointments.badgeRejected')}
          </span>
        );
      case 'EXPIRED_CANCELLED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 flex items-center gap-1.5 w-fit">
            <XCircle className="w-3.5 h-3.5" /> {t('tenantAppointments.badgeExpired')}
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
          <Calendar className="w-7 h-7 text-indigo-600" /> {t('tenantAppointments.title')}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {t('tenantAppointments.subtitle')}
        </p>
      </div>

      {/* Filter Tabs */}
      <FilterTabs tabs={filterTabs} active={statusFilter} onChange={handleStatusFilterChange} />

      {/* Appointment Cards */}
      {loading ? (
        <AppointmentListSkeleton count={PAGE_SIZE} />
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">{t('tenantAppointments.emptyTitle')}</h3>
          <p className="text-xs text-slate-400 mt-1">
            {t('tenantAppointments.emptyDesc')}
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
                      {t('tenantAppointments.sentAt', { date: new Date(app.createdAt).toLocaleDateString('vi-VN') })}
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
                        {t('tenantAppointments.ownerLabel')}: {app.rentHouse.houseOwner.lastName} {app.rentHouse.houseOwner.firstName} - {app.rentHouse.houseOwner.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* Confirmed Slot */}
                  {selectedSlot && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900">
                      <span className="font-bold block mb-1">{t('tenantAppointments.confirmedSlotLabel')}</span>
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
                        {t('tenantAppointments.offeredSlotsIntro')}
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
                          {t('tenantAppointments.rejectAll')}
                        </button>
                        <button
                          onClick={() => handleConfirmSlot(app.id)}
                          disabled={submittingAppId === app.id}
                          className="px-5 py-2 rounded-xl text-xs font-semibold text-white gradient-bg shadow-md hover:opacity-90 disabled:opacity-50"
                        >
                          {submittingAppId === app.id ? t('tenantAppointments.confirming') : t('tenantAppointments.confirmSlot')}
                        </button>
                      </div>
                    </div>
                  )}

                  {app.rejectReason && (
                    <div className="bg-rose-50 p-2.5 rounded-xl text-xs text-rose-800">
                      <span className="font-semibold">{t('tenantAppointments.rejectReasonLabel')}</span> {app.rejectReason}
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
                      {t('tenantAppointments.confirmAttendance')}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={pageNumber}
          totalPages={totalPages}
          onPageChange={setPageNumber}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
        />
      )}
    </div>
  );
};
