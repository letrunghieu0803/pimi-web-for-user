import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, PhoneCall, UserRound } from 'lucide-react';
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
              <a
                href={`tel:${c.phone}`}
                className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
