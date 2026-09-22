import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { BusyRange } from '@/services/bookingApi';

interface DateRangeCalendarProps {
  busyRanges: BusyRange[];
  checkInDate: Date | null;
  checkOutDate: Date | null;
  onChange: (checkInDate: Date | null, checkOutDate: Date | null) => void;
  onClose: () => void;
  // Phòng PER_HOUR: nhận/trả phòng cùng 1 ngày là trường hợp BÌNH THƯỜNG (khác giờ, chọn ở ô giờ
  // riêng bên ngoài lịch này) — cho phép bấm lại đúng ngày đã chọn làm ngày trả. Phòng PER_DAY:
  // bắt buộc ngày trả phải SAU ngày nhận (tối thiểu 1 đêm), giữ hành vi mặc định.
  allowSameDay?: boolean;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// Booking backend luôn coi "ngày" theo lịch Việt Nam (UTC+7) — busyRanges trả về từ server là
// mốc UTC thật. Nếu quy đổi về ngày lịch bằng getFullYear/getMonth/getDate (múi giờ TRÌNH DUYỆT)
// như startOfDay() ở trên, khách xem từ múi giờ khác Việt Nam (nhà hỗ trợ khách nước ngoài —
// acceptForeignTenants) sẽ tính sai lệch 1 ngày cho ranh giới UTC gần nửa đêm VN. Quy đổi cố định
// về UTC+7 trước khi lấy Y/M/D để MỌI khách đều thấy đúng cùng 1 ngày bận, bất kể múi giờ trình
// duyệt — kết quả vẫn là 1 Date ở nửa đêm LOCAL để so sánh nhất quán với các ô lưới khác (đều
// dựng bằng new Date(y,m,d) local, xem buildMonthGrid).
const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
const toVnCalendarDay = (isoOrDate: string | Date): Date => {
  const shifted = new Date(new Date(isoOrDate).getTime() + VN_OFFSET_MS);
  return new Date(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate());
};
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
const isSameDay = (a: Date, b: Date) => a.getTime() === startOfDay(b).getTime();

// Lưới ngày cho 1 tháng — mảng 42 ô (6 tuần), null cho ô đệm ngoài tháng.
const buildMonthGrid = (monthStart: Date): (Date | null)[] => {
  const firstWeekday = monthStart.getDay(); // 0=CN
  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
  const grid: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) grid.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    grid.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), day));
  }
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
};

