import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Clock, Minus, Plus } from 'lucide-react';
import { Room } from '@/types';
import { bookingApi, BookingQuote, BusyRange } from '@/services/bookingApi';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatVnd } from '@/utils/money';
import {
  BookingMode,
  BookingSelection,
  fromDateKey,
  getShortTermOptions,
  hourlyEndLabel,
  minuteToTime,
  timeToMinute,
  toDateKey,
  validateHourlySelection,
  vnInstant,
  vnMinuteNow,
  vnToday,
} from '@/utils/shortTermBooking';
import { DateRangeCalendar } from './DateRangeCalendar';

interface Props {
  room: Room;
  /** Lựa chọn hiện tại đã đủ/hợp lệ phía web (null nếu chưa đủ); `quoteOk` = server đã báo giá được (còn trống). */
  onChange: (selection: BookingSelection | null, quoteOk: boolean) => void;
}

const formatDay = (d: Date) => d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });

/** Mốc thời gian thật của đơn (ISO) hiển thị theo giờ Việt Nam, không phụ thuộc múi giờ trình duyệt. */
const formatInstantVn = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

/**
 * Chọn thời gian thuê ngắn hạn — 2 hình thức độc lập (phòng bật 1 hoặc cả 2):
 *  - Theo ngày: chọn ngày nhận + ngày trả trên lịch (giờ nhận/trả lấy theo phòng, hiện ngay dưới nút chọn).
 *  - Theo giờ: chọn ngày + giờ bắt đầu + số giờ (− / +, trong khoảng min–max và khung giờ nhận khách của phòng).
 * Giá luôn do server báo (không tự tính ở web) để không lệch công thức lúc đặt thật.
 */
