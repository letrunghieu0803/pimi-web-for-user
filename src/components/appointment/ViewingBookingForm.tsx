import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, User, Users2 } from 'lucide-react';
import { AppointmentViewerType } from '@/services/appointmentApi';
import { useToast } from '@/context/ToastContext';

export interface ViewingBookingFormValues {
  viewerType: AppointmentViewerType;
  contactPhone: string;
  contactEmail: string;
  expectedOccupantsCount: number;
  expectedOccupantName: string;
  note?: string;
}

interface ViewingBookingFormProps {
  submitting: boolean;
  serverError?: string | null;
  defaultContactPhone?: string;
  defaultContactEmail?: string;
  defaultOccupantName?: string;
  onBack: () => void;
  onClose: () => void;
  onSubmit: (values: ViewingBookingFormValues) => void;
}

// Cùng pattern kiểm tra email đơn giản đang dùng ở các form khác trong app (không cần regex đầy
// đủ RFC — chỉ chặn lỗi gõ nhầm rõ ràng, server (class-validator IsEmail) vẫn là nguồn xác thực
// thật sự cuối cùng).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Bước 2/3 — form bắt buộc thu thập lead cho chủ nhà (viewerType/SĐT/email/số người ở dự
// kiến/tên người dự kiến ở), validate y hệt yêu cầu bắt buộc phía server (CreateAppointmentDto)
// để phản hồi nhanh, nhưng server luôn là nguồn xác thực cuối — lỗi 400 lúc submit vẫn được hiện
// nguyên văn qua `serverError` (vd slot vừa bị khoá bởi người khác giữa lúc chọn và lúc submit).
export const ViewingBookingForm: React.FC<ViewingBookingFormProps> = ({
  submitting,
  serverError,
  defaultContactPhone,
  defaultContactEmail,
  defaultOccupantName,
  onBack,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const toast = useToast();

  const [viewerType, setViewerType] = useState<AppointmentViewerType>('SELF');
  const [contactPhone, setContactPhone] = useState(defaultContactPhone || '');
  const [contactEmail, setContactEmail] = useState(defaultContactEmail || '');
  const [expectedOccupantsCount, setExpectedOccupantsCount] = useState('1');
  const [expectedOccupantName, setExpectedOccupantName] = useState(defaultOccupantName || '');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phone = contactPhone.trim();
    const email = contactEmail.trim();
    const name = expectedOccupantName.trim();
    const occupants = parseInt(expectedOccupantsCount, 10);

    if (!phone) {
      toast.warning(t('viewingBookingForm.toastNeedPhone'));
      return;
    }
    if (!email || !EMAIL_RE.test(email)) {
      toast.warning(t('viewingBookingForm.toastInvalidEmail'));
      return;
    }
    if (!name) {
      toast.warning(t('viewingBookingForm.toastNeedOccupantName'));
      return;
    }
    if (!Number.isFinite(occupants) || occupants < 1) {
      toast.warning(t('viewingBookingForm.toastInvalidOccupants'));
      return;
    }

    onSubmit({
      viewerType,
      contactPhone: phone,
      contactEmail: email,
      expectedOccupantsCount: occupants,
      expectedOccupantName: name,
      note: note.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base font-bold text-slate-900 font-heading">{t('viewingBookingForm.title')}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          <p className="text-xs text-slate-500">{t('viewingBookingForm.subtitle')}</p>

          {serverError && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {serverError}
            </p>
          )}

          {/* Người xem hộ / chính mình */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">{t('viewingBookingForm.viewerTypeLabel')}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setViewerType('SELF')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                  viewerType === 'SELF'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4" /> {t('viewingBookingForm.viewerTypeSelf')}
              </button>
              <button
                type="button"
                onClick={() => setViewerType('PROXY')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                  viewerType === 'PROXY'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Users2 className="w-4 h-4" /> {t('viewingBookingForm.viewerTypeProxy')}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('viewingBookingForm.phoneLabel')}</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder={t('viewingBookingForm.phonePlaceholder')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('viewingBookingForm.emailLabel')}</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder={t('viewingBookingForm.emailPlaceholder')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('viewingBookingForm.occupantNameLabel')}</label>
            <input
              type="text"
              value={expectedOccupantName}
              onChange={(e) => setExpectedOccupantName(e.target.value)}
              placeholder={t('viewingBookingForm.occupantNamePlaceholder')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('viewingBookingForm.occupantsCountLabel')}</label>
            <input
              type="number"
              min={1}
              step={1}
              value={expectedOccupantsCount}
              onChange={(e) => setExpectedOccupantsCount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('viewingBookingForm.noteLabel')}</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('viewingBookingForm.notePlaceholder')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100"
            >
              {t('viewingBookingForm.backButton')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs shadow-md hover:scale-105 disabled:opacity-50 transition-all"
            >
              {submitting ? t('viewingBookingForm.submitting') : t('viewingBookingForm.submitButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
