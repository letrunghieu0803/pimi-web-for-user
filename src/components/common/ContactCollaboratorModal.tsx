import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, MessageCircle, UserRound } from 'lucide-react';
import { HouseCollaborator } from '@/services/collaboratorApi';

interface ContactCollaboratorModalProps {
  collaborators: HouseCollaborator[];
  onClose: () => void;
}

export const ContactCollaboratorModal: React.FC<ContactCollaboratorModalProps> = ({ collaborators, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="relative p-6 gradient-bg text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold font-heading">{t('contactCollaboratorModal.title')}</h2>
          <p className="text-xs text-indigo-100 mt-1">{t('contactCollaboratorModal.subtitle')}</p>
        </div>

        <div className="p-6 space-y-3">
          {collaborators.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-4">{t('contactCollaboratorModal.emptyText')}</p>
          )}
          {collaborators.map((c, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200"
            >
              <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <UserRound className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">{c.name}</h4>
                <p className="text-xs text-slate-500">{c.phone}</p>
              </div>
              {/* Kênh liên lạc chính thức là Zalo (admin cài đặt link cho từng cộng tác viên) —
                  không còn nút gọi điện trực tiếp. Ẩn hẳn nút nếu admin chưa cài đặt link. */}
              {c.zaloLink && (
                <a
                  href={c.zaloLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0068ff]/10 text-[#0068ff] hover:bg-[#0068ff]/20 border border-[#0068ff]/20 transition-colors font-bold text-xs shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('contactCollaboratorModal.zaloButton')}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
