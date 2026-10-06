import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Seo } from '@/components/common/Seo';

// Trang liên hệ chỉ hiện thông tin liên hệ tĩnh — trước đây có form gửi tin nhưng không có backend nào
// nhận (chỉ giả lập thành công bằng setTimeout rồi xoá form), nên bỏ hẳn thay vì lừa người dùng là đã gửi.
export const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <Seo title={t('seo.contactTitle')} description={t('seo.contactDescription')} path="/contact" />
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <Mail className="w-4 h-4" />
          <span>{t('contact.badge')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          {t('contact.title')}
        </h1>
        <p className="text-slate-600 text-sm">
          {t('contact.subtitle')}
        </p>
      </div>

      {/* Contact Info */}
      <div className="max-w-2xl mx-auto">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-lg font-bold font-heading">{t('contact.infoTitle')}</h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-bold">{t('contact.mainOffice')}</strong>
                  <span className="text-xs text-slate-400">188 Nguyễn Xí, Phường 26, Bình Thạnh, TP. Hồ Chí Minh & Cầu Giấy, Hà Nội</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-bold">{t('contact.hotline')}</strong>
                  <a href="tel:0987654321" className="text-xs text-indigo-300 hover:underline">
                    0987.654.321
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-bold">{t('contact.emailSupport')}</strong>
                  <span className="text-xs text-slate-400">support@pimi.vn</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-800">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-bold">{t('contact.workingHours')}</strong>
                  <span className="text-xs text-slate-400">{t('contact.workingHoursValue')}</span>
                </div>
              </div>
            </div>
          </div>
      </div>

    </div>
  );
};
