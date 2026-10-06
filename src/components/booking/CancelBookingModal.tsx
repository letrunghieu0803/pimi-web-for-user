import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { bookingApi, CancelPreview } from '@/services/bookingApi';
import { useToast } from '@/context/ToastContext';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatVnd } from '@/utils/money';

interface CancelBookingModalProps {
  bookingId: string;
  roomName: string;
  onClose: () => void;
  /** Gọi sau khi huỷ ngay / gửi yêu cầu thành công để trang cha tải lại dữ liệu. */
  onDone: () => void;
}

const inputClass =
  'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500';

// Huỷ đặt phòng ngắn hạn. Đơn chưa thanh toán: huỷ ngay. Đơn đã thanh toán: gửi yêu cầu cho Pimi — mức hoàn hiển thị
// chỉ là GỢI Ý theo chính sách, Pimi xem xét và xác nhận mức chính thức rồi mới chuyển hoàn.
export const CancelBookingModal: React.FC<CancelBookingModalProps> = ({ bookingId, roomName, onClose, onDone }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [preview, setPreview] = useState<CancelPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  useEffect(() => {
    bookingApi
      .getCancelPreview(bookingId)
      .then((res: any) => setPreview(res?.data || res))
      .catch((err) => setLoadError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const isRequest = preview?.mode === 'REQUEST';
  const bankValid = !isRequest || (bankName.trim() && /^\d{4,25}$/.test(accountNumber.trim()) && accountHolder.trim());

  const submit = async () => {
    setSubmitting(true);
    try {
      await bookingApi.cancel(bookingId, {
        reason: reason.trim() || undefined,
        ...(isRequest
          ? {
              refundBankName: bankName.trim(),
              refundAccountNumber: accountNumber.trim(),
              refundAccountHolder: accountHolder.trim(),
            }
          : {}),
      });
      toast.success(t(isRequest ? 'bookingCancel.requestSent' : 'bookingCancel.cancelled'));
      onDone();
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">{t('bookingCancel.title')}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{roomName}</p>
          </div>
          <button onClick={onClose} disabled={submitting} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-10 flex justify-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : loadError || !preview ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
            {loadError || t('bookingCancel.loadError')}
          </div>
        ) : !preview.mode ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-800 flex gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{t('bookingCancel.cannotCancel')}</span>
          </div>
        ) : (
          <>
            {preview.mode === 'IMMEDIATE' ? (
              <p className="text-sm text-slate-600">{t('bookingCancel.immediateInfo')}</p>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase">{t('bookingCancel.suggestionTitle')}</p>
                  <p className="text-lg font-black text-indigo-700">
                    {t('bookingCancel.suggestionValue', {
                      percent: preview.suggestion?.percent ?? 0,
                      amount: formatVnd(preview.suggestion?.amount ?? 0),
                    })}
                  </p>
                  <p className="text-[11px] text-slate-500">{t('bookingCancel.suggestionNote')}</p>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5">
                  <p className="font-bold text-slate-800">{t('bookingCancel.policyTitle')}</p>
                  {preview.rules.map((r) => (
                    <p
                      key={r.key}
                      className={preview.suggestion?.policy === r.key ? 'font-bold text-indigo-700' : undefined}
                    >
                      • {t(`bookingCancel.rule.${r.key}`)}
                    </p>
                  ))}
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-800">{t('bookingCancel.bankTitle')}</p>
                  <input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder={t('bookingCancel.bankName')}
                    className={inputClass}
                  />
                  <input
                    value={accountNumber}
                    inputMode="numeric"
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder={t('bookingCancel.accountNumber')}
                    className={inputClass}
                  />
                  <input
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder={t('bookingCancel.accountHolder')}
                    className={inputClass}
                  />
                </div>
              </>
            )}

            <textarea
              value={reason}
              maxLength={500}
              rows={2}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('bookingCancel.reasonPlaceholder')}
              className={inputClass}
            />

            {isRequest && (
              <div className="flex gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{t('bookingCancel.reviewNote')}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
              >
                {t('bookingCancel.keepBooking')}
              </button>
              <button
                onClick={submit}
                disabled={submitting || !bankValid}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                {submitting
                  ? t('bookingCancel.sending')
                  : t(isRequest ? 'bookingCancel.sendRequest' : 'bookingCancel.confirmCancel')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
