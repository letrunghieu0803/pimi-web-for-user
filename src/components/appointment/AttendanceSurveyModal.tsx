import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { X, Star, ClipboardCheck } from 'lucide-react';
import { appointmentSurveyApi, AppointmentSurveyQuestion } from '@/services/appointmentSurveyApi';
import { useToast } from '@/context/ToastContext';

interface AttendanceSurveyModalProps {
  submitting: boolean;
  onClose: () => void;
  onSubmit: (answers: Array<{ questionId: string; value: string | string[] }>) => void;
}

const STAR_VALUES = ['1', '2', '3', '4', '5'];

// Bộ câu hỏi hiện hành do admin quản lý (ADMIN-Pimi) — render theo đúng `type`: RATING = chọn sao
// 1-5, SINGLE_CHOICE/MULTIPLE_CHOICE = danh sách `options`, TEXT = ô nhập. Chỉ mở khi người thuê
// xác nhận "Đã tham gia" (xem TenantAppointments.tsx).
export const AttendanceSurveyModal: React.FC<AttendanceSurveyModalProps> = ({
  submitting,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ['appointmentSurveyActive'],
    queryFn: () => appointmentSurveyApi.getActive(),
  });
  const questions: AppointmentSurveyQuestion[] = data?.data || [];

  useEffect(() => {
    setAnswers({});
  }, []);

  const setSingleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const toggleMultipleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? (prev[questionId] as string[]) : [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [questionId]: next };
    });
  };

  // Khớp đúng ngữ nghĩa "có nội dung thật hay không" với isAnswerMeaningful phía backend
  // (AppointmentsService.confirmAttendance) — trước đây chỉ kiểm tra khác '' (không trim), nên 1
  // câu TEXT bắt buộc chỉ gõ toàn dấu cách vẫn "hợp lệ" ở FE rồi mới bị BE từ chối, hiện lỗi chung
  // chung không rõ trường nào sai.
  const isAnswerMeaningful = (value: string | string[] | undefined): boolean => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Bộ câu hỏi tải lỗi (isError) hoặc rỗng bất thường -> KHÔNG cho submit ngầm coi như "không có
    // câu bắt buộc nào" — trước đây `questions` rơi về [] khi query lỗi khiến validate luôn qua,
    // gửi surveyAnswers rỗng lên BE rồi nhận lỗi chung chung không rõ nguyên nhân thật.
    if (isError) {
      toast.error(t('attendanceSurveyModal.loadError'));
      return;
    }

    const requiredQuestions = questions.filter((q) => q.isRequired);
    const missing = requiredQuestions.some((q) => !isAnswerMeaningful(answers[q.id]));
    if (missing) {
      toast.warning(t('attendanceSurveyModal.validationError'));
      return;
    }

    const payload = Object.entries(answers)
      .filter(([, value]) => isAnswerMeaningful(value))
      .map(([questionId, value]) => ({ questionId, value }));
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-bg text-white flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{t('attendanceSurveyModal.title')}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-xs text-slate-500">{t('attendanceSurveyModal.subtitle')}</p>

          {isError && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {t('attendanceSurveyModal.loadError')}
            </p>
          )}

          {!isLoading &&
            questions.map((q) => (
              <div key={q.id}>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {q.label}
                  {q.isRequired && <span className="text-rose-500"> *</span>}
                </label>

                {q.type === 'RATING' && (
                  <div className="flex items-center gap-1.5">
                    {STAR_VALUES.map((star) => {
                      const isSelected = Number(answers[q.id] || 0) >= Number(star);
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setSingleAnswer(q.id, star)}
                          className="p-0.5"
                        >
                          <Star
                            className={`w-7 h-7 ${isSelected ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === 'SINGLE_CHOICE' && (
                  <div className="space-y-1.5">
                    {(q.options || []).map((opt) => {
                      const isSelected = answers[q.id] === opt;
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setSingleAnswer(q.id, opt)}
                          className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === 'MULTIPLE_CHOICE' && (
                  <div className="space-y-1.5">
                    {(q.options || []).map((opt) => {
                      const current = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
                      const isSelected = current.includes(opt);
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => toggleMultipleAnswer(q.id, opt)}
                          className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === 'TEXT' && (
                  <textarea
                    rows={3}
                    value={(answers[q.id] as string) || ''}
                    onChange={(e) => setSingleAnswer(q.id, e.target.value)}
                    placeholder={t('attendanceSurveyModal.textPlaceholder')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                )}
              </div>
            ))}

          {questions.length > 0 && (
            <p className="text-[11px] text-slate-400 italic">{t('attendanceSurveyModal.skipNote')}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100"
            >
              {t('attendanceSurveyModal.cancelButton')}
            </button>
            <button
              type="submit"
              disabled={submitting || isLoading || isError}
              className="px-6 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs shadow-md hover:scale-105 disabled:opacity-50 transition-all"
            >
              {submitting ? t('attendanceSurveyModal.submitting') : t('attendanceSurveyModal.submitButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
