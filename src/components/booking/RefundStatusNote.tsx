import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle2, XCircle, Wallet } from 'lucide-react';
import { BookingRefund } from '@/services/bookingApi';
import { formatVnd } from '@/utils/money';

// Trạng thái yêu cầu huỷ/hoàn tiền của 1 đơn — mức hoàn CHÍNH THỨC (approved*) chỉ có sau khi Pimi duyệt.
export const RefundStatusNote: React.FC<{ refund: BookingRefund }> = ({ refund }) => {
  const { t } = useTranslation();
  const approvedAmount = Number(refund.approvedAmount ?? 0);

  const config = {
    REQUESTED: {
      icon: <Clock className="w-4 h-4 text-amber-600 shrink-0" />,
      tone: 'bg-amber-50 border-amber-200 text-amber-800',
      text: t('bookingCancel.status.REQUESTED', {
        percent: refund.suggestedPercent ?? 0,
        amount: formatVnd(Number(refund.suggestedAmount ?? 0)),
      }),
    },
    APPROVED: {
      icon: <Wallet className="w-4 h-4 text-sky-600 shrink-0" />,
      tone: 'bg-sky-50 border-sky-200 text-sky-800',
      text: t('bookingCancel.status.APPROVED', {
        percent: refund.approvedPercent ?? 0,
        amount: formatVnd(approvedAmount),
      }),
    },
    COMPLETED: {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
      tone: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      text:
        approvedAmount > 0
          ? t('bookingCancel.status.COMPLETED', { amount: formatVnd(approvedAmount) })
          : t('bookingCancel.status.COMPLETED_NO_REFUND'),
    },
    REJECTED: {
      icon: <XCircle className="w-4 h-4 text-rose-600 shrink-0" />,
      tone: 'bg-rose-50 border-rose-200 text-rose-800',
      text: t('bookingCancel.status.REJECTED'),
    },
  }[refund.status];

  return (
    <div className={`p-3 rounded-2xl border text-xs flex gap-2 ${config.tone}`}>
      {config.icon}
      <div className="space-y-0.5">
        <p className="font-semibold">{config.text}</p>
        {refund.adminNote && <p className="opacity-80">{refund.adminNote}</p>}
        {refund.refundReference && (
          <p className="opacity-80">
            {t('bookingCancel.reference')}: {refund.refundReference}
          </p>
        )}
      </div>
    </div>
  );
};
