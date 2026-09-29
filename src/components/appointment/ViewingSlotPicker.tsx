import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { appointmentAvailabilityApi, AppointmentAvailabilitySlot } from '@/services/appointmentAvailabilityApi';

export interface ViewingSlotSelection {
  viewingDate: string; // yyyy-mm-dd
  startMinute: number;
  slotCount: 1 | 2;
}

interface ViewingSlotPickerProps {
  rentHouseId: string;
  onNext: (selection: ViewingSlotSelection) => void;
  onClose: () => void;
}

const pad2 = (n: number) => String(n).padStart(2, '0');
const minuteToLabel = (m: number) => `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
const toDateKey = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, days: number) => {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
};
const addMonths = (d: Date, months: number) => {
  const next = new Date(d);
  next.setMonth(next.getMonth() + months);
  return next;
};

// Lưới ngày cho 1 tháng — mảng ô (bội số 7), null cho ô đệm ngoài tháng. Giống hệt
// DateRangeCalendar.tsx (không tách thành util dùng chung để tránh 2 component này phải đồng bộ
// thay đổi cùng lúc — mỗi cái phục vụ 1 đơn vị dữ liệu khác nhau: cả-ngày-bận vs slot 30 phút).
const buildMonthGrid = (monthStart: Date): (Date | null)[] => {
  const firstWeekday = monthStart.getDay();
  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
  const grid: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) grid.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    grid.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), day));
  }
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
};

// Số ngày lấy trước (kể cả hôm nay) — giữ dưới giới hạn 62 ngày `to-from` của backend, đủ hiển
// thị lịch tháng hiện tại + tháng kế tiếp trong UI 2 tháng bên dưới.
const FETCH_WINDOW_DAYS = 60;

// Bước 1/3 của luồng đặt lịch xem nhà tự chọn — lịch + lưới slot 30 phút, đọc lưới công khai
// GET /v1/appointment-availability/public/:rentHouseId/grid. Tái dùng UX lịch tháng từ
// DateRangeCalendar.tsx (fetch 1 lần, tô theo ngày), khác biệt chính: đơn vị là slot 30 phút
// trong 1 ngày thay vì cả khoảng ngày bận, và cho chọn tối đa 2 slot 30 phút LIÊN TIẾP (enforce ở
// đây, không chỉ dựa vào lỗi 400 của server khi submit).
export const ViewingSlotPicker: React.FC<ViewingSlotPickerProps> = ({ rentHouseId, onNext, onClose }) => {
  const { t } = useTranslation();
  const today = startOfDay(new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [slotsByDate, setSlotsByDate] = useState<Map<string, AppointmentAvailabilitySlot[]>>(new Map());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  // Sorted, tối đa 2 phần tử, luôn liên tiếp (cách nhau đúng 30 phút) — enforce ở handleSlotClick.
  const [selectedMinutes, setSelectedMinutes] = useState<number[]>([]);

  const rangeEnd = useMemo(() => addDays(today, FETCH_WINDOW_DAYS), [today]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    appointmentAvailabilityApi
      .getPublicGrid(rentHouseId, toDateKey(today), toDateKey(rangeEnd))
      .then((res: any) => {
        if (cancelled) return;
        const list: AppointmentAvailabilitySlot[] = res?.data || res || [];
        const map = new Map<string, AppointmentAvailabilitySlot[]>();
        list.forEach((slot) => {
          const arr = map.get(slot.date) || [];
          arr.push(slot);
          map.set(slot.date, arr);
        });
        map.forEach((arr) => arr.sort((a, b) => a.startMinute - b.startMinute));
        setSlotsByDate(map);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rentHouseId]);

  const dayHasOpenSlot = (d: Date) => (slotsByDate.get(toDateKey(d)) || []).some((s) => s.isOpen);
  const isPast = (d: Date) => d.getTime() < today.getTime();
  const isOutOfWindow = (d: Date) => d.getTime() > rangeEnd.getTime();

  const selectedDaySlots = selectedDateKey ? slotsByDate.get(selectedDateKey) || [] : [];

  const handleDayClick = (d: Date) => {
    if (isPast(d) || isOutOfWindow(d) || !dayHasOpenSlot(d)) return;
    setSelectedDateKey(toDateKey(d));
    setSelectedMinutes([]);
  };

  const handleSlotClick = (slot: AppointmentAvailabilitySlot) => {
    if (!slot.isOpen) return;
    const m = slot.startMinute;
    setSelectedMinutes((prev) => {
      if (prev.includes(m)) {
        return prev.filter((x) => x !== m);
      }
      if (prev.length === 0) return [m];
      if (prev.length === 1) {
        const existing = prev[0];
        if (m === existing + 30 || m === existing - 30) {
          return [existing, m].sort((a, b) => a - b);
        }
        // Bấm 1 slot không liền kề slot đang chọn — bắt đầu chọn lại từ slot vừa bấm thay vì
        // chặn thao tác (dễ hiểu hơn cho người dùng so với việc không phản hồi gì).
        return [m];
      }
      // Đã chọn đủ 2 (tối đa cho phép) — bấm slot khác coi như chọn lại từ đầu.
      return [m];
    });
  };

  const monthLabel = (d: Date) => d.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  const weekdayLabels = [
    t('booking.calWeekdaySun'),
    t('booking.calWeekdayMon'),
    t('booking.calWeekdayTue'),
    t('booking.calWeekdayWed'),
    t('booking.calWeekdayThu'),
    t('booking.calWeekdayFri'),
    t('booking.calWeekdaySat'),
  ];

  const nextMonthDisabled = addMonths(visibleMonth, 1).getTime() > new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1).getTime();

  const renderMonth = (monthStart: Date) => {
    const grid = buildMonthGrid(monthStart);
    return (
      <div className="flex-1 min-w-[240px]">
        <p className="text-center text-sm font-bold text-slate-800 mb-3 capitalize">{monthLabel(monthStart)}</p>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-1">
          {weekdayLabels.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {grid.map((d, idx) => {
            if (!d) return <div key={idx} />;
            const disabled = isPast(d) || isOutOfWindow(d) || !dayHasOpenSlot(d);
            const isSelected = selectedDateKey === toDateKey(d);
            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => handleDayClick(d)}
                className={`aspect-square rounded-xl text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : disabled
                      ? 'text-slate-300 line-through cursor-not-allowed'
                      : 'text-slate-700 bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const canProceed = selectedDateKey !== null && selectedMinutes.length > 0;

  const handleNext = () => {
    if (!selectedDateKey || selectedMinutes.length === 0) return;
    onNext({
      viewingDate: selectedDateKey,
      startMinute: Math.min(...selectedMinutes),
      slotCount: (selectedMinutes.length === 2 ? 2 : 1) as 1 | 2,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">{t('viewingSlotPicker.title')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t('viewingSlotPicker.subtitle')}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-slate-400 text-sm">
              <Loader2 className="w-5 h-5 animate-spin" /> {t('viewingSlotPicker.loading')}
            </div>
          ) : loadError ? (
            <div className="text-center py-12 text-rose-600 text-sm">{t('viewingSlotPicker.loadError')}</div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setVisibleMonth((m) => addMonths(m, -1))}
                  disabled={visibleMonth.getTime() <= new Date(today.getFullYear(), today.getMonth(), 1).getTime()}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-4 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200 inline-block" /> {t('viewingSlotPicker.legendOpen')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-indigo-600 inline-block" /> {t('viewingSlotPicker.legendSelected')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
                  disabled={nextMonthDisabled}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                {renderMonth(visibleMonth)}
                <div className="hidden sm:block">{renderMonth(addMonths(visibleMonth, 1))}</div>
              </div>

              {selectedDateKey && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <p className="text-xs font-bold text-slate-700">
                    {t('viewingSlotPicker.slotsForDayLabel', { date: new Date(`${selectedDateKey}T00:00:00`).toLocaleDateString('vi-VN') })}
                  </p>
                  <p className="text-[11px] text-slate-400">{t('viewingSlotPicker.slotCountHint')}</p>
                  {selectedDaySlots.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">{t('viewingSlotPicker.noSlotsForDay')}</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {selectedDaySlots.map((slot) => {
                        const isSelected = selectedMinutes.includes(slot.startMinute);
                        return (
                          <button
                            key={slot.startMinute}
                            type="button"
                            disabled={!slot.isOpen}
                            onClick={() => handleSlotClick(slot)}
                            className={`px-2 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : slot.isOpen
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                                  : 'bg-slate-50 border-slate-200 text-slate-300 line-through cursor-not-allowed'
                            }`}
                          >
                            {minuteToLabel(slot.startMinute)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between p-5 border-t border-slate-100 shrink-0">
          <span className="text-xs text-slate-500">
            {selectedMinutes.length > 0 && selectedDateKey
              ? t('viewingSlotPicker.selectedSummary', {
                  date: new Date(`${selectedDateKey}T00:00:00`).toLocaleDateString('vi-VN'),
                  start: minuteToLabel(Math.min(...selectedMinutes)),
                  end: minuteToLabel(Math.max(...selectedMinutes) + 30),
                })
              : t('viewingSlotPicker.notSelectedYet')}
          </span>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className="px-6 py-2.5 rounded-xl gradient-bg text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t('viewingSlotPicker.nextButton')}
          </button>
        </div>
      </div>
    </div>
  );
};
