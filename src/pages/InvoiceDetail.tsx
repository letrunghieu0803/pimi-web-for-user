import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Loader2, Receipt } from 'lucide-react';
import { invoiceApi, Invoice } from '@/services/invoiceApi';
import { getApiErrorMessage } from '@/utils/apiError';
import { Seo } from '@/components/common/Seo';

const formatMoney = (n: string | number) => `${Number(n).toLocaleString('vi-VN')} đ`;
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

// Trang xem hoá đơn KHÔNG cần đăng nhập — link "Xem chi tiết" gửi qua ZNS/email trỏ vào đây,
// đọc `token` từ query string (không phải body/header) vì đây là link người dùng bấm thẳng từ
// tin nhắn, không có cách nào gắn Authorization header. Hoạt động cho cả khách vãng lai (không
// có tài khoản Pimi) lẫn khách đã đăng nhập — không phân biệt, chỉ cần đúng token.
export const InvoiceDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id || !token) {
      setError(t('invoiceDetail.missingToken'));
      setLoading(false);
      return;
    }
    invoiceApi
      .getPublic(id, token)
      .then((res: any) => {
        setInvoice(res?.data || res);
        setError('');
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, token, t]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">{error || t('invoiceDetail.notFound')}</h2>
        <Link to="/" className="text-indigo-600 font-bold text-sm hover:underline">
          {t('invoiceDetail.backToHome')}
        </Link>
      </div>
    );
  }

  const isPending = invoice.status === 'PENDING_PAYMENT';
  const isPaidOrLater = ['PAID', 'PAYOUT_COMPLETED'].includes(invoice.status);
  const isOverdue = invoice.status === 'OVERDUE';
  const tenantName =
    invoice.rentUser?.lastName || invoice.guestTenantName || t('invoiceDetail.defaultTenantName');

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Seo title={t('invoiceDetail.title')} path={`/invoices/${id}`} noindex />

      <div className="glass-panel p-6 rounded-3xl shadow-xl border border-slate-200/90 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl gradient-bg flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 font-heading">
              {invoice.rentHouse.name} — {invoice.rentRoom.name}
            </h1>
            <p className="text-xs text-slate-500">
              {t('invoiceDetail.periodLabel')}: {formatDate(invoice.billingPeriodStart)} -{' '}
              {formatDate(invoice.billingPeriodEnd)}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          {t('invoiceDetail.tenantLabel')}: <span className="font-bold text-slate-800">{tenantName}</span>
        </div>

        <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 text-xs bg-slate-50">
            <span className="text-slate-600">{t('invoiceDetail.roomFeeLabel')}</span>
            <span className="font-bold text-slate-800">{formatMoney(invoice.roomRentAmount)}</span>
          </div>
          {invoice.lineItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-4 py-2.5 text-xs">
              <span className="text-slate-600">{item.name}</span>
              <span className="font-bold text-slate-800">{formatMoney(item.amount)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-3 bg-indigo-50">
            <span className="text-sm font-bold text-slate-900">{t('invoiceDetail.totalLabel')}</span>
            <span className="text-lg font-black text-indigo-600 font-heading">
              {formatMoney(invoice.totalAmount)}
            </span>
          </div>
        </div>

        {isPending && (
          <>
            <div className="text-center space-y-1">
              <p className="text-xs text-slate-500 font-semibold">
                {t('invoiceDetail.dueDateLabel')}: {formatDate(invoice.dueDate)}
              </p>
            </div>

            {invoice.qrImageBase64 && (
              <div className="flex justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <img src={invoice.qrImageBase64} alt="QR" className="w-56 h-56 object-contain" />
              </div>
            )}

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
              <p className="font-bold text-slate-800">{t('invoiceDetail.instructionTitle')}</p>
              <p>{t('invoiceDetail.instructionStep1')}</p>
              <p>{t('invoiceDetail.instructionStep2')}</p>
              <p className="text-[11px] text-slate-500 mt-2">{t('invoiceDetail.referenceLabel')}</p>
              <p className="font-bold text-slate-800">{invoice.qrPaymentCode}</p>
            </div>
          </>
        )}

        {isPaidOrLater && (
          <div className="text-center space-y-2 py-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-sm font-bold text-slate-900">{t('invoiceDetail.paidText')}</p>
          </div>
        )}

        {isOverdue && (
          <div className="text-center space-y-2 py-2">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <p className="text-sm font-bold text-slate-900">{t('invoiceDetail.overdueText')}</p>
          </div>
        )}

        {invoice.houseOwner?.phoneNumber && (
          <p className="text-center text-[11px] text-slate-400">
            {t('invoiceDetail.contactOwnerLabel')}: {invoice.houseOwner.phoneNumber}
          </p>
        )}
      </div>
    </div>
  );
};
