import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, ChevronDown, Calendar, ShieldCheck, FileText, PhoneCall } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const FAQS = t('faq.items', { returnObjects: true }) as FAQItem[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>{t('faq.badge')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
          {t('faq.title')}
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          {t('faq.subtitle')}
        </p>
      </div>

      {/* Accordion Container */}
      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-base font-heading hover:text-indigo-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold shrink-0">
                    {faq.category}
                  </span>
                  <span>{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Need More Support Box */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold font-heading">{t('faq.needHelpTitle')}</h3>
          <p className="text-xs text-slate-400 mt-1">{t('faq.needHelpDesc')}</p>
        </div>
        <a
          href="tel:0987654321"
          className="gradient-bg text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shrink-0 flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <PhoneCall className="w-4 h-4" />
          <span>{t('faq.hotlineLabel')}: 0987.654.321</span>
        </a>
      </div>

    </div>
  );
};
