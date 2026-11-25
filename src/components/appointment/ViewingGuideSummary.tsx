import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Clock, Phone } from 'lucide-react';
import { Appointment } from '@/services/appointmentApi';

interface ViewingGuideSummaryProps {
  status: Appointment['status'];
  rentHouse?: Appointment['rentHouse'];
  className?: string;
}

// "Hướng dẫn xem nhà" đơn giản chủ nhà cài ở toà nhà: liên hệ trước 30 phút, hướng dẫn tự nhập, SĐT.
// Chỉ hiện mục chủ nhà đã điền, và chỉ khi lịch đã được xác nhận — lịch còn chờ duyệt
// (PENDING_APPROVAL) chưa chắc được nhận nên chưa đưa hướng dẫn cho khách (cùng quy tắc guideContent).
export const ViewingGuideSummary: React.FC<ViewingGuideSummaryProps> = ({ status, rentHouse, className = '' }) => {
  const { t } = useTranslation();

  if (status !== 'CONFIRMED' && status !== 'COMPLETED') return null;
  const contactBefore = !!rentHouse?.viewingContactBeforeEnabled;
  const instructions = rentHouse?.viewingInstructions?.trim() || '';
  const phone = rentHouse?.viewingContactPhone?.trim() || '';
  if (!contactBefore && !instructions && !phone) return null;

  return (
    <div className={`bg-sky-50 border border-sky-200 p-4 rounded-2xl text-xs text-sky-900 space-y-2 ${className}`}>
      <span className="font-bold flex items-center gap-1.5 text-xs text-sky-900">
        <BookOpen className="w-3.5 h-3.5" /> {t('viewingGuideSummary.title')}
      </span>
      {contactBefore && (
        <p className="flex items-start gap-1.5">
          <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{t('viewingGuideSummary.contactBefore')}</span>
        </p>
      )}
      {phone && (
        <p className="flex items-start gap-1.5">
          <Phone className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>
            {t('viewingGuideSummary.phoneLabel')}:{' '}
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="font-bold underline">
              {phone}
            </a>
          </span>
        </p>
      )}
      {instructions && <p className="whitespace-pre-line break-words">{instructions}</p>}
    </div>
  );
};
