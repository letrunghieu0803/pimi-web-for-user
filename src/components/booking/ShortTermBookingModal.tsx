import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, X } from 'lucide-react';
import { Room } from '@/types';
import { bookingApi } from '@/services/bookingApi';
import { getApiErrorMessage } from '@/utils/apiError';
import { BookingSelection } from '@/utils/shortTermBooking';
import { ShortTermBookingPanel } from './ShortTermBookingPanel';

interface Props {
  room: Room;
  onClose: () => void;
  /** Đơn đã tạo xong — trang chi tiết chuyển sang màn thanh toán QR. */
  onBooked: (bookingId: string) => void;
}

/**
 * Modal chọn thời gian thuê ngắn hạn, mở khi bấm "Đặt phòng & Thanh toán":
 *  - Xác nhận: tạo đơn rồi sang trang thanh toán (chỉ bấm được khi đã chọn đủ và server báo giá được).
 *  - Hủy: bỏ lựa chọn, đóng modal (không tạo đơn).
 * Lỗi tạo đơn (phòng vừa có người đặt, chưa cấu hình ngân hàng/QR...) hiện ngay trong modal để đổi lựa chọn thử lại.
 * Chỉ được render khi đang mở — mỗi lần mở là một lựa chọn mới (Panel dựng lại state riêng).
 */
export const ShortTermBookingModal: React.FC<Props> = ({ room, onClose, onBooked }) => {
  const { t } = useTranslation();
  const [selection, setSelection] = useState<BookingSelection | null>(null);
  const [quoteOk, setQuoteOk] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Esc = Hủy (trừ lúc đang tạo đơn); khoá cuộn trang nền khi modal mở.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !creating) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [creating, onClose]);

  const canConfirm = !!selection && quoteOk && !creating;

  const handleConfirm = async () => {
    if (!selection || creating) return;
    setCreating(true);
    setError('');
    try {
      const res: any = await bookingApi.createBooking(room.id, selection);
      const booking = res?.data || res;
      onBooked(booking.id);
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('booking.modalTitle')}
      // Chạm/nhấp nền mờ KHÔNG đóng modal — tránh mất lựa chọn do bấm nhầm; thoát bằng Hủy / Esc / nút đóng.
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg font-bold font-heading text-slate-900">{t('booking.modalTitle')}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={creating}
            aria-label={t('booking.modalCancel')}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pb-4 overflow-y-auto">
          <ShortTermBookingPanel
            key={room.id}
            room={room}
            onChange={(next, ok) => {
              setSelection(next);
              setQuoteOk(ok);
              // Đổi lựa chọn thì lỗi tạo đơn lần trước không còn đúng.
              setError('');
            }}
          />
        </div>

        {error && <p className="px-5 pb-3 text-xs font-semibold text-rose-500">{error}</p>}

        <div className="flex gap-3 px-5 py-4 border-t border-slate-100 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onClose}
            disabled={creating}
            className="flex-1 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            {t('booking.modalCancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="flex-1 py-3.5 rounded-2xl gradient-bg text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('roomDetail.creatingBooking')}</span>
              </>
            ) : (
              <span>{t('booking.modalConfirm')}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
