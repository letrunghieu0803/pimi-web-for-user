import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Flag, Send, Image as ImageIcon, Trash2 } from 'lucide-react';
import { roomReportApi, RoomReportReason } from '@/services/roomReportApi';
import { useToast } from '@/context/ToastContext';
import { getApiErrorMessage } from '@/utils/apiError';

const REASON_OPTIONS: RoomReportReason[] = [
  'MISLEADING_INFO',
  'SCAM_FRAUD',
  'ROOM_NOT_AS_DESCRIBED',
  'CONTRACT_VIOLATION',
  'UNSAFE_CONDITION',
  'HARASSMENT',
  'OTHER',
];

const MAX_IMAGES = 5;

interface ReportRoomModalProps {
  roomId: string;
  roomName?: string;
  onClose: () => void;
}

export const ReportRoomModal: React.FC<ReportRoomModalProps> = ({ roomId, roomName, onClose }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [reason, setReason] = useState<RoomReportReason>('MISLEADING_INFO');
  const [detail, setDetail] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...picked].slice(0, MAX_IMAGES));
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail.trim()) {
      toast.warning(t('reportRoomModal.toastNeedDetail'));
      return;
    }

    setSubmitting(true);
    try {
      // Upload ảnh TRƯỚC (nếu có) — thất bại 1 phần vẫn cho submit tiếp với các ảnh upload
      // thành công, tránh mất công gõ lại lý do/chi tiết chỉ vì 1 ảnh lỗi.
      const imageIds = await roomReportApi.uploadEvidenceImages(files);
      await roomReportApi.create({ rentRoomId: roomId, reason, detail: detail.trim(), imageIds });
      toast.success(t('reportRoomModal.toastSuccess'));
      onClose();
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden my-8">
        <div className="bg-rose-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-rose-100 text-xs font-bold uppercase tracking-wider mb-1">
            <Flag className="w-4 h-4" />
            <span>{t('reportRoomModal.badge')}</span>
          </div>
          <h2 className="text-xl font-bold font-heading">{t('reportRoomModal.title')}</h2>
          {roomName && <p className="text-xs text-rose-100 mt-1">{roomName}</p>}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('reportRoomModal.reasonLabel')}
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as RoomReportReason)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
            >
              {REASON_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {t(`reportRoomModal.reasonOption.${value}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('reportRoomModal.detailLabel')}
            </label>
            <textarea
              rows={4}
              maxLength={2000}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder={t('reportRoomModal.detailPlaceholder')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-rose-500 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('reportRoomModal.evidenceLabel')}
            </label>
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/60 text-white"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {files.length < MAX_IMAGES && (
                <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 cursor-pointer hover:border-rose-400 hover:text-rose-500 transition-colors">
                  <ImageIcon className="w-5 h-5" />
                  <input type="file" accept="image/*" multiple hidden onChange={handleAddFiles} />
                </label>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {t('reportRoomModal.evidenceHint', { max: MAX_IMAGES })}
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors"
            >
              {t('reportRoomModal.cancelButton')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? t('reportRoomModal.submitting') : t('reportRoomModal.submitButton')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