export const ShortTermBookingPanel: React.FC<Props> = ({ room, onChange }) => {
  const { t } = useTranslation();
  const opts = useMemo(() => getShortTermOptions(room), [room]);
  const [mode, setMode] = useState<BookingMode>(opts.hasDaily ? 'DAILY' : 'HOURLY');

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [hourDate, setHourDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [hours, setHours] = useState<number>(opts.minHours);

  const [busyRanges, setBusyRanges] = useState<BusyRange[]>([]);
  const [quote, setQuote] = useState<BookingQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState('');
  const requestIdRef = useRef(0);

  useEffect(() => {
    bookingApi
      .getAvailability(room.id)
      .then((res: any) => setBusyRanges(res?.data || res || []))
      .catch(() => setBusyRanges([]));
  }, [room.id]);

  const startMinute = timeToMinute(startTime);
  // useMemo: Date mới mỗi lần render sẽ làm `selection` đổi identity liên tục -> báo giá lặp vô hạn.
  const hourDateValue = useMemo(() => (hourDate ? fromDateKey(hourDate) : null), [hourDate]);
  const hourlyError =
    mode === 'HOURLY' && hourDateValue && startMinute !== null
      ? validateHourlySelection(opts, hourDateValue, startMinute, hours)
      : null;

  const selection: BookingSelection | null = useMemo(() => {
    if (mode === 'DAILY') {
      if (!checkIn || !checkOut) return null;
      return { mode, checkInDate: toDateKey(checkIn), checkOutDate: toDateKey(checkOut) };
    }
    if (!hourDateValue || startMinute === null || hourlyError) return null;
    return { mode, checkInDate: vnInstant(hourDateValue, startMinute).toISOString(), hours };
  }, [mode, checkIn, checkOut, hourDateValue, startMinute, hours, hourlyError]);

  // Khoá chuỗi của lựa chọn: effect báo giá chỉ chạy lại khi NỘI DUNG lựa chọn đổi (không phụ thuộc identity object).
  const selectionKey = JSON.stringify(selection);

  useEffect(() => {
    if (!selection) {
      requestIdRef.current++;
      setQuote(null);
      setQuoteError('');
      setQuoteLoading(false);
      onChange(null, false);
      return;
    }
    const requestId = ++requestIdRef.current;
    setQuoteLoading(true);
    setQuoteError('');
    bookingApi
      .getQuote(room.id, selection)
      .then((res: any) => {
        if (requestIdRef.current !== requestId) return;
        setQuote(res?.data || res);
        onChange(selection, true);
      })
      .catch((err: any) => {
        if (requestIdRef.current !== requestId) return;
        setQuote(null);
        setQuoteError(getApiErrorMessage(err) || t('booking.quoteError'));
        onChange(selection, false);
      })
      .finally(() => {
        if (requestIdRef.current !== requestId) return;
        setQuoteLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.id, selectionKey]);

  const today = vnToday();
  const todayKey = toDateKey(today);
  const hourDateMin = todayKey;
  // Trên lịch chọn ngày: nếu hôm nay đã quá giờ nhận phòng thì không cho chọn hôm nay làm ngày nhận (backend cũng chặn).
  const checkInPassedToday = vnMinuteNow() >= opts.checkInMinute;

  const dayBtnClass =
    'w-full flex items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors text-left';
  const inputClass =
    'w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500';

  return (
    <div className="space-y-2.5">
      {opts.hasDaily && opts.hasHourly ? (
        <div className="grid grid-cols-2 gap-2">
          {(['DAILY', 'HOURLY'] as BookingMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setHours((h) => Math.min(Math.max(h, opts.minHours), opts.maxHours));
              }}
              className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                mode === m ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-700 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {t(m === 'DAILY' ? 'booking.modeDaily' : 'booking.modeHourly')}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs font-bold text-indigo-700">{t(opts.hasDaily ? 'booking.modeDaily' : 'booking.modeHourly')}</p>
      )}

      {mode === 'DAILY' ? (
        <>
          <button type="button" onClick={() => setShowCalendar(true)} className={dayBtnClass}>
            <span className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-600 shrink-0" />
              {checkIn && checkOut ? (
                <span className="text-xs font-bold text-slate-800">
                  {formatDay(checkIn)} → {formatDay(checkOut)}
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-500">{t('booking.selectDatesButton')}</span>
              )}
            </span>
          </button>
          <p className="text-[11px] text-slate-500 px-1">
            {t('booking.dailyTimesHint', {
              checkIn: minuteToTime(opts.checkInMinute),
              checkOut: minuteToTime(opts.checkOutMinute),
            })}
            {checkInPassedToday && ` ${t('booking.todayPassedHint')}`}
          </p>
        </>
      ) : (
        <div className="space-y-2">
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">{t('booking.hourlyDateLabel')}</label>
            <input
              type="date"
              min={hourDateMin}
              value={hourDate}
              onChange={(e) => setHourDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-500 block mb-1">
              {t('booking.startTimeLabel')}
              {opts.openMinute !== null && opts.closeMinute !== null && (
                <span className="ml-1 text-slate-400">
                  ({t('booking.windowHint', { open: minuteToTime(opts.openMinute), close: minuteToTime(opts.closeMinute) })})
                </span>
              )}
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
              <input
                type="time"
                value={startTime}
                disabled={!hourDate}
                onChange={(e) => setStartTime(e.target.value)}
                className={`${inputClass} disabled:opacity-50`}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500">{t('booking.hoursLabel')}</p>
              <p className="text-[10px] text-slate-400">{t('booking.hoursRange', { min: opts.minHours, max: opts.maxHours })}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={hours <= opts.minHours}
                onClick={() => setHours((h) => Math.max(h - 1, opts.minHours))}
                className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center disabled:opacity-30"
                aria-label="-"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center text-base font-black text-slate-900">{hours}</span>
              <button
                type="button"
                disabled={hours >= opts.maxHours}
                onClick={() => setHours((h) => Math.min(h + 1, opts.maxHours))}
                className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center disabled:opacity-30"
                aria-label="+"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          {startMinute !== null && (
            <p className="text-[11px] text-slate-500 px-1">{t('booking.endsAt', { time: hourlyEndLabel(startMinute, hours) })}</p>
          )}
          {hourlyError && <p className="text-[11px] text-rose-500 px-1">{t(hourlyError)}</p>}
        </div>
      )}

      {(quoteLoading || quote || quoteError) && (
        <div className="text-xs rounded-2xl bg-emerald-50 border border-emerald-100 p-3 space-y-1">
          {quoteLoading ? (
            <span className="text-slate-400">{t('booking.quoteLoading')}</span>
          ) : quoteError ? (
            <span className="text-rose-500">{quoteError}</span>
          ) : quote ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-600">
                  {quote.mode === 'HOURLY'
                    ? t('booking.quoteHoursLine', { count: quote.hours as number, price: formatVnd(quote.unitPrice) })
                    : t('booking.quoteNightsLine', { count: quote.nights as number, price: formatVnd(quote.unitPrice) })}
                  {quote.discountPercent > 0 && (
                    <span className="text-emerald-600 font-bold ml-1">
                      ({t('booking.quoteDiscountApplied', { percent: quote.discountPercent })})
                    </span>
                  )}
                </span>
                <span className="font-black text-slate-900">{formatVnd(quote.amount)}</span>
              </div>
              {quote.cappedByDailyPrice && <p className="text-slate-500">{t('booking.quoteCapped')}</p>}
              <p className="text-slate-500">{t('booking.stayFrom', { time: formatInstantVn(quote.checkInAt) })}</p>
              <p className="text-slate-500">{t('booking.stayTo', { time: formatInstantVn(quote.checkOutAt) })}</p>
            </>
          ) : null}
        </div>
      )}

      {showCalendar && (
        <DateRangeCalendar
          busyRanges={busyRanges}
          checkInDate={checkIn}
          checkOutDate={checkOut}
          onChange={(newIn, newOut) => {
            setCheckIn(newIn);
            setCheckOut(newOut);
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
};
