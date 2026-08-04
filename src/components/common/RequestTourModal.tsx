import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Room, ViewingRequest } from '@/types';
import { roomApi } from '@/services/roomApi';
import { appointmentApi } from '@/services/appointmentApi';
import { useToast } from '@/context/ToastContext';
import { getApiErrorMessage } from '@/utils/apiError';
import { X, Calendar, Clock, User, Phone, Mail, FileText, Send, Building2, ShieldCheck } from 'lucide-react';

interface RequestTourModalProps {
  room: Room | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RequestTourModal: React.FC<RequestTourModalProps> = ({ room, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('09:00');
  const [notes, setNotes] = useState('');

  if (!room) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tenantName.trim()) {
      toast.warning(t('requestTourModal.toastNeedName'));
      return;
    }
    if (!tenantPhone.trim() || tenantPhone.length < 9) {
      toast.warning(t('requestTourModal.toastInvalidPhone'));
      return;
    }
    if (!preferredDate) {
      toast.warning(t('requestTourModal.toastNeedDate'));
      return;
    }

    setLoading(true);
    try {
      const fullNote = t('requestTourModal.noteTemplate', {
        date: preferredDate,
        time: preferredTime,
        extra: notes.trim() ? t('requestTourModal.noteExtra', { notes: notes.trim() }) : '',
      });
      await appointmentApi.createAppointment(
        room.roomGroupId
          ? { roomGroupId: room.roomGroupId, note: fullNote }
          : { rentRoomId: room.id, note: fullNote }
      );

      toast.success(t('requestTourModal.toastSuccess'));
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden my-8 transform transition-all">
        
        {/* Modal Header */}
        <div className="gradient-bg p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>{t('requestTourModal.badge')}</span>
          </div>
          <h2 className="text-xl font-bold font-heading">{t('requestTourModal.title')}</h2>
          <p className="text-xs text-indigo-100 mt-1">{t('requestTourModal.subtitle')}</p>
        </div>

        {/* Selected Room Banner */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
          <img
            src={room.images[0]}
            alt={room.name}
            className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">{room.name}</h4>
            <p className="text-xs text-indigo-600 font-semibold">{room.houseName} • {room.district}</p>
            <p className="text-xs font-bold text-emerald-600 mt-0.5">
              {(room.price / 1000000).toLocaleString('vi-VN')} {t('roomCard.million')}{t('roomCard.perMonth')}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Tenant Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('requestTourModal.tenantNameLabel')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={t('register.fullNamePlaceholder')}
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Tenant Phone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('register.phoneLabel')}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                placeholder={t('register.phonePlaceholder')}
                value={tenantPhone}
                onChange={(e) => setTenantPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('requestTourModal.dateLabel')}
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="date"
                  value={preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('requestTourModal.timeLabel')}
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                >
                  <option value="08:30">{t('requestTourModal.time0830')}</option>
                  <option value="10:00">{t('requestTourModal.time1000')}</option>
                  <option value="12:00">{t('requestTourModal.time1200')}</option>
                  <option value="14:30">{t('requestTourModal.time1430')}</option>
                  <option value="17:00">{t('requestTourModal.time1700')}</option>
                  <option value="18:30">{t('requestTourModal.time1830')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tenant Email Optional */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('requestTourModal.emailLabel')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="example@gmail.com"
                value={tenantEmail}
                onChange={(e) => setTenantEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('requestTourModal.notesLabel')}
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <textarea
                rows={2}
                placeholder={t('requestTourModal.notesPlaceholder')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Trust guarantee */}
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{t('requestTourModal.trustNote')}</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors"
            >
              {t('requestTourModal.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 rounded-xl gradient-bg text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? t('roomDetail.sending') : t('requestTourModal.submitButton')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
