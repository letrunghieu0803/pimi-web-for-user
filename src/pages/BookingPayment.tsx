import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { bookingApi, Booking } from '@/services/bookingApi';
import { getApiErrorMessage } from '@/utils/apiError';
import { Seo } from '@/components/common/Seo';

const POLL_INTERVAL_MS = 4000;

const formatCountdown = (ms: number) => {
  if (ms <= 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const BookingPayment: React.FC = () => {
  const { t } = useTranslation();
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [remainingMs, setRemainingMs] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchBooking = async () => {
    if (!bookingId) return;
    try {
      const res: any = await bookingApi.getOne(bookingId);
      setBooking(res?.data || res);
      setError('');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  useEffect(() => {
    if (booking?.status === 'PENDING_PAYMENT') {
      pollRef.current = setInterval(fetchBooking, POLL_INTERVAL_MS);
    } else if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.status]);

  useEffect(() => {
    if (booking?.status === 'PENDING_PAYMENT' && booking?.expiresAt) {
      const tick = () => setRemainingMs(new Date(booking.expiresAt).getTime() - Date.now());
      tick();
      countdownRef.current = setInterval(tick, 1000);
    } else if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [booking?.status, booking?.expiresAt]);

  const formatMoney = (n: string | number) => `${Number(n).toLocaleString('vi-VN')} đ`;
  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">{error || t('bookingPayment.notFound')}</h2>
        <Link to="/rooms" className="text-indigo-600 font-bold text-sm hover:underline">
          {t('roomDetail.backToList')}
        </Link>
      </div>
    );
  }

  const isPending = booking.status === 'PENDING_PAYMENT';
  const isExpired = booking.status === 'EXPIRED';
  const isPaidOrLater = ['PAID', 'CHECKED_IN', 'PAYOUT_COMPLETED'].includes(booking.status);

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Seo title={t('bookingPayment.title')} path={`/payment/${bookingId}`} noindex />
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>{t('roomDetail.backLink')}</span>
      </button>

      <div className="glass-panel p-6 rounded-3xl shadow-xl border border-slate-200/90 space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-lg font-black text-slate-900 font-heading">{booking.roomName}</h1>
          <p className="text-2xl font-black text-emerald-600 font-heading">{formatMoney(booking.amount)}</p>
          {/* checkInDate/checkOutDate null ở các đơn tạo trước tính năng chọn ngày (không backfill). */}
          {booking.checkInDate && booking.checkOutDate && (
            <p className="text-xs text-slate-500">
              {t('bookingPayment.stayPeriodLabel')}: {formatDateTime(booking.checkInDate)} → {formatDateTime(booking.checkOutDate)}
            </p>
          )}
        </div>

        {isPending && (
          <>
            <div className="text-center space-y-1">
              <p className="text-xs text-slate-500 font-semibold">{t('bookingPayment.countdownLabel')}</p>
              <p className="text-3xl font-black text-slate-900">{formatCountdown(remainingMs)}</p>
            </div>

            {booking.qrImageBase64 && (
              <div className="flex justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <img src={booking.qrImageBase64} alt="QR" className="w-56 h-56 object-contain" />
              </div>
            )}

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
              <p className="font-bold text-slate-800">{t('bookingPayment.instructionTitle')}</p>
              <p>{t('bookingPayment.instructionStep1')}</p>
              <p>{t('bookingPayment.instructionStep2')}</p>
              <p className="text-[11px] text-slate-500 mt-2">{t('bookingPayment.referenceLabel')}</p>
              <p className="font-bold text-slate-800">{booking.qrPaymentCode}</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              <span>{t('bookingPayment.waitingForPayment')}</span>
            </div>
          </>
        )}

        {isPaidOrLater && (
          <div className="text-center space-y-3 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">{t('bookingPayment.paidTitle')}</h2>
            <p className="text-sm text-slate-500">{t('bookingPayment.paidText')}</p>
            <Link
              to={`/rooms/${booking.rentRoomId}`}
              className="inline-block mt-2 px-6 py-3 rounded-2xl gradient-bg text-white font-bold text-sm"
            >
              {t('bookingPayment.backToRoomButton')}
            </Link>
          </div>
        )}

        {isExpired && (
          <div className="text-center space-y-3 py-4">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">{t('bookingPayment.expiredTitle')}</h2>
            <p className="text-sm text-slate-500">{t('bookingPayment.expiredText')}</p>
            <Link
              to={`/rooms/${booking.rentRoomId}`}
              className="inline-block mt-2 px-6 py-3 rounded-2xl gradient-bg text-white font-bold text-sm"
            >
              {t('bookingPayment.backToRoomButton')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