// Lưới lịch tự viết (không thêm thư viện calendar mới) — lưới 1 tháng, chuyển tháng trước/sau,
// tự xám ngày quá khứ + ngày bận (từ busyRanges), click lần 1 chọn ngày nhận, lần 2 chọn ngày trả.
export const DateRangeCalendar: React.FC<DateRangeCalendarProps> = ({
  busyRanges,
  checkInDate,
  checkOutDate,
  onChange,
  onClose,
  allowSameDay = false,
}) => {
  const { t } = useTranslation();
  const today = toVnCalendarDay(new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const busyDayTimestamps = useMemo(() => {
    const set = new Set<number>();
    busyRanges.forEach((range) => {
      let cursor = toVnCalendarDay(range.start);
      const end = toVnCalendarDay(range.end);
      while (cursor.getTime() < end.getTime()) {
        set.add(cursor.getTime());
        cursor = addDays(cursor, 1);
      }
    });
    return set;
  }, [busyRanges]);

  const isBusy = (d: Date) => busyDayTimestamps.has(d.getTime());
  const isPast = (d: Date) => d.getTime() < today.getTime();

  // Khoảng [checkIn, d) có cắt ngang ngày bận nào không — chặn chọn ngày trả nếu có.
  const rangeCrossesBusyDay = (start: Date, end: Date) => {
    let cursor = start;
    while (cursor.getTime() < end.getTime()) {
      if (isBusy(cursor)) return true;
      cursor = addDays(cursor, 1);
    }
    return false;
  };

  const handleDayClick = (d: Date) => {
    if (isPast(d) || isBusy(d)) return;

    if (!checkInDate || checkOutDate) {
      // Chưa chọn gì, hoặc đã chọn đủ cả 2 — bắt đầu chọn lại từ đầu.
      onChange(d, null);
      return;
    }
    // Đã có checkInDate, đang chờ chọn checkOutDate. Phòng PER_HOUR cho phép trả phòng CÙNG
    // ngày nhận (allowSameDay) — chỉ chặn ngày trả sớm hơn ngày nhận, không chặn bằng nhau.
    const isTooEarly = allowSameDay
      ? d.getTime() < checkInDate.getTime()
      : d.getTime() <= checkInDate.getTime();
    if (isTooEarly) {
      onChange(d, null);
      return;
    }
    if (rangeCrossesBusyDay(checkInDate, d)) {
      // Khoảng chọn cắt ngang ngày bận — huỷ chọn cũ, bắt đầu lại từ ngày vừa bấm.
      onChange(d, null);
      return;
    }
    onChange(checkInDate, d);
  };

  const monthLabel = (d: Date) => d.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  const weekdayLabels = [t('booking.calWeekdaySun'), t('booking.calWeekdayMon'), t('booking.calWeekdayTue'), t('booking.calWeekdayWed'), t('booking.calWeekdayThu'), t('booking.calWeekdayFri'), t('booking.calWeekdaySat')];

  const renderMonth = (monthStart: Date) => {
    const grid = buildMonthGrid(monthStart);
    return (
      <div className="flex-1 min-w-[260px]">
        <p className="text-center text-sm font-bold text-slate-800 mb-3 capitalize">{monthLabel(monthStart)}</p>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-1">
          {weekdayLabels.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {grid.map((d, idx) => {
            if (!d) return <div key={idx} />;
            const past = isPast(d);
            const busy = isBusy(d);
            const isCheckIn = checkInDate && isSameDay(checkInDate, d);
            const isCheckOut = checkOutDate && isSameDay(checkOutDate, d);
            const inRange =
              checkInDate && checkOutDate && d.getTime() > checkInDate.getTime() && d.getTime() < checkOutDate.getTime();
            const disabled = past || busy;

            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => handleDayClick(d)}
                className={`aspect-square rounded-xl text-xs font-semibold transition-colors ${
                  isCheckIn || isCheckOut
                    ? 'bg-indigo-600 text-white'
                    : inRange
                      ? 'bg-indigo-100 text-indigo-700'
                      : disabled
                        ? 'text-slate-300 line-through cursor-not-allowed'
                        : 'text-slate-700 hover:bg-indigo-50'
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 font-heading">{t('booking.calendarTitle')}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setVisibleMonth((m) => addMonths(m, -1))}
              disabled={visibleMonth.getTime() <= new Date(today.getFullYear(), today.getMonth(), 1).getTime()}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-400">{t('booking.calendarNavHint')}</span>
            <button
              type="button"
              onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            {renderMonth(visibleMonth)}
            <div className="hidden sm:block">{renderMonth(addMonths(visibleMonth, 1))}</div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-600 inline-block" /> {t('booking.calendarLegendSelected')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-200 inline-block" /> {t('booking.calendarLegendBusy')}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="text-sm">
              <span className="text-slate-500">{t('booking.checkInLabel')}: </span>
              <span className="font-bold text-slate-800">
                {checkInDate ? checkInDate.toLocaleDateString('vi-VN') : t('booking.notSelected')}
              </span>
              <span className="text-slate-500"> — {t('booking.checkOutLabel')}: </span>
              <span className="font-bold text-slate-800">
                {checkOutDate ? checkOutDate.toLocaleDateString('vi-VN') : t('booking.notSelected')}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={!checkInDate || !checkOutDate}
              className="px-5 py-2.5 rounded-xl gradient-bg text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('booking.calendarDoneButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
